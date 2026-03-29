export type CampaignStatus = 'running' | 'completed' | 'scheduled' | 'failed' | 'draft'

export interface Campaign {
  id: string
  name: string
  segment: string
  templateId: string
  templateName?: string
  status: CampaignStatus
  scheduledAt?: string
  sentAt?: string
  stats: {
    sent: number
    delivered: number
    read: number
    replied: number
    failed: number
  }
  createdAt: string
}

export type CampaignAudience =
  | { mode: 'all' }
  | { mode: 'tag'; tag: string }
  | { mode: 'ids'; ids: string[] }

export type CampaignTemplateMeta = {
  id: string
  name: string
  language: string
  body: string
  variables: string[]
  templateType: string
}

export type CampaignsMeta = {
  qualityRating: string
  messagingTier: string
  remainingQuota: number
  selectedAudience: number
  finalAudience: number
  templates: CampaignTemplateMeta[]
  segments: Array<{ key: string; label: string; count?: number }>
  dynamicAttributes: Array<{ key: string; label: string }>
}
