import type { ProductRecord } from './productsApi'
import type { ServiceRecord } from './servicesApi'
import type { NewsRecord } from './newsApi'
import type { AboutData, LeadershipRecord, StoryItemRecord, StorySettings } from './aboutApi'
import type { ContactMessageRecord, ContactSettings } from './contactApi'

export type AdminUser = {
  id: number
  email: string
  createdAt: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Request failed. Please try again.')
  return data as T
}

export const adminApi = {
  setupStatus: () => request<{ configured: boolean }>('/api/admin/setup-status'),
  setup: (input: { email: string; password: string }) => request<{ admin: AdminUser }>('/api/admin/setup', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) => request<{ admin: AdminUser }>('/api/admin/login', { method: 'POST', body: JSON.stringify(input) }),
  me: () => request<{ admin: AdminUser | null }>('/api/admin/me'),
  logout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
  products: () => request<{ products: ProductRecord[] }>('/api/admin/products'),
  createProduct: (product: ProductRecord) => request<{ product: ProductRecord }>('/api/admin/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id: string, product: ProductRecord) => request<{ product: ProductRecord }>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<{ ok: boolean }>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  uploadProductImage: (input: { fileName: string; dataUrl: string }) => request<{ url: string }>('/api/admin/uploads/product-image', { method: 'POST', body: JSON.stringify(input) }),
  services: () => request<{ services: ServiceRecord[] }>('/api/admin/services'),
  createService: (service: ServiceRecord) => request<{ service: ServiceRecord }>('/api/admin/services', { method: 'POST', body: JSON.stringify(service) }),
  updateService: (id: string, service: ServiceRecord) => request<{ service: ServiceRecord }>(`/api/admin/services/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(service) }),
  deleteService: (id: string) => request<{ ok: boolean }>(`/api/admin/services/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  uploadServiceImage: (input: { fileName: string; dataUrl: string }) => request<{ url: string }>('/api/admin/uploads/service-image', { method: 'POST', body: JSON.stringify(input) }),
  news: () => request<{ news: NewsRecord[] }>('/api/admin/news'),
  createNews: (item: NewsRecord) => request<{ news: NewsRecord }>('/api/admin/news', { method: 'POST', body: JSON.stringify(item) }),
  updateNews: (id: string, item: NewsRecord) => request<{ news: NewsRecord }>(`/api/admin/news/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteNews: (id: string) => request<{ ok: boolean }>(`/api/admin/news/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  about: () => request<{ about: AboutData }>('/api/admin/about'),
  updateStorySettings: (story: StorySettings) => request<{ story: StorySettings }>('/api/admin/about/story-settings', { method: 'PUT', body: JSON.stringify(story) }),
  createStoryItem: (item: StoryItemRecord) => request<{ item: StoryItemRecord }>('/api/admin/about/story-items', { method: 'POST', body: JSON.stringify(item) }),
  updateStoryItem: (id: string, item: StoryItemRecord) => request<{ item: StoryItemRecord }>(`/api/admin/about/story-items/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteStoryItem: (id: string) => request<{ ok: boolean }>(`/api/admin/about/story-items/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createLeader: (leader: LeadershipRecord) => request<{ leader: LeadershipRecord }>('/api/admin/about/leaders', { method: 'POST', body: JSON.stringify(leader) }),
  updateLeader: (id: string, leader: LeadershipRecord) => request<{ leader: LeadershipRecord }>(`/api/admin/about/leaders/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(leader) }),
  deleteLeader: (id: string) => request<{ ok: boolean }>(`/api/admin/about/leaders/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  uploadLeaderImage: (input: { fileName: string; dataUrl: string }) => request<{ url: string }>('/api/admin/uploads/leader-image', { method: 'POST', body: JSON.stringify(input) }),

  uploadNewsImage: (input: { fileName: string; dataUrl: string }) => request<{ url: string }>('/api/admin/uploads/news-image', { method: 'POST', body: JSON.stringify(input) }),

  contact: () => request<{ contact: ContactSettings }>('/api/admin/contact'),
  updateContact: (contact: ContactSettings) => request<{ contact: ContactSettings }>('/api/admin/contact', { method: 'PUT', body: JSON.stringify(contact) }),
  messages: () => request<{ messages: ContactMessageRecord[] }>('/api/admin/messages'),
  updateMessageStatus: (id: string, status: 'new' | 'read') => request<{ message: ContactMessageRecord }>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteMessage: (id: string) => request<{ ok: boolean }>(`/api/admin/messages/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}

