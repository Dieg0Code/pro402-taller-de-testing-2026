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
};
