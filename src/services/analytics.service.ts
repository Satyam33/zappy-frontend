import api from './api'

export const analyticsService = {
  getSummary: (range: string) =>
    api.get('/analytics/summary', { params: { range } }).then(r => r.data),

  getTopCampaigns: () => api.get('/analytics/campaigns/top').then(r => r.data),

  getContactGrowth: () => api.get('/analytics/contacts/growth').then(r => r.data),

  getDashboardStats: () => api.get('/dashboard/stats').then(r => r.data),
}
