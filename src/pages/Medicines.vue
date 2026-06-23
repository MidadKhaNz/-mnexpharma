<template>
  <div class="space-y-5">

    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Medicines</h1>
        <p class="page-subtitle">Formulary management — {{ totalCount }} medicines registered.</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="exportCSV" class="btn-outline">
          <ArrowDownTrayIcon class="w-4 h-4" /> Export
        </button>
        <button @click="openAdd" class="btn-primary">
          <PlusIcon class="w-4 h-4" /> Add Medicine
        </button>
      </div>
    </div>

    <!-- ── Summary Chips ────────────────────────────────────────────────── -->
    <div class="flex flex-wrap gap-3">
      <button
        v-for="chip in chips"
        :key="chip.key"
        :class="['inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                 activeChip === chip.key
                   ? chip.active
                   : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300']"
        @click="toggleChip(chip.key)"
      >
        <span :class="['w-1.5 h-1.5 rounded-full', chip.dot]" />
        {{ chip.label }} ({{ chip.count }})
      </button>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="p-4 flex flex-wrap gap-3 items-center border-b border-gray-100">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search name, generic or batch…"
            class="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        <!-- Category filter -->
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Supplier filter -->
        <select v-model="filterSupplier" class="filter-select">
          <option value="">All Suppliers</option>
          <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>

        <!-- Sort -->
        <select v-model="sortKey" class="filter-select">
          <option value="">Sort by…</option>
          <option value="name">Name</option>
          <option value="stock">Stock</option>
          <option value="expiry">Expiry Date</option>
          <option value="price">Price</option>
          <option value="cost">Cost</option>
        </select>

        <button
          v-if="sortKey"
          @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
          class="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          :title="sortDir === 'asc' ? 'Ascending' : 'Descending'"
        >
          <ArrowsUpDownIcon class="w-4 h-4" :class="sortDir === 'desc' ? 'rotate-180' : ''" />
        </button>

        <!-- Clear -->
        <button v-if="hasFilters" @click="clearFilters" class="h-9 px-3 rounded-lg text-xs text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
          Clear
        </button>

        <!-- Results count -->
        <span class="ml-auto text-xs text-gray-400 whitespace-nowrap">
          {{ paginated.length }} of {{ filtered.length }} results
        </span>
      </div>

      <!-- ── Table ─────────────────────────────────────────────────────── -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th-cell">#</th>
              <th class="th-cell cursor-pointer hover:text-brand-600" @click="setSort('name')">
                <div class="flex items-center gap-1">Medicine Name <SortIcon field="name" /></div>
              </th>
              <th class="th-cell hidden lg:table-cell">Generic Name</th>
              <th class="th-cell hidden md:table-cell">Category</th>
              <th class="th-cell hidden xl:table-cell">Manufacturer</th>
              <th class="th-cell hidden xl:table-cell">Batch No.</th>
              <th class="th-cell hidden md:table-cell cursor-pointer hover:text-brand-600" @click="setSort('cost')">
                <div class="flex items-center gap-1">Purchase <SortIcon field="cost" /></div>
              </th>
              <th class="th-cell cursor-pointer hover:text-brand-600" @click="setSort('price')">
                <div class="flex items-center gap-1">Sell Price <SortIcon field="price" /></div>
              </th>
              <th class="th-cell cursor-pointer hover:text-brand-600 text-center" @click="setSort('stock')">
                <div class="flex items-center justify-center gap-1">Stock <SortIcon field="stock" /></div>
              </th>
              <th class="th-cell hidden md:table-cell cursor-pointer hover:text-brand-600" @click="setSort('expiry')">
                <div class="flex items-center gap-1">Expiry <SortIcon field="expiry" /></div>
              </th>
              <th class="th-cell hidden lg:table-cell">Supplier</th>
              <th class="th-cell text-center">Status</th>
              <th class="th-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in perPage" :key="n">
                <td v-for="c in 8" :key="c" class="px-4 py-3">
                  <div class="h-4 bg-gray-100 rounded animate-pulse" :style="`width:${40+Math.random()*40}%`" />
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-else-if="!paginated.length">
              <td colspan="13" class="py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <BeakerIcon class="w-7 h-7 text-gray-300" />
                  </div>
                  <p class="font-semibold text-gray-500">No medicines found</p>
                  <p class="text-xs text-gray-400">Try adjusting your search or filters.</p>
                  <button @click="clearFilters" class="text-xs text-brand-600 hover:underline">Clear all filters</button>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="(med, i) in paginated"
              :key="med.id"
              class="group hover:bg-brand-50/30 transition-colors duration-100 cursor-pointer"
              @click="openView(med)"
            >
              <td class="px-4 py-3 text-gray-400 text-xs">{{ (page-1)*perPage + i + 1 }}</td>

              <!-- Name + dosage form -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold', categoryColor(med.category).bg, categoryColor(med.category).text]">
                    {{ med.category.slice(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm leading-tight">{{ med.name }}</p>
                    <p class="text-[10px] text-gray-400 leading-tight">{{ med.dosage_form }}</p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3 text-gray-500 text-sm hidden lg:table-cell">{{ med.generic }}</td>

              <td class="px-4 py-3 hidden md:table-cell">
                <span :class="['inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium', categoryColor(med.category).badge]">
                  {{ med.category }}
                </span>
              </td>

              <td class="px-4 py-3 text-gray-500 text-xs hidden xl:table-cell truncate max-w-[160px]">{{ med.manufacturer }}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-500 hidden xl:table-cell">{{ med.batch }}</td>

              <td class="px-4 py-3 text-gray-600 text-sm hidden md:table-cell">৳{{ med.cost.toFixed(2) }}</td>
              <td class="px-4 py-3 font-semibold text-gray-900 text-sm">৳{{ med.price.toFixed(2) }}</td>

              <!-- Stock with inline mini-bar -->
              <td class="px-4 py-3 text-center" @click.stop>
                <div class="flex flex-col items-center gap-1">
                  <span :class="['text-sm font-bold', stockColor(med)]">{{ med.stock }}</span>
                  <div class="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div :class="['h-1 rounded-full', stockBarColor(med)]" :style="`width:${Math.min(100, (med.stock/med.reorder)*100)}%`" />
                  </div>
                </div>
              </td>

              <!-- Expiry -->
              <td class="px-4 py-3 hidden md:table-cell">
                <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', expiryBadge(med.expiry)]">
                  {{ med.expiry }}
                </span>
              </td>

              <!-- Supplier -->
              <td class="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell truncate max-w-[140px]">
                {{ supplierName(med.supplier_id) }}
              </td>

              <!-- Status -->
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', statusBadge(med)]">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(med)" />
                  {{ medStatus(med) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openView(med)" class="action-btn text-blue-500 hover:bg-blue-50" title="View">
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button @click.stop="openEdit(med)" class="action-btn text-amber-500 hover:bg-amber-50" title="Edit">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click.stop="openDelete(med)" class="action-btn text-red-500 hover:bg-red-50" title="Delete">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ─────────────────────────────────────────────────── -->
      <div class="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>Show</span>
          <select v-model="perPage" class="h-7 rounded border border-gray-200 text-xs px-1.5 bg-white">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>per page — {{ filtered.length }} total</span>
        </div>
        <div class="flex items-center gap-1">
          <button :disabled="page <= 1" @click="page--" class="page-btn">‹ Prev</button>
          <button
            v-for="p in displayPages"
            :key="p"
            :class="['page-btn', p === page ? 'bg-brand-600 text-white border-brand-600' : '']"
            @click="p !== '…' && (page = p)"
          >{{ p }}</button>
          <button :disabled="page >= totalPages" @click="page++" class="page-btn">Next ›</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- VIEW MODAL                                                          -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <BaseModal v-model="showView" :title="viewMed?.name ?? ''" subtitle="Full medicine details" size="lg">
      <div v-if="viewMed" class="space-y-5">
        <!-- Header badge row -->
        <div class="flex flex-wrap items-center gap-2">
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', categoryColor(viewMed.category).badge]">{{ viewMed.category }}</span>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', statusBadge(viewMed)]">{{ medStatus(viewMed) }}</span>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', expiryBadge(viewMed.expiry)]">Expires {{ viewMed.expiry }}</span>
        </div>

        <!-- Detail grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Generic Name"   :value="viewMed.generic" />
          <DetailRow label="Dosage Form"    :value="viewMed.dosage_form" />
          <DetailRow label="Strength"       :value="viewMed.strength" />
          <DetailRow label="Manufacturer"   :value="viewMed.manufacturer" />
          <DetailRow label="Batch Number"   :value="viewMed.batch" mono />
          <DetailRow label="Supplier"       :value="supplierName(viewMed.supplier_id)" />
          <DetailRow label="Purchase Price" :value="`৳${viewMed.cost.toFixed(2)}`" />
          <DetailRow label="Selling Price"  :value="`৳${viewMed.price.toFixed(2)}`" />
          <DetailRow label="Stock Quantity" :value="`${viewMed.stock} units`" />
          <DetailRow label="Reorder Level"  :value="`${viewMed.reorder} units`" />
          <DetailRow label="Expiry Date"    :value="viewMed.expiry" />
          <DetailRow label="Profit Margin"  :value="`৳${(viewMed.price - viewMed.cost).toFixed(2)} (${(((viewMed.price - viewMed.cost)/viewMed.price)*100).toFixed(1)}%)`" />
        </div>

        <!-- Description -->
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</p>
          <p class="text-sm text-gray-700">{{ viewMed.description }}</p>
        </div>

        <!-- Stock bar -->
        <div>
          <div class="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Stock Level</span>
            <span>{{ viewMed.stock }} / {{ viewMed.reorder }} reorder point</span>
          </div>
          <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="['h-3 rounded-full transition-all duration-700', stockBarColor(viewMed)]"
              :style="`width:${Math.min(100, (viewMed.stock/Math.max(viewMed.reorder, 1))*100)}%`"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showView = false; openEdit(viewMed)" class="btn-outline">
          <PencilIcon class="w-4 h-4" /> Edit
        </button>
        <button @click="showView = false" class="btn-primary">Close</button>
      </template>
    </BaseModal>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- ADD / EDIT MODAL                                                    -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <BaseModal
      v-model="showForm"
      :title="editMed ? 'Edit Medicine' : 'Add New Medicine'"
      :subtitle="editMed ? `Editing: ${editMed.name}` : 'Fill in the medicine details below.'"
      size="xl"
    >
      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Row 1 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Medicine Name" required>
            <input v-model="form.name" type="text" placeholder="e.g. Paracetamol 500mg" class="form-input" required />
          </FormField>
          <FormField label="Generic Name" required>
            <input v-model="form.generic" type="text" placeholder="e.g. Paracetamol" class="form-input" required />
          </FormField>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Category" required>
            <select v-model="form.category" class="form-input" required>
              <option value="">Select…</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </FormField>
          <FormField label="Dosage Form" required>
            <select v-model="form.dosage_form" class="form-input" required>
              <option value="">Select…</option>
              <option v-for="f in dosageForms" :key="f" :value="f">{{ f }}</option>
            </select>
          </FormField>
          <FormField label="Strength">
            <input v-model="form.strength" type="text" placeholder="e.g. 500mg" class="form-input" />
          </FormField>
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Manufacturer" required>
            <input v-model="form.manufacturer" type="text" placeholder="e.g. Square Pharmaceuticals" class="form-input" required />
          </FormField>
          <FormField label="Batch Number" required>
            <input v-model="form.batch" type="text" placeholder="e.g. BT-SQ-24-001" class="form-input" required />
          </FormField>
        </div>

        <!-- Row 4 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Supplier" required>
            <select v-model="form.supplier_id" class="form-input" required>
              <option value="">Select supplier…</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </FormField>
          <FormField label="Expiry Date" required>
            <input v-model="form.expiry" type="date" class="form-input" required />
          </FormField>
        </div>

        <!-- Row 5 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FormField label="Purchase Price (৳)" required>
            <input v-model.number="form.cost" type="number" step="0.01" min="0" placeholder="0.00" class="form-input" required />
          </FormField>
          <FormField label="Selling Price (৳)" required>
            <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="0.00" class="form-input" required />
          </FormField>
          <FormField label="Stock Quantity" required>
            <input v-model.number="form.stock" type="number" min="0" placeholder="0" class="form-input" required />
          </FormField>
          <FormField label="Reorder Level" required>
            <input v-model.number="form.reorder" type="number" min="1" placeholder="50" class="form-input" required />
          </FormField>
        </div>

        <!-- Margin indicator -->
        <div v-if="form.price && form.cost" class="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <div class="flex-1">
            <p class="text-xs text-green-700 font-medium">Profit Margin</p>
            <p class="text-lg font-bold text-green-800">৳{{ (form.price - form.cost).toFixed(2) }}
              <span class="text-sm font-normal">({{ form.price > 0 ? (((form.price-form.cost)/form.price)*100).toFixed(1) : 0 }}%)</span>
            </p>
          </div>
        </div>

        <!-- Description -->
        <FormField label="Description">
          <textarea v-model="form.description" rows="2" placeholder="Brief description of the medicine…" class="form-input resize-none" />
        </FormField>
      </form>

      <template #footer>
        <button @click="showForm = false" class="btn-outline">Cancel</button>
        <button @click="submitForm" :disabled="formLoading" class="btn-primary">
          <span v-if="formLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {{ editMed ? 'Save Changes' : 'Add Medicine' }}
        </button>
      </template>
    </BaseModal>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- DELETE CONFIRM MODAL                                                -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <BaseModal v-model="showDelete" title="Delete Medicine" size="sm">
      <div class="flex flex-col items-center text-center gap-4 py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <TrashIcon class="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p class="font-semibold text-gray-900">Are you sure?</p>
          <p class="text-sm text-gray-500 mt-1">
            You are about to delete <span class="font-semibold text-gray-800">{{ deleteMed?.name }}</span>.
            This action cannot be undone.
          </p>
        </div>
        <div class="w-full bg-red-50 border border-red-100 rounded-xl p-3 text-left">
          <p class="text-xs text-red-700"><span class="font-semibold">Batch:</span> {{ deleteMed?.batch }}</p>
          <p class="text-xs text-red-700 mt-1"><span class="font-semibold">Stock:</span> {{ deleteMed?.stock }} units</p>
        </div>
      </div>

      <template #footer>
        <button @click="showDelete = false" class="btn-outline">Cancel</button>
        <button @click="confirmDelete" :disabled="deleteLoading" class="btn-danger">
          <span v-if="deleteLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <TrashIcon v-else class="w-4 h-4" />
          Delete Medicine
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { medicineCategories, mockSuppliers } from '@/data/mockData.js'
import BaseModal from '@/components/common/BaseModal.vue'
import {
  PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowsUpDownIcon,
  EyeIcon, PencilIcon, TrashIcon, BeakerIcon, ChevronUpIcon, ChevronDownIcon
} from '@heroicons/vue/24/outline'

// ── Store ──────────────────────────────────────────────────────────────────
const store     = usePharmacyStore()
const medicines = computed(() => store.medicines)

// ── Filter/Sort/Search state ───────────────────────────────────────────────
const search         = ref('')
const filterCategory = ref('')
const filterSupplier = ref('')
const sortKey        = ref('')
const sortDir        = ref('asc')
const activeChip     = ref('')
const page           = ref(1)
const perPage        = ref(10)
const loading        = ref(false)

// ── Static data ────────────────────────────────────────────────────────────
const categories  = medicineCategories
const suppliers   = mockSuppliers
const dosageForms = ['Tablet','Capsule','Syrup','Injection','Cream','Ointment','Eye Drop','Inhaler','Drop','Suspension','Powder','Gel']

// ── Quick filter chips ─────────────────────────────────────────────────────
const chips = computed(() => [
  { key: 'all',      label: 'All',        count: medicines.value.length,                                                    dot: 'bg-gray-400',  active: 'bg-gray-800 text-white border-gray-800' },
  { key: 'active',   label: 'Active',     count: medicines.value.filter(m => medStatus(m) === 'Active').length,             dot: 'bg-green-500', active: 'bg-green-600 text-white border-green-600' },
  { key: 'low',      label: 'Low Stock',  count: medicines.value.filter(m => m.stock > 0 && m.stock < m.reorder).length,   dot: 'bg-amber-400', active: 'bg-amber-500 text-white border-amber-500' },
  { key: 'expired',  label: 'Expired',    count: medicines.value.filter(m => m.status === 'expired').length,                dot: 'bg-red-500',   active: 'bg-red-600 text-white border-red-600' },
  { key: 'outstock', label: 'Out of Stock',count: medicines.value.filter(m => m.stock === 0).length,                       dot: 'bg-gray-600',  active: 'bg-gray-700 text-white border-gray-700' },
])
const totalCount = computed(() => medicines.value.length)

function toggleChip(key) {
  activeChip.value = activeChip.value === key ? '' : key
  page.value = 1
}

// ── Computed: filtered + sorted + paginated ────────────────────────────────
const filtered = computed(() => {
  let list = medicines.value

  // Quick chip
  if (activeChip.value === 'active')   list = list.filter(m => medStatus(m) === 'Active')
  if (activeChip.value === 'low')      list = list.filter(m => m.stock > 0 && m.stock < m.reorder)
  if (activeChip.value === 'expired')  list = list.filter(m => m.status === 'expired')
  if (activeChip.value === 'outstock') list = list.filter(m => m.stock === 0)

  // Text search
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.generic.toLowerCase().includes(q) ||
      m.batch.toLowerCase().includes(q)
    )
  }

  // Dropdowns
  if (filterCategory.value) list = list.filter(m => m.category === filterCategory.value)
  if (filterSupplier.value) list = list.filter(m => m.supplier_id === filterSupplier.value)

  // Sort
  if (sortKey.value) {
    const dir = sortDir.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      let va = a[sortKey.value], vb = b[sortKey.value]
      if (typeof va === 'string') return va.localeCompare(vb) * dir
      return (va - vb) * dir
    })
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))

const paginated = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

const displayPages = computed(() => {
  const tp = totalPages.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const p = page.value
  if (p <= 4) return [1, 2, 3, 4, 5, '…', tp]
  if (p >= tp - 3) return [1, '…', tp-4, tp-3, tp-2, tp-1, tp]
  return [1, '…', p-1, p, p+1, '…', tp]
})

// Reset page on filter change
watch([search, filterCategory, filterSupplier, activeChip, perPage], () => { page.value = 1 })

const hasFilters = computed(() => search.value || filterCategory.value || filterSupplier.value || activeChip.value)

function clearFilters() {
  search.value = ''
  filterCategory.value = ''
  filterSupplier.value = ''
  activeChip.value = ''
  sortKey.value = ''
  page.value = 1
}

function setSort(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function supplierName(id) {
  return suppliers.find(s => s.id === id)?.name ?? '—'
}

function medStatus(med) {
  if (med.status === 'expired') return 'Expired'
  if (med.stock === 0)          return 'Out of Stock'
  if (med.stock < med.reorder)  return 'Low Stock'
  return 'Active'
}

function expiryBadge(dateStr) {
  const days = (new Date(dateStr) - new Date()) / 86400000
  if (days < 0)   return 'bg-red-100 text-red-700'
  if (days <= 30) return 'bg-red-50 text-red-600'
  if (days <= 60) return 'bg-amber-50 text-amber-600'
  return 'bg-gray-100 text-gray-500'
}

function stockColor(med) {
  if (med.stock === 0)          return 'text-red-600'
  if (med.stock < med.reorder)  return 'text-amber-600'
  return 'text-gray-900'
}
function stockBarColor(med) {
  const pct = med.stock / med.reorder
  if (pct <= 0)   return 'bg-gray-400'
  if (pct < 0.25) return 'bg-red-500'
  if (pct < 1)    return 'bg-amber-400'
  return 'bg-green-500'
}

function statusBadge(med) {
  const s = medStatus(med)
  return {
    Active:       'bg-green-50 text-green-700 ring-1 ring-green-200',
    'Low Stock':  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    'Out of Stock':'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    Expired:      'bg-red-50 text-red-700 ring-1 ring-red-200',
  }[s] ?? 'bg-gray-100 text-gray-500'
}
function statusDot(med) {
  const s = medStatus(med)
  return { Active: 'bg-green-500', 'Low Stock': 'bg-amber-400', 'Out of Stock': 'bg-gray-500', Expired: 'bg-red-500' }[s]
}

const CAT_COLORS = {
  Analgesic:      { bg: 'bg-blue-100',   text: 'text-blue-700',   badge: 'bg-blue-50 text-blue-700'   },
  Antibiotic:     { bg: 'bg-green-100',  text: 'text-green-700',  badge: 'bg-green-50 text-green-700' },
  Antidiabetic:   { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-50 text-purple-700'},
  Cardiac:        { bg: 'bg-red-100',    text: 'text-red-700',    badge: 'bg-red-50 text-red-700'     },
  Antacid:        { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-50 text-orange-700'},
  Antihistamine:  { bg: 'bg-sky-100',    text: 'text-sky-700',    badge: 'bg-sky-50 text-sky-700'     },
  Vitamin:        { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-50 text-yellow-700'},
  Respiratory:    { bg: 'bg-teal-100',   text: 'text-teal-700',   badge: 'bg-teal-50 text-teal-700'   },
  Neurological:   { bg: 'bg-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-50 text-indigo-700'},
  Ophthalmic:     { bg: 'bg-cyan-100',   text: 'text-cyan-700',   badge: 'bg-cyan-50 text-cyan-700'   },
  Dermatology:    { bg: 'bg-pink-100',   text: 'text-pink-700',   badge: 'bg-pink-50 text-pink-700'   },
  Hormonal:       { bg: 'bg-rose-100',   text: 'text-rose-700',   badge: 'bg-rose-50 text-rose-700'   },
  Corticosteroid: { bg: 'bg-amber-100',  text: 'text-amber-700',  badge: 'bg-amber-50 text-amber-700' },
}
function categoryColor(cat) {
  return CAT_COLORS[cat] ?? { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' }
}

// ── Modals ─────────────────────────────────────────────────────────────────
const showView   = ref(false)
const showForm   = ref(false)
const showDelete = ref(false)
const viewMed    = ref(null)
const editMed    = ref(null)
const deleteMed  = ref(null)
const formLoading   = ref(false)
const deleteLoading = ref(false)

const blankForm = () => ({
  name: '', generic: '', category: '', dosage_form: '', strength: '',
  manufacturer: '', batch: '', supplier_id: '', expiry: '',
  cost: '', price: '', stock: '', reorder: 50, description: '', status: 'active'
})
const form = ref(blankForm())

function openView(med)   { viewMed.value = med; showView.value = true }
function openAdd()       { editMed.value = null; form.value = blankForm(); showForm.value = true }
function openEdit(med)   {
  if (!med) return
  editMed.value = med
  form.value = { ...med }
  showForm.value = true
}
function openDelete(med) { deleteMed.value = med; showDelete.value = true }

async function submitForm() {
  formLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  if (editMed.value) {
    store.updateMedicine({ ...form.value })
  } else {
    store.addMedicine({ ...form.value, id: Date.now() })
  }
  formLoading.value = false
  showForm.value = false
}

async function confirmDelete() {
  deleteLoading.value = true
  await new Promise(r => setTimeout(r, 500))
  store.deleteMedicine(deleteMed.value.id)
  deleteLoading.value = false
  showDelete.value = false
}

// ── Export (UI only) ───────────────────────────────────────────────────────
function exportCSV() {
  const headers = ['ID','Name','Generic','Category','Batch','Cost','Price','Stock','Expiry','Status']
  const rows = filtered.value.map(m => [
    m.id, m.name, m.generic, m.category, m.batch,
    m.cost, m.price, m.stock, m.expiry, medStatus(m)
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'medicines.csv'; a.click()
  URL.revokeObjectURL(url)
}
</script>

<!-- ── Sub-components (inline for colocation) ──────────────────────────── -->
<script>
// SortIcon — renders sort direction chevrons
const SortIcon = {
  props: ['field'],
  inject: ['sortKey', 'sortDir'],
  template: `
    <span class="flex flex-col ml-0.5 opacity-50">
      <svg class="w-2.5 h-2.5" :class="sortKey===field&&sortDir==='asc'?'opacity-100 text-brand-600':''" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5l5 5H5z"/></svg>
      <svg class="w-2.5 h-2.5 -mt-0.5" :class="sortKey===field&&sortDir==='desc'?'opacity-100 text-brand-600':''" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5-5h10z"/></svg>
    </span>`
}
// DetailRow — label/value pair for view modal
const DetailRow = {
  props: ['label','value','mono'],
  template: `
    <div class="bg-gray-50 rounded-xl p-3">
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{label}}</p>
      <p :class="['text-sm font-semibold text-gray-900 mt-0.5', mono ? 'font-mono' : '']">{{value || '—'}}</p>
    </div>`
}
// FormField — label wrapper
const FormField = {
  props: ['label','required'],
  template: `
    <div class="flex flex-col gap-1">
      <label class="text-xs font-semibold text-gray-600">{{label}}<span v-if="required" class="text-red-400 ml-0.5">*</span></label>
      <slot/>
    </div>`
}
export default { components: { SortIcon, DetailRow, FormField } }
</script>

<style scoped>
.btn-primary  { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm; }
.btn-outline  { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors; }
.btn-danger   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm; }
.th-cell      { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
.filter-select{ @apply h-9 rounded-lg border border-gray-200 text-sm text-gray-600 px-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all; }
.form-input   { @apply w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-gray-400; }
.form-input[rows]{ @apply h-auto py-2.5; }
.action-btn   { @apply p-1.5 rounded-lg transition-colors; }
.page-btn     { @apply h-8 min-w-[32px] px-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors; }
</style>
