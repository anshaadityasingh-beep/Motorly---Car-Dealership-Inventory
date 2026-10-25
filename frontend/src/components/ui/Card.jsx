import React from 'react';

/**
 * Card container component with subtle borders and hover-lift effect.
 */
export const Card = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-300 ${
        hoverable ? 'hover-lift hover:shadow-card-hover hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
