#!/usr/bin/env tsx
/**
 * Database Utilities for Humanet
 * 
 * Provides utilities for database management including:
 * - Backup and restore operations
 * - Data analysis and statistics
 * - Cleanup and maintenance
 * - Migration helpers
 * 
 * Usage:
 *   npx tsx scripts/db-utils.ts backup [--output=path]
 *   npx tsx scripts/db-utils.ts restore [--input=path]
 *   npx tsx scripts/db-utils.ts analyze
 *   npx tsx scripts/db-utils.ts cleanup [--dry-run]
 *   npx tsx scripts/db-utils.ts migrate
 */

import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { UserModel } from '../src/models/user.model.js';
import { IdeaModel } from '../src/models/idea.model.js';
import { CommentModel } from '../src/models/comment.model.js';
import config from '../src/config/index.js';

interface BackupData {
  metadata: {
    version: string;
    timestamp: string;
    environment: string;
    collections: string[];
  };
  users: any[];
  ideas: any[];
  comments: any[];
}

interface DatabaseStats {
  users: {
    total: number;
    withBio: number;
    withSkills: number;
    avgKarma: number;
    topUsers: any[];
  };
  ideas: {
    total: number;
    rootIdeas: number;
    forkedIdeas: number;
    avgUpvotes: number;
    totalUpvotes: number;
    topIdeas: any[];
    domainDistribution: Record<string, number>;
  };
  comments: {
    total: number;
    replies: number;
    avgCommentsPerIdea: number;
    activeCommenters: any[];
  };
  relationships: {
    userIdeaAuthors: number;
    userCommentAuthors: number;
    ideasWithComments: number;
    avgForkDepth: number;
  };
}

class DatabaseUtils {
  async connect() {
    try {
      await mongoose.connect(config.MONGO_URL);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }

  async backup(outputPath?: string): Promise<void> {
    console.log('💾 Creating database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultPath = `backup-${timestamp}.json`;
    const filePath = outputPath || defaultPath;

    try {
      // Fetch all data
      const [users, ideas, comments] = await Promise.all([
        UserModel.find({}).lean(),
        IdeaModel.find({}).lean(),
        CommentModel.find({}).lean()
      ]);

      const backupData: BackupData = {
        metadata: {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          environment: config.NODE_ENV,
          collections: ['users', 'ideas', 'comments']
        },
        users,
        ideas,
        comments
      };

      await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));
      
      console.log(`✅ Backup created successfully`);
      console.log(`📁 File: ${filePath}`);
      console.log(`📊 Stats:`);
      console.log(`   Users: ${users.length}`);
      console.log(`   Ideas: ${ideas.length}`);
      console.log(`   Comments: ${comments.length}`);
      console.log(`   Size: ${(await fs.stat(filePath)).size} bytes`);
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  async restore(inputPath: string, options: { clear?: boolean } = {}): Promise<void> {
    console.log('📂 Restoring database from backup...');
    
    try {
      // Read backup file
      const backupContent = await fs.readFile(inputPath, 'utf8');
      const backupData: BackupData = JSON.parse(backupContent);

      console.log(`📋 Backup Info:`);
      console.log(`   Version: ${backupData.metadata.version}`);
      console.log(`   Created: ${backupData.metadata.timestamp}`);
      console.log(`   Environment: ${backupData.metadata.environment}`);

      // Clear existing data if requested
      if (options.clear) {
        console.log('🗑️ Clearing existing data...');
        await Promise.all([
          UserModel.deleteMany({}),
          IdeaModel.deleteMany({}),
          CommentModel.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');
      }

      // Restore data
      console.log('📥 Restoring data...');
      
      const [userResults, ideaResults, commentResults] = await Promise.allSettled([
        UserModel.insertMany(backupData.users, { ordered: false }),
        IdeaModel.insertMany(backupData.ideas, { ordered: false }),
        CommentModel.insertMany(backupData.comments, { ordered: false })
      ]);

      console.log('✅ Restore completed');
      console.log(`📊 Results:`);
      console.log(`   Users: ${userResults.status === 'fulfilled' ? userResults.value.length : 'Failed'}`);
      console.log(`   Ideas: ${ideaResults.status === 'fulfilled' ? ideaResults.value.length : 'Failed'}`);
      console.log(`   Comments: ${commentResults.status === 'fulfilled' ? commentResults.value.length : 'Failed'}`);

      // Report any errors
      [userResults, ideaResults, commentResults].forEach((result, index) => {
        if (result.status === 'rejected') {
          const collectionName = ['Users', 'Ideas', 'Comments'][index];
          console.warn(`⚠️ ${collectionName} restore had issues:`, result.reason.message);
        }
      });

    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  async analyze(): Promise<DatabaseStats> {
    console.log('📊 Analyzing database...');

    try {
      // Fetch all data with populated references
      const [users, ideas, comments] = await Promise.all([
        UserModel.find({}).lean(),
        IdeaModel.find({}).populate('author', 'username').lean(),
        CommentModel.find({}).populate('author', 'username').lean()
      ]);

      // Calculate user statistics
      const usersWithBio = users.filter(u => u.bio && u.bio.trim().length > 0).length;
      const usersWithSkills = users.filter(u => u.skills && u.skills.length > 0).length;
      const avgKarma = users.reduce((sum, u) => sum + (u.karma || 0), 0) / users.length;
      const topUsers = users
        .sort((a, b) => (b.karma || 0) - (a.karma || 0))
        .slice(0, 10)
        .map(u => ({ username: u.username, karma: u.karma }));

      // Calculate idea statistics
      const rootIdeas = ideas.filter(i => !i.parentId).length;
      const forkedIdeas = ideas.length - rootIdeas;
      const totalUpvotes = ideas.reduce((sum, i) => sum + (i.upvotes || 0), 0);
      const avgUpvotes = totalUpvotes / ideas.length;
      const topIdeas = ideas
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 10)
        .map(i => ({ 
          title: i.title, 
          upvotes: i.upvotes, 
          author: (i.author as any)?.username || 'Unknown' 
        }));

      // Domain distribution
      const domainDistribution: Record<string, number> = {};
      ideas.forEach(idea => {
        if (idea.domain) {
          idea.domain.forEach((domain: string) => {
            domainDistribution[domain] = (domainDistribution[domain] || 0) + 1;
          });
        }
      });

      // Calculate comment statistics  
      const replies = 0; // Comments don't have parent-child relationships in our current model
      const avgCommentsPerIdea = comments.length / ideas.length;
      
      // Group comments by author
      const commentsByAuthor: Record<string, number> = {};
      comments.forEach(comment => {
        const authorId = comment.authorId?.toString();
        if (authorId) {
          commentsByAuthor[authorId] = (commentsByAuthor[authorId] || 0) + 1;
        }
      });

      const activeCommenters = Object.entries(commentsByAuthor)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([userId, count]) => {
          const user = users.find(u => u._id.toString() === userId);
          return { username: user?.username || 'Unknown', comments: count };
        });

      // Calculate relationship statistics
      const userIdeaAuthors = new Set(ideas.map(i => i.author?.toString())).size;
      const userCommentAuthors = new Set(comments.map(c => c.authorId?.toString())).size;
      const ideasWithComments = new Set(comments.map(c => c.ideaId?.toString())).size;
      
      // Calculate average fork depth
      const calculateDepth = (idea: any, allIdeas: any[], depth = 0): number => {
        if (!idea.parentId) return depth;
        const parent = allIdeas.find(i => i._id.toString() === idea.parentId.toString());
        return parent ? calculateDepth(parent, allIdeas, depth + 1) : depth;
      };

      const forkDepths = ideas
        .filter(i => i.parentId)
        .map(i => calculateDepth(i, ideas));
      const avgForkDepth = forkDepths.length > 0 
        ? forkDepths.reduce((sum, depth) => sum + depth, 0) / forkDepths.length 
        : 0;

      const stats: DatabaseStats = {
        users: {
          total: users.length,
          withBio: usersWithBio,
          withSkills: usersWithSkills,
          avgKarma: Math.round(avgKarma * 100) / 100,
          topUsers
        },
        ideas: {
          total: ideas.length,
          rootIdeas,
          forkedIdeas,
          avgUpvotes: Math.round(avgUpvotes * 100) / 100,
          totalUpvotes,
          topIdeas,
          domainDistribution
        },
        comments: {
          total: comments.length,
          replies,
          avgCommentsPerIdea: Math.round(avgCommentsPerIdea * 100) / 100,
          activeCommenters
        },
        relationships: {
          userIdeaAuthors,
          userCommentAuthors,
          ideasWithComments,
          avgForkDepth: Math.round(avgForkDepth * 100) / 100
        }
      };

      this.printAnalysis(stats);
      return stats;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  private printAnalysis(stats: DatabaseStats): void {
    console.log('\n📈 Database Analysis Report');
    console.log('============================');
    
    console.log('\n👥 Users:');
    console.log(`   Total: ${stats.users.total}`);
    console.log(`   With Bio: ${stats.users.withBio} (${Math.round(stats.users.withBio/stats.users.total*100)}%)`);
    console.log(`   With Skills: ${stats.users.withSkills} (${Math.round(stats.users.withSkills/stats.users.total*100)}%)`);
    console.log(`   Average Karma: ${stats.users.avgKarma}`);
    
    console.log('\n🏆 Top Users by Karma:');
    stats.users.topUsers.slice(0, 5).forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.username} (${user.karma} karma)`);
    });

    console.log('\n💡 Ideas:');
    console.log(`   Total: ${stats.ideas.total}`);
    console.log(`   Root Ideas: ${stats.ideas.rootIdeas} (${Math.round(stats.ideas.rootIdeas/stats.ideas.total*100)}%)`);
    console.log(`   Forked Ideas: ${stats.ideas.forkedIdeas} (${Math.round(stats.ideas.forkedIdeas/stats.ideas.total*100)}%)`);
    console.log(`   Total Upvotes: ${stats.ideas.totalUpvotes}`);
    console.log(`   Average Upvotes: ${stats.ideas.avgUpvotes}`);

    console.log('\n🔥 Most Upvoted Ideas:');
    stats.ideas.topIdeas.slice(0, 5).forEach((idea, i) => {
      console.log(`   ${i + 1}. ${idea.title.substring(0, 40)}... (${idea.upvotes} upvotes, by ${idea.author})`);
    });

    console.log('\n🏷️ Top Domains:');
    const sortedDomains = Object.entries(stats.ideas.domainDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    sortedDomains.forEach(([domain, count], i) => {
      console.log(`   ${i + 1}. ${domain}: ${count} ideas`);
    });

    console.log('\n💬 Comments:');
    console.log(`   Total: ${stats.comments.total}`);
    console.log(`   Replies: ${stats.comments.replies} (${Math.round(stats.comments.replies/stats.comments.total*100)}%)`);
    console.log(`   Average per Idea: ${stats.comments.avgCommentsPerIdea}`);

    console.log('\n🗣️ Most Active Commenters:');
    stats.comments.activeCommenters.slice(0, 5).forEach((commenter, i) => {
      console.log(`   ${i + 1}. ${commenter.username} (${commenter.comments} comments)`);
    });

    console.log('\n🔗 Relationships:');
    console.log(`   Users who created ideas: ${stats.relationships.userIdeaAuthors}`);
    console.log(`   Users who commented: ${stats.relationships.userCommentAuthors}`);
    console.log(`   Ideas with comments: ${stats.relationships.ideasWithComments}/${stats.ideas.total} (${Math.round(stats.relationships.ideasWithComments/stats.ideas.total*100)}%)`);
    console.log(`   Average fork depth: ${stats.relationships.avgForkDepth}`);
  }

  async cleanup(options: { dryRun?: boolean } = {}): Promise<void> {
    console.log(options.dryRun ? '🧹 Analyzing cleanup opportunities (dry run)...' : '🧹 Cleaning up database...');

    try {
      // Find orphaned comments (comments without valid idea references)
      const comments = await CommentModel.find({}).lean();
      const ideas = await IdeaModel.find({}, '_id').lean();
      const ideaIds = new Set(ideas.map(i => i._id.toString()));
      
      const orphanedComments = comments.filter(c => 
        c.ideaId && !ideaIds.has(c.ideaId.toString())
      );

      // Find ideas with invalid parent references
      const invalidParentIdeas: any[] = [];
      for (const idea of await IdeaModel.find({ parentId: { $exists: true } }).lean()) {
        const parentExists = await IdeaModel.exists({ _id: idea.parentId });
        if (!parentExists) {
          invalidParentIdeas.push(idea);
        }
      }

      // Find users with no activity (no ideas or comments)
      const activeUserIds = new Set([
        ...ideas.map(i => i.author?.toString()).filter(Boolean),
        ...comments.map(c => c.authorId?.toString()).filter(Boolean)
      ]);
      
      const allUsers = await UserModel.find({}, '_id username').lean();
      const inactiveUsers = allUsers.filter(u => !activeUserIds.has(u._id.toString()));

      // Find duplicate upvotes in ideas
      const ideasWithDuplicateUpvotes: any[] = [];
      for (const idea of await IdeaModel.find({ upvoters: { $exists: true, $ne: [] } }).lean()) {
        const upvoteSet = new Set(idea.upvoters.map((id: any) => id.toString()));
        if (upvoteSet.size !== idea.upvoters.length) {
          ideasWithDuplicateUpvotes.push(idea);
        }
      }

      console.log('\n🔍 Cleanup Analysis:');
      console.log(`   Orphaned comments: ${orphanedComments.length}`);
      console.log(`   Ideas with invalid parents: ${invalidParentIdeas.length}`);
      console.log(`   Inactive users: ${inactiveUsers.length}`);
      console.log(`   Ideas with duplicate upvotes: ${ideasWithDuplicateUpvotes.length}`);

      if (!options.dryRun) {
        let cleanedItems = 0;

        // Remove orphaned comments
        if (orphanedComments.length > 0) {
          const result = await CommentModel.deleteMany({
            _id: { $in: orphanedComments.map(c => c._id) }
          });
          cleanedItems += result.deletedCount;
          console.log(`   ✅ Removed ${result.deletedCount} orphaned comments`);
        }

        // Fix invalid parent references
        if (invalidParentIdeas.length > 0) {
          const result = await IdeaModel.updateMany(
            { _id: { $in: invalidParentIdeas.map(i => i._id) } },
            { $unset: { parentId: 1 } }
          );
          cleanedItems += result.modifiedCount;
          console.log(`   ✅ Fixed ${result.modifiedCount} invalid parent references`);
        }

        // Clean duplicate upvotes
        for (const idea of ideasWithDuplicateUpvotes) {
          const uniqueUpvotes = [...new Set(idea.upvoters.map((id: any) => id.toString()))];
          await IdeaModel.findByIdAndUpdate(idea._id, {
            upvoters: uniqueUpvotes,
            upvotes: uniqueUpvotes.length
          });
          cleanedItems++;
        }
        if (ideasWithDuplicateUpvotes.length > 0) {
          console.log(`   ✅ Cleaned duplicate upvotes in ${ideasWithDuplicateUpvotes.length} ideas`);
        }

        console.log(`\n✅ Cleanup completed. ${cleanedItems} items cleaned.`);
      } else {
        console.log('\n💡 Run without --dry-run to perform cleanup');
      }

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  async migrate(): Promise<void> {
    console.log('🔄 Running database migrations...');

    try {
      // Example migration: Ensure all ideas have a domain array
      const ideasWithoutDomain = await IdeaModel.countDocuments({ 
        $or: [
          { domain: { $exists: false } },
          { domain: null },
          { domain: [] }
        ]
      });

      if (ideasWithoutDomain > 0) {
        const result = await IdeaModel.updateMany(
          { 
            $or: [
              { domain: { $exists: false } },
              { domain: null },
              { domain: [] }
            ]
          },
          { $set: { domain: ['General'] } }
        );
        console.log(`   ✅ Updated ${result.modifiedCount} ideas with missing domains`);
      }

      // Example migration: Ensure all users have karma field
      const usersWithoutKarma = await UserModel.countDocuments({
        $or: [
          { karma: { $exists: false } },
          { karma: null }
        ]
      });

      if (usersWithoutKarma > 0) {
        const result = await UserModel.updateMany(
          {
            $or: [
              { karma: { $exists: false } },
              { karma: null }
            ]
          },
          { $set: { karma: 0 } }
        );
        console.log(`   ✅ Updated ${result.modifiedCount} users with missing karma`);
      }

      // Example migration: Ensure upvotes count matches upvoters array length
      const ideas = await IdeaModel.find({ upvoters: { $exists: true } }).lean();
      let fixedUpvoteCounts = 0;

      for (const idea of ideas) {
        const actualUpvotes = idea.upvoters ? idea.upvoters.length : 0;
        if (idea.upvotes !== actualUpvotes) {
          await IdeaModel.findByIdAndUpdate(idea._id, { upvotes: actualUpvotes });
          fixedUpvoteCounts++;
        }
      }

      if (fixedUpvoteCounts > 0) {
        console.log(`   ✅ Fixed upvote counts for ${fixedUpvoteCounts} ideas`);
      }

      console.log('✅ Database migrations completed');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async exportStats(outputPath?: string): Promise<void> {
    console.log('📤 Exporting database statistics...');
    
    const stats = await this.analyze();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = outputPath || `stats-${timestamp}.json`;

    await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
    console.log(`✅ Statistics exported to ${filePath}`);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  const utils = new DatabaseUtils();
  await utils.connect();

  try {
    switch (command) {
      case 'backup': {
        const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
        await utils.backup(output);
        break;
      }
      
      case 'restore': {
        const input = args.find(arg => arg.startsWith('--input='))?.split('=')[1];
        if (!input) {
          console.error('❌ --input=path is required for restore');
          process.exit(1);
        }
        const clear = args.includes('--clear');
        await utils.restore(input, { clear });
        break;
      }
      
      case 'analyze':
        await utils.analyze();
        break;
      
      case 'cleanup': {
        const dryRun = args.includes('--dry-run');
        await utils.cleanup({ dryRun });
        break;
      }
      
      case 'migrate':
        await utils.migrate();
        break;
      
      case 'export-stats': {
        const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
        await utils.exportStats(output);
        break;
      }
      
      default:
        console.log('🛠️ Humanet Database Utilities');
        console.log('Usage: npx tsx scripts/db-utils.ts <command> [options]');
        console.log('');
        console.log('Commands:');
        console.log('  backup [--output=path]          Create database backup');
        console.log('  restore --input=path [--clear]  Restore from backup');
        console.log('  analyze                         Analyze database statistics');
        console.log('  cleanup [--dry-run]             Clean up orphaned data');
        console.log('  migrate                         Run database migrations');
        console.log('  export-stats [--output=path]    Export statistics to JSON');
        break;
    }
  } finally {
    await utils.disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DatabaseUtils;
