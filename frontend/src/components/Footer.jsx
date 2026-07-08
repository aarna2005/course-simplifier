/**
 * Footer.jsx
 * ----------
 * Simple site footer.
 */

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-ibm-gray-100 text-ibm-gray-30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-ibm-blue rounded-sm" />
              <div className="w-2 h-2 bg-ibm-blue-light rounded-sm" />
              <div className="w-2 h-2 bg-ibm-cyan rounded-sm" />
              <div className="w-2 h-2 bg-ibm-teal rounded-sm" />
            </div>
            <span className="text-sm font-semibold text-white">Course Simplifier</span>
          </div>

          <p className="text-xs text-center text-ibm-gray-50">
            AI-powered educational content simplification using{' '}
            <span className="text-ibm-blue-light font-medium">IBM watsonx.ai Studio</span>{' '}
            Foundation Models
          </p>

          <p className="text-xs text-ibm-gray-50">
            Built for IBM SkillBuild Internship
          </p>
        </div>
      </div>
    </footer>
  );
}
