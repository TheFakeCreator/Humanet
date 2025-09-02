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
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 5000
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  domain: {
    type: [String],
    default: [],
    validate: {
      validator: function(domains: string[]) {
        return domains.length <= 5;
      },
      message: 'Cannot have more than 5 domains'
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    default: null
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  upvoters: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  forkCount: {
    type: Number,
    default: 0,
    min: 0
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

// Text search index
IdeaSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,
    description: 5,
    tags: 1
  }
});

// Other indexes
IdeaSchema.index({ author: 1 });
IdeaSchema.index({ parentId: 1 });
IdeaSchema.index({ upvotes: -1 });
IdeaSchema.index({ forkCount: -1 });
IdeaSchema.index({ createdAt: -1 });
IdeaSchema.index({ domain: 1 });
IdeaSchema.index({ tags: 1 });

export const IdeaModel = model<IIdea>('Idea', IdeaSchema);
