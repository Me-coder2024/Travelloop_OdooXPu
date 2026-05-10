'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useExpenses } from '@/hooks/useExpenses';
import { useTrips } from '@/hooks/useTrips';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Download, FileText, CheckCircle, ChevronLeft, MapPin, Calendar, Users, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { expenses, summary, loading, fetchExpenses, fetchSummary, updateExpense } = useExpenses(id);
  const { trip, fetchTrip } = useTrips();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { fetchExpenses(); fetchSummary(); fetchTrip(id); }, [fetchExpenses, fetchSummary, fetchTrip, id]);

  const handleMarkPaid = async () => {
    for (const exp of expenses) {
      if (exp.payment_status !== 'PAID') await updateExpense(exp.id, { payment_status: 'PAID' });
    }
  };

  const handleDownload = () => {
    const rows = filteredExpenses.map((e: any, i: number) =>
      `${i + 1}\t${e.category?.name || '-'}\t${e.description}\t${e.quantity}\t$${Number(e.unit_cost).toFixed(2)}\t$${Number(e.amount).toFixed(2)}`
    ).join('\n');
    const content = `TRAVELOOP — EXPENSE INVOICE\n${'═'.repeat(60)}\nTrip: ${trip?.name}\nPlace: ${trip?.place}\nInvoice ID: INV-${id?.slice(0, 8).toUpperCase()}\nRecorded Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\nPayment Status: ${expenses.every((e: any) => e.payment_status === 'PAID') ? 'Paid' : 'Pending'}\n\n${'─'.repeat(60)}\n#\tCategory\tDescription\tQty\tUnit Cost\tAmount\n${'─'.repeat(60)}\n${rows}\n${'─'.repeat(60)}\nSubtotal:\t\t\t\t\t₹ ${Number(summary?.total_spent || 0).toFixed(0)}\nTax (0%):\t\t\t\t\t₹ 0\nGrand Total:\t\t\t\t\t₹ ${Number(summary?.total_spent || 0).toFixed(0)}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoice-${trip?.name || 'trip'}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  // Filter & sort expenses
  let filteredExpenses = expenses.filter((e: any) =>
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.name?.toLowerCase().includes(search.toLowerCase())
  );
  if (activeFilter !== 'All') {
    filteredExpenses = filteredExpenses.filter((e: any) => e.category?.name === activeFilter);
  }
  if (sortBy === 'Amount ↑') filteredExpenses = [...filteredExpenses].sort((a, b) => Number(a.amount) - Number(b.amount));
  if (sortBy === 'Amount ↓') filteredExpenses = [...filteredExpenses].sort((a, b) => Number(b.amount) - Number(a.amount));
  if (sortBy === 'Name A-Z') filteredExpenses = [...filteredExpenses].sort((a, b) => a.description.localeCompare(b.description));

  const totalSpent = Number(summary?.total_spent || 0);
  const totalBudget = Number(summary?.total_budget || 0);
  const remaining = totalBudget - totalSpent;
  const categories = Array.from(new Set(expenses.map((e: any) => e.category?.name).filter(Boolean)));

  if (loading) return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-40 mb-6" />
      <Skeleton className="h-80" />
    </div>
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '20px' }}>
          Expense Invoice
        </h1>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar
            value={search} onChange={setSearch}
            placeholder="Search invoices..."
            filterOptions={['All', ...categories]}
            activeFilter={activeFilter} onFilterChange={setActiveFilter}
            sortOptions={['Default', 'Amount ↑', 'Amount ↓', 'Name A-Z']}
            sortBy={sortBy} onSortChange={setSortBy}
            groupByOptions={['All', 'Category']}
            groupBy="All" onGroupByChange={() => {}}
          />
        </div>

        {/* Back link */}
        <Link href={`/trip/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#475569', textDecoration: 'none', marginBottom: '20px' }}>
          <ChevronLeft style={{ width: '14px', height: '14px' }} /> Back to My Trips
        </Link>

        {/* ── Trip Summary + Budget Insights ── */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Trip info card */}
          <div style={{ flex: 2, minWidth: '300px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Trip image placeholder */}
            <div style={{ width: '100px', height: '80px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin style={{ width: '24px', height: '24px', color: '#94A3B8' }} />
            </div>

            {/* Trip details */}
            <div style={{ flex: 1, minWidth: '140px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{trip?.name || 'Trip'}</h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>INV-{id?.slice(0, 8).toUpperCase()}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div>
                  <p style={{ color: '#94A3B8', marginBottom: '2px' }}>Invoice Id</p>
                  <p style={{ color: '#0F172A', fontWeight: 600 }}>INV-{id?.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', marginBottom: '2px' }}>Recorded date</p>
                  <p style={{ color: '#0F172A', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', marginBottom: '2px' }}>Member Details</p>
                  <p style={{ color: '#0F172A', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users style={{ width: '12px', height: '12px' }} /> {trip?.members?.length || 1} member{(trip?.members?.length || 1) > 1 ? 's' : ''}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', marginBottom: '2px' }}>Payment status</p>
                  <p style={{ color: expenses.every((e: any) => e.payment_status === 'PAID') ? '#065F46' : '#92400E', fontWeight: 600 }}>
                    {expenses.every((e: any) => e.payment_status === 'PAID') ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget insights */}
          <div style={{ flex: 1, minWidth: '220px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Budget Insights</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Total Budget:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>₹ {totalBudget.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Spent:</span>
                <span style={{ fontWeight: 700, color: '#991B1B' }}>- ₹ {totalSpent.toFixed(0)}</span>
              </div>
              <div style={{ height: '1px', background: '#E2E8F0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Remaining:</span>
                <span style={{ fontWeight: 700, color: remaining >= 0 ? '#065F46' : '#991B1B' }}>₹ {remaining.toFixed(0)}</span>
              </div>
            </div>

            <Link href={`/trip/${id}`} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 600, color: '#0F172A', textDecoration: 'none', background: '#FFFFFF' }}>
              View Full Budget
            </Link>
          </div>
        </div>

        {/* ── Itemized Table ── */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>Description</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '12px' }}>Qty/Adults</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '12px' }}>Unit Cost</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '12px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>No expenses found</td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp: any, i: number) => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 500 }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', color: '#0F172A' }}>{exp.category?.name || '-'}</td>
                      <td style={{ padding: '12px 16px', color: '#0F172A' }}>{exp.description}</td>
                      <td style={{ padding: '12px 16px', color: '#0F172A', textAlign: 'center' }}>{exp.quantity}</td>
                      <td style={{ padding: '12px 16px', color: '#0F172A', textAlign: 'right' }}>₹ {Number(exp.unit_cost).toFixed(0)}</td>
                      <td style={{ padding: '12px 16px', color: '#0F172A', textAlign: 'right', fontWeight: 600 }}>₹ {Number(exp.amount).toFixed(0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredExpenses.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop: '1px solid #E2E8F0' }}>
                    <td colSpan={5} style={{ padding: '10px 16px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>Subtotal</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹ {totalSpent.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} style={{ padding: '6px 16px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>Tax (0%)</td>
                    <td style={{ padding: '6px 16px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>₹ 0</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #0F172A' }}>
                    <td colSpan={5} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>Grand Total</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>₹ {totalSpent.toFixed(0)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* ── Bottom Action Buttons ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleDownload} style={{ flex: 1, minWidth: '140px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Download style={{ width: '14px', height: '14px' }} /> Download Invoice
          </button>
          <button onClick={handleDownload} style={{ flex: 1, minWidth: '140px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <FileText style={{ width: '14px', height: '14px' }} /> Export as PDF
          </button>
          <button onClick={handleMarkPaid} style={{ flex: 1, minWidth: '140px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle style={{ width: '14px', height: '14px' }} /> Mark as paid
          </button>
        </div>

      </motion.div>
    </div>
  );
}
