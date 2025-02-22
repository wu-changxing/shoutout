'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { YouTubeSettings } from '@/components/YouTubeSettings';
import { VideoGallery } from '@/components/VideoGallery';
import { videoService } from '@/services/videoService';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [youtubeSettings, setYoutubeSettings] = useState({
    channelName: '',
    titleFormat: '{title} - AI Summary'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setGeneratedVideoUrl(null);
  };

  const handleSettingsChange = (settings: typeof youtubeSettings) => {
    setYoutubeSettings(settings);
  };

  const handleGenerate = async () => {
    if (!file || !youtubeSettings.channelName) {
      alert('Please select a PDF file and enter your YouTube channel name');
      return;
    }

    setIsGenerating(true);
    try {
      const filePath = await videoService.generateVideo(
        file,
        youtubeSettings.channelName,
        youtubeSettings.titleFormat
      );

      // Download the generated video
      const videoBlob = await videoService.downloadVideo(filePath);
      const videoUrl = URL.createObjectURL(videoBlob);
      
      setGeneratedVideoUrl(videoUrl);
      alert('Video generated successfully!');
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Video Generator
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Video Generation Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-6">Create AI Videos from PDF</h2>
              
              {/* File Upload Section */}
              <div className="mb-8">
                <FileUpload onFileSelect={handleFileSelect} />
              </div>

              {/* YouTube Channel Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">YouTube Channel Settings</h3>
                <YouTubeSettings onSettingsChange={handleSettingsChange} />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isGenerating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isGenerating ? 'Generating...' : 'Generate & Publish Video'}
              </button>

              {/* Generated Video Link */}
              {generatedVideoUrl && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 font-medium">Video generated successfully!</p>
                  <video
                    className="w-full mt-4 rounded-lg"
                    controls
                    src={generatedVideoUrl}
                  />
                  <a
                    href={generatedVideoUrl}
                    download="generated-video.mp4"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Download Video →
                  </a>
                </div>
              )}
            </div>

            {/* Right Column - Video Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <VideoGallery />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your PDF document and let our AI analyze its content.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Generate Video</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI creates engaging videos from your PDF content.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-2">Publish</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically publish your generated videos to YouTube.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
