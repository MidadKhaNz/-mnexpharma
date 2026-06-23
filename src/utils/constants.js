export const APP_NAME    = 'MNEXPharma'
export const APP_TAGLINE = 'Pharmacy Management System'

export const BRAND_COLORS = {
  primary:   '#0F766E',
  secondary: '#14B8A6'
}

export const NAV_ITEMS = [
  {
    group: 'Operations',
    items: [
      { label: 'Dashboard',      icon: 'HomeIcon',               route: '/'             },
      { label: 'Sales POS',      icon: 'ShoppingCartIcon',       route: '/sales-pos'    },
      { label: 'Medicines',      icon: 'BeakerIcon',             route: '/medicines'    },
      { label: 'Inventory',      icon: 'ArchiveBoxIcon',         route: '/inventory'    },
      { label: 'Purchases',      icon: 'TruckIcon',              route: '/purchases'    },
    ]
  },
  {
    group: 'Patients & Suppliers',
    items: [
      { label: 'Suppliers',      icon: 'BuildingStorefrontIcon', route: '/suppliers'    },
      { label: 'Customers',      icon: 'UsersIcon',              route: '/customers'    },
      { label: 'Prescriptions',  icon: 'DocumentTextIcon',       route: '/prescriptions'},
    ]
  },
  {
    group: 'Reporting',
    items: [
      { label: 'Reports',        icon: 'ChartBarIcon',           route: '/reports'      },
    ]
  },
  {
    group: 'System',
    items: [
      { label: 'Settings',       icon: 'CogIcon',                route: '/settings'     },
    ]
  }
]

export const PAGINATION_OPTIONS = [10, 25, 50, 100]

export const DATE_FORMAT     = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'

export const STATUS = {
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  PENDING:  'pending',
  EXPIRED:  'expired'
}
