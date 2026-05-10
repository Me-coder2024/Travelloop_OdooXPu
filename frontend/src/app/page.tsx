'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Plane, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TripCardSkeleton } from '@/components/ui/Skeleton';
import { TripStatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import api from '@/lib/api';

export default function LandingPage() {
  const { user } = useAuth();
  const [cities, setCities] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
  }, [user]);

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Plan Your Perfect<br /><span className="text-blue-400">Adventure</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl">Create itineraries, track expenses, and share your travel experiences with Traveloop.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? '/trip/new' : '/register'}>
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plane className="h-5 w-5 mr-2" />Plan a Trip
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="secondary" className="border-white/20 text-white hover:bg-white/10">
                  <Search className="h-5 w-5 mr-2" />Explore Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-border)] p-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Search cities, countries, or destinations..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm border-none outline-none bg-transparent placeholder:text-[var(--color-text-muted)]" />
        </div>
      </div>

      {/* Top Regional Selections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Top Regional Selections</h2>
          <Link href="/search" className="text-sm text-[var(--color-accent)] font-medium hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <TripCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 8).map((city, i) => (
              <motion.div key={city.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <Link href={`/search?city=${city.name}`} className="group block bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img src={city.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="h-3 w-3" />{city.country}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{city.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Trips */}
      {user && trips.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Your Trips</h2>
            <Link href="/trips" className="text-sm text-[var(--color-accent)] font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 6).map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/trip/${trip.id}`} className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{trip.name}</h3>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mb-2"><MapPin className="h-3.5 w-3.5" />{trip.place}</p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
