import path from 'node:path'

const uploadPrefix = '/api/uploads/'
const legacyUploadPrefix = '/uploads/'

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export function normalizeUploadUrl(value: string) {
  return value.startsWith(legacyUploadPrefix) ? `${uploadPrefix}${value.slice(legacyUploadPrefix.length)}` : value
}

export function normalizeUploadUrls(value: unknown): unknown {
  if (typeof value === 'string') return normalizeUploadUrl(value)
  if (Array.isArray(value)) return value.map(normalizeUploadUrls)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeUploadUrls(item)]))
  }
  return value
}

export function resolveUploadFile(pathname: string, uploadRoot = path.join(process.cwd(), 'public', 'uploads')) {
  const relativeUrl = pathname.startsWith(uploadPrefix)
    ? pathname.slice(uploadPrefix.length)
    : pathname.startsWith(legacyUploadPrefix)
      ? pathname.slice(legacyUploadPrefix.length)
      : ''

  if (!relativeUrl) return null

  let decoded: string
  try {
    decoded = decodeURIComponent(relativeUrl)
  } catch {
    return null
  }

  if (!decoded || decoded.includes('\0') || decoded.split('/').some((part) => part === '..')) return null

  const root = path.resolve(uploadRoot)
  const filePath = path.resolve(root, decoded)
  if (filePath === root || !filePath.startsWith(`${root}${path.sep}`)) return null

  const extension = path.extname(filePath).toLowerCase()
  const contentType = mimeTypes[extension]
  if (!contentType) return null

  return { filePath, contentType }
}
