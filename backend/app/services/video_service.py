import os
import fal_client
import requests
from typing import Optional
from fastapi import UploadFile
from app.core.config import settings

class VideoService:
    def __init__(self):
        fal_client.key = settings.FAL_KEY
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        os.makedirs(settings.OUTPUT_DIR, exist_ok=True)

    async def save_uploaded_file(self, file: UploadFile, filename: str) -> str:
        """Save uploaded file and return the file path"""
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        return file_path

    def upload_to_fal(self, file_path: str) -> Optional[str]:
        """Upload a file to fal.ai and return its URL"""
        try:
            url = fal_client.upload_file(file_path)
            print(f"Uploaded {file_path} successfully")
            return url
        except Exception as e:
            print(f"Failed to upload {file_path}: {str(e)}")
            return None

    def download_video(self, url: str, filename: str) -> bool:
        """Download a video from URL and save it"""
        try:
            response = requests.get(url)
            if response.status_code == 200:
                output_path = os.path.join(settings.OUTPUT_DIR, filename)
                with open(output_path, "wb") as f:
                    f.write(response.content)
                print(f"Downloaded: {filename}")
                return True
            else:
                print(f"Failed to download {filename}")
                print(f"Status code: {response.status_code}")
                return False
        except Exception as e:
            print(f"Error downloading video: {str(e)}")
            return False

    async def generate_lip_sync(
        self, 
        video_file: UploadFile, 
        audio_file: UploadFile
    ) -> Optional[str]:
        """Generate a lip-synced video from input video and audio files"""
        try:
            # Save uploaded files
            video_path = await self.save_uploaded_file(video_file, "input.mp4")
            audio_path = await self.save_uploaded_file(audio_file, "input.wav")

            # Upload files to fal.ai
            video_url = self.upload_to_fal(video_path)
            audio_url = self.upload_to_fal(audio_path)

            if not video_url or not audio_url:
                raise Exception("Failed to upload input files")

            # Generate lip-sync video
            result = fal_client.subscribe(
                "fal-ai/sync-lipsync",
                arguments={
                    "video_url": video_url,
                    "audio_url": audio_url,
                    "face_detection_threshold": 0.8,
                    "output_format": "mp4"
                },
                with_logs=True
            )

            # Extract video URL from response
            if isinstance(result, dict) and 'video' in result and isinstance(result['video'], dict) and 'url' in result['video']:
                output_url = result['video']['url']
                
                # Download the generated video
                if self.download_video(output_url, "lip_synced_output.mp4"):
                    return os.path.join(settings.OUTPUT_DIR, "lip_synced_output.mp4")
            
            raise Exception("Failed to generate or download video")

        except Exception as e:
            print(f"Error in generate_lip_sync: {str(e)}")
            return None

video_service = VideoService() 