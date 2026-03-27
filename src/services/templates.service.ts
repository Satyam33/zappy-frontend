import api from './api'
import type { AxiosError } from 'axios'
import type { Template, TemplateStatus, TemplateSource, InteractiveMode } from '@/types/template.types'

type ApiSuccessResponse<T> = { success: true; code: number; message: string; data: T }
type ApiErrorResponse = { success: false; code: number; message: string }

const unwrap = <T>(response: ApiSuccessResponse<T>) => ({ ...response.data, message: response.message })
export const getTemplatesApiErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<ApiErrorResponse>
  return err?.response?.data?.message || fallback
}

type ListTemplatesResponse = {
  items: Template[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const templatesService = {
  getAll: (params?: { page?: number; limit?: number; status?: TemplateStatus; source?: TemplateSource; search?: string }) =>
    api.get<ApiSuccessResponse<ListTemplatesResponse>>('/templates', { params }).then(r => unwrap(r.data)),

  create: (data: {
    name: string
    category: string
    language: string
    templateType: string
    body: string
    sampleValues: Record<string, string>
    interactiveMode: InteractiveMode
    interactiveActions: Array<{ type: string; title: string; value?: string }>
    submitAs: 'draft' | 'pending'
  }) => api.post<ApiSuccessResponse<Template>>('/templates', data).then(r => unwrap(r.data)),

  update: (id: string, data: Partial<{
    name: string
    category: string
    language: string
    templateType: string
    body: string
    sampleValues: Record<string, string>
    interactiveMode: InteractiveMode
    interactiveActions: Array<{ type: string; title: string; value?: string }>
    submitAs: 'draft' | 'pending'
  }>) => api.put<ApiSuccessResponse<Template>>(`/templates/${id}`, data).then(r => unwrap(r.data)),

  syncStatus: (templateId?: string) =>
    api.post<ApiSuccessResponse<{ updated: number }>>('/templates/sync-status', templateId ? { templateId } : {}).then(r => unwrap(r.data)),
}
