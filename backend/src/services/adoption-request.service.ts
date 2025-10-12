import { Types } from 'mongoose';
import { AdoptionRequestModel, IdeaModel, UserModel } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';
// Temporary local type definition until import issue is resolved
interface LocalAdoptionRequestDTO {
  _id?: string;
  ideaId: string;
  idea?: {
    _id: string;
    title: string;
    originalCreator: {
      username: string;
    };
  };
  requesterId: string;
  requester?: {
    _id: string;
    username: string;
    karma: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'expired';
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;
  requestedAt: string;
  respondedAt?: string;
  expiresAt: string;
  response?: {
    approved: boolean;
    message?: string;
    respondedBy?: {
      _id: string;
      username: string;
    };
    respondedAt?: string;
  };
  votingData?: {
    isVotingCandidate: boolean;
    votesReceived: number;
    supportingReasons: string[];
  };
}

interface CreateAdoptionRequestDTO {
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;
}

interface RespondToAdoptionRequestDTO {
  action: 'approve' | 'reject';
  message?: string;
}

export class AdoptionRequestService {
  /**
   * Create a new adoption request
   */
  static async createRequest(
    ideaId: string,
    requesterId: string,
    data: CreateAdoptionRequestDTO
  ): Promise<LocalAdoptionRequestDTO> {
    // Validate idea exists and is available for adoption
    const idea = await IdeaModel.findById(ideaId).populate('originalCreator', 'username');
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    if (idea.adoptionStatus !== 'available') {
      throw new AppError('This idea is not available for adoption', 400);
    }

    if (idea.originalCreator._id.toString() === requesterId) {
      throw new AppError('You cannot adopt your own idea', 400);
    }

    // Check if user already has a pending request for this idea
    const existingRequest = await AdoptionRequestModel.findOne({
      ideaId,
      requesterId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new AppError('You already have a pending adoption request for this idea', 400);
    }

    // Create the adoption request
    const adoptionRequest = await AdoptionRequestModel.create({
      ideaId,
      requesterId,
      message: data.message,
      qualifications: data.qualifications,
      proposedChanges: data.proposedChanges,
      timeline: data.timeline,
    });

    await adoptionRequest.populate([
      { path: 'requesterId', select: 'username karma' },
      {
        path: 'ideaId',
        select: 'title originalCreator',
        populate: { path: 'originalCreator', select: 'username' },
      },
    ]);

    // Add request to idea's adoption requests array
    await IdeaModel.findByIdAndUpdate(ideaId, {
      $push: { adoptionRequests: adoptionRequest._id },
    });

    // TODO: Send notification to idea creator

    return this.mapToDTO(adoptionRequest);
  }

  /**
   * Get adoption requests for a specific idea (for idea creator)
   */
  static async getRequestsForIdea(
    ideaId: string,
    userId: string,
    status?: string
  ): Promise<LocalAdoptionRequestDTO[]> {
    // Verify user is the original creator of the idea
    const idea = await IdeaModel.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    if (idea.originalCreator.toString() !== userId) {
      throw new AppError('You can only view adoption requests for your own ideas', 403);
    }

    // Build query
    const query: any = { ideaId };
    if (status) {
      query.status = status;
    }

    const requests = await AdoptionRequestModel.find(query)
      .populate('requesterId', 'username karma')
      .populate('ideaId', 'title originalCreator')
      .sort({ requestedAt: -1 });

    return requests.map((request) => this.mapToDTO(request));
  }

  /**
   * Get user's own adoption requests
   */
  static async getUserRequests(
    userId: string,
    status?: string
  ): Promise<LocalAdoptionRequestDTO[]> {
    const query: any = { requesterId: userId };
    if (status) {
      query.status = status;
    }

    const requests = await AdoptionRequestModel.find(query)
      .populate('requesterId', 'username karma')
      .populate({
        path: 'ideaId',
        select: 'title originalCreator',
        populate: { path: 'originalCreator', select: 'username' },
      })
      .sort({ requestedAt: -1 });

    return requests.map((request) => this.mapToDTO(request));
  }

  /**
   * Respond to an adoption request (approve/reject)
   */
  static async respondToRequest(
    requestId: string,
    responderId: string,
    response: RespondToAdoptionRequestDTO
  ): Promise<{ adoptionRequest: LocalAdoptionRequestDTO; conflictResolutionNeeded?: boolean }> {
    const adoptionRequest = await AdoptionRequestModel.findById(requestId)
      .populate('requesterId', 'username karma')
      .populate('ideaId', 'title originalCreator adoptionRequests');

    if (!adoptionRequest) {
      throw new AppError('Adoption request not found', 404);
    }

    if (adoptionRequest.status !== 'pending') {
      throw new AppError('This adoption request has already been responded to', 400);
    }

    // Verify responder is the original creator
    const idea = adoptionRequest.ideaId as any;
    if (idea.originalCreator.toString() !== responderId) {
      throw new AppError('Only the original creator can respond to adoption requests', 403);
    }

    if (response.action === 'approve') {
      // Check if there are other pending requests - this triggers democratic voting
      const otherPendingRequests = await AdoptionRequestModel.find({
        ideaId: idea._id,
        status: 'pending',
        _id: { $ne: requestId },
      });

      if (otherPendingRequests.length > 0) {
        // Multiple candidates - initiate democratic voting
        await this.initiateVoting(idea._id.toString(), [
          adoptionRequest._id?.toString() || '',
          ...otherPendingRequests.map((r) => r._id?.toString() || ''),
        ]);

        return {
          adoptionRequest: this.mapToDTO(adoptionRequest),
          conflictResolutionNeeded: true,
        };
      } else {
        // Single candidate - direct approval
        await adoptionRequest.approve(new Types.ObjectId(responderId), response.message);
        await this.transferOwnership(idea._id.toString(), adoptionRequest.requesterId.toString());

        return {
          adoptionRequest: this.mapToDTO(adoptionRequest),
          conflictResolutionNeeded: false,
        };
      }
    } else {
      // Rejection
      await adoptionRequest.reject(new Types.ObjectId(responderId), response.message);

      return {
        adoptionRequest: this.mapToDTO(adoptionRequest),
        conflictResolutionNeeded: false,
      };
    }
  }

  /**
   * Withdraw an adoption request
   */
  static async withdrawRequest(requestId: string, userId: string): Promise<void> {
    const adoptionRequest = await AdoptionRequestModel.findById(requestId);

    if (!adoptionRequest) {
      throw new AppError('Adoption request not found', 404);
    }

    if (!adoptionRequest.canWithdraw(new Types.ObjectId(userId))) {
      throw new AppError('You cannot withdraw this request', 403);
    }

    adoptionRequest.status = 'withdrawn';
    await adoptionRequest.save();

    // Remove from idea's adoption requests array
    await IdeaModel.findByIdAndUpdate(adoptionRequest.ideaId, {
      $pull: { adoptionRequests: adoptionRequest._id },
    });
  }

  /**
   * Get single adoption request by ID
   */
  static async getRequestById(requestId: string, userId: string): Promise<LocalAdoptionRequestDTO> {
    const adoptionRequest = await AdoptionRequestModel.findById(requestId)
      .populate('requesterId', 'username karma')
      .populate({
        path: 'ideaId',
        select: 'title originalCreator',
        populate: { path: 'originalCreator', select: 'username' },
      });

    if (!adoptionRequest) {
      throw new AppError('Adoption request not found', 404);
    }

    const idea = adoptionRequest.ideaId as any;

    // Verify user has permission to view this request
    if (
      adoptionRequest.requesterId._id.toString() !== userId &&
      idea.originalCreator._id.toString() !== userId
    ) {
      throw new AppError('You do not have permission to view this adoption request', 403);
    }

    return this.mapToDTO(adoptionRequest);
  }

  /**
   * Initiate democratic voting for multiple candidates
   */
  private static async initiateVoting(
    ideaId: string,
    candidateRequestIds: string[]
  ): Promise<void> {
    const votingDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
    const votingEndsAt = new Date(Date.now() + votingDuration);

    // Mark all candidate requests as voting candidates
    await AdoptionRequestModel.updateMany(
      { _id: { $in: candidateRequestIds } },
      { 'votingData.isVotingCandidate': true }
    );

    // Update idea with voting information
    await IdeaModel.findByIdAndUpdate(ideaId, {
      adoptionStatus: 'pending',
      activeVoting: {
        candidates: candidateRequestIds,
        votes: new Map(),
        votingEndsAt,
        startedAt: new Date(),
        description: 'Community voting to select the best adopter for this idea',
      },
    });

    // TODO: Send notifications to all users about the voting
  }

  /**
   * Transfer ownership of idea to new maintainer
   */
  private static async transferOwnership(ideaId: string, newMaintainerId: string): Promise<void> {
    const idea = await IdeaModel.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    // Update idea ownership
    idea.currentMaintainer = new Types.ObjectId(newMaintainerId);
    idea.adoptionStatus = 'adopted';
    idea.adoptionHistory.push({
      previousMaintainer: idea.currentMaintainer || idea.originalCreator,
      newMaintainer: new Types.ObjectId(newMaintainerId),
      transferredAt: new Date(),
      reason: 'Adoption request approved',
    });

    await idea.save();

    // TODO: Send notification to new maintainer
    // TODO: Send notification to previous maintainer (if different from original creator)
  }

  /**
   * Map database model to DTO
   */
  private static mapToDTO(adoptionRequest: any): LocalAdoptionRequestDTO {
    return {
      _id: adoptionRequest._id.toString(),
      ideaId: adoptionRequest.ideaId._id.toString(),
      idea: {
        _id: adoptionRequest.ideaId._id.toString(),
        title: adoptionRequest.ideaId.title,
        originalCreator: {
          username: adoptionRequest.ideaId.originalCreator?.username || 'Unknown',
        },
      },
      requesterId: adoptionRequest.requesterId._id.toString(),
      requester: {
        _id: adoptionRequest.requesterId._id.toString(),
        username: adoptionRequest.requesterId.username,
        karma: adoptionRequest.requesterId.karma,
      },
      status: adoptionRequest.status,
      message: adoptionRequest.message,
      qualifications: adoptionRequest.qualifications,
      proposedChanges: adoptionRequest.proposedChanges,
      timeline: adoptionRequest.timeline,
      requestedAt: adoptionRequest.requestedAt.toISOString(),
      respondedAt: adoptionRequest.respondedAt?.toISOString(),
      expiresAt: adoptionRequest.expiresAt.toISOString(),
      response: adoptionRequest.response
        ? {
            approved: adoptionRequest.response.approved,
            message: adoptionRequest.response.message,
            respondedBy: adoptionRequest.response.respondedBy
              ? {
                  _id: adoptionRequest.response.respondedBy._id.toString(),
                  username: adoptionRequest.response.respondedBy.username,
                }
              : undefined,
            respondedAt: adoptionRequest.response.respondedAt?.toISOString(),
          }
        : undefined,
      votingData: adoptionRequest.votingData,
    };
  }
}
