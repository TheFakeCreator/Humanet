import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface VotingData {
  ideaId: string;
  ideaTitle: string;
  isActive: boolean;
  votingEndsAt: string;
  candidates: Array<{
    requestId: string;
    requester: {
      _id: string;
      username: string;
      karma: number;
    };
    votesReceived: number;
    supportingReasons: string[];
    qualifications: string;
    proposedChanges: string;
    timeline: string;
  }>;
  totalVotes: number;
  userHasVoted?: boolean;
  userVotedFor?: string;
}

export interface VoteData {
  candidateRequestId: string;
  supportingReason?: string;
}

// Get active voting for an idea
export const useActiveVoting = (ideaId: string) => {
  return useQuery({
    queryKey: ['voting', 'active', ideaId],
    queryFn: async () => {
      const response = await api.get(`/voting/${ideaId}/active`);
      return response.data.data.voting as VotingData | null;
    },
    enabled: !!ideaId,
  });
};

// Submit a vote
export const useSubmitVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ideaId, data }: { ideaId: string; data: VoteData }) => {
      const response = await api.post(`/voting/${ideaId}/vote`, data);
      return response.data;
    },
    onSuccess: (_, { ideaId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['voting', 'active', ideaId] });
      queryClient.invalidateQueries({ queryKey: ['ideas', ideaId] }); // Fixed: match useIdea hook query key
      queryClient.invalidateQueries({ queryKey: ['adoptionRequests', 'idea', ideaId] });
    },
  });
};

// Get voting results (for concluded voting)
export const useVotingResults = (ideaId: string) => {
  return useQuery({
    queryKey: ['voting', 'results', ideaId],
    queryFn: async () => {
      const response = await api.get(`/voting/${ideaId}/results`);
      return response.data.data;
    },
    enabled: !!ideaId,
  });
};
