import { useState, useRef, useEffect } from 'react'
import { Send, UserCheck, CheckCheck, ArrowLeft } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Conversation, Message } from '../../types/inbox.types'
import { formatRelative } from '../../utils/formatters'
import toast from 'react-hot-toast'

interface Props {
  conversation: Conversation
  messages: Message[]
  onSend: (content: string) => void
  onResolve: () => void
  onBack?: () => void
}

export const ChatWindow = ({ conversation, messages, onSend, onResolve, onBack }: Props) => {
  const [input, setInput] = useState('')
  const [showStopModal, setShowStopModal] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    if (input.trim().toUpperCase() === 'STOP') {
      setShowStopModal(true)
      return
    }
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        {onBack && (
          <button onClick={onBack} className="md:hidden w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500">
            <ArrowLeft size={14} />
          </button>
        )}
        <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {conversation.contactName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900">{conversation.contactName}</p>
          <p className="text-[11.5px] text-gray-400">{conversation.contactPhone}</p>
        </div>
        {conversation.contactTag && (
          <Badge variant="gray">{conversation.contactTag}</Badge>
        )}
        <Badge variant={conversation.status === 'open' ? 'blue' : 'green'} dot={conversation.status === 'open'}>
          {conversation.status === 'open' ? 'Open' : 'Resolved'}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          icon={<UserCheck size={13} />}
          onClick={() => toast.success('Conversation assigned')}
        >
          Assign
        </Button>
        {conversation.status === 'open' && (
          <Button variant="ghost" size="sm" onClick={onResolve}>Resolve</Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.direction === 'outbound' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[68%] px-3.5 py-2.5 text-[13.5px] leading-relaxed
              ${msg.direction === 'inbound'
                ? 'bg-gray-50 border border-gray-100 text-gray-900 rounded-[3px_12px_12px_12px]'
                : 'bg-green-600 text-white font-medium rounded-[12px_3px_12px_12px]'}`}
            >
              {msg.content}
            </div>
            <div className={`flex items-center gap-1 mt-1 ${msg.direction === 'outbound' ? 'justify-end' : ''}`}>
              <span className="text-[10.5px] text-gray-400">{formatRelative(msg.createdAt)}</span>
              {msg.direction === 'outbound' && (
                <CheckCheck size={12} className={msg.status === 'read' ? 'text-blue-500' : 'text-gray-300'} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2.5">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13.5px] text-gray-900
            outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="w-[38px] h-[38px] bg-green-600 rounded-full flex items-center justify-center flex-shrink-0
            shadow-[0_2px_8px_rgba(26,173,82,0.3)] hover:bg-green-700 hover:scale-105 transition-all cursor-pointer border-none"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>

      {/* STOP warning modal */}
      {showStopModal && (
        <div className="absolute inset-0 bg-black/45 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h3 className="font-[Syne,sans-serif] text-[16px] font-bold text-gray-900 mb-2">Opt-out Warning</h3>
            <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
              Sending "STOP" will opt this contact out of all future messages. This action cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowStopModal(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => {
                onSend('STOP')
                setInput('')
                setShowStopModal(false)
                toast.success('Contact opted out')
              }}>
                Send STOP
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
