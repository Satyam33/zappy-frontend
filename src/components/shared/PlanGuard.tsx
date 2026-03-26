import React from 'react'
import { Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppDispatch } from '../../store/hooks'
import { openModal } from '../../store/slices/uiSlice'

interface PlanGuardProps {
  feature: string
  limit: number | null
  current: number
  children: React.ReactNode
}

export const PlanGuard = ({ feature, limit, current, children }: PlanGuardProps) => {
  const dispatch = useAppDispatch()

  if (limit !== null && current >= limit) {
    return (
      <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 flex items-center gap-3">
        <Zap size={16} className="text-violet-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-violet-700 font-medium">
            {feature} limit reached ({current}/{limit})
          </p>
          <p className="text-[11.5px] text-violet-500 mt-0.5">Upgrade your plan to continue</p>
        </div>
        <Button
          variant="accent"
          size="sm"
          onClick={() => dispatch(openModal('upgradePlanModal'))}
        >
          Upgrade →
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
