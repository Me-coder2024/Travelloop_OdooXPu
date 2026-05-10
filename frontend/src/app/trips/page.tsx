'use client';
import { useEffect, useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { TripStatusBadge } from '@/components/ui/Badge';
import { TripCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Plus } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TripsPage() {
  const { trips, loading, fetchTrips } = useTrips();
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const filtered = activeTab === 'all' ? trips : trips.filter((t: any) => {
    if (activeTab === 'ongoing') return t.status === 'ONGOING';
    if (activeTab === 'upcoming') return t.status === 'PLANNED';
    if (activeTab === 'completed') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1><p className="text-sm text-[var(--color-text-secondary)]">Manage all your travel plans</p>
        <Link href="/trip/new"><Button><Plus className="h-4 w-4 mr-1" />New Trip</Button></Link>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit" aria-label="Trip status filter">
          {['all', 'ongoing', 'upcoming', 'completed'].map(tab => (
            <Tabs.Trigger key={tab} value={tab}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <TripCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No trips found" description="Start planning your next adventure!" actionLabel="Create Trip" onAction={() => router.push('/trip/new')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip: any, i: number) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={`/trip/${trip.id}`} className="block bg-white rounded-xl border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{trip.name}</h3>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mb-2"><MapPin className="h-3.5 w-3.5" />{trip.place}</p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
                  {trip.total_budget && <p className="text-xs text-[var(--color-text-muted)] mt-1">Budget: ${Number(trip.total_budget).toFixed(2)}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
