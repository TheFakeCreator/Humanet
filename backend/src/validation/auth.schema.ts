import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .optional(),
  skills: z
    .array(z.string().trim().min(1).max(50))
    .max(20, 'Cannot have more than 20 skills')
    .optional()
    .default([])
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
