import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { IdeaFilesystemService } from '../services/idea-filesystem.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { z } from 'zod';

const filesystemService = new IdeaFilesystemService();

// Validation schemas
const createFileSchema = z.object({
  path: z.string().min(1).max(200),
  content: z.string().max(10 * 1024 * 1024), // 10MB limit
});

const updateFileSchema = z.object({
  content: z.string().max(10 * 1024 * 1024),
});

const createRepositorySchema = z.object({
  template: z.enum(['basic', 'research', 'technical']).optional().default('basic'),
});

export class IdeaFilesController {
  /**
   * Create a new repository for an idea
   */
  static async createRepository(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const { template } = createRepositorySchema.parse(req.body);

      // Check if user owns the idea
      // TODO: Add proper ownership check when idea service is integrated

      // Check if repository already exists
      if (await filesystemService.repositoryExists(ideaId)) {
        res.status(400).json({
          success: false,
          error: 'Repository already exists for this idea',
        });
        return;
      }

      await filesystemService.createRepository(ideaId, template);

      res.status(201).json({
        success: true,
        message: `Repository created with ${template} template`,
        data: {
          ideaId,
          template,
          repositoryPath: `storage/ideas/${ideaId}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all files and directories in a repository
   */
  static async listFiles(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ideaId } = req.params;
      const { path: subPath = '' } = req.query;

      const files = await filesystemService.listFiles(ideaId, subPath as string);

      res.json({
        success: true,
        data: {
          ideaId,
          path: subPath || '/',
          files,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recursive file tree for an idea
   */
  static async getFileTree(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ideaId } = req.params;
      const { maxDepth = 5 } = req.query;

      const fileTree = await filesystemService.getFileTree(ideaId, Number(maxDepth));

      res.json({
        success: true,
        data: {
          ideaId,
          tree: fileTree,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get content of a specific file
   */
  static async getFile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ideaId } = req.params;
      // Get file path from query parameter
      const filePath = req.query.path as string;

      if (!filePath) {
        res.status(400).json({
          success: false,
          error: 'File path is required as query parameter',
        });
        return;
      }

      const content = await filesystemService.getFileContent(ideaId, filePath);

      res.json({
        success: true,
        data: {
          ideaId,
          filePath,
          content,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update content of a specific file
   */
  static async updateFile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      // Get file path from query parameter
      const filePath = req.query.path as string;
      const { content } = updateFileSchema.parse(req.body);

      if (!filePath) {
        res.status(400).json({
          success: false,
          error: 'File path is required',
        });
        return;
      }

      // TODO: Add proper ownership/permission check

      await filesystemService.updateFile(ideaId, filePath, content);

      res.json({
        success: true,
        message: 'File updated successfully',
        data: {
          ideaId,
          filePath,
          lastModified: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new file
   */
  static async createFile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const { path: filePath, content } = createFileSchema.parse(req.body);

      // TODO: Add proper ownership/permission check

      await filesystemService.updateFile(ideaId, filePath, content);

      res.status(201).json({
        success: true,
        message: 'File created successfully',
        data: {
          ideaId,
          filePath,
          created: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a specific file
   */
  static async deleteFile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;
      const { '*': filePath } = req.params;

      if (!filePath) {
        res.status(400).json({
          success: false,
          error: 'File path is required',
        });
        return;
      }

      // TODO: Add proper ownership/permission check

      await filesystemService.deleteFile(ideaId, filePath);

      res.json({
        success: true,
        message: 'File deleted successfully',
        data: {
          ideaId,
          filePath,
          deleted: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete entire repository
   */
  static async deleteRepository(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { ideaId } = req.params;

      // TODO: Add proper ownership check and cascade delete

      await filesystemService.deleteRepository(ideaId);

      res.json({
        success: true,
        message: 'Repository deleted successfully',
        data: {
          ideaId,
          deleted: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get repository metadata and structure overview
   */
  static async getRepositoryInfo(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ideaId } = req.params;

      // Check if repository exists
      const exists = await filesystemService.repositoryExists(ideaId);
      if (!exists) {
        res.status(404).json({
          success: false,
          error: 'Repository not found',
        });
        return;
      }

      // Get repository structure
      const files = await filesystemService.listFiles(ideaId);

      // Get meta.json if it exists
      let meta = null;
      try {
        const metaContent = await filesystemService.getFileContent(ideaId, '.humanet/meta.json');
        meta = JSON.parse(metaContent);
      } catch (error) {
        // Meta file doesn't exist or is invalid
      }

      // Calculate repository stats
      const stats = {
        totalFiles: 0,
        totalDirectories: 0,
        requiredFilesCount: 0,
      };

      const calculateStats = (fileList: any[]) => {
        for (const file of fileList) {
          if (file.type === 'directory') {
            stats.totalDirectories++;
          } else {
            stats.totalFiles++;
            if (file.path.startsWith('.humanet/') && file.name.endsWith('.md')) {
              stats.requiredFilesCount++;
            }
          }
        }
      };

      calculateStats(files);

      res.json({
        success: true,
        data: {
          ideaId,
          exists,
          meta,
          stats,
          structure: files,
          lastChecked: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
