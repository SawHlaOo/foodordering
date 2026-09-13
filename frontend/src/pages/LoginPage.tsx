import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('customer1@flavorflow.com');
  const [password, setPassword] = useState('Password123!');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      if (user?.role === 'CHEF') navigate('/chef/dashboard');
      else if (user?.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-xl border border-slate-300 p-3" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-slate-300 p-3" required />
        <button type="submit" className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Need an account? <Link to="/register" className="font-semibold text-brand-600">Create one</Link>
      </p>
    </div>
  );
};
