<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Employees</h1>
        <p class="page-subtitle">Manage pharmacy staff, roles and work shifts.</p>
      </div>
      <BaseButton><PlusIcon class="w-4 h-4" /> Add Employee</BaseButton>
    </div>

    <BaseCard :padding="false">
      <BaseTable :columns="columns" :rows="employees">
        <template #default="{ row }">
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                {{ row.name.split(' ').map(n=>n[0]).join('').slice(0,2) }}
              </div>
              <span class="font-medium text-gray-900 text-sm">{{ row.name }}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-gray-700 text-sm">{{ row.role }}</td>
          <td class="px-4 py-3 text-gray-500 text-sm">{{ row.shift }}</td>
          <td class="px-4 py-3 text-gray-500 text-sm">{{ row.phone }}</td>
          <td class="px-4 py-3">
            <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-medium', row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">{{ row.status }}</span>
          </td>
          <td class="px-4 py-3 text-right">
            <button class="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><PencilIcon class="w-4 h-4" /></button>
          </td>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mockEmployees } from '@/data/mockData.js'
import BaseCard   from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable  from '@/components/common/BaseTable.vue'
import { PlusIcon, PencilIcon } from '@heroicons/vue/24/outline'

const employees = computed(() => mockEmployees)

const columns = [
  { key: 'name',   label: 'Employee' },
  { key: 'role',   label: 'Role' },
  { key: 'shift',  label: 'Shift' },
  { key: 'phone',  label: 'Phone' },
  { key: 'status', label: 'Status' },
  { key: 'actions',label: '', align: 'right' }
]
</script>
