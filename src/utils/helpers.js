/**
 * Format a number as currency (BDT / USD adaptable)
 */
export function formatCurrency(amount, symbol = '৳') {
  if (amount === null || amount === undefined) return `${symbol}0.00`
  return `${symbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    ...options
  })
}

/**
 * Truncate a string to maxLen characters
 */
export function truncate(str, maxLen = 40) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

/**
 * Debounce a function call
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Generate a simple unique ID for client-side use
 */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Compute percentage change between two numbers
 */
export function percentChange(current, previous) {
  if (!previous || previous === 0) return null
  return (((current - previous) / previous) * 100).toFixed(1)
}

/**
 * Check if a medicine expiry date is approaching within N days
 */
export function isExpiringSoon(dateStr, days = 30) {
  if (!dateStr) return false
  const expiry = new Date(dateStr)
  const now = new Date()
  const diff = (expiry - now) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= days
}

/**
 * Deep clone a plain object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Capitalise first letter of each word
 */
export function titleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
