import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Hook to handle page transition loading states
 */
export const usePageTransitions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setPageLoading, isPageLoading } = useLoading();

  useEffect(() => {
    // Clear loading state when pathname changes (navigation complete)
    setPageLoading(false);
  }, [pathname, setPageLoading]);

  const navigateWithLoading = (href: string, options?: { replace?: boolean }) => {
    setPageLoading(true);
    
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  return {
    navigateWithLoading,
    isNavigating: isPageLoading,
  };
};

/**
 * Hook to handle form submission with loading states
 */
export const useFormSubmission = () => {
  const { setLoading, isLoading } = useLoading();

  const submitWithLoading = async <T>(
    key: string,
    submitFn: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
    }
  ): Promise<T | undefined> => {
    setLoading(key, true);
    
    try {
      const result = await submitFn();
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(key, false);
    }
  };

  return {
    submitWithLoading,
    isSubmitting: (key: string) => isLoading(key),
  };
};