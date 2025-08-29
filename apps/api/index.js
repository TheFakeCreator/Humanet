const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Path to ideas.json file
const ideasFilePath = path.join(__dirname, '..', '..', 'ideas.json');

// Simple in-memory cache to prevent duplicate view counting
// In production, this would be in Redis or similar
const viewTrackingCache = new Map();

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    for (const [key, timestamp] of viewTrackingCache.entries()) {
      if (timestamp < fiveMinutesAgo) {
        viewTrackingCache.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(morgan('combined'));

// Utility functions for file operations
const readIdeasFromFile = () => {
  try {
    if (!fs.existsSync(ideasFilePath)) {
      // Create empty ideas.json if it doesn't exist
      fs.writeFileSync(ideasFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(ideasFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ideas file:', error);
    return [];
  }
};

const writeIdeasToFile = ideas => {
  try {
    fs.writeFileSync(ideasFilePath, JSON.stringify(ideas, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing ideas file:', error);
    return false;
  }
};

// Favorites functionality
// In a real app, this would be stored in a database with user sessions
// For this demo, we'll use localStorage simulation via the user parameter
const favoritesFilePath = path.join(__dirname, '..', '..', 'favorites.json');

const readFavoritesFromFile = () => {
  try {
    if (!fs.existsSync(favoritesFilePath)) {
      // Create empty favorites.json if it doesn't exist
      fs.writeFileSync(favoritesFilePath, JSON.stringify({}, null, 2));
      return {};
    }
    const data = fs.readFileSync(favoritesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading favorites file:', error);
    return {};
  }
};

const writeFavoritesToFile = favorites => {
  try {
    fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2));
  } catch (error) {
    console.error('Error writing favorites file:', error);
  }
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HumaNet API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Get all ideas with search and filtering
app.get('/ideas', (req, res) => {
  try {
    const {
      search,
      tags,
      status,
      createdBy,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateFrom,
      dateTo,
      filterLogic = 'AND',
    } = req.query;

    let ideas = readIdeasFromFile();

    // Apply filters based on logic (AND/OR)
    if (filterLogic === 'OR') {
      // OR logic: idea matches if ANY filter condition is true
      ideas = ideas.filter(idea => {
        let matches = false;

        // Search functionality
        if (search) {
          const searchTerm = search.toLowerCase();
          if (
            idea.title.toLowerCase().includes(searchTerm) ||
            idea.description.toLowerCase().includes(searchTerm) ||
            idea.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            idea.createdBy.toLowerCase().includes(searchTerm)
          ) {
            matches = true;
          }
        }

        // Filter by tags
        if (tags && !matches) {
          const tagsArray = tags
            .split(',')
            .map(tag => tag.trim().toLowerCase());
          if (
            idea.tags.some(tag =>
              tagsArray.some(searchTag => tag.toLowerCase().includes(searchTag))
            )
          ) {
            matches = true;
          }
        }

        // Filter by status
        if (status && !matches) {
          if (idea.status === status) {
            matches = true;
          }
        }

        // Filter by author
        if (createdBy && !matches) {
          if (idea.createdBy.toLowerCase().includes(createdBy.toLowerCase())) {
            matches = true;
          }
        }

        // Filter by date range
        if (dateFrom && !matches) {
          const fromDate = new Date(dateFrom);
          if (new Date(idea.createdAt) >= fromDate) {
            matches = true;
          }
        }

        if (dateTo && !matches) {
          const toDate = new Date(dateTo);
          if (new Date(idea.createdAt) <= toDate) {
            matches = true;
          }
        }

        return matches;
      });
    } else {
      // Default AND logic: idea must match ALL filter conditions
      // Search functionality
      if (search) {
        const searchTerm = search.toLowerCase();
        ideas = ideas.filter(
          idea =>
            idea.title.toLowerCase().includes(searchTerm) ||
            idea.description.toLowerCase().includes(searchTerm) ||
            idea.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            idea.createdBy.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by tags
      if (tags) {
        const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
        ideas = ideas.filter(idea =>
          idea.tags.some(tag =>
            tagsArray.some(searchTag => tag.toLowerCase().includes(searchTag))
          )
        );
      }

      // Filter by status
      if (status) {
        ideas = ideas.filter(idea => idea.status === status);
      }

      // Filter by author
      if (createdBy) {
        ideas = ideas.filter(idea =>
          idea.createdBy.toLowerCase().includes(createdBy.toLowerCase())
        );
      }

      // Filter by date range
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        ideas = ideas.filter(idea => new Date(idea.createdAt) >= fromDate);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        ideas = ideas.filter(idea => new Date(idea.createdAt) <= toDate);
      }
    }

    // Sorting
    ideas.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdBy':
          aValue = a.createdBy.toLowerCase();
          bValue = b.createdBy.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    res.json({
      success: true,
      count: ideas.length,
      filters: {
        search,
        tags,
        status,
        createdBy,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
      },
      data: ideas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ideas',
      error: error.message,
    });
  }
});

// Get idea by ID with smart view tracking
app.get('/ideas/:id', (req, res) => {
  try {
    const ideas = readIdeasFromFile();
    const ideaIndex = ideas.findIndex(i => i.id === req.params.id);

    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const idea = ideas[ideaIndex];

    // Smart view tracking: only increment if this is a genuine view
    const shouldTrackView = req.query.track !== 'false';
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const viewKey = `${req.params.id}:${clientIP}:${userAgent}`;

    if (shouldTrackView) {
      // Check if we've seen this view recently (within 5 minutes)
      const lastViewTime = viewTrackingCache.get(viewKey);
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;

      if (!lastViewTime || lastViewTime < fiveMinutesAgo) {
        // This is a new or old enough view, count it
        if (!idea.viewCount) {
          idea.viewCount = 0;
        }
        idea.viewCount += 1;
        idea.lastViewedAt = new Date().toISOString();

        // Update the cache
        viewTrackingCache.set(viewKey, now);

        // Update the idea in the array
        ideas[ideaIndex] = idea;

        // Save updated ideas back to file
        writeIdeasToFile(ideas);
      }
    }

    res.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving idea',
      error: error.message,
    });
  }
});

// Create a new idea
app.post('/ideas', (req, res) => {
  try {
    const { title, description, tags, createdBy, images } = req.body;

    // Validation
    if (!title || !description || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, createdBy',
      });
    }

    const newIdea = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : [],
      status: 'open',
      createdBy: createdBy.trim(),
      createdAt: new Date().toISOString(),
      forkedFrom: null,
      viewCount: 0,
      forkCount: 0,
      images: Array.isArray(images) ? images : [],
    };

    const ideas = readIdeasFromFile();
    ideas.push(newIdea);

    if (!writeIdeasToFile(ideas)) {
      return res.status(500).json({
        success: false,
        message: 'Error saving idea',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      data: newIdea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating idea',
      error: error.message,
    });
  }
});

// Fork an idea
app.post('/ideas/:id/fork', (req, res) => {
  try {
    const { createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: createdBy',
      });
    }

    const ideas = readIdeasFromFile();
    const originalIdeaIndex = ideas.findIndex(i => i.id === req.params.id);

    if (originalIdeaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Original idea not found',
      });
    }

    const originalIdea = ideas[originalIdeaIndex];

    // Increment fork count on original idea
    if (!originalIdea.forkCount) {
      originalIdea.forkCount = 0;
    }
    originalIdea.forkCount += 1;
    originalIdea.lastForkedAt = new Date().toISOString();

    const forkedIdea = {
      id: uuidv4(),
      title: `${originalIdea.title} (Fork)`,
      description: originalIdea.description,
      tags: [...originalIdea.tags],
      status: 'open',
      createdBy: createdBy.trim(),
      createdAt: new Date().toISOString(),
      forkedFrom: originalIdea.id,
      viewCount: 0,
      forkCount: 0,
    };

    // Update the original idea with new fork count
    ideas[originalIdeaIndex] = originalIdea;
    ideas.push(forkedIdea);

    if (!writeIdeasToFile(ideas)) {
      return res.status(500).json({
        success: false,
        message: 'Error saving forked idea',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Idea forked successfully',
      data: forkedIdea,
      originalIdeaForkCount: originalIdea.forkCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error forking idea',
      error: error.message,
    });
  }
});

// Update idea status
app.patch('/ideas/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in-progress', 'merged'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: open, in-progress, merged',
      });
    }

    const ideas = readIdeasFromFile();
    const ideaIndex = ideas.findIndex(i => i.id === req.params.id);

    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    ideas[ideaIndex].status = status;
    ideas[ideaIndex].updatedAt = new Date().toISOString();

    if (!writeIdeasToFile(ideas)) {
      return res.status(500).json({
        success: false,
        message: 'Error updating idea status',
      });
    }

    res.json({
      success: true,
      message: 'Idea status updated successfully',
      data: ideas[ideaIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating idea status',
      error: error.message,
    });
  }
});

// Delete an idea
app.delete('/ideas/:id', (req, res) => {
  try {
    const ideas = readIdeasFromFile();
    const ideaIndex = ideas.findIndex(i => i.id === req.params.id);

    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const deletedIdea = ideas.splice(ideaIndex, 1)[0];

    if (!writeIdeasToFile(ideas)) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting idea',
      });
    }

    res.json({
      success: true,
      message: 'Idea deleted successfully',
      data: deletedIdea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting idea',
      error: error.message,
    });
  }
});

// Get all ideas by a specific user
app.get('/users/:username/ideas', (req, res) => {
  try {
    const username = req.params.username;
    const ideas = readIdeasFromFile();
    const userIdeas = ideas.filter(idea => idea.createdBy === username);

    res.json({
      success: true,
      count: userIdeas.length,
      user: username,
      data: userIdeas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user ideas',
      error: error.message,
    });
  }
});

// Advanced search endpoint
app.get('/search', (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const ideas = readIdeasFromFile();
    const searchTerm = query.toLowerCase();

    // Score-based search results
    const searchResults = ideas
      .map(idea => {
        let score = 0;

        // Title matches get highest score
        if (idea.title.toLowerCase().includes(searchTerm)) {
          score += 10;
        }

        // Description matches get medium score
        if (idea.description.toLowerCase().includes(searchTerm)) {
          score += 5;
        }

        // Tag matches get medium score
        if (idea.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          score += 5;
        }

        // Author matches get low score
        if (idea.createdBy.toLowerCase().includes(searchTerm)) {
          score += 2;
        }

        return { ...idea, searchScore: score };
      })
      .filter(idea => idea.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      query,
      count: searchResults.length,
      data: searchResults.map(({ searchScore, ...idea }) => idea),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message,
    });
  }
});

// Search suggestions endpoint
app.get('/search/suggestions', (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const ideas = readIdeasFromFile();
    const searchTerm = query.toLowerCase();
    const suggestions = new Set();

    // Collect suggestions from titles, tags, and authors
    ideas.forEach(idea => {
      // Add matching titles
      if (idea.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(idea.title);
      }

      // Add matching tags
      idea.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });

      // Add matching authors
      if (idea.createdBy.toLowerCase().includes(searchTerm)) {
        suggestions.add(idea.createdBy);
      }
    });

    // Convert to array and limit results
    const suggestionArray = Array.from(suggestions)
      .slice(0, parseInt(limit))
      .sort((a, b) => a.length - b.length); // Sort by length (shorter first)

    res.json({
      success: true,
      query,
      count: suggestionArray.length,
      suggestions: suggestionArray,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting search suggestions',
      error: error.message,
    });
  }
});

// Get unique tags endpoint
app.get('/tags', (req, res) => {
  try {
    const ideas = readIdeasFromFile();
    const allTags = ideas.reduce((tags, idea) => {
      idea.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
      return tags;
    }, []);

    const tagCounts = allTags
      .map(tag => ({
        tag,
        count: ideas.filter(idea => idea.tags.includes(tag)).length,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      count: tagCounts.length,
      data: tagCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tags',
      error: error.message,
    });
  }
});

// Get trending ideas
app.get('/trending', (req, res) => {
  try {
    const { limit = 10, timeframe = '7d' } = req.query;
    const ideas = readIdeasFromFile();

    // Calculate timeframe in milliseconds
    const timeframes = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const timeframeMs = timeframes[timeframe] || timeframes['7d'];
    const cutoffDate = new Date(Date.now() - timeframeMs);

    // Calculate trending score for each idea
    const trendingIdeas = ideas
      .map(idea => {
        const createdAt = new Date(idea.createdAt);
        const viewCount = idea.viewCount || 0;
        const forkCount = idea.forkCount || 0;

        // Age factor (newer ideas get slight boost)
        const ageInMs = Date.now() - createdAt.getTime();
        const ageFactor = Math.max(0.1, 1 - ageInMs / timeframeMs);

        // Engagement score (views + forks with different weights)
        const engagementScore = viewCount * 1 + forkCount * 3;

        // Final trending score
        const trendingScore = engagementScore * ageFactor;

        return {
          ...idea,
          trendingScore,
          engagementScore,
          ageFactor,
        };
      })
      .filter(idea => idea.trendingScore > 0) // Only include ideas with some engagement
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, parseInt(limit))
      .map(({ trendingScore, engagementScore, ageFactor, ...idea }) => idea); // Remove scoring fields from response

    res.json({
      success: true,
      timeframe,
      count: trendingIdeas.length,
      data: trendingIdeas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving trending ideas',
      error: error.message,
    });
  }
});

// Get analytics dashboard data
app.get('/analytics', (req, res) => {
  try {
    const ideas = readIdeasFromFile();

    // Calculate total metrics
    const totalIdeas = ideas.length;
    const totalViews = ideas.reduce(
      (sum, idea) => sum + (idea.viewCount || 0),
      0
    );
    const totalForks = ideas.reduce(
      (sum, idea) => sum + (idea.forkCount || 0),
      0
    );

    // Most active contributors
    const contributorStats = {};
    ideas.forEach(idea => {
      if (!contributorStats[idea.createdBy]) {
        contributorStats[idea.createdBy] = {
          username: idea.createdBy,
          ideasCount: 0,
          totalViews: 0,
          totalForks: 0,
        };
      }
      contributorStats[idea.createdBy].ideasCount += 1;
      contributorStats[idea.createdBy].totalViews += idea.viewCount || 0;
      contributorStats[idea.createdBy].totalForks += idea.forkCount || 0;
    });

    const topContributors = Object.values(contributorStats)
      .sort((a, b) => b.ideasCount - a.ideasCount)
      .slice(0, 10);

    // Ideas success metrics
    const ideasByStatus = ideas.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    }, {});

    // Most viewed ideas
    const mostViewed = [...ideas]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(idea => ({
        id: idea.id,
        title: idea.title,
        createdBy: idea.createdBy,
        viewCount: idea.viewCount || 0,
        forkCount: idea.forkCount || 0,
        status: idea.status,
      }));

    // Most forked ideas
    const mostForked = [...ideas]
      .sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0))
      .slice(0, 5)
      .map(idea => ({
        id: idea.id,
        title: idea.title,
        createdBy: idea.createdBy,
        viewCount: idea.viewCount || 0,
        forkCount: idea.forkCount || 0,
        status: idea.status,
      }));

    res.json({
      success: true,
      data: {
        overview: {
          totalIdeas,
          totalViews,
          totalForks,
          avgViewsPerIdea:
            totalIdeas > 0 ? Math.round(totalViews / totalIdeas) : 0,
          avgForksPerIdea:
            totalIdeas > 0
              ? Math.round((totalForks / totalIdeas) * 100) / 100
              : 0,
        },
        topContributors,
        ideasByStatus,
        mostViewed,
        mostForked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving analytics',
      error: error.message,
    });
  }
});

// Get popular tags dashboard
app.get('/tags/popular', (req, res) => {
  try {
    const { limit = 10, timeframe = '30d' } = req.query;
    const ideas = readIdeasFromFile();

    // Calculate date threshold based on timeframe
    const now = new Date();
    let dateThreshold;

    switch (timeframe) {
      case '7d':
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        dateThreshold = new Date(0);
        break;
      default:
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Filter ideas by timeframe
    const filteredIdeas = ideas.filter(
      idea => new Date(idea.createdAt) >= dateThreshold
    );

    // Count tag usage
    const tagCounts = {};
    const tagMetrics = {};

    filteredIdeas.forEach(idea => {
      idea.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (!tagCounts[tagLower]) {
          tagCounts[tagLower] = {
            tag: tag,
            count: 0,
            totalViews: 0,
            totalForks: 0,
            ideas: [],
          };
        }
        tagCounts[tagLower].count++;
        tagCounts[tagLower].totalViews += idea.viewCount || 0;
        tagCounts[tagLower].totalForks += idea.forkCount || 0;
        tagCounts[tagLower].ideas.push({
          id: idea.id,
          title: idea.title,
          createdBy: idea.createdBy,
          viewCount: idea.viewCount || 0,
          forkCount: idea.forkCount || 0,
        });
      });
    });

    // Sort by count and calculate additional metrics
    const popularTags = Object.values(tagCounts)
      .map(tagData => ({
        tag: tagData.tag,
        count: tagData.count,
        totalViews: tagData.totalViews,
        totalForks: tagData.totalForks,
        avgViews:
          tagData.count > 0
            ? Math.round(tagData.totalViews / tagData.count)
            : 0,
        avgForks:
          tagData.count > 0
            ? Math.round((tagData.totalForks / tagData.count) * 100) / 100
            : 0,
        topIdeas: tagData.ideas
          .sort(
            (a, b) => b.viewCount + b.forkCount - (a.viewCount + a.forkCount)
          )
          .slice(0, 3),
        growth: calculateTagGrowth(tagData.tag, ideas, timeframe),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        timeframe,
        totalTags: Object.keys(tagCounts).length,
        popularTags,
        summary: {
          mostUsedTag: popularTags[0]?.tag || null,
          mostViewedTag:
            popularTags.sort((a, b) => b.totalViews - a.totalViews)[0]?.tag ||
            null,
          mostForkedTag:
            popularTags.sort((a, b) => b.totalForks - a.totalForks)[0]?.tag ||
            null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular tags',
      error: error.message,
    });
  }
});

// Helper function to calculate tag growth
function calculateTagGrowth(tag, allIdeas, timeframe) {
  const now = new Date();
  let previousPeriodStart, currentPeriodStart;

  switch (timeframe) {
    case '7d':
      currentPeriodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      currentPeriodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    default:
      return 0;
  }

  const currentPeriodCount = allIdeas.filter(idea => {
    const createdAt = new Date(idea.createdAt);
    return (
      createdAt >= currentPeriodStart &&
      idea.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }).length;

  const previousPeriodCount = allIdeas.filter(idea => {
    const createdAt = new Date(idea.createdAt);
    return (
      createdAt >= previousPeriodStart &&
      createdAt < currentPeriodStart &&
      idea.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }).length;

  if (previousPeriodCount === 0) {
    return currentPeriodCount > 0 ? 100 : 0;
  }

  return Math.round(
    ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100
  );
}

// User activity tracking endpoint
app.post('/users/:username/activity', (req, res) => {
  try {
    const { username } = req.params;
    const { action, details } = req.body;

    // Validate required fields
    if (!username || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, action',
      });
    }

    // Valid actions: 'view', 'create', 'fork', 'update', 'delete', 'search', 'filter'
    const validActions = [
      'view',
      'create',
      'fork',
      'update',
      'delete',
      'search',
      'filter',
    ];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`,
      });
    }

    // Create activity record
    const activity = {
      id: uuidv4(),
      username: username.trim(),
      action,
      details: details || {},
      timestamp: new Date().toISOString(),
    };

    // For now, we'll track activities in a simple file-based system
    // In production, this would be in a proper database
    const activitiesFilePath = path.join(
      __dirname,
      '..',
      '..',
      'user-activities.json'
    );

    let activities = [];
    try {
      if (fs.existsSync(activitiesFilePath)) {
        const data = fs.readFileSync(activitiesFilePath, 'utf8');
        activities = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading activities file:', error);
    }

    activities.push(activity);

    // Keep only last 10000 activities to prevent file from growing too large
    if (activities.length > 10000) {
      activities = activities.slice(-10000);
    }

    try {
      fs.writeFileSync(activitiesFilePath, JSON.stringify(activities, null, 2));
    } catch (error) {
      console.error('Error writing activities file:', error);
      return res.status(500).json({
        success: false,
        message: 'Error saving activity',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Activity recorded successfully',
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording activity',
      error: error.message,
    });
  }
});

// Get user activity insights
app.get('/users/:username/activity', (req, res) => {
  try {
    const { username } = req.params;
    const { timeframe = '30d', limit = 50 } = req.query;

    const activitiesFilePath = path.join(
      __dirname,
      '..',
      '..',
      'user-activities.json'
    );
    let activities = [];

    try {
      if (fs.existsSync(activitiesFilePath)) {
        const data = fs.readFileSync(activitiesFilePath, 'utf8');
        activities = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading activities file:', error);
    }

    // Filter activities by user and timeframe
    const now = new Date();
    let dateThreshold;

    switch (timeframe) {
      case '7d':
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        dateThreshold = new Date(0);
        break;
      default:
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const userActivities = activities
      .filter(
        activity =>
          activity.username.toLowerCase() === username.toLowerCase() &&
          new Date(activity.timestamp) >= dateThreshold
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    // Calculate activity summary
    const activitySummary = userActivities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {});

    // Calculate daily activity for the timeframe
    const dailyActivity = {};
    const days = Math.min(parseInt(timeframe.replace('d', '')), 90);

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyActivity[dateStr] = 0;
    }

    userActivities.forEach(activity => {
      const dateStr = activity.timestamp.split('T')[0];
      if (dailyActivity.hasOwnProperty(dateStr)) {
        dailyActivity[dateStr]++;
      }
    });

    res.json({
      success: true,
      data: {
        username,
        timeframe,
        totalActivities: userActivities.length,
        recentActivities: userActivities.slice(0, 10),
        activitySummary,
        dailyActivity,
        mostActiveDay: Object.keys(dailyActivity).reduce((a, b) =>
          dailyActivity[a] > dailyActivity[b] ? a : b
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user activities',
      error: error.message,
    });
  }
});

// Get overall user activity insights (for admin/analytics)
app.get('/activity/insights', (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    const activitiesFilePath = path.join(
      __dirname,
      '..',
      '..',
      'user-activities.json'
    );
    let activities = [];

    try {
      if (fs.existsSync(activitiesFilePath)) {
        const data = fs.readFileSync(activitiesFilePath, 'utf8');
        activities = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading activities file:', error);
    }

    // Filter by timeframe
    const now = new Date();
    let dateThreshold;

    switch (timeframe) {
      case '7d':
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        dateThreshold = new Date(0);
        break;
      default:
        dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredActivities = activities.filter(
      activity => new Date(activity.timestamp) >= dateThreshold
    );

    // Calculate insights
    const totalActivities = filteredActivities.length;
    const uniqueUsers = new Set(filteredActivities.map(a => a.username)).size;

    // Activity breakdown
    const activityBreakdown = filteredActivities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {});

    // Most active users
    const userActivityCounts = filteredActivities.reduce((acc, activity) => {
      acc[activity.username] = (acc[activity.username] || 0) + 1;
      return acc;
    }, {});

    const mostActiveUsers = Object.entries(userActivityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([username, count]) => ({ username, activityCount: count }));

    // Daily activity trend
    const dailyActivity = {};
    const days = Math.min(parseInt(timeframe.replace('d', '')), 90);

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyActivity[dateStr] = 0;
    }

    filteredActivities.forEach(activity => {
      const dateStr = activity.timestamp.split('T')[0];
      if (dailyActivity.hasOwnProperty(dateStr)) {
        dailyActivity[dateStr]++;
      }
    });

    res.json({
      success: true,
      data: {
        timeframe,
        totalActivities,
        uniqueUsers,
        avgActivitiesPerUser:
          uniqueUsers > 0 ? Math.round(totalActivities / uniqueUsers) : 0,
        activityBreakdown,
        mostActiveUsers,
        dailyActivity,
        peakActivity: {
          date: Object.keys(dailyActivity).reduce((a, b) =>
            dailyActivity[a] > dailyActivity[b] ? a : b
          ),
          count: Math.max(...Object.values(dailyActivity)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving activity insights',
      error: error.message,
    });
  }
});

// Get user's favorites
app.get('/favorites/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = readFavoritesFromFile();
    const userFavorites = favorites[userId] || [];

    res.json({
      success: true,
      userId,
      favorites: userFavorites,
      count: userFavorites.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites',
      error: error.message,
    });
  }
});

// Add idea to favorites
app.post('/favorites/:userId/:ideaId', (req, res) => {
  try {
    const { userId, ideaId } = req.params;
    const favorites = readFavoritesFromFile();

    // Initialize user favorites if they don't exist
    if (!favorites[userId]) {
      favorites[userId] = [];
    }

    // Check if idea is already in favorites
    if (favorites[userId].includes(ideaId)) {
      return res.status(400).json({
        success: false,
        message: 'Idea already in favorites',
      });
    }

    // Add to favorites
    favorites[userId].push(ideaId);
    writeFavoritesToFile(favorites);

    res.json({
      success: true,
      message: 'Idea added to favorites',
      userId,
      ideaId,
      favorites: favorites[userId],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message,
    });
  }
});

// Remove idea from favorites
app.delete('/favorites/:userId/:ideaId', (req, res) => {
  try {
    const { userId, ideaId } = req.params;
    const favorites = readFavoritesFromFile();

    if (!favorites[userId]) {
      return res.status(404).json({
        success: false,
        message: 'User has no favorites',
      });
    }

    // Remove from favorites
    const index = favorites[userId].indexOf(ideaId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found in favorites',
      });
    }

    favorites[userId].splice(index, 1);
    writeFavoritesToFile(favorites);

    res.json({
      success: true,
      message: 'Idea removed from favorites',
      userId,
      ideaId,
      favorites: favorites[userId],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message,
    });
  }
});

// Get ideas that are favorited by user
app.get('/favorites/:userId/ideas', (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = readFavoritesFromFile();
    const userFavorites = favorites[userId] || [];

    // Get all ideas and filter by favorites
    const ideas = readIdeasFromFile();
    const favoriteIdeas = ideas.filter(idea => userFavorites.includes(idea.id));

    res.json({
      success: true,
      userId,
      count: favoriteIdeas.length,
      data: favoriteIdeas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get favorite ideas',
      error: error.message,
    });
  }
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /ideas',
      'GET /ideas/:id',
      'POST /ideas',
      'POST /ideas/:id/fork',
      'PATCH /ideas/:id/status',
      'DELETE /ideas/:id',
      'GET /users/:username/ideas',
      'GET /search',
      'GET /search/suggestions',
      'GET /tags',
      'GET /tags/popular',
      'GET /trending',
      'GET /analytics',
      'POST /users/:username/activity',
      'GET /users/:username/activity',
      'GET /activity/insights',
      'GET /favorites/:userId',
      'POST /favorites/:userId/:ideaId',
      'DELETE /favorites/:userId/:ideaId',
      'GET /favorites/:userId/ideas',
    ],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  });
});

app.listen(port, () => {
  console.log(`🚀 HumaNet API listening at http://localhost:${port}`);
  console.log(`📁 Ideas file: ${ideasFilePath}`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
});
