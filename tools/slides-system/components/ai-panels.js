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

function asSvgColor(color = TOKENS.navy) {
  const value = String(color).trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function addSurface(slide, SH, x, y, w, h, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.05,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: opts.linePt || 1 },
  });
}

function addAccentBar(slide, SH, x, y, h, color = TOKENS.red) {
  slide.addShape(SH.rect, {
    x,
    y,
    w: 0.12,
    h,
    fill: { color },
    line: { color },
  });
}

function addPanelTitle(slide, x, y, w, title, subtitle, opts = {}) {
  slide.addText(title || "", {
    x,
    y,
    w,
    h: opts.titleH || 0.32,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 15,
    bold: true,
    color: opts.titleColor || TOKENS.navy,
    margin: 0,
    fit: "shrink",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x,
      y: y + (opts.subtitleY || 0.35),
      w,
      h: opts.subtitleH || 0.28,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.subtitleFontSize || 9.5,
      color: opts.subtitleColor || TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
  }
}

function addArrow(slide, SH, x, y, w, opts = {}) {
  if (w <= 0.02) return;
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: {
      color: opts.color || TOKENS.guide,
      pt: opts.pt || 1.2,
      beginArrowType: "none",
      endArrowType: opts.endArrowType || "triangle",
      dash: opts.dash,
    },
  });
}

function addSafeConnector(slide, SH, startX, startY, endX, endY, opts = {}) {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length <= 0.02) return;
  const thickness = opts.thickness || 0.015;
  const midX = startX + dx / 2;
  const midY = startY + dy / 2;
  slide.addShape(SH.rect, {
    x: midX - length / 2,
    y: midY - thickness / 2,
    w: length,
    h: thickness,
    rotate: Math.atan2(dy, dx) * (180 / Math.PI),
    fill: { color: opts.color || TOKENS.guide },
    line: { color: opts.color || TOKENS.guide, transparency: 100 },
  });
  slide.addShape(SH.triangle, {
    x: endX - 0.055,
    y: endY - 0.055,
    w: 0.11,
    h: 0.11,
    rotate: Math.atan2(dy, dx) * (180 / Math.PI) + 90,
    fill: { color: opts.color || TOKENS.guide },
    line: { color: opts.color || TOKENS.guide, transparency: 100 },
  });
}

function addTokenFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const steps = opts.steps || [
    { label: "texto", value: opts.text || "validar contrasena antes de guardar", fill: TOKENS.white, accent: TOKENS.navy },
    { label: "tokens", value: opts.tokens || ["validar", "contrasena", "antes", "de", "guardar"], fill: TOKENS.softBlue, accent: TOKENS.titleFill },
    { label: "ids", value: opts.ids || ["1842", "9271", "315", "19", "5020"], fill: TOKENS.warm, accent: TOKENS.gold },
    { label: "vectores", value: opts.vectors || ["e1", "e2", "e3", "e4", "e5"], fill: TOKENS.paleRed, accent: TOKENS.red },
  ];
  const gap = opts.gap || 0.16;
  const titleH = opts.title ? 0.48 : 0.12;
  const innerX = x + 0.28;
  const innerY = y + titleH + 0.2;
  const innerW = w - 0.56;
  const cardW = (innerW - gap * (steps.length - 1)) / steps.length;
  const cardH = h - titleH - 0.42;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  steps.forEach((step, index) => {
    const cardX = innerX + index * (cardW + gap);
    addSurface(slide, SH, cardX, innerY, cardW, cardH, {
      fill: step.fill || TOKENS.white,
      line: step.fill || TOKENS.border,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.12,
      y: innerY + 0.14,
      w: 0.1,
      h: cardH - 0.28,
      fill: { color: step.accent || TOKENS.red },
      line: { color: step.accent || TOKENS.red },
    });
    slide.addText(step.label || "", {
      x: cardX + 0.32,
      y: innerY + 0.18,
      w: cardW - 0.44,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.labelFontSize || 11.4,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });

    const isListValue = Array.isArray(step.value);
    const values = isListValue ? step.value : [step.value];
    const chipGap = 0.08;
    const maxRows = Math.min(values.length, 5);
    const chipH = isListValue
      ? Math.min(0.28, (cardH - 0.66 - chipGap * (maxRows - 1)) / maxRows)
      : Math.min(0.78, cardH - 0.82);
    values.slice(0, 5).forEach((value, valueIndex) => {
      const chipY = isListValue ? innerY + 0.52 + valueIndex * (chipH + chipGap) : innerY + 0.76;
      slide.addShape(SH.roundRect, {
        x: cardX + 0.32,
        y: chipY,
        w: cardW - 0.46,
        h: chipH,
        rectRadius: 0.04,
        fill: { color: opts.chipFill || TOKENS.white },
        line: { color: opts.chipLine || TOKENS.border, pt: 0.8 },
      });
      slide.addText(String(value), {
        x: cardX + 0.42,
        y: chipY + (isListValue ? Math.max(0.045, chipH * 0.26) : 0.15),
        w: cardW - 0.66,
        h: Math.max(0.1, chipH - 0.18),
        fontFace: isListValue ? TYPOGRAPHY.mono || "Aptos Mono" : TYPOGRAPHY.body,
        fontSize: opts.valueFontSize || (isListValue ? 8.4 : 8.8),
        bold: isListValue,
        color: TOKENS.ink,
        align: "center",
        margin: 0,
        fit: "shrink",
      });
    });

    if (index < steps.length - 1) {
      slide.addShape(SH.chevron, {
        x: cardX + cardW + gap / 2 - 0.045,
        y: innerY + cardH / 2 - 0.13,
        w: 0.09,
        h: 0.26,
        fill: { color: opts.arrowColor || TOKENS.gold },
        line: { color: opts.arrowColor || TOKENS.gold },
      });
    }
  });
}

function addEmbeddingVector(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const values = opts.values || [0.12, 0.86, 0.76, -0.31, 0.44, -0.08];
  const token = opts.token || "contrasena";
  const cellGap = opts.cellGap || 0.08;
  const titleH = opts.title ? 0.72 : 0.18;
  const vectorY = y + titleH + 0.54;
  const maxCells = Math.min(values.length, opts.maxCells || 8);
  const cellW = (w - 0.78 - cellGap * (maxCells - 1)) / maxCells;
  const cellH = Math.min(0.58, h - titleH - 1.06);

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  slide.addShape(SH.roundRect, {
    x: x + 0.34,
    y: y + titleH + 0.1,
    w: Math.min(1.72, w - 0.68),
    h: 0.3,
    rectRadius: 0.05,
    fill: { color: opts.tokenFill || TOKENS.paleRed },
    line: { color: opts.tokenFill || TOKENS.paleRed },
  });
  slide.addText(token, {
    x: x + 0.44,
    y: y + titleH + 0.17,
    w: Math.min(1.52, w - 0.88),
    h: 0.12,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: opts.tokenFontSize || 9.5,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addText("E[token_id] = vector", {
    x: x + 2.1,
    y: y + titleH + 0.16,
    w: Math.max(1.2, w - 2.46),
    h: 0.16,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: opts.formulaFontSize || 10.3,
    bold: true,
    color: TOKENS.slate,
    margin: 0,
    fit: "shrink",
  });

  values.slice(0, maxCells).forEach((value, index) => {
    const cellX = x + 0.34 + index * (cellW + cellGap);
    const fill = Number(value) < 0 ? TOKENS.softBlue : TOKENS.warm;
    slide.addShape(SH.roundRect, {
      x: cellX,
      y: vectorY,
      w: cellW,
      h: cellH,
      rectRadius: 0.04,
      fill: { color: fill },
      line: { color: fill },
    });
    slide.addText(String(value), {
      x: cellX + 0.04,
      y: vectorY + cellH / 2 - 0.07,
      w: cellW - 0.08,
      h: 0.14,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: opts.valueFontSize || 8.4,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });

  if (opts.note) {
    slide.addText(opts.note, {
      x: x + 0.34,
      y: y + h - 0.38,
      w: w - 0.68,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.noteFontSize || 8.8,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
  }
}

function addEmbeddingSpace(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const points = opts.points || [
    { label: "login", px: 0.68, py: 0.32, fill: TOKENS.softBlue, accent: TOKENS.navy },
    { label: "contrasena", px: 0.75, py: 0.42, fill: TOKENS.softBlue, accent: TOKENS.navy },
    { label: "auth", px: 0.61, py: 0.48, fill: TOKENS.softBlue, accent: TOKENS.navy },
    { label: "SQL", px: 0.32, py: 0.66, fill: TOKENS.warm, accent: TOKENS.gold },
    { label: "JOIN", px: 0.24, py: 0.76, fill: TOKENS.warm, accent: TOKENS.gold },
    { label: "veterinaria", px: 0.16, py: 0.24, fill: TOKENS.paleRed, accent: TOKENS.red },
  ];
  const plotX = x + 0.44;
  const plotY = y + (opts.title ? 0.76 : 0.34);
  const plotW = w - 0.88;
  const plotH = h - (opts.title ? 1.04 : 0.62);

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }
  slide.addShape(SH.roundRect, {
    x: plotX,
    y: plotY,
    w: plotW,
    h: plotH,
    rectRadius: 0.04,
    fill: { color: opts.plotFill || TOKENS.mist },
    line: { color: opts.plotLine || TOKENS.border, pt: 1 },
  });
  slide.addShape(SH.line, { x: plotX + 0.18, y: plotY + plotH - 0.22, w: plotW - 0.36, h: 0, line: { color: TOKENS.guide, pt: 0.8, endArrowType: "triangle" } });
  slide.addShape(SH.line, {
    x: plotX + 0.18,
    y: plotY + 0.22,
    w: 0,
    h: plotH - 0.44,
    line: { color: TOKENS.guide, pt: 0.8, beginArrowType: "triangle", endArrowType: "none" },
  });

  points.forEach((point) => {
    const px = plotX + 0.26 + point.px * (plotW - 0.52);
    const py = plotY + 0.24 + point.py * (plotH - 0.48);
    slide.addShape(SH.ellipse, {
      x: px - 0.08,
      y: py - 0.08,
      w: 0.16,
      h: 0.16,
      fill: { color: point.fill || TOKENS.softBlue },
      line: { color: point.accent || TOKENS.navy, pt: 1 },
    });
    slide.addText(point.label || "", {
      x: px + 0.1,
      y: py - 0.07,
      w: point.w || 0.92,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.labelFontSize || 7.8,
      bold: true,
      color: point.accent || TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
  });
}

function addAttentionMap(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const tokens = opts.tokens || ["La", "contrasena", "era", "debil", "y", "la", "rechazo"];
  const focusIndex = opts.focusIndex ?? 5;
  const links = opts.links || [
    { from: 1, to: 5, weight: "0.62", color: TOKENS.red, pt: 2.2 },
    { from: 3, to: 5, weight: "0.18", color: TOKENS.gold, pt: 1.5 },
    { from: 6, to: 5, weight: "0.12", color: TOKENS.titleFill, pt: 1.2 },
  ];
  const titleH = opts.title ? 0.54 : 0.16;
  const tokenY = y + h - 0.62;
  const tokenGap = 0.09;
  const tokenW = (w - 0.6 - tokenGap * (tokens.length - 1)) / tokens.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  const centers = tokens.map((token, index) => {
    const tokenX = x + 0.3 + index * (tokenW + tokenGap);
    return { x: tokenX + tokenW / 2, y: tokenY + 0.18, tokenX };
  });

  links.forEach((link, index) => {
    const from = centers[link.from];
    const to = centers[link.to];
    if (!from || !to) return;
    const arcY = y + titleH + 0.28 + index * 0.24;
    addSafeConnector(slide, SH, from.x, tokenY - 0.04, (from.x + to.x) / 2, arcY, { color: link.color || TOKENS.guide, thickness: 0.012 });
    addSafeConnector(slide, SH, (from.x + to.x) / 2, arcY, to.x, tokenY - 0.04, { color: link.color || TOKENS.guide, thickness: 0.012 });
    slide.addText(link.weight || "", {
      x: (from.x + to.x) / 2 - 0.18,
      y: arcY - 0.13,
      w: 0.36,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: opts.weightFontSize || 7.4,
      bold: true,
      color: link.color || TOKENS.slate,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });

  tokens.forEach((token, index) => {
    const tokenX = centers[index].tokenX;
    const active = index === focusIndex;
    slide.addShape(SH.roundRect, {
      x: tokenX,
      y: tokenY,
      w: tokenW,
      h: 0.36,
      rectRadius: 0.04,
      fill: { color: active ? TOKENS.navy : TOKENS.softBlue },
      line: { color: active ? TOKENS.navy : TOKENS.softBlue },
    });
    slide.addText(token, {
      x: tokenX + 0.04,
      y: tokenY + 0.1,
      w: tokenW - 0.08,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.tokenFontSize || 7.8,
      bold: true,
      color: active ? TOKENS.white : TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });
}

function addQKVPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    { key: "Q", title: "Query", body: "lo que el token busca en el contexto", fill: TOKENS.softBlue, accent: TOKENS.navy },
    { key: "K", title: "Key", body: "lo que cada token ofrece para ser encontrado", fill: TOKENS.warm, accent: TOKENS.gold },
    { key: "V", title: "Value", body: "la informacion que se mezcla si resulta relevante", fill: TOKENS.paleRed, accent: TOKENS.red },
  ];
  const titleH = opts.title ? 0.56 : 0.18;
  const gap = 0.18;
  const cardY = y + titleH + 0.18;
  const cardH = h - titleH - 0.42;
  const cardW = (w - 0.48 - gap * (items.length - 1)) / items.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  items.forEach((item, index) => {
    const cardX = x + 0.24 + index * (cardW + gap);
    addSurface(slide, SH, cardX, cardY, cardW, cardH, { fill: item.fill || TOKENS.white, line: item.fill || TOKENS.border });
    slide.addShape(SH.ellipse, {
      x: cardX + 0.16,
      y: cardY + 0.18,
      w: 0.46,
      h: 0.46,
      fill: { color: item.accent || TOKENS.navy },
      line: { color: item.accent || TOKENS.navy },
    });
    slide.addText(item.key || "", {
      x: cardX + 0.16,
      y: cardY + 0.31,
      w: 0.46,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12,
      bold: true,
      color: TOKENS.white,
      align: "center",
      margin: 0,
    });
    slide.addText(item.title || "", {
      x: cardX + 0.72,
      y: cardY + 0.22,
      w: cardW - 0.88,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.itemTitleFontSize || 13,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.body || "", {
      x: cardX + 0.22,
      y: cardY + 0.82,
      w: cardW - 0.44,
      h: cardH - 1.02,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.bodyFontSize || 9.2,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });
  });
}

function addAgentArchitecture(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const center = { x: x + w / 2, y: y + h / 2 + 0.06 };
  const nodes = opts.nodes || [
    { title: "instrucciones", body: "rol y limites", px: 0.08, py: 0.18, accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "contexto", body: "docs, logs, codigo", px: 0.08, py: 0.64, accent: TOKENS.navy, fill: TOKENS.softBlue },
    { title: "herramientas", body: "leer, buscar, probar", px: 0.68, py: 0.18, accent: TOKENS.gold, fill: TOKENS.warm },
    { title: "memoria", body: "estado y reglas", px: 0.7, py: 0.64, accent: TOKENS.titleFill, fill: TOKENS.mist },
    { title: "permisos", body: "minimo privilegio", px: 0.38, py: 0.08, accent: TOKENS.slate, fill: TOKENS.softNeutral },
    { title: "validacion", body: "pruebas y evidencia", px: 0.38, py: 0.78, accent: TOKENS.success, fill: TOKENS.successSoft },
  ];
  const nodeW = opts.nodeW || Math.min(1.86, w * 0.28);
  const nodeH = opts.nodeH || 0.76;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }
  const modelW = opts.modelW || 1.62;
  const modelH = opts.modelH || 0.72;

  nodes.forEach((node) => {
    const nodeX = x + node.px * w;
    const nodeY = y + node.py * h;
    addSafeConnector(slide, SH, nodeX + nodeW / 2, nodeY + nodeH / 2, center.x, center.y, { color: node.accent || TOKENS.guide, thickness: 0.012 });
    addSurface(slide, SH, nodeX, nodeY, nodeW, nodeH, { fill: node.fill || TOKENS.white, line: node.fill || TOKENS.border });
    addAccentBar(slide, SH, nodeX + 0.1, nodeY + 0.12, nodeH - 0.24, node.accent || TOKENS.red);
    slide.addText(node.title || "", {
      x: nodeX + 0.28,
      y: nodeY + 0.14,
      w: nodeW - 0.38,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.nodeTitleFontSize || 9.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(node.body || "", {
      x: nodeX + 0.28,
      y: nodeY + 0.42,
      w: nodeW - 0.38,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.nodeBodyFontSize || 7.6,
      color: TOKENS.ink,
      margin: 0,
      fit: "shrink",
    });
  });

  slide.addShape(SH.roundRect, {
    x: center.x - modelW / 2,
    y: center.y - modelH / 2,
    w: modelW,
    h: modelH,
    rectRadius: 0.07,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText(opts.modelLabel || "LLM", {
    x: center.x - modelW / 2,
    y: center.y - 0.13,
    w: modelW,
    h: 0.18,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.modelFontSize || 17,
    bold: true,
    color: TOKENS.white,
    align: "center",
    margin: 0,
  });
}

function addToolRiskCard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const sections = opts.sections || [
    { title: "valor", body: opts.value || "observa el sistema real", fill: TOKENS.successSoft, accent: TOKENS.success },
    { title: "riesgo", body: opts.risk || "puede actuar fuera de limites", fill: TOKENS.paleRed, accent: TOKENS.red },
    { title: "control", body: opts.control || "permisos y confirmacion", fill: TOKENS.softBlue, accent: TOKENS.navy },
  ];
  const titleH = opts.title ? 0.48 : 0.16;
  const gap = 0.12;
  const cardY = y + titleH + 0.18;
  const cardH = h - titleH - 0.38;
  const cardW = (w - 0.36 - gap * (sections.length - 1)) / sections.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.22, y + 0.12, w - 0.44, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 12.5,
      subtitleFontSize: opts.subtitleFontSize || 8.2,
    });
  }
  sections.forEach((section, index) => {
    const cardX = x + 0.18 + index * (cardW + gap);
    addSurface(slide, SH, cardX, cardY, cardW, cardH, { fill: section.fill || TOKENS.white, line: section.fill || TOKENS.border });
    slide.addText(section.title || "", {
      x: cardX + 0.12,
      y: cardY + 0.12,
      w: cardW - 0.24,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.sectionTitleFontSize || 7.8,
      bold: true,
      color: section.accent || TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(section.body || "", {
      x: cardX + 0.14,
      y: cardY + 0.42,
      w: cardW - 0.28,
      h: cardH - 0.52,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.bodyFontSize || 8.4,
      bold: true,
      color: TOKENS.ink,
      align: "center",
      valign: "mid",
      margin: 0,
      fit: "shrink",
    });
  });
}

function addEvaluationRubric(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const rows = opts.rows || [
    { criterion: "exactitud", c0: "error grave", c1: "parcial", c2: "correcta" },
    { criterion: "evidencia", c0: "sin fuente", c1: "debil", c2: "verificable" },
    { criterion: "seguridad", c0: "expone riesgo", c1: "advierte", c2: "protege" },
    { criterion: "limites", c0: "inventa", c1: "duda", c2: "reconoce" },
  ];
  const titleH = opts.title ? 0.56 : 0.18;
  const tableX = x + 0.26;
  const tableY = y + titleH + 0.18;
  const tableW = w - 0.52;
  const tableH = h - titleH - 0.42;
  const headerH = 0.34;
  const critW = tableW * 0.26;
  const colW = (tableW - critW) / 3;
  const rowH = (tableH - headerH) / rows.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.5,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  const headers = ["criterio", "0", "1", "2"];
  const widths = [critW, colW, colW, colW];
  let cursorX = tableX;
  headers.forEach((header, index) => {
    slide.addShape(SH.roundRect, {
      x: cursorX,
      y: tableY,
      w: widths[index] - 0.02,
      h: headerH,
      rectRadius: 0.03,
      fill: { color: index === 0 ? TOKENS.navy : TOKENS.titleFill },
      line: { color: index === 0 ? TOKENS.navy : TOKENS.titleFill },
    });
    slide.addText(header, {
      x: cursorX + 0.04,
      y: tableY + 0.1,
      w: widths[index] - 0.08,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.headerFontSize || 8.6,
      bold: true,
      color: TOKENS.white,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    cursorX += widths[index];
  });

  rows.forEach((row, rowIndex) => {
    const rowY = tableY + headerH + rowIndex * rowH;
    const cells = [row.criterion, row.c0, row.c1, row.c2];
    cursorX = tableX;
    cells.forEach((cell, colIndex) => {
      const fill = colIndex === 0 ? TOKENS.mist : rowIndex % 2 === 0 ? TOKENS.white : TOKENS.softNeutral;
      slide.addShape(SH.rect, {
        x: cursorX,
        y: rowY,
        w: widths[colIndex] - 0.02,
        h: rowH - 0.02,
        fill: { color: fill },
        line: { color: TOKENS.border, pt: 0.5 },
      });
      slide.addText(cell || "", {
        x: cursorX + 0.06,
        y: rowY + Math.max(0.05, rowH / 2 - 0.07),
        w: widths[colIndex] - 0.12,
        h: 0.14,
        fontFace: colIndex === 0 ? TYPOGRAPHY.display : TYPOGRAPHY.body,
        fontSize: opts.cellFontSize || 7.8,
        bold: colIndex === 0,
        color: colIndex === 0 ? TOKENS.navy : TOKENS.ink,
        align: "center",
        margin: 0,
        fit: "shrink",
      });
      cursorX += widths[colIndex];
    });
  });
}

function addFormulaPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const variant = opts.variant || "standard";
  const accent = opts.accent || TOKENS.red;
  const compact = variant === "compact";
  const hero = variant === "hero";
  const chips = opts.chips || [];
  const hasChips = chips.length > 0 && !compact;
  const pad = compact ? 0.34 : 0.28;
  const formulaH = hero ? 0.78 : compact ? 0.38 : hasChips ? 0.42 : 0.62;
  const formulaY = y + (hero ? 0.7 : compact ? 0.5 : 0.58);

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addAccentBar(slide, SH, x + 0.12, y + 0.16, h - 0.32, accent);
  addPanelTitle(slide, x + 0.32, y + 0.14, w - 0.48, opts.title || "Formula", opts.subtitle, {
    titleFontSize: compact ? 11.5 : 14.5,
    subtitleFontSize: compact ? 8.5 : 9.5,
    titleColor: opts.titleColor || TOKENS.navy,
    subtitleColor: opts.subtitleColor || TOKENS.slate,
  });

  slide.addShape(SH.roundRect, {
    x: x + pad,
    y: formulaY,
    w: w - pad * 2,
    h: formulaH,
    rectRadius: 0.04,
    fill: { color: opts.formulaFill || TOKENS.mist },
    line: { color: opts.formulaLine || TOKENS.mist },
  });
  slide.addText(opts.formula || "z = w1*x1 + w2*x2 + b", {
    x: x + pad + 0.14,
    y: formulaY + (hero ? 0.2 : compact ? 0.11 : 0.15),
    w: w - pad * 2 - 0.28,
    h: formulaH - 0.16,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: opts.formulaFontSize || (hero ? 24 : compact ? 13 : 18),
    bold: true,
    color: opts.formulaColor || TOKENS.navy,
    margin: 0,
    align: "center",
    fit: "shrink",
  });

  const chipY = y + h - 0.38;
  const readingY = formulaY + formulaH + 0.08;
  const readingH = hasChips
    ? Math.max(0.14, chipY - readingY - 0.08)
    : Math.max(0.14, h - (readingY - y) - 0.14);

  if (opts.reading) {
    slide.addText(opts.reading, {
      x: x + pad,
      y: readingY,
      w: w - pad * 2,
      h: Math.min(0.42, readingH),
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.readingFontSize || (compact ? 8.8 : 10.8),
      color: opts.readingColor || TOKENS.ink,
      align: "center",
      valign: "mid",
      margin: 0,
      fit: "shrink",
    });
  }

  if (hasChips) {
    const chipGap = 0.1;
    const chipW = (w - pad * 2 - chipGap * (chips.length - 1)) / chips.length;
    chips.forEach((chip, index) => {
      const chipX = x + pad + index * (chipW + chipGap);
      slide.addShape(SH.roundRect, {
        x: chipX,
        y: chipY,
        w: chipW,
        h: 0.24,
        rectRadius: 0.04,
        fill: { color: chip.fill || TOKENS.softBlue },
        line: { color: chip.fill || TOKENS.softBlue },
      });
      slide.addText(chip.label || "", {
        x: chipX + 0.08,
        y: chipY + 0.055,
        w: chipW - 0.16,
        h: 0.12,
        fontFace: TYPOGRAPHY.body,
        fontSize: opts.chipFontSize || 7.8,
        bold: true,
        color: chip.color || TOKENS.navy,
        align: "center",
        margin: 0,
        fit: "shrink",
      });
    });
  }
}

function addSymbolLegend(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    { symbol: "x", label: "entrada" },
    { symbol: "w", label: "peso" },
    { symbol: "b", label: "sesgo" },
    { symbol: "z", label: "suma" },
    { symbol: "y", label: "respuesta" },
    { symbol: "ŷ", label: "prediccion" },
    { symbol: "L", label: "perdida" },
  ];
  const cols = opts.cols || Math.min(4, items.length);
  const rows = Math.ceil(items.length / cols);
  const gap = opts.gap || 0.12;
  const titleH = opts.title ? 0.38 : 0;
  const itemW = (w - gap * (cols - 1)) / cols;
  const itemH = (h - titleH - 0.12 - gap * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  if (opts.title) {
    slide.addText(opts.title, {
      x: x + 0.18,
      y: y + 0.13,
      w: w - 0.36,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.titleFontSize || 12,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
  }

  items.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const itemX = x + col * (itemW + gap);
    const itemY = y + titleH + 0.04 + row * (itemH + gap);
    slide.addShape(SH.roundRect, {
      x: itemX + 0.12,
      y: itemY + 0.1,
      w: itemW - 0.24,
      h: itemH - 0.16,
      rectRadius: 0.04,
      fill: { color: item.fill || TOKENS.mist },
      line: { color: item.fill || TOKENS.mist },
    });
    slide.addText(item.symbol || "", {
      x: itemX + 0.2,
      y: itemY + 0.13,
      w: 0.42,
      h: itemH - 0.2,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: opts.symbolFontSize || 15,
      bold: true,
      color: item.color || TOKENS.red,
      margin: 0,
      align: "center",
      valign: "mid",
      fit: "shrink",
    });
    slide.addText(item.label || "", {
      x: itemX + 0.66,
      y: itemY + 0.15,
      w: itemW - 0.86,
      h: itemH - 0.22,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.labelFontSize || 8.8,
      bold: true,
      color: TOKENS.ink,
      margin: 0,
      valign: "mid",
      fit: "shrink",
    });
  });
}

function addPerceptronDiagram(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const inputs = opts.inputs || [
    { label: "x1", value: "entrada 1", weight: "w1" },
    { label: "x2", value: "entrada 2", weight: "w2" },
    { label: "x3", value: "entrada 3", weight: "w3" },
  ];
  const inputX = x + 0.24;
  const inputW = Math.min(1.45, w * 0.17);
  const sumX = x + w * 0.42;
  const sumY = y + h * 0.5 - 0.43;
  const actX = x + w * 0.62;
  const outX = x + w - 1.32;
  const rowGap = h / (inputs.length + 1);

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title || "Perceptron", opts.subtitle || "Entradas ponderadas -> suma -> activacion -> salida", {
    titleFontSize: opts.titleFontSize || 13.5,
    subtitleFontSize: 8.8,
  });

  inputs.forEach((input, index) => {
    const inputY = y + 0.72 + rowGap * (index + 0.35);
    slide.addShape(SH.roundRect, {
      x: inputX,
      y: inputY,
      w: inputW,
      h: 0.46,
      rectRadius: 0.05,
      fill: { color: input.fill || TOKENS.softBlue },
      line: { color: input.fill || TOKENS.softBlue },
    });
    slide.addText(input.label || `x${index + 1}`, {
      x: inputX + 0.08,
      y: inputY + 0.07,
      w: 0.38,
      h: 0.18,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 11,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(input.value || "", {
      x: inputX + 0.48,
      y: inputY + 0.09,
      w: inputW - 0.56,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.8,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
    const startX = inputX + inputW + 0.08;
    const startY = inputY + 0.23;
    const connectorTargets = [
      { x: sumX + 0.03, y: sumY + 0.24, labelDx: -0.02, labelDy: -0.19 },
      { x: sumX + 0.0, y: sumY + 0.43, labelDx: -0.02, labelDy: -0.2 },
      { x: sumX + 0.03, y: sumY + 0.62, labelDx: -0.02, labelDy: 0.18 },
    ];
    const target = connectorTargets[index] || connectorTargets[1];
    const endX = target.x;
    const endY = target.y;
    addSafeConnector(slide, SH, startX, startY, endX, endY, {
      color: input.line || TOKENS.guide,
      thickness: 0.014,
    });
    const labelX = startX + (endX - startX) * 0.42 - 0.18 + target.labelDx;
    const labelY = startY + (endY - startY) * 0.42 - 0.18 + target.labelDy;
    slide.addShape(SH.roundRect, {
      x: labelX + 0.07,
      y: labelY + 0.02,
      w: 0.32,
      h: 0.16,
      rectRadius: 0.03,
      fill: { color: TOKENS.white, transparency: 8 },
      line: { color: TOKENS.white, transparency: 100 },
    });
    slide.addText(input.weight || `w${index + 1}`, {
      x: labelX,
      y: labelY,
      w: 0.46,
      h: 0.18,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 8.5,
      bold: true,
      color: TOKENS.red,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });

  slide.addShape(SH.ellipse, {
    x: sumX,
    y: sumY,
    w: 0.86,
    h: 0.86,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText(opts.sumLabel || "Σ", {
    x: sumX + 0.08,
    y: sumY + 0.17,
    w: 0.7,
    h: 0.32,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: TOKENS.white,
    align: "center",
    margin: 0,
  });
  slide.addText(opts.biasLabel || "+ b", {
    x: sumX - 0.02,
    y: sumY + 0.9,
    w: 0.9,
    h: 0.18,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: 10,
    bold: true,
    color: TOKENS.red,
    align: "center",
    margin: 0,
  });

  addArrow(slide, SH, sumX + 0.92, sumY + 0.43, actX - sumX - 1.0);
  slide.addShape(SH.roundRect, {
    x: actX,
    y: sumY + 0.08,
    w: 1.28,
    h: 0.7,
    rectRadius: 0.05,
    fill: { color: TOKENS.warm },
    line: { color: TOKENS.warm },
  });
  slide.addText(opts.activationLabel || "activacion", {
    x: actX + 0.1,
    y: sumY + 0.22,
    w: 1.08,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.6,
    bold: true,
    color: TOKENS.navy,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
  slide.addText(opts.activationRule || "z >= 0", {
    x: actX + 0.1,
    y: sumY + 0.43,
    w: 1.08,
    h: 0.14,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: 8,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
    fit: "shrink",
  });

  addArrow(slide, SH, actX + 1.34, sumY + 0.43, outX - actX - 1.42);
  slide.addShape(SH.roundRect, {
    x: outX,
    y: sumY + 0.09,
    w: 1.08,
    h: 0.68,
    rectRadius: 0.05,
    fill: { color: opts.outputFill || TOKENS.paleRed },
    line: { color: opts.outputFill || TOKENS.paleRed },
  });
  slide.addText(opts.outputLabel || "ŷ", {
    x: outX + 0.1,
    y: sumY + 0.19,
    w: 0.88,
    h: 0.24,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: 17,
    bold: true,
    color: TOKENS.red,
    align: "center",
    margin: 0,
  });
  slide.addText(opts.outputText || "salida", {
    x: outX + 0.1,
    y: sumY + 0.47,
    w: 0.88,
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: 7.4,
    bold: true,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function addBiologicalToArtificialMap(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    { bio: "Dendritas", ai: "Entradas x", note: "senales que llegan" },
    { bio: "Sinapsis", ai: "Pesos w", note: "fuerza de conexion" },
    { bio: "Soma", ai: "Suma z", note: "integra senales" },
    { bio: "Umbral", ai: "Activacion", note: "decide respuesta" },
    { bio: "Axon", ai: "Salida ŷ", note: "senal resultante" },
  ];
  const leftW = w * 0.34;
  const rightW = w * 0.34;
  const midW = w - leftW - rightW;
  const contentTop = opts.contentTop || 1.02;
  const rowH = (h - contentTop - 0.12) / items.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title || "De biologia a modelo artificial", opts.subtitle || "Inspiracion conceptual, no copia literal", {
    titleFontSize: 13.5,
    subtitleFontSize: opts.subtitleFontSize || 10.2,
  });

  slide.addText(opts.leftTitle || "Neurona biologica", {
    x: x + 0.24,
    y: y + 0.78,
    w: leftW - 0.28,
    h: 0.2,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.columnTitleFontSize || 9.8,
    bold: true,
    color: TOKENS.slate,
    margin: 0,
  });
  slide.addText(opts.rightTitle || "Neurona artificial", {
    x: x + leftW + midW + 0.08,
    y: y + 0.78,
    w: rightW - 0.28,
    h: 0.2,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.columnTitleFontSize || 9.8,
    bold: true,
    color: TOKENS.slate,
    margin: 0,
  });

  items.forEach((item, index) => {
    const rowY = y + contentTop + index * rowH;
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: rowY,
      w: leftW - 0.36,
      h: rowH - 0.12,
      rectRadius: 0.04,
      fill: { color: TOKENS.softBlue },
      line: { color: TOKENS.softBlue },
    });
    slide.addText(item.bio, {
      x: x + 0.36,
      y: rowY + 0.12,
      w: leftW - 0.64,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.itemTitleFontSize || 12.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.note || "", {
      x: x + 0.36,
      y: rowY + 0.36,
      w: leftW - 0.64,
      h: 0.2,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.noteFontSize || 9.4,
      color: TOKENS.slate,
      margin: 0,
      fit: "shrink",
    });
    addArrow(slide, SH, x + leftW - 0.08, rowY + (rowH - 0.12) / 2, midW - 0.14, {
      color: index % 2 === 0 ? TOKENS.guide : TOKENS.gold,
      pt: 1.1,
    });
    slide.addShape(SH.roundRect, {
      x: x + leftW + midW + 0.08,
      y: rowY,
      w: rightW - 0.3,
      h: rowH - 0.12,
      rectRadius: 0.04,
      fill: { color: index % 2 === 0 ? TOKENS.mist : TOKENS.warm },
      line: { color: index % 2 === 0 ? TOKENS.mist : TOKENS.warm },
    });
    slide.addText(item.ai, {
      x: x + leftW + midW + 0.22,
      y: rowY + 0.18,
      w: rightW - 0.58,
      h: 0.24,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.aiFontSize || 12.4,
      bold: true,
      color: index === items.length - 1 ? TOKENS.red : TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
  });
}

function addWeightedSumBreakdown(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const terms = opts.terms || [
    { label: "3*1", value: "3", note: "w1*x1" },
    { label: "2*1", value: "2", note: "w2*x2" },
    { label: "1*0", value: "0", note: "w3*x3" },
    { label: "-3", value: "-3", note: "b" },
  ];
  const result = opts.result || "2";
  const gap = 0.12;
  const resultW = opts.resultW || 1.08;
  const termW = (w - 0.52 - resultW - gap * (terms.length + 1)) / terms.length;
  const termY = y + 0.88;
  const termH = Math.min(1.08, h - 1.28);

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title || "Suma ponderada paso a paso", opts.subtitle || "cada termino aporta a la senal total z", {
    titleFontSize: 13.5,
    subtitleFontSize: 8.8,
  });

  terms.forEach((term, index) => {
    const termX = x + 0.24 + index * (termW + gap);
    slide.addShape(SH.roundRect, {
      x: termX,
      y: termY,
      w: termW,
      h: termH,
      rectRadius: 0.05,
      fill: { color: term.fill || (index === terms.length - 1 ? TOKENS.warm : TOKENS.softBlue) },
      line: { color: term.fill || (index === terms.length - 1 ? TOKENS.warm : TOKENS.softBlue) },
    });
    slide.addText(term.label || "", {
      x: termX + 0.08,
      y: termY + 0.16,
      w: termW - 0.16,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: opts.termFontSize || 13,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(term.note || "", {
      x: termX + 0.08,
      y: termY + 0.48,
      w: termW - 0.16,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      bold: true,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(`= ${term.value}`, {
      x: termX + 0.08,
      y: termY + 0.7,
      w: termW - 0.16,
      h: 0.18,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 10,
      bold: true,
      color: term.valueColor || TOKENS.red,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    if (index < terms.length - 1) {
      slide.addText("+", {
        x: termX + termW + 0.01,
        y: termY + 0.38,
        w: gap - 0.02,
        h: 0.2,
        fontFace: TYPOGRAPHY.display,
        fontSize: 14,
        bold: true,
        color: TOKENS.guide,
        align: "center",
        margin: 0,
      });
    }
  });

  const eqX = x + 0.24 + terms.length * (termW + gap);
  slide.addText("=", {
    x: eqX,
    y: termY + 0.38,
    w: 0.26,
    h: 0.22,
    fontFace: TYPOGRAPHY.display,
    fontSize: 15,
    bold: true,
    color: TOKENS.guide,
    align: "center",
    margin: 0,
  });
  slide.addShape(SH.roundRect, {
    x: eqX + 0.32,
    y: termY,
    w: resultW,
    h: termH,
    rectRadius: 0.05,
    fill: { color: opts.resultFill || TOKENS.paleRed },
    line: { color: opts.resultFill || TOKENS.paleRed },
  });
  slide.addText(opts.resultLabel || "z", {
    x: eqX + 0.4,
    y: termY + 0.18,
    w: resultW - 0.16,
    h: 0.18,
    fontFace: TYPOGRAPHY.mono || "Aptos Mono",
    fontSize: 11,
    bold: true,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
  });
  slide.addText(result, {
    x: eqX + 0.4,
    y: termY + 0.44,
    w: resultW - 0.16,
    h: 0.28,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: TOKENS.red,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function addTrainingLoop(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const steps = opts.steps || [
    { title: "Datos", body: "x + y" },
    { title: "Prediccion", body: "ŷ" },
    { title: "Perdida", body: "L" },
    { title: "Ajuste", body: "w, b" },
  ];
  const gap = opts.gap || 0.18;
  const titleH = opts.title ? 0.58 : 0.18;
  const stepW = (w - 0.48 - gap * (steps.length - 1)) / steps.length;
  const stepY = y + titleH + 0.28;
  const stepH = Math.min(1.0, h - titleH - 0.52);

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: 13.5,
      subtitleFontSize: 8.8,
    });
  }

  steps.forEach((step, index) => {
    const stepX = x + 0.24 + index * (stepW + gap);
    slide.addShape(SH.roundRect, {
      x: stepX,
      y: stepY,
      w: stepW,
      h: stepH,
      rectRadius: 0.05,
      fill: { color: step.fill || (index === 2 ? TOKENS.paleRed : TOKENS.softBlue) },
      line: { color: step.fill || (index === 2 ? TOKENS.paleRed : TOKENS.softBlue) },
    });
    slide.addText(String(index + 1).padStart(2, "0"), {
      x: stepX + 0.08,
      y: stepY + 0.1,
      w: 0.34,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 9,
      bold: true,
      color: step.numColor || TOKENS.red,
      margin: 0,
    });
    slide.addText(step.title || "", {
      x: stepX + 0.16,
      y: stepY + 0.32,
      w: stepW - 0.32,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.stepTitleFontSize || 11.2,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(step.body || "", {
      x: stepX + 0.16,
      y: stepY + 0.62,
      w: stepW - 0.32,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.stepBodyFontSize || 8.4,
      bold: true,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    if (index < steps.length - 1) {
      addArrow(slide, SH, stepX + stepW + 0.04, stepY + stepH / 2, gap - 0.08, {
        color: TOKENS.guide,
      });
    }
  });

  if (opts.loopLabel !== false) {
    slide.addShape(SH.line, {
      x: x + w - 0.72,
      y: stepY + stepH + 0.12,
      w: -(w - 1.2),
      h: 0,
      line: { color: TOKENS.gold, pt: 1.2, beginArrowType: "none", endArrowType: "triangle", dash: "dash" },
    });
    slide.addText(opts.loopLabel || "vuelve a intentar con parametros ajustados", {
      x: x + 0.5,
      y: stepY + stepH + 0.2,
      w: w - 1.0,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      bold: true,
      color: TOKENS.slate,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  }
}

function addLossComparison(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const cases = opts.cases || [
    { label: "ŷ = 9", loss: 1, note: "cerca" },
    { label: "ŷ = 7", loss: 9, note: "medio" },
    { label: "ŷ = 2", loss: 64, note: "lejos" },
  ];
  const maxLoss = Math.max(...cases.map((item) => item.loss || 0), 1);
  const chartY = y + 0.78;
  const chartH = h - 1.16;
  const gap = 0.22;
  const barW = (w - 0.7 - gap * (cases.length - 1)) / cases.length;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title || "La perdida castiga errores grandes", opts.subtitle || "L = (y - ŷ)^2", {
    titleFontSize: 13.5,
    subtitleFontSize: 8.8,
  });

  cases.forEach((item, index) => {
    const barX = x + 0.35 + index * (barW + gap);
    const barH = Math.max(0.12, (item.loss / maxLoss) * (chartH - 0.5));
    const barY = chartY + chartH - barH - 0.26;
    slide.addShape(SH.roundRect, {
      x: barX,
      y: chartY,
      w: barW,
      h: chartH,
      rectRadius: 0.04,
      fill: { color: TOKENS.mist },
      line: { color: TOKENS.mist },
    });
    slide.addShape(SH.rect, {
      x: barX + 0.18,
      y: barY,
      w: barW - 0.36,
      h: barH,
      fill: { color: item.color || (index === cases.length - 1 ? TOKENS.red : TOKENS.navy) },
      line: { color: item.color || (index === cases.length - 1 ? TOKENS.red : TOKENS.navy) },
    });
    slide.addText(`L = ${item.loss}`, {
      x: barX + 0.1,
      y: Math.max(chartY + 0.1, barY - 0.24),
      w: barW - 0.2,
      h: 0.16,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 8.6,
      bold: true,
      color: TOKENS.ink,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.label || "", {
      x: barX + 0.1,
      y: chartY + chartH - 0.18,
      w: barW - 0.2,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 8.2,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });
}

function addNetworkLayersDiagram(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const layers = opts.layers || [
    { title: "Entrada", nodes: 3, color: TOKENS.softBlue },
    { title: "Oculta 1", nodes: 4, color: TOKENS.warm },
    { title: "Oculta 2", nodes: 4, color: TOKENS.warm },
    { title: "Salida", nodes: 2, color: TOKENS.paleRed },
  ];
  const gap = opts.gap || 0.28;
  const topH = opts.title ? 0.68 : 0.18;
  const layerW = (w - 0.6 - gap * (layers.length - 1)) / layers.length;
  const diagramY = y + topH;
  const diagramH = h - topH - 0.18;
  const nodeSize = Math.min(opts.nodeSize || 0.26, (diagramH - 0.56) / Math.max(...layers.map((layer) => layer.nodes), 1) - 0.03);

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: 13.5,
      subtitleFontSize: 8.8,
    });
  }

  const vbW = 720;
  const vbH = 360;
  const topPad = 48;
  const bottomPad = 42;
  const leftPad = 58;
  const rightPad = 58;
  const nodeR = 15;
  const layerStep = (vbW - leftPad - rightPad) / Math.max(1, layers.length - 1);
  const lineColor = asSvgColor(opts.lineColor || TOKENS.guide);
  const navy = asSvgColor(TOKENS.navy);
  const slate = asSvgColor(TOKENS.slate);
  const positions = layers.map((layer, layerIndex) => {
    const cx = leftPad + layerIndex * layerStep;
    const usableH = vbH - topPad - bottomPad;
    const step = usableH / Math.max(1, layer.nodes - 1);
    const nodes = Array.from({ length: layer.nodes }, (_unused, nodeIndex) => ({
      cx,
      cy: layer.nodes === 1 ? topPad + usableH / 2 : topPad + nodeIndex * step,
    }));
    return { ...layer, cx, nodes };
  });

  const lines = [];
  positions.forEach((layer, layerIndex) => {
    if (layerIndex >= positions.length - 1) return;
    const next = positions[layerIndex + 1];
    layer.nodes.forEach((from) => {
      next.nodes.forEach((to) => {
        lines.push(`<line x1="${from.cx + nodeR}" y1="${from.cy}" x2="${to.cx - nodeR}" y2="${to.cy}" stroke="${lineColor}" stroke-width="1.4" opacity="0.56"/>`);
      });
    });
  });

  const nodeSvg = positions
    .map((layer, layerIndex) => {
      const fill = asSvgColor(layer.highlight ? TOKENS.red : layer.color || TOKENS.softBlue);
      const stroke = asSvgColor(layer.highlight ? TOKENS.red : layerIndex === 0 ? TOKENS.gold : TOKENS.navy);
      const title = escapeXml(layer.title || "");
      const nodes = layer.nodes
        .map((node) => `<circle cx="${node.cx}" cy="${node.cy}" r="${nodeR}" fill="${fill}" stroke="${stroke}" stroke-width="2.2"/>`)
        .join("");
      return `
        <text x="${layer.cx}" y="${vbH - 12}" font-family="Aptos, Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="${slate}">${title}</text>
        ${nodes}
      `;
    })
    .join("");

  const svg = svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}">
      <rect x="0" y="0" width="${vbW}" height="${vbH}" fill="none"/>
      <g>${lines.join("")}</g>
      <g>${nodeSvg}</g>
      <text x="${vbW / 2}" y="26" font-family="Aptos, Arial, sans-serif" font-size="15" font-weight="800" text-anchor="middle" fill="${navy}">${escapeXml(opts.diagramLabel || "")}</text>
    </svg>
  `);

  slide.addImage({
    data: svg,
    x: x + 0.22,
    y: diagramY + 0.1,
    w: w - 0.44,
    h: diagramH - 0.1,
  });
}

function addFitGeneralizationPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    { title: "Underfitting", train: "alto", test: "alto", body: "no aprende el patron basico", accent: TOKENS.gold },
    { title: "Overfitting", train: "bajo", test: "alto", body: "memoriza lo conocido", accent: TOKENS.red },
    { title: "Generalizacion", train: "bajo", test: "razonable", body: "aprende patron util", accent: TOKENS.success },
  ];
  const gap = 0.18;
  const cardW = (w - 0.48 - gap * (items.length - 1)) / items.length;
  const cardY = y + 0.76;
  const cardH = h - 0.96;

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title || "Tres resultados posibles", opts.subtitle || "lo importante es como responde ante datos nuevos", {
    titleFontSize: 13.5,
    subtitleFontSize: 8.8,
  });

  items.forEach((item, index) => {
    const cardX = x + 0.24 + index * (cardW + gap);
    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill: item.fill || TOKENS.mist,
      line: item.fill || TOKENS.mist,
    });
    addAccentBar(slide, SH, cardX + 0.12, cardY + 0.14, cardH - 0.28, item.accent || TOKENS.red);
    slide.addText(item.title, {
      x: cardX + 0.32,
      y: cardY + 0.18,
      w: cardW - 0.44,
      h: 0.24,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12.3,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    [
      { label: "train", value: item.train },
      { label: "test", value: item.test },
    ].forEach((metric, metricIndex) => {
      const mY = cardY + 0.58 + metricIndex * 0.34;
      slide.addText(metric.label, {
        x: cardX + 0.34,
        y: mY,
        w: 0.48,
        h: 0.12,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.2,
        bold: true,
        color: TOKENS.slate,
        margin: 0,
      });
      slide.addText(metric.value || "", {
        x: cardX + 0.86,
        y: mY - 0.01,
        w: cardW - 1.04,
        h: 0.14,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.2,
        bold: true,
        color: item.accent || TOKENS.red,
        margin: 0,
        fit: "shrink",
      });
    });
    slide.addText(item.body || "", {
      x: cardX + 0.34,
      y: cardY + 1.32,
      w: cardW - 0.52,
      h: cardH - 1.48,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.7,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
      fit: "shrink",
    });
  });
}

function addConfusionCasesPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.62 : 0.18;
  const gridX = x + 0.34;
  const gridY = y + titleH + 0.16;
  const gridW = w - 0.68;
  const gridH = h - titleH - 0.42;
  const labelW = 1.05;
  const headerH = 0.38;
  const cellW = (gridW - labelW) / 2;
  const cellH = (gridH - headerH) / 2;
  const cells = opts.cells || [
    { row: 0, col: 0, title: "Verdadero positivo", body: "marca amenaza y si era amenaza", fill: TOKENS.successSoft, accent: TOKENS.success },
    { row: 0, col: 1, title: "Falso positivo", body: "marca amenaza, pero era normal", fill: TOKENS.warningSoft, accent: TOKENS.gold },
    { row: 1, col: 0, title: "Falso negativo", body: "no marca amenaza, pero si lo era", fill: TOKENS.paleRed, accent: TOKENS.red },
    { row: 1, col: 1, title: "Verdadero negativo", body: "no marca y era normal", fill: TOKENS.softBlue, accent: TOKENS.navy },
  ];

  addSurface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white });
  if (opts.title) {
    addPanelTitle(slide, x + 0.24, y + 0.16, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: 13.5,
      subtitleFontSize: 8.8,
    });
  }

  slide.addText(opts.predictedLabel || "predicho", {
    x: gridX + labelW,
    y: gridY,
    w: cellW * 2,
    h: 0.16,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8,
    bold: true,
    color: TOKENS.slate,
    align: "center",
    margin: 0,
  });
  slide.addText(opts.realLabel || "real", {
    x: gridX,
    y: gridY + headerH + cellH - 0.05,
    w: labelW - 0.1,
    h: 0.16,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8,
    bold: true,
    color: TOKENS.slate,
    align: "center",
    rotate: 270,
    margin: 0,
  });

  ["positivo", "negativo"].forEach((label, index) => {
    slide.addText(label, {
      x: gridX + labelW + index * cellW,
      y: gridY + 0.18,
      w: cellW,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
    });
    slide.addText(label, {
      x: gridX + 0.05,
      y: gridY + headerH + index * cellH + cellH / 2 - 0.08,
      w: labelW - 0.16,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.6,
      bold: true,
      color: TOKENS.navy,
      align: "center",
      margin: 0,
    });
  });

  cells.forEach((cell) => {
    const cellX = gridX + labelW + cell.col * cellW;
    const cellY = gridY + headerH + cell.row * cellH;
    slide.addShape(SH.roundRect, {
      x: cellX + 0.04,
      y: cellY + 0.04,
      w: cellW - 0.08,
      h: cellH - 0.08,
      rectRadius: 0.04,
      fill: { color: cell.fill },
      line: { color: cell.fill },
    });
    addAccentBar(slide, SH, cellX + 0.14, cellY + 0.14, cellH - 0.28, cell.accent);
    slide.addText(cell.title, {
      x: cellX + 0.34,
      y: cellY + 0.16,
      w: cellW - 0.46,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 9.2,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(cell.body || "", {
      x: cellX + 0.34,
      y: cellY + 0.4,
      w: cellW - 0.46,
      h: cellH - 0.52,
      fontFace: TYPOGRAPHY.body,
      fontSize: 7.7,
      color: TOKENS.ink,
      margin: 0,
      valign: "top",
      fit: "shrink",
    });
  });
}

module.exports = {
  addTokenFlow,
  addEmbeddingVector,
  addEmbeddingSpace,
  addAttentionMap,
  addQKVPanel,
  addAgentArchitecture,
  addToolRiskCard,
  addEvaluationRubric,
  addFormulaPanel,
  addSymbolLegend,
  addPerceptronDiagram,
  addBiologicalToArtificialMap,
  addWeightedSumBreakdown,
  addTrainingLoop,
  addLossComparison,
  addNetworkLayersDiagram,
  addFitGeneralizationPanel,
  addConfusionCasesPanel,
};
