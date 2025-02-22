# AI Video Generator API Documentation

This API provides a comprehensive suite of tools for generating, managing, and publishing AI-generated videos. The API is built with FastAPI and provides endpoints for video generation, audio processing, summarization, and YouTube integration.

## Base URL

```
http://localhost:8000/api/v1
```

## Available Endpoints

### Video Generation
- [Video Generation API](./video-api.md)
  - Generate lip-synced videos
  - Process video files
  - Download generated videos

### Audio Processing
- [Audio API](./audio-api.md)
  - Generate TTS audio
  - Process audio files
  - Manage audio generations

### Content Summarization
- [Summary API](./summary-api.md)
  - Generate content summaries
  - Process PDF documents
  - Manage summaries

### YouTube Integration
- [YouTube API](./youtube-api.md)
  - Upload videos to YouTube
  - Manage video metadata
  - Control privacy settings

## Authentication

The API uses environment variables for various service authentications:
- `FAL_KEY`: For FAL AI services
- `OPENAI_API_KEY`: For OpenAI services
- `GEMINI_API_KEY`: For Google Gemini AI
- YouTube OAuth credentials in `client_secrets.json`

## Common Response Format

All API responses follow a consistent format:

```json
{
    "success": true,
    "data": {
        // Response data specific to each endpoint
    },
    "error": null  // Error message if any
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include detailed messages:
```json
{
    "success": false,
    "data": null,
    "error": {
        "message": "Detailed error message",
        "code": "ERROR_CODE"
    }
}
```

## Rate Limiting

- Default rate limit: 100 requests per minute
- File upload limit: 100MB per file
- Concurrent processing limit: 5 requests

## Getting Started

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Run the server:
```bash
cd backend
python run.py
```

4. Access the API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Additional Resources
- [API Examples](./examples.md)
- [Deployment Guide](./deployment.md)
- [Troubleshooting](./troubleshooting.md) 