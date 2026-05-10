'use client';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, icon, id, ...props }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            htmlFor={id}
            style={{ color: '#0F172A', fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {icon && (
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex' }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            style={{
              width: '100%',
              height: '42px',
              padding: icon ? '0 14px 0 38px' : '0 14px',
              borderRadius: '8px',
              border: error ? '1px solid #991B1B' : '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '14px',
              color: '#0F172A',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = error ? '#991B1B' : '#1D4ED8';
              e.target.style.boxShadow = error ? 'none' : '0 0 0 2px #BFDBFE';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#991B1B' : '#E2E8F0';
              e.target.style.boxShadow = 'none';
            }}
            className={className}
            {...props}
          />
        </div>
        {error && (
          <p style={{ marginTop: '4px', fontSize: '12px', color: '#991B1B', fontWeight: 500 }} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{ marginTop: '4px', fontSize: '12px', color: '#94A3B8' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input };
