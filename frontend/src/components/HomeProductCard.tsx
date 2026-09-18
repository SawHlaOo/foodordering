import { Link } from 'react-router-dom';
import type { Food } from '../types';

type HomeProductCardProps = {
  food: Food;
  ariaHidden?: boolean;
};

export const HomeProductCard = ({ food, ariaHidden = false }: HomeProductCardProps) => (
  <Link
    to={`/foods/${food.id}`}
    aria-hidden={ariaHidden}
    tabIndex={ariaHidden ? -1 : undefined}
    className="group block w-28 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-32"
  >
    <span className="block overflow-hidden bg-sage-50">
      <img
        src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
        alt={food.name}
        className="aspect-square w-full object-cover transition duration-300 ease-out group-hover:scale-[1.04]"
      />
    </span>
    <span className="block px-2.5 py-2.5">
      <span className="block truncate text-sm font-bold text-slate-800">{food.name}</span>
      {food.category?.name && <span className="mt-1 block truncate text-[11px] text-slate-500">{food.category.name}</span>}
    </span>
  </Link>
);
