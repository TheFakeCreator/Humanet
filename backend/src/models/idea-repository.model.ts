import { Schema, model, Document, Types } from 'mongoose';

// Enhanced Idea model with file system capabilities
export interface IIdeaFile extends Document {
  ideaId: Types.ObjectId;
  fileName: string;
  filePath: string;
  fileType: 'markdown' | 'image' | 'diagram' | 'code' | 'document';
  content?: string; // For text-based files
  fileUrl?: string; // For binary files (images, etc.)
  fileSize: number;
  mimeType: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const IdeaFileSchema = new Schema<IIdeaFile>({
  ideaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  filePath: {
    type: String,
    required: true,
    // e.g., "/ideas/507f1f77bcf86cd799439011/README.md"
  },
  fileType: {
    type: String,
    enum: ['markdown', 'image', 'diagram', 'code', 'document'],
    required: true
  },
  content: {
    type: String,
    // Store text content directly for markdown, code files
  },
  fileUrl: {
    type: String,
    // Store URL for binary files (images, PDFs, etc.)
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Enhanced Idea model with repository structure
export interface IIdeaRepository extends Document {
  ideaId: Types.ObjectId;
  structure: {
    folders: Array<{
      name: string;
      path: string;
      parentPath?: string;
    }>;
    files: Array<{
      name: string;
      path: string;
      fileId: Types.ObjectId;
    }>;
  };
  defaultBranch: string;
  branches: Array<{
    name: string;
    lastCommit: string;
    createdAt: Date;
  }>;
  forks: Array<{
    forkedBy: Types.ObjectId;
    forkedAt: Date;
    forkId: Types.ObjectId;
  }>;
}

const IdeaRepositorySchema = new Schema<IIdeaRepository>({
  ideaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
    unique: true
  },
  structure: {
    folders: [{
      name: String,
      path: String,
      parentPath: String
    }],
    files: [{
      name: String,
      path: String,
      fileId: {
        type: Schema.Types.ObjectId,
        ref: 'IdeaFile'
      }
    }]
  },
  defaultBranch: {
    type: String,
    default: 'main'
  },
  branches: [{
    name: String,
    lastCommit: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  forks: [{
    forkedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    forkedAt: {
      type: Date,
      default: Date.now
    },
    forkId: {
      type: Schema.Types.ObjectId,
      ref: 'Idea'
    }
  }]
}, {
  timestamps: true
});

export const IdeaFile = model<IIdeaFile>('IdeaFile', IdeaFileSchema);
export const IdeaRepository = model<IIdeaRepository>('IdeaRepository', IdeaRepositorySchema);
