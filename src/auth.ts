export type AuthUser = {
  id: number
  name: string
  phone: string | null
  email: string
  provider: string
  avatarUrl: string | null
}

type AuthResponse = { user: AuthUser | null; error?: string }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.')
  return data as T
}

export const authApi = {
  me: () => request<AuthResponse>('/api/auth/me'),
  signup: (input: { name: string; phone: string; email: string; password: string }) =>
    request<AuthResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { identifier: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  google: (credential: string) =>
    request<AuthResponse>('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST', body: '{}' }),
}
