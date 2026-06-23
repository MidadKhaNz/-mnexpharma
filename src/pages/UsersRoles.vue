<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Users & Roles</h1>
        <p class="page-subtitle">Manage system users, assign roles and control permissions.</p>
      </div>
      <BaseButton><PlusIcon class="w-4 h-4" /> Add User</BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Users table -->
      <div class="lg:col-span-2">
        <BaseCard title="System Users" :padding="false">
          <BaseTable :columns="userCols" :rows="users">
            <template #default="{ row }">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {{ row.name.split(' ').map(n=>n[0]).join('').slice(0,2) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ row.name }}</p>
                    <p class="text-xs text-gray-400">{{ row.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">{{ row.role }}</span>
              </td>
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

      <!-- Roles -->
      <div>
        <BaseCard title="Roles">
          <div class="space-y-3">
            <div v-for="role in roles" :key="role.name" class="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ role.name }}</p>
                <p class="text-xs text-gray-500">{{ role.users }} user{{ role.users !== 1 ? 's' : '' }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ role.permissions }} perms</span>
            </div>
          </div>
          <BaseButton variant="outline" class="w-full mt-4" size="sm">
            <PlusIcon class="w-4 h-4" /> New Role
          </BaseButton>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseCard   from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable  from '@/components/common/BaseTable.vue'
import { PlusIcon, PencilIcon } from '@heroicons/vue/24/outline'

const userCols = [
  { key: 'name',   label: 'User' },
  { key: 'role',   label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'actions',label: '', align: 'right' }
]

const users = [
  { id: 1, name: 'Admin User',   email: 'admin@mnexpharma.com',  role: 'Super Admin', status: 'active'   },
  { id: 2, name: 'Roni Ahmed',   email: 'roni@mnexpharma.com',   role: 'Pharmacist',  status: 'active'   },
  { id: 3, name: 'Sadia Rahman', email: 'sadia@mnexpharma.com',  role: 'Cashier',     status: 'inactive' }
]

const roles = [
  { name: 'Super Admin', users: 1, permissions: 52 },
  { name: 'Pharmacist',  users: 3, permissions: 28 },
  { name: 'Cashier',     users: 2, permissions: 12 },
  { name: 'Store Keeper',users: 1, permissions: 10 }
]
</script>
