# Illustrations: research, rights and attribution

## Current status

All **200 narratives** now have a selected illustration, using **182 unique local raster files**. The current research log records an included, attributed Commons source for every story. The images were checked in a browser contact sheet; the final editorial replacements were reviewed separately. Every raster decoded successfully.

The collection includes manuscript pages, historical artworks, maps, archival photographs, contemporary site photographs and clearly described context portraits. It does not claim that every illustration was created in the year of the narrative. Examples include a medieval copy of the Kojiki, a contemporary museum reconstruction of a Heian meal, a later print depicting nō, and a portrait of Miyazaki instead of a protected film still.

The original CSS landscape remains only as an explicitly evocative fallback for future stories without a selected image. Synthetic fixtures used by tests are not published as historical illustrations.

## Reproduce the research

From the repository root, after applying the network settings:

```sh
npm run images:research
npm test
npm run build
TABI_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```

Image-research destinations: `en.wikipedia.org`, `commons.wikimedia.org`, `upload.wikimedia.org` (and the publisher’s newer thumbnail host `thumb.wikimedia.org`). Optional museum research destinations prepared in the environment: `collectionapi.metmuseum.org`, `images.metmuseum.org`. Runtime visitors do not need API access: selected raster images will be served locally and embedded in `Tabi.html`.

The researcher batches Wikipedia queries for the freely licensed lead images of each narrative's topical article. Each candidate must then have a Commons file record. It is not enough for an image to appear on Wikipedia, in search results or on a museum website. Non-free/fair-use images and unknown licences are not imported. If the article has no suitable lead image, Commons search candidates are recorded for relevance review; they are not silently attached to a fact. Reviewed editorial selections and French contextual captions are recorded in `scripts/image-selections.json`. The publisher’s canonical upload.wikimedia.org thumbnail path is supported alongside its newer thumbnail host.

## Supported rights

- Public domain, explicitly identified as such by the Commons record with `Copyrighted=False`. Display the Commons qualification and link to the file's actual rights statement; this is not an independent legal ruling for every jurisdiction.
- CC0 1.0.
- CC BY and CC BY-SA, versions 1.0, 2.0, 2.5, 3.0 or 4.0, where the recorded Creative Commons URL matches the claimed licence. Preserve a country-ported licence URL rather than replacing it with another licence.
- CC BY-NC, CC BY-ND, fair use, unknown rights and GFDL-only candidates are excluded by this importer. Their exclusion is a project reuse choice, not a claim that all such uses would be unlawful.

For a selected image, the manifest records its title, creator/photographer as supplied, file page, licence and URL, supplementary credit, copyright notice and usage terms where provided, document date, time of metadata retrieval, source file timestamp and SHA-1, and the downloaded thumbnail's SHA-256. Original author/credit strings are reduced to plain text and escaped in the interface; source HTML is never executed.

A discreet “i” control opens an overlay containing author, licence and source in both the main figure and catalogue thumbnail. It also opens on hovering the main image (or the catalogue “i” control) or on keyboard focus, supports touch, and closes with Escape, the close control or an outside click. The overlay reserves no space beneath the image. Additional notices and document context appear under “Contexte et réutilisation”. A later photograph of a place, or an artwork depicting an earlier event, is identified as a reference document and not a reconstruction of the slider's exact date. The image is displayed without cropping; the Commons-generated thumbnail and responsive display adaptation are stated.

CC BY-SA applies to the licensed image and any adaptations covered by that licence; including such an image does not by itself relicense the application source. Follow the linked licence and any source-specific notices when reusing an image.

## Files and audit

`src/image-manifest.js` contains the 200 selected images with source-rights metadata. `public/images/CREDITS.md` lists attribution and licence links for each unique local file. Downloaded rasters go in `public/images/`. `public/data/image-research.json` records each story's status, rejected/missing candidates, search failures, and inclusion metadata. Existing verified images are preserved if a later network request fails. Selected assets are reused without redownloading unchanged image files. The researcher uses the supported HTTPS proxy, spaces thumbnail requests, and backs off once on HTTP 429.

Before each publication, review contextual suitability and any remaining `candidate-needs-relevance-review` records. The current 200 records are all included. A portrait may illustrate its subject without showing the precise event described. Do not mark a record included merely to improve the coverage count. The offline build checks local image checksums and embeds the accepted assets. It fails rather than exceeding the 90 MiB standalone publication limit.

The 55 pre-710 narratives were reviewed in three browser contact sheets. Their captions distinguish museum copies, reconstructions, modern site photographs, later depictions and context-only documents. Archaeological dates and regional period boundaries are approximate.
