import { useState } from 'react';
import { toggleFavorite } from '../utils/favorites';

export default function FavoriteButton({
  ideaId,
  isFavorited,
  onFavoriteChange,
  size = 'md',
  className = '',
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const handleToggle = async e => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      const newStatus = await toggleFavorite(ideaId, favorited);
      setFavorited(newStatus);

      if (onFavoriteChange) {
        onFavoriteChange(ideaId, newStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-5 w-5';
      case 'lg':
        return 'h-7 w-7';
      default:
        return 'h-6 w-6';
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-full transition-colors duration-200';
    const sizeClasses = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-2' : 'p-1.5';

    if (favorited) {
      return `${baseClasses} ${sizeClasses} text-red-600 hover:text-red-700 hover:bg-red-50`;
    } else {
      return `${baseClasses} ${sizeClasses} text-gray-400 hover:text-red-600 hover:bg-gray-50`;
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${getButtonClasses()} ${className}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className={`${getSizeClasses()} animate-spin`}>
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      ) : (
        <svg
          className={`${getSizeClasses()} ${favorited ? 'fill-current' : 'fill-none'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={favorited ? 1 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
