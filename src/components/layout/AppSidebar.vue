<template>
  <!-- Mobile overlay -->
  <div
    v-if="!sidebarOpen && isMobileOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
    @click="$emit('close-mobile')"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out select-none',
      'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
      sidebarOpen ? 'w-64' : 'w-16',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Brand header -->
    <div class="flex items-center h-16 px-3 border-b border-white/8 shrink-0">
      <!-- Collapsed: icon mark only -->
      <div v-if="!sidebarOpen" class="flex items-center justify-center w-full">
        <MnexLogo :iconOnly="true" :size="34" theme="dark" />
      </div>
      <!-- Expanded: full lockup -->
      <transition name="fade">
        <div v-if="sidebarOpen" class="flex items-center gap-2.5 min-w-0 w-full px-1">
          <MnexLogo :iconOnly="false" :size="34" :wordSize="15" theme="dark" />
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Main navigation">
      <template v-for="group in NAV_ITEMS" :key="group.group">
        <!-- Group separator -->
        <div v-if="sidebarOpen" class="px-3 pt-4 pb-1.5">
          <p class="text-[10px] font-bold text-white/25 uppercase tracking-[0.12em]">{{ group.group }}</p>
        </div>
        <div v-else class="my-3 mx-2 border-t border-white/8" />

        <!-- Nav items -->
        <router-link
          v-for="item in group.items"
          :key="item.route"
          :to="item.route"
          custom
          v-slot="{ isActive, navigate }"
        >
          <div
            :class="['sidebar-link', isActive ? 'sidebar-link-active' : 'sidebar-link-inactive']"
            :title="!sidebarOpen ? item.label : undefined"
            @click="navigate"
            role="menuitem"
            tabindex="0"
            @keydown.enter="navigate"
          >
            <!-- Active indicator line -->
            <div v-if="isActive" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-brand-400 rounded-r-full" />

            <component :is="getIcon(item.icon)" :class="['w-[18px] h-[18px] shrink-0 transition-colors', isActive ? 'text-white' : 'text-white/45']" />

            <transition name="fade">
              <span v-if="sidebarOpen" class="truncate text-sm">{{ item.label }}</span>
            </transition>

            <!-- Notification badge -->
            <transition name="fade">
              <span
                v-if="sidebarOpen && item.route === '/notifications' && unreadCount > 0"
                class="ml-auto shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none"
              >{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </transition>
          </div>
        </router-link>
      </template>
    </nav>

    <!-- User footer -->
    <div class="px-2 py-3 border-t border-white/8 shrink-0">
      <div :class="['flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group', sidebarOpen ? '' : 'justify-center']">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow ring-2 ring-white/10">
          {{ userInitials }}
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden flex-1 min-w-0">
            <p class="text-white text-sm font-semibold truncate leading-tight">{{ user.name }}</p>
            <p class="text-white/40 text-[11px] truncate leading-tight mt-0.5">{{ user.role }}</p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { NAV_ITEMS } from '@/utils/constants.js'
import { useAuthStore } from '@/stores/authStore.js'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import MnexLogo from '@/components/common/MnexLogo.vue'
import {
  HomeIcon, ShoppingCartIcon, BeakerIcon, ArchiveBoxIcon,
  TruckIcon, BuildingStorefrontIcon, UsersIcon, DocumentTextIcon,
  UserCircleIcon, BriefcaseIcon, ChartBarIcon, BellIcon,
  ShieldCheckIcon, CogIcon
} from '@heroicons/vue/24/outline'

defineProps({
  sidebarOpen:  { type: Boolean, default: true },
  isMobileOpen: { type: Boolean, default: false }
})
defineEmits(['close-mobile'])

const authStore     = useAuthStore()
const pharmacyStore = usePharmacyStore()

const user         = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)
const unreadCount  = computed(() => pharmacyStore.unreadNotificationCount)

const iconMap = {
  HomeIcon, ShoppingCartIcon, BeakerIcon, ArchiveBoxIcon,
  TruckIcon, BuildingStorefrontIcon, UsersIcon, DocumentTextIcon,
  UserCircleIcon, BriefcaseIcon, ChartBarIcon, BellIcon,
  ShieldCheckIcon, CogIcon
}

function getIcon(name) { return iconMap[name] ?? HomeIcon }
</script>

<style scoped>
.sidebar-link { position: relative; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>
