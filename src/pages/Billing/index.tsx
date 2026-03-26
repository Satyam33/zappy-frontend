import { Calendar, Zap } from 'lucide-react'
import { PlanCard } from './PlanCard'
import { UsageMeters } from './UsageMeters'
import { Button } from '../../components/ui/Button'
import { mockBillingData } from '../../utils/mockData'
import { formatDate } from '../../utils/formatters'

type PlanKey = 'starter' | 'growth' | 'pro'
const PLANS: PlanKey[] = ['starter', 'growth', 'pro']

export default function Billing() {
  const billing = mockBillingData

  const usageItems = [
    { label: 'Contacts',      current: billing.usage.contacts.current,      limit: billing.usage.contacts.limit },
    { label: 'Messages',      current: billing.usage.messages.current,      limit: billing.usage.messages.limit },
    { label: 'Conversations', current: billing.usage.conversations.current, limit: billing.usage.conversations.limit },
  ]

  return (
    <div className="space-y-5">
      {/* Current plan banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-[18px_20px] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-[Syne,sans-serif] text-[15px] font-bold text-gray-900 capitalize">
            {billing.plan} Plan — Active
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={12} className="text-gray-400" />
            <p className="text-[12.5px] text-gray-500">
              Next billing date: <strong>{formatDate(billing.billingDate)}</strong>
            </p>
          </div>
        </div>
        <Button variant="accent" size="sm" icon={<Zap size={12} />} className="w-full sm:w-auto justify-center">
          Upgrade Plan
        </Button>
      </div>

      {/* Usage */}
      <UsageMeters usage={usageItems} />

      {/* Plan cards */}
      <div>
        <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900 mb-3">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PLANS.map(p => (
            <PlanCard key={p} planKey={p} current={billing.plan === p} />
          ))}
        </div>
      </div>
    </div>
  )
}
