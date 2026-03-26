export type TemplateStatus = 'approved' | 'pending' | 'rejected'
export type TemplateCategory = 'marketing' | 'utility' | 'authentication'

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  language: string
  body: string
  status: TemplateStatus
  rejectionReason?: string
  createdAt: string
}
