import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
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
import type { ProductCategory, ProductRecord } from './productsApi'
import type { ServiceCategory, ServiceRecord } from './servicesApi'
import type { NewsCategory, NewsRecord } from './newsApi'
import type { AboutData, LeadershipRecord, StoryItemRecord } from './aboutApi'
import type { ContactMessageRecord, ContactSettings } from './contactApi'

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
    text: 'Create, edit, publish, hide and remove news shown on the public News page.',
    hint: 'News is connected to the public website and dashboard.',
    icon: Newspaper,
  },
  about: {
    title: 'About Management',
    text: 'Manage the Our Story timeline and Leadership team shown on the public About page.',
    hint: 'Story and leadership are connected to the public website.',
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
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [news, setNews] = useState<NewsRecord[]>([])
  const [about, setAbout] = useState<AboutData | null>(null)
  const [messages, setMessages] = useState<ContactMessageRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([adminApi.products(), adminApi.services(), adminApi.news(), adminApi.about(), adminApi.messages()])
      .then(([productResult, serviceResult, newsResult, aboutResult, messageResult]) => {
        if (!active) return
        setProducts(productResult.products)
        setServices(serviceResult.services)
        setNews(newsResult.news)
        setAbout(aboutResult.about)
        setMessages(messageResult.messages)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visibleProducts = products.filter((item) => item.visible).length
  const visibleServices = services.filter((item) => item.visible).length
  const visibleNews = news.filter((item) => item.visible).length
  const visibleLeaders = about?.leaders.filter((item) => item.visible).length || 0
  const visibleStoryItems = about?.story.items.filter((item) => item.visible).length || 0
  const unreadMessages = messages.filter((item) => item.status === 'new').length
  const stats = [
    { label: 'Products', value: loading ? '…' : String(products.length), icon: Package, note: `${visibleProducts} visible on website` },
    { label: 'Services', value: loading ? '…' : String(services.length), icon: Wrench, note: `${visibleServices} visible on website` },
    { label: 'News', value: loading ? '…' : String(news.length), icon: Newspaper, note: `${visibleNews} published on website` },
    { label: 'Messages', value: loading ? '…' : String(messages.length), icon: MessageSquare, note: `${unreadMessages} unread contact requests` },
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
            {navigation.slice(1).map((item) => {
              const note = item.id === 'products' ? `${products.length} products · dynamic` : item.id === 'services' ? `${services.length} services · dynamic` : item.id === 'news' ? `${news.length} news items · dynamic` : item.id === 'about' ? `${visibleStoryItems} story steps · ${visibleLeaders} leaders · dynamic` : item.id === 'contact' ? 'Contact details & divisions · dynamic' : `${messages.length} messages · ${unreadMessages} unread`
              return <div key={item.id}><span className="admin-mini-icon"><item.icon size={17}/></span><div><strong>{item.label}</strong><small>{note}</small></div><ArrowUpRight size={17}/></div>
            })}
          </div>
        </section>
        <section className="admin-panel-card">
          <div className="admin-card-head"><div><span>CONTENT STATUS</span><h2>Dynamic website content</h2></div><Clock size={20}/></div>
          <div className="admin-timeline">
            <div className="is-current"><i>1</i><div><strong>Products connected</strong><small>Admin CRUD, images, filters and public product pages.</small></div></div>
            <div className="is-current"><i>2</i><div><strong>Services connected</strong><small>Admin CRUD, visibility, category counts, search and public cards.</small></div></div>
            <div className="is-current"><i>3</i><div><strong>News connected</strong><small>Admin CRUD, featured stories, filters and public newsroom.</small></div></div>
            <div className="is-current"><i>4</i><div><strong>About connected</strong><small>Story timeline and leadership team are editable from Admin.</small></div></div>
            <div className="is-current"><i>5</i><div><strong>Contact & Messages connected</strong><small>Contact settings, dynamic service routing and form inbox are live.</small></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}


const productCategoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
  { value: 'media', label: 'Media' },
]

const emptyProduct = (): ProductRecord => ({
  id: '', category: 'technology', title: '', subtitle: '', description: '', images: [], features: [], badge: '',
  priceLabel: 'Contact for Price', visible: true, sortOrder: 0, details: [], sectionTitle: 'About this product', sectionBody: '',
  recommendedTitle: 'Recommended for', recommendedFor: [], requirementsTitle: 'Information', requirements: [],
  actionLabel: 'Request a Consultation', secondaryLabel: '', secondaryHref: '', demoLink: '', youtubeVideoLink: '', translations: { fa: {}, ps: {} },
})

const lines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
const detailLines = (value: string) => lines(value).map((item) => {
  const [label, ...rest] = item.split('|')
  return { label: label.trim(), value: rest.join('|').trim() }
}).filter((item) => item.label && item.value)

type TranslationLanguage = 'fa' | 'ps'
const translationValue = (item: { translations?: any }, lang: TranslationLanguage, key: string) => item.translations?.[lang]?.[key] ?? ''
const withTranslation = <T extends { translations?: any }>(item: T, lang: TranslationLanguage, patch: Record<string, unknown>): T => ({ ...item, translations: { ...(item.translations || {}), [lang]: { ...(item.translations?.[lang] || {}), ...patch } } })

function ProductManager() {
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | ProductCategory>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<ProductRecord>(emptyProduct())
  const [imagesText, setImagesText] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [detailsText, setDetailsText] = useState('')
  const [recommendedText, setRecommendedText] = useState('')
  const [requirementsText, setRequirementsText] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try { setProducts((await adminApi.products()).products) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load products.') }
    finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  const openForm = (product?: ProductRecord) => {
    const next = product ? { ...product, images: [...product.images], features: [...product.features], details: product.details.map((item) => ({ ...item })), recommendedFor: [...product.recommendedFor], requirements: [...product.requirements] } : emptyProduct()
    setEditingId(product?.id || null)
    setForm(next)
    setImagesText(next.images.join('\n'))
    setFeaturesText(next.features.join('\n'))
    setDetailsText(next.details.map((item) => `${item.label} | ${item.value}`).join('\n'))
    setRecommendedText(next.recommendedFor.join('\n'))
    setRequirementsText(next.requirements.join('\n'))
    setError(''); setMessage(''); setFormOpen(true)
  }

  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(emptyProduct()) }

  const productPayload = (): ProductRecord => ({
    ...form,
    id: form.id.trim().toLowerCase().replace(/\s+/g, '-'),
    images: lines(imagesText),
    features: lines(featuresText),
    details: detailLines(detailsText),
    recommendedFor: lines(recommendedText),
    requirements: lines(requirementsText),
    sortOrder: Number(form.sortOrder) || 0,
  })

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload = productPayload()
      if (editingId) await adminApi.updateProduct(editingId, payload)
      else await adminApi.createProduct(payload)
      setMessage(editingId ? 'Product updated successfully.' : 'Product created successfully.')
      await load(); closeForm()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save product.') }
    finally { setSaving(false) }
  }

  const remove = async (product: ProductRecord) => {
    if (!window.confirm(`Delete “${product.title}”? This will remove it from the public website.`)) return
    setError(''); setMessage('')
    try { await adminApi.deleteProduct(product.id); setMessage('Product deleted.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete product.') }
  }

  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('Unable to read image.'))
        reader.readAsDataURL(file)
      })
      const result = await adminApi.uploadProductImage({ fileName: file.name, dataUrl })
      setImagesText((current) => [current.trim(), result.url].filter(Boolean).join('\n'))
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload image.') }
    finally { setUploading(false) }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((product) => (category === 'all' || product.category === category) && (!q || [product.title, product.subtitle, product.id, product.category].join(' ').toLowerCase().includes(q)))
  }, [category, products, search])

  return (
    <div className="admin-products-view">
      <div className="admin-page-heading">
        <div><span>DYNAMIC CONTENT</span><h1>Products Management</h1><p>Create, edit, hide and remove the products shown on the public Products and Product Details pages.</p></div>
        <button className="admin-primary-action" onClick={() => openForm()}><Plus size={17}/> Add Product</button>
      </div>

      <section className="admin-products-toolbar">
        <label><Search size={17}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products…"/></label>
        <select value={category} onChange={(event) => setCategory(event.target.value as 'all' | ProductCategory)}><option value="all">All categories</option>{productCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <button onClick={() => void load()}><RefreshCw size={16}/> Refresh</button>
      </section>

      {error && <div className="admin-products-alert is-error">{error}</div>}
      {message && <div className="admin-products-alert is-success">{message}</div>}

      {loading ? <div className="admin-products-loading"><div className="admin-loader"/><span>Loading products…</span></div> : (
        <section className="admin-products-list">
          <div className="admin-products-list-head"><strong>{filtered.length} products</strong><span>{products.filter((item) => item.visible).length} visible on website</span></div>
          {filtered.map((product) => <article className="admin-product-row" key={product.id}>
            <img src={product.images[0] || '/afghan-power-brand.png'} alt=""/>
            <div className="admin-product-row-main"><div><span>{product.category}</span>{product.visible ? <small className="is-visible"><Eye size={12}/> Visible</small> : <small><EyeOff size={12}/> Hidden</small>}</div><h3>{product.title}</h3><p>{product.subtitle} · {product.id}</p></div>
            <div className="admin-product-row-order">Order <strong>{product.sortOrder}</strong></div>
            <div className="admin-product-row-actions"><a href={`/#/products/${product.id}`} target="_blank" rel="noreferrer"><Eye size={16}/></a><button onClick={() => openForm(product)}><Pencil size={16}/></button><button className="danger" onClick={() => void remove(product)}><Trash2 size={16}/></button></div>
          </article>)}
          {!filtered.length && <div className="admin-products-empty"><Package size={28}/><h3>No products found</h3><p>Change the search/filter or add a new product.</p></div>}
        </section>
      )}

      {formOpen && <div className="admin-product-modal" role="dialog" aria-modal="true">
        <button className="admin-product-modal-backdrop" onClick={closeForm} aria-label="Close product form"/>
        <form className="admin-product-form" onSubmit={save}>
          <header><div><span>PRODUCT EDITOR</span><h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2></div><button type="button" onClick={closeForm}><X size={20}/></button></header>
          <div className="admin-product-form-scroll">
            <section className="admin-form-section"><h3>Basic information</h3><div className="admin-form-grid">
              <label><span>Product ID / Slug *</span><input value={form.id} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="smart-gold" required/></label>
              <label><span>Category *</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}>{productCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="span-2"><span>Title *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/></label>
              <label className="span-2"><span>Subtitle *</span><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} required/></label>
              <label className="span-2"><span>Short description *</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required/></label>
              <label><span>Badge</span><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Popular / Featured"/></label>
              <label><span>Pricing label</span><input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}/></label>
              <label><span>Sort order</span><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}/></label>
              <label className="admin-checkbox-field"><input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })}/><span>Visible on public website</span></label>
            </div></section>

            <section className="admin-form-section"><h3><ImagePlus size={17}/> Images</h3><p>First image is used as the product card cover. Add one image URL/path per line.</p><textarea value={imagesText} onChange={(e) => setImagesText(e.target.value)} rows={5} placeholder="https://…\n/uploads/products/…" required/><label className="admin-upload-button"><Upload size={16}/>{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { void uploadImage(e.target.files?.[0]); e.currentTarget.value = '' }}/></label>{lines(imagesText).length > 0 && <div className="admin-image-preview-strip">{lines(imagesText).slice(0, 6).map((image) => <img src={image} alt="" key={image}/>)}</div>}</section>

            <section className="admin-form-section"><h3>Catalog features</h3><p>One feature per line.</p><textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4}/></section>

            <section className="admin-form-section"><h3>Product details</h3><p>One row per line using <strong>Label | Value</strong>.</p><textarea value={detailsText} onChange={(e) => setDetailsText(e.target.value)} rows={6} placeholder="Industry | Gold & jewelry\nPlatform | Web application"/><div className="admin-form-grid"><label className="span-2"><span>Details section title</span><input value={form.sectionTitle} onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}/></label><label className="span-2"><span>Details section body</span><textarea value={form.sectionBody} onChange={(e) => setForm({ ...form, sectionBody: e.target.value })} rows={4}/></label></div></section>

            <section className="admin-form-section"><h3>Recommended & information</h3><div className="admin-form-grid"><label className="span-2"><span>Recommended title</span><input value={form.recommendedTitle} onChange={(e) => setForm({ ...form, recommendedTitle: e.target.value })}/></label><label className="span-2"><span>Recommended items · one per line</span><textarea value={recommendedText} onChange={(e) => setRecommendedText(e.target.value)} rows={4}/></label><label className="span-2"><span>Requirements / Information title</span><input value={form.requirementsTitle} onChange={(e) => setForm({ ...form, requirementsTitle: e.target.value })}/></label><label className="span-2"><span>Requirements / Information · one per line</span><textarea value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} rows={4}/></label></div></section>

            <section className="admin-form-section"><h3>Actions</h3><div className="admin-form-grid"><label><span>Primary action label *</span><input value={form.actionLabel} onChange={(e) => setForm({ ...form, actionLabel: e.target.value })} required/></label><label><span>Secondary action label</span><input value={form.secondaryLabel} onChange={(e) => setForm({ ...form, secondaryLabel: e.target.value })}/></label><label className="span-2"><span>Secondary action link</span><input value={form.secondaryHref} onChange={(e) => setForm({ ...form, secondaryHref: e.target.value })} placeholder="#contact or https://…"/></label></div></section>

            <section className="admin-form-section"><h3>Demo & YouTube video</h3><p>Add a public demo URL and/or a YouTube video. Standard YouTube, youtu.be, Shorts and embed links are supported.</p><div className="admin-form-grid"><label className="span-2"><span>Demo Link</span><input type="url" value={form.demoLink} onChange={(e) => setForm({ ...form, demoLink: e.target.value })} placeholder="https://demo.example.com"/></label><label className="span-2"><span>YouTube Video Link</span><input type="url" value={form.youtubeVideoLink} onChange={(e) => setForm({ ...form, youtubeVideoLink: e.target.value })} placeholder="https://www.youtube.com/watch?v=..."/></label></div></section>

            <section className="admin-form-section"><h3>Translations · دری / پشتو</h3><p>Leave any field empty to fall back to English.</p>{(['fa','ps'] as TranslationLanguage[]).map((lang) => <div className="admin-translation-panel" key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid">
              <label className="span-2"><span>Title</span><input dir="rtl" value={translationValue(form,lang,'title')} onChange={(e)=>setForm(withTranslation(form,lang,{title:e.target.value}))}/></label>
              <label className="span-2"><span>Subtitle</span><input dir="rtl" value={translationValue(form,lang,'subtitle')} onChange={(e)=>setForm(withTranslation(form,lang,{subtitle:e.target.value}))}/></label>
              <label className="span-2"><span>Description</span><textarea dir="rtl" rows={3} value={translationValue(form,lang,'description')} onChange={(e)=>setForm(withTranslation(form,lang,{description:e.target.value}))}/></label>
              <label><span>Badge</span><input dir="rtl" value={translationValue(form,lang,'badge')} onChange={(e)=>setForm(withTranslation(form,lang,{badge:e.target.value}))}/></label>
              <label><span>Pricing label</span><input dir="rtl" value={translationValue(form,lang,'priceLabel')} onChange={(e)=>setForm(withTranslation(form,lang,{priceLabel:e.target.value}))}/></label>
              <label className="span-2"><span>Features · one per line</span><textarea dir="rtl" rows={4} value={(translationValue(form,lang,'features')||[]).join?.('\n')||''} onChange={(e)=>setForm(withTranslation(form,lang,{features:lines(e.target.value)}))}/></label>
              <label className="span-2"><span>Details · Label | Value</span><textarea dir="rtl" rows={5} value={(translationValue(form,lang,'details')||[]).map?.((x:any)=>`${x.label} | ${x.value}`).join('\n')||''} onChange={(e)=>setForm(withTranslation(form,lang,{details:detailLines(e.target.value)}))}/></label>
              <label className="span-2"><span>Details section title</span><input dir="rtl" value={translationValue(form,lang,'sectionTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{sectionTitle:e.target.value}))}/></label>
              <label className="span-2"><span>Details section body</span><textarea dir="rtl" rows={3} value={translationValue(form,lang,'sectionBody')} onChange={(e)=>setForm(withTranslation(form,lang,{sectionBody:e.target.value}))}/></label>
              <label className="span-2"><span>Recommended title</span><input dir="rtl" value={translationValue(form,lang,'recommendedTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{recommendedTitle:e.target.value}))}/></label>
              <label className="span-2"><span>Recommended items · one per line</span><textarea dir="rtl" rows={3} value={(translationValue(form,lang,'recommendedFor')||[]).join?.('\n')||''} onChange={(e)=>setForm(withTranslation(form,lang,{recommendedFor:lines(e.target.value)}))}/></label>
              <label className="span-2"><span>Information title</span><input dir="rtl" value={translationValue(form,lang,'requirementsTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{requirementsTitle:e.target.value}))}/></label>
              <label className="span-2"><span>Information items · one per line</span><textarea dir="rtl" rows={3} value={(translationValue(form,lang,'requirements')||[]).join?.('\n')||''} onChange={(e)=>setForm(withTranslation(form,lang,{requirements:lines(e.target.value)}))}/></label>
              <label><span>Primary action label</span><input dir="rtl" value={translationValue(form,lang,'actionLabel')} onChange={(e)=>setForm(withTranslation(form,lang,{actionLabel:e.target.value}))}/></label>
              <label><span>Secondary action label</span><input dir="rtl" value={translationValue(form,lang,'secondaryLabel')} onChange={(e)=>setForm(withTranslation(form,lang,{secondaryLabel:e.target.value}))}/></label>
            </div></div>)}</section>
          </div>
          <footer><button type="button" onClick={closeForm}>Cancel</button><button className="save" disabled={saving || uploading}><Save size={16}/>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Product'}</button></footer>
        </form>
      </div>}
    </div>
  )
}


const serviceCategoryOptions: Array<{ value: ServiceCategory; label: string }> = [
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
  { value: 'media', label: 'Media' },
]

const emptyService = (): ServiceRecord => ({
  id: '', category: 'technology', title: '', description: '', image: '', featured: false,
  visible: true, sortOrder: 0, actionLabel: 'Learn more', actionHref: '#/contact', translations: { fa: {}, ps: {} },
})

function ServiceManager() {
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [news, setNews] = useState<NewsRecord[]>([])
  const [about, setAbout] = useState<AboutData | null>(null)
  const [messages, setMessages] = useState<ContactMessageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | ServiceCategory>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<ServiceRecord>(emptyService())

  const load = async () => {
    setLoading(true); setError('')
    try { setServices((await adminApi.services()).services) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load services.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const openForm = (service?: ServiceRecord) => {
    setEditingId(service?.id || null)
    setForm(service ? { ...service } : emptyService())
    setError(''); setMessage(''); setFormOpen(true)
  }
  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(emptyService()) }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload: ServiceRecord = { ...form, id: form.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), sortOrder: Number(form.sortOrder) || 0 }
      if (editingId) await adminApi.updateService(editingId, payload)
      else await adminApi.createService(payload)
      setMessage(editingId ? 'Service updated successfully.' : 'Service created successfully.')
      await load(); closeForm()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save service.') }
    finally { setSaving(false) }
  }

  const remove = async (service: ServiceRecord) => {
    if (!window.confirm(`Delete “${service.title}”? This will remove it from the public website.`)) return
    setError(''); setMessage('')
    try { await adminApi.deleteService(service.id); setMessage('Service deleted.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete service.') }
  }

  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('Unable to read image.'))
        reader.readAsDataURL(file)
      })
      const result = await adminApi.uploadServiceImage({ fileName: file.name, dataUrl })
      setForm((current) => ({ ...current, image: result.url }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload image.') }
    finally { setUploading(false) }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return services.filter((service) => (category === 'all' || service.category === category) && (!q || [service.title, service.description, service.id, service.category].join(' ').toLowerCase().includes(q)))
  }, [category, search, services])

  return (
    <div className="admin-products-view">
      <div className="admin-page-heading">
        <div><span>DYNAMIC CONTENT</span><h1>Services Management</h1><p>Create, edit, hide and remove the services shown in the public Services catalog.</p></div>
        <button className="admin-primary-action" onClick={() => openForm()}><Plus size={17}/> Add Service</button>
      </div>
      <section className="admin-products-toolbar">
        <label><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services…"/></label>
        <select value={category} onChange={(e) => setCategory(e.target.value as 'all' | ServiceCategory)}><option value="all">All categories</option>{serviceCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <button onClick={() => void load()}><RefreshCw size={16}/> Refresh</button>
      </section>
      {error && <div className="admin-products-alert is-error">{error}</div>}
      {message && <div className="admin-products-alert is-success">{message}</div>}
      {loading ? <div className="admin-products-loading"><div className="admin-loader"/><span>Loading services…</span></div> : (
        <section className="admin-products-list">
          <div className="admin-products-list-head"><strong>{filtered.length} services</strong><span>{services.filter((item) => item.visible).length} visible on website</span></div>
          {filtered.map((service) => <article className="admin-product-row" key={service.id}>
            <img src={service.image || '/afghan-power-brand.png'} alt=""/>
            <div className="admin-product-row-main"><div><span>{service.category}</span>{service.featured && <small className="is-visible">Featured</small>}{service.visible ? <small className="is-visible"><Eye size={12}/> Visible</small> : <small><EyeOff size={12}/> Hidden</small>}</div><h3>{service.title}</h3><p>{service.description}</p></div>
            <div className="admin-product-row-order">Order <strong>{service.sortOrder}</strong></div>
            <div className="admin-product-row-actions"><a href="/#/services" target="_blank" rel="noreferrer"><Eye size={16}/></a><button onClick={() => openForm(service)}><Pencil size={16}/></button><button className="danger" onClick={() => void remove(service)}><Trash2 size={16}/></button></div>
          </article>)}
          {!filtered.length && <div className="admin-products-empty"><Wrench size={28}/><h3>No services found</h3><p>Change the search/filter or add a new service.</p></div>}
        </section>
      )}
      {formOpen && <div className="admin-product-modal" role="dialog" aria-modal="true">
        <button className="admin-product-modal-backdrop" onClick={closeForm} aria-label="Close service form"/>
        <form className="admin-product-form" onSubmit={save}>
          <header><div><span>SERVICE EDITOR</span><h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2></div><button type="button" onClick={closeForm}><X size={20}/></button></header>
          <div className="admin-product-form-scroll">
            <section className="admin-form-section"><h3>Service information</h3><div className="admin-form-grid">
              <label><span>Service ID / Slug *</span><input value={form.id} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="website-development" required/></label>
              <label><span>Category *</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}>{serviceCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="span-2"><span>Title *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/></label>
              <label className="span-2"><span>Description *</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required/></label>
              <label><span>Sort order</span><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}/></label>
              <label className="admin-checkbox-field"><input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })}/><span>Visible on public website</span></label>
              <label className="admin-checkbox-field"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}/><span>Featured service</span></label>
            </div></section>
            <section className="admin-form-section"><h3><ImagePlus size={17}/> Service image</h3><div className="admin-form-grid"><label className="span-2"><span>Image URL / path *</span><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… or /uploads/services/…" required/></label></div><label className="admin-upload-button"><Upload size={16}/>{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { void uploadImage(e.target.files?.[0]); e.currentTarget.value = '' }}/></label>{form.image && <div className="admin-image-preview-strip"><img src={form.image} alt=""/></div>}</section>
            <section className="admin-form-section"><h3>Action</h3><div className="admin-form-grid"><label><span>Button label</span><input value={form.actionLabel} onChange={(e) => setForm({ ...form, actionLabel: e.target.value })}/></label><label><span>Button link</span><input value={form.actionHref} onChange={(e) => setForm({ ...form, actionHref: e.target.value })} placeholder="#/contact"/></label></div></section>
            <section className="admin-form-section"><h3>Translations · دری / پشتو</h3><p>Empty fields use the English version.</p>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div className="admin-translation-panel" key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid"><label className="span-2"><span>Title</span><input dir="rtl" value={translationValue(form,lang,'title')} onChange={(e)=>setForm(withTranslation(form,lang,{title:e.target.value}))}/></label><label className="span-2"><span>Description</span><textarea dir="rtl" rows={4} value={translationValue(form,lang,'description')} onChange={(e)=>setForm(withTranslation(form,lang,{description:e.target.value}))}/></label><label className="span-2"><span>Button label</span><input dir="rtl" value={translationValue(form,lang,'actionLabel')} onChange={(e)=>setForm(withTranslation(form,lang,{actionLabel:e.target.value}))}/></label></div></div>)}</section>
          </div>
          <footer><button type="button" onClick={closeForm}>Cancel</button><button className="save" disabled={saving || uploading}><Save size={16}/>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Service'}</button></footer>
        </form>
      </div>}
    </div>
  )
}


const newsCategoryOptions: Array<{ value: NewsCategory; label: string }> = [
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
  { value: 'media', label: 'Media' },
  { value: 'company', label: 'Company' },
]

const emptyNews = (): NewsRecord => ({
  id: '', title: '', category: 'company', date: new Date().toISOString().slice(0, 10), readTime: '3 min read',
  featured: false, visible: true, sortOrder: 0, image: '', summary: '', translations: { fa: {}, ps: {} },
})

function NewsManager() {
  const [items, setItems] = useState<NewsRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | NewsCategory>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<NewsRecord>(emptyNews())

  const load = async () => {
    setLoading(true); setError('')
    try { setItems((await adminApi.news()).news) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load news.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const openForm = (item?: NewsRecord) => {
    setEditingId(item?.id || null)
    setForm(item ? { ...item } : emptyNews())
    setError(''); setMessage(''); setFormOpen(true)
  }
  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(emptyNews()) }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload: NewsRecord = { ...form, id: form.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), sortOrder: Number(form.sortOrder) || 0 }
      if (editingId) await adminApi.updateNews(editingId, payload)
      else await adminApi.createNews(payload)
      setMessage(editingId ? 'News updated successfully.' : 'News created successfully.')
      await load(); closeForm()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save news.') }
    finally { setSaving(false) }
  }

  const remove = async (item: NewsRecord) => {
    if (!window.confirm(`Delete “${item.title}”? This will remove it from the public website.`)) return
    setError(''); setMessage('')
    try { await adminApi.deleteNews(item.id); setMessage('News deleted.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete news.') }
  }

  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('Unable to read image.'))
        reader.readAsDataURL(file)
      })
      const result = await adminApi.uploadNewsImage({ fileName: file.name, dataUrl })
      setForm((current) => ({ ...current, image: result.url }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload image.') }
    finally { setUploading(false) }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => (category === 'all' || item.category === category) && (!q || [item.title, item.summary, item.id, item.category].join(' ').toLowerCase().includes(q)))
  }, [category, items, search])

  return (
    <div className="admin-products-view">
      <div className="admin-page-heading">
        <div><span>DYNAMIC CONTENT</span><h1>News Management</h1><p>Create, edit, feature, hide and remove stories shown on the public News page.</p></div>
        <button className="admin-primary-action" onClick={() => openForm()}><Plus size={17}/> Add News</button>
      </div>
      <section className="admin-products-toolbar">
        <label><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news…"/></label>
        <select value={category} onChange={(e) => setCategory(e.target.value as 'all' | NewsCategory)}><option value="all">All categories</option>{newsCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <button onClick={() => void load()}><RefreshCw size={16}/> Refresh</button>
      </section>
      {error && <div className="admin-products-alert is-error">{error}</div>}
      {message && <div className="admin-products-alert is-success">{message}</div>}
      {loading ? <div className="admin-products-loading"><div className="admin-loader"/><span>Loading news…</span></div> : (
        <section className="admin-products-list">
          <div className="admin-products-list-head"><strong>{filtered.length} news items</strong><span>{items.filter((item) => item.visible).length} published on website</span></div>
          {filtered.map((item) => <article className="admin-product-row" key={item.id}>
            <img src={item.image || '/afghan-power-brand.png'} alt=""/>
            <div className="admin-product-row-main"><div><span>{item.category}</span>{item.featured && <small className="is-visible">Featured</small>}{item.visible ? <small className="is-visible"><Eye size={12}/> Published</small> : <small><EyeOff size={12}/> Hidden</small>}</div><h3>{item.title}</h3><p>{item.summary}</p></div>
            <div className="admin-product-row-order">{item.date}<br/><strong>{item.sortOrder}</strong></div>
            <div className="admin-product-row-actions"><a href="/#/news" target="_blank" rel="noreferrer"><Eye size={16}/></a><button onClick={() => openForm(item)}><Pencil size={16}/></button><button className="danger" onClick={() => void remove(item)}><Trash2 size={16}/></button></div>
          </article>)}
          {!filtered.length && <div className="admin-products-empty"><Newspaper size={28}/><h3>No news found</h3><p>Change the search/filter or add a new story.</p></div>}
        </section>
      )}
      {formOpen && <div className="admin-product-modal" role="dialog" aria-modal="true">
        <button className="admin-product-modal-backdrop" onClick={closeForm} aria-label="Close news form"/>
        <form className="admin-product-form" onSubmit={save}>
          <header><div><span>NEWS EDITOR</span><h2>{editingId ? 'Edit News' : 'Add News'}</h2></div><button type="button" onClick={closeForm}><X size={20}/></button></header>
          <div className="admin-product-form-scroll">
            <section className="admin-form-section"><h3>Story information</h3><div className="admin-form-grid">
              <label><span>News ID / Slug *</span><input value={form.id} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="new-service-launch" required/></label>
              <label><span>Category *</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}>{newsCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="span-2"><span>Title *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/></label>
              <label className="span-2"><span>Summary *</span><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} required/></label>
              <label><span>Date *</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required/></label>
              <label><span>Read time</span><input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="3 min read"/></label>
              <label><span>Sort order</span><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}/></label>
              <label className="admin-checkbox-field"><input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })}/><span>Published on public website</span></label>
              <label className="admin-checkbox-field"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}/><span>Featured news</span></label>
            </div></section>
            <section className="admin-form-section"><h3><ImagePlus size={17}/> News image</h3><div className="admin-form-grid"><label className="span-2"><span>Image URL / path *</span><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… or /uploads/news/…" required/></label></div><label className="admin-upload-button"><Upload size={16}/>{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { void uploadImage(e.target.files?.[0]); e.currentTarget.value = '' }}/></label>{form.image && <div className="admin-image-preview-strip"><img src={form.image} alt=""/></div>}</section>
            <section className="admin-form-section"><h3>Translations · دری / پشتو</h3><p>Empty fields use the English version.</p>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div className="admin-translation-panel" key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid"><label className="span-2"><span>Title</span><input dir="rtl" value={translationValue(form,lang,'title')} onChange={(e)=>setForm(withTranslation(form,lang,{title:e.target.value}))}/></label><label className="span-2"><span>Summary</span><textarea dir="rtl" rows={4} value={translationValue(form,lang,'summary')} onChange={(e)=>setForm(withTranslation(form,lang,{summary:e.target.value}))}/></label><label><span>Read time</span><input dir="rtl" value={translationValue(form,lang,'readTime')} onChange={(e)=>setForm(withTranslation(form,lang,{readTime:e.target.value}))}/></label></div></div>)}</section>
          </div>
          <footer><button type="button" onClick={closeForm}>Cancel</button><button className="save" disabled={saving || uploading}><Save size={16}/>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create News'}</button></footer>
        </form>
      </div>}
    </div>
  )
}


const emptyStoryItem = (): StoryItemRecord => ({ id: '', step: '', title: '', text: '', visible: true, sortOrder: 0, translations: { fa: {}, ps: {} }, createdAt: '', updatedAt: '' })
const emptyLeader = (): LeadershipRecord => ({ id: '', name: '', role: '', text: '', photo: '', visible: true, sortOrder: 0, translations: { fa: {}, ps: {} }, createdAt: '', updatedAt: '' })

function AboutManager() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [messages, setMessages] = useState<ContactMessageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [storyHeading, setStoryHeading] = useState('')
  const [storyIntro, setStoryIntro] = useState('')
  const [storyTranslations, setStoryTranslations] = useState<any>({ fa: {}, ps: {} })
  const [storyFormOpen, setStoryFormOpen] = useState(false)
  const [leaderFormOpen, setLeaderFormOpen] = useState(false)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null)
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null)
  const [storyForm, setStoryForm] = useState<StoryItemRecord>(emptyStoryItem())
  const [leaderForm, setLeaderForm] = useState<LeadershipRecord>(emptyLeader())

  const load = async () => {
    setLoading(true); setError('')
    try {
      const result = await adminApi.about()
      setAbout(result.about)
      setStoryHeading(result.about.story.heading)
      setStoryIntro(result.about.story.intro)
      setStoryTranslations(result.about.story.translations || { fa: {}, ps: {} })
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load About content.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const saveStorySettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      await adminApi.updateStorySettings({ heading: storyHeading, intro: storyIntro, translations: storyTranslations })
      setMessage('Story heading and introduction updated.')
      await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to update story settings.') }
    finally { setSaving(false) }
  }

  const openStory = (item?: StoryItemRecord) => {
    setEditingStoryId(item?.id || null); setStoryForm(item ? { ...item } : emptyStoryItem()); setStoryFormOpen(true); setError(''); setMessage('')
  }
  const saveStoryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload = { ...storyForm, id: storyForm.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), sortOrder: Number(storyForm.sortOrder) || 0 }
      if (editingStoryId) await adminApi.updateStoryItem(editingStoryId, payload)
      else await adminApi.createStoryItem(payload)
      setStoryFormOpen(false); setEditingStoryId(null); setMessage(editingStoryId ? 'Story item updated.' : 'Story item created.'); await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save story item.') }
    finally { setSaving(false) }
  }
  const removeStory = async (item: StoryItemRecord) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return
    try { await adminApi.deleteStoryItem(item.id); setMessage('Story item deleted.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete story item.') }
  }

  const openLeader = (item?: LeadershipRecord) => {
    setEditingLeaderId(item?.id || null); setLeaderForm(item ? { ...item } : emptyLeader()); setLeaderFormOpen(true); setError(''); setMessage('')
  }
  const saveLeader = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload = { ...leaderForm, id: leaderForm.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), sortOrder: Number(leaderForm.sortOrder) || 0 }
      if (editingLeaderId) await adminApi.updateLeader(editingLeaderId, payload)
      else await adminApi.createLeader(payload)
      setLeaderFormOpen(false); setEditingLeaderId(null); setMessage(editingLeaderId ? 'Team member updated.' : 'Team member created.'); await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save team member.') }
    finally { setSaving(false) }
  }
  const removeLeader = async (item: LeadershipRecord) => {
    if (!window.confirm(`Delete “${item.name}”?`)) return
    try { await adminApi.deleteLeader(item.id); setMessage('Team member deleted.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete team member.') }
  }
  const uploadLeader = async (file?: File) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '')); reader.onerror = () => reject(new Error('Unable to read image.')); reader.readAsDataURL(file)
      })
      const result = await adminApi.uploadLeaderImage({ fileName: file.name, dataUrl })
      setLeaderForm((current) => ({ ...current, photo: result.url }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload team photo.') }
    finally { setUploading(false) }
  }

  if (loading) return <div className="admin-products-loading"><div className="admin-loader"/><span>Loading About content…</span></div>

  return <div className="admin-products-view admin-about-view">
    <div className="admin-page-heading"><div><span>DYNAMIC CONTENT</span><h1>About Management</h1><p>Manage the Our Story timeline and Leadership team shown on the public About page.</p></div><a className="admin-primary-action" href="/#/about" target="_blank" rel="noreferrer"><Eye size={17}/> View About</a></div>
    {error && <div className="admin-products-alert is-error">{error}</div>}
    {message && <div className="admin-products-alert is-success">{message}</div>}

    <form className="admin-about-settings admin-form-section" onSubmit={saveStorySettings}>
      <div className="admin-card-head"><div><span>OUR STORY</span><h2>Section heading</h2></div><button className="admin-primary-action" disabled={saving}><Save size={16}/>{saving ? 'Saving…' : 'Save Heading'}</button></div>
      <div className="admin-form-grid">
        <label><span>Heading *</span><textarea rows={3} value={storyHeading} onChange={(e) => setStoryHeading(e.target.value)} required/></label>
        <label><span>Introduction *</span><textarea rows={3} value={storyIntro} onChange={(e) => setStoryIntro(e.target.value)} required/></label>
      </div>
      <div className="admin-translation-panel"><h4>دری</h4><div className="admin-form-grid"><label><span>Heading</span><textarea dir="rtl" rows={3} value={storyTranslations.fa?.heading || ''} onChange={(e)=>setStoryTranslations((v:any)=>({...v,fa:{...(v.fa||{}),heading:e.target.value}}))}/></label><label><span>Introduction</span><textarea dir="rtl" rows={3} value={storyTranslations.fa?.intro || ''} onChange={(e)=>setStoryTranslations((v:any)=>({...v,fa:{...(v.fa||{}),intro:e.target.value}}))}/></label></div></div>
      <div className="admin-translation-panel"><h4>پښتو</h4><div className="admin-form-grid"><label><span>Heading</span><textarea dir="rtl" rows={3} value={storyTranslations.ps?.heading || ''} onChange={(e)=>setStoryTranslations((v:any)=>({...v,ps:{...(v.ps||{}),heading:e.target.value}}))}/></label><label><span>Introduction</span><textarea dir="rtl" rows={3} value={storyTranslations.ps?.intro || ''} onChange={(e)=>setStoryTranslations((v:any)=>({...v,ps:{...(v.ps||{}),intro:e.target.value}}))}/></label></div></div>
    </form>

    <div className="admin-about-grid">
      <section className="admin-products-list">
        <div className="admin-products-list-head"><div><strong>Story Timeline</strong><span>{about?.story.items.filter((item) => item.visible).length || 0} visible</span></div><button className="admin-primary-action" onClick={() => openStory()}><Plus size={15}/> Add Step</button></div>
        {about?.story.items.map((item) => <article className="admin-product-row admin-about-row" key={item.id}>
          <div className="admin-about-number">{item.step}</div>
          <div className="admin-product-row-main"><div>{item.visible ? <small className="is-visible"><Eye size={12}/> Visible</small> : <small><EyeOff size={12}/> Hidden</small>}</div><h3>{item.title}</h3><p>{item.text}</p></div>
          <div className="admin-product-row-order">Order<strong>{item.sortOrder}</strong></div>
          <div className="admin-product-row-actions"><button onClick={() => openStory(item)}><Pencil size={16}/></button><button className="danger" onClick={() => void removeStory(item)}><Trash2 size={16}/></button></div>
        </article>)}
      </section>

      <section className="admin-products-list">
        <div className="admin-products-list-head"><div><strong>Leadership Team</strong><span>{about?.leaders.filter((item) => item.visible).length || 0} visible</span></div><button className="admin-primary-action" onClick={() => openLeader()}><Plus size={15}/> Add Member</button></div>
        {about?.leaders.map((item) => <article className="admin-product-row admin-about-row" key={item.id}>
          <img src={item.photo || '/afghan-power-brand.png'} alt=""/>
          <div className="admin-product-row-main"><div>{item.visible ? <small className="is-visible"><Eye size={12}/> Visible</small> : <small><EyeOff size={12}/> Hidden</small>}</div><h3>{item.name}</h3><p>{item.role}</p></div>
          <div className="admin-product-row-order">Order<strong>{item.sortOrder}</strong></div>
          <div className="admin-product-row-actions"><button onClick={() => openLeader(item)}><Pencil size={16}/></button><button className="danger" onClick={() => void removeLeader(item)}><Trash2 size={16}/></button></div>
        </article>)}
      </section>
    </div>

    {storyFormOpen && <div className="admin-product-modal" role="dialog" aria-modal="true"><button className="admin-product-modal-backdrop" onClick={() => setStoryFormOpen(false)} aria-label="Close story form"/><form className="admin-product-form" onSubmit={saveStoryItem}><header><div><span>ABOUT · OUR STORY</span><h2>{editingStoryId ? 'Edit Story Step' : 'Add Story Step'}</h2></div><button type="button" onClick={() => setStoryFormOpen(false)}><X size={20}/></button></header><div className="admin-product-form-scroll"><section className="admin-form-section"><div className="admin-form-grid">
      <label><span>ID *</span><input value={storyForm.id} disabled={Boolean(editingStoryId)} onChange={(e) => setStoryForm({...storyForm,id:e.target.value})} placeholder="shared-vision" required/></label>
      <label><span>Step number *</span><input value={storyForm.step} onChange={(e) => setStoryForm({...storyForm,step:e.target.value})} placeholder="01" required/></label>
      <label className="span-2"><span>Title *</span><input value={storyForm.title} onChange={(e) => setStoryForm({...storyForm,title:e.target.value})} required/></label>
      <label className="span-2"><span>Description *</span><textarea rows={4} value={storyForm.text} onChange={(e) => setStoryForm({...storyForm,text:e.target.value})} required/></label>
      <label><span>Sort order</span><input type="number" value={storyForm.sortOrder} onChange={(e) => setStoryForm({...storyForm,sortOrder:Number(e.target.value)})}/></label>
      <label className="admin-checkbox-field"><input type="checkbox" checked={storyForm.visible} onChange={(e) => setStoryForm({...storyForm,visible:e.target.checked})}/><span>Visible on About page</span></label>
    </div></section><section className="admin-form-section"><h3>Translations · دری / پشتو</h3>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div className="admin-translation-panel" key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid"><label><span>Step</span><input dir="rtl" value={translationValue(storyForm,lang,'step')} onChange={(e)=>setStoryForm(withTranslation(storyForm,lang,{step:e.target.value}))}/></label><label><span>Title</span><input dir="rtl" value={translationValue(storyForm,lang,'title')} onChange={(e)=>setStoryForm(withTranslation(storyForm,lang,{title:e.target.value}))}/></label><label className="span-2"><span>Description</span><textarea dir="rtl" rows={4} value={translationValue(storyForm,lang,'text')} onChange={(e)=>setStoryForm(withTranslation(storyForm,lang,{text:e.target.value}))}/></label></div></div>)}</section></div><footer><button type="button" onClick={() => setStoryFormOpen(false)}>Cancel</button><button className="save" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save Story Step'}</button></footer></form></div>}

    {leaderFormOpen && <div className="admin-product-modal" role="dialog" aria-modal="true"><button className="admin-product-modal-backdrop" onClick={() => setLeaderFormOpen(false)} aria-label="Close team form"/><form className="admin-product-form" onSubmit={saveLeader}><header><div><span>ABOUT · LEADERSHIP</span><h2>{editingLeaderId ? 'Edit Team Member' : 'Add Team Member'}</h2></div><button type="button" onClick={() => setLeaderFormOpen(false)}><X size={20}/></button></header><div className="admin-product-form-scroll"><section className="admin-form-section"><div className="admin-form-grid">
      <label><span>ID *</span><input value={leaderForm.id} disabled={Boolean(editingLeaderId)} onChange={(e) => setLeaderForm({...leaderForm,id:e.target.value})} placeholder="team-member" required/></label>
      <label><span>Sort order</span><input type="number" value={leaderForm.sortOrder} onChange={(e) => setLeaderForm({...leaderForm,sortOrder:Number(e.target.value)})}/></label>
      <label><span>Name *</span><input value={leaderForm.name} onChange={(e) => setLeaderForm({...leaderForm,name:e.target.value})} required/></label>
      <label><span>Role *</span><input value={leaderForm.role} onChange={(e) => setLeaderForm({...leaderForm,role:e.target.value})} required/></label>
      <label className="span-2"><span>Description *</span><textarea rows={4} value={leaderForm.text} onChange={(e) => setLeaderForm({...leaderForm,text:e.target.value})} required/></label>
      <label className="span-2"><span>Photo URL / path *</span><input value={leaderForm.photo} onChange={(e) => setLeaderForm({...leaderForm,photo:e.target.value})} required/></label>
      <label className="admin-checkbox-field"><input type="checkbox" checked={leaderForm.visible} onChange={(e) => setLeaderForm({...leaderForm,visible:e.target.checked})}/><span>Visible on About page</span></label>
    </div><div className="admin-translation-panel"><h4>Translations · دری / پشتو</h4>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid"><label><span>Name</span><input dir="rtl" value={translationValue(leaderForm,lang,'name')} onChange={(e)=>setLeaderForm(withTranslation(leaderForm,lang,{name:e.target.value}))}/></label><label><span>Role</span><input dir="rtl" value={translationValue(leaderForm,lang,'role')} onChange={(e)=>setLeaderForm(withTranslation(leaderForm,lang,{role:e.target.value}))}/></label><label className="span-2"><span>Description</span><textarea dir="rtl" rows={4} value={translationValue(leaderForm,lang,'text')} onChange={(e)=>setLeaderForm(withTranslation(leaderForm,lang,{text:e.target.value}))}/></label></div></div>)}</div><label className="admin-upload-button"><Upload size={16}/>{uploading?'Uploading…':'Upload photo'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e)=>{void uploadLeader(e.target.files?.[0]);e.currentTarget.value=''}}/></label>{leaderForm.photo && <div className="admin-image-preview-strip"><img src={leaderForm.photo} alt=""/></div>}</section></div><footer><button type="button" onClick={() => setLeaderFormOpen(false)}>Cancel</button><button className="save" disabled={saving||uploading}><Save size={16}/>{saving?'Saving…':'Save Team Member'}</button></footer></form></div>}
  </div>
}


const emptyContactSettings = (): ContactSettings => ({
  heroKicker:'CONTACT AFGHAN POWER GROUP', heroTitle:'Start with the', heroHighlight:'right team.', heroText:'', phone:'', email:'', whatsapp:'', office:'', workingHours:'', infoTitle:'', infoText:'', mapTitle:'', mapText:'', mapEmbedUrl:'', translations:{fa:{},ps:{}}, divisions:[],
})

function ContactManager() {
  const [form,setForm]=useState<ContactSettings>(emptyContactSettings())
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState(''); const [message,setMessage]=useState('')
  const load=async()=>{setLoading(true);setError('');try{setForm((await adminApi.contact()).contact)}catch(e){setError(e instanceof Error?e.message:'Unable to load contact settings.')}finally{setLoading(false)}}
  useEffect(()=>{void load()},[])
  const save=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setSaving(true);setError('');setMessage('');try{setForm((await adminApi.updateContact(form)).contact);setMessage('Contact page updated successfully.')}catch(err){setError(err instanceof Error?err.message:'Unable to save contact settings.')}finally{setSaving(false)}}
  const updateDivision=(index:number,patch:Partial<ContactSettings['divisions'][number]>)=>setForm(current=>({...current,divisions:current.divisions.map((d,i)=>i===index?{...d,...patch}:d)}))
  if(loading)return <div className="admin-products-loading"><div className="admin-loader"/><span>Loading Contact settings…</span></div>
  return <div className="admin-products-view admin-contact-view">
    <div className="admin-page-heading"><div><span>DYNAMIC CONTENT</span><h1>Contact Management</h1><p>Manage public contact details, divisions and map information.</p></div><a className="admin-primary-action" href="/#/contact" target="_blank" rel="noreferrer"><Eye size={17}/> View Contact</a></div>
    {error&&<div className="admin-products-alert is-error">{error}</div>}{message&&<div className="admin-products-alert is-success">{message}</div>}
    <form onSubmit={save}>
      <section className="admin-form-section"><div className="admin-card-head"><div><span>HERO & CONTACT</span><h2>Main contact information</h2></div><button className="admin-primary-action" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save Contact'}</button></div>
        <div className="admin-form-grid">
          <label><span>Hero kicker</span><input value={form.heroKicker} onChange={e=>setForm({...form,heroKicker:e.target.value})}/></label>
          <label><span>Hero title</span><input value={form.heroTitle} onChange={e=>setForm({...form,heroTitle:e.target.value})}/></label>
          <label><span>Highlighted title</span><input value={form.heroHighlight} onChange={e=>setForm({...form,heroHighlight:e.target.value})}/></label>
          <label className="span-2"><span>Hero description</span><textarea rows={3} value={form.heroText} onChange={e=>setForm({...form,heroText:e.target.value})}/></label>
          <label><span>Phone</span><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
          <label><span>WhatsApp</span><input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/></label>
          <label><span>Office</span><input value={form.office} onChange={e=>setForm({...form,office:e.target.value})}/></label>
          <label><span>Working hours</span><input value={form.workingHours} onChange={e=>setForm({...form,workingHours:e.target.value})}/></label>
          <label><span>Info panel title</span><input value={form.infoTitle} onChange={e=>setForm({...form,infoTitle:e.target.value})}/></label>
          <label className="span-2"><span>Info panel text</span><textarea rows={2} value={form.infoText} onChange={e=>setForm({...form,infoText:e.target.value})}/></label>
          <label><span>Map title</span><input value={form.mapTitle} onChange={e=>setForm({...form,mapTitle:e.target.value})}/></label>
          <label><span>Map text</span><input value={form.mapText} onChange={e=>setForm({...form,mapText:e.target.value})}/></label>
          <label className="span-2"><span>Google Maps embed URL</span><input value={form.mapEmbedUrl} onChange={e=>setForm({...form,mapEmbedUrl:e.target.value})}/></label>
        </div>
        <div className="admin-translation-panel"><h4>Translations · دری / پشتو</h4>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid">
          <label><span>Hero kicker</span><input dir="rtl" value={translationValue(form,lang,'heroKicker')} onChange={(e)=>setForm(withTranslation(form,lang,{heroKicker:e.target.value}))}/></label>
          <label><span>Hero title</span><input dir="rtl" value={translationValue(form,lang,'heroTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{heroTitle:e.target.value}))}/></label>
          <label><span>Highlighted title</span><input dir="rtl" value={translationValue(form,lang,'heroHighlight')} onChange={(e)=>setForm(withTranslation(form,lang,{heroHighlight:e.target.value}))}/></label>
          <label className="span-2"><span>Hero description</span><textarea dir="rtl" rows={3} value={translationValue(form,lang,'heroText')} onChange={(e)=>setForm(withTranslation(form,lang,{heroText:e.target.value}))}/></label>
          <label><span>Office</span><input dir="rtl" value={translationValue(form,lang,'office')} onChange={(e)=>setForm(withTranslation(form,lang,{office:e.target.value}))}/></label>
          <label><span>Working hours</span><input dir="rtl" value={translationValue(form,lang,'workingHours')} onChange={(e)=>setForm(withTranslation(form,lang,{workingHours:e.target.value}))}/></label>
          <label><span>Info panel title</span><input dir="rtl" value={translationValue(form,lang,'infoTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{infoTitle:e.target.value}))}/></label>
          <label className="span-2"><span>Info panel text</span><textarea dir="rtl" rows={2} value={translationValue(form,lang,'infoText')} onChange={(e)=>setForm(withTranslation(form,lang,{infoText:e.target.value}))}/></label>
          <label><span>Map title</span><input dir="rtl" value={translationValue(form,lang,'mapTitle')} onChange={(e)=>setForm(withTranslation(form,lang,{mapTitle:e.target.value}))}/></label>
          <label><span>Map text</span><input dir="rtl" value={translationValue(form,lang,'mapText')} onChange={(e)=>setForm(withTranslation(form,lang,{mapText:e.target.value}))}/></label>
        </div></div>)}</div>
      </section>
      <section className="admin-products-list"><div className="admin-products-list-head"><div><strong>Contact Divisions</strong><span>{form.divisions.filter(d=>d.visible).length} visible</span></div></div>
        {form.divisions.map((d,index)=><article className="admin-form-section" key={d.id}><div className="admin-card-head"><div><span>{d.id.toUpperCase()}</span><h2>{d.title}</h2></div><label className="admin-checkbox-field"><input type="checkbox" checked={d.visible} onChange={e=>updateDivision(index,{visible:e.target.checked})}/><span>Visible</span></label></div><div className="admin-form-grid">
          <label><span>Label</span><input value={d.label} onChange={e=>updateDivision(index,{label:e.target.value})}/></label><label><span>Title</span><input value={d.title} onChange={e=>updateDivision(index,{title:e.target.value})}/></label><label className="span-2"><span>Description</span><textarea rows={3} value={d.text} onChange={e=>updateDivision(index,{text:e.target.value})}/></label><label><span>Sort order</span><input type="number" value={d.sortOrder} onChange={e=>updateDivision(index,{sortOrder:Number(e.target.value)})}/></label>
        </div><div className="admin-translation-panel"><h4>دری / پښتو</h4>{(['fa','ps'] as TranslationLanguage[]).map((lang)=><div key={lang}><h4>{lang==='fa'?'دری':'پښتو'}</h4><div className="admin-form-grid"><label><span>Label</span><input dir="rtl" value={translationValue(d,lang,'label')} onChange={(e)=>updateDivision(index,{translations:{...(d.translations||{}),[lang]:{...(d.translations?.[lang]||{}),label:e.target.value}}})}/></label><label><span>Title</span><input dir="rtl" value={translationValue(d,lang,'title')} onChange={(e)=>updateDivision(index,{translations:{...(d.translations||{}),[lang]:{...(d.translations?.[lang]||{}),title:e.target.value}}})}/></label><label className="span-2"><span>Description</span><textarea dir="rtl" rows={3} value={translationValue(d,lang,'text')} onChange={(e)=>updateDivision(index,{translations:{...(d.translations||{}),[lang]:{...(d.translations?.[lang]||{}),text:e.target.value}}})}/></label></div></div>)}</div></article>)}
      </section>
    </form>
  </div>
}

function MessagesManager(){
  const [items,setItems]=useState<ContactMessageRecord[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [selected,setSelected]=useState<ContactMessageRecord|null>(null)
  const load=async()=>{setLoading(true);setError('');try{setItems((await adminApi.messages()).messages)}catch(e){setError(e instanceof Error?e.message:'Unable to load messages.')}finally{setLoading(false)}}
  useEffect(()=>{void load()},[])
  const open=async(item:ContactMessageRecord)=>{setSelected(item);if(item.status==='new'){try{const updated=(await adminApi.updateMessageStatus(item.id,'read')).message;setSelected(updated);setItems(v=>v.map(x=>x.id===updated.id?updated:x))}catch{}}}
  const toggle=async(item:ContactMessageRecord)=>{try{const updated=(await adminApi.updateMessageStatus(item.id,item.status==='new'?'read':'new')).message;setItems(v=>v.map(x=>x.id===updated.id?updated:x));if(selected?.id===updated.id)setSelected(updated)}catch(e){setError(e instanceof Error?e.message:'Unable to update message.')}}
  const remove=async(item:ContactMessageRecord)=>{if(!window.confirm(`Delete message from ${item.name}?`))return;try{await adminApi.deleteMessage(item.id);setItems(v=>v.filter(x=>x.id!==item.id));if(selected?.id===item.id)setSelected(null)}catch(e){setError(e instanceof Error?e.message:'Unable to delete message.')}}
  if(loading)return <div className="admin-products-loading"><div className="admin-loader"/><span>Loading messages…</span></div>
  const unread=items.filter(i=>i.status==='new').length
  return <div className="admin-products-view admin-messages-view"><div className="admin-page-heading"><div><span>INBOX</span><h1>Messages & Requests</h1><p>Contact messages and demo booking requests submitted from the public website.</p></div><div className="admin-date-chip"><MessageSquare size={16}/>{unread} unread</div></div>{error&&<div className="admin-products-alert is-error">{error}</div>}
    <section className="admin-products-list"><div className="admin-products-list-head"><div><strong>Contact Inbox</strong><span>{items.length} total messages</span></div><button className="admin-secondary-action" onClick={()=>void load()}><RefreshCw size={15}/> Refresh</button></div>
      {!items.length&&<div className="admin-module-empty"><MessageSquare size={28}/><h2>No messages yet.</h2><p>New contact messages and demo requests will appear here.</p></div>}
      {items.map(item=><article className={`admin-product-row admin-message-row ${item.status==='new'?'is-unread':''}`} key={item.id}><div className="admin-product-row-main"><div><small className={item.status==='new'?'is-visible':''}>{item.status==='new'?'NEW':'READ'}</small><small className={item.requestType==='demo'?'is-demo':''}>{item.requestType==='demo'?'DEMO':'CONTACT'}</small><small>{new Intl.DateTimeFormat('en',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.createdAt))}</small></div><h3>{item.subject||'Contact request'} · {item.name}</h3><p>{item.message}</p><small>{item.phone}{item.email?` · ${item.email}`:''}{item.service?` · ${item.service}`:''}</small></div><div className="admin-product-row-actions"><button title="View" onClick={()=>void open(item)}><Eye size={16}/></button><button title={item.status==='new'?'Mark read':'Mark unread'} onClick={()=>void toggle(item)}>{item.status==='new'?<Eye size={16}/>:<EyeOff size={16}/>}</button><button className="danger" title="Delete" onClick={()=>void remove(item)}><Trash2 size={16}/></button></div></article>)}
    </section>
    {selected&&<div className="admin-product-modal" role="dialog" aria-modal="true"><button className="admin-product-modal-backdrop" onClick={()=>setSelected(null)} aria-label="Close message"/><div className="admin-product-form"><header><div><span>{selected.requestType==='demo'?'DEMO BOOKING REQUEST':'CONTACT MESSAGE'}</span><h2>{selected.subject||'Contact request'}</h2></div><button onClick={()=>setSelected(null)}><X size={20}/></button></header><div className="admin-product-form-scroll"><section className="admin-form-section"><div className="admin-form-grid"><label><span>Name</span><input value={selected.name} readOnly/></label><label><span>Phone</span><input value={selected.phone} readOnly/></label><label><span>Email</span><input value={selected.email||'—'} readOnly/></label><label><span>Division</span><input value={selected.division||'—'} readOnly/></label><label><span>Service / Product</span><input value={selected.service||'—'} readOnly/></label><label><span>Received</span><input value={new Date(selected.createdAt).toLocaleString()} readOnly/></label>{selected.requestType==='demo'&&<><label><span>Company</span><input value={selected.company||'—'} readOnly/></label><label><span>Meeting Type</span><input value={selected.meetingType||'—'} readOnly/></label><label><span>Preferred Date</span><input value={selected.preferredDate||'—'} readOnly/></label><label><span>Preferred Time</span><input value={selected.preferredTime||'—'} readOnly/></label><label><span>Time Zone</span><input value={selected.timeZone||'—'} readOnly/></label></>}<label className="span-2"><span>Message</span><textarea rows={8} value={selected.message} readOnly/></label></div></section></div><footer><button onClick={()=>void toggle(selected)}>{selected.status==='new'?'Mark Read':'Mark Unread'}</button><button className="save" onClick={()=>setSelected(null)}>Close</button></footer></div></div>}
  </div>
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
          {section === 'dashboard' ? <Dashboard /> : section === 'products' ? <ProductManager /> : section === 'services' ? <ServiceManager /> : section === 'news' ? <NewsManager /> : section === 'about' ? <AboutManager /> : section === 'contact' ? <ContactManager /> : section === 'messages' ? <MessagesManager /> : <SectionPlaceholder section={section} />}
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
