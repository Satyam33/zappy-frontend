import { useState } from 'react'
import { WAAPISettings } from './WAAPISettings'
import { WebhookSettings } from './WebhookSettings'
import { TeamMembers } from './TeamMembers'
import { BusinessProfile } from './BusinessProfile'
import { Toggle } from '../../components/ui/Toggle'

type Section = 'whatsapp' | 'webhook' | 'profile' | 'team' | 'notifications'

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'whatsapp',      label: 'WhatsApp API' },
  { key: 'webhook',       label: 'Webhooks' },
  { key: 'profile',       label: 'Business Profile' },
  { key: 'team',          label: 'Team Members' },
  { key: 'notifications', label: 'Notifications' },
]

export default function Settings() {
  const [section, setSection] = useState<Section>('whatsapp')

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Sidebar nav */}
      <div className="w-full lg:w-48 flex-shrink-0">
        <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-x-auto">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`w-full lg:w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] transition-colors cursor-pointer mb-0.5
                ${section === s.key
                  ? 'bg-green-50 text-green-600 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {section === 'whatsapp' && <WAAPISettings />}
        {section === 'webhook' && <WebhookSettings />}
        {section === 'profile' && <BusinessProfile />}
        {section === 'team' && <TeamMembers />}
        {section === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    campaignDelivered: true,
    newMessage: true,
    templateApproved: false,
  })

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {([
          ['campaignDelivered', 'Campaign delivered', 'Get notified when a broadcast is fully delivered'],
          ['newMessage',        'New message',        'Alert when a contact sends a new message to inbox'],
          ['templateApproved',  'Template approved',  'Notify when a template gets Meta approval'],
        ] as [keyof typeof settings, string, string][]).map(([key, label, desc]) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[13.5px] font-medium text-gray-900">{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
            </div>
            <Toggle
              checked={settings[key]}
              onChange={(v: boolean) => setSettings(prev => ({ ...prev, [key]: v }))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
