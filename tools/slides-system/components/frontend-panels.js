const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");
const { svgToDataUri } = require("../vendor/pptxgenjs_helpers/svg");

function escapeXml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function asSvgColor(color) {
  const value = String(color || TOKENS.navy).trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function getBlueprintIcon(kind, opts = {}) {
  const stroke = asSvgColor(opts.stroke || TOKENS.navy);
  const accent = asSvgColor(opts.accent || TOKENS.red);
  const secondary = asSvgColor(opts.secondary || TOKENS.gold);
  const icons = {
    sheet: `
      <rect x="14" y="12" width="36" height="40" rx="5" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M22 24 H42" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      <path d="M22 32 H42" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      <path d="M22 40 H34" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      <rect x="18" y="16" width="10" height="6" rx="2" fill="${accent}"/>
    `,
    database: `
      <ellipse cx="32" cy="16" rx="16" ry="6" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M16 16 V38 C16 41.5 23.2 44 32 44 C40.8 44 48 41.5 48 38 V16" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M16 27 C16 30.5 23.2 33 32 33 C40.8 33 48 30.5 48 27" fill="none" stroke="${accent}" stroke-width="3"/>
      <path d="M16 38 C16 41.5 23.2 44 32 44 C40.8 44 48 41.5 48 38" fill="none" stroke="${secondary}" stroke-width="3"/>
    `,
    building: `
      <rect x="18" y="14" width="28" height="36" rx="4" fill="none" stroke="${stroke}" stroke-width="3"/>
      <rect x="24" y="20" width="5" height="5" rx="1.2" fill="${accent}"/>
      <rect x="35" y="20" width="5" height="5" rx="1.2" fill="${secondary}"/>
      <rect x="24" y="30" width="5" height="5" rx="1.2" fill="${secondary}"/>
      <rect x="35" y="30" width="5" height="5" rx="1.2" fill="${accent}"/>
      <rect x="29" y="40" width="6" height="10" rx="1.5" fill="none" stroke="${stroke}" stroke-width="3"/>
    `,
    user: `
      <circle cx="32" cy="22" r="8" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M18 47 C20.5 39.5 26 36 32 36 C38 36 43.5 39.5 46 47" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    `,
    link: `
      <rect x="12" y="24" width="18" height="12" rx="6" fill="none" stroke="${stroke}" stroke-width="3"/>
      <rect x="34" y="24" width="18" height="12" rx="6" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M26 30 H38" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    `,
    key: `
      <circle cx="22" cy="28" r="8" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M30 28 H46" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
      <path d="M40 28 V34" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 28 V32" stroke="${secondary}" stroke-width="3" stroke-linecap="round"/>
    `,
    sql: `
      <rect x="12" y="14" width="40" height="36" rx="5" fill="none" stroke="${stroke}" stroke-width="3"/>
      <path d="M20 24 H44" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      <path d="M20 32 H36" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
      <path d="M20 40 H30" stroke="${secondary}" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 36 L48 30 L42 24" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  };

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      ${icons[kind] || icons.sheet}
    </svg>
  `);
}

function addIconBadge(slide, SH, x, y, w, h, kind, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: opts.fill || TOKENS.softNeutral },
    line: { color: opts.line || opts.fill || TOKENS.softNeutral, pt: 1 },
  });
  slide.addImage({
    data: getBlueprintIcon(kind, {
      stroke: opts.stroke || TOKENS.navy,
      accent: opts.accent || TOKENS.red,
      secondary: opts.secondary || TOKENS.gold,
    }),
    x: x + w * 0.18,
    y: y + h * 0.18,
    w: w * 0.64,
    h: h * 0.64,
  });
}

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

function addViewportCard(slide, SH, x, y, w, h, opts = {}) {
  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });

  slide.addShape(SH.roundRect, {
    x: x + 0.1,
    y: y + 0.1,
    w: w - 0.2,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.softNeutral },
  });

  ["D62027", "E0BC5A", "52606D"].forEach((color, index) => {
    slide.addShape(SH.ellipse, {
      x: x + 0.18 + index * 0.12,
      y: y + 0.17,
      w: 0.06,
      h: 0.06,
      fill: { color },
      line: { color },
    });
  });

  slide.addText(opts.label || "Viewport", {
    x: x + 0.12,
    y: y + 0.44,
    w: w - 0.24,
    h: 0.22,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });

  if (opts.sizeLabel) {
    slide.addShape(SH.roundRect, {
      x: x + 0.12,
      y: y + 0.72,
      w: 0.98,
      h: 0.26,
      rectRadius: 0.03,
      fill: { color: opts.toneFill || TOKENS.softBlue },
      line: { color: opts.toneFill || TOKENS.softBlue },
    });
    slide.addText(opts.sizeLabel, {
      x: x + 0.2,
      y: y + 0.78,
      w: 0.82,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.4,
      bold: true,
      color: opts.tone || TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }

  const screenX = x + 0.18;
  const screenY = y + 1.1;
  const screenW = w - 0.36;
  const screenH = h - 1.34;

  slide.addShape(SH.roundRect, {
    x: screenX,
    y: screenY,
    w: screenW,
    h: screenH,
    rectRadius: 0.03,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.rect, {
    x: screenX + 0.12,
    y: screenY + 0.12,
    w: screenW - 0.24,
    h: opts.heroH || 0.34,
    fill: { color: opts.heroFill || TOKENS.navy },
    line: { color: opts.heroFill || TOKENS.navy },
  });

  for (let index = 0; index < (opts.blockCount || 3); index += 1) {
    const blockY = screenY + 0.58 + index * 0.38;
    slide.addShape(SH.roundRect, {
      x: screenX + 0.12,
      y: blockY,
      w: screenW - 0.24,
      h: 0.22,
      rectRadius: 0.02,
      fill: { color: index % 2 === 0 ? TOKENS.white : TOKENS.mist },
      line: { color: index % 2 === 0 ? TOKENS.border : TOKENS.mist, pt: 1 },
    });
  }

  const notes = opts.notes || [];
  notes.slice(0, 3).forEach((note, index) => {
    slide.addShape(SH.ellipse, {
      x: x + 0.16,
      y: y + h - 0.7 + index * 0.18,
      w: 0.06,
      h: 0.06,
      fill: { color: opts.tone || TOKENS.red },
      line: { color: opts.tone || TOKENS.red },
    });
    slide.addText(note, {
      x: x + 0.28,
      y: y + h - 0.71 + index * 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      margin: 0,
    });
  });
}

function addResponsiveViewportCompare(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const leftW = opts.leftW || w * 0.42;
  const rightW = opts.rightW || w * 0.42;
  const gap = opts.gap || w - leftW - rightW;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Responsive", {
    fill: TOKENS.softNeutral,
  });

  addViewportCard(slide, SH, x + 0.22, y + 0.62, leftW, h - 0.84, {
    label: (opts.left && opts.left.label) || "Móvil",
    sizeLabel: (opts.left && opts.left.sizeLabel) || "390 px",
    notes: (opts.left && opts.left.notes) || ["Una columna", "Más aire", "Prioridad al CTA"],
    tone: TOKENS.red,
    toneFill: TOKENS.paleRed,
    heroFill: TOKENS.red,
    blockCount: 4,
  });

  slide.addShape(SH.chevron, {
    x: x + leftW + 0.34,
    y: y + h / 2 - 0.18,
    w: 0.44,
    h: 0.36,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  addViewportCard(slide, SH, x + leftW + gap + 0.1, y + 0.62, rightW, h - 0.84, {
    label: (opts.right && opts.right.label) || "Desktop",
    sizeLabel: (opts.right && opts.right.sizeLabel) || "1280 px",
    notes: (opts.right && opts.right.notes) || ["Más contexto", "Jerarquía lateral", "Aprovecha el ancho"],
    tone: TOKENS.navy,
    toneFill: TOKENS.softBlue,
    heroFill: TOKENS.navy,
    blockCount: 5,
  });
}

function addMiniViewportScene(slide, SH, x, y, w, h, opts = {}) {
  const tone = opts.tone || TOKENS.navy;
  const toneFill = opts.toneFill || TOKENS.softBlue;
  const layout = opts.layout || "desktop";
  const label = opts.label || "Desktop";
  const sizeLabel = opts.sizeLabel || "1280 px";

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });

  slide.addShape(SH.rect, {
    x,
    y,
    w: 0.08,
    h,
    fill: { color: tone },
    line: { color: tone },
  });

  slide.addText(label, {
    x: x + 0.18,
    y: y + 0.16,
    w: w - 1.22,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11.4,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });

  slide.addShape(SH.roundRect, {
    x: x + w - 0.96,
    y: y + 0.14,
    w: 0.78,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: toneFill },
    line: { color: toneFill },
  });
  slide.addText(sizeLabel, {
    x: x + w - 0.9,
    y: y + 0.2,
    w: 0.66,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.1,
    bold: true,
    color: tone,
    align: "center",
    margin: 0,
  });

  const browserX = x + 0.16;
  const browserY = y + 0.54;
  const browserW = w - 0.32;
  const browserH = h - 0.96;

  slide.addShape(SH.roundRect, {
    x: browserX,
    y: browserY,
    w: browserW,
    h: browserH,
    rectRadius: 0.03,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.roundRect, {
    x: browserX,
    y: browserY,
    w: browserW,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.softNeutral },
  });

  ["D62027", "E0BC5A", "52606D"].forEach((color, index) => {
    slide.addShape(SH.ellipse, {
      x: browserX + 0.1 + index * 0.1,
      y: browserY + 0.09,
      w: 0.05,
      h: 0.05,
      fill: { color },
      line: { color },
    });
  });

  const screenX = browserX + 0.12;
  const screenY = browserY + 0.34;
  const screenW = browserW - 0.24;
  const screenH = browserH - 0.48;
  const heroH = Math.max(0.18, Math.min(0.3, screenH * 0.18));
  const blockGap = 0.08;

  slide.addShape(SH.roundRect, {
    x: screenX,
    y: screenY,
    w: screenW,
    h: heroH,
    rectRadius: 0.02,
    fill: { color: tone },
    line: { color: tone },
  });

  if (layout === "desktop") {
    const contentY = screenY + heroH + blockGap;
    const leftW = screenW * 0.58;
    const rightW = screenW - leftW - blockGap;
    const leftH = Math.max(0.28, screenH - heroH - blockGap - 0.22);
    const smallH = Math.max(0.12, (leftH - blockGap) / 2);

    slide.addShape(SH.roundRect, {
      x: screenX,
      y: contentY,
      w: leftW,
      h: leftH,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.roundRect, {
      x: screenX + leftW + blockGap,
      y: contentY,
      w: rightW,
      h: smallH,
      rectRadius: 0.02,
      fill: { color: TOKENS.mist },
      line: { color: TOKENS.mist },
    });
    slide.addShape(SH.roundRect, {
      x: screenX + leftW + blockGap,
      y: contentY + smallH + blockGap,
      w: rightW,
      h: smallH,
      rectRadius: 0.02,
      fill: { color: TOKENS.softNeutral },
      line: { color: TOKENS.softNeutral },
    });
  } else if (layout === "tablet") {
    const contentY = screenY + heroH + blockGap;
    const boxW = (screenW - blockGap) / 2;
    const midH = Math.max(0.18, screenH * 0.26);
    const footerH = Math.max(0.16, screenH - heroH - midH - blockGap * 2);

    slide.addShape(SH.roundRect, {
      x: screenX,
      y: contentY,
      w: boxW,
      h: midH,
      rectRadius: 0.02,
      fill: { color: TOKENS.paleRed },
      line: { color: TOKENS.paleRed },
    });
    slide.addShape(SH.roundRect, {
      x: screenX + boxW + blockGap,
      y: contentY,
      w: boxW,
      h: midH,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.roundRect, {
      x: screenX,
      y: contentY + midH + blockGap,
      w: screenW,
      h: footerH,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 1 },
    });
  } else {
    const contentY = screenY + heroH + blockGap;
    const stackH = Math.max(0.12, (screenH - heroH - blockGap * 3) / 3);

    for (let index = 0; index < 3; index += 1) {
      slide.addShape(SH.roundRect, {
        x: screenX,
        y: contentY + index * (stackH + blockGap),
        w: screenW,
        h: stackH,
        rectRadius: 0.02,
        fill: { color: index === 0 ? TOKENS.paleRed : TOKENS.white },
        line: { color: index === 0 ? TOKENS.paleRed : TOKENS.border, pt: 1 },
      });
    }
  }

  if (opts.behavior) {
    slide.addShape(SH.roundRect, {
      x: x + 0.18,
      y: y + h - 0.26,
      w: w - 0.36,
      h: 0.16,
      rectRadius: 0.02,
      fill: { color: opts.behaviorFill || TOKENS.softNeutral },
      line: { color: opts.behaviorFill || TOKENS.softNeutral },
    });
    slide.addText(opts.behavior, {
      x: x + 0.26,
      y: y + h - 0.22,
      w: w - 0.52,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addResponsiveReflowPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stages = opts.stages || [
    {
      label: "Desktop",
      sizeLabel: "1280 px",
      behavior: "mas contexto, jerarquia lateral",
      layout: "desktop",
      tone: TOKENS.navy,
      toneFill: TOKENS.softBlue,
    },
    {
      label: "Tablet",
      sizeLabel: "820 px",
      behavior: "reacomoda bloques sin perder foco",
      layout: "tablet",
      tone: TOKENS.gold,
      toneFill: TOKENS.warm,
    },
    {
      label: "Movil",
      sizeLabel: "390 px",
      behavior: "una columna y prioridad al CTA",
      layout: "mobile",
      tone: TOKENS.red,
      toneFill: TOKENS.paleRed,
    },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Reflow responsive", {
    fill: TOKENS.softNeutral,
  });

  const visibleStages = stages.slice(0, 3);
  const gap = 0.18;
  const footerReserve = opts.footer ? 0.34 : 0;
  const cardW = (w - 0.44 - gap * (visibleStages.length - 1)) / visibleStages.length;
  const cardH = h - 0.92 - footerReserve;
  const arrowW = Math.max(0.1, gap - 0.06);
  const arrowH = 0.26;
  const contentY = y + 0.58;

  visibleStages.forEach((stage, index) => {
    const cardX = x + 0.22 + index * (cardW + gap);

    addMiniViewportScene(slide, SH, cardX, contentY, cardW, cardH, stage);

    if (index < visibleStages.length - 1) {
      slide.addShape(SH.chevron, {
        x: cardX + cardW + (gap - arrowW) / 2,
        y: contentY + cardH / 2 - arrowH / 2,
        w: arrowW,
        h: arrowH,
        fill: { color: TOKENS.gold },
        line: { color: TOKENS.gold },
      });
    }
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addCssRuleStack(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const rules = opts.rules || [];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Cascada y especificidad", {
    fill: TOKENS.softBlue,
  });

  rules.slice(0, 5).forEach((rule, index) => {
    const rowY = y + 0.66 + index * 0.56;
    const active = Boolean(rule.active);
    const fill = active ? TOKENS.paleRed : TOKENS.paper;
    const line = active ? TOKENS.red : TOKENS.border;
    const selectorW = w * 0.34;
    const specificityW = 0.88;

    slide.addShape(SH.roundRect, {
      x: x + 0.18,
      y: rowY,
      w: w - 0.36,
      h: 0.42,
      rectRadius: 0.03,
      fill: { color: fill },
      line: { color: line, pt: active ? 1.2 : 1 },
    });

    slide.addShape(SH.rect, {
      x: x + 0.18,
      y: rowY,
      w: 0.08,
      h: 0.42,
      fill: { color: active ? TOKENS.red : TOKENS.navy },
      line: { color: active ? TOKENS.red : TOKENS.navy },
    });

    slide.addText(rule.selector || ".card", {
      x: x + 0.34,
      y: rowY + 0.08,
      w: selectorW,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.2,
      color: TOKENS.navy,
      margin: 0,
    });

    slide.addText(rule.declaration || "color: var(--ink);", {
      x: x + 0.34 + selectorW,
      y: rowY + 0.08,
      w: w - selectorW - specificityW - 0.92,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10,
      color: TOKENS.ink,
      margin: 0,
    });

    slide.addShape(SH.roundRect, {
      x: x + w - specificityW - 0.18,
      y: rowY + 0.08,
      w: specificityW,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: active ? TOKENS.red : TOKENS.softNeutral },
      line: { color: active ? TOKENS.red : TOKENS.softNeutral },
    });
    slide.addText(rule.specificity || "0,1,0", {
      x: x + w - specificityW - 0.12,
      y: rowY + 0.14,
      w: specificityW - 0.12,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: active ? TOKENS.white : TOKENS.navy,
      align: "center",
      margin: 0,
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.18,
      y: y + h - 0.32,
      w: w - 0.36,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.2,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

function addBoxModelDiagram(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const innerW = w - 0.44;
  const innerH = h - 1.08;
  const stepInset = Math.min(0.3, Math.max(0.18, Math.min((innerW - 1.08) / 6, (innerH - 0.84) / 6)));
  const compact = w <= 3.4 || h <= 3.3;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Box model", {
    fill: TOKENS.softNeutral,
  });

  const levels = [
    { label: "margin", value: opts.margin || "24px", fill: TOKENS.warm, line: TOKENS.gold, depth: 0 },
    { label: "border", value: opts.border || "2px", fill: TOKENS.softBlue, line: TOKENS.navy, depth: 1 },
    { label: "padding", value: opts.padding || "16px", fill: TOKENS.softNeutral, line: TOKENS.sand, depth: 2 },
    { label: "content", value: opts.content || "320 x 120", fill: TOKENS.white, line: TOKENS.border, depth: 3 },
  ];

  levels.forEach((level, index) => {
    const inset = stepInset * level.depth;
    const currentX = x + 0.22 + inset;
    const currentY = y + 0.74 + inset;
    const currentW = w - 0.44 - inset * 2;
    const currentH = h - 1.08 - inset * 2;
    const labelW = Math.min(currentW - 0.88, compact ? 0.62 : 0.82);
    const valueW = compact ? 0.58 : 0.72;
    const textY = currentY + (compact ? 0.06 : 0.08);

    slide.addShape(SH.roundRect, {
      x: currentX,
      y: currentY,
      w: currentW,
      h: currentH,
      rectRadius: 0.03,
      fill: { color: level.fill },
      line: { color: level.line, pt: index === 3 ? 1 : 1.2 },
    });
    slide.addText(level.label, {
      x: currentX + 0.12,
      y: textY,
      w: labelW,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 8.6 : 9.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(level.value, {
      x: currentX + currentW - valueW - 0.12,
      y: textY,
      w: valueW,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: compact ? 7.8 : 9,
      color: TOKENS.slate,
      align: "right",
      margin: 0,
    });
  });
}

function addFlexGridLayout(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const mode = opts.mode || "flex";
  const itemCount = opts.itemCount || 6;
  const columns = opts.columns || 3;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(
    slide,
    SH,
    x + 0.14,
    y + 0.14,
    w - 0.28,
    opts.title || (mode === "grid" ? "Grid layout" : "Flex layout"),
    {
      fill: mode === "grid" ? TOKENS.softBlue : TOKENS.paleRed,
    }
  );

  const containerX = x + 0.22;
  const containerY = y + 0.68;
  const containerW = w - 0.44;
  const containerH = h - 0.96;

  slide.addShape(SH.roundRect, {
    x: containerX,
    y: containerY,
    w: containerW,
    h: containerH,
    rectRadius: 0.03,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.border, pt: 1 },
  });

  if (mode === "grid") {
    const rows = Math.ceil(itemCount / columns);
    const gap = Math.min(0.16, Math.max(0.04, containerH / (rows * 4 + 1)));
    const itemW = (containerW - gap * (columns + 1)) / columns;
    const itemH = (containerH - gap * (rows + 1)) / rows;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const index = row * columns + col;
        if (index >= itemCount) continue;
        slide.addShape(SH.roundRect, {
          x: containerX + gap + col * (itemW + gap),
          y: containerY + gap + row * (itemH + gap),
          w: itemW,
          h: itemH,
          rectRadius: 0.03,
          fill: { color: index % 2 === 0 ? TOKENS.softBlue : TOKENS.white },
          line: { color: index % 2 === 0 ? TOKENS.softBlue : TOKENS.border, pt: 1 },
        });
      }
    }
  } else {
    const flexColumns = opts.flexColumns || (itemCount <= 3 ? itemCount : containerH < 0.92 ? 2 : 3);
    const rows = Math.ceil(itemCount / flexColumns);
    const gap = Math.min(rows > 1 ? 0.14 : 0.16, Math.max(0.04, containerH / (rows * 4 + 1)));
    const itemW = (containerW - gap * (flexColumns + 1)) / flexColumns;
    const itemH = (containerH - gap * (rows + 1)) / rows;
    for (let index = 0; index < itemCount; index += 1) {
      const row = Math.floor(index / flexColumns);
      const col = index % flexColumns;
      slide.addShape(SH.roundRect, {
        x: containerX + gap + col * (itemW + gap),
        y: containerY + gap + row * (itemH + gap),
        w: itemW,
        h: itemH,
        rectRadius: 0.03,
        fill: { color: index % 2 === 0 ? TOKENS.paleRed : TOKENS.white },
        line: { color: index % 2 === 0 ? TOKENS.paleRed : TOKENS.border, pt: 1 },
      });
    }
  }
}

function scoreTone(score) {
  if (score >= 90) return { ring: TOKENS.success, fill: TOKENS.successSoft };
  if (score >= 70) return { ring: TOKENS.warning, fill: TOKENS.warningSoft };
  return { ring: TOKENS.red, fill: TOKENS.paleRed };
}

function addLighthouseAuditCard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const scores = opts.scores || [
    { label: "Performance", score: 86 },
    { label: "Accesibilidad", score: 94 },
    { label: "SEO", score: 92 },
    { label: "Buenas prácticas", score: 88 },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Auditoría rápida", {
    fill: TOKENS.softBlue,
  });

  const gap = 0.18;
  const footerReserve = opts.summary ? 0.34 : 0.12;
  const headerReserve = 0.74;
  const cardY = y + headerReserve;
  const cardH = Math.max(0.88, h - headerReserve - footerReserve);
  const cardW = (w - gap * 5) / 4;
  scores.slice(0, 4).forEach((item, index) => {
    const tone = scoreTone(item.score);
    const cardX = x + gap + index * (cardW + gap);
    const label = String(item.label || "");
    const compactLabel = label.length > 13 || cardH < 1.18;
    const ringSize = Math.min(0.68, Math.max(0.42, cardH * 0.42));
    const ringX = cardX + cardW / 2 - ringSize / 2;
    const ringY = cardY + Math.max(0.08, cardH * 0.12);
    const labelY = ringY + ringSize + Math.max(0.05, cardH * 0.12);
    const labelH = Math.max(0.18, cardY + cardH - 0.08 - labelY);

    slide.addShape(SH.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.03,
      fill: { color: tone.fill },
      line: { color: tone.fill },
    });
    slide.addShape(SH.ellipse, {
      x: ringX,
      y: ringY,
      w: ringSize,
      h: ringSize,
      fill: { color: TOKENS.white },
      line: { color: tone.ring, pt: ringSize < 0.54 ? 2.6 : 3.6 },
    });
    slide.addText(String(item.score), {
      x: cardX + cardW / 2 - ringSize * 0.42,
      y: ringY + ringSize * 0.3,
      w: ringSize * 0.84,
      h: ringSize * 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: ringSize < 0.54 ? 11.6 : 16,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
    });
    slide.addText(label, {
      x: cardX + 0.08,
      y: labelY,
      w: cardW - 0.16,
      h: labelH,
      fontFace: TYPOGRAPHY.body,
      fontSize: compactLabel ? 7.6 : 9.2,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      valign: "mid",
    });
  });

  if (opts.summary) {
    slide.addText(opts.summary, {
      x: x + 0.18,
      y: y + h - 0.22,
      w: w - 0.36,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.6,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

function addPerformanceMetricsBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const metrics = (opts.metrics || [
    {
      label: "LCP",
      value: "2.4 s",
      note: "cuando aparece el contenido principal",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      label: "CLS",
      value: "0.04",
      note: "si la interfaz salta mientras carga",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      label: "INP",
      value: "180 ms",
      note: "qué tan bien responde la interacción",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
  ]).slice(0, 4);
  const footerReserve = opts.footer ? 0.28 : 0;
  const cols = metrics.length <= 3 ? metrics.length : 2;
  const rows = Math.ceil(metrics.length / cols);
  const gapX = 0.16;
  const gapY = 0.18;
  const innerY = y + 0.66;
  const innerH = h - 0.86 - footerReserve;
  const cardW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cardH = (innerH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Métricas que conviene interpretar", {
    fill: TOKENS.softNeutral,
  });

  metrics.forEach((metric, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cardX = x + 0.16 + col * (cardW + gapX);
    const cardY = innerY + row * (cardH + gapY);
    const accent = metric.accent || TOKENS.navy;
    const fill = metric.fill || TOKENS.softBlue;

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(metric.label || "LCP", {
      x: cardX + 0.22,
      y: cardY + 0.16,
      w: cardW - 0.44,
      h: 0.14,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(metric.value || "0", {
      x: cardX + 0.22,
      y: cardY + 0.42,
      w: cardW - 0.44,
      h: 0.24,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18.2,
      bold: true,
      color: accent,
      margin: 0,
    });
    slide.addText(metric.note || "", {
      x: cardX + 0.22,
      y: cardY + 0.76,
      w: cardW - 0.34,
      h: Math.max(0.2, cardH - 0.9),
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.7,
      color: TOKENS.slate,
      margin: 0,
      valign: "mid",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addNetworkLoadBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const resources = (opts.resources || [
    {
      label: "hero-producto.webp",
      kind: "img",
      sizeLabel: "480 KB",
      durationLabel: "620 ms",
      weight: 0.92,
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      label: "app.css",
      kind: "css",
      sizeLabel: "96 KB",
      durationLabel: "180 ms",
      weight: 0.44,
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      label: "carousel.js",
      kind: "js",
      sizeLabel: "210 KB",
      durationLabel: "360 ms",
      weight: 0.68,
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      label: "analytics.js",
      kind: "3rd",
      sizeLabel: "52 KB",
      durationLabel: "240 ms",
      weight: 0.36,
      accent: TOKENS.navy,
      fill: TOKENS.white,
    },
  ]).slice(0, 5);

  const footerReserve = opts.footer ? 0.3 : 0;
  const summaryW = Math.max(2.1, w * 0.28);
  const listW = w - summaryW - 0.36;
  const innerY = y + 0.66;
  const innerH = h - 0.86 - footerReserve;
  const rowGap = 0.1;
  const rowH = Math.max(0.44, (innerH - rowGap * (resources.length - 1)) / resources.length);

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Lectura inicial de carga", {
    fill: TOKENS.softNeutral,
  });

  resources.forEach((resource, index) => {
    const rowY = innerY + index * (rowH + rowGap);
    const accent = resource.accent || TOKENS.navy;
    const fill = resource.fill || TOKENS.softBlue;
    const barW = Math.max(0.32, (listW - 2.54) * Math.max(0.12, Math.min(1, resource.weight || 0.4)));

    addSurface(slide, SH, x + 0.16, rowY, listW, rowH, {
      fill: index % 2 === 0 ? TOKENS.white : TOKENS.paper,
      line: TOKENS.border,
    });
    slide.addShape(SH.roundRect, {
      x: x + 0.28,
      y: rowY + 0.12,
      w: 0.54,
      h: 0.2,
      rectRadius: 0.03,
      fill: { color: fill },
      line: { color: fill },
    });
    slide.addText(resource.kind || "res", {
      x: x + 0.32,
      y: rowY + 0.165,
      w: 0.46,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      bold: true,
      color: accent,
      align: "center",
      margin: 0,
    });
    slide.addText(resource.label || "resource.js", {
      x: x + 0.92,
      y: rowY + 0.11,
      w: listW - 3.02,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(`${resource.sizeLabel || ""} · ${resource.durationLabel || ""}`, {
      x: x + listW - 1.86,
      y: rowY + 0.11,
      w: 1.56,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.2,
      color: TOKENS.slate,
      align: "right",
      margin: 0,
    });
    slide.addShape(SH.roundRect, {
      x: x + 0.92,
      y: rowY + rowH - 0.22,
      w: listW - 1.22,
      h: 0.08,
      rectRadius: 0.02,
      fill: { color: TOKENS.mist },
      line: { color: TOKENS.mist },
    });
    slide.addShape(SH.roundRect, {
      x: x + 0.92,
      y: rowY + rowH - 0.22,
      w: barW,
      h: 0.08,
      rectRadius: 0.02,
      fill: { color: accent },
      line: { color: accent },
    });
  });

  addSurface(slide, SH, x + listW + 0.28, innerY, summaryW - 0.12, innerH, {
    fill: TOKENS.softNeutral,
    line: TOKENS.softNeutral,
  });
  slide.addText(opts.summaryTitle || "Qué conviene leer", {
    x: x + listW + 0.46,
    y: innerY + 0.16,
    w: summaryW - 0.48,
    h: 0.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.4,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  slide.addText(
    opts.summaryBody ||
      "peso de recursos, orden de carga, terceros y si lo principal aparece tarde frente a elementos secundarios.",
    {
      x: x + listW + 0.46,
      y: innerY + 0.44,
      w: summaryW - 0.52,
      h: innerH - 0.58,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.7,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
    }
  );

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addQualityDimensionsPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const dimensions = (opts.dimensions || [
    {
      title: "SEO tecnico",
      body: "la pagina debe dejar claro de que trata y como se estructura",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "Rendimiento",
      body: "cargar mejor tambien es parte de la experiencia real",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      title: "Accesibilidad",
      body: "una interfaz clara debe poder leerse y usarse mejor",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      title: "Auditoria",
      body: "medir y revisar permite pasar de intuicion a evidencia",
      accent: TOKENS.navy,
      fill: TOKENS.mist,
    },
  ]).slice(0, 4);
  const footerReserve = opts.footer ? 0.3 : 0;
  const compact = w < 8;
  const cols = compact ? 2 : Math.max(1, dimensions.length);
  const rows = compact ? Math.ceil(dimensions.length / 2) : 1;
  const gapX = 0.18;
  const gapY = 0.18;
  const bodyY = y + 0.86;
  const bodyH = h - 1.1 - footerReserve;
  const cardW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cardH = (bodyH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Capas de calidad web", {
    fill: TOKENS.softNeutral,
  });

  slide.addShape(SH.roundRect, {
    x: x + w / 2 - 0.86,
    y: y + 0.5,
    w: 1.72,
    h: 0.24,
    rectRadius: 0.04,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText(opts.centerLabel || "Calidad web", {
    x: x + w / 2 - 0.74,
    y: y + 0.56,
    w: 1.48,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.6,
    bold: true,
    color: TOKENS.white,
    align: "center",
    margin: 0,
  });

  dimensions.forEach((dimension, index) => {
    const col = compact ? index % cols : index;
    const row = compact ? Math.floor(index / cols) : 0;
    const cardX = x + 0.16 + col * (cardW + gapX);
    const cardY = bodyY + row * (cardH + gapY);
    const accent = dimension.accent || TOKENS.navy;
    const fill = dimension.fill || TOKENS.softBlue;

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(dimension.title || "Dimension", {
      x: cardX + 0.28,
      y: cardY + 0.16,
      w: cardW - 0.42,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 11.6 : 12,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(dimension.body || "", {
      x: cardX + 0.28,
      y: cardY + 0.42,
      w: cardW - 0.42,
      h: Math.max(0.3, cardH - 0.56),
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 8.1 : 8.4,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addAuditEvidenceBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = (opts.items || [
    {
      title: "Documento",
      body: "title, headings, meta y estructura ayudan a entender la pagina",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "Recursos",
      body: "imagenes, CSS, JS y terceros muestran donde se va el peso",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      title: "Metricas",
      body: "LCP, CLS e INP acercan la lectura tecnica a la experiencia real",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      title: "Alertas",
      body: "auditorias y paneles senalan problemas, pero no todos pesan igual",
      accent: TOKENS.navy,
      fill: TOKENS.mist,
    },
  ]).slice(0, 4);
  const steps = (opts.steps || [
    "leer la senal",
    "ordenar impacto",
    "validar en navegador",
  ]).slice(0, 3);
  const footerReserve = opts.footer ? 0.3 : 0;
  const compact = w < 7.8;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const gap = 0.18;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Evidencia que conviene leer", {
    fill: TOKENS.softBlue,
  });

  const drawEvidenceTile = (tileX, tileY, tileW, tileH, item) => {
    const accent = item.accent || TOKENS.navy;
    const fill = item.fill || TOKENS.softBlue;

    addSurface(slide, SH, tileX, tileY, tileW, tileH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: tileX + 0.1,
      y: tileY + 0.12,
      w: 0.08,
      h: tileH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(item.title || "Senal", {
      x: tileX + 0.28,
      y: tileY + 0.16,
      w: tileW - 0.4,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.body || "", {
      x: tileX + 0.28,
      y: tileY + 0.4,
      w: tileW - 0.42,
      h: Math.max(0.28, tileH - 0.52),
      fontFace: TYPOGRAPHY.body,
      fontSize: 8,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  };

  if (compact) {
    const gridH = Math.max(1.58, bodyH * 0.56);
    const summaryY = bodyY + gridH + gap;
    const summaryH = bodyH - gridH - gap;
    const tileW = (w - 0.32 - gap) / 2;
    const tileH = (gridH - gap) / 2;

    items.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      drawEvidenceTile(
        x + 0.16 + col * (tileW + gap),
        bodyY + row * (tileH + gap),
        tileW,
        tileH,
        item
      );
    });

    addSurface(slide, SH, x + 0.16, summaryY, w - 0.32, summaryH, {
      fill: TOKENS.softNeutral,
      line: TOKENS.softNeutral,
    });
    slide.addText(opts.insightTitle || "Lectura tecnica", {
      x: x + 0.32,
      y: summaryY + 0.16,
      w: w - 0.64,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(
      opts.insightBody ||
        "La calidad se vuelve visible cuando cruzamos documento, recursos, metricas y alertas con criterio.",
      {
        x: x + 0.32,
        y: summaryY + 0.38,
        w: w - 0.64,
        h: Math.max(0.24, summaryH - 0.62),
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.2,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
      }
    );
  } else {
    const leftW = Math.max(4.36, Math.min(w * 0.63, w - 2.26));
    const rightW = w - leftW - gap - 0.32;
    const leftX = x + 0.16;
    const rightX = leftX + leftW + gap;
    const tileW = (leftW - gap) / 2;
    const tileH = (bodyH - gap) / 2;

    items.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      drawEvidenceTile(
        leftX + col * (tileW + gap),
        bodyY + row * (tileH + gap),
        tileW,
        tileH,
        item
      );
    });

    addSurface(slide, SH, rightX, bodyY, rightW, bodyH, {
      fill: TOKENS.softNeutral,
      line: TOKENS.softNeutral,
    });
    slide.addText(opts.insightTitle || "Lectura tecnica", {
      x: rightX + 0.16,
      y: bodyY + 0.16,
      w: rightW - 0.32,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(
      opts.insightBody ||
        "No todo hallazgo pesa igual. La tarea es cruzar estructura, carga, metricas y alertas antes de decidir.",
      {
        x: rightX + 0.16,
        y: bodyY + 0.38,
        w: rightW - 0.32,
        h: 0.54,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.3,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
      }
    );

    steps.forEach((step, index) => {
      const rowY = bodyY + 1.06 + index * 0.46;
      const accent = index === 0 ? TOKENS.red : index === 1 ? TOKENS.gold : TOKENS.navy;
      slide.addShape(SH.roundRect, {
        x: rightX + 0.16,
        y: rowY,
        w: rightW - 0.32,
        h: 0.3,
        rectRadius: 0.03,
        fill: { color: TOKENS.white },
        line: { color: TOKENS.border, pt: 1 },
      });
      slide.addShape(SH.ellipse, {
        x: rightX + 0.26,
        y: rowY + 0.1,
        w: 0.1,
        h: 0.1,
        fill: { color: accent },
        line: { color: accent },
      });
      slide.addText(step, {
        x: rightX + 0.42,
        y: rowY + 0.08,
        w: rightW - 0.58,
        h: 0.12,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.4,
        bold: true,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
      });
    });
  }

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addAuditScorePanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = (opts.items || [
    { label: "SEO", score: 94, note: "estructura y metadatos comprensibles" },
    { label: "Rendimiento", score: 72, note: "hay costo visible en la primera vista" },
    { label: "Accesibilidad", score: 89, note: "la base está razonable, pero faltan ajustes" },
    { label: "Buenas prácticas", score: 86, note: "sirve como lectura inicial, no como juicio final" },
  ]).slice(0, 4);
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.18;
  const compact = w < 7 || h < 2.9;
  const cols = compact ? 2 : Math.max(1, items.length);
  const rows = compact ? Math.ceil(items.length / 2) : 1;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const cardW = (w - 0.32 - gap * (cols - 1)) / cols;
  const cardH = (bodyH - gap * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Lectura rápida de auditoría", {
    fill: TOKENS.softBlue,
  });

  items.forEach((item, index) => {
    const col = compact ? index % cols : index;
    const row = compact ? Math.floor(index / cols) : 0;
    const cardX = x + 0.16 + col * (cardW + gap);
    const cardY = bodyY + row * (cardH + gap);
    const tone = scoreTone(Number(item.score || 0));
    const ringSize = Math.min(0.62, Math.max(0.4, cardH * 0.34));

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill: tone.fill,
      line: tone.fill,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: tone.ring },
      line: { color: tone.ring },
    });
    slide.addText(item.label || "Score", {
      x: cardX + 0.28,
      y: cardY + 0.16,
      w: cardW - 1.08,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 10.8 : 11.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addShape(SH.ellipse, {
      x: cardX + cardW - ringSize - 0.18,
      y: cardY + 0.12,
      w: ringSize,
      h: ringSize,
      fill: { color: TOKENS.white },
      line: { color: tone.ring, pt: ringSize < 0.5 ? 2.4 : 3.2 },
    });
    slide.addText(String(item.score ?? ""), {
      x: cardX + cardW - ringSize - 0.18,
      y: cardY + 0.12 + ringSize * 0.29,
      w: ringSize,
      h: ringSize * 0.28,
      fontFace: TYPOGRAPHY.display,
      fontSize: ringSize < 0.5 ? 10.6 : 13.4,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
    });
    slide.addText(item.note || "", {
      x: cardX + 0.28,
      y: cardY + 0.56,
      w: cardW - 0.42,
      h: Math.max(0.24, cardH - 0.72),
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 7.6 : 8.1,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addAccessibilityChecklistPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = (opts.items || [
    { label: "Contraste", note: "el texto debe sostener lectura sobre el fondo", status: "critical" },
    { label: "Labels", note: "campos y controles no deberían quedar anónimos", status: "warn" },
    { label: "Texto alternativo", note: "las imágenes relevantes necesitan contexto", status: "warn" },
    { label: "Foco visible", note: "el recorrido de teclado no puede desaparecer", status: "ok" },
  ]).slice(0, 6);
  const footerReserve = opts.footer ? 0.28 : 0;
  const compact = w < 7.4 || items.length <= 3;
  const cols = compact ? 1 : 2;
  const rows = Math.ceil(items.length / cols);
  const gapX = 0.18;
  const gapY = 0.16;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const cardW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cardH = (bodyH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Checklist inicial de accesibilidad", {
    fill: TOKENS.softNeutral,
  });

  items.forEach((item, index) => {
    const col = compact ? 0 : index % cols;
    const row = compact ? index : Math.floor(index / cols);
    const cardX = x + 0.16 + col * (cardW + gapX);
    const cardY = bodyY + row * (cardH + gapY);
    const status = item.status || "warn";
    const accent =
      status === "critical" ? TOKENS.red : status === "ok" ? TOKENS.success : TOKENS.gold;
    const fill =
      status === "critical" ? TOKENS.paleRed : status === "ok" ? TOKENS.successSoft : TOKENS.warm;
    const badgeText =
      status === "critical" ? "crítico" : status === "ok" ? "ok" : "revisar";

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(item.label || "Criterio", {
      x: cardX + 0.28,
      y: cardY + 0.16,
      w: cardW - 1.08,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addShape(SH.roundRect, {
      x: cardX + cardW - 0.88,
      y: cardY + 0.12,
      w: 0.72,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(badgeText, {
      x: cardX + cardW - 0.82,
      y: cardY + 0.18,
      w: 0.6,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.2,
      bold: true,
      color: accent,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.note || "", {
      x: cardX + 0.28,
      y: cardY + 0.44,
      w: cardW - 0.42,
      h: Math.max(0.22, cardH - 0.56),
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 7.8 : 8,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addIssuePriorityMatrix(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = (opts.items || [
    { label: "Contraste pobre", impact: "high", urgency: "high", accent: TOKENS.red, fill: TOKENS.paleRed },
    { label: "Links ambiguos", impact: "high", urgency: "low", accent: TOKENS.gold, fill: TOKENS.warm },
    { label: "Alt ausente", impact: "low", urgency: "high", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { label: "Orden visual irregular", impact: "low", urgency: "low", accent: TOKENS.navy, fill: TOKENS.white },
  ]).slice(0, 8);
  const footerReserve = opts.footer ? 0.28 : 0;
  const matrixX = x + 0.54;
  const matrixY = y + 0.9;
  const matrixW = w - 0.82;
  const matrixH = h - 1.22 - footerReserve;
  const quadW = matrixW / 2;
  const quadH = matrixH / 2;
  const quadrantTitles = {
    "high-high": "resolver primero",
    "high-low": "planificar pronto",
    "low-high": "atender rápido",
    "low-low": "vigilar",
  };

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Impacto y prioridad de hallazgos", {
    fill: TOKENS.softBlue,
  });

  slide.addText(opts.yAxisLabel || "Impacto", {
    x: x + 0.08,
    y: matrixY + matrixH / 2 - 0.08,
    w: 0.28,
    h: 0.16,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.4,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    rotate: 270,
    align: "center",
  });
  slide.addText(opts.xAxisLabel || "Urgencia", {
    x: matrixX + matrixW / 2 - 0.5,
    y: y + h - footerReserve - 0.24,
    w: 1,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.4,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
  });

  const quadrants = [
    { key: "high-low", x: matrixX, y: matrixY, fill: TOKENS.warm },
    { key: "high-high", x: matrixX + quadW, y: matrixY, fill: TOKENS.paleRed },
    { key: "low-low", x: matrixX, y: matrixY + quadH, fill: TOKENS.white },
    { key: "low-high", x: matrixX + quadW, y: matrixY + quadH, fill: TOKENS.softBlue },
  ];

  quadrants.forEach((quadrant) => {
    addSurface(slide, SH, quadrant.x, quadrant.y, quadW - 0.06, quadH - 0.06, {
      fill: quadrant.fill,
      line: TOKENS.border,
    });
    slide.addText(quadrantTitles[quadrant.key], {
      x: quadrant.x + 0.14,
      y: quadrant.y + 0.12,
      w: quadW - 0.34,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.2,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
  });

  const grouped = {
    "high-high": [],
    "high-low": [],
    "low-high": [],
    "low-low": [],
  };
  items.forEach((item) => {
    const key = `${item.impact || "low"}-${item.urgency || "low"}`;
    if (grouped[key]) grouped[key].push(item);
  });

  Object.entries(grouped).forEach(([key, group]) => {
    const isHighImpact = key.startsWith("high");
    const isHighUrgency = key.endsWith("high");
    const baseX = matrixX + (isHighUrgency ? quadW : 0);
    const baseY = matrixY + (isHighImpact ? 0 : quadH);
    group.forEach((item, index) => {
      const chipY = baseY + 0.34 + index * 0.32;
      if (chipY + 0.24 > baseY + quadH - 0.1) {
        return;
      }
      slide.addShape(SH.roundRect, {
        x: baseX + 0.14,
        y: chipY,
        w: quadW - 0.34,
        h: 0.22,
        rectRadius: 0.03,
        fill: { color: item.fill || TOKENS.white },
        line: { color: item.accent || TOKENS.navy, pt: 1 },
      });
      slide.addText(item.label || "hallazgo", {
        x: baseX + 0.22,
        y: chipY + 0.05,
        w: quadW - 0.5,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.8,
        bold: true,
        color: item.accent || TOKENS.navy,
        margin: 0,
        fit: "shrink",
      });
    });
  });

  slide.addText("alto", {
    x: matrixX - 0.24,
    y: matrixY + 0.1,
    w: 0.18,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 7.6,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addText("bajo", {
    x: matrixX - 0.24,
    y: matrixY + matrixH - 0.22,
    w: 0.18,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 7.6,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addText("baja", {
    x: matrixX + 0.12,
    y: matrixY + matrixH + 0.04,
    w: 0.3,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 7.6,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addText("alta", {
    x: matrixX + matrixW - 0.34,
    y: matrixY + matrixH + 0.04,
    w: 0.24,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 7.6,
    color: TOKENS.slate,
    margin: 0,
    align: "right",
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addSeoSnippetPreview(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.borderColor || TOKENS.border,
  });

  if (opts.title) {
    slide.addText(opts.title, {
      x: x + 0.18,
      y: y + 0.18,
      w: w - 0.36,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13.2,
      bold: true,
      color: opts.titleColor || TOKENS.titleFill,
      margin: 0,
      fit: "shrink",
    });
  }

  const metaY = y + 0.62;
  if (opts.breadcrumb) {
    slide.addText(opts.breadcrumb, {
      x: x + 0.18,
      y: metaY,
      w: w - 0.36,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
  }

  slide.addText(opts.url || "https://example.com/guia-accesibilidad", {
    x: x + 0.18,
    y: metaY + (opts.breadcrumb ? 0.13 : 0),
    w: w - 0.36,
    h: 0.14,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.4,
    color: opts.urlColor || TOKENS.success,
    margin: 0,
    fit: "shrink",
  });

  slide.addText(
    opts.description ||
      "Introducción a estructura semántica, contraste, formularios y revisión básica de accesibilidad web.",
    {
      x: x + 0.18,
      y: y + 0.94,
      w: w - 0.36,
      h: Math.max(0.26, h - 1.12),
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: opts.descriptionColor || TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    }
  );
}

function addCascadeInspector(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const rules = opts.rules || [];
  const compactInspector = w < 7.2;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Inspector de cascada", {
    fill: TOKENS.softBlue,
  });

  const elementW = opts.elementW || Math.max(1.24, Math.min(1.72, w * (compactInspector ? 0.2 : 0.22)));
  const resultW = opts.resultW || Math.max(1.3, Math.min(1.58, w * (compactInspector ? 0.22 : 0.24)));
  const inspectorGap = opts.gap || (compactInspector ? 0.24 : 0.22);
  const stackX = x + 0.2 + elementW + inspectorGap;
  const stackW = w - elementW - resultW - inspectorGap * 2 - 0.4;
  const stackY = y + 0.72;
  const stackH = h - 1;
  const connectorW = opts.connectorW || (compactInspector ? 0.2 : 0.22);
  const connectorH = opts.connectorH || (compactInspector ? 0.28 : 0.3);
  const connectorY = y + h / 2 - connectorH / 2;

  slide.addShape(SH.roundRect, {
    x: x + 0.2,
    y: y + 0.92,
    w: elementW,
    h: h - 1.38,
    rectRadius: 0.04,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.border, pt: 1 },
  });
  slide.addText(opts.elementLabel || "<p class=\"destacado\">", {
    x: x + 0.34,
    y: y + 1.12,
    w: elementW - 0.28,
    h: 0.32,
    fontFace: TYPOGRAPHY.mono,
    fontSize: compactInspector ? 9.4 : 10.2,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  slide.addText(opts.propertyLabel || "Propiedad observada", {
    x: x + 0.34,
    y: y + 1.56,
    w: elementW - 0.28,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.9,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addShape(SH.roundRect, {
    x: x + 0.34,
    y: y + 1.82,
    w: elementW - 0.28,
    h: 0.38,
    rectRadius: 0.03,
    fill: { color: TOKENS.warm },
    line: { color: TOKENS.warm },
  });
  slide.addText(opts.propertyValue || "color", {
    x: x + 0.44,
    y: y + 1.94,
    w: elementW - 0.48,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.2,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });

  slide.addShape(SH.chevron, {
    x: x + 0.2 + elementW + (inspectorGap - connectorW) / 2,
    y: connectorY,
    w: connectorW,
    h: connectorH,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red },
  });

  slide.addShape(SH.roundRect, {
    x: stackX,
    y: stackY,
    w: stackW,
    h: stackH,
    rectRadius: 0.04,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.border, pt: 1 },
  });

  const rowGap = 0.12;
  const visibleRules = rules.slice(0, 4);
  const rawRowH =
    (stackH - 0.3 - rowGap * (Math.max(visibleRules.length, 1) - 1)) / Math.max(visibleRules.length, 1);
  const rowH = Math.max(compactInspector ? 0.52 : 0.56, Math.min(compactInspector ? 0.78 : 0.82, rawRowH));
  visibleRules.forEach((rule, index) => {
    const rowY = stackY + 0.14 + index * (rowH + rowGap);
    const active = Boolean(rule.active);
    const selectorW = Math.max(0.72, stackW * (compactInspector ? 0.32 : 0.34));
    const declarationW = Math.max(0.72, stackW * (compactInspector ? 0.36 : 0.38));
    const badgeW = compactInspector ? 0.7 : 0.78;
    const badgeX = stackX + stackW - (compactInspector ? 0.98 : 1.08);
    slide.addShape(SH.roundRect, {
      x: stackX + 0.12,
      y: rowY,
      w: stackW - 0.24,
      h: rowH,
      rectRadius: 0.03,
      fill: { color: active ? TOKENS.paleRed : TOKENS.white },
      line: { color: active ? TOKENS.red : TOKENS.border, pt: active ? 1.2 : 1 },
    });
    slide.addShape(SH.rect, {
      x: stackX + 0.12,
      y: rowY,
      w: 0.08,
      h: rowH,
      fill: { color: active ? TOKENS.red : TOKENS.navy },
      line: { color: active ? TOKENS.red : TOKENS.navy },
    });
    slide.addText(rule.selector || ".card", {
      x: stackX + 0.28,
      y: rowY + 0.08,
      w: selectorW,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: compactInspector ? 8.4 : 9.2,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(rule.declaration || "color: var(--ink);", {
      x: stackX + 0.28,
      y: rowY + (compactInspector ? 0.28 : 0.26),
      w: declarationW,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: compactInspector ? 7.9 : 8.5,
      color: TOKENS.ink,
      margin: 0,
    });
    slide.addShape(SH.roundRect, {
      x: badgeX,
      y: rowY + 0.08,
      w: badgeW,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: active ? TOKENS.red : TOKENS.softNeutral },
      line: { color: active ? TOKENS.red : TOKENS.softNeutral },
    });
    slide.addText(rule.specificity || "0,1,0", {
      x: badgeX + 0.06,
      y: rowY + 0.135,
      w: badgeW - 0.12,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: compactInspector ? 7.6 : 8.1,
      bold: true,
      color: active ? TOKENS.white : TOKENS.navy,
      align: "center",
      margin: 0,
    });
    slide.addText(rule.reason || (active ? "aplica" : "pierde por peso u orden"), {
      x: badgeX - (compactInspector ? 0.02 : 0.08),
      y: rowY + rowH - 0.17,
      w: compactInspector ? 0.82 : 0.9,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: compactInspector ? 7.1 : 7.6,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  });

  slide.addShape(SH.chevron, {
    x: stackX + stackW + (inspectorGap - connectorW) / 2,
    y: connectorY,
    w: connectorW,
    h: connectorH,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  slide.addShape(SH.roundRect, {
    x: x + w - resultW - 0.2,
    y: y + 0.92,
    w: resultW,
    h: h - 1.38,
    rectRadius: 0.04,
    fill: { color: TOKENS.softBlue },
    line: { color: TOKENS.softBlue },
  });
  slide.addText(opts.resultLabel || "Resultado", {
    x: x + w - resultW - 0.04,
    y: y + 1.12,
    w: resultW - 0.32,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 13,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });
  slide.addShape(SH.roundRect, {
    x: x + w - resultW - 0.06,
    y: y + 1.56,
    w: resultW - 0.28,
    h: 0.42,
    rectRadius: 0.03,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });
  slide.addText(opts.resolvedValue || "#d62027", {
    x: x + w - resultW - 0.02,
    y: y + 1.7,
    w: resultW - 0.36,
    h: 0.1,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10,
    bold: true,
    color: TOKENS.red,
    align: "center",
    margin: 0,
  });
  const resultNote =
    opts.resultNote === undefined ? "la regla activa domina la propiedad final" : opts.resultNote;
  if (resultNote) {
    slide.addText(resultNote, {
      x: x + w - resultW - 0.06,
      y: y + 2.16,
      w: resultW - 0.28,
      h: 0.36,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.9,
      color: TOKENS.ink,
      align: "center",
      valign: "mid",
      margin: 0,
    });
  }
}

function addSpecificityScale(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const entries = opts.entries || [
    { label: "Etiqueta", value: "0,0,1", weightLabel: "bajo" },
    { label: "Clase", value: "0,1,0", weightLabel: "medio" },
    { label: "ID", value: "1,0,0", weightLabel: "alto", active: true },
    { label: "Inline", value: "inline", weightLabel: "máximo" },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Escala de especificidad", {
    fill: TOKENS.paleRed,
  });

  const compact = h < 1.8;
  if (!compact) {
    slide.addText(opts.subtitle || "a medida que el selector gana precisión, también gana peso", {
      x: x + 0.2,
      y: y + 0.56,
      w: w - 0.4,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.1,
      color: TOKENS.slate,
      margin: 0,
    });
  }

  const trackX = x + 0.4;
  const trackY = y + h - 0.72;
  const trackW = w - 0.8;
  if (!compact) {
    slide.addShape(SH.rect, {
      x: trackX,
      y: trackY,
      w: trackW,
      h: 0.06,
      fill: { color: TOKENS.guide },
      line: { color: TOKENS.guide },
    });
  }

  const maxBarW = trackW - 0.6;
  const barYBase = compact ? y + 0.58 : y + 0.98;
  const gap = compact ? 0.08 : 0.16;
  const availableH = compact
    ? Math.max(0.9, h - 0.72)
    : Math.max(1.2, trackY - barYBase - 0.08);
  const rowH = Math.max(
    compact ? 0.2 : 0.28,
    Math.min(0.56, (availableH - gap * (entries.length - 1)) / Math.max(entries.length, 1))
  );

  entries.slice(0, 5).forEach((entry, index) => {
    const currentY = barYBase + index * (rowH + gap);
    const tone = entry.active ? TOKENS.red : index >= 2 ? TOKENS.navy : TOKENS.sand;
    const fill = entry.active ? TOKENS.paleRed : index >= 2 ? TOKENS.softBlue : TOKENS.warm;
    const factor = entry.scale || (index === 0 ? 0.28 : index === 1 ? 0.48 : index === 2 ? 0.72 : index === 3 ? 0.94 : 0.82);
    const barW = Math.max(1.3, maxBarW * factor);

    slide.addText(entry.label || "Clase", {
      x: x + 0.26,
      y: currentY + (compact ? 0.07 : 0.12),
      w: 1.12,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 9.6 : 11.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });

    slide.addShape(SH.roundRect, {
      x: x + 1.48,
      y: currentY,
      w: barW,
      h: rowH,
      rectRadius: 0.03,
      fill: { color: fill },
      line: { color: tone, pt: entry.active ? 1.4 : 1 },
    });
    slide.addShape(SH.rect, {
      x: x + 1.48,
      y: currentY,
      w: 0.1,
      h: rowH,
      fill: { color: tone },
      line: { color: tone },
    });
    slide.addText(entry.value || "0,1,0", {
      x: x + 1.68,
      y: currentY + (compact ? 0.07 : 0.11),
      w: 0.72,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: compact ? 8.2 : 9.2,
      bold: true,
      color: entry.active ? TOKENS.red : TOKENS.navy,
      margin: 0,
    });
    slide.addText(entry.weightLabel || "medio", {
      x: x + 2.48,
      y: currentY + (compact ? 0.07 : 0.11),
      w: barW - 1.02,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 7.8 : 8.9,
      color: TOKENS.ink,
      margin: 0,
    });
  });

  if (opts.footer && !compact) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.34,
      w: w - 0.44,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addTokenBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const groups = opts.groups || [
    {
      title: "Color",
      tone: TOKENS.red,
      items: [
        { label: "--color-primario", value: "#D62027", swatch: TOKENS.red },
        { label: "--text-main", value: "#102A43", swatch: TOKENS.navy },
      ],
    },
    {
      title: "Espacio",
      tone: TOKENS.gold,
      items: [
        { label: "--space-sm", value: "8px" },
        { label: "--space-md", value: "16px" },
      ],
    },
    {
      title: "Superficie",
      tone: TOKENS.navy,
      items: [
        { label: "--surface-card", value: "#FFFFFF", swatch: TOKENS.white },
        { label: "--radius-md", value: "12px" },
      ],
    },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Tablero de tokens", {
    fill: TOKENS.softNeutral,
  });

  const visibleGroups = groups.slice(0, 4);
  const gap = 0.18;
  const groupW = (w - 0.4 - gap * (visibleGroups.length - 1)) / visibleGroups.length;
  const footerReserve = opts.footer ? 0.34 : 0;
  visibleGroups.forEach((group, index) => {
    const groupX = x + 0.2 + index * (groupW + gap);
    const tone = group.tone || (index === 0 ? TOKENS.red : index === 1 ? TOKENS.gold : TOKENS.navy);
    const fill = group.fill || (index === 0 ? TOKENS.paleRed : index === 1 ? TOKENS.warm : TOKENS.softBlue);

    slide.addShape(SH.roundRect, {
      x: groupX,
      y: y + 0.72,
      w: groupW,
      h: h - 0.94 - footerReserve,
      rectRadius: 0.04,
      fill: { color: fill },
      line: { color: fill },
    });
    slide.addShape(SH.rect, {
      x: groupX,
      y: y + 0.72,
      w: 0.1,
      h: h - 0.94 - footerReserve,
      fill: { color: tone },
      line: { color: tone },
    });
    slide.addText(group.title || "Grupo", {
      x: groupX + 0.2,
      y: y + 0.88,
      w: groupW - 0.28,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });

    const items = group.items || [];
    items.slice(0, 4).forEach((item, itemIndex) => {
      const itemY = y + 1.26 + itemIndex * 0.56;
      const hasSwatch = Boolean(item.swatch);
      const labelFontSize = hasSwatch && String(item.label || "").length > 14 ? 7.6 : 8.2;
      const labelX = groupX + (hasSwatch ? 0.48 : 0.24);
      const labelW = groupW - (hasSwatch ? 0.82 : 0.52);
      const valueX = labelX;
      const valueW = labelW;
      slide.addShape(SH.roundRect, {
        x: groupX + 0.16,
        y: itemY,
        w: groupW - 0.3,
        h: 0.42,
        rectRadius: 0.03,
        fill: { color: TOKENS.white },
        line: { color: TOKENS.border, pt: 1 },
      });
      if (hasSwatch) {
        slide.addShape(SH.roundRect, {
          x: groupX + 0.24,
          y: itemY + 0.11,
          w: 0.16,
          h: 0.16,
          rectRadius: 0.03,
          fill: { color: item.swatch },
          line: { color: item.swatch === TOKENS.white ? TOKENS.border : item.swatch, pt: 1 },
        });
      }
      slide.addText(item.label || "--token", {
        x: labelX,
        y: itemY + 0.08,
        w: labelW,
        h: 0.12,
        fontFace: TYPOGRAPHY.mono,
        fontSize: labelFontSize,
        color: TOKENS.navy,
        margin: 0,
      });
      slide.addText(item.value || "#FFFFFF", {
        x: valueX,
        y: itemY + 0.22,
        w: valueW,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.4,
        color: TOKENS.slate,
        margin: 0,
      });
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addBreakpointDecisionPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stages = (opts.stages || [
    {
      label: "Amplio",
      sizeLabel: "1280 px",
      note: "la composición todavía respira",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      label: "Tensión",
      sizeLabel: "820 px",
      note: "la lectura empieza a comprimirse",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      active: true,
    },
    {
      label: "Quiebre",
      sizeLabel: "640 px",
      note: "el layout ya pide otra decisión",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
  ]).slice(0, 4);
  const footerReserve = opts.footer ? 0.34 : 0;
  const railY = y + 0.62;
  const railH = 0.92;
  const railGap = 0.1;
  const railInnerW = w - 0.44;
  const stageW = (railInnerW - railGap * Math.max(0, stages.length - 1)) / Math.max(stages.length, 1);
  const bodyY = railY + railH + 0.16;
  const bodyH = h - (bodyY - y) - 0.18 - footerReserve;
  const bodyGap = 0.16;
  const signalW = Math.max(1.92, Math.min(2.56, w * 0.25));
  const focusW = Math.max(1.46, Math.min(1.82, w * 0.17));
  const decisionW = w - 0.44 - signalW - focusW - bodyGap * 2;
  const signalX = x + 0.22;
  const focusX = signalX + signalW + bodyGap;
  const decisionX = focusX + focusW + bodyGap;
  const activeStage = stages.find((stage) => stage.active) || stages[Math.min(1, stages.length - 1)] || {};

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Breakpoint con criterio", {
    fill: TOKENS.softNeutral,
  });

  stages.forEach((stage, index) => {
    const stageX = x + 0.22 + index * (stageW + railGap);
    const accent = stage.accent || TOKENS.navy;
    const fill = stage.fill || TOKENS.white;

    addSurface(slide, SH, stageX, railY, stageW, railH, {
      fill,
      line: stage.active ? accent : fill === TOKENS.white ? TOKENS.border : fill,
      linePt: stage.active ? 1.2 : 1,
    });
    slide.addShape(SH.rect, {
      x: stageX,
      y: railY,
      w: stageW,
      h: 0.08,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(stage.label || "Etapa", {
      x: stageX + 0.1,
      y: railY + 0.14,
      w: stageW - 0.2,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: 9.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
    slide.addShape(SH.roundRect, {
      x: stageX + (stageW - 0.68) / 2,
      y: railY + 0.4,
      w: 0.68,
      h: 0.2,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(stage.sizeLabel || "", {
      x: stageX + (stageW - 0.62) / 2,
      y: railY + 0.45,
      w: 0.62,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7,
      bold: true,
      color: accent,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
    if (stage.note) {
      slide.addText(stage.note, {
        x: stageX + 0.12,
        y: railY + 0.67,
        w: stageW - 0.24,
        h: 0.12,
        fontFace: TYPOGRAPHY.body,
        fontSize: 6.8,
        color: TOKENS.slate,
        margin: 0,
        align: "center",
        fit: "shrink",
      });
    }

    if (index < stages.length - 1) {
      const laneX = stageX + stageW;
      slide.addShape(SH.line, {
        x: laneX + 0.02,
        y: railY + railH / 2,
        w: Math.max(0.02, railGap - 0.12),
        h: 0,
        line: { color: TOKENS.guide, pt: 1.2, beginArrowType: "none", endArrowType: "triangle" },
      });
    }
  });

  [
    {
      x: signalX,
      w: signalW,
      fill: TOKENS.softBlue,
      accent: TOKENS.navy,
      kicker: "Señal",
      title: opts.signalTitle || "Cuando aparece el quiebre",
      body:
        opts.signalBody ||
        "La lectura se aprieta, el CTA pierde foco o una segunda columna ya no ayuda a entender.",
    },
    {
      x: decisionX,
      w: decisionW,
      fill: TOKENS.paleRed,
      accent: TOKENS.red,
      kicker: "Decisión",
      title: opts.decisionTitle || "Qué conviene cambiar",
      body:
        opts.decisionBody ||
        "Apilar, redistribuir, cambiar proporciones o mover piezas para recuperar claridad.",
    },
  ].forEach((card) => {
    addSurface(slide, SH, card.x, bodyY, card.w, bodyH, {
      fill: card.fill,
      line: card.fill,
    });
    slide.addShape(SH.rect, {
      x: card.x + 0.12,
      y: bodyY + 0.14,
      w: 0.1,
      h: bodyH - 0.28,
      fill: { color: card.accent },
      line: { color: card.accent },
    });
    addSurfaceHeader(slide, SH, card.x + 0.3, bodyY + 0.14, 0.82, card.kicker, {
      h: 0.22,
      fill: TOKENS.white,
      fontSize: 8.4,
    });
    slide.addText(card.title, {
      x: card.x + 0.3,
      y: bodyY + 0.46,
      w: card.w - 0.42,
      h: 0.28,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(card.body, {
      x: card.x + 0.3,
      y: bodyY + 0.84,
      w: card.w - 0.42,
      h: bodyH - 1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.9,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });
  });

  addSurface(slide, SH, focusX, bodyY + 0.22, focusW, bodyH - 0.44, {
    fill: TOKENS.warm,
    line: TOKENS.warm,
  });
  slide.addShape(SH.roundRect, {
    x: focusX + 0.12,
    y: bodyY + 0.28,
    w: focusW - 0.24,
    h: 0.24,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.white },
  });
  slide.addText(opts.breakpointTitle || "Quiebre real", {
    x: focusX + 0.18,
    y: bodyY + 0.33,
    w: focusW - 0.36,
    h: 0.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 9.4,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
    fit: "shrink",
  });
  slide.addShape(SH.chevron, {
    x: focusX + 0.18,
    y: bodyY + 0.78,
    w: focusW - 0.36,
    h: 0.22,
    fill: { color: activeStage.accent || TOKENS.gold },
    line: { color: activeStage.accent || TOKENS.gold },
  });
  slide.addShape(SH.roundRect, {
    x: focusX + 0.22,
    y: bodyY + 1.16,
    w: focusW - 0.44,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.white },
  });
  slide.addText(activeStage.sizeLabel || opts.focusSizeLabel || "", {
    x: focusX + 0.28,
    y: bodyY + 1.22,
    w: focusW - 0.56,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8,
    bold: true,
    color: activeStage.accent || TOKENS.red,
    margin: 0,
    align: "center",
    fit: "shrink",
  });
  slide.addText(
    opts.breakpointBody || "No nace de un número dogmático: nace cuando la interfaz deja de leerse igual.",
    {
      x: focusX + 0.18,
      y: bodyY + 1.56,
      w: focusW - 0.36,
      h: Math.max(0.24, bodyH - 1.94),
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.2,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
      valign: "mid",
      fit: "shrink",
    }
  );

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addComponentVariantBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.3 : 0;
  const variants = (opts.variants || [
    {
      label: "Base",
      role: "default",
      description: "la versión estable que fija jerarquía y ritmo",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
      preview: "card",
    },
    {
      label: "Destacada",
      role: "feature",
      description: "sube visibilidad sin romper la familia",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      preview: "card",
    },
    {
      label: "Compacta",
      role: "compact",
      description: "reduce aire sin perder identidad",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      preview: "stack",
    },
    {
      label: "Acción",
      role: "action",
      description: "prioriza respuesta y llamado visible",
      accent: TOKENS.navy,
      fill: TOKENS.white,
      preview: "button",
    },
  ]).slice(0, 4);
  const compact = variants.length > 3 || w < 8.8;
  const cols = compact ? 2 : variants.length;
  const rows = compact ? Math.ceil(variants.length / 2) : 1;
  const gapX = 0.18;
  const gapY = 0.18;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const cardW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cardH = (bodyH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Variantes de un mismo componente", {
    fill: TOKENS.softNeutral,
  });

  variants.forEach((variant, index) => {
    const col = compact ? index % cols : index;
    const row = compact ? Math.floor(index / cols) : 0;
    const cardX = x + 0.16 + col * (cardW + gapX);
    const cardY = bodyY + row * (cardH + gapY);
    const accent = variant.accent || TOKENS.navy;
    const fill = variant.fill || TOKENS.white;
    const preview = variant.preview || "card";
    const contentInset = compact ? 0.28 : 0.3;
    const previewX = cardX + contentInset;
    const previewY = cardY + (compact ? 0.46 : 0.64);
    const previewW = cardW - contentInset * 2;
    const previewH = compact ? 0.44 : Math.max(0.62, cardH - 1.12);

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill,
      line: fill === TOKENS.white ? TOKENS.border : fill,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.1,
      y: cardY + 0.12,
      w: 0.08,
      h: cardH - 0.24,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(variant.label || "Variante", {
      x: cardX + 0.38,
      y: cardY + 0.14,
      w: cardW - 1.14,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addShape(SH.roundRect, {
      x: cardX + cardW - 0.82,
      y: cardY + 0.12,
      w: 0.64,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(variant.role || "", {
      x: cardX + cardW - 0.78,
      y: cardY + 0.17,
      w: 0.56,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      bold: true,
      color: accent,
      margin: 0,
      align: "center",
      fit: "shrink",
    });

    addSurface(slide, SH, previewX, previewY, previewW, previewH, {
      fill: TOKENS.paper,
      line: TOKENS.border,
    });

    if (preview === "button") {
      slide.addShape(SH.roundRect, {
        x: previewX + 0.16,
        y: previewY + previewH / 2 - (compact ? 0.12 : 0.19),
        w: previewW - 0.32,
        h: compact ? 0.24 : 0.38,
        rectRadius: 0.05,
        fill: { color: accent },
        line: { color: accent },
      });
      slide.addText(variant.ctaLabel || "Acción principal", {
        x: previewX + 0.24,
        y: previewY + previewH / 2 - (compact ? 0.06 : 0.11),
        w: previewW - 0.48,
        h: 0.12,
        fontFace: TYPOGRAPHY.body,
        fontSize: compact ? 7.4 : 8.6,
        bold: true,
        color: TOKENS.white,
        margin: 0,
        align: "center",
        fit: "shrink",
      });
    } else if (preview === "stack") {
      [0, 1, 2].forEach((rowIndex) => {
        slide.addShape(SH.roundRect, {
          x: previewX + 0.12,
          y: previewY + 0.08 + rowIndex * (compact ? 0.12 : 0.28),
          w: previewW - 0.24,
          h: compact ? 0.08 : 0.18,
          rectRadius: 0.02,
          fill: { color: rowIndex === 0 ? TOKENS.white : TOKENS.softNeutral },
          line: { color: rowIndex === 0 ? TOKENS.border : TOKENS.softNeutral, pt: 1 },
        });
      });
    } else if (preview === "nav") {
      [0, 1, 2].forEach((tabIndex) => {
        slide.addShape(SH.roundRect, {
          x: previewX + 0.12 + tabIndex * ((previewW - 0.36) / 3),
          y: previewY + (compact ? 0.08 : 0.16),
          w: (previewW - 0.48) / 3,
          h: compact ? 0.12 : 0.22,
          rectRadius: 0.02,
          fill: { color: tabIndex === 0 ? accent : TOKENS.white },
          line: { color: tabIndex === 0 ? accent : TOKENS.border, pt: 1 },
        });
      });
      slide.addShape(SH.roundRect, {
        x: previewX + 0.12,
        y: previewY + (compact ? 0.26 : 0.52),
        w: previewW - 0.24,
        h: compact ? 0.12 : 0.24,
        rectRadius: 0.02,
        fill: { color: TOKENS.softNeutral },
        line: { color: TOKENS.softNeutral },
      });
    } else {
      slide.addShape(SH.roundRect, {
        x: previewX + 0.12,
        y: previewY + (compact ? 0.08 : 0.12),
        w: previewW - 0.24,
        h: compact ? 0.1 : 0.22,
        rectRadius: 0.02,
        fill: { color: accent },
        line: { color: accent },
      });
      slide.addShape(SH.roundRect, {
        x: previewX + 0.12,
        y: previewY + (compact ? 0.22 : 0.44),
        w: previewW - 0.24,
        h: compact ? 0.12 : Math.max(0.12, previewH - 0.76),
        rectRadius: 0.02,
        fill: { color: TOKENS.white },
        line: { color: TOKENS.border, pt: 1 },
      });
      slide.addShape(SH.roundRect, {
        x: previewX + 0.12,
        y: previewY + (compact ? 0.38 : previewH - 0.22),
        w: Math.max(0.7, previewW * 0.42),
        h: compact ? 0.08 : 0.12,
        rectRadius: 0.02,
        fill: { color: accent === TOKENS.red ? TOKENS.paleRed : TOKENS.softBlue },
        line: { color: accent === TOKENS.red ? TOKENS.paleRed : TOKENS.softBlue },
      });
    }

    slide.addText(variant.description || "", {
      x: cardX + contentInset,
      y: cardY + (compact ? 0.94 : cardH - 0.34),
      w: cardW - contentInset * 2,
      h: compact ? 0.14 : 0.22,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 7.6 : 8.6,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addComponentConsistencyPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.3 : 0;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const gap = 0.2;
  const colW = (w - 0.32 - gap) / 2;
  const leftX = x + 0.16;
  const rightX = leftX + colW + gap;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Consistencia entre piezas compartidas", {
    fill: TOKENS.softNeutral,
  });

  [
    {
      x: leftX,
      title: opts.leftTitle || "Repetición manual",
      subtitle: opts.leftSubtitle || "mismas piezas, pero con variaciones accidentales",
      fill: opts.leftFill || TOKENS.paleRed,
      accent: opts.leftAccent || TOKENS.red,
      mode: "manual",
    },
    {
      x: rightX,
      title: opts.rightTitle || "Patrón compartido",
      subtitle: opts.rightSubtitle || "misma familia, con decisiones visibles y estables",
      fill: opts.rightFill || TOKENS.softBlue,
      accent: opts.rightAccent || TOKENS.navy,
      mode: "system",
    },
  ].forEach((column) => {
    addSurface(slide, SH, column.x, bodyY, colW, bodyH, {
      fill: column.fill,
      line: column.fill,
    });
    slide.addShape(SH.rect, {
      x: column.x + 0.12,
      y: bodyY + 0.14,
      w: 0.1,
      h: bodyH - 0.28,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    slide.addText(column.title, {
      x: column.x + 0.32,
      y: bodyY + 0.14,
      w: colW - 0.46,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(column.subtitle, {
      x: column.x + 0.32,
      y: bodyY + 0.36,
      w: colW - 0.46,
      h: 0.2,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });

    if (column.mode === "manual") {
      const rows = [
        { y: bodyY + 0.72, w: colW - 0.56, accent: TOKENS.red, fill: TOKENS.white, label: "Card A" },
        { y: bodyY + 1.08, w: colW - 0.78, accent: TOKENS.gold, fill: TOKENS.white, label: "Card B" },
        { y: bodyY + 1.44, w: colW - 0.66, accent: TOKENS.navy, fill: TOKENS.white, label: "Card C" },
      ];
      rows.forEach((row, index) => {
        slide.addShape(SH.roundRect, {
          x: column.x + 0.32 + index * 0.04,
          y: row.y,
          w: row.w,
          h: 0.3,
          rectRadius: 0.03,
          fill: { color: row.fill },
          line: { color: TOKENS.border, pt: 1 },
        });
        slide.addShape(SH.rect, {
          x: column.x + 0.34 + index * 0.04,
          y: row.y + 0.04,
          w: 0.08,
          h: 0.22,
          fill: { color: row.accent },
          line: { color: row.accent },
        });
        slide.addText(row.label, {
          x: column.x + 0.48 + index * 0.04,
          y: row.y + 0.09,
          w: row.w - 0.18,
          h: 0.1,
          fontFace: TYPOGRAPHY.body,
          fontSize: 8.4,
          bold: true,
          color: TOKENS.ink,
          margin: 0,
        });
      });
      slide.addText(
        opts.leftBody ||
          "Cada pieza se parece a la anterior, pero cambia espaciado, ancho o acentos sin que exista una regla clara.",
        {
          x: column.x + 0.32,
          y: bodyY + 1.88,
          w: colW - 0.5,
          h: Math.max(0.3, bodyH - 2.02),
          fontFace: TYPOGRAPHY.body,
          fontSize: 8.6,
          color: TOKENS.ink,
          margin: 0,
          valign: "mid",
          fit: "shrink",
        }
      );
    } else {
      [0, 1, 2].forEach((rowIndex) => {
        slide.addShape(SH.roundRect, {
          x: column.x + 0.32,
          y: bodyY + 0.74 + rowIndex * 0.36,
          w: colW - 0.5,
          h: 0.24,
          rectRadius: 0.03,
          fill: { color: TOKENS.white },
          line: { color: TOKENS.border, pt: 1 },
        });
        slide.addShape(SH.rect, {
          x: column.x + 0.34,
          y: bodyY + 0.82 + rowIndex * 0.44,
          w: 0.08,
          h: 0.22,
          fill: { color: column.accent },
          line: { color: column.accent },
        });
      });
      slide.addShape(SH.roundRect, {
        x: column.x + 0.32,
        y: bodyY + 1.9,
        w: colW - 0.5,
        h: 0.3,
        rectRadius: 0.04,
        fill: { color: column.accent },
        line: { color: column.accent },
      });
      slide.addText(
        opts.rightBody ||
          "Las piezas comparten ritmo, borde, acento y jerarquía. Cambian por intención, no por accidente visual.",
        {
          x: column.x + 0.32,
          y: bodyY + 2.3,
          w: colW - 0.5,
          h: Math.max(0.24, bodyH - 2.42),
          fontFace: TYPOGRAPHY.body,
          fontSize: 8.6,
          color: TOKENS.ink,
          margin: 0,
          valign: "mid",
          fit: "shrink",
        }
      );
    }
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addEvaluationRubricPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const rows = (opts.rows || [
    {
      label: "HTML y semántica",
      weight: 20,
      note: "Jerarquía clara, tags correctas y estructura legible.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      label: "CSS y sistema visual",
      weight: 20,
      note: "Tokens, spacing, jerarquía y consistencia entre secciones.",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      label: "Responsive y versión móvil",
      weight: 20,
      note: "La página se adapta bien y conserva claridad en celular.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      label: "Calidad visual general",
      weight: 15,
      note: "Debe sentirse real, no escolar ni de juguete.",
      accent: TOKENS.navy,
      fill: TOKENS.mist,
    },
    {
      label: "Accesibilidad básica",
      weight: 10,
      note: "Contraste, labels, alt y lectura razonable.",
      accent: TOKENS.success,
      fill: TOKENS.successSoft,
    },
    {
      label: "Uso de Codex con criterio",
      weight: 10,
      note: "Buen contexto, iteración útil y validación humana.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      label: "Entrega",
      weight: 5,
      note: "Orden, limpieza y método de entrega consistente.",
      accent: TOKENS.gold,
      fill: TOKENS.warningSoft,
    },
  ]).slice(0, 7);
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.12;
  const compact = h < 4 || rows.length > 6;
  const summaryH = 0.44;
  const rowsY = y + 1.02;
  const availableRowsH = h - 1.24 - footerReserve;
  const rowH = Math.max(0.42, (availableRowsH - gap * (rows.length - 1)) / Math.max(rows.length, 1));
  const maxWeight = Math.max(...rows.map((row) => Number(row.weight || 0)), 1);

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Rúbrica de evaluación", {
    fill: TOKENS.softNeutral,
  });

  addSurface(slide, SH, x + 0.16, y + 0.62, w - 0.32, summaryH, {
    fill: TOKENS.paper,
    line: TOKENS.paper,
  });
  slide.addText("Qué pesa más en la nota", {
    x: x + 0.3,
    y: y + 0.73,
    w: w - 1.62,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  slide.addShape(SH.roundRect, {
    x: x + w - 1.3,
    y: y + 0.7,
    w: 0.98,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText(opts.totalLabel || "100 pts", {
    x: x + w - 1.22,
    y: y + 0.76,
    w: 0.82,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.6,
    bold: true,
    color: TOKENS.white,
    margin: 0,
    align: "center",
  });

  rows.forEach((row, index) => {
    const rowY = rowsY + index * (rowH + gap);
    const accent = row.accent || TOKENS.navy;
    const fill = row.fill || TOKENS.softBlue;
    const weight = Number(row.weight || 0);
    const labelW = Math.max(1.4, w * 0.34);
    const noteX = x + labelW + 0.34;
    const noteW = Math.max(2.2, w - labelW - 1.66);
    const badgeW = compact ? 0.72 : 0.84;
    const barY = rowY + rowH - 0.16;
    const trackX = x + 0.26;
    const trackW = w - 1.5;

    addSurface(slide, SH, x + 0.16, rowY, w - 0.32, rowH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: x + 0.16,
      y: rowY,
      w: 0.08,
      h: rowH,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(row.label || "Criterio", {
      x: x + 0.32,
      y: rowY + 0.11,
      w: labelW - 0.18,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 10.6 : 11.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addShape(SH.roundRect, {
      x: x + w - badgeW - 0.32,
      y: rowY + 0.1,
      w: badgeW,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(row.weightLabel || `${weight}%`, {
      x: x + w - badgeW - 0.26,
      y: rowY + 0.16,
      w: badgeW - 0.12,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.4,
      bold: true,
      color: accent,
      margin: 0,
      align: "center",
    });
    slide.addText(row.note || "", {
      x: noteX,
      y: rowY + 0.11,
      w: noteW - 0.12,
      h: Math.max(0.14, rowH - 0.24),
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 7.2 : 7.8,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
    slide.addShape(SH.roundRect, {
      x: trackX,
      y: barY,
      w: trackW,
      h: 0.06,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addShape(SH.roundRect, {
      x: trackX,
      y: barY,
      w: Math.max(0.14, trackW * (weight / maxWeight)),
      h: 0.06,
      rectRadius: 0.02,
      fill: { color: accent },
      line: { color: accent },
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addScoreBoostsAndPenalties(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const boosts = (opts.boosts || [
    {
      title: "Semántica real",
      body: "Header, main, section y footer bien usados suman bastante.",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      title: "Responsive cuidado",
      body: "La versión móvil debe verse pensada, no apenas sobrevivir.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      title: "Entrega en GitHub",
      body: "Orden, versionado y presentación profesional del trabajo.",
      accent: TOKENS.success,
      fill: TOKENS.successSoft,
    },
  ]).slice(0, 4);
  const penalties = (opts.penalties || [
    {
      title: "Texto meta visible",
      body: "Nada de copy tipo demo, ejemplo o comentarios para el profe.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "UI genérica o infantil",
      body: "La interfaz debe sentirse seria y del mundo real.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "Entrega desordenada",
      body: "WhatsApp o correo con archivos sueltos baja puntos de forma.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
  ]).slice(0, 4);
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.18;
  const columnW = (w - 0.5) / 2;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Qué suma puntos y qué baja puntos", {
    fill: TOKENS.softNeutral,
  });

  const columns = [
    {
      x: x + 0.16,
      w: columnW,
      title: opts.boostsTitle || "Suma puntos",
      subtitle: opts.boostsSubtitle || "Refuerza criterio, calidad y forma de trabajo.",
      items: boosts,
      fill: TOKENS.softBlue,
      accent: TOKENS.navy,
    },
    {
      x: x + 0.16 + columnW + gap,
      w: columnW,
      title: opts.penaltiesTitle || "Baja puntos",
      subtitle: opts.penaltiesSubtitle || "Rompe profesionalismo, claridad o método de entrega.",
      items: penalties,
      fill: TOKENS.paleRed,
      accent: TOKENS.red,
    },
  ];

  columns.forEach((column) => {
    addSurface(slide, SH, column.x, bodyY, column.w, bodyH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: column.x,
      y: bodyY,
      w: 0.08,
      h: bodyH,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    slide.addShape(SH.roundRect, {
      x: column.x + 0.18,
      y: bodyY + 0.16,
      w: column.w - 0.34,
      h: 0.34,
      rectRadius: 0.03,
      fill: { color: column.fill },
      line: { color: column.fill },
    });
    slide.addText(column.title, {
      x: column.x + 0.28,
      y: bodyY + 0.24,
      w: column.w - 0.54,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(column.subtitle, {
      x: column.x + 0.22,
      y: bodyY + 0.58,
      w: column.w - 0.4,
      h: 0.24,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });

    const itemGap = 0.12;
    const itemsY = bodyY + 0.92;
    const itemH = Math.max(
      0.44,
      (bodyH - 1.06 - itemGap * (column.items.length - 1)) / Math.max(column.items.length, 1)
    );

    column.items.forEach((item, index) => {
      const itemY = itemsY + index * (itemH + itemGap);
      addSurface(slide, SH, column.x + 0.18, itemY, column.w - 0.34, itemH, {
        fill: item.fill || column.fill,
        line: item.fill || column.fill,
      });
      slide.addShape(SH.rect, {
        x: column.x + 0.18,
        y: itemY,
        w: 0.08,
        h: itemH,
        fill: { color: item.accent || column.accent },
        line: { color: item.accent || column.accent },
      });
      slide.addText(item.title || "Punto", {
        x: column.x + 0.32,
        y: itemY + 0.1,
        w: column.w - 0.52,
        h: 0.16,
        fontFace: TYPOGRAPHY.display,
        fontSize: 10.6,
        bold: true,
        color: TOKENS.navy,
        margin: 0,
        fit: "shrink",
      });
      slide.addText(item.body || "", {
        x: column.x + 0.32,
        y: itemY + 0.3,
        w: column.w - 0.52,
        h: Math.max(0.14, itemH - 0.38),
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.6,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
        valign: "mid",
      });
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addProjectWorkflowPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stages = (opts.stages || [
    { step: "01", title: "Brief", artifact: "encargo", accent: TOKENS.red, fill: TOKENS.paleRed },
    { step: "02", title: "Spec", artifact: "alcance", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { step: "03", title: "Design", artifact: "ui/ux", accent: TOKENS.gold, fill: TOKENS.warm },
    { step: "04", title: "Agents", artifact: "reglas", accent: TOKENS.navy, fill: TOKENS.mist },
    { step: "05", title: "Implementación", artifact: "html + css", accent: TOKENS.red, fill: TOKENS.paleRed },
    { step: "06", title: "Validación", artifact: "navegador", accent: TOKENS.success, fill: TOKENS.successSoft },
    { step: "07", title: "Entrega", artifact: "github", accent: TOKENS.navy, fill: TOKENS.softBlue },
  ]).slice(0, 7);
  const footerReserve = opts.footer ? 0.28 : 0;
  const compact = w < 8.6;
  const gap = compact ? 0.08 : 0.1;
  const laneY = y + 0.78;
  const laneH = h - 1 - footerReserve;
  const cardW = (w - 0.32 - gap * (stages.length - 1)) / Math.max(stages.length, 1);
  const chevronW = Math.min(0.14, gap);
  const cardH = laneH - 0.04;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Flujo recomendado de trabajo", {
    fill: TOKENS.softNeutral,
  });

  stages.forEach((stage, index) => {
    const cardX = x + 0.16 + index * (cardW + gap);
    const accent = stage.accent || TOKENS.navy;
    const fill = stage.fill || TOKENS.softBlue;

    addSurface(slide, SH, cardX, laneY, cardW, cardH, {
      fill,
      line: fill,
    });
    slide.addShape(SH.rect, {
      x: cardX,
      y: laneY,
      w: 0.08,
      h: cardH,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: cardX + 0.16,
      y: laneY + 0.14,
      w: Math.min(0.42, cardW - 0.24),
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(stage.step || String(index + 1).padStart(2, "0"), {
      x: cardX + 0.2,
      y: laneY + 0.19,
      w: Math.min(0.34, cardW - 0.32),
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.2,
      bold: true,
      color: accent,
      align: "center",
      margin: 0,
    });
    slide.addText(stage.title || "Etapa", {
      x: cardX + 0.16,
      y: laneY + 0.48,
      w: cardW - 0.22,
      h: compact ? 0.34 : 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 8.6 : 9.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
      fit: "shrink",
      valign: "mid",
    });
    if (stage.body && cardH > 1.12) {
      slide.addText(stage.body, {
        x: cardX + 0.14,
        y: laneY + 0.84,
        w: cardW - 0.2,
        h: 0.24,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7,
        color: TOKENS.ink,
        margin: 0,
        align: "center",
        fit: "shrink",
        valign: "mid",
      });
    }
    slide.addShape(SH.roundRect, {
      x: cardX + 0.12,
      y: laneY + cardH - 0.3,
      w: cardW - 0.2,
      h: 0.2,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.white },
    });
    slide.addText(stage.artifact || "", {
      x: cardX + 0.16,
      y: laneY + cardH - 0.25,
      w: cardW - 0.28,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 6.6,
      bold: true,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
      fit: "shrink",
    });

    if (index < stages.length - 1) {
      const laneStart = cardX + cardW;
      const laneEnd = laneStart + gap;
      const chevronX = laneStart + Math.max(0, (gap - chevronW) / 2);

      slide.addShape(SH.chevron, {
        x: chevronX,
        y: laneY + cardH / 2 - 0.14,
        w: Math.max(0.08, Math.min(chevronW, laneEnd - chevronX)),
        h: 0.28,
        fill: { color: TOKENS.gold },
        line: { color: TOKENS.gold },
      });
    }
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addPromptQualityCompare(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.18;
  const columnW = (w - 0.5) / 2;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const compact = bodyH < 2.4;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Prompt malo vs prompt útil", {
    fill: TOKENS.softNeutral,
  });

  const columns = [
    {
      x: x + 0.16,
      w: columnW,
      title: opts.badTitle || "Prompt flojo",
      subtitle: opts.badSubtitle || "Pide una página sin contexto ni criterio.",
      prompt:
        opts.badPrompt ||
        "Hazme una landing moderna y bonita con HTML y CSS. Quiero algo llamativo y rápido.",
      notes: (opts.badNotes || [
        "no define público ni objetivo",
        "no fija restricciones técnicas",
        "deja abierta una UI genérica",
      ]).slice(0, 4),
      fill: TOKENS.paleRed,
      accent: TOKENS.red,
    },
    {
      x: x + 0.16 + columnW + gap,
      w: columnW,
      title: opts.goodTitle || "Prompt útil",
      subtitle: opts.goodSubtitle || "Da contexto, criterio y restricciones reales.",
      prompt:
        opts.goodPrompt ||
        "Crea una landing para un servicio tecnológico local. Usa HTML semántico, CSS con tokens, mobile-first, tono sobrio y CTA claro. No uses texto meta ni estética infantil.",
      notes: (opts.goodNotes || [
        "define producto y público objetivo",
        "fija HTML, CSS y responsive",
        "protege tono visual y realismo",
      ]).slice(0, 4),
      fill: TOKENS.softBlue,
      accent: TOKENS.navy,
    },
  ];

  columns.forEach((column) => {
    addSurface(slide, SH, column.x, bodyY, column.w, bodyH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: column.x,
      y: bodyY,
      w: 0.08,
      h: bodyH,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    slide.addShape(SH.roundRect, {
      x: column.x + 0.18,
      y: bodyY + 0.16,
      w: column.w - 0.34,
      h: 0.34,
      rectRadius: 0.03,
      fill: { color: column.fill },
      line: { color: column.fill },
    });
    slide.addText(column.title, {
      x: column.x + 0.28,
      y: bodyY + 0.24,
      w: column.w - 0.54,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(column.subtitle, {
      x: column.x + 0.22,
      y: bodyY + 0.58,
      w: column.w - 0.4,
      h: 0.22,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });

    addSurface(slide, SH, column.x + 0.18, bodyY + 0.86, column.w - 0.34, compact ? 0.88 : 1.02, {
      fill: TOKENS.editorBg,
      line: TOKENS.editorBg,
    });
    slide.addText(column.prompt, {
      x: column.x + 0.3,
      y: bodyY + 0.98,
      w: column.w - 0.58,
      h: compact ? 0.56 : 0.7,
      fontFace: "Courier New",
      fontSize: compact ? 7.2 : 7.8,
      color: TOKENS.white,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });

    const notesY = bodyY + (compact ? 1.88 : 2.06);
    const noteH = Math.max(0.18, bodyH - (compact ? 2.06 : 2.24));
    const noteGap = 0.08;
    const rowH = Math.max(0.16, (noteH - noteGap * (column.notes.length - 1)) / Math.max(column.notes.length, 1));

    column.notes.forEach((note, index) => {
      const rowY = notesY + index * (rowH + noteGap);
      slide.addShape(SH.ellipse, {
        x: column.x + 0.24,
        y: rowY + Math.max(0.02, rowH / 2 - 0.03),
        w: 0.06,
        h: 0.06,
        fill: { color: column.accent },
        line: { color: column.accent },
      });
      slide.addText(note, {
        x: column.x + 0.36,
        y: rowY,
        w: column.w - 0.54,
        h: rowH,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.4,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
        valign: "mid",
      });
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addStaticVsInteractiveCompare(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.18;
  const columnW = (w - 0.5) / 2;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Statico vs interactivo", {
    fill: TOKENS.softNeutral,
  });

  const columns = [
    {
      x: x + 0.16,
      title: opts.leftTitle || "Solo HTML + CSS",
      subtitle: opts.leftSubtitle || "la interfaz se ve correcta, pero todavia no responde",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      cta: opts.leftCta || "Boton visible",
      note: opts.leftNote || "sin evento ni respuesta",
      sideLabel: opts.leftSideLabel || "estado fijo",
    },
    {
      x: x + 0.16 + columnW + gap,
      title: opts.rightTitle || "Con JavaScript",
      subtitle: opts.rightSubtitle || "la accion del usuario dispara una respuesta observable",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
      cta: opts.rightCta || "Boton activo",
      note: opts.rightNote || "click -> mensaje en consola",
      sideLabel: opts.rightSideLabel || "comportamiento",
    },
  ];

  columns.forEach((column, index) => {
    addSurface(slide, SH, column.x, bodyY, columnW, bodyH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: column.x,
      y: bodyY,
      w: 0.08,
      h: bodyH,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    slide.addShape(SH.roundRect, {
      x: column.x + 0.18,
      y: bodyY + 0.16,
      w: columnW - 0.34,
      h: 0.34,
      rectRadius: 0.03,
      fill: { color: column.fill },
      line: { color: column.fill },
    });
    slide.addText(column.title, {
      x: column.x + 0.28,
      y: bodyY + 0.24,
      w: columnW - 0.54,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(column.subtitle, {
      x: column.x + 0.22,
      y: bodyY + 0.58,
      w: columnW - 0.4,
      h: 0.24,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });

    const browserX = column.x + 0.2;
    const browserY = bodyY + 0.94;
    const browserW = columnW - 0.4;
    const browserH = Math.min(1.18, Math.max(1.02, bodyH - 1.72));

    slide.addShape(SH.roundRect, {
      x: browserX,
      y: browserY,
      w: browserW,
      h: browserH,
      rectRadius: 0.03,
      fill: { color: TOKENS.paper },
      line: { color: TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.roundRect, {
      x: browserX,
      y: browserY,
      w: browserW,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: TOKENS.softNeutral },
      line: { color: TOKENS.softNeutral },
    });
    ["D62027", "E0BC5A", "52606D"].forEach((color, dotIndex) => {
      slide.addShape(SH.ellipse, {
        x: browserX + 0.08 + dotIndex * 0.1,
        y: browserY + 0.08,
        w: 0.05,
        h: 0.05,
        fill: { color },
        line: { color },
      });
    });

    slide.addShape(SH.roundRect, {
      x: browserX + 0.12,
      y: browserY + 0.34,
      w: browserW - 0.24,
      h: 0.26,
      rectRadius: 0.02,
      fill: { color: index === 0 ? TOKENS.white : TOKENS.softBlue },
      line: { color: index === 0 ? TOKENS.border : TOKENS.softBlue, pt: 1 },
    });
    slide.addShape(SH.roundRect, {
      x: browserX + 0.12,
      y: browserY + 0.68,
      w: browserW * 0.42,
      h: 0.44,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.roundRect, {
      x: browserX + browserW * 0.5,
      y: browserY + 0.68,
      w: browserW * 0.34,
      h: 0.22,
      rectRadius: 0.03,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    slide.addText(column.cta, {
      x: browserX + browserW * 0.5 + 0.06,
      y: browserY + 0.75,
      w: browserW * 0.34 - 0.12,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.4,
      bold: true,
      color: TOKENS.white,
      align: "center",
      margin: 0,
      fit: "shrink",
    });

    slide.addShape(SH.roundRect, {
      x: column.x + 0.2,
      y: bodyY + bodyH - 0.44,
      w: columnW - 0.4,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: index === 0 ? TOKENS.warm : TOKENS.successSoft },
      line: { color: index === 0 ? TOKENS.warm : TOKENS.successSoft },
    });
    slide.addText(column.note, {
      x: column.x + 0.28,
      y: bodyY + bodyH - 0.37,
      w: columnW - 0.56,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.3,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(column.sideLabel, {
      x: column.x + 0.22,
      y: browserY + browserH + 0.06,
      w: columnW - 0.44,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  });

  slide.addShape(SH.chevron, {
    x: x + columnW + 0.19,
    y: bodyY + bodyH / 2 - 0.16,
    w: 0.12,
    h: 0.32,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addDataTypesBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.24 : 0;
  const gap = 0.14;
  const rowGap = 0.16;
  const cards = (opts.cards || [
    {
      label: "string",
      sample: '"Nodo Web"',
      note: "texto para nombres, mensajes y contenido",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      label: "number",
      sample: "14990",
      note: "sirve para calcular, contar o comparar",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      label: "boolean",
      sample: "true",
      note: "marca si una condicion se cumple o no",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      label: "variable",
      sample: "const precio = 14990",
      note: "un nombre que guarda un valor util",
      accent: TOKENS.navy,
      fill: TOKENS.mist,
    },
  ]).slice(0, 4);
  const innerX = x + 0.22;
  const topY = y + 0.62;
  const bodyH = Math.max(1.2, h - 0.84 - footerReserve);
  const minCardW = opts.minCardWidth || 1.55;
  let columns = Math.max(1, Math.min(cards.length, opts.columns || cards.length));

  while (columns > 1) {
    const candidate = (w - 0.44 - gap * (columns - 1)) / columns;
    if (candidate >= minCardW) {
      break;
    }
    columns -= 1;
  }

  const rows = Math.max(1, Math.ceil(cards.length / columns));
  const cardW = (w - 0.44 - gap * (columns - 1)) / Math.max(columns, 1);
  const cardH = (bodyH - rowGap * (rows - 1)) / rows;
  const compactLayout = rows > 1 || cardH < 1.55;
  const pillH = compactLayout ? 0.24 : 0.3;
  const pillTop = compactLayout ? 0.12 : 0.16;
  const sampleTop = pillTop + pillH + (compactLayout ? 0.08 : 0.12);
  const sampleH = compactLayout ? 0.38 : 0.52;
  const sampleSide = compactLayout ? 0.14 : 0.16;
  const noteTop = sampleTop + sampleH + (compactLayout ? 0.08 : 0.14);
  const noteBottom = compactLayout ? 0.12 : 0.18;
  const labelFontSize = compactLayout ? 10.4 : 11.2;
  const sampleFontSize = compactLayout ? 7.4 : 8.4;
  const noteFontSize = compactLayout ? 7.0 : 7.6;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Tipos de datos y variables", {
    fill: TOKENS.softNeutral,
  });

  cards.forEach((card, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const cardX = innerX + col * (cardW + gap);
    const cardY = topY + row * (cardH + rowGap);

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: cardX,
      y: cardY,
      w: 0.08,
      h: cardH,
      fill: { color: card.accent || TOKENS.navy },
      line: { color: card.accent || TOKENS.navy },
    });
    slide.addShape(SH.roundRect, {
      x: cardX + sampleSide,
      y: cardY + pillTop,
      w: cardW - sampleSide * 2,
      h: pillH,
      rectRadius: 0.03,
      fill: { color: card.fill || TOKENS.softBlue },
      line: { color: card.fill || TOKENS.softBlue },
    });
    slide.addText(card.label || "tipo", {
      x: cardX + sampleSide + 0.06,
      y: cardY + pillTop,
      w: cardW - sampleSide * 2 - 0.12,
      h: pillH,
      fontFace: TYPOGRAPHY.display,
      fontSize: labelFontSize,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      valign: "mid",
      margin: 0,
      fit: "shrink",
    });
    addSurface(slide, SH, cardX + sampleSide, cardY + sampleTop, cardW - sampleSide * 2, sampleH, {
      fill: TOKENS.editorBg,
      line: TOKENS.editorBg,
    });
    slide.addText(card.sample || "", {
      x: cardX + sampleSide + 0.08,
      y: cardY + sampleTop,
      w: cardW - sampleSide * 2 - 0.16,
      h: sampleH,
      fontFace: TYPOGRAPHY.mono,
      fontSize: sampleFontSize,
      color: TOKENS.white,
      align: "center",
      valign: "mid",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(card.note || "", {
      x: cardX + 0.16,
      y: cardY + noteTop,
      w: cardW - 0.32,
      h: Math.max(0.18, cardH - noteTop - noteBottom),
      fontFace: TYPOGRAPHY.body,
      fontSize: noteFontSize,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
      align: "center",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addControlFlowPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const sideW = Math.max(1.5, w * 0.25);
  const centerW = Math.max(1.4, w * 0.18);
  const gap = 0.18;
  const rightW = w - sideW - centerW - gap * 2 - 0.36;
  const leftX = x + 0.18;
  const centerX = leftX + sideW + gap;
  const rightX = centerX + centerW + gap;
  const compactLayout = bodyH < 1.8;
  const panelTitleY = bodyY + (compactLayout ? 0.12 : 0.18);
  const panelTitleH = compactLayout ? 0.1 : 0.14;
  const panelTitleFont = compactLayout ? 10.6 : 12;
  const codeBoxY = bodyY + (compactLayout ? 0.36 : 0.52);
  const codeBoxH = compactLayout ? 0.34 : 0.54;
  const codeTextY = codeBoxY + (compactLayout ? 0.11 : 0.19);
  const codeTextH = compactLayout ? 0.08 : 0.12;
  const codeFont = compactLayout ? 7.2 : 8.4;
  const bodyTextY = codeBoxY + codeBoxH + (compactLayout ? 0.08 : 0.2);
  const bodyTextFont = compactLayout ? 6.5 : 7.8;
  const bodyTextH = Math.max(0.16, bodyH - (bodyTextY - bodyY) - 0.12);
  const centerArrowY = compactLayout ? bodyY + 0.52 : bodyY + 0.62;
  const centerArrowW = compactLayout ? 0.5 : 0.68;
  const centerArrowH = compactLayout ? 0.24 : 0.34;
  const conditionLabelY = centerArrowY + centerArrowH + (compactLayout ? 0.1 : 0.12);
  const conditionLabelFont = compactLayout ? 7.4 : 8.2;
  const conditionBodyY = conditionLabelY + (compactLayout ? 0.16 : 0.34);
  const conditionBodyFont = compactLayout ? 6.5 : 7.3;
  const conditionBodyH = Math.max(0.14, bodyH - (conditionBodyY - bodyY) - 0.12);
  const outputTitleY = bodyY + (compactLayout ? 0.1 : 0.18);
  const outputTitleFont = compactLayout ? 10.6 : 11.6;
  const outputCardsTop = bodyY + (compactLayout ? 0.34 : 0.54);
  const outputGap = compactLayout ? 0.08 : 0.18;
  const outputCardH = Math.max(0.28, (bodyH - (outputCardsTop - bodyY) - outputGap - 0.12) / 2);
  const outputTitleInnerY = compactLayout ? 0.08 : 0.12;
  const outputBodyInnerY = compactLayout ? 0.22 : 0.3;
  const outputInnerTitleFont = compactLayout ? 7.4 : 8.8;
  const outputInnerBodyFont = compactLayout ? 6.7 : 7.8;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Funcion -> condicion -> salida", {
    fill: TOKENS.softNeutral,
  });

  addSurface(slide, SH, leftX, bodyY, sideW, bodyH, {
    fill: TOKENS.softBlue,
    line: TOKENS.softBlue,
  });
  slide.addText(opts.inputTitle || "Entrada", {
    x: leftX + 0.18,
    y: panelTitleY,
    w: sideW - 0.36,
    h: panelTitleH,
    fontFace: TYPOGRAPHY.display,
    fontSize: panelTitleFont,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
    fit: "shrink",
  });
  addSurface(slide, SH, leftX + 0.18, codeBoxY, sideW - 0.36, codeBoxH, {
    fill: TOKENS.editorBg,
    line: TOKENS.editorBg,
  });
  slide.addText(opts.inputCode || "verificarAcceso(edad)", {
    x: leftX + 0.26,
    y: codeTextY,
    w: sideW - 0.52,
    h: codeTextH,
    fontFace: TYPOGRAPHY.mono,
    fontSize: codeFont,
    color: TOKENS.white,
    margin: 0,
    fit: "shrink",
    align: "center",
  });
  slide.addText(opts.inputBody || "entra un dato que la funcion debe interpretar", {
    x: leftX + 0.18,
    y: bodyTextY,
    w: sideW - 0.36,
    h: bodyTextH,
    fontFace: TYPOGRAPHY.body,
    fontSize: bodyTextFont,
    color: TOKENS.ink,
    margin: 0,
    fit: "shrink",
    valign: "mid",
    align: "center",
  });

  slide.addShape(SH.chevron, {
    x: leftX + sideW + (gap - 0.12) / 2,
    y: bodyY + bodyH / 2 - 0.16,
    w: 0.12,
    h: 0.32,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  addSurface(slide, SH, centerX, bodyY, centerW, bodyH, {
    fill: TOKENS.warm,
    line: TOKENS.warm,
  });
  slide.addText(opts.conditionTitle || "Condicion", {
    x: centerX + 0.12,
    y: panelTitleY,
    w: centerW - 0.24,
    h: panelTitleH,
    fontFace: TYPOGRAPHY.display,
    fontSize: compactLayout ? 9.8 : 10.8,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addShape(SH.chevron, {
    x: centerX + centerW / 2 - centerArrowW / 2,
    y: centerArrowY,
    w: centerArrowW,
    h: centerArrowH,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red },
  });
  slide.addText(opts.conditionLabel || "edad >= 18", {
    x: centerX + 0.14,
    y: conditionLabelY,
    w: centerW - 0.28,
    h: 0.14,
    fontFace: TYPOGRAPHY.mono,
    fontSize: conditionLabelFont,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addText(opts.conditionBody || "segun el resultado, el programa toma un camino u otro", {
    x: centerX + 0.12,
    y: conditionBodyY,
    w: centerW - 0.24,
    h: conditionBodyH,
    fontFace: TYPOGRAPHY.body,
    fontSize: conditionBodyFont,
    color: TOKENS.slate,
    margin: 0,
    fit: "shrink",
    valign: "mid",
    align: "center",
  });

  slide.addShape(SH.chevron, {
    x: centerX + centerW + (gap - 0.12) / 2,
    y: bodyY + bodyH / 2 - 0.16,
    w: 0.12,
    h: 0.32,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  addSurface(slide, SH, rightX, bodyY, rightW, bodyH, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  slide.addText(opts.outputTitle || "Salidas posibles", {
    x: rightX + 0.16,
    y: outputTitleY,
    w: rightW - 0.32,
    h: panelTitleH,
    fontFace: TYPOGRAPHY.display,
    fontSize: outputTitleFont,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
    fit: "shrink",
  });

  [
    {
      title: opts.trueTitle || "Si se cumple",
      body: opts.trueBody || "Acceso permitido",
      fill: TOKENS.successSoft,
      accent: TOKENS.success,
      y: outputCardsTop,
    },
    {
      title: opts.falseTitle || "Si no se cumple",
      body: opts.falseBody || "Acceso denegado",
      fill: TOKENS.paleRed,
      accent: TOKENS.red,
      y: outputCardsTop + outputCardH + outputGap,
    },
  ].forEach((item) => {
    addSurface(slide, SH, rightX + 0.14, item.y, rightW - 0.28, outputCardH, {
      fill: item.fill,
      line: item.fill,
    });
    slide.addShape(SH.rect, {
      x: rightX + 0.14,
      y: item.y,
      w: 0.08,
      h: outputCardH,
      fill: { color: item.accent },
      line: { color: item.accent },
    });
    slide.addText(item.title, {
      x: rightX + 0.28,
      y: item.y + outputTitleInnerY,
      w: rightW - 0.48,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: outputInnerTitleFont,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.body, {
      x: rightX + 0.28,
      y: item.y + outputBodyInnerY,
      w: rightW - 0.48,
      h: Math.max(0.1, outputCardH - outputBodyInnerY - 0.08),
      fontFace: TYPOGRAPHY.body,
      fontSize: outputInnerBodyFont,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addEventReactionPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const stages = (opts.stages || [
    { title: "Usuario", body: "hace click", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "Evento", body: "click", accent: TOKENS.gold, fill: TOKENS.warm },
    { title: "Handler", body: "listener corre", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { title: "Respuesta", body: "console.log()", accent: TOKENS.success, fill: TOKENS.successSoft },
  ]).slice(0, 4);
  const gap = 0.12;
  const laneY = y + 0.68;
  const laneH = 0.86;
  const stageW = (w - 0.44 - gap * (stages.length - 1)) / Math.max(stages.length, 1);
  const browserY = laneY + laneH + 0.18;
  const browserH = h - (browserY - y) - 0.2 - footerReserve;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Evento -> reaccion", {
    fill: TOKENS.softNeutral,
  });

  stages.forEach((stage, index) => {
    const stageX = x + 0.22 + index * (stageW + gap);
    addSurface(slide, SH, stageX, laneY, stageW, laneH, {
      fill: stage.fill || TOKENS.softBlue,
      line: stage.fill || TOKENS.softBlue,
    });
    slide.addShape(SH.rect, {
      x: stageX,
      y: laneY,
      w: 0.08,
      h: laneH,
      fill: { color: stage.accent || TOKENS.navy },
      line: { color: stage.accent || TOKENS.navy },
    });
    slide.addText(stage.title || "Etapa", {
      x: stageX + 0.16,
      y: laneY + 0.16,
      w: stageW - 0.24,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 10.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
    slide.addText(stage.body || "", {
      x: stageX + 0.14,
      y: laneY + 0.42,
      w: stageW - 0.22,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      color: TOKENS.ink,
      margin: 0,
      align: "center",
      fit: "shrink",
      valign: "mid",
    });

    if (index < stages.length - 1) {
      const laneStart = stageX + stageW;
      const laneEnd = laneStart + gap;
      const arrowW = Math.min(0.1, gap);
      slide.addShape(SH.chevron, {
        x: laneStart + Math.max(0, (gap - arrowW) / 2),
        y: laneY + laneH / 2 - 0.12,
        w: Math.max(0.08, Math.min(arrowW, laneEnd - (laneStart + Math.max(0, (gap - arrowW) / 2)))),
        h: 0.24,
        fill: { color: TOKENS.gold },
        line: { color: TOKENS.gold },
      });
    }
  });

  const browserX = x + 0.22;
  const browserW = w - 0.44;
  addSurface(slide, SH, browserX, browserY, browserW, browserH, {
    fill: TOKENS.paper,
    line: TOKENS.border,
  });
  slide.addShape(SH.roundRect, {
    x: browserX,
    y: browserY,
    w: browserW,
    h: 0.24,
    rectRadius: 0.03,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.softNeutral },
  });
  ["D62027", "E0BC5A", "52606D"].forEach((color, dotIndex) => {
    slide.addShape(SH.ellipse, {
      x: browserX + 0.1 + dotIndex * 0.1,
      y: browserY + 0.09,
      w: 0.05,
      h: 0.05,
      fill: { color },
      line: { color },
    });
  });
  slide.addText(opts.browserLabel || "Interfaz observada", {
    x: browserX + 0.2,
    y: browserY + 0.38,
    w: browserW - 0.4,
    h: 0.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  slide.addShape(SH.roundRect, {
    x: browserX + 0.2,
    y: browserY + 0.66,
    w: browserW * 0.34,
    h: 0.34,
    rectRadius: 0.03,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red },
  });
  slide.addText(opts.triggerLabel || "Click en boton", {
    x: browserX + 0.28,
    y: browserY + 0.77,
    w: browserW * 0.34 - 0.16,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8,
    bold: true,
    color: TOKENS.white,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addShape(SH.chevron, {
    x: browserX + browserW * 0.4,
    y: browserY + 0.73,
    w: 0.22,
    h: 0.2,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });
  addSurface(slide, SH, browserX + browserW * 0.48, browserY + 0.58, browserW * 0.38, 0.5, {
    fill: TOKENS.successSoft,
    line: TOKENS.successSoft,
  });
  slide.addText(opts.responseLabel || "Respuesta en consola o en la UI", {
    x: browserX + browserW * 0.48 + 0.1,
    y: browserY + 0.76,
    w: browserW * 0.38 - 0.2,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
    fit: "shrink",
  });
  slide.addText(
    opts.browserNote || "el codigo importa porque escucha una accion y corre en el momento correcto",
    {
      x: browserX + 0.2,
      y: browserY + browserH - 0.26,
      w: browserW - 0.4,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
      fit: "shrink",
    }
  );

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addDomMutationFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.16;
  const bodyY = y + 0.62;
  const bodyH = h - 0.84 - footerReserve;
  const colW = (w - 0.44 - gap * 2) / 3;
  const columns = [
    {
      title: opts.selectorTitle || "Selector",
      badge: "document.querySelector(...)",
      body: opts.selectorBody || "Ubica el nodo correcto dentro del DOM real.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      icon: "link",
    },
    {
      title: opts.mutationTitle || "Mutación",
      badge: "nodo.textContent = ...",
      body: opts.mutationBody || "Cambia una propiedad observable del elemento.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      icon: "key",
    },
    {
      title: opts.resultTitle || "Resultado",
      badge: opts.resultBadge || "La interfaz se actualiza",
      body: opts.resultBody || "El cambio debe verse y también poder comprobarse.",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
      icon: "building",
    },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Selector -> mutacion -> resultado visible", {
    fill: TOKENS.softNeutral,
  });

  function renderFlowCard(column, colX, colY, cardW, cardH, cardOpts = {}) {
    addSurface(slide, SH, colX, colY, cardW, cardH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: colX,
      y: colY,
      w: 0.08,
      h: cardH,
      fill: { color: column.accent },
      line: { color: column.accent },
    });
    addIconBadge(
      slide,
      SH,
      colX + 0.16,
      colY + 0.16,
      cardOpts.iconSize || 0.48,
      cardOpts.iconSize || 0.48,
      column.icon,
      {
      fill: column.fill,
      stroke: column.accent,
      accent: column.accent,
      secondary: TOKENS.navy,
      line: column.fill,
      }
    );
    slide.addText(column.title, {
      x: colX + (cardOpts.titleXOffset || 0.74),
      y: colY + 0.22,
      w: cardW - (cardOpts.titleXOffset || 0.74) - 0.18,
      h: 0.14,
      fontFace: TYPOGRAPHY.display,
      fontSize: cardOpts.titleFontSize || 11.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addShape(SH.roundRect, {
      x: colX + 0.16,
      y: colY + (cardOpts.badgeY || 0.78),
      w: cardW - 0.32,
      h: cardOpts.badgeH || 0.42,
      rectRadius: 0.03,
      fill: { color: TOKENS.editorBg },
      line: { color: TOKENS.editorBg },
    });
    slide.addText(column.badge, {
      x: colX + 0.24,
      y: colY + (cardOpts.badgeTextY || 0.91),
      w: cardW - 0.48,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: cardOpts.badgeFontSize || 8,
      color: TOKENS.white,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(column.body, {
      x: colX + 0.16,
      y: colY + (cardOpts.bodyY || 1.38),
      w: cardW - 0.32,
      h: Math.max(0.22, cardH - (cardOpts.bodyY || 1.38) - 0.16),
      fontFace: TYPOGRAPHY.body,
      fontSize: cardOpts.bodyFontSize || 8,
      color: TOKENS.ink,
      margin: 0,
      valign: cardOpts.bodyVAlign || "mid",
      align: "center",
      fit: "shrink",
    });
  }

  const useStackedLayout = colW < 1.55;

  if (useStackedLayout) {
    const laneY = bodyY + 0.14;
    const cardGap = 0.1;
    const cardW = w - 0.44;
    const cardH = Math.max(0.72, (bodyH - 0.14 - cardGap * 2) / 3);
    const leftX = x + 0.22;

    renderFlowCard(columns[0], leftX, laneY, cardW, cardH, {
      iconSize: 0.34,
      titleXOffset: 0.56,
      titleFontSize: 9.8,
      badgeY: 0.3,
      badgeH: 0.22,
      badgeTextY: 0.36,
      badgeFontSize: 5.8,
      bodyY: 0.56,
      bodyFontSize: 6.4,
      bodyVAlign: "top",
    });
    renderFlowCard(columns[1], leftX, laneY + cardH + cardGap, cardW, cardH, {
      iconSize: 0.34,
      titleXOffset: 0.56,
      titleFontSize: 9.8,
      badgeY: 0.3,
      badgeH: 0.22,
      badgeTextY: 0.36,
      badgeFontSize: 5.8,
      bodyY: 0.56,
      bodyFontSize: 6.4,
      bodyVAlign: "top",
    });
    renderFlowCard(columns[2], leftX, laneY + (cardH + cardGap) * 2, cardW, cardH, {
      iconSize: 0.34,
      titleXOffset: 0.56,
      titleFontSize: 9.8,
      badgeY: 0.3,
      badgeH: 0.22,
      badgeTextY: 0.36,
      badgeFontSize: 5.8,
      bodyY: 0.56,
      bodyFontSize: 6.4,
      bodyVAlign: "top",
    });
  } else {
    const laneY = bodyY + 0.14;
    const laneH = Math.max(1.28, bodyH - 0.54);

    columns.forEach((column, index) => {
      const colX = x + 0.22 + index * (colW + gap);

      renderFlowCard(column, colX, laneY, colW, laneH);

      if (index < columns.length - 1) {
        slide.addShape(SH.chevron, {
          x: colX + colW + (gap - 0.1) / 2,
          y: laneY + laneH / 2 - 0.13,
          w: 0.1,
          h: 0.26,
          fill: { color: TOKENS.gold },
          line: { color: TOKENS.gold },
        });
      }
    });
  }

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - (useStackedLayout ? 0.16 : 0.18),
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: useStackedLayout ? 7.6 : 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addDebugEvidenceBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.28 : 0;
  const gap = 0.16;
  const bodyY = y + 0.62;
  const bodyH = h - 0.84 - footerReserve;
  const cardH = Math.max(0.9, bodyH - 0.58);
  const cardW = (w - 0.44 - gap * 2) / 3;
  const cards = (opts.cards || [
    {
      title: "Elements",
      body: "Confirma si el nodo existe y si el selector apunta al lugar correcto.",
      question: "¿Ese elemento está realmente en el DOM?",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      icon: "sheet",
    },
    {
      title: "Console",
      body: "Mira valores, errores y el punto exacto donde el flujo se corta.",
      question: "¿Qué evidencia entrega el código al ejecutarse?",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      icon: "sql",
    },
    {
      title: "Network",
      body: "Verifica si `fetch` salió, respondió y devolvió la estructura esperada.",
      question: "¿La solicitud ocurrió y trajo datos válidos?",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
      icon: "database",
    },
  ]).slice(0, 3);

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Evidencia de debugging", {
    fill: TOKENS.softNeutral,
  });

  cards.forEach((card, index) => {
    const cardX = x + 0.22 + index * (cardW + gap);

    addSurface(slide, SH, cardX, bodyY, cardW, cardH, {
      fill: TOKENS.white,
      line: TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: cardX,
      y: bodyY,
      w: 0.08,
      h: cardH,
      fill: { color: card.accent || TOKENS.navy },
      line: { color: card.accent || TOKENS.navy },
    });
    addIconBadge(slide, SH, cardX + 0.16, bodyY + 0.16, 0.48, 0.48, card.icon || "sheet", {
      fill: card.fill || TOKENS.softBlue,
      stroke: card.accent || TOKENS.navy,
      accent: card.accent || TOKENS.navy,
      secondary: TOKENS.gold,
      line: card.fill || TOKENS.softBlue,
    });
    slide.addText(card.title || "Panel", {
      x: cardX + 0.74,
      y: bodyY + 0.22,
      w: cardW - 0.92,
      h: 0.14,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(card.body || "", {
      x: cardX + 0.16,
      y: bodyY + 0.8,
      w: cardW - 0.32,
      h: 0.5,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
      valign: "mid",
    });
    slide.addShape(SH.roundRect, {
      x: cardX + 0.16,
      y: bodyY + cardH - 0.54,
      w: cardW - 0.32,
      h: 0.34,
      rectRadius: 0.03,
      fill: { color: card.fill || TOKENS.softBlue },
      line: { color: card.fill || TOKENS.softBlue },
    });
    slide.addText(card.question || "", {
      x: cardX + 0.24,
      y: bodyY + cardH - 0.45,
      w: cardW - 0.48,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
      fit: "shrink",
      valign: "mid",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addSpreadsheetProblemPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.26 : 0;
  const columns = (opts.columns || ["Obra", "Cliente", "Direccion", "Profesional"]).slice(0, 5);
  const rows = (opts.rows || [
    ["Edificio A", "Constructora Sur", "Los Aromos 220", "Patricia Rojas"],
    ["Edificio A", "Constructora Sur", "Los Aromos 220", "Patricia Rojas"],
    ["Casa B", "Inmobiliaria Norte", "Ruta 5 km 18", "Diego Salas"],
    ["Casa B", "Inmobiliaria Norte", "Ruta 5 km 18", "Diego Salas"],
  ]).slice(0, 5);
  const highlights = opts.highlights || [
    { row: 0, col: 1, accent: TOKENS.red, fill: TOKENS.paleRed },
    { row: 1, col: 1, accent: TOKENS.red, fill: TOKENS.paleRed },
    { row: 0, col: 3, accent: TOKENS.gold, fill: TOKENS.warm },
    { row: 1, col: 3, accent: TOKENS.gold, fill: TOKENS.warm },
  ];
  const callouts = (opts.callouts || [
    {
      title: "Redundancia visible",
      body: "Cliente y profesional se repiten en cada fila de obra.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "Riesgo operativo",
      body: "Si cambia un telefono o un nombre, hay que editar muchas celdas.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
  ]).slice(0, 3);
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const tableW = w * 0.6;
  const calloutW = w - tableW - 0.54;
  const tableX = x + 0.18;
  const tableY = bodyY + 0.02;
  const tableH = bodyH - 0.04;
  const headerH = 0.36;
  const rowGap = 0.06;
  const cellGap = 0.04;
  const rowH = (tableH - headerH - rowGap * rows.length) / Math.max(rows.length, 1);
  const colW = (tableW - cellGap * (columns.length - 1)) / Math.max(columns.length, 1);

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "De planilla util a planilla fragil", {
    fill: TOKENS.softNeutral,
  });
  addIconBadge(slide, SH, x + w - 0.78, y + 0.56, 0.42, 0.42, "sheet", {
    fill: TOKENS.softBlue,
    stroke: TOKENS.navy,
    accent: TOKENS.red,
    secondary: TOKENS.gold,
    line: TOKENS.softBlue,
  });

  columns.forEach((column, colIndex) => {
    const cellX = tableX + colIndex * (colW + cellGap);
    slide.addShape(SH.roundRect, {
      x: cellX,
      y: tableY,
      w: colW,
      h: headerH,
      rectRadius: 0.03,
      fill: { color: TOKENS.navy },
      line: { color: TOKENS.navy, pt: 1 },
    });
    slide.addText(column, {
      x: cellX + 0.08,
      y: tableY + 0.11,
      w: colW - 0.16,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.white,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
  });

  rows.forEach((row, rowIndex) => {
    const cellY = tableY + headerH + rowGap + rowIndex * (rowH + rowGap);
    columns.forEach((_, colIndex) => {
      const cellX = tableX + colIndex * (colW + cellGap);
      const highlighted = highlights.find(
        (entry) => entry.row === rowIndex && entry.col === colIndex
      );
      slide.addShape(SH.roundRect, {
        x: cellX,
        y: cellY,
        w: colW,
        h: rowH,
        rectRadius: 0.02,
        fill: { color: highlighted?.fill || (rowIndex % 2 === 0 ? TOKENS.paper : TOKENS.white) },
        line: { color: highlighted?.accent || TOKENS.border, pt: highlighted ? 1.25 : 1 },
      });
      slide.addText(row[colIndex] || "", {
        x: cellX + 0.08,
        y: cellY + 0.09,
        w: colW - 0.16,
        h: rowH - 0.16,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.6,
        color: TOKENS.ink,
        margin: 0,
        valign: "mid",
        fit: "shrink",
      });
    });
  });

  const calloutX = tableX + tableW + 0.18;
  const calloutGap = 0.12;
  const calloutH = (tableH - calloutGap * (callouts.length - 1)) / Math.max(callouts.length, 1);

  callouts.forEach((callout, index) => {
    const cardY = tableY + index * (calloutH + calloutGap);
    addSurface(slide, SH, calloutX, cardY, calloutW, calloutH, {
      fill: callout.fill || TOKENS.softBlue,
      line: callout.fill || TOKENS.softBlue,
    });
    slide.addShape(SH.rect, {
      x: calloutX,
      y: cardY,
      w: 0.08,
      h: calloutH,
      fill: { color: callout.accent || TOKENS.red },
      line: { color: callout.accent || TOKENS.red },
    });
    slide.addText(callout.title || "", {
      x: calloutX + 0.14,
      y: cardY + 0.14,
      w: calloutW - 0.24,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(callout.body || "", {
      x: calloutX + 0.14,
      y: cardY + 0.36,
      w: calloutW - 0.24,
      h: calloutH - 0.46,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addEntityRelationshipBlueprint(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.24 : 0;
  const entities = (opts.entities || [
    {
      title: "Cliente",
      icon: "user",
      fields: ["cliente_id (PK)", "nombre", "rut", "telefono"],
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      title: "Obra",
      icon: "building",
      fields: ["obra_id (PK)", "cliente_id (FK)", "nombre", "direccion"],
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
    {
      title: "Profesional",
      icon: "user",
      fields: ["profesional_id (PK)", "nombre", "especialidad"],
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      title: "Asignacion",
      icon: "link",
      fields: ["asignacion_id (PK)", "obra_id (FK)", "profesional_id (FK)"],
      accent: TOKENS.navy,
      fill: TOKENS.mist,
    },
  ]).slice(0, 4);
  const relations = (opts.relations || [
    { from: 0, to: 1, label: "1:N", accent: TOKENS.red },
    { from: 1, to: 3, label: "1:N", accent: TOKENS.gold },
    { from: 2, to: 3, label: "1:N", accent: TOKENS.navy },
  ]).slice(0, 4);
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const gapX = 0.32;
  const gapY = 0.24;
  const cardW = (w - 0.36 - gapX) / 2;
  const cardH = (bodyH - gapY) / 2;
  const positions = [
    { x: x + 0.18, y: bodyY },
    { x: x + 0.18 + cardW + gapX, y: bodyY },
    { x: x + 0.18, y: bodyY + cardH + gapY },
    { x: x + 0.18 + cardW + gapX, y: bodyY + cardH + gapY },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.paper,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "MER del caso de obras", {
    fill: TOKENS.softNeutral,
  });

  const centers = positions.map((position) => ({
    cx: position.x + cardW / 2,
    cy: position.y + cardH / 2,
  }));

  relations.forEach((relation) => {
    const from = centers[relation.from ?? 0];
    const to = centers[relation.to ?? 1];
    if (!from || !to) {
      return;
    }

    if (Math.abs(from.cy - to.cy) < 0.1) {
      const startX = Math.min(from.cx, to.cx);
      const endX = Math.max(from.cx, to.cx);
      slide.addShape(SH.rect, {
        x: startX,
        y: from.cy - 0.02,
        w: Math.max(0.1, endX - startX),
        h: 0.04,
        fill: { color: relation.accent || TOKENS.gold },
        line: { color: relation.accent || TOKENS.gold },
      });
      slide.addText(relation.label || "", {
        x: startX + (endX - startX) / 2 - 0.2,
        y: from.cy - 0.18,
        w: 0.4,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8,
        bold: true,
        color: relation.accent || TOKENS.gold,
        margin: 0,
        align: "center",
      });
    } else {
      const topY = Math.min(from.cy, to.cy);
      const leftX = Math.min(from.cx, to.cx);
      slide.addShape(SH.rect, {
        x: leftX - 0.02,
        y: topY,
        w: 0.04,
        h: Math.abs(from.cy - to.cy),
        fill: { color: relation.accent || TOKENS.gold },
        line: { color: relation.accent || TOKENS.gold },
      });
      slide.addText(relation.label || "", {
        x: leftX + 0.08,
        y: topY + Math.abs(from.cy - to.cy) / 2 - 0.05,
        w: 0.4,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8,
        bold: true,
        color: relation.accent || TOKENS.gold,
        margin: 0,
      });
    }
  });

  entities.forEach((entity, index) => {
    const position = positions[index];
    addSurface(slide, SH, position.x, position.y, cardW, cardH, {
      fill: TOKENS.white,
      line: entity.accent || TOKENS.border,
      linePt: 1.2,
    });
    slide.addShape(SH.rect, {
      x: position.x,
      y: position.y,
      w: 0.08,
      h: cardH,
      fill: { color: entity.accent || TOKENS.red },
      line: { color: entity.accent || TOKENS.red },
    });
    addIconBadge(slide, SH, position.x + 0.14, position.y + 0.12, 0.42, 0.42, entity.icon || "database", {
      fill: entity.fill || TOKENS.softNeutral,
      accent: entity.accent || TOKENS.red,
      secondary: TOKENS.gold,
    });
    slide.addText(entity.title || "", {
      x: position.x + 0.64,
      y: position.y + 0.18,
      w: cardW - 0.78,
      h: 0.14,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });

    (entity.fields || []).slice(0, 4).forEach((field, fieldIndex) => {
      const rowY = position.y + 0.62 + fieldIndex * 0.28;
      slide.addShape(SH.roundRect, {
        x: position.x + 0.14,
        y: rowY,
        w: cardW - 0.28,
        h: 0.22,
        rectRadius: 0.02,
        fill: { color: field.includes("(PK)") ? TOKENS.softBlue : field.includes("(FK)") ? TOKENS.warm : TOKENS.paper },
        line: { color: field.includes("(PK)") ? TOKENS.navy : field.includes("(FK)") ? TOKENS.gold : TOKENS.border, pt: 1 },
      });
      slide.addText(field, {
        x: position.x + 0.24,
        y: rowY + 0.06,
        w: cardW - 0.46,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.1,
        color: TOKENS.ink,
        margin: 0,
        fit: "shrink",
      });
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addNormalizationStepper(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.26 : 0;
  const stages = (opts.stages || [
    {
      badge: "0",
      title: "Tabla inicial",
      focus: "todo mezclado",
      note: "Cliente, obra y profesional viven en la misma hoja.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      sample: ["obra", "cliente", "direccion", "profesional"],
    },
    {
      badge: "1NF",
      title: "Valores atómicos",
      focus: "una celda, un valor",
      note: "Se evitan listas o datos compuestos en una misma columna.",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
      sample: ["obra", "cliente", "direccion", "profesional"],
    },
    {
      badge: "2NF",
      title: "Sin dependencia parcial",
      focus: "cada dato depende de la llave completa",
      note: "Los datos de cliente y profesional se separan de la obra.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      sample: ["cliente", "obra", "profesional", "asignacion"],
    },
    {
      badge: "3NF",
      title: "Sin dependencia transitiva",
      focus: "cada tabla guarda un solo tipo de hecho",
      note: "El modelo queda listo para mantener consistencia y crecer.",
      accent: TOKENS.success,
      fill: TOKENS.successSoft,
      sample: ["cliente", "obra", "profesional", "asignacion"],
    },
  ]).slice(0, 4);
  const footerY = y + h - 0.18;
  const wide = w >= 8.2;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Normalizacion paso a paso", {
    fill: TOKENS.softNeutral,
  });

  if (wide) {
    const gap = 0.16;
    const cardW = (w - 0.36 - gap * (stages.length - 1)) / stages.length;
    const cardH = h - 1 - footerReserve;
    stages.forEach((stage, index) => {
      const cardX = x + 0.18 + index * (cardW + gap);
      const cardY = y + 0.64;
      addSurface(slide, SH, cardX, cardY, cardW, cardH, {
        fill: stage.fill || TOKENS.paper,
        line: stage.accent || TOKENS.border,
        linePt: 1.1,
      });
      slide.addShape(SH.roundRect, {
        x: cardX + 0.12,
        y: cardY + 0.1,
        w: 0.54,
        h: 0.24,
        rectRadius: 0.04,
        fill: { color: stage.accent || TOKENS.red },
        line: { color: stage.accent || TOKENS.red },
      });
      slide.addText(stage.badge || "", {
        x: cardX + 0.16,
        y: cardY + 0.15,
        w: 0.46,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.2,
        bold: true,
        color: TOKENS.white,
        margin: 0,
        align: "center",
      });
      slide.addText(stage.title || "", {
        x: cardX + 0.12,
        y: cardY + 0.42,
        w: cardW - 0.24,
        h: 0.16,
        fontFace: TYPOGRAPHY.display,
        fontSize: 11.2,
        bold: true,
        color: TOKENS.navy,
        margin: 0,
      });
      slide.addShape(SH.roundRect, {
        x: cardX + 0.12,
        y: cardY + 0.7,
        w: cardW - 0.24,
        h: 0.28,
        rectRadius: 0.03,
        fill: { color: TOKENS.navy },
        line: { color: TOKENS.navy },
      });
      slide.addText(stage.focus || "", {
        x: cardX + 0.16,
        y: cardY + 0.78,
        w: cardW - 0.32,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.6,
        bold: true,
        color: TOKENS.white,
        margin: 0,
        align: "center",
        fit: "shrink",
      });
      (stage.sample || []).slice(0, 4).forEach((item, itemIndex) => {
        const rowY = cardY + 1.14 + itemIndex * 0.26;
        slide.addShape(SH.roundRect, {
          x: cardX + 0.12,
          y: rowY,
          w: cardW - 0.24,
          h: 0.2,
          rectRadius: 0.02,
          fill: { color: itemIndex % 2 === 0 ? TOKENS.white : TOKENS.mist },
          line: { color: TOKENS.border, pt: 1 },
        });
        slide.addText(item, {
          x: cardX + 0.2,
          y: rowY + 0.05,
          w: cardW - 0.4,
          h: 0.08,
          fontFace: TYPOGRAPHY.body,
          fontSize: 7.8,
          color: TOKENS.ink,
          margin: 0,
          fit: "shrink",
        });
      });
      slide.addText(stage.note || "", {
        x: cardX + 0.12,
        y: cardY + cardH - 0.54,
        w: cardW - 0.24,
        h: 0.42,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.7,
        color: TOKENS.slate,
        margin: 0,
        valign: "mid",
      });

      if (index < stages.length - 1) {
        slide.addShape(SH.chevron, {
          x: cardX + cardW + 0.03,
          y: cardY + cardH / 2 - 0.14,
          w: 0.1,
          h: 0.28,
          fill: { color: TOKENS.gold },
          line: { color: TOKENS.gold },
        });
      }
    });
  } else {
    const gapX = 0.14;
    const gapY = 0.16;
    const cardW = (w - 0.36 - gapX) / 2;
    const cardH = (h - 1 - footerReserve - gapY) / 2;
    stages.forEach((stage, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const cardX = x + 0.18 + col * (cardW + gapX);
      const cardY = y + 0.64 + row * (cardH + gapY);
      addSurface(slide, SH, cardX, cardY, cardW, cardH, {
        fill: stage.fill || TOKENS.paper,
        line: stage.accent || TOKENS.border,
        linePt: 1.1,
      });
      slide.addShape(SH.roundRect, {
        x: cardX + 0.12,
        y: cardY + 0.1,
        w: 0.58,
        h: 0.24,
        rectRadius: 0.04,
        fill: { color: stage.accent || TOKENS.red },
        line: { color: stage.accent || TOKENS.red },
      });
      slide.addText(stage.badge || "", {
        x: cardX + 0.16,
        y: cardY + 0.15,
        w: 0.5,
        h: 0.1,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.1,
        bold: true,
        color: TOKENS.white,
        margin: 0,
        align: "center",
      });
      slide.addText(stage.title || "", {
        x: cardX + 0.12,
        y: cardY + 0.42,
        w: cardW - 0.24,
        h: 0.16,
        fontFace: TYPOGRAPHY.display,
        fontSize: 10.4,
        bold: true,
        color: TOKENS.navy,
        margin: 0,
      });
      slide.addText(stage.focus || "", {
        x: cardX + 0.12,
        y: cardY + 0.66,
        w: cardW - 0.24,
        h: 0.16,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.4,
        bold: true,
        color: stage.accent || TOKENS.red,
        margin: 0,
      });
      slide.addText(stage.note || "", {
        x: cardX + 0.12,
        y: cardY + 0.92,
        w: cardW - 0.24,
        h: cardH - 1.04,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.4,
        color: TOKENS.slate,
        margin: 0,
        valign: "mid",
      });
    });
  }

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: footerY,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addSqlBridgePanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const footerReserve = opts.footer ? 0.26 : 0;
  const tables = (opts.tables || [
    { title: "Cliente", meta: "cliente_id (PK)", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "Obra", meta: "cliente_id (FK)", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { title: "Asignacion", meta: "obra_id + profesional_id", accent: TOKENS.gold, fill: TOKENS.warm },
  ]).slice(0, 4);
  const codeLines = (opts.codeLines || [
    "CREATE TABLE cliente (",
    "  cliente_id INT PRIMARY KEY,",
    "  nombre VARCHAR(120) NOT NULL",
    ");",
    "SELECT * FROM obra;",
  ]).slice(0, 8);
  const bodyY = y + 0.62;
  const bodyH = h - 0.82 - footerReserve;
  const leftW = w * 0.38;
  const bridgeW = 0.44;
  const rightW = w - leftW - bridgeW - 0.54;
  const leftX = x + 0.18;
  const rightX = leftX + leftW + bridgeW + 0.18;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.paper,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Del modelo relacional a SQL", {
    fill: TOKENS.softNeutral,
  });

  addSurface(slide, SH, leftX, bodyY, leftW, bodyH, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  slide.addText("Modelo logico", {
    x: leftX + 0.14,
    y: bodyY + 0.14,
    w: leftW - 0.28,
    h: 0.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11.6,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });

  const chipGap = 0.14;
  const chipH = (bodyH - 0.64 - chipGap * (tables.length - 1)) / Math.max(tables.length, 1);
  tables.forEach((table, index) => {
    const chipY = bodyY + 0.46 + index * (chipH + chipGap);
    addSurface(slide, SH, leftX + 0.12, chipY, leftW - 0.24, chipH, {
      fill: table.fill || TOKENS.softBlue,
      line: table.accent || TOKENS.border,
      linePt: 1.1,
    });
    addIconBadge(slide, SH, leftX + 0.24, chipY + 0.12, 0.38, 0.38, index === 0 ? "user" : index === 1 ? "building" : "link", {
      fill: TOKENS.white,
      accent: table.accent || TOKENS.red,
      secondary: TOKENS.gold,
    });
    slide.addText(table.title || "", {
      x: leftX + 0.72,
      y: chipY + 0.16,
      w: leftW - 0.96,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 10.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText(table.meta || "", {
      x: leftX + 0.72,
      y: chipY + 0.38,
      w: leftW - 0.96,
      h: chipH - 0.46,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });
  });

  slide.addShape(SH.chevron, {
    x: leftX + leftW + 0.1,
    y: bodyY + bodyH / 2 - 0.28,
    w: 0.24,
    h: 0.56,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  addSurface(slide, SH, rightX, bodyY, rightW, bodyH, {
    fill: TOKENS.editorBg,
    line: TOKENS.editorBg,
  });
  slide.addShape(SH.roundRect, {
    x: rightX + 0.1,
    y: bodyY + 0.1,
    w: rightW - 0.2,
    h: 0.28,
    rectRadius: 0.03,
    fill: { color: TOKENS.titleFill },
    line: { color: TOKENS.titleFill },
  });
  slide.addText(opts.codeTitle || "SQL minimo", {
    x: rightX + 0.18,
    y: bodyY + 0.17,
    w: rightW - 1.16,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.4,
    bold: true,
    color: TOKENS.white,
    margin: 0,
  });
  addIconBadge(slide, SH, rightX + rightW - 0.34, bodyY + 0.15, 0.14, 0.14, "sql", {
    fill: TOKENS.softNeutral,
    accent: TOKENS.red,
    secondary: TOKENS.gold,
  });
  codeLines.forEach((line, index) => {
    const lineY = bodyY + 0.5 + index * 0.24;
    slide.addText(`${index + 1}`, {
      x: rightX + 0.12,
      y: lineY,
      w: 0.16,
      h: 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 7.2,
      color: TOKENS.terminalMuted,
      margin: 0,
      align: "right",
    });
    slide.addText(line, {
      x: rightX + 0.34,
      y: lineY,
      w: rightW - 0.46,
      h: 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8,
      color:
        line.includes("CREATE TABLE") || line.includes("SELECT")
          ? TOKENS.warning
          : line.includes("PRIMARY KEY") || line.includes("NOT NULL")
            ? TOKENS.success
            : TOKENS.white,
      margin: 0,
      fit: "shrink",
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

function addFrameworkDecisionMatrix(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const rows = opts.rows || [
    {
      label: "Layout",
      helps: "Acelera una primera grilla o utilidades base.",
      risk: "Si se copia sin entender, el layout se vuelve rigido.",
      decision: "Definir que patron quedara compartido.",
      accent: TOKENS.navy,
    },
    {
      label: "Componentes",
      helps: "Entrega piezas listas y variantes iniciales.",
      risk: "Puede arrastrar UI ajena o verbosa.",
      decision: "Adaptar estados, nombres y espaciado propios.",
      accent: TOKENS.red,
    },
    {
      label: "Tema",
      helps: "Ordena color, espacio y consistencia visual.",
      risk: "Si nadie entiende el theme, queda caja negra.",
      decision: "Documentar tokens minimos del equipo.",
      accent: TOKENS.gold,
    },
  ];

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Frameworks con criterio", {
    fill: TOKENS.softNeutral,
  });

  const footerReserve = opts.footer ? 0.34 : 0;
  const innerX = x + 0.18;
  const innerY = y + 0.62;
  const innerW = w - 0.36;
  const innerH = h - 0.82 - footerReserve;
  const topicW = Math.max(1.1, innerW * 0.18);
  const helpW = Math.max(1.8, innerW * 0.3);
  const riskW = Math.max(1.8, innerW * 0.3);
  const decisionW = innerW - topicW - helpW - riskW - 0.18;
  const headerH = 0.34;
  const rowGap = 0.08;
  const rowH = Math.max(0.56, (innerH - headerH - rowGap * rows.length) / Math.max(rows.length, 1));
  const colGap = 0.06;
  const helpX = innerX + topicW + colGap;
  const riskX = helpX + helpW + colGap;
  const decisionX = riskX + riskW + colGap;

  [
    { x: innerX, w: topicW, text: "Zona", fill: TOKENS.softNeutral },
    { x: helpX, w: helpW, text: "Si acelera", fill: TOKENS.softBlue },
    { x: riskX, w: riskW, text: "Puede volver fija la interfaz", fill: TOKENS.paleRed },
    { x: decisionX, w: decisionW, text: "Decide el equipo", fill: TOKENS.warm },
  ].forEach((header) => {
    slide.addShape(SH.roundRect, {
      x: header.x,
      y: innerY,
      w: header.w,
      h: headerH,
      rectRadius: 0.03,
      fill: { color: header.fill },
      line: { color: header.fill },
    });
    slide.addText(header.text, {
      x: header.x + 0.12,
      y: innerY + 0.09,
      w: header.w - 0.24,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.2,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
    });
  });

  rows.slice(0, 4).forEach((row, index) => {
    const rowY = innerY + headerH + rowGap + index * (rowH + rowGap);
    const accent = row.accent || (index === 0 ? TOKENS.navy : index === 1 ? TOKENS.red : TOKENS.gold);

    slide.addShape(SH.roundRect, {
      x: innerX,
      y: rowY,
      w: topicW,
      h: rowH,
      rectRadius: 0.03,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.rect, {
      x: innerX,
      y: rowY,
      w: 0.08,
      h: rowH,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(row.label || "Tema", {
      x: innerX + 0.16,
      y: rowY + 0.16,
      w: topicW - 0.26,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });

    [
      { x: helpX, w: helpW, text: row.helps || "", fill: TOKENS.softBlue, line: TOKENS.softBlue },
      { x: riskX, w: riskW, text: row.risk || "", fill: TOKENS.paleRed, line: TOKENS.paleRed },
      { x: decisionX, w: decisionW, text: row.decision || "", fill: TOKENS.warm, line: TOKENS.warm },
    ].forEach((cell) => {
      slide.addShape(SH.roundRect, {
        x: cell.x,
        y: rowY,
        w: cell.w,
        h: rowH,
        rectRadius: 0.03,
        fill: { color: cell.fill },
        line: { color: cell.line, pt: 1 },
      });
      slide.addText(cell.text, {
        x: cell.x + 0.14,
        y: rowY + 0.12,
        w: cell.w - 0.28,
        h: rowH - 0.18,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.6,
        color: TOKENS.ink,
        margin: 0,
        valign: "mid",
      });
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.2,
      y: y + h - 0.18,
      w: w - 0.4,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.4,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
    });
  }
}

module.exports = {
  addResponsiveViewportCompare,
  addResponsiveReflowPanel,
  addBreakpointDecisionPanel,
  addComponentVariantBoard,
  addQualityDimensionsPanel,
  addAuditEvidenceBoard,
  addSeoSnippetPreview,
  addComponentConsistencyPanel,
  addCssRuleStack,
  addCascadeInspector,
  addSpecificityScale,
  addTokenBoard,
  addFrameworkDecisionMatrix,
  addBoxModelDiagram,
  addFlexGridLayout,
  addLighthouseAuditCard,
  addPerformanceMetricsBoard,
  addNetworkLoadBoard,
  addAuditScorePanel,
  addAccessibilityChecklistPanel,
  addIssuePriorityMatrix,
  addEvaluationRubricPanel,
  addScoreBoostsAndPenalties,
  addProjectWorkflowPanel,
  addPromptQualityCompare,
  addSpreadsheetProblemPanel,
  addEntityRelationshipBlueprint,
  addNormalizationStepper,
  addSqlBridgePanel,
  addStaticVsInteractiveCompare,
  addDataTypesBoard,
  addControlFlowPanel,
  addEventReactionPanel,
  addDomMutationFlow,
  addDebugEvidenceBoard,
};
