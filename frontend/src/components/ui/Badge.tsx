'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantMap: Record<string, React.CSSProperties> = {
  default: { background: '#F1F5F9', color: '#334155', border: '1px solid #E2E8F0' },
  success: { background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' },
  warning: { background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' },
  danger:  { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' },
  info:    { background: '#EFF6FF', color: '#1E3A5F', border: '1px solid #BFDBFE' },
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...variantMap[variant],
      }}
    >
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
