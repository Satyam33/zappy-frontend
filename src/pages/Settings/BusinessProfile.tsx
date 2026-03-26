import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

export const BusinessProfile = () => {
  const [form, setForm] = useState({
    name:          'Zappy Demo Store',
    displayPhone:  '+91 98765 43210',
    category:      'E-commerce',
    timezone:      'Asia/Kolkata',
    optOutKeyword: 'STOP',
  })

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-5">
      <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900">Business Profile</h3>

      <div className="space-y-4">
        {([
          ['name',          'Business Name',    'text',   'Your business display name'],
          ['displayPhone',  'Display Phone',    'text',   '+91 format'],
          ['optOutKeyword', 'Opt-out Keyword',  'text',   'e.g. STOP'],
        ] as [string, string, string, string][]).map(([key, label, type, placeholder]) => (
          <div key={key}>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">{label}</label>
            <input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={update(key)}
              placeholder={placeholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={update('category')}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
            >
              {['E-commerce', 'Retail', 'FMCG', 'Fashion', 'Electronics', 'Food & Beverage', 'Other'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Timezone</label>
            <select
              value={form.timezone}
              onChange={update('timezone')}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
            >
              {['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'America/New_York'].map(tz => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <Button onClick={() => toast.success('Profile updated')}>Save Changes</Button>
      </div>
    </div>
  )
}
