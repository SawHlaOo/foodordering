import { Link } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { useCart } from '../contexts/CartContext';

export const CartPage = () => {
  const { items, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-12">
        <p className="text-xl font-bold">Your cart is empty</p>
        <p className="mt-2 text-slate-500">Add some delicious meals to get started.</p>
        <Link to="/menu" className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">Browse menu</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between"><span>Items</span><span>{totalItems}</span></div>
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>$0.00</span></div>
          <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between text-base font-bold text-slate-900"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
        </div>
        <Link to="/checkout" className="mt-6 block w-full rounded-full bg-brand-600 py-3 text-center font-semibold text-white">Checkout</Link>
      </aside>
    </div>
  );
};
