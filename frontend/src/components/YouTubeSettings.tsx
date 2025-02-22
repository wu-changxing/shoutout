'use client';

import { useState } from 'react';

interface YouTubeSettingsProps {
  onSettingsChange: (settings: {
    channelName: string;
    titleFormat: string;
  }) => void;
}

export function YouTubeSettings({ onSettingsChange }: YouTubeSettingsProps) {
  const [settings, setSettings] = useState({
    channelName: '',
    titleFormat: '{title} - AI Summary'
  });

  const handleChange = (field: keyof typeof settings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSettings = {
      ...settings,
      [field]: e.target.value
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Channel Name
        </label>
        <input
          type="text"
          value={settings.channelName}
          onChange={handleChange('channelName')}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
          placeholder="Enter your YouTube channel name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Video Title Format
        </label>
        <input
          type="text"
          value={settings.titleFormat}
          onChange={handleChange('titleFormat')}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
          placeholder="e.g., {title} - AI Summary"
        />
        <p className="mt-1 text-sm text-gray-500">
          Use {'{title}'} as a placeholder for the PDF title
        </p>
      </div>
    </div>
  );
} 