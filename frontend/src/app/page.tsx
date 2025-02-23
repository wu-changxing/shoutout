'use client';

import { useState } from 'react';
import { ProcessSteps, type ProcessStep } from '@/components/ProcessSteps';
import { FileUpload } from '@/components/FileUpload';
import { YouTubeSettings } from '@/components/YouTubeSettings';
import { VideoGallery } from '@/components/VideoGallery';
import { FiUpload, FiYoutube, FiSettings, FiTrendingUp } from 'react-icons/fi';
import { BsRobot, BsLightning } from 'react-icons/bs';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('script');
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: 'script',
      title: 'Generate Script',
      description: 'Upload your PDF document to generate a video script',
      status: 'waiting'
    },
    {
      id: 'audio',
      title: 'Generate Audio',
      description: 'Converting script to natural speech using AI',
      status: 'waiting'
    },
    {
      id: 'video',
      title: 'Select Video',
      description: 'Choose a video template for your content',
      status: 'waiting'
    },
    {
      id: 'lipsync',
      title: 'Lip Sync',
      description: 'Generating lip-synced video with AI',
      status: 'waiting'
    },
    {
      id: 'youtube',
      title: 'Publish',
      description: 'Upload your video to YouTube',
      status: 'waiting'
    }
  ]);

  const handleFileSelect = async (file: File) => {
    // Update script step status
    setSteps(steps.map(step => 
      step.id === 'script' 
        ? { ...step, status: 'processing' }
        : step
    ));

    // Simulate processing
    setTimeout(() => {
      setSteps(steps.map(step => 
        step.id === 'script' 
          ? { ...step, status: 'completed' }
          : step.id === 'audio'
          ? { ...step, status: 'processing' }
          : step
      ));
      setCurrentStep('audio');
    }, 2000);
  };

  const handleSettingsChange = (settings: { channelName: string; titleFormat: string }) => {
    // Handle YouTube settings
    console.log('YouTube settings:', settings);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                Shoutout
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create viral videos with AI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-secondary">
                <FiUpload className="w-4 h-4 mr-2" />
                Upload
              </button>
              <button className="btn-primary">
                <BsLightning className="w-4 h-4 mr-2" />
                Create
              </button>
              <button className="btn-accent">
                <FiSettings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Process Steps */}
          <div className="lg:col-span-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <BsRobot className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Process Steps</h2>
              </div>
              <ProcessSteps
                currentStep={currentStep}
                steps={steps}
                onStepComplete={(stepId) => console.log(`Step ${stepId} completed`)}
              />
            </div>
          </div>

          {/* Right Column - Current Step Content */}
          <div className="lg:col-span-8">
            <div className="glass-card p-6">
              {currentStep === 'script' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FiUpload className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Upload Document</h2>
                  </div>
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              )}
              
              {currentStep === 'youtube' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FiYoutube className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold">YouTube Settings</h2>
                  </div>
                  <YouTubeSettings onSettingsChange={handleSettingsChange} />
                </div>
              )}
            </div>

            {/* Video Gallery */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <FiTrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Videos</h2>
              </div>
              <VideoGallery />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
