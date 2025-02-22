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
        self.csv_manager = CSVManager(settings.CSV_PATH, ["FIX ME"])
        self.output_dir = Path(settings.AUDIO_OUTPUT_DIR)
        os.makedirs(self.output_dir, exist_ok=True)

    async def generate_script(self, input_text: str) -> TranscriptResponse:
        """Generate a TikTok-optimized script from input text"""
        response = await self.client.chat.completions.create(
            model="gpt-4",
            response_model=TranscriptResponse,
            messages=[
                {
                    "role": "system",
                    "content": dedent("""
                        You are a specialized TikTok Audio Generator AI. Your role is to transform text into viral-worthy audio clips. Your objectives are:
                        1. Analyze input text and identify highly engaging segments
                        2. Create short, punchy soundbites (7-15 seconds)
                        3. For each potential audio clip, provide:
                            - soundbite: The exact text to be converted to audio
                            - duration: Recommended length in seconds
                            - tone: Speaking style and emotional delivery
                            - music: Suggested background music genre/mood
                            - hook_elements: What makes it catchy and viral-worthy
                            - timing_markers: Where key phrases should be emphasized
                        4. Additional elements to specify:
                            - trending_potential: How well it aligns with current TikTok trends
                            - target_audience: Primary demographic appeal
                            - hashtag_suggestions: Relevant TikTok hashtags
                    """)
                },
                {
                    "role": "user",
                    "content": f"Generate TikTok-optimized audio recommendations from this text: {input_text}"
                }
            ]
        )
        return response

    async def generate_audio(self, script: TranscriptResponse, voice_type: str = "nova") -> str:
        """Generate audio from the script using OpenAI's text-to-speech"""
        audio_file = self.output_dir / f"speech_{hash(script.soundbite)}.mp3"
        
        response = await self.client.audio.speech.create(
            model="tts-1",
            voice=voice_type,
            input=script.soundbite
        )

        # Save the audio file
        with open(audio_file, "wb") as f:
            f.write(response.content)

        return str(audio_file)

    async def process_text(self, input_text: str, voice_type: str = "nova") -> dict:
        """Process text through script generation and audio generation"""
        # Add to CSV as pending
        row_id = self.csv_manager.append_row({
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
            audio_path = await self.generate_audio(script, voice_type)
            
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
            # Update CSV with error status
            self.csv_manager.update_row(row_id, {
                "status": f"error: {str(e)}"
            })
            raise e

    async def get_audio_status(self, row_id: int) -> Optional[dict]:
        """Get the status of an audio generation request"""
        return self.csv_manager.get_row(row_id)

audio_service = AudioService() 