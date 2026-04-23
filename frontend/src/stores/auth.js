import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEvaluator = computed(() => ['admin', 'evaluator'].includes(user.value?.role))
  const isVendor = computed(() => user.value?.role === 'vendor')

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data
      return response.data
    } catch (error) {
      logout()
      throw error
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      user.value = response.data.user
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isEvaluator,
    isVendor,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile
  }
})
