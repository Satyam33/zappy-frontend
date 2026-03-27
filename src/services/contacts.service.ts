import api from './api'
import type { AxiosError } from 'axios'

type ApiSuccessResponse<T> = {
  success: true
  code: number
  message: string
  data: T
}

type ApiErrorResponse = {
  success: false
  code: number
  message: string
}

export type ContactItem = {
  id: string
  name: string
  phone: string
  tags: string[]
  opted_in: boolean
  createdAt: string
}

export type ContactsListData = {
  items: ContactItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const unwrap = <T>(response: ApiSuccessResponse<T>) => ({
  ...response.data,
  message: response.message,
})

export const getContactsApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError?.response?.data?.message || fallback
}

export const contactsService = {
  getAll: (params?: { tag?: string; search?: string; page?: number; limit?: number }) =>
    api.get<ApiSuccessResponse<ContactsListData>>('/contacts', { params }).then(r => unwrap(r.data)),

  create: (data: { name: string; phone: string; tags?: string[]; opted_in?: boolean }) =>
    api.post<ApiSuccessResponse<ContactItem>>('/contacts', data).then(r => unwrap(r.data)),

  update: (id: string, data: Partial<{ name: string; phone: string; tags: string[]; opted_in: boolean }>) =>
    api.put<ApiSuccessResponse<ContactItem>>(`/contacts/${id}`, data).then(r => unwrap(r.data)),

  delete: (id: string) => api.delete<ApiSuccessResponse<{ deleted: number }>>(`/contacts/${id}`).then(r => unwrap(r.data)),

  bulkDelete: (ids: string[]) =>
    api.post<ApiSuccessResponse<{ deleted: number }>>('/contacts/bulk-delete', { ids }).then(r => unwrap(r.data)),

  importCSV: (formData: FormData) =>
    api.post('/contacts/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
}
