'use client';
import * as RadixProgress from '@radix-ui/react-progress';

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, className = '', label }: ProgressBarProps) {
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
          <span className="text-sm font-medium text-[var(--color-accent)]">{value}%</span>
        </div>
      )}
      <RadixProgress.Root className="h-2.5 bg-gray-100 rounded-full overflow-hidden" value={value}>
        <RadixProgress.Indicator
          className="h-full bg-gradient-to-r from-[var(--color-accent)] to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </RadixProgress.Root>
    </div>
  );
}
