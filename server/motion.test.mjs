import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const read = (path) => readFileSync(resolve(root, path), 'utf8')

test('async public content is wired to motion classes and reveal refresh', () => {
  const app = read('src/App.tsx')
  const products = read('src/Products.tsx')
  const services = read('src/Services.tsx')
  const news = read('src/News.tsx')
  const css = read('src/index.css')

  assert.match(app, /MutationObserver/)
  assert.match(app, /data-reveal-bound/)
  assert.match(products, /content-enter/)
  assert.match(services, /content-enter/)
  assert.match(news, /content-enter/)
  assert.match(css, /@keyframes content-enter/)
  assert.match(css, /\.content-enter/)
  assert.match(css, /prefers-reduced-motion/)
})
