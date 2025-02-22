from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Video Generator"
    API_V1_STR: str = "/api/v1"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # File Upload Settings
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    # FAL AI Settings
    FAL_KEY: str = os.getenv("FAL_KEY", "")
    
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Output Settings
    OUTPUT_DIR: str = "generated_videos"
    AUDIO_OUTPUT_DIR: str = "generated_audio"
    
    # CSV Settings
    CSV_PATH: str = "data/audio_generations.csv"
    
    class Config:
        case_sensitive = True

settings = Settings() 