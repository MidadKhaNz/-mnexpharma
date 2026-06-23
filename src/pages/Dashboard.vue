<template>
  <div class="space-y-5">

    <!-- ── Shift Summary Bar ─────────────────────────────────────────────── -->
    <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-base font-bold text-gray-900">{{ todayLabel }}</h1>
            <span class="text-gray-300 text-sm">|</span>
            <span class="text-sm text-gray-500">Good {{ greeting }}, {{ user?.name?.split(' ')[0] }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">Logged in as Administrator</p>
        </div>
        <div class="flex items-center gap-1 shrink-0 flex-wrap">
          <div v-for="kpi in shiftKPIs" :key="kpi.label"
            :class="['flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm', kpi.cls]">
            <component :is="kpi.icon" class="w-3.5 h-3.5 shrink-0" />
            <span class="font-bold">{{ kpi.value }}</span>
            <span class="text-[11px] font-medium opacity-70">{{ kpi.label }}</span>
          </div>
          <button
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors ml-1"
            @click="refreshData"
            title="Refresh data"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" :class="refreshing ? 'animate-spin text-brand-500' : ''" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Stat Cards ────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      <div
        v-for="(stat, i) in stats"
        :key="stat.id"
        class="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5
               hover:shadow-md transition-all duration-200 cursor-default"
        :style="{ animationDelay: `${i * 50}ms` }"
      >
        <!-- Icon -->
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center mb-3', iconBg(stat.color)]">
          <component :is="getIcon(stat.icon)" :class="['w-4 h-4', iconColor(stat.color)]" />
        </div>

        <!-- Value -->
        <p class="text-xl md:text-2xl font-extrabold text-gray-900 leading-none tracking-tight">
          {{ stat.value }}
        </p>
        <p class="text-[11px] font-medium text-gray-400 mt-1 leading-tight">{{ stat.label }}</p>

        <p class="text-[10px] text-gray-400 mt-2 leading-tight truncate">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- ── Charts Row ────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

      <!-- Sales Trend Chart -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 class="text-sm font-bold text-gray-900">Sales Activity</h2>
            <p class="text-xs text-gray-400 mt-0.5">Monthly billing — last 12 months</p>
          </div>
          <div class="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1 text-xs">
            <button
              v-for="p in ['6M','12M']"
              :key="p"
              :class="['px-3 py-1.5 rounded-lg font-semibold transition-all duration-150', chartPeriod === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700']"
              @click="chartPeriod = p"
            >{{ p }}</button>
          </div>
        </div>
        <SalesChart />
      </div>

      <!-- Category Donut -->
      <div class="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <div class="mb-4">
          <h2 class="text-sm font-bold text-gray-900">Stock by Therapeutic Class</h2>
          <p class="text-xs text-gray-400 mt-0.5">Dispensing share by medicine category</p>
        </div>
        <RevenueChart />
      </div>
    </div>

    <!-- ── Recent Sales ──────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 class="text-sm font-bold text-gray-900">Recent Bills</h2>
          <p class="text-xs text-gray-400 mt-0.5">Last 10 dispensing records</p>
        </div>
        <router-link to="/sales-pos" class="text-xs text-brand-600 hover:text-brand-700 font-medium">View all →</router-link>
      </div>
      <div class="p-5">
        <RecentSales />
      </div>
    </div>

    <!-- ── Low Stock + Expired Row ───────────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

      <!-- Low Stock -->
      <div class="bg-white rounded-2xl border border-amber-100/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-amber-100/60">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <ExclamationTriangleIcon class="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900">Low Stock Alert</h2>
              <p class="text-xs text-gray-400">Below reorder level</p>
            </div>
          </div>
          <span class="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            {{ lowStockCount }} items
          </span>
        </div>
        <div class="p-5"><LowStockTable /></div>
      </div>

      <!-- Expired -->
      <div class="bg-white rounded-2xl border border-red-100/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-red-100/60">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircleIcon class="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900">Expired Medicines</h2>
              <p class="text-xs text-gray-400">Requires immediate action</p>
            </div>
          </div>
          <span class="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
            {{ expiredCount }} items
          </span>
        </div>
        <div class="p-5"><ExpiredMedicineTable /></div>
      </div>
    </div>

    <!-- ── Quick Actions + Notifications Row ────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">

      <!-- Quick Actions -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <h2 class="text-sm font-bold text-gray-900 mb-4">Quick Access</h2>
        <div class="grid grid-cols-3 gap-2.5">
          <router-link
            v-for="action in quickActions"
            :key="action.label"
            :to="action.route"
            class="group flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100
                   hover:border-brand-200 hover:bg-brand-50/60 hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md', action.bg]">
              <component :is="action.icon" :class="['w-5 h-5', action.color]" />
            </div>
            <span class="text-[10px] font-semibold text-gray-500 group-hover:text-brand-700 text-center leading-tight transition-colors">
              {{ action.label }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Notifications -->
      <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-sm font-bold text-gray-900">Stock Alerts</h2>
          <router-link to="/notifications" class="text-xs text-brand-600 hover:text-brand-700 font-semibold">View all →</router-link>
        </div>
        <div class="divide-y divide-gray-50">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            :class="['group flex items-start gap-3 px-5 py-3.5 transition-all duration-150 cursor-pointer',
                     !notif.read ? 'bg-brand-50/30 hover:bg-brand-50/60' : 'hover:bg-gray-50']"
            @click="markRead(notif.id)"
          >
            <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', notifBg(notif.type)]">
              <component :is="notifIcon(notif.type)" :class="['w-4 h-4', notifIconColor(notif.type)]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-800 truncate">{{ notif.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ notif.body }}</p>
            </div>
            <div class="flex flex-col items-end gap-1.5 shrink-0">
              <span class="text-[10px] text-gray-300 whitespace-nowrap">{{ notif.time }}</span>
              <span v-if="!notif.read" class="w-1.5 h-1.5 rounded-full bg-brand-500" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore }     from '@/stores/authStore.js'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'


import SalesChart           from '@/components/dashboard/SalesChart.vue'
import RevenueChart         from '@/components/dashboard/RevenueChart.vue'
import RecentSales          from '@/components/dashboard/RecentSales.vue'
import LowStockTable        from '@/components/dashboard/LowStockTable.vue'
import ExpiredMedicineTable from '@/components/dashboard/ExpiredMedicineTable.vue'

import {
  ArrowPathIcon, BeakerIcon, ShoppingCartIcon, CurrencyDollarIcon,
  ExclamationTriangleIcon, XCircleIcon, TruckIcon,
  BellIcon, CheckCircleIcon, InformationCircleIcon,
  DocumentTextIcon, UsersIcon, ChartBarIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const authStore     = useAuthStore()
const pharmacyStore = usePharmacyStore()
const user          = computed(() => authStore.user)
const stats         = computed(() => pharmacyStore.dashboardStats)
const notifications = computed(() => pharmacyStore.notifications.slice(0, 5))
const lowStockCount = computed(() => pharmacyStore.lowStockMedicines.length)
const expiredCount  = computed(() => pharmacyStore.expiredMedicines.length)

const chartPeriod = ref('12M')
const refreshing  = ref(false)

async function refreshData() {
  refreshing.value = true
  await Promise.all([
    pharmacyStore.fetchMedicines(),
    pharmacyStore.fetchSales()
  ])
  setTimeout(() => { refreshing.value = false }, 600)
}

// Greeting
const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})
const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

// Stat card styling
const iconMap = {
  BeakerIcon, ShoppingCartIcon, CurrencyDollarIcon,
  ExclamationTriangleIcon, XCircleIcon, TruckIcon
}
function getIcon(name) { return iconMap[name] ?? BeakerIcon }

function iconBg(c) {
  return { brand:'bg-brand-50 shadow-brand-100', blue:'bg-blue-50', green:'bg-green-50', amber:'bg-amber-50', red:'bg-red-50', purple:'bg-purple-50' }[c] ?? 'bg-gray-50'
}
function iconColor(c) {
  return { brand:'text-brand-600', blue:'text-blue-600', green:'text-green-600', amber:'text-amber-600', red:'text-red-600', purple:'text-purple-600' }[c] ?? 'text-gray-600'
}
// Shift KPIs — operational data for the status bar
const shiftKPIs = computed(() => [
  {
    label: 'dispensed today',
    value: pharmacyStore.todaySalesCount,
    icon: ShoppingCartIcon,
    cls: 'bg-brand-50 border-brand-100 text-brand-700',
  },
  {
    label: 'Rx pending',
    value: 3,
    icon: ClipboardDocumentListIcon,
    cls: 'bg-amber-50 border-amber-100 text-amber-700',
  },
  {
    label: 'low stock',
    value: lowStockCount.value,
    icon: ExclamationTriangleIcon,
    cls: lowStockCount.value > 0 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500',
  },
])

// Notifications
function markRead(id) { pharmacyStore.markNotificationRead(id) }
function notifBg(t) {
  return { danger:'bg-red-50', warning:'bg-amber-50', info:'bg-blue-50', success:'bg-green-50' }[t] ?? 'bg-gray-50'
}
function notifIcon(t) {
  return { danger: XCircleIcon, warning: ExclamationTriangleIcon, info: InformationCircleIcon, success: CheckCircleIcon }[t] ?? BellIcon
}
function notifIconColor(t) {
  return { danger:'text-red-500', warning:'text-amber-500', info:'text-blue-500', success:'text-green-500' }[t] ?? 'text-gray-500'
}

// Quick actions
const quickActions = [
  { label: 'New Sale',      route: '/sales-pos',     icon: ShoppingCartIcon, bg: 'bg-brand-50',  color: 'text-brand-600'  },
  { label: 'Add Medicine',  route: '/medicines',     icon: BeakerIcon,       bg: 'bg-blue-50',   color: 'text-blue-600'   },
  { label: 'New Purchase',  route: '/purchases',     icon: TruckIcon,        bg: 'bg-green-50',  color: 'text-green-600'  },
  { label: 'Customers',     route: '/customers',     icon: UsersIcon,        bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Prescription',  route: '/prescriptions', icon: DocumentTextIcon, bg: 'bg-amber-50',  color: 'text-amber-600'  },
  { label: 'Reports',       route: '/reports',       icon: ChartBarIcon,     bg: 'bg-pink-50',   color: 'text-pink-600'   },
]
</script>

<style scoped>
</style>
