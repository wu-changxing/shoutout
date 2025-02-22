# API Usage Examples

This document provides practical examples of using the API endpoints together to create and publish AI-generated videos.

## Complete Workflow Example

### 1. Generate a Video Summary

First, let's generate a summary from a PDF document:

```python
import requests

# 1. Upload PDF and generate summary
def generate_summary(pdf_path):
    url = "http://localhost:8000/api/v1/summaries/generate"
    files = {
        'file': open(pdf_path, 'rb')
    }
    response = requests.post(url, files=files)
    return response.json()

summary = generate_summary('document.pdf')
print(f"Generated summary: {summary['text']}")
```

### 2. Generate Audio from Summary

Next, convert the summary to speech:

```python
def generate_audio(text):
    url = "http://localhost:8000/api/v1/audio/generate"
    data = {
        "text": text,
        "voice": "alloy"  # OpenAI voice option
    }
    response = requests.post(url, json=data)
    return response.json()

audio = generate_audio(summary['text'])
print(f"Audio generated: {audio['file_path']}")
```

### 3. Generate Lip-Sync Video

Create a lip-synced video with the generated audio:

```python
def generate_video(video_path, channel_name):
    url = "http://localhost:8000/api/v1/lip-sync"
    files = {
        'file': open(video_path, 'rb')
    }
    data = {
        'channelName': channel_name,
        'titleFormat': '{title} - AI Summary'
    }
    response = requests.post(url, files=files, data=data)
    return response.json()

video = generate_video('input_video.mp4', 'MyChannel')
print(f"Video generated: {video['file_path']}")
```

### 4. Upload to YouTube

Finally, upload the generated video to YouTube:

```python
def upload_to_youtube(video_path, title, description):
    url = "http://localhost:8000/api/v1/youtube/upload"
    data = {
        "file_path": video_path,
        "title": title,
        "description": description,
        "privacy_status": "public",
        "tags": ["AI", "Summary", "Educational"],
        "category_id": "27",  # Education
        "language": "en"
    }
    response = requests.post(url, json=data)
    return response.json()

youtube_video = upload_to_youtube(
    video['file_path'],
    "Understanding AI - Summary",
    "An AI-generated summary of key concepts in artificial intelligence."
)
print(f"Video uploaded: {youtube_video['video_url']}")
```

## Complete Script

Here's a complete script that puts it all together:

```python
import requests
import time

class AIVideoGenerator:
    def __init__(self, base_url="http://localhost:8000/api/v1"):
        self.base_url = base_url

    def generate_summary(self, pdf_path):
        url = f"{self.base_url}/summaries/generate"
        files = {'file': open(pdf_path, 'rb')}
        response = requests.post(url, files=files)
        return response.json()

    def generate_audio(self, text):
        url = f"{self.base_url}/audio/generate"
        data = {"text": text, "voice": "alloy"}
        response = requests.post(url, json=data)
        return response.json()

    def generate_video(self, video_path, channel_name):
        url = f"{self.base_url}/lip-sync"
        files = {'file': open(video_path, 'rb')}
        data = {
            'channelName': channel_name,
            'titleFormat': '{title} - AI Summary'
        }
        response = requests.post(url, files=files, data=data)
        return response.json()

    def upload_to_youtube(self, video_path, title, description):
        url = f"{self.base_url}/youtube/upload"
        data = {
            "file_path": video_path,
            "title": title,
            "description": description,
            "privacy_status": "public",
            "tags": ["AI", "Summary", "Educational"],
            "category_id": "27",
            "language": "en"
        }
        response = requests.post(url, json=data)
        return response.json()

    def process_document(self, pdf_path, video_path, channel_name):
        try:
            # 1. Generate Summary
            print("Generating summary...")
            summary = self.generate_summary(pdf_path)
            time.sleep(2)  # Allow processing time

            # 2. Generate Audio
            print("Generating audio...")
            audio = self.generate_audio(summary['text'])
            time.sleep(2)

            # 3. Generate Video
            print("Generating video...")
            video = self.generate_video(video_path, channel_name)
            time.sleep(5)  # Video processing takes longer

            # 4. Upload to YouTube
            print("Uploading to YouTube...")
            youtube_video = self.upload_to_youtube(
                video['file_path'],
                f"AI Summary: {summary['title']}",
                f"AI-generated summary of {summary['title']}\n\n{summary['text']}"
            )

            return {
                'summary': summary,
                'video_url': youtube_video['video_url']
            }

        except Exception as e:
            print(f"Error: {str(e)}")
            return None

# Usage Example
if __name__ == "__main__":
    generator = AIVideoGenerator()
    result = generator.process_document(
        pdf_path="document.pdf",
        video_path="presenter.mp4",
        channel_name="AI Education"
    )

    if result:
        print(f"Process completed!")
        print(f"Summary: {result['summary']['text'][:100]}...")
        print(f"Video URL: {result['video_url']}")
```

## Error Handling Examples

```python
def safe_api_call(func):
    def wrapper(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API Error: {str(e)}")
            if hasattr(e.response, 'json'):
                print(f"Error details: {e.response.json()}")
            return None
    return wrapper

# Usage with decorator
@safe_api_call
def upload_video(file_path):
    return requests.post(f"{base_url}/youtube/upload", json={
        "file_path": file_path,
        "title": "Test Video",
        "description": "Test Description"
    })
```

## Batch Processing Example

```python
def batch_process_documents(pdf_directory, video_template):
    generator = AIVideoGenerator()
    results = []

    for pdf_file in os.listdir(pdf_directory):
        if pdf_file.endswith('.pdf'):
            pdf_path = os.path.join(pdf_directory, pdf_file)
            result = generator.process_document(
                pdf_path=pdf_path,
                video_path=video_template,
                channel_name="AI Education"
            )
            results.append({
                'pdf': pdf_file,
                'result': result
            })
            time.sleep(60)  # Respect API rate limits

    return results
```

## Environment Setup

```python
import os
from dotenv import load_dotenv

load_dotenv()

API_CONFIG = {
    'base_url': os.getenv('API_BASE_URL', 'http://localhost:8000/api/v1'),
    'api_key': os.getenv('API_KEY'),
    'youtube_credentials': os.getenv('YOUTUBE_CREDENTIALS_PATH')
} 