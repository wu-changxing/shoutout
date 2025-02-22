from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.video_service import video_service
from typing import Optional
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.post("/lip-sync/")
async def create_lip_sync_video(
    video: UploadFile = File(...),
    audio: UploadFile = File(...)
) -> dict:
    """
    Generate a lip-synced video from input video and audio files
    """
    # Validate file types
    if not video.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="Invalid video file type")
    
    if not audio.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="Invalid audio file type")

    # Generate lip-sync video
    output_path = await video_service.generate_lip_sync(video, audio)
    
    if not output_path or not os.path.exists(output_path):
        raise HTTPException(status_code=500, detail="Failed to generate video")

    return {
        "message": "Video generated successfully",
        "file_path": output_path
    }

@router.get("/download/{filename}")
async def download_video(filename: str):
    """
    Download a generated video file
    """
    file_path = os.path.join("generated_videos", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video not found")
        
    return FileResponse(
        file_path,
        media_type='video/mp4',
        filename=filename
    ) 