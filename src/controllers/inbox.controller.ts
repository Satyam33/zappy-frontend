import { useCallback, useEffect, useMemo, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { useAppSelector } from '@/store/hooks'
import { getSocketBaseUrl } from '@/lib/getSocketBaseUrl'
import { inboxService, getInboxApiErrorMessage } from '@/services/inbox.service'
import type { Conversation, Message } from '@/types/inbox.types'

type InboxSocketPayload = {
  type?: string
  event?: string
  conversation?: Conversation
  message?: Message
}

export const useInboxPageController = () => {
  const orgId = useAppSelector((s) => s.auth.org?.id)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messagesByConv, setMessagesByConv] = useState<Record<string, Message[]>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const loadConversations = useCallback(async () => {
    if (!orgId) return
    setLoadingList(true)
    try {
      const data = await inboxService.getConversations({ page: 1, limit: 100, status: 'all' })
      setConversations(data.items)
      setActiveId((prev) => prev ?? (data.items[0]?.id ?? null))
    } catch (e: unknown) {
      toast.error(getInboxApiErrorMessage(e, 'Failed to load inbox'))
    } finally {
      setLoadingList(false)
    }
  }, [orgId])

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!orgId) return
      setLoadingMessages(true)
      try {
        const data = await inboxService.getMessages(conversationId, { page: 1, limit: 100 })
        setMessagesByConv((prev) => ({ ...prev, [conversationId]: data.items }))
      } catch (e: unknown) {
        toast.error(getInboxApiErrorMessage(e, 'Failed to load messages'))
      } finally {
        setLoadingMessages(false)
      }
    },
    [orgId]
  )

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadConversations()
    }, 0)
    return () => window.clearTimeout(t)
  }, [loadConversations])

  useEffect(() => {
    if (!activeId) return
    const t = window.setTimeout(() => {
      void loadMessages(activeId)
    }, 0)
    return () => window.clearTimeout(t)
  }, [activeId, loadMessages])

  useEffect(() => {
    if (!orgId) {
      setSocket(null)
      return
    }
    const url = getSocketBaseUrl()
    
    const s = io(url, {
      auth: { orgId },
      transports: ['websocket', 'polling'],
    })
    s.on('connect_error', () => {
      toast.error('Live inbox connection failed — check CORS / server URL')
    })
    s.on('org:event', (raw: unknown) => {
      const payload = raw as InboxSocketPayload
      if (payload?.type !== 'INBOX_EVENT') return
      if (payload.event === 'message' && payload.conversation && payload.message) {
        const conv = payload.conversation
        const msg = payload.message
        setConversations((prev) => {
          const rest = prev.filter((c) => c.id !== conv.id)
          return [conv, ...rest].sort(
            (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
          )
        })
        setMessagesByConv((prev) => {
          const list = prev[msg.conversationId] ?? []
          if (list.some((m) => m.id === msg.id)) return prev
          return { ...prev, [msg.conversationId]: [...list, msg] }
        })
      }
      if (payload.event === 'conversation_updated' && payload.conversation) {
        const conv = payload.conversation
        setConversations((prev) => prev.map((c) => (c.id === conv.id ? conv : c)))
      }
    })
    setSocket(s)
    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [orgId])

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveId(id)
      try {
        const updated = await inboxService.patchConversation(id, { markRead: true })
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...updated, unreadCount: 0 } : c)))
      } catch {
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)))
      }
    },
    []
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeId) return
      try {
        const res = await inboxService.sendMessage(activeId, text)
        if (res.message) {
          setMessagesByConv((prev) => ({
            ...prev,
            [activeId]: [...(prev[activeId] ?? []), res.message!],
          }))
        }
        void loadConversations()
      } catch (e: unknown) {
        toast.error(getInboxApiErrorMessage(e, 'Failed to send message'))
      }
    },
    [activeId, loadConversations]
  )

  const resolveConversation = useCallback(async () => {
    if (!activeId) return
    try {
      await inboxService.patchConversation(activeId, { status: 'resolved' })
      setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, status: 'resolved' } : c)))
      toast.success('Conversation resolved')
    } catch (e: unknown) {
      toast.error(getInboxApiErrorMessage(e, 'Failed to update conversation'))
    }
  }, [activeId])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  )

  const activeMessages = useMemo(() => {
    const list = activeId ? messagesByConv[activeId] ?? [] : []
    return [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [activeId, messagesByConv])

  return {
    conversations,
    activeId,
    activeConversation,
    activeMessages,
    loadingList,
    loadingMessages,
    connected: Boolean(socket?.connected),
    selectConversation,
    sendMessage,
    resolveConversation,
    setActiveId,
    refreshConversations: loadConversations,
  }
}
