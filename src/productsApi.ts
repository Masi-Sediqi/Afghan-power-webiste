export type ProductCategory = 'education' | 'travel' | 'technology' | 'media'
export type ProductDetailRow = { label: string; value: string }

export type ProductRecord = {
  id: string
  category: ProductCategory
  title: string
  subtitle: string
  description: string
  images: string[]
  features: string[]
  badge: string
  priceLabel: string
  visible: boolean
  sortOrder: number
  details: ProductDetailRow[]
  sectionTitle: string
  sectionBody: string
  recommendedTitle: string
  recommendedFor: string[]
  requirementsTitle: string
  requirements: string[]
  actionLabel: string
  secondaryLabel: string
  secondaryHref: string
  createdAt?: string
  updatedAt?: string
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
