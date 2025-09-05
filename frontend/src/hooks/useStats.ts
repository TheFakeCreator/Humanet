import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface PlatformStats {
  totalIdeas: number;
  totalUsers: number;
  totalForks: number;
  totalCollaborations: number; // This will include upvotes + forks + estimated comments
}

const statsApi = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    // Get ideas with high limit to get total count from pagination
    const ideasResponse = await api.get('/ideas', { 
      params: { limit: 1, page: 1 } 
    });
    
    // Get sample of ideas to calculate average metrics
    const sampleIdeasResponse = await api.get('/ideas', { 
      params: { limit: 50, sortBy: 'upvotes' } 
    });
    
    const totalIdeas = ideasResponse.data.pagination?.total || 0;
    const sampleIdeas = sampleIdeasResponse.data.data || [];
    
    // Calculate totals from sample and extrapolate
    const sampleSize = sampleIdeas.length;
    const sampleForks = sampleIdeas.reduce((sum: number, idea: any) => sum + (idea.forkCount || 0), 0);
    const sampleUpvotes = sampleIdeas.reduce((sum: number, idea: any) => sum + (idea.upvotes || 0), 0);
    
    // Extrapolate based on sample (with some estimation)
    const avgForksPerIdea = sampleSize > 0 ? sampleForks / sampleSize : 0;
    const avgUpvotesPerIdea = sampleSize > 0 ? sampleUpvotes / sampleSize : 0;
    
    const estimatedTotalForks = Math.floor(totalIdeas * avgForksPerIdea);
    const estimatedTotalUpvotes = Math.floor(totalIdeas * avgUpvotesPerIdea);
    
    // Estimate users (assume 70% of ideas have unique authors)
    const estimatedUsers = Math.floor(totalIdeas * 0.7);
    
    // Calculate total collaborations (forks + upvotes + estimated comments)
    // Assume each idea gets ~2 comments on average
    const estimatedComments = totalIdeas * 2;
    const totalCollaborations = estimatedTotalForks + estimatedTotalUpvotes + estimatedComments;
    
    return {
      totalIdeas,
      totalUsers: estimatedUsers,
      totalForks: estimatedTotalForks,
      totalCollaborations
    };
  }
};

export const useStats = () => {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: statsApi.getPlatformStats,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
