import type { LangCode } from './i18n'
import { localizedValue, type LocalizedFields } from './localization'
export type StorySettingsText = { heading: string; intro: string }
export type StorySettings = StorySettingsText & { translations?: LocalizedFields<StorySettingsText> }
export type StoryItemText = { step: string; title: string; text: string }
export type StoryItemRecord = StoryItemText & { id: string; visible: boolean; sortOrder: number; translations?: LocalizedFields<StoryItemText>; createdAt: string; updatedAt: string }
export type LeadershipText = { name: string; role: string; text: string }
export type LeadershipRecord = LeadershipText & { id: string; photo: string; visible: boolean; sortOrder: number; translations?: LocalizedFields<LeadershipText>; createdAt: string; updatedAt: string }
export type AboutData = { story: StorySettings & { items: StoryItemRecord[] }; leaders: LeadershipRecord[] }
export const localizeStorySettings = (item: StorySettings, lang: LangCode) => localizedValue(item, item.translations as LocalizedFields<StorySettings> | undefined, lang)
export const localizeStoryItem = (item: StoryItemRecord, lang: LangCode) => localizedValue(item, item.translations as LocalizedFields<StoryItemRecord> | undefined, lang)
export const localizeLeader = (item: LeadershipRecord, lang: LangCode) => localizedValue(item, item.translations as LocalizedFields<LeadershipRecord> | undefined, lang)
async function request<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'include' })
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load About content.')
  return data as T
}
export const aboutApi = { get: () => request<{ about: AboutData }>('/api/about') }
