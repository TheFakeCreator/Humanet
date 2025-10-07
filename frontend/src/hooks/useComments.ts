import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { CommentDTO, PaginatedResponse } from '@humanet/shared';

export interface CreateCommentData {
  text: string;
  parentCommentId?: string;
}

export interface UpdateCommentData {
  text: string;
}

export interface CommentsParams {
  page?: number;
  limit?: number;
}

// Get comments for an idea
export const useComments = (ideaId: string, params?: CommentsParams) => {
  return useQuery({
    queryKey: ['comments', ideaId, params],
    queryFn: async (): Promise<CommentDTO[]> => {
      const response = await api.get(`/ideas/${ideaId}/comments`, { params });
      return response.data.data;
    },
    enabled: !!ideaId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Create new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ideaId, data }: { ideaId: string; data: CreateCommentData }): Promise<CommentDTO> => {
      const response = await api.post(`/ideas/${ideaId}/comments`, data);
      return response.data.data.comment;
    },
    onSuccess: (_, { ideaId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', ideaId] });
    },
  });
};

// Update comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: string; data: UpdateCommentData }): Promise<CommentDTO> => {
      const response = await api.put(`/ideas/comments/${commentId}`, data);
      return response.data.data.comment;
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.ideaId] });
    },
  });
};

// Delete comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string): Promise<void> => {
      await api.delete(`/ideas/comments/${commentId}`);
    },
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// Vote on comment
export const useVoteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: 'upvote' | 'downvote' | 'remove' }): Promise<CommentDTO> => {
      const response = await api.post(`/ideas/comments/${commentId}/vote`, { voteType });
      return response.data.data.comment;
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.ideaId] });
    },
  });
};
