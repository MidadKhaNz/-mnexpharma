import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api.js'

export const useAuthStore = defineStore('auth', () => {
  const savedUser = localStorage.getItem('mnex_user')
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const token = ref(localStorage.getItem('mnex_token'))
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return 'AU'
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })
  const userRole = computed(() => user.value?.role ?? '')

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('mnex_token', response.token)
      localStorage.setItem('mnex_user', JSON.stringify(response.user))
      return response
    } catch (err) {
      error.value = err?.message ?? 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await api.post('/auth/logout', {}).catch(() => {})
    user.value = null
    token.value = null
    localStorage.removeItem('mnex_token')
    localStorage.removeItem('mnex_user')
  }

  function clearError() {
    error.value = null
  }

  return {
    user, token, isLoading, error,
    isAuthenticated, userInitials, userRole,
    login, logout, clearError
  }
})
