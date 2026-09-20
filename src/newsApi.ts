import type { LangCode } from './i18n'
import { localizedValue, type LocalizedFields } from './localization'
export type NewsCategory = 'education' | 'travel' | 'technology' | 'media' | 'company'
export type NewsTextFields = { title: string; summary: string; readTime: string }
export type NewsRecord = NewsTextFields & {
  id: string
  category: NewsCategory
  date: string
  featured: boolean
  visible: boolean
  sortOrder: number
  image: string
  translations?: LocalizedFields<NewsTextFields>
  createdAt?: string
  updatedAt?: string
}
export function localizeNews(item: NewsRecord, lang: LangCode): NewsRecord {
  return localizedValue(item, item.translations as LocalizedFields<NewsRecord> | undefined, lang)
}
async function request<T>(path: string): Promise<T> {
  const response = await fetch(path)
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load news.')
  return data as T
}
export const newsApi = { list: () => request<{ news: NewsRecord[] }>('/api/news') }
