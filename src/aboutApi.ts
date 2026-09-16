export type StorySettings = { heading: string; intro: string }
export type StoryItemRecord = { id: string; step: string; title: string; text: string; visible: boolean; sortOrder: number; createdAt: string; updatedAt: string }
export type LeadershipRecord = { id: string; name: string; role: string; text: string; photo: string; visible: boolean; sortOrder: number; createdAt: string; updatedAt: string }
export type AboutData = { story: StorySettings & { items: StoryItemRecord[] }; leaders: LeadershipRecord[] }

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'include' })
  const data = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Unable to load About content.')
  return data as T
}

export const aboutApi = {
  get: () => request<{ about: AboutData }>('/api/about'),
}
