import {readFile,writeFile,readdir,mkdir,stat,copyFile} from 'node:fs/promises'
import {resolve,extname,basename,dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'
import sharp from 'sharp'
import {createThumbnails} from './thumbnail-assets.mjs'

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const args=process.argv.slice(2)
const option=name=>{const index=args.indexOf(name);return index<0||!args[index+1]||args[index+1].startsWith('--')?undefined:args[index+1]}
const brand=option('--brand'),source=option('--source')
const brands=['pronto','picnic','atoms','namma','kitchenpark','lab37']
if(!brands.includes(brand)||!source||(args.includes('--category')&&!option('--category'))){
 console.error('Usage: npm run assets:add -- --brand lab37 --source /path/to/images [--category "Studio photography"]')
 process.exit(1)
}
const sourcePath=resolve(source)
const input=await stat(sourcePath)
const files=input.isDirectory()?(await readdir(sourcePath)).sort().map(file=>resolve(sourcePath,file)):[sourcePath]
const manifestPath=resolve(root,'src/additional-assets.json')
const assets=JSON.parse(await readFile(manifestPath,'utf8'))
const planned=[]
for(const file of files){
 if(!['.jpg','.jpeg','.png'].includes(extname(file).toLowerCase())||!(await stat(file)).isFile())continue
 const data=await readFile(file)
 if(data.length>25*1024*1024)throw new Error(`${basename(file)} exceeds Cloudflare's 25 MiB asset limit. Keep the original intact and use an approved media host.`)
 const hash=createHash('sha256').update(data).digest('hex')
 if(assets.some(asset=>asset.brand===brand&&asset.sha256===hash)||planned.some(asset=>asset.hash===hash))continue
 const metadata=await sharp(data).metadata()
 if(!['jpeg','png'].includes(metadata.format)||!metadata.width||!metadata.height||metadata.pages>1)throw new Error(`${basename(file)} must be a single JPEG or PNG image.`)
 const rotated=[5,6,7,8].includes(metadata.orientation)
 const width=rotated?metadata.height:metadata.width,height=rotated?metadata.width:metadata.height
 const slug=basename(file,extname(file)).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'image'
 const extension=metadata.format==='jpeg'?'jpg':'png'
 const name=`${slug}-${hash.slice(0,12)}.${extension}`
 const previewName=`${slug}-${hash.slice(0,12)}.webp`
 const preview=await sharp(data).autoOrient().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer()
 const thumbnails=await createThumbnails(data,`/previews/${brand}/${previewName}`)
 planned.push({file,data,hash,width,height,name,previewName,preview,thumbnails,extension,slug})
}
if(!planned.length){console.log('No new JPEG or PNG images to import.');process.exit(0)}
await mkdir(resolve(root,`public/originals/${brand}`),{recursive:true})
await mkdir(resolve(root,`public/previews/${brand}`),{recursive:true})
let nextId=Math.max(999,...assets.map(asset=>asset.id))+1
for(const image of planned){
 const originalUrl=`/originals/${brand}/${image.name}`
 await copyFile(image.file,resolve(root,'public'+originalUrl))
 // Re-read the copied file, rather than trusting the source path not to change.
 const copied=await readFile(resolve(root,'public'+originalUrl))
 if(createHash('sha256').update(copied).digest('hex')!==image.hash)throw new Error(`Source changed during import: ${basename(image.file)}. Re-run the import.`)
 await writeFile(resolve(root,`public/previews/${brand}/${image.previewName}`),image.preview)
 for(const thumbnail of image.thumbnails)await writeFile(resolve(root,'public'+thumbnail.src),thumbnail.buffer)
 assets.push({id:nextId++,brand,title:basename(image.file,extname(image.file)).replace(/[_-]+/g,' ').trim(),category:args.includes('--category')?option('--category'):'Photography',use:'',originalName:basename(image.file),originalUrl,originalBytes:image.data.length,sha256:image.hash,variants:[{orientation:'Original',ratio:'Original',width:image.width,height:image.height,preview:`/previews/${brand}/${image.previewName}`,thumbnails:image.thumbnails.map(({src,width})=>({src,width})),jpg:image.extension==='jpg'?originalUrl:null,png:image.extension==='png'?originalUrl:null,jpgBytes:image.extension==='jpg'?image.data.length:0,pngBytes:image.extension==='png'?image.data.length:0}]})
 console.log(`Added ${basename(image.file)}: ${image.width} × ${image.height}, original bytes preserved.`)
}
await writeFile(manifestPath,JSON.stringify(assets,null,2)+'\n')
console.log(`Imported ${planned.length} images into ${brand}. Run npm run build and preview before publishing.`)
