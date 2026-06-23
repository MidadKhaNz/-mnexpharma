<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="w-24 h-24 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
      <ExclamationTriangleIcon class="w-12 h-12 text-brand-400" />
    </div>
    <h1 class="text-5xl font-black text-gray-200 mb-2">404</h1>
    <h2 class="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
    <p class="text-gray-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
    <router-link to="/">
      <BaseButton size="lg">
        <HomeIcon class="w-5 h-5" /> Back to Dashboard
      </BaseButton>
    </router-link>
  </div>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/vue/24/outline'
</script>
