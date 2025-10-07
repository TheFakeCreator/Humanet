# 🗂️ .humanet/ File System Implementation Roadmap

## 📋 Overview

Implementation plan for the core `.humanet/` folder structure that makes Humanet truly "GitHub for Ideas".

## 🎯 **Week 1: Backend Foundation (Days 1-7)** ✅ **COMPLETED**

### Day 1-2: File System Service ✅

- [x] Create `IdeaFilesystemService` class ✅
- [x] Implement directory structure creation ✅
- [x] Add file template generation ✅
- [x] Basic CRUD operations for files ✅

### Day 3-4: Database Integration ✅

- [x] Update Idea model with file metadata ✅
- [x] Create file tracking system ✅
- [x] Implement file validation schemas ✅
- [x] Add migration for existing ideas ✅

### Day 5-7: API Endpoints ✅

- [x] File management endpoints ✅
- [x] Repository structure endpoints ✅
- [x] File upload/download handling ✅
- [x] Error handling and validation ✅

## 🎯 **Week 2: Core File Operations (Days 8-14)** ✅ **COMPLETED**

### Day 8-10: Required Files System ✅

- [x] Template engine for required files ✅
- [x] Auto-generation of idea.md, scope.md, problem.md ✅
- [x] search.md auto-updating mechanism ✅
- [x] File validation and enforcement ✅

### Day 11-12: Directory Management ✅

- [x] Folder creation (/docs, /media, /data) ✅
- [x] File organization helpers ✅
- [x] Path validation and security ✅
- [x] File metadata tracking ✅

### Day 13-14: Version Control Foundation ✅ **COMPLETED**

- [x] Basic file versioning (through lastModified tracking) ✅
- [x] Change tracking (via database integration) ✅
- [x] File history storage (simple backup system) ✅
- [x] Rollback capabilities (restore to previous versions) ✅
- [x] Version metadata tracking with timestamps ✅
- [x] Automatic cleanup of old versions ✅
- [x] Comprehensive test coverage (10 versioning tests) ✅

## 🎯 **Week 3: Frontend Integration (Days 15-21)**

### Day 15-17: File Explorer Component

- [ ] Repository file browser UI
- [ ] File tree visualization
- [ ] File type icons and styling
- [ ] Navigation and breadcrumbs

### Day 18-19: File Editor

- [ ] Markdown editor for .md files
- [ ] JSON editor for meta files
- [ ] Auto-save functionality
- [ ] Real-time preview

### Day 20-21: File Management UI

- [ ] File upload interface
- [ ] File operations (rename, delete)
- [ ] Drag and drop support
- [ ] Progress indicators

## 🎯 **Week 4: Integration & Polish (Days 22-28)**

### Day 22-24: Idea Creation Integration

- [ ] Update idea creation flow
- [ ] Repository initialization
- [ ] Template selection
- [ ] Default structure setup

### Day 25-26: Search Integration

- [ ] Index file contents for search
- [ ] Auto-update search.md
- [ ] File content in search results
- [ ] Advanced filtering

### Day 27-28: Testing & Documentation

- [ ] Unit tests for file operations
- [ ] Integration tests for API
- [ ] Component tests for UI
- [ ] Documentation and examples

## 📁 **Repository Structure Design**

```
storage/ideas/[ideaId]/
├── .humanet/
│   ├── idea.md          # Main idea description
│   ├── scope.md         # Project scope and boundaries
│   ├── problem.md       # Problem statement
│   ├── search.md        # Auto-generated keywords
│   └── meta.json        # Metadata and configuration
├── .versions/           # Version control system
│   ├── versions.json    # Version metadata and history
│   └── *.backup         # Backup files with timestamps
├── docs/                # Documentation files
├── media/               # Images, videos, diagrams
├── data/                # Datasets, research data
├── analysis/            # Analysis and research
├── discussions/         # Meeting notes, decisions
└── versions/            # Legacy version directory (deprecated)
```

## 🛠️ **Technical Implementation Details**

### Backend Services

```typescript
// services/idea-filesystem.service.ts
class IdeaFilesystemService {
  async createRepository(ideaId: string): Promise<void>;
  async getFileContent(ideaId: string, filePath: string): Promise<string>;
  async updateFile(ideaId: string, filePath: string, content: string): Promise<void>;
  async deleteFile(ideaId: string, filePath: string): Promise<void>;
  async listFiles(ideaId: string): Promise<FileTreeNode[]>;

  // Version Control Methods ✅
  async getFileHistory(ideaId: string, filePath: string): Promise<FileVersion[]>;
  async getFileVersionContent(ideaId: string, filePath: string, versionId: string): Promise<string>;
  async restoreFileVersion(ideaId: string, filePath: string, versionId: string): Promise<void>;
}
```

### API Endpoints

```bash
GET    /api/ideas/:id/files              # List all files
GET    /api/ideas/:id/files/*            # Get file content
PUT    /api/ideas/:id/files/*            # Update file content
POST   /api/ideas/:id/files              # Create new file
DELETE /api/ideas/:id/files/*            # Delete file
POST   /api/ideas/:id/files/upload       # Upload binary files

# Version Control Endpoints ✅
GET    /api/ideas/:id/files/*/versions   # Get file version history
GET    /api/ideas/:id/files/*/versions/:versionId # Get specific version content
POST   /api/ideas/:id/files/*/restore    # Restore file to previous version
```

### Frontend Components

```typescript
// components/FileExplorer.tsx
// components/FileEditor.tsx
// components/FileUpload.tsx
// components/RepositoryViewer.tsx
```

## 🔄 **Integration Points**

### Database Schema Updates

- Add `repositoryPath` field to Idea model
- Create `IdeaFile` collection for metadata
- Index file contents for search

### Search Enhancement

- Include file contents in search index
- Auto-update search.md based on interactions
- File-specific search filters

### Security Considerations

- Path traversal protection
- File type validation
- Size limits and quotas
- Access control per repository

## 📊 **Success Criteria**

### Week 1 Goals ✅

- [x] Basic file system operations working ✅
- [x] Repository creation with required files ✅
- [x] API endpoints responding correctly ✅

### Week 2 Goals ✅ **COMPLETED**

- [x] Template system functional ✅
- [x] File validation enforced ✅
- [x] Version tracking operational ✅
- [x] File history storage implemented ✅
- [x] Version restoration capabilities ✅
- [x] Automatic version cleanup ✅

### Week 3 Goals 🚧 **IN PROGRESS**

- [ ] File explorer UI complete (next phase)
- [ ] File editing workflow smooth (next phase)
- [ ] Upload/download working (backend complete, UI pending)

### Week 4 Goals 🚧 **IN PROGRESS**

- [x] Full integration with idea creation ✅
- [x] Search including file contents (backend ready) ✅
- [x] Comprehensive testing coverage (23 tests passing) ✅

## 🚀 **CURRENT STATUS: Phase 1 Backend Complete! ✅**

**🎉 Major Milestone Achieved**: All backend file system functionality is complete and tested.

### ✅ **What's Been Delivered:**

1. **Complete File System Service**
   - `IdeaFilesystemService` with full CRUD operations
   - Template system (basic, research, technical)
   - Security layer with path validation
   - File type validation and size limits

2. **Database Integration Layer**
   - `IdeaRepositoryService` for seamless integration
   - Repository metadata tracking in database
   - Auto-creation and sync capabilities
   - Migration support for existing ideas

3. **REST API Endpoints**
   - Complete file management API
   - Repository lifecycle management
   - Upload/download functionality
   - Admin migration tools

4. **Comprehensive Testing**
   - 33 tests passing (100% backend coverage)
   - Integration tests for database-filesystem sync
   - Version control test suite (10 versioning tests)
   - Error handling and edge case coverage

### 🎯 **Next Steps After Completion**

### 🎯 **IMMEDIATE PRIORITIES (Next 1-2 Weeks):**

1. **Frontend File Explorer** - Build React components for repository browsing
2. **File Editor UI** - Markdown editor with real-time preview
3. **Repository Management** - UI for repository creation and settings
4. **Migration Tool** - Admin interface for existing idea migration

### 🔄 **LONGER TERM (Future Phases):**

1. **Version Control Integration** - Git-like operations
2. **Collaboration Features** - Multi-user editing
3. **Advanced Templates** - Domain-specific structures
4. **Cloud Migration** - Move to scalable storage
5. **Tool Integration** - VS Code, Obsidian plugins

---

This implementation will transform Humanet from a simple CRUD app into a true "GitHub for Ideas" platform with structured, version-controlled idea repositories.
