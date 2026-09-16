import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

export type ContactMessageInput = { name:string; phone:string; email?:string; division?:string; service?:string; subject?:string; message:string }
export type ContactMessageRecord = ContactMessageInput & { id:string; status:'new'|'read'; createdAt:string; updatedAt:string }
const moduleDir=path.dirname(fileURLToPath(import.meta.url)); const defaultFile=path.join(moduleDir,'data','messages.json')
const clean=(v:unknown)=>typeof v==='string'?v.trim():''
async function readAll(file:string):Promise<ContactMessageRecord[]>{ try{const raw=JSON.parse(await readFile(file,'utf8')); return Array.isArray(raw)?raw:[]}catch(e:any){if(e?.code==='ENOENT')return[];throw e} }
async function writeAll(file:string,data:ContactMessageRecord[]){await mkdir(path.dirname(file),{recursive:true});const tmp=`${file}.tmp`;await writeFile(tmp,JSON.stringify(data,null,2)+'\n');await rename(tmp,file)}
export function createMessageStore(file=defaultFile){return {
  async list(){ return (await readAll(file)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)) },
  async create(input:ContactMessageInput){ const name=clean(input.name),phone=clean(input.phone),message=clean(input.message),email=clean(input.email),division=clean(input.division),service=clean(input.service),subject=clean(input.subject); if(!name)throw new Error('Full name is required.'); if(!phone)throw new Error('Phone number is required.'); if(!message)throw new Error('Message is required.'); if(email&&!email.includes('@'))throw new Error('Enter a valid email address.'); const now=new Date().toISOString(); const item:ContactMessageRecord={id:randomUUID(),name,phone,email,division,service,subject,message,status:'new',createdAt:now,updatedAt:now}; const all=await readAll(file);all.push(item);await writeAll(file,all);return item },
  async setStatus(id:string,status:'new'|'read'){const all=await readAll(file);const i=all.findIndex(x=>x.id===id);if(i<0)return null;all[i]={...all[i],status,updatedAt:new Date().toISOString()};await writeAll(file,all);return all[i]},
  async remove(id:string){const all=await readAll(file);const next=all.filter(x=>x.id!==id);if(next.length===all.length)return false;await writeAll(file,next);return true},
}}
const store=createMessageStore(); export const listMessages=store.list; export const createMessage=store.create; export const setMessageStatus=store.setStatus; export const deleteMessage=store.remove
