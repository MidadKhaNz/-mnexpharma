import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const user = ref({
    id: 1,
    name: 'Admin User',
    email: 'admin@mnexpharma.com',
    role: 'Super Admin',
    avatar: null
  })
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Actions  (wire to Laravel Sanctum / JWT later)
  // ---------------------------------------------------------------------------
  async function login(credentials) {
    isLoading.value = true
    error.value = null
    try {
      // TODO: POST /api/auth/login
      console.log('Login with', credentials)
    } catch (err) {
      error.value = err?.message ?? 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    // TODO: POST /api/auth/logout
    user.value = null
    token.value = null
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
