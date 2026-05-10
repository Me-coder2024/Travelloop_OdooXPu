'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: string; username: string; first_name: string; last_name: string;
  email: string; phone?: string; city?: string; country?: string;
  additional_info?: string; avatar_url?: string; role: string;
}

interface AuthContextType {
  user: User | null; loading: boolean; login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>; logout: () => Promise<void>; refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data.data);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    setUser(data.data);
  };

  const register = async (formData: any) => {
    const { data } = await api.post('/auth/register', formData);
    setUser(data.data);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
