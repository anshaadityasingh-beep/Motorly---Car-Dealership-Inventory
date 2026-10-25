import React from 'react';
import { Spinner } from './Spinner';

/**
 * Modern polymorphic Button component.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-glow-brand focus:ring-brand-500',
    secondary:
      'bg-slate-800 hover:bg-slate-900 text-white shadow-md focus:ring-slate-700',
    accent:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-glow-accent focus:ring-amber-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:ring-rose-500',
    outline:
      'border-2 border-slate-300 hover:border-slate-400 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : 'false'}
      onClick={isDisabled ? undefined : onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading && <Spinner size={size === 'lg' ? 'md' : 'sm'} className="mr-1.5" />}
      {children}
    </button>
  );
};
