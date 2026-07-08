/**
 * QuizSection.jsx
 * ---------------
 * Interactive 10-question multiple-choice quiz.
 * Users select answers and submit to see their score.
 */

import React, { useState } from 'react';
import ResultSection from './ResultSection';

const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizSection({ quiz }) {
  const [selected, setSelected]   = useState({});   // { qIndex: 'A' | 'B' | ... }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]         = useState(0);

  if (!quiz?.length) return null;

  function handleSelect(qIndex, letter) {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIndex]: letter }));
  }

  function handleSubmit() {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (selected[i] === q.correct_answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    // Scroll to quiz result
    setTimeout(() => {
      document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function handleReset() {
    setSelected({});
    setSubmitted(false);
    setScore(0);
  }

  const percentage = Math.round((score / quiz.length) * 100);
  const scoreColor =
    percentage >= 80 ? 'text-green-600'
    : percentage >= 50 ? 'text-yellow-600'
    : 'text-red-600';

  return (
    <ResultSection icon="❓" title="Multiple Choice Quiz" color="green">
      <div className="space-y-5">
        {quiz.map((q, qIndex) => (
          <div
            key={qIndex}
            className={`border rounded-xl overflow-hidden transition-all ${
              submitted
                ? selected[qIndex] === q.correct_answer
                  ? 'border-green-400'
                  : 'border-red-300'
                : 'border-gray-200'
            }`}
          >
            {/* Question header */}
            <div className="flex items-start gap-3 px-4 py-3 bg-gray-50">
              <span className="shrink-0 w-6 h-6 rounded-full bg-ibm-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {qIndex + 1}
              </span>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.question}</p>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-2 p-3">
              {OPTION_KEYS.map((key, optIndex) => {
                const letter   = OPTION_LABELS[optIndex];
                const isChosen = selected[qIndex] === letter;
                const isCorrect = q.correct_answer === letter;

                let optClass = 'border border-gray-200 bg-white hover:border-ibm-blue hover:bg-blue-50';
                if (submitted) {
                  if (isCorrect)       optClass = 'border border-green-400 bg-green-50';
                  else if (isChosen)   optClass = 'border border-red-400 bg-red-50';
                } else if (isChosen) {
                  optClass = 'border border-ibm-blue bg-blue-50';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(qIndex, letter)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all cursor-pointer ${optClass}`}
                  >
                    <span
                      className={`shrink-0 w-5 h-5 rounded border text-xs font-bold flex items-center justify-center ${
                        isChosen && !submitted
                          ? 'bg-ibm-blue border-ibm-blue text-white'
                          : submitted && isCorrect
                          ? 'bg-green-500 border-green-500 text-white'
                          : submitted && isChosen
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-gray-700">{q[key]}</span>
                    {submitted && isCorrect && (
                      <span className="ml-auto text-green-600 text-xs font-bold">✓</span>
                    )}
                    {submitted && isChosen && !isCorrect && (
                      <span className="ml-auto text-red-500 text-xs font-bold">✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit / Score */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length < quiz.length}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              Object.keys(selected).length < quiz.length
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {Object.keys(selected).length < quiz.length
              ? `Answer all questions (${Object.keys(selected).length}/${quiz.length})`
              : '✅ Submit Quiz'}
          </button>
        ) : (
          <div id="quiz-result" className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className={`text-4xl font-bold ${scoreColor} mb-1`}>
              {score} / {quiz.length}
            </div>
            <div className={`text-lg font-semibold ${scoreColor} mb-3`}>
              {percentage}% — {
                percentage >= 80 ? '🏆 Excellent!' :
                percentage >= 60 ? '👍 Good job!' :
                percentage >= 40 ? '📖 Keep studying!' :
                '💪 Don\'t give up!'
              }
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  percentage >= 80 ? 'bg-green-500' :
                  percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-ibm-blue hover:underline font-medium"
            >
              🔄 Retake Quiz
            </button>
          </div>
        )}
      </div>
    </ResultSection>
  );
}
