'use client';

import { useState, useEffect } from 'react';
import { videoService, Video } from '@/services/videoService';

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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

  // Function to get embedded video URL
  const getEmbedUrl = (video: Video) => {
    if (video.isShort) {
      return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return video.url;
  };

  // Video Modal Component
  const VideoModal = ({ video, onClose }: { video: Video; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video container with aspect ratio */}
        <div className={`relative w-full ${video.isShort ? 'max-w-[400px] mx-auto' : ''}`}>
          <div className={`relative ${video.isShort ? 'pb-[177.77%]' : 'pb-[56.25%]'}`}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={getEmbedUrl(video)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video info */}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-300 mt-1">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

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
              <button
                onClick={() => setSelectedVideo(video)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Play Video →
                </button>
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

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
} 