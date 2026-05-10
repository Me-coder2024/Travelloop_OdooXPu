'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { Plus, Trash2, Edit3, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesPage() {
  const { id } = useParams<{ id: string }>();
  const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } = useNotes(id);
  const { trip, fetchTrip } = useTrips();

  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [tab, setTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', note_date: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchNotes(tab === 'all' ? undefined : tab); }, [fetchNotes, tab]);
  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  // Search filter
  let filtered = notes.filter((n: any) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  if (sortBy === 'Newest') filtered = [...filtered].sort((a: any, b: any) => new Date(b.note_date).getTime() - new Date(a.note_date).getTime());
  if (sortBy === 'Oldest') filtered = [...filtered].sort((a: any, b: any) => new Date(a.note_date).getTime() - new Date(b.note_date).getTime());
  if (sortBy === 'Title A-Z') filtered = [...filtered].sort((a: any, b: any) => a.title.localeCompare(b.title));

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    if (editingId) {
      await updateNote(editingId, form);
      setEditingId(null);
    } else {
      await createNote(form);
    }
    setForm({ title: '', content: '', note_date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const startEdit = (note: any) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, note_date: note.note_date?.split('T')[0] || new Date().toISOString().split('T')[0] });
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Search bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar
            value={search} onChange={setSearch}
            placeholder="Search notes..."
            groupByOptions={['All', 'Day', 'Stop']}
            groupBy={groupBy} onGroupByChange={setGroupBy}
            filterOptions={['All', 'Recent', 'With Stop']}
            activeFilter={activeFilter} onFilterChange={setActiveFilter}
            sortOptions={['Newest', 'Oldest', 'Title A-Z']}
            sortBy={sortBy} onSortChange={setSortBy}
          />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Trip notes
        </h1>

        {/* Trip selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '14px', fontWeight: 500, color: '#0F172A', marginBottom: '16px' }}>
          Trip: {trip?.name || 'Loading...'}
          <ChevronDown style={{ width: '14px', height: '14px', color: '#94A3B8', marginLeft: 'auto' }} />
        </div>

        {/* Tabs + Add Note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
            {[
              { v: 'all', l: 'All' },
              { v: 'by-trip', l: 'by Day' },
              { v: 'by-stop', l: 'by Stop' },
            ].map(t => (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                style={{
                  padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                  color: tab === t.v ? '#0F172A' : '#475569',
                  background: tab === t.v ? '#FFFFFF' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.l}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setEditingId(null); setForm({ title: '', content: '', note_date: new Date().toISOString().split('T')[0] }); setShowForm(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}
          >
            <Plus style={{ width: '14px', height: '14px' }} /> Add note
          </button>
        </div>

        {/* Add/Edit form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '14px' }}>{editingId ? 'Edit Note' : 'New Note'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Hotel check-in details" />
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>Content</label>
                    <textarea
                      rows={4}
                      value={form.content}
                      onChange={e => setForm({ ...form, content: e.target.value })}
                      placeholder="check in after 2pm, room 305, breakfast included (9-11am)..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }}
                    />
                  </div>
                  <Input label="Date" type="date" value={form.note_date} onChange={e => setForm({ ...form, note_date: e.target.value })} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <Button onClick={handleCreate} variant="primary">{editingId ? 'Update Note' : 'Save Note'}</Button>
                    <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No notes yet"
            description="Start journaling your trip!"
            actionLabel="Add Note"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((note: any, i: number) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                      {note.title}
                      {note.stop && (
                        <span style={{ color: '#475569', fontWeight: 400 }}> — {note.stop.city?.name || 'Stop'}</span>
                      )}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '6px' }}>
                      {note.content}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar style={{ width: '11px', height: '11px' }} />
                      {note.note_date ? new Date(note.note_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(note)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex' }}
                    >
                      <Edit3 style={{ width: '14px', height: '14px', color: '#475569' }} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px', color: '#991B1B' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
}
