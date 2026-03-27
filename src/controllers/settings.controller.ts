import { useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  getSettingsApiErrorMessage,
  settingsService,
  type BusinessProfile,
  type WebhookSettings,
  type WhatsAppSettings,
  type WhatsAppStatus,
} from '../services/settings.service'

type Result<T> = { ok: true; data: T } | { ok: false }

export const useSettingsController = () => {
  const loadWhatsAppSettings = useCallback(async (): Promise<Result<{ settings: WhatsAppSettings; status: WhatsAppStatus }>> => {
    try {
      const settings = await settingsService.getWhatsAppSettings()
      try {
        const status = await settingsService.getWhatsAppStatus()
        return { ok: true, data: { settings, status } }
      } catch {
        return {
          ok: true,
          data: {
            settings,
            status: {
              connected: false,
              qualityRating: settings.qualityRating || null,
              messagingLimit: settings.messagingLimit || null,
              displayPhoneNumber: null,
              verifiedName: null,
              statusMessage: 'Unable to fetch live status right now',
            },
          },
        }
      }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to load WhatsApp settings'))
      return { ok: false }
    }
  }, [])

  const saveWhatsAppSettings = useCallback(async (
    payload: { phoneNumberId: string; wabaId: string; accessToken: string }
  ): Promise<Result<{ settings: WhatsAppSettings; status: WhatsAppStatus }>> => {
    try {
      const updated = await settingsService.updateWhatsAppSettings(payload)
      toast.success(updated.message || 'Settings updated')
      let status: WhatsAppStatus
      try {
        status = await settingsService.getWhatsAppStatus()
      } catch {
        status = {
          connected: false,
          qualityRating: updated.qualityRating || null,
          messagingLimit: updated.messagingLimit || null,
          displayPhoneNumber: null,
          verifiedName: null,
          statusMessage: 'Saved. Live status check failed.',
        }
      }
      return { ok: true, data: { settings: updated, status } }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to update settings'))
      return { ok: false }
    }
  }, [])

  const refreshWhatsAppStatus = useCallback(async (): Promise<Result<WhatsAppStatus>> => {
    try {
      const status = await settingsService.getWhatsAppStatus()
      toast.success(status.message || status.statusMessage || 'Status refreshed')
      return { ok: true, data: status }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to check connection status'))
      return { ok: false }
    }
  }, [])

  const loadBusinessProfile = useCallback(async (): Promise<Result<BusinessProfile>> => {
    try {
      const profile = await settingsService.getBusinessProfile()
      return { ok: true, data: profile }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to load business profile'))
      return { ok: false }
    }
  }, [])

  const saveBusinessProfile = useCallback(async (
    payload: { category: string; timezone: string; optOutKeyword: string }
  ): Promise<Result<BusinessProfile>> => {
    try {
      const updated = await settingsService.updateBusinessProfile(payload)
      toast.success(updated.message || 'Business profile updated')
      return { ok: true, data: updated }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to update business profile'))
      return { ok: false }
    }
  }, [])

  const loadWebhookSettings = useCallback(async (): Promise<Result<WebhookSettings>> => {
    try {
      const data = await settingsService.getWebhookSettings()
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to load webhook settings'))
      return { ok: false }
    }
  }, [])

  const saveWebhookSettings = useCallback(async (
    payload: { events: WebhookSettings['events'] }
  ): Promise<Result<WebhookSettings>> => {
    try {
      const data = await settingsService.updateWebhookSettings(payload)
      toast.success(data.message || 'Webhook settings updated')
      return { ok: true, data }
    } catch (error: unknown) {
      toast.error(getSettingsApiErrorMessage(error, 'Failed to update webhook settings'))
      return { ok: false }
    }
  }, [])

  return {
    loadWhatsAppSettings,
    saveWhatsAppSettings,
    refreshWhatsAppStatus,
    loadBusinessProfile,
    saveBusinessProfile,
    loadWebhookSettings,
    saveWebhookSettings,
  }
}
