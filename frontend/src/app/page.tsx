'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Plane, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { TripCardSkeleton } from '@/components/ui/Skeleton';
import { TripStatusBadge } from '@/components/ui/Badge';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import api from '@/lib/api';

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const [cities, setCities] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

  useEffect(() => {
    if (authLoading) return;
    const load = async () => {
      try {
        const [citiesRes, tripsRes] = await Promise.all([
          api.get('/cities'),
          user ? api.get('/trips') : Promise.resolve({ data: { data: [] } }),
        ]);
        setCities(citiesRes.data.data || []);
        setTrips(tripsRes.data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user, authLoading]);

  let filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );
  if (activeFilter !== 'All') {
    filtered = filtered.filter(c => c.region?.toLowerCase() === activeFilter.toLowerCase());
  }
  if (sortBy === 'Name A-Z') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'Name Z-A') filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
  if (sortBy === 'Cost ↑') filtered = [...filtered].sort((a, b) => a.cost_index - b.cost_index);
  if (sortBy === 'Cost ↓') filtered = [...filtered].sort((a, b) => b.cost_index - a.cost_index);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <section style={{ background: '#0F172A', color: '#F8FAFC', padding: 'clamp(40px, 8vw, 64px) 0 clamp(48px, 8vw, 72px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Discover your next destination
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '14px', color: '#F8FAFC' }}>
              Plan Your Perfect<br />Adventure
            </h1>
            <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '480px', lineHeight: 1.6, marginBottom: '28px' }}>
              Create itineraries, track expenses, and share your travel experiences with Traveloop.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link href={user ? '/trip/new' : '/register'}>
                <Button size="lg" variant="primary">
                  <Plane style={{ width: '16px', height: '16px', marginRight: '8px' }} />Plan a Trip
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="ghost" style={{ background: 'transparent', color: '#F8FAFC', border: '1px solid #334155' }}>
                  <Search style={{ width: '16px', height: '16px', marginRight: '8px' }} />Explore Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px 0' }}>
        <SearchBar
          value={search} onChange={setSearch}
          placeholder="Search cities, countries, or destinations..."
          groupByOptions={['All', 'Region', 'Country']}
          groupBy={groupBy} onGroupByChange={setGroupBy}
          filterOptions={['All', ...Array.from(new Set(cities.map(c => c.region).filter(Boolean)))]}
          activeFilter={activeFilter} onFilterChange={setActiveFilter}
          sortOptions={['Default', 'Name A-Z', 'Name Z-A', 'Cost ↑', 'Cost ↓']}
          sortBy={sortBy} onSortChange={setSortBy}
        />
      </div>

      {/* ── Destinations ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>Top Regional Selections</h2>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>Popular destinations chosen by travelers</p>
          </div>
          <Link href="/search" style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <TripCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No destinations found"
            description={search ? `No results for "${search}".` : "Destinations will appear here soon."}
            icon={<MapPin style={{ width: '24px', height: '24px', color: '#94A3B8' }} />}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '14px' }}>
            {filtered.slice(0, 8).map((city, i) => (
              <motion.div key={city.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                <Link href={`/search?city=${city.name}`} style={{ display: 'block', background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', textDecoration: 'none', transition: 'border-color 0.15s' }}>
                  <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                    <img
                      src={city.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                      alt={city.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 14px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>{city.name}</h3>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin style={{ width: '11px', height: '11px' }} />{city.country}
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px 12px' }}>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {city.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Previous Trips ── */}
      {user && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>Previous Trips</h2>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>Your recent travel plans</p>
            </div>
            {trips.length > 0 && (
              <Link href="/trips" style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <TripCardSkeleton key={i} />)}
            </div>
          ) : trips.length === 0 ? (
            <EmptyState
              title="No trips yet"
              description="Start planning your first adventure!"
              actionLabel="Plan a Trip"
              onAction={() => window.location.href = '/trip/new'}
              icon={<Plane style={{ width: '24px', height: '24px', color: '#94A3B8' }} />}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '14px' }}>
              {trips.slice(0, 8).map((trip, i) => (
                <motion.div key={trip.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/trip/${trip.id}`} style={{ display: 'block', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden', textDecoration: 'none' }}>
                    <div style={{ height: '3px', background: '#1D4ED8' }} />
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>{trip.name}</h3>
                        <TripStatusBadge status={trip.status} />
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <MapPin style={{ width: '13px', height: '13px' }} />{trip.place}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {user && <FloatingActionButton href="/trip/new" label="Plan a Trip" />}
    </div>
  );
}
