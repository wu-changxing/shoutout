from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from app.services.youtube_service import youtube_service
from app.core.config import settings
import os

router = APIRouter()

class YouTubeUploadRequest(BaseModel):
    file_path: str
    title: str
    description: str
    privacy_status: str = Field(default="public", description="Video privacy status: public, unlisted, or private")
    tags: Optional[List[str]] = Field(default=None, description="List of video tags")
    category_id: str = Field(default="22", description="YouTube category ID (22 = People & Blogs)")
    language: str = Field(default="en", description="Video language code")

    class Config:
        schema_extra = {
            "example": {
                "file_path": "/path/to/video.mp4",
                "title": "My Amazing AI Generated Video",
                "description": "This is an AI-generated video that summarizes important content.",
                "privacy_status": "public",
                "tags": ["AI", "Educational", "Summary"],
                "category_id": "22",
                "language": "en"
            }
        }

@router.post("/upload", response_model=dict)
async def upload_to_youtube(request: YouTubeUploadRequest):
    """
    Upload a video to YouTube with specified settings
    
    The video will be public by default, but you can set it to 'unlisted' or 'private'.
    You can also specify tags, category, and language.
    
    Returns:
        dict: Contains YouTube video ID and URL
    """
    try:
        # Verify file exists
        if not os.path.exists(request.file_path):
            raise HTTPException(
                status_code=404,
                detail=f"Video file not found at path: {request.file_path}"
            )

        # Validate privacy status
        valid_privacy_statuses = ["public", "unlisted", "private"]
        if request.privacy_status not in valid_privacy_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid privacy status. Must be one of: {', '.join(valid_privacy_statuses)}"
            )

        # Upload to YouTube
        video_id = youtube_service.upload_video(
            file_path=request.file_path,
            title=request.title,
            description=request.description,
            privacy_status=request.privacy_status,
            tags=request.tags,
            category_id=request.category_id,
            language=request.language
        )

        video_url = f"https://www.youtube.com/watch?v={video_id}"
        
        if settings.DEBUG:
            print(f"Successfully uploaded video: {video_url}")

        return {
            "video_id": video_id,
            "video_url": video_url,
            "privacy_status": request.privacy_status,
            "title": request.title
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 