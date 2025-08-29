import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import FavoriteButton from '../../components/FavoriteButton';
import MarkdownViewer from '../../components/MarkdownViewer';
import {
  trackIdeaView,
  trackIdeaFork,
  getCurrentUser,
} from '../../utils/activityTracking';
import { getUserFavorites } from '../../utils/favorites';

export default function IdeaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [idea, setIdea] = useState(null);
  const [originalIdea, setOriginalIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forking, setForking] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (id) {
      fetchIdea();
    }
  }, [id]);

  // Load user favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await getUserFavorites();
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/ideas/${id}`
      );

      if (!response.ok) {
        throw new Error('Idea not found');
      }

      const data = await response.json();
      setIdea(data.data);

      // Track the view activity only once (for analytics, not view count)
      if (!hasTrackedView.current) {
        trackIdeaView(getCurrentUser(), data.data.id, data.data.title);
        hasTrackedView.current = true;
      }

      // If this is a fork, fetch the original idea without tracking views
      if (data.data.forkedFrom) {
        const originalResponse = await fetch(
          `${process.env.API_URL || 'http://localhost:3001'}/ideas/${data.data.forkedFrom}?track=false`
        );
        if (originalResponse.ok) {
          const originalData = await originalResponse.json();
          setOriginalIdea(originalData.data);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFork = async () => {
    const username = prompt('Enter your username to fork this idea:');
    if (!username || !username.trim()) return;

    try {
      setForking(true);
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/ideas/${id}/fork`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            createdBy: username.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fork idea');
      }

      const result = await response.json();

      // Track the fork activity
      trackIdeaFork(username.trim(), id, result.data.id, idea.title);

      alert('Idea forked successfully!');
      router.push('/');
    } catch (err) {
      alert(`Error forking idea: ${err.message}`);
    } finally {
      setForking(false);
    }
  };

  // Handle favorite changes
  const handleFavoriteChange = (ideaId, isFavorited) => {
    setFavorites(prev => {
      if (isFavorited) {
        return [...prev, ideaId];
      } else {
        return prev.filter(id => id !== ideaId);
      }
    });
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'merged':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading idea...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading idea
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/"
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Back to ideas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to ideas
            </Link>
          </div>

          {/* Main idea content */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
            <div className="px-6 py-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        idea.status
                      )}`}
                    >
                      {idea.status}
                    </span>
                    {idea.forkedFrom && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        🍴 Fork
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {idea.title}
                  </h1>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <FavoriteButton
                    ideaId={idea.id}
                    isFavorited={favorites.includes(idea.id)}
                    onFavoriteChange={handleFavoriteChange}
                    size="md"
                  />
                  <button
                    onClick={handleFork}
                    disabled={forking}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forking ? 'Forking...' : 'Fork this idea'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="prose dark:prose-invert max-w-none mb-8">
                <MarkdownViewer content={idea.description} />
              </div>

              {/* Images */}
              {idea.images && idea.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Images
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {idea.images.map((image, index) => (
                      <div key={image.id || index} className="group relative">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={image.data}
                            alt={image.name || `Image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity cursor-pointer"
                            onClick={() => {
                              // Open image in new tab for full view
                              const newWindow = window.open();
                              newWindow.document.write(`
                                <html>
                                  <head><title>${image.name || `Image ${index + 1}`}</title></head>
                                  <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
                                    <img src="${image.data}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                  </body>
                                </html>
                              `);
                              newWindow.document.close();
                            }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {image.name || `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t dark:border-gray-700 pt-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created by
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {idea.createdBy}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created at
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(idea.createdAt)}
                    </dd>
                  </div>
                  {idea.updatedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last updated
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(idea.updatedAt)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Original idea section for forks */}
          {originalIdea && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Original Idea
                </h3>                  <div className="bg-white dark:bg-gray-700 rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Link href={`/idea/${originalIdea.id}`}>
                        <h4 className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                          {originalIdea.title}
                        </h4>
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        by {originalIdea.createdBy}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {originalIdea.description.length > 200
                        ? `${originalIdea.description.substring(0, 200)}...`
                        : originalIdea.description}
                    </p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
