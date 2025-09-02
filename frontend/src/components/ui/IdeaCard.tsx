import React from 'react';
import Link from 'next/link';
import { useUpvoteIdea, useForkIdea } from '@/hooks/useIdeas';
import { useAuth } from '@/hooks/useAuth';
import type { IdeaDTO } from '@humanet/shared';

interface IdeaCardProps {
  idea: IdeaDTO;
  showActions?: boolean;
  compact?: boolean;
}

export function IdeaCard({ idea, showActions = true, compact = false }: IdeaCardProps) {
  const { data: user } = useAuth();
  const upvoteMutation = useUpvoteIdea();
  const forkMutation = useForkIdea();

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }
    upvoteMutation.mutate(idea._id!);
  };

  const handleFork = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    forkMutation.mutate({ id: idea._id! });
  };

  return (
    <div className={`card hover:shadow-md transition-shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            href={`/ideas/${idea._id}`}
            className="block group"
          >
            <h3 className={`font-semibold text-gray-900 group-hover:text-primary-600 transition-colors ${
              compact ? 'text-base' : 'text-lg'
            }`}>
              {idea.title}
            </h3>
          </Link>
          
          {!compact && (
            <p className="text-gray-600 mt-2 line-clamp-3">
              {idea.description}
            </p>
          )}

          <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
            <span>by {idea.author?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(idea.createdAt || '').toLocaleDateString()}</span>
            {idea.parentId && (
              <>
                <span>•</span>
                <span className="text-primary-600">Forked</span>
              </>
            )}
          </div>

          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {idea.tags.slice(0, compact ? 2 : 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
              {compact && idea.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  +{idea.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleUpvote}
              disabled={upvoteMutation.isPending}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{idea.upvotes || 0}</span>
            </button>

            <button
              onClick={handleFork}
              disabled={forkMutation.isPending}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{idea.forkCount || 0}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
