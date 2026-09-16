import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const serviceCategories = ['education', 'travel', 'technology', 'media'] as const
export type ServiceCategory = typeof serviceCategories[number]

export type ServiceInput = {
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
}

export type ServiceRecord = ServiceInput & { createdAt: string; updatedAt: string }

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultDataFile = path.join(moduleDir, 'data', 'services.json')
const cleanText = (value: unknown) => typeof value === 'string' ? value.trim() : ''

function normalizeService(input: ServiceInput): ServiceInput {
  const id = cleanText(input.id).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Enter a valid service id using lowercase letters, numbers and hyphens.')
  if (!serviceCategories.includes(input.category)) throw new Error('Choose a valid service category.')
  const title = cleanText(input.title)
  const description = cleanText(input.description)
  const image = cleanText(input.image)
  if (!title) throw new Error('Service title is required.')
  if (!description) throw new Error('Service description is required.')
  if (!image) throw new Error('Service image is required.')
  return {
    id,
    category: input.category,
    title,
    description,
    image,
    featured: input.featured === true,
    visible: input.visible !== false,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
    actionLabel: cleanText(input.actionLabel) || 'Learn more',
    actionHref: cleanText(input.actionHref) || '#/contact',
  }
}

async function readServices(filePath: string): Promise<ServiceRecord[]> {
  try {
    const parsed = JSON.parse(await readFile(filePath, 'utf8'))
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...normalizeService(item as ServiceInput),
      createdAt: cleanText((item as ServiceRecord).createdAt) || new Date().toISOString(),
      updatedAt: cleanText((item as ServiceRecord).updatedAt) || new Date().toISOString(),
    }))
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
}

async function writeServices(filePath: string, services: ServiceRecord[]) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.tmp`
  await writeFile(tempPath, `${JSON.stringify(services, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export function createServiceStore(filePath = defaultDataFile) {
  return {
    async listServices(options: { includeHidden?: boolean } = {}) {
      return (await readServices(filePath))
        .filter((service) => options.includeHidden || service.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
    },
    async getService(id: string, options: { includeHidden?: boolean } = {}) {
      const service = (await readServices(filePath)).find((item) => item.id === id)
      if (!service || (!options.includeHidden && !service.visible)) return null
      return service
    },
    async createService(input: ServiceInput) {
      const normalized = normalizeService(input)
      const services = await readServices(filePath)
      if (services.some((item) => item.id === normalized.id)) throw new Error('A service with this id already exists.')
      const now = new Date().toISOString()
      const service: ServiceRecord = { ...normalized, createdAt: now, updatedAt: now }
      services.push(service)
      await writeServices(filePath, services)
      return service
    },
    async updateService(id: string, input: ServiceInput) {
      const normalized = normalizeService({ ...input, id })
      const services = await readServices(filePath)
      const index = services.findIndex((item) => item.id === id)
      if (index < 0) return null
      const service: ServiceRecord = { ...services[index], ...normalized, id, createdAt: services[index].createdAt, updatedAt: new Date().toISOString() }
      services[index] = service
      await writeServices(filePath, services)
      return service
    },
    async deleteService(id: string) {
      const services = await readServices(filePath)
      const next = services.filter((item) => item.id !== id)
      if (next.length === services.length) return false
      await writeServices(filePath, next)
      return true
    },
  }
}

const store = createServiceStore()
export const listServices = store.listServices
export const getService = store.getService
export const createService = store.createService
export const updateService = store.updateService
export const deleteService = store.deleteService
