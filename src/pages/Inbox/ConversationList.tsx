import { Chip } from '../../components/ui/Chip'
import type { Conversation } from '../../types/inbox.types'
import { formatRelative } from '../../utils/formatters'

type FilterTab = 'All' | 'Unread' | 'Open' | 'Resolved'
const TABS: FilterTab[] = ['All', 'Unread', 'Open', 'Resolved']

interface Props {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  tab: FilterTab
  onTab: (t: FilterTab) => void
}

export const ConversationList = ({ conversations, activeId, onSelect, tab, onTab }: Props) => (
  <div className="flex flex-col bg-white border-r border-gray-100 h-full overflow-hidden">
    {/* Tabs */}
    <div className="flex gap-1.5 px-3 py-3 border-b border-gray-100 flex-wrap">
      {TABS.map(t => (
        <Chip key={t} active={tab === t} onClick={() => onTab(t)}>{t}</Chip>
      ))}
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-[13px] text-gray-400">No conversations</p>
        </div>
      ) : (
        conversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3.5 py-3 border-b border-gray-100 transition-colors cursor-pointer relative
              ${activeId === conv.id ? 'bg-green-50/60' : 'hover:bg-gray-50'}
              ${conv.unreadCount > 0 ? '' : ''}`}
          >
            {conv.unreadCount > 0 && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-green-600 rounded-r" />
            )}

            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {conv.contactName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{conv.contactName}</p>
                  <span className="text-[10.5px] text-gray-400 flex-shrink-0 ml-1">
                    {formatRelative(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  </div>
)
