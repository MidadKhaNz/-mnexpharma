import { resetDatabase } from './database.js'

const data = await resetDatabase()

console.log('MNEXPharma database seeded.')
console.log(`Medicines: ${data.medicines.length}`)
console.log(`Suppliers: ${data.suppliers.length}`)
console.log(`Sales: ${data.sales.length}`)
console.log(`Customers: ${data.customers.length}`)
