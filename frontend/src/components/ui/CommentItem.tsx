'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CommentDTO } from '@humanet/shared';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateComment, useDeleteComment, useVoteComment } from '@/hooks/useComments';
import { Button } from './button';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Textarea } from './textarea';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  FlagIcon,
  PinIcon,
} from 'lucide-react';

interface CommentItemProps {
  comment: CommentDTO;
  onReply?: (parentId: string) => void;
  showReplies?: boolean;
  level?: number;
}

export function CommentItem({ 
  comment, 
  onReply, 
  showReplies = true, 
  level = 0 
}: CommentItemProps) {
  const { data: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();
  const voteMutation = useVoteComment();

  const isAuthor = user?._id === comment.authorId;
  const canEdit = isAuthor && comment.status === 'active';
  const canDelete = isAuthor; // Simplified - remove admin check for now

  const handleEdit = async () => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        commentId: comment._id!,
        data: { text: editText.trim() }
      });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(comment._id!);
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    try {
      // If already voted the same way, remove vote
      const currentVote = comment.hasUpvoted ? 'upvote' : comment.hasDownvoted ? 'downvote' : null;
      const finalVoteType = currentVote === voteType ? 'remove' : voteType;
      
      await voteMutation.mutateAsync({
        commentId: comment._id!,
        voteType: finalVoteType
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote on comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply to comments",
        variant: "destructive",
      });
      return;
    }
    
    if (onReply) {
      onReply(comment._id!);
    } else {
      setShowReplyForm(!showReplyForm);
    }
  };

  // Don't render if comment is deleted and user is not author/admin
  if (comment.status === 'deleted' && !canDelete) {
    return (
      <div className={`flex space-x-3 ${level > 0 ? 'ml-8' : ''}`}>
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 italic">This comment has been deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <img
            src={comment.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username}`}
            alt={comment.author?.username || 'User'}
            className="h-8 w-8 rounded-full"
          />
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Link
              href={`/users/${comment.author?.username}`}
              className="text-sm font-medium text-gray-900 hover:text-primary-600"
            >
              {comment.author?.username}
            </Link>
            
            {comment.author?.isVerified && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                ✓ Verified
              </Badge>
            )}
            
            {comment.isAuthorOP && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-blue-600 border-blue-200">
                OP
              </Badge>
            )}
            
            {comment.isPinned && (
              <PinIcon className="h-3 w-3 text-yellow-500" />
            )}

            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt || ''), { addSuffix: true })}
            </span>

            {comment.editedAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}

            {/* Actions Menu */}
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <FlagIcon className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[80px]"
                placeholder="Write your comment..."
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {comment.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('upvote')}
                className={`h-7 px-2 ${comment.hasUpvoted ? 'text-green-600 bg-green-50' : 'text-gray-500'}`}
                disabled={voteMutation.isPending}
              >
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                {comment.upvotes || 0}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('downvote')}
                className={`h-7 px-2 ${comment.hasDownvoted ? 'text-red-600 bg-red-50' : 'text-gray-500'}`}
                disabled={voteMutation.isPending}
              >
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                {comment.downvotes || 0}
              </Button>
            </div>

            {/* Reply Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="h-7 px-2 text-gray-500"
            >
              <MessageCircleIcon className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              showReplies={showReplies}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}