import {imageResponse} from './image-response.js'
export {CHUNK_SIZE} from './image-response.js'

export default async function image(req,res){
 const response=await imageResponse(new Request(new URL(req.url,'https://film.local'),{method:req.method}))
 res.statusCode=response.status
 response.headers.forEach((value,name)=>res.setHeader(name,value))
 res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()))
}
