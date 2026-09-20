import { useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

type ProductGroup = {
  title: string
  text: string
  href: string
  meta: string
  image: string
  brandLogo?: boolean
  brandAlt?: string
  brandTheme?: 'light' | 'dark'
}

const productGroups: ProductGroup[] = [
  {
    title: 'Tech Products',
    text: 'Ready-made databases, ERP platforms and business systems.',
    href: '#/products/tech',
    meta: 'Technology',
    image: '/afghan-power-tech-logo.jpg',
    brandLogo: true,
    brandAlt: 'Afghan Power Tech Development Company',
    brandTheme: 'light',
  },
  {
    title: 'Educational Products',
    text: 'Study, admission, scholarship and student visa packages.',
    href: '#/products/education',
    meta: 'Education',
    image: '/afghan-power-education-logo.jpg',
    brandLogo: true,
    brandAlt: 'Afghan Power Educational Consultancy Company',
    brandTheme: 'light',
  },
  {
    title: 'Travel Products',
    text: 'Tourist visa, ticketing, family travel and tour packages.',
    href: '#/products/travel',
    meta: 'Travel',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: 'Media Products',
    text: 'Advertising, social media, video and branding packages.',
    href: '#/products/media',
    meta: 'Media',
    image: '/afghan-power-media-logo.png',
    brandLogo: true,
    brandAlt: 'Afghan Power Media Production',
    brandTheme: 'dark',
  },
]

type ProductMegaMenuProps = {
  active?: boolean
}

export default function ProductMegaMenu({ active = false }: ProductMegaMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const suppressUntilLeave = useRef(false)

  const closeAfterSelection = () => {
    suppressUntilLeave.current = true
    setMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }

  const openMenu = () => {
    if (!suppressUntilLeave.current) setMenuOpen(true)
  }

  const leaveMenu = () => {
    suppressUntilLeave.current = false
    setMenuOpen(false)
  }

  return (
    <div
      className={`products-nav-wrap ${menuOpen ? 'is-open' : ''}`}
      onMouseEnter={openMenu}
      onMouseLeave={leaveMenu}
    >
      <a
        className={`products-nav-trigger ${active ? 'active' : ''}`}
        href="#/products"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        onFocus={openMenu}
        onClick={closeAfterSelection}
      >
        Products <ChevronDown className="products-nav-caret" size={13} strokeWidth={2.3} />
      </a>
      <div className="products-mega" role="menu" aria-label="Product categories">
        <div className="products-mega-head">
          <div>
            <span>AFGHAN POWER GROUP</span>
            <strong>Explore products by company</strong>
          </div>
          <a href="#/products" onClick={closeAfterSelection}>View all products <ArrowUpRight size={15}/></a>
        </div>
        <div className="products-mega-grid">
          {productGroups.map(({ title, text, href, meta, image, brandLogo, brandAlt, brandTheme }) => (
            <a className={`mega-product-card ${brandLogo ? 'has-brand-logo' : ''}`} href={href} key={title} role="menuitem" onClick={closeAfterSelection}>
              <div className={`mega-product-image ${brandLogo ? 'is-brand-logo' : ''} ${brandTheme ? `brand-${brandTheme}` : ''}`}>
                <img src={image} alt={brandAlt ?? title} loading="lazy" />
              </div>
              <span className="mega-product-meta">{meta}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <span className="mega-product-link">Explore <ArrowUpRight size={15}/></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
