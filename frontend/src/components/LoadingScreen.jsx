/**
 * LoadingScreen.jsx
 * -----------------
 * Full-screen overlay shown while IBM watsonx.ai processes the request.
 * Displays animated progress steps so users know what is happening.
 */

import React, { useState, useEffect } from 'react';

const STEPS = [
  { id: 1, label: 'Connecting to IBM watsonx.ai Studio',   icon: '🔗' },
  { id: 2, label: 'Simplifying content for your level',     icon: '✨' },
  { id: 3, label: 'Generating summary & key points',        icon: '📋' },
  { id: 4, label: 'Identifying difficult terms',            icon: '📚' },
  { id: 5, label: 'Creating flashcards',                    icon: '🃏' },
  { id: 6, label: 'Building multiple-choice quiz',          icon: '❓' },
];

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps to simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-ibm-gray-20 rounded-full" />
            <div className="w-16 h-16 border-4 border-ibm-blue border-t-transparent rounded-full spinner absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {STEPS[activeStep]?.icon}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-center text-gray-800 mb-1">
          AI is Processing Your Content
        </h3>
        <p className="text-xs text-center text-gray-500 mb-6">
          This may take 30–60 seconds depending on content length
        </p>

        {/* Steps list */}
        <div className="space-y-2">
          {STEPS.map((step, index) => {
            const isDone    = index < activeStep;
            const isActive  = index === activeStep;
            const isPending = index > activeStep;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive ? 'bg-blue-50 border border-ibm-blue/30' : ''
                }`}
              >
                {/* Status indicator */}
                <div className="shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 border-2 border-ibm-blue border-t-transparent rounded-full spinner" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>

                <span
                  className={`text-sm ${
                    isDone    ? 'text-green-600 line-through'
                  : isActive  ? 'text-ibm-blue font-semibold'
                  : isPending ? 'text-gray-400'
                  : ''
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pulsing dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-ibm-blue rounded-full pulse-dot"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
