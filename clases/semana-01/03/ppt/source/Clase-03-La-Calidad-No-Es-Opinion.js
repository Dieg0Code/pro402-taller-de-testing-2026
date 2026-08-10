const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { addTerminalPanel } = components;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "PRO402 · Clase 03",
  title: "La calidad no es opinión: ISO/IEC 25010 aplicada",
});

const SH = pptx.ShapeType;
const W = 13.333;
const H = 7.5;
const M = 0.72;
const outputPptx = path.resolve(__dirname, "..", "Clase-03-La-Calidad-No-Es-Opinion.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

// Cuarto acento de la familia, para cuando rojo, oro y verde ya están tomados.
const CYAN = "1F8A9B";
const CYAN_ON_NAVY = "63C6D8";

// Variantes oscurecidas de los acentos: sobre papel, el oro y el verde
// originales no alcanzan contraste suficiente para texto.
const ACCENT_ON_PAPER = {
  [C.success]: "2E7D4F",
  [C.gold]: "8A6A12",
  [C.red]: "B3181E",
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
// mismo `a:p`, y eso invalida el .pptx contra el esquema OpenXML. Cuando haya
// que distinguir partes de una frase, separarlas en cajas propias y codificarlas
// con marcas de color, que además es lo que pide la guía visual.
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

function rule(slide, x, y, w, color = C.border, pt = 1.2) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
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
// Así el encabezado mantiene el mismo ritmo en todo el deck y un título largo
// nunca puede invadir la bajada, sin depender de estimar el ancho del texto.
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

/* 01 · Portada */
{
  const { slide } = createSlide("dark");
  addText(slide, "CLASE 03 · SEMANA 01", {
    x: M,
    y: 0.72,
    w: 4.6,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });
  addText(slide, "La calidad", {
    x: M,
    y: 1.48,
    w: 7.8,
    h: 0.88,
    fontFace: TYPOGRAPHY.display,
    fontSize: 49,
    bold: true,
    color: C.white,
  });
  addText(slide, "no es opinión", {
    x: M,
    y: 2.36,
    w: 7.8,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 50,
    bold: true,
    color: C.gold,
  });
  addText(slide, "ISO/IEC 25010 aplicada", {
    x: M,
    y: 3.52,
    w: 7.6,
    h: 0.4,
    fontSize: 20,
    color: C.softBlue,
  });
  addText(slide, "Miércoles 12 de agosto de 2026 · Laboratorio PC · Diego Obando", {
    x: M,
    y: 4.14,
    w: 7.8,
    h: 0.28,
    fontSize: 13,
    color: C.sand,
  });

  rect(slide, 8.86, 1.44, 3.7, 4.72, C.editorBg, C.titleFill, 0.08);
  addText(slide, "EVIDENCIA ACTUAL", {
    x: 9.24,
    y: 1.86,
    w: 2.94,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.2,
  });
  const signals = ["lock", "lint", "tipos", "tests"];
  signals.forEach((signal, index) => {
    const y = 2.34 + index * 0.58;
    addStatusPill(slide, 9.28, y, 2.86, `${signal.padEnd(7, " ")}  ✓`, C.titleFill, {
      mono: true,
      fontSize: 13,
    });
  });
  rule(slide, 9.28, 4.84, 2.86, C.red, 2.4);
  addText(slide, "4 passed", {
    x: 9.24,
    y: 5.08,
    w: 2.94,
    h: 0.44,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 23,
    bold: true,
    color: C.success,
    align: "center",
  });
  addText(slide, "¿cuánto falta por demostrar?", {
    x: 9.2,
    y: 5.62,
    w: 3.02,
    h: 0.26,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 02 · Continuidad con la clase anterior */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida", "La Clase 02 terminó con cuatro controles en verde", "Ahora debemos leer qué demuestra exactamente cada resultado.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: CONTENT_TOP,
    w: 7.68,
    h: 3.84,
    title: "PowerShell · ejecución final",
    fontSize: 11.6,
    lines: [
      { prompt: ">", text: "uv lock --check" },
      { text: "Lockfile is up to date" },
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "0 errors" },
      { prompt: ">", text: "uv run pytest -q" },
      { text: "....   [100%]   4 passed" },
    ],
  });
  rect(slide, 8.76, CONTENT_TOP, 3.86, 3.84, C.navy, C.navy, 0.08);
  addText(slide, "RESULTADO", {
    x: 9.14,
    y: 2.9,
    w: 3.1,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.2,
  });
  addText(slide, "4", {
    x: 9.12,
    y: 3.28,
    w: 3.14,
    h: 1.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 65,
    bold: true,
    color: C.success,
    align: "center",
  });
  addText(slide, "controles repetibles", {
    x: 9.2,
    y: 4.5,
    w: 2.98,
    h: 0.32,
    fontSize: 18,
    bold: true,
    color: C.white,
    align: "center",
  });
  rule(slide, 9.42, 5.18, 2.52, C.titleFill, 1.1);
  addText(slide, "Una base real, no una certificación total.", {
    x: 9.24,
    y: 5.46,
    w: 2.9,
    h: 0.52,
    fontSize: 14,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 03 · Tensión inicial */
{
  const { slide } = createSlide("dark");
  addText(slide, "LA PREGUNTA CAMBIÓ", {
    x: M,
    y: 0.84,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Todo está verde", {
    x: M,
    y: 1.42,
    w: 8.2,
    h: 0.74,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "y el producto aún puede ser inadecuado", {
    x: M,
    y: 2.18,
    w: 10.7,
    h: 0.84,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
  });
  const checks = ["ENTORNO", "LINT", "TIPOS", "4 CASOS"];
  checks.forEach((item, index) => {
    addStatusPill(slide, M + index * 1.72, 3.5, 1.46, item, C.success, { fontSize: 10 });
  });
  addArrow(slide, 7.48, 3.49, 1.0, C.red);
  const gaps = ["carga", "accesos", "errores", "cambios"];
  gaps.forEach((item, index) => {
    const x = 8.86 + (index % 2) * 1.68;
    const y = 3.1 + Math.floor(index / 2) * 0.86;
    rect(slide, x, y, 1.44, 0.62, C.white, C.white, 0.05);
    addText(slide, item, {
      x,
      y,
      w: 1.44,
      h: 0.62,
      fontSize: 13.5,
      bold: true,
      color: C.ink,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "El verde responde preguntas concretas. La calidad empieza por descubrir las preguntas que faltan.", {
    x: 1.52,
    y: 5.28,
    w: 10.3,
    h: 0.78,
    fontSize: 20,
    bold: true,
    color: C.softBlue,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 04 · Pregunta central */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Pregunta central", "¿Qué tendría que ocurrir para que este producto fuera inadecuado?", "Los controles anteriores no desaparecen; se vuelven el punto de partida.");
  const risks = [
    ["01", "Entrada vacía", "¿qué respuesta corresponde?", C.red],
    ["02", "Curso completo", "¿responde a tiempo?", C.gold],
    ["03", "Calificaciones", "¿quién puede verlas?", C.red],
    ["04", "Error de entrada", "¿se puede corregir?", C.gold],
    ["05", "Cambio de regla", "¿aparece una regresión?", C.success],
    ["06", "Decisión académica", "¿qué daño causaría un error?", C.red],
  ];
  risks.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = M + col * 6.08;
    const y = 2.52 + row * 1.12;
    rect(slide, x, y, 5.78, 0.88, C.white, C.border, 0.05);
    addCircleLabel(slide, x + 0.22, y + 0.18, 0.52, item[3], item[0], {
      fontSize: 9.6,
      color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 0.98,
      y: y + 0.14,
      w: 1.78,
      h: 0.24,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, item[2], {
      x: x + 2.72,
      y: y + 0.14,
      w: 2.66,
      h: 0.46,
      fontSize: 13.5,
      color: C.slate,
      valign: "mid",
    });
  });
  rect(slide, 2.28, 6.08, 8.78, 0.56, C.navy, C.navy, 0.05);
  addText(slide, "La calidad se evalúa contra necesidades y riesgos, no contra una sensación general.", {
    x: 2.54,
    y: 6.08,
    w: 8.26,
    h: 0.56,
    fontSize: 15.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 05 · Objetivos */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Objetivos", "Hoy ampliaremos la mirada desde los controles hacia el producto", "Tres movimientos organizan el aprendizaje de la sesión.");
  const groups = [
    {
      x: M,
      accent: C.red,
      number: "01",
      title: "DELIMITAR",
      body: "Distinguir corrección funcional, evidencia disponible y calidad suficiente para un propósito.",
      detail: "Leer qué respaldan realmente uv, Ruff, Pyrefly y pytest.",
    },
    {
      x: 4.76,
      accent: C.gold,
      number: "02",
      title: "MAPEAR",
      body: "Interpretar las nueve características de ISO/IEC 25010 y relacionarlas con riesgos.",
      detail: "Reconocer la característica principal y la evidencia posible.",
    },
    {
      x: 8.8,
      accent: C.success,
      number: "03",
      title: "ESPECIFICAR",
      body: "Convertir necesidades vagas en criterios observables y verificables.",
      detail: "Auditar propuestas de un agente sin delegar la fuente de verdad.",
    },
  ];
  groups.forEach((group) => {
    rect(slide, group.x, 2.44, 3.58, 3.64, C.white, C.border, 0.07);
    rect(slide, group.x, 2.44, 3.58, 0.12, group.accent, group.accent);
    addCircleLabel(slide, group.x + 0.28, 2.84, 0.56, group.accent, group.number, {
      fontSize: 10,
      color: group.accent === C.gold ? C.ink : C.white,
    });
    addText(slide, group.title, {
      x: group.x + 1.08,
      y: 2.93,
      w: 2.12,
      h: 0.22,
      fontSize: 11.5,
      bold: true,
      color: C.ink,
      charSpacing: 1.2,
    });
    addText(slide, group.body, {
      x: group.x + 0.3,
      y: 3.66,
      w: 2.98,
      h: 1.02,
      fontSize: 17,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    rule(slide, group.x + 0.3, 4.92, 2.98, C.border, 1.1);
    addText(slide, group.detail, {
      x: group.x + 0.3,
      y: 5.2,
      w: 2.98,
      h: 0.58,
      fontSize: 13,
      color: C.slate,
      valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 06 · Mapa de la clase */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la clase", "De los resultados verdes a criterios verificables", "El recorrido completo conserva una misma cadena: contexto, riesgo, criterio y evidencia.");
  const stages = [
    ["08:30", "ENCUADRE", "¿qué falta por demostrar?", C.red],
    ["08:40", "BLOQUE 1", "alcance de la evidencia", C.gold],
    ["09:10", "BLOQUE 2", "nueve características", C.navy],
    ["09:35", "PAUSA", "descanso técnico", C.slate],
    ["09:45", "BLOQUE 3", "auditoría del producto", C.success],
    ["10:15", "BLOQUE 4", "criterios verificables", C.red],
    ["10:40", "CIERRE", "conclusión proporcional", C.gold],
  ];
  stages.forEach((stage, index) => {
    const firstRow = index < 4;
    const col = firstRow ? index : index - 4;
    const x = firstRow ? M + col * 3.02 : 2.24 + col * 3.02;
    const y = firstRow ? 2.48 : 4.28;
    const w = 2.74;
    rect(slide, x, y, w, 1.34, C.white, C.border, 0.05);
    rect(slide, x, y, 0.1, 1.34, stage[3], stage[3]);
    addCircleLabel(slide, x + 0.24, y + 0.22, 0.46, stage[3], index + 1, {
      fontSize: 10,
      color: stage[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, stage[0], {
      x: x + 0.9,
      y: y + 0.22,
      w: 0.72,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11,
      bold: true,
      color: C.red,
    });
    addText(slide, stage[1], {
      x: x + 1.62,
      y: y + 0.24,
      w: 0.88,
      h: 0.22,
      fontSize: stage[1].length > 7 ? 9.4 : 10.4,
      bold: true,
      color: C.ink,
      charSpacing: 0.7,
    });
    rule(slide, x + 0.24, y + 0.7, w - 0.48, C.border, 0.8);
    addText(slide, stage[2], {
      x: x + 0.24,
      y: y + 0.84,
      w: w - 0.48,
      h: 0.3,
      fontSize: 11.5,
      color: C.slate,
      align: "center",
      valign: "mid",
    });
  });
  rect(slide, 2.24, 6.04, 8.9, 0.56, C.navy, C.navy, 0.05);
  addText(slide, "08:30 → 10:50  ·  140 minutos  ·  cuatro bloques y una conclusión defendible", {
    x: 2.48,
    y: 6.04,
    w: 8.42,
    h: 0.56,
    fontSize: 13.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 07 · Apertura del Bloque 1 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 1 · 30 MINUTOS", {
    x: M,
    y: 0.84,
    w: 4.6,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "Todo está en verde,", {
    x: M,
    y: 1.52,
    w: 8.6,
    h: 0.74,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.white,
  });
  addText(slide, "pero la pregunta cambió", {
    x: M,
    y: 2.28,
    w: 9.4,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.gold,
  });
  const ladder = [
    ["01", "EJECUTAR", "produce una salida", C.success],
    ["02", "CUMPLIR CASOS", "coincide con ejemplos", C.gold],
    ["03", "SER ADECUADO", "responde al propósito", C.red],
  ];
  ladder.forEach((item, index) => {
    const x = 1.04 + index * 4.04;
    const y = 4.1 - index * 0.28;
    rect(slide, x, y, 3.4, 1.36, index === 2 ? C.white : C.titleFill, index === 2 ? C.white : C.titleFill, 0.07);
    addCircleLabel(slide, x + 0.24, y + 0.28, 0.5, item[3], item[0], {
      fontSize: 9,
      color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 0.92,
      y: y + 0.27,
      w: 2.1,
      h: 0.22,
      fontSize: 11,
      bold: true,
      color: index === 2 ? C.ink : C.white,
      charSpacing: 0.8,
    });
    addText(slide, item[2], {
      x: x + 0.92,
      y: y + 0.7,
      w: 2.1,
      h: 0.34,
      fontSize: 14,
      bold: true,
      color: index === 2 ? C.slate : C.softBlue,
    });
    if (index < ladder.length - 1) addArrow(slide, x + 3.56, y + 0.46, 0.34, C.red);
  });
  addText(slide, "Objetivo: distinguir resultado técnico, evidencia y afirmación de calidad.", {
    x: 2.1,
    y: 6.06,
    w: 9.12,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 08 · Batería final */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.1 · Evidencia anterior", "Volvamos al punto exacto donde terminamos", "La batería final produjo resultados que otra persona puede repetir.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: CONTENT_TOP,
    w: 8.18,
    h: 3.96,
    title: "PowerShell · proyecto nota_final",
    fontSize: 12,
    lines: [
      { prompt: ">", text: "uv lock --check" },
      { text: "Lockfile is up to date" },
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "0 errors" },
      { prompt: ">", text: "uv run pytest -q" },
      { text: "....   [100%]   4 passed" },
    ],
  });
  const claims = [
    ["REPETIBLE", "otra persona puede ejecutar", C.success],
    ["TRAZABLE", "hay comandos y resultados", C.gold],
    ["ACOTADA", "cada salida tiene alcance", C.red],
  ];
  claims.forEach((item, index) => {
    const y = 2.46 + index * 1.16;
    rect(slide, 9.22, y, 3.4, 0.92, C.white, C.border, 0.05);
    rect(slide, 9.22, y, 0.12, 0.92, item[2], item[2]);
    addText(slide, item[0], {
      x: 9.58,
      y: y + 0.16,
      w: 2.56,
      h: 0.2,
      fontSize: 10.5,
      bold: true,
      color: C.ink,
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: 9.58,
      y: y + 0.5,
      w: 2.62,
      h: 0.24,
      fontSize: 13,
      color: C.slate,
    });
  });
  rect(slide, 9.22, 5.94, 3.4, 0.48, C.navy, C.navy, 0.04);
  addText(slide, "Evidencia real ≠ evidencia total", {
    x: 9.36,
    y: 5.94,
    w: 3.12,
    h: 0.48,
    fontSize: 12.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 09 · Alcance exacto de cada control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.1 · Lectura precisa", "Cuatro controles verdes respaldan cuatro afirmaciones acotadas", "La herramienta aporta evidencia solo dentro de lo que realmente observó.");
  const rows = [
    ["uv lock --check", "Dependencias declaradas y lockfile alineados.", C.navy],
    ["Ruff", "No encontró infracciones a las reglas habilitadas.", C.gold],
    ["Pyrefly", "No encontró contradicciones en el análisis realizado.", C.red],
    ["pytest", "Cuatro ejemplos ejecutados entregaron el resultado esperado.", C.success],
  ];
  rows.forEach((row, index) => {
    const y = CONTENT_TOP + index * 0.9;
    addCircleLabel(slide, M, y + 0.08, 0.52, row[2], index + 1, {
      fontSize: 10,
      color: row[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, row[0], {
      x: 1.52,
      y: y + 0.08,
      w: 2.42,
      h: 0.28,
      fontFace: row[0].includes(" ") ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: row[0].length > 10 ? 14 : 17,
      bold: true,
      color: C.ink,
    });
    rect(slide, 4.08, y, 8.54, 0.68, C.white, C.border, 0.04);
    rect(slide, 4.08, y, 0.1, 0.68, row[2], row[2]);
    addText(slide, row[1], {
      x: 4.46,
      y,
      w: 7.8,
      h: 0.68,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, 1.64, 6.18, 10.02, 0.48, C.warm, C.warm, 0.04);
  addText(slide, "Precisión profesional: afirmar exactamente lo que la evidencia permite sostener.", {
    x: 1.9,
    y: 6.18,
    w: 9.5,
    h: 0.48,
    fontSize: 14.5,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 10 · Lo que el verde no dice */
{
  const { slide } = createSlide("dark");
  addText(slide, "LÍMITE DE LA EVIDENCIA", {
    x: M,
    y: 0.84,
    w: 4.5,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "Ningún resultado contiene estas palabras", {
    x: M,
    y: 1.36,
    w: 9.8,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
  });
  const words = [
    ["PERFECTO", 0.98, 2.56, 3.08, C.red],
    ["SEGURO", 4.32, 2.56, 2.36, C.gold],
    ["RÁPIDO", 6.94, 2.56, 2.42, C.red],
    ["FÁCIL DE USAR", 9.62, 2.56, 2.74, C.gold],
    ["CORRECTO SIEMPRE", 2.42, 3.76, 4.02, C.red],
    ["LISTO PARA PRODUCCIÓN", 6.82, 3.76, 4.34, C.gold],
  ];
  words.forEach((item) => {
    rect(slide, item[1], item[2], item[3], 0.72, C.titleFill, C.titleFill, 0.06);
    addText(slide, item[0], {
      x: item[1],
      y: item[2],
      w: item[3],
      h: 0.72,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.7,
    });
    rule(slide, item[1] + 0.22, item[2] + 0.36, item[3] - 0.44, item[4], 3);
  });
  addText(slide, "Agregar cualquiera de estas conclusiones sería afirmar más de lo observado.", {
    x: 1.42,
    y: 5.34,
    w: 10.5,
    h: 0.62,
    fontSize: 19,
    bold: true,
    color: C.softBlue,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 11 · Pregunta disparadora del bloque */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.1 · Pregunta disparadora", "Si todos los controles están en verde…", "¿qué tendría que ocurrir para que el producto aun así fuera inadecuado?", false, {
    subtitleFontSize: 17,
    subtitleH: 0.42,
  });

  /* Columna izquierda: el territorio ya demostrado, cerrado y medible. */
  rect(slide, M, CONTENT_TOP, 4.06, 3.86, C.navy, C.navy, 0.08);
  addText(slide, "4 passed", {
    x: 0.86,
    y: 2.82,
    w: 3.78,
    h: 0.66,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 34,
    bold: true,
    color: C.success,
    align: "center",
  });
  addText(slide, "LO DEMOSTRADO", {
    x: 0.86,
    y: 3.6,
    w: 3.78,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.4,
  });
  rule(slide, 1.14, 4.02, 3.22, C.titleFill, 1.2);
  const proven = [
    ["uv lock --check", "entorno"],
    ["ruff check .", "estilo"],
    ["pyrefly check", "tipos"],
    ["pytest -q", "4 casos"],
  ];
  proven.forEach((item, index) => {
    const y = 4.2 + index * 0.4;
    addText(slide, item[0], {
      x: 1.14,
      y,
      w: 2.3,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.5,
      color: C.softBlue,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 3.44,
      y,
      w: 0.94,
      h: 0.26,
      fontSize: 11,
      bold: true,
      color: C.success,
      align: "right",
      valign: "mid",
    });
  });
  addText(slide, "Cuatro ejemplos producen el resultado esperado.", {
    x: 1.02,
    y: 5.86,
    w: 3.46,
    h: 0.34,
    fontSize: 12.5,
    color: C.sand,
    align: "center",
  });

  addArrow(slide, 4.96, 4.16, 0.62, C.red);

  /* Columna derecha: el territorio sin observar, con el porqué de cada riesgo. */
  rect(slide, 5.86, CONTENT_TOP, 6.76, 3.86, C.white, C.border, 0.08);
  addText(slide, "Lo que podría volverlo inadecuado", {
    x: 6.24,
    y: 2.74,
    w: 6.0,
    h: 0.32,
    fontSize: 18,
    bold: true,
    color: C.ink,
  });
  const unknowns = [
    ["entrada inválida", "una lista vacía todavía no tiene regla", C.red],
    ["demora", "un curso completo puede tardar demasiado", C.gold],
    ["acceso indebido", "las calificaciones son datos personales", C.red],
    ["cambio riesgoso", "modificar la regla puede romper otro caso", C.success],
    ["daño real", "una nota equivocada afecta una decisión", C.red],
  ];
  unknowns.forEach((item, index) => {
    const y = 3.24 + index * 0.6;
    rect(slide, 6.24, y, 0.08, 0.44, item[2], item[2]);
    addText(slide, item[0], {
      x: 6.5,
      y,
      w: 2.24,
      h: 0.44,
      fontSize: 14,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 8.78,
      y,
      w: 3.5,
      h: 0.44,
      fontSize: 12.5,
      color: C.slate,
      valign: "mid",
    });
    if (index < unknowns.length - 1) rule(slide, 6.24, y + 0.52, 6.04, C.border, 0.8);
  });
  rect(slide, M, 6.44, 11.9, 0.48, C.warm, C.warm, 0.04);
  addText(slide, "Ninguna de estas preguntas se responde volviendo a ejecutar los mismos cuatro controles.", {
    x: 0.96,
    y: 6.44,
    w: 11.42,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 12 · Tres niveles */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.2 · Tres niveles", "La palabra «funciona» mezcla afirmaciones diferentes", "Cada nivel promete más que el anterior, y solo dos tienen respaldo hoy.");
  /* Cada fila crece en la barra de la derecha: la promesa se agranda mientras
     la evidencia se queda en el segundo nivel. El tercero va sin relleno. */
  const levels = [
    {
      accent: C.success,
      number: "01",
      title: "SE EJECUTA",
      body: "Inicia, procesa una entrada y produce alguna salida.",
      fill: 1 / 3,
      tag: "RESPALDADO",
      source: "el programa corrió sin detenerse",
    },
    {
      accent: C.gold,
      number: "02",
      title: "CUMPLE UN CASO",
      body: "El resultado obtenido coincide con una expectativa observada.",
      fill: 2 / 3,
      tag: "RESPALDADO",
      source: "cuatro ejemplos en test_notas.py",
    },
    {
      accent: C.red,
      number: "03",
      title: "POSEE CALIDAD SUFICIENTE",
      body: "Responde a necesidades relevantes dentro de un contexto y un riesgo concretos.",
      fill: 0,
      tag: "SIN EVIDENCIA",
      source: "todavía no hay criterio ni medición",
    },
  ];
  const trackX = 8.62;
  const trackW = 3.66;
  levels.forEach((level, index) => {
    const y = CONTENT_TOP + index * 1.2;
    const h = 1.04;
    rect(slide, M, y, 11.9, h, C.white, C.border, 0.05);
    rect(slide, M, y, 0.1, h, level.accent, level.accent);
    addCircleLabel(slide, 0.98, y + 0.26, 0.52, level.accent, level.number, {
      fontSize: 9.5,
      color: level.accent === C.gold ? C.ink : C.white,
    });
    addText(slide, level.title, {
      x: 1.7,
      y: y + 0.18,
      w: 2.68,
      h: 0.26,
      fontSize: level.title.length > 20 ? 10.4 : 11.5,
      bold: true,
      color: C.ink,
      charSpacing: 0.8,
    });
    addText(slide, level.body, {
      x: 1.7,
      y: y + 0.5,
      w: 6.6,
      h: 0.42,
      fontSize: 14,
      color: C.slate,
    });
    /* Barra de promesa: pista completa + relleno proporcional al nivel. */
    rect(slide, trackX, y + 0.24, trackW, 0.28, C.softNeutral, C.border, 0.03);
    if (level.fill > 0) {
      rect(slide, trackX, y + 0.24, trackW * level.fill, 0.28, level.accent, level.accent, 0.03);
    }
    addText(slide, level.tag, {
      x: trackX,
      y: y + 0.6,
      w: 1.86,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: onPaper(level.accent),
      charSpacing: 0.9,
    });
    addText(slide, level.source, {
      x: trackX,
      y: y + 0.8,
      w: trackW,
      h: 0.2,
      fontSize: 11,
      color: C.slate,
    });
  });
  rect(slide, M, 6.16, 11.9, 0.54, C.navy, C.navy, 0.04);
  addText(slide, "Los niveles se acumulan, pero no son equivalentes: hoy solo podemos sostener los dos primeros.", {
    x: 0.96,
    y: 6.16,
    w: 11.42,
    h: 0.54,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 13 · Preguntas que siguen abiertas */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.2 · Abrir el alcance", "Cuatro ejemplos no responden estas seis preguntas", "Cada pregunta apunta a una propiedad distinta del producto.");
  const questions = [
    ["VACÍO", "¿Qué ocurre con una lista vacía?", C.red],
    ["CARGA", "¿Procesa un curso completo a tiempo?", C.gold],
    ["ACCESO", "¿Protege las calificaciones?", C.red],
    ["INTERACCIÓN", "¿Permite reconocer y corregir un error?", C.gold],
    ["CAMBIO", "¿La regla puede modificarse sin una regresión?", C.success],
    ["IMPACTO", "¿Qué decisión podría afectar un resultado equivocado?", C.red],
  ];
  questions.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = M + col * 6.1;
    const y = 2.46 + row * 1.14;
    rect(slide, x, y, 5.8, 0.9, C.white, C.border, 0.05);
    rect(slide, x, y, 1.32, 0.9, item[2], item[2], 0.05);
    addText(slide, item[0], {
      x,
      y,
      w: 1.32,
      h: 0.9,
      fontSize: 10.5,
      bold: true,
      color: item[2] === C.gold ? C.ink : C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.6,
    });
    addText(slide, item[1], {
      x: x + 1.62,
      y: y + 0.14,
      w: 3.86,
      h: 0.56,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, 2.18, 6.08, 8.98, 0.54, C.warm, C.warm, 0.04);
  addText(slide, "Las preguntas nuevas no invalidan las pruebas existentes: revelan sus límites.", {
    x: 2.42,
    y: 6.08,
    w: 8.5,
    h: 0.54,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 14 · Demostrado frente a pendiente */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "1.2 · Conclusión acotada", "La evidencia crece sin convertirse en una promesa total", "Cada control observó algo concreto; el resto del producto sigue sin mirarse.", true);

  /* Franja de proporción: cuánto del producto quedó realmente observado. */
  rect(slide, M, CONTENT_TOP, 3.94, 0.5, C.success, C.success, 0.04);
  addText(slide, "OBSERVADO", {
    x: M,
    y: CONTENT_TOP,
    w: 3.94,
    h: 0.5,
    fontSize: 11,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    charSpacing: 1.3,
  });
  rect(slide, 4.66, CONTENT_TOP, 7.96, 0.5, C.titleFill, C.guide, 0.04);
  addText(slide, "TODAVÍA SIN OBSERVAR", {
    x: 4.66,
    y: CONTENT_TOP,
    w: 7.96,
    h: 0.5,
    fontSize: 11,
    bold: true,
    color: C.sand,
    align: "center",
    valign: "mid",
    charSpacing: 1.3,
  });

  /* Izquierda: el comando exacto y lo que ese comando permite afirmar. */
  rect(slide, M, 3.24, 5.62, 2.88, C.titleFill, C.titleFill, 0.08);
  rect(slide, M, 3.24, 5.62, 0.09, C.success, C.success);
  addText(slide, "LO DEMOSTRADO", {
    x: 1.06,
    y: 3.48,
    w: 3.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.success,
    charSpacing: 1.1,
  });
  const proven = [
    ["uv lock --check", "entorno alineado"],
    ["ruff check .", "sin infracciones habilitadas"],
    ["pyrefly check", "sin contradicciones de tipos"],
    ["pytest -q", "cuatro ejemplos ejecutados"],
  ];
  proven.forEach((item, index) => {
    const y = 3.9 + index * 0.5;
    addText(slide, item[0], {
      x: 1.06,
      y,
      w: 2.02,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.5,
      color: C.gold,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 3.16,
      y,
      w: 3.06,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });

  /* Derecha: cada vacío ya apunta a la característica que lo va a nombrar. */
  rect(slide, 7.0, 3.24, 5.62, 2.88, C.titleFill, C.titleFill, 0.08);
  rect(slide, 7.0, 3.24, 5.62, 0.09, C.gold, C.gold);
  addText(slide, "TODAVÍA PENDIENTE", {
    x: 7.34,
    y: 3.48,
    w: 3.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.1,
  });
  addText(slide, "vive en →", {
    x: 10.36,
    y: 3.48,
    w: 1.94,
    h: 0.22,
    fontSize: 10,
    color: C.terminalMuted,
    align: "right",
    charSpacing: 0.6,
  });
  const pending = [
    ["entradas no representadas", "adecuación funcional"],
    ["desempeño bajo carga", "eficiencia de desempeño"],
    ["interacción con personas", "capacidad de interacción"],
    ["protección de datos", "seguridad"],
    ["cambios futuros", "mantenibilidad"],
  ];
  pending.forEach((item, index) => {
    const y = 3.88 + index * 0.44;
    rect(slide, 7.34, y + 0.13, 0.14, 0.14, index === 4 ? C.red : C.gold, index === 4 ? C.red : C.gold);
    addText(slide, item[0], {
      x: 7.64,
      y,
      w: 2.6,
      h: 0.4,
      fontSize: 12.5,
      bold: true,
      color: C.white,
      valign: "mid",
    });
    addText(slide, item[1], {
      x: 10.3,
      y,
      w: 2.0,
      h: 0.4,
      fontSize: 11,
      color: C.softBlue,
      align: "right",
      valign: "mid",
    });
  });
  addText(slide, "Una conclusión profesional conserva ambos lados.", {
    x: 2.04,
    y: 6.36,
    w: 9.28,
    h: 0.3,
    fontSize: 15.5,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 15 · La calidad pertenece al producto en contexto */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.3 · Producto en contexto", "La misma función puede ser suficiente o completamente inadecuada", "Misma implementación; distinta calidad exigible según el propósito y las consecuencias.");

  /* La constante del ejercicio, en el hueco que deja el escalón más bajo. */
  rect(slide, M, 2.5, 2.3, 0.46, C.navy, C.navy, 0.05);
  addText(slide, "nota_final()", {
    x: M,
    y: 2.5,
    w: 2.3,
    h: 0.46,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: C.gold,
    align: "center",
    valign: "mid",
  });
  addText(slide, "Lo único constante es el código.", {
    x: M,
    y: 3.04,
    w: 3.66,
    h: 0.34,
    fontSize: 13,
    color: C.slate,
  });

  /* Tres escalones anclados a una misma base: la altura es el argumento. */
  const baseline = 6.12;
  const steps = [
    {
      accent: C.success,
      level: "EXIGENCIA MÍNIMA",
      label: "EJERCICIO PERSONAL",
      scope: "Cinco notas escritas a mano.",
      demand: "Basta con que el cálculo sea correcto.",
      h: 2.3,
    },
    {
      accent: C.gold,
      level: "EXIGENCIA MEDIA",
      label: "HERRAMIENTA DOCENTE",
      scope: "Un curso completo, usado por otra persona.",
      demand: "+ manejar errores sin entregar resultados engañosos.",
      h: 2.86,
    },
    {
      accent: C.red,
      level: "EXIGENCIA ALTA",
      label: "PLATAFORMA INSTITUCIONAL",
      scope: "Cientos de estudiantes y decisiones académicas.",
      demand: "+ accesos, trazabilidad, integración y respuesta bajo carga.",
      h: 3.42,
    },
  ];
  const stepW = 3.74;
  steps.forEach((step, index) => {
    const x = M + index * (stepW + 0.34);
    const y = baseline - step.h;
    rect(slide, x, y, stepW, step.h, C.white, C.border, 0.06);
    rect(slide, x, y, stepW, 0.11, step.accent, step.accent);
    addText(slide, step.level, {
      x,
      y: y - 0.32,
      w: stepW,
      h: 0.24,
      fontSize: 9.6,
      bold: true,
      color: onPaper(step.accent),
      align: "center",
      charSpacing: 1.1,
    });
    addText(slide, step.label, {
      x: x + 0.26,
      y: y + 0.3,
      w: stepW - 0.52,
      h: 0.24,
      fontSize: step.label.length > 20 ? 10.4 : 11.2,
      bold: true,
      color: C.ink,
      charSpacing: 0.55,
    });
    addText(slide, step.scope, {
      x: x + 0.26,
      y: y + 0.62,
      w: stepW - 0.52,
      h: 0.5,
      fontSize: 13,
      color: C.slate,
    });
    rule(slide, x + 0.26, y + 1.22, stepW - 0.52, C.border, 0.9);
    addText(slide, step.demand, {
      x: x + 0.26,
      y: y + 1.36,
      w: stepW - 0.52,
      h: step.h - 1.56,
      fontSize: 14.5,
      bold: true,
      color: C.ink,
    });
  });
  rule(slide, M, baseline + 0.04, 11.9, C.ink, 1.6);
  addText(slide, "más personas, más consecuencias  →  más calidad exigible", {
    x: M,
    y: baseline + 0.2,
    w: 11.9,
    h: 0.28,
    fontSize: 12.5,
    bold: true,
    color: C.slate,
    align: "right",
  });
  validateSlide(slide, pptx);
}

/* 16 · Cuatro elementos de una afirmación profesional */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "1.3 · Afirmar calidad", "Una afirmación profesional necesita cuatro elementos", "Los cuatro son tramos de una misma frase; si falta uno, la conclusión queda abierta.", true);

  /* La barra ES la frase: cada tramo se marca y luego se arma abajo completa. */
  const parts = [
    { label: "PROPIEDAD", question: "¿qué propiedad importa?", accent: C.red, w: 2.72 },
    { label: "CONTEXTO", question: "¿para quién y dónde?", accent: C.gold, w: 3.1 },
    { label: "CRITERIO", question: "¿qué debe cumplirse?", accent: C.success, w: 3.06 },
    { label: "EVIDENCIA", question: "¿cómo se comprobará?", accent: CYAN, w: 3.02 },
  ];
  let partX = M;
  parts.forEach((part) => {
    rect(slide, partX, CONTENT_TOP, part.w, 0.66, part.accent, part.accent);
    addText(slide, part.label, {
      x: partX,
      y: CONTENT_TOP,
      w: part.w,
      h: 0.66,
      fontSize: 12,
      bold: true,
      color: part.accent === C.red || part.accent === CYAN ? C.white : C.ink,
      align: "center",
      valign: "mid",
      charSpacing: 1.2,
    });
    /* Marca vertical exacta al centro del tramo: la geometría la controlamos. */
    rect(slide, partX + part.w / 2 - 0.02, 3.12, 0.04, 0.24, part.accent, part.accent);
    addText(slide, part.question, {
      x: partX,
      y: 3.44,
      w: part.w,
      h: 0.3,
      fontSize: 13.5,
      bold: true,
      color: C.softBlue,
      align: "center",
    });
    partX += part.w;
  });

  /* La frase se arma por tramos: cada línea lleva la marca de su segmento. */
  rect(slide, M, 4.06, 11.9, 2.0, C.titleFill, C.titleFill, 0.08);
  addText(slide, "LA MISMA AFIRMACIÓN, YA ARMADA", {
    x: 1.1,
    y: 4.32,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  const claim = [
    ["La eficiencia de desempeño de la consulta de una calificación,", C.red],
    ["en la plataforma que usa el equipo docente,", C.gold],
    ["debe responder bajo el umbral acordado,", C.success],
    ["verificado con mediciones repetidas y registradas.", CYAN_ON_NAVY],
  ];
  claim.forEach((line, index) => {
    const y = 4.7 + index * 0.32;
    rect(slide, 1.1, y + 0.05, 0.08, 0.2, line[1], line[1]);
    addText(slide, line[0], {
      x: 1.36,
      y,
      w: 10.88,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.white,
    });
  });
  addText(slide, "Con los cuatro tramos, otra persona puede pedirte la medición.", {
    x: 1.4,
    y: 6.36,
    w: 10.54,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.gold,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 17 · Vago frente a verificable */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.3 · Del adjetivo al criterio", "«El sistema es rápido» expresa una impresión", "Una afirmación verificable declara operación, carga, umbral y medición.");
  rect(slide, M, 2.52, 4.5, 3.44, C.paleRed, C.paleRed, 0.08);
  addText(slide, "VAGO", {
    x: 1.1,
    y: 2.92,
    w: 1.0,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.red,
    charSpacing: 1.2,
  });
  addText(slide, "«El sistema es rápido»", {
    x: 1.1,
    y: 3.54,
    w: 3.72,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addText(slide, "No sabemos qué operación, bajo qué condiciones ni con qué medición.", {
    x: 1.16,
    y: 4.62,
    w: 3.6,
    h: 0.72,
    fontSize: 14,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  addArrow(slide, 5.58, 3.94, 0.88, C.red);
  rect(slide, 6.78, 2.52, 5.84, 3.44, C.white, C.border, 0.08);
  addText(slide, "VERIFICABLE", {
    x: 7.18,
    y: 2.92,
    w: 1.42,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.success,
    charSpacing: 1.2,
  });
  const spec = [
    ["OPERACIÓN", "consultar una calificación"],
    ["CARGA", "cantidad de solicitudes definida"],
    ["UMBRAL", "tiempo máximo acordado"],
    ["EVIDENCIA", "medición repetida y registrada"],
  ];
  spec.forEach((item, index) => {
    const y = 3.42 + index * 0.56;
    addText(slide, item[0], {
      x: 7.18,
      y,
      w: 1.36,
      h: 0.18,
      fontSize: 9.4,
      bold: true,
      color: index === 3 ? C.success : C.red,
      charSpacing: 0.65,
    });
    addText(slide, item[1], {
      x: 8.74,
      y: y - 0.02,
      w: 3.42,
      h: 0.24,
      fontSize: 13.5,
      bold: true,
      color: C.ink,
    });
    if (index < spec.length - 1) rule(slide, 7.18, y + 0.34, 4.98, C.border, 0.8);
  });
  addText(slide, "El modelo ayudará a descubrir qué propiedades vale la pena convertir en criterios.", {
    x: 2.06,
    y: 6.3,
    w: 9.24,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 18 · ISO/IEC 25010 como mapa */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.4 · ISO/IEC 25010:2023", "Nueve características amplían las preguntas sobre el producto", "El modelo entrega vocabulario compartido; no entrega una certificación automática.", false, {
    titleFontSize: 28,
  });
  const lanes = [
    {
      x: M,
      accent: C.red,
      label: "VALOR Y RESPUESTA",
      items: ["Adecuación funcional", "Eficiencia de desempeño", "Compatibilidad"],
    },
    {
      x: 4.76,
      accent: C.gold,
      label: "USO, FALLOS Y AMENAZAS",
      items: ["Capacidad de interacción", "Fiabilidad", "Seguridad"],
    },
    {
      x: 8.8,
      accent: C.success,
      label: "CAMBIO Y CONSECUENCIAS",
      items: ["Mantenibilidad", "Flexibilidad", "Seguridad operacional"],
    },
  ];
  lanes.forEach((lane) => {
    rect(slide, lane.x, 2.4, 3.58, 3.9, C.white, C.border, 0.07);
    rect(slide, lane.x, 2.4, 3.58, 0.52, lane.accent, lane.accent, 0.07);
    addText(slide, lane.label, {
      x: lane.x + 0.18,
      y: 2.4,
      w: 3.22,
      h: 0.52,
      fontSize: lane.label.length > 20 ? 9.2 : 10.2,
      bold: true,
      color: lane.accent === C.gold ? C.ink : C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.55,
    });
    lane.items.forEach((item, index) => {
      const y = 3.18 + index * 0.92;
      addCircleLabel(slide, lane.x + 0.3, y + 0.02, 0.46, lane.accent, index + 1, {
        fontSize: 8.8,
        color: lane.accent === C.gold ? C.ink : C.white,
      });
      addText(slide, item, {
        x: lane.x + 1.0,
        y,
        w: 2.18,
        h: 0.48,
        fontSize: item.length > 20 ? 13.2 : 15,
        bold: true,
        color: C.ink,
        valign: "mid",
      });
      if (index < 2) rule(slide, lane.x + 0.3, y + 0.7, 2.98, C.border, 0.8);
    });
  });
  validateSlide(slide, pptx);
}

/* 19 · Reglas de uso del modelo */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "1.4 · Cómo usar el modelo", "ISO/IEC 25010 organiza preguntas, no entrega respuestas automáticas", "Tres lecturas equivocadas del estándar y la corrección que evita cada una.", true);
  /* El panel hueco lee como lectura incorrecta; el sólido, como la regla. */
  addText(slide, "LECTURA EQUIVOCADA", {
    x: 1.5,
    y: 2.44,
    w: 3.0,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.red,
    charSpacing: 1.2,
  });
  addText(slide, "LA REGLA QUE LA CORRIGE", {
    x: 7.06,
    y: 2.44,
    w: 3.4,
    h: 0.2,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  const rules = [
    ["01", "«Marcamos las nueve y quedamos cubiertos.»", "No es un checklist: una característica puede necesitar varias evidencias y conservar riesgos abiertos.", C.red],
    ["02", "«Las nueve características valen lo mismo.»", "La prioridad depende del contexto: usuarios, consecuencias y propósito deciden qué exige más atención.", C.gold],
    ["03", "«pytest en verde equivale a adecuación funcional.»", "Una herramienta aporta una señal parcial dentro de una característica, nunca la característica completa.", C.success],
  ];
  rules.forEach((item, index) => {
    const y = 2.76 + index * 1.26;
    const h = 1.1;
    addCircleLabel(slide, M, y + 0.28, 0.54, item[3], item[0], {
      fontSize: 9.6,
      color: item[3] === C.gold ? C.ink : C.white,
    });
    rect(slide, 1.5, y, 4.86, h, C.navy, C.guide, 0.06);
    addText(slide, item[1], {
      x: 1.76,
      y,
      w: 4.34,
      h,
      fontSize: 14.5,
      italic: true,
      color: C.sand,
      valign: "mid",
    });
    addArrow(slide, 6.56, y + 0.32, 0.34, C.red);
    rect(slide, 7.06, y, 5.56, h, C.titleFill, C.titleFill, 0.06);
    rect(slide, 7.06, y, 0.09, h, item[3], item[3]);
    addText(slide, item[2], {
      x: 7.36,
      y,
      w: 5.0,
      h,
      fontSize: 14,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });
  addText(slide, "El modelo no dice si el producto es bueno: dice qué preguntas deberías poder responder.", {
    x: 1.5,
    y: 6.5,
    w: 11.12,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 20 · Semáforo de evidencia */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.5 · Ejercicio individual", "Semáforo de evidencia", "Clasifica cada afirmación según el respaldo disponible al terminar la Clase 02.");

  /* Carcasa del semáforo: las tres luces alinean con las tres definiciones. */
  rect(slide, M, CONTENT_TOP, 1.66, 3.66, C.navy, C.navy, 0.14);
  const states = [
    ["VERDE", "Hay respaldo directo.", "Puedes citar el archivo, el comando y el resultado exacto.", C.success],
    ["AMARILLO", "Hay evidencia relacionada, pero parcial.", "La señal toca la propiedad, pero no la cubre completa.", C.gold],
    ["ROJO", "Los controles no respaldan la afirmación.", "Ningún comando ejecutado observa esa propiedad.", C.red],
  ];
  states.forEach((state, index) => {
    const rowY = 2.54 + index * 1.24;
    addCircleLabel(slide, 1.05, rowY, 1.0, state[3], "", { outline: state[3] });

    rect(slide, 2.72, rowY, 9.9, 1.0, C.white, C.border, 0.05);
    rect(slide, 2.72, rowY, 0.1, 1.0, state[3], state[3]);
    addText(slide, state[0], {
      x: 3.04,
      y: rowY + 0.2,
      w: 1.7,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: onPaper(state[3]),
      charSpacing: 1.2,
    });
    addText(slide, state[1], {
      x: 4.86,
      y: rowY + 0.18,
      w: 7.5,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, "cómo se justifica", {
      x: 3.04,
      y: rowY + 0.58,
      w: 1.7,
      h: 0.24,
      fontSize: 9.6,
      color: C.guide,
      charSpacing: 0.5,
    });
    addText(slide, state[2], {
      x: 4.86,
      y: rowY + 0.56,
      w: 7.5,
      h: 0.28,
      fontSize: 13,
      color: C.slate,
    });
  });
  rect(slide, M, 6.36, 11.9, 0.52, C.navy, C.navy, 0.05);
  addText(slide, "No clasifiques por intuición: cita el archivo, comando o resultado que respalda tu decisión.", {
    x: 0.96,
    y: 6.36,
    w: 11.42,
    h: 0.52,
    fontSize: 14.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 21 y 22 · Hoja de clasificación en dos partes.
   El instrumento se repite a propósito: es la misma ficha de trabajo,
   y cambiarle la forma a mitad del ejercicio confundiría al estudiante. */
function addSemaforoSheet(part, title, subtitle, statements, closing) {
  const { slide } = createSlide("light");
  addHeader(slide, `Semáforo · parte ${part} de 2`, title, subtitle, false, { subtitleW: 11.9 });
  const choices = [
    ["V", C.success],
    ["A", C.gold],
    ["R", C.red],
  ];
  statements.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.28;
    const h = 1.14;
    rect(slide, M, y, 11.9, h, C.white, C.border, 0.05);
    addCircleLabel(slide, 0.98, y + 0.3, 0.54, C.red, item[0], { fontSize: 9.6 });
    addText(slide, item[1], {
      x: 1.7,
      y: y + 0.14,
      w: 6.66,
      h: 0.52,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    /* Campo de evidencia: el ejercicio exige citar la fuente, no solo el color. */
    addText(slide, "EVIDENCIA", {
      x: 1.7,
      y: y + 0.74,
      w: 1.06,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color: C.guide,
      charSpacing: 0.7,
    });
    rule(slide, 2.84, y + 0.92, 5.5, C.border, 1);
    choices.forEach((choice, choiceIndex) => {
      const cx = 8.62 + choiceIndex * 1.16;
      rect(slide, cx, y + 0.3, 1.0, 0.54, C.white, choice[1], 0.05);
      addText(slide, choice[0], {
        x: cx,
        y: y + 0.3,
        w: 1.0,
        h: 0.54,
        fontFace: TYPOGRAPHY.display,
        fontSize: 17,
        bold: true,
        color: onPaper(choice[1]),
        align: "center",
        valign: "mid",
      });
    });
  });
  addText(slide, closing, {
    x: 1.4,
    y: 6.46,
    w: 10.54,
    h: 0.32,
    fontSize: 15,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 21 · Afirmaciones 1 a 3 */
addSemaforoSheet(
  1,
  "Clasifica las primeras tres afirmaciones",
  "Verde, amarillo o rojo: marca V, A o R y escribe la evidencia que respalda tu elección.",
  [
    ["01", "Las dependencias declaradas y el lockfile están alineados."],
    ["02", "La función supera los cuatro ejemplos escritos en test_notas.py."],
    ["03", "La función calcula correctamente cualquier combinación posible de notas."],
  ],
  "Elige un estado y prepara una evidencia que pueda contradecirte."
);

/* 22 · Afirmaciones 4 a 6 */
addSemaforoSheet(
  2,
  "Clasifica las tres afirmaciones restantes",
  "Distingue una señal parcial de una conclusión ajena a los controles; marca V, A o R y cita tu evidencia.",
  [
    ["04", "El contrato analizado declara que la función recibe una lista de números."],
    ["05", "El producto protege adecuadamente las calificaciones."],
    ["06", "El código será fácil de modificar por cualquier integrante del equipo."],
  ],
  "Una herramienta relacionada con la propiedad no demuestra la propiedad completa."
);

/* 23 · Lectura razonada y corrección del agente */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "Semáforo · Contraste", "La respuesta correcta conserva el alcance de la evidencia", "Una clasificación vale por su razonamiento, no solo por el color elegido.", true);

  /* Clave de respuestas como banda continua, no como marcas sueltas. */
  rect(slide, M, CONTENT_TOP, 11.9, 0.82, C.titleFill, C.titleFill, 0.06);
  const key = [
    ["01", "VERDE", C.success],
    ["02", "VERDE", C.success],
    ["03", "ROJO", C.red],
    ["04", "AMARILLO", C.gold],
    ["05", "ROJO", C.red],
    ["06", "AMARILLO", C.gold],
  ];
  const keyW = 11.9 / key.length;
  key.forEach((item, index) => {
    const x = M + index * keyW;
    if (index > 0) rect(slide, x, CONTENT_TOP + 0.14, 0.02, 0.54, C.guide, C.guide);
    addText(slide, item[0], {
      x: x + 0.12,
      y: CONTENT_TOP + 0.14,
      w: keyW - 0.24,
      h: 0.2,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10,
      bold: true,
      color: C.terminalMuted,
      align: "center",
    });
    addText(slide, item[1], {
      x: x + 0.12,
      y: CONTENT_TOP + 0.4,
      w: keyW - 0.24,
      h: 0.24,
      fontSize: 13,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 0.7,
    });
  });

  /* Panel hueco = la afirmación que no se sostiene; sólido = la que sí. */
  rect(slide, M, 3.66, 5.6, 2.6, C.navy, C.red, 0.07);
  addText(slide, "LO QUE NO SE PUEDE AFIRMAR", {
    x: 1.06,
    y: 3.96,
    w: 3.4,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.red,
    charSpacing: 1,
  });
  addText(slide, "«Todo quedó verde, por lo tanto el producto cumple los estándares de calidad y está listo para utilizarse».", {
    x: 1.06,
    y: 4.3,
    w: 4.92,
    h: 1.06,
    fontSize: 15.5,
    color: C.sand,
  });
  rule(slide, 1.06, 5.46, 4.92, C.red, 1.2);
  addText(slide, "sin respaldo: «cumple los estándares» y «listo para utilizarse»", {
    x: 1.06,
    y: 5.6,
    w: 4.92,
    h: 0.46,
    fontSize: 12.5,
    bold: true,
    color: C.red,
  });

  addArrow(slide, 6.56, 4.72, 0.34, C.red);

  rect(slide, 7.06, 3.66, 5.56, 2.6, C.titleFill, C.titleFill, 0.07);
  rect(slide, 7.06, 3.66, 5.56, 0.09, C.success, C.success);
  addText(slide, "CONCLUSIÓN PROPORCIONAL", {
    x: 7.4,
    y: 3.98,
    w: 3.4,
    h: 0.2,
    fontSize: 10,
    bold: true,
    color: C.success,
    charSpacing: 0.9,
  });
  addText(slide, "El entorno está alineado y la función supera los cuatro casos ejecutados.", {
    x: 7.4,
    y: 4.3,
    w: 4.88,
    h: 1.06,
    fontSize: 15.5,
    color: C.white,
  });
  rule(slide, 7.4, 5.46, 4.88, C.success, 1.2);
  addText(slide, "otras propiedades de calidad todavía requieren criterios y evidencia", {
    x: 7.4,
    y: 5.6,
    w: 4.88,
    h: 0.46,
    fontSize: 12.5,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Lo que se corrige no es el color elegido, sino la parte de la frase que ninguna evidencia sostiene.", {
    x: 1.4,
    y: 6.52,
    w: 10.54,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 24 · Punto de control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Punto de control", "Antes de avanzar, comprueba cuatro capacidades", "El objetivo no es memorizar nombres: es conservar el alcance de cada afirmación.");
  const checks = [
    ["01", "Distinguir ejecución, cumplimiento de casos y calidad del producto.", C.red],
    ["02", "Formular una pregunta que los cuatro controles no responden.", C.gold],
    ["03", "Clasificar una afirmación y justificarla mediante evidencia.", C.success],
    ["04", "Explicar por qué ISO/IEC 25010 funciona como mapa, no como certificación.", C.red],
  ];
  checks.forEach((item, index) => {
    const y = CONTENT_TOP + index * 0.9;
    addCircleLabel(slide, M, y + 0.06, 0.58, item[2], item[0], {
      fontSize: 10,
      color: item[2] === C.gold ? C.ink : C.white,
    });
    rect(slide, 1.56, y, 11.06, 0.68, C.white, C.border, 0.04);
    addText(slide, item[1], {
      x: 1.94,
      y,
      w: 10.24,
      h: 0.68,
      fontSize: 16,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, 2.12, 6.26, 9.1, 0.48, C.navy, C.navy, 0.04);
  addText(slide, "Si puedes mostrar la evidencia y limitar la conclusión, el bloque está completo.", {
    x: 2.38,
    y: 6.26,
    w: 8.58,
    h: 0.48,
    fontSize: 14.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 25 · Las tres preguntas del bloque, juntas en una sola lámina */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Preguntas", "Tres preguntas para llevarse", "Responde con alcance, contexto, criterio y evidencia; la pista solo desbloquea el razonamiento.");
  const questions = [
    [
      "¿Por qué 4 passed no permite afirmar que nota_final() es correcta para cualquier entrada?",
      "Compara los valores realmente ejecutados con todas las entradas que todavía no tienen un caso representado.",
      C.red,
    ],
    [
      "¿Qué información falta cuando alguien afirma simplemente que un producto «es de calidad»?",
      "Identifica la propiedad, el contexto, el criterio y la evidencia que deberían acompañar esa afirmación.",
      C.gold,
    ],
    [
      "¿Por qué una herramienta en verde no equivale a una característica ISO/IEC 25010 cumplida?",
      "Observa el alcance del comando y compáralo con todo lo que habría que evaluar dentro de la característica.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, item[2], index + 1, {
      fontSize: 13,
      color: item[2] === C.gold ? C.ink : C.white,
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
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, item[2], item[2]);
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

/* 28 · Cierre del Bloque 1 */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · BLOQUE 1", {
    x: M,
    y: 0.84,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "La evidencia es valiosa", {
    x: M,
    y: 1.46,
    w: 8.4,
    h: 0.68,
    fontFace: TYPOGRAPHY.display,
    fontSize: 37,
    bold: true,
    color: C.white,
  });
  addText(slide, "cuando su alcance permanece visible", {
    x: M,
    y: 2.18,
    w: 9.6,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: C.gold,
  });
  const chain = [
    ["RESULTADO", "4 passed", C.success],
    ["ALCANCE", "cuatro casos", C.gold],
    ["CONTEXTO", "producto real", C.red],
    ["PREGUNTA", "¿qué falta?", C.success],
  ];
  chain.forEach((item, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 3.54, 2.7, 1.44, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 3.86,
      w: 2.22,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 4.28,
      w: 2.22,
      h: 0.3,
      fontFace: index < 2 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: 16,
      bold: true,
      color: index === 3 ? C.ink : C.white,
      align: "center",
    });
    if (index < chain.length - 1) addArrow(slide, x + 2.76, 4.02, 0.18, C.red);
  });
  rect(slide, 1.52, 5.74, 10.3, 0.68, C.white, C.white, 0.05);
  addText(slide, "Siguiente: convertir las nueve características en preguntas observables sobre el producto.", {
    x: 1.8,
    y: 5.74,
    w: 9.74,
    h: 0.68,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* -------------------------------------------------------------------------- */
/* BLOQUE 2 · Nueve características para hacer mejores preguntas              */
/* -------------------------------------------------------------------------- */

/* 27 · Apertura del Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 2 · 25 MINUTOS", {
    x: M,
    y: 0.74,
    w: 4.8,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "Nueve características", {
    x: M,
    y: 1.36,
    w: 8.8,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });
  addText(slide, "para hacer mejores preguntas", {
    x: M,
    y: 2.08,
    w: 10.6,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: C.gold,
  });
  const stages = [
    ["NOMBRAR", "la propiedad", C.red],
    ["ATERRIZAR", "el riesgo", C.gold],
    ["OBSERVAR", "el criterio", C.success],
    ["RESPALDAR", "la evidencia", CYAN_ON_NAVY],
  ];
  stages.forEach((item, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 3.54, 2.7, 1.38, C.titleFill, C.titleFill, 0.06);
    rect(slide, x, 3.54, 2.7, 0.08, item[2], item[2]);
    addText(slide, item[0], {
      x: x + 0.22,
      y: 3.88,
      w: 2.26,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 0.22,
      y: 4.26,
      w: 2.26,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: C.white,
      align: "center",
    });
    if (index < stages.length - 1) addArrow(slide, x + 2.76, 4.02, 0.18, C.red);
  });
  addText(slide, "El modelo organiza la conversación; el contexto decide qué importa y cómo comprobarlo.", {
    x: 1.28,
    y: 5.72,
    w: 10.78,
    h: 0.54,
    fontSize: 17,
    bold: true,
    color: C.softBlue,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 28 · Cadena verificable */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.1 · Cadena de análisis", "Del nombre abstracto a una cadena verificable", "Cada paso restringe la interpretación y acerca la preocupación a una evidencia concreta.");
  const chain = [
    ["01", "NECESIDAD", "¿Para quién y para qué?", C.red],
    ["02", "RIESGO", "¿Qué ocurre si falla?", C.gold],
    ["03", "CARACTERÍSTICA", "¿Qué propiedad se afecta?", C.red],
    ["04", "CRITERIO", "¿Qué debería observarse?", C.success],
    ["05", "EVIDENCIA", "¿Cómo lo comprobaremos?", CYAN],
  ];
  chain.forEach((item, index) => {
    const x = M + index * 2.42;
    const y = 2.72 + (index % 2) * 0.32;
    rect(slide, x, y, 2.12, 2.2, C.white, C.border, 0.07);
    rect(slide, x, y, 2.12, 0.1, item[3], item[3]);
    addCircleLabel(slide, x + 0.24, y + 0.34, 0.5, item[3], item[0], {
      fontSize: 9,
      color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: y + 1.02,
      w: 1.64,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: onPaper(item[3]),
      charSpacing: 0.5,
    });
    addText(slide, item[2], {
      x: x + 0.24,
      y: y + 1.4,
      w: 1.64,
      h: 0.52,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    if (index < chain.length - 1) addArrow(slide, x + 2.16, y + 0.9, 0.2, C.red);
  });
  rect(slide, 1.42, 5.72, 10.5, 0.68, C.navy, C.navy, 0.05);
  addText(slide, "Una característica aislada es vocabulario. Con riesgo, criterio y evidencia se convierte en una decisión técnica.", {
    x: 1.74,
    y: 5.72,
    w: 9.86,
    h: 0.68,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 29 · Ejemplo de la cadena */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.1 · Ejemplo", "«La aplicación debe ser rápida» todavía no es un criterio", "La palabra expresa una expectativa; la cadena revela qué falta para poder medirla.", true);
  const steps = [
    ["CONTEXTO", "Consulta de una calificación durante una atención presencial.", C.red],
    ["RIESGO", "La demora interrumpe la tarea y obliga a esperar o repetirla.", C.gold],
    ["PROPIEDAD", "Eficiencia de desempeño.", C.red],
    ["CRITERIO", "Operación, carga y tiempo aceptable acordados.", C.success],
    ["EVIDENCIA", "Medición repetida bajo condiciones controladas.", CYAN_ON_NAVY],
  ];
  steps.forEach((item, index) => {
    const y = 2.5 + index * 0.78;
    addCircleLabel(slide, M, y + 0.06, 0.5, item[2], index + 1, {
      fontSize: 10,
      color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 1.54,
      y,
      w: 1.54,
      h: 0.56,
      fontSize: 10,
      bold: true,
      color: item[2],
      valign: "mid",
      charSpacing: 0.8,
    });
    rect(slide, 3.16, y, 9.46, 0.62, C.titleFill, C.titleFill, 0.04);
    addText(slide, item[1], {
      x: 3.44,
      y,
      w: 8.9,
      h: 0.62,
      fontSize: 14.5,
      bold: index >= 2,
      color: C.white,
      valign: "mid",
    });
  });
  addText(slide, "«Rápida» deja de ser una opinión cuando sabemos qué operación, bajo qué carga y dentro de qué tiempo.", {
    x: 1.22,
    y: 6.5,
    w: 10.9,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 30 · El modelo no inventa umbrales */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.1 · Criterio", "El modelo recuerda la pregunta; el contexto entrega el valor", "ISO/IEC 25010 no decide cuántos segundos, usuarios o errores son aceptables para tu producto.");
  const sources = [
    ["USUARIOS", "Tarea real, expectativa y consecuencias de la espera.", C.red],
    ["REGLAS", "Normas, políticas y condiciones explícitas del producto.", C.gold],
    ["ACUERDOS", "Compromisos técnicos, contratos y niveles de servicio.", C.success],
    ["IMPACTO", "Daño, costo o interrupción que produciría el incumplimiento.", CYAN],
  ];
  sources.forEach((item, index) => {
    const x = M + (index % 2) * 6.08;
    const y = CONTENT_TOP + Math.floor(index / 2) * 1.42;
    rect(slide, x, y, 5.82, 1.18, C.white, C.border, 0.06);
    rect(slide, x, y, 0.12, 1.18, item[2], item[2]);
    addText(slide, item[0], {
      x: x + 0.36,
      y: y + 0.2,
      w: 1.52,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: onPaper(item[2]),
      charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: x + 1.94,
      y: y + 0.18,
      w: 3.58,
      h: 0.76,
      fontSize: 13.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, 2.02, 5.56, 9.3, 0.84, C.navy, C.navy, 0.06);
  addText(slide, "SIN CONTEXTO", {
    x: 2.36,
    y: 5.56,
    w: 1.74,
    h: 0.84,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    valign: "mid",
    charSpacing: 1,
  });
  addText(slide, "el estándar aporta vocabulario, pero no un veredicto ni un umbral inventado.", {
    x: 4.16,
    y: 5.56,
    w: 6.84,
    h: 0.84,
    fontSize: 16,
    bold: true,
    color: C.white,
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 31 · Adecuación funcional: la regla gobierna el recorrido */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.1 · Característica 1 de 9", "Adecuación funcional", "La pregunta no es si la función ejecuta, sino si entrega exactamente lo que la tarea exige.");

  rect(slide, M, CONTENT_TOP, 11.9, 0.74, C.navy, C.navy, 0.05);
  addText(slide, "¿ENTREGA LAS FUNCIONES CORRECTAS, COMPLETAS Y APROPIADAS?", {
    x: 1.0,
    y: CONTENT_TOP,
    w: 11.34,
    h: 0.74,
    fontSize: 18,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    charSpacing: 0.4,
  });

  const flow = [
    ["ENTRADA VÁLIDA", "3.95", C.gold],
    ["REGLA ACORDADA", "ROUND_HALF_UP", C.red],
    ["SALIDA ESPERADA", "4.0", C.success],
  ];
  flow.forEach((item, index) => {
    const x = 0.94 + index * 3.3;
    rect(slide, x, 3.62, 2.72, 1.42, C.white, C.border, 0.07);
    rect(slide, x, 3.62, 2.72, 0.1, item[2], item[2]);
    addText(slide, item[0], {
      x: x + 0.22,
      y: 3.94,
      w: 2.28,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: onPaper(item[2]),
      align: "center",
      charSpacing: 0.75,
    });
    addText(slide, item[1], {
      x: x + 0.22,
      y: 4.34,
      w: 2.28,
      h: 0.4,
      fontFace: TYPOGRAPHY.mono,
      fontSize: item[1].length > 8 ? 15 : 24,
      bold: true,
      color: C.ink,
      align: "center",
    });
    if (index < 2) addArrow(slide, x + 2.84, 4.08, 0.3, C.red);
  });

  rect(slide, 10.82, 3.62, 1.8, 1.42, C.warm, C.red, 0.07);
  addText(slide, "RIESGO", { x: 11.02, y: 3.9, w: 1.4, h: 0.2, fontSize: 9.4, bold: true, color: C.red, align: "center", charSpacing: 0.8 });
  addText(slide, "3.9", { x: 11.02, y: 4.28, w: 1.4, h: 0.38, fontFace: TYPOGRAPHY.mono, fontSize: 24, bold: true, color: C.red, align: "center" });
  addText(slide, "no respeta la regla", { x: 10.98, y: 4.72, w: 1.48, h: 0.2, fontSize: 9.6, color: C.ink, align: "center" });

  addText(slide, "EVIDENCIA QUE PUEDE SOSTENER LA DECISIÓN", {
    x: M,
    y: 5.44,
    w: 4.0,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.red,
    charSpacing: 0.9,
  });
  const evidence = ["Comportamiento", "Aceptación", "Tabla de decisión", "Requisitos"];
  evidence.forEach((item, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 5.84, 2.7, 0.56, index === 2 ? C.navy : C.white, index === 2 ? C.navy : C.border, 0.04);
    addText(slide, item, {
      x: x + 0.16,
      y: 5.84,
      w: 2.38,
      h: 0.56,
      fontSize: 12.2,
      bold: true,
      color: index === 2 ? C.white : C.ink,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "Que la función ejecute no demuestra que resuelva correctamente la necesidad.", {
    x: 1.3,
    y: 6.58,
    w: 10.72,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 32 · Eficiencia de desempeño: laboratorio de medición */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.2 · Característica 2 de 9", "Eficiencia de desempeño", "Una impresión de rapidez se convierte en evidencia cuando declaramos operación, carga, tiempo y recursos.", true);

  rect(slide, M, CONTENT_TOP, 7.48, 3.82, C.titleFill, C.titleFill, 0.07);
  addText(slide, "BANCO DE MEDICIÓN", {
    x: 1.04,
    y: 2.78,
    w: 2.44,
    h: 0.22,
    fontSize: 9.8,
    bold: true,
    color: C.gold,
    charSpacing: 1.1,
  });
  const bench = [
    ["OPERACIÓN", "cargar resultados", C.red],
    ["CARGA", "50.000 registros", C.gold],
    ["TIEMPO", "¿umbral acordado?", C.success],
    ["RECURSOS", "CPU · memoria", CYAN_ON_NAVY],
  ];
  bench.forEach((item, index) => {
    const y = 3.2 + index * 0.7;
    addText(slide, item[0], {
      x: 1.04,
      y,
      w: 1.46,
      h: 0.46,
      fontSize: 9.2,
      bold: true,
      color: item[2],
      valign: "mid",
      charSpacing: 0.65,
    });
    rect(slide, 2.62, y, 4.94, 0.5, C.navy, C.guide, 0.04);
    addText(slide, item[1], {
      x: 2.88,
      y,
      w: 4.42,
      h: 0.5,
      fontFace: index === 1 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: 13.5,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });
  rule(slide, 1.04, 6.14, 6.52, C.gold, 1.2);
  addText(slide, "Repetir bajo las mismas condiciones permite comparar; una ejecución aislada no.", {
    x: 1.04,
    y: 6.28,
    w: 6.52,
    h: 0.4,
    fontSize: 12.8,
    bold: true,
    color: C.softBlue,
  });

  addText(slide, "LECTURA DEL RIESGO", {
    x: 8.62,
    y: 2.78,
    w: 2.74,
    h: 0.22,
    fontSize: 9.8,
    bold: true,
    color: C.red,
    charSpacing: 1.1,
  });
  rect(slide, 8.62, 3.18, 4.0, 1.04, C.white, C.white, 0.06);
  addText(slide, "Miles de registros", { x: 8.92, y: 3.4, w: 3.4, h: 0.28, fontSize: 18, bold: true, color: C.ink, align: "center" });
  addText(slide, "pueden volver inviable la tarea", { x: 8.92, y: 3.76, w: 3.4, h: 0.24, fontSize: 12.5, color: C.slate, align: "center" });
  addArrow(slide, 10.34, 4.42, 0.56, C.red);
  rect(slide, 8.62, 5.06, 4.0, 1.08, C.navy, C.red, 0.06);
  addText(slide, "NO BASTA", { x: 8.94, y: 5.28, w: 1.14, h: 0.2, fontSize: 9.4, bold: true, color: C.red, charSpacing: 0.8 });
  addText(slide, "«En mi computador fue rápido»", { x: 10.06, y: 5.22, w: 2.22, h: 0.46, fontSize: 13.2, bold: true, italic: true, color: C.white, align: "center" });
  addText(slide, "Evidencia: benchmark · carga · perfiles · medición repetida", {
    x: 8.62,
    y: 6.44,
    w: 4.0,
    h: 0.3,
    fontSize: 11.6,
    bold: true,
    color: C.gold,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 33 · Compatibilidad: el contrato es el puente */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.2 · Característica 3 de 9", "Compatibilidad", "El dato puede ser correcto dentro de un producto y aun así perder significado al cruzar hacia otro.");

  rect(slide, M, 2.64, 3.14, 2.52, C.navy, C.navy, 0.07);
  addText(slide, "PRODUCTO A", { x: 1.02, y: 2.98, w: 2.54, h: 0.22, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.9 });
  addText(slide, "Calcula correctamente", { x: 1.02, y: 3.48, w: 2.54, h: 0.42, fontSize: 18, bold: true, color: C.white, align: "center" });
  addStatusPill(slide, 1.18, 4.36, 2.22, "datos correctos", C.success, { h: 0.44, fontSize: 11.5 });

  rule(slide, 3.86, 3.9, 1.16, C.border, 2);
  rect(slide, 5.04, 2.88, 3.24, 2.04, C.white, C.red, 0.07);
  addText(slide, "CONTRATO DE INTERCAMBIO", { x: 5.32, y: 3.2, w: 2.68, h: 0.22, fontSize: 9.5, bold: true, color: C.red, align: "center", charSpacing: 0.75 });
  addText(slide, "formato · campos · significado", { x: 5.34, y: 3.7, w: 2.64, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 12.5, bold: true, color: C.ink, align: "center" });
  rect(slide, 5.44, 4.26, 2.44, 0.42, C.warm, C.warm, 0.04);
  addText(slide, "¿ambos lo interpretan igual?", { x: 5.56, y: 4.26, w: 2.2, h: 0.42, fontSize: 10.8, bold: true, color: C.red, align: "center", valign: "mid" });
  rule(slide, 8.3, 3.9, 1.16, C.border, 2);

  rect(slide, 9.48, 2.64, 3.14, 2.52, C.navy, C.navy, 0.07);
  addText(slide, "PRODUCTO B", { x: 9.78, y: 2.98, w: 2.54, h: 0.22, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.9 });
  addText(slide, "No puede leerlo", { x: 9.78, y: 3.48, w: 2.54, h: 0.42, fontSize: 18, bold: true, color: C.white, align: "center" });
  addStatusPill(slide, 9.94, 4.36, 2.22, "intercambio fallido", C.red, { h: 0.44, fontSize: 11.2 });

  addText(slide, "LO QUE DEBE CONSERVARSE AL CRUZAR", {
    x: M,
    y: 5.52,
    w: 3.82,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.red,
    charSpacing: 0.85,
  });
  const checks = [
    ["FORMATO", "estructura legible", C.red],
    ["SIGNIFICADO", "datos equivalentes", C.gold],
    ["COEXISTENCIA", "sin interferencias", C.success],
  ];
  checks.forEach((item, index) => {
    const x = M + index * 4.04;
    rect(slide, x, 5.9, 3.72, 0.62, C.white, C.border, 0.04);
    rect(slide, x, 5.9, 0.1, 0.62, item[2], item[2]);
    addText(slide, item[0], { x: x + 0.3, y: 6.02, w: 1.28, h: 0.2, fontSize: 9, bold: true, color: onPaper(item[2]), charSpacing: 0.55 });
    addText(slide, item[1], { x: x + 1.62, y: 5.9, w: 1.82, h: 0.62, fontSize: 12.3, bold: true, color: C.ink, align: "center", valign: "mid" });
  });
  addText(slide, "Evidencia: integración · contratos · entorno compartido · comparación antes/después", {
    x: 1.48,
    y: 6.7,
    w: 10.38,
    h: 0.22,
    fontSize: 11.8,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 34 · Síntesis de las primeras tres */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.2 · Valor y respuesta", "Tres preguntas parecidas observan problemas distintos", "El mismo flujo puede fallar por el resultado, por el tiempo o por el intercambio.", true);
  const columns = [
    ["ADECUACIÓN", "¿El resultado respeta la regla?", "3.95 → 4.0", "prueba de comportamiento", C.red],
    ["DESEMPEÑO", "¿Llega a tiempo bajo carga?", "50.000 registros", "benchmark controlado", C.gold],
    ["COMPATIBILIDAD", "¿Otro sistema lo interpreta?", "CSV compartido", "prueba de integración", C.success],
  ];
  columns.forEach((item, index) => {
    const x = M + index * 4.04;
    rect(slide, x, CONTENT_TOP, 3.72, 3.62, C.titleFill, C.titleFill, 0.07);
    rect(slide, x, CONTENT_TOP, 3.72, 0.1, item[4], item[4]);
    addText(slide, item[0], {
      x: x + 0.28,
      y: 2.82,
      w: 3.16,
      h: 0.24,
      fontSize: 10,
      bold: true,
      color: item[4],
      align: "center",
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 0.34,
      y: 3.34,
      w: 3.04,
      h: 0.74,
      fontSize: 16,
      bold: true,
      color: C.white,
      align: "center",
    });
    rule(slide, x + 0.42, 4.28, 2.88, item[4], 1.4);
    addText(slide, item[2], {
      x: x + 0.34,
      y: 4.56,
      w: 3.04,
      h: 0.34,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color: C.softBlue,
      align: "center",
    });
    addText(slide, item[3], {
      x: x + 0.34,
      y: 5.22,
      w: 3.04,
      h: 0.42,
      fontSize: 12.5,
      color: C.sand,
      align: "center",
    });
  });
  addText(slide, "Clasificar bien significa elegir la primera necesidad incumplida, no la palabra que suena más cercana.", {
    x: 1.34,
    y: 6.5,
    w: 10.64,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 35 · Capacidad de interacción: del error técnico a la recuperación */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Característica 4 de 9", "Capacidad de interacción", "La calidad aparece en lo que la persona comprende y puede hacer después de un error.");

  addText(slide, "MISMA ENTRADA INVÁLIDA", { x: M, y: 2.5, w: 3.2, h: 0.22, fontSize: 9.6, bold: true, color: C.red, charSpacing: 0.9 });
  rect(slide, M, 2.88, 5.36, 2.92, C.white, C.border, 0.08);
  rect(slide, M, 2.88, 5.36, 0.5, C.navy, C.navy, 0.08);
  addText(slide, "Calculadora de nota final", { x: 1.0, y: 2.88, w: 4.8, h: 0.5, fontSize: 13.2, bold: true, color: C.white, valign: "mid" });
  addText(slide, "Notas", { x: 1.08, y: 3.66, w: 1.2, h: 0.2, fontSize: 10, bold: true, color: C.slate });
  rect(slide, 1.08, 3.98, 4.66, 0.56, C.white, C.red, 0.04);
  rect(slide, 1.08, 4.8, 4.66, 0.66, C.warm, C.warm, 0.04);
  addText(slide, "ValueError: division by zero", { x: 1.34, y: 4.8, w: 4.14, h: 0.66, fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: C.red, valign: "mid" });
  addText(slide, "¿Qué debe corregir la persona?", { x: 1.08, y: 5.94, w: 4.66, h: 0.22, fontSize: 11.2, bold: true, color: C.red, align: "center" });

  addArrow(slide, 6.34, 4.08, 0.44, C.red);

  rect(slide, 7.02, 2.88, 5.6, 2.92, C.navy, C.navy, 0.08);
  addText(slide, "RECUPERACIÓN COMPRENSIBLE", { x: 7.34, y: 3.18, w: 4.96, h: 0.22, fontSize: 10, bold: true, color: C.gold, charSpacing: 0.85 });
  addText(slide, "Ingresa al menos una nota válida.", { x: 7.34, y: 3.7, w: 4.96, h: 0.72, fontSize: 20, bold: true, color: C.white });
  addText(slide, "Tu información anterior se conserva. Revisa el campo destacado y vuelve a intentarlo.", { x: 7.34, y: 4.5, w: 4.78, h: 0.56, fontSize: 13.2, color: C.softBlue });
  addStatusPill(slide, 7.34, 5.18, 2.18, "CORREGIR ENTRADA", C.success, { h: 0.48, fontSize: 10.8 });
  addText(slide, "mensaje · estado · acción", { x: 9.7, y: 5.28, w: 2.36, h: 0.2, fontSize: 10.5, bold: true, color: C.gold, align: "center" });

  const lenses = [
    ["COMPRENDER", "lenguaje claro", C.red],
    ["RECUPERAR", "acción perceptible", C.gold],
    ["ACCEDER", "interacción inclusiva", C.success],
  ];
  lenses.forEach((item, index) => {
    const x = M + index * 4.04;
    addText(slide, item[0], { x, y: 6.22, w: 1.34, h: 0.2, fontSize: 9.2, bold: true, color: onPaper(item[2]), charSpacing: 0.65 });
    addText(slide, item[1], { x: x + 1.42, y: 6.16, w: 2.3, h: 0.32, fontSize: 12.5, bold: true, color: C.ink });
  });
  addText(slide, "Evidencia: pruebas con usuarios · recorridos de tareas · accesibilidad · inspección de mensajes", { x: 1.1, y: 6.68, w: 11.14, h: 0.22, fontSize: 11.5, bold: true, color: C.slate, align: "center" });
  validateSlide(slide, pptx);
}

/* 36 · Fiabilidad: atravesar el fallo sin perder el estado */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.3 · Característica 5 de 9", "Fiabilidad", "No basta con funcionar en el caso normal: el producto debe contener el fallo y recuperar un estado válido.", true);

  addText(slide, "RECORRIDO ANTE UNA CONDICIÓN ADVERSA", { x: M, y: 2.5, w: 4.8, h: 0.22, fontSize: 9.8, bold: true, color: C.gold, charSpacing: 0.95 });
  rule(slide, 1.24, 4.12, 10.86, C.guide, 2.4);
  const timeline = [
    [1.0, "ESTADO VÁLIDO", "operación normal", C.success],
    [3.86, "FALLO", "lista vacía", C.red],
    [6.48, "CONTENCIÓN", "rechazo controlado", C.gold],
    [9.42, "RECUPERACIÓN", "estado consistente", C.success],
  ];
  timeline.forEach((item, index) => {
    addCircleLabel(slide, item[0], 3.74, 0.76, item[3], index + 1, { fontSize: 12, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: item[0] - 0.52, y: 4.7, w: 1.8, h: 0.22, fontSize: 9, bold: true, color: item[3], align: "center", charSpacing: 0.45 });
    addText(slide, item[2], { x: item[0] - 0.5, y: 5.12, w: 1.76, h: 0.42, fontSize: 12.5, bold: true, color: C.white, align: "center" });
  });
  rect(slide, 3.22, 2.92, 2.46, 0.58, C.navy, C.red, 0.04);
  addText(slide, "NO debe detener todo el proceso", { x: 3.44, y: 2.92, w: 2.02, h: 0.58, fontSize: 11.3, bold: true, color: C.white, align: "center", valign: "mid" });
  rect(slide, 8.98, 2.92, 3.64, 0.58, C.navy, C.success, 0.04);
  addText(slide, "SÍ debe conservar o recuperar coherencia", { x: 9.22, y: 2.92, w: 3.16, h: 0.58, fontSize: 11.3, bold: true, color: C.white, align: "center", valign: "mid" });

  const evidence = ["excepciones", "inyección de fallos", "reinicios", "disponibilidad", "recuperación"];
  evidence.forEach((item, index) => {
    const x = M + index * 2.42;
    rect(slide, x, 5.92, 2.16, 0.5, C.titleFill, C.titleFill, 0.04);
    addText(slide, item, { x: x + 0.12, y: 5.92, w: 1.92, h: 0.5, fontSize: 10.8, bold: true, color: index === 1 ? C.gold : C.softBlue, align: "center", valign: "mid" });
  });
  addText(slide, "Un resultado correcto en un caso no demuestra estabilidad frente a fallos, carga o recuperación.", { x: 1.18, y: 6.64, w: 10.98, h: 0.24, fontSize: 13.5, bold: true, color: C.softBlue, align: "center" });
  validateSlide(slide, pptx);
}

/* 37 · Seguridad: identidad, permiso, operación y registro */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Característica 6 de 9", "Seguridad", "La operación puede ser correcta y seguir siendo insegura si la ejecuta una identidad sin autorización.");

  rect(slide, M, CONTENT_TOP, 3.08, 3.64, C.navy, C.navy, 0.07);
  addText(slide, "¿QUIÉN?", { x: 1.08, y: 2.86, w: 2.36, h: 0.22, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.9 });
  addCircleLabel(slide, 1.72, 3.46, 1.08, C.gold, "ID", { fontSize: 20, color: C.ink });
  addText(slide, "identidad autenticada", { x: 1.02, y: 4.82, w: 2.48, h: 0.32, fontSize: 14, bold: true, color: C.white, align: "center" });
  addText(slide, "no implica permiso", { x: 1.02, y: 5.28, w: 2.48, h: 0.28, fontSize: 11.5, color: C.softBlue, align: "center" });

  addArrow(slide, 4.08, 3.86, 0.4, C.red);
  rect(slide, 4.7, 2.72, 3.18, 3.12, C.white, C.border, 0.07);
  addText(slide, "CONTROL DE AUTORIZACIÓN", { x: 4.98, y: 3.02, w: 2.62, h: 0.22, fontSize: 9.6, bold: true, color: C.red, align: "center", charSpacing: 0.65 });
  const permissions = [
    ["ver curso propio", "PERMITIR", C.success],
    ["ver otro curso", "DENEGAR", C.red],
    ["modificar nota", "SEGÚN ROL", C.gold],
  ];
  permissions.forEach((item, index) => {
    const y = 3.52 + index * 0.62;
    addText(slide, item[0], { x: 5.02, y, w: 1.46, h: 0.42, fontSize: 10.7, bold: true, color: C.ink, valign: "mid" });
    addStatusPill(slide, 6.52, y, 1.04, item[1], item[2], { h: 0.42, fontSize: 8.5, color: item[2] === C.gold ? C.ink : C.white });
  });
  addText(slide, "criterio: operación limitada a identidades autorizadas", { x: 5.0, y: 5.34, w: 2.58, h: 0.38, fontSize: 9.8, bold: true, color: C.slate, align: "center" });

  addArrow(slide, 8.16, 3.86, 0.4, C.red);
  rect(slide, 8.78, CONTENT_TOP, 3.84, 3.64, C.navy, C.navy, 0.07);
  addText(slide, "¿QUÉ QUEDA REGISTRADO?", { x: 9.08, y: 2.86, w: 3.24, h: 0.22, fontSize: 9.8, bold: true, color: C.gold, align: "center", charSpacing: 0.75 });
  const log = [
    ["14:02", "consulta", "curso A"],
    ["14:05", "intento denegado", "curso B"],
    ["14:08", "cambio autorizado", "nota 4.0"],
  ];
  log.forEach((item, index) => {
    const y = 3.46 + index * 0.66;
    addText(slide, item[0], { x: 9.08, y, w: 0.64, h: 0.36, fontFace: TYPOGRAPHY.mono, fontSize: 9.8, bold: true, color: C.success, valign: "mid" });
    addText(slide, item[1], { x: 9.82, y, w: 1.34, h: 0.36, fontSize: 10.8, bold: true, color: C.white, valign: "mid" });
    addText(slide, item[2], { x: 11.18, y, w: 1.06, h: 0.36, fontSize: 9.8, color: C.softBlue, align: "right", valign: "mid" });
    if (index < 2) rule(slide, 9.08, y + 0.48, 3.16, C.guide, 0.7);
  });
  addText(slide, "atribución e investigación", { x: 9.08, y: 5.58, w: 3.16, h: 0.28, fontSize: 11.2, bold: true, color: C.gold, align: "center" });

  addText(slide, "Evidencia: autorización · configuración · amenazas · integridad · confidencialidad · registros", { x: 1.22, y: 6.48, w: 10.9, h: 0.28, fontSize: 12.2, bold: true, color: C.slate, align: "center" });
  validateSlide(slide, pptx);
}

/* 38 · Seguridad operacional: una barrera cambia el destino */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.3 · Característica 7 de 9", "Seguridad operacional", "La propiedad se observa en cómo el sistema previene daño y conduce una condición peligrosa hacia un estado seguro.", true);

  addText(slide, "CONDICIÓN PELIGROSA", { x: M, y: 2.56, w: 3.0, h: 0.22, fontSize: 9.8, bold: true, color: C.red, charSpacing: 0.9 });
  rect(slide, M, 2.96, 3.22, 2.62, C.titleFill, C.red, 0.07);
  addText(slide, "Protección abierta", { x: 1.06, y: 3.44, w: 2.54, h: 0.36, fontSize: 19, bold: true, color: C.white, align: "center" });
  addText(slide, "+", { x: 1.94, y: 3.98, w: 0.78, h: 0.3, fontSize: 20, bold: true, color: C.red, align: "center" });
  addText(slide, "orden de movimiento", { x: 1.06, y: 4.48, w: 2.54, h: 0.36, fontSize: 16, bold: true, color: C.white, align: "center" });
  addStatusPill(slide, 1.18, 5.02, 2.3, "RIESGO DE DAÑO", C.red, { h: 0.42, fontSize: 10.5 });

  addArrow(slide, 4.14, 3.94, 0.46, C.red);
  rect(slide, 4.84, 2.7, 3.26, 3.12, C.white, C.gold, 0.07);
  addText(slide, "BARRERA", { x: 5.16, y: 3.02, w: 2.62, h: 0.22, fontSize: 10, bold: true, color: C.ink, align: "center", charSpacing: 1 });
  rule(slide, 5.3, 3.52, 2.34, C.gold, 4);
  addText(slide, "INTERBLOQUEO", { x: 5.16, y: 3.84, w: 2.62, h: 0.28, fontSize: 16, bold: true, color: C.red, align: "center" });
  addText(slide, "bloquea la operación", { x: 5.16, y: 4.4, w: 2.62, h: 0.28, fontSize: 13, bold: true, color: C.ink, align: "center" });
  addText(slide, "advierte antes de continuar", { x: 5.16, y: 4.88, w: 2.62, h: 0.42, fontSize: 11.8, color: C.slate, align: "center" });

  addArrow(slide, 8.34, 3.94, 0.46, C.success);
  rect(slide, 9.04, 2.96, 3.58, 2.62, C.titleFill, C.success, 0.07);
  addText(slide, "ESTADO SEGURO", { x: 9.36, y: 3.4, w: 2.94, h: 0.24, fontSize: 10, bold: true, color: C.success, align: "center", charSpacing: 0.9 });
  addText(slide, "Movimiento detenido", { x: 9.36, y: 3.96, w: 2.94, h: 0.48, fontSize: 19, bold: true, color: C.white, align: "center" });
  addText(slide, "la persona puede corregir la condición sin exposición al peligro", { x: 9.36, y: 4.62, w: 2.94, h: 0.6, fontSize: 11.5, color: C.softBlue, align: "center" });

  const evidence = ["peligros", "límites", "fallos simulados", "interbloqueos", "parada segura"];
  evidence.forEach((item, index) => {
    const x = M + index * 2.42;
    rect(slide, x, 6.0, 2.16, 0.46, C.navy, index === 3 ? C.success : C.guide, 0.04);
    addText(slide, item, { x: x + 0.12, y: 6.0, w: 1.92, h: 0.46, fontSize: 10.3, bold: true, color: index === 3 ? C.success : C.softBlue, align: "center", valign: "mid" });
  });
  addText(slide, "La prioridad depende del daño posible: una calculadora y un sistema médico no exponen el mismo riesgo.", { x: 1.04, y: 6.66, w: 11.26, h: 0.24, fontSize: 12.6, bold: true, color: C.softBlue, align: "center" });
  validateSlide(slide, pptx);
}

/* 39 · Seguridad frente a seguridad operacional */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Contraste esencial", "Seguridad y seguridad operacional no protegen lo mismo", "Ambas reducen riesgo, pero parten de amenazas y consecuencias diferentes.");
  const sides = [
    {
      x: M,
      title: "SEGURIDAD",
      question: "¿Quién puede acceder, modificar o ejecutar?",
      protects: "Información, identidades y operaciones autorizadas.",
      case: "Una cuenta sin permisos ve notas de otro curso.",
      evidence: "Autorización · amenazas · registros",
      accent: C.gold,
    },
    {
      x: 6.86,
      title: "SEGURIDAD OPERACIONAL",
      question: "¿Qué daño físico o material podría provocar el sistema?",
      protects: "Personas, entorno y activos frente a estados peligrosos.",
      case: "Una máquina se mueve con la protección abierta.",
      evidence: "Peligros · límites · estado seguro",
      accent: C.success,
    },
  ];
  sides.forEach((side) => {
    rect(slide, side.x, CONTENT_TOP, 5.76, 3.78, C.white, C.border, 0.07);
    rect(slide, side.x, CONTENT_TOP, 5.76, 0.58, side.accent, side.accent, 0.07);
    addText(slide, side.title, {
      x: side.x + 0.24,
      y: CONTENT_TOP,
      w: 5.28,
      h: 0.58,
      fontSize: side.title.length > 20 ? 11.5 : 13,
      bold: true,
      color: side.accent === C.gold ? C.ink : C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, side.question, {
      x: side.x + 0.34,
      y: 3.32,
      w: 5.08,
      h: 0.62,
      fontSize: 17,
      bold: true,
      color: C.ink,
      align: "center",
    });
    rule(slide, side.x + 0.52, 4.12, 4.72, side.accent, 1.4);
    addText(slide, "PROTEGE", { x: side.x + 0.34, y: 4.34, w: 1.0, h: 0.2, fontSize: 9, bold: true, color: onPaper(side.accent), charSpacing: 0.7 });
    addText(slide, side.protects, { x: side.x + 1.5, y: 4.28, w: 3.92, h: 0.48, fontSize: 13.2, bold: true, color: C.ink });
    addText(slide, "CASO", { x: side.x + 0.34, y: 4.98, w: 1.0, h: 0.2, fontSize: 9, bold: true, color: onPaper(side.accent), charSpacing: 0.7 });
    addText(slide, side.case, { x: side.x + 1.5, y: 4.9, w: 3.92, h: 0.52, fontSize: 13.2, color: C.slate });
    addStatusPill(slide, side.x + 0.34, 5.66, 5.08, side.evidence, C.navy, { h: 0.44, fontSize: 11.5 });
  });
  addText(slide, "Pregunta de desempate: ¿el problema nace de una acción no autorizada o de un estado capaz de causar daño?", {
    x: 1.18,
    y: 6.5,
    w: 10.98,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: C.slate,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 40 · Mantenibilidad: el alcance del cambio debe permanecer controlado */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.4 · Característica 8 de 9", "Mantenibilidad", "El diseño se vuelve mantenible cuando un cambio puede localizarse, comprenderse y volver a verificarse.");

  addText(slide, "CAMBIO DISPERSO", { x: M, y: 2.52, w: 2.6, h: 0.22, fontSize: 9.8, bold: true, color: C.red, charSpacing: 0.95 });
  rect(slide, M, 2.9, 5.08, 3.22, C.white, C.border, 0.07);
  addText(slide, "Cambiar el redondeo", { x: 1.04, y: 3.18, w: 4.46, h: 0.32, fontSize: 17, bold: true, color: C.ink, align: "center" });
  const files = [
    [1.08, 3.82, "calculo.py"],
    [3.42, 3.82, "reporte.py"],
    [1.08, 4.8, "exportar.py"],
    [3.42, 4.8, "resumen.py"],
  ];
  files.forEach((item, index) => {
    rect(slide, item[0], item[1], 1.94, 0.62, C.warm, C.red, 0.04);
    addText(slide, item[2], { x: item[0] + 0.14, y: item[1], w: 1.66, h: 0.62, fontFace: TYPOGRAPHY.mono, fontSize: 11.2, bold: true, color: C.ink, align: "center", valign: "mid" });
  });
  addText(slide, "4 puntos de edición", { x: 1.12, y: 5.66, w: 1.76, h: 0.2, fontSize: 10, bold: true, color: C.red, align: "center" });
  addText(slide, "3 sin pruebas de regresión", { x: 3.22, y: 5.66, w: 2.02, h: 0.2, fontSize: 10, bold: true, color: C.red, align: "center" });

  addArrow(slide, 6.02, 4.2, 0.42, C.red);

  addText(slide, "CAMBIO LOCALIZADO", { x: 6.74, y: 2.52, w: 3.0, h: 0.22, fontSize: 9.8, bold: true, color: C.success, charSpacing: 0.95 });
  rect(slide, 6.74, 2.9, 5.88, 3.22, C.navy, C.navy, 0.07);
  rect(slide, 7.12, 3.44, 2.18, 1.92, C.titleFill, C.success, 0.06);
  addText(slide, "REGLA ÚNICA", { x: 7.38, y: 3.82, w: 1.66, h: 0.2, fontSize: 9.6, bold: true, color: C.success, align: "center", charSpacing: 0.7 });
  addText(slide, "redondeo", { x: 7.38, y: 4.26, w: 1.66, h: 0.34, fontFace: TYPOGRAPHY.mono, fontSize: 16, bold: true, color: C.white, align: "center" });
  addText(slide, "un lugar identificable", { x: 7.34, y: 4.76, w: 1.74, h: 0.3, fontSize: 10.4, color: C.softBlue, align: "center" });
  addArrow(slide, 9.52, 4.18, 0.34, C.success);
  rect(slide, 10.08, 3.44, 2.16, 1.92, C.white, C.white, 0.06);
  addText(slide, "REGRESIÓN", { x: 10.34, y: 3.82, w: 1.64, h: 0.2, fontSize: 9.6, bold: true, color: C.red, align: "center", charSpacing: 0.7 });
  addText(slide, "cambiar", { x: 10.34, y: 4.2, w: 1.64, h: 0.26, fontSize: 13, bold: true, color: C.ink, align: "center" });
  addText(slide, "→ verificar", { x: 10.34, y: 4.54, w: 1.64, h: 0.26, fontSize: 13, bold: true, color: C.success, align: "center" });
  addText(slide, "→ confiar", { x: 10.34, y: 4.88, w: 1.64, h: 0.26, fontSize: 13, bold: true, color: C.ink, align: "center" });
  addText(slide, "criterio: modificar sin alterar responsabilidades no relacionadas", { x: 7.18, y: 5.64, w: 5.02, h: 0.28, fontSize: 10.8, bold: true, color: C.gold, align: "center" });

  addText(slide, "EVIDENCIA", { x: M, y: 6.46, w: 1.04, h: 0.2, fontSize: 9.2, bold: true, color: C.red, charSpacing: 0.7 });
  addText(slide, "revisión de código · análisis estático · estructura · regresión · esfuerzo de cambio", { x: 1.86, y: 6.4, w: 8.24, h: 0.3, fontSize: 12.3, bold: true, color: C.ink });
  addText(slide, "Ruff + Pyrefly + pytest = señales parciales", { x: 10.18, y: 6.36, w: 2.44, h: 0.36, fontSize: 10.2, bold: true, color: C.slate, align: "right" });
  validateSlide(slide, pptx);
}

/* 41 · Flexibilidad: un núcleo estable admite cambios esperables */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.4 · Característica 9 de 9", "Flexibilidad", "Adaptarse no significa anticipar cualquier futuro: significa absorber cambios razonables sin reconstrucción innecesaria.", true);

  rect(slide, 4.82, 2.72, 3.72, 2.76, C.white, C.white, 0.12);
  rect(slide, 5.12, 3.02, 3.12, 2.16, C.navy, C.navy, 0.08);
  addText(slide, "NÚCLEO ESTABLE", { x: 5.42, y: 3.46, w: 2.52, h: 0.22, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.85 });
  addText(slide, "responsabilidad\nprincipal", { x: 5.42, y: 3.9, w: 2.52, h: 0.68, fontSize: 20, bold: true, color: C.white, align: "center", valign: "mid" });
  addText(slide, "sin cambios ajenos", { x: 5.42, y: 4.72, w: 2.52, h: 0.26, fontSize: 11.4, color: C.softBlue, align: "center" });

  const changes = [
    [M, 2.72, 3.34, 1.12, "ESCALA", "más volumen esperado", C.red],
    [M, 4.58, 3.34, 1.12, "ENTORNO", "otra plataforma declarada", C.gold],
    [9.28, 2.72, 3.34, 1.12, "CONFIGURACIÓN", "parámetros externos", C.success],
    [9.28, 4.58, 3.34, 1.12, "SUSTITUCIÓN", "cambiar un componente", CYAN_ON_NAVY],
  ];
  changes.forEach((item, index) => {
    rect(slide, item[0], item[1], item[2], item[3], C.titleFill, C.titleFill, 0.06);
    rect(slide, item[0], item[1], 0.1, item[3], item[6], item[6]);
    addText(slide, item[4], { x: item[0] + 0.32, y: item[1] + 0.18, w: 1.58, h: 0.2, fontSize: 8.8, bold: true, color: item[6], charSpacing: 0.55 });
    addText(slide, item[5], { x: item[0] + 1.94, y: item[1] + 0.12, w: 1.12, h: 0.7, fontSize: 11.2, bold: true, color: C.white, align: "center", valign: "mid" });
    if (index < 2) addArrow(slide, 4.24, item[1] + 0.34, 0.34, item[6]);
    else {
      slide.addShape(SH.chevron, {
        x: 8.78,
        y: item[1] + 0.34,
        w: 0.34,
        h: 0.46,
        rotate: 180,
        fill: { color: item[6] },
        line: { color: item[6], pt: 0 },
      });
    }
  });

  addText(slide, "¿CÓMO SE INVESTIGA?", { x: M, y: 6.14, w: 2.6, h: 0.22, fontSize: 9.7, bold: true, color: C.gold, charSpacing: 0.9 });
  const evidence = ["matriz de entornos", "instalación reproducible", "prueba de escala", "configuración externa", "migración"];
  evidence.forEach((item, index) => {
    const x = M + index * 2.42;
    rect(slide, x, 6.48, 2.16, 0.42, index === 1 ? C.white : C.navy, index === 1 ? C.white : C.guide, 0.04);
    addText(slide, item, { x: x + 0.1, y: 6.48, w: 1.96, h: 0.42, fontSize: item.length > 20 ? 8.8 : 10, bold: true, color: index === 1 ? C.ink : C.softBlue, align: "center", valign: "mid" });
  });
  validateSlide(slide, pptx);
}

/* 42 · Mapa compacto de las nueve preguntas */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.4 · Mapa completo", "Nueve preguntas, nueve ángulos sobre el mismo producto", "El mapa evita convertir una única señal verde en una conclusión total.", true);
  const groups = [
    [
      "VALOR Y RESPUESTA",
      C.red,
      [
        ["01", "¿Hace lo correcto?"],
        ["02", "¿Responde a tiempo?"],
        ["03", "¿Intercambia bien?"],
      ],
    ],
    [
      "USO, FALLOS Y AMENAZAS",
      C.gold,
      [
        ["04", "¿Se puede operar y corregir?"],
        ["05", "¿Resiste y se recupera?"],
        ["06", "¿Impide acciones no autorizadas?"],
      ],
    ],
    [
      "CAMBIO Y CONSECUENCIAS",
      C.success,
      [
        ["07", "¿Evita estados peligrosos?"],
        ["08", "¿Se puede modificar con control?"],
        ["09", "¿Se adapta al cambio esperado?"],
      ],
    ],
  ];
  groups.forEach((group, groupIndex) => {
    const x = M + groupIndex * 4.04;
    rect(slide, x, CONTENT_TOP, 3.72, 3.86, C.titleFill, C.titleFill, 0.07);
    rect(slide, x, CONTENT_TOP, 3.72, 0.56, group[1], group[1], 0.07);
    addText(slide, group[0], {
      x: x + 0.18,
      y: CONTENT_TOP,
      w: 3.36,
      h: 0.56,
      fontSize: group[0].length > 22 ? 9.2 : 10.2,
      bold: true,
      color: group[1] === C.gold ? C.ink : C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.55,
    });
    group[2].forEach((item, index) => {
      const y = 3.3 + index * 0.92;
      addCircleLabel(slide, x + 0.28, y, 0.46, group[1], item[0], {
        fontSize: 8.4,
        color: group[1] === C.gold ? C.ink : C.white,
      });
      addText(slide, item[1], {
        x: x + 0.94,
        y: y - 0.02,
        w: 2.48,
        h: 0.5,
        fontSize: item[1].length > 28 ? 12.2 : 13.3,
        bold: true,
        color: C.white,
        valign: "mid",
      });
      if (index < 2) rule(slide, x + 0.28, y + 0.68, 3.16, C.guide, 0.8);
    });
  });
  addText(slide, "No se marcan casillas: se formulan preguntas relevantes para el contexto del producto.", {
    x: 1.46,
    y: 6.54,
    w: 10.4,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 43 · Principal y secundarias */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.5 · Clasificación", "Una situación puede afectar varias características", "La principal explica la primera necesidad incumplida; las secundarias explican consecuencias justificables.");
  rect(slide, M, CONTENT_TOP, 3.22, 3.58, C.navy, C.navy, 0.07);
  addText(slide, "PROBLEMA\nOBSERVADO", {
    x: 1.08,
    y: 3.14,
    w: 2.5,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  addText(slide, "una situación, no una etiqueta", {
    x: 1.08,
    y: 4.4,
    w: 2.5,
    h: 0.3,
    fontSize: 12.5,
    color: C.softBlue,
    align: "center",
  });
  addArrow(slide, 4.18, 3.92, 0.42, C.red);
  const decisions = [
    ["1", "¿Qué necesidad incumple primero?", "CARACTERÍSTICA PRINCIPAL", C.red],
    ["2", "¿Qué otras consecuencias produce?", "CARACTERÍSTICAS RELACIONADAS", C.gold],
    ["3", "¿Qué observación permitiría investigarlo?", "EVIDENCIA POSIBLE", C.success],
  ];
  decisions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.16;
    addCircleLabel(slide, 4.86, y + 0.18, 0.54, item[3], item[0], {
      fontSize: 12,
      color: item[3] === C.gold ? C.ink : C.white,
    });
    rect(slide, 5.68, y, 6.94, 0.94, C.white, C.border, 0.05);
    addText(slide, item[1], {
      x: 6.0,
      y: y + 0.14,
      w: 3.86,
      h: 0.58,
      fontSize: 14.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, item[2], {
      x: 9.88,
      y: y + 0.14,
      w: 2.42,
      h: 0.58,
      fontSize: 9.6,
      bold: true,
      color: onPaper(item[3]),
      align: "center",
      valign: "mid",
      charSpacing: 0.5,
    });
  });
  rect(slide, 4.86, 6.12, 7.76, 0.46, C.warm, C.warm, 0.04);
  addText(slide, "Clasificar no es buscar una palabra idéntica: es comprender la necesidad y el impacto.", {
    x: 5.14,
    y: 6.12,
    w: 7.2,
    h: 0.46,
    fontSize: 13.5,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 44 · Ejemplo principal/secundaria */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.5 · Ejemplo", "Ocho segundos pueden revelar más de una preocupación", "La clasificación depende de la primera necesidad incumplida y de las consecuencias observadas.", true);
  rect(slide, M, CONTENT_TOP, 3.32, 3.52, C.titleFill, C.titleFill, 0.07);
  addText(slide, "8 s", {
    x: 1.04,
    y: 2.94,
    w: 2.68,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 48,
    bold: true,
    color: C.gold,
    align: "center",
  });
  addText(slide, "para mostrar una calificación", {
    x: 1.08,
    y: 4.0,
    w: 2.6,
    h: 0.62,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
  });
  rule(slide, 1.14, 4.9, 2.48, C.red, 1.4);
  addText(slide, "bajo una carga definida", {
    x: 1.08,
    y: 5.16,
    w: 2.6,
    h: 0.28,
    fontSize: 12.5,
    color: C.softBlue,
    align: "center",
  });
  addArrow(slide, 4.28, 3.92, 0.38, C.red);
  const impacts = [
    ["PRINCIPAL", "Eficiencia de desempeño", "La demora incumple primero el tiempo esperado bajo carga.", C.red],
    ["SECUNDARIA", "Capacidad de interacción", "Si no hay feedback, las personas pueden repetir la operación creyendo que falló.", C.gold],
    ["EVIDENCIA", "Medición + observación de la tarea", "Cronometrar condiciones y revisar qué hace la persona durante la espera.", C.success],
  ];
  impacts.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.14;
    rect(slide, 4.94, y, 7.68, 0.96, C.titleFill, C.titleFill, 0.05);
    rect(slide, 4.94, y, 0.1, 0.96, item[3], item[3]);
    addText(slide, item[0], { x: 5.3, y: y + 0.14, w: 1.36, h: 0.2, fontSize: 9.4, bold: true, color: item[3], charSpacing: 0.8 });
    addText(slide, item[1], { x: 6.76, y: y + 0.12, w: 2.52, h: 0.54, fontSize: 14, bold: true, color: C.white, valign: "mid" });
    addText(slide, item[2], { x: 9.42, y: y + 0.1, w: 2.9, h: 0.66, fontSize: 11.7, color: C.sand, valign: "mid" });
  });
  addText(slide, "La secundaria requiere una consecuencia observable; no se agrega solo porque también podría estar relacionada.", {
    x: 1.28,
    y: 6.5,
    w: 10.78,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

function addClassificationSheet(part, statements, footer) {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    `2.5 · Ejercicio individual · parte ${part} de 2`,
    part === 1 ? "Clasifica las primeras tres situaciones" : "Clasifica las tres situaciones restantes",
    "Para cada caso: elige una característica principal, una secundaria solo si puedes justificarla y una evidencia posible."
  );
  statements.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.24;
    rect(slide, M, y, 11.9, 1.08, C.white, C.border, 0.05);
    addCircleLabel(slide, 1.0, y + 0.27, 0.54, item[2], item[0], {
      fontSize: 9.4,
      color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 1.72,
      y: y + 0.12,
      w: 6.12,
      h: 0.54,
      fontSize: 14.3,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    const fields = [
      ["PRINCIPAL", C.red],
      ["SECUNDARIA", C.gold],
      ["EVIDENCIA", C.success],
    ];
    fields.forEach((field, fieldIndex) => {
      const x = 8.08 + fieldIndex * 1.42;
      addText(slide, field[0], {
        x,
        y: y + 0.16,
        w: 1.24,
        h: 0.18,
        fontSize: field[0].length > 9 ? 7.7 : 8.4,
        bold: true,
        color: onPaper(field[1]),
        align: "center",
        charSpacing: 0.25,
      });
      rule(slide, x, y + 0.78, 1.24, field[1], 1.2);
    });
  });
  rect(slide, 1.48, 6.38, 10.38, 0.42, C.navy, C.navy, 0.04);
  addText(slide, footer, {
    x: 1.74,
    y: 6.38,
    w: 9.86,
    h: 0.42,
    fontSize: 12.8,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

addClassificationSheet(
  1,
  [
    ["01", "El promedio 3.95 se informa como 3.9, aunque la regla exige 4.0.", C.red],
    ["02", "Cargar 50.000 registros demora demasiado para terminar dentro del horario.", C.gold],
    ["03", "El archivo tiene datos correctos, pero la plataforma receptora no puede leerlo.", C.success],
  ],
  "Empieza por la necesidad incumplida; luego decide si existe una consecuencia secundaria real."
);

addClassificationSheet(
  2,
  [
    ["04", "Una entrada vacía cierra la aplicación y muestra solo un mensaje técnico.", C.red],
    ["05", "Una cuenta sin permisos consulta las calificaciones de otro curso.", C.gold],
    ["06", "Cambiar el redondeo exige editar cuatro archivos sin pruebas de regresión en tres.", C.success],
  ],
  "La evidencia propuesta debe investigar el problema; no basta con repetir el nombre de la característica."
);

/* 47 · Uso responsable del agente */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.5 · Contraste con agente", "Una clasificación útil deja visible el razonamiento y lo que falta", "El agente puede proponer una lectura inicial; la evidencia y el contexto siguen siendo responsabilidad del análisis.", true);
  rect(slide, M, CONTENT_TOP, 7.18, 3.74, C.terminal, C.terminal, 0.07);
  addText(slide, "PROMPT DE ANÁLISIS", {
    x: 1.06,
    y: 2.78,
    w: 2.4,
    h: 0.22,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10,
    bold: true,
    color: C.success,
    charSpacing: 0.7,
  });
  addText(slide, "Para cada situación, propone una característica principal de ISO/IEC 25010:2023 y, solo si se justifica, una secundaria. Explica qué necesidad o riesgo sustenta la clasificación. No inventes requisitos ni umbrales; si falta contexto, indícalo.", {
    x: 1.06,
    y: 3.24,
    w: 6.5,
    h: 2.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    color: C.white,
  });
  const audit = [
    ["1", "¿Explica la primera necesidad incumplida?", C.red],
    ["2", "¿Separa consecuencias de la causa principal?", C.gold],
    ["3", "¿Declara el contexto que todavía falta?", C.success],
    ["4", "¿Evita inventar requisitos o umbrales?", CYAN_ON_NAVY],
  ];
  audit.forEach((item, index) => {
    const y = CONTENT_TOP + index * 0.84;
    addCircleLabel(slide, 8.32, y + 0.12, 0.48, item[2], item[0], {
      fontSize: 9.5,
      color: item[2] === C.gold ? C.ink : C.white,
    });
    rect(slide, 9.02, y, 3.6, 0.68, C.titleFill, C.titleFill, 0.04);
    addText(slide, item[1], {
      x: 9.28,
      y,
      w: 3.08,
      h: 0.68,
      fontSize: 12.6,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });
  addText(slide, "Una característica válida sin una justificación válida sigue siendo una respuesta débil.", {
    x: 1.26,
    y: 6.54,
    w: 10.82,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 48 · Punto de control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Punto de control", "Antes de avanzar, comprueba cuatro capacidades", "El mapa está aprendido cuando puedes convertir sus nombres en decisiones observables.");
  const checks = [
    ["01", "Formular una pregunta concreta para cada una de las nueve características.", C.red],
    ["02", "Construir la secuencia riesgo, característica, criterio y evidencia.", C.gold],
    ["03", "Distinguir seguridad de la información y seguridad operacional.", C.success],
    ["04", "Elegir una característica principal sin negar efectos secundarios justificados.", CYAN],
  ];
  checks.forEach((item, index) => {
    const y = CONTENT_TOP + index * 0.9;
    addCircleLabel(slide, M, y + 0.06, 0.58, item[2], item[0], {
      fontSize: 10,
      color: item[2] === C.gold ? C.ink : C.white,
    });
    rect(slide, 1.56, y, 11.06, 0.68, C.white, C.border, 0.04);
    addText(slide, item[1], {
      x: 1.94,
      y,
      w: 10.24,
      h: 0.68,
      fontSize: 16,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });
  rect(slide, 1.86, 6.26, 9.62, 0.48, C.navy, C.navy, 0.04);
  addText(slide, "Si puedes justificar la clasificación y proponer evidencia, el mapa ya está funcionando.", {
    x: 2.16,
    y: 6.26,
    w: 9.02,
    h: 0.48,
    fontSize: 14.2,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 49 · Preguntas guía del Bloque 2 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Preguntas", "Tres preguntas para llevarse", "Responde desde el riesgo y el alcance; la pista orienta sin entregar la conclusión.");
  const questions = [
    [
      "¿Por qué una prueba funcional no demuestra automáticamente fiabilidad o seguridad?",
      "Compara el resultado observado con las condiciones adversas y los accesos que todavía no se ejecutaron.",
      C.red,
    ],
    [
      "¿Cómo distinguimos la característica principal cuando un problema parece pertenecer a varias?",
      "Comienza por la necesidad que se incumple primero y luego separa sus consecuencias.",
      C.gold,
    ],
    [
      "¿Por qué no todas las características deben tener la misma prioridad en todos los productos?",
      "Contrasta el daño posible en una calculadora de práctica con un sistema médico o industrial.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, item[2], index + 1, {
      fontSize: 13,
      color: item[2] === C.gold ? C.ink : C.white,
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
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, item[2], item[2]);
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

/* 50 · Cierre del Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · BLOQUE 2", {
    x: M,
    y: 0.84,
    w: 4.4,
    h: 0.22,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.7,
  });
  addText(slide, "El estándar organiza", {
    x: M,
    y: 1.44,
    w: 8.8,
    h: 0.68,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });
  addText(slide, "el contexto vuelve relevante la pregunta", {
    x: M,
    y: 2.18,
    w: 11.24,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
  });
  const chain = [
    ["RIESGO", "qué puede fallar", C.red],
    ["PROPIEDAD", "qué observar", C.gold],
    ["CRITERIO", "qué se espera", C.success],
    ["EVIDENCIA", "cómo sostenerlo", CYAN_ON_NAVY],
  ];
  chain.forEach((item, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 3.54, 2.7, 1.44, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.24,
      y: 3.86,
      w: 2.22,
      h: 0.2,
      fontSize: 10,
      bold: true,
      color: item[2],
      align: "center",
      charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 0.24,
      y: 4.28,
      w: 2.22,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: index === 3 ? C.ink : C.white,
      align: "center",
    });
    if (index < chain.length - 1) addArrow(slide, x + 2.76, 4.02, 0.18, C.red);
  });
  rect(slide, 1.36, 5.72, 10.62, 0.72, C.white, C.white, 0.05);
  addText(slide, "Después de la pausa: auditar el producto real sin inventar evidencia ni requisitos.", {
    x: 1.66,
    y: 5.72,
    w: 10.02,
    h: 0.72,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 51 · Apertura del Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 3 · 30 MINUTOS", {
    x: M, y: 0.82, w: 4.8, h: 0.24,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.8,
  });
  addText(slide, "Auditar sin", {
    x: M, y: 1.48, w: 7.2, h: 0.74,
    fontFace: TYPOGRAPHY.display, fontSize: 42, bold: true, color: C.white,
  });
  addText(slide, "inventar evidencia", {
    x: M, y: 2.2, w: 9.4, h: 0.78,
    fontFace: TYPOGRAPHY.display, fontSize: 42, bold: true, color: C.gold,
  });
  addText(slide, "El objetivo no es llenar nueve casillas: es sostener cada afirmación con un alcance, un criterio y evidencia que otra persona pueda revisar.", {
    x: M, y: 3.28, w: 7.35, h: 1.02,
    fontSize: 19, color: C.softBlue, lineSpacingMultiple: 1.08,
  });
  rect(slide, 8.62, 1.42, 3.74, 3.88, C.titleFill, C.titleFill, 0.08);
  addText(slide, "UNA CONCLUSIÓN VÁLIDA", {
    x: 9.02, y: 1.82, w: 2.94, h: 0.22,
    fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 1.2,
  });
  [
    ["01", "declara el límite", C.red],
    ["02", "cita lo observado", C.gold],
    ["03", "reconoce lo pendiente", C.success],
  ].forEach((item, index) => {
    const y = 2.38 + index * 0.83;
    addCircleLabel(slide, 9.08, y, 0.46, item[2], item[0], {
      fontSize: 9, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 9.78, y, w: 1.9, h: 0.46,
      fontSize: 15.5, bold: true, color: C.white, valign: "mid",
    });
  });
  rect(slide, M, 5.72, 11.64, 0.68, C.white, C.white, 0.05);
  addText(slide, "Producto real → evidencia real → conclusión proporcional", {
    x: 1.08, y: 5.72, w: 10.92, h: 0.68,
    fontSize: 17, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 52 · Ruta de auditoría */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · Método", "Seis movimientos convierten observaciones en hallazgos", "Cada paso limita el siguiente: si la base es débil, la conclusión también lo será.");
  const route = [
    ["1", "ALCANCE", "qué producto y contexto", C.red],
    ["2", "INVENTARIO", "qué existe y se ejecuta", C.gold],
    ["3", "ESTADO", "cuánto demuestra", C.success],
    ["4", "HALLAZGO", "qué puede afirmarse", CYAN],
    ["5", "REVISIÓN", "qué razonamiento falla", C.red],
    ["6", "CONCLUSIÓN", "qué queda abierto", C.navy],
  ];
  route.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = M + col * 4.08;
    const y = CONTENT_TOP + row * 1.74;
    rect(slide, x, y, 3.62, 1.34, row === 0 ? C.white : C.warm, C.border, 0.06);
    rect(slide, x, y, 0.12, 1.34, item[3], item[3]);
    addCircleLabel(slide, x + 0.32, y + 0.24, 0.5, item[3], item[0], {
      fontSize: 11, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.02, y: y + 0.2, w: 2.25, h: 0.22,
      fontSize: 11, bold: true, color: onPaper(item[3]), charSpacing: 0.8,
    });
    addText(slide, item[2], {
      x: x + 1.02, y: y + 0.56, w: 2.22, h: 0.44,
      fontSize: 15.2, bold: true, color: C.ink,
    });
    if (col < 2) addArrow(slide, x + 3.72, y + 0.43, 0.22, C.border);
  });
  slide.addShape(SH.line, {
    x: 12.04, y: 3.8, w: 0, h: 0.38,
    line: { color: C.red, pt: 2.2, beginArrowType: "none", endArrowType: "triangle" },
  });
  addText(slide, "La auditoría avanza, pero también puede volver atrás cuando descubre una decisión faltante.", {
    x: 2.08, y: 6.18, w: 9.2, h: 0.42,
    fontSize: 15.2, bold: true, color: C.navy, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 53 · El alcance como frontera */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Delimitar", "El alcance separa el producto real del producto imaginado", "Evaluar bien comienza por declarar qué existe hoy y qué todavía no forma parte de la solución.");
  rect(slide, 0.94, 2.62, 7.12, 3.42, C.white, C.navy, 0.08);
  addText(slide, "DENTRO DEL MARCO", {
    x: 1.28, y: 2.92, w: 2.72, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.3,
  });
  addText(slide, "Calculadora local\nde nota final", {
    x: 1.28, y: 3.42, w: 4.7, h: 1.02,
    fontFace: TYPOGRAPHY.display, fontSize: 29, bold: true, color: C.ink,
  });
  addText(slide, "Python · uv · función nota_final · pruebas y análisis estático", {
    x: 1.28, y: 4.76, w: 5.96, h: 0.58,
    fontSize: 15.2, color: C.slate,
  });
  addStatusPill(slide, 5.86, 3.22, 1.7, "OBSERVABLE", C.success, { fontSize: 10.5 });
  const outside = ["interfaz visual", "autenticación", "persistencia", "integraciones"];
  outside.forEach((label, index) => {
    const y = 2.78 + index * 0.8;
    rect(slide, 8.64, y, 3.6, 0.6, C.warm, C.warm, 0.05);
    addText(slide, label, {
      x: 9.0, y, w: 2.84, h: 0.6,
      fontSize: 15, bold: true, color: C.slate, valign: "mid",
    });
    addText(slide, "—", {
      x: 8.34, y, w: 0.22, h: 0.6,
      fontSize: 16, bold: true, color: C.red, valign: "mid",
    });
  });
  addText(slide, "FUERA DEL ALCANCE ACTUAL", {
    x: 8.64, y: 6.08, w: 3.6, h: 0.24,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 1.1,
  });
  validateSlide(slide, pptx);
}

/* 54 · Ficha de alcance real */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Delimitar", "Una ficha breve evita que la auditoría cambie de producto", "Estas seis decisiones fijan el objeto observado antes de emitir cualquier juicio.");
  rect(slide, M, CONTENT_TOP, 4.06, 3.92, C.navy, C.navy, 0.07);
  addText(slide, "PRODUCTO", {
    x: 1.08, y: 2.82, w: 1.5, h: 0.2,
    fontSize: 10, bold: true, color: C.gold, charSpacing: 1.2,
  });
  addText(slide, "Calculadora local\nde nota final", {
    x: 1.08, y: 3.32, w: 3.18, h: 0.94,
    fontFace: TYPOGRAPHY.display, fontSize: 27, bold: true, color: C.white,
  });
  addText(slide, "Usuario actual", {
    x: 1.08, y: 4.64, w: 1.42, h: 0.22,
    fontSize: 10.5, bold: true, color: C.softBlue,
  });
  addText(slide, "Estudiante o docente que ejecuta Python", {
    x: 1.08, y: 5.02, w: 3.14, h: 0.72,
    fontSize: 15.2, bold: true, color: C.white,
  });
  const facts = [
    ["ENTRADA", "list[float]", C.red],
    ["SALIDA", "float con un decimal", C.gold],
    ["REGLA", "Promedio + ROUND_HALF_UP", C.success],
    ["ENTORNO", "Proyecto administrado con uv", CYAN],
    ["CONTROLES", "Ruff · Pyrefly · pytest", C.red],
  ];
  facts.forEach((item, index) => {
    const y = 2.52 + index * 0.75;
    addText(slide, item[0], {
      x: 5.2, y: y + 0.06, w: 1.28, h: 0.2,
      fontSize: 9.5, bold: true, color: onPaper(item[2]), charSpacing: 0.9,
    });
    rule(slide, 6.58, y + 0.32, 0.52, item[2], 2.2);
    addText(slide, item[1], {
      x: 7.34, y, w: 4.84, h: 0.42,
      fontSize: 16, bold: true, color: C.ink, valign: "mid",
    });
    if (index < facts.length - 1) rule(slide, 5.2, y + 0.6, 6.98, C.border, 0.8);
  });
  validateSlide(slide, pptx);
}

/* 55 · Decisiones faltantes */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Delimitar", "No decidido no significa irrelevante", "La auditoría conserva las preguntas abiertas sin fingir respuestas para completar el estándar.");
  rect(slide, M, 2.56, 7.18, 3.74, C.white, C.border, 0.07);
  addText(slide, "TODAVÍA POR DEFINIR", {
    x: 1.06, y: 2.88, w: 2.58, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.25,
  });
  const undecided = [
    "¿Qué ocurre con una lista vacía?",
    "¿Qué rangos de notas son válidos?",
    "¿Cuánto volumen y tiempo se toleran?",
    "¿Con qué sistemas o formatos se integrará?",
    "¿Habrá interfaz, identidades o persistencia?",
  ];
  undecided.forEach((text, index) => {
    const y = 3.36 + index * 0.52;
    addCircleLabel(slide, 1.06, y, 0.3, index === 4 ? C.gold : C.navy, "?", {
      fontSize: 10, color: index === 4 ? C.ink : C.white,
    });
    addText(slide, text, {
      x: 1.56, y: y - 0.02, w: 5.86, h: 0.34,
      fontSize: 14.3, bold: true, color: C.ink, valign: "mid",
    });
  });
  rect(slide, 8.34, 2.56, 4.28, 1.52, C.navy, C.navy, 0.07);
  addText(slide, "CORRECTO", {
    x: 8.72, y: 2.88, w: 1.18, h: 0.2,
    fontSize: 10.5, bold: true, color: C.success, charSpacing: 1.1,
  });
  addText(slide, "Registrar la decisión faltante", {
    x: 8.72, y: 3.28, w: 3.18, h: 0.42,
    fontSize: 18, bold: true, color: C.white,
  });
  rect(slide, 8.34, 4.34, 4.28, 1.96, C.warm, C.warm, 0.07);
  addText(slide, "INCORRECTO", {
    x: 8.72, y: 4.7, w: 1.44, h: 0.2,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.1,
  });
  addText(slide, "Inventar una regla para marcar la característica como cumplida", {
    x: 8.72, y: 5.12, w: 3.18, h: 0.78,
    fontSize: 17, bold: true, color: C.ink,
  });
  validateSlide(slide, pptx);
}

/* 56 · Primer artefacto */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Registrar", "El alcance queda escrito antes de abrir el juicio", "Un archivo breve convierte acuerdos implícitos en una referencia revisable.");
  rect(slide, 0.92, 2.56, 7.86, 3.8, C.navy, C.navy, 0.06);
  rect(slide, 0.92, 2.56, 7.86, 0.48, "244462", "244462", 0.06);
  addText(slide, "auditoria-calidad.md", {
    x: 1.2, y: 2.56, w: 3.26, h: 0.48,
    fontFace: TYPOGRAPHY.mono, fontSize: 11, bold: true, color: C.white, valign: "mid",
  });
  const code = [
    ["# Auditoría inicial de calidad", C.gold],
    ["## Alcance", CYAN_ON_NAVY],
    ["- Producto: calculadora local de nota final.", C.white],
    ["- Contexto: ejecución local en Python mediante uv.", C.white],
    ["- Regla: promedio con un decimal y ROUND_HALF_UP.", C.white],
    ["- Fuera de alcance: interfaz, persistencia,", C.softBlue],
    ["  autenticación e integración externa.", C.softBlue],
  ];
  code.forEach((line, index) => {
    addText(slide, line[0], {
      x: 1.3, y: 3.28 + index * 0.39, w: 6.96, h: 0.26,
      fontFace: TYPOGRAPHY.mono, fontSize: 12.2, bold: index < 2, color: line[1],
    });
  });
  addText(slide, "¿QUÉ RESUELVE?", {
    x: 9.34, y: 2.8, w: 2.56, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.2,
  });
  [
    ["01", "Mantiene estable el objeto evaluado"],
    ["02", "Hace visibles los límites"],
    ["03", "Evita conclusiones sobre funciones inexistentes"],
  ].forEach((item, index) => {
    const y = 3.36 + index * 0.92;
    addCircleLabel(slide, 9.34, y, 0.46, index === 1 ? C.gold : C.red, item[0], {
      fontSize: 9, color: index === 1 ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 10.04, y: y - 0.02, w: 2.34, h: 0.58,
      fontSize: 14.3, bold: true, color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 57 · Inventario antes de interpretar */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Inventariar", "Primero se observa; después se interpreta", "Separar ambos momentos reduce el sesgo de buscar solo aquello que confirma una opinión previa.");
  rect(slide, 0.96, 2.64, 4.4, 3.42, C.navy, C.navy, 0.08);
  addCircleLabel(slide, 1.34, 3.02, 0.56, C.red, "1", { fontSize: 13 });
  addText(slide, "OBSERVAR", {
    x: 2.14, y: 3.08, w: 1.72, h: 0.22,
    fontSize: 11, bold: true, color: C.gold, charSpacing: 1.2,
  });
  addText(slide, "Archivos, configuración, código, pruebas y salidas de comandos.", {
    x: 1.34, y: 3.76, w: 3.62, h: 1.2,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: C.white,
  });
  addText(slide, "Hechos reproducibles", {
    x: 1.34, y: 5.34, w: 3.1, h: 0.28,
    fontSize: 14, bold: true, color: C.softBlue,
  });
  addArrow(slide, 5.72, 4.02, 0.44, C.red);
  rect(slide, 6.5, 2.64, 5.86, 3.42, C.white, C.border, 0.08);
  addCircleLabel(slide, 6.92, 3.02, 0.56, C.gold, "2", { fontSize: 13, color: C.ink });
  addText(slide, "INTERPRETAR", {
    x: 7.72, y: 3.08, w: 2.06, h: 0.22,
    fontSize: 11, bold: true, color: ACCENT_ON_PAPER[C.gold], charSpacing: 1.2,
  });
  addText(slide, "Riesgo, criterio, estado de evidencia y conclusión permitida.", {
    x: 6.92, y: 3.76, w: 4.82, h: 1.16,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: C.ink,
  });
  addText(slide, "Razonamiento proporcional", {
    x: 6.92, y: 5.34, w: 3.52, h: 0.28,
    fontSize: 14, bold: true, color: C.slate,
  });
  validateSlide(slide, pptx);
}

/* 58 · Leer los artefactos */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Inventariar", "Cuatro lecturas muestran de qué producto estamos hablando", "Los archivos revelan entorno, regla implementada y casos de comportamiento existentes.");
  addTerminalPanel(slide, SH, {
    x: M, y: 2.62, w: 7.62, h: 3.78,
    title: "PowerShell · inspección del proyecto",
    fontSize: 13.2,
    lines: [
      { prompt: ">", text: "Get-ChildItem" },
      { text: "notas.py   test_notas.py   pyproject.toml   uv.lock" },
      { prompt: ">", text: "Get-Content .\\pyproject.toml" },
      { prompt: ">", text: "Get-Content .\\notas.py" },
      { prompt: ">", text: "Get-Content .\\test_notas.py" },
    ],
  });
  const layers = [
    ["ENTORNO", "pyproject.toml + uv.lock", C.gold],
    ["IMPLEMENTACIÓN", "notas.py", C.red],
    ["COMPORTAMIENTO", "test_notas.py", C.success],
  ];
  layers.forEach((item, index) => {
    const y = 2.78 + index * 1.08;
    rect(slide, 8.78, y, 3.84, 0.82, index === 1 ? C.navy : C.white, index === 1 ? C.navy : C.border, 0.06);
    addText(slide, item[0], {
      x: 9.1, y: y + 0.14, w: 2.86, h: 0.18,
      fontSize: 9.5, bold: true, color: item[2], charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: 9.1, y: y + 0.4, w: 3.08, h: 0.24,
      fontFace: TYPOGRAPHY.mono, fontSize: 12.2, bold: true,
      color: index === 1 ? C.white : C.ink,
    });
  });
  rect(slide, 8.78, 6.0, 3.84, 0.4, C.warm, C.warm, 0.04);
  addText(slide, "Leer no es todavía aprobar.", {
    x: 9.04, y: 6.0, w: 3.32, h: 0.4,
    fontSize: 13.4, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 59 · Ejecutar los controles */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Inventariar", "La evidencia ejecutable se vuelve a producir", "Una salida actual y repetible vale más que el recuerdo de que el proyecto funcionó alguna vez.");
  addTerminalPanel(slide, SH, {
    x: 0.78, y: 2.58, w: 8.1, h: 3.92,
    title: "PowerShell · controles actuales",
    fontSize: 12.7,
    lines: [
      { prompt: ">", text: "uv lock --check" },
      { text: "Resolved lockfile is current" },
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "0 errors" },
      { prompt: ">", text: "uv run pytest -q" },
      { text: "4 passed" },
    ],
  });
  addText(slide, "CUATRO SEÑALES", {
    x: 9.38, y: 2.76, w: 2.62, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.2,
  });
  [
    ["LOCK", "entorno coherente", C.gold],
    ["RUFF", "reglas habilitadas", C.red],
    ["TYPES", "sin contradicciones", CYAN],
    ["TESTS", "4 casos ejecutados", C.success],
  ].forEach((item, index) => {
    const y = 3.24 + index * 0.72;
    addStatusPill(slide, 9.38, y, 1.0, item[0], item[2], {
      fontSize: 9.2, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 10.62, y, w: 1.74, h: 0.44,
      fontSize: 13.2, bold: true, color: C.ink, valign: "mid",
    });
  });
  addText(slide, "Las salidas prueban algo concreto; todavía no prueban la calidad completa.", {
    x: 9.38, y: 6.06, w: 2.98, h: 0.52,
    fontSize: 13.2, bold: true, color: C.slate, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 60 · Libro mayor de evidencia */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Inventariar", "Siete identificadores convierten señales en evidencia citable", "Cada ID apunta a un archivo o una ejecución que puede localizarse y repetirse.");
  const evidence = [
    ["E1", "ENTORNO", "pyproject.toml + uv.lock", C.gold],
    ["E2", "REGLA", "notas.py", C.red],
    ["E3", "CASOS", "test_notas.py · 4 ejemplos", C.success],
    ["E4", "LOCK", "uv lock --check · correcto", CYAN],
    ["E5", "ESTILO", "Ruff · sin infracciones habilitadas", C.red],
    ["E6", "TIPOS", "Pyrefly · sin contradicciones", C.gold],
    ["E7", "EJECUCIÓN", "pytest · 4 passed", C.success],
  ];
  evidence.forEach((item, index) => {
    const col = index < 4 ? 0 : 1;
    const row = col === 0 ? index : index - 4;
    const x = col === 0 ? M : 6.78;
    const y = 2.5 + row * 0.89;
    const w = col === 0 ? 5.7 : 5.84;
    rect(slide, x, y, w, 0.68, index === 2 || index === 6 ? C.navy : C.white, index === 2 || index === 6 ? C.navy : C.border, 0.05);
    addStatusPill(slide, x + 0.18, y + 0.12, 0.62, item[0], item[3], {
      h: 0.44, fontSize: 10, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.04, y: y + 0.12, w: 1.1, h: 0.18,
      fontSize: 9.2, bold: true, color: item[3], charSpacing: 0.8,
    });
    addText(slide, item[2], {
      x: x + 2.2, y: y + 0.12, w: w - 2.44, h: 0.44,
      fontSize: 13.4, bold: true,
      color: index === 2 || index === 6 ? C.white : C.ink, valign: "mid",
    });
  });
  rect(slide, 6.78, 5.34, 5.84, 0.72, C.warm, C.warm, 0.05);
  addText(slide, "Los IDs describen procedencia; el estado dirá cuánto demuestra cada evidencia.", {
    x: 7.12, y: 5.34, w: 5.16, h: 0.72,
    fontSize: 14.2, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  addText(slide, "INVENTARIO = evidencia disponible, no veredicto final", {
    x: 1.48, y: 6.28, w: 10.38, h: 0.32,
    fontSize: 15, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 61 · Trazabilidad */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Trazar", "Un hallazgo debe poder seguirse hasta su origen", "La diferencia está entre una impresión vaga y una cadena que otra persona puede verificar.");
  rect(slide, 0.88, 2.66, 3.4, 2.8, C.warm, C.warm, 0.07);
  addText(slide, "AFIRMACIÓN VAGA", {
    x: 1.2, y: 3.0, w: 2.72, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 1.1,
  });
  addText(slide, "“Hay pruebas y\nfunciona bien”", {
    x: 1.28, y: 3.62, w: 2.62, h: 0.9,
    fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.slate, align: "center",
  });
  rule(slide, 1.28, 4.82, 2.6, C.red, 3);
  addText(slide, "No permite revisar qué casos ni qué ejecución.", {
    x: 1.28, y: 5.68, w: 2.62, h: 0.54,
    fontSize: 13.3, bold: true, color: C.slate, align: "center",
  });
  addArrow(slide, 4.66, 3.82, 0.46, C.red);
  rect(slide, 5.46, 2.66, 7.02, 3.58, C.white, C.border, 0.07);
  addText(slide, "CADENA REVISABLE", {
    x: 5.86, y: 3.0, w: 2.7, h: 0.22,
    fontSize: 10.2, bold: true, color: C.success, charSpacing: 1.1,
  });
  const chain = [
    ["E3", "4 casos descritos", C.success],
    ["E7", "4 casos ejecutados", C.gold],
    ["HALLAZGO", "resultado limitado a esos casos", C.navy],
  ];
  chain.forEach((item, index) => {
    const x = 5.86 + index * 2.1;
    rect(slide, x, 3.58, 1.82, 1.42, index === 2 ? C.navy : C.warm, index === 2 ? C.navy : C.warm, 0.06);
    addText(slide, item[0], {
      x: x + 0.2, y: 3.84, w: 1.42, h: 0.2,
      fontSize: 10, bold: true, color: item[2], align: "center", charSpacing: 0.6,
    });
    addText(slide, item[1], {
      x: x + 0.18, y: 4.22, w: 1.46, h: 0.5,
      fontSize: 13, bold: true, color: index === 2 ? C.white : C.ink, align: "center",
    });
    if (index < chain.length - 1) addArrow(slide, x + 1.88, 4.04, 0.16, C.border);
  });
  addText(slide, "Archivo + salida + límite de la conclusión", {
    x: 6.1, y: 5.54, w: 5.72, h: 0.34,
    fontSize: 15, bold: true, color: C.ink, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 62 · Estados de evidencia */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Calificar", "Cuatro estados describen cuánto sabemos", "No son notas de aprobación: indican la relación entre criterio, evidencia y decisión pendiente.");
  addText(slide, "¿EL CRITERIO ESTÁ DEFINIDO?", {
    x: 0.84, y: 2.64, w: 2.7, h: 0.42,
    fontSize: 12, bold: true, color: C.navy, align: "center",
  });
  addArrow(slide, 3.68, 2.62, 0.38, C.red);
  rect(slide, 4.42, 2.46, 2.4, 0.76, C.navy, C.navy, 0.06);
  addText(slide, "NO", {
    x: 4.72, y: 2.46, w: 0.5, h: 0.76,
    fontSize: 13, bold: true, color: C.gold, align: "center", valign: "mid",
  });
  addText(slide, "POR DEFINIR", {
    x: 5.28, y: 2.46, w: 1.24, h: 0.76,
    fontSize: 13.5, bold: true, color: C.white, align: "center", valign: "mid",
  });
  rect(slide, 4.42, 3.5, 2.4, 0.76, C.white, C.border, 0.06);
  addText(slide, "SÍ", {
    x: 4.72, y: 3.5, w: 0.5, h: 0.76,
    fontSize: 13, bold: true, color: C.success, align: "center", valign: "mid",
  });
  addText(slide, "evaluar evidencia", {
    x: 5.28, y: 3.5, w: 1.24, h: 0.76,
    fontSize: 12.5, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  slide.addShape(SH.line, {
    x: 6.86, y: 3.88, w: 1.08, h: 0,
    line: { color: C.red, pt: 2.2, endArrowType: "triangle" },
  });
  const states = [
    ["DIRECTA", "observa el criterio formulado", C.success],
    ["PARCIAL", "se relaciona, pero no cubre todo", C.gold],
    ["AUSENTE", "no se encontró evidencia pertinente", C.red],
  ];
  states.forEach((item, index) => {
    const y = 2.44 + index * 1.18;
    rect(slide, 8.18, y, 4.34, 0.92, index === 0 ? C.navy : C.white, index === 0 ? C.navy : C.border, 0.06);
    addStatusPill(slide, 8.42, y + 0.22, 1.2, item[0], item[2], {
      h: 0.48, fontSize: 9.4, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 9.88, y: y + 0.01, w: 2.34, h: 0.9,
      fontSize: 13.2, bold: true, color: index === 0 ? C.white : C.ink, valign: "mid",
    });
  });
  rect(slide, 1.42, 5.56, 5.54, 0.72, C.warm, C.warm, 0.05);
  addText(slide, "El estado califica la evidencia, no la característica completa.", {
    x: 1.74, y: 5.56, w: 4.9, h: 0.72,
    fontSize: 14.5, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 63 · Criterio directo, característica parcial */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Interpretar", "Evidencia directa no equivale a característica aprobada", "La evidencia puede ser fuerte y, al mismo tiempo, tener un alcance deliberadamente estrecho.");
  slide.addShape(SH.ellipse, {
    x: 1.0, y: 2.54, w: 4.22, h: 3.54,
    fill: { color: C.warm }, line: { color: C.border, pt: 1.2 },
  });
  addText(slide, "ADECUACIÓN FUNCIONAL", {
    x: 1.58, y: 2.98, w: 3.06, h: 0.26,
    fontSize: 11, bold: true, color: C.red, align: "center", charSpacing: 1.0,
  });
  addText(slide, "muchos criterios,\nrangos y casos", {
    x: 1.58, y: 3.58, w: 3.06, h: 0.78,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: C.ink, align: "center",
  });
  slide.addShape(SH.ellipse, {
    x: 2.2, y: 4.62, w: 1.82, h: 0.92,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  addText(slide, "1 criterio\nobservado", {
    x: 2.2, y: 4.62, w: 1.82, h: 0.92,
    fontSize: 13, bold: true, color: C.white, align: "center", valign: "mid",
  });
  addArrow(slide, 5.6, 3.98, 0.48, C.red);
  rect(slide, 6.44, 2.62, 5.8, 1.34, C.navy, C.navy, 0.07);
  addStatusPill(slide, 6.78, 3.0, 1.28, "DIRECTA", C.success, { fontSize: 10 });
  addText(slide, "para ese criterio específico", {
    x: 8.36, y: 2.62, w: 3.42, h: 1.34,
    fontSize: 19, bold: true, color: C.white, valign: "mid",
  });
  rect(slide, 6.44, 4.28, 5.8, 1.7, C.white, C.border, 0.07);
  addText(slide, "NO DEMUESTRA TODAVÍA", {
    x: 6.82, y: 4.62, w: 2.48, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, charSpacing: 1.0,
  });
  addText(slide, "todos los rangos · entradas inválidas · combinaciones posibles", {
    x: 6.82, y: 5.04, w: 4.9, h: 0.54,
    fontSize: 15.5, bold: true, color: C.ink,
  });
  validateSlide(slide, pptx);
}

/* 64 · Ejemplo: adecuación funcional */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Ejemplo guiado", "Adecuación: una cadena completa para un caso límite", "El estado se justifica mostrando riesgo, criterio, evidencia y límite de la conclusión.");
  const steps = [
    ["RIESGO", "3,9 se redondea distinto\nde lo esperado", C.red],
    ["CRITERIO", "[3.8, 4.1, 3.95]\ndebe producir 4.0", C.gold],
    ["EVIDENCIA", "E3 describe el caso\nE7 confirma su ejecución", C.success],
  ];
  steps.forEach((item, index) => {
    const x = 0.84 + index * 4.12;
    rect(slide, x, 2.62, 3.6, 1.82, index === 2 ? C.navy : C.white, index === 2 ? C.navy : C.border, 0.07);
    addText(slide, item[0], {
      x: x + 0.3, y: 2.92, w: 2.96, h: 0.2,
      fontSize: 10.2, bold: true, color: item[2], align: "center", charSpacing: 1,
    });
    addText(slide, item[1], {
      x: x + 0.28, y: 3.42, w: 3.04, h: 0.64,
      fontSize: 16, bold: true, color: index === 2 ? C.white : C.ink, align: "center",
    });
    if (index < 2) addArrow(slide, x + 3.72, 3.28, 0.22, C.red);
  });
  rect(slide, 1.12, 4.84, 5.08, 1.24, C.navy, C.navy, 0.07);
  addStatusPill(slide, 1.48, 5.22, 1.24, "DIRECTA", C.success, { fontSize: 10 });
  addText(slide, "Conclusión permitida", {
    x: 3.0, y: 5.08, w: 2.68, h: 0.22,
    fontSize: 10.2, bold: true, color: C.gold, charSpacing: 0.8,
  });
  addText(slide, "ese caso satisface la regla conocida", {
    x: 3.0, y: 5.46, w: 2.68, h: 0.34,
    fontSize: 14.5, bold: true, color: C.white,
  });
  rect(slide, 6.48, 4.84, 5.74, 1.24, C.warm, C.warm, 0.07);
  addText(slide, "VACÍOS QUE PERMANECEN", {
    x: 6.86, y: 5.12, w: 2.56, h: 0.2,
    fontSize: 10.2, bold: true, color: C.red, charSpacing: 0.9,
  });
  addText(slide, "otros rangos · entradas inválidas · más combinaciones", {
    x: 6.86, y: 5.5, w: 4.88, h: 0.34,
    fontSize: 14.5, bold: true, color: C.ink,
  });
  validateSlide(slide, pptx);
}

/* 65 · Ejemplo: mantenibilidad */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Ejemplo guiado", "Mantenibilidad: varias señales aún no prueban el cambio", "La estructura ayuda a razonar, pero falta observar una modificación real y su impacto.");
  addText(slide, "SEÑALES DISPONIBLES", {
    x: 0.92, y: 2.66, w: 2.82, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, charSpacing: 1.1,
  });
  const signals = [
    ["E2", "regla localizada", C.red],
    ["E3", "pruebas descriptivas", C.success],
    ["E5", "estructura revisada", C.gold],
    ["E6", "tipos coherentes", CYAN],
  ];
  signals.forEach((item, index) => {
    const y = 3.16 + index * 0.68;
    addStatusPill(slide, 0.92, y, 0.72, item[0], item[2], {
      fontSize: 9.8, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 1.88, y, w: 2.66, h: 0.44,
      fontSize: 14.2, bold: true, color: C.ink, valign: "mid",
    });
  });
  slide.addShape(SH.arc, {
    x: 4.82, y: 3.08, w: 2.46, h: 2.46,
    adjustPoint: 0.22,
    rotate: 25,
    fill: { color: C.warm, transparency: 100 },
    line: { color: C.gold, pt: 7, beginArrowType: "none", endArrowType: "none" },
  });
  addText(slide, "EVIDENCIA\nINCOMPLETA", {
    x: 5.12, y: 3.8, w: 1.86, h: 0.64,
    fontSize: 13.3, bold: true, color: ACCENT_ON_PAPER[C.gold], align: "center",
  });
  rect(slide, 7.72, 2.64, 4.7, 1.42, C.navy, C.navy, 0.07);
  addStatusPill(slide, 8.06, 3.1, 1.22, "PARCIAL", C.gold, { fontSize: 10, color: C.ink });
  addText(slide, "La base facilita el cambio", {
    x: 9.58, y: 2.64, w: 2.36, h: 1.42,
    fontSize: 17, bold: true, color: C.white, valign: "mid",
  });
  rect(slide, 7.72, 4.38, 4.7, 1.68, C.white, C.border, 0.07);
  addText(slide, "FALTA OBSERVAR", {
    x: 8.1, y: 4.72, w: 1.92, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, charSpacing: 1.0,
  });
  addText(slide, "un cambio controlado en la regla y el impacto que produce", {
    x: 8.1, y: 5.16, w: 3.82, h: 0.58,
    fontSize: 15.3, bold: true, color: C.ink,
  });
  validateSlide(slide, pptx);
}

/* 66 · Selección enfocada */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Auditar", "Tres características bastan para razonar con profundidad", "La selección cubre valor, confianza y cambio; el trabajo es individual y queda documentado.");
  const families = [
    ["01", "VALOR Y RESPUESTA", "¿Entrega el resultado esperado?", "Adecuación · eficiencia · compatibilidad · interacción", C.red],
    ["02", "USO Y CONFIANZA", "¿Se sostiene y protege su contexto?", "Fiabilidad · seguridad · seguridad operacional", C.gold],
    ["03", "CAMBIO", "¿Puede evolucionar sin perder control?", "Mantenibilidad · flexibilidad", C.success],
  ];
  families.forEach((item, index) => {
    const x = 0.82 + index * 4.16;
    const dark = index === 1;
    rect(slide, x, 2.58, 3.74, 3.58, dark ? C.navy : C.white, dark ? C.navy : C.border, 0.08);
    addCircleLabel(slide, x + 0.34, 2.94, 0.54, item[4], item[0], {
      fontSize: 10.5, color: item[4] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.12, y: 3.04, w: 2.18, h: 0.22,
      fontSize: 10.3, bold: true, color: item[4], charSpacing: 0.8,
    });
    addText(slide, item[2], {
      x: x + 0.34, y: 3.7, w: 3.06, h: 0.82,
      fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true,
      color: dark ? C.white : C.ink, align: "center",
    });
    rule(slide, x + 0.64, 4.84, 2.46, dark ? C.softBlue : C.border, 1.1);
    addText(slide, item[3], {
      x: x + 0.42, y: 5.14, w: 2.9, h: 0.64,
      fontSize: 12.8, bold: true, color: dark ? C.softBlue : C.slate, align: "center",
    });
  });
  addText(slide, "Elige una de cada familia y construye un hallazgo trazable.", {
    x: 2.02, y: 6.34, w: 9.3, h: 0.34,
    fontSize: 15.5, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 67 · Anatomía del hallazgo */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Documentar", "Cada hallazgo conserva el razonamiento completo", "La plantilla impide saltar desde una señal aislada hasta una conclusión demasiado amplia.");
  rect(slide, 1.0, 2.5, 8.06, 3.94, C.white, C.border, 0.06);
  rect(slide, 1.0, 2.5, 8.06, 0.58, C.navy, C.navy, 0.06);
  addText(slide, "### Característica: [nombre]", {
    x: 1.34, y: 2.5, w: 4.22, h: 0.58,
    fontFace: TYPOGRAPHY.mono, fontSize: 14, bold: true, color: C.white, valign: "mid",
  });
  const rows = [
    ["RIESGO", "¿qué podría fallar?", C.red],
    ["CRITERIO", "regla conocida o decisión faltante", C.gold],
    ["EVIDENCIA", "IDs E1–E7 pertinentes", C.success],
    ["ESTADO", "DIRECTA · PARCIAL · AUSENTE · POR DEFINIR", CYAN],
    ["FALTA", "qué evidencia permitiría avanzar", C.red],
    ["CONCLUSIÓN", "qué se permite afirmar ahora", C.navy],
  ];
  rows.forEach((item, index) => {
    const y = 3.24 + index * 0.48;
    addText(slide, item[0], {
      x: 1.34, y, w: 1.22, h: 0.2,
      fontSize: 9.3, bold: true, color: onPaper(item[2]), charSpacing: 0.7,
    });
    addText(slide, item[1], {
      x: 2.78, y: y - 0.04, w: 5.68, h: 0.3,
      fontSize: 13.5, bold: true, color: C.ink,
    });
    if (index < rows.length - 1) rule(slide, 1.34, y + 0.34, 7.12, C.border, 0.7);
  });
  const logic = [
    ["1", "pregunta", C.red],
    ["2", "observa", C.gold],
    ["3", "limita", C.success],
  ];
  logic.forEach((item, index) => {
    const y = 2.86 + index * 1.08;
    addCircleLabel(slide, 9.74, y, 0.5, item[2], item[0], {
      fontSize: 11, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 10.5, y, w: 1.72, h: 0.5,
      fontSize: 15.5, bold: true, color: C.ink, valign: "mid",
    });
  });
  rect(slide, 9.5, 6.0, 2.88, 0.44, C.warm, C.warm, 0.04);
  addText(slide, "Sin saltos lógicos", {
    x: 9.76, y: 6.0, w: 2.36, h: 0.44,
    fontSize: 13.2, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 68 · Línea base de las nueve características */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Contrastar", "La línea base muestra evidencia desigual, no nueve veredictos", "Después de los tres hallazgos, este mapa permite reconocer dónde hay señales y dónde falta contexto.", false, { titleFontSize: 27 });
  const baseline = [
    ["Adecuación", "DIRECTA", "4 casos; faltan entradas inválidas", C.success],
    ["Eficiencia", "AUSENTE", "sin volumen ni tiempo definidos", C.red],
    ["Compatibilidad", "POR DEFINIR", "sin sistemas o formatos declarados", C.navy],
    ["Interacción", "AUSENTE", "una función no es interfaz de usuario", C.red],
    ["Fiabilidad", "PARCIAL", "casos válidos; faltan fallos y recuperación", C.gold],
    ["Seguridad", "POR DEFINIR", "sin identidades, permisos o persistencia", C.navy],
    ["Mantenibilidad", "PARCIAL", "estructura y controles; falta cambio real", C.gold],
    ["Flexibilidad", "PARCIAL", "entorno reconstruible; falta escala", C.gold],
    ["Seg. operacional", "POR DEFINIR", "falta contexto de daño y uso", C.navy],
  ];
  baseline.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = M + col * 4.12;
    const y = 2.46 + row * 1.28;
    const dark = item[1] === "POR DEFINIR";
    rect(slide, x, y, 3.7, 1.04, dark ? C.navy : C.white, dark ? C.navy : C.border, 0.05);
    addText(slide, item[0], {
      x: x + 0.24, y: y + 0.18, w: 1.72, h: 0.2,
      fontSize: 11.8, bold: true, color: dark ? C.white : C.ink,
    });
    addStatusPill(slide, x + 2.02, y + 0.12, 1.42, item[1], item[3], {
      h: 0.34, fontSize: 7.8, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[2], {
      x: x + 0.24, y: y + 0.56, w: 3.18, h: 0.32,
      fontSize: 10.8, bold: true, color: dark ? C.softBlue : C.slate,
    });
  });
  addText(slide, "Los estados se asignan a la evidencia disponible para criterios concretos.", {
    x: 2.08, y: 6.46, w: 9.16, h: 0.3,
    fontSize: 14.4, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 69 · Por definir abre una conversación */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Interpretar", "“Por definir” señala la fuente de verdad que falta", "No elimina el riesgo: indica que todavía no conocemos el criterio correcto para evaluarlo.");
  rect(slide, 0.92, 2.62, 3.12, 2.84, C.warm, C.warm, 0.07);
  addText(slide, "LECTURA INCORRECTA", {
    x: 1.24, y: 2.98, w: 2.48, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 1.0,
  });
  addText(slide, "“No hay que\npensarlo”", {
    x: 1.38, y: 3.62, w: 2.2, h: 0.78,
    fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.slate, align: "center",
  });
  rule(slide, 1.36, 4.74, 2.24, C.red, 3);
  addArrow(slide, 4.42, 3.7, 0.44, C.red);
  rect(slide, 5.24, 2.62, 7.12, 3.7, C.navy, C.navy, 0.07);
  addText(slide, "LECTURA ÚTIL", {
    x: 5.66, y: 2.98, w: 1.72, h: 0.22,
    fontSize: 10.2, bold: true, color: C.gold, charSpacing: 1.0,
  });
  const pathItems = [
    ["1", "Identificar la decisión faltante", C.red],
    ["2", "Consultar a la fuente adecuada", C.gold],
    ["3", "Formular un criterio comprobable", C.success],
    ["4", "Recién entonces buscar evidencia", CYAN],
  ];
  pathItems.forEach((item, index) => {
    const y = 3.54 + index * 0.58;
    addCircleLabel(slide, 5.68, y, 0.34, item[2], item[0], {
      fontSize: 9, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 6.26, y: y - 0.02, w: 5.26, h: 0.36,
      fontSize: 14.3, bold: true, color: C.white, valign: "mid",
    });
  });
  addText(slide, "Ejemplo · Sin usuarios, datos persistidos ni permisos declarados, la seguridad necesita contexto antes de un veredicto.", {
    x: 5.78, y: 5.76, w: 5.88, h: 0.48,
    fontSize: 11.4, bold: true, color: C.softBlue, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 70 · Revisión adversarial con agente */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.5 · Revisar", "El agente busca saltos lógicos; no completa la auditoría", "Se usa después del análisis humano y recibe alcance, inventario y tres hallazgos ya redactados.");
  rect(slide, 0.8, 2.54, 7.18, 3.94, C.navy, C.navy, 0.07);
  rect(slide, 0.8, 2.54, 7.18, 0.48, "244462", "244462", 0.07);
  addText(slide, "prompt · auditor adversarial", {
    x: 1.12, y: 2.54, w: 3.24, h: 0.48,
    fontFace: TYPOGRAPHY.mono, fontSize: 10.8, bold: true, color: C.white, valign: "mid",
  });
  const promptLines = [
    "Revisa estos hallazgos como auditor adversarial.",
    "Para cada uno identifica:",
    "a) una conclusión más amplia que la evidencia;",
    "b) una característica mal asociada; o",
    "c) una decisión inventada por falta de contexto.",
    "No propongas funciones ni marques características",
    "como aprobadas. Si el razonamiento es proporcional,",
    "indica «sin observación» y explica por qué.",
  ];
  promptLines.forEach((line, index) => {
    addText(slide, line, {
      x: 1.18, y: 3.22 + index * 0.36, w: 6.42, h: 0.24,
      fontFace: TYPOGRAPHY.mono, fontSize: 11.2,
      bold: index === 0, color: index === 0 ? C.gold : C.white,
    });
  });
  addText(slide, "TRES RESULTADOS POSIBLES", {
    x: 8.52, y: 2.72, w: 3.54, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 1.0,
  });
  [
    ["ACEPTADA", "corrige el hallazgo", C.success],
    ["RECHAZADA", "no corresponde al alcance", C.red],
    ["SIN OBSERVACIÓN", "razonamiento proporcional", C.gold],
  ].forEach((item, index) => {
    const y = 3.26 + index * 0.98;
    rect(slide, 8.42, y, 4.04, 0.76, index === 0 ? C.navy : C.white, index === 0 ? C.navy : C.border, 0.06);
    addStatusPill(slide, 8.68, y + 0.16, 1.44, item[0], item[2], {
      h: 0.44, fontSize: 8.6, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 10.36, y, w: 1.76, h: 0.76,
      fontSize: 12.5, bold: true, color: index === 0 ? C.white : C.ink, valign: "mid",
    });
  });
  addText(slide, "La decisión final vuelve a archivos, comandos, alcance y reglas conocidas.", {
    x: 8.58, y: 6.2, w: 3.72, h: 0.42,
    fontSize: 12.8, bold: true, color: C.slate, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 71 · Conclusión proporcional */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.6 · Concluir", "Una conclusión sólida también declara lo que no sabe", "Dos frases obligan a mantener la afirmación dentro del alcance observado.");
  rect(slide, 0.88, 2.58, 5.62, 3.5, C.navy, C.navy, 0.08);
  addText(slide, "PODEMOS AFIRMAR", {
    x: 1.28, y: 2.96, w: 2.42, h: 0.22,
    fontSize: 10.5, bold: true, color: C.success, charSpacing: 1.1,
  });
  addText(slide, "El proyecto es reproducible en el entorno declarado y nota_final satisface cuatro casos, incluidos dos límites de redondeo.", {
    x: 1.28, y: 3.52, w: 4.76, h: 1.44,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.white,
  });
  addText(slide, "E1 · E3 · E4 · E7", {
    x: 1.28, y: 5.46, w: 3.36, h: 0.24,
    fontFace: TYPOGRAPHY.mono, fontSize: 12.5, bold: true, color: C.gold,
  });
  rect(slide, 6.84, 2.58, 5.62, 3.5, C.white, C.border, 0.08);
  addText(slide, "TODAVÍA NO PODEMOS AFIRMAR", {
    x: 7.24, y: 2.96, w: 3.52, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.0,
  });
  const unknowns = [
    "que cubre todas las entradas",
    "que cumple objetivos de rendimiento",
    "que ofrece una interacción adecuada",
    "que protege datos o resiste fallos",
  ];
  unknowns.forEach((item, index) => {
    const y = 3.48 + index * 0.52;
    addText(slide, "—", {
      x: 7.26, y, w: 0.24, h: 0.32,
      fontSize: 15, bold: true, color: C.red,
    });
    addText(slide, item, {
      x: 7.7, y, w: 4.08, h: 0.34,
      fontSize: 15, bold: true, color: C.ink,
    });
  });
  addText(slide, "La segunda mitad no debilita la auditoría: la hace confiable.", {
    x: 7.26, y: 5.58, w: 4.76, h: 0.34,
    fontSize: 13.5, bold: true, color: C.slate, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 72 · La auditoría es una fotografía */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.6 · Mantener", "La conclusión es una fotografía, no una sentencia eterna", "Cuando aparecen requisitos, pruebas o mediciones nuevas, la auditoría se actualiza.");
  rule(slide, 1.34, 4.2, 10.56, C.border, 2.4);
  const moments = [
    [1.34, "HOY", "4 pruebas\nregla conocida", C.red],
    [4.7, "PRÓXIMA EVIDENCIA", "rangos válidos\ny lista vacía", C.gold],
    [8.06, "NUEVA MEDICIÓN", "volumen y\ntiempo objetivo", C.success],
    [11.44, "REVISIÓN", "conclusión\nactualizada", CYAN],
  ];
  moments.forEach((item, index) => {
    addCircleLabel(slide, item[0] - 0.28, 3.92, 0.56, item[3], index + 1, {
      fontSize: 11, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: item[0] - 0.92, y: index % 2 === 0 ? 2.74 : 4.62, w: 1.84, h: 0.22,
      fontSize: 9.6, bold: true, color: onPaper(item[3]), align: "center", charSpacing: 0.7,
    });
    addText(slide, item[2], {
      x: item[0] - 1.12, y: index % 2 === 0 ? 3.08 : 5.02, w: 2.24, h: 0.58,
      fontSize: 14, bold: true, color: C.ink, align: "center",
    });
  });
  rect(slide, 2.06, 6.04, 9.2, 0.5, C.navy, C.navy, 0.05);
  addText(slide, "PROVISIONAL = válida con la evidencia actual y abierta a revisión", {
    x: 2.42, y: 6.04, w: 8.48, h: 0.5,
    fontSize: 14.5, bold: true, color: C.white, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 73 · Punto de control del Bloque 3 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · Punto de control", "La auditoría inicial queda lista cuando resiste estas cinco preguntas", "Cada marca debe poder localizarse en auditoria-calidad.md y en la evidencia citada.", false, { titleFontSize: 27 });
  const checks = [
    ["ALCANCE", "Producto, contexto, regla y límites explícitos", C.red],
    ["INVENTARIO", "Siete evidencias con IDs trazables", C.gold],
    ["HALLAZGOS", "Tres características con estado justificado", C.success],
    ["REVISIÓN", "Una observación aceptada y otra rechazada con razón", CYAN],
    ["CONCLUSIÓN", "Distingue lo demostrado de lo todavía abierto", C.navy],
  ];
  checks.forEach((item, index) => {
    const y = 2.46 + index * 0.74;
    addCircleLabel(slide, 0.86, y + 0.04, 0.5, item[2], "✓", {
      fontSize: 13, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 1.62, y: y + 0.1, w: 1.56, h: 0.2,
      fontSize: 10.2, bold: true, color: onPaper(item[2]), charSpacing: 0.8,
    });
    rect(slide, 3.38, y, 8.94, 0.58, index === 4 ? C.navy : C.white, index === 4 ? C.navy : C.border, 0.05);
    addText(slide, item[1], {
      x: 3.72, y, w: 8.24, h: 0.58,
      fontSize: 14.7, bold: true, color: index === 4 ? C.white : C.ink, valign: "mid",
    });
  });
  rect(slide, 2.22, 6.28, 8.9, 0.46, C.warm, C.warm, 0.04);
  addText(slide, "Si una respuesta depende de una suposición no declarada, el hallazgo todavía no está listo.", {
    x: 2.56, y: 6.28, w: 8.22, h: 0.46,
    fontSize: 13.8, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 74 · Preguntas guía del Bloque 3 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · Preguntas", "Tres preguntas para defender la auditoría", "La pista orienta el razonamiento sin reemplazar la respuesta.");
  const questions = [
    [
      "¿Por qué POR DEFINIR es distinto de AUSENTE?",
      "Compara no encontrar una prueba para un criterio conocido con todavía no saber cuál es el criterio correcto.",
      C.red,
    ],
    [
      "¿Cuándo una evidencia puede ser DIRECTA sin aprobar toda la característica?",
      "Reduce la afirmación a un criterio específico y revisa si el artefacto realmente lo observa.",
      C.gold,
    ],
    [
      "¿Qué aporta un agente usado como auditor adversarial?",
      "Busca contradicciones, asociaciones débiles y conclusiones más amplias que los archivos o comandos citados.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = CONTENT_TOP + index * 1.46;
    addCircleLabel(slide, M, y + 0.1, 0.58, item[2], index + 1, {
      fontSize: 13, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 1.62, y, w: 11.0, h: 0.62,
      fontSize: 18, bold: true, color: C.ink,
    });
    rect(slide, 1.62, y + 0.7, 11.0, 0.5, C.warm, C.warm, 0.04);
    rect(slide, 1.62, y + 0.7, 0.08, 0.5, item[2], item[2]);
    addText(slide, "PISTA", {
      x: 1.86, y: y + 0.7, w: 0.8, h: 0.5,
      fontSize: 9.4, bold: true, color: C.red, charSpacing: 1, valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.76, y: y + 0.7, w: 9.7, h: 0.5,
      fontSize: 13.2, color: C.ink, valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 75 · Cierre del Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · BLOQUE 3", {
    x: M, y: 0.84, w: 4.4, h: 0.22,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.7,
  });
  addText(slide, "Auditar es conectar", {
    x: M, y: 1.42, w: 8.7, h: 0.68,
    fontFace: TYPOGRAPHY.display, fontSize: 38, bold: true, color: C.white,
  });
  addText(slide, "sin ampliar la evidencia", {
    x: M, y: 2.12, w: 9.7, h: 0.72,
    fontFace: TYPOGRAPHY.display, fontSize: 36, bold: true, color: C.gold,
  });
  const formula = [
    ["ALCANCE", "limita", C.red],
    ["CRITERIO", "enfoca", C.gold],
    ["EVIDENCIA", "sostiene", C.success],
    ["REVISIÓN", "tensiona", CYAN_ON_NAVY],
    ["CONCLUSIÓN", "declara", C.red],
  ];
  formula.forEach((item, index) => {
    const x = 0.72 + index * 2.49;
    rect(slide, x, 3.42, 2.18, 1.34, index === 4 ? C.white : C.titleFill, index === 4 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.18, y: 3.72, w: 1.82, h: 0.2,
      fontSize: 9.4, bold: true, color: item[2], align: "center", charSpacing: 0.7,
    });
    addText(slide, item[1], {
      x: x + 0.18, y: 4.12, w: 1.82, h: 0.28,
      fontSize: 14.5, bold: true, color: index === 4 ? C.ink : C.white, align: "center",
    });
    if (index < formula.length - 1) addArrow(slide, x + 2.24, 3.86, 0.14, C.red);
  });
  rect(slide, 1.42, 5.62, 10.5, 0.78, C.white, C.white, 0.05);
  addText(slide, "Siguiente: transformar los vacíos relevantes en criterios verificables, sin pedirle al agente que invente reglas ni umbrales.", {
    x: 1.78, y: 5.62, w: 9.78, h: 0.78,
    fontSize: 15.2, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 76 · Apertura del Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 4 · 25 MINUTOS", {
    x: M, y: 0.82, w: 4.8, h: 0.24,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.8,
  });
  addText(slide, "De un vacío", {
    x: M, y: 1.46, w: 7.2, h: 0.76,
    fontFace: TYPOGRAPHY.display, fontSize: 42, bold: true, color: C.white,
  });
  addText(slide, "a un criterio verificable", {
    x: M, y: 2.2, w: 10.2, h: 0.82,
    fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: C.gold,
  });
  addText(slide, "La auditoría mostró qué falta. Ahora una fuente autorizada debe definir qué se espera antes de diseñar la evidencia.", {
    x: M, y: 3.34, w: 7.34, h: 0.96,
    fontSize: 19, color: C.softBlue, lineSpacingMultiple: 1.06,
  });
  const ladder = [
    ["VACÍO", "pregunta abierta", C.red],
    ["BRIEF", "decisión autorizada", C.gold],
    ["CRITERIO", "expectativa observable", C.success],
    ["EVIDENCIA", "comprobación planificada", CYAN_ON_NAVY],
  ];
  ladder.forEach((item, index) => {
    const y = 1.52 + index * 1.08;
    const x = 8.66 + index * 0.3;
    rect(slide, x, y, 3.34 - index * 0.3, 0.78, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.26, y: y + 0.16, w: 1.12, h: 0.18,
      fontSize: 9.4, bold: true, color: item[2], charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: x + 1.36, y, w: 1.62 - index * 0.12, h: 0.78,
      fontSize: 12.8, bold: true, color: index === 3 ? C.ink : C.white, valign: "mid",
    });
  });
  rect(slide, M, 5.8, 11.66, 0.64, C.white, C.white, 0.05);
  addText(slide, "Priorizar no es adivinar: es dirigir evidencia hacia riesgos autorizados por el contexto.", {
    x: 1.08, y: 5.8, w: 10.92, h: 0.64,
    fontSize: 16, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 77 · El vacío no decide */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.1 · Autorizar", "Detectar un vacío no autoriza a elegir la respuesta", "El equipo técnico descubre la pregunta; la necesidad del producto define el comportamiento correcto.");
  rect(slide, 0.94, 2.64, 4.16, 3.42, C.white, C.border, 0.07);
  addText(slide, "HALLAZGO TÉCNICO", {
    x: 1.34, y: 3.0, w: 2.74, h: 0.22,
    fontSize: 10.3, bold: true, color: C.red, charSpacing: 1.0,
  });
  addText(slide, "[] no está\ncubierto", {
    x: 1.34, y: 3.58, w: 3.02, h: 0.92,
    fontFace: TYPOGRAPHY.display, fontSize: 30, bold: true, color: C.ink,
  });
  addText(slide, "La evidencia actual no describe ese comportamiento.", {
    x: 1.34, y: 5.12, w: 3.12, h: 0.54,
    fontSize: 14.2, bold: true, color: C.slate,
  });
  addArrow(slide, 5.46, 3.9, 0.46, C.red);
  const guesses = [
    ["0.0", "¿valor por defecto?", C.gold],
    ["None", "¿ausencia de resultado?", CYAN],
    ["ValueError", "¿entrada inválida?", C.success],
  ];
  guesses.forEach((item, index) => {
    const y = 2.72 + index * 1.04;
    rect(slide, 6.28, y, 5.92, 0.82, index === 2 ? C.navy : C.warm, index === 2 ? C.navy : C.warm, 0.06);
    addStatusPill(slide, 6.56, y + 0.18, 1.34, item[0], item[2], {
      h: 0.46, mono: true, fontSize: 11, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 8.2, y, w: 3.5, h: 0.82,
      fontSize: 16, bold: true, color: index === 2 ? C.white : C.ink, valign: "mid",
    });
  });
  rect(slide, 6.28, 5.92, 5.92, 0.46, C.warm, C.warm, 0.04);
  addText(slide, "Sin una fuente de verdad, las tres opciones son suposiciones.", {
    x: 6.58, y: 5.92, w: 5.32, h: 0.46,
    fontSize: 13.4, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 78 · Brief de la iteración: reglas del cálculo */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.1 · Fuente de verdad", "El brief autoriza las reglas de esta iteración", "Estas decisiones convierten preguntas abiertas en expectativas que sí podemos especificar.", true);
  addText(slide, "BRIEF DEL PRODUCTO · ITERACIÓN 1", {
    x: 0.92, y: 2.58, w: 4.0, h: 0.24,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.2,
  });
  const rules = [
    ["1", "USO", "Cálculo local del promedio de un curso", C.red],
    ["2", "ENTRADA", "Entre 1 y 60 notas · rango 1.0 a 7.0", C.gold],
    ["3", "RESULTADO", "Un decimal · ROUND_HALF_UP", C.success],
    ["4", "ERROR", "Lista vacía o nota fuera de rango → ValueError", CYAN_ON_NAVY],
  ];
  rules.forEach((item, index) => {
    const y = 3.06 + index * 0.8;
    addCircleLabel(slide, 0.94, y + 0.04, 0.48, item[3], item[0], {
      fontSize: 10.5, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 1.7, y: y + 0.06, w: 1.22, h: 0.18,
      fontSize: 9.5, bold: true, color: item[3], charSpacing: 0.8,
    });
    rect(slide, 3.16, y, 8.82, 0.56, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.05);
    addText(slide, item[2], {
      x: 3.48, y, w: 8.16, h: 0.56,
      fontSize: 16, bold: true, color: index === 3 ? C.ink : C.white, valign: "mid",
    });
  });
  addText(slide, "El brief no describe una idea deseable: fija el comportamiento que esta versión debe respetar.", {
    x: 1.56, y: 6.38, w: 10.22, h: 0.34,
    fontSize: 14.6, bold: true, color: C.softBlue, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 79 · Brief de la iteración: mensaje, límites y cambio */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.1 · Fuente de verdad", "El mismo brief también limita responsabilidades", "Lo que queda fuera no se convierte en requisito por entusiasmo técnico ni por sugerencia del agente.", true);
  rect(slide, 0.88, 2.54, 3.82, 3.62, C.titleFill, C.titleFill, 0.07);
  addCircleLabel(slide, 1.22, 2.9, 0.5, C.red, "5", { fontSize: 11 });
  addText(slide, "MENSAJE CONTROLADO", {
    x: 1.98, y: 3.02, w: 2.24, h: 0.22,
    fontSize: 10, bold: true, color: C.red, charSpacing: 0.7,
  });
  addText(slide, "El error indica qué condición no se cumplió.", {
    x: 1.22, y: 3.68, w: 3.1, h: 0.82,
    fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: C.white,
  });
  addText(slide, "No basta con fallar: el comportamiento debe ser comprensible.", {
    x: 1.22, y: 5.08, w: 3.0, h: 0.58,
    fontSize: 13.5, bold: true, color: C.softBlue,
  });
  rect(slide, 4.98, 2.54, 3.42, 3.62, C.white, C.white, 0.07);
  addCircleLabel(slide, 5.32, 2.9, 0.5, C.gold, "6", { fontSize: 11, color: C.ink });
  addText(slide, "FUERA DE ESTA ITERACIÓN", {
    x: 6.08, y: 3.02, w: 1.94, h: 0.22,
    fontSize: 9.7, bold: true, color: C.red, charSpacing: 0.6,
  });
  ["interfaz", "archivos y red", "usuarios y permisos", "persistencia"].forEach((item, index) => {
    const y = 3.62 + index * 0.5;
    addText(slide, "—", {
      x: 5.38, y, w: 0.22, h: 0.28,
      fontSize: 14, bold: true, color: C.red,
    });
    addText(slide, item, {
      x: 5.78, y, w: 2.02, h: 0.3,
      fontSize: 13.8, bold: true, color: C.ink,
    });
  });
  rect(slide, 8.68, 2.54, 3.78, 3.62, C.titleFill, C.titleFill, 0.07);
  addCircleLabel(slide, 9.02, 2.9, 0.5, C.success, "7", { fontSize: 11 });
  addText(slide, "CONDICIÓN DE CAMBIO", {
    x: 9.78, y: 3.02, w: 2.14, h: 0.22,
    fontSize: 10, bold: true, color: C.success, charSpacing: 0.7,
  });
  addText(slide, "Todo cambio conserva Ruff, Pyrefly y pytest en verde.", {
    x: 9.02, y: 3.68, w: 3.04, h: 0.84,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.white,
  });
  addText(slide, "La regla modificada queda expresada por una prueba descriptiva.", {
    x: 9.02, y: 5.04, w: 3.0, h: 0.6,
    fontSize: 13.5, bold: true, color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 80 · El brief actualiza el mapa */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.1 · Actualizar", "El brief mueve algunos temas; otros permanecen fuera", "Una decisión autorizada cambia el alcance sin convertir cada característica en prioridad inmediata.");
  addText(slide, "ANTES DEL BRIEF", {
    x: 0.9, y: 2.66, w: 2.24, h: 0.22,
    fontSize: 10.3, bold: true, color: C.red, charSpacing: 1.0,
  });
  rect(slide, 0.9, 3.14, 3.26, 2.66, C.warm, C.warm, 0.07);
  addStatusPill(slide, 1.28, 3.54, 1.5, "POR DEFINIR", C.navy, { fontSize: 9.4 });
  addText(slide, "lista vacía\nrango válido\nmensaje de error", {
    x: 1.28, y: 4.24, w: 2.5, h: 0.98,
    fontSize: 18, bold: true, color: C.slate, align: "center",
  });
  addArrow(slide, 4.54, 4.12, 0.48, C.red);
  rect(slide, 5.36, 2.64, 3.62, 3.18, C.navy, C.navy, 0.07);
  addText(slide, "AHORA ESPECIFICABLE", {
    x: 5.78, y: 3.02, w: 2.78, h: 0.22,
    fontSize: 10.3, bold: true, color: C.gold, align: "center", charSpacing: 0.8,
  });
  addText(slide, "1–60 notas\n1.0–7.0\nValueError + mensaje", {
    x: 5.78, y: 3.76, w: 2.78, h: 1.2,
    fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: C.white, align: "center",
  });
  addStatusPill(slide, 6.24, 5.22, 1.86, "CRITERIO POSIBLE", C.success, { fontSize: 9.2 });
  addArrow(slide, 9.34, 4.12, 0.4, C.border);
  rect(slide, 10.06, 3.14, 2.46, 2.66, C.white, C.border, 0.07);
  addText(slide, "SIGUE FUERA", {
    x: 10.4, y: 3.54, w: 1.78, h: 0.2,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "autenticación\nintegración\ninterfaz", {
    x: 10.38, y: 4.14, w: 1.82, h: 0.86,
    fontSize: 16, bold: true, color: C.slate, align: "center",
  });
  addText(slide, "No disfrazar como requisito actual", {
    x: 10.32, y: 5.26, w: 1.94, h: 0.38,
    fontSize: 10.8, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 81 · Filtro de prioridad */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.1 · Priorizar", "Tres preguntas filtran los riesgos de esta iteración", "La prioridad se justifica con contexto, consecuencia y vacío de evidencia; no con una puntuación inventada.");
  const questions = [
    ["1", "CONTEXTO", "¿El brief confirma que esta propiedad forma parte de la iteración?", C.red],
    ["2", "IMPACTO", "¿Qué consecuencia tendría incumplirla para el cálculo o quien lo utiliza?", C.gold],
    ["3", "VACÍO", "¿La evidencia actual puede detectarla o todavía falta una señal relevante?", C.success],
  ];
  questions.forEach((item, index) => {
    const x = 0.86 + index * 4.14;
    const y = 2.62 + index * 0.18;
    rect(slide, x, y, 3.66, 2.96, index === 1 ? C.navy : C.white, index === 1 ? C.navy : C.border, 0.08);
    addCircleLabel(slide, x + 0.34, y + 0.34, 0.56, item[3], item[0], {
      fontSize: 12, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.12, y: y + 0.48, w: 1.9, h: 0.2,
      fontSize: 10, bold: true, color: item[3], charSpacing: 1.0,
    });
    addText(slide, item[2], {
      x: x + 0.38, y: y + 1.2, w: 2.9, h: 1.1,
      fontFace: TYPOGRAPHY.display, fontSize: 19.5, bold: true,
      color: index === 1 ? C.white : C.ink, align: "center",
    });
  });
  rect(slide, 2.02, 6.14, 9.28, 0.5, C.warm, C.warm, 0.04);
  addText(slide, "Priorizar = dirigir primero la evidencia hacia los riesgos actuales.", {
    x: 2.38, y: 6.14, w: 8.56, h: 0.5,
    fontSize: 14.6, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 82 · Tres prioridades justificadas */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.1 · Priorizar", "Tres prioridades emergen del brief, no del gusto", "Cada una responde a una regla explícita y a un riesgo que la evidencia debe confrontar.", true);
  const priorities = [
    ["ADECUACIÓN", "Valores válidos y cálculo correcto", "reglas 2–3", C.red],
    ["FIABILIDAD", "Errores controlados y comprensibles", "reglas 4–5", C.gold],
    ["MANTENIBILIDAD", "Cambios con controles y prueba descriptiva", "regla 7", C.success],
  ];
  priorities.forEach((item, index) => {
    const x = 0.82 + index * 4.14;
    const y = 2.64 + (index === 1 ? 0.32 : 0);
    rect(slide, x, y, 3.68, 2.9, index === 1 ? C.white : C.titleFill, index === 1 ? C.white : C.titleFill, 0.08);
    addStatusPill(slide, x + 0.36, y + 0.34, 1.66, item[0], item[3], {
      fontSize: 9, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 0.36, y: y + 1.12, w: 2.96, h: 0.92,
      fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true,
      color: index === 1 ? C.ink : C.white, align: "center",
    });
    addText(slide, item[2], {
      x: x + 0.36, y: y + 2.36, w: 2.96, h: 0.24,
      fontFace: TYPOGRAPHY.mono, fontSize: 11.2, bold: true,
      color: index === 1 ? C.red : C.softBlue, align: "center",
    });
  });
  addText(slide, "Seguridad y compatibilidad no desaparecen: esta iteración simplemente no entrega contexto para priorizarlas.", {
    x: 1.38, y: 6.16, w: 10.58, h: 0.42,
    fontSize: 14.1, bold: true, color: C.softBlue, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 83 · Anatomía de un criterio */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.2 · Redactar", "Un criterio verificable conserva cinco piezas", "Si una pieza falta, otra persona tendrá que adivinar qué observar o por qué importa.", true);
  const parts = [
    ["ID", "QR-01", C.red],
    ["FUENTE", "Fiabilidad · brief 2, 4 y 5", C.gold],
    ["CONDICIÓN", "Dada una lista vacía", C.success],
    ["RESULTADO", "ValueError + mensaje explicativo", CYAN_ON_NAVY],
    ["EVIDENCIA", "Prueba automatizada con pytest", C.red],
  ];
  parts.forEach((item, index) => {
    const x = 0.74 + index * 2.52;
    const h = 1.5 + index * 0.18;
    const y = 5.62 - h;
    rect(slide, x, y, 2.18, h, index === 4 ? C.white : C.titleFill, index === 4 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.2, y: y + 0.28, w: 1.78, h: 0.2,
      fontSize: 9.4, bold: true, color: item[2], align: "center", charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: x + 0.18, y: y + 0.72, w: 1.82, h: h - 0.94,
      fontSize: index === 0 ? 20 : 13.4, bold: true,
      color: index === 4 ? C.ink : C.white, align: "center", valign: "mid",
    });
    if (index < parts.length - 1) addArrow(slide, x + 2.24, 4.5, 0.16, C.red);
  });
  rect(slide, 2.02, 6.02, 9.28, 0.54, C.white, C.white, 0.05);
  addText(slide, "Identificador + característica y fuente + condición + comportamiento + evidencia", {
    x: 2.34, y: 6.02, w: 8.64, h: 0.54,
    fontSize: 14.2, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 84 · Vago frente a verificable */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Comparar", "Una recomendación suena bien; un criterio puede fallar", "La verificabilidad aparece cuando la frase permite distinguir un resultado aceptable de uno rechazado.");
  rect(slide, 0.9, 2.64, 4.08, 3.2, C.warm, C.warm, 0.07);
  addText(slide, "VAGO", {
    x: 1.28, y: 3.0, w: 1.1, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.1,
  });
  addText(slide, "“La función debe\nser confiable”", {
    x: 1.3, y: 3.7, w: 3.22, h: 0.92,
    fontFace: TYPOGRAPHY.display, fontSize: 25, bold: true, color: C.slate, align: "center",
  });
  rule(slide, 1.46, 5.08, 2.9, C.red, 3);
  addText(slide, "No dice cuándo, qué debe ocurrir ni cómo observarlo.", {
    x: 1.42, y: 5.42, w: 2.98, h: 0.46,
    fontSize: 12.5, bold: true, color: C.slate, align: "center",
  });
  addArrow(slide, 5.34, 4.0, 0.46, C.red);
  rect(slide, 6.14, 2.46, 6.28, 3.76, C.navy, C.navy, 0.07);
  addText(slide, "VERIFICABLE · QR-01", {
    x: 6.56, y: 2.86, w: 2.56, h: 0.22,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 0.9,
  });
  const lines = [
    "Dada una lista vacía,",
    "al ejecutar nota_final([]),",
    "se debe producir ValueError",
    "con un mensaje que indique",
    "que se requiere al menos una nota.",
  ];
  lines.forEach((line, index) => {
    addText(slide, line, {
      x: 6.56, y: 3.42 + index * 0.42, w: 5.34, h: 0.28,
      fontFace: index === 1 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: 15.2, bold: index === 2, color: index === 2 ? C.success : C.white,
    });
  });
  addText(slide, "Evidencia · prueba automatizada con pytest", {
    x: 6.56, y: 5.72, w: 5.3, h: 0.24,
    fontSize: 11.8, bold: true, color: C.softBlue,
  });
  validateSlide(slide, pptx);
}

/* 85 · QR-01 completo */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.2 · Criterio modelo", "QR-01 convierte una regla en una expectativa ejecutable", "La conclusión futura podrá citar tanto la fuente como la prueba que confronta el comportamiento.", true);
  addStatusPill(slide, 0.92, 2.62, 1.22, "QR-01", C.red, { mono: true, fontSize: 11.2 });
  addText(slide, "FIABILIDAD", {
    x: 2.44, y: 2.72, w: 1.4, h: 0.2,
    fontSize: 10, bold: true, color: C.gold, charSpacing: 1.0,
  });
  addText(slide, "Brief · reglas 2, 4 y 5", {
    x: 4.44, y: 2.68, w: 2.72, h: 0.24,
    fontFace: TYPOGRAPHY.mono, fontSize: 11.4, bold: true, color: C.softBlue,
  });
  rect(slide, 0.92, 3.22, 7.42, 2.78, C.titleFill, C.titleFill, 0.07);
  addText(slide, "CONDICIÓN", {
    x: 1.32, y: 3.6, w: 1.4, h: 0.2,
    fontSize: 9.6, bold: true, color: C.success, charSpacing: 0.8,
  });
  addText(slide, "Dada una lista vacía, al ejecutar nota_final([])", {
    x: 1.32, y: 4.02, w: 6.52, h: 0.46,
    fontFace: TYPOGRAPHY.mono, fontSize: 15.5, bold: true, color: C.white,
  });
  rule(slide, 1.32, 4.72, 6.52, C.softBlue, 1.0);
  addText(slide, "COMPORTAMIENTO ESPERADO", {
    x: 1.32, y: 5.02, w: 2.72, h: 0.2,
    fontSize: 9.6, bold: true, color: C.red, charSpacing: 0.8,
  });
  addText(slide, "ValueError + mensaje: se requiere al menos una nota", {
    x: 1.32, y: 5.4, w: 6.5, h: 0.32,
    fontSize: 15.5, bold: true, color: C.white,
  });
  rect(slide, 8.68, 3.22, 3.72, 2.78, C.white, C.white, 0.07);
  addText(slide, "EVIDENCIA PLANIFICADA", {
    x: 9.06, y: 3.6, w: 2.96, h: 0.22,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "pytest", {
    x: 9.06, y: 4.18, w: 2.96, h: 0.48,
    fontFace: TYPOGRAPHY.mono, fontSize: 27, bold: true, color: C.ink, align: "center",
  });
  addText(slide, "La prueba debe fallar si no aparece la excepción o si el mensaje no explica la condición.", {
    x: 9.08, y: 4.92, w: 2.92, h: 0.66,
    fontSize: 13.1, bold: true, color: C.slate, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 86 · Criterio no es implementación */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Separar", "El criterio fija la expectativa, no la implementación", "Distintas soluciones técnicas pueden confrontarse con la misma prueba si respetan el mismo comportamiento.");
  rect(slide, 0.88, 2.62, 3.36, 3.34, C.navy, C.navy, 0.08);
  addText(slide, "EXPECTATIVA ESTABLE", {
    x: 1.26, y: 3.0, w: 2.6, h: 0.22,
    fontSize: 10.2, bold: true, color: C.gold, align: "center", charSpacing: 0.8,
  });
  addText(slide, "Entrada inválida\n→ ValueError", {
    x: 1.28, y: 3.78, w: 2.56, h: 0.86,
    fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.white, align: "center",
  });
  addText(slide, "La prueba observa el contrato visible.", {
    x: 1.3, y: 5.18, w: 2.52, h: 0.42,
    fontSize: 13, bold: true, color: C.softBlue, align: "center",
  });
  addArrow(slide, 4.6, 3.9, 0.42, C.red);
  const implementations = [
    ["A", "validación al inicio", C.red],
    ["B", "función auxiliar", C.gold],
    ["C", "objeto validador", C.success],
  ];
  implementations.forEach((item, index) => {
    const y = 2.72 + index * 1.04;
    rect(slide, 5.36 + index * 0.36, y, 6.62 - index * 0.36, 0.82, C.white, C.border, 0.06);
    addCircleLabel(slide, 5.68 + index * 0.36, y + 0.16, 0.5, item[2], item[0], {
      fontSize: 11, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 6.5 + index * 0.36, y, w: 3.5, h: 0.82,
      fontSize: 16, bold: true, color: C.ink, valign: "mid",
    });
    addStatusPill(slide, 10.22, y + 0.18, 1.32, "POSIBLE", C.navy, { h: 0.46, fontSize: 9.2 });
  });
  rect(slide, 5.72, 5.98, 6.26, 0.46, C.warm, C.warm, 0.04);
  addText(slide, "La especificación permite evaluar las tres sin imponer una de antemano.", {
    x: 6.04, y: 5.98, w: 5.62, h: 0.46,
    fontSize: 13.2, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 87 · QF-01 adecuación funcional */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.2 · Criterio de referencia", "QF-01 organiza el espacio válido del cálculo", "Un criterio amplio puede requerir varias pruebas si cada una aporta a una afirmación explícita.", true);
  addStatusPill(slide, 0.92, 2.62, 1.22, "QF-01", C.red, { mono: true, fontSize: 11.2 });
  addText(slide, "ADECUACIÓN FUNCIONAL · BRIEF 2 Y 3", {
    x: 2.46, y: 2.72, w: 4.34, h: 0.2,
    fontSize: 10, bold: true, color: C.gold, charSpacing: 0.8,
  });
  const axis = [
    ["1", "mínimo de notas", C.red],
    ["30", "partición media", C.gold],
    ["60", "máximo de notas", C.success],
  ];
  rule(slide, 1.36, 4.26, 6.52, C.softBlue, 2.2);
  axis.forEach((item, index) => {
    const x = 1.38 + index * 2.82;
    addCircleLabel(slide, x, 3.98, 0.56, item[2], item[0], {
      fontSize: 10.5, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x - 0.64, y: 4.76, w: 1.84, h: 0.36,
      fontSize: 12.4, bold: true, color: C.white, align: "center",
    });
  });
  addText(slide, "notas dentro de 1.0–7.0", {
    x: 2.4, y: 5.48, w: 4.42, h: 0.3,
    fontSize: 14.6, bold: true, color: C.softBlue, align: "center",
  });
  rect(slide, 9.24, 2.94, 3.18, 3.14, C.white, C.white, 0.07);
  addText(slide, "RESULTADO ESPERADO", {
    x: 9.56, y: 3.34, w: 2.54, h: 0.22,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "promedio con\nun decimal", {
    x: 9.56, y: 3.9, w: 2.54, h: 1.3,
    fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: C.ink, align: "center",
  });
  addStatusPill(slide, 9.74, 5.42, 2.18, "ROUND_HALF_UP", C.success, { mono: true, fontSize: 9.3 });
  validateSlide(slide, pptx);
}

/* 88 · QR-02 límites inválidos */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Criterio de referencia", "QR-02 convierte los límites inválidos en casos observables", "El criterio explicita tanto la excepción como la información que necesita quien utiliza la función.");
  rect(slide, 0.92, 2.64, 3.1, 3.26, C.warm, C.warm, 0.07);
  addText(slide, "LÍMITE INFERIOR", {
    x: 1.3, y: 3.02, w: 2.34, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "0.9", {
    x: 1.3, y: 3.72, w: 2.34, h: 0.66,
    fontFace: TYPOGRAPHY.mono, fontSize: 34, bold: true, color: C.ink, align: "center",
  });
  addStatusPill(slide, 1.56, 4.7, 1.82, "FUERA DE RANGO", C.red, { fontSize: 9 });
  addArrow(slide, 4.34, 3.96, 0.42, C.red);
  rect(slide, 5.1, 2.46, 3.2, 3.62, C.navy, C.navy, 0.07);
  addText(slide, "QR-02", {
    x: 5.48, y: 2.88, w: 2.44, h: 0.24,
    fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: C.gold, align: "center",
  });
  addText(slide, "ValueError", {
    x: 5.48, y: 3.64, w: 2.44, h: 0.48,
    fontFace: TYPOGRAPHY.mono, fontSize: 23, bold: true, color: C.white, align: "center",
  });
  addText(slide, "El mensaje identifica el rango permitido: 1.0 a 7.0", {
    x: 5.48, y: 4.54, w: 2.44, h: 0.78,
    fontSize: 14, bold: true, color: C.softBlue, align: "center",
  });
  addArrow(slide, 8.62, 3.96, 0.42, C.red);
  rect(slide, 9.38, 2.64, 3.1, 3.26, C.warm, C.warm, 0.07);
  addText(slide, "LÍMITE SUPERIOR", {
    x: 9.76, y: 3.02, w: 2.34, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "7.1", {
    x: 9.76, y: 3.72, w: 2.34, h: 0.66,
    fontFace: TYPOGRAPHY.mono, fontSize: 34, bold: true, color: C.ink, align: "center",
  });
  addStatusPill(slide, 10.02, 4.7, 1.82, "FUERA DE RANGO", C.red, { fontSize: 9 });
  addText(slide, "Evidencia · dos pruebas automatizadas, una por cada frontera", {
    x: 2.22, y: 6.28, w: 8.9, h: 0.32,
    fontSize: 14.5, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 89 · QM-01 mantenibilidad */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.2 · Criterio de referencia", "QM-01 define qué evidencia acompaña cada cambio", "La mantenibilidad no se declara por tener archivos ordenados: se observa en un cambio controlado.", true);
  addStatusPill(slide, 0.92, 2.62, 1.22, "QM-01", C.red, { mono: true, fontSize: 11.2 });
  addText(slide, "MANTENIBILIDAD · BRIEF 7", {
    x: 2.46, y: 2.72, w: 3.34, h: 0.2,
    fontSize: 10, bold: true, color: C.gold, charSpacing: 0.8,
  });
  rect(slide, 0.92, 3.28, 3.24, 2.66, C.titleFill, C.titleFill, 0.07);
  addText(slide, "CAMBIO", {
    x: 1.3, y: 3.66, w: 2.48, h: 0.22,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.9,
  });
  addText(slide, "regla de cálculo\nmodificada", {
    x: 1.3, y: 4.36, w: 2.48, h: 0.72,
    fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: C.white, align: "center",
  });
  addArrow(slide, 4.46, 4.22, 0.4, C.red);
  const controls = [
    ["RUFF", "verde", C.red],
    ["PYREFLY", "verde", C.gold],
    ["PYTEST", "verde", C.success],
  ];
  controls.forEach((item, index) => {
    const y = 3.28 + index * 0.9;
    rect(slide, 5.2, y, 3.14, 0.66, C.white, C.white, 0.05);
    addStatusPill(slide, 5.44, y + 0.12, 1.2, item[0], item[2], {
      h: 0.42, fontSize: 9, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 6.92, y, w: 1.06, h: 0.66,
      fontSize: 14, bold: true, color: C.ink, valign: "mid", align: "center",
    });
  });
  addArrow(slide, 8.68, 4.22, 0.4, C.red);
  rect(slide, 9.42, 3.28, 3.0, 2.66, C.white, C.white, 0.07);
  addText(slide, "TRAZA DEL CAMBIO", {
    x: 9.78, y: 3.68, w: 2.28, h: 0.22,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  addText(slide, "diff", {
    x: 9.78, y: 4.28, w: 2.28, h: 0.46,
    fontFace: TYPOGRAPHY.mono, fontSize: 26, bold: true, color: C.ink, align: "center",
  });
  addText(slide, "+ prueba descriptiva", {
    x: 9.78, y: 5.0, w: 2.28, h: 0.34,
    fontSize: 14, bold: true, color: C.slate, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 90 · Un criterio puede requerir varias evidencias */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Planificar", "Un criterio amplio puede necesitar varias evidencias", "La cobertura se construye con casos que observan fronteras y particiones distintas del mismo riesgo.");
  rect(slide, 0.92, 2.64, 3.42, 3.2, C.navy, C.navy, 0.07);
  addText(slide, "QF-01", {
    x: 1.3, y: 3.02, w: 2.66, h: 0.24,
    fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: C.gold, align: "center",
  });
  addText(slide, "1–60 notas válidas\n→ promedio correcto", {
    x: 1.3, y: 3.72, w: 2.66, h: 0.8,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.white, align: "center",
  });
  addText(slide, "Una afirmación", {
    x: 1.3, y: 5.14, w: 2.66, h: 0.24,
    fontSize: 13.2, bold: true, color: C.softBlue, align: "center",
  });
  const cases = [
    ["E1", "cantidad mínima", "1 nota", C.red],
    ["E2", "partición media", "varias notas", C.gold],
    ["E3", "cantidad máxima", "60 notas", C.success],
    ["E4", "redondeo límite", "ROUND_HALF_UP", CYAN],
  ];
  cases.forEach((item, index) => {
    const y = 2.56 + index * 0.86;
    rect(slide, 5.02 + index * 0.34, y, 7.34 - index * 0.34, 0.66, C.white, C.border, 0.05);
    addStatusPill(slide, 5.26 + index * 0.34, y + 0.11, 0.72, item[0], item[3], {
      h: 0.44, fontSize: 9.6, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 6.24 + index * 0.34, y, w: 2.24, h: 0.66,
      fontSize: 13.5, bold: true, color: C.ink, valign: "mid",
    });
    addText(slide, item[2], {
      x: 9.0, y, w: 2.72, h: 0.66,
      fontFace: TYPOGRAPHY.mono, fontSize: 12.4, bold: true, color: onPaper(item[3]), align: "right", valign: "mid",
    });
  });
  addText(slide, "La suite permite localizar qué parte del criterio dejó de sostenerse.", {
    x: 5.6, y: 6.22, w: 6.14, h: 0.34,
    fontSize: 14, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 91 · Solicitud restringida al agente */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.3 · Pedir alternativas", "El agente propone candidatos dentro de un contrato", "Recibe el brief, tres riesgos priorizados y un formato; no recibe permiso para ampliar el producto.", true);
  rect(slide, 0.84, 2.52, 8.08, 3.9, C.titleFill, C.titleFill, 0.07);
  rect(slide, 0.84, 2.52, 8.08, 0.48, "244462", "244462", 0.07);
  addText(slide, "prompt · criterios candidatos", {
    x: 1.16, y: 2.52, w: 3.16, h: 0.48,
    fontFace: TYPOGRAPHY.mono, fontSize: 10.8, bold: true, color: C.white, valign: "mid",
  });
  const prompt = [
    "A partir exclusivamente del brief, propón dos criterios",
    "candidatos para cada riesgo priorizado.",
    "Incluye: ID, característica ISO/IEC 25010:2023,",
    "reglas de origen, condición, resultado y evidencia.",
    "No inventes umbrales, interfaces ni responsabilidades",
    "fuera de alcance. Si no puede derivarse del brief,",
    "marca «requiere decisión».",
  ];
  prompt.forEach((line, index) => {
    addText(slide, line, {
      x: 1.24, y: 3.28 + index * 0.4, w: 7.22, h: 0.26,
      fontFace: TYPOGRAPHY.mono, fontSize: 11.7,
      bold: index === 0 || index === 5, color: index === 5 ? C.gold : C.white,
    });
  });
  addText(slide, "ENTRADAS CONTROLADAS", {
    x: 9.46, y: 2.76, w: 2.48, h: 0.22,
    fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.9,
  });
  [
    ["BRIEF", C.red],
    ["3 RIESGOS", C.gold],
    ["FORMATO", C.success],
  ].forEach((item, index) => {
    addStatusPill(slide, 9.68, 3.36 + index * 0.74, 2.06, item[0], item[1], {
      h: 0.5, fontSize: 10, color: item[1] === C.gold ? C.ink : C.white,
    });
  });
  addText(slide, "SALIDA", {
    x: 9.46, y: 5.72, w: 2.48, h: 0.2,
    fontSize: 10, bold: true, color: CYAN_ON_NAVY, align: "center", charSpacing: 0.9,
  });
  addText(slide, "alternativas auditables", {
    x: 9.46, y: 6.02, w: 2.48, h: 0.34,
    fontSize: 14.5, bold: true, color: C.white, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 92 · Límite de autoridad del agente */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.3 · Delimitar", "El agente amplía alternativas, no la autoridad del brief", "Su utilidad está en explorar formulaciones; la decisión sigue anclada a reglas explícitas.");
  rect(slide, 0.88, 2.62, 5.42, 3.52, C.navy, C.navy, 0.08);
  addText(slide, "SÍ PUEDE", {
    x: 1.28, y: 3.0, w: 1.54, h: 0.22,
    fontSize: 10.5, bold: true, color: C.success, charSpacing: 1.0,
  });
  [
    "proponer dos formulaciones",
    "detectar una condición omitida",
    "sugerir evidencia coherente",
    "marcar «requiere decisión»",
  ].forEach((item, index) => {
    const y = 3.54 + index * 0.54;
    addCircleLabel(slide, 1.28, y, 0.34, C.success, "✓", { fontSize: 9.5 });
    addText(slide, item, {
      x: 1.84, y: y - 0.02, w: 3.8, h: 0.36,
      fontSize: 14.5, bold: true, color: C.white,
    });
  });
  rect(slide, 6.66, 2.62, 5.78, 3.52, C.white, C.border, 0.08);
  addText(slide, "NO PUEDE", {
    x: 7.06, y: 3.0, w: 1.68, h: 0.22,
    fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.0,
  });
  [
    "decidir que [] devuelve 0.0",
    "ampliar el rango permitido",
    "agregar autenticación",
    "marcar una característica aprobada",
  ].forEach((item, index) => {
    const y = 3.54 + index * 0.54;
    addCircleLabel(slide, 7.06, y, 0.34, C.red, "×", { fontSize: 11 });
    addText(slide, item, {
      x: 7.62, y: y - 0.02, w: 4.12, h: 0.36,
      fontSize: 14.5, bold: true, color: C.ink,
    });
  });
  addText(slide, "Más opciones no equivalen a más requisitos.", {
    x: 3.06, y: 6.4, w: 7.22, h: 0.34,
    fontSize: 15.2, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 93 · Diversidad de alternativas */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.3 · Evaluar alternativas", "Seis frases no sirven si cubren el mismo riesgo", "Una respuesta extensa puede repetir la misma idea con otras palabras y producir una falsa sensación de cobertura.", true);
  addText(slide, "REPETICIÓN SUPERFICIAL", {
    x: 0.92, y: 2.66, w: 3.04, h: 0.22,
    fontSize: 10.2, bold: true, color: C.red, charSpacing: 0.9,
  });
  const duplicates = ["calcular bien", "promedio correcto", "resultado exacto"];
  duplicates.forEach((item, index) => {
    rect(slide, 0.92 + index * 0.34, 3.24 + index * 0.56, 4.24, 0.7, C.titleFill, C.titleFill, 0.05);
    addText(slide, item, {
      x: 1.28 + index * 0.34, y: 3.24 + index * 0.56, w: 3.52, h: 0.7,
      fontSize: 16, bold: true, color: C.white, align: "center", valign: "mid",
    });
  });
  addText(slide, "1 riesgo con 3 sinónimos", {
    x: 1.54, y: 5.54, w: 3.4, h: 0.3,
    fontSize: 13.5, bold: true, color: C.softBlue, align: "center",
  });
  addArrow(slide, 5.74, 4.16, 0.42, C.red);
  addText(slide, "COBERTURA ÚTIL", {
    x: 6.5, y: 2.66, w: 2.62, h: 0.22,
    fontSize: 10.2, bold: true, color: C.gold, charSpacing: 0.9,
  });
  const coverage = [
    ["CÁLCULO", "particiones y redondeo", C.red],
    ["FALLO", "vacío y fuera de rango", C.gold],
    ["CAMBIO", "controles + prueba", C.success],
  ];
  coverage.forEach((item, index) => {
    const y = 3.22 + index * 0.86;
    addStatusPill(slide, 6.5, y + 0.1, 1.34, item[0], item[2], {
      h: 0.46, fontSize: 9.2, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 8.18, y, w: 3.5, h: 0.66,
      fontSize: 16, bold: true, color: C.white, valign: "mid",
    });
  });
  rect(slide, 6.5, 5.94, 5.44, 0.5, C.white, C.white, 0.05);
  addText(slide, "3 riesgos diferentes → 3 criterios útiles", {
    x: 6.84, y: 5.94, w: 4.76, h: 0.5,
    fontSize: 14, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 94 · Cuatro decisiones de auditoría */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Auditar", "Cada propuesta recibe una decisión, no un “me gusta”", "La decisión expresa qué relación mantiene el candidato con el brief, la evidencia y el alcance.");
  rect(slide, 5.28, 3.22, 2.78, 1.72, C.navy, C.navy, 0.08);
  addText(slide, "CRITERIO\nCANDIDATO", {
    x: 5.68, y: 3.58, w: 1.98, h: 0.74,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.white, align: "center",
  });
  const decisions = [
    [0.84, 2.58, "ACEPTAR", "deriva y se observa", C.success],
    [0.84, 4.64, "MODIFICAR", "riesgo válido; falta precisión", C.gold],
    [9.18, 2.58, "POSTERGAR", "pregunta legítima; otra iteración", CYAN],
    [9.18, 4.64, "RECHAZAR", "inventa, contradice o repite", C.red],
  ];
  decisions.forEach((item, index) => {
    rect(slide, item[0], item[1], 3.3, 1.24, index === 3 ? C.navy : C.white, index === 3 ? C.navy : C.border, 0.06);
    addStatusPill(slide, item[0] + 0.3, item[1] + 0.2, 1.18, item[2], item[4], {
      h: 0.42, fontSize: 8.8, color: item[4] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[3], {
      x: item[0] + 0.3, y: item[1] + 0.72, w: 2.7, h: 0.28,
      fontSize: 12.2, bold: true, color: index === 3 ? C.white : C.ink, align: "center",
    });
  });
  addArrow(slide, 4.76, 3.18, 0.28, C.border);
  addArrow(slide, 4.76, 4.72, 0.28, C.border);
  addArrow(slide, 8.3, 3.18, 0.28, C.border);
  addArrow(slide, 8.3, 4.72, 0.28, C.border);
  validateSlide(slide, pptx);
}

/* 95 · Cuatro ejemplos auditados */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.4 · Calibrar", "La decisión cambia según el defecto del candidato", "No toda propuesta imperfecta merece rechazo: algunas se corrigen y otras esperan una decisión futura.", true);
  const examples = [
    ["MODIFICAR", "“El promedio debe calcularse correctamente”", "faltan entradas, redondeo y evidencia", C.gold],
    ["RECHAZAR", "“La lista vacía devuelve 0.0”", "contradice la regla 4", C.red],
    ["POSTERGAR", "“Solo un docente autenticado puede calcular”", "autenticación fuera de iteración", CYAN_ON_NAVY],
    ["ACEPTAR", "“7.1 produce ValueError e informa el rango”", "deriva de las reglas 2, 4 y 5", C.success],
  ];
  examples.forEach((item, index) => {
    const y = 2.54 + index * 0.93;
    rect(slide, 0.88, y, 11.58, 0.72, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.05);
    addStatusPill(slide, 1.12, y + 0.14, 1.36, item[0], item[3], {
      h: 0.44, fontSize: 8.8, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 2.8, y, w: 5.54, h: 0.72,
      fontSize: 14.5, bold: true, color: index === 3 ? C.ink : C.white, valign: "mid",
    });
    addText(slide, item[2], {
      x: 8.58, y, w: 3.46, h: 0.72,
      fontSize: 12.2, bold: true, color: index === 3 ? C.slate : C.softBlue, valign: "mid", align: "right",
    });
  });
  addText(slide, "La etiqueta importa menos que la justificación trazable.", {
    x: 2.78, y: 6.46, w: 7.78, h: 0.3,
    fontSize: 14.5, bold: true, color: C.gold, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 96 · Cinco controles antes de aceptar */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Controlar", "Cinco puertas protegen la ficha de criterios débiles", "Un candidato aceptado debe cruzar las cinco; una sola puerta cerrada lo devuelve a revisión.");
  const gates = [
    ["1", "TRAZABILIDAD", "regla de origen", C.red],
    ["2", "OBSERVACIÓN", "aprobado ≠ rechazado", C.gold],
    ["3", "CONDICIONES", "entrada y contexto", C.success],
    ["4", "EVIDENCIA", "observa la propiedad", CYAN],
    ["5", "ALCANCE", "sin decisiones nuevas", C.navy],
  ];
  gates.forEach((item, index) => {
    const x = 0.74 + index * 2.5;
    const y = 2.76 + (index % 2) * 0.38;
    rect(slide, x, y, 2.16, 2.82, index === 4 ? C.navy : C.white, index === 4 ? C.navy : C.border, 0.07);
    addCircleLabel(slide, x + 0.76, y + 0.3, 0.58, item[3], item[0], {
      fontSize: 12, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 0.22, y: y + 1.14, w: 1.72, h: 0.22,
      fontSize: 9.4, bold: true, color: onPaper(item[3]), align: "center", charSpacing: 0.7,
    });
    addText(slide, item[2], {
      x: x + 0.24, y: y + 1.66, w: 1.68, h: 0.62,
      fontSize: 14.4, bold: true, color: index === 4 ? C.white : C.ink, align: "center",
    });
  });
  addText(slide, "ACEPTAR", {
    x: 10.72, y: 6.22, w: 1.56, h: 0.28,
    fontSize: 13.2, bold: true, color: C.success, align: "center", charSpacing: 0.8,
  });
  slide.addShape(SH.line, {
    x: 1.18, y: 6.2, w: 9.32, h: 0,
    line: { color: C.border, pt: 2.2, endArrowType: "triangle" },
  });
  validateSlide(slide, pptx);
}

/* 97 · Caso aceptado */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.4 · Caso aceptado", "7.1 atraviesa las cinco puertas", "El candidato no es perfecto por sonar técnico: es aceptable porque cada parte puede rastrearse y observarse.", true);
  rect(slide, 0.9, 2.62, 4.18, 3.48, C.white, C.white, 0.07);
  addText(slide, "ENTRADA", {
    x: 1.28, y: 3.02, w: 1.3, h: 0.2,
    fontSize: 10, bold: true, color: C.red, charSpacing: 0.8,
  });
  addText(slide, "7.1", {
    x: 1.28, y: 3.6, w: 3.4, h: 0.72,
    fontFace: TYPOGRAPHY.mono, fontSize: 38, bold: true, color: C.ink, align: "center",
  });
  addText(slide, "ValueError", {
    x: 1.28, y: 4.62, w: 3.4, h: 0.46,
    fontFace: TYPOGRAPHY.mono, fontSize: 21, bold: true, color: C.red, align: "center",
  });
  addText(slide, "+ mensaje con rango 1.0–7.0", {
    x: 1.28, y: 5.34, w: 3.4, h: 0.3,
    fontSize: 13.4, bold: true, color: C.slate, align: "center",
  });
  const checks = [
    ["TRAZA", "brief 2, 4 y 5", C.red],
    ["OBSERVA", "excepción + mensaje", C.gold],
    ["CONDICIÓN", "nota sobre el máximo", C.success],
    ["EVIDENCIA", "pytest", CYAN_ON_NAVY],
    ["ALCANCE", "sin funciones nuevas", C.red],
  ];
  checks.forEach((item, index) => {
    const y = 2.64 + index * 0.7;
    addCircleLabel(slide, 5.66, y + 0.08, 0.44, item[2], "✓", {
      fontSize: 10, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 6.34, y: y + 0.08, w: 1.36, h: 0.18,
      fontSize: 9.2, bold: true, color: item[2], charSpacing: 0.7,
    });
    addText(slide, item[1], {
      x: 7.94, y, w: 3.54, h: 0.58,
      fontSize: 14.2, bold: true, color: C.white, valign: "mid",
    });
  });
  rect(slide, 6.72, 6.22, 4.36, 0.48, C.success, C.success, 0.05);
  addText(slide, "ACEPTADO · listo para la ficha", {
    x: 7.04, y: 6.22, w: 3.72, h: 0.48,
    fontSize: 13.8, bold: true, color: C.white, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 98 · Ficha de calidad priorizada */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.5 · Registrar", "La ficha final reúne decisiones y evidencia planificada", "Tres criterios aceptados quedan junto a la trazabilidad y al juicio sobre las propuestas del agente.");
  rect(slide, 0.86, 2.5, 7.68, 3.96, C.white, C.border, 0.06);
  rect(slide, 0.86, 2.5, 7.68, 0.5, C.navy, C.navy, 0.06);
  addText(slide, "auditoria-calidad.md · ficha priorizada", {
    x: 1.18, y: 2.5, w: 3.82, h: 0.5,
    fontFace: TYPOGRAPHY.mono, fontSize: 10.8, bold: true, color: C.white, valign: "mid",
  });
  const fields = [
    ["### [ID] · [Característica]", C.red],
    ["Fuente", "reglas del brief"],
    ["Riesgo", "consecuencia que se quiere reducir"],
    ["Condición", "entrada, contexto o estado"],
    ["Comportamiento", "resultado observable"],
    ["Evidencia", "prueba o revisión planificada"],
    ["Estado", "ACEPTADO | REQUIERE DECISIÓN"],
  ];
  fields.forEach((item, index) => {
    const y = 3.2 + index * 0.41;
    if (index === 0) {
      addText(slide, item[0], {
        x: 1.22, y, w: 6.84, h: 0.24,
        fontFace: TYPOGRAPHY.mono, fontSize: 11.8, bold: true, color: item[1],
      });
    } else {
      addText(slide, item[0].toUpperCase(), {
        x: 1.22, y, w: 1.42, h: 0.18,
        fontSize: 8.8, bold: true, color: index % 2 ? C.red : ACCENT_ON_PAPER[C.gold], charSpacing: 0.6,
      });
      addText(slide, item[1], {
        x: 2.82, y: y - 0.03, w: 4.98, h: 0.26,
        fontSize: 12.6, bold: true, color: C.ink,
      });
    }
  });
  addText(slide, "DECISIONES SOBRE EL AGENTE", {
    x: 9.12, y: 2.72, w: 2.86, h: 0.22,
    fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 0.8,
  });
  [
    ["ACEPTADA", C.success],
    ["MODIFICADA", C.gold],
    ["POSTERGADA", CYAN],
    ["RECHAZADA", C.red],
  ].forEach((item, index) => {
    addStatusPill(slide, 9.42, 3.36 + index * 0.72, 2.26, item[0], item[1], {
      h: 0.48, fontSize: 9.2, color: item[1] === C.gold ? C.ink : C.white,
    });
  });
  rect(slide, 9.06, 6.18, 2.98, 0.38, C.warm, C.warm, 0.04);
  addText(slide, "3 criterios aceptados", {
    x: 9.34, y: 6.18, w: 2.42, h: 0.38,
    fontSize: 12.2, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 99 · Autorrevisión */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "4.5 · Autorrevisar", "Cuatro preguntas intentan romper el criterio antes de cerrarlo", "Si una respuesta depende de una suposición, el criterio vuelve a edición.", true);
  const questions = [
    ["FUENTE", "¿Puedo localizar la regla que lo origina?", C.red],
    ["OBSERVACIÓN", "¿Sé exactamente qué tendría que mirar?", C.gold],
    ["FALSACIÓN", "¿La evidencia podría contradecir la afirmación?", C.success],
    ["AUTORIDAD", "¿Aparece una decisión que el brief nunca entregó?", CYAN_ON_NAVY],
  ];
  questions.forEach((item, index) => {
    const angle = index % 2;
    const x = angle === 0 ? 0.92 : 6.9;
    const y = index < 2 ? 2.64 : 4.56;
    rect(slide, x, y, 5.52, 1.46, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.07);
    addStatusPill(slide, x + 0.3, y + 0.26, 1.34, item[0], item[2], {
      h: 0.42, fontSize: 8.6, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.92, y: y + 0.22, w: 3.14, h: 0.9,
      fontSize: 15.2, bold: true, color: index === 3 ? C.ink : C.white, valign: "mid",
    });
  });
  addCircleLabel(slide, 5.94, 3.72, 1.42, C.red, "?", { fontSize: 31 });
  validateSlide(slide, pptx);
}

/* 100 · Punto de control del Bloque 4 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · Punto de control", "La ficha queda lista cuando puede defender cinco decisiones", "Cada marca debe estar visible en auditoria-calidad.md y poder explicarse sin recurrir a intención implícita.", false, { titleFontSize: 27 });
  const checks = [
    ["RIESGOS", "Tres prioridades justificadas por contexto, impacto y vacío", C.red],
    ["CRITERIOS", "Tres expectativas aceptadas y trazables al brief", C.gold],
    ["EVIDENCIA", "Una comprobación planificada para cada criterio", C.success],
    ["AGENTE", "Decisiones justificadas sobre sus propuestas", CYAN],
    ["REVISIÓN", "Una segunda lectura incorporada antes del cierre", C.navy],
  ];
  checks.forEach((item, index) => {
    const y = 2.46 + index * 0.74;
    addCircleLabel(slide, 0.86, y + 0.04, 0.5, item[2], "✓", {
      fontSize: 13, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 1.62, y: y + 0.1, w: 1.58, h: 0.2,
      fontSize: 10, bold: true, color: onPaper(item[2]), charSpacing: 0.7,
    });
    rect(slide, 3.38, y, 8.94, 0.58, index === 4 ? C.navy : C.white, index === 4 ? C.navy : C.border, 0.05);
    addText(slide, item[1], {
      x: 3.72, y, w: 8.24, h: 0.58,
      fontSize: 14.4, bold: true, color: index === 4 ? C.white : C.ink, valign: "mid",
    });
  });
  rect(slide, 2.2, 6.28, 8.94, 0.46, C.warm, C.warm, 0.04);
  addText(slide, "La meta no es una ficha perfecta: es una ficha más verificable que la opinión inicial.", {
    x: 2.54, y: 6.28, w: 8.26, h: 0.46,
    fontSize: 13.6, bold: true, color: C.red, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 101 · Preguntas guía del Bloque 4 */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "Bloque 4 · Preguntas", "Tres preguntas para defender un criterio", "La pista orienta el análisis sin entregar la respuesta.", true);
  const questions = [
    [
      "¿Por qué detectar un riesgo no autoriza a decidir el comportamiento correcto?",
      "Separa el hallazgo técnico de la fuente que define la necesidad o regla del producto.",
      C.red,
    ],
    [
      "¿Qué diferencia un criterio verificable de una recomendación general?",
      "Busca condición, resultado, fuente y una evidencia capaz de aprobarlo o contradecirlo.",
      C.gold,
    ],
    [
      "¿Cuándo conviene postergar una propuesta en vez de rechazarla?",
      "Distingue una idea incompatible de una pregunta válida que aún necesita decisión autorizada.",
      C.success,
    ],
  ];
  questions.forEach((item, index) => {
    const y = 2.46 + index * 1.42;
    addCircleLabel(slide, 0.82, y + 0.08, 0.58, item[2], index + 1, {
      fontSize: 13, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[0], {
      x: 1.7, y, w: 10.7, h: 0.58,
      fontSize: 17.5, bold: true, color: C.white,
    });
    rect(slide, 1.7, y + 0.68, 10.54, 0.5, C.titleFill, C.titleFill, 0.04);
    rect(slide, 1.7, y + 0.68, 0.08, 0.5, item[2], item[2]);
    addText(slide, "PISTA", {
      x: 1.98, y: y + 0.68, w: 0.76, h: 0.5,
      fontSize: 9.2, bold: true, color: item[2], charSpacing: 0.9, valign: "mid",
    });
    addText(slide, item[1], {
      x: 2.94, y: y + 0.68, w: 8.92, h: 0.5,
      fontSize: 12.8, color: C.softBlue, valign: "mid",
    });
  });
  validateSlide(slide, pptx);
}

/* 102 · Cierre del Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · BLOQUE 4", {
    x: M, y: 0.84, w: 4.4, h: 0.22,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.7,
  });
  addText(slide, "La necesidad autoriza", {
    x: M, y: 1.42, w: 9.1, h: 0.68,
    fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.white,
  });
  addText(slide, "la evidencia confronta", {
    x: M, y: 2.12, w: 9.1, h: 0.72,
    fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.gold,
  });
  const chain = [
    ["BRIEF", "fuente", C.red],
    ["RIESGO", "prioridad", C.gold],
    ["CRITERIO", "expectativa", C.success],
    ["EVIDENCIA", "prueba", CYAN_ON_NAVY],
    ["DECISIÓN", "juicio", C.red],
  ];
  chain.forEach((item, index) => {
    const x = 0.72 + index * 2.49;
    const raised = index === 2;
    rect(slide, x, raised ? 3.32 : 3.58, 2.18, raised ? 1.64 : 1.34, index === 4 ? C.white : C.titleFill, index === 4 ? C.white : C.titleFill, 0.06);
    addText(slide, item[0], {
      x: x + 0.18, y: raised ? 3.7 : 3.88, w: 1.82, h: 0.2,
      fontSize: 9.4, bold: true, color: item[2], align: "center", charSpacing: 0.7,
    });
    addText(slide, item[1], {
      x: x + 0.18, y: raised ? 4.18 : 4.28, w: 1.82, h: 0.28,
      fontSize: 14.5, bold: true, color: index === 4 ? C.ink : C.white, align: "center",
    });
    if (index < chain.length - 1) addArrow(slide, x + 2.24, 3.98, 0.14, C.red);
  });
  rect(slide, 1.46, 5.7, 10.42, 0.72, C.white, C.white, 0.05);
  addText(slide, "Ya tenemos modelo, auditoría y criterios. Falta reunir qué podemos demostrar y preparar la diferencia entre verificar y validar.", {
    x: 1.82, y: 5.7, w: 9.7, h: 0.72,
    fontSize: 15, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 103 · Apertura del cierre */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE DE LA CLASE · 10 MINUTOS", {
    x: M, y: 0.82, w: 5.8, h: 0.24,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.7,
  });
  addText(slide, "De “funciona”", {
    x: M, y: 1.48, w: 7.2, h: 0.76,
    fontFace: TYPOGRAPHY.display, fontSize: 42, bold: true, color: C.white,
  });
  addText(slide, "a “esto podemos demostrar”", {
    x: M, y: 2.22, w: 11.02, h: 0.82,
    fontFace: TYPOGRAPHY.display, fontSize: 39, bold: true, color: C.gold,
  });
  const contrast = [
    ["ANTES", "4 pruebas en verde", C.red],
    ["AHORA", "alcance + riesgos + criterios + evidencia", C.success],
  ];
  contrast.forEach((item, index) => {
    const x = index === 0 ? 0.9 : 6.08;
    const w = index === 0 ? 4.6 : 6.3;
    rect(slide, x, 3.72, w, 1.44, index === 1 ? C.white : C.titleFill, index === 1 ? C.white : C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.34, y: 4.02, w: 1.16, h: 0.2,
      fontSize: 10, bold: true, color: item[2], charSpacing: 0.9,
    });
    addText(slide, item[1], {
      x: x + 1.54, y: 3.72, w: w - 1.9, h: 1.44,
      fontSize: index === 0 ? 20 : 18.5, bold: true,
      color: index === 1 ? C.ink : C.white, valign: "mid",
    });
  });
  rect(slide, 1.7, 5.88, 9.94, 0.56, C.titleFill, C.titleFill, 0.05);
  addText(slide, "ISO/IEC 25010 no reemplazó los controles: les dio contexto.", {
    x: 2.04, y: 5.88, w: 9.26, h: 0.56,
    fontSize: 15.2, bold: true, color: C.white, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 104 · Recorrido de la sesión */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre · Recorrido", "La sesión amplió progresivamente lo que podíamos afirmar", "Cada capa agregó contexto sin borrar la evidencia técnica que ya existía.");
  const route = [
    ["RESULTADO", "4 passed", C.red],
    ["ALCANCE", "qué observan", C.gold],
    ["MODELO", "9 preguntas", C.success],
    ["AUDITORÍA", "riesgos y vacíos", CYAN],
    ["CRITERIOS", "expectativas trazables", C.navy],
    ["CONCLUSIÓN", "afirmación proporcional", C.red],
  ];
  route.forEach((item, index) => {
    const x = index < 3 ? 0.84 + index * 4.14 : 9.12 - (index - 3) * 4.14;
    const y = index < 3 ? 2.6 : 4.52;
    rect(slide, x, y, 3.64, 1.28, index === 4 ? C.navy : C.white, index === 4 ? C.navy : C.border, 0.06);
    addStatusPill(slide, x + 0.28, y + 0.2, 1.24, item[0], item[2], {
      h: 0.4, fontSize: 8.4, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.76, y, w: 1.54, h: 1.28,
      fontSize: 14.2, bold: true, color: index === 4 ? C.white : C.ink, align: "center", valign: "mid",
    });
    if (index < 2) addArrow(slide, x + 3.74, y + 0.4, 0.22, C.red);
    if (index > 2 && index < 5) addArrow(slide, x - 0.34, y + 0.4, 0.22, C.red);
  });
  slide.addShape(SH.line, {
    x: 12.16, y: 3.9, w: 0, h: 0.44,
    line: { color: C.red, pt: 2.2, endArrowType: "triangle" },
  });
  addText(slide, "La calidad dejó de ser un adjetivo y se convirtió en una cadena revisable.", {
    x: 1.84, y: 6.28, w: 9.66, h: 0.34,
    fontSize: 14.8, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 105 · Evidencia mínima de salida */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "Cierre · Evidencia", "El archivo final conserva seis capas de razonamiento", "auditoria-calidad.md no certifica el producto: documenta qué observamos, decidimos y necesitamos comprobar.", true);
  const artifacts = [
    ["01", "ALCANCE", "producto y fuera de alcance", C.red],
    ["02", "INVENTARIO", "E1–E7", C.gold],
    ["03", "HALLAZGOS", "3 características", C.success],
    ["04", "REVISIÓN", "agente aceptado y rechazado", CYAN_ON_NAVY],
    ["05", "CRITERIOS", "3 prioridades trazables", C.red],
    ["06", "CONCLUSIÓN", "demostrado y pendiente", C.gold],
  ];
  artifacts.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? 0.88 : 6.76;
    const y = 2.54 + row * 1.12;
    rect(slide, x, y, 5.68, 0.88, index === 5 ? C.white : C.titleFill, index === 5 ? C.white : C.titleFill, 0.05);
    addCircleLabel(slide, x + 0.26, y + 0.2, 0.48, item[3], item[0], {
      fontSize: 9.4, color: item[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: x + 1.0, y: y + 0.18, w: 1.46, h: 0.18,
      fontSize: 9.5, bold: true, color: item[3], charSpacing: 0.7,
    });
    addText(slide, item[2], {
      x: x + 2.52, y, w: 2.72, h: 0.88,
      fontSize: 13.6, bold: true, color: index === 5 ? C.ink : C.white, valign: "mid",
    });
  });
  rect(slide, 2.04, 6.16, 9.24, 0.5, C.white, C.white, 0.05);
  addText(slide, "ARTEFACTO DE SALIDA · auditoria-calidad.md", {
    x: 2.38, y: 6.16, w: 8.56, h: 0.5,
    fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 106 · Conclusión compartida */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre · Conclusión", "La evidencia permite una afirmación precisa y limitada", "La conclusión integra resultados actuales y criterios futuros sin confundirlos.");
  rect(slide, 0.88, 2.58, 7.02, 3.7, C.navy, C.navy, 0.08);
  addText(slide, "PODEMOS AFIRMAR HOY", {
    x: 1.28, y: 2.98, w: 2.78, h: 0.22,
    fontSize: 10.4, bold: true, color: C.success, charSpacing: 1.0,
  });
  addText(slide, "El proyecto se reconstruye en el entorno declarado y nota_final() satisface cuatro ejemplos ejecutados.", {
    x: 1.28, y: 3.48, w: 6.22, h: 1.2,
    fontFace: TYPOGRAPHY.display, fontSize: 20.5, bold: true, color: C.white,
  });
  addText(slide, "La auditoría halló evidencia funcional, señales parciales y vacíos explícitos.", {
    x: 1.28, y: 4.9, w: 6.22, h: 0.62,
    fontSize: 14.2, bold: true, color: C.softBlue,
  });
  addText(slide, "Los nuevos criterios todavía deben implementarse y verificarse.", {
    x: 1.28, y: 5.66, w: 6.22, h: 0.42,
    fontSize: 12.2, bold: true, color: C.gold,
  });
  addText(slide, "NO PODEMOS AFIRMAR", {
    x: 8.5, y: 2.86, w: 3.08, h: 0.22,
    fontSize: 10.4, bold: true, color: C.red, align: "center", charSpacing: 0.9,
  });
  [
    "las 9 características están aprobadas",
    "cubre cualquier entrada o contexto",
    "una herramienta verde certifica calidad",
    "el agente tiene razón sin trazabilidad",
  ].forEach((item, index) => {
    const y = 3.48 + index * 0.64;
    addCircleLabel(slide, 8.52, y, 0.38, C.red, "×", { fontSize: 10.5 });
    addText(slide, item, {
      x: 9.12, y: y - 0.02, w: 3.1, h: 0.42,
      fontSize: 13.8, bold: true, color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 107 · Ticket de salida */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "Cierre · Ticket de salida", "Completa cuatro frases en una línea", "Usa el vocabulario de la clase: alcance, contexto, riesgo, criterio y evidencia.", true);
  const prompts = [
    ["1", "Una prueba en verde demuestra…", C.red],
    ["2", "Una característica de ISO/IEC 25010 me ayuda a preguntar…", C.gold],
    ["3", "Marcamos un hallazgo como POR DEFINIR cuando…", C.success],
    ["4", "Un criterio se vuelve verificable cuando…", CYAN_ON_NAVY],
  ];
  prompts.forEach((item, index) => {
    const y = 2.54 + index * 0.88;
    addCircleLabel(slide, 0.92, y + 0.05, 0.52, item[2], item[0], {
      fontSize: 11.5, color: item[2] === C.gold ? C.ink : C.white,
    });
    addText(slide, item[1], {
      x: 1.72, y, w: 6.86, h: 0.58,
      fontSize: 17, bold: true, color: C.white, valign: "mid",
    });
    rule(slide, 8.74, y + 0.3, 3.36, item[2], 1.6);
  });
  rect(slide, 2.18, 6.22, 8.98, 0.46, C.white, C.white, 0.05);
  addText(slide, "Una frase breve debe conservar el límite de lo que realmente sabemos.", {
    x: 2.52, y: 6.22, w: 8.3, h: 0.46,
    fontSize: 13.5, bold: true, color: C.ink, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 108 · Verificación frente a validación */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Próxima clase", "Verificar y validar responden preguntas diferentes", "Los criterios creados hoy serán el puente entre la implementación y la necesidad real.");
  rect(slide, 0.88, 2.64, 4.5, 3.3, C.navy, C.navy, 0.08);
  addText(slide, "VERIFICACIÓN", {
    x: 1.28, y: 3.02, w: 3.7, h: 0.24,
    fontSize: 11, bold: true, color: C.gold, align: "center", charSpacing: 1.1,
  });
  addText(slide, "¿Construimos de acuerdo con los criterios especificados?", {
    x: 1.32, y: 3.8, w: 3.62, h: 1.12,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: C.white, align: "center",
  });
  addText(slide, "producto ↔ especificación", {
    x: 1.32, y: 5.34, w: 3.62, h: 0.28,
    fontSize: 13, bold: true, color: C.softBlue, align: "center",
  });
  rect(slide, 5.74, 3.38, 1.86, 1.82, C.warm, C.warm, 0.08);
  addText(slide, "CRITERIOS\nDE HOY", {
    x: 5.98, y: 3.78, w: 1.38, h: 0.74,
    fontSize: 15, bold: true, color: C.red, align: "center",
  });
  addArrow(slide, 5.44, 4.04, 0.18, C.red);
  addArrow(slide, 7.72, 4.04, 0.18, C.red);
  rect(slide, 8.02, 2.64, 4.46, 3.3, C.white, C.border, 0.08);
  addText(slide, "VALIDACIÓN", {
    x: 8.42, y: 3.02, w: 3.66, h: 0.24,
    fontSize: 11, bold: true, color: C.red, align: "center", charSpacing: 1.1,
  });
  addText(slide, "¿Los criterios y el producto responden a la necesidad real?", {
    x: 8.42, y: 3.8, w: 3.66, h: 1.12,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: C.ink, align: "center",
  });
  addText(slide, "necesidad ↔ producto", {
    x: 8.42, y: 5.34, w: 3.66, h: 0.28,
    fontSize: 13, bold: true, color: C.slate, align: "center",
  });
  addText(slide, "Cumplir una especificación incorrecta también puede producir un resultado inaceptable.", {
    x: 2.02, y: 6.3, w: 9.3, h: 0.34,
    fontSize: 14.5, bold: true, color: C.red, align: "center",
  });
  validateSlide(slide, pptx);
}

/* 109 · Mensaje final */
{
  const { slide } = createSlide("dark");
  addText(slide, "CLASE 03 · MENSAJE FINAL", {
    x: M, y: 0.84, w: 4.8, h: 0.22,
    fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.7,
  });
  addText(slide, "La calidad no aparece", {
    x: M, y: 1.52, w: 9.2, h: 0.72,
    fontFace: TYPOGRAPHY.display, fontSize: 39, bold: true, color: C.white,
  });
  addText(slide, "cuando reunimos más adjetivos", {
    x: M, y: 2.28, w: 10.4, h: 0.76,
    fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.gold,
  });
  const sequence = [
    ["NECESIDAD", "autoriza", C.red],
    ["CRITERIO", "explicita", C.gold],
    ["EVIDENCIA", "confronta", C.success],
    ["CONCLUSIÓN", "respeta el límite", CYAN_ON_NAVY],
  ];
  sequence.forEach((item, index) => {
    const x = 0.88 + index * 3.06;
    rect(slide, x, 3.62, 2.7, 1.42, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.07);
    addText(slide, item[0], {
      x: x + 0.24, y: 3.96, w: 2.22, h: 0.2,
      fontSize: 9.8, bold: true, color: item[2], align: "center", charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: x + 0.24, y: 4.38, w: 2.22, h: 0.32,
      fontSize: 14.8, bold: true, color: index === 3 ? C.ink : C.white, align: "center",
    });
    if (index < sequence.length - 1) addArrow(slide, x + 2.76, 4.08, 0.18, C.red);
  });
  rect(slide, 1.44, 5.76, 10.44, 0.64, C.white, C.white, 0.05);
  addText(slide, "Lo profesional no es afirmar más. Es demostrar exactamente lo que la evidencia permite.", {
    x: 1.78, y: 5.76, w: 9.76, h: 0.64,
    fontSize: 16, bold: true, color: C.ink, align: "center", valign: "mid",
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
