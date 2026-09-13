import { createContext, useContext, useMemo, useState } from 'react';
import type { Food } from '../types';

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (food: Food) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeItem: (foodId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('flavorflow_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = (nextItems: CartItem[]) => {
    localStorage.setItem('flavorflow_cart', JSON.stringify(nextItems));
    setItems(nextItems);
  };

  const addItem = (food: Food) => {
    const value = Number(food.price || 0);
    const existing = items.find((item) => item.id === food.id);
    if (existing) {
      persist(items.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item));
      return;
    }
    persist([...items, { id: food.id, name: food.name, price: value, imageUrl: food.imageUrl, quantity: 1 }]);
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    persist(items.map((item) => item.id === foodId ? { ...item, quantity } : item));
  };

  const removeItem = (foodId: string) => {
    persist(items.filter((item) => item.id !== foodId));
  };

  const clearCart = () => {
    persist([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo<CartContextValue>(() => ({ items, addItem, updateQuantity, removeItem, clearCart, totalItems, subtotal }), [items, totalItems, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
