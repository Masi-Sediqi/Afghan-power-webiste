import { useEffect, useMemo, useState, type WheelEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock3,
  Database,
  ExternalLink,
  FileText,
  GraduationCap,
  PlaneTakeoff,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { localizeProduct, productsApi, type ProductCategory, type ProductRecord } from './productsApi'
import { useSiteLanguage } from './useSiteLanguage'

const categoryMeta = {
  education: { label: 'Education', icon: GraduationCap, className: 'education' },
  travel: { label: 'Travel', icon: PlaneTakeoff, className: 'travel' },
  technology: { label: 'Technology', icon: Database, className: 'technology' },
  media: { label: 'Media', icon: Clapperboard, className: 'media' },
}


function getYouTubeEmbedUrl(value: string) {
  const raw = value.trim()
  if (!raw) return ''
  try {
    const url = new URL(raw)
    const host = url.hostname.replace(/^www\./, '').toLowerCase()
    let videoId = ''
    if (host === 'youtu.be') videoId = url.pathname.split('/').filter(Boolean)[0] || ''
    else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') || ''
      else {
        const parts = url.pathname.split('/').filter(Boolean)
        if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || ''
      }
    }
    if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return ''
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  } catch {
    return ''
  }
}

function DetailIcon({ category }: { category: ProductCategory }) {
  const Icon = categoryMeta[category].icon
  return <Icon size={17} />
}

export default function ProductDetailsPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<ProductRecord | null>(null)
  const [allProducts, setAllProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const language = useSiteLanguage()

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      setActiveImage(0)
      try {
        const [detail, list] = await Promise.all([productsApi.get(productId), productsApi.list()])
        if (!active) return
        setProduct(detail.product)
        setAllProducts(list.products)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load this product.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [productId])

  const related = useMemo(
    () => product ? allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3) : [],
    [allProducts, product],
  )

  if (loading) {
    return <main className="product-detail-page product-detail-missing"><div className="product-detail-missing-card"><div className="admin-loader"/><h1>Loading product…</h1><p>Please wait while the product details are prepared.</p></div></main>
  }

  if (!product || error) {
    return (
      <main className="product-detail-page product-detail-missing">
        <div className="product-detail-missing-card">
          <Sparkles size={28} /><h1>Product not found</h1><p>{error || 'The requested product is not available in the current catalog.'}</p>
          <a href="#/products"><ArrowLeft size={17} /> Back to Products</a>
        </div>
      </main>
    )
  }

  const displayProduct = localizeProduct(product, language)
  const displayRelated = related.map((item) => localizeProduct(item, language))
  const meta = categoryMeta[displayProduct.category]
  const images = displayProduct.images.length ? displayProduct.images : ['/afghan-power-brand.png']
  const youtubeEmbedUrl = getYouTubeEmbedUrl(displayProduct.youtubeVideoLink || '')
  const demoCopy = language === 'fa'
    ? { liveDemo: 'دموی زنده', kicker: 'نمایش محصول', heading: `${displayProduct.title} را در عمل ببینید.`, body: 'نمای کلی محصول، رابط کاربری و روندهای اصلی را مستقیماً از یوتیوب تماشا کنید.' }
    : language === 'ps'
      ? { liveDemo: 'ژوندۍ ډیمو', kicker: 'د محصول ننداره', heading: `${displayProduct.title} په عمل کې وګورئ.`, body: 'د محصول عمومي بڼه، انټرفېس او مهم کاري بهیرونه مستقیماً په یوټیوب کې وګورئ.' }
      : { liveDemo: 'Live Demo', kicker: 'PRODUCT DEMO', heading: `See ${displayProduct.title} in action.`, body: 'Watch the product overview, interface and key workflow directly from YouTube.' }
  const nextImage = (direction: number) => setActiveImage((current) => (current + direction + images.length) % images.length)
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 8 || images.length < 2) return
    nextImage(event.deltaY > 0 ? 1 : -1)
  }

  return (
    <main className={`product-detail-page product-detail-${meta.className}`}>
      <div className="product-detail-breadcrumb">
        <a href="#/products"><ArrowLeft size={16} /> Products</a><span>/</span><span>{meta.label}</span><span>/</span><strong>{displayProduct.title}</strong>
      </div>

      <section className="product-detail-hero">
        <div className="product-gallery-sticky">
          <div className="product-gallery-main" onWheel={handleWheel} onClick={() => setZoomOpen(true)} role="button" tabIndex={0} aria-label="Zoom product image">
            {images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${displayProduct.title} view ${index + 1}`} className={index === activeImage ? 'active' : ''} />)}
            <div className="product-gallery-count">{String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</div>
            {images.length > 1 && <div className="product-gallery-controls">
              <button type="button" onClick={(event) => { event.stopPropagation(); nextImage(-1) }} aria-label="Previous image"><ChevronLeft /></button>
              <button type="button" onClick={(event) => { event.stopPropagation(); nextImage(1) }} aria-label="Next image"><ChevronRight /></button>
            </div>}
          </div>
          {images.length > 1 && <div className="product-gallery-thumbs" aria-label="Product images">{images.map((image, index) => (
            <button key={`${image}-${index}`} type="button" className={index === activeImage ? 'active' : ''} onClick={() => setActiveImage(index)}><img src={image} alt="" /></button>
          ))}</div>}
          <p className="product-gallery-hint">Scroll over the gallery or use the arrows to change images.</p>
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category"><DetailIcon category={displayProduct.category} /> {meta.label}</div>
          <span className="product-detail-subtitle">{displayProduct.subtitle}</span>
          <h1>{displayProduct.title}</h1>
          <p className="product-detail-lead">{displayProduct.description}</p>
          <div className="product-detail-highlights">{displayProduct.features.map((item) => <span key={item}><BadgeCheck size={15} /> {item}</span>)}</div>
          <div className="product-detail-specs">{displayProduct.details.map((item) => <div key={`${item.label}-${item.value}`}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
          <div className="product-detail-actions">
            <a className="product-detail-primary" href={`mailto:info@afghanpower.com?subject=${encodeURIComponent(displayProduct.title)}`}>{displayProduct.actionLabel} <ArrowRight size={17} /></a>
            {displayProduct.secondaryLabel && <a className="product-detail-secondary" href={displayProduct.secondaryHref || '#contact'}>{displayProduct.secondaryLabel} <ExternalLink size={16} /></a>}
            {displayProduct.demoLink && <a className="product-detail-demo" href={displayProduct.demoLink} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor"/> {demoCopy.liveDemo} <ExternalLink size={15}/></a>}
          </div>
          <div className="product-detail-note"><ShieldCheck size={18} /><span>Final terms, timelines and requirements are confirmed during consultation before any application, booking or project starts.</span></div>
        </div>
      </section>

      {youtubeEmbedUrl && <section className="product-video-showcase reveal">
        <div className="product-video-heading">
          <div><span className="detail-section-kicker"><Play size={15} fill="currentColor"/> {demoCopy.kicker}</span><h2>{demoCopy.heading}</h2></div>
          <p>{demoCopy.body}</p>
        </div>
        <div className="product-video-frame">
          <iframe src={youtubeEmbedUrl} title={`${displayProduct.title} video demo`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </div>
      </section>}

      <section className="product-detail-content">
        <article className="product-detail-description"><span className="detail-section-kicker"><FileText size={15} /> DETAILS</span><h2>{displayProduct.sectionTitle}</h2><p>{displayProduct.sectionBody}</p></article>
        <div className="product-detail-columns">
          <article><span className="detail-section-kicker"><Sparkles size={15} /> RECOMMENDED</span><h3>{displayProduct.recommendedTitle}</h3><ul>{displayProduct.recommendedFor.map((item) => <li key={item}><BadgeCheck size={16} /> {item}</li>)}</ul></article>
          <article><span className="detail-section-kicker"><Clock3 size={15} /> INFORMATION</span><h3>{displayProduct.requirementsTitle}</h3><ul>{displayProduct.requirements.map((item) => <li key={item}><BadgeCheck size={16} /> {item}</li>)}</ul></article>
        </div>
      </section>

      {zoomOpen && <div className="product-image-lightbox" onClick={() => setZoomOpen(false)} role="dialog" aria-modal="true" aria-label="Product image preview">
        <button type="button" className="product-lightbox-close" onClick={() => setZoomOpen(false)} aria-label="Close image preview"><X size={22} /></button>
        <img src={images[activeImage]} alt={`${displayProduct.title} enlarged view`} onClick={(event) => event.stopPropagation()} />
      </div>}

      {displayRelated.length > 0 && <section className="related-products">
        <div className="related-products-head"><div><span>YOU MAY ALSO LIKE</span><h2>Related {meta.label} products</h2></div><a href={`#/products/${displayProduct.category === 'technology' ? 'tech' : displayProduct.category}`}>View all <ArrowRight size={16} /></a></div>
        <div className="related-products-grid">{displayRelated.map((item) => <a href={`#/products/${item.id}`} className="related-product-card" key={item.id}>
          <img src={item.images[0]} alt="" loading="lazy" /><div><span>{categoryMeta[item.category].label}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div><ArrowRight size={18} />
        </a>)}</div>
      </section>}
    </main>
  )
}
