# Components Directory

This directory contains React components used in the Shoutout platform's frontend.

## Available Components

### ProcessSteps
Displays the current state of video generation process with visual feedback.

```tsx
import { ProcessSteps, ProcessStep } from './ProcessSteps';

const steps: ProcessStep[] = [
  {
    id: 'script',
    title: 'Generate Script',
    description: 'Generating video script from PDF content',
    status: 'completed'
  },
  {
    id: 'audio',
    title: 'Generate Audio',
    description: 'Converting script to speech',
    status: 'processing',
    progress: 45
  },
  // ... more steps
];

<ProcessSteps
  currentStep="audio"
  steps={steps}
  onStepComplete={(stepId) => console.log(`Step ${stepId} completed`)}
/>
```

### FileUpload
Handles file uploads with drag-and-drop support and visual feedback.

```tsx
import { FileUpload } from './FileUpload';

<FileUpload
  onFileSelect={(file) => console.log('File selected:', file.name)}
/>
```

### YouTubeSettings
Configures YouTube upload settings with channel name and title format.

```tsx
import { YouTubeSettings } from './YouTubeSettings';

<YouTubeSettings
  onSettingsChange={(settings) => console.log('Settings updated:', settings)}
/>
```

### VideoGallery
Displays a grid of generated videos with YouTube integration.

```tsx
import { VideoGallery } from './VideoGallery';

<VideoGallery />
```

## Component States

### Video Generation Process
1. **Script Generation**
   - Upload PDF
   - Process content
   - Generate summary

2. **Audio Generation**
   - Convert text to speech
   - Process audio quality
   - Format conversion

3. **Video Selection**
   - Choose template
   - Configure settings
   - Prepare assets

4. **Lip Sync**
   - Process video
   - Sync with audio
   - Quality checks

5. **YouTube Publishing**
   - Configure settings
   - Upload video
   - Set metadata

## Styling

Components use:
- Tailwind CSS for styling
- Dark mode support
- Responsive design
- Consistent theme

## Best Practices

1. **State Management**
   - Use React hooks
   - Maintain single source of truth
   - Handle errors gracefully

2. **Performance**
   - Lazy loading where appropriate
   - Optimize re-renders
   - Memoize callbacks

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

4. **Error Handling**
   - User-friendly messages
   - Fallback states
   - Recovery options

## Example Usage

Complete process implementation:

```tsx
import { ProcessSteps, FileUpload, YouTubeSettings, VideoGallery } from './components';

export function VideoGenerator() {
  const [currentStep, setCurrentStep] = useState('script');
  const [steps, setSteps] = useState([
    {
      id: 'script',
      title: 'Generate Script',
      description: 'Upload PDF and generate video script',
      status: 'waiting'
    },
    {
      id: 'audio',
      title: 'Generate Audio',
      description: 'Convert script to natural speech',
      status: 'waiting'
    },
    {
      id: 'video',
      title: 'Select Video',
      description: 'Choose video template',
      status: 'waiting'
    },
    {
      id: 'lipsync',
      title: 'Lip Sync',
      description: 'Generate lip-synced video',
      status: 'waiting'
    },
    {
      id: 'youtube',
      title: 'Publish',
      description: 'Upload to YouTube',
      status: 'waiting'
    }
  ]);

  return (
    <div className="space-y-8">
      <ProcessSteps
        currentStep={currentStep}
        steps={steps}
        onStepComplete={handleStepComplete}
      />
      
      {currentStep === 'script' && (
        <FileUpload onFileSelect={handleFileSelect} />
      )}
      
      {currentStep === 'youtube' && (
        <YouTubeSettings onSettingsChange={handleSettingsChange} />
      )}
      
      <VideoGallery />
    </div>
  );
} 