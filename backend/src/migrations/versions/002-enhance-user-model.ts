/**
 * Example Migration: Enhance User model with social and activity fields
 * Version: 1.1.0
 * 
 * This migration demonstrates adding multiple new fields and updating data structure
 */

import { BaseMigration } from '../migration-system.js';
import { UserModel } from '../../models/user.model.js';

export class EnhanceUserModelMigration extends BaseMigration {
  version = '1.1.0';
  name = 'EnhanceUserModel';
  description = 'Add social links, activity tracking, and statistics to users';

  async up(): Promise<void> {
    console.log('Enhancing user model with new fields...');
    
    // Add new fields to all existing users
    const result = await UserModel.updateMany(
      {},
      {
        $set: {
          // Activity tracking
          lastActive: new Date(),
          isOnline: false,
          
          // Statistics - initialize to 0
          totalIdeas: 0,
          totalComments: 0,
          totalUpvotesGiven: 0,
          totalUpvotesReceived: 0,
          
          // Preferences
          emailNotifications: true,
          profileVisibility: 'public',
          
          // Account status
          isActive: true,
          isBanned: false,
          
          // Verification
          isVerified: false,
          verificationBadges: []
        }
      }
    );

    console.log(`Enhanced ${result.modifiedCount} user documents`);

    // Calculate actual statistics for existing users
    await this.calculateUserStatistics();

    // Add new indexes
    await UserModel.collection.createIndex(
      { lastActive: -1 },
      { name: 'idx_last_active' }
    );
    
    await UserModel.collection.createIndex(
      { isOnline: 1 },
      { name: 'idx_is_online' }
    );
    
    await UserModel.collection.createIndex(
      { totalIdeas: -1 },
      { name: 'idx_total_ideas' }
    );
  }

  async down(): Promise<void> {
    console.log('Removing enhanced user fields...');
    
    await UserModel.updateMany(
      {},
      {
        $unset: {
          avatar: '',
          location: '',
          website: '',
          githubUrl: '',
          linkedinUrl: '',
          twitterUrl: '',
          lastActive: '',
          isOnline: '',
          totalIdeas: '',
          totalComments: '',
          totalUpvotesGiven: '',
          totalUpvotesReceived: '',
          emailNotifications: '',
          profileVisibility: '',
          isActive: '',
          isBanned: '',
          banReason: '',
          banExpiresAt: '',
          isVerified: '',
          verificationBadges: ''
        }
      }
    );

    // Drop indexes
    const indexesToDrop = [
      'idx_last_active',
      'idx_is_online', 
      'idx_total_ideas'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await UserModel.collection.dropIndex(indexName);
      } catch (error) {
        console.warn(`Index ${indexName} not found, skipping drop`);
      }
    }
  }

  private async calculateUserStatistics(): Promise<void> {
    console.log('Calculating user statistics...');
    
    // Import models dynamically to avoid circular dependencies
    const { IdeaModel } = await import('../../models/idea.model.js');
    const { CommentModel } = await import('../../models/comment.model.js');

    const users = await UserModel.find({});
    
    for (const user of users) {
      // Count ideas
      const ideaCount = await IdeaModel.countDocuments({ author: user._id });
      
      // Count comments
      const commentCount = await CommentModel.countDocuments({ authorId: user._id });
      
      // Count upvotes received (sum of upvotes on user's ideas)
      const upvotesReceived = await IdeaModel.aggregate([
        { $match: { author: user._id } },
        { $group: { _id: null, total: { $sum: '$upvotes' } } }
      ]);
      
      // Count upvotes given (count of ideas user has upvoted)
      const upvotesGiven = await IdeaModel.countDocuments({ 
        upvoters: user._id 
      });

      // Update user with calculated statistics
      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: {
            totalIdeas: ideaCount,
            totalComments: commentCount,
            totalUpvotesReceived: upvotesReceived[0]?.total || 0,
            totalUpvotesGiven: upvotesGiven
          }
        }
      );
    }

    console.log(`Updated statistics for ${users.length} users`);
  }
}