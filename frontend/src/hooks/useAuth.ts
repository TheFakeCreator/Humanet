import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.clear();
    },
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => authApi.getUserByUsername(username),
    enabled: !!username,
  });
};
