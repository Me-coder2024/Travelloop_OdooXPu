'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function TripStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    PLANNED: { label: 'Planned', variant: 'info' },
    ONGOING: { label: 'Ongoing', variant: 'warning' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={variant}>{label}</Badge>;
}
