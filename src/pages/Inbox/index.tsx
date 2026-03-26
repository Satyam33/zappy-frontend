import { useState, useMemo } from 'react'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { EmptyState } from '../../components/shared/EmptyState'
import { mockConversations, mockMessages } from '../../utils/mockData'
import type { Conversation, Message } from '../../types/inbox.types'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

type FilterTab = 'All' | 'Unread' | 'Open' | 'Resolved'

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [activeId, setActiveId] = useState<string | null>(mockConversations[0]?.id ?? null)
  const [tab, setTab] = useState<FilterTab>('All')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  const filtered = useMemo(() => {
    switch (tab) {
      case 'Unread':   return conversations.filter(c => c.unreadCount > 0)
      case 'Open':     return conversations.filter(c => c.status === 'open')
      case 'Resolved': return conversations.filter(c => c.status === 'resolved')
      default:         return conversations
    }
  }, [conversations, tab])

  const active = conversations.find(c => c.id === activeId)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const activeMessages = activeId ? (messages[activeId] ?? []) : []

  const handleSend = (content: string) => {
    if (!activeId) return
    const msg: Message = {
      id: Date.now().toString(),
      conversationId: activeId,
      content,
      direction: 'outbound',
      status: 'sent',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }))
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() } : c
    ))
  }

  const handleResolve = () => {
    if (!activeId) return
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, status: 'resolved' as const } : c
    ))
    toast.success('Conversation resolved')
  }

  return (
    <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[290px_1fr] overflow-hidden bg-white border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-[calc(100vh-148px)]">
      {(!isMobile || !activeId) && (
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={id => {
            setActiveId(id)
            setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c))
          }}
          tab={tab}
          onTab={setTab}
        />
      )}

      <div className={`relative overflow-hidden ${isMobile && !activeId ? 'hidden' : ''}`}>
        {active ? (
          <ChatWindow
            conversation={active}
            messages={activeMessages}
            onSend={handleSend}
            onResolve={handleResolve}
            onBack={isMobile ? () => setActiveId(null) : undefined}
          />
        ) : (
          <EmptyState
            icon={<span>💬</span>}
            title="No conversation selected"
            subtitle="Pick a conversation from the list to start chatting."
          />
        )}
      </div>
    </div>
  )
}
