import { useAuth } from '../contexts/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">Profile</h1>
      <div className="mt-6 space-y-3 text-slate-600">
        <p><span className="font-semibold text-slate-800">Name:</span> {user?.name}</p>
        <p><span className="font-semibold text-slate-800">Email:</span> {user?.email}</p>
        <p><span className="font-semibold text-slate-800">Phone:</span> {user?.phone || 'Not provided'}</p>
        <p><span className="font-semibold text-slate-800">Role:</span> {user?.role}</p>
      </div>
    </div>
  );
};
