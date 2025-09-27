import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { UserDTO, LoginDTO, CreateUserDTO, ApiResponse } from '@shared/index';

// Auth API functions
const authApi = {
  login: async (data: LoginDTO): Promise<{ user: UserDTO; token: string }> => {
    const response = await api.post<ApiResponse<{ user: UserDTO; token: string }>>('/auth/login', data);
    return response.data.data!;
  },

  signup: async (data: CreateUserDTO): Promise<{ user: UserDTO; token: string }> => {
    const response = await api.post<ApiResponse<{ user: UserDTO; token: string }>>('/auth/signup', data);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<{ user: UserDTO }>>('/auth/me');
    return response.data.data!.user;
  },

  getUserByUsername: async (username: string): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<{ user: UserDTO }>>(`/auth/users/${username}`);
    return response.data.data!.user;
  },
};

// Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      // Set redirecting state and navigate
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/ideas');
      }, 500);
    },
    meta: {
      isRedirecting,
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      // Set redirecting state and navigate
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/ideas');
      }, 500);
    },
    meta: {
      isRedirecting,
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.clear();
      
      // Set redirecting state and navigate
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    },
    meta: {
      isRedirecting,
    },
  });
};

export const useAuth = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  
  // Check if we're on pages that don't require auth
  const isPublicPage = pathname?.startsWith('/auth') || 
                      pathname?.startsWith('/legal') || 
                      pathname?.startsWith('/about') ||
                      pathname?.startsWith('/docs') ||
                      pathname?.startsWith('/roadmap') ||
                      pathname?.startsWith('/blog') ||
                      pathname?.startsWith('/contact') ||
                      pathname === '/' || false;

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Only retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: 2000,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: !isPublicPage, // Don't run on public pages
  });

  // Handle 401 errors by redirecting to login (but not from public pages)
  useEffect(() => {
    if (query.error?.response?.status === 401 && !isPublicPage) {
      // Clear any cached user data
      queryClient.removeQueries({ queryKey: ['auth'] });
      
      // Small delay to avoid redirect loops
      setTimeout(() => {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }, 500);
    }
  }, [query.error, isPublicPage, queryClient]);

  return query;
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => authApi.getUserByUsername(username),
    enabled: !!username,
  });
};
