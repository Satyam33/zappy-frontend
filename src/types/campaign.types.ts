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
