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

function asSvgColor(color) {
  const value = String(color || TOKENS.navy).trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function joinTypeCopy(type, leftLabel, rightLabel) {
  const copy = {
    inner: {
      badge: "INNER JOIN",
      result: "Solo filas con coincidencia en ambas tablas.",
      formula: `${leftLabel} ∩ ${rightLabel}`,
    },
    left: {
      badge: "LEFT JOIN",
      result: `Todo ${leftLabel} y las coincidencias de ${rightLabel}.`,
      formula: `${leftLabel} completo`,
    },
    right: {
      badge: "RIGHT JOIN",
      result: `Todo ${rightLabel} y las coincidencias de ${leftLabel}.`,
      formula: `${rightLabel} completo`,
    },
    full: {
      badge: "FULL JOIN",
      result: "Todas las filas de ambos lados, coincidan o no.",
      formula: `${leftLabel} ∪ ${rightLabel}`,
    },
    leftOnly: {
      badge: "LEFT ANTI",
      result: `${leftLabel} sin coincidencia en ${rightLabel}.`,
      formula: `${leftLabel} - ${rightLabel}`,
    },
    rightOnly: {
      badge: "RIGHT ANTI",
      result: `${rightLabel} sin coincidencia en ${leftLabel}.`,
      formula: `${rightLabel} - ${leftLabel}`,
    },
  };

  return copy[type] || copy.inner;
}

function joinDiagramSvg(opts = {}) {
  const type = opts.type || "inner";
  const leftColor = asSvgColor(opts.leftColor || TOKENS.navy);
  const rightColor = asSvgColor(opts.rightColor || TOKENS.red);
  const highlightColor = asSvgColor(opts.highlightColor || TOKENS.red);
  const mutedFill = asSvgColor(opts.mutedFill || "FFFFFF");
  const inkColor = asSvgColor(TOKENS.ink);
  const leftLabel = escapeXml(opts.leftLabel || "Tabla A");
  const rightLabel = escapeXml(opts.rightLabel || "Tabla B");
  const copy = joinTypeCopy(type, opts.leftLabel || "Tabla A", opts.rightLabel || "Tabla B");
  const result = escapeXml(opts.result || copy.formula);

  const highlight = {
    inner: `
      <g clip-path="url(#clip-left)">
        <circle cx="290" cy="160" r="102" fill="${highlightColor}" opacity="0.82"/>
      </g>
    `,
    left: `<circle cx="190" cy="160" r="102" fill="${highlightColor}" opacity="0.76"/>`,
    right: `<circle cx="290" cy="160" r="102" fill="${highlightColor}" opacity="0.76"/>`,
    full: `
      <circle cx="190" cy="160" r="102" fill="${highlightColor}" opacity="0.64"/>
      <circle cx="290" cy="160" r="102" fill="${highlightColor}" opacity="0.64"/>
    `,
    leftOnly: `
      <circle cx="190" cy="160" r="102" fill="${highlightColor}" opacity="0.78"/>
      <circle cx="290" cy="160" r="102" fill="${mutedFill}" opacity="0.96"/>
    `,
    rightOnly: `
      <circle cx="290" cy="160" r="102" fill="${highlightColor}" opacity="0.78"/>
      <circle cx="190" cy="160" r="102" fill="${mutedFill}" opacity="0.96"/>
    `,
  }[type] || "";

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 340">
      <defs>
        <clipPath id="clip-left">
          <circle cx="190" cy="160" r="102"/>
        </clipPath>
      </defs>
      <rect x="0" y="0" width="480" height="340" fill="none"/>
      <g>
        <circle cx="190" cy="160" r="102" fill="${mutedFill}" opacity="0.55"/>
        <circle cx="290" cy="160" r="102" fill="${mutedFill}" opacity="0.55"/>
        ${highlight}
        <circle cx="190" cy="160" r="102" fill="none" stroke="${leftColor}" stroke-width="7"/>
        <circle cx="290" cy="160" r="102" fill="none" stroke="${rightColor}" stroke-width="7"/>
      </g>
      <text x="144" y="36" font-family="Aptos, Arial, sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="${leftColor}">${leftLabel}</text>
      <text x="336" y="36" font-family="Aptos, Arial, sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="${rightColor}">${rightLabel}</text>
      <text x="240" y="292" font-family="Aptos, Arial, sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="${inkColor}">${result}</text>
    </svg>
  `);
}

/**
 * addServerCycle - Visualiza los 4 pasos internos de un servidor al recibir una petición.
 */
function addServerCycle(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 3.12;
  const defaultSteps = [
    { title: "Escuchar", body: "Puerto abierto, esperando HTTP", icon: "👂", accent: TOKENS.navy },
    { title: "Validar", body: "¿Datos completos y correctos?", icon: "🛡️", accent: TOKENS.red },
    { title: "Procesar", body: "Cálculos y coordinación", icon: "⚙️", accent: TOKENS.gold },
    { title: "Responder", body: "Enviar JSON + Status Code", icon: "🚀", accent: "28A745" },
  ];

  const steps = opts.steps || defaultSteps;

  const stepW = (w - (steps.length - 1) * 0.4) / steps.length;

  steps.forEach((step, i) => {
    const stepX = x + i * (stepW + 0.4);
    
    // Conector (flecha)
    if (i < steps.length - 1) {
      slide.addShape(SH.chevron, {
        x: stepX + stepW + 0.05,
        y: y + h / 2 - 0.15,
        w: 0.3,
        h: 0.3,
        fill: { color: TOKENS.border },
        line: { color: TOKENS.border },
      });
    }

    // Caja de paso
    slide.addShape(SH.roundRect, {
      x: stepX,
      y,
      w: stepW,
      h,
      rectRadius: 0.05,
      fill: { color: TOKENS.white },
      line: { color: step.accent, pt: 2 },
    });

    // Icono
    slide.addText(step.icon, {
      x: stepX,
      y: y + 0.3,
      w: stepW,
      h: 0.6,
      fontSize: 28,
      align: "center",
    });

    // Título
    slide.addText(step.title, {
      x: stepX + 0.1,
      y: y + 1.1,
      w: stepW - 0.2,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 14,
      bold: true,
      color: step.accent,
      align: "center",
    });

    // Cuerpo
    slide.addText(step.body, {
      x: stepX + 0.1,
      y: y + 1.6,
      w: stepW - 0.2,
      h: 0.8,
      fontFace: TYPOGRAPHY.body,
      fontSize: 10,
      color: TOKENS.slate,
      align: "center",
    });
  });
}

/**
 * addRestResource - Muestra un bloque de recurso REST con Verbo, URL y JSON.
 */
function addRestResource(slide, SH, opts = {}) {
  const { x, y, w, h, verb, url, json } = opts;
  const verbColors = {
    GET: "28A745",
    POST: TOKENS.gold,
    PUT: TOKENS.navy,
    DELETE: TOKENS.red,
  };
  const accent = verbColors[verb] || TOKENS.navy;

  // Contenedor principal
  slide.addShape(SH.roundRect, {
    x, y, w, h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  // Header con Verbo y URL
  const verbBoxW = 1.2;
  const verbBoxH = 0.44;
  slide.addShape(SH.roundRect, {
    x: x + 0.14,
    y: y + 0.14,
    w: verbBoxW,
    h: verbBoxH,
    rectRadius: 0.02,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(verb, {
    x: x + 0.14,
    y: y + 0.15, // Desplazamiento mínimo vertical para romper la simetría de colisión
    w: verbBoxW,
    h: verbBoxH,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: TOKENS.white,
    align: "center",
    valign: "mid",
  });

  slide.addText(url, {
    x: x + 1.44,
    y: y + 0.14,
    w: w - 1.58,
    h: 0.44,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 12,
    color: TOKENS.navy,
    valign: "mid",
  });

  // Área de JSON (simulando un editor o respuesta)
  if (json) {
    slide.addShape(SH.rect, {
      x: x + 0.14,
      y: y + 0.72,
      w: w - 0.28,
      h: h - 0.86,
      fill: { color: "F8F9FA" },
      line: { color: TOKENS.border, pt: 0.5 },
    });
    slide.addText(json, {
      x: x + 0.24,
      y: y + 0.82,
      w: w - 0.48,
      h: h - 1.06,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9,
      color: TOKENS.slate,
      valign: "top",
    });
  }
}

/**
 * addLayerStack - Visualiza la arquitectura en capas (API, Negocio, Datos).
 */
function addLayerStack(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 5.0;
  const h = opts.h || 4.54;
  
  const layers = [
    { title: "Capa de API", subtitle: "Controladores / HTTP", fill: TOKENS.softBlue, accent: TOKENS.navy },
    { title: "Capa de Negocio", subtitle: "Servicios / Reglas", fill: TOKENS.paleRed, accent: TOKENS.red },
    { title: "Capa de Datos", subtitle: "Persistencia / SQL", fill: TOKENS.softNeutral, accent: TOKENS.gold },
  ];

  const layerH = (h - 0.4) / layers.length;

  layers.forEach((layer, i) => {
    const layerY = y + i * (layerH + 0.2);
    
    slide.addShape(SH.roundRect, {
      x,
      y: layerY,
      w,
      h: layerH,
      rectRadius: 0.06,
      fill: { color: layer.fill },
      line: { color: layer.accent, pt: 2 },
    });

    slide.addText(layer.title, {
      x: x + 0.2,
      y: layerY + 0.2,
      w: w - 0.4,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 16,
      bold: true,
      color: layer.accent,
    });

    slide.addText(layer.subtitle, {
      x: x + 0.2,
      y: layerY + 0.6,
      w: w - 0.4,
      h: 0.3,
      fontFace: TYPOGRAPHY.body,
      fontSize: 11,
      color: TOKENS.slate,
    });
  });

  // Flechas de flujo
  slide.addShape(SH.downArrow, {
    x: x + w + 0.2, // Más cerca del stack
    y: y + 0.5,
    w: 0.3, // Más delgada
    h: h - 1.0,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy },
  });
  slide.addText("Petición", {
    x: x + w + 0.55, // Más espacio para el texto explicativo lateral
    y: y + h / 2 - 0.2,
    w: 1.2,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: TOKENS.navy,
  });
}

/**
 * addTableSchema - Dibuja una tabla de base de datos profesional.
 */
function addTableSchema(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 3.6; // Aumentado de 3.0
  const headerH = 0.4;
  const rowH = 0.26;
  const title = opts.title || "Table";
  const columns = opts.columns || [];
  
  const h = headerH + (columns.length * rowH) + 0.1;

  // Fondo de la tabla
  slide.addShape(SH.roundRect, {
    x, y, w, h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  // Cabecera (Texto con fondo)
  slide.addText(title, {
    x: x, y: y, w: w, h: headerH,
    fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: TOKENS.white, 
    valign: "mid", align: "center", fill: { color: TOKENS.navy }
  });

  // Columnas
  columns.forEach((col, i) => {
    const rowY = y + headerH + (i * rowH);
    const isPK = col.key === "PK";
    const isFK = col.key === "FK";
    
    let keyColor = TOKENS.slate;
    let keyText = "";
    if (isPK) { keyColor = TOKENS.gold; keyText = "🔑"; }
    else if (isFK) { keyColor = TOKENS.red; keyText = "🔗"; }

    if (keyText) {
      slide.addText(keyText, {
        x: x + 0.05, y: rowY + 0.03, w: 0.3, h: rowH - 0.06,
        fontSize: 10, valign: "mid", align: "center"
      });
    }

    slide.addText(col.name, {
      x: x + 0.35, y: rowY + 0.03, w: w - 1.85, h: rowH - 0.06, // Frontera reducida para evitar choque
      fontFace: TYPOGRAPHY.mono, fontSize: 11, bold: isPK, color: isPK ? TOKENS.navy : TOKENS.ink, valign: "mid"
    });

    slide.addText(col.type, {
      x: x + w - 1.45, y: rowY + 0.03, w: 1.35, h: rowH - 0.06, // Posición ajustada
      fontFace: TYPOGRAPHY.mono, fontSize: 9, color: TOKENS.slate, valign: "mid", align: "right"
    });

    // Línea separadora
    if (i < columns.length - 1) {
      slide.addShape(SH.line, {
        x: x + 0.1, y: rowY + rowH, w: w - 0.2, h: 0.01,
        line: { color: TOKENS.paper, pt: 1 }
      });
    }
  });
}

/**
 * addErRelationship - Dibuja conexiones Crow's Foot con robustez máxima.
 */
function addErRelationship(slide, SH, opts = {}) {
  const round = (n) => Math.round(n * 100) / 100;
  const startX = round(opts.startX);
  const startY = round(opts.startY);
  const endX = round(opts.endX);
  const endY = round(opts.endY);
  const type = opts.type || "1:N";
  const label = opts.label || "";
  const color = opts.color || TOKENS.navy;
  
  const isFlippedH = endX < startX;
  const dir = isFlippedH ? -1 : 1;

  // 1. Línea principal (Conexión)
  slide.addShape(SH.line, {
    x: round(Math.min(startX, endX)),
    y: round(Math.min(startY, endY)),
    w: round(Math.max(0.01, Math.abs(endX - startX))),
    h: round(Math.max(0.01, Math.abs(endY - startY))),
    line: { color: color, pt: 1.5 },
    flipH: isFlippedH,
    flipV: endY < startY
  });

  // 2. Notación Lado START (Siempre "1" mandatorio: ||)
  // Barras bien separadas para evitar efecto 'barcode'
  slide.addShape(SH.line, {
    x: round(startX + dir * 0.15), y: round(startY - 0.1), 
    w: 0, h: 0.2, line: { color: color, pt: 1.5 }
  });
  slide.addShape(SH.line, {
    x: round(startX + dir * 0.35), y: round(startY - 0.1), 
    w: 0, h: 0.2, line: { color: color, pt: 1.5 }
  });

  // 3. Notación Lado END
  if (type === "1:N" || type === "N:M") {
    // MUCHOS MANDATORIO (> |)
    const tipX = endX;
    const baseW = 0.28; // Tridente más compacto
    const baseH = 0.12;
    
    // El tridente (Pata de gallo)
    slide.addShape(SH.line, {
      x: round(Math.min(tipX, tipX - dir * baseW)),
      y: round(endY - baseH),
      w: baseW, h: baseH,
      line: { color: color, pt: 1.5 },
      flipH: !isFlippedH, flipV: true
    });
    slide.addShape(SH.line, {
      x: round(Math.min(tipX, tipX - dir * baseW)),
      y: endY,
      w: baseW, h: baseH,
      line: { color: color, pt: 1.5 },
      flipH: !isFlippedH, flipV: false
    });
    // La barra de mandatorio (|) desplazada para que NO toque el tridente
    slide.addShape(SH.line, {
      x: round(endX - dir * 0.48), y: round(endY - 0.1), 
      w: 0, h: 0.2, line: { color: color, pt: 1.5 }
    });
  } else if (type === "1:1") {
    // UNO MANDATORIO (||) simétrico al inicio
    slide.addShape(SH.line, {
      x: round(endX - dir * 0.15), y: round(endY - 0.1), 
      w: 0, h: 0.2, line: { color: color, pt: 1.5 }
    });
    slide.addShape(SH.line, {
      x: round(endX - dir * 0.35), y: round(endY - 0.1), 
      w: 0, h: 0.2, line: { color: color, pt: 1.5 }
    });
  }

  // 4. Etiqueta (si existe)
  if (label) {
    const midX = startX + (endX - startX) / 2;
    slide.addText(label, {
      x: round(midX - 0.5), y: round(startY - 0.25), w: 1.0, h: 0.2,
      fontFace: TYPOGRAPHY.body, fontSize: 8, bold: true, color: color, align: "center", valign: "mid",
      fill: { color: TOKENS.white }
    });
  }
}

/**
 * addJoinSetDiagram - Diagrama compacto de conjuntos para explicar joins.
 */
function addJoinSetDiagram(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 1.8;
  const w = opts.w || 5.2;
  const h = opts.h || 4.2;
  const type = opts.type || "inner";
  const leftLabel = opts.leftLabel || "Tabla A";
  const rightLabel = opts.rightLabel || "Tabla B";
  const title = opts.title || "Lectura visual del JOIN";
  const copy = joinTypeCopy(type, leftLabel, rightLabel);
  const headerH = opts.title === false ? 0 : 0.52;
  const footerH = opts.caption === false ? 0 : 0.58;
  const pad = opts.pad || 0.16;
  const badgeW = Math.min(1.42, Math.max(1.08, w * 0.22));
  const badgeX = x + w - pad - badgeW;

  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.04,
    fill: { color: opts.fill || TOKENS.white },
    line: { color: opts.line || TOKENS.border, pt: 1 },
  });

  if (headerH > 0) {
    slide.addShape(SH.roundRect, {
      x: x + pad,
      y: y + pad,
      w: w - pad * 2,
      h: 0.36,
      rectRadius: 0.03,
      fill: { color: opts.headerFill || TOKENS.softNeutral },
      line: { color: opts.headerFill || TOKENS.softNeutral },
    });
    slide.addText(title, {
      x: x + pad + 0.12,
      y: y + pad + 0.09,
      w: w - pad * 2 - badgeW - 0.24,
      h: 0.12,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.titleFontSize || 10.6,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
      fit: "shrink",
    });
    slide.addShape(SH.roundRect, {
      x: badgeX,
      y: y + pad + 0.06,
      w: badgeW,
      h: 0.24,
      rectRadius: 0.03,
      fill: { color: opts.badgeFill || TOKENS.navy },
      line: { color: opts.badgeFill || TOKENS.navy },
    });
    slide.addText(opts.badge || copy.badge, {
      x: badgeX + 0.06,
      y: y + pad + 0.13,
      w: badgeW - 0.12,
      h: 0.08,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.badgeFontSize || 7.4,
      bold: true,
      color: TOKENS.white,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  }

  const diagramX = x + pad;
  const diagramY = y + pad + headerH;
  const diagramW = w - pad * 2;
  const diagramH = Math.max(1.1, h - pad * 2 - headerH - footerH);
  const imageH = Math.min(diagramH, diagramW * 0.72);
  const imageW = Math.min(diagramW, imageH * (480 / 340));
  const imageX = diagramX + (diagramW - imageW) / 2;
  const imageY = diagramY + (diagramH - imageH) / 2;

  slide.addImage({
    data: joinDiagramSvg({
      type,
      leftLabel,
      rightLabel,
      result: opts.result,
      leftColor: opts.leftColor,
      rightColor: opts.rightColor,
      highlightColor: opts.highlightColor,
      paperColor: opts.diagramFill || TOKENS.paper,
    }),
    x: imageX,
    y: imageY,
    w: imageW,
    h: imageH,
  });

  if (footerH > 0) {
    slide.addText(opts.caption || copy.result, {
      x: x + pad + 0.08,
      y: y + h - pad - 0.36,
      w: w - pad * 2 - 0.16,
      h: 0.28,
      fontFace: TYPOGRAPHY.body,
      fontSize: opts.captionFontSize || 8.8,
      color: TOKENS.slate,
      align: "center",
      valign: "mid",
      margin: 0,
      fit: "shrink",
    });
  }
}

/**
 * addSupabaseProjectSetupPanel - Guia visual para crear un proyecto en Supabase.
 */
function addSupabaseProjectSetupPanel(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 3.9;
  const title = opts.title || "Supabase: crear proyecto";
  const footerH = opts.footer ? 0.28 : 0;
  const bodyY = y + 0.58;
  const bodyH = h - 0.72 - footerH;
  const gap = 0.22;
  const leftW = opts.leftW || w * 0.47;
  const rightW = w - leftW - gap;
  const leftX = x;
  const rightX = x + leftW + gap;
  const organizationName = opts.organizationName || "AIEP Sandbox";
  const projectName = opts.projectName || "cine-db-demo";
  const databasePassword = opts.databasePassword || "db-pass-2026";
  const regionName = opts.regionName || "South America (Sao Paulo)";
  const planLabel = opts.planLabel || "Free";
  const statusItems = opts.statusItems || [
    "Project provisioned",
    "Database online",
    "API ready",
  ];
  const tabs = opts.tabs || ["Table Editor", "SQL Editor", "API Docs"];

  slide.addShape(SH.roundRect, {
    x, y, w, h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addText(title, {
    x: x + 0.16,
    y: y + 0.12,
    w: w - 0.32,
    h: 0.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 16,
    bold: true,
    color: TOKENS.navy,
  });

  slide.addShape(SH.line, {
    x: x + 0.14,
    y: y + 0.48,
    w: w - 0.28,
    h: 0,
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.roundRect, {
    x: leftX,
    y: bodyY,
    w: leftW,
    h: bodyH,
    rectRadius: 0.04,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addText("Paso 1: formulario base", {
    x: leftX + 0.18,
    y: bodyY + 0.16,
    w: leftW - 0.36,
    h: 0.24,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
  });

  const fieldX = leftX + 0.18;
  const fieldW = leftW - 0.36;
  const labelW = 1.55;
  const valueX = fieldX + labelW + 0.12;
  const valueW = fieldW - labelW - 0.12;
  const rows = [
    { label: "Organization", value: organizationName },
    { label: "Project name", value: projectName },
    { label: "DB password", value: databasePassword },
    { label: "Region", value: regionName },
    { label: "Plan", value: planLabel },
  ];

  rows.forEach((row, index) => {
    const rowY = bodyY + 0.54 + index * 0.42;
    slide.addText(row.label, {
      x: fieldX,
      y: rowY + 0.04,
      w: labelW,
      h: 0.2,
      fontFace: TYPOGRAPHY.body,
      fontSize: 10,
      bold: true,
      color: TOKENS.slate,
    });
    slide.addShape(SH.roundRect, {
      x: valueX,
      y: rowY,
      w: valueW,
      h: 0.28,
      rectRadius: 0.02,
      fill: { color: TOKENS.white },
      line: { color: TOKENS.border, pt: 0.75 },
    });
    slide.addText(row.value, {
      x: valueX + 0.08,
      y: rowY + 0.04,
      w: valueW - 0.16,
      h: 0.2,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.5,
      color: TOKENS.ink,
    });
  });

  slide.addShape(SH.roundRect, {
    x: leftX + 0.18,
    y: bodyY + bodyH - 0.52,
    w: 1.7,
    h: 0.3,
    rectRadius: 0.03,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red, pt: 1 },
  });
  slide.addText("Create project", {
    x: leftX + 0.18,
    y: bodyY + bodyH - 0.47,
    w: 1.7,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 10,
    bold: true,
    color: TOKENS.white,
    align: "center",
  });

  const statusH = 1.34;
  const workspaceY = bodyY + statusH + 0.16;
  const workspaceH = bodyH - statusH - 0.16;

  slide.addShape(SH.roundRect, {
    x: rightX,
    y: bodyY,
    w: rightW,
    h: statusH,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });
  slide.addText("Paso 2: proyecto listo", {
    x: rightX + 0.16,
    y: bodyY + 0.14,
    w: rightW - 0.32,
    h: 0.22,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
  });

  statusItems.forEach((item, index) => {
    const itemY = bodyY + 0.46 + index * 0.24;
    slide.addShape(SH.rect, {
      x: rightX + 0.18,
      y: itemY + 0.03,
      w: 0.12,
      h: 0.12,
      fill: { color: index === 1 ? TOKENS.red : TOKENS.gold },
      line: { color: index === 1 ? TOKENS.red : TOKENS.gold, pt: 0.75 },
    });
    slide.addText(item, {
      x: rightX + 0.38,
      y: itemY,
      w: rightW - 0.56,
      h: 0.18,
      fontFace: TYPOGRAPHY.body,
      fontSize: 10,
      color: TOKENS.slate,
    });
  });

  slide.addShape(SH.roundRect, {
    x: rightX,
    y: workspaceY,
    w: rightW,
    h: workspaceH,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });
  slide.addText("Paso 3: orientarse en el dashboard", {
    x: rightX + 0.16,
    y: workspaceY + 0.14,
    w: rightW - 0.32,
    h: 0.2,
    fontFace: TYPOGRAPHY.display,
    fontSize: 12.5,
    bold: true,
    color: TOKENS.navy,
  });

  tabs.forEach((tab, index) => {
    const tabW = (rightW - 0.52) / tabs.length;
    const tabX = rightX + 0.16 + index * tabW;
    slide.addShape(SH.roundRect, {
      x: tabX,
      y: workspaceY + 0.44,
      w: tabW - 0.08,
      h: 0.26,
      rectRadius: 0.02,
      fill: { color: index === 0 ? TOKENS.navy : TOKENS.softBlue },
      line: { color: index === 0 ? TOKENS.navy : TOKENS.border, pt: 0.75 },
    });
    slide.addText(tab, {
      x: tabX,
      y: workspaceY + 0.5,
      w: tabW - 0.08,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      bold: index === 0,
      color: index === 0 ? TOKENS.white : TOKENS.navy,
      align: "center",
    });
  });

  const miniCardY = workspaceY + 0.86;
  const miniCardW = (rightW - 0.42) / 2;
  [
    { title: "Database", body: "La instancia PostgreSQL ya vive aqui.", accent: TOKENS.red, x: rightX + 0.16 },
    { title: "API", body: "Supabase prepara acceso REST y metadatos.", accent: TOKENS.gold, x: rightX + 0.26 + miniCardW },
  ].forEach((card) => {
    slide.addShape(SH.roundRect, {
      x: card.x,
      y: miniCardY,
      w: miniCardW,
      h: workspaceH - 1.02,
      rectRadius: 0.03,
      fill: { color: TOKENS.softNeutral },
      line: { color: TOKENS.border, pt: 0.75 },
    });
    slide.addShape(SH.rect, {
      x: card.x,
      y: miniCardY,
      w: 0.08,
      h: workspaceH - 1.02,
      fill: { color: card.accent },
      line: { color: card.accent, pt: 0.75 },
    });
    slide.addText(card.title, {
      x: card.x + 0.16,
      y: miniCardY + 0.14,
      w: miniCardW - 0.24,
      h: 0.18,
      fontFace: TYPOGRAPHY.display,
      fontSize: 11,
      bold: true,
      color: TOKENS.navy,
    });
    slide.addText(card.body, {
      x: card.x + 0.16,
      y: miniCardY + 0.4,
      w: miniCardW - 0.24,
      h: 0.42,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.5,
      color: TOKENS.slate,
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.18,
      y: y + h - 0.2,
      w: w - 0.36,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      color: TOKENS.slate,
      align: "center",
    });
  }
}

/**
 * addSupabaseTableEditorPanel - Mockup guiado del editor de tablas y relaciones.
 */
function addSupabaseTableEditorPanel(slide, SH, opts = {}) {
  const x = opts.x || 0.88;
  const y = opts.y || 2.22;
  const w = opts.w || 10.26;
  const h = opts.h || 4.0;
  const title = opts.title || "Supabase: Table Editor";
  const footerH = opts.footer ? 0.28 : 0;
  const bodyY = y + 0.58;
  const bodyH = h - 0.72 - footerH;
  const gap = 0.22;
  const leftW = opts.leftW || w * 0.61;
  const rightW = w - leftW - gap;
  const tableName = opts.tableName || "peliculas";
  const columns = opts.columns || [
    { name: "id", type: "uuid", key: "PK" },
    { name: "titulo", type: "text" },
    { name: "duracion_min", type: "int4" },
    { name: "sala_id", type: "uuid", key: "FK" },
  ];
  const relationshipTitle = opts.relationshipTitle || "Relationship";
  const relationshipBody = opts.relationshipBody || "funciones.sala_id -> salas.id";
  const sampleRowTitle = opts.sampleRowTitle || "Sample row";
  const sampleValues = opts.sampleValues || [
    'id: "a1b2-c3d4"',
    'titulo: "Batman"',
    "duracion_min: 168",
  ];

  slide.addShape(SH.roundRect, {
    x, y, w, h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addText(title, {
    x: x + 0.16,
    y: y + 0.12,
    w: w - 0.32,
    h: 0.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 16,
    bold: true,
    color: TOKENS.navy,
  });

  slide.addShape(SH.line, {
    x: x + 0.14,
    y: y + 0.48,
    w: w - 0.28,
    h: 0,
    line: { color: TOKENS.border, pt: 1 },
  });

  const leftX = x;
  const rightX = x + leftW + gap;

  slide.addShape(SH.roundRect, {
    x: leftX,
    y: bodyY,
    w: leftW,
    h: bodyH,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.rect, {
    x: leftX,
    y: bodyY,
    w: leftW,
    h: 0.32,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.border, pt: 0.75 },
  });
  slide.addText("Table Editor", {
    x: leftX + 0.14,
    y: bodyY + 0.08,
    w: 1.2,
    h: 0.14,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.5,
    bold: true,
    color: TOKENS.navy,
  });
  slide.addShape(SH.roundRect, {
    x: leftX + leftW - 0.98,
    y: bodyY + 0.05,
    w: 0.78,
    h: 0.2,
    rectRadius: 0.02,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red, pt: 0.75 },
  });
  slide.addText("Save", {
    x: leftX + leftW - 0.98,
    y: bodyY + 0.09,
    w: 0.78,
    h: 0.1,
    fontFace: TYPOGRAPHY.body,
    fontSize: 8.5,
    bold: true,
    color: TOKENS.white,
    align: "center",
  });

  slide.addShape(SH.roundRect, {
    x: leftX + 0.16,
    y: bodyY + 0.44,
    w: 1.6,
    h: 0.24,
    rectRadius: 0.02,
    fill: { color: TOKENS.navy },
    line: { color: TOKENS.navy, pt: 0.75 },
  });
  slide.addText(tableName, {
    x: leftX + 0.16,
    y: bodyY + 0.5,
    w: 1.6,
    h: 0.1,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 9.5,
    bold: true,
    color: TOKENS.white,
    align: "center",
  });

  const tableX = leftX + 0.16;
  const tableY = bodyY + 0.82;
  const tableW = leftW - 0.32;
  const headerH = 0.3;
  const rowH = 0.32;

  slide.addShape(SH.roundRect, {
    x: tableX,
    y: tableY,
    w: tableW,
    h: headerH + columns.length * rowH,
    rectRadius: 0.03,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 0.75 },
  });
  slide.addShape(SH.rect, {
    x: tableX,
    y: tableY,
    w: tableW,
    h: headerH,
    fill: { color: TOKENS.softBlue },
    line: { color: TOKENS.border, pt: 0.5 },
  });
  [
    { text: "Column", x: tableX + 0.16, w: tableW - 2.1, align: "left" },
    { text: "Type", x: tableX + tableW - 1.78, w: 0.72, align: "left" },
    { text: "Key", x: tableX + tableW - 0.74, w: 0.46, align: "center" },
  ].forEach((header) => {
    slide.addText(header.text, {
      x: header.x,
      y: tableY + 0.08,
      w: header.w,
      h: 0.12,
      fontFace: TYPOGRAPHY.body,
      fontSize: 8.8,
      bold: true,
      color: TOKENS.navy,
      align: header.align,
    });
  });

  columns.forEach((column, index) => {
    const rowY = tableY + headerH + index * rowH;
    if (index > 0) {
      slide.addShape(SH.line, {
        x: tableX + 0.08,
        y: rowY,
        w: tableW - 0.16,
        h: 0,
        line: { color: TOKENS.paper, pt: 0.75 },
      });
    }
    slide.addText(column.name, {
      x: tableX + 0.14,
      y: rowY + 0.09,
      w: tableW - 2.06,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9,
      bold: column.key === "PK",
      color: column.key === "PK" ? TOKENS.navy : TOKENS.ink,
    });
    slide.addText(column.type, {
      x: tableX + tableW - 1.76,
      y: rowY + 0.09,
      w: 0.72,
      h: 0.12,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.7,
      color: TOKENS.slate,
    });

    if (column.key) {
      const keyFill = column.key === "PK" ? TOKENS.gold : TOKENS.red;
      slide.addShape(SH.roundRect, {
        x: tableX + tableW - 0.72,
        y: rowY + 0.06,
        w: 0.5,
        h: 0.18,
        rectRadius: 0.02,
        fill: { color: keyFill },
        line: { color: keyFill, pt: 0.75 },
      });
      slide.addText(column.key, {
        x: tableX + tableW - 0.72,
        y: rowY + 0.1,
        w: 0.5,
        h: 0.08,
        fontFace: TYPOGRAPHY.body,
        fontSize: 7.8,
        bold: true,
        color: column.key === "PK" ? TOKENS.navy : TOKENS.white,
        align: "center",
      });
    }
  });

  slide.addShape(SH.roundRect, {
    x: rightX,
    y: bodyY,
    w: rightW,
    h: 1.22,
    rectRadius: 0.04,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.border, pt: 0.75 },
  });
  slide.addText(relationshipTitle, {
    x: rightX + 0.16,
    y: bodyY + 0.14,
    w: rightW - 0.32,
    h: 0.18,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11.5,
    bold: true,
    color: TOKENS.navy,
  });
  slide.addText(relationshipBody, {
    x: rightX + 0.16,
    y: bodyY + 0.48,
    w: rightW - 0.32,
    h: 0.36,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 9.5,
    color: TOKENS.red,
  });

  slide.addShape(SH.roundRect, {
    x: rightX,
    y: bodyY + 1.42,
    w: rightW,
    h: bodyH - 1.42,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 0.75 },
  });
  slide.addText(sampleRowTitle, {
    x: rightX + 0.16,
    y: bodyY + 1.56,
    w: rightW - 0.32,
    h: 0.18,
    fontFace: TYPOGRAPHY.display,
    fontSize: 11.5,
    bold: true,
    color: TOKENS.navy,
  });

  sampleValues.forEach((line, index) => {
    slide.addShape(SH.roundRect, {
      x: rightX + 0.16,
      y: bodyY + 1.9 + index * 0.34,
      w: rightW - 0.32,
      h: 0.24,
      rectRadius: 0.02,
      fill: { color: TOKENS.softNeutral },
      line: { color: TOKENS.border, pt: 0.5 },
    });
    slide.addText(line, {
      x: rightX + 0.24,
      y: bodyY + 1.97 + index * 0.34,
      w: rightW - 0.48,
      h: 0.1,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.8,
      color: TOKENS.slate,
    });
  });

  if (opts.footer) {
    slide.addText(opts.footer, {
      x: x + 0.18,
      y: y + h - 0.2,
      w: w - 0.36,
      h: 0.14,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9,
      color: TOKENS.slate,
      align: "center",
    });
  }
}

module.exports = {
  addServerCycle,
  addRestResource,
  addLayerStack,
  addTableSchema,
  addErRelationship,
  addSupabaseProjectSetupPanel,
  addSupabaseTableEditorPanel,
  addJoinSetDiagram,
};
