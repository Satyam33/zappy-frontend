import api from './api'
import type { AxiosError } from 'axios'
import type { Campaign, CampaignAudience, CampaignsMeta } from '@/types/campaign.types'

type ApiSuccessResponse<T> = { success: true; code: number; message: string; data: T }
type ApiErrorResponse = { success: false; code: number; message: string }
const unwrapObject = <T extends object>(response: ApiSuccessResponse<T>) => ({ ...response.data, message: response.message })
export const getCampaignsApiErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<ApiErrorResponse>
  return err?.response?.data?.message || fallback
}

type ListCampaignsResponse = {
  items: Campaign[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const campaignsService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiSuccessResponse<ListCampaignsResponse>>('/campaigns', { params }).then(r => unwrapObject(r.data)),

  getMeta: () =>
    api.get<ApiSuccessResponse<CampaignsMeta>>('/campaigns/meta').then(r => unwrapObject(r.data)),

  previewAudience: (audience: CampaignAudience) =>
    api.post<ApiSuccessResponse<{ selectedAudience: number; finalAudience: number }>>('/campaigns/preview-audience', { audience }).then(r => unwrapObject(r.data)),

  create: (data: {
    name: string
    templateId: string
    audience: CampaignAudience
    parameterMapping: Record<string, string>
    scheduleNow?: boolean
    scheduledAt?: string
  }) =>
    api.post<ApiSuccessResponse<Campaign>>('/campaigns', data).then(r => unwrapObject(r.data)),
}
