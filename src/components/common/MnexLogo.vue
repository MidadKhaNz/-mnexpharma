<template>
  <!-- Icon-only mark -->
  <svg v-if="iconOnly" :width="size" :height="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MNEX Pharma">
    <defs>
      <linearGradient id="ml-teal-i" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F766E"/>
        <stop offset="100%" stop-color="#14B8A6"/>
      </linearGradient>
    </defs>
    <!-- M -->
    <path d="M5 54 L5 14 L22 38 L32 20" :stroke="markColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 20 L32 54"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
    <!-- X -->
    <path d="M32 20 L57 54"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M32 54 L57 20"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
    <!-- Pill -->
    <g transform="translate(44.5,18) rotate(-45)">
      <rect x="-13" y="-5" width="26" height="10" rx="5" :fill="pillBg"/>
      <rect x="-13" y="-5" width="13" height="10" rx="5" :fill="pillFill"/>
    </g>
  </svg>

  <!-- Full lockup: mark + wordmark -->
  <span v-else class="inline-flex items-center gap-2.5 leading-none" :aria-label="'MNEX Pharma logo'">
    <!-- Mark -->
    <svg :width="size" :height="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
      <defs>
        <linearGradient id="ml-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F766E"/>
          <stop offset="100%" stop-color="#14B8A6"/>
        </linearGradient>
      </defs>
      <path d="M5 54 L5 14 L22 38 L32 20" :stroke="markColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 20 L32 54"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
      <path d="M32 20 L57 54"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
      <path d="M32 54 L57 20"             :stroke="markColor" stroke-width="6.5" stroke-linecap="round"/>
      <g transform="translate(44.5,18) rotate(-45)">
        <rect x="-13" y="-5" width="26" height="10" rx="5" :fill="pillBg"/>
        <rect x="-13" y="-5" width="13" height="10" rx="5" :fill="pillFill"/>
      </g>
    </svg>

    <!-- Wordmark -->
    <span class="flex flex-col leading-none" v-if="showText">
      <span class="flex items-baseline gap-[3px]">
        <span :class="['font-extrabold tracking-tight', wordmarkMnex]" :style="{ fontSize: wordSize + 'px' }">MNEX</span>
        <span :class="['font-bold tracking-tight', wordmarkPharma]" :style="{ fontSize: wordSize + 'px' }">Pharma</span>
      </span>
    </span>
  </span>
</template>

<script setup>
const props = defineProps({
  iconOnly:      { type: Boolean, default: false },
  showText:      { type: Boolean, default: true  },
  size:          { type: Number,  default: 36    },
  wordSize:      { type: Number,  default: 15    },
  // 'dark' (sidebar) | 'light' (white bg)
  theme:         { type: String,  default: 'dark' },
})

const markColor    = 'url(#ml-teal)'
const pillBg       = props.theme === 'dark' ? '#CBD5E1' : '#CBD5E1'
const pillFill     = props.theme === 'dark' ? '#94A3B8' : '#94A3B8'
const wordmarkMnex   = props.theme === 'dark' ? 'text-white'      : 'text-slate-900'
const wordmarkPharma = props.theme === 'dark' ? 'text-teal-400'   : 'text-teal-600'
</script>
