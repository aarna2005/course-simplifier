/**
 * ResultsPage.jsx
 * ---------------
 * Displays all AI-generated outputs after a successful simplify call.
 *
 * Props:
 *   result   – full SimplifyResponse from the API
 *   onReset  – callback to go back to the home / upload form
 *   level    – learner level string for display
 */

import React from 'react';
import SummarySection         from './SummarySection';
import SimplifiedNotesSection from './SimplifiedNotesSection';
import KeyPointsSection       from './KeyPointsSection';
import DifficultTermsSection  from './DifficultTermsSection';
import FlashcardsSection      from './FlashcardsSection';
import QuizSection            from './QuizSection';

const LEVEL_LABELS = {
  beginner:            'Beginner',
  intermediate:        'Intermediate',
  high_school:         'High School Student',
  undergraduate:       'Undergraduate Student',
  engineering_student: 'Engineering Student',
  expert:              'Expert',
};

export default function ResultsPage({ result, onReset, level }) {
  return (
    <div className="fade-in-up">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-ibm-blue via-ibm-blue-dark to-indigo-700 text-white rounded-2xl shadow-lg px-6 py-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤖</span>
            <h2 className="font-bold text-lg">AI Analysis Complete</h2>
          </div>
          <p className="text-sm text-blue-100">
            Simplified for:{' '}
            <span className="font-semibold text-white">
              {LEVEL_LABELS[level] || level}
            </span>
          </p>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          New Analysis
        </button>
      </div>

      {/* Jump-to navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { href: '#summary',    label: '📝 Summary'   },
          { href: '#simplified', label: '✨ Simplified' },
          { href: '#keypoints',  label: '🎯 Key Points' },
          { href: '#terms',      label: '📚 Terms'      },
          { href: '#flashcards', label: '🃏 Flashcards' },
          { href: '#quiz',       label: '❓ Quiz'       },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs bg-gray-100 hover:bg-ibm-blue hover:text-white text-gray-600 font-medium px-3 py-1.5 rounded-full border border-gray-200 transition-all"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Result sections */}
      <div className="space-y-5">
        <div id="summary">
          <SummarySection summary={result.summary} />
        </div>
        <div id="simplified">
          <SimplifiedNotesSection simplifiedText={result.simplified_text} />
        </div>
        <div id="keypoints">
          <KeyPointsSection keyPoints={result.key_points} />
        </div>
        <div id="terms">
          <DifficultTermsSection terms={result.difficult_terms} />
        </div>
        <div id="flashcards">
          <FlashcardsSection flashcards={result.flashcards} />
        </div>
        <div id="quiz">
          <QuizSection quiz={result.quiz} />
        </div>
      </div>
    </div>
  );
}
