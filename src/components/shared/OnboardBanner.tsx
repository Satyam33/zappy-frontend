import { CheckCircle2, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface OnboardStep {
  key: string
  label: string
  done: boolean
  to: string
}

interface OnboardBannerProps {
  steps: OnboardStep[]
  onDismiss?: () => void
}

export const OnboardBanner = ({ steps, onDismiss }: OnboardBannerProps) => {
  const navigate = useNavigate()
  const completed = steps.filter(s => s.done).length
  const total     = steps.length

  if (completed === total) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900">
            Get started with Zappy
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{completed}/{total} steps completed</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-[11.5px] text-gray-400 hover:text-gray-600 cursor-pointer">
            Dismiss
          </button>
        )}
      </div>

      {/* Progress track */}
      <div className="h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-green-600 rounded-full transition-all"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map(step => (
          <button
            key={step.key}
            onClick={() => !step.done && navigate(step.to)}
            className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors cursor-pointer
              ${step.done
                ? 'bg-green-50 border border-green-100'
                : 'bg-gray-50 border border-gray-100 hover:border-gray-200'}`}
          >
            {step.done
              ? <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
              : <Circle size={15} className="text-gray-300 flex-shrink-0" />}
            <span className={`text-[12px] font-medium leading-tight ${step.done ? 'text-green-700' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
