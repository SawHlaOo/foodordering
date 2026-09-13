import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiRequestError } from '../api/client';
import type { Role, User } from '../types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const cachedUserKey = 'flavorflow_user';

const readCachedUser = (): User | null => {
  try {
    const cachedUser = sessionStorage.getItem(cachedUserKey);
    return cachedUser ? JSON.parse(cachedUser) as User : null;
  } catch {
    sessionStorage.removeItem(cachedUserKey);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialToken = localStorage.getItem('flavorflow_token');
  const [user, setUser] = useState<User | null>(() => initialToken ? readCachedUser() : null);
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(() => !initialToken || !readCachedUser());

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('flavorflow_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.get<{ id: string; name: string; email: string; role: Role; phone?: string | null }>('/auth/me');
      const nextUser = { ...profile, id: profile.id, role: profile.role };
      sessionStorage.setItem(cachedUserKey, JSON.stringify(nextUser));
      setUser(nextUser);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        localStorage.removeItem('flavorflow_token');
        setToken(null);
        setUser(null);
        sessionStorage.removeItem(cachedUserKey);
      }
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
    sessionStorage.setItem(cachedUserKey, JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const result = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password, phone });
    localStorage.setItem('flavorflow_token', result.token);
    sessionStorage.setItem(cachedUserKey, JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem('flavorflow_token');
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(cachedUserKey);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, token, loading, login, register, logout, refreshUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
