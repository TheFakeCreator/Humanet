'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUserProfile } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { IdeaCard } from '@/components/ui/IdeaCard';

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  
  const { data: user, isLoading: userLoading, error: userError } = useUserProfile(username);
  const { data: ideasData, isLoading: ideasLoading } = useIdeas({ 
    authorId: user?._id,
    limit: 10 
  });

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-4">
            The user you're looking for doesn't exist.
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

  const userIdeas = ideasData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg border p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                @{user.username}
              </h1>
              {user.bio && (
                <p className="text-gray-600 text-lg mb-4">
                  {user.bio}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div>
                  <span className="font-medium text-gray-900">{user.karma || 0}</span> karma
                </div>
                <div>
                  <span className="font-medium text-gray-900">{userIdeas.length}</span> ideas shared
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    {new Date(user.createdAt || '').toLocaleDateString()}
                  </span> joined
                </div>
              </div>

              {user.skills && user.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's Ideas */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Ideas by @{user.username}
          </h2>

          {ideasLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : userIdeas.length === 0 ? (
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
                  @{user.username} hasn't shared any ideas yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {userIdeas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
