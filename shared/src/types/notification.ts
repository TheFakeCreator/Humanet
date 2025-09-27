export interface NotificationDTO {
  _id?: string;
  recipientId: string;
  senderId?: string;
  type: 'idea_upvote' | 'idea_fork' | 'idea_comment' | 'comment_reply' | 'comment_upvote' | 'mention' | 'follow' | 'system' | 'welcome';
  title: string;
  message: string;
  
  // Related entities
  relatedIdeaId?: string;
  relatedCommentId?: string;
  relatedUserId?: string;
  
  // Status
  isRead: boolean;
  readAt?: string;
  
  // Metadata
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'social' | 'system' | 'moderation' | 'achievement';
  
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationDTO {
  recipientId: string;
  senderId?: string;
  type: NotificationDTO['type'];
  title: string;
  message: string;
  relatedIdeaId?: string;
  relatedCommentId?: string;
  relatedUserId?: string;
  priority?: NotificationDTO['priority'];
  category?: NotificationDTO['category'];
}

export interface NotificationPreferencesDTO {
  ideaUpvotes: boolean;
  ideaComments: boolean;
  ideaForks: boolean;
  commentReplies: boolean;
  commentUpvotes: boolean;
  mentions: boolean;
  newFollowers: boolean;
  systemUpdates: boolean;
  achievements: boolean;
}