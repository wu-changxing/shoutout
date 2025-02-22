# AI Video Generator Backend

This is the FastAPI backend for the AI Video Generator application. It provides endpoints for generating lip-synced videos using fal.ai's sync-lipsync model.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
FAL_KEY=your_fal_ai_key_here
```

4. Create necessary directories:
```bash
mkdir uploads generated_videos
```

## Running the Server

Start the FastAPI server:
```bash
python run.py
```

The server will run at `http://localhost:8000`

## API Endpoints

### Generate Lip-Sync Video
- **URL**: `/api/v1/lip-sync/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `video`: Video file (MP4)
  - `audio`: Audio file (WAV)
- **Response**: JSON with generated video path

### Download Video
- **URL**: `/api/v1/download/{filename}`
- **Method**: `GET`
- **Response**: Video file download

## Directory Structure
```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── video_router.py
│   ├── core/
│   │   └── config.py
│   ├── services/
│   │   └── video_service.py
│   └── main.py
├── uploads/
├── generated_videos/
├── requirements.txt
├── run.py
└── README.md
``` 