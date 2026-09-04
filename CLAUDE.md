# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive web app for exploring the JCVI-syn3A minimal-cell genome through David Goodsell's watercolor cutaway illustration of the cell. Hovering/clicking a molecule shape in the illustration reveals what gene(s) encode it and highlights the corresponding region(s) on a genome track at the bottom; the same linkage works in reverse from the genome track back to the illustration.

Vanilla HTML/CSS/JS, no build step, no dependencies, no test suite.

See [DECISIONS.md](DECISIONS.md) for *why* things are built the way they are (rejected alternatives, rationale) — this file covers current architecture only. See [CUTOUT-ASSIST.md](CUTOUT-ASSIST.md) for techniques for helping locate/clean up `cutouts/` files.

## Running it

There is no build/lint/test tooling. To view the app, serve the directory over HTTP and open it in a browser:

```
python3 -m http.server 8420
```

then visit `http://localhost:8420`. **Must be served over `http://`, not opened as a `file://` URL** — hit-testing reads pixel data via `canvas.getImageData`, which some browsers taint under `file://`.

A matching launch config already exists at `.claude/launch.json` (name `syn3a-static-server`, port 8420) for tools that read it.

## Architecture

### Files
- `index.html` — page structure only
- `styles.css` — all styling
- `app.js` — single IIFE, all logic (state, rendering, event handling)
- `data/products.js` — plain scripts (not ES modules) defining `GENOME_LENGTH_BP` and the `PRODUCTS` array; loaded via `<script>` tag before `app.js`
- `data/swatch-colors.js` — generated, not hand-edited (see "Product data" below): `SWATCH_COLORS`, each defined product's average cutout color keyed by id
- `assets/` — the base illustration (`syn3A-grey.webp`, always shown; `syn3A-grey.png` kept as the master), the full-color original (`syn3A.png`/`.webp`, not used at runtime), `color-composite.png` (see below), and `id-map.png` (see below)
- `cutouts/3A-0XXX.png` — one transparent-background cutout PNG per depicted product, named after its locus number
- `relevant files/` — source material used when adding new products (see "Adding a new product" below)

### The illustration is four stacked layers, bottom to top

```html
<img id="baseImg">        <!-- always-grey base, always visible -->
<img id="colorImg">        <!-- precomputed composite of every defined product's cutout -->
<canvas id="dimCanvas">     <!-- dark wash with a hole punched over the active product -->
<canvas id="selectionCanvas"> <!-- selected product's cutout + CSS glow outline -->
```

All currently-defined products show in their real color by default via `#colorImg` (`assets/color-composite.png`, precomputed offline — see "Derived assets" below); the grey background shows through only where no cutout exists. Hovering/selecting a product doesn't reveal color (it's already visible) — it spotlights: `updateDimOverlay()` fills `dimCanvas` with a translucent dark wash, then uses `globalCompositeOperation = "destination-out"` with the active product's own cutout (and, if it has any, each of its `relatedProductIds`' cutouts too — see "Product data" below) to erase holes exactly over their silhouettes, dimming everything else. `selectionCanvas` sits above the dim overlay so a persisted selection stays undimmed even while hovering something else elsewhere.

A cutout (needed only for the two effects above) isn't loaded until its product is first hovered or selected, whether directly or via another product's `relatedProductIds` (`ensureCutoutLoaded()`) — not eagerly at init — since most of the 40+ cutouts are never touched in a given visit. `updateDimOverlay()`/`redrawSelectionLayer()` already no-op safely if an image hasn't arrived yet, so `ensureCutoutLoaded()` just kicks off the load and re-applies the effect once it resolves, if the product in question is still part of the active set (`getActiveIds()`).

### Derived assets: `tools/build-assets.py`

Three files are generated from the cutouts by one script, `python3 tools/build-assets.py` (requires `pip install pillow numpy`, plus a `node` binary on `PATH`), rather than computed live in-browser:

- **`assets/id-map.png`** — hit-testing. A reference PNG, same 5612×3748 dimensions as the illustration, encoding which product owns each pixel: product at 1-based array index `N` in `PRODUCTS` is filled with `rgb(N & 0xff, N >> 8, 0)` (product 1 = `#010000`, product 2 = `#020000`, ...; R is the low byte, G is the overflow byte past 255); everywhere else is transparent (alpha 0 = no product). `app.js` loads this into an offscreen canvas at init (`loadIdMap()`) and does a single `getImageData(x, y, 1, 1)` read per mousemove (`getProductAtPixel`) — O(1) regardless of product count. **This file is then hand-edited as needed — it is not regenerated at runtime.**
- **`assets/color-composite.png`** — every cutout alpha-composited together in `PRODUCTS` order (later on top), the static image `#colorImg` displays. Previously this was rebuilt on every page load by drawing all 40+ full-res cutouts onto a `<canvas>` (`buildColorLayer()`, ~1.3s); now it's one precomputed file the browser loads like any other `<img>`. Saved as plain PNG rather than WebP for now — interim, while the product set is still actively growing, to avoid lossy re-compression drift across incremental builds (see below); a one-time WebP optimization pass is planned once the set is finished.
- **`data/swatch-colors.js`** — each product's alpha-weighted average cutout color, keyed by id (`SWATCH_COLORS["0001"]`), used for genome-track segment fill and the detail panel's accent color. Previously computed at runtime (`computeSwatchColors()`) by drawing each cutout onto a full 5612×3748 canvas and reading the pixel data back — by far the single biggest cost in `init()` (~5.8s across 40+ products, dwarfing image decode itself, because `getImageData` over a 21-megapixel canvas is expensive however you slice it). Now a synchronous object lookup.

The script reads product order and cutout paths directly out of `data/products.js` — by actually evaluating it as JavaScript via `tools/parse-products.js` (the same Node `vm` parser `validate-products.py` uses), not by regex-scanning it — so it never needs its own separate list kept in sync, and the field layout inside each product object isn't load-bearing. This used to be a regex scan; it was replaced (2026-08-11) because `id-map.png` encodes each product's *1-based index in the evaluated `PRODUCTS` array* and `app.js` decodes it back against that same array, so anything less than real evaluation risks the two silently disagreeing — see [DECISIONS.md](DECISIONS.md).

A product whose `cutout` is `null` isn't drawn in the illustration at all (the source paper marks these "not shown" — see "Product data" below). It still occupies its slot in `PRODUCTS`, but paints nothing into `id-map.png` or `color-composite.png` and is absent from `swatch-colors.js`, where `app.js` falls back to grey for the missing key.

**Incremental builds (2026-08-07):** with 250+ products, a full rebuild costs ~95s (every product's cutout gets decoded and alpha-composited/averaged across the full 21-megapixel canvas, regardless of how small its own footprint is). A local, gitignored cache at `.build-cache/manifest.json` records the exact product list (id/cutout path/content hash/swatch color) the outputs were last built from. When the current `products.js` is that same list plus new entries appended at the end — the normal "add N products" workflow, matching the append-only convention below — the script only processes the new entries, loading the existing `id-map.png`/`color-composite.png` as the base instead of starting from a blank canvas. Any edit to an existing cutout, reorder, or removal doesn't match the cached prefix and silently falls back to a full rebuild (slower but always correct); the cache has no bearing on correctness, only speed — deleting `.build-cache/` (or a fresh clone, which never has it) just costs one full rebuild.

**Critical gotcha:** `PRODUCTS` array order and `id-map.png`'s encoding must stay in lockstep. Reordering/inserting into the array without regenerating these assets will make hover/click resolve to the wrong product and the composite/swatches go stale. This is also why `cutout: null` entries must never be deleted or skipped over even though they paint nothing — they deliberately consume an array index, and removing one shifts every product after it. When two cutouts legitimately overlap (e.g. a subunit that also appears as a free-floating copy elsewhere), whichever product is later in the array wins the overlapping pixels (both for id-map ownership and composite z-order) — put the more specific product later if that matters.

### Data validation: `tools/validate-products.py`

Sanity-checks `data/products.js` independent of the derived-asset generation above: every `cutout` path exists, opens, is exactly 5612×3748, and isn't blank; no duplicate `id` or `cutout` values; every locus's `start`/`end` fall within `[1, GENOME_LENGTH_BP]` with `start < end`; `strand` is `+`, `-`, or `null`. A locus tag appearing under two different products is reported as a warning, not an error — that's the legitimate free-floating-copy case above, not necessarily a mistake.

This reads `data/products.js` the same way `build-assets.py` does — `tools/parse-products.js` runs it in a Node `vm` context and prints `PRODUCTS`/`GENOME_LENGTH_BP` as JSON, which both tools shell out to and consume, so they can't disagree about what the file contains. (Requires a `node` binary on `PATH`, alongside `pillow`/`numpy`.) Run it after every edit to `products.js`, alongside `build-assets.py`.

A `cutout` of `null` is accepted deliberately (it means "not shown in the illustration") and skips the file-existence, dimension, blank-image and duplicate-path checks — 15 nulls aren't 15 collisions. A cutout that's an empty/whitespace string is still an error, and tells you to write `null` instead.

### State model

Two variables drive everything: `hoveredProductId`, `selectedProductId`. `getActiveIds()` is the shared "what's currently active" helper (hover takes priority, falls back to selection) — it returns `[activeId, ...relatedIds]`, expanding to a product's `relatedProductIds` if it has any (see "Product data" below). `updateDimOverlay()`, `updateTrackEmphasis()` (genome track), and `ensureCutoutLoaded()`'s post-load check all consume this same set, so the membrane's related enzymes light up consistently everywhere; `updateDetailPanel()` (via `getActiveProduct()`) still only ever describes the one directly-active product, with its related products listed separately (see "Detail panel" below). The illustration and the genome track's SVG both call the exact same `setHovered()`/`selectProduct()`/`deselectProduct()` mutators (the genome track's listeners are delegated on the `<svg>` root via `event.target.closest('.track-segment')`), which is what makes hover/click bidirectional between the two.

### Genome track

`<svg viewBox="0 0 2000 60">`, one `<rect class="track-segment" data-product-id="...">` per locus that has known `start`/`end` (loci with `null` coordinates just don't get a segment — nothing else breaks). Position via `bpToX(bp) = bp / GENOME_LENGTH_BP * 2000`, with a minimum width so tiny genes stay clickable. Multi-locus products (e.g. the DNA polymerase assembly) get one rect per locus, all sharing `data-product-id`, so they highlight together automatically.

### Detail panel

Height is JS-synced to the illustration's rendered height via a `ResizeObserver` (`syncPanelHeight`), not CSS — a plain `align-items: stretch` was tried and rejected because it let the panel's content override the illustration's `aspect-ratio` sizing. Long content (e.g. a 20-locus table) scrolls internally (`overflow-y: auto`) rather than growing the box. The panel is always present in the layout (never `display: none`) with an `.is-empty` state showing a placeholder, specifically so the illustration never resizes when the panel's content changes.

The Loci table is hidden entirely (not just empty) for products with no loci of their own, like the membrane. A separate "Built by" list shows a product's `relatedProductIds` (if any) as clickable entries — clicking one calls `selectProduct()` directly, jumping straight to that product without needing to find it in the illustration or track first.

`updateDetailPanel()` resolves three states: (1) nothing active → the `.is-empty` placeholder **plus the Narratives picker** (see below); (2) a product hovered/selected → that product's details; (3) a narrative active → that narrative's details via `renderNarrativePanel()`. The Loci-table and links rendering is shared between the product and narrative paths (`fillLociTable()` / `fillLinks()`).

### Narratives (`NARRATIVES` in `data/products.js`)

Narratives are Goodsell's Figure-2 "story" scenes — a depicted *process* (e.g. transcription of an rRNA operon), not a single gene product. They live in a separate `NARRATIVES` array, **deliberately not in `PRODUCTS`**, because a narrative must stay invisible in the base illustration, must never become a hover target, and so must be absent from `assets/id-map.png` and `assets/color-composite.png` (both built only from `PRODUCTS`). This also means `tools/build-assets.py` never touches a narrative and there's no id-map index to keep in sync — adding one regenerates nothing. Each narrative's cutout lives under **`narratives/`** (not `cutouts/`, and no `3A-0XXX` name) and is still the same 5612×3748 canvas so it aligns pixel-for-pixel when drawn.

Interaction: a narrative is a separate, mutually-exclusive mode from product hover/selection, held in `activeNarrativeId`. The picker sits in the detail panel's empty state (`#detail-narratives`, built from `NARRATIVES` by `buildNarratives()`); clicking a link calls `toggleNarrative()`. Activating one clears any product selection; selecting any product clears the narrative. In the **scene** view (below) hover is suppressed (`setHovered`/`onStageMove`/`onTrackMove` early-return). Rendering reuses the existing canvas layers: `updateDimOverlay()` washes the whole illustration dark with **no hole punched** (a narrative isn't in the color composite, so there's nothing to reveal underneath), and `redrawSelectionLayer()` paints the narrative's own cutout bright on `selectionCanvas` above the wash — a spotlight built by addition rather than by erasing. On the genome track, `buildGenomeTrack()` appends one `<rect class="track-segment narrative-segment" data-narrative-id>` per narrative locus (magenta `#c0398f`, matching the rRNA), `pointer-events:none` and hidden until `updateTrackEmphasis()` shows them for the active narrative's scene view. Exit via the panel close (×), `Esc`, clicking empty illustration/track space, or selecting any molecule (all routed through `closeActive()`).

**Two views (`narrativeView`, `"scene"` | `"components"`):** a narrative may also declare `relatedProductIds` — the real `PRODUCTS` that make up the scene (for Transcription: RNA Polymerase + the rRNA modification/maturation factors). A "See components" link in the panel switches to the **components** view: the traced cutout is dropped and those component products are spotlighted *in place* in the real illustration, their loci highlight on the track, and the panel lists them clickably, with "← Back to scene" to return. This needs almost no new rendering — in components view `getActiveIds()` returns the narrative's `relatedProductIds`, so `updateDimOverlay()`/`updateTrackEmphasis()` light them up via the exact same path the membrane uses (holes over their cutouts revealing `#colorImg`). The scene-only branches/guards therefore all test `activeNarrativeId && narrativeView === "scene"`; components view falls through to the normal product paths, keeping the illustration fully hoverable/clickable. Clicking any component (list entry or the lit molecule) `selectProduct()`s it, exiting the narrative.

**To add a narrative:** drop its cutout in `narratives/`, append an entry to `NARRATIVES` (`id`, `title`, `cutout`, `description`, `loci` for the track highlight, `links`, and optionally `relatedProductIds` to enable the components view), done — no asset rebuild, no `PRODUCTS` changes. `tools/validate-products.py` does not yet cover `NARRATIVES`.

### Product data (`data/products.js`)

Each entry: `id` (4-digit locus string), `displayName`, `fullName`, `cutout` (path), `loci` (array of `{locusTag, gene, start, end, strand}` — `gene`/coordinates may be `null` if not yet known), `description`, `links`. `swatchColor` is *not* stored in this file — `app.js` assigns it at init from the generated `data/swatch-colors.js` (see "Derived assets" above), so it always matches the artwork without manual color-picking, without needing to be recomputed by every visitor's browser.

**Non-gene structural entries** (currently just the membrane) break the usual shape: `id` is a descriptive string instead of a locus number (`"membrane"`, not `"0XXX"` — nothing else keys off the id's format), `cutout` doesn't follow the `3A-0XXX.png` naming convention either, and `loci` is `[]` since the entry isn't encoded by any single gene — it gets no genome-track segment of its own. Instead it sets **`relatedProductIds`** (optional on any product, currently only used by the membrane): an array of other products' `id`s that should highlight alongside it — both in the illustration (their own cutouts spotlighted together, see "four stacked layers" above) and on the genome track (their loci highlighted together, see "State model" above) — whenever *this* product is the active one. It's one-directional: those related products don't reference the membrane back, so hovering e.g. PlsY by itself still only highlights PlsY. `tools/validate-products.py` checks that every id inside a `relatedProductIds` array actually matches a real product.

**Products the illustration doesn't show** set `cutout: null`. The source paper's Table 1 lists 15 genes it never depicts — fourteen grouped into a single "Uncharacterized protein, not shown" row, plus `0299`, found absent after searching the artwork — so there is no shape to cut out and never will be. They're ordinary entries otherwise: real `loci`, so they still get genome-track segments, and their `description` carries the "Not shown in the illustration" note that explains why clicking one does nothing to the artwork. They render in the `#999999` fallback grey, since `swatch-colors.js` has no entry for them. Two consequences worth knowing before touching them: they deliberately occupy a `PRODUCTS` index (see "Critical gotcha" above), and `app.js`'s `updateDimOverlay()` filters them out of the spotlight set on purpose — without that filter, hovering one washes the whole illustration dark and punches no hole, which looks like a rendering bug.

## Adding a new product

This is the most common task in this repo. Workflow, in order:

1. **Identify the locus number.** `relevant files/syn3A-labled-samesize.png` is a labeled version of the illustration, pixel-identical in dimensions (5612×3748) to the working illustration files — a label's position there maps 1:1 to working-image coordinates, no calibration needed. (`relevant files/labled-syn3A.png` is an older labeled reference with a *different* crop/aspect ratio — pixel coordinates don't map 1:1 without a calibration fit, prefer the samesize file instead.) Every visible cluster has its locus number printed next to it (last 3 digits of the locus tag; for multi-locus assemblies, the number is the *lowest* locus tag in the group, per the source paper's own convention). See [CUTOUT-ASSIST.md](CUTOUT-ASSIST.md) for how to locate a label's exact pixel position and hand Fabian a precisely-cropped region to trace from.
2. **Get a cutout.** Same 5612×3748 canvas, transparent background, pixel-aligned with the other cutouts, containing only that product's colored shape(s). Save as `cutouts/3A-0XXX.png` (locus number, zero-padded to 3 digits — note this is one fewer digit than the `JCVISYN3A_0XXXX` locus tag / the `id` field in `products.js`). [CUTOUT-ASSIST.md](CUTOUT-ASSIST.md) also covers cleaning up a rough hand-traced draft into a finished cutout.
3. **Look up its data.** `relevant files/goodsell-products-reference.json` has all 328 products from the source paper's Table 1, each pre-merged with real GenBank coordinates — look up by `labelLocusNumber` to get `displayName`, every constituent locus, gene name, annotation, and coordinates. This covers essentially every gene in the genome already; manual SynWiki lookups shouldn't be necessary.
4. **Add the entry** to the end of the `PRODUCTS` array in `data/products.js` (append, don't reorder existing entries — see the id-map gotcha above).
5. **Regenerate the derived assets**: `python3 tools/build-assets.py`. It processes every product in `PRODUCTS`, not just the new one, rebuilding `assets/id-map.png`, `assets/color-composite.webp`, and `data/swatch-colors.js` together. Dimensions of every cutout must be exactly 5612×3748 — the script raises immediately (naming the offending file) if one doesn't match, which usually means an accidental rotation/resize during export. Fix and rerun rather than guessing the correct orientation.
6. **Validate**: `python3 tools/validate-products.py` — catches duplicate ids/cutouts, blank cutouts, and out-of-range locus coordinates that `build-assets.py` doesn't check.

`relevant files/2022_JCVI-syn3A.pdf` is the source paper (Goodsell 2022, RCSB PDB gallery) if deeper context is ever needed beyond the reference JSON. `relevant files/genome-loci-CP016816.2.json` is the raw per-locus GenBank data (coordinates/gene/annotation for every locus in the genome, not grouped into products) that `goodsell-products-reference.json` was built from.
