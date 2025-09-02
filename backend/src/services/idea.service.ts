import mongoose from 'mongoose';
import { IdeaModel, UserModel } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';
import { CreateIdeaInput, IdeaSearchInput } from '../validation/idea.schema.js';
import type { IdeaDTO, IdeaTreeNode, PaginatedResponse } from '@humanet/shared';

export class IdeaService {
  static async createIdea(data: CreateIdeaInput, authorId: string): Promise<IdeaDTO> {
    // If parentId is provided, validate parent exists
    if (data.parentId) {
      const parent = await IdeaModel.findById(data.parentId);
      if (!parent) {
        throw new AppError('Parent idea not found', 404);
      }
    }

    const idea = await IdeaModel.create({
      ...data,
      author: authorId,
      parentId: data.parentId || null
    });

    await idea.populate('author', 'username karma');
    
    return this.mapToDTO(idea);
  }

  static async getIdeaById(ideaId: string): Promise<IdeaDTO> {
    const idea = await IdeaModel.findById(ideaId)
      .populate('author', 'username karma')
      .populate('parentId', 'title author');

    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    return this.mapToDTO(idea);
  }

  static async getIdeas(params: IdeaSearchInput): Promise<PaginatedResponse<IdeaDTO>> {
    const { search, domain, tags, authorId, page, limit, sortBy, sortOrder } = params;
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (domain && domain.length > 0) {
      query.domain = { $in: domain };
    }
    
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (authorId) {
      query.author = authorId;
    }

    // Build sort
    const sort: any = {};
    if (search && !sortBy) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [ideas, total] = await Promise.all([
      IdeaModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'username karma')
        .populate('parentId', 'title author'),
      IdeaModel.countDocuments(query)
    ]);

    const data = ideas.map(idea => this.mapToDTO(idea));
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  static async forkIdea(ideaId: string, userId: string, data?: { title?: string; description?: string }): Promise<IdeaDTO> {
    const session = await mongoose.startSession();
    
    try {
      return await session.withTransaction(async () => {
        // Get original idea
        const originalIdea = await IdeaModel.findById(ideaId).session(session);
        if (!originalIdea) {
          throw new AppError('Idea not found', 404);
        }

        // Create fork
        const fork = await IdeaModel.create([{
          title: data?.title || `Fork of: ${originalIdea.title}`,
          description: data?.description || originalIdea.description,
          tags: originalIdea.tags,
          domain: originalIdea.domain,
          author: userId,
          parentId: ideaId
        }], { session });

        // Update original idea fork count
        await IdeaModel.findByIdAndUpdate(
          ideaId,
          { $inc: { forkCount: 1 } },
          { session }
        );

        // Update original author karma (+2 for fork)
        await UserModel.findByIdAndUpdate(
          originalIdea.author,
          { $inc: { karma: 2 } },
          { session }
        );

        await fork[0].populate('author', 'username karma');
        return this.mapToDTO(fork[0]);
      });
    } finally {
      await session.endSession();
    }
  }

  static async upvoteIdea(ideaId: string, userId: string): Promise<{ upvoted: boolean; upvotes: number }> {
    const session = await mongoose.startSession();
    
    try {
      return await session.withTransaction(async () => {
        const idea = await IdeaModel.findById(ideaId).session(session);
        if (!idea) {
          throw new AppError('Idea not found', 404);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const hasUpvoted = idea.upvoters.includes(userObjectId);

        if (hasUpvoted) {
          // Remove upvote
          await IdeaModel.findByIdAndUpdate(
            ideaId,
            {
              $pull: { upvoters: userObjectId },
              $inc: { upvotes: -1 }
            },
            { session }
          );

          // Decrease author karma (-1)
          await UserModel.findByIdAndUpdate(
            idea.author,
            { $inc: { karma: -1 } },
            { session }
          );

          return { upvoted: false, upvotes: idea.upvotes - 1 };
        } else {
          // Add upvote
          await IdeaModel.findByIdAndUpdate(
            ideaId,
            {
              $addToSet: { upvoters: userObjectId },
              $inc: { upvotes: 1 }
            },
            { session }
          );

          // Increase author karma (+1)
          await UserModel.findByIdAndUpdate(
            idea.author,
            { $inc: { karma: 1 } },
            { session }
          );

          return { upvoted: true, upvotes: idea.upvotes + 1 };
        }
      });
    } finally {
      await session.endSession();
    }
  }

  static async getIdeaTree(ideaId: string, maxDepth: number = 3): Promise<IdeaTreeNode> {
    const idea = await IdeaModel.findById(ideaId)
      .populate('author', 'username')
      .lean();

    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    const buildTree = async (nodeId: string, currentDepth: number): Promise<IdeaTreeNode> => {
      const node = await IdeaModel.findById(nodeId)
        .populate('author', 'username')
        .lean();

      if (!node) {
        throw new AppError('Node not found', 404);
      }

      const children: IdeaTreeNode[] = [];
      
      if (currentDepth < maxDepth) {
        const childNodes = await IdeaModel.find({ parentId: nodeId })
          .populate('author', 'username')
          .lean();
        
        for (const child of childNodes) {
          children.push(await buildTree(child._id.toString(), currentDepth + 1));
        }
      }

      return {
        _id: node._id.toString(),
        title: node.title,
        description: node.description,
        author: {
          _id: (node.author as any)._id.toString(),
          username: (node.author as any).username
        },
        upvotes: node.upvotes,
        forkCount: node.forkCount,
        createdAt: node.createdAt.toISOString(),
        children
      };
    };

    return buildTree(ideaId, 0);
  }

  private static mapToDTO(idea: any): IdeaDTO {
    return {
      _id: idea._id.toString(),
      title: idea.title,
      description: idea.description,
      tags: idea.tags,
      domain: idea.domain,
      authorId: idea.author._id.toString(),
      author: {
        _id: idea.author._id.toString(),
        username: idea.author.username,
        karma: idea.author.karma
      },
      parentId: idea.parentId?.toString() || null,
      parent: idea.parentId && typeof idea.parentId === 'object' ? {
        _id: idea.parentId._id.toString(),
        title: idea.parentId.title,
        author: {
          username: idea.parentId.author.username
        }
      } : undefined,
      upvotes: idea.upvotes,
      upvoters: idea.upvoters?.map((id: any) => id.toString()),
      forkCount: idea.forkCount,
      createdAt: idea.createdAt.toISOString(),
      updatedAt: idea.updatedAt.toISOString()
    };
  }
}
