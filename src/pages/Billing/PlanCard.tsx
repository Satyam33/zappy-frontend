import { Check } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { formatCurrency } from '../../utils/formatters'
import { PLANS } from '../../utils/constants'
import toast from 'react-hot-toast'

type PlanKey = 'starter' | 'growth' | 'pro'

const FEATURES: Record<PlanKey, string[]> = {
  starter: ['1,000 contacts', '5,000 messages/mo', '500 conversations', '1 team member', 'Basic analytics'],
  growth:  ['5,000 contacts', '25,000 messages/mo', '2,500 conversations', '5 team members', 'Advanced analytics', 'Priority support'],
  pro:     ['Unlimited contacts', 'Unlimited messages', 'Unlimited conversations', 'Unlimited team members', 'Full analytics', '24/7 support', 'Custom webhooks'],
}

interface Props {
  planKey: PlanKey
  current: boolean
}

export const PlanCard = ({ planKey, current }: Props) => {
  const plan = PLANS[planKey]

  return (
    <div className={`bg-white border-2 rounded-xl p-[18px_20px] transition-all
      ${current ? 'border-green-400 shadow-[0_4px_12px_rgba(26,173,82,0.12)]' : 'border-gray-100 hover:border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]'}
      ${planKey === 'pro' ? 'relative overflow-hidden' : ''}`}
    >
      {planKey === 'pro' && (
        <div className="absolute top-3 right-3 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
          POPULAR
        </div>
      )}
      {current && (
        <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
          CURRENT
        </div>
      )}

      <p className="font-[Syne,sans-serif] text-[15px] font-bold text-gray-900 capitalize mb-1">{plan.name}</p>
      <p className="font-[Syne,sans-serif] text-[28px] font-extrabold text-gray-900 leading-none mb-4">
        {formatCurrency(plan.price)}
        <span className="text-[13px] text-gray-400 font-normal ml-1">/mo</span>
      </p>

      <ul className="space-y-2 mb-5">
        {FEATURES[planKey].map(f => (
          <li key={f} className="flex items-center gap-2 text-[13px] text-gray-600">
            <Check size={14} className="text-green-600 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {current ? (
        <Button variant="ghost" size="sm" disabled className="w-full justify-center">Current Plan</Button>
      ) : (
        <Button
          variant={planKey === 'pro' ? 'accent' : 'primary'}
          size="sm"
          className="w-full justify-center"
          onClick={() => toast.success(`Upgrading to ${plan.name}...`)}
        >
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  )
}
