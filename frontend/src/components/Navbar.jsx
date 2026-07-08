/**
 * Navbar.jsx
 * ----------
 * Top navigation bar with IBM watsonx.ai branding.
 */

import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-ibm-gray-100 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* IBM-style square logo mark */}
            <div className="flex items-center gap-1.5">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 bg-ibm-blue rounded-sm" />
                <div className="w-2.5 h-2.5 bg-ibm-blue-light rounded-sm" />
                <div className="w-2.5 h-2.5 bg-ibm-cyan rounded-sm" />
                <div className="w-2.5 h-2.5 bg-ibm-teal rounded-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Course Simplifier
              </span>
            </div>
            <span className="hidden sm:block text-xs bg-ibm-blue px-2 py-0.5 rounded font-medium">
              IBM watsonx.ai
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 text-xs text-ibm-gray-30">
            <span className="hidden md:block">Powered by Foundation Models</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="API Online" />
          </div>
        </div>
      </div>
    </nav>
  );
}
