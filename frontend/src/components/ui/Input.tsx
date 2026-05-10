'use client';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">{icon}</div>}
          <input
            ref={ref} id={id}
            className={`w-full h-10 px-3 ${icon ? 'pl-10' : ''} rounded-lg border ${error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : 'border-[var(--color-border)] focus:ring-[var(--color-accent)]'} bg-white text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input };
