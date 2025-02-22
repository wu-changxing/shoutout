# Video Generation API Documentation

The Video Generation API provides endpoints for creating lip-synced videos using AI technology. It supports various input formats and provides options for customization.

## Base URL
```
http://localhost:8000/api/v1
```

## Endpoints

### Generate Lip-Sync Video
`POST /lip-sync`

Generate a lip-synced video from an input video and audio file.

#### Request Body (multipart/form-data)
```
file: File (video)
channelName: string
titleFormat: string
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | Input video file (MP4) |
| channelName | string | Yes | YouTube channel name |
| titleFormat | string | Yes | Format for video title |

#### Response
```json
{
    "file_path": "string",
    "status": "success"
}
```

### Download Generated Video
`GET /download/{filename}`

Download a generated video file.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| filename | string | Yes | Name of the generated video file |

#### Response
- Video file stream (application/octet-stream)

## File Requirements

### Input Video
- Format: MP4
- Maximum size: 100MB
- Resolution: 720p or higher recommended
- Duration: Up to 10 minutes

### Output Video
- Format: MP4
- Resolution: Same as input
- Audio: Synchronized with lip movements

## Error Responses

### Invalid File Format
```json
{
    "detail": "Invalid file format. Please upload an MP4 file."
}
```

### File Too Large
```json
{
    "detail": "File size exceeds maximum limit of 100MB"
}
```

### Processing Error
```json
{
    "detail": "Failed to process video: [error message]"
}
```

## Best Practices

1. **Input Video Quality**
   - Use clear, well-lit footage
   - Ensure face is clearly visible
   - Avoid rapid movements
   - Use high-quality audio

2. **File Preparation**
   - Compress large files
   - Remove unnecessary audio
   - Trim excess footage
   - Check video codec compatibility

3. **Processing Time**
   - Allow sufficient processing time
   - Consider video length
   - Monitor progress through status endpoint

## Limitations

- Maximum file size: 100MB
- Maximum video length: 10 minutes
- Supported format: MP4 only
- Face detection required
- Single face processing

## Examples

### cURL Request
```bash
curl -X POST "http://localhost:8000/api/v1/lip-sync" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@video.mp4" \
     -F "channelName=MyChannel" \
     -F "titleFormat={title} - AI Lip Sync"
```

### Python Request
```python
import requests

url = "http://localhost:8000/api/v1/lip-sync"
files = {
    'file': open('video.mp4', 'rb')
}
data = {
    'channelName': 'MyChannel',
    'titleFormat': '{title} - AI Lip Sync'
}

response = requests.post(url, files=files, data=data)
print(response.json())
```

## Troubleshooting

1. **Upload Issues**
   - Check file size
   - Verify file format
   - Ensure good network connection
   - Check server storage space

2. **Processing Issues**
   - Verify face visibility
   - Check audio quality
   - Monitor system resources
   - Review error logs

3. **Download Issues**
   - Verify file exists
   - Check permissions
   - Ensure sufficient storage
   - Monitor network stability 