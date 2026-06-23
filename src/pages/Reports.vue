<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">Sales, stock, supplier and patient summary reports.</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button v-for="p in periods" :key="p.v" @click="period=p.v"
            :class="['px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', period===p.v?'bg-brand-600 text-white shadow-sm':'text-gray-500 hover:text-gray-700']">
            {{ p.l }}
          </button>
        </div>
        <button @click="exportCSV"  class="btn-outline"><ArrowDownTrayIcon class="w-4 h-4" /> CSV</button>
        <button @click="exportPDF"  class="btn-outline"><DocumentArrowDownIcon class="w-4 h-4" /> PDF</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="kpi in kpiCards" :key="kpi.label" :class="['bg-white rounded-2xl border shadow-sm px-4 py-4 hover:shadow-md transition-all', kpi.border]">
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center mb-2', kpi.iconBg]">
          <component :is="kpi.icon" :class="['w-4 h-4', kpi.iconColor]" />
        </div>
        <p class="text-2xl font-extrabold text-gray-900">{{ kpi.value }}</p>
        <p class="text-xs font-medium text-gray-500 mt-0.5">{{ kpi.label }}</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- Revenue Trend -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-base font-bold text-gray-900">Monthly Revenue</h2>
            <p class="text-xs text-gray-400 mt-0.5">Total billing value per month — last 12 months</p>
          </div>
          <p class="text-xl font-extrabold text-brand-700">৳{{ totalRevenue.toLocaleString('en-US',{maximumFractionDigits:0}) }}</p>
        </div>
        <div style="height:220px">
          <Line :data="revenueChartData" :options="lineOptions" />
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-base font-bold text-gray-900 mb-1">Dispensing by Category</h2>
        <p class="text-xs text-gray-400 mb-4">Billing share by therapeutic class</p>
        <div style="height:180px" class="flex items-center justify-center">
          <Doughnut :data="categoryChartData" :options="doughnutOptions" />
        </div>
        <div class="mt-4 grid grid-cols-2 gap-1">
          <div v-for="(cat, i) in categoryLabels.slice(0,8)" :key="cat" class="flex items-center gap-1.5 text-[11px] text-gray-600">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="`background:${CHART_COLORS[i%CHART_COLORS.length]}`" />
            <span class="truncate">{{ cat }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Trend Bar -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-900">Monthly Bills Issued</h2>
        <p class="text-xs text-gray-400">Number of dispensing bills per month</p>
      </div>
      <div style="height:200px">
        <Bar :data="salesBarData" :options="barOptions" />
      </div>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">

      <!-- Sales Report -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-base font-bold text-gray-900">Sales Report</h2>
          <span class="text-xs text-gray-400">{{ periodLabel }}</span>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="row in salesReport" :key="row.l" class="px-5 py-3 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
            <p class="text-sm text-gray-700">{{ row.l }}</p>
            <p :class="['text-sm font-bold', row.color??'text-gray-900']">{{ row.v }}</p>
          </div>
        </div>
      </div>

      <!-- Inventory Report -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-bold text-gray-900">Inventory Report</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="row in inventoryReport" :key="row.l" class="px-5 py-3 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
            <p class="text-sm text-gray-700">{{ row.l }}</p>
            <p :class="['text-sm font-bold', row.color??'text-gray-900']">{{ row.v }}</p>
          </div>
        </div>
      </div>

      <!-- Supplier Report -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-bold text-gray-900">Supplier Report</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50">
                <th class="th">Supplier</th>
                <th class="th text-right">Purchases</th>
                <th class="th text-right">Outstanding</th>
                <th class="th text-center">Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="sup in topSuppliers" :key="sup.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-4 py-2.5">
                  <p class="text-sm font-semibold text-gray-900 truncate max-w-[160px]">{{ sup.name }}</p>
                  <p class="text-[11px] text-gray-400">{{ sup.city }}</p>
                </td>
                <td class="px-4 py-2.5 text-right text-sm font-semibold text-gray-900">৳{{ PURCHASE_BASE[(sup.id-1)%PURCHASE_BASE.length].toLocaleString() }}</td>
                <td class="px-4 py-2.5 text-right">
                  <span :class="DUES_BASE[(sup.id-1)%DUES_BASE.length]>0?'text-red-600 font-semibold':'text-gray-400'">
                    ৳{{ DUES_BASE[(sup.id-1)%DUES_BASE.length].toLocaleString() }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-center text-amber-400 text-xs">{{ '★'.repeat(sup.rating) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Customer Report -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-bold text-gray-900">Top Patients by Purchase</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50">
                <th class="th">Customer</th>
                <th class="th text-right">Purchases</th>
                <th class="th text-center hidden sm:table-cell">Visits</th>
                <th class="th text-center hidden sm:table-cell">Loyalty Pts</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(cust, i) in topCustomers" :key="cust.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-400 w-4">{{ i+1 }}</span>
                    <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold', AVATAR_COLORS[i%AVATAR_COLORS.length]]">{{ cust.name.charAt(0) }}</div>
                    <p class="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{{ cust.name }}</p>
                  </div>
                </td>
                <td class="px-4 py-2.5 text-right font-semibold text-brand-700">৳{{ cust.total_purchases.toLocaleString('en-US',{maximumFractionDigits:0}) }}</td>
                <td class="px-4 py-2.5 text-center text-gray-600 hidden sm:table-cell">{{ cust.visits }}</td>
                <td class="px-4 py-2.5 text-center hidden sm:table-cell">
                  <span class="text-xs font-bold text-yellow-600">⭐ {{ cust.loyalty_points.toLocaleString() }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { usePharmacyStore } from '@/stores/pharmacyStore.js'
import { mockCustomers, monthlySalesData, salesByCategoryData } from '@/data/mockData.js'
import { ArrowDownTrayIcon, DocumentArrowDownIcon, CurrencyDollarIcon, ShoppingCartIcon, BeakerIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const store  = usePharmacyStore()
const period = ref('monthly')
const periods = [{ v:'daily',l:'Daily' },{ v:'weekly',l:'Weekly' },{ v:'monthly',l:'Monthly' }]
const periodLabel = computed(() => ({ daily:'Today', weekly:'This Week', monthly:'This Month' }[period.value]))

const PURCHASE_BASE = [82000,64000,53000,28000,71000,95000,46000,31000,55000,120000,43000,22000,18000,67000,58000,25000,39000,14000,48000,33000]
const DUES_BASE     = [5200,0,3400,0,8100,0,2700,0,4300,0,1800,0,0,3600,0,2100,0,0,1500,0]
const AVATAR_COLORS = ['bg-brand-100 text-brand-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-green-100 text-green-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700','bg-teal-100 text-teal-700','bg-indigo-100 text-indigo-700']

const CHART_COLORS = ['#0F766E','#14B8A6','#3B82F6','#8B5CF6','#F59E0B','#EF4444','#10B981','#F97316','#06B6D4','#EC4899','#6366F1','#84CC16','#D946EF']

// ── KPI Cards ──────────────────────────────────────────────────────────────
const totalRevenue = computed(() => store.sales.filter(s=>s.status==='paid').reduce((s,r)=>s+r.total,0))

const kpiCards = computed(() => [
  { label:'Total Revenue',     value:'৳'+totalRevenue.value.toLocaleString('en-US',{maximumFractionDigits:0}),      icon:CurrencyDollarIcon, iconBg:'bg-green-50',  iconColor:'text-green-600', border:'border-green-100',  blob:'bg-green-400' },
  { label:'Total Bills',       value:store.sales.length,                                                             icon:ShoppingCartIcon,   iconBg:'bg-brand-50', iconColor:'text-brand-600', border:'border-gray-100',   blob:'bg-brand-400' },
  { label:'Active Medicines',  value:store.medicines.filter(m=>m.status==='active').length,                          icon:BeakerIcon,         iconBg:'bg-blue-50',  iconColor:'text-blue-600',  border:'border-blue-100',   blob:'bg-blue-400'  },
  { label:'Stock Value',       value:'৳'+store.totalInventoryValue.toLocaleString('en-US',{maximumFractionDigits:0}),icon:ChartBarIcon,       iconBg:'bg-purple-50',iconColor:'text-purple-600',border:'border-purple-100', blob:'bg-purple-400'},
])

// ── Reports ────────────────────────────────────────────────────────────────
const todayStr    = new Date().toISOString().slice(0,10)
const thisWeekStr = new Date(Date.now()-7*86400000).toISOString().slice(0,10)
const thisMonthM  = new Date().toISOString().slice(0,7)

const filterSales = (predicate) => store.sales.filter(predicate)

const salesReport = computed(()=>{
  const periodSales = filterSales(s=> {
    if(period.value==='daily')   return s.date===todayStr
    if(period.value==='weekly')  return s.date>=thisWeekStr
    if(period.value==='monthly') return s.date?.startsWith(thisMonthM)
    return true
  })
  const paid     = periodSales.filter(s=>s.status==='paid')
  const revenue  = paid.reduce((s,r)=>s+r.total,0)
  const avg      = paid.length ? revenue/paid.length : 0
  const refunded = periodSales.filter(s=>s.status==='refunded').length
  return [
    {l:'Bills Issued',              v:periodSales.length},
    {l:'Paid Bills',                v:paid.length,        color:'text-green-600'},
    {l:'Total Collection',          v:'৳'+revenue.toLocaleString('en-US',{maximumFractionDigits:0}), color:'text-brand-700'},
    {l:'Avg. Bill Value',           v:'৳'+avg.toFixed(0)},
    {l:'Refunded',                  v:refunded,            color:refunded>0?'text-red-600':'text-gray-400'},
    {l:'Cash',                      v:paid.filter(s=>s.payment==='Cash').length},
    {l:'Card / POS',                v:paid.filter(s=>s.payment==='Card').length},
    {l:'Mobile Banking (bKash/Nagad)',v:paid.filter(s=>s.payment==='Mobile Banking').length},
  ]
})

const inventoryReport = computed(()=>{
  const meds    = store.medicines
  const active  = meds.filter(m=>m.status==='active')
  const expired = meds.filter(m=>m.status==='expired')
  const low     = store.lowStockMedicines
  const outStock= meds.filter(m=>m.stock===0)
  const value   = store.totalInventoryValue
  return [
    {l:'Registered Medicines',    v:meds.length},
    {l:'Active Formulary',        v:active.length,   color:'text-green-600'},
    {l:'Expired (Requires Disposal)', v:expired.length, color:'text-red-600'},
    {l:'Below Reorder Level',     v:low.length,      color:'text-amber-600'},
    {l:'Out of Stock',            v:outStock.length, color:'text-gray-600'},
    {l:'Stock Value (Cost Price)',v:'৳'+value.toLocaleString('en-US',{maximumFractionDigits:0}), color:'text-brand-700'},
    {l:'Total Units in Stock',    v:active.reduce((s,m)=>s+m.stock,0).toLocaleString()},
    {l:'Therapeutic Categories',  v:[...new Set(meds.map(m=>m.category))].length},
  ]
})

const topSuppliers = computed(()=>
  [...store.suppliers]
    .sort((a,b)=>PURCHASE_BASE[(b.id-1)%PURCHASE_BASE.length]-PURCHASE_BASE[(a.id-1)%PURCHASE_BASE.length])
    .slice(0,6)
)
const topCustomers = computed(()=>
  [...mockCustomers].sort((a,b)=>b.total_purchases-a.total_purchases).slice(0,8)
)

// ── Charts ─────────────────────────────────────────────────────────────────
const revenueChartData = computed(()=>({
  labels: monthlySalesData.labels,
  datasets: [{
    label: 'Revenue (৳)',
    data: monthlySalesData.revenue,
    borderColor: '#0F766E',
    backgroundColor: 'rgba(15,118,110,0.08)',
    borderWidth: 2.5,
    pointRadius: 3,
    pointBackgroundColor: '#0F766E',
    fill: true,
    tension: 0.4,
  }]
}))

const salesBarData = computed(()=>({
  labels: monthlySalesData.labels,
  datasets: [{
    label: 'Sales Count',
    data: monthlySalesData.sales,
    backgroundColor: CHART_COLORS.map(c=>c+'33'),
    borderColor: CHART_COLORS,
    borderWidth: 1.5,
    borderRadius: 6,
    borderSkipped: false,
  }]
}))

const categoryLabels = salesByCategoryData.labels
const categoryChartData = {
  labels: salesByCategoryData.labels,
  datasets: [{
    data: salesByCategoryData.data,
    backgroundColor: CHART_COLORS,
    borderColor: '#fff',
    borderWidth: 2,
    hoverOffset: 6,
  }]
}

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ৳${ctx.raw.toLocaleString()}` } } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9CA3AF' } },
    y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 11 }, color: '#9CA3AF', callback: v => '৳'+v.toLocaleString() } },
  }
}
const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9CA3AF' } },
    y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 11 }, color: '#9CA3AF' } },
  }
}
const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  cutout: '62%',
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } } },
}

// ── Exports ────────────────────────────────────────────────────────────────
function exportCSV() {
  const rows = [
    ['Report Type','Sales Report'],
    ['Period', periodLabel.value],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric','Value'],
    ...salesReport.value.map(r=>[r.l, r.v]),
    [],
    ['Inventory Metric','Value'],
    ...inventoryReport.value.map(r=>[r.l, r.v]),
  ]
  const csv  = rows.map(r=>r.join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv'})
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href=url; a.download='mnexpharma-report.csv'; a.click()
  URL.revokeObjectURL(url)
}
function exportPDF() {
  alert('PDF export will be available in the production build.')
}
</script>

<style scoped>
.btn-outline   { @apply inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors; }
.th            { @apply px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap; }
</style>
