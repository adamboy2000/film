import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises'
import {resolve,dirname,basename} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createThumbnails} from './thumbnail-assets.mjs'

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const sources=new Map()
async function index(dir) {
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  const file=resolve(dir,entry.name)
  if(entry.isDirectory())await index(file)
  else if(/\.(jpg|jpeg|png)$/i.test(entry.name))sources.set(entry.name,file)
 }
}
await index(resolve(root,'Pronto_Designer_Stills_40/01_Selects_JPG'))
await index(resolve(root,'.work/lab37/originals'))
for(const manifest of ['catalog.json','lab37.json','additional-assets.json']) {
 const file=resolve(root,'src',manifest)
 const shots=JSON.parse(await readFile(file,'utf8'))
 for(const shot of shots)for(const variant of shot.variants) {
  const original=variant.jpg||variant.png
  const source=original.startsWith('/')?resolve(root,'public'+original):sources.get(decodeURIComponent(basename(original)))
  if(!source)throw new Error(`Original unavailable: ${original}`)
  const thumbnails=await createThumbnails(await readFile(source),variant.preview)
  for(const thumbnail of thumbnails){const dest=resolve(root,'public'+thumbnail.src);await mkdir(dirname(dest),{recursive:true});await writeFile(dest,thumbnail.buffer)}
  variant.thumbnails=thumbnails.map(({src,width})=>({src,width}))
 }
 await writeFile(file,JSON.stringify(shots,null,2)+'\n')
 console.log(`Prepared responsive thumbnails for ${shots.length} ${manifest} images.`)
}
