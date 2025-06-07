import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@constructure/types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
          });

          const { user, accessToken, refreshToken } = response.data;
          
          set({
            user,
            accessToken,
            refreshToken,
            isLoading: false,
            error: null
          });

          // Настраиваем axios interceptor для автоматического добавления токена
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            accessToken: null,
            refreshToken: null
          });
          throw new Error(errorMessage);
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/register`, data);

          const { user, accessToken, refreshToken } = response.data;
          
          set({
            user,
            accessToken,
            refreshToken,
            isLoading: false,
            error: null
          });

          // Настраиваем axios interceptor для автоматического добавления токена
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Registration failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            accessToken: null,
            refreshToken: null
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        const { accessToken } = get();
        
        try {
          if (accessToken) {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
          }
        } catch (error) {
          // Игнорируем ошибки при выходе
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            error: null
          });
          
          // Удаляем токен из axios headers
          delete axios.defaults.headers.common['Authorization'];
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data;
          
          set({ accessToken });
          
          // Обновляем axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          // Если refresh token недействителен, выходим из системы
          get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
);

// Axios interceptor для автоматического обновления токена
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshAccessToken();
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Инициализация токена при загрузке приложения
if (typeof window !== 'undefined') {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
} 