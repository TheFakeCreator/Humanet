import React from 'react';
import { cn } from '@/lib/utils';

// Spinner Component
export const Spinner = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Loading Dots
export const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
    </div>
  );
};

// Skeleton Loader
export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
};

// Loading Bar (for page transitions)
export const LoadingBar = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-muted">
      <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" />
      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; margin-right: 100%; }
          50% { width: 75%; margin-left: 25%; margin-right: 0%; }
          100% { width: 100%; margin-left: 0%; margin-right: 0%; }
        }
      `}</style>
    </div>
  );
};

// Full Page Loading Screen
export const PageLoader = ({ message = 'Loading...', size = 'lg' }: { message?: string; size?: 'sm' | 'md' | 'lg' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <Spinner size={size} className="mx-auto mb-4 text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Card Loading State
export const CardLoader = () => {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
};

// List Loading State
export const ListLoader = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};