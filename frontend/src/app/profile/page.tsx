'use client';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TripStatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { User, Edit3, MapPin, Calendar, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { trips, loading, fetchTrips } = useTrips();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);
  useEffect(() => { if (user) setForm({ first_name: user.first_name, last_name: user.last_name, phone: user.phone || '', city: user.city || '', country: user.country || '', additional_info: user.additional_info || '', avatar_url: user.avatar_url || '' }); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try { await api.patch('/users/me', form); await refreshUser(); setEditing(false); }
    catch (e) { console.error(e); } finally { setSaving(false); }
  };

  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}><Skeleton className="h-40 w-full" style={{ maxWidth: '400px' }} /></div>;

  const planned = trips.filter((t: any) => t.status === 'PLANNED');
  const completed = trips.filter((t: any) => t.status === 'COMPLETED');

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Profile Header */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: '72px', height: '72px', borderRadius: '999px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User style={{ width: '32px', height: '32px', color: '#94A3B8' }} />}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>{user.first_name} {user.last_name}</h1>
                  <p style={{ fontSize: '13px', color: '#475569', wordBreak: 'break-all' }}>@{user.username} · {user.email}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
                  <Edit3 style={{ width: '14px', height: '14px', marginRight: '4px' }} />{editing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              {!editing && user.city && (
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '13px', height: '13px' }} />{user.city}, {user.country}
                </p>
              )}
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <Input label="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                <Input label="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <Input label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
              <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input label="Avatar URL" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} />
              <Button onClick={handleSave} loading={saving}><Save style={{ width: '14px', height: '14px', marginRight: '6px' }} />Save Changes</Button>
            </div>
          )}
        </div>

        {/* Trips sections */}
        {[{ title: 'Preplanned Trips', data: planned }, { title: 'Previous Trips', data: completed }].map(section => (
          <div key={section.title} style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>{section.title}</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{[1,2].map(i => <Skeleton key={i} className="h-28" />)}</div>
            ) : section.data.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>No trips</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.data.map((trip: any) => (
                  <div key={trip.id} style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>{trip.name}</h3>
                      <TripStatusBadge status={trip.status} />
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <MapPin style={{ width: '13px', height: '13px' }} />{trip.place}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar style={{ width: '12px', height: '12px' }} />{new Date(trip.start_date).toLocaleDateString()}
                    </p>
                    <Link href={`/trip/${trip.id}`}><Button size="sm" variant="ghost" style={{ marginTop: '10px' }}>View</Button></Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
