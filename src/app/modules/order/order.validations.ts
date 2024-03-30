// Define your validations here
import { z } from 'zod';

// Define validations for order creation
const create = z.object({
  body: z.object({
    userId: z.number({ required_error: 'User ID is required' }),
    orderItems: z
      .array(
        z.object({
          productId: z.string({ required_error: 'Product ID is required' }),
          quantity: z
            .number()
            .int()
            .min(1, { message: 'Quantity must be at least 1' }),
        })
      )
      .nonempty({ message: 'At least one order item is required' }),
    paymentId: z.string().optional(),
    isCashOnDelivery: z.boolean().optional(),
    totalAmount: z.number({ required_error: 'Total amount is required' }),
  }),
});

// Define validations for order update
const update = z.object({
  body: z.object({
    id: z.string({ required_error: 'Order ID is required' }).optional(),
    userId: z.number().int().optional(),
    orderItems: z
      .array(
        z.object({
          id: z.string().uuid().optional(), // Allow updating existing items
          productId: z.string().optional(),
          quantity: z
            .number()
            .int()
            .min(1, { message: 'Quantity must be at least 1' }),
        })
      )
      .optional(),
    paymentId: z.string().optional(),
    isCashOnDelivery: z.boolean().optional(),
    status: z
      .enum([
        'PENDING',
        'PAID',
        'INPROGRESS',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ])
      .optional(),
  }),
});

export const OrderValidation = {
  create,
  update,
};
