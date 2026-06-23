import { createRouter, createWebHistory } from 'vue-router'

// Lazy-load every page for optimal code splitting
const Dashboard     = () => import('@/pages/Dashboard.vue')
const Medicines     = () => import('@/pages/Medicines.vue')
const Inventory     = () => import('@/pages/Inventory.vue')
const SalesPOS      = () => import('@/pages/SalesPOS.vue')
const Purchases     = () => import('@/pages/Purchases.vue')
const Suppliers     = () => import('@/pages/Suppliers.vue')
const Customers     = () => import('@/pages/Customers.vue')
const Prescriptions = () => import('@/pages/Prescriptions.vue')
const Doctors       = () => import('@/pages/Doctors.vue')
const Employees     = () => import('@/pages/Employees.vue')
const Reports       = () => import('@/pages/Reports.vue')
const Notifications = () => import('@/pages/Notifications.vue')
const UsersRoles    = () => import('@/pages/UsersRoles.vue')
const Settings      = () => import('@/pages/Settings.vue')
const NotFound      = () => import('@/pages/NotFound.vue')

const routes = [
  { path: '/',               name: 'dashboard',     component: Dashboard,     meta: { title: 'Dashboard' }         },
  { path: '/medicines',      name: 'medicines',     component: Medicines,     meta: { title: 'Medicines' }         },
  { path: '/inventory',      name: 'inventory',     component: Inventory,     meta: { title: 'Inventory' }         },
  { path: '/sales-pos',      name: 'sales-pos',     component: SalesPOS,      meta: { title: 'Sales POS' }         },
  { path: '/purchases',      name: 'purchases',     component: Purchases,     meta: { title: 'Purchases' }         },
  { path: '/suppliers',      name: 'suppliers',     component: Suppliers,     meta: { title: 'Suppliers' }         },
  { path: '/customers',      name: 'customers',     component: Customers,     meta: { title: 'Customers' }         },
  { path: '/prescriptions',  name: 'prescriptions', component: Prescriptions, meta: { title: 'Prescriptions' }     },
  { path: '/doctors',        name: 'doctors',       component: Doctors,       meta: { title: 'Doctors' }           },
  { path: '/employees',      name: 'employees',     component: Employees,     meta: { title: 'Employees' }         },
  { path: '/reports',        name: 'reports',       component: Reports,       meta: { title: 'Reports' }           },
  { path: '/notifications',  name: 'notifications', component: Notifications, meta: { title: 'Notifications' }     },
  { path: '/users-roles',    name: 'users-roles',   component: UsersRoles,    meta: { title: 'Users & Roles' }     },
  { path: '/settings',       name: 'settings',      component: Settings,      meta: { title: 'Settings' }         },
  { path: '/:pathMatch(.*)*', name: 'not-found',   component: NotFound,      meta: { title: '404 Not Found' }    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' })
})

// Update document title on route change
router.afterEach(to => {
  document.title = `${to.meta.title ?? 'Page'} — MNEXPharma`
})

export default router
