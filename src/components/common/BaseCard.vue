<template>
  <div
    :class="[
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      padding ? 'p-5' : '',
      hoverable ? 'hover:shadow-md transition-shadow duration-150 cursor-pointer' : ''
    ]"
  >
    <!-- Card header -->
    <div v-if="title || $slots.header" :class="['flex items-center justify-between', padding ? '' : 'px-5 pt-5', $slots.default ? 'mb-4' : '']">
      <div>
        <h3 v-if="title" class="text-base font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
      </div>
      <slot name="header" />
    </div>

    <!-- Divider -->
    <div v-if="(title || $slots.header) && $slots.default" :class="['border-t border-gray-100', padding ? '-mx-5 mb-4' : 'mb-4']" />

    <!-- Body -->
    <div :class="[!padding && (title || $slots.header) ? 'px-5 pb-5' : (!padding ? 'p-5' : '')]">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:     { type: String, default: '' },
  subtitle:  { type: String, default: '' },
  padding:   { type: Boolean, default: true },
  hoverable: { type: Boolean, default: false }
})
</script>
