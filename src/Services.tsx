import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Award,
  Building2,
  Clapperboard,
  CloudCog,
  Code2,
  Database,
  Globe2,
  GraduationCap,
  MonitorSmartphone,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from 'lucide-react'

type ServiceCategory = 'Education' | 'Travel' | 'Technology' | 'Media'

type Service = {
  category: ServiceCategory
  title: string
  description: string
  icon: typeof Search
  featured?: boolean
}

const filters = ['All Services', 'Education', 'Travel', 'Technology', 'Media'] as const

const categoryImages: Record<ServiceCategory, string[]> = {
  Education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=84',
  ],
  Travel: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=84',
  ],
  Media: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=84',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=84',
  ],
}


const services: Service[] = [
  { category: 'Education', title: 'Study Visa Consultation', description: 'Step-by-step guidance for student visa preparation, document review and application planning.', icon: GraduationCap, featured: true },
  { category: 'Education', title: 'University Admission', description: 'Support with university selection, applications, offer letters and international admission processes.', icon: Building2 },
  { category: 'Education', title: 'Scholarship Assistance', description: 'Scholarship discovery, eligibility review and stronger application preparation for suitable programs.', icon: Award },
  { category: 'Education', title: 'Application Preparation', description: 'Professional preparation and review of forms, supporting documents and application files.', icon: ShieldCheck },
  { category: 'Education', title: 'SOP & Motivation Letter Support', description: 'Structured support to prepare clear study-purpose and motivation documents for applications.', icon: Users },
  { category: 'Education', title: 'Pre-departure Guidance', description: 'Practical support before travel, covering preparation, arrival planning and next-step orientation.', icon: Users },

  { category: 'Travel', title: 'Tourist Visa Services', description: 'Professional tourist visa consultation, document review and application support for international travel.', icon: PlaneTakeoff, featured: true },
  { category: 'Travel', title: 'Air Ticket Reservation', description: 'Flight search, reservation support and itinerary options based on destination and travel schedule.', icon: Ticket },
  { category: 'Travel', title: 'Hotel Booking', description: 'Accommodation planning and booking assistance for business, family and leisure travel.', icon: Building2 },
  { category: 'Travel', title: 'Travel Packages', description: 'Curated travel packages combining essential services for a simpler and more organized journey.', icon: Globe2 },
  { category: 'Travel', title: 'Family Travel Services', description: 'Coordinated travel support for families, including planning, bookings and visa assistance.', icon: Users },
  { category: 'Travel', title: 'Travel Consultation', description: 'Destination-focused guidance to help clients understand routes, requirements and practical travel options.', icon: Building2 },

  { category: 'Technology', title: 'Website Development', description: 'Modern corporate websites, landing pages, portals and e-commerce experiences built for performance.', icon: Globe2, featured: true },
  { category: 'Technology', title: 'Custom Database Systems', description: 'Purpose-built database systems for companies, organizations and operational workflows.', icon: Database },
  { category: 'Technology', title: 'ERP Development', description: 'Integrated ERP platforms for sales, purchases, accounting, inventory, staff and management reporting.', icon: Database },
  { category: 'Technology', title: 'Mobile App Development', description: 'Professional mobile applications for Android and iOS with modern interfaces and scalable foundations.', icon: Smartphone },
  { category: 'Technology', title: 'Web Application Development', description: 'CRM, ERP, dashboards, customer portals and secure web applications for modern teams.', icon: MonitorSmartphone },
  { category: 'Technology', title: 'Desktop Software Development', description: 'Windows and business applications designed around specific company processes and requirements.', icon: MonitorSmartphone },
  { category: 'Technology', title: 'UI / UX Design', description: 'Clean, practical interface and experience design for websites, apps and business software.', icon: Sparkles },
  { category: 'Technology', title: 'Software Customization', description: 'Enhancement and adaptation of existing systems to fit new workflows, modules and business needs.', icon: Sparkles },
  { category: 'Technology', title: 'System Integration', description: 'API, payment, database and third-party service integrations that keep business tools connected.', icon: Zap },
  { category: 'Technology', title: 'Cloud & Server Deployment', description: 'VPS setup, domains, SSL, Nginx, deployment and practical production infrastructure support.', icon: CloudCog },
  { category: 'Technology', title: 'Database Design & Migration', description: 'Structured database architecture and safe migration planning for existing business data.', icon: Database },
  { category: 'Technology', title: 'Maintenance & Technical Support', description: 'Ongoing updates, backups, monitoring, troubleshooting and technical support after delivery.', icon: ShieldCheck },
  { category: 'Technology', title: 'Business Automation', description: 'Transform repetitive manual processes into faster digital workflows and connected systems.', icon: Code2 },

  { category: 'Media', title: 'Video Production', description: 'Professional concept development, filming, editing and delivery for commercial and corporate video.', icon: Clapperboard, featured: true },
  { category: 'Media', title: 'Commercial Advertising', description: 'Creative advertising concepts and campaign assets designed to help brands communicate clearly.', icon: Sparkles },
  { category: 'Media', title: 'Photography', description: 'Professional photography for products, teams, businesses, campaigns and social content.', icon: Clapperboard },
  { category: 'Media', title: 'Graphic Design', description: 'Modern visual design for campaigns, social media, print and everyday brand communication.', icon: Sparkles },
  { category: 'Media', title: 'Brand Identity Design', description: 'Cohesive visual identity systems that help companies look consistent, recognizable and professional.', icon: Sparkles },
  { category: 'Media', title: 'Social Media Management', description: 'Content planning, publishing support and ongoing management for key social platforms.', icon: Users },
  { category: 'Media', title: 'Digital Marketing', description: 'Digital campaigns, content strategy and practical marketing support focused on business growth.', icon: Sparkles },
  { category: 'Media', title: 'Motion Graphics', description: 'Animated graphics and visual storytelling for advertisements, presentations and digital campaigns.', icon: Clapperboard },
]

const categoryMeta: Record<ServiceCategory, { count: number; label: string }> = {
  Education: { count: services.filter((item) => item.category === 'Education').length, label: 'Study & admissions' },
  Travel: { count: services.filter((item) => item.category === 'Travel').length, label: 'Visa & journeys' },
  Technology: { count: services.filter((item) => item.category === 'Technology').length, label: 'Digital solutions' },
  Media: { count: services.filter((item) => item.category === 'Media').length, label: 'Creative production' },
}

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All Services')
  const [query, setQuery] = useState('')

  const visibleServices = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return services.filter((service) => {
      const matchesCategory = activeFilter === 'All Services' || service.category === activeFilter
      const matchesSearch = !normalized || `${service.title} ${service.description} ${service.category}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesSearch
    })
  }, [activeFilter, query])

  return (
    <div className="services-page">
      <section className="services-hero services-hero-redesign reveal">
        <div className="services-hero-copy">
          <div className="eyebrow"><span /> OUR SERVICES</div>
          <h1>Choose the right service from one trusted group.</h1>
          <p>
            Education, travel, technology and media support in one clear catalog — built for students, families,
            businesses and growing brands.
          </p>
          <div className="services-hero-metrics" aria-label="Service divisions">
            {(Object.keys(categoryMeta) as ServiceCategory[]).map((category) => (
              <span key={category}><strong>{categoryMeta[category].count}</strong>{category}</span>
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
            <span><Sparkles size={15} /> 33 services available</span>
          </div>
          <div className="services-showcase-stack">
            <article>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=82" alt="Education services" />
              <strong>Education</strong>
            </article>
            <article>
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=82" alt="Travel services" />
              <strong>Travel</strong>
            </article>
            <article>
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=82" alt="Technology services" />
              <strong>Technology</strong>
            </article>
            <article>
              <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=82" alt="Media services" />
              <strong>Media</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="services-intro reveal">
        <div>
          <span className="section-kicker">SPECIALIZED CAPABILITIES</span>
          <h2>Four divisions. One standard of service.</h2>
        </div>
        <p>Choose a division or browse everything we can do. The catalog is structured to grow as Afghan Power Group adds new services.</p>
      </section>

      <section id="services-catalog" className="services-catalog reveal">
        <div className="services-toolbar">
          <div className="services-filter" role="tablist" aria-label="Filter services">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter !== 'All Services' && <span>{categoryMeta[filter as ServiceCategory].count}</span>}
              </button>
            ))}
          </div>
          <label className="services-search">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </label>
        </div>

        <div className="services-results-head">
          <div>
            <strong>{visibleServices.length}</strong>
            <span>{activeFilter === 'All Services' ? 'services available' : `${activeFilter} services`}</span>
          </div>
          <small>Professional support · Clear process · One trusted group</small>
        </div>

        {visibleServices.length > 0 ? (
          <div className="services-grid">
            {visibleServices.map((service, index) => {
              const categoryServiceIndex = services.filter((item) => item.category === service.category).findIndex((item) => item.title === service.title)
              const serviceImage = categoryImages[service.category][Math.max(categoryServiceIndex, 0) % categoryImages[service.category].length]
              return (
                <article className={`service-catalog-card ${service.featured ? 'is-featured' : ''}`} key={`${service.category}-${service.title}`}>
                  <div className="service-catalog-image"><img src={serviceImage} alt="" loading="lazy" /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#/contact" className="service-learn-link">Learn more <ArrowRight size={16} /></a>
                  <span className="service-card-sheen" />
                </article>
              )
            })}
          </div>
        ) : (
          <div className="services-empty-state">
            <Search size={26} />
            <h3>No services found</h3>
            <p>Try another keyword or switch to a different division.</p>
            <button type="button" onClick={() => { setQuery(''); setActiveFilter('All Services') }}>Show all services</button>
          </div>
        )}
      </section>

      <section className="services-process reveal">
        <div className="services-process-copy">
          <span className="section-kicker">HOW WE WORK</span>
          <h2>Clear steps from first conversation to final delivery.</h2>
        </div>
        <div className="services-process-steps">
          {['Consult', 'Plan', 'Execute', 'Deliver', 'Support'].map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              {index < 4 && <i />}
            </div>
          ))}
        </div>
      </section>

      <section className="services-cta reveal">
        <div>
          <span>NEED SOMETHING SPECIFIC?</span>
          <h2>Can’t find exactly what you need?</h2>
          <p>Tell us what you want — we’ll connect you with the right Afghan Power team and build the right solution.</p>
        </div>
        <a className="primary-button" href="#/contact">Talk to Our Team <ArrowRight size={18} /></a>
      </section>
    </div>
  )
}
