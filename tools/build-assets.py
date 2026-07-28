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

  - assets/color-composite.webp: every cutout alpha-composited together in
    PRODUCTS order (later on top, matching canvas `source-over` semantics),
    saved as lossy WebP. This is the static "all defined products in their
    real color" layer the app displays by default -- previously built by
    compositing all 42+ full-res cutouts on a <canvas> at every page load
    (~1.3s); now it's just one precomputed image the browser loads like any
    other <img>.

  - data/swatch-colors.js: each product's alpha-weighted average color,
    keyed by id, e.g. `{ "0001": "rgb(120, 45, 60)" }`. Previously computed
    at runtime by drawing each cutout onto a full 5612x3748 canvas and
    reading back the pixel data 42+ times (~5.8s, the dominant cost of
    startup); now a synchronous lookup at init.

Regenerate this any time a cutout is added, replaced, or resized.

Usage:
    python3 tools/build-assets.py

Requires: pip install pillow numpy
"""
import re
from pathlib import Path

import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JS = PROJECT_ROOT / "data" / "products.js"
IDMAP_OUTPUT_PATH = PROJECT_ROOT / "assets" / "id-map.png"
COMPOSITE_OUTPUT_PATH = PROJECT_ROOT / "assets" / "color-composite.webp"
SWATCH_OUTPUT_PATH = PROJECT_ROOT / "data" / "swatch-colors.js"
WIDTH, HEIGHT = 5612, 3748
COMPOSITE_WEBP_QUALITY = 90


def parse_products(js_text):
    """Extract (id, cutout_path) pairs in file order.

    products.js is a plain script, not JSON, so this is a light regex scan
    rather than a real parser -- it relies on every product object having an
    `id: "...."` field followed by a `cutout: "...."` field, which is the
    consistent shape every entry in the file already uses. Commented-out
    entries (e.g. a product temporarily disabled due to a bad cutout) are
    skipped as long as every line of the commented block is prefixed with
    `//`, since the regexes below only match unindented/uncommented field
    syntax as it actually appears in an active object literal.
    """
    ids = re.findall(r'^\s*id:\s*"([^"]+)"', js_text, re.MULTILINE)
    cutouts = re.findall(r'^\s*cutout:\s*"([^"]+)"', js_text, re.MULTILINE)
    if len(ids) != len(cutouts):
        raise ValueError(
            f"Found {len(ids)} product ids but {len(cutouts)} cutout paths -- "
            "products.js doesn't match the expected id/cutout-per-entry shape."
        )
    return list(zip(ids, cutouts))


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


def main():
    products = parse_products(PRODUCTS_JS.read_text())
    print(f"Found {len(products)} products in {PRODUCTS_JS.relative_to(PROJECT_ROOT)}")

    idmap = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)
    composite = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    swatches = {}

    for i, (product_id, cutout_rel_path) in enumerate(products, start=1):
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
        swatches[product_id] = average_color(arr)

        print(f"  #{i:>3} {product_id}  ({cutout_rel_path}): rgb({r},{g},0), {mask.sum()} px, swatch {swatches[product_id]}")

    Image.fromarray(idmap, "RGBA").save(IDMAP_OUTPUT_PATH)
    print(f"Saved {IDMAP_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

    composite.save(COMPOSITE_OUTPUT_PATH, "WEBP", quality=COMPOSITE_WEBP_QUALITY)
    print(f"Saved {COMPOSITE_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")

    lines = [f'  "{pid}": "{color}",' for pid, color in swatches.items()]
    swatch_js = (
        "// Generated by tools/build-assets.py -- do not hand-edit.\n"
        "// Alpha-weighted average color of each product's cutout, keyed by id.\n"
        "const SWATCH_COLORS = {\n" + "\n".join(lines) + "\n};\n"
    )
    SWATCH_OUTPUT_PATH.write_text(swatch_js)
    print(f"Saved {SWATCH_OUTPUT_PATH.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
