<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1',
      sizeClasses,
      variantClasses,
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <svg v-if="loading" class="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:  { type: String, default: 'primary' },
  size:     { type: String, default: 'md' },
  type:     { type: String, default: 'button' },
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const sizeClasses = computed(() => ({
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  xl: 'px-6 py-3.5 text-base'
}[props.size] ?? 'px-4 py-2.5 text-sm'))

const variantClasses = computed(() => ({
  primary:   'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 focus:ring-brand-400',
  outline:   'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
  success:   'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm'
}[props.variant] ?? 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500'))
</script>
