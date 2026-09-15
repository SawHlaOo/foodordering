import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export const ChefDashboardPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
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
          currentOrders.map((order) => order.id === orderId ? { ...order, status } : order)
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
  const removeOrder = useMutation({
    mutationFn: (orderId: string) => api.delete(`/chef/orders/${orderId}`),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ['chefOrders'] });
      const previousOrders = queryClient.getQueryData<any[]>(['chefOrders']);
      queryClient.setQueryData<any[]>(['chefOrders'], (currentOrders = []) =>
        currentOrders.filter((order) => order.id !== orderId)
      );
      return { previousOrders };
    },
    onError: (_error, _orderId, context) => {
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
  const displayedOrders = activeTab === 'completed'
    ? completedOrders
    : orders.filter((order) => order.status !== 'COMPLETED');
  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-600',
    CONFIRMED: 'bg-blue-50 text-blue-600',
    PREPARING: 'bg-[#F7E7D8] text-[#9A5A2E]',
    READY: 'bg-blue-50 text-blue-600',
    COMPLETED: 'bg-emerald-50 text-emerald-600'
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
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'active' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:bg-white hover:text-brand-700'}`}
        >
          Active orders ({orders.length - completedOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'completed' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:bg-white hover:text-brand-700'}`}
        >
          Done ({completedOrders.length})
        </button>
      </div>
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
        {displayedOrders.map((order) => (
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
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                to={`/orders/${order.id}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 px-4 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                View details
              </Link>
              {order.status === 'PENDING' && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'CONFIRMED' })} className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60">Accept order</button>}
              {(order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY') && <button type="button" disabled={updateStatus.isPending && updateStatus.variables?.orderId === order.id} onClick={() => updateStatus.mutate({ orderId: order.id, status: 'COMPLETED' })} className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60">Complete</button>}
              {order.status === 'COMPLETED' && (
                <>
                  <span className="inline-flex h-10 items-center rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-emerald-600">Order completed</span>
                  <button
                    type="button"
                    disabled={removeOrder.isPending && removeOrder.variables === order.id}
                    onClick={() => removeOrder.mutate(order.id)}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
            {updateStatus.isError && <p role="alert" className="mt-3 text-sm text-red-600">{updateStatus.error instanceof Error ? updateStatus.error.message : 'Unable to update order status'}</p>}
            {removeOrder.isError && <p role="alert" className="mt-3 text-sm text-red-600">{removeOrder.error instanceof Error ? removeOrder.error.message : 'Unable to remove order'}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
