import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../contexts/CartContext';
import type { Food } from '../types';

export const FoodDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const { addItem } = useCart();

  const { data: food } = useQuery({
    queryKey: ['food', id],
    queryFn: () => api.get<Food>(`/foods/${id}`),
    enabled: !!id
  });

  if (!food) return <div className="rounded-2xl bg-white p-8 text-center text-slate-600">Loading food details...</div>;

  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={food.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{food.category?.name || 'Popular dish'}</p>
        <h1 className="text-4xl font-black text-slate-900">{food.name}</h1>
        <p className="text-lg text-slate-600">{food.description}</p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-black text-brand-600">${Number(food.price).toFixed(2)}</span>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${food.isAvailable === false ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
            {food.isAvailable === false ? 'Currently unavailable' : 'Available'}
          </span>
        </div>
        <div>
          <p className="mb-2 font-semibold text-slate-800">Ingredients</p>
          <div className="flex flex-wrap gap-2">
            {food.ingredients?.map((ingredient) => (
              <span key={ingredient} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{ingredient}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">Quantity</span>
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-10 w-10 rounded-full border border-slate-300">-</button>
          <span className="w-8 text-center font-bold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-10 w-10 rounded-full border border-slate-300">+</button>
        </div>

        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for your order" className="w-full rounded-2xl border border-slate-300 p-3" rows={4} />

        <button
          type="button"
          disabled={food.isAvailable === false}
          onClick={() => {
            for (let i = 0; i < quantity; i += 1) addItem(food);
          }}
          className="w-full rounded-full bg-brand-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};
