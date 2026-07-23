# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive web app for exploring the JCVI-syn3A minimal-cell genome through David Goodsell's watercolor cutaway illustration of the cell. Hovering/clicking a molecule shape in the illustration reveals what gene(s) encode it and highlights the corresponding region(s) on a genome track at the bottom; the same linkage works in reverse from the genome track back to the illustration.

Vanilla HTML/CSS/JS, no build step, no dependencies, no test suite.

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
- `assets/` — the base illustration (`syn3A-grey.png`, always shown), the full-color original (`syn3A.png`/`.webp`, not used at runtime), and `id-map.png` (see below)
- `cutouts/3A-0XXX.png` — one transparent-background cutout PNG per depicted product, named after its locus number
- `relevant files/` — source material used when adding new products (see "Adding a new product" below)

### The illustration is four stacked layers, bottom to top

```html
<img id="baseImg">        <!-- always-grey base, always visible -->
<canvas id="colorCanvas">  <!-- every defined product's cutout, composited once at init -->
<canvas id="dimCanvas">     <!-- dark wash with a hole punched over the active product -->
<canvas id="selectionCanvas"> <!-- selected product's cutout + CSS glow outline -->
```

All currently-defined products show in their real color by default (`buildColorLayer()`, run once in `init()`); the grey background shows through only where no cutout exists. Hovering/selecting a product doesn't reveal color (it's already visible) — it spotlights: `updateDimOverlay()` fills `dimCanvas` with a translucent dark wash, then uses `globalCompositeOperation = "destination-out"` with the active product's own cutout to erase a hole exactly over its silhouette, dimming everything else. `selectionCanvas` sits above the dim overlay so a persisted selection stays undimmed even while hovering something else elsewhere.

### Hit-testing: `assets/id-map.png`

A reference PNG, same 5612×3748 dimensions as the illustration, encoding which product owns each pixel:
- Product at 1-based array index `N` in `PRODUCTS` is filled with `rgb(N & 0xff, N >> 8, 0)` (product 1 = `#010000`, product 2 = `#020000`, ...; R is the low byte, G is the overflow byte past 255).
- Everywhere else is transparent (alpha 0 = no product).

`app.js` just loads this file into an offscreen canvas at init (`loadIdMap()`) and does a single `getImageData(x, y, 1, 1)` read per mousemove (`getProductAtPixel`) — O(1) regardless of product count. **This file is generated from the cutouts, then hand-edited as needed — it is not regenerated at runtime.**

Regenerate it with `python3 tools/build-idmap.py` (requires `pip install pillow numpy`) any time a cutout is added, replaced, or resized. The script reads product order and cutout paths directly out of `data/products.js` (a regex scan, not a real JS parser — it just needs every product object's `id`/`cutout` fields to keep their current one-per-line shape), so it never needs its own separate list kept in sync.

**Critical gotcha:** `PRODUCTS` array order and `id-map.png`'s encoding must stay in lockstep. Reordering/inserting into the array without regenerating the id-map will make hover/click resolve to the wrong product. When two cutouts legitimately overlap (e.g. a subunit that also appears as a free-floating copy elsewhere), whichever product is later in the array wins the overlapping pixels — put the more specific product later if that matters.

### State model

Two variables drive everything: `hoveredProductId`, `selectedProductId`. The recurring pattern `const activeId = hoveredProductId || selectedProductId` (hover takes priority, falls back to selection) appears independently in three places that all need to react to the same "what's currently active" concept: `updateDimOverlay()`, `updateTrackEmphasis()` (genome track), and `updateDetailPanel()` (via `getActiveProduct()`). The illustration and the genome track's SVG both call the exact same `setHovered()`/`selectProduct()`/`deselectProduct()` mutators (the genome track's listeners are delegated on the `<svg>` root via `event.target.closest('.track-segment')`), which is what makes hover/click bidirectional between the two.

### Genome track

`<svg viewBox="0 0 2000 60">`, one `<rect class="track-segment" data-product-id="...">` per locus that has known `start`/`end` (loci with `null` coordinates just don't get a segment — nothing else breaks). Position via `bpToX(bp) = bp / GENOME_LENGTH_BP * 2000`, with a minimum width so tiny genes stay clickable. Multi-locus products (e.g. the DNA polymerase assembly) get one rect per locus, all sharing `data-product-id`, so they highlight together automatically.

### Detail panel

Height is JS-synced to the illustration's rendered height via a `ResizeObserver` (`syncPanelHeight`), not CSS — a plain `align-items: stretch` was tried and rejected because it let the panel's content override the illustration's `aspect-ratio` sizing. Long content (e.g. a 20-locus table) scrolls internally (`overflow-y: auto`) rather than growing the box. The panel is always present in the layout (never `display: none`) with an `.is-empty` state showing a placeholder, specifically so the illustration never resizes when the panel's content changes.

### Product data (`data/products.js`)

Each entry: `id` (4-digit locus string), `displayName`, `fullName`, `cutout` (path), `loci` (array of `{locusTag, gene, start, end, strand}` — `gene`/coordinates may be `null` if not yet known), `description`, `links`. `swatchColor` is *not* stored in this file — it's computed automatically at runtime (`computeSwatchColors()`) by averaging each cutout's opaque pixel colors, so it always matches the artwork without manual color-picking.

## Adding a new product

This is the most common task in this repo. Workflow, in order:

1. **Identify the locus number.** `relevant files/labled-syn3A.png` is a labeled version of the illustration — every visible cluster has its locus number printed next to it (last 3 digits of the locus tag; for multi-locus assemblies, the number is the *lowest* locus tag in the group, per the source paper's own convention). Note: this labeled image has a different crop/aspect ratio than the working illustration files, so pixel coordinates don't map 1:1 between them without calibration — use it to identify *which* product something is, not to compute exact click coordinates.
2. **Get a cutout.** Same 5612×3748 canvas, transparent background, pixel-aligned with the other cutouts, containing only that product's colored shape(s). Save as `cutouts/3A-0XXX.png` (locus number, zero-padded to 3 digits — note this is one fewer digit than the `JCVISYN3A_0XXXX` locus tag / the `id` field in `products.js`).
3. **Look up its data.** `relevant files/goodsell-products-reference.json` has all 328 products from the source paper's Table 1, each pre-merged with real GenBank coordinates — look up by `labelLocusNumber` to get `displayName`, every constituent locus, gene name, annotation, and coordinates. This covers essentially every gene in the genome already; manual SynWiki lookups shouldn't be necessary.
4. **Add the entry** to the end of the `PRODUCTS` array in `data/products.js` (append, don't reorder existing entries — see the id-map gotcha above).
5. **Regenerate `assets/id-map.png`**: `python3 tools/build-idmap.py`. It processes every product in `PRODUCTS`, not just the new one.
6. **Sanity check**: dimensions of every cutout must be exactly 5612×3748 — the script raises immediately (naming the offending file) if one doesn't match, which usually means an accidental rotation/resize during export. Fix and rerun rather than guessing the correct orientation.

`relevant files/2022_JCVI-syn3A.pdf` is the source paper (Goodsell 2022, RCSB PDB gallery) if deeper context is ever needed beyond the reference JSON. `relevant files/genome-loci-CP016816.2.json` is the raw per-locus GenBank data (coordinates/gene/annotation for every locus in the genome, not grouped into products) that `goodsell-products-reference.json` was built from.
