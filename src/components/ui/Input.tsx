'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    const inputClasses = [
      'w-full rounded-md border px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2',
      error
        ? 'border-red-500 focus-visible:ring-red-400'
        : 'border-slate-300 focus-visible:ring-brand-300',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className="block text-sm font-medium text-slate-700" htmlFor={inputId}>
        {label && <span className="mb-1 inline-block">{label}</span>}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </label>
    );
  },
);

Input.displayName = 'Input';
