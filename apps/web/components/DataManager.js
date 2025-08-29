import { useState, useEffect } from 'react';
import { getAllDummyData } from '../utils/dummyData';

export default function DataManager() {
  const [isInjecting, setIsInjecting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState('');
  const [dataStats, setDataStats] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('default');

  const presets = {
    minimal: {
      name: 'Minimal',
      ideas: 10,
      activities: 50,
      description: 'Perfect for quick testing',
    },
    default: {
      name: 'Default',
      ideas: 25,
      activities: 150,
      description: 'Balanced dataset for demos',
    },
    extensive: {
      name: 'Extensive',
      ideas: 50,
      activities: 300,
      description: 'Rich dataset for comprehensive testing',
    },
    testing: {
      name: 'Testing',
      ideas: 5,
      activities: 20,
      description: 'Minimal data for unit testing',
    },
  };

  const showMessage = (msg, type = 'info') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 8000);
  };

  const fetchDataStats = async () => {
    try {
      const [ideasRes, activitiesRes] = await Promise.all([
        fetch(`${process.env.API_URL || 'http://localhost:3001'}/ideas`),
        fetch(`${process.env.API_URL || 'http://localhost:3001'}/analytics`),
      ]);

      if (ideasRes.ok && activitiesRes.ok) {
        const ideasResponse = await ideasRes.json();
        const analytics = await activitiesRes.json();

        // Extract the ideas array from the response
        const ideas = ideasResponse.data || [];

        setDataStats({
          ideasCount: ideas.length,
          totalViews: ideas.reduce(
            (sum, idea) => sum + (idea.viewCount || 0),
            0
          ),
          totalForks: ideas.reduce(
            (sum, idea) => sum + (idea.forkCount || 0),
            0
          ),
          totalActivities: analytics.totalActivities || 0,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Could not fetch data stats:', error);
    }
  };

  useEffect(() => {
    fetchDataStats();
  }, []);

  const injectDummyData = async (preset = selectedPreset) => {
    setIsInjecting(true);
    try {
      const dummyData = getAllDummyData();
      const presetConfig = presets[preset];

      // Limit data based on preset
      const ideasToInject = dummyData.ideas.slice(0, presetConfig.ideas);
      const activitiesToInject = dummyData.activities.slice(
        0,
        presetConfig.activities
      );

      let successCount = 0;
      let errorCount = 0;

      // Inject ideas
      for (const idea of ideasToInject) {
        try {
          const response = await fetch(
            `${process.env.API_URL || 'http://localhost:3001'}/ideas`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: idea.title,
                description: idea.description,
                tags: idea.tags,
                createdBy: idea.createdBy,
              }),
            }
          );

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      // Inject activities
      for (const activity of activitiesToInject) {
        try {
          await fetch(
            `${process.env.API_URL || 'http://localhost:3001'}/users/${encodeURIComponent(activity.username)}/activity`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: activity.action,
                details: activity.details,
              }),
            }
          );
        } catch (error) {
          // Activities are less critical, continue without counting errors
        }
      }

      showMessage(
        `Successfully injected ${successCount} ideas and ${activitiesToInject.length} activities using ${presetConfig.name} preset!${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
        errorCount > 0 ? 'warning' : 'success'
      );

      // Refresh stats and page
      setTimeout(() => {
        fetchDataStats();
        window.location.reload();
      }, 2000);
    } catch (error) {
      showMessage(`Error injecting data: ${error.message}`, 'error');
    } finally {
      setIsInjecting(false);
    }
  };

  const analyzeData = async () => {
    setIsAnalyzing(true);
    try {
      const [ideasRes, analyticsRes] = await Promise.all([
        fetch(`${process.env.API_URL || 'http://localhost:3001'}/ideas`),
        fetch(`${process.env.API_URL || 'http://localhost:3001'}/analytics`),
      ]);

      if (ideasRes.ok && analyticsRes.ok) {
        const ideas = await ideasRes.json();
        const analytics = await analyticsRes.json();

        // Calculate statistics
        const totalViews = ideas.reduce(
          (sum, idea) => sum + (idea.viewCount || 0),
          0
        );
        const totalForks = ideas.reduce(
          (sum, idea) => sum + (idea.forkCount || 0),
          0
        );
        const avgViews =
          ideas.length > 0 ? (totalViews / ideas.length).toFixed(1) : 0;
        const avgForks =
          ideas.length > 0 ? (totalForks / ideas.length).toFixed(1) : 0;

        // Status distribution
        const statusCounts = ideas.reduce((acc, idea) => {
          acc[idea.status] = (acc[idea.status] || 0) + 1;
          return acc;
        }, {});

        const analysisText = `
📊 Data Analysis Results:
• Total Ideas: ${ideas.length}
• Total Views: ${totalViews} (avg: ${avgViews})
• Total Forks: ${totalForks} (avg: ${avgForks})
• Total Activities: ${analytics.totalActivities || 0}
• Status Distribution: ${Object.entries(statusCounts)
          .map(([status, count]) => `${status}: ${count}`)
          .join(', ')}
• Top Idea: ${ideas.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0]?.title || 'None'} (${ideas.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0]?.viewCount || 0} views)
        `;

        showMessage(analysisText, 'info');

        // Update stats
        setDataStats({
          ideasCount: ideas.length,
          totalViews,
          totalForks,
          totalActivities: analytics.totalActivities || 0,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        showMessage('Could not fetch data for analysis', 'error');
      }
    } catch (error) {
      showMessage(`Error analyzing data: ${error.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAllData = async () => {
    if (
      !confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      showMessage(
        'To clear all data safely, please run "npm run clear-data" in the terminal. This will create a backup before clearing.',
        'info'
      );
    } catch (error) {
      showMessage(`Error clearing data: ${error.message}`, 'error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Enhanced Data Management (Prototyping)
      </h3>

      {/* Current Data Stats */}
      {dataStats && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Current Data Status
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Ideas:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {dataStats.ideasCount}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Views:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {dataStats.totalViews}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Forks:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {dataStats.totalForks}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Activities:
              </span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {dataStats.totalActivities}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date(dataStats.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}

      {/* Preset Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data Preset
        </label>
        <select
          value={selectedPreset}
          onChange={e => setSelectedPreset(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {Object.entries(presets).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.name} - {preset.ideas} ideas, {preset.activities}{' '}
              activities
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {presets[selectedPreset].description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => injectDummyData(selectedPreset)}
            disabled={isInjecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isInjecting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Injecting...
              </>
            ) : (
              'Inject Data'
            )}
          </button>

          <button
            onClick={analyzeData}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Data'
            )}
          </button>

          <button
            onClick={clearAllData}
            disabled={isClearing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? 'Clearing...' : 'Clear All Data'}
          </button>

          <button
            onClick={fetchDataStats}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Refresh Stats
          </button>
        </div>

        {/* Documentation */}
        <div className="text-sm text-gray-600 space-y-2">
          <div>
            <p className="font-medium mb-1">Available Actions:</p>
            <ul className="space-y-1 pl-4">
              <li>
                <strong>Inject Data:</strong> Adds realistic ideas and
                activities using the selected preset
              </li>
              <li>
                <strong>Analyze Data:</strong> Provides detailed statistics
                about current data
              </li>
              <li>
                <strong>Clear All Data:</strong> Removes all data (creates
                backup first)
              </li>
              <li>
                <strong>Refresh Stats:</strong> Updates the current data
                statistics
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-1 text-gray-900 dark:text-white">Terminal Commands:</p>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs space-y-1">
              <div>
                <code className="text-gray-800 dark:text-gray-200">npm run inject-data</code> <span className="text-gray-600 dark:text-gray-400">- Inject with default preset</span>
              </div>
              <div>
                <code className="text-gray-800 dark:text-gray-200">npm run clear-data</code> <span className="text-gray-600 dark:text-gray-400">- Clear all data with backup</span>
              </div>
              <div>
                <code className="text-gray-800 dark:text-gray-200">npm run reset-data</code> <span className="text-gray-600 dark:text-gray-400">- Clear and inject fresh data</span>
              </div>
              <div>
                <code className="text-gray-800 dark:text-gray-200">node scripts/data-manager.js status</code> <span className="text-gray-600 dark:text-gray-400">- Show detailed
                data status</span>
              </div>
              <div>
                <code className="text-gray-800 dark:text-gray-200">node scripts/data-manager.js generate extensive</code> <span className="text-gray-600 dark:text-gray-400">-
                Generate extensive dataset</span>
              </div>
              <div>
                <code className="text-gray-800 dark:text-gray-200">node scripts/data-manager.js analyze</code> <span className="text-gray-600 dark:text-gray-400">- Detailed</span>
                analysis with CLI output
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-md whitespace-pre-line ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : message.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : message.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
