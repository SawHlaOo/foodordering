import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FoodCard } from '../components/FoodCard';
import type { Category, Food } from '../types';

export const HomePage = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories')
  });

  const { data: foods = [] } = useQuery({
    queryKey: ['featuredFoods'],
    queryFn: () => api.get<Food[]>('/foods')
  });

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular categories</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.filter((category) => category.name === 'Food' || category.name === 'Drinks').map((category) => (
            <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="mb-3 text-3xl">🍽️</div>
              <p className="font-semibold">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recommended picks</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {foods.slice(0, 4).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
};
