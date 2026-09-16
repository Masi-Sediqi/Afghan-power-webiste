import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type ContactDivision = { id: string; label: string; title: string; text: string; visible: boolean; sortOrder: number }
export type ContactSettings = {
  heroKicker: string; heroTitle: string; heroHighlight: string; heroText: string;
  phone: string; email: string; whatsapp: string; office: string; workingHours: string;
  infoTitle: string; infoText: string; mapTitle: string; mapText: string; mapEmbedUrl: string;
  divisions: ContactDivision[]
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultFile = path.join(moduleDir, 'data', 'contact.json')
const clean = (v: unknown) => typeof v === 'string' ? v.trim() : ''
const defaults: ContactSettings = {
  heroKicker: 'CONTACT AFGHAN POWER GROUP', heroTitle: 'Start with the', heroHighlight: 'right team.',
  heroText: 'Education, travel, technology or media — tell us what you need and we’ll help you reach the right division without the back-and-forth.',
  phone: '+93 700 000 000', email: 'info@afghanpower.com', whatsapp: '+93 700 000 000', office: 'Kabul, Afghanistan', workingHours: 'Sat – Thu · 8:30 AM – 5:00 PM',
  infoTitle: 'Visit, call or message us.', infoText: 'Reach Afghan Power Group directly for education, travel, technology and media inquiries.',
  mapTitle: 'Visit us in Kabul.', mapText: 'Use the map below to find our office.', mapEmbedUrl: 'https://www.google.com/maps?q=Kabul%2C%20Afghanistan&output=embed',
  divisions: [
    { id:'education', label:'EDUCATION', title:'Educational Consultancy', text:'Study visas, university admissions, scholarships and international education guidance.', visible:true, sortOrder:1 },
    { id:'travel', label:'TRAVEL', title:'Travel Agency', text:'Tourist visas, air tickets, travel packages and practical journey support.', visible:true, sortOrder:2 },
    { id:'technology', label:'TECHNOLOGY', title:'Tech Development', text:'Software, databases, ERP systems, websites and custom digital solutions.', visible:true, sortOrder:3 },
    { id:'media', label:'MEDIA', title:'Media Production', text:'Advertising, video production, branding, design and digital marketing services.', visible:true, sortOrder:4 },
  ],
}

function normalize(input: Partial<ContactSettings>): ContactSettings {
  const divisions = Array.isArray(input.divisions) ? input.divisions.map((d, i) => ({
    id: clean(d.id).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || `division-${i+1}`,
    label: clean(d.label), title: clean(d.title), text: clean(d.text), visible: d.visible !== false,
    sortOrder: Number.isFinite(Number(d.sortOrder)) ? Number(d.sortOrder) : i + 1,
  })) : defaults.divisions
  const out: ContactSettings = {
    heroKicker: clean(input.heroKicker) || defaults.heroKicker, heroTitle: clean(input.heroTitle) || defaults.heroTitle,
    heroHighlight: clean(input.heroHighlight) || defaults.heroHighlight, heroText: clean(input.heroText) || defaults.heroText,
    phone: clean(input.phone) || defaults.phone, email: clean(input.email) || defaults.email,
    whatsapp: clean(input.whatsapp) || defaults.whatsapp, office: clean(input.office) || defaults.office,
    workingHours: clean(input.workingHours) || defaults.workingHours, infoTitle: clean(input.infoTitle) || defaults.infoTitle,
    infoText: clean(input.infoText) || defaults.infoText, mapTitle: clean(input.mapTitle) || defaults.mapTitle,
    mapText: clean(input.mapText) || defaults.mapText, mapEmbedUrl: clean(input.mapEmbedUrl) || defaults.mapEmbedUrl,
    divisions,
  }
  if (!out.email.includes('@')) throw new Error('Enter a valid contact email.')
  return out
}

async function readSettings(filePath: string) {
  try { return normalize(JSON.parse(await readFile(filePath,'utf8'))) }
  catch (e:any) { if (e?.code === 'ENOENT') return defaults; throw e }
}
async function writeSettings(filePath:string, data:ContactSettings) {
  await mkdir(path.dirname(filePath),{recursive:true}); const tmp=`${filePath}.tmp`; await writeFile(tmp,JSON.stringify(data,null,2)+'\n','utf8'); await rename(tmp,filePath)
}
export function createContactStore(filePath=defaultFile){ return {
  async get(){ const data=await readSettings(filePath); return {...data, divisions:data.divisions.filter(d=>d.visible).sort((a,b)=>a.sortOrder-b.sortOrder)} },
  async getAdmin(){ const data=await readSettings(filePath); return {...data, divisions:[...data.divisions].sort((a,b)=>a.sortOrder-b.sortOrder)} },
  async update(input:Partial<ContactSettings>){ const next=normalize(input); await writeSettings(filePath,next); return next },
}}
const store=createContactStore(); export const getContact=store.get; export const getAdminContact=store.getAdmin; export const updateContact=store.update
