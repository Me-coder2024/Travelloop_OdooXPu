'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePacking } from '@/hooks/usePacking';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Plus, Trash2, RotateCcw, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['DOCUMENTS', 'CLOTHING', 'ELECTRONICS', 'OTHER'];
const CATEGORY_ICONS: Record<string, string> = { DOCUMENTS: '📄', CLOTHING: '👕', ELECTRONICS: '💻', OTHER: '📦' };

export default function PackingPage() {
  const { id } = useParams<{ id: string }>();
  const { items, total, packed, progress, loading, fetchItems, addItem, toggleItem, deleteItem, resetAll } = usePacking(id);
  const [search, setSearch] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: 'OTHER' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;
    await addItem(newItem);
    setNewItem({ name: '', category: 'OTHER' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Packing Checklist</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">{packed} of {total} items packed - keep going!</p>

        <ProgressBar value={progress} label="Packing Progress" className="mb-6" />

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
          <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Add</Button>
          <Button variant="secondary" onClick={resetAll}><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6 flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-1">Item Name</label>
              <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Passport..." className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button onClick={handleAdd}><Save className="h-4 w-4" /></Button>
          </motion.div>
        )}

        {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div> : (
          <div className="space-y-6">
            {CATEGORIES.map(cat => {
              const catItems = (items[cat] || []).filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));
              if (catItems.length === 0 && !items[cat]?.length) return null;
              return (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-2">{CATEGORY_ICONS[cat]} {cat} ({catItems.length})</h3>
                  <div className="space-y-1">
                    {catItems.map((item: any) => (
                      <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 bg-white rounded-lg border border-[var(--color-border)] px-4 py-3 group">
                        <button onClick={() => toggleItem(item.id)} className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${item.is_packed ? 'bg-[var(--color-success)] border-[var(--color-success)]' : 'border-gray-300 hover:border-[var(--color-accent)]'}`}>
                          {item.is_packed && <Check className="h-3 w-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${item.is_packed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>{item.name}</span>
                        <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
