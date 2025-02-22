'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${file ? 'bg-green-50 border-green-500' : ''}`}
    >
      <input {...getInputProps()} />
      <svg
        className={`mx-auto h-12 w-12 ${file ? 'text-green-500' : 'text-gray-400'}`}
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
        />
      </svg>
      <div className="mt-4">
        {file ? (
          <p className="text-sm text-green-600">
            Selected file: {file.name}
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop your PDF here..."
              : "Drag and drop your PDF file here, or click to browse"}
          </p>
        )}
      </div>
    </div>
  );
} 