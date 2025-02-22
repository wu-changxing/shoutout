'use client';

import { useState, useEffect } from 'react';
import { videoService, Video } from '@/services/videoService';

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const fetchedVideos = await videoService.getVideos();
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Your Generated Videos</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Your Generated Videos</h2>
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-red-800">Error loading videos</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={loadVideos}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Your Generated Videos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            {/* Video Thumbnail */}
            <div className={`relative ${video.isShort ? 'pb-[177.77%]' : 'pb-[56.25%]'}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                {video.isShort && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Short
                  </span>
                )}
              </div>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800/30 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No videos yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate your first video to see it here.
          </p>
        </div>
      )}
    </div>
  );
} 