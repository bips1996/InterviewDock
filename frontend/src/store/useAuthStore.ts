import { create } from 'zustand';
import { Admin, authApi } from '@/services/authApi';

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  login: (userId: string, pin: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  loadFromStorage: () => void;
  updateLastActivity: () => void;
  checkInactivity: () => void;
}

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,

  login: async (userId: string, pin: string) => {
    try {
      const response = await authApi.login({ userId, pin });
      
      // Store tokens and admin info
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('admin', JSON.stringify(response.admin));
      localStorage.setItem('lastActivity', Date.now().toString());

      set({
        admin: response.admin,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    set({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  refreshTokens: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authApi.refreshToken(refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      set({ accessToken: response.accessToken });
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().logout();
      throw error;
    }
  },

  loadFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const adminStr = localStorage.getItem('admin');

    if (accessToken && refreshToken && adminStr) {
      const admin = JSON.parse(adminStr) as Admin;
      set({
        admin,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

  updateLastActivity: () => {
    localStorage.setItem('lastActivity', Date.now().toString());
  },

  checkInactivity: () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.log('User inactive for 60 minutes, logging out...');
        get().logout();
      }
    }
  },
}));
