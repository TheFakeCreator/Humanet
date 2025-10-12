import { Types } from 'mongoose';
import { AdoptionRequestModel, IdeaModel } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';

interface VotingCandidate {
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
}

interface VotingData {
  ideaId: string;
  ideaTitle: string;
  isActive: boolean;
  votingEndsAt: Date;
  candidates: VotingCandidate[];
  totalVotes: number;
  userHasVoted?: boolean;
  userVotedFor?: string;
}

interface VoteResult {
  voted: boolean;
  candidateRequestId: string;
  totalVotes: number;
}

interface ConclusionResult {
  winnerRequestId: string;
  winner: {
    username: string;
    karma: number;
  };
  finalVoteCount: number;
  ownershipTransferred: boolean;
}

export class VotingService {
  /**
   * Get active voting data for an idea
   */
  static async getActiveVoting(ideaId: string, userId?: string): Promise<VotingData | null> {
    const idea = await IdeaModel.findById(ideaId)
      .populate('originalCreator', 'username')
      .select('title activeVoting');

    if (!idea || !idea.activeVoting) {
      return null;
    }

    // Get all candidate requests
    const candidateRequests = await AdoptionRequestModel.find({
      _id: { $in: idea.activeVoting.candidateRequestIds },
      status: 'pending',
    })
      .populate('requesterId', 'username karma')
      .sort({ 'votingData.votesReceived': -1 }); // Sort by votes received

    const candidates: VotingCandidate[] = candidateRequests.map((request: any) => ({
      requestId: request._id.toString(),
      requester: {
        _id: request.requesterId._id.toString(),
        username: request.requesterId.username,
        karma: request.requesterId.karma,
      },
      votesReceived: request.votingData?.votesReceived || 0,
      supportingReasons: request.votingData?.supportingReasons || [],
      qualifications: request.qualifications,
      proposedChanges: request.proposedChanges,
      timeline: request.timeline,
    }));

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votesReceived, 0);

    // Check if user has voted (if userId provided)
    let userHasVoted = false;
    let userVotedFor: string | undefined;

    if (userId) {
      const userVote = idea.activeVoting.votes.find((vote) => vote.voterId.toString() === userId);
      if (userVote) {
        userHasVoted = true;
        userVotedFor = userVote.candidateRequestId.toString();
      }
    }

    return {
      ideaId: (idea as any)._id.toString(),
      ideaTitle: idea.title,
      isActive: new Date() < idea.activeVoting.votingEndsAt,
      votingEndsAt: idea.activeVoting.votingEndsAt,
      candidates,
      totalVotes,
      userHasVoted,
      userVotedFor,
    };
  }

  /**
   * Submit a vote for a candidate
   */
  static async submitVote(
    ideaId: string,
    userId: string,
    candidateRequestId: string,
    supportingReason?: string
  ): Promise<VoteResult> {
    const idea = await IdeaModel.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    if (!idea.activeVoting) {
      throw new AppError('No active voting for this idea', 400);
    }

    // Check if voting is still active
    if (new Date() > idea.activeVoting.votingEndsAt) {
      throw new AppError('Voting period has ended', 400);
    }

    // Check if user has already voted
    const existingVote = idea.activeVoting.votes.find((vote) => vote.voterId.toString() === userId);
    if (existingVote) {
      throw new AppError('You have already voted in this election', 400);
    }

    // Verify candidate exists and is valid
    if (!idea.activeVoting.candidateRequestIds.some((id) => id.toString() === candidateRequestId)) {
      throw new AppError('Invalid candidate', 400);
    }

    const adoptionRequest = await AdoptionRequestModel.findById(candidateRequestId);
    if (!adoptionRequest || adoptionRequest.status !== 'pending') {
      throw new AppError('Candidate adoption request not found or not pending', 400);
    }

    // Add vote to idea
    idea.activeVoting.votes.push({
      voterId: new Types.ObjectId(userId),
      candidateRequestId: new Types.ObjectId(candidateRequestId),
      timestamp: new Date(),
      supportingReason,
    });

    // Update candidate's vote count and reasons
    if (!adoptionRequest.votingData) {
      adoptionRequest.votingData = {
        isVotingCandidate: true,
        votesReceived: 0,
        supportingReasons: [],
      };
    }

    adoptionRequest.votingData.votesReceived += 1;
    if (supportingReason) {
      adoptionRequest.votingData.supportingReasons.push(supportingReason);
    }

    // Save both documents
    await Promise.all([idea.save(), adoptionRequest.save()]);

    return {
      voted: true,
      candidateRequestId,
      totalVotes: idea.activeVoting.votes.length,
    };
  }

  /**
   * Get voting results (can be called during or after voting)
   */
  static async getVotingResults(ideaId: string): Promise<VotingData> {
    const votingData = await this.getActiveVoting(ideaId);
    if (!votingData) {
      throw new AppError('No voting data found for this idea', 404);
    }

    return votingData;
  }

  /**
   * Conclude voting and transfer ownership to winner
   */
  static async concludeVoting(ideaId: string, requesterId: string): Promise<ConclusionResult> {
    const idea = await IdeaModel.findById(ideaId).populate('originalCreator', 'username');
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    if (!idea.activeVoting) {
      throw new AppError('No active voting for this idea', 400);
    }

    // Only idea creator can manually conclude voting
    if (idea.originalCreator._id.toString() !== requesterId) {
      throw new AppError('Only the idea creator can conclude voting', 403);
    }

    // Check if voting period has ended or if there are votes to process
    const votingEnded = new Date() > idea.activeVoting.votingEndsAt;
    const hasVotes = idea.activeVoting.votes.length > 0;

    if (!votingEnded && !hasVotes) {
      throw new AppError('Voting is still active and no votes have been cast', 400);
    }

    // Count votes and determine winner
    const voteCounts = new Map<string, number>();
    idea.activeVoting.votes.forEach((vote: any) => {
      const candidateId = vote.candidateRequestId.toString();
      voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0) + 1);
    });

    if (voteCounts.size === 0) {
      throw new AppError('No votes were cast during the voting period', 400);
    }

    // Find winner (candidate with most votes)
    let winnerRequestId = '';
    let maxVotes = 0;
    for (const [candidateId, votes] of voteCounts.entries()) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerRequestId = candidateId;
      }
    }

    // Get winner details
    const winnerRequest = await AdoptionRequestModel.findById(winnerRequestId).populate(
      'requesterId',
      'username karma'
    );

    if (!winnerRequest) {
      throw new AppError('Winner adoption request not found', 500);
    }

    // Transfer ownership
    idea.currentMaintainer = (winnerRequest.requesterId as any)._id;
    idea.adoptionStatus = 'adopted';
    idea.adoptionHistory.push({
      previousMaintainer: idea.currentMaintainer || idea.originalCreator,
      newMaintainer: (winnerRequest.requesterId as any)._id,
      transferredAt: new Date(),
      reason: `Democratic adoption (${maxVotes} votes)`,
    });

    // Approve winner request and reject others
    await winnerRequest.approve(
      idea.originalCreator,
      `Selected through democratic voting with ${maxVotes} votes`
    );

    // Store the candidate request IDs before clearing activeVoting
    const candidateRequestIds = idea.activeVoting.candidateRequestIds;

    // Clear active voting
    idea.activeVoting = undefined;

    // Reject other candidates
    const otherCandidates = await AdoptionRequestModel.find({
      _id: {
        $in: candidateRequestIds.filter((id: any) => id.toString() !== winnerRequestId),
      },
      status: 'pending',
    });

    await Promise.all(
      otherCandidates.map((candidate) =>
        candidate.reject(
          idea.originalCreator,
          'Another candidate was selected through democratic voting'
        )
      )
    );

    await idea.save();

    return {
      winnerRequestId,
      winner: {
        username: (winnerRequest.requesterId as any).username,
        karma: (winnerRequest.requesterId as any).karma,
      },
      finalVoteCount: maxVotes,
      ownershipTransferred: true,
    };
  }

  /**
   * Automatically conclude expired voting (called by cron job)
   */
  static async concludeExpiredVoting(): Promise<void> {
    const expiredVotingIdeas = await IdeaModel.find({
      'activeVoting.votingEndsAt': { $lt: new Date() },
      activeVoting: { $exists: true },
    });

    for (const idea of expiredVotingIdeas) {
      try {
        await this.concludeVoting((idea as any)._id.toString(), idea.originalCreator.toString());
      } catch (error) {
        console.error(`Failed to conclude voting for idea ${(idea as any)._id}:`, error);
        // Continue with other ideas even if one fails
      }
    }
  }
}
