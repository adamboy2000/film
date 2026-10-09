import {fetchOriginalImage} from './image-source'

async function originalBlob(asset: string, originalUrl?: string): Promise<Blob> {
  const blob=await fetchOriginalImage(originalUrl||asset)
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
