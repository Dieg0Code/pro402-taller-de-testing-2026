const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function addSurface(slide, SH, x, y, w, h, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.04,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: opts.linePt || 1 },
  });
}

function addSurfaceHeader(slide, SH, x, y, w, text, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h: opts.h || 0.34,
    rectRadius: opts.rectRadius || 0.03,
    fill: { color: opts.fill || TOKENS.softNeutral },
    line: { color: opts.fill || TOKENS.softNeutral },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: (opts.h || 0.34) - 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.fontSize || 9.8,
    bold: true,
    color: opts.color || TOKENS.navy,
    margin: 0,
  });
}

function addExposureCompare(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const leftW = opts.leftW || 3.18;
  const bridgeW = opts.bridgeW || 1.06;
  const gap = opts.gap || 0.22;
  const rightW = w - leftW - bridgeW - gap * 2;
  const panelY = y + 0.6;
  const panelH = h - 1.2;
  const left = opts.left || {};
  const right = opts.right || {};

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Cambio de exposicion", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  addSurface(slide, SH, x + 0.16, panelY, leftW, panelH, {
    fill: left.fill || TOKENS.navy,
    line: left.fill || TOKENS.navy,
  });
  slide.addShape(SH.rect, {
    x: x + 0.3,
    y: panelY + 0.16,
    w: 0.12,
    h: panelH - 0.32,
    fill: { color: left.accent || TOKENS.gold },
    line: { color: left.accent || TOKENS.gold },
  });
  slide.addText(left.label || "En local", {
    x: x + 0.54,
    y: panelY + 0.18,
    w: leftW - 0.74,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 11,
    bold: true,
    color: left.fill ? TOKENS.gold : TOKENS.navy,
    margin: 0,
  });
  slide.addText(left.title || "", {
    x: x + 0.54,
    y: panelY + 0.52,
    w: leftW - 0.74,
    h: 0.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 19,
    bold: true,
    color: TOKENS.white,
    margin: 0,
  });
  slide.addText(left.body || "", {
    x: x + 0.54,
    y: panelY + 1.36,
    w: leftW - 0.74,
    h: panelH - 1.58,
    fontFace: TYPOGRAPHY.body,
    fontSize: left.bodyFontSize || 13.2,
    color: "E7EEF8",
    margin: 0,
  });

  const bridgeX = x + 0.16 + leftW + gap;
  slide.addShape(SH.roundRect, {
    x: bridgeX + 0.1,
    y: panelY + 0.92,
    w: bridgeW - 0.2,
    h: 0.72,
    rectRadius: 0.08,
    fill: { color: TOKENS.warm },
    line: { color: TOKENS.warm },
  });
  slide.addText(opts.bridgeLabel || "Al publicar", {
    x: bridgeX + 0.18,
    y: panelY + 1.1,
    w: bridgeW - 0.36,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.bridgeFontSize || 8.8,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
  });
  slide.addShape(SH.chevron, {
    x: bridgeX + 0.18,
    y: panelY + 1.92,
    w: bridgeW - 0.36,
    h: 0.34,
    fill: { color: opts.bridgeAccent || TOKENS.orange },
    line: { color: opts.bridgeAccent || TOKENS.orange },
  });

  addSurface(slide, SH, bridgeX + bridgeW + gap, panelY, rightW, panelH, {
    fill: right.fill || TOKENS.softBlue,
    line: right.fill || TOKENS.softBlue,
  });
  slide.addShape(SH.rect, {
    x: bridgeX + bridgeW + gap + 0.14,
    y: panelY + 0.16,
    w: 0.12,
    h: panelH - 0.32,
    fill: { color: right.accent || TOKENS.red },
    line: { color: right.accent || TOKENS.red },
  });
  slide.addText(right.label || "Publicado", {
    x: bridgeX + bridgeW + gap + 0.42,
    y: panelY + 0.18,
    w: rightW - 0.58,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 11,
    bold: true,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addText(right.title || "", {
    x: bridgeX + bridgeW + gap + 0.42,
    y: panelY + 0.52,
    w: rightW - 0.58,
    h: 0.54,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  slide.addText(right.body || "", {
    x: bridgeX + bridgeW + gap + 0.42,
    y: panelY + 1.24,
    w: rightW - 0.58,
    h: panelH - 1.46,
    fontFace: TYPOGRAPHY.body,
    fontSize: right.bodyFontSize || 13,
    color: TOKENS.ink,
    margin: 0,
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.42,
      w: w - 0.44,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.34,
      y: y + h - 0.37,
      w: w - 0.68,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }
}

function addChecklistGrid(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const entries = opts.entries || [];
  const cols = Math.max(1, Math.min(3, opts.columns || 2));
  const rows = Math.max(1, Math.ceil(entries.length / cols));
  const gapX = 0.2;
  const gapY = 0.18;
  const footerH = opts.footer ? 0.28 : 0;
  const headerY = y + 0.56;
  const cellY = y + 0.62;
  const cellH = (h - 0.84 - footerH - (rows - 1) * gapY) / rows;
  const cellW = (w - 0.32 - (cols - 1) * gapX) / cols;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Checklist", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  entries.forEach((entry, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cellX = x + 0.16 + col * (cellW + gapX);
    const currentY = headerY + row * (cellH + gapY);
    const accent = entry.accent || TOKENS.red;
    const badgeText = entry.badge || "Revisar";
    const badgeW = Math.min(cellW * 0.34, Math.max(0.42, badgeText.length * 0.06 + 0.1));
    const badgeX = cellX + 0.12;
    const accentX = badgeX + badgeW + 0.14;
    const textX = accentX + 0.22;
    const textW = cellW - (textX - cellX) - 0.14;

    addSurface(slide, SH, cellX, currentY, cellW, cellH, {
      fill: entry.fill || TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.roundRect, {
      x: badgeX,
      y: currentY + 0.14,
      w: badgeW,
      h: 0.24,
      rectRadius: 0.05,
      fill: { color: entry.badgeFill || TOKENS.paleRed },
      line: { color: entry.badgeFill || TOKENS.paleRed },
    });
    slide.addText(badgeText, {
      x: badgeX,
      y: currentY + 0.19,
      w: badgeW,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      bold: true,
      color: accent,
      margin: 0,
      align: "center",
    });
    slide.addShape(SH.rect, {
      x: accentX,
      y: currentY + 0.14,
      w: 0.08,
      h: cellH - 0.28,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(entry.title || "", {
      x: textX,
      y: currentY + 0.16,
      w: textW,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: entry.titleFontSize || 13.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(entry.body || "", {
      x: textX,
      y: currentY + 0.48,
      w: textW,
      h: cellH - 0.64,
      fontFace: TYPOGRAPHY.body,
      fontSize: entry.bodyFontSize || 10.6,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
    });
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.42,
      w: w - 0.44,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.softNeutral },
      line: { color: TOKENS.softNeutral },
    });
    slide.addText(opts.footer, {
      x: x + 0.34,
      y: y + h - 0.37,
      w: w - 0.68,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }
}

function addAuthFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const steps = opts.steps || [];
  const footerH = opts.footer ? 0.3 : 0;
  const exampleH = opts.example ? 0.86 : 0;
  const gap = 0.22;
  const innerW = w - 0.32 - gap * Math.max(0, steps.length - 1);
  const stepW = innerW / Math.max(steps.length, 1);
  const stepH = h - 0.9 - exampleH - footerH;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Flujo de acceso", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  steps.forEach((step, index) => {
    const stepX = x + 0.16 + index * (stepW + gap);
    const accent = step.accent || TOKENS.red;
    const fill = step.fill || TOKENS.white;
    const dark = fill === TOKENS.navy;

    addSurface(slide, SH, stepX, y + 0.58, stepW, stepH, {
      fill,
      line: dark ? TOKENS.navy : TOKENS.border,
    });
    slide.addShape(SH.roundRect, {
      x: stepX + stepW - 0.44,
      y: y + 0.68,
      w: 0.28,
      h: 0.22,
      rectRadius: 0.05,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(step.step || String(index + 1), {
      x: stepX + stepW - 0.44,
      y: y + 0.74,
      w: 0.28,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      bold: true,
      color: TOKENS.white,
      margin: 0,
      align: "center",
    });
    slide.addShape(SH.rect, {
      x: stepX + 0.14,
      y: y + 0.76,
      w: 0.1,
      h: stepH - 0.28,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(step.title || "", {
      x: stepX + 0.34,
      y: y + 0.76,
      w: stepW - 0.48,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13.8,
      bold: true,
      color: dark ? TOKENS.white : TOKENS.navy,
      margin: 0,
    });
    slide.addText(step.body || "", {
      x: stepX + 0.34,
      y: y + 1.1,
      w: stepW - 0.48,
      h: stepH - 0.52,
      fontFace: TYPOGRAPHY.body,
      fontSize: 10.6,
      color: dark ? TOKENS.white : TOKENS.ink,
      margin: 0,
      valign: "top",
    });

    if (index < steps.length - 1) {
      slide.addShape(SH.chevron, {
        x: stepX + stepW + 0.05,
        y: y + 1.48,
        w: 0.12,
        h: 0.26,
        fill: { color: opts.chevronColor || TOKENS.orange },
        line: { color: opts.chevronColor || TOKENS.orange },
      });
    }
  });

  if (opts.example) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - footerH - 0.58,
      w: w - 0.44,
      h: 0.38,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.example, {
      x: x + 0.36,
      y: y + h - footerH - 0.47,
      w: w - 0.72,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.16,
      w: w - 0.44,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.6,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

module.exports = {
  addExposureCompare,
  addChecklistGrid,
  addAuthFlow,
};
