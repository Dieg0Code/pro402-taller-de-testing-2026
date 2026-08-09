const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");
const { makeCodeText } = require("../utils/code");

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

function addHeader(slide, SH, x, y, w, text, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.03,
    fill: { color: opts.fill || TOKENS.softNeutral },
    line: { color: opts.fill || TOKENS.softNeutral },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.14,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.8,
    bold: true,
    color: opts.color || TOKENS.navy,
    margin: 0,
  });
}

function addJsonPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;

  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.04,
    fill: { color: opts.fill || TOKENS.editorBg },
    line: { color: opts.fill || TOKENS.editorBg },
  });
  slide.addShape(SH.roundRect, {
    x: x + 0.14,
    y: y + 0.12,
    w: w - 0.28,
    h: 0.34,
    rectRadius: 0.03,
    fill: { color: opts.titleFill || TOKENS.titleFill },
    line: { color: opts.titleFill || TOKENS.titleFill },
  });
  slide.addText(opts.title || "JSON", {
    x: x + 0.26,
    y: y + 0.2,
    w: w - 0.52,
    h: 0.14,
    fontFace: TYPOGRAPHY.body,
    fontSize: 10,
    bold: true,
    color: TOKENS.white,
    margin: 0,
  });
  const codeData = makeCodeText(opts.code || '{\n  "ok": true\n}');
  const fontSize = opts.fontSize || 10.6;
  const digits = codeData.lineDigits;
  const charW = Math.min(0.085, Math.max(0.058, fontSize * 0.0068));
  const numbersW = charW * (digits + 0.6);
  const codeX = x + 0.24 + numbersW + 0.08;
  const codeW = Math.max(0.4, w - (codeX - x) - 0.24);

  slide.addText(codeData.lineNumbers, {
    x: x + 0.24,
    y: y + 0.62,
    w: numbersW,
    h: h - 0.82,
    margin: 0,
    breakLine: false,
    valign: "top",
    align: "right",
    fontFace: "Consolas",
    fontSize,
    color: TOKENS.slate,
  });
  slide.addText(codeData.codeText, {
    x: codeX,
    y: y + 0.62,
    w: codeW,
    h: h - 0.82,
    margin: 0,
    breakLine: false,
    valign: "top",
    fontFace: "Consolas",
    fontSize,
    color: TOKENS.white,
  });
}

function addRequestResponseFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const laneY = y + h / 2 - 0.18;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Request / Response", {
    fill: TOKENS.softNeutral,
  });

  addSurface(slide, SH, x + 0.24, laneY, 1.28, 0.74, {
    fill: TOKENS.softBlue,
    line: TOKENS.softBlue,
  });
  slide.addText(opts.clientLabel || "Cliente", {
    x: x + 0.24,
    y: laneY + 0.16,
    w: 1.28,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });

  addSurface(slide, SH, x + w - 1.52, laneY, 1.28, 0.74, {
    fill: TOKENS.paleRed,
    line: TOKENS.paleRed,
  });
  slide.addText(opts.serverLabel || "Servidor", {
    x: x + w - 1.52,
    y: laneY + 0.16,
    w: 1.28,
    h: 0.16,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });

  slide.addShape(SH.chevron, {
    x: x + 1.82,
    y: laneY + 0.08,
    w: 0.48,
    h: 0.24,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red },
  });
  slide.addText(opts.requestLabel || "GET /api/cursos", {
    x: x + 2.34,
    y: laneY - 0.02,
    w: w - 4.68,
    h: 0.18,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10.2,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });
  slide.addText(opts.requestMeta || "Headers, params, auth, payload", {
    x: x + 2.34,
    y: laneY + 0.2,
    w: w - 4.68,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.8,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
  });

  slide.addShape(SH.chevron, {
    x: x + w - 2.3,
    y: laneY + 0.42,
    w: 0.48,
    h: 0.24,
    rotate: 180,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText(opts.responseLabel || "200 OK", {
    x: x + 2.34,
    y: laneY + 0.48,
    w: w - 4.68,
    h: 0.16,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10.2,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
  });
  slide.addText(opts.responseMeta || "JSON, errores o confirmación", {
    x: x + 2.34,
    y: laneY + 0.7,
    w: w - 4.68,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.8,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
  });
}

function addComponentTree(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const nodes = opts.nodes || [];
  const compact = w <= 3.6;
  const rowStep = compact ? 0.5 : 0.54;
  const nodeHeight = compact ? 0.28 : 0.32;
  const nodeLabelInset = compact ? 0.08 : 0.1;
  const nodeLabelY = compact ? 0.065 : 0.08;

  addSurface(slide, SH, x, y, w, h, {
    fill: TOKENS.white,
    line: TOKENS.border,
  });
  addHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Árbol de componentes", {
    fill: TOKENS.softBlue,
  });

  nodes.forEach((node, index) => {
    const nodeY = y + 0.74 + index * rowStep;
    const depth = node.depth || 0;
    const nodeX = x + 0.34 + depth * 1.02;
    const fill = depth === 0 ? TOKENS.paleRed : depth % 2 === 0 ? TOKENS.softNeutral : TOKENS.softBlue;
    const line = depth === 0 ? TOKENS.red : depth % 2 === 0 ? TOKENS.gold : TOKENS.navy;
    const nodeWidth = Math.min(1.64, 0.74 + (node.label || "").length * 0.1);
    const labelWidth = Math.min(1.44, 0.54 + (node.label || "").length * 0.1);

    if (depth > 0) {
      slide.addShape(SH.line, {
        x: nodeX - 0.16,
        y: nodeY + nodeHeight / 2,
        w: 0.16,
        h: 0,
        line: { color: TOKENS.guide, pt: 1 },
      });
    }

    if (index < nodes.length - 1 && (nodes[index + 1].depth || 0) > depth) {
      slide.addShape(SH.line, {
        x: nodeX - 0.16,
        y: nodeY + nodeHeight / 2,
        w: 0,
        h: rowStep,
        line: { color: TOKENS.guide, pt: 1 },
      });
    }

    slide.addShape(SH.roundRect, {
      x: nodeX,
      y: nodeY,
      w: nodeWidth,
      h: nodeHeight,
      rectRadius: 0.03,
      fill: { color: fill },
      line: { color: line, pt: 1 },
    });
    slide.addText(node.label || "Component", {
      x: nodeX + nodeLabelInset,
      y: nodeY + nodeLabelY,
      w: labelWidth,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 8.8 : 9.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });

    if (node.meta) {
      const sideMetaX = nodeX + nodeWidth + 0.18;
      const sideMetaW = x + w - sideMetaX - 0.18;
      const metaOptions = compact
        ? {
            x: nodeX + 0.08,
            y: nodeY + 0.31,
            w: Math.max(0.84, w - (nodeX - x) - 0.24),
            h: 0.1,
            fontSize: 7.1,
          }
        : sideMetaW >= 0.92
          ? {
              x: sideMetaX,
              y: nodeY + 0.04,
              w: sideMetaW,
              h: 0.22,
              fontSize: sideMetaW < 1.28 ? 7.2 : 7.8,
            }
          : {
              x: nodeX + 0.08,
              y: nodeY + 0.35,
              w: Math.max(0.9, w - (nodeX - x) - 0.24),
              h: 0.1,
              fontSize: 7,
            };

      slide.addText(node.meta, {
        ...metaOptions,
        fontFace: TYPOGRAPHY.body,
        color: TOKENS.slate,
        margin: 0,
        fit: "shrink",
        valign: "mid",
      });
    }
  });
}

module.exports = {
  addJsonPanel,
  addRequestResponseFlow,
  addComponentTree,
};
