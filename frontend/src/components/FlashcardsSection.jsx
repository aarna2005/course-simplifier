/**
 * FlashcardsSection.jsx
 * ---------------------
 * Renders 10 flip-cards. Hover or click to reveal the answer.
 */

import React, { useState } from 'react';
import ResultSection from './ResultSection';

const CARD_COLORS = [
  { front: 'bg-ibm-blue',    back: 'bg-blue-700'   },
  { front: 'bg-purple-600',  back: 'bg-purple-800'  },
  { front: 'bg-teal-600',    back: 'bg-teal-800'    },
  { front: 'bg-cyan-600',    back: 'bg-cyan-800'    },
  { front: 'bg-green-600',   back: 'bg-green-800'   },
  { front: 'bg-orange-500',  back: 'bg-orange-700'  },
  { front: 'bg-red-500',     back: 'bg-red-700'     },
  { front: 'bg-indigo-600',  back: 'bg-indigo-800'  },
  { front: 'bg-pink-500',    back: 'bg-pink-700'    },
  { front: 'bg-yellow-500',  back: 'bg-yellow-700'  },
];

export default function FlashcardsSection({ flashcards }) {
  const [flipped, setFlipped] = useState({});

  if (!flashcards?.length) return null;

  const toggle = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <ResultSection icon="🃏" title="Flashcards" color="cyan">
      <p className="text-xs text-gray-500 mb-4">
        Click a card to flip it and reveal the answer.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {flashcards.map((card, i) => {
          const colors = CARD_COLORS[i % CARD_COLORS.length];
          const isFlipped = !!flipped[i];
          return (
            <div
              key={i}
              onClick={() => toggle(i)}
              style={{ perspective: '800px', height: '140px' }}
              className={`flashcard-container cursor-pointer select-none ${isFlipped ? 'flipped' : ''}`}
            >
              <div className="flashcard-inner">
                {/* Front */}
                <div className={`flashcard-front ${colors.front} text-white rounded-xl`}>
                  <div className="text-center p-3">
                    <div className="text-xs font-bold opacity-60 mb-2">QUESTION {i + 1}</div>
                    <p className="text-xs leading-relaxed">{card.front}</p>
                  </div>
                </div>
                {/* Back */}
                <div className={`flashcard-back ${colors.back} text-white rounded-xl`}>
                  <div className="text-center p-3">
                    <div className="text-xs font-bold opacity-60 mb-2">ANSWER</div>
                    <p className="text-xs leading-relaxed">{card.back}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ResultSection>
  );
}
