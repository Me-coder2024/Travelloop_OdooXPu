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

  if (!user) return <div className="flex justify-center py-20"><Skeleton className="h-40 w-96" /></div>;

  const planned = trips.filter((t: any) => t.status === 'PLANNED');
  const completed = trips.filter((t: any) => t.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" /> : <User className="h-10 w-10 text-[var(--color-text-muted)]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                  <p className="text-[var(--color-text-secondary)]">@{user.username} · {user.email}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}><Edit3 className="h-3.5 w-3.5 mr-1" />{editing ? 'Cancel' : 'Edit'}</Button>
              </div>
              {!editing && user.city && <p className="text-sm text-[var(--color-text-muted)] mt-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.city}, {user.country}</p>}
            </div>
          </div>

          {editing && (
            <div className="mt-6 space-y-4 border-t border-[var(--color-border)] pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                <Input label="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <Input label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
              <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input label="Avatar URL" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} />
              <Button onClick={handleSave} loading={saving}><Save className="h-4 w-4 mr-1" />Save Changes</Button>
            </div>
          )}
        </div>

        {/* Trips */}
        {[{ title: 'Preplanned Trips', data: planned }, { title: 'Previous Trips', data: completed }].map(section => (
          <div key={section.title} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1,2].map(i => <Skeleton key={i} className="h-28" />)}</div>
            : section.data.length === 0 ? <p className="text-sm text-[var(--color-text-muted)]">No trips</p>
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.data.map((trip: any) => (
                  <div key={trip.id} className="bg-white rounded-xl border border-[var(--color-border)] p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{trip.name}</h3>
                      <TripStatusBadge status={trip.status} />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><MapPin className="h-3 w-3" />{trip.place}</p>
                    <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" />{new Date(trip.start_date).toLocaleDateString()}</p>
                    <Link href={`/trip/${trip.id}`}><Button size="sm" variant="secondary" className="mt-3">View</Button></Link>
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
