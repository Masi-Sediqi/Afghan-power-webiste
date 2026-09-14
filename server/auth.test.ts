import assert from 'node:assert/strict'
import test from 'node:test'
import {
  hashPassword,
  normalizeEmail,
  normalizePhone,
  signSession,
  validatePassword,
  verifyPassword,
  verifySession,
} from './auth.ts'

test('normalizes email and phone', () => {
  assert.equal(normalizeEmail('  User@Example.COM '), 'user@example.com')
  assert.equal(normalizePhone(' +93 700-123-456 '), '+93700123456')
})

test('requires a reasonably strong password', () => {
  assert.equal(validatePassword('short'), false)
  assert.equal(validatePassword('StrongPass1'), true)
})

test('hashes and verifies passwords without storing plaintext', async () => {
  const stored = await hashPassword('StrongPass1')
  assert.notEqual(stored, 'StrongPass1')
  assert.equal(await verifyPassword('StrongPass1', stored), true)
  assert.equal(await verifyPassword('WrongPass1', stored), false)
})

test('rejects a tampered session token', () => {
  const secret = 'a-test-secret-that-is-long-enough'
  const token = signSession({ userId: 42 }, secret, 60)
  assert.equal(verifySession(token, secret)?.userId, 42)
  assert.equal(verifySession(`${token}x`, secret), null)
})
