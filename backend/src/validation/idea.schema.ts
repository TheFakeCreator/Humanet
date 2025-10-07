import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be at most 5000 characters'),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .default([]),
  domain: z
    .array(z.string().trim().min(1).max(50))
    .max(5, 'Cannot have more than 5 domains')
    .optional()
    .default([]),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID format')
    .optional()
    .nullable(),
  // Repository options
  autoCreateRepository: z.boolean().optional().default(false),
  repositoryTemplate: z.enum(['basic', 'research', 'technical']).optional().default('basic'),
});

export const updateIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be at most 5000 characters')
    .optional(),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
  domain: z
    .array(z.string().trim().min(1).max(50))
    .max(5, 'Cannot have more than 5 domains')
    .optional(),
});

export const ideaSearchSchema = z.object({
  search: z.string().trim().optional(),
  domain: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('20'),
  sortBy: z.enum(['createdAt', 'upvotes', 'forkCount']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type IdeaSearchInput = z.infer<typeof ideaSearchSchema>;
export type MongoIdInput = z.infer<typeof mongoIdSchema>;
