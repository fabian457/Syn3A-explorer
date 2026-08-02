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

**Default (2026-08-01, final form after several false starts — see history
below): region-grow by color distance, but bound the search to the rough
draft's own traced polygon, with *zero* dilation or padding.** This
combines the two things earlier attempts couldn't get simultaneously: it
refines away the hasty trace's own imprecision (stray background pixels
inside the lasso, a slightly-off edge), while being *structurally
incapable* of reaching a neighbor blob, since the search space never
includes a single pixel outside what was hand-traced. Validated against
Fabian's own hand-cleaned `3A-398-example.png`: grown blind (threshold
picked from the wall/plateau in the sweep, not from the example) scored
**IoU 0.90** against it, and the result had none of the neighbor-bleed
problems every wider containment strategy kept hitting (see history below).

1. **Pick a seed point** solidly inside the correct blob — the draft's own
   centroid is usually good enough (`numpy.where(alpha>0)`, mean of
   coords). If that pixel turns out to sit on a dark ink line rather than
   fill color (check: is it suspiciously dark/low-saturation?), use the
   draft mask's most-interior point instead
   (`scipy.ndimage.distance_transform_edt`, take the argmax) — a centroid
   can land on ink when the shape is irregular enough that the mean
   position isn't actually inside the fill.
2. **Sample the seed's color** from `assets/syn3A.png` (not the draft —
   the working illustration is the ground truth).
3. **Region-grow by color distance, strictly within the draft's own
   traced pixels — no bounding-box, no padding, no dilation.** Crop
   loosely around the draft for convenience (exact size doesn't matter
   since it's not the containment mechanism), but AND the color-distance
   candidate mask with the draft's own alpha (`allowed = draft_alpha`)
   before labeling connected components. This is the load-bearing change
   from earlier attempts: a bounding *box* has slack in its corners an
   irregular blob's own footprint doesn't, and *any* nonzero dilation
   margin — even one shaped to the draft's own silhouette — turned out to
   be enough to reach a same-colored neighbor in this densely-packed
   illustration (see history below). Using the draft's exact pixels as the
   hard ceiling removes the margin entirely, so there's nothing left to
   tune wrong.
4. **Exclude already-claimed territory as a hard mask — prefer
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
5. **Sweep the threshold** rather than guessing one value. Plot mask pixel
   count vs. threshold. Since growth is capped by the draft's own extent,
   there's no risk of a catastrophic neighbor-merge jump anymore — instead
   look for a plateau (a stretch of thresholds where size grows only
   slowly) before the mask starts climbing fast toward the draft's full
   pixel count as the threshold gets generous enough to include ~everything
   inside the lasso, noise included. Pick a threshold from inside that
   plateau.
6. **Clean stray pixels**: `binary_closing` → `binary_opening` (3×3
   structuring element) mops up single-pixel noise and thin protrusions;
   keep only the connected component containing the seed;
   `binary_fill_holes` for any fully-enclosed gaps left by internal color
   variation (a lighter/darker watercolor patch within the true shape,
   not a real hole).
7. **Build the output** as a full 5612×3748 transparent canvas, painting in
   the *original base illustration's* RGB at the masked pixels (preserves
   real watercolor texture, and avoids inheriting any flat/wrong color the
   drafting tool used) with alpha 255, everywhere else fully transparent
   alpha 0.
8. **Visually verify** before finalizing: composite over a flat grey
   background, crop tight to the region, **zoomed large enough to fill the
   frame** (a thumbnail-sized contact-sheet crop hides exactly the
   different-colored-fragment problem this technique exists to avoid).
   Look for stray specks, bites taken out of the shape, or a visible gap
   between the mask and the true ink line. A meaningful gap is a sign the
   draft undershot badly on that side — that's a **redraw-tighter** ask for
   Fabian (see `3A-398-example.png`), not a reason to loosen the containment
   and start chasing the true edge with padding/dilation again.

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
