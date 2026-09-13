import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlaneTakeoff,
  Send,
  Sparkles,
  Video,
  Zap,
} from 'lucide-react'

const divisions = [
  {
    icon: GraduationCap,
    label: 'EDUCATION',
    title: 'Educational Consultancy',
    text: 'Study visas, university admissions, scholarships and international education guidance.',
  },
  {
    icon: PlaneTakeoff,
    label: 'TRAVEL',
    title: 'Travel Agency',
    text: 'Tourist visas, air tickets, travel packages and practical journey support.',
  },
  {
    icon: Zap,
    label: 'TECHNOLOGY',
    title: 'Tech Development',
    text: 'Software, databases, ERP systems, websites and custom digital solutions.',
  },
  {
    icon: Video,
    label: 'MEDIA',
    title: 'Media Production',
    text: 'Advertising, video production, branding, design and digital marketing services.',
  },
]


export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="contact-page">
      <section className="contact-hero contact-hero-modern reveal is-visible">
        <div className="contact-hero-glow contact-hero-glow-one" />
        <div className="contact-hero-glow contact-hero-glow-two" />

        <div className="contact-hero-copy">
          <div className="contact-kicker"><Sparkles size={15} /> CONTACT AFGHAN POWER GROUP</div>
          <h1>Start with the <span>right team.</span></h1>
          <p>
            Education, travel, technology or media — tell us what you need and we’ll help you reach the right division without the back-and-forth.
          </p>
          <div className="contact-hero-mini">
            <div><span>04</span><small>Specialized divisions</small></div>
            <div><span>01</span><small>Unified contact point</small></div>
            <div><span>24/7</span><small>Digital inquiries</small></div>
          </div>
        </div>

        <aside className="contact-hero-card">
          <div className="contact-hero-card-top">
            <span className="contact-hero-card-icon"><Headphones size={22} /></span>
            <div>
              <small>QUICK CONTACT</small>
              <strong>Reach the group directly</strong>
            </div>
          </div>

          <div className="contact-hero-card-list">
            <a href="tel:+93700000000">
              <span><Phone size={19} /></span>
              <div><small>CALL US</small><strong>+93 700 000 000</strong></div>
              <ArrowRight size={17} />
            </a>
            <a href="mailto:info@afghanpower.com">
              <span><Mail size={19} /></span>
              <div><small>EMAIL</small><strong>info@afghanpower.com</strong></div>
              <ArrowRight size={17} />
            </a>
            <a href="#contact-map">
              <span><MapPin size={19} /></span>
              <div><small>OFFICE</small><strong>Kabul, Afghanistan</strong></div>
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="contact-hero-card-note">
            <span className="contact-live-dot" />
            <p>Static contact details for now — ready to connect to dynamic settings later.</p>
          </div>
        </aside>
      </section>

      <section className="contact-divisions reveal">
        <div className="contact-section-head">
          <div>
            <span className="contact-section-label">CHOOSE A DIVISION</span>
            <h2>Talk to the right team.</h2>
          </div>
          <p>Each company has its own specialized services while remaining connected under Afghan Power Group.</p>
        </div>

        <div className="contact-division-grid">
          {divisions.map(({ icon: Icon, label, title, text }, index) => (
            <article className="contact-division-card" key={title}>
              <div className="contact-division-top">
                <span className="contact-division-icon"><Icon size={22} /></span>
                <span className="contact-card-number">0{index + 1}</span>
              </div>
              <small>{label}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#contact-form">Contact this division <ArrowRight size={16} /></a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact-form" className="contact-main reveal">
        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <span className="contact-section-label">SEND A MESSAGE</span>
            <h2>Tell us what you need.</h2>
            <p>For now this form is a static design preview. The backend and dynamic routing can be connected later.</p>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="contact-field-grid">
              <label>
                <span>Full Name</span>
                <input type="text" placeholder="Your full name" required />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" placeholder="+93 700 000 000" required />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" placeholder="name@example.com" />
              </label>
              <label>
                <span>Select Division</span>
                <select defaultValue="">
                  <option value="" disabled>Choose a division</option>
                  <option>Educational Consultancy</option>
                  <option>Travel Agency</option>
                  <option>Tech Development</option>
                  <option>Media Production</option>
                </select>
              </label>
              <label>
                <span>Select Service</span>
                <select defaultValue="">
                  <option value="" disabled>Choose a service</option>
                  <option>Study / Education Service</option>
                  <option>Visa / Travel Service</option>
                  <option>Software / Database</option>
                  <option>Media / Marketing</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                <span>Subject</span>
                <input type="text" placeholder="How can we help?" />
              </label>
            </div>

            <label className="contact-message-field">
              <span>Message</span>
              <textarea rows={6} placeholder="Tell us a little about what you need..." required />
            </label>

            <div className="contact-form-footer">
              <button className="contact-submit" type="submit">Send Message <Send size={17} /></button>
              <span>We usually respond during working hours.</span>
            </div>

            {submitted && (
              <div className="contact-static-notice" role="status">
                <CheckCircle2 size={18} />
                <span>Design preview complete — message delivery will be connected when the website becomes dynamic.</span>
              </div>
            )}
          </form>
        </div>

        <aside className="contact-info-panel">
          <div className="contact-info-copy">
            <span className="contact-section-label">AFGHAN POWER GROUP</span>
            <h2>Visit, call or message us.</h2>
            <p>Default information is used in this static version and can be replaced from the admin/backend later.</p>
          </div>

          <div className="contact-info-list">
            <a href="tel:+93700000000" className="contact-info-row">
              <span><Phone size={20} /></span>
              <div><small>PHONE</small><strong>+93 700 000 000</strong></div>
            </a>
            <a href="mailto:info@afghanpower.com" className="contact-info-row">
              <span><Mail size={20} /></span>
              <div><small>EMAIL</small><strong>info@afghanpower.com</strong></div>
            </a>
            <a href="#" className="contact-info-row">
              <span><MessageCircle size={20} /></span>
              <div><small>WHATSAPP</small><strong>+93 700 000 000</strong></div>
            </a>
            <div className="contact-info-row">
              <span><MapPin size={20} /></span>
              <div><small>OFFICE</small><strong>Kabul, Afghanistan</strong></div>
            </div>
            <div className="contact-info-row">
              <span><Clock3 size={20} /></span>
              <div><small>WORKING HOURS</small><strong>Sat – Thu · 8:30 AM – 5:00 PM</strong></div>
            </div>
          </div>

          <div className="contact-quick-actions">
            <a href="#"><MessageCircle size={18} /> WhatsApp</a>
            <a href="tel:+93700000000"><Phone size={18} /> Call us</a>
            <a href="mailto:info@afghanpower.com"><Mail size={18} /> Email</a>
          </div>
        </aside>
      </section>

      <section id="contact-map" className="contact-map reveal">
        <div className="contact-map-heading">
          <div>
            <span className="contact-section-label">FIND OUR OFFICE</span>
            <h2>Visit us in Kabul.</h2>
          </div>
          <p>The map below is an embedded placeholder. Later you can replace only the iframe URL with the exact office location.</p>
        </div>

        <div className="contact-map-surface contact-map-embed">
          <iframe
            title="Afghan Power Group office location"
            src="https://www.google.com/maps?q=Kabul%2C%20Afghanistan&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="contact-map-card">
            <small>OUR LOCATION</small>
            <strong>Kabul, Afghanistan</strong>
            <span>Replace this map URL later with your exact office pin.</span>
          </div>
        </div>
      </section>


    </div>
  )
}
