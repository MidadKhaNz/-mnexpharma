<template>
  <div
    class="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5
           overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
  >
    <!-- Background blob decoration -->
    <div :class="['absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-200', blobBg]" />

    <!-- Icon -->
    <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm', bgClass]">
      <component :is="iconComponent" :class="['w-5 h-5', colorClass]" />
    </div>

    <!-- Value -->
    <p class="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">{{ value }}</p>
    <p class="text-xs font-medium text-gray-500 mt-0.5 leading-tight">{{ label }}</p>

    <!-- Trend -->
    <div v-if="change" class="flex items-center gap-1 mt-2">
      <span :class="['inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-md', trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500']">
        {{ trend === 'up' ? '↑' : '↓' }} {{ change }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CurrencyDollarIcon, BeakerIcon, ClockIcon,
  ExclamationTriangleIcon, ChartBarIcon, UsersIcon,
  TruckIcon, ShoppingCartIcon, XCircleIcon, BellIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  label:  { type: String, default: '' },
  value:  { type: [String, Number], default: '0' },
  change: { type: String, default: '' },
  trend:  { type: String, default: 'up' },
  icon:   { type: String, default: 'ChartBarIcon' },
  color:  { type: String, default: 'brand' }
})

const iconMap = {
  CurrencyDollarIcon, BeakerIcon, ClockIcon,
  ExclamationTriangleIcon, ChartBarIcon, UsersIcon,
  TruckIcon, ShoppingCartIcon, XCircleIcon, BellIcon
}
const iconComponent = computed(() => iconMap[props.icon] ?? ChartBarIcon)

const palettes = {
  brand:  { bg: 'bg-brand-50',  color: 'text-brand-600',  blob: 'bg-brand-400'  },
  blue:   { bg: 'bg-blue-50',   color: 'text-blue-600',   blob: 'bg-blue-400'   },
  green:  { bg: 'bg-green-50',  color: 'text-green-600',  blob: 'bg-green-400'  },
  amber:  { bg: 'bg-amber-50',  color: 'text-amber-600',  blob: 'bg-amber-400'  },
  red:    { bg: 'bg-red-50',    color: 'text-red-600',    blob: 'bg-red-400'    },
  purple: { bg: 'bg-purple-50', color: 'text-purple-600', blob: 'bg-purple-400' },
}
const palette    = computed(() => palettes[props.color] ?? palettes.brand)
const bgClass    = computed(() => palette.value.bg)
const colorClass = computed(() => palette.value.color)
const blobBg     = computed(() => palette.value.blob)
</script>
