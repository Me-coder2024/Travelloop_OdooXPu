'use client';
import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxCharacters?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, showCount, maxCharacters, id, value, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div style={{ width: '100%' }}>
        {label && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
              {label}
            </label>
            {showCount && maxCharacters && (
              <span style={{ fontSize: '12px', color: charCount > maxCharacters ? '#991B1B' : '#94A3B8' }}>
                {charCount}/{maxCharacters}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={id}
          value={value}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: error ? '1px solid #991B1B' : '1px solid #E2E8F0',
            background: '#FFFFFF',
            fontSize: '14px',
            color: '#0F172A',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            minHeight: '80px',
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
Textarea.displayName = 'Textarea';
export { Textarea };
