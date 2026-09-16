export type NewsCategory = 'education' | 'travel' | 'technology' | 'media' | 'company'
export type NewsRecord = {
  id: string
  title: string
  category: NewsCategory
  date: string
  readTime: string
  featured: boolean
  visible: boolean
  sortOrder: number
  image: string
  summary: string
  createdAt?: string
  updatedAt?: string
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path)
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load news.')
  return data as T
}

export const newsApi = {
  list: () => request<{ news: NewsRecord[] }>('/api/news'),
}
