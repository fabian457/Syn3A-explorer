(function () {
  const IMAGE_WIDTH = 5612;
  const IMAGE_HEIGHT = 3748;
  const MIN_SEGMENT_WIDTH = 3; // viewBox units
  const TRACK_VIEWBOX_WIDTH = 2000;
  const TRACK_VIEWBOX_HEIGHT = 60;
  const SWATCH_SAMPLE_STRIDE = 4; // sample every 4th pixel when averaging cutout color
  const DIM_WASH_RGB = "10, 10, 14"; // spotlight wash color (r,g,b)
  const DIM_WASH_OPACITY = 0.65;

  const stageEl = document.getElementById("illustration-stage");
  const colorCanvas = document.getElementById("colorCanvas");
  const dimCanvas = document.getElementById("dimCanvas");
  const selectionCanvas = document.getElementById("selectionCanvas");
  const tooltipEl = document.getElementById("tooltip");
  const detailPanel = document.getElementById("detail-panel");
  const detailName = document.getElementById("detail-name");
  const detailFullName = document.getElementById("detail-fullname");
  const detailDescription = document.getElementById("detail-description");
  const detailLociBody = document.getElementById("detail-loci-body");
  const detailLinks = document.getElementById("detail-links");
  const detailClose = document.getElementById("detail-close");
  const trackSvg = document.getElementById("genome-track");

  const colorCtx = colorCanvas.getContext("2d");
  const dimCtx = dimCanvas.getContext("2d");
  const selectionCtx = selectionCanvas.getContext("2d");

  const idMapCanvas = document.createElement("canvas");
  idMapCanvas.width = IMAGE_WIDTH;
  idMapCanvas.height = IMAGE_HEIGHT;
  const idMapCtx = idMapCanvas.getContext("2d", { willReadFrequently: true });

  let hoveredProductId = null;
  let selectedProductId = null;

  const cutoutImages = {};

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  }

  function computeSwatchColor(imageData) {
    const data = imageData.data;
    const stride = 4 * SWATCH_SAMPLE_STRIDE;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += stride) {
      if (data[i + 3] > 0) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    if (n === 0) return "#999999";
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
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

  function computeSwatchColors() {
    const scratch = document.createElement("canvas");
    scratch.width = IMAGE_WIDTH;
    scratch.height = IMAGE_HEIGHT;
    const scratchCtx = scratch.getContext("2d", { willReadFrequently: true });

    PRODUCTS.forEach((product) => {
      const img = cutoutImages[product.id];
      scratchCtx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
      scratchCtx.drawImage(img, 0, 0);
      product.swatchColor = computeSwatchColor(
        scratchCtx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
      );
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

  // Composited once at init: every defined product's cutout drawn in its real
  // color, permanently, so the illustration shows all clickable products by
  // default rather than needing hover to reveal them one at a time.
  function buildColorLayer() {
    colorCtx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    PRODUCTS.forEach((product) => {
      const img = cutoutImages[product.id];
      if (img) colorCtx.drawImage(img, 0, 0);
    });
  }

  // Redrawn only when the active (hover-or-selection) product changes: washes
  // the whole canvas, then punches a transparent hole exactly over that
  // product's own silhouette, revealing colorCanvas beneath it undimmed while
  // everything else visible stays washed out — the "spotlight" effect.
  function updateDimOverlay() {
    dimCtx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    const activeId = hoveredProductId || selectedProductId;
    if (!activeId) return;

    dimCtx.fillStyle = `rgba(${DIM_WASH_RGB}, ${DIM_WASH_OPACITY})`;
    dimCtx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    const img = cutoutImages[activeId];
    if (img) {
      dimCtx.globalCompositeOperation = "destination-out";
      dimCtx.drawImage(img, 0, 0);
      dimCtx.globalCompositeOperation = "source-over"; // reset for next call
    }
  }

  function redrawSelectionLayer() {
    drawProductOnCanvas(selectionCtx, selectionCanvas, selectedProductId);
  }

  function setHovered(id) {
    if (id === hoveredProductId) return;
    hoveredProductId = id;
    updateDimOverlay();
    updateTrackEmphasis();
    updateDetailPanel();
  }

  function selectProduct(id) {
    selectedProductId = id;
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

  function showTooltip(product, clientX, clientY) {
    tooltipEl.textContent = product.displayName;
    tooltipEl.classList.remove("hidden");
    moveTooltip(clientX, clientY);
  }

  function moveTooltip(clientX, clientY) {
    tooltipEl.style.left = `${clientX + 16}px`;
    tooltipEl.style.top = `${clientY + 16}px`;
  }

  function hideTooltip() {
    tooltipEl.classList.add("hidden");
  }

  function onStageMove(e) {
    const { x, y } = cssToImageCoords(e.clientX, e.clientY);
    const product = getProductAtPixel(x, y);
    setHovered(product ? product.id : null);
    if (product) {
      showTooltip(product, e.clientX, e.clientY);
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
    const activeId = hoveredProductId || selectedProductId;
    trackSvg.classList.toggle("has-active", !!activeId);
    trackSvg.querySelectorAll(".track-segment").forEach((seg) => {
      seg.classList.toggle("active", seg.dataset.productId === activeId);
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
    showTooltip(product, e.clientX, e.clientY);
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
    await Promise.all([
      loadIdMap(),
      ...PRODUCTS.map(async (product) => {
        cutoutImages[product.id] = await loadImage(product.cutout);
      }),
    ]);

    computeSwatchColors();
    buildColorLayer();
    buildGenomeTrack();
    attachEventListeners();

    syncPanelHeight();
    new ResizeObserver(syncPanelHeight).observe(stageEl);
  }

  init();
})();
