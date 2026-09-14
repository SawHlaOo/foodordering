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
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['chefOrders'] });
      const previousOrders = queryClient.getQueryData<any[]>(['chefOrders']);

      if (status === 'COMPLETED') {
        queryClient.setQueryData<any[]>(['chefOrders'], (currentOrders = []) =>
          currentOrders.filter((order) => order.id !== orderId)
        );
      }

      return { previousOrders };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['chefOrders'], context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chefOrders'] });
    }
  });

  const newOrders = orders.filter((order) => order.status === 'PENDING');
  const activeOrders = orders.filter((order) => ['CONFIRMED', 'PREPARING', 'READY'].includes(order.status));
  const completedOrders = orders.filter((order) => order.status === 'COMPLETED');
  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    READY: 'bg-cyan-100 text-cyan-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800'
  };
  const statusLabels: Record<string, string> = {
    PENDING: 'New',
    CONFIRMED: 'Accepted',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Done'
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Kitchen dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">New orders</p>
          <p className="mt-1 text-2xl font-black text-amber-900">{newOrders.length}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-800">In kitchen</p>
          <p className="mt-1 text-2xl font-black text-blue-900">{activeOrders.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">Done</p>
          <p className="mt-1 text-2xl font-black text-emerald-900">{completedOrders.length}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {orders.map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">#{order.orderNumber}</p>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[order.status] ?? 'bg-slate-100 text-slate-700'}`}>
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>
            <p className="mt-4 font-semibold text-slate-800">Customer: {order.customer?.name}</p>
            <p className="text-sm text-slate-600">Type: {order.orderType}</p>
            {order.orderType === 'DINE_IN' && (
              <p className="text-sm font-semibold text-slate-700">Table: {order.tableNumber ?? 'Not provided'}</p>
            )}
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
              {(order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY') && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'COMPLETED' })} className="rounded-full bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Complete</button>}
              {order.status === 'COMPLETED' && <span className="text-sm font-semibold text-emerald-700">Order completed</span>}
            </div>
            {updateStatus.isError && <p role="alert" className="mt-3 text-sm text-red-600">{updateStatus.error instanceof Error ? updateStatus.error.message : 'Unable to update order status'}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
