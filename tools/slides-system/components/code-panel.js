const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");
const { makeCodeText, makeCodeSvgData } = require("../utils/code");

function resolveHighlightFill(color) {
  if (color === TOKENS.red) return TOKENS.paleRed;
  if (color === TOKENS.navy) return TOKENS.softBlue;
  if (color === TOKENS.gold || color === TOKENS.warning) return TOKENS.warm;
  return TOKENS.softNeutral;
}

function addBadge(slide, SH, x, y, size, color, label, fontSize) {
  slide.addShape(SH.roundRect, {
    x: x - size / 2,
    y: y - size / 2,
    w: size,
    h: size,
    rectRadius: size / 2,
    fill: { color },
    line: { color },
  });

  if (!label) return;

  slide.addText(String(label), {
    x: x - size / 2,
    y: y - size / 2 + 0.01,
    w: size,
    h: size - 0.02,
    fontFace: TYPOGRAPHY.body,
    fontSize,
    bold: true,
    color: TOKENS.white,
    align: "center",
    valign: "mid",
    margin: 0,
  });
}

function addTargetTab(slide, SH, x, y, w, h, color, label, fontSize) {
  slide.addShape(SH.roundRect, {
    x,
    y: y - h / 2,
    w,
    h,
    rectRadius: 0.04,
    fill: { color },
    line: { color },
  });

  if (!label) return;

  slide.addText(String(label), {
    x,
    y: y - h / 2 + 0.01,
    w,
    h: h - 0.02,
    fontFace: TYPOGRAPHY.body,
    fontSize,
    bold: true,
    color: TOKENS.white,
    align: "center",
    valign: "mid",
    margin: 0,
  });
}

function addPort(slide, SH, edgeX, y, w, h, color, side = "right") {
  slide.addShape(SH.roundRect, {
    x: side === "right" ? edgeX + 0.02 : edgeX - w - 0.02,
    y: y - h / 2,
    w,
    h,
    rectRadius: Math.min(0.05, h / 2),
    fill: { color },
    line: { color },
  });
}

function getCodeMetrics(opts = {}) {
  const fontSize = opts.fontSize || 11.2;
  const code = opts.code || "";
  const totalLines = opts.totalLines || Math.max(1, String(code).split("\n").length);
  const digits = opts.lineDigits || String(totalLines).length;
  const charW = opts.charW || Math.min(0.085, Math.max(0.058, fontSize * 0.0068));
  const linePitch =
    opts.linePitch || Math.max(0.16, (fontSize / 72) * (opts.lineHeight || 1.26));

  return {
    codeX: opts.x,
    codeY: opts.y,
    codeW: opts.w,
    codeH: opts.h,
    fontSize,
    totalLines,
    lineDigits: digits,
    charW,
    linePitch,
    textOffsetX: opts.textOffsetX || 0.24,
    textOffsetY: opts.textOffsetY || 0.62,
    textAreaH: opts.textAreaH || opts.h - 0.82,
  };
}

function addCodeFocus(slide, SH, metrics, opts = {}) {
  const totalLines = metrics.totalLines || 1;
  const lineNumber = opts.lineNumber || 1;
  const color = opts.color || TOKENS.red;
  const highlightFill = opts.highlightFill || resolveHighlightFill(color);
  const fontSize = opts.fontSize || metrics.fontSize || 11.2;
  const linePitch = opts.linePitch || metrics.linePitch;
  const digits = opts.lineDigits || metrics.lineDigits || String(totalLines).length;
  const charW = opts.charW || metrics.charW || Math.min(0.085, Math.max(0.058, fontSize * 0.0068));
  const textOffsetX = opts.textOffsetX || metrics.textOffsetX || 0.24;
  const textOffsetY = opts.textOffsetY || metrics.textOffsetY || 0.62;
  const column = opts.column || 1;
  const tokenLength = opts.length || 4;
  const codeStartX = metrics.codeX + textOffsetX + (digits + 1) * charW;
  const markerX = codeStartX + (column - 1) * charW;
  const markerW = Math.max(0.16, tokenLength * charW);
  const highlightX = Math.max(codeStartX - 0.02, markerX - 0.06);
  const highlightY =
    metrics.codeY + textOffsetY + (lineNumber - 1) * linePitch + linePitch * 0.14;
  const highlightW = Math.max(
    0.22,
    Math.min(metrics.codeX + metrics.codeW - 0.34 - highlightX, markerW + 0.18)
  );
  const highlightH = opts.highlightH || Math.max(0.18, linePitch * 0.72);

  slide.addShape(SH.roundRect, {
    x: highlightX,
    y: highlightY,
    w: highlightW,
    h: highlightH,
    rectRadius: 0.04,
    fill: { color: highlightFill, transparency: 68 },
    line: { color: highlightFill, transparency: 100, pt: 0 },
  });
}

function addCodePanel(slide, SH, opts = {}) {
  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    rectRadius: opts.rectRadius || 0.04,
    fill: { color: opts.fill || TOKENS.editorBg },
    line: { color: opts.fill || TOKENS.editorBg },
  });

  if (opts.title) {
    slide.addShape(SH.roundRect, {
      x: opts.x + 0.14,
      y: opts.y + 0.12,
      w: opts.w - 0.28,
      h: 0.34,
      rectRadius: 0.03,
      fill: { color: opts.titleFill || TOKENS.titleFill },
      line: { color: opts.titleFill || TOKENS.titleFill },
    });
    slide.addText(opts.title, {
      x: opts.x + 0.26,
      y: opts.y + 0.2,
      w: opts.w - 0.52,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: 10,
      bold: true,
      color: TOKENS.white,
      margin: 0,
    });
  }

  const metrics = getCodeMetrics(opts);
  const codeData = makeCodeText(opts.code || "");
  const codeImageX = metrics.codeX + metrics.textOffsetX;
  const codeImageY = metrics.codeY + metrics.textOffsetY;
  const codeImageW = Math.max(0.4, metrics.codeW - metrics.textOffsetX - 0.22);
  const codeImageH = Math.max(0.2, metrics.textAreaH);

  if (Array.isArray(opts.annotations)) {
    opts.annotations.forEach((annotation) => {
      addCodeFocus(slide, SH, metrics, annotation);
    });
  }

  slide.addImage({
    data: makeCodeSvgData(opts.code || "", opts.lang || "html", {
      width: codeImageW,
      height: codeImageH,
      fontSize: metrics.fontSize,
      linePitch: metrics.linePitch,
      charW: metrics.charW,
      lineDigits: codeData.lineDigits,
      topOffset: opts.topOffset != null ? opts.topOffset : opts.title ? 0.06 : 0.03,
    }),
    x: codeImageX,
    y: codeImageY,
    w: codeImageW,
    h: codeImageH,
  });

  return {
    ...metrics,
    totalLines: codeData.totalLines,
    lineDigits: codeData.lineDigits,
  };
}

/**
 * Presenta código como artefacto principal y conecta tokens concretos con una
 * explicación externa. A diferencia de addCodeAnnotation, evita cubrir líneas
 * completas con resaltados y mantiene todos los recorridos fuera del editor.
 */
function addCodeWalkthrough(slide, SH, opts = {}) {
  const editor = opts.editor || {};
  const metrics = addCodePanel(slide, SH, editor);
  const callouts = opts.callouts || [];

  callouts.forEach((callout, index) => {
    const color = callout.color || TOKENS.red;
    const lineNumber = callout.lineNumber || 1;
    const column = callout.column || 1;
    const tokenLength = callout.length || 4;
    const codeStartX =
      metrics.codeX + metrics.textOffsetX + (metrics.lineDigits + 1) * metrics.charW;
    const markerX = codeStartX + (column - 1) * metrics.charW;
    const markerW = Math.max(0.18, tokenLength * metrics.charW);
    const lineTop =
      metrics.codeY + metrics.textOffsetY + (lineNumber - 1) * metrics.linePitch;
    const anchorY = lineTop + metrics.linePitch * 0.54;
    const underlineY = lineTop + metrics.linePitch * 0.88;
    const targetX = callout.x;
    const targetY = callout.y;
    const targetW = callout.w;
    const targetH = callout.h;
    const targetAnchorY = callout.anchorY != null
      ? targetY + callout.anchorY
      : targetY + targetH / 2;
    const edgeX = metrics.codeX + metrics.codeW;
    const laneX = callout.laneX || edgeX + 0.22 + index * 0.08;
    const connectorColor = callout.connectorColor || TOKENS.guide;
    const stroke = callout.stroke || 0.018;

    // La única marca dentro del editor corresponde exactamente al token explicado.
    slide.addShape(SH.roundRect, {
      x: markerX,
      y: underlineY,
      w: markerW,
      h: 0.045,
      rectRadius: 0.02,
      fill: { color },
      line: { color, pt: 0 },
    });

    // Un puerto discreto lleva la lectura al pasillo externo sin atravesar el código.
    slide.addShape(SH.roundRect, {
      x: edgeX + 0.02,
      y: anchorY - 0.09,
      w: 0.09,
      h: 0.18,
      rectRadius: 0.03,
      fill: { color },
      line: { color, pt: 0 },
    });
    addSegment(slide, SH, edgeX, anchorY - stroke / 2, laneX - edgeX, stroke, connectorColor);
    addSegment(
      slide,
      SH,
      laneX - stroke / 2,
      Math.min(anchorY, targetAnchorY),
      stroke,
      Math.max(stroke, Math.abs(targetAnchorY - anchorY)),
      connectorColor
    );
    addSegment(
      slide,
      SH,
      laneX,
      targetAnchorY - stroke / 2,
      Math.max(stroke, targetX - laneX),
      stroke,
      connectorColor
    );

    slide.addShape(SH.roundRect, {
      x: targetX,
      y: targetY,
      w: targetW,
      h: targetH,
      rectRadius: 0.07,
      fill: { color: callout.fill || TOKENS.white },
      line: { color: callout.border || TOKENS.border, pt: 1 },
    });
    slide.addShape(SH.rect, {
      x: targetX,
      y: targetY,
      w: 0.11,
      h: targetH,
      fill: { color },
      line: { color, pt: 0 },
    });

    const lineTag = callout.lineTag || `L${lineNumber}`;
    slide.addShape(SH.roundRect, {
      x: targetX + 0.28,
      y: targetY + 0.2,
      w: 0.54,
      h: 0.28,
      rectRadius: 0.05,
      fill: { color },
      line: { color, pt: 0 },
    });
    slide.addText(lineTag, {
      x: targetX + 0.28,
      y: targetY + 0.2,
      w: 0.54,
      h: 0.28,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.5,
      bold: true,
      color: callout.tagColor || TOKENS.white,
      align: "center",
      valign: "mid",
      margin: 0,
    });
    slide.addText((callout.eyebrow || "LECTURA").toUpperCase(), {
      x: targetX + 0.96,
      y: targetY + 0.23,
      w: targetW - 1.22,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.2,
      bold: true,
      color: callout.eyebrowColor || color,
      charSpacing: 0.9,
      margin: 0,
    });
    slide.addText(callout.title || "", {
      x: targetX + 0.28,
      y: targetY + 0.64,
      w: targetW - 0.56,
      h: callout.titleH || 0.3,
      fontFace: callout.titleFontFace || TYPOGRAPHY.body,
      fontSize: callout.titleFontSize || 17,
      bold: true,
      color: TOKENS.ink,
      margin: 0,
    });
    slide.addText(callout.body || "", {
      x: targetX + 0.28,
      y: targetY + (callout.bodyY || 1.02),
      w: targetW - 0.56,
      h: callout.bodyH || Math.max(0.3, targetH - 1.2),
      fontFace: TYPOGRAPHY.body,
      fontSize: callout.bodyFontSize || 13.5,
      color: TOKENS.slate,
      valign: "mid",
      breakLine: false,
      margin: 0,
    });
  });

  return metrics;
}

/**
 * Explica líneas concretas sin estimar la posición horizontal de un token.
 * La correspondencia se resuelve con marcadores numerados en el gutter y una
 * única guía de lectura de alto contraste, sin conectores ni cards flotantes.
 */
function addCodeGuide(slide, SH, opts = {}) {
  const editor = opts.editor || {};
  const metrics = addCodePanel(slide, SH, editor);
  const notes = opts.notes || [];
  const guide = opts.guide || {};
  const guideX = guide.x != null ? guide.x : metrics.codeX + metrics.codeW + 0.34;
  const guideY = guide.y != null ? guide.y : metrics.codeY;
  const guideW = guide.w || 3.6;
  const guideH = guide.h || metrics.codeH;
  const panelFill = guide.fill || TOKENS.navy;

  slide.addShape(SH.roundRect, {
    x: guideX,
    y: guideY,
    w: guideW,
    h: guideH,
    rectRadius: guide.rectRadius || 0.07,
    fill: { color: panelFill },
    line: { color: panelFill, pt: 0 },
  });
  slide.addShape(SH.rect, {
    x: guideX + 0.26,
    y: guideY + 0.26,
    w: 0.08,
    h: 0.28,
    fill: { color: guide.accent || TOKENS.red },
    line: { color: guide.accent || TOKENS.red, pt: 0 },
  });
  slide.addText((guide.title || "LECTURA DEL CÓDIGO").toUpperCase(), {
    x: guideX + 0.5,
    y: guideY + 0.28,
    w: guideW - 0.76,
    h: 0.22,
    fontFace: TYPOGRAPHY.body,
    fontSize: guide.titleFontSize || 9.5,
    bold: true,
    color: guide.titleColor || TOKENS.white,
    charSpacing: 1.1,
    margin: 0,
  });

  const headerH = guide.headerH || 0.76;
  const bottomPad = guide.bottomPad || 0.22;
  const dividerGap = guide.dividerGap || 0.08;
  const availableH = Math.max(0.4, guideH - headerH - bottomPad);
  const sectionH = notes.length > 0
    ? (availableH - dividerGap * Math.max(0, notes.length - 1)) / notes.length
    : availableH;

  notes.forEach((note, index) => {
    const color = note.color || TOKENS.red;
    const lineNumber = note.lineNumber || 1;
    const markerSize = note.markerSize || 0.24;
    const markerCenterY =
      metrics.codeY + metrics.textOffsetY + (lineNumber - 1) * metrics.linePitch + metrics.linePitch * 0.54;
    const markerX = metrics.codeX + 0.015;

    // La marca vive en el gutter: identifica una línea completa y nunca finge
    // apuntar a un token cuya geometría depende del render de la fuente.
    slide.addShape(SH.ellipse, {
      x: markerX,
      y: markerCenterY - markerSize / 2,
      w: markerSize,
      h: markerSize,
      fill: { color },
      line: { color, pt: 0 },
    });
    slide.addText(String(index + 1), {
      x: markerX,
      y: markerCenterY - markerSize / 2,
      w: markerSize,
      h: markerSize,
      fontFace: TYPOGRAPHY.body,
      fontSize: note.markerFontSize || 8.4,
      bold: true,
      color: note.markerTextColor || (color === TOKENS.gold ? TOKENS.ink : TOKENS.white),
      align: "center",
      valign: "mid",
      margin: 0,
    });

    const sectionY = guideY + headerH + index * (sectionH + dividerGap);
    if (index > 0) {
      slide.addShape(SH.line, {
        x: guideX + 0.26,
        y: sectionY - dividerGap / 2,
        w: guideW - 0.52,
        h: 0,
        line: { color: guide.dividerColor || TOKENS.titleFill, pt: 1 },
      });
    }

    slide.addShape(SH.ellipse, {
      x: guideX + 0.26,
      y: sectionY + 0.12,
      w: 0.32,
      h: 0.32,
      fill: { color },
      line: { color, pt: 0 },
    });
    slide.addText(String(index + 1), {
      x: guideX + 0.26,
      y: sectionY + 0.12,
      w: 0.32,
      h: 0.32,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.2,
      bold: true,
      color: note.markerTextColor || (color === TOKENS.gold ? TOKENS.ink : TOKENS.white),
      align: "center",
      valign: "mid",
      margin: 0,
    });
    slide.addText(`L${lineNumber} · ${(note.eyebrow || "LECTURA").toUpperCase()}`, {
      x: guideX + 0.7,
      y: sectionY + 0.17,
      w: guideW - 0.98,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: note.eyebrowFontSize || 8.8,
      bold: true,
      color: note.eyebrowColor || color,
      charSpacing: 0.8,
      margin: 0,
    });
    slide.addText(note.title || "", {
      x: guideX + 0.26,
      y: sectionY + (note.titleY || 0.54),
      w: guideW - 0.52,
      h: note.titleH || 0.34,
      fontFace: note.titleFontFace || TYPOGRAPHY.body,
      fontSize: note.titleFontSize || 16.5,
      bold: true,
      color: note.titleColor || TOKENS.white,
      margin: 0,
    });
    slide.addText(note.body || "", {
      x: guideX + 0.26,
      y: sectionY + (note.bodyY || 0.98),
      w: guideW - 0.52,
      h: note.bodyH || Math.max(0.28, sectionH - 1.12),
      fontFace: note.bodyFontFace || TYPOGRAPHY.body,
      fontSize: note.bodyFontSize || 12.8,
      color: note.bodyColor || TOKENS.softBlue,
      valign: note.bodyValign || "top",
      breakLine: false,
      margin: 0,
    });
  });

  return metrics;
}

function addSegment(slide, SH, x, y, w, h, color) {
  slide.addShape(SH.rect, {
    x,
    y,
    w,
    h,
    fill: { color },
    line: { color },
  });
}

function addCodeAnnotation(slide, SH, opts = {}) {
  const codeX = opts.codeX;
  const codeY = opts.codeY;
  const codeW = opts.codeW;
  const codeH = opts.codeH;
  const totalLines = opts.totalLines || 1;
  const lineNumber = opts.lineNumber || 1;
  const color = opts.color || TOKENS.red;
  const connectorColor = opts.connectorColor || TOKENS.guide || TOKENS.slate;
  const highlightFill = opts.highlightFill || resolveHighlightFill(color);
  const textOffsetX = opts.textOffsetX || 0.24;
  const textOffsetY = opts.textOffsetY || 0.62;
  const textAreaH = opts.textAreaH || codeH - 0.82;
  const fontSize = opts.fontSize || 11.2;
  const linePitch =
    opts.linePitch || Math.max(0.16, (fontSize / 72) * (opts.lineHeight || 1.26));
  const digits = opts.lineDigits || String(totalLines).length;
  const charW = opts.charW || Math.min(0.085, Math.max(0.058, fontSize * 0.0068));
  const side = opts.side || "right";
  const stroke = opts.stroke || 0.018;
  const badgeText = opts.badgeText != null ? String(opts.badgeText) : "";
  const showBadge = opts.showBadge !== false;
  const badgeSize = opts.badgeSize || (badgeText ? 0.18 : 0.1);
  const badgeFontSize = opts.badgeFontSize || (badgeText ? 7.6 : 6.2);
  const sourceBadgeStyle = opts.sourceBadgeStyle || "port";
  const targetBadgeStyle = opts.targetBadgeStyle || "none";
  const showTargetBadgeLabel = opts.showTargetBadgeLabel === true;
  const targetBadgeW = opts.targetBadgeW || (showTargetBadgeLabel ? 0.24 : 0.12);
  const targetBadgeH = opts.targetBadgeH || 0.18;
  const targetBadgeFontSize = opts.targetBadgeFontSize || 7.4;
  const sourcePortW = opts.sourcePortW || 0.08;
  const sourcePortH = opts.sourcePortH || 0.18;
  const codeStartX = codeX + textOffsetX + (digits + 1) * charW;
  const column = opts.column || 1;
  const tokenLength = opts.length || 4;
  const markerX = codeStartX + (column - 1) * charW;
  const markerW = Math.max(0.16, tokenLength * charW);
  const anchorY = codeY + textOffsetY + (lineNumber - 1) * linePitch + linePitch * 0.52;
  const markerY = codeY + textOffsetY + (lineNumber - 1) * linePitch + linePitch * 0.8;
  const markerH = opts.markerH || 0.05;
  const highlightX = Math.max(codeStartX - 0.04, markerX - 0.06);
  const highlightY =
    codeY + textOffsetY + (lineNumber - 1) * linePitch + linePitch * 0.12;
  const highlightW = Math.min(
    codeX + codeW - 0.28 - highlightX,
    markerW + 0.18
  );
  const highlightH = opts.highlightH || Math.max(0.18, linePitch * 0.74);
  const edgeX = side === "right" ? codeX + codeW : codeX;
  const sourceBadgeX =
    side === "right" ? codeX + codeW + badgeSize * 0.56 : codeX - badgeSize * 0.56;
  const laneX = opts.laneX || (side === "right" ? edgeX + 0.18 : edgeX - 0.18);

  let toX = opts.toX;
  let toY = opts.toY;
  let targetBadgeX;
  let targetBadgeY;
  let targetSide;
  if (opts.target) {
    targetSide =
      opts.target.side || (side === "right" ? "left" : "right");
    targetBadgeX =
      targetSide === "left"
        ? opts.target.x - targetBadgeW / 2
        : opts.target.x + opts.target.w - targetBadgeW / 2;
    targetBadgeY =
      (opts.target.y || 0) +
      ((opts.target.anchorY != null
        ? opts.target.anchorY
        : (opts.target.h || 0) / 2));
    toX =
      targetBadgeStyle === "tab"
        ? targetSide === "left"
          ? targetBadgeX
          : targetBadgeX + targetBadgeW
        : targetSide === "left"
          ? opts.target.x
          : opts.target.x + opts.target.w;
    toY =
      (opts.target.y || 0) +
      ((opts.target.anchorY != null
        ? opts.target.anchorY
        : (opts.target.h || 0) / 2));
  }
  const routeY = opts.routeY;

  if (opts.showHighlight !== false) {
    addCodeFocus(slide, SH, {
      codeX,
      codeY,
      codeW,
      codeH,
      fontSize,
      totalLines,
      lineDigits: digits,
      charW,
      linePitch,
      textOffsetX,
      textOffsetY,
      textAreaH,
    }, opts);
  }

  if (opts.showUnderline === true) {
    slide.addShape(SH.roundRect, {
      x: markerX,
      y: markerY,
      w: markerW,
      h: markerH,
      rectRadius: 0.02,
      fill: { color },
      line: { color },
    });
  }

  if (showBadge && sourceBadgeStyle === "circle") {
    addBadge(slide, SH, sourceBadgeX, anchorY, badgeSize, color, badgeText, badgeFontSize);
  } else if (showBadge && sourceBadgeStyle === "port") {
    addPort(slide, SH, edgeX, anchorY, sourcePortW, sourcePortH, color, side);
  }

  const firstSegmentEndX =
    showBadge && sourceBadgeStyle === "circle"
      ? side === "right"
        ? sourceBadgeX - badgeSize / 2
        : sourceBadgeX + badgeSize / 2
      : showBadge && sourceBadgeStyle === "port"
        ? side === "right"
          ? edgeX + 0.02
          : edgeX - 0.02
      : edgeX;
  const firstSegX = Math.min(edgeX, firstSegmentEndX);
  const firstSegW = Math.abs(firstSegmentEndX - edgeX);
  addSegment(
    slide,
    SH,
    firstSegX,
    anchorY - stroke / 2,
      Math.max(stroke, firstSegW),
      stroke,
      connectorColor
  );

  const laneStartX =
    showBadge && sourceBadgeStyle === "circle"
      ? side === "right"
        ? sourceBadgeX + badgeSize / 2
        : sourceBadgeX - badgeSize / 2
      : showBadge && sourceBadgeStyle === "port"
        ? side === "right"
          ? edgeX + 0.02 + sourcePortW
          : edgeX - 0.02 - sourcePortW
      : edgeX;
  addSegment(
    slide,
    SH,
    Math.min(laneStartX, laneX),
    anchorY - stroke / 2,
    Math.max(stroke, Math.abs(laneX - laneStartX)),
    stroke,
    connectorColor
  );

  if (routeY != null) {
    addSegment(
      slide,
      SH,
      laneX - stroke / 2,
      Math.min(anchorY, routeY),
      stroke,
      Math.max(stroke, Math.abs(routeY - anchorY)),
      connectorColor
    );
    addSegment(
      slide,
      SH,
      Math.min(laneX, toX),
      routeY - stroke / 2,
      Math.max(stroke, Math.abs(toX - laneX)),
      stroke,
      connectorColor
    );
    addSegment(
      slide,
      SH,
      toX - stroke / 2,
      Math.min(routeY, toY),
      stroke,
      Math.max(stroke, Math.abs(toY - routeY)),
      connectorColor
    );
  } else {
    addSegment(
      slide,
      SH,
      laneX - stroke / 2,
      Math.min(anchorY, toY),
      stroke,
      Math.max(stroke, Math.abs(toY - anchorY)),
      connectorColor
    );
    addSegment(
      slide,
      SH,
      Math.min(laneX, toX),
      toY - stroke / 2,
      Math.max(stroke, Math.abs(toX - laneX)),
      stroke,
      connectorColor
    );
  }

  if (showBadge && targetBadgeX != null) {
    if (targetBadgeStyle === "circle") {
      addBadge(slide, SH, targetBadgeX, toY, badgeSize, color, badgeText, badgeFontSize);
    } else if (targetBadgeStyle === "tab") {
      addTargetTab(
        slide,
        SH,
        targetBadgeX,
        targetBadgeY != null ? targetBadgeY : toY,
        targetBadgeW,
        targetBadgeH,
        color,
        showTargetBadgeLabel ? badgeText : "",
        targetBadgeFontSize
      );
    }
  }
}

module.exports = {
  addCodePanel,
  addCodeAnnotation,
  addCodeWalkthrough,
  addCodeGuide,
};
