<template>
  <div class="space-y-5">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Patients & Customers</h1>
        <p class="page-subtitle">Customer and patient purchase history, loyalty points, and contact records.</p>
      </div>
      <button @click="openAdd" class="btn-primary self-start sm:self-auto">
        <PlusIcon class="w-4 h-4" /> Add Customer
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

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search customers…" class="search-input" />
        </div>
        <select v-model="filterType" class="filter-select">
          <option value="">All Types</option>
          <option value="returning">Returning</option>
          <option value="new">New</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select v-model="sortKey" class="filter-select">
          <option value="">Sort…</option>
          <option value="total_purchases">By Purchases</option>
          <option value="loyalty_points">By Loyalty Points</option>
          <option value="visits">By Visits</option>
        </select>
        <span class="ml-auto text-xs text-gray-400">{{ filtered.length }} customers</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th">#</th>
              <th class="th">Customer</th>
              <th class="th hidden md:table-cell">Phone</th>
              <th class="th hidden lg:table-cell">Address</th>
              <th class="th text-right">Total Purchases</th>
              <th class="th hidden sm:table-cell text-center">Loyalty Pts</th>
              <th class="th hidden md:table-cell text-center">Visits</th>
              <th class="th text-center">Type</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="!paginated.length">
              <td colspan="9" class="py-16 text-center">
                <div class="flex flex-col items-center gap-2">
                  <UsersIcon class="w-10 h-10 text-gray-200" />
                  <p class="text-sm text-gray-400">No customers found.</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(cust, i) in paginated"
              :key="cust.id"
              class="hover:bg-gray-50/60 transition-colors group cursor-pointer"
              @click="openView(cust)"
            >
              <td class="px-4 py-3 text-gray-400 text-xs">{{ (page-1)*perPage+i+1 }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', avatarColor(cust.id)]">
                    {{ cust.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 leading-tight">{{ cust.name }}</p>
                    <p class="text-xs text-gray-400 truncate max-w-[150px]">{{ cust.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 hidden md:table-cell">{{ cust.phone }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs truncate max-w-[160px] hidden lg:table-cell">{{ cust.address }}</td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900">৳{{ cust.total_purchases.toLocaleString('en-US',{maximumFractionDigits:0}) }}</td>
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold ring-1 ring-yellow-200">
                  ⭐ {{ cust.loyalty_points.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{{ cust.visits }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                  cust.type==='returning'?'bg-brand-50 text-brand-700 ring-1 ring-brand-200':'bg-green-50 text-green-700 ring-1 ring-green-200']">
                  {{ cust.type==='returning'?'Returning':'New' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openView(cust)"   class="action-btn text-blue-500 hover:bg-blue-50"><EyeIcon class="w-4 h-4" /></button>
                  <button @click.stop="openEdit(cust)"   class="action-btn text-amber-500 hover:bg-amber-50"><PencilIcon class="w-4 h-4" /></button>
                  <button @click.stop="openDelete(cust)" class="action-btn text-red-500 hover:bg-red-50"><TrashIcon class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400">{{ filtered.length }} customers · Page {{ page }} of {{ totalPages }}</p>
        <div class="flex gap-1">
          <button :disabled="page<=1" @click="page--" class="page-btn">‹</button>
          <button v-for="p in pageNums" :key="p" :class="['page-btn',p===page?'bg-brand-600 text-white border-brand-600':'']" @click="p!=='…'&&(page=p)">{{ p }}</button>
          <button :disabled="page>=totalPages" @click="page++" class="page-btn">›</button>
        </div>
      </div>
    </div>

    <!-- Top Customers -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 class="text-base font-bold text-gray-900 mb-4">Top Customers by Purchase Value</h2>
      <div class="space-y-3">
        <div v-for="(cust, i) in topCustomers" :key="cust.id" class="flex items-center gap-3">
          <span class="text-xs font-bold text-gray-400 w-5 text-right shrink-0">{{ i+1 }}</span>
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', avatarColor(cust.id)]">{{ cust.name.charAt(0) }}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ cust.name }}</p>
              <p class="text-sm font-bold text-brand-700 shrink-0 ml-2">৳{{ cust.total_purchases.toLocaleString('en-US',{maximumFractionDigits:0}) }}</p>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-1.5 bg-brand-500 rounded-full transition-all duration-700" :style="`width:${(cust.total_purchases/topCustomers[0].total_purchases)*100}%`" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW Modal -->
    <BaseModal v-model="showView" :title="viewCust?.name??''" subtitle="Customer profile" size="md">
      <div v-if="viewCust" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', viewCust.status==='active'?'bg-green-50 text-green-700':'bg-gray-100 text-gray-600']">{{ viewCust.status }}</span>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', viewCust.type==='returning'?'bg-brand-50 text-brand-700':'bg-green-50 text-green-700']">{{ viewCust.type==='returning'?'Returning Customer':'New Customer' }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="row in viewRows" :key="row.l" class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ row.l }}</p>
            <p :class="['text-sm font-semibold mt-0.5', row.color??'text-gray-900']">{{ row.v||'—' }}</p>
          </div>
        </div>
        <div class="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-center gap-3">
          <span class="text-2xl">⭐</span>
          <div>
            <p class="text-xs text-yellow-700 font-semibold">Loyalty Points</p>
            <p class="text-xl font-extrabold text-yellow-800">{{ viewCust.loyalty_points.toLocaleString() }} pts</p>
          </div>
          <div class="ml-auto text-right">
            <p class="text-xs text-yellow-600">Equivalent to</p>
            <p class="text-sm font-bold text-yellow-700">৳{{ (viewCust.loyalty_points*0.5).toFixed(0) }} discount</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showView=false;openEdit(viewCust)" class="btn-outline"><PencilIcon class="w-4 h-4" /> Edit</button>
        <button @click="showView=false" class="btn-primary">Close</button>
      </template>
    </BaseModal>

    <!-- ADD/EDIT Modal -->
    <BaseModal v-model="showForm" :title="editCust?'Edit Customer':'Add Customer'" :subtitle="editCust?`Editing: ${editCust.name}`:'Fill in customer details.'" size="md">
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Full Name <span class="text-red-400">*</span></label>
            <input v-model="form.name" type="text" placeholder="Patient name" class="form-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Phone <span class="text-red-400">*</span></label>
            <input v-model="form.phone" type="tel" placeholder="017XX-XXXXXX" class="form-input" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Email</label>
          <input v-model="form.email" type="email" placeholder="patient@email.com" class="form-input" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Address</label>
          <input v-model="form.address" type="text" placeholder="Full address" class="form-input" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Status</label>
            <div class="flex gap-4 mt-1">
              <label v-for="s in ['active','inactive']" :key="s" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.status" :value="s" class="accent-brand-600" />
                <span class="text-sm capitalize text-gray-700">{{ s }}</span>
              </label>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Customer Type</label>
            <div class="flex gap-4 mt-1">
              <label v-for="t in ['new','returning']" :key="t" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.type" :value="t" class="accent-brand-600" />
                <span class="text-sm capitalize text-gray-700">{{ t }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showForm=false" class="btn-outline">Cancel</button>
        <button @click="submitForm" :disabled="formLoading" class="btn-primary">
          <span v-if="formLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {{ editCust ? 'Save Changes' : 'Add Customer' }}
        </button>
      </template>
    </BaseModal>

    <!-- DELETE Modal -->
    <BaseModal v-model="showDelete" title="Delete Customer" size="sm">
      <div class="flex flex-col items-center text-center gap-4 py-2">
        <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <TrashIcon class="w-7 h-7 text-red-500" />
        </div>
        <p class="font-semibold text-gray-900">Delete <span class="text-red-600">{{ deleteCust?.name }}</span>?</p>
        <p class="text-sm text-gray-500">This action cannot be undone.</p>
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
import { mockCustomers } from '@/data/mockData.js'
import BaseModal from '@/components/common/BaseModal.vue'
import {
  PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon, UsersIcon,
  UserGroupIcon, SparklesIcon, CurrencyDollarIcon, ChartBarIcon
} from '@heroicons/vue/24/outline'

const customers = ref(mockCustomers.map(c=>({...c})))
const search      = ref('')
const filterType   = ref('')
const filterStatus = ref('')
const sortKey      = ref('')
const page         = ref(1)
const perPage      = 10

const summaryCards = computed(() => {
  const total     = customers.value.length
  const returning = customers.value.filter(c=>c.type==='returning').length
  const newC      = customers.value.filter(c=>c.type==='new').length
  const revenue   = customers.value.reduce((s,c)=>s+c.total_purchases,0)
  return [
    { label:'Total Customers',    value:total,     icon:UsersIcon,          iconBg:'bg-brand-50', iconColor:'text-brand-600', border:'border-gray-100',   blob:'bg-brand-400' },
    { label:'Returning Customers',value:returning, icon:UserGroupIcon,       iconBg:'bg-blue-50',  iconColor:'text-blue-600',  border:'border-blue-100',   blob:'bg-blue-400'  },
    { label:'New Customers',      value:newC,      icon:SparklesIcon,        iconBg:'bg-green-50', iconColor:'text-green-600', border:'border-green-100',  blob:'bg-green-400' },
    { label:'Customer Revenue',   value:'৳'+revenue.toLocaleString('en-US',{maximumFractionDigits:0}), icon:CurrencyDollarIcon, iconBg:'bg-amber-50', iconColor:'text-amber-600', border:'border-amber-100', blob:'bg-amber-400' },
  ]
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  let list = customers.value
  if(filterType.value)   list=list.filter(c=>c.type===filterType.value)
  if(filterStatus.value) list=list.filter(c=>c.status===filterStatus.value)
  if(q) list=list.filter(c=>c.name.toLowerCase().includes(q)||c.phone?.includes(q)||c.email?.toLowerCase().includes(q))
  if(sortKey.value) list=[...list].sort((a,b)=>b[sortKey.value]-a[sortKey.value])
  return list
})
const totalPages  = computed(() => Math.max(1, Math.ceil(filtered.value.length/perPage)))
const paginated   = computed(() => filtered.value.slice((page.value-1)*perPage, page.value*perPage))
const pageNums    = computed(() => {
  const tp=totalPages.value, p=page.value
  if(tp<=5) return Array.from({length:tp},(_,i)=>i+1)
  if(p<=3)  return [1,2,3,'…',tp]
  if(p>=tp-2) return [1,'…',tp-2,tp-1,tp]
  return [1,'…',p,'…',tp]
})
const topCustomers = computed(() => [...customers.value].sort((a,b)=>b.total_purchases-a.total_purchases).slice(0,8))

const AVATAR_COLORS=['bg-brand-100 text-brand-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700','bg-teal-100 text-teal-700']
function avatarColor(id){ return AVATAR_COLORS[(id-1)%AVATAR_COLORS.length] }

const showView=ref(false); const viewCust=ref(null)
const showForm=ref(false); const editCust=ref(null)
const showDelete=ref(false); const deleteCust=ref(null)
const formLoading=ref(false); const deleteLoading=ref(false)
const form=ref({})

const viewRows = computed(()=> viewCust.value ? [
  {l:'Phone',           v:viewCust.value.phone},
  {l:'Email',           v:viewCust.value.email},
  {l:'Address',         v:viewCust.value.address},
  {l:'Last Visit',      v:viewCust.value.last_visit},
  {l:'Total Visits',    v:viewCust.value.visits+' visits'},
  {l:'Total Purchases', v:'৳'+viewCust.value.total_purchases.toLocaleString('en-US',{maximumFractionDigits:0}),color:'text-brand-700'},
] : [])

function openView(c)   { viewCust.value=c; showView.value=true }
function openAdd()     { editCust.value=null; form.value={name:'',phone:'',email:'',address:'',status:'active',type:'new',total_purchases:0,loyalty_points:0,visits:0,last_visit:new Date().toISOString().slice(0,10)}; showForm.value=true }
function openEdit(c)   { if(!c)return; editCust.value=c; form.value={...c}; showForm.value=true }
function openDelete(c) { deleteCust.value=c; showDelete.value=true }

async function submitForm() {
  formLoading.value=true; await new Promise(r=>setTimeout(r,600))
  if(editCust.value){ const idx=customers.value.findIndex(c=>c.id===editCust.value.id); if(idx!==-1) customers.value[idx]={...customers.value[idx],...form.value} }
  else customers.value.unshift({...form.value,id:Date.now()})
  formLoading.value=false; showForm.value=false
}
async function confirmDelete() {
  deleteLoading.value=true; await new Promise(r=>setTimeout(r,500))
  customers.value=customers.value.filter(c=>c.id!==deleteCust.value.id)
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
