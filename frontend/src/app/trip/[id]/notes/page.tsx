'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Search, Plus, Trash2, Edit3, Calendar, MapPin } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

export default function NotesPage() {
  const { id } = useParams<{ id: string }>();
  const { notes, loading, fetchNotes, createNote, deleteNote } = useNotes(id);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', note_date: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchNotes(filter === 'all' ? undefined : filter); }, [fetchNotes, filter]);

  const filtered = notes.filter((n: any) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    await createNote(form);
    setForm({ title: '', content: '', note_date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-3xl font-bold">Trip Notes</h1><p className="text-[var(--color-text-secondary)]">Journal your travel experiences</p></div>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" />Add Note</Button>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
        </div>

        <Tabs.Root value={filter} onValueChange={setFilter} className="mb-6">
          <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[{ v: 'all', l: 'All' }, { v: 'by-trip', l: 'By Trip' }, { v: 'by-stop', l: 'By Stop' }].map(t => (
              <Tabs.Trigger key={t.v} value={t.v} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === t.v ? 'bg-white shadow-sm' : 'text-[var(--color-text-secondary)]'}`}>{t.l}</Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
            <h3 className="font-semibold mb-4">New Note</h3>
            <div className="space-y-3">
              <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Hotel Check-in" />
              <div><label className="block text-sm font-medium mb-1.5">Content</label><textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm" placeholder="Room details..." /></div>
              <Input label="Date" type="date" value={form.note_date} onChange={e => setForm({ ...form, note_date: e.target.value })} />
              <div className="flex gap-2"><Button onClick={handleCreate}>Save Note</Button><Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
            </div>
          </motion.div>
        )}

        {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28" />)}</div>
        : filtered.length === 0 ? <EmptyState title="No notes yet" description="Start journaling your trip!" actionLabel="Add Note" onAction={() => setShowForm(true)} />
        : (
          <div className="space-y-3">
            {filtered.map((note: any, i: number) => (
              <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-[var(--color-border)] p-5 group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{note.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteNote(note.id)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap mb-3">{note.content}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(note.note_date).toLocaleDateString()}</span>
                  {note.stop && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{note.stop.city?.name}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
