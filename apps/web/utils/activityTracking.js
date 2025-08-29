// Utility functions for user activity tracking

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Track user activity
 * @param {string} username - Username performing the action
 * @param {string} action - Type of action (view, create, fork, update, delete, search, filter)
 * @param {object} details - Additional details about the action
 */
export const trackActivity = async (username, action, details = {}) => {
  try {
    // Only track if we have a username
    if (!username || username.trim() === '') {
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/users/${encodeURIComponent(username)}/activity`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          details,
        }),
      }
    );

    // We don't need to handle the response in most cases
    // Activity tracking should be fire-and-forget
    if (!response.ok) {
      console.warn('Failed to track activity:', action, details);
    }
  } catch (error) {
    // Silently fail - activity tracking shouldn't break the user experience
    console.warn('Error tracking activity:', error);
  }
};

/**
 * Track idea view
 * @param {string} username - Username viewing the idea
 * @param {string} ideaId - ID of the idea being viewed
 * @param {string} ideaTitle - Title of the idea
 */
export const trackIdeaView = (username, ideaId, ideaTitle) => {
  trackActivity(username, 'view', {
    ideaId,
    ideaTitle,
    type: 'idea',
  });
};

/**
 * Track idea creation
 * @param {string} username - Username creating the idea
 * @param {string} ideaId - ID of the created idea
 * @param {string} ideaTitle - Title of the created idea
 * @param {array} tags - Tags associated with the idea
 */
export const trackIdeaCreation = (username, ideaId, ideaTitle, tags = []) => {
  trackActivity(username, 'create', {
    ideaId,
    ideaTitle,
    tags,
    type: 'idea',
  });
};

/**
 * Track idea fork
 * @param {string} username - Username forking the idea
 * @param {string} originalIdeaId - ID of the original idea
 * @param {string} forkedIdeaId - ID of the forked idea
 * @param {string} ideaTitle - Title of the idea
 */
export const trackIdeaFork = (
  username,
  originalIdeaId,
  forkedIdeaId,
  ideaTitle
) => {
  trackActivity(username, 'fork', {
    originalIdeaId,
    forkedIdeaId,
    ideaTitle,
    type: 'idea',
  });
};

/**
 * Track idea update
 * @param {string} username - Username updating the idea
 * @param {string} ideaId - ID of the updated idea
 * @param {string} ideaTitle - Title of the idea
 * @param {string} updateType - Type of update (status, content, etc.)
 */
export const trackIdeaUpdate = (username, ideaId, ideaTitle, updateType) => {
  trackActivity(username, 'update', {
    ideaId,
    ideaTitle,
    updateType,
    type: 'idea',
  });
};

/**
 * Track search activity
 * @param {string} username - Username performing the search
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results returned
 * @param {object} filters - Applied filters
 */
export const trackSearch = (username, query, resultsCount, filters = {}) => {
  trackActivity(username, 'search', {
    query,
    resultsCount,
    filters,
    type: 'search',
  });
};

/**
 * Track filter usage
 * @param {string} username - Username applying filters
 * @param {object} filters - Applied filters
 * @param {number} resultsCount - Number of results after filtering
 */
export const trackFilter = (username, filters, resultsCount) => {
  trackActivity(username, 'filter', {
    filters,
    resultsCount,
    type: 'filter',
  });
};

/**
 * Get current user from localStorage or return a default
 * This is a simple implementation - in a real app you'd have proper authentication
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currentUser') || 'Anonymous';
  }
  return 'Anonymous';
};

/**
 * Set current user in localStorage
 * @param {string} username - Username to set as current user
 */
export const setCurrentUser = username => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', username);
  }
};
