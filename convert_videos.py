import os
import subprocess
from pathlib import Path

def convert_to_mp4(input_dir, output_dir):
    """Convert videos to MP4 format and rename them sequentially"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all video files
    video_files = [f for f in os.listdir(input_dir) if f.endswith(('.MOV', '.mp4', '.MP4', '.mov'))]
    
    for idx, video_file in enumerate(sorted(video_files), 1):
        input_path = os.path.join(input_dir, video_file)
        output_path = os.path.join(output_dir, f'input{idx}.mp4')
        
        print(f"\nConverting {video_file} to {output_path}...")
        
        try:
            # Convert video to MP4 with H.264 codec
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-c:v', 'libx264',  # Use H.264 codec
                '-preset', 'medium',  # Balance between speed and quality
                '-crf', '23',  # Constant Rate Factor (18-28 is good, lower is better quality)
                '-c:a', 'aac',  # AAC audio codec
                '-b:a', '128k',  # Audio bitrate
                '-y',  # Overwrite output file if exists
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"Successfully converted {video_file}")
            else:
                print(f"Error converting {video_file}:")
                print(result.stderr)
                
        except Exception as e:
            print(f"Error processing {video_file}: {str(e)}")

if __name__ == "__main__":
    input_dir = "input_files"
    output_dir = "converted_files"
    
    # Check if ffmpeg is installed
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True)
    except FileNotFoundError:
        print("Error: ffmpeg is not installed. Please install ffmpeg first.")
        exit(1)
    
    convert_to_mp4(input_dir, output_dir)
    print("\nConversion completed! Check the 'converted_files' directory for the output.") 