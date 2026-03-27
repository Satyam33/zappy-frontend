import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { contactsService, getContactsApiErrorMessage, type ContactsListData, type ContactItem } from '@/services/contacts.service'
import type { Contact, ContactSegment } from '@/types/contact.types'
import { formatDate } from '@/utils/formatters'

type Result<T> = { ok: true; data: T } | { ok: false }
type OptedFilter = 'all' | 'opted_in' | 'opted_out'

export const CONTACT_SEGMENTS: ContactSegment[] = ['All', 'VIP', 'New Customer', 'Repeat', 'Inactive']
export const CONTACT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export const useContactsController = () => {
  const listContacts = useCallback(async (params: {
    page: number
    limit: number
    search?: string
    tag?: string
    opted_in?: 'true' | 'false'
  }): Promise<Result<ContactsListData>> => {
    try {
      const data = await contactsService.getAll(params)
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getContactsApiErrorMessage(error, 'Failed to load contacts'))
      return { ok: false }
    }
  }, [])

  const createContact = useCallback(async (payload: {
    name: string
    phone: string
    tags: string[]
  }): Promise<Result<ContactItem>> => {
    try {
      const data = await contactsService.create(payload)
      toast.success(data.message || 'Contact added successfully')
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getContactsApiErrorMessage(error, 'Failed to add contact'))
      return { ok: false }
    }
  }, [])

  const deleteContact = useCallback(async (id: string): Promise<Result<{ deleted: number }>> => {
    try {
      const data = await contactsService.delete(id)
      toast.success(data.message || 'Contact removed')
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getContactsApiErrorMessage(error, 'Failed to remove contact'))
      return { ok: false }
    }
  }, [])

  const bulkDeleteContacts = useCallback(async (ids: string[]): Promise<Result<{ deleted: number }>> => {
    try {
      const data = await contactsService.bulkDelete(ids)
      toast.success(data.message || `${ids.length} contacts removed`)
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getContactsApiErrorMessage(error, 'Failed to remove contacts'))
      return { ok: false }
    }
  }, [])

  return {
    listContacts,
    createContact,
    deleteContact,
    bulkDeleteContacts,
  }
}

export const useContactsPageController = () => {
  const { listContacts, createContact, deleteContact, bulkDeleteContacts } = useContactsController()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState<ContactSegment>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [optedFilter, setOptedFilter] = useState<OptedFilter>('all')

  const loadContacts = useCallback(async () => {
    setLoading(true)
    const result = await listContacts({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      tag: segment === 'All' ? undefined : segment,
      opted_in: optedFilter === 'all' ? undefined : optedFilter === 'opted_in' ? 'true' : 'false',
    })
    if (result.ok) {
      setContacts(
        result.data.items.map((item) => ({
          ...item,
          added: formatDate(item.createdAt),
        }))
      )
      setTotal(result.data.total)
      setTotalPages(result.data.totalPages)
      setSelectedIds((prev) => prev.filter((id) => result.data.items.some((item) => item.id === id)))
    }
    setLoading(false)
  }, [listContacts, optedFilter, page, pageSize, search, segment])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadContacts()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadContacts])

  const handleAdd = useCallback(async (data: { name: string; phone: string; tags: string[] }): Promise<boolean> => {
    const result = await createContact(data)
    if (!result.ok) return false
    if (page !== 1) {
      setPage(1)
    } else {
      await loadContacts()
    }
    return true
  }, [createContact, loadContacts, page])

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteContact(id)
    if (result.ok) {
      await loadContacts()
    }
  }, [deleteContact, loadContacts])

  const handleBulkDelete = useCallback(async () => {
    const ids = [...selectedIds]
    if (!ids.length) return
    const result = await bulkDeleteContacts(ids)
    if (result.ok) {
      setSelectedIds([])
      await loadContacts()
    }
  }, [bulkDeleteContacts, loadContacts, selectedIds])

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedIds(checked ? contacts.map((c) => c.id) : [])
  }, [contacts])

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }, [])

  const setSearchFilter = useCallback((value: string) => {
    setPage(1)
    setSearch(value)
  }, [])

  const setSegmentFilter = useCallback((value: ContactSegment) => {
    setPage(1)
    setSegment(value)
  }, [])

  const setOptedFilterValue = useCallback((value: OptedFilter) => {
    setPage(1)
    setOptedFilter(value)
  }, [])

  const setPageSizeValue = useCallback((value: number) => {
    setPage(1)
    setPageSize(value)
  }, [])

  return {
    contacts,
    total,
    totalPages,
    page,
    pageSize,
    loading,
    search,
    segment,
    selectedIds,
    addOpen,
    importOpen,
    optedFilter,
    setPage,
    setAddOpen,
    setImportOpen,
    setSearchFilter,
    setSegmentFilter,
    setOptedFilterValue,
    setPageSizeValue,
    handleAdd,
    handleDelete,
    handleBulkDelete,
    handleSelectAll,
    handleSelectRow,
  }
}
