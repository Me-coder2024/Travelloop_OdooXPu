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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)]" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)]">
            <Globe className="h-6 w-6 text-[var(--color-accent)]" />
            Traveloop
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === l.href ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50'}`}>
                <l.icon className="h-4 w-4" />{l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loading ? <div className="h-8 w-8 rounded-full skeleton" /> : user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-50">
                    <LayoutDashboard className="h-4 w-4" />Admin
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-50">
                  {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" /> : <User className="h-4 w-4" />}
                  {user.first_name}
                </Link>
                <button onClick={logout} className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50 transition-colors" aria-label="Sign out of your account">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors">Sign In</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white p-4 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === l.href ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
              <l.icon className="h-4 w-4" />{l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)]"><User className="h-4 w-4" />Profile</Link>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-danger)] w-full"><LogOut className="h-4 w-4" />Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
