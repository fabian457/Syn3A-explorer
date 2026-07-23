#!/usr/bin/env python3
"""
Sanity-checks data/products.js against the actual cutout files and the
genome coordinate range, independent of id-map generation.

Catches the mistakes that are easy to make by hand once PRODUCTS has
hundreds of entries: a cutout path that doesn't exist, a blank cutout, a
duplicate id, the same locus copy-pasted into two different products, or
a locus's coordinates outside the genome / with start >= end.

This does not modify anything -- it only reports problems.

products.js is parsed by actually running it in Node (see
tools/parse-products.js) rather than approximating its structure with
regex -- real evaluation can't be fooled by a string containing a stray
brace or a field appearing in an unexpected order.

Usage:
    python3 tools/validate-products.py

Requires: pip install pillow numpy; a `node` binary on PATH
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PARSE_SCRIPT = PROJECT_ROOT / "tools" / "parse-products.js"
WIDTH, HEIGHT = 5612, 3748


def load_products():
    result = subprocess.run(
        ["node", str(PARSE_SCRIPT)],
        capture_output=True, text=True, check=True,
    )
    data = json.loads(result.stdout)
    return data["genomeLengthBp"], data["products"]


def main():
    genome_length, raw_products = load_products()
    products = [
        {
            "id": p.get("id"),
            "displayName": p.get("displayName"),
            "cutout": p.get("cutout"),
            "loci": [
                {
                    "locusTag": l.get("locusTag"),
                    "start": l.get("start"),
                    "end": l.get("end"),
                    "strand": l.get("strand"),
                }
                for l in p.get("loci", [])
            ],
        }
        for p in raw_products
    ]
    print(f"Checking {len(products)} products against genome length {genome_length} bp...\n")

    errors = []

    seen_ids = {}
    seen_cutouts = {}
    seen_locus_tags = {}
    warnings = []

    for p in products:
        label = p["id"] or p["displayName"] or "<unknown product>"

        if not p["id"]:
            errors.append(f"{label}: missing id")
        elif p["id"] in seen_ids:
            errors.append(f"id {p['id']!r}: duplicated (also used by {seen_ids[p['id']]!r})")
        else:
            seen_ids[p["id"]] = label

        if not p["cutout"]:
            errors.append(f"{label}: missing cutout path")
        else:
            if p["cutout"] in seen_cutouts:
                errors.append(
                    f"cutout {p['cutout']!r}: used by both {seen_cutouts[p['cutout']]!r} and {label!r}"
                )
            else:
                seen_cutouts[p["cutout"]] = label

            path = PROJECT_ROOT / p["cutout"]
            if not path.exists():
                errors.append(f"{label}: cutout file not found at {p['cutout']}")
            else:
                img = Image.open(path).convert("RGBA")
                if img.size != (WIDTH, HEIGHT):
                    errors.append(
                        f"{label}: {p['cutout']} is {img.size}, expected {(WIDTH, HEIGHT)}"
                    )
                arr = np.array(img)
                if not (arr[:, :, 3] > 0).any():
                    errors.append(f"{label}: {p['cutout']} is fully transparent (blank cutout)")

        for locus in p["loci"]:
            tag = locus["locusTag"]
            if tag:
                if tag in seen_locus_tags and seen_locus_tags[tag] != label:
                    # Not necessarily a mistake -- a component can legitimately
                    # be shared between a larger assembly and its own
                    # free-floating copy elsewhere (see CLAUDE.md). Surfaced
                    # as a warning to glance at, not a failure.
                    warnings.append(
                        f"locus {tag}: appears in both {seen_locus_tags[tag]!r} and {label!r}"
                    )
                else:
                    seen_locus_tags[tag] = label

            start, end = locus["start"], locus["end"]
            if start is not None and end is not None:
                if start >= end:
                    errors.append(f"{label}/{tag}: start ({start}) >= end ({end})")
                if not (1 <= start <= genome_length) or not (1 <= end <= genome_length):
                    errors.append(
                        f"{label}/{tag}: coordinates {start}-{end} outside genome range 1-{genome_length}"
                    )

            if locus["strand"] not in (None, "+", "-"):
                errors.append(f"{label}/{tag}: strand {locus['strand']!r} is not '+', '-', or null")

    if warnings:
        print(f"{len(warnings)} warning(s) (review, but non-fatal):\n")
        for w in warnings:
            print(f"  - {w}")
        print()

    if errors:
        print(f"Found {len(errors)} problem(s):\n")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("All checks passed.")


if __name__ == "__main__":
    main()
