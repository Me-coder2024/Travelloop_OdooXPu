'use client';
import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, icon, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none z-[1]">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            id={id}
            className={`w-full h-10 ${icon ? 'pl-10' : 'pl-3'} pr-10 rounded-lg border ${
              error
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
                : 'border-[var(--color-border)] focus:ring-[var(--color-accent)] hover:border-[var(--color-text-muted)]'
            } bg-white text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
export { Select };
