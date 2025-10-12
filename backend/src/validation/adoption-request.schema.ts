import { z } from 'zod';

export const createAdoptionRequestSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message cannot exceed 1000 characters'),

    qualifications: z
      .string()
      .min(20, 'Please describe your qualifications (minimum 20 characters)')
      .max(2000, 'Qualifications description cannot exceed 2000 characters'),

    proposedChanges: z
      .string()
      .min(10, 'Please describe your proposed changes (minimum 10 characters)')
      .max(3000, 'Proposed changes cannot exceed 3000 characters'),

    timeline: z
      .string()
      .min(5, 'Please provide a timeline (minimum 5 characters)')
      .max(500, 'Timeline cannot exceed 500 characters'),
  }),

  params: z.object({
    ideaId: z
      .string()
      .min(1, 'Idea ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
  }),
});

export const respondToAdoptionRequestSchema = z.object({
  body: z.object({
    action: z.enum(['approve', 'reject'], {
      required_error: 'Action must be either "approve" or "reject"',
    }),

    message: z
      .string()
      .min(5, 'Response message must be at least 5 characters')
      .max(1000, 'Response message cannot exceed 1000 characters')
      .optional(),
  }),

  params: z.object({
    requestId: z
      .string()
      .min(1, 'Request ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid request ID format'),
  }),
});

// Schema for getting requests by user ID
export const getUserRequestsSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .min(1, 'User ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

// Schema for getting requests by idea ID
export const getIdeaRequestsSchema = z.object({
  params: z.object({
    ideaId: z
      .string()
      .min(1, 'Idea ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid idea ID format'),
  }),
});

// Schema for getting single request by ID
export const getRequestByIdSchema = z.object({
  params: z.object({
    requestId: z
      .string()
      .min(1, 'Request ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid request ID format'),
  }),
});
