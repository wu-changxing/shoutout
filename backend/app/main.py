from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import video_router, audio_router
from app.core.config import settings

app = FastAPI(
    title="AI Video Generator API",
    description="API for generating lip-synced videos and TikTok audio from content",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(video_router.router, prefix="/api/v1", tags=["videos"])
app.include_router(audio_router.router, prefix="/api/v1/audio", tags=["audio"]) 