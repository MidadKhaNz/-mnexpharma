<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Doctors</h1>
        <p class="page-subtitle">Manage referring doctors and their specialties.</p>
      </div>
      <BaseButton><PlusIcon class="w-4 h-4" /> Add Doctor</BaseButton>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="doc in doctors"
        :key="doc.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
            {{ doc.name.split(' ').slice(1).map(n=>n[0]).join('').slice(0,2) }}
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 text-sm">{{ doc.name }}</p>
            <p class="text-xs text-brand-600 font-medium mt-0.5">{{ doc.specialty }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ doc.hospital }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ doc.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mockDoctors } from '@/data/mockData.js'
import BaseButton from '@/components/common/BaseButton.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const doctors = computed(() => mockDoctors)
</script>
