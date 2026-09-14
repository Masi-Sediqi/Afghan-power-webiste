import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Check, Languages, Moon, Search, Sun, Trash2, X } from 'lucide-react'

type LangCode = 'en' | 'fa' | 'ps'

type Props = {
  onLanguageChange?: (lang: LangCode) => void
}

const languages: { code: LangCode; label: string; native: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', native: 'EN', dir: 'ltr' },
  { code: 'fa', label: 'Dari', native: 'دری', dir: 'rtl' },
  { code: 'ps', label: 'Pashto', native: 'پښتو', dir: 'rtl' },
]

const searchItems = [
  { title: 'Educational Consultancy', meta: 'Admissions · Scholarships · Student visas', href: '#services' },
  { title: 'Travel Agency', meta: 'Tourist visas · Tickets · Travel services', href: '#services' },
  { title: 'Tech Development', meta: 'ERP · Databases · Websites · Apps', href: '#solutions' },
  { title: 'Media Production', meta: 'Video · Design · Advertising · Digital marketing', href: '#services' },
]

export default function HeaderTools({ onLanguageChange }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const [languageOpen, setLanguageOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [language, setLanguage] = useState<LangCode>('en')
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!searchOpen) return
    const id = window.setTimeout(() => searchInput.current?.focus(), 80)
    return () => window.clearTimeout(id)
  }, [searchOpen])

  useEffect(() => {
    document.body.classList.toggle('search-modal-open', searchOpen)
    return () => document.body.classList.remove('search-modal-open')
  }, [searchOpen])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setLanguageOpen(false)
        setNotificationsOpen(false)
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return searchItems
    return searchItems.filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalized))
  }, [query])

  const chooseLanguage = (code: LangCode) => {
    const selected = languages.find((item) => item.code === code)!
    setLanguage(code)
    setLanguageOpen(false)
    document.documentElement.lang = code
    document.documentElement.dir = selected.dir
    document.documentElement.dataset.language = code
    onLanguageChange?.(code)
  }

  const languageBadge = language === 'fa' ? 'D' : language.toUpperCase()

  return (
    <>
      <div className="header-tools" aria-label="Website tools">
        <button className="tool-button search-tool" onClick={() => setSearchOpen(true)} aria-label="Search website" title="Search">
          <Search size={18} strokeWidth={2.1} />
          <span className="tool-shine" />
        </button>

        <button
          className="tool-button theme-tool"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          <span className="theme-icon-swap">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</span>
          <span className="tool-shine" />
        </button>

        <div className="language-tool-wrap">
          <button
            className={`tool-button language-tool ${languageOpen ? 'is-open' : ''}`}
            onClick={() => {
              setNotificationsOpen(false)
              setLanguageOpen((value) => !value)
            }}
            aria-label="Change language"
            title="Language"
          >
            <Languages size={18} strokeWidth={2} />
            <span className="language-badge">{languageBadge}</span>
            <span className="tool-shine" />
          </button>
          {languageOpen && (
            <div className="language-popover">
              <div className="popover-heading">
                <span>Language</span>
                <small>Choose interface language</small>
              </div>
              {languages.map((item) => (
                <button key={item.code} className={language === item.code ? 'active' : ''} onClick={() => chooseLanguage(item.code)}>
                  <span className="language-mark">{item.native}</span>
                  <span><strong>{item.label}</strong><small>{item.dir === 'rtl' ? 'Right to left' : 'Left to right'}</small></span>
                  {language === item.code && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="notification-tool-wrap">
          <button
            className={`tool-button notification-tool ${notificationsOpen ? 'is-open' : ''}`}
            onClick={() => {
              setLanguageOpen(false)
              setNotificationsOpen((value) => !value)
            }}
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            title="Notifications"
          >
            <Bell size={18} strokeWidth={2.1} />
            <span className="tool-shine" />
          </button>
          {notificationsOpen && (
            <div className="notification-popover" role="dialog" aria-label="Notifications">
              <div className="notification-popover-head">
                <strong>Notifications</strong>
                <div>
                  <button type="button" aria-label="Mark all as read" title="Mark all as read"><Check size={14} /></button>
                  <button type="button" aria-label="Clear notifications" title="Clear notifications"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="notification-empty">No notifications right now.</div>
            </div>
          )}
        </div>
      </div>

      {searchOpen && createPortal(
        <div className="search-overlay" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <div className="search-dialog" role="dialog" aria-modal="true" aria-label="Search Afghan Power Group">
            <div className="search-dialog-top">
              <div className="search-field-wrap">
                <Search size={21} />
                <input
                  ref={searchInput}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Afghan Power Group..."
                  aria-label="Search"
                />
                <kbd>ESC</kbd>
              </div>
              <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
            </div>
            <div className="search-results-label">QUICK DISCOVERY</div>
            <div className="search-results">
              {filtered.map((item, index) => (
                <a key={item.title} href={item.href} onClick={() => setSearchOpen(false)}>
                  <span className="result-index">0{index + 1}</span>
                  <span className="result-copy"><strong>{item.title}</strong><small>{item.meta}</small></span>
                  <span className="result-arrow">↗</span>
                </a>
              ))}
              {filtered.length === 0 && <div className="search-empty">No matching service yet.</div>}
            </div>
            <div className="search-footer"><span>Static search preview</span><span>⌘ / Ctrl + K</span></div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
