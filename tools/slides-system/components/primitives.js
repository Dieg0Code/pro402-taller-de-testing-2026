const { imageSizingContain } = require("../vendor/pptxgenjs_helpers/image");
const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function setBackground(slide, color = TOKENS.paper) {
  slide.background = { color };
}

function addTopRule(slide, SH, color = TOKENS.navy) {
  slide.addShape(SH.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.16,
    fill: { color },
    line: { color },
  });
}

function addSlideNumber(slide, pptx, opts = {}) {
  slide.addText(String(pptx._slides.length).padStart(2, "0"), {
    x: opts.x || 10.75,
    y: opts.y || 0.26,
    w: opts.w || 1.9,
    h: opts.h || 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.fontSize || 28,
    bold: true,
    color: opts.color || TOKENS.sand,
    align: "right",
    margin: 0,
  });
}

function addMarkBox(slide, SH, logoMarkPath, opts = {}) {
  slide.addShape(SH.ellipse, {
    x: opts.x || 11.04,
    y: opts.y || 0.94,
    w: opts.w || 1.08,
    h: opts.h || 0.82,
    fill: { color: opts.fill || TOKENS.softNeutral },
    line: { color: opts.fill || TOKENS.softNeutral },
  });
  if (logoMarkPath) {
    slide.addImage({
      path: logoMarkPath,
      ...imageSizingContain(
        logoMarkPath,
        opts.imageX || 11.25,
        opts.imageY || 1.16,
        opts.imageW || 0.66,
        opts.imageH || 0.34
      ),
    });
  }
}

function addChip(slide, SH, text, opts = {}) {
  const x = opts.x || 0.72;
  const y = opts.y || 0.52;
  const w = opts.w || 2.15;
  const fill = opts.fill || TOKENS.red;
  const color = opts.color || TOKENS.white;
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h: opts.h || 0.34,
    rectRadius: opts.rectRadius || 0.05,
    fill: { color: fill },
    line: { color: fill },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.04,
    w: w - 0.24,
    h: 0.22,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.fontSize || 9.5,
    bold: true,
    color,
    align: "center",
    margin: 0,
  });
}

function addPill(slide, SH, text, opts = {}) {
  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w || 1.2,
    h: opts.h || 0.28,
    rectRadius: opts.rectRadius || 0.05,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: 1 },
  });
  slide.addText(text, {
    x: opts.x + 0.08,
    y: opts.y + 0.04,
    w: (opts.w || 1.2) - 0.16,
    h: (opts.h || 0.28) - 0.08,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.fontSize || 9.5,
    bold: true,
    color: opts.color || TOKENS.navy,
    align: "center",
    margin: 0,
  });
}

function addCard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.04,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: 1 },
  });
  slide.addShape(SH.rect, {
    x: x + 0.1,
    y: y + 0.14,
    w: opts.accentW || 0.12,
    h: h - 0.28,
    fill: { color: opts.accent || TOKENS.red },
    line: { color: opts.accent || TOKENS.red },
  });
  slide.addText(opts.title || "", {
    x: x + 0.28,
    y: y + 0.12,
    w: w - 0.38,
    h: 0.34,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 16,
    bold: true,
    color: opts.titleColor || TOKENS.navy,
    margin: 0,
  });
  if (opts.body) {
    slide.addText(opts.body, {
      x: x + 0.28,
      y: y + (opts.bodyYOffset || 0.5),
      w: w - 0.38,
      h: h - (opts.bodyYOffset || 0.5) - 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.bodyFontSize || 12.5,
      color: opts.bodyColor || TOKENS.ink,
      margin: 0,
      valign: "top",
      align: opts.bodyAlign || "left",
      breakLine: false,
    });
  }
}

function addMiniCard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const accentH = Math.max(0.02, h - 0.24);
  const titleH = Math.min(0.24, Math.max(0.18, h - 0.18));
  const bodyY = y + 0.44;
  const bodyH = Math.max(0, h - 0.54);
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.03,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: 1 },
  });
  slide.addShape(SH.rect, {
    x: x + 0.08,
    y: y + 0.12,
    w: 0.11,
    h: accentH,
    fill: { color: opts.accent || TOKENS.red },
    line: { color: opts.accent || TOKENS.red },
  });
  slide.addText(opts.title || "", {
    x: x + 0.28,
    y: y + 0.14,
    w: w - 0.36,
    h: titleH,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 12.5,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  if (opts.body && bodyH > 0.08) {
    slide.addText(opts.body, {
      x: x + 0.28,
      y: bodyY,
      w: w - 0.36,
      h: bodyH,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.bodyFontSize || 10.5,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
    });
  }
}

function addCenterStatement(slide, SH, text, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.04,
    fill: { color: opts.fill || TOKENS.warm },
    line: { color: opts.fill || TOKENS.warm },
  });
  slide.addText(text, {
    x: x + 0.22,
    y: y + 0.18,
    w: w - 0.44,
    h: h - 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.fontSize || 22,
    bold: true,
    color: opts.color || TOKENS.navy,
    align: "center",
    valign: "mid",
    margin: 0,
  });
}

function addHeader(slide, SH, pptx, title, subtitle, blockLabel, opts = {}) {
  setBackground(slide, opts.background || TOKENS.paper);
  addTopRule(slide, SH, opts.ruleColor || TOKENS.navy);
  addSlideNumber(slide, pptx, opts.number || {});
  addChip(slide, SH, opts.classLabel || `Clase · ${blockLabel || "Bloque"}`, {
    x: 0.72,
    y: 0.52,
    w: opts.chipW || 2.18,
    fill: TOKENS.red,
  });
  addMarkBox(slide, SH, opts.logoMarkPath, opts.mark || {});
  slide.addText(title, {
    x: opts.titleX || 0.72,
    y: opts.titleY || 0.98,
    w: opts.titleW || 8.9,
    h: opts.titleH || 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 24,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: opts.subtitleX || 0.74,
      y: opts.subtitleY || 1.84,
      w: opts.subtitleW || 8.6,
      h: opts.subtitleH || 0.42,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.subtitleFontSize || 12.5,
      color: TOKENS.slate,
      margin: 0,
    });
  }
}

module.exports = {
  setBackground,
  addTopRule,
  addSlideNumber,
  addMarkBox,
  addChip,
  addPill,
  addCard,
  addMiniCard,
  addCenterStatement,
  addHeader,
};
