export interface Contact {
  id: string
  name: string
  phone: string
  tags: string[]
  opted_in: boolean
  segment?: string
  added: string
  createdAt: string
}

export type ContactSegment = 'All' | 'VIP' | 'New Customer' | 'Repeat' | 'Inactive'
