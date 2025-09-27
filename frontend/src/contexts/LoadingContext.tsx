import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoadingBar, PageLoader } from '@/components/ui/loading';

interface LoadingContextType {
  // Global loading states
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  
  // Named loading states for specific operations
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  
  // Show global loading overlay
  showPageLoader: (message?: string) => void;
  hidePageLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isPageLoading, setPageLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [pageLoaderMessage, setPageLoaderMessage] = useState<string | undefined>();
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  };

  const isLoading = (key: string) => {
    return loadingStates[key] || false;
  };

  const showPageLoader = (message?: string) => {
    setPageLoaderMessage(message);
    setShowGlobalLoader(true);
  };

  const hidePageLoader = () => {
    setShowGlobalLoader(false);
    setPageLoaderMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{
      isPageLoading,
      setPageLoading,
      loadingStates,
      setLoading,
      isLoading,
      showPageLoader,
      hidePageLoader
    }}>
      {/* Global loading bar for page transitions */}
      <LoadingBar isLoading={isPageLoading} />
      
      {/* Global page loader overlay */}
      {showGlobalLoader && (
        <PageLoader message={pageLoaderMessage} />
      )}
      
      {children}
    </LoadingContext.Provider>
  );
};