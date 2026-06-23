<template>
  <div class="overflow-hidden">
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div class="relative flex-1 max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search invoice or customer…"
          class="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="statusFilter"
          class="h-9 rounded-lg border border-gray-200 text-sm text-gray-600 px-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
        <router-link to="/sales-pos">
          <button class="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors whitespace-nowrap">
            View All
          </button>
        </router-link>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl border border-gray-100">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Items</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <tr
            v-for="(sale, i) in filtered"
            :key="sale.id"
            class="group hover:bg-brand-50/40 transition-colors duration-100 cursor-pointer"
            :style="{ animationDelay: `${i * 40}ms` }"
          >
            <td class="px-4 py-3">
              <span class="font-mono text-xs font-semibold text-brand-600 group-hover:text-brand-700">{{ sale.id }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  :class="avatarColor(sale.customer)">
                  {{ initials(sale.customer) }}
                </div>
                <span class="text-gray-800 font-medium text-sm truncate max-w-[120px]">{{ sale.customer }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-center hidden sm:table-cell">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{{ sale.items }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="font-semibold text-gray-900">৳{{ sale.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="text-gray-500 text-xs">{{ formatDate(sale.date) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', statusClass(sale.status)]">
                <span class="w-1.5 h-1.5 rounded-full mr-1" :class="statusDot(sale.status)" />
                {{ sale.status }}
              </span>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="!filtered.length">
            <td colspan="6" class="py-12 text-center text-gray-400 text-sm">No sales match your filters.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer count -->
    <p class="text-xs text-gray-400 mt-3">Showing {{ filtered.length }} of {{ sales.length }} records</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const store       = usePharmacyStore()
const search      = ref('')
const statusFilter = ref('')

const sales = computed(() => store.sales)

const filtered = computed(() => {
  let list = store.recentSales
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(s =>
      s.id.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) list = list.filter(s => s.status === statusFilter.value)
  return list
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(name) {
  return name === 'Walk-in Patient' ? 'WI'
    : name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-brand-100 text-brand-700','bg-blue-100 text-blue-700','bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700','bg-pink-100 text-pink-700','bg-green-100 text-green-700'
]
function avatarColor(name) {
  const i = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}

function statusClass(s) {
  return {
    paid:     'bg-green-50 text-green-700 ring-1 ring-green-200',
    pending:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    refunded: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }[s] ?? 'bg-gray-100 text-gray-500'
}
function statusDot(s) {
  return { paid: 'bg-green-500', pending: 'bg-amber-400', refunded: 'bg-gray-400' }[s] ?? 'bg-gray-400'
}
</script>
