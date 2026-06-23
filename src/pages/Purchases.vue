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
import BaseCard   from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable  from '@/components/common/BaseTable.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const summary = [
  { label: 'Orders This Month', value: '24',         color: 'text-gray-900'  },
  { label: 'Total Amount',      value: '৳ 3,40,000', color: 'text-brand-600' },
  { label: 'Pending Delivery',  value: '6',          color: 'text-amber-600' },
  { label: 'Overdue Payments',  value: '2',          color: 'text-red-600'   }
]

const columns = [
  { key: 'po',       label: 'PO Number' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'date',     label: 'Order Date' },
  { key: 'amount',   label: 'Amount', align: 'right' },
  { key: 'status',   label: 'Status' }
]

const rows = [
  { id: 1, po: 'PO-2026-045', supplier: 'Square Pharma',  date: '2026-06-20', amount: '৳ 48,500', status: 'received' },
  { id: 2, po: 'PO-2026-044', supplier: 'Beximco Pharma', date: '2026-06-18', amount: '৳ 72,000', status: 'pending'  },
  { id: 3, po: 'PO-2026-043', supplier: 'Incepta Pharma', date: '2026-06-15', amount: '৳ 31,200', status: 'received' },
  { id: 4, po: 'PO-2026-042', supplier: 'Opsonin Pharma', date: '2026-06-10', amount: '৳ 19,800', status: 'overdue'  }
]

function statusClass(s) {
  return { received: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', overdue: 'bg-red-100 text-red-700' }[s] ?? 'bg-gray-100 text-gray-500'
}
</script>
