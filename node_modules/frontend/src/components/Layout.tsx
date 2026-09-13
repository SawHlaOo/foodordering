import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-extrabold text-brand-600">FlavorFlow</Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Home</NavLink>
            <NavLink to="/menu" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Menu</NavLink>
            <NavLink to="/orders" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Orders</NavLink>
            <NavLink to="/cart" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Cart ({totalItems})</NavLink>
            {user?.role === 'CHEF' && <NavLink to="/chef/dashboard" className="font-medium text-slate-600">Kitchen</NavLink>}
            {user?.role === 'ADMIN' && <NavLink to="/admin/dashboard" className="font-medium text-slate-600">Admin</NavLink>}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium">{user.name}</Link>
                <button onClick={logout} className="rounded-full border border-slate-300 px-3 py-2 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-slate-300 px-3 py-2 text-sm">Login</Link>
                <Link to="/register" className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
