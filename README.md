<div align="center">
  <img src="Screenshot/Screenshot 2026-06-23 191352.png" alt="MNEXPharma Dashboard" width="800" />
  <h1>MNEXPharma</h1>
  <p><strong>Pharmacy Management System</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Pinia-2.x-FFD859?style=flat-square&logo=pinia" alt="Pinia" />
    <img src="https://img.shields.io/badge/Status-Frontend_Complete-22C55E?style=flat-square" alt="Status" />
  </p>
</div>

---

A responsive, full-featured Pharmacy Management System built entirely on the frontend with **Vue 3**, **Vite**, **Tailwind CSS**, and **Pinia**. Designed to help pharmacies manage medicines, inventory, suppliers, customers, prescriptions, billing, and analytics through a clean, production-grade dashboard.

> **Backend ready** — The frontend is complete and structured for integration with PHP Laravel + MySQL.

---

## Screenshots

| Dashboard | Sales POS |
|---|---|
| ![Dashboard](Screenshot/Screenshot%202026-06-23%20191352.png) | ![Sales POS](Screenshot/Screenshot%202026-06-23%20191410.png) |

| Medicines | Inventory |
|---|---|
| ![Medicines](Screenshot/Screenshot%202026-06-23%20191422.png) | ![Inventory](Screenshot/Screenshot%202026-06-23%20191437.png) |

| Suppliers | Customers |
|---|---|
| ![Suppliers](Screenshot/Screenshot%202026-06-23%20191449.png) | ![Customers](Screenshot/Screenshot%202026-06-23%20191603.png) |

| Prescriptions | Reports |
|---|---|
| ![Prescriptions](Screenshot/Screenshot%202026-06-23%20191745.png) | ![Reports](Screenshot/Screenshot%202026-06-23%20191804.png) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue.js 3 — Composition API (`<script setup>`) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 with custom design tokens |
| State Management | Pinia |
| Routing | Vue Router 4 (lazy-loaded routes) |
| Charts | Chart.js 4 + vue-chartjs |
| Icons | Heroicons v2 |

---

## Features

### Dashboard
- Shift summary bar — bills today, Rx pending, low-stock count
- Sales Activity line chart (6M / 12M toggle)
- Stock by Therapeutic Class donut chart
- Stat cards — Registered Medicines, Recorded Sales, Total Revenue, Reorder Required, Expired Inventory, Active Suppliers
- Recent Bills table with status badges

### Sales POS — Dispensing Counter
- Medicine catalogue with category filter tabs
- Add-to-cart with quantity control
- Customer name and phone capture
- Discount (%) and VAT (%) fields
- Payment methods — Cash, Card, Mobile Banking (bKash / Nagad), Bank Transfer
- Invoice print via `window.print()`
- **Finalise Bill** workflow

### Medicines Management
- Full formulary catalogue (50 medicines)
- Search by name, generic, or batch
- Filter by therapeutic category and status
- Stock level indicators and expiry badges
- Add / Edit / Delete with modal form

### Inventory Management
- Real-time stock levels and reorder status
- Stock adjustment modal
- Low-stock and expiry monitoring
- Movement history log

### Suppliers Management
- Supplier directory with star ratings
- Purchase order tracking
- Outstanding payment amounts
- Add / Edit / Delete CRUD

### Customers & Patients
- Patient and customer records (30 records)
- Purchase history and loyalty points
- Visit count tracking
- Add / Edit / Delete with analytics cards

### Prescriptions
- Kanban pipeline — Pending → Verified → Dispensed
- Status promotion workflow
- Upload and dispensing management
- Filterable table by status and date

### Reports & Analytics
- Period selector — Daily / Weekly / Monthly
- Monthly Revenue trend chart
- Dispensing by Category bar chart
- Monthly Bills Issued chart
- Top Patients by Purchase
- Detailed Sales Report and Inventory Report tables
- CSV export

### Additional Modules
- Purchases management
- Doctors directory
- Employees directory
- Notifications centre
- Users & Roles management
- System Settings

---

## Project Structure

```
src/
├── assets/
│   └── main.css              # Design system — @layer components, shimmer, badges
├── components/
│   ├── common/
│   │   ├── BaseModal.vue     # Teleport modal with brand accent bar
│   │   ├── BaseCard.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseTable.vue
│   │   ├── EmptyState.vue    # Empty state with icon, title, CTA
│   │   ├── SkeletonLoader.vue
│   │   └── MnexLogo.vue      # SVG logo — full lockup + icon-only variant
│   └── layout/
│       ├── AppLayout.vue
│       ├── AppSidebar.vue    # Collapsible dark sidebar
│       └── AppNavbar.vue     # Glassmorphism navbar with breadcrumb
├── data/
│   └── mockData.js           # Seed data — medicines, suppliers, customers, prescriptions
├── pages/
│   ├── Dashboard.vue
│   ├── SalesPOS.vue
│   ├── Medicines.vue
│   ├── Inventory.vue
│   ├── Purchases.vue
│   ├── Suppliers.vue
│   ├── Customers.vue
│   ├── Prescriptions.vue
│   ├── Reports.vue
│   ├── Doctors.vue
│   ├── Employees.vue
│   ├── Notifications.vue
│   ├── UsersRoles.vue
│   ├── Settings.vue
│   └── NotFound.vue
├── router/index.js
├── stores/
│   ├── authStore.js
│   └── pharmacyStore.js
└── utils/
    ├── constants.js          # NAV_ITEMS, APP_CONFIG
    └── helpers.js
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/midadkhanz/mnexpharma.git
cd mnexpharma

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Roadmap — Backend Integration

| Feature | Technology |
|---|---|
| REST API | PHP Laravel |
| Database | MySQL |
| Authentication | Laravel Sanctum / JWT |
| Barcode Scanning | ZXing / QuaggaJS |
| Purchase Order Automation | Laravel Queues |
| Multi-Branch Support | Tenant middleware |
| Real-time Notifications | Laravel Echo + Pusher |

---

## Author

**Mufazzal Hasan Khan Midad**
Student ID: 232-134-030 · Batch: 5th
Department of Software Engineering

---

## License

This project is open source under the [MIT License](LICENSE).
