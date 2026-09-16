import http, { type IncomingMessage, type ServerResponse } from 'node:http'
import { URL } from 'node:url'
import { adminCount, createInitialAdmin, createLocalUser, findAdminByEmail, findAdminById, findUserByEmail, findUserById, findUserByIdentifier, initDb, safeAdmin, safeUser, upsertGoogleUser } from './db.js'
import { hashPassword, normalizeEmail, normalizePhone, parseCookies, signSession, validatePassword, verifyPassword, verifySession } from './auth.js'

const port = Number(process.env.PORT || 3001)
const sessionSecret = process.env.SESSION_SECRET || ''
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const isProduction = process.env.NODE_ENV === 'production'

if (sessionSecret.length < 24) throw new Error('SESSION_SECRET must be at least 24 characters')

function send(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  res.end(JSON.stringify(body))
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function sessionCookie(token: string) {
  return `ap_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${isProduction ? '; Secure' : ''}`
}

function clearCookie() {
  return `ap_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}`
}


function adminSessionCookie(token: string) {
  return `ap_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`
}

function clearAdminCookie() {
  return `ap_admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isProduction ? '; Secure' : ''}`
}

async function currentUser(req: IncomingMessage) {
  const token = parseCookies(req.headers.cookie).ap_session
  if (!token) return null
  const session = verifySession(token, sessionSecret)
  if (!session) return null
  return findUserById(session.userId)
}


async function currentAdmin(req: IncomingMessage) {
  const token = parseCookies(req.headers.cookie).ap_admin_session
  if (!token) return null
  const session = verifySession(token, sessionSecret)
  if (!session || session.scope !== 'admin') return null
  return findAdminById(session.userId)
}

async function handleGoogleCredential(credential: string) {
  if (!googleClientId) throw new Error('Google sign-in is not configured')
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
  if (!response.ok) throw new Error('Google token verification failed')
  const profile = await response.json() as Record<string, string>
  if (profile.aud !== googleClientId || profile.email_verified !== 'true' || !profile.sub || !profile.email) {
    throw new Error('Invalid Google identity')
  }
  return upsertGoogleUser({
    name: profile.name || profile.email.split('@')[0],
    email: normalizeEmail(profile.email),
    googleSub: profile.sub,
    avatarUrl: profile.picture || null,
  })
}

async function route(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost')
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true })

  if (req.method === 'GET' && url.pathname === '/api/admin/setup-status') {
    const configured = (await adminCount()) > 0
    return send(res, 200, { configured })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/setup') {
    if ((await adminCount()) > 0) return send(res, 409, { error: 'Admin setup is already complete.' })
    const body = await readJson(req) as Record<string, string>
    const email = normalizeEmail(body.email || '')
    const password = body.password || ''
    if (!/^\S+@\S+\.\S+$/.test(email)) return send(res, 400, { error: 'Please enter a valid admin email.' })
    if (!validatePassword(password)) return send(res, 400, { error: 'Password must be at least 8 characters and include a letter and number.' })
    const admin = await createInitialAdmin({ email, passwordHash: await hashPassword(password) })
    if (!admin) return send(res, 409, { error: 'Admin setup is already complete.' })
    const token = signSession({ userId: admin.id, scope: 'admin' }, sessionSecret, 60 * 60 * 12)
    return send(res, 201, { admin: safeAdmin(admin) }, { 'Set-Cookie': adminSessionCookie(token) })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/login') {
    const body = await readJson(req) as Record<string, string>
    const email = normalizeEmail(body.email || '')
    const password = body.password || ''
    const admin = await findAdminByEmail(email)
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return send(res, 401, { error: 'Admin email or password is incorrect.' })
    }
    const token = signSession({ userId: admin.id, scope: 'admin' }, sessionSecret, 60 * 60 * 12)
    return send(res, 200, { admin: safeAdmin(admin) }, { 'Set-Cookie': adminSessionCookie(token) })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/me') {
    const admin = await currentAdmin(req)
    return send(res, 200, { admin: admin ? safeAdmin(admin) : null })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
    return send(res, 200, { ok: true }, { 'Set-Cookie': clearAdminCookie() })
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const user = await currentUser(req)
    return send(res, 200, { user: user ? safeUser(user) : null })
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    return send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() })
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
    const body = await readJson(req) as Record<string, string>
    const name = (body.name || '').trim()
    const phone = normalizePhone(body.phone || '')
    const email = normalizeEmail(body.email || '')
    const password = body.password || ''
    if (name.length < 2) return send(res, 400, { error: 'Please enter your full name.' })
    if (!phone || phone.replace(/\D/g, '').length < 7) return send(res, 400, { error: 'Please enter a valid phone number.' })
    if (!/^\S+@\S+\.\S+$/.test(email)) return send(res, 400, { error: 'Please enter a valid email address.' })
    if (!validatePassword(password)) return send(res, 400, { error: 'Password must be at least 8 characters and include a letter and number.' })
    if (await findUserByEmail(email)) return send(res, 409, { error: 'An account with this email already exists.' })
    if (await findUserByIdentifier(phone)) return send(res, 409, { error: 'An account with this phone number already exists.' })
    const user = await createLocalUser({ name, phone, email, passwordHash: await hashPassword(password) })
    const token = signSession({ userId: user.id }, sessionSecret)
    return send(res, 201, { user: safeUser(user) }, { 'Set-Cookie': sessionCookie(token) })
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJson(req) as Record<string, string>
    const rawIdentifier = (body.identifier || '').trim()
    const identifier = rawIdentifier.includes('@') ? normalizeEmail(rawIdentifier) : normalizePhone(rawIdentifier)
    const password = body.password || ''
    const user = await findUserByIdentifier(identifier)
    if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return send(res, 401, { error: 'Email/phone or password is incorrect.' })
    }
    const token = signSession({ userId: user.id }, sessionSecret)
    return send(res, 200, { user: safeUser(user) }, { 'Set-Cookie': sessionCookie(token) })
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/google') {
    const body = await readJson(req) as Record<string, string>
    if (!body.credential) return send(res, 400, { error: 'Google credential is required.' })
    const user = await handleGoogleCredential(body.credential)
    const token = signSession({ userId: user.id }, sessionSecret)
    return send(res, 200, { user: safeUser(user) }, { 'Set-Cookie': sessionCookie(token) })
  }

  return send(res, 404, { error: 'Not found' })
}

await initDb()
http.createServer((req, res) => {
  route(req, res).catch((error) => {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Unexpected server error'
    send(res, 500, { error: isProduction ? 'Something went wrong. Please try again.' : message })
  })
}).listen(port, '127.0.0.1', () => {
  console.log(`Afghan Power auth API listening on http://127.0.0.1:${port}`)
})
