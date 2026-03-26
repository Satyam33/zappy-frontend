import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export const WAAPISettings = () => {
  const [showToken, setShowToken] = useState(false)
  const [connected, setConnected] = useState(true)
  const [form, setForm] = useState({
    phoneNumberId: '123456789012345',
    wabaId:        '987654321098765',
    accessToken:   'EAABsbCS1iH0BAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900">
          WhatsApp Business API
        </h3>
        <Badge variant={connected ? 'green' : 'red'} dot={connected}>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Phone Number ID</label>
          <input
            value={form.phoneNumberId}
            onChange={e => setForm(p => ({ ...p, phoneNumberId: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">WhatsApp Business Account ID</label>
          <input
            value={form.wabaId}
            onChange={e => setForm(p => ({ ...p, wabaId: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Access Token</label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={form.accessToken}
              onChange={e => setForm(p => ({ ...p, accessToken: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-[13.5px] text-gray-900 font-mono outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
        <Button onClick={() => toast.success('Settings saved')}>Save Changes</Button>
        <Button
          variant={connected ? 'danger' : 'ghost'}
          onClick={() => { setConnected(v => !v); toast.success(connected ? 'Disconnected' : 'Connected') }}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}
