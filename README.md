# Film

A shared stills library, starting with 40 moments from Pronto's copper mine film. Every shot has a landscape (16:9), portrait (4:5), and square (1:1) crop. The gallery shows one framing at a time; open a shot to preview another crop or download full-resolution JPGs, lossless PNGs, and uncropped 4K masters.

The interface reuses the Atoms writing tool's Inter typography, monochrome light/dark material, navigation composition, pill controls, native dialogs, and published OpenAI Apps SDK UI components. Search, category filters, curated/film-sequence sorting, grid/list views, and a browser-local shortlist make the collection easy to explore.

## Run

Node 20.19 or newer.

```sh
npm ci
npm run dev
npm run build
```

## Hosting

The application deploys to Vercel as a static Vite build. Original downloadable files are published under the GitHub release `pronto-copper-mine-v1`. The release is public so visitors can download without signing in. Compressed WebP previews live in `public/previews`; downloads retain the original exported resolution.

`src/catalog.json` maps shot IDs, crops, previews, and release downloads. `src/collection.json` describes the release and bundled downloads. Only application source and web previews are committed. The local film, original exports, and the complete archive are excluded from Git and Vercel deployment uploads.

## Prepare a collection

`scripts/prepare-assets.py` reads the local `Pronto_Designer_Stills_40` export directory, generates web previews and catalog data, and creates one JPG ZIP per aspect ratio. It requires Python with Pillow and the original local export folder. This preparation is done before deployment; Vercel builds do not require the original video or export directory.

Landscape downloads are 3840 × 2160, portrait downloads are 1728 × 2160, square downloads are 2160 × 2160, and full-frame masters are 4096 × 2160. The original handoff preserves source color through an explicit Rec.709-to-sRGB conversion. Crop exports are native resolution.

My selects and appearance are saved only in each visitor's browser. Direct shot links preserve the chosen shot and aspect ratio. No account, shared database, or paid storage service is required.
