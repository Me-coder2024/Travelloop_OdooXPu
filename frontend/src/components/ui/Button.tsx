'use client';
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, style, ...props }, ref) => {
    const sizeMap: Record<string, React.CSSProperties> = {
      sm: { height: '36px', padding: '0 14px', fontSize: '13px', gap: '6px' },
      md: { height: '40px', padding: '0 18px', fontSize: '14px', gap: '8px' },
      lg: { height: '44px', padding: '0 22px', fontSize: '14px', gap: '8px' },
    };

    const variantMap: Record<string, React.CSSProperties> = {
      primary: {
        background: '#1D4ED8',
        color: '#FFFFFF',
        border: 'none',
      },
      secondary: {
        background: '#F1F5F9',
        color: '#0F172A',
        border: 'none',
      },
      ghost: {
        background: 'transparent',
        color: '#334155',
        border: '1px solid #E2E8F0',
      },
      destructive: {
        background: '#991B1B',
        color: '#FFFFFF',
        border: 'none',
      },
    };

    const isDisabled = disabled || loading;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      borderRadius: '8px',
      letterSpacing: '-0.01em',
      transition: 'background 0.15s ease',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      textDecoration: 'none',
      ...sizeMap[size],
      ...variantMap[variant],
      ...(isDisabled ? { background: '#F1F5F9', color: '#94A3B8' } : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        className={className}
        disabled={isDisabled}
        style={baseStyle}
        {...props}
      >
        {loading && (
          <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { Button };
