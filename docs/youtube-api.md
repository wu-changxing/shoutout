# YouTube API Documentation

The YouTube API provides endpoints for uploading and managing videos on YouTube. This integration allows for direct publishing of generated videos to YouTube channels.

## Base URL
```
http://localhost:8000/api/v1/youtube
```

## Authentication

1. Create a Google Cloud Project and enable YouTube Data API v3
2. Create OAuth 2.0 credentials
3. Download credentials as `client_secrets.json`
4. Place `client_secrets.json` in the backend directory
5. First request will trigger OAuth flow in browser

## Endpoints

### Upload Video
`POST /upload`

Upload a video to YouTube with specified metadata and privacy settings.

#### Request Body
```json
{
    "file_path": "string",
    "title": "string",
    "description": "string",
    "privacy_status": "string",
    "tags": ["string"],
    "category_id": "string",
    "language": "string"
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| file_path | string | Yes | - | Path to the video file |
| title | string | Yes | - | Video title |
| description | string | Yes | - | Video description |
| privacy_status | string | No | "public" | One of: "public", "unlisted", "private" |
| tags | array | No | ["AI Generated", "Summary", "Educational"] | List of video tags |
| category_id | string | No | "22" | YouTube category ID (22 = People & Blogs) |
| language | string | No | "en" | Video language code |

#### Response
```json
{
    "video_id": "string",
    "video_url": "string",
    "privacy_status": "string",
    "title": "string"
}
```

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/v1/youtube/upload" \
     -H "Content-Type: application/json" \
     -d '{
         "file_path": "/path/to/video.mp4",
         "title": "My Amazing AI Generated Video",
         "description": "This is an AI-generated video that summarizes important content.",
         "privacy_status": "public",
         "tags": ["AI", "Educational", "Summary"],
         "category_id": "22",
         "language": "en"
     }'
```

#### Example Response
```json
{
    "video_id": "abc123xyz",
    "video_url": "https://www.youtube.com/watch?v=abc123xyz",
    "privacy_status": "public",
    "title": "My Amazing AI Generated Video"
}
```

## Video Categories

Common YouTube category IDs:
- 1: Film & Animation
- 2: Autos & Vehicles
- 10: Music
- 15: Pets & Animals
- 17: Sports
- 19: Travel & Events
- 20: Gaming
- 22: People & Blogs
- 23: Comedy
- 24: Entertainment
- 25: News & Politics
- 26: Howto & Style
- 27: Education
- 28: Science & Technology
- 29: Nonprofits & Activism

## Error Responses

### File Not Found
```json
{
    "detail": "Video file not found at path: /path/to/video.mp4"
}
```

### Invalid Privacy Status
```json
{
    "detail": "Invalid privacy status. Must be one of: public, unlisted, private"
}
```

### Upload Failed
```json
{
    "detail": "Failed to upload video: [error message]"
}
```

## Best Practices

1. **File Paths**
   - Use absolute paths
   - Ensure file exists before upload
   - Verify file is a valid video format

2. **Video Metadata**
   - Use descriptive titles (max 100 characters)
   - Write detailed descriptions
   - Add relevant tags (max 500 characters total)
   - Choose appropriate category

3. **Privacy Settings**
   - Start with "private" for testing
   - Use "unlisted" for sharing without public listing
   - Switch to "public" when ready for general audience

4. **Performance**
   - Videos are uploaded in 1MB chunks
   - Large files may take several minutes
   - Keep connection stable during upload

## Limitations

- Maximum file size: 128GB
- Maximum video length: 12 hours
- Maximum title length: 100 characters
- Maximum description length: 5000 characters
- Maximum tags: 500 characters total
- Rate limits: Based on YouTube API quotas

## Troubleshooting

1. **Authentication Issues**
   - Verify `client_secrets.json` is present
   - Check file permissions
   - Ensure OAuth flow is completed

2. **Upload Failures**
   - Check file exists and is readable
   - Verify file format is supported
   - Ensure sufficient disk space
   - Check network connection

3. **Quota Issues**
   - Monitor API usage
   - Check quota limits in Google Cloud Console
   - Consider implementing rate limiting 