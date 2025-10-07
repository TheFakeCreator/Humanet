import fs from 'fs-extra';
import path from 'path';
import { AppError } from '../middlewares/error.middleware.js';

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
  mimeType?: string;
  lastModified?: Date;
}

export interface FileVersion {
  id: string;
  timestamp: Date;
  size: number;
  operation: 'created' | 'updated' | 'deleted';
  backupPath?: string;
}

export interface RepositoryTemplate {
  name: string;
  description: string;
  requiredFiles: Record<string, string>;
  optionalFolders: string[];
}

export class IdeaFilesystemService {
  private readonly basePath: string;
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB limit
  private readonly allowedExtensions = [
    '.md',
    '.txt',
    '.json',
    '.js',
    '.ts',
    '.py',
    '.html',
    '.css',
  ];

  constructor() {
    // Use environment variable or default to storage directory
    this.basePath = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage', 'ideas');
    this.ensureBasePath();
  }

  /**
   * Ensure the base storage directory exists
   */
  private async ensureBasePath(): Promise<void> {
    try {
      await fs.ensureDir(this.basePath);
    } catch (error) {
      throw new AppError('Failed to initialize storage directory', 500);
    }
  }

  /**
   * Create a new idea repository with .humanet structure
   */
  async createRepository(
    ideaId: string,
    template: 'basic' | 'research' | 'technical' = 'basic'
  ): Promise<void> {
    const repositoryPath = this.getRepositoryPath(ideaId);

    try {
      // Check if repository already exists
      if (await fs.pathExists(repositoryPath)) {
        throw new AppError('Repository already exists', 400);
      }

      // Create directory structure
      await this.createDirectoryStructure(repositoryPath);

      // Create required files with templates
      await this.createRequiredFiles(repositoryPath, template);

      console.log(`✅ Created repository for idea ${ideaId}`);
    } catch (error) {
      // Clean up on failure
      await this.deleteRepository(ideaId);
      throw error instanceof AppError ? error : new AppError('Failed to create repository', 500);
    }
  }

  /**
   * Create the standard directory structure
   */
  private async createDirectoryStructure(repositoryPath: string): Promise<void> {
    const directories = [
      '.humanet',
      'docs',
      'media',
      'data',
      'analysis',
      'discussions',
      'versions',
    ];

    for (const dir of directories) {
      await fs.ensureDir(path.join(repositoryPath, dir));
    }
  }

  /**
   * Create required files with templates
   */
  private async createRequiredFiles(repositoryPath: string, template: string): Promise<void> {
    const humanetPath = path.join(repositoryPath, '.humanet');
    const templates = this.getTemplates(template);

    for (const [fileName, content] of Object.entries(templates.requiredFiles)) {
      const filePath = path.join(humanetPath, fileName);
      await fs.writeFile(filePath, content, 'utf8');
    }

    // Create meta.json with repository metadata
    const metaData = {
      version: '1.0.0',
      template: template,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      fileCount: Object.keys(templates.requiredFiles).length,
    };

    await fs.writeFile(
      path.join(humanetPath, 'meta.json'),
      JSON.stringify(metaData, null, 2),
      'utf8'
    );
  }

  /**
   * Get file templates based on repository type
   */
  private getTemplates(template: string): RepositoryTemplate {
    const templates: Record<string, RepositoryTemplate> = {
      basic: {
        name: 'Basic Idea',
        description: 'Simple idea repository structure',
        requiredFiles: {
          'idea.md': this.getIdeaTemplate(),
          'scope.md': this.getScopeTemplate(),
          'problem.md': this.getProblemTemplate(),
          'search.md': this.getSearchTemplate(),
        },
        optionalFolders: ['docs', 'media'],
      },
      research: {
        name: 'Research Project',
        description: 'Academic or research-focused structure',
        requiredFiles: {
          'idea.md': this.getIdeaTemplate(),
          'scope.md': this.getScopeTemplate(),
          'problem.md': this.getProblemTemplate(),
          'search.md': this.getSearchTemplate(),
          'methodology.md': this.getMethodologyTemplate(),
          'references.md': this.getReferencesTemplate(),
        },
        optionalFolders: ['docs', 'media', 'data', 'analysis'],
      },
      technical: {
        name: 'Technical Project',
        description: 'Software or technical implementation',
        requiredFiles: {
          'idea.md': this.getIdeaTemplate(),
          'scope.md': this.getScopeTemplate(),
          'problem.md': this.getProblemTemplate(),
          'search.md': this.getSearchTemplate(),
          'architecture.md': this.getArchitectureTemplate(),
          'requirements.md': this.getRequirementsTemplate(),
        },
        optionalFolders: ['docs', 'media', 'data'],
      },
    };

    return templates[template] || templates.basic;
  }

  /**
   * Get the path to a repository
   */
  private getRepositoryPath(ideaId: string): string {
    return path.join(this.basePath, ideaId);
  }

  /**
   * Get the path to a file within a repository
   */
  private getFilePath(ideaId: string, filePath: string): string {
    const repositoryPath = this.getRepositoryPath(ideaId);

    // Validate and sanitize the file path
    const sanitizedPath = this.sanitizePath(filePath);
    return path.join(repositoryPath, sanitizedPath);
  }

  /**
   * Sanitize file paths to prevent directory traversal
   */
  private sanitizePath(filePath: string): string {
    // Remove any directory traversal attempts
    const normalized = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');

    // Ensure path doesn't start with / or \
    return normalized.replace(/^[\/\\]+/, '');
  }

  /**
   * Read file content
   */
  async getFileContent(ideaId: string, filePath: string): Promise<string> {
    const fullPath = this.getFilePath(ideaId, filePath);

    try {
      // Check if file exists
      if (!(await fs.pathExists(fullPath))) {
        throw new AppError('File not found', 404);
      }

      // Read file content
      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to read file', 500);
    }
  }

  /**
   * Update file content with version history
   */
  async updateFile(ideaId: string, filePath: string, content: string): Promise<void> {
    const fullPath = this.getFilePath(ideaId, filePath);

    try {
      // Validate file size
      if (Buffer.byteLength(content, 'utf8') > this.maxFileSize) {
        throw new AppError('File size exceeds limit', 413);
      }

      // Validate file type
      this.validateFileType(filePath);

      const fileExists = await fs.pathExists(fullPath);
      let backupName: string | undefined;
      let originalSize = 0;

      // Create backup if file exists (only for updates, not initial creation)
      if (fileExists) {
        const originalContent = await fs.readFile(fullPath, 'utf8');
        originalSize = Buffer.byteLength(originalContent, 'utf8');
        backupName = await this.createFileBackup(ideaId, filePath);
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));

      // Write file
      await fs.writeFile(fullPath, content, 'utf8');

      // Record version history only if this was an update (file existed before)
      if (fileExists && backupName) {
        await this.recordFileVersion(ideaId, filePath, {
          id: new Date().toISOString(),
          timestamp: new Date(),
          size: originalSize, // Size of the backed up content
          operation: 'updated',
          backupPath: backupName,
        });

        // Cleanup old versions
        await this.cleanupOldVersions(ideaId, filePath, 5);
      }

      // Update meta.json if this is in .humanet folder
      if (filePath.startsWith('.humanet/')) {
        await this.updateRepositoryMeta(ideaId);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update file', 500);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(ideaId: string, filePath: string): Promise<void> {
    const fullPath = this.getFilePath(ideaId, filePath);

    try {
      // Prevent deletion of required files
      if (this.isRequiredFile(filePath)) {
        throw new AppError('Cannot delete required file', 400);
      }

      // Check if file exists
      if (!(await fs.pathExists(fullPath))) {
        throw new AppError('File not found', 404);
      }

      // Delete file
      await fs.remove(fullPath);

      // Update meta.json
      await this.updateRepositoryMeta(ideaId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete file', 500);
    }
  }

  /**
   * List all files and directories in a repository
   */
  async listFiles(ideaId: string, subPath: string = ''): Promise<FileTreeNode[]> {
    const repositoryPath = this.getRepositoryPath(ideaId);
    const targetPath = path.join(repositoryPath, this.sanitizePath(subPath));

    try {
      // Check if repository exists
      if (!(await fs.pathExists(repositoryPath))) {
        throw new AppError('Repository not found', 404);
      }

      // Check if target path exists
      if (!(await fs.pathExists(targetPath))) {
        throw new AppError('Path not found', 404);
      }

      const items = await fs.readdir(targetPath);
      const fileNodes: FileTreeNode[] = [];

      for (const item of items) {
        const itemPath = path.join(targetPath, item);
        const stats = await fs.stat(itemPath);
        const relativePath = path.relative(repositoryPath, itemPath);

        const node: FileTreeNode = {
          name: item,
          path: relativePath.replace(/\\/g, '/'), // Normalize path separators
          type: stats.isDirectory() ? 'directory' : 'file',
          lastModified: stats.mtime,
        };

        if (stats.isFile()) {
          node.size = stats.size;
          node.mimeType = this.getMimeType(item);
        }

        fileNodes.push(node);
      }

      // Sort: directories first, then files alphabetically
      return fileNodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to list files', 500);
    }
  }

  /**
   * Delete entire repository
   */
  async deleteRepository(ideaId: string): Promise<void> {
    const repositoryPath = this.getRepositoryPath(ideaId);

    try {
      if (await fs.pathExists(repositoryPath)) {
        await fs.remove(repositoryPath);
      }
    } catch (error) {
      throw new AppError('Failed to delete repository', 500);
    }
  }

  /**
   * Check if repository exists
   */
  async repositoryExists(ideaId: string): Promise<boolean> {
    const repositoryPath = this.getRepositoryPath(ideaId);
    return await fs.pathExists(repositoryPath);
  }

  /**
   * Update repository metadata
   */
  private async updateRepositoryMeta(ideaId: string): Promise<void> {
    try {
      const metaPath = path.join(this.getRepositoryPath(ideaId), '.humanet', 'meta.json');

      if (await fs.pathExists(metaPath)) {
        const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
        meta.lastModified = new Date().toISOString();
        await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
      }
    } catch (error) {
      // Non-critical error, log but don't throw
      console.warn(`Failed to update meta for repository ${ideaId}:`, error);
    }
  }

  /**
   * Check if a file is required and cannot be deleted
   */
  private isRequiredFile(filePath: string): boolean {
    const requiredFiles = [
      '.humanet/idea.md',
      '.humanet/scope.md',
      '.humanet/problem.md',
      '.humanet/search.md',
      '.humanet/meta.json',
    ];

    return requiredFiles.includes(filePath.replace(/\\/g, '/'));
  }

  /**
   * Get MIME type for file extension
   */
  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.md': 'text/markdown',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.js': 'text/javascript',
      '.ts': 'text/typescript',
      '.py': 'text/x-python',
      '.html': 'text/html',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  // Template methods
  private getIdeaTemplate(): string {
    return `# Idea Title

## Overview
Brief description of your idea in 1-2 sentences.

## Description
Detailed explanation of your idea, what it does, and why it matters.

## Target Audience
Who would benefit from this idea?

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Current Status
What stage is this idea in? (Concept, Planning, Development, etc.)

## Next Steps
What needs to happen to move this forward?
`;
  }

  private getScopeTemplate(): string {
    return `# Project Scope

## What's Included
Define what this project will include and deliver.

### Core Features
- List the essential features
- That must be included

### Secondary Features  
- Optional features
- That would be nice to have

## What's Excluded
Clearly define what is NOT part of this project.

### Out of Scope
- Features that won't be included
- To keep the project focused

## Success Criteria
How will you know when this project is successful?

## Timeline
Rough estimate of project duration and major milestones.
`;
  }

  private getProblemTemplate(): string {
    return `# Problem Statement

## The Problem
Clearly describe the problem this idea solves.

### Who Has This Problem?
- Target user group 1
- Target user group 2

### Why Is This Important?
Explain the impact and significance of solving this problem.

## Current Solutions
What existing solutions are available?

### Their Limitations
- Limitation 1
- Limitation 2

## Our Approach
How does your idea solve this problem differently or better?

## Expected Impact
What change will this solution create?
`;
  }

  private getSearchTemplate(): string {
    return `# Search Keywords

*This file is automatically updated based on user interactions and content analysis.*

## Primary Keywords
- keyword1
- keyword2
- keyword3

## Secondary Keywords
- related term 1
- related term 2

## Tags
- tag1
- tag2

## Related Concepts
- concept1
- concept2

---
*Last updated: ${new Date().toISOString()}*
`;
  }

  private getMethodologyTemplate(): string {
    return `# Research Methodology

## Research Approach
Describe your overall research strategy.

## Data Collection
How will you gather information?

### Primary Sources
- Source type 1
- Source type 2

### Secondary Sources
- Literature review
- Existing datasets

## Analysis Methods
How will you analyze the collected data?

## Timeline
Research phases and milestones.
`;
  }

  private getReferencesTemplate(): string {
    return `# References

## Academic Papers
1. Author, A. (Year). Title of paper. Journal Name.

## Books
1. Author, A. (Year). Book Title. Publisher.

## Online Resources
1. Website Name. (Date). Article Title. URL

## Related Projects
1. Project Name - Brief description

## Tools and Datasets
1. Tool/Dataset Name - Description and source
`;
  }

  private getArchitectureTemplate(): string {
    return `# Technical Architecture

## System Overview
High-level description of the system architecture.

## Components
### Frontend
- Technology stack
- Key components

### Backend
- Technology stack
- API design

### Database
- Database choice
- Schema design

### Infrastructure
- Hosting requirements
- Scalability considerations

## Data Flow
Describe how data moves through the system.

## Security Considerations
Key security requirements and implementations.
`;
  }

  private getRequirementsTemplate(): string {
    return `# Technical Requirements

## Functional Requirements
What the system must do.

### Core Features
1. Requirement 1
2. Requirement 2

### User Stories
- As a [user type], I want [goal] so that [benefit]

## Non-Functional Requirements
How the system should perform.

### Performance
- Response time requirements
- Throughput expectations

### Scalability
- Expected user load
- Growth projections

### Security
- Authentication requirements
- Data protection needs

## Technical Constraints
- Technology limitations
- Resource constraints
- Compatibility requirements
`;
  }

  /**
   * Get file version history
   */
  async getFileHistory(ideaId: string, filePath: string): Promise<FileVersion[]> {
    try {
      // Check if the file exists first
      const fullPath = this.getFilePath(ideaId, filePath);
      if (!(await fs.pathExists(fullPath))) {
        throw new AppError('File not found', 404);
      }

      const versionsPath = path.join(this.getRepositoryPath(ideaId), '.versions', 'versions.json');

      if (!(await fs.pathExists(versionsPath))) {
        return [];
      }

      const versionsData = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      const versions = versionsData.files?.[filePath]?.versions || [];

      // Parse timestamp strings back to Date objects and sort by timestamp (newest first)
      return versions
        .map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp),
        }))
        .sort((a: FileVersion, b: FileVersion) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.warn(`Failed to get file history for ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Get specific version content
   */
  async getFileVersionContent(
    ideaId: string,
    filePath: string,
    versionId: string
  ): Promise<string> {
    try {
      const versions = await this.getFileHistory(ideaId, filePath);
      const version = versions.find((v) => v.id === versionId);

      if (!version?.backupPath) {
        throw new AppError('Version not found', 404);
      }

      const backupPath = path.join(this.getRepositoryPath(ideaId), '.versions', version.backupPath);
      return await fs.readFile(backupPath, 'utf8');
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get version content', 500);
    }
  }

  /**
   * Restore file to specific version
   */
  async restoreFileVersion(ideaId: string, filePath: string, versionId: string): Promise<void> {
    try {
      const versionContent = await this.getFileVersionContent(ideaId, filePath, versionId);
      await this.updateFile(ideaId, filePath, versionContent);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to restore file version', 500);
    }
  }

  /**
   * Validate file type against allowed extensions
   */
  private validateFileType(filePath: string): void {
    const ext = path.extname(filePath).toLowerCase();
    if (ext && !this.allowedExtensions.includes(ext)) {
      throw new AppError(`File type ${ext} not allowed`, 400);
    }
  }

  /**
   * Create backup of current file before update
   */
  private async createFileBackup(ideaId: string, filePath: string): Promise<string> {
    try {
      const originalPath = this.getFilePath(ideaId, filePath);
      const versionsDir = path.join(this.getRepositoryPath(ideaId), '.versions');

      // Ensure versions directory exists
      await fs.ensureDir(versionsDir);

      // Create backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = path.extname(filePath);
      const basename = path.basename(filePath, ext);
      const backupName = `${basename}_${timestamp}${ext}`;
      const backupPath = path.join(versionsDir, backupName);

      // Copy file to versions directory
      await fs.copy(originalPath, backupPath);

      return backupName;
    } catch (error) {
      console.warn(`Failed to create backup for ${filePath}:`, error);
      throw new AppError('Failed to create file backup', 500);
    }
  }

  /**
   * Record file version in metadata
   */
  private async recordFileVersion(
    ideaId: string,
    filePath: string,
    version: FileVersion
  ): Promise<void> {
    try {
      const versionsPath = path.join(this.getRepositoryPath(ideaId), '.versions', 'versions.json');

      let versionsData: any = { files: {} };
      if (await fs.pathExists(versionsPath)) {
        versionsData = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      }

      // Initialize file versions if not exists
      if (!versionsData.files[filePath]) {
        versionsData.files[filePath] = { versions: [] };
      }

      // Add new version (backupPath is already provided if this was an update)
      versionsData.files[filePath].versions.push(version);
      versionsData.lastUpdated = new Date().toISOString();

      // Write updated metadata
      await fs.writeFile(versionsPath, JSON.stringify(versionsData, null, 2), 'utf8');
    } catch (error) {
      console.warn(`Failed to record file version:`, error);
      // Don't throw - version recording failure shouldn't prevent file updates
    }
  }

  /**
   * Cleanup old versions to prevent excessive storage
   */
  private async cleanupOldVersions(
    ideaId: string,
    filePath: string,
    maxVersions: number = 10
  ): Promise<void> {
    try {
      const versionsPath = path.join(this.getRepositoryPath(ideaId), '.versions', 'versions.json');

      if (!(await fs.pathExists(versionsPath))) {
        return;
      }

      const versionsData = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      const fileVersions = versionsData.files?.[filePath]?.versions;

      if (!fileVersions || fileVersions.length <= maxVersions) {
        return;
      }

      // Remove oldest versions
      const versionsToRemove = fileVersions.splice(0, fileVersions.length - maxVersions);

      // Delete backup files
      for (const version of versionsToRemove) {
        if (version.backupPath) {
          const backupPath = path.join(
            this.getRepositoryPath(ideaId),
            '.versions',
            version.backupPath
          );
          try {
            await fs.remove(backupPath);
          } catch (error) {
            console.warn(`Failed to remove old backup ${version.backupPath}:`, error);
          }
        }
      }

      // Update metadata
      await fs.writeFile(versionsPath, JSON.stringify(versionsData, null, 2), 'utf8');
    } catch (error) {
      console.warn(`Failed to cleanup old versions:`, error);
      // Don't throw - cleanup failure shouldn't prevent file operations
    }
  }
}
