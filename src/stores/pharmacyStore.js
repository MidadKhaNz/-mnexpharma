import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  mockMedicines, mockSuppliers, mockSales, mockStats, mockNotifications
} from '@/data/mockData.js'

export const usePharmacyStore = defineStore('pharmacy', () => {
  // ── State ────────────────────────────────────────────────────────────────
  const medicines      = ref(mockMedicines.map(m => ({ ...m })))
  const suppliers      = ref([...mockSuppliers])
  const sales          = ref([...mockSales])
  const dashboardStats = ref([...mockStats])
  const notifications  = ref([...mockNotifications])
  const isLoading      = ref(false)
  const sidebarOpen    = ref(true)

  // ── Computed ─────────────────────────────────────────────────────────────
  const unreadNotificationCount = computed(
    () => notifications.value.filter(n => !n.read).length
  )
  const lowStockMedicines = computed(
    () => medicines.value.filter(m => m.stock > 0 && m.stock < m.reorder)
      .sort((a, b) => a.stock - b.stock)
  )
  const expiredMedicines = computed(
    () => medicines.value.filter(m => m.status === 'expired')
  )
  const outOfStockMedicines = computed(
    () => medicines.value.filter(m => m.stock === 0)
  )
  const totalInventoryValue = computed(
    () => medicines.value.reduce((sum, m) => sum + m.cost * m.stock, 0)
  )
  const totalRevenue = computed(
    () => sales.value.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0)
  )
  const recentSales = computed(() => [...sales.value].slice(0, 10))

  // today's analytics (for POS dashboard)
  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySales = computed(
    () => sales.value.filter(s => s.date === todayStr)
  )
  const todaySalesCount   = computed(() => todaySales.value.length)
  const todayRevenue      = computed(() => todaySales.value.filter(s => s.status === 'paid').reduce((s, r) => s + r.total, 0))
  const todayAvgSale      = computed(() => todaySalesCount.value ? todayRevenue.value / todaySalesCount.value : 0)
  const totalTransactions = computed(() => sales.value.length)

  // ── Medicine CRUD ─────────────────────────────────────────────────────────
  function addMedicine(med) {
    medicines.value.unshift({ ...med, id: Date.now() })
  }
  function updateMedicine(updated) {
    const idx = medicines.value.findIndex(m => m.id === updated.id)
    if (idx !== -1) medicines.value[idx] = { ...medicines.value[idx], ...updated }
  }
  function deleteMedicine(id) {
    medicines.value = medicines.value.filter(m => m.id !== id)
  }

  // ── Sales CRUD ────────────────────────────────────────────────────────────
  function addSale(saleData) {
    // Reduce stock for each item
    saleData.items.forEach(item => {
      const med = medicines.value.find(m => m.id === item.medicine_id)
      if (med) med.stock = Math.max(0, med.stock - item.qty)
    })
    // Prepend sale so it appears first in recent list
    sales.value.unshift({ ...saleData })
    return saleData
  }

  // ── Invoice number generator ───────────────────────────────────────────────
  function nextInvoiceId() {
    const nums = sales.value
      .map(s => parseInt(s.id?.replace(/\D/g, '') || '0'))
      .filter(n => !isNaN(n))
    const max = nums.length ? Math.max(...nums) : 100
    return `INV-${new Date().getFullYear()}-${String(max + 1).padStart(4, '0')}`
  }

  // ── Sidebar & Notifications ───────────────────────────────────────────────
  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
  function markNotificationRead(id) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }
  function markAllNotificationsRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  // ── Async fetch stubs ─────────────────────────────────────────────────────
  async function fetchMedicines() {
    isLoading.value = true
    try { await new Promise(r => setTimeout(r, 300)); medicines.value = mockMedicines.map(m => ({ ...m })) }
    finally { isLoading.value = false }
  }
  async function fetchSuppliers() {
    isLoading.value = true
    try { await new Promise(r => setTimeout(r, 300)); suppliers.value = [...mockSuppliers] }
    finally { isLoading.value = false }
  }
  async function fetchSales() {
    isLoading.value = true
    try { await new Promise(r => setTimeout(r, 300)); sales.value = [...mockSales] }
    finally { isLoading.value = false }
  }

  return {
    // state
    medicines, suppliers, sales, dashboardStats, notifications, isLoading, sidebarOpen,
    // getters
    unreadNotificationCount, lowStockMedicines, expiredMedicines,
    outOfStockMedicines, totalInventoryValue, totalRevenue, recentSales,
    todaySalesCount, todayRevenue, todayAvgSale, totalTransactions,
    // actions
    addMedicine, updateMedicine, deleteMedicine,
    addSale, nextInvoiceId,
    toggleSidebar, markNotificationRead, markAllNotificationsRead,
    fetchMedicines, fetchSuppliers, fetchSales,
  }
})
