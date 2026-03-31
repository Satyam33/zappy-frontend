import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { templatesService, getTemplatesApiErrorMessage } from '@/services/templates.service'
import type { Template, TemplateSource, TemplateStatus } from '@/types/template.types'

export const TEMPLATE_STATUS_TABS: Array<{ key: 'all' | TemplateStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'action_required', label: 'Action Required' },
]

export const TEMPLATE_SOURCE_TABS: Array<{ key: TemplateSource; label: string }> = [
  { key: 'predefined', label: 'Explore' },
  { key: 'custom', label: 'Custom' },
]

export const TEMPLATE_PAGE_SIZE_OPTIONS = [12, 24, 48, 100] as const
export const TEMPLATE_DATE_FILTER_OPTIONS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '15d', label: 'Last 15 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  // { key: 'custom', label: 'Custom date' },
  { key: 'all', label: 'All time' },
] as const

export const useTemplatesPageController = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [statusTab, setStatusTab] = useState<'all' | TemplateStatus>('all')
  const [sourceTab, setSourceTab] = useState<TemplateSource>('predefined')
  const [search, setSearch] = useState('')
  const [customStatus, setCustomStatus] = useState<'all' | TemplateStatus>('all')
  const [dateFilter, setDateFilter] = useState<'7d' | '15d' | '30d' | '90d' | 'custom' | 'all'>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  const loadTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const now = new Date()
      const getIsoDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
      const normalizeDate = (v: string, endOfDay: boolean) => {
        if (!v) return undefined
        const suffix = endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z'
        return new Date(`${v}${suffix}`).toISOString()
      }
      let created_from: string | undefined
      let created_to: string | undefined
      const activeStatus = sourceTab === 'custom' ? customStatus : statusTab
      if (sourceTab === 'custom') {
        if (dateFilter === '7d') created_from = getIsoDaysAgo(7)
        if (dateFilter === '15d') created_from = getIsoDaysAgo(15)
        if (dateFilter === '30d') created_from = getIsoDaysAgo(30)
        if (dateFilter === '90d') created_from = getIsoDaysAgo(90)
        if (dateFilter === 'custom') {
          created_from = normalizeDate(customStartDate, false)
          created_to = normalizeDate(customEndDate, true)
        }
      }
      const data = await templatesService.getAll({
        page,
        limit: pageSize,
        source: sourceTab,
        status: activeStatus === 'all' ? undefined : activeStatus,
        search: search.trim() || undefined,
        created_from,
        created_to,
        sort_order: sourceTab === 'custom' ? sortOrder : undefined,
      })
      setTemplates(data.items)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setSelectedIds((prev) => prev.filter((id) => data.items.some((t) => t.id === id)))
    } catch (error: unknown) {
      toast.error(getTemplatesApiErrorMessage(error, 'Failed to load templates'))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, sourceTab, statusTab, customStatus, dateFilter, customStartDate, customEndDate, sortOrder])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTemplates()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadTemplates])

  const createTemplate = useCallback(async (payload: {
    name: string
    category: string
    language: string
    templateType: string
    body: string
    sampleValues: Record<string, string>
    interactiveMode: 'none' | 'cta' | 'quick_replies' | 'all'
    interactiveActions: Array<{ type: string; title: string; value?: string }>
    submitAs: 'draft' | 'pending'
  }): Promise<boolean> => {
    try {
      const data = await templatesService.create(payload)
      toast.success(data.message || 'Template created')
      setSourceTab('custom')
      setStatusTab('all')
      setPage(1)
      await loadTemplates()
      return true
    } catch (error: unknown) {
      toast.error(getTemplatesApiErrorMessage(error, 'Failed to create template'))
      return false
    }
  }, [loadTemplates])

  const syncStatus = useCallback(async (): Promise<void> => {
    try {
      const data = await templatesService.syncStatus()
      toast.success(data.message || `Synced ${data.updated} template statuses`)
      await loadTemplates()
    } catch (error: unknown) {
      toast.error(getTemplatesApiErrorMessage(error, 'Failed to sync statuses'))
    }
  }, [loadTemplates])

  return {
    templates,
    statusTab,
    customStatus,
    sourceTab,
    search,
    dateFilter,
    customStartDate,
    customEndDate,
    sortOrder,
    selectedIds,
    page,
    pageSize,
    total,
    totalPages,
    loading,
    modalOpen,
    previewTemplate,
    setStatusTab: (value: 'all' | TemplateStatus) => { setPage(1); setStatusTab(value) },
    setCustomStatus: (value: 'all' | TemplateStatus) => { setPage(1); setCustomStatus(value) },
    setSourceTab: (value: TemplateSource) => { setPage(1); setSelectedIds([]); setSourceTab(value) },
    setSearch: (value: string) => { setPage(1); setSearch(value) },
    setDateFilter: (value: '7d' | '15d' | '30d' | '90d' | 'custom' | 'all') => { setPage(1); setDateFilter(value) },
    setCustomStartDate: (value: string) => { setPage(1); setCustomStartDate(value) },
    setCustomEndDate: (value: string) => { setPage(1); setCustomEndDate(value) },
    setSortOrder: (value: 'asc' | 'desc') => { setPage(1); setSortOrder(value) },
    setSelectedIds,
    setPage,
    setPageSize: (value: number) => { setPage(1); setPageSize(value) },
    setModalOpen,
    setPreviewTemplate,
    createTemplate,
    syncStatus,
  }
}
