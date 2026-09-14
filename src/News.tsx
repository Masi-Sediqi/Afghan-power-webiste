import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Filter, Flame, Search, Tag } from 'lucide-react'

type NewsCategory = 'All' | 'Education' | 'Travel' | 'Technology' | 'Media' | 'Company'
type DateFilter = 'Any time' | 'This week' | 'This month'

const categories: NewsCategory[] = ['All', 'Education', 'Travel', 'Technology', 'Media', 'Company']
const dateFilters: DateFilter[] = ['Any time', 'This week', 'This month']

const newsItems = [
  {
    id: 1,
    title: 'New student visa support desk opens for fall admissions',
    category: 'Education',
    date: '2026-09-12',
    readTime: '4 min read',
    hot: true,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=84',
    summary: 'Afghan Power Education expands document review, admission tracking and student visa guidance for upcoming international programs.',
  },
  {
    id: 2,
    title: 'Travel team adds faster consultation flow for tourist visas',
    category: 'Travel',
    date: '2026-09-10',
    readTime: '3 min read',
    hot: true,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=84',
    summary: 'Clients can now move from first consultation to document checklist with a clearer step-by-step process.',
  },
  {
    id: 3,
    title: 'Afghan Power Tech previews a cleaner ERP reporting dashboard',
    category: 'Technology',
    date: '2026-09-08',
    readTime: '5 min read',
    hot: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=84',
    summary: 'The new dashboard focuses on faster sales, stock, finance and operations visibility for local businesses.',
  },
  {
    id: 4,
    title: 'Media production unit launches new brand content packages',
    category: 'Media',
    date: '2026-09-04',
    readTime: '4 min read',
    hot: false,
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=84',
    summary: 'New video, design and digital campaign packages help brands present products with stronger visual consistency.',
  },
  {
    id: 5,
    title: 'Group-wide service standards updated for clearer client follow-up',
    category: 'Company',
    date: '2026-08-30',
    readTime: '2 min read',
    hot: false,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=84',
    summary: 'Afghan Power Group introduces shared communication and follow-up rules across education, travel, tech and media teams.',
  },
  {
    id: 6,
    title: 'Scholarship preparation sessions planned for competitive programs',
    category: 'Education',
    date: '2026-08-24',
    readTime: '3 min read',
    hot: false,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=84',
    summary: 'The education team will guide students on scholarship documents, statements and stronger application planning.',
  },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All')
  const [dateFilter, setDateFilter] = useState<DateFilter>('Any time')
  const [query, setQuery] = useState('')

  const featured = newsItems.slice(0, 5)

  const filteredNews = useMemo(() => {
    const now = new Date('2026-09-14')
    const normalizedQuery = query.trim().toLowerCase()

    return newsItems.filter((item) => {
      const itemDate = new Date(item.date)
      const daysOld = Math.floor((now.getTime() - itemDate.getTime()) / 86400000)
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesDate =
        dateFilter === 'Any time' ||
        (dateFilter === 'This week' && daysOld <= 7) ||
        (dateFilter === 'This month' && daysOld <= 31)
      const matchesSearch = !normalizedQuery || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesDate && matchesSearch
    })
  }, [activeCategory, dateFilter, query])

  return (
    <div className="news-page">
      <section className="news-hero">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1900&q=86" alt="" />
        <div className="news-hero-overlay" />
        <div className="news-hero-content">
          <div className="news-kicker"><Flame size={15} /> AFGHAN POWER NEWSROOM</div>
          <h1>Latest updates from Afghan Power Group.</h1>
          <p>Follow company news, new services, travel updates, education opportunities, technology releases and media announcements from one trusted group.</p>
          <div className="news-hero-meta">
            <span><CalendarDays size={15} /> Updated September 2026</span>
            <span><Tag size={15} /> Education · Travel · Tech · Media</span>
          </div>
        </div>
      </section>

      <section className="news-featured-section reveal">
        <div className="news-section-head">
          <div>
            <span>FEATURED NEWS</span>
            <h2>New and trending stories.</h2>
          </div>
          <a href="#news-list">View all <ArrowRight size={17} /></a>
        </div>
        <div className="news-featured-grid">
          {featured.map((item) => (
            <article className="news-featured-card" key={item.id}>
              <img src={item.image} alt="" loading="lazy" />
              <div className="news-card-shade" />
              <div className="news-featured-copy">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <small>{formatDate(item.date)} · {item.readTime}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="news-list" className="news-list-section reveal">
        <div className="news-list-main">
          <div className="news-section-head compact">
            <div>
              <span>LATEST STORIES</span>
              <h2>News list.</h2>
            </div>
            <small>{filteredNews.length} stories found</small>
          </div>

          <div className="news-list">
            {filteredNews.map((item) => (
              <article className="news-list-card" key={item.id}>
                <img src={item.image} alt="" loading="lazy" />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <small><CalendarDays size={14} /> {formatDate(item.date)} <Clock3 size={14} /> {item.readTime}</small>
                </div>
              </article>
            ))}
            {filteredNews.length === 0 && <div className="news-empty-state">No news matched this filter.</div>}
          </div>
        </div>

        <aside className="news-filter-panel">
          <div className="news-filter-title"><Filter size={17} /> Filter news</div>
          <label className="news-search-box">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search news..." />
          </label>

          <div className="news-filter-group">
            <span>Category</span>
            {categories.map((category) => (
              <button className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category} type="button">
                {category}
              </button>
            ))}
          </div>

          <div className="news-filter-group">
            <span>Date</span>
            {dateFilters.map((filter) => (
              <button className={dateFilter === filter ? 'active' : ''} onClick={() => setDateFilter(filter)} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}
