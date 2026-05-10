'use client';
import { useEffect, useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

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

  // Apply filter
  const filteredCities = useMemo(() => {
    if (activeFilter === 'Cities only') return cities;
    if (activeFilter === 'Activities only') return [];
    return cities;
  }, [cities, activeFilter]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'Activities only') return activities;
    if (activeFilter === 'Cities only') return [];
    return activities;
  }, [activities, activeFilter]);

  // Apply sort
  const sortedCities = useMemo(() => {
    const arr = [...filteredCities];
    if (sortBy === 'Name A-Z') arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Name Z-A') arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === 'Cost ↑') arr.sort((a, b) => a.cost_index - b.cost_index);
    if (sortBy === 'Cost ↓') arr.sort((a, b) => b.cost_index - a.cost_index);
    return arr;
  }, [filteredCities, sortBy]);

  const sortedActivities = useMemo(() => {
    const arr = [...filteredActivities];
    if (sortBy === 'Name A-Z') arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Name Z-A') arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === 'Cost ↑') arr.sort((a, b) => Number(a.avg_cost) - Number(b.avg_cost));
    if (sortBy === 'Cost ↓') arr.sort((a, b) => Number(b.avg_cost) - Number(a.avg_cost));
    return arr;
  }, [filteredActivities, sortBy]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '20px' }}>Explore Destinations & Activities</h1>

      {/* Search bar */}
      <div style={{ marginBottom: '24px' }}>
        <SearchBar
          value={query} onChange={setQuery}
          placeholder="Search cities, activities..."
          groupByOptions={['All', 'Region', 'Category']}
          groupBy={groupBy} onGroupByChange={setGroupBy}
          filterOptions={['All', 'Cities only', 'Activities only']}
          activeFilter={activeFilter} onFilterChange={setActiveFilter}
          sortOptions={['Default', 'Name A-Z', 'Name Z-A', 'Cost ↑', 'Cost ↓']}
          sortBy={sortBy} onSortChange={setSortBy}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sortedCities.length > 0 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Cities ({sortedCities.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedCities.map((city, i) => (
                  <motion.div key={city.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                    <img src={city.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100'} alt={city.name} style={{ height: '48px', width: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{city.name}</h3>
                      <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin style={{ width: '12px', height: '12px' }} />{city.country} · {city.region}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>Cost index: {city.cost_index}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {sortedActivities.length > 0 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Activities ({sortedActivities.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedActivities.slice(0, 20).map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{act.name}</h3>
                      <p style={{ fontSize: '12px', color: '#475569' }}>{act.city?.name || 'Various'} · {act.category}</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>${Number(act.avg_cost).toFixed(0)}</span>
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
