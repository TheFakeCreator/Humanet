import fs from 'fs-extra';
import path from 'path';
import { IdeaFilesystemService, FileTreeNode } from '../services/idea-filesystem.service.js';

describe('IdeaFilesystemService', () => {
  let service: IdeaFilesystemService;
  const testBasePath = path.join(process.cwd(), 'test-storage');
  const testIdeaId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    // Set test environment
    process.env.STORAGE_PATH = testBasePath;
    service = new IdeaFilesystemService();

    // Clean up any existing test data
    await fs.remove(testBasePath);
  });

  afterEach(async () => {
    // Clean up test data
    await fs.remove(testBasePath);
    delete process.env.STORAGE_PATH;
  });

  describe('createRepository', () => {
    test('should create basic repository structure', async () => {
      await service.createRepository(testIdeaId, 'basic');

      const repositoryPath = path.join(testBasePath, testIdeaId);

      // Check directory structure
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, 'docs'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, 'media'))).toBe(true);

      // Check required files
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet', 'idea.md'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet', 'scope.md'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet', 'problem.md'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet', 'search.md'))).toBe(true);
      expect(await fs.pathExists(path.join(repositoryPath, '.humanet', 'meta.json'))).toBe(true);
    });

    test('should create research repository with additional files', async () => {
      await service.createRepository(testIdeaId, 'research');

      const humanetPath = path.join(testBasePath, testIdeaId, '.humanet');

      // Check research-specific files
      expect(await fs.pathExists(path.join(humanetPath, 'methodology.md'))).toBe(true);
      expect(await fs.pathExists(path.join(humanetPath, 'references.md'))).toBe(true);
    });

    test('should throw error if repository already exists', async () => {
      await service.createRepository(testIdeaId, 'basic');

      await expect(service.createRepository(testIdeaId, 'basic')).rejects.toThrow(
        'Repository already exists'
      );
    });
  });

  describe('file operations', () => {
    beforeEach(async () => {
      await service.createRepository(testIdeaId, 'basic');
    });

    test('should read file content', async () => {
      const content = await service.getFileContent(testIdeaId, '.humanet/idea.md');
      expect(content).toContain('# Idea Title');
    });

    test('should update file content', async () => {
      const newContent = '# Updated Idea\n\nThis is updated content.';
      await service.updateFile(testIdeaId, '.humanet/idea.md', newContent);

      const content = await service.getFileContent(testIdeaId, '.humanet/idea.md');
      expect(content).toBe(newContent);
    });

    test('should create new file', async () => {
      const content = '# New Document\n\nContent here.';
      await service.updateFile(testIdeaId, 'docs/new-doc.md', content);

      const readContent = await service.getFileContent(testIdeaId, 'docs/new-doc.md');
      expect(readContent).toBe(content);
    });

    test('should list files', async () => {
      const files = await service.listFiles(testIdeaId);

      const humanetFolder = files.find((f: FileTreeNode) => f.name === '.humanet');
      expect(humanetFolder).toBeDefined();
      expect(humanetFolder?.type).toBe('directory');

      const docsFolder = files.find((f: FileTreeNode) => f.name === 'docs');
      expect(docsFolder).toBeDefined();
      expect(docsFolder?.type).toBe('directory');
    });

    test('should prevent deletion of required files', async () => {
      await expect(service.deleteFile(testIdeaId, '.humanet/idea.md')).rejects.toThrow(
        'Cannot delete required file'
      );
    });

    test('should delete non-required files', async () => {
      // Create a file first
      await service.updateFile(testIdeaId, 'docs/temp.md', 'Temporary content');

      // Delete it
      await service.deleteFile(testIdeaId, 'docs/temp.md');

      // Verify it's gone
      await expect(service.getFileContent(testIdeaId, 'docs/temp.md')).rejects.toThrow(
        'File not found'
      );
    });
  });

  describe('security', () => {
    beforeEach(async () => {
      await service.createRepository(testIdeaId, 'basic');
    });

    test('should prevent directory traversal attacks', async () => {
      await expect(service.getFileContent(testIdeaId, '../../../etc/passwd')).rejects.toThrow();
    });

    test('should prevent accessing files outside repository', async () => {
      await expect(service.getFileContent(testIdeaId, '../../secrets.txt')).rejects.toThrow();
    });
  });

  describe('repository management', () => {
    test('should check if repository exists', async () => {
      expect(await service.repositoryExists(testIdeaId)).toBe(false);

      await service.createRepository(testIdeaId, 'basic');
      expect(await service.repositoryExists(testIdeaId)).toBe(true);
    });

    test('should delete repository', async () => {
      await service.createRepository(testIdeaId, 'basic');
      expect(await service.repositoryExists(testIdeaId)).toBe(true);

      await service.deleteRepository(testIdeaId);
      expect(await service.repositoryExists(testIdeaId)).toBe(false);
    });
  });
});
