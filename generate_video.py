import fal_client
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def download_video(url, filename):
    """Download a video from URL and save it to filename"""
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
    else:
        print(f"Failed to download {filename}")

def on_queue_update(update):
    """Handle queue updates and print progress logs"""
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

def generate_video():
    # Create output directory if it doesn't exist
    output_dir = "generated_videos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Get API key from environment variable
    fal_client.key = os.getenv('FAL_KEY')
    
    try:
        # Subscribe to the video generation endpoint
        result = fal_client.subscribe(
            "fal-ai/minimax/video-01-live",  # correct endpoint for video generation
            arguments={
                "prompt": "A serene lake surrounded by mountains at sunset, cinematic, 8k, detailed",
                "negative_prompt": "blurry, low quality, distorted",
                "num_frames": 24,
                "fps": 8,
                "width": 1024,
                "height": 576,
                "guidance_scale": 7.5,
                "num_inference_steps": 50
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        print("\nVideo generation completed!")
        
        # Download the generated video
        if isinstance(result, dict) and 'video' in result and isinstance(result['video'], dict):
            video_info = result['video']
            if 'url' in video_info:
                filename = os.path.join(output_dir, video_info.get('file_name', 'output.mp4'))
                download_video(video_info['url'], filename)
                print(f"\nVideo has been downloaded to: {filename}")
            else:
                print("No video URL found in the video info")
                print("Video info:", video_info)
        else:
            print("No video information found in the response")
            print("Response:", result)
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    generate_video() 