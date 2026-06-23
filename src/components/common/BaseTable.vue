<template>
  <div class="overflow-hidden rounded-xl border border-gray-200">
    <!-- Table toolbar -->
    <div v-if="$slots.toolbar" class="px-4 py-3 bg-white border-b border-gray-100">
      <slot name="toolbar" />
    </div>

    <!-- Scrollable table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
                col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >{{ col.label }}</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-100">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="n in skeletonRows" :key="n">
              <td v-for="col in columns" :key="col.key" class="px-4 py-3">
                <div class="h-4 bg-gray-100 rounded animate-pulse" :style="{ width: Math.random() * 40 + 50 + '%' }" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <template v-else-if="!rows.length">
            <tr>
              <td :colspan="columns.length" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <slot name="empty-icon">
                      <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </slot>
                  </div>
                  <p class="text-gray-500 font-medium">{{ emptyTitle }}</p>
                  <p class="text-gray-400 text-xs">{{ emptySubtitle }}</p>
                </div>
              </td>
            </tr>
          </template>

          <!-- Data rows -->
          <template v-else>
            <tr
              v-for="(row, idx) in rows"
              :key="row.id ?? idx"
              :class="['hover:bg-gray-50 transition-colors', rowClickable ? 'cursor-pointer' : '']"
              @click="rowClickable && $emit('row-click', row)"
            >
              <slot :row="row" :index="idx">
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    'px-4 py-3 text-gray-700',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                  ]"
                >{{ row[col.key] ?? '—' }}</td>
              </slot>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
      <p class="text-xs text-gray-500">
        Showing <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>–<span class="font-medium">{{ Math.min(currentPage * perPage, totalItems) }}</span> of <span class="font-medium">{{ totalItems }}</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          :disabled="currentPage <= 1"
          class="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="$emit('page-change', currentPage - 1)"
        >Prev</button>
        <button
          :disabled="currentPage >= totalPages"
          class="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="$emit('page-change', currentPage + 1)"
        >Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns:      { type: Array,   default: () => [] },
  rows:         { type: Array,   default: () => [] },
  loading:      { type: Boolean, default: false },
  rowClickable: { type: Boolean, default: false },
  skeletonRows: { type: Number,  default: 5 },
  emptyTitle:   { type: String,  default: 'No records found' },
  emptySubtitle:{ type: String,  default: 'Try adjusting your search or filters.' },
  currentPage:  { type: Number,  default: 1 },
  perPage:      { type: Number,  default: 10 },
  totalItems:   { type: Number,  default: 0 },
  totalPages:   { type: Number,  default: 0 }
})

defineEmits(['row-click', 'page-change'])
</script>
