import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`glass-panel p-8 shadow-2xl border border-slate-800/80 rounded-2xl bg-slate-900/80 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}
