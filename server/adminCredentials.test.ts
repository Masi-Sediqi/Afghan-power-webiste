import assert from 'node:assert/strict'
import test from 'node:test'
import { getConfiguredAdmin, verifyAdminCredentials } from './adminCredentials.ts'

test('loads a fixed admin account from environment values', () => {
  const admin = getConfiguredAdmin({
    ADMIN_EMAIL: ' Admin@AfghanPower.com ',
    ADMIN_PASSWORD: 'AfghanPower2026',
  })

  assert.equal(admin.email, 'admin@afghanpower.com')
  assert.equal(admin.id, 1)
})

test('accepts only the configured email and password', () => {
  const env = {
    ADMIN_EMAIL: 'admin@afghanpower.com',
    ADMIN_PASSWORD: 'AfghanPower2026',
  }

  assert.equal(verifyAdminCredentials('ADMIN@AFGHANPOWER.COM', 'AfghanPower2026', env), true)
  assert.equal(verifyAdminCredentials('admin@afghanpower.com', 'WrongPassword1', env), false)
  assert.equal(verifyAdminCredentials('other@afghanpower.com', 'AfghanPower2026', env), false)
})
