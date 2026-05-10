'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { SearchBar } from '@/components/ui/SearchBar';
import { Users, MapPin, Activity, TrendingUp, ChevronLeft } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

type Tab = 'users' | 'cities' | 'activities' | 'trends';

const TAB_META: Record<Tab, { label: string; icon: any; title: string; desc: string }> = {
  users:      { label: 'Manage Users',           icon: Users,      title: 'Manage User Section',         desc: 'This section is responsible for managing the users and their actions. This section will give the admin the access to view all the trips made by the user. Also other functionalities are welcome.' },
  cities:     { label: 'Popular Cities',          icon: MapPin,     title: 'Popular Cities',               desc: 'Lists all the popular cities where the users are visiting based on the current user trends.' },
  activities: { label: 'Popular Activities',      icon: Activity,   title: 'Popular Activities',           desc: 'List all the popular activities that the users are doing based on the current user trend data.' },
  trends:     { label: 'User Trends & Analytics', icon: TrendingUp, title: 'User Trends and Analytics',    desc: 'This section will major focus on providing the analysis across various points and give useful information to the user.' },
};

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').then(r => setStats(r.data.data)),
      api.get('/admin/users').then(r => setUsers(r.data.data?.users || [])),
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  const COLORS = ['#1D4ED8', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  if (loading) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <Skeleton className="h-12 w-full" style={{ marginBottom: '16px' }} />
      <Skeleton className="h-10 w-full" style={{ marginBottom: '20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );

  if (!stats) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: '14px', color: '#94A3B8' }}>Admin access required</p>
    </div>
  );

  // Filtered users
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase())
  );

  const meta = TAB_META[activeTab];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <SearchBar
            value={search} onChange={setSearch}
            placeholder="Search admin panel..."
            groupByOptions={['All', 'Role', 'Status']}
            groupBy="All" onGroupByChange={() => {}}
            filterOptions={['All', 'Active', 'Inactive']}
            activeFilter={activeFilter} onFilterChange={setActiveFilter}
            sortOptions={['Default', 'Name A-Z', 'Newest', 'Most Trips']}
            sortBy={sortBy} onSortChange={setSortBy}
          />
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }} className="scroll-hidden">
          {(Object.keys(TAB_META) as Tab[]).map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '6px', whiteSpace: 'nowrap',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: active ? '1px solid #0F172A' : '1px solid #E2E8F0',
                  background: active ? '#0F172A' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#0F172A',
                }}
              >
                {TAB_META[tab].label}
              </button>
            );
          })}
        </div>

        {/* ── Main Layout: Content + Sidebar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

          {/* Desktop: sidebar on right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '20px' }} className="admin-grid">

            {/* LEFT: Content Area */}
            <div>
              {/* ── TAB: Manage Users ── */}
              {activeTab === 'users' && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  {/* Users List */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>User</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Email</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Role</th>
                          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Trips</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u: any) => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '10px 16px' }}>
                              <p style={{ fontWeight: 600, color: '#0F172A' }}>{u.first_name} {u.last_name}</p>
                              <p style={{ fontSize: '11px', color: '#94A3B8' }}>@{u.username}</p>
                            </td>
                            <td style={{ padding: '10px 16px', color: '#475569' }}>{u.email}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: u.role === 'ADMIN' ? '#EFF6FF' : '#F1F5F9', color: u.role === 'ADMIN' ? '#1D4ED8' : '#475569' }}>{u.role}</span>
                            </td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>{u._count?.trips || 0}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: u.is_active ? '#F0FDF4' : '#FEF2F2', color: u.is_active ? '#065F46' : '#991B1B' }}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── TAB: Popular Cities ── */}
              {activeTab === 'cities' && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Popular Cities — Trip Destinations</h3>

                  {/* Pie chart */}
                  <div style={{ marginBottom: '24px' }}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={stats.tripsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                          {stats.tripsByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent trips as cities table */}
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Destinations</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stats.recentTrips.map((t: any) => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin style={{ width: '13px', height: '13px', color: '#1D4ED8' }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>{t.place}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB: Popular Activities ── */}
              {activeTab === 'activities' && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Popular Activities — Expense Breakdown</h3>

                  {/* Bar chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {stats.expensesByCategory.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Activities list */}
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stats.expensesByCategory.map((e: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i % COLORS.length] }} />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>{e.category}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>₹{Number(e.total || 0).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB: User Trends & Analytics ── */}
              {activeTab === 'trends' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Overview cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {[
                      { label: 'Total Users', value: stats.overview.totalUsers, color: '#1D4ED8' },
                      { label: 'Total Trips', value: stats.overview.totalTrips, color: '#10B981' },
                      { label: 'Active Trips', value: stats.overview.activeTrips, color: '#F59E0B' },
                      { label: 'Total Revenue', value: `₹${Number(stats.overview.totalRevenue).toFixed(0)}`, color: '#8B5CF6' },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</p>
                        <p style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Line chart - Trip Trends */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Trip Trends</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={stats.recentTrips.map((t: any, i: number) => ({ name: t.name.substring(0, 12), trips: i + 1 }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="trips" stroke="#1D4ED8" strokeWidth={2} dot={{ fill: '#1D4ED8', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie chart */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Trips by Status</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={stats.tripsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={85} label>
                          {stats.tripsByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar chart */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Expenses by Category</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={stats.expensesByCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Sidebar descriptions */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px', alignSelf: 'start', position: 'sticky', top: '80px' }}>
              {(Object.keys(TAB_META) as Tab[]).map((tab, i) => (
                <div key={tab} style={{ marginBottom: i < 3 ? '18px' : '0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: activeTab === tab ? '#1D4ED8' : '#0F172A', marginBottom: '4px' }}>
                    {TAB_META[tab].title}:
                  </h4>
                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                    {TAB_META[tab].desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
