import type { LangCode } from './i18n'

export type LocalizedFields<T> = {
  fa?: Partial<T>
  ps?: Partial<T>
}

export function localizedValue<T extends Record<string, any>>(base: T, translations: LocalizedFields<T> | undefined, lang: LangCode): T {
  if (lang === 'en') return base
  const translated = translations?.[lang]
  if (!translated) return base
  const result: Record<string, any> = { ...base }
  for (const [key, value] of Object.entries(translated)) {
    if (Array.isArray(value)) {
      if (value.length) result[key] = value
    } else if (typeof value === 'string') {
      if (value.trim()) result[key] = value
    } else if (value !== undefined && value !== null) {
      result[key] = value
    }
  }
  return result as T
}
