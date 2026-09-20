import { useEffect, useState } from 'react'
import { getSavedLanguage, type LangCode } from './i18n'

export function useSiteLanguage() {
  const [language, setLanguage] = useState<LangCode>(() => getSavedLanguage())
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<LangCode>).detail
      setLanguage(detail === 'fa' || detail === 'ps' ? detail : 'en')
    }
    window.addEventListener('apg-language-change', handler)
    return () => window.removeEventListener('apg-language-change', handler)
  }, [])
  return language
}
