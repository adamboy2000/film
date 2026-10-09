import assets from './asset-map.js'

// Chunked delivery keeps native-resolution files below the function response limit.
// Only this collection's published release assets can be requested.
export const CHUNK_SIZE = 3 * 1024 * 1024
export default async function image(req, res) {
  const url = new URL(req.url, 'https://film.local')
  const name = url.searchParams.get('asset')
  const partValue = url.searchParams.get('part') || '0'
  const asset = Object.hasOwn(assets, name) ? assets[name] : null
  const part = /^\d+$/.test(partValue) ? Number(partValue) : NaN
  if (!['GET', 'HEAD'].includes(req.method)) { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end() }
  if (!asset || !Number.isSafeInteger(part) || part < 0 || part * CHUNK_SIZE >= asset.size) { res.statusCode = 404; return res.end('Image not found') }
  const start = part * CHUNK_SIZE
  const end = Math.min(start + CHUNK_SIZE, asset.size) - 1
  try {
    const upstream = await fetch(asset.url, { headers: { Range: `bytes=${start}-${end}` }, signal: AbortSignal.timeout(25000) })
    if (upstream.status !== 206 && !(upstream.status === 200 && asset.size <= CHUNK_SIZE)) throw new Error('Original image unavailable')
    if (upstream.status === 206 && upstream.headers.get('content-range') !== `bytes ${start}-${end}/${asset.size}`) throw new Error('Incorrect image range')
    const data = Buffer.from(await upstream.arrayBuffer())
    if (data.length !== end - start + 1) throw new Error('Incomplete image')
    res.setHeader('Content-Type', asset.type)
    res.setHeader('Content-Length', data.length)
    res.setHeader('X-Image-Size', asset.size)
    res.setHeader('X-Image-Chunk-Size', CHUNK_SIZE)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
    res.statusCode = 200
    res.end(req.method === 'HEAD' ? undefined : data)
  } catch {
    res.statusCode = 502
    res.setHeader('Cache-Control', 'no-store')
    res.end('The original image could not be loaded. Please try again.')
  }
}
