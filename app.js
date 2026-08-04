(function () {
  const IMAGE_WIDTH = 5612;
  const IMAGE_HEIGHT = 3748;
  const MIN_SEGMENT_WIDTH = 3; // viewBox units
  const TRACK_VIEWBOX_WIDTH = 2000;
  const TRACK_VIEWBOX_HEIGHT = 60;
  const DIM_WASH_RGB = "10, 10, 14"; // spotlight wash color (r,g,b)
  const DIM_WASH_OPACITY = 0.65;

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
  const trackSvg = document.getElementById("genome-track");

  const dimCtx = dimCanvas.getContext("2d");
  const selectionCtx = selectionCanvas.getContext("2d");

  const idMapCanvas = document.createElement("canvas");
  idMapCanvas.width = IMAGE_WIDTH;
  idMapCanvas.height = IMAGE_HEIGHT;
  const idMapCtx = idMapCanvas.getContext("2d", { willReadFrequently: true });

  let hoveredProductId = null;
  let selectedProductId = null;

  const cutoutImages = {};
  const cutoutLoadPromises = {};

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  // The active (hover-or-selection) product, plus any products it declares
  // as `relatedProductIds` (e.g. the membrane lists the enzymes that build
  // it) — everything in this set gets spotlighted together in the
  // illustration and highlighted together on the genome track. One-way:
  // a related product's own loci don't reference back to the membrane, so
  // hovering e.g. PlsY on its own still only highlights itself.
  function getActiveIds() {
    const activeId = hoveredProductId || selectedProductId;
    if (!activeId) return [];
    const product = getProduct(activeId);
    const related = (product && product.relatedProductIds) || [];
    return [activeId, ...related];
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
    cutoutLoadPromises[id] = loadImage(product.cutout).then((img) => {
      cutoutImages[id] = img;
      if (getActiveIds().includes(id)) {
        updateDimOverlay();
        if (id === selectedProductId) redrawSelectionLayer();
      }
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

  function drawProductOnCanvas(ctx, canvas, productId) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!productId) return;
    const img = cutoutImages[productId];
    if (img) ctx.drawImage(img, 0, 0);
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
    const activeIds = getActiveIds();
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
    drawProductOnCanvas(selectionCtx, selectionCanvas, selectedProductId);
  }

  function setHovered(id) {
    if (id === hoveredProductId) return;
    hoveredProductId = id;
    getActiveIds().forEach(ensureCutoutLoaded);
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
  }

  function selectProduct(id) {
    selectedProductId = id;
    getActiveIds().forEach(ensureCutoutLoaded);
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
  }

  function deselectProduct() {
    if (selectedProductId === null) return;
    selectedProductId = null;
    redrawSelectionLayer();
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
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
      deselectProduct();
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
  }

  function updateTrackEmphasis() {
    const activeIds = new Set(getActiveIds());
    trackSvg.classList.toggle("has-active", activeIds.size > 0);
    trackSvg.querySelectorAll(".track-segment").forEach((seg) => {
      seg.classList.toggle("active", activeIds.has(seg.dataset.productId));
    });
  }

  function onTrackMove(e) {
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
      deselectProduct();
      return;
    }
    selectProduct(seg.dataset.productId);
  }

  function getActiveProduct() {
    return getProduct(hoveredProductId) || getProduct(selectedProductId) || null;
  }

  function updateDetailPanel() {
    const product = getActiveProduct();

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

    detailLociBody.innerHTML = "";
    product.loci.forEach((locus) => {
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

    // "Built by" — the products this one declares as relatedProductIds
    // (e.g. the membrane lists the enzymes that build it), each clickable
    // to jump straight to that product.
    const relatedIds = product.relatedProductIds || [];
    detailRelatedHeading.style.display = relatedIds.length > 0 ? "" : "none";
    detailRelated.style.display = relatedIds.length > 0 ? "" : "none";
    detailRelated.innerHTML = "";
    relatedIds.forEach((relatedId) => {
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
      detailRelated.appendChild(li);
    });

    detailLinks.innerHTML = "";
    (product.links || []).forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = link.label;
      li.appendChild(a);
      detailLinks.appendChild(li);
    });

    detailPanel.style.setProperty("--accent", product.swatchColor || "#999");
  }

  function attachEventListeners() {
    stageEl.addEventListener("mousemove", onStageMove);
    stageEl.addEventListener("mouseleave", onStageLeave);
    stageEl.addEventListener("click", onStageClick);

    trackSvg.addEventListener("mousemove", onTrackMove);
    trackSvg.addEventListener("mouseleave", onTrackLeave);
    trackSvg.addEventListener("click", onTrackClick);

    detailClose.addEventListener("click", deselectProduct);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") deselectProduct();
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
    attachEventListeners();

    syncPanelHeight();
    new ResizeObserver(syncPanelHeight).observe(stageEl);
  }

  init();
})();
