'use client';

import React, { useState } from 'react';
import { useCreateComment } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './button';
import { Textarea } from './textarea';
import { Avatar } from './avatar';
import { Card, CardContent } from './card';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  ideaId: string;
  parentCommentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
}

export function CommentForm({
  ideaId,
  parentCommentId,
  placeholder = "Share your thoughts...",
  onSuccess,
  onCancel,
  showCancel = false,
  className = ""
}: CommentFormProps) {
  const { data: user } = useAuth();
  const createMutation = useCreateComment();
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim()) {
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
        data: { 
          text: text.trim(),
          ...(parentCommentId && { parentCommentId })
        }
      });
      
      setText('');
      onSuccess?.();
      
      toast({
        title: "Success",
        description: parentCommentId ? "Reply posted successfully" : "Comment posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: parentCommentId ? "Failed to post reply" : "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setText('');
    onCancel?.();
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center py-4">
            <p className="text-gray-600 mb-3">Please sign in to join the discussion</p>
            <Button variant="outline" onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex space-x-3">
          {/* User Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <img
              src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.username}
              className="h-8 w-8 rounded-full"
            />
          </Avatar>

          {/* Form */}
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] resize-none border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              maxLength={1000}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {text.length}/1000 characters
              </span>
              
              <div className="flex space-x-2">
                {showCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !text.trim()}
                >
                  {createMutation.isPending 
                    ? (parentCommentId ? 'Posting Reply...' : 'Posting Comment...') 
                    : (parentCommentId ? 'Post Reply' : 'Post Comment')
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}