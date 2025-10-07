'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useIdea, useUpvoteIdea } from '@/hooks/useIdeas';
import { CommentList } from '@/components/ui/CommentList';
import { FamilyTreePreview } from '@/components/ui/FamilyTreePreview';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function IdeaDetailPage() {
  const params = useParams();
  const ideaId = params?.id as string;
  const { data: user } = useAuth();
  const { data: idea, isLoading, error } = useIdea(ideaId);
  const upvoteMutation = useUpvoteIdea();

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote ideas",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await upvoteMutation.mutateAsync(ideaId);
      toast({
        title: "Success",
        description: result.upvoted ? "Idea upvoted!" : "Upvote removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote idea",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Idea Not Found</h1>
          <p className="text-gray-600 mb-4">
            The idea you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/ideas"
            className="btn-primary px-4 py-2 rounded-md"
          >
            Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <nav className="mb-6">
        <Link
          href="/ideas"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Ideas
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Idea Header */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {idea.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    by{' '}
                    <Link
                      href={`/users/${idea.author?.username}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {idea.author?.username || 'Anonymous'}
                    </Link>
                  </span>
                  <span>•</span>
                  <span>{new Date(idea.createdAt || '').toLocaleDateString()}</span>
                  {idea.parentId && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600">Forked</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tags and Domain */}
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.domain?.map((d: string) => (
                <span
                  key={d}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {d}
                </span>
              ))}
              {idea.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {idea.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200 mt-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-gray-600">{idea.upvotes || 0} upvotes</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">{idea.forkCount || 0} forks</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Comments</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border p-6">
            <CommentList ideaId={ideaId} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {user && user._id !== idea.authorId && (
                <>
                  <Link
                    href={`/ideas/${ideaId}/fork`}
                    className="w-full btn-primary px-4 py-2 rounded-md block text-center"
                  >
                    Fork This Idea
                  </Link>
                  <button 
                    onClick={handleUpvote}
                    disabled={upvoteMutation.isPending}
                    className={`w-full px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                      idea.hasUpvoted 
                        ? 'bg-green-500 text-white border border-green-600 hover:bg-green-600 shadow-md' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {idea.hasUpvoted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                      <span>
                        {upvoteMutation.isPending 
                          ? 'Processing...' 
                          : `${idea.hasUpvoted ? 'Upvoted' : 'Upvote'} (${idea.upvotes || 0})`
                        }
                      </span>
                    </span>
                  </button>
                </>
              )}
              {user && user._id === idea.authorId && (
                <Link
                  href={`/ideas/${ideaId}/edit`}
                  className="w-full btn-secondary px-4 py-2 rounded-md block text-center"
                >
                  Edit Idea
                </Link>
              )}
              <button className="w-full btn-outline px-4 py-2 rounded-md">
                Share Idea
              </button>
            </div>
          </div>

          {/* Family Tree Preview */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Idea Family Tree</h3>
            <FamilyTreePreview ideaId={ideaId} />
            <div className="mt-4">
              <Link
                href={`/ideas/${ideaId}/tree`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Full Tree →
              </Link>
            </div>
          </div>

          {/* Author Info */}
          {idea.author && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              <div className="space-y-3">
                <div>
                  <Link
                    href={`/users/${idea.author.username}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    @{idea.author.username}
                  </Link>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Karma:</span> {idea.author.karma || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
