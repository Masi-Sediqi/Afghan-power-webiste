import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const productCategories = ['education', 'travel', 'technology', 'media'] as const
export type ProductCategory = typeof productCategories[number]
export type ProductDetailRow = { label: string; value: string }

export type ProductInput = {
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
}

export type ProductRecord = ProductInput & {
  createdAt: string
  updatedAt: string
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultDataFile = path.join(moduleDir, 'data', 'products.json')

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(cleanText).filter(Boolean) : []
}

function cleanDetails(value: unknown): ProductDetailRow[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({
      label: cleanText((item as ProductDetailRow)?.label),
      value: cleanText((item as ProductDetailRow)?.value),
    }))
    .filter((item) => item.label && item.value)
}

function normalizeProduct(input: ProductInput): ProductInput {
  const id = cleanText(input.id).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Enter a valid product id using lowercase letters, numbers and hyphens.')
  if (!productCategories.includes(input.category)) throw new Error('Choose a valid product category.')

  const title = cleanText(input.title)
  const subtitle = cleanText(input.subtitle)
  const description = cleanText(input.description)
  const images = cleanStringArray(input.images)
  const actionLabel = cleanText(input.actionLabel)
  if (!title) throw new Error('Product title is required.')
  if (!subtitle) throw new Error('Product subtitle is required.')
  if (!description) throw new Error('Product description is required.')
  if (!images.length) throw new Error('Add at least one product image.')
  if (!actionLabel) throw new Error('Primary action label is required.')

  return {
    id,
    category: input.category,
    title,
    subtitle,
    description,
    images,
    features: cleanStringArray(input.features),
    badge: cleanText(input.badge),
    priceLabel: cleanText(input.priceLabel) || 'Contact for Price',
    visible: input.visible !== false,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
    details: cleanDetails(input.details),
    sectionTitle: cleanText(input.sectionTitle) || 'About this product',
    sectionBody: cleanText(input.sectionBody) || description,
    recommendedTitle: cleanText(input.recommendedTitle) || 'Recommended for',
    recommendedFor: cleanStringArray(input.recommendedFor),
    requirementsTitle: cleanText(input.requirementsTitle) || 'Information',
    requirements: cleanStringArray(input.requirements),
    actionLabel,
    secondaryLabel: cleanText(input.secondaryLabel),
    secondaryHref: cleanText(input.secondaryHref),
  }
}

async function readProducts(filePath: string): Promise<ProductRecord[]> {
  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => {
      const normalized = normalizeProduct(item as ProductInput)
      return {
        ...normalized,
        createdAt: cleanText((item as ProductRecord).createdAt) || new Date().toISOString(),
        updatedAt: cleanText((item as ProductRecord).updatedAt) || new Date().toISOString(),
      }
    })
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
}

async function writeProducts(filePath: string, products: ProductRecord[]) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.tmp`
  await writeFile(tempPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export function createProductStore(filePath = defaultDataFile) {
  return {
    async listProducts(options: { includeHidden?: boolean } = {}) {
      const products = await readProducts(filePath)
      return products
        .filter((product) => options.includeHidden || product.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
    },

    async getProduct(id: string, options: { includeHidden?: boolean } = {}) {
      const products = await readProducts(filePath)
      const product = products.find((item) => item.id === id)
      if (!product || (!options.includeHidden && !product.visible)) return null
      return product
    },

    async createProduct(input: ProductInput) {
      const normalized = normalizeProduct(input)
      const products = await readProducts(filePath)
      if (products.some((item) => item.id === normalized.id)) throw new Error('A product with this id already exists.')
      const now = new Date().toISOString()
      const product: ProductRecord = { ...normalized, createdAt: now, updatedAt: now }
      products.push(product)
      await writeProducts(filePath, products)
      return product
    },

    async updateProduct(id: string, input: ProductInput) {
      const normalized = normalizeProduct({ ...input, id })
      const products = await readProducts(filePath)
      const index = products.findIndex((item) => item.id === id)
      if (index < 0) return null
      const product: ProductRecord = {
        ...products[index],
        ...normalized,
        id,
        createdAt: products[index].createdAt,
        updatedAt: new Date().toISOString(),
      }
      products[index] = product
      await writeProducts(filePath, products)
      return product
    },

    async deleteProduct(id: string) {
      const products = await readProducts(filePath)
      const next = products.filter((item) => item.id !== id)
      if (next.length === products.length) return false
      await writeProducts(filePath, next)
      return true
    },
  }
}

const defaultStore = createProductStore()
export const listProducts = defaultStore.listProducts
export const getProduct = defaultStore.getProduct
export const createProduct = defaultStore.createProduct
export const updateProduct = defaultStore.updateProduct
export const deleteProduct = defaultStore.deleteProduct
