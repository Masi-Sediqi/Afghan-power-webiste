import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { localizeService, servicesApi, type ServiceCategory, type ServiceRecord } from './servicesApi'
import { useSiteLanguage } from './useSiteLanguage'

type Filter = 'All Services' | 'Education' | 'Travel' | 'Technology' | 'Media'
const filters: Filter[] = ['All Services', 'Education', 'Travel', 'Technology', 'Media']
const categoryLabels: Record<ServiceCategory, Exclude<Filter, 'All Services'>> = {
  education: 'Education', travel: 'Travel', technology: 'Technology', media: 'Media',
}
const filterToCategory: Record<Exclude<Filter, 'All Services'>, ServiceCategory> = {
  Education: 'education', Travel: 'travel', Technology: 'technology', Media: 'media',
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [activeFilter, setActiveFilter] = useState<Filter>('All Services')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const language = useSiteLanguage()
  const localizedServices = useMemo(() => services.map((service) => localizeService(service, language)), [services, language])

  useEffect(() => {
    let active = true
    servicesApi.list()
      .then(({ services }) => { if (active) setServices(services) })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load services.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Record<ServiceCategory, number> = { education: 0, travel: 0, technology: 0, media: 0 }
    localizedServices.forEach((service) => { counts[service.category] += 1 })
    return counts
  }, [localizedServices])

  const visibleServices = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return localizedServices.filter((service) => {
      const matchesCategory = activeFilter === 'All Services' || service.category === filterToCategory[activeFilter]
      const matchesSearch = !normalized || `${service.title} ${service.description} ${categoryLabels[service.category]}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesSearch
    })
  }, [activeFilter, query, localizedServices])

  return (
    <div className="services-page">
      <section className="services-hero services-hero-redesign reveal">
        <div className="services-hero-copy">
          <div className="eyebrow"><span /> OUR SERVICES</div>
          <h1>Choose the right service from one trusted group.</h1>
          <p>Education, travel, technology and media support in one clear catalog — built for students, families, businesses and growing brands.</p>
          <div className="services-hero-metrics" aria-label="Service divisions">
            {(Object.keys(categoryCounts) as ServiceCategory[]).map((category) => (
              <span key={category}><strong>{categoryCounts[category]}</strong>{categoryLabels[category]}</span>
            ))}
          </div>
          <div className="services-hero-actions">
            <a className="primary-button" href="#services-catalog">Explore services <ArrowRight size={18} /></a>
            <a className="services-contact-link" href="#/contact">Talk to our team <ArrowRight size={17} /></a>
          </div>
        </div>

        <div className="services-showcase" aria-label="Afghan Power service areas">
          <div className="services-showcase-main">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=86" alt="Professional service consultation" />
            <span><Sparkles size={15} /> {services.length} services available</span>
          </div>
          <div className="services-showcase-stack">
            <article><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=82" alt="Education services" /><strong>Education</strong></article>
            <article><img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=82" alt="Travel services" /><strong>Travel</strong></article>
            <article><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=82" alt="Technology services" /><strong>Technology</strong></article>
            <article><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=82" alt="Media services" /><strong>Media</strong></article>
          </div>
        </div>
      </section>

      <section className="services-intro reveal">
        <div><span className="section-kicker">SPECIALIZED CAPABILITIES</span><h2>Four divisions. One standard of service.</h2></div>
        <p>Choose a division or browse everything we can do. The catalog is structured to grow as Afghan Power Group adds new services.</p>
      </section>

      <section id="services-catalog" className="services-catalog reveal">
        <div className="services-toolbar">
          <div className="services-filter" role="tablist" aria-label="Filter services">
            {filters.map((filter) => (
              <button type="button" key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>
                {filter}
                {filter !== 'All Services' && <span>{categoryCounts[filterToCategory[filter]]}</span>}
              </button>
            ))}
          </div>
          <label className="services-search">
            <Search size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services..." aria-label="Search services" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </label>
        </div>

        <div className="services-results-head">
          <div><strong>{visibleServices.length}</strong><span>{activeFilter === 'All Services' ? 'services available' : `${activeFilter} services`}</span></div>
          <small>Professional support · Clear process · One trusted group</small>
        </div>

        {loading ? (
          <div className="services-empty-state"><div className="admin-loader"/><h3>Loading services…</h3></div>
        ) : error ? (
          <div className="services-empty-state"><Search size={26}/><h3>Services unavailable</h3><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>
        ) : visibleServices.length > 0 ? (
          <div className="services-grid">
            {visibleServices.map((service, index) => (
              <article className={`service-catalog-card content-enter ${service.featured ? 'is-featured' : ''}`} key={`${activeFilter}-${service.id}`} style={{ '--enter-delay': `${Math.min(index, 7) * 55}ms` } as CSSProperties}>
                <div className="service-catalog-image"><img src={service.image} alt={service.title} loading="lazy" /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href={service.actionHref || '#/contact'} className="service-learn-link">{service.actionLabel || 'Learn more'} <ArrowRight size={16} /></a>
                <span className="service-card-sheen" />
              </article>
            ))}
          </div>
        ) : (
          <div className="services-empty-state"><Search size={26}/><h3>No services found</h3><p>Try another keyword or switch to a different division.</p><button type="button" onClick={() => { setQuery(''); setActiveFilter('All Services') }}>Show all services</button></div>
        )}
      </section>

      <section className="services-process reveal">
        <div className="services-process-copy"><span className="section-kicker">HOW WE WORK</span><h2>Clear steps from first conversation to final delivery.</h2></div>
        <div className="services-process-steps">
          {['Consult', 'Plan', 'Execute', 'Deliver', 'Support'].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < 4 && <i />}</div>)}
        </div>
      </section>

      <section className="services-cta reveal">
        <div><span>NEED SOMETHING SPECIFIC?</span><h2>Can’t find exactly what you need?</h2><p>Tell us what you want — we’ll connect you with the right Afghan Power team and build the right solution.</p></div>
        <a className="primary-button" href="#/contact">Talk to Our Team <ArrowRight size={18} /></a>
      </section>
    </div>
  )
}
