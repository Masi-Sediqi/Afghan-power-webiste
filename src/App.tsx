import { type CSSProperties, useEffect, useState } from 'react'
import {
  ArrowRight,
  Award,
  Building2,
  BarChart3,
  Boxes,
  ChevronDown,
  Clapperboard,
  CloudCog,
  Code2,
  Database,
  GraduationCap,
  Globe2,
  Headphones,
  LifeBuoy,
  ListChecks,
  MapPin,
  Menu,
  MonitorSmartphone,
  Mail,
  PlaneTakeoff,
  Phone,
  Play,
  School,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
  Ticket,
  Sparkles,
  UserCircle,
  X,
} from 'lucide-react'
import HeaderTools from './components/HeaderTools'
import ChatBot from './components/ChatBot'
import OurCompanies from './components/OurCompanies'
import ProductMegaMenu from './components/ProductMegaMenu'
import ProductsPage from './Products'
import ProductDetailsPage from './ProductDetails'
import AboutPage from './About'
import ContactPage from './Contact'
import ServicesPage from './Services'

const services = [
  {
    icon: GraduationCap,
    category: 'EDUCATION',
    title: 'Study Visa',
    text: 'Clear student visa guidance, document preparation and application support from first review to final submission.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: School,
    category: 'EDUCATION',
    title: 'University Admission',
    text: 'Support for international university applications, offer letters and the admission journey from start to finish.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: Award,
    category: 'EDUCATION',
    title: 'Scholarships',
    text: 'Discover suitable scholarship opportunities and prepare stronger applications for competitive study programs.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: PlaneTakeoff,
    category: 'TRAVEL',
    title: 'Tourist Visa',
    text: 'Professional tourist visa consultation, document checks and practical support for smoother international travel.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: Ticket,
    category: 'TRAVEL',
    title: 'Air Tickets & Travel',
    text: 'Flight ticketing and reliable travel assistance designed around your destination, schedule and journey needs.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: Database,
    category: 'TECHNOLOGY',
    title: 'Software & ERP',
    text: 'Custom databases, ERP systems and business software that connect operations, finance, teams and reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: Smartphone,
    category: 'TECHNOLOGY',
    title: 'Web & Mobile Development',
    text: 'Modern websites and applications with polished interfaces, responsive layouts and scalable foundations.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
  },
  {
    icon: Clapperboard,
    category: 'MEDIA',
    title: 'Media & Digital Marketing',
    text: 'Video production, graphic design, advertising, digital marketing and content that helps brands stand out.',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=82',
  },
]

const scrollingServices = [...services, ...services]


const whyFeatures = [
  {
    icon: Building2,
    title: 'Multiple Services, One Group',
    text: 'Education, travel, technology and media services brought together under one trusted Afghan brand.',
  },
  {
    icon: Users,
    title: 'Professional Team',
    text: 'Specialized teams across every division, focused on quality, clear communication and client success.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    text: 'We understand the Afghan market, local expectations and the practical needs of people and businesses.',
  },
  {
    icon: Zap,
    title: 'Modern Solutions',
    text: 'From international services to digital systems, we combine practical experience with modern tools and processes.',
  },
  {
    icon: ListChecks,
    title: 'Transparent Process',
    text: 'Structured service delivery, clear steps and consistent updates help clients know what happens next.',
  },
  {
    icon: LifeBuoy,
    title: 'Long-Term Support',
    text: 'Our support continues beyond delivery with consultation, follow-up and ongoing assistance when you need it.',
  },
]

const products = [
  'Smart Gold',
  'Pharmacy ERP',
  'Hospital Management',
  'Restaurant System',
  'Fuel Station ERP',
  'Retail & Wholesale',
]

const groupSlides = [
  {
    eyebrow: 'EDUCATIONAL CONSULTANCY',
    title: ['STUDY', 'BUILD', 'YOUR FUTURE'],
    subtitle: 'Educational Consultancy',
    description: 'University admissions, scholarships and student visa guidance for international study opportunities.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=86',
    label: 'Study Abroad',
  },
  {
    eyebrow: 'TRAVEL AGENCY',
    title: ['TRAVEL', 'BEYOND', 'BORDERS'],
    subtitle: 'Travel Agency',
    description: 'Tourist visas, air tickets and reliable travel services designed to make every journey easier.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=86',
    label: 'Travel Services',
  },
  {
    eyebrow: 'TECH DEVELOPMENT',
    title: ['POWERING', 'THE DIGITAL', 'FUTURE'],
    subtitle: 'Tech Development',
    description: 'Database systems, ERP platforms, websites, applications and custom software for modern businesses.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=86',
    label: 'Digital Solutions',
  },
  {
    eyebrow: 'MEDIA PRODUCTION',
    title: ['CREATE', 'ENGAGE', 'INSPIRE'],
    subtitle: 'Media Production',
    description: 'Advertising, video production, graphic design, digital marketing and content that moves brands forward.',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1800&q=86',
    label: 'Creative Media',
  },
]

function Brand() {
  return (
    <a href="#home" className="brand" aria-label="Afghan Power home">
      <span className="brand-mark"><img src="/afghan-power-logo-transparent.png" alt="Afghan Power Group logo" /></span>
      <span>
        <strong>AFGHAN POWER</strong>
        <small>Group of Companies</small>
      </span>
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [route, setRoute] = useState(() => window.location.hash)
  const productRouteSegment = route.split('/')[2] || ''
  const productCategoryRoutes = ['education', 'travel', 'tech', 'technology', 'media']
  const isProductDetailPage = route.startsWith('#/products/') && !!productRouteSegment && !productCategoryRoutes.includes(productRouteSegment)
  const isProductsPage = route.startsWith('#/products') && !isProductDetailPage
  const isAboutPage = route === '#/about' || route.startsWith('#/about/')
  const isContactPage = route === '#/contact' || route.startsWith('#/contact/')
  const isServicesPage = route === '#/services' || route.startsWith('#/services/')

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % groupSlides.length)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (route.startsWith('#/')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    if (typeof IntersectionObserver === 'undefined') {
      revealNodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    revealNodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [route])

  const goContact = () => {
    window.location.hash = '#/contact'
    setMenuOpen(false)
  }

  return (
    <main className="site-shell">
      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-shell">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#home" className="active">Home</a>
            <a href="#solutions">Solutions</a>
            <ProductMegaMenu />
            <a href="#/services">Services</a>
            <a href="#/about">About</a>
            <a href="#/contact">Contact</a>
          </nav>
          <div className="nav-actions">
            <HeaderTools />
            <div className="account-menu-wrap">
              <button
                className={`tool-button account-tool ${accountOpen ? 'is-open' : ''}`}
                onClick={() => setAccountOpen((value) => !value)}
                aria-label="Open account menu"
                aria-expanded={accountOpen}
                title="Account"
              >
                <UserCircle size={20} />
                <span className="tool-shine" />
              </button>
              {accountOpen && (
                <div className="account-popover">
                  <a href="#signin" onClick={() => setAccountOpen(false)}>Sign in</a>
                  <a href="#signup" onClick={() => setAccountOpen(false)}>Sign up</a>
                </div>
              )}
            </div>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={23} /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-head"><Brand /><button onClick={() => setMenuOpen(false)}><X /></button></div>
          <nav>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home<ArrowRight size={18}/></a>
            <a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions<ArrowRight size={18}/></a>
            <div className="mobile-products-group">
              <span>Products</span>
              <a href="#/products/education" onClick={() => setMenuOpen(false)}>Educational Products<ArrowRight size={16}/></a>
              <a href="#/products/travel" onClick={() => setMenuOpen(false)}>Travel Products<ArrowRight size={16}/></a>
              <a href="#/products/tech" onClick={() => setMenuOpen(false)}>Tech Products<ArrowRight size={16}/></a>
              <a href="#/products/media" onClick={() => setMenuOpen(false)}>Media Products<ArrowRight size={16}/></a>
            </div>
            <a href="#/services" onClick={() => setMenuOpen(false)}>Services<ArrowRight size={18}/></a>
            <a href="#/about" onClick={() => setMenuOpen(false)}>About<ArrowRight size={18}/></a>
            <a href="#/contact" onClick={() => setMenuOpen(false)}>Contact<ArrowRight size={18}/></a>
          </nav>
          <div className="mobile-account-actions">
            <a href="#signin" onClick={() => setMenuOpen(false)}>Sign in</a>
            <a href="#signup" onClick={() => setMenuOpen(false)}>Sign up</a>
          </div>
        </div>
      )}

      {isProductDetailPage ? (
        <ProductDetailsPage productId={productRouteSegment} />
      ) : isProductsPage ? (
        <ProductsPage route={route} />
      ) : isAboutPage ? (
        <AboutPage />
      ) : isContactPage ? (
        <ContactPage />
      ) : isServicesPage ? (
        <ServicesPage />
      ) : (
      <>
      <section id="home" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy" key={`copy-${activeSlide}`}>
            <div className="eyebrow"><span /> {groupSlides[activeSlide].eyebrow}</div>
            <h1>
              <span>{groupSlides[activeSlide].title[0]}</span>
              <span>{groupSlides[activeSlide].title[1]}</span>
              <span className="gradient-text">{groupSlides[activeSlide].title[2]}</span>
            </h1>
            <h2>{groupSlides[activeSlide].subtitle}</h2>
            <p>{groupSlides[activeSlide].description}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#/services">Explore Services <ArrowRight size={18}/></a>
              <a href="#/about" className="story-link"><span className="play-button"><Play size={15} fill="currentColor"/></span> Discover Afghan Power</a>
            </div>
            <div className="hero-stats">
              <div><strong>4</strong><span>Core Divisions</span></div>
              <div><strong>One</strong><span>Unified Group</span></div>
              <div><strong>360°</strong><span>Business Solutions</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="group-slider" aria-label="Afghan Power Group divisions">
              {groupSlides.map((slide, index) => (
                <figure key={slide.subtitle} className={`group-slide ${index === activeSlide ? 'active' : ''}`}>
                  <img src={slide.image} alt={`${slide.subtitle} - ${slide.label}`} />
                  <div className="slide-overlay" />
                  <figcaption>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><small>AFGHAN POWER GROUP</small><strong>{slide.subtitle}</strong></div>
                  </figcaption>
                </figure>
              ))}
              <div className="slide-top-label">ONE GROUP · MULTIPLE SOLUTIONS</div>
              <div className="slide-controls">
                {groupSlides.map((slide, index) => (
                  <button
                    key={slide.subtitle}
                    className={index === activeSlide ? 'active' : ''}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${slide.subtitle}`}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <i />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <a className="scroll-cue" href="#companies">Explore <ChevronDown size={18}/></a>
      </section>

      <OurCompanies />

      <section id="services" className="services-section reveal">
        <div className="section-kicker"><Sparkles size={15}/> WHAT WE DO</div>
        <div className="section-heading-row">
          <h2>One group.<br/>Many possibilities.</h2>
          <p>From study and travel to technology and media, Afghan Power Group brings practical services together under one trusted brand.</p>
        </div>
        <div className="service-scroll-frame">
          <div className="service-grid">
            {scrollingServices.map(({ category, title, text, image }, index) => {
              const originalIndex = index % services.length
              return (
                <article
                  className="service-card"
                  key={`${title}-${index}`}
                  style={{ '--service-delay': `${originalIndex * 90}ms` } as CSSProperties}
                  aria-hidden={index >= services.length}
                >
                  <div className="service-image">
                    <img src={image} alt="" loading="lazy" />
                    <span className={`service-category service-category-${category.toLowerCase()}`}>{category}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="#/contact" aria-label={`Learn more about ${title}`}>
                    <span>Explore</span><ArrowRight size={18}/>
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      </>
      )}

      <footer className="site-footer">
        <div className="footer-glow footer-glow-one" />
        <div className="footer-glow footer-glow-two" />

        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand />
            <p>Professional education, travel, technology and media services from one trusted Afghan group.</p>
          </div>

          <div className="footer-column">
            <h3>Navigation</h3>
            <a href="#home">Home</a>
            <a href="#companies">Companies</a>
            <a href="#/services">Services</a>
            <a href="#/contact">Contact us</a>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <a href="#/services">Study Visa</a>
            <a href="#/services">Travel Agency</a>
            <a href="#/services">Software & ERP</a>
            <a href="#/services">Media Production</a>
          </div>

          <div className="footer-contact">
            <h3>Get in touch</h3>
            <a href="mailto:info@afghanpower.com"><Mail size={24}/> info@afghanpower.com</a>
            <a href="tel:+93700000000"><Phone size={24}/> +93 700 000 000</a>
            <p><MapPin size={25}/> Kabul, Afghanistan<br/>Afghan Power Group</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Afghan Power Group. All rights reserved.</p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="X">x</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </footer>

      <ChatBot />
    </main>
  )
}
