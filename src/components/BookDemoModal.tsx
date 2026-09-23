import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, CheckCircle2, Clock3, Laptop2, Mail, MessageSquareText, Phone, Send, UserRound, X } from 'lucide-react'
import { contactApi } from '../contactApi'
import { localizeProduct, productsApi, type ProductRecord } from '../productsApi'
import { useSiteLanguage } from '../useSiteLanguage'

type Props = { open: boolean; onClose: () => void }

type DemoForm = {
  name: string
  phone: string
  email: string
  company: string
  productId: string
  preferredDate: string
  preferredTime: string
  meetingType: string
  notes: string
}

const emptyForm: DemoForm = {
  name: '', phone: '', email: '', company: '', productId: '', preferredDate: '', preferredTime: '', meetingType: 'Online', notes: '',
}

const copy = {
  en: {
    kicker: 'PRODUCT DEMO', title: 'Book a Demo', text: 'Choose a product and your preferred time. Our team will contact you to confirm the appointment.',
    name: 'Full Name', phone: 'Phone / WhatsApp', email: 'Email Address', company: 'Company / Organization', product: 'Product or Solution', date: 'Preferred Date', time: 'Preferred Time', meeting: 'Meeting Type', notes: 'What would you like to see in the demo?',
    choose: 'Choose a product', online: 'Online demo', office: 'Office meeting', notesPh: 'Tell us what you want our team to focus on...', send: 'Request Demo', sending: 'Sending request...', successTitle: 'Demo request sent', successText: 'Thank you. Our team will contact you to confirm the date and time.', another: 'Book another demo', close: 'Close', required: 'Please complete all required fields.', failed: 'Unable to send the demo request. Please try again.', optional: 'Optional',
  },
  fa: {
    kicker: 'دموی محصول', title: 'رزرو دمو', text: 'محصول و زمان دلخواه خود را انتخاب کنید. تیم ما برای تأیید وقت با شما تماس می‌گیرد.',
    name: 'نام کامل', phone: 'شماره تماس / واتساپ', email: 'ایمیل', company: 'شرکت / سازمان', product: 'محصول یا سیستم', date: 'تاریخ پیشنهادی', time: 'ساعت پیشنهادی', meeting: 'نوع جلسه', notes: 'در دمو چه چیزی را می‌خواهید ببینید؟',
    choose: 'یک محصول را انتخاب کنید', online: 'دموی آنلاین', office: 'جلسه حضوری', notesPh: 'بنویسید تیم ما روی کدام بخش‌ها تمرکز کند...', send: 'درخواست دمو', sending: 'در حال ارسال...', successTitle: 'درخواست دمو ارسال شد', successText: 'تشکر. تیم ما برای تأیید تاریخ و ساعت با شما تماس می‌گیرد.', another: 'رزرو دموی دیگر', close: 'بستن', required: 'لطفاً بخش‌های ضروری را تکمیل کنید.', failed: 'درخواست ارسال نشد. دوباره تلاش کنید.', optional: 'اختیاری',
  },
  ps: {
    kicker: 'د محصول ډیمو', title: 'ډیمو رزرف کړئ', text: 'محصول او مناسب وخت وټاکئ. زموږ ټیم به د وخت د تایید لپاره له تاسو سره اړیکه ونیسي.',
    name: 'بشپړ نوم', phone: 'تلیفون / واټساپ', email: 'برېښنالیک', company: 'شرکت / اداره', product: 'محصول یا سیستم', date: 'غوره نېټه', time: 'غوره وخت', meeting: 'د ناستې ډول', notes: 'په ډیمو کې څه لیدل غواړئ؟',
    choose: 'یو محصول وټاکئ', online: 'آنلاین ډیمو', office: 'حضوري ناسته', notesPh: 'ووایاست چې زموږ ټیم پر کومو برخو تمرکز وکړي...', send: 'د ډیمو غوښتنه', sending: 'لېږل کېږي...', successTitle: 'د ډیمو غوښتنه ولېږل شوه', successText: 'مننه. زموږ ټیم به د نېټې او وخت د تایید لپاره اړیکه ونیسي.', another: 'بله ډیمو رزرف کړئ', close: 'بندول', required: 'مهرباني وکړئ اړین معلومات بشپړ کړئ.', failed: 'غوښتنه ونه لېږل شوه. بیا هڅه وکړئ.', optional: 'اختیاري',
  },
} as const

export default function BookDemoModal({ open, onClose }: Props) {
  const language = useSiteLanguage()
  const t = copy[language]
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [form, setForm] = useState<DemoForm>(emptyForm)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const minDate = useMemo(() => {
    const now = new Date()
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 10)
  }, [open])

  useEffect(() => {
    if (!open) return
    let active = true
    productsApi.list().then(({ products: items }) => {
      if (active) setProducts(items.filter((item) => item.visible).map((item) => localizeProduct(item, language)))
    }).catch(() => { if (active) setProducts([]) })
    return () => { active = false }
  }, [open, language])

  useEffect(() => {
    if (!open) return
    document.body.classList.add('demo-modal-open')
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.classList.remove('demo-modal-open'); window.removeEventListener('keydown', onKeyDown) }
  }, [open, onClose])

  const selectedProduct = products.find((item) => item.id === form.productId)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time'

  useEffect(() => {
    if (!open) { setSuccess(false); setError('') }
  }, [open])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.productId || !form.preferredDate || !form.preferredTime || !form.meetingType) {
      setError(t.required)
      return
    }
    setSending(true)
    try {
      await contactApi.send({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        division: selectedProduct?.category || 'technology',
        service: selectedProduct?.title || form.productId,
        subject: 'Demo Booking Request',
        message: form.notes.trim() || 'Customer requested a product demo. Please contact them to confirm the appointment.',
        requestType: 'demo',
        company: form.company.trim(),
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        meetingType: form.meetingType,
        timeZone,
      })
      setSuccess(true)
      setForm(emptyForm)
    } catch (e) {
      setError(e instanceof Error ? e.message : t.failed)
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return createPortal(
    <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
      <button className="demo-modal-backdrop" type="button" onClick={onClose} aria-label={t.close}/>
      <section className="demo-modal-card">
        <button className="demo-modal-close" type="button" onClick={onClose} aria-label={t.close}><X size={20}/></button>
        {success ? (
          <div className="demo-success">
            <span className="demo-success-icon"><CheckCircle2 size={32}/></span>
            <small>{t.kicker}</small>
            <h2>{t.successTitle}</h2>
            <p>{t.successText}</p>
            <div className="demo-success-actions">
              <button type="button" onClick={() => setSuccess(false)}>{t.another}</button>
              <button className="is-primary" type="button" onClick={onClose}>{t.close}</button>
            </div>
          </div>
        ) : (
          <>
            <header className="demo-modal-head">
              <span><CalendarDays size={16}/>{t.kicker}</span>
              <h2 id="demo-modal-title">{t.title}</h2>
              <p>{t.text}</p>
            </header>
            <form className="demo-form" onSubmit={submit}>
              <div className="demo-field-grid">
                <label><span>{t.name} *</span><div><UserRound size={16}/><input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder={t.name}/></div></label>
                <label><span>{t.phone} *</span><div><Phone size={16}/><input required type="tel" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="+93 700 000 000"/></div></label>
                <label><span>{t.email} <small>{t.optional}</small></span><div><Mail size={16}/><input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="name@example.com"/></div></label>
                <label><span>{t.company} <small>{t.optional}</small></span><div><Laptop2 size={16}/><input value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} placeholder={t.company}/></div></label>
                <label className="span-2"><span>{t.product} *</span><select required value={form.productId} onChange={(e)=>setForm({...form,productId:e.target.value})}><option value="">{t.choose}</option>{products.map((product)=><option key={product.id} value={product.id}>{product.title}</option>)}<option value="Custom Software / Other">Custom Software / Other</option></select></label>
                <label><span>{t.date} *</span><div><CalendarDays size={16}/><input required type="date" min={minDate} value={form.preferredDate} onChange={(e)=>setForm({...form,preferredDate:e.target.value})}/></div></label>
                <label><span>{t.time} *</span><div><Clock3 size={16}/><input required type="time" value={form.preferredTime} onChange={(e)=>setForm({...form,preferredTime:e.target.value})}/></div></label>
                <label className="span-2"><span>{t.meeting} *</span><div className="demo-meeting-options"><button type="button" className={form.meetingType==='Online'?'active':''} onClick={()=>setForm({...form,meetingType:'Online'})}><Laptop2 size={16}/>{t.online}</button><button type="button" className={form.meetingType==='Office'?'active':''} onClick={()=>setForm({...form,meetingType:'Office'})}><UserRound size={16}/>{t.office}</button></div></label>
                <label className="span-2 demo-notes"><span>{t.notes} <small>{t.optional}</small></span><div><MessageSquareText size={16}/><textarea rows={4} value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder={t.notesPh}/></div></label>
              </div>
              {error && <div className="demo-form-error" role="alert">{error}</div>}
              <button className="demo-submit" type="submit" disabled={sending}>{sending ? t.sending : t.send}<Send size={16}/></button>
            </form>
          </>
        )}
      </section>
    </div>,
    document.body,
  )
}
