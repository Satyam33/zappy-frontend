import api from './api'

export const campaignsService = {
  getAll: (params?: { limit?: number }) =>
    api.get('/campaigns', { params }).then(r => r.data),

  create: (data: { name: string; templateId: string; segment: string; scheduleNow?: boolean; scheduledAt?: string }) =>
    api.post('/campaigns', data).then(r => r.data),
}
