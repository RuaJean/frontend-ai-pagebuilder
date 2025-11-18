"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 text-sm text-slate-700">
        {label && <span className="font-medium text-slate-900">{label}</span>}
        <input
          ref={ref}
          className={cn(
            "h-11 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200",
            className
          )}
          {...props}
        />
        {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
