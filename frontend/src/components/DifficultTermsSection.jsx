/**
 * DifficultTermsSection.jsx
 * -------------------------
 * Renders a glossary of difficult terms with simple explanations.
 */

import React, { useState } from 'react';
import ResultSection from './ResultSection';

export default function DifficultTermsSection({ terms }) {
  const [open, setOpen] = useState(null);

  if (!terms?.length) return null;

  return (
    <ResultSection icon="📚" title="Difficult Terms" color="orange">
      <div className="space-y-2">
        {terms.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-orange-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-semibold text-gray-800">{item.term}</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-1 bg-orange-50 text-sm text-gray-700 leading-relaxed border-t border-orange-100">
                {item.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </ResultSection>
  );
}
