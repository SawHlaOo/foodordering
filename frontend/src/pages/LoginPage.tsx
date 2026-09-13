import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('customer1@flavorflow.com');
  const [password, setPassword] = useState('Password123!');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'CHEF') navigate('/chef/dashboard');
      else if (loggedInUser.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Login</h1>
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
