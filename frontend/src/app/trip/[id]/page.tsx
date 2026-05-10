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

  if (loading || !trip) return <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}><Skeleton className="h-48 w-full" style={{ marginBottom: '16px' }} /><Skeleton className="h-40 w-full" /></div>;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{trip.name}</h1>
            <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px' }} />{trip.place}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <TripStatusBadge status={trip.status} />
            <Link href={`/trip/${id}/builder`}><Button size="sm" variant="secondary">Edit</Button></Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Link href={`/trip/${id}/packing`}><Button size="sm" variant="secondary">📦 Packing</Button></Link>
          <Link href={`/trip/${id}/notes`}><Button size="sm" variant="secondary">📝 Notes</Button></Link>
          <Link href={`/trip/${id}/invoice`}><Button size="sm" variant="secondary">💰 Invoice</Button></Link>
        </div>

        {/* Itinerary */}
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Itinerary</h2>
        {trip.sections?.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#94A3B8' }}>No itinerary sections yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trip.sections?.map((section: any, i: number) => (
              <motion.div key={section.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{section.title}</h3>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar style={{ width: '12px', height: '12px' }} />
                    {new Date(section.date_from).toLocaleDateString()} - {new Date(section.date_to).toLocaleDateString()}
                  </span>
                </div>

                {/* Activities */}
                {section.activities?.length === 0 ? (
                  <p style={{ padding: '14px 16px', fontSize: '13px', color: '#94A3B8' }}>No activities scheduled</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '320px' }}>
                      <thead>
                        <tr style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' as const }}>
                          <th style={{ padding: '8px 16px', textAlign: 'left' }}>Activity</th>
                          <th style={{ padding: '8px 16px', textAlign: 'right' }}>Expense</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.activities?.map((act: any) => (
                          <tr key={act.id} style={{ borderTop: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 16px' }}>
                              <p style={{ fontWeight: 500, color: '#0F172A', fontSize: '13px' }}>{act.custom_name || act.activity?.name}</p>
                              {act.duration_mins && <p style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Clock style={{ width: '11px', height: '11px' }} />{act.duration_mins} min</p>}
                            </td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 500, color: '#0F172A' }}>
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}><DollarSign style={{ width: '13px', height: '13px' }} />{Number(act.cost).toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section budget footer */}
                <div style={{ padding: '10px 16px', background: '#F8FAFC', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                  Section Budget: <span style={{ color: '#1D4ED8' }}>${Number(section.budget).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
