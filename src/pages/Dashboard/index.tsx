import { Users, MessageSquare, TrendingUp, Megaphone, Wifi } from 'lucide-react'
import { StatCard } from '../../components/shared/StatCard'
import { OnboardBanner } from '../../components/shared/OnboardBanner'
import { DeliveryChart } from './DeliveryChart'
import { DailyBarChart } from './DailyBarChart'
import { RecentCampaigns } from './RecentCampaigns'
import { Badge } from '../../components/ui/Badge'
import { mockDashboardStats, mockCampaigns } from '../../utils/mockData'

const ONBOARD_STEPS = [
  { key: 'wapi',     label: 'Connect WhatsApp API',   done: mockDashboardStats.onboardingSteps.wapiConnected, to: '/settings' },
  { key: 'template', label: 'Create first template',   done: mockDashboardStats.onboardingSteps.firstTemplate,  to: '/templates' },
  { key: 'contact',  label: 'Add first contact',        done: mockDashboardStats.onboardingSteps.firstContact,   to: '/contacts' },
  { key: 'campaign', label: 'Run first campaign',        done: mockDashboardStats.onboardingSteps.firstCampaign,  to: '/campaigns' },
]

const qualityColor: Record<string, 'green' | 'amber' | 'red'> = {
  green: 'green', yellow: 'amber', red: 'red',
}

export default function Dashboard() {
  const stats = mockDashboardStats
  const recent = mockCampaigns.slice(0, 4)

  return (
    <div className="space-y-4">
      {/* Onboarding */}
      <OnboardBanner steps={ONBOARD_STEPS} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Total Contacts"  value={stats.totalContacts.toLocaleString()}  change={stats.contactsChange}  color="green"  icon={<Users size={15} />} />
        <StatCard label="Messages Sent"   value={stats.messagesSent.toLocaleString()}   change={stats.messagesChange}  color="blue"   icon={<MessageSquare size={15} />} />
        <StatCard label="Avg Read Rate"   value={`${stats.avgReadRate}%`}                change={stats.readRateChange}   color="amber"  icon={<TrendingUp size={15} />} />
        <StatCard label="Campaigns Run"   value={stats.campaignsRun}                     change={stats.campaignsChange} changeLabel=" this month" color="accent" icon={<Megaphone size={15} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DeliveryChart funnel={stats.deliveryFunnel} />
        <DailyBarChart data={stats.dailyMessages} />
      </div>

      {/* Recent campaigns + Quality indicator */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-4">
        <RecentCampaigns campaigns={recent} />

        {/* WhatsApp quality */}
        <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900">
            WhatsApp Quality
          </h3>

          <div className="flex items-center gap-3">
            <Wifi size={22} className={stats.qualityRating === 'green' ? 'text-green-600' : stats.qualityRating === 'yellow' ? 'text-amber-500' : 'text-red-500'} />
            <div>
              <p className="text-[13px] font-semibold text-gray-900 capitalize">{stats.qualityRating} Quality</p>
              <p className="text-[11.5px] text-gray-400">Phone number health</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] text-gray-500">Quality rating</span>
              <Badge variant={qualityColor[stats.qualityRating]} dot>
                {stats.qualityRating === 'green' ? 'High' : stats.qualityRating === 'yellow' ? 'Medium' : 'Low'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] text-gray-500">Messaging tier</span>
              <Badge variant="blue">{stats.tier}</Badge>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-[11.5px] text-green-700 leading-relaxed">
              Your number is in good standing. Maintain quality by sending relevant messages only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
