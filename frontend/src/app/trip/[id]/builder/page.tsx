'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sectionSchema, SectionInput } from '@/lib/validators';
import { useSections } from '@/hooks/useSections';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Trash2, Calendar, DollarSign, GripVertical, ChevronLeft, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { sections, loading, fetchSections, createSection, deleteSection } = useSections(id);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionInput>({ resolver: zodResolver(sectionSchema) as any });

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
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Breadcrumb */}
        <Link
          href={`/trip/${id}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to trip
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Build Itinerary</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Add sections to organize your trip day by day
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />Add Section
          </Button>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <SectionSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* Sections list with timeline */}
            {sections.length > 0 ? (
              <div className="relative">
                {/* Timeline connector line */}
                {sections.length > 1 && (
                  <div className="timeline-line" style={{ top: '24px', bottom: '24px' }} />
                )}

                <AnimatePresence>
                  <div className="space-y-6">
                    {sections.map((section: any, i: number) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative" style={{ paddingLeft: 'clamp(16px, 4vw, 56px)' }}
                      >
                        {/* Timeline dot */}
                        <div className="timeline-dot" style={{ top: '24px' }} />

                        {/* Section card */}
                        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-sm transition-shadow group">
                          {/* Section header */}
                          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <div className="flex items-center gap-3 min-w-0">
                              <GripVertical className="h-4 w-4 text-[var(--color-text-muted)] cursor-grab shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="min-w-0">
                                <h3 className="font-semibold text-lg text-[var(--color-text-primary)] truncate">
                                  {section.title}
                                </h3>
                                {section.description && (
                                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                                    {section.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                              aria-label={`Delete section ${section.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Metadata badges */}
                          <div className="px-6 pb-4 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-xs font-medium">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(section.date_from).toLocaleDateString()} → {new Date(section.date_to).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                              <DollarSign className="h-3.5 w-3.5" />
                              Budget: ${Number(section.budget).toFixed(2)}
                            </span>
                          </div>

                          {/* Activities sub-list */}
                          {section.activities?.length > 0 && (
                            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                              <div className="px-6 py-2">
                                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                  Activities
                                </p>
                              </div>
                              <div className="divide-y divide-[var(--color-border)]">
                                {section.activities.map((a: any) => (
                                  <div key={a.id} className="px-6 py-2.5 flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-text-primary)]">
                                      {a.custom_name || a.activity?.name}
                                    </span>
                                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                      ${Number(a.cost).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ) : (
              !showForm && (
                <EmptyState
                  title="No sections yet"
                  description="Start building your itinerary by adding sections for each part of your trip."
                  actionLabel="Add First Section"
                  onAction={() => setShowForm(true)}
                  icon={<Layers className="h-8 w-8 text-[var(--color-text-muted)]" />}
                />
              )
            )}

            {/* Add Section Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border-2 border-dashed border-[var(--color-accent)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center">
                        <Plus className="h-4 w-4 text-[var(--color-accent)]" />
                      </div>
                      <h3 className="font-semibold">New Section</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input
                        id="title"
                        label="Section Title"
                        placeholder="e.g. Day 1-3: City Exploration"
                        error={errors.title?.message}
                        helperText="Name this part of your trip"
                        {...register('title')}
                      />

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] hover:border-[var(--color-text-muted)] transition-all duration-200 resize-none placeholder:text-[var(--color-text-muted)]"
                          placeholder="What will you do during this section? Hotels, travel, activities..."
                          {...register('description')}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          id="date_from"
                          label="Start Date"
                          type="date"
                          icon={<Calendar className="h-4 w-4" />}
                          error={errors.date_from?.message}
                          {...register('date_from')}
                        />
                        <Input
                          id="date_to"
                          label="End Date"
                          type="date"
                          icon={<Calendar className="h-4 w-4" />}
                          error={errors.date_to?.message}
                          {...register('date_to')}
                        />
                      </div>

                      <Input
                        id="budget"
                        label="Budget for this section"
                        type="number"
                        placeholder="1000"
                        icon={<DollarSign className="h-4 w-4" />}
                        error={errors.budget?.message}
                        helperText="How much do you plan to spend on this section?"
                        {...register('budget')}
                      />

                      <div className="flex gap-3 pt-2">
                        <Button type="submit" variant="primary" loading={creating}>
                          <Plus className="h-4 w-4 mr-1" />Add Section
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => { setShowForm(false); reset(); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom add section CTA when sections exist */}
            {sections.length > 0 && !showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add another Section
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
