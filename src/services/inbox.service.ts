import api from './api'

export const inboxService = {
  getConversations: () => api.get('/conversations').then(r => r.data),

  getMessages: (conversationId: string) =>
    api.get(`/conversations/${conversationId}/messages`).then(r => r.data),

  sendMessage: (conversationId: string, content: string) =>
    api.post(`/conversations/${conversationId}/messages`, { content }).then(r => r.data),

  resolve: (conversationId: string) =>
    api.post(`/conversations/${conversationId}/resolve`).then(r => r.data),

  assign: (conversationId: string, userId: string) =>
    api.post(`/conversations/${conversationId}/assign`, { userId }).then(r => r.data),
}
