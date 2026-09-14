import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function normalizePhone(value: string) {
  const trimmed = value.trim()
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  return `${hasPlus ? '+' : ''}${digits}`
}

export function validatePassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = (await scrypt(password, salt, 64)) as Buffer
  const expected = Buffer.from(hash, 'hex')
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

type SessionPayload = { userId: number; exp?: number }

function encode(value: string) {
  return Buffer.from(value).toString('base64url')
}

function signature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function signSession(payload: { userId: number }, secret: string, ttlSeconds = 60 * 60 * 24 * 7) {
  const body = encode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }))
  return `${body}.${signature(body, secret)}`
}

export function verifySession(token: string, secret: string): SessionPayload | null {
  const [body, suppliedSignature] = token.split('.')
  if (!body || !suppliedSignature) return null
  const expectedSignature = signature(body, secret)
  const a = Buffer.from(suppliedSignature)
  const b = Buffer.from(expectedSignature)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (!parsed.userId || !parsed.exp || parsed.exp <= Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

export function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
      const index = part.indexOf('=')
      return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))]
    }),
  )
}
