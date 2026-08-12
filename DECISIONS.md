# Decisions

Why things are the way they are, not just how they work (that's what CLAUDE.md
and the code itself already show). Add an entry whenever a real alternative
was considered and rejected — skip it for anything that only ever had one
reasonable option.

## Illustration is greyscale by default, not "hover reveals color"

Originally planned as: base illustration greyscale, hovering a molecule
reveals its true color. Switched to always-color (grey only shows through
where no cutout exists yet), with hover/select instead spotlighting via a
dim wash over everything *except* the active product.

**Why:** tried the hover-reveals-color version first; it read as less clear
in practice than seeing the full colored cutouts up front. Considered
two alternatives for the hover/select affordance itself (a plain glow with
no dimming, or no extra effect at all) before landing on the dim-wash
spotlight.

## id-map.png is generated then hand-editable, not rebuilt live in-browser

`tools/build-assets.py` produces a real file on disk; the browser just loads
it once at init and never regenerates it.

**Why:** the original design built the id-map live in-browser, including
automatic flood-fill of enclosed transparent gaps in each cutout. The
in-browser version made the map impossible to inspect or hand-tweak as a
normal file. Moved to a Python/Pillow/numpy build step instead; flood-fill
turned out to be unnecessary.

## Genome coordinates come from NCBI GenBank, not manual SynWiki lookups

`relevant files/genome-loci-CP016816.2.json` (raw per-locus GenBank data)
merged with the source paper's Table 1 groupings
(`goodsell-products-reference.json`) is the source of truth for every
locus's start/end/strand.

**Why:** originally planned to look up each locus manually on SynWiki as
products were added. GenBank CP016816.2 verified as an exact match to known
reference points (543,379 bp genome length; dnaA at 1–1353) and already
covers essentially all 328 products, so per-product manual lookup turned out
to be unnecessary work.

## `PRODUCTS` array order doubles as id-map's color/z-order encoding

Documented as a load-bearing gotcha (see CLAUDE.md) rather than decoupled
into a separate stable-id scheme.

**Why:** at ~328 products max, the complexity of a separate stable-ordering
system wasn't worth it — a documented invariant plus `tools/validate-products.py`
catching duplicate ids/cutouts is enough guardrail at this scale.

## Swatch colors and the full-color composite are precomputed, not built in-browser at init

Originally, `app.js` built both of these live on every page load: `computeSwatchColors()` drew each cutout onto a full 5612×3748 canvas and read the pixel data back to average its color, and `buildColorLayer()` drew all 40+ full-res cutouts onto a display canvas to produce the default colored illustration. Both are now precomputed offline by `tools/build-assets.py` into `data/swatch-colors.js` and `assets/color-composite.webp`, alongside the existing `id-map.png` generation. Individual per-product cutouts (still needed for the hover/selection spotlight effects) now load lazily on first hover/select instead of all being fetched upfront.

**Why:** profiling showed `computeSwatchColors()` alone cost ~5.8s and `buildColorLayer()` ~1.3s of every page load, versus ~300ms to fetch and decode all 40+ cutouts locally — the pixel-averaging and full-res canvas compositing were the actual bottleneck, not image loading. A first attempt at downscaling before reading back pixel data only got `computeSwatchColors()` to ~4.2s, since the cost is dominated by `drawImage`'s resampling filter over a 21-megapixel source, not just the `getImageData` readback. This mirrors the existing `id-map.png` precedent (a derived artifact generated offline and committed, not rebuilt live) rather than being a new pattern.

## Membrane links to its building-block enzymes via `relatedProductIds`, not by listing their loci as its own

The phospholipid membrane isn't encoded by a single gene — it's assembled by
11 separate enzymes scattered across the genome. Considered folding all 11
enzymes' loci directly into the membrane's own `loci` array (so it would
"own" their genome-track segments), but instead gave the membrane an empty
`loci` and a new `relatedProductIds` field listing those 11 products' ids —
each stays its own independent, individually-clickable product, and the
membrane just references them.

**Why:** if the membrane's `loci` array owned those segments directly,
clicking e.g. the PlsY segment on the genome track would select the
*membrane*, not PlsY — losing the ability to navigate to PlsY specifically
(its own description, its own detail-panel entry). `relatedProductIds`
keeps every enzyme independently selectable while still letting the
membrane say "highlight all of these too" when it's the active product.
The relationship is one-directional (hovering PlsY alone doesn't highlight
the membrane or its siblings) to keep the mental model simple — only the
one entry that declares `relatedProductIds` gets the expanded-highlight
behavior, everything else behaves exactly as before.

## Detail panel is always visible (placeholder when empty), height synced via ResizeObserver

Never `display: none`; height matches the illustration's rendered height via
JS, not CSS.

**Why:** a plain CSS `align-items: stretch` was tried first and let the
panel's content (e.g. a long locus table) override the illustration's own
`aspect-ratio` sizing, resizing the illustration itself. Syncing height via
`ResizeObserver` and keeping the panel permanently present (with an
`.is-empty` state) fixed both that bug and a separate one where the panel's
own box would change size as content changed.

## `build-assets.py` evaluates products.js in Node rather than regex-scanning it

Originally `parse_products()` derived the product list from two independent
whole-file regexes — one for `id:` lines, one for `cutout:` lines — zipped
together positionally, guarded only by a check that the two counts matched.
Replaced (2026-08-11) with a subprocess call to `tools/parse-products.js`,
the Node `vm` parser `validate-products.py` was already using.

**Why:** that count check was the only thing standing between the script and
silent id/cutout mis-pairing, and it only fires when the counts *differ*.
Equal-but-shuffled counts pass it: a product whose fields happen to be
ordered `cutout:` before `id:`, a `/* */` comment block (the docstring only
ever promised `//`-per-line safety), or any future nested field spelled
`id:` at line start. Nothing collided in practice — `loci` uses `locusTag`,
`links` uses `label`/`url` — but that was luck, not design.

The consequence of a mis-pair isn't a crash, it's `id-map.png` encoding the
wrong index for every product past the divergence, so hover and click
silently resolve to the wrong molecule with no error anywhere. Since the
id-map's whole contract is "1-based position in the evaluated `PRODUCTS`
array" and `app.js` decodes it as `PRODUCTS[encodeId - 1]`, only real
evaluation guarantees producer and consumer agree; a regex is an
approximation of the thing the invariant is stated over.

The repo had in fact already reached this conclusion — `validate-products.py`
switched to Node evaluation earlier for exactly these reasons — but had
applied it only to the tool that *reports* problems, not the one that
*generates* the hit-testing map. This just makes the more critical script
match the less critical one.

Verified as a no-op rather than assumed: with the build cache warm at 327
products, the swapped parser produced a full cache hit — proving byte-identical
`(id, cutout)` pairs for every entry, with no image work and nothing rewritten.

## `cutout: null` means "the illustration doesn't show this product"

15 of the source paper's 328 Table 1 products are never drawn in the
artwork. They're still real genes with real coordinates, so they're
ordinary `PRODUCTS` entries with `cutout: null`.

**Why null rather than the alternatives:** omitting them entirely was
rejected because the genome track would then have unexplained gaps and
anyone revisiting the paper would re-hunt for them. Pointing them all at a
single shared fully-transparent `blank-cutout.png` was considered and
rejected too — it needs no `build-assets.py` change at all (a blank image
paints nothing, and `average_color()` already returns `#999999` for zero
alpha), but it still requires exempting that path from
`validate-products.py`'s duplicate-path *and* blank-image checks, still
requires the `app.js` dim-overlay guard, and replaces a clean
`!product.cutout` test with a magic-path comparison in two files. It also
asserts in the data that a cutout exists when none does. An empty string
`""` is worse again: falsy *but* a valid-looking path, and `PROJECT_ROOT / ""`
silently resolves to the project directory.

These entries deliberately still consume a `PRODUCTS` index — see the
id-map encoding note above — and their "not shown" explanation lives in the
`description` field, which the detail panel already renders, rather than in
a new badge component the app would otherwise not have.
