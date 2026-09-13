import { Link } from 'react-router-dom';
import type { Order } from '../types';

export const OrderCard = ({ order }: { order: Order }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Order #{order.orderNumber}</p>
        <h3 className="text-lg font-bold text-slate-800">{order.status}</h3>
      </div>
      <span className="text-sm font-medium text-brand-600">MMK {Number(order.total).toFixed(2)}</span>
    </div>
    <p className="mt-2 text-sm text-slate-600">Type: {order.orderType}</p>
    <p className="text-sm text-slate-600">Placed: {new Date(order.createdAt).toLocaleString()}</p>
    <div className="mt-4 flex justify-end">
      <Link to={`/orders/${order.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View details</Link>
    </div>
  </div>
);
