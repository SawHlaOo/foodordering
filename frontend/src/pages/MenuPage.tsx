import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { FoodCard } from '../components/FoodCard';
import type { Category, Food } from '../types';

export const MenuPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const { data: foods = [] } = useQuery({
    queryKey: ['allFoods'],
    queryFn: () => api.get<Food[]>('/foods')
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => api.get<Category[]>('/categories')
  });

  const filteredFoods = useMemo(() => {
    let next = [...foods];

    if (category !== 'all') {
      next = next.filter((food) => food.categoryId === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((food) => food.name.toLowerCase().includes(query) || food.description.toLowerCase().includes(query));
    }

    if (sortBy === 'price-low') next = next.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') next = next.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === 'name') next = next.sort((a, b) => a.name.localeCompare(b.name));

    return next;
  }, [foods, category, search, sortBy]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search menu items"
            className="min-w-0 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-w-0 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3">
            <option value="all">All categories</option>
            {categories.filter((categoryItem) => categoryItem.name === 'Food' || categoryItem.name === 'Drinks').map((categoryItem) => (
              <option key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-w-0 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
};
