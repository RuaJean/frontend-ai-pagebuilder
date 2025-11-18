"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

const baseStyles = "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition";

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants: Record<ButtonProps["variant"], string> = {
      primary: "bg-slate-900 text-white hover:bg-slate-700",
      secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
