import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import type { Category, Food } from '../../types';

type FoodForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  ingredients: string;
  preparationTime: string;
  imageUrl: string;
  isAvailable: boolean;
};

const emptyForm: FoodForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  ingredients: '',
  preparationTime: '15',
  imageUrl: '',
  isAvailable: true
};

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FoodForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formSectionRef = useRef<HTMLElement | null>(null);
  const activeTab = searchParams.get('tab') ?? 'overview';

  const { data: stats } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => api.get<{ todaysOrders: number; pendingOrders: number; preparingOrders: number; completedOrders: number; todaysRevenue: number; totalCustomers: number; totalChefs: number; totalMenuItems: number }>('/admin/dashboard')
  });
  const { data: foods = [] } = useQuery({
    queryKey: ['adminFoods'],
    queryFn: () => api.get<Food[]>('/foods/admin/all')
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories')
  });
  const { data: completedOrders = [] } = useQuery({
    queryKey: ['adminCompletedOrders'],
    queryFn: () => api.get<Array<{
      id: string;
      customerName: string;
      foodNames: string[];
      orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
      deliveryAddress: string | null;
      customerPhone: string | null;
      completedAt: string;
    }>>('/admin/completed-orders')
  });

  const saveFood = useMutation({
    mutationFn: async (payload: FoodForm) => {
      const body = {
        name: payload.name.trim(),
        slug: slugify(payload.name),
        description: payload.description.trim(),
        price: Number(payload.price),
        categoryId: payload.categoryId,
        ingredients: payload.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
        preparationTime: Number(payload.preparationTime),
        imageUrl: payload.imageUrl,
        isAvailable: payload.isAvailable
      };
      return editingId
        ? api.patch<Food>(`/foods/${editingId}`, body)
        : api.post<Food>('/foods', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setForm(emptyForm);
      setEditingId(null);
      setFormError('');
      setSuccessMessage('Menu item saved successfully.');
    },
    onError: (error: Error) => setFormError(error.message)
  });

  const deleteFood = useMutation({
    mutationFn: (id: string) => api.delete(`/foods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setSuccessMessage('Menu item deleted.');
    },
    onError: (error: Error) => setFormError(error.message)
  });

  const deleteCompletedOrder = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/completed-orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompletedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setSuccessMessage('Completed order permanently deleted.');
    },
    onError: (error: Error) => setFormError(error.message)
  });

  const cards = [
    { label: 'Today\'s Orders', value: stats?.todaysOrders ?? 0 },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0 },
    { label: 'Active Orders', value: stats?.pendingOrders ?? 0 },
    { label: 'Completed Orders', value: stats?.completedOrders ?? 0 },
    { label: 'Today\'s Revenue', value: `MMK ${(stats?.todaysRevenue ?? 0).toFixed(2)}` },
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0 },
    { label: 'Total Chefs', value: stats?.totalChefs ?? 0 },
    { label: 'Total Menu Items', value: stats?.totalMenuItems ?? 0 }
  ];

  const categoryName = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);

  const editFood = (food: Food) => {
    setEditingId(food.id);
    setForm({
      name: food.name,
      description: food.description,
      price: String(food.price),
      categoryId: food.categoryId,
      ingredients: food.ingredients.join(', '),
      preparationTime: String(food.preparationTime ?? 15),
      imageUrl: food.imageUrl ?? '',
      isAvailable: food.isAvailable !== false
    });
    setFormError('');
    setSuccessMessage('');
    navigate('/admin/dashboard?tab=form');
  };

  const handleImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Images must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((current) => ({ ...current, imageUrl: reader.result as string }));
        setFormError('');
      }
    };
    reader.onerror = () => setFormError('The image could not be read.');
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('');
    if (!form.categoryId || form.ingredients.split(',').map((item) => item.trim()).filter(Boolean).length === 0) {
      setFormError('Choose a category and enter at least one ingredient.');
      return;
    }
    saveFood.mutate(form);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-slate-500">Manage the kitchen and restaurant menu from one place.</p>
      </div>

      {activeTab === 'overview' && <section id="admin-overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
          </div>
        ))}
      </section>}

      {activeTab === 'menu' && <section id="admin-menu" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Food and drinks</h2>
            <p className="text-sm text-slate-500">Add, edit, remove, or temporarily hide menu items.</p>
          </div>
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setFormError(''); setSuccessMessage(''); navigate('/admin/dashboard?tab=form'); }} className="rounded-full bg-brand-600 px-4 py-2 font-semibold text-white">
            Add new item
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foods.map((food) => (
            <article key={food.id} className="overflow-hidden rounded-2xl border border-slate-200">
              {food.imageUrl ? <img src={food.imageUrl} alt={food.name} className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">No image</div>}
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{food.name}</h3>
                    <p className="text-sm text-slate-500">{categoryName.get(food.categoryId) ?? food.category?.name}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${food.isAvailable === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                    {food.isAvailable === false ? 'Hidden' : 'Available'}
                  </span>
                </div>
                <p className="font-semibold text-brand-700">MMK {Number(food.price).toFixed(2)}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editFood(food)} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium">Edit</button>
                  <button type="button" onClick={() => { if (window.confirm(`Delete ${food.name}?`)) deleteFood.mutate(food.id); }} className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>}

      {activeTab === 'completed' && <section id="admin-completed" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Completed order records</h2>
        <p className="mt-1 text-sm text-slate-500">Customer name, food ordered, and completion date.</p>
        <div className="mt-5 space-y-3">
          {completedOrders.length === 0 && <p className="text-sm text-slate-500">No completed orders yet.</p>}
          {completedOrders.map((order) => (
            <div key={order.id} className="flex flex-col gap-1 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{order.customerName}</p>
                <p className="text-sm text-slate-600">{order.foodNames.join(', ')}</p>
                {order.orderType === 'DELIVERY' && (
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-700">Address:</span> {order.deliveryAddress || 'Not provided'}</p>
                    <p><span className="font-semibold text-slate-700">Phone:</span> {order.customerPhone || 'Not provided'}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <time dateTime={order.completedAt} className="text-sm text-slate-500">{new Date(order.completedAt).toLocaleString()}</time>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 px-4 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 sm:flex-none"
                  >
                    View detail
                  </Link>
                  <span className="inline-flex h-10 items-center rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-emerald-600">
                    Order completed
                  </span>
                  <button
                    type="button"
                    disabled={deleteCompletedOrder.isPending}
                    onClick={() => {
                      if (window.confirm(`Remove the completed order for ${order.customerName}?`)) {
                        setFormError('');
                        deleteCompletedOrder.mutate(order.id);
                      }
                    }}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {activeTab === 'form' && <section id="admin-menu-form" ref={formSectionRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit menu item' : 'Add menu item'}</h2>
        <p className="mt-1 text-sm text-slate-500">Use an image URL or upload PNG, JPG, WEBP, and GIF files up to 5 MB.</p>
        {formError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
        {successMessage && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</p>}
        <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Food or drink name" className="rounded-xl border border-slate-300 px-3 py-2" />
          <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2">
            <option value="">Select category</option>
            {categories.filter((category) => category.name === 'Food' || category.name === 'Drinks').map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
          <input required min="0.01" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input required min="1" type="number" value={form.preparationTime} onChange={(event) => setForm({ ...form, preparationTime: event.target.value })} placeholder="Preparation time (minutes)" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input required value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} placeholder="Ingredients, separated by commas" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Image URL</span>
            <input
              type="url"
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
              placeholder="https://example.com/menu-image.jpg"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 md:col-span-2">
            <span className="font-semibold">Or upload a menu image</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => handleImage(event.target.files?.[0])} className="mt-2 block w-full text-sm" />
          </label>
          {form.imageUrl && <img src={form.imageUrl} alt="Selected menu preview" className="h-48 w-full rounded-xl object-cover md:col-span-2" />}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} />
            Available to customers
          </label>
          <div className="flex gap-2 md:justify-end">
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-full border border-slate-300 px-4 py-2 font-semibold">Cancel</button>}
            <button disabled={saveFood.isPending} className="rounded-full bg-brand-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
              {saveFood.isPending ? 'Saving...' : editingId ? 'Update item' : 'Create item'}
            </button>
          </div>
        </form>
      </section>}
    </div>
  );
};
