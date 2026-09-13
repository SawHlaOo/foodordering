import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../middleware/errorHandler.js';
import { userRepo } from '../repositories/userRepo.js';

export const authService = {
  register: async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const existing = await userRepo.findByEmail(payload.email.toLowerCase());
    if (existing) {
      throw new ApiError('A user with this email already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await userRepo.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: passwordHash,
      phone: payload.phone ?? null,
      role: 'CUSTOMER'
    });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token: jwt.sign({ userId: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' })
    };
  },
  login: async (payload: { email: string; password: string }) => {
    const user = await userRepo.findByEmail(payload.email.toLowerCase());
    if (!user) {
      throw new ApiError('Invalid email or password.', 401);
    }

    const valid = await bcrypt.compare(payload.password, user.password);
    if (!valid) {
      throw new ApiError('Invalid email or password.', 401);
    }

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token: jwt.sign({ userId: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' })
    };
  },
  me: async (userId: string) => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new ApiError('User not found.', 404);
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
  }
};
