/**
 * ResultSection.jsx
 * -----------------
 * Container card used to wrap each result section with a consistent
 * header + fade-in animation.
 *
 * Props:
 *   icon    – emoji or SVG
 *   title   – section heading string
 *   color   – tailwind accent colour class (e.g. 'blue', 'green')
 *   children
 */

import React, { useRef, useEffect, useState } from 'react';

const ACCENT_MAP = {
  blue:   { border: 'border-ibm-blue',   bg: 'bg-blue-50',   text: 'text-ibm-blue',   badge: 'bg-ibm-blue'   },
  green:  { border: 'border-green-500',  bg: 'bg-green-50',  text: 'text-green-700',  badge: 'bg-green-500'  },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-500' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-500' },
  teal:   { border: 'border-teal-500',   bg: 'bg-teal-50',   text: 'text-teal-700',   badge: 'bg-teal-500'   },
  cyan:   { border: 'border-cyan-500',   bg: 'bg-cyan-50',   text: 'text-cyan-700',   badge: 'bg-cyan-500'   },
};

export default function ResultSection({ icon, title, color = 'blue', children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const accent = ACCENT_MAP[color] || ACCENT_MAP.blue;

  // Intersection observer for fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Section header */}
      <div className={`flex items-center gap-3 px-6 py-4 ${accent.bg} border-b ${accent.border}/30`}>
        <span className="text-2xl">{icon}</span>
        <h2 className={`text-base font-bold ${accent.text}`}>{title}</h2>
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}
