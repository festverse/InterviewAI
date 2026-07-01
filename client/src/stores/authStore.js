import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize auth state from stored token
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await api.get('/auth/me');
      set({
        user: response.data.data.user,
        token,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  // Register a new user
  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put('/profile', data);
      set({ user: response.data.data.user, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
