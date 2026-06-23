<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <!-- Icon -->
    <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm', iconBg]">
      <component :is="icon" :class="['w-7 h-7', iconColor]" />
    </div>

    <!-- Text -->
    <h3 class="text-base font-semibold text-gray-800 mb-1.5">{{ title }}</h3>
    <p class="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">{{ description }}</p>

    <!-- Action button -->
    <slot>
      <button
        v-if="actionLabel"
        class="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm"
        @click="$emit('action')"
      >
        <PlusIcon class="w-4 h-4" />
        {{ actionLabel }}
      </button>
    </slot>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  icon:        { required: true },
  iconBg:      { type: String, default: 'bg-gray-100' },
  iconColor:   { type: String, default: 'text-gray-400' },
  title:       { type: String, default: 'Nothing here yet' },
  description: { type: String, default: 'Get started by adding your first record.' },
  actionLabel: { type: String, default: '' },
})

defineEmits(['action'])
</script>
