export type ServiceCategory = 'education' | 'travel' | 'technology' | 'media'
export type ServiceRecord = {
  id: string
  category: ServiceCategory
  title: string
  description: string
  image: string
  featured: boolean
  visible: boolean
  sortOrder: number
  actionLabel: string
  actionHref: string
  createdAt?: string
  updatedAt?: string
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path)
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load services.')
  return data as T
}

export const servicesApi = {
  list: () => request<{ services: ServiceRecord[] }>('/api/services'),
}
