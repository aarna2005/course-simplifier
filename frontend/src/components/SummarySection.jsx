/**
 * SummarySection.jsx
 * ------------------
 * Renders the AI-generated 5-bullet summary.
 */

import React from 'react';
import ResultSection from './ResultSection';

export default function SummarySection({ summary }) {
  // Parse bullet lines – model returns lines starting with "• " or "- "
  const lines = summary
    .split('\n')
    .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <ResultSection icon="📝" title="Summary" color="blue">
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-ibm-blue text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </ResultSection>
  );
}
