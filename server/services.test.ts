import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createServiceStore, type ServiceInput } from './services.js'

const sample = (overrides: Partial<ServiceInput> = {}): ServiceInput => ({
  id: 'web-development', category: 'technology', title: 'Website Development',
  description: 'Modern websites for growing businesses.', image: '/sample.jpg', featured: true,
  visible: true, sortOrder: 1, actionLabel: 'Learn more', actionHref: '#/contact', ...overrides,
})

test('service store creates, updates and deletes records', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-services-'))
  const file = path.join(dir, 'services.json')
  const store = createServiceStore(file)
  try {
    const created = await store.createService(sample())
    assert.equal(created.id, 'web-development')
    assert.equal((await store.listServices()).length, 1)
    const updated = await store.updateService(created.id, sample({ title: 'Custom Website Development', visible: false }))
    assert.equal(updated?.title, 'Custom Website Development')
    assert.equal((await store.listServices()).length, 0)
    assert.equal((await store.listServices({ includeHidden: true })).length, 1)
    assert.equal(await store.deleteService(created.id), true)
    assert.equal((await store.listServices({ includeHidden: true })).length, 0)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('service store rejects duplicate ids', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apg-services-'))
  const store = createServiceStore(path.join(dir, 'services.json'))
  try {
    await store.createService(sample())
    await assert.rejects(() => store.createService(sample()), /already exists/i)
  } finally { await rm(dir, { recursive: true, force: true }) }
})
