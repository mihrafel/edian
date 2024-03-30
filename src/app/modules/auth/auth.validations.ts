// Define your validations here
import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    usernameOrEmail: z.string({
      required_error: 'Username or Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
