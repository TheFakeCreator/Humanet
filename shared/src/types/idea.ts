// Enums
export enum OwnershipType {
  PERSONAL = 'self_maintained',
  OPEN_SOURCE = 'open_source',
  COLLABORATIVE = 'collaborative',
  ORGANIZATION = 'organization',
  STEWARDSHIP = 'stewardship',
}

export enum AdoptionStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  ADOPTED = 'adopted',
  IN_DISPUTE = 'in_dispute',
}

export interface IdeaDTO {
  _id?: string;
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
  authorId: string;
  author?: {
    _id: string;
    username: string;
    karma: number;
  };
  parentId?: string | null;
  parent?: {
    _id: string;
    title: string;
    author: {
      username: string;
    };
  };
  upvotes?: number;
  upvoters?: string[];
  hasUpvoted?: boolean; // Whether current user has upvoted
  forkCount?: number;
  children?: IdeaDTO[];

  // Ownership and Adoption System
  ownershipType: 'self_maintained' | 'seeking_adopter';
  currentMaintainer?: {
    _id: string;
    username: string;
    karma: number;
  };
  originalCreator: {
    _id: string;
    username: string;
    karma: number;
  };
  adoptionStatus: 'available' | 'pending' | 'adopted' | 'not_available';
  adoptionRequestsCount?: number;
  pendingAdoption?: {
    adopter: {
      _id: string;
      username: string;
    };
    requestedAt: string;
    message?: string;
  };

  // Licensing
  license: {
    type:
      | 'MIT'
      | 'Apache-2.0'
      | 'GPL-3.0'
      | 'BSD-3-Clause'
      | 'CC-BY-4.0'
      | 'CC-BY-SA-4.0'
      | 'custom';
    customText?: string;
    allowCommercialUse: boolean;
    requireAttribution: boolean;
  };

  // Democratic voting (if active)
  activeVoting?: {
    candidates: Array<{
      _id: string;
      username: string;
      votesReceived: number;
    }>;
    totalVotes: number;
    votingEndsAt: string;
    hasUserVoted?: boolean;
    userVotedFor?: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIdeaDTO {
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
  parentId?: string | null;
  autoCreateRepository?: boolean;
  repositoryTemplate?: 'basic' | 'research' | 'technical';

  // Ownership and Licensing
  ownershipType: 'self_maintained' | 'seeking_adopter';
  license: {
    type:
      | 'MIT'
      | 'Apache-2.0'
      | 'GPL-3.0'
      | 'BSD-3-Clause'
      | 'CC-BY-4.0'
      | 'CC-BY-SA-4.0'
      | 'custom';
    customText?: string;
    allowCommercialUse: boolean;
    requireAttribution: boolean;
  };
}

export interface UpdateIdeaDTO {
  title?: string;
  description?: string;
  tags?: string[];
  domain?: string[];
}

export interface IdeaSearchParams {
  search?: string;
  domain?: string[];
  tags?: string[];
  authorId?: string;
  ownershipType?: 'self_maintained' | 'seeking_adopter';
  adoptionStatus?: 'available' | 'pending' | 'adopted' | 'not_available';
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'upvotes' | 'forkCount';
  sortOrder?: 'asc' | 'desc';
}

export interface IdeaTreeNode {
  _id: string;
  title: string;
  description: string;
  author: {
    _id: string;
    username: string;
  };
  upvotes: number;
  forkCount: number;
  createdAt: string;
  children: IdeaTreeNode[];
}

// Adoption Request Types
export interface AdoptionRequestDTO {
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

  // Request details
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;

  // Timestamps
  requestedAt: string;
  respondedAt?: string;
  expiresAt: string;

  // Response
  response?: {
    approved: boolean;
    message?: string;
    respondedBy?: {
      _id: string;
      username: string;
    };
    respondedAt?: string;
  };

  // Voting data (for democratic scenarios)
  votingData?: {
    isVotingCandidate: boolean;
    votesReceived: number;
    supportingReasons: string[];
  };
}

export interface CreateAdoptionRequestDTO {
  ideaId: string;
  message: string;
  qualifications: string;
  proposedChanges: string;
  timeline: string;
}

export interface RespondToAdoptionRequestDTO {
  action: 'approve' | 'reject';
  message?: string;
}

// Voting System Types
export interface VotingCandidateDTO {
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

export interface VotingDataDTO {
  ideaId: string;
  ideaTitle: string;
  isActive: boolean;
  votingEndsAt: string;
  candidates: VotingCandidateDTO[];
  totalVotes: number;
  userHasVoted?: boolean;
  userVotedFor?: string;
}

export interface SubmitVoteDTO {
  candidateRequestId: string;
  supportingReason?: string;
}

export interface VoteResultDTO {
  voted: boolean;
  candidateRequestId: string;
  totalVotes: number;
}

export interface ConclusionResultDTO {
  winnerRequestId: string;
  winner: {
    username: string;
    karma: number;
  };
  finalVoteCount: number;
  ownershipTransferred: boolean;
}

// Voting Types
export interface VotingCandidateDTO {
  _id: string;
  username: string;
  karma: number;
  adoptionRequest: {
    message: string;
    qualifications: string;
    proposedChanges: string;
    timeline: string;
  };
  votesReceived: number;
  supportingReasons: string[];
}

export interface CreateVoteDTO {
  candidateId: string;
  supportingReason?: string;
}

// License Templates
export interface LicenseTemplate {
  type: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'CC-BY-4.0' | 'CC-BY-SA-4.0';
  name: string;
  description: string;
  allowCommercialUse: boolean;
  requireAttribution: boolean;
  copyleft: boolean;
  fullText: string;
}
