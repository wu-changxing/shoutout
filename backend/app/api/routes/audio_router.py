from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict
from app.services.audio_service import audio_service
from fastapi.responses import FileResponse
import os

router = APIRouter()

class AudioGenerationRequest(BaseModel):
    input_text: str
    voice_type: Optional[str] = "nova"

class AudioGenerationResponse(BaseModel):
    id: int
    status: str
    audio_path: Optional[str] = None
    script: Optional[dict] = None

@router.post("/generate/audio", response_model=AudioGenerationResponse)
async def generate_audio(request: AudioGenerationRequest, background_tasks: BackgroundTasks):
    """
    Generate audio from input text.
    This is an async operation - use the status endpoint to check progress.
    """
    try:
        result = await audio_service.process_text(
            input_text=request.input_text,
            voice_type=request.voice_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{generation_id}", response_model=AudioGenerationResponse)
async def get_generation_status(generation_id: int):
    """Get the status of an audio generation request"""
    result = await audio_service.get_audio_status(generation_id)
    if not result:
        raise HTTPException(status_code=404, detail="Generation not found")
    return result

@router.get("/download/{generation_id}")
async def download_audio(generation_id: int):
    """Download the generated audio file"""
    result = await audio_service.get_audio_status(generation_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Generation not found")
        
    if not result.get("audio_path"):
        raise HTTPException(status_code=404, detail="Audio not yet generated")
        
    audio_path = result["audio_path"]
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
        
    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=f"generated_audio_{generation_id}.mp3"
    ) 