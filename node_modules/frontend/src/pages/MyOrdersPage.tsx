import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { OrderCard } from '../components/OrderCard';
import type { Order } from '../types';

export const MyOrdersPage = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => api.get<Order[]>('/orders')
  });

  if (isLoading) return <div className="rounded-2xl bg-white p-6 text-center text-slate-600">Loading orders...</div>;
  if (orders.length === 0) return <div className="rounded-2xl bg-white p-10 text-center text-slate-600">No orders yet</div>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
