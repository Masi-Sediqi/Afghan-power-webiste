import type { LangCode } from './i18n'
import { localizedValue, type LocalizedFields } from './localization'
export type ContactDivisionText = { label:string; title:string; text:string }
export type ContactDivision = ContactDivisionText & { id:string; visible:boolean; sortOrder:number; translations?: LocalizedFields<ContactDivisionText> }
export type ContactTextFields = { heroKicker:string; heroTitle:string; heroHighlight:string; heroText:string; office:string; workingHours:string; infoTitle:string; infoText:string; mapTitle:string; mapText:string }
export type ContactSettings = ContactTextFields & { phone:string; email:string; whatsapp:string; mapEmbedUrl:string; divisions:ContactDivision[]; translations?: LocalizedFields<ContactTextFields> }
export type ContactMessageInput = { name:string; phone:string; email:string; division:string; service:string; subject:string; message:string }
export type ContactMessageRecord = ContactMessageInput & { id:string; status:'new'|'read'; createdAt:string; updatedAt:string }
export const localizeContact = (contact: ContactSettings, lang: LangCode): ContactSettings => {
  const localized = localizedValue(contact, contact.translations as LocalizedFields<ContactSettings> | undefined, lang)
  return { ...localized, divisions: contact.divisions.map((d) => localizedValue(d, d.translations as LocalizedFields<ContactDivision> | undefined, lang)) }
}
async function request<T>(path:string,options:RequestInit={}){const response=await fetch(path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const data=await response.json().catch(()=>({})) as Record<string,unknown>;if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'Request failed.');return data as T}
export const contactApi={ get:()=>request<{contact:ContactSettings}>('/api/contact'), send:(input:ContactMessageInput)=>request<{message:ContactMessageRecord}>('/api/contact/messages',{method:'POST',body:JSON.stringify(input)}) }
