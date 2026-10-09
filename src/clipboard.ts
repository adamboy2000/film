/** Fetch the original crop, keeping its pixels and resolution intact. */
async function originalBlob(asset: string, originalUrl?: string): Promise<Blob> {
  const load = async (part: number) => {
    const response = await fetch(`/api/image?asset=${encodeURIComponent(asset)}&part=${part}`)
    if (!response.ok) throw new Error('The original image could not be loaded. Try again.')
    return response
  }
  let blob: Blob
  if (originalUrl?.startsWith('/originals/') && !originalUrl.includes('..')) {
    const response = await fetch(originalUrl)
    if (!response.ok) throw new Error('The original image could not be loaded. Try again.')
    blob = await response.blob()
    if (!['image/png', 'image/jpeg'].includes(blob.type) || !blob.size) throw new Error('The original image is unavailable. Try downloading it.')
  } else {
    const first = await load(0)
    const size = Number(first.headers.get('X-Image-Size'))
    const chunkSize = Number(first.headers.get('X-Image-Chunk-Size'))
    if (!size || !chunkSize) throw new Error('The image service is unavailable. Try again.')
    const chunks = await Promise.all([
      first.arrayBuffer(),
      ...Array.from({length: Math.ceil(size / chunkSize) - 1}, (_, i) => load(i + 1).then(r => r.arrayBuffer())),
    ])
    blob = new Blob(chunks, {type: first.headers.get('Content-Type') || 'image/jpeg'})
    if (blob.size !== size) throw new Error('The image was incomplete. Try again.')
  }
  if (blob.type === 'image/png') return blob
  // Clipboard image support is PNG. Decode JPG at its native size, without resampling.
  const bitmap = await createImageBitmap(blob, {imageOrientation: 'from-image'})
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d')
  if (!context) { bitmap.close(); throw new Error('Image copying is unavailable in this browser.') }
  context.drawImage(bitmap, 0, 0)
  bitmap.close()
  return new Promise((resolve, reject) => canvas.toBlob(png => {
    canvas.width = 0; canvas.height = 0
    if (png) resolve(png)
    else reject(new Error('The image could not be copied. Try downloading it.'))
  }, 'image/png'))
}

export function copyOriginalImage(asset: string, originalUrl?: string): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return Promise.reject(new Error('Image copying needs a current browser. You can download the original instead.'))
  // Invoke write during the click gesture. Safari accepts the pending blob promise.
  return navigator.clipboard.write([new ClipboardItem({'image/png': originalBlob(asset, originalUrl)})])
}
