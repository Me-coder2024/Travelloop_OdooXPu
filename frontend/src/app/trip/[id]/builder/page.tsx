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
import { Plus, Trash2, Calendar, DollarSign, ChevronLeft, Layers } from 'lucide-react';
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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Back link */}
        <Link href={`/trip/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#475569', textDecoration: 'none', marginBottom: '20px' }}>
          <ChevronLeft style={{ width: '14px', height: '14px' }} /> Back to trip
        </Link>

        {/* Title */}
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '24px' }}>
          Build Itinerary
        </h1>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3].map(i => <SectionSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {/* ── Section Cards ── */}
            {sections.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sections.map((section: any, i: number) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '18px 20px', position: 'relative' }}>
                      {/* Delete button */}
                      <button
                        onClick={() => deleteSection(section.id)}
                        style={{ position: 'absolute', top: '14px', right: '14px', padding: '4px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', display: 'flex' }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px', color: '#991B1B' }} />
                      </button>

                      {/* Section title */}
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', paddingRight: '36px' }}>
                        Section {i + 1}: {section.title}
                      </h3>

                      {/* Description */}
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                        {section.description || 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity.'}
                      </p>

                      {/* Date Range + Budget pills */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                          <Calendar style={{ width: '13px', height: '13px', color: '#475569' }} />
                          Date Range: {new Date(section.date_from).toLocaleDateString()} to {new Date(section.date_to).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                          <DollarSign style={{ width: '13px', height: '13px', color: '#475569' }} />
                          Budget of this section: ₹{Number(section.budget).toFixed(0)}
                        </span>
                      </div>

                      {/* Activities count */}
                      {section.activities?.length > 0 && (
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
                          {section.activities.length} activit{section.activities.length === 1 ? 'y' : 'ies'} planned
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              !showForm && (
                <EmptyState
                  title="No sections yet"
                  description="Start building your itinerary by adding sections for each part of your trip."
                  actionLabel="Add First Section"
                  onAction={() => setShowForm(true)}
                  icon={<Layers style={{ width: '28px', height: '28px', color: '#94A3B8' }} />}
                />
              )
            )}

            {/* ── Add Section Form ── */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: sections.length > 0 ? '14px' : '0' }}
                >
                  <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '2px dashed #1D4ED8', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '14px' }}>New Section</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Input
                        id="title"
                        label="Section Title"
                        placeholder="e.g. Day 1-3: City Exploration"
                        error={errors.title?.message}
                        {...register('title')}
                      />
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>Description</label>
                        <textarea
                          rows={3}
                          placeholder="What will you do during this section? Hotels, travel, activities..."
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }}
                          {...register('description')}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        <Input id="date_from" label="Start Date" type="date" icon={<Calendar style={{ width: '14px', height: '14px' }} />} error={errors.date_from?.message} {...register('date_from')} />
                        <Input id="date_to" label="End Date" type="date" icon={<Calendar style={{ width: '14px', height: '14px' }} />} error={errors.date_to?.message} {...register('date_to')} />
                      </div>
                      <Input id="budget" label="Budget for this section" type="number" placeholder="1000" icon={<DollarSign style={{ width: '14px', height: '14px' }} />} error={errors.budget?.message} {...register('budget')} />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <Button type="submit" variant="primary" loading={creating}><Plus style={{ width: '14px', height: '14px', marginRight: '4px' }} />Add Section</Button>
                        <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Bottom CTA: + Add another Section ── */}
            {!showForm && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '12px 28px', borderRadius: '8px',
                    border: '1px solid #0F172A', background: '#FFFFFF',
                    fontSize: '14px', fontWeight: 600, color: '#0F172A',
                    cursor: 'pointer',
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add another Section
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
