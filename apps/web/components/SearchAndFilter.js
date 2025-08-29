import { useState, useEffect, useRef } from 'react';

export default function SearchAndFilter({
  onFilterChange,
  filters,
  availableTags = [],
}) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [selectedTags, setSelectedTags] = useState(filters.tags || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'desc');
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
  const [dateTo, setDateTo] = useState(filters.dateTo || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Advanced filter combinations state
  const [filterLogic, setFilterLogic] = useState('AND'); // 'AND' or 'OR'
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [showSaveFilter, setShowSaveFilter] = useState(false);

  // Ref for the search container to detect clicks outside
  const searchContainerRef = useRef(null);

  // Effect for non-search filters (instant update)
  useEffect(() => {
    const newFilters = {
      search: filters.search || '', // Keep existing search term
      status: selectedStatus,
      tags: selectedTags.trim(),
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
    };

    // Remove empty values
    const cleanFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    onFilterChange(cleanFilters);
  }, [
    selectedStatus,
    selectedTags,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
    onFilterChange,
  ]);

  // Search suggestions effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim() || searchTerm.length < 2 || !isFocused) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `${process.env.API_URL || 'http://localhost:3001'}/search/suggestions?q=${encodeURIComponent(searchTerm)}`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(isFocused && (data.suggestions || []).length > 0);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isFocused]);

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('humanet_saved_filters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Save filters to localStorage
  const saveFiltersToStorage = filters => {
    localStorage.setItem('humanet_saved_filters', JSON.stringify(filters));
  };

  const handleSearchSubmit = e => {
    e.preventDefault();

    // Update filters with current search term
    const newFilters = {
      search: searchTerm.trim(),
      status: selectedStatus,
      tags: selectedTags.trim(),
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
    };

    // Remove empty values
    const cleanFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    onFilterChange(cleanFilters);
    // Hide suggestions after search
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleSuggestionClick = suggestion => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);

    // Trigger search immediately when suggestion is clicked
    const newFilters = {
      search: suggestion,
      status: selectedStatus,
      tags: selectedTags.trim(),
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
    };

    const cleanFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    onFilterChange(cleanFilters);
  };

  const handleSearchInputFocus = () => {
    setIsFocused(true);
    if (suggestions.length > 0 && searchTerm.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSearchInputBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const currentFilters = {
      search: searchTerm.trim(),
      status: selectedStatus,
      tags: selectedTags.trim(),
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      filterLogic,
    };

    // Remove empty values
    const cleanFilters = Object.entries(currentFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    const newSavedFilter = {
      id: Date.now(),
      name: filterName.trim(),
      filters: cleanFilters,
      createdAt: new Date().toISOString(),
    };

    const updatedSavedFilters = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedSavedFilters);
    saveFiltersToStorage(updatedSavedFilters);
    setFilterName('');
    setShowSaveFilter(false);
  };

  const handleLoadFilter = savedFilter => {
    const filters = savedFilter.filters;
    setSearchTerm(filters.search || '');
    setSelectedStatus(filters.status || '');
    setSelectedTags(filters.tags || '');
    setSortBy(filters.sortBy || 'createdAt');
    setSortOrder(filters.sortOrder || 'desc');
    setDateFrom(filters.dateFrom || '');
    setDateTo(filters.dateTo || '');
    setFilterLogic(filters.filterLogic || 'AND');

    // Apply the loaded filters
    onFilterChange(filters);
  };

  const handleDeleteSavedFilter = filterId => {
    const updatedSavedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedSavedFilters);
    saveFiltersToStorage(updatedSavedFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedTags('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setDateFrom('');
    setDateTo('');
    onFilterChange({});
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'merged', label: 'Merged' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'createdBy', label: 'Author' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative" ref={searchContainerRef}>
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search ideas by title, description, tags, or author..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions &&
            (suggestions.length > 0 || isLoadingSuggestions) && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400 dark:text-gray-500"
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
                    Loading suggestions...
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        {suggestion}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Order:
          </label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tags (comma-separated):
              </label>
              <input
                type="text"
                placeholder="e.g. AI, healthcare, mobile"
                value={selectedTags}
                onChange={e => setSelectedTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date:
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Popular Tags */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popular Tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(tag)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                    <span className="ml-1 text-xs text-gray-600">
                      ({count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filter Combinations */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Filter Logic:
              </label>
              <select
                value={filterLogic}
                onChange={e => setFilterLogic(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="AND">Match ALL filters (AND)</option>
                <option value="OR">Match ANY filter (OR)</option>
              </select>
              <span className="text-xs text-gray-500">
                {filterLogic === 'AND'
                  ? 'Ideas must match all selected filters'
                  : 'Ideas can match any selected filter'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Save Filters */}
      <div className="border-t dark:border-gray-600 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Saved Filters
          </h3>
          <button
            onClick={() => setShowSaveFilter(!showSaveFilter)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {showSaveFilter ? 'Cancel' : 'Save Current Filters'}
          </button>
        </div>

        {showSaveFilter && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter filter name"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleSaveFilter}
              className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              Save Filter
            </button>
          </div>
        )}

        {savedFilters.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No saved filters found. Save your current filter settings for quick
            access later.
          </p>
        ) : (
          <div className="space-y-2">
            {savedFilters.map(savedFilter => (
              <div
                key={savedFilter.id}
                className="flex justify-between items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {savedFilter.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(savedFilter.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoadFilter(savedFilter)}
                    className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteSavedFilter(savedFilter.id)}
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600">
          {Object.values(filters).some(val => val) && (
            <span>Active filters applied</span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
