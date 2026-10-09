import type {Shot,Format} from './library'
import {variant} from './library'
import {fetchOriginalImage} from './image-source'
import {imageZip} from './zip'
export type DownloadOptions={format:'JPG'|'PNG'|'Original';framing:Format|'Original'|'Master';size:number}
export async function selectedImageZip(shots:Shot[],options:DownloadOptions,signal:AbortSignal,progress:(done:number)=>void){
 const files=[]
 for(const shot of shots){
  signal.throwIfAborted()
  const v=variant(shot,options.framing as Format)
  const source=options.framing==='Master'?shot.master:options.format==='JPG'?v.jpg||v.png:options.format==='PNG'?v.png||v.jpg:v.jpg||v.png
  if(!source)throw new Error(`The selected format is unavailable for ${shot.title}.`)
  let blob=await fetchOriginalImage(source,signal)
  const mime=options.format==='Original'?blob.type:options.format==='JPG'?'image/jpeg':'image/png'
  // Pronto has curated crops. Other brands retain native framing or use a centered crop.
  const crop=shot.brand!=='pronto'&&options.framing!=='Original'
  const resize=options.size>0&&(options.framing==='Master'||Math.max(v.width,v.height)>options.size)
  let suffix=''
  if(crop||resize||mime!==blob.type){
   const bitmap=await createImageBitmap(blob,{imageOrientation:'from-image'})
   try{
    let width=bitmap.width,height=bitmap.height
    if(crop){const ratio=options.framing==='Landscape'?16/9:options.framing==='Portrait'?4/5:1;if(width/height>ratio)width=height*ratio;else height=width/ratio}
    const scale=options.size?Math.min(1,options.size/Math.max(width,height)):1
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale))
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image export is unavailable in this browser.')
    ctx.imageSmoothingQuality='high';if(mime==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height)}
    ctx.drawImage(bitmap,(bitmap.width-width)/2,(bitmap.height-height)/2,width,height,0,0,canvas.width,canvas.height)
    suffix=`_${canvas.width}x${canvas.height}`
    blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('The image could not be exported.')),mime,0.92))
    canvas.width=0;canvas.height=0
   }finally{bitmap.close()}
  }
  signal.throwIfAborted()
  const title=shot.title.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()
  files.push({name:`${String(shot.id).padStart(3,'0')}_${title}_${options.framing.toLowerCase()}${suffix}.${mime==='image/jpeg'?'jpg':'png'}`,blob})
  progress(files.length)
 }
 signal.throwIfAborted()
 const archive=await imageZip(files)
 signal.throwIfAborted()
 return archive
}
