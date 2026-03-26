import React from 'react'

type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'accent' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  green:  'bg-green-50  text-green-800',
  amber:  'bg-amber-50  text-amber-700',
  red:    'bg-red-50    text-red-600',
  blue:   'bg-blue-50   text-blue-700',
  accent: 'bg-violet-50 text-violet-700',
  gray:   'bg-gray-100  text-gray-500',
}

const dotMap: Record<BadgeVariant, string> = {
  green:  'bg-green-600',
  amber:  'bg-amber-500',
  red:    'bg-red-500',
  blue:   'bg-blue-600',
  accent: 'bg-violet-600',
  gray:   'bg-gray-400',
}

export const Badge = ({ variant = 'gray', dot, children, className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${variantMap[variant]} ${className}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[variant]}`} />}
    {children}
  </span>
)
