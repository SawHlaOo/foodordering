import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { FoodDetailPage } from './pages/FoodDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChefDashboardPage } from './pages/chef/ChefDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext';
import { MaintenancePage } from './pages/MaintenancePage';
import { useAuth } from './contexts/AuthContext';

const MaintenancePreview = () => {
  const { settings } = useMaintenance();
  const serialized = new URLSearchParams(window.location.search).get('settings');
  if (!serialized) return <Navigate to="/admin/dashboard?tab=settings" replace />;

  try {
    const settingsPreview = JSON.parse(serialized) as {
      maintenanceMode: boolean;
      maintenanceTitle: string;
      maintenanceMessage: string;
      maintenanceUntil: string | null;
    };
    return <MaintenancePage settings={{ ...settingsPreview, maintenanceMode: true }} />;
  } catch {
    return settings
      ? <MaintenancePage settings={{ ...settings, maintenanceMode: true }} />
      : <div className="p-8 text-center text-slate-600">Unable to load maintenance preview.</div>;
  }
};

const AppContent = () => {
  const { user, loading: authLoading, token } = useAuth();
  const { settings, isLoading, error, retry } = useMaintenance();
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';
  const isPublicLoginPage = location.pathname === '/login';
  const isAdminPath = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const isAdminLoginPage = location.pathname === '/admin/login';
  const bypassesMaintenance = isAdminPath || isAdminLoginPage || isPublicLoginPage;

  if (authLoading && token) return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading account…</div>;
  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading website…</div>;
  if (settings?.maintenanceMode && !isAdmin && !bypassesMaintenance) {
    return <MaintenancePage settings={settings} onRetry={retry} />;
  }
  if (error && !isAdmin && !bypassesMaintenance) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Unable to check website status</h1>
          <p className="mt-2 text-sm text-slate-600">We couldn’t confirm whether the website is available. Please try again.</p>
          <button type="button" onClick={retry} className="mt-5 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage adminOnly />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/maintenance-preview" element={
        <ProtectedRoute>
          <RoleRoute role="ADMIN"><MaintenancePreview /></RoleRoute>
        </ProtectedRoute>
      } />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/foods/:id" element={<FoodDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chef/dashboard" element={<RoleRoute role="CHEF"><ChefDashboardPage /></RoleRoute>} />
        <Route path="/admin/dashboard" element={<RoleRoute role="ADMIN"><AdminDashboardPage /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <MaintenanceProvider>
      <AppContent />
    </MaintenanceProvider>
  );
}
