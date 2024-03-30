// Define your validations here
// deliveryCharge.validation.ts

import { z } from 'zod';

// Define validations for delivery charge creation
const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    flatCharge: z.number().optional(),
    orderCostSlabs: z
      .array(
        z.object({
          fromCost: z.number(),
          toCost: z.number(),
          deliveryCharge: z.number(),
        })
      )
      .optional(),
    orderVolumeSlabs: z
      .array(
        z.object({
          fromWeight: z.number(),
          toWeight: z.number(),
          deliveryCharge: z.number(),
        })
      )
      .optional(),
  }),
});

// Define validations for delivery charge update
const update = z.object({
  body: z.object({
    id: z
      .number({ required_error: 'Delivery Charge ID is required' })
      .optional(),
    name: z.string().optional(),
    flatCharge: z.number().optional(),
    orderCostSlabs: z
      .array(
        z.object({
          id: z.number().optional(), // Allow updating existing slabs
          fromCost: z.number(),
          toCost: z.number(),
          deliveryCharge: z.number(),
        })
      )
      .optional(),
    orderVolumeSlabs: z
      .array(
        z.object({
          id: z.number().optional(), // Allow updating existing slabs
          fromWeight: z.number(),
          toWeight: z.number(),
          deliveryCharge: z.number(),
        })
      )
      .optional(),
  }),
});

export const DeliveryChargeValidation = {
  create,
  update,
};
