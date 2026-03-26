import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Chip } from '../../components/ui/Chip'
import { StatCard } from '../../components/shared/StatCard'
import { Table } from '../../components/ui/Table'
import { mockAnalytics } from '../../utils/mockData'
import { TIME_RANGES } from '../../utils/constants'
import { MessageSquare, TrendingUp, Reply } from 'lucide-react'

export default function Analytics() {
  const [range, setRange] = useState('30d')
  const data = mockAnalytics

  return (
    <div className="space-y-5">
      {/* Range filter */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {TIME_RANGES.map(r => (
          <Chip key={r.value} active={range === r.value} onClick={() => setRange(r.value)}>
            {r.label}
          </Chip>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Total Sent"     value={data.summary.sent.toLocaleString()}      color="blue"   icon={<MessageSquare size={15} />} />
        <StatCard label="Delivered"      value={data.summary.delivered.toLocaleString()} color="green"  icon={<TrendingUp size={15} />} />
        <StatCard label="Read"           value={data.summary.read.toLocaleString()}       color="amber"  icon={<TrendingUp size={15} />} />
        <StatCard label="Replies"        value={data.summary.replied.toLocaleString()}    color="accent" icon={<Reply size={15} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact growth */}
        <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 mb-4">
            Contact Growth (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.contactGrowth} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ba3b2', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ba3b2', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.07)', fontSize: 12, fontFamily: 'DM Sans' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="contacts" fill="#2563eb" radius={[4, 4, 0, 0]} name="Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel breakdown */}
        <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 mb-4">
            Message Funnel Breakdown
          </h3>
          <div className="grid grid-cols-5 gap-1 sm:gap-2 h-[140px] items-end">
            {[
              { label: 'Sent',      value: data.summary.sent,      color: '#2563eb' },
              { label: 'Delivered', value: data.summary.delivered,  color: '#1aad52' },
              { label: 'Read',      value: data.summary.read,       color: '#d97706' },
              { label: 'Replied',   value: data.summary.replied,    color: '#5b4ef8' },
              { label: 'Failed',    value: data.summary.sent - data.summary.delivered, color: '#dc2626' },
            ].map(col => {
              const pct = (col.value / data.summary.sent) * 100
              return (
                <div key={col.label} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-[Syne,sans-serif] font-semibold text-gray-900">{Math.round(pct)}%</span>
                  <div className="w-full rounded-t-sm" style={{ height: `${Math.max(pct * 1.2, 8)}px`, background: col.color, opacity: 0.85 }} />
                  <span className="text-[10.5px] text-gray-400 text-center">{col.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top campaigns */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900">Top Performing Campaigns</h3>
        </div>
        <Table
          columns={[
            { key: 'name',      header: 'Campaign',   render: r => <span className="td-primary">{r.name}</span> },
            { key: 'sent',      header: 'Sent',       render: r => r.sent.toLocaleString() },
            { key: 'readRate',  header: 'Read %',     render: r => `${r.readRate}%` },
            { key: 'replyRate', header: 'Reply %',    render: r => `${r.replyRate}%` },
          ]}
          data={data.topCampaigns}
          emptyText="No campaign data yet"
        />
      </div>
    </div>
  )
}
