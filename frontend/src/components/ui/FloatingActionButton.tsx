'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface FloatingActionButtonProps {
  href: string;
  label: string;
}

export function FloatingActionButton({ href, label }: FloatingActionButtonProps) {
  return (
    <Link
      href={href}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 40,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        height: '48px',
        padding: '0 20px',
        background: '#1D4ED8',
        color: '#FFFFFF',
        fontWeight: 600,
        fontSize: '14px',
        borderRadius: '999px',
        textDecoration: 'none',
        transition: 'background 0.15s',
      }}
      aria-label={label}
    >
      <Plus style={{ width: '20px', height: '20px' }} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
