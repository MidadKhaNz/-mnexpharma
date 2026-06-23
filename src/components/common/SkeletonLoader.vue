<template>
  <div class="space-y-3" aria-label="Loading…" role="status">
    <!-- Summary cards skeleton -->
    <div v-if="type === 'cards'" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div class="shimmer h-9 w-9 rounded-xl" />
        <div class="shimmer h-7 w-24 rounded-xl" />
        <div class="shimmer h-3 w-32 rounded-full" />
      </div>
    </div>

    <!-- Table skeleton -->
    <div v-else-if="type === 'table'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-4 py-4 border-b border-gray-100 flex gap-3">
        <div class="shimmer h-9 flex-1 max-w-[280px] rounded-xl" />
        <div class="shimmer h-9 w-28 rounded-xl" />
        <div class="shimmer h-9 w-28 rounded-xl" />
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="i in rows" :key="i" class="px-4 py-3.5 flex items-center gap-4">
          <div class="shimmer h-4 w-4 rounded-full shrink-0" />
          <div class="flex items-center gap-3 flex-1">
            <div class="shimmer w-8 h-8 rounded-full shrink-0" />
            <div class="space-y-1.5 flex-1">
              <div class="shimmer h-3.5 rounded-full" :style="`width:${50+Math.random()*30}%`" />
              <div class="shimmer h-2.5 rounded-full w-28" />
            </div>
          </div>
          <div class="shimmer h-3.5 w-20 rounded-full hidden md:block" />
          <div class="shimmer h-3.5 w-24 rounded-full hidden lg:block" />
          <div class="shimmer h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Chart skeleton -->
    <div v-else-if="type === 'chart'" class="bg-white rounded-2xl border border-gray-100 p-5">
      <div class="flex items-center justify-between mb-6">
        <div class="space-y-2">
          <div class="shimmer h-4 w-40 rounded-full" />
          <div class="shimmer h-3 w-32 rounded-full" />
        </div>
        <div class="shimmer h-8 w-24 rounded-xl" />
      </div>
      <div class="shimmer rounded-xl" :style="`height:${height}px`" />
    </div>

    <!-- Generic block -->
    <div v-else class="space-y-2.5">
      <div v-for="i in rows" :key="i" class="shimmer rounded-xl" :style="`height:${rowHeight}px; width:${i%3===0?'80%':i%3===1?'100%':'90%'}`" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  type:      { type: String, default: 'generic' },
  rows:      { type: Number, default: 5 },
  height:    { type: Number, default: 200 },
  rowHeight: { type: Number, default: 16 },
})
</script>
