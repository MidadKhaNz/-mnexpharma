<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">

    <!-- Sidebar -->
    <AppSidebar
      :sidebar-open="sidebarOpen"
      :is-mobile-open="mobileMenuOpen"
      @close-mobile="mobileMenuOpen = false"
    />

    <!-- Main content -->
    <div
      :class="[
        'flex flex-col flex-1 min-h-screen overflow-hidden transition-all duration-300 ease-in-out',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      ]"
    >
      <!-- Navbar -->
      <AppNavbar
        @toggle-sidebar="toggleSidebar"
        @open-mobile-menu="mobileMenuOpen = true"
      />

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 md:p-6 lg:p-7 min-h-full max-w-[1600px] mx-auto w-full">
          <router-view v-slot="{ Component, route }">
            <transition name="page" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </main>

      <!-- Footer -->
      <footer class="shrink-0 border-t border-gray-100 bg-white px-6 py-3 flex items-center gap-3">
        <div class="flex items-baseline gap-1">
          <span class="text-xs font-bold text-slate-700">MNEX</span>
          <span class="text-xs font-bold text-brand-600">Pharma</span>
        </div>
        <span class="text-gray-300 text-xs">·</span>
        <span class="text-[11px] text-gray-400">© 2026 All rights reserved.</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppNavbar  from './AppNavbar.vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'

const pharmacyStore  = usePharmacyStore()
const sidebarOpen    = computed(() => pharmacyStore.sidebarOpen)
const mobileMenuOpen = ref(false)


function toggleSidebar() { pharmacyStore.toggleSidebar() }
</script>
