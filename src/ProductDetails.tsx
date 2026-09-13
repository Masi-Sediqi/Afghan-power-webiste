import { useMemo, useState, type WheelEvent } from 'react'
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
  MapPin,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

type Category = 'education' | 'travel' | 'technology' | 'media'

type DetailRow = { label: string; value: string }

type ProductDetail = {
  id: string
  category: Category
  title: string
  subtitle: string
  description: string
  images: string[]
  highlights: string[]
  details: DetailRow[]
  sectionTitle: string
  sectionBody: string
  recommendedTitle: string
  recommendedFor: string[]
  requirementsTitle: string
  requirements: string[]
  actionLabel: string
  secondaryLabel?: string
  secondaryHref?: string
}

const categoryMeta = {
  education: { label: 'Education', icon: GraduationCap, className: 'education' },
  travel: { label: 'Travel', icon: PlaneTakeoff, className: 'travel' },
  technology: { label: 'Technology', icon: Database, className: 'technology' },
  media: { label: 'Media', icon: Clapperboard, className: 'media' },
}

const imageSets: Record<Category, string[]> = {
  education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=88',
  ],
  travel: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=88',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=88',
  ],
  media: [
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=88',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1600&q=88',
  ],
}

const common = {
  education: {
    details: [
      { label: 'Service Type', value: 'Education & admission support' },
      { label: 'Processing Time', value: 'Depends on institution and intake' },
      { label: 'Application Window', value: 'Confirmed during consultation' },
      { label: 'Visa Support', value: 'Available where applicable' },
    ],
    recommendedTitle: 'Best suited for',
    requirementsTitle: 'Typical documents',
    recommendedFor: ['Students planning international study', 'Applicants who want guided document preparation', 'Families who prefer one clear admission process'],
    requirements: ['Passport / ID documents', 'Academic records and certificates', 'Photo and application documents', 'Any institution-specific requirements'],
  },
  travel: {
    details: [
      { label: 'Visa Type', value: 'Tourist / travel service' },
      { label: 'Validity', value: 'As issued by the relevant authority' },
      { label: 'Stay Duration', value: 'Depends on the issued visa/package' },
      { label: 'Processing Time', value: 'Varies by destination and case' },
      { label: 'Entry Type', value: 'Confirmed based on current rules' },
    ],
    recommendedTitle: 'Who this service is for',
    requirementsTitle: 'Typical requirements',
    recommendedFor: ['Individuals planning leisure travel', 'Families needing coordinated travel support', 'Clients who want document guidance before submission'],
    requirements: ['Valid passport', 'Recent photographs', 'Travel/supporting documents', 'Additional documents requested by the destination'],
  },
  technology: {
    details: [
      { label: 'Product Type', value: 'Ready-made business system' },
      { label: 'Platform', value: 'Web / desktop-ready architecture' },
      { label: 'Languages', value: 'English, Dari and Pashto ready' },
      { label: 'Deployment', value: 'On-premise or hosted options' },
      { label: 'Support', value: 'Setup, training and after-sales support' },
    ],
    recommendedTitle: 'Recommended for',
    requirementsTitle: 'Core capabilities',
    recommendedFor: ['Businesses replacing manual records', 'Teams needing centralized reporting', 'Companies that want a scalable operational system'],
    requirements: ['Role-based access', 'Operational records and reporting', 'Search and filtering', 'Backup-ready data structure'],
  },
  media: {
    details: [
      { label: 'Package Type', value: 'Creative media service' },
      { label: 'Delivery Time', value: 'Defined by package scope' },
      { label: 'Revisions', value: 'Defined during project confirmation' },
      { label: 'Platforms', value: 'Digital and social channels' },
      { label: 'Format', value: 'Optimized for agreed channels' },
    ],
    recommendedTitle: 'Recommended for',
    requirementsTitle: 'What can be included',
    recommendedFor: ['Businesses building a stronger brand presence', 'Campaigns that need consistent creative output', 'Companies launching new products or services'],
    requirements: ['Creative direction', 'Brand-aligned production', 'Platform-ready exports', 'Campaign or publishing support'],
  },
} as const

function makeProduct(
  id: string,
  category: Category,
  title: string,
  subtitle: string,
  description: string,
  highlights: string[],
  overrides: Partial<ProductDetail> = {},
): ProductDetail {
  const base = common[category]
  return {
    id,
    category,
    title,
    subtitle,
    description,
    images: imageSets[category],
    highlights,
    details: [...base.details],
    sectionTitle: 'About this product',
    sectionBody: description,
    recommendedTitle: base.recommendedTitle,
    recommendedFor: [...base.recommendedFor],
    requirementsTitle: base.requirementsTitle,
    requirements: [...base.requirements],
    actionLabel: category === 'technology' ? 'Request a Consultation' : 'Start an Inquiry',
    ...overrides,
  }
}

const products: ProductDetail[] = [
  makeProduct('china-admission', 'education', 'China Admission Package', 'Study in China', 'A guided admission service for students exploring selected Chinese universities and international study pathways.', ['Admission support', 'Document review', 'Application guidance'], {
    details: [
      { label: 'Destination', value: 'China' },
      { label: 'Study Level', value: 'Program dependent' },
      { label: 'Intake', value: 'Based on university intake' },
      { label: 'Deadline', value: 'Varies by university' },
      { label: 'Scholarship', value: 'Options reviewed when available' },
      { label: 'Visa Support', value: 'Student visa guidance included' },
    ],
    sectionBody: 'This package is designed to organize the admission journey from initial program selection through document preparation and application follow-up. Final university requirements, fees and deadlines are confirmed before submission.',
  }),
  makeProduct('turkey-study', 'education', 'Turkey Study Package', 'University Admission', 'Admission guidance for students planning to apply to universities and study programs in Turkey.', ['University options', 'Admission file', 'Student support'], {
    details: [
      { label: 'Destination', value: 'Turkey' },
      { label: 'Study Level', value: 'Bachelor / Master / program dependent' },
      { label: 'Intake', value: 'Based on selected university' },
      { label: 'Deadline', value: 'Confirmed before application' },
      { label: 'Language', value: 'Depends on program' },
      { label: 'Visa Support', value: 'Guidance available' },
    ],
  }),
  makeProduct('scholarship-support', 'education', 'Scholarship Assistance', 'Education Consultancy', 'Structured support for finding relevant scholarship opportunities and preparing a stronger application file.', ['Opportunity review', 'Application help', 'Document guidance']),
  makeProduct('language-program', 'education', 'Language Program Package', 'Study Preparation', 'Application and planning support for international language programs and study-preparation pathways.', ['Program selection', 'Application help', 'Study guidance']),

  makeProduct('turkey-tourist-visa', 'travel', 'Turkey Tourist Visa', 'Tourist Visa Service', 'Professional guidance for Turkey tourist visa documentation, preparation and application support.', ['Document check', 'Visa guidance', 'Application support'], {
    details: [
      { label: 'Country', value: 'Turkey' },
      { label: 'Visa Type', value: 'Tourist visa' },
      { label: 'Validity', value: 'As issued by the Turkish authority' },
      { label: 'Stay Duration', value: 'According to the granted visa' },
      { label: 'Processing Time', value: 'Varies by case and current procedures' },
      { label: 'Entry Type', value: 'As stated on the issued visa' },
    ],
    sectionTitle: 'About this visa service',
    sectionBody: 'We help clients prepare and review the required file before submission. Visa validity, permitted stay and processing times are controlled by the relevant authorities and are confirmed based on the applicant’s case and current rules.',
  }),
  makeProduct('dubai-tourist', 'travel', 'Dubai Tourist Package', 'Travel Package', 'Travel planning and visa-support package for clients arranging a Dubai trip.', ['Visa support', 'Trip planning', 'Travel assistance'], {
    details: [
      { label: 'Destination', value: 'Dubai, UAE' },
      { label: 'Package Type', value: 'Tourist travel support' },
      { label: 'Visa Validity', value: 'Subject to current UAE rules' },
      { label: 'Stay Duration', value: 'Based on selected visa/package' },
      { label: 'Processing Time', value: 'Confirmed during consultation' },
      { label: 'Travel Support', value: 'Available' },
    ],
  }),
  makeProduct('family-travel', 'travel', 'Family Travel Package', 'Family Travel', 'Coordinated travel support for families that want one organized process for documentation and planning.', ['Family support', 'Travel planning', 'Document guidance']),
  makeProduct('air-ticket', 'travel', 'Air Ticket Service', 'Flight & Ticketing', 'Flight search, itinerary review and ticketing assistance based on destination, schedule and travel preferences.', ['Flight options', 'Ticket support', 'Travel assistance'], {
    details: [
      { label: 'Service', value: 'Flight search & ticketing' },
      { label: 'Destinations', value: 'Based on available routes' },
      { label: 'Cabin', value: 'Economy / other options on request' },
      { label: 'Schedule', value: 'Matched to available flights' },
      { label: 'Ticket Terms', value: 'Airline fare rules apply' },
    ],
  }),

  makeProduct('smart-gold', 'technology', 'Smart Gold', 'Gold & Jewelry Management', 'A ready-made management system for gold and jewelry businesses with sales, purchases, inventory, customer and supplier ledgers and reporting.', ['Inventory', 'Sales & purchases', 'Financial reports'], {
    details: [
      { label: 'Industry', value: 'Gold & jewelry' },
      { label: 'System Type', value: 'Business management / ERP' },
      { label: 'Platform', value: 'Web-ready application' },
      { label: 'Languages', value: 'English, Dari, Pashto ready' },
      { label: 'Deployment', value: 'Local or hosted setup' },
      { label: 'Support', value: 'Setup, training and support' },
    ],
    sectionTitle: 'What Smart Gold is built for',
    sectionBody: 'Smart Gold is intended for jewelry shops and gold businesses that need accurate operational records, inventory visibility, supplier/customer ledgers, purchasing, sales and management reports in one system.',
    recommendedFor: ['Gold and jewelry shops', 'Wholesalers and retailers', 'Businesses tracking weight, purity and financial balances'],
    requirementsTitle: 'Key modules',
    requirements: ['Sales & purchases', 'Inventory and product records', 'Customers & suppliers', 'Payments and receivables', 'Reports and backup tools'],
    secondaryLabel: 'Open Demo',
    secondaryHref: '#contact',
  }),
  makeProduct('pharmacy-erp', 'technology', 'Pharmacy ERP', 'Pharmacy Management', 'A business management system for pharmacy stock, purchasing, sales, suppliers, customers and reporting.', ['Medicine stock', 'Billing', 'Supplier management'], {
    recommendedFor: ['Retail pharmacies', 'Wholesale pharmacies', 'Multi-user pharmacy operations'],
    requirements: ['Medicine & batch records', 'Purchasing and sales', 'Expiry-aware stock workflows', 'Suppliers and customers', 'Reports and backup'],
    secondaryLabel: 'Open Demo', secondaryHref: '#contact',
  }),
  makeProduct('hospital-management', 'technology', 'Hospital Management System', 'Healthcare Software', 'A modular system for patient records, departments, billing, staff and hospital operations.', ['Patient records', 'Departments', 'Billing & reports'], {
    recommendedFor: ['Hospitals', 'Clinics', 'Healthcare organizations with multiple departments'],
    requirements: ['Patient registration', 'Departments & services', 'Billing', 'Staff and records', 'Management reports'],
    secondaryLabel: 'Open Demo', secondaryHref: '#contact',
  }),
  makeProduct('restaurant-system', 'technology', 'Restaurant Management System', 'Restaurant Software', 'A management solution for orders, tables, stock, kitchen workflows and business reporting.', ['Orders', 'Inventory', 'Reports'], {
    recommendedFor: ['Restaurants', 'Cafes', 'Food businesses needing order and stock control'],
    requirements: ['Order management', 'Table workflows', 'Kitchen flow', 'Inventory', 'Sales reports'],
    secondaryLabel: 'Open Demo', secondaryHref: '#contact',
  }),

  makeProduct('social-media', 'media', 'Social Media Package', 'Digital Marketing', 'A recurring social media package for brands that need consistent content, design and campaign support.', ['Content design', 'Campaign support', 'Brand consistency'], {
    details: [
      { label: 'Package Type', value: 'Social media management' },
      { label: 'Deliverables', value: 'Defined by selected package' },
      { label: 'Platforms', value: 'Facebook / Instagram / agreed channels' },
      { label: 'Duration', value: 'Monthly or campaign-based' },
      { label: 'Revisions', value: 'Defined in package scope' },
      { label: 'Production Time', value: 'Scheduled content cycle' },
    ],
    secondaryLabel: 'View Portfolio', secondaryHref: '#contact',
  }),
  makeProduct('branding-package', 'media', 'Branding Package', 'Brand Identity', 'A visual identity package for organizations that want a stronger, more consistent brand presence.', ['Brand direction', 'Visual identity', 'Design assets'], {
    recommendedFor: ['New businesses', 'Rebranding projects', 'Organizations needing consistent visual identity'],
    secondaryLabel: 'View Portfolio', secondaryHref: '#contact',
  }),
  makeProduct('video-production', 'media', 'Video Production Package', 'Media Production', 'Creative production support for promotional, corporate and social video content.', ['Production', 'Editing', 'Creative direction'], {
    details: [
      { label: 'Package Type', value: 'Video production' },
      { label: 'Deliverables', value: 'Agreed video outputs' },
      { label: 'Duration', value: 'Based on production scope' },
      { label: 'Revisions', value: 'Defined before production' },
      { label: 'Platforms', value: 'Social / web / presentation' },
      { label: 'Production Time', value: 'Based on shoot and edit scope' },
    ],
    secondaryLabel: 'View Portfolio', secondaryHref: '#contact',
  }),
  makeProduct('ad-campaign', 'media', 'Advertising Campaign Package', 'Advertising', 'A coordinated advertising package for businesses that need campaign visuals, content and promotion support.', ['Campaign creative', 'Ad content', 'Promotion support'], {
    recommendedFor: ['Product launches', 'Seasonal campaigns', 'Businesses that need coordinated promotional creative'],
    secondaryLabel: 'View Portfolio', secondaryHref: '#contact',
  }),
]

function DetailIcon({ category }: { category: Category }) {
  const Icon = categoryMeta[category].icon
  return <Icon size={17} />
}

export default function ProductDetailsPage({ productId }: { productId: string }) {
  const product = products.find((item) => item.id === productId)
  const [activeImage, setActiveImage] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const related = useMemo(
    () => product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3) : [],
    [product],
  )

  if (!product) {
    return (
      <main className="product-detail-page product-detail-missing">
        <div className="product-detail-missing-card">
          <Sparkles size={28} />
          <h1>Product not found</h1>
          <p>The requested product is not available in the current catalog.</p>
          <a href="#/products"><ArrowLeft size={17} /> Back to Products</a>
        </div>
      </main>
    )
  }

  const meta = categoryMeta[product.category]
  const nextImage = (direction: number) => {
    setActiveImage((current) => (current + direction + product.images.length) % product.images.length)
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 8) return
    nextImage(event.deltaY > 0 ? 1 : -1)
  }

  return (
    <main className={`product-detail-page product-detail-${meta.className}`}>
      <div className="product-detail-breadcrumb">
        <a href="#/products"><ArrowLeft size={16} /> Products</a>
        <span>/</span>
        <span>{meta.label}</span>
        <span>/</span>
        <strong>{product.title}</strong>
      </div>

      <section className="product-detail-hero">
        <div className="product-gallery-sticky">
          <div className="product-gallery-main" onWheel={handleWheel} onClick={() => setZoomOpen(true)} role="button" tabIndex={0} aria-label="Zoom product image">
            {product.images.map((image, index) => (
              <img key={image} src={image} alt={`${product.title} view ${index + 1}`} className={index === activeImage ? 'active' : ''} />
            ))}
            <div className="product-gallery-count">{String(activeImage + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}</div>
            <div className="product-gallery-controls">
              <button type="button" onClick={(event) => { event.stopPropagation(); nextImage(-1) }} aria-label="Previous image"><ChevronLeft /></button>
              <button type="button" onClick={(event) => { event.stopPropagation(); nextImage(1) }} aria-label="Next image"><ChevronRight /></button>
            </div>
          </div>
          <div className="product-gallery-thumbs" aria-label="Product images">
            {product.images.map((image, index) => (
              <button key={image} type="button" className={index === activeImage ? 'active' : ''} onClick={() => setActiveImage(index)}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <p className="product-gallery-hint">Scroll over the gallery or use the arrows to change images.</p>
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category"><DetailIcon category={product.category} /> {meta.label}</div>
          <span className="product-detail-subtitle">{product.subtitle}</span>
          <h1>{product.title}</h1>
          <p className="product-detail-lead">{product.description}</p>

          <div className="product-detail-highlights">
            {product.highlights.map((item) => <span key={item}><BadgeCheck size={15} /> {item}</span>)}
          </div>

          <div className="product-detail-specs">
            {product.details.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="product-detail-actions">
            <a className="product-detail-primary" href={`mailto:info@afghanpower.com?subject=${encodeURIComponent(product.title)}`}>
              {product.actionLabel} <ArrowRight size={17} />
            </a>
            {product.secondaryLabel && (
              <a className="product-detail-secondary" href={product.secondaryHref || '#contact'}>
                {product.secondaryLabel} <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="product-detail-note"><ShieldCheck size={18} /><span>Final terms, timelines and requirements are confirmed during consultation before any application, booking or project starts.</span></div>
        </div>
      </section>

      <section className="product-detail-content">
        <article className="product-detail-description">
          <span className="detail-section-kicker"><FileText size={15} /> DETAILS</span>
          <h2>{product.sectionTitle}</h2>
          <p>{product.sectionBody}</p>
        </article>

        <div className="product-detail-columns">
          <article>
            <span className="detail-section-kicker"><Sparkles size={15} /> RECOMMENDED</span>
            <h3>{product.recommendedTitle}</h3>
            <ul>{product.recommendedFor.map((item) => <li key={item}><BadgeCheck size={16} /> {item}</li>)}</ul>
          </article>
          <article>
            <span className="detail-section-kicker"><Clock3 size={15} /> INFORMATION</span>
            <h3>{product.requirementsTitle}</h3>
            <ul>{product.requirements.map((item) => <li key={item}><BadgeCheck size={16} /> {item}</li>)}</ul>
          </article>
        </div>
      </section>


      {zoomOpen && (
        <div className="product-image-lightbox" onClick={() => setZoomOpen(false)} role="dialog" aria-modal="true" aria-label="Product image preview">
          <button type="button" className="product-lightbox-close" onClick={() => setZoomOpen(false)} aria-label="Close image preview"><X size={22} /></button>
          <img src={product.images[activeImage]} alt={`${product.title} enlarged view`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      {related.length > 0 && (
        <section className="related-products">
          <div className="related-products-head">
            <div><span>YOU MAY ALSO LIKE</span><h2>Related {meta.label} products</h2></div>
            <a href={`#/products/${product.category === 'technology' ? 'tech' : product.category}`}>View all <ArrowRight size={16} /></a>
          </div>
          <div className="related-products-grid">
            {related.map((item) => (
              <a href={`#/products/${item.id}`} className="related-product-card" key={item.id}>
                <img src={item.images[0]} alt="" loading="lazy" />
                <div><span>{categoryMeta[item.category].label}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div>
                <ArrowRight size={18} />
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
