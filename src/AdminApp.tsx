import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  Box,
  Clock,
  FileText,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  Phone,
  Search,
  Settings2,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react'
import { adminApi, type AdminUser } from './adminApi'

type AdminSection = 'dashboard' | 'products' | 'services' | 'news' | 'about' | 'contact' | 'messages'

const navigation: Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'about', label: 'About', icon: Info },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'messages', label: 'Messages & Requests', icon: MessageSquare },
]

const sectionCopy: Record<Exclude<AdminSection, 'dashboard'>, { title: string; text: string; hint: string; icon: typeof Package }> = {
  products: {
    title: 'Products Management',
    text: 'Manage the selected product content that will later appear on the public Products page.',
    hint: 'Next phase: connect chosen product cards, details, images and visibility.',
    icon: Package,
  },
  services: {
    title: 'Services Management',
    text: 'Prepare the service content that will later be connected to the public Services page.',
    hint: 'Next phase: make only the service blocks you choose editable.',
    icon: Wrench,
  },
  news: {
    title: 'News Management',
    text: 'This section is reserved for publishing and managing selected news items.',
    hint: 'Next phase: create, edit, publish and archive website news.',
    icon: Newspaper,
  },
  about: {
    title: 'About Management',
    text: 'Control selected About page content without making the whole page dynamic.',
    hint: 'Next phase: choose which About blocks should be editable.',
    icon: Info,
  },
  contact: {
    title: 'Contact Management',
    text: 'Manage selected office contact details, map information and contact content.',
    hint: 'Next phase: connect only the contact information you want to change from admin.',
    icon: Phone,
  },
  messages: {
    title: 'Messages & Requests',
    text: 'Customer contact messages, product requests and service inquiries will be collected here.',
    hint: 'Next phase: connect website forms and requests to this inbox.',
    icon: MessageSquare,
  },
}

function AdminBrand() {
  return (
    <div className="admin-brand">
      <img src="/afghan-power-logo-transparent.png" alt="Afghan Power Group" />
      <div>
        <strong>AFGHAN POWER</strong>
        <span>Management Information System</span>
      </div>
    </div>
  )
}

function AuthScreen({ configured, onReady }: { configured: boolean; onReady: (admin: AdminUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!configured && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const result = configured
        ? await adminApi.login({ email: email.trim(), password })
        : await adminApi.setup({ email: email.trim(), password })
      onReady(result.admin)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-glow admin-auth-glow-one" />
      <div className="admin-auth-glow admin-auth-glow-two" />
      <section className="admin-auth-card">
        <AdminBrand />
        <div className="admin-auth-badge"><ShieldCheck size={15} /> {configured ? 'SECURE ADMIN LOGIN' : 'INITIAL ADMIN SETUP'}</div>
        <h1>{configured ? 'Welcome back.' : 'Create the first administrator.'}</h1>
        <p>{configured
          ? 'Enter the administrator email and password to access the Afghan Power MIS.'
          : 'No default credentials exist. Set the administrator email and password now; setup will close after the first account is created.'}
        </p>

        <form onSubmit={submit} className="admin-auth-form">
          <label>
            <span>Admin Email</span>
            <div className="admin-input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@afghanpower.com" autoComplete="email" required /></div>
          </label>
          <label>
            <span>Password</span>
            <div className="admin-input-wrap"><ShieldCheck size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" autoComplete={configured ? 'current-password' : 'new-password'} required /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          </label>
          {!configured && (
            <label>
              <span>Confirm Password</span>
              <div className="admin-input-wrap"><ShieldCheck size={18} /><input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat password" autoComplete="new-password" required /></div>
            </label>
          )}
          {error && <div className="admin-auth-error">{error}</div>}
          <button className="admin-auth-submit" disabled={loading}>{loading ? 'Please wait…' : configured ? 'Sign in to Admin' : 'Create Admin & Continue'} <ArrowUpRight size={18} /></button>
        </form>
        <div className="admin-auth-foot"><ShieldCheck size={15} /> Protected administrator area · Afghan Power Group</div>
      </section>
    </main>
  )
}

function Dashboard() {
  const stats = [
    { label: 'Management Modules', value: '7', icon: Box, note: 'Admin sections ready' },
    { label: 'Content Areas', value: '5', icon: FileText, note: 'Ready for selective dynamic content' },
    { label: 'Messages & Requests', value: '0', icon: MessageSquare, note: 'Will connect next' },
    { label: 'System Status', value: 'Ready', icon: ShieldCheck, note: 'MIS shell active' },
  ]
  return (
    <div className="admin-dashboard-view">
      <div className="admin-page-heading">
        <div><span>OVERVIEW</span><h1>Dashboard</h1><p>Your central management space for Afghan Power Group website content and customer requests.</p></div>
        <div className="admin-date-chip"><Clock size={16} /> {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date())}</div>
      </div>
      <div className="admin-stat-grid">
        {stats.map((item) => <article className="admin-stat-card" key={item.label}><div className="admin-stat-icon"><item.icon size={20} /></div><div><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></div></article>)}
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel-card admin-quick-card">
          <div className="admin-card-head"><div><span>QUICK ACCESS</span><h2>Manage website areas</h2></div><Settings2 size={20}/></div>
          <div className="admin-quick-list">
            {navigation.slice(1, 6).map((item) => <div key={item.id}><span className="admin-mini-icon"><item.icon size={17}/></span><div><strong>{item.label}</strong><small>Static shell ready for the next dynamic phase.</small></div><ArrowUpRight size={17}/></div>)}
          </div>
        </section>
        <section className="admin-panel-card">
          <div className="admin-card-head"><div><span>WORKFLOW</span><h2>Next steps</h2></div><Clock size={20}/></div>
          <div className="admin-timeline">
            <div className="is-current"><i>1</i><div><strong>Admin MIS foundation</strong><small>Secure setup, login and management shell.</small></div></div>
            <div><i>2</i><div><strong>Select dynamic blocks</strong><small>Choose one or more blocks from each public page.</small></div></div>
            <div><i>3</i><div><strong>Connect customer requests</strong><small>Send forms and inquiries into Messages & Requests.</small></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionPlaceholder({ section }: { section: Exclude<AdminSection, 'dashboard'> }) {
  const data = sectionCopy[section]
  const Icon = data.icon
  return (
    <div className="admin-module-view">
      <div className="admin-page-heading"><div><span>MANAGEMENT MODULE</span><h1>{data.title}</h1><p>{data.text}</p></div></div>
      <section className="admin-module-empty">
        <div className="admin-module-emblem"><Icon size={30}/></div>
        <span>PHASE 1 · STATIC MIS</span>
        <h2>{data.title} is ready.</h2>
        <p>{data.hint}</p>
        <div className="admin-module-note"><ShieldCheck size={17}/> No public content is changed from this panel yet.</div>
      </section>
    </div>
  )
}

function MisShell({ admin, onLogout }: { admin: AdminUser; onLogout: () => Promise<void> }) {
  const initialSection = useMemo<AdminSection>(() => {
    const value = new URLSearchParams(window.location.search).get('section') as AdminSection | null
    return navigation.some((item) => item.id === value) ? value! : 'dashboard'
  }, [])
  const [section, setSection] = useState<AdminSection>(initialSection)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const changeSection = (next: AdminSection) => {
    setSection(next)
    setSidebarOpen(false)
    const url = new URL(window.location.href)
    if (next === 'dashboard') url.searchParams.delete('section')
    else url.searchParams.set('section', next)
    window.history.replaceState({}, '', `${url.pathname}${url.search}`)
  }

  return (
    <main className="admin-mis-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-head"><AdminBrand /><button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={20}/></button></div>
        <div className="admin-sidebar-label">MANAGEMENT</div>
        <nav className="admin-sidebar-nav">
          {navigation.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => changeSection(item.id)}><item.icon size={19}/><span>{item.label}</span>{section === item.id && <i/>}</button>)}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-chip"><div>{admin.email.slice(0,1).toUpperCase()}</div><span><strong>Administrator</strong><small>{admin.email}</small></span></div>
          <button className="admin-logout-button" onClick={onLogout}><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {sidebarOpen && <button className="admin-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"/>}

      <section className="admin-main-area">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21}/></button>
          <div className="admin-search"><Search size={17}/><input placeholder="Search admin panel…" aria-label="Search admin panel"/></div>
          <div className="admin-top-actions"><button aria-label="Notifications"><Bell size={19}/><i/></button><a href="/" className="admin-view-site">View Website <ArrowUpRight size={16}/></a></div>
        </header>
        <div className="admin-content-area">
          {section === 'dashboard' ? <Dashboard /> : <SectionPlaceholder section={section} />}
        </div>
      </section>
    </main>
  )
}

export default function AdminApp() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [fatalError, setFatalError] = useState('')

  useEffect(() => {
    let active = true
    const boot = async () => {
      try {
        const status = await adminApi.setupStatus()
        if (!active) return
        setConfigured(status.configured)
        if (status.configured) {
          const session = await adminApi.me()
          if (active) setAdmin(session.admin)
        }
      } catch (error) {
        if (active) setFatalError(error instanceof Error ? error.message : 'Unable to connect to the admin API.')
      }
    }
    boot()
    return () => { active = false }
  }, [])

  const logout = async () => {
    try { await adminApi.logout() } finally { setAdmin(null); setConfigured(true) }
  }

  if (fatalError) return <main className="admin-boot-state"><ShieldCheck size={34}/><h1>Admin API unavailable</h1><p>{fatalError}</p><button onClick={() => window.location.reload()}>Try again</button></main>
  if (configured === null) return <main className="admin-boot-state"><div className="admin-loader"/><p>Preparing Afghan Power MIS…</p></main>
  if (!admin) return <AuthScreen configured={configured} onReady={(value) => { setAdmin(value); setConfigured(true) }} />
  return <MisShell admin={admin} onLogout={logout} />
}
