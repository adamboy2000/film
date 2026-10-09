import assets from './asset-map.js'

// Deliver exact original bytes in chunks that also fit Vercel's response limit.
// Requests are limited to this collection's approved, published release assets.
export const CHUNK_SIZE=3*1024*1024

export async function imageResponse(request){
 const url=new URL(request.url)
 const name=url.searchParams.get('asset')
 const value=url.searchParams.get('part')||'0'
 const asset=Object.hasOwn(assets,name)?assets[name]:null
 const part=/^\d+$/.test(value)?Number(value):NaN
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}})
 if(!asset||!Number.isSafeInteger(part)||part<0||part*CHUNK_SIZE>=asset.size)return new Response('Image not found',{status:404})
 const start=part*CHUNK_SIZE,end=Math.min(start+CHUNK_SIZE,asset.size)-1
 try{
  const upstream=await fetch(asset.url,{headers:{Range:`bytes=${start}-${end}`},signal:AbortSignal.timeout(25000)})
  if(upstream.status!==206&&!(upstream.status===200&&asset.size<=CHUNK_SIZE))throw new Error('Original image unavailable')
  if(upstream.status===206&&upstream.headers.get('content-range')!==`bytes ${start}-${end}/${asset.size}`)throw new Error('Incorrect image range')
  const data=await upstream.arrayBuffer()
  if(data.byteLength!==end-start+1)throw new Error('Incomplete image')
  return new Response(request.method==='HEAD'?null:data,{headers:{
   'Content-Type':asset.type,'Content-Length':String(data.byteLength),
   'X-Image-Size':String(asset.size),'X-Image-Chunk-Size':String(CHUNK_SIZE),
   'X-Content-Type-Options':'nosniff',
   'Cache-Control':'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
  }})
 }catch{
  return new Response('The original image could not be loaded. Please try again.',{status:502,headers:{'Cache-Control':'no-store'}})
 }
}
