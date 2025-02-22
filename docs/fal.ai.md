# Fal.ai Documentation

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Authentication](#authentication)
- [Features](#features)
  - [Generating Images from Text](#generating-images-from-text)
  - [Generating Videos from Image](#generating-videos-from-image)
  - [Queue Management](#queue-management)
- [API Reference](#api-reference)
- [Examples](#examples)

## Introduction

Fal.ai provides powerful AI capabilities through simple API endpoints. This documentation covers the main features and how to use them in your applications.

## Installation

```bash
pip install fal-client
```

## Authentication

Before using fal.ai services, you need to set up authentication:

1. Get your API key from [fal.ai dashboard](https://fal.ai/dashboard/keys)
2. Set it in your code:
```python
import fal_client
fal_client.key = "your_api_key"
```

Or use environment variables:
```python
import os
from dotenv import load_dotenv

load_dotenv()
fal_client.key = os.getenv('FAL_KEY')
```

## Features

### Generating Images from Text

Generate images using text prompts with the Stable Diffusion model:

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux/dev",
    arguments={
        "prompt": "A serene lake surrounded by mountains at sunset",
        "image_size": "landscape_4_3",
        "num_images": 4
    }
)

# Result contains URLs to generated images
for image in result['images']:
    print(f"Image URL: {image['url']}")
```

Parameters:
- `prompt`: Text description of the image to generate
- `image_size`: Size/aspect ratio of the output image
- `num_images`: Number of images to generate
- `seed`: (optional) Random seed for reproducibility

### Generating Videos from Image

Convert still images into videos using the image-to-video model:

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax/video-01-live",
    arguments={
        "image_url": "https://example.com/input.jpg",
        "num_frames": 24,
        "fps": 8,
        "motion_bucket_id": 127,
        "cond_aug": 0.02
    }
)

# Result contains URL to the generated video
video_url = result['video']
```

Parameters:
- `image_url`: URL of the input image
- `num_frames`: Number of frames to generate
- `fps`: Frames per second
- `motion_bucket_id`: Controls amount of motion (0-255)
- `cond_aug`: Conditioning augmentation (default: 0.02)

### Queue Management

Fal.ai uses a queue system to manage requests. There are several ways to interact with the queue:

1. **Simple Subscribe** (Recommended)
```python
result = fal_client.subscribe(
    "endpoint_name",
    arguments={...},
    with_logs=True,
    on_queue_update=callback_function
)
```

2. **Submit and Check Later**
```python
# Submit request
handler = fal_client.submit(
    "endpoint_name",
    arguments={...}
)

# Get request ID
request_id = handler.request_id

# Check status later
status = fal_client.status("endpoint_name", request_id)

# Get result when ready
result = fal_client.result("endpoint_name", request_id)
```

3. **Direct Run** (Not recommended for production)
```python
result = fal_client.run(
    "endpoint_name",
    arguments={...}
)
```

## API Reference

### Common Parameters

All endpoints accept these common parameters:
- `with_logs`: Boolean to enable progress logs
- `on_queue_update`: Callback function for queue updates
- `timeout`: Maximum time to wait for result (in seconds)

### Response Formats

1. Image Generation Response:
```python
{
    'images': [
        {
            'url': 'https://...png',
            'width': 1024,
            'height': 768,
            'content_type': 'image/jpeg'
        },
        # ... more images
    ],
    'timings': {'inference': 8.53},
    'seed': 6252023,
    'has_nsfw_concepts': [False, False, ...]
}
```

2. Video Generation Response:
```python
{
    'video': 'https://...mp4',
    'timings': {'inference': 12.34}
}
```

## Examples

### Complete Image Generation Example

```python
import fal_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
fal_client.key = os.getenv('FAL_KEY')

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

try:
    result = fal_client.subscribe(
        "fal-ai/flux/dev",
        arguments={
            "prompt": "A serene lake surrounded by mountains at sunset",
            "image_size": "landscape_4_3",
            "num_images": 4
        },
        with_logs=True,
        on_queue_update=on_queue_update
    )
    
    # Process results
    for i, image in enumerate(result['images']):
        print(f"Image {i+1} URL: {image['url']}")
        
except Exception as e:
    print(f"An error occurred: {str(e)}")
```

### Complete Video Generation Example

```python
import fal_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
fal_client.key = os.getenv('FAL_KEY')

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

try:
    result = fal_client.subscribe(
        "fal-ai/minimax/video-01-live",
        arguments={
            "image_url": "https://example.com/input.jpg",
            "num_frames": 24,
            "fps": 8,
            "motion_bucket_id": 127,
            "cond_aug": 0.02
        },
        with_logs=True,
        on_queue_update=on_queue_update
    )
    
    # Get video URL
    if 'video' in result:
        print(f"Video URL: {result['video']}")
    else:
        print("No video was generated")
        
except Exception as e:
    print(f"An error occurred: {str(e)}")
```

For more information and updates, visit the [official fal.ai documentation](https://docs.fal.ai/). 