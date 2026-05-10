'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema, TripInput } from '@/lib/validators';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function NewTripPage() {
  const { createTrip } = useTrips();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<TripInput>({ resolver: zodResolver(tripSchema) });

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data.data || []));
    api.get('/activities').then(r => setActivities(r.data.data || []));
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">Plan your next adventure</p>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input id="name" label="Trip Name" placeholder="European Adventure..." icon={<MapPin className="h-4 w-4" />} error={errors.name?.message} {...register('name')} />

            <div>
              <label className="block text-sm font-medium mb-1.5">Select Place</label>
              <select className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" {...register('place')}>
                <option value="">Choose a destination...</option>
                {cities.map(c => <option key={c.id} value={c.name}>{c.name}, {c.country}</option>)}
              </select>
              {errors.place && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.place.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input id="start_date" label="Start Date" type="date" icon={<Calendar className="h-4 w-4" />} error={errors.start_date?.message} {...register('start_date')} />
              <Input id="end_date" label="End Date" type="date" icon={<Calendar className="h-4 w-4" />} error={errors.end_date?.message} {...register('end_date')} />
            </div>

            <Input id="total_budget" label="Total Budget (optional)" type="number" placeholder="5000" icon={<DollarSign className="h-4 w-4" />} {...register('total_budget')} />

            <div>
              <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="Describe your trip..." {...register('description')} />
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>Create Trip & Build Itinerary</Button>
          </form>
        </div>

        {/* Activity Suggestions */}
        {activities.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Suggested Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.slice(0, 6).map((act, i) => (
                <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-[var(--color-border)] p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-sm">{act.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{act.city?.name || 'Various'} · ${Number(act.avg_cost).toFixed(0)}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{act.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
