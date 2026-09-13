import { z } from 'zod';

const imageUrlSchema = z.union([
  z.string().url(),
  z.string().regex(/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/, 'Image must be a valid uploaded image.'),
  z.literal('')
]).optional();

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required.'),
  slug: z.string().min(2, 'Slug is required.'),
  description: z.string().optional(),
  imageUrl: imageUrlSchema,
  isAvailable: z.boolean().optional()
});

export const foodSchema = z.object({
  name: z.string().min(2, 'Food name is required.'),
  slug: z.string().min(2, 'Slug is required.'),
  description: z.string().min(5, 'Description is required.'),
  price: z.number().positive('Price must be greater than zero.'),
  imageUrl: imageUrlSchema,
  categoryId: z.string().min(1, 'Category is required.'),
  ingredients: z.array(z.string().min(1)).min(1, 'At least one ingredient is required.'),
  preparationTime: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional()
});
