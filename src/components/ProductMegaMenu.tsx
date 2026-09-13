import { ArrowUpRight, ChevronDown } from 'lucide-react'

const productGroups = [
  {
    title: 'Educational Products',
    text: 'Study, admission, scholarship and student visa packages.',
    href: '#/products/education',
    meta: 'Education',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: 'Travel Products',
    text: 'Tourist visa, ticketing, family travel and tour packages.',
    href: '#/products/travel',
    meta: 'Travel',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: 'Tech Products',
    text: 'Ready-made databases, ERP platforms and business systems.',
    href: '#/products/tech',
    meta: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: 'Media Products',
    text: 'Advertising, social media, video and branding packages.',
    href: '#/products/media',
    meta: 'Media',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=700&q=82',
  },
]

export default function ProductMegaMenu() {
  return (
    <div className="products-nav-wrap">
      <a className="products-nav-trigger" href="#/products" aria-haspopup="true">
        Products <ChevronDown className="products-nav-caret" size={13} strokeWidth={2.3} />
      </a>
      <div className="products-mega" role="menu" aria-label="Product categories">
        <div className="products-mega-head">
          <div>
            <span>AFGHAN POWER GROUP</span>
            <strong>Explore products by company</strong>
          </div>
          <a href="#/products">View all products <ArrowUpRight size={15}/></a>
        </div>
        <div className="products-mega-grid">
          {productGroups.map(({ title, text, href, meta, image }) => (
            <a className="mega-product-card" href={href} key={title} role="menuitem">
              <div className="mega-product-image"><img src={image} alt="" loading="lazy" /></div>
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
