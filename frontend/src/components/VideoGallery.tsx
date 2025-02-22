'use client';

import { useState, useEffect } from 'react';
import { videoService, Video } from '@/services/videoService';
import { FaPlay, FaTimes, FaYoutube } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import { IoReloadCircle } from 'react-icons/io5';

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

  const getEmbedUrl = (video: Video) => {
    if (video.isShort) {
      return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  };

  const VideoModal = ({ video, onClose }: { video: Video; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="relative w-full max-w-4xl mx-auto">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className={`relative w-full ${video.isShort ? 'max-w-[400px] mx-auto' : ''}`}>
          <div className={`relative ${video.isShort ? 'pb-[177.77%]' : 'pb-[56.25%]'}`}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
              src={getEmbedUrl(video)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-6 text-white">
          <h3 className="text-2xl font-bold">{video.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <FaYoutube className="text-red-500 w-5 h-5" />
            <p className="text-sm text-gray-300">
              {new Date(video.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <MdOutlineVideoLibrary className="w-7 h-7 text-blue-500" />
          <h2 className="text-2xl font-bold">Your Generated Videos</h2>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading your video gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <MdOutlineVideoLibrary className="w-7 h-7 text-blue-500" />
          <h2 className="text-2xl font-bold">Your Generated Videos</h2>
        </div>
        <div className="text-center py-16 bg-red-50 rounded-xl border border-red-100">
          <BiErrorCircle className="mx-auto h-16 w-16 text-red-400" />
          <h3 className="mt-4 text-lg font-semibold text-red-800">Error loading videos</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={loadVideos}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            <IoReloadCircle className="w-5 h-5" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <MdOutlineVideoLibrary className="w-7 h-7 text-blue-500" />
        <h2 className="text-2xl font-bold">Your Generated Videos</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-white dark:bg-zinc-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`relative ${video.isShort ? 'pb-[177.77%]' : 'pb-[56.25%]'}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {video.isShort && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Short
                  </span>
                )}
                <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <FaYoutube className="w-4 h-4" />
                  YouTube
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(video)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <FaPlay className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </button>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold line-clamp-2 mb-3 group-hover:text-blue-500 transition-colors duration-200">
                {video.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{new Date(video.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Play Video
                  <FaPlay className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-700/50">
          <MdOutlineVideoLibrary className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No videos yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Generate your first video to see it here.
          </p>
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
} 