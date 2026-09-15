import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { FoodCard } from '../components/FoodCard';
import type { Food } from '../types';

export const HomePage = () => {
  const { data: foods = [] } = useQuery({
    queryKey: ['featuredFoods'],
    queryFn: () => api.get<Food[]>('/foods')
  });

  return (
    <div className="space-y-10">
      <section>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#541525] via-[#7A1F32] to-[#9A3A4F] px-5 py-7 text-white shadow-soft sm:px-8 sm:py-9">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-rose-100">FlavorFlow special</p>
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">Your next favorite meal is waiting.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-rose-100 sm:text-base">
              Fresh food, refreshing drinks, and easy ordering delivered straight to your table.
            </p>
            <Link to="/menu" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-[#F5E6E1]">
              Explore today&apos;s menu
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recommended picks</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {foods.slice(0, 4).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
};
