<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">System alerts, stock warnings and activity updates.</p>
      </div>
      <BaseButton variant="outline" @click="markAll">Mark all as read</BaseButton>
    </div>

    <BaseCard :padding="false">
      <div class="divide-y divide-gray-100">
        <div
          v-for="n in notifications"
          :key="n.id"
          :class="['flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer', !n.read ? 'bg-blue-50/30' : '']"
          @click="markRead(n.id)"
        >
          <div :class="['w-2.5 h-2.5 rounded-full mt-2 shrink-0', typeColor(n.type)]" />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-gray-900">{{ n.title }}</p>
              <p class="text-xs text-gray-400 whitespace-nowrap shrink-0">{{ n.time }}</p>
            </div>
            <p class="text-sm text-gray-600 mt-0.5">{{ n.body }}</p>
          </div>
          <div v-if="!n.read" class="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import BaseCard   from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const store = usePharmacyStore()
const notifications = computed(() => store.notifications)

function markRead(id) { store.markNotificationRead(id) }
function markAll()    { store.markAllNotificationsRead() }

function typeColor(t) {
  return { warning: 'bg-amber-400', danger: 'bg-red-500', info: 'bg-blue-400', success: 'bg-green-500' }[t] ?? 'bg-gray-400'
}
</script>
