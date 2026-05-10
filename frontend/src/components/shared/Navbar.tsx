'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Globe, Menu, X, User, LogOut, LayoutDashboard, MapPin, Users, Search } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const links = [
    { href: '/', label: 'Home', icon: Globe },
    { href: '/trips', label: 'My Trips', icon: MapPin },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/community', label: 'Community', icon: Users },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
            <Globe style={{ width: '20px', height: '20px', color: '#1D4ED8' }} />
            Traveloop
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2px' }}>
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', background: active ? '#EFF6FF' : 'transparent', color: active ? '#1D4ED8' : '#475569' }}>
                  <l.icon style={{ width: '15px', height: '15px' }} />{l.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '6px' }}>
            {loading ? (
              <div style={{ width: '28px', height: '28px', borderRadius: '999px', background: '#F1F5F9' }} />
            ) : user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
                    <LayoutDashboard style={{ width: '15px', height: '15px' }} />Admin
                  </Link>
                )}
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
                  {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '24px', height: '24px', borderRadius: '999px', objectFit: 'cover' }} /> : <User style={{ width: '15px', height: '15px' }} />}
                  {user.first_name}
                </Link>
                <button onClick={logout} style={{ padding: '8px', borderRadius: '6px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }} aria-label="Sign out">
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </>
            ) : (
              <Link href="/login" style={{ padding: '8px 18px', borderRadius: '6px', background: '#1D4ED8', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: '#0F172A' }} aria-label="Toggle menu">
            {mobileOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #E2E8F0', background: '#FFFFFF', padding: '8px 16px 12px' }} className="md:hidden">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', color: active ? '#1D4ED8' : '#0F172A', background: active ? '#EFF6FF' : 'transparent', marginBottom: '2px' }}>
                <l.icon style={{ width: '18px', height: '18px' }} />{l.label}
              </Link>
            );
          })}
          {user ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', color: '#0F172A' }}>
                <User style={{ width: '18px', height: '18px' }} />Profile
              </Link>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#991B1B', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <LogOut style={{ width: '18px', height: '18px' }} />Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px', background: '#1D4ED8', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, textDecoration: 'none', marginTop: '8px' }}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
