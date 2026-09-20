import { timingSafeEqual } from 'node:crypto'
import { normalizeEmail } from './auth.js'

export type ConfiguredAdmin = {
  id: number
  email: string
  createdAt: string
}

type AdminEnv = NodeJS.ProcessEnv & {
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD?: string
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function getConfiguredAdmin(env: AdminEnv = process.env) : ConfiguredAdmin {
  const email = normalizeEmail(env.ADMIN_EMAIL || '')
  const password = env.ADMIN_PASSWORD || ''

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('ADMIN_EMAIL must be a valid email address')
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters')
  }

  return {
    id: 1,
    email,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

export function verifyAdminCredentials(email: string, password: string, env: AdminEnv = process.env) {
  const admin = getConfiguredAdmin(env)
  const expectedPassword = env.ADMIN_PASSWORD || ''
  return safeEqual(normalizeEmail(email), admin.email) && safeEqual(password, expectedPassword)
}
