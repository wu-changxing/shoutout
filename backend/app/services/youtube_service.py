from typing import Optional, List
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
import os
import pickle
from app.core.config import settings

SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
]

class YouTubeService:
    def __init__(self):
        self.credentials = None
        self.token_path = 'token.pickle'
        self.credentials_path = 'client_secrets.json'

    def _get_credentials(self) -> Optional[Credentials]:
        """Get or refresh credentials for YouTube API"""
        if os.path.exists(self.token_path):
            with open(self.token_path, 'rb') as token:
                self.credentials = pickle.load(token)

        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                self.credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, SCOPES)
                self.credentials = flow.run_local_server(port=0)

            with open(self.token_path, 'wb') as token:
                pickle.dump(self.credentials, token)

        return self.credentials

    def upload_video(
        self, 
        file_path: str, 
        title: str, 
        description: str, 
        privacy_status: str = "public",
        tags: Optional[List[str]] = None,
        category_id: str = "22",  # People & Blogs
        language: str = "en"
    ) -> str:
        """
        Upload a video to YouTube
        
        Args:
            file_path: Path to the video file
            title: Video title
            description: Video description
            privacy_status: Video privacy status (public, unlisted, private)
            tags: List of video tags
            category_id: YouTube video category ID (default: People & Blogs)
            language: Video language code
            
        Returns:
            YouTube video ID
        """
        try:
            credentials = self._get_credentials()
            if not credentials:
                raise Exception("Failed to get YouTube credentials")

            youtube = build('youtube', 'v3', credentials=credentials)

            if tags is None:
                tags = ['AI Generated', 'Summary', 'Educational']

            body = {
                'snippet': {
                    'title': title,
                    'description': description,
                    'tags': tags,
                    'categoryId': category_id,
                    'defaultLanguage': language,
                    'defaultAudioLanguage': language
                },
                'status': {
                    'privacyStatus': privacy_status,
                    'selfDeclaredMadeForKids': False,
                    'license': 'youtube',
                    'embeddable': True,
                    'publicStatsViewable': True
                }
            }

            if settings.DEBUG:
                print(f"Starting upload of video: {title}")
                print(f"Privacy status: {privacy_status}")

            insert_request = youtube.videos().insert(
                part=','.join(body.keys()),
                body=body,
                media_body=MediaFileUpload(
                    file_path,
                    chunksize=1024*1024,  # 1MB chunks
                    resumable=True
                )
            )

            response = None
            while response is None:
                status, response = insert_request.next_chunk()
                if status and settings.DEBUG:
                    print(f"Uploaded {int(status.progress() * 100)}%")

            if settings.DEBUG:
                print(f"Upload Complete! Video ID: {response['id']}")
                print(f"Video URL: https://www.youtube.com/watch?v={response['id']}")

            return response['id']

        except Exception as e:
            if settings.DEBUG:
                print(f"An error occurred during upload: {e}")
            raise Exception(f"Failed to upload video: {str(e)}")

youtube_service = YouTubeService() 