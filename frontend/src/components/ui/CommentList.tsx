'use client';

import React, { useState } from 'react';
import { CommentDTO } from '@humanet/shared';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { CommentItem } from './CommentItem';
import { Button } from './button';
import { Textarea } from './textarea';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Separator } from './separator';
import { toast } from '@/hooks/use-toast';
import { MessageCircleIcon, SortAscIcon, SortDescIcon } from 'lucide-react';

interface CommentListProps {
  ideaId: string;
}

type SortOption = 'newest' | 'oldest' | 'top' | 'controversial';

export function CommentList({ ideaId }: CommentListProps) {
  const { data: user } = useAuth();
  const { data: comments = [], isLoading, error } = useComments(ideaId);
  const createMutation = useCreateComment();

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter and sort comments
  const topLevelComments = comments.filter(comment => !comment.parentCommentId);
  
  const sortedComments = [...topLevelComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'oldest':
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      case 'top':
        return (b.upvotes || 0) - (a.upvotes || 0);
      case 'controversial':
        const aScore = (a.upvotes || 0) + (a.downvotes || 0);
        const bScore = (b.upvotes || 0) + (b.downvotes || 0);
        return bScore - aScore;
      default:
        return 0;
    }
  });

  // Add replies to comments
  const commentsWithReplies = sortedComments.map(comment => ({
    ...comment,
    replies: comments
      .filter(reply => reply.parentCommentId === comment._id)
      .sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime())
  }));

  const handleCreateComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newCommentText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        ideaId,
        data: { text: newCommentText.trim() }
      });
      
      setNewCommentText('');
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply",
        variant: "destructive",
      });
      return;
    }

    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        ideaId,
        data: { 
          text: replyText.trim(),
          parentCommentId 
        }
      });
      
      setReplyText('');
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <MessageCircleIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load comments. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircleIcon className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </h3>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="top">Top Voted</option>
            <option value="controversial">Most Active</option>
          </select>
        </div>
      </div>

      {/* New Comment Form */}
      <Card>
        <CardContent className="p-4">
          {user ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts on this idea..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {newCommentText.length}/1000 characters
                </span>
                <Button
                  onClick={handleCreateComment}
                  disabled={createMutation.isPending || !newCommentText.trim()}
                  className="px-6"
                >
                  {createMutation.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">Please sign in to join the discussion</p>
              <Button variant="outline" onClick={() => window.location.href = '/auth/signin'}>
                Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : commentsWithReplies.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h4 className="text-lg font-medium mb-2">No comments yet</h4>
              <p className="text-sm">Be the first to share your thoughts on this idea!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {commentsWithReplies.map((comment, index) => (
            <div key={comment._id}>
              <CommentItem
                comment={comment}
                onReply={(parentId) => setReplyingTo(parentId)}
              />
              
              {/* Reply Form */}
              {replyingTo === comment._id && user && (
                <div className="ml-11 mt-3 space-y-3">
                  <Textarea
                    placeholder={`Reply to ${comment.author?.username}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment._id!)}
                      disabled={createMutation.isPending || !replyText.trim()}
                    >
                      {createMutation.isPending ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {index < commentsWithReplies.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export related components for easier importing
export { CommentItem } from './CommentItem';
export { CommentForm } from './CommentForm';