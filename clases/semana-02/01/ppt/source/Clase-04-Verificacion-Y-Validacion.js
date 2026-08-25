const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { addCodeGuide, addCodePanel, addTerminalPanel } = components;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "PRO402 · Clase 04",
  title: "Verificación y validación: construir bien y construir lo correcto",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const outputPptx = path.resolve(__dirname, "..", "Clase-04-Verificacion-Y-Validacion.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

// Cuarto acento de la familia, para cuando rojo, oro y verde ya están tomados.
const CYAN = "1F8A9B";
const CYAN_ON_NAVY = "63C6D8";
const CYAN_ON_PAPER = "0E6E7A";

// Variantes oscurecidas de los acentos: sobre papel, el oro y el verde
// originales no alcanzan contraste suficiente para texto.
const ACCENT_ON_PAPER = {
  [C.success]: "2E7D4F",
  [C.gold]: "8A6A12",
  [C.red]: "B3181E",
  [CYAN]: CYAN_ON_PAPER,
};

function onPaper(accent) {
  return ACCENT_ON_PAPER[accent] || accent;
}

function addText(slide, value, opts = {}) {
  slide.addText(value, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fontFace: opts.fontFace || TYPOGRAPHY.body,
    fontSize: opts.fontSize || 18,
    bold: opts.bold || false,
    italic: opts.italic || false,
    color: opts.color || C.ink,
    align: opts.align || "left",
    valign: opts.valign || "top",
    margin: opts.margin ?? 0,
    breakLine: false,
    lineSpacingMultiple: opts.lineSpacingMultiple,
    charSpacing: opts.charSpacing,
    isTextBox: true,
  });
}

// NOTA: no usar `slide.addText([{text, options}, ...])` para colorear tramos
// dentro de una frase. PptxGenJS 4.0.1 emite un `a:pPr` por cada run dentro del
// mismo `a:p`, y eso invalida el .pptx contra el esquema OpenXML.
function rect(slide, x, y, w, h, fill, outline = fill, radius = 0) {
  slide.addShape(radius ? SH.roundRect : SH.rect, {
    x,
    y,
    w,
    h,
    rectRadius: radius || undefined,
    fill: { color: fill },
    line: { color: outline, pt: outline === fill ? 0 : 1 },
  });
}

function rectDashed(slide, x, y, w, h, fill, outline, radius = 0) {
  slide.addShape(radius ? SH.roundRect : SH.rect, {
    x,
    y,
    w,
    h,
    rectRadius: radius || undefined,
    fill: { color: fill },
    line: { color: outline, pt: 1.4, dashType: "dash" },
  });
}

function rule(slide, x, y, w, color = C.border, pt = 1.2) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, pt, beginArrowType: "none", endArrowType: "none" },
  });
}

function vrule(slide, x, y, h, color = C.border, pt = 1.2) {
  slide.addShape(SH.line, {
    x,
    y,
    w: 0,
    h,
    line: { color, pt, beginArrowType: "none", endArrowType: "none" },
  });
}

function addCircleLabel(slide, x, y, size, fill, label, opts = {}) {
  slide.addShape(SH.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: { color: opts.outline || fill, pt: opts.outline && opts.outline !== fill ? 1 : 0 },
  });
  addText(slide, String(label), {
    x,
    y,
    w: size,
    h: size,
    fontSize: opts.fontSize || 11,
    bold: opts.bold !== false,
    color: opts.color || C.white,
    align: "center",
    valign: "mid",
  });
}

function addAiepLogo(slide, dark = false) {
  const logoPath = dark ? ASSETS.aiepDark : ASSETS.aiep;
  slide.addImage({
    path: logoPath,
    ...imageSizingContain(logoPath, 11.18, 0.28, 1.46, 0.62),
  });
}

function addTopMotif(slide, dark = false) {
  rect(slide, 0, 0, 0.72, 0.12, C.red);
  rect(slide, 0.82, 0, 0.44, 0.12, dark ? C.gold : C.navy);
  rect(slide, 1.36, 0, 0.28, 0.12, dark ? C.white : C.gold);
}

function addFooter(slide, dark = false) {
  addText(slide, "PRO402 · Taller de Testing y Calidad de Software", {
    x: M,
    y: 7.1,
    w: 5.8,
    h: 0.18,
    fontSize: 9.5,
    bold: true,
    color: dark ? C.sand : C.slate,
    charSpacing: 0.55,
  });
  addText(slide, String(pptx._slides.length).padStart(2, "0"), {
    x: 11.72,
    y: 7.02,
    w: 0.9,
    h: 0.28,
    fontFace: TYPOGRAPHY.display,
    fontSize: 14,
    bold: true,
    color: dark ? C.sand : C.ink,
    align: "right",
  });
}

function createSlide(mode = "light") {
  const slide = pptx.addSlide();
  const dark = mode === "dark";
  slide.background = { color: dark ? C.navy : C.paper };
  addTopMotif(slide, dark);
  addAiepLogo(slide, dark);
  addFooter(slide, dark);
  return { slide, dark };
}

// El titular reserva siempre dos líneas y la bajada arranca en una Y fija.
const HEADER_TITLE_Y = 0.82;
const HEADER_TITLE_H = 1.06;
const HEADER_SUBTITLE_Y = 1.94;
const CONTENT_TOP = 2.46;

function addHeader(slide, label, title, subtitle = "", dark = false, opts = {}) {
  const longTitle = title.length > 54;
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.44,
    w: 5.8,
    h: 0.22,
    fontSize: 10.3,
    bold: true,
    color: dark ? C.gold : C.red,
    charSpacing: 1.7,
  });
  addText(slide, title, {
    x: M,
    y: HEADER_TITLE_Y,
    w: opts.titleW || 9.7,
    h: HEADER_TITLE_H,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || (longTitle ? 28 : 30),
    bold: true,
    color: dark ? C.white : C.ink,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: M,
      y: opts.subtitleY || HEADER_SUBTITLE_Y,
      w: opts.subtitleW || 9.9,
      h: opts.subtitleH || 0.34,
      fontSize: opts.subtitleFontSize || 14.5,
      color: dark ? C.softBlue : C.slate,
    });
  }
}

function addStatusPill(slide, x, y, w, label, fill, opts = {}) {
  rect(slide, x, y, w, opts.h || 0.44, fill, fill, 0.06);
  addText(slide, label, {
    x: x + 0.12,
    y,
    w: w - 0.24,
    h: opts.h || 0.44,
    fontFace: opts.mono ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
    fontSize: opts.fontSize || 11.5,
    bold: true,
    color: opts.color || C.white,
    align: "center",
    valign: "mid",
  });
}

function addArrow(slide, x, y, w, color = C.border) {
  slide.addShape(SH.chevron, {
    x,
    y,
    w,
    h: 0.46,
    fill: { color },
    line: { color },
  });
}

function addDownArrow(slide, x, y, w, h, color = C.border) {
  slide.addShape(SH.downArrow, {
    x,
    y,
    w,
    h,
    fill: { color },
    line: { color },
  });
}

/* 01 · Portada */
{
  const { slide } = createSlide("dark");
  addText(slide, "CLASE 04 · SEMANA 02", {
    x: M,
    y: 0.72,
    w: 4.6,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });
  addText(slide, "Verificación", {
    x: M,
    y: 1.48,
    w: 7.8,
    h: 0.88,
    fontFace: TYPOGRAPHY.display,
    fontSize: 49,
    bold: true,
    color: C.white,
  });
  addText(slide, "y validación", {
    x: M,
    y: 2.36,
    w: 7.8,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 50,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Construir bien el producto y construir el producto correcto", {
    x: M,
    y: 3.5,
    w: 7.6,
    h: 0.6,
    fontSize: 19,
    color: C.softBlue,
  });
  addText(slide, "Martes 25 de agosto de 2026 · Laboratorio PC · Diego Obando", {
    x: M,
    y: 4.2,
    w: 7.8,
    h: 0.28,
    fontSize: 13,
    color: C.sand,
  });

  rect(slide, 8.86, 1.44, 3.7, 4.72, C.editorBg, C.titleFill, 0.08);
  addText(slide, "LAS DOS PREGUNTAS", {
    x: 9.24,
    y: 1.84,
    w: 2.94,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.2,
  });
  const cover = [
    ["VERIFICACIÓN", "¿cumple lo especificado?", CYAN_ON_NAVY],
    ["VALIDACIÓN", "¿era lo que se necesitaba?", C.gold],
  ];
  cover.forEach((item, index) => {
    const y = 2.3 + index * 1.46;
    rect(slide, 9.28, y, 2.86, 1.28, C.titleFill, C.titleFill, 0.06);
    addText(slide, item[0], {
      x: 9.4,
      y: y + 0.16,
      w: 2.62,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 1,
    });
    addText(slide, item[1], {
      x: 9.4,
      y: y + 0.5,
      w: 2.62,
      h: 0.62,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
    });
  });
  rule(slide, 9.28, 5.34, 2.86, C.red, 2.4);
  addText(slide, "Solo una tiene respuesta en la consola.", {
    x: 9.24,
    y: 5.56,
    w: 2.94,
    h: 0.5,
    fontSize: 13,
    color: C.sand,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 02 · Punto de partida */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "La Clase 03 cerró con tres criterios verificables",
    "Cada uno quedó redactado como una condición observable, con su evidencia planificada.",
  );
  const criterios = [
    {
      x: M,
      accent: C.red,
      number: "01",
      title: "Cálculo correcto",
      body: "El promedio se calcula con la regla declarada para el curso.",
      evidence: "Prueba automatizada",
    },
    {
      x: 4.82,
      accent: C.gold,
      number: "02",
      title: "Entrada inválida",
      body: "Una lista vacía informa el error en lugar de devolver un número.",
      evidence: "Prueba del error declarado",
    },
    {
      x: 8.92,
      accent: C.success,
      number: "03",
      title: "Cambio seguro",
      body: "Modificar la regla no rompe el resto del cálculo sin avisar.",
      evidence: "Revisión y suite existente",
    },
  ];
  criterios.forEach((item) => {
    rect(slide, item.x, CONTENT_TOP, 3.68, 2.96, C.white, C.border, 0.07);
    rect(slide, item.x, CONTENT_TOP, 3.68, 0.12, item.accent, item.accent);
    addCircleLabel(slide, item.x + 0.3, 2.82, 0.54, item.accent, item.number, {
      fontSize: 10,
      color: item.accent === C.gold ? C.ink : C.white,
    });
    addText(slide, item.title, {
      x: item.x + 1.02,
      y: 2.94,
      w: 2.44,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: C.ink,
    });
    addText(slide, item.body, {
      x: item.x + 0.3,
      y: 3.62,
      w: 3.08,
      h: 1.0,
      fontSize: 14.5,
      color: C.slate,
    });
    rule(slide, item.x + 0.3, 4.72, 3.08, C.border, 1);
    addText(slide, "EVIDENCIA PLANIFICADA", {
      x: item.x + 0.3,
      y: 4.86,
      w: 3.08,
      h: 0.18,
      fontSize: 8.8,
      bold: true,
      color: C.guide,
      charSpacing: 0.9,
    });
    addText(slide, item.evidence, {
      x: item.x + 0.3,
      y: 5.08,
      w: 3.08,
      h: 0.28,
      fontSize: 13.5,
      bold: true,
      color: onPaper(item.accent),
    });
  });
  rect(slide, 2.28, 5.86, 8.78, 0.6, C.navy, C.navy, 0.05);
  addText(slide, "Sabemos qué comprobar. Hoy preguntamos otra cosa: de dónde salió cada criterio.", {
    x: 2.56,
    y: 5.86,
    w: 8.22,
    h: 0.6,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 03 · Tensión inicial */
{
  const { slide } = createSlide("dark");
  addText(slide, "EL PROBLEMA DE HOY", {
    x: M,
    y: 0.84,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Un criterio impecable", {
    x: M,
    y: 1.42,
    w: 8.6,
    h: 0.74,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "puede ser el criterio equivocado", {
    x: M,
    y: 2.18,
    w: 10.7,
    h: 0.84,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
  });
  const done = ["CRITERIO ESCRITO", "PRUEBA ESCRITA", "SUITE EN VERDE"];
  done.forEach((item, index) => {
    addStatusPill(slide, M + index * 2.02, 3.62, 1.86, item, C.success, { fontSize: 9.6 });
  });
  addArrow(slide, 6.68, 3.61, 0.92, C.red);
  rect(slide, 7.94, 3.24, 4.46, 1.22, C.white, C.white, 0.06);
  addText(slide, "¿y si la regla nunca fue esa?", {
    x: 8.14,
    y: 3.24,
    w: 4.06,
    h: 1.22,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  addText(
    slide,
    "La evidencia técnica demuestra que el producto hace lo que le pedimos. No dice de dónde salió lo que le pedimos.",
    {
      x: 1.32,
      y: 5.32,
      w: 10.7,
      h: 0.86,
      fontSize: 20,
      bold: true,
      color: C.softBlue,
      align: "center",
      valign: "mid",
    },
  );
  validateSlide(slide, pptx);
}

/* 04 · La bifurcación */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Distinción",
    "Un mismo criterio admite dos preguntas distintas",
    "Lo que cambia no es la técnica: es contra qué se compara el resultado.",
  );
  rect(slide, 5.42, 2.42, 2.5, 0.5, C.navy, C.navy, 0.05);
  addText(slide, "UN CRITERIO", {
    x: 5.42,
    y: 2.42,
    w: 2.5,
    h: 0.5,
    fontSize: 11,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    charSpacing: 1.2,
  });
  vrule(slide, 6.67, 2.92, 0.2, C.guide, 1.4);
  rule(slide, 3.52, 3.12, 6.0, C.guide, 1.4);
  vrule(slide, 3.52, 3.12, 0.2, C.guide, 1.4);
  vrule(slide, 9.52, 3.12, 0.2, C.guide, 1.4);

  const branches = [
    {
      x: M,
      accent: CYAN,
      label: "VERIFICACIÓN",
      question: "¿El producto cumple lo especificado?",
      sourceLabel: "SE COMPARA CONTRA",
      source: "La especificación escrita",
      whoLabel: "LO RESPONDE",
      who: "El equipo técnico, con evidencia reproducible",
    },
    {
      x: 6.72,
      accent: C.gold,
      label: "VALIDACIÓN",
      question: "¿Lo especificado responde a la necesidad?",
      sourceLabel: "SE COMPARA CONTRA",
      source: "La necesidad real del producto",
      whoLabel: "LO RESPONDE",
      who: "Quien tiene autoridad sobre la regla",
    },
  ];
  branches.forEach((item) => {
    rect(slide, item.x, 3.32, 5.6, 2.9, C.white, C.border, 0.07);
    rect(slide, item.x, 3.32, 5.6, 0.12, item.accent, item.accent);
    addText(slide, item.label, {
      x: item.x + 0.34,
      y: 3.62,
      w: 4.92,
      h: 0.22,
      fontSize: 10.5,
      bold: true,
      color: onPaper(item.accent),
      charSpacing: 1.4,
    });
    addText(slide, item.question, {
      x: item.x + 0.34,
      y: 3.94,
      w: 4.92,
      h: 0.78,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.ink,
    });
    rule(slide, item.x + 0.34, 4.82, 4.92, C.border, 1);
    addText(slide, item.sourceLabel, {
      x: item.x + 0.34,
      y: 4.94,
      w: 2.3,
      h: 0.18,
      fontSize: 8.6,
      bold: true,
      color: C.guide,
      charSpacing: 0.9,
    });
    addText(slide, item.source, {
      x: item.x + 0.34,
      y: 5.16,
      w: 2.3,
      h: 0.62,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    vrule(slide, item.x + 2.86, 4.94, 0.84, C.border, 1);
    addText(slide, item.whoLabel, {
      x: item.x + 3.06,
      y: 4.94,
      w: 2.2,
      h: 0.18,
      fontSize: 8.6,
      bold: true,
      color: C.guide,
      charSpacing: 0.9,
    });
    addText(slide, item.who, {
      x: item.x + 3.06,
      y: 5.16,
      w: 2.2,
      h: 0.84,
      fontSize: 13,
      color: C.slate,
    });
  });
  addText(slide, "Ninguna de las dos sustituye a la otra.", {
    x: 2.52,
    y: 6.42,
    w: 8.3,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 05 · Objetivos */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Objetivos",
    "Tres movimientos organizan la sesión",
    "Del vocabulario a los casos, y de los casos al propio proyecto.",
  );
  const goals = [
    {
      accent: C.red,
      number: "01",
      verb: "DISTINGUIR",
      body: "Separar las dos preguntas y nombrar la fuente de verdad que responde cada una.",
      chip: "vocabulario",
    },
    {
      accent: CYAN,
      number: "02",
      verb: "DIAGNOSTICAR",
      body: "Leer tres fallas históricas y señalar con precisión la pregunta que faltó.",
      chip: "casos reales",
    },
    {
      accent: C.success,
      number: "03",
      verb: "TRAZAR",
      body: "Conectar necesidad, criterio y evidencia sobre el producto en el que trabajamos.",
      chip: "ficha propia",
    },
  ];
  goals.forEach((goal, index) => {
    const y = 2.5 + index * 1.24;
    rect(slide, M, y, 11.89, 1.08, C.white, C.border, 0.06);
    rect(slide, M, y, 0.14, 1.08, goal.accent, goal.accent);
    addCircleLabel(slide, M + 0.44, y + 0.28, 0.52, goal.accent, goal.number, {
      fontSize: 10,
      color: goal.accent === C.gold ? C.ink : C.white,
    });
    addText(slide, goal.verb, {
      x: M + 1.16,
      y: y + 0.32,
      w: 3.1,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: onPaper(goal.accent),
      charSpacing: 0.4,
    });
    addText(slide, goal.body, {
      x: M + 4.42,
      y: y + 0.3,
      w: 5.3,
      h: 0.52,
      fontSize: 15,
      color: C.ink,
      valign: "mid",
    });
    rect(slide, 10.72, y + 0.3, 1.72, 0.48, C.mist, C.border, 0.05);
    addText(slide, goal.chip, {
      x: 10.72,
      y: y + 0.3,
      w: 1.72,
      h: 0.48,
      fontSize: 11.5,
      bold: true,
      color: C.slate,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "Al cierre: qué quedó verificado, qué quedó validado y qué sigue sin respaldo.", {
    x: 2.02,
    y: 6.36,
    w: 9.3,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 06 · Mapa de la clase */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Recorrido",
    "Cómo avanza la sesión",
    "140 minutos, con trabajo individual sobre el proyecto propio en la segunda mitad.",
  );
  const stops = [
    ["08:30", "Encuadre", "Los criterios que ya tenemos", C.navy],
    ["08:40", "Bloque 1", "Las dos preguntas y su fuente", C.red],
    ["09:10", "Bloque 2", "Tres fallas históricas", CYAN],
    ["09:35", "Pausa", "Descanso técnico", C.guide],
    ["09:45", "Bloque 3", "Trazabilidad en el proyecto", C.gold],
    ["10:15", "Bloque 4", "Auditar al agente", C.success],
    ["10:40", "Cierre", "Conclusión proporcional", C.navy],
  ];
  rule(slide, 0.9, 3.62, 11.6, C.border, 1.6);
  stops.forEach((stop, index) => {
    const cx = 1.0 + index * 1.75;
    addText(slide, stop[0], {
      x: cx - 0.83,
      y: 3.0,
      w: 1.66,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12.5,
      bold: true,
      color: C.ink,
      align: "center",
    });
    slide.addShape(SH.ellipse, {
      x: cx - 0.14,
      y: 3.48,
      w: 0.28,
      h: 0.28,
      fill: { color: stop[3] },
      line: { color: stop[3] },
    });
    addText(slide, stop[1], {
      x: cx - 0.83,
      y: 3.98,
      w: 1.66,
      h: 0.28,
      fontSize: 14.5,
      bold: true,
      color: onPaper(stop[3]),
      align: "center",
    });
    addText(slide, stop[2], {
      x: cx - 0.83,
      y: 4.32,
      w: 1.66,
      h: 0.72,
      fontSize: 11.8,
      color: C.slate,
      align: "center",
    });
  });
  rect(slide, 1.62, 5.5, 10.1, 0.96, C.softNeutral, C.border, 0.06);
  addText(slide, "La clase avanza de la distinción al caso, y del caso al producto propio.", {
    x: 1.9,
    y: 5.66,
    w: 9.54,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addText(slide, "Los bloques 3 y 4 producen evidencia que queda en el repositorio de cada estudiante.", {
    x: 1.9,
    y: 6.02,
    w: 9.54,
    h: 0.28,
    fontSize: 13.5,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 07 · Vocabulario */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Vocabulario",
    "Cinco palabras que hoy dejan de ser sinónimos",
    "Con ellas se redactan los hallazgos y la conclusión final de la sesión.",
  );
  const words = [
    ["ESPECIFICACIÓN", "Lo que declaramos que el producto debe hacer.", C.red],
    ["NECESIDAD", "Lo que el producto debe lograr para quien lo usa.", C.gold],
    ["FUENTE", "Quién o qué documento autoriza un criterio.", CYAN],
    ["CORRESPONDENCIA", "Que lo verificado sea lo que está operando.", C.success],
    ["EVIDENCIA", "El resultado que permite sostener una afirmación.", C.navy],
  ];
  words.forEach((word, index) => {
    const x = M + index * 2.4;
    rect(slide, x, CONTENT_TOP, 2.28, 3.2, C.white, C.border, 0.06);
    rect(slide, x, CONTENT_TOP, 2.28, 0.1, word[2], word[2]);
    addText(slide, String(index + 1).padStart(2, "0"), {
      x: x + 0.24,
      y: 2.72,
      w: 1.8,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: C.border,
    });
    addText(slide, word[0], {
      x: x + 0.24,
      y: 3.3,
      w: 1.9,
      h: 0.6,
      fontSize: 11.2,
      bold: true,
      color: onPaper(word[2]),
      charSpacing: 0.3,
    });
    rule(slide, x + 0.24, 4.06, 1.8, C.border, 1);
    addText(slide, word[1], {
      x: x + 0.24,
      y: 4.2,
      w: 1.86,
      h: 1.3,
      fontSize: 13,
      color: C.slate,
    });
  });
  rect(slide, 2.28, 6.06, 8.78, 0.56, C.navy, C.navy, 0.05);
  addText(slide, "El ticket de salida se escribe con estas cinco palabras y ninguna más.", {
    x: 2.56,
    y: 6.06,
    w: 8.22,
    h: 0.56,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 08 · Apertura Bloque 1 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 1 · 30 MINUTOS", {
    x: M,
    y: 0.9,
    w: 5.2,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.9,
  });
  addText(slide, "Dos preguntas", {
    x: M,
    y: 1.6,
    w: 7.4,
    h: 0.82,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.white,
  });
  addText(slide, "que no se responden", {
    x: M,
    y: 2.44,
    w: 7.4,
    h: 0.66,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.softBlue,
  });
  addText(slide, "con la misma evidencia", {
    x: M,
    y: 3.12,
    w: 7.4,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 4.16, 3.2, C.red, 2.6);
  addText(slide, "Al terminar el bloque podrás explicar por qué una prueba en verde puede estar defendiendo una regla equivocada.", {
    x: M,
    y: 4.42,
    w: 6.9,
    h: 0.9,
    fontSize: 15.5,
    color: C.sand,
  });
  const agenda = [
    ["1.1", "El criterio y su origen"],
    ["1.2", "Verificación y validación"],
    ["1.3", "La prueba que certifica un error"],
    ["1.4", "Los cuatro escenarios posibles"],
  ];
  agenda.forEach((item, index) => {
    const y = 1.72 + index * 1.1;
    addText(slide, item[0], {
      x: 8.5,
      y,
      w: 0.7,
      h: 0.32,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color: C.gold,
    });
    addText(slide, item[1], {
      x: 9.3,
      y: y - 0.02,
      w: 3.1,
      h: 0.66,
      fontSize: 15.5,
      bold: true,
      color: C.white,
    });
    rule(slide, 8.5, y + 0.78, 3.9, C.titleFill, 1.2);
  });
  validateSlide(slide, pptx);
}

/* 09 · La ficha del criterio */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.1 · El criterio y su origen",
    "Un criterio bien redactado no dice de dónde salió",
    "La ficha que trajimos de la clase anterior tiene un campo que nunca completamos.",
  );
  rect(slide, M, CONTENT_TOP, 6.7, 3.92, C.white, C.border, 0.07);
  addText(slide, "FICHA DE CRITERIO · 01", {
    x: M + 0.34,
    y: 2.74,
    w: 4.0,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.guide,
    charSpacing: 1.1,
  });
  addText(slide, "Cálculo correcto", {
    x: M + 0.34,
    y: 3.02,
    w: 5.0,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.ink,
  });
  rule(slide, M + 0.34, 3.52, 6.02, C.border, 1);
  const fields = [
    ["CONDICIÓN OBSERVABLE", "El promedio se calcula con la regla declarada.", C.success],
    ["EVIDENCIA PLANIFICADA", "Prueba automatizada sobre casos del curso.", C.success],
  ];
  fields.forEach((field, index) => {
    const y = 3.68 + index * 0.86;
    rect(slide, M + 0.34, y + 0.04, 0.1, 0.58, field[2], field[2]);
    addText(slide, field[0], {
      x: M + 0.62,
      y,
      w: 3.6,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color: C.guide,
      charSpacing: 0.9,
    });
    addText(slide, field[1], {
      x: M + 0.62,
      y: y + 0.24,
      w: 5.6,
      h: 0.4,
      fontSize: 15,
      color: C.ink,
    });
  });
  rectDashed(slide, M + 0.34, 5.42, 6.02, 0.86, C.paleRed, onPaper(C.red), 0.05);
  addText(slide, "FUENTE QUE LO AUTORIZA", {
    x: M + 0.6,
    y: 5.58,
    w: 3.6,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 0.9,
  });
  addText(slide, "sin registrar", {
    x: M + 0.6,
    y: 5.82,
    w: 5.5,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: onPaper(C.red),
  });

  const callouts = [
    {
      y: 2.62,
      accent: onPaper(C.success),
      title: "Esto sí lo comprobamos",
      body: "La condición es observable y la evidencia es reproducible por cualquiera del equipo.",
    },
    {
      y: 4.5,
      accent: onPaper(C.red),
      title: "Esto nunca lo preguntamos",
      body: "Nadie registró qué documento o qué persona autoriza la regla que estamos verificando.",
    },
  ];
  callouts.forEach((callout) => {
    rect(slide, 7.78, callout.y, 4.84, 1.62, C.white, C.border, 0.07);
    rect(slide, 7.78, callout.y, 0.12, 1.62, callout.accent, callout.accent);
    addText(slide, callout.title, {
      x: 8.14,
      y: callout.y + 0.26,
      w: 4.2,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: callout.accent,
    });
    addText(slide, callout.body, {
      x: 8.14,
      y: callout.y + 0.72,
      w: 4.24,
      h: 0.76,
      fontSize: 13.5,
      color: C.slate,
    });
  });
  validateSlide(slide, pptx);
}

/* 10 · La consola responde una sola pregunta */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.1 · Alcance de la evidencia",
    "La consola responde una de las dos preguntas",
    "La otra no tiene salida posible, por más controles que ejecutemos.",
  );
  addTerminalPanel(slide, SH, {
    x: M,
    y: CONTENT_TOP,
    w: 6.5,
    h: 2.6,
    title: "PowerShell · controles del proyecto",
    fontSize: 11.6,
    lines: [
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "0 errors" },
      { prompt: ">", text: "uv run pytest -q" },
      { text: "...   [100%]   3 passed" },
    ],
  });
  rect(slide, M, 5.26, 6.5, 1.02, C.successSoft, onPaper(C.success), 0.06);
  addText(slide, "PREGUNTA RESPONDIDA", {
    x: M + 0.28,
    y: 5.44,
    w: 3.4,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: onPaper(C.success),
    charSpacing: 1,
  });
  addText(slide, "¿El producto cumple lo especificado?", {
    x: M + 0.28,
    y: 5.7,
    w: 5.9,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });

  rect(slide, 7.5, CONTENT_TOP, 5.12, 2.6, C.mist, C.border, 0.06);
  addText(slide, "LA SEGUNDA PREGUNTA", {
    x: 7.84,
    y: 2.74,
    w: 4.4,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: C.guide,
    charSpacing: 1,
  });
  addText(slide, "¿Era ese el criterio correcto para este producto?", {
    x: 7.84,
    y: 3.02,
    w: 4.44,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18.5,
    bold: true,
    color: C.ink,
  });
  rectDashed(slide, 7.84, 4.2, 4.44, 0.7, C.paper, C.guide, 0.05);
  addText(slide, "sin salida en consola", {
    x: 7.84,
    y: 4.2,
    w: 4.44,
    h: 0.7,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    color: C.guide,
    align: "center",
    valign: "mid",
  });
  rect(slide, 7.5, 5.26, 5.12, 1.02, C.navy, C.navy, 0.06);
  addText(slide, "Ninguna herramienta conoce el reglamento del curso.", {
    x: 7.78,
    y: 5.26,
    w: 4.56,
    h: 1.02,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 11 · Boehm */
{
  const { slide } = createSlide("dark");
  addText(slide, "1.2 · LA FORMULACIÓN CLÁSICA", {
    x: M,
    y: 0.86,
    w: 5.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  rect(slide, M, 1.66, 0.14, 1.5, CYAN_ON_NAVY, CYAN_ON_NAVY);
  addText(slide, "VERIFICACIÓN", {
    x: M + 0.42,
    y: 1.7,
    w: 3.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.5,
  });
  addText(slide, "¿Estamos construyendo bien el producto?", {
    x: M + 0.42,
    y: 2.06,
    w: 10.6,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 33,
    bold: true,
    color: C.white,
  });
  rect(slide, M, 3.62, 0.14, 1.5, C.gold, C.gold);
  addText(slide, "VALIDACIÓN", {
    x: M + 0.42,
    y: 3.66,
    w: 3.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.5,
  });
  addText(slide, "¿Estamos construyendo el producto correcto?", {
    x: M + 0.42,
    y: 4.02,
    w: 10.6,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 33,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 5.5, 11.89, C.titleFill, 1.4);
  addText(slide, "Barry Boehm · 1979 y 1981", {
    x: M,
    y: 5.7,
    w: 5.0,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: C.sand,
  });
  addText(slide, "Dos frases casi idénticas que separan dos oficios distintos.", {
    x: 6.2,
    y: 5.7,
    w: 6.41,
    h: 0.3,
    fontSize: 14,
    color: C.softBlue,
    align: "right",
  });
  validateSlide(slide, pptx);
}

/* 12 · La norma */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · Norma",
    "ISO/IEC/IEEE 12207:2017 las define como procesos separados",
    "No son dos nombres para la misma actividad: son dos procesos del ciclo de vida.",
  );
  const processes = [
    {
      y: CONTENT_TOP,
      accent: CYAN,
      name: "VERIFICACIÓN",
      definition: "Confirmar que se cumplen los requisitos especificados.",
      note: "El requisito ya existe y se toma como dado.",
    },
    {
      y: 4.16,
      accent: C.gold,
      name: "VALIDACIÓN",
      definition: "Confirmar que se cumplen los requisitos para el uso previsto.",
      note: "El uso previsto vive fuera del proyecto y hay que ir a buscarlo.",
    },
  ];
  processes.forEach((item) => {
    rect(slide, M, item.y, 11.89, 1.5, C.white, C.border, 0.07);
    rect(slide, M, item.y, 3.1, 1.5, onPaper(item.accent), onPaper(item.accent), 0.07);
    addText(slide, item.name, {
      x: M + 0.2,
      y: item.y,
      w: 2.7,
      h: 1.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, item.definition, {
      x: 4.14,
      y: item.y + 0.26,
      w: 8.2,
      h: 0.66,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.ink,
    });
    addText(slide, item.note, {
      x: 4.14,
      y: item.y + 1.0,
      w: 8.2,
      h: 0.34,
      fontSize: 14,
      color: C.slate,
    });
  });
  rect(slide, 2.28, 6.06, 8.78, 0.6, C.navy, C.navy, 0.05);
  addText(slide, "La diferencia decisiva está en contra qué se compara el resultado.", {
    x: 2.56,
    y: 6.06,
    w: 8.22,
    h: 0.6,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 13 · Tabla comparativa */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · Comparación",
    "Cinco diferencias que conviene tener a mano",
    "La misma fila se lee distinto según la columna en que se responda.",
  );
  const colX = [3.22, 7.94];
  const colW = 4.66;
  const headers = [
    ["VERIFICACIÓN", CYAN],
    ["VALIDACIÓN", C.gold],
  ];
  headers.forEach((header, index) => {
    rect(slide, colX[index], 2.4, colW, 0.5, onPaper(header[1]), onPaper(header[1]), 0.05);
    addText(slide, header[0], {
      x: colX[index],
      y: 2.4,
      w: colW,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 1.3,
    });
  });
  const rows = [
    ["La pregunta", "¿Cumple lo especificado?", "¿Lo especificado responde a la necesidad?"],
    ["La fuente de verdad", "La especificación y el contrato de la función", "La regla del negocio y quien la autoriza"],
    ["Quién responde", "El equipo técnico", "Usuario, docente, reglamento o cliente"],
    ["Evidencia típica", "Pruebas, análisis estático, revisión", "Confrontación con el documento o el uso real"],
    ["Error que detecta", "La implementación no corresponde a lo definido", "Lo definido no corresponde a lo necesario"],
  ];
  rows.forEach((row, index) => {
    const y = 3.0 + index * 0.76;
    if (index % 2 === 0) {
      rect(slide, M, y, 11.89, 0.7, C.white, C.white, 0.04);
    }
    addText(slide, row[0], {
      x: M + 0.1,
      y: y + 0.02,
      w: 2.3,
      h: 0.66,
      fontSize: 12.5,
      bold: true,
      color: C.slate,
      valign: "mid",
    });
    addText(slide, row[1], {
      x: colX[0] + 0.22,
      y: y + 0.02,
      w: colW - 0.44,
      h: 0.66,
      fontSize: 14,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, row[2], {
      x: colX[1] + 0.22,
      y: y + 0.02,
      w: colW - 0.44,
      h: 0.66,
      fontSize: 14,
      color: C.ink,
      valign: "mid",
    });
  });
  vrule(slide, 7.84, 2.4, 4.4, C.border, 1.2);
  vrule(slide, 3.12, 2.4, 4.4, C.border, 1.2);
  validateSlide(slide, pptx);
}

/* 14 · El borde del proyecto */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · Alcance",
    "Una de las dos preguntas obliga a salir del proyecto",
    "Todo lo que necesitamos para verificar cabe dentro del repositorio. La necesidad, no.",
  );
  rect(slide, M, CONTENT_TOP, 6.7, 3.72, C.white, C.border, 0.08);
  addText(slide, "DENTRO DEL PROYECTO", {
    x: M + 0.34,
    y: 2.72,
    w: 4.4,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 1.1,
  });
  const inside = ["Código fuente", "Pruebas automatizadas", "Reglas del linter", "Contrato de tipos", "Criterios escritos"];
  inside.forEach((item, index) => {
    const y = 3.02 + index * 0.5;
    rect(slide, M + 0.34, y, 0.1, 0.42, onPaper(CYAN), onPaper(CYAN));
    addText(slide, item, {
      x: M + 0.66,
      y,
      w: 5.6,
      h: 0.42,
      fontSize: 15,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, M + 0.34, 5.44, 6.02, 0.5, C.mist, C.border, 0.05);
  addText(slide, "Aquí vive toda la verificación posible.", {
    x: M + 0.34,
    y: 5.44,
    w: 6.02,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: C.slate,
    align: "center",
    valign: "mid",
  });

  rect(slide, 8.1, CONTENT_TOP, 4.5, 3.72, C.softNeutral, C.border, 0.08);
  addText(slide, "FUERA DEL PROYECTO", {
    x: 8.4,
    y: 2.72,
    w: 4.0,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.1,
  });
  const outside = ["Reglamento de evaluación", "Quien usa la herramienta", "La norma que aplica", "La decisión del cliente"];
  outside.forEach((item, index) => {
    const y = 3.02 + index * 0.5;
    rect(slide, 8.4, y, 0.1, 0.42, onPaper(C.gold), onPaper(C.gold));
    addText(slide, item, {
      x: 8.72, y, w: 3.6, h: 0.42,
      fontSize: 15, color: C.ink, valign: "mid",
    });
  });
  rect(slide, 8.4, 5.44, 3.9, 0.5, C.warm, C.border, 0.05);
  addText(slide, "Aquí vive la validación.", {
    x: 8.4,
    y: 5.44,
    w: 3.9,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  addArrow(slide, 7.52, 3.94, 0.5, onPaper(C.red));
  addText(slide, "Validar es cruzar este borde. No hay comando que lo haga por nosotros.", {
    x: 2.02,
    y: 6.42,
    w: 9.3,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 15 · Declaración */
{
  const { slide } = createSlide("dark");
  addText(slide, "1.2 · CONSECUENCIA", {
    x: M,
    y: 0.9,
    w: 4.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Podemos verificar solos.", {
    x: M,
    y: 1.72,
    w: 11.0,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  addText(slide, "No podemos validar solos.", {
    x: M,
    y: 2.72,
    w: 11.0,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.98, 4.2, C.red, 2.6);
  addText(
    slide,
    "La necesidad vive fuera del código y alguien con autoridad tiene que declararla. Mientras eso no ocurra, el criterio es una decisión del equipo, no una regla del producto.",
    {
      x: M,
      y: 4.3,
      w: 7.4,
      h: 1.4,
      fontSize: 17,
      color: C.softBlue,
    },
  );
  rect(slide, 8.66, 4.14, 3.9, 1.86, C.titleFill, C.titleFill, 0.07);
  addText(slide, "REGLA PRÁCTICA", {
    x: 8.94,
    y: 4.42,
    w: 3.34,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.1,
  });
  addText(slide, "Si nadie fuera del equipo puede confirmarlo, todavía no está validado.", {
    x: 8.94,
    y: 4.78,
    w: 3.34,
    h: 1.0,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 16 · Lo que la verificación sí resolvió */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · Antecedente",
    "En la Clase 02 la verificación funcionó exactamente como debía",
    "La implementación no correspondía a la expectativa y la prueba lo demostró.",
  );
  const steps = [
    ["01", "PRUEBA ROJA", "La expectativa escrita no coincidía con el resultado obtenido.", C.red],
    ["02", "DIAGNÓSTICO", "El mensaje señaló valor esperado, valor obtenido y línea.", C.gold],
    ["03", "VERDE", "La corrección quedó respaldada por una ejecución repetible.", C.success],
  ];
  steps.forEach((step, index) => {
    const x = M + index * 4.06;
    rect(slide, x, CONTENT_TOP, 3.78, 2.34, C.white, C.border, 0.07);
    addCircleLabel(slide, x + 0.32, 2.76, 0.54, step[3], step[0], {
      fontSize: 10,
      color: step[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, step[1], {
      x: x + 1.04,
      y: 2.88,
      w: 2.4,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color: onPaper(step[3]),
      charSpacing: 0.9,
    });
    addText(slide, step[2], {
      x: x + 0.32,
      y: 3.56,
      w: 3.16,
      h: 1.0,
      fontSize: 14,
      color: C.slate,
    });
    if (index < steps.length - 1) {
      addArrow(slide, x + 3.84, 3.4, 0.18, C.border);
    }
  });
  rect(slide, M, 5.2, 11.89, 1.14, C.successSoft, onPaper(C.success), 0.06);
  addText(slide, "Ese ciclo respondió la primera pregunta: el producto cumple lo que la prueba especifica.", {
    x: M + 0.4,
    y: 5.4,
    w: 11.09,
    h: 0.34,
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  addText(slide, "La segunda pregunta no participó en ningún momento de ese ciclo.", {
    x: M + 0.4,
    y: 5.88,
    w: 11.09,
    h: 0.34,
    fontSize: 14,
    color: onPaper(C.red),
  });
  validateSlide(slide, pptx);
}

/* 17 · La prueba impecable */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · El código de hoy",
    "Una prueba impecable sobre una decisión que nadie tomó",
    "Todo el archivo es correcto. El problema no está en ninguna línea mal escrita.",
  );
  const code = [
    "def nota_final(notas: list[float]) -> float:",
    '    """Calcula el promedio redondeado a un decimal."""',
    "    promedio: float = sum(notas) / len(notas)",
    "    return round(promedio, 1)",
    "",
    "",
    "def test_promedio_de_tres_evaluaciones():",
    "    assert nota_final([3.5, 3.5, 4.8]) == 3.9",
  ].join("\n");
  addCodeGuide(slide, SH, {
    editor: {
      x: M,
      y: CONTENT_TOP,
      w: 7.16,
      h: 3.9,
      title: "notas.py · versión vigente del proyecto",
      code,
      lang: "python",
      fontSize: 13,
    },
    guide: { x: 8.62, y: CONTENT_TOP, w: 3.98, h: 3.9, title: "Dónde mirar" },
    notes: [
      {
        lineNumber: 3,
        color: CYAN,
        eyebrow: "Decisión sin autor",
        title: "Promedio simple",
        titleFontSize: 17,
        body: "Reparte el mismo peso a las tres evaluaciones. Nadie lo autorizó.",
        bodyFontSize: 12.4,
      },
      {
        lineNumber: 8,
        color: C.success,
        eyebrow: "Comportamiento documentado",
        title: "La prueba pasa",
        titleFontSize: 17,
        body: "Fija 3,9 como resultado esperado y la implementación lo cumple sin objeciones.",
        bodyFontSize: 12.6,
      },
    ],
  });
  addText(slide, "El defecto no está en el código: está en el supuesto que el código convirtió en regla.", {
    x: 2.02,
    y: 6.5,
    w: 9.3,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 18 · Todo conforme, menos una casilla */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · Estado de los controles",
    "Cuatro señales conformes y una casilla que nadie revisa",
    "Las herramientas responden lo que saben responder, y lo hacen bien.",
  );
  const checks = [
    ["LINTER", "sin hallazgos", C.success],
    ["TIPOS", "sin contradicciones", C.success],
    ["PRUEBA", "3 passed", C.success],
    ["REVISIÓN", "código legible", C.success],
  ];
  checks.forEach((check, index) => {
    const x = M + index * 2.42;
    rect(slide, x, CONTENT_TOP, 2.26, 2.1, C.white, C.border, 0.07);
    rect(slide, x, CONTENT_TOP, 2.26, 0.1, onPaper(check[2]), onPaper(check[2]));
    addText(slide, "✓", {
      x,
      y: 2.78,
      w: 2.26,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 34,
      bold: true,
      color: onPaper(check[2]),
      align: "center",
    });
    addText(slide, check[0], {
      x,
      y: 3.5,
      w: 2.26,
      h: 0.24,
      fontSize: 12.5,
      bold: true,
      color: C.ink,
      align: "center",
      charSpacing: 1,
    });
    addText(slide, check[1], {
      x: x + 0.14,
      y: 3.82,
      w: 1.98,
      h: 0.5,
      fontSize: 13,
      color: C.slate,
      align: "center",
    });
  });
  rectDashed(slide, 10.4, CONTENT_TOP, 2.22, 2.1, C.paleRed, onPaper(C.red), 0.07);
  addText(slide, "?", {
    x: 10.4,
    y: 2.78,
    w: 2.22,
    h: 0.56,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });
  addText(slide, "FUENTE", {
    x: 10.4,
    y: 3.5,
    w: 2.22,
    h: 0.24,
    fontSize: 12.5,
    bold: true,
    color: onPaper(C.red),
    align: "center",
    charSpacing: 1,
  });
  addText(slide, "nadie la revisa", {
    x: 10.5,
    y: 3.82,
    w: 2.02,
    h: 0.5,
    fontSize: 13,
    color: onPaper(C.red),
    align: "center",
  });
  rect(slide, M, 5.06, 11.89, 1.24, C.navy, C.navy, 0.06);
  addText(slide, "Las cuatro primeras columnas comparan el producto con lo que está escrito.", {
    x: M + 0.44,
    y: 5.28,
    w: 11.01,
    h: 0.34,
    fontSize: 16.5,
    bold: true,
    color: C.white,
  });
  addText(slide, "La quinta compara lo escrito con la realidad, y ninguna herramienta la ejecuta.", {
    x: M + 0.44,
    y: 5.74,
    w: 11.01,
    h: 0.34,
    fontSize: 16.5,
    bold: true,
    color: C.gold,
  });
  validateSlide(slide, pptx);
}

/* 19 · La pregunta que falta */
{
  const { slide } = createSlide("dark");
  addText(slide, "1.3 · LA PREGUNTA QUE NINGUNA HERRAMIENTA HACE", {
    x: M,
    y: 0.9,
    w: 8.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.6,
  });
  addText(slide, "¿Quién autorizó", {
    x: M,
    y: 1.78,
    w: 11.0,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.white,
  });
  addText(slide, "que las tres evaluaciones pesaran lo mismo?", {
    x: M,
    y: 2.86,
    w: 11.4,
    h: 1.2,
    fontFace: TYPOGRAPHY.display,
    fontSize: 35,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 4.3, 5.2, C.red, 2.6);
  addText(
    slide,
    "La función calcula un promedio simple porque así se escribió, no porque alguien lo haya decidido.",
    {
      x: M,
      y: 4.62,
      w: 11.4,
      h: 0.6,
      fontSize: 19,
      color: C.softBlue,
    },
  );
  const marks = [
    ["sum(notas) / len(notas)", "lo que hace el código"],
    ["30 % · 30 % · 40 %", "lo que podría exigir el reglamento"],
  ];
  marks.forEach((mark, index) => {
    const x = M + index * 5.94;
    rect(slide, x, 5.42, 5.5, 0.94, index === 0 ? C.titleFill : C.white, index === 0 ? C.titleFill : C.white, 0.06);
    addText(slide, mark[0], {
      x: x + 0.28,
      y: 5.58,
      w: 4.94,
      h: 0.32,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 16,
      bold: true,
      color: index === 0 ? C.white : C.ink,
    });
    addText(slide, mark[1], {
      x: x + 0.28,
      y: 5.96,
      w: 4.94,
      h: 0.26,
      fontSize: 12.5,
      color: index === 0 ? C.softBlue : C.slate,
    });
  });
  validateSlide(slide, pptx);
}

/* 20 · El mismo insumo, dos reglas */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · El cálculo",
    "Las mismas notas, dos reglas, dos calificaciones",
    "Ninguna de las dos operaciones está mal hecha. Solo una está autorizada.",
  );
  addText(slide, "NOTAS DE UN ESTUDIANTE", {
    x: M,
    y: CONTENT_TOP,
    w: 3.2,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.guide,
    charSpacing: 1.1,
  });
  ["3,5", "3,5", "4,8"].forEach((nota, index) => {
    const x = M + index * 0.92;
    rect(slide, x, 2.76, 0.8, 0.8, C.navy, C.navy, 0.06);
    addText(slide, nota, {
      x,
      y: 2.76,
      w: 0.8,
      h: 0.8,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
  });
  const branches = [
    {
      y: 2.66,
      accent: CYAN,
      label: "PROMEDIO SIMPLE",
      formula: "(3,5 + 3,5 + 4,8) ÷ 3  =  3,93",
      result: "3,9",
      verdict: "REPRUEBA",
      verdictColor: C.red,
      note: "Es lo que hace hoy el código.",
    },
    {
      y: 4.44,
      accent: C.gold,
      label: "PONDERADO 30 · 30 · 40",
      formula: "1,05 + 1,05 + 1,92  =  4,02",
      result: "4,0",
      verdict: "APRUEBA",
      verdictColor: C.success,
      note: "Es lo que podría exigir el reglamento.",
    },
  ];
  branches.forEach((branch) => {
    rect(slide, 3.9, branch.y, 8.72, 1.62, C.white, C.border, 0.07);
    rect(slide, 3.9, branch.y, 0.12, 1.62, onPaper(branch.accent), onPaper(branch.accent));
    addText(slide, branch.label, {
      x: 4.24,
      y: branch.y + 0.22,
      w: 3.6,
      h: 0.2,
      fontSize: 9.6,
      bold: true,
      color: onPaper(branch.accent),
      charSpacing: 1.1,
    });
    addText(slide, branch.formula, {
      x: 4.24,
      y: branch.y + 0.56,
      w: 4.6,
      h: 0.36,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15.5,
      color: C.ink,
    });
    addText(slide, branch.note, {
      x: 4.24,
      y: branch.y + 1.04,
      w: 4.6,
      h: 0.3,
      fontSize: 13,
      color: C.slate,
    });
    vrule(slide, 9.06, branch.y + 0.24, 1.14, C.border, 1.2);
    addText(slide, branch.result, {
      x: 9.24,
      y: branch.y + 0.3,
      w: 1.5,
      h: 1.0,
      fontFace: TYPOGRAPHY.display,
      fontSize: 40,
      bold: true,
      color: C.ink,
      align: "center",
      valign: "mid",
    });
    rect(slide, 10.86, branch.y + 0.52, 1.5, 0.58, onPaper(branch.verdictColor), onPaper(branch.verdictColor), 0.05);
    addText(slide, branch.verdict, {
      x: 10.86,
      y: branch.y + 0.52,
      w: 1.5,
      h: 0.58,
      fontSize: 12,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
  });
  addText(slide, "Una prueba puede comprobar cualquiera de las dos. Elegir cuál corresponde no es una tarea técnica.", {
    x: 1.62,
    y: 6.34,
    w: 10.1,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 21 · El patrón en tres casos */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · El patrón",
    "No es un caso aislado: la regla decide en ambos sentidos",
    "En el centro del rango las dos reglas coinciden. Cerca del umbral, no.",
  );
  const head = ["Notas del estudiante", "Promedio simple", "Ponderado 30·30·40", "Qué decide la regla"];
  const widths = [3.5, 2.4, 2.6, 3.39];
  let cursor = M;
  const colXs = widths.map((width) => {
    const x = cursor;
    cursor += width;
    return x;
  });
  rect(slide, M, 2.44, 11.89, 0.54, C.navy, C.navy, 0.05);
  head.forEach((label, index) => {
    addText(slide, label, {
      x: colXs[index] + 0.2,
      y: 2.44,
      w: widths[index] - 0.4,
      h: 0.54,
      fontSize: 11.5,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 0.6,
    });
  });
  const cases = [
    ["3,5 · 3,5 · 4,8", "3,9", "4,0", "Reprueba con una y aprueba con la otra", onPaper(C.red)],
    ["4,5 · 4,5 · 3,0", "4,0", "3,9", "Aprueba con una y reprueba con la otra", onPaper(C.red)],
    ["4,0 · 4,0 · 3,0", "3,7", "3,6", "Las dos coinciden en la decisión", C.slate],
  ];
  cases.forEach((row, index) => {
    const y = 3.06 + index * 1.02;
    rect(slide, M, y, 11.89, 0.92, C.white, C.border, 0.05);
    rect(slide, M, y, 0.1, 0.92, row[4], row[4]);
    addText(slide, row[0], {
      x: colXs[0] + 0.3,
      y,
      w: widths[0] - 0.5,
      h: 0.92,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 16,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, row[1], {
      x: colXs[1] + 0.2,
      y,
      w: widths[1] - 0.4,
      h: 0.92,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color: onPaper(CYAN),
      valign: "mid",
    });
    addText(slide, row[2], {
      x: colXs[2] + 0.2,
      y,
      w: widths[2] - 0.4,
      h: 0.92,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color: onPaper(C.gold),
      valign: "mid",
    });
    addText(slide, row[3], {
      x: colXs[3] + 0.2,
      y,
      w: widths[3] - 0.4,
      h: 0.92,
      fontSize: 14,
      color: row[4] === C.slate ? C.slate : C.ink,
      valign: "mid",
    });
  });
  rect(slide, 1.62, 6.2, 10.1, 0.6, C.paleRed, onPaper(C.red), 0.05);
  addText(slide, "En dos de los tres casos, la regla no autorizada decide si un estudiante aprueba.", {
    x: 1.9,
    y: 6.2,
    w: 9.54,
    h: 0.6,
    fontSize: 15.5,
    bold: true,
    color: onPaper(C.red),
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 22 · Una prueba es una especificación ejecutable */
{
  const { slide } = createSlide("dark");
  addText(slide, "1.3 · IDEA CENTRAL", {
    x: M,
    y: 0.9,
    w: 4.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Una prueba es una", {
    x: M,
    y: 1.7,
    w: 11.0,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  addText(slide, "especificación ejecutable", {
    x: M,
    y: 2.62,
    w: 11.4,
    h: 0.98,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Hereda todo lo bueno y todo lo equivocado de la expectativa que la originó.", {
    x: M,
    y: 3.82,
    w: 11.4,
    h: 0.42,
    fontSize: 19,
    color: C.softBlue,
  });
  const chain = [
    ["EXPECTATIVA", "alguien decide qué se espera", CYAN_ON_NAVY],
    ["PRUEBA", "la expectativa queda ejecutable", C.gold],
    ["VERDE", "el producto la cumple", C.success],
  ];
  chain.forEach((item, index) => {
    const x = 0.9 + index * 4.0;
    rect(slide, x, 4.66, 3.6, 1.44, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 4.94,
      w: 3.12,
      h: 0.2,
      fontSize: 9.8,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 5.3,
      w: 3.12,
      h: 0.56,
      fontSize: 14.5,
      bold: true,
      color: C.white,
      align: "center",
    });
    if (index < chain.length - 1) {
      addArrow(slide, x + 3.66, 5.16, 0.22, C.red);
    }
  });
  validateSlide(slide, pptx);
}

/* 23 · La suite blinda el error */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · Consecuencia práctica",
    "Cuando la expectativa es incorrecta, la suite protege el error",
    "El mismo mecanismo que evita regresiones también conserva una regla que nadie autorizó.",
  );
  const stages = [
    ["01", "Se escribe el criterio", "El equipo decide un comportamiento razonable.", C.navy],
    ["02", "La prueba lo fija", "La expectativa queda registrada y ejecutable.", CYAN],
    ["03", "El criterio se corrige", "Alguien descubre que la regla real era otra.", C.gold],
    ["04", "La prueba se rompe", "La corrección aparece como una falla del producto.", C.red],
  ];
  stages.forEach((stage, index) => {
    const x = M + index * 3.02;
    const isLast = index === stages.length - 1;
    rect(slide, x, CONTENT_TOP, 2.84, 2.66, isLast ? C.paleRed : C.white, isLast ? onPaper(C.red) : C.border, 0.07);
    addCircleLabel(slide, x + 0.28, 2.74, 0.5, onPaper(stage[3]), stage[0], {
      fontSize: 9.6,
      color: C.white,
    });
    addText(slide, stage[1], {
      x: x + 0.28,
      y: 3.42,
      w: 2.3,
      h: 0.66,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color: C.ink,
    });
    addText(slide, stage[2], {
      x: x + 0.28,
      y: 4.18,
      w: 2.3,
      h: 0.86,
      fontSize: 13,
      color: C.slate,
    });
    if (!isLast) {
      addArrow(slide, x + 2.88, 3.5, 0.14, C.border);
    }
  });
  rect(slide, M, 5.5, 11.89, 0.86, C.navy, C.navy, 0.06);
  addText(slide, "Cuanto más tarde se descubre, más caro sale: hay que cambiar el código y además todas las pruebas que defendían la regla equivocada.", {
    x: M + 0.4,
    y: 5.5,
    w: 11.09,
    h: 0.86,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 24 · Defecto o hallazgo de validación */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · Cómo se registra",
    "No es un defecto: es un criterio que nadie validó",
    "La distinción cambia quién debe actuar, no solo cómo se llama el hallazgo.",
  );
  const kinds = [
    {
      x: M,
      accent: C.red,
      kind: "DEFECTO",
      claim: "El programa no hace lo que se le pidió.",
      who: "Actúa el equipo técnico",
      how: "Se corrige en el código y se comprueba con una prueba.",
    },
    {
      x: 6.72,
      accent: C.gold,
      kind: "HALLAZGO DE VALIDACIÓN",
      claim: "El programa hace exactamente lo que se le pidió, y aun así el resultado no sirve.",
      who: "Actúa quien tiene autoridad sobre la regla",
      how: "Se resuelve consultando la fuente y recién después se programa.",
    },
  ];
  kinds.forEach((kind) => {
    rect(slide, kind.x, CONTENT_TOP, 5.6, 3.34, C.white, C.border, 0.07);
    rect(slide, kind.x, CONTENT_TOP, 5.6, 0.12, onPaper(kind.accent), onPaper(kind.accent));
    addText(slide, kind.kind, {
      x: kind.x + 0.34,
      y: 2.76,
      w: 4.92,
      h: 0.24,
      fontSize: 11.5,
      bold: true,
      color: onPaper(kind.accent),
      charSpacing: 1.3,
    });
    addText(slide, kind.claim, {
      x: kind.x + 0.34,
      y: 3.14,
      w: 4.92,
      h: 0.9,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.ink,
    });
    rule(slide, kind.x + 0.34, 4.2, 4.92, C.border, 1);
    addText(slide, kind.who, {
      x: kind.x + 0.34,
      y: 4.36,
      w: 4.92,
      h: 0.3,
      fontSize: 14.5,
      bold: true,
      color: onPaper(kind.accent),
    });
    addText(slide, kind.how, {
      x: kind.x + 0.34,
      y: 4.76,
      w: 4.92,
      h: 0.8,
      fontSize: 14,
      color: C.slate,
    });
  });
  rect(slide, 1.62, 6.06, 10.1, 0.6, C.warm, C.border, 0.05);
  addText(slide, "Confundirlos lleva a corregir código que no estaba mal, o a esperar una decisión que nadie tiene que tomar.", {
    x: 1.9,
    y: 6.06,
    w: 9.54,
    h: 0.6,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 25 · La matriz */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.4 · Los cuatro escenarios",
    "Cruzar ambas preguntas deja solo un cuadrante aceptable",
    "Cada uno se detecta de una forma distinta, y uno de ellos se parece al éxito.",
  );
  const gridX = 3.34;
  const gridY = 3.06;
  const cellW = 4.6;
  const cellH = 1.62;

  addText(slide, "VALIDACIÓN · ¿era el criterio correcto?", {
    x: gridX,
    y: 2.5,
    w: 9.2,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.gold),
    align: "center",
    charSpacing: 1.1,
  });
  ["SÍ", "NO"].forEach((label, index) => {
    addText(slide, label, {
      x: gridX + index * cellW,
      y: 2.76,
      w: cellW,
      h: 0.24,
      fontSize: 12,
      bold: true,
      color: C.slate,
      align: "center",
      charSpacing: 1.4,
    });
  });
  addText(slide, "VERIFICACIÓN", {
    x: M,
    y: 2.76,
    w: 2.4,
    h: 0.24,
    fontSize: 9.6,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 1.1,
  });
  addText(slide, "¿cumple el criterio?", {
    x: M,
    y: 3.02,
    w: 2.4,
    h: 0.24,
    fontSize: 11.5,
    color: C.slate,
  });
  ["SÍ", "NO"].forEach((label, index) => {
    addText(slide, label, {
      x: M,
      y: gridY + index * cellH + cellH / 2 - 0.16,
      w: 2.4,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: C.slate,
      align: "right",
      charSpacing: 1.4,
    });
  });

  const cells = [
    {
      col: 0,
      row: 0,
      title: "Producto adecuado",
      body: "Cumple un criterio que además responde a la necesidad.",
      fill: C.successSoft,
      border: onPaper(C.success),
      accent: onPaper(C.success),
    },
    {
      col: 1,
      row: 0,
      title: "Error ejecutado con precisión",
      body: "Todo en verde sobre una regla que nadie autorizó.",
      fill: C.warm,
      border: onPaper(C.gold),
      accent: onPaper(C.gold),
    },
    {
      col: 0,
      row: 1,
      title: "Defecto clásico",
      body: "Se sabía qué hacer y la implementación no lo cumple.",
      fill: C.white,
      border: C.border,
      accent: C.slate,
    },
    {
      col: 1,
      row: 1,
      title: "Doble fallo",
      body: "Nadie definió bien y nadie lo comprobó.",
      fill: C.paleRed,
      border: onPaper(C.red),
      accent: onPaper(C.red),
    },
  ];
  cells.forEach((cell) => {
    const x = gridX + cell.col * cellW;
    const y = gridY + cell.row * cellH;
    rect(slide, x, y, cellW - 0.06, cellH - 0.06, cell.fill, cell.border, 0.05);
    addText(slide, cell.title, {
      x: x + 0.28,
      y: y + 0.2,
      w: cellW - 0.62,
      h: 0.62,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: cell.accent,
    });
    addText(slide, cell.body, {
      x: x + 0.28,
      y: y + 0.88,
      w: cellW - 0.62,
      h: 0.6,
      fontSize: 13.5,
      color: C.ink,
    });
  });
  addText(slide, "Solo el cuadrante superior izquierdo permite una conclusión positiva proporcional a la evidencia.", {
    x: M,
    y: 6.5,
    w: 11.89,
    h: 0.34,
    fontSize: 15,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 26 · El cuadrante que se parece al éxito */
{
  const { slide } = createSlide("dark");
  addText(slide, "1.4 · EL CUADRANTE PELIGROSO", {
    x: M,
    y: 0.9,
    w: 6.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Verificado", {
    x: M,
    y: 1.68,
    w: 7.4,
    h: 0.88,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  addText(slide, "pero no validado", {
    x: M,
    y: 2.56,
    w: 7.4,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Es el más difícil de detectar porque se parece al éxito: el tablero está entero en verde y nadie tiene motivos para mirar dos veces.", {
    x: M,
    y: 3.72,
    w: 7.2,
    h: 1.1,
    fontSize: 17,
    color: C.softBlue,
  });
  rule(slide, M, 5.02, 3.4, C.red, 2.6);
  addText(slide, "El hallazgo aparece cuando alguien confronta el criterio con su fuente, no cuando ejecuta la suite.", {
    x: M,
    y: 5.28,
    w: 7.2,
    h: 0.86,
    fontSize: 16,
    bold: true,
    color: C.white,
  });
  rect(slide, 8.5, 1.68, 4.06, 4.46, C.editorBg, C.titleFill, 0.08);
  addText(slide, "LO QUE SE VE", {
    x: 8.8,
    y: 2.0,
    w: 3.46,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.1,
  });
  ["lint", "tipos", "tests", "cobertura"].forEach((label, index) => {
    const line = `${label.padEnd(11, " ")}✓`;
    addStatusPill(slide, 8.84, 2.42 + index * 0.6, 3.38, line, C.titleFill, {
      mono: true,
      fontSize: 13,
      color: C.success,
    });
  });
  rule(slide, 8.84, 5.06, 3.38, C.red, 2.4);
  addText(slide, "y la regla sigue sin autorizar", {
    x: 8.8,
    y: 5.3,
    w: 3.46,
    h: 0.6,
    fontSize: 14.5,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 27 · Un solo eje */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.4 · Límite de la cobertura",
    "Más pruebas mueven el producto en un solo eje",
    "Un equipo puede subir su cobertura durante semanas sin acercarse al otro.",
  );
  rect(slide, M, 3.3, 8.4, 1.5, C.mist, C.border, 0.06);
  addText(slide, "EJE DE LA VERIFICACIÓN", {
    x: M + 0.3,
    y: 3.52,
    w: 4.4,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 1.1,
  });
  addText(slide, "más casos · más cobertura · más ejecuciones", {
    x: M + 0.3,
    y: 3.84,
    w: 5.6,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Todo esto ocurre dentro del proyecto.", {
    x: M + 0.3,
    y: 4.28,
    w: 5.6,
    h: 0.3,
    fontSize: 13.5,
    color: C.slate,
  });
  addArrow(slide, 6.9, 3.82, 2.1, onPaper(CYAN));

  rect(slide, 9.44, CONTENT_TOP, 3.18, 3.6, C.warm, onPaper(C.gold), 0.06);
  addText(slide, "EJE DE LA VALIDACIÓN", {
    x: 9.72,
    y: 2.7,
    w: 2.7,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.1,
  });
  addDownArrow(slide, 10.78, 3.06, 0.5, 1.2, onPaper(C.gold));
  addText(slide, "Una sola pregunta a la fuente correcta mueve el producto más que cien casos nuevos.", {
    x: 9.72,
    y: 4.46,
    w: 2.7,
    h: 1.3,
    fontSize: 14,
    bold: true,
    color: C.ink,
  });
  rect(slide, M, 5.32, 8.4, 0.86, C.navy, C.navy, 0.05);
  addText(slide, "La cobertura no responde de dónde salió la expectativa que cubre.", {
    x: M + 0.3,
    y: 5.32,
    w: 7.8,
    h: 0.86,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 28 · Las tres preguntas del bloque, juntas en una sola lámina */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · Preguntas",
    "Tres preguntas para llevarse",
    "Responde nombrando la fuente de verdad que corresponde; la pista solo desbloquea el razonamiento.",
  );
  const questions = [
    [
      "¿Por qué la verificación puede hacerse dentro del equipo y la validación no?",
      "Piensa dónde vive la especificación y dónde vive la necesidad.",
      C.red,
    ],
    [
      "Si una prueba en verde puede estar equivocada, ¿qué la vuelve confiable?",
      "No la herramienta que la ejecuta, sino el origen de la expectativa que afirma.",
      C.gold,
    ],
    [
      "¿Por qué «verificado pero no validado» es el cuadrante más difícil de detectar?",
      "Revisa qué señales entrega el proyecto en ese estado y a qué se parecen.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, onPaper(item[2]), index + 1, {
      fontSize: 13,
      color: C.white,
    });
    addText(slide, item[0], {
      x: 1.62,
      y,
      w: 11.0,
      h: 0.62,
      fontSize: 18,
      bold: true,
      color: C.ink,
    });
    rect(slide, 1.62, y + 0.7, 11.0, 0.5, C.warm, C.warm, 0.04);
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, onPaper(item[2]), onPaper(item[2]));
    addText(slide, "PISTA", {
      x: 1.86,
      y: y + 0.7,
      w: 0.8,
      h: 0.5,
      fontSize: 9.4,
      bold: true,
      color: C.red,
      charSpacing: 1,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.76,
      y: y + 0.7,
      w: 9.7,
      h: 0.5,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 29 · Síntesis del bloque */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 1 · SÍNTESIS", {
    x: M,
    y: 0.9,
    w: 4.8,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Verificar compara el producto con lo que se especificó.", {
    x: M,
    y: 1.62,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.white,
  });
  addText(slide, "Validar compara lo especificado con lo que había que lograr.", {
    x: M,
    y: 2.58,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.gold,
  });
  addText(slide, "La segunda comparación no la entrega ninguna herramienta.", {
    x: M,
    y: 3.56,
    w: 11.4,
    h: 0.4,
    fontSize: 18,
    color: C.softBlue,
  });
  rule(slide, M, 4.12, 11.89, C.titleFill, 1.4);
  addText(slide, "LO QUE SIGUE", {
    x: M,
    y: 4.36,
    w: 3.0,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  const next = [
    ["ARIANE 5", "Verificado para otro cohete"],
    ["KNIGHT CAPITAL", "Lo verificado no fue lo desplegado"],
    ["THERAC-25", "El criterio necesario nunca se programó"],
  ];
  next.forEach((item, index) => {
    const x = M + index * 4.0;
    rect(slide, x, 4.74, 3.7, 1.32, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.26,
      y: 4.98,
      w: 3.18,
      h: 0.24,
      fontSize: 11.5,
      bold: true,
      color: CYAN_ON_NAVY,
      charSpacing: 1.1,
    });
    addText(slide, item[1], {
      x: x + 0.26,
      y: 5.34,
      w: 3.18,
      h: 0.56,
      fontSize: 14,
      color: C.white,
    });
  });
  addText(slide, "Tres sistemas donde faltó exactamente una de estas dos preguntas.", {
    x: M,
    y: 6.24,
    w: 11.4,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.sand,
  });
  validateSlide(slide, pptx);
}

// La matriz de diagnóstico se aplica igual a los tres casos: el esqueleto se
// repite a propósito, porque es lo que permite compararlos fila por fila. Cada
// fila conserva el color con que se presentó esa pregunta en la lámina 31, y el
// caso vive en un panel oscuro que ancla la lámina.
const MATRIX_ACCENTS = [C.navy, CYAN, C.gold, C.red, C.success];

function addCaseMatrix(slide, config) {
  const panelY = CONTENT_TOP;
  const panelH = 3.9;
  const rowH = 0.78;
  const railX = 3.9;
  const railW = 8.71;

  rect(slide, M, panelY, 3.0, panelH, C.navy, C.navy, 0.08);
  rect(slide, M, panelY, 3.0, 0.12, C.red, C.red);
  addText(slide, config.name, {
    x: M + 0.3,
    y: panelY + 0.44,
    w: 2.44,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 23,
    bold: true,
    color: C.white,
  });
  addText(slide, config.meta, {
    x: M + 0.3,
    y: panelY + 1.36,
    w: 2.44,
    h: 0.5,
    fontSize: 13,
    color: C.sand,
  });
  rule(slide, M + 0.3, panelY + 1.98, 2.4, C.red, 2.2);
  addText(slide, config.lesson, {
    x: M + 0.3,
    y: panelY + 2.2,
    w: 2.46,
    h: 1.6,
    fontSize: 15,
    bold: true,
    color: C.white,
  });

  config.rows.forEach((row, index) => {
    const accent = onPaper(MATRIX_ACCENTS[index]);
    const y = panelY + index * rowH;
    const highlight = row[2] === true;
    if (highlight) {
      rect(slide, railX, y, railW, rowH - 0.06, C.paleRed, C.paleRed, 0.05);
    }
    rect(slide, railX, y + 0.14, 0.44, 0.44, accent, accent, 0.05);
    addText(slide, String(index + 1).padStart(2, "0"), {
      x: railX,
      y: y + 0.14,
      w: 0.44,
      h: 0.44,
      fontSize: 10.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, row[0], {
      x: railX + 0.6,
      y,
      w: 2.3,
      h: rowH - 0.06,
      fontSize: 11.2,
      bold: true,
      color: accent,
      valign: "mid",
      charSpacing: 0.6,
    });
    addText(slide, row[1], {
      x: railX + 3.06,
      y,
      w: 5.5,
      h: rowH - 0.06,
      fontSize: 14.5,
      bold: highlight,
      color: highlight ? accent : C.ink,
      valign: "mid",
    });
    if (index < config.rows.length - 1) {
      rule(slide, railX, y + rowH - 0.04, railW, C.border, 1);
    }
  });
}

/* 30 · Apertura Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 2 · 25 MINUTOS", {
    x: M,
    y: 0.9,
    w: 5.2,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.9,
  });
  addText(slide, "Tres desastres,", {
    x: M,
    y: 1.66,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 48,
    bold: true,
    color: C.white,
  });
  addText(slide, "tres preguntas que faltaron", {
    x: M,
    y: 2.64,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.78, 4.6, C.red, 2.6);
  addText(slide, "En los tres hubo trabajo técnico serio, gente competente y pruebas realizadas. Lo que faltó fue una pregunta específica, y esa pregunta se puede nombrar.", {
    x: M,
    y: 4.04,
    w: 11.4,
    h: 0.7,
    fontSize: 17,
    color: C.softBlue,
  });
  const agenda = [
    ["2.1", "Una matriz para leer fallas"],
    ["2.2", "Ariane 5"],
    ["2.3", "Knight Capital"],
    ["2.4", "Therac-25"],
  ];
  agenda.forEach((item, index) => {
    const x = M + index * 3.0;
    rect(slide, x, 5.06, 2.78, 1.06, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 5.26,
      w: 2.3,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: C.gold,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 5.56,
      w: 2.3,
      h: 0.44,
      fontSize: 14,
      bold: true,
      color: C.white,
    });
  });
  validateSlide(slide, pptx);
}

/* 31 · La matriz de diagnóstico */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.1 · El instrumento",
    "Una misma matriz para leer cualquier falla",
    "Cinco preguntas en orden: de lo que se prometió a lo que habría hecho falta.",
  );
  const columns = [
    ["01", "Qué se especificó", "El comportamiento que el sistema declaraba cumplir.", C.navy],
    ["02", "Qué se verificó de verdad", "Sobre qué artefacto y contra qué referencia se comprobó.", CYAN],
    ["03", "Qué supuesto nunca se validó", "La condición que se dio por cierta sin confrontarla.", C.gold],
    ["04", "Dónde se rompió la correspondencia", "Si lo probado y lo operando dejaron de ser lo mismo.", C.red],
    ["05", "Qué evidencia lo habría revelado", "La comprobación concreta que faltaba ejecutar.", C.success],
  ];
  columns.forEach((column, index) => {
    const x = M + index * 0.62;
    const y = 2.52 + index * 0.78;
    rect(slide, x, y, 8.6, 0.66, C.white, C.border, 0.05);
    rect(slide, x, y, 0.1, 0.66, onPaper(column[3]), onPaper(column[3]));
    addText(slide, column[0], {
      x: x + 0.3,
      y,
      w: 0.5,
      h: 0.66,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color: onPaper(column[3]),
      valign: "mid",
    });
    addText(slide, column[1], {
      x: x + 0.92,
      y,
      w: 3.3,
      h: 0.66,
      fontSize: 15,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, column[2], {
      x: x + 4.3,
      y,
      w: 4.1,
      h: 0.66,
      fontSize: 12.8,
      color: C.ink,
      valign: "mid",
    });
  });
  addText(slide, "Las mismas cinco filas, tres veces, para poder comparar los casos entre sí.", {
    x: M,
    y: 6.48,
    w: 11.89,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 32 · La correspondencia */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.1 · La cuarta columna",
    "No basta con verificar y validar bien",
    "Hay que asegurar además que lo verificado sea exactamente lo que está operando.",
  );
  const artifacts = [
    {
      x: M,
      label: "LO QUE SE VERIFICÓ",
      title: "El artefacto probado",
      body: "La versión sobre la que se ejecutaron las pruebas, en el entorno del equipo.",
      accent: CYAN,
    },
    {
      x: 7.32,
      label: "LO QUE ESTÁ OPERANDO",
      title: "El artefacto en producción",
      body: "La versión que efectivamente recibe las peticiones de las personas reales.",
      accent: C.gold,
    },
  ];
  artifacts.forEach((item) => {
    rect(slide, item.x, CONTENT_TOP, 5.3, 2.5, C.white, C.border, 0.07);
    rect(slide, item.x, CONTENT_TOP, 5.3, 0.12, onPaper(item.accent), onPaper(item.accent));
    addText(slide, item.label, {
      x: item.x + 0.32,
      y: 2.76,
      w: 4.6,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color: onPaper(item.accent),
      charSpacing: 1.1,
    });
    addText(slide, item.title, {
      x: item.x + 0.32,
      y: 3.06,
      w: 4.66,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.ink,
    });
    addText(slide, item.body, {
      x: item.x + 0.32,
      y: 3.78,
      w: 4.66,
      h: 0.9,
      fontSize: 14,
      color: C.slate,
    });
  });
  rect(slide, 6.22, 3.34, 0.9, 0.9, C.navy, C.navy, 0.45);
  addText(slide, "=", {
    x: 6.22,
    y: 3.34,
    w: 0.9,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 30,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  rect(slide, M, 5.32, 11.89, 1.16, C.navy, C.navy, 0.06);
  addText(slide, "Mientras el signo se mantiene, la evidencia acumulada sirve para hablar del sistema real.", {
    x: M + 0.44,
    y: 5.52,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.white,
  });
  addText(slide, "Cuando deja de mantenerse, toda esa evidencia describe un sistema que ya no existe.", {
    x: M + 0.44,
    y: 5.98,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.gold,
  });
  validateSlide(slide, pptx);
}

/* 33 · Ariane 5 · la línea de tiempo */
{
  const { slide } = createSlide("dark");
  addText(slide, "2.2 · ARIANE 5, VUELO 501", {
    x: M,
    y: 0.9,
    w: 5.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Treinta y nueve segundos", {
    x: M,
    y: 1.5,
    w: 7.6,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
  });
  addText(slide, "4 de junio de 1996 · Kourou, Guayana Francesa", {
    x: M,
    y: 2.64,
    w: 7.6,
    h: 0.34,
    fontSize: 16,
    color: C.sand,
  });
  addText(slide, "Un cohete diseñado durante diez años y con una carga científica irremplazable se destruyó antes de dejar de verse desde la plataforma.", {
    x: M,
    y: 3.2,
    w: 7.0,
    h: 1.05,
    fontSize: 16.5,
    color: C.softBlue,
  });
  rect(slide, M, 4.44, 6.9, 1.5, C.titleFill, C.titleFill, 0.07);
  addText(slide, "La pérdida material se estimó en cientos de millones de dólares. No hubo víctimas: el vuelo no era tripulado.", {
    x: M + 0.32,
    y: 4.44,
    w: 6.26,
    h: 1.5,
    fontSize: 15,
    color: C.white,
    valign: "mid",
  });

  vrule(slide, 9.1, 1.5, 4.5, C.titleFill, 2.4);
  const marks = [
    ["H0", "Despegue nominal", C.success, 1.5],
    ["37 s", "Falla el sistema de referencia inercial", C.gold, 3.1],
    ["39 s", "Destrucción del lanzador", C.red, 4.7],
  ];
  marks.forEach((mark) => {
    slide.addShape(SH.ellipse, {
      x: 8.96,
      y: mark[3],
      w: 0.28,
      h: 0.28,
      fill: { color: mark[2] },
      line: { color: mark[2] },
    });
    addText(slide, mark[0], {
      x: 9.5,
      y: mark[3] - 0.06,
      w: 1.4,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: mark[2] === C.gold ? C.gold : C.white,
    });
    addText(slide, mark[1], {
      x: 9.5,
      y: mark[3] + 0.4,
      w: 3.1,
      h: 0.6,
      fontSize: 13.5,
      color: C.softBlue,
    });
  });
  validateSlide(slide, pptx);
}

/* 34 · Ariane 5 · la conversión */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.2 · Qué ocurrió técnicamente",
    "Un número que no cabía en el tipo de destino",
    "La causa inmediata: convertir un decimal de 64 bits a un entero con signo de 16 bits.",
  );
  rect(slide, M, CONTENT_TOP, 11.89, 1.1, C.white, C.border, 0.06);
  addText(slide, "ORIGEN · decimal de 64 bits", {
    x: M + 0.32,
    y: 2.66,
    w: 4.4,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 1.1,
  });
  rect(slide, M + 0.32, 2.96, 11.05, 0.36, onPaper(CYAN), onPaper(CYAN), 0.04);
  addText(slide, "rango suficiente para la velocidad horizontal real del vehículo", {
    x: M + 0.5,
    y: 2.96,
    w: 10.7,
    h: 0.36,
    fontSize: 13,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  addDownArrow(slide, 6.42, 3.76, 0.5, 0.62, onPaper(C.red));
  addText(slide, "conversión sin protección", {
    x: 7.1,
    y: 3.92,
    w: 4.0,
    h: 0.32,
    fontSize: 14.5,
    bold: true,
    color: onPaper(C.red),
    valign: "mid",
  });

  rect(slide, M, 4.56, 11.89, 1.1, C.white, C.border, 0.06);
  addText(slide, "DESTINO · entero con signo de 16 bits", {
    x: M + 0.32,
    y: 4.72,
    w: 4.8,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.1,
  });
  rect(slide, M + 0.32, 5.02, 2.6, 0.36, onPaper(C.gold), onPaper(C.gold), 0.04);
  addText(slide, "-32.768  a  32.767", {
    x: M + 0.32,
    y: 5.02,
    w: 2.6,
    h: 0.36,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  rectDashed(slide, 3.68, 5.02, 8.37, 0.36, C.paleRed, onPaper(C.red), 0.04);
  addText(slide, "el valor real caía fuera de este rango", {
    x: 3.68,
    y: 5.02,
    w: 8.37,
    h: 0.36,
    fontSize: 13,
    bold: true,
    color: onPaper(C.red),
    align: "center",
    valign: "mid",
  });
  rect(slide, M, 5.86, 11.89, 0.62, C.navy, C.navy, 0.05);
  addText(slide, "El resultado erróneo salió del sistema inercial y la computadora de vuelo lo interpretó como dato de trayectoria.", {
    x: M + 0.44,
    y: 5.86,
    w: 11.01,
    h: 0.62,
    fontSize: 15,
    bold: true,
    color: C.white,
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 35 · Ariane 5 · los hechos que importan */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.2 · Los hechos que importan",
    "Cuatro decisiones razonables que juntas produjeron la falla",
    "Ninguna de ellas fue un descuido: todas tenían una justificación en su momento.",
  );
  const facts = [
    ["01", "El módulo venía del Ariane 4", "Cumplía su especificación, verificada durante años de vuelos exitosos.", C.navy],
    ["02", "La protección se omitió a propósito", "Un análisis demostraba que el desborde era imposible, con datos de trayectoria del Ariane 4.", C.gold],
    ["03", "El cálculo ya no servía para nada", "Correspondía a una función de alineamiento sin utilidad operativa después del despegue.", CYAN],
    ["04", "La redundancia era idéntica", "El sistema de respaldo ejecutaba el mismo software con los mismos datos, y falló primero.", C.red],
  ];
  facts.forEach((fact, index) => {
    const y = CONTENT_TOP + index * 1.06;
    addText(slide, fact[0], {
      x: M,
      y: y + 0.04,
      w: 0.6,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: onPaper(fact[3]),
    });
    rect(slide, M + 0.72, y + 0.06, 0.1, 0.68, onPaper(fact[3]), onPaper(fact[3]));
    addText(slide, fact[1], {
      x: M + 1.06,
      y,
      w: 4.3,
      h: 0.8,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, fact[2], {
      x: 6.2,
      y,
      w: 6.4,
      h: 0.8,
      fontSize: 14,
      color: C.slate,
    });
    if (index < facts.length - 1) {
      rule(slide, M, y + 0.92, 11.89, C.border, 1);
    }
  });
  validateSlide(slide, pptx);
}

/* 36 · Ariane 5 · la matriz aplicada */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.2 · Diagnóstico",
    "Ariane 5 en la matriz",
    "La verificación fue correcta. Lo era para otro cohete.",
  );
  addCaseMatrix(slide, {
    name: "ARIANE 5",
    meta: "Vuelo 501 · 4 de junio de 1996",
    lesson: "La corrección del código no es absoluta: es relativa a un contexto y a unos supuestos.",
    rows: [
      ["SE ESPECIFICÓ", "El comportamiento del sistema inercial en el perfil de vuelo del Ariane 4"],
      ["SE VERIFICÓ", "Que la implementación cumpliera esa especificación"],
      ["NO SE VALIDÓ", "Que el perfil de vuelo del Ariane 5 estuviera dentro de los supuestos heredados"],
      ["CORRESPONDENCIA", "Intacta: el software probado era el que voló, en un vehículo distinto"],
      ["EVIDENCIA FALTANTE", "Una prueba de integración alimentada con la trayectoria real del Ariane 5"],
    ],
  });
  validateSlide(slide, pptx);
}

/* 37 · Ariane 5 · la redundancia */
{
  const { slide } = createSlide("dark");
  addText(slide, "2.2 · LA LECCIÓN", {
    x: M,
    y: 0.9,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Dos ejecuciones del mismo error", {
    x: M,
    y: 1.64,
    w: 11.4,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "no son dos evidencias", {
    x: M,
    y: 2.6,
    w: 11.4,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.gold,
  });
  const units = ["SISTEMA ACTIVO", "SISTEMA DE RESPALDO"];
  units.forEach((unit, index) => {
    const x = M + index * 4.2;
    rect(slide, x, 3.9, 3.9, 1.5, C.titleFill, onPaper(C.red), 0.07);
    addText(slide, unit, {
      x: x + 0.24,
      y: 4.12,
      w: 3.42,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: C.sand,
      align: "center",
      charSpacing: 1,
    });
    addText(slide, "mismo software", {
      x: x + 0.24,
      y: 4.46,
      w: 3.42,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
    });
    addText(slide, "mismos datos", {
      x: x + 0.24,
      y: 4.82,
      w: 3.42,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
    });
  });
  rect(slide, 9.3, 3.9, 3.3, 1.5, C.red, C.red, 0.07);
  addText(slide, "misma falla", {
    x: 9.5,
    y: 3.9,
    w: 2.9,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  addText(slide, "La redundancia duplicó el componente, no el supuesto. Para que un respaldo aporte evidencia nueva tiene que poder fallar de otra manera.", {
    x: M,
    y: 5.72,
    w: 11.4,
    h: 0.7,
    fontSize: 17,
    color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 38 · Knight Capital · apertura */
{
  const { slide } = createSlide("dark");
  addText(slide, "2.3 · KNIGHT CAPITAL", {
    x: M,
    y: 0.9,
    w: 5.2,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "1 de agosto de 2012", {
    x: M,
    y: 1.48,
    w: 7.2,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 32,
    bold: true,
    color: C.white,
  });
  addText(slide, "Una firma de trading despliega código nuevo en sus servidores de ejecución de órdenes, minutos antes de la apertura del mercado.", {
    x: M,
    y: 2.3,
    w: 7.2,
    h: 1.0,
    fontSize: 16.5,
    color: C.softBlue,
  });
  const stats = [
    ["45", "minutos de operación", C.gold],
    ["440", "millones de dólares", C.red],
  ];
  stats.forEach((stat, index) => {
    const y = 3.5 + index * 1.4;
    addText(slide, stat[0], {
      x: M,
      y,
      w: 2.6,
      h: 1.1,
      fontFace: TYPOGRAPHY.display,
      fontSize: 62,
      bold: true,
      color: stat[2],
    });
    addText(slide, stat[1], {
      x: M + 2.8,
      y: y + 0.34,
      w: 4.2,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: C.white,
    });
  });
  rect(slide, 8.3, 1.48, 4.3, 4.7, C.titleFill, C.titleFill, 0.08);
  addText(slide, "LO QUE QUEDÓ DESPUÉS", {
    x: 8.62,
    y: 1.82,
    w: 3.66,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.1,
  });
  addText(slide, "La empresa dejó de ser viable y fue absorbida meses después.", {
    x: 8.62,
    y: 2.24,
    w: 3.66,
    h: 0.96,
    fontSize: 17,
    bold: true,
    color: C.white,
    align: "center",
  });
  rule(slide, 8.62, 3.5, 3.66, C.red, 2.4);
  addText(slide, "El código desplegado había sido probado. El problema fue dónde quedó instalado y dónde no.", {
    x: 8.62,
    y: 3.76,
    w: 3.66,
    h: 1.3,
    fontSize: 15,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 39 · Knight Capital · los ocho servidores */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · El despliegue",
    "Siete servidores recibieron el código nuevo. Uno no.",
    "La actualización se copió de forma manual, sin una comprobación que confirmara el resultado.",
  );
  for (let i = 0; i < 8; i += 1) {
    const x = M + i * 1.47;
    const broken = i === 7;
    const accent = broken ? onPaper(C.red) : onPaper(C.success);
    rect(slide, x, CONTENT_TOP, 1.4, 2.0, broken ? C.paleRed : C.white, broken ? onPaper(C.red) : C.border, 0.06);
    rect(slide, x, CONTENT_TOP, 1.4, 0.1, accent, accent);
    for (let unit = 0; unit < 3; unit += 1) {
      rect(slide, x + 0.22, 2.78 + unit * 0.28, 0.96, 0.18, broken ? C.warm : C.mist, C.border, 0.02);
    }
    addText(slide, `S${i + 1}`, {
      x,
      y: 3.76,
      w: 1.4,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: C.ink,
      align: "center",
    });
    addText(slide, broken ? "código de 2003" : "versión nueva", {
      x: x + 0.06,
      y: 4.08,
      w: 1.28,
      h: 0.32,
      fontSize: 10.5,
      bold: true,
      color: accent,
      align: "center",
    });
  }
  rect(slide, M, 4.86, 5.8, 1.4, C.successSoft, onPaper(C.success), 0.06);
  addText(slide, "En siete servidores", {
    x: M + 0.3,
    y: 5.06,
    w: 5.2,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: onPaper(C.success),
  });
  addText(slide, "el indicador reutilizado activaba el componente nuevo, tal como se había probado.", {
    x: M + 0.3,
    y: 5.42,
    w: 5.2,
    h: 0.66,
    fontSize: 14,
    color: C.ink,
  });
  rect(slide, 6.82, 4.86, 5.8, 1.4, C.paleRed, onPaper(C.red), 0.06);
  addText(slide, "En el octavo", {
    x: 7.12,
    y: 5.06,
    w: 5.2,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "ese mismo indicador despertó código inactivo desde hacía años, sin control de posiciones.", {
    x: 7.12,
    y: 5.42,
    w: 5.2,
    h: 0.66,
    fontSize: 14,
    color: C.ink,
  });
  validateSlide(slide, pptx);
}

/* 40 · Knight Capital · el indicador reutilizado */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · La causa de fondo",
    "El mismo indicador significaba dos cosas distintas",
    "Dos especificaciones incompatibles convivían en el mismo sistema, separadas por nueve años.",
  );
  rect(slide, M, 3.73, 2.5, 1.0, C.navy, C.navy, 0.06);
  addText(slide, "un indicador", {
    x: M,
    y: 3.73,
    w: 2.5,
    h: 1.0,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  const lanes = [
    {
      y: CONTENT_TOP,
      accent: C.red,
      year: "2003",
      meaning: "Activa un componente de enrutamiento que ya nadie usaba.",
      state: "Código muerto, nunca retirado del sistema.",
    },
    {
      y: 4.5,
      accent: CYAN,
      year: "2012",
      meaning: "Activa el componente nuevo que acababa de desplegarse.",
      state: "Especificación vigente, verificada por el equipo.",
    },
  ];
  lanes.forEach((lane) => {
    rect(slide, 4.1, lane.y, 8.52, 1.5, C.white, C.border, 0.06);
    rect(slide, 4.1, lane.y, 0.12, 1.5, onPaper(lane.accent), onPaper(lane.accent));
    addText(slide, lane.year, {
      x: 4.42,
      y: lane.y + 0.3,
      w: 1.2,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color: onPaper(lane.accent),
    });
    addText(slide, lane.meaning, {
      x: 5.86,
      y: lane.y + 0.28,
      w: 6.4,
      h: 0.42,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, lane.state, {
      x: 5.86,
      y: lane.y + 0.82,
      w: 6.4,
      h: 0.4,
      fontSize: 13.5,
      color: C.slate,
    });
  });
  // Ménsula simétrica: sale del centro del chip, sube y baja hasta el centro
  // exacto de cada carril y entra en ellos por su borde izquierdo.
  rule(slide, 3.22, 4.23, 0.48, C.guide, 1.4);
  vrule(slide, 3.7, 3.21, 2.04, C.guide, 1.4);
  rule(slide, 3.7, 3.21, 0.4, C.guide, 1.4);
  rule(slide, 3.7, 5.25, 0.4, C.guide, 1.4);
  addText(slide, "Reutilizar un nombre disponible es barato. Volver a comprobar qué despierta ese nombre en cada servidor, no.", {
    x: 1.62,
    y: 6.34,
    w: 10.1,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 41 · Knight Capital · la matriz aplicada */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · Diagnóstico",
    "Knight Capital en la matriz",
    "Aquí la falla no está en lo verificado, sino en la fila que las otras dos tienen intacta.",
  );
  addCaseMatrix(slide, {
    name: "KNIGHT CAPITAL",
    meta: "1 de agosto de 2012",
    lesson: "Una suite perfecta sobre un artefacto que no está corriendo no demuestra nada del sistema real.",
    rows: [
      ["SE ESPECIFICÓ", "El comportamiento del nuevo componente de ejecución de órdenes"],
      ["SE VERIFICÓ", "Ese componente, en un entorno donde sí estaba instalado"],
      ["NO SE VALIDÓ", "Que reutilizar un indicador antiguo fuera seguro con código muerto presente"],
      ["CORRESPONDENCIA", "ROTA: siete servidores ejecutaban lo verificado y uno ejecutaba otra cosa", true],
      ["EVIDENCIA FALTANTE", "Una comprobación automática de que los ocho nodos ejecutan la misma versión"],
    ],
  });
  validateSlide(slide, pptx);
}

/* 42 · Therac-25 · apertura */
{
  const { slide } = createSlide("dark");
  addText(slide, "2.4 · THERAC-25", {
    x: M,
    y: 0.9,
    w: 4.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "1985 - 1987", {
    x: M,
    y: 1.5,
    w: 7.6,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });
  addText(slide, "Máquina de radioterapia en uso clínico", {
    x: M,
    y: 2.38,
    w: 7.6,
    h: 0.34,
    fontSize: 17,
    color: C.sand,
  });
  addText(slide, "Si el operador corregía la pantalla con suficiente rapidez, el equipo quedaba en un estado inconsistente y aplicaba una dosis cientos de veces superior a la indicada.", {
    x: M,
    y: 3.0,
    w: 7.2,
    h: 1.2,
    fontSize: 16.5,
    color: C.softBlue,
  });
  rule(slide, M, 4.4, 4.2, C.red, 2.6);
  addText(slide, "Al menos seis sobredosis masivas documentadas, con varias muertes.", {
    x: M,
    y: 4.66,
    w: 7.2,
    h: 0.7,
    fontSize: 18,
    bold: true,
    color: C.white,
  });
  rect(slide, 8.5, 1.5, 4.1, 4.5, C.titleFill, C.titleFill, 0.08);
  addText(slide, "LA CAUSA INMEDIATA", {
    x: 8.82,
    y: 1.84,
    w: 3.46,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.1,
  });
  addText(slide, "Una condición de carrera", {
    x: 8.82,
    y: 2.2,
    w: 3.46,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: C.white,
    align: "center",
  });
  addText(slide, "Dos tareas que compartían estado sin sincronización, en una secuencia de edición rápida que nadie había previsto como caso de prueba.", {
    x: 8.82,
    y: 3.16,
    w: 3.46,
    h: 1.6,
    fontSize: 14.5,
    color: C.softBlue,
    align: "center",
  });
  rule(slide, 8.82, 4.94, 3.46, C.red, 2.4);
  addText(slide, "Pero esa no es la parte que faltó validar.", {
    x: 8.82,
    y: 5.18,
    w: 3.46,
    h: 0.6,
    fontSize: 14,
    bold: true,
    color: C.gold,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 43 · Therac-25 · la barrera que se quitó */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.4 · El cambio de diseño",
    "El modelo anterior tenía una barrera que el nuevo eliminó",
    "El software se consideró confiable porque venía de un equipo donde nunca había sido la única protección.",
  );
  const models = [
    {
      x: M,
      name: "THERAC-20",
      layers: [
        ["ENCLAVAMIENTO MECÁNICO", "Impide físicamente la combinación peligrosa.", C.success],
        ["SOFTWARE DE CONTROL", "Los mismos defectos que tendría el modelo siguiente.", C.gold],
      ],
      verdict: "Los defectos existían y el hardware los contenía.",
      verdictFill: C.successSoft,
      verdictColor: onPaper(C.success),
    },
    {
      x: 6.72,
      name: "THERAC-25",
      layers: [
        ["SIN BARRERA FÍSICA", "El enclavamiento se retiró para abaratar el equipo.", C.red],
        ["SOFTWARE DE CONTROL", "Ahora es la única protección del paciente.", C.gold],
      ],
      verdict: "Los mismos defectos, ya sin nada que los detenga.",
      verdictFill: C.paleRed,
      verdictColor: onPaper(C.red),
    },
  ];
  models.forEach((model) => {
    addText(slide, model.name, {
      x: model.x,
      y: CONTENT_TOP,
      w: 5.6,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.ink,
      charSpacing: 0.8,
    });
    model.layers.forEach((layer, index) => {
      const y = 2.92 + index * 1.16;
      const dashed = layer[2] === C.red;
      if (dashed) {
        rectDashed(slide, model.x, y, 5.6, 1.0, C.paper, onPaper(C.red), 0.06);
      } else {
        rect(slide, model.x, y, 5.6, 1.0, C.white, C.border, 0.06);
        rect(slide, model.x, y, 0.12, 1.0, onPaper(layer[2]), onPaper(layer[2]));
      }
      addText(slide, layer[0], {
        x: model.x + 0.34,
        y: y + 0.18,
        w: 4.94,
        h: 0.24,
        fontSize: 11.5,
        bold: true,
        color: onPaper(layer[2]),
        charSpacing: 0.9,
      });
      addText(slide, layer[1], {
        x: model.x + 0.34,
        y: y + 0.5,
        w: 4.94,
        h: 0.4,
        fontSize: 14,
        color: C.slate,
      });
    });
    rect(slide, model.x, 5.3, 5.6, 0.78, model.verdictFill, model.verdictColor, 0.05);
    addText(slide, model.verdict, {
      x: model.x + 0.24,
      y: 5.3,
      w: 5.12,
      h: 0.78,
      fontSize: 14.5,
      bold: true,
      color: model.verdictColor,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "Durante años el hardware estuvo ocultando defectos de software que nadie sabía que existían.", {
    x: 1.62,
    y: 6.34,
    w: 10.1,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 44 · Therac-25 · la matriz aplicada */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.4 · Diagnóstico",
    "Therac-25 en la matriz",
    "El software hacía lo que se le pidió. El problema es lo que se le pidió.",
  );
  addCaseMatrix(slide, {
    name: "THERAC-25",
    meta: "1985 - 1987 · uso clínico",
    lesson: "El análisis de riesgos asignó al fallo de software una probabilidad baja, sin evidencia que la respaldara.",
    rows: [
      ["SE ESPECIFICÓ", "Que el equipo aplicara la dosis indicada en pantalla"],
      ["SE VERIFICÓ", "El comportamiento del software en las secuencias de uso previstas"],
      ["NO SE VALIDÓ", "Que el software solo bastara como barrera de seguridad sin respaldo físico"],
      ["CORRESPONDENCIA", "Intacta: operaba el software que se había probado"],
      ["EVIDENCIA FALTANTE", "Un análisis de riesgos del sistema completo, con la interacción del operador"],
    ],
  });
  validateSlide(slide, pptx);
}

/* 45 · Therac-25 · el criterio necesario */
{
  const { slide } = createSlide("dark");
  addText(slide, "2.4 · LA DISTANCIA ENTRE DOS CRITERIOS", {
    x: M,
    y: 0.9,
    w: 7.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  rect(slide, M, 1.66, 0.14, 1.4, CYAN_ON_NAVY, CYAN_ON_NAVY);
  addText(slide, "EL CRITERIO PROGRAMADO", {
    x: M + 0.42,
    y: 1.7,
    w: 5.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.5,
  });
  addText(slide, "«Aplicar lo que el operador indicó»", {
    x: M + 0.42,
    y: 2.06,
    w: 10.6,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 32,
    bold: true,
    color: C.white,
  });
  rect(slide, M, 3.5, 0.14, 1.4, C.gold, C.gold);
  addText(slide, "EL CRITERIO NECESARIO", {
    x: M + 0.42,
    y: 3.54,
    w: 5.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.5,
  });
  addText(slide, "«No aplicar nunca una dosis capaz de dañar al paciente»", {
    x: M + 0.42,
    y: 3.9,
    w: 10.6,
    h: 0.96,
    fontFace: TYPOGRAPHY.display,
    fontSize: 32,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 5.24, 11.89, C.titleFill, 1.4);
  addText(slide, "La distancia entre ambos no es un error de programación: es un criterio que nadie confrontó con la necesidad real del producto.", {
    x: M,
    y: 5.5,
    w: 11.4,
    h: 0.8,
    fontSize: 18,
    color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 46 · Los tres casos en los cuadrantes */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.5 · Comparación",
    "Dos casos caen en el mismo cuadrante y el tercero no cabe",
    "Por eso la matriz de la clase necesita una quinta pregunta además de las dos originales.",
  );
  const gridX = 1.94;
  const gridY = 3.06;
  const cellW = 2.9;
  const cellH = 1.44;
  addText(slide, "VALIDACIÓN", {
    x: gridX,
    y: 2.56,
    w: 5.8,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(C.gold),
    align: "center",
    charSpacing: 1.1,
  });
  ["SÍ", "NO"].forEach((label, index) => {
    addText(slide, label, {
      x: gridX + index * cellW,
      y: 2.8,
      w: cellW,
      h: 0.2,
      fontSize: 10.5,
      bold: true,
      color: C.slate,
      align: "center",
      charSpacing: 1.2,
    });
  });
  addText(slide, "VERIFICACIÓN", {
    x: M,
    y: 2.8,
    w: 1.2,
    h: 0.2,
    fontSize: 8.2,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 0.5,
  });
  ["SÍ", "NO"].forEach((label, index) => {
    addText(slide, label, {
      x: M,
      y: gridY + index * cellH + cellH / 2 - 0.14,
      w: 1.0,
      h: 0.28,
      fontSize: 10.5,
      bold: true,
      color: C.slate,
      align: "right",
      charSpacing: 1.2,
    });
  });
  const cells = [
    ["Producto adecuado", C.white, C.border, C.guide],
    ["ARIANE 5 · THERAC-25", C.warm, onPaper(C.gold), onPaper(C.gold)],
    ["Defecto clásico", C.white, C.border, C.guide],
    ["Doble fallo", C.white, C.border, C.guide],
  ];
  cells.forEach((cell, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = gridX + col * cellW;
    const y = gridY + row * cellH;
    rect(slide, x, y, cellW - 0.06, cellH - 0.06, cell[1], cell[2], 0.05);
    addText(slide, cell[0], {
      x: x + 0.16,
      y,
      w: cellW - 0.38,
      h: cellH - 0.06,
      fontSize: index === 1 ? 13 : 12.5,
      bold: index === 1,
      color: cell[3],
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "Verificados contra su especificación, con un supuesto que nadie confrontó.", {
    x: gridX,
    y: 6.12,
    w: 5.8,
    h: 0.5,
    fontSize: 13,
    color: C.slate,
  });

  rect(slide, 7.9, CONTENT_TOP, 4.72, 3.44, C.paleRed, onPaper(C.red), 0.07);
  addText(slide, "FUERA DE LA MATRIZ", {
    x: 8.22,
    y: 2.72,
    w: 4.1,
    h: 0.2,
    fontSize: 9.4,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.1,
  });
  addText(slide, "KNIGHT CAPITAL", {
    x: 8.22,
    y: 3.02,
    w: 4.1,
    h: 0.4,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: C.ink,
  });
  addText(slide, "No se puede ubicar preguntando si cumplió el criterio, porque el servidor que falló nunca recibió el código evaluado.", {
    x: 8.22,
    y: 3.6,
    w: 4.1,
    h: 1.0,
    fontSize: 14,
    color: C.ink,
  });
  rule(slide, 8.22, 4.72, 4.1, onPaper(C.red), 1.6);
  addText(slide, "La pregunta que lo detecta es la correspondencia: ¿lo verificado es lo que está operando?", {
    x: 8.22,
    y: 4.94,
    w: 4.1,
    h: 0.9,
    fontSize: 14.5,
    bold: true,
    color: onPaper(C.red),
  });
  validateSlide(slide, pptx);
}

/* 47 · Lo que ninguna prueba unitaria habría evitado */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.5 · El límite",
    "Ninguno de los tres se evitaba con más pruebas unitarias",
    "En los tres, el problema estaba fuera del componente que fallaba, no dentro.",
  );
  const needs = [
    ["ARIANE 5", "Una prueba de integración con datos reales del vehículo nuevo", CYAN],
    ["KNIGHT CAPITAL", "Una comprobación de que todos los nodos ejecutan la versión verificada", C.red],
    ["THERAC-25", "Un análisis de riesgos del sistema completo, con el operador incluido", C.gold],
  ];
  needs.forEach((need, index) => {
    const y = CONTENT_TOP + index * 1.02;
    rect(slide, M, y, 11.89, 0.9, C.white, C.border, 0.05);
    rect(slide, M, y, 0.12, 0.9, onPaper(need[2]), onPaper(need[2]));
    addText(slide, need[0], {
      x: M + 0.4,
      y,
      w: 3.0,
      h: 0.9,
      fontSize: 13.5,
      bold: true,
      color: onPaper(need[2]),
      valign: "mid",
      charSpacing: 0.9,
    });
    addText(slide, need[1], {
      x: 4.3,
      y,
      w: 8.16,
      h: 0.9,
      fontSize: 16,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, M, 5.66, 11.89, 1.0, C.navy, C.navy, 0.06);
  addText(slide, "Al pedirle la causa a un agente, la respuesta suele detenerse en la línea técnica.", {
    x: M + 0.44,
    y: 5.86,
    w: 11.01,
    h: 0.34,
    fontSize: 15,
    bold: true,
    color: C.white,
  });
  addText(slide, "Es la parte que ya estaba verificada: el supuesto no validado no está escrito en el código.", {
    x: M + 0.44,
    y: 6.26,
    w: 11.01,
    h: 0.34,
    fontSize: 15,
    bold: true,
    color: C.gold,
  });
  validateSlide(slide, pptx);
}

/* 48 · Las tres preguntas del Bloque 2 */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · Preguntas",
    "Tres preguntas para llevarse",
    "Una por caso; responde nombrando la fila de la matriz que corresponde.",
  );
  const questions = [
    [
      "¿Por qué la redundancia del Ariane 5 no funcionó como protección?",
      "Revisa qué se duplicó y qué no se duplicó.",
      C.red,
    ],
    [
      "¿Qué hace que un despliegue parcial invalide la evidencia acumulada?",
      "Pregúntate sobre qué artefacto se ejecutaron las pruebas y cuál estaba operando.",
      C.gold,
    ],
    [
      "¿Qué significa que el hardware del Therac-20 estuviera «ocultando» defectos de software?",
      "Un defecto sin barrera que lo contenga no es un defecto nuevo: es uno que se vuelve visible.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, onPaper(item[2]), index + 1, {
      fontSize: 13,
      color: C.white,
    });
    addText(slide, item[0], {
      x: 1.62,
      y,
      w: 11.0,
      h: 0.62,
      fontSize: 18,
      bold: true,
      color: C.ink,
    });
    rect(slide, 1.62, y + 0.7, 11.0, 0.5, C.warm, C.warm, 0.04);
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, onPaper(item[2]), onPaper(item[2]));
    addText(slide, "PISTA", {
      x: 1.86,
      y: y + 0.7,
      w: 0.8,
      h: 0.5,
      fontSize: 9.4,
      bold: true,
      color: C.red,
      charSpacing: 1,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.76,
      y: y + 0.7,
      w: 9.7,
      h: 0.5,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 49 · Cierre del Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 2 · SÍNTESIS", {
    x: M,
    y: 0.9,
    w: 4.8,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "En los tres casos hubo trabajo técnico verificado.", {
    x: M,
    y: 1.62,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 30,
    bold: true,
    color: C.white,
  });
  addText(slide, "Lo que faltó fue confrontar un supuesto, o comprobar que lo verificado siguiera operando.", {
    x: M,
    y: 2.6,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.78, 11.89, C.titleFill, 1.4);
  addText(slide, "LO QUE SIGUE", {
    x: M,
    y: 4.02,
    w: 3.0,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(slide, "Ninguno de estos sistemas se parece al proyecto propio en tamaño. Los tres comparten su estructura de error.", {
    x: M,
    y: 4.32,
    w: 6.9,
    h: 0.8,
    fontSize: 17,
    color: C.softBlue,
  });
  rect(slide, 8.1, 4.02, 4.5, 2.2, C.titleFill, C.titleFill, 0.07);
  addText(slide, "BLOQUE 3", {
    x: 8.42,
    y: 4.26,
    w: 3.86,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.2,
  });
  addText(slide, "Buscar esos mismos vacíos en el producto propio", {
    x: 8.42,
    y: 4.58,
    w: 3.86,
    h: 1.1,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: C.white,
  });
  addText(slide, "con la ventaja de poder corregirlos.", {
    x: 8.42,
    y: 5.78,
    w: 3.86,
    h: 0.34,
    fontSize: 14,
    color: C.sand,
  });
  validateSlide(slide, pptx);
}

/* 50 · Apertura Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 3 · 30 MINUTOS", {
    x: M,
    y: 0.9,
    w: 5.2,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.9,
  });
  addText(slide, "El mismo vacío,", {
    x: M,
    y: 1.66,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 48,
    bold: true,
    color: C.white,
  });
  addText(slide, "en nuestro propio proyecto", {
    x: M,
    y: 2.64,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.78, 4.6, C.red, 2.6);
  addText(slide, "Ninguno de esos sistemas se parece al nuestro en tamaño. La diferencia es que en el nuestro todavía estamos a tiempo.", {
    x: M,
    y: 4.04,
    w: 11.4,
    h: 0.7,
    fontSize: 17,
    color: C.softBlue,
  });
  const agenda = [
    ["3.1", "El origen de cada criterio"],
    ["3.2", "La tabla de trazabilidad"],
    ["3.3", "Dos patologías frecuentes"],
    ["3.4", "El caso que aprueba igual"],
    ["3.5", "Registrar el hallazgo"],
  ];
  agenda.forEach((item, index) => {
    const x = M + index * 2.4;
    rect(slide, x, 5.06, 2.2, 1.06, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.22,
      y: 5.26,
      w: 1.8,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12.5,
      bold: true,
      color: C.gold,
    });
    addText(slide, item[1], {
      x: x + 0.22,
      y: 5.56,
      w: 1.8,
      h: 0.48,
      fontSize: 12.5,
      bold: true,
      color: C.white,
    });
  });
  validateSlide(slide, pptx);
}

/* 51 · De observable a autorizado */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · El salto de exigencia",
    "A un criterio ya no le basta con ser observable",
    "La clase anterior pedía una condición comprobable. Hoy pedimos además quién la autoriza.",
  );
  const steps = [
    {
      x: M,
      accent: CYAN,
      tag: "CLASE 03",
      title: "Criterio observable",
      body: "Una condición que puede comprobarse con una prueba, una medición o una revisión.",
      status: "CUMPLIDO",
      statusColor: C.success,
    },
    {
      x: 6.72,
      accent: C.gold,
      tag: "HOY",
      title: "Criterio autorizado",
      body: "Esa misma condición, más el documento o la persona que la declara obligatoria.",
      status: "PENDIENTE",
      statusColor: C.red,
    },
  ];
  steps.forEach((step) => {
    rect(slide, step.x, CONTENT_TOP, 5.6, 3.3, C.white, C.border, 0.07);
    rect(slide, step.x, CONTENT_TOP, 5.6, 0.12, onPaper(step.accent), onPaper(step.accent));
    addText(slide, step.tag, {
      x: step.x + 0.34,
      y: 2.76,
      w: 2.4,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: onPaper(step.accent),
      charSpacing: 1.3,
    });
    addText(slide, step.title, {
      x: step.x + 0.34,
      y: 3.08,
      w: 4.94,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: C.ink,
    });
    addText(slide, step.body, {
      x: step.x + 0.34,
      y: 3.78,
      w: 4.94,
      h: 0.86,
      fontSize: 14.5,
      color: C.ink,
    });
    rect(slide, step.x + 0.34, 4.78, 2.0, 0.5, onPaper(step.statusColor), onPaper(step.statusColor), 0.05);
    addText(slide, step.status, {
      x: step.x + 0.34,
      y: 4.78,
      w: 2.0,
      h: 0.5,
      fontSize: 11,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 1,
    });
  });
  addArrow(slide, 6.37, 3.86, 0.3, onPaper(C.red));
  rect(slide, M, 6.02, 11.89, 0.6, C.navy, C.navy, 0.05);
  addText(slide, "Un criterio sin autor es una decisión del equipo disfrazada de regla del producto.", {
    x: M + 0.44,
    y: 6.02,
    w: 11.01,
    h: 0.6,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 52 · Las tres preguntas al criterio */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · El interrogatorio",
    "Tres preguntas que todo criterio debe poder responder",
    "Las dos primeras suelen tener respuesta. La tercera es la que queda en blanco.",
  );
  const questions = [
    {
      x: M,
      accent: C.success,
      number: "01",
      question: "¿Qué necesidad expresa este criterio?",
      answer: "Que la calificación refleje el rendimiento real del estudiante.",
      filled: true,
    },
    {
      x: 4.82,
      accent: C.success,
      number: "02",
      question: "¿Quién declaró esa necesidad?",
      answer: "El brief de la iteración, acordado al inicio.",
      filled: true,
    },
    {
      x: 8.92,
      accent: C.red,
      number: "03",
      question: "¿Dónde está registrada esa declaración?",
      answer: "",
      filled: false,
    },
  ];
  questions.forEach((item) => {
    addCircleLabel(slide, item.x, CONTENT_TOP, 0.56, onPaper(item.accent), item.number, {
      fontSize: 10,
      color: C.white,
    });
    addText(slide, item.question, {
      x: item.x,
      y: 3.18,
      w: 3.5,
      h: 0.9,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.ink,
    });
    if (item.filled) {
      rule(slide, item.x, 4.24, 3.5, onPaper(item.accent), 2.2);
      addText(slide, item.answer, {
        x: item.x,
        y: 4.42,
        w: 3.5,
        h: 0.9,
        fontSize: 14,
        color: C.ink,
      });
    } else {
      rectDashed(slide, item.x, 4.24, 3.5, 1.1, C.paleRed, onPaper(C.red), 0.05);
      addText(slide, "en blanco", {
        x: item.x,
        y: 4.24,
        w: 3.5,
        h: 1.1,
        fontFace: TYPOGRAPHY.mono,
        fontSize: 15,
        bold: true,
        color: onPaper(C.red),
        align: "center",
        valign: "mid",
      });
    }
  });
  addText(slide, "«Lo decidimos nosotros porque parecía razonable» es una respuesta honesta, y deja el criterio sin validar.", {
    x: M,
    y: 5.86,
    w: 11.89,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 53 · Sin validar no es lo mismo que mal */
{
  const { slide } = createSlide("dark");
  addText(slide, "3.1 · UN ESTADO LEGÍTIMO", {
    x: M,
    y: 0.9,
    w: 5.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "«Sin validar»", {
    x: M,
    y: 1.66,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.white,
  });
  addText(slide, "no significa «mal»", {
    x: M,
    y: 2.64,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Un criterio sin fuente puede estar perfectamente bien elegido. Lo que falta no es acierto: es respaldo, y mientras falte hay que decirlo.", {
    x: M,
    y: 3.86,
    w: 11.4,
    h: 0.7,
    fontSize: 17,
    color: C.softBlue,
  });
  const states = [
    ["INCORRECTO", "El criterio contradice la regla real del producto.", C.red],
    ["SIN VALIDAR", "El criterio podría ser correcto y nadie lo ha confirmado.", C.gold],
    ["VALIDADO", "El criterio tiene una fuente que lo declara obligatorio.", C.success],
  ];
  states.forEach((state, index) => {
    const x = M + index * 4.0;
    rect(slide, x, 4.76, 3.7, 1.34, C.titleFill, C.titleFill, 0.07);
    rect(slide, x, 4.76, 3.7, 0.1, state[2], state[2]);
    addText(slide, state[0], {
      x: x + 0.26,
      y: 5.0,
      w: 3.18,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: state[2] === C.gold ? C.gold : C.white,
      charSpacing: 1.2,
    });
    addText(slide, state[1], {
      x: x + 0.26,
      y: 5.34,
      w: 3.18,
      h: 0.62,
      fontSize: 13.5,
      color: C.softBlue,
    });
  });
  validateSlide(slide, pptx);
}

/* 54 · Anatomía de la trazabilidad */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.2 · El instrumento",
    "La trazabilidad conecta cada necesidad con sus dos evidencias",
    "Seis columnas agrupadas en cuatro zonas, de la necesidad al estado.",
  );
  const zones = [
    {
      x: M,
      w: 3.4,
      label: "DE DÓNDE VIENE",
      accent: C.navy,
      columns: [["Necesidad", "Lo que el producto debe lograr"], ["Fuente", "Quién lo declara"]],
    },
    {
      x: 4.32,
      w: 2.5,
      label: "QUÉ EXIGE",
      accent: CYAN,
      columns: [["Criterio observable", "La condición comprobable"]],
    },
    {
      x: 7.02,
      w: 3.9,
      label: "CÓMO SE COMPRUEBA",
      accent: C.gold,
      columns: [["Evidencia de verificación", "Interna al proyecto"], ["Evidencia de validación", "Externa al proyecto"]],
    },
    {
      x: 11.1,
      w: 1.51,
      label: "ESTADO",
      accent: C.success,
      columns: [["Estado", "La marca vigente"]],
    },
  ];
  zones.forEach((zone) => {
    rect(slide, zone.x, CONTENT_TOP, zone.w, 0.44, onPaper(zone.accent), onPaper(zone.accent), 0.04);
    addText(slide, zone.label, {
      x: zone.x + 0.1,
      y: CONTENT_TOP,
      w: zone.w - 0.2,
      h: 0.44,
      fontSize: 9.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.9,
    });
    zone.columns.forEach((column, index) => {
      const y = 3.1 + index * 1.32;
      rect(slide, zone.x, y, zone.w, 1.14, C.white, C.border, 0.05);
      rect(slide, zone.x, y, zone.w, 0.08, onPaper(zone.accent), onPaper(zone.accent));
      addText(slide, column[0], {
        x: zone.x + 0.2,
        y: y + 0.24,
        w: zone.w - 0.4,
        h: 0.5,
        fontSize: 15,
        bold: true,
        color: C.ink,
      });
      addText(slide, column[1], {
        x: zone.x + 0.2,
        y: y + 0.74,
        w: zone.w - 0.4,
        h: 0.32,
        fontSize: 12.5,
        color: onPaper(zone.accent),
      });
    });
  });
  addText(slide, "Una fila por necesidad. Si una columna queda vacía, eso mismo es el hallazgo.", {
    x: M,
    y: 5.86,
    w: 11.89,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 55 · Dos filas modelo */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.2 · La tabla en uso",
    "Así se ven dos filas completas del producto",
    "La primera todavía espera una confirmación externa; la segunda ya la tiene.",
  );
  const headers = ["NECESIDAD", "FUENTE", "CRITERIO OBSERVABLE", "EV. DE VERIFICACIÓN", "EV. DE VALIDACIÓN", "ESTADO"];
  const widths = [2.5, 1.5, 2.6, 2.0, 2.1, 1.19];
  let cursor = M;
  const colXs = widths.map((width) => {
    const x = cursor;
    cursor += width;
    return x;
  });
  rect(slide, M, 2.44, 11.89, 0.5, C.navy, C.navy, 0.04);
  headers.forEach((header, index) => {
    addText(slide, header, {
      x: colXs[index] + 0.12,
      y: 2.44,
      w: widths[index] - 0.24,
      h: 0.5,
      fontSize: 8.8,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 0.6,
    });
  });
  const rows = [
    {
      accent: C.gold,
      state: "POR VALIDAR",
      cells: [
        "La calificación refleja el rendimiento según la regla vigente",
        "Reglamento de evaluación",
        "El promedio se calcula con la ponderación que declara el reglamento",
        "Prueba automatizada sobre casos que cruzan el umbral",
        "Confrontación del criterio con el texto del reglamento",
      ],
    },
    {
      accent: C.success,
      state: "VERIFICADO",
      cells: [
        "Una entrada inválida no produce una calificación engañosa",
        "Brief de la iteración",
        "Ante una lista vacía, la función informa el error",
        "Prueba que espera el error declarado",
        "Confirmación de quien usa la herramienta",
      ],
    },
  ];
  rows.forEach((row, rowIndex) => {
    const y = 3.04 + rowIndex * 1.5;
    rect(slide, M, y, 11.89, 1.4, C.white, C.border, 0.04);
    rect(slide, M, y, 0.1, 1.4, onPaper(row.accent), onPaper(row.accent));
    row.cells.forEach((cell, index) => {
      addText(slide, cell, {
        x: colXs[index] + 0.2,
        y: y + 0.12,
        w: widths[index] - 0.36,
        h: 1.16,
        fontSize: 11.5,
        color: C.ink,
      });
      if (index > 0) {
        vrule(slide, colXs[index], y + 0.16, 1.08, C.border, 1);
      }
    });
    rect(slide, colXs[5] + 0.12, y + 0.44, 0.95, 0.52, onPaper(row.accent), onPaper(row.accent), 0.05);
    addText(slide, row.state, {
      x: colXs[5] + 0.12,
      y: y + 0.44,
      w: 0.95,
      h: 0.52,
      fontSize: 8.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "El estado no describe la calidad del criterio: describe cuánta evidencia lo respalda hoy.", {
    x: M,
    y: 6.2,
    w: 11.89,
    h: 0.36,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 56 · Las dos evidencias no se cubren entre sí */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.2 · Dos evidencias distintas",
    "Una se ejecuta; la otra se cita",
    "Producen artefactos de naturaleza distinta y ninguna reemplaza a la otra.",
  );
  addText(slide, "EVIDENCIA DE VERIFICACIÓN", {
    x: M,
    y: CONTENT_TOP,
    w: 5.6,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: onPaper(CYAN),
    charSpacing: 1.3,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.82,
    w: 5.6,
    h: 1.5,
    title: "salida reproducible",
    fontSize: 11.4,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "...   [100%]   3 passed" },
    ],
  });
  addText(slide, "La produce el equipo, se repite cuando se quiera y queda en el repositorio.", {
    x: M,
    y: 4.5,
    w: 5.6,
    h: 0.62,
    fontSize: 14,
    color: C.ink,
  });

  addText(slide, "EVIDENCIA DE VALIDACIÓN", {
    x: 6.92,
    y: CONTENT_TOP,
    w: 5.6,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.3,
  });
  rect(slide, 6.92, 2.82, 5.69, 1.5, C.warm, C.border, 0.06);
  rect(slide, 6.92, 2.82, 0.12, 1.5, onPaper(C.gold), onPaper(C.gold));
  addText(slide, "«Reglamento de evaluación, artículo 12: el promedio final se calcula con las ponderaciones publicadas al inicio del período.»", {
    x: 7.26,
    y: 2.82,
    w: 5.1,
    h: 1.5,
    fontSize: 13,
    italic: true,
    color: C.ink,
    valign: "mid",
  });
  addText(slide, "La produce una fuente externa, se cita con su nombre y su fecha, y nadie del equipo puede escribirla.", {
    x: 6.92,
    y: 4.5,
    w: 5.6,
    h: 0.62,
    fontSize: 14,
    color: C.ink,
  });

  rect(slide, M, 5.42, 11.89, 1.1, C.navy, C.navy, 0.06);
  addText(slide, "Cien ejecuciones en verde no producen ni una línea de la columna derecha.", {
    x: M + 0.44,
    y: 5.62,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.white,
  });
  addText(slide, "Y una cita del reglamento tampoco demuestra que el código la cumpla.", {
    x: M + 0.44,
    y: 6.04,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.gold,
  });
  validateSlide(slide, pptx);
}

/* 57 · Conclusión o hipótesis */
{
  const { slide } = createSlide("dark");
  addText(slide, "3.2 · EL ESTADO REAL DE UN CRITERIO", {
    x: M,
    y: 0.9,
    w: 6.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Con la columna de validación vacía,", {
    x: M,
    y: 1.7,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
  });
  addText(slide, "el criterio deja de ser una conclusión", {
    x: M,
    y: 2.62,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
  });
  addText(slide, "y pasa a ser una hipótesis de trabajo.", {
    x: M,
    y: 3.54,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 4.72, 5.4, C.red, 2.6);
  addText(slide, "Sigue siendo útil: se puede implementar, probar y discutir. Lo que no se puede es presentarlo como si alguien lo hubiera aprobado.", {
    x: M,
    y: 5.0,
    w: 7.4,
    h: 1.0,
    fontSize: 17,
    color: C.softBlue,
  });
  rect(slide, 8.5, 4.66, 4.1, 1.5, C.titleFill, C.titleFill, 0.07);
  addText(slide, "Y el proyecto tiene que mostrarlo, no esconderlo.", {
    x: 8.8,
    y: 4.66,
    w: 3.5,
    h: 1.5,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 58 · Patología 1 · criterio huérfano */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.3 · Primera patología",
    "Criterio huérfano: hay criterio, hay prueba, no hay fuente",
    "Es el caso más común, y también el más fácil de confundir con un trabajo terminado.",
  );
  const cells = [
    ["NECESIDAD", "Declarada en el brief", true],
    ["FUENTE", "no existe", false],
    ["CRITERIO", "Escrito y observable", true],
    ["EV. VERIFICACIÓN", "Prueba en verde", true],
    ["EV. VALIDACIÓN", "no existe", false],
  ];
  cells.forEach((cell, index) => {
    const x = M + index * 2.4;
    if (cell[2]) {
      rect(slide, x, CONTENT_TOP, 2.26, 1.5, C.white, C.border, 0.06);
      rect(slide, x, CONTENT_TOP, 2.26, 0.1, onPaper(C.success), onPaper(C.success));
      addText(slide, cell[0], {
        x: x + 0.18,
        y: 2.72,
        w: 1.9,
        h: 0.36,
        fontSize: 9.6,
        bold: true,
        color: onPaper(C.success),
        charSpacing: 0.8,
      });
      addText(slide, cell[1], {
        x: x + 0.18,
        y: 3.16,
        w: 1.9,
        h: 0.7,
        fontSize: 14,
        bold: true,
        color: C.ink,
      });
    } else {
      rectDashed(slide, x, CONTENT_TOP, 2.26, 1.5, C.paleRed, onPaper(C.red), 0.06);
      addText(slide, cell[0], {
        x: x + 0.18,
        y: 2.72,
        w: 1.9,
        h: 0.36,
        fontSize: 9.6,
        bold: true,
        color: onPaper(C.red),
        charSpacing: 0.8,
      });
      addText(slide, cell[1], {
        x: x + 0.18,
        y: 3.16,
        w: 1.9,
        h: 0.7,
        fontFace: TYPOGRAPHY.mono,
        fontSize: 14,
        bold: true,
        color: onPaper(C.red),
      });
    }
  });
  rect(slide, M, 4.28, 11.89, 1.32, C.navy, C.navy, 0.06);
  addText(slide, "Es Therac-25 en miniatura", {
    x: M + 0.44,
    y: 4.52,
    w: 5.0,
    h: 0.4,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.gold,
  });
  addText(slide, "se programó y se verificó un criterio que nadie autorizó. La diferencia es que aquí el hallazgo aparece antes de que el producto se use.", {
    x: M + 0.44,
    y: 5.0,
    w: 11.01,
    h: 0.44,
    fontSize: 15.5,
    color: C.white,
  });
  rect(slide, M, 5.86, 11.89, 0.56, C.warm, C.border, 0.05);
  addText(slide, "Se marca POR VALIDAR y se registra la pregunta pendiente. No se borra el criterio ni se inventa la fuente.", {
    x: M,
    y: 5.86,
    w: 11.89,
    h: 0.56,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 59 · Patología 2 · necesidad sin criterio */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.3 · Segunda patología",
    "Necesidad sin criterio: nadie tradujo lo que se esperaba",
    "Aquí no hay nada que verificar, porque nunca se definió qué habría que comprobar.",
  );
  const cells = [
    ["NECESIDAD", "Declarada en el brief", true],
    ["FUENTE", "El brief de la iteración", true],
    ["CRITERIO", "sin definir", false],
    ["EV. VERIFICACIÓN", "sin definir", false],
    ["EV. VALIDACIÓN", "sin definir", false],
  ];
  cells.forEach((cell, index) => {
    const x = M + index * 2.4;
    if (cell[2]) {
      rect(slide, x, CONTENT_TOP, 2.26, 1.5, C.white, C.border, 0.06);
      rect(slide, x, CONTENT_TOP, 2.26, 0.1, onPaper(C.success), onPaper(C.success));
      addText(slide, cell[0], {
        x: x + 0.18,
        y: 2.72,
        w: 1.9,
        h: 0.36,
        fontSize: 9.6,
        bold: true,
        color: onPaper(C.success),
        charSpacing: 0.8,
      });
      addText(slide, cell[1], {
        x: x + 0.18,
        y: 3.16,
        w: 1.9,
        h: 0.7,
        fontSize: 14,
        bold: true,
        color: C.ink,
      });
    } else {
      rectDashed(slide, x, CONTENT_TOP, 2.26, 1.5, C.warm, onPaper(C.gold), 0.06);
      addText(slide, cell[0], {
        x: x + 0.18,
        y: 2.72,
        w: 1.9,
        h: 0.36,
        fontSize: 9.6,
        bold: true,
        color: onPaper(C.gold),
        charSpacing: 0.8,
      });
      addText(slide, cell[1], {
        x: x + 0.18,
        y: 3.16,
        w: 1.9,
        h: 0.7,
        fontFace: TYPOGRAPHY.mono,
        fontSize: 14,
        bold: true,
        color: onPaper(C.gold),
      });
    }
  });
  rect(slide, M, 4.28, 5.8, 1.9, C.white, C.border, 0.06);
  addText(slide, "EJEMPLO TÍPICO", {
    x: M + 0.32,
    y: 4.52,
    w: 5.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.1,
  });
  addText(slide, "«El sistema debe ser fácil de usar para el docente.»", {
    x: M + 0.32,
    y: 4.84,
    w: 5.2,
    h: 0.62,
    fontSize: 17,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Está en el brief, nadie lo tradujo a una condición comprobable y por eso ninguna prueba lo cubre.", {
    x: M + 0.32,
    y: 5.56,
    w: 5.2,
    h: 0.5,
    fontSize: 13.5,
    color: C.ink,
  });
  rect(slide, 6.82, 4.28, 5.8, 1.9, C.navy, C.navy, 0.06);
  addText(slide, "SE MARCA", {
    x: 7.14,
    y: 4.52,
    w: 5.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.1,
  });
  addText(slide, "SIN CRITERIO", {
    x: 7.14,
    y: 4.84,
    w: 5.2,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 26,
    bold: true,
    color: C.white,
  });
  addText(slide, "y se registra qué falta decidir. Es una decisión pendiente, no una tarea de programación.", {
    x: 7.14,
    y: 5.48,
    w: 5.2,
    h: 0.6,
    fontSize: 13.5,
    color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 60 · Los dos estados son hallazgos legítimos */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.3 · Cómo se registran",
    "Un proyecto profesional no es el que no tiene huecos",
    "Es el que puede mostrarlos con precisión, en vez de descubrirlos cuando el producto ya está en uso.",
  );
  const marks = [
    {
      x: M,
      accent: C.gold,
      mark: "POR VALIDAR",
      when: "Cuando existe el criterio pero no su fuente.",
      next: "Preguntar a quien tiene autoridad sobre la regla.",
    },
    {
      x: 6.72,
      accent: C.red,
      mark: "SIN CRITERIO",
      when: "Cuando existe la necesidad pero nadie la tradujo.",
      next: "Decidir qué condición observable la representa.",
    },
  ];
  marks.forEach((item) => {
    rect(slide, item.x, CONTENT_TOP, 5.6, 3.02, C.white, C.border, 0.07);
    rect(slide, item.x + 0.34, 2.8, 3.1, 0.62, onPaper(item.accent), onPaper(item.accent), 0.05);
    addText(slide, item.mark, {
      x: item.x + 0.34,
      y: 2.8,
      w: 3.1,
      h: 0.62,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, "CUÁNDO", {
      x: item.x + 0.34,
      y: 3.66,
      w: 4.9,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: onPaper(item.accent),
      charSpacing: 1,
    });
    addText(slide, item.when, {
      x: item.x + 0.34,
      y: 3.9,
      w: 4.9,
      h: 0.5,
      fontSize: 15,
      color: C.ink,
    });
    rule(slide, item.x + 0.34, 4.5, 4.9, C.border, 1);
    addText(slide, "PASO SIGUIENTE", {
      x: item.x + 0.34,
      y: 4.64,
      w: 4.9,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: onPaper(item.accent),
      charSpacing: 1,
    });
    addText(slide, item.next, {
      x: item.x + 0.34,
      y: 4.88,
      w: 4.9,
      h: 0.5,
      fontSize: 15,
      color: C.ink,
    });
  });
  rect(slide, M, 5.66, 11.89, 0.86, C.navy, C.navy, 0.06);
  addText(slide, "Ninguna de las dos marcas es una falla del equipo: las dos son trabajo de análisis bien hecho.", {
    x: M + 0.44,
    y: 5.66,
    w: 11.01,
    h: 0.86,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 61 · Los valores en el límite */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.4 · Dónde probar",
    "El umbral es donde la regla revela su definición real",
    "En el centro del rango casi cualquier implementación coincide con cualquier otra.",
  );
  rect(slide, 1.4, 3.3, 10.6, 0.6, C.mist, C.border, 0.05);
  const zoneW = 10.6 / 6;
  rect(slide, 1.4 + 2.6 * zoneW, 3.3, 0.9 * zoneW, 0.6, C.warm, onPaper(C.gold), 0.05);
  ["1,0", "4,0", "7,0"].forEach((label, index) => {
    const x = 1.4 + index * (10.6 / 2);
    addText(slide, label, {
      x: x - 0.5,
      y: 4.0,
      w: 1.0,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: C.ink,
      align: "center",
    });
  });
  vrule(slide, 6.7, 3.14, 0.92, onPaper(C.red), 2.4);
  addText(slide, "UMBRAL DE APROBACIÓN", {
    x: 5.5,
    y: 2.84,
    w: 2.4,
    h: 0.22,
    fontSize: 9.4,
    bold: true,
    color: onPaper(C.red),
    align: "center",
    charSpacing: 0.9,
  });
  const zones = [
    {
      x: M,
      accent: CYAN,
      title: "En el centro del rango",
      body: "Un 6,2 sigue siendo 6,2 con promedio simple o con ponderación. Las reglas coinciden y la prueba no distingue nada.",
    },
    {
      x: 6.72,
      accent: C.red,
      title: "Cerca del umbral",
      body: "Una décima decide aprobación o reprobación. Ahí es donde dos reglas legítimas entregan resultados distintos.",
    },
  ];
  zones.forEach((zone) => {
    rect(slide, zone.x, 4.5, 5.6, 1.6, C.white, C.border, 0.07);
    rect(slide, zone.x, 4.5, 0.12, 1.6, onPaper(zone.accent), onPaper(zone.accent));
    addText(slide, zone.title, {
      x: zone.x + 0.34,
      y: 4.72,
      w: 4.9,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: onPaper(zone.accent),
    });
    addText(slide, zone.body, {
      x: zone.x + 0.34,
      y: 5.2,
      w: 4.94,
      h: 0.76,
      fontSize: 14,
      color: C.ink,
    });
  });
  addText(slide, "Por eso los casos de prueba se eligen en el límite y no en el promedio cómodo.", {
    x: M,
    y: 6.3,
    w: 11.89,
    h: 0.32,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 62 · La prueba parametrizada */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.4 · El código",
    "Una prueba que recorre el umbral en tres casos",
    "Parametrizada para no repetir la función, y con comparación tolerante entre decimales.",
  );
  const code = [
    "import pytest",
    "",
    "from notas import nota_final",
    "",
    "",
    "@pytest.mark.parametrize(",
    '    ("notas", "esperado"),',
    "    [",
    "        ([3.5, 3.5, 4.8], 3.9),",
    "        ([4.5, 4.5, 3.0], 4.0),",
    "        ([4.0, 4.0, 3.0], 3.7),",
    "    ],",
    ")",
    "def test_promedio_segun_criterio_vigente(notas, esperado):",
    "    assert nota_final(notas) == pytest.approx(esperado)",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: CONTENT_TOP,
    w: 7.5,
    h: 3.94,
    title: "test_notas.py · casos en el umbral",
    code,
    lang: "python",
    fontSize: 11.6,
  });
  const notes = [
    ["parametrize", "Tres casos, una sola función. Agregar un caso es agregar una línea.", CYAN],
    ["approx", "Compara decimales con tolerancia: 3.9 nunca es exactamente 3.9 en binario.", C.gold],
    ["esperado", "Cada valor es la regla vigente puesta por escrito, no una observación del resultado.", C.red],
  ];
  notes.forEach((note, index) => {
    const y = CONTENT_TOP + index * 1.36;
    rect(slide, 8.52, y, 4.1, 1.2, C.white, C.border, 0.06);
    rect(slide, 8.52, y, 0.12, 1.2, onPaper(note[2]), onPaper(note[2]));
    addText(slide, note[0], {
      x: 8.86,
      y: y + 0.16,
      w: 3.5,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: onPaper(note[2]),
    });
    addText(slide, note[1], {
      x: 8.86,
      y: y + 0.52,
      w: 3.54,
      h: 0.6,
      fontSize: 12.8,
      color: C.ink,
    });
  });
  addText(slide, "Los tres casos cruzan el umbral en las dos direcciones y uno queda en zona donde ambas reglas coinciden.", {
    x: M,
    y: 6.5,
    w: 11.89,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 63 · La ejecución y su alcance */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.4 · La ejecución",
    "Verde, y la pregunta sigue abierta",
    "El resultado responde con precisión aquello que la prueba afirma, y nada más.",
  );
  addTerminalPanel(slide, SH, {
    x: M,
    y: CONTENT_TOP,
    w: 11.89,
    h: 1.5,
    title: "PowerShell · proyecto de calificaciones",
    fontSize: 12.4,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "...                                                   [100%]   3 passed" },
    ],
  });
  const readings = [
    {
      x: M,
      accent: C.success,
      label: "LO QUE ESTE VERDE DEMUESTRA",
      items: ["La implementación calcula el promedio simple", "Y lo redondea como el criterio declara", "Para los tres casos ejecutados"],
    },
    {
      x: 6.72,
      accent: C.red,
      label: "LO QUE NO TOCA",
      items: ["Si el promedio debía ser simple", "Si el reglamento exige ponderaciones", "Si aprobar en 4,0 es la regla vigente"],
    },
  ];
  readings.forEach((reading) => {
    rect(slide, reading.x, 4.3, 5.6, 2.1, C.white, C.border, 0.07);
    rect(slide, reading.x, 4.3, 5.6, 0.12, onPaper(reading.accent), onPaper(reading.accent));
    addText(slide, reading.label, {
      x: reading.x + 0.34,
      y: 4.56,
      w: 4.9,
      h: 0.22,
      fontSize: 9.8,
      bold: true,
      color: onPaper(reading.accent),
      charSpacing: 1.1,
    });
    reading.items.forEach((item, index) => {
      const y = 4.9 + index * 0.44;
      rect(slide, reading.x + 0.34, y + 0.12, 0.1, 0.2, onPaper(reading.accent), onPaper(reading.accent));
      addText(slide, item, {
        x: reading.x + 0.6,
        y,
        w: 4.7,
        h: 0.42,
        fontSize: 14,
        color: C.ink,
      });
    });
  });
  validateSlide(slide, pptx);
}

/* 64 · Ninguna prueba elige la regla */
{
  const { slide } = createSlide("dark");
  addText(slide, "3.4 · EL LÍMITE DE LA PRUEBA", {
    x: M,
    y: 0.9,
    w: 6.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Ninguna prueba elige la regla.", {
    x: M,
    y: 1.8,
    w: 11.4,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "Solo puede fijar la que ya se eligió.", {
    x: M,
    y: 2.86,
    w: 11.4,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 4.2, 5.4, C.red, 2.6);
  addText(slide, "Una prueba puede comprobar el promedio simple o el ponderado con la misma facilidad. Escribirla no es tomar la decisión: es dejarla escrita.", {
    x: M,
    y: 4.5,
    w: 11.4,
    h: 0.8,
    fontSize: 18,
    color: C.softBlue,
  });
  rect(slide, M, 5.5, 11.89, 0.86, C.titleFill, C.titleFill, 0.06);
  addText(slide, "Quien decide qué regla rige es el reglamento. Nuestro trabajo es preguntarlo y dejar constancia de la respuesta.", {
    x: M + 0.44,
    y: 5.5,
    w: 11.01,
    h: 0.86,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 65 · La ficha del hallazgo */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.5 · El registro",
    "Un criterio sin fuente se anota con este formato",
    "No como defecto: el programa hace exactamente lo que se le pidió.",
  );
  rect(slide, M, CONTENT_TOP, 7.5, 3.94, C.navy, C.navy, 0.08);
  rect(slide, M, CONTENT_TOP, 7.5, 0.12, C.gold, C.gold);
  addText(slide, "HALLAZGO DE VALIDACIÓN  ·  V-01", {
    x: M + 0.36,
    y: 2.76,
    w: 6.8,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });
  rule(slide, M + 0.36, 3.16, 6.78, C.titleFill, 1.4);
  const fields = [
    ["Criterio afectado", "El promedio se calcula como promedio simple"],
    ["Fuente declarada", "ninguna"],
    ["Pregunta pendiente", "¿Qué ponderación establece el reglamento vigente?"],
    ["Quién puede responderla", "Coordinación académica del curso"],
    ["Riesgo si la respuesta es distinta", "Se altera la aprobación de estudiantes en el umbral"],
  ];
  fields.forEach((field, index) => {
    const y = 3.3 + index * 0.5;
    addText(slide, field[0], {
      x: M + 0.36,
      y,
      w: 2.6,
      h: 0.46,
      fontSize: 11.5,
      color: C.sand,
      valign: "mid",
    });
    addText(slide, field[1], {
      x: M + 3.1,
      y,
      w: 4.06,
      h: 0.46,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });
  addText(slide, "Estado", {
    x: M + 0.36,
    y: 5.88,
    w: 2.6,
    h: 0.42,
    fontSize: 11.5,
    color: C.sand,
    valign: "mid",
  });
  rect(slide, M + 3.1, 5.88, 1.9, 0.42, C.gold, C.gold, 0.05);
  addText(slide, "POR VALIDAR", {
    x: M + 3.1,
    y: 5.88,
    w: 1.9,
    h: 0.42,
    fontSize: 10.5,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });

  const why = [
    ["LO QUE NO ES", "Un defecto. El código no está mal escrito ni incumple lo que se le pidió.", C.red],
    ["LO QUE SÍ ES", "Una pregunta abierta que el equipo técnico no puede responderse a sí mismo.", C.gold],
    ["LO QUE DESBLOQUEA", "Con la respuesta llega el criterio correcto, y recién ahí se programa.", C.success],
  ];
  why.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.36;
    addText(slide, item[0], {
      x: 8.52,
      y,
      w: 4.1,
      h: 0.22,
      fontSize: 9.6,
      bold: true,
      color: onPaper(item[2]),
      charSpacing: 1.1,
    });
    rule(slide, 8.52, y + 0.3, 4.1, onPaper(item[2]), 2.2);
    addText(slide, item[1], {
      x: 8.52,
      y: y + 0.44,
      w: 4.1,
      h: 0.8,
      fontSize: 14,
      color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 66 · Las tres preguntas del Bloque 3 */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · Preguntas",
    "Tres preguntas para llevarse",
    "Responde pensando en tu propia tabla, no en el ejemplo de la clase.",
  );
  const questions = [
    [
      "¿Por qué un criterio sin fuente no es lo mismo que un criterio incorrecto?",
      "Uno puede estar bien y el otro mal; lo que falta en ambos es el respaldo que permita saberlo.",
      C.red,
    ],
    [
      "¿Por qué los valores en el límite revelan la definición real de una regla?",
      "En el centro del rango casi cualquier implementación coincide.",
      C.gold,
    ],
    [
      "¿Qué haces si la fuente que debería validar un criterio todavía no existe?",
      "Registrar el estado y la pregunta es una respuesta profesional; inventar la regla no lo es.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, onPaper(item[2]), index + 1, {
      fontSize: 13,
      color: C.white,
    });
    addText(slide, item[0], {
      x: 1.62,
      y,
      w: 11.0,
      h: 0.62,
      fontSize: 18,
      bold: true,
      color: C.ink,
    });
    rect(slide, 1.62, y + 0.7, 11.0, 0.5, C.warm, C.warm, 0.04);
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, onPaper(item[2]), onPaper(item[2]));
    addText(slide, "PISTA", {
      x: 1.86,
      y: y + 0.7,
      w: 0.8,
      h: 0.5,
      fontSize: 9.4,
      bold: true,
      color: C.red,
      charSpacing: 1,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.76,
      y: y + 0.7,
      w: 9.7,
      h: 0.5,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 67 · Cierre del Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 3 · SÍNTESIS", {
    x: M,
    y: 0.9,
    w: 4.8,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "La trazabilidad convierte una lista de criterios en un mapa.", {
    x: M,
    y: 1.6,
    w: 11.4,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 28,
    bold: true,
    color: C.white,
  });
  addText(slide, "Para cada uno muestra si fue comprobado, si fue autorizado y qué falta para afirmarlo.", {
    x: M,
    y: 2.74,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.82, 11.89, C.titleFill, 1.4);
  addText(slide, "LO QUE QUEDA EN EL PROYECTO", {
    x: M,
    y: 4.0,
    w: 5.0,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  const outputs = [
    ["TABLA", "Necesidad, criterio y las dos evidencias"],
    ["PRUEBA", "Casos que cruzan el umbral, en verde"],
    ["HALLAZGO", "Una pregunta con responsable posible"],
  ];
  outputs.forEach((output, index) => {
    const x = M + index * 4.0;
    rect(slide, x, 4.36, 3.7, 1.26, C.titleFill, C.titleFill, 0.07);
    addText(slide, output[0], {
      x: x + 0.26,
      y: 4.6,
      w: 3.18,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: CYAN_ON_NAVY,
      charSpacing: 1.1,
    });
    addText(slide, output[1], {
      x: x + 0.26,
      y: 4.94,
      w: 3.18,
      h: 0.56,
      fontSize: 13.5,
      color: C.white,
    });
  });
  addText(slide, "El bloque siguiente contrasta este trabajo con la clasificación que propone un agente, para descubrir dónde empieza a inventar la autoridad que no tiene.", {
    x: M,
    y: 5.86,
    w: 11.4,
    h: 0.7,
    fontSize: 16,
    color: C.sand,
  });
  validateSlide(slide, pptx);
}

/* 68 · Apertura Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 4 · 25 MINUTOS", {
    x: M,
    y: 0.9,
    w: 5.2,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.9,
  });
  addText(slide, "El agente clasifica bien", {
    x: M,
    y: 1.66,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  addText(slide, "y declara autoridad que no tiene", {
    x: M,
    y: 2.64,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 3.78, 4.6, C.red, 2.6);
  addText(slide, "Vamos a contrastar nuestra clasificación con la suya y a encontrar el punto exacto en que deja de ser confiable.", {
    x: M,
    y: 4.04,
    w: 11.4,
    h: 0.7,
    fontSize: 17,
    color: C.softBlue,
  });
  const agenda = [
    ["4.1", "Contexto y límites"],
    ["4.2", "Dónde ayuda y dónde no"],
    ["4.3", "Auditar la propuesta"],
    ["4.4", "Consolidar la ficha"],
  ];
  agenda.forEach((item, index) => {
    const x = M + index * 3.0;
    rect(slide, x, 5.06, 2.78, 1.06, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 5.26,
      w: 2.3,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: C.gold,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 5.56,
      w: 2.3,
      h: 0.44,
      fontSize: 14,
      bold: true,
      color: C.white,
    });
  });
  validateSlide(slide, pptx);
}

/* 69 · Qué se le entrega */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.1 · Antes de pedir nada",
    "Un agente clasifica mejor cuando recibe el material real",
    "No se le pide que adivine el producto: se le entrega lo que el equipo ya tiene escrito.",
  );
  const inputs = [
    ["01", "Los tres criterios", "Tal como quedaron redactados en la clase anterior.", C.navy],
    ["02", "El brief de la iteración", "La única fuente autorizada que existe hoy en el proyecto.", CYAN],
    ["03", "La tabla iniciada", "Con las columnas vacías marcadas como vacías, sin rellenar.", C.gold],
  ];
  inputs.forEach((input, index) => {
    const x = M + index * 4.06;
    rect(slide, x, CONTENT_TOP, 3.78, 2.5, C.white, C.border, 0.07);
    rect(slide, x, CONTENT_TOP, 3.78, 0.12, onPaper(input[3]), onPaper(input[3]));
    addText(slide, input[0], {
      x: x + 0.32,
      y: 2.74,
      w: 0.8,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: onPaper(input[3]),
    });
    addText(slide, input[1], {
      x: x + 0.32,
      y: 3.3,
      w: 3.14,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.ink,
    });
    addText(slide, input[2], {
      x: x + 0.32,
      y: 4.0,
      w: 3.14,
      h: 0.8,
      fontSize: 14,
      color: C.ink,
    });
  });
  rect(slide, M, 5.34, 11.89, 1.1, C.navy, C.navy, 0.06);
  addText(slide, "Con material real, el agente ordena y amplía.", {
    x: M + 0.44,
    y: 5.54,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.white,
  });
  addText(slide, "Sin material real, completa los espacios vacíos, que es exactamente lo que hace bien.", {
    x: M + 0.44,
    y: 5.96,
    w: 11.01,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.gold,
  });
  validateSlide(slide, pptx);
}

/* 70 · La petición con restricciones */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.1 · La petición",
    "Qué se entrega, qué se pide y qué no está autorizado a decidir",
    "Las restricciones no son cortesía: son lo que impide que rellene la columna de la fuente.",
  );
  rect(slide, M, CONTENT_TOP, 7.6, 3.96, C.editorBg, C.titleFill, 0.07);
  const promptLines = [
    ["Contexto:", C.gold],
    ["producto de cálculo de calificaciones. Te entrego tres", C.white],
    ["criterios de calidad y el brief de la iteración.", C.white],
    ["", C.white],
    ["Tarea:", C.gold],
    ["clasifica cada criterio como VERIFICACIÓN o VALIDACIÓN", C.white],
    ["e indica qué evidencia respondería esa pregunta.", C.white],
    ["", C.white],
    ["Restricciones:", C.gold],
    ["- Declara la fuente que autoriza cada criterio.", CYAN_ON_NAVY],
    ["- Si no aparece en el material, escribe FUENTE NO DISPONIBLE.", CYAN_ON_NAVY],
    ["- No propongas umbrales ni reglas que no estén en el material.", CYAN_ON_NAVY],
    ["- No asumas normativas ni prácticas del sector.", CYAN_ON_NAVY],
    ["", C.white],
    ["Salida:", C.gold],
    ["tabla con criterio, clasificación, fuente y evidencia.", C.white],
  ];
  promptLines.forEach((line, index) => {
    if (!line[0]) return;
    addText(slide, line[0], {
      x: M + 0.34,
      y: 2.66 + index * 0.226,
      w: 6.94,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.4,
      bold: line[1] === C.gold,
      color: line[1],
    });
  });
  const highlights = [
    ["LO QUE SE ENTREGA", "Material real del proyecto, no una descripción general.", C.navy],
    ["LO QUE SE PIDE", "Una clasificación con su evidencia, en formato de tabla.", CYAN],
    ["LO QUE SE PROHÍBE", "Inventar fuentes, umbrales, normativas o convenciones.", C.red],
  ];
  highlights.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.36;
    rect(slide, 8.62, y, 4.0, 1.2, C.white, C.border, 0.06);
    rect(slide, 8.62, y, 0.12, 1.2, onPaper(item[2]), onPaper(item[2]));
    addText(slide, item[0], {
      x: 8.96,
      y: y + 0.18,
      w: 3.5,
      h: 0.22,
      fontSize: 9.6,
      bold: true,
      color: onPaper(item[2]),
      charSpacing: 1,
    });
    addText(slide, item[1], {
      x: 8.96,
      y: y + 0.5,
      w: 3.44,
      h: 0.6,
      fontSize: 13.5,
      color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 71 · Las restricciones que importan */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.1 · Por qué esas tres",
    "Cada restricción bloquea una forma distinta de rellenar",
    "Sin ellas, la respuesta llega igual de ordenada y con datos que nadie escribió.",
  );
  const zoneLabels = [
    ["LO QUE HARÍA SIN LA RESTRICCIÓN", M, 4.16, onPaper(C.red)],
    ["LA BARRERA", 4.96, 2.9, C.ink],
    ["LO QUE QUEDA EN SU LUGAR", 8.34, 4.27, onPaper(C.success)],
  ];
  zoneLabels.forEach((zone) => {
    addText(slide, zone[0], {
      x: zone[1],
      y: 2.38,
      w: zone[2],
      h: 0.2,
      fontSize: 9,
      bold: true,
      color: zone[3],
      align: "center",
      charSpacing: 0.9,
    });
  });
  vrule(slide, 4.82, 2.66, 3.5, C.border, 1.4);
  vrule(slide, 8.18, 2.66, 3.5, C.border, 1.4);

  const rules = [
    {
      accent: C.red,
      rule: "FUENTE NO DISPONIBLE",
      blocks: "Inventar un documento o una autoridad que no existe.",
      instead: "El hueco queda visible, que es justo lo que buscamos.",
    },
    {
      accent: C.gold,
      rule: "Sin umbrales nuevos",
      blocks: "Proponer números sin respaldo: 200 ms, 95 %, 5 segundos.",
      instead: "El umbral lo define quien conoce el uso real del producto.",
    },
    {
      accent: CYAN,
      rule: "Sin normativas asumidas",
      blocks: "Apelar a «la normativa vigente» o «el estándar del sector».",
      instead: "Si una norma aplica, alguien la nombra con su número.",
    },
  ];
  rules.forEach((item, index) => {
    const y = 2.72 + index * 1.16;
    rectDashed(slide, M, y, 4.16, 0.96, C.paleRed, onPaper(C.red), 0.05);
    addText(slide, item.blocks, {
      x: M + 0.24,
      y,
      w: 3.7,
      h: 0.96,
      fontSize: 13.5,
      color: onPaper(C.red),
      valign: "mid",
    });
    rect(slide, 4.96, y + 0.16, 2.9, 0.64, onPaper(item.accent), onPaper(item.accent), 0.05);
    addText(slide, item.rule, {
      x: 5.04,
      y: y + 0.16,
      w: 2.74,
      h: 0.64,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    rect(slide, 8.34, y, 4.27, 0.96, C.white, C.border, 0.05);
    rect(slide, 8.34, y, 0.1, 0.96, onPaper(C.success), onPaper(C.success));
    addText(slide, item.instead, {
      x: 8.62,
      y,
      w: 3.8,
      h: 0.96,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, M, 6.28, 11.89, 0.56, C.navy, C.navy, 0.05);
  addText(slide, "La respuesta útil de un agente incluye decir qué no puede responder.", {
    x: M,
    y: 6.28,
    w: 11.89,
    h: 0.56,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 72 · Dónde ayuda */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.2 · El terreno propio",
    "Con contexto suficiente, hay cuatro cosas que hace muy bien",
    "Todas son trabajo de ordenamiento y ampliación, y ahí conviene aprovecharlo.",
  );
  const strengths = [
    ["Ordenar", "Criterios dispersos en una estructura comparable."],
    ["Detectar", "Criterios redactados sin una condición observable."],
    ["Ampliar", "Preguntas de validación que el equipo no había formulado."],
    ["Cruzar", "Necesidades del brief que ninguna fila del proyecto recoge."],
  ];
  strengths.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = M + col * 6.04;
    const y = CONTENT_TOP + row * 1.5;
    rect(slide, x, y, 5.85, 1.34, C.white, C.border, 0.06);
    rect(slide, x, y, 0.12, 1.34, onPaper(C.success), onPaper(C.success));
    addText(slide, item[0], {
      x: x + 0.4,
      y: y + 0.24,
      w: 1.8,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: onPaper(C.success),
    });
    addText(slide, item[1], {
      x: x + 0.4,
      y: y + 0.72,
      w: 5.1,
      h: 0.46,
      fontSize: 14.5,
      color: C.ink,
    });
  });
  rect(slide, M, 5.58, 11.89, 0.94, C.navy, C.navy, 0.06);
  addText(slide, "En estas cuatro tareas el agente ahorra tiempo real y mejora el resultado del equipo.", {
    x: M + 0.44,
    y: 5.58,
    w: 11.01,
    h: 0.94,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 73 · El límite */
{
  const { slide } = createSlide("dark");
  addText(slide, "4.2 · DÓNDE DEJA DE SER CONFIABLE", {
    x: M,
    y: 0.9,
    w: 6.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Puede ayudar a verificar", {
    x: M,
    y: 1.72,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "contra una especificación disponible.", {
    x: M,
    y: 2.66,
    w: 11.4,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 32,
    bold: true,
    color: C.softBlue,
  });
  addText(slide, "No puede validar una necesidad.", {
    x: M,
    y: 3.66,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.gold,
  });
  rule(slide, M, 4.82, 5.4, C.red, 2.6);
  addText(slide, "La validación exige una autoridad sobre el producto, y esa autoridad no está en el texto que el modelo procesa. No es una limitación técnica que se arregle con más contexto.", {
    x: M,
    y: 5.1,
    w: 11.4,
    h: 1.0,
    fontSize: 17,
    color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 74 · Frases con forma de respaldo */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.2 · La señal de alarma",
    "Cuando le falta la fuente, rara vez responde «no lo sé»",
    "Produce una frase que tiene la forma de un respaldo, sin serlo.",
  );
  const phrases = [
    "«según la práctica habitual»",
    "«por convención en sistemas académicos»",
    "«de acuerdo con la normativa vigente»",
  ];
  phrases.forEach((phrase, index) => {
    const y = CONTENT_TOP + index * 0.86;
    rect(slide, M, y, 6.4, 0.72, C.paleRed, onPaper(C.red), 0.05);
    addText(slide, phrase, {
      x: M + 0.34,
      y,
      w: 5.9,
      h: 0.72,
      fontSize: 17,
      italic: true,
      bold: true,
      color: onPaper(C.red),
      valign: "mid",
    });
  });
  rect(slide, 7.5, CONTENT_TOP, 5.12, 2.44, C.navy, C.navy, 0.07);
  addText(slide, "NINGUNA NOMBRA", {
    x: 7.84,
    y: 2.72,
    w: 4.4,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.1,
  });
  ["Un documento", "Una versión o una fecha", "Una persona responsable"].forEach((item, index) => {
    const y = 3.12 + index * 0.56;
    rect(slide, 7.84, y + 0.1, 0.1, 0.24, C.gold, C.gold);
    addText(slide, item, {
      x: 8.12,
      y,
      w: 4.2,
      h: 0.44,
      fontSize: 15.5,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });
  rect(slide, M, 5.5, 11.89, 1.0, C.warm, C.border, 0.06);
  addText(slide, "Una fuente verificable se puede abrir, citar y fechar. Una frase con forma de respaldo no se puede ni contradecir.", {
    x: M + 0.44,
    y: 5.5,
    w: 11.01,
    h: 1.0,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 75 · La respuesta del agente */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · La propuesta",
    "Así llega la respuesta, ordenada y con buena presencia",
    "Cuatro criterios clasificados, cada uno con la fuente que el agente declara.",
  );
  const cols = [0.9, 5.6, 2.6, 2.79];
  const colXs = [M, M + 0.9, M + 6.5, M + 9.1];
  const headers = ["#", "CRITERIO PROPUESTO", "CLASIFICACIÓN", "FUENTE QUE DECLARA"];
  rect(slide, M, 2.44, 11.89, 0.52, C.navy, C.navy, 0.04);
  headers.forEach((header, index) => {
    addText(slide, header, {
      x: colXs[index] + 0.18,
      y: 2.44,
      w: cols[index] - 0.36,
      h: 0.52,
      fontSize: 9.4,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 0.8,
    });
  });
  const rows = [
    ["1", "El promedio se redondea a un decimal", "Verificación", "Convención estándar en sistemas académicos"],
    ["2", "Ante una lista vacía, la función informa el error", "Verificación", "Contrato declarado de la función"],
    ["3", "El cálculo responde en menos de 200 ms", "Verificación", "Buenas prácticas de rendimiento"],
    ["4", "Las notas registradas están entre 1,0 y 7,0", "Validación", "Escala de calificaciones vigente"],
  ];
  rows.forEach((row, index) => {
    const y = 3.06 + index * 0.86;
    rect(slide, M, y, 11.89, 0.78, C.white, C.border, 0.04);
    addCircleLabel(slide, M + 0.2, y + 0.16, 0.46, C.navy, row[0], { fontSize: 11 });
    row.slice(1).forEach((cell, cellIndex) => {
      addText(slide, cell, {
        x: colXs[cellIndex + 1] + 0.18,
        y,
        w: cols[cellIndex + 1] - 0.36,
        h: 0.78,
        fontSize: 13.5,
        color: C.ink,
        valign: "mid",
      });
    });
  });
  addText(slide, "La estructura es impecable. El problema está concentrado en una sola columna.", {
    x: M,
    y: 6.6,
    w: 11.89,
    h: 0.32,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 76 · Auditoría fila por fila */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · La auditoría",
    "La misma tabla, con el veredicto de cada fila",
    "Tres de las cuatro fuentes no resisten una comprobación simple.",
  );
  const audit = [
    ["1", "Convención estándar en sistemas académicos", "REFORMULAR", "La clasificación es correcta, pero esa convención no existe como documento: debía decir FUENTE NO DISPONIBLE.", C.gold],
    ["2", "Contrato declarado de la función", "ACEPTAR", "La fuente está dentro del material entregado y es verificable por cualquiera del equipo.", C.success],
    ["3", "Buenas prácticas de rendimiento", "RECHAZAR", "El umbral es inventado y además decidir cuánto puede demorar el cálculo es una pregunta de validación.", C.red],
    ["4", "Escala de calificaciones vigente", "REFORMULAR", "La fuente externa sí existe, pero hay que nombrar el documento exacto y confirmar que aplica.", C.gold],
  ];
  rect(slide, M, CONTENT_TOP, 3.1, 3.94, C.navy, C.navy, 0.08);
  rect(slide, M, CONTENT_TOP, 3.1, 0.12, C.red, C.red);
  addText(slide, "RESULTADO", {
    x: M + 0.3,
    y: 2.78,
    w: 2.5,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.1,
  });
  addText(slide, "3 de 4", {
    x: M + 0.3,
    y: 3.1,
    w: 2.5,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: C.white,
  });
  addText(slide, "fuentes no resisten una comprobación simple", {
    x: M + 0.3,
    y: 4.06,
    w: 2.5,
    h: 0.8,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
  });
  rule(slide, M + 0.3, 4.98, 2.5, C.red, 2.2);
  addText(slide, "Y la única que se sostiene apunta a un documento del propio proyecto.", {
    x: M + 0.3,
    y: 5.16,
    w: 2.54,
    h: 1.1,
    fontSize: 13.5,
    color: C.sand,
  });

  audit.forEach((row, index) => {
    const y = CONTENT_TOP + index * 1.0;
    rect(slide, 4.16, y, 8.45, 0.88, C.white, C.border, 0.05);
    rect(slide, 4.16, y, 0.1, 0.88, onPaper(row[4]), onPaper(row[4]));
    addCircleLabel(slide, 4.42, y + 0.21, 0.46, onPaper(row[4]), row[0], { fontSize: 11 });
    addText(slide, row[1], {
      x: 5.06,
      y: y + 0.08,
      w: 5.4,
      h: 0.34,
      fontSize: 12.5,
      italic: true,
      color: C.slate,
    });
    addText(slide, row[3], {
      x: 5.06,
      y: y + 0.46,
      w: 5.4,
      h: 0.36,
      fontSize: 12.5,
      color: C.ink,
    });
    rect(slide, 10.72, y + 0.19, 1.7, 0.5, onPaper(row[4]), onPaper(row[4]), 0.05);
    addText(slide, row[2], {
      x: 10.72,
      y: y + 0.19,
      w: 1.7,
      h: 0.5,
      fontSize: 10.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.6,
    });
  });
  validateSlide(slide, pptx);
}

/* 77 · El umbral inventado */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · El caso más peligroso",
    "Un número inventado es peor que una respuesta vacía",
    "Una respuesta vacía se nota. Un número específico se copia y sigue viaje.",
  );
  addText(slide, "200 ms", {
    x: M,
    y: 2.7,
    w: 3.2,
    h: 1.1,
    fontFace: TYPOGRAPHY.display,
    fontSize: 58,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "nadie lo pidió, nadie lo midió, nadie lo autorizó", {
    x: M,
    y: 3.9,
    w: 3.3,
    h: 0.8,
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  const chain = [
    ["01", "El agente lo propone", "Suena razonable y llena el vacío de la respuesta.", C.gold],
    ["02", "Alguien lo copia", "Pasa al criterio sin que nadie pregunte de dónde salió.", CYAN],
    ["03", "La prueba lo fija", "Desde ahí es la especificación, y romperlo es «una falla».", C.red],
  ];
  chain.forEach((step, index) => {
    const y = CONTENT_TOP + index * 1.2;
    rect(slide, 4.4, y, 8.2, 1.1, C.white, C.border, 0.06);
    rect(slide, 4.4, y, 0.12, 1.1, onPaper(step[3]), onPaper(step[3]));
    addText(slide, step[0], {
      x: 4.72,
      y: y + 0.18,
      w: 0.6,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: onPaper(step[3]),
    });
    addText(slide, step[1], {
      x: 5.44,
      y: y + 0.2,
      w: 3.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, step[2], {
      x: 5.44,
      y: y + 0.62,
      w: 6.9,
      h: 0.4,
      fontSize: 13.5,
      color: C.ink,
    });
  });
  rect(slide, M, 6.18, 11.89, 0.6, C.navy, C.navy, 0.05);
  addText(slide, "Tres pasos después, un número que nadie decidió se defiende como si fuera la regla del producto.", {
    x: M + 0.44,
    y: 6.18,
    w: 11.01,
    h: 0.6,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 78 · Las cuatro marcas de auditoría */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · Cómo se audita",
    "Cuatro marcas, y cada una obliga a escribir por qué",
    "Rechazar sin justificación es tan poco profesional como aceptar sin leer.",
  );
  const marks = [
    ["ACEPTAR", "La propuesta se sostiene con el material entregado.", C.success],
    ["REFORMULAR", "La idea sirve, pero hay que corregir la fuente o el alcance.", C.gold],
    ["POSPONER", "Es una pregunta válida que todavía no se puede responder.", CYAN],
    ["RECHAZAR", "Introduce datos, reglas o autoridades que nadie declaró.", C.red],
  ];
  // Las cuatro marcas forman un gradiente: cuánto de la propuesta sobrevive.
  addText(slide, "SE CONSERVA TAL CUAL", {
    x: M,
    y: 2.5,
    w: 4.0,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: onPaper(C.success),
    charSpacing: 0.9,
  });
  addText(slide, "NO ENTRA AL PROYECTO", {
    x: 8.61,
    y: 2.5,
    w: 4.0,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: onPaper(C.red),
    align: "right",
    charSpacing: 0.9,
  });
  const segW = 11.89 / 4;
  marks.forEach((mark, index) => {
    const x = M + index * segW;
    rect(slide, x, 2.82, segW - 0.04, 0.74, onPaper(mark[2]), onPaper(mark[2]), 0.04);
    addText(slide, mark[0], {
      x,
      y: 2.82,
      w: segW - 0.04,
      h: 0.74,
      fontSize: 13,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 1.1,
    });
    rule(slide, x, 3.96, segW - 0.36, onPaper(mark[2]), 2.2);
    addText(slide, mark[1], {
      x,
      y: 4.14,
      w: segW - 0.36,
      h: 1.2,
      fontSize: 14,
      color: C.ink,
    });
  });
  rect(slide, M, 5.7, 11.89, 0.86, C.navy, C.navy, 0.06);
  addText(slide, "La ficha final conserva al menos una propuesta aceptada y una rechazada, cada una con su justificación escrita.", {
    x: M + 0.44,
    y: 5.7,
    w: 11.01,
    h: 0.86,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 79 · El patrón */
{
  const { slide } = createSlide("dark");
  addText(slide, "4.3 · EL PATRÓN QUE CONVIENE RETENER", {
    x: M,
    y: 0.9,
    w: 7.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Acierta en la clasificación.", {
    x: M,
    y: 1.72,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.white,
  });
  addText(slide, "Falla en la columna de la fuente.", {
    x: M,
    y: 2.7,
    w: 11.4,
    h: 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.gold,
  });
  const why = [
    ["CLASIFICAR", "Es una tarea de estructura: se resuelve con el texto a la vista.", CYAN_ON_NAVY, "FUERTE"],
    ["DECLARAR AUTORIDAD", "Es una tarea de contexto institucional: no está en el texto.", C.gold, "SIMULA"],
  ];
  why.forEach((item, index) => {
    const x = M + index * 6.04;
    rect(slide, x, 4.0, 5.85, 1.9, C.titleFill, C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.34,
      y: 4.26,
      w: 3.6,
      h: 0.24,
      fontSize: 10.5,
      bold: true,
      color: item[2],
      charSpacing: 1.2,
    });
    addText(slide, item[1], {
      x: x + 0.34,
      y: 4.62,
      w: 5.16,
      h: 0.62,
      fontSize: 15.5,
      color: C.white,
    });
    rect(slide, x + 0.34, 5.34, 1.5, 0.42, item[2], item[2], 0.05);
    addText(slide, item[3], {
      x: x + 0.34,
      y: 5.34,
      w: 1.5,
      h: 0.42,
      fontSize: 10,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
  });
  addText(slide, "Por eso la auditoría se concentra donde el modelo es débil, no donde ya es bueno.", {
    x: M,
    y: 6.16,
    w: 11.4,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.sand,
  });
  validateSlide(slide, pptx);
}

/* 80 · Qué conserva un registro de validación */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.4 · El registro",
    "Qué conserva un registro de validación",
    "Cinco cosas, y ninguna de ellas es una conclusión definitiva sobre la calidad del producto.",
  );
  rect(slide, M, CONTENT_TOP, 3.4, 3.9, C.navy, C.navy, 0.08);
  rect(slide, M, CONTENT_TOP, 3.4, 0.12, C.gold, C.gold);
  addText(slide, "Un registro", {
    x: M + 0.3,
    y: 2.86,
    w: 2.8,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
  });
  addText(slide, "no cierra el tema", {
    x: M + 0.3,
    y: 3.3,
    w: 2.8,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.gold,
  });
  rule(slide, M + 0.3, 4.32, 2.8, C.red, 2.2);
  addText(slide, "Deja constancia de qué se comprobó, qué se decidió y qué sigue esperando una respuesta que el equipo no puede darse a sí mismo.", {
    x: M + 0.3,
    y: 4.52,
    w: 2.84,
    h: 1.74,
    fontSize: 14,
    color: C.softBlue,
  });
  const sections = [
    ["01", "La trazabilidad entre necesidad, criterio y evidencia", C.navy],
    ["02", "La clasificación de cada criterio, con su fuente o su ausencia", CYAN],
    ["03", "Los hallazgos de validación, con su pregunta y su responsable", C.gold],
    ["04", "Las decisiones tomadas sobre lo que propuso el agente", C.red],
    ["05", "Las preguntas abiertas para quien tiene autoridad", C.success],
  ];
  sections.forEach((section, index) => {
    const y = CONTENT_TOP + index * 0.78;
    rect(slide, 4.5, y + 0.14, 0.44, 0.44, onPaper(section[2]), onPaper(section[2]), 0.05);
    addText(slide, section[0], {
      x: 4.5,
      y: y + 0.14,
      w: 0.44,
      h: 0.44,
      fontSize: 10.5,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, section[1], {
      x: 5.1,
      y,
      w: 7.5,
      h: 0.72,
      fontSize: 15.5,
      color: C.ink,
      valign: "mid",
    });
    if (index < sections.length - 1) {
      rule(slide, 4.5, y + 0.74, 8.1, C.border, 1);
    }
  });
  validateSlide(slide, pptx);
}

/* 81 · Las tres preguntas del Bloque 4 */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · Preguntas",
    "Tres preguntas para llevarse",
    "Responde pensando en la propuesta que auditaste, no en el ejemplo de la clase.",
  );
  const questions = [
    [
      "¿Por qué detectar un criterio sin fuente no autoriza a inventarle una?",
      "Revisa quién tiene la potestad de declarar la regla del producto.",
      C.red,
    ],
    [
      "¿Qué diferencia una fuente verificable de «según la práctica habitual»?",
      "Una se puede abrir, citar y fechar; la otra no se puede ni contradecir.",
      C.gold,
    ],
    [
      "¿En qué parte de este bloque el criterio humano fue insustituible?",
      "Compara la columna que el agente resolvió bien con la que tuviste que resolver tú.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, onPaper(item[2]), index + 1, {
      fontSize: 13,
      color: C.white,
    });
    addText(slide, item[0], {
      x: 1.62,
      y,
      w: 11.0,
      h: 0.62,
      fontSize: 18,
      bold: true,
      color: C.ink,
    });
    rect(slide, 1.62, y + 0.7, 11.0, 0.5, C.warm, C.warm, 0.04);
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, onPaper(item[2]), onPaper(item[2]));
    addText(slide, "PISTA", {
      x: 1.86,
      y: y + 0.7,
      w: 0.8,
      h: 0.5,
      fontSize: 9.4,
      bold: true,
      color: C.red,
      charSpacing: 1,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.76,
      y: y + 0.7,
      w: 9.7,
      h: 0.5,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 82 · Cierre del Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 4 · SÍNTESIS", {
    x: M,
    y: 0.9,
    w: 4.8,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Un agente ordena, amplía y clasifica.", {
    x: M,
    y: 1.6,
    w: 11.4,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 32,
    bold: true,
    color: C.white,
  });
  addText(slide, "La autoridad sobre la necesidad sigue siendo humana.", {
    x: M,
    y: 2.54,
    w: 11.4,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 30,
    bold: true,
    color: C.gold,
  });
  addText(slide, "El riesgo no es que se equivoque de categoría, sino que rellene la fuente con una frase que suena a respaldo.", {
    x: M,
    y: 3.72,
    w: 11.4,
    h: 0.62,
    fontSize: 17,
    color: C.softBlue,
  });
  rule(slide, M, 4.52, 11.89, C.titleFill, 1.4);
  addText(slide, "CON LA FICHA EN MANO", {
    x: M,
    y: 4.76,
    w: 5.0,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(slide, "ya podemos afirmar algo acotado sobre el producto. El cierre reúne lo verificado, lo validado y lo pendiente en una sola conclusión proporcional a la evidencia.", {
    x: M,
    y: 5.06,
    w: 11.4,
    h: 0.9,
    fontSize: 18,
    color: C.white,
  });
  validateSlide(slide, pptx);
}

/* 83 · El recorrido de la sesión */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre de la clase",
    "Qué está comprobado y qué está solo decidido",
    "La sesión empezó con tres criterios bien redactados y termina sabiendo cuáles podemos sostener.",
  );
  const path = [
    ["Criterios observables", C.navy],
    ["Dos preguntas con fuentes distintas", CYAN],
    ["Tres fallas y la pregunta que faltó", C.red],
    ["Trazabilidad necesidad-criterio-evidencia", C.gold],
    ["Hallazgos de validación registrados", C.success],
    ["Conclusión proporcional", C.navy],
  ];
  path.forEach((step, index) => {
    const y = CONTENT_TOP + index * 0.66;
    rect(slide, M + 0.3, y + 0.12, 0.36, 0.36, onPaper(step[1]), onPaper(step[1]), 0.18);
    addText(slide, step[0], {
      x: 1.5,
      y,
      w: 6.4,
      h: 0.6,
      fontSize: 16.5,
      bold: index === path.length - 1,
      color: C.ink,
      valign: "mid",
    });
    if (index < path.length - 1) {
      vrule(slide, M + 0.48, y + 0.48, 0.3, C.border, 1.4);
    }
  });
  rect(slide, 8.3, CONTENT_TOP, 4.32, 3.7, C.navy, C.navy, 0.08);
  addText(slide, "LA VERIFICACIÓN NO PERDIÓ IMPORTANCIA", {
    x: 8.62,
    y: 2.76,
    w: 3.7,
    h: 0.44,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  addText(slide, "Cambió de estatus: dejó de ser la única pregunta y pasó a ser una de dos.", {
    x: 8.62,
    y: 3.36,
    w: 3.74,
    h: 1.2,
    fontSize: 17,
    bold: true,
    color: C.white,
  });
  rule(slide, 8.62, 4.7, 3.7, C.red, 2.2);
  addText(slide, "Con la ventaja de que ahora sabemos cuál de las dos responde cada herramienta que ejecutamos.", {
    x: 8.62,
    y: 4.92,
    w: 3.74,
    h: 1.2,
    fontSize: 14.5,
    color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 84 · Lo que podemos afirmar */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · LA CONCLUSIÓN DE HOY", {
    x: M,
    y: 0.9,
    w: 6.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  rect(slide, M, 1.6, 0.14, 3.4, C.red, C.red);
  addText(slide, "El proyecto cumple los criterios que tiene escritos, y esa correspondencia está demostrada con pruebas ejecutables.", {
    x: M + 0.5,
    y: 1.62,
    w: 11.0,
    h: 1.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
  });
  addText(slide, "De esos criterios, algunos tienen una fuente que los autoriza y otros quedaron registrados como decisiones del equipo todavía sin validar.", {
    x: M + 0.5,
    y: 2.86,
    w: 11.0,
    h: 1.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.softBlue,
  });
  addText(slide, "El producto está verificado en su alcance actual y validado solo parcialmente.", {
    x: M + 0.5,
    y: 4.12,
    w: 11.0,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.gold,
  });
  rect(slide, M, 5.4, 11.89, 1.0, C.titleFill, C.titleFill, 0.06);
  addText(slide, "Esa frase es más corta que «funciona bien» y dice muchísimo más, porque cada parte se puede comprobar.", {
    x: M + 0.44,
    y: 5.4,
    w: 11.01,
    h: 1.0,
    fontSize: 16.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 85 · Lo que no podemos afirmar */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · Los límites",
    "Y esto queda explícitamente fuera de lo que podemos decir",
    "Nombrar el límite de una conclusión es parte de sostenerla.",
  );
  const limits = [
    "Que los criterios escritos sean los correctos para el producto",
    "Que una suite en verde compense la ausencia de una fuente autorizada",
    "Que el comportamiento probado en nuestro computador sea el que operaría en otro contexto",
    "Que la clasificación de un agente reemplace a quien tiene autoridad sobre la regla",
  ];
  limits.forEach((limit, index) => {
    const y = CONTENT_TOP + index * 0.94;
    rect(slide, M, y, 11.89, 0.82, C.paleRed, onPaper(C.red), 0.05);
    addText(slide, "NO", {
      x: M + 0.34,
      y,
      w: 0.7,
      h: 0.82,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: onPaper(C.red),
      valign: "mid",
    });
    vrule(slide, M + 1.24, y + 0.16, 0.5, onPaper(C.red), 1.4);
    addText(slide, limit, {
      x: M + 1.5,
      y,
      w: 10.3,
      h: 0.82,
      fontSize: 16,
      color: C.ink,
      valign: "mid",
    });
  });
  addText(slide, "Ninguno de estos límites es un fracaso de la sesión: son el trabajo que viene después.", {
    x: M,
    y: 6.34,
    w: 11.89,
    h: 0.32,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 86 · Síntesis en cuatro frases */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · Síntesis",
    "La clase entera cabe en cuatro frases",
    "Con el vocabulario exacto: especificación, necesidad, fuente, correspondencia y evidencia.",
  );
  const sentences = [
    ["Verificar es comparar el producto con", "la especificación que se declaró.", C.navy],
    ["Validar es comparar la especificación con", "la necesidad que había que satisfacer.", CYAN],
    ["Una prueba en verde puede estar equivocada cuando", "la expectativa que afirma nunca fue autorizada.", C.gold],
    ["Marcamos un criterio como POR VALIDAR cuando", "no podemos nombrar la fuente que lo respalda.", C.red],
  ];
  sentences.forEach((sentence, index) => {
    const y = CONTENT_TOP + index * 0.96;
    rect(slide, M, y, 11.89, 0.86, C.white, C.border, 0.05);
    rect(slide, M, y, 0.12, 0.86, onPaper(sentence[2]), onPaper(sentence[2]));
    addText(slide, sentence[0], {
      x: M + 0.44,
      y,
      w: 5.3,
      h: 0.86,
      fontSize: 15,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, sentence[1], {
      x: 6.6,
      y,
      w: 5.86,
      h: 0.86,
      fontSize: 15,
      bold: true,
      color: onPaper(sentence[2]),
      valign: "mid",
    });
  });
  rect(slide, M, 6.32, 11.89, 0.48, C.navy, C.navy, 0.05);
  addText(slide, "Si estas cuatro frases se pueden completar sin dudar, la clase cumplió su objetivo.", {
    x: M,
    y: 6.32,
    w: 11.89,
    h: 0.48,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 87 · Próxima clase */
{
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Próxima sesión",
    "Software con pruebas y software sin pruebas",
    "Salimos del producto pequeño y miramos repositorios reales y maduros.",
  );
  const topics = [
    ["Cobertura", "Qué porcentaje del código toca la suite, y qué no dice ese número.", C.navy],
    ["Historial de defectos", "Cómo cambia el registro de fallas cuando existe una suite.", CYAN],
    ["Ritmo de cambios", "Cuántas veces se toca el código y con qué confianza.", C.gold],
    ["Capacidad de modificar", "Si se puede cambiar sin romper lo que ya funcionaba.", C.success],
  ];
  topics.forEach((topic, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = M + col * 6.04;
    const y = CONTENT_TOP + row * 1.42;
    rect(slide, x, y, 5.85, 1.26, C.white, C.border, 0.06);
    rect(slide, x, y, 0.12, 1.26, onPaper(topic[2]), onPaper(topic[2]));
    addText(slide, topic[0], {
      x: x + 0.4,
      y: y + 0.2,
      w: 5.1,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: onPaper(topic[2]),
    });
    addText(slide, topic[1], {
      x: x + 0.4,
      y: y + 0.66,
      w: 5.1,
      h: 0.46,
      fontSize: 14,
      color: C.ink,
    });
  });
  rect(slide, M, 5.5, 11.89, 1.06, C.navy, C.navy, 0.06);
  addText(slide, "La pregunta que llevamos:", {
    x: M + 0.44,
    y: 5.68,
    w: 4.0,
    h: 0.3,
    fontSize: 14,
    color: C.gold,
  });
  addText(slide, "si las pruebas no garantizan que los criterios sean correctos, ¿qué es exactamente lo que sí cambian?", {
    x: M + 0.44,
    y: 6.02,
    w: 11.01,
    h: 0.36,
    fontSize: 17,
    bold: true,
    color: C.white,
  });
  validateSlide(slide, pptx);
}

/* 88 · Mensaje final */
{
  const { slide } = createSlide("dark");
  addText(slide, "CLASE 04 · MENSAJE FINAL", {
    x: M,
    y: 0.84,
    w: 5.2,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "Un sistema puede hacer", {
    x: M,
    y: 1.5,
    w: 11.4,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "exactamente lo que le pedimos", {
    x: M,
    y: 2.36,
    w: 11.4,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "y aun así estar equivocado.", {
    x: M,
    y: 3.22,
    w: 11.4,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.gold,
  });
  const sequence = [
    ["EXPECTATIVA", "alguien la decide", C.red],
    ["FUENTE", "alguien la autoriza", C.gold],
    ["EVIDENCIA", "el equipo la produce", CYAN_ON_NAVY],
    ["CONCLUSIÓN", "respeta el límite", C.success],
  ];
  sequence.forEach((item, index) => {
    const x = 0.88 + index * 3.06;
    rect(slide, x, 4.5, 2.7, 1.3, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 4.78,
      w: 2.22,
      h: 0.2,
      fontSize: 9.8,
      bold: true,
      color: index === 3 ? onPaper(C.success) : item[2],
      align: "center",
      charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 5.16,
      w: 2.22,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: index === 3 ? C.ink : C.white,
      align: "center",
    });
    if (index < sequence.length - 1) {
      addArrow(slide, x + 2.76, 4.92, 0.18, C.red);
    }
  });
  addText(slide, "La diferencia entre descubrirlo a tiempo y descubrirlo en producción no es la cantidad de pruebas: es haber preguntado de dónde salió cada expectativa que esas pruebas defienden.", {
    x: M,
    y: 6.06,
    w: 11.4,
    h: 0.72,
    fontSize: 15.5,
    color: C.softBlue,
  });
  // Reforzamos la marca al final del z-order en la lámina de salida.
  addTopMotif(slide, true);
  addAiepLogo(slide, true);
  validateSlide(slide, pptx);
}

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`Deck generado: ${outputPptx} (${pptx._slides.length} slides)`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
