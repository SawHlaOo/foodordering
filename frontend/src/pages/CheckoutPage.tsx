import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../contexts/CartContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }
    if (customerName.trim().length < 2) {
      setErrorMessage('Full name must contain at least 2 characters.');
      return;
    }
    if (orderType === 'DELIVERY' && customerPhone.trim().length < 7) {
      setErrorMessage('Phone number must contain at least 7 characters.');
      return;
    }
    if (orderType === 'DINE_IN' && (!tableNumber || Number(tableNumber) < 1)) {
      setErrorMessage('Enter a valid table number for dine-in orders.');
      return;
    }
    if (orderType === 'DELIVERY' && deliveryAddress.trim().length < 5) {
      setErrorMessage('Delivery address must contain at least 5 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderType,
        customerName,
        customerPhone: customerPhone.trim() || undefined,
        tableNumber: orderType === 'DINE_IN' ? Number(tableNumber) : undefined,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
        customerNote,
        items: items.map((item) => ({ foodId: item.id, quantity: item.quantity, note: customerNote }))
      };

      const order = await api.post<{ id: string; orderNumber: string }>('/orders', payload);
      clearCart();
      navigate('/confirmation', { state: { orderId: order.id, orderNumber: order.orderNumber } });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-bold">Checkout</h2>
        {errorMessage && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" className="rounded-xl border border-slate-300 p-3" required />
          {orderType === 'DELIVERY' && (
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone number" className="rounded-xl border border-slate-300 p-3" required />
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Order type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY')} className="w-full rounded-xl border border-slate-300 p-3">
            <option value="DINE_IN">DINE_IN</option>
            <option value="TAKEAWAY">TAKEAWAY</option>
            <option value="DELIVERY">DELIVERY</option>
          </select>
        </div>

        {orderType === 'DINE_IN' && (
          <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Table number" className="w-full rounded-xl border border-slate-300 p-3" required />
        )}

        {orderType === 'DELIVERY' && (
          <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={3} placeholder="Delivery address" className="w-full rounded-xl border border-slate-300 p-3" required />
        )}

        <textarea value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} rows={3} placeholder="Order note" className="w-full rounded-xl border border-slate-300 p-3" />

        <button type="submit" disabled={submitting} className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-xl font-bold">Your order</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm text-slate-600">
              <span>{item.name} x {item.quantity}</span>
              <span>MMK {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>MMK {subtotal.toFixed(2)}</span></div>
          <div className="mt-2 flex justify-between font-bold text-slate-900"><span>Total</span><span>MMK {subtotal.toFixed(2)}</span></div>
        </div>
      </aside>
    </form>
  );
};
