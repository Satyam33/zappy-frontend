import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { type WhatsAppSettings, type WhatsAppStatus } from '../../services/settings.service'
import { useSettingsController } from '../../controllers/settings.controller'

export const WAAPISettings = () => {
  const settingsController = useSettingsController()
  const [showToken, setShowToken] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [status, setStatus] = useState<WhatsAppStatus | null>(null)
  const [form, setForm] = useState<WhatsAppSettings>({
    phoneNumberId: '',
    wabaId: '',
    accessToken: '',
    qualityRating: 'UNKNOWN',
    messagingLimit: 'UNKNOWN',
  })
  const [initialForm, setInitialForm] = useState<WhatsAppSettings | null>(null)

  const isDirty = useMemo(() => {
    if (!initialForm) return false
    return (
      form.phoneNumberId !== initialForm.phoneNumberId ||
      form.wabaId !== initialForm.wabaId ||
      form.accessToken !== initialForm.accessToken
    )
  }, [form, initialForm])

  const loadSettings = async () => {
    setIsLoading(true)
    const result = await settingsController.loadWhatsAppSettings()
    if (result.ok) {
      setForm(result.data.settings)
      setInitialForm(result.data.settings)
      setStatus(result.data.status)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const result = await settingsController.saveWhatsAppSettings({
      phoneNumberId: form.phoneNumberId,
      wabaId: form.wabaId,
      accessToken: form.accessToken,
    })
    if (result.ok) {
      setForm(result.data.settings)
      setInitialForm(result.data.settings)
      setStatus(result.data.status)
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true)
    const result = await settingsController.refreshWhatsAppStatus()
    if (result.ok) {
      setStatus(result.data)
    }
    setIsCheckingStatus(false)
  }

  const connected = status?.connected ?? false

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

      {isLoading ? (
        <p className="text-[13px] text-gray-500">Loading settings...</p>
      ) : (
      <div className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Phone Number ID</label>
          <input
            value={form.phoneNumberId}
            onChange={e => setForm(p => ({ ...p, phoneNumberId: e.target.value }))}
            readOnly={!isEditing}
            className={`w-full border rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono outline-none transition-colors ${
              isEditing
                ? 'bg-gray-50 border-gray-200 focus:border-green-500 focus:bg-white'
                : 'bg-gray-50 border-gray-200 opacity-70 cursor-default'
            }`}
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">WhatsApp Business Account ID</label>
          <input
            value={form.wabaId}
            onChange={e => setForm(p => ({ ...p, wabaId: e.target.value }))}
            readOnly={!isEditing}
            className={`w-full border rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono outline-none transition-colors ${
              isEditing
                ? 'bg-gray-50 border-gray-200 focus:border-green-500 focus:bg-white'
                : 'bg-gray-50 border-gray-200 opacity-70 cursor-default'
            }`}
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Access Token</label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={form.accessToken}
              onChange={e => setForm(p => ({ ...p, accessToken: e.target.value }))}
              readOnly={!isEditing}
              className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-[13.5px] text-gray-900 font-mono outline-none transition-colors ${
                isEditing
                  ? 'bg-gray-50 border-gray-200 focus:border-green-500 focus:bg-white'
                  : 'bg-gray-50 border-gray-200 opacity-70 cursor-default'
              }`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <p className="text-[11.5px] text-gray-500 mb-0.5">Quality Rating</p>
            <p className="text-[13px] font-medium text-gray-900">{status?.qualityRating || form.qualityRating || 'UNKNOWN'}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <p className="text-[11.5px] text-gray-500 mb-0.5">Messaging Limit</p>
            <p className="text-[13px] font-medium text-gray-900">{status?.messagingLimit || form.messagingLimit || 'UNKNOWN'}</p>
          </div>
        </div>
        {status?.statusMessage && (
          <p className="text-[12px] text-gray-500">{status.statusMessage}</p>
        )}
      </div>
      )}

      <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
            Edit
          </Button>
        ) : (
          <>
            <Button onClick={handleSave} loading={isSaving} disabled={!isDirty}>
              Save Changes
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (initialForm) setForm(initialForm)
                setIsEditing(false)
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </>
        )}
        <Button variant={connected ? 'accent' : 'ghost'} onClick={handleCheckStatus} loading={isCheckingStatus} disabled={isLoading}>
          Check Status
        </Button>
      </div>
    </div>
  )
}
