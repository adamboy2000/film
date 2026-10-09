import sharp from 'sharp'

// Browser previews only. Originals and viewer previews remain untouched.
export async function createThumbnails(data, previewUrl) {
 const thumbnails=[]
 let lastWidth=0
 for(const width of [320,640,960]) {
  const {data:buffer,info}=await sharp(data).autoOrient().resize({width,withoutEnlargement:true}).webp({quality:76,effort:4}).toBuffer({resolveWithObject:true})
  if(info.width===lastWidth)continue
  lastWidth=info.width
  thumbnails.push({src:previewUrl.replace(/\.webp$/,`-${info.width}w.webp`),width:info.width,buffer})
 }
 return thumbnails
}
