# 🗂️ .humanet/ File System Implementation Roadmap

## 📋 Overview

Implementation plan for the core `.humanet/` folder structure that makes Humanet truly "GitHub for Ideas".

## 🎯 **Week 1: Backend Foundation (Days 1-7)**

### Day 1-2: File System Service

- [ ] Create `IdeaFilesystemService` class
- [ ] Implement directory structure creation
- [ ] Add file template generation
- [ ] Basic CRUD operations for files

### Day 3-4: Database Integration

- [ ] Update Idea model with file metadata
- [ ] Create file tracking system
- [ ] Implement file validation schemas
- [ ] Add migration for existing ideas

### Day 5-7: API Endpoints

- [ ] File management endpoints
- [ ] Repository structure endpoints
- [ ] File upload/download handling
- [ ] Error handling and validation

## 🎯 **Week 2: Core File Operations (Days 8-14)**

### Day 8-10: Required Files System

- [ ] Template engine for required files
- [ ] Auto-generation of idea.md, scope.md, problem.md
- [ ] search.md auto-updating mechanism
- [ ] File validation and enforcement

### Day 11-12: Directory Management

- [ ] Folder creation (/docs, /media, /data)
- [ ] File organization helpers
- [ ] Path validation and security
- [ ] File metadata tracking

### Day 13-14: Version Control Foundation

- [ ] Basic file versioning
- [ ] Change tracking
- [ ] File history storage
- [ ] Rollback capabilities

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
├── docs/                # Documentation files
├── media/               # Images, videos, diagrams
├── data/                # Datasets, research data
├── analysis/            # Analysis and research
├── discussions/         # Meeting notes, decisions
└── versions/            # Version history
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

### Week 1 Goals

- [ ] Basic file system operations working
- [ ] Repository creation with required files
- [ ] API endpoints responding correctly

### Week 2 Goals

- [ ] Template system functional
- [ ] File validation enforced
- [ ] Version tracking operational

### Week 3 Goals

- [ ] File explorer UI complete
- [ ] File editing workflow smooth
- [ ] Upload/download working

### Week 4 Goals

- [ ] Full integration with idea creation
- [ ] Search including file contents
- [ ] Comprehensive testing coverage

## 🚀 **Next Steps After Completion**

1. **Version Control Integration** - Git-like operations
2. **Collaboration Features** - Multi-user editing
3. **Advanced Templates** - Domain-specific structures
4. **Cloud Migration** - Move to scalable storage
5. **Tool Integration** - VS Code, Obsidian plugins

---

This implementation will transform Humanet from a simple CRUD app into a true "GitHub for Ideas" platform with structured, version-controlled idea repositories.
