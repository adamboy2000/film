/** Load only a published original, including the chunked image API. */
export async function fetchOriginalImage(originalUrl: string, signal?: AbortSignal): Promise<Blob> {
 const load=async(part:number)=>{
  const asset=decodeURIComponent(originalUrl.split('/').pop()||'')
  const response=await fetch(`/api/image?asset=${encodeURIComponent(asset)}&part=${part}`,{signal})
  if(!response.ok)throw new Error('The original image could not be loaded. Try again.')
  return response
 }
 let blob:Blob
 if(originalUrl.startsWith('/originals/')&&!originalUrl.includes('..')){
  const response=await fetch(originalUrl,{signal})
  if(!response.ok)throw new Error('The original image could not be loaded. Try again.')
  blob=await response.blob()
 }else{
  const first=await load(0),size=Number(first.headers.get('X-Image-Size')),chunkSize=Number(first.headers.get('X-Image-Chunk-Size'))
  if(!size||!chunkSize)throw new Error('The image service is unavailable. Try again.')
  const chunks=await Promise.all([first.arrayBuffer(),...Array.from({length:Math.ceil(size/chunkSize)-1},(_,i)=>load(i+1).then(r=>r.arrayBuffer()))])
  blob=new Blob(chunks,{type:first.headers.get('Content-Type')||'image/jpeg'})
  if(blob.size!==size)throw new Error('The image was incomplete. Try again.')
 }
 if(!['image/png','image/jpeg'].includes(blob.type)||!blob.size)throw new Error('The original image is unavailable. Try again.')
 return blob
}
