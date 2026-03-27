import type { Contact } from '../types/contact.types'
import type { Campaign } from '../types/campaign.types'
import type { Template } from '../types/template.types'
import type { Conversation, Message } from '../types/inbox.types'

export const mockContacts: Contact[] = [
  { id: '1', name: 'Priya Sharma', phone: '+919876543210', tags: ['VIP'], opted_in: true, segment: 'VIP', added: '12 Jan 2026', createdAt: '2026-01-12T10:00:00Z' },
  { id: '2', name: 'Rahul Gupta', phone: '+918765432109', tags: ['New Customer'], opted_in: true, segment: 'New Customer', added: '18 Feb 2026', createdAt: '2026-02-18T10:00:00Z' },
  { id: '3', name: 'Anjali Singh', phone: '+917654321098', tags: ['Repeat'], opted_in: true, segment: 'Repeat', added: '03 Mar 2026', createdAt: '2026-03-03T10:00:00Z' },
  { id: '4', name: 'Vikram Patel', phone: '+916543210987', tags: ['Inactive'], opted_in: false, segment: 'Inactive', added: '25 Dec 2025', createdAt: '2025-12-25T10:00:00Z' },
  { id: '5', name: 'Neha Joshi', phone: '+915432109876', tags: ['VIP', 'Repeat'], opted_in: true, segment: 'VIP', added: '08 Feb 2026', createdAt: '2026-02-08T10:00:00Z' },
  { id: '6', name: 'Arjun Mehta', phone: '+914321098765', tags: ['New Customer'], opted_in: true, segment: 'New Customer', added: '15 Mar 2026', createdAt: '2026-03-15T10:00:00Z' },
  { id: '7', name: 'Kavya Reddy', phone: '+913210987654', tags: ['Repeat'], opted_in: true, segment: 'Repeat', added: '01 Mar 2026', createdAt: '2026-03-01T10:00:00Z' },
  { id: '8', name: 'Sanjay Kumar', phone: '+912109876543', tags: ['VIP'], opted_in: true, segment: 'VIP', added: '20 Jan 2026', createdAt: '2026-01-20T10:00:00Z' },
]

export const mockCampaigns: Campaign[] = [
  {
    id: '1', name: 'Holi Sale 2026', segment: 'All', templateId: 't1', templateName: 'holi_sale_offer',
    status: 'completed', sentAt: '2026-03-10T09:00:00Z',
    stats: { sent: 4820, delivered: 4650, read: 3210, replied: 420, failed: 170 },
    createdAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '2', name: 'New Arrivals — March', segment: 'VIP', templateId: 't2', templateName: 'new_arrivals_march',
    status: 'running', sentAt: '2026-03-18T10:00:00Z',
    stats: { sent: 1200, delivered: 1180, read: 890, replied: 124, failed: 20 },
    createdAt: '2026-03-18T08:00:00Z',
  },
  {
    id: '3', name: 'Re-engagement Drive', segment: 'Inactive', templateId: 't3', templateName: 're_engage_v2',
    status: 'scheduled', scheduledAt: '2026-03-25T11:00:00Z',
    stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
    createdAt: '2026-03-19T10:00:00Z',
  },
  {
    id: '4', name: 'Flash Sale Alert', segment: 'Repeat', templateId: 't1', templateName: 'flash_sale_urgent',
    status: 'failed',
    stats: { sent: 320, delivered: 280, read: 190, replied: 12, failed: 40 },
    createdAt: '2026-03-05T10:00:00Z',
  },
]

export const mockTemplates: Template[] = [
  { id: 't1', name: 'holi_sale_offer', category: 'marketing', language: 'en', template_type: 'TEXT', body: 'Hi {{1}}! Celebrate Holi with up to 40% off on all products. Use code HOLI40 at checkout. Valid till March 25. Shop now: {{2}}', status: 'approved', interactive_mode: 'cta', interactive_actions: [{ type: 'URL', title: 'Shop Now', value: 'https://example.com' }], sample_values: { '1': 'Shivani', '2': 'https://example.com' }, variables: ['1', '2'], created_at: '2026-02-20T10:00:00Z' },
  { id: 't2', name: 'new_arrivals_march', category: 'marketing', language: 'en', template_type: 'IMAGE', body: 'Hey {{1}}, fresh drops just landed! Check out our latest collection: {{2}}', status: 'approved', interactive_mode: 'quick_replies', interactive_actions: [{ type: 'QUICK_REPLY', title: 'View' }], sample_values: { '1': 'Priya', '2': 'https://example.com/new' }, variables: ['1', '2'], created_at: '2026-03-01T10:00:00Z' },
  { id: 't3', name: 're_engage_v2', category: 'marketing', language: 'en', template_type: 'TEXT', body: 'We miss you, {{1}}! Come back with 20% discount: {{2}}', status: 'draft', interactive_mode: 'none', interactive_actions: [], sample_values: { '1': 'Rahul', '2': 'WELCOME20' }, variables: ['1', '2'], created_at: '2026-02-15T10:00:00Z' },
  { id: 't4', name: 'order_confirmation', category: 'utility', language: 'en', template_type: 'TEXT', body: 'Hi {{1}}, your order #{{2}} has been confirmed! Expected delivery by {{3}}.', status: 'approved', interactive_mode: 'none', interactive_actions: [], sample_values: { '1': 'Aman', '2': 'ORD-1021', '3': '24 Mar' }, variables: ['1', '2', '3'], created_at: '2026-01-10T10:00:00Z' },
  { id: 't5', name: 'otp_verification', category: 'authentication', language: 'en', template_type: 'TEXT', body: 'Your Zappy verification code is {{1}}. Valid for 10 minutes.', status: 'approved', interactive_mode: 'none', interactive_actions: [], sample_values: { '1': '123456' }, variables: ['1'], created_at: '2026-01-05T10:00:00Z' },
  { id: 't6', name: 'flash_sale_urgent', category: 'marketing', language: 'en', template_type: 'VIDEO', body: 'Limited time offer for {{1}}! Watch and buy: {{2}}', status: 'pending', interactive_mode: 'cta', interactive_actions: [{ type: 'URL', title: 'Buy', value: 'https://example.com/flash' }], sample_values: { '1': 'VIP customers', '2': 'https://example.com/flash' }, variables: ['1', '2'], created_at: '2026-03-18T10:00:00Z' },
  { id: 't7', name: 'summer_collection', category: 'marketing', language: 'en', template_type: 'CAROUSEL', body: 'Beat the heat with summer picks for {{1}}.', status: 'action_required', rejectionReason: 'Template contains promotional content without required opt-out information.', interactive_mode: 'all', interactive_actions: [{ type: 'QUICK_REPLY', title: 'Browse' }, { type: 'URL', title: 'Visit', value: 'https://example.com' }], sample_values: { '1': 'you' }, variables: ['1'], created_at: '2026-03-10T10:00:00Z' },
]

export const mockConversations: Conversation[] = [
  { id: 'c1', contactId: '1', contactName: 'Priya Sharma', contactPhone: '+919876543210', contactTag: 'VIP', lastMessage: 'Yes, I placed the order already!', lastMessageAt: '2026-03-20T14:30:00Z', unreadCount: 2, status: 'open' },
  { id: 'c2', contactId: '2', contactName: 'Rahul Gupta', contactPhone: '+918765432109', contactTag: 'New Customer', lastMessage: 'When will my order arrive?', lastMessageAt: '2026-03-20T13:10:00Z', unreadCount: 0, status: 'open' },
  { id: 'c3', contactId: '3', contactName: 'Anjali Singh', contactPhone: '+917654321098', contactTag: 'Repeat', lastMessage: 'Thank you for the help!', lastMessageAt: '2026-03-19T17:45:00Z', unreadCount: 0, status: 'resolved' },
  { id: 'c4', contactId: '5', contactName: 'Neha Joshi', contactPhone: '+915432109876', contactTag: 'VIP', lastMessage: 'Do you have this in blue?', lastMessageAt: '2026-03-20T12:00:00Z', unreadCount: 1, status: 'open' },
  { id: 'c5', contactId: '6', contactName: 'Arjun Mehta', contactPhone: '+914321098765', lastMessage: 'Can I get a refund?', lastMessageAt: '2026-03-20T10:30:00Z', unreadCount: 0, status: 'open' },
]

export const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', conversationId: 'c1', content: 'Hi Priya! Thanks for shopping with us. How can I help you today?', direction: 'outbound', status: 'read', createdAt: '2026-03-20T14:00:00Z' },
    { id: 'm2', conversationId: 'c1', content: 'I wanted to ask about the Holi sale discount.', direction: 'inbound', status: 'read', createdAt: '2026-03-20T14:10:00Z' },
    { id: 'm3', conversationId: 'c1', content: 'Of course! The HOLI40 code gives you 40% off on all products. Did you want to place an order?', direction: 'outbound', status: 'read', createdAt: '2026-03-20T14:15:00Z' },
    { id: 'm4', conversationId: 'c1', content: 'Yes, I placed the order already!', direction: 'inbound', status: 'delivered', createdAt: '2026-03-20T14:30:00Z' },
  ],
  c2: [
    { id: 'm5', conversationId: 'c2', content: 'Hello Rahul! Welcome to Zappy store. How can we assist you?', direction: 'outbound', status: 'read', createdAt: '2026-03-20T12:00:00Z' },
    { id: 'm6', conversationId: 'c2', content: 'When will my order arrive?', direction: 'inbound', status: 'read', createdAt: '2026-03-20T13:10:00Z' },
  ],
  c4: [
    { id: 'm9', conversationId: 'c4', content: 'Hi Neha! Great to hear from our VIP member. What can we do for you?', direction: 'outbound', status: 'read', createdAt: '2026-03-20T11:30:00Z' },
    { id: 'm10', conversationId: 'c4', content: 'Do you have this in blue?', direction: 'inbound', status: 'delivered', createdAt: '2026-03-20T12:00:00Z' },
  ],
}

export const mockDashboardStats = {
  totalContacts: 8420,
  messagesSent: 34850,
  avgReadRate: 68.4,
  campaignsRun: 24,
  contactsChange: 12.5,
  messagesChange: 8.3,
  readRateChange: -2.1,
  campaignsChange: 4,
  deliveryFunnel: { sent: 34850, delivered: 32100, read: 23840, replied: 4120, failed: 2750 },
  dailyMessages: [
    { day: 'Mon', messages: 4200 },
    { day: 'Tue', messages: 5800 },
    { day: 'Wed', messages: 3900 },
    { day: 'Thu', messages: 6200 },
    { day: 'Fri', messages: 7100 },
    { day: 'Sat', messages: 4500 },
    { day: 'Sun', messages: 3150 },
  ],
  qualityRating: 'green' as const,
  tier: 'Tier 1',
  onboardingSteps: {
    wapiConnected: true,
    firstTemplate: true,
    firstContact: true,
    firstCampaign: false,
  },
}

export const mockBillingData = {
  plan: 'growth' as const,
  billingDate: '2026-04-01',
  usage: {
    contacts: { current: 8420, limit: 5000 },
    messages: { current: 18420, limit: 25000 },
    conversations: { current: 842, limit: 2500 },
  },
}

export const mockAnalytics = {
  summary: { sent: 34850, delivered: 32100, read: 23840, replied: 4120 },
  topCampaigns: [
    { id: '1', name: 'Holi Sale 2026', readRate: 69.1, replyRate: 9.0, sent: 4820 },
    { id: '2', name: 'New Arrivals — March', readRate: 75.4, replyRate: 10.5, sent: 1180 },
    { id: '4', name: 'Flash Sale Alert', readRate: 67.9, replyRate: 4.3, sent: 280 },
  ],
  contactGrowth: [
    { month: 'Oct', contacts: 3200 },
    { month: 'Nov', contacts: 4100 },
    { month: 'Dec', contacts: 5800 },
    { month: 'Jan', contacts: 6500 },
    { month: 'Feb', contacts: 7800 },
    { month: 'Mar', contacts: 8420 },
  ],
}
