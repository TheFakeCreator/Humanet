/**
 * Example Migration: Add family tree and collaboration features to Ideas
 * Version: 1.2.0
 * 
 * This migration demonstrates complex data transformation and relationship building
 */

import { BaseMigration } from '../migration-system.js';
import { IdeaModel } from '../../models/idea.model.js';

export class AddIdeaFamilyTreeMigration extends BaseMigration {
  version = '1.2.0';
  name = 'AddIdeaFamilyTree';
  description = 'Add family tree tracking and collaboration features to ideas';

  async up(): Promise<void> {
    console.log('Adding family tree and collaboration features to ideas...');
    
    // Add new fields to all existing ideas
    await IdeaModel.updateMany(
      {},
      {
        $set: {
          // Enhanced metadata
          status: 'published',
          visibility: 'public',
          featured: false,
          
          // Interaction stats
          viewCount: 0,
          commentCount: 0,
          shareCount: 0,
          bookmarkedBy: [],
          
          // Family tree metadata (will be calculated)
          depth: 0,
          forkPath: [],
          
          // Moderation
          flagCount: 0,
          flagReasons: [],
          
          // Collaboration
          collaborators: [],
          editHistory: [],
          
          // Implementation tracking
          implementationStatus: 'idea'
        }
      }
    );

    // Calculate family tree relationships for existing ideas
    await this.calculateFamilyTreeRelationships();

    // Calculate comment counts
    await this.calculateCommentCounts();

    // Add new indexes
    await IdeaModel.collection.createIndex(
      { status: 1, visibility: 1 }, 
      { name: 'idx_status_visibility' }
    );
    
    await IdeaModel.collection.createIndex(
      { featured: 1, upvotes: -1 }, 
      { name: 'idx_featured_upvotes' }
    );
    
    await IdeaModel.collection.createIndex(
      { rootId: 1, depth: 1 }, 
      { name: 'idx_root_depth' }
    );
    
    await IdeaModel.collection.createIndex(
      { viewCount: -1 }, 
      { name: 'idx_view_count' }
    );
    
    await IdeaModel.collection.createIndex(
      { implementationStatus: 1 }, 
      { name: 'idx_implementation_status' }
    );

    console.log('Family tree and collaboration features added successfully');
  }

  async down(): Promise<void> {
    console.log('Removing family tree and collaboration features from ideas...');
    
    await IdeaModel.updateMany(
      {},
      {
        $unset: {
          status: '',
          visibility: '',
          featured: '',
          summary: '',
          coverImage: '',
          attachments: '',
          viewCount: '',
          commentCount: '',
          shareCount: '',
          bookmarkedBy: '',
          depth: '',
          rootId: '',
          forkPath: '',
          flagCount: '',
          flagReasons: '',
          moderatedBy: '',
          moderationNotes: '',
          collaborators: '',
          editHistory: '',
          implementationStatus: '',
          githubRepo: '',
          liveDemo: ''
        }
      }
    );

    // Drop indexes
    const indexesToDrop = [
      'idx_status_visibility',
      'idx_featured_upvotes',
      'idx_root_depth',
      'idx_view_count',
      'idx_implementation_status'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await IdeaModel.collection.dropIndex(indexName);
      } catch (error) {
        console.warn(`Index ${indexName} not found, skipping drop`);
      }
    }
  }

  private async calculateFamilyTreeRelationships(): Promise<void> {
    console.log('Calculating family tree relationships...');
    
    // Find all root ideas (no parent)
    const rootIdeas = await IdeaModel.find({ parentId: null });
    
    for (const rootIdea of rootIdeas) {
      await this.processIdeaTree(rootIdea, 0, []);
    }
    
    console.log(`Processed ${rootIdeas.length} idea trees`);
  }

  private async processIdeaTree(idea: any, depth: number, parentPath: any[]): Promise<void> {
    // Update current idea
    await IdeaModel.updateOne(
      { _id: idea._id },
      {
        $set: {
          depth: depth,
          rootId: parentPath.length > 0 ? parentPath[0] : undefined,
          forkPath: parentPath
        }
      }
    );

    // Find and process children
    const children = await IdeaModel.find({ parentId: idea._id });
    for (const child of children) {
      await this.processIdeaTree(child, depth + 1, [...parentPath, idea._id]);
    }
  }

  private async calculateCommentCounts(): Promise<void> {
    console.log('Calculating comment counts for ideas...');
    
    // Import CommentModel dynamically to avoid circular dependencies
    const { CommentModel } = await import('../../models/comment.model.js');
    
    // Aggregate comment counts by idea
    const commentCounts = await CommentModel.aggregate([
      {
        $group: {
          _id: '$ideaId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Update each idea with its comment count
    for (const { _id: ideaId, count } of commentCounts) {
      await IdeaModel.updateOne(
        { _id: ideaId },
        { $set: { commentCount: count } }
      );
    }

    console.log(`Updated comment counts for ${commentCounts.length} ideas`);
  }
}