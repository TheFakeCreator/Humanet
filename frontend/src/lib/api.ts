import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401s for protected routes, let public pages work normally
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isPublicPage =
        currentPath.startsWith('/auth') ||
        currentPath.startsWith('/legal') ||
        currentPath.startsWith('/about') ||
        currentPath.startsWith('/docs') ||
        currentPath.startsWith('/roadmap') ||
        currentPath.startsWith('/blog') ||
        currentPath.startsWith('/contact') ||
        currentPath === '/';

      // Only redirect if we're on a protected page
      if (!isPublicPage) {
        console.warn('401 Unauthorized on protected route, redirecting to login');
        // Use the hook's redirect logic instead of redirecting here
      }
    }
    return Promise.reject(error);
  }
);

export default api;
