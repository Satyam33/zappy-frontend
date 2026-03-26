import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface DayData { day: string; messages: number }

export const DailyBarChart = ({ data }: { data: DayData[] }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
    <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 mb-4">
      Daily Messages (Last 7 Days)
    </h3>
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ba3b2', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ba3b2', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12, fontFamily: 'DM Sans' }}
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
        />
        <Bar dataKey="messages" fill="#1aad52" radius={[4, 4, 0, 0]} name="Messages" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)
