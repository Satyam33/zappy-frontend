import { X } from 'lucide-react'
import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
  fullWidthOnMobile?: boolean
  centerOnMobile?: boolean
}

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'w-[520px]',
  fullWidthOnMobile = true,
  centerOnMobile = false,
}: ModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 bg-black/45 z-200 flex ${centerOnMobile ? 'items-center' : 'items-end sm:items-center'} justify-center backdrop-blur-xs`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white border border-gray-200 rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 ${width} ${fullWidthOnMobile ? 'w-full sm:max-w-[95vw]' : 'w-[92vw] sm:max-w-[95vw]'} max-h-[90vh]
          overflow-y-auto relative shadow-[0_8px_24px_rgba(0,0,0,0.10)]`}
        style={{ animation: 'modalIn 0.2s ease' }}
      >
        {!centerOnMobile && <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 bg-gray-50 border border-gray-200 rounded-md
            flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>

        <h2 className="font-[Syne,sans-serif] text-[18px] font-bold text-gray-900 mb-1">{title}</h2>
        {subtitle && <p className="text-[13px] text-gray-500 mb-5 leading-snug">{subtitle}</p>}

        <div className={subtitle ? '' : 'mt-5'}>{children}</div>

        {footer && (
          <div className="flex gap-2.5 justify-end mt-5 pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
