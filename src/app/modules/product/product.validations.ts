// Define your validations here
// Define your validations here
import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Product name is required',
    }),
    description: z.string({
      required_error: 'Description name is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
    stock: z.number({
      required_error: 'Stock is required',
    }),
    unit: z.string({
      required_error: 'Unit is required',
    }),
    sell: z.number().default(0),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const CategoryValidation = {
  create,
  update,
};
