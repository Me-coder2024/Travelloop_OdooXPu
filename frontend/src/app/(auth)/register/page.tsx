'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Globe, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError('');
    setLoading(true);
    try {
      await registerUser(data);
      router.push('/');
    } catch (err: any) {
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors?.[0]) setServerError(fieldErrors[0].message);
      else setServerError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[var(--color-primary)] mb-4">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create your account</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Join Traveloop and start planning</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="first_name" label="First Name" placeholder="First name" icon={<User className="h-4 w-4" />} error={errors.first_name?.message} {...register('first_name')} />
              <Input id="last_name" label="Last Name" placeholder="Last name" error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <Input id="username" label="Username" placeholder="Choose a username" icon={<User className="h-4 w-4" />} error={errors.username?.message} {...register('username')} />
            <Input id="email" label="Email" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
            <Input id="password" label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 digit" icon={<Lock className="h-4 w-4" />} error={errors.password?.message} {...register('password')} />
            <Input id="phone" label="Phone (optional)" placeholder="+91..." icon={<Phone className="h-4 w-4" />} error={errors.phone?.message} {...register('phone')} />
            <div className="grid grid-cols-2 gap-4">
              <Input id="city" label="City" placeholder="Your city" icon={<MapPin className="h-4 w-4" />} error={errors.city?.message} {...register('city')} />
              <Input id="country" label="Country" placeholder="Your country" error={errors.country?.message} {...register('country')} />
            </div>
            <Input id="avatar_url" label="Profile Photo URL (optional)" placeholder="https://..." error={errors.avatar_url?.message} {...register('avatar_url')} />
            <div>
              <label htmlFor="additional_info" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Additional Info</label>
              <textarea id="additional_info" rows={3} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="Tell us about yourself..." {...register('additional_info')} />
            </div>

            {serverError && <p className="text-sm text-[var(--color-danger)] bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>}

            <Button type="submit" className="w-full" size="lg" loading={loading}>Register</Button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Already have an account? <Link href="/login" className="text-[var(--color-accent)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
