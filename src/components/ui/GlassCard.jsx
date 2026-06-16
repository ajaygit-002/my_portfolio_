import React from 'react';

export const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-card p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
