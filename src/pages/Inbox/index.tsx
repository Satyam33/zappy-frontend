import { useState, useMemo, useEffect } from 'react'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { EmptyState } from '../../components/shared/EmptyState'
import { useInboxPageController } from '../../controllers/inbox.controller'

type FilterTab = 'All' | 'Unread' | 'Open' | 'Resolved'

export default function Inbox() {
  const {
    conversations,
    activeId,
    activeConversation,
    activeMessages,
    loadingList,
    loadingMessages,
    selectConversation,
    sendMessage,
    resolveConversation,
    setActiveId,
  } = useInboxPageController()

  const [tab, setTab] = useState<FilterTab>('All')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  const filtered = useMemo(() => {
    switch (tab) {
      case 'Unread':
        return conversations.filter((c) => c.unreadCount > 0)
      case 'Open':
        return conversations.filter((c) => c.status === 'open')
      case 'Resolved':
        return conversations.filter((c) => c.status === 'resolved')
      default:
        return conversations
    }
  }, [conversations, tab])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const active = activeConversation

  return (
    <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[290px_1fr] overflow-hidden bg-white border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-[calc(100vh-148px)]">
      {(!isMobile || !activeId) && (
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={(id) => {
            void selectConversation(id)
          }}
          tab={tab}
          onTab={setTab}
          loading={loadingList}
        />
      )}

      <div className={`relative overflow-hidden ${isMobile && !activeId ? 'hidden' : ''}`}>
        {active ? (
          <ChatWindow
            conversation={active}
            messages={activeMessages}
            messagesLoading={loadingMessages}
            onSend={(content) => {
              void sendMessage(content)
            }}
            onResolve={() => {
              void resolveConversation()
            }}
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
