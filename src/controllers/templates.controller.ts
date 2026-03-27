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

export const useTemplatesPageController = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [statusTab, setStatusTab] = useState<'all' | TemplateStatus>('all')
  const [sourceTab, setSourceTab] = useState<TemplateSource>('predefined')
  const [search, setSearch] = useState('')
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
      const data = await templatesService.getAll({
        page,
        limit: pageSize,
        source: sourceTab,
        status: statusTab === 'all' ? undefined : statusTab,
        search: search.trim() || undefined,
      })
      setTemplates(data.items)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error: unknown) {
      toast.error(getTemplatesApiErrorMessage(error, 'Failed to load templates'))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, sourceTab, statusTab])

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
    sourceTab,
    search,
    page,
    pageSize,
    total,
    totalPages,
    loading,
    modalOpen,
    previewTemplate,
    setStatusTab: (value: 'all' | TemplateStatus) => { setPage(1); setStatusTab(value) },
    setSourceTab: (value: TemplateSource) => { setPage(1); setSourceTab(value) },
    setSearch: (value: string) => { setPage(1); setSearch(value) },
    setPage,
    setPageSize: (value: number) => { setPage(1); setPageSize(value) },
    setModalOpen,
    setPreviewTemplate,
    createTemplate,
    syncStatus,
  }
}
