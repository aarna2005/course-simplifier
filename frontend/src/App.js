/**
 * App.jsx
 * -------
 * Root application component.
 *
 * State machine:
 *   home    – shows hero + upload card
 *   loading – shows LoadingScreen overlay
 *   result  – shows ResultsPage with all AI outputs
 */

import React, { useState } from 'react';
import Navbar           from './components/Navbar';
import HeroSection      from './components/HeroSection';
import UploadCard       from './components/UploadCard';
import LoadingScreen    from './components/LoadingScreen';
import ResultsPage      from './components/ResultsPage';
import Footer           from './components/Footer';
import { simplifyContent } from './api';

export default function App() {
  const [view, setView]     = useState('home');   // 'home' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [level, setLevel]   = useState('beginner');
  const [error, setError]   = useState('');

  /**
   * Called by UploadCard when the user clicks "Simplify with AI".
   * Fires the /simplify endpoint and transitions between views.
   */
  async function handleSimplify(text, selectedLevel) {
    setLevel(selectedLevel);
    setError('');
    setView('loading');

    try {
      const data = await simplifyContent(text, selectedLevel);
      setResult(data);
      setView('result');
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'An unexpected error occurred. Please try again.';
      setError(msg);
      setView('home');
      // Scroll to top so user sees the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleReset() {
    setView('home');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isLoading = view === 'loading';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Loading overlay – rendered above everything */}
      {isLoading && <LoadingScreen />}

      <main className="flex-1">
        {view !== 'result' ? (
          /* ── Home page ─────────────────────────────────────────────────── */
          <>
            <HeroSection />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Global error banner */}
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 fade-in-up">
                  <span className="text-xl shrink-0">⚠️</span>
                  <div>
                    <p className="font-semibold mb-0.5">Something went wrong</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              )}

              <UploadCard onSimplify={handleSimplify} loading={isLoading} />

              {/* How it works – mini explainer */}
              <div className="mt-10">
                <h3 className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest mb-6">
                  How it works
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { step: '1', icon: '📂', label: 'Upload or Paste', desc: 'PDF, DOCX, or TXT' },
                    { step: '2', icon: '🎓', label: 'Pick Your Level', desc: 'From Beginner to Expert' },
                    { step: '3', icon: '🤖', label: 'AI Processes',     desc: 'IBM watsonx.ai runs 5 tasks' },
                    { step: '4', icon: '✅', label: 'Get Results',       desc: 'Notes, Quiz, Flashcards & more' },
                  ].map((item) => (
                    <div key={item.step} className="text-center bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-xs font-bold text-ibm-blue mb-1">Step {item.step}</div>
                      <div className="text-xs font-semibold text-gray-800 mb-0.5">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── Results page ───────────────────────────────────────────────── */
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ResultsPage result={result} onReset={handleReset} level={level} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
