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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>My Trips</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Manage all your travel plans</p>
        </div>
        <Link href="/trip/new"><Button variant="primary"><Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />New Trip</Button></Link>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', borderRadius: '8px', padding: '3px', marginBottom: '20px', overflowX: 'auto' }}>
        {['all', 'ongoing', 'upcoming', 'completed'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: activeTab === tab ? '#FFFFFF' : 'transparent', color: activeTab === tab ? '#0F172A' : '#475569' }}
          >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <TripCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No trips found" description="Start planning your next adventure!" actionLabel="Create Trip" onAction={() => router.push('/trip/new')} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
          {filtered.map((trip: any, i: number) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={`/trip/${trip.id}`} style={{ display: 'block', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden', textDecoration: 'none' }}>
                <div style={{ height: '3px', background: '#1D4ED8' }} />
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>{trip.name}</h3>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><MapPin style={{ width: '14px', height: '14px' }} />{trip.place}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar style={{ width: '12px', height: '12px' }} />{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
                  {trip.total_budget && <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Budget: ${Number(trip.total_budget).toFixed(2)}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
