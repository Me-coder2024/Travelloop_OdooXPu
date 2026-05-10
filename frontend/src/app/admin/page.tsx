'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div><Skeleton className="h-80" /></div>;
  if (!stats) return <div className="max-w-7xl mx-auto px-4 py-8"><p className="text-center text-[var(--color-text-muted)]">Admin access required</p></div>;

  const COLORS = ['#4F46E5', '#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

  const statCards = [
    { label: 'Total Users', value: stats.overview.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Trips', value: stats.overview.totalTrips, icon: MapPin, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Trips', value: stats.overview.activeTrips, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Revenue', value: `$${Number(stats.overview.totalRevenue).toFixed(0)}`, icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1><p className="text-[var(--color-text-secondary)] mb-8">Monitor platform analytics</p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="h-6 w-6" /></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart - Trips by Status */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="font-semibold mb-4">Trips by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={stats.tripsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                {stats.tripsByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Expenses by Category */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="font-semibold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.expensesByCategory}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="total" fill="#4F46E5" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Recent Activity */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="font-semibold mb-4">Recent Trips</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.recentTrips.map((t: any, i: number) => ({ name: t.name.substring(0, 10), index: i + 1 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Line type="monotone" dataKey="index" stroke="#0EA5E9" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Trips Table */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="font-semibold mb-4">Recent Trips</h3>
          <table className="w-full">
            <thead><tr className="text-xs text-[var(--color-text-muted)] uppercase border-b border-[var(--color-border)]">
              <th className="py-3 text-left">Name</th><th className="py-3 text-left">Place</th><th className="py-3 text-left">Status</th><th className="py-3 text-left">Created</th>
            </tr></thead>
            <tbody>
              {stats.recentTrips.map((t: any) => (
                <tr key={t.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-3 text-sm font-medium">{t.name}</td>
                  <td className="py-3 text-sm text-[var(--color-text-secondary)]">{t.place}</td>
                  <td className="py-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-100">{t.status}</span></td>
                  <td className="py-3 text-sm text-[var(--color-text-muted)]">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
