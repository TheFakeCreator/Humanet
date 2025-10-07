import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters'),
  parentCommentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent comment ID format')
    .optional()
});

export const updateCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters')
});

export const voteCommentSchema = z.object({
  voteType: z.enum(['upvote', 'downvote', 'remove'], {
    required_error: 'Vote type is required',
    invalid_type_error: 'Invalid vote type'
  })
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type VoteCommentInput = z.infer<typeof voteCommentSchema>;
