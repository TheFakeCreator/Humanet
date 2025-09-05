'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IdeaForm } from '@/components/ui/IdeaForm';
import { useAuth } from '@/hooks/useAuth';
import { Lightbulb } from 'lucide-react';

export default function NewIdeaPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    // The IdeaForm will handle navigation internally
  };

  const handleCancel = () => {
    router.push('/ideas');
  };

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

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Idea
            </h1>
            <p className="text-gray-600">
              Share your innovative ideas with the community. Be clear and descriptive to help others understand and build upon your vision.
            </p>
          </div>

          <IdeaForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        {/* Tips Sidebar */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Tips for Great Ideas
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Be specific and clear about your idea's purpose and value</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Add relevant tags to help others discover your idea</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Choose the appropriate domain to categorize your idea</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Explain the problem you're solving and potential impact</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Consider what resources or collaboration you might need</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
