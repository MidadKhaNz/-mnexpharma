<template>
  <div>
    <div class="overflow-x-auto rounded-xl border border-gray-100">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder At</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <tr
            v-for="(med, i) in lowStock"
            :key="med.id"
            class="group hover:bg-amber-50/40 transition-colors duration-100 cursor-pointer"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <BeakerIcon class="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm leading-tight">{{ med.name }}</p>
                  <p class="text-xs text-gray-400 leading-tight">{{ med.generic }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="['text-sm font-bold', med.stock === 0 ? 'text-red-600' : 'text-amber-600']">
                {{ med.stock }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="text-sm text-gray-500">{{ med.reorder }}</span>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {{ med.category }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-1.5 rounded-full transition-all duration-700"
                    :class="stockPct(med) < 20 ? 'bg-red-500' : 'bg-amber-400'"
                    :style="`width: ${Math.max(stockPct(med), 3)}%`"
                  />
                </div>
                <span class="text-[10px] font-medium text-gray-400 w-8 text-right">{{ stockPct(med) }}%</span>
              </div>
            </td>
          </tr>

          <tr v-if="!lowStock.length">
            <td colspan="5" class="py-10 text-center">
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircleIcon class="w-5 h-5 text-green-500" />
                </div>
                <p class="text-sm font-medium text-gray-700">All medicines are well stocked</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-xs text-gray-400 mt-3">{{ lowStock.length }} medicine{{ lowStock.length !== 1 ? 's' : '' }} below reorder level</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { BeakerIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const store    = usePharmacyStore()
const lowStock = computed(() => store.lowStockMedicines)

function stockPct(med) {
  return Math.round((med.stock / med.reorder) * 100)
}
</script>
