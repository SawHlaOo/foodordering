import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@flavorflow.com';
  const adminChefPassword = process.env.ADMIN_CHEF_PASSWORD;
  if (!adminChefPassword || adminChefPassword.length < 16) {
    throw new Error('ADMIN_CHEF_PASSWORD must be set and contain at least 16 characters.');
  }

  const password = await bcrypt.hash(adminChefPassword, 12);

  const legacyAdmin = await prisma.user.findUnique({ where: { email: 'admin@flavorflow.com' } });
  const currentAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (legacyAdmin && !currentAdmin && adminEmail !== legacyAdmin.email) {
    await prisma.user.update({
      where: { id: legacyAdmin.id },
      data: { email: adminEmail, password }
    });
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password, role: 'ADMIN' },
    create: { email: adminEmail, name: 'Admin User', password, role: 'ADMIN', phone: '+1234567890' }
  });

  await prisma.user.upsert({
    where: { email: 'chef1@flavorflow.com' },
    update: { password, role: 'CHEF' },
    create: { email: 'chef1@flavorflow.com', name: 'Chef One', password, role: 'CHEF', phone: '+1234567891' }
  });

  await prisma.user.upsert({
    where: { email: 'chef2@flavorflow.com' },
    update: { password, role: 'CHEF' },
    create: { email: 'chef2@flavorflow.com', name: 'Chef Two', password, role: 'CHEF', phone: '+1234567892' }
  });

  await prisma.user.upsert({
    where: { email: 'customer1@flavorflow.com' },
    update: {},
    create: { email: 'customer1@flavorflow.com', name: 'Customer One', password, role: 'CUSTOMER', phone: '+1234567893' }
  });

  const categories = [
    { name: 'Food', slug: 'food', description: 'Freshly prepared food', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
    { name: 'Drinks', slug: 'drinks', description: 'Cold refreshments', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e' },
  ];

  const createdCategories = [] as Array<{ id: string; slug: string }>;
  for (const category of categories) {
    const item = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
    createdCategories.push(item);
  }

  const categoryMap = Object.fromEntries(createdCategories.map((item) => [item.slug, item.id]));

  const foods = [
    { name: 'Classic Burger', slug: 'classic-burger', description: 'Beef patty, cheddar, lettuce, tomato, burger sauce.', price: 12.5, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', ingredients: ['Beef', 'Cheddar', 'Lettuce', 'Tomato'], preparationTime: 15 },
    { name: 'Spicy Chicken Burger', slug: 'spicy-chicken-burger', description: 'Crispy chicken, jalapenos, pickles, and spicy mayo.', price: 14.0, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349', ingredients: ['Chicken', 'Jalapenos', 'Pickles', 'Spicy mayo'], preparationTime: 18 },
    { name: 'Margherita Pizza', slug: 'margherita-pizza', description: 'Fresh mozzarella, basil, and tomato sauce.', price: 16.0, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', ingredients: ['Mozzarella', 'Tomato', 'Basil'], preparationTime: 20 },
    { name: 'Pepperoni Pizza', slug: 'pepperoni-pizza', description: 'Loaded with pepperoni and stretchy mozzarella.', price: 18.5, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1548365328-9f547fb9587c', ingredients: ['Pepperoni', 'Mozzarella', 'Tomato'], preparationTime: 22 },
    { name: 'Chicken Rice Bowl', slug: 'chicken-rice-bowl', description: 'Grilled chicken with rice, vegetables, and special sauce.', price: 13.5, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19', ingredients: ['Chicken', 'Rice', 'Vegetables', 'Sauce'], preparationTime: 16 },
    { name: 'Beef Noodles', slug: 'beef-noodles', description: 'Tender beef noodles with savory broth.', price: 15.5, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e', ingredients: ['Beef', 'Noodles', 'Vegetables'], preparationTime: 17 },
    { name: 'Citrus Soda', slug: 'citrus-soda', description: 'Sparkling citrus refreshment.', price: 4.0, categoryId: categoryMap['drinks'], imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e', ingredients: ['Lemon', 'Sparkling water'], preparationTime: 5 },
    { name: 'Chocolate Cake', slug: 'chocolate-cake', description: 'Rich chocolate layered cake.', price: 7.5, categoryId: categoryMap['food'], imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b', ingredients: ['Chocolate', 'Cream'], preparationTime: 10 }
  ];

  for (const food of foods) {
    await prisma.food.upsert({
      where: { slug: food.slug },
      update: { categoryId: food.categoryId },
      create: { ...food, isAvailable: true }
    });
  }

  await prisma.category.deleteMany({
    where: { slug: { in: ['burgers', 'pizza', 'rice', 'noodles', 'desserts'] } }
  });

  console.log('Seed data created successfully.');
}

main().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
