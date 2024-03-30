// Define your validations here
// Define your validations here
import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    amount: z.number({
      required_error: 'amount is required',
    }),
    purpose: z.string({
      required_error: 'purpose is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is required',
      })
      .optional(),
    amount: z
      .number({
        required_error: 'amount is required',
      })
      .optional(),
    purpose: z
      .string({
        required_error: 'purpose is required',
      })
      .optional(),
  }),
});

export const OperationalCostManagementValidation = {
  create,
  update,
};
