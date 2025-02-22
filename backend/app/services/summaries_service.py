import google.generativeai as genai
import instructor
import pdfplumber
from pydantic import BaseModel, Field
from typing import Literal, List
from textwrap import dedent

from app.core.config import settings
from app.services.csv_service import CSVManager

genai.configure(api_key=settings.GEMINI_API_KEY)

class Summary(BaseModel):
  topic: str = Field(description="A high-level title summarising the topic of discussion.")
  summary: str = Field(description="The summary of the perspective of politicans. Maximum of 250 words.")
  key_words: List[str] = Field(description="A list of important keywords related to the discussion.")
  related_personnel: List[str] = Field(description="A list of names of the participants mentioned.")

class SummaryResponse(BaseModel):
  summaries: List[Summary] = Field(description="List of summaries of the perspectives of politicans.")
  is_valuable: Literal["GOOD", "BAD", "NONE", "UNSURE"] = Field(description="Level of information that was found and summarised.")

class SummariesService:
  def __init__(self):
    # Initialise LLM client
    self.llm_client = instructor.from_gemini(
      client=genai.GenerativeModel(
        model_name="models/gemini-1.5-flash-latest",
      ),
      mode=instructor.Mode.GEMINI_JSON,
    )
    
    # Initialise local data storage
    self.headers = [
      "id",
      "country",
      "source",
      "pages",
      "topic",
      "summary",
      "people_involved",
    ]
    self.csv_client = CSVManager(settings.SUMMARIES_CSV_PATH, self.headers)
    
  def process_pdf_document(self, pdf_path):
    """Process a Government PDF document and extract summaries"""
    
    # Break PDF pages into chunks of text and then process each chunk w/ LLM
    PAGES_PER_CHUNK = 4
    
    if settings.DEBUG: print("** Processing PDF document...")
    with pdfplumber.open(pdf_path) as pdf:
      CHUNK = ""
      CURR_PAGE_NUMBERS = []
      
      if settings.DEBUG: print("** Processing PDF pages...")
      for i, page in enumerate(pdf.pages, start=1):
        if settings.DEBUG: print(f"Processing page {i}...")
        # Skip the first 15 pages as they're usually the introduction
        if i < 15:
          if settings.DEBUG: print(f"Skipping page {i} as it's the beginning...")
          continue
        
        # Extract text from page
        text = page.extract_text()
        
        # If we haven't yet made a chunk and this is not the last page
        print(f"Curr page numbers: {CURR_PAGE_NUMBERS}")
        if len(CURR_PAGE_NUMBERS) < PAGES_PER_CHUNK and i != len(pdf.pages) - 1:
          CHUNK += text
          CURR_PAGE_NUMBERS.append(i)
          if settings.DEBUG: print(f"Chunked")
          continue
        
        # If we have a chunk, process it
        if settings.DEBUG: print("** Processing PDF chunk...")
        response = self.process_pdf_chunk(CHUNK)
        if settings.DEBUG: print(f"Processed chunk!")
        
        json = response.model_dump()
        if json["is_valuable"] == "GOOD":
          new_summaries = [
            {
              "country": "Australia",
              "source": pdf_path,
              "pages": ",".join([str(page) for page in CURR_PAGE_NUMBERS]),
              "topic": summary.topic,
              "summary": summary.summary,
              "people_involved": summary.related_personnel,
            } for summary in response.summaries
          ]
          if settings.DEBUG: print(f"New summaries len: {len(new_summaries)}")
          self.csv_client.append_rows(new_summaries)
        
        # Reset chunk and page numbers
        CHUNK = ""
        CURR_PAGE_NUMBERS = []
      
  def process_pdf_chunk(self, chunk: str) -> SummaryResponse:
    """Process a PDF chunk and return a SummaryResponse"""
    
    print("** Processing/summarising PDF chunk...")
    response = self.llm_client.create(
      response_model=SummaryResponse,
      messages=[
        {
          "role": "developer",
          "content": dedent(f"""
            You are an unbias, expert news reporter.                
                            
            You are tasked with processing government documents containing debates on important matters from politicians. Your objectives are:
              1. Identify the key talking points and debates that are relevant to the public.
              2. Ensure to keep summaries factual, accurate, and concise.
              3. Ensure to include the name of the politician when summarising their opinion.
              4. Ensure summaries a maximum for 300 words.
              5. Do not focus too much on that the 'Speaker' says, but more on the senators, MPs, and other politicians.
              6. Ensure to include the party the politican represents.
            
            If the chunk contains other information that is not relevant to a politican's perspective or opinion, then leave the summary list empty, and fill the is_valuable with NONE. 
      
            If the summarises are good, relevant to the public, and factual, then fill the is_valuable with GOOD. If the summaries are not good, relevant to the public, or factual, then fill the is_valuable with BAD.
          """),
        },
        {
          "role": "user",
          "content": dedent(f"""
            WARNING: Many of the spaces are missing from the text, though, the words have just been concatenated together, but the meaning is the same.
            
            **The Day the Document refers too**: "04/02/2025 (dd/mm/yyyy)"
                            
            **Chunk of Documents**: {chunk}
          """),
        },
      ],
    )

    print("** Finished processing chunk")
    return response