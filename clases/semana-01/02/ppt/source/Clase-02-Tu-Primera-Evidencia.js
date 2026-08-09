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
  subject: "PRO402 · Clase 02",
  title: "Tu primera evidencia: entorno reproducible y primer test",
});

const SH = pptx.ShapeType;
const W = 13.333;
const H = 7.5;
const M = 0.72;
const outputPptx = path.resolve(__dirname, "..", "Clase-02-Tu-Primera-Evidencia.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
  uv: path.resolve(__dirname, "assets/tools/uv-mark.svg"),
  ruff: path.resolve(__dirname, "assets/tools/ruff-mark.svg"),
  pyrefly: path.resolve(__dirname, "assets/tools/pyrefly-mark.svg"),
  pyreflyInvert: path.resolve(__dirname, "assets/tools/pyrefly-mark-invert.svg"),
  pytest: path.resolve(__dirname, "assets/tools/pytest-logo.svg"),
};

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

function rect(slide, x, y, w, h, fill, line = fill, radius = 0) {
  slide.addShape(radius ? SH.roundRect : SH.rect, {
    x,
    y,
    w,
    h,
    rectRadius: radius || undefined,
    fill: { color: fill },
    line: { color: line, pt: line === fill ? 0 : 1 },
  });
}

function addCircleLabel(slide, x, y, size, fill, label, opts = {}) {
  slide.addShape(SH.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: { color: opts.line || fill, pt: opts.line && opts.line !== fill ? 1 : 0 },
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
    margin: 0,
  });
}

function line(slide, x, y, w, color = C.border, pt = 1.2) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, pt, beginArrowType: "none", endArrowType: "none" },
  });
}

function addAiepLogo(slide, dark = false) {
  const x = 11.2;
  const y = 0.3;
  const w = 1.42;
  const h = 0.58;
  const logoPath = dark ? ASSETS.aiepDark : ASSETS.aiep;
  slide.addImage({
    path: logoPath,
    ...imageSizingContain(logoPath, x, y, w, h),
  });
}

function addFooter(slide, dark = false) {
  addText(slide, "PRO402 · Taller de Testing y Calidad de Software", {
    x: M,
    y: 7.1,
    w: 5.6,
    h: 0.18,
    fontSize: 9.5,
    bold: true,
    color: dark ? C.sand : C.slate,
    charSpacing: 0.6,
  });
  addText(slide, String(pptx._slides.length).padStart(2, "0"), {
    x: 11.78,
    y: 7.02,
    w: 0.84,
    h: 0.28,
    fontFace: TYPOGRAPHY.display,
    fontSize: 14,
    bold: true,
    color: dark ? C.sand : C.navy,
    align: "right",
  });
}

function addTopMotif(slide, dark = false) {
  rect(slide, 0, 0, 0.72, 0.12, C.red);
  rect(slide, 0.82, 0, 0.44, 0.12, dark ? C.gold : C.navy);
  rect(slide, 1.36, 0, 0.28, 0.12, dark ? C.white : C.gold);
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

function addHeader(slide, label, title, subtitle = "", dark = false, opts = {}) {
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.46,
    w: 4.8,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: dark ? C.gold : C.red,
    charSpacing: 1.8,
  });
  addText(slide, title, {
    x: M,
    y: 0.86,
    w: 9.7,
    h: opts.titleH || 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || 31,
    bold: true,
    color: dark ? C.white : C.ink,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: M,
      y: opts.subtitleY || 1.63,
      w: 9.5,
      h: 0.44,
      fontSize: 16,
      color: dark ? C.softBlue : C.slate,
    });
  }
}

function addToolTile(slide, tool, x, y, w, h, opts = {}) {
  const dark = opts.dark !== false;
  const fill = dark ? C.navy : C.white;
  const border = dark ? C.navy : C.border;
  rect(slide, x, y, w, h, fill, border, 0.08);
  const logoPath = tool === "uv"
    ? ASSETS.uv
    : tool === "ruff"
    ? ASSETS.ruff
    : tool === "pyrefly"
    ? dark
      ? ASSETS.pyreflyInvert
      : ASSETS.pyrefly
    : ASSETS.pytest;
  const imageH = tool === "pytest" ? h * 0.55 : h * 0.44;
  const imageY = tool === "pytest" ? y + 0.08 : y + 0.16;
  slide.addImage({
    path: logoPath,
    ...imageSizingContain(logoPath, x + 0.16, imageY, w - 0.32, imageH),
  });
  addText(slide, tool === "pyrefly" ? "Pyrefly" : tool === "pytest" ? "pytest" : tool, {
    x: x + 0.1,
    y: y + h - 0.35,
    w: w - 0.2,
    h: 0.22,
    fontSize: 13,
    bold: true,
    color: dark ? C.white : C.ink,
    align: "center",
  });
}

function addLabelValue(slide, x, y, index, title, body, accent = C.red, width = 5.4) {
  addCircleLabel(slide, x, y, 0.48, accent, String(index).padStart(2, "0"), { fontSize: 11 });
  addText(slide, title, {
    x: x + 0.68,
    y: y - 0.01,
    w: width - 0.68,
    h: 0.28,
    fontSize: 17,
    bold: true,
    color: C.ink,
  });
  addText(slide, body, {
    x: x + 0.68,
    y: y + 0.32,
    w: width - 0.68,
    h: 0.44,
    fontSize: 14.5,
    color: C.slate,
    lineSpacingMultiple: 1.05,
  });
}

function addQuestion(slide, y, index, question, hint) {
  const isLong = question.length > 60;
  addCircleLabel(slide, M, y, 0.52, C.red, index, { fontSize: 12 });
  addText(slide, question, {
    x: M + 0.78,
    y: y - 0.02,
    w: 10.9,
    h: isLong ? 0.76 : 0.42,
    fontSize: 19,
    bold: true,
    color: C.ink,
  });
  addText(slide, `PISTA → ${hint}`, {
    x: M + 0.78,
    y: y + (isLong ? 0.78 : 0.48),
    w: 10.9,
    h: 0.34,
    fontSize: 14.5,
    color: C.slate,
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
  addText(slide, "CLASE 02 · SEMANA 01", {
    x: M,
    y: 0.72,
    w: 4.4,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });
  addText(slide, "Tu primera", {
    x: M,
    y: 1.56,
    w: 8.2,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 49,
    bold: true,
    color: C.white,
  });
  addText(slide, "evidencia", {
    x: M,
    y: 2.48,
    w: 8.2,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 51,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Entorno reproducible y primer test", {
    x: M,
    y: 3.58,
    w: 7.8,
    h: 0.45,
    fontSize: 20,
    color: C.softBlue,
  });
  addText(slide, "Martes 11 de agosto de 2026 · Laboratorio PC · Diego Obando", {
    x: M,
    y: 4.2,
    w: 7.8,
    h: 0.3,
    fontSize: 13,
    color: C.sand,
  });
  const tools = ["uv", "ruff", "pyrefly", "pytest"];
  tools.forEach((tool, index) => addToolTile(slide, tool, M + index * 1.58, 5.12, 1.34, 1.12, { dark: tool !== "pytest" }));
  rect(slide, 9.42, 1.62, 2.78, 3.72, C.editorBg, C.titleFill, 0.08);
  addText(slide, "> evidencia", {
    x: 9.78,
    y: 2.08,
    w: 2.1,
    h: 0.32,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 17,
    bold: true,
    color: C.terminalPrompt,
  });
  addText(slide, "entorno  ✓\nlint     ✓\ntipos    ✓\ntests    ✓", {
    x: 9.78,
    y: 2.68,
    w: 2.08,
    h: 1.66,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    color: C.terminalOutput,
    lineSpacingMultiple: 1.12,
  });
  addText(slide, "No confiar. Comprobar.", {
    x: 9.78,
    y: 4.7,
    w: 2.1,
    h: 0.32,
    fontSize: 14,
    bold: true,
    color: C.white,
  });
  validateSlide(slide, pptx);
}

/* 02 · Continuidad con la clase anterior */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida", "Ayer encontramos un defecto", "Funcionaba manualmente, pero la evidencia desaparecía al cerrar la terminal.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.38,
    w: 7.18,
    h: 2.36,
    title: "PowerShell · comprobación manual",
    fontSize: 13.5,
    lines: [
      { prompt: ">", text: "python -c \"from notas import nota_final; ...\"" },
      { text: "3.9", kind: "muted" },
    ],
  });
  addText(slide, "3.9", {
    x: 8.5,
    y: 2.46,
    w: 3.5,
    h: 1.08,
    fontFace: TYPOGRAPHY.display,
    fontSize: 58,
    bold: true,
    color: C.red,
    align: "center",
  });
  line(slide, 8.86, 3.62, 2.8, C.border, 2);
  addText(slide, "esperábamos 4.0", {
    x: 8.5,
    y: 3.88,
    w: 3.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: C.ink,
    align: "center",
  });
  rect(slide, M, 5.34, 11.88, 0.88, C.warm, C.warm, 0.06);
  addText(slide, "El hallazgo fue real. El problema es que todavía depende de nuestra memoria.", {
    x: M + 0.32,
    y: 5.62,
    w: 11.24,
    h: 0.3,
    fontSize: 19,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 03 · Tesis */
{
  const { slide } = createSlide("dark");
  addText(slide, "“En mi computador funciona”", {
    x: M,
    y: 1.34,
    w: 11.7,
    h: 0.82,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  line(slide, 2.2, 2.42, 8.94, C.red, 4);
  addText(slide, "no es evidencia suficiente", {
    x: M,
    y: 2.76,
    w: 11.7,
    h: 0.74,
    fontFace: TYPOGRAPHY.display,
    fontSize: 35,
    bold: true,
    color: C.white,
    align: "center",
  });
  addText(slide, "Hoy construiremos una forma que otra persona pueda repetir, inspeccionar y discutir.", {
    x: 2.02,
    y: 4.14,
    w: 9.3,
    h: 0.78,
    fontSize: 21,
    color: C.sand,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.05,
  });
  rect(slide, 4.56, 5.38, 4.2, 0.64, C.red, C.red, 0.06);
  addText(slide, "REPETIBLE → REVISABLE", {
    x: 4.76,
    y: 5.58,
    w: 3.8,
    h: 0.2,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 1.2,
  });
  validateSlide(slide, pptx);
}

/* 04 · Resultado observable */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Resultado de la sesión", "Al salir podrás mostrar evidencia", "Cuatro controles distintos; ninguna promesa vaga.");
  const items = [
    ["uv", "Entorno", "Otra persona puede reconstruirlo."],
    ["ruff", "Estructura", "El linter no encuentra las infracciones activas."],
    ["pyrefly", "Contratos", "Los tipos declarados son coherentes."],
    ["pytest", "Comportamiento", "Los casos ejecutados cumplen su expectativa."],
  ];
  items.forEach((item, index) => {
    const x = M + index * 3.02;
    addToolTile(slide, item[0], x, 2.46, 2.62, 1.38, { dark: item[0] !== "pytest" });
    addText(slide, item[1], {
      x,
      y: 4.22,
      w: 2.62,
      h: 0.32,
      fontSize: 18,
      bold: true,
      color: C.ink,
      align: "center",
    });
    addText(slide, item[2], {
      x: x + 0.12,
      y: 4.74,
      w: 2.38,
      h: 0.84,
      fontSize: 14.5,
      color: C.slate,
      align: "center",
      lineSpacingMultiple: 1.04,
    });
  });
  addText(slide, "Verde siempre necesita apellido.", {
    x: M,
    y: 6.14,
    w: 11.88,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 23,
    bold: true,
    color: C.red,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 05 · Objetivos */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Objetivos", "Operar y juzgar", "La técnica y el criterio avanzan juntos.");

  rect(slide, M, 2.34, 5.5, 0.46, C.navy, C.navy, 0.06);
  rect(slide, 7.12, 2.34, 5.5, 0.46, C.gold, C.gold, 0.06);
  addText(slide, "OPERAR", {
    x: 1.02,
    y: 2.48,
    w: 2.4,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: C.white,
    charSpacing: 1.6,
  });
  addText(slide, "JUZGAR", {
    x: 7.42,
    y: 2.48,
    w: 2.4,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: C.ink,
    charSpacing: 1.6,
  });

  const objectivePairs = [
    ["01", "Crear", "un proyecto reproducible con uv", "ENTORNO", "04", "Distinguir", "qué pregunta responde cada herramienta"],
    ["02", "Ejecutar", "Ruff y Pyrefly leyendo sus diagnósticos", "SEÑALES", "05", "Interpretar", "una falla antes de modificar el código"],
    ["03", "Escribir", "una primera prueba con pytest", "ALCANCE", "06", "Auditar", "casos sugeridos por un agente"],
  ];

  objectivePairs.forEach((pair, index) => {
    const y = 2.98 + index * 1.04;
    const [leftIndex, leftTitle, leftBody, relation, rightIndex, rightTitle, rightBody] = pair;

    rect(slide, M, y, 5.5, 0.84, C.softBlue, C.softBlue, 0.06);
    rect(slide, 7.12, y, 5.5, 0.84, C.warningSoft, C.warningSoft, 0.06);

    addCircleLabel(slide, 0.92, y + 0.18, 0.48, C.navy, leftIndex, { fontSize: 10.5 });
    addText(slide, leftTitle, {
      x: 1.62,
      y: y + 0.12,
      w: 1.38,
      h: 0.24,
      fontSize: 16,
      bold: true,
      color: C.navy,
    });
    addText(slide, leftBody, {
      x: 3.0,
      y: y + 0.13,
      w: 2.94,
      h: 0.48,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });

    addText(slide, relation, {
      x: 6.23,
      y: y + 0.08,
      w: 0.88,
      h: 0.18,
      fontSize: 8,
      bold: true,
      color: C.red,
      align: "center",
      charSpacing: 0.2,
    });
    addArrow(slide, 6.38, y + 0.35, 0.48, C.red);

    addCircleLabel(slide, 7.32, y + 0.18, 0.48, C.gold, rightIndex, { fontSize: 10.5, color: C.ink });
    addText(slide, rightTitle, {
      x: 8.02,
      y: y + 0.12,
      w: 1.46,
      h: 0.24,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, rightBody, {
      x: 9.52,
      y: y + 0.13,
      w: 2.78,
      h: 0.48,
      fontSize: 13.5,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 6.18, 11.9, 0.5, C.navy, C.navy, 0.06);
  addText(slide, "OPERAR produce señales  →  JUZGAR las convierte en decisiones defendibles.", {
    x: 1.04,
    y: 6.33,
    w: 11.26,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 0.25,
  });
  validateSlide(slide, pptx);
}

/* 06 · Mapa */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la clase", "Del entorno a la evidencia", "140 minutos · cuatro bloques · una cadena de comprobación.");
  const stages = [
    ["08:30", "ENCUADRE", "Defecto manual", C.red, 1.38],
    ["08:40", "BLOQUE 1", "Entorno reproducible", C.navy, 2.5],
    ["09:10", "BLOQUE 2", "Ruff + Pyrefly", C.gold, 2.14],
    ["09:35", "PAUSA", "10 minutos", C.sand, 1.18],
    ["09:45", "BLOQUE 3", "Primera prueba", C.red, 2.18],
    ["10:15", "BLOQUE 4", "Agente + sabotaje", C.navy, 2.04],
  ];
  let x = M;
  stages.forEach((stage, index) => {
    const [time, label, body, accent, width] = stage;
    rect(slide, x, 2.78, width, 2.48, index === 3 ? C.softNeutral : C.white, C.border, 0.06);
    rect(slide, x, 2.78, width, 0.12, accent, accent);
    addText(slide, time, {
      x: x + 0.16,
      y: 3.08,
      w: width - 0.32,
      h: 0.28,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, label, {
      x: x + 0.16,
      y: 3.72,
      w: width - 0.32,
      h: 0.28,
      fontSize: 11,
      bold: true,
      color: accent === C.sand ? C.slate : accent,
      charSpacing: 0.8,
    });
    addText(slide, body, {
      x: x + 0.16,
      y: 4.24,
      w: width - 0.32,
      h: 0.64,
      fontSize: 15,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    x += width + 0.16;
  });
  rect(slide, M, 5.84, 11.88, 0.62, C.navy, C.navy, 0.04);
  addText(slide, "HOY: cada resultado debe poder explicarse, no solo mostrarse en verde.", {
    x: M + 0.28,
    y: 6.03,
    w: 11.32,
    h: 0.22,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 0.4,
  });
  validateSlide(slide, pptx);
}

/* 07 · Apertura Bloque 1 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 1 · 30 MINUTOS", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  slide.addImage({
    path: ASSETS.uv,
    ...imageSizingContain(ASSETS.uv, 9.42, 1.58, 2.56, 2.56),
  });
  addText(slide, "Un entorno", {
    x: M,
    y: 1.74,
    w: 7.8,
    h: 0.82,
    fontFace: TYPOGRAPHY.display,
    fontSize: 43,
    bold: true,
    color: C.white,
  });
  addText(slide, "también es evidencia", {
    x: M,
    y: 2.64,
    w: 8.2,
    h: 0.84,
    fontFace: TYPOGRAPHY.display,
    fontSize: 43,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Objetivo: crear un proyecto que otra persona pueda reconstruir sin adivinar.", {
    x: M,
    y: 4.18,
    w: 8.2,
    h: 0.72,
    fontSize: 20,
    color: C.softBlue,
    lineSpacingMultiple: 1.05,
  });
  line(slide, M, 5.38, 7.8, C.red, 3);
  addText(slide, "Condiciones controladas antes de hablar de comportamiento.", {
    x: M,
    y: 5.66,
    w: 8.4,
    h: 0.38,
    fontSize: 16,
    bold: true,
    color: C.sand,
  });
  validateSlide(slide, pptx);
}

/* 08 · Variables invisibles */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.1 · El problema", "El mismo archivo puede vivir en mundos distintos", "Copiar notas.py no copia las condiciones que lo rodean.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  const items = [
    ["01", "PYTHON", "¿Qué versión ejecutó el archivo?", C.red],
    ["02", "HERRAMIENTAS", "¿Qué estaba instalado?", C.navy],
    ["03", "DEPENDENCIAS", "¿Qué versiones resolvió?", C.gold],
    ["04", "PASOS", "¿Qué comandos debemos repetir?", C.success],
  ];
  items.forEach((item, index) => {
    const x = index % 2 === 0 ? M : 6.74;
    const y = index < 2 ? 2.58 : 4.56;
    rect(slide, x, y, 5.82, 1.5, C.white, C.border, 0.06);
    addCircleLabel(slide, x + 0.18, y + 0.22, 0.7, item[3], item[0], { fontSize: 12 });
    addText(slide, item[1], {
      x: x + 1.14,
      y: y + 0.22,
      w: 4.2,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: item[3] === C.gold ? C.ink : item[3],
      charSpacing: 0.8,
    });
    addText(slide, item[2], {
      x: x + 1.14,
      y: y + 0.7,
      w: 4.34,
      h: 0.4,
      fontSize: 17,
      bold: true,
      color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 09 · Pregunta clave */
{
  const { slide } = createSlide("dark");
  addText(slide, "La primera pregunta de calidad", {
    x: M,
    y: 1.04,
    w: 11.88,
    h: 0.42,
    fontSize: 15,
    bold: true,
    color: C.gold,
    align: "center",
    charSpacing: 1.4,
  });
  addText(slide, "Si otra persona recibe esta carpeta…", {
    x: 1.46,
    y: 2.08,
    w: 10.4,
    h: 0.68,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
    align: "center",
  });
  addText(slide, "¿puede reconstruir las mismas condiciones sin adivinar?", {
    x: 1.28,
    y: 3.12,
    w: 10.78,
    h: 1.24,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.gold,
    align: "center",
    valign: "mid",
  });
  rect(slide, 3.18, 5.08, 6.98, 0.78, C.white, C.white, 0.06);
  addText(slide, "REPRODUCIBLE = SIN ADIVINAR", {
    x: 3.42,
    y: 5.33,
    w: 6.5,
    h: 0.24,
    fontSize: 15,
    bold: true,
    color: C.navy,
    align: "center",
    charSpacing: 1.2,
  });
  validateSlide(slide, pptx);
}

/* 10 · Comprobar uv */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.2 · Comprobación", "Primero: ¿uv está disponible?", "La instalación es una contingencia, no el centro de la clase.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.46,
    w: 6.42,
    h: 2.18,
    title: "PowerShell",
    fontSize: 14,
    lines: [
      { prompt: ">", text: "uv --version" },
      { text: "uv 0.x.x", kind: "muted" },
    ],
  });
  addText(slide, "Si responde", {
    x: 7.56,
    y: 2.52,
    w: 2.0,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: C.success,
  });
  addText(slide, "continúa al proyecto", {
    x: 7.56,
    y: 2.94,
    w: 4.2,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: C.ink,
  });
  line(slide, 7.56, 3.62, 4.68, C.border, 1.4);
  addText(slide, "Si no existe", {
    x: 7.56,
    y: 3.92,
    w: 2.0,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: C.red,
  });
  addText(slide, "winget install --id=astral-sh.uv -e", {
    x: 7.56,
    y: 4.34,
    w: 4.72,
    h: 0.42,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  rect(slide, M, 5.46, 11.88, 0.74, C.warningSoft, C.warningSoft, 0.05);
  addText(slide, "Después de instalar: cerrar y volver a abrir la terminal antes de repetir uv --version.", {
    x: M + 0.28,
    y: 5.7,
    w: 11.32,
    h: 0.26,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 11 · Crear proyecto */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.3 · Crear", "Una instrucción, una estructura compartida", "Todos parten desde el mismo comando.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  addTerminalPanel(slide, SH, {
    x: 1.14,
    y: 2.56,
    w: 11.06,
    h: 2.5,
    title: "PowerShell · carpeta de trabajo",
    fontSize: 15,
    lines: [
      { prompt: ">", text: "uv init evidencia-testing" },
      { prompt: ">", text: "cd evidencia-testing" },
      { prompt: ">", text: "Get-ChildItem -Force" },
    ],
  });
  addText(slide, "uv init no descarga una solución terminada.", {
    x: 1.14,
    y: 5.52,
    w: 5.56,
    h: 0.38,
    fontSize: 20,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Crea una base mínima y explícita que podemos inspeccionar.", {
    x: 6.88,
    y: 5.52,
    w: 5.32,
    h: 0.58,
    fontSize: 18,
    color: C.slate,
    lineSpacingMultiple: 1.05,
  });
  validateSlide(slide, pptx);
}

/* 12 · Árbol */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.3 · Inspeccionar", "¿Qué apareció en la carpeta?", "Cada archivo responde una pregunta distinta.");
  rect(slide, M, 2.4, 5.32, 3.94, C.editorBg, C.editorBg, 0.08);
  addText(slide, "evidencia-testing/", {
    x: 1.08,
    y: 2.82,
    w: 4.4,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 17,
    bold: true,
    color: C.terminalPrompt,
  });
  addText(slide, "├── .gitignore\n├── .python-version\n├── README.md\n├── main.py\n└── pyproject.toml", {
    x: 1.08,
    y: 3.42,
    w: 4.44,
    h: 2.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 17,
    color: C.terminalOutput,
    lineSpacingMultiple: 1.06,
  });
  const descriptions = [
    [".python-version", "Python esperado"],
    ["pyproject.toml", "Contrato del proyecto"],
    ["main.py", "Código inicial ejecutable"],
    [".gitignore", "Ruido local que no se comparte"],
  ];
  descriptions.forEach((item, index) => {
    const y = 2.56 + index * 0.9;
    rect(slide, 6.54, y, 0.12, 0.58, index === 1 ? C.red : C.navy, index === 1 ? C.red : C.navy);
    addText(slide, item[0], {
      x: 6.92,
      y,
      w: 2.28,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, item[1], {
      x: 9.3,
      y,
      w: 3.08,
      h: 0.4,
      fontSize: 16,
      color: C.slate,
    });
  });
  rect(slide, 6.54, 6.02, 5.84, 0.44, C.warm, C.warm, 0.04);
  addText(slide, "Todavía no aparece uv.lock: llegará al resolver dependencias.", {
    x: 6.74,
    y: 6.14,
    w: 5.44,
    h: 0.18,
    fontSize: 12.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 13 · uv run */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.3 · Ejecutar", "uv run controla el contexto", "No depende del primer Python que encuentre el sistema.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.42,
    w: 5.54,
    h: 2.18,
    title: "PowerShell",
    fontSize: 14,
    lines: [
      { prompt: ">", text: "uv run main.py" },
      { text: "Hello from evidencia-testing!", kind: "muted" },
    ],
  });
  const stages = [
    ["01", "BUSCA", "el proyecto"],
    ["02", "SINCRONIZA", "el entorno"],
    ["03", "EJECUTA", "el comando"],
  ];
  stages.forEach((item, index) => {
    const x = 6.76 + index * 1.82;
    rect(slide, x, 2.52, 1.52, 2.0, index === 1 ? C.navy : C.white, index === 1 ? C.navy : C.border, 0.06);
    addText(slide, item[0], {
      x: x + 0.16,
      y: 2.8,
      w: 1.2,
      h: 0.24,
      fontSize: 13,
      bold: true,
      color: index === 1 ? C.gold : C.red,
      align: "center",
    });
    addText(slide, item[1], {
      x: x + 0.1,
      y: 3.34,
      w: 1.32,
      h: 0.26,
      fontSize: 11,
      bold: true,
      color: index === 1 ? C.white : C.ink,
      align: "center",
      charSpacing: 0.4,
    });
    addText(slide, item[2], {
      x: x + 0.1,
      y: 3.82,
      w: 1.32,
      h: 0.34,
      fontSize: 13,
      color: index === 1 ? C.softBlue : C.slate,
      align: "center",
    });
    if (index < 2) addArrow(slide, x + 1.56, 3.28, 0.24, C.sand);
  });
  rect(slide, M, 5.26, 11.88, 0.92, C.warningSoft, C.warningSoft, 0.06);
  addText(slide, "La primera ejecución puede tardar: uv está construyendo condiciones declaradas. Las siguientes reutilizan el entorno.", {
    x: M + 0.34,
    y: 5.5,
    w: 11.2,
    h: 0.46,
    fontSize: 16,
    bold: true,
    color: C.ink,
    align: "center",
    lineSpacingMultiple: 1.02,
  });
  validateSlide(slide, pptx);
}

/* 14 · Herramientas */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "1.4 · Declarar", "Las herramientas entran al proyecto", "No dependen de instalaciones invisibles ni de nuestra memoria.", true);
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.34,
    w: 11.88,
    h: 1.36,
    title: "PowerShell · dependencias de desarrollo",
    fontSize: 15,
    lines: [{ prompt: ">", text: "uv add --dev pytest ruff pyrefly" }],
  });
  const tools = ["pytest", "ruff", "pyrefly"];
  tools.forEach((tool, index) => {
    const x = 1.28 + index * 3.72;
    addToolTile(slide, tool, x, 4.28, 3.18, 1.62, { dark: tool !== "pytest" });
  });
  addText(slide, "--dev = herramientas para construir y verificar; no forman parte del producto entregado.", {
    x: 1.42,
    y: 6.24,
    w: 10.5,
    h: 0.34,
    fontSize: 15,
    bold: true,
    color: C.sand,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 15 · pyproject */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.4 · Contrato", "pyproject.toml declara el proyecto", "Qué necesita y bajo qué condiciones espera ejecutarse.");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.36,
    w: 7.12,
    h: 3.84,
    title: "pyproject.toml · lectura conceptual",
    code: `[project]\nname = "evidencia-testing"\nrequires-python = ">=3.12"\ndependencies = []\n\n[dependency-groups]\ndev = ["pytest", "ruff", "pyrefly"]`,
    lang: "toml",
    fontSize: 14,
  });
  const notes = [
    ["IDENTIDAD", "nombre y versión del proyecto", C.red],
    ["PYTHON", "rango admitido", C.navy],
    ["DEPENDENCIAS", "producto versus desarrollo", C.gold],
  ];
  notes.forEach((item, index) => {
    const y = 2.58 + index * 1.1;
    rect(slide, 8.24, y, 0.12, 0.72, item[2], item[2]);
    addText(slide, item[0], {
      x: 8.58,
      y,
      w: 3.58,
      h: 0.24,
      fontSize: 12,
      bold: true,
      color: item[2] === C.gold ? C.ink : item[2],
      charSpacing: 0.8,
    });
    addText(slide, item[1], {
      x: 8.58,
      y: y + 0.38,
      w: 3.58,
      h: 0.32,
      fontSize: 16.5,
      color: C.ink,
    });
  });
  rect(slide, 8.24, 5.94, 4.1, 0.5, C.warm, C.warm, 0.04);
  addText(slide, "Las versiones concretas pueden cambiar; la declaración no puede faltar.", {
    x: 8.44,
    y: 6.05,
    w: 3.7,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 16 · Lock */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.4 · Resolver", "uv.lock conserva la resolución concreta", "La declaración permite; el lockfile registra qué quedó resuelto.");
  rect(slide, M, 2.52, 3.34, 2.66, C.white, C.border, 0.07);
  rect(slide, 5.0, 2.52, 3.34, 2.66, C.navy, C.navy, 0.07);
  rect(slide, 9.18, 2.52, 3.34, 2.66, C.white, C.border, 0.07);
  addText(slide, "pyproject.toml", {
    x: 1.02,
    y: 2.96,
    w: 2.72,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 17,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addText(slide, "declara rangos y grupos", {
    x: 1.06,
    y: 3.72,
    w: 2.64,
    h: 0.56,
    fontSize: 17,
    color: C.slate,
    align: "center",
  });
  slide.addImage({
    path: ASSETS.uv,
    ...imageSizingContain(ASSETS.uv, 6.08, 2.86, 1.18, 1.18),
  });
  addText(slide, "RESUELVE", {
    x: 5.54,
    y: 4.38,
    w: 2.26,
    h: 0.28,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 1,
  });
  addText(slide, "uv.lock", {
    x: 9.66,
    y: 2.96,
    w: 2.36,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addText(slide, "registra versiones concretas", {
    x: 9.62,
    y: 3.72,
    w: 2.44,
    h: 0.56,
    fontSize: 17,
    color: C.slate,
    align: "center",
  });
  addArrow(slide, 4.34, 3.62, 0.42, C.sand);
  addArrow(slide, 8.52, 3.62, 0.42, C.sand);
  rect(slide, 2.18, 5.84, 8.98, 0.62, C.paleRed, C.paleRed, 0.05);
  addText(slide, "uv.lock se comparte y lo administra uv; no se edita manualmente.", {
    x: 2.44,
    y: 6.03,
    w: 8.46,
    h: 0.24,
    fontSize: 15.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 17 · Compartir o reconstruir */
{
  const { slide } = createSlide("light");
  addHeader(slide, "1.5 · Decidir", "Compartimos la receta, no la cocina", "El repositorio conserva instrucciones y código; el equipo reconstruye el entorno local.");
  addText(slide, "SE COMPARTE", {
    x: 1.0,
    y: 2.48,
    w: 4.5,
    h: 0.34,
    fontSize: 14,
    bold: true,
    color: C.success,
    charSpacing: 1.1,
  });
  addText(slide, "SE RECONSTRUYE", {
    x: 7.6,
    y: 2.48,
    w: 4.5,
    h: 0.34,
    fontSize: 14,
    bold: true,
    color: C.red,
    charSpacing: 1.1,
  });
  rect(slide, M, 3.02, 5.54, 2.78, C.successSoft, C.successSoft, 0.08);
  rect(slide, 7.06, 3.02, 5.54, 2.78, C.paleRed, C.paleRed, 0.08);
  const shared = ["pyproject.toml", "uv.lock", ".python-version", "código fuente"];
  shared.forEach((item, index) => {
    rect(slide, 1.08, 3.42 + index * 0.54, 0.28, 0.28, C.success, C.success, 0.14);
    addText(slide, "✓", {
      x: 1.08,
      y: 3.45 + index * 0.54,
      w: 0.28,
      h: 0.14,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
    });
    addText(slide, item, {
      x: 1.58,
      y: 3.39 + index * 0.54,
      w: 3.96,
      h: 0.28,
      fontFace: item.includes(".") ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
  });
  addText(slide, ".venv/", {
    x: 7.62,
    y: 3.48,
    w: 4.42,
    h: 0.52,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 28,
    bold: true,
    color: C.red,
    align: "center",
  });
  addText(slide, "contiene rutas y ejecutables locales", {
    x: 7.7,
    y: 4.28,
    w: 4.26,
    h: 0.44,
    fontSize: 17,
    color: C.ink,
    align: "center",
  });
  addText(slide, "uv la vuelve a crear", {
    x: 7.7,
    y: 5.04,
    w: 4.26,
    h: 0.34,
    fontSize: 16,
    bold: true,
    color: C.slate,
    align: "center",
  });
  addText(slide, "Receta + ingredientes exactos → sí. Cocina completa → no.", {
    x: M,
    y: 6.24,
    w: 11.88,
    h: 0.34,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 18 · Punto de control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de control", "Detenerse también es parte del trabajo", "No avanzamos hasta poder mostrar y explicar estas tres evidencias.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.46,
    w: 6.52,
    h: 2.76,
    title: "PowerShell · comprobación del bloque",
    fontSize: 14,
    lines: [
      { prompt: ">", text: "uv run main.py" },
      { prompt: ">", text: "Get-Content pyproject.toml" },
      { prompt: ">", text: "Get-ChildItem -Force" },
    ],
  });
  const checks = [
    ["01", "main.py se ejecuta"],
    ["02", "las tres herramientas están declaradas"],
    ["03", "uv.lock y .venv existen"],
    ["04", "puedo explicar cuál se comparte"],
  ];
  checks.forEach((item, index) => {
    const y = 2.54 + index * 0.86;
    addCircleLabel(slide, 7.7, y, 0.46, index < 3 ? C.success : C.gold, item[0], {
      fontSize: 10,
      color: index < 3 ? C.white : C.ink,
    });
    addText(slide, item[1], {
      x: 8.42,
      y: y + 0.05,
      w: 3.72,
      h: 0.36,
      fontSize: 17,
      bold: true,
      color: C.ink,
    });
  });
  rect(slide, M, 5.84, 11.88, 0.62, C.warningSoft, C.warningSoft, 0.05);
  addText(slide, "Si algo falla: conservar el mensaje, identificar el comando y corregir sin borrar el proyecto.", {
    x: M + 0.28,
    y: 6.03,
    w: 11.32,
    h: 0.24,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 19 · Preguntas */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Preguntas", "Tres preguntas para llevarse", "La pista orienta; la respuesta todavía la construyes tú.");
  addQuestion(slide, 2.48, 1, "¿Por qué necesitamos uv.lock si pyproject.toml ya enumera dependencias?", "distingue lo permitido de la versión concreta resuelta");
  addQuestion(slide, 3.78, 2, "¿Por qué no conviene compartir la carpeta .venv?", "piensa en rutas, ejecutables y sistema operativo");
  addQuestion(slide, 5.08, 3, "Si uv run main.py termina bien, ¿ya demostramos que nota_final() calcula correctamente?", "separa condiciones de ejecución y comportamiento");
  validateSlide(slide, pptx);
}

/* 20 · Cierre y puente */
{
  const { slide } = createSlide("dark");
  addText(slide, "IDEA CLAVE · BLOQUE 1", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Controlamos dónde", {
    x: M,
    y: 1.66,
    w: 8.1,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.white,
  });
  addText(slide, "y con qué se ejecuta", {
    x: M,
    y: 2.48,
    w: 7.8,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Todavía no hemos demostrado que el comportamiento sea correcto.", {
    x: M,
    y: 3.68,
    w: 7.9,
    h: 0.62,
    fontSize: 20,
    color: C.softBlue,
  });
  const tools = ["uv", "ruff", "pyrefly", "pytest"];
  tools.forEach((tool, index) => addToolTile(slide, tool, 8.94 + (index % 2) * 1.62, 1.54 + Math.floor(index / 2) * 1.58, 1.4, 1.2, { dark: tool !== "pytest" }));
  rect(slide, M, 5.08, 11.88, 0.94, C.white, C.white, 0.06);
  addText(slide, "SIGUE → cuatro herramientas, cuatro preguntas distintas", {
    x: M + 0.34,
    y: 5.38,
    w: 11.2,
    h: 0.3,
    fontSize: 19,
    bold: true,
    color: C.navy,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 21 · Apertura Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 2 · 25 MINUTOS", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Cuatro capas,", {
    x: M,
    y: 1.56,
    w: 8.5,
    h: 0.78,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.white,
  });
  addText(slide, "evidencias distintas", {
    x: M,
    y: 2.42,
    w: 9.4,
    h: 0.82,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.gold,
  });
  addText(slide, "El mismo color verde no significa la misma afirmación.", {
    x: M,
    y: 3.52,
    w: 9.4,
    h: 0.42,
    fontSize: 19,
    color: C.softBlue,
  });
  const layers = [
    ["uv", "ENTORNO"],
    ["ruff", "CÓDIGO"],
    ["pyrefly", "CONTRATOS"],
    ["pytest", "COMPORTAMIENTO"],
  ];
  layers.forEach((layer, index) => {
    const x = M + index * 3.02;
    addToolTile(slide, layer[0], x, 4.54, 2.62, 1.38, { dark: layer[0] !== "pytest" });
    addText(slide, layer[1], {
      x,
      y: 6.08,
      w: 2.62,
      h: 0.22,
      fontSize: 10.5,
      bold: true,
      color: layer[0] === "pytest" ? C.gold : C.sand,
      align: "center",
      charSpacing: 1.2,
    });
  });
  validateSlide(slide, pptx);
}

/* 22 · Verde con apellido */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.1 · Principio", "Verde siempre necesita apellido", "Cada control permite una conclusión distinta y limitada.");
  addText(slide, "VERDE", {
    x: M,
    y: 2.48,
    w: 4.8,
    h: 0.88,
    fontFace: TYPOGRAPHY.display,
    fontSize: 48,
    bold: true,
    color: C.success,
  });
  addText(slide, "no significa", {
    x: M,
    y: 3.42,
    w: 4.8,
    h: 0.52,
    fontSize: 23,
    color: C.slate,
  });
  addText(slide, "«todo está correcto»", {
    x: M,
    y: 4.04,
    w: 5.18,
    h: 0.62,
    fontFace: TYPOGRAPHY.display,
    fontSize: 29,
    bold: true,
    color: C.red,
  });
  line(slide, M, 5.04, 4.84, C.red, 3);
  addText(slide, "La conclusión debe nombrar qué observó realmente la herramienta.", {
    x: M,
    y: 5.34,
    w: 5.02,
    h: 0.72,
    fontSize: 17,
    color: C.ink,
  });

  const claims = [
    ["uv", "el entorno está sincronizado", C.navy],
    ["Ruff", "no encontró infracciones activas", C.red],
    ["Pyrefly", "no encontró contradicciones de tipos", C.gold],
    ["pytest", "los casos ejecutados cumplieron su expectativa", C.success],
  ];
  claims.forEach((claim, index) => {
    const y = 2.38 + index * 0.94;
    rect(slide, 6.34, y, 6.28, 0.76, index === 3 ? C.successSoft : C.white, C.border, 0.06);
    rect(slide, 6.56, y + 0.14, 1.08, 0.48, claim[2], claim[2], 0.24);
    addText(slide, claim[0], {
      x: 6.56,
      y: y + 0.28,
      w: 1.08,
      h: 0.16,
      fontSize: 10.5,
      bold: true,
      color: claim[2] === C.gold ? C.ink : C.white,
      align: "center",
    });
    addText(slide, claim[1], {
      x: 7.92,
      y: y + 0.22,
      w: 4.36,
      h: 0.32,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

/* 23 · Mapa de capas */
{
  const { slide } = createSlide("dark");
  addHeader(slide, "2.1 · Mapa", "Una cadena de preguntas", "Una herramienta en verde no cancela la necesidad de la siguiente.", true);
  const layers = [
    ["uv", "ENTORNO", "¿se reproduce?"],
    ["ruff", "CÓDIGO", "¿hay señales de problema?"],
    ["pyrefly", "CONTRATOS", "¿los tipos son coherentes?"],
    ["pytest", "COMPORTAMIENTO", "¿hace lo esperado?"],
  ];
  layers.forEach((layer, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 2.44, 2.62, 3.16, index === 3 ? C.white : C.titleFill, index === 3 ? C.white : C.titleFill, 0.08);
    addToolTile(slide, layer[0], x + 0.42, 2.72, 1.78, 1.18, { dark: layer[0] !== "pytest" });
    addText(slide, layer[1], {
      x: x + 0.22,
      y: 4.14,
      w: 2.18,
      h: 0.22,
      fontSize: 10.5,
      bold: true,
      color: index === 3 ? C.red : C.gold,
      align: "center",
      charSpacing: 1,
    });
    addText(slide, layer[2], {
      x: x + 0.3,
      y: 4.58,
      w: 2.02,
      h: 0.58,
      fontSize: 17,
      bold: true,
      color: index === 3 ? C.ink : C.white,
      align: "center",
      valign: "mid",
    });
    if (index < layers.length - 1) addArrow(slide, x + 2.69, 3.72, 0.26, C.red);
  });
  rect(slide, M, 6.02, 11.88, 0.58, C.gold, C.gold, 0.04);
  addText(slide, "Cada capa agrega evidencia; ninguna obtiene permiso para prometer más de lo que observó.", {
    x: 1.0,
    y: 6.2,
    w: 11.32,
    h: 0.22,
    fontSize: 14.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 24 · Archivo defectuoso anotado */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.2 · Preparar", "Dos problemas viven en capas distintas", "Leemos el archivo antes de pedirle una respuesta a las herramientas.");
  const code = `import math\n\n\ndef nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio redondeado a un decimal.\"\"\"\n    promedio: str = sum(notas) / len(notas)\n    return round(promedio, 1)`;
  addCodeGuide(slide, SH, {
    editor: {
      x: M,
      y: 2.34,
      w: 7.16,
      h: 3.96,
      title: "notas.py · versión deliberadamente defectuosa",
      code,
      lang: "python",
      fontSize: 13.5,
    },
    guide: { x: 8.62, y: 2.34, w: 3.76, h: 3.96, title: "Dos señales, dos capas" },
    notes: [
      {
        lineNumber: 1,
        color: C.red,
        eyebrow: "Señal estructural",
        title: "Importación sin uso",
        body: "math está presente, pero ninguna línea del archivo lo necesita.",
      },
      {
        lineNumber: 6,
        color: C.gold,
        eyebrow: "Contrato de tipos",
        title: "Anotación contradictoria",
        titleFontSize: 16,
        bodyFontSize: 12.8,
        body: "La división produce un número; promedio declara str.",
      },
    ],
  });
  validateSlide(slide, pptx);
}

/* 25 · Predicción */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.2 · Antes de ejecutar", "Primero formulamos una hipótesis", "No buscamos adivinar el mensaje exacto; buscamos saber qué evidencia esperamos.");
  const prompts = [
    ["01", "¿Qué línea parece innecesaria?", "Busca algo presente en el archivo que no participa en ningún cálculo.", C.red],
    ["02", "¿Qué afirmación contradice el valor real?", "Compara el tipo declarado de promedio con el resultado de una división.", C.gold],
  ];
  prompts.forEach((prompt, index) => {
    const x = index === 0 ? M : 6.88;
    rect(slide, x, 2.42, 5.7, 2.7, index === 0 ? C.paleRed : C.warningSoft, index === 0 ? C.paleRed : C.warningSoft, 0.08);
    addCircleLabel(slide, x + 0.3, 2.72, 0.64, prompt[3], prompt[0], {
      fontSize: 12,
      color: prompt[3] === C.gold ? C.ink : C.white,
    });
    addText(slide, prompt[1], {
      x: x + 1.22,
      y: 2.7,
      w: 4.08,
      h: 0.72,
      fontFace: TYPOGRAPHY.display,
      fontSize: 23,
      bold: true,
      color: C.ink,
    });
    addText(slide, prompt[2], {
      x: x + 0.34,
      y: 3.76,
      w: 4.96,
      h: 0.62,
      fontSize: 16,
      color: C.slate,
      align: "center",
      valign: "mid",
    });
  });
  rect(slide, M, 5.56, 11.86, 0.92, C.navy, C.navy, 0.06);
  addText(slide, "HIPÓTESIS", { x: 1.36, y: 5.88, w: 2.1, h: 0.24, fontSize: 15, bold: true, color: C.white, align: "center", charSpacing: 1 });
  addArrow(slide, 3.66, 5.76, 0.72, C.red);
  addText(slide, "CONTROL", { x: 4.58, y: 5.88, w: 2.1, h: 0.24, fontSize: 15, bold: true, color: C.white, align: "center", charSpacing: 1 });
  addArrow(slide, 6.88, 5.76, 0.72, C.red);
  addText(slide, "EVIDENCIA", { x: 7.82, y: 5.88, w: 2.1, h: 0.24, fontSize: 15, bold: true, color: C.white, align: "center", charSpacing: 1 });
  addText(slide, "→ decisión", { x: 10.16, y: 5.9, w: 1.68, h: 0.22, fontSize: 14, bold: true, color: C.gold, align: "center" });
  validateSlide(slide, pptx);
}

/* 26 · Apertura Ruff */
{
  const { slide } = createSlide("dark");
  addText(slide, "PRIMERA CAPA ESTÁTICA", {
    x: M,
    y: 0.86,
    w: 4.8,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Ruff busca", {
    x: M,
    y: 1.74,
    w: 7.8,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 41,
    bold: true,
    color: C.white,
  });
  addText(slide, "señales de código", {
    x: M,
    y: 2.58,
    w: 8.1,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 41,
    bold: true,
    color: C.gold,
  });
  addText(slide, "No necesita ejecutar nota_final() para descubrir una importación innecesaria.", {
    x: M,
    y: 3.7,
    w: 7.74,
    h: 0.72,
    fontSize: 19,
    color: C.softBlue,
  });
  rect(slide, M, 5.04, 7.62, 0.86, C.terminalBg, C.terminalBg, 0.06);
  addText(slide, ">  uv run ruff check .", {
    x: 1.08,
    y: 5.31,
    w: 6.9,
    h: 0.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    bold: true,
    color: C.terminalPrompt,
  });
  slide.addImage({
    path: ASSETS.ruff,
    ...imageSizingContain(ASSETS.ruff, 9.18, 1.56, 2.72, 3.42),
  });
  addText(slide, "LINTER", {
    x: 9.34,
    y: 5.16,
    w: 2.4,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.sand,
    align: "center",
    charSpacing: 2,
  });
  validateSlide(slide, pptx);
}

/* 27 · Ruff ejecuta */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Ejecutar", "Ruff entrega un hallazgo localizado", "Leemos la salida antes de tocar el archivo.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.36,
    w: 8.02,
    h: 3.54,
    title: "PowerShell · evidencia de Ruff",
    fontSize: 13.5,
    lines: [
      { prompt: ">", text: "uv run ruff check ." },
      { text: "notas.py:1:8: F401 `math` imported but unused" },
      { text: "Found 1 error." },
    ],
  });
  const reading = [
    ["01", "UBICACIÓN", "notas.py · línea 1 · columna 8", C.red],
    ["02", "REGLA", "F401 identifica la categoría", C.navy],
    ["03", "MENSAJE", "math fue importado, pero no usado", C.gold],
  ];
  reading.forEach((item, index) => {
    const y = 2.5 + index * 1.14;
    rect(slide, 9.08, y, 3.54, 0.92, C.white, C.border, 0.06);
    addCircleLabel(slide, 9.26, y + 0.22, 0.48, item[3], item[0], { fontSize: 10, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: 9.96, y: y + 0.16, w: 2.2, h: 0.18, fontSize: 10, bold: true, color: item[3] === C.gold ? C.ink : item[3], charSpacing: 0.8 });
    addText(slide, item[2], { x: 9.96, y: y + 0.46, w: 2.28, h: 0.3, fontSize: 13.5, bold: true, color: C.ink });
  });
  rect(slide, M, 6.18, 11.88, 0.48, C.warningSoft, C.warningSoft, 0.04);
  addText(slide, "Hallazgo concreto: código innecesario. Ruff todavía no ha evaluado el resultado de la función.", {
    x: 1.02,
    y: 6.33,
    w: 11.26,
    h: 0.2,
    fontSize: 13.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 28 · Anatomía Ruff */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Interpretar", "Un diagnóstico tiene anatomía", "Separar sus piezas evita reaccionar a ciegas.");
  rect(slide, M, 2.34, 11.88, 0.92, C.terminalBg, C.terminalBg, 0.06);
  addText(slide, "notas.py:1:8     F401     `math` imported but unused", {
    x: 1.02,
    y: 2.64,
    w: 11.28,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    bold: true,
    color: C.terminalOutput,
    align: "center",
  });
  const parts = [
    ["ARCHIVO", "notas.py", "dónde mirar", C.red],
    ["COORDENADAS", "1 : 8", "línea y columna", C.navy],
    ["REGLA", "F401", "cómo clasificar", C.gold],
    ["EXPLICACIÓN", "imported but unused", "qué observó", C.success],
  ];
  parts.forEach((part, index) => {
    const x = M + index * 3.02;
    rect(slide, x, 3.78, 2.62, 2.04, C.white, C.border, 0.06);
    rect(slide, x, 3.78, 2.62, 0.12, part[3], part[3]);
    addText(slide, part[0], { x: x + 0.22, y: 4.16, w: 2.18, h: 0.2, fontSize: 10, bold: true, color: part[3] === C.gold ? C.ink : part[3], align: "center", charSpacing: 0.9 });
    addText(slide, part[1], { x: x + 0.18, y: 4.64, w: 2.26, h: 0.42, fontFace: index === 3 ? TYPOGRAPHY.body : TYPOGRAPHY.mono, fontSize: index === 3 ? 15 : 21, bold: true, color: C.ink, align: "center", valign: "mid" });
    addText(slide, part[2], { x: x + 0.22, y: 5.36, w: 2.18, h: 0.2, fontSize: 13, color: C.slate, align: "center" });
  });
  addText(slide, "Leer ubicación → regla → explicación antes de corregir.", {
    x: M,
    y: 6.18,
    w: 11.88,
    h: 0.28,
    fontSize: 17,
    bold: true,
    color: C.red,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 29 · Corrección Ruff */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.3 · Corregir", "La corrección debe ser mínima y verificable", "Eliminamos solo el hallazgo que Ruff explicó.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 5.18,
    h: 2.76,
    title: "ANTES · notas.py",
    code: `import math\n\ndef nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio redondeado.\"\"\"\n    promedio: str = sum(notas) / len(notas)\n    return round(promedio, 1)`,
    lang: "python",
    fontSize: 12.2,
    annotations: [{ lineNumber: 1, column: 1, length: 11, color: C.red }],
  });
  addArrow(slide, 6.12, 3.68, 0.72, C.red);
  addCodePanel(slide, SH, {
    x: 7.16,
    y: 2.54,
    w: 5.46,
    h: 2.76,
    title: "DESPUÉS · notas.py",
    code: `def nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio redondeado.\"\"\"\n    promedio: str = sum(notas) / len(notas)\n    return round(promedio, 1)`,
    lang: "python",
    fontSize: 12.2,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.58,
    w: 11.88,
    h: 1.08,
    title: "PowerShell · repetir el mismo control",
    fontSize: 13.5,
    lines: [
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
    ],
  });
  validateSlide(slide, pptx);
}

/* 30 · Límite Ruff */
{
  const { slide } = createSlide("dark");
  addText(slide, "VERDE CON APELLIDO", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "RUFF", {
    x: M,
    y: 1.6,
    w: 2.72,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  addText(slide, "✓", {
    x: 3.5,
    y: 1.52,
    w: 0.86,
    h: 0.78,
    fontSize: 42,
    bold: true,
    color: C.success,
    align: "center",
  });
  addText(slide, "No encontró infracciones entre las reglas activas.", {
    x: M,
    y: 2.66,
    w: 4.66,
    h: 0.82,
    fontSize: 22,
    bold: true,
    color: C.softBlue,
  });
  addText(slide, "Eso es evidencia útil. No es una garantía universal.", {
    x: M,
    y: 4.02,
    w: 4.82,
    h: 0.72,
    fontSize: 17,
    color: C.sand,
  });
  const limits = [
    ["TIPOS", "promedio todavía declara str", C.gold],
    ["NEGOCIO", "3.95 todavía puede convertirse en 3.9", C.red],
    ["CASOS", "ningún ejemplo funcional fue ejecutado", C.success],
  ];
  limits.forEach((limit, index) => {
    const y = 1.64 + index * 1.42;
    rect(slide, 6.46, y, 5.72, 1.08, C.titleFill, C.titleFill, 0.06);
    rect(slide, 6.68, y + 0.22, 1.12, 0.52, limit[2], limit[2], 0.26);
    addText(slide, limit[0], { x: 6.68, y: y + 0.37, w: 1.12, h: 0.16, fontSize: 9.5, bold: true, color: limit[2] === C.gold ? C.ink : C.white, align: "center" });
    addText(slide, limit[1], { x: 8.08, y: y + 0.26, w: 3.72, h: 0.5, fontSize: 16, bold: true, color: C.white, valign: "mid" });
  });
  rect(slide, M, 5.98, 11.46, 0.58, C.white, C.white, 0.04);
  addText(slide, "SIGUE → una contradicción que pertenece a otra capa", {
    x: 1.02,
    y: 6.17,
    w: 10.86,
    h: 0.22,
    fontSize: 15,
    bold: true,
    color: C.navy,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 31 · Apertura Pyrefly */
{
  const { slide } = createSlide("dark");
  addText(slide, "SEGUNDA CAPA ESTÁTICA", {
    x: M,
    y: 0.86,
    w: 4.8,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Pyrefly observa", {
    x: M,
    y: 1.66,
    w: 7.9,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "contratos de tipos", {
    x: M,
    y: 2.5,
    w: 8.2,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Primero dejamos visible y compartible el criterio de análisis del proyecto.", {
    x: M,
    y: 3.6,
    w: 7.68,
    h: 0.72,
    fontSize: 19,
    color: C.softBlue,
  });
  rect(slide, M, 4.82, 7.56, 0.82, C.terminalBg, C.terminalBg, 0.06);
  addText(slide, ">  uv run pyrefly init", {
    x: 1.08,
    y: 5.08,
    w: 6.74,
    h: 0.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    bold: true,
    color: C.terminalPrompt,
  });
  rect(slide, M, 5.86, 7.56, 0.58, C.titleFill, C.titleFill, 0.04);
  addText(slide, "¿Agregar supresiones para ocultar los errores?  →  N", {
    x: 1.02,
    y: 6.04,
    w: 6.92,
    h: 0.22,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
  });
  slide.addImage({
    path: ASSETS.pyreflyInvert,
    ...imageSizingContain(ASSETS.pyreflyInvert, 9.0, 1.62, 3.04, 3.18),
  });
  addText(slide, "TIPOS DECLARADOS ↔ VALORES INFERIDOS", {
    x: 8.72,
    y: 5.22,
    w: 3.62,
    h: 0.44,
    fontSize: 11,
    bold: true,
    color: C.sand,
    align: "center",
    charSpacing: 1,
  });
  validateSlide(slide, pptx);
}

/* 32 · Contrato incompatible */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.4 · Contrato", "Una línea afirma dos cosas incompatibles", "La anotación escrita y el valor producido no pueden ser verdad al mismo tiempo.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  const code = `def nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio redondeado a un decimal.\"\"\"\n\n    promedio: str = sum(notas) / len(notas)\n    return round(promedio, 1)`;
  addCodeGuide(slide, SH, {
    editor: {
      x: M,
      y: 2.56,
      w: 7.18,
      h: 3.66,
      title: "notas.py · contrato declarado",
      code,
      lang: "python",
      fontSize: 13.8,
    },
    guide: { x: 8.58, y: 2.56, w: 3.8, h: 3.66, title: "Contrato bajo lectura" },
    notes: [
      {
        lineNumber: 4,
        color: C.red,
        eyebrow: "Contrato incompatible",
        title: "str ≠ float",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 25,
        titleH: 0.42,
        bodyY: 1.1,
        bodyH: 1.42,
        bodyFontSize: 15,
        body: "Declarado:  str\nInferido:    float\n\nLa división produce un número, no texto.",
      },
    ],
  });
  validateSlide(slide, pptx);
}

/* 33 · Pyrefly ejecuta */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.4 · Ejecutar", "Pyrefly confronta el contrato", "La forma exacta del mensaje puede variar; la contradicción permanece.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.34,
    w: 8.22,
    h: 3.7,
    title: "PowerShell · salida representativa de Pyrefly",
    fontSize: 12.7,
    lines: [
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "notas.py:4  incompatible assignment" },
      { text: "declared: str" },
      { text: "inferred: float" },
      { text: "notas.py:5  round() received str" },
    ],
  });
  rect(slide, 9.24, 2.56, 3.38, 1.34, C.softBlue, C.softBlue, 0.06);
  addText(slide, "HALLAZGO 1", { x: 9.52, y: 2.82, w: 2.84, h: 0.18, fontSize: 9.5, bold: true, color: C.navy, charSpacing: 1 });
  addText(slide, "float asignado a str", { x: 9.52, y: 3.18, w: 2.84, h: 0.28, fontSize: 18, bold: true, color: C.ink });
  rect(slide, 9.24, 4.22, 3.38, 1.34, C.warningSoft, C.warningSoft, 0.06);
  addText(slide, "HALLAZGO 2", { x: 9.52, y: 4.48, w: 2.84, h: 0.18, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 1 });
  addText(slide, "round() recibe texto", { x: 9.52, y: 4.84, w: 2.84, h: 0.28, fontSize: 18, bold: true, color: C.ink });
  rect(slide, M, 6.24, 11.9, 0.42, C.navy, C.navy, 0.04);
  addText(slide, "Un contrato incoherente puede generar más de un síntoma; buscamos la causa común.", {
    x: 1.02,
    y: 6.36,
    w: 11.28,
    h: 0.18,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 34 · Anatomía Pyrefly */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.4 · Interpretar", "La incompatibilidad se reconstruye", "La herramienta entrega evidencia; nosotros hacemos explícito el razonamiento.");
  rect(slide, M, 2.38, 11.88, 3.82, C.navy, C.navy, 0.08);
  addText(slide, "TRAZA DE RAZONAMIENTO", { x: 1.06, y: 2.7, w: 3.2, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.4 });
  rect(slide, 9.18, 2.62, 2.94, 0.46, C.titleFill, C.titleFill, 0.05);
  addText(slide, "01 · notas.py · línea 4", { x: 9.18, y: 2.62, w: 2.94, h: 0.46, fontFace: TYPOGRAPHY.mono, fontSize: 10.5, bold: true, color: C.white, align: "center", valign: "mid" });

  rect(slide, 1.04, 3.28, 4.18, 0.98, C.white, C.white, 0.06);
  rect(slide, 1.04, 3.28, 0.11, 0.98, C.red, C.red);
  addText(slide, "02 · DECLARADO", { x: 1.38, y: 3.5, w: 1.68, h: 0.18, fontSize: 9.5, bold: true, color: C.red, charSpacing: 0.8 });
  addText(slide, "promedio: str", { x: 3.04, y: 3.44, w: 1.78, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 17.5, bold: true, color: C.ink, align: "right" });
  addText(slide, "La anotación promete texto.", { x: 1.38, y: 3.82, w: 3.44, h: 0.2, fontSize: 12.5, color: C.slate });

  rect(slide, 1.04, 4.56, 4.18, 0.98, C.white, C.white, 0.06);
  rect(slide, 1.04, 4.56, 0.11, 0.98, C.gold, C.gold);
  addText(slide, "03 · INFERIDO", { x: 1.38, y: 4.78, w: 1.68, h: 0.18, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 0.8 });
  addText(slide, "división → float", { x: 2.82, y: 4.72, w: 2.0, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 17.5, bold: true, color: C.navy, align: "right" });
  addText(slide, "La expresión produce un número.", { x: 1.38, y: 5.1, w: 3.44, h: 0.2, fontSize: 12.5, color: C.slate });

  addText(slide, "≠", { x: 5.48, y: 3.76, w: 0.88, h: 0.78, fontFace: TYPOGRAPHY.display, fontSize: 43, bold: true, color: C.red, align: "center", valign: "mid" });
  addArrow(slide, 5.42, 4.68, 0.98, C.red);

  rect(slide, 6.72, 3.28, 5.38, 2.26, C.white, C.white, 0.06);
  rect(slide, 6.72, 3.28, 5.38, 0.12, C.red, C.red);
  addText(slide, "04 · CONFLICTO", { x: 7.06, y: 3.68, w: 2.28, h: 0.2, fontSize: 10, bold: true, color: C.red, charSpacing: 1 });
  addText(slide, "str y float no pueden describir el mismo valor", { x: 7.06, y: 4.08, w: 4.68, h: 0.54, fontSize: 20, bold: true, color: C.ink, valign: "mid" });
  rect(slide, 7.06, 4.82, 4.68, 0.48, C.successSoft, C.successSoft, 0.04);
  addText(slide, "CORRECCIÓN MÍNIMA  ·  str → float", { x: 7.06, y: 4.82, w: 4.68, h: 0.48, fontFace: TYPOGRAPHY.mono, fontSize: 12.5, bold: true, color: C.success, align: "center", valign: "mid" });

  addText(slide, "Ubicar → comparar lo declarado con lo inferido → explicar → recién entonces corregir.", { x: M, y: 6.38, w: 11.88, h: 0.26, fontSize: 15, bold: true, color: C.red, align: "center" });
  validateSlide(slide, pptx);
}

/* 35 · Corrección Pyrefly */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.4 · Corregir", "Cambiamos la afirmación, no el cálculo", "La corrección mínima hace visible el tipo que la operación realmente produce.");
  addCodeGuide(slide, SH, {
    editor: {
      x: M,
      y: 2.36,
      w: 7.08,
      h: 2.88,
      title: "notas.py · contrato corregido",
      code: `def nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio redondeado a un decimal.\"\"\"\n    promedio: float = sum(notas) / len(notas)\n    return round(promedio, 1)`,
      lang: "python",
      fontSize: 13.2,
    },
    guide: { x: 8.54, y: 2.36, w: 3.84, h: 2.88, title: "Corrección mínima", accent: C.success },
    notes: [
      {
        lineNumber: 3,
        color: C.success,
        eyebrow: "Contrato alineado",
        title: "promedio: float",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 21,
        titleH: 0.38,
        bodyY: 1.12,
        bodyH: 0.62,
        bodyFontSize: 14.5,
        body: "El cálculo no cambió. La declaración ahora describe el valor real.",
      },
    ],
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.52,
    w: 11.88,
    h: 1.12,
    title: "PowerShell · volver a comprobar ambas capas estáticas",
    fontSize: 12.8,
    lines: [
      { prompt: ">", text: "uv run ruff check .      → All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check     → 0 errors" },
    ],
  });
  validateSlide(slide, pptx);
}

/* 36 · Dos verdes, un defecto */
{
  const { slide } = createSlide("dark");
  addText(slide, "DOS CONTROLES VERDES", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "El comportamiento", {
    x: M,
    y: 1.5,
    w: 7.86,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 37,
    bold: true,
    color: C.white,
  });
  addText(slide, "todavía puede estar equivocado", {
    x: M,
    y: 2.24,
    w: 8.16,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 37,
    bold: true,
    color: C.gold,
  });
  addToolTile(slide, "ruff", 9.12, 1.36, 1.42, 1.16, { dark: true });
  addToolTile(slide, "pyrefly", 10.88, 1.36, 1.42, 1.16, { dark: true });
  rect(slide, M, 3.42, 5.22, 2.08, C.terminalBg, C.terminalBg, 0.06);
  addText(slide, "> uv run python -c \"...nota_final(...)\"", {
    x: 1.02,
    y: 3.74,
    w: 4.58,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    color: C.terminalPrompt,
  });
  addText(slide, "3.9", {
    x: 1.06,
    y: 4.38,
    w: 4.48,
    h: 0.62,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 34,
    bold: true,
    color: C.white,
    align: "center",
  });
  addText(slide, "≠", {
    x: 6.1,
    y: 4.06,
    w: 0.9,
    h: 0.72,
    fontSize: 38,
    bold: true,
    color: C.red,
    align: "center",
  });
  rect(slide, 7.44, 3.42, 5.18, 2.08, C.white, C.white, 0.06);
  addText(slide, "REGLA ACORDADA", { x: 7.82, y: 3.78, w: 4.42, h: 0.2, fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 1.2 });
  addText(slide, "4.0", { x: 7.82, y: 4.28, w: 4.42, h: 0.62, fontFace: TYPOGRAPHY.mono, fontSize: 34, bold: true, color: C.navy, align: "center" });
  addText(slide, "El defecto contradice una expectativa de negocio, no una regla de linting ni un tipo.", {
    x: M,
    y: 5.92,
    w: 11.88,
    h: 0.5,
    fontSize: 17,
    bold: true,
    color: C.softBlue,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 37 · Agente como traductor */
{
  const { slide } = createSlide("light");
  addHeader(slide, "2.6 · Uso del agente", "Traductor de diagnósticos, no piloto automático", "La explicación puede delegarse; la decisión y la verificación no.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  rect(slide, M, 2.64, 7.44, 3.1, C.navy, C.navy, 0.08);
  addText(slide, "SOLICITUD ÚTIL", { x: 1.06, y: 2.76, w: 2.2, h: 0.2, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.2 });
  addText(slide, "«Explica este diagnóstico indicando…»", { x: 1.06, y: 3.22, w: 6.7, h: 0.44, fontSize: 21, bold: true, color: C.white });
  const asks = ["archivo y ubicación", "regla o contrato", "causa probable", "dos correcciones posibles"];
  asks.forEach((ask, index) => {
    const x = 1.08 + (index % 2) * 3.22;
    const y = 4.04 + Math.floor(index / 2) * 0.72;
    rect(slide, x, y, 2.86, 0.5, C.titleFill, C.titleFill, 0.25);
    addText(slide, ask, { x: x + 0.18, y: y + 0.15, w: 2.5, h: 0.18, fontSize: 12.5, bold: true, color: C.white, align: "center" });
  });
  rect(slide, 8.54, 2.64, 4.08, 3.1, C.paleRed, C.paleRed, 0.08);
  addText(slide, "EVITAR", { x: 8.9, y: 2.9, w: 1.42, h: 0.2, fontSize: 10.5, bold: true, color: C.red, charSpacing: 1.2 });
  addText(slide, "«Arregla todos los errores»", { x: 8.9, y: 3.42, w: 3.36, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: C.red, align: "center" });
  addText(slide, "Puede producir verde sin dejar claro qué cambió, por qué era válido ni qué riesgo sigue abierto.", { x: 8.96, y: 4.46, w: 3.24, h: 0.72, fontSize: 14.5, color: C.ink, align: "center" });
  rect(slide, M, 6.08, 11.9, 0.52, C.successSoft, C.successSoft, 0.04);
  addText(slide, "diagnóstico completo  →  explicación  →  decisión humana  →  repetir el control original", {
    x: 1.0,
    y: 6.24,
    w: 11.3,
    h: 0.2,
    fontSize: 13.5,
    bold: true,
    color: C.ink,
    align: "center",
  });
  validateSlide(slide, pptx);
}

/* 38 · Punto de control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de control", "Mostrar no basta: hay que explicar", "Dos comandos verdes y tres diferencias comprendidas.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.4,
    w: 6.36,
    h: 2.86,
    title: "PowerShell · comprobación del bloque",
    fontSize: 13.5,
    lines: [
      { prompt: ">", text: "uv run ruff check ." },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "0 errors" },
    ],
  });
  const evidence = [
    ["01", "Ruff", "qué problema estructural detectó", C.red],
    ["02", "Pyrefly", "qué contradicción de tipos detectó", C.navy],
    ["03", "Límite", "por qué ninguno encontró el redondeo", C.gold],
  ];
  evidence.forEach((item, index) => {
    const y = 2.46 + index * 1.14;
    rect(slide, 7.48, y, 5.14, 0.92, C.white, C.border, 0.06);
    addCircleLabel(slide, 7.7, y + 0.22, 0.48, item[3], item[0], { fontSize: 10, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: 8.42, y: y + 0.16, w: 1.16, h: 0.22, fontSize: 16, bold: true, color: C.ink });
    addText(slide, item[2], { x: 9.58, y: y + 0.18, w: 2.66, h: 0.48, fontSize: 13.5, color: C.slate, valign: "mid" });
  });
  rect(slide, M, 5.72, 11.9, 0.82, C.navy, C.navy, 0.06);
  addText(slide, "EVIDENCIA DEL BLOQUE", { x: 1.0, y: 5.92, w: 2.36, h: 0.18, fontSize: 9.5, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "un hallazgo de linting + una contradicción de tipos + un límite demostrado", { x: 3.5, y: 5.9, w: 8.68, h: 0.24, fontSize: 15.5, bold: true, color: C.white, align: "center" });
  validateSlide(slide, pptx);
}

/* 39 · Preguntas Bloque 2 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Preguntas", "Tres preguntas para llevarse", "La pista orienta; la respuesta debe nombrar la capa y la evidencia.");
  addQuestion(slide, 2.46, 1, "¿Cómo puede Ruff quedar en verde mientras Pyrefly todavía encuentra un problema?", "compara estructura del código y contratos de tipos");
  addQuestion(slide, 3.8, 2, "¿Por qué debemos repetir el mismo comando después de modificar el archivo?", "distingue una edición de la evidencia que confirma su efecto");
  addQuestion(slide, 5.1, 3, "Si Ruff y Pyrefly quedan en verde, ¿qué defecto de nota_final() sigue sin estar cubierto?", "recuerda la regla de redondeo del contexto educativo chileno");
  validateSlide(slide, pptx);
}

/* 40 · Cierre Bloque 2 */
{
  const { slide } = createSlide("dark");
  addText(slide, "IDEA CLAVE · BLOQUE 2", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Dos verdes", {
    x: M,
    y: 1.58,
    w: 6.0,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 41,
    bold: true,
    color: C.white,
  });
  addText(slide, "todavía no bastan", {
    x: M,
    y: 2.42,
    w: 7.3,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 41,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Ruff observa señales. Pyrefly observa contratos. La expectativa 3.95 → 4.0 pertenece al comportamiento.", {
    x: M,
    y: 3.56,
    w: 7.28,
    h: 1.08,
    fontSize: 19,
    color: C.softBlue,
  });
  const stages = [
    ["ruff", "SEÑALES", C.red],
    ["pyrefly", "CONTRATOS", C.gold],
    ["pytest", "COMPORTAMIENTO", C.success],
  ];
  stages.forEach((stage, index) => {
    const x = 8.16 + (index % 2) * 2.18;
    const y = index < 2 ? 1.56 : 3.58;
    addToolTile(slide, stage[0], x, y, 1.82, 1.36, { dark: stage[0] !== "pytest" });
    addText(slide, stage[1], { x: x - 0.06, y: y + 1.56, w: 1.94, h: 0.2, fontSize: 9.5, bold: true, color: stage[2], align: "center", charSpacing: 0.8 });
  });
  rect(slide, M, 5.36, 11.88, 0.92, C.white, C.white, 0.06);
  addText(slide, "PAUSA · 10 MIN", { x: 1.02, y: 5.58, w: 2.18, h: 0.2, fontSize: 11, bold: true, color: C.red, charSpacing: 1.2 });
  addText(slide, "DESPUÉS → convertimos 3.95 → 4.0 en una prueba repetible", { x: 3.2, y: 5.54, w: 8.54, h: 0.28, fontSize: 17, bold: true, color: C.navy, align: "center" });
  validateSlide(slide, pptx);
}

/* 41 · Apertura Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 3 · 30 MINUTOS", {
    x: M,
    y: 0.82,
    w: 4.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Una prueba conserva", {
    x: M,
    y: 1.62,
    w: 8.0,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
  });
  addText(slide, "lo que el equipo decidió", {
    x: M,
    y: 2.5,
    w: 8.16,
    h: 0.82,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.gold,
  });
  addText(slide, "Objetivo: convertir el defecto 3.95 → 3.9 en evidencia roja, corregir la causa y demostrar el cambio.", {
    x: M,
    y: 3.74,
    w: 7.74,
    h: 0.86,
    fontSize: 19,
    color: C.softBlue,
  });
  slide.addImage({
    path: ASSETS.pytest,
    ...imageSizingContain(ASSETS.pytest, 9.18, 1.48, 2.84, 2.7),
  });
  addText(slide, "COMPORTAMIENTO EJECUTABLE", {
    x: 8.82,
    y: 4.5,
    w: 3.58,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: C.sand,
    align: "center",
    charSpacing: 1.2,
  });
  rect(slide, M, 5.34, 11.88, 0.94, C.white, C.white, 0.06);
  addText(slide, "ROJO", { x: 1.18, y: 5.64, w: 1.18, h: 0.22, fontSize: 15, bold: true, color: C.red, align: "center" });
  addArrow(slide, 2.56, 5.54, 0.74, C.red);
  addText(slide, "DECIDIR", { x: 3.56, y: 5.64, w: 1.56, h: 0.22, fontSize: 15, bold: true, color: C.navy, align: "center" });
  addArrow(slide, 5.38, 5.54, 0.74, C.red);
  addText(slide, "CORREGIR", { x: 6.42, y: 5.64, w: 1.72, h: 0.22, fontSize: 15, bold: true, color: C.navy, align: "center" });
  addArrow(slide, 8.42, 5.54, 0.74, C.red);
  addText(slide, "VERDE CON EVIDENCIA", { x: 9.38, y: 5.64, w: 2.54, h: 0.22, fontSize: 15, bold: true, color: C.success, align: "center" });
  validateSlide(slide, pptx);
}

/* 42 · Del recuerdo a la prueba */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Persistir", "Una comprobación manual se pierde", "La prueba conserva entrada, acción y expectativa dentro del proyecto.");
  rect(slide, M, 2.42, 4.72, 3.48, C.softNeutral, C.softNeutral, 0.08);
  addText(slide, "MOMENTO MANUAL", { x: 1.06, y: 2.76, w: 2.26, h: 0.2, fontSize: 10, bold: true, color: C.slate, charSpacing: 1.1 });
  addText(slide, "Alguien debe recordar…", { x: 1.06, y: 3.24, w: 3.9, h: 0.36, fontSize: 23, bold: true, color: C.ink });
  const memories = ["el comando", "los datos", "el resultado esperado"];
  memories.forEach((memory, index) => {
    addText(slide, `0${index + 1}`, { x: 1.08, y: 3.94 + index * 0.48, w: 0.46, h: 0.2, fontSize: 10, bold: true, color: C.red, align: "center" });
    line(slide, 1.64, 4.04 + index * 0.48, 0.5, C.red, 2);
    addText(slide, memory, { x: 2.3, y: 3.92 + index * 0.48, w: 2.5, h: 0.24, fontSize: 16, bold: true, color: C.ink });
  });
  addArrow(slide, 5.72, 3.84, 0.94, C.red);
  rect(slide, 6.92, 2.42, 5.7, 3.48, C.navy, C.navy, 0.08);
  addText(slide, "EVIDENCIA PERSISTENTE", { x: 7.3, y: 2.76, w: 2.86, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.1 });
  addText(slide, "test_notas.py", { x: 7.3, y: 3.28, w: 4.78, h: 0.46, fontFace: TYPOGRAPHY.mono, fontSize: 25, bold: true, color: C.white });
  addText(slide, "Entrada + acción + expectativa quedan juntas, versionables y repetibles.", { x: 7.3, y: 4.1, w: 4.66, h: 0.72, fontSize: 18, bold: true, color: C.softBlue });
  rect(slide, 7.3, 5.1, 4.62, 0.46, C.titleFill, C.titleFill, 0.05);
  addText(slide, "PRUEBA DE REGRESIÓN  ·  el defecto no vuelve en silencio", { x: 7.3, y: 5.1, w: 4.62, h: 0.46, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 43 · Tres piezas de una prueba */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.1 · Estructura", "Toda prueba responde tres preguntas", "El caso deja de depender de la memoria cuando cada pieza queda escrita.");
  rect(slide, M, 2.5, 11.88, 2.54, C.navy, C.navy, 0.08);
  const pieces = [
    ["01", "ENTRADA", "¿Con qué datos?", "[3.8, 4.1, 3.95]", C.red],
    ["02", "ACCIÓN", "¿Qué ejecutamos?", "nota_final(...) ", C.gold],
    ["03", "EXPECTATIVA", "¿Qué debe ocurrir?", "== 4.0", C.success],
  ];
  pieces.forEach((piece, index) => {
    const x = 1.06 + index * 4.0;
    addText(slide, piece[0], { x, y: 2.82, w: 0.5, h: 0.2, fontSize: 10, bold: true, color: piece[4], align: "center" });
    line(slide, x + 0.66, 2.92, 0.62, piece[4], 2.4);
    addText(slide, piece[1], { x: x + 1.44, y: 2.8, w: 2.0, h: 0.22, fontSize: 10.5, bold: true, color: piece[4] === C.gold ? C.sand : piece[4], charSpacing: 1 });
    addText(slide, piece[2], { x, y: 3.42, w: 3.38, h: 0.28, fontSize: 17, bold: true, color: C.white });
    addText(slide, piece[3], { x, y: 4.14, w: 3.38, h: 0.34, fontFace: TYPOGRAPHY.mono, fontSize: index === 0 ? 16.5 : 20, bold: true, color: C.softBlue, align: "center" });
    if (index < pieces.length - 1) addArrow(slide, x + 3.46, 3.58, 0.34, C.red);
  });
  rect(slide, M, 5.46, 11.88, 0.9, C.warningSoft, C.warningSoft, 0.05);
  addText(slide, "Una prueba no demuestra todo: demuestra una expectativa concreta para una entrada concreta.", { x: 1.04, y: 5.74, w: 11.22, h: 0.28, fontSize: 16.5, bold: true, color: C.ink, align: "center" });
  validateSlide(slide, pptx);
}

/* 44 · Primera prueba */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Escribir", "La primera prueba documenta un caso normal", "El nombre expresa el comportamiento; el assert vuelve ejecutable la expectativa.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  const code = `from notas import nota_final\n\n\ndef test_calcula_promedio_normal() -> None:\n    assert nota_final([6.0, 5.5, 6.5]) == 6.0`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.4, w: 7.22, h: 3.92, title: "test_notas.py · primera prueba", code, lang: "python", fontSize: 13.3 },
    guide: { x: 8.66, y: 2.4, w: 3.72, h: 3.92, title: "Cómo leer esta prueba", accent: C.gold },
    notes: [
      {
        lineNumber: 4,
        color: C.gold,
        eyebrow: "Comportamiento",
        title: "Nombre que explica",
        body: "La prueba dice qué capacidad está verificando.",
      },
      {
        lineNumber: 5,
        color: C.success,
        eyebrow: "Expectativa",
        title: "obtenido == esperado",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 16,
        body: "Si la igualdad no se cumple, pytest conserva el desacuerdo.",
        bodyFontSize: 12.8,
      },
    ],
  });
  validateSlide(slide, pptx);
}

/* 45 · Descubrimiento pytest */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Descubrir", "pytest encuentra la prueba por convención", "No registramos el caso manualmente: el nombre del archivo y de la función lo hacen descubrible.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  rect(slide, M, 2.44, 4.22, 3.56, C.navy, C.navy, 0.08);
  addText(slide, "PROYECTO", { x: 1.06, y: 2.76, w: 1.42, h: 0.18, fontSize: 9.5, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "├── notas.py", { x: 1.08, y: 3.42, w: 3.3, h: 0.32, fontFace: TYPOGRAPHY.mono, fontSize: 18, color: C.softBlue });
  rect(slide, 0.98, 4.02, 3.74, 0.68, C.titleFill, C.titleFill, 0.05);
  addText(slide, "└── test_notas.py", { x: 1.18, y: 4.2, w: 3.3, h: 0.24, fontFace: TYPOGRAPHY.mono, fontSize: 18, bold: true, color: C.white });
  addText(slide, "    └── test_calcula_promedio_normal", { x: 1.18, y: 5.0, w: 3.38, h: 0.4, fontFace: TYPOGRAPHY.mono, fontSize: 13.2, color: C.softBlue });
  const rules = [
    ["01", "ARCHIVO", "comienza con test_", C.red],
    ["02", "FUNCIÓN", "comienza con test_", C.navy],
    ["03", "EXPECTATIVA", "usa assert de Python", C.gold],
  ];
  rules.forEach((rule, index) => {
    const y = 2.54 + index * 1.12;
    rect(slide, 5.34, y, 7.28, 0.9, C.white, C.border, 0.06);
    rect(slide, 5.34, y, 0.1, 0.9, rule[3], rule[3]);
    addText(slide, rule[0], { x: 5.68, y: y + 0.28, w: 0.5, h: 0.2, fontSize: 10.5, bold: true, color: rule[3] === C.gold ? C.ink : rule[3], align: "center" });
    addText(slide, rule[1], { x: 6.46, y: y + 0.2, w: 1.68, h: 0.22, fontSize: 11, bold: true, color: C.slate, charSpacing: 0.8 });
    addText(slide, rule[2], { x: 8.26, y: y + 0.2, w: 3.88, h: 0.34, fontFace: index < 2 ? TYPOGRAPHY.mono : TYPOGRAPHY.body, fontSize: 17, bold: true, color: C.ink, valign: "mid" });
  });
  rect(slide, 5.34, 5.98, 7.28, 0.48, C.successSoft, C.successSoft, 0.05);
  addText(slide, "uv run pytest -q  →  descubre y ejecuta", { x: 5.34, y: 5.98, w: 7.28, h: 0.48, fontFace: TYPOGRAPHY.mono, fontSize: 13.5, bold: true, color: C.success, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 46 · Primer verde */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.2 · Ejecutar", "El primer verde tiene alcance limitado", "La herramienta confirma un ejemplo; nosotros debemos nombrar qué quedó cubierto.");
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 8.18,
    h: 3.34,
    title: "PowerShell · primera ejecución de pytest",
    fontSize: 14,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: ".                                      [100%]" },
      { text: "1 passed" },
    ],
  });
  rect(slide, 9.22, 2.66, 3.4, 1.18, C.successSoft, C.successSoft, 0.07);
  addText(slide, "1 PASSED", { x: 9.58, y: 2.94, w: 2.68, h: 0.34, fontFace: TYPOGRAPHY.mono, fontSize: 23, bold: true, color: C.success, align: "center" });
  addText(slide, "demuestra", { x: 9.5, y: 4.2, w: 2.82, h: 0.2, fontSize: 10, bold: true, color: C.slate, align: "center", charSpacing: 1 });
  addText(slide, "un caso normal", { x: 9.42, y: 4.62, w: 2.98, h: 0.34, fontSize: 20, bold: true, color: C.ink, align: "center" });
  line(slide, 9.56, 5.22, 2.7, C.border, 1.2);
  addText(slide, "No demuestra todos los valores posibles.", { x: 9.46, y: 5.46, w: 2.92, h: 0.46, fontSize: 13.5, color: C.slate, align: "center" });
  rect(slide, M, 6.12, 11.88, 0.48, C.warningSoft, C.warningSoft, 0.04);
  addText(slide, "VERDE CON APELLIDO  ·  pasó el promedio normal [6.0, 5.5, 6.5] → 6.0", { x: 1.02, y: 6.12, w: 11.28, h: 0.48, fontSize: 13.5, bold: true, color: C.ink, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 47 · Prueba de regresión */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Regresión", "El defecto conocido se vuelve una prueba", "Conservamos el caso normal y agregamos una expectativa que hoy la implementación no cumple.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  const code = `from notas import nota_final\n\n\ndef test_calcula_promedio_normal() -> None:\n    assert nota_final([6.0, 5.5, 6.5]) == 6.0\n\n\ndef test_redondea_395_a_40() -> None:\n    assert nota_final([3.8, 4.1, 3.95]) == 4.0`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.6, w: 7.34, h: 3.8, title: "test_notas.py · caso normal + regresión", code, lang: "python", fontSize: 12.1 },
    guide: { x: 8.76, y: 2.6, w: 3.62, h: 3.8, title: "Qué conserva la regresión" },
    notes: [
      {
        lineNumber: 8,
        color: C.red,
        eyebrow: "Nombre específico",
        title: "Defecto identificable",
        titleFontSize: 16,
        titleH: 0.34,
        bodyY: 0.96,
        bodyH: 0.42,
        body: "Si falla, sabemos qué regla está en disputa.",
        bodyFontSize: 12.5,
      },
      {
        lineNumber: 9,
        color: C.success,
        eyebrow: "Fuente de verdad",
        title: "4.0 permanece fijo",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 19,
        body: "La prueba guarda la regla acordada; no el resultado defectuoso.",
        bodyFontSize: 12.5,
      },
    ],
  });
  validateSlide(slide, pptx);
}

/* 48 · Rojo útil */
{
  const { slide } = createSlide("dark");
  addText(slide, "3.3 · EJECUTAR", { x: M, y: 0.82, w: 3.4, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "Rojo no significa fracaso", { x: M, y: 1.42, w: 7.72, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.white });
  addText(slide, "Significa que la prueba encontró una diferencia real.", { x: M, y: 2.22, w: 7.54, h: 0.42, fontSize: 18.5, color: C.softBlue });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.94,
    w: 8.12,
    h: 3.18,
    title: "PowerShell · evidencia roja",
    fontSize: 12.6,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: ".F                                     [100%]" },
      { text: "E       assert 3.9 == 4.0" },
      { text: "FAILED test_notas.py::test_redondea_395_a_40" },
      { text: "1 failed, 1 passed" },
    ],
  });
  rect(slide, 9.18, 2.94, 3.44, 3.18, C.white, C.white, 0.08);
  addText(slide, "OBTENIDO", { x: 9.52, y: 3.28, w: 1.16, h: 0.18, fontSize: 9.5, bold: true, color: C.red, charSpacing: 0.8 });
  addText(slide, "3.9", { x: 10.72, y: 3.16, w: 1.38, h: 0.42, fontFace: TYPOGRAPHY.mono, fontSize: 27, bold: true, color: C.red, align: "right" });
  line(slide, 9.52, 3.86, 2.56, C.border, 1.2);
  addText(slide, "ESPERADO", { x: 9.52, y: 4.16, w: 1.28, h: 0.18, fontSize: 9.5, bold: true, color: C.success, charSpacing: 0.8 });
  addText(slide, "4.0", { x: 10.72, y: 4.04, w: 1.38, h: 0.42, fontFace: TYPOGRAPHY.mono, fontSize: 27, bold: true, color: C.success, align: "right" });
  rect(slide, 9.48, 4.82, 2.82, 0.58, C.paleRed, C.paleRed, 0.05);
  addText(slide, "DESACUERDO CAPTURADO", { x: 9.48, y: 4.82, w: 2.82, h: 0.58, fontSize: 10, bold: true, color: C.red, align: "center", valign: "mid", charSpacing: 0.8 });
  addText(slide, "La prueba funciona: detectó lo que debía detectar.", { x: 9.52, y: 5.48, w: 2.78, h: 0.48, fontSize: 12.7, bold: true, color: C.ink, align: "center" });
  validateSlide(slide, pptx);
}

/* 49 · Anatomía de la falla */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Interpretar", "La falla se lee en un orden", "Antes de editar, reconstruimos qué se probó, qué ocurrió y dónde quedó registrado.");
  rect(slide, M, 2.42, 11.88, 0.82, C.terminalBg, C.terminalBg, 0.06);
  addText(slide, "FAILED test_notas.py::test_redondea_395_a_40  ·  assert 3.9 == 4.0  ·  1 failed, 1 passed", { x: 1.02, y: 2.68, w: 11.26, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 13.2, bold: true, color: C.terminalOutput, align: "center" });
  const readings = [
    ["01", "COMPORTAMIENTO", "test_redondea_395_a_40", "qué regla estaba bajo prueba", C.red],
    ["02", "DIFERENCIA", "3.9 ≠ 4.0", "obtenido frente a esperado", C.navy],
    ["03", "UBICACIÓN", "test_notas.py::...", "archivo y prueba exacta", C.gold],
    ["04", "ALCANCE", "1 failed · 1 passed", "el caso normal sigue verde", C.success],
  ];
  readings.forEach((item, index) => {
    const y = 3.58 + index * 0.7;
    addCircleLabel(slide, 0.92, y, 0.46, item[4], item[0], { fontSize: 9.5, color: item[4] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: 1.64, y: y + 0.02, w: 1.72, h: 0.2, fontSize: 9.5, bold: true, color: item[4] === C.gold ? C.ink : item[4], charSpacing: 0.8 });
    addText(slide, item[2], { x: 3.56, y: y - 0.02, w: 4.18, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 15.5, bold: true, color: C.ink });
    addText(slide, item[3], { x: 8.04, y: y - 0.02, w: 4.08, h: 0.3, fontSize: 14.5, color: C.slate });
    if (index < readings.length - 1) line(slide, 1.64, y + 0.54, 10.48, C.border, 0.8);
  });
  validateSlide(slide, pptx);
}

/* 50 · Ejecución selectiva */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.3 · Localizar", "También podemos ejecutar una sola prueba", "El identificador combina archivo y función para aislar el desacuerdo sin perder trazabilidad.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.48,
    w: 11.88,
    h: 1.34,
    title: "PowerShell · ejecución selectiva",
    fontSize: 14,
    lines: [{ prompt: ">", text: "uv run pytest -q test_notas.py::test_redondea_395_a_40" }],
  });
  rect(slide, 1.0, 4.28, 3.78, 1.36, C.softBlue, C.softBlue, 0.07);
  addText(slide, "ARCHIVO", { x: 1.32, y: 4.58, w: 1.12, h: 0.18, fontSize: 9.5, bold: true, color: C.navy, charSpacing: 1 });
  addText(slide, "test_notas.py", { x: 1.32, y: 5.0, w: 3.1, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 18, bold: true, color: C.ink });
  addText(slide, "::", { x: 5.04, y: 4.68, w: 0.72, h: 0.42, fontFace: TYPOGRAPHY.mono, fontSize: 27, bold: true, color: C.red, align: "center" });
  rect(slide, 6.02, 4.28, 6.04, 1.36, C.warningSoft, C.warningSoft, 0.07);
  addText(slide, "FUNCIÓN DE PRUEBA", { x: 6.36, y: 4.58, w: 2.0, h: 0.18, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 1 });
  addText(slide, "test_redondea_395_a_40", { x: 6.36, y: 5.0, w: 5.34, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 17, bold: true, color: C.ink });
  addText(slide, "Aislar acelera la investigación; la suite completa sigue siendo la evidencia de cierre.", { x: M, y: 6.12, w: 11.88, h: 0.3, fontSize: 16, bold: true, color: C.red, align: "center" });
  validateSlide(slide, pptx);
}

/* 51 · Tres sospechosos */
{
  const { slide } = createSlide("dark");
  addText(slide, "3.4 · ANTES DE EDITAR", { x: M, y: 0.82, w: 4.2, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "Una prueba roja tiene tres sospechosos", { x: M, y: 1.42, w: 10.8, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 35, bold: true, color: C.white });
  addText(slide, "El color no decide por nosotros; la fuente de verdad sí.", { x: M, y: 2.2, w: 8.4, h: 0.4, fontSize: 18, color: C.softBlue });
  const suspects = [
    ["01", "IMPLEMENTACIÓN", "El código no cumple la regla.", C.red],
    ["02", "EXPECTATIVA", "La prueba pide algo incorrecto.", C.gold],
    ["03", "PREPARACIÓN", "Los datos no representan el caso.", C.success],
  ];
  suspects.forEach((item, index) => {
    const x = M + index * 4.02;
    rect(slide, x, 3.0, 3.66, 2.42, C.titleFill, C.titleFill, 0.07);
    rect(slide, x, 3.0, 3.66, 0.12, item[3], item[3]);
    addText(slide, item[0], { x: x + 0.3, y: 3.4, w: 0.5, h: 0.2, fontSize: 10, bold: true, color: item[3], align: "center" });
    addText(slide, item[1], { x: x + 0.98, y: 3.38, w: 2.26, h: 0.22, fontSize: 11, bold: true, color: item[3] === C.gold ? C.sand : item[3], charSpacing: 0.8 });
    addText(slide, item[2], { x: x + 0.34, y: 4.14, w: 2.98, h: 0.62, fontSize: 18, bold: true, color: C.white, align: "center", valign: "mid" });
  });
  rect(slide, M, 5.86, 11.88, 0.62, C.white, C.white, 0.05);
  addText(slide, "PREGUNTA PROFESIONAL  ·  ¿qué evidencia define el comportamiento correcto?", { x: 1.02, y: 5.86, w: 11.28, h: 0.62, fontSize: 14.5, bold: true, color: C.navy, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 52 · Fuente de verdad */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Decidir", "Aquí la expectativa no se negocia", "La regla acordada exige 3.95 → 4.0; cambiar el test solo escondería el defecto.");
  rect(slide, M, 2.48, 4.74, 2.74, C.paleRed, C.paleRed, 0.08);
  addText(slide, "IMPLEMENTACIÓN ACTUAL", { x: 1.12, y: 2.84, w: 3.94, h: 0.2, fontSize: 10, bold: true, color: C.red, align: "center", charSpacing: 1.1 });
  addText(slide, "3.9", { x: 1.12, y: 3.4, w: 3.94, h: 0.72, fontFace: TYPOGRAPHY.mono, fontSize: 43, bold: true, color: C.red, align: "center" });
  addText(slide, "valor obtenido", { x: 1.12, y: 4.42, w: 3.94, h: 0.22, fontSize: 14, color: C.slate, align: "center" });
  addText(slide, "≠", { x: 5.72, y: 3.42, w: 0.86, h: 0.68, fontSize: 40, bold: true, color: C.red, align: "center", valign: "mid" });
  rect(slide, 6.82, 2.48, 5.8, 2.74, C.navy, C.navy, 0.08);
  addText(slide, "REGLA ACORDADA", { x: 7.22, y: 2.84, w: 5.0, h: 0.2, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 1.1 });
  addText(slide, "4.0", { x: 7.22, y: 3.4, w: 5.0, h: 0.72, fontFace: TYPOGRAPHY.mono, fontSize: 43, bold: true, color: C.white, align: "center" });
  addText(slide, "fuente de verdad", { x: 7.22, y: 4.42, w: 5.0, h: 0.22, fontSize: 14, color: C.softBlue, align: "center" });
  rect(slide, M, 5.64, 11.88, 0.82, C.warningSoft, C.warningSoft, 0.05);
  addText(slide, "NO HACER  ·  cambiar == 4.0 por == 3.9 para fabricar una barra verde", { x: 1.06, y: 5.64, w: 11.2, h: 0.82, fontFace: TYPOGRAPHY.mono, fontSize: 14, bold: true, color: C.ink, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 53 · Float y redondeo */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Causa", "El valor visible no siempre es el valor almacenado", "float representa números decimales mediante aproximaciones binarias.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 7.62,
    h: 3.48,
    title: "Python · inspeccionar antes de corregir",
    fontSize: 13.5,
    lines: [
      { prompt: ">>>", text: "valor = sum([3.8, 4.1, 3.95]) / 3" },
      { prompt: ">>>", text: "valor" },
      { text: "3.9499999999999997" },
      { prompt: ">>>", text: "round(valor, 1)" },
      { text: "3.9" },
    ],
  });
  rect(slide, 8.72, 2.64, 3.9, 1.34, C.softBlue, C.softBlue, 0.07);
  addText(slide, "PARECE", { x: 9.08, y: 2.94, w: 1.12, h: 0.18, fontSize: 9.5, bold: true, color: C.navy, charSpacing: 0.8 });
  addText(slide, "3.95", { x: 10.3, y: 2.84, w: 1.84, h: 0.38, fontFace: TYPOGRAPHY.mono, fontSize: 24, bold: true, color: C.ink, align: "right" });
  addText(slide, "pero el cálculo queda apenas por debajo", { x: 9.08, y: 3.48, w: 3.02, h: 0.28, fontSize: 13.5, color: C.slate, align: "center" });
  addArrow(slide, 10.28, 4.28, 0.72, C.red);
  rect(slide, 8.72, 4.94, 3.9, 1.0, C.warningSoft, C.warningSoft, 0.07);
  addText(slide, "REGLA DE NEGOCIO", { x: 9.06, y: 5.18, w: 1.76, h: 0.18, fontSize: 9.5, bold: true, color: C.ink, charSpacing: 0.8 });
  addText(slide, "debe ser explícita", { x: 9.06, y: 5.5, w: 3.18, h: 0.24, fontSize: 17, bold: true, color: C.red, align: "center" });
  addText(slide, "No buscamos un parche para 3.95; buscamos una representación y un criterio coherentes.", { x: M, y: 6.2, w: 11.88, h: 0.28, fontSize: 15.5, bold: true, color: C.red, align: "center" });
  validateSlide(slide, pptx);
}

/* 54 · Corrección decimal */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.4 · Corregir", "La regla queda visible en el código", "Decimal evita arrastrar la aproximación binaria y ROUND_HALF_UP declara cómo resolver empates.", false, { titleFontSize: 29, titleH: 1.02, subtitleY: 1.9 });
  const code = `from decimal import ROUND_HALF_UP, Decimal\n\n\ndef nota_final(notas: list[float]) -> float:\n    \"\"\"Calcula el promedio con criterio ROUND_HALF_UP.\"\"\"\n    notas_decimales = [Decimal(str(nota)) for nota in notas]\n    total: Decimal = sum(notas_decimales, Decimal(0))\n    promedio: Decimal = total / Decimal(len(notas_decimales))\n    return float(promedio.quantize(Decimal(\"0.1\"), rounding=ROUND_HALF_UP))`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.54, w: 8.26, h: 3.88, title: "notas.py · implementación corregida", code, lang: "python", fontSize: 10.7 },
    guide: { x: 9.42, y: 2.54, w: 2.96, h: 3.88, title: "Dos decisiones explícitas", accent: C.gold, titleFontSize: 8.8 },
    notes: [
      {
        lineNumber: 6,
        color: C.gold,
        eyebrow: "Representación",
        title: "Decimal(str(nota))",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 15,
        body: "Parte del decimal visible y evita heredar el artefacto binario.",
        bodyFontSize: 12.2,
      },
      {
        lineNumber: 9,
        color: C.success,
        eyebrow: "Criterio",
        title: "ROUND_HALF_UP",
        titleFontFace: TYPOGRAPHY.mono,
        titleFontSize: 15.5,
        body: "Los empates se redondean alejándose de cero.",
        bodyFontSize: 12.2,
      },
    ],
  });
  validateSlide(slide, pptx);
}

/* 55 · Verde comprobado */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.5 · Verificar", "El verde vale porque repetimos los controles", "La corrección satisface ambos casos sin introducir señales estructurales ni contradicciones de tipos.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.4,
    w: 8.24,
    h: 3.88,
    title: "PowerShell · evidencia de cierre",
    fontSize: 13.2,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "..                                     [100%]" },
      { text: "2 passed" },
      { prompt: ">", text: "uv run ruff check .      → All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check     → 0 errors" },
    ],
  });
  const controls = [
    ["01", "pytest", "2 comportamientos", C.success],
    ["02", "Ruff", "estructura limpia", C.red],
    ["03", "Pyrefly", "contratos coherentes", C.navy],
  ];
  controls.forEach((item, index) => {
    const y = 2.54 + index * 1.14;
    rect(slide, 9.2, y, 3.42, 0.92, C.white, C.border, 0.06);
    addCircleLabel(slide, 9.42, y + 0.22, 0.48, item[3], item[0], { fontSize: 9.5 });
    addText(slide, item[1], { x: 10.14, y: y + 0.14, w: 1.16, h: 0.22, fontSize: 15.5, bold: true, color: C.ink });
    addText(slide, item[2], { x: 10.14, y: y + 0.48, w: 2.08, h: 0.24, fontSize: 12.8, color: C.slate });
  });
  rect(slide, 9.2, 6.0, 3.42, 0.48, C.successSoft, C.successSoft, 0.04);
  addText(slide, "ROJO → CORRECCIÓN → VERDE", { x: 9.2, y: 6.0, w: 3.42, h: 0.48, fontSize: 10.5, bold: true, color: C.success, align: "center", valign: "mid", charSpacing: 0.7 });
  validateSlide(slide, pptx);
}

/* 56 · Agente con fuente de verdad */
{
  const { slide } = createSlide("light");
  addHeader(slide, "3.6 · Uso del agente", "El agente investiga; la regla permanece fija", "Una buena solicitud protege la expectativa y exige alternativas antes de modificar.", false, {
    titleFontSize: 29,
    titleH: 1.02,
    subtitleY: 1.9,
  });
  rect(slide, M, 2.46, 11.88, 2.74, C.navy, C.navy, 0.08);
  addText(slide, "SOLICITUD ÚTIL", { x: 1.08, y: 2.78, w: 2.14, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.1 });
  addText(slide, "«La prueba exige que 3.95 se informe como 4.0, pero la implementación devuelve 3.9.»", { x: 1.08, y: 3.24, w: 10.92, h: 0.46, fontSize: 20, bold: true, color: C.white, align: "center" });
  rect(slide, 1.34, 4.02, 10.36, 0.76, C.titleFill, C.titleFill, 0.05);
  addText(slide, "Explica la causa · propone dos correcciones · no cambia la prueba · señala riesgos", { x: 1.34, y: 4.02, w: 10.36, h: 0.76, fontSize: 15, bold: true, color: C.softBlue, align: "center", valign: "mid" });
  rect(slide, M, 5.56, 3.28, 0.66, C.paleRed, C.paleRed, 0.05);
  addText(slide, "EVITAR  ·  «haz que pase»", { x: M, y: 5.56, w: 3.28, h: 0.66, fontSize: 13, bold: true, color: C.red, align: "center", valign: "mid" });
  addText(slide, "Sin fuente de verdad, el agente también podría debilitar el test y fabricar verde.", { x: 4.38, y: 5.7, w: 7.82, h: 0.36, fontSize: 16, bold: true, color: C.ink, align: "center" });
  validateSlide(slide, pptx);
}

/* 57 · Punto de control Bloque 3 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de control", "La evidencia debe contar toda la historia", "Un test rojo aislado no basta; necesitamos mostrar la causa, la decisión y la comprobación final.");
  const artifacts = [
    ["01", "ARCHIVO", "test_notas.py con dos pruebas", C.red],
    ["02", "ROJO", "3.9 == 4.0 visible en la falla", C.navy],
    ["03", "VERDE", "2 passed después de corregir", C.success],
    ["04", "CONTROLES", "Ruff y Pyrefly nuevamente verdes", C.gold],
  ];
  artifacts.forEach((item, index) => {
    const x = index % 2 === 0 ? M : 6.78;
    const y = index < 2 ? 2.52 : 4.28;
    rect(slide, x, y, 5.84, 1.4, C.white, C.border, 0.06);
    addCircleLabel(slide, x + 0.24, y + 0.3, 0.64, item[3], item[0], { fontSize: 11, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: x + 1.14, y: y + 0.24, w: 1.46, h: 0.22, fontSize: 10.5, bold: true, color: item[3] === C.gold ? C.ink : item[3], charSpacing: 0.8 });
    addText(slide, item[2], { x: x + 1.14, y: y + 0.66, w: 4.26, h: 0.42, fontSize: 17, bold: true, color: C.ink });
  });
  rect(slide, M, 6.1, 11.9, 0.5, C.navy, C.navy, 0.04);
  addText(slide, "Además: explicar por qué cambiamos notas.py y no la expectativa == 4.0", { x: 1.02, y: 6.1, w: 11.26, h: 0.5, fontSize: 14, bold: true, color: C.white, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 58 · Preguntas Bloque 3 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · Preguntas", "Tres preguntas para llevarse", "La pista orienta; la respuesta debe distinguir evidencia, regla y alcance.");
  addQuestion(slide, 2.44, 1, "¿Por qué una prueba verde no demuestra que una función sea correcta para todos los casos?", "cuenta cuántas entradas ejecutó realmente y cuáles siguen sin estar representadas");
  addQuestion(slide, 3.8, 2, "Cuando una prueba queda roja, ¿cómo decidimos si debemos cambiar el código o la expectativa?", "busca primero dónde está definida la regla que funciona como fuente de verdad");
  addQuestion(slide, 5.12, 3, "¿Qué riesgo existe si cambiamos 4.0 por 3.9 solo para obtener verde?", "el indicador puede verse saludable porque debilitamos la regla, no porque corregimos el sistema");
  validateSlide(slide, pptx);
}

/* 59 · Cierre Bloque 3 */
{
  const { slide } = createSlide("dark");
  addText(slide, "IDEA CLAVE · BLOQUE 3", { x: M, y: 0.82, w: 4.8, h: 0.28, fontSize: 11, bold: true, color: C.gold, charSpacing: 1.8 });
  addText(slide, "El rojo captura", { x: M, y: 1.54, w: 7.1, h: 0.76, fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: C.white });
  addText(slide, "un desacuerdo útil", { x: M, y: 2.38, w: 7.48, h: 0.8, fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: C.gold });
  addText(slide, "El verde adquiere valor cuando aparece después de una corrección coherente con la regla, no cuando debilitamos la expectativa.", { x: M, y: 3.52, w: 7.52, h: 1.08, fontSize: 18.5, color: C.softBlue });
  rect(slide, 8.5, 1.54, 3.8, 3.48, C.titleFill, C.titleFill, 0.08);
  addText(slide, ".F", { x: 8.88, y: 1.94, w: 3.04, h: 0.56, fontFace: TYPOGRAPHY.mono, fontSize: 34, bold: true, color: C.red, align: "center" });
  addText(slide, "3.9 ≠ 4.0", { x: 8.88, y: 2.86, w: 3.04, h: 0.46, fontFace: TYPOGRAPHY.mono, fontSize: 23, bold: true, color: C.white, align: "center" });
  addArrow(slide, 9.98, 3.62, 0.84, C.red);
  addText(slide, "2 passed", { x: 8.88, y: 4.28, w: 3.04, h: 0.34, fontFace: TYPOGRAPHY.mono, fontSize: 22, bold: true, color: C.success, align: "center" });
  rect(slide, M, 5.42, 11.88, 0.88, C.white, C.white, 0.05);
  addText(slide, "SIGUE → el agente propondrá casos; el equipo decidirá cuáles merecen convertirse en pruebas", { x: 1.04, y: 5.42, w: 11.22, h: 0.88, fontSize: 15, bold: true, color: C.navy, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 60 · Apertura Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "BLOQUE 4 · 25 MINUTOS", {
    x: M, y: 0.82, w: 4.4, h: 0.26, fontSize: 11, bold: true, color: C.gold, charSpacing: 1.8,
  });
  addText(slide, "El agente propone", {
    x: M, y: 1.48, w: 7.0, h: 0.78, fontFace: TYPOGRAPHY.display, fontSize: 41, bold: true, color: C.white,
  });
  addText(slide, "el equipo decide", {
    x: M, y: 2.34, w: 7.0, h: 0.8, fontFace: TYPOGRAPHY.display, fontSize: 41, bold: true, color: C.gold,
  });
  addText(slide, "Velocidad para explorar; criterio para convertir una posibilidad en evidencia.", {
    x: M, y: 3.54, w: 6.72, h: 0.82, fontSize: 19, color: C.softBlue,
  });
  rect(slide, 8.18, 1.42, 4.1, 3.84, C.titleFill, C.titleFill, 0.09);
  addText(slide, "5", { x: 8.58, y: 1.78, w: 0.86, h: 0.62, fontFace: TYPOGRAPHY.display, fontSize: 38, bold: true, color: C.white, align: "center" });
  addText(slide, "CASOS PROPUESTOS", { x: 9.62, y: 1.96, w: 2.18, h: 0.22, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.1 });
  line(slide, 8.62, 2.66, 3.22, C.guide, 1.2);
  const decisions = [
    ["ACEPTAR", C.success],
    ["MODIFICAR", C.gold],
    ["POSPONER", C.softBlue],
    ["RECHAZAR", C.red],
  ];
  decisions.forEach((item, index) => {
    const y = 2.98 + index * 0.5;
    rect(slide, 8.62, y, 0.08, 0.26, item[1], item[1]);
    addText(slide, item[0], { x: 8.92, y: y + 0.02, w: 2.5, h: 0.2, fontSize: 12.5, bold: true, color: item[1] === C.gold ? C.white : item[1], charSpacing: 0.8 });
  });
  rect(slide, M, 5.62, 11.88, 0.72, C.white, C.white, 0.05);
  addText(slide, "AUTORIDAD FINAL  ·  la especificación sigue perteneciendo al equipo", {
    x: 1.04, y: 5.62, w: 11.2, h: 0.72, fontSize: 15.5, bold: true, color: C.navy, align: "center", valign: "mid",
  });
  validateSlide(slide, pptx);
}

/* 61 · Contexto antes de pedir */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.1 · Contexto", "Un buen prompt empieza con límites", "El agente necesita distinguir reglas conocidas de decisiones que todavía no existen.");
  addText(slide, "YA SABEMOS", { x: M, y: 2.38, w: 2.2, h: 0.22, fontSize: 10.5, bold: true, color: C.success, charSpacing: 1.2 });
  const known = [
    "calcula el promedio de una lista de float",
    "entrega el resultado con un decimal",
    "usa el criterio ROUND_HALF_UP",
    "ya cubrimos el caso normal y 3.95 → 4.0",
  ];
  known.forEach((textValue, index) => {
    const y = 2.82 + index * 0.72;
    addCircleLabel(slide, M, y, 0.42, C.success, index + 1, { fontSize: 9.5 });
    addText(slide, textValue, { x: 1.36, y: y + 0.06, w: 5.0, h: 0.32, fontSize: 15.5, bold: true, color: C.ink });
  });
  rect(slide, 7.02, 2.34, 5.6, 3.52, C.navy, C.navy, 0.08);
  addText(slide, "AÚN NO ESTÁ DEFINIDO", { x: 7.42, y: 2.7, w: 3.12, h: 0.22, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.1 });
  const pending = [
    ["[]", "¿devuelve un valor o produce un error?"],
    ["texto", "¿la función convierte datos o los rechaza?"],
  ];
  pending.forEach((item, index) => {
    const y = 3.28 + index * 1.08;
    rect(slide, 7.42, y, 1.1, 0.64, C.titleFill, C.titleFill, 0.05);
    addText(slide, item[0], { x: 7.42, y, w: 1.1, h: 0.64, fontFace: TYPOGRAPHY.mono, fontSize: 18, bold: true, color: C.white, align: "center", valign: "mid" });
    addText(slide, item[1], { x: 8.84, y: y + 0.06, w: 3.18, h: 0.54, fontSize: 16, bold: true, color: C.softBlue, valign: "mid" });
  });
  rect(slide, M, 6.18, 11.9, 0.48, C.warningSoft, C.warningSoft, 0.04);
  addText(slide, "Si falta la regla, el resultado correcto es declarar la ambigüedad, no inventar una expectativa.", { x: 1.02, y: 6.18, w: 11.28, h: 0.48, fontSize: 14.5, bold: true, color: C.ink, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 62 · Solicitud acotada */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.1 · Solicitud", "Pedir casos no es delegar la especificación", "La solicitud obliga al agente a mostrar propósito, expectativa y ambigüedades.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  rect(slide, M, 2.48, 11.88, 2.6, C.navy, C.navy, 0.08);
  addText(slide, "PROMPT DE TRABAJO", { x: 1.08, y: 2.8, w: 2.3, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.1 });
  addText(slide, "«Propón cinco casos para nota_final(). Incluye nombre, entrada, resultado esperado y riesgo. No escribas código, no repitas casos existentes y marca “requiere decisión” cuando falte una regla.»", {
    x: 1.08, y: 3.26, w: 10.94, h: 1.2, fontSize: 18.5, bold: true, color: C.white, align: "center", valign: "mid",
  });
  const constraints = [
    ["01", "NOMBRE", C.red],
    ["02", "ENTRADA + RESULTADO", C.gold],
    ["03", "RIESGO", C.success],
    ["04", "REQUIERE DECISIÓN", C.navy],
  ];
  constraints.forEach((item, index) => {
    const x = M + index * 3.0;
    const fill = index === 3 ? C.softBlue : C.white;
    rect(slide, x, 5.42, 2.72, 0.88, fill, index === 3 ? C.softBlue : C.border, 0.06);
    addCircleLabel(slide, x + 0.18, 5.62, 0.46, item[2], item[0], { fontSize: 9.2, color: item[2] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: x + 0.82, y: 5.7, w: 1.66, h: 0.2, fontSize: 10.2, bold: true, color: C.ink, align: "center", charSpacing: 0.7 });
  });
  validateSlide(slide, pptx);
}

/* 63 · Cuatro decisiones */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Auditar", "Cada propuesta recibe una decisión", "No calificamos al agente: evaluamos si el caso merece entrar a la suite.");
  const actions = [
    ["01", "ACEPTAR", "riesgo distinto\n+ regla conocida", C.success, C.successSoft],
    ["02", "MODIFICAR", "riesgo útil\n+ caso impreciso", C.gold, C.warningSoft],
    ["03", "POSPONER", "descubre una regla\n+ todavía pendiente", C.navy, C.softBlue],
    ["04", "RECHAZAR", "repite, contradice\n+ o carece de propósito", C.red, C.paleRed],
  ];
  actions.forEach((item, index) => {
    const x = M + index * 3.0;
    rect(slide, x, 2.48, 2.72, 3.38, item[4], item[4], 0.08);
    rect(slide, x, 2.48, 2.72, 0.12, item[3], item[3]);
    addCircleLabel(slide, x + 0.96, 2.94, 0.8, item[3], item[0], { fontSize: 12, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: x + 0.26, y: 4.02, w: 2.2, h: 0.3, fontSize: 17, bold: true, color: C.ink, align: "center", charSpacing: 0.8 });
    addText(slide, item[2], { x: x + 0.3, y: 4.62, w: 2.12, h: 0.72, fontSize: 15, color: C.slate, align: "center", valign: "mid" });
  });
  addText(slide, "La decisión debe poder explicarse con una frase: «lo acepto / pospongo porque…»", { x: M, y: 6.22, w: 11.88, h: 0.3, fontSize: 15, bold: true, color: C.red, align: "center" });
  validateSlide(slide, pptx);
}

/* 64 · Auditoría de cinco propuestas */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.2 · Decidir", "Cinco propuestas, tres destinos", "La entrada por sí sola no basta: cada decisión queda acompañada por su razón.");
  const proposals = [
    ["[5.5] → 5.5", "ACEPTAR", "caso mínimo: una sola nota", C.success, C.successSoft],
    ["[3.94] → 3.9", "ACEPTAR", "valor inmediatamente inferior al empate", C.success, C.successSoft],
    ["[3.8, 4.1, 3.95] → 4.0", "RECHAZAR", "ya existe como regresión", C.red, C.paleRed],
    ["[] → 0.0", "POSPONER", "la respuesta correcta aún no está definida", C.navy, C.softBlue],
    ["['4.0', '5.0'] → 4.5", "RECHAZAR", "contradice el contrato list[float]", C.red, C.paleRed],
  ];
  proposals.forEach((item, index) => {
    const y = 2.38 + index * 0.78;
    rect(slide, M, y, 11.88, 0.62, index % 2 === 0 ? C.white : C.mist, index % 2 === 0 ? C.border : C.mist, 0.04);
    addText(slide, String(index + 1).padStart(2, "0"), { x: 0.92, y: y + 0.2, w: 0.42, h: 0.18, fontSize: 10, bold: true, color: item[3], align: "center" });
    addText(slide, item[0], { x: 1.54, y: y + 0.15, w: 3.2, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 14.5, bold: true, color: C.ink });
    rect(slide, 5.04, y + 0.11, 1.54, 0.4, item[4], item[4], 0.04);
    addText(slide, item[1], { x: 5.04, y: y + 0.11, w: 1.54, h: 0.4, fontSize: 9.5, bold: true, color: item[3], align: "center", valign: "mid", charSpacing: 0.6 });
    addText(slide, item[2], { x: 6.9, y: y + 0.16, w: 5.06, h: 0.28, fontSize: 14, color: C.slate });
  });
  validateSlide(slide, pptx);
}

/* 65 · Fórmula de un caso útil */
{
  const { slide } = createSlide("dark");
  addText(slide, "CRITERIO DE AUDITORÍA", { x: M, y: 0.82, w: 3.9, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "Riesgo nuevo", { x: 1.0, y: 2.0, w: 3.0, h: 0.52, fontFace: TYPOGRAPHY.display, fontSize: 31, bold: true, color: C.white, align: "center" });
  addText(slide, "+", { x: 4.08, y: 1.92, w: 0.72, h: 0.62, fontFace: TYPOGRAPHY.display, fontSize: 38, bold: true, color: C.red, align: "center" });
  addText(slide, "Regla conocida", { x: 4.92, y: 2.0, w: 3.12, h: 0.52, fontFace: TYPOGRAPHY.display, fontSize: 31, bold: true, color: C.white, align: "center" });
  addText(slide, "=", { x: 8.18, y: 1.92, w: 0.72, h: 0.62, fontFace: TYPOGRAPHY.display, fontSize: 38, bold: true, color: C.gold, align: "center" });
  rect(slide, 9.04, 1.62, 3.18, 1.28, C.white, C.white, 0.07);
  addText(slide, "CASO DEFENDIBLE", { x: 9.26, y: 2.0, w: 2.74, h: 0.34, fontSize: 17, bold: true, color: C.navy, align: "center", valign: "mid" });
  line(slide, 1.02, 3.2, 11.18, C.titleFill, 1.4);
  addText(slide, "La cantidad no decide la calidad", { x: 1.12, y: 3.76, w: 5.1, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 29, bold: true, color: C.gold });
  addText(slide, "Una suite crece cuando hace visible un riesgo distinto, no cuando acumula variaciones sin propósito.", { x: 6.48, y: 3.72, w: 5.4, h: 0.9, fontSize: 18, color: C.softBlue });
  rect(slide, M, 5.4, 11.88, 0.78, C.titleFill, C.titleFill, 0.05);
  addText(slide, "PREGUNTA PROFESIONAL  ·  ¿qué riesgo nuevo vuelve visible?", { x: 1.04, y: 5.4, w: 11.24, h: 0.78, fontSize: 15.5, bold: true, color: C.white, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 66 · Dos casos incorporados */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.3 · Incorporar", "Dos pruebas, dos riesgos identificables", "Conservamos funciones separadas para que el nombre explique qué evidencia aporta cada caso.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  const code = `def test_conserva_una_unica_nota() -> None:\n    assert nota_final([5.5]) == 5.5\n\n\ndef test_redondea_394_hacia_39() -> None:\n    assert nota_final([3.94]) == 3.9`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.48, w: 7.46, h: 3.9, title: "test_notas.py · casos aceptados", code, lang: "python", fontSize: 12.8 },
    guide: { x: 8.54, y: 2.48, w: 3.84, h: 3.9, title: "Dos riesgos distintos", accent: C.success },
    notes: [
      { lineNumber: 1, color: C.gold, eyebrow: "Caso mínimo", title: "Una única nota", body: "Comprueba que el promedio conserva el único valor disponible.", bodyFontSize: 12.4 },
      { lineNumber: 5, color: C.success, eyebrow: "Bajo el empate", title: "3.94 → 3.9", titleFontFace: TYPOGRAPHY.mono, body: "Observa el valor inmediatamente inferior a 3.95.", bodyFontSize: 12.4 },
    ],
  });
  validateSlide(slide, pptx);
}

/* 67 · Cuatro pruebas verdes */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.3 · Ejecutar", "Cuatro verdes con propósito nombrado", "La nueva evidencia se suma sin borrar los dos comportamientos que ya estaban protegidos.");
  addTerminalPanel(slide, SH, {
    x: M, y: 2.46, w: 8.18, h: 3.56, title: "PowerShell · suite ampliada", fontSize: 14,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "....                                   [100%]" },
      { text: "4 passed" },
    ],
  });
  rect(slide, 9.22, 2.46, 3.4, 3.56, C.navy, C.navy, 0.08);
  addText(slide, "4 PASSED", { x: 9.56, y: 2.98, w: 2.72, h: 0.48, fontFace: TYPOGRAPHY.mono, fontSize: 28, bold: true, color: C.success, align: "center" });
  line(slide, 9.62, 3.72, 2.62, C.titleFill, 1.2);
  const scope = ["promedio normal", "empate 3.95", "una sola nota", "valor 3.94"];
  scope.forEach((item, index) => {
    addText(slide, `${String(index + 1).padStart(2, "0")}  ${item}`, { x: 9.58, y: 4.04 + index * 0.42, w: 2.68, h: 0.22, fontSize: 12.5, bold: true, color: index === 3 ? C.gold : C.softBlue });
  });
  rect(slide, M, 6.26, 11.88, 0.42, C.warningSoft, C.warningSoft, 0.04);
  addText(slide, "El verde creció porque crecieron los riesgos observados, no porque repetimos el mismo ejemplo.", { x: 1.02, y: 6.26, w: 11.28, h: 0.42, fontSize: 13.5, bold: true, color: C.ink, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 68 · Apertura del sabotaje */
{
  const { slide } = createSlide("dark");
  addText(slide, "4.4 · DESAFÍO CONTROLADO", { x: M, y: 0.82, w: 4.6, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "Predice antes de ejecutar", { x: M, y: 1.44, w: 8.5, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 38, bold: true, color: C.white });
  addText(slide, "El sabotaje sirve para comprobar si entendemos qué observa cada barrera.", { x: M, y: 2.24, w: 9.16, h: 0.42, fontSize: 18, color: C.softBlue });
  const flow = [
    ["01", "CAMBIO", C.red],
    ["02", "HIPÓTESIS", C.gold],
    ["03", "CONTROL", C.white],
    ["04", "DIAGNÓSTICO", C.success],
    ["05", "RESTAURAR", C.softBlue],
  ];
  flow.forEach((item, index) => {
    const x = 0.9 + index * 2.46;
    addCircleLabel(slide, x, 3.38, 0.68, item[2], item[0], { fontSize: 11, color: item[2] === C.gold || item[2] === C.white || item[2] === C.softBlue ? C.ink : C.white });
    addText(slide, item[1], { x: x - 0.26, y: 4.3, w: 1.2, h: 0.24, fontSize: 10.5, bold: true, color: item[2], align: "center", charSpacing: 0.7 });
    if (index < flow.length - 1) addArrow(slide, x + 0.9, 3.69, 1.08, C.red);
  });
  rect(slide, M, 5.32, 11.88, 0.9, C.white, C.white, 0.05);
  addText(slide, "ANTES DE TOCAR EL CÓDIGO  ·  anota qué control debería reaccionar y qué señal esperas leer", { x: 1.02, y: 5.32, w: 11.28, h: 0.9, fontSize: 14.5, bold: true, color: C.navy, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 69 · Mapa de sabotajes */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Elegir barrera", "Cuatro sabotajes, cuatro primeras hipótesis", "La asociación muestra el control más directo; no una frontera absoluta.", false, {
    titleFontSize: 28,
    titleH: 1.02,
    subtitleY: 1.94,
  });
  const sabotageMap = [
    ["A", "uv", "lockfile desalineado", "uv lock --check", C.navy],
    ["B", "ruff", "import sin uso", "ruff check .", C.red],
    ["C", "pyrefly", "firma incompatible", "pyrefly check", C.gold],
    ["D", "pytest", "redondeo incorrecto", "pytest -q", C.success],
  ];
  sabotageMap.forEach((item, index) => {
    const x = M + index * 3.0;
    addToolTile(slide, item[1], x, 2.38, 2.72, 1.3, { dark: false });
    rect(slide, x, 3.94, 2.72, 2.08, C.white, C.border, 0.07);
    addCircleLabel(slide, x + 0.22, 4.18, 0.52, item[4], item[0], { fontSize: 11, color: item[4] === C.gold ? C.ink : C.white });
    addText(slide, item[2], { x: x + 0.94, y: 4.14, w: 1.5, h: 0.5, fontSize: 15, bold: true, color: C.ink, valign: "mid" });
    line(slide, x + 0.28, 4.92, 2.16, C.border, 1.1);
    addText(slide, item[3], { x: x + 0.24, y: 5.24, w: 2.24, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 11.5, bold: true, color: item[4] === C.gold ? C.ink : item[4], align: "center" });
  });
  addText(slide, "Primero ejecutamos el control que mejor responde a nuestra hipótesis.", { x: M, y: 6.34, w: 11.88, h: 0.26, fontSize: 15, bold: true, color: C.red, align: "center" });
  validateSlide(slide, pptx);
}

/* 70 · Sabotajes A y B */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Sabotajes A + B", "Entorno y estructura dejan señales distintas", "Cada pareja compara el cambio temporal, el control esperado y la restauración mínima.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  const panels = [
    { x: M, letter: "A", title: "LOCKFILE DESALINEADO", accent: C.navy, fill: C.softBlue, change: "Agregar una dependencia solo en pyproject.toml", command: "uv lock --check", signal: "lockfile desactualizado", restore: "deshacer la línea agregada" },
    { x: 6.78, letter: "B", title: "IMPORT SIN USO", accent: C.red, fill: C.white, change: "Agregar import math en notas.py", command: "uv run ruff check .", signal: "F401 · import no utilizado", restore: "eliminar el import" },
  ];
  panels.forEach((panel) => {
    rect(slide, panel.x, 2.46, 5.84, 3.94, panel.fill, panel.fill === C.white ? C.border : panel.fill, 0.08);
    addCircleLabel(slide, panel.x + 0.34, 2.76, 0.64, panel.accent, panel.letter, { fontSize: 14 });
    addText(slide, panel.title, { x: panel.x + 1.2, y: 2.92, w: 4.1, h: 0.24, fontSize: 12, bold: true, color: panel.accent, charSpacing: 0.8 });
    const rows = [
      ["CAMBIO", panel.change],
      ["CONTROL", panel.command],
      ["SEÑAL", panel.signal],
      ["RESTAURAR", panel.restore],
    ];
    rows.forEach((row, index) => {
      const y = 3.56 + index * 0.68;
      addText(slide, row[0], { x: panel.x + 0.36, y, w: 1.08, h: 0.18, fontSize: 9.2, bold: true, color: panel.accent, charSpacing: 0.7 });
      addText(slide, row[1], { x: panel.x + 1.54, y: y - 0.04, w: 3.88, h: 0.42, fontFace: index === 1 || index === 2 ? TYPOGRAPHY.mono : TYPOGRAPHY.body, fontSize: index === 1 ? 13.2 : 13.5, bold: index === 1, color: C.ink, valign: "mid" });
      if (index < rows.length - 1) line(slide, panel.x + 0.36, y + 0.48, 5.08, panel.fill === C.white ? C.border : C.white, 0.8);
    });
  });
  validateSlide(slide, pptx);
}

/* 71 · Sabotaje C */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Sabotaje C", "El contrato puede fallar aunque pytest siga verde", "Cambiar la firma altera lo declarado; no necesariamente impide que Python ejecute el cuerpo.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  const code = `def nota_final(notas: list[str]) -> float:\n    """Calcula el promedio con criterio ROUND_HALF_UP."""\n    notas_decimales = [Decimal(str(nota)) for nota in notas]\n    total: Decimal = sum(notas_decimales, Decimal(0))\n    promedio: Decimal = total / Decimal(len(notas_decimales))\n    return float(promedio.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.5, w: 7.42, h: 2.9, title: "notas.py · firma saboteada", code, lang: "python", fontSize: 10.5 },
    guide: { x: 8.5, y: 2.5, w: 3.88, h: 2.9, title: "Contradicción declarada", accent: C.gold },
    notes: [
      { lineNumber: 1, color: C.gold, eyebrow: "Firma temporal", title: "list[str]", titleFontFace: TYPOGRAPHY.mono, titleFontSize: 22, body: "Las pruebas siguen entregando float. Pyrefly confronta ambos contratos.", bodyFontSize: 13.2, bodyY: 1.08, bodyH: 0.9 },
    ],
  });
  rect(slide, M, 5.7, 5.74, 0.72, C.paleRed, C.paleRed, 0.05);
  addText(slide, "PYREFLY  ·  incompatibilidades de tipos", { x: 1.02, y: 5.7, w: 5.16, h: 0.72, fontFace: TYPOGRAPHY.mono, fontSize: 13.5, bold: true, color: C.red, align: "center", valign: "mid" });
  rect(slide, 6.88, 5.7, 5.74, 0.72, C.successSoft, C.successSoft, 0.05);
  addText(slide, "PYTEST  ·  4 passed", { x: 7.2, y: 5.7, w: 5.1, h: 0.72, fontFace: TYPOGRAPHY.mono, fontSize: 15, bold: true, color: C.success, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 72 · Sabotaje D */
{
  const { slide } = createSlide("light");
  addHeader(slide, "4.4 · Sabotaje D", "La regla cambia en dos lugares", "ROUND_DOWN debe aparecer tanto en la importación como en quantize(); así falla el comportamiento y no un nombre inexistente.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  const code = `from decimal import ROUND_DOWN, Decimal\n\n\ndef nota_final(notas: list[float]) -> float:\n    """Calcula el promedio con criterio ROUND_DOWN."""\n    notas_decimales = [Decimal(str(nota)) for nota in notas]\n    total: Decimal = sum(notas_decimales, Decimal(0))\n    promedio: Decimal = total / Decimal(len(notas_decimales))\n    return float(promedio.quantize(Decimal("0.1"), rounding=ROUND_DOWN))`;
  addCodeGuide(slide, SH, {
    editor: { x: M, y: 2.52, w: 8.12, h: 3.5, title: "notas.py · regla temporal ROUND_DOWN", code, lang: "python", fontSize: 10.3 },
    guide: { x: 9.18, y: 2.52, w: 3.2, h: 3.5, title: "Cambio coherente", accent: C.red, titleFontSize: 9 },
    notes: [
      { lineNumber: 1, color: C.red, eyebrow: "Importación", title: "ROUND_DOWN", titleFontFace: TYPOGRAPHY.mono, titleFontSize: 15, body: "Constante válida.", bodyFontSize: 11.8, bodyY: 0.96, bodyH: 0.26 },
      { lineNumber: 9, color: C.gold, eyebrow: "Comportamiento", title: "rounding=...", titleFontFace: TYPOGRAPHY.mono, titleFontSize: 14.5, body: "La prueba 3.95 → 4.0 vuelve a quedar roja.", bodyFontSize: 11.8 },
    ],
  });
  rect(slide, M, 6.22, 11.88, 0.46, C.paleRed, C.paleRed, 0.04);
  addText(slide, "pytest  ·  assert 3.9 == 4.0  ·  restaurar ROUND_HALF_UP después de interpretar la falla", { x: 1.02, y: 6.22, w: 11.28, h: 0.46, fontFace: TYPOGRAPHY.mono, fontSize: 12.6, bold: true, color: C.red, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 73 · Restaurar y punto de control */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de control", "Restaurar también produce evidencia", "El bloque termina cuando el mismo control que detectó el sabotaje vuelve a quedar verde.");
  rect(slide, M, 2.4, 5.54, 3.84, C.navy, C.navy, 0.08);
  addText(slide, "CONTROL ASIGNADO", { x: 1.08, y: 2.76, w: 2.42, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1.0 });
  const restores = [
    ["A", "uv lock --check", C.softBlue],
    ["B", "ruff check .", C.red],
    ["C", "pyrefly check", C.gold],
    ["D", "pytest -q", C.success],
  ];
  restores.forEach((item, index) => {
    const y = 3.24 + index * 0.66;
    addCircleLabel(slide, 1.08, y, 0.44, item[2], item[0], { fontSize: 10, color: item[2] === C.gold || item[2] === C.softBlue ? C.ink : C.white });
    addText(slide, item[1], { x: 1.82, y: y + 0.06, w: 2.62, h: 0.24, fontFace: TYPOGRAPHY.mono, fontSize: 13.5, bold: true, color: C.white });
    addText(slide, "VERDE", { x: 4.64, y: y + 0.06, w: 0.92, h: 0.22, fontSize: 9.5, bold: true, color: C.success, align: "right", charSpacing: 0.7 });
  });
  const evidence = [
    ["01", "PROPUESTA AUDITADA", "cada decisión tiene una razón"],
    ["02", "DOS CASOS NUEVOS", "cubren riesgos distintos"],
    ["03", "PREDICCIÓN CONTRASTADA", "esperado versus diagnóstico real"],
    ["04", "PROYECTO RESTAURADO", "el control asignado vuelve a verde"],
  ];
  evidence.forEach((item, index) => {
    const y = 2.48 + index * 0.92;
    addCircleLabel(slide, 6.68, y, 0.5, index === 3 ? C.success : C.red, item[0], { fontSize: 9.5 });
    addText(slide, item[1], { x: 7.44, y: y + 0.02, w: 2.62, h: 0.22, fontSize: 11, bold: true, color: C.red, charSpacing: 0.7 });
    addText(slide, item[2], { x: 7.44, y: y + 0.34, w: 4.42, h: 0.3, fontSize: 15.5, bold: true, color: C.ink });
  });
  validateSlide(slide, pptx);
}

/* 74 · Preguntas Bloque 4 */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · Preguntas", "Tres preguntas para llevarse", "La pista orienta; la respuesta debe conectar riesgo, regla y precisión del diagnóstico.");
  addQuestion(slide, 2.44, 1, "¿Qué hace que un caso sugerido por un agente sea útil y no solo diferente?", "busca el riesgo nuevo que observa y la regla que justifica su expectativa");
  addQuestion(slide, 3.8, 2, "¿Por qué no deberíamos convertir inmediatamente [] → 0.0 en una prueba?", "descubrir una situación posible no significa conocer todavía la respuesta correcta");
  addQuestion(slide, 5.12, 3, "Si varias herramientas reaccionan al mismo cambio, ¿cuál conviene ejecutar primero?", "vuelve a la hipótesis y elige el diagnóstico más directo para confirmarla");
  validateSlide(slide, pptx);
}

/* 75 · Cierre Bloque 4 */
{
  const { slide } = createSlide("dark");
  addText(slide, "IDEA CLAVE · BLOQUE 4", { x: M, y: 0.82, w: 4.8, h: 0.28, fontSize: 11, bold: true, color: C.gold, charSpacing: 1.8 });
  addText(slide, "El agente amplía", { x: M, y: 1.46, w: 7.2, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 39, bold: true, color: C.white });
  addText(slide, "las posibilidades", { x: M, y: 2.26, w: 7.2, h: 0.76, fontFace: TYPOGRAPHY.display, fontSize: 39, bold: true, color: C.gold });
  addText(slide, "El equipo conserva la autoridad sobre la especificación y exige una razón para cada prueba aceptada.", { x: M, y: 3.42, w: 7.18, h: 1.0, fontSize: 18.5, color: C.softBlue });
  rect(slide, 8.36, 1.48, 3.92, 3.54, C.titleFill, C.titleFill, 0.08);
  addText(slide, "AGENTE", { x: 8.76, y: 1.92, w: 1.12, h: 0.22, fontSize: 10, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "propone", { x: 9.88, y: 1.84, w: 1.92, h: 0.34, fontSize: 20, bold: true, color: C.white, align: "right" });
  line(slide, 8.78, 2.54, 3.08, C.guide, 1.1);
  addText(slide, "EQUIPO", { x: 8.76, y: 2.92, w: 1.12, h: 0.22, fontSize: 10, bold: true, color: C.success, charSpacing: 1 });
  addText(slide, "decide", { x: 9.88, y: 2.84, w: 1.92, h: 0.34, fontSize: 20, bold: true, color: C.white, align: "right" });
  line(slide, 8.78, 3.54, 3.08, C.guide, 1.1);
  addText(slide, "EVIDENCIA", { x: 8.76, y: 3.92, w: 1.42, h: 0.22, fontSize: 10, bold: true, color: C.red, charSpacing: 1 });
  addText(slide, "verifica", { x: 10.32, y: 3.84, w: 1.48, h: 0.34, fontSize: 20, bold: true, color: C.white, align: "right" });
  rect(slide, M, 5.42, 11.88, 0.88, C.white, C.white, 0.05);
  addText(slide, "SIGUE → reunir las cuatro barreras y formular una conclusión proporcional a la evidencia", { x: 1.04, y: 5.42, w: 11.22, h: 0.88, fontSize: 15, bold: true, color: C.navy, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 76 · Apertura del cierre */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE DE LA CLASE · 10 MINUTOS", { x: M, y: 0.82, w: 5.2, h: 0.26, fontSize: 11, bold: true, color: C.gold, charSpacing: 1.7 });
  addText(slide, "¿Qué podemos", { x: M, y: 1.48, w: 7.2, h: 0.76, fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: C.white });
  addText(slide, "demostrar hoy?", { x: M, y: 2.3, w: 7.2, h: 0.8, fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: C.gold });
  addText(slide, "Pasamos de una impresión personal a una conclusión que otra persona puede revisar.", { x: M, y: 3.48, w: 7.02, h: 0.9, fontSize: 18.5, color: C.softBlue });
  rect(slide, 8.3, 1.5, 3.98, 3.58, C.titleFill, C.titleFill, 0.08);
  addText(slide, "NO DEMUESTRA", { x: 8.7, y: 1.92, w: 1.64, h: 0.2, fontSize: 10, bold: true, color: C.red, charSpacing: 0.9 });
  addText(slide, "software perfecto", { x: 8.7, y: 2.3, w: 3.16, h: 0.34, fontSize: 20, bold: true, color: C.white });
  line(slide, 8.7, 2.92, 3.14, C.guide, 1.1);
  addText(slide, "SÍ PERMITE", { x: 8.7, y: 3.26, w: 1.64, h: 0.2, fontSize: 10, bold: true, color: C.success, charSpacing: 0.9 });
  const qualities = ["conclusión acotada", "ejecución repetible", "evidencia revisable"];
  qualities.forEach((item, index) => {
    addCircleLabel(slide, 8.7, 3.66 + index * 0.42, 0.28, C.success, "✓", { fontSize: 8.5 });
    addText(slide, item, { x: 9.18, y: 3.68 + index * 0.42, w: 2.44, h: 0.2, fontSize: 13.5, bold: true, color: C.softBlue });
  });
  rect(slide, M, 5.54, 11.88, 0.78, C.white, C.white, 0.05);
  addText(slide, "DE «FUNCIONA» → A «ESTO ES LO QUE LA EVIDENCIA PERMITE AFIRMAR»", { x: 1.02, y: 5.54, w: 11.28, h: 0.78, fontSize: 15, bold: true, color: C.navy, align: "center", valign: "mid", charSpacing: 0.4 });
  validateSlide(slide, pptx);
}

/* 77 · Cadena de evidencia */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre · Cadena", "La conclusión se construye por capas", "Cada eslabón aporta una evidencia distinta y limita lo que podemos afirmar.");
  const chain = [
    ["01", "INTENCIÓN", "regla explícita", C.red],
    ["02", "ENTORNO", "uv.lock", C.navy],
    ["03", "ESTÁTICOS", "Ruff + Pyrefly", C.gold],
    ["04", "COMPORTAMIENTO", "4 pruebas", C.success],
    ["05", "CONCLUSIÓN", "proporcional", C.red],
  ];
  chain.forEach((item, index) => {
    const x = 0.78 + index * 2.48;
    addCircleLabel(slide, x + 0.64, 2.62, 0.72, item[3], item[0], { fontSize: 11, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: x, y: 3.58, w: 2.0, h: 0.24, fontSize: 10.5, bold: true, color: item[3] === C.gold ? C.ink : item[3], align: "center", charSpacing: 0.8 });
    addText(slide, item[2], { x: x, y: 4.12, w: 2.0, h: 0.34, fontFace: index === 1 || index === 2 || index === 3 ? TYPOGRAPHY.mono : TYPOGRAPHY.body, fontSize: 16, bold: true, color: C.ink, align: "center" });
    if (index < chain.length - 1) addArrow(slide, x + 1.86, 2.96, 0.48, C.red);
  });
  rect(slide, M, 5.28, 11.88, 0.94, C.navy, C.navy, 0.05);
  addText(slide, "Juntas permiten una afirmación repetible; ninguna autoriza a prometer que no existen otros defectos.", { x: 1.04, y: 5.28, w: 11.2, h: 0.94, fontSize: 15.5, bold: true, color: C.white, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 78 · Ejecución final compartida */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre · Ejecutar", "La última batería reúne las cuatro barreras", "Todo el curso ejecuta el mismo estado restaurado y conserva la evidencia final.", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  addTerminalPanel(slide, SH, {
    x: M, y: 2.46, w: 8.18, h: 4.02, title: "PowerShell · ejecución final compartida", fontSize: 12.5,
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
  rect(slide, 9.2, 2.46, 3.42, 4.02, C.navy, C.navy, 0.08);
  addText(slide, "NO BASTA DECIR", { x: 9.56, y: 2.82, w: 2.72, h: 0.2, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.9 });
  addText(slide, "«todo verde»", { x: 9.54, y: 3.2, w: 2.76, h: 0.42, fontSize: 22, bold: true, color: C.white, align: "center" });
  line(slide, 9.56, 3.92, 2.68, C.titleFill, 1.1);
  const explain = [
    ["01", "qué observó"],
    ["02", "qué podría detectar"],
    ["03", "qué todavía no descarta"],
  ];
  explain.forEach((item, index) => {
    const y = 4.24 + index * 0.62;
    addCircleLabel(slide, 9.52, y, 0.42, index === 2 ? C.red : C.success, item[0], { fontSize: 8.8 });
    addText(slide, item[1], { x: 10.18, y: y + 0.08, w: 1.88, h: 0.24, fontSize: 13.5, bold: true, color: C.softBlue });
  });
  validateSlide(slide, pptx);
}

/* 79 · Límites del verde */
{
  const { slide } = createSlide("dark");
  addText(slide, "CONCLUSIÓN PROPORCIONAL", { x: M, y: 0.82, w: 4.2, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "Cuatro verdes no equivalen", { x: M, y: 1.38, w: 9.4, h: 0.68, fontFace: TYPOGRAPHY.display, fontSize: 36, bold: true, color: C.white });
  addText(slide, "a software perfecto", { x: M, y: 2.1, w: 8.0, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 36, bold: true, color: C.gold });
  rect(slide, M, 3.24, 5.6, 2.46, C.titleFill, C.titleFill, 0.08);
  addText(slide, "PODEMOS AFIRMAR", { x: 1.08, y: 3.62, w: 2.24, h: 0.2, fontSize: 10, bold: true, color: C.success, charSpacing: 1 });
  addText(slide, "El entorno está alineado y la implementación satisface cuatro ejemplos ejecutados.", { x: 1.08, y: 4.1, w: 4.86, h: 0.92, fontSize: 18, bold: true, color: C.white });
  rect(slide, 6.62, 3.24, 5.66, 2.46, C.white, C.white, 0.08);
  addText(slide, "TODAVÍA NO MEDIMOS", { x: 7.02, y: 3.62, w: 2.58, h: 0.2, fontSize: 10, bold: true, color: C.red, charSpacing: 1 });
  const unmeasured = ["seguridad", "rendimiento", "facilidad de uso", "todos los escenarios"];
  unmeasured.forEach((item, index) => {
    const x = 7.02 + (index % 2) * 2.44;
    const y = 4.08 + Math.floor(index / 2) * 0.72;
    rect(slide, x, y, 2.18, 0.5, index === 3 ? C.paleRed : C.softNeutral, index === 3 ? C.paleRed : C.softNeutral, 0.04);
    addText(slide, item, { x, y, w: 2.18, h: 0.5, fontSize: 13, bold: true, color: C.ink, align: "center", valign: "mid" });
  });
  addText(slide, "La honestidad técnica también consiste en nombrar lo que la evidencia no cubre.", { x: M, y: 6.12, w: 11.88, h: 0.3, fontSize: 15.5, bold: true, color: C.softBlue, align: "center" });
  validateSlide(slide, pptx);
}

/* 80 · Evidencia mínima de salida */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre · Evidencia", "Cinco artefactos deben quedar en el proyecto", "La salida mínima permite reconstruir, revisar y volver a ejecutar lo aprendido.", false, {
    titleFontSize: 28,
    titleH: 1.02,
    subtitleY: 1.94,
  });
  const artifacts = [
    ["01", "pyproject.toml + uv.lock", "entorno reconstruible", C.navy],
    ["02", "configuración de Pyrefly", "contrato analizable", C.gold],
    ["03", "notas.py", "ROUND_HALF_UP explícito", C.red],
    ["04", "test_notas.py", "cuatro pruebas descriptivas", C.success],
    ["05", "registro final", "las cuatro barreras en verde", C.navy],
  ];
  artifacts.forEach((item, index) => {
    const isBottom = index >= 3;
    const x = isBottom ? 2.16 + (index - 3) * 4.84 : M + index * 4.0;
    const y = isBottom ? 4.52 : 2.42;
    const w = isBottom ? 4.36 : 3.66;
    rect(slide, x, y, w, 1.62, C.white, C.border, 0.07);
    rect(slide, x, y, w, 0.1, item[3], item[3]);
    addCircleLabel(slide, x + 0.26, y + 0.32, 0.54, item[3], item[0], { fontSize: 9.5, color: item[3] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: x + 1.02, y: y + 0.28, w: w - 1.28, h: 0.42, fontFace: index === 0 || index === 2 || index === 3 ? TYPOGRAPHY.mono : TYPOGRAPHY.body, fontSize: index === 0 ? 14 : 15, bold: true, color: C.ink, valign: "mid" });
    addText(slide, item[2], { x: x + 0.28, y: y + 1.02, w: w - 0.56, h: 0.28, fontSize: 13.5, color: C.slate, align: "center" });
  });
  validateSlide(slide, pptx);
}

/* 81 · Ticket de salida */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Ticket de salida", "Completa cuatro frases en una línea", "La última respuesta debe limitar la conclusión y evitar promesas que la evidencia no sostiene.");
  const prompts = [
    ["01", "uv aporta evidencia de que…", C.navy],
    ["02", "Ruff y Pyrefly no son equivalentes porque…", C.red],
    ["03", "La prueba roja fue útil cuando…", C.success],
    ["04", "Todavía no puedo afirmar que el programa…", C.gold],
  ];
  prompts.forEach((item, index) => {
    const y = 2.34 + index * 1.0;
    addCircleLabel(slide, M, y, 0.56, item[2], item[0], { fontSize: 10, color: item[2] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: 1.62, y: y + 0.04, w: 8.94, h: 0.34, fontSize: 18, bold: true, color: C.ink });
    line(slide, 1.62, y + 0.66, 10.66, index === 3 ? C.gold : C.border, index === 3 ? 1.8 : 1.1);
  });
  rect(slide, 9.56, 2.52, 2.7, 2.72, C.navy, C.navy, 0.07);
  addText(slide, "ÚLTIMA FRASE", { x: 9.9, y: 2.9, w: 2.02, h: 0.2, fontSize: 10, bold: true, color: C.gold, align: "center", charSpacing: 0.8 });
  addText(slide, "No es modestia.", { x: 9.88, y: 3.4, w: 2.06, h: 0.3, fontSize: 18, bold: true, color: C.white, align: "center" });
  addText(slide, "Es precisión sobre el alcance real de la evidencia.", { x: 9.86, y: 3.98, w: 2.1, h: 0.7, fontSize: 14.5, color: C.softBlue, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

/* 82 · Próxima clase */
{
  const { slide } = createSlide("light");
  addHeader(slide, "Próxima clase", "De comandos verdes a dimensiones de calidad", "ISO/IEC 25010 ampliará la pregunta: ¿qué debe exhibir un producto para considerarlo de calidad?", false, { titleFontSize: 29, titleH: 1.0, subtitleY: 1.9 });
  rect(slide, M, 2.54, 4.5, 3.54, C.navy, C.navy, 0.08);
  addText(slide, "HOY", { x: 1.08, y: 2.9, w: 1.02, h: 0.2, fontSize: 10, bold: true, color: C.gold, charSpacing: 1 });
  const today = ["uv lock --check", "ruff + pyrefly", "pytest · 4 casos"];
  today.forEach((item, index) => {
    rect(slide, 1.08, 3.36 + index * 0.7, 3.58, 0.5, C.titleFill, C.titleFill, 0.04);
    addText(slide, item, { x: 1.08, y: 3.36 + index * 0.7, w: 3.58, h: 0.5, fontFace: TYPOGRAPHY.mono, fontSize: 13.5, bold: true, color: C.white, align: "center", valign: "mid" });
  });
  addArrow(slide, 5.54, 4.14, 1.06, C.red);
  rect(slide, 6.84, 2.54, 5.78, 3.54, C.white, C.border, 0.08);
  addText(slide, "PRÓXIMA MIRADA · ISO/IEC 25010", { x: 7.24, y: 2.9, w: 3.84, h: 0.22, fontSize: 10, bold: true, color: C.red, charSpacing: 0.9 });
  const dimensions = [
    ["FUNCIONAL", "¿hace lo correcto?", C.success],
    ["SEGURIDAD", "¿protege lo importante?", C.red],
    ["RENDIMIENTO", "¿responde adecuadamente?", C.gold],
    ["USABILIDAD", "¿se puede usar bien?", C.navy],
  ];
  dimensions.forEach((item, index) => {
    const x = 7.24 + (index % 2) * 2.52;
    const y = 3.42 + Math.floor(index / 2) * 1.04;
    rect(slide, x, y, 2.26, 0.82, index === 1 ? C.paleRed : index === 2 ? C.warningSoft : index === 3 ? C.softBlue : C.successSoft, index === 1 ? C.paleRed : index === 2 ? C.warningSoft : index === 3 ? C.softBlue : C.successSoft, 0.05);
    addText(slide, item[0], { x: x + 0.16, y: y + 0.16, w: 1.94, h: 0.18, fontSize: 9.2, bold: true, color: item[2], align: "center", charSpacing: 0.6 });
    addText(slide, item[1], { x: x + 0.12, y: y + 0.44, w: 2.02, h: 0.22, fontSize: 11.5, bold: true, color: C.ink, align: "center" });
  });
  validateSlide(slide, pptx);
}

/* 83 · Mensaje final */
{
  const { slide } = createSlide("dark");
  addText(slide, "CIERRE · CLASE 02", { x: M, y: 0.82, w: 3.8, h: 0.24, fontSize: 10.5, bold: true, color: C.gold, charSpacing: 1.6 });
  addText(slide, "La calidad no consiste", { x: M, y: 1.42, w: 9.0, h: 0.68, fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.white });
  addText(slide, "en confiar más", { x: M, y: 2.16, w: 7.2, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 37, bold: true, color: C.gold });
  addText(slide, "Consiste en formular una expectativa, producir evidencia y limitar cada conclusión a lo que esa evidencia realmente demuestra.", { x: M, y: 3.22, w: 8.04, h: 1.22, fontSize: 19, color: C.softBlue });
  const verbs = [
    ["01", "EXPECTATIVA", C.red],
    ["02", "EVIDENCIA", C.gold],
    ["03", "CONCLUSIÓN", C.success],
  ];
  verbs.forEach((item, index) => {
    const y = 1.64 + index * 1.12;
    addCircleLabel(slide, 9.02, y, 0.66, item[2], item[0], { fontSize: 10.5, color: item[2] === C.gold ? C.ink : C.white });
    addText(slide, item[1], { x: 10.0, y: y + 0.18, w: 2.0, h: 0.24, fontSize: 12.5, bold: true, color: item[2], charSpacing: 0.9 });
    if (index < verbs.length - 1) addArrow(slide, 9.24, y + 0.8, 0.24, C.red);
  });
  rect(slide, M, 5.48, 11.88, 0.82, C.white, C.white, 0.05);
  addText(slide, "PRÓXIMA CLASE  →  ISO/IEC 25010: ampliar qué entendemos por calidad", { x: 1.04, y: 5.48, w: 11.22, h: 0.82, fontSize: 15, bold: true, color: C.navy, align: "center", valign: "mid" });
  validateSlide(slide, pptx);
}

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`Deck generado: ${outputPptx} (${pptx._slides.length} slides)`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
