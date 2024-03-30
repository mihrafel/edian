// Define your validations here
import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Zone name is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const ZoneValidation = {
  create,
  update,
};
