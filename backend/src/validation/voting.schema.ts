import { z } from 'zod';

export const submitVoteSchema = z.object({
  body: z.object({
    candidateRequestId: z
      .string()
      .min(1, 'Candidate request ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid candidate request ID format'),

    supportingReason: z
      .string()
      .max(500, 'Supporting reason cannot exceed 500 characters')
      .optional(),
  }),

  params: z.object({
    ideaId: z
      .string()
      .min(1, 'Idea ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
  }),
});

export const concludeVotingSchema = z.object({
  params: z.object({
    ideaId: z
      .string()
      .min(1, 'Idea ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
  }),
});

export const getVotingSchema = z.object({
  params: z.object({
    ideaId: z
      .string()
      .min(1, 'Idea ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
  }),
});
