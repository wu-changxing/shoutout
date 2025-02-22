import os
from textwrap import dedent
import pathlib

import pdfplumber

import google.generativeai as genai
from google.genai import types

from pydantic import BaseModel, Field
from typing import Literal, List
import instructor

import pandas as pd
from io import StringIO
import hashlib


# Config
DEBUG = True

# Initialize the GenAI client
genai.configure(api_key="AIzaSyAzELcWD9Cs6X8r5Iz9JHHNpeF0Bew0jFE")
client = instructor.from_gemini(
  client=genai.GenerativeModel(
    model_name="models/gemini-1.5-flash-latest",
  ),
  mode=instructor.Mode.GEMINI_JSON,
)

def add_summary(
    topic: str,
    source: str,
    summary: str,
    people_involved: list[str]
):
  if DEBUG: print(f"** Adding summary (topic: {topic}, source: {source}...)... **")
  df = WORKSHEETS['summaries'].df

  new_data = {
      "id": 1 if df.empty else int(df['id'].astype(int).max()) + 1,  # sequential id
      "topic": topic,
      "source": source,
      "summary": summary,
      "people_involved": ", ".join(people_involved)
  }

  # Add hash
  hash_input = ''.join(str(new_data.get(field, '')) for field in ['topic', 'source', 'summary', 'people_involved'])
  md5_hash = hashlib.md5(hash_input.encode('utf-8')).hexdigest()
  new_data['hash'] = md5_hash

  if DEBUG: print(f"New data: {new_data}")
  new_df = pd.DataFrame([new_data])

  # Add to google sheet
  WORKSHEETS['summaries'].append_to_worksheet(new_df.values.tolist())


def process_pdf_pages(pdf_path):
  if DEBUG: print("Processing PDF pages...")
  PAGES_PER_CHUNK = 3
  with pdfplumber.open(pdf_path) as pdf:
    CHUNK = ""
    for i, page in enumerate(pdf.pages, start=1):
      if i < 15:
        if DEBUG: print(f"Skipping page {i} as it's the beginning...")
        continue
      if i > 100:
        print("Max loops exceeded. Exiting...")
        break
      print(f"Processing page {i}...")
      text = page.extract_text()
      if i % PAGES_PER_CHUNK != 0:
        CHUNK += text
      else:
        res = process_pdf_chunk(CHUNK).model_dump()
        print(res)
        if res["is_valuable"] == "LOTS":
          for summary in res["summaries"]:
            add_summary(
              topic=summary.get("topic", ""),
              source=pdf_path,
              summary=summary.get("summary", ""),
              people_involved=summary.get("related_personnel", "")
            )
        CHUNK = ""
  
class Summary(BaseModel):
  topic: str = Field(description="A high-level title summarising the topic of discussion.")
  summary: str = Field(description="The summary of the perspective of politicans. Maximum of 250 words.")
  key_words: List[str] = Field(description="A list of important keywords related to the discussion.")
  related_personnel: List[str] = Field(description="A list of names of the participants mentioned.")

class SummaryResponse(BaseModel):
  summaries: List[Summary] = Field(description="List of summaries of the perspectives of politicans.")
  is_valuable: Literal["LOTS", "SOME", "NONE"] = Field(description="Level of information that was found and summarised.")

def process_pdf_chunk(chunk):
  if DEBUG: print("Processing/summarising PDF chunk...")
  response = client.create(
    response_model=SummaryResponse,
    messages=[
      {
        "role": "developer",
        "content": dedent(f"""
          You are tasked with processing a transcript containing debates on important matters. Your objectives are:
            1. Only identify what politicans are saying and what their perspectives are.
            2. Summarise the politican's perspective in 250 words.
          
          If the chunk contains other information that is not relevant to a politican's perspective or opinion, then leave the summary list empty, and fill the is_valuable with NONE. 
        """),
      },
      {
        "role": "user",
        "content": dedent(f"""
          **Chunk of Documents**: {chunk}

          Can you extract and summarise key information from this chunk that would be of interest to the public?
        """),
      },
    ],
  )

  if DEBUG: print("FINISHED PROCESSING/SUMMARISING PDF CHUNK")
  return response