import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { IdeaDTO, CreateIdeaDTO, IdeaSearchParams, IdeaTreeNode, PaginatedResponse, ApiResponse } from '@shared/index';

// Ideas API functions
const ideasApi = {
  getIdeas: async (params: IdeaSearchParams = {}): Promise<PaginatedResponse<IdeaDTO>> => {
    const response = await api.get<ApiResponse<IdeaDTO[]> & { pagination: any }>('/ideas', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination,
    };
  },

  getIdeaById: async (id: string): Promise<IdeaDTO> => {
    const response = await api.get<ApiResponse<{ idea: IdeaDTO }>>(`/ideas/${id}`);
    return response.data.data!.idea;
  },

  createIdea: async (data: CreateIdeaDTO): Promise<IdeaDTO> => {
    const response = await api.post<ApiResponse<{ idea: IdeaDTO }>>('/ideas', data);
    return response.data.data!.idea;
  },

  forkIdea: async ({ id, data }: { id: string; data?: { title?: string; description?: string } }): Promise<IdeaDTO> => {
    const response = await api.post<ApiResponse<{ idea: IdeaDTO }>>(`/ideas/${id}/fork`, data);
    return response.data.data!.idea;
  },

  upvoteIdea: async (id: string): Promise<{ upvoted: boolean; upvotes: number }> => {
    const response = await api.post<ApiResponse<{ upvoted: boolean; upvotes: number }>>(`/ideas/${id}/upvote`);
    return response.data.data!;
  },

  getIdeaTree: async (id: string, maxDepth?: number): Promise<IdeaTreeNode> => {
    const response = await api.get<ApiResponse<{ tree: IdeaTreeNode }>>(`/ideas/${id}/tree`, {
      params: { maxDepth },
    });
    return response.data.data!.tree;
  },
};

// Hooks
export const useIdeas = (params: IdeaSearchParams = {}) => {
  return useQuery({
    queryKey: ['ideas', params],
    queryFn: () => ideasApi.getIdeas(params),
  });
};

export const useIdea = (id: string) => {
  return useQuery({
    queryKey: ['ideas', id],
    queryFn: () => ideasApi.getIdeaById(id),
    enabled: !!id,
  });
};

export const useCreateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ideasApi.createIdea,
    onSuccess: () => {
      // Invalidate ideas list
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useForkIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ideasApi.forkIdea,
    onSuccess: (newIdea, variables) => {
      // Invalidate ideas list and parent idea
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['ideas', variables.id] });
    },
  });
};

export const useUpvoteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ideasApi.upvoteIdea,
    onSuccess: (data, ideaId) => {
      // Update the specific idea in cache
      queryClient.setQueryData(['ideas', ideaId], (oldData: IdeaDTO | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          upvotes: data.upvotes,
        };
      });
      // Invalidate ideas list to update counts
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useIdeaTree = (id: string, maxDepth?: number) => {
  return useQuery({
    queryKey: ['ideas', id, 'tree', maxDepth],
    queryFn: () => ideasApi.getIdeaTree(id, maxDepth),
    enabled: !!id,
  });
};
