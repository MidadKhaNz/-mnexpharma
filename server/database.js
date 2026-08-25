import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  mockMedicines,
  mockSuppliers,
  mockSales,
  mockNotifications,
  mockCustomers,
  mockPrescriptions,
  mockDoctors,
  mockEmployees,
} from '../src/data/mockData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const dbPath = path.join(dataDir, 'db.json')

const defaultUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@mnexpharma.com',
  role: 'Super Admin',
  avatar: null,
}

const seedPurchases = [
  { id: 1, po: 'PO-2026-045', supplier: 'Square Pharma', supplier_id: 1, date: '2026-06-20', amount: 48500, status: 'received', payment_status: 'paid' },
  { id: 2, po: 'PO-2026-044', supplier: 'Beximco Pharma', supplier_id: 2, date: '2026-06-18', amount: 72000, status: 'pending', payment_status: 'unpaid' },
  { id: 3, po: 'PO-2026-043', supplier: 'Incepta Pharma', supplier_id: 3, date: '2026-06-15', amount: 31200, status: 'received', payment_status: 'paid' },
  { id: 4, po: 'PO-2026-042', supplier: 'Opsonin Pharma', supplier_id: 4, date: '2026-06-10', amount: 19800, status: 'overdue', payment_status: 'overdue' },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function createSeedData() {
  return {
    users: [defaultUser],
    medicines: clone(mockMedicines),
    suppliers: clone(mockSuppliers),
    sales: clone(mockSales),
    notifications: clone(mockNotifications),
    customers: clone(mockCustomers),
    prescriptions: clone(mockPrescriptions),
    doctors: clone(mockDoctors),
    employees: clone(mockEmployees),
    purchases: clone(seedPurchases),
    orders: [],
    settings: {
      pharmacy_name: 'MNEXPharma',
      license_number: 'DGDA-2024-00000',
      phone: '+880-2-0000000',
      email: 'info@mnexpharma.com',
      address: 'Dhaka, Bangladesh',
      invoice_prefix: 'INV-2026-',
      invoice_footer: 'Thank you for your purchase.',
      currency: 'BDT',
      vat_percent: 0,
      reorder_threshold: 50,
      low_stock_alerts: true,
      expiry_alert_days: 90,
    },
  }
}

export async function ensureDatabase() {
  await mkdir(dataDir, { recursive: true })
  if (!existsSync(dbPath)) {
    await writeDatabase(createSeedData())
  }
}

export async function resetDatabase() {
  await mkdir(dataDir, { recursive: true })
  const data = createSeedData()
  await writeDatabase(data)
  return data
}

export async function readDatabase() {
  await ensureDatabase()
  const data = JSON.parse(await readFile(dbPath, 'utf8'))
  if (!Array.isArray(data.orders)) data.orders = []
  return data
}

export async function writeDatabase(data) {
  await writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

export function nextNumericId(items) {
  const ids = items.map((item) => Number(item.id)).filter(Number.isFinite)
  return ids.length ? Math.max(...ids) + 1 : 1
}

export function nextInvoiceId(sales) {
  const year = new Date().getFullYear()
  const max = sales
    .map((sale) => Number(String(sale.id ?? '').replace(/\D/g, '')))
    .filter(Number.isFinite)
    .reduce((highest, id) => Math.max(highest, id), 100)
  return `INV-${year}-${String(max + 1).padStart(4, '0')}`
}

export { defaultUser }
