const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

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

function addLabelPill(slide, SH, x, y, w, text, opts = {}) {
  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h: opts.h || 0.24,
    rectRadius: 0.04,
    fill: { color: opts.fill || TOKENS.warm },
    line: { color: opts.fill || TOKENS.warm },
  });
  slide.addText(text, {
    x,
    y: y + 0.05,
    w,
    h: (opts.h || 0.24) - 0.08,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.fontSize || 8.2,
    bold: true,
    color: opts.color || TOKENS.slate,
    margin: 0,
    align: "center",
  });
}

function addAgenticFlow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const steps = opts.steps || [
    { step: "1", title: "Intencion", body: "Que debe lograrse y para quien.", accent: TOKENS.red },
    { step: "2", title: "Contexto", body: "Restricciones, archivos y entorno real.", accent: TOKENS.gold },
    { step: "3", title: "Agente", body: "Propone, ejecuta o acelera tareas acotadas.", accent: TOKENS.titleFill },
    { step: "4", title: "Validacion", body: "Pruebas, lectura, inspeccion y decision.", accent: TOKENS.red },
  ];
  const compact = Boolean(opts.compact || w < 8.6 || steps.length > 4);
  const footerH = opts.footer ? 0.28 : 0;
  const innerY = y + 0.62;
  const innerH = h - 0.84 - footerH;
  const cols = compact ? 2 : steps.length;
  const rows = compact ? Math.ceil(steps.length / 2) : 1;
  const gapX = compact ? 0.22 : 0.18;
  const gapY = 0.22;
  const cellW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cellH = (innerH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Flujo de trabajo con agentes", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  steps.forEach((entry, index) => {
    const col = compact ? index % cols : index;
    const row = compact ? Math.floor(index / cols) : 0;
    const cellX = x + 0.16 + col * (cellW + gapX);
    const cellY = innerY + row * (cellH + gapY);
    const accent = entry.accent || TOKENS.red;
    const fill = entry.fill || TOKENS.white;
    const tone = entry.tone || "light";
    const titleColor = tone === "dark" ? TOKENS.white : TOKENS.navy;
    const bodyColor = tone === "dark" ? "E7EEF8" : TOKENS.ink;

    addSurface(slide, SH, cellX, cellY, cellW, cellH, {
      fill,
      line: fill === TOKENS.white ? TOKENS.border : fill,
    });
    slide.addShape(SH.rect, {
      x: cellX + 0.1,
      y: cellY + 0.14,
      w: 0.1,
      h: cellH - 0.28,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addShape(SH.roundRect, {
      x: cellX + 0.26,
      y: cellY + 0.14,
      w: 0.34,
      h: 0.24,
      rectRadius: 0.05,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(entry.step || String(index + 1), {
      x: cellX + 0.26,
      y: cellY + 0.19,
      w: 0.34,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.6,
      bold: true,
      color: TOKENS.white,
      margin: 0,
      align: "center",
    });
    slide.addText(entry.title || "", {
      x: cellX + 0.68,
      y: cellY + 0.14,
      w: cellW - 0.82,
      h: 0.2,
      fontFace: TYPOGRAPHY.display,
      fontSize: compact ? 13.6 : 14.2,
      bold: true,
      color: titleColor,
      margin: 0,
    });
    slide.addText(entry.body || "", {
      x: cellX + 0.26,
      y: cellY + 0.52,
      w: cellW - 0.38,
      h: Math.max(0.38, cellH - 0.66),
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 10.1 : 10.4,
      color: bodyColor,
      margin: 0,
      valign: "mid",
    });

    if (!compact && index < steps.length - 1) {
      slide.addShape(SH.chevron, {
        x: cellX + cellW + 0.04,
        y: cellY + cellH / 2 - 0.12,
        w: 0.1,
        h: 0.24,
        fill: { color: opts.chevronColor || TOKENS.gold },
        line: { color: opts.chevronColor || TOKENS.gold },
      });
    }
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.44,
      w: w - 0.44,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.34,
      y: y + h - 0.39,
      w: w - 0.68,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }
}

function addSpecWorkflow(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const phases = opts.phases || [
    {
      step: "1",
      title: "Spec",
      question: "Que debe lograrse?",
      artifact: "Requisitos, historias y restricciones.",
      control: "Claridad funcional.",
      accent: TOKENS.red,
      fill: TOKENS.paleRed,
    },
    {
      step: "2",
      title: "Plan",
      question: "Como se construira?",
      artifact: "Arquitectura, stack y limites.",
      control: "Consistencia tecnica.",
      accent: TOKENS.titleFill,
      fill: TOKENS.softBlue,
    },
    {
      step: "3",
      title: "Tasks",
      question: "En que orden?",
      artifact: "Tareas pequenas y testeables.",
      control: "Aislamiento y trazabilidad.",
      accent: TOKENS.gold,
      fill: TOKENS.warm,
    },
    {
      step: "4",
      title: "Implement",
      question: "Que cambia en el sistema?",
      artifact: "Codigo, pruebas y evidencia.",
      control: "Resultado verificable.",
      accent: TOKENS.red,
      fill: TOKENS.white,
    },
  ];
  const compact = Boolean(opts.compact || w < 8.8);
  const cols = compact ? 2 : Math.min(4, phases.length);
  const rows = compact ? Math.ceil(phases.length / 2) : 1;
  const gapX = 0.22;
  const gapY = 0.2;
  const footerH = opts.footer ? 0.28 : 0;
  const bodyY = y + 0.62;
  const bodyH = h - 0.84 - footerH;
  const cardW = (w - 0.32 - gapX * (cols - 1)) / cols;
  const cardH = (bodyH - gapY * (rows - 1)) / rows;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Spec-driven workflow", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  phases.forEach((phase, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cardX = x + 0.16 + col * (cardW + gapX);
    const cardY = bodyY + row * (cardH + gapY);
    const accent = phase.accent || TOKENS.red;

    addSurface(slide, SH, cardX, cardY, cardW, cardH, {
      fill: phase.fill || TOKENS.white,
      line: TOKENS.border,
    });
    addLabelPill(slide, SH, cardX + 0.12, cardY + 0.14, 0.42, phase.step || String(index + 1), {
      fill: accent,
      color: TOKENS.white,
    });
    slide.addText(phase.title || "", {
      x: cardX + 0.64,
      y: cardY + 0.14,
      w: cardW - 0.76,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addShape(SH.rect, {
      x: cardX + 0.12,
      y: cardY + 0.48,
      w: 0.08,
      h: cardH - 0.62,
      fill: { color: accent },
      line: { color: accent },
    });

    const textX = cardX + 0.28;
    const textW = cardW - 0.4;
    slide.addText("Pregunta guia", {
      x: textX,
      y: cardY + 0.5,
      w: textW,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
    });
    slide.addText(phase.question || "", {
      x: textX,
      y: cardY + 0.66,
      w: textW,
      h: 0.28,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 9.4 : 9.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
    slide.addText("Artefacto", {
      x: textX,
      y: cardY + 1.04,
      w: textW,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
    });
    slide.addText(phase.artifact || "", {
      x: textX,
      y: cardY + 1.2,
      w: textW,
      h: 0.34,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 8.9 : 9.2,
      color: TOKENS.ink,
      margin: 0,
    });
    slide.addText("Control", {
      x: textX,
      y: cardY + cardH - 0.62,
      w: textW,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
    });
    slide.addText(phase.control || "", {
      x: textX,
      y: cardY + cardH - 0.46,
      w: textW,
      h: 0.22,
      fontFace: TYPOGRAPHY.body,
      fontSize: compact ? 8.8 : 9,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.22,
      y: y + h - 0.22,
      w: w - 0.44,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      color: TOKENS.slate,
      margin: 0,
      align: "center",
    });
  }
}

function addDelegationSplit(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const left = opts.left || {};
  const right = opts.right || {};
  const footerH = opts.footer ? 0.28 : 0;
  const gap = opts.gap || 0.2;
  const bridgeW = opts.bridgeW || 1.48;
  const colW = (w - 0.32 - gap * 2 - bridgeW) / 2;
  const innerY = y + 0.62;
  const innerH = h - 0.84 - footerH;
  const leftX = x + 0.16;
  const bridgeX = leftX + colW + gap;
  const rightX = bridgeX + bridgeW + gap;

  addSurface(slide, SH, x, y, w, h, {
    fill: opts.fill || TOKENS.white,
    line: opts.line || TOKENS.border,
  });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Ayuda posible vs validacion obligatoria", {
    fill: opts.headerFill || TOKENS.softNeutral,
  });

  function drawColumn(colX, entries, title, subtitle, accent, fill, dark) {
    addSurface(slide, SH, colX, innerY, colW, innerH, {
      fill,
      line: fill === TOKENS.white ? TOKENS.border : fill,
    });
    slide.addShape(SH.rect, {
      x: colX + 0.12,
      y: innerY + 0.14,
      w: 0.12,
      h: innerH - 0.28,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(title, {
      x: colX + 0.34,
      y: innerY + 0.14,
      w: colW - 0.48,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: 15,
      bold: true,
      color: dark ? TOKENS.white : TOKENS.navy,
      margin: 0,
    });
    if (subtitle) {
      slide.addText(subtitle, {
        x: colX + 0.34,
        y: innerY + 0.44,
        w: colW - 0.48,
        h: 0.24,
        fontFace: TYPOGRAPHY.body,
        fontSize: 9.4,
        color: dark ? "DCE6F2" : TOKENS.slate,
        margin: 0,
      });
    }
    const rows = entries || [];
    const listY = innerY + 0.82;
    const rowGap = rows.length >= 4 ? 0.1 : 0.14;
    const availableListH = innerH - (listY - innerY) - 0.12;
    const rowH = Math.max(
      0.22,
      Math.min(0.34, (availableListH - rowGap * Math.max(0, rows.length - 1)) / Math.max(rows.length, 1))
    );
    rows.forEach((item, idx) => {
      const itemY = listY + idx * (rowH + rowGap);
      slide.addShape(SH.roundRect, {
        x: colX + 0.34,
        y: itemY,
        w: colW - 0.5,
        h: rowH,
        rectRadius: 0.04,
        fill: { color: dark ? "173A5A" : TOKENS.white },
        line: { color: dark ? "173A5A" : TOKENS.border, pt: 0.8 },
      });
      slide.addShape(SH.ellipse, {
        x: colX + 0.44,
        y: itemY + rowH / 2 - 0.045,
        w: 0.09,
        h: 0.09,
        fill: { color: accent },
        line: { color: accent },
      });
      slide.addText(item, {
        x: colX + 0.6,
        y: itemY + 0.05,
        w: colW - 0.82,
        h: rowH - 0.08,
        fontFace: TYPOGRAPHY.body,
        fontSize: 8.5,
        color: dark ? TOKENS.white : TOKENS.ink,
        margin: 0,
        valign: "mid",
      });
    });
  }

  drawColumn(
    leftX,
    left.items || ["Explorar opciones", "Pedir una primera version", "Detectar repeticion"],
    left.title || "El agente puede ayudar con",
    left.subtitle || "apoyo rapido y trabajo repetitivo",
    left.accent || TOKENS.titleFill,
    left.fill || TOKENS.softBlue,
    Boolean(left.dark)
  );
  drawColumn(
    rightX,
    right.items || ["Leer el resultado real", "Validar en herramientas", "Decidir que se integra"],
    right.title || "No conviene delegar",
    right.subtitle || "criterio, lectura y validacion final",
    right.accent || TOKENS.red,
    right.fill || TOKENS.white,
    Boolean(right.dark)
  );

  const bridgeOuterX = bridgeX + 0.08;
  const bridgeOuterW = bridgeW - 0.16;
  const bridgeOuterH = opts.bridgeOuterH || 1.78;
  const bridgeOuterY = innerY + innerH / 2 - bridgeOuterH / 2;
  const bridgeLabelH = 0.3;
  const bridgeBodyH = 0.4;

  slide.addShape(SH.roundRect, {
    x: bridgeOuterX,
    y: bridgeOuterY,
    w: bridgeOuterW,
    h: bridgeOuterH,
    rectRadius: 0.06,
    fill: { color: opts.bridgeFill || TOKENS.warm },
    line: { color: opts.bridgeFill || TOKENS.warm },
  });
  slide.addShape(SH.roundRect, {
    x: bridgeOuterX + 0.12,
    y: bridgeOuterY + 0.16,
    w: bridgeOuterW - 0.24,
    h: bridgeLabelH,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.white },
  });
  slide.addShape(SH.chevron, {
    x: bridgeOuterX + 0.2,
    y: bridgeOuterY + 0.62,
    w: bridgeOuterW - 0.4,
    h: 0.18,
    fill: { color: opts.bridgeAccent || TOKENS.gold },
    line: { color: opts.bridgeAccent || TOKENS.gold },
  });
  slide.addText(opts.bridgeLabel || "Flujo sano", {
    x: bridgeOuterX + 0.18,
    y: bridgeOuterY + 0.21,
    w: bridgeOuterW - 0.36,
    h: bridgeLabelH - 0.08,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.bridgeLabelFontSize || 10.6,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
    align: "center",
    fit: "shrink",
  });
  slide.addText(opts.bridgeBody || "Intentar, leer y decidir con evidencia.", {
    x: bridgeOuterX + 0.14,
    y: bridgeOuterY + 1.07,
    w: bridgeOuterW - 0.28,
    h: bridgeBodyH,
    fontFace: TYPOGRAPHY.body,
    fontSize: opts.bridgeBodyFontSize || 7.2,
    color: TOKENS.slate,
    margin: 0,
    align: "center",
    valign: "mid",
    fit: "shrink",
  });

  if (opts.footer) {
    slide.addShape(SH.roundRect, {
      x: x + 0.22,
      y: y + h - 0.44,
      w: w - 0.44,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: TOKENS.warm },
      line: { color: TOKENS.warm },
    });
    slide.addText(opts.footer, {
      x: x + 0.34,
      y: y + h - 0.39,
      w: w - 0.68,
      h: 0.1,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      align: "center",
    });
  }
}

function addAgentOrchestrationDiagram(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.54;

  addSurface(slide, SH, x, y, w, h, { fill: TOKENS.navy, line: TOKENS.navy });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Orquestacion del Ecosistema Agentico", {
    fill: "173A5A", color: TOKENS.white
  });

  const centerX = x + w / 2;
  const centerY = y + h / 2 + 0.45; // Centro bajado para alejar del header

  // Nodo Central: Agente (Mas pequeño)
  slide.addShape(SH.ellipse, {
    x: centerX - 0.6, y: centerY - 0.6, w: 1.2, h: 1.2,
    fill: { color: TOKENS.red }, line: { color: TOKENS.white, pt: 2 }
  });
  slide.addText("AGENTE", {
    x: centerX - 0.6, y: centerY - 0.2, w: 1.2, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 11, bold: true, color: TOKENS.white, align: "center"
  });

  const nodes = [
    { t: "MEMORIA", b: ".md / Contexto", icon: "🧠", ang: 210, color: TOKENS.gold },
    { t: "MCPs", b: "Filesystem / DB", icon: "🛠️", ang: 330, color: TOKENS.softBlue },
    { t: "SUB-AGENTES", b: "Especialistas", icon: "🤖", ang: 90, color: TOKENS.red },
  ];

  const dist = 1.7; // Distancia muy reducida para máxima seguridad
  nodes.forEach(n => {
    const rad = (n.ang * Math.PI) / 180;
    const nx = centerX + dist * Math.cos(rad) - 0.8;
    const ny = centerY - dist * Math.sin(rad) - 0.45;

    // Linea de conexion (Calculo de dimensiones y orientacion correcta)
    const lineW = dist * Math.cos(rad);
    const lineH = -dist * Math.sin(rad);
    
    slide.addShape(SH.line, {
      x: lineW < 0 ? centerX + lineW : centerX,
      y: lineH < 0 ? centerY + lineH : centerY,
      w: Math.abs(lineW),
      h: Math.abs(lineH),
      flipH: lineW * lineH < 0, // Voltear horizontalmente si los signos son opuestos
      line: { color: TOKENS.white, pt: 1.0, dashType: "dash" }
    });

    // Nodo Satelite (Mas pequeño y compacto)
    addSurface(slide, SH, nx, ny, 1.6, 0.9, { fill: "173A5A", line: n.color });
    slide.addText(n.icon, { x: nx, y: ny + 0.05, w: 1.6, h: 0.3, fontSize: 16, align: "center" });
    slide.addText(n.t, {
      x: nx, y: ny + 0.35, w: 1.6, h: 0.2,
      fontFace: TYPOGRAPHY.display, fontSize: 9, bold: true, color: TOKENS.white, align: "center"
    });
    slide.addText(n.b, {
      x: nx, y: ny + 0.55, w: 1.6, h: 0.2,
      fontFace: TYPOGRAPHY.body, fontSize: 7.5, color: "A8C4E0", align: "center"
    });
  });
}

function addMcpBridgePanel(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.54;

  addSurface(slide, SH, x, y, w, h, { fill: TOKENS.white, line: TOKENS.border });
  
  const midX = x + w / 2;
  const panelY = y + 1.0; 
  const panelH = h - 1.6;
  const panelW = w / 2 - 1.4; // Reducido para evitar solapamiento con el puente (1.4 de gap total)
  
  // Lado Izquierdo: Mundo del Lenguaje
  slide.addText("Mundo del Lenguaje", {
    x: x + 0.2, y: y + 0.3, w: w / 2 - 0.4, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 14, bold: true, color: TOKENS.navy, align: "center"
  });
  slide.addShape(SH.rect, {
    x: x + 0.4, y: panelY, w: panelW, h: panelH,
    fill: { color: TOKENS.softBlue }, line: { color: TOKENS.navy, pt: 1 }
  });
  slide.addText("RAZONAMIENTO\nTokens, Patrones", {
    x: x + 0.4, y: panelY + 0.2, w: panelW, h: panelH - 0.4,
    fontFace: TYPOGRAPHY.body, fontSize: 11, color: TOKENS.navy, align: "center", valign: "mid"
  });

  // Lado Derecho: Mundo Fisico
  slide.addText("Mundo Fisico", {
    x: midX + 0.2, y: y + 0.3, w: w / 2 - 0.4, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 14, bold: true, color: TOKENS.red, align: "center"
  });
  slide.addShape(SH.rect, {
    x: midX + 1.0, y: panelY, w: panelW, h: panelH,
    fill: { color: TOKENS.paleRed }, line: { color: TOKENS.red, pt: 1 }
  });
  slide.addText("ACCION REAL\nTerminal, SQL", {
    x: midX + 1.0, y: panelY + 0.2, w: panelW, h: panelH - 0.4,
    fontFace: TYPOGRAPHY.body, fontSize: 11, color: TOKENS.red, align: "center", valign: "mid"
  });

  // El Puente MCP (Mas pequeño)
  slide.addShape(SH.roundRect, {
    x: midX - 0.7, y: y + h / 2 - 0.2, w: 1.4, h: 0.6,
    rectRadius: 0.2, fill: { color: TOKENS.gold }, line: { color: TOKENS.navy, pt: 1.5 }
  });
  slide.addText("MCP", {
    x: midX - 0.7, y: y + h / 2 - 0.1, w: 1.4, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 12, bold: true, color: TOKENS.navy, align: "center"
  });
}

function addToolExecutionConsole(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.54;

  // Carcasa de la consola
  addSurface(slide, SH, x, y, w, h, { fill: "1E1E1E", line: "333333" });
  
  // Botones de control (estilo Mac)
  const btnColors = ["FF5F56", "FFBD2E", "27C93F"];
  btnColors.forEach((color, i) => {
    slide.addShape(SH.ellipse, {
      x: x + 0.2 + i * 0.25, y: y + 0.15, w: 0.15, h: 0.15,
      fill: { color }, line: { color }
    });
  });

  slide.addText(opts.command || "> /execute_tool", {
    x: x + 0.2, y: y + 0.5, w: w - 0.4, h: 0.4,
    fontFace: "Consolas", fontSize: 14, color: "27C93F", bold: true
  });

  const params = opts.params || { target: "src/api.py", action: "refactor" };
  let paramStr = JSON.stringify(params, null, 2);
  
  slide.addText("Arguments:", {
    x: x + 0.4, y: y + 1.0, w: w - 0.8, h: 0.3,
    fontFace: "Consolas", fontSize: 11, color: "A8C4E0"
  });
  
  slide.addText(paramStr, {
    x: x + 0.4, y: y + 1.3, w: w - 0.8, h: 1.2,
    fontFace: "Consolas", fontSize: 10, color: TOKENS.white
  });

  slide.addShape(SH.line, {
    x: x + 0.4, y: y + 2.6, w: w - 0.8, h: 0,
    line: { color: "333333", pt: 1 }
  });

  slide.addText("Result:", {
    x: x + 0.4, y: y + 2.8, w: w - 0.8, h: 0.3,
    fontFace: "Consolas", fontSize: 11, color: "27C93F"
  });

  slide.addText(opts.result || "Success: File modified surgically.", {
    x: x + 0.4, y: y + 3.1, w: w - 0.8, h: 1.0,
    fontFace: "Consolas", fontSize: 10, color: "DCE6F2"
  });
}

function addValidationLayerRadar(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.54;

  addSurface(slide, SH, x, y, w, h, { fill: TOKENS.softNeutral, line: TOKENS.border });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Monitor de Validacion de 4 Capas");

  const layers = opts.layers || [
    { name: "TIPOS", status: "OK", desc: "Pydantic & Python 3.12", color: "27C93F" },
    { name: "LOGICA", status: "OK", desc: "Reglas de Negocio", color: "27C93F" },
    { name: "SEGURIDAD", status: "WARN", desc: "Secret Detectado", color: "FFBD2E" },
    { name: "ESTANDAR", status: "FAIL", desc: "Snake Case Violado", color: "FF5F56" },
  ];

  layers.forEach((l, i) => {
    const lx = x + 0.2;
    const ly = y + 0.8 + i * 0.9;
    const lw = w - 0.4;
    const lh = 0.7;

    addSurface(slide, SH, lx, ly, lw, lh, { fill: TOKENS.white, line: TOKENS.border });
    
    // Status Indicator
    slide.addShape(SH.ellipse, {
      x: lx + 0.2, y: ly + 0.2, w: 0.3, h: 0.3,
      fill: { color: l.color }, line: { color: l.color }
    });

    slide.addText(l.name, {
      x: lx + 0.7, y: ly + 0.15, w: 2.0, h: 0.4,
      fontFace: TYPOGRAPHY.display, fontSize: 14, bold: true, color: TOKENS.navy
    });

    slide.addText(l.status, {
      x: lx + lw - 1.2, y: ly + 0.15, w: 1.0, h: 0.4,
      fontFace: TYPOGRAPHY.display, fontSize: 14, bold: true, color: l.color, align: "right"
    });

    slide.addText(l.desc, {
      x: lx + 0.7, y: ly + 0.45, w: lw - 1.0, h: 0.2,
      fontFace: TYPOGRAPHY.body, fontSize: 9, color: TOKENS.slate
    });
  });
}

function addAgentReasoningLoop(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.54;

  addSurface(slide, SH, x, y, w, h, { fill: TOKENS.white, line: TOKENS.border });
  addSurfaceHeader(slide, SH, x + 0.14, y + 0.14, w - 0.28, opts.title || "Ciclo de Razonamiento Autonomo (ReAct)");

  const centerX = x + w / 2;
  const centerY = y + h / 2 + 0.2;
  const radius = 1.4;

  const steps = [
    { t: "PENSAR", b: "Analiza el objetivo y el contexto.", ang: 90, color: TOKENS.navy, icon: "💭" },
    { t: "ACTUAR", b: "Ejecuta una Tool (Read, Write, Terminal).", ang: 330, color: TOKENS.red, icon: "🛠️" },
    { t: "OBSERVAR", b: "Lee el resultado del sistema.", ang: 210, color: TOKENS.gold, icon: "👁️" },
  ];

  steps.forEach((s, i) => {
    const rad = (s.ang * Math.PI) / 180;
    const sx = centerX + radius * Math.cos(rad) - 1.0;
    const sy = centerY - radius * Math.sin(rad) - 0.6;

    // Nodo de paso
    addSurface(slide, SH, sx, sy, 2.0, 1.2, { fill: TOKENS.white, line: s.color });
    slide.addText(s.icon, { x: sx, y: sy + 0.1, w: 2.0, h: 0.4, fontSize: 20, align: "center" });
    slide.addText(s.t, {
      x: sx, y: sy + 0.5, w: 2.0, h: 0.3,
      fontFace: TYPOGRAPHY.display, fontSize: 12, bold: true, color: s.color, align: "center"
    });
    slide.addText(s.b, {
      x: sx, y: sy + 0.8, w: 2.0, h: 0.25,
      fontFace: TYPOGRAPHY.body, fontSize: 8.5, color: TOKENS.slate, align: "center"
    });

    // Flechas de ciclo corregidas (3 flechas para 3 estados)
    const nextStep = steps[(i + 1) % steps.length];
    const midAngle = (s.ang + (s.ang > nextStep.ang ? nextStep.ang : nextStep.ang - 360)) / 2;
    const radArrow = (midAngle * Math.PI) / 180;
    
    const fx = centerX + (radius * 1.1) * Math.cos(radArrow);
    const fy = centerY - (radius * 1.1) * Math.sin(radArrow);
    
    slide.addShape(SH.rightArrow, {
      x: fx - 0.15, y: fy - 0.15, w: 0.3, h: 0.3,
      rotate: 360 - midAngle + 90,
      fill: { color: TOKENS.softNeutral }, line: { color: TOKENS.border, pt: 1 }
    });
  });

  slide.addText("REPETIR HASTA CUMPLIR EL OBJETIVO", {
    x: centerX - 1.5, y: centerY - 0.35, w: 3.0, h: 0.3,
    fontFace: TYPOGRAPHY.body, fontSize: 9, bold: true, color: TOKENS.red, align: "center"
  });
}

module.exports = {
  addAgenticFlow,
  addSpecWorkflow,
  addDelegationSplit,
  addAgentOrchestrationDiagram,
  addMcpBridgePanel,
  addToolExecutionConsole,
  addValidationLayerRadar,
  addAgentReasoningLoop,
};
