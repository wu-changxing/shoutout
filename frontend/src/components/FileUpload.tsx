'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';

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
      className={`
        relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' 
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'}
        ${file 
          ? 'bg-green-50/50 border-green-500 dark:bg-green-500/10 dark:border-green-500/50' 
          : ''}
        group cursor-pointer
      `}
    >
      {/* Animated background gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent
        -translate-x-full group-hover:translate-x-full transition-transform duration-1000
        ${isDragActive ? 'animate-shimmer' : ''}
      `} />

      <input {...getInputProps()} />
      
      <div className="relative">
        {file ? (
          <div className="flex flex-col items-center">
            <div className="relative">
              <AiOutlineFilePdf className="w-16 h-16 text-green-500 dark:text-green-400" />
              <IoCheckmarkCircle className="absolute -bottom-2 -right-2 w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
              {file.name}
            </p>
            <p className="mt-1 text-xs text-green-500 dark:text-green-400">
              Ready to process
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FiUploadCloud className={`
              w-16 h-16 transition-colors duration-300
              ${isDragActive 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'}
            `} />
            <p className={`
              mt-4 text-sm font-medium transition-colors duration-300
              ${isDragActive 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'}
            `}>
              {isDragActive
                ? "Drop your PDF here..."
                : "Drag and drop your PDF file here"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              or click to browse
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 