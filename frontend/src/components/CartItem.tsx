import { useCart } from '../contexts/CartContext';

type CartItemProps = {
  item: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    quantity: number;
  };
};

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:gap-4">
      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <p className="text-sm text-slate-500">MMK {item.price.toFixed(2)} each</p>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full border border-slate-300">-</button>
          <span className="w-6 text-center font-medium">{item.quantity}</span>
          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full border border-slate-300">+</button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-800">MMK {(item.price * item.quantity).toFixed(2)}</p>
        <button type="button" onClick={() => removeItem(item.id)} className="mt-2 text-sm text-red-500">Remove</button>
      </div>
    </div>
  );
};
