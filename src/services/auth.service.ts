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

type LoginData = {
  ok: boolean
  accessToken: string
  refreshToken: string
  user: { id: string; email: string; name: string | null; role: 'admin' | 'agent' }
  organization: { id: string; name: string }
}

type RefreshData = {
  ok: boolean
  accessToken: string
  refreshToken: string
}

type SignupData = {
  ok: boolean
  user: { id: string; email: string; name: string | null }
  organization: { id: string; name: string }
  membership: { role: string }
}

type OtpRequestData = {
  ok: boolean
  otpId: string
  expiresAt: string
  otpCode?: string
}

type BasicOkData = { ok: boolean }

const unwrap = <T>(response: ApiSuccessResponse<T>) => ({
  ...response.data,
  message: response.message
})

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse | { error?: { message?: string } }>
  return (
    axiosError?.response?.data &&
    ('message' in axiosError.response.data
      ? axiosError.response.data.message
      : axiosError.response.data.error?.message)
  ) || fallback
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiSuccessResponse<LoginData>>('/auth/login', { email, password }).then(r => unwrap(r.data)),

  requestSignupOtp: (email: string, mobile: string) =>
    api.post<ApiSuccessResponse<OtpRequestData>>('/auth/send-otp', { email, mobile }).then(r => unwrap(r.data)),

  verifySignupOtp: (otpId: string, mobile: string, otpCode: string) =>
    api.post<ApiSuccessResponse<BasicOkData>>('/auth/verify-otp', { otpId, mobile, otpCode }).then(r => unwrap(r.data)),

  signup: (data: { name: string; email: string; mobile: string; password: string; organizationName: string; otpId: string }) =>
    api.post<ApiSuccessResponse<SignupData>>('/auth/signup', data).then(r => unwrap(r.data)),

  forgotPassword: (email: string) =>
    api.post<ApiSuccessResponse<BasicOkData>>('/auth/forgot-password', { email }).then(r => unwrap(r.data)),

  resetPassword: (token: string, password: string) =>
    api.post<ApiSuccessResponse<BasicOkData>>('/auth/reset-password', { token, password }).then(r => unwrap(r.data)),

  refresh: (refreshToken: string) =>
    api.post<ApiSuccessResponse<RefreshData>>('/auth/refresh', { refreshToken }).then(r => unwrap(r.data)),

  logout: (refreshToken: string) =>
    api.post<ApiSuccessResponse<BasicOkData>>('/auth/logout', { refreshToken }).then(r => unwrap(r.data)),
}
