'use client';

import { ButtonHTMLAttributes, cloneElement, forwardRef, isValidElement } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-500',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const { type = 'button', disabled, ...restProps } = props;
    const composed = [
      'inline-flex items-center justify-center font-medium rounded-md border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed gap-2',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ...restProps,
        className: [composed, (children.props as { className?: string }).className]
          .filter(Boolean)
          .join(' '),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={composed}
        disabled={isLoading || disabled}
        {...restProps}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
