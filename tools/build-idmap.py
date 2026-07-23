#!/usr/bin/env python3
"""
Regenerates assets/id-map.png from the cutouts referenced in data/products.js.

Each product's silhouette (wherever its cutout PNG has any non-transparent
pixel) is filled with a solid ID color encoding its 1-based position in the
PRODUCTS array: R = index & 0xff, G = index >> 8, B = 0 (product 1 = #010000,
product 2 = #020000, ...). Product order -- and therefore the color each
product gets -- is read directly from data/products.js, so this always
matches PRODUCTS order automatically; there's no separate list to keep in
sync by hand.

When two cutouts overlap, whichever product appears later in PRODUCTS wins
the overlapping pixels (later entries are drawn on top) -- put the more
specific product later in the array if that matters for a given overlap.

This only touches the invisible hit-test layer. It does not modify the
cutouts themselves or anything about how they're drawn on hover/selection.

Usage:
    python3 tools/build-idmap.py

Requires: pip install pillow numpy
"""
import re
from pathlib import Path

import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JS = PROJECT_ROOT / "data" / "products.js"
OUTPUT_PATH = PROJECT_ROOT / "assets" / "id-map.png"
WIDTH, HEIGHT = 5612, 3748


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


def main():
    products = parse_products(PRODUCTS_JS.read_text())
    print(f"Found {len(products)} products in {PRODUCTS_JS.relative_to(PROJECT_ROOT)}")

    output = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)

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
        output[mask, 0] = r
        output[mask, 1] = g
        output[mask, 2] = 0
        output[mask, 3] = 255

        print(f"  #{i:>3} {product_id}  ({cutout_rel_path}): rgb({r},{g},0), {mask.sum()} px")

    Image.fromarray(output, "RGBA").save(OUTPUT_PATH)
    print(f"Saved {OUTPUT_PATH.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
