import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataManager from '../components/DataManager';
import Link from 'next/link';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popularTags, setPopularTags] = useState(null);
  const [activityInsights, setActivityInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
    fetchTrending();
    fetchPopularTags();
    fetchActivityInsights();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/analytics`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/trending?timeframe=${timeframe}&limit=5`
      );

      if (response.ok) {
        const data = await response.json();
        setTrending(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching trending ideas:', err);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/tags/popular?timeframe=${timeframe}&limit=10`
      );

      if (response.ok) {
        const data = await response.json();
        setPopularTags(data.data);
      }
    } catch (err) {
      console.error('Error fetching popular tags:', err);
    }
  };

  const fetchActivityInsights = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/activity/insights?timeframe=${timeframe}`
      );

      if (response.ok) {
        const data = await response.json();
        setActivityInsights(data.data);
      }
    } catch (err) {
      console.error('Error fetching activity insights:', err);
    }
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
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading analytics...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error loading analytics
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{error}</p>
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
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Insights and metrics for HumaNet ideas and community
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back to Ideas
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tags'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Popular Tags
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              User Activity
            </button>
          </nav>
        </div>

        {/* Timeframe Selector */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timeframe:
            </label>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Ideas
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {analytics.overview.totalIdeas}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Views
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {analytics.overview.totalViews}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Forks
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {analytics.overview.totalForks}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Avg. Views
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {analytics.overview.avgViewsPerIdea}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Ideas */}
              {trending.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Trending Ideas
                    </h3>
                    <div className="space-y-4">
                      {trending.map((idea, index) => (
                        <div
                          key={idea.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/idea/${idea.id}`}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                {idea.title}
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                by {idea.createdBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
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
                              {idea.viewCount}
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                />
                              </svg>
                              {idea.forkCount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tags' && popularTags && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Popular Tags Dashboard
                </h3>
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Tags
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {popularTags.totalTags}
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Most Used
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {popularTags.summary.mostUsedTag || 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Most Viewed
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {popularTags.summary.mostViewedTag || 'N/A'}
                    </dd>
                  </div>
                </div>

                <div className="space-y-4">
                  {popularTags.popularTags.map((tag, index) => (
                    <div
                      key={tag.tag}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {tag.tag}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{tag.count} ideas</span>
                            <span>{tag.totalViews} views</span>
                            <span>{tag.totalForks} forks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tag.avgViews} avg views
                          </div>
                          <div
                            className={`text-sm ${tag.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                          >
                            {tag.growth >= 0 ? '+' : ''}
                            {tag.growth}% growth
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && activityInsights && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    User Activity Insights
                  </h3>
                  <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Activities
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {activityInsights.totalActivities}
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Users
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {activityInsights.uniqueUsers}
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Avg per User
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {activityInsights.avgActivitiesPerUser}
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 rounded-lg">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Peak Activity
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {activityInsights.peakActivity.count} activities
                      </dd>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(activityInsights.peakActivity.date)}
                      </dd>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Activity Breakdown
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(activityInsights.activityBreakdown).map(
                          ([action, count]) => (
                            <div
                              key={action}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {action}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {count}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Most Active Users
                      </h4>
                      <div className="space-y-2">
                        {activityInsights.mostActiveUsers
                          .slice(0, 5)
                          .map((user, index) => (
                            <div
                              key={user.username}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {user.username}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.activityCount}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Dashboard */}
          <div className="mt-8">
            <DataManager />
          </div>
        </div>
      </div>
    </Layout>
  );
}
