<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Purchases</h1>
        <p class="page-subtitle">Manage purchase orders, GRNs and supplier invoices.</p>
      </div>
      <BaseButton><PlusIcon class="w-4 h-4" /> New Purchase Order</BaseButton>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="s in summary" :key="s.label" class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p class="text-xs text-gray-500">{{ s.label }}</p>
        <p class="text-xl font-bold mt-1" :class="s.color">{{ s.value }}</p>
      </div>
    </div>

    <BaseCard title="Purchase Orders" :padding="false">
      <BaseTable :columns="columns" :rows="rows" row-clickable>
        <template #default="{ row }">
          <td class="px-4 py-3 font-medium text-brand-600 text-sm">{{ row.po }}</td>
          <td class="px-4 py-3 text-gray-700 text-sm">{{ row.supplier }}</td>
          <td class="px-4 py-3 text-gray-500 text-sm">{{ row.date }}</td>
          <td class="px-4 py-3 font-semibold text-gray-900 text-sm text-right">{{ row.amount }}</td>
          <td class="px-4 py-3">
            <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
          </td>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const store = usePharmacyStore()

const summary = computed(() => store.purchaseSummary)
const rows = computed(() => store.purchases.map((purchase) => ({
  ...purchase,
  amount: `BDT ${Number(purchase.amount || 0).toLocaleString('en-US')}`,
})))

const columns = [
  { key: 'po', label: 'PO Number' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'date', label: 'Order Date' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'status', label: 'Status' },
]

function statusClass(status) {
  return {
    received: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  }[status] ?? 'bg-gray-100 text-gray-500'
}
</script>
