import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { campaignsService, getCampaignsApiErrorMessage } from '@/services/campaigns.service'
import type { Campaign, CampaignAudience, CampaignsMeta, CampaignTemplateMeta } from '@/types/campaign.types'

export const useCampaignsPageController = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [meta, setMeta] = useState<CampaignsMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [metaLoading, setMetaLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const loadCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const data = await campaignsService.getAll()
      setCampaigns(data.items)
    } catch (error: unknown) {
      toast.error(getCampaignsApiErrorMessage(error, 'Failed to load campaigns'))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMeta = useCallback(async () => {
    setMetaLoading(true)
    try {
      const data = await campaignsService.getMeta()
      setMeta(data)
    } catch (error: unknown) {
      toast.error(getCampaignsApiErrorMessage(error, 'Failed to load campaign metadata'))
    } finally {
      setMetaLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCampaigns()
      void loadMeta()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadCampaigns, loadMeta])

  const previewAudience = useCallback(async (audience: CampaignAudience) => {
    try {
      return await campaignsService.previewAudience(audience)
    } catch (error: unknown) {
      toast.error(getCampaignsApiErrorMessage(error, 'Failed to preview audience'))
      return { selectedAudience: 0, finalAudience: 0, message: '' }
    }
  }, [])

  const createCampaign = useCallback(async (payload: {
    name: string
    templateId: string
    audience: CampaignAudience
    parameterMapping: Record<string, string>
    scheduleNow: boolean
    scheduledAt?: string
  }): Promise<boolean> => {
    try {
      const data = await campaignsService.create(payload)
      toast.success(data.message || 'Campaign created')
      await loadCampaigns()
      return true
    } catch (error: unknown) {
      toast.error(getCampaignsApiErrorMessage(error, 'Failed to create campaign'))
      return false
    }
  }, [loadCampaigns])

  const approvedTemplates: CampaignTemplateMeta[] = useMemo(() => meta?.templates ?? [], [meta])

  return {
    campaigns,
    loading,
    meta,
    metaLoading,
    modalOpen,
    setModalOpen,
    approvedTemplates,
    previewAudience,
    createCampaign
  }
}
