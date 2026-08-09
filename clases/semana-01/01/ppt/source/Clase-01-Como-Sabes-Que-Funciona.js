const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const { imageSizingContain, imageSizingCrop } = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TYPOGRAPHY } = theme;
const { addChip, addCodePanel, addTerminalPanel } = components;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP",
  subject: "PRO402 - Clase 01",
  title: "¿Cómo sabes que funciona?",
});

const SH = pptx.ShapeType;
const W = 13.333;
const H = 7.5;
const M = 0.72;

/* ---------------------------------------------------------------- paleta
   El navy es el CAMPO del deck, no un acento ocasional. Los cuatro colores
   de acento se usan codificados (paso 01..04 o categoria), nunca decorativos.
   Contrastes sobre el campo #0B2038, medidos con la formula WCAG:
     ink 17.1 · body 11.9 · soft 5.3 · a2 6.9 · a3 8.6 · a4 5.4
   El rojo a1 queda en 4.1: se usa en titulares y acentos graficos, no en
   texto chico sobre el campo.
*/
const DARK = {
  dark: true,
  field: "0B2038",
  panel: "12314F",
  edge: "223F5C",
  ink: "FFFFFF",
  lead: "A9BED4",  // bajadas 13pt sobre oscuro
  body: "C7D6E6",  // cuerpo 12pt
  mute: "9DB2C9",  // glosas 11.4pt
  soft: "9DB2C9",
  a1: "E23B42",
  a2: "35B7C6",
  a3: "E0BC5A",
  a4: "3FAE6A",
};

// Modo claro. El campo oscuro permanente cansa la vista: se alterna según la
// FUNCIÓN de la lámina — oscuro para peso y transición (portada, aperturas,
// declaraciones, casos graves), claro para trabajo y lectura (datos, listas,
// código). Contrastes sobre #F5F1E9, medidos con la fórmula WCAG:
//   ink 13.6 · body 9.2 · soft 4.9 · a1 5.5 · a2 5.3 · a4 4.8 · a3 4.5
const LIGHT = {
  dark: false,
  field: "F8F3EC",
  panel: "FFFDFC",
  edge: "CBBEAE",
  ink: "10263F",
  lead: "3A4E63",  // 6.9 · bajadas 13pt, secundario por TAMANO
  body: "16293D",  // 13.1 · cuerpo 12pt, casi negro
  mute: "3E5063",  // 7.4 · glosas 11.4pt
  soft: "3E5063",
  a1: "C0161D",
  a2: "0E6E7A",
  a3: "8A6A12",
  a4: "1F7A45",
  pale1: "F6DFDF",
  pale2: "DDEFF0",
  pale3: "F3E8C8",
  pale4: "E0EFE6",
};

let T = DARK;
function mode(m) {
  T = m === "light" ? LIGHT : DARK;
}
function acc(i) {
  return [T.a1, T.a2, T.a3, T.a4][i % 4];
}

const rootDir = path.resolve(__dirname, "..");
const outputPptx = path.join(rootDir, "Clase-01-Como-Sabes-Que-Funciona.pptx");
// Regenerados desde el SVG vectorial: el PNG del framework trae fondo blanco
// horneado (alfa 255 en toda la imagen) y solo 156 px de ancho.
const IMG = {
  therac: path.resolve(__dirname, "assets/caso-therac-interfaz.png"),
  ariane: path.resolve(__dirname, "assets/caso-ariane5.jpg"),
  nyse: path.resolve(__dirname, "assets/caso-nyse.jpg"),
  apollo: path.resolve(__dirname, "assets/caso-apollo-hamilton.jpg"),
};
const LOGO = {
  color: path.resolve(__dirname, "assets/logo-aiep-hd.png"),
  white: path.resolve(__dirname, "assets/logo-aiep-hd-blanco.png"),
};

/* --------------------------------------------------------------- helpers */

function bg(slide, color = T.field) {
  slide.background = { color };
}

function text(slide, value, o = {}) {
  slide.addText(value || "", {
    x: o.x,
    y: o.y,
    w: o.w,
    h: o.h,
    fontFace: o.fontFace || TYPOGRAPHY.body,
    fontSize: o.fontSize || 12,
    bold: o.bold || false,
    italic: o.italic || false,
    color: o.color || T.body,
    align: o.align || "left",
    valign: o.valign || "top",
    lineSpacingMultiple: o.lineSpacingMultiple,
    charSpacing: o.charSpacing,
    margin: o.margin ?? 0,
    fit: o.fit || "shrink",
    breakLine: false,
  });
}

function bar(slide, x, y, w, h, color) {
  slide.addShape(SH.rect, { x, y, w, h, fill: { color }, line: { color } });
}

function logo(slide, o = {}) {
  // Sobre campo claro va el logo a color; sobre campo oscuro, el blanco.
  const p = (o.light ?? !T.dark) ? LOGO.color : LOGO.white;
  const w = o.w || 1.34;
  const x = o.x ?? W - M - w;
  const y = o.y ?? 0.44;
  slide.addImage({ path: p, ...imageSizingContain(p, x, y, w, o.h || 0.5) });
}

/** Geometria del logo AIEP como elemento estructural grande, no decorativo. */
function aiepMotif(slide, x, y, unit, color, o) {
  const trans = (o && o.transparency) || 0;
  const gap = unit * 0.34;
  const hs = [unit * 2.0, unit * 2.6, unit * 2.0];
  [0, 1, 2].forEach(function (i) {
    const bx = x + i * (unit + gap);
    slide.addShape(SH.rect, {
      x: bx, y: y + (hs[1] - hs[i]), w: unit, h: hs[i],
      fill: { color, transparency: trans }, line: { color, transparency: trans },
    });
    if (i === 1) {
      slide.addShape(SH.triangle, {
        x: bx, y: y - unit * 0.62, w: unit, h: unit * 0.62,
        fill: { color, transparency: trans }, line: { color, transparency: trans },
      });
    }
  });
}

/** Firma de esquina. Hace reconocible el deck aunque se tape el logo. */
function cornerMark(slide) {
  bar(slide, 0, 0, 0.62, 0.1, T.a1);
  bar(slide, 0.72, 0, 0.4, 0.1, T.a2);
  bar(slide, 1.22, 0, 0.28, 0.1, T.a3);
}

function foot(slide) {
  text(slide, "PRO402  ×  AIEP OSORNO", {
    x: M,
    y: H - 0.64,
    w: 4.6,
    h: 0.28,
    fontSize: 9,
    bold: true,
    color: T.mute,
    charSpacing: 2.2,
  });
  slide.addText(String(pptx._slides.length).padStart(2, "0"), {
    x: W - M - 0.9,
    y: H - 0.7,
    w: 0.9,
    h: 0.32,
    fontFace: TYPOGRAPHY.display,
    fontSize: 14,
    bold: true,
    color: T.ink,
    align: "right",
    margin: 0,
  });
}

/** Cabecera de lamina de desarrollo. Titular grande, sin caja. */
function head(slide, chipText, title, subtitle, o = {}) {
  bg(slide);
  cornerMark(slide);
  const sectionColor = o.chip || T.a1;

  // El overline abierto reemplaza al chip corporativo; el logo completo se
  // mantiene en todas las láminas según el estándar AIEP vigente.
  bar(slide, M, 0.58, 0.16, 0.12, sectionColor);
  text(slide, chipText.toUpperCase(), {
    x: M + 0.28, y: 0.5, w: Math.max(o.chipW || 4.2, 4.2), h: 0.28,
    fontSize: 9.2, bold: true, color: sectionColor, charSpacing: 1.5,
  });
  logo(slide);
  text(slide, title, {
    x: M - 0.04,
    y: o.titleY || 0.98,
    w: o.titleW || 10.5,
    h: o.titleH || 0.94,
    fontFace: TYPOGRAPHY.display,
    fontSize: o.titleSize || 32,
    bold: true,
    color: T.ink,
    lineSpacingMultiple: 0.98,
  });
  if (subtitle) {
    text(slide, subtitle, {
      x: M,
      y: o.subtitleY || 1.92,
      w: o.subtitleW || 10.2,
      h: 0.38,
      fontSize: 13.5,
      color: T.lead,
    });
  }
  foot(slide);
}

/** Marco claro alrededor de un artefacto tecnico: lo separa del campo. */
function frame(slide, x, y, w, h) {
  slide.addShape(SH.roundRect, {
    x: x - 0.08,
    y: y - 0.08,
    w: w + 0.16,
    h: h + 0.16,
    rectRadius: 0.06,
    fill: { color: "FFFFFF" },
    line: { color: "FFFFFF" },
  });
}

/** Caja de panel: superficie interior para artefactos tecnicos. */
function panelBox(slide, x, y, w, h) {
  slide.addShape(SH.roundRect, {
    x, y, w, h, rectRadius: 0.04,
    fill: { color: "0F1720" }, line: { color: "0F1720" },
  });
}

/** Foto enmarcada con pie de credito. La procedencia vive en SOURCES.md. */
function photo(slide, src, x, y, w, h, caption) {
  frame(slide, x, y, w, h);
  slide.addImage({ path: src, ...imageSizingCrop(src, x, y, w, h) });
  if (caption) {
    text(slide, caption, {
      x, y: y + h + 0.16, w, h: 0.3, fontSize: 9.5, italic: true, color: T.mute,
    });
  }
}

/** Fila de paso: numeral + regla de color + etiqueta + glosa. Sin cajas. */
function stepRow(slide, y, i, label, gloss, o = {}) {
  const color = o.color || acc(i);
  const x = o.x ?? M;
  const labelW = o.labelW || 2.4;
  text(slide, String(i + 1).padStart(2, "0"), {
    x,
    y,
    w: 0.58,
    h: 0.32,
    fontFace: TYPOGRAPHY.display,
    fontSize: 15,
    bold: true,
    color,
  });
  bar(slide, x + 0.64, y + 0.16, o.ruleW || 0.9, 0.022, color);
  text(slide, label, {
    x: x + 0.64 + (o.ruleW || 0.9) + 0.24,
    y,
    w: labelW,
    h: 0.32,
    fontSize: 12.5,
    bold: true,
    color: T.ink,
    charSpacing: 0.5,
  });
  text(slide, gloss, {
    x: x + 0.64 + (o.ruleW || 0.9) + 0.24 + labelW + 0.24,
    y: y + 0.02,
    w: o.glossW || 5.4,
    h: 0.3,
    fontSize: 12,
    color: T.body,
  });
}

/** Pregunta de cierre con una pista orientadora que no entrega la respuesta. */
function questionRow(slide, y, i, question, hint) {
  const color = acc(i);
  text(slide, String(i + 1).padStart(2, "0"), {
    x: M, y: y - 0.03, w: 0.86, h: 0.54,
    fontFace: TYPOGRAPHY.display, fontSize: 31, bold: true, color,
  });
  text(slide, question, {
    x: M + 1.08, y, w: 10.72, h: 0.56,
    fontFace: TYPOGRAPHY.display, fontSize: 17.6, bold: true,
    color: T.ink, lineSpacingMultiple: 1.0,
  });
  bar(slide, M + 1.08, y + 0.72, 0.38, 0.025, color);
  text(slide, "PISTA", {
    x: M + 1.6, y: y + 0.62, w: 0.72, h: 0.24,
    fontSize: 9, bold: true, color, charSpacing: 1.3,
  });
  text(slide, hint, {
    x: M + 2.42, y: y + 0.59, w: 9.36, h: 0.3,
    fontSize: 10.8, italic: true, color: T.mute,
  });
}

function kicker(slide, label, x, y, color = T.a3, w = 5) {
  text(slide, label, {
    x,
    y,
    w,
    h: 0.28,
    fontSize: 9.5,
    bold: true,
    color,
    charSpacing: 2.2,
  });
}

/** Lamina-declaracion: una sola idea, tipografia grande, mucho aire. */
function statement(slide, kickerText, body, o = {}) {
  bg(slide);
  cornerMark(slide);
  logo(slide);
  const statementColor = o.rule || o.kickerColor || T.a1;
  // Una marca grande y silenciosa evita que las declaraciones sean solo texto
  // flotando sobre navy y les da una firma editorial reconocible.
  aiepMotif(slide, 10.05, 2.84, 0.72, statementColor, { transparency: 84 });
  const ky = o.kickerY || 2.12;
  kicker(slide, kickerText, M, ky, o.kickerColor || T.a3, 8);
  bar(slide, M, ky + 0.44, 1.3, 0.05, o.rule || T.a1);
  text(slide, body, {
    x: M - 0.04,
    y: o.bodyY || 2.94,
    w: o.bodyW || 9.2,
    h: o.bodyH || 2.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: o.size || 34,
    bold: true,
    color: T.ink,
    lineSpacingMultiple: 1.04,
  });
  if (o.tail) {
    text(slide, o.tail, {
      x: M,
      y: o.tailY || 5.5,
      w: o.tailW || 8.8,
      h: 0.6,
      fontSize: 13.5,
      color: T.lead,
      lineSpacingMultiple: 1.08,
    });
  }
  foot(slide);
}

function s(m) {
  mode(m || "dark");
  return pptx.addSlide();
}

/* ====================================================== 01 · PORTADA */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl, { w: 1.62, y: 0.52, h: 0.6 });

  addChip(sl, SH, "CLASE 01  ·  UNIDAD 01", { x: M, y: 1.16, w: 2.9, fill: T.a1 });

  text(sl, "¿Cómo sabes", {
    x: M - 0.06, y: 1.86, w: 6.7, h: 1.06,
    fontFace: TYPOGRAPHY.display, fontSize: 54, bold: true, color: T.ink,
  });
  text(sl, "que funciona?", {
    x: M - 0.06, y: 2.9, w: 6.7, h: 1.06,
    fontFace: TYPOGRAPHY.display, fontSize: 54, bold: true, color: T.a2,
  });

  text(sl, "Calidad, testing y el oficio de demostrar\nque el código sirve.", {
    x: M, y: 4.16, w: 6.4, h: 0.9,
    fontSize: 15.5, bold: true, color: T.body, lineSpacingMultiple: 1.1,
  });

  bar(sl, M, 5.3, 1.4, 0.03, T.a1);
  text(sl, "Taller de Testing y Calidad de Software  ·  PRO402", {
    x: M, y: 5.56, w: 6.4, h: 0.3, fontSize: 11.5, color: T.mute,
  });
  text(sl, "Lunes 10 de agosto de 2026  ·  08:30 a 10:50  ·  Diego Obando", {
    x: M, y: 5.88, w: 6.4, h: 0.3, fontSize: 11.5, color: T.mute,
  });

  const px = 7.62;
  const py = 1.72;
  const pw = 4.98;
  const ph = 2.62;
  frame(sl, px, py, pw, ph);
  addCodePanel(sl, SH, {
    x: px, y: py, w: pw, h: ph,
    title: "notas.py", lang: "python", fontSize: 11.8,
    code: [
      "def nota_final(",
      "    notas: list[float]",
      ") -> float:",
      "    promedio = (",
      "        sum(notas) / len(notas)",
      "    )",
      "    return round(promedio, 1)",
    ].join("\n"),
  });
  bar(sl, px, py + ph + 0.34, 0.32, 0.03, T.a1);
  text(sl, "Esta función reprueba a un estudiante\nque debía aprobar. Hoy vamos a ver por qué.", {
    x: px, y: py + ph + 0.52, w: pw, h: 0.62,
    fontSize: 11.8, color: T.mute, lineSpacingMultiple: 1.08,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 02 · LA PREGUNTA */
{
  const sl = s("dark");
  statement(sl, "LA PREGUNTA DE LAS PRÓXIMAS OCHO SEMANAS",
    "Terminaste de programar algo.\n¿Cómo sabes que funciona?", {
      size: 40, bodyY: 2.9, bodyH: 1.9, kickerColor: T.a2,
      tail: "No «¿está listo?», ni «¿compila?», ni «¿se ve bien?». Cómo lo SABES: qué evidencia tienes.",
      tailY: 5.2,
    });
  validateSlide(sl, pptx);
}

/* ====================================================== 03 · OBJETIVOS */
{
  const sl = s("light");
  head(sl, "Clase 01 · Encuadre", "Al terminar hoy vas a poder…", null, { chip: T.a2 });

  const items = [
    ["DISTINGUIR", "«Me funcionó» y «está probado» no significan lo mismo."],
    ["RECONOCER", "Un programa puede estar equivocado y no fallar nunca."],
    ["MEDIR", "Dejar de opinar y comparar contra un estándar internacional."],
    ["DIMENSIONAR", "Tres casos reales: dinero, sistemas y vidas perdidas."],
    ["SITUARTE", "Qué vas a construir en ocho semanas y cómo se evalúa."],
  ];
  let y = 2.5;
  items.forEach(([l, g], i) => {
    stepRow(sl, y, i, l, g, { labelW: 2.2, glossW: 7.3, ruleW: 0.85 });
    if (i < items.length - 1) bar(sl, M, y + 0.52, 11.9, 0.012, T.edge);
    y += 0.78;
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 04 · MAPA */
{
  const sl = s("light");
  head(sl, "Clase 01 · Recorrido", "El camino de hoy",
    "Cuatro paradas, de una función rota al mapa de las ocho semanas.", { chip: T.a2 });

  bar(sl, M, 3.64, 11.6, 0.022, T.edge);

  const stops = [
    ["08:45", "¿Qué significa\nque funcione?", "25 min"],
    ["09:10", "Calidad medible\ny su costo", "30 min"],
    ["09:50", "El mapa\ndel módulo", "30 min"],
    ["10:20", "De dónde\npartimos", "20 min"],
  ];
  const step = 2.98;
  stops.forEach(([hour, label, dur], i) => {
    const x = M + i * step;
    const c = acc(i);
    sl.addShape(SH.ellipse, {
      x: x - 0.08, y: 3.57, w: 0.22, h: 0.22, fill: { color: c }, line: { color: c },
    });
    text(sl, hour, {
      x, y: 2.68, w: 2.4, h: 0.34,
      fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: c,
    });
    text(sl, label, {
      x, y: 4.02, w: 2.6, h: 0.76,
      fontFace: TYPOGRAPHY.display, fontSize: 15, bold: true, color: T.ink,
      lineSpacingMultiple: 0.98,
    });
    text(sl, dur, { x, y: 4.84, w: 2.4, h: 0.28, fontSize: 11.4, color: T.soft });
  });

  bar(sl, M, 5.66, 0.06, 0.86, T.a3);
  text(sl, "Pausa 09:40  ·  Cierre 10:40", {
    x: M + 0.3, y: 5.72, w: 3.6, h: 0.3, fontSize: 11.5, bold: true, color: T.a3,
  });
  text(sl, "Hoy no instalamos nada: eso es el martes. Hoy construimos el criterio.", {
    x: M + 0.3, y: 6.06, w: 8.8, h: 0.3, fontSize: 11.5, color: T.body,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 05 · APERTURA B1 */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl);

  text(sl, "01", {
    x: M - 0.14, y: 1.68, w: 3.6, h: 2.4,
    fontFace: TYPOGRAPHY.display, fontSize: 140, bold: true, color: T.a1,
  });
  bar(sl, M, 4.42, 2.0, 0.06, T.a2);
  kicker(sl, "BLOQUE 1  ·  25 MINUTOS", M, 4.7, T.a3, 3.9);

  text(sl, "¿Qué significa\nque un programa\nfuncione?", {
    x: 4.96, y: 1.84, w: 7.6, h: 2.8,
    fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: T.ink,
    lineSpacingMultiple: 1.0,
  });
  text(sl, "Parecer correcto y ser correcto no son lo mismo.", {
    x: 4.96, y: 4.86, w: 7.6, h: 0.4, fontSize: 14, bold: true, color: T.a2,
  });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ====================================================== 06 · LA FRASE */
{
  const sl = s("dark");
  statement(sl, "EL ESTÁNDAR DE CALIDAD MÁS USADO DE LA INDUSTRIA",
    "«Sí, lo probé\ny anduvo.»", {
      size: 46, bodyY: 2.9, bodyH: 2.0, kickerColor: T.a2,
      tail: "El problema no es que sea mentira. El problema es qué describe: una experiencia, no una propiedad del programa.",
      tailY: 5.34, tailW: 8.8,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 07 · EXPERIENCIA / PROPIEDAD */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Distinción", "Una experiencia no se puede auditar",
    "Una propiedad sí: se comprueba, se repite y se hereda.", { chip: T.a2 });

  bar(sl, 6.58, 2.6, 0.014, 3.5, T.edge);

  kicker(sl, "EXPERIENCIA", M, 2.64, T.soft, 4);
  text(sl, "«A mí me funcionó»", {
    x: M, y: 3.0, w: 5.4, h: 0.5,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: T.mute,
  });
  ["Ocurrió una vez", "Depende de quién lo probó", "No queda registro", "Caduca al primer cambio"].forEach((t, i) => {
    const y = 3.76 + i * 0.5;
    bar(sl, M, y + 0.1, 0.13, 0.13, T.soft);
    text(sl, t, { x: M + 0.34, y, w: 5.0, h: 0.32, fontSize: 12.5, color: T.body });
  });

  kicker(sl, "PROPIEDAD", 7.12, 2.64, T.a2, 4);
  text(sl, "«Funciona, y puedo\ndemostrarlo»", {
    x: 7.12, y: 3.0, w: 5.4, h: 0.94,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: T.ink,
    lineSpacingMultiple: 0.98,
  });
  ["Se ejecuta cuantas veces haga falta", "Da igual quién la corra", "Queda escrita como código", "Avisa cuando algo se rompe"].forEach((t, i) => {
    const y = 4.22 + i * 0.48;
    bar(sl, 7.12, y + 0.1, 0.13, 0.13, T.a2);
    text(sl, t, { x: 7.46, y, w: 5.0, h: 0.32, fontSize: 12.5, color: T.body });
  });

  text(sl, "Todo el módulo cabe en pasar de la izquierda a la derecha.", {
    x: M, y: 6.4, w: 11.9, h: 0.32, fontSize: 13, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 08 · LA FUNCIÓN */
{
  const sl = s("light");
  head(sl, "Bloque 1 · El caso", "Una función que todos habríamos aprobado", null, { chip: T.a4 });

  const px = M;
  const py = 2.2;
  const pw = 7.0;
  const ph = 2.5;
  frame(sl, px, py, pw, ph);
  addCodePanel(sl, SH, {
    x: px, y: py, w: pw, h: ph,
    title: "notas.py", lang: "python", fontSize: 11.5,
    code: [
      "def nota_final(notas: list[float]) -> float:",
      '    """Promedio de las notas parciales."""',
      "    promedio = sum(notas) / len(notas)",
      "    return round(promedio, 1)",
    ].join("\n"),
  });

  const notes = [
    ["Tipos declarados", "Recibe decimales, devuelve un decimal.", T.a2],
    ["Documentada", "Dice qué hace en una línea.", T.a3],
    ["Hace una sola cosa", "Sin ramas, sin efectos colaterales.", T.a4],
  ];
  notes.forEach(([t, g, c], i) => {
    const y = 2.26 + i * 0.84;
    bar(sl, 8.2, y + 0.04, 0.05, 0.52, c);
    text(sl, t, { x: 8.46, y, w: 4.1, h: 0.3, fontSize: 12.5, bold: true, color: T.ink });
    text(sl, g, { x: 8.46, y: y + 0.32, w: 4.1, h: 0.3, fontSize: 11.8, color: T.soft });
  });

  bar(sl, M, 5.14, 0.06, 0.92, T.a4);
  text(sl, "Y además funciona", {
    x: M + 0.3, y: 5.2, w: 3.2, h: 0.3, fontSize: 12.5, bold: true, color: T.a4,
  });
  text(sl, "nota_final([6.0, 5.5, 6.5])   →   6.0", {
    x: M + 0.3, y: 5.58, w: 5.6, h: 0.34,
    fontFace: TYPOGRAPHY.mono, fontSize: 13, color: T.ink,
  });
  text(sl, "Pasa la revisión visual de cualquier programador.", {
    x: 7.4, y: 5.6, w: 5.2, h: 0.3, fontSize: 11.5, italic: true, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================== 09 · DOS ESTUDIANTES */
{
  const sl = s("dark");
  head(sl, "Bloque 1 · El caso", "Dos estudiantes con el mismo 3.95",
    "En la escala chilena se aprueba con 4.0: ambos deberían aprobar.", { chip: T.a4 });

  sl.addShape(SH.rect, {
    x: 0, y: 2.68, w: W, h: 2.9, fill: { color: T.panel }, line: { color: T.panel },
  });

  const sides = [
    { x: 0.92, tag: "ESCRITO", code: "round(3.95, 1)", res: "4.0", verdict: "aprueba", c: T.a4 },
    { x: 7.5, tag: "CALCULADO", code: "nota_final([3.8, 4.1, 3.95])", res: "3.9", verdict: "reprueba", c: T.a1 },
  ];
  sides.forEach((b) => {
    kicker(sl, b.tag, b.x, 3.0, b.c, 3);
    text(sl, b.code, {
      x: b.x, y: 3.34, w: 4.4, h: 0.32,
      fontFace: TYPOGRAPHY.mono, fontSize: 12.5, color: T.body,
    });
    bar(sl, b.x, 3.84, 0.85, 0.03, b.c);
    text(sl, b.res, {
      x: b.x - 0.08, y: 4.02, w: 1.95, h: 1.2,
      fontFace: TYPOGRAPHY.display, fontSize: 68, bold: true, color: T.ink,
      lineSpacingMultiple: 0.86,
    });
    text(sl, b.verdict, {
      x: b.x + 1.99, y: 4.46, w: 2.4, h: 0.44,
      fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: b.c,
    });
  });

  sl.addShape(SH.ellipse, {
    x: W / 2 - 0.6, y: 3.5, w: 1.2, h: 1.2,
    fill: { color: T.field }, line: { color: T.a3, pt: 1.4 },
  });
  text(sl, "3.95", {
    x: W / 2 - 0.6, y: 3.8, w: 1.2, h: 0.34,
    fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.a3, align: "center",
  });
  text(sl, "el mismo\npromedio", {
    x: W / 2 - 0.6, y: 4.16, w: 1.2, h: 0.42,
    fontSize: 8.5, color: T.mute, align: "center", lineSpacingMultiple: 0.95,
  });

  text(sl, "La diferencia no está en las notas: está en si el 3.95 fue escrito o calculado.", {
    x: M, y: 5.94, w: 11.9, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: T.ink,
  });

  validateSlide(sl, pptx);
}

/* =============================================== 10 · LO QUE GUARDA EL PC */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Por qué", "Ninguno de los dos es realmente 3.95",
    "Los decimales no se guardan exactos: se guardan aproximados en binario.", { chip: T.a3 });

  const rows = [
    ["3.95 escrito directamente", "3.95000000000000017763…", "queda ARRIBA de 3.95", "4.0", T.a4],
    ["Promedio de 3.8, 4.1 y 3.95", "3.94999999999999970000…", "queda ABAJO de 3.95", "3.9", T.a1],
  ];
  let y = 2.62;
  rows.forEach(([origen, guarda, lado, res, c]) => {
    bar(sl, M, y, 0.05, 1.14, c);
    text(sl, origen, { x: M + 0.3, y: y + 0.04, w: 3.5, h: 0.32, fontSize: 13, bold: true, color: T.ink });
    text(sl, lado, { x: M + 0.3, y: y + 0.42, w: 3.5, h: 0.3, fontSize: 11.8, color: c });
    text(sl, guarda, {
      x: 4.86, y: y + 0.2, w: 5.9, h: 0.42,
      fontFace: TYPOGRAPHY.mono, fontSize: 14, color: T.body,
    });
    text(sl, res, {
      x: 11.0, y: y + 0.02, w: 1.6, h: 0.9,
      fontFace: TYPOGRAPHY.display, fontSize: 34, bold: true, color: c, align: "right",
    });
    y += 1.4;
  });

  bar(sl, M, 5.62, 11.9, 0.014, T.edge);
  text(sl, "Para una persona los dos son 3.95. Para el computador caen a lados opuestos de la frontera.", {
    x: M, y: 5.9, w: 11.9, h: 0.36, fontSize: 13.5, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 11 · REDONDEO */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Segunda sorpresa", "Y el redondeo tampoco es el del colegio", null, { chip: T.a3 });

  const tx = M;
  const ty = 2.2;
  const tw = 6.1;
  const th = 2.66;
  frame(sl, tx, ty, tw, th);
  addTerminalPanel(sl, SH, {
    x: tx, y: ty, w: tw, h: th, title: "Python",
    lines: [
      { text: ">>> round(4.5)" },
      { text: "4", kind: "muted" },
      { text: ">>> round(5.5)" },
      { text: "6", kind: "muted" },
      { text: ">>> round(2.5)" },
      { text: "2", kind: "muted" },
    ],
  });

  kicker(sl, "REDONDEO BANCARIO", 7.44, 2.26, T.a3, 5);
  text(sl, "Las mitades exactas van\nal número PAR más cercano.", {
    x: 7.44, y: 2.6, w: 5.16, h: 0.84,
    fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: T.ink, lineSpacingMultiple: 1.0,
  });
  text(sl, "No es un error de Python: es una convención legítima que reduce el sesgo acumulado en estadística y finanzas. Pero no es la que espera alguien calculando notas.", {
    x: 7.44, y: 3.62, w: 5.16, h: 1.0, fontSize: 11.5, color: T.mute, lineSpacingMultiple: 1.08,
  });

  bar(sl, 7.44, 4.82, 0.05, 0.92, T.a1);
  text(sl, "Dos suposiciones en una sola línea", {
    x: 7.72, y: 4.86, w: 4.9, h: 0.3, fontSize: 12, bold: true, color: T.a1,
  });
  text(sl, "que los decimales se guardan exactos  ·  que redondear es «subir cuando hay 5»", {
    x: 7.72, y: 5.2, w: 4.9, h: 0.5, fontSize: 11.4, color: T.body, lineSpacingMultiple: 1.06,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 12 · LO QUE PASÓ */
{
  const sl = s("dark");
  statement(sl, "LO QUE ACABA DE PASAR",
    "Y aun así reprueba\na alguien que\ndebía aprobar.", {
      size: 38, bodyY: 3.34, bodyH: 2.2, kickerY: 2.14, kickerColor: T.a1, rule: T.a1,
    });
  text(sl, "Sin errores de sintaxis.   ·   Sin fallos de lógica evidentes.   ·   Bien escrita y documentada.", {
    x: M, y: 2.86, w: 8.9, h: 0.34, fontSize: 13.5, bold: true, color: T.a2,
  });
  validateSlide(sl, pptx);
}

/* ================================================== 13 · TRES PALABRAS */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Vocabulario", "«Bug» no es una palabra: son tres",
    "Y la distinción explica exactamente lo que acabamos de ver.", { chip: T.a2 });

  const items = [
    ["ERROR", "la equivocación humana", "Asumir que round() redondea como en el colegio y que los decimales se guardan exactos.", T.soft],
    ["DEFECTO", "lo que quedó en el código", "La línea return round(promedio, 1). Está ahí, escrita, esperando.", T.a3],
    ["FALLA", "lo que se ve al ejecutar", "El 3.9 que aparece en pantalla y reprueba a una persona real.", T.a1],
  ];
  items.forEach(([t, sub, d, c], i) => {
    const x = M + i * 4.0;
    bar(sl, x, 2.62, 3.46, 0.05, c);
    text(sl, t, {
      x, y: 2.84, w: 3.46, h: 0.48,
      fontFace: TYPOGRAPHY.display, fontSize: 26, bold: true, color: c,
    });
    text(sl, sub, { x, y: 3.36, w: 3.46, h: 0.3, fontSize: 11.5, bold: true, color: T.ink });
    text(sl, d, { x, y: 3.76, w: 3.5, h: 1.1, fontSize: 11.5, color: T.body, lineSpacingMultiple: 1.08 });
    if (i < 2) {
      text(sl, "→", {
        x: x + 3.56, y: 2.86, w: 0.3, h: 0.4, fontSize: 17, bold: true, color: T.edge, align: "center",
      });
    }
  });

  bar(sl, M, 5.4, 0.06, 1.0, T.a1);
  text(sl, "Un defecto solo se convierte en falla si el programa recibe la entrada que lo activa.", {
    x: M + 0.3, y: 5.46, w: 11.5, h: 0.34,
    fontFace: TYPOGRAPHY.display, fontSize: 16, bold: true, color: T.ink,
  });
  text(sl, "Con las notas [6.0, 5.5, 6.5] el defecto estaba igual de presente. Nadie lo vio.", {
    x: M + 0.3, y: 5.88, w: 11.5, h: 0.3, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 14 · LATENTE */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Consecuencia", "Que no haya fallado no significa que no tenga defectos",
    null, { chip: T.a2, titleW: 10.2, titleSize: 28 });

  [["Error", "alguien supone mal", T.soft], ["Defecto", "queda en el código", T.a3]].forEach(([t, g, c], i) => {
    const x = M + i * 2.86;
    bar(sl, x, 2.86, 0.05, 0.86, c);
    text(sl, t, {
      x: x + 0.26, y: 2.9, w: 2.2, h: 0.34,
      fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: T.ink,
    });
    text(sl, g, { x: x + 0.26, y: 3.3, w: 2.05, h: 0.3, fontSize: 11.4, color: T.soft });
    text(sl, "→", { x: x + 2.46, y: 3.02, w: 0.3, h: 0.4, fontSize: 17, color: T.edge, align: "center" });
  });

  sl.addShape(SH.diamond, {
    x: 6.3, y: 2.56, w: 2.6, h: 1.6,
    fill: { color: T.panel }, line: { color: T.a2, pt: 1.4 },
  });
  text(sl, "¿llega la entrada\nque lo activa?", {
    x: 6.42, y: 2.7, w: 2.36, h: 1.32, fontSize: 10, bold: true, color: T.ink,
    align: "center", valign: "middle", lineSpacingMultiple: 0.98,
  });

  text(sl, "sí", { x: 9.06, y: 2.62, w: 0.4, h: 0.28, fontSize: 10, bold: true, color: T.a1 });
  bar(sl, 9.56, 2.56, 0.05, 0.9, T.a1);
  text(sl, "FALLA visible", {
    x: 9.84, y: 2.6, w: 2.76, h: 0.34,
    fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: T.a1,
  });
  text(sl, "alguien la sufre", { x: 9.84, y: 3.0, w: 2.76, h: 0.3, fontSize: 11.4, color: T.soft });

  text(sl, "no", { x: 9.06, y: 3.82, w: 0.4, h: 0.28, fontSize: 10, bold: true, color: T.soft });
  bar(sl, 9.56, 3.76, 0.05, 0.9, T.edge);
  text(sl, "Queda latente", {
    x: 9.84, y: 3.8, w: 2.76, h: 0.34,
    fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: T.mute,
  });
  text(sl, "y nadie se entera", { x: 9.84, y: 4.2, w: 2.76, h: 0.3, fontSize: 11.4, color: T.soft });

  bar(sl, M, 5.4, 11.9, 0.014, T.edge);
  text(sl, "Probar no demuestra que un programa esté correcto.", {
    x: M, y: 5.7, w: 11.9, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: T.a2,
  });
  text(sl, "Demuestra que, para las entradas que probaste, no encontraste defectos. Es mucho menos, y es lo mejor que existe.", {
    x: M, y: 6.2, w: 11.9, h: 0.32, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 15 · CUATRO DEBILIDADES */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Diagnóstico", "Cuatro debilidades de probar a mano",
    "No es que esté prohibido: es que no alcanza como evidencia.", { chip: T.a1 });

  kicker(sl, "LO QUE ALCANZAS A PROBAR", M, 2.6, T.a3, 4);
  const cell = 0.27;
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      const hit = r === 1 && c === 2;
      sl.addShape(SH.rect, {
        x: M + c * (cell + 0.1), y: 2.98 + r * (cell + 0.1), w: cell, h: cell,
        fill: { color: hit ? T.a4 : T.panel },
        line: { color: hit ? T.a4 : T.edge },
      });
    }
  }
  text(sl, "Cada casilla es una entrada posible.\nProbar a mano toca una, y casi siempre la misma.", {
    x: M, y: 4.92, w: 3.4, h: 0.66, fontSize: 11.8, color: T.mute, lineSpacingMultiple: 1.08,
  });

  bar(sl, 4.56, 2.54, 0.014, 3.5, T.edge);

  const items = [
    ["SESGADA", "Nadie prueba un promedio que caiga justo en la frontera."],
    ["NO REPETIBLE", "Si mañana preguntan qué se probó, es un recuerdo."],
    ["NO ESCALA", "Una función se revisa a mano. Doscientas, no."],
    ["SE DEGRADA", "Alguien toca una línea y nadie repite todo desde cero."],
  ];
  let y = 2.62;
  items.forEach(([l, g], i) => {
    stepRow(sl, y, i, l, g, { x: 5.0, labelW: 2.0, glossW: 4.0, ruleW: 0.5 });
    if (i < items.length - 1) bar(sl, 5.0, y + 0.62, 7.6, 0.012, T.edge);
    y += 0.92;
  });

  text(sl, "Las pruebas que vamos a escribir invierten las cuatro.", {
    x: 5.0, y: 6.32, w: 7.6, h: 0.32, fontSize: 12.5, bold: true, color: T.a2,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 16 · EL AGENTE */
{
  const sl = s("light");
  head(sl, "Bloque 1 · 2026", "Nada de esto es nuevo. Lo que cambió es la escala",
    null, { chip: T.a2, titleW: 10.2, titleSize: 28 });

  kicker(sl, "LO QUE HACE BIEN UN AGENTE", M, 2.26, T.a4, 5);
  ["Sigue las convenciones del lenguaje", "Usa las funciones estándar correctas", "Escribe tipos y documentación", "Produce en minutos, no en horas"].forEach((t, i) => {
    const y = 2.64 + i * 0.42;
    bar(sl, M, y + 0.1, 0.13, 0.13, T.a4);
    text(sl, t, { x: M + 0.34, y, w: 5.0, h: 0.32, fontSize: 12, color: T.body });
  });

  bar(sl, 6.5, 2.2, 0.014, 2.3, T.edge);

  kicker(sl, "POR QUÉ ESO COMPLICA LA REVISIÓN", 7.0, 2.26, T.a1, 5.4);
  text(sl, "Justamente porque el resultado es plausible. El código que se ve mal se detecta solo; el que se ve impecable pasa.", {
    x: 7.0, y: 2.64, w: 5.6, h: 0.8, fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
  });
  text(sl, "La función de esta clase es exactamente lo que produce un agente. Y round() era la elección correcta.", {
    x: 7.0, y: 3.54, w: 5.6, h: 0.8, fontSize: 11.5, italic: true, color: T.mute, lineSpacingMultiple: 1.08,
  });

  bar(sl, M, 4.82, 11.9, 0.014, T.edge);
  text(sl, "Cuando escribir código deja de ser el cuello de botella,", {
    x: M, y: 5.14, w: 11.5, h: 0.4, fontSize: 16, color: T.mute,
  });
  text(sl, "el cuello de botella pasa a ser verificarlo.", {
    x: M, y: 5.56, w: 11.5, h: 0.52,
    fontFace: TYPOGRAPHY.display, fontSize: 28, bold: true, color: T.a2,
  });
  text(sl, "La habilidad escasa ya no es producir: es demostrar que lo producido sirve.", {
    x: M, y: 6.2, w: 11.5, h: 0.32, fontSize: 12, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 17 · IDEA CLAVE */
{
  const sl = s("dark");
  statement(sl, "IDEA CLAVE  ·  BLOQUE 1",
    "Un programa puede estar\nequivocado sin fallar nunca\ndelante de quien lo escribió.", {
      size: 33, bodyY: 2.98, bodyH: 2.3, kickerColor: T.a3,
      tail: "Que parezca correcto, que esté bien escrito y que haya funcionado en las pruebas informales no es evidencia de que sea correcto.",
      tailY: 5.64, tailW: 9.2,
    });
  validateSlide(sl, pptx);
}

/* ====================================================== 18 · PREGUNTAS */
{
  const sl = s("light");
  head(sl, "Bloque 1 · Preguntas", "Tres preguntas para llevarse", null, { chip: T.a2 });

  const qs = [
    ["Si un programa nunca ha fallado, ¿podemos concluir que no tiene defectos?",
      "Piensa en la diferencia entre lo observado y todo lo que podría ocurrir."],
    ["¿Cuál fue el error humano detrás del defecto de nota_final?",
      "Busca una suposición humana, no un error de sintaxis."],
    ["¿Qué entrada habría descubierto ese defecto antes de usarlo?",
      "Mira la frontera de aprobación y cómo se obtuvo el 3.95."],
  ];
  let y = 2.26;
  qs.forEach(([q, hint], i) => {
    questionRow(sl, y, i, q, hint);
    if (i < qs.length - 1) bar(sl, M, y + 1.04, 11.9, 0.012, T.edge);
    y += 1.18;
  });

  bar(sl, M, 6.14, 0.06, 0.86, T.a1);
  kicker(sl, "SIGUE  ·  BLOQUE 2", M + 0.3, 6.18, T.a3, 3.2);
  text(sl, "Si «funciona» ya no puede significar «me anduvo», necesitamos una definición de calidad que no dependa de la impresión de cada uno.", {
    x: M + 0.3, y: 6.5, w: 11.3, h: 0.34, fontSize: 11.5, color: T.body,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 19 · APERTURA B2 */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl);

  text(sl, "02", {
    x: M - 0.14, y: 1.68, w: 3.6, h: 2.4,
    fontFace: TYPOGRAPHY.display, fontSize: 140, bold: true, color: T.a2,
  });
  bar(sl, M, 4.42, 2.0, 0.06, T.a3);
  kicker(sl, "BLOQUE 2  ·  30 MINUTOS", M, 4.7, T.a3, 3.9);

  text(sl, "Calidad medible\ny el costo de\nno medirla", {
    x: 4.96, y: 1.84, w: 7.6, h: 2.8,
    fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: T.ink,
    lineSpacingMultiple: 1.0,
  });
  text(sl, "La calidad deja de ser una opinión cuando existe un estándar.", {
    x: 4.96, y: 4.86, w: 7.6, h: 0.4, fontSize: 14, bold: true, color: T.a2,
  });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ================================================ 20 · ¿BUENO RESPECTO DE QUÉ? */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Apertura", "Cuatro aplicaciones que «funcionan»",
    "Todas hacen lo que prometen. Ninguna es de buena calidad.", { chip: T.a2 });

  const rows = [
    ["01", "Calcula todo bien", "demora 15 segundos en abrir", T.a1, T.pale1],
    ["02", "Es rapidísima", "expone datos de clientes", T.a2, T.pale2],
    ["03", "Es rápida y segura", "una persona mayor no puede usarla", T.a3, T.pale3],
    ["04", "Es rápida, segura y usable", "nadie se atreve a modificarla", T.a4, T.pale4],
  ];
  rows.forEach(([n, si, no, c, wash], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * 6.06;
    const y = 2.42 + row * 1.56;
    sl.addShape(SH.rect, {
      x, y, w: 5.62, h: 1.28,
      fill: { color: wash }, line: { color: wash },
    });
    bar(sl, x, y, 0.08, 1.28, c);
    text(sl, n, {
      x: x + 0.28, y: y + 0.18, w: 0.68, h: 0.46,
      fontFace: TYPOGRAPHY.display, fontSize: 25, bold: true, color: c,
    });
    text(sl, si, {
      x: x + 1.06, y: y + 0.18, w: 4.18, h: 0.34,
      fontFace: TYPOGRAPHY.display, fontSize: 16, bold: true, color: T.ink,
    });
    text(sl, "PERO", {
      x: x + 1.06, y: y + 0.66, w: 0.64, h: 0.24,
      fontSize: 9.2, bold: true, color: c, charSpacing: 1.4,
    });
    text(sl, no, {
      x: x + 1.72, y: y + 0.62, w: 3.56, h: 0.42,
      fontSize: 12.3, bold: true, color: c,
    });
  });

  bar(sl, M, 5.72, 1.0, 0.05, T.a2);
  text(sl, "La pregunta útil no es «¿este software es bueno?»", {
    x: M, y: 5.98, w: 6.4, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.ink,
  });
  text(sl, "sino «¿bueno respecto de qué?»", {
    x: 7.2, y: 5.92, w: 5.4, h: 0.5,
    fontFace: TYPOGRAPHY.display, fontSize: 23, bold: true, color: T.a2, align: "right",
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 21 · ISO 25010 */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Estándar", "ISO/IEC 25010: nueve características",
    "La norma no dice si un software es bueno: descompone la calidad en dimensiones medibles.", { chip: T.a3 });

  const chars = [
    ["Adecuación funcional", "¿hace lo que debe, correcto y completo?"],
    ["Eficiencia de desempeño", "¿responde a tiempo y usa bien los recursos?"],
    ["Compatibilidad", "¿convive e intercambia con otros sistemas?"],
    ["Capacidad de interacción", "¿las personas pueden usarlo sin frustrarse?"],
    ["Fiabilidad", "¿se mantiene disponible y se recupera?"],
    ["Seguridad", "¿protege la información y controla accesos?"],
    ["Mantenibilidad", "¿se puede modificar sin romperlo?"],
    ["Flexibilidad", "¿se adapta a nuevos entornos y necesidades?"],
    ["Inocuidad", "¿evita provocar daño a personas o al entorno?"],
  ];
  sl.addShape(SH.rect, {
    x: M, y: 2.48, w: 2.35, h: 3.82,
    fill: { color: T.ink }, line: { color: T.ink },
  });
  text(sl, "09", {
    x: M + 0.2, y: 2.72, w: 1.95, h: 1.45,
    fontFace: TYPOGRAPHY.display, fontSize: 82, bold: true, color: "FFFFFF", align: "center",
  });
  text(sl, "DIMENSIONES\nNO UN PUNTAJE", {
    x: M + 0.3, y: 4.46, w: 1.75, h: 0.78,
    fontSize: 11, bold: true, color: T.a3, align: "center", charSpacing: 1.1,
  });
  bar(sl, M + 0.66, 5.58, 1.02, 0.05, T.a1);

  chars.forEach(([t, q], i) => {
    const col = i < 5 ? 0 : 1;
    const row = col === 0 ? i : i - 5;
    const x = 3.55 + col * 4.72;
    const y = 2.46 + row * 0.78;
    const c = acc(i);
    text(sl, String(i + 1).padStart(2, "0"), {
      x, y: y - 0.01, w: 0.56, h: 0.3,
      fontFace: TYPOGRAPHY.display, fontSize: 14, bold: true, color: c,
    });
    bar(sl, x + 0.6, y + 0.14, 0.34, 0.025, c);
    text(sl, t, {
      x: x + 1.08, y, w: 3.45, h: 0.3,
      fontSize: 12.8, bold: true, color: T.ink,
    });
    text(sl, q, {
      x: x + 1.08, y: y + 0.3, w: 3.45, h: 0.34,
      fontSize: 10.8, color: T.mute,
    });
  });

  validateSlide(sl, pptx);
}

/* ================================================ 22 · VERSIONES DEL ESTÁNDAR */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Advertencia", "Los estándares también tienen versiones",
    "Buscando por su cuenta van a encontrar listas de ocho. No están mal: están desactualizadas.", { chip: T.a3 });

  bar(sl, 6.58, 2.66, 0.014, 2.9, T.edge);

  kicker(sl, "EDICIÓN ANTERIOR  ·  OCHO", M, 2.7, T.soft, 4.4);
  ["Usabilidad", "Portabilidad", "— sin inocuidad —"].forEach((t, i) => {
    const y = 3.12 + i * 0.5;
    bar(sl, M, y + 0.1, 0.13, 0.13, T.soft);
    text(sl, t, { x: M + 0.34, y, w: 5.0, h: 0.32, fontSize: 13, color: T.soft });
  });
  text(sl, "Es la que más circula en apuntes y blogs.", {
    x: M, y: 4.78, w: 5.4, h: 0.3, fontSize: 11.8, italic: true, color: T.mute,
  });

  kicker(sl, "EDICIÓN VIGENTE  ·  NUEVE", 7.12, 2.7, T.a2, 4.4);
  ["Capacidad de interacción", "Flexibilidad", "Inocuidad", "(las otras seis se mantienen)"].forEach((t, i) => {
    const y = 3.12 + i * 0.5;
    bar(sl, 7.12, y + 0.1, 0.13, 0.13, i < 3 ? T.a2 : T.edge);
    text(sl, t, {
      x: 7.46, y, w: 5.0, h: 0.32, fontSize: 13,
      color: i < 3 ? T.ink : T.soft, italic: i === 3,
    });
  });

  bar(sl, M, 5.78, 0.06, 0.9, T.a3);
  text(sl, "Citar «la ISO 25010» sin decir qué edición es una imprecisión.", {
    x: M + 0.3, y: 5.84, w: 11.5, h: 0.34, fontSize: 13, bold: true, color: T.a3,
  });
  text(sl, "Saber distinguirlo es parte de trabajar con estándares, y es la clase de detalle que se nota en una auditoría.", {
    x: M + 0.3, y: 6.22, w: 11.5, h: 0.3, fontSize: 11.5, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 23 · EL PERFIL */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Modelo", "La calidad no es un número: es un perfil",
    "Un producto es alto en unas características y bajo en otras. Elegir cuáles es trabajo profesional.", { chip: T.a3 });

  const dims = ["Desempeño", "Fiabilidad", "Inocuidad", "Capacidad de interacción"];
  const games = [0.95, 0.5, 0.1, 0.9];
  const pacer = [0.35, 1.0, 1.0, 0.15];

  kicker(sl, "VIDEOJUEGO", 3.6, 2.6, T.a2, 2.6);
  kicker(sl, "MARCAPASOS", 8.6, 2.6, T.a1, 2.6);

  const maxW = 3.3;
  dims.forEach((dim, i) => {
    const y = 3.1 + i * 0.72;
    text(sl, dim, { x: M, y: y + 0.02, w: 2.7, h: 0.3, fontSize: 12, color: T.body });
    bar(sl, 3.6, y + 0.06, maxW, 0.2, T.panel);
    bar(sl, 3.6, y + 0.06, maxW * games[i], 0.2, T.a2);
    bar(sl, 8.6, y + 0.06, maxW, 0.2, T.panel);
    bar(sl, 8.6, y + 0.06, maxW * pacer[i], 0.2, T.a1);
  });

  bar(sl, M, 6.16, 11.9, 0.014, T.edge);
  text(sl, "Subir seguridad suele costar desempeño. Subir flexibilidad suele costar simplicidad.", {
    x: M, y: 6.4, w: 11.9, h: 0.32, fontSize: 12.5, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 24 · CUANDO NADIE MIDE */
{
  const sl = s("dark");
  statement(sl, "TRES CASOS DOCUMENTADOS",
    "Cuando nadie mide,\nel defecto se descubre\nen el peor momento.", {
      size: 34, bodyY: 2.94, bodyH: 2.3, kickerColor: T.a1, rule: T.a1,
      tail: "Ninguno de los tres es una anécdota: están investigados, y cada uno enseña algo distinto.",
      tailY: 5.6,
    });
  validateSlide(sl, pptx);
}

/* ====================================================== 25 · THERAC-25 */
{
  const sl = s("dark");
  head(sl, "Bloque 2 · Caso 01", "Therac-25",
    "Máquina de radioterapia · 1985 a 1987 · al menos seis accidentes graves", { chip: T.a1 });

  // La imagen es la interfaz REAL donde se activaba el defecto.
  photo(sl, IMG.therac, M, 2.6, 5.06, 3.04,
    "Interfaz de operador del Therac-25 · Wikimedia Commons");

  text(sl, "Si el operador corregía muy rápido un dato en esta pantalla, una condición de carrera hacía que el equipo aplicara una dosis cientos de veces superior a la indicada.", {
    x: 6.3, y: 2.6, w: 6.3, h: 0.9, fontSize: 13, color: T.body, lineSpacingMultiple: 1.1,
  });

  // La composición muestra la lección: el MISMO defecto, contenido y sin contener.
  kicker(sl, "EL MISMO DEFECTO, DOS MÁQUINAS", 6.3, 3.76, T.a3, 6);

  const estados = [
    ["Modelos anteriores", "traba mecánica", "el defecto existe, pero no puede manifestarse", T.a4],
    ["Therac-25", "solo software", "nada lo detiene: el defecto se vuelve falla mortal", T.a1],
  ];
  estados.forEach(function (e, i) {
    const x = 6.3 + i * 3.26;
    bar(sl, x, 4.14, 2.96, 0.05, e[3]);
    text(sl, e[0], { x, y: 4.32, w: 2.96, h: 0.32, fontSize: 13, bold: true, color: T.ink });
    text(sl, e[1], { x, y: 4.66, w: 2.96, h: 0.3, fontSize: 11.4, bold: true, color: e[3] });
    text(sl, e[2], { x, y: 5.0, w: 2.96, h: 0.72, fontSize: 11.4, color: T.mute, lineSpacingMultiple: 1.06 });
  });

  bar(sl, 6.3, 5.9, 0.05, 0.6, T.a2);
  text(sl, "Quitar la protección no creó el defecto: solo lo dejó salir.", {
    x: 6.58, y: 5.96, w: 6.04, h: 0.46, fontSize: 12.5, bold: true, color: T.a2,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 26 · ARIANE 5 */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Caso 02", "Ariane 5, vuelo 501",
    "Cohete destruido 39 segundos después del despegue · 1996", { chip: T.a1 });

  photo(sl, IMG.ariane, 9.06, 2.6, 3.56, 3.06,
    "Ariane 5, fotografía posterior — no del vuelo 501 · NASA / B. Ingalls");

  // La composición es la línea de tiempo: 39 segundos.
  // Los hitos se escalonan arriba/abajo porque 36 y 39 caen casi juntos:
  // esa proximidad es justamente el dato (36 de los 39 segundos fueron normales).
  const t0 = M;
  const tw = 6.6;
  bar(sl, t0, 3.2, tw, 0.028, T.edge);
  const hitos = [
    ["0 s  ·  despegue", 0, T.a4, "arriba", "left"],
    ["36 s  ·  desborde numérico", 0.92, T.a3, "arriba", "right"],
    ["39 s  ·  destrucción", 1.0, T.a1, "abajo", "right"],
  ];
  hitos.forEach(function (h) {
    const x = t0 + tw * h[1];
    const arriba = h[3] === "arriba";
    const der = h[4] === "right";
    sl.addShape(SH.ellipse, {
      x: x - 0.08, y: 3.13, w: 0.18, h: 0.18, fill: { color: h[2] }, line: { color: h[2] },
    });
    text(sl, h[0], {
      x: der ? x - 2.5 : x - 0.1, y: arriba ? 2.72 : 3.46, w: 2.6, h: 0.34,
      fontFace: TYPOGRAPHY.display, fontSize: 15, bold: true, color: h[2],
      align: der ? "right" : "left",
    });
  });

  text(sl, "La conversión de un número decimal de 64 bits a un entero de 16 bits se desbordó, porque el Ariane 5 volaba con una velocidad horizontal mayor que su antecesor.", {
    x: M, y: 4.12, w: 7.7, h: 0.84, fontSize: 13, color: T.body, lineSpacingMultiple: 1.1,
  });

  bar(sl, M, 5.14, 0.05, 1.32, T.a3);
  kicker(sl, "LO NOTABLE", M + 0.3, 5.18, T.a3, 4);
  text(sl, "Ese código era correcto.", {
    x: M + 0.3, y: 5.48, w: 7.3, h: 0.36,
    fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: T.ink,
  });
  text(sl, "Funcionaba perfecto en el Ariane 4, de donde se reutilizó sin volver a probarlo en el contexto nuevo. El cálculo que provocó el desborde ni siquiera era necesario después del despegue.", {
    x: M + 0.3, y: 5.9, w: 7.3, h: 0.6, fontSize: 11.4, color: T.mute, lineSpacingMultiple: 1.08,
  });

  validateSlide(sl, pptx);
}

/* ================================================== 27 · KNIGHT CAPITAL */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Caso 03", "Knight Capital",
    "45 minutos, unos 440 millones de dólares · 1 de agosto de 2012", { chip: T.a1 });

  photo(sl, IMG.nyse, 9.06, 2.6, 3.56, 3.06,
    "Piso de la Bolsa de Nueva York, imagen de contexto · C. M. Highsmith / LOC");

  text(sl, "Desplegaron código nuevo en sus servidores. La actualización llegó a siete de ocho.", {
    x: M, y: 2.6, w: 7.7, h: 0.36, fontSize: 13.5, bold: true, color: T.ink,
  });

  // La composición ES el fallo: ocho servidores, uno sin actualizar.
  const sy = 3.14;
  for (let i = 0; i < 8; i += 1) {
    const viejo = i === 7;
    const x = M + i * 0.94;
    sl.addShape(SH.roundRect, {
      x, y: sy, w: 0.76, h: 0.84, rectRadius: 0.04,
      fill: { color: viejo ? T.a1 : T.panel },
      line: { color: viejo ? T.a1 : T.edge, pt: 1.2 },
    });
    text(sl, viejo ? "!" : "OK", {
      x, y: sy + 0.26, w: 0.76, h: 0.36,
      fontFace: TYPOGRAPHY.display, fontSize: viejo ? 19 : 12, bold: true,
      color: viejo ? "FFFFFF" : T.a4, align: "center",
    });
  }
  text(sl, "siete con el código nuevo", {
    x: M, y: sy + 0.98, w: 4.6, h: 0.3, fontSize: 11.4, color: T.mute,
  });
  text(sl, "uno quedó atrás", {
    x: M + 5.5, y: sy + 0.98, w: 2.2, h: 0.3, fontSize: 11.4, bold: true, color: T.a1, align: "right",
  });

  text(sl, "En ese servidor quedó activo código antiguo que llevaba años sin usarse, y que un indicador reutilizado volvió a despertar.", {
    x: M, y: 4.64, w: 7.7, h: 0.62, fontSize: 13, color: T.body, lineSpacingMultiple: 1.1,
  });

  bar(sl, M, 5.5, 0.05, 1.0, T.a2);
  text(sl, "No hubo un cálculo mal hecho: hubo un proceso sin verificación automática.", {
    x: M + 0.3, y: 5.54, w: 7.4, h: 0.34, fontSize: 13, bold: true, color: T.ink,
  });
  text(sl, "Nadie comprobó que el despliegue quedara igual en todas las máquinas. Esa prueba tiene nombre: regresión, semana 7.", {
    x: M + 0.3, y: 5.92, w: 7.4, h: 0.5, fontSize: 11.4, color: T.mute, lineSpacingMultiple: 1.06,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 28 · APOLLO 11 (CONTRAPUNTO) */
{
  const sl = s("dark");
  head(sl, "Bloque 2 · Contrapunto", "Apollo 11: el sistema que falló bien",
    "20 de julio de 1969 · descenso a la Luna · el computador se sobrecargó y el alunizaje continuó", { chip: T.a4, chipW: 3.0 });

  photo(sl, IMG.apollo, M, 2.6, 3.1, 3.06,
    "Margaret Hamilton junto a los listados del software de vuelo · NASA / MIT");

  text(sl, "A metros de la superficie, el computador de guiado empezó a lanzar alarmas de sobrecarga. Un radar dejado en la posición equivocada le estaba robando ciclos de procesador.", {
    x: 4.36, y: 2.6, w: 4.0, h: 1.1, fontSize: 12.5, color: T.body, lineSpacingMultiple: 1.1,
  });

  // El artefacto real: lo que veian en pantalla.
  const ax = 8.62;
  frame(sl, ax, 2.6, 4.0, 1.16);
  panelBox(sl, ax, 2.6, 4.0, 1.16);
  text(sl, "PROGRAM ALARM", {
    x: ax + 0.28, y: 2.78, w: 3.4, h: 0.28, fontSize: 10, bold: true,
    color: T.a3, charSpacing: 1.6, fontFace: TYPOGRAPHY.mono,
  });
  text(sl, "1202", {
    x: ax + 0.28, y: 3.06, w: 1.5, h: 0.6,
    fontFace: TYPOGRAPHY.mono, fontSize: 34, bold: true, color: T.a3,
  });
  text(sl, "executive overflow", {
    x: ax + 1.9, y: 3.24, w: 1.9, h: 0.3, fontSize: 10.5, color: T.mute, align: "right",
  });

  // La composicion muestra el MECANISMO: descartar lo secundario, sostener lo critico.
  kicker(sl, "LO QUE HIZO EL SOFTWARE", 4.36, 4.02, T.a4, 5);

  const capas = [
    ["Tareas de baja prioridad", "descartadas", T.mute, true],
    ["Reinicio del ejecutivo", "en milisegundos", T.a3, false],
    ["Guiado y navegación", "nunca se detuvo", T.a4, false],
  ];
  capas.forEach(function (c, i) {
    const y = 4.36 + i * 0.62;
    bar(sl, 4.36, y + 0.06, 0.05, 0.4, c[2]);
    text(sl, c[0], {
      x: 4.64, y, w: 3.1, h: 0.32, fontSize: 12, bold: !c[3],
      color: c[3] ? T.mute : T.ink,
    });
    text(sl, c[1], { x: 7.8, y: y + 0.02, w: 2.2, h: 0.3, fontSize: 11.4, color: c[2] });
  });

  bar(sl, 4.36, 6.24, 0.05, 0.62, T.a2);
  text(sl, "No fue suerte: habían simulado esa sobrecarga y sabían que era sobrevivible.", {
    x: 4.64, y: 6.28, w: 7.98, h: 0.5, fontSize: 12.5, bold: true, color: T.a2,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 29 · QUÉ ENSEÑA CADA UNO */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Síntesis", "Cuatro casos, cuatro lecciones", null, { chip: T.a2 });

  const items = [
    ["THERAC-25", "El defecto latente", "Estaba ahí antes; lo tapaba una traba mecánica. Quitar la protección lo dejó salir.", T.a1],
    ["ARIANE 5", "El contexto cambió", "Código correcto en un cohete, catastrófico en otro. Reutilizar exige volver a verificar.", T.a1],
    ["KNIGHT CAPITAL", "El proceso sin red", "Nada verificaba el despliegue ni detectaba el regreso de comportamiento viejo.", T.a1],
    ["APOLLO 11", "La falla prevista", "Sobrecarga anticipada, priorizada y ensayada. El sistema falló, y la misión siguió.", T.a4],
  ];
  items.forEach(function (it, i) {
    const x = M + i * 3.0;
    bar(sl, x, 2.6, 2.6, 0.05, it[3]);
    text(sl, it[0], {
      x, y: 2.8, w: 2.7, h: 0.38,
      fontFace: TYPOGRAPHY.display, fontSize: 16, bold: true, color: it[3],
    });
    text(sl, it[1], { x, y: 3.22, w: 2.7, h: 0.3, fontSize: 12, bold: true, color: T.ink });
    text(sl, it[2], { x, y: 3.6, w: 2.74, h: 1.2, fontSize: 11.4, color: T.body, lineSpacingMultiple: 1.08 });
  });

  bar(sl, M, 5.16, 11.9, 0.014, T.edge);
  text(sl, "Los tres primeros comparten algo: el defecto se descubrió en el peor momento posible.", {
    x: M, y: 5.44, w: 11.9, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.ink,
  });
  text(sl, "El cuarto también tuvo un defecto. La diferencia es que alguien ya había pensado qué pasaría si ocurría.", {
    x: M, y: 5.94, w: 11.9, h: 0.32, fontSize: 12.5, color: T.a4, bold: true,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 29 · EL COSTO */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Costo", "El mismo defecto cuesta distinto según cuándo aparece",
    null, { chip: T.a3, titleW: 10.2, titleSize: 28 });

  const steps = [
    ["Mientras se escribe", "Cambiar una línea. Minutos.", 0.9],
    ["En las pruebas automatizadas", "Volver sobre algo de hoy, con el contexto fresco.", 1.7],
    ["En revisión o integración", "Coordinar con otras personas, rehacer partes aceptadas.", 2.6],
    ["Después de publicar", "Diagnosticar en caliente, redesplegar, reparar datos, responder a usuarios.", 3.6],
  ];
  const baseY = 5.86;
  const colW = 2.86;
  steps.forEach(([t, d, h], i) => {
    const x = M + i * colW;
    const c = acc(i);
    bar(sl, x, baseY - h, 0.46, h, c);
    text(sl, t, {
      x: x + 0.62, y: baseY - h, w: colW - 0.78, h: 0.5,
      fontSize: 12.5, bold: true, color: T.ink, lineSpacingMultiple: 1.02,
    });
    text(sl, d, {
      x: x + 0.62, y: baseY - h + 0.54, w: colW - 0.78, h: 0.54,
      fontSize: 11.4, color: T.mute, lineSpacingMultiple: 1.06,
    });
  });
  bar(sl, M, baseY, 11.9, 0.02, T.edge);

  text(sl, "El salto más grande ocurre al cruzar hacia producción, donde aparecen costos que ya no son técnicos.", {
    x: M, y: 6.42, w: 11.9, h: 0.32, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 30 · CUIDADO CON LAS CIFRAS */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Rigor", "Cuidado con los multiplicadores exactos",
    "Van a leer que corregir en producción cuesta «cien veces más». Conviene mirar de dónde sale ese número.", { chip: T.a4 });

  bar(sl, M, 2.86, 0.05, 1.5, T.a1);
  kicker(sl, "LO QUE NO SE SOSTIENE", M + 0.3, 2.9, T.a1, 5);
  text(sl, "Las cifras concretas provienen de estudios antiguos y su metodología ha sido cuestionada. Repetirlas como dato duro es citar mal.", {
    x: M + 0.3, y: 3.22, w: 5.2, h: 1.0, fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
  });

  bar(sl, 7.0, 2.86, 0.05, 1.5, T.a4);
  kicker(sl, "LO QUE SÍ SE SOSTIENE", 7.3, 2.9, T.a4, 5);
  text(sl, "La dirección: mientras más tarde se detecta un defecto, más caro sale. Eso basta para decidir cuándo probar.", {
    x: 7.3, y: 3.22, w: 5.3, h: 1.0, fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
  });

  bar(sl, M, 4.68, 11.9, 0.014, T.edge);
  text(sl, "En un módulo de calidad, mirar la evidencia detrás de una cifra vale tanto como la cifra.", {
    x: M, y: 4.96, w: 11.9, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.a3,
  });
  text(sl, "Si aceptan un número sin preguntar de dónde viene, están haciendo exactamente lo que este módulo enseña a no hacer.", {
    x: M, y: 5.46, w: 11.9, h: 0.32, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 31 · PROBAR TEMPRANO */
{
  const sl = s("dark");
  statement(sl, "EL PRINCIPIO QUE ORDENA TODO EL MÓDULO",
    "No probamos para\nencontrar defectos.\nProbamos para\nencontrarlos temprano.", {
      size: 32, bodyY: 2.9, bodyH: 2.6, kickerColor: T.a2, rule: T.a2,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 32 · QUÉ VE EL TESTING */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Alcance", "No toda la calidad se observa igual",
    "Cada característica exige su propio tipo de evidencia. Por eso el módulo no enseña un solo tipo de prueba.", { chip: T.a2 });

  const groups = [
    ["SE OBSERVAN CON PRUEBAS", "Adecuación funcional · Fiabilidad · Eficiencia de desempeño · Seguridad", "Se ejecuta el sistema y se mide el resultado.", T.a4],
    ["SE EVALÚAN LEYENDO", "Mantenibilidad · Flexibilidad", "Revisión de código, métricas y juicio experto. Sin ejecutar nada.", T.a3],
    ["EXIGEN OBSERVAR PERSONAS", "Capacidad de interacción", "Alguien real usando el producto. Ninguna prueba automática lo reemplaza.", T.a2],
  ];
  let y = 2.66;
  groups.forEach(([t, list, d, c]) => {
    bar(sl, M, y, 0.05, 1.06, c);
    text(sl, t, { x: M + 0.3, y, w: 4.3, h: 0.3, fontSize: 11.5, bold: true, color: c, charSpacing: 1.2 });
    text(sl, list, { x: M + 0.3, y: y + 0.34, w: 4.3, h: 0.62, fontSize: 11.8, color: T.ink, lineSpacingMultiple: 1.06 });
    text(sl, d, { x: 5.6, y: y + 0.2, w: 7.0, h: 0.5, fontSize: 12, color: T.mute, lineSpacingMultiple: 1.06 });
    y += 1.26;
  });

  bar(sl, M, 6.34, 11.9, 0.014, T.edge);

  validateSlide(sl, pptx);
}

/* ================================================ 33 · IDEA CLAVE B2 */
{
  const sl = s("dark");
  statement(sl, "IDEA CLAVE  ·  BLOQUE 2",
    "La calidad no es una opinión\nni un número único: es un\nconjunto de características\nque se negocian entre sí.", {
      size: 29, bodyY: 2.92, bodyH: 2.6, kickerColor: T.a3,
      tail: "Y el costo de ignorarlas crece a medida que el defecto avanza hacia producción.",
      tailY: 5.72,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 34 · PREGUNTAS B2 */
{
  const sl = s("light");
  head(sl, "Bloque 2 · Preguntas", "Tres preguntas para llevarse", null, { chip: T.a2 });

  const qs = [
    ["En Therac-25, ¿en qué momento apareció el defecto y en qué momento la falla?",
      "Separa lo que existía en el código de lo que sufrió el paciente."],
    ["¿Por qué el código del Ariane 5 puede ser correcto y provocar igual una catástrofe?",
      "Pregunta qué condición cambió entre Ariane 4 y Ariane 5."],
    ["¿Qué parte del «cien veces más caro» es sólida, y cuál conviene no repetir?",
      "Distingue la tendencia confiable del número exacto que la exagera."],
  ];
  let y = 2.26;
  qs.forEach(([q, hint], i) => {
    questionRow(sl, y, i, q, hint);
    if (i < qs.length - 1) bar(sl, M, y + 1.04, 11.9, 0.012, T.edge);
    y += 1.18;
  });

  bar(sl, M, 6.14, 0.06, 0.86, T.a1);
  kicker(sl, "SIGUE  ·  BLOQUE 3", M + 0.3, 6.18, T.a3, 3.2);
  text(sl, "Ya sabemos qué medir y por qué importa hacerlo temprano. Ahora: cómo se traduce eso en este módulo concreto.", {
    x: M + 0.3, y: 6.5, w: 11.3, h: 0.34, fontSize: 11.5, color: T.body,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 36 · APERTURA B3 */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl);

  text(sl, "03", {
    x: M - 0.14, y: 1.68, w: 3.6, h: 2.4,
    fontFace: TYPOGRAPHY.display, fontSize: 140, bold: true, color: T.a3,
  });
  bar(sl, M, 4.42, 2.0, 0.06, T.a2);
  kicker(sl, "BLOQUE 3  ·  30 MINUTOS", M, 4.7, T.a3, 3.9);

  text(sl, "El mapa\ndel módulo", {
    x: 4.96, y: 2.16, w: 7.6, h: 2.0,
    fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color: T.ink,
    lineSpacingMultiple: 1.0,
  });
  text(sl, "Qué vas a construir, con qué herramientas, cómo se evalúa\ny bajo qué reglas usamos agentes de IA.", {
    x: 4.96, y: 4.32, w: 7.6, h: 0.7, fontSize: 14, color: T.lead, lineSpacingMultiple: 1.08,
  });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ============================================ 37 · LO QUE VAS A TENER */
{
  const sl = s("dark");
  head(sl, "Bloque 3 · El final primero", "Lo que vas a tener el 30 de septiembre",
    "Empecemos por el resultado, para que las ocho semanas tengan sentido desde hoy.", { chip: T.a3 });

  // Los artefactos se apilan: cada capa se apoya en la anterior.
  const capas = [
    ["Pipeline de integración continua", "ejecuta todo solo, ante cada cambio", T.a2],
    ["Pruebas no funcionales", "desempeño y seguridad medidos", T.a4],
    ["Plan de pruebas", "qué se prueba, por qué y con qué criterio", T.a3],
    ["Suite automatizada", "unitarias, integración y extremo a extremo", T.a1],
    ["Tipado estricto y análisis estático", "sin advertencias", T.a2],
  ];
  capas.forEach(function (c, i) {
    const y = 2.62 + i * 0.72;
    const w = 8.6 + i * 0.62;
    bar(sl, M, y, w, 0.5, T.panel);
    bar(sl, M, y, 0.06, 0.5, c[2]);
    text(sl, c[0], { x: M + 0.34, y: y + 0.06, w: 4.3, h: 0.32, fontSize: 12.5, bold: true, color: T.ink });
    text(sl, c[1], { x: M + 4.9, y: y + 0.08, w: 3.4, h: 0.3, fontSize: 11.4, color: T.mute });
  });

  bar(sl, M, 6.34, 0.06, 0.5, T.a3);
  text(sl, "Un repositorio propio donde no afirmas que funciona: lo demuestras.", {
    x: M + 0.34, y: 6.4, w: 11.6, h: 0.34, fontSize: 13, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ================================================= 38 · POR QUÉ IMPORTA */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Sentido", "Eso no es material de curso: es portafolio", null, { chip: T.a3 });

  bar(sl, 6.58, 2.58, 0.014, 2.9, T.edge);

  kicker(sl, "LO QUE MUESTRA CASI TODO EL MUNDO", M, 2.62, T.mute, 5.4);
  text(sl, "Una aplicación que se ve bien", {
    x: M, y: 2.98, w: 5.4, h: 0.44,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.mute,
  });
  text(sl, "Pantallas, colores, funcionalidades. Impresiona al mirarla, pero no dice nada sobre si aguanta un cambio.", {
    x: M, y: 3.56, w: 5.4, h: 0.7, fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
  });

  kicker(sl, "LO QUE CASI NADIE PUEDE MOSTRAR", 7.12, 2.62, T.a2, 5.4);
  text(sl, "Evidencia de que funciona", {
    x: 7.12, y: 2.98, w: 5.4, h: 0.44,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.ink,
  });
  text(sl, "Un pipeline en verde, una suite que atrapa regresiones, un plan trazable. Se revisa en dos minutos y se nota de inmediato.", {
    x: 7.12, y: 3.56, w: 5.4, h: 0.7, fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
  });

  bar(sl, M, 5.72, 0.05, 0.98, T.a2);
  text(sl, "Es la diferencia entre alguien que programa y alguien con quien se puede trabajar en equipo.", {
    x: M + 0.3, y: 5.78, w: 11.6, h: 0.36,
    fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.ink,
  });
  text(sl, "Y es visible de inmediato para cualquiera que revise técnicamente su trabajo.", {
    x: M + 0.3, y: 6.24, w: 11.6, h: 0.3, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================== 39 · DOS UNIDADES */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Estructura", "Dos unidades, dos preguntas distintas", null, { chip: T.a2 });

  const us = [
    ["UNIDAD 01", "¿Qué significa\nque funcione?", "Construye el criterio: qué es la calidad, cómo se verifica sin ejecutar el código y contra qué estándares se compara.", "32 horas  ·  semanas 1 a 4", T.a2],
    ["UNIDAD 02", "Demuéstralo.", "Construye la evidencia: cómo se diseñan los casos, cómo se escriben las pruebas, cómo se automatiza su ejecución.", "40 horas  ·  semanas 4 a 8", T.a1],
  ];
  us.forEach(function (u, i) {
    const x = M + i * 6.28;
    bar(sl, x, 2.6, 5.62, 0.06, u[4]);
    kicker(sl, u[0], x, 2.82, u[4], 3);
    text(sl, u[1], {
      x, y: 3.16, w: 5.4, h: 1.0,
      fontFace: TYPOGRAPHY.display, fontSize: 27, bold: true, color: T.ink,
      lineSpacingMultiple: 0.98,
    });
    text(sl, u[2], { x, y: 4.34, w: 5.5, h: 0.9, fontSize: 12.5, color: T.body, lineSpacingMultiple: 1.1 });
    text(sl, u[3], { x, y: 5.36, w: 5.4, h: 0.3, fontSize: 11.4, bold: true, color: u[4] });
  });

  bar(sl, M, 6.06, 11.9, 0.014, T.edge);
  text(sl, "Primero aprendemos a mirar un sistema y juzgarlo. Después, a construir la evidencia de que funciona.", {
    x: M, y: 6.32, w: 11.9, h: 0.32, fontSize: 12.5, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ================================================== 40 · OCHO SEMANAS */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Calendario", "Ocho semanas, del criterio al pipeline",
    "Del 10 de agosto al 30 de septiembre.", { chip: T.a2 });

  const sem = [
    ["1", "10-12 ago", "Qué significa que funcione", "u1"],
    ["2", "17-19 ago", "Verificación y validación", "u1"],
    ["3", "24-26 ago", "Pruebas estáticas y estándares", "u1"],
    ["4", "31-2 sep", "Auditoría · diseño de casos", "mix"],
    ["5", "7-9 sep", "Cobertura y TDD", "u2"],
    ["6", "14-16 sep", "Integración y extremo a extremo", "u2"],
    ["7", "21-23 sep", "CI y no funcionales", "u2"],
    ["8", "28-30 sep", "Cierre del proyecto", "u2"],
  ];
  const cw = 2.82;
  sem.forEach(function (w, i) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = M + col * 3.0;
    const y = 2.42 + row * 1.72;
    const c = w[3] === "u1" ? T.a2 : w[3] === "u2" ? T.a1 : T.a3;
    const wash = w[3] === "u1" ? T.pale2 : w[3] === "u2" ? T.pale1 : T.pale3;
    sl.addShape(SH.rect, {
      x, y, w: cw, h: 1.34,
      fill: { color: wash }, line: { color: wash },
    });
    bar(sl, x, y, 0.07, 1.34, c);
    text(sl, w[0], {
      x: x + 0.24, y: y + 0.16, w: 0.62, h: 0.5,
      fontFace: TYPOGRAPHY.display, fontSize: 30, bold: true, color: c,
    });
    text(sl, w[1], {
      x: x + 0.98, y: y + 0.16, w: 1.58, h: 0.26,
      fontSize: 9.8, bold: true, color: c, align: "right",
    });
    text(sl, w[2], {
      x: x + 0.98, y: y + 0.54, w: 1.58, h: 0.62,
      fontSize: 11.2, bold: true, color: T.ink, align: "right", lineSpacingMultiple: 1.02,
    });
  });

  const ev = [["E1", "1 SEP", 3], ["E2", "21 SEP", 6], ["FINAL", "30 SEP", 7]];
  ev.forEach(function (e) {
    const col = e[2] % 4;
    const row = Math.floor(e[2] / 4);
    const x = M + col * 3.0 + 1.62;
    const y = 2.42 + row * 1.72 + 1.08;
    sl.addShape(SH.roundRect, {
      x, y, w: 1.0, h: 0.34, rectRadius: 0.04,
      fill: { color: T.a4 }, line: { color: T.a4 },
    });
    text(sl, `${e[0]} · ${e[1]}`, {
      x, y: y + 0.07, w: 1.0, h: 0.18, fontSize: 8.5, bold: true,
      color: "FFFFFF", align: "center", charSpacing: 0.4,
    });
  });

  text(sl, "CRITERIO", {
    x: M, y: 5.98, w: 2.2, h: 0.32,
    fontSize: 10, bold: true, color: T.a2, charSpacing: 1.8,
  });
  bar(sl, 3.0, 6.13, 7.0, 0.04, T.edge);
  text(sl, "EVIDENCIA", {
    x: 10.48, y: 5.98, w: 2.12, h: 0.32,
    fontSize: 10, bold: true, color: T.a1, charSpacing: 1.8, align: "right",
  });

  validateSlide(sl, pptx);
}

/* ================================================== 41 · POR QUÉ ESE ORDEN */
{
  const sl = s("dark");
  statement(sl, "POR QUÉ ESE ORDEN Y NO OTRO",
    "Se puede escribir\nmuchas pruebas sin\nsaber si prueban\nalgo que importa.", {
      size: 32, bodyY: 2.86, bodyH: 2.6, kickerColor: T.a3, rule: T.a3,
      tail: "Por eso el criterio va primero: mirar un sistema y juzgarlo, antes de construir la evidencia.",
      tailY: 5.74,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 42 · TRES ENTREGAS */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Evaluación", "Un proyecto, tres entregas que se acumulan",
    "No son tres trabajos distintos: es el mismo repositorio, cada vez más confiable.", { chip: T.a4 });

  const filas = [
    ["Tipado estricto y análisis estático", [1, 1, 1]],
    ["Primeras pruebas y auditoría", [1, 1, 1]],
    ["Plan de pruebas trazable", [0, 1, 1]],
    ["Suite: unitarias, integración, E2E", [0, 1, 1]],
    ["Integración continua en verde", [0, 0, 1]],
    ["Regresión y no funcionales", [0, 0, 1]],
  ];
  const cols = [["EVALUACIÓN 1", "1 sep"], ["EVALUACIÓN 2", "21 sep"], ["FINAL", "30 sep"]];
  const cx = [6.5, 8.9, 11.3];

  cols.forEach(function (c, j) {
    text(sl, c[0], {
      x: cx[j] - 1.0, y: 2.5, w: 2.0, h: 0.28, fontSize: 10, bold: true,
      color: T.a4, align: "center", charSpacing: 1.2,
    });
    text(sl, c[1], {
      x: cx[j] - 1.0, y: 2.78, w: 2.0, h: 0.26, fontSize: 10.4, color: T.mute, align: "center",
    });
  });

  filas.forEach(function (f, i) {
    const y = 3.24 + i * 0.56;
    text(sl, f[0], { x: M, y, w: 5.3, h: 0.32, fontSize: 12, color: T.body });
    f[1].forEach(function (on, j) {
      if (on) {
        sl.addShape(SH.ellipse, {
          x: cx[j] - 0.11, y: y + 0.05, w: 0.22, h: 0.22,
          fill: { color: T.a4 }, line: { color: T.a4 },
        });
      } else {
        sl.addShape(SH.ellipse, {
          x: cx[j] - 0.09, y: y + 0.07, w: 0.18, h: 0.18,
          fill: { color: T.field }, line: { color: T.edge, pt: 1 },
        });
      }
    });
    if (i < filas.length - 1) bar(sl, M, y + 0.44, 11.9, 0.01, T.edge);
  });

  text(sl, "El testing solo se entiende cuando el sistema crece: ver una prueba avisarte de que rompiste algo tres semanas después es lo que enseña para qué sirve.", {
    x: M, y: 6.42, w: 11.9, h: 0.32, fontSize: 12, bold: true, color: T.a3,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 43 · QUÉ SE EVALÚA */
{
  const sl = s("dark");
  statement(sl, "LO QUE SE CALIFICA",
    "No se evalúa la aplicación:\nse evalúa la verificación\nconstruida sobre ella.", {
      size: 32, bodyY: 2.96, bodyH: 2.3, kickerColor: T.a4, rule: T.a4,
      tail: "Un sistema con tres reglas de negocio bien interrogadas vale más que uno con veinte funcionalidades sin evidencia de ninguna.",
      tailY: 5.66, tailW: 9.6,
    });
  validateSlide(sl, pptx);
}

/* ========================================== 44 · EVIDENCIA ANTES DE EJECUTAR */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Herramientas", "La evidencia empieza antes de ejecutar",
    "Tres barreras reducen incertidumbre antes de correr una sola prueba.", { chip: T.a2 });

  const gates = [
    ["01", "uv", "ENTORNO", "Misma instalación en cualquier máquina", "Flexibilidad", T.a2, T.pale2],
    ["02", "ruff", "FORMA", "Problemas detectados mientras escribes", "Mantenibilidad", T.a3, T.pale3],
    ["03", "pyrefly", "CONTRATO", "Tipos incompatibles antes de ejecutar", "Adecuación funcional", T.a4, T.pale4],
  ];
  gates.forEach(function (g, i) {
    const x = M + i * 4.0;
    sl.addShape(SH.rect, {
      x, y: 2.46, w: 3.54, h: 2.88,
      fill: { color: g[6] }, line: { color: g[6] },
    });
    text(sl, g[0], {
      x: x + 0.24, y: 2.66, w: 0.72, h: 0.46,
      fontFace: TYPOGRAPHY.display, fontSize: 26, bold: true, color: g[5],
    });
    text(sl, g[1], {
      x: x + 0.24, y: 3.22, w: 3.0, h: 0.5,
      fontFace: TYPOGRAPHY.mono, fontSize: 24, bold: true, color: T.ink,
    });
    kicker(sl, g[2], x + 0.24, 3.88, g[5], 2.8);
    text(sl, g[3], {
      x: x + 0.24, y: 4.22, w: 2.96, h: 0.58,
      fontSize: 12.3, bold: true, color: T.body, lineSpacingMultiple: 1.04,
    });
    text(sl, g[4], {
      x: x + 0.24, y: 4.88, w: 2.96, h: 0.26,
      fontSize: 10.4, bold: true, color: g[5],
    });
  });

  bar(sl, M, 5.82, 1.0, 0.05, T.a1);
  text(sl, "pytest abre la siguiente puerta: comprobar comportamiento.", {
    x: M, y: 6.08, w: 11.8, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.ink,
  });

  validateSlide(sl, pptx);
}

/* ============================================ 45 · CAPAS DE EVIDENCIA */
{
  const sl = s("dark");
  head(sl, "Bloque 3 · Herramientas", "De una función a un usuario real",
    "Cada herramienta amplía el alcance de la pregunta.", { chip: T.a1 });

  const layers = [
    ["pytest", "LÓGICA Y API", "¿esta regla responde bien?", 2.05, T.a2],
    ["Vitest", "INTERFAZ", "¿el cliente decide bien?", 5.1, T.a3],
    ["Playwright", "RECORRIDO", "¿una persona completa el flujo?", 8.15, T.a1],
    ["GitHub Actions", "REPETICIÓN", "¿sigue funcionando tras cada cambio?", 11.2, T.a4],
  ];
  bar(sl, 1.18, 4.18, 10.9, 0.035, T.edge);
  layers.forEach(function (l, i) {
    const x = l[3];
    sl.addShape(SH.ellipse, {
      x: x - 0.34, y: 3.84, w: 0.68, h: 0.68,
      fill: { color: l[4] }, line: { color: l[4] },
    });
    text(sl, String(i + 1).padStart(2, "0"), {
      x: x - 0.34, y: 4.02, w: 0.68, h: 0.26,
      fontFace: TYPOGRAPHY.display, fontSize: 13, bold: true, color: "FFFFFF", align: "center",
    });
    text(sl, l[0], {
      x: x - 1.15, y: 2.62, w: 2.3, h: 0.4,
      fontFace: TYPOGRAPHY.mono, fontSize: 18, bold: true, color: T.ink, align: "center",
    });
    kicker(sl, l[1], x - 1.15, 3.18, l[4], 2.3);
    text(sl, l[2], {
      x: x - 1.18, y: 4.74, w: 2.36, h: 0.72,
      fontSize: 12.2, bold: true, color: T.body, align: "center", lineSpacingMultiple: 1.04,
    });
  });
  text(sl, "ALCANCE", {
    x: 10.78, y: 3.62, w: 1.2, h: 0.26,
    fontSize: 9.2, bold: true, color: T.a4, charSpacing: 1.5, align: "right",
  });
  text(sl, "La suite crece desde una decisión aislada hasta el sistema completo ejecutándose solo.", {
    x: 1.46, y: 5.86, w: 10.4, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: T.a3, align: "center",
  });

  validateSlide(sl, pptx);
}

/* ================================================ 46 · PYTHON Y TYPESCRIPT */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Stack", "No son dos cursos paralelos: es un sistema",
    null, { chip: T.a2 });

  // Arquitectura real: cliente, contrato HTTP y servicio. No dos cajas apiladas.
  sl.addShape(SH.roundRect, {
    x: M, y: 2.5, w: 5.0, h: 3.3, rectRadius: 0.05,
    fill: { color: "FFFFFF" }, line: { color: T.edge, pt: 1.1 },
  });
  bar(sl, M, 2.5, 5.0, 0.38, T.ink);
  [T.a1, T.a3, T.a4].forEach(function (c, i) {
    sl.addShape(SH.ellipse, { x: M + 0.22 + i * 0.24, y: 2.62, w: 0.1, h: 0.1, fill: { color: c }, line: { color: c } });
  });
  kicker(sl, "CLIENTE  ·  TYPESCRIPT", M + 0.34, 3.12, T.a2, 4.2);
  text(sl, "Interfaz", {
    x: M + 0.34, y: 3.5, w: 4.3, h: 0.48,
    fontFace: TYPOGRAPHY.display, fontSize: 25, bold: true, color: T.ink,
  });
  text(sl, "Vitest verifica decisiones del cliente.\nPlaywright recorre el flujo como una persona.", {
    x: M + 0.34, y: 4.12, w: 4.2, h: 0.9,
    fontSize: 12.4, color: T.body, lineSpacingMultiple: 1.12,
  });
  bar(sl, M + 0.34, 5.3, 1.1, 0.05, T.a2);

  text(sl, "HTTP  →  JSON", {
    x: 5.95, y: 3.56, w: 1.44, h: 0.32,
    fontFace: TYPOGRAPHY.mono, fontSize: 11.5, bold: true, color: T.a3, align: "center",
  });
  sl.addShape(SH.chevron, {
    x: 6.15, y: 4.08, w: 1.02, h: 0.72,
    fill: { color: T.a3 }, line: { color: T.a3 },
  });

  panelBox(sl, 7.62, 2.5, 4.98, 3.3);
  kicker(sl, "SERVICIO  ·  PYTHON", 7.96, 3.12, T.a1, 4.2);
  text(sl, "FastAPI", {
    x: 7.96, y: 3.5, w: 4.3, h: 0.48,
    fontFace: TYPOGRAPHY.display, fontSize: 25, bold: true, color: "FFFFFF",
  });
  text(sl, "uv + ruff + pyrefly sostienen el entorno.\npytest cubre lógica e integración.", {
    x: 7.96, y: 4.12, w: 4.2, h: 0.9,
    fontSize: 12.4, color: "C7D6E6", lineSpacingMultiple: 1.12,
  });
  bar(sl, 7.96, 5.3, 1.1, 0.05, T.a1);

  text(sl, "Un sistema real, dos sintaxis de prueba y un solo criterio.", {
    x: M, y: 6.2, w: 11.9, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: T.ink, align: "center",
  });

  validateSlide(sl, pptx);
}

/* ================================================ 46 · REGLAS CON IA */
{
  const sl = s("dark");
  statement(sl, "LAS REGLAS DEL JUEGO CON AGENTES",
    "Acá el producto\nno es el código:\nes la verificación.", {
      size: 36, bodyY: 2.96, bodyH: 2.2, kickerColor: T.a2, rule: T.a2,
      tail: "En un módulo de programación, delegar al agente al menos deja algo funcionando. Si delegas la verificación sin entenderla, no te queda nada: lo único que estabas construyendo era tu criterio.",
      tailY: 5.5, tailW: 10.2,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 47 · LAS TRES REGLAS */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Reglas", "Se permite y se espera que uses agentes",
    "No hay ninguna ventaja pedagógica en prohibir la herramienta con la que van a trabajar el resto de su vida profesional.", { chip: T.a4 });

  const reglas = [
    ["01", "Puedes delegar\nla escritura", "Pero debes justificar cada prueba y explicar qué perderías si la borraras.", T.a1, T.pale1],
    ["02", "Documenta\nla revisión", "Qué hizo el agente, qué corregiste y qué decidiste tú.", T.a2, T.pale2],
    ["03", "Respondes por\nlo que entregas", "Si no lo entiendes y falla, el problema es tuyo, no del modelo.", T.a4, T.pale4],
  ];
  reglas.forEach(function (r, i) {
    const x = M + i * 4.0;
    sl.addShape(SH.rect, {
      x, y: 2.56, w: 3.54, h: 3.18,
      fill: { color: r[4] }, line: { color: r[4] },
    });
    bar(sl, x, 2.56, 0.08, 3.18, r[3]);
    text(sl, r[0], {
      x: x + 0.26, y: 2.78, w: 0.9, h: 0.64,
      fontFace: TYPOGRAPHY.display, fontSize: 36, bold: true, color: r[3],
    });
    text(sl, r[1], {
      x: x + 0.26, y: 3.62, w: 2.96, h: 0.9,
      fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.ink,
      lineSpacingMultiple: 0.98,
    });
    text(sl, r[2], {
      x: x + 0.26, y: 4.72, w: 2.96, h: 0.72,
      fontSize: 12, color: T.body, lineSpacingMultiple: 1.08,
    });
  });

  text(sl, "Una prueba que no sabes justificar es ruido, aunque esté en verde.", {
    x: M, y: 6.12, w: 11.9, h: 0.42,
    fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.a1, align: "center",
  });

  validateSlide(sl, pptx);
}

/* ============================================ 48 · REVIEW ADVERSARIAL */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Adelanto", "Y una técnica que invierte la relación habitual",
    "Semana 3: revisión adversarial entre modelos.", { chip: T.a3 });

  const pasos = [
    ["Un agente escribe", "produce el código, plausible y rápido", T.a2],
    ["Otro agente audita", "busca fallas en el trabajo del primero", T.a1],
    ["Tú arbitras", "decides quién tiene razón y por qué", T.a4],
  ];
  pasos.forEach(function (p, i) {
    const x = M + i * 4.0;
    bar(sl, x, 2.86, 3.5, 0.06, p[2]);
    text(sl, String(i + 1).padStart(2, "0"), {
      x, y: 3.06, w: 1.0, h: 0.44,
      fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: p[2],
    });
    text(sl, p[0], {
      x, y: 3.6, w: 3.5, h: 0.36,
      fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.ink,
    });
    text(sl, p[1], { x, y: 4.04, w: 3.5, h: 0.6, fontSize: 11.8, color: T.body, lineSpacingMultiple: 1.06 });
    if (i < 2) {
      text(sl, "→", { x: x + 3.6, y: 3.6, w: 0.32, h: 0.36, fontSize: 17, bold: true, color: T.edge, align: "center" });
    }
  });

  bar(sl, M, 5.24, 0.05, 1.02, T.a3);
  text(sl, "Es una técnica real de verificación, no un ejercicio de clase.", {
    x: M + 0.3, y: 5.28, w: 11.6, h: 0.36,
    fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.ink,
  });
  text(sl, "Y entrena exactamente la habilidad que este módulo persigue: leer código ajeno con desconfianza productiva.", {
    x: M + 0.3, y: 5.74, w: 11.6, h: 0.32, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 49 · IDEA CLAVE B3 */
{
  const sl = s("dark");
  statement(sl, "IDEA CLAVE  ·  BLOQUE 3",
    "Ocho semanas construyen\nuna sola cosa: la capacidad\nde demostrar que un\nsistema funciona.", {
      size: 30, bodyY: 2.88, bodyH: 2.6, kickerColor: T.a3,
      tail: "Los agentes son parte del trabajo. El criterio para juzgar su resultado no se delega.",
      tailY: 5.74,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 50 · PREGUNTAS B3 */
{
  const sl = s("light");
  head(sl, "Bloque 3 · Preguntas", "Tres preguntas para llevarse", null, { chip: T.a2 });

  const qs = [
    ["¿Por qué el módulo termina con un proyecto con pruebas y no con una prueba escrita?",
      "Piensa qué evidencia solo aparece cuando el mismo sistema cambia durante semanas."],
    ["Si se permite usar agentes, ¿qué es exactamente lo que se está evaluando?",
      "No mires cuánto código produce el agente; mira qué decisiones debes defender tú."],
    ["¿Qué significa que una prueba sea ruido aunque esté en verde?",
      "Pregúntate qué defecto detecta y qué información perderías al borrarla."],
  ];
  let y = 2.26;
  qs.forEach(function ([q, hint], i) {
    questionRow(sl, y, i, q, hint);
    if (i < qs.length - 1) bar(sl, M, y + 1.04, 11.9, 0.012, T.edge);
    y += 1.18;
  });

  bar(sl, M, 6.14, 0.06, 0.86, T.a1);
  kicker(sl, "SIGUE  ·  BLOQUE 4", M + 0.3, 6.18, T.a3, 3.2);
  text(sl, "Antes de empezar a construir ese criterio, hace falta saber desde dónde parte cada uno.", {
    x: M + 0.3, y: 6.5, w: 11.3, h: 0.34, fontSize: 11.8, color: T.body,
  });

  validateSlide(sl, pptx);
}

/* ====================================================== 51 · APERTURA B4 */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl);

  text(sl, "04", {
    x: M - 0.14, y: 1.68, w: 3.6, h: 2.4,
    fontFace: TYPOGRAPHY.display, fontSize: 140, bold: true, color: T.a4,
  });
  bar(sl, M, 4.42, 2.0, 0.06, T.a2);
  kicker(sl, "BLOQUE 4  ·  20 MINUTOS", M, 4.7, T.a3, 3.9);

  text(sl, "Línea base:\nde dónde\npartimos", {
    x: 4.96, y: 1.84, w: 7.6, h: 2.8,
    fontFace: TYPOGRAPHY.display, fontSize: 40, bold: true, color: T.ink,
    lineSpacingMultiple: 1.0,
  });
  text(sl, "Antes de cambiar algo, hay que registrar cómo está ahora.", {
    x: 4.96, y: 4.86, w: 7.6, h: 0.4, fontSize: 14, bold: true, color: T.a4,
  });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ================================================ 52 · MEDIR ANTES */
{
  const sl = s("light");
  head(sl, "Bloque 4 · Concepto", "Medir antes de cambiar",
    "Sin registro previo, cualquier afirmación sobre una mejora es una opinión.", { chip: T.a4 });

  // La composicion ES el concepto: dos mediciones y el tramo entre ellas.
  const y0 = 3.5;
  bar(sl, M, y0, 11.9, 0.028, T.edge);

  const pts = [
    ["HOY", "10 de agosto", "cómo llegas", 0, T.a1],
    ["ÚLTIMA SEMANA", "30 de septiembre", "cómo terminas", 1, T.a4],
  ];
  pts.forEach(function (p) {
    const x = M + 11.9 * p[3];
    sl.addShape(SH.ellipse, {
      x: x - (p[3] ? 0.22 : 0), y: y0 - 0.1, w: 0.24, h: 0.24,
      fill: { color: p[4] }, line: { color: p[4] },
    });
    const tx = p[3] ? x - 3.4 : x;
    const al = p[3] ? "right" : "left";
    text(sl, p[0], {
      x: tx, y: 2.86, w: 3.4, h: 0.34,
      fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: p[4], align: al,
    });
    text(sl, p[1], { x: tx, y: 3.2, w: 3.4, h: 0.26, fontSize: 11, color: T.mute, align: al });
    text(sl, p[2], { x: tx, y: 3.78, w: 3.4, h: 0.3, fontSize: 12.5, color: T.body, align: al });
  });

  text(sl, "el tramo que sí puedes demostrar", {
    x: 4.5, y: 3.78, w: 4.4, h: 0.3, fontSize: 11.4, italic: true, color: T.mute, align: "center",
  });

  bar(sl, M, 4.66, 0.05, 1.5, T.a2);
  text(sl, "Esto no es una metáfora del módulo: es el mismo procedimiento.", {
    x: M + 0.3, y: 4.7, w: 11.6, h: 0.36,
    fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: T.ink,
  });
  text(sl, "En la Evaluación 1 van a registrar el estado de calidad inicial de su proyecto antes de tocarlo, exactamente por la misma razón: para poder afirmar después que algo mejoró.", {
    x: M + 0.3, y: 5.16, w: 11.6, h: 0.6, fontSize: 12.5, color: T.body, lineSpacingMultiple: 1.08,
  });
  text(sl, "«Ahora está más rápido» no significa nada si nadie midió cuánto demoraba antes.", {
    x: M + 0.3, y: 5.84, w: 11.6, h: 0.3, fontSize: 12, italic: true, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================== 53 · EL «NO SÉ» */
{
  const sl = s("light");
  head(sl, "Bloque 4 · Instrucción", "Por qué «no sé» es la respuesta más valiosa",
    "El cuestionario no lleva nota, y eso cambia por completo la estrategia óptima.", { chip: T.a4 });

  bar(sl, 6.58, 2.66, 0.014, 2.7, T.edge);

  kicker(sl, "EN UNA PRUEBA CALIFICADA", M, 2.7, T.mute, 5);
  text(sl, "Conviene arriesgar", {
    x: M, y: 3.04, w: 5.4, h: 0.44,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.mute,
  });
  text(sl, "Una respuesta al azar puede sumar y nunca resta. Adivinar es racional.", {
    x: M, y: 3.6, w: 5.4, h: 0.6, fontSize: 12.5, color: T.body, lineSpacingMultiple: 1.08,
  });

  kicker(sl, "EN UN DIAGNÓSTICO", 7.12, 2.7, T.a1, 5);
  text(sl, "Adivinar te perjudica", {
    x: 7.12, y: 3.04, w: 5.4, h: 0.44,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.ink,
  });
  text(sl, "Si aciertas por azar, el instrumento registra un conocimiento que no existe. Y la consecuencia recae sobre ti: se pasa rápido por algo que necesitabas.", {
    x: 7.12, y: 3.6, w: 5.4, h: 0.9, fontSize: 12.5, color: T.body, lineSpacingMultiple: 1.08,
  });

  // El puente al vocabulario del modulo.
  bar(sl, M, 5.6, 11.9, 0.014, T.edge);
  text(sl, "Adivinar produce el equivalente a una prueba que queda en verde con el sistema malo.", {
    x: M, y: 5.88, w: 11.9, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: T.a1,
  });
  text(sl, "La medición dice que todo está bien, la realidad dice otra cosa, y por confiar en ella se decide mal. Un resultado así es peor que no haber medido, porque además da confianza.", {
    x: M, y: 6.34, w: 11.9, h: 0.32, fontSize: 12, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 54 · QUÉ SE REGISTRA */
{
  const sl = s("light");
  head(sl, "Bloque 4 · Instrumento", "Cuatro partes, cuatro cosas distintas", null, { chip: T.a4 });

  const partes = [
    ["PUNTO DE PARTIDA", "Lenguajes, Git, terminal, experiencia previa con pruebas y uso de agentes. No hay respuestas correctas."],
    ["VERDADERO O FALSO", "Diez afirmaciones sobre calidad y pruebas. Varias parecen evidentes y no lo son."],
    ["RESPUESTA BREVE", "Cuatro situaciones prácticas. Interesa el razonamiento, no la terminología."],
    ["ORGANIZACIÓN", "Con qué proyecto y con qué equipo va a trabajar cada uno."],
  ];
  let y = 2.66;
  partes.forEach(function (p, i) {
    stepRow(sl, y, i, p[0], p[1], { labelW: 2.9, glossW: 7.3, ruleW: 0.7 });
    if (i < partes.length - 1) bar(sl, M, y + 0.56, 11.9, 0.012, T.edge);
    y += 0.86;
  });

  bar(sl, M, 6.12, 0.05, 0.64, T.a2);
  text(sl, "Las afirmaciones que dividan a la sala son las más interesantes.", {
    x: M + 0.3, y: 6.2, w: 11.6, h: 0.32, fontSize: 12.5, bold: true, color: T.ink,
  });
  text(sl, "Un desacuerdo repartido no significa que la mitad esté equivocada: significa que ahí hay una idea que parece obvia desde dos lados opuestos. Esas son las que producen defectos.", {
    x: M + 0.3, y: 6.48, w: 10.3, h: 0.28, fontSize: 11.4, color: T.mute,
  });

  validateSlide(sl, pptx);
}

/* ================================================ 55 · IDEA CLAVE B4 */
{
  const sl = s("dark");
  statement(sl, "IDEA CLAVE  ·  BLOQUE 4",
    "Una medición solo sirve\nsi los datos son honestos.", {
      size: 34, bodyY: 3.0, bodyH: 1.6, kickerColor: T.a4, rule: T.a4,
      tail: "Un resultado falseado no es un dato incompleto: es un dato que engaña. Y sobre un dato que engaña se toman decisiones peores que sin dato alguno.",
      tailY: 4.96, tailW: 9.4,
    });
  validateSlide(sl, pptx);
}

/* ================================================ 57 · PREGUNTAS B4 */
{
  const sl = s("light");
  head(sl, "Bloque 4 · Preguntas", "Tres preguntas para llevarse", null, { chip: T.a4 });

  const qs = [
    ["¿Qué es una línea base y qué permite demostrar al final del módulo?",
      "Sin un punto inicial, una mejora solo puede parecerlo."],
    ["¿Por qué «no sé» puede ser mejor dato que una respuesta correcta por azar?",
      "Piensa qué decisiones tomaríamos confiando en un dato falso."],
    ["¿Qué relación tiene este diagnóstico con la Evaluación 1 del proyecto?",
      "En ambos casos se registra el estado antes de intervenir."],
  ];
  let y = 2.26;
  qs.forEach(function ([q, hint], i) {
    questionRow(sl, y, i, q, hint);
    if (i < qs.length - 1) bar(sl, M, y + 1.04, 11.9, 0.012, T.edge);
    y += 1.18;
  });

  bar(sl, M, 6.12, 1.0, 0.05, T.a4);
  text(sl, "Medir antes de cambiar es lo que permite demostrar después que algo mejoró.", {
    x: M, y: 6.36, w: 11.9, h: 0.36,
    fontFace: TYPOGRAPHY.display, fontSize: 17.5, bold: true, color: T.ink,
  });

  validateSlide(sl, pptx);
}

/* ============================================ 58 · CIERRE · EL HILO */
{
  const sl = s("light");
  head(sl, "Cierre de la clase", "Lo que quedó instalado hoy", null, { chip: T.a2 });

  const bloques = [
    ["01", "PARECER", "no es probar", T.a1, T.pale1],
    ["02", "CALIDAD", "es un perfil", T.a2, T.pale2],
    ["03", "EVIDENCIA", "se construye", T.a3, T.pale3],
    ["04", "MEDIR", "permite comparar", T.a4, T.pale4],
  ];
  bloques.forEach(function (b, i) {
    const x = M + i * 3.0;
    sl.addShape(SH.rect, {
      x, y: 2.5, w: 2.62, h: 2.72,
      fill: { color: b[4] }, line: { color: b[4] },
    });
    bar(sl, x, 2.5, 2.62, 0.08, b[3]);
    text(sl, b[0], {
      x: x + 0.22, y: 2.82, w: 2.16, h: 0.54,
      fontFace: TYPOGRAPHY.display, fontSize: 32, bold: true, color: b[3],
    });
    text(sl, b[1], {
      x: x + 0.22, y: 3.62, w: 2.16, h: 0.38,
      fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.ink,
      charSpacing: 0.8,
    });
    text(sl, b[2], {
      x: x + 0.22, y: 4.18, w: 2.16, h: 0.42,
      fontFace: TYPOGRAPHY.display, fontSize: 16, bold: true, color: b[3],
    });
  });

  bar(sl, M, 5.72, 1.08, 0.05, T.a2);
  text(sl, "Escribir código dejó de ser lo difícil. Lo escaso es mirar el resultado y decidir, con fundamento, si sirve.", {
    x: M, y: 5.98, w: 11.9, h: 0.52,
    fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: T.ink,
  });

  validateSlide(sl, pptx);
}

/* ============================================ 59 · LA FRASE INVERTIDA */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl);

  kicker(sl, "EN OCHO SEMANAS, ESTA FRASE VA A CAMBIAR", M, 1.94, T.a3, 8);
  bar(sl, M, 2.4, 1.3, 0.05, T.a1);

  // La frase vieja, tachada.
  text(sl, "«Lo probé y anduvo.»", {
    x: M, y: 2.86, w: 9.0, h: 0.76,
    fontFace: TYPOGRAPHY.display, fontSize: 34, bold: true, color: T.mute,
  });
  bar(sl, M + 0.02, 3.24, 5.32, 0.035, T.a1);

  text(sl, "«Funciona,\ny acá está la evidencia.»", {
    x: M, y: 3.96, w: 11.0, h: 1.7,
    fontFace: TYPOGRAPHY.display, fontSize: 42, bold: true, color: T.ink,
    lineSpacingMultiple: 1.02,
  });

  bar(sl, M, 5.94, 1.3, 0.05, T.a2);
  text(sl, "Esa es toda la diferencia, y es todo el módulo.", {
    x: M, y: 6.2, w: 9.0, h: 0.34, fontSize: 14, color: T.a2, bold: true,
  });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ============================================ 60 · PRÓXIMA SESIÓN */
{
  const sl = s("light");
  head(sl, "Cierre · Martes 11", "Para la próxima sesión",
    "Montamos el entorno de trabajo y escribimos la primera prueba automatizada.", { chip: T.a2 });

  const items = [
    ["01", "COMPUTADOR", "si trabajas en el tuyo", T.a2, T.pale2],
    ["02", "GITHUB", "cuenta creada y a mano", T.a3, T.pale3],
    ["03", "DIAGNÓSTICO", "respondido, si alcanzaste", T.a4, T.pale4],
  ];
  items.forEach(function (it, i) {
    const x = M + i * 4.0;
    sl.addShape(SH.rect, {
      x, y: 2.54, w: 3.52, h: 2.28,
      fill: { color: it[4] }, line: { color: it[4] },
    });
    text(sl, it[0], {
      x: x + 0.24, y: 2.78, w: 0.72, h: 0.56,
      fontFace: TYPOGRAPHY.display, fontSize: 30, bold: true, color: it[3],
    });
    bar(sl, x + 0.24, 3.56, 0.92, 0.05, it[3]);
    text(sl, it[1], {
      x: x + 0.24, y: 3.8, w: 2.94, h: 0.38,
      fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color: T.ink,
      charSpacing: 0.7,
    });
    text(sl, it[2], { x: x + 0.24, y: 4.24, w: 2.94, h: 0.3, fontSize: 11.8, color: T.body });
  });

  bar(sl, M, 5.3, 0.05, 1.08, T.a1);
  text(sl, "Nada más.", {
    x: M + 0.3, y: 5.34, w: 2.4, h: 0.4,
    fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: T.ink,
  });
  text(sl, "No hace falta instalar herramientas ni llegar con un proyecto pensado. Las herramientas las montamos juntos en clases —dejar el entorno funcionando y reproducible es parte del contenido— y el proyecto lo van a construir más adelante, cuando ya tengan con qué juzgarlo.", {
    x: 3.62, y: 5.36, w: 8.98, h: 0.86, fontSize: 12.2, color: T.body, lineSpacingMultiple: 1.08,
  });

  validateSlide(sl, pptx);
}

/* ============================================ 61 · CIERRE FINAL */
{
  const sl = s("dark");
  bg(sl);
  cornerMark(sl);
  logo(sl, { w: 1.62, y: 0.52, h: 0.6 });

  text(sl, "¿Cómo sabes", {
    x: M - 0.06, y: 2.5, w: 8.4, h: 1.06,
    fontFace: TYPOGRAPHY.display, fontSize: 54, bold: true, color: T.ink,
  });
  text(sl, "que funciona?", {
    x: M - 0.06, y: 3.54, w: 8.4, h: 1.06,
    fontFace: TYPOGRAPHY.display, fontSize: 54, bold: true, color: T.a2,
  });

  bar(sl, M, 4.92, 1.4, 0.05, T.a1);
  text(sl, "Nos vemos el martes.", {
    x: M, y: 5.18, w: 8.4, h: 0.42, fontSize: 16, bold: true, color: T.lead,
  });

  text(sl, "PRO402  ·  Taller de Testing y Calidad de Software  ·  Diego Obando", {
    x: M, y: 5.72, w: 8.4, h: 0.3, fontSize: 11.4, color: T.mute,
  });

  aiepMotif(sl, 10.1, 2.6, 0.72, T.ink, { transparency: 90 });

  foot(sl);
  validateSlide(sl, pptx);
}

/* ---------------------------------------------------------------- salida */
pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`Deck generado: ${outputPptx} (${pptx._slides.length} slides)`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
