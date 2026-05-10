'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTrips } from '@/hooks/useTrips';
import { Skeleton } from '@/components/ui/Skeleton';
import { SearchBar } from '@/components/ui/SearchBar';
import { TripStatusBadge } from '@/components/ui/Badge';
import { MapPin, Calendar, DollarSign, Clock, ChevronLeft, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TripViewPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading, fetchTrip } = useTrips();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  if (loading || !trip) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-12 w-full mb-6" />
      <Skeleton className="h-60 w-full mb-4" />
      <Skeleton className="h-60 w-full" />
    </div>
  );

  // Filter sections by search
  const filteredSections = (trip.sections || []).filter((s: any) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.activities?.some((a: any) => (a.custom_name || a.activity?.name || '').toLowerCase().includes(search.toLowerCase()))
  );

  // Compute totals
  const totalBudget = Number(trip.total_budget || 0);
  const totalSectionBudget = filteredSections.reduce((s: number, sec: any) => s + Number(sec.budget || 0), 0);
  const totalExpenses = filteredSections.reduce((s: number, sec: any) =>
    s + (sec.activities || []).reduce((a: number, act: any) => a + Number(act.cost || 0), 0), 0
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar
            value={search} onChange={setSearch}
            placeholder="Search sections, activities..."
            groupByOptions={['All', 'Day', 'Budget']}
            groupBy="All" onGroupByChange={() => {}}
            filterOptions={['All', ...Array.from(new Set(filteredSections.map((s: any) => s.title))) as string[]]}
            activeFilter={activeFilter} onFilterChange={setActiveFilter}
            sortOptions={['Default', 'Date ↑', 'Date ↓', 'Budget ↑', 'Budget ↓']}
            sortBy={sortBy} onSortChange={setSortBy}
          />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '6px' }}>
          Itinerary for {trip.place || trip.name}
        </h1>
        <p style={{ fontSize: '13px', color: '#475569', textAlign: 'center', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <MapPin style={{ width: '13px', height: '13px' }} />{trip.place}
          <span style={{ margin: '0 6px', color: '#E2E8F0' }}>|</span>
          <Calendar style={{ width: '13px', height: '13px' }} />
          {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : ''} — {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : ''}
        </p>

        {/* Quick nav buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href={`/trip/${id}/builder`}><Button size="sm" variant="secondary">✏️ Edit Itinerary</Button></Link>
          <Link href={`/trip/${id}/packing`}><Button size="sm" variant="secondary">📦 Packing</Button></Link>
          <Link href={`/trip/${id}/notes`}><Button size="sm" variant="secondary">📝 Notes</Button></Link>
          <Link href={`/trip/${id}/invoice`}><Button size="sm" variant="secondary">💰 Invoice</Button></Link>
        </div>

        {/* ── Day Sections ── */}
        {filteredSections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '12px' }}>No itinerary sections yet.</p>
            <Link href={`/trip/${id}/builder`}><Button variant="primary" size="sm">Build Itinerary</Button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredSections.map((section: any, si: number) => (
              <motion.div key={section.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
                {/* Day label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    {section.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar style={{ width: '11px', height: '11px' }} />
                    {new Date(section.date_from).toLocaleDateString()} - {new Date(section.date_to).toLocaleDateString()}
                  </span>
                </div>

                {/* Activities table header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', marginBottom: '6px' }}>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physical Activity</span>
                  <span style={{ width: '100px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Expense</span>
                </div>

                {/* Activity rows with flow arrows */}
                {section.activities?.length === 0 ? (
                  <p style={{ padding: '14px 16px', fontSize: '13px', color: '#94A3B8', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>No activities scheduled</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {section.activities?.map((act: any, ai: number) => (
                      <div key={act.id}>
                        {/* Activity row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px 16px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{act.custom_name || act.activity?.name}</p>
                            {act.duration_mins && (
                              <p style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <Clock style={{ width: '11px', height: '11px' }} />{act.duration_mins} min
                              </p>
                            )}
                          </div>
                          <div style={{ width: '100px', flexShrink: 0, background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px 14px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                            ₹{Number(act.cost).toFixed(0)}
                          </div>
                        </div>
                        {/* Flow arrow between activities */}
                        {ai < (section.activities?.length || 0) - 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                            <ArrowDown style={{ width: '16px', height: '16px', color: '#94A3B8' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Section budget */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', padding: '8px 16px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    Section Budget: <span style={{ color: '#1D4ED8' }}>₹{Number(section.budget).toFixed(0)}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Budget Summary ── */}
        {filteredSections.length > 0 && (
          <div style={{ marginTop: '32px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Budget Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Trip Budget:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{totalBudget.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Section Budgets Total:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{totalSectionBudget.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Activity Expenses:</span>
                <span style={{ fontWeight: 600, color: '#991B1B' }}>-₹{totalExpenses.toFixed(0)}</span>
              </div>
              <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Remaining:</span>
                <span style={{ fontWeight: 700, color: (totalBudget - totalExpenses) >= 0 ? '#065F46' : '#991B1B' }}>
                  ₹{(totalBudget - totalExpenses).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
