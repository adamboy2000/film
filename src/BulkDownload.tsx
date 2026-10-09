import {useEffect,useRef,useState} from 'react'
import {Button} from '@openai/apps-sdk-ui/components/Button'
import {Download,X} from './icons'
import type {Format,Shot} from './library'
import {thumbnailProps,variant} from './library'
import {selectedImageZip} from './bulk-download'
import type {DownloadOptions} from './bulk-download'

export function BulkDownload({shots,brandName,initialFormat,remove}:{shots:Shot[];brandName:string;initialFormat:Format;remove:(id:number)=>void}){
 const pronto=shots[0]?.brand==='pronto'
 const [fileFormat,setFileFormat]=useState<DownloadOptions['format']>(pronto?'JPG':'Original')
 const [framing,setFraming]=useState<DownloadOptions['framing']>(pronto?initialFormat:'Original')
 const [size,setSize]=useState(0),[busy,setBusy]=useState(false),[done,setDone]=useState(0),[error,setError]=useState(''),[archive,setArchive]=useState<Blob|null>(null)
 const controller=useRef<AbortController|null>(null)
 useEffect(()=>()=>controller.current?.abort(),[])
 useEffect(()=>{setArchive(null);setError('')},[fileFormat,framing,size,shots.map(s=>s.id).join(',')])
 async function prepare(){
  const abort=new AbortController();controller.current=abort;setBusy(true);setDone(0);setError('')
  try{const zip=await selectedImageZip(shots,{format:fileFormat,framing,size},abort.signal,setDone);if(!abort.signal.aborted)setArchive(zip)}
  catch(e){if(!abort.signal.aborted)setError(e instanceof Error?e.message:'The download could not be prepared. Try again.')}
  finally{if(!abort.signal.aborted)setBusy(false)}
 }
 function download(){if(!archive)return;const url=URL.createObjectURL(archive),link=document.createElement('a');link.href=url;link.download=`${brandName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}_${shots.length}-images.zip`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}
 return <div className="download-body bulk-body">
  <p className="bulk-summary">{shots.length} {shots.length===1?'image':'images'} from {brandName}</p>
  <div className="bulk-review" aria-label="Selected images">{shots.map(shot=><div className="bulk-review-item" key={shot.id}><img {...thumbnailProps(variant(shot,framing as Format))} sizes="48px" width="48" height="36" alt="" decoding="async"/><span>{shot.title}</span><button className="icon-button" aria-label={`Remove ${shot.title} from download`} disabled={busy} onClick={()=>remove(shot.id)}><X size={15}/></button></div>)}</div>
  <fieldset disabled={busy} className="bulk-settings"><label>File format<select aria-label="Download file format" value={fileFormat} onChange={e=>setFileFormat(e.target.value as DownloadOptions['format'])}>{!pronto&&<option value="Original">Original file format</option>}<option value="JPG">JPG</option><option value="PNG">PNG</option></select></label><label>Aspect ratio<select aria-label="Download aspect ratio" value={framing} onChange={e=>setFraming(e.target.value as DownloadOptions['framing'])}>{!pronto&&<option value="Original">Original framing</option>}<option value="Landscape">Landscape · 16:9</option><option value="Portrait">Portrait · 4:5</option><option value="Square">Square · 1:1</option>{pronto&&<option value="Master">Uncropped 4K master</option>}</select></label><label>Image size<select aria-label="Download image size" value={size} onChange={e=>setSize(Number(e.target.value))}><option value="0">Original resolution</option><option value="2048">Up to 2,048 px · long edge</option><option value="1280">Up to 1,280 px · long edge</option></select></label></fieldset>
  <p className="download-note">{!pronto&&framing!=='Original'?'Images use a centered crop. ':''}{size?'Smaller images keep their native size.':'Original resolution preserves the available image size.'} {fileFormat==='Original'||pronto&&framing!=='Master'&&!size?'Existing files retain their original encoding.':'Format conversions are exported at high quality.'} Your images download together as one ZIP.</p>
  {error&&<p role="alert" className="bulk-error">{error}</p>}
  <div role="status" aria-live="polite" className="bulk-progress">{busy?`Preparing ${done} of ${shots.length} images…`:archive?`Ready · ${(archive.size/1e6).toFixed(1)} MB`:''}</div>
  {busy?<Button color="secondary" variant="soft" block onClick={()=>{controller.current?.abort();setBusy(false);setDone(0)}}>Cancel preparation</Button>:archive?<Button color="primary" size="lg" block onClick={download}><Download size={16}/>Download ZIP · {(archive.size/1e6).toFixed(1)} MB</Button>:<Button color="primary" size="lg" block disabled={!shots.length} onClick={prepare}><Download size={16}/>Prepare download</Button>}
 </div>
}
