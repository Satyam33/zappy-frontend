import React from 'react'

interface ChipProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export const Chip = ({ active, onClick, children, className = '' }: ChipProps) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none
      ${active
        ? 'bg-green-50/60 border-green-200 text-green-600 font-semibold'
        : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-900'
      } ${className}`}
  >
    {children}
  </button>
)
