import os
from pathlib import Path
from typing import Optional
from openai import OpenAI
import instructor
from pydantic import BaseModel, Field
from textwrap import dedent
from app.core.config import settings
from app.services.csv_service import CSVManager

class TranscriptResponse(BaseModel):
    """Model for the script generation response"""
    soundbite: str = Field(description="The exact text to be converted to audio")
    duration: int = Field(description="Recommended length in seconds")
    tone: str = Field(description="Speaking style and emotional delivery")
    music: str = Field(description="Suggested background music genre/mood")
    hook_elements: list[str] = Field(description="What makes it catchy and viral-worthy")
    timing_markers: list[str] = Field(description="Where key phrases should be emphasized")
    trending_potential: int = Field(description="Score from 1-10 on alignment with current trends")
    target_audience: str = Field(description="Primary demographic appeal")
    hashtags: list[str] = Field(description="Relevant TikTok hashtags")

class AudioService:
    def __init__(self):
        self.client = instructor.patch(OpenAI(api_key=settings.OPENAI_API_KEY))
        
        self.audio_csv_headers = [
          "id",
          "input_text",
          "status",
          "voice_type",
          "script",
          "status",
          "audio_path",  
        ]
        self.csv_manager = CSVManager(settings.AUDIO_CSV_PATH, self.audio_csv_headers)
        self.output_dir = Path(settings.AUDIO_OUTPUT_DIR)
        os.makedirs(self.output_dir, exist_ok=True)

    async def generate_script(self, input_text: str) -> TranscriptResponse:
        """Generate a TikTok-optimized script from input text"""
        
        if settings.DEBUG: print(f"** Generating script for input text...")
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            response_model=TranscriptResponse,
            messages=[
                {
                  "role": "system",
                "content": "You are a specialized TikTok Audio Script Generator AI. Your purpose is to transform text into engaging, viral-worthy audio scripts optimized for TikTok's format. You must follow a specific format and always maintain high standards for creating attention-grabbing, shareable content."
                },
                {
                  "role": "system",
                "content": "Core Requirements:\n1. Always identify hooks that will grab attention in the first 3 seconds\n2. Create an amazing script for each input\n3. Each script must be at least 7-15 seconds long\n4. Follow the specified JSON output format exactly\n5. Focus on emotional impact and shareability"
                },
                  {
                    "role": "user",
                  "content": "Please provide TikTok-optimized audio scripts following this format for any input text I provide."
                },
                {
                  "role": "assistant",
                  "content": "I understand. For each text input I will generate an optimized and engaging script to be read out loud verbatim."
                },
                {
                    "role": "user",
                    "content": f"Generate TikTok-optimized audio recommendations from this text: {input_text}"
                }
            ]
        )
        
        if settings.DEBUG: print(f"** Finished generating script!")
        return response

    async def generate_audio(self, script: TranscriptResponse, voice_type: str = "nova") -> str:
        """Generate audio from the script using OpenAI's text-to-speech"""
        
        if settings.DEBUG: print(f"** Generating audio for script...")
        audio_file = self.output_dir / f"speech_{hash(script.soundbite)}.mp3"
        if settings.DEBUG: print(f"** Audio file path: {audio_file}")
        
        if settings.DEBUG: print(f"** Generating audio...")
        response = self.client.audio.speech.create(
            model="tts-1",
            voice=voice_type,
            input=script.soundbite
        )
        if settings.DEBUG: print(f"** Finished generating audio!")

        # Save the audio file
        if settings.DEBUG: print(f"** Saving audio file...")
        with open(audio_file, "wb") as f:
            f.write(response.content)
        if settings.DEBUG: print(f"** Finished saving audio file!")

        return str(audio_file)

    async def process_text(self, input_text: str, voice_type: str = "nova") -> dict:
        """Process text through script generation and audio generation"""
        
        if settings.DEBUG: print(f"** Processing text...")
        # Add to CSV as pending
        row_id = self.csv_manager.append_rows({
            "input_text": input_text,
            "status": "pending",
            "voice_type": voice_type
        })

        try:
            # Generate script
            script = await self.generate_script(input_text)
            
            # Update CSV with script
            self.csv_manager.update_row(row_id, {
                "script": script.model_dump_json(),
                "status": "script_generated"
            })

            # Generate audio
            if settings.DEBUG: print(f"** Generating audio...")
            audio_path = await self.generate_audio(script, voice_type)
            if settings.DEBUG: print(f"** Finished generating audio!")
            
            # Update CSV with audio path
            self.csv_manager.update_row(row_id, {
                "audio_path": audio_path,
                "status": "completed"
            })

            return {
                "id": row_id,
                "script": script.model_dump(),
                "audio_path": audio_path,
                "status": "completed"
            }

        except Exception as e:
            if settings.DEBUG: print(f"** Error processing text: {str(e)}")
            # Update CSV with error status
            self.csv_manager.update_row(row_id, {
                "status": f"error: {str(e)}"
            })
            raise e

    async def get_audio_status(self, row_id: int) -> Optional[dict]:
        """Get the status of an audio generation request"""
        return self.csv_manager.get_row(row_id)

audio_service = AudioService() 