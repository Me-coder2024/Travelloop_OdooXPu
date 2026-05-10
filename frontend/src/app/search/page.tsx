'use client';
import { useEffect, useState } from 'react';
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (query) params.search = query;
        const [cRes, aRes] = await Promise.all([
          api.get('/cities', { params }),
          api.get('/activities', { params }),
        ]);
        setCities(cRes.data.data || []);
        setActivities(aRes.data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Destinations & Activities</h1>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Search cities, activities..." value={query} onChange={e => setQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm">
          <option value="all">All</option>
          <option value="cities">Cities</option>
          <option value="activities">Activities</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="space-y-8">
          {(filter === 'all' || filter === 'cities') && cities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Cities ({cities.length})</h2>
              <div className="space-y-2">
                {cities.map((city, i) => (
                  <motion.div key={city.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 bg-white rounded-lg border border-[var(--color-border)] p-4 hover:shadow-sm transition-shadow">
                    <img src={city.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100'} alt={city.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium">{city.name}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><MapPin className="h-3 w-3" />{city.country} · {city.region}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">Cost index: {city.cost_index}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'activities') && activities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Activities ({activities.length})</h2>
              <div className="space-y-2">
                {activities.slice(0, 20).map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 bg-white rounded-lg border border-[var(--color-border)] p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{act.name}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">{act.city?.name || 'Various'} · {act.category}</p>
                    </div>
                    <span className="text-sm font-medium">${Number(act.avg_cost).toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
