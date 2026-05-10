'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Globe, User, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError('');
    setLoading(true);
    try {
      await login(data.username, data.password);
      router.push('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            <Globe style={{ width: '22px', height: '22px', color: '#1D4ED8' }} />
            Traveloop
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px 28px', border: '1px solid #E2E8F0' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              id="username"
              label="Username"
              placeholder="Enter your username"
              icon={<User style={{ width: '16px', height: '16px' }} />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock style={{ width: '16px', height: '16px' }} />}
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#991B1B', fontWeight: 500 }}>
                {serverError}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '4px' }}>
              Sign In
              {!loading && <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '6px' }} />}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '14px', color: '#475569' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
