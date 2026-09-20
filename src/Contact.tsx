import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, Headphones, Mail, MapPin, MessageCircle, Phone, PlaneTakeoff, Send, Sparkles, Video, Zap } from 'lucide-react'
import { contactApi, localizeContact, type ContactSettings } from './contactApi'
import { localizeService, servicesApi, type ServiceRecord } from './servicesApi'
import { useSiteLanguage } from './useSiteLanguage'

const fallback: ContactSettings = {
  heroKicker:'CONTACT AFGHAN POWER GROUP', heroTitle:'Start with the', heroHighlight:'right team.', heroText:'Education, travel, technology or media — tell us what you need and we’ll help you reach the right division without the back-and-forth.',
  phone:'+93 700 000 000', email:'info@afghanpower.com', whatsapp:'+93 700 000 000', office:'Kabul, Afghanistan', workingHours:'Sat – Thu · 8:30 AM – 5:00 PM',
  infoTitle:'Visit, call or message us.', infoText:'Reach Afghan Power Group directly for education, travel, technology and media inquiries.', mapTitle:'Visit us in Kabul.', mapText:'Use the map below to find our office.', mapEmbedUrl:'https://www.google.com/maps?q=Kabul%2C%20Afghanistan&output=embed', divisions:[],
}
const icons: Record<string, typeof GraduationCap> = { education:GraduationCap, travel:PlaneTakeoff, technology:Zap, media:Video }
const telHref=(value:string)=>`tel:${value.replace(/[^+\d]/g,'')}`
const waHref=(value:string)=>`https://wa.me/${value.replace(/\D/g,'')}`

export default function ContactPage() {
  const language = useSiteLanguage()
  const [contact,setContact]=useState<ContactSettings>(fallback)
  const [services,setServices]=useState<ServiceRecord[]>([])
  const [sending,setSending]=useState(false)
  const [submitted,setSubmitted]=useState(false)
  const [error,setError]=useState('')
  const [form,setForm]=useState({name:'',phone:'',email:'',division:'',service:'',subject:'',message:''})

  useEffect(()=>{ let active=true; Promise.all([contactApi.get(),servicesApi.list()]).then(([c,s])=>{if(!active)return;setContact(localizeContact(c.contact,language));setServices(s.services.map(item=>localizeService(item,language)))}).catch(()=>{}); return()=>{active=false}},[language])
  const filteredServices=useMemo(()=>form.division?services.filter(s=>s.category===form.division):services,[services,form.division])
  const divisions=contact.divisions.length?contact.divisions:[
    {id:'education',label:'EDUCATION',title:'Educational Consultancy',text:'Study visas, university admissions, scholarships and international education guidance.',visible:true,sortOrder:1},
    {id:'travel',label:'TRAVEL',title:'Travel Agency',text:'Tourist visas, air tickets, travel packages and practical journey support.',visible:true,sortOrder:2},
    {id:'technology',label:'TECHNOLOGY',title:'Tech Development',text:'Software, databases, ERP systems, websites and custom digital solutions.',visible:true,sortOrder:3},
    {id:'media',label:'MEDIA',title:'Media Production',text:'Advertising, video production, branding, design and digital marketing services.',visible:true,sortOrder:4},
  ]

  const submit=async(event:FormEvent)=>{event.preventDefault();setSending(true);setError('');setSubmitted(false);try{await contactApi.send(form);setSubmitted(true);setForm({name:'',phone:'',email:'',division:'',service:'',subject:'',message:''})}catch(e){setError(e instanceof Error?e.message:'Unable to send message.')}finally{setSending(false)}}

  return <div className="contact-page">
    <section className="contact-hero contact-hero-modern reveal is-visible">
      <div className="contact-hero-glow contact-hero-glow-one"/><div className="contact-hero-glow contact-hero-glow-two"/>
      <div className="contact-hero-copy">
        <div className="contact-kicker"><Sparkles size={15}/> {contact.heroKicker}</div>
        <h1>{contact.heroTitle} <span>{contact.heroHighlight}</span></h1><p>{contact.heroText}</p>
        <div className="contact-hero-mini"><div><span>{String(divisions.length).padStart(2,'0')}</span><small>Specialized divisions</small></div><div><span>01</span><small>Unified contact point</small></div><div><span>24/7</span><small>Digital inquiries</small></div></div>
      </div>
      <aside className="contact-hero-card"><div className="contact-hero-card-top"><span className="contact-hero-card-icon"><Headphones size={22}/></span><div><small>QUICK CONTACT</small><strong>Reach the group directly</strong></div></div>
        <div className="contact-hero-card-list"><a href={telHref(contact.phone)}><span><Phone size={19}/></span><div><small>CALL US</small><strong>{contact.phone}</strong></div><ArrowRight size={17}/></a><a href={`mailto:${contact.email}`}><span><Mail size={19}/></span><div><small>EMAIL</small><strong>{contact.email}</strong></div><ArrowRight size={17}/></a><a href="#contact-map"><span><MapPin size={19}/></span><div><small>OFFICE</small><strong>{contact.office}</strong></div><ArrowRight size={17}/></a></div>
        <div className="contact-hero-card-note"><span className="contact-live-dot"/><p>Contact details are managed from the Afghan Power admin panel.</p></div>
      </aside>
    </section>

    <section className="contact-divisions reveal"><div className="contact-section-head"><div><span className="contact-section-label">CHOOSE A DIVISION</span><h2>Talk to the right team.</h2></div><p>Each company has its own specialized services while remaining connected under Afghan Power Group.</p></div>
      <div className="contact-division-grid">{divisions.map((d,index)=>{const Icon=icons[d.id]||Zap;return <article className="contact-division-card" key={d.id}><div className="contact-division-top"><span className="contact-division-icon"><Icon size={22}/></span><span className="contact-card-number">{String(index+1).padStart(2,'0')}</span></div><small>{d.label}</small><h3>{d.title}</h3><p>{d.text}</p><a href="#contact-form" onClick={()=>setForm(v=>({...v,division:d.id,service:''}))}>Contact this division <ArrowRight size={16}/></a></article>})}</div>
    </section>

    <section id="contact-form" className="contact-main reveal"><div className="contact-form-panel"><div className="contact-form-heading"><span className="contact-section-label">SEND A MESSAGE</span><h2>Tell us what you need.</h2><p>Your message will be delivered directly to the admin inbox.</p></div>
      <form className="contact-form" onSubmit={submit}><div className="contact-field-grid">
        <label><span>Full Name</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} type="text" placeholder="Your full name" required/></label>
        <label><span>Phone Number</span><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} type="tel" placeholder="+93 700 000 000" required/></label>
        <label><span>Email Address</span><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" placeholder="name@example.com"/></label>
        <label><span>Select Division</span><select value={form.division} onChange={e=>setForm({...form,division:e.target.value,service:''})}><option value="">Choose a division</option>{divisions.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select></label>
        <label><span>Select Service</span><select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}><option value="">Choose a service</option>{filteredServices.map(s=><option key={s.id} value={s.title}>{s.title}</option>)}<option value="Other">Other</option></select></label>
        <label><span>Subject</span><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} type="text" placeholder="How can we help?"/></label>
      </div><label className="contact-message-field"><span>Message</span><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={6} placeholder="Tell us a little about what you need..." required/></label>
      <div className="contact-form-footer"><button className="contact-submit" type="submit" disabled={sending}>{sending?'Sending…':'Send Message'} <Send size={17}/></button><span>We usually respond during working hours.</span></div>
      {error&&<div className="contact-static-notice is-error" role="alert"><span>{error}</span></div>}{submitted&&<div className="contact-static-notice" role="status"><CheckCircle2 size={18}/><span>Your message has been sent successfully.</span></div>}</form>
    </div>
    <aside className="contact-info-panel"><div className="contact-info-copy"><span className="contact-section-label">AFGHAN POWER GROUP</span><h2>{contact.infoTitle}</h2><p>{contact.infoText}</p></div><div className="contact-info-list">
      <a href={telHref(contact.phone)} className="contact-info-row"><span><Phone size={20}/></span><div><small>PHONE</small><strong>{contact.phone}</strong></div></a><a href={`mailto:${contact.email}`} className="contact-info-row"><span><Mail size={20}/></span><div><small>EMAIL</small><strong>{contact.email}</strong></div></a><a href={waHref(contact.whatsapp)} className="contact-info-row" target="_blank" rel="noreferrer"><span><MessageCircle size={20}/></span><div><small>WHATSAPP</small><strong>{contact.whatsapp}</strong></div></a><div className="contact-info-row"><span><MapPin size={20}/></span><div><small>OFFICE</small><strong>{contact.office}</strong></div></div><div className="contact-info-row"><span><Clock3 size={20}/></span><div><small>WORKING HOURS</small><strong>{contact.workingHours}</strong></div></div>
    </div><div className="contact-quick-actions"><a href={waHref(contact.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp</a><a href={telHref(contact.phone)}><Phone size={18}/> Call us</a><a href={`mailto:${contact.email}`}><Mail size={18}/> Email</a></div></aside></section>

    <section id="contact-map" className="contact-map reveal"><div className="contact-map-heading"><div><span className="contact-section-label">FIND OUR OFFICE</span><h2>{contact.mapTitle}</h2></div><p>{contact.mapText}</p></div><div className="contact-map-surface contact-map-embed"><iframe title="Afghan Power Group office location" src={contact.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div className="contact-map-card"><small>OUR LOCATION</small><strong>{contact.office}</strong><span>{contact.mapText}</span></div></div></section>
  </div>
}
