'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema, TripInput } from '@/lib/validators';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SuggestionCardSkeleton } from '@/components/ui/Skeleton';
import { MapPin, Calendar, DollarSign, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewTripPage() {
  const { createTrip } = useTrips();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<TripInput>({ resolver: zodResolver(tripSchema) as any });

  useEffect(() => {
    Promise.all([
      api.get('/cities').then(r => setCities(r.data.data || [])),
      api.get('/activities').then(r => setActivities(r.data.data || [])),
    ]).finally(() => setCitiesLoading(false));
  }, []);

  const onSubmit = async (data: TripInput) => {
    setLoading(true);
    try {
      const trip = await createTrip(data);
      router.push(`/trip/${trip.id}/builder`);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Plan a new trip</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Fill in the details below to start building your itinerary
          </p>
        </div>

        {/* Main form card */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          {/* Accent bar */}
          <div style={{ height: '3px', background: '#1D4ED8' }} />

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Trip Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  id="name"
                  label="Trip Name"
                  placeholder="e.g. European Summer Adventure"
                  icon={<MapPin className="h-4 w-4" />}
                  error={errors.name?.message}
                  helperText="Give your trip a memorable name"
                  {...register('name')}
                />
              </motion.div>

              {/* Place selector */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Select a Place
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <select
                    className={`w-full h-10 pl-10 pr-10 rounded-lg border ${
                      errors.place
                        ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
                        : 'border-[var(--color-border)] focus:ring-[var(--color-accent)] hover:border-[var(--color-text-muted)]'
                    } bg-white text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer`}
                    {...register('place')}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose a destination...</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.name}>{c.name}, {c.country}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.place && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.place.message}</p>}
              </motion.div>

              {/* Date pickers side-by-side */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Input
                  id="start_date"
                  label="Start Date"
                  type="date"
                  icon={<Calendar className="h-4 w-4" />}
                  error={errors.start_date?.message}
                  {...register('start_date')}
                />
                <Input
                  id="end_date"
                  label="End Date"
                  type="date"
                  icon={<Calendar className="h-4 w-4" />}
                  error={errors.end_date?.message}
                  {...register('end_date')}
                />
              </motion.div>

              {/* Budget */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Input
                  id="total_budget"
                  label="Total Budget"
                  type="number"
                  placeholder="5000"
                  icon={<DollarSign className="h-4 w-4" />}
                  helperText="Optional — helps track spending during the trip"
                  {...register('total_budget')}
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] hover:border-[var(--color-text-muted)] transition-all duration-200 resize-none placeholder:text-[var(--color-text-muted)]"
                  placeholder="Describe your trip plans, goals, and must-see places..."
                  {...register('description')}
                />
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Optional — add notes for yourself</p>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Button type="submit" size="lg" className="w-full" variant="primary" loading={loading}>
                  Create Trip & Build Itinerary
                  {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                </Button>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
            <h2 className="text-xl font-semibold tracking-tight">Suggestions for Places to Visit</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 -mt-4 ml-7">
            Popular activities and things to do at various destinations
          </p>

          {citiesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <SuggestionCardSkeleton key={i} />)}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[var(--color-border)]">
              <Sparkles className="h-8 w-8 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-secondary)]">No suggestions available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.slice(0, 6).map((act, i) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="group bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md hover:border-[var(--color-border-subtle)] transition-all duration-300"
                >
                  {/* Activity color bar */}
                  <div style={{ height: '96px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin className="h-8 w-8 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm text-[var(--color-text-primary)]">{act.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {act.city?.name || 'Various'}
                      <span className="mx-1">·</span>
                      <DollarSign className="h-3 w-3" />
                      {Number(act.avg_cost).toFixed(0)}
                    </p>
                    <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {act.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
