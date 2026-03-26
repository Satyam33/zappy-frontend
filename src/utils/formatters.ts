import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatPhone = (phone: string) => {
  if (!phone) return ''
  const clean = phone.replace(/\s/g, '')
  if (clean.startsWith('+91') && clean.length === 13) {
    return `+91 ${clean.slice(3, 8)} ${clean.slice(8)}`
  }
  return phone
}

export const formatDate = (dateStr: string) => {
  try { return format(parseISO(dateStr), 'dd MMM yyyy') }
  catch { return dateStr }
}

export const formatDateTime = (dateStr: string) => {
  try { return format(parseISO(dateStr), 'dd MMM yyyy, hh:mm a') }
  catch { return dateStr }
}

export const formatRelative = (dateStr: string) => {
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }) }
  catch { return dateStr }
}

export const formatNumber = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export const formatPercent = (value: number, total: number) => {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
