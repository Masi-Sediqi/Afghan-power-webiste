import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const newsCategories = ['education', 'travel', 'technology', 'media', 'company'] as const
export type NewsCategory = typeof newsCategories[number]

export type NewsInput = {
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
}

export type NewsRecord = NewsInput & { createdAt: string; updatedAt: string }

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultDataFile = path.join(moduleDir, 'data', 'news.json')
const cleanText = (value: unknown) => typeof value === 'string' ? value.trim() : ''

function normalizeNews(input: NewsInput): NewsInput {
  const id = cleanText(input.id).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Enter a valid news id using lowercase letters, numbers and hyphens.')
  if (!newsCategories.includes(input.category)) throw new Error('Choose a valid news category.')
  const title = cleanText(input.title)
  const summary = cleanText(input.summary)
  const image = cleanText(input.image)
  const date = cleanText(input.date)
  if (!title) throw new Error('News title is required.')
  if (!summary) throw new Error('News summary is required.')
  if (!image) throw new Error('News image is required.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Choose a valid news date.')
  return {
    id,
    title,
    category: input.category,
    date,
    readTime: cleanText(input.readTime) || '3 min read',
    featured: input.featured === true,
    visible: input.visible !== false,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
    image,
    summary,
  }
}

async function readNews(filePath: string): Promise<NewsRecord[]> {
  try {
    const parsed = JSON.parse(await readFile(filePath, 'utf8'))
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...normalizeNews(item as NewsInput),
      createdAt: cleanText((item as NewsRecord).createdAt) || new Date().toISOString(),
      updatedAt: cleanText((item as NewsRecord).updatedAt) || new Date().toISOString(),
    }))
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
}

async function writeNews(filePath: string, items: NewsRecord[]) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.tmp`
  await writeFile(tempPath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export function createNewsStore(filePath = defaultDataFile) {
  return {
    async listNews(options: { includeHidden?: boolean } = {}) {
      return (await readNews(filePath))
        .filter((item) => options.includeHidden || item.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder || b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    },
    async getNews(id: string, options: { includeHidden?: boolean } = {}) {
      const item = (await readNews(filePath)).find((entry) => entry.id === id)
      if (!item || (!options.includeHidden && !item.visible)) return null
      return item
    },
    async createNews(input: NewsInput) {
      const normalized = normalizeNews(input)
      const items = await readNews(filePath)
      if (items.some((item) => item.id === normalized.id)) throw new Error('A news item with this id already exists.')
      const now = new Date().toISOString()
      const item: NewsRecord = { ...normalized, createdAt: now, updatedAt: now }
      items.push(item)
      await writeNews(filePath, items)
      return item
    },
    async updateNews(id: string, input: NewsInput) {
      const normalized = normalizeNews({ ...input, id })
      const items = await readNews(filePath)
      const index = items.findIndex((item) => item.id === id)
      if (index < 0) return null
      const item: NewsRecord = { ...items[index], ...normalized, id, createdAt: items[index].createdAt, updatedAt: new Date().toISOString() }
      items[index] = item
      await writeNews(filePath, items)
      return item
    },
    async deleteNews(id: string) {
      const items = await readNews(filePath)
      const next = items.filter((item) => item.id !== id)
      if (next.length === items.length) return false
      await writeNews(filePath, next)
      return true
    },
  }
}

const store = createNewsStore()
export const listNews = store.listNews
export const getNews = store.getNews
export const createNews = store.createNews
export const updateNews = store.updateNews
export const deleteNews = store.deleteNews
