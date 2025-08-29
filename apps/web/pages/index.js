import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import SearchAndFilter from '../components/SearchAndFilter';
import SearchHighlight from '../components/SearchHighlight';
import DataManager from '../components/DataManager';
import FavoriteButton from '../components/FavoriteButton';
import {
  trackSearch,
  trackFilter,
  getCurrentUser,
} from '../utils/activityTracking';
import { getUserFavorites } from '../utils/favorites';

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [availableTags, setAvailableTags] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load user favorites on component mount
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

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const queryString = params.toString();
      const url = `${process.env.API_URL || 'http://localhost:3001'}/ideas${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }

      const data = await response.json();
      setIdeas(data.data || []);

      // Track search/filter activity
      const currentUser = getCurrentUser();
      if (filters.search) {
        trackSearch(
          currentUser,
          filters.search,
          data.data?.length || 0,
          filters
        );
      } else if (Object.keys(filters).length > 0) {
        trackFilter(currentUser, filters, data.data?.length || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/tags`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  const handleFilterChange = useCallback(newFilters => {
    setFilters(prev => {
      // Only update if filters actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    fetchIdeas();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [filters]);

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'merged':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading ideas...</span>
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
                  Error loading ideas
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchIdeas}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try again
                  </button>
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
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Ideas</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Discover and fork innovative ideas from the community
            </p>
          </div>
        </div>

        {/* Search and Filter Component */}
        <SearchAndFilter
          onFilterChange={handleFilterChange}
          filters={filters}
          availableTags={availableTags}
        />

        {ideas.length === 0 ? (
          <div className="text-center py-12">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No ideas yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by posting your first idea.
            </p>
            <div className="mt-6">
              <Link
                href="/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Post your first idea
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        idea.status
                      )}`}
                    >
                      {idea.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      {idea.forkedFrom && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          🍴 Fork
                        </span>
                      )}
                      <FavoriteButton
                        ideaId={idea.id}
                        isFavorited={favorites.includes(idea.id)}
                        onFavoriteChange={handleFavoriteChange}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/idea/${idea.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        <SearchHighlight
                          text={idea.title}
                          searchTerm={filters.search}
                        />
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <SearchHighlight
                        text={truncateText(idea.description)}
                        searchTerm={filters.search}
                      />
                    </p>
                  </div>

                  {idea.tags && idea.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          >
                            <SearchHighlight
                              text={tag}
                              searchTerm={filters.search}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics Stats */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {idea.viewCount || 0}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        {idea.forkCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      by{' '}
                      <SearchHighlight
                        text={idea.createdBy}
                        searchTerm={filters.search}
                      />
                    </span>
                    <span>{formatDate(idea.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Management Dashboard */}
        <div className="mt-12">
          <DataManager />
        </div>
      </div>
    </Layout>
  );
}
