import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clapperboard,
  Database,
  GraduationCap,
  PlaneTakeoff,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { productsApi, type ProductCategory, type ProductRecord } from './productsApi'

type ProductFilter = 'all' | ProductCategory

const filters: { id: ProductFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'education', label: 'Education' },
  { id: 'travel', label: 'Travel' },
  { id: 'technology', label: 'Technology' },
  { id: 'media', label: 'Media' },
]

const categoryMeta = {
  education: { label: 'Education', icon: GraduationCap },
  travel: { label: 'Travel', icon: PlaneTakeoff },
  technology: { label: 'Technology', icon: Database },
  media: { label: 'Media', icon: Clapperboard },
}

type ProductsPageProps = { route?: string }

const getFilterFromRoute = (route: string): ProductFilter => {
  const routeCategory = route.split('/')[2]
  if (routeCategory === 'tech') return 'technology'
  return filters.some((filter) => filter.id === routeCategory) ? (routeCategory as ProductFilter) : 'all'
}

export default function ProductsPage({ route = '#/products' }: ProductsPageProps) {
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<ProductFilter>(() => getFilterFromRoute(route))
  const [searchTerm, setSearchTerm] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await productsApi.list()
      setProducts(result.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadProducts() }, [])
  useEffect(() => { setActiveFilter(getFilterFromRoute(route)) }, [route])

  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeFilter === 'all' || product.category === activeFilter
      const searchableText = [
        product.title,
        product.subtitle,
        product.description,
        categoryMeta[product.category].label,
        ...product.features,
      ].join(' ').toLowerCase()
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [activeFilter, products, searchTerm])

  return (
    <main className="products-page" aria-labelledby="products-page-title">
      <section className="products-catalog-hero reveal">
        <div className="products-catalog-copy">
          <span className="products-page-kicker">AFGHAN POWER GROUP · PRODUCTS</span>
          <h1 id="products-page-title">Explore Our Products &amp; Packages</h1>
          <p>Discover education packages, travel services, ready-made software and media solutions from across Afghan Power Group.</p>
        </div>
      </section>

      <section className="products-discovery reveal" aria-label="Filter and search products">
        <div className="products-filter-group" role="group" aria-label="Filter products by division">
          {filters.map((filter) => (
            <button key={filter.id} type="button" className={activeFilter === filter.id ? 'active' : ''} onClick={() => setActiveFilter(filter.id)}>
              {filter.label}
              {filter.id !== 'all' && <span>{products.filter((product) => product.category === filter.id).length}</span>}
            </button>
          ))}
        </div>

        <label className="products-search-box">
          <Search size={19} />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search products, packages, visas, databases..." aria-label="Search products" />
          {searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search"><X size={17} /></button>}
          <span className="products-search-shortcut">⌘ K</span>
        </label>
      </section>

      <section className="products-results reveal" aria-live="polite">
        <div className="products-results-head">
          <div><span>CURATED CATALOG</span><h2>{activeFilter === 'all' ? 'All Products' : `${categoryMeta[activeFilter].label} Products`}</h2></div>
          <p><strong>{visibleProducts.length}</strong> products available</p>
        </div>

        {loading ? (
          <div className="products-empty-state"><div className="admin-loader"/><h3>Loading products…</h3><p>Please wait while the catalog is prepared.</p></div>
        ) : error ? (
          <div className="products-empty-state"><div><Briefcase size={30} /></div><h3>Products could not be loaded.</h3><p>{error}</p><button type="button" onClick={() => void loadProducts()}>Try again</button></div>
        ) : visibleProducts.length > 0 ? (
          <div className="products-catalog-grid">
            {visibleProducts.map((product, index) => {
              const MetaIcon = categoryMeta[product.category].icon
              return (
                <article className={`catalog-product-card product-${product.category} content-enter`} key={`${activeFilter}-${product.id}`} style={{ '--enter-delay': `${Math.min(index, 7) * 55}ms` } as CSSProperties}>
                  <div className="catalog-product-image">
                    <img src={product.images[0]} alt="" loading="lazy" />
                    <span className="catalog-category-badge"><MetaIcon size={14} /> {categoryMeta[product.category].label}</span>
                    {product.badge && <span className="catalog-featured-badge"><Sparkles size={12} /> {product.badge}</span>}
                  </div>
                  <div className="catalog-product-body">
                    <span className="catalog-product-subtitle">{product.subtitle}</span>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <div className="catalog-product-features">{product.features.map((feature) => <span key={feature}><BadgeCheck size={13} /> {feature}</span>)}</div>
                    <div className="catalog-product-footer">
                      <div><small>PRICING</small><strong>{product.priceLabel}</strong></div>
                      <a href={`#/products/${product.id}`}>View Details <ArrowRight size={16} /></a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="products-empty-state">
            <div><Briefcase size={30} /></div><h3>No matching products found.</h3><p>Try another keyword or switch to a different division.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setActiveFilter('all') }}>Show all products</button>
          </div>
        )}
      </section>
    </main>
  )
}
