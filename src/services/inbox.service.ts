import api from './api'
import type { AxiosError } from 'axios'
import type { Conversation, Message } from '@/types/inbox.types'

type ApiSuccessResponse<T> = { success: true; code: number; message: string; data: T }
type ApiErrorResponse = { success: false; code: number; message: string }

const unwrap = <T extends object>(response: ApiSuccessResponse<T>) => ({
  ...response.data,
  message: response.message,
})

export const getInboxApiErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<ApiErrorResponse>
  return err?.response?.data?.message || fallback
}

type ListConversationsData = {
  items: Conversation[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type ListMessagesData = {
  items: Message[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const inboxService = {
  getConversations: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: 'all' | 'open' | 'resolved'
  }) =>
    api
      .get<ApiSuccessResponse<ListConversationsData>>('/conversations', { params })
      .then((r) => unwrap(r.data)),

  getMessages: (
    conversationId: string,
    params?: { page?: number; limit?: number }
  ) =>
    api
      .get<ApiSuccessResponse<ListMessagesData>>(`/conversations/${conversationId}/messages`, { params })
      .then((r) => unwrap(r.data)),

  sendMessage: (conversationId: string, text: string) =>
    api
      .post<ApiSuccessResponse<{ ok: boolean; message?: Message }>>(`/conversations/${conversationId}/messages`, {
        text,
      })
      .then((r) => unwrap(r.data)),

  patchConversation: (
    conversationId: string,
    body: { status?: 'open' | 'resolved'; markRead?: boolean }
  ) =>
    api
      .patch<ApiSuccessResponse<Conversation>>(`/conversations/${conversationId}`, body)
      .then((r) => unwrap(r.data)),
}
