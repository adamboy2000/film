// Store already-compressed image files in a standard ZIP, without dependencies.
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0})
export async function imageZip(files:{name:string;blob:Blob}[]):Promise<Blob>{
 const body:BlobPart[]=[],directory:BlobPart[]=[]
 let offset=0,dirSize=0
 for(const file of files){
  const name=new TextEncoder().encode(file.name),data=new Uint8Array(await file.blob.arrayBuffer())
  let crc=0xffffffff;for(const byte of data)crc=table[(crc^byte)&255]^(crc>>>8);crc=(crc^0xffffffff)>>>0
  const local=new Uint8Array(30),l=new DataView(local.buffer)
  l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(12,33,true)
  l.setUint32(14,crc,true);l.setUint32(18,data.length,true);l.setUint32(22,data.length,true);l.setUint16(26,name.length,true)
  body.push(local,name,file.blob)
  const central=new Uint8Array(46),c=new DataView(central.buffer)
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,33,true)
  c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true)
  directory.push(central,name);dirSize+=central.length+name.length;offset+=local.length+name.length+data.length
 }
 const end=new Uint8Array(22),e=new DataView(end.buffer)
 e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,dirSize,true);e.setUint32(16,offset,true)
 return new Blob([...body,...directory,end],{type:'application/zip'})
}
