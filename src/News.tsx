import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Filter, Flame, Search, Tag } from 'lucide-react'
import { localizeNews, newsApi, type NewsCategory, type NewsRecord } from './newsApi'
import { useSiteLanguage } from './useSiteLanguage'

type NewsCategoryFilter = 'all' | NewsCategory
type DateFilter = 'Any time' | 'This week' | 'This month'

const categories: Array<{ value: NewsCategoryFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'technology', label: 'Technology' },
  { value: 'media', label: 'Media' },
  { value: 'company', label: 'Company' },
]
const dateFilters: DateFilter[] = ['Any time', 'This week', 'This month']
const categoryLabel = (value: NewsCategory) => categories.find((item) => item.value === value)?.label || value

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<NewsCategoryFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('Any time')
  const [query, setQuery] = useState('')
  const language = useSiteLanguage()
  const localizedNews = useMemo(() => newsItems.map((item) => localizeNews(item, language)), [newsItems, language])

  useEffect(() => {
    let active = true
    setLoading(true)
    newsApi.list()
      .then((result) => { if (active) { setNewsItems(result.news); setError('') } })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load news.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const featured = useMemo(() => {
    const selected = localizedNews.filter((item) => item.featured)
    return (selected.length ? selected : localizedNews).slice(0, 5)
  }, [localizedNews])

  const latestDate = localizedNews.reduce((latest, item) => item.date > latest ? item.date : latest, '')
  const updatedLabel = latestDate
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${latestDate}T00:00:00`))
    : 'Latest updates'

  const filteredNews = useMemo(() => {
    const now = new Date()
    const normalizedQuery = query.trim().toLowerCase()

    return localizedNews.filter((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`)
      const daysOld = Math.floor((now.getTime() - itemDate.getTime()) / 86400000)
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesDate =
        dateFilter === 'Any time' ||
        (dateFilter === 'This week' && daysOld >= 0 && daysOld <= 7) ||
        (dateFilter === 'This month' && daysOld >= 0 && daysOld <= 31)
      const matchesSearch = !normalizedQuery || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesDate && matchesSearch
    })
  }, [activeCategory, dateFilter, localizedNews, query])

  return (
    <div className="news-page">
      <section className="news-hero reveal">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1900&q=86" alt="" />
        <div className="news-hero-overlay" />
        <div className="news-hero-content">
          <div className="news-kicker"><Flame size={15} /> AFGHAN POWER NEWSROOM</div>
          <h1>Latest updates from Afghan Power Group.</h1>
          <p>Follow company news, new services, travel updates, education opportunities, technology releases and media announcements from one trusted group.</p>
          <div className="news-hero-meta">
            <span><CalendarDays size={15} /> Updated {updatedLabel}</span>
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
        {loading ? <div className="news-empty-state">Loading news…</div> : error ? <div className="news-empty-state">{error}</div> : (
          <div className="news-featured-grid">
            {featured.map((item, index) => (
              <article className="news-featured-card content-enter" key={item.id} style={{ '--enter-delay': `${Math.min(index, 4) * 70}ms` } as CSSProperties}>
                <img src={item.image} alt="" loading="lazy" />
                <div className="news-card-shade" />
                <div className="news-featured-copy">
                  <span>{categoryLabel(item.category)}</span>
                  <h3>{item.title}</h3>
                  <small>{formatDate(item.date)} · {item.readTime}</small>
                </div>
              </article>
            ))}
          </div>
        )}
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
            {filteredNews.map((item, index) => (
              <article className="news-list-card content-enter" key={`${activeCategory}-${dateFilter}-${item.id}`} style={{ '--enter-delay': `${Math.min(index, 7) * 45}ms` } as CSSProperties}>
                <img src={item.image} alt="" loading="lazy" />
                <div>
                  <span>{categoryLabel(item.category)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <small><CalendarDays size={14} /> {formatDate(item.date)} <Clock3 size={14} /> {item.readTime}</small>
                </div>
              </article>
            ))}
            {!loading && filteredNews.length === 0 && <div className="news-empty-state">No news matched this filter.</div>}
          </div>
        </div>

        <aside className="news-filter-panel content-enter" style={{ '--enter-delay': '120ms' } as CSSProperties}>
          <div className="news-filter-title"><Filter size={17} /> Filter news</div>
          <label className="news-search-box">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search news..." />
          </label>

          <div className="news-filter-group">
            <span>Category</span>
            {categories.map((category) => (
              <button className={activeCategory === category.value ? 'active' : ''} onClick={() => setActiveCategory(category.value)} key={category.value} type="button">
                {category.label}
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
