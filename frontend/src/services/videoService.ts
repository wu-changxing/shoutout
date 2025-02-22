const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  createdAt: string;
  isShort?: boolean;
}

export const videoService = {
  async generateVideo(file: File, channelName: string, titleFormat: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('channelName', channelName);
    formData.append('titleFormat', titleFormat);

    const response = await fetch(`${API_BASE_URL}/lip-sync`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate video');
    }

    const data = await response.json();
    return data.file_path;
  },

  async getVideos(): Promise<Video[]> {
    // For now, return static data including the YouTube Shorts video
    return [
      {
        id: 'g7oou0uFAyM',
        title: 'AI Generated Short',
        thumbnail: `https://i.ytimg.com/vi/g7oou0uFAyM/maxresdefault.jpg`,
        url: 'https://youtube.com/shorts/g7oou0uFAyM',
        createdAt: '2024-02-22',
        isShort: true
      },
      // Add more sample videos here
    ];
  },

  async downloadVideo(filename: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download/${filename}`);
    
    if (!response.ok) {
      throw new Error('Failed to download video');
    }

    return response.blob();
  }
}; 