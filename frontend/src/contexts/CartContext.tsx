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

  const addItem = (food: Food) => {
    const value = Number(food.price || 0);
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === food.id);
      const nextItems = existing
        ? currentItems.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...currentItems, { id: food.id, name: food.name, price: value, imageUrl: food.imageUrl, quantity: 1 }];
      localStorage.setItem('flavorflow_cart', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setItems((currentItems) => {
      const nextItems = currentItems.map((item) => item.id === foodId ? { ...item, quantity } : item);
      localStorage.setItem('flavorflow_cart', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const removeItem = (foodId: string) => {
    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.id !== foodId);
      localStorage.setItem('flavorflow_cart', JSON.stringify(nextItems));
      return nextItems;
    });
  };

  const clearCart = () => {
    localStorage.setItem('flavorflow_cart', JSON.stringify([]));
    setItems([]);
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
