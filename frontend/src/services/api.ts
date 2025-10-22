import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
  },
  // Pet endpoints
  PETS: {
    BASE: '/api/pets',
    FILTERS: '/api/pets/filters',
    BY_ID: (id: string) => `/api/pets/${id}`,
  },
  // User endpoints (admin only)
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/users/${id}/toggle-status`,
  },
} as const;

// API service functions
export const authService = {
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),

  login: (credentials: { email: string; password: string }) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  getProfile: () => api.get(API_ENDPOINTS.AUTH.PROFILE),

  refreshToken: (refreshToken: string) =>
    api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
};

export const petService = {
  getPets: (params?: {
    name?: string;
    breed?: string;
    ageRange?: string;
    costRange?: string;
    isAdopted?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get(API_ENDPOINTS.PETS.BASE, { params }),

  getPetById: (id: string) => api.get(API_ENDPOINTS.PETS.BY_ID(id)),

  createPet: (petData: {
    name: string;
    breed: string;
    age: number;
    image: string;
    costRange: number;
    personalityCharacteristics: string;
  }) => api.post(API_ENDPOINTS.PETS.BASE, petData),

  updatePet: (id: string, petData: Partial<{
    name: string;
    breed: string;
    age: number;
    image: string;
    costRange: number;
    personalityCharacteristics: string;
  }>) => api.put(API_ENDPOINTS.PETS.BY_ID(id), petData),

  deletePet: (id: string) => api.delete(API_ENDPOINTS.PETS.BY_ID(id)),

  getFilterOptions: () => api.get(API_ENDPOINTS.PETS.FILTERS),
};

export const userService = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }) => api.get(API_ENDPOINTS.USERS.BASE, { params }),

  getUserById: (id: string) => api.get(API_ENDPOINTS.USERS.BY_ID(id)),

  updateUser: (id: string, userData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
  }>) => api.put(API_ENDPOINTS.USERS.BY_ID(id), userData),

  deleteUser: (id: string) => api.delete(API_ENDPOINTS.USERS.BY_ID(id)),

  toggleUserStatus: (id: string) =>
    api.patch(API_ENDPOINTS.USERS.TOGGLE_STATUS(id)),
};

export default api;

