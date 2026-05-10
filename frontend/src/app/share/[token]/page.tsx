'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import { TripStatusBadge } from '@/components/ui/Badge';
import { MapPin, Calendar, DollarSign, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function SharedTripPage() {
  const { token } = useParams<{ token: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/share/${token}`)
      .then(r => setTrip(r.data.data))
      .catch(() => setError('Trip not found or not public'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><Skeleton className="h-64" /></div>;
  if (error) return <div className="max-w-5xl mx-auto px-4 py-16 text-center"><Globe className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" /><h1 className="text-2xl font-bold mb-2">Trip Not Found</h1><p className="text-[var(--color-text-secondary)]">{error}</p></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-blue-50 rounded-lg px-4 py-2 text-sm text-blue-700 mb-6 flex items-center gap-2"><Globe className="h-4 w-4" />Public shared trip view</div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{trip.name}</h1>
            <p className="text-[var(--color-text-secondary)] flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" />{trip.place}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">By {trip.user?.first_name} {trip.user?.last_name}</p>
          </div>
          <TripStatusBadge status={trip.status} />
        </div>

        {trip.sections?.map((section: any, i: number) => (
          <motion.div key={section.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-[var(--color-border)] mb-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-[var(--color-border)]">
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(section.date_from).toLocaleDateString()} - {new Date(section.date_to).toLocaleDateString()}</p>
            </div>
            {section.activities?.map((act: any) => (
              <div key={act.id} className="px-6 py-3 border-b border-[var(--color-border)] last:border-0 flex items-center justify-between">
                <div><p className="text-sm font-medium">{act.custom_name || act.activity?.name}</p>{act.duration_mins && <p className="text-xs text-[var(--color-text-muted)]"><Clock className="inline h-3 w-3" /> {act.duration_mins} min</p>}</div>
                <span className="text-sm text-[var(--color-text-secondary)]">${Number(act.cost).toFixed(2)}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
