import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { Food } from '../types';

export const FoodCard = ({ food }: { food: Food }) => {
  const { addItem } = useCart();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/foods/${food.id}`}>
        <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={food.name} className="h-48 w-full object-cover" />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{food.category?.name || 'Popular'}</span>
          <span className={`text-xs font-semibold ${food.isAvailable === false ? 'text-red-500' : 'text-green-600'}`}>
            {food.isAvailable === false ? 'Unavailable' : 'Available'}
          </span>
        </div>
        <Link to={`/foods/${food.id}`} className="text-lg font-bold text-slate-800">{food.name}</Link>
        <p className="mt-2 text-sm text-slate-600">{food.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-brand-600">${Number(food.price).toFixed(2)}</span>
          <button
            disabled={food.isAvailable === false}
            onClick={() => addItem(food)}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
