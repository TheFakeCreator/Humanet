export interface CommentDTO {
  _id?: string;
  ideaId: string;
  authorId: string;
  author?: {
    _id: string;
    username: string;
    karma: number;
    avatar?: string;
    isVerified?: boolean;
  };
  text: string;
  
  // Reply functionality
  parentCommentId?: string | null;
  depth?: number;
  replies?: CommentDTO[];
  
  // Interaction stats
  upvotes?: number;
  downvotes?: number;
  hasUpvoted?: boolean; // For current user
  hasDownvoted?: boolean; // For current user
  
  // Status and metadata
  status?: 'active' | 'edited' | 'deleted' | 'flagged' | 'hidden';
  editedAt?: string;
  isAuthorOP?: boolean;
  isPinned?: boolean;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommentDTO {
  ideaId: string;
  text: string;
  parentCommentId?: string | null;
}

export interface UpdateCommentDTO {
  text: string;
}

export interface CommentVoteDTO {
  commentId: string;
  voteType: 'upvote' | 'downvote' | 'remove';
}
