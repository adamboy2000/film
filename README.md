# Film

A shared visual library for Pronto, Picnic, Atoms, Namma, KitchenPark, and Lab37. Pronto includes 40 curated film stills in landscape (16:9), portrait (4:5), and square (1:1). Lab37 includes 25 original photographs and product renders from the supplied media kit. The other brand collections are ready for their first assets.

The gallery shows one image per card. Open an image to view it larger, copy its full-resolution pixels into Figma, or download the original files. Search, category filters, sorting, grid/list views, and a browser-local shortlist make collections easy to explore. The interface uses the Atoms writing tool’s typography, light/dark material, navigation composition, pill controls, dialogs, and published OpenAI Apps SDK UI components.

[Open Film](https://film.city-storage-systems.workers.dev/)

## Run

Node 20.19 or newer.

```sh
npm ci
npm run dev
npm run build
```

Vite includes a local image API middleware for testing clipboard copying. Both this endpoint and the deployed Vercel function fetch only the published files in `api/asset-map.js`.

## Hosting and image quality

Vercel serves the application and compressed WebP browsing previews. Full-resolution files live in public GitHub Releases: `pronto-copper-mine-v1` and `lab37-media-kit-v1`. Visitors can download without signing in.

The clipboard endpoint delivers an original image in 3 MiB chunks, below Vercel’s function response limit. The browser joins the original bytes. Pronto copies use the lossless PNG crop directly. Lab37 JPGs are decoded at native dimensions and encoded as PNG because the image clipboard uses PNG; no resizing is applied. The clipboard write starts inside the click gesture, including when the image is still loading.

Landscape Pronto downloads are 3840 × 2160, portrait downloads are 1728 × 2160, square downloads are 2160 × 2160, and full-frame masters are 4096 × 2160. The local handoff preserves source color with an explicit Rec.709-to-sRGB conversion. Lab37 downloads retain the supplied original filenames and bytes; photography filenames credit Josh Cherner. The supplied 68 × 15 “Hopper A” text label is excluded.

Application source, release metadata, web previews and newly imported approved originals are committed. Original local exports, archives, and video files are excluded from Git and Vercel uploads. My selects and explicit appearance preferences stay in each visitor’s browser. Dark mode is the default. Direct image links preserve brand, shot, and framing.

## Prepare collections

`scripts/prepare-assets.py` reads the local `Pronto_Designer_Stills_40` export directory and prepares Pronto previews, catalog data, and JPG bundles. `scripts/prepare-lab37.py` reads `.work/lab37/originals` and prepares Lab37 previews, metadata, and an original-file archive. Both require Python with Pillow.

Run `scripts/prepare-asset-map.py` after preparing the collections to refresh the clipboard endpoint’s allowlist. Vercel builds use the prepared files and do not need the source film or original media folders.


The workspace menu shows the current SSO user name when supplied by the hosting platform. Anonymous visitors have no profile row; the public Vercel host has no company SSO. Identity is not saved in browser storage. GitHub pushes to `main` deploy automatically through the connected Vercel project.


## Add approved images

```sh
npm run assets:add -- --brand lab37 --source /absolute/path/to/images --category "Studio photography"
```

JPEG/PNG originals retain their exact bytes. WebP previews preserve display orientation and are never enlarged. The importer skips duplicates and updates `src/additional-assets.json`. Supported brands: pronto, picnic, atoms, namma, kitchenpark and lab37. Existing release ZIPs are the original source collections; imports add individual original downloads. Each static original must fit the company platform's 25 MiB asset limit.

The company-hosted Film app is the primary site. Brand artwork sources are documented in [BRAND_ASSETS.md](docs/BRAND_ASSETS.md).

Gallery and brand-card images use responsive 320/640/960px WebP thumbnails; viewer previews and native download/clipboard sources stay separate. `assets:add` generates these automatically. After rebuilding the bundled Pronto or Lab37 catalogs, run `npm run assets:thumbnails` with the native source folders available to regenerate their thumbnail metadata.

Use Select images in a brand gallery to choose images across filters, then Download selected. The review dialog offers file format, framing, and original/2,048px/1,280px resolution; smaller originals are never enlarged. Lab37 framing changes use a centered crop. Prepare the ZIP, then download it with the displayed file size. Closing the dialog or cancelling preparation aborts outstanding image requests.
