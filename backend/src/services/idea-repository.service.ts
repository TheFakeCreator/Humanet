import { IdeaModel, IIdea } from '../models/index.js';
import { IdeaFilesystemService } from './idea-filesystem.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { Types } from 'mongoose';

export class IdeaRepositoryService {
  private filesystemService: IdeaFilesystemService;

  constructor() {
    this.filesystemService = new IdeaFilesystemService();
  }

  /**
   * Create repository and update idea record
   */
  async createIdeaRepository(
    ideaId: string,
    template: 'basic' | 'research' | 'technical' = 'basic'
  ): Promise<void> {
    try {
      // Check if idea exists
      const idea = await IdeaModel.findById(ideaId);
      if (!idea) {
        throw new AppError('Idea not found', 404);
      }

      // Check if repository already exists
      if (idea.hasRepository) {
        throw new AppError('Repository already exists for this idea', 400);
      }

      // Create file system repository
      await this.filesystemService.createRepository(ideaId, template);

      // Update idea record
      await IdeaModel.findByIdAndUpdate(ideaId, {
        hasRepository: true,
        repositoryTemplate: template,
        repositoryCreated: new Date(),
        lastRepositoryUpdate: new Date(),
        fileCount: this.getInitialFileCount(template),
        repositorySize: 0, // Will be calculated later
      });

      console.log(`✅ Repository created and database updated for idea ${ideaId}`);
    } catch (error) {
      // Clean up on failure
      try {
        await this.filesystemService.deleteRepository(ideaId);
      } catch (cleanupError) {
        console.warn('Failed to cleanup repository on error:', cleanupError);
      }
      throw error;
    }
  }

  /**
   * Delete repository and update idea record
   */
  async deleteIdeaRepository(ideaId: string): Promise<void> {
    try {
      // Check if idea exists
      const idea = await IdeaModel.findById(ideaId);
      if (!idea) {
        throw new AppError('Idea not found', 404);
      }

      // Delete file system repository
      await this.filesystemService.deleteRepository(ideaId);

      // Update idea record
      await IdeaModel.findByIdAndUpdate(ideaId, {
        hasRepository: false,
        repositoryCreated: undefined,
        lastRepositoryUpdate: undefined,
        fileCount: 0,
        repositorySize: 0,
      });

      console.log(`✅ Repository deleted and database updated for idea ${ideaId}`);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Failed to delete repository', 500);
    }
  }

  /**
   * Update repository metadata after file operations
   */
  async updateRepositoryMetadata(ideaId: string): Promise<void> {
    try {
      const idea = await IdeaModel.findById(ideaId);
      if (!idea || !idea.hasRepository) {
        return; // Nothing to update
      }

      // Get current repository stats from .humanet directory
      const files = await this.filesystemService.listFiles(ideaId, '.humanet');
      const stats = this.calculateRepositoryStats(files);

      // Update idea record
      await IdeaModel.findByIdAndUpdate(ideaId, {
        lastRepositoryUpdate: new Date(),
        fileCount: stats.fileCount,
        repositorySize: stats.totalSize,
      });
    } catch (error) {
      console.warn(`Failed to update repository metadata for idea ${ideaId}:`, error);
      // Non-critical error, don't throw
    }
  }

  /**
   * Sync idea content with repository files
   */
  async syncIdeaWithRepository(ideaId: string): Promise<void> {
    try {
      const idea = await IdeaModel.findById(ideaId);
      if (!idea || !idea.hasRepository) {
        return;
      }

      // Update idea.md with current idea data
      const ideaContent = this.generateIdeaMarkdown(idea);
      await this.filesystemService.updateFile(ideaId, '.humanet/idea.md', ideaContent);

      // Update search.md with tags and domain info
      const searchContent = this.generateSearchMarkdown(idea);
      await this.filesystemService.updateFile(ideaId, '.humanet/search.md', searchContent);

      // Update repository metadata
      await this.updateRepositoryMetadata(ideaId);
    } catch (error) {
      console.warn(`Failed to sync idea ${ideaId} with repository:`, error);
    }
  }

  /**
   * Auto-create repository when idea is created (if enabled)
   */
  async autoCreateRepositoryForNewIdea(
    ideaId: string,
    authorPreferences?: {
      autoCreateRepository?: boolean;
      preferredTemplate?: 'basic' | 'research' | 'technical';
    }
  ): Promise<void> {
    try {
      if (!authorPreferences?.autoCreateRepository) {
        return; // Auto-creation disabled
      }

      const template = authorPreferences.preferredTemplate || 'basic';
      await this.createIdeaRepository(ideaId, template);

      // Sync initial content
      await this.syncIdeaWithRepository(ideaId);
    } catch (error) {
      console.warn(`Failed to auto-create repository for idea ${ideaId}:`, error);
      // Non-critical error for auto-creation
    }
  }

  /**
   * Get repository overview for an idea
   */
  async getRepositoryOverview(ideaId: string): Promise<{
    hasRepository: boolean;
    template?: string;
    stats?: {
      fileCount: number;
      totalSize: number;
      lastUpdate: Date;
    };
    structure?: any[];
  }> {
    const idea = await IdeaModel.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    if (!idea.hasRepository) {
      return { hasRepository: false };
    }

    try {
      // Get root structure
      const rootFiles = await this.filesystemService.listFiles(ideaId);

      // Get files from .humanet directory for accurate count
      const humanetFiles = await this.filesystemService.listFiles(ideaId, '.humanet');
      const stats = this.calculateRepositoryStats(humanetFiles);

      return {
        hasRepository: true,
        template: idea.repositoryTemplate,
        stats: {
          fileCount: stats.fileCount,
          totalSize: stats.totalSize,
          lastUpdate: idea.lastRepositoryUpdate || idea.repositoryCreated || new Date(),
        },
        structure: rootFiles,
      };
    } catch (error) {
      console.warn(`Failed to get repository overview for idea ${ideaId}:`, error);
      return {
        hasRepository: true,
        template: idea.repositoryTemplate,
      };
    }
  }

  /**
   * Migrate existing ideas to include repository metadata
   */
  async migrateExistingIdeas(): Promise<{ migrated: number; errors: number }> {
    let migrated = 0;
    let errors = 0;

    try {
      const ideas = await IdeaModel.find({ hasRepository: { $ne: true } });

      for (const idea of ideas) {
        try {
          // Check if repository exists in filesystem
          const ideaId = (idea._id as Types.ObjectId).toString();
          const repositoryExists = await this.filesystemService.repositoryExists(ideaId);

          if (repositoryExists) {
            // Update database to reflect existing repository
            const files = await this.filesystemService.listFiles(ideaId);
            const stats = this.calculateRepositoryStats(files);

            await IdeaModel.findByIdAndUpdate(idea._id, {
              hasRepository: true,
              repositoryTemplate: 'basic', // Default for existing
              fileCount: stats.fileCount,
              repositorySize: stats.totalSize,
              lastRepositoryUpdate: new Date(),
            });

            migrated++;
          }
        } catch (error) {
          console.warn(`Failed to migrate idea ${idea._id}:`, error);
          errors++;
        }
      }
    } catch (error) {
      console.error('Failed to run migration:', error);
      throw new AppError('Migration failed', 500);
    }

    return { migrated, errors };
  }

  // Helper methods
  private getInitialFileCount(template: 'basic' | 'research' | 'technical'): number {
    const fileCounts: Record<'basic' | 'research' | 'technical', number> = {
      basic: 5, // idea.md, scope.md, problem.md, search.md, meta.json
      research: 7, // + methodology.md, references.md
      technical: 7, // + architecture.md, requirements.md
    };
    return fileCounts[template];
  }

  private calculateRepositoryStats(files: any[]): { fileCount: number; totalSize: number } {
    let fileCount = 0;
    let totalSize = 0;

    for (const file of files) {
      if (file.type === 'file') {
        fileCount++;
        totalSize += file.size || 0;
      }
    }

    return { fileCount, totalSize };
  }

  private generateIdeaMarkdown(idea: IIdea): string {
    return `# ${idea.title}

## Overview
${idea.description}

## Domain
${idea.domain.join(', ')}

## Tags
${idea.tags.join(', ')}

## Status
${idea.implementationStatus}

## Statistics
- Upvotes: ${idea.upvotes}
- Comments: ${idea.commentCount}
- Views: ${idea.viewCount}

## Implementation Details
${idea.githubRepo ? `- GitHub Repository: ${idea.githubRepo}` : ''}
${idea.liveDemo ? `- Live Demo: ${idea.liveDemo}` : ''}

---
*Auto-generated from Humanet idea data*
*Last updated: ${new Date().toISOString()}*
`;
  }

  private generateSearchMarkdown(idea: IIdea): string {
    return `# Search Keywords

*This file is automatically updated based on idea content and user interactions.*

## Primary Keywords
${idea.tags.map((tag: string) => `- ${tag}`).join('\n')}

## Domain Keywords
${idea.domain.map((domain: string) => `- ${domain}`).join('\n')}

## Content Keywords
*Extracted from idea title and description*
${this.extractKeywords(idea.title + ' ' + idea.description)
  .map((keyword: string) => `- ${keyword}`)
  .join('\n')}

## Status
- Implementation Status: ${idea.implementationStatus}
- Visibility: ${idea.visibility}

---
*Last updated: ${new Date().toISOString()}*
*Auto-generated by Humanet search indexing*
`;
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP later
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were'].includes(word)
      );

    // Get unique words and return top 10
    return [...new Set(words)].slice(0, 10);
  }
}
