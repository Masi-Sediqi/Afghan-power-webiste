import type { LangCode } from './i18n'
import { localizedValue, type LocalizedFields } from './localization'

export type ServiceCategory = 'education' | 'travel' | 'technology' | 'media'
export type ServiceTextFields = { title: string; description: string; actionLabel: string }
export type ServiceRecord = ServiceTextFields & {
  id: string
  category: ServiceCategory
  image: string
  featured: boolean
  visible: boolean
  sortOrder: number
  actionHref: string
  translations?: LocalizedFields<ServiceTextFields>
  createdAt?: string
  updatedAt?: string
}
export function localizeService(service: ServiceRecord, lang: LangCode): ServiceRecord {
  return localizedValue(service, service.translations as LocalizedFields<ServiceRecord> | undefined, lang)
}
async function request<T>(path: string): Promise<T> {
  const response = await fetch(path)
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load services.')
  return data as T
}
export const servicesApi = { list: () => request<{ services: ServiceRecord[] }>('/api/services') }
