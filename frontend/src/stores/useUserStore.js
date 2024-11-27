import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // Signup function
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true })

    if (password !== confirmPassword) {
      set({ loading: false })
      return toast.error('Passwords do not match')
    }

    try {
      const response = await axiosInstance.post('/auth/signup', { name, email, password })
      console.log('signup response', response)
      toast.success(response.data.message)
      set({ user: response.data.user, loading: false })
    } catch (error) {
      set({ loading: false })
      // Improved error handling
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  },

  // Login function
  login: async (email, password) => {
    set({ loading: true })
    try {
      const response = await axiosInstance.post('/auth/login', { email, password })
      console.log('login response', response.data.user)
      toast.success(response.data.message)
      set({ user: response.data.user, loading: false })
    } catch (error) {
      set({ loading: false })
      // Improved error handling
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  },

  // Check authentication status
  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axiosInstance.get('/auth/profile')
      console.log('checkAuth response', response.data)
      set({ user: response.data, checkingAuth: false })
    } catch (error) {
      set({ checkingAuth: false, user: null })
      toast.error(error?.response?.data?.message || 'Authentication check failed')
    }
  },

  // Logout function
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout')
      console.log('logout response', response.data)
      toast.success(response.data.message)
      set({ user: null, checkingAuth: false })
      window.location.href = '/login';
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  },

  //get accessToken, regenerate it from refreshToken

  refreshToken: async () => {
    console.log('called')
    if (get().checkingAuth) return;
    console.log('called2')
    set({ checkingAuth: true });
  
    try {
      // Trigger the refresh endpoint
      await axiosInstance.post('/auth/refresh-token');
  
      // Assume the server has set the new access token in cookies
      set({ checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  }  
}))

// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Handle simultaneous refresh attempts
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }

        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
