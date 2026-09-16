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
  setup: (input: { email: string; password: string }) => request<{ admin: AdminUser }>('/api/admin/setup', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  login: (input: { email: string; password: string }) => request<{ admin: AdminUser }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  me: () => request<{ admin: AdminUser | null }>('/api/admin/me'),
  logout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
}
