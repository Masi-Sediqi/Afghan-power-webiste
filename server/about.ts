import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type StorySettingsInput = { heading: string; intro: string }
export type StoryItemInput = { id: string; step: string; title: string; text: string; visible: boolean; sortOrder: number }
export type StoryItemRecord = StoryItemInput & { createdAt: string; updatedAt: string }
export type LeadershipInput = { id: string; name: string; role: string; text: string; photo: string; visible: boolean; sortOrder: number }
export type LeadershipRecord = LeadershipInput & { createdAt: string; updatedAt: string }
export type AboutData = { story: StorySettingsInput & { items: StoryItemRecord[] }; leaders: LeadershipRecord[] }

type StoredAboutData = AboutData

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultDataFile = path.join(moduleDir, 'data', 'about.json')
const cleanText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const cleanId = (value: unknown, label: string) => {
  const id = cleanText(value).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Enter a valid ${label} id using lowercase letters, numbers and hyphens.`)
  return id
}

const emptyData = (): StoredAboutData => ({ story: { heading: '', intro: '', items: [] }, leaders: [] })

function normalizeStorySettings(input: StorySettingsInput): StorySettingsInput {
  const heading = cleanText(input.heading)
  const intro = cleanText(input.intro)
  if (!heading) throw new Error('Story heading is required.')
  if (!intro) throw new Error('Story introduction is required.')
  return { heading, intro }
}

function normalizeStoryItem(input: StoryItemInput): StoryItemInput {
  const id = cleanId(input.id, 'story')
  const step = cleanText(input.step)
  const title = cleanText(input.title)
  const text = cleanText(input.text)
  if (!step) throw new Error('Story step is required.')
  if (!title) throw new Error('Story title is required.')
  if (!text) throw new Error('Story text is required.')
  return { id, step, title, text, visible: input.visible !== false, sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0 }
}

function normalizeLeader(input: LeadershipInput): LeadershipInput {
  const id = cleanId(input.id, 'leader')
  const name = cleanText(input.name)
  const role = cleanText(input.role)
  const text = cleanText(input.text)
  const photo = cleanText(input.photo)
  if (!name) throw new Error('Leader name is required.')
  if (!role) throw new Error('Leader role is required.')
  if (!text) throw new Error('Leader description is required.')
  if (!photo) throw new Error('Leader photo is required.')
  return { id, name, role, text, photo, visible: input.visible !== false, sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0 }
}

async function readAbout(filePath: string): Promise<StoredAboutData> {
  try {
    const raw = JSON.parse(await readFile(filePath, 'utf8')) as Partial<StoredAboutData>
    const now = new Date().toISOString()
    const storySettings = raw.story?.heading && raw.story?.intro
      ? normalizeStorySettings({ heading: raw.story.heading, intro: raw.story.intro })
      : { heading: '', intro: '' }
    const items = Array.isArray(raw.story?.items) ? raw.story!.items.map((item) => ({
      ...normalizeStoryItem(item), createdAt: cleanText(item.createdAt) || now, updatedAt: cleanText(item.updatedAt) || now,
    })) : []
    const leaders = Array.isArray(raw.leaders) ? raw.leaders.map((item) => ({
      ...normalizeLeader(item), createdAt: cleanText(item.createdAt) || now, updatedAt: cleanText(item.updatedAt) || now,
    })) : []
    return { story: { ...storySettings, items }, leaders }
  } catch (error: any) {
    if (error?.code === 'ENOENT') return emptyData()
    throw error
  }
}

async function writeAbout(filePath: string, data: StoredAboutData) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.tmp`
  await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export function createAboutStore(filePath = defaultDataFile) {
  return {
    async getAbout(options: { includeHidden?: boolean } = {}): Promise<AboutData> {
      const data = await readAbout(filePath)
      return {
        story: {
          heading: data.story.heading,
          intro: data.story.intro,
          items: data.story.items.filter((item) => options.includeHidden || item.visible).sort((a, b) => a.sortOrder - b.sortOrder || a.step.localeCompare(b.step)),
        },
        leaders: data.leaders.filter((item) => options.includeHidden || item.visible).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
      }
    },
    async updateStorySettings(input: StorySettingsInput) {
      const data = await readAbout(filePath)
      data.story = { ...data.story, ...normalizeStorySettings(input) }
      await writeAbout(filePath, data)
      return { heading: data.story.heading, intro: data.story.intro }
    },
    async createStoryItem(input: StoryItemInput) {
      const normalized = normalizeStoryItem(input)
      const data = await readAbout(filePath)
      if (data.story.items.some((item) => item.id === normalized.id)) throw new Error('A story item with this id already exists.')
      const now = new Date().toISOString()
      const item: StoryItemRecord = { ...normalized, createdAt: now, updatedAt: now }
      data.story.items.push(item)
      await writeAbout(filePath, data)
      return item
    },
    async updateStoryItem(id: string, input: StoryItemInput) {
      const data = await readAbout(filePath)
      const index = data.story.items.findIndex((item) => item.id === id)
      if (index < 0) return null
      const normalized = normalizeStoryItem({ ...input, id })
      const item: StoryItemRecord = { ...data.story.items[index], ...normalized, id, createdAt: data.story.items[index].createdAt, updatedAt: new Date().toISOString() }
      data.story.items[index] = item
      await writeAbout(filePath, data)
      return item
    },
    async deleteStoryItem(id: string) {
      const data = await readAbout(filePath)
      const next = data.story.items.filter((item) => item.id !== id)
      if (next.length === data.story.items.length) return false
      data.story.items = next
      await writeAbout(filePath, data)
      return true
    },
    async createLeader(input: LeadershipInput) {
      const normalized = normalizeLeader(input)
      const data = await readAbout(filePath)
      if (data.leaders.some((item) => item.id === normalized.id)) throw new Error('A leader with this id already exists.')
      const now = new Date().toISOString()
      const item: LeadershipRecord = { ...normalized, createdAt: now, updatedAt: now }
      data.leaders.push(item)
      await writeAbout(filePath, data)
      return item
    },
    async updateLeader(id: string, input: LeadershipInput) {
      const data = await readAbout(filePath)
      const index = data.leaders.findIndex((item) => item.id === id)
      if (index < 0) return null
      const normalized = normalizeLeader({ ...input, id })
      const item: LeadershipRecord = { ...data.leaders[index], ...normalized, id, createdAt: data.leaders[index].createdAt, updatedAt: new Date().toISOString() }
      data.leaders[index] = item
      await writeAbout(filePath, data)
      return item
    },
    async deleteLeader(id: string) {
      const data = await readAbout(filePath)
      const next = data.leaders.filter((item) => item.id !== id)
      if (next.length === data.leaders.length) return false
      data.leaders = next
      await writeAbout(filePath, data)
      return true
    },
  }
}

const store = createAboutStore()
export const getAbout = store.getAbout
export const updateStorySettings = store.updateStorySettings
export const createStoryItem = store.createStoryItem
export const updateStoryItem = store.updateStoryItem
export const deleteStoryItem = store.deleteStoryItem
export const createLeader = store.createLeader
export const updateLeader = store.updateLeader
export const deleteLeader = store.deleteLeader
