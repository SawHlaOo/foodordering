import { z } from 'zod';

export const createOrderSchema = z.object({
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
  items: z.array(z.object({
    foodId: z.string().min(1, 'Food ID is required.'),
    quantity: z.number().int().positive('Quantity must be greater than zero.'),
    note: z.string().optional()
  })).min(1, 'Order must contain at least one item.'),
  tableNumber: z.number().int().positive('Table number must be greater than zero.').optional(),
  deliveryAddress: z.string().min(5, 'Delivery address must contain at least 5 characters.').optional(),
  customerNote: z.string().optional(),
  customerName: z.string().min(2, 'Full name must contain at least 2 characters.'),
  customerPhone: z.string().min(7, 'Phone number must contain at least 7 characters.').optional()
}).superRefine((order, context) => {
  if (order.orderType === 'DINE_IN' && order.tableNumber === undefined) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['tableNumber'], message: 'Table number is required for dine-in orders.' });
  }
  if (order.orderType === 'DELIVERY' && !order.deliveryAddress) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['deliveryAddress'], message: 'Delivery address is required for delivery orders.' });
  }
  if (order.orderType === 'DELIVERY' && !order.customerPhone) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['customerPhone'], message: 'Phone number is required for delivery orders.' });
  }
});

export const statusUpdateSchema = z.object({
  status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'])
});
