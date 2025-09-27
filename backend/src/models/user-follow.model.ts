import { Schema, model, Document, Types } from 'mongoose';

export interface IUserFollow extends Document {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  
  // Metadata
  followType: 'user' | 'domain' | 'tag'; // Can follow users, domains, or tags
  targetValue?: string; // For domain/tag follows, store the actual value
  
  // Notification preferences
  notifyOnNewIdea: boolean;
  notifyOnMajorUpdate: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserFollowSchema = new Schema<IUserFollow>({
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followType: {
    type: String,
    enum: ['user', 'domain', 'tag'],
    default: 'user'
  },
  targetValue: {
    type: String,
    maxlength: 100
  },
  notifyOnNewIdea: {
    type: Boolean,
    default: true
  },
  notifyOnMajorUpdate: {
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

// Compound unique index to prevent duplicate follows
UserFollowSchema.index({ followerId: 1, followingId: 1, followType: 1, targetValue: 1 }, { unique: true });

// Other indexes
UserFollowSchema.index({ followerId: 1 });
UserFollowSchema.index({ followingId: 1 });
UserFollowSchema.index({ followType: 1, targetValue: 1 });

export const UserFollowModel = model<IUserFollow>('UserFollow', UserFollowSchema);