import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;
  type: 'idea_upvote' | 'idea_fork' | 'idea_comment' | 'comment_reply' | 'comment_upvote' | 'mention' | 'follow' | 'system' | 'welcome';
  
  // Content
  title: string;
  message: string;
  
  // Related entities
  relatedIdeaId?: Types.ObjectId;
  relatedCommentId?: Types.ObjectId;
  relatedUserId?: Types.ObjectId;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Metadata
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'social' | 'system' | 'moderation' | 'achievement';
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['idea_upvote', 'idea_fork', 'idea_comment', 'comment_reply', 'comment_upvote', 'mention', 'follow', 'system', 'welcome'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedIdeaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea'
  },
  relatedCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  relatedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  category: {
    type: String,
    enum: ['social', 'system', 'moderation', 'achievement'],
    default: 'social'
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
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1, createdAt: -1 });
NotificationSchema.index({ category: 1 });

// Methods
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create notification
NotificationSchema.statics.createNotification = async function(data: Partial<INotification>) {
  return this.create(data);
};

// Auto-delete old notifications after 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const NotificationModel = model<INotification>('Notification', NotificationSchema);