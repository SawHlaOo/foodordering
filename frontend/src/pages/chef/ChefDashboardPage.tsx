import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';

export const ChefDashboardPage = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['chefOrders'],
    queryFn: () => api.get<any[]>('/chef/orders'),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false
  });

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/chef/orders/${orderId}/status`, { status });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Kitchen dashboard</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {orders.map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">#{order.orderNumber}</p>
              <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">{order.status}</span>
            </div>
            <p className="mt-4 font-semibold text-slate-800">Customer: {order.customer?.name}</p>
            <p className="text-sm text-slate-600">Type: {order.orderType}</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.food.name}</span>
                  <span>{item.note || ''}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {order.status === 'PENDING' && <button onClick={() => updateStatus(order.id, 'CONFIRMED')} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white">Accept order</button>}
              {order.status === 'CONFIRMED' && <button onClick={() => updateStatus(order.id, 'PREPARING')} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white">Start preparing</button>}
              {order.status === 'PREPARING' && <button onClick={() => updateStatus(order.id, 'READY')} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white">Mark ready</button>}
              {order.status === 'READY' && <button onClick={() => updateStatus(order.id, 'COMPLETED')} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white">Complete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
