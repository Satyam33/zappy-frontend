export type ConversationStatus = 'open' | 'resolved'

export interface Conversation {
  id: string
  contactId: string
  contactName: string
  contactPhone: string
  contactTag?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  status: ConversationStatus
  assignedTo?: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  direction: 'inbound' | 'outbound'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  createdAt: string
}
