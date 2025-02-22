import fal_client
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def upload_file(file_path):
    """Upload a file and get its URL"""
    try:
        url = fal_client.upload_file(file_path)
        print(f"Uploaded {file_path} successfully")
        return url
    except Exception as e:
        print(f"Failed to upload {file_path}: {str(e)}")
        return None

def download_video(url, filename):
    """Download a video from URL and save it to filename"""
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
    else:
        print(f"Failed to download {filename}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")

def on_queue_update(update):
    """Handle queue updates and print progress logs"""
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"Progress: {log['message']}")

def generate_lip_sync(video_path="input_files/input.mp4", audio_path="input_files/input.wav"):
    """Generate a lip-synced video from input video and audio files"""
    # Create output directory if it doesn't exist
    output_dir = "generated_videos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Check if input files exist
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        return
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}")
        return
    
    # Get API key from environment variable
    fal_client.key = os.getenv('FAL_KEY')
    
    try:
        # Upload input files
        video_url = upload_file(video_path)
        audio_url = upload_file(audio_path)
        
        if not video_url or not audio_url:
            print("Failed to upload input files")
            return
        
        # Subscribe to the lip-sync endpoint
        result = fal_client.subscribe(
            "fal-ai/sync-lipsync",  # lip-sync endpoint
            arguments={
                "video_url": video_url,
                "audio_url": audio_url,
                "face_detection_threshold": 0.8,  # Confidence threshold for face detection
                "output_format": "mp4"  # Output video format
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        print("\nLip-sync completed!")
        
        # Extract video URL from the nested response structure
        if isinstance(result, dict) and 'video' in result and isinstance(result['video'], dict) and 'url' in result['video']:
            video_url = result['video']['url']
            filename = os.path.join(output_dir, "lip_synced_output.mp4")
            print(f"Downloading video from: {video_url}")
            download_video(video_url, filename)
            print(f"\nLip-synced video has been downloaded to: {filename}")
        else:
            print("Could not find video URL in the response")
            print("Response structure:", result)
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def main():
    # Check if input files exist, if not, print instructions
    if not os.path.exists("input_files/input.mp4") or not os.path.exists("input_files/input.wav"):
        print("Please place your input files in the input_files directory:")
        print("1. Place your video file as: input_files/input.mp4")
        print("2. Place your audio file as: input_files/input.wav")
        print("\nThen run this script again.")
        return

    generate_lip_sync()

if __name__ == "__main__":
    main() 