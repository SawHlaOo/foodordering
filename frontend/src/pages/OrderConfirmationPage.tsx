import { Link, useLocation } from 'react-router-dom';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = (location.state as { orderNumber?: string; orderId?: string } | null) || {};

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
      <div className="mb-4 text-5xl">✅</div>
      <h1 className="text-3xl font-black text-slate-900">Order placed successfully</h1>
      <p className="mt-3 text-slate-600">Your order #{order.orderNumber || 'FF-0000'} is now being prepared.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/orders" className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">Track order</Link>
        <Link to="/menu" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700">Continue shopping</Link>
      </div>
    </div>
  );
};
