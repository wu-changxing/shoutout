'use client';

import { useState, useEffect } from 'react';
import { FiFileText, FiMusic, FiVideo, FiYoutube } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BiErrorCircle } from 'react-icons/bi';

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
};

interface ProcessStepsProps {
  currentStep: string;
  steps: ProcessStep[];
  onStepComplete?: (stepId: string) => void;
}

export function ProcessSteps({ currentStep, steps, onStepComplete }: ProcessStepsProps) {
  const getStepIcon = (step: ProcessStep) => {
    switch (step.id) {
      case 'script':
        return <FiFileText className="w-6 h-6" />;
      case 'audio':
        return <FiMusic className="w-6 h-6" />;
      case 'video':
        return <FiVideo className="w-6 h-6" />;
      case 'lipsync':
        return <BsRobot className="w-6 h-6" />;
      case 'youtube':
        return <FiYoutube className="w-6 h-6" />;
      default:
        return <FiFileText className="w-6 h-6" />;
    }
  };

  const getStepStatus = (step: ProcessStep) => {
    switch (step.status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
            <span className="ml-2 text-sm text-green-600">Completed</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-sm text-blue-600">Processing{step.progress ? ` (${step.progress}%)` : ''}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <BiErrorCircle className="w-5 h-5 text-red-500" />
            <span className="ml-2 text-sm text-red-600">Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span className="ml-2 text-sm text-gray-500">Waiting</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`
            relative p-4 rounded-xl border transition-all duration-300
            ${step.id === currentStep 
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30' 
              : 'bg-white border-gray-200 dark:bg-zinc-800/50 dark:border-zinc-700/50'}
            ${step.status === 'completed' && 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30'}
            ${step.status === 'error' && 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30'}
          `}
        >
          {/* Progress line */}
          {index < steps.length - 1 && (
            <div className={`
              absolute left-7 top-16 bottom-0 w-0.5 
              ${step.status === 'completed' ? 'bg-green-200 dark:bg-green-500/30' : 'bg-gray-200 dark:bg-zinc-700/50'}
            `} />
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              p-2 rounded-lg
              ${step.id === currentStep && 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}
              ${step.status === 'completed' && 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'}
              ${step.status === 'error' && 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}
              ${step.status === 'waiting' && 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400'}
            `}>
              {getStepIcon(step)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                {getStepStatus(step)}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
              {step.error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {step.error}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 