import { useEffect, useMemo, useState } from 'react'
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

type ProductCategory = 'education' | 'travel' | 'technology' | 'media'
type ProductFilter = 'all' | ProductCategory

type ProductItem = {
  id: string
  category: ProductCategory
  title: string
  subtitle: string
  description: string
  image: string
  features: string[]
  badge?: string
  priceLabel: string
}

const filters: { id: ProductFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'education', label: 'Education' },
  { id: 'travel', label: 'Travel' },
  { id: 'technology', label: 'Technology' },
  { id: 'media', label: 'Media' },
]

const products: ProductItem[] = [
  {
    id: 'china-admission',
    category: 'education',
    title: 'China Admission Package',
    subtitle: 'Study in China',
    description: 'A structured admission package for students applying to selected Chinese universities and programs.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=84',
    features: ['Admission Support', 'Document Review', 'Application Guidance'],
    badge: 'Popular',
    priceLabel: 'Contact for Price',
  },
  {
    id: 'turkey-study',
    category: 'education',
    title: 'Turkey Study Package',
    subtitle: 'University Admission',
    description: 'University admission assistance and student application support for study opportunities in Turkey.',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=84',
    features: ['University Options', 'Admission File', 'Student Support'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'scholarship-support',
    category: 'education',
    title: 'Scholarship Assistance',
    subtitle: 'Education Consultancy',
    description: 'Guidance for identifying suitable scholarship opportunities and preparing stronger applications.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=84',
    features: ['Opportunity Review', 'Application Help', 'Document Guidance'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'language-program',
    category: 'education',
    title: 'Language Program Package',
    subtitle: 'Study Preparation',
    description: 'Support for international language-course applications and study preparation pathways.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=84',
    features: ['Program Selection', 'Application Help', 'Study Guidance'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'turkey-tourist-visa',
    category: 'travel',
    title: 'Turkey Tourist Visa',
    subtitle: 'Tourist Visa Service',
    description: 'Professional document guidance and application support for Turkey tourist visa applicants.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=84',
    features: ['Document Check', 'Visa Guidance', 'Application Support'],
    badge: 'Featured',
    priceLabel: 'Contact for Price',
  },
  {
    id: 'dubai-tourist',
    category: 'travel',
    title: 'Dubai Tourist Package',
    subtitle: 'Travel Package',
    description: 'A convenient travel package combining visa assistance and planning support for Dubai trips.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=84',
    features: ['Visa Support', 'Trip Planning', 'Travel Assistance'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'family-travel',
    category: 'travel',
    title: 'Family Travel Package',
    subtitle: 'Family Travel',
    description: 'Coordinated travel support for families who want one clear process for their journey.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84',
    features: ['Family Support', 'Travel Planning', 'Document Guidance'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'air-ticket',
    category: 'travel',
    title: 'Air Ticket Service',
    subtitle: 'Flight & Ticketing',
    description: 'Flight-search and ticketing assistance built around your destination, schedule and travel plan.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=84',
    features: ['Flight Options', 'Ticket Support', 'Travel Assistance'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'smart-gold',
    category: 'technology',
    title: 'Smart Gold',
    subtitle: 'Gold & Jewelry Management',
    description: 'A ready-made business system for gold shops with sales, purchases, inventory, ledgers and reporting.',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=84',
    features: ['Inventory', 'Sales & Purchases', 'Financial Reports'],
    badge: 'Ready System',
    priceLabel: 'Request a Quote',
  },
  {
    id: 'pharmacy-erp',
    category: 'technology',
    title: 'Pharmacy ERP',
    subtitle: 'Pharmacy Management',
    description: 'A complete pharmacy-management solution for stock, purchasing, sales, customers and reporting.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=84',
    features: ['Medicine Stock', 'Billing', 'Supplier Management'],
    priceLabel: 'Request a Quote',
  },
  {
    id: 'hospital-management',
    category: 'technology',
    title: 'Hospital Management System',
    subtitle: 'Healthcare Software',
    description: 'A modular system for hospital operations, patient records, departments, billing and management.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=84',
    features: ['Patient Records', 'Departments', 'Billing & Reports'],
    priceLabel: 'Request a Quote',
  },
  {
    id: 'restaurant-system',
    category: 'technology',
    title: 'Restaurant Management System',
    subtitle: 'Restaurant Software',
    description: 'A ready business system for orders, tables, stock, kitchen workflow and financial reporting.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=84',
    features: ['Orders', 'Inventory', 'Reports'],
    priceLabel: 'Request a Quote',
  },
  {
    id: 'social-media',
    category: 'media',
    title: 'Social Media Package',
    subtitle: 'Digital Marketing',
    description: 'A consistent social-media package with creative content, design and campaign support for brands.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=84',
    features: ['Content Design', 'Campaign Support', 'Brand Consistency'],
    badge: 'Popular',
    priceLabel: 'Contact for Price',
  },
  {
    id: 'branding-package',
    category: 'media',
    title: 'Branding Package',
    subtitle: 'Brand Identity',
    description: 'A professional identity package for companies that need a stronger and more consistent visual presence.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=84',
    features: ['Brand Direction', 'Visual Identity', 'Design Assets'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'video-production',
    category: 'media',
    title: 'Video Production Package',
    subtitle: 'Media Production',
    description: 'Production support for promotional, corporate and social video content designed around your message.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=84',
    features: ['Production', 'Editing', 'Creative Direction'],
    priceLabel: 'Contact for Price',
  },
  {
    id: 'ad-campaign',
    category: 'media',
    title: 'Advertising Campaign Package',
    subtitle: 'Advertising',
    description: 'A coordinated campaign package for businesses that want stronger reach, visuals and promotion.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=84',
    features: ['Campaign Creative', 'Ad Content', 'Promotion Support'],
    priceLabel: 'Contact for Price',
  },
]

const categoryMeta = {
  education: { label: 'Education', icon: GraduationCap },
  travel: { label: 'Travel', icon: PlaneTakeoff },
  technology: { label: 'Technology', icon: Database },
  media: { label: 'Media', icon: Clapperboard },
}

type ProductsPageProps = {
  route?: string
}

const getFilterFromRoute = (route: string): ProductFilter => {
  const routeCategory = route.split('/')[2]
  if (routeCategory === 'tech') return 'technology'
  return filters.some((filter) => filter.id === routeCategory) ? (routeCategory as ProductFilter) : 'all'
}

export default function ProductsPage({ route = '#/products' }: ProductsPageProps) {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>(() => getFilterFromRoute(route))
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setActiveFilter(getFilterFromRoute(route))
  }, [route])

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
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [activeFilter, searchTerm])

  return (
    <main className="products-page" aria-labelledby="products-page-title">
      <section className="products-catalog-hero">
        <div className="products-catalog-copy">
          <span className="products-page-kicker">AFGHAN POWER GROUP · PRODUCTS</span>
          <h1 id="products-page-title">Explore Our Products &amp; Packages</h1>
          <p>
            Discover education packages, travel services, ready-made software and media solutions from across Afghan Power Group.
          </p>
        </div>
      </section>

      <section className="products-discovery" aria-label="Filter and search products">
        <div className="products-filter-group" role="group" aria-label="Filter products by division">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={activeFilter === filter.id ? 'active' : ''}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
              {filter.id !== 'all' && (
                <span>{products.filter((product) => product.category === filter.id).length}</span>
              )}
            </button>
          ))}
        </div>

        <label className="products-search-box">
          <Search size={19} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products, packages, visas, databases..."
            aria-label="Search products"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search">
              <X size={17} />
            </button>
          )}
          <span className="products-search-shortcut">⌘ K</span>
        </label>
      </section>

      <section className="products-results" aria-live="polite">
        <div className="products-results-head">
          <div>
            <span>CURATED CATALOG</span>
            <h2>{activeFilter === 'all' ? 'All Products' : `${categoryMeta[activeFilter].label} Products`}</h2>
          </div>
          <p><strong>{visibleProducts.length}</strong> products available</p>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="products-catalog-grid">
            {visibleProducts.map((product) => {
              const MetaIcon = categoryMeta[product.category].icon
              return (
                <article className={`catalog-product-card product-${product.category}`} key={product.id}>
                  <div className="catalog-product-image">
                    <img src={product.image} alt="" loading="lazy" />
                    <span className="catalog-category-badge"><MetaIcon size={14} /> {categoryMeta[product.category].label}</span>
                    {product.badge && <span className="catalog-featured-badge"><Sparkles size={12} /> {product.badge}</span>}
                  </div>

                  <div className="catalog-product-body">
                    <span className="catalog-product-subtitle">{product.subtitle}</span>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <div className="catalog-product-features">
                      {product.features.map((feature) => (
                        <span key={feature}><BadgeCheck size={13} /> {feature}</span>
                      ))}
                    </div>
                    <div className="catalog-product-footer">
                      <div>
                        <small>PRICING</small>
                        <strong>{product.priceLabel}</strong>
                      </div>
                      <a href={`#/products/${product.id}`}>
                        View Details <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="products-empty-state">
            <div><Briefcase size={30} /></div>
            <h3>No matching products found.</h3>
            <p>Try another keyword or switch to a different division.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setActiveFilter('all') }}>
              Show all products
            </button>
          </div>
        )}
      </section>
    </main>
  )
}


