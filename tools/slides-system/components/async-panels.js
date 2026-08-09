const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");
const { makeCodeSvgData } = require("../utils/code");

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

function addZoneHeader(slide, SH, x, y, w, text, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h: opts.h || 0.28,
    rectRadius: 0.03,
    fill: { color: opts.fill || TOKENS.titleFill },
    line: { color: opts.fill || TOKENS.titleFill },
  });
  slide.addText(text, {
    x: x + 0.1,
    y: y + 0.06,
    w: w - 0.2,
    h: (opts.h || 0.28) - 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.fontSize || 9.2,
    bold: true,
    color: opts.color || TOKENS.white,
    margin: 0,
    align: "center",
  });
}

// ─── addEventLoopDiagram ───────────────────────────────────────────────────────
//
// Visualizes the JavaScript event loop as three labeled zones:
//   Call Stack (left), Web APIs (center), Task Queue (right)
// plus a bottom arrow indicating the loop back from queue to stack.
//
function addEventLoopDiagram(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const stackFrames = opts.stackFrames || ["(empty)"];
  const apiItems = opts.apiItems || [];
  const queueItems = opts.queueItems || [];
  const highlight = opts.highlightPhase || null;
  const captionH = opts.caption ? 0.24 : 0;

  // Outer container
  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: TOKENS.border,
  });

  // Layout constants
  const innerX = x + 0.18;
  const innerW = w - 0.36;
  const zonesY = y + 0.18;
  const arrowBeltH = 0.34;
  const zonesH = h - 0.36 - arrowBeltH - captionH;
  const zoneGap = 0.16;
  const stackW = Math.round(innerW * 0.3 * 100) / 100;
  const apiW = Math.round((innerW - 2 * zoneGap) * 0.38 * 100) / 100;
  const queueW = innerW - stackW - apiW - 2 * zoneGap;
  const stackX = innerX;
  const apiX = innerX + stackW + zoneGap;
  const queueX = apiX + apiW + zoneGap;
  const arrowY = zonesY + zonesH + 0.1;

  // Highlight helper
  function zoneFill(zone) {
    if (highlight === zone) return "103560";
    return TOKENS.editorBg;
  }
  function zoneLine(zone) {
    if (highlight === zone) return TOKENS.red;
    return "1E3A5C";
  }

  // ── Call Stack zone ──
  slide.addShape(SH.roundRect, {
    x: stackX,
    y: zonesY,
    w: stackW,
    h: zonesH,
    rectRadius: 0.04,
    fill: { color: zoneFill("stack") },
    line: { color: zoneLine("stack"), pt: highlight === "stack" ? 1.8 : 1 },
  });
  addZoneHeader(slide, SH, stackX + 0.08, zonesY + 0.08, stackW - 0.16, "Call Stack", {
    fill: highlight === "stack" ? TOKENS.red : TOKENS.titleFill,
    h: 0.26,
    fontSize: 8.8,
  });

  const frameH = 0.28;
  const frameGap = 0.06;
  const framesAreaY = zonesY + 0.44;
  const visibleFrames = Math.min(
    stackFrames.length,
    Math.max(1, Math.floor((zonesH - 0.54) / (frameH + frameGap)))
  );
  for (let i = 0; i < visibleFrames; i++) {
    const frameIndex = stackFrames.length - 1 - i;
    const frameY = framesAreaY + i * (frameH + frameGap);
    const frameFill = frameIndex === stackFrames.length - 1 && highlight === "stack"
      ? TOKENS.red
      : "1E3A5C";
    slide.addShape(SH.roundRect, {
      x: stackX + 0.1,
      y: frameY,
      w: stackW - 0.2,
      h: frameH,
      rectRadius: 0.03,
      fill: { color: frameFill },
      line: { color: frameFill },
    });
    slide.addText(stackFrames[frameIndex] || "", {
      x: stackX + 0.14,
      y: frameY + 0.06,
      w: stackW - 0.28,
      h: frameH - 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.4,
      color: TOKENS.white,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
  }

  // ── Web APIs zone ──
  slide.addShape(SH.roundRect, {
    x: apiX,
    y: zonesY,
    w: apiW,
    h: zonesH,
    rectRadius: 0.04,
    fill: { color: zoneFill("apis") },
    line: { color: zoneLine("apis"), pt: highlight === "apis" ? 1.8 : 1 },
  });
  addZoneHeader(slide, SH, apiX + 0.08, zonesY + 0.08, apiW - 0.16, "Web APIs", {
    fill: highlight === "apis" ? TOKENS.red : TOKENS.titleFill,
    h: 0.26,
    fontSize: 8.8,
  });

  const apiItemH = 0.28;
  const apiItemGap = 0.08;
  const apiAreaY = zonesY + 0.44;
  const visibleApis = Math.min(
    apiItems.length,
    Math.max(0, Math.floor((zonesH - 0.54) / (apiItemH + apiItemGap)))
  );
  for (let i = 0; i < visibleApis; i++) {
    const itemY = apiAreaY + i * (apiItemH + apiItemGap);
    const itemFill = highlight === "apis" ? "1E4A70" : "1E3A5C";
    slide.addShape(SH.roundRect, {
      x: apiX + 0.12,
      y: itemY,
      w: apiW - 0.24,
      h: apiItemH,
      rectRadius: 0.03,
      fill: { color: itemFill },
      line: { color: itemFill },
    });
    slide.addShape(SH.ellipse, {
      x: apiX + 0.16,
      y: itemY + apiItemH / 2 - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: TOKENS.gold },
      line: { color: TOKENS.gold },
    });
    slide.addText(apiItems[i] || "", {
      x: apiX + 0.34,
      y: itemY + 0.06,
      w: apiW - 0.5,
      h: apiItemH - 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.2,
      color: TOKENS.white,
      margin: 0,
      fit: "shrink",
    });
  }
  if (apiItems.length === 0) {
    slide.addText("(sin tareas activas)", {
      x: apiX + 0.12,
      y: zonesY + 0.46,
      w: apiW - 0.24,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.2,
      color: TOKENS.guide,
      margin: 0,
      align: "center",
    });
  }

  // ── Task Queue zone ──
  slide.addShape(SH.roundRect, {
    x: queueX,
    y: zonesY,
    w: queueW,
    h: zonesH,
    rectRadius: 0.04,
    fill: { color: zoneFill("queue") },
    line: { color: zoneLine("queue"), pt: highlight === "queue" ? 1.8 : 1 },
  });
  addZoneHeader(slide, SH, queueX + 0.08, zonesY + 0.08, queueW - 0.16, "Task Queue", {
    fill: highlight === "queue" ? TOKENS.red : TOKENS.titleFill,
    h: 0.26,
    fontSize: 8.8,
  });

  const qItemH = 0.28;
  const qItemGap = 0.06;
  const qAreaY = zonesY + 0.44;
  const visibleQueue = Math.min(
    queueItems.length,
    Math.max(0, Math.floor((zonesH - 0.54) / (qItemH + qItemGap)))
  );
  for (let i = 0; i < visibleQueue; i++) {
    const itemY = qAreaY + i * (qItemH + qItemGap);
    const itemFill = i === 0 && highlight === "queue" ? TOKENS.red : "1E3A5C";
    slide.addShape(SH.roundRect, {
      x: queueX + 0.1,
      y: itemY,
      w: queueW - 0.2,
      h: qItemH,
      rectRadius: 0.03,
      fill: { color: itemFill },
      line: { color: itemFill },
    });
    slide.addText(queueItems[i] || "", {
      x: queueX + 0.14,
      y: itemY + 0.06,
      w: queueW - 0.28,
      h: qItemH - 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.2,
      color: TOKENS.white,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
  }
  if (queueItems.length === 0) {
    slide.addText("(cola vacia)", {
      x: queueX + 0.1,
      y: zonesY + 0.46,
      w: queueW - 0.2,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.2,
      color: TOKENS.guide,
      margin: 0,
      align: "center",
    });
  }

  // ── Arrows between zones ──
  // Web APIs → Task Queue (top arrow)
  const arrowMidY = zonesY + zonesH * 0.5;
  slide.addShape(SH.line, {
    x: apiX + apiW,
    y: arrowMidY,
    w: zoneGap,
    h: 0,
    line: { color: TOKENS.gold, pt: 1.4 },
  });
  slide.addShape(SH.chevron, {
    x: apiX + apiW + zoneGap * 0.55,
    y: arrowMidY - 0.1,
    w: 0.16,
    h: 0.2,
    fill: { color: TOKENS.gold },
    line: { color: TOKENS.gold },
  });

  // ── Event Loop bottom arrow (queue → stack) ──
  const loopColor = highlight === "loop" ? TOKENS.red : TOKENS.guide;
  const loopPt = highlight === "loop" ? 2 : 1.4;

  // Descend from queue bottom
  slide.addShape(SH.line, {
    x: queueX + queueW * 0.5,
    y: zonesY + zonesH,
    w: 0,
    h: arrowBeltH * 0.5,
    line: { color: loopColor, pt: loopPt },
  });
  // Horizontal run from queue to stack at bottom
  slide.addShape(SH.line, {
    x: stackX + stackW * 0.5,
    y: arrowY + arrowBeltH * 0.5,
    w: queueX + queueW * 0.5 - (stackX + stackW * 0.5),
    h: 0,
    line: { color: loopColor, pt: loopPt },
  });
  // Ascend to stack bottom
  slide.addShape(SH.line, {
    x: stackX + stackW * 0.5,
    y: zonesY + zonesH,
    w: 0,
    h: arrowBeltH * 0.5,
    line: { color: loopColor, pt: loopPt },
  });
  // Arrowhead pointing up into stack
  slide.addShape(SH.chevron, {
    x: stackX + stackW * 0.5 - 0.1,
    y: zonesY + zonesH - 0.22,
    w: 0.2,
    h: 0.24,
    rotate: 270,
    fill: { color: loopColor },
    line: { color: loopColor },
  });

  // Loop label
  slide.addText("Event Loop", {
    x: innerX + innerW * 0.3,
    y: arrowY + 0.04,
    w: innerW * 0.4,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.2,
    bold: true,
    color: loopColor,
    margin: 0,
    align: "center",
  });

  // ── Caption ──
  if (opts.caption) {
    slide.addText(opts.caption, {
      x: x + 0.2,
      y: y + h - captionH + 0.04,
      w: w - 0.4,
      h: captionH - 0.06,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

// ─── addSyntaxCompare ─────────────────────────────────────────────────────────
//
// Side-by-side code comparison: "Antes" (old syntax) vs "ES6+" (modern syntax).
// Each panel has a colored header and syntax-highlighted code rendered as SVG.
//
function addSyntaxCompare(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const beforeLabel = opts.beforeLabel || "Antes";
  const afterLabel = opts.afterLabel || "ES6+";
  const beforeCode = opts.beforeCode || "";
  const afterCode = opts.afterCode || "";
  const lang = opts.language || "js";
  const captionH = opts.caption ? 0.24 : 0;
  const dividerW = 0.06;
  const panelGap = dividerW + 0.1;
  const panelW = (w - 0.36 - panelGap) / 2;
  const leftX = x + 0.18;
  const rightX = leftX + panelW + panelGap;
  const headerH = 0.32;
  const panelH = h - 0.18 - captionH;

  // ── Left panel — "Antes" ──
  slide.addShape(SH.roundRect, {
    x: leftX,
    y,
    w: panelW,
    h: panelH,
    rectRadius: 0.04,
    fill: { color: TOKENS.editorBg },
    line: { color: "2A3A4E", pt: 1 },
  });
  // Header (muted gray)
  slide.addShape(SH.roundRect, {
    x: leftX + 0.1,
    y: y + 0.1,
    w: panelW - 0.2,
    h: headerH,
    rectRadius: 0.03,
    fill: { color: "3A4A5E" },
    line: { color: "3A4A5E" },
  });
  slide.addText(beforeLabel, {
    x: leftX + 0.12,
    y: y + 0.16,
    w: panelW - 0.24,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.8,
    bold: true,
    color: TOKENS.guide,
    margin: 0,
    align: "center",
  });

  // Code area (left)
  const codeAreaH = Math.max(0.3, panelH - headerH - 0.28);
  const codeY = y + headerH + 0.2;
  slide.addImage({
    data: makeCodeSvgData(beforeCode, lang, {
      width: panelW - 0.2,
      height: codeAreaH,
      fontSize: opts.fontSize || 10.2,
    }),
    x: leftX + 0.1,
    y: codeY,
    w: panelW - 0.2,
    h: codeAreaH,
  });

  // ── Divider ──
  const dividerX = leftX + panelW + (panelGap - dividerW) / 2;
  slide.addShape(SH.rect, {
    x: dividerX,
    y: y + 0.14,
    w: dividerW,
    h: panelH - 0.28,
    fill: { color: TOKENS.border },
    line: { color: TOKENS.border },
  });

  // ── Right panel — "ES6+" ──
  slide.addShape(SH.roundRect, {
    x: rightX,
    y,
    w: panelW,
    h: panelH,
    rectRadius: 0.04,
    fill: { color: TOKENS.editorBg },
    line: { color: "1C3A2E", pt: 1 },
  });
  // Header (green/teal accent)
  slide.addShape(SH.roundRect, {
    x: rightX + 0.1,
    y: y + 0.1,
    w: panelW - 0.2,
    h: headerH,
    rectRadius: 0.03,
    fill: { color: "1A4230" },
    line: { color: "1A4230" },
  });
  slide.addText(afterLabel, {
    x: rightX + 0.12,
    y: y + 0.16,
    w: panelW - 0.24,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.8,
    bold: true,
    color: TOKENS.success,
    margin: 0,
    align: "center",
  });

  // Code area (right)
  slide.addImage({
    data: makeCodeSvgData(afterCode, lang, {
      width: panelW - 0.2,
      height: codeAreaH,
      fontSize: opts.fontSize || 10.2,
    }),
    x: rightX + 0.1,
    y: codeY,
    w: panelW - 0.2,
    h: codeAreaH,
  });

  // ── Caption ──
  if (opts.caption) {
    slide.addText(opts.caption, {
      x: x + 0.2,
      y: y + h - captionH + 0.04,
      w: w - 0.4,
      h: captionH - 0.06,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

module.exports = {
  addEventLoopDiagram,
  addSyntaxCompare,
};
