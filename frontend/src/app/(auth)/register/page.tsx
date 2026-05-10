'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Globe, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
            <Globe style={{ width: '22px', height: '22px', color: '#1D4ED8' }} />
            Traveloop
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px 28px', border: '1px solid #E2E8F0' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
              Start planning your next adventure
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input id="first_name" label="First Name" placeholder="First name" icon={<User style={{ width: '16px', height: '16px' }} />} error={errors.first_name?.message} {...register('first_name')} />
              <Input id="last_name" label="Last Name" placeholder="Last name" error={errors.last_name?.message} {...register('last_name')} />
            </div>

            <Input id="username" label="Username" placeholder="Choose a unique username" icon={<User style={{ width: '16px', height: '16px' }} />} error={errors.username?.message} helperText="This will be your public profile identifier" {...register('username')} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input id="email" label="Email" type="email" placeholder="you@example.com" icon={<Mail style={{ width: '16px', height: '16px' }} />} error={errors.email?.message} {...register('email')} />
              <Input id="phone" label="Phone" placeholder="+91..." icon={<Phone style={{ width: '16px', height: '16px' }} />} error={errors.phone?.message} {...register('phone')} />
            </div>

            <Input id="password" label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 digit" icon={<Lock style={{ width: '16px', height: '16px' }} />} error={errors.password?.message} {...register('password')} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input id="city" label="City" placeholder="Your city" icon={<MapPin style={{ width: '16px', height: '16px' }} />} error={errors.city?.message} {...register('city')} />
              <Input id="country" label="Country" placeholder="Your country" error={errors.country?.message} {...register('country')} />
            </div>

            <Input id="avatar_url" label="Profile Photo URL" placeholder="https://..." helperText="Optional — paste a link to your profile photo" error={errors.avatar_url?.message} {...register('avatar_url')} />

            <Textarea id="additional_info" label="About You" rows={2} placeholder="Tell us about yourself, your travel interests..." helperText="Optional — helps us personalize your experience" {...register('additional_info')} />

            {serverError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#991B1B', fontWeight: 500 }}>
                {serverError}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '4px' }}>
              Create Account
              {!loading && <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '6px' }} />}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '14px', color: '#475569' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
