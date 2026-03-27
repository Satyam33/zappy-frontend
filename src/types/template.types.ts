export type TemplateStatus = 'draft' | 'pending' | 'approved' | 'action_required'
export type TemplateCategory = 'marketing' | 'utility' | 'authentication'
export type TemplateType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION' | 'CAROUSEL' | 'LIMITED_TIME_OFFER'
export type TemplateSource = 'predefined' | 'custom'
export type InteractiveMode = 'none' | 'cta' | 'quick_replies' | 'all'
export type InteractiveActionType = 'URL' | 'PHONE' | 'QUICK_REPLY' | 'COPY_CODE'

export interface Template {
  id: string
  org_id?: string | null
  is_predefined?: boolean
  name: string
  category: TemplateCategory
  language: string
  template_type: TemplateType
  body: string
  status: TemplateStatus
  interactive_mode: InteractiveMode
  interactive_actions: Array<{ type: InteractiveActionType; title: string; value?: string }>
  sample_values: Record<string, string>
  variables: string[]
  rejectionReason?: string
  created_at: string
}
