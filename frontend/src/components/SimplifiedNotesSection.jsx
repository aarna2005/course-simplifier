/**
 * SimplifiedNotesSection.jsx
 * --------------------------
 * Renders the AI-simplified content with preserved headings.
 */

import React, { useState } from 'react';
import ResultSection from './ResultSection';

export default function SimplifiedNotesSection({ simplifiedText }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_CHARS = 800;
  const isLong = simplifiedText.length > PREVIEW_CHARS;
  const displayed = isLong && !expanded
    ? simplifiedText.slice(0, PREVIEW_CHARS) + '…'
    : simplifiedText;

  // Render lines – detect headings (lines starting with # or ALL CAPS short lines)
  const renderLine = (line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-3" />;

    // Markdown-style headings
    if (trimmed.startsWith('## ')) {
      return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-1">{trimmed.slice(3)}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={i} className="text-lg font-bold text-gray-900 mt-5 mb-2">{trimmed.slice(2)}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h4 key={i} className="text-sm font-semibold text-gray-700 mt-3 mb-1 uppercase tracking-wide">{trimmed.slice(4)}</h4>;
    }
    // Bold markers **text**
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  };

  return (
    <ResultSection icon="✨" title="Simplified Notes" color="purple">
      <div>
        {displayed.split('\n').map(renderLine)}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-ibm-blue hover:underline font-medium"
        >
          {expanded ? '▲ Show less' : '▼ Show full content'}
        </button>
      )}
    </ResultSection>
  );
}
