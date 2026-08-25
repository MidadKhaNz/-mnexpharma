import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  mockMedicines,
  mockSuppliers,
  mockSales,
  mockStats,
  mockNotifications,
  mockCustomers,
  mockPrescriptions,
  mockDoctors,
  mockEmployees,
} from '@/data/mockData.js'
import { api } from '@/services/api.js'

export const usePharmacyStore = defineStore('pharmacy', () => {
  const medicines = ref(mockMedicines.map((medicine) => ({ ...medicine })))
  const suppliers = ref([...mockSuppliers])
  const sales = ref([...mockSales])
  const dashboardStats = ref([...mockStats])
  const notifications = ref([...mockNotifications])
  const customers = ref(mockCustomers.map((customer) => ({ ...customer })))
  const prescriptions = ref(mockPrescriptions.map((prescription) => ({ ...prescription })))
  const doctors = ref(mockDoctors.map((doctor) => ({ ...doctor })))
  const employees = ref(mockEmployees.map((employee) => ({ ...employee })))
  const purchases = ref([])
  const purchaseSummary = ref([])
  const reports = ref(null)
  const settings = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const sidebarOpen = ref(true)

  const unreadNotificationCount = computed(
    () => notifications.value.filter((notification) => !notification.read).length,
  )
  const lowStockMedicines = computed(
    () => medicines.value
      .filter((medicine) => medicine.stock > 0 && medicine.stock < medicine.reorder)
      .sort((a, b) => a.stock - b.stock),
  )
  const expiredMedicines = computed(
    () => medicines.value.filter((medicine) => medicine.status === 'expired'),
  )
  const outOfStockMedicines = computed(
    () => medicines.value.filter((medicine) => medicine.stock === 0),
  )
  const totalInventoryValue = computed(
    () => medicines.value.reduce((sum, medicine) => sum + medicine.cost * medicine.stock, 0),
  )
  const totalRevenue = computed(
    () => sales.value
      .filter((sale) => sale.status === 'paid')
      .reduce((sum, sale) => sum + sale.total, 0),
  )
  const recentSales = computed(() => [...sales.value].slice(0, 10))

  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySales = computed(
    () => sales.value.filter((sale) => sale.date === todayStr),
  )
  const todaySalesCount = computed(() => todaySales.value.length)
  const todayRevenue = computed(
    () => todaySales.value
      .filter((sale) => sale.status === 'paid')
      .reduce((sum, sale) => sum + sale.total, 0),
  )
  const todayAvgSale = computed(
    () => (todaySalesCount.value ? todayRevenue.value / todaySalesCount.value : 0),
  )
  const totalTransactions = computed(() => sales.value.length)

  async function withLoading(callback) {
    isLoading.value = true
    error.value = null
    try {
      return await callback()
    } catch (err) {
      error.value = err?.message ?? 'Backend request failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchInitialData() {
    return withLoading(async () => {
      await Promise.all([
        fetchMedicines(false),
        fetchSuppliers(false),
        fetchSales(false),
        fetchNotifications(false),
        fetchCustomers(false),
        fetchPrescriptions(false),
        fetchDoctors(false),
        fetchEmployees(false),
        fetchPurchases(false),
        fetchReports(false),
        fetchSettings(false),
        fetchDashboard(false),
      ])
    }).catch(() => {
      // Keep the existing mock data visible when the API server is not running.
    })
  }

  async function fetchDashboard(showLoading = true) {
    const run = async () => {
      const data = await api.get('/dashboard')
      dashboardStats.value = data.stats
      return data
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchMedicines(showLoading = true) {
    const run = async () => {
      medicines.value = await api.get('/medicines')
      return medicines.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchSuppliers(showLoading = true) {
    const run = async () => {
      suppliers.value = await api.get('/suppliers')
      return suppliers.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchSales(showLoading = true) {
    const run = async () => {
      sales.value = await api.get('/sales')
      return sales.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchNotifications(showLoading = true) {
    const run = async () => {
      notifications.value = await api.get('/notifications')
      return notifications.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchCustomers(showLoading = true) {
    const run = async () => {
      customers.value = await api.get('/customers')
      return customers.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchPrescriptions(showLoading = true) {
    const run = async () => {
      prescriptions.value = await api.get('/prescriptions')
      return prescriptions.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchDoctors(showLoading = true) {
    const run = async () => {
      doctors.value = await api.get('/doctors')
      return doctors.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchEmployees(showLoading = true) {
    const run = async () => {
      employees.value = await api.get('/employees')
      return employees.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchPurchases(showLoading = true) {
    const run = async () => {
      const data = await api.get('/purchases-summary')
      purchases.value = data.purchases
      purchaseSummary.value = data.summary
      return data
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchReports(showLoading = true) {
    const run = async () => {
      reports.value = await api.get('/reports')
      return reports.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function fetchSettings(showLoading = true) {
    const run = async () => {
      settings.value = await api.get('/settings')
      return settings.value
    }
    return showLoading ? withLoading(run) : run()
  }

  async function addMedicine(medicine) {
    const created = await withLoading(() => api.post('/medicines', medicine))
    medicines.value.unshift(created)
    await fetchDashboard(false)
    return created
  }

  async function saveSupplier(supplier) {
    const saved = supplier.id
      ? await withLoading(() => api.patch(`/suppliers/${supplier.id}`, supplier))
      : await withLoading(() => api.post('/suppliers', supplier))
    const index = suppliers.value.findIndex((item) => item.id === saved.id)
    if (index === -1) suppliers.value.unshift(saved)
    else suppliers.value[index] = saved
    return saved
  }

  async function deleteSupplier(id) {
    await withLoading(() => api.delete(`/suppliers/${id}`))
    suppliers.value = suppliers.value.filter((supplier) => supplier.id !== id)
  }

  async function saveCustomer(customer) {
    const saved = customer.id
      ? await withLoading(() => api.patch(`/customers/${customer.id}`, customer))
      : await withLoading(() => api.post('/customers', customer))
    const index = customers.value.findIndex((item) => item.id === saved.id)
    if (index === -1) customers.value.unshift(saved)
    else customers.value[index] = saved
    return saved
  }

  async function deleteCustomer(id) {
    await withLoading(() => api.delete(`/customers/${id}`))
    customers.value = customers.value.filter((customer) => customer.id !== id)
  }

  async function savePrescription(prescription) {
    const saved = prescription.id
      ? await withLoading(() => api.patch(`/prescriptions/${prescription.id}`, prescription))
      : await withLoading(() => api.post('/prescriptions', prescription))
    const index = prescriptions.value.findIndex((item) => item.id === saved.id)
    if (index === -1) prescriptions.value.unshift(saved)
    else prescriptions.value[index] = saved
    return saved
  }

  async function updatePrescriptionStatus(id, status, pharmacist = null) {
    const saved = await withLoading(() => api.patch(`/prescriptions/${id}`, { status, pharmacist }))
    const index = prescriptions.value.findIndex((item) => item.id === saved.id)
    if (index !== -1) prescriptions.value[index] = saved
    return saved
  }

  async function saveSettings(payload) {
    settings.value = await withLoading(() => api.patch('/settings', payload))
    return settings.value
  }

  async function updateMedicine(updated) {
    const saved = await withLoading(() => api.patch(`/medicines/${updated.id}`, updated))
    const index = medicines.value.findIndex((medicine) => medicine.id === updated.id)
    if (index !== -1) medicines.value[index] = saved
    await fetchDashboard(false)
    return saved
  }

  async function deleteMedicine(id) {
    await withLoading(() => api.delete(`/medicines/${id}`))
    medicines.value = medicines.value.filter((medicine) => medicine.id !== id)
    await fetchDashboard(false)
  }

  async function addSale(saleData) {
    const created = await withLoading(() => api.post('/sales', saleData))
    sales.value.unshift(created)
    await Promise.all([fetchMedicines(false), fetchDashboard(false)])
    return created
  }

  function nextInvoiceId() {
    const nums = sales.value
      .map((sale) => parseInt(sale.id?.replace(/\D/g, '') || '0', 10))
      .filter((number) => !Number.isNaN(number))
    const max = nums.length ? Math.max(...nums) : 100
    return `INV-${new Date().getFullYear()}-${String(max + 1).padStart(4, '0')}`
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function markNotificationRead(id) {
    api.post(`/notifications/${id}/read`, {}).catch(() => {})
    const notification = notifications.value.find((item) => item.id === id)
    if (notification) notification.read = true
  }

  function markAllNotificationsRead() {
    api.post('/notifications/read-all/read', {}).catch(() => {})
    notifications.value.forEach((notification) => {
      notification.read = true
    })
  }

  return {
    medicines,
    suppliers,
    sales,
    dashboardStats,
    notifications,
    customers,
    prescriptions,
    doctors,
    employees,
    purchases,
    purchaseSummary,
    reports,
    settings,
    isLoading,
    error,
    sidebarOpen,
    unreadNotificationCount,
    lowStockMedicines,
    expiredMedicines,
    outOfStockMedicines,
    totalInventoryValue,
    totalRevenue,
    recentSales,
    todaySalesCount,
    todayRevenue,
    todayAvgSale,
    totalTransactions,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    saveSupplier,
    deleteSupplier,
    saveCustomer,
    deleteCustomer,
    savePrescription,
    updatePrescriptionStatus,
    saveSettings,
    addSale,
    nextInvoiceId,
    toggleSidebar,
    markNotificationRead,
    markAllNotificationsRead,
    fetchInitialData,
    fetchDashboard,
    fetchMedicines,
    fetchSuppliers,
    fetchSales,
    fetchNotifications,
    fetchCustomers,
    fetchPrescriptions,
    fetchDoctors,
    fetchEmployees,
    fetchPurchases,
    fetchReports,
    fetchSettings,
  }
})
