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
    line: {
      color: opts.line || TOKENS.border,
      pt: opts.linePt || 1,
      transparency: opts.lineTransparency,
    },
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

function line(slide, SH, x1, y1, x2, y2, opts = {}) {
  const reverse = x2 < x1 || y2 < y1;
  slide.addShape(SH.line, {
    x: reverse ? x2 : x1,
    y: reverse ? y2 : y1,
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1),
    line: {
      color: opts.color || TOKENS.guide,
      pt: opts.pt || 1.15,
      beginArrowType: reverse ? (opts.endArrowType || "triangle") : (opts.beginArrowType || "none"),
      endArrowType: reverse ? (opts.beginArrowType || "none") : (opts.endArrowType || "triangle"),
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
    h: opts.titleH || 0.32,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 14.5,
    bold: true,
    color: opts.titleColor || TOKENS.navy,
  });
  if (!subtitle) return;
  text(slide, subtitle, {
    x,
    y: y + (opts.subtitleY || 0.38),
    w,
    h: opts.subtitleH || 0.28,
    fontSize: opts.subtitleFontSize || 9.2,
    color: opts.subtitleColor || TOKENS.slate,
  });
}

function badge(slide, SH, x, y, label, opts = {}) {
  const w = opts.w || 0.74;
  const h = opts.h || 0.28;
  surface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.navy,
    line: opts.fill || TOKENS.navy,
    rectRadius: 0.04,
  });
  text(slide, label, {
    x: x + 0.06,
    y: y + 0.07,
    w: w - 0.12,
    h: 0.1,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.fontSize || 8,
    bold: true,
    color: opts.color || TOKENS.white,
    align: "center",
  });
}

function drawPiece(slide, SH, cx, cy, size, player, opts = {}) {
  const red = opts.red || TOKENS.red;
  const blue = opts.blue || TOKENS.titleFill;
  const color = player === 1 || player === "p1" || player === "red" ? red : blue;
  const lineColor = player === 1 || player === "p1" || player === "red" ? "9E171B" : TOKENS.navy;
  slide.addShape(SH.ellipse, {
    x: cx - size / 2,
    y: cy - size / 2,
    w: size,
    h: size,
    fill: { color },
    line: { color: lineColor, pt: 1 },
  });
  slide.addShape(SH.ellipse, {
    x: cx - size * 0.23,
    y: cy - size * 0.25,
    w: size * 0.24,
    h: size * 0.18,
    fill: { color: TOKENS.white, transparency: 55 },
    line: { color: TOKENS.white, transparency: 100 },
  });
}

function normalizeCell(cell) {
  if (cell === 1 || cell === "1" || cell === "p1" || cell === "red" || cell === "R") return 1;
  if (cell === -1 || cell === "-1" || cell === "p2" || cell === "blue" || cell === "B") return -1;
  return 0;
}

function addAtaxxBoardState(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.64 : 0.08;
  const boardSize = 7;
  const boardSide = Math.min(w * (opts.boardRatio || 0.58), h - titleH - 0.18);
  const boardX = x + 0.2;
  const boardY = y + titleH + 0.12;
  const sideX = boardX + boardSide + 0.28;
  const sideW = Math.max(1.2, x + w - sideX - 0.2);
  const cell = boardSide / boardSize;
  const grid = opts.grid || [
    [1, 0, 0, 0, 0, 0, -1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 1],
  ];
  const highlights = opts.highlights || [];
  const highlightKey = new Map(highlights.map((item) => [`${item.r},${item.c}`, item]));

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  slide.addShape(SH.rect, {
    x: boardX,
    y: boardY,
    w: boardSide,
    h: boardSide,
    fill: { color: opts.boardFill || "F2F5F8" },
    line: { color: TOKENS.navy, pt: 1.2 },
  });

  for (let r = 0; r < boardSize; r += 1) {
    for (let c = 0; c < boardSize; c += 1) {
      const cx = boardX + c * cell;
      const cy = boardY + r * cell;
      const fill = (r + c) % 2 === 0 ? "F8FBFD" : "E8EEF5";
      slide.addShape(SH.rect, {
        x: cx,
        y: cy,
        w: cell,
        h: cell,
        fill: { color: fill },
        line: { color: "D5DFEA", pt: 0.55 },
      });
      const hi = highlightKey.get(`${r},${c}`);
      if (hi) {
        slide.addShape(SH.rect, {
          x: cx + 0.03,
          y: cy + 0.03,
          w: cell - 0.06,
          h: cell - 0.06,
          fill: { color: hi.fill || TOKENS.gold, transparency: hi.transparency ?? 18 },
          line: { color: hi.line || hi.fill || TOKENS.gold, pt: 1.4 },
        });
      }
      const piece = normalizeCell(grid[r]?.[c]);
      if (piece !== 0) {
        drawPiece(slide, SH, cx + cell / 2, cy + cell / 2, cell * 0.62, piece, opts);
      }
    }
  }

  if (opts.move) {
    const fromX = boardX + opts.move.from.c * cell + cell / 2;
    const fromY = boardY + opts.move.from.r * cell + cell / 2;
    const toX = boardX + opts.move.to.c * cell + cell / 2;
    const toY = boardY + opts.move.to.r * cell + cell / 2;
    line(slide, SH, fromX, fromY, toX, toY, {
      color: opts.move.color || TOKENS.red,
      pt: opts.move.pt || 2.2,
      dash: opts.move.dash,
    });
  }

  const metrics = opts.metrics || [
    { label: "Tablero", value: "7 x 7" },
    { label: "Estado", value: "49 casillas" },
    { label: "Acciones", value: "793 indices" },
  ];
  metrics.slice(0, 4).forEach((metric, index) => {
    const rowY = boardY + index * 0.62;
    surface(slide, SH, sideX, rowY, sideW, 0.46, {
      fill: metric.fill || (index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm),
      line: metric.fill || (index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm),
      rectRadius: 0.04,
    });
    text(slide, metric.label, {
      x: sideX + 0.16,
      y: rowY + 0.11,
      w: sideW * 0.42,
      h: 0.12,
      fontSize: 8.4,
      bold: true,
      color: metric.accent || TOKENS.navy,
    });
    text(slide, metric.value, {
      x: sideX + sideW * 0.48,
      y: rowY + 0.08,
      w: sideW * 0.46,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.4,
      bold: true,
      color: TOKENS.ink,
      align: "right",
    });
  });

  const note = opts.note || "Cada jugada modifica el tablero y tambien cambia el espacio de decisiones del rival.";
  text(slide, note, {
    x: sideX,
    y: boardY + Math.max(2.68, metrics.length * 0.62 + 0.22),
    w: sideW,
    h: Math.max(0.56, boardY + boardSide - (boardY + Math.max(2.68, metrics.length * 0.62 + 0.22))),
    fontSize: opts.noteFontSize || 9,
    color: TOKENS.slate,
    valign: "mid",
  });
}

function addMoveAnatomyPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.68 : 0.1;
  const rowY = y + titleH + 0.18;
  const gap = opts.gap || 0.2;
  const cardW = (w - gap * 2) / 3;
  const cardH = h - titleH - 0.22;
  const moves = opts.moves || [
    {
      label: "01",
      title: "Clonar",
      rule: "distancia 1",
      body: "La pieza original queda en su lugar y aparece una copia.",
      accent: TOKENS.success,
      fill: TOKENS.successSoft,
      path: "clone",
    },
    {
      label: "02",
      title: "Saltar",
      rule: "distancia 2",
      body: "La pieza cambia de posicion sin aumentar el conteo total.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
      path: "jump",
    },
    {
      label: "03",
      title: "Infectar",
      rule: "radio 1",
      body: "Las piezas rivales adyacentes al destino cambian de lado.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
      path: "infect",
    },
  ];

  if (opts.title) {
    panelTitle(slide, x, y, w, opts.title, opts.subtitle, opts);
  }

  moves.forEach((move, index) => {
    const cardX = x + index * (cardW + gap);
    surface(slide, SH, cardX, rowY, cardW, cardH, { fill: move.fill, line: move.fill });
    accent(slide, SH, cardX + 0.14, rowY + 0.16, cardH - 0.32, move.accent);
    badge(slide, SH, cardX + 0.34, rowY + 0.18, move.label, { fill: move.accent, w: 0.46, fontSize: 7.5 });
    text(slide, move.title, {
      x: cardX + 0.92,
      y: rowY + 0.17,
      w: cardW - 1.16,
      h: 0.25,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.cardTitleFontSize || 14.5,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, move.rule, {
      x: cardX + 0.34,
      y: rowY + 0.58,
      w: cardW - 0.58,
      h: 0.18,
      fontSize: 8.8,
      bold: true,
      color: move.accent,
    });

    const diagramX = cardX + 0.38;
    const diagramY = rowY + 0.98;
    const diagramW = cardW - 0.76;
    const cell = Math.min(0.34, diagramW / 5.2);
    const gridX = diagramX + (diagramW - cell * 5) / 2;
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 5; c += 1) {
        slide.addShape(SH.rect, {
          x: gridX + c * cell,
          y: diagramY + r * cell,
          w: cell,
          h: cell,
          fill: { color: (r + c) % 2 === 0 ? TOKENS.white : "E8EEF5" },
          line: { color: "D3DDE8", pt: 0.45 },
        });
      }
    }
    const midY = diagramY + cell * 1.5;
    drawPiece(slide, SH, gridX + cell * 0.5, midY, cell * 0.6, 1);
    const targetCol = move.path === "clone" ? 1 : 2;
    line(slide, SH, gridX + cell * 0.55, midY, gridX + cell * (targetCol + 0.5), midY, {
      color: move.accent,
      pt: 1.5,
    });
    drawPiece(slide, SH, gridX + cell * (targetCol + 0.5), midY, cell * 0.6, 1);
    if (move.path === "jump") {
      slide.addShape(SH.rect, {
        x: gridX + cell * 0.12,
        y: midY - cell * 0.24,
        w: cell * 0.76,
        h: cell * 0.48,
        fill: { color: TOKENS.white, transparency: 30 },
        line: { color: TOKENS.guide, pt: 1, dash: "dash" },
      });
    }
    if (move.path === "infect") {
      drawPiece(slide, SH, gridX + cell * 3.5, diagramY + cell * 0.5, cell * 0.54, -1);
      drawPiece(slide, SH, gridX + cell * 3.5, diagramY + cell * 2.5, cell * 0.54, -1);
      line(slide, SH, gridX + cell * 2.7, midY, gridX + cell * 3.2, diagramY + cell * 0.66, {
        color: TOKENS.red,
        pt: 1,
      });
      line(slide, SH, gridX + cell * 2.7, midY, gridX + cell * 3.2, diagramY + cell * 2.34, {
        color: TOKENS.red,
        pt: 1,
      });
    }

    text(slide, move.body, {
      x: cardX + 0.34,
      y: rowY + cardH - 0.78,
      w: cardW - 0.58,
      h: 0.46,
      fontSize: opts.bodyFontSize || 8.9,
      color: TOKENS.ink,
      valign: "mid",
    });
  });
}

function addMctsSearchPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.68 : 0.08;
  const treeX = x + 0.26;
  const treeY = y + titleH + 0.22;
  const treeW = w * 0.62;
  const treeH = h - titleH - 0.34;
  const sideX = treeX + treeW + 0.28;
  const sideW = x + w - sideX - 0.22;
  const phases = opts.phases || [
    { title: "Seleccion", body: "baja por PUCT", accent: TOKENS.navy },
    { title: "Expansion", body: "crea hijos legales", accent: TOKENS.gold },
    { title: "Evaluacion", body: "policy + value", accent: TOKENS.titleFill },
    { title: "Backprop", body: "actualiza visitas", accent: TOKENS.red },
  ];
  const nodes = opts.nodes || [
    { id: "root", label: "estado actual", visits: "400", value: "+0.18", x: 0.5, y: 0.12, fill: TOKENS.navy, color: TOKENS.white },
    { id: "a", label: "A", visits: "184", value: "+0.31", x: 0.18, y: 0.48, fill: TOKENS.success, color: TOKENS.white, best: true },
    { id: "b", label: "B", visits: "132", value: "+0.12", x: 0.5, y: 0.48, fill: TOKENS.gold, color: TOKENS.navy },
    { id: "c", label: "C", visits: "84", value: "-0.08", x: 0.82, y: 0.48, fill: TOKENS.paleRed, color: TOKENS.navy },
    { id: "a1", label: "A1", visits: "71", value: "+0.24", x: 0.1, y: 0.82, fill: TOKENS.softBlue, color: TOKENS.navy },
    { id: "a2", label: "A2", visits: "113", value: "+0.37", x: 0.28, y: 0.82, fill: TOKENS.successSoft, color: TOKENS.navy, best: true },
    { id: "b1", label: "B1", visits: "76", value: "+0.05", x: 0.5, y: 0.82, fill: TOKENS.warm, color: TOKENS.navy },
    { id: "c1", label: "C1", visits: "49", value: "-0.14", x: 0.78, y: 0.82, fill: TOKENS.white, color: TOKENS.navy },
  ];
  const edges = opts.edges || [
    ["root", "a"], ["root", "b"], ["root", "c"], ["a", "a1"], ["a", "a2"], ["b", "b1"], ["c", "c1"],
  ];
  const byId = new Map(nodes.map((node) => [node.id, node]));

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  surface(slide, SH, treeX, treeY, treeW, treeH, { fill: "F7FAFD", line: "E1E8F0", rectRadius: 0.04 });
  edges.forEach(([from, to]) => {
    const a = byId.get(from);
    const b = byId.get(to);
    if (!a || !b) return;
    line(
      slide,
      SH,
      treeX + a.x * treeW,
      treeY + a.y * treeH + 0.14,
      treeX + b.x * treeW,
      treeY + b.y * treeH - 0.14,
      { color: b.best ? TOKENS.success : TOKENS.guide, pt: b.best ? 1.9 : 1.05, endArrowType: "none" },
    );
  });

  nodes.forEach((node) => {
    const nodeW = node.id === "root" ? 1.32 : 0.86;
    const nodeH = node.id === "root" ? 0.56 : 0.5;
    const nx = treeX + node.x * treeW - nodeW / 2;
    const ny = treeY + node.y * treeH - nodeH / 2;
    surface(slide, SH, nx, ny, nodeW, nodeH, {
      fill: node.fill,
      line: node.best ? TOKENS.success : node.fill,
      linePt: node.best ? 2 : 1,
      rectRadius: 0.05,
    });
    text(slide, node.label, {
      x: nx + 0.08,
      y: ny + 0.09,
      w: nodeW - 0.16,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: node.id === "root" ? 8.8 : 8.2,
      bold: true,
      color: node.color,
      align: "center",
    });
    text(slide, `N=${node.visits}  V=${node.value}`, {
      x: nx + 0.08,
      y: ny + 0.29,
      w: nodeW - 0.16,
      h: 0.1,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 6.8,
      bold: true,
      color: node.color,
      align: "center",
    });
  });

  phases.forEach((phase, index) => {
    const phY = treeY + index * ((treeH - 0.12) / phases.length);
    surface(slide, SH, sideX, phY, sideW, 0.68, {
      fill: index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm,
      line: index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm,
      rectRadius: 0.04,
    });
    badge(slide, SH, sideX + 0.14, phY + 0.15, String(index + 1).padStart(2, "0"), {
      fill: phase.accent,
      w: 0.42,
      h: 0.26,
      fontSize: 7.2,
    });
    text(slide, phase.title, {
      x: sideX + 0.68,
      y: phY + 0.12,
      w: sideW - 0.84,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 10.8,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, phase.body, {
      x: sideX + 0.68,
      y: phY + 0.38,
      w: sideW - 0.84,
      h: 0.12,
      fontSize: 7.8,
      color: TOKENS.slate,
    });
  });
}

function addPolicyValueArchitecture(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.68 : 0.08;
  const rowY = y + titleH + 0.28;
  const rowH = h - titleH - 0.46;
  const columns = opts.columns || [
    { title: "Observacion", body: "11 canales\n7 x 7 casillas", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "Tokens", body: "49 casillas\n+ token CLS", accent: TOKENS.gold, fill: TOKENS.warm },
    { title: "Transformer", body: "6 capas\n8 cabezas", accent: TOKENS.navy, fill: TOKENS.softBlue },
  ];
  const gap = opts.gap || 0.18;
  const leftW = w * 0.62;
  const colW = (leftW - gap * (columns.length - 1)) / columns.length;
  const headX = x + leftW + 0.32;
  const headW = x + w - headX;

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  columns.forEach((col, index) => {
    const cx = x + 0.24 + index * (colW + gap);
    surface(slide, SH, cx, rowY, colW, rowH, { fill: col.fill, line: col.fill });
    accent(slide, SH, cx + 0.14, rowY + 0.16, rowH - 0.32, col.accent);
    text(slide, col.title, {
      x: cx + 0.34,
      y: rowY + 0.22,
      w: colW - 0.52,
      h: 0.26,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13.2,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, col.body, {
      x: cx + 0.34,
      y: rowY + 0.72,
      w: colW - 0.52,
      h: 0.48,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 9.2,
      bold: true,
      color: TOKENS.ink,
    });
    const iconY = rowY + 1.45;
    const iconW = colW - 0.72;
    if (index === 0) {
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          slide.addShape(SH.rect, {
            x: cx + 0.36 + c * (iconW / 4),
            y: iconY + r * 0.22,
            w: iconW / 4 - 0.02,
            h: 0.19,
            fill: { color: (r + c) % 2 === 0 ? TOKENS.white : "DDE8F4" },
            line: { color: "D3DDE8", pt: 0.35 },
          });
        }
      }
    } else if (index === 1) {
      for (let i = 0; i < 9; i += 1) {
        surface(slide, SH, cx + 0.36 + (i % 3) * (iconW / 3), iconY + Math.floor(i / 3) * 0.27, iconW / 3 - 0.04, 0.21, {
          fill: i === 0 ? TOKENS.navy : TOKENS.white,
          line: i === 0 ? TOKENS.navy : TOKENS.border,
          rectRadius: 0.03,
        });
      }
    } else {
      [0, 1, 2].forEach((layer) => {
        surface(slide, SH, cx + 0.4 + layer * 0.18, iconY + layer * 0.25, iconW - 0.36, 0.36, {
          fill: layer === 1 ? TOKENS.white : "DDE8F4",
          line: TOKENS.titleFill,
          rectRadius: 0.04,
        });
      });
    }
    if (index < columns.length - 1) {
      line(slide, SH, cx + colW + 0.04, rowY + rowH / 2, cx + colW + gap - 0.04, rowY + rowH / 2, {
        color: TOKENS.guide,
      });
    }
  });

  line(slide, SH, x + 0.24 + leftW - 0.18, rowY + rowH / 2, headX - 0.1, rowY + rowH / 2, {
    color: TOKENS.guide,
  });

  const heads = opts.heads || [
    { title: "Policy head", value: "793 logits", body: "elige movimiento legal", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "Value head", value: "[-1, +1]", body: "estima resultado", accent: TOKENS.success, fill: TOKENS.successSoft },
  ];
  heads.forEach((head, index) => {
    const headY = rowY + index * ((rowH - 0.16) / 2);
    surface(slide, SH, headX, headY, headW - 0.22, (rowH - 0.16) / 2, { fill: head.fill, line: head.fill });
    accent(slide, SH, headX + 0.14, headY + 0.16, (rowH - 0.16) / 2 - 0.32, head.accent);
    text(slide, head.title, {
      x: headX + 0.36,
      y: headY + 0.2,
      w: headW - 0.72,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13.5,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, head.value, {
      x: headX + 0.36,
      y: headY + 0.58,
      w: headW - 0.72,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 11.2,
      bold: true,
      color: head.accent,
    });
    text(slide, head.body, {
      x: headX + 0.36,
      y: headY + 0.94,
      w: headW - 0.72,
      h: 0.24,
      fontSize: 8.6,
      color: TOKENS.slate,
    });
  });
}

function addSelfPlayLoopPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.68 : 0.08;
  const cx = x + w / 2;
  const cy = y + titleH + (h - titleH) / 2 + 0.08;
  const rx = w * 0.34;
  const ry = (h - titleH) * 0.32;
  const steps = opts.steps || [
    { title: "Modelo actual", body: "checkpoint", accent: TOKENS.navy, fill: TOKENS.softBlue },
    { title: "Self-play", body: "partidas propias", accent: TOKENS.red, fill: TOKENS.paleRed },
    { title: "Replay buffer", body: "observacion + visitas + resultado", accent: TOKENS.gold, fill: TOKENS.warm },
    { title: "Entrenamiento", body: "policy loss + value loss", accent: TOKENS.titleFill, fill: TOKENS.mist },
    { title: "Evaluacion", body: "heuristicas + head-to-head", accent: TOKENS.success, fill: TOKENS.successSoft },
  ];

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  const positioned = steps.map((step, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / steps.length;
    return {
      ...step,
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
    };
  });

  const arrowMarkers = [
    { x: cx + rx * 0.54, y: cy - ry * 0.62, rotate: 42 },
    { x: cx + rx * 0.62, y: cy + ry * 0.5, rotate: 118 },
    { x: cx - rx * 0.18, y: cy + ry * 0.86, rotate: 192 },
    { x: cx - rx * 0.72, y: cy - ry * 0.05, rotate: 265 },
    { x: cx - rx * 0.18, y: cy - ry * 0.82, rotate: 330 },
  ];
  arrowMarkers.forEach((marker) => {
    slide.addShape(SH.triangle, {
      x: marker.x - 0.08,
      y: marker.y - 0.08,
      w: 0.16,
      h: 0.16,
      rotate: marker.rotate,
      fill: { color: TOKENS.guide, transparency: 12 },
      line: { color: TOKENS.guide, transparency: 100 },
    });
  });

  positioned.forEach((step, index) => {
    const cardW = index === 2 ? 2.1 : 1.78;
    const cardH = 0.72;
    surface(slide, SH, step.x - cardW / 2, step.y - cardH / 2, cardW, cardH, {
      fill: step.fill,
      line: step.fill,
      rectRadius: 0.05,
    });
    badge(slide, SH, step.x - cardW / 2 + 0.12, step.y - cardH / 2 + 0.14, String(index + 1), {
      fill: step.accent,
      w: 0.3,
      h: 0.24,
      fontSize: 7,
    });
    text(slide, step.title, {
      x: step.x - cardW / 2 + 0.52,
      y: step.y - cardH / 2 + 0.13,
      w: cardW - 0.66,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 9.5,
      bold: true,
      color: TOKENS.navy,
    });
    text(slide, step.body, {
      x: step.x - cardW / 2 + 0.52,
      y: step.y - cardH / 2 + 0.4,
      w: cardW - 0.66,
      h: 0.12,
      fontSize: 7.3,
      color: TOKENS.slate,
    });
  });

  surface(slide, SH, cx - 1.35, cy - 0.45, 2.7, 0.9, {
    fill: opts.centerFill || TOKENS.navy,
    line: opts.centerFill || TOKENS.navy,
    rectRadius: 0.05,
  });
  text(slide, opts.centerTitle || "mejorar sin copiar humanos", {
    x: cx - 1.15,
    y: cy - 0.25,
    w: 2.3,
    h: 0.18,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11.4,
    bold: true,
    color: TOKENS.white,
    align: "center",
  });
  text(slide, opts.centerBody || "la calidad depende de datos, rivales y evaluacion", {
    x: cx - 1.15,
    y: cy + 0.08,
    w: 2.3,
    h: 0.14,
    fontSize: 7.8,
    color: TOKENS.terminalOutput,
    align: "center",
  });
}

function addModelGenerationTable(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.68 : 0.08;
  const rows = opts.rows || [
    { name: "bogo", version: "v1", score: "0.17", lesson: "oscila piezas", state: "fallo", accent: TOKENS.guide },
    { name: "reflejo", version: "v2", score: "0.29", lesson: "bias de desempate", state: "bug", accent: TOKENS.gold },
    { name: "centinela", version: "v6", score: "0.81", lesson: "overfit a sentinel", state: "alerta", accent: TOKENS.red },
    { name: "amnesia", version: "v7", score: "0.75", lesson: "bootstrap sin contexto", state: "regresion", accent: TOKENS.titleFill },
    { name: "liga", version: "v8", score: "0.94", lesson: "league system", state: "campeon", accent: TOKENS.success },
    { name: "espejismo", version: "v9", score: "0.69", lesson: "curriculum drift", state: "advertencia", accent: TOKENS.red },
  ];
  const tableY = y + titleH + 0.14;
  const rowGap = 0.07;
  const headerH = 0.38;
  const rowH = Math.min(0.48, (h - titleH - 0.26 - headerH - rowGap * rows.length) / rows.length);
  const col = {
    name: w * 0.18,
    version: w * 0.1,
    score: w * 0.14,
    state: w * 0.2,
    lesson: w * 0.32,
  };

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  surface(slide, SH, x + 0.22, tableY, w - 0.44, headerH, { fill: TOKENS.navy, line: TOKENS.navy, rectRadius: 0.04 });
  const headers = [
    ["generacion", col.name],
    ["ver.", col.version],
    ["rr", col.score],
    ["estado", col.state],
    ["leccion tecnica", col.lesson],
  ];
  let cursor = x + 0.36;
  headers.forEach(([label, width]) => {
    text(slide, label, {
      x: cursor,
      y: tableY + 0.12,
      w: width - 0.08,
      h: 0.1,
      fontSize: 7.6,
      bold: true,
      color: TOKENS.white,
      align: label === "rr" ? "center" : "left",
    });
    cursor += width;
  });

  rows.slice(0, 8).forEach((row, index) => {
    const rowY = tableY + headerH + rowGap + index * (rowH + rowGap);
    surface(slide, SH, x + 0.22, rowY, w - 0.44, rowH, {
      fill: index % 2 === 0 ? "F7FAFD" : TOKENS.softNeutral,
      line: index % 2 === 0 ? "F7FAFD" : TOKENS.softNeutral,
      rectRadius: 0.035,
    });
    accent(slide, SH, x + 0.34, rowY + 0.09, rowH - 0.18, row.accent, 0.08);
    let cx = x + 0.5;
    text(slide, row.name, {
      x: cx,
      y: rowY + rowH * 0.28,
      w: col.name - 0.14,
      h: 0.1,
      fontFace: TYPOGRAPHY.mono || "Aptos Mono",
      fontSize: 8.6,
      bold: true,
      color: TOKENS.navy,
    });
    cx += col.name;
    text(slide, row.version, {
      x: cx,
      y: rowY + rowH * 0.28,
      w: col.version - 0.1,
      h: 0.1,
      fontSize: 8.4,
      bold: true,
      color: TOKENS.slate,
    });
    cx += col.version;
    text(slide, row.score, {
      x: cx,
      y: rowY + rowH * 0.25,
      w: col.score - 0.12,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: 9.4,
      bold: true,
      color: row.accent,
      align: "center",
    });
    cx += col.score;
    surface(slide, SH, cx + 0.02, rowY + rowH * 0.2, col.state - 0.22, rowH * 0.55, {
      fill: row.accent,
      line: row.accent,
      rectRadius: 0.04,
    });
    text(slide, row.state, {
      x: cx + 0.08,
      y: rowY + rowH * 0.35,
      w: col.state - 0.34,
      h: 0.08,
      fontSize: 6.9,
      bold: true,
      color: row.accent === TOKENS.gold || row.accent === TOKENS.guide ? TOKENS.navy : TOKENS.white,
      align: "center",
    });
    cx += col.state;
    text(slide, row.lesson, {
      x: cx,
      y: rowY + rowH * 0.24,
      w: col.lesson - 0.18,
      h: 0.14,
      fontSize: 8,
      color: TOKENS.ink,
    });
  });
}

function addTournamentRulesPanel(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const titleH = opts.title ? 0.72 : 0.08;
  const leftW = w * 0.46;
  const rightX = x + leftW + 0.28;
  const rightW = w - leftW - 0.28;
  const contentY = y + titleH + 0.12;
  const contentH = h - titleH - 0.22;
  const rules = opts.rules || [
    { label: "Formato", value: "2 rondas Bo3" },
    { label: "Modelo", value: "liga + 400 sims" },
    { label: "Puntaje", value: "V 1 / E 0.5 / D 0" },
    { label: "Ranking", value: "puntos, victorias, dif. piezas" },
  ];
  const bonuses = opts.bonuses || [
    { place: "1", value: "+1.0", fill: TOKENS.success },
    { place: "2", value: "+0.5", fill: TOKENS.gold },
    { place: "3", value: "+0.3", fill: TOKENS.titleFill },
  ];

  surface(slide, SH, x, y, w, h, { fill: opts.fill || TOKENS.white, line: opts.line || TOKENS.border });
  if (opts.title) {
    panelTitle(slide, x + 0.24, y + 0.14, w - 0.48, opts.title, opts.subtitle, {
      titleFontSize: opts.titleFontSize || 13.8,
      subtitleFontSize: opts.subtitleFontSize || 8.8,
    });
  }

  surface(slide, SH, x + 0.24, contentY, leftW - 0.24, contentH, {
    fill: TOKENS.navy,
    line: TOKENS.navy,
    rectRadius: 0.05,
  });
  text(slide, opts.eventTitle || "Torneo Humanos vs IA", {
    x: x + 0.48,
    y: contentY + 0.28,
    w: leftW - 0.72,
    h: 0.44,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: TOKENS.white,
    fit: "shrink",
  });
  text(slide, opts.eventBody || "La partida no es solo competencia: es una prueba publica del sistema, sus reglas y sus metricas.", {
    x: x + 0.48,
    y: contentY + 1.08,
    w: leftW - 0.72,
    h: 0.72,
    fontSize: 10.2,
    color: TOKENS.terminalOutput,
    valign: "mid",
  });
  bonuses.forEach((bonus, index) => {
    const bx = x + 0.5 + index * ((leftW - 0.94) / 3);
    const bw = (leftW - 1.1) / 3;
    surface(slide, SH, bx, contentY + contentH - 0.92, bw, 0.56, {
      fill: bonus.fill,
      line: bonus.fill,
      rectRadius: 0.05,
    });
    text(slide, `${bonus.place}. lugar`, {
      x: bx + 0.08,
      y: contentY + contentH - 0.78,
      w: bw - 0.16,
      h: 0.1,
      fontSize: 6.8,
      bold: true,
      color: bonus.fill === TOKENS.gold ? TOKENS.navy : TOKENS.white,
      align: "center",
    });
    text(slide, bonus.value, {
      x: bx + 0.08,
      y: contentY + contentH - 0.58,
      w: bw - 0.16,
      h: 0.14,
      fontFace: TYPOGRAPHY.display,
      fontSize: 12,
      bold: true,
      color: bonus.fill === TOKENS.gold ? TOKENS.navy : TOKENS.white,
      align: "center",
    });
  });

  rules.forEach((rule, index) => {
    const rh = Math.min(0.68, (contentH - 0.18) / rules.length - 0.08);
    const ry = contentY + 0.04 + index * (rh + 0.14);
    surface(slide, SH, rightX, ry, rightW - 0.24, rh, {
      fill: index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm,
      line: index % 2 === 0 ? TOKENS.softBlue : TOKENS.warm,
      rectRadius: 0.04,
    });
    badge(slide, SH, rightX + 0.16, ry + 0.18, String(index + 1).padStart(2, "0"), {
      fill: index === 0 ? TOKENS.red : TOKENS.navy,
      w: 0.42,
      h: 0.25,
      fontSize: 7.2,
    });
    text(slide, rule.label, {
      x: rightX + 0.72,
      y: ry + 0.13,
      w: 1.24,
      h: 0.14,
      fontSize: 8,
      bold: true,
      color: TOKENS.slate,
    });
    text(slide, rule.value, {
      x: rightX + 2.08,
      y: ry + 0.12,
      w: rightW - 2.48,
      h: 0.16,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11.5,
      bold: true,
      color: TOKENS.navy,
      align: "right",
    });
  });
}

module.exports = {
  addAtaxxBoardState,
  addMoveAnatomyPanel,
  addMctsSearchPanel,
  addPolicyValueArchitecture,
  addSelfPlayLoopPanel,
  addModelGenerationTable,
  addTournamentRulesPanel,
};
