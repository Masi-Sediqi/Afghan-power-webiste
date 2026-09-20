import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const productCategories = ['education', 'travel', 'technology', 'media'] as const
export type ProductCategory = typeof productCategories[number]
export type ProductDetailRow = { label: string; value: string }
export type ProductTextFields = {
  title: string; subtitle: string; description: string; features: string[]; badge: string; priceLabel: string;
  details: ProductDetailRow[]; sectionTitle: string; sectionBody: string; recommendedTitle: string;
  recommendedFor: string[]; requirementsTitle: string; requirements: string[]; actionLabel: string; secondaryLabel: string;
}
export type ProductTranslations = { fa?: Partial<ProductTextFields>; ps?: Partial<ProductTextFields> }
export type ProductInput = ProductTextFields & {
  id: string; category: ProductCategory; images: string[]; visible: boolean; sortOrder: number; secondaryHref: string;
  translations?: ProductTranslations
}
export type ProductRecord = ProductInput & { createdAt: string; updatedAt: string }

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultDataFile = path.join(moduleDir, 'data', 'products.json')
const cleanText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const cleanStringArray = (value: unknown) => Array.isArray(value) ? value.map(cleanText).filter(Boolean) : []
function cleanDetails(value: unknown): ProductDetailRow[] { if (!Array.isArray(value)) return []; return value.map((item:any)=>({label:cleanText(item?.label),value:cleanText(item?.value)})).filter(i=>i.label&&i.value) }
function cleanTranslation(input: any): Partial<ProductTextFields> {
  if (!input || typeof input !== 'object') return {}
  const out: Partial<ProductTextFields> = {}
  for (const key of ['title','subtitle','description','badge','priceLabel','sectionTitle','sectionBody','recommendedTitle','requirementsTitle','actionLabel','secondaryLabel'] as const) {
    const v=cleanText(input[key]); if(v) (out as any)[key]=v
  }
  for (const key of ['features','recommendedFor','requirements'] as const) { const v=cleanStringArray(input[key]); if(v.length) (out as any)[key]=v }
  const details=cleanDetails(input.details); if(details.length) out.details=details
  return out
}
function normalizeProduct(input: ProductInput): ProductInput {
  const id=cleanText(input.id).toLowerCase(); if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Enter a valid product id using lowercase letters, numbers and hyphens.')
  if(!productCategories.includes(input.category)) throw new Error('Choose a valid product category.')
  const title=cleanText(input.title), subtitle=cleanText(input.subtitle), description=cleanText(input.description), images=cleanStringArray(input.images), actionLabel=cleanText(input.actionLabel)
  if(!title) throw new Error('Product title is required.'); if(!subtitle) throw new Error('Product subtitle is required.'); if(!description) throw new Error('Product description is required.'); if(!images.length) throw new Error('Add at least one product image.'); if(!actionLabel) throw new Error('Primary action label is required.')
  const translations: ProductTranslations = { fa: cleanTranslation(input.translations?.fa), ps: cleanTranslation(input.translations?.ps) }
  return { id, category:input.category, title, subtitle, description, images, features:cleanStringArray(input.features), badge:cleanText(input.badge), priceLabel:cleanText(input.priceLabel)||'Contact for Price', visible:input.visible!==false, sortOrder:Number.isFinite(Number(input.sortOrder))?Number(input.sortOrder):0, details:cleanDetails(input.details), sectionTitle:cleanText(input.sectionTitle)||'About this product', sectionBody:cleanText(input.sectionBody)||description, recommendedTitle:cleanText(input.recommendedTitle)||'Recommended for', recommendedFor:cleanStringArray(input.recommendedFor), requirementsTitle:cleanText(input.requirementsTitle)||'Information', requirements:cleanStringArray(input.requirements), actionLabel, secondaryLabel:cleanText(input.secondaryLabel), secondaryHref:cleanText(input.secondaryHref), translations }
}
async function readProducts(filePath:string):Promise<ProductRecord[]>{try{const parsed=JSON.parse(await readFile(filePath,'utf8'));if(!Array.isArray(parsed))return[];return parsed.map((item:any)=>({...normalizeProduct(item),createdAt:cleanText(item.createdAt)||new Date().toISOString(),updatedAt:cleanText(item.updatedAt)||new Date().toISOString()}))}catch(error:any){if(error?.code==='ENOENT')return[];throw error}}
async function writeProducts(filePath:string,products:ProductRecord[]){await mkdir(path.dirname(filePath),{recursive:true});const tmp=`${filePath}.tmp`;await writeFile(tmp,JSON.stringify(products,null,2)+'\n','utf8');await rename(tmp,filePath)}
export function createProductStore(filePath=defaultDataFile){return{async listProducts(options:{includeHidden?:boolean}={}){return(await readProducts(filePath)).filter(p=>options.includeHidden||p.visible).sort((a,b)=>a.sortOrder-b.sortOrder||a.title.localeCompare(b.title))},async getProduct(id:string,options:{includeHidden?:boolean}={}){const p=(await readProducts(filePath)).find(x=>x.id===id);return !p||(!options.includeHidden&&!p.visible)?null:p},async createProduct(input:ProductInput){const n=normalizeProduct(input),items=await readProducts(filePath);if(items.some(x=>x.id===n.id))throw new Error('A product with this id already exists.');const now=new Date().toISOString(),p:ProductRecord={...n,createdAt:now,updatedAt:now};items.push(p);await writeProducts(filePath,items);return p},async updateProduct(id:string,input:ProductInput){const items=await readProducts(filePath),i=items.findIndex(x=>x.id===id);if(i<0)return null;const n=normalizeProduct({...input,id});const p:ProductRecord={...items[i],...n,id,createdAt:items[i].createdAt,updatedAt:new Date().toISOString()};items[i]=p;await writeProducts(filePath,items);return p},async deleteProduct(id:string){const items=await readProducts(filePath),next=items.filter(x=>x.id!==id);if(next.length===items.length)return false;await writeProducts(filePath,next);return true}}}
const store=createProductStore();export const listProducts=store.listProducts;export const getProduct=store.getProduct;export const createProduct=store.createProduct;export const updateProduct=store.updateProduct;export const deleteProduct=store.deleteProduct
