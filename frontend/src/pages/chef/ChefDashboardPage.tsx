import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';

export const ChefDashboardPage = () => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ['chefOrders'],
    queryFn: () => api.get<any[]>('/chef/orders'),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      api.patch(`/chef/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chefOrders'] });
    }
  });

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
              {order.status === 'PENDING' && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'CONFIRMED' })} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Accept order</button>}
              {order.status === 'CONFIRMED' && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'PREPARING' })} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Start preparing</button>}
              {order.status === 'PREPARING' && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'READY' })} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Mark ready</button>}
              {order.status === 'READY' && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'COMPLETED' })} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Complete</button>}
            </div>
            {updateStatus.isError && <p role="alert" className="mt-3 text-sm text-red-600">{updateStatus.error instanceof Error ? updateStatus.error.message : 'Unable to update order status'}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
