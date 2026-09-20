import { type CSSProperties, type FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  Lock,
  LogOut,
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
import NewsPage from './News'
import GoogleSignIn from './components/GoogleSignIn'
import { authApi, type AuthUser } from './auth'
import AdminApp from './AdminApp'
import { localizeService, servicesApi, type ServiceRecord } from './servicesApi'
import { useSiteLanguage } from './useSiteLanguage'

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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.24 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function PublicSite() {
  const language = useSiteLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [accountMode, setAccountMode] = useState<'signin' | 'signup'>('signin')
  const [accountName, setAccountName] = useState('')
  const [accountEmail, setAccountEmail] = useState('')
  const [accountPhone, setAccountPhone] = useState('')
  const [accountPassword, setAccountPassword] = useState('')
  const [accountRePassword, setAccountRePassword] = useState('')
  const [accountUser, setAccountUser] = useState<AuthUser | null>(null)
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountError, setAccountError] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [homeServices, setHomeServices] = useState<ServiceRecord[]>([])
  const [route, setRoute] = useState(() => window.location.hash)
  const productRouteSegment = route.split('/')[2] || ''
  const productCategoryRoutes = ['education', 'travel', 'tech', 'technology', 'media']
  const isProductDetailPage = route.startsWith('#/products/') && !!productRouteSegment && !productCategoryRoutes.includes(productRouteSegment)
  const isProductsPage = route.startsWith('#/products') && !isProductDetailPage
  const isAboutPage = route === '#/about' || route.startsWith('#/about/')
  const isContactPage = route === '#/contact' || route.startsWith('#/contact/')
  const isServicesPage = route === '#/services' || route.startsWith('#/services/')
  const isNewsPage = route === '#/news' || route.startsWith('#/news/')

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
    let active = true
    servicesApi.list().then((result) => { if (active) setHomeServices(result.services.map((item) => localizeService(item, language))) }).catch(() => { if (active) setHomeServices([]) })
    return () => { active = false }
  }, [language])

  useEffect(() => {
    if (route.startsWith('#/')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [route])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = entry.target as HTMLElement
            node.classList.add('is-visible')
            node.removeAttribute('data-reveal-bound')
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )

    const bindRevealNode = (node: HTMLElement) => {
      if (node.classList.contains('is-visible') || node.dataset.revealBound === 'true') return
      node.dataset.revealBound = 'true'
      observer.observe(node)
    }

    const bindRevealTree = (rootNode: ParentNode) => {
      if (rootNode instanceof HTMLElement && rootNode.matches('.reveal')) bindRevealNode(rootNode)
      rootNode.querySelectorAll<HTMLElement>('.reveal').forEach(bindRevealNode)
    }

    bindRevealTree(document)

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) bindRevealTree(node)
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
      document.querySelectorAll<HTMLElement>('[data-reveal-bound]').forEach((node) => node.removeAttribute('data-reveal-bound'))
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('account-modal-open', accountOpen)
    return () => document.body.classList.remove('account-modal-open')
  }, [accountOpen])

  const goContact = () => {
    window.location.hash = '#/contact'
    setMenuOpen(false)
  }

  useEffect(() => {
    authApi.me()
      .then(({ user }) => setAccountUser(user))
      .catch(() => setAccountUser(null))
  }, [])

  const resetAccountFeedback = () => setAccountError('')

  const submitAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetAccountFeedback()
    if (accountMode === 'signup' && accountPassword !== accountRePassword) {
      setAccountError('Passwords do not match.')
      return
    }

    setAccountLoading(true)
    try {
      const result = accountMode === 'signup'
        ? await authApi.signup({
            name: accountName.trim(),
            phone: accountPhone.trim(),
            email: accountEmail.trim(),
            password: accountPassword,
          })
        : await authApi.login({ identifier: accountEmail.trim(), password: accountPassword })
      setAccountUser(result.user)
      setAccountPassword('')
      setAccountRePassword('')
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.')
    } finally {
      setAccountLoading(false)
    }
  }

  const signInWithGoogle = async (credential: string) => {
    resetAccountFeedback()
    setAccountLoading(true)
    try {
      const result = await authApi.google(credential)
      setAccountUser(result.user)
      setAccountPassword('')
      setAccountRePassword('')
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.')
    } finally {
      setAccountLoading(false)
    }
  }

  const logoutAccount = async () => {
    setAccountLoading(true)
    try {
      await authApi.logout()
      setAccountUser(null)
      setAccountOpen(false)
    } finally {
      setAccountLoading(false)
    }
  }

  const normalizedRoute = route || '#home'
  const isHomeRoute = normalizedRoute === '' || normalizedRoute === '#home' || normalizedRoute === '#/'

  return (
    <main className="site-shell">
      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-shell">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#home" className={isHomeRoute ? 'active' : ''}>Home</a>
            <ProductMegaMenu active={normalizedRoute.startsWith('#/products')} />
            <a href="#/services" className={normalizedRoute.startsWith('#/services') ? 'active' : ''}>Services</a>
            <a href="#/news" className={normalizedRoute.startsWith('#/news') ? 'active' : ''}>News</a>
            <a href="#/about" className={normalizedRoute.startsWith('#/about') ? 'active' : ''}>About</a>
            <a href="#/contact" className={normalizedRoute.startsWith('#/contact') ? 'active' : ''}>Contact</a>
          </nav>
          <div className="nav-actions">
            <HeaderTools />
            <div className="account-menu-wrap">
              <button
                className={`tool-button account-tool ${accountOpen ? 'is-open' : ''}`}
                onClick={() => setAccountOpen(true)}
                aria-label="Open account menu"
                aria-expanded={accountOpen}
                title="Account"
              >
                <UserCircle size={20} />
                <span className="tool-shine" />
              </button>
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
            <div className="mobile-products-group">
              <span>Products</span>
              <a href="#/products/education" onClick={() => setMenuOpen(false)}>Educational Products<ArrowRight size={16}/></a>
              <a href="#/products/travel" onClick={() => setMenuOpen(false)}>Travel Products<ArrowRight size={16}/></a>
              <a href="#/products/tech" onClick={() => setMenuOpen(false)}>Tech Products<ArrowRight size={16}/></a>
              <a href="#/products/media" onClick={() => setMenuOpen(false)}>Media Products<ArrowRight size={16}/></a>
            </div>
            <a href="#/services" onClick={() => setMenuOpen(false)}>Services<ArrowRight size={18}/></a>
            <a href="#/news" onClick={() => setMenuOpen(false)}>News<ArrowRight size={18}/></a>
            <a href="#/about" onClick={() => setMenuOpen(false)}>About<ArrowRight size={18}/></a>
            <a href="#/contact" onClick={() => setMenuOpen(false)}>Contact<ArrowRight size={18}/></a>
          </nav>
          <div className="mobile-account-actions">
            <button type="button" onClick={() => { setMenuOpen(false); setAccountMode('signin'); setAccountOpen(true); resetAccountFeedback() }}>Sign in</button>
            <button type="button" onClick={() => { setMenuOpen(false); setAccountMode('signup'); setAccountOpen(true); resetAccountFeedback() }}>Sign up</button>
          </div>
        </div>
      )}

      {accountOpen && createPortal(
        <div className="account-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && setAccountOpen(false)}>
          <section className="account-modal" role="dialog" aria-modal="true" aria-label="Account">
            <button className="account-modal-close" type="button" onClick={() => setAccountOpen(false)} aria-label="Close account modal"><X size={17} /></button>

            {accountUser ? (
              <div className="account-profile-view">
                <div className="account-avatar">{accountUser.name.slice(0, 1)}</div>
                <span className="account-kicker">SIGNED IN</span>
                <h2>{accountUser.name}</h2>
                <p>{accountUser.email}</p>
                <button
                  className="account-logout"
                  type="button"
                  onClick={logoutAccount}
                  disabled={accountLoading}
                >
                  <LogOut size={17} /> Logout
                </button>
              </div>
            ) : (
              <>
                <div className="account-modal-head">
                  <span className="account-kicker">AFGHAN POWER ACCOUNT</span>
                  <h2>{accountMode === 'signin' ? 'Welcome back.' : 'Create account.'}</h2>
                </div>

                <form className="account-form" onSubmit={submitAccount}>
                  {accountMode === 'signup' && (
                    <>
                      <label>
                        <span>Full name</span>
                        <div>
                          <UserCircle size={16} />
                          <input required minLength={2} value={accountName} onChange={(event) => setAccountName(event.target.value)} type="text" placeholder="Your full name" autoComplete="name" />
                        </div>
                      </label>
                      <label>
                        <span>Phone number</span>
                        <div>
                          <Phone size={16} />
                          <input required value={accountPhone} onChange={(event) => setAccountPhone(event.target.value)} type="tel" placeholder="+93 700 000 000" autoComplete="tel" />
                        </div>
                      </label>
                    </>
                  )}
                  <label>
                    <span>{accountMode === 'signin' ? 'Email or phone' : 'Email'}</span>
                    <div>
                      <Mail size={16} />
                      <input required value={accountEmail} onChange={(event) => setAccountEmail(event.target.value)} type={accountMode === 'signin' ? 'text' : 'email'} placeholder={accountMode === 'signin' ? 'Email or phone number' : 'you@example.com'} autoComplete={accountMode === 'signin' ? 'username' : 'email'} />
                    </div>
                  </label>
                  <label>
                    <span>Password</span>
                    <div>
                      <Lock size={16} />
                      <input required minLength={8} value={accountPassword} onChange={(event) => setAccountPassword(event.target.value)} type="password" placeholder="At least 8 characters" autoComplete={accountMode === 'signin' ? 'current-password' : 'new-password'} />
                    </div>
                  </label>
                  {accountMode === 'signup' && (
                    <label>
                      <span>Confirm password</span>
                      <div>
                        <Lock size={16} />
                        <input required minLength={8} value={accountRePassword} onChange={(event) => setAccountRePassword(event.target.value)} type="password" placeholder="Repeat password" autoComplete="new-password" />
                      </div>
                    </label>
                  )}

                  {accountError && <div className="account-error" role="alert">{accountError}</div>}

                  <div className="account-mode-actions">
                    <button
                      className={accountMode === 'signin' ? 'active' : ''}
                      disabled={accountLoading}
                      type={accountMode === 'signin' ? 'submit' : 'button'}
                      onClick={() => { setAccountMode('signin'); resetAccountFeedback() }}
                    >
                      {accountMode === 'signin' && accountLoading ? 'Signing in…' : 'Sign in'}
                    </button>
                    <button
                      className={accountMode === 'signup' ? 'active' : ''}
                      disabled={accountLoading}
                      type={accountMode === 'signup' ? 'submit' : 'button'}
                      onClick={() => { setAccountMode('signup'); resetAccountFeedback() }}
                    >
                      {accountMode === 'signup' && accountLoading ? 'Creating…' : 'Sign up'}
                    </button>
                  </div>
                </form>

                <div className="account-more">
                  <span>Or continue with Google</span>
                  <GoogleSignIn onCredential={signInWithGoogle} disabled={accountLoading} />
                </div>
              </>
            )}
          </section>
        </div>,
        document.body,
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
      ) : isNewsPage ? (
        <NewsPage />
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
            {[...homeServices, ...homeServices].map((service, index) => {
              const originalIndex = homeServices.length ? index % homeServices.length : 0
              return (
                <article
                  className="service-card"
                  key={`${service.id}-${index}`}
                  style={{ '--service-delay': `${originalIndex * 90}ms` } as CSSProperties}
                  aria-hidden={index >= homeServices.length}
                >
                  <div className="service-image">
                    <img src={service.image} alt="" loading="lazy" />
                    <span className={`service-category service-category-${service.category}`}>{service.category.toUpperCase()}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href={service.actionHref || '#/contact'} aria-label={`${service.actionLabel || 'Explore'} ${service.title}`}>
                    <span>{service.actionLabel || 'Explore'}</span><ArrowRight size={18}/>
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


export default function App() {
  const isAdminPath = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
  return isAdminPath ? <AdminApp /> : <PublicSite />
}
