const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function getTone(tone) {
  switch (tone) {
    case "red":
      return { fill: TOKENS.paleRed, line: TOKENS.paleRed, accent: TOKENS.red };
    case "blue":
      return { fill: TOKENS.softBlue, line: TOKENS.softBlue, accent: TOKENS.navy };
    case "gold":
      return { fill: TOKENS.softNeutral, line: TOKENS.softNeutral, accent: TOKENS.gold };
    case "neutral":
    default:
      return { fill: TOKENS.white, line: TOKENS.border, accent: TOKENS.slate };
  }
}

function addDomTreePanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const title = opts.title || "Árbol DOM";
  const subtitle = opts.subtitle || "";
  const nodes = opts.nodes || [];
  const rowH = opts.rowH || 0.28;
  const rowGap = opts.rowGap || 0.12;
  const indent = opts.indent || 0.34;

  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.roundRect, {
    x: x + 0.14,
    y: y + 0.14,
    w: w - 0.28,
    h: 0.34,
    rectRadius: 0.03,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.softNeutral },
  });
  slide.addText(title, {
    x: x + 0.26,
    y: y + 0.21,
    w: w - 0.52,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: x + 0.22,
      y: y + 0.56,
      w: w - 0.44,
      h: 0.24,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.5,
      color: TOKENS.slate,
      margin: 0,
    });
  }

  const contentX = x + 0.28;
  const contentY = y + (subtitle ? 0.96 : 0.78);
  const contentW = w - 0.56;
  const contentH = h - (subtitle ? 1.16 : 0.98);
  const maxDepth = nodes.reduce((max, node) => Math.max(max, node.depth || 0), 0);
  const totalRowsH = nodes.length * rowH + Math.max(0, nodes.length - 1) * rowGap;
  const guideH = Math.min(contentH, totalRowsH + 0.08);

  slide.addShape(SH.roundRect, {
    x: contentX,
    y: contentY,
    w: contentW,
    h: contentH,
    rectRadius: 0.03,
    fill: { color: TOKENS.paper },
    line: { color: TOKENS.paper },
  });

  for (let depth = 1; depth <= maxDepth; depth += 1) {
    slide.addShape(SH.line, {
      x: contentX + 0.18 + depth * indent,
      y: contentY + 0.1,
      w: 0,
      h: guideH,
      line: { color: TOKENS.border, pt: 0.8 },
    });
  }

  nodes.forEach((node, index) => {
    const depth = node.depth || 0;
    const tone = getTone(node.tone);
    const rowY = contentY + 0.1 + index * (rowH + rowGap);
    const chipX = contentX + 0.18 + depth * indent;
    const chipW =
      node.width || Math.min(1.38, Math.max(0.66, 0.44 + node.tag.length * 0.11));
    const detailX = chipX + chipW + 0.14;

    if (depth > 0) {
      slide.addShape(SH.line, {
        x: chipX - 0.14,
        y: rowY + rowH / 2,
        w: 0.14,
        h: 0,
        line: { color: TOKENS.guide, pt: 1.1 },
      });
    }

    slide.addShape(SH.ellipse, {
      x: chipX - 0.18,
      y: rowY + rowH / 2 - 0.04,
      w: 0.08,
      h: 0.08,
      fill: { color: tone.accent },
      line: { color: tone.accent },
    });

    slide.addShape(SH.roundRect, {
      x: chipX,
      y: rowY,
      w: chipW,
      h: rowH,
      rectRadius: 0.03,
      fill: { color: tone.fill },
      line: { color: tone.line, pt: 1 },
    });
    slide.addText(node.tag, {
      x: chipX + 0.08,
      y: rowY + 0.06,
      w: chipW - 0.16,
      h: rowH - 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });

    if (node.detail) {
      slide.addText(node.detail, {
        x: detailX,
        y: rowY + 0.05,
        w: contentX + contentW - detailX - 0.08,
        h: rowH,
        fontFace: TYPOGRAPHY.body,
        fontSize: 9.1,
        color: TOKENS.slate,
        margin: 0,
        valign: "mid",
        fit: "shrink",
      });
    }
  });
}

module.exports = {
  addDomTreePanel,
};
