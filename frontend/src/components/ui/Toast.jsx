import React from 'react';

/**
 * Toast alert notification component.
 */
export const Toast = ({ message, type = 'success', onClose, className = '' }) => {
  if (!message) return null;

  const typeStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    info: 'bg-brand-600 text-white shadow-brand-500/20',
    warning: 'bg-amber-500 text-white shadow-amber-500/20',
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl font-medium text-sm transition-all duration-300 animate-bounce-subtle ${
        typeStyles[type] || typeStyles.info
      } ${className}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="p-1 hover:bg-black/10 rounded-lg transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
