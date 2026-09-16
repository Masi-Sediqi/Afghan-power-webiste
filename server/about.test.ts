import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createAboutStore, type LeadershipInput, type StoryItemInput } from './about.ts'

const storyItem = (overrides: Partial<StoryItemInput> = {}): StoryItemInput => ({
  id: 'shared-vision', step: '01', title: 'A shared vision', text: 'Our first story item.', visible: true, sortOrder: 1, ...overrides,
})

const leader = (overrides: Partial<LeadershipInput> = {}): LeadershipInput => ({
  id: 'samim-meyakhail', name: 'M. Samim Meyakhail', role: 'Founder & Director', text: 'Strategic direction.',
  photo: '/leader.jpg', visible: true, sortOrder: 1, ...overrides,
})

test('about store manages story settings and story items', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-about-'))
  const file = path.join(dir, 'about.json')
  const store = createAboutStore(file)
  try {
    await store.updateStorySettings({ heading: 'Built step by step.', intro: 'Our story intro.' })
    const created = await store.createStoryItem(storyItem())
    assert.equal(created.id, 'shared-vision')
    let about = await store.getAbout()
    assert.equal(about.story.heading, 'Built step by step.')
    assert.equal(about.story.items.length, 1)
    await store.updateStoryItem(created.id, storyItem({ title: 'One shared vision', visible: false }))
    about = await store.getAbout()
    assert.equal(about.story.items.length, 0)
    about = await store.getAbout({ includeHidden: true })
    assert.equal(about.story.items[0].title, 'One shared vision')
    assert.equal(await store.deleteStoryItem(created.id), true)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('about store manages leadership records and visibility', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-about-'))
  const store = createAboutStore(path.join(dir, 'about.json'))
  try {
    const created = await store.createLeader(leader())
    assert.equal(created.name, 'M. Samim Meyakhail')
    await store.updateLeader(created.id, leader({ role: 'Director', visible: false }))
    assert.equal((await store.getAbout()).leaders.length, 0)
    const hidden = (await store.getAbout({ includeHidden: true })).leaders[0]
    assert.equal(hidden.role, 'Director')
    assert.equal(await store.deleteLeader(created.id), true)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('about store rejects duplicate ids', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-about-'))
  const store = createAboutStore(path.join(dir, 'about.json'))
  try {
    await store.createStoryItem(storyItem())
    await assert.rejects(() => store.createStoryItem(storyItem()), /already exists/i)
    await store.createLeader(leader())
    await assert.rejects(() => store.createLeader(leader()), /already exists/i)
  } finally { await rm(dir, { recursive: true, force: true }) }
})
