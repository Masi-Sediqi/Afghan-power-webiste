import http, { type IncomingMessage, type ServerResponse } from 'node:http'
import { URL } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createLocalUser, findUserByEmail, findUserById, findUserByIdentifier, initDb, safeUser, upsertGoogleUser } from './db.js'
import { hashPassword, normalizeEmail, normalizePhone, parseCookies, signSession, validatePassword, verifyPassword, verifySession } from './auth.js'
import { getConfiguredAdmin, verifyAdminCredentials } from './adminCredentials.js'
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct, type ProductInput } from './products.js'
import { createService, deleteService, getService, listServices, updateService, type ServiceInput } from './services.js'
import { createNews, deleteNews, getNews, listNews, updateNews, type NewsInput } from './news.js'
import { createLeader, createStoryItem, deleteLeader, deleteStoryItem, getAbout, updateLeader, updateStoryItem, updateStorySettings, type LeadershipInput, type StoryItemInput, type StorySettingsInput } from './about.js'
import { getContact, getAdminContact, updateContact, type ContactSettings } from './contact.js'
import { createMessage, deleteMessage, listMessages, setMessageStatus, type ContactMessageInput } from './messages.js'
import { normalizeUploadUrls, resolveUploadFile } from './uploads.js'

const port = Number(process.env.PORT || 3001)
const sessionSecret = process.env.SESSION_SECRET || ''
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const isProduction = process.env.NODE_ENV === 'production'

if (sessionSecret.length < 24) throw new Error('SESSION_SECRET must be at least 24 characters')

function send(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  res.end(JSON.stringify(normalizeUploadUrls(body)))
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
  if (!session || session.scope !== 'admin' || session.userId !== 1) return null
  return getConfiguredAdmin()
}


function decodeProductImageUpload(fileName: string, dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) throw new Error('Please upload a PNG, JPG, WEBP or GIF image.')
  const extensionMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' }
  const extension = extensionMap[match[1]]
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'product'
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) throw new Error('Product image must be smaller than 8 MB.')
  return { buffer, fileName: `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}` }
}


function decodeServiceImageUpload(fileName: string, dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) throw new Error('Please upload a PNG, JPG, WEBP or GIF image.')
  const extensionMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' }
  const extension = extensionMap[match[1]]
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'service'
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) throw new Error('Service image must be smaller than 8 MB.')
  return { buffer, fileName: `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}` }
}



function decodeNewsImageUpload(fileName: string, dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) throw new Error('Please upload a PNG, JPG, WEBP or GIF image.')
  const extensionMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' }
  const extension = extensionMap[match[1]]
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'news'
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) throw new Error('News image must be smaller than 8 MB.')
  return { buffer, fileName: `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}` }
}


function decodeLeaderImageUpload(fileName: string, dataUrl: string) {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!match) throw new Error('Please upload a PNG, JPG, WEBP or GIF image.')
  const extensionMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' }
  const extension = extensionMap[match[1]]
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'leader'
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) throw new Error('Leader photo must be smaller than 8 MB.')
  return { buffer, fileName: `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}` }
}

async function requireAdmin(req: IncomingMessage, res: ServerResponse) {
  const admin = await currentAdmin(req)
  if (!admin) {
    send(res, 401, { error: 'Administrator login required.' })
    return null
  }
  return admin
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

  if (req.method === 'GET' || req.method === 'HEAD') {
    const upload = resolveUploadFile(url.pathname)
    if (upload) {
      try {
        const file = await readFile(upload.filePath)
        res.writeHead(200, {
          'Content-Type': upload.contentType,
          'Content-Length': String(file.length),
          'Cache-Control': 'public, max-age=2592000, immutable',
          'X-Content-Type-Options': 'nosniff',
        })
        if (req.method === 'HEAD') return res.end()
        return res.end(file)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return send(res, 404, { error: 'Image not found.' })
        throw error
      }
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true })


  if (req.method === 'GET' && url.pathname === '/api/products') {
    return send(res, 200, { products: await listProducts() })
  }

  const publicProductMatch = /^\/api\/products\/([a-z0-9-]+)$/.exec(url.pathname)
  if (req.method === 'GET' && publicProductMatch) {
    const product = await getProduct(publicProductMatch[1])
    if (!product) return send(res, 404, { error: 'Product not found.' })
    return send(res, 200, { product })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/products') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { products: await listProducts({ includeHidden: true }) })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/products') {
    if (!await requireAdmin(req, res)) return
    try {
      const product = await createProduct(await readJson(req) as ProductInput)
      return send(res, 201, { product })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to create product.' })
    }
  }

  const adminProductMatch = /^\/api\/admin\/products\/([a-z0-9-]+)$/.exec(url.pathname)
  if (adminProductMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    try {
      const product = await updateProduct(adminProductMatch[1], await readJson(req) as ProductInput)
      if (!product) return send(res, 404, { error: 'Product not found.' })
      return send(res, 200, { product })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update product.' })
    }
  }

  if (adminProductMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteProduct(adminProductMatch[1])
    if (!deleted) return send(res, 404, { error: 'Product not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/uploads/product-image') {
    if (!await requireAdmin(req, res)) return
    try {
      const body = await readJson(req) as Record<string, string>
      const decoded = decodeProductImageUpload(body.fileName || 'product', body.dataUrl || '')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, decoded.fileName), decoded.buffer)
      return send(res, 201, { url: `/uploads/products/${decoded.fileName}` })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to upload image.' })
    }
  }



  if (req.method === 'GET' && url.pathname === '/api/services') {
    return send(res, 200, { services: await listServices() })
  }

  const publicServiceMatch = /^\/api\/services\/([a-z0-9-]+)$/.exec(url.pathname)
  if (req.method === 'GET' && publicServiceMatch) {
    const service = await getService(publicServiceMatch[1])
    if (!service) return send(res, 404, { error: 'Service not found.' })
    return send(res, 200, { service })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/services') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { services: await listServices({ includeHidden: true }) })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/services') {
    if (!await requireAdmin(req, res)) return
    try {
      const service = await createService(await readJson(req) as ServiceInput)
      return send(res, 201, { service })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to create service.' })
    }
  }

  const adminServiceMatch = /^\/api\/admin\/services\/([a-z0-9-]+)$/.exec(url.pathname)
  if (adminServiceMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    try {
      const service = await updateService(adminServiceMatch[1], await readJson(req) as ServiceInput)
      if (!service) return send(res, 404, { error: 'Service not found.' })
      return send(res, 200, { service })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update service.' })
    }
  }

  if (adminServiceMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteService(adminServiceMatch[1])
    if (!deleted) return send(res, 404, { error: 'Service not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/uploads/service-image') {
    if (!await requireAdmin(req, res)) return
    try {
      const body = await readJson(req) as Record<string, string>
      const decoded = decodeServiceImageUpload(body.fileName || 'service', body.dataUrl || '')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'services')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, decoded.fileName), decoded.buffer)
      return send(res, 201, { url: `/uploads/services/${decoded.fileName}` })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to upload image.' })
    }
  }



  if (req.method === 'GET' && url.pathname === '/api/news') {
    return send(res, 200, { news: await listNews() })
  }

  const publicNewsMatch = /^\/api\/news\/([a-z0-9-]+)$/.exec(url.pathname)
  if (req.method === 'GET' && publicNewsMatch) {
    const item = await getNews(publicNewsMatch[1])
    if (!item) return send(res, 404, { error: 'News item not found.' })
    return send(res, 200, { news: item })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/news') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { news: await listNews({ includeHidden: true }) })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/news') {
    if (!await requireAdmin(req, res)) return
    try {
      const item = await createNews(await readJson(req) as NewsInput)
      return send(res, 201, { news: item })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to create news item.' })
    }
  }

  const adminNewsMatch = /^\/api\/admin\/news\/([a-z0-9-]+)$/.exec(url.pathname)
  if (adminNewsMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    try {
      const item = await updateNews(adminNewsMatch[1], await readJson(req) as NewsInput)
      if (!item) return send(res, 404, { error: 'News item not found.' })
      return send(res, 200, { news: item })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update news item.' })
    }
  }

  if (adminNewsMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteNews(adminNewsMatch[1])
    if (!deleted) return send(res, 404, { error: 'News item not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/uploads/news-image') {
    if (!await requireAdmin(req, res)) return
    try {
      const body = await readJson(req) as Record<string, string>
      const decoded = decodeNewsImageUpload(body.fileName || 'news', body.dataUrl || '')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'news')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, decoded.fileName), decoded.buffer)
      return send(res, 201, { url: `/uploads/news/${decoded.fileName}` })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to upload image.' })
    }
  }


  if (req.method === 'GET' && url.pathname === '/api/about') {
    return send(res, 200, { about: await getAbout() })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/about') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { about: await getAbout({ includeHidden: true }) })
  }

  if (req.method === 'PUT' && url.pathname === '/api/admin/about/story-settings') {
    if (!await requireAdmin(req, res)) return
    try {
      const story = await updateStorySettings(await readJson(req) as StorySettingsInput)
      return send(res, 200, { story })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update story settings.' })
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/about/story-items') {
    if (!await requireAdmin(req, res)) return
    try {
      const item = await createStoryItem(await readJson(req) as StoryItemInput)
      return send(res, 201, { item })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to create story item.' })
    }
  }

  const storyItemMatch = /^\/api\/admin\/about\/story-items\/([a-z0-9-]+)$/.exec(url.pathname)
  if (storyItemMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    try {
      const item = await updateStoryItem(storyItemMatch[1], await readJson(req) as StoryItemInput)
      if (!item) return send(res, 404, { error: 'Story item not found.' })
      return send(res, 200, { item })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update story item.' })
    }
  }
  if (storyItemMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteStoryItem(storyItemMatch[1])
    if (!deleted) return send(res, 404, { error: 'Story item not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/about/leaders') {
    if (!await requireAdmin(req, res)) return
    try {
      const leader = await createLeader(await readJson(req) as LeadershipInput)
      return send(res, 201, { leader })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to create leader.' })
    }
  }

  const leaderMatch = /^\/api\/admin\/about\/leaders\/([a-z0-9-]+)$/.exec(url.pathname)
  if (leaderMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    try {
      const leader = await updateLeader(leaderMatch[1], await readJson(req) as LeadershipInput)
      if (!leader) return send(res, 404, { error: 'Leader not found.' })
      return send(res, 200, { leader })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update leader.' })
    }
  }
  if (leaderMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteLeader(leaderMatch[1])
    if (!deleted) return send(res, 404, { error: 'Leader not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/uploads/leader-image') {
    if (!await requireAdmin(req, res)) return
    try {
      const body = await readJson(req) as Record<string, string>
      const decoded = decodeLeaderImageUpload(body.fileName || 'leader', body.dataUrl || '')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'leaders')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, decoded.fileName), decoded.buffer)
      return send(res, 201, { url: `/uploads/leaders/${decoded.fileName}` })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to upload leader photo.' })
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/contact') {
    return send(res, 200, { contact: await getContact() })
  }

  if (req.method === 'POST' && url.pathname === '/api/contact/messages') {
    try {
      const message = await createMessage(await readJson(req) as ContactMessageInput)
      return send(res, 201, { message })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to send message.' })
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/contact') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { contact: await getAdminContact() })
  }

  if (req.method === 'PUT' && url.pathname === '/api/admin/contact') {
    if (!await requireAdmin(req, res)) return
    try {
      const contact = await updateContact(await readJson(req) as ContactSettings)
      return send(res, 200, { contact })
    } catch (error) {
      return send(res, 400, { error: error instanceof Error ? error.message : 'Unable to update contact settings.' })
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/messages') {
    if (!await requireAdmin(req, res)) return
    return send(res, 200, { messages: await listMessages() })
  }

  const adminMessageMatch = /^\/api\/admin\/messages\/([a-f0-9-]+)$/.exec(url.pathname)
  if (adminMessageMatch && req.method === 'PUT') {
    if (!await requireAdmin(req, res)) return
    const body = await readJson(req) as { status?: 'new' | 'read' }
    if (body.status !== 'new' && body.status !== 'read') return send(res, 400, { error: 'Invalid message status.' })
    const message = await setMessageStatus(adminMessageMatch[1], body.status)
    if (!message) return send(res, 404, { error: 'Message not found.' })
    return send(res, 200, { message })
  }
  if (adminMessageMatch && req.method === 'DELETE') {
    if (!await requireAdmin(req, res)) return
    const deleted = await deleteMessage(adminMessageMatch[1])
    if (!deleted) return send(res, 404, { error: 'Message not found.' })
    return send(res, 200, { ok: true })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/setup-status') {
    getConfiguredAdmin()
    return send(res, 200, { configured: true })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/setup') {
    return send(res, 410, { error: 'Admin setup is disabled. Use the configured admin account.' })
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/login') {
    const body = await readJson(req) as Record<string, string>
    const email = body.email || ''
    const password = body.password || ''
    if (!verifyAdminCredentials(email, password)) {
      return send(res, 401, { error: 'Admin email or password is incorrect.' })
    }
    const admin = getConfiguredAdmin()
    const token = signSession({ userId: admin.id, scope: 'admin' }, sessionSecret, 60 * 60 * 12)
    return send(res, 200, { admin }, { 'Set-Cookie': adminSessionCookie(token) })
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/me') {
    const admin = await currentAdmin(req)
    return send(res, 200, { admin })
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

try {
  await initDb()
} catch (error) {
  console.warn('Database is unavailable. Public authentication will remain unavailable until PostgreSQL is configured.')
  if (!isProduction) console.warn(error)
}

http.createServer((req, res) => {
  route(req, res).catch((error) => {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Unexpected server error'
    send(res, 500, { error: isProduction ? 'Something went wrong. Please try again.' : message })
  })
}).listen(port, '127.0.0.1', () => {
  console.log(`Afghan Power auth API listening on http://127.0.0.1:${port}`)
})
