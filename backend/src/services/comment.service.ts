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

    const comment = await CommentModel.create({
      ideaId,
      authorId,
      text: data.text
    });

    await comment.populate('author', 'username karma');
    
    return this.mapToDTO(comment);
  }

  static async getCommentsByIdeaId(ideaId: string): Promise<CommentDTO[]> {
    const comments = await CommentModel.find({ ideaId })
      .populate('author', 'username karma')
      .sort({ createdAt: 1 });

    return comments.map(comment => this.mapToDTO(comment));
  }

  static async getCommentById(commentId: string): Promise<CommentDTO> {
    const comment = await CommentModel.findById(commentId)
      .populate('author', 'username karma');

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
    await comment.populate('author', 'username karma');

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

  private static mapToDTO(comment: any): CommentDTO {
    return {
      _id: comment._id.toString(),
      ideaId: comment.ideaId.toString(),
      authorId: comment.authorId.toString(),
      author: {
        _id: comment.author._id.toString(),
        username: comment.author.username,
        karma: comment.author.karma
      },
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    };
  }
}
