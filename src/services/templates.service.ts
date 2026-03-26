import api from './api'

export const templatesService = {
  getAll: () => api.get('/templates').then(r => r.data),

  create: (data: { name: string; category: string; language: string; body: string }) =>
    api.post('/templates', data).then(r => r.data),

  resubmit: (id: string) => api.post(`/templates/${id}/resubmit`).then(r => r.data),
}
