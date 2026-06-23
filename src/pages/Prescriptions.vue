<template>
  <div class="space-y-5">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Prescriptions</h1>
        <p class="page-subtitle">Track patient prescriptions from verification to dispensing.</p>
      </div>
      <button @click="showUpload=true" class="btn-primary self-start sm:self-auto">
        <ArrowUpTrayIcon class="w-4 h-4" /> Upload Prescription
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

    <!-- Status Pipeline -->
    <div class="grid grid-cols-3 gap-4">
      <div v-for="stage in pipeline" :key="stage.status" :class="['bg-white rounded-2xl border shadow-sm p-4', stage.border]">
        <div class="flex items-center gap-2 mb-3">
          <div :class="['w-2.5 h-2.5 rounded-full', stage.dot]" />
          <p :class="['text-sm font-bold', stage.textColor]">{{ stage.label }}</p>
          <span :class="['ml-auto text-xs font-bold px-2 py-0.5 rounded-full', stage.badge]">{{ stage.count }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="rx in prescriptions.filter(p=>p.status===stage.status).slice(0,3)" :key="rx.id" class="p-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" @click="openView(rx)">
            <p class="text-xs font-semibold text-gray-900 truncate">{{ rx.patient }}</p>
            <p class="text-[11px] text-gray-400 mt-0.5">{{ rx.id }} · {{ rx.medicines.length }} items</p>
          </div>
          <p v-if="prescriptions.filter(p=>p.status===stage.status).length>3" class="text-[11px] text-gray-400 text-center pt-1">
            +{{ prescriptions.filter(p=>p.status===stage.status).length-3 }} more
          </p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search by patient, doctor or RX ID…" class="search-input" />
        </div>
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="s in ['','pending','verified','dispensed']"
            :key="s"
            :class="['px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                     filterStatus===s
                       ? statusActive(s)
                       : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300']"
            @click="filterStatus=s; page=1"
          >{{ s===''?'All':s.charAt(0).toUpperCase()+s.slice(1) }} {{ s===''?'('+prescriptions.length+')':'('+prescriptions.filter(p=>p.status===s).length+')' }}</button>
        </div>
        <span class="ml-auto text-xs text-gray-400">{{ filtered.length }} prescriptions</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th">RX ID</th>
              <th class="th">Patient</th>
              <th class="th hidden md:table-cell">Doctor</th>
              <th class="th hidden lg:table-cell">Specialty</th>
              <th class="th hidden sm:table-cell text-center">Medicines</th>
              <th class="th">Date</th>
              <th class="th text-center">Status</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-if="!paginated.length">
              <td colspan="8" class="py-16 text-center">
                <div class="flex flex-col items-center gap-2">
                  <DocumentTextIcon class="w-10 h-10 text-gray-200" />
                  <p class="text-sm text-gray-400">No prescriptions found.</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="rx in paginated"
              :key="rx.id"
              class="hover:bg-gray-50/60 transition-colors group cursor-pointer"
              @click="openView(rx)"
            >
              <td class="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{{ rx.id }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0', avatarColor(rx.id)]">
                    {{ rx.patient.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm leading-tight">{{ rx.patient }}</p>
                    <p class="text-[11px] text-gray-400">{{ rx.patient_phone }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <p class="text-sm text-gray-700">{{ rx.doctor }}</p>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{{ rx.doctor_specialty }}</td>
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
                  <BeakerIcon class="w-3 h-3" /> {{ rx.medicines.length }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500">{{ rx.date }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', statusBadge(rx.status)]">
                  <span :class="['w-1.5 h-1.5 rounded-full', statusDot(rx.status)]" />
                  {{ rx.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openView(rx)" class="action-btn text-blue-500 hover:bg-blue-50"><EyeIcon class="w-4 h-4" /></button>
                  <button
                    v-if="rx.status==='pending'"
                    @click.stop="updateStatus(rx,'verified')"
                    class="action-btn text-brand-500 hover:bg-brand-50 text-xs font-semibold px-2"
                  >Verify</button>
                  <button
                    v-if="rx.status==='verified'"
                    @click.stop="updateStatus(rx,'dispensed')"
                    class="action-btn text-green-600 hover:bg-green-50 text-xs font-semibold px-2"
                  >Dispense</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400">{{ filtered.length }} prescriptions · Page {{ page }} of {{ totalPages }}</p>
        <div class="flex gap-1">
          <button :disabled="page<=1" @click="page--" class="page-btn">‹</button>
          <button v-for="p in pageNums" :key="p" :class="['page-btn',p===page?'bg-brand-600 text-white border-brand-600':'']" @click="p!=='…'&&(page=p)">{{ p }}</button>
          <button :disabled="page>=totalPages" @click="page++" class="page-btn">›</button>
        </div>
      </div>
    </div>

    <!-- DETAIL Modal -->
    <BaseModal v-model="showDetail" :title="viewRx?.id??''" subtitle="Prescription details" size="lg">
      <div v-if="viewRx" class="space-y-5">
        <div class="flex flex-wrap gap-2">
          <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', statusBadge(viewRx.status)]">{{ viewRx.status }}</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{{ viewRx.date }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Patient</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ viewRx.patient }}</p>
            <p class="text-xs text-gray-400">{{ viewRx.patient_phone }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Prescribing Doctor</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ viewRx.doctor }}</p>
            <p class="text-xs text-gray-400">{{ viewRx.doctor_specialty }}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prescribed Medicines</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="(med, i) in viewRx.medicines" :key="i" class="flex items-center gap-2.5 p-2.5 bg-brand-50 rounded-xl">
              <BeakerIcon class="w-4 h-4 text-brand-500 shrink-0" />
              <p class="text-sm text-brand-800 font-medium">{{ med }}</p>
            </div>
          </div>
        </div>
        <div v-if="viewRx.notes" class="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Clinical Notes</p>
          <p class="text-sm text-amber-800">{{ viewRx.notes }}</p>
        </div>
        <div v-if="viewRx.pharmacist" class="text-xs text-gray-500">
          Dispensed by <span class="font-semibold text-gray-700">{{ viewRx.pharmacist }}</span>
        </div>
      </div>
      <template #footer>
        <button @click="showDetail=false" class="btn-outline">Close</button>
        <button v-if="viewRx?.status==='pending'"  @click="updateStatus(viewRx,'verified');showDetail=false" class="btn-primary">✓ Mark Verified</button>
        <button v-if="viewRx?.status==='verified'" @click="updateStatus(viewRx,'dispensed');showDetail=false" class="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">✓ Mark Dispensed</button>
      </template>
    </BaseModal>

    <!-- UPLOAD Modal -->
    <BaseModal v-model="showUpload" title="Upload Prescription" subtitle="Add a new patient prescription to the system." size="md">
      <div class="space-y-4">
        <!-- Upload area -->
        <div
          class="border-2 border-dashed border-brand-200 bg-brand-50/30 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/60 transition-all"
          @dragover.prevent @drop.prevent="handleDrop"
          @click="() => {}"
        >
          <CloudArrowUpIcon class="w-10 h-10 text-brand-400 mx-auto mb-3" />
          <p class="text-sm font-semibold text-gray-700">Drag & drop prescription image here</p>
          <p class="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF — max 10MB</p>
          <button class="mt-3 px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors">Browse Files</button>
          <p v-if="uploadedFile" class="mt-2 text-xs text-green-600 font-semibold">✓ {{ uploadedFile }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Patient Name <span class="text-red-400">*</span></label>
            <input v-model="uploadForm.patient" type="text" placeholder="Full patient name" class="form-input" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-600">Patient Phone</label>
            <input v-model="uploadForm.phone" type="tel" placeholder="017XX-XXXXXX" class="form-input" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Doctor Name</label>
          <input v-model="uploadForm.doctor" type="text" placeholder="Dr. Name" class="form-input" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-gray-600">Notes</label>
          <textarea v-model="uploadForm.notes" rows="2" placeholder="Additional notes…" class="form-input resize-none py-2" />
        </div>
      </div>
      <template #footer>
        <button @click="showUpload=false" class="btn-outline">Cancel</button>
        <button @click="submitUpload" :disabled="uploadLoading" class="btn-primary">
          <span v-if="uploadLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <ArrowUpTrayIcon v-else class="w-4 h-4" /> Submit Prescription
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockPrescriptions } from '@/data/mockData.js'
import BaseModal from '@/components/common/BaseModal.vue'
import {
  ArrowUpTrayIcon, MagnifyingGlassIcon, EyeIcon, BeakerIcon,
  DocumentTextIcon, CloudArrowUpIcon, ClipboardDocumentCheckIcon,
  CheckBadgeIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const prescriptions = ref(mockPrescriptions.map(p=>({...p})))
const search        = ref('')
const filterStatus  = ref('')
const page          = ref(1)
const perPage       = 10

const summaryCards = computed(()=>[
  { label:'Total Prescriptions', value:prescriptions.value.length,                                             icon:DocumentTextIcon,            iconBg:'bg-brand-50', iconColor:'text-brand-600', border:'border-gray-100',   blob:'bg-brand-400' },
  { label:'Pending',             value:prescriptions.value.filter(p=>p.status==='pending').length,             icon:ClipboardDocumentListIcon,   iconBg:'bg-amber-50', iconColor:'text-amber-600', border:'border-amber-100',  blob:'bg-amber-400' },
  { label:'Verified',            value:prescriptions.value.filter(p=>p.status==='verified').length,            icon:ClipboardDocumentCheckIcon,  iconBg:'bg-blue-50',  iconColor:'text-blue-600',  border:'border-blue-100',   blob:'bg-blue-400'  },
  { label:'Dispensed',           value:prescriptions.value.filter(p=>p.status==='dispensed').length,           icon:CheckBadgeIcon,              iconBg:'bg-green-50', iconColor:'text-green-600', border:'border-green-100',  blob:'bg-green-400' },
])

const pipeline = computed(()=>[
  { status:'pending',   label:'Pending',   count:prescriptions.value.filter(p=>p.status==='pending').length,   dot:'bg-amber-400', textColor:'text-amber-700', border:'border-amber-100', badge:'bg-amber-50 text-amber-700' },
  { status:'verified',  label:'Verified',  count:prescriptions.value.filter(p=>p.status==='verified').length,  dot:'bg-blue-500',  textColor:'text-blue-700',  border:'border-blue-100',  badge:'bg-blue-50 text-blue-700'   },
  { status:'dispensed', label:'Dispensed', count:prescriptions.value.filter(p=>p.status==='dispensed').length, dot:'bg-green-500', textColor:'text-green-700', border:'border-green-100', badge:'bg-green-50 text-green-700' },
])

const filtered = computed(()=>{
  const q=search.value.toLowerCase()
  return prescriptions.value.filter(p=>{
    if(filterStatus.value && p.status!==filterStatus.value) return false
    if(!q) return true
    return p.patient.toLowerCase().includes(q)||p.doctor.toLowerCase().includes(q)||p.id.toLowerCase().includes(q)
  })
})
const totalPages = computed(()=>Math.max(1,Math.ceil(filtered.value.length/perPage)))
const paginated  = computed(()=>filtered.value.slice((page.value-1)*perPage, page.value*perPage))
const pageNums   = computed(()=>{
  const tp=totalPages.value, p=page.value
  if(tp<=5) return Array.from({length:tp},(_,i)=>i+1)
  if(p<=3) return [1,2,3,'…',tp]
  if(p>=tp-2) return [1,'…',tp-2,tp-1,tp]
  return [1,'…',p,'…',tp]
})

function statusBadge(s){ return {pending:'bg-amber-50 text-amber-700 ring-1 ring-amber-200',verified:'bg-blue-50 text-blue-700 ring-1 ring-blue-200',dispensed:'bg-green-50 text-green-700 ring-1 ring-green-200'}[s]??'bg-gray-100 text-gray-600' }
function statusDot(s)  { return {pending:'bg-amber-400',verified:'bg-blue-500',dispensed:'bg-green-500'}[s]??'bg-gray-400' }
function statusActive(s){ return {pending:'border-amber-500 bg-amber-50 text-amber-700',verified:'border-blue-500 bg-blue-50 text-blue-700',dispensed:'border-green-500 bg-green-50 text-green-700','':'border-brand-500 bg-brand-50 text-brand-700'}[s]??'' }

const AVATAR_COLORS=['bg-brand-100 text-brand-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700']
function avatarColor(id){ const n=id.replace(/\D/g,''); return AVATAR_COLORS[parseInt(n||'0')%AVATAR_COLORS.length] }

const showDetail=ref(false); const viewRx=ref(null)
const showUpload=ref(false)
const uploadLoading=ref(false)
const uploadedFile=ref('')
const uploadForm=ref({patient:'',phone:'',doctor:'',notes:''})

function openView(rx){ viewRx.value=rx; showDetail.value=true }

function updateStatus(rx, newStatus){
  const idx=prescriptions.value.findIndex(p=>p.id===rx.id)
  if(idx!==-1){ prescriptions.value[idx]={...prescriptions.value[idx],status:newStatus,pharmacist:newStatus==='dispensed'?'Roni Ahmed':prescriptions.value[idx].pharmacist} }
}

function handleDrop(e){ const f=e.dataTransfer.files[0]; if(f) uploadedFile.value=f.name }

async function submitUpload(){
  if(!uploadForm.value.patient) return
  uploadLoading.value=true; await new Promise(r=>setTimeout(r,700))
  const newRx = {
    id: `RX-2026-${String(prescriptions.value.length+1).padStart(3,'0')}`,
    patient: uploadForm.value.patient, patient_phone: uploadForm.value.phone,
    doctor: uploadForm.value.doctor||'Unknown Doctor', doctor_specialty:'General Physician',
    date: new Date().toISOString().slice(0,10),
    status: 'pending', medicines: [], notes: uploadForm.value.notes, pharmacist: null,
  }
  prescriptions.value.unshift(newRx)
  uploadLoading.value=false; showUpload.value=false
  uploadForm.value={patient:'',phone:'',doctor:'',notes:''}; uploadedFile.value=''
}
</script>

<style scoped>
.btn-primary   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm; }
.btn-outline   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors; }
.th            { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
.search-input  { @apply w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all; }
.form-input    { @apply w-full h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-gray-400; }
.form-input[rows]{ @apply h-auto py-2.5; }
.action-btn    { @apply p-1.5 rounded-lg transition-colors; }
.page-btn      { @apply h-7 min-w-[28px] px-1.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors; }
</style>
