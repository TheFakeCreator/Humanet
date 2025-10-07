import { IdeaFilesystemService } from '../services/idea-filesystem.service.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import type { FileVersion } from '../services/idea-filesystem.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('IdeaFilesystemService - Versioning', () => {
  let filesystemService: IdeaFilesystemService;

  const getTestIdeaId = () => {
    return `507f1f77bcf86cd7994${Date.now().toString().slice(-6)}`;
  };
  const testFilePath = 'src/main.js';

  beforeAll(async () => {
    filesystemService = new IdeaFilesystemService();
  });

  describe('File Versioning', () => {
    it('should create initial file without version history', async () => {
      const testIdeaId = getTestIdeaId();
      const testRepoPath = join(__dirname, '../../.humanet', testIdeaId);

      try {
        await filesystemService.createRepository(testIdeaId);

        const initialContent = 'console.log("Hello, World!");';

        await filesystemService.updateFile(testIdeaId, testFilePath, initialContent);

        const content = await filesystemService.getFileContent(testIdeaId, testFilePath);
        expect(content).toBe(initialContent);

        // No version history for initial file
        const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
        expect(history).toHaveLength(0);
      } finally {
        // Cleanup
        if (await fs.pathExists(testRepoPath)) {
          await fs.remove(testRepoPath);
        }
      }
    });

    it('should create version history when updating existing file', async () => {
      const testIdeaId = getTestIdeaId();
      const testRepoPath = join(__dirname, '../../.humanet', testIdeaId);

      try {
        await filesystemService.createRepository(testIdeaId);

        const initialContent = 'console.log("Hello, World!");';
        const updatedContent = 'console.log("Hello, Universe!");';

        // Create initial file
        await filesystemService.updateFile(testIdeaId, testFilePath, initialContent);

        // Update file (should create version history)
        await filesystemService.updateFile(testIdeaId, testFilePath, updatedContent);

        // Check current content
        const content = await filesystemService.getFileContent(testIdeaId, testFilePath);
        expect(content).toBe(updatedContent);

        // Check version history
        const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
        expect(history).toHaveLength(1);
        expect(history[0].operation).toBe('updated');
        expect(history[0].size).toBe(initialContent.length); // Size of backed up content
        expect(history[0].timestamp).toBeInstanceOf(Date);
        expect(history[0].backupPath).toBeDefined();

        // Check backed up content
        const backupContent = await filesystemService.getFileVersionContent(
          testIdeaId,
          testFilePath,
          history[0].id
        );
        expect(backupContent).toBe(initialContent);
      } finally {
        // Cleanup
        if (await fs.pathExists(testRepoPath)) {
          await fs.remove(testRepoPath);
        }
      }
    });

    it('should maintain multiple versions with correct order', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const versions = ['Version 1', 'Version 2 - Updated', 'Version 3 - Final'];

      // Create initial file
      await filesystemService.updateFile(testIdeaId, testFilePath, versions[0]);

      // Create subsequent versions
      for (let i = 1; i < versions.length; i++) {
        await filesystemService.updateFile(testIdeaId, testFilePath, versions[i]);
      }

      // Check current content is latest
      const content = await filesystemService.getFileContent(testIdeaId, testFilePath);
      expect(content).toBe(versions[2]);

      // Check version history (should be in reverse chronological order)
      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      expect(history).toHaveLength(2); // First 2 versions should be in history

      // Most recent backup should be first (versions[1])
      const firstBackupContent = await filesystemService.getFileVersionContent(
        testIdeaId,
        testFilePath,
        history[0].id
      );
      expect(firstBackupContent).toBe(versions[1]);

      // Oldest backup should be last (versions[0])
      const secondBackupContent = await filesystemService.getFileVersionContent(
        testIdeaId,
        testFilePath,
        history[1].id
      );
      expect(secondBackupContent).toBe(versions[0]);
    });

    it('should retrieve specific version content', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const originalContent = 'Original content';
      const updatedContent = 'Updated content';

      // Create and update file
      await filesystemService.updateFile(testIdeaId, testFilePath, originalContent);
      await filesystemService.updateFile(testIdeaId, testFilePath, updatedContent);

      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      const versionId = history[0].id;

      const versionContent = await filesystemService.getFileVersionContent(
        testIdeaId,
        testFilePath,
        versionId
      );
      expect(versionContent).toBe(originalContent); // backup contains the original content
    });

    it('should restore file to previous version', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const originalContent = 'Original content for restoration';
      const updatedContent = 'Updated content';

      // Create and update file
      await filesystemService.updateFile(testIdeaId, testFilePath, originalContent);
      await filesystemService.updateFile(testIdeaId, testFilePath, updatedContent);

      // Get version to restore
      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      const versionToRestore = history.find((v: FileVersion) => {
        // Need to check the backup content since FileVersion doesn't store content directly
        return true; // We'll check by getting the first version
      });
      expect(versionToRestore).toBeDefined();

      // Restore to previous version
      await filesystemService.restoreFileVersion(testIdeaId, testFilePath, history[0].id);

      // Check that file content is restored
      const restoredContent = await filesystemService.getFileContent(testIdeaId, testFilePath);
      expect(restoredContent).toBe(originalContent);

      // Check that restoration created a new version entry
      const newHistory = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      expect(newHistory.length).toBeGreaterThan(history.length);
    });

    it('should handle version cleanup for old versions', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const maxVersions = 5; // Default from our implementation

      // Create more versions than the limit
      for (let i = 0; i < maxVersions + 2; i++) {
        await filesystemService.updateFile(testIdeaId, testFilePath, `Version ${i + 1}`);
      }

      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      expect(history.length).toBeLessThanOrEqual(maxVersions);
    });

    it('should handle errors gracefully for non-existent files', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const nonExistentFile = 'does-not-exist.js';

      await expect(filesystemService.getFileHistory(testIdeaId, nonExistentFile)).rejects.toThrow(
        'File not found'
      );

      await expect(
        filesystemService.getFileVersionContent(testIdeaId, nonExistentFile, 'fake-id')
      ).rejects.toThrow('File not found');

      await expect(
        filesystemService.restoreFileVersion(testIdeaId, nonExistentFile, 'fake-id')
      ).rejects.toThrow('File not found');
    });

    it('should handle invalid version IDs gracefully', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const content = 'Test content';
      await filesystemService.updateFile(testIdeaId, testFilePath, content);

      await expect(
        filesystemService.getFileVersionContent(testIdeaId, testFilePath, 'invalid-version-id')
      ).rejects.toThrow('Version not found');

      await expect(
        filesystemService.restoreFileVersion(testIdeaId, testFilePath, 'invalid-version-id')
      ).rejects.toThrow('Version not found');
    });
  });

  describe('Version Metadata', () => {
    it('should include correct metadata for versions', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const content1 = 'First version with some content';
      const content2 = 'Second version with different content';

      await filesystemService.updateFile(testIdeaId, testFilePath, content1);
      await filesystemService.updateFile(testIdeaId, testFilePath, content2);

      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);
      const version = history[0];

      expect(version.id).toBeDefined();
      expect(typeof version.id).toBe('string');
      expect(version.timestamp).toBeInstanceOf(Date);
      expect(version.size).toBe(content1.length); // backup size (original content that was backed up)
      expect(version.operation).toBe('updated');
      expect(version.backupPath).toBeDefined();
    });

    it('should maintain chronological order in version history', async () => {
      const testIdeaId = getTestIdeaId();
      await filesystemService.createRepository(testIdeaId);

      const versions = ['V1', 'V2', 'V3'];
      const timestamps: Date[] = [];

      for (const version of versions) {
        await filesystemService.updateFile(testIdeaId, testFilePath, version);
        timestamps.push(new Date());
        // Small delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const history = await filesystemService.getFileHistory(testIdeaId, testFilePath);

      // History should be in reverse chronological order (newest first)
      for (let i = 0; i < history.length - 1; i++) {
        expect(history[i].timestamp.getTime()).toBeGreaterThan(history[i + 1].timestamp.getTime());
      }
    });
  });
});
