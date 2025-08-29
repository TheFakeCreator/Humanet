// Favorites utility functions
import { getCurrentUser } from './activityTracking';

const API_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Get user's favorite ideas
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite idea IDs
 */
export const getUserFavorites = async (userId = null) => {
  try {
    const user = userId || getCurrentUser();
    const response = await fetch(`${API_URL}/favorites/${user}`);

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

/**
 * Get user's favorite ideas with full idea details
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of favorite ideas
 */
export const getUserFavoriteIdeas = async (userId = null) => {
  try {
    const user = userId || getCurrentUser();
    const response = await fetch(`${API_URL}/favorites/${user}/ideas`);

    if (!response.ok) {
      throw new Error('Failed to fetch favorite ideas');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching favorite ideas:', error);
    return [];
  }
};

/**
 * Add an idea to favorites
 * @param {string} ideaId - Idea ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const addToFavorites = async (ideaId, userId = null) => {
  try {
    const user = userId || getCurrentUser();
    const response = await fetch(`${API_URL}/favorites/${user}/${ideaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to favorites');
    }

    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Remove an idea from favorites
 * @param {string} ideaId - Idea ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const removeFromFavorites = async (ideaId, userId = null) => {
  try {
    const user = userId || getCurrentUser();
    const response = await fetch(`${API_URL}/favorites/${user}/${ideaId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove from favorites');
    }

    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Check if an idea is in user's favorites
 * @param {string} ideaId - Idea ID
 * @param {Array} favorites - Array of favorite idea IDs
 * @returns {boolean} True if idea is favorited
 */
export const isFavorited = (ideaId, favorites = []) => {
  return favorites.includes(ideaId);
};

/**
 * Toggle favorite status of an idea
 * @param {string} ideaId - Idea ID
 * @param {boolean} currentStatus - Current favorite status
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} New favorite status
 */
export const toggleFavorite = async (ideaId, currentStatus, userId = null) => {
  try {
    if (currentStatus) {
      const success = await removeFromFavorites(ideaId, userId);
      return success ? false : currentStatus;
    } else {
      const success = await addToFavorites(ideaId, userId);
      return success ? true : currentStatus;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return currentStatus;
  }
};

/**
 * Get favorites count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of favorites
 */
export const getFavoritesCount = async (userId = null) => {
  try {
    const user = userId || getCurrentUser();
    const response = await fetch(`${API_URL}/favorites/${user}`);

    if (!response.ok) {
      throw new Error('Failed to fetch favorites count');
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    return 0;
  }
};
