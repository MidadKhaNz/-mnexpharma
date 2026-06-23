<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        :aria-labelledby="titleId"
        aria-modal="true"
        @click.self="closeOnBackdrop && $emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

        <!-- Dialog -->
        <div
          class="modal-box relative bg-white flex flex-col w-full sm:rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden
                 rounded-t-3xl sm:rounded-t-2xl"
          :class="sizeClasses"
          style="max-height: 92vh"
        >
          <!-- Accent top bar -->
          <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-500 via-brand-400 to-teal-400" />

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
            <div class="flex items-start gap-3 min-w-0 pr-4">
              <div v-if="icon" :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', iconBg]">
                <component :is="icon" class="w-4 h-4" :class="iconColor" />
              </div>
              <div class="min-w-0">
                <h3 :id="titleId" class="text-base font-bold text-gray-900 leading-tight truncate">{{ title }}</h3>
                <p v-if="subtitle" class="text-xs text-gray-400 mt-0.5 leading-relaxed">{{ subtitle }}</p>
              </div>
            </div>
            <button
              class="shrink-0 p-1.5 rounded-xl text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              @click="$emit('update:modelValue', false)"
              aria-label="Close modal"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0 bg-gray-50/60"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue:      { type: Boolean, default: false },
  title:           { type: String,  default: '' },
  subtitle:        { type: String,  default: '' },
  size:            { type: String,  default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true },
  icon:            { default: null },
  iconBg:          { type: String, default: 'bg-brand-50' },
  iconColor:       { type: String, default: 'text-brand-600' },
})

defineEmits(['update:modelValue'])

const titleId = computed(() => `modal-title-${Math.random().toString(36).slice(2,9)}`)

const sizeClasses = computed(() => ({
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-6xl'
}[props.size] ?? 'max-w-lg'))
</script>

<style scoped>
.modal-enter-active { transition: opacity 0.22s ease; }
.modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
.modal-enter-from .modal-box { transform: scale(0.93) translateY(12px); opacity: 0; }
.modal-leave-to   .modal-box { transform: scale(0.96) translateY(4px); opacity: 0; }
</style>
