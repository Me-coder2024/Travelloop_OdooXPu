'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Globe, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[var(--color-primary)] mb-4">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Sign in to your Traveloop account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="username" label="Username" placeholder="Enter your username"
              icon={<User className="h-4 w-4" />}
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              id="password" label="Password" type="password" placeholder="Enter your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--color-accent)] font-medium hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
