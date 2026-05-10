'use client';
import { Search, SlidersHorizontal, Filter, ArrowUpDown, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  groupByOptions?: string[];
  groupBy?: string;
  onGroupByChange?: (val: string) => void;
  filterOptions?: string[];
  activeFilter?: string;
  onFilterChange?: (val: string) => void;
  sortOptions?: string[];
  sortBy?: string;
  onSortChange?: (val: string) => void;
}

function Dropdown({ label, icon: Icon, options, value, onChange }: {
  label: string; icon: any; options: string[]; value: string; onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500,
          color: '#0F172A', background: value && value !== 'All' && value !== 'Default' ? '#EFF6FF' : '#FFFFFF',
          border: '1px solid #0F172A', cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        <Icon style={{ width: '12px', height: '12px' }} />
        <span className="hidden sm:inline">{value && value !== 'All' && value !== 'Default' ? value : label}</span>
        <ChevronDown style={{ width: '10px', height: '10px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px',
          padding: '4px', minWidth: '140px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                color: value === opt ? '#1D4ED8' : '#0F172A',
                background: value === opt ? '#EFF6FF' : 'transparent',
                border: 'none', cursor: 'pointer',
              }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchBar({
  value, onChange, placeholder = 'Search...',
  showFilters = true,
  groupByOptions = ['All', 'Category', 'Date', 'Location'],
  groupBy = 'All', onGroupByChange,
  filterOptions = ['All', 'Active', 'Completed', 'Pending'],
  activeFilter = 'All', onFilterChange,
  sortOptions = ['Default', 'Name A-Z', 'Name Z-A', 'Newest', 'Oldest'],
  sortBy = 'Default', onSortChange,
}: SearchBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Row: Search input + pills on desktop, stacked on mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #0F172A', borderRadius: '8px', padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <Search style={{ width: '16px', height: '16px', color: '#94A3B8', flexShrink: 0 }} />
          <input
            type="text" placeholder={placeholder} value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#0F172A', fontFamily: 'inherit', minWidth: 0 }}
          />
        </div>
        {/* Pills inline on >=480px, below on smaller */}
        {showFilters && (
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, overflowX: 'auto' }} className="scroll-hidden">
            <Dropdown icon={SlidersHorizontal} label="Group by" options={groupByOptions} value={groupBy} onChange={onGroupByChange || (() => {})} />
            <Dropdown icon={Filter} label="Filter" options={filterOptions} value={activeFilter} onChange={onFilterChange || (() => {})} />
            <Dropdown icon={ArrowUpDown} label="Sort by..." options={sortOptions} value={sortBy} onChange={onSortChange || (() => {})} />
          </div>
        )}
      </div>
    </div>
  );
}
