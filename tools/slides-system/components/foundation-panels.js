const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

const PALANTIR = {
  bg: "0B0D10",
  panel: "161A1F",
  line: "2A3138",
  text: "F4F7FA",
  muted: "A8B2BD",
  steel: "5E6873",
  amber: "C89B3C",
  red: "B63A3A",
  blue: "2D4F63",
};

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

function addUrlBreakdown(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const segments = opts.segments || [];
  const footerH = opts.footer ? 0.26 : 0;
  const innerX = x + 0.22;
  const innerW = w - 0.44;
  const urlY = y + 0.54;
  const urlH = 0.72;
  const cardsY = y + 1.52;
  const cardsH = h - (cardsY - y) - 0.2 - footerH;
  const ratios = segments.map((segment) => Math.max(0.75, segment.ratio || 1));
  const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) || 1;
  let cursor = innerX;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Anatomia de URL", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  slide.addShape(SH.roundRect, {
    x: innerX,
    y: urlY,
    w: innerW,
    h: urlH,
    rectRadius: 0.04,
    fill: { color: opts.urlFill || TOKENS.navy },
    line: { color: opts.urlFill || TOKENS.navy },
  });
  slide.addText(opts.url || "", {
    x: innerX + 0.22,
    y: urlY + 0.2,
    w: innerW - 0.44,
    h: 0.22,
    fontFace: TYPOGRAPHY.mono,
    fontSize: opts.urlFontSize || 16.5,
    bold: true,
    color: TOKENS.white,
    margin: 0,
    align: "center",
  });

  segments.forEach((segment, index) => {
    const slotW = (innerW * ratios[index]) / totalRatio;
    const anchorX = cursor + slotW / 2;
    const cardX = cursor + 0.04;
    const cardW = Math.max(1.22, slotW - 0.08);
    const accent = segment.accent || TOKENS.red;

    slide.addShape(SH.rect, {
      x: cursor + 0.08,
      y: urlY + urlH + 0.08,
      w: Math.max(0.2, slotW - 0.16),
      h: 0.05,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.line, {
      x: anchorX,
      y: urlY + urlH + 0.13,
      w: 0,
      h: 0.16,
      line: { color: accent, pt: 1.2 },
    });
    slide.addShape(SH.ellipse, {
      x: anchorX - 0.05,
      y: urlY + urlH + 0.24,
      w: 0.1,
      h: 0.1,
      fill: { color: accent },
      line: { color: accent },
    });

    addSurface(slide, SH, cardX, cardsY, cardW, cardsH, {
      fill: segment.fill || TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardsY + 0.14,
      w: 0.1,
      h: cardsH - 0.28,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(segment.label || "", {
      x: cardX + 0.28,
      y: cardsY + 0.14,
      w: cardW - 0.4,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.8,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
    });
    slide.addText(segment.value || "", {
      x: cardX + 0.28,
      y: cardsY + 0.38,
      w: cardW - 0.4,
      h: 0.24,
      fontFace: segment.mono ? TYPOGRAPHY.mono : TYPOGRAPHY.display,
      fontSize: segment.valueFontSize || 13.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(segment.note || "", {
      x: cardX + 0.28,
      y: cardsY + 0.72,
      w: cardW - 0.4,
      h: Math.max(0.34, cardsH - 0.86),
      fontFace: TYPOGRAPHY.body,
      fontSize: segment.noteFontSize || 10.4,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
    });

    cursor += slotW;
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.22,
      w: w - 0.44,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

function addMythRealityGrid(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const entries = opts.entries || [];
  const cols = Math.max(1, Math.min(3, opts.columns || 2));
  const rows = Math.max(1, Math.ceil(entries.length / cols));
  const gapX = 0.22;
  const gapY = 0.2;
  const footerH = opts.footer ? 0.28 : 0;
  const gridY = y + 0.6;
  const cellW = (w - 0.32 - (cols - 1) * gapX) / cols;
  const cellH = (h - 0.82 - footerH - (rows - 1) * gapY) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Confusiones comunes", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  entries.forEach((entry, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cellX = x + 0.16 + col * (cellW + gapX);
    const cellY = gridY + row * (cellH + gapY);
    const accent = entry.accent || TOKENS.red;

    addSurface(slide, SH, cellX, cellY, cellW, cellH, {
      fill: entry.fill || TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: cellX + 0.1,
      y: cellY + 0.12,
      w: 0.1,
      h: cellH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: cellX + 0.26,
      y: cellY + 0.14,
      w: 0.64,
      h: 0.24,
      rectRadius: 0.04,
      fill: { color: entry.badgeFill || TOKENS.paleRed },
      line: { color: entry.badgeFill || TOKENS.paleRed },
    });
    slide.addText(entry.badge || "Mito", {
      x: cellX + 0.26,
      y: cellY + 0.19,
      w: 0.64,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: accent,
      margin: 0,
      align: "center",
    });
    slide.addText(entry.myth || "", {
      x: cellX + 0.26,
      y: cellY + 0.46,
      w: cellW - 0.38,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: entry.mythFontSize || 13.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(entry.reality || "", {
      x: cellX + 0.26,
      y: cellY + 0.88,
      w: cellW - 0.38,
      h: Math.max(0.28, cellH - 1.02),
      fontFace: TYPOGRAPHY.body,
      fontSize: entry.realityFontSize || 10.4,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
    });
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.44,
      w: w - 0.44,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.34,
      y: y + h - 0.39,
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

function addActorLane(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const entries = opts.entries || [];
  const railY = y + (opts.railYOffset || 1.72);
  const cardW = opts.cardW || Math.min(2.08, (w - 1.3) / Math.max(entries.length, 1));
  const topY = y + 0.6;
  const bottomY = railY + 0.34;
  const cardH = opts.cardH || 0.92;
  const startX = x + 0.58;
  const endX = x + w - 0.58;
  const step = entries.length > 1 ? (endX - startX) / (entries.length - 1) : 0;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Actores de una interaccion web", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  slide.addShape(SH.line, {
    x: startX,
    y: railY,
    w: endX - startX,
    h: 0,
    line: { color: TOKENS.guide, pt: 1.8 },
  });

  entries.forEach((entry, index) => {
    const nodeX = startX + step * index;
    const cardY = index % 2 === 0 ? topY : bottomY;
    const isTop = index % 2 === 0;
    const anchorY = isTop ? cardY + cardH : cardY;
    const accent = entry.accent || TOKENS.red;
    const fill = entry.fill || TOKENS.white;
    const dark = fill === TOKENS.navy;

    slide.addShape(SH.ellipse, {
      x: nodeX - 0.08,
      y: railY - 0.08,
      w: 0.16,
      h: 0.16,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.line, {
      x: nodeX,
      y: Math.min(railY, anchorY),
      w: 0,
      h: Math.abs(anchorY - railY),
      line: { color: accent, pt: 1.1 },
    });

    addSurface(slide, SH, nodeX - cardW / 2, cardY, cardW, cardH, {
      fill,
      line: dark ? TOKENS.navy : TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: nodeX - cardW / 2 + 0.08,
      y: cardY + 0.1,
      w: 0.08,
      h: cardH - 0.2,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(entry.label || "", {
      x: nodeX - cardW / 2 + 0.24,
      y: cardY + 0.1,
      w: cardW - 0.34,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: entry.titleFontSize || 12.2,
      bold: true,
      color: dark ? TOKENS.white : TOKENS.navy,
      margin: 0,
    });
    slide.addText(entry.body || "", {
      x: nodeX - cardW / 2 + 0.24,
      y: cardY + 0.38,
      w: cardW - 0.34,
      h: cardH - 0.5,
      fontFace: TYPOGRAPHY.body,
      fontSize: entry.bodyFontSize || 9.6,
      color: dark ? TOKENS.white : TOKENS.ink,
      margin: 0,
      valign: "top",
    });
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.18,
      y: y + h - 0.42,
      w: w - 0.36,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.32,
      y: y + h - 0.37,
      w: w - 0.64,
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

function addStageChain(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stages = opts.stages || [];
  const notes = opts.notes || [];
  const compact = opts.compact ?? stages.length >= 5;
  const headerH = 0.34;
  const innerX = x + 0.18;
  const innerW = w - 0.36;
  const stageY = y + 0.58;
  const stageH = compact ? 1.22 : 1.36;
  const chevronW = compact ? 0.18 : 0.22;
  const stageGap = compact ? 0.12 : 0.16;
  const totalChevron = Math.max(0, stages.length - 1) * chevronW;
  const totalGap = Math.max(0, stages.length - 1) * stageGap;
  const stageW = stages.length > 0 ? (innerW - totalChevron - totalGap) / stages.length : innerW;
  const footerH = opts.footer ? 0.34 : 0;
  const notesY = stageY + stageH + 0.34;
  const noteH = notes.length > 0 ? h - (notesY - y) - footerH - 0.2 : 0;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Cadena de etapas", {
    fill: opts.headerFill || TOKENS.softNeutral,
    h: headerH,
  });

  stages.forEach((stage, index) => {
    const stageX = innerX + index * (stageW + stageGap + chevronW);
    const accent = stage.accent || TOKENS.red;
    const fill = stage.fill || (stage.tone === "dark" ? TOKENS.navy : TOKENS.white);
    const dark = fill === TOKENS.navy;
    const stepLabel = String(stage.step || String(index + 1));
    const timeLike = /[:.]/.test(stepLabel) || stepLabel.length >= 4;
    const badgeW = compact
      ? (timeLike ? 0.56 : 0.22)
      : (timeLike ? 0.72 : 0.24);
    const badgeH = compact ? 0.2 : 0.22;
    const badgeX = stageX + 0.18;
    const badgeY = stageY + 0.12;
    const titleX = badgeX + badgeW + 0.08;
    const titleW = Math.max(0.54, stageW - (titleX - stageX) - 0.12);

    addSurface(slide, SH, stageX, stageY, stageW, stageH, {
      fill,
      line: dark ? TOKENS.navy : TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: stageX + 0.08,
      y: stageY + 0.1,
      w: 0.09,
      h: stageH - 0.2,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: badgeX,
      y: badgeY,
      w: badgeW,
      h: badgeH,
      rectRadius: 0.03,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(stepLabel, {
      x: badgeX,
      y: badgeY + 0.05,
      w: badgeW,
      h: 0.1,
      fontFace: timeLike ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: timeLike ? (compact ? 5.8 : 6.2) : (compact ? 6.8 : 7.2),
      bold: true,
      color: accent === TOKENS.navy ? TOKENS.white : TOKENS.navy,
      margin: 0,
      align: "center",
      breakLine: false,
      fit: "shrink",
      valign: "mid",
    });
    slide.addText(stage.title || "", {
      x: titleX,
      y: stageY + 0.11,
      w: titleW,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 11.4 : 12.4,
      bold: true,
      color: dark ? TOKENS.white : TOKENS.navy,
      margin: 0,
    });
    slide.addText(stage.body || "", {
      x: stageX + 0.22,
      y: stageY + 0.44,
      w: stageW - 0.32,
      h: stageH - 0.58,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 9.1 : 9.8,
      color: dark ? TOKENS.white : TOKENS.ink,
      margin: 0,
      valign: "top",
    });

    if (index < stages.length - 1) {
      slide.addShape(SH.chevron, {
        x: stageX + stageW + stageGap * 0.5,
        y: stageY + stageH / 2 - 0.15,
        w: chevronW,
        h: 0.3,
        fill: { color: opts.chevronColor || TOKENS.gold },
        line: { color: opts.chevronColor || TOKENS.gold },
      });
    }
  });

  if (notes.length > 0) {
    const noteGap = 0.18;
    const noteW = (innerW - noteGap * (notes.length - 1)) / notes.length;
    notes.forEach((note, index) => {
      const noteX = innerX + index * (noteW + noteGap);
      const accent = note.accent || TOKENS.red;
      addSurface(slide, SH, noteX, notesY, noteW, noteH, {
        fill: note.fill || TOKENS.white,
        line: note.fill === TOKENS.navy ? TOKENS.navy : TOKENS.border,
      });
      slide.addShape(SH.rect, {
        x: noteX + 0.08,
        y: notesY + 0.12,
        w: 0.1,
        h: noteH - 0.24,
        fill: { color: accent },
        line: { color: accent },
      });
      slide.addText(note.title || "", {
        x: noteX + 0.26,
        y: notesY + 0.12,
        w: noteW - 0.36,
        h: 0.18,
        fontFace: TYPOGRAPHY.display,
        fontSize: 11.4,
        bold: true,
        color: note.fill === TOKENS.navy ? TOKENS.white : TOKENS.navy,
        margin: 0,
      });
      slide.addText(note.body || "", {
        x: noteX + 0.26,
        y: notesY + 0.42,
        w: noteW - 0.36,
        h: noteH - 0.54,
        fontFace: TYPOGRAPHY.body,
        fontSize: 9.5,
        color: note.fill === TOKENS.navy ? TOKENS.white : TOKENS.ink,
        margin: 0,
        valign: "top",
      });
    });
  }

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.34,
      w: w - 0.44,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.36,
      y: y + h - 0.29,
      w: w - 0.72,
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

function addIntelTimelinePanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    {
      date: "ABR 2025",
      title: "NATO adquiere Maven",
      body: "La OTAN incorpora una variante de MSS para fusionar inteligencia y acelerar decisiones.",
      accent: PALANTIR.amber,
    },
    {
      date: "MAY 2025",
      title: "Contrato DoD",
      body: "El Pentagono amplia el contrato de Maven Smart System a escala mucho mayor.",
      accent: PALANTIR.red,
    },
    {
      date: "JUL 2025",
      title: "Army enterprise",
      body: "El U.S. Army consolida multiples contratos en un acuerdo mas estructural.",
      accent: PALANTIR.blue,
    },
    {
      date: "DIC 2025",
      title: "UK MoD",
      body: "Reino Unido profundiza su relacion con Palantir para decision y defensa.",
      accent: PALANTIR.steel,
    },
  ];
  const headerH = 0.34;
  const footerH = opts.footer ? 0.28 : 0;
  const innerX = x + 0.18;
  const innerW = w - 0.36;
  const railY = y + 1.12;
  const cardY = y + 1.38;
  const cardH = h - (cardY - y) - footerH - 0.26;
  const cardGap = 0.16;
  const chevronW = 0.18;
  const totalChevron = Math.max(0, items.length - 1) * chevronW;
  const totalGap = Math.max(0, items.length - 1) * cardGap;
  const cardW = items.length > 0 ? (innerW - totalChevron - totalGap) / items.length : innerW;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || PALANTIR.bg,
    line: opts.line || PALANTIR.line,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Hitos recientes de Palantir", {
    fill: opts.headerFill || PALANTIR.panel,
    color: PALANTIR.text,
    h: headerH,
  });

  slide.addShape(SH.rect, {
    x: innerX,
    y: railY,
    w: innerW,
    h: 0.04,
    fill: { color: PALANTIR.line },
    line: { color: PALANTIR.line },
  });

  items.forEach((item, index) => {
    const cardX = innerX + index * (cardW + cardGap + chevronW);
    const accent = item.accent || PALANTIR.amber;
    const badgeW = 0.68;

    slide.addShape(SH.ellipse, {
      x: cardX + cardW / 2 - 0.06,
      y: railY - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.rect, {
      x: cardX + cardW / 2 - 0.01,
      y: railY + 0.04,
      w: 0.02,
      h: 0.18,
      fill: { color: accent },
      line: { color: accent },
    });

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill: item.fill || PALANTIR.panel,
      line: PALANTIR.line,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: cardX + 0.26,
      y: cardY + 0.12,
      w: badgeW,
      h: 0.22,
      rectRadius: 0.04,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(item.date || "", {
      x: cardX + 0.26,
      y: cardY + 0.17,
      w: badgeW,
      h: 0.08,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 7.2,
      bold: true,
      color: PALANTIR.bg,
      margin: 0,
      align: "center",
    });
    slide.addText(item.title || "", {
      x: cardX + 0.26,
      y: cardY + 0.44,
      w: cardW - 0.36,
      h: 0.32,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: PALANTIR.text,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.body || "", {
      x: cardX + 0.26,
      y: cardY + 0.84,
      w: cardW - 0.36,
      h: cardH - 0.96,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.2,
      color: PALANTIR.muted,
      margin: 0,
      valign: "top",
    });

    if (index < items.length - 1) {
      slide.addShape(SH.chevron, {
        x: cardX + cardW + cardGap * 0.5,
        y: cardY + cardH / 2 - 0.12,
        w: chevronW,
        h: 0.24,
        fill: { color: opts.chevronColor || PALANTIR.steel },
        line: { color: opts.chevronColor || PALANTIR.steel },
      });
    }
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.2,
      w: w - 0.44,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: PALANTIR.muted,
      margin: 0,
      align: "center",
    });
  }
}

function addDecisionPipelinePanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stages = opts.stages || [
    { label: "01", title: "Datos", body: "Sensores, imagenes, reportes y señales fragmentadas.", accent: PALANTIR.steel },
    { label: "02", title: "Deteccion", body: "El sistema identifica patrones, objetos o eventos relevantes.", accent: PALANTIR.amber },
    { label: "03", title: "Analisis", body: "La informacion se cruza, ordena y contextualiza.", accent: PALANTIR.blue },
    { label: "04", title: "Priorizacion", body: "Se destacan amenazas, objetivos o decisiones urgentes.", accent: PALANTIR.red },
    { label: "05", title: "Operador", body: "Un humano interpreta y valida antes de actuar.", accent: PALANTIR.steel },
    { label: "06", title: "Decision", body: "La salida se convierte en accion o recomendacion operacional.", accent: PALANTIR.amber },
  ];
  const footerH = opts.footer ? 0.28 : 0;
  const innerX = x + 0.18;
  const innerW = w - 0.36;
  const stageY = y + 0.62;
  const stageH = h - 1.04 - footerH;
  const gap = 0.12;
  const chevronW = 0.16;
  const totalChevron = Math.max(0, stages.length - 1) * chevronW;
  const totalGap = Math.max(0, stages.length - 1) * gap;
  const stageW = stages.length > 0 ? (innerW - totalChevron - totalGap) / stages.length : innerW;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || PALANTIR.bg,
    line: opts.line || PALANTIR.line,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Pipeline de decision de Maven", {
    fill: opts.headerFill || PALANTIR.panel,
    color: PALANTIR.text,
  });

  stages.forEach((stage, index) => {
    const stageX = innerX + index * (stageW + gap + chevronW);
    const accent = stage.accent || PALANTIR.amber;

    addSurface(slide, SH, stageX, stageY, stageW, stageH, {
      fill: stage.fill || PALANTIR.panel,
      line: PALANTIR.line,
    });
    slide.addShape(SH.rect, {
      x: stageX + 0.08,
      y: stageY + 0.1,
      w: 0.08,
      h: stageH - 0.2,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: stageX + 0.22,
      y: stageY + 0.12,
      w: 0.32,
      h: 0.22,
      rectRadius: 0.04,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(stage.label || String(index + 1).padStart(2, "0"), {
      x: stageX + 0.22,
      y: stageY + 0.17,
      w: 0.32,
      h: 0.08,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 6.8,
      bold: true,
      color: PALANTIR.bg,
      margin: 0,
      align: "center",
    });
    slide.addText(stage.title || "", {
      x: stageX + 0.22,
      y: stageY + 0.44,
      w: stageW - 0.3,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.4,
      bold: true,
      color: PALANTIR.text,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(stage.body || "", {
      x: stageX + 0.22,
      y: stageY + 0.78,
      w: stageW - 0.3,
      h: stageH - 0.9,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      color: PALANTIR.muted,
      margin: 0,
      valign: "top",
    });

    if (index < stages.length - 1) {
      slide.addShape(SH.chevron, {
        x: stageX + stageW + gap * 0.5,
        y: stageY + stageH / 2 - 0.12,
        w: chevronW,
        h: 0.24,
        fill: { color: opts.chevronColor || PALANTIR.amber },
        line: { color: opts.chevronColor || PALANTIR.amber },
      });
    }
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.2,
      w: w - 0.44,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: PALANTIR.muted,
      margin: 0,
      align: "center",
    });
  }
}

function addPowerNetworkMap(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const center = opts.center || {
    title: "Palantir",
    body: "Plataforma de datos, IA y soporte a decisiones.",
    accent: PALANTIR.amber,
  };
  const nodes = opts.nodes || [
    { title: "DoD", body: "Maven y contratos de defensa", accent: PALANTIR.red, position: "lt" },
    { title: "U.S. Army", body: "Acuerdos enterprise y consolidacion", accent: PALANTIR.blue, position: "lb" },
    { title: "NATO", body: "Adopcion de MSS NATO", accent: PALANTIR.amber, position: "rt" },
    { title: "UK MoD", body: "Uso estrategico y operacional", accent: PALANTIR.steel, position: "rb" },
    { title: "Anthropic / IA", body: "Modelos frontier en redes clasificadas", accent: PALANTIR.amber, position: "bc" },
  ];
  const positions = {
    lt: { x: x + 0.38, y: y + 0.9 },
    lb: { x: x + 0.38, y: y + h - 1.64 },
    rt: { x: x + w - 2.72, y: y + 0.9 },
    rb: { x: x + w - 2.72, y: y + h - 1.64 },
    bc: { x: x + w / 2 - 1.18, y: y + h - 1.1 },
  };
  const centerW = 2.36;
  const centerH = 1.16;
  const centerX = x + w / 2 - centerW / 2;
  const centerY = y + h / 2 - centerH / 2 - 0.18;
  const nodeW = 2.34;
  const nodeH = 0.96;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || PALANTIR.bg,
    line: opts.line || PALANTIR.line,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Red de poder y contratos", {
    fill: opts.headerFill || PALANTIR.panel,
    color: PALANTIR.text,
  });

  nodes.forEach((node) => {
    const pos = positions[node.position] || positions.lt;
    const accent = node.accent || PALANTIR.red;
    const nodeCenterX = pos.x + nodeW / 2;
    const nodeCenterY = pos.y + nodeH / 2;
    const centerMidX = centerX + centerW / 2;
    const centerMidY = centerY + centerH / 2;
    const horizontalY = nodeCenterY < centerMidY ? nodeCenterY + 0.02 : nodeCenterY - 0.02;
    const leftX = Math.min(nodeCenterX, centerMidX);
    const rightX = Math.max(nodeCenterX, centerMidX);
    const topY = Math.min(horizontalY, centerMidY);
    const bottomY = Math.max(horizontalY, centerMidY);

    slide.addShape(SH.rect, {
      x: leftX,
      y: horizontalY,
      w: rightX - leftX,
      h: 0.02,
      fill: { color: PALANTIR.line },
      line: { color: PALANTIR.line },
    });
    slide.addShape(SH.rect, {
      x: centerMidX - 0.01,
      y: topY,
      w: 0.02,
      h: bottomY - topY,
      fill: { color: PALANTIR.line },
      line: { color: PALANTIR.line },
    });
    slide.addShape(SH.ellipse, {
      x: nodeCenterX - 0.05,
      y: nodeCenterY - 0.05,
      w: 0.1,
      h: 0.1,
      fill: { color: accent },
      line: { color: accent },
    });

    addSurface(slide, SH, pos.x, pos.y, nodeW, nodeH, {
      fill: PALANTIR.panel,
      line: PALANTIR.line,
    });
    slide.addShape(SH.rect, {
      x: pos.x + 0.08,
      y: pos.y + 0.1,
      w: 0.08,
      h: nodeH - 0.2,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(node.title || "", {
      x: pos.x + 0.24,
      y: pos.y + 0.12,
      w: nodeW - 0.34,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.2,
      bold: true,
      color: PALANTIR.text,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(node.body || "", {
      x: pos.x + 0.24,
      y: pos.y + 0.42,
      w: nodeW - 0.34,
      h: nodeH - 0.52,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: PALANTIR.muted,
      margin: 0,
      valign: "top",
    });
  });

  addSurface(slide, SH, centerX, centerY, centerW, centerH, {
    fill: PALANTIR.panel,
    line: center.accent || PALANTIR.amber,
    linePt: 1.4,
  });
  slide.addShape(SH.rect, {
    x: centerX + 0.1,
    y: centerY + 0.12,
    w: 0.1,
    h: centerH - 0.24,
    fill: { color: center.accent || PALANTIR.amber },
    line: { color: center.accent || PALANTIR.amber },
  });
  slide.addText(center.title || "", {
    x: centerX + 0.28,
    y: centerY + 0.18,
    w: centerW - 0.38,
    h: 0.22,
    fontFace: TYPOGRAPHY.display,
    fontSize: 13.8,
    bold: true,
    color: PALANTIR.text,
    margin: 0,
    align: "center",
  });
  slide.addText(center.body || "", {
    x: centerX + 0.28,
    y: centerY + 0.5,
    w: centerW - 0.38,
    h: 0.4,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.2,
    color: PALANTIR.muted,
    margin: 0,
    align: "center",
    valign: "mid",
  });
}

module.exports = {
  addUrlBreakdown,
  addMythRealityGrid,
  addActorLane,
  addStageChain,
  addIntelTimelinePanel,
  addDecisionPipelinePanel,
  addPowerNetworkMap,
};


