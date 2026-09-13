import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import type { Role, User } from '../types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('flavorflow_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('flavorflow_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.get<{ id: string; name: string; email: string; role: Role; phone?: string | null }>('/auth/me');
      setUser({ ...profile, id: profile.id, role: profile.role });
    } catch {
      localStorage.removeItem('flavorflow_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('flavorflow_token', result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const result = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password, phone });
    localStorage.setItem('flavorflow_token', result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem('flavorflow_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, token, loading, login, register, logout, refreshUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
