import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createNewsStore, type NewsInput } from './news.js'

const sample = (overrides: Partial<NewsInput> = {}): NewsInput => ({
  id: 'new-tech-release',
  title: 'New technology release',
  category: 'technology',
  date: '2026-09-16',
  readTime: '3 min read',
  featured: true,
  visible: true,
  sortOrder: 1,
  image: '/sample.jpg',
  summary: 'A concise update about a new Afghan Power technology release.',
  ...overrides,
})

test('news store creates, updates, hides and deletes records', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-news-'))
  const file = path.join(dir, 'news.json')
  const store = createNewsStore(file)
  try {
    const created = await store.createNews(sample())
    assert.equal(created.id, 'new-tech-release')
    assert.equal((await store.listNews()).length, 1)
    const updated = await store.updateNews(created.id, sample({ title: 'Updated technology release', visible: false }))
    assert.equal(updated?.title, 'Updated technology release')
    assert.equal((await store.listNews()).length, 0)
    assert.equal((await store.listNews({ includeHidden: true })).length, 1)
    assert.equal(await store.deleteNews(created.id), true)
    assert.equal((await store.listNews({ includeHidden: true })).length, 0)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('news store sorts by sort order and rejects duplicate ids', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-news-'))
  const store = createNewsStore(path.join(dir, 'news.json'))
  try {
    await store.createNews(sample({ id: 'second', title: 'Second', sortOrder: 2 }))
    await store.createNews(sample({ id: 'first', title: 'First', sortOrder: 1 }))
    assert.deepEqual((await store.listNews()).map((item) => item.id), ['first', 'second'])
    await assert.rejects(() => store.createNews(sample({ id: 'first' })), /already exists/i)
  } finally { await rm(dir, { recursive: true, force: true }) }
})
