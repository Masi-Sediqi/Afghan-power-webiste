import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clapperboard,
  Compass,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lightbulb,
  MapPin,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { aboutApi, type LeadershipRecord, type StoryItemRecord } from './aboutApi'

const divisions = [
  {
    icon: GraduationCap,
    number: '01',
    name: 'Educational Consultancy',
    label: 'Education',
    text: 'International admissions, scholarships, study visa guidance and practical support for students planning their next academic step.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=84',
    href: '#/products/education',
  },
  {
    icon: PlaneTakeoff,
    number: '02',
    name: 'Travel Agency',
    label: 'Travel',
    text: 'Tourist visas, ticketing and travel assistance designed to make international journeys clearer, simpler and better supported.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=84',
    href: '#/products/travel',
  },
  {
    icon: Zap,
    number: '03',
    name: 'Tech Development',
    label: 'Technology',
    text: 'Business software, ERP systems, websites, mobile applications and custom digital solutions for modern organizations.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=84',
    href: '#/products/tech',
  },
  {
    icon: Clapperboard,
    number: '04',
    name: 'Media Production',
    label: 'Media',
    text: 'Creative production, advertising, brand design, social content and digital marketing that helps businesses communicate with impact.',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=84',
    href: '#/products/media',
  },
]

const defaultStory: StoryItemRecord[] = [
  {
    id: 'shared-vision', step: '01', visible: true, sortOrder: 1, createdAt: '', updatedAt: '',
    title: 'A shared vision',
    text: 'Afghan Power began with a simple idea: bring practical, professional services together around the real needs of Afghan clients.',
  },
  {
    id: 'specialized-divisions', step: '02', visible: true, sortOrder: 2, createdAt: '', updatedAt: '',
    title: 'Specialized divisions',
    text: 'The group expanded into focused teams for education, travel, technology and media while keeping one unified standard of service.',
  },
  {
    id: 'integrated-solutions', step: '03', visible: true, sortOrder: 3, createdAt: '', updatedAt: '',
    title: 'Integrated solutions',
    text: 'Today, our divisions work independently where expertise matters and together where clients benefit from connected services.',
  },
  {
    id: 'building-next', step: '04', visible: true, sortOrder: 4, createdAt: '', updatedAt: '',
    title: 'Building what comes next',
    text: 'We continue to grow our products, partnerships and capabilities with a long-term focus on useful innovation and dependable support.',
  },
]

const values = [
  {
    icon: Target,
    tag: 'MISSION',
    title: 'Make professional services easier to access.',
    text: 'We bring specialized support, clear processes and practical solutions together so clients can move forward with confidence.',
  },
  {
    icon: Compass,
    tag: 'VISION',
    title: 'Become a trusted multi-service Afghan business group.',
    text: 'Our vision is to build strong local companies that connect people and businesses with opportunities at home and internationally.',
  },
  {
    icon: ShieldCheck,
    tag: 'OUR VALUES',
    title: 'Trust, progress, quality and long-term relationships.',
    text: 'We value transparent communication, useful innovation, professional execution and support that continues beyond delivery.',
  },
]

const reasons = [
  {
    icon: Layers,
    title: 'One Group, Multiple Services',
    text: 'Education, travel, technology and media expertise under one coordinated brand.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=84',
  },
  {
    icon: Users,
    title: 'Specialized Teams',
    text: 'Each division focuses on its own field while sharing a common standard of service.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=84',
  },
  {
    icon: MapPin,
    title: 'Local Understanding',
    text: 'Solutions are shaped around Afghan clients, businesses and practical local realities.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1100&q=84',
  },
  {
    icon: Lightbulb,
    title: 'Modern Thinking',
    text: 'We combine proven processes with new tools, digital systems and better customer experiences.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=84',
  },
  {
    icon: HeartHandshake,
    title: 'Clear Relationships',
    text: 'Straightforward communication and structured service keep every engagement easier to follow.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1100&q=84',
  },
  {
    icon: Award,
    title: 'Long-Term Value',
    text: 'We aim to create useful results and relationships that remain valuable after delivery.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1100&q=84',
  },
]

const defaultLeaders: LeadershipRecord[] = [
  {
    id: 'samim-meyakhail', visible: true, sortOrder: 1, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Founder & Director',
    name: 'M. Samim Meyakhail',
    text: 'Provides strategic direction for the group and supports the long-term development of its companies and partnerships.',
  },
  {
    id: 'imran-afzali', visible: true, sortOrder: 2, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/46.jpg',
    role: 'Chief Executive Officer',
    name: 'Imran Afzali',
    text: 'Leads group operations, service development and the execution of Afghan Power Group’s growth across its core divisions.',
  },
  {
    id: 'education-lead', visible: true, sortOrder: 3, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Education Division Lead',
    name: 'Team Member 03',
    text: 'Coordinates educational consultancy services, student support and international study opportunities across the division.',
  },
  {
    id: 'travel-lead', visible: true, sortOrder: 4, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    role: 'Travel Division Lead',
    name: 'Team Member 04',
    text: 'Oversees travel services, visa assistance, ticketing and client coordination for international journeys.',
  },
  {
    id: 'technology-lead', visible: true, sortOrder: 5, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/64.jpg',
    role: 'Technology Division Lead',
    name: 'Team Member 05',
    text: 'Guides software, ERP, database, web and mobile development projects across Afghan Power Tech Development.',
  },
  {
    id: 'media-lead', visible: true, sortOrder: 6, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'Media Division Lead',
    name: 'Team Member 06',
    text: 'Leads creative production, branding, advertising and digital media services for clients and group companies.',
  },
  {
    id: 'operations-manager', visible: true, sortOrder: 7, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/71.jpg',
    role: 'Operations Manager',
    name: 'Team Member 07',
    text: 'Supports day-to-day coordination across divisions and keeps group operations aligned with service standards.',
  },
  {
    id: 'client-relations', visible: true, sortOrder: 8, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Client Relations Lead',
    name: 'Team Member 08',
    text: 'Focuses on client communication, service quality and creating a smoother experience across the Afghan Power Group.',
  },
  {
    id: 'business-development', visible: true, sortOrder: 9, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Business Development Lead',
    name: 'Team Member 09',
    text: 'Develops partnerships, identifies growth opportunities and supports the expansion of group services and products.',
  },
  {
    id: 'administration-finance', visible: true, sortOrder: 10, createdAt: '', updatedAt: '',
    photo: 'https://randomuser.me/api/portraits/women/79.jpg',
    role: 'Administration & Finance',
    name: 'Team Member 10',
    text: 'Supports administrative coordination and financial organization across the group’s operating companies.',
  },
]


const metrics = [
  { value: '4', label: 'Core companies' },
  { value: '4', label: 'Specialized sectors' },
  { value: '1', label: 'Unified group' },
  { value: '360°', label: 'Service mindset' },
]

export default function AboutPage() {
  const [activeReasonIndex, setActiveReasonIndex] = useState(0)
  const [storyHeading, setStoryHeading] = useState('Built step by step.\nDesigned to grow together.')
  const [storyIntro, setStoryIntro] = useState('Our story is not about one service. It is about building specialized companies that can grow independently and create more value together.')
  const [storyItems, setStoryItems] = useState<StoryItemRecord[]>(defaultStory)
  const [leaders, setLeaders] = useState<LeadershipRecord[]>(defaultLeaders)
  const activeReason = reasons[activeReasonIndex]
  const leadershipLoop = useMemo(() => leaders.length ? [...leaders, ...leaders] : [], [leaders])

  useEffect(() => {
    let active = true
    aboutApi.get().then(({ about }) => {
      if (!active) return
      if (about.story.heading) setStoryHeading(about.story.heading)
      if (about.story.intro) setStoryIntro(about.story.intro)
      setStoryItems(about.story.items)
      setLeaders(about.leaders)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <div className="about-kicker"><Sparkles size={15} /> ABOUT AFGHAN POWER GROUP</div>
          <h1>We build.<br />We connect.<br /><span>We grow.</span></h1>
          <p className="about-hero-lead">
            Afghan Power Group is a modern Afghan group of companies bringing education, travel, technology and media services together under one trusted brand.
          </p>
          <div className="about-hero-actions">
            <a className="primary-button" href="#about-companies">Explore Our Companies <ArrowRight size={18} /></a>
            <a className="about-text-link" href="#contact">Talk to our team <ArrowRight size={16} /></a>
          </div>
          <div className="about-hero-signals">
            <span><CheckCircle2 size={16} /> Group of Companies</span>
            <span><CheckCircle2 size={16} /> Kabul, Afghanistan</span>
          </div>
        </div>

        <div className="about-hero-visual" aria-label="Afghan Power Group divisions">
          <div className="about-orbit about-orbit-one" />
          <div className="about-orbit about-orbit-two" />
          <div className="about-visual-center">
            <img src="/afghan-power-logo-transparent.png" alt="Afghan Power Group" />
            <strong>AFGHAN POWER</strong>
            <span>GROUP OF COMPANIES</span>
          </div>
          {divisions.map(({ icon: Icon, label }, index) => (
            <div className={`about-division-chip about-chip-${index + 1}`} key={label}>
              <span><Icon size={18} /></span>
              <strong>{label}</strong>
            </div>
          ))}
          <div className="about-visual-note">ONE GROUP <span>•</span> MULTIPLE SOLUTIONS</div>
        </div>
      </section>

      <section className="about-who reveal">
        <div className="about-section-intro">
          <div className="about-kicker"><Building2 size={15} /> WHO WE ARE</div>
          <h2>Different expertise.<br />One shared standard.</h2>
        </div>
        <div className="about-who-copy">
          <p>
            We operate as a group because our clients often need more than one kind of support. A student may need admission guidance and travel assistance. A business may need software, branding and media. Afghan Power Group creates a stronger connection between these needs without losing the specialist focus of each division.
          </p>
          <p>
            Every company in the group has its own role, services and team, while sharing the same commitment to professional communication, reliable execution and useful long-term support.
          </p>
          <div className="about-who-tags">
            {['Education', 'Travel', 'Technology', 'Media Production'].map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>

      <section className="about-story reveal">
        <div className="about-section-heading">
          <div>
            <div className="about-kicker"><Sparkles size={15} /> OUR STORY</div>
            <h2>{storyHeading.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}{index < storyHeading.split('\n').length - 1 && <br />}</span>)}</h2>
          </div>
          <p>{storyIntro}</p>
        </div>
        <div className="about-timeline">
          {storyItems.map((item) => (
            <article className="about-timeline-item" key={item.step}>
              <div className="about-timeline-index">{item.step}</div>
              <span className="about-timeline-dot" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-purpose reveal">
        {values.map(({ icon: Icon, tag, title, text }) => (
          <article className="about-purpose-card" key={tag}>
            <div className="about-purpose-icon"><Icon size={24} /></div>
            <span>{tag}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <i />
          </article>
        ))}
      </section>

      <section id="about-companies" className="about-companies reveal">
        <div className="about-section-heading">
          <div>
            <div className="about-kicker"><Building2 size={15} /> OUR COMPANIES</div>
            <h2>Four focused companies.<br />One powerful group.</h2>
          </div>
          <p>Each division is built around a specific field, making it easier for clients to find focused expertise while staying connected to the wider group.</p>
        </div>
        <div className="about-company-grid">
          {divisions.map(({ icon: Icon, number, name, label, text, image, href }) => (
            <a className="about-company-card" href={href} key={name}>
              <div className="about-company-image">
                <img src={image} alt={name} loading="lazy" />
                <span>{number}</span>
              </div>
              <div className="about-company-body">
                <div className="about-company-meta"><Icon size={18} /><span>{label}</span></div>
                <h3>{name}</h3>
                <p>{text}</p>
                <div className="about-company-link">Explore division <ArrowRight size={17} /></div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="about-reasons reveal">
        <div className="about-reasons-intro">
          <div className="about-kicker"><ShieldCheck size={15} /> WHY AFGHAN POWER GROUP</div>
          <h2>Built around useful service, not unnecessary complexity.</h2>
          <p>Our group structure helps clients access specialist teams while keeping communication, quality and support connected.</p>
        </div>
        <div className="about-reasons-showcase">
          <div className="about-reason-picker" role="tablist" aria-label="Why Afghan Power Group categories">
            {reasons.map(({ icon: Icon, title, text }, index) => (
              <button
                className={activeReasonIndex === index ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeReasonIndex === index}
                aria-controls="about-reason-panel"
                id={`about-reason-tab-${index}`}
                onClick={() => setActiveReasonIndex(index)}
                key={title}
              >
                <span><Icon size={20} /></span>
                <strong>{title}</strong>
                <small>{text}</small>
              </button>
            ))}
          </div>
          <article
            className="about-reason-feature"
            role="tabpanel"
            id="about-reason-panel"
            aria-labelledby={`about-reason-tab-${activeReasonIndex}`}
          >
            <div className="about-reason-feature-image" key={activeReason.title}>
              <img src={activeReason.image} alt={activeReason.title} loading="lazy" />
            </div>
          </article>
        </div>
      </section>

      <section className="about-leadership reveal">
        <div className="about-section-heading">
          <div>
            <div className="about-kicker"><Users size={15} /> LEADERSHIP</div>
            <h2>Leadership with a<br />group-wide perspective.</h2>
          </div>
          <p>Afghan Power Group combines central leadership with specialized teams so each division can stay focused while moving toward the same long-term direction.</p>
        </div>
        <div className="about-leader-carousel" aria-label="Leadership team carousel">
          <div className="about-leader-track">
            {leadershipLoop.map((leader, index) => (
              <article className="about-leader-card" key={`${leader.name}-${index}`}>
                <div className="about-leader-photo-wrap">
                  <img className="about-leader-photo" src={leader.photo} alt={leader.name} loading="lazy" />
                  <div className="about-leader-photo-shine" />
                  <span className="about-leader-number">{String((index % leaders.length) + 1).padStart(2, '0')}</span>
                </div>
                <div className="about-leader-card-body">
                  <span>{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <p>{leader.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

