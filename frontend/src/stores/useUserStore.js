import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import { toast } from 'react-hot-toast'

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
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  },
}))
