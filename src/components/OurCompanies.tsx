import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'

const companyRank: Record<string, number> = { 'Tech Development': 0, 'Educational Consultancy': 1, 'Travel Agency': 2, 'Media Production': 3 }

const companies = [
  {
    name: 'Educational Consultancy',
    subtitle: 'Study Abroad & Educational Services',
    description: 'University admissions, scholarships, study visa guidance and international education opportunities.',
    services: ['University Admission', 'Scholarships', 'Study Visa', 'Educational Consultancy'],
    cta: 'Explore Education',
    href: '#contact',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=84',
  },
  {
    name: 'Travel Agency',
    subtitle: 'Travel, Visa & Ticketing Services',
    description: 'Professional travel services including tourist visas, flight tickets and complete travel assistance.',
    services: ['Tourist Visa', 'Air Tickets', 'Travel Consultation', 'Travel Services'],
    cta: 'Explore Travel',
    href: '#contact',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=84',
  },
  {
    name: 'Tech Development',
    subtitle: 'Software & Digital Solutions',
    description: 'Modern software solutions, business systems and custom technology built for organizations and businesses.',
    services: ['Custom Databases', 'ERP Systems', 'Websites', 'Mobile Applications'],
    cta: 'Explore Technology',
    href: '#solutions',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=84',
  },
  {
    name: 'Media Production',
    subtitle: 'Creative Media & Digital Marketing',
    description: 'Creative media services designed to strengthen brands, promote businesses and produce professional digital content.',
    services: ['Advertising', 'Video Production', 'Graphic Design', 'Digital Marketing'],
    cta: 'Explore Media',
    href: '#contact',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=84',
  },
].sort((a, b) => companyRank[a.name] - companyRank[b.name])

export default function OurCompanies() {
  return (
    <section id="companies" className="companies-section reveal" aria-labelledby="companies-title">
      <div className="companies-heading">
        <div>
          <div className="companies-kicker">
            <span className="companies-kicker-line" />
            OUR COMPANIES
          </div>
          <h2 id="companies-title">One Group. Multiple<br />Specialized Companies.</h2>
        </div>
        <div className="companies-heading-side">
          <span className="companies-count">04 · CORE COMPANIES</span>
          <p>From education and travel to technology and media, Afghan Power Group brings specialized services together under one trusted group.</p>
        </div>
      </div>

      <div className="companies-grid">
        {companies.map(({ name, subtitle, description, services, cta, href, image }, index) => (
          <article className="company-card" key={name} style={{ '--company-delay': `${index * 85}ms` } as CSSProperties}>
            <div className="company-card-media">
              <img src={image} alt={name} loading="lazy" />
              <div className="company-card-media-shade" />
              <div className="company-card-index">0{index + 1}</div>
              <div className="company-card-badge">AFGHAN POWER GROUP</div>
            </div>

            <div className="company-card-body">
              <div>
                <h3>{name}</h3>
                <h4>{subtitle}</h4>
                <p>{description}</p>
              </div>

              <div className="company-tags" aria-label={`${name} services`}>
                {services.map((service) => <span key={service}>{service}</span>)}
              </div>

              <a className="company-card-link" href={href}>
                <span>{cta}</span>
                <span className="company-card-link-icon"><ArrowUpRight size={18} /></span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
