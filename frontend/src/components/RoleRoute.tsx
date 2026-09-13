import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types';

export const RoleRoute = ({ role, children }: { role: Role; children: React.ReactNode }) => {
  const { user, token, loading, refreshUser } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!user && token) {
    return (
      <div className="space-y-3 rounded-2xl bg-white p-6 text-center">
        <p className="text-slate-600">Unable to restore this page right now.</p>
        <button type="button" onClick={refreshUser} className="rounded-full bg-brand-600 px-4 py-2 font-semibold text-white">Try again</button>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};
