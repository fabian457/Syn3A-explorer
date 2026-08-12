#!/usr/bin/env python3
"""
Regenerates every asset derived from the cutouts referenced in
data/products.js:

  - assets/id-map.png: each product's silhouette filled with a solid ID
    color encoding its 1-based position in the PRODUCTS array (R = index &
    0xff, G = index >> 8, B = 0 -- product 1 = #010000, product 2 =
    #020000, ...). Product order -- and therefore the color each product
    gets -- is read directly from data/products.js, so this always matches
    PRODUCTS order automatically; there's no separate list to keep in sync
    by hand. When two cutouts overlap, whichever product appears later in
    PRODUCTS wins the overlapping pixels (later entries are drawn on top).
    This only touches the invisible hit-test layer.

  - assets/color-composite.png: every cutout alpha-composited together in
    PRODUCTS order (later on top, matching canvas `source-over` semantics).
    Kept as the lossless working master -- the incremental cache below loads
    this file and draws only newly-appended products onto it, so it must
    stay lossless no matter how many times that happens, exactly like
    syn3A-grey.png is kept as the master for syn3A-grey.webp.

  - assets/color-composite.webp: what #colorImg actually loads. Re-encoded
    fresh from color-composite.png at the end of *every* run (quality=90;
    ~5.2MB as PNG, ~0.8MB here, with no visible difference even zoomed into
    ink-line boundaries, the format's weak point) -- a single-generation
    lossy encode of the current master, never a re-encode of a previous
    WebP. That distinction matters: re-saving straight to WebP and loading
    that back in on the next incremental build would decode-then-re-encode
    the same pixels every time a product gets appended or a cutout gets
    fixed, compounding lossy artifacts over repeated edits -- the same
    "lossy re-compression drift" this file avoided by staying PNG while the
    product set was still growing (2026-08-12: now complete, but corrections
    to existing cutouts still happen, so the master stays PNG regardless).

  - data/swatch-colors.js: each product's alpha-weighted average color,
    keyed by id, e.g. `{ "0001": "rgb(120, 45, 60)" }`. Previously computed
    at runtime by drawing each cutout onto a full 5612x3748 canvas and
    reading back the pixel data 42+ times (~5.8s, the dominant cost of
    startup); now a synchronous lookup at init.

Incremental builds: a local, gitignored cache (.build-cache/manifest.json)
records the exact product list (id, cutout path, content hash, swatch
color) the outputs were last built from. If the current products.js is
that same list plus new entries appended at the end (the normal "add N
products" workflow -- see CLAUDE.md's "append, don't reorder" convention),
this script only processes the new entries, loading the existing
id-map.png and color-composite.png as the starting point instead of a
blank canvas -- appended products get the highest indices and are drawn
last, which already matches the "later wins overlapping pixels" rule
above. Any edit to an existing cutout, reorder, or removal doesn't match
the cached prefix and falls back to a full rebuild -- slower but always
correct, and the cache is refreshed either way so the next run is fast
again. Deleting .build-cache/ (or a fresh clone, which never has it) just
costs one full rebuild; nothing depends on the cache being present for
correctness.

A product whose `cutout` is null isn't drawn in the source illustration at
all (the paper marks these "not shown"). It still occupies its slot in
PRODUCTS -- id-map indices are positional, so skipping it would shift every
product after it -- but paints nothing into either image and is absent from
swatch-colors.js, where app.js falls back to grey for the missing key.

Regenerate this any time a cutout is added, replaced, or resized.

Usage:
    python3 tools/build-assets.py

Requires: pip install pillow numpy; a `node` binary on PATH
"""
import hashlib
import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JS = PROJECT_ROOT / "data" / "products.js"
PARSE_SCRIPT = PROJECT_ROOT / "tools" / "parse-products.js"
IDMAP_OUTPUT_PATH = PROJECT_ROOT / "assets" / "id-map.png"
COMPOSITE_OUTPUT_PATH = PROJECT_ROOT / "assets" / "color-composite.png"
COMPOSITE_WEBP_OUTPUT_PATH = PROJECT_ROOT / "assets" / "color-composite.webp"
COMPOSITE_WEBP_QUALITY = 90
SWATCH_OUTPUT_PATH = PROJECT_ROOT / "data" / "swatch-colors.js"
CACHE_DIR = PROJECT_ROOT / ".build-cache"
MANIFEST_PATH = CACHE_DIR / "manifest.json"
WIDTH, HEIGHT = 5612, 3748


def parse_products():
    """Every product's (id, cutout_path) in PRODUCTS order; cutout is None if it has none.

    products.js is evaluated as real JavaScript (tools/parse-products.js runs
    it in a Node vm and prints PRODUCTS as JSON) rather than regex-scanned.
    That matters more here than anywhere else in the repo: id-map.png encodes
    each product's *1-based index in the evaluated PRODUCTS array*, and app.js
    decodes it as `PRODUCTS[encodeId - 1]`, so this list has to be that array
    exactly -- same entries, same order, nothing skipped or merged. A regex
    scan only approximates it, and fails quietly: a product whose fields are
    ordered cutout-before-id, a /* */ comment block, or a future nested field
    spelled `id:` at line start would all mis-pair ids with cutouts, and every
    index past the divergence would then resolve to the wrong product with no
    error anywhere. Real evaluation reads the same array the browser does, so
    producer and consumer can't disagree.

    A `cutout` of null means the source paper's illustration doesn't depict
    that gene ("not shown"). Such a product still occupies its slot here --
    that's the point, so nothing after it shifts index -- but paints nothing
    into either output and has no swatch color.
    """
    try:
        result = subprocess.run(
            ["node", str(PARSE_SCRIPT)],
            capture_output=True, text=True, check=True,
        )
    except FileNotFoundError:
        raise SystemExit(
            "Parsing products.js needs a `node` binary on PATH (the same "
            "requirement tools/validate-products.py already has)."
        )
    except subprocess.CalledProcessError as e:
        raise SystemExit(
            f"node parse-products.js failed -- syntax error in products.js?\n{e.stderr}"
        )

    return [(p["id"], p.get("cutout")) for p in json.loads(result.stdout)["products"]]


def average_color(arr):
    """Alpha-weighted average RGB of an RGBA numpy array, as a CSS rgb() string."""
    alpha = arr[:, :, 3].astype(np.float64)
    total_alpha = alpha.sum()
    if total_alpha == 0:
        return "#999999"
    r = (arr[:, :, 0].astype(np.float64) * alpha).sum() / total_alpha
    g = (arr[:, :, 1].astype(np.float64) * alpha).sum() / total_alpha
    b = (arr[:, :, 2].astype(np.float64) * alpha).sum() / total_alpha
    return f"rgb({round(r)}, {round(g)}, {round(b)})"


def file_sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def process_one(i, product_id, cutout_rel_path, idmap, composite):
    """Paint product #i (1-based) into idmap/composite in place, return its swatch color."""
    path = PROJECT_ROOT / cutout_rel_path
    img = Image.open(path).convert("RGBA")
    if img.size != (WIDTH, HEIGHT):
        raise ValueError(
            f"{cutout_rel_path} is {img.size}, expected {(WIDTH, HEIGHT)} "
            "-- check for an accidental rotation/resize before regenerating."
        )
    arr = np.array(img)
    mask = arr[:, :, 3] > 0

    r = i & 0xFF
    g = (i >> 8) & 0xFF
    idmap[mask, 0] = r
    idmap[mask, 1] = g
    idmap[mask, 2] = 0
    idmap[mask, 3] = 255

    composite.alpha_composite(img)
    swatch = average_color(arr)

    print(f"  #{i:>3} {product_id}  ({cutout_rel_path}): rgb({r},{g},0), {mask.sum()} px, swatch {swatch}")
    return swatch


def load_manifest():
    if not MANIFEST_PATH.exists():
        return None
    try:
        return json.loads(MANIFEST_PATH.read_text())["products"]
    except (json.JSONDecodeError, KeyError, OSError):
        return None


def save_manifest(products, hashes, swatches):
    CACHE_DIR.mkdir(exist_ok=True)
    entries = [
        {"id": pid, "cutout": cutout, "sha256": h, "swatch": swatches.get(pid)}
        for (pid, cutout), h in zip(products, hashes)
    ]
    MANIFEST_PATH.write_text(json.dumps({"products": entries}, indent=2))


def cached_prefix_length(products, hashes, cached):
    """How many leading entries of `products` exactly match `cached`, in order.

    A match requires identical id, cutout path, and content hash at every
    position -- a single mismatch anywhere (an edit, a reorder, a removed
    entry, or a renamed/moved one) stops the prefix there, since anything
    beyond that point can no longer be trusted to still be exactly what the
    cached id-map.png/color-composite.png pixels represent.

    A not-shown product (cutout None) matches on (id, None, None): it has no
    file to hash, so nothing about it can change between runs short of its id.
    It stays a cache hit forever, which is what keeps a batch of them from
    forcing a full rebuild on every subsequent run.
    """
    if not cached:
        return 0
    n = min(len(cached), len(products))
    count = 0
    for entry, (pid, cutout), h in zip(cached, products[:n], hashes[:n]):
        if entry.get("id") != pid or entry.get("cutout") != cutout or entry.get("sha256") != h:
            break
        count += 1
    return count


def main():
    products = parse_products()
    print(f"Found {len(products)} products in {PRODUCTS_JS.relative_to(PROJECT_ROOT)}")

    hashes = [
        None if cutout is None else file_sha256(PROJECT_ROOT / cutout)
        for _, cutout in products
    ]
    cached = load_manifest()
    prefix_len = cached_prefix_length(products, hashes, cached)

    idmap = None
    composite = None
    swatches = {}

    if prefix_len > 0:
        try:
            composite = Image.open(COMPOSITE_OUTPUT_PATH).convert("RGBA")
            idmap_img = Image.open(IDMAP_OUTPUT_PATH).convert("RGBA")
            if composite.size != (WIDTH, HEIGHT) or idmap_img.size != (WIDTH, HEIGHT):
                raise ValueError("cached output dimensions don't match")
            idmap = np.array(idmap_img)
            # Keep `swatches` meaning strictly "products that have a swatch color".
            # A not-shown product's cached swatch is null; letting that through
            # would write the literal string "None" into swatch-colors.js.
            swatches = {
                entry["id"]: entry["swatch"]
                for entry in cached[:prefix_len]
                if entry.get("swatch") is not None
            }
        except (FileNotFoundError, OSError, ValueError) as e:
            print(f"Cache manifest matches but outputs unusable ({e}) -- doing a full rebuild")
            idmap = None
            composite = None
            swatches = {}
            prefix_len = 0

    if prefix_len == len(products) and idmap is not None:
        # Nothing changed at all -- skip re-touching the big image outputs entirely.
        print(f"No changes detected across all {len(products)} products -- outputs already up to date")
    else:
        if idmap is None:
            idmap = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)
            composite = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            swatches = {}
            prefix_len = 0
        elif prefix_len > 0:
            print(f"Reusing cached outputs for {prefix_len} unchanged product(s); "
                  f"processing {len(products) - prefix_len} new product(s)")

        for i in range(prefix_len + 1, len(products) + 1):
            product_id, cutout_rel_path = products[i - 1]
            if cutout_rel_path is None:
                # Not depicted in the illustration: no silhouette to own in the
                # id-map, nothing to composite, no color to average. It still
                # burns index i, which is precisely the point -- every product
                # after it keeps the id-map index app.js decodes it by.
                print(f"  #{i:>3} {product_id}  (not shown in the illustration -- no cutout)")
                continue
            swatches[product_id] = process_one(i, product_id, cutout_rel_path, idmap, composite)

        Image.fromarray(idmap, "RGBA").save(IDMAP_OUTPUT_PATH)
        print(f"Saved {IDMAP_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

        composite.save(COMPOSITE_OUTPUT_PATH, "PNG")
        print(f"Saved {COMPOSITE_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

        # A single-generation lossy encode of the master that was just written
        # above, not a re-encode of a previous WebP -- see the module docstring
        # for why that distinction matters across repeated incremental builds.
        composite.save(COMPOSITE_WEBP_OUTPUT_PATH, "WEBP", quality=COMPOSITE_WEBP_QUALITY)
        print(f"Saved {COMPOSITE_WEBP_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

    # Filtered on `cutout is not None` rather than `pid in swatches`: a product
    # that *has* a cutout but somehow reached here without a swatch is a real
    # bug, and should still raise KeyError loudly instead of silently going grey.
    lines = [
        f'  "{pid}": "{swatches[pid]}",'
        for pid, cutout in products
        if cutout is not None
    ]
    swatch_js = (
        "// Generated by tools/build-assets.py -- do not hand-edit.\n"
        "// Alpha-weighted average color of each product's cutout, keyed by id.\n"
        "// Products the illustration doesn't show (cutout: null) have no cutout to\n"
        "// average and are absent here -- app.js falls back to grey for a missing key.\n"
        "const SWATCH_COLORS = {\n" + "\n".join(lines) + "\n};\n"
    )
    SWATCH_OUTPUT_PATH.write_text(swatch_js)
    print(f"Saved {SWATCH_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

    save_manifest(products, hashes, swatches)
    print(f"Saved {MANIFEST_PATH.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
