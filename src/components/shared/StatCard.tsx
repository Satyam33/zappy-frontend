import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import React from 'react'

type CardColor = 'green' | 'blue' | 'amber' | 'accent'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: CardColor
  loading?: boolean
}

const colorCircle: Record<CardColor, string> = {
  green:  'bg-green-600',
  blue:   'bg-blue-600',
  amber:  'bg-amber-500',
  accent: 'bg-violet-600',
}

const iconBg: Record<CardColor, string> = {
  green:  'bg-green-50 text-green-600',
  blue:   'bg-blue-50 text-blue-600',
  amber:  'bg-amber-50 text-amber-600',
  accent: 'bg-violet-50 text-violet-600',
}

export const StatCard = ({ label, value, change, changeLabel, icon, color = 'green', loading }: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="skeleton skeleton-text w-28 mb-3" />
        <div className="skeleton skeleton-title w-20 mb-2" />
        <div className="skeleton skeleton-text w-24" />
      </div>
    )
  }

  return (
    <div
      className="bg-white border border-gray-100 rounded-xl p-[18px_20px] relative overflow-hidden
        transition-all hover:border-gray-200 hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      {/* Decorative circle */}
      <div
        className={`absolute -top-2.5 -right-2.5 w-20 h-20 rounded-full opacity-10 pointer-events-none ${colorCircle[color]}`}
      />

      <div className="flex items-start justify-between mb-2">
        <p className="text-[11.5px] text-gray-500 uppercase tracking-[0.6px] font-medium">{label}</p>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg[color]}`}>
            {icon}
          </div>
        )}
      </div>

      <p className="font-[Syne,sans-serif] text-[26px] font-bold text-gray-900 leading-none mb-1.5">
        {value}
      </p>

      {change !== undefined && (
        <div className={`text-[11.5px] flex items-center gap-1 mt-1.5
          ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-500' : 'text-gray-400'}`}
        >
          {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{change > 0 ? '+' : ''}{change}{typeof change === 'number' && !changeLabel?.includes('%') ? '%' : ''}</span>
          {changeLabel && <span className="text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
