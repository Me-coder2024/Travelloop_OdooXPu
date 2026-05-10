'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sectionSchema, SectionInput } from '@/lib/validators';
import { useSections } from '@/hooks/useSections';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, Trash2, Calendar, DollarSign, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { sections, loading, fetchSections, createSection, deleteSection } = useSections(id);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionInput>({ resolver: zodResolver(sectionSchema) });

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const onSubmit = async (data: SectionInput) => {
    setCreating(true);
    try {
      await createSection({ ...data, order_index: sections.length });
      reset();
      setShowForm(false);
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Build Itinerary</h1>
            <p className="text-[var(--color-text-secondary)]">Add sections to organize your trip</p>
          </div>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" />Add Section</Button>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}</div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {sections.map((section: any, i: number) => (
                <motion.div key={section.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl border border-[var(--color-border)] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-[var(--color-text-muted)] cursor-grab" />
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                    </div>
                    <button onClick={() => deleteSection(section.id)} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  {section.description && <p className="text-sm text-[var(--color-text-secondary)] mb-3">{section.description}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(section.date_from).toLocaleDateString()} → {new Date(section.date_to).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />Budget: ${Number(section.budget).toFixed(2)}</span>
                  </div>
                  {section.activities?.length > 0 && (
                    <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                      <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Activities</p>
                      {section.activities.map((a: any) => (
                        <div key={a.id} className="flex items-center justify-between py-1.5 text-sm">
                          <span>{a.custom_name || a.activity?.name}</span>
                          <span className="text-[var(--color-text-muted)]">${Number(a.cost).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {sections.length === 0 && !loading && !showForm && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)] mb-4">No sections yet. Start building your itinerary!</p>
            <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" />Add First Section</Button>
          </div>
        )}

        {/* Add Section Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="font-semibold mb-4">New Section</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="title" label="Section Title" placeholder="Day 1-3: Exploration" error={errors.title?.message} {...register('title')} />
              <div><label className="block text-sm font-medium mb-1.5">Description</label><textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" {...register('description')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <Input id="date_from" label="Start Date" type="date" error={errors.date_from?.message} {...register('date_from')} />
                <Input id="date_to" label="End Date" type="date" error={errors.date_to?.message} {...register('date_to')} />
              </div>
              <Input id="budget" label="Budget" type="number" placeholder="1000" icon={<DollarSign className="h-4 w-4" />} error={errors.budget?.message} {...register('budget')} />
              <div className="flex gap-3">
                <Button type="submit" loading={creating}>Add Section</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
