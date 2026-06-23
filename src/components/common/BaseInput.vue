<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Leading icon -->
      <div v-if="$slots.leading" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <slot name="leading" />
      </div>

      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="inputId"
        :type="type !== 'textarea' ? type : undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :value="modelValue"
        :class="[
          'w-full rounded-lg border bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
          $slots.leading ? 'pl-9' : 'pl-3',
          $slots.trailing ? 'pr-9' : 'pr-3',
          type === 'textarea' ? 'py-2.5 resize-y' : 'h-10'
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />

      <!-- Trailing icon -->
      <div v-if="$slots.trailing" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
        <slot name="trailing" />
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { default: '' },
  label:       { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type:        { type: String, default: 'text' },
  error:       { type: String, default: '' },
  hint:        { type: String, default: '' },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  rows:        { type: Number, default: 4 },
  id:          { type: String, default: '' }
})

defineEmits(['update:modelValue', 'blur'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 7)}`)
</script>
