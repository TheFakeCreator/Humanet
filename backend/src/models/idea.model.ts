import { Schema, model, Document, Types } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  tags: string[];
  domain: string[];
  author: Types.ObjectId;
  parentId?: Types.ObjectId | null;
  upvotes: number;
  upvoters: Types.ObjectId[];
  forkCount: number;

  // Enhanced metadata
  status: 'draft' | 'published' | 'archived' | 'under_review' | 'flagged';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;

  // Content enhancements
  summary?: string; // Short elevator pitch
  coverImage?: string; // Hero image URL
  attachments: string[]; // File URLs, documents, links

  // Interaction stats
  viewCount: number;
  commentCount: number;
  shareCount: number;
  bookmarkedBy: Types.ObjectId[];

  // Family tree metadata
  depth: number; // How deep in the fork tree (0 = root idea)
  rootId?: Types.ObjectId; // Original root idea
  forkPath: Types.ObjectId[]; // Path from root to this idea

  // Moderation
  flagCount: number;
  flagReasons: string[];
  moderatedBy?: Types.ObjectId;
  moderationNotes?: string;

  // Collaboration
  collaborators: Types.ObjectId[]; // Users who can edit
  editHistory: {
    editedBy: Types.ObjectId;
    editedAt: Date;
    changes: string;
  }[];

  // Implementation tracking
  implementationStatus: 'idea' | 'planning' | 'in_progress' | 'completed' | 'abandoned';
  githubRepo?: string;
  liveDemo?: string;

  // Repository integration
  hasRepository: boolean; // Whether .humanet repository exists
  repositoryTemplate: 'basic' | 'research' | 'technical'; // Template used
  repositoryCreated?: Date; // When repository was created
  lastRepositoryUpdate?: Date; // Last file system update
  fileCount: number; // Number of files in repository
  repositorySize: number; // Total size in bytes

  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    domain: {
      type: [String],
      default: [],
      validate: {
        validator: function (domains: string[]) {
          return domains.length <= 5;
        },
        message: 'Cannot have more than 5 domains',
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      default: null,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvoters: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    forkCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Enhanced metadata
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'under_review', 'flagged'],
      default: 'published',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Content enhancements
    summary: {
      type: String,
      maxlength: 280,
      trim: true,
    },
    coverImage: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Cover image must be a valid image URL',
      },
    },
    attachments: {
      type: [String],
      default: [],
      validate: {
        validator: function (attachments: string[]) {
          return attachments.length <= 5;
        },
        message: 'Cannot have more than 5 attachments',
      },
    },

    // Interaction stats
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarkedBy: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },

    // Family tree metadata
    depth: {
      type: Number,
      default: 0,
      min: 0,
      max: 10, // Prevent infinite nesting
    },
    rootId: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
    },
    forkPath: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Idea',
    },

    // Moderation
    flagCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    flagReasons: {
      type: [String],
      default: [],
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationNotes: {
      type: String,
      maxlength: 1000,
    },

    // Collaboration
    collaborators: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    editHistory: [
      {
        editedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        editedAt: {
          type: Date,
          default: Date.now,
        },
        changes: {
          type: String,
          required: true,
          maxlength: 500,
        },
      },
    ],

    // Implementation tracking
    implementationStatus: {
      type: String,
      enum: ['idea', 'planning', 'in_progress', 'completed', 'abandoned'],
      default: 'idea',
    },
    githubRepo: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(v);
        },
        message: 'GitHub repository must be a valid GitHub URL',
      },
    },
    liveDemo: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+$/.test(v);
        },
        message: 'Live demo must be a valid URL',
      },
    },

    // Repository integration
    hasRepository: {
      type: Boolean,
      default: false,
    },
    repositoryTemplate: {
      type: String,
      enum: ['basic', 'research', 'technical'],
      default: 'basic',
    },
    repositoryCreated: {
      type: Date,
    },
    lastRepositoryUpdate: {
      type: Date,
    },
    fileCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    repositorySize: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text search index
IdeaSchema.index(
  {
    title: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 10,
      description: 5,
      tags: 1,
    },
  }
);

// Other indexes
IdeaSchema.index({ author: 1 });
IdeaSchema.index({ parentId: 1 });
IdeaSchema.index({ upvotes: -1 });
IdeaSchema.index({ forkCount: -1 });
IdeaSchema.index({ createdAt: -1 });
IdeaSchema.index({ domain: 1 });
IdeaSchema.index({ tags: 1 });
IdeaSchema.index({ status: 1, visibility: 1 });
IdeaSchema.index({ featured: 1, upvotes: -1 });
IdeaSchema.index({ rootId: 1, depth: 1 });
IdeaSchema.index({ viewCount: -1 });
IdeaSchema.index({ implementationStatus: 1 });
IdeaSchema.index({ flagCount: 1 });

// Compound indexes for complex queries
IdeaSchema.index({ status: 1, visibility: 1, createdAt: -1 });
IdeaSchema.index({ author: 1, status: 1, createdAt: -1 });
IdeaSchema.index({ domain: 1, upvotes: -1, createdAt: -1 });

// Methods
IdeaSchema.methods.incrementView = function () {
  this.viewCount += 1;
  return this.save();
};

IdeaSchema.methods.addCollaborator = function (userId: Types.ObjectId) {
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
    return this.save();
  }
  return this;
};

IdeaSchema.methods.canEdit = function (userId: Types.ObjectId) {
  return this.author.equals(userId) || this.collaborators.includes(userId);
};

// Pre-save middleware to calculate depth and fork path
IdeaSchema.pre<IIdea>('save', async function (next) {
  if (this.isNew && this.parentId) {
    try {
      const parent = await IdeaModel.findById(this.parentId);
      if (parent) {
        this.depth = (parent.depth || 0) + 1;
        this.rootId = parent.rootId || (parent._id as Types.ObjectId);
        this.forkPath = [...(parent.forkPath || []), parent._id as Types.ObjectId];
      }
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

export const IdeaModel = model<IIdea>('Idea', IdeaSchema);
