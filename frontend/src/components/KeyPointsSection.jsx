/**
 * KeyPointsSection.jsx
 * --------------------
 * Renders the 10 extracted key points as a numbered list.
 */

import React from 'react';
import ResultSection from './ResultSection';

const ACCENT_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
  'bg-green-500', 'bg-red-500',   'bg-yellow-500','bg-pink-500',  'bg-indigo-500',
];

export default function KeyPointsSection({ keyPoints }) {
  if (!keyPoints?.length) return null;

  return (
    <ResultSection icon="🎯" title="Key Points" color="teal">
      <div className="grid sm:grid-cols-2 gap-3">
        {keyPoints.map((point, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-teal-200 transition"
          >
            <span
              className={`shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`}
            >
              {i + 1}
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
    </ResultSection>
  );
}
