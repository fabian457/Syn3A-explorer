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

This is the more useful/reliable technique. Given a rough hand-trace (e.g.
`in-progress/3A-0XXX-01.png`) that has gaps in its outline or bleeds
slightly into a neighbor, region-grow a clean mask from the *real* base
illustration (`assets/syn3A.png`) instead of trying to patch the draft's
own pixels directly:

1. **Pick a seed point** solidly inside the correct blob — the draft's own
   centroid is usually good enough (`numpy.where(alpha>0)`, mean of
   coords).
2. **Sample the seed's color** from `assets/syn3A.png` (not the draft —
   the working illustration is the ground truth).
3. **Region-grow by color distance, within a bounded local crop — always,
   no exceptions.** Compute Euclidean RGB distance from the seed color
   across a crop of a few hundred px radius, threshold it, then keep only
   the connected component containing the seed (`scipy.ndimage.label`).
   This is a "magic wand" / flood-fill, not a global threshold.

   **The crop bound is load-bearing, not a performance nicety.** Nothing
   about color-distance similarity is inherently local — a chain of
   adjacent, sufficiently-similar-colored pixels can in principle connect
   the seed to territory arbitrarily far away, and most of a 5612×3748
   illustration is background/other shapes that a "not yet claimed by any
   known product" exclusion (see next point) does *nothing* to stop,
   because unclaimed just means "no cutout exists for it yet," not "not
   part of this shape." Tested this directly: rerunning the 0094 case with
   *no* crop bound at all happened to land close to the true shape (~3600px
   vs a true ~4000px) only because that specific spot is densely surrounded
   by already-defined neighbors forming a tight enough "moat." A sparser
   part of the illustration, with fewer neighboring cutouts done yet, could
   let the same unbounded search run away completely. Always crop first;
   never rely on exclusion masks alone to contain the search.
4. **Exclude already-claimed territory as a hard mask — prefer
   `assets/id-map.png` over picking one specific neighbor file.**
   `id-map.png` encodes *every* currently-defined product's opaque pixels
   in one place (`alpha > 0` = claimed by something already), so it's a
   more complete safety net than remembering to check just the one
   neighbor you happened to think of (e.g. the membrane). Subtract its
   claimed pixels from the candidate mask before labeling. This matters
   most on edges where the true boundary is a soft color gradient rather
   than a hard ink line — color-distance alone can't find a wall that
   isn't there, but a trusted already-claimed mask can.

   **Gotcha when testing/redrawing an already-real product** (as in the
   0094 worked example below): `id-map.png` already contains *that
   product's own* current region, since it's built from whatever's
   currently in `PRODUCTS`. Blanket-excluding all claimed pixels then
   excludes the seed itself, `scipy.ndimage.label` reports the seed's
   label as `0` (background), and `mask = labeled == seed_label` silently
   selects *everything that isn't the tiny candidate blob* — a huge,
   nonsensical result that looks like a runaway flood but is actually this
   labeling bug. Fix: subtract the target's own existing mask from the
   id-map exclusion first (`claimed & ~old_own_mask`), simulating "as if
   this product wasn't defined yet." Sanity-check `labeled[seed] != 0`
   before trusting the result, regardless.
5. **Sweep the threshold** rather than guessing one value. Plot mask pixel
   count vs. threshold — there's usually a clear "wall": pixel count creeps
   up slowly, then suddenly jumps by 2-3x at some threshold as the region
   floods through into a neighboring shape. Pick the last threshold before
   that jump. (Concretely, in the 0094 case: sizes of ~3500-3600px from
   threshold 60-83, then a jump to ~9800px at threshold 84 — 83 was the
   pick.)
6. **Clean stray pixels**: a small `binary_closing` then `binary_opening`
   (3×3 structuring element) mops up single-pixel noise and thin
   protrusions without eating into the real shape.
7. **Build the output** as a full 5612×3748 transparent canvas, painting in
   the *original base illustration's* RGB at the masked pixels (preserves
   real watercolor texture) with alpha 255, everywhere else fully
   transparent alpha 0.
8. **Visually verify** before finalizing: composite over a flat grey
   background, crop tight to the region, `Read` it back. Look specifically
   for stray specks, bites taken out of the shape, or bleed into
   neighbors — iterate the threshold/cleanup if anything looks wrong.

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

### What this doesn't solve

- A boundary that's a soft gradient on *multiple* sides (not just one, with
  no finished neighbor to lean on for any of them) — nothing here resolves
  that; it'd need actual visual judgment.
- Getting the seed point itself right, when there's no draft and no
  already-known centroid — that's still the "locating" problem from
  section 1, a separate step.
