import { CommentModel, IdeaModel } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';
import { CreateCommentInput } from '../validation/comment.schema.js';
import type { CommentDTO } from '@humanet/shared';

export class CommentService {
  static async createComment(ideaId: string, authorId: string, data: CreateCommentInput): Promise<CommentDTO> {
    // Verify idea exists
    const idea = await IdeaModel.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    // If this is a reply, verify parent comment exists
    let depth = 0;
    if (data.parentCommentId) {
      const parentComment = await CommentModel.findById(data.parentCommentId);
      if (!parentComment) {
        throw new AppError('Parent comment not found', 404);
      }
      depth = (parentComment.depth || 0) + 1;
    }

    const comment = await CommentModel.create({
      ideaId,
      authorId,
      text: data.text,
      parentCommentId: data.parentCommentId,
      depth
    });

    await comment.populate('authorId', 'username karma');
    
    return this.mapToDTO(comment);
  }

  static async getCommentsByIdeaId(ideaId: string, userId?: string): Promise<CommentDTO[]> {
    const comments = await CommentModel.find({ ideaId })
      .populate('authorId', 'username karma')
      .sort({ createdAt: 1 });

    return comments.map(comment => this.mapToDTO(comment, userId));
  }

  static async getCommentById(commentId: string): Promise<CommentDTO> {
    const comment = await CommentModel.findById(commentId)
      .populate('authorId', 'username karma');

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return this.mapToDTO(comment);
  }

  static async updateComment(commentId: string, userId: string, text: string): Promise<CommentDTO> {
    const comment = await CommentModel.findById(commentId);
    
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.authorId.toString() !== userId) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    comment.text = text;
    await comment.save();
    await comment.populate('authorId', 'username karma');

    return this.mapToDTO(comment);
  }

  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await CommentModel.findById(commentId);
    
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.authorId.toString() !== userId) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await CommentModel.findByIdAndDelete(commentId);
  }

  static async voteComment(commentId: string, userId: string, voteType: 'upvote' | 'downvote' | 'remove'): Promise<CommentDTO> {
    const comment = await CommentModel.findById(commentId);
    
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Remove existing votes
    comment.upvoters = comment.upvoters.filter(id => id.toString() !== userId);
    comment.downvoters = comment.downvoters.filter(id => id.toString() !== userId);

    // Add new vote if not removing
    if (voteType === 'upvote') {
      comment.upvoters.push(userId as any);
    } else if (voteType === 'downvote') {
      comment.downvoters.push(userId as any);
    }

    // Update vote counts
    comment.upvotes = comment.upvoters.length;
    comment.downvotes = comment.downvoters.length;

    await comment.save();
    await comment.populate('authorId', 'username karma');

    return this.mapToDTO(comment);
  }

  private static mapToDTO(comment: any, userId?: string): CommentDTO {
    return {
      _id: comment._id.toString(),
      ideaId: comment.ideaId.toString(),
      authorId: comment.authorId._id ? comment.authorId._id.toString() : comment.authorId.toString(),
      author: comment.authorId._id ? {
        _id: comment.authorId._id.toString(),
        username: comment.authorId.username,
        karma: comment.authorId.karma
      } : undefined,
      text: comment.text,
      upvotes: comment.upvotes || 0,
      downvotes: comment.downvotes || 0,
      hasUpvoted: userId ? comment.upvoters?.some((id: any) => id.toString() === userId) : false,
      hasDownvoted: userId ? comment.downvoters?.some((id: any) => id.toString() === userId) : false,
      parentCommentId: comment.parentCommentId?.toString(),
      depth: comment.depth || 0,
      status: comment.status || 'active',
      isAuthorOP: comment.isAuthorOP || false,
      isPinned: comment.isPinned || false,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    };
  }
}
