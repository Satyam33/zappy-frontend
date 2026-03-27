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

export type WhatsAppSettings = {
  phoneNumberId: string
  wabaId: string
  accessToken: string
  qualityRating: string
  messagingLimit: string
}

export type WhatsAppStatus = {
  connected: boolean
  qualityRating: string | null
  messagingLimit: string | null
  displayPhoneNumber: string | null
  verifiedName: string | null
  statusMessage: string
}

export type BusinessProfile = {
  businessName: string
  displayPhone: string
  category: string
  timezone: string
  optOutKeyword: string
}

const unwrap = <T>(response: ApiSuccessResponse<T>) => ({
  ...response.data,
  message: response.message
})

export const getSettingsApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError?.response?.data?.message || fallback
}

export const settingsService = {
  getWhatsAppSettings: () =>
    api.get<ApiSuccessResponse<WhatsAppSettings>>('/settings/whatsapp').then(r => unwrap(r.data)),

  updateWhatsAppSettings: (payload: { phoneNumberId: string; wabaId: string; accessToken: string }) =>
    api.put<ApiSuccessResponse<WhatsAppSettings>>('/settings/whatsapp', payload).then(r => unwrap(r.data)),

  getWhatsAppStatus: () =>
    api.get<ApiSuccessResponse<WhatsAppStatus>>('/settings/whatsapp/status').then(r => unwrap(r.data)),

  getBusinessProfile: () =>
    api.get<ApiSuccessResponse<BusinessProfile>>('/settings/profile').then(r => unwrap(r.data)),

  updateBusinessProfile: (payload: { category: string; timezone: string; optOutKeyword: string }) =>
    api.put<ApiSuccessResponse<BusinessProfile>>('/settings/profile', payload).then(r => unwrap(r.data)),
}
