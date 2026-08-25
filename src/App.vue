<template>
  <router-view v-if="isPublicRoute" />
  <AppLayout v-else />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { useAuthStore } from '@/stores/authStore.js'

const route = useRoute()
const pharmacyStore = usePharmacyStore()
const authStore = useAuthStore()
const isPublicRoute = computed(() => route.meta.public)

onMounted(() => {
  if (authStore.isAuthenticated) pharmacyStore.fetchInitialData()
})
</script>
