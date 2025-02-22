'use client';

import { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { IoText } from 'react-icons/io5';
import { BsInfoCircle } from 'react-icons/bs';

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
    <div className="space-y-6 bg-white dark:bg-zinc-800/50 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-zinc-700/50">
        <FaYoutube className="w-6 h-6 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          YouTube Settings
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaYoutube className="w-4 h-4 text-gray-400" />
            Channel Name
          </label>
          <input
            type="text"
            value={settings.channelName}
            onChange={handleChange('channelName')}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-500/20 dark:focus:border-blue-500
              transition-colors duration-200"
            placeholder="Enter your YouTube channel name"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <IoText className="w-4 h-4 text-gray-400" />
            Video Title Format
          </label>
          <input
            type="text"
            value={settings.titleFormat}
            onChange={handleChange('titleFormat')}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-lg 
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-500/20 dark:focus:border-blue-500
              transition-colors duration-200"
            placeholder="e.g., {title} - AI Summary"
          />
          <div className="mt-2 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BsInfoCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded">{'{title}'}</code> as a placeholder for the PDF title</p>
          </div>
        </div>
      </div>
    </div>
  );
} 