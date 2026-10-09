import pronto from './catalog.json'
import lab37 from './lab37.json'
import additional from './additional-assets.json'
export type BrandId = 'pronto' | 'picnic' | 'atoms' | 'namma' | 'kitchenpark' | 'lab37'
export type Format = 'Landscape' | 'Portrait' | 'Square'
export type Variant = {
  orientation: Format | 'Original'; ratio: string; width: number; height: number; preview: string; thumbnails?: {src: string; width: number}[]
  jpg?: string | null; png?: string | null; jpgBytes: number; pngBytes: number
}
export type Shot = {
  id: number; brand: BrandId; title: string; use: string; category: string; seconds?: number
  master?: string; masterBytes?: number; originalName?: string; originalUrl?: string; originalBytes?: number
  variants: Variant[]
}
export const catalog: Shot[] = [...pronto.map(s => ({...s, brand: 'pronto' as const, variants:s.variants.map(v=>({...v,orientation:v.orientation as Variant['orientation']}))})), ...lab37.map(s => ({...s, brand: 'lab37' as const,variants:s.variants.map(v=>({...v,orientation:v.orientation as Variant['orientation']}))})), ...additional as Shot[]]
export const formats: Format[] = ['Landscape', 'Portrait', 'Square']
export const brands: {id: BrandId; name: string; title: string; description: string; cover?: string; logo: string; kind: string}[] = [
  {id:'pronto',logo:'/brands/pronto.svg',name:'Pronto',title:'Autonomy, at work.',description:'A considered edit from the field. Machinery, mineral landscapes, and the technology in between.',cover:pronto[0].variants[0].preview,kind:'Copper Mine / Film stills'},
  {id:'picnic',logo:'/brands/picnic.svg',name:'Picnic',title:'Picnic',description:'A place for Picnic’s photography, film, and brand assets.',kind:'Awaiting assets'},
  {id:'atoms',logo:'/brands/atoms.svg',cover:undefined,name:'Atoms',title:'Atoms',description:'A place for Atoms’ photography, film, and brand assets.',kind:'Awaiting assets'},
  {id:'namma',logo:'/brands/namma.svg',name:'Namma',title:'Namma',description:'A place for Namma’s photography, film, and brand assets.',kind:'Awaiting assets'},
  {id:'kitchenpark',logo:'/brands/kitchenpark.svg',name:'KitchenPark',title:'KitchenPark',description:'A place for KitchenPark’s photography, film, and brand assets.',kind:'Awaiting assets'},
  {id:'lab37',logo:'/brands/lab37.svg',name:'Lab37',title:'Built, piece by piece.',description:'The kitchen, the workshop, and the people building it. Original photography and product renders from the media kit.',cover:lab37[1].variants[0].preview,kind:'Media kit / Photography & renders'},
]
export const variant = (shot: Shot, format: Format): Variant => shot.variants.find(v => v.orientation === format) || shot.variants[0]
export const copyAsset = (shot: Shot, format: Format) => decodeURIComponent((variant(shot, format).png || variant(shot, format).jpg || '').split('/').pop() || '')

export const thumbnailProps = (v: Variant) => ({src: v.thumbnails?.find(t=>t.width>=640)?.src || v.thumbnails?.[0]?.src || v.preview, srcSet: v.thumbnails?.map(t=>`${t.src} ${t.width}w`).join(", ")})
