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
in practice than seeing the full colored illustration up front. Considered
two alternatives for the hover/select affordance itself (a plain glow with
no dimming, or no extra effect at all) before landing on the dim-wash
spotlight.

## id-map.png is generated then hand-editable, not rebuilt live in-browser

`tools/build-idmap.py` produces a real file on disk; the browser just loads
it once at init and never regenerates it.

**Why:** the original design built the id-map live in-browser, including
automatic flood-fill of enclosed transparent gaps in each cutout. The
in-browser version made the map impossible to inspect or hand-tweak as a
normal file. Moved to a Python/Pillow/numpy build step instead; flood-fill
turned out to be unnecessary once cutouts were cleaner.

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

## Detail panel is always visible (placeholder when empty), height synced via ResizeObserver

Never `display: none`; height matches the illustration's rendered height via
JS, not CSS.

**Why:** a plain CSS `align-items: stretch` was tried first and let the
panel's content (e.g. a long locus table) override the illustration's own
`aspect-ratio` sizing, resizing the illustration itself. Syncing height via
`ResizeObserver` and keeping the panel permanently present (with an
`.is-empty` state) fixed both that bug and a separate one where the panel's
own box would change size as content changed.
