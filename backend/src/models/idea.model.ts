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

  // Ownership and Adoption System
  ownershipType: 'self_maintained' | 'seeking_adopter'; // Creator's intent
  currentMaintainer?: Types.ObjectId; // Current maintainer (initially author)
  originalCreator: Types.ObjectId; // Always preserved, non-editable
  adoptionStatus: 'available' | 'pending' | 'adopted' | 'not_available'; // Adoption state
  adoptionRequests: Types.ObjectId[]; // Active adoption requests
  pendingAdoption?: {
    adopterId: Types.ObjectId;
    requestedAt: Date;
    approvedAt?: Date;
    message?: string;
  };
  adoptionHistory: {
    previousMaintainer: Types.ObjectId;
    newMaintainer: Types.ObjectId;
    transferredAt: Date;
    reason: string;
  }[];

  // Licensing
  license: {
    type:
      | 'MIT'
      | 'Apache-2.0'
      | 'GPL-3.0'
      | 'BSD-3-Clause'
      | 'CC-BY-4.0'
      | 'CC-BY-SA-4.0'
      | 'custom';
    customText?: string; // For custom licenses
    allowCommercialUse: boolean;
    requireAttribution: boolean;
  };

  // Democratic voting for disputed adoptions
  activeVoting?: {
    candidateRequestIds: Types.ObjectId[]; // Adoption request IDs competing for adoption
    votes: {
      voterId: Types.ObjectId;
      candidateRequestId: Types.ObjectId;
      timestamp: Date;
      supportingReason?: string;
    }[];
    votingEndsAt: Date;
    startedAt: Date;
    description: string;
  };

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

    // Ownership and Adoption System
    ownershipType: {
      type: String,
      enum: ['self_maintained', 'seeking_adopter'],
      required: true,
      default: 'self_maintained',
    },
    currentMaintainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    originalCreator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true, // Cannot be changed after creation
    },
    adoptionStatus: {
      type: String,
      enum: ['available', 'pending', 'adopted', 'not_available'],
      default: function (this: IIdea) {
        return this.ownershipType === 'seeking_adopter' ? 'available' : 'not_available';
      },
    },
    adoptionRequests: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'AdoptionRequest',
    },
    pendingAdoption: {
      adopterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      requestedAt: {
        type: Date,
      },
      approvedAt: {
        type: Date,
      },
      message: {
        type: String,
        maxlength: 500,
      },
    },
    adoptionHistory: [
      {
        previousMaintainer: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        newMaintainer: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        transferredAt: {
          type: Date,
          default: Date.now,
        },
        reason: {
          type: String,
          required: true,
          maxlength: 200,
        },
      },
    ],

    // Licensing
    license: {
      type: {
        type: String,
        enum: [
          'MIT',
          'Apache-2.0',
          'GPL-3.0',
          'BSD-3-Clause',
          'CC-BY-4.0',
          'CC-BY-SA-4.0',
          'custom',
        ],
        required: true,
        default: 'MIT',
      },
      customText: {
        type: String,
        maxlength: 5000,
      },
      allowCommercialUse: {
        type: Boolean,
        required: true,
        default: true,
      },
      requireAttribution: {
        type: Boolean,
        required: true,
        default: true,
      },
    },

    // Democratic voting for disputed adoptions
    activeVoting: {
      candidateRequestIds: {
        type: [Schema.Types.ObjectId],
        ref: 'AdoptionRequest',
      },
      votes: [
        {
          voterId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          candidateRequestId: {
            type: Schema.Types.ObjectId,
            ref: 'AdoptionRequest',
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          supportingReason: {
            type: String,
            maxlength: 500,
          },
        },
      ],
      votingEndsAt: {
        type: Date,
      },
      startedAt: {
        type: Date,
      },
      description: {
        type: String,
        maxlength: 500,
      },
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

// New indexes for ownership and adoption system
IdeaSchema.index({ ownershipType: 1, adoptionStatus: 1 });
IdeaSchema.index({ currentMaintainer: 1 });
IdeaSchema.index({ originalCreator: 1 });
IdeaSchema.index({ 'activeVoting.votingEndsAt': 1 });
IdeaSchema.index({ 'license.type': 1 });

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
  // Original creator can always edit until adoption is complete
  if (this.originalCreator && this.originalCreator.equals(userId)) {
    return this.adoptionStatus !== 'adopted';
  }
  // Current maintainer can edit if adoption is complete
  if (this.currentMaintainer && this.currentMaintainer.equals(userId)) {
    return this.adoptionStatus === 'adopted';
  }
  // Collaborators can edit based on maintainer's permission
  return this.collaborators.includes(userId);
};

IdeaSchema.methods.canManage = function (userId: Types.ObjectId) {
  // Only original creator can manage adoption process
  return this.originalCreator && this.originalCreator.equals(userId);
};

// Pre-save middleware to calculate depth, fork path, and ownership
IdeaSchema.pre<IIdea>('save', async function (next) {
  // Set original creator and current maintainer for new ideas
  if (this.isNew) {
    if (!this.originalCreator) {
      this.originalCreator = this.author;
    }
    if (!this.currentMaintainer) {
      this.currentMaintainer = this.author;
    }

    // Set adoption status based on ownership type
    if (this.ownershipType === 'seeking_adopter') {
      this.adoptionStatus = 'available';
    } else {
      this.adoptionStatus = 'not_available';
    }
  }

  // Handle fork path and depth calculation
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
