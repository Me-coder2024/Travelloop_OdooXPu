'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useExpenses } from '@/hooks/useExpenses';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Download, FileText, CheckCircle, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { expenses, summary, loading, fetchExpenses, fetchSummary, updateExpense } = useExpenses(id);
  const { trip, fetchTrip } = useTrips();

  useEffect(() => { fetchExpenses(); fetchSummary(); fetchTrip(id); }, [fetchExpenses, fetchSummary, fetchTrip, id]);

  const handleMarkPaid = async () => {
    for (const exp of expenses) {
      if (exp.payment_status !== 'PAID') await updateExpense(exp.id, { payment_status: 'PAID' });
    }
  };

  const handleDownload = () => {
    const content = `TRAVELOOP - TRIP INVOICE\n${'='.repeat(50)}\nTrip: ${trip?.name}\nPlace: ${trip?.place}\nDates: ${trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : ''} - ${trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : ''}\nTotal Budget: $${Number(summary?.total_budget || 0).toFixed(2)}\nTotal Spent: $${Number(summary?.total_spent || 0).toFixed(2)}\n\n${'─'.repeat(50)}\nITEMIZED EXPENSES\n${'─'.repeat(50)}\n${expenses.map((e: any) => `${e.category?.name}\t${e.description}\t${e.quantity}\t$${Number(e.unit_cost).toFixed(2)}\t$${Number(e.amount).toFixed(2)}`).join('\n')}\n${'─'.repeat(50)}\nSUBTOTAL: $${Number(summary?.total_spent || 0).toFixed(2)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${trip?.name || 'trip'}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><Skeleton className="h-40 mb-4" /><Skeleton className="h-80" /></div>;

  const COLORS = ['#4F46E5', '#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#6B7280'];
  const chartData = summary?.by_category?.map((c: any) => ({ name: c.category_name, value: Number(c.total_amount) })) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-6">Expense Invoice</h1>

        {/* Trip Summary Card */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-6 flex flex-wrap gap-8 items-center">
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-xl font-bold">{trip?.name}</h2>
            <p className="text-[var(--color-text-secondary)]">{trip?.place}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : ''} — {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : ''}</p>
            <div className="flex gap-6 mt-4">
              <div><p className="text-xs text-[var(--color-text-muted)]">Budget</p><p className="text-xl font-bold text-[var(--color-accent)]">${Number(summary?.total_budget || 0).toFixed(2)}</p></div>
              <div><p className="text-xs text-[var(--color-text-muted)]">Spent</p><p className="text-xl font-bold">${Number(summary?.total_spent || 0).toFixed(2)}</p></div>
              <div><p className="text-xs text-[var(--color-text-muted)]">Remaining</p><p className="text-xl font-bold text-[var(--color-success)]">${(Number(summary?.total_budget || 0) - Number(summary?.total_spent || 0)).toFixed(2)}</p></div>
            </div>
          </div>

          {/* Budget Donut Chart */}
          {chartData.length > 0 && (
            <div className="w-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {chartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Itemized Table */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden mb-6">
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-xs text-[var(--color-text-muted)] uppercase">
              <th className="px-6 py-3 text-left">Category</th><th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-right">Qty</th><th className="px-6 py-3 text-right">Unit Cost</th><th className="px-6 py-3 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {expenses.map((exp: any) => (
                <tr key={exp.id} className="border-t border-[var(--color-border)]">
                  <td className="px-6 py-3"><span className="inline-flex items-center gap-1 text-sm"><span>{exp.category?.icon}</span>{exp.category?.name}</span></td>
                  <td className="px-6 py-3 text-sm">{exp.description}</td>
                  <td className="px-6 py-3 text-sm text-right">{exp.quantity}</td>
                  <td className="px-6 py-3 text-sm text-right">${Number(exp.unit_cost).toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium">${Number(exp.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--color-primary)]">
                <td colSpan={4} className="px-6 py-3 text-right font-bold">Subtotal</td>
                <td className="px-6 py-3 text-right font-bold">${Number(summary?.total_spent || 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload}><Download className="h-4 w-4 mr-1" />Download Invoice</Button>
          <Button variant="secondary" onClick={handleDownload}><FileText className="h-4 w-4 mr-1" />Export as PDF</Button>
          <Button variant="secondary" onClick={handleMarkPaid}><CheckCircle className="h-4 w-4 mr-1" />Mark as Paid</Button>
        </div>
      </motion.div>
    </div>
  );
}
