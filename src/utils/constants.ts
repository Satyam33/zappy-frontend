export const PLANS = {
  starter: { name: 'Starter', price: 999, contacts: 1000, messages: 5000, conversations: 500 },
  growth:  { name: 'Growth',  price: 2499, contacts: 5000, messages: 25000, conversations: 2500 },
  pro:     { name: 'Pro',     price: 5999, contacts: -1, messages: -1, conversations: -1 },
}

export const SEGMENTS = ['All', 'VIP', 'New Customer', 'Repeat', 'Inactive'] as const

export const TEMPLATE_CATEGORIES = ['marketing', 'utility', 'authentication'] as const

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'kn', label: 'Kannada' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'bn', label: 'Bengali' },
]

export const TIME_RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
]
