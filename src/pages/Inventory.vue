<template>
  <div class="space-y-5">

    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Inventory</h1>
        <p class="page-subtitle">Current stock levels, expiry dates and stock movement log.</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="exportCSV"  class="btn-outline"><ArrowDownTrayIcon class="w-4 h-4" /> CSV</button>
        <button @click="exportPDF"  class="btn-outline"><DocumentArrowDownIcon class="w-4 h-4" /> PDF</button>
        <button @click="showAdjustModal = true" class="btn-primary"><AdjustmentsHorizontalIcon class="w-4 h-4" /> Adjust Stock</button>
      </div>
    </div>

    <!-- ── Summary Cards ────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(card, i) in summaryCards"
        :key="card.label"
        :class="['relative bg-white rounded-2xl border shadow-sm p-5 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5', card.border]"
        :style="{ animationDelay: `${i * 60}ms` }"
      >
        <div :class="['absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10', card.blob]" />
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm', card.iconBg]">
          <component :is="card.icon" :class="['w-5 h-5', card.iconColor]" />
        </div>
        <p class="text-2xl font-extrabold text-gray-900 leading-tight">{{ card.value }}</p>
        <p class="text-xs font-medium text-gray-500 mt-0.5">{{ card.label }}</p>
        <p :class="['text-[11px] mt-2 font-semibold', card.subColor]">{{ card.sub }}</p>
      </div>
    </div>

    <!-- ── Expiry Warning Banner ─────────────────────────────────────────── -->
    <div v-if="expiredCount > 0 || expiringCount > 0" class="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500 shrink-0" />
          <p class="text-sm font-semibold text-red-800">Expiry Alert</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <span v-if="expiredCount"    class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-red-500" /> {{ expiredCount }} Expired
          </span>
          <span v-if="expiring30Count" class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-orange-500" /> {{ expiring30Count }} Expiring within 30 days
          </span>
          <span v-if="expiring60Count" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-amber-400" /> {{ expiring60Count }} Expiring within 60 days
          </span>
        </div>
      </div>
    </div>

    <!-- ── Main Content: Table + Timeline ──────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- ── Inventory Table ─────────────────────────────────────────────── -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">

        <!-- Toolbar -->
        <div class="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <div class="relative flex-1 min-w-[180px] max-w-xs">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Search medicines…"
              class="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
          <select v-model="filterStatus" class="filter-select">
            <option value="">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
            <option value="expired">Expired</option>
            <option value="outstock">Out of Stock</option>
          </select>
          <select v-model="filterCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <select v-model="sortKey" class="filter-select">
            <option value="">Sort…</option>
            <option value="name">Name</option>
            <option value="stock">Stock</option>
            <option value="expiry">Expiry</option>
          </select>
          <button v-if="sortKey" @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'" class="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
            <ArrowsUpDownIcon class="w-4 h-4" :class="sortDir==='desc'?'rotate-180':''" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="th-cell">Medicine</th>
                <th class="th-cell text-center">Stock</th>
                <th class="th-cell text-center hidden sm:table-cell">Reorder</th>
                <th class="th-cell hidden md:table-cell">Supplier</th>
                <th class="th-cell hidden sm:table-cell">Expiry</th>
                <th class="th-cell">Level</th>
                <th class="th-cell text-center">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-50">
              <tr v-if="!paginatedInv.length">
                <td colspan="7" class="py-12 text-center">
                  <p class="text-gray-400 text-sm">No inventory records match your filters.</p>
                </td>
              </tr>
              <tr
                v-else
                v-for="med in paginatedInv"
                :key="med.id"
                :class="['group transition-colors duration-100 cursor-pointer', rowHighlight(med)]"
                @click="openInvDetail(med)"
              >
                <!-- Medicine -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <div :class="['w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0', catColor(med.category).bg, catColor(med.category).text]">
                      {{ med.category.slice(0,2).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 text-sm leading-tight">{{ med.name }}</p>
                      <p class="text-[10px] text-gray-400 font-mono leading-tight">{{ med.batch }}</p>
                    </div>
                  </div>
                </td>

                <!-- Stock -->
                <td class="px-4 py-3 text-center">
                  <span :class="['text-sm font-bold', stockNumColor(med)]">{{ med.stock }}</span>
                </td>

                <!-- Reorder -->
                <td class="px-4 py-3 text-center text-gray-500 text-sm hidden sm:table-cell">{{ med.reorder }}</td>

                <!-- Supplier -->
                <td class="px-4 py-3 text-gray-500 text-xs truncate max-w-[140px] hidden md:table-cell">
                  {{ supplierName(med.supplier_id) }}
                </td>

                <!-- Expiry -->
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', expiryBadgeClass(med.expiry)]">
                    {{ med.expiry }}
                  </span>
                </td>

                <!-- Progress bar -->
                <td class="px-4 py-3 min-w-[100px]">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        :class="['h-2 rounded-full transition-all duration-700', stockBarClass(med)]"
                        :style="`width:${Math.min(100, Math.max(2, (med.stock/Math.max(med.reorder,1))*100))}%`"
                      />
                    </div>
                    <span class="text-[10px] text-gray-400 w-7 text-right shrink-0">
                      {{ Math.round((med.stock/Math.max(med.reorder,1))*100) }}%
                    </span>
                  </div>
                </td>

                <!-- Status badge -->
                <td class="px-4 py-3 text-center">
                  <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', invStatusBadge(med)]">
                    <span class="w-1.5 h-1.5 rounded-full" :class="invStatusDot(med)" />
                    {{ invStatusLabel(med) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-400">{{ filteredInv.length }} medicines · Page {{ invPage }} of {{ invTotalPages }}</p>
          <div class="flex items-center gap-1">
            <button :disabled="invPage<=1"             @click="invPage--" class="page-btn">‹</button>
            <button
              v-for="p in invDisplayPages"
              :key="p"
              :class="['page-btn', p===invPage ? 'bg-brand-600 text-white border-brand-600':'']"
              @click="p!=='…'&&(invPage=p)"
            >{{ p }}</button>
            <button :disabled="invPage>=invTotalPages" @click="invPage++" class="page-btn">›</button>
          </div>
        </div>
      </div>

      <!-- ── Activity Timeline ────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="text-base font-bold text-gray-900">Activity Timeline</h2>
            <p class="text-xs text-gray-500 mt-0.5">Recent stock movements</p>
          </div>
          <span class="text-xs text-brand-600 font-medium cursor-pointer hover:underline">View all</span>
        </div>

        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-100" />

          <div class="space-y-4">
            <div
              v-for="(entry, i) in timeline"
              :key="entry.id"
              class="relative flex gap-3 pl-8"
            >
              <!-- Timeline dot -->
              <div :class="['absolute left-0 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm', timelineColor(entry.type).bg]">
                <component :is="timelineIcon(entry.type)" :class="['w-3.5 h-3.5', timelineColor(entry.type).icon]" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-semibold text-gray-900 leading-tight truncate">{{ entry.medicine }}</p>
                  <span :class="['text-xs font-bold shrink-0 ml-1', entry.qty > 0 ? 'text-green-600' : entry.qty < 0 ? 'text-red-600' : 'text-gray-500']">
                    {{ entry.qty > 0 ? '+' : '' }}{{ entry.qty !== 0 ? entry.qty : '' }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">{{ entry.note }}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span :class="['inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide', timelineColor(entry.type).badge]">
                    {{ entry.type.replace('_',' ') }}
                  </span>
                  <span class="text-[10px] text-gray-400">{{ entry.user }}</span>
                  <span class="text-[10px] text-gray-300 ml-auto">{{ formatTime(entry.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Category Breakdown ────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 class="text-base font-bold text-gray-900 mb-5">Stock by Category</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="cat in categoryBreakdown"
          :key="cat.name"
          class="group p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-150 cursor-default"
        >
          <div class="flex items-center justify-between mb-3">
            <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-semibold', catColor(cat.name).badge]">{{ cat.name }}</span>
            <span class="text-xs font-bold text-gray-500">{{ cat.count }} SKUs</span>
          </div>
          <p class="text-xl font-extrabold text-gray-900">{{ cat.totalStock.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-0.5">units in stock</p>
          <div class="mt-3 space-y-1">
            <div class="flex justify-between text-[10px] text-gray-400">
              <span>Value</span>
              <span>৳{{ cat.value.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                :class="['h-1.5 rounded-full', catColor(cat.name).bar ?? 'bg-brand-500']"
                :style="`width:${cat.pct}%`"
              />
            </div>
          </div>
          <div class="mt-2 flex gap-2 text-[10px]">
            <span v-if="cat.lowStock"  class="text-amber-600 font-semibold">⚠ {{ cat.lowStock }} low</span>
            <span v-if="cat.expired"   class="text-red-600 font-semibold">✕ {{ cat.expired }} expired</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- INVENTORY DETAIL MODAL                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <BaseModal v-model="showDetail" :title="detailMed?.name ?? ''" subtitle="Inventory details" size="lg">
      <div v-if="detailMed" class="space-y-5">
        <!-- Status row -->
        <div class="flex flex-wrap gap-2">
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', invStatusBadge(detailMed)]">{{ invStatusLabel(detailMed) }}</span>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', expiryBadgeClass(detailMed.expiry)]">Expires {{ detailMed.expiry }}</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{{ detailMed.dosage_form }}</span>
        </div>

        <!-- Stock level bar -->
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-semibold text-gray-700">Current Stock</span>
            <span :class="['font-extrabold text-lg', stockNumColor(detailMed)]">{{ detailMed.stock }} units</span>
          </div>
          <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="['h-4 rounded-full transition-all duration-700', stockBarClass(detailMed)]"
              :style="`width:${Math.min(100, Math.max(2,(detailMed.stock/Math.max(detailMed.reorder,1))*100))}%`"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>0</span>
            <span>Reorder: {{ detailMed.reorder }}</span>
            <span>{{ Math.round((detailMed.stock/Math.max(detailMed.reorder,1))*100) }}%</span>
          </div>
        </div>

        <!-- Info grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Batch Number</p>
            <p class="text-sm font-mono font-semibold text-gray-900 mt-0.5">{{ detailMed.batch }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Manufacturer</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ detailMed.manufacturer }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Purchase Price</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">৳{{ detailMed.cost.toFixed(2) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Inventory Value</p>
            <p class="text-sm font-semibold text-brand-700 mt-0.5">৳{{ (detailMed.cost * detailMed.stock).toLocaleString('en-US', {minimumFractionDigits:2}) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Supplier</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ supplierName(detailMed.supplier_id) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ detailMed.category }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showDetail = false" class="btn-outline">Close</button>
        <button @click="showAdjustModal = true; showDetail = false" class="btn-primary">
          <AdjustmentsHorizontalIcon class="w-4 h-4" /> Adjust Stock
        </button>
      </template>
    </BaseModal>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- STOCK ADJUSTMENT MODAL                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <BaseModal v-model="showAdjustModal" title="Stock Adjustment" subtitle="Update stock quantity for a medicine." size="sm">
      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Medicine <span class="text-red-400">*</span></label>
          <select v-model="adjustForm.medicine_id" class="form-input">
            <option value="">Select medicine…</option>
            <option v-for="m in store.medicines" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Adjustment Type <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="t in adjustTypes"
              :key="t.value"
              :class="['py-2 rounded-lg border text-xs font-semibold transition-all', adjustForm.type === t.value ? t.active : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
              @click="adjustForm.type = t.value"
            >{{ t.label }}</button>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Quantity <span class="text-red-400">*</span></label>
          <input v-model.number="adjustForm.qty" type="number" min="1" placeholder="Enter quantity" class="form-input" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Reason / Note</label>
          <textarea v-model="adjustForm.note" rows="2" placeholder="e.g. Stock count correction" class="form-input resize-none py-2" />
        </div>
      </div>
      <template #footer>
        <button @click="showAdjustModal = false" class="btn-outline">Cancel</button>
        <button @click="submitAdjustment" :disabled="adjustLoading" class="btn-primary">
          <span v-if="adjustLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Apply Adjustment
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePharmacyStore }   from '@/stores/pharmacyStore.js'
import { inventoryTimeline, medicineCategories, mockSuppliers } from '@/data/mockData.js'
import BaseModal from '@/components/common/BaseModal.vue'
import {
  ArrowDownTrayIcon, DocumentArrowDownIcon, AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon, ArrowsUpDownIcon, ExclamationTriangleIcon,
  ArrowUpIcon, ArrowDownIcon, ArrowPathIcon, ArchiveBoxXMarkIcon,
  ArchiveBoxIcon, BellAlertIcon, CheckCircleIcon
} from '@heroicons/vue/24/outline'

// ── Store ──────────────────────────────────────────────────────────────────
const store       = usePharmacyStore()
const medicines   = computed(() => store.medicines)
const suppliers   = mockSuppliers
const categories  = medicineCategories
const timeline    = inventoryTimeline

// ── Expiry counts ──────────────────────────────────────────────────────────
const today = new Date()
function daysTo(dateStr) { return (new Date(dateStr) - today) / 86400000 }

const expiredCount    = computed(() => medicines.value.filter(m => daysTo(m.expiry) < 0).length)
const expiring30Count = computed(() => medicines.value.filter(m => { const d = daysTo(m.expiry); return d >= 0 && d <= 30 }).length)
const expiring60Count = computed(() => medicines.value.filter(m => { const d = daysTo(m.expiry); return d > 30 && d <= 60 }).length)
const expiringCount   = computed(() => expiring30Count.value + expiring60Count.value)

// ── Summary cards ──────────────────────────────────────────────────────────
const summaryCards = computed(() => {
  const totalStock = medicines.value.reduce((s, m) => s + m.stock, 0)
  const lowCount   = store.lowStockMedicines.length
  const expCount   = store.expiredMedicines.length
  const invValue   = store.totalInventoryValue

  return [
    {
      label: 'Total Stock',       value: totalStock.toLocaleString(),
      sub: `${medicines.value.length} SKUs tracked`,
      icon: ArchiveBoxIcon,     iconBg: 'bg-brand-50', iconColor: 'text-brand-600',
      border: 'border-gray-100', blob: 'bg-brand-400', subColor: 'text-brand-600'
    },
    {
      label: 'Low Stock Items',   value: lowCount,
      sub: `Need reordering soon`,
      icon: BellAlertIcon,       iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      border: 'border-amber-100', blob: 'bg-amber-400', subColor: 'text-amber-600'
    },
    {
      label: 'Expired Items',     value: expiredCount.value,
      sub: `Requires disposal`,
      icon: ArchiveBoxXMarkIcon, iconBg: 'bg-red-50',   iconColor: 'text-red-600',
      border: 'border-red-100',   blob: 'bg-red-400',   subColor: 'text-red-600'
    },
    {
      label: 'Inventory Value',   value: '৳' + invValue.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      sub: `Based on purchase price`,
      icon: CheckCircleIcon,     iconBg: 'bg-green-50', iconColor: 'text-green-600',
      border: 'border-green-100', blob: 'bg-green-400', subColor: 'text-green-600'
    },
  ]
})

// ── Table filter/sort/pagination ───────────────────────────────────────────
const search         = ref('')
const filterStatus   = ref('')
const filterCategory = ref('')
const sortKey        = ref('')
const sortDir        = ref('asc')
const invPage        = ref(1)
const invPerPage     = 15

function invStatusLabel(med) {
  if (daysTo(med.expiry) < 0 || med.status === 'expired') return 'Expired'
  if (med.stock === 0)          return 'Out of Stock'
  if (med.stock < med.reorder * 0.25) return 'Critical'
  if (med.stock < med.reorder)  return 'Low Stock'
  return 'Healthy'
}

const filteredInv = computed(() => {
  let list = medicines.value

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.batch.toLowerCase().includes(q))
  }
  if (filterCategory.value) list = list.filter(m => m.category === filterCategory.value)
  if (filterStatus.value) {
    list = list.filter(m => {
      const s = invStatusLabel(m).toLowerCase().replace(' ','')
      const f = filterStatus.value.replace(' ','')
      return s === f
    })
  }
  if (sortKey.value) {
    const dir = sortDir.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const va = a[sortKey.value], vb = b[sortKey.value]
      if (typeof va === 'string') return va.localeCompare(vb) * dir
      return (va - vb) * dir
    })
  }
  return list
})

const invTotalPages = computed(() => Math.max(1, Math.ceil(filteredInv.value.length / invPerPage)))
const paginatedInv  = computed(() => {
  const start = (invPage.value - 1) * invPerPage
  return filteredInv.value.slice(start, start + invPerPage)
})
const invDisplayPages = computed(() => {
  const tp = invTotalPages.value
  if (tp <= 5) return Array.from({ length: tp }, (_, i) => i + 1)
  const p = invPage.value
  if (p <= 3) return [1, 2, 3, '…', tp]
  if (p >= tp - 2) return [1, '…', tp-2, tp-1, tp]
  return [1, '…', p, '…', tp]
})

watch([search, filterStatus, filterCategory], () => { invPage.value = 1 })

// ── Category breakdown ─────────────────────────────────────────────────────
const categoryBreakdown = computed(() => {
  const totalStock = medicines.value.reduce((s, m) => s + m.stock, 0) || 1
  return categories.map(cat => {
    const meds = medicines.value.filter(m => m.category === cat)
    const ts   = meds.reduce((s, m) => s + m.stock, 0)
    const val  = meds.reduce((s, m) => s + m.cost * m.stock, 0)
    return {
      name:       cat,
      count:      meds.length,
      totalStock: ts,
      value:      val,
      pct:        Math.round((ts / totalStock) * 100),
      lowStock:   meds.filter(m => m.stock > 0 && m.stock < m.reorder).length,
      expired:    meds.filter(m => m.status === 'expired').length,
    }
  }).sort((a, b) => b.totalStock - a.totalStock)
})

// ── Styling helpers ────────────────────────────────────────────────────────
function supplierName(id) { return suppliers.find(s => s.id === id)?.name ?? '—' }

function stockNumColor(med) {
  const s = invStatusLabel(med)
  return { Healthy: 'text-gray-900', 'Low Stock': 'text-amber-600', Critical: 'text-orange-600', 'Out of Stock': 'text-gray-400', Expired: 'text-red-600' }[s] ?? 'text-gray-900'
}
function stockBarClass(med) {
  const s = invStatusLabel(med)
  return { Healthy: 'bg-green-500', 'Low Stock': 'bg-amber-400', Critical: 'bg-orange-500', 'Out of Stock': 'bg-gray-300', Expired: 'bg-red-400' }[s] ?? 'bg-gray-300'
}
function invStatusBadge(med) {
  const s = invStatusLabel(med)
  return {
    Healthy:       'bg-green-50 text-green-700 ring-1 ring-green-200',
    'Low Stock':   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Critical:      'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    'Out of Stock':'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    Expired:       'bg-red-50 text-red-700 ring-1 ring-red-200',
  }[s] ?? 'bg-gray-100 text-gray-500'
}
function invStatusDot(med) {
  const s = invStatusLabel(med)
  return { Healthy:'bg-green-500','Low Stock':'bg-amber-400',Critical:'bg-orange-500','Out of Stock':'bg-gray-400',Expired:'bg-red-500' }[s]
}
function rowHighlight(med) {
  const s = invStatusLabel(med)
  return {
    Expired:       'bg-red-50/20 hover:bg-red-50/40',
    Critical:      'bg-orange-50/20 hover:bg-orange-50/40',
    'Low Stock':   'hover:bg-amber-50/30',
    'Out of Stock':'hover:bg-gray-50',
  }[s] ?? 'hover:bg-brand-50/20'
}
function expiryBadgeClass(dateStr) {
  const d = daysTo(dateStr)
  if (d < 0)   return 'bg-red-100 text-red-700'
  if (d <= 30) return 'bg-orange-50 text-orange-700'
  if (d <= 60) return 'bg-amber-50 text-amber-600'
  return 'bg-gray-100 text-gray-500'
}

const CAT_COLORS = {
  Analgesic:      { bg:'bg-blue-100',   text:'text-blue-700',   badge:'bg-blue-50 text-blue-700',   bar:'bg-blue-500'   },
  Antibiotic:     { bg:'bg-green-100',  text:'text-green-700',  badge:'bg-green-50 text-green-700', bar:'bg-green-500'  },
  Antidiabetic:   { bg:'bg-purple-100', text:'text-purple-700', badge:'bg-purple-50 text-purple-700',bar:'bg-purple-500' },
  Cardiac:        { bg:'bg-red-100',    text:'text-red-700',    badge:'bg-red-50 text-red-700',     bar:'bg-red-500'    },
  Antacid:        { bg:'bg-orange-100', text:'text-orange-700', badge:'bg-orange-50 text-orange-700',bar:'bg-orange-500' },
  Antihistamine:  { bg:'bg-sky-100',    text:'text-sky-700',    badge:'bg-sky-50 text-sky-700',     bar:'bg-sky-500'    },
  Vitamin:        { bg:'bg-yellow-100', text:'text-yellow-700', badge:'bg-yellow-50 text-yellow-700',bar:'bg-yellow-500' },
  Respiratory:    { bg:'bg-teal-100',   text:'text-teal-700',   badge:'bg-teal-50 text-teal-700',   bar:'bg-teal-500'   },
  Neurological:   { bg:'bg-indigo-100', text:'text-indigo-700', badge:'bg-indigo-50 text-indigo-700',bar:'bg-indigo-500' },
  Ophthalmic:     { bg:'bg-cyan-100',   text:'text-cyan-700',   badge:'bg-cyan-50 text-cyan-700',   bar:'bg-cyan-500'   },
  Dermatology:    { bg:'bg-pink-100',   text:'text-pink-700',   badge:'bg-pink-50 text-pink-700',   bar:'bg-pink-500'   },
  Hormonal:       { bg:'bg-rose-100',   text:'text-rose-700',   badge:'bg-rose-50 text-rose-700',   bar:'bg-rose-500'   },
  Corticosteroid: { bg:'bg-amber-100',  text:'text-amber-700',  badge:'bg-amber-50 text-amber-700', bar:'bg-amber-500'  },
}
function catColor(cat) { return CAT_COLORS[cat] ?? { bg:'bg-gray-100',text:'text-gray-600',badge:'bg-gray-100 text-gray-600',bar:'bg-gray-400' } }

// ── Timeline helpers ───────────────────────────────────────────────────────
function timelineColor(type) {
  return {
    received:   { bg:'bg-green-100', icon:'text-green-600', badge:'bg-green-100 text-green-700'   },
    dispensed:  { bg:'bg-blue-100',  icon:'text-blue-600',  badge:'bg-blue-100 text-blue-700'     },
    adjustment: { bg:'bg-amber-100', icon:'text-amber-600', badge:'bg-amber-100 text-amber-700'   },
    disposed:   { bg:'bg-red-100',   icon:'text-red-600',   badge:'bg-red-100 text-red-700'       },
    low_stock:  { bg:'bg-orange-100',icon:'text-orange-600',badge:'bg-orange-100 text-orange-700' },
  }[type] ?? { bg:'bg-gray-100', icon:'text-gray-500', badge:'bg-gray-100 text-gray-600' }
}
function timelineIcon(type) {
  return { received:ArrowDownIcon, dispensed:ArrowUpIcon, adjustment:ArrowPathIcon, disposed:ArchiveBoxXMarkIcon, low_stock:BellAlertIcon }[type] ?? ArchiveBoxIcon
}
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:true })
}

// ── Inventory detail modal ─────────────────────────────────────────────────
const showDetail = ref(false)
const detailMed  = ref(null)
function openInvDetail(med) { detailMed.value = med; showDetail.value = true }

// ── Stock adjustment modal ─────────────────────────────────────────────────
const showAdjustModal = ref(false)
const adjustLoading   = ref(false)
const adjustTypes = [
  { value: 'add',     label: '+ Add',    active: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'remove',  label: '- Remove', active: 'border-red-500 bg-red-50 text-red-700'       },
  { value: 'set',     label: '= Set',    active: 'border-brand-500 bg-brand-50 text-brand-700' },
]
const adjustForm = ref({ medicine_id: '', type: 'add', qty: '', note: '' })

async function submitAdjustment() {
  if (!adjustForm.value.medicine_id || !adjustForm.value.qty) return
  adjustLoading.value = true
  await new Promise(r => setTimeout(r, 500))
  const med = store.medicines.find(m => m.id === adjustForm.value.medicine_id)
  if (med) {
    let newStock = med.stock
    if (adjustForm.value.type === 'add')    newStock += adjustForm.value.qty
    if (adjustForm.value.type === 'remove') newStock = Math.max(0, newStock - adjustForm.value.qty)
    if (adjustForm.value.type === 'set')    newStock = adjustForm.value.qty
    store.updateMedicine({ ...med, stock: newStock })
  }
  adjustLoading.value = false
  showAdjustModal.value = false
  adjustForm.value = { medicine_id: '', type: 'add', qty: '', note: '' }
}

// ── Exports ────────────────────────────────────────────────────────────────
function exportCSV() {
  const headers = ['Medicine','Batch','Category','Stock','Reorder','Expiry','Status','Inv.Value']
  const rows = filteredInv.value.map(m => [
    m.name, m.batch, m.category, m.stock, m.reorder, m.expiry,
    invStatusLabel(m), (m.cost * m.stock).toFixed(2)
  ])
  const csv  = [headers,...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type:'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'inventory.csv'; a.click()
  URL.revokeObjectURL(url)
}
function exportPDF() {
  // TODO: wire to a PDF library (e.g. jsPDF) in production
  alert('PDF export will be available when connected to the backend.')
}
</script>

<style scoped>
.btn-primary  { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm; }
.btn-outline  { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors; }
.th-cell      { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
.filter-select{ @apply h-9 rounded-lg border border-gray-200 text-sm text-gray-600 px-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all; }
.form-input   { @apply w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-gray-400; }
.form-input[rows]{ @apply h-auto py-2.5; }
.page-btn     { @apply h-7 min-w-[28px] px-1.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors; }
</style>
