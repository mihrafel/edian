// Define your validations here
// Define your validations here
// Define your validations here
import { z } from 'zod';

const create = z.object({
  body: z.object({
    orderId: z.string({
      required_error: 'Order Id is required',
    }),
    employeeId: z.string({
      required_error: 'Employee Id is required',
    }),

    deliveryTimeCommitted: z.number({
      required_error: 'Delivery Time Committed is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    orderId: z
      .string({
        required_error: 'Order Id is required',
      })
      .optional(),
    employeeId: z
      .string({
        required_error: 'Employee Id is required',
      })
      .optional(),

    deliveryTimeCommitted: z
      .number({
        required_error: 'Delivery Time Committed is required',
      })
      .optional(),
  }),
});

export const AssignOrderToDPValidation = {
  create,
  update,
};
