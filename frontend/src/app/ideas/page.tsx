'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIdeas } from '@/hooks/useIdeas';
import { IdeaCard } from '@/components/ui/IdeaCard';
import { useAuth } from '@/hooks/useAuth';

export default function IdeasPage() {
  const { data: user } = useAuth();
  const [sortBy, setSortBy] = useState<'createdAt' | 'upvotes' | 'forkCount'>('createdAt');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: ideasData, isLoading, error } = useIdeas({ 
    sortBy, 
    domain: selectedDomain ? [selectedDomain] : undefined, 
    page, 
    limit: 10 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ideas</h1>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            Failed to load ideas. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const ideas = ideasData?.data || [];
  const pagination = ideasData?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ideas</h1>
        {user && (
          <Link
            href="/ideas/new"
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Share Idea
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="createdAt">Newest</option>
              <option value="upvotes">Most Popular</option>
              <option value="forkCount">Most Forked</option>
            </select>
          </div>

          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
              Domain
            </label>
            <select
              id="domain"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Domains</option>
              <option value="technology">Technology</option>
              <option value="science">Science</option>
              <option value="business">Business</option>
              <option value="social">Social</option>
              <option value="environment">Environment</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ideas List */}
      {ideas.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No ideas yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new idea.
            </p>
            {user && (
              <div className="mt-6">
                <Link
                  href="/ideas/new"
                  className="btn-primary px-4 py-2 rounded-md"
                >
                  Share Your First Idea
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'text-white bg-primary-600 border border-primary-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.pages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
