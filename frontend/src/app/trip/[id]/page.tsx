'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTrips } from '@/hooks/useTrips';
import { Skeleton } from '@/components/ui/Skeleton';
import { TripStatusBadge } from '@/components/ui/Badge';
import { MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TripViewPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading, fetchTrip } = useTrips();

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  if (loading || !trip) return <div className="max-w-5xl mx-auto px-4 py-8"><Skeleton className="h-64 w-full mb-4" /><Skeleton className="h-40 w-full" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{trip.name}</h1>
            <p className="text-[var(--color-text-secondary)] flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" />{trip.place}</p>
          </div>
          <div className="flex items-center gap-3">
            <TripStatusBadge status={trip.status} />
            <Link href={`/trip/${id}/builder`}><Button size="sm" variant="secondary">Edit</Button></Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/trip/${id}/packing`}><Button size="sm" variant="secondary">📦 Packing</Button></Link>
          <Link href={`/trip/${id}/notes`}><Button size="sm" variant="secondary">📝 Notes</Button></Link>
          <Link href={`/trip/${id}/invoice`}><Button size="sm" variant="secondary">💰 Invoice</Button></Link>
        </div>

        {/* Day-by-day itinerary */}
        <h2 className="text-xl font-bold mb-4">Itinerary</h2>
        {trip.sections?.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">No itinerary sections yet.</p>
        ) : (
          <div className="space-y-4">
            {trip.sections?.map((section: any, i: number) => (
              <motion.div key={section.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-[var(--color-border)] flex items-center justify-between">
                  <h3 className="font-semibold">{section.title}</h3>
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{new Date(section.date_from).toLocaleDateString()} - {new Date(section.date_to).toLocaleDateString()}
                  </span>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {section.activities?.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-[var(--color-text-muted)]">No activities scheduled</p>
                  ) : (
                    <table className="w-full">
                      <thead><tr className="text-xs text-[var(--color-text-muted)] uppercase">
                        <th className="px-6 py-2 text-left">Physical Activity</th>
                        <th className="px-6 py-2 text-right">Expense</th>
                      </tr></thead>
                      <tbody>
                        {section.activities?.map((act: any) => (
                          <tr key={act.id} className="border-t border-[var(--color-border)]">
                            <td className="px-6 py-3">
                              <p className="font-medium text-sm">{act.custom_name || act.activity?.name}</p>
                              {act.duration_mins && <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Clock className="h-3 w-3" />{act.duration_mins} min</p>}
                            </td>
                            <td className="px-6 py-3 text-right">
                              <span className="font-medium text-sm flex items-center justify-end gap-1"><DollarSign className="h-3.5 w-3.5" />{Number(act.cost).toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="px-6 py-3 bg-gray-50 text-right text-sm font-medium">
                  Section Budget: <span className="text-[var(--color-accent)]">${Number(section.budget).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
