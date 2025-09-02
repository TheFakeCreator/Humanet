import React, { useState } from 'react';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import type { CommentDTO } from '@humanet/shared';

interface CommentListProps {
  ideaId: string;
}

interface CommentItemProps {
  comment: CommentDTO;
  onDelete?: (commentId: string) => void;
}

function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { data: user } = useAuth();
  const deleteCommentMutation = useDeleteComment();

  const canDelete = user && (user._id === comment.authorId || user._id === comment.author?._id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteCommentMutation.mutateAsync(comment._id!);
        onDelete?.(comment._id!);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.author?.username || 'Anonymous'}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(comment.createdAt || '').toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleteCommentMutation.isPending}
            className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function CommentForm({ ideaId, onSuccess }: { ideaId: string; onSuccess?: () => void }) {
  const { data: user } = useAuth();
  const createCommentMutation = useCreateComment();
  const [text, setText] = useState('');

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">
          <a href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </a>{' '}
          to leave a comment
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        ideaId,
        data: { text: text.trim() }
      });
      setText('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea w-full h-20"
          placeholder="Share your thoughts..."
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={createCommentMutation.isPending || !text.trim()}
          className="btn-primary px-4 py-2 disabled:opacity-50"
        >
          {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

export function CommentList({ ideaId }: CommentListProps) {
  const { data: commentsData, isLoading, error, refetch } = useComments(ideaId);

  const handleCommentSuccess = () => {
    refetch();
  };

  const handleCommentDelete = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="mt-2 h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load comments</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const comments = commentsData?.data || [];

  return (
    <div className="space-y-6">
      <CommentForm ideaId={ideaId} onSuccess={handleCommentSuccess} />
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            {comments.map((comment: CommentDTO) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
