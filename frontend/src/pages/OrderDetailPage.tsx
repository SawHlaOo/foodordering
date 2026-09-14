import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { OrderStatusTracker } from '../components/OrderStatusTracker';
import type { Order } from '../types';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const displayStatus = (status: string) => status === 'PREPARING' || status === 'READY' ? 'CONFIRMED' : status;

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<Order>(`/orders/${id}`),
    enabled: !!id,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true
  });

  if (!order) return <div className="rounded-2xl bg-white p-6 text-center text-slate-600">Loading order details...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Order #{order.orderNumber}</p>
            <h1 className="text-2xl font-black text-slate-900">{displayStatus(order.status)}</h1>
          </div>
          <span className="text-xl font-bold text-brand-600">MMK {Number(order.total).toFixed(2)}</span>
        </div>
        <OrderStatusTracker currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-600">
                <span>{item.quantity}x {item.food.name}</span>
                <span>MMK {Number(item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Type</span><span>{order.orderType}</span></div>
            <div className="flex justify-between"><span>Placed</span><span>{new Date(order.createdAt).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>MMK {Number(order.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery fee</span><span>MMK {Number(order.deliveryFee).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-slate-900"><span>Total</span><span>MMK {Number(order.total).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
