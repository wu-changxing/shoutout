import os
from pathlib import Path
from typing import Optional
from openai import OpenAI
import instructor
from pydantic import BaseModel, Field
from textwrap import dedent
from app.core.config import settings
from app.services.csv_service import CSVManager
import re

class MashService:
    def __init__(self):
        self.client = instructor.patch(OpenAI(api_key=settings.OPENAI_API_KEY))
        
        self.mash_csv_headers = [
          "id",
          "status",
          "script",
          "status",
          "audio_path",
          "video_path"  
        ]
        self.csv_manager = CSVManager(settings.SUMMARIES_CSV_PATH, self.mash_csv_headers)
        self.output_dir = Path(settings.OUTPUT_DIR)

        os.makedirs(self.output_dir, exist_ok=True)
    
    def locate_files_to_mash(self, row_id: int):
        import os
        import glob
        
 
        base_dir = "../../"  # You'll need to set this
        
     
        audio_pattern = os.path.join(base_dir, f"speech_*_row_{row_id}")
        video_pattern = os.path.join(base_dir, f"video_*_row_{row_id}")
        
        # Find matching files
        audio_matches = glob.glob(audio_pattern)
        video_matches = glob.glob(video_pattern)
        
        if not audio_matches or not video_matches:
            raise ValueError(f"Could not find matching audio/video files for row_id {row_id}")
        
        # Take the first match if multiple exist
        audio_path = audio_matches[0]
        video_path = video_matches[0]
        
        return audio_path, video_path

    def mash_audio_video(row_id: int) -> str:

        audio_path, video_path = locate_files_to_mash(row_id)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"combined_video_{row_id}_{timestamp}.mp4"
        
        cmd = [
            'ffmpeg',
            '-y',
            '-i', video_path,
            '-i', audio_path,
            '-c:v', 'copy',
            '-c:a', 'aac',
            output_filename
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            return output_filename
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"FFmpeg failed: {e.stderr.decode()}") from e