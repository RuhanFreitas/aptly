/**
 * Turn a rendered DOM node into a downloadable, multi-page PDF.
 *
 * The adapted reading is rich Markdown/HTML, so instead of dumping raw text we
 * rasterize the element the user is actually looking at and lay it out across
 * A4 pages. Libraries are imported dynamically so they stay out of the initial
 * bundle and never run during server-side rendering.
 *
 * Note: this project uses Tailwind v4, whose `oklch()` colors break the classic
 * `html2canvas`. We use the `html2canvas-pro` fork, which understands modern
 * CSS color functions.
 */
export async function downloadNodeAsPdf(
  node: HTMLElement,
  filename: string,
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    // Import the browser ESM build explicitly. The bare "jspdf" specifier
    // resolves to the Node build under Next's SSR bundling, which pulls in
    // fflate's eval-based web worker and fails with "Can't resolve <dynamic>".
    import("jspdf/dist/jspdf.es.min.js") as Promise<typeof import("jspdf")>,
  ]);

  const canvas = await html2canvas(node, {
    // Render at 2x for crisp text on the page.
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 36; // 0.5in margins
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  // How many source (canvas) pixels fit on one page once scaled to fit width.
  const ratio = usableWidth / canvas.width;
  const pageHeightInCanvasPx = Math.floor(usableHeight / ratio);

  let renderedPx = 0;
  let pageIndex = 0;

  while (renderedPx < canvas.height) {
    const sliceHeight = Math.min(
      pageHeightInCanvasPx,
      canvas.height - renderedPx,
    );

    // Copy one page-worth of the tall canvas onto a temporary canvas.
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      renderedPx,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    const imgData = pageCanvas.toDataURL("image/png");
    const renderedHeight = sliceHeight * ratio;

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, renderedHeight);

    renderedPx += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(filename);
}
