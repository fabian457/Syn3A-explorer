(function () {
  const IMAGE_WIDTH = 5612;
  const IMAGE_HEIGHT = 3748;
  const MIN_SEGMENT_WIDTH = 3; // viewBox units
  const TRACK_VIEWBOX_WIDTH = 2000;
  const TRACK_VIEWBOX_HEIGHT = 60;
  const DIM_WASH_RGB = "10, 10, 14"; // spotlight wash color (r,g,b)
  const DIM_WASH_OPACITY = 0.65;
  const NARRATIVE_SEGMENT_FILL = "#c0398f"; // magenta, matching the rRNA being produced

  const stageEl = document.getElementById("illustration-stage");
  const dimCanvas = document.getElementById("dimCanvas");
  const selectionCanvas = document.getElementById("selectionCanvas");
  const tooltipEl = document.getElementById("tooltip");
  const detailPanel = document.getElementById("detail-panel");
  const detailName = document.getElementById("detail-name");
  const detailFullName = document.getElementById("detail-fullname");
  const detailDescription = document.getElementById("detail-description");
  const detailLociHeading = document.getElementById("detail-loci-heading");
  const detailLociTable = document.getElementById("detail-loci-table");
  const detailLociBody = document.getElementById("detail-loci-body");
  const detailRelatedHeading = document.getElementById("detail-related-heading");
  const detailRelated = document.getElementById("detail-related");
  const detailLinks = document.getElementById("detail-links");
  const detailClose = document.getElementById("detail-close");
  const detailNarratives = document.getElementById("detail-narratives");
  const detailNarrativesList = document.getElementById("detail-narratives-list");
  const detailNarrativeToggle = document.getElementById("detail-narrative-toggle");
  const detailComponentsList = document.getElementById("detail-components-list");
  const trackSvg = document.getElementById("genome-track");

  const dimCtx = dimCanvas.getContext("2d");
  const selectionCtx = selectionCanvas.getContext("2d");

  const idMapCanvas = document.createElement("canvas");
  idMapCanvas.width = IMAGE_WIDTH;
  idMapCanvas.height = IMAGE_HEIGHT;
  const idMapCtx = idMapCanvas.getContext("2d", { willReadFrequently: true });

  let hoveredProductId = null;
  let selectedProductId = null;
  // A narrative (Goodsell's Fig. 2 "story" scenes) is a separate, mutually-exclusive
  // mode from product hover/selection: at most one narrative is active at a time, and
  // activating one clears any product selection (and vice versa). See NARRATIVES in
  // data/products.js.
  let activeNarrativeId = null;
  // A narrative has two views (only meaningful while activeNarrativeId is set):
  //   "scene"      — the traced Goodsell cutout as a spotlight overlay.
  //   "components" — that scene dropped, its real molecular components spotlighted
  //                  in place (membrane-style) and listed clickably in the panel.
  let narrativeView = "scene";

  const cutoutImages = {};
  const cutoutLoadPromises = {};

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function getNarrative(id) {
    if (typeof NARRATIVES === "undefined") return null;
    return NARRATIVES.find((n) => n.id === id) || null;
  }

  // The active (hover-or-selection) product, plus any products it declares
  // as `relatedProductIds` (e.g. the membrane lists the enzymes that build
  // it) — everything in this set gets spotlighted together in the
  // illustration and highlighted together on the genome track. One-way:
  // a related product's own loci don't reference back to the membrane, so
  // hovering e.g. PlsY on its own still only highlights itself.
  function getActiveIds() {
    const activeId = hoveredProductId || selectedProductId;
    if (activeId) {
      const product = getProduct(activeId);
      const related = (product && product.relatedProductIds) || [];
      return [activeId, ...related];
    }
    // Narrative "components view": with nothing hovered/selected, the active set is
    // the narrative's component products. Feeding them through getActiveIds() lets
    // updateDimOverlay()/updateTrackEmphasis() spotlight them exactly as they do the
    // membrane's related enzymes — no bespoke rendering path needed.
    if (activeNarrativeId && narrativeView === "components") {
      const narrative = getNarrative(activeNarrativeId);
      return (narrative && narrative.relatedProductIds) || [];
    }
    return [];
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  }

  // Loads a product's cutout on first hover/select rather than all of them
  // eagerly at init — most of the 42+ cutouts are never needed in a given
  // visit, and this keeps them off the initial-load critical path entirely.
  // updateDimOverlay()/redrawSelectionLayer() already no-op safely if the
  // image isn't loaded yet, so this just needs to kick off the load and,
  // once it arrives, redraw if this product is still the active one.
  function ensureCutoutLoaded(id) {
    if (!id || cutoutImages[id] || cutoutLoadPromises[id]) return;
    const product = getProduct(id);
    if (!product) return;
    // A null cutout means the source illustration doesn't depict this gene at
    // all ("not shown" in the paper) — there's no file to fetch. Without this,
    // loadImage(null) sets img.src = "null", the browser requests a bogus URL,
    // and the 404 rejects a promise nobody catches.
    if (!product.cutout) return;
    cutoutLoadPromises[id] = loadImage(product.cutout).then((img) => {
      cutoutImages[id] = img;
      if (getActiveIds().includes(id)) {
        updateDimOverlay();
        if (id === selectedProductId) redrawSelectionLayer();
      }
    });
  }

  // Narrative cutouts load on demand just like product ones and share the same
  // cutoutImages cache (narrative ids won't collide with product ids). Once the
  // image arrives, repaint the selection layer if this narrative is still active.
  function ensureNarrativeCutoutLoaded(id) {
    if (!id || cutoutImages[id] || cutoutLoadPromises[id]) return;
    const narrative = getNarrative(id);
    if (!narrative || !narrative.cutout) return;
    cutoutLoadPromises[id] = loadImage(narrative.cutout).then((img) => {
      cutoutImages[id] = img;
      if (id === activeNarrativeId) redrawSelectionLayer();
    });
  }

  // Hit-testing is driven entirely by assets/id-map.png: a reference image, the
  // same dimensions as the illustration, where each product's silhouette is
  // filled with a solid ID color (R = index & 0xff, G = index >> 8, B = 0 —
  // product 1 = #010000, product 2 = #020000, ...) and everything else is
  // transparent. It's generated from the cutouts but then edited/fixed by hand
  // as needed, not regenerated from the cutouts at runtime — hand-fixing gaps
  // or edges just means editing that one file directly.
  function loadIdMap() {
    return loadImage("assets/id-map.png").then((img) => {
      idMapCtx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
      idMapCtx.drawImage(img, 0, 0);
    });
  }

  function getProductAtPixel(x, y) {
    const data = idMapCtx.getImageData(x, y, 1, 1).data;
    if (data[3] === 0) return null;
    const encodeId = data[0] | (data[1] << 8);
    return PRODUCTS[encodeId - 1] || null;
  }

  function cssToImageCoords(clientX, clientY) {
    const rect = stageEl.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) * (IMAGE_WIDTH / rect.width));
    const y = Math.floor((clientY - rect.top) * (IMAGE_HEIGHT / rect.height));
    return {
      x: Math.min(Math.max(x, 0), IMAGE_WIDTH - 1),
      y: Math.min(Math.max(y, 0), IMAGE_HEIGHT - 1),
    };
  }

  function drawImageOnCanvas(ctx, canvas, img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img) ctx.drawImage(img, 0, 0);
  }

  function drawProductOnCanvas(ctx, canvas, productId) {
    drawImageOnCanvas(ctx, canvas, productId ? cutoutImages[productId] : null);
  }

  // Redrawn only when the active (hover-or-selection) product changes: washes
  // the whole canvas, then punches a transparent hole exactly over the
  // active product's own silhouette — and, if it declares any
  // `relatedProductIds`, over each of theirs too — revealing #colorImg
  // beneath undimmed while everything else visible stays washed out (the
  // "spotlight" effect). Cutouts not yet loaded are silently skipped;
  // ensureCutoutLoaded()'s callback re-runs this once they arrive.
  function updateDimOverlay() {
    dimCtx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    // Narrative SCENE view: wash the whole illustration dark with NO hole punched.
    // Unlike a product spotlight (which reveals #colorImg through the hole), a
    // narrative scene isn't in the color composite — its brightness comes from its
    // cutout painted on top via the selection layer (redrawSelectionLayer), which
    // sits above this canvas. (Components view falls through to the normal spotlight
    // path below, since getActiveIds() then returns the component products.)
    if (activeNarrativeId && narrativeView === "scene") {
      dimCtx.fillStyle = `rgba(${DIM_WASH_RGB}, ${DIM_WASH_OPACITY})`;
      dimCtx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
      return;
    }

    // Only products that actually have a silhouette can be spotlighted. One
    // whose `cutout` is null isn't drawn in the illustration at all ("not
    // shown" in the paper) — it has real loci and a genome-track segment, but
    // no shape anywhere on the canvas. Washing everything 65% dark and then
    // punching no hole would black out the whole image and read as a rendering
    // bug, so leave it alone; the track highlight and detail panel still
    // respond, so the hover isn't silent. Filtered on `product.cutout` rather
    // than on `cutoutImages[id]` deliberately: the latter is also empty for a
    // real cutout that simply hasn't finished loading, and those should still
    // get the wash now and their hole punched a moment later.
    const activeIds = getActiveIds().filter((id) => {
      const product = getProduct(id);
      return Boolean(product && product.cutout);
    });
    if (activeIds.length === 0) return;

    dimCtx.fillStyle = `rgba(${DIM_WASH_RGB}, ${DIM_WASH_OPACITY})`;
    dimCtx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    dimCtx.globalCompositeOperation = "destination-out";
    activeIds.forEach((id) => {
      const img = cutoutImages[id];
      if (img) dimCtx.drawImage(img, 0, 0);
    });
    dimCtx.globalCompositeOperation = "source-over"; // reset for next call
  }

  function redrawSelectionLayer() {
    // In the narrative SCENE view the selection layer carries the traced scene
    // (drawn bright on top of the dim wash). In components view there's no scene —
    // the components show via dim-overlay holes — so this falls through and clears
    // the layer (selectedProductId is null while a narrative is active).
    if (activeNarrativeId && narrativeView === "scene") {
      drawImageOnCanvas(selectionCtx, selectionCanvas, cutoutImages[activeNarrativeId]);
      return;
    }
    drawProductOnCanvas(selectionCtx, selectionCanvas, selectedProductId);
  }

  function setHovered(id) {
    // The narrative SCENE view owns the whole illustration, so ignore hover there.
    // In components view the real molecules are on show, so hover works normally.
    if (activeNarrativeId && narrativeView === "scene") return;
    if (id === hoveredProductId) return;
    hoveredProductId = id;
    getActiveIds().forEach(ensureCutoutLoaded);
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
  }

  function selectProduct(id) {
    // Selecting a product exits narrative mode (the two are mutually exclusive).
    activeNarrativeId = null;
    selectedProductId = id;
    getActiveIds().forEach(ensureCutoutLoaded);
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
    updateNarrativeList();
  }

  function deselectProduct() {
    if (selectedProductId === null) return;
    selectedProductId = null;
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
  }

  function activateNarrative(id) {
    if (!getNarrative(id)) return;
    // Narrative mode is exclusive with product hover/selection — clear both first.
    hoveredProductId = null;
    selectedProductId = null;
    activeNarrativeId = id;
    narrativeView = "scene"; // always open on the traced scene
    ensureNarrativeCutoutLoaded(id);
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
    updateNarrativeList();
    hideTooltip();

    // Warm the component cutouts in the background while the user reads the scene,
    // so switching to the components view is instant instead of waiting on ~12
    // full-res PNGs to fetch, decode, and composite one-by-one on click. In scene
    // view these ids aren't in getActiveIds(), so ensureCutoutLoaded()'s callback
    // populates the cache quietly without triggering any redraw.
    const narrative = getNarrative(id);
    (narrative.relatedProductIds || []).forEach(ensureCutoutLoaded);
  }

  function deactivateNarrative() {
    if (activeNarrativeId === null) return;
    activeNarrativeId = null;
    narrativeView = "scene";
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
    updateNarrativeList();
  }

  // Switches between the two narrative views without leaving the narrative. Both
  // repaint all layers; the shared cutout loader fills in any not-yet-loaded images
  // and re-applies the effect on arrival (see ensure*CutoutLoaded).
  function setNarrativeView(view) {
    if (!activeNarrativeId || narrativeView === view) return;
    narrativeView = view;
    hoveredProductId = null;
    if (view === "components") {
      getActiveIds().forEach(ensureCutoutLoaded); // load the component cutouts
    } else {
      ensureNarrativeCutoutLoaded(activeNarrativeId);
    }
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
    hideTooltip();
  }

  function toggleNarrative(id) {
    if (activeNarrativeId === id) {
      deactivateNarrative();
    } else {
      activateNarrative(id);
    }
  }

  // Single "return to empty" gesture used by the close button, Esc, and clicking
  // empty illustration space — whichever mode is active gets cleared.
  function closeActive() {
    if (activeNarrativeId) {
      deactivateNarrative();
    } else {
      deselectProduct();
    }
  }

  function showTooltip(product, pageX, pageY) {
    tooltipEl.textContent = product.displayName;
    tooltipEl.classList.remove("hidden");
    moveTooltip(pageX, pageY);
  }

  // pageX/pageY (document-relative), not clientX/clientY (viewport-relative)
  // — see the .tooltip comment in styles.css for why this matters under
  // pinch-zoom.
  function moveTooltip(pageX, pageY) {
    tooltipEl.style.left = `${pageX + 16}px`;
    tooltipEl.style.top = `${pageY + 16}px`;
  }

  function hideTooltip() {
    tooltipEl.classList.add("hidden");
  }

  function onStageMove(e) {
    // Scene view: don't hover-preview or tooltip molecules under the cursor
    // (setHovered is also guarded; this additionally stops the tooltip). Components
    // view leaves hover on so the spotlighted molecules stay interactive.
    if (activeNarrativeId && narrativeView === "scene") return;
    const { x, y } = cssToImageCoords(e.clientX, e.clientY);
    const product = getProductAtPixel(x, y);
    setHovered(product ? product.id : null);
    if (product) {
      showTooltip(product, e.pageX, e.pageY);
    } else {
      hideTooltip();
    }
  }

  function onStageLeave() {
    setHovered(null);
    hideTooltip();
  }

  function onStageClick(e) {
    const { x, y } = cssToImageCoords(e.clientX, e.clientY);
    const product = getProductAtPixel(x, y);
    if (product) {
      selectProduct(product.id);
    } else {
      closeActive();
    }
  }

  function bpToX(bp) {
    return (bp / GENOME_LENGTH_BP) * TRACK_VIEWBOX_WIDTH;
  }

  function buildGenomeTrack() {
    const ns = "http://www.w3.org/2000/svg";
    trackSvg.setAttribute("viewBox", `0 0 ${TRACK_VIEWBOX_WIDTH} ${TRACK_VIEWBOX_HEIGHT}`);

    const baseline = document.createElementNS(ns, "rect");
    baseline.setAttribute("class", "track-baseline");
    baseline.setAttribute("x", "0");
    baseline.setAttribute("y", "0");
    baseline.setAttribute("width", String(TRACK_VIEWBOX_WIDTH));
    baseline.setAttribute("height", String(TRACK_VIEWBOX_HEIGHT));
    trackSvg.appendChild(baseline);

    PRODUCTS.forEach((product) => {
      product.loci.forEach((locus) => {
        if (locus.start == null || locus.end == null) return;
        const x1 = bpToX(locus.start);
        const x2 = bpToX(locus.end);
        const width = Math.max(MIN_SEGMENT_WIDTH, x2 - x1);

        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("class", "track-segment");
        rect.setAttribute("data-product-id", product.id);
        rect.setAttribute("x", String(x1));
        rect.setAttribute("y", "8");
        rect.setAttribute("width", String(width));
        rect.setAttribute("height", String(TRACK_VIEWBOX_HEIGHT - 16));
        rect.setAttribute("fill", product.swatchColor || "#999");
        trackSvg.appendChild(rect);
      });
    });

    // Narrative operon segments: one rect per narrative locus, keyed by
    // data-narrative-id, hidden until that narrative is active (see
    // updateTrackEmphasis). They're indicators only — .narrative-segment is
    // pointer-events:none, so they never resolve as a clickable product.
    (typeof NARRATIVES !== "undefined" ? NARRATIVES : []).forEach((narrative) => {
      (narrative.loci || []).forEach((locus) => {
        if (locus.start == null || locus.end == null) return;
        const x1 = bpToX(locus.start);
        const x2 = bpToX(locus.end);
        const width = Math.max(MIN_SEGMENT_WIDTH, x2 - x1);

        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("class", "track-segment narrative-segment");
        rect.setAttribute("data-narrative-id", narrative.id);
        rect.setAttribute("x", String(x1));
        rect.setAttribute("y", "8");
        rect.setAttribute("width", String(width));
        rect.setAttribute("height", String(TRACK_VIEWBOX_HEIGHT - 16));
        rect.setAttribute("fill", NARRATIVE_SEGMENT_FILL);
        rect.style.display = "none";
        trackSvg.appendChild(rect);
      });
    });
  }

  function updateTrackEmphasis() {
    const activeIds = new Set(getActiveIds());
    // The magenta operon segment belongs to SCENE view; in components view the
    // component products' own segments light up instead (via activeIds below).
    const sceneView = Boolean(activeNarrativeId) && narrativeView === "scene";
    trackSvg.classList.toggle("has-active", activeIds.size > 0 || sceneView);

    trackSvg.querySelectorAll(".track-segment:not(.narrative-segment)").forEach((seg) => {
      seg.classList.toggle("active", activeIds.has(seg.dataset.productId));
    });

    // Narrative operon segments show (and count as active) only in the scene view of
    // the currently active narrative; everything else stays hidden.
    trackSvg.querySelectorAll(".narrative-segment").forEach((seg) => {
      const on = sceneView && seg.dataset.narrativeId === activeNarrativeId;
      seg.classList.toggle("active", on);
      seg.style.display = on ? "" : "none";
    });
  }

  function onTrackMove(e) {
    if (activeNarrativeId && narrativeView === "scene") return; // scene view suppresses hover/tooltip
    const seg = e.target.closest(".track-segment");
    if (!seg) {
      setHovered(null);
      hideTooltip();
      return;
    }
    const product = getProduct(seg.dataset.productId);
    setHovered(product.id);
    showTooltip(product, e.pageX, e.pageY);
  }

  function onTrackLeave() {
    setHovered(null);
    hideTooltip();
  }

  function onTrackClick(e) {
    const seg = e.target.closest(".track-segment");
    if (!seg) {
      closeActive();
      return;
    }
    selectProduct(seg.dataset.productId);
  }

  function getActiveProduct() {
    return getProduct(hoveredProductId) || getProduct(selectedProductId) || null;
  }

  // Fills the detail panel's Loci table body from a loci array. Shared by the
  // product and narrative panels.
  function fillLociTable(loci) {
    detailLociBody.innerHTML = "";
    loci.forEach((locus) => {
      const tr = document.createElement("tr");
      const coords =
        locus.start != null && locus.end != null
          ? `${locus.start}–${locus.end} (${locus.strand || "?"})`
          : "—";
      const tdLocus = document.createElement("td");
      tdLocus.textContent = locus.locusTag;
      const tdGene = document.createElement("td");
      tdGene.textContent = locus.gene || "—";
      const tdCoords = document.createElement("td");
      tdCoords.textContent = coords;
      tr.append(tdLocus, tdGene, tdCoords);
      detailLociBody.appendChild(tr);
    });
  }

  // Fills the detail panel's external-links list. Shared by both panels.
  function fillLinks(links) {
    detailLinks.innerHTML = "";
    (links || []).forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = link.label;
      li.appendChild(a);
      detailLinks.appendChild(li);
    });
  }

  // Fills a list element with clickable related-product entries — `displayName
  // (locusTags)`, each selecting that product on click, with its description as a
  // muted role line. Shared by the product "Built by" list and the narrative
  // components list.
  function fillRelatedList(listEl, ids) {
    listEl.innerHTML = "";
    (ids || []).forEach((relatedId) => {
      const relatedProduct = getProduct(relatedId);
      if (!relatedProduct) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      const locusTags = relatedProduct.loci.map((l) => l.locusTag).join(", ");
      a.textContent = locusTags
        ? `${relatedProduct.displayName} (${locusTags})`
        : relatedProduct.displayName;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        selectProduct(relatedId);
      });
      li.appendChild(a);
      if (relatedProduct.description) {
        const role = document.createElement("p");
        role.className = "detail-related-role";
        role.textContent = relatedProduct.description;
        li.appendChild(role);
      }
      listEl.appendChild(li);
    });
  }

  // Panel state 3: a narrative is active. Shows its title/description/loci with a
  // close control, no "Built by", and the magenta narrative accent — plus a
  // scene⇄components toggle and, in components view, the clickable components list.
  function renderNarrativePanel(narrative) {
    if (!narrative) {
      detailPanel.classList.add("is-empty");
      detailPanel.style.removeProperty("--accent");
      return;
    }

    const componentsView = narrativeView === "components";

    detailPanel.classList.remove("is-empty");
    detailClose.style.display = "";

    detailName.textContent = narrative.title;
    detailFullName.textContent = componentsView ? "Narrative · components" : "Narrative";
    detailDescription.textContent = narrative.description || "No description yet.";
    detailDescription.classList.toggle("placeholder", !narrative.description);

    const loci = narrative.loci || [];
    const hasLoci = loci.length > 0;
    detailLociHeading.style.display = hasLoci ? "" : "none";
    detailLociTable.style.display = hasLoci ? "" : "none";
    fillLociTable(loci);

    // Narratives never use the product "Built by" list.
    detailRelatedHeading.style.display = "none";
    detailRelated.style.display = "none";
    detailRelated.innerHTML = "";

    // Scene ⇄ components toggle, and the components list (components view only).
    // Explicit "block" (not "") — these default to `display:none` in the stylesheet,
    // so clearing the inline style would let that hide them again.
    const components = narrative.relatedProductIds || [];
    if (components.length > 0) {
      detailNarrativeToggle.style.display = "block";
      detailNarrativeToggle.textContent = componentsView ? "← Back to scene" : "See components →";
    }
    if (componentsView && components.length > 0) {
      detailComponentsList.style.display = "block";
      fillRelatedList(detailComponentsList, components);
    }

    fillLinks(narrative.links);

    detailPanel.style.setProperty("--accent", NARRATIVE_SEGMENT_FILL);
  }

  function updateDetailPanel() {
    // These narrative-only controls are hidden by default; renderNarrativePanel
    // re-shows them as the view requires. Resetting up front stops them leaking into
    // the product/empty panels (e.g. when hovering a molecule in components view).
    detailNarrativeToggle.style.display = "none";
    detailComponentsList.style.display = "none";

    // State 3: a narrative is active AND nothing is being hover-previewed. (In
    // components view, hovering a lit molecule falls through to its product panel.)
    if (activeNarrativeId && !hoveredProductId) {
      renderNarrativePanel(getNarrative(activeNarrativeId));
      return;
    }

    const product = getActiveProduct();

    // State 1: nothing active — the empty state (CSS reveals the Narratives picker).
    if (!product) {
      detailPanel.classList.add("is-empty");
      detailPanel.style.removeProperty("--accent");
      return;
    }

    // Only show the close/deselect control when the panel is displaying the
    // actual persisted selection, not a transient hover preview of something else.
    const showCloseButton = Boolean(selectedProductId) && (!hoveredProductId || hoveredProductId === selectedProductId);

    detailPanel.classList.remove("is-empty");
    detailClose.style.display = showCloseButton ? "" : "none";

    detailName.textContent = product.displayName;
    detailFullName.textContent = product.fullName;
    detailDescription.textContent = product.description || "No description yet.";
    detailDescription.classList.toggle("placeholder", !product.description);

    // Structural products like the membrane aren't gene-encoded themselves
    // (empty loci) — hide the Loci table entirely rather than show an
    // empty one.
    const hasLoci = product.loci.length > 0;
    detailLociHeading.style.display = hasLoci ? "" : "none";
    detailLociTable.style.display = hasLoci ? "" : "none";
    fillLociTable(product.loci);

    // "Built by" — the products this one declares as relatedProductIds
    // (e.g. the membrane lists the enzymes that build it), each clickable
    // to jump straight to that product.
    const relatedIds = product.relatedProductIds || [];
    detailRelatedHeading.style.display = relatedIds.length > 0 ? "" : "none";
    detailRelated.style.display = relatedIds.length > 0 ? "" : "none";
    fillRelatedList(detailRelated, relatedIds);

    fillLinks(product.links);

    detailPanel.style.setProperty("--accent", product.swatchColor || "#999");
  }

  // Builds the Narratives picker (in the panel's empty state) from NARRATIVES.
  // Hidden entirely if there are none.
  function buildNarratives() {
    const narratives = typeof NARRATIVES !== "undefined" ? NARRATIVES : [];
    if (narratives.length === 0) {
      if (detailNarratives) detailNarratives.style.display = "none";
      return;
    }
    detailNarrativesList.innerHTML = "";
    narratives.forEach((narrative) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.narrativeId = narrative.id;
      a.textContent = narrative.title;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        toggleNarrative(narrative.id);
      });
      li.appendChild(a);
      detailNarrativesList.appendChild(li);
    });
  }

  function updateNarrativeList() {
    detailNarrativesList.querySelectorAll("a[data-narrative-id]").forEach((a) => {
      const on = a.dataset.narrativeId === activeNarrativeId;
      a.classList.toggle("active", on);
      if (on) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  function attachEventListeners() {
    stageEl.addEventListener("mousemove", onStageMove);
    stageEl.addEventListener("mouseleave", onStageLeave);
    stageEl.addEventListener("click", onStageClick);

    trackSvg.addEventListener("mousemove", onTrackMove);
    trackSvg.addEventListener("mouseleave", onTrackLeave);
    trackSvg.addEventListener("click", onTrackClick);

    detailClose.addEventListener("click", closeActive);

    detailNarrativeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      setNarrativeView(narrativeView === "components" ? "scene" : "components");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeActive();
    });
  }

  // Keeps the detail panel's height matched to the illustration's rendered
  // height (which is driven purely by its own aspect ratio + available width),
  // so the panel never changes the page layout regardless of its content —
  // long content scrolls internally instead (see .detail-panel's overflow-y).
  function syncPanelHeight() {
    detailPanel.style.height = `${stageEl.getBoundingClientRect().height}px`;
  }

  async function init() {
    await loadIdMap(); // hit-testing needs this before mousemove/click can resolve a product

    // #baseImg and #colorImg load and paint on their own via normal <img>
    // loading, independent of this async chain. Individual per-product
    // cutouts (needed only for the hover/selection spotlight effects) load
    // lazily on demand via ensureCutoutLoaded(), not here.
    PRODUCTS.forEach((product) => {
      product.swatchColor = SWATCH_COLORS[product.id] || "#999999";
    });

    buildGenomeTrack();
    buildNarratives();
    attachEventListeners();

    syncPanelHeight();
    new ResizeObserver(syncPanelHeight).observe(stageEl);
  }

  init();
})();
