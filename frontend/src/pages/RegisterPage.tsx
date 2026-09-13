import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Create account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-slate-300 p-3" required />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="w-full rounded-xl border border-slate-300 p-3" required />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" className="w-full rounded-xl border border-slate-300 p-3" required />
        <button type="submit" className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white">Register</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
      </p>
    </div>
  );
};
