# Assisting with cutouts

Techniques for helping Fabian with `cutouts/3A-0XXX.png` files — both
*locating* where an as-yet-undrawn product sits in the illustration, and
*cleaning up* a rough hand-traced draft into something finished-quality.
Written up after two real worked examples (locating 0113, cleaning up
0094) so the approach doesn't need to be rediscovered from scratch.

**The honest starting point:** fully segmenting a brand-new shape out of
raw artwork — no draft, no hint — is not something I can do reliably.
Goodsell's illustration is dense with touching, often similarly-colored
blobs, and picking the correct organic boundary between two neighbors is a
judgment call, not a pixel-value threshold. Don't attempt that. Both
techniques below work specifically *because* they lean on something else
that's already known/trustworthy — a labeled position, or an already-good
neighboring cutout — rather than trying to recognize the shape from
nothing.

## 1. Locating a not-yet-drawn product

Use `relevant files/syn3A-labled-samesize.png` — a labeled reference that's
pixel-identical in dimensions (5612×3748) to the working illustration, so a
label's position there maps 1:1 to working-image coordinates with **zero
calibration needed**. (The older `relevant files/labled-syn3A.png` is a
*different* crop/aspect ratio and would need an affine calibration fit
against known-good cutout centroids to be usable — prefer the samesize
file and avoid that whole problem.)

Process:
1. Crop a broad region of the samesize labeled file around where you'd
   expect the label (context from neighboring already-placed products, or
   just scan outward from a rough guess).
2. Read the crop (the `Read` tool displays images directly) to find the
   exact label, zooming/re-cropping tighter as needed to pin down precise
   pixel coordinates.
3. Crop the *matching* region from the labeled file (as a cross-check) and
   hand that to Fabian. Don't also send a separate clean/unlabeled crop
   from `assets/syn3A.png` unless asked — one file, the labeled one, is
   what he wants.

OCR (`tesseract`, already installed on this Mac) was tried for finding
labels automatically but isn't reliable against this watercolor
background — manual crop-and-read is currently the better method.

## 2. Cleaning up a rough draft into a finished cutout

**Default (updated 2026-08-07 — supersedes the pure-RGB-distance version
in the history section below, though the zero-margin containment
principle it established still holds unchanged): region-grow within the
draft's own traced polygon (zero margin — unchanged, see history) using an
**HSV color-family window** as the color-match criterion, generally
*without* an additional RGB-distance-from-seed threshold.** Once a
product's color family has an established HSV window (see "Establishing
an HSV window" below), a straight `draft_alpha & hsv_window &
~id-map-claimed` mask reliably captures the full true-color region on its
own. Confirmed on 0402/0403: the older RGB-distance-threshold-sweep
version left both patchy even at its most generous threshold, purely
because a single seed pixel's exact RGB isn't representative of legitimate
tone variation across the rest of the same blob — the HSV window (not
distance from one point) was the actually-correct constraint the whole
time. Threshold-sweeping (step 5 in the history section) is still a
reasonable fallback for a color family that has no established HSV window
yet, but shouldn't be the first thing reached for once one exists.

1. **Pick a seed point** solidly inside the correct blob — the draft's own
   centroid is usually good enough (`numpy.where(alpha>0)`, mean of
   coords). If its color falls *outside* the current HSV window, fall back
   through this chain rather than trusting it:
   1. **Interior point**: `scipy.ndimage.distance_transform_edt` on the
      draft mask, take the argmax — a centroid can land on a dark ink line
      when the shape is irregular enough that the mean position isn't
      actually inside the fill.
   2. **Mode color**: if *even the interior point* is still outside the
      window, both landed on the same small contaminating feature —
      e.g. 0132 was a 6-petal flower with a small orange dot dead-center,
      which both the centroid *and* the most-interior point happened to
      coincide with. Fall back to the mode color of all draft-interior
      pixels (quantize to steps of 8, take the most common bucket) — the
      bulk fill dominates a small contaminating feature by pixel count —
      then pick whichever draft pixel is closest to that mode color and
      nearest the original centroid as the seed coordinate.
2. **Sample the seed's color** from `assets/syn3A.png` (not the draft —
   the working illustration is the ground truth).
3. **Establishing an HSV window for a color family.** Ask Fabian for a
   handful of small interior-color-sample crops of the *target* color,
   saved to `color examples/<family name>/*.png`, plus crops of any
   specific neighboring color(s) that need to be excluded (a similar-hued
   neighbor, the dark ink/background wash, etc. — organize each into its
   own `color examples/<name>/` subfolder). Sample H/S/V stats from both
   (min/max/percentiles), then propose bounds that cover the target with
   margin while staying clear of every exclusion sample. **Always confirm
   the proposed range with Fabian before using it, and never widen or
   narrow it unilaterally mid-batch — if a specific product's own true
   color falls outside the currently-agreed window, stop and ask rather
   than silently adjusting.** (This is also recorded in the
   `workflow-adding-products` memory after a real incident: dropping an
   HSV filter without asking on 0710 caused follow-on patchy/bleeding
   results across several other products in the same batch before Fabian
   caught it.) Hue is usually the only axis that actually discriminates
   between a target family and a same-hue-range neighbor — watch
   especially for a neighbor whose hue range fully overlaps the target's
   and is only separable by V (this repo's dark background/ink wash sits
   at roughly the same hue as several blue color families used so far,
   discriminated only by being much darker — margins here have been razor
   thin, sub-0.03 in V, so treat that boundary with extra care).
4. **Region-grow using the HSV window, strictly within the draft's own
   traced pixels — no bounding-box, no padding, no dilation.** Crop
   loosely around the draft for convenience (exact size doesn't matter
   since it's not the containment mechanism), then
   `allowed = draft_alpha & ~claimed & hsv_ok` before labeling connected
   components and keeping the one containing the seed. A bounding *box*
   has slack in its corners an irregular blob's own footprint doesn't, and
   *any* nonzero dilation margin — even one shaped to the draft's own
   silhouette — turned out to be enough to reach a same-colored neighbor
   in this densely-packed illustration (see history below). Using the
   draft's exact pixels as the hard ceiling removes the margin entirely,
   so there's nothing left to tune wrong.
5. **Exclude already-claimed territory as a hard mask — prefer
   `assets/id-map.png` over picking one specific neighbor file.**
   `id-map.png` encodes *every* currently-defined product's opaque pixels
   in one place (`alpha > 0` = claimed by something already), so it's a
   more complete safety net than remembering to check just the one
   neighbor you happened to think of (e.g. the membrane). Subtract its
   claimed pixels from the candidate mask before labeling.

   **Gotcha when testing/redrawing an already-real product**: `id-map.png`
   already contains *that product's own* current region, since it's built
   from whatever's currently in `PRODUCTS`. Blanket-excluding all claimed
   pixels then excludes the seed itself, `scipy.ndimage.label` reports the
   seed's label as `0` (background), and `mask = labeled == seed_label`
   silently selects *everything that isn't the tiny candidate blob* — a
   huge, nonsensical result that looks like a runaway flood but is
   actually this labeling bug. Fix: subtract the target's own existing
   mask from the id-map exclusion first (`claimed & ~old_own_mask`),
   simulating "as if this product wasn't defined yet." Sanity-check
   `labeled[seed] != 0` before trusting the result, regardless.
6. **If no HSV window is established yet** (a brand-new, uncharacterized
   color family), sweep an RGB-distance-from-seed threshold instead of/in
   addition to HSV, rather than guessing one value: plot mask pixel count
   vs. threshold. Since growth is capped by the draft's own extent, there's
   no risk of a catastrophic neighbor-merge jump — instead look for a
   plateau (a stretch of thresholds where size grows only slowly) before
   the mask starts climbing fast toward the draft's full pixel count as
   the threshold gets generous enough to include ~everything inside the
   lasso, noise included. Pick a threshold from inside that plateau. (This
   was the sole technique before HSV windows were introduced — still fine
   as a bootstrap for a color family with no samples yet.)
7. **Clean stray pixels**: `binary_closing` → `binary_opening` (3×3
   structuring element) mops up single-pixel noise and thin protrusions;
   keep only the connected component containing the seed;
   `binary_fill_holes` for any fully-enclosed gaps left by internal color
   variation (a lighter/darker watercolor patch within the true shape,
   not a real hole).

   **Gotcha**: for a small/thin candidate blob, `binary_opening` (erosion
   then dilation) can erase the shape entirely *at the seed's own pixel*
   even though pixels survive elsewhere in it — the same "`label==0`
   selects everything else" failure as the id-map gotcha above, but via a
   different path. Guard explicitly: after closing+opening, check whether
   the seed pixel's label is `0`; if so, discard the opened result and
   fall back to the pre-cleanup (closed-but-not-opened, or raw) mask
   instead of trusting whatever `labeled == 0` picked out.
8. **Multi-component drafts.** Sometimes `scipy.ndimage.label(draft_alpha)`
   reports more than one connected component in a single `-01.png`. This
   can be *either*: (a) accidental contamination — an unrelated product's
   blob pasted in by mistake (see the duplicate-bounding-box pitfall
   below), or (b) legitimate — the true shape is visually split by e.g. an
   mRNA/tRNA strand crossing in front of it, or the draft genuinely
   contains two physical instances of the same product drawn together in
   one file. When legitimate, process **each component separately** (own
   mode-color seed per component — don't assume they share a color) and
   **union the resulting masks** into one final cutout; don't just keep
   the component containing the overall centroid, which silently drops
   the other piece(s). If ambiguous which case it is, check whether the
   components' relative position/size looks like a known duplicate-bbox
   pattern (below) before assuming legitimacy.
9. **Build the output** as a full 5612×3748 transparent canvas, painting in
   the *original base illustration's* RGB at the masked pixels (preserves
   real watercolor texture, and avoids inheriting any flat/wrong color the
   drafting tool used) with alpha 255, everywhere else fully transparent
   alpha 0.
10. **Visually verify** before finalizing: composite over a flat grey
    background, crop tight to the region, **zoomed large enough to fill
    the frame** (a thumbnail-sized contact-sheet crop hides exactly the
    different-colored-fragment problem this technique exists to avoid) —
    also build a diff-overlay ("diag") sheet, the base illustration with
    the draft's own excluded territory highlighted in red, which is much
    better than the flat-grey view at showing *why* a boundary landed
    where it did. Look for stray specks, bites taken out of the shape, or
    a visible gap between the mask and the true ink line. A meaningful gap
    is a sign the draft undershot badly on that side — that's a
    **redraw-tighter** ask for Fabian (see `3A-398-example.png`), not a
    reason to loosen the containment and start chasing the true edge with
    padding/dilation again. **Send the diag/contact sheet to Fabian and
    wait for his explicit confirmation before adding entries to
    `products.js` or running `build-assets.py`** — don't self-verify and
    proceed to the next step in the same turn regardless of how clean it
    looks; this was corrected explicitly after doing exactly that with
    0402 (also in the `workflow-adding-products` memory).
11. **If Fabian supplies a hand-drawn reference file** (commonly named
    `-02` or `-example`), check which of two things it's meant to be
    rather than assuming: a **precise, ready-to-use finished cutout**
    (skip all of the above, just verify dimensions/quality and copy it
    straight to `cutouts/3A-XXX.png` — e.g. `3A-613-02.png`), or an
    **approximate target** to diagnose gaps in an automated result against
    (compute IoU, visualize missed/extra pixels, use it to guide a fix —
    e.g. `3A-260-02-approx-example.png`). The filename alone isn't always
    a reliable signal (`-02` doesn't necessarily mean "second draft, needs
    processing" — see the `workflow-adding-products` memory).

### Older attempts that didn't work (why the containment is this strict)

Three progressively tighter containment strategies were tried before
landing on "the draft's own pixels, zero margin," each fixing the previous
failure but not the underlying problem — see the pitfall section below for
the full account. In short: a generic fixed-radius crop reached neighbors
easily; cropping to the draft's unpadded bounding *box* was better but
still had corner slack a rectangle has and an irregular blob doesn't;
dilating the draft's own *shape* (not its box) by a margin closed that
gap but, in a tightly-packed area, the margin needed to correct a real
undershoot on one side was also enough to reach a neighbor on another. No
positive margin reliably separated those two cases. Zero margin does, by
construction — at the cost of accepting the draft's own imprecision where
present, which is why step 8's redraw-tighter fallback matters.

### If a known-good final cutout happens to exist (redraws, or testing)

When cleaning up a redraw where the *old* finished cutout is still
sitting in `cutouts/`, it's fair game to use it as an evaluation metric —
just don't pretend that's the same as a genuinely blind result. Compute
IoU:

```python
new_mask   = np.array(Image.open(new_path).convert("RGBA"))[:,:,3] > 0
known_mask = np.array(Image.open(known_path).convert("RGBA"))[:,:,3] > 0
inter = (new_mask & known_mask).sum()
union = (new_mask | known_mask).sum()
iou = inter / union  # 1.0 = identical; also check the false-positive/
                      # false-negative pixel counts separately, since IoU
                      # alone can hide "small but bleeding into a neighbor"
                      # vs. "just a bit conservative at the edges"
```

Worked example (0094): region-growing + membrane-exclusion got **IoU
0.882** (11 stray pixels over-extracted, 472 legitimate edge pixels missed,
zero bleed into neighboring shapes) — tuned by sweeping the threshold
against this known-good mask. Say so plainly when a result was tuned this
way; it answers "can this technique work at all" but not "can it be
trusted with no answer key," which is the harder and more useful question
if you don't already have a finished reference.

### Genuinely blind result (no answer key used) — 0113

Unlike the 0094 case above, this one wasn't tuned against a known answer:
seed = the rough draft's own centroid, threshold picked purely from the
wall-detection heuristic (step 5), `id-map.png` exclusion, nothing else.
Fabian then separately supplied `3A-113-example.png` as the actual intended
result — **IoU 0.949** against it (161 over-extracted, 53 missed), sight
unseen until after the threshold was already chosen.

Notable: the rough draft (`3A-113-01.png`, described as "hastily done") had
a much larger extent than either the region-grown result or the true
intended shape — it included several adjacent color facets (a paler side
lobe, a darker cap, a small unrelated blue triangle) that turned out to be
lasso overshoot, not part of the real shape. **Don't treat a rough/hasty
draft's full extent as ground truth to match** — its centroid is a good
seed, but its boundary can be wrong. The wall-detection heuristic, applied
to the real base illustration, found the correct boundary independent of
the draft's own (in this case too-generous) outline.

### Pitfall: merging into a same-colored neighbor blob (why containment is zero-margin now)

Found repeatedly across a single session — 0296, 0691, 0878, then 0398
again despite two different fixes in between: region-growing can reach a
**separate, same-colored neighbor blob** sitting just past the true shape's
edge, crossing into it over a thin, weakly-inked gap. The size-jump
wall-detection doesn't reliably catch this — because the neighbor is a whole
additional blob rather than a sliver of overshoot, the jump when it first
connects can look unremarkable (0878 grew smoothly from 8641px to 10734px, a
1.24x step, nothing like the 3x+ jumps a true wall produces) even though the
result is now two entire molecules fused into one cutout.

Three progressively tighter containment strategies were tried, in order,
each fixing the previous failure but not the underlying problem:
1. **Generic fixed-radius crop** (e.g. 300px around the seed) — reached
   neighbors easily; fixed by...
2. **Crop to the draft's own bounding box, unpadded** — better, but a
   *rectangle* still has slack in its corners that an irregular blob's own
   footprint doesn't, so a neighbor sitting in a corner of the bbox (outside
   the draft's actual traced polygon, but inside its bounding rectangle) was
   still reachable. This is what let 0398 merge with a neighbor even under
   this rule. Fixed by...
3. **Dilate the draft's own irregular shape** (not its bbox) by a fixed
   margin, use that as both the crop and an extra allowed-region mask — this
   follows the blob's actual silhouette instead of a rectangle, closing the
   corner-slack hole. But re-tried on 0398, it *still* reached a
   different-colored neighbor (bright green legs the draft never included),
   because in a densely-packed area the true wall can be closer to the
   draft's own edge than any useful margin — the same margin needed to
   correct a real undershoot on one side is enough to reach a neighbor on
   another.

**Conclusion: for this illustration's densely-packed regions, no *positive*
margin/containment strategy reliably separates "give growing enough room to
correct undershoot" from "give it enough room to reach a neighbor" — the two
distances aren't reliably different.** The fix that actually held (see the
default above) was dropping the margin to exactly zero: bound growth to the
draft's own already-traced pixels, nothing more. That's not a fallback
setting to loosen when a result looks slightly conservative — loosening it
even a little is what caused every failure documented above. Still worth
doing when finalizing a result:
- **Always eyeball the finished cutout on a flat grey background, zoomed to
  fill the frame** — not just the boundary-overlay-on-base image used while
  tuning. Different-colored fragments joined by a narrow neck are far easier
  to spot against flat grey than against the busy watercolor background, but
  still easy to miss at thumbnail size — check at a large zoom, not just a
  contact-sheet-sized crop.
- If a redo is needed on an already-committed product (as with 0691/0878/0398
  here), remember the self-exclusion gotcha above — `id-map.png` already
  contains the product's own current region, so subtract its own current
  mask from the claimed-territory exclusion before regrowing, same as the
  redraw case.

0398's original hasty `-01` draft undershot badly enough (per step 8's
redraw-tighter guidance) that Fabian resupplied a hand-cleaned
`3A-398-example.png`, which became the final cutout directly. Re-run blind
with the zero-margin technique above against the *original* `-01` draft
(after the fact, as validation, not as the actual fix used), it scored
IoU 0.90 against that example — evidence the zero-margin approach is sound,
even though the real fix for that specific product ended up being a better
draft rather than a grown result.

### What this doesn't solve

- A boundary that's a soft gradient on *multiple* sides (not just one, with
  no finished neighbor to lean on for any of them) — nothing here resolves
  that; it'd need actual visual judgment.
- Getting the seed point itself right, when there's no draft and no
  already-known centroid — that's still the "locating" problem from
  section 1, a separate step.
