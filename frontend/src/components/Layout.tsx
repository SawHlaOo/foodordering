import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="text-xl font-extrabold text-brand-600 sm:text-2xl">FlavorFlow</Link>
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                <Link to="/profile" className="max-w-[110px] truncate rounded-full bg-slate-100 px-2.5 py-2 text-xs font-medium sm:max-w-none sm:px-3 sm:text-sm">{user.name}</Link>
                <button onClick={logout} className="rounded-full border border-slate-300 px-2.5 py-2 text-xs sm:px-3 sm:text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-slate-300 px-2.5 py-2 text-xs sm:px-3 sm:text-sm">Login</Link>
                <Link to="/register" className="rounded-full bg-brand-600 px-2.5 py-2 text-xs font-medium text-white sm:px-3 sm:text-sm">Sign up</Link>
              </>
            )}
            </div>
          </div>
          <nav aria-label="Primary navigation" className="flex items-center gap-4 overflow-x-auto pt-3 text-sm whitespace-nowrap md:gap-5">
            <NavLink to="/" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Home</NavLink>
            <NavLink to="/menu" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Menu</NavLink>
            <NavLink to="/orders" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Orders</NavLink>
            <NavLink to="/cart" className={({ isActive }) => `font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>Cart ({totalItems})</NavLink>
            {user?.role === 'CHEF' && <NavLink to="/chef/dashboard" className="font-medium text-slate-600">Kitchen</NavLink>}
            {user?.role === 'ADMIN' && <NavLink to="/admin/dashboard" className="font-medium text-slate-600">Admin</NavLink>}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};
