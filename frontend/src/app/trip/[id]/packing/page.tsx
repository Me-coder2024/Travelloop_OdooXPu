'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { usePacking } from '@/hooks/usePacking';
import { useTrips } from '@/hooks/useTrips';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, Trash2, RotateCcw, Check, Share2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['DOCUMENTS', 'CLOTHING', 'ELECTRONICS', 'OTHER'];

export default function PackingPage() {
  const { id } = useParams<{ id: string }>();
  const { items, total, packed, progress, loading, fetchItems, addItem, toggleItem, deleteItem, resetAll } = usePacking(id);
  const { trip, fetchTrip } = useTrips();

  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('Category');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'OTHER' });

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;
    await addItem(newItem);
    setNewItem({ name: '', category: 'OTHER' });
    setShowAdd(false);
  };

  // Flatten all items into a single array
  const allItems = useMemo(() => {
    const flat: any[] = [];
    for (const cat of CATEGORIES) {
      for (const item of (items[cat] || [])) {
        flat.push({ ...item, category: cat });
      }
    }
    return flat;
  }, [items]);

  // Apply search
  const searched = useMemo(() => {
    if (!search) return allItems;
    return allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [allItems, search]);

  // Apply filter
  const filtered = useMemo(() => {
    if (activeFilter === 'Packed') return searched.filter(i => i.is_packed);
    if (activeFilter === 'Unpacked') return searched.filter(i => !i.is_packed);
    return searched;
  }, [searched, activeFilter]);

  // Apply sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'Name A-Z') arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Name Z-A') arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === 'Packed first') arr.sort((a, b) => (b.is_packed ? 1 : 0) - (a.is_packed ? 1 : 0));
    if (sortBy === 'Unpacked first') arr.sort((a, b) => (a.is_packed ? 1 : 0) - (b.is_packed ? 1 : 0));
    return arr;
  }, [filtered, sortBy]);

  // Group items
  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const item of sorted) {
      const key = groupBy === 'Category' ? item.category : 'ALL';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [sorted, groupBy]);

  const getCategoryPackedCount = (cat: string) => (items[cat] || []).filter((i: any) => i.is_packed).length;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '20px' }}>
          Packing Checklist
        </h1>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search items..."
            showFilters={true}
            groupByOptions={['Category', 'All Items']}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            filterOptions={['All', 'Packed', 'Unpacked']}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortOptions={['Default', 'Name A-Z', 'Name Z-A', 'Packed first', 'Unpacked first']}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Trip selector */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Packing checklist</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>
            Trip: {trip?.name || 'Loading...'}
            <ChevronDown style={{ width: '14px', height: '14px', color: '#94A3B8', marginLeft: 'auto' }} />
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A', marginBottom: '8px' }}>
            Progress: <span style={{ fontWeight: 700 }}>{packed}/{total}</span> items packed
          </p>
          <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#1D4ED8', borderRadius: '999px', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <>
            {/* Category groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {groupBy === 'Category' ? (
                CATEGORIES.map(cat => {
                  const catItems = grouped[cat] || [];
                  const totalCat = (items[cat] || []).length;
                  const packedCat = getCategoryPackedCount(cat);
                  if (totalCat === 0 && catItems.length === 0) return null;

                  return (
                    <div key={cat}>
                      {/* Category header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>
                          {cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                          {packedCat}/{totalCat}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px' }}>
                        {catItems.length === 0 ? (
                          <p style={{ fontSize: '13px', color: '#94A3B8', padding: '8px 0' }}>No items match</p>
                        ) : (
                          catItems.map((item: any) => (
                            <PackingItem key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                // All items flat
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {sorted.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#94A3B8', textAlign: 'center', padding: '32px 0' }}>No items found</p>
                  ) : (
                    sorted.map((item: any) => (
                      <PackingItem key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Add item form */}
            <AnimatePresence>
              {showAdd && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: '16px' }}>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }}>Item Name</label>
                      <input
                        type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g. Passport"
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '4px' }}>Category</label>
                      <select
                        value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                        style={{ height: '38px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#0F172A', outline: 'none', background: '#FFFFFF' }}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                      </select>
                    </div>
                    <button onClick={handleAdd} style={{ height: '38px', padding: '0 16px', borderRadius: '6px', background: '#1D4ED8', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowAdd(!showAdd)}
                style={{ flex: 1, minWidth: '160px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                + add item to checklist
              </button>
              <button
                onClick={resetAll}
                style={{ flex: 1, minWidth: '100px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <RotateCcw style={{ width: '14px', height: '14px' }} />
                Reset all
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                style={{ flex: 1, minWidth: '100px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Share2 style={{ width: '14px', height: '14px' }} />
                Share Checklist
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Individual Packing Item ──
function PackingItem({ item, onToggle, onDelete }: { item: any; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderRadius: '6px' }} className="group">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        style={{
          width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
          border: item.is_packed ? 'none' : '2px solid #E2E8F0',
          background: item.is_packed ? '#1D4ED8' : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {item.is_packed && <Check style={{ width: '12px', height: '12px', color: '#FFFFFF' }} />}
      </button>

      {/* Name */}
      <span style={{
        flex: 1, fontSize: '14px', color: item.is_packed ? '#94A3B8' : '#0F172A',
        textDecoration: item.is_packed ? 'line-through' : 'none',
      }}>
        {item.name}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100"
        style={{ padding: '4px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}
      >
        <Trash2 style={{ width: '14px', height: '14px' }} />
      </button>
    </div>
  );
}
