import { ApiError } from '../middleware/errorHandler.js';
import { categoryRepo } from '../repositories/categoryRepo.js';
import { foodRepo } from '../repositories/foodRepo.js';

export const menuService = {
  getCategories: async () => categoryRepo.list(),
  getFoods: async () => foodRepo.list(),
  getAllFoods: async () => foodRepo.listAll(),
  getFoodById: async (id: string) => {
    const food = await foodRepo.getById(id);
    if (!food) throw new ApiError('Food item not found.', 404);
    return food;
  },
  createCategory: async (payload: any) => categoryRepo.create(payload),
  updateCategory: async (id: string, payload: any) => {
    const category = await categoryRepo.getById(id);
    if (!category) throw new ApiError('Category not found.', 404);
    return categoryRepo.update(id, payload);
  },
  deleteCategory: async (id: string) => {
    const category = await categoryRepo.getById(id);
    if (!category) throw new ApiError('Category not found.', 404);
    return categoryRepo.remove(id);
  },
  createFood: async (payload: any) => foodRepo.create(payload),
  updateFood: async (id: string, payload: any) => {
    const food = await foodRepo.getById(id);
    if (!food) throw new ApiError('Food item not found.', 404);
    return foodRepo.update(id, payload);
  },
  deleteFood: async (id: string) => {
    const food = await foodRepo.getById(id);
    if (!food) throw new ApiError('Food item not found.', 404);
    return foodRepo.remove(id);
  }
};
