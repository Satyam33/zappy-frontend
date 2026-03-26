import React from 'react'
import { Button } from '../ui/Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void; icon?: React.ReactNode }
}

export const EmptyState = ({ icon, title, subtitle, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-[14px] flex items-center justify-center mb-3.5 text-[22px]">
      {icon ?? '📭'}
    </div>
    <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900 mb-1.5">{title}</h3>
    {subtitle && <p className="text-[13px] text-gray-500 max-w-[260px] leading-relaxed mb-4">{subtitle}</p>}
    {action && (
      <Button onClick={action.onClick} size="sm" icon={action.icon}>
        {action.label}
      </Button>
    )}
  </div>
)
