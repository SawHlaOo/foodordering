import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { Food } from '../types';

export const FoodCard = ({ food }: { food: Food }) => {
  const { addItem } = useCart();

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link to={`/foods/${food.id}`} className="block overflow-hidden">
        <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={food.name} className="h-40 w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] sm:h-48" />
      </Link>
      <div className="p-3.5 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{food.category?.name || 'Popular'}</span>
          <span className={`text-xs font-semibold ${food.isAvailable === false ? 'text-red-500' : 'text-green-600'}`}>
            {food.isAvailable === false ? 'Unavailable' : 'Available'}
          </span>
        </div>
        <Link to={`/foods/${food.id}`} className="text-lg font-bold text-slate-800">{food.name}</Link>
        <p className="mt-2 line-clamp-2 text-xs text-slate-600 sm:text-sm">{food.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-600 sm:text-xl">MMK {Number(food.price).toFixed(2)}</span>
          <button
            type="button"
            disabled={food.isAvailable === false}
            onClick={() => addItem(food)}
            aria-label={`Add ${food.name} to cart`}
            title="Add to cart"
            className="rounded-full bg-brand-600 p-2.5 text-white transition duration-200 hover:scale-105 hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <svg aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1" />
              <circle cx="19" cy="20" r="1" />
              <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
