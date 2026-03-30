import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { campaignsService, getCampaignsApiErrorMessage } from '@/services/campaigns.service'
import type { Campaign, CampaignAudience, CampaignsMeta, CampaignTemplateMeta } from '@/types/campaign.types'

export const useCampaignsPageController = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [meta, setMeta] = useState<CampaignsMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [metaLoading, setMetaLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const loadCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const data = await campaignsService.getAll({
        page,
        limit: pageSize,
        search: search.trim() || undefined
      })
      setCampaigns(data.items)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error: unknown) {
      toast.error(getCampaignsApiErrorMessage(error, 'Failed to load campaigns'))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

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
      setPage(1)
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
    search,
    page,
    pageSize,
    total,
    totalPages,
    loading,
    meta,
    metaLoading,
    modalOpen,
    setModalOpen,
    approvedTemplates,
    previewAudience,
    createCampaign,
    setSearch: (value: string) => { setPage(1); setSearch(value) },
    setPage,
    setPageSize: (value: number) => { setPage(1); setPageSize(value) }
  }
}
