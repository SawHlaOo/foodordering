export type Role = 'CUSTOMER' | 'CHEF' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
};

export type Food = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl?: string | null;
  categoryId: string;
  ingredients: string[];
  preparationTime?: number;
  isAvailable?: boolean;
  category?: { name: string };
  slug?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isAvailable?: boolean;
};

export type OrderItem = {
  id: string;
  food: Food;
  quantity: number;
  price: number | string;
  note?: string | null;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  customerId: string;
  orderType: string;
  total: number | string;
  subtotal: number | string;
  deliveryFee: number | string;
  tableNumber?: number | null;
  deliveryAddress?: string | null;
  customerNote?: string | null;
  createdAt: string;
  items?: OrderItem[];
  customer?: User;
  chef?: User | null;
};
