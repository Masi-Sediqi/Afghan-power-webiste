import type { LangCode } from './i18n'
import { localizedValue, type LocalizedFields } from './localization'

export type ProductCategory = 'education' | 'travel' | 'technology' | 'media'
export type ProductDetailRow = { label: string; value: string }
export type ProductTextFields = {
  title: string
  subtitle: string
  description: string
  features: string[]
  badge: string
  priceLabel: string
  details: ProductDetailRow[]
  sectionTitle: string
  sectionBody: string
  recommendedTitle: string
  recommendedFor: string[]
  requirementsTitle: string
  requirements: string[]
  actionLabel: string
  secondaryLabel: string
}

export type ProductRecord = ProductTextFields & {
  id: string
  category: ProductCategory
  images: string[]
  visible: boolean
  sortOrder: number
  secondaryHref: string
  demoLink: string
  youtubeVideoLink: string
  translations?: LocalizedFields<ProductTextFields>
  createdAt?: string
  updatedAt?: string
}

export function localizeProduct(product: ProductRecord, lang: LangCode): ProductRecord {
  return localizedValue(product, product.translations as LocalizedFields<ProductRecord> | undefined, lang)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load products.')
  return data as T
}

export const productsApi = {
  list: () => request<{ products: ProductRecord[] }>('/api/products'),
  get: (id: string) => request<{ product: ProductRecord }>(`/api/products/${encodeURIComponent(id)}`),
}
