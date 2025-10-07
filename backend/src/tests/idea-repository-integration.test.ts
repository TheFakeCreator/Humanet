import mongoose, { Types } from 'mongoose';
import { IdeaRepositoryService } from '../services/idea-repository.service.js';
import { IdeaModel } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';
import fs from 'fs-extra';
import path from 'path';

describe('IdeaRepositoryService Integration', () => {
  let repositoryService: IdeaRepositoryService;
  let testIdeaId: string;

  beforeAll(async () => {
    const uri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/humanet_test';
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    repositoryService = new IdeaRepositoryService();

    // Clean up any existing test data
    await IdeaModel.deleteMany({});

    // Create a test idea
    const testIdea = await IdeaModel.create({
      title: 'Test Idea for Repository',
      description: 'This is a test idea for repository integration testing',
      tags: ['test', 'repository'],
      domain: ['technology'],
      author: new mongoose.Types.ObjectId(),
      upvotes: 0,
      commentCount: 0,
      viewCount: 0,
      implementationStatus: 'idea',
      visibility: 'public',
    });

    testIdeaId = (testIdea._id as Types.ObjectId).toString();
  });

  afterEach(async () => {
    // Clean up test repositories
    const testRepoPath = path.join(process.cwd(), 'storage', 'ideas', testIdeaId);
    if (await fs.pathExists(testRepoPath)) {
      await fs.remove(testRepoPath);
    }

    // Clean up database
    await IdeaModel.deleteMany({});
  });

  it('should create repository and update idea record', async () => {
    // Create repository
    await repositoryService.createIdeaRepository(testIdeaId, 'basic');

    // Check idea record was updated
    const updatedIdea = await IdeaModel.findById(testIdeaId);
    expect(updatedIdea?.hasRepository).toBe(true);
    expect(updatedIdea?.repositoryTemplate).toBe('basic');
    expect(updatedIdea?.repositoryCreated).toBeDefined();
    expect(updatedIdea?.fileCount).toBe(5); // basic template has 5 files

    // Check repository exists in filesystem
    const repoPath = path.join(process.cwd(), 'storage', 'ideas', testIdeaId, '.humanet');
    expect(await fs.pathExists(repoPath)).toBe(true);
  });

  it('should get repository overview', async () => {
    // Create repository first
    await repositoryService.createIdeaRepository(testIdeaId, 'research');

    // Get overview
    const overview = await repositoryService.getRepositoryOverview(testIdeaId);

    expect(overview.hasRepository).toBe(true);
    expect(overview.template).toBe('research');
    expect(overview.stats).toBeDefined();
    expect(overview.stats?.fileCount).toBeGreaterThan(0);
    expect(overview.structure).toBeDefined();
  });

  it('should sync idea content with repository files', async () => {
    // Create repository
    await repositoryService.createIdeaRepository(testIdeaId, 'basic');

    // Sync content
    await repositoryService.syncIdeaWithRepository(testIdeaId);

    // Check if idea.md was updated with current data
    const ideaMdPath = path.join(
      process.cwd(),
      'storage',
      'ideas',
      testIdeaId,
      '.humanet',
      'idea.md'
    );
    const content = await fs.readFile(ideaMdPath, 'utf-8');

    expect(content).toContain('Test Idea for Repository');
    expect(content).toContain('test, repository');
    expect(content).toContain('technology');
  });

  it('should delete repository and update idea record', async () => {
    // Create repository first
    await repositoryService.createIdeaRepository(testIdeaId, 'basic');

    // Delete repository
    await repositoryService.deleteIdeaRepository(testIdeaId);

    // Check idea record was updated
    const updatedIdea = await IdeaModel.findById(testIdeaId);
    expect(updatedIdea?.hasRepository).toBe(false);
    expect(updatedIdea?.fileCount).toBe(0);
    expect(updatedIdea?.repositorySize).toBe(0);

    // Check repository was removed from filesystem
    const repoPath = path.join(process.cwd(), 'storage', 'ideas', testIdeaId);
    expect(await fs.pathExists(repoPath)).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    // Try to create repository for non-existent idea
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(repositoryService.createIdeaRepository(fakeId, 'basic')).rejects.toThrow(AppError);
  });

  it('should prevent duplicate repository creation', async () => {
    // Create repository
    await repositoryService.createIdeaRepository(testIdeaId, 'basic');

    // Try to create again
    await expect(repositoryService.createIdeaRepository(testIdeaId, 'basic')).rejects.toThrow(
      'Repository already exists'
    );
  });
});
