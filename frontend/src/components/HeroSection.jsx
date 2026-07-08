/**
 * HeroSection.jsx
 * ---------------
 * Landing hero with headline, sub-text and feature badges.
 */

import React from 'react';

const features = [
  { icon: '📄', label: 'Upload PDF / DOCX / TXT' },
  { icon: '🎓', label: '6 Learner Levels' },
  { icon: '✨', label: 'AI Simplification' },
  { icon: '🃏', label: 'Flashcards & Quiz' },
];

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-ibm-gray-100 via-gray-900 to-ibm-gray-100 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-ibm-blue/20 border border-ibm-blue/40 rounded-full px-4 py-1.5 text-xs font-medium text-ibm-blue-light mb-6">
          <span className="w-1.5 h-1.5 bg-ibm-blue-light rounded-full animate-pulse" />
          Powered by IBM watsonx.ai Studio Foundation Models
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
          Course Content{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ibm-blue-light to-ibm-cyan">
            Simplification Agent
          </span>
        </h1>

        <p className="text-base sm:text-lg text-ibm-gray-30 max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload your academic notes, textbooks, or course material and let IBM's AI
          transform complex content into clear, level-appropriate explanations — instantly.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {features.map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-gray-200"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
