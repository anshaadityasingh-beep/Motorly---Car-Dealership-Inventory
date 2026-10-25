import React from 'react';

/**
 * Accessible Input field component with label, error states, and optional helper text.
 */
export const Input = ({
  label,
  id,
  name,
  type = 'text',
  error,
  helperText,
  className = '',
  disabled = false,
  required = false,
  ...props
}) => {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 bg-white placeholder-slate-400 text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 hover:border-slate-400'
          }`}
          {...props}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-600 animate-fadeIn">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
