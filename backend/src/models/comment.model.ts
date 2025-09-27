import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  ideaId: Types.ObjectId;
  authorId: Types.ObjectId;
  text: string;
  
  // Reply functionality
  parentCommentId?: Types.ObjectId | null; // For nested replies
  depth: number; // Nesting level (0 = top level)
  
  // Interaction stats
  upvotes: number;
  downvotes: number;
  upvoters: Types.ObjectId[];
  downvoters: Types.ObjectId[];
  
  // Status and moderation
  status: 'active' | 'edited' | 'deleted' | 'flagged' | 'hidden';
  editedAt?: Date;
  originalText?: string; // Store original before edits
  
  // Moderation
  flagCount: number;
  flagReasons: string[];
  moderatedBy?: Types.ObjectId;
  
  // Metadata
  mentions: Types.ObjectId[]; // @username mentions
  isAuthorOP: boolean; // Is comment author the original idea author?
  isPinned: boolean; // Pinned by idea author or moderator
  
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  ideaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 2000 // Increased for more detailed comments
  },
  
  // Reply functionality
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  depth: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 // Limit nesting to prevent infinite threads
  },
  
  // Interaction stats
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  upvoters: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  downvoters: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  
  // Status and moderation
  status: {
    type: String,
    enum: ['active', 'edited', 'deleted', 'flagged', 'hidden'],
    default: 'active'
  },
  editedAt: {
    type: Date
  },
  originalText: {
    type: String,
    maxlength: 2000
  },
  
  // Moderation
  flagCount: {
    type: Number,
    default: 0,
    min: 0
  },
  flagReasons: {
    type: [String],
    default: []
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Metadata
  mentions: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  isAuthorOP: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
CommentSchema.index({ ideaId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });
CommentSchema.index({ parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ status: 1, createdAt: -1 });
CommentSchema.index({ upvotes: -1 });
CommentSchema.index({ isPinned: 1, upvotes: -1 });
CommentSchema.index({ depth: 1 });
CommentSchema.index({ mentions: 1 });

// Compound indexes
CommentSchema.index({ ideaId: 1, parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ ideaId: 1, isPinned: 1, upvotes: -1, createdAt: -1 });

// Methods
CommentSchema.methods.upvote = function(userId: Types.ObjectId) {
  if (!this.upvoters.includes(userId)) {
    // Remove from downvoters if present
    const downvoteIndex = this.downvoters.indexOf(userId);
    if (downvoteIndex > -1) {
      this.downvoters.splice(downvoteIndex, 1);
      this.downvotes = Math.max(0, this.downvotes - 1);
    }
    
    this.upvoters.push(userId);
    this.upvotes += 1;
  } else {
    // Remove upvote
    const upvoteIndex = this.upvoters.indexOf(userId);
    this.upvoters.splice(upvoteIndex, 1);
    this.upvotes = Math.max(0, this.upvotes - 1);
  }
  return this.save();
};

CommentSchema.methods.downvote = function(userId: Types.ObjectId) {
  if (!this.downvoters.includes(userId)) {
    // Remove from upvoters if present
    const upvoteIndex = this.upvoters.indexOf(userId);
    if (upvoteIndex > -1) {
      this.upvoters.splice(upvoteIndex, 1);
      this.upvotes = Math.max(0, this.upvotes - 1);
    }
    
    this.downvoters.push(userId);
    this.downvotes += 1;
  } else {
    // Remove downvote
    const downvoteIndex = this.downvoters.indexOf(userId);
    this.downvoters.splice(downvoteIndex, 1);
    this.downvotes = Math.max(0, this.downvotes - 1);
  }
  return this.save();
};

CommentSchema.methods.editComment = function(newText: string) {
  if (this.text !== newText) {
    this.originalText = this.text;
    this.text = newText;
    this.editedAt = new Date();
    this.status = 'edited';
  }
  return this.save();
};

// Pre-save middleware to set depth for replies
CommentSchema.pre('save', async function(next) {
  if (this.isNew && this.parentCommentId) {
    try {
      const parent = await CommentModel.findById(this.parentCommentId) as IComment | null;
      if (parent) {
        this.depth = parent.depth + 1;
      }
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

export const CommentModel = model<IComment>('Comment', CommentSchema);
