const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function text(slide, value, opts = {}) {
  slide.addText(value || "", {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fontFace: opts.fontFace || TYPOGRAPHY.body,
    fontSize: opts.fontSize || 10,
    bold: opts.bold || false,
    color: opts.color || TOKENS.ink,
    align: opts.align || "left",
    valign: opts.valign || "top",
    margin: opts.margin ?? 0,
    fit: opts.fit || "shrink",
    breakLine: false,
  });
}

function surface(slide, SH, x, y, w, h, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: opts.rectRadius || 0.05,
    fill: { color: opts.fill || TOKENS.white, transparency: opts.transparency },
    line: { color: opts.line || TOKENS.border, pt: opts.linePt || 1, transparency: opts.lineTransparency },
  });
}

function accent(slide, SH, x, y, h, color = TOKENS.red, w = 0.12) {
  slide.addShape(SH.rect, {
    x,
    y,
    w,
    h,
    fill: { color },
    line: { color },
  });
}

function arrow(slide, SH, x1, y1, x2, y2, opts = {}) {
  slide.addShape(SH.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: {
      color: opts.color || TOKENS.guide,
      pt: opts.pt || 1.15,
      beginArrowType: "none",
      endArrowType: opts.endArrowType || "triangle",
      dash: opts.dash,
      transparency: opts.transparency,
    },
  });
}

function panelTitle(slide, x, y, w, title, subtitle, opts = {}) {
  text(slide, title, {
    x,
    y,
    w,
    h: opts.titleH || 0.28,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 14,
    bold: true,
    color: opts.titleColor || TOKENS.navy,
  });
  if (!subtitle) return;
  text(slide, subtitle, {
    x,
    y: y + (opts.subtitleY || 0.34),
    w,
    h: opts.subtitleH || 0.28,
    fontSize: opts.subtitleFontSize || 8.8,
    color: opts.subtitleColor || TOKENS.slate,
  });
}

function addTwoPathDecision(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const gap = opts.gap || 0.24;
  const titleH = opts.title ? 0.72 : 0.2;
  const cardY = y + titleH;
  const cardW = (w - gap) / 2;
  const cardH = h - titleH;
  const paths = opts.paths || [
    {
      label: "Camino A",
      title: "Integrar API LLM",
      body: ["React", "backend", "API key privada", "prompt", "respuesta UI"],
      note: "mejor para lenguaje abierto",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      label: "Camino B",
      title: "Prototipo propio",
      body: ["Python + uv", "tipos", "pruebas", "reglas/modelo", "demo"],
      note: "mejor para problemas acotados",
      accent: TOKENS.navy,
      fill: TOKENS.softBlue,
    },
  ];

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  paths.forEach((path, index) => {
    const cardX = x + index * (cardW + gap);
    surface(slide, SH, cardX, cardY, cardW, cardH, { fill: path.fill, line: path.fill });
    accent(slide, SH, cardX + 0.14, cardY + 0.16, cardH - 0.32, path.accent);
    text(slide, path.label, {
      x: cardX + 0.34,
      y: cardY + 0.18,
      w: cardW - 0.52,
      h: 0.16,
      fontSize: 8.4,
      bold: true,
      color: path.accent,
    });
    text(slide, path.title, {
      x: cardX + 0.34,
      y: cardY + 0.42,
      w: cardW - 0.52,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.pathTitleFontSize || 17,
      bold: true,
      color: TOKENS.navy,
    });

    const items = path.body || [];
    const itemY = cardY + 1.02;
    const itemGap = 0.1;
    const itemH = Math.min(0.34, (cardH - 1.72 - itemGap * Math.max(0, items.length - 1)) / Math.max(1, items.length));
    items.slice(0, 6).forEach((item, itemIndex) => {
      const chipY = itemY + itemIndex * (itemH + itemGap);
      surface(slide, SH, cardX + 0.36, chipY, cardW - 0.72, itemH, {
        fill: TOKENS.white,
        line: TOKENS.white,
        rectRadius: 0.04,
      });
      text(slide, item, {
        x: cardX + 0.5,
        y: chipY + Math.max(0.04, itemH * 0.24),
        w: cardW - 1,
        h: Math.max(0.1, itemH - 0.08),
        fontSize: opts.itemFontSize || 9.4,
        bold: true,
        color: TOKENS.ink,
        align: "center",
      });
    });

    if (path.note) {
      text(slide, path.note, {
        x: cardX + 0.34,
        y: cardY + cardH - 0.42,
        w: cardW - 0.52,
        h: 0.2,
        fontSize: opts.noteFontSize || 8.4,
        bold: true,
        color: TOKENS.slate,
        align: "center",
      });
    }
  });
}

function addAiWebPipeline(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.7 : 0.12;
  const steps = opts.steps || [
    { title: "Usuario", body: "idea o pregunta", accent: TOKENS.gold, fill: TOKENS.warm },
    { title: "React", body: "captura estado", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { title: "Backend", body: "valida y protege", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "LLM", body: "genera salida", accent: TOKENS.titleFill, fill: TOKENS.mist },
    { title: "UI", body: "muestra sugerencia", accent: TOKENS.success, fill: TOKENS.successSoft },
  ];
  const gap = opts.gap || 0.18;
  const rowY = y + titleH + 0.28;
  const cardH = h - titleH - 0.58;
  const cardW = (w - gap * (steps.length - 1)) / steps.length;

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  steps.forEach((step, index) => {
    const cardX = x + index * (cardW + gap);
    surface(slide, SH, cardX, rowY, cardW, cardH, { fill: step.fill, line: step.fill });
    slide.addShape(SH.ellipse, {
      x: cardX + cardW / 2 - 0.24,
      y: rowY + 0.22,
      w: 0.48,
      h: 0.48,
      fill: { color: step.accent },
      line: { color: step.accent },
    });
    text(slide, String(index + 1), {
      x: cardX + cardW / 2 - 0.24,
      y: rowY + 0.35,
      w: 0.48,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11,
      bold: true,
      color: TOKENS.white,
      align: "center",
    });
    text(slide, step.title, {
      x: cardX + 0.12,
      y: rowY + 0.86,
      w: cardW - 0.24,
      h: 0.24,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.stepTitleFontSize || 12.2,
      bold: true,
      color: TOKENS.navy,
      align: "center",
    });
    text(slide, step.body, {
      x: cardX + 0.16,
      y: rowY + 1.22,
      w: cardW - 0.32,
      h: cardH - 1.36,
      fontSize: opts.stepBodyFontSize || 8.4,
      color: TOKENS.ink,
      align: "center",
      valign: "mid",
    });
    if (index < steps.length - 1) {
      arrow(slide, SH, cardX + cardW + 0.03, rowY + cardH / 2, cardX + cardW + gap - 0.03, rowY + cardH / 2, {
        color: TOKENS.guide,
      });
    }
  });
}

function addSecureKeyPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const leftW = (w - 0.26) * 0.48;
  const rightW = w - leftW - 0.26;
  const cardY = y + (opts.title ? 0.7 : 0.05);
  const cardH = h - (opts.title ? 0.7 : 0.05);

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  const panels = [
    {
      x,
      w: leftW,
      title: opts.badTitle || "Mal: key en React",
      body: opts.badBody || ["visible en navegador", "copiable por cualquiera", "costo y abuso"],
      fill: TOKENS.paleRed,
      accent: TOKENS.red,
    },
    {
      x: x + leftW + 0.26,
      w: rightW,
      title: opts.goodTitle || "Bien: key en backend",
      body: opts.goodBody || ["variable de entorno", "validacion y limites", "proveedor aislado"],
      fill: TOKENS.successSoft,
      accent: TOKENS.success,
    },
  ];

  panels.forEach((panel) => {
    surface(slide, SH, panel.x, cardY, panel.w, cardH, { fill: panel.fill, line: panel.fill });
    accent(slide, SH, panel.x + 0.14, cardY + 0.16, cardH - 0.32, panel.accent);
    text(slide, panel.title, {
      x: panel.x + 0.36,
      y: cardY + 0.18,
      w: panel.w - 0.52,
      h: 0.32,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.titleFontSize || 15,
      bold: true,
      color: TOKENS.navy,
    });
    panel.body.slice(0, 4).forEach((item, index) => {
      const itemY = cardY + 0.76 + index * 0.46;
      slide.addShape(SH.roundRect, {
        x: panel.x + 0.38,
        y: itemY,
        w: 0.24,
        h: 0.24,
        rectRadius: 0.04,
        fill: { color: panel.accent },
        line: { color: panel.accent },
      });
      text(slide, item, {
        x: panel.x + 0.74,
        y: itemY + 0.02,
        w: panel.w - 0.96,
        h: 0.18,
        fontSize: opts.bodyFontSize || 10,
        bold: true,
        color: TOKENS.ink,
      });
    });
  });
}

function addPromptAnatomy(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const parts = opts.parts || [
    { label: "rol", value: "asistente tecnico", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { label: "tarea", value: "analiza una idea", accent: TOKENS.red, fill: TOKENS.paleRed },
    { label: "entrada", value: "texto del usuario", accent: TOKENS.gold, fill: TOKENS.warm },
    { label: "formato", value: "JSON estricto", accent: TOKENS.titleFill, fill: TOKENS.mist },
    { label: "limites", value: "no inventar datos", accent: TOKENS.success, fill: TOKENS.successSoft },
  ];
  const titleH = opts.title ? 0.7 : 0.1;
  const rowY = y + titleH + 0.16;
  const rowH = (h - titleH - 0.16 - 0.12 * (parts.length - 1)) / parts.length;

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  parts.forEach((part, index) => {
    const itemY = rowY + index * (rowH + 0.12);
    surface(slide, SH, x, itemY, w, rowH, { fill: part.fill, line: part.fill, rectRadius: 0.04 });
    accent(slide, SH, x + 0.12, itemY + 0.1, rowH - 0.2, part.accent);
    text(slide, part.label, {
      x: x + 0.32,
      y: itemY + 0.13,
      w: Math.min(1.3, w * 0.24),
      h: rowH - 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.labelFontSize || 11.2,
      bold: true,
      color: part.accent,
      valign: "mid",
    });
    text(slide, part.value, {
      x: x + Math.min(1.72, w * 0.32),
      y: itemY + 0.13,
      w: w - Math.min(1.95, w * 0.36),
      h: rowH - 0.16,
      fontFace: opts.mono ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: opts.valueFontSize || 10,
      bold: true,
      color: TOKENS.ink,
      valign: "mid",
    });
  });
}

function addStructuredOutputFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const leftW = opts.leftW || w * 0.46;
  const rightW = w - leftW - 0.44;
  const top = y + (opts.title ? 0.72 : 0.08);
  const boxH = h - (opts.title ? 0.72 : 0.08);
  const cards = opts.cards || [
    { title: "Mejora", body: "accion concreta", accent: TOKENS.navy },
    { title: "Riesgo", body: "que revisar", accent: TOKENS.red },
    { title: "Validacion", body: "prueba minima", accent: TOKENS.success },
  ];

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  surface(slide, SH, x, top, leftW, boxH, { fill: TOKENS.editorBg, line: TOKENS.editorBg });
  text(slide, opts.jsonTitle || "respuesta JSON", {
    x: x + 0.22,
    y: top + 0.16,
    w: leftW - 0.44,
    h: 0.18,
    fontSize: 9,
    bold: true,
    color: TOKENS.terminalPrompt,
  });
  text(slide, opts.json || '{\n  "improvement": "...",\n  "risk": "...",\n  "validation": "..."\n}', {
    x: x + 0.26,
    y: top + 0.52,
    w: leftW - 0.52,
    h: boxH - 0.72,
    fontFace: TYPOGRAPHY.mono,
    fontSize: opts.jsonFontSize || 10.2,
    color: TOKENS.white,
    fit: "shrink",
  });

  arrow(slide, SH, x + leftW + 0.08, top + boxH / 2, x + leftW + 0.34, top + boxH / 2, { color: TOKENS.gold, pt: 1.5 });

  const cardGap = 0.14;
  const cardH = (boxH - cardGap * (cards.length - 1)) / cards.length;
  cards.forEach((card, index) => {
    const cardY = top + index * (cardH + cardGap);
    const cardX = x + leftW + 0.44;
    surface(slide, SH, cardX, cardY, rightW, cardH, { fill: card.fill || TOKENS.white, line: card.line || TOKENS.border });
    accent(slide, SH, cardX + 0.12, cardY + 0.12, cardH - 0.24, card.accent);
    text(slide, card.title, {
      x: cardX + 0.34,
      y: cardY + 0.12,
      w: rightW - 0.48,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.cardTitleFontSize || 11.8,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, card.body, {
      x: cardX + 0.34,
      y: cardY + 0.42,
      w: rightW - 0.5,
      h: cardH - 0.54,
      fontSize: opts.cardBodyFontSize || 8.6,
      color: TOKENS.ink,
      valign: "mid",
    });
  });
}

function addTicTacToeBoard(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const size = opts.size || Math.min(opts.w || 2.4, opts.h || 2.4);
  const board = opts.board || [
    ["X", "O", ""],
    ["", "X", ""],
    ["O", "", ""],
  ];
  const cell = size / 3;
  const highlight = opts.highlight || null;

  surface(slide, SH, x, y, size, size, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.navy, linePt: 1.2, rectRadius: 0.04 });
  for (let i = 1; i <= 2; i += 1) {
    slide.addShape(SH.line, { x: x + i * cell, y, w: 0, h: size, line: { color: opts.gridColor || TOKENS.navy, pt: opts.gridPt || 1.4 } });
    slide.addShape(SH.line, { x, y: y + i * cell, w: size, h: 0, line: { color: opts.gridColor || TOKENS.navy, pt: opts.gridPt || 1.4 } });
  }

  board.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cellX = x + columnIndex * cell;
      const cellY = y + rowIndex * cell;
      const isHighlight = highlight && highlight[0] === rowIndex && highlight[1] === columnIndex;
      if (isHighlight) {
        slide.addShape(SH.roundRect, {
          x: cellX + 0.06,
          y: cellY + 0.06,
          w: cell - 0.12,
          h: cell - 0.12,
          rectRadius: 0.04,
          fill: { color: opts.highlightFill || TOKENS.warm },
          line: { color: opts.highlightFill || TOKENS.warm },
        });
      }
      if (!value) return;
      text(slide, value, {
        x: cellX,
        y: cellY + cell * 0.16,
        w: cell,
        h: cell * 0.52,
        fontFace: TYPOGRAPHY.display,
        fontSize: opts.markFontSize || size * 14,
        bold: true,
        color: value === "X" ? (opts.xColor || TOKENS.red) : (opts.oColor || TOKENS.navy),
        align: "center",
        valign: "mid",
      });
    });
  });

  if (opts.caption) {
    text(slide, opts.caption, {
      x,
      y: y + size + 0.14,
      w: size,
      h: 0.18,
      fontSize: opts.captionFontSize || 8.4,
      bold: true,
      color: TOKENS.slate,
      align: "center",
    });
  }
}

function addPythonTypeStrip(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const items = opts.items || [
    { name: "Cell", value: '"X" | "O" | ""', accent: TOKENS.red },
    { name: "Board", value: "list[list[Cell]]", accent: TOKENS.navy },
    { name: "Move", value: "tuple[int, int]", accent: TOKENS.gold },
    { name: "Winner", value: '"X" | "O" | draw | None', accent: TOKENS.success },
  ];
  const gap = opts.gap || 0.14;
  const itemW = (w - gap * (items.length - 1)) / items.length;

  items.forEach((item, index) => {
    const itemX = x + index * (itemW + gap);
    surface(slide, SH, itemX, y, itemW, h, { fill: item.fill || TOKENS.white, line: TOKENS.border, rectRadius: 0.04 });
    accent(slide, SH, itemX + 0.1, y + 0.12, h - 0.24, item.accent, 0.09);
    text(slide, item.name, {
      x: itemX + 0.28,
      y: y + 0.13,
      w: itemW - 0.38,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.nameFontSize || 11.4,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, item.value, {
      x: itemX + 0.28,
      y: y + 0.44,
      w: itemW - 0.38,
      h: h - 0.56,
      fontFace: TYPOGRAPHY.mono,
      fontSize: opts.valueFontSize || 7.6,
      color: TOKENS.ink,
      valign: "mid",
    });
  });
}

function addStrategyLadder(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const steps = opts.steps || [
    { title: "1. Valida", body: "solo celdas libres", accent: TOKENS.guide, fill: TOKENS.mist },
    { title: "2. Gana", body: "si puede cerrar linea", accent: TOKENS.success, fill: TOKENS.successSoft },
    { title: "3. Bloquea", body: "si el rival gana", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "4. Modelo", body: "aprende o pondera", accent: TOKENS.navy, fill: TOKENS.softBlue },
  ];
  const titleH = opts.title ? 0.64 : 0.1;
  const gap = opts.gap || 0.12;
  const stepH = (h - titleH - gap * (steps.length - 1)) / steps.length;

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  steps.forEach((step, index) => {
    const stepY = y + titleH + index * (stepH + gap);
    surface(slide, SH, x + index * 0.18, stepY, w - index * 0.18, stepH, {
      fill: step.fill,
      line: step.fill,
      rectRadius: 0.04,
    });
    accent(slide, SH, x + index * 0.18 + 0.12, stepY + 0.1, stepH - 0.2, step.accent);
    text(slide, step.title, {
      x: x + index * 0.18 + 0.34,
      y: stepY + 0.12,
      w: w - index * 0.18 - 0.48,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.stepTitleFontSize || 11.4,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, step.body, {
      x: x + index * 0.18 + 0.34,
      y: stepY + 0.38,
      w: w - index * 0.18 - 0.48,
      h: stepH - 0.48,
      fontSize: opts.stepBodyFontSize || 8.4,
      color: TOKENS.ink,
      valign: "mid",
    });
  });
}

function addMiniSpecCanvas(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const fields = opts.fields || [
    "Usuario",
    "Problema",
    "Entrada",
    "Salida",
    "Camino",
    "Validacion",
    "Riesgo",
    "No hara",
  ];
  const cols = opts.cols || 2;
  const gap = opts.gap || 0.14;
  const titleH = opts.title ? 0.64 : 0.08;
  const fieldW = (w - gap * (cols - 1)) / cols;
  const rows = Math.ceil(fields.length / cols);
  const fieldH = (h - titleH - gap * (rows - 1)) / rows;

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  fields.forEach((field, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const fieldX = x + col * (fieldW + gap);
    const fieldY = y + titleH + row * (fieldH + gap);
    surface(slide, SH, fieldX, fieldY, fieldW, fieldH, { fill: TOKENS.white, line: TOKENS.border, rectRadius: 0.04 });
    accent(slide, SH, fieldX + 0.1, fieldY + 0.1, fieldH - 0.2, opts.accent || TOKENS.red, 0.08);
    text(slide, field, {
      x: fieldX + 0.28,
      y: fieldY + 0.12,
      w: fieldW - 0.38,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.labelFontSize || 10.4,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, opts.placeholder || "definir en 1 frase", {
      x: fieldX + 0.28,
      y: fieldY + 0.4,
      w: fieldW - 0.4,
      h: fieldH - 0.5,
      fontSize: opts.placeholderFontSize || 7.8,
      color: TOKENS.guide,
      valign: "mid",
    });
  });
}

function addControlLevelLadder(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const levels = opts.levels || [
    { label: "1", title: "Sugiere", risk: "bajo", accent: TOKENS.success },
    { label: "2", title: "Clasifica", risk: "medio", accent: TOKENS.gold },
    { label: "3", title: "Recomienda", risk: "alto", accent: TOKENS.red },
    { label: "4", title: "Ejecuta", risk: "critico", accent: TOKENS.navy },
  ];
  const titleH = opts.title ? 0.7 : 0.1;
  const gap = opts.gap || 0.18;
  const cardW = (w - gap * (levels.length - 1)) / levels.length;
  const cardY = y + titleH + 0.14;
  const cardH = h - titleH - 0.14;

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  levels.forEach((level, index) => {
    const cardX = x + index * (cardW + gap);
    const raise = index * 0.16;
    surface(slide, SH, cardX, cardY - raise, cardW, cardH + raise, {
      fill: level.fill || TOKENS.white,
      line: TOKENS.border,
      rectRadius: 0.04,
    });
    slide.addShape(SH.ellipse, {
      x: cardX + cardW / 2 - 0.24,
      y: cardY - raise + 0.2,
      w: 0.48,
      h: 0.48,
      fill: { color: level.accent },
      line: { color: level.accent },
    });
    text(slide, level.label, {
      x: cardX + cardW / 2 - 0.24,
      y: cardY - raise + 0.33,
      w: 0.48,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11,
      bold: true,
      color: TOKENS.white,
      align: "center",
    });
    text(slide, level.title, {
      x: cardX + 0.12,
      y: cardY - raise + 0.86,
      w: cardW - 0.24,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.titleFontSize || 11.4,
      bold: true,
      color: TOKENS.navy,
      align: "center",
    });
    text(slide, `riesgo ${level.risk}`, {
      x: cardX + 0.12,
      y: cardY - raise + 1.2,
      w: cardW - 0.24,
      h: 0.16,
      fontSize: opts.riskFontSize || 8,
      bold: true,
      color: level.accent,
      align: "center",
    });
  });
}

module.exports = {
  addTwoPathDecision,
  addAiWebPipeline,
  addSecureKeyPanel,
  addPromptAnatomy,
  addStructuredOutputFlow,
  addTicTacToeBoard,
  addPythonTypeStrip,
  addStrategyLadder,
  addMiniSpecCanvas,
  addControlLevelLadder,
};
