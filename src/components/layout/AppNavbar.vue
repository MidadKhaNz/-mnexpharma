<template>
  <header class="h-14 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center px-4 gap-3 sticky top-0 z-10 shadow-sm shadow-gray-900/5">

    <!-- Sidebar toggle -->
    <button
      class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      @click="$emit('toggle-sidebar')"
      aria-label="Toggle sidebar"
    >
      <Bars3Icon class="w-5 h-5" />
    </button>

    <!-- Page title -->
    <div class="hidden sm:flex items-center gap-2.5 min-w-0">
      <h1 class="text-sm font-semibold text-gray-800 truncate">{{ pageTitle }}</h1>
      <span class="text-gray-300 text-xs hidden md:block">›</span>
      <span class="text-xs text-gray-400 hidden md:block">{{ breadcrumb }}</span>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Search -->
    <div class="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-52 hover:border-brand-300 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all duration-150">
      <MagnifyingGlassIcon class="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Quick search…"
        class="bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none w-full"
      />
    </div>

    <!-- Notification bell -->
    <router-link
      to="/notifications"
      class="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      aria-label="Notifications"
    >
      <BellIcon class="w-5 h-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm"
      >{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </router-link>

    <!-- User menu -->
    <div class="relative" ref="userMenuRef">
      <button
        class="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        @click="userMenuOpen = !userMenuOpen"
        aria-label="User menu"
      >
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[11px] font-bold shadow ring-2 ring-brand-200">
          {{ userInitials }}
        </div>
        <div class="hidden lg:block text-left">
          <p class="text-xs font-semibold text-gray-800 leading-tight">{{ user.name }}</p>
          <p class="text-[10px] text-gray-400 leading-tight">{{ user.role }}</p>
        </div>
        <ChevronDownIcon class="hidden lg:block w-3.5 h-3.5 text-gray-400 transition-transform duration-150" :class="userMenuOpen ? 'rotate-180' : ''" />
      </button>

      <!-- Dropdown -->
      <transition name="dropdown">
        <div
          v-if="userMenuOpen"
          class="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-900/10 py-1.5 z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-transparent">
            <p class="text-sm font-semibold text-gray-900">{{ user.name }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ user.email }}</p>
          </div>
          <div class="py-1">
            <router-link
              to="/settings"
              class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userMenuOpen = false"
            >
              <CogIcon class="w-4 h-4 text-gray-400" /> Settings
            </router-link>
            <router-link
              to="/users-roles"
              class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="userMenuOpen = false"
            >
              <ShieldCheckIcon class="w-4 h-4 text-gray-400" /> Users & Roles
            </router-link>
          </div>
          <div class="py-1 border-t border-gray-100">
            <button
              class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              @click="handleLogout"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import {
  Bars3Icon, BellIcon, MagnifyingGlassIcon, CogIcon,
  ChevronDownIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon
} from '@heroicons/vue/24/outline'

defineEmits(['toggle-sidebar', 'open-mobile-menu'])

const route         = useRoute()
const authStore     = useAuthStore()
const pharmacyStore = usePharmacyStore()

const searchQuery  = ref('')
const userMenuOpen = ref(false)
const userMenuRef  = ref(null)

const user         = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)
const unreadCount  = computed(() => pharmacyStore.unreadNotificationCount)
const pageTitle    = computed(() => route.meta?.title ?? 'Dashboard')

const breadcrumb = computed(() => {
  const map = {
    '/':             'Operational Summary',
    '/sales-pos':    'Dispensing Counter',
    '/medicines':    'Formulary',
    '/inventory':    'Stock Control',
    '/purchases':    'Purchase Orders',
    '/suppliers':    'Supplier Directory',
    '/customers':    'Patient Records',
    '/prescriptions':'Rx Queue',
    '/reports':      'Sales & Stock Reports',
    '/settings':     'System Settings',
  }
  return map[route.path] ?? ''
})

function handleLogout() {
  userMenuOpen.value = false
  authStore.logout()
}

function handleClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1); }
.dropdown-enter-from,
.dropdown-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.96); }
</style>
