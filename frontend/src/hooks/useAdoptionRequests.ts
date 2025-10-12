import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdoptionRequest {
  _id: string;
  ideaId: string;
  requesterId: string;
  requester: {
    _id: string;
    username: string;
    karma: number;
  };
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdoptionRequestData {
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;
}

export interface RespondToAdoptionRequestData {
  response: 'approve' | 'reject';
  message?: string;
}

// Create adoption request
export const useCreateAdoptionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ideaId, data }: { ideaId: string; data: CreateAdoptionRequestData }) => {
      const response = await api.post(`/adoption-requests/${ideaId}`, data);
      return response.data;
    },
    onSuccess: (_, { ideaId }) => {
      // Invalidate the idea query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests', 'idea', ideaId] });
    },
  });
};

// Get adoption requests for an idea
export const useAdoptionRequestsForIdea = (ideaId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['adoptionRequests', 'idea', ideaId],
    queryFn: async () => {
      const response = await api.get(`/adoption-requests/idea/${ideaId}`);
      return response.data.data.requests as AdoptionRequest[];
    },
    enabled: !!ideaId && options?.enabled !== false,
  });
};

// Get user's adoption requests
export const useMyAdoptionRequests = (userId: string) => {
  return useQuery({
    queryKey: ['adoptionRequests', 'user', userId],
    queryFn: async () => {
      const response = await api.get(`/adoption-requests/user/${userId}`);
      return response.data.data.requests as AdoptionRequest[];
    },
    enabled: !!userId,
  });
};

// Respond to adoption request
export const useRespondToAdoptionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      data,
    }: {
      requestId: string;
      data: RespondToAdoptionRequestData;
    }) => {
      const response = await api.put(`/adoption-requests/${requestId}/respond`, data);
      return response.data;
    },
    onSuccess: (_, { requestId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

// Withdraw adoption request
export const useWithdrawAdoptionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.delete(`/adoption-requests/${requestId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

// Get specific adoption request
export const useAdoptionRequest = (requestId: string) => {
  return useQuery({
    queryKey: ['adoptionRequest', requestId],
    queryFn: async () => {
      const response = await api.get(`/adoption-requests/${requestId}`);
      return response.data.data as AdoptionRequest;
    },
    enabled: !!requestId,
  });
};
