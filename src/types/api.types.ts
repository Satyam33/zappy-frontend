export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent'
  avatar?: string
}

export interface Organization {
  id: string
  name: string
  plan: 'starter' | 'growth' | 'pro'
  displayPhone?: string
  category?: string
  timezone?: string
  optOutKeyword?: string
}
