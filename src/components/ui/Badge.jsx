import React from 'react';

export const Badge = ({ text, className = "", color = "" }) => {
  // If color is passed as hex, apply border and text glow colors dynamically
  const style = color 
    ? { 
        borderColor: `${color}40`, 
        color: color, 
        backgroundColor: `${color}10`,
        boxShadow: `0 0 10px ${color}10`
      } 
    : {};

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-300 border border-black/5 bg-black/5 text-slate-300 hover:text-text-primary ${className}`}
      style={style}
    >
      {text}
    </span>
  );
};
