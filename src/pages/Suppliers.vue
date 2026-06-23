<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Suppliers</h1>
        <p class="page-subtitle">Manage pharmaceutical suppliers and purchase relationships.</p>
      </div>
      <button @click="openAdd" class="btn-primary self-start sm:self-auto">
        <PlusIcon class="w-4 h-4" /> Add Supplier
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in summaryCards" :key="card.label" :class="['bg-white rounded-2xl border shadow-sm px-4 py-4 hover:shadow-md transition-all', card.border]">
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center mb-2', card.iconBg]">
          <component :is="card.icon" :class="['w-4 h-4', card.iconColor]" />
        </div>
        <p class="text-2xl font-extrabold text-gray-900">{{ card.value }}</p>
        <p class="text-xs font-medium text-gray-500 mt-0.5">{{ card.label }}</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search suppliers…" class="search-input" />
        </div>
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select v-model="filterRating" class="filter-select">
          <option value="">All Ratings</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★ (4+)</option>
          <option value="3">★★★ (3+)</option>
        </select>
        <span class="ml-auto text-xs text-gray-400">{{ filtered.length }} suppliers</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th">#</th>
              <th class="th">Supplier</th>
              <th class="th hidden md:table-cell">Phone</th>
              <th class="th hidden lg:table-cell">City</th>
              <th class="th hidden lg:table-cell">Rating</th>
              <th class="th hidden md:table-cell text-right">Purchase Value</th>
              <th class="th hidden sm:table-cell text-right">Outstanding</th>
              <th class="th text-center">Status</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="!paginated.length">
              <td colspan="9" class="py-16 text-center">
                <div class="flex flex-col items-center gap-2">
                  <BuildingStorefrontIcon class="w-10 h-10 text-gray-200" />
                  <p class="text-sm text-gray-400">No suppliers found.</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(sup, i) in paginated"
              :key="sup.id"
              class="hover:bg-gray-50/60 transition-colors group cursor-pointer"
              @click="openView(sup)"
            >
              <td class="px-4 py-3 text-gray-400 text-xs">{{ (page-1)*perPage+i+1 }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', avatarColor(sup.id)]">
                    {{ sup.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 leading-tight">{{ sup.name }}</p>
                    <p class="text-xs text-gray-400 truncate max-w-[180px]">{{ sup.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden md:table-cell">{{ sup.contact }}</td>
              <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">{{ sup.city }}</td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <span class="text-amber-400 text-xs tracking-tight">{{ '★'.repeat(sup.rating) }}<span class="text-gray-200">{{ '★'.repeat(5-sup.rating) }}</span></span>
              </td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900 hidden md:table-cell">
                ৳{{ supplierPurchases(sup.id).toLocaleString('en-US',{maximumFractionDigits:0}) }}
              </td>
              <td class="px-4 py-3 text-right hidden sm:table-cell">
                <span :class="supplierDues(sup.id)>0?'text-red-600 font-semibold':'text-gray-400'">
                  ৳{{ supplierDues(sup.id).toLocaleString('en-US',{maximumFractionDigits:0}) }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', sup.status==='active'?'bg-green-50 text-green-700 ring-1 ring-green-200':'bg-gray-100 text-gray-500 ring-1 ring-gray-200']">
                  <span :class="['w-1.5 h-1.5 rounded-full', sup.status==='active'?'bg-green-500':'bg-gray-400']" />
                  {{ sup.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openView(sup)"   class="action-btn text-blue-500 hover:bg-blue-50"><EyeIcon class="w-4 h-4" /></button>
                  <button @click.stop="openEdit(sup)"   class="action-btn text-amber-500 hover:bg-amber-50"><PencilIcon class="w-4 h-4" /></button>
                  <button @click.stop="openDelete(sup)" class="action-btn text-red-500 hover:bg-red-50"><TrashIcon class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400">{{ filtered.length }} suppliers · Page {{ page }} of {{ totalPages }}</p>
        <div class="flex gap-1">
          <button :disabled="page<=1" @click="page--" class="page-btn">‹</button>
          <button v-for="p in pageNums" :key="p" :class="['page-btn',p===page?'bg-brand-600 text-white border-brand-600':'']" @click="p!=='…'&&(page=p)">{{ p }}</button>
          <button :disabled="page>=totalPages" @click="page++" class="page-btn">›</button>
        </div>
      </div>
    </div>

    <!-- VIEW Modal -->
    <BaseModal v-model="showView" :title="viewSup?.name??''" subtitle="Supplier profile" size="lg">
      <div v-if="viewSup" class="space-y-5">
        <div class="flex flex-wrap gap-2">
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', viewSup.status==='active'?'bg-green-50 text-green-700':'bg-gray-100 text-gray-600']">{{ viewSup.status }}</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            {{ '★'.repeat(viewSup.rating) }}{{ '☆'.repeat(5-viewSup.rating) }}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="row in viewRows" :key="row.l" class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ row.l }}</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ row.v || '—' }}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supplied Medicines ({{ store.medicines.filter(m=>m.supplier_id===viewSup.id).length }} SKUs)</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="m in store.medicines.filter(m=>m.supplier_id===viewSup.id).slice(0,8)" :key="m.id" class="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">{{ m.name }}</span>
            <span v-if="store.medicines.filter(m=>m.supplier_id===viewSup.id).length>8" class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">+{{ store.medicines.filter(m=>m.supplier_id===viewSup.id).length-8 }} more</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showView=false;openEdit(viewSup)" class="btn-outline"><PencilIcon class="w-4 h-4" /> Edit</button>
        <button @click="showView=false" class="btn-primary">Close</button>
      </template>
    </BaseModal>

    <!-- ADD/EDIT Modal -->
    <BaseModal v-model="showForm" :title="editSup?'Edit Supplier':'Add Supplier'" :subtitle="editSup?`Editing: ${editSup.name}`:'Fill in supplier details.'" size="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Supplier Name <span class="text-red-400">*</span></label>
            <input v-model="form.name" type="text" placeholder="Company name" class="form-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Contact Person</label>
            <input v-model="form.contact_person" type="text" placeholder="Primary contact name" class="form-input" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Phone <span class="text-red-400">*</span></label>
            <input v-model="form.contact" type="tel" placeholder="+880-2-..." class="form-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Email</label>
            <input v-model="form.email" type="email" placeholder="sales@company.com" class="form-input" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">City</label>
            <input v-model="form.city" type="text" placeholder="Dhaka" class="form-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Rating</label>
            <select v-model.number="form.rating" class="form-input">
              <option :value="5">★★★★★ Excellent</option>
              <option :value="4">★★★★ Good</option>
              <option :value="3">★★★ Average</option>
              <option :value="2">★★ Poor</option>
              <option :value="1">★ Very Poor</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Address</label>
          <input v-model="form.address" type="text" placeholder="Full address" class="form-input" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Status</label>
          <div class="flex gap-4">
            <label v-for="s in ['active','inactive']" :key="s" class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.status" :value="s" class="accent-brand-600" />
              <span class="text-sm capitalize text-gray-700">{{ s }}</span>
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showForm=false" class="btn-outline">Cancel</button>
        <button @click="submitForm" :disabled="formLoading" class="btn-primary">
          <span v-if="formLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {{ editSup ? 'Save Changes' : 'Add Supplier' }}
        </button>
      </template>
    </BaseModal>

    <!-- DELETE Modal -->
    <BaseModal v-model="showDelete" title="Delete Supplier" size="sm">
      <div class="flex flex-col items-center text-center gap-4 py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <TrashIcon class="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p class="font-semibold text-gray-900">Delete <span class="text-red-600">{{ deleteSup?.name }}</span>?</p>
          <p class="text-sm text-gray-500 mt-1">This will remove the supplier. This cannot be undone.</p>
        </div>
      </div>
      <template #footer>
        <button @click="showDelete=false" class="btn-outline">Cancel</button>
        <button @click="confirmDelete" :disabled="deleteLoading" class="btn-danger">
          <span v-if="deleteLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <TrashIcon v-else class="w-4 h-4" /> Delete
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import BaseModal from '@/components/common/BaseModal.vue'
import {
  PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon,
  BuildingStorefrontIcon, CheckCircleIcon, CurrencyDollarIcon, ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const store = usePharmacyStore()

const search       = ref('')
const filterStatus = ref('')
const filterRating = ref('')
const page         = ref(1)
const perPage      = 12

const PURCHASE_BASE = [82000,64000,53000,28000,71000,95000,46000,31000,55000,120000,43000,22000,18000,67000,58000,25000,39000,14000,48000,33000]
const DUES_BASE     = [5200,0,3400,0,8100,0,2700,0,4300,0,1800,0,0,3600,0,2100,0,0,1500,0]

function supplierPurchases(id) { return PURCHASE_BASE[(id-1)%PURCHASE_BASE.length]??10000 }
function supplierDues(id)      { return DUES_BASE[(id-1)%DUES_BASE.length]??0 }

const summaryCards = computed(() => {
  const active = store.suppliers.filter(s=>s.status==='active').length
  const totalP = store.suppliers.reduce((s,sup)=>s+supplierPurchases(sup.id),0)
  const totalD = store.suppliers.reduce((s,sup)=>s+supplierDues(sup.id),0)
  return [
    { label:'Total Suppliers',    value:store.suppliers.length, icon:BuildingStorefrontIcon, iconBg:'bg-brand-50', iconColor:'text-brand-600', border:'border-gray-100',   blob:'bg-brand-400' },
    { label:'Active Suppliers',   value:active,                 icon:CheckCircleIcon,        iconBg:'bg-green-50', iconColor:'text-green-600', border:'border-green-100',  blob:'bg-green-400' },
    { label:'Total Purchase Value',value:'৳'+totalP.toLocaleString('en-US',{maximumFractionDigits:0}), icon:CurrencyDollarIcon, iconBg:'bg-blue-50', iconColor:'text-blue-600', border:'border-blue-100', blob:'bg-blue-400' },
    { label:'Outstanding Dues',   value:'৳'+totalD.toLocaleString('en-US',{maximumFractionDigits:0}), icon:ExclamationTriangleIcon, iconBg:'bg-amber-50', iconColor:'text-amber-600', border:'border-amber-100', blob:'bg-amber-400' },
  ]
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.suppliers.filter(s => {
    if (filterStatus.value && s.status !== filterStatus.value) return false
    if (filterRating.value && s.rating < +filterRating.value) return false
    if (!q) return true
    return s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length/perPage)))
const paginated  = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))
const pageNums   = computed(() => {
  const tp=totalPages.value, p=page.value
  if(tp<=5) return Array.from({length:tp},(_,i)=>i+1)
  if(p<=3)  return [1,2,3,'…',tp]
  if(p>=tp-2) return [1,'…',tp-2,tp-1,tp]
  return [1,'…',p,'…',tp]
})

const AVATAR_COLORS=['bg-brand-100 text-brand-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700']
function avatarColor(id){ return AVATAR_COLORS[(id-1)%AVATAR_COLORS.length] }

const showView=ref(false); const viewSup=ref(null)
const showForm=ref(false); const editSup=ref(null)
const showDelete=ref(false); const deleteSup=ref(null)
const formLoading=ref(false); const deleteLoading=ref(false)
const form=ref({})

const viewRows = computed(() => viewSup.value ? [
  { l:'Phone',            v:viewSup.value.contact },
  { l:'Email',            v:viewSup.value.email },
  { l:'City',             v:viewSup.value.city },
  { l:'Address',          v:viewSup.value.address },
  { l:'Total Purchases',  v:'৳'+supplierPurchases(viewSup.value.id).toLocaleString('en-US',{maximumFractionDigits:0}) },
  { l:'Outstanding Due',  v:'৳'+supplierDues(viewSup.value.id).toLocaleString('en-US',{maximumFractionDigits:0}) },
] : [])

function openView(s)   { viewSup.value=s; showView.value=true }
function openAdd()     { editSup.value=null; form.value={name:'',contact:'',contact_person:'',email:'',city:'Dhaka',address:'',rating:4,status:'active'}; showForm.value=true }
function openEdit(s)   { if(!s) return; editSup.value=s; form.value={...s}; showForm.value=true }
function openDelete(s) { deleteSup.value=s; showDelete.value=true }

async function submitForm() {
  formLoading.value=true; await new Promise(r=>setTimeout(r,600))
  if(editSup.value) { const idx=store.suppliers.findIndex(s=>s.id===editSup.value.id); if(idx!==-1) store.suppliers[idx]={...store.suppliers[idx],...form.value} }
  else store.suppliers.unshift({...form.value,id:Date.now()})
  formLoading.value=false; showForm.value=false
}
async function confirmDelete() {
  deleteLoading.value=true; await new Promise(r=>setTimeout(r,500))
  store.suppliers=store.suppliers.filter(s=>s.id!==deleteSup.value.id)
  deleteLoading.value=false; showDelete.value=false
}
</script>

<style scoped>
.btn-primary   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm; }
.btn-outline   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors; }
.btn-danger    { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm; }
.th            { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
.search-input  { @apply w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all; }
.filter-select { @apply h-9 rounded-lg border border-gray-200 text-sm text-gray-600 px-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all; }
.form-input    { @apply w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-gray-400; }
.action-btn    { @apply p-1.5 rounded-lg transition-colors; }
.page-btn      { @apply h-7 min-w-[28px] px-1.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors; }
</style>
