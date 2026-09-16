import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createProductStore, type ProductInput } from './products.js'

const baseProduct: ProductInput = {
  id: 'smart-gold',
  category: 'technology',
  title: 'Smart Gold',
  subtitle: 'Gold & Jewelry Management',
  description: 'Business management system.',
  images: ['/uploads/products/smart-gold.jpg'],
  features: ['Inventory'],
  badge: 'Ready System',
  priceLabel: 'Request a Quote',
  visible: true,
  sortOrder: 10,
  details: [{ label: 'Industry', value: 'Gold & jewelry' }],
  sectionTitle: 'About this product',
  sectionBody: 'Detailed description.',
  recommendedTitle: 'Recommended for',
  recommendedFor: ['Gold shops'],
  requirementsTitle: 'Included modules',
  requirements: ['Inventory'],
  actionLabel: 'Request a Consultation',
  secondaryLabel: '',
  secondaryHref: '',
}

async function withStore(run: (store: ReturnType<typeof createProductStore>) => Promise<void>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'ap-products-'))
  const file = path.join(dir, 'products.json')
  try {
    await run(createProductStore(file))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('product store creates, lists, updates, and deletes products', async () => {
  await withStore(async (store) => {
    const created = await store.createProduct(baseProduct)
    assert.equal(created.id, 'smart-gold')
    assert.equal((await store.listProducts({ includeHidden: true })).length, 1)

    const updated = await store.updateProduct('smart-gold', { ...baseProduct, title: 'Smart Gold ERP', visible: false })
    assert.equal(updated?.title, 'Smart Gold ERP')
    assert.equal((await store.listProducts()).length, 0)
    assert.equal((await store.listProducts({ includeHidden: true })).length, 1)

    assert.equal(await store.deleteProduct('smart-gold'), true)
    assert.equal(await store.getProduct('smart-gold', { includeHidden: true }), null)
  })
})

test('product store rejects duplicate ids and invalid products', async () => {
  await withStore(async (store) => {
    await store.createProduct(baseProduct)
    await assert.rejects(() => store.createProduct(baseProduct), /already exists/i)
    await assert.rejects(
      () => store.createProduct({ ...baseProduct, id: 'Bad ID', title: '' }),
      /valid product id|title/i,
    )
  })
})
