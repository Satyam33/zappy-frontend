import api from './api'

export const contactsService = {
  getAll: (params?: { tag?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/contacts', { params }).then(r => r.data),

  create: (data: { name: string; phone: string; tags?: string[] }) =>
    api.post('/contacts', data).then(r => r.data),

  delete: (id: string) => api.delete(`/contacts/${id}`),

  bulkDelete: (ids: string[]) => api.post('/contacts/bulk-delete', { ids }),

  importCSV: (formData: FormData) =>
    api.post('/contacts/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
}
