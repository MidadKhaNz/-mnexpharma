import http from 'node:http'
import crypto from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { URL } from 'node:url'
import { fileURLToPath } from 'node:url'
import {
  defaultUser,
  nextInvoiceId,
  nextNumericId,
  readDatabase,
  writeDatabase,
} from './database.js'

const port = Number(process.env.API_PORT || process.env.PORT || 3001)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')
const distIndex = path.join(distDir, 'index.html')
const sessions = new Map()

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const collections = new Set([
  'medicines',
  'suppliers',
  'sales',
  'customers',
  'prescriptions',
  'doctors',
  'employees',
  'notifications',
  'purchases',
  'orders',
])

const orderStatuses = new Set(['pending', 'confirmed', 'packing', 'out_for_delivery', 'delivered', 'cancelled'])

const purchaseValueBySupplier = [82000, 64000, 53000, 28000, 71000, 95000, 46000, 31000, 55000, 120000, 43000, 22000, 18000, 67000, 58000, 25000, 39000, 14000, 48000, 33000]
const duesBySupplier = [5200, 0, 3400, 0, 8100, 0, 2700, 0, 4300, 0, 1800, 0, 0, 3600, 0, 2100, 0, 0, 1500, 0]

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(body))
}

function publicUser(user) {
  const { password, password_hash: passwordHash, ...safeUser } = user
  return safeUser
}

function bearerToken(req) {
  const header = String(req.headers.authorization || '')
  return header.startsWith('Bearer ') ? header.slice(7) : ''
}

function authenticatedUser(req) {
  const token = bearerToken(req)
  return token ? sessions.get(token) : null
}

function requireAuth(req, res) {
  const user = authenticatedUser(req)
  if (!user) {
    send(res, 401, { error: 'Unauthenticated.' })
    return null
  }
  return user
}

async function serveFrontend(url, res) {
  if (!existsSync(distIndex)) {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Frontend build not found. Run "npm run build", then start the server again.')
    return
  }

  const decodedPath = decodeURIComponent(url.pathname)
  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath
  const filePath = path.normalize(path.join(distDir, requestedPath))
  const isInsideDist = filePath === distDir || filePath.startsWith(`${distDir}${path.sep}`)
  const target = isInsideDist && existsSync(filePath) ? filePath : distIndex
  const extension = path.extname(target)

  try {
    const content = await readFile(target)
    res.writeHead(200, {
      'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
      'Cache-Control': target === distIndex ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(content)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('File not found.')
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Request body must be valid JSON.'))
      }
    })
    req.on('error', reject)
  })
}

function withDerivedMedicineStatus(medicine) {
  const expired = medicine.status === 'expired' || (medicine.expiry && new Date(medicine.expiry) < new Date())
  return { ...medicine, status: expired ? 'expired' : medicine.status }
}

function dashboard(db) {
  const medicines = db.medicines.map(withDerivedMedicineStatus)
  const paidSales = db.sales.filter((sale) => sale.status === 'paid')
  const lowStock = medicines.filter((medicine) => medicine.stock > 0 && medicine.stock < medicine.reorder)
  const expired = medicines.filter((medicine) => medicine.status === 'expired')
  const revenue = paidSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0)

  return {
    stats: [
      { id: 1, label: 'Registered Medicines', value: String(medicines.length), icon: 'BeakerIcon', color: 'brand', sub: 'Active formulary' },
      { id: 2, label: 'Recorded Sales', value: String(db.sales.length), icon: 'ShoppingCartIcon', color: 'blue', sub: 'Total billing records' },
      { id: 3, label: 'Total Revenue', value: `BDT ${Math.round(revenue).toLocaleString('en-US')}`, icon: 'CurrencyDollarIcon', color: 'green', sub: 'Cumulative sales value' },
      { id: 4, label: 'Reorder Required', value: String(lowStock.length), icon: 'ExclamationTriangleIcon', color: 'amber', sub: 'Below reorder level' },
      { id: 5, label: 'Expired Inventory', value: String(expired.length), icon: 'XCircleIcon', color: 'red', sub: 'Requires disposal' },
      { id: 6, label: 'Active Suppliers', value: String(db.suppliers.filter((supplier) => supplier.status === 'active').length), icon: 'TruckIcon', color: 'purple', sub: `${db.suppliers.length} registered` },
    ],
    low_stock: lowStock,
    expired_medicines: expired,
    recent_sales: db.sales.slice(0, 10),
  }
}

function reports(db) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const salesByMonth = Array(12).fill(0)
  const revenueByMonth = Array(12).fill(0)
  const baseMonth = 6

  db.sales.forEach((sale) => {
    const date = new Date(sale.date)
    const monthIndex = (date.getMonth() - baseMonth + 12) % 12
    salesByMonth[monthIndex] += 1
    revenueByMonth[monthIndex] += Number(sale.total || 0)
  })

  const categories = [...new Set(db.medicines.map((medicine) => medicine.category))]
  return {
    monthly_sales: {
      labels: months,
      sales: salesByMonth,
      revenue: revenueByMonth.map((value) => Number(value.toFixed(2))),
    },
    sales_by_category: {
      labels: categories,
      data: categories.map((category) => db.medicines.filter((medicine) => medicine.category === category).length),
    },
    top_customers: [...db.customers].sort((a, b) => Number(b.total_purchases || 0) - Number(a.total_purchases || 0)).slice(0, 8),
    sales_report: db.sales.slice(0, 50),
    inventory_report: db.medicines.map(withDerivedMedicineStatus),
  }
}

function purchaseSummary(db) {
  const totalAmount = db.purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0)
  return {
    summary: [
      { label: 'Orders This Month', value: String(db.purchases.length), color: 'text-gray-900' },
      { label: 'Total Amount', value: `BDT ${totalAmount.toLocaleString('en-US')}`, color: 'text-brand-600' },
      { label: 'Pending Delivery', value: String(db.purchases.filter((purchase) => purchase.status === 'pending').length), color: 'text-amber-600' },
      { label: 'Overdue Payments', value: String(db.purchases.filter((purchase) => purchase.status === 'overdue' || purchase.payment_status === 'overdue').length), color: 'text-red-600' },
    ],
    purchases: db.purchases,
  }
}

function suppliersWithMetrics(db) {
  return db.suppliers.map((supplier, index) => ({
    ...supplier,
    purchase_value: purchaseValueBySupplier[index] ?? 10000,
    outstanding_due: duesBySupplier[index] ?? 0,
  }))
}

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id))
}

function validateCustomer(payload) {
  const name = String(payload.name || '').trim()
  const phone = String(payload.phone || '').trim()
  if (!name) return 'Customer name is required.'
  if (!phone) return 'Customer phone is required.'
  return null
}

function validateMedicine(payload) {
  const required = ['name', 'generic', 'category', 'dosage_form', 'strength', 'manufacturer', 'batch', 'expiry']
  for (const field of required) {
    if (!String(payload[field] || '').trim()) return `${field.replace('_', ' ')} is required.`
  }
  for (const field of ['cost', 'price', 'stock', 'reorder']) {
    if (!Number.isFinite(Number(payload[field]))) return `${field} must be numeric.`
  }
  return null
}

function validationError(collection, payload) {
  if (collection === 'customers') return validateCustomer(payload)
  if (collection === 'medicines') return validateMedicine(payload)
  return null
}

function publicCatalog(db) {
  return db.medicines
    .map(withDerivedMedicineStatus)
    .filter((medicine) => medicine.status !== 'expired' && Number(medicine.stock || 0) > 0)
    .map((medicine) => ({
      id: medicine.id,
      name: medicine.name,
      generic: medicine.generic,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      dosage_form: medicine.dosage_form,
      strength: medicine.strength,
      stock: medicine.stock,
      price: medicine.price,
      expiry: medicine.expiry,
      description: medicine.description,
      prescription_required: ['Antibiotic', 'Hormonal', 'Corticosteroid', 'Neurological'].includes(medicine.category),
    }))
}

function validateOrder(body) {
  const customer = body.customer || {}
  if (!String(customer.name || '').trim()) return 'Customer name is required.'
  if (!String(customer.phone || '').trim()) return 'Customer phone is required.'
  if (!String(customer.address || '').trim()) return 'Delivery address is required.'
  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return 'Order must include at least one medicine.'
  for (const item of items) {
    if (!Number.isFinite(Number(item.qty)) || Number(item.qty) <= 0) return 'Order item quantity must be greater than zero.'
  }
  return null
}

function nextOrderId(orders) {
  const year = new Date().getFullYear()
  const max = orders
    .map((order) => Number(String(order.id ?? '').replace(/^ORD-\d{4}-/, '')))
    .filter(Number.isFinite)
    .reduce((highest, id) => Math.max(highest, id), 0)
  return `ORD-${year}-${String(max + 1).padStart(4, '0')}`
}

async function createOrder(req, res) {
  const db = await readDatabase()
  if (!Array.isArray(db.orders)) db.orders = []
  const body = await readBody(req)
  const error = validateOrder(body)
  if (error) return send(res, 422, { error })

  const items = []
  for (const item of body.items) {
    const medicine = findById(db.medicines, item.medicine_id)
    if (!medicine) return send(res, 422, { error: `Medicine ${item.medicine_id} was not found.` })
    if (withDerivedMedicineStatus(medicine).status === 'expired') return send(res, 422, { error: `${medicine.name} is expired and cannot be ordered.` })
    if (Number(medicine.stock || 0) < Number(item.qty || 0)) return send(res, 422, { error: `${medicine.name} does not have enough stock.` })
    items.push({
      medicine_id: medicine.id,
      name: medicine.name,
      qty: Number(item.qty),
      price: Number(medicine.price || 0),
      total: Number(item.qty) * Number(medicine.price || 0),
    })
  }

  const now = new Date()
  const order = {
    id: nextOrderId(db.orders),
    customer: {
      name: String(body.customer.name || '').trim(),
      phone: String(body.customer.phone || '').trim(),
      address: String(body.customer.address || '').trim(),
    },
    items,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
    delivery_fee: Number(body.delivery_fee || 0),
    total: items.reduce((sum, item) => sum + item.total, 0) + Number(body.delivery_fee || 0),
    payment_method: body.payment_method || 'cash_on_delivery',
    prescription: {
      attached: Boolean(body.prescription?.attached),
      label: String(body.prescription?.label || '').trim(),
      mime_type: String(body.prescription?.mime_type || '').trim(),
      size: Number(body.prescription?.size || 0),
      image_base64: String(body.prescription?.image_base64 || ''),
      note: String(body.prescription?.note || '').trim(),
      review_status: body.prescription?.attached ? 'pending' : 'not_required',
      review_note: '',
      reviewed_at: '',
    },
    status: 'pending',
    rider_name: '',
    rider_phone: '',
    pickup_time: '',
    delivery_eta: '',
    delivered_at: '',
    confirmed_at: '',
    notes: String(body.notes || '').trim(),
    status_history: [{ status: 'pending', at: now.toISOString(), note: 'Order placed by customer.' }],
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
  }
  db.orders.unshift(order)
  await writeDatabase(db)
  return send(res, 201, { data: order })
}

async function customerOrders(req, res, url) {
  const db = await readDatabase()
  const phone = String(url.searchParams.get('phone') || '').trim()
  if (!phone) return send(res, 422, { error: 'Phone number is required.' })
  const orders = (db.orders || [])
    .filter((order) => String(order.customer?.phone || '').trim() === phone)
    .slice(0, 20)
  return send(res, 200, { data: orders })
}

async function updateOrderStatus(req, res, id) {
  const db = await readDatabase()
  const order = findById(db.orders || [], id)
  if (!order) return send(res, 404, { error: 'Order not found.' })

  const body = await readBody(req)
  const status = String(body.status || '').trim()
  if (!orderStatuses.has(status)) return send(res, 422, { error: 'Invalid order status.' })
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return send(res, 422, { error: 'Completed or cancelled orders cannot be changed.' })
  }
  if (['confirmed', 'packing', 'out_for_delivery', 'delivered'].includes(status) && order.prescription?.attached && order.prescription?.review_status === 'rejected') {
    return send(res, 422, { error: 'Rejected prescriptions must be resolved before processing the order.' })
  }

  order.status = status
  if (body.rider_name !== undefined) order.rider_name = String(body.rider_name || '').trim()
  if (body.rider_phone !== undefined) order.rider_phone = String(body.rider_phone || '').trim()
  if (body.pickup_time !== undefined) order.pickup_time = String(body.pickup_time || '').trim()
  if (body.delivery_eta !== undefined) order.delivery_eta = String(body.delivery_eta || '').trim()
  if (body.note !== undefined) order.notes = String(body.note || '').trim()
  if (body.prescription_review_status !== undefined) {
    const reviewStatus = String(body.prescription_review_status || '').trim()
    const allowedReviewStatuses = new Set(['pending', 'approved', 'rejected', 'not_required'])
    if (!allowedReviewStatuses.has(reviewStatus)) return send(res, 422, { error: 'Invalid prescription review status.' })
    if (!order.prescription) order.prescription = {}
    order.prescription.review_status = reviewStatus
    order.prescription.review_note = String(body.prescription_review_note || '').trim()
    order.prescription.reviewed_at = new Date().toISOString()
  }
  if (status === 'confirmed') order.confirmed_at = new Date().toISOString()
  if (status === 'out_for_delivery' && !order.pickup_time) order.pickup_time = new Date().toISOString()
  if (status === 'delivered') order.delivered_at = new Date().toISOString()
  if (!Array.isArray(order.status_history)) order.status_history = []
  order.status_history.push({
    status,
    at: new Date().toISOString(),
    note: String(body.note || '').trim(),
  })

  await writeDatabase(db)
  return send(res, 200, { data: order })
}

async function handleCollection(req, res, collection, id) {
  const db = await readDatabase()
  const items = db[collection]
  if (!Array.isArray(items)) return send(res, 404, { error: 'Collection not found.' })

  if (req.method === 'GET' && !id) {
    if (collection === 'suppliers') return send(res, 200, { data: suppliersWithMetrics(db) })
    return send(res, 200, { data: items })
  }
  if (req.method === 'GET' && id) {
    const item = findById(items, id)
    return item ? send(res, 200, { data: item }) : send(res, 404, { error: 'Record not found.' })
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const error = validationError(collection, body)
    if (error) return send(res, 422, { error })
    const item = { ...body, id: body.id ?? nextNumericId(items) }
    items.unshift(item)
    await writeDatabase(db)
    return send(res, 201, { data: item })
  }

  if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
    const index = items.findIndex((item) => String(item.id) === String(id))
    if (index === -1) return send(res, 404, { error: 'Record not found.' })
    const body = await readBody(req)
    const nextItem = { ...items[index], ...body, id: items[index].id }
    const error = validationError(collection, nextItem)
    if (error) return send(res, 422, { error })
    items[index] = nextItem
    await writeDatabase(db)
    return send(res, 200, { data: items[index] })
  }

  if (req.method === 'DELETE' && id) {
    const index = items.findIndex((item) => String(item.id) === String(id))
    if (index === -1) return send(res, 404, { error: 'Record not found.' })
    const [deleted] = items.splice(index, 1)
    await writeDatabase(db)
    return send(res, 200, { data: deleted })
  }

  return send(res, 405, { error: 'Method not allowed.' })
}

async function createSale(req, res) {
  const db = await readDatabase()
  const body = await readBody(req)
  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return send(res, 422, { error: 'Sale must include at least one item.' })
  if (!Number.isFinite(Number(body.total)) || Number(body.total) <= 0) return send(res, 422, { error: 'Sale total must be greater than zero.' })

  for (const item of items) {
    if (!Number.isFinite(Number(item.qty)) || Number(item.qty) <= 0) return send(res, 422, { error: 'Sale item quantity must be greater than zero.' })
    const medicine = findById(db.medicines, item.medicine_id)
    if (!medicine) return send(res, 422, { error: `Medicine ${item.medicine_id} was not found.` })
    if (Number(medicine.stock) < Number(item.qty || 0)) {
      return send(res, 422, { error: `${medicine.name} does not have enough stock.` })
    }
  }

  items.forEach((item) => {
    const medicine = findById(db.medicines, item.medicine_id)
    medicine.stock = Math.max(0, Number(medicine.stock) - Number(item.qty || 0))
  })

  const now = new Date()
  const sale = {
    ...body,
    id: body.id || nextInvoiceId(db.sales),
    status: body.status || 'paid',
    date: body.date || now.toISOString().slice(0, 10),
    time: body.time || now.toTimeString().slice(0, 5),
  }
  db.sales.unshift(sale)

  if (sale.customer && sale.customer !== 'Walk-in Patient') {
    const customer = db.customers.find((item) => item.phone === sale.phone || item.name === sale.customer)
    if (customer) {
      customer.total_purchases = Number(customer.total_purchases || 0) + Number(sale.total || 0)
      customer.loyalty_points = Math.floor(Number(customer.total_purchases || 0) / 20)
      customer.visits = Number(customer.visits || 0) + 1
      customer.last_visit = sale.date
    }
  }

  await writeDatabase(db)
  return send(res, 201, { data: sale })
}

async function adjustStock(req, res, id) {
  const db = await readDatabase()
  const body = await readBody(req)
  const medicine = findById(db.medicines, id)
  if (!medicine) return send(res, 404, { error: 'Medicine not found.' })

  const quantity = Number(body.quantity || 0)
  if (!Number.isFinite(quantity)) return send(res, 422, { error: 'Quantity must be numeric.' })
  medicine.stock = Math.max(0, Number(medicine.stock || 0) + quantity)
  await writeDatabase(db)
  return send(res, 200, { data: medicine })
}

async function markNotification(req, res, id) {
  const db = await readDatabase()
  if (id === 'read-all') {
    db.notifications.forEach((notification) => { notification.read = true })
    await writeDatabase(db)
    return send(res, 200, { data: db.notifications })
  }

  const notification = findById(db.notifications, id)
  if (!notification) return send(res, 404, { error: 'Notification not found.' })
  notification.read = true
  await writeDatabase(db)
  return send(res, 200, { data: notification })
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {})

  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] !== 'api') return serveFrontend(url, res)

    if (req.method === 'GET' && parts[1] === 'health') return send(res, 200, { ok: true, service: 'MNEXPharma API' })
    if (req.method === 'GET' && parts[1] === 'catalog') return send(res, 200, { data: publicCatalog(await readDatabase()) })
    if (req.method === 'GET' && parts[1] === 'orders' && parts[2] === 'customer') return customerOrders(req, res, url)
    if (req.method === 'POST' && parts[1] === 'orders') return createOrder(req, res)

    if (req.method === 'POST' && parts[1] === 'auth' && parts[2] === 'login') {
      const body = await readBody(req)
      const email = String(body.email || '').toLowerCase().trim()
      const password = String(body.password || '')
      if (email !== defaultUser.email || password !== 'admin123') return send(res, 401, { error: 'Invalid credentials.' })
      const token = crypto.randomBytes(32).toString('hex')
      sessions.set(token, publicUser(defaultUser))
      return send(res, 200, {
        data: {
          token,
          user: publicUser(defaultUser),
        },
      })
    }

    if (parts[1] === 'auth' && parts[2] === 'me' && req.method === 'GET') {
      const user = requireAuth(req, res)
      return user ? send(res, 200, { data: user }) : undefined
    }
    if (req.method === 'POST' && parts[1] === 'auth' && parts[2] === 'logout') {
      const token = bearerToken(req)
      if (token) sessions.delete(token)
      return send(res, 200, { ok: true })
    }

    if (!requireAuth(req, res)) return undefined

    if (req.method === 'GET' && parts[1] === 'dashboard') return send(res, 200, { data: dashboard(await readDatabase()) })
    if (req.method === 'GET' && parts[1] === 'reports') return send(res, 200, { data: reports(await readDatabase()) })
    if (req.method === 'GET' && parts[1] === 'settings') return send(res, 200, { data: (await readDatabase()).settings })
    if ((req.method === 'PUT' || req.method === 'PATCH') && parts[1] === 'settings') {
      const db = await readDatabase()
      db.settings = { ...db.settings, ...(await readBody(req)) }
      await writeDatabase(db)
      return send(res, 200, { data: db.settings })
    }
    if (req.method === 'GET' && parts[1] === 'purchases-summary') return send(res, 200, { data: purchaseSummary(await readDatabase()) })

    if (parts[1] === 'sales' && req.method === 'POST') return createSale(req, res)
    if (parts[1] === 'orders' && parts[3] === 'status' && req.method === 'PATCH') return updateOrderStatus(req, res, parts[2])
    if (parts[1] === 'medicines' && parts[3] === 'adjust-stock' && req.method === 'POST') return adjustStock(req, res, parts[2])
    if (parts[1] === 'notifications' && parts[3] === 'read' && req.method === 'POST') return markNotification(req, res, parts[2])

    if (collections.has(parts[1])) return handleCollection(req, res, parts[1], parts[2])

    return send(res, 404, { error: 'Route not found.' })
  } catch (error) {
    return send(res, 500, { error: error.message || 'Internal server error.' })
  }
}

http.createServer(handle).listen(port, () => {
  console.log(`MNEXPharma full-stack app running at http://localhost:${port}`)
})
