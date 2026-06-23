<template>
  <div>
    <div class="overflow-x-auto rounded-xl border border-gray-100">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Elapsed</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <tr
            v-for="med in expired"
            :key="med.id"
            class="group hover:bg-red-50/40 transition-colors duration-100"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <ExclamationTriangleIcon class="w-3.5 h-3.5 text-red-500" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm leading-tight">{{ med.name }}</p>
                  <p class="text-xs text-gray-400 leading-tight">{{ med.generic }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                {{ med.category }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="text-sm font-semibold text-red-600">{{ med.expiry }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {{ daysElapsed(med.expiry) }}d ago
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="text-sm text-gray-500">{{ med.stock }} units</span>
            </td>
          </tr>

          <tr v-if="!expired.length">
            <td colspan="5" class="py-10 text-center">
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircleIcon class="w-5 h-5 text-green-500" />
                </div>
                <p class="text-sm font-medium text-gray-700">No expired medicines</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Action bar -->
    <div v-if="expired.length" class="mt-3 flex items-center justify-between">
      <p class="text-xs text-red-500 font-medium">⚠ {{ expired.length }} expired medicine{{ expired.length !== 1 ? 's' : '' }} require removal</p>
      <button class="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors">
        Generate Disposal Report →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const store   = usePharmacyStore()
const expired = computed(() => store.expiredMedicines)

function daysElapsed(dateStr) {
  const diff = new Date() - new Date(dateStr)
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
</script>
