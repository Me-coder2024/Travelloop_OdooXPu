import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Login - Traveloop', description: 'Sign in to your Traveloop account.' };
export default function AuthLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
