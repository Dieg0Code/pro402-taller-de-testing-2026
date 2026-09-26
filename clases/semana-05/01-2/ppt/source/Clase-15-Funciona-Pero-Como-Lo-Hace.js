const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { addCodePanel, addTerminalPanel } = components;
const { validateSlide, makeCodeSvgData } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "PRO402 · Clase 15",
  title: "Funciona, pero ¿cómo lo hace?",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-15-Funciona-Pero-Como-Lo-Hace.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

const NAVY_RULE = "2C4A66";
const NAVY_CHIP = "1D3A57";
const VERDE = "2E7D4F";
const ROJO = "B3181E";
const ORO = "8A6A12";
const AZUL = C.navy;
const NL = String.fromCharCode(10);

// ---------------------------------------------------------------------------
// Primitivos compartidos por toda la clase.

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

function rect(slide, x, y, w, h, fill, outline = fill) {
  slide.addShape(SH.rect, {
    x,
    y,
    w,
    h,
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

function arrow(slide, x, y, w, color, pt = 1.6) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, pt, beginArrowType: "none", endArrowType: "triangle" },
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
    w: 6.2,
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

function addHeader(slide, label, title, subtitle = "", dark = false, opts = {}) {
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.44,
    w: 7.8,
    h: 0.22,
    fontSize: 10.3,
    bold: true,
    color: dark ? C.gold : C.red,
    charSpacing: 1.7,
  });
  addText(slide, title, {
    x: M,
    y: 0.82,
    w: opts.titleW || 10.4,
    h: opts.titleH || 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || (title.length > 54 ? 27 : 30),
    bold: true,
    color: dark ? C.white : C.ink,
    lineSpacingMultiple: 1.03,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: M,
      y: opts.subtitleY || 1.82,
      w: opts.subtitleW || 11.4,
      h: opts.subtitleH || 0.54,
      fontSize: opts.subtitleFontSize || 14.2,
      color: dark ? C.softBlue : C.slate,
      lineSpacingMultiple: 1.14,
    });
  }
}

function addKicker(slide, x, y, text, color, w = 5.2) {
  addText(slide, text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color,
    charSpacing: 1.3,
  });
}

function addTakeaway(slide, text, opts = {}) {
  const y = opts.y || 6.18;
  const h = opts.h || 0.6;
  rect(slide, M, y, CW, h, opts.fill || C.navy);
  addText(slide, text, {
    x: M + 0.32,
    y: y + 0.04,
    w: CW - 0.64,
    h: h - 0.08,
    fontSize: opts.fontSize || 13.8,
    bold: true,
    color: opts.color || C.white,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });
}

function addFuente(slide, y, text, opts = {}) {
  rect(slide, M, y, 0.05, 0.2, opts.color || ORO);
  addText(slide, text, {
    x: M + 0.16,
    y: y - 0.01,
    w: opts.w || 10.5,
    h: 0.22,
    fontSize: opts.fontSize || 8.8,
    italic: true,
    color: opts.textColor || C.slate,
  });
}

function addDefinition(slide, x, y, w, h, term, definition, accent = AZUL) {
  rect(slide, x, y, w, h, C.white);
  rect(slide, x, y, 0.06, h, accent);
  addText(slide, term.toUpperCase(), {
    x: x + 0.26,
    y: y + 0.14,
    w: w - 0.5,
    h: 0.2,
    fontSize: 9.2,
    bold: true,
    color: accent,
    charSpacing: 1.1,
  });
  addText(slide, definition, {
    x: x + 0.26,
    y: y + 0.42,
    w: w - 0.5,
    h: h - 0.54,
    fontSize: 12.1,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });
}

function addStep(slide, x, y, w, number, title, body, color, opts = {}) {
  const h = opts.h || 1.12;
  rect(slide, x, y, w, h, opts.fill || C.white);
  rect(slide, x, y, w, 0.06, color);
  addText(slide, number, {
    x: x + 0.22,
    y: y + 0.2,
    w: 0.5,
    h: 0.46,
    fontFace: TYPOGRAPHY.display,
    fontSize: 26,
    bold: true,
    color,
    align: "center",
    valign: "mid",
  });
  addText(slide, title, {
    x: x + 0.86,
    y: y + 0.16,
    w: w - 1.08,
    h: 0.28,
    fontSize: 13.2,
    bold: true,
    color: C.ink,
  });
  addText(slide, body, {
    x: x + 0.86,
    y: y + 0.48,
    w: w - 1.08,
    h: h - 0.58,
    fontSize: 11.1,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });
}

function slideQuestions(block, title, questions) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${block} · cierre`, title, "Tres preguntas para comprobar la idea central antes de seguir.", false, {
    subtitleH: 0.36,
  });
  const colors = [ROJO, AZUL, ORO];
  questions.forEach(([question, hint], index) => {
    const y = 2.34 + index * 1.34;
    const color = colors[index];
    rect(slide, M, y, CW, 1.2, index % 2 === 0 ? C.warm : C.softNeutral);
    rect(slide, M, y, 0.06, 1.2, color);
    addText(slide, String(index + 1), {
      x: M + 0.28,
      y: y + 0.16,
      w: 0.54,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, question, {
      x: M + 1.02,
      y: y + 0.14,
      w: CW - 1.34,
      h: 0.5,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    rule(slide, M + 1.02, y + 0.72, CW - 1.34, C.border, 0.7);
    addText(slide, "PISTA", {
      x: M + 1.02,
      y: y + 0.82,
      w: 0.7,
      h: 0.18,
      fontSize: 8.4,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, hint, {
      x: M + 1.78,
      y: y + 0.79,
      w: CW - 2.1,
      h: 0.28,
      fontSize: 11.4,
      italic: true,
      color: C.slate,
    });
  });
  validateSlide(slide, pptx);
}

function slideAnswers(block, title, answers) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${block} · contraste`, title, "Las respuestas conservan el mismo orden y color que las preguntas.", false, {
    subtitleH: 0.36,
  });
  const colors = [ROJO, AZUL, ORO];
  answers.forEach(([label, answer, reveals, error], index) => {
    const y = 2.34 + index * 1.48;
    const color = colors[index];
    rect(slide, M, y, CW, 1.36, C.white);
    rect(slide, M, y, 0.06, 1.36, color);
    addText(slide, String(index + 1), {
      x: M + 0.26,
      y: y + 0.18,
      w: 0.54,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 27,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, label.toUpperCase(), {
      x: M + 1.02,
      y: y + 0.12,
      w: 3.2,
      h: 0.18,
      fontSize: 8.3,
      bold: true,
      color,
      charSpacing: 1.0,
    });
    addText(slide, answer, {
      x: M + 1.02,
      y: y + 0.36,
      w: CW - 1.34,
      h: 0.38,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    rule(slide, M + 1.02, y + 0.8, CW - 1.34, C.border, 0.7);
    addText(slide, "LO QUE REVELA", {
      x: M + 1.02,
      y: y + 0.9,
      w: 1.3,
      h: 0.17,
      fontSize: 8,
      bold: true,
      color: VERDE,
      charSpacing: 0.9,
    });
    addText(slide, reveals, {
      x: M + 2.42,
      y: y + 0.87,
      w: 4.06,
      h: 0.34,
      fontSize: 10.2,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, "ERROR FRECUENTE", {
      x: M + 6.7,
      y: y + 0.9,
      w: 1.45,
      h: 0.17,
      fontSize: 8,
      bold: true,
      color: ROJO,
      charSpacing: 0.9,
    });
    addText(slide, error, {
      x: M + 8.18,
      y: y + 0.87,
      w: 3.35,
      h: 0.34,
      fontSize: 10.2,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });
  validateSlide(slide, pptx);
}
// Tarjeta compacta: barra de color arriba, rotulo y cuerpo. Usa todo el ancho
// disponible, a diferencia de addStep, que reserva espacio para el numero.
function addCard(slide, x, y, w, h, label, body, color, opts = {}) {
  rect(slide, x, y, w, h, opts.fill || C.white);
  rect(slide, x, y, w, 0.06, color);
  addText(slide, label.toUpperCase(), {
    x: x + 0.22,
    y: y + 0.2,
    w: w - 0.44,
    h: 0.2,
    fontSize: opts.labelFontSize || 9.6,
    bold: true,
    color,
    charSpacing: 1.0,
  });
  addText(slide, body, {
    x: x + 0.22,
    y: y + 0.46,
    w: w - 0.44,
    h: h - 0.6,
    fontSize: opts.fontSize || 11.4,
    color: opts.bodyColor || C.ink,
    lineSpacingMultiple: 1.14,
  });
}

// Bloque de cita literal de una fuente.
function addQuote(slide, x, y, w, h, texto, fuente, color = AZUL) {
  rect(slide, x, y, w, h, C.softNeutral);
  rect(slide, x, y, 0.06, h, color);
  addText(slide, `«${texto}»`, {
    x: x + 0.28,
    y: y + 0.14,
    w: w - 0.56,
    h: h - 0.48,
    fontSize: 11.8,
    italic: true,
    color: C.ink,
    lineSpacingMultiple: 1.16,
  });
  addText(slide, fuente, {
    x: x + 0.28,
    y: y + h - 0.3,
    w: w - 0.56,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: color,
  });
}
// ---------------------------------------------------------------------------
// Componentes propios de esta clase.
//
// Reemplazan a los paneles del sistema compartido: el alto de cada panel se
// calcula desde la cantidad de lineas, asi que no puede recortar la ultima.

// Circulo con un numero centrado en su propia caja. El texto se encoge una
// centesima por lado para que el validador no lo confunda con un solape.
function circulo(slide, cx, cy, d, fill, texto, colorTexto = C.white, fontSize = 10) {
  slide.addShape(SH.ellipse, {
    x: cx - d / 2,
    y: cy - d / 2,
    w: d,
    h: d,
    fill: { color: fill },
    line: { color: fill },
  });
  if (texto === undefined) return;
  slide.addText(String(texto), {
    x: cx - d / 2 + 0.01,
    y: cy - d / 2 + 0.01,
    w: d - 0.02,
    h: d - 0.02,
    fontFace: TYPOGRAPHY.body,
    fontSize,
    bold: true,
    color: colorTexto,
    align: "center",
    valign: "mid",
    margin: 0,
  });
}

// Panel de codigo. opts: x, y, w, code, lang, fontSize, title,
// marcas: [{ linea, color, numero }] resalta lineas y numera al margen.
function codigo(slide, opts) {
  const fs = opts.fontSize || 10;
  const fsIn = fs / 72;
  const paso = fsIn * 1.36;
  const n = opts.code.split("\n").length;
  const marcas = opts.marcas || [];
  const tituloH = opts.title ? 0.4 : 0;
  const padTop = opts.title ? 0.14 : 0.16;
  const margenMarcas = marcas.length ? 0.44 : 0;
  const imgX = opts.x + 0.18;
  const imgY = opts.y + tituloH + padTop;
  const imgW = opts.w - 0.36 - margenMarcas;
  // makeCodeSvgData impone un alto minimo de 80 px (1/3 de pulgada); por debajo, el SVG se comprime.
  const imgH = Math.max(n * paso + 0.06, 80 / 240);
  const ajuste = (imgH - (n * paso + 0.06)) / 2;
  const h = tituloH + padTop + imgH + 0.14;

  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h,
    rectRadius: 0.05,
    fill: { color: C.editorBg },
    line: { color: C.editorBg },
  });
  if (opts.title) {
    slide.addShape(SH.rect, {
      x: opts.x,
      y: opts.y + tituloH - 0.01,
      w: opts.w,
      h: 0.01,
      fill: { color: C.titleFill },
      line: { color: C.titleFill },
    });
    slide.addText(opts.title, {
      x: opts.x + 0.2,
      y: opts.y + 0.1,
      w: opts.w - 0.4,
      h: 0.22,
      fontFace: TYPOGRAPHY.body,
      fontSize: 9.6,
      bold: true,
      color: C.softBlue,
      margin: 0,
    });
  }

  marcas.forEach((m) => {
    slide.addShape(SH.rect, {
      x: opts.x + 0.06,
      y: imgY + ajuste + (m.linea - 1) * paso - fsIn * 0.1,
      w: opts.w - 0.12 - margenMarcas,
      h: paso * 0.96,
      fill: { color: m.color, transparency: 72 },
      line: { color: m.color, transparency: 100 },
    });
  });

  const codigoConAire = opts.code.split(NL).map((l) => " " + l).join(NL);
  slide.addImage({
    data: makeCodeSvgData(codigoConAire, opts.lang, {
      width: imgW,
      height: imgH,
      fontSize: fs,
      linePitch: paso,
      charW: fsIn * 0.55,
      lineDigits: String(n).length,
      topOffset: ajuste,
    }),
    x: imgX,
    y: imgY,
    w: imgW,
    h: imgH,
  });

  marcas.forEach((m) => {
    if (m.numero === undefined) return;
    circulo(slide, opts.x + opts.w - 0.25, imgY + ajuste + (m.linea - 1) * paso + fsIn * 0.5, Math.min(0.28, paso * 0.92), m.color, m.numero, m.color === C.gold ? C.navy : C.white, 9.4);
  });

  return { h, lineaY: (k) => imgY + ajuste + (k - 1) * paso + fsIn * 0.5 };
}

// Terminal. lines: [{ t, k }] con k: cmd | ok | err | muted | plain.
function terminal(slide, opts) {
  const fs = opts.fontSize || 10.2;
  const paso = (fs / 72) * 1.55;
  const tituloH = 0.38;
  const h = tituloH + 0.14 + opts.lines.length * paso + 0.14;
  const colores = {
    cmd: C.terminalPrompt,
    ok: C.success,
    err: C.red,
    muted: C.terminalMuted,
    plain: C.terminalOutput,
  };
  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h,
    rectRadius: 0.05,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBg },
  });
  [0, 1, 2].forEach((i) => circulo(slide, opts.x + 0.22 + i * 0.17, opts.y + 0.19, 0.09, C.slate));
  slide.addText(opts.title || "Terminal", {
    x: opts.x + 0.76,
    y: opts.y + 0.09,
    w: opts.w - 0.96,
    h: 0.2,
    fontFace: TYPOGRAPHY.body,
    fontSize: 9.4,
    bold: true,
    color: C.terminalMuted,
    margin: 0,
  });
  opts.lines.forEach((linea, i) => {
    slide.addText(linea.k === "cmd" ? `> ${linea.t}` : linea.t, {
      x: opts.x + 0.22,
      y: opts.y + tituloH + 0.14 + i * paso,
      w: opts.w - 0.44,
      h: paso,
      fontFace: TYPOGRAPHY.mono,
      fontSize: fs,
      bold: linea.k === "ok" || linea.k === "err",
      color: colores[linea.k || "plain"],
      valign: "mid",
      margin: 0,
    });
  });
  return h;
}

// Marco de navegador para una captura real de la interfaz.
function navegador(slide, opts) {
  const barra = 0.34;
  const imgH = opts.w / opts.aspecto;
  const h = barra + imgH;
  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.border, pt: 1 },
  });
  slide.addShape(SH.rect, {
    x: opts.x + 0.02,
    y: opts.y + barra - 0.01,
    w: opts.w - 0.04,
    h: 0.01,
    fill: { color: C.border },
    line: { color: C.border },
  });
  [0, 1, 2].forEach((i) => circulo(slide, opts.x + 0.2 + i * 0.16, opts.y + barra / 2, 0.09, C.border));
  slide.addShape(SH.roundRect, {
    x: opts.x + 0.8,
    y: opts.y + 0.07,
    w: Math.min(3.2, opts.w - 1.2),
    h: 0.2,
    rectRadius: 0.1,
    fill: { color: C.softNeutral },
    line: { color: C.softNeutral },
  });
  slide.addText(opts.url || "127.0.0.1:8000", {
    x: opts.x + 0.92,
    y: opts.y + 0.08,
    w: Math.min(3.0, opts.w - 1.4),
    h: 0.18,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 8.4,
    color: C.slate,
    valign: "mid",
    margin: 0,
  });
  slide.addImage({ path: opts.imagen, x: opts.x + 0.02, y: opts.y + barra, w: opts.w - 0.04, h: imgH - 0.02 });
  return h;
}

// Firma visual de la clase: el recorrido de trabajo en cuatro pasos.
const RUTA = [
  ["Medir", "Cuánto aguanta"],
  ["Atacar", "A quién deja entrar"],
  ["Incluir", "Para quién sirve y dónde corre"],
  ["Exigir", "Un umbral para cada afirmación"],
];

function addRuta(slide, activo, opts = {}) {
  const y = opts.y ?? 5.62;
  const dark = opts.dark ?? false;
  const gap = 0.14;
  const w = (CW - gap * 3) / 4;
  RUTA.forEach(([verbo, glosa], index) => {
    const x = M + index * (w + gap);
    const on = index + 1 === activo;
    rect(slide, x, y, w, 0.86, on ? C.red : dark ? NAVY_CHIP : C.softNeutral);
    addText(slide, `0${index + 1}`, {
      x: x + 0.2,
      y: y + 0.11,
      w: 0.5,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color: on ? C.white : dark ? C.gold : C.slate,
      charSpacing: 0.8,
    });
    addText(slide, verbo.toUpperCase(), {
      x: x + 0.2,
      y: y + 0.31,
      w: w - 0.4,
      h: 0.24,
      fontSize: 11.6,
      bold: true,
      color: on ? C.white : dark ? C.white : C.ink,
      charSpacing: 0.9,
    });
    addText(slide, glosa, {
      x: x + 0.2,
      y: y + 0.57,
      w: w - 0.4,
      h: 0.24,
      fontSize: 9.2,
      color: on ? C.sand : dark ? C.softBlue : C.slate,
      lineSpacingMultiple: 1.05,
    });
  });
}

// ---------------------------------------------------------------------------
// 01 · Portada

function slideCover() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.42, "PRO402 · Clase 15 · Unidad 2", C.gold, 6);
  addText(slide, "Funciona, pero ¿cómo lo hace?", {
    x: M,
    y: 1.84,
    w: 11.2,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.12, 4.2, C.red, 3);
  addText(slide, "Pruebas no funcionales: rendimiento, seguridad, accesibilidad y portabilidad", {
    x: M,
    y: 3.4,
    w: 11.2,
    h: 0.46,
    fontSize: 18,
    color: C.softBlue,
  });
  addText(
    slide,
    "Un sistema puede aprobar todas sus pruebas funcionales y fallar igual: tardar demasiado, dejar entrar a quien no debe, dejar afuera a quien lo necesita. Cada una de esas preguntas se mide, y cada medición necesita un umbral.",
    { x: M, y: 4.1, w: 10.2, h: 0.86, fontSize: 14.4, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  rule(slide, M, 5.46, CW, NAVY_RULE, 1);
  addText(slide, "Lunes 28 de septiembre de 2026 · 11:00 – 13:15 · Laboratorio de Redes", {
    x: M,
    y: 5.66,
    w: 7.2,
    h: 0.3,
    fontSize: 12.6,
    color: C.sand,
  });
  addText(slide, "Diego Obando · AIEP Osorno", {
    x: 8.2,
    y: 5.66,
    w: 4.4,
    h: 0.3,
    fontSize: 12.6,
    color: C.sand,
    align: "right",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 02 · Vocabulario

function slideVocabulary() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida", "Seis palabras para toda la sesión", "", false);

  const terminos = [
    ["API", "La puerta por la que otros programas usan el sistema.", "Recibe las reservas y responde el estado de los bloques.", AZUL],
    ["Suite", "Las pruebas que se ejecutan juntas con un solo comando.", "Hoy hay dos: la de pytest y la de Playwright.", VERDE],
    ["Extremo a extremo", "Una prueba que recorre el sistema por la pantalla, como una persona.", "Playwright maneja un navegador real para hacerlo.", ORO],
    ["SQL y SQLite", "SQL es el lenguaje con que se consulta y modifica una base de datos.", "SQLite es la base del proyecto: vive en un solo archivo.", ROJO],
    ["Agente", "Un modelo de lenguaje que lee archivos y hace tareas a partir de un pedido escrito.", "Hoy audita el proyecto con permiso solo para leer.", AZUL],
    ["ISTQB", "La organización internacional que certifica a quienes prueban software.", "Su programa es una de las dos fuentes del módulo; la otra, las normas ISO.", VERDE],
  ];
  const gap = 0.2;
  const w = (CW - gap * 2) / 3;
  const h = 1.6;
  terminos.forEach(([termino, def, ejemplo, color], index) => {
    const x = M + (index % 3) * (w + gap);
    const y = 1.84 + Math.floor(index / 3) * (h + 0.14);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, 0.07, h, color);
    addText(slide, termino, {
      x: x + 0.28,
      y: y + 0.12,
      w: w - 0.44,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color,
    });
    addText(slide, def, {
      x: x + 0.28,
      y: y + 0.52,
      w: w - 0.44,
      h: 0.62,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, ejemplo, {
      x: x + 0.28,
      y: y + 1.14,
      w: w - 0.44,
      h: 0.42,
      fontSize: 10,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.05,
    });
  });

  const codigos = [
    ["201", "reserva aceptada"],
    ["409", "rechazada por las reglas del sistema"],
    ["422", "datos que faltan o no tienen el formato pedido"],
    ["500", "error interno del servidor"],
  ];
  addText(slide, "CÓDIGOS DE RESPUESTA DE LA API", { x: M, y: 5.28, w: 4, h: 0.2, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  const wc = (CW - 0.36) / 4;
  codigos.forEach(([codigoRespuesta, significado], index) => {
    const x = M + index * (wc + 0.12);
    rect(slide, x, 5.52, wc, 0.5, C.white);
    addText(slide, codigoRespuesta, { x: x + 0.14, y: 5.58, w: 0.6, h: 0.38, fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: AZUL, valign: "mid" });
    addText(slide, significado, { x: x + 0.76, y: 5.56, w: wc - 0.88, h: 0.42, fontSize: 9.6, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
  });

  addTakeaway(slide, "Hasta ahora se probó qué hace el sistema. Hoy, cómo lo hace.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · Para abrir

function slideOpening() {
  const { slide } = createSlide("light");
  addHeader(slide, "Para abrir", "Todo lo probado hasta aquí dice qué hace", "", false);

  const w = (CW - 0.4) / 2;
  addKicker(slide, M, 1.94, "Lo que las suites ya comprueban", VERDE, w);
  [
    "Una reserva válida se acepta.",
    "Una inválida se rechaza con 409.",
    "Un bloque tomado no se vuelve a reservar.",
    "La pantalla dice lo que pasó.",
  ].forEach((texto, index) => {
    const y = 2.28 + index * 0.86;
    rect(slide, M, y, w, 0.74, C.white);
    rect(slide, M + 0.24, y + 0.27, 0.2, 0.2, VERDE);
    addText(slide, texto, { x: M + 0.62, y: y + 0.12, w: w - 0.8, h: 0.5, fontSize: 13, color: C.ink, valign: "mid" });
  });

  const xd = M + w + 0.4;
  addKicker(slide, xd, 1.94, "Lo que ninguna prueba pregunta todavía", ROJO, w);
  [
    "¿Responde a tiempo con cien personas reservando a la vez?",
    "¿Deja que alguien actúe en nombre de otra persona?",
    "¿La puede usar alguien sin mouse, o que ve poco?",
    "¿Funciona en otro navegador, con otra versión de Python?",
  ].forEach((texto, index) => {
    const y = 2.28 + index * 0.86;
    rect(slide, xd, y, w, 0.74, C.warm);
    circulo(slide, xd + 0.36, y + 0.37, 0.34, ROJO, "?", C.white, 12);
    addText(slide, texto, { x: xd + 0.7, y: y + 0.08, w: w - 0.86, h: 0.58, fontSize: 12.4, bold: true, color: C.ink, valign: "mid", lineSpacingMultiple: 1.06 });
  });

  addTakeaway(slide, "Un sistema puede aprobar todas sus pruebas funcionales y fallar en cualquiera de estas preguntas.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Funcional y no funcional

function slideFunctionalVsNot() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida · la fuente", "Qué hace, y qué tan bien lo hace", "", false);

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.26,
    "La prueba funcional evalúa las funciones que un componente o sistema debe cumplir: «qué» debe hacer el objeto de prueba. La prueba no funcional evalúa atributos distintos de las funciones: es la prueba de «qué tan bien se comporta el sistema».",
    "ISTQB CTFL v4.0.1, sección 2.2.2 · traducción del original en inglés",
    AZUL
  );
  addText(slide, "Objeto de prueba: lo que se está probando; aquí, el sistema de reservas.", {
    x: M,
    y: 3.22,
    w: CW,
    h: 0.24,
    fontSize: 10,
    italic: true,
    color: C.slate,
  });

  const w = (CW - 0.4) / 2;
  const cajas = [
    [M, "Funcional", "qué hace", "Una reserva de 31 personas se rechaza con el código 409.", VERDE, C.white],
    [M + w + 0.4, "No funcional", "qué tan bien lo hace", "Con cien personas reservando a la vez, el 95 % de las respuestas llega en menos de 300 milisegundos.", ROJO, C.warm],
  ];
  cajas.forEach(([x, rotulo, grande, ejemplo, color, fondo]) => {
    rect(slide, x, 3.6, w, 2.36, fondo);
    rect(slide, x, 3.6, w, 0.06, color);
    addKicker(slide, x + 0.3, 3.8, rotulo, color, w - 0.6);
    addText(slide, `«${grande}»`, {
      x: x + 0.3,
      y: 4.12,
      w: w - 0.6,
      h: 0.7,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color: C.ink,
    });
    addText(slide, "Ejemplo", { x: x + 0.3, y: 4.96, w: 2, h: 0.2, fontSize: 9.4, bold: true, color: C.slate });
    addText(slide, ejemplo, { x: x + 0.3, y: 5.2, w: w - 0.6, h: 0.64, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "Las dos miran el mismo sistema. Preguntan cosas distintas.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · Las nueve caracteristicas

function slideNineCharacteristics() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida · ISO/IEC 25010:2023", "Nueve características, y hoy se miden cuatro", "", false, {
    titleFontSize: 28,
  });

  const caracteristicas = [
    ["Adecuación funcional", "Lo que ya se probó: qué hace", "Ya probada", C.slate],
    ["Eficiencia de desempeño", "Tiempo de respuesta, recursos, capacidad", "Bloque 1", ROJO],
    ["Seguridad", "Confidencialidad, autenticidad, resistencia", "Bloque 2", ROJO],
    ["Capacidad de interacción", "Incluye la accesibilidad, ahora dividida", "Bloque 3", ROJO],
    ["Flexibilidad", "Antes portabilidad; ahora incluye la escalabilidad", "Bloque 3", ROJO],
    ["Compatibilidad", "Convivir e intercambiar datos con otros productos", "", C.border],
    ["Fiabilidad", "Funcionar sin fallar en las condiciones previstas", "", C.border],
    ["Mantenibilidad", "Qué tan fácil es modificarlo", "", C.border],
    ["Protección", "No causar daño a personas ni al entorno", "", C.border],
  ];
  const gap = 0.14;
  const w = (CW - gap * 2) / 3;
  const h = 0.8;
  caracteristicas.forEach(([nombre, glosa, marca, color], index) => {
    const x = M + (index % 3) * (w + gap);
    const y = 1.92 + Math.floor(index / 3) * (h + 0.1);
    const hoy = color === ROJO;
    rect(slide, x, y, w, h, hoy ? C.warm : C.white);
    rect(slide, x, y, 0.07, h, color);
    addText(slide, nombre, { x: x + 0.26, y: y + 0.1, w: w - 1.44, h: 0.28, fontSize: 12.2, bold: true, color: hoy ? C.ink : C.slate });
    addText(slide, glosa, { x: x + 0.26, y: y + 0.42, w: w - 0.4, h: 0.3, fontSize: 9.8, color: C.slate });
    if (marca) {
      rect(slide, x + w - 1.14, y + 0.12, 0.96, 0.26, hoy ? ROJO : C.slate);
      addText(slide, marca.toUpperCase(), {
        x: x + w - 1.12,
        y: y + 0.14,
        w: 0.92,
        h: 0.22,
        fontSize: 9,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
      });
    }
  });

  addQuote(
    slide,
    M,
    4.68,
    CW,
    1.28,
    "La usabilidad y la portabilidad fueron reemplazadas por la capacidad de interacción y la flexibilidad. La inclusividad y la autodescriptividad, la resistencia y la escalabilidad se agregaron como subcaracterísticas de la capacidad de interacción, la seguridad y la flexibilidad.",
    "ISO/IEC 25010:2023, prólogo · traducción del original en inglés",
    AZUL
  );

  addTakeaway(slide, "Quien escribe un requisito no funcional necesita saber en qué característica cae.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · Mapa de la sesion

function slideMap() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la sesión", "135 minutos, de 11:00 a 13:15", "", false);

  const tramos = [
    ["Encuadre", 10, C.slate, ""],
    ["Medir", 30, C.red, "Cuánto aguanta: carga, estrés y la doble reserva"],
    ["Atacar", 30, ORO, "A quién deja entrar: inyección, suplantación y la ley"],
    ["Pausa", 10, C.border, ""],
    ["Incluir", 25, AZUL, "Para quién sirve y dónde corre"],
    ["Exigir", 20, VERDE, "La auditoría de un agente, verificada"],
    ["Cierre", 10, C.slate, ""],
  ];
  const total = 135;
  const escala = CW / total;
  let x = M;
  let minuto = 0;
  tramos.forEach(([nombre, minutos, color, glosa]) => {
    const w = minutos * escala;
    const bloque = glosa !== "";
    rect(slide, x, 2.3, w - 0.04, bloque ? 0.62 : 0.34, color);
    if (bloque) {
      addText(slide, nombre.toUpperCase(), { x: x + 0.14, y: 2.42, w: w - 0.3, h: 0.24, fontSize: 12, bold: true, color: C.white, charSpacing: 0.9 });
      addText(slide, `${minutos} min`, { x: x + 0.14, y: 2.66, w: w - 0.3, h: 0.2, fontSize: 9.4, color: C.white });
      rule(slide, x + 0.14, 3.1, w - 0.32, color, 1.6);
      addText(slide, glosa, { x: x + 0.14, y: 3.2, w: w - 0.3, h: 0.78, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.12 });
    } else {
      addText(slide, `${nombre} · ${minutos}`, { x, y: 2.72, w: Math.max(w, 0.9), h: 0.2, fontSize: 8.4, color: C.slate });
    }
    const hora = new Date(Date.UTC(2026, 0, 1, 11, minuto));
    addText(slide, `${String(hora.getUTCHours()).padStart(2, "0")}:${String(hora.getUTCMinutes()).padStart(2, "0")}`, {
      x: x - 0.02,
      y: 2.02,
      w: 0.42,
      h: 0.2,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.6,
      color: C.slate,
    });
    x += w;
    minuto += minutos;
  });
  addText(slide, "13:15", {
    x: M + CW - 0.46,
    y: 2.02,
    w: 0.5,
    h: 0.2,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 8.6,
    color: C.slate,
    align: "right",
  });

  rect(slide, M, 4.3, CW, 1.52, C.warm);
  rect(slide, M, 4.3, 0.06, 1.52, ROJO);
  addKicker(slide, M + 0.32, 4.48, "Todo contra el propio proyecto, en la propia máquina", ROJO, 9);
  addText(
    slide,
    "El Laboratorio de Redes comparte una red con otros equipos. Una prueba de carga o un análisis de seguridad contra un sistema ajeno —aunque sea el de un compañero— no es una prueba: es un ataque. Hoy nada sale de tu computador.",
    { x: M + 0.32, y: 4.76, w: CW - 0.64, h: 0.96, fontSize: 12.6, color: C.ink, lineSpacingMultiple: 1.16 }
  );

  addTakeaway(slide, "Se mide, se ataca, se incluye, y se exige un umbral para cada afirmación.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · Divisor del bloque 1

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Cuánto aguanta", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Una prueba de carga con el umbral fijado antes de medir, el punto donde el sistema deja de cumplir, y un defecto que ninguna medición de tiempo podía ver.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 1, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · El umbral antes de medir

function slideThresholdFirst() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la norma", "El umbral se fija antes de medir", "", false);

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.0,
    "Eficiencia de desempeño: capacidad de un producto de cumplir sus funciones dentro de parámetros especificados de tiempo y de rendimiento, y de usar los recursos de forma eficiente, en condiciones especificadas.",
    "ISO/IEC 25010:2023, cláusula 3.2 · traducción del original en inglés",
    AZUL
  );

  const w = (CW - 0.3) / 2;
  [
    ["Comportamiento temporal · 3.2.1", "Que el tiempo de respuesta y el rendimiento cumplan los requisitos."],
    ["Capacidad · 3.2.3", "Cumplir los límites máximos de un parámetro. Su nota pone de ejemplo los usuarios concurrentes: los que lo usan al mismo tiempo."],
  ].forEach(([titulo, glosa], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 3.04, w, 0.86, C.white);
    rect(slide, x, 3.04, 0.06, 0.86, AZUL);
    addKicker(slide, x + 0.24, 3.13, titulo, AZUL, w - 0.4);
    addText(slide, glosa, { x: x + 0.24, y: 3.38, w: w - 0.44, h: 0.48, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.08 });
  });

  addKicker(slide, M, 4.06, "Las dos dicen «especificados». Alguien tiene que haberlos escrito:", ROJO, 10);
  const filas = [
    ["Magnitud", "Tiempo de respuesta de la API y proporción de solicitudes fallidas"],
    ["Método", "Prueba de carga con 100 usuarios simulados durante 40 segundos, en la propia máquina"],
    ["Umbral", "El percentil 95 no supera 300 milisegundos, y ninguna solicitud falla"],
  ];
  filas.forEach(([pieza, valor], index) => {
    const y = 4.36 + index * 0.56;
    rect(slide, M, y, 2.0, 0.5, index === 2 ? ROJO : NAVY_CHIP);
    addText(slide, pieza.toUpperCase(), { x: M + 0.2, y: y + 0.12, w: 1.7, h: 0.26, fontSize: 10.4, bold: true, color: C.white, charSpacing: 1 });
    rect(slide, M + 2.06, y, CW - 2.06, 0.5, index === 2 ? C.warm : C.white);
    addText(slide, valor, { x: M + 2.3, y: y + 0.1, w: CW - 2.5, h: 0.3, fontSize: 12.4, bold: index === 2, color: C.ink, valign: "mid" });
  });

  addTakeaway(slide, "La norma no dice cuánto es rápido: exige que alguien lo haya dicho antes de medir.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · El percentil

function slidePercentile() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · cómo se lee un tiempo", "El promedio esconde a quien esperó", "", false);

  const x0 = M + 0.5;
  const base = 5.3;
  const alto = 2.9;
  const maximo = 2000;
  const tiempos = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2000];
  const ancho = 0.42;
  addKicker(slide, M, 1.94, "Once respuestas: diez de 5 milisegundos (ms) y una de 2 segundos", C.slate, 7);
  tiempos.forEach((ms, index) => {
    const h = Math.max((ms / maximo) * alto, 0.05);
    const x = x0 + index * (ancho + 0.12);
    rect(slide, x, base - h, ancho, h, ms > 100 ? ROJO : AZUL);
  });
  rule(slide, x0 - 0.1, base, 11 * (ancho + 0.12) + 0.1, C.ink, 1.2);
  const yProm = base - (186 / maximo) * alto;
  slide.addShape(SH.line, {
    x: x0 - 0.1,
    y: yProm,
    w: 11 * (ancho + 0.12) + 0.1,
    h: 0,
    line: { color: ORO, pt: 2, dashType: "dash" },
  });
  addText(slide, "Promedio: 186 ms. Un número que no le pasó a nadie.", {
    x: x0,
    y: yProm - 0.36,
    w: 5.4,
    h: 0.28,
    fontSize: 11.4,
    bold: true,
    color: ORO,
  });
  addText(slide, "Las respuestas, ordenadas de la más rápida a la más lenta", {
    x: x0 - 0.1,
    y: base + 0.08,
    w: 6.4,
    h: 0.22,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
  });

  const xd = M + 7.1;
  const wd = CW - 7.1;
  const percentiles = [
    ["p50", "La mediana", "El tiempo que no supera la mitad de las respuestas.", AZUL],
    ["p95", "El del umbral de hoy", "El que no supera el 95 %: de cada 100 respuestas, 95 llegan en ese tiempo o menos.", ROJO],
    ["p99", "Los casos más lentos", "El que no supera el 99 %.", ORO],
  ];
  percentiles.forEach(([sigla, titulo, glosa, color], index) => {
    const y = 1.94 + index * 1.14;
    rect(slide, xd, y, wd, 1.02, index === 1 ? C.warm : C.white);
    rect(slide, xd, y, 0.06, 1.02, color);
    addText(slide, sigla, {
      x: xd + 0.24,
      y: y + 0.16,
      w: 1.0,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color,
      valign: "mid",
    });
    addText(slide, titulo, { x: xd + 1.3, y: y + 0.12, w: wd - 1.46, h: 0.26, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 1.3, y: y + 0.42, w: wd - 1.46, h: 0.56, fontSize: 10.4, color: C.slate, lineSpacingMultiple: 1.08 });
  });

  addTakeaway(slide, "Un percentil dice cuánto esperó la gente. Un promedio mezcla a todos en un número que no le pasó a nadie.", {
    fontSize: 13,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · La prueba de carga con Locust

function slideLocustfile() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Locust", "Una prueba de carga son personas simuladas", "", false, {
    titleFontSize: 28,
  });

  codigo(slide, {
    x: M,
    y: 1.86,
    w: 7.5,
    lang: "python",
    fontSize: 8.8,
    title: "locustfile.py",
    marcas: [
      { linea: 6, color: C.gold, numero: 1 },
      { linea: 8, color: C.gold, numero: 2 },
      { linea: 22, color: ROJO, numero: 3 },
    ],
    code: [
      "import random",
      "",
      "from locust import HttpUser, between, task",
      "",
      "class PersonaQueReserva(HttpUser):",
      "    wait_time = between(1, 3)",
      "",
      "    @task(4)",
      "    def mirar_bloques(self):",
      '        self.client.get("/bloques")',
      "",
      "    @task(1)",
      "    def intentar_reservar(self):",
      "        n = random.randint(1, 10_000_000)",
      "        datos = {",
      '            "nombre": "Persona de prueba",',
      '            "rut": f"{n}-{n % 10}",',
      '            "correo_electronico": f"persona{n}@ejemplo.cl",',
      '            "bloque": random.randint(1, 8),',
      '            "personas": random.randint(1, 30),',
      "        }",
      '        with self.client.post("/reservas", json=datos, catch_response=True) as respuesta:',
      "            if respuesta.status_code in (201, 409):",
      "                respuesta.success()",
    ].join("\n"),
  });

  const xd = M + 7.8;
  const wd = CW - 7.8;
  const notas = [
    [0, AZUL, "Un usuario simulado", "HttpUser habla con la API por HTTP, el protocolo de las solicitudes web. self.client envía cada solicitud y mide cuánto tardó."],
    [1, C.gold, "Espera como una persona", "Entre una tarea y la siguiente, entre 1 y 3 segundos al azar."],
    [2, C.gold, "Tareas con peso", "Mira los bloques cuatro veces por cada intento de reserva, como alguien que revisa antes de reservar."],
    [3, ROJO, "Qué cuenta como falla", "Con ocho bloques, casi todos los intentos terminan en 409. Un rechazo por bloque tomado es la respuesta correcta, no una falla."],
  ];
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const y = 1.86 + index * 1.14;
    rect(slide, xd, y, wd, 1.04, C.white);
    rect(slide, xd, y, 0.06, 1.04, color === C.gold ? ORO : color);
    if (numero) circulo(slide, xd + 0.34, y + 0.28, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, titulo, { x: xd + (numero ? 0.6 : 0.24), y: y + 0.14, w: wd - 0.8, h: 0.26, fontSize: 11.6, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.24, y: y + 0.44, w: wd - 0.4, h: 0.56, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.06 });
  });
  addText(slide, "Nombre, RUT y correo salen de un número al azar: cada intento es de una persona distinta, y los datos no son de nadie.", {
    x: xd,
    y: 6.44,
    w: wd,
    h: 0.5,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · Resultados de la carga

function slideLoadResults() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la medición", "Con cien usuarios, el criterio se cumple", "", false);

  terminal(slide, {
    x: M,
    y: 1.86,
    w: CW,
    title: "Dos terminales: la API en una, Locust en la otra",
    fontSize: 10.2,
    lines: [
      { t: "uv run uvicorn api:app --host 127.0.0.1 --port 8000", k: "cmd" },
      { t: "uv run locust --headless -u 100 -r 20 -t 40s --host http://127.0.0.1:8000", k: "cmd" },
    ],
  });
  addText(slide, "-u usuarios simulados · -r cuántos se agregan por segundo · -t duración · --headless sin ventana. Cada ejecución con una cantidad de usuarios es una tanda.", {
    x: M,
    y: 2.96,
    w: CW,
    h: 0.24,
    fontSize: 10,
    italic: true,
    color: C.slate,
  });

  const tandas = [
    ["10", 5, 32, 64, 0, "5,0"],
    ["50", 5, 26, 100, 0, "24,5"],
    ["100", 5, 48, 76, 0, "48,4"],
    ["200", 6, 47, 81, 0, "89,9"],
  ];
  const x0 = M + 1.7;
  const anchoGrafico = 6.2;
  const maximo = 350;
  const escala = anchoGrafico / maximo;
  addText(slide, "USUARIOS", { x: M, y: 3.34, w: 1.5, h: 0.2, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "p95 DE CADA TANDA", { x: x0, y: 3.34, w: 3, h: 0.2, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "p50 · p99 · FALLAS · SOLICITUDES POR SEGUNDO", { x: x0 + anchoGrafico + 0.3, y: 3.34, w: 3.8, h: 0.2, fontSize: 8, bold: true, color: C.slate, charSpacing: 0.5 });
  tandas.forEach(([usuarios, p50, p95, p99, fallas, rps], index) => {
    const y = 3.66 + index * 0.56;
    const clave = usuarios === "100";
    if (clave) rect(slide, M - 0.06, y - 0.06, CW + 0.12, 0.54, C.warm);
    addText(slide, usuarios, { x: M, y: y + 0.04, w: 1.4, h: 0.34, fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: clave ? ROJO : C.ink, valign: "mid" });
    rect(slide, x0, y + 0.08, p95 * escala, 0.28, clave ? ROJO : AZUL);
    addText(slide, `${p95} ms`, { x: x0 + p95 * escala + 0.1, y: y + 0.08, w: 0.9, h: 0.28, fontSize: 11, bold: true, color: clave ? ROJO : C.ink, valign: "mid" });
    addText(slide, `${p50} ms · ${p99} ms · ${fallas} · ${rps}`, {
      x: x0 + anchoGrafico + 0.3,
      y: y + 0.08,
      w: 3.5,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      color: C.ink,
      valign: "mid",
    });
  });
  const xUmbral = x0 + 300 * escala;
  slide.addShape(SH.line, { x: xUmbral, y: 3.56, w: 0, h: 2.3, line: { color: C.red, pt: 2, dashType: "dash" } });
  addText(slide, "umbral: 300 ms", { x: xUmbral - 1.4, y: 5.86, w: 1.36, h: 0.22, fontSize: 9.4, bold: true, color: C.red, align: "right" });

  addTakeaway(slide, "Cien usuarios producen unas 50 solicitudes por segundo: cada uno espera entre 1 y 3 segundos.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · Carga, estres y escalabilidad

function slideStress() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · más allá de lo previsto", "Carga, estrés y escalabilidad", "", false);

  const w = (CW - 0.28) / 3;
  [
    ["Carga", "Evalúa el comportamiento entre las cargas previstas: uso bajo, típico y máximo.", AZUL],
    ["Estrés", "Evalúa el sistema en el límite de la carga prevista o más allá, o con menos recursos.", ROJO],
    ["Escalabilidad", "Pregunta si, con más recursos, el sistema aguanta proporcionalmente más.", VERDE],
  ].forEach(([nombre, glosa, color], index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 1.88, w, 1.02, C.white);
    rect(slide, x, 1.88, w, 0.06, color);
    addText(slide, nombre, { x: x + 0.22, y: 2.02, w: w - 0.4, h: 0.28, fontSize: 13, bold: true, color });
    addText(slide, glosa, { x: x + 0.22, y: 2.32, w: w - 0.4, h: 0.54, fontSize: 10.2, color: C.ink, lineSpacingMultiple: 1.06 });
  });
  addFuente(slide, 3.0, "Glosario de ISTQB, versión 3.7 · definiciones traducidas del original en inglés", { w: 8 });

  const niveles = [
    ["500", 160, 238.8, "0"],
    ["1.000", 1600, 319.2, "0"],
    ["2.000", 3300, 302.4, "252"],
  ];
  const wg = (CW - 0.5) / 2;
  const xa = M;
  const xb = M + wg + 0.5;
  addKicker(slide, xa, 3.36, "p95 · con el umbral de 300 ms", ROJO, wg);
  addKicker(slide, xb, 3.36, "Solicitudes por segundo", AZUL, wg);
  const escalaA = (wg - 2.2) / 3300;
  const escalaB = (wg - 2.2) / 350;
  niveles.forEach(([usuarios, p95, rps, fallas], index) => {
    const y = 3.7 + index * 0.62;
    addText(slide, usuarios, { x: xa, y: y + 0.06, w: 0.9, h: 0.3, fontSize: 12.4, bold: true, color: C.ink, valign: "mid" });
    rect(slide, xa + 0.95, y + 0.08, Math.max(p95 * escalaA, 0.05), 0.28, p95 > 300 ? ROJO : AZUL);
    addText(slide, `${p95.toLocaleString("es-CL")} ms`, { x: xa + 1.0 + Math.max(p95, 300) * escalaA, y: y + 0.08, w: 1.2, h: 0.28, fontSize: 10.6, bold: true, color: p95 > 300 ? ROJO : C.ink, valign: "mid" });
    addText(slide, usuarios, { x: xb, y: y + 0.06, w: 0.9, h: 0.3, fontSize: 12.4, bold: true, color: C.ink, valign: "mid" });
    rect(slide, xb + 0.95, y + 0.08, rps * escalaB, 0.28, AZUL);
    addText(slide, `${String(rps).replace(".", ",")}${fallas !== "0" ? ` · ${fallas} fallas` : ""}`, {
      x: xb + 1.0 + rps * escalaB,
      y: y + 0.08,
      w: 1.5,
      h: 0.28,
      fontSize: 10.6,
      bold: true,
      color: fallas !== "0" ? ROJO : C.ink,
      valign: "mid",
    });
  });
  slide.addShape(SH.line, {
    x: xa + 0.95 + 300 * escalaA,
    y: 3.62,
    w: 0,
    h: 1.9,
    line: { color: C.red, pt: 1.6, dashType: "dash" },
  });
  addText(slide, "Locust y la API corrieron en el mismo computador, con un procesador de cuatro núcleos: el punto de quiebre vale para esas condiciones.", {
    x: M,
    y: 5.62,
    w: CW,
    h: 0.28,
    fontSize: 10.6,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "La capacidad aparece cuando las solicitudes por segundo dejan de crecer y lo que sobra se vuelve espera.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · Lo que la carga no miro

function slideWhatLoadMissed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · lo que la carga no miró", "Cero fallas, y dos personas con el mismo bloque", "", false, {
    titleFontSize: 27,
  });

  const w = (CW - 0.4) / 2;
  addKicker(slide, M, 1.94, "Lo que informó Locust", VERDE, w);
  [
    ["Tanda de 50 usuarios", "971 solicitudes · 0 fallas · p95 26 ms"],
    ["Tanda de 100 usuarios", "1.912 solicitudes · 0 fallas · p95 48 ms"],
  ].forEach(([titulo, dato], index) => {
    const y = 2.26 + index * 1.08;
    rect(slide, M, y, w, 0.94, C.white);
    rect(slide, M, y, 0.06, 0.94, VERDE);
    addText(slide, titulo, { x: M + 0.26, y: y + 0.12, w: w - 0.4, h: 0.26, fontSize: 11.4, bold: true, color: C.ink });
    addText(slide, dato, { x: M + 0.26, y: y + 0.46, w: w - 0.4, h: 0.32, fontFace: TYPOGRAPHY.mono, fontSize: 11.6, bold: true, color: VERDE });
  });

  const xd = M + w + 0.4;
  addKicker(slide, xd, 1.94, "Lo que quedó en la base después de cada tanda", ROJO, w);
  [
    ["Después de la de 50", 4],
    ["Después de la de 100", 1],
  ].forEach(([titulo, duplicado], index) => {
    const y = 2.26 + index * 1.08;
    rect(slide, xd, y, w, 0.94, C.warm);
    addText(slide, titulo, { x: xd + 0.2, y: y + 0.08, w: w - 0.4, h: 0.22, fontSize: 10, bold: true, color: C.slate });
    const wc = (w - 0.4 - 0.07 * 7) / 8;
    for (let b = 1; b <= 8; b += 1) {
      const x = xd + 0.2 + (b - 1) * (wc + 0.07);
      const doble = b === duplicado;
      rect(slide, x, y + 0.36, wc, 0.46, doble ? ROJO : C.slate);
      addText(slide, String(b), {
        x: x + 0.02,
        y: y + 0.4,
        w: wc - 0.04,
        h: 0.38,
        fontSize: 10.4,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
      });
    }
  });
  addText(slide, "Cada ficha es un bloque. En rojo, el que quedó con dos reservas.", {
    x: xd,
    y: 4.44,
    w: w,
    h: 0.24,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  rect(slide, M, 4.84, CW, 1.1, NAVY_CHIP);
  addText(
    slide,
    "No es un error de la herramienta. Una prueba de carga mide cuánto tarda una respuesta y si llegó, no si lo que el sistema hizo fue correcto. Las dos respuestas fueron 201, rápidas y bien formadas.",
    { x: M + 0.34, y: 4.92, w: CW - 0.68, h: 0.94, fontSize: 12.6, color: C.white, valign: "mid", lineSpacingMultiple: 1.14 }
  );

  addTakeaway(slide, "Que no debieran haber sido las dos 201 es algo que ninguna medición de tiempo puede ver.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · La condicion de carrera

function slideRaceCondition() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · reproducirlo", "Veinte reservas del mismo bloque a la vez", "", false, {
    titleFontSize: 27,
  });

  const guardadas = [1, 3, 2, 2, 5, 3, 9, 1, 2, 7];
  const x0 = M + 0.3;
  const base = 5.0;
  const escala = 2.5 / 9;
  const ancho = 0.42;
  addKicker(slide, M, 1.94, "Reservas guardadas del mismo bloque, en diez ejecuciones", ROJO, 6.2);
  guardadas.forEach((n, index) => {
    const x = x0 + index * (ancho + 0.14);
    const h = n * escala;
    rect(slide, x, base - h, ancho, h, n > 1 ? ROJO : VERDE);
    addText(slide, String(n), { x: x - 0.04, y: base - h - 0.28, w: ancho + 0.08, h: 0.24, fontSize: 11, bold: true, color: n > 1 ? ROJO : VERDE, align: "center" });
  });
  rule(slide, x0 - 0.1, base, 10 * (ancho + 0.14), C.ink, 1.2);
  slide.addShape(SH.line, {
    x: x0 - 0.1,
    y: base - escala,
    w: 10 * (ancho + 0.14),
    h: 0,
    line: { color: VERDE, pt: 1.6, dashType: "dash" },
  });
  addText(slide, "correcto: 1", { x: x0 + 10 * (ancho + 0.14), y: base - escala - 0.11, w: 0.9, h: 0.22, fontSize: 8.6, bold: true, color: VERDE });
  addText(slide, "Más de una en 8 de 10. Con solo dos simultáneas: 1 de 10.", {
    x: M,
    y: 5.14,
    w: 6.4,
    h: 0.5,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  const xd = M + 6.9;
  const wd = CW - 6.9;
  addKicker(slide, xd, 1.94, "Por qué pasa · dos solicitudes, A y B", AZUL, wd);
  const pasos = [
    ["A", "¿Está tomado el bloque 4?", "libre", AZUL],
    ["B", "¿Está tomado el bloque 4?", "libre", ORO],
    ["A", "Guarda la reserva", "201", AZUL],
    ["B", "Guarda la reserva", "201", ORO],
  ];
  pasos.forEach(([quien, accion, resultado, color], index) => {
    const y = 2.26 + index * 0.5;
    circulo(slide, xd + 0.22, y + 0.2, 0.34, color, quien, C.white, 10.4);
    rect(slide, xd + 0.5, y, wd - 0.5, 0.4, index < 2 ? C.white : C.warm);
    addText(slide, accion, { x: xd + 0.66, y: y + 0.06, w: wd - 1.8, h: 0.28, fontSize: 11, color: C.ink, valign: "mid" });
    addText(slide, resultado, { x: xd + wd - 1.0, y: y + 0.06, w: 0.86, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 11, bold: true, color: index < 2 ? VERDE : ROJO, align: "right", valign: "mid" });
  });
  rect(slide, xd, 4.36, wd, 1.28, NAVY_CHIP);
  addText(slide, "CONDICIÓN DE CARRERA", { x: xd + 0.24, y: 4.48, w: wd - 0.4, h: 0.22, fontSize: 9.6, bold: true, color: C.gold, charSpacing: 1.2 });
  addText(slide, "El código primero pregunta y después escribe. Si dos solicitudes llegan juntas, las dos preguntan antes de que cualquiera escriba. El resultado depende de cuál llega primero a cada paso.", {
    x: xd + 0.24,
    y: 4.74,
    w: wd - 0.44,
    h: 0.86,
    fontSize: 10.4,
    color: C.white,
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(slide, "Un defecto funcional que solo aparece bajo una condición no funcional: varias personas al mismo tiempo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 15 · La prueba que lo captura

function slideConcurrencyTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la prueba", "Veinte hilos, y una sola reserva aceptada", "", false);

  const wl = 5.55;
  const helper = codigo(slide, {
    x: M,
    y: 1.86,
    w: wl,
    lang: "python",
    fontSize: 8.6,
    title: "Cada hilo envía una reserva",
    code: [
      "def reservar_bloque_4(i: int) -> int:",
      "    solicitud = {",
      '        "nombre": f"Persona {i}",',
      '        "rut": f"{10_000_000 + i}-{i % 10}",',
      '        "correo_electronico": f"persona{i}@ejemplo.cl",',
      '        "bloque": 4,',
      '        "personas": 5,',
      "    }",
      '    return TestClient(app).post("/reservas", json=solicitud).status_code',
    ].join("\n"),
  });

  const xr = M + wl + 0.2;
  const wr = CW - wl - 0.2;
  codigo(slide, {
    x: xr,
    y: 1.86,
    w: wr,
    lang: "python",
    fontSize: 8.6,
    title: "La prueba",
    marcas: [
      { linea: 4, color: C.gold, numero: 1 },
      { linea: 12, color: VERDE, numero: 2 },
    ],
    code: [
      "def test_reservas_simultaneas_del_mismo_bloque_aceptan_una_sola(",
      "    base_de_datos_de_prueba: Path,",
      ") -> None:",
      "    with ThreadPoolExecutor(max_workers=PERSONAS) as grupo:",
      "        codigos = list(grupo.map(reservar_bloque_4, range(PERSONAS)))",
      "",
      "    with closing(sqlite3.connect(base_de_datos_de_prueba)) as conexion:",
      "        guardadas = conexion.execute(",
      '            "SELECT COUNT(*) FROM reservas WHERE bloque = 4"',
      "        ).fetchone()[0]",
      "",
      "    assert codigos.count(201) == 1",
      "    assert guardadas == 1",
    ].join("\n"),
  });

  const y = 1.86 + helper.h + 0.14;
  const notas = [
    ["TestClient(app)", "Envía solicitudes a la API sin levantar un servidor."],
    ["ThreadPoolExecutor", "Crea hilos, partes del programa que corren a la vez. PERSONAS vale 20."],
    ["grupo.map", "Llama a reservar_bloque_4 con 0, 1… hasta 19, repartido entre los hilos."],
    ["base_de_datos_de_prueba", "Una fixture: pytest la ejecuta antes de la prueba; da una base vacía y la borra al final."],
    ["closing(...)", "Abre la base para contar y la cierra al terminar."],
  ];
  notas.forEach(([pieza, glosa], index) => {
    const yy = y + index * 0.38;
    addText(slide, pieza, { x: M, y: yy, w: 1.86, h: 0.22, fontFace: TYPOGRAPHY.mono, fontSize: 8.4, bold: true, color: AZUL });
    addText(slide, glosa, { x: M + 1.92, y: yy, w: wl - 1.92, h: 0.36, fontSize: 8.8, color: C.ink, lineSpacingMultiple: 1.02 });
  });

  terminal(slide, {
    x: xr,
    y: 4.9,
    w: wr,
    title: "Contra el sistema tal como está",
    fontSize: 10,
    lines: [
      { t: "E       assert 4 == 1", k: "err" },
      { t: "1 failed, 1 warning in 0.86s", k: "err" },
    ],
  });

  addTakeaway(slide, "Repetida diez veces, falló las diez: el sistema aceptó entre 3 y 9 reservas del mismo bloque.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 16 · La correccion

function slideTheFix() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la corrección", "Preguntar y escribir como una sola operación", "", false, {
    titleFontSize: 28,
  });

  const wl = 6.2;
  codigo(slide, {
    x: M,
    y: 1.9,
    w: wl,
    lang: "python",
    fontSize: 10.4,
    title: "api.py · al comienzo de crear_reserva, la función que recibe cada reserva",
    marcas: [{ linea: 3, color: VERDE, numero: 1 }],
    code: [
      "conexion = almacen.conectar()",
      "try:",
      '    conexion.execute("BEGIN IMMEDIATE")',
      "    tomado = almacen.bloque_tomado(conexion, solicitud.bloque)",
    ].join("\n"),
  });
  addText(slide, "Una transacción agrupa varias operaciones de la base para que ocurran como una sola, sin que otra conexión se meta entre ellas.", {
    x: M,
    y: 3.5,
    w: wl,
    h: 0.6,
    fontSize: 11.2,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  addQuote(
    slide,
    xd,
    1.9,
    wd,
    2.22,
    "IMMEDIATE hace que la conexión empiece una escritura de inmediato, sin esperar a que aparezca una instrucción de escritura. Puede fallar con SQLITE_BUSY si otra conexión ya tiene una escritura en curso.",
    "SQLite, BEGIN TRANSACTION · traducción del original en inglés",
    AZUL
  );

  rect(slide, M, 4.3, CW, 0.8, C.warm);
  rect(slide, M, 4.3, 0.06, 0.8, ORO);
  addText(slide, "SQLITE_BUSY es el aviso de que la base está ocupada. En la práctica, la segunda solicitud espera su turno: la conexión de Python a SQLite reintenta durante 5 segundos. Cuando le toca, la primera ya escribió, y «¿está tomado?» recibe la respuesta verdadera.", {
    x: M + 0.3,
    y: 4.36,
    w: CW - 0.6,
    h: 0.68,
    fontSize: 10.8,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });

  const resultados = [
    ["La prueba, diez veces", "10 de 10 en verde"],
    ["La suite completa", "21 passed, 1 warning"],
    ["Veinte simultáneas", "1 reserva, diez de diez"],
  ];
  const w = (CW - 0.28) / 3;
  resultados.forEach(([titulo, dato], index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 5.24, w, 0.8, C.white);
    rect(slide, x, 5.24, w, 0.06, VERDE);
    addText(slide, titulo, { x: x + 0.22, y: 5.36, w: w - 0.4, h: 0.22, fontSize: 10, bold: true, color: C.slate });
    addText(slide, dato, { x: x + 0.22, y: 5.6, w: w - 0.4, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 12, bold: true, color: VERDE });
  });

  addTakeaway(slide, "Una línea corrige el defecto. Y la prueba que falló diez de diez queda en la suite para siempre.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 17 · Una medicion no se cree hasta repetirla

function slideRepeatMeasure() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la pregunta honesta", "¿Cuesta tiempo que las escrituras esperen?", "", false, {
    titleFontSize: 28,
  });

  addText(slide, "La primera tanda con la corrección dio un p95 de 200 ms para las reservas, contra 11 ms sin ella. Parecía un costo claro. Se repitió cada versión tres veces, con 100 usuarios:", {
    x: M,
    y: 1.9,
    w: CW,
    h: 0.6,
    fontSize: 12.2,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  const grupos = [
    ["Sin la corrección", [14, 9, 7], AZUL],
    ["Con la corrección", [160, 19, 17], VERDE],
  ];
  const escala = 3.8 / 200;
  grupos.forEach(([nombre, valores, color], g) => {
    const y0 = 2.78 + g * 1.5;
    addKicker(slide, M, y0, nombre, color, 3);
    valores.forEach((ms, i) => {
      const y = y0 + 0.3 + i * 0.36;
      addText(slide, `Ejecución ${i + 1}`, { x: M, y, w: 1.4, h: 0.28, fontSize: 10, color: C.slate, valign: "mid" });
      rect(slide, M + 1.5, y + 0.04, Math.max(ms * escala, 0.05), 0.22, color);
      addText(slide, `${ms} ms`, { x: M + 1.6 + ms * escala, y, w: 0.9, h: 0.28, fontSize: 10.4, bold: true, color: C.ink, valign: "mid" });
    });
  });

  const xd = M + 7.0;
  const wd = CW - 7.0;
  rect(slide, xd, 2.78, wd, 1.2, C.white);
  rect(slide, xd, 2.78, 0.06, 1.2, AZUL);
  addText(slide, "La mediana, igual en las seis", { x: xd + 0.26, y: 2.9, w: wd - 0.4, h: 0.26, fontSize: 12, bold: true, color: AZUL });
  addText(slide, "3 o 4 ms en todas. El p95 varía entre ejecuciones, y una sola corrida de 160 ms no alcanza para hablar de un costo.", {
    x: xd + 0.26,
    y: 3.2,
    w: wd - 0.44,
    h: 0.72,
    fontSize: 10.8,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  rect(slide, xd, 4.14, wd, 1.6, NAVY_CHIP);
  addText(slide, "Con estos datos no se puede afirmar un costo.", { x: xd + 0.26, y: 4.26, w: wd - 0.4, h: 0.3, fontSize: 12.4, bold: true, color: C.gold });
  addText(slide, "Es la lección de las pruebas inestables —las que pasan y fallan sin que el sistema cambie—, ahora aplicada a una medición: una ejecución aislada no distingue un efecto de la variación normal.", {
    x: xd + 0.26,
    y: 4.62,
    w: wd - 0.44,
    h: 1.04,
    fontSize: 10.8,
    color: C.white,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Un resultado se cree cuando se repite.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 y 19 · Preguntas y respuestas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de atacar", [
    [
      "La prueba de carga con 100 usuarios dio cero fallas y un p95 de 48 ms, y en esa misma tanda dos personas quedaron con el mismo bloque. ¿La prueba de carga estaba mal hecha?",
      "Revisa qué mide Locust de cada respuesta. ¿Qué tendría que haberle dicho alguien para que la doble reserva contara como falla?",
    ],
    [
      "Con 1.000 usuarios, el p95 fue 1.600 ms en esta máquina. Un compañero escribe en el informe que «el sistema soporta hasta 500 usuarios». ¿Qué le falta a esa frase?",
      "Mira dónde corrieron Locust y la API. ¿Sería el mismo número en el servidor donde va a funcionar el sistema?",
    ],
    [
      "La primera medición con la corrección mostró que las reservas tardaban más, y las siguientes no. ¿Qué habría pasado si se hubiera informado solo la primera?",
      "Compara las seis ejecuciones. ¿Qué habría decidido alguien que leyó un solo número?",
    ],
  ]);
}

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "No estaba mal hecha",
      "Mide cuánto tarda y si llegó la respuesta; no sabe que dos 201 para el mismo bloque son un error.",
      "Para que la doble reserva cuente como falla, alguien tiene que escribir esa regla.",
      "Leer cero fallas de carga como cero defectos.",
    ],
    [
      "Le faltan las condiciones",
      "El número vale para esa máquina, con Locust corriendo en el mismo computador.",
      "Un límite sin condiciones declaradas no se puede comparar con nada.",
      "Informar un número de otro entorno como si fuera el del servidor real.",
    ],
    [
      "Un costo que no existe",
      "Primero 200 ms; al repetir, 160, 19 y 17, con la mediana inmóvil en 3 o 4 ms.",
      "Una ejecución aislada no distingue un efecto de la variación normal.",
      "Decidir con un solo número.",
    ],
  ]);
}


// ---------------------------------------------------------------------------
// 20 · Divisor del bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "A quién deja entrar", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Pruebas donde actúa alguien que intenta lo que no debería, herramientas que revisan el código y sus dependencias, y lo que exige la ley a quien guarda datos de personas.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 2, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · La seguridad en la norma y en la industria

function slideSecuritySources() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la norma y la industria", "Lo que la norma nombra, y lo que más falla", "", false, {
    titleFontSize: 28,
  });

  const wl = 4.5;
  addKicker(slide, M, 1.9, "Seguridad · ISO/IEC 25010:2023", AZUL, wl);
  const sub = [
    ["Confidencialidad", "que los datos solo los vea quien está autorizado", true],
    ["Integridad", "datos sin alteraciones", false],
    ["No repudio", "nadie niega lo que hizo", false],
    ["Responsabilidad", "cada acción tiene autor", false],
    ["Autenticidad", "que el sistema compruebe que alguien es quien dice ser", true],
    ["Resistencia", "agregada en 2023", false],
  ];
  let y = 2.22;
  sub.forEach(([nombre, glosa, clave]) => {
    const h = clave ? 0.74 : 0.4;
    rect(slide, M, y, wl, h - 0.06, clave ? C.warm : C.white);
    rect(slide, M, y, 0.06, h - 0.06, clave ? ROJO : C.border);
    addText(slide, nombre, { x: M + 0.24, y: y + 0.06, w: clave ? wl - 0.4 : 1.7, h: 0.24, fontSize: 11.6, bold: true, color: clave ? C.ink : C.slate });
    if (glosa) {
      addText(slide, glosa, {
        x: clave ? M + 0.24 : M + 2.0,
        y: clave ? y + 0.34 : y + 0.07,
        w: clave ? wl - 0.4 : wl - 2.2,
        h: 0.24,
        fontSize: 9.8,
        italic: !clave,
        color: C.slate,
      });
    }
    y += h;
  });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  addKicker(slide, xd, 1.9, "OWASP Top 10:2025 · los riesgos más frecuentes en la web", ROJO, wd);
  const owasp = [
    ["A01", "Control de acceso defectuoso", ""],
    ["A02", "Configuración de seguridad incorrecta", ""],
    ["A03", "Fallas en la cadena de suministro de software", "pip-audit"],
    ["A04", "Fallas criptográficas", ""],
    ["A05", "Inyección", "prueba y bandit"],
    ["A06", "Diseño inseguro", ""],
    ["A07", "Fallas de autenticación", "suplantación"],
    ["A08", "Fallas de integridad del software o de los datos", ""],
    ["A09", "Fallas de registro y alerta de seguridad", ""],
    ["A10", "Manejo incorrecto de condiciones excepcionales", ""],
  ];
  owasp.forEach(([codigoOwasp, nombre, hoy], index) => {
    const yy = 2.22 + index * 0.38;
    const marcado = hoy !== "";
    rect(slide, xd, yy, wd, 0.33, marcado ? C.warm : C.white);
    rect(slide, xd, yy, 0.62, 0.33, marcado ? ROJO : NAVY_CHIP);
    addText(slide, codigoOwasp, { x: xd, y: yy + 0.04, w: 0.62, h: 0.25, fontSize: 10, bold: true, color: C.white, align: "center", valign: "mid" });
    addText(slide, nombre, { x: xd + 0.78, y: yy + 0.04, w: wd - 2.6, h: 0.25, fontSize: 10.6, bold: marcado, color: marcado ? C.ink : C.slate, valign: "mid" });
    if (marcado) {
      addText(slide, `hoy: ${hoy}`, { x: xd + wd - 1.8, y: yy + 0.04, w: 1.66, h: 0.25, fontSize: 9.4, bold: true, color: ROJO, align: "right", valign: "mid" });
    }
  });
  addText(slide, "OWASP es una fundación abierta; su lista se construye con datos de aplicaciones reales.", { x: xd, y: 6.04, w: wd, h: 0.24, fontSize: 9.4, italic: true, color: C.slate });

  addTakeaway(slide, "La norma dice qué cuidar. OWASP dice dónde falla más seguido.", { y: 6.42, h: 0.46 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · La seguridad en la ley

function slideSecurityLaw() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la ley", "Guardar un RUT es tratar datos personales", "", false, {
    titleFontSize: 28,
  });

  const campos = [
    ["nombre", "Ana Pérez"],
    ["rut", "11.111.111-1"],
    ["correo_electronico", "ana@ejemplo.cl"],
    ["bloque", "4"],
  ];
  const wl = 4.3;
  addKicker(slide, M, 1.94, "Una fila de la tabla reservas", AZUL, wl);
  campos.forEach(([campo, valor], index) => {
    const y = 2.28 + index * 0.52;
    const personal = index < 3;
    rect(slide, M, y, 1.9, 0.44, NAVY_CHIP);
    addText(slide, campo, { x: M + 0.14, y: y + 0.08, w: 1.7, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 10, color: C.white, valign: "mid" });
    rect(slide, M + 1.94, y, wl - 1.94, 0.44, personal ? C.warm : C.white);
    addText(slide, valor, { x: M + 2.1, y: y + 0.08, w: wl - 2.3, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, bold: personal, color: personal ? ROJO : C.slate, valign: "mid" });
  });
  addText(slide, "En rojo, los datos que identifican a una persona.", { x: M, y: 4.4, w: wl, h: 0.24, fontSize: 9.8, italic: true, color: C.slate });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  addQuote(
    slide,
    xd,
    1.94,
    wd,
    1.9,
    "f) Principio de seguridad. En el tratamiento de los datos personales, el responsable debe garantizar estándares adecuados de seguridad, protegiéndolos contra el tratamiento no autorizado o ilícito, y contra su pérdida, filtración, daño accidental o destrucción.",
    "Ley 21.719, artículo 3°, letra f",
    ROJO
  );
  rect(slide, xd, 4.0, wd, 0.66, C.white);
  rect(slide, xd, 4.0, 0.06, 0.66, AZUL);
  addText(slide, "Responsable: quien decide para qué y cómo se tratan los datos. Aquí, la institución que opera el sistema de reservas.", {
    x: xd + 0.24,
    y: 4.06,
    w: wd - 0.4,
    h: 0.54,
    fontSize: 10.8,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.08,
  });

  rect(slide, M, 4.9, CW, 1.0, NAVY_CHIP);
  addText(slide, "Tres fuentes, una misma pregunta: ¿puede alguien ver, cambiar o usar lo que no le corresponde? Hoy se contesta con pruebas, con herramientas y, al final, con lo que la ley pide cuando la respuesta es sí.", {
    x: M + 0.34,
    y: 4.98,
    w: CW - 0.68,
    h: 0.84,
    fontSize: 12.2,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "La seguridad no es solo una característica de calidad: es una obligación legal.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · Quien actua

function slideWhoActs() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la prueba de seguridad", "Cambia quién actúa", "", false);

  const pasos = ["Prepara", "Actúa", "Afirma"];
  const filas = [
    ["Prueba funcional", VERDE, ["Una base vacía", "Ana reserva el bloque 4, como corresponde", "El sistema acepta: 201"]],
    ["Prueba de seguridad", ROJO, ["Una base vacía", "Alguien intenta lo que no debería poder hacer", "El sistema no lo permite"]],
  ];
  const x0 = M + 2.3;
  const wc = (CW - 2.3 - 0.4) / 3;
  pasos.forEach((paso, index) => {
    addKicker(slide, x0 + index * (wc + 0.2), 1.94, paso, C.slate, wc);
  });
  filas.forEach(([nombre, color, celdas], f) => {
    const y = 2.3 + f * 1.3;
    rect(slide, M, y, 2.14, 1.1, color);
    addText(slide, nombre, { x: M + 0.18, y: y + 0.1, w: 1.8, h: 0.9, fontSize: 13, bold: true, color: C.white, valign: "mid" });
    celdas.forEach((texto, c) => {
      const x = x0 + c * (wc + 0.2);
      const distinto = f === 1 && c === 1;
      rect(slide, x, y, wc, 1.1, distinto ? C.warm : C.white);
      if (distinto) rect(slide, x, y, wc, 0.06, ROJO);
      addText(slide, texto, { x: x + 0.2, y: y + 0.12, w: wc - 0.4, h: 0.86, fontSize: 12.2, bold: distinto, color: C.ink, valign: "mid", lineSpacingMultiple: 1.08 });
      if (c < 2) arrow(slide, x + wc + 0.02, y + 0.55, 0.16, C.slate);
    });
  });

  addText(slide, "Hoy se prueban dos intentos:", { x: M, y: 5.02, w: 4, h: 0.26, fontSize: 12, bold: true, color: C.ink });
  const intentos = [
    ["Inyección", "escribir código SQL donde va un nombre"],
    ["Suplantación", "reservar con el RUT de otra persona"],
  ];
  const wi = (CW - 0.2) / 2;
  intentos.forEach(([nombre, glosa], index) => {
    const x = M + index * (wi + 0.2);
    rect(slide, x, 5.36, wi, 0.56, C.warm);
    rect(slide, x, 5.36, 0.06, 0.56, ROJO);
    addText(slide, nombre, { x: x + 0.24, y: 5.44, w: 1.8, h: 0.4, fontSize: 12.6, bold: true, color: ROJO, valign: "mid" });
    addText(slide, glosa, { x: x + 2.0, y: 5.44, w: wi - 2.2, h: 0.4, fontSize: 11.6, color: C.ink, valign: "mid" });
  });

  addTakeaway(slide, "Se escribe igual que cualquier prueba. Lo que cambia es la intención de quien actúa.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24 · La prueba de inyeccion

function slideInjectionTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · primer intento", "Un nombre que es código SQL", "", false);

  const bloqueCodigo = codigo(slide, {
    x: M,
    y: 1.86,
    w: CW,
    lang: "python",
    fontSize: 9.8,
    title: "test_seguridad.py",
    marcas: [
      { linea: 2, color: C.gold, numero: 1 },
      { linea: 8, color: VERDE, numero: 2 },
    ],
    code: [
      "def test_un_nombre_con_codigo_sql_se_guarda_como_texto(base_de_datos_de_prueba: Path) -> None:",
      "    nombre = \"x'); DROP TABLE reservas; --\"",
      "",
      '    respuesta = cliente.post("/reservas", json=ANA | {"nombre": nombre, "bloque": 4})',
      "",
      "    assert respuesta.status_code == 201",
      "    with closing(sqlite3.connect(base_de_datos_de_prueba)) as conexion:",
      '        guardado = conexion.execute("SELECT nombre FROM reservas WHERE bloque = 4").fetchone()',
      "    assert guardado == (nombre,)",
    ].join("\n"),
  });

  const y = 1.86 + bloqueCodigo.h + 0.2;
  const w = (CW - 0.3) / 2;
  addKicker(slide, M, y, "1 · Si el nombre se pegara en la instrucción", ROJO, w);
  rect(slide, M, y + 0.3, w, 1.02, C.terminalBg);
  addText(slide, "INSERT INTO reservas (nombre) VALUES ('", { x: M + 0.2, y: y + 0.38, w: 2.98, h: 0.4, fontFace: TYPOGRAPHY.mono, fontSize: 10, color: C.terminalOutput, valign: "mid" });
  addText(slide, "x'); DROP TABLE reservas; --')", { x: M + 3.18, y: y + 0.38, w: w - 3.5, h: 0.4, fontFace: TYPOGRAPHY.mono, fontSize: 10, bold: true, color: C.gold, valign: "mid" });
  addText(slide, "El apóstrofo cierra el nombre, DROP TABLE borra la tabla, y -- convierte el resto en comentario.", {
    x: M + 0.2,
    y: y + 0.8,
    w: w - 0.4,
    h: 0.46,
    fontSize: 9.6,
    color: C.sand,
    lineSpacingMultiple: 1.05,
  });

  const xd = M + w + 0.3;
  addKicker(slide, xd, y, "2 · Lo que la prueba afirma", VERDE, w);
  rect(slide, xd, y + 0.3, w, 1.02, C.white);
  rect(slide, xd, y + 0.3, 0.06, 1.02, VERDE);
  addText(slide, "Que el sistema lo trate como lo que es: un nombre raro. Se acepta, y queda guardado tal cual, letra por letra.", {
    x: xd + 0.26,
    y: y + 0.38,
    w: w - 0.44,
    h: 0.86,
    fontSize: 11.8,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });
  addText(slide, "cliente es el cliente de pruebas de la API. ANA es un diccionario con los datos de Ana; ANA | {...} crea una copia con algunos campos reemplazados.", {
    x: M,
    y: y + 1.44,
    w: CW,
    h: 0.24,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 25 · La prueba de suplantacion

function slideImpersonationTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · segundo intento", "Tres reservas con el RUT de Ana", "", false);

  const bloqueCodigo = codigo(slide, {
    x: M,
    y: 1.86,
    w: CW,
    lang: "python",
    fontSize: 9.8,
    title: "test_seguridad.py",
    marcas: [
      { linea: 2, color: C.gold, numero: 1 },
      { linea: 8, color: VERDE, numero: 2 },
    ],
    code: [
      "def test_otra_persona_no_puede_agotar_la_cuota_de_ana(base_de_datos_de_prueba: Path) -> None:",
      '    otra_persona = ANA | {"nombre": "Otra persona", "correo_electronico": "otra@ejemplo.cl"}',
      "    for bloque in (1, 3, 5):",
      '        cliente.post("/reservas", json=otra_persona | {"bloque": bloque})',
      "",
      '    respuesta = cliente.post("/reservas", json=ANA | {"bloque": 7})',
      "",
      "    assert respuesta.status_code == 201",
    ].join("\n"),
  });

  const y = 1.86 + bloqueCodigo.h + 0.26;
  addKicker(slide, M, y, "1 · Otra persona, con su propio nombre y correo, pero el RUT de Ana", C.slate, 9);
  const eventos = [
    ["Bloque 1", "11.111.111-1", "Otra persona", ORO],
    ["Bloque 3", "11.111.111-1", "Otra persona", ORO],
    ["Bloque 5", "11.111.111-1", "Otra persona", ORO],
    ["Bloque 7", "11.111.111-1", "Ana", AZUL],
  ];
  const wc = (CW - 0.3 * 3) / 4;
  eventos.forEach(([bloque, rut, quien, color], index) => {
    const x = M + index * (wc + 0.3);
    const ana = index === 3;
    rect(slide, x, y + 0.32, wc, 1.0, ana ? C.warm : C.white);
    rect(slide, x, y + 0.32, wc, 0.06, color);
    addText(slide, quien, { x: x + 0.2, y: y + 0.44, w: wc - 0.4, h: 0.26, fontSize: 12, bold: true, color });
    addText(slide, `${bloque} · RUT ${rut}`, { x: x + 0.2, y: y + 0.74, w: wc - 0.4, h: 0.22, fontFace: TYPOGRAPHY.mono, fontSize: 9.4, color: C.ink });
    addText(slide, ana ? "2 · La prueba espera 201" : "201: aceptada", {
      x: x + 0.2,
      y: y + 1.0,
      w: wc - 0.4,
      h: 0.24,
      fontSize: 10.2,
      bold: true,
      color: ana ? VERDE : C.slate,
    });
    if (index < 3) arrow(slide, x + wc + 0.04, y + 0.82, 0.22, C.slate);
  });

  addTakeaway(slide, "El sistema permite tres reservas por semana a cada RUT. Si otra persona las gasta, ¿puede Ana reservar?");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 26 · Lo que dijeron las dos pruebas

function slideSecurityResults() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el resultado", "Una resiste, la otra no", "", false);

  terminal(slide, {
    x: M,
    y: 1.86,
    w: CW,
    title: "uv run --with pytest pytest -q test_seguridad.py",
    fontSize: 10.4,
    lines: [
      { t: "E       assert 409 == 201", k: "err" },
      { t: "FAILED test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana - assert 409 == 201", k: "err" },
      { t: "1 failed, 1 passed, 1 warning in 1.06s", k: "err" },
    ],
  });

  const w = (CW - 0.4) / 2;
  const y = 3.36;
  const tarjetas = [
    [M, "Inyección", "No prospera", VERDE, C.white, "El nombre quedó guardado como texto, y la tabla sigue ahí.", ""],
    [
      M + w + 0.4,
      "Suplantación",
      "Prospera",
      ROJO,
      C.warm,
      "Ana no puede reservar: alguien gastó su cuota con su RUT. La API acepta cualquier RUT sin comprobar que quien lo escribe sea su dueño.",
      "Autenticidad (ISO/IEC 25010) · A07:2025",
    ],
  ];
  tarjetas.forEach(([x, nombre, veredicto, color, fondo, glosa, clasificacion]) => {
    rect(slide, x, y, w, 2.58, fondo);
    rect(slide, x, y, w, 0.06, color);
    addKicker(slide, x + 0.3, y + 0.22, nombre, color, w - 0.6);
    addText(slide, veredicto, { x: x + 0.3, y: y + 0.5, w: w - 0.6, h: 0.6, fontFace: TYPOGRAPHY.display, fontSize: 26, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.3, y: y + 1.16, w: w - 0.6, h: 0.86, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.1 });
    if (clasificacion) {
      rect(slide, x + 0.3, y + 2.06, w - 0.6, 0.36, ROJO);
      addText(slide, clasificacion, { x: x + 0.4, y: y + 2.1, w: w - 0.8, h: 0.28, fontSize: 10.2, bold: true, color: C.white, valign: "mid" });
    }
  });

  addTakeaway(slide, "El sistema reconoce como legítimo a alguien que no lo es.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · No se arregla con una linea

function slideNotOneLine() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la corrección", "Esta no se arregla con una línea", "", false);

  const w = (CW - 0.4) / 2;
  const casos = [
    [M, "La doble reserva · bloque 1", VERDE, "Una decisión de código", "Cómo ordenar las operaciones de la base. Se resolvió con BEGIN IMMEDIATE, y la prueba pasó a verde."],
    [M + w + 0.4, "La suplantación · bloque 2", ROJO, "Una decisión de requisito", "Cómo se identifican las personas. Mientras nadie lo decida, no hay código correcto que escribir."],
  ];
  casos.forEach(([x, rotulo, color, titulo, glosa]) => {
    rect(slide, x, 1.94, w, 1.7, C.white);
    rect(slide, x, 1.94, 0.06, 1.7, color);
    addKicker(slide, x + 0.28, 2.1, rotulo, color, w - 0.5);
    addText(slide, titulo, { x: x + 0.28, y: 2.4, w: w - 0.5, h: 0.44, fontSize: 18, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.28, y: 2.9, w: w - 0.5, h: 0.66, fontSize: 11.6, color: C.slate, lineSpacingMultiple: 1.1 });
  });

  addKicker(slide, M, 3.9, "Alguien tiene que decidir cómo se comprueba quién es quién", C.slate, 9);
  const opciones = ["Con la cuenta institucional", "Con un código enviado al correo", "Con otro mecanismo"];
  const wo = (CW - 0.4) / 3;
  opciones.forEach((opcion, index) => {
    const x = M + index * (wo + 0.2);
    rect(slide, x, 4.22, wo, 0.6, C.warm);
    addText(slide, opcion, { x: x + 0.2, y: 4.28, w: wo - 0.4, h: 0.48, fontSize: 12.2, bold: true, color: C.ink, align: "center", valign: "mid" });
  });

  rect(slide, M, 5.04, CW, 0.9, NAVY_CHIP);
  addText(slide, "Mientras se decide, la prueba queda en rojo. Y ese rojo informa: dice exactamente qué puede hacer hoy cualquiera con el RUT de otra persona.", {
    x: M + 0.34,
    y: 5.1,
    w: CW - 0.68,
    h: 0.78,
    fontSize: 12.6,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Un rojo que se conoce y se explica es información. Uno que se borra es un riesgo escondido.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · bandit

function slideBandit() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · revisar el código", "bandit lee el código sin ejecutarlo", "", false);

  addText(slide, "Un analizador estático de seguridad: busca en el código patrones que suelen ser inseguros.", {
    x: M,
    y: 1.84,
    w: CW,
    h: 0.3,
    fontSize: 12.4,
    color: C.ink,
  });

  terminal(slide, {
    x: M,
    y: 2.26,
    w: CW,
    title: "Sobre los cuatro archivos de la aplicación",
    fontSize: 9.8,
    lines: [
      { t: "uv run --with bandit bandit api.py almacen.py reservas.py sala.py", k: "cmd" },
      { t: "" },
      { t: ">> Issue: [B608:hardcoded_sql_expressions] Possible SQL injection vector through string-based query construction.", k: "err" },
      { t: "   Severity: Medium   Confidence: Medium" },
      { t: "   CWE: CWE-89 (https://cwe.mitre.org/data/definitions/89.html)" },
      { t: "   Location: .\\almacen.py:26:10" },
      { t: "25\t    conexion.execute(", k: "muted" },
      { t: '26\t        f"INSERT INTO reservas ({columnas}) VALUES ({marcas})", tuple(campos.values())' },
      { t: "27\t    )", k: "muted" },
    ],
  });

  const w = (CW - 0.4) / 3;
  const piezas = [
    ["En español", "B608, la regla que lo detectó: posible vía de inyección SQL por armar la consulta con texto."],
    ["Severidad y confianza", "Media y media: qué tan grave sería, y qué tan segura está la herramienta."],
    ["CWE-89", "El identificador de la inyección SQL en el catálogo común de debilidades de software."],
  ];
  piezas.forEach(([titulo, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 5.08, w, 0.92, C.white);
    rect(slide, x, 5.08, 0.06, 0.92, AZUL);
    addText(slide, titulo, { x: x + 0.24, y: 5.14, w: w - 0.4, h: 0.26, fontSize: 11.4, bold: true, color: AZUL });
    addText(slide, glosa, { x: x + 0.24, y: 5.42, w: w - 0.4, h: 0.54, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.05 });
  });

  addTakeaway(slide, "La línea es real: la función guardar arma el INSERT pegando texto. ¿Es explotable?", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 29 · Es explotable

function slideBanditVerdict() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · verificar el hallazgo", "Seguir el dato hasta su origen", "", false);

  const wl = 7.3;
  const almacen = codigo(slide, {
    x: M,
    y: 1.86,
    w: wl,
    lang: "python",
    fontSize: 8.8,
    title: "almacen.py",
    marcas: [
      { linea: 2, color: C.gold, numero: 1 },
      { linea: 5, color: VERDE, numero: 2 },
    ],
    code: [
      "def guardar(conexion: sqlite3.Connection, **campos: object) -> None:",
      '    columnas = ", ".join(campos)',
      '    marcas = ", ".join("?" for _ in campos)',
      "    conexion.execute(",
      '        f"INSERT INTO reservas ({columnas}) VALUES ({marcas})", tuple(campos.values())',
      "    )",
      "    conexion.commit()",
    ].join("\n"),
  });
  codigo(slide, {
    x: M,
    y: 1.86 + almacen.h + 0.16,
    w: wl,
    lang: "python",
    fontSize: 8.8,
    title: "api.py · la única llamada a guardar",
    marcas: [{ linea: 3, color: C.gold, numero: 1 }],
    code: [
      "almacen.guardar(",
      "    conexion,",
      "    bloque=solicitud.bloque,",
      "    rut=solicitud.rut,",
      "    nombre=solicitud.nombre,",
      "    correo_electronico=solicitud.correo_electronico,",
      ")",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const pistas = [
    [2, VERDE, "Los valores no se pegan", "Viajan aparte, y en la instrucción solo hay un ? por cada uno. La prueba de inyección lo confirmó."],
    [1, C.gold, "Los nombres de columna sí", "**campos reúne los argumentos con nombre, y esos nombres son las columnas: bloque=, rut=, nombre=, correo_electronico=. Los escribe el código, no una persona."],
    [0, AZUL, "Se intentó igual", "Un campo extra llamado «bloque) VALUES (1); --» respondió 201: la validación descarta todo campo que no sea uno de los cinco declarados."],
  ];
  pistas.forEach(([numero, color, titulo, glosa], index) => {
    const y = 1.86 + index * 1.18;
    rect(slide, xd, y, wd, 1.08, C.white);
    rect(slide, xd, y, 0.06, 1.08, color === C.gold ? ORO : color);
    if (numero) circulo(slide, xd + 0.36, y + 0.26, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, titulo, { x: xd + (numero ? 0.62 : 0.26), y: y + 0.12, w: wd - 0.8, h: 0.26, fontSize: 11.8, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.26, y: y + 0.44, w: wd - 0.44, h: 0.6, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.05 });
  });

  rect(slide, xd, 5.46, wd, 0.6, VERDE);
  addText(slide, "Veredicto: no es explotable hoy.", { x: xd + 0.26, y: 5.5, w: wd - 0.4, h: 0.52, fontSize: 13.4, bold: true, color: C.white, valign: "mid" });

  addTakeaway(slide, "Un hallazgo de una herramienta es una hipótesis, igual que el de un agente.", { y: 6.24, h: 0.46 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · Que hacer con un hallazgo no explotable

function slideFragileDesign() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la decisión", "No explotable hoy, frágil mañana", "", false);

  addText(slide, "Si alguien llamara mañana a guardar con nombres de campo que vienen de una solicitud, la inyección pasaría a ser real. Tres salidas; # nosec es un comentario que le pide a bandit no avisar en esa línea:", {
    x: M,
    y: 1.9,
    w: CW,
    h: 0.56,
    fontSize: 12.6,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  const w = (CW - 0.4) / 3;
  const salidas = [
    ["Reescribir", "Honesta", VERDE, C.white, "INSERT INTO reservas (bloque, rut, nombre, correo_electronico) VALUES (?, ?, ?, ?)", "Las columnas quedan fijas en el código, y el patrón desaparece."],
    ["Marcar como revisada", "Honesta", VERDE, C.white, "# nosec B608: las columnas salen de los argumentos de api.py; los valores van con ?", "La próxima persona sabe que alguien la revisó, y por qué."],
    ["Silenciar", "No honesta", ROJO, C.warm, "# nosec", "Nadie sabrá si alguien la revisó, ni qué se miró."],
  ];
  salidas.forEach(([nombre, calificacion, color, fondo, ejemplo, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.64, w, 3.26, fondo);
    rect(slide, x, 2.64, w, 0.06, color);
    addKicker(slide, x + 0.24, 2.82, calificacion, color, w - 0.4);
    addText(slide, nombre, { x: x + 0.24, y: 3.1, w: w - 0.4, h: 0.4, fontSize: 17, bold: true, color: C.ink });
    rect(slide, x + 0.24, 3.62, w - 0.48, 1.12, C.editorBg);
    addText(slide, ejemplo, {
      x: x + 0.36,
      y: 3.68,
      w: w - 0.72,
      h: 1.0,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.4,
      color: index === 2 ? C.terminalMuted : C.gold,
      valign: "mid",
      lineSpacingMultiple: 1.06,
    });
    addText(slide, glosa, { x: x + 0.24, y: 4.9, w: w - 0.44, h: 0.9, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "bandit no encontró una inyección: encontró un diseño que la haría posible.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · pip-audit

function slidePipAudit() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · revisar las dependencias", "El código que el proyecto no escribió", "", false, {
    titleFontSize: 28,
  });

  const wl = 6.5;
  terminal(slide, {
    x: M,
    y: 1.86,
    w: wl,
    title: "Las dependencias de producción del proyecto",
    fontSize: 9.4,
    lines: [
      { t: "uv export --no-dev --format requirements-txt --no-hashes -o req-prod.txt", k: "cmd" },
      { t: "uv run --with pip-audit pip-audit -r req-prod.txt", k: "cmd" },
      { t: "No known vulnerabilities found", k: "ok" },
    ],
  });
  addText(slide, "El primero escribe la lista exacta de dependencias con sus versiones; el segundo la compara con una base pública de vulnerabilidades conocidas. Resultado: no se encontraron vulnerabilidades conocidas.", {
    x: M,
    y: 3.22,
    w: wl,
    h: 0.66,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  terminal(slide, {
    x: M,
    y: 4.0,
    w: wl,
    title: "La misma auditoría sobre FastAPI 0.65.1, una versión antigua",
    fontSize: 9.4,
    lines: [
      { t: "Found 21 known vulnerabilities in 2 packages", k: "err" },
      { t: "Name      Version ID              Fix Versions", k: "muted" },
      { t: "fastapi   0.65.1  PYSEC-2021-100  0.65.2" },
      { t: "fastapi   0.65.1  PYSEC-2024-38   0.109.1" },
      { t: "starlette 0.14.2  PYSEC-2023-48   0.25.0" },
      { t: "...", k: "muted" },
    ],
  });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  addKicker(slide, xd, 1.9, "Dónde están las 21", ROJO, wd);
  const total = 21;
  const celda = (wd - 0.06 * 6) / 7;
  for (let i = 0; i < total; i += 1) {
    const x = xd + (i % 7) * (celda + 0.06);
    const y = 2.22 + Math.floor(i / 7) * (celda * 0.62 + 0.06);
    rect(slide, x, y, celda, celda * 0.62, i < 3 ? AZUL : ROJO);
  }
  const yLeyenda = 2.22 + 3 * (celda * 0.62 + 0.06) + 0.08;
  rect(slide, xd, yLeyenda + 0.05, 0.18, 0.18, AZUL);
  addText(slide, "3 en FastAPI, la que el proyecto pidió", { x: xd + 0.28, y: yLeyenda, w: wd - 0.3, h: 0.28, fontSize: 10.6, color: C.ink, valign: "mid" });
  rect(slide, xd, yLeyenda + 0.41, 0.18, 0.18, ROJO);
  addText(slide, "18 en Starlette, que FastAPI trae consigo", { x: xd + 0.28, y: yLeyenda + 0.36, w: wd - 0.3, h: 0.28, fontSize: 10.6, bold: true, color: ROJO, valign: "mid" });

  rect(slide, xd, 4.5, wd, 1.54, C.warm);
  rect(slide, xd, 4.5, 0.06, 1.54, ROJO);
  addText(slide, "A03:2025 · cadena de suministro", { x: xd + 0.26, y: 4.58, w: wd - 0.4, h: 0.26, fontSize: 11.4, bold: true, color: ROJO });
  addText(slide, "Cada fila: el paquete, la versión instalada, el identificador de la vulnerabilidad y la primera versión que la corrige. Algunas se repiten porque la base las registra con más de un identificador.", {
    x: xd + 0.26,
    y: 4.88,
    w: wd - 0.44,
    h: 1.1,
    fontSize: 10.2,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(slide, "El proyecto nunca pidió Starlette, y hereda igual sus vulnerabilidades.", { y: 6.24, h: 0.46 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32 · Verde hoy

function slideGreenToday() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · leer el verde", "«No se encontraron» no significa «no hay»", "", false, {
    titleFontSize: 28,
  });

  const x0 = M + 0.3;
  const x1 = M + CW - 0.3;
  const yLinea = 3.1;
  rule(slide, x0, yLinea, x1 - x0, C.slate, 2);
  const hitos = [
    [0.12, "Hoy", "pip-audit: sin vulnerabilidades conocidas", VERDE, "Nadie toca el proyecto"],
    [0.55, "Un día cualquiera", "Se publica una vulnerabilidad sobre una versión ya instalada", ROJO, ""],
    [0.88, "Al día siguiente", "La misma auditoría, sin cambiar nada, ya no está en verde", ROJO, ""],
  ];
  hitos.forEach(([posicion, cuando, que, color]) => {
    const cx = x0 + posicion * (x1 - x0);
    circulo(slide, cx, yLinea, 0.3, color, "", C.white, 8);
    addText(slide, cuando.toUpperCase(), { x: cx - 1.6, y: 2.2, w: 3.2, h: 0.24, fontSize: 10.4, bold: true, color, align: "center", charSpacing: 1 });
    addText(slide, que, { x: cx - 1.6, y: 3.36, w: 3.2, h: 0.8, fontSize: 11.4, color: C.ink, align: "center", lineSpacingMultiple: 1.08 });
  });
  addText(slide, "El proyecto no cambió en ningún momento.", { x: x0, y: 2.66, w: x1 - x0, h: 0.24, fontSize: 10, italic: true, color: C.slate, align: "center" });

  rect(slide, M, 4.5, CW, 1.2, NAVY_CHIP);
  addKicker(slide, M + 0.34, 4.64, "Mañana · 11:00 · Clase 16", C.gold, 6);
  addText(slide, "Por eso esta revisión no se ejecuta una vez: se ejecuta cada vez que cambia algo, y también cuando no cambia nada. Es una de las razones por las que existe la integración continua: ejecutar las pruebas automáticamente con cada cambio.", {
    x: M + 0.34,
    y: 4.92,
    w: CW - 0.68,
    h: 0.72,
    fontSize: 12,
    color: C.white,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Un resultado de seguridad tiene fecha.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 33 · Lo que pide la ley

function slideLawDuties() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · si el rojo llega al sistema real", "Lo que la ley pide antes y después", "", false, {
    titleFontSize: 28,
  });

  addText(slide, "Hoy la suplantación está en rojo en tu máquina, con datos inventados: nadie fue afectado. Es el mejor momento para encontrarla.", {
    x: M,
    y: 1.84,
    w: CW,
    h: 0.5,
    fontSize: 12.2,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  const w = (CW - 0.4) / 3;
  const deberes = [
    [
      "Prevenir",
      "Artículo 14 quinquies",
      AZUL,
      "«El responsable de datos debe adoptar las medidas necesarias para resguardar el cumplimiento del principio de seguridad […], considerando el estado actual de la técnica y los costos de aplicación […]»",
    ],
    [
      "Reportar",
      "Artículo 14 sexies",
      ORO,
      "«El responsable deberá reportar a la Agencia, por los medios más expeditos posibles y sin dilaciones indebidas, las vulneraciones a las medidas de seguridad […]»",
    ],
    [
      "Infracción grave",
      "Artículo 34 ter, letra j",
      ROJO,
      "«Vulnerar o infringir las obligaciones de seguridad en el tratamiento de los datos personales establecidas en el artículo 14 quinquies.»",
    ],
  ];
  deberes.forEach(([nombre, articulo, color, cita], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.5, w, 2.24, C.white);
    rect(slide, x, 2.5, w, 0.06, color);
    addText(slide, nombre, { x: x + 0.24, y: 2.66, w: w - 0.4, h: 0.4, fontSize: 17, bold: true, color });
    addText(slide, articulo, { x: x + 0.24, y: 3.06, w: w - 0.4, h: 0.24, fontSize: 10, bold: true, color: C.slate });
    addText(slide, cita, { x: x + 0.24, y: 3.36, w: w - 0.44, h: 1.3, fontSize: 10.6, italic: true, color: C.ink, lineSpacingMultiple: 1.1 });
    if (index < 2) arrow(slide, x + w + 0.02, 3.96, 0.16, C.slate);
  });
  addText(slide, "Agencia: la Agencia de Protección de Datos Personales que crea la ley. Todas las citas: Ley 21.719.", {
    x: M,
    y: 4.8,
    w: CW,
    h: 0.24,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  rect(slide, M, 5.2, CW, 0.8, NAVY_CHIP);
  addText(slide, "Y una prueba en rojo que se conoce y se deja así, sin decisión y sin registro, es evidencia de lo contrario.", {
    x: M + 0.34,
    y: 5.26,
    w: CW - 0.68,
    h: 0.68,
    fontSize: 12.6,
    color: C.white,
    valign: "mid",
  });

  addTakeaway(slide, "Una prueba que existe, se ejecuta y queda registrada es evidencia de que las medidas se buscaron.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 34 y 35 · Preguntas y respuestas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de la pausa", [
    [
      "bandit señaló una posible inyección SQL y la prueba de inyección pasó. Un compañero propone agregar # nosec a la línea y seguir. ¿Qué le falta a esa decisión?",
      "Revisa qué parte de la instrucción sí se arma pegando texto. ¿Qué necesitaría saber la próxima persona que lea esa línea?",
    ],
    [
      "pip-audit informó que no hay vulnerabilidades conocidas. ¿Se puede escribir en el informe que las dependencias del proyecto son seguras?",
      "Relee la frase exacta de la herramienta. ¿Qué pasa con ella el día que se publique una vulnerabilidad sobre una versión ya instalada?",
    ],
    [
      "La prueba de suplantación está en rojo, y corregirla exige decidir cómo se identifican las personas. ¿Qué debería pasar con esa prueba mientras nadie decide?",
      "Compárala con una prueba inestable, que falla sin que el sistema cambie: ¿cuál de los dos rojos informa algo? ¿Qué dice el artículo 14 quinquies?",
    ],
  ]);
}

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "Le falta el porqué",
      "Los nombres de columna sí se pegan; hoy salen del código, y mañana podrían no hacerlo.",
      "Un # nosec B608 con la razón escrita deja constancia de que alguien lo revisó.",
      "Silenciar una advertencia sin dejar el motivo.",
    ],
    [
      "No: solo que hoy no hay conocidas",
      "La frase dice que ninguna versión tiene hoy una vulnerabilidad registrada.",
      "Un resultado de seguridad tiene fecha, y por eso se repite siempre.",
      "Convertir «no se encontraron» en «no hay».",
    ],
    [
      "Quedarse en rojo, visible",
      "Este rojo informa qué puede hacer cualquiera con el RUT de otra persona.",
      "Un riesgo conocido, con su decisión pendiente registrada, es parte de las medidas.",
      "Borrar la prueba o cambiarla para que pase.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// Bloque 3 · recursos

const CAPTURAS = {
  contrasteInsuficiente: path.resolve(__dirname, "assets/bloques-contraste-insuficiente.png"),
  contrasteCorregido: path.resolve(__dirname, "assets/bloques-contraste-corregido.png"),
  mensajeObject: path.resolve(__dirname, "assets/mensaje-object-object.png"),
};
// Colores literales de la interfaz del proyecto, no del sistema de diseño: son el dato que se muestra.
const GRIS_TOMADO_ANTES = "9AA3AD";
const GRIS_TOMADO_DESPUES = "5B6878";

// ---------------------------------------------------------------------------
// 36 · Divisor del bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "Para quién sirve y dónde corre", {
    x: M,
    y: 1.98,
    w: 11.2,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Una revisión automática de accesibilidad que pasa o falla según lo que tenga la pantalla, lo que ninguna herramienta puede ver, y la misma suite en tres navegadores y dos versiones de Python.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 3, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 37 · Accesibilidad: para quien

function slideAccessibilityWho() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la accesibilidad", "Una interfaz que pueda usar cualquiera", "", false, {
    titleFontSize: 28,
  });

  const personas = [
    ["No ve la pantalla", "y la recorre con un lector de pantalla, el programa que lee en voz alta lo que aparece"],
    ["Ve con poco contraste", "o necesita ampliar la página para leerla"],
    ["No usa un mouse", "y se mueve por la página solo con el teclado"],
    ["Mira una pantalla con reflejo", "a pleno sol o en una sala con mucha luz"],
  ];
  const w = (CW - 0.6) / 4;
  personas.forEach(([quien, detalle], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 1.94, w, 1.56, C.white);
    rect(slide, x, 1.94, w, 0.06, AZUL);
    addText(slide, quien, { x: x + 0.2, y: 2.1, w: w - 0.4, h: 0.5, fontSize: 13, bold: true, color: C.ink, lineSpacingMultiple: 1.05 });
    addText(slide, detalle, { x: x + 0.2, y: 2.62, w: w - 0.4, h: 0.82, fontSize: 10.4, color: C.slate, lineSpacingMultiple: 1.08 });
  });

  const wl = 5.2;
  addKicker(slide, M, 3.76, "ISO/IEC 25010:2023 · capacidad de interacción", AZUL, wl);
  addText(slide, "La antigua accesibilidad quedó dividida en dos subcaracterísticas:", { x: M, y: 4.06, w: wl, h: 0.26, fontSize: 10.8, color: C.ink });
  [
    ["Inclusividad", "que la puedan usar personas diversas"],
    ["Asistencia al usuario", "que la persona reciba ayuda para usarla"],
  ].forEach(([nombre, glosa], index) => {
    const y = 4.42 + index * 0.62;
    rect(slide, M, y, wl, 0.54, C.warm);
    addText(slide, nombre, { x: M + 0.2, y: y + 0.12, w: 2.2, h: 0.3, fontSize: 12, bold: true, color: AZUL, valign: "mid" });
    addText(slide, glosa, { x: M + 2.4, y: y + 0.12, w: wl - 2.56, h: 0.3, fontSize: 10.6, color: C.ink, valign: "mid" });
  });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  addKicker(slide, xd, 3.76, "WCAG 2.2 · cómo se comprueba", ROJO, wd);
  addText(slide, "Las pautas de accesibilidad del W3C, el consorcio que define los estándares de la web: criterios comprobables, cada uno con un nivel.", {
    x: xd,
    y: 4.06,
    w: wd,
    h: 0.46,
    fontSize: 10.8,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });
  const niveles = [
    ["A", "lo mínimo", C.slate],
    ["AA", "lo que exige la mayoría de las normativas", ROJO],
    ["AAA", "lo más estricto", C.slate],
  ];
  const wn = (wd - 0.24) / 3;
  niveles.forEach(([nivel, glosa, color], index) => {
    const x = xd + index * (wn + 0.12);
    rect(slide, x, 4.62, wn, 0.96, index === 1 ? C.warm : C.white);
    addText(slide, nivel, { x: x + 0.16, y: 4.66, w: wn - 0.3, h: 0.44, fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color });
    addText(slide, glosa, { x: x + 0.16, y: 5.1, w: wn - 0.3, h: 0.44, fontSize: 9.6, color: C.ink, lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "La norma dice qué característica está en juego. Las WCAG dicen cómo se comprueba.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 38 · El contraste

function slideContrastCriterion() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · un criterio con umbral", "El contraste se mide", "", false);

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.06,
    "La presentación visual del texto y de las imágenes de texto tiene una relación de contraste de al menos 4,5 a 1, excepto en los siguientes casos…",
    "WCAG 2.2, criterio 1.4.3, Contraste (mínimo), nivel AA · traducción del original en inglés",
    ROJO
  );
  addText(slide, "Relación de contraste: compara lo claro del texto con lo claro del fondo. Una de las excepciones es el texto grande, que exige 3 a 1.", {
    x: M,
    y: 3.06,
    w: CW,
    h: 0.26,
    fontSize: 10.8,
    italic: true,
    color: C.slate,
  });

  const x0 = M + 0.4;
  const ancho = CW - 0.8;
  const posicion = (valor) => x0 + (Math.log(valor) / Math.log(21)) * ancho;
  const yEje = 4.5;
  slide.addShape(SH.rect, {
    x: x0,
    y: yEje - 0.09,
    w: ancho,
    h: 0.18,
    fill: { type: "solid", color: C.border },
    line: { color: C.border },
  });
  rect(slide, posicion(4.5), yEje - 0.09, x0 + ancho - posicion(4.5), 0.18, VERDE);
  const marcas = [
    [1, "1 a 1", "texto invisible", C.slate, "abajo"],
    [2.55, "2,55 a 1", "la ficha «Tomado»", ROJO, "arriba"],
    [3, "3 a 1", "texto grande", C.slate, "abajo"],
    [4.5, "4,5 a 1", "el umbral AA", VERDE, "arriba"],
    [21, "21 a 1", "negro sobre blanco", C.slate, "abajo"],
  ];
  marcas.forEach(([valor, rotulo, glosa, color, lado]) => {
    const cx = posicion(valor);
    slide.addShape(SH.ellipse, { x: cx - 0.13, y: yEje - 0.13, w: 0.26, h: 0.26, fill: { color }, line: { color: C.white, pt: 1.5 } });
    const y = lado === "arriba" ? yEje - 0.86 : yEje + 0.24;
    const alineacion = valor === 1 ? "left" : valor === 21 ? "right" : "center";
    const x = alineacion === "left" ? cx - 0.13 : alineacion === "right" ? cx - 1.87 : cx - 1.0;
    addText(slide, rotulo, { x, y, w: 2.0, h: 0.3, fontSize: 13, bold: true, color, align: alineacion });
    addText(slide, glosa, { x, y: y + 0.3, w: 2.0, h: 0.24, fontSize: 9.8, color: C.slate, align: alineacion });
  });
  addText(slide, "En verde, lo que cumple el criterio para texto normal. La escala se comprime hacia la derecha para que quepan los valores bajos.", {
    x: M,
    y: 5.46,
    w: CW,
    h: 0.24,
    fontSize: 9.6,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Magnitud, método y umbral ya escritos: por eso una herramienta lo puede comprobar sola.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 39 · La prueba con axe-core

function slideAxeTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · axe-core", "La revisión de accesibilidad es una prueba más", "", false, {
    titleFontSize: 27,
  });

  const wl = 8.7;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "typescript",
    fontSize: 8.0,
    title: "pruebas/accesibilidad.spec.ts",
    marcas: [
      { linea: 4, color: C.gold, numero: 1 },
      { linea: 11, color: C.gold, numero: 2 },
      { linea: 23, color: C.gold, numero: 3 },
      { linea: 25, color: VERDE, numero: 4 },
    ],
    code: [
      'import AxeBuilder from "@axe-core/playwright";',
      'import { expect, test } from "@playwright/test";',
      "",
      'const PAUTAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];',
      "",
      "test.beforeEach(async ({ request }) => {",
      '  await request.post("/_prueba/reiniciar");',
      "});",
      "",
      'test("con un bloque tomado, la página no tiene fallas de accesibilidad detectables", async ({ page, request }) => {',
      '  await request.post("/reservas", {',
      "    data: {",
      '      nombre: "Ana Rivas",',
      '      rut: "11.111.111-1",',
      '      correo_electronico: "ana.rivas@ejemplo.cl",',
      "      bloque: 4,",
      "      personas: 12,",
      "    },",
      "  });",
      '  await page.goto("/");',
      '  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");',
      "",
      "  const resultado = await new AxeBuilder({ page }).withTags(PAUTAS).analyze();",
      "",
      "  expect(resultado.violations.map((v) => v.id)).toEqual([]);",
      "});",
    ].join("\n"),
  });

  const xd = M + wl + 0.24;
  const wd = CW - wl - 0.24;
  const notas = [
    [1, C.gold, "Qué se revisa", "Las reglas de nivel A y AA de las WCAG 2.0, 2.1 y 2.2."],
    [2, C.gold, "Preparar el estado", "beforeEach deja la base vacía antes de cada prueba. Después se reserva el bloque 4 por la API, para que la página tenga una ficha «Tomado»."],
    [3, C.gold, "Revisar", "axe-core recorre la página tal como está en ese momento y devuelve lo que encontró."],
    [4, VERDE, "Afirmar", "La lista de reglas que no se cumplen, por su identificador, tiene que estar vacía."],
  ];
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const y = 1.84 + index * 1.18;
    rect(slide, xd, y, wd, 1.08, C.white);
    rect(slide, xd, y, 0.06, 1.08, color === C.gold ? ORO : color);
    circulo(slide, xd + 0.34, y + 0.26, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, titulo, { x: xd + 0.6, y: y + 0.12, w: wd - 0.76, h: 0.26, fontSize: 11.6, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.24, y: y + 0.44, w: wd - 0.4, h: 0.6, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.05 });
  });
  addText(slide, "@axe-core/playwright conecta axe-core con Playwright.", {
    x: xd,
    y: 6.56,
    w: wd,
    h: 0.24,
    fontSize: 9,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · Paso vacia, fallo con un bloque tomado

function slideAxeTwoStates() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el hallazgo", "Pasó con la página vacía", "", false);

  const wl = 3.5;
  rect(slide, M, 1.9, wl, 2.3, C.white);
  rect(slide, M, 1.9, wl, 0.06, VERDE);
  addKicker(slide, M + 0.24, 2.08, "Página recién abierta", VERDE, wl - 0.4);
  addText(slide, "24 reglas\n0 fallas", {
    x: M + 0.24,
    y: 2.4,
    w: wl - 0.4,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.0,
  });
  addText(slide, "Pero con todos los bloques libres: la página que casi nadie ve a media mañana.", {
    x: M + 0.24,
    y: 3.46,
    w: wl - 0.44,
    h: 0.66,
    fontSize: 10.6,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });

  const xm = M + wl + 0.3;
  const wm = 3.6;
  addKicker(slide, xm, 1.9, "Con el bloque 4 tomado", ROJO, wm);
  slide.addImage({ path: CAPTURAS.contrasteInsuficiente, x: xm, y: 2.2, w: wm, h: (wm * 565) / 995 });
  addText(slide, "Captura de la interfaz del proyecto.", { x: xm, y: 2.2 + (wm * 565) / 995 + 0.06, w: wm, h: 0.22, fontSize: 9, italic: true, color: C.slate });

  const xd = xm + wm + 0.3;
  const wd = M + CW - xd;
  terminal(slide, {
    x: xd,
    y: 1.9,
    w: wd,
    title: "npx playwright test",
    fontSize: 9.6,
    lines: [
      { t: "- Expected  - 1", k: "muted" },
      { t: "+ Received  + 3", k: "muted" },
      { t: "- Array []" },
      { t: "+ Array [", k: "err" },
      { t: '+   "color-contrast",', k: "err" },
      { t: "+ ]", k: "err" },
    ],
  });

  addText(slide, "Se esperaba una lista vacía, sin reglas incumplidas, y llegó una con color-contrast.", {
    x: xd,
    y: 3.86,
    w: wd,
    h: 0.5,
    fontSize: 10.2,
    color: C.ink,
    lineSpacingMultiple: 1.05,
  });

  terminal(slide, {
    x: M,
    y: 4.6,
    w: CW,
    title: "El detalle de la regla color-contrast",
    fontSize: 9.4,
    lines: [
      { t: "Element has insufficient color contrast of 2.55 (foreground color: #ffffff, background color: #9aa3ad,", k: "err" },
      { t: "font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1", k: "err" },
    ],
  });
  addText(slide, "El elemento tiene un contraste insuficiente de 2,55 a 1: texto blanco sobre gris claro; se esperaba 4,5 a 1. Es justo la ficha que dice que el bloque no está disponible.", {
    x: M,
    y: 5.72,
    w: CW,
    h: 0.46,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });

  addTakeaway(slide, "Una revisión automática revisa el estado que se le muestra.", { y: 6.24, h: 0.46 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · La correccion del contraste

function slideContrastFix() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la corrección", "Una línea en la hoja de estilos", "", false);

  const w = (CW - 0.6) / 2;
  const anchoImagen = 4.4;
  const alto = (anchoImagen * 565) / 995;
  const versiones = [
    [M, "Antes", GRIS_TOMADO_ANTES, "#9aa3ad", "2,55 a 1", ROJO, CAPTURAS.contrasteInsuficiente, "No cumple el 4,5 a 1"],
    [M + w + 0.6, "Después", GRIS_TOMADO_DESPUES, "#5b6878", "5,68 a 1", VERDE, CAPTURAS.contrasteCorregido, "Cumple, en los tres navegadores"],
  ];
  const yImg = 2.34;
  versiones.forEach(([x, rotulo, gris, hex, razon, color, imagen, veredicto]) => {
    addKicker(slide, x, 1.9, rotulo, color, 2);
    rect(slide, x + w - 2.3, 1.84, 2.3, 0.4, gris);
    addText(slide, `--tomado: ${hex};`, { x: x + w - 2.24, y: 1.88, w: 2.2, h: 0.32, fontFace: TYPOGRAPHY.mono, fontSize: 10.4, bold: true, color: C.white, valign: "mid" });
    slide.addImage({ path: imagen, x: x + (w - anchoImagen) / 2, y: yImg, w: anchoImagen, h: alto });
    rect(slide, x, yImg + alto + 0.14, w, 0.64, C.white);
    rect(slide, x, yImg + alto + 0.14, 0.06, 0.64, color);
    addText(slide, razon, { x: x + 0.24, y: yImg + alto + 0.2, w: 1.8, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color, valign: "mid" });
    addText(slide, veredicto, { x: x + 2.1, y: yImg + alto + 0.2, w: w - 2.3, h: 0.5, fontSize: 11.4, color: C.ink, valign: "mid" });
  });
  arrow(slide, M + w + 0.12, yImg + alto / 2, 0.36, C.slate, 2);
  addText(slide, "El nuevo gris ya lo usaba la interfaz para los textos secundarios. El 5,68 a 1 sale de la fórmula de las WCAG.", {
    x: M,
    y: yImg + alto + 0.9,
    w: CW,
    h: 0.26,
    fontSize: 10,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Una prueba que solo abre la página vacía comprueba la versión que casi nadie ve.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 42 · Lo que la herramienta no ve

function slideWhatAxeMisses() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el límite", "Cero violaciones, y un mensaje que no sirve", "", false, {
    titleFontSize: 28,
  });

  const wl = 3.4;
  const altoImagen = (wl * 1195) / 1135;
  slide.addImage({ path: CAPTURAS.mensajeObject, x: M, y: 1.84, w: wl, h: altoImagen });
  addText(slide, "La persona dejó vacío el campo Personas. [object Object] es lo que JavaScript muestra al convertir en texto un dato que no es texto: el mensaje real nunca llega a la pantalla.", { x: M, y: 1.84 + altoImagen + 0.04, w: wl, h: 0.66, fontSize: 9, italic: true, color: C.slate, lineSpacingMultiple: 1.02 });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  addQuote(
    slide,
    xd,
    1.84,
    wd,
    1.0,
    "Con axe-core se puede encontrar, en promedio, el 57 % de los problemas de las WCAG de forma automática.",
    "axe-core, documentación del proyecto · traducción del original en inglés",
    AZUL
  );

  const w = (wd - 0.2) / 2;
  addKicker(slide, xd, 3.02, "Lo que axe-core revisó", VERDE, w);
  [
    "El contraste del texto rojo: cumple.",
    "La estructura de la página: correcta.",
    'El mensaje tiene role="status" y aria-live="polite": un lector de pantalla lo lee en voz alta cuando cambia.',
  ].forEach((texto, index) => {
    const y = 3.32 + index * 0.62;
    rect(slide, xd, y, w, 0.54, C.white);
    rect(slide, xd + 0.18, y + 0.19, 0.16, 0.16, VERDE);
    addText(slide, texto, { x: xd + 0.46, y: y + 0.04, w: w - 0.56, h: 0.46, fontSize: 9.6, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
  });
  const xr = xd + w + 0.2;
  addKicker(slide, xr, 3.02, "Lo que se lee en voz alta", ROJO, w);
  rect(slide, xr, 3.32, w, 1.78, C.warm);
  rect(slide, xr, 3.32, 0.06, 1.78, ROJO);
  addText(slide, "[object Object]", { x: xr + 0.26, y: 3.5, w: w - 0.4, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: ROJO });
  addText(slide, "Ninguna regla automática puede saber que eso no le sirve a nadie.", { x: xr + 0.26, y: 4.1, w: w - 0.44, h: 0.9, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.08 });

  rect(slide, xd, 5.28, wd, 0.68, NAVY_CHIP);
  addText(slide, "Resultado de axe-core con este mensaje en pantalla: cero violaciones.", {
    x: xd + 0.26,
    y: 5.32,
    w: wd - 0.4,
    h: 0.6,
    fontSize: 12.4,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  addTakeaway(slide, "Lo que el mensaje dice, y si le sirve a quien lo escucha, es un asunto de requisito.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 43 · La prueba de teclado

function slideKeyboardTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · lo que se recorre", "Una reserva completa, sin tocar el mouse", "", false, {
    titleFontSize: 28,
  });

  const wl = 7.7;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "typescript",
    fontSize: 8.2,
    title: "pruebas/teclado.spec.ts",
    marcas: [
      { linea: 5, color: C.gold, numero: 1 },
      { linea: 11, color: C.gold, numero: 2 },
      { linea: 16, color: C.gold, numero: 3 },
      { linea: 19, color: VERDE, numero: 4 },
    ],
    code: [
      'test("una reserva se completa solo con el teclado", async ({ page }) => {',
      '  await page.goto("/");',
      '  await expect(page.getByRole("listitem")).toHaveCount(8);',
      "",
      '  await page.keyboard.press("Tab");',
      '  await page.keyboard.type("Ana Rivas");',
      '  await page.keyboard.press("Tab");',
      '  await page.keyboard.type("11.111.111-1");',
      '  await page.keyboard.press("Tab");',
      '  await page.keyboard.type("ana.rivas@ejemplo.cl");',
      '  await page.keyboard.press("Tab");',
      '  await page.keyboard.press("ArrowDown");',
      '  await page.keyboard.press("ArrowDown");',
      '  await page.keyboard.press("ArrowDown");',
      '  await page.keyboard.press("Tab");',
      '  await page.keyboard.type("12");',
      '  await page.keyboard.press("Enter");',
      "",
      '  await expect(page.getByRole("status")).toContainText("Reserva confirmada");',
      '  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");',
      "});",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const teclas = [
    [1, "Tab", "Mueve el foco —el campo activo— al siguiente campo."],
    [2, "ArrowDown", "Baja una opción en el selector de bloque: de 1 a 4 con tres pulsaciones."],
    [3, "Enter", "Envía el formulario."],
  ];
  teclas.forEach(([numero, tecla, glosa], index) => {
    const y = 1.84 + index * 0.84;
    circulo(slide, xd + 0.16, y + 0.34, 0.28, C.gold, numero, C.navy, 9.4);
    rect(slide, xd + 0.42, y + 0.1, 1.2, 0.48, C.white, C.border);
    addText(slide, tecla, { x: xd + 0.42, y: y + 0.14, w: 1.2, h: 0.4, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, bold: true, color: C.ink, align: "center", valign: "mid" });
    addText(slide, glosa, { x: xd + 1.74, y: y + 0.02, w: wd - 1.74, h: 0.66, fontSize: 9.6, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
  });

  rect(slide, xd, 4.46, wd, 0.64, VERDE);
  circulo(slide, xd + 0.34, 4.78, 0.28, C.white, 4, VERDE, 9.4);
  addText(slide, "Pasa en los tres navegadores.", { x: xd + 0.62, y: 4.52, w: wd - 0.76, h: 0.52, fontSize: 13, bold: true, color: C.white, valign: "mid" });

  const criterios = [
    ["WCAG 2.1.1 · nivel A", "Toda la funcionalidad se puede operar con el teclado. axe-core no lo intenta: lo hace esta prueba."],
    ["WCAG 4.1.3 · nivel AA", 'Mensajes de estado: role="status" hace que el lector anuncie el mensaje sin que la persona lo busque.'],
  ];
  criterios.forEach(([titulo, glosa], index) => {
    const y = 5.26 + index * 0.76;
    rect(slide, xd, y, wd, 0.68, C.white);
    rect(slide, xd, y, 0.06, 0.68, AZUL);
    addText(slide, titulo, { x: xd + 0.22, y: y + 0.06, w: wd - 0.36, h: 0.22, fontSize: 10, bold: true, color: AZUL });
    addText(slide, glosa, { x: xd + 0.22, y: y + 0.28, w: wd - 0.36, h: 0.38, fontSize: 9, color: C.ink, lineSpacingMultiple: 1.02 });
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 44 · Tres navegadores

function slideThreeBrowsers() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · dónde corre", "La misma suite, tres motores", "", false);

  const wl = 5.6;
  addKicker(slide, M, 1.9, "ISO/IEC 25010:2023 · flexibilidad", AZUL, wl);
  addText(slide, "Reemplazó a la antigua portabilidad: adaptarse a otros entornos, instalarse, reemplazar a otro producto y, desde 2023, escalar.", {
    x: M,
    y: 2.18,
    w: wl,
    h: 0.62,
    fontSize: 10.8,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  codigo(slide, {
    x: M,
    y: 2.84,
    w: wl,
    lang: "typescript",
    fontSize: 8.8,
    title: "playwright.config.ts",
    code: [
      "projects: [",
      '  { name: "chromium", use: { ...devices["Desktop Chrome"] } },',
      '  { name: "firefox", use: { ...devices["Desktop Firefox"] } },',
      '  { name: "webkit", use: { ...devices["Desktop Safari"] } },',
      "],",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const motores = [
    ["Chromium", "el de Chrome y Edge"],
    ["Firefox", ""],
    ["WebKit", "el motor de Safari"],
  ];
  const wm = (wd - 0.24) / 3;
  motores.forEach(([nombre, glosa], index) => {
    const x = xd + index * (wm + 0.12);
    rect(slide, x, 1.9, wm, 1.02, C.white);
    rect(slide, x, 1.9, wm, 0.06, AZUL);
    addText(slide, nombre, { x: x + 0.14, y: 2.02, w: wm - 0.28, h: 0.3, fontSize: 13, bold: true, color: C.ink });
    addText(slide, "6 de 7 pasan", { x: x + 0.14, y: 2.34, w: wm - 0.28, h: 0.24, fontSize: 10.4, bold: true, color: VERDE });
    if (glosa) addText(slide, glosa, { x: x + 0.14, y: 2.6, w: wm - 0.28, h: 0.24, fontSize: 9, color: C.slate });
  });
  addText(slide, "El motor es la parte del navegador que dibuja la página. Cada prueba corre una vez por proyecto. devices trae la configuración de cada navegador, como el tamaño de la ventana. Firefox y WebKit se instalan una vez con npx playwright install firefox webkit.", {
    x: xd,
    y: 3.1,
    w: wd,
    h: 0.9,
    fontSize: 10.2,
    color: C.slate,
    lineSpacingMultiple: 1.08,
  });

  terminal(slide, {
    x: M,
    y: 4.5,
    w: CW,
    title: "npx playwright test · las pruebas de la mañana y las dos de este bloque",
    fontSize: 8.0,
    lines: [
      { t: "  x   6 [chromium] › pruebas\\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.0s)", k: "err" },
      { t: "  x  13 [firefox] › pruebas\\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.4s)", k: "err" },
      { t: "  x  20 [webkit] › pruebas\\reserva.spec.ts:20:5 › si falta un dato, la pantalla dice cuál corregir (6.0s)", k: "err" },
      { t: "  3 failed", k: "err" },
      { t: "  18 passed (1.1m)", k: "ok" },
    ],
  });

  addTakeaway(slide, "La única que falla es la del [object Object], y en los tres recibe el mismo texto.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 45 · Dos versiones de Python y que significa

function slideTwoPythons() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · del lado del servidor", "Dos versiones de Python, un resultado", "", false, {
    titleFontSize: 28,
  });

  const wl = 6.2;
  terminal(slide, {
    x: M,
    y: 1.86,
    w: wl,
    title: "La suite de pytest: 20 pruebas previas, 1 de concurrencia y 2 de seguridad",
    fontSize: 9.8,
    lines: [
      { t: "uv run pytest -q", k: "cmd" },
      { t: "1 failed, 22 passed, 1 warning", k: "err" },
      { t: "" },
      { t: "uv run --python 3.12 --isolated pytest -q", k: "cmd" },
      { t: "1 failed, 22 passed, 1 warning", k: "err" },
    ],
  });
  addText(slide, "--python 3.12 pide esa versión; --isolated arma un entorno aparte. Python 3.13.11 y 3.12.12. La que falla en las dos es la de suplantación.", {
    x: M,
    y: 3.68,
    w: wl,
    h: 0.66,
    fontSize: 10.4,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  addKicker(slide, xd, 1.9, "No encontrar nada nuevo es un resultado", AZUL, wd);
  const lecturas = [
    ["Antes era una suposición", "Que funciona en Firefox, en WebKit y en Python 3.12 ahora está comprobado."],
    ["Falla igual en todos", "Cuando una prueba falla en todos los entornos, el defecto es del sistema, no del entorno. Si hubiera fallado solo en WebKit, la pregunta sería otra."],
  ];
  lecturas.forEach(([titulo, glosa], index) => {
    const y = 2.22 + index * 1.2;
    rect(slide, xd, y, wd, 1.1, C.white);
    rect(slide, xd, y, 0.06, 1.1, AZUL);
    addText(slide, titulo, { x: xd + 0.24, y: y + 0.1, w: wd - 0.4, h: 0.26, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.24, y: y + 0.4, w: wd - 0.44, h: 0.66, fontSize: 10.2, color: C.slate, lineSpacingMultiple: 1.05 });
  });

  rect(slide, M, 4.72, CW, 1.2, C.warm);
  rect(slide, M, 4.72, 0.06, 1.2, ORO);
  addKicker(slide, M + 0.3, 4.86, "Un límite que conviene declarar", ORO, 8);
  addText(slide, "El WebKit que instala Playwright es el motor de Safari, no Safari en un Mac ni en un iPhone. Pasar en él reduce mucho el riesgo, pero no lo elimina. Como en el bloque 1: un resultado vale para las condiciones en que se obtuvo.", {
    x: M + 0.3,
    y: 5.14,
    w: CW - 0.6,
    h: 0.72,
    fontSize: 11.4,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Ejecutar en otro entorno y no encontrar nada convierte una suposición en un hecho.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 46 y 47 · Preguntas y respuestas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes de exigir", [
    [
      "La revisión de accesibilidad pasó con la página recién abierta y falló con un bloque tomado. Un compañero dice que la primera versión estaba bien, porque encontró lo que había. ¿Tiene razón?",
      "Revisa qué fichas había en la página cuando pasó. ¿Qué parte de la interfaz no estaba en pantalla para que la herramienta la revisara?",
    ],
    [
      "Con [object Object] en pantalla, axe-core encontró cero violaciones. ¿Significa que ese mensaje es accesible?",
      "Separa lo que la herramienta revisó de lo que el lector de pantalla le va a leer a la persona. ¿Cuál decide si logra reservar?",
    ],
    [
      "La suite dio el mismo resultado en tres navegadores y dos versiones de Python. ¿Valió la pena ejecutarla cinco veces si no encontró nada nuevo?",
      "Compara «funciona en Firefox» antes y después de ejecutarla en Firefox. ¿Qué dice que una prueba falle igual en todos?",
    ],
  ]);
}

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "Solo revisó lo que había",
      "Con todos los bloques libres, la ficha «Tomado» no estaba en pantalla para revisarla.",
      "Una revisión automática revisa solo el estado que se le muestra.",
      "Probar solo la página recién abierta.",
    ],
    [
      "No, solo lo revisable",
      "Contraste, estructura y atributos cumplen; lo que se lee en voz alta es [object Object].",
      "La herramienta encuentra en promedio el 57 %; el resto necesita a una persona.",
      "Leer cero violaciones como «accesible».",
    ],
    [
      "Sí: ahora es un hecho",
      "Y la falla idéntica en todos los entornos dice que el defecto es del sistema.",
      "Un resultado sin hallazgos también es evidencia.",
      "Creer que una prueba que no encuentra nada no aportó.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 48 · Divisor del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 4 de 4 · 20 minutos", C.gold, 5);
  addText(slide, "Un requisito sin umbral no se prueba", {
    x: M,
    y: 1.98,
    w: 11.4,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "La auditoría no funcional de un agente, verificada afirmación por afirmación, y una corrección de la mañana que dejó un defecto nuevo, convertido en prueba con magnitud, método y umbral.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 4, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 49 · El pedido

function slideAuditRequest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el pedido", "Una auditoría, con permiso solo para leer", "", false, {
    titleFontSize: 28,
  });

  codigo(slide, {
    x: M,
    y: 1.84,
    w: CW,
    lang: "bash",
    fontSize: 9.2,
    title: "Terminal · sobre el proyecto tal como estaba al comenzar la sesión",
    marcas: [
      { linea: 3, color: C.gold, numero: 1 },
      { linea: 6, color: C.gold, numero: 2 },
      { linea: 11, color: VERDE, numero: 3 },
    ],
    code: [
      'claude -p "Eres auditor de calidad de software. Revisa este proyecto, una API de reservas de',
      "laboratorio hecha con FastAPI y SQLite, con una interfaz web en la carpeta interfaz. Entrega una",
      "auditoria NO FUNCIONAL del proyecto: rendimiento y capacidad, seguridad, accesibilidad de la",
      "interfaz, portabilidad y mantenibilidad.",
      "",
      "Para cada hallazgo indica: la caracteristica de ISO/IEC 25010:2023 a la que corresponde, la",
      "evidencia (archivo y linea), la severidad (alta, media o baja), y un requisito verificable con",
      "magnitud, metodo de medicion y umbral.",
      "",
      "Solo puedes leer archivos; no puedes ejecutar nada. Al final, declara que afirmaciones hiciste sin",
      'poder comprobarlas." --allowed-tools "Read,Grep,Glob"',
    ].join("\n"),
  });

  const w = (CW - 0.4) / 3;
  const notas = [
    [1, C.gold, "Qué revisar", "Las cuatro características de hoy, y la mantenibilidad."],
    [2, C.gold, "Qué entregar", "Por cada hallazgo: característica, evidencia, severidad y un requisito con magnitud, método y umbral."],
    [3, VERDE, "Qué puede hacer", "claude -p le entrega el pedido al agente; --allowed-tools solo le deja leer y buscar. Y tiene que declarar lo que no comprobó."],
  ];
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 4.64, w, 1.28, C.white);
    rect(slide, x, 4.64, w, 0.06, color === C.gold ? ORO : color);
    circulo(slide, x + 0.34, 4.98, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, titulo, { x: x + 0.6, y: 4.84, w: w - 0.8, h: 0.28, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.24, y: 5.18, w: w - 0.44, h: 0.7, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.05 });
  });

  addTakeaway(slide, "El pedido va sin tildes porque se escribió así en la terminal; el agente respondió en español correcto.", {
    fontSize: 12.6,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 50 · Lo que devolvio

function slideAuditResult() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · lo que devolvió", "Leyendo, encontró lo mismo que ejecutando", "", false, {
    titleFontSize: 28,
  });

  const cifras = [
    ["28", "hallazgos, en cinco áreas", AZUL],
    ["6", "de severidad alta", ROJO],
    ["10", "afirmaciones que declaró no haber podido comprobar", ORO],
  ];
  const wc = 3.3;
  cifras.forEach(([numero, glosa, color], index) => {
    const y = 1.9 + index * 1.08;
    rect(slide, M, y, wc, 0.96, C.white);
    rect(slide, M, y, 0.06, 0.96, color);
    addText(slide, numero, { x: M + 0.24, y: y + 0.1, w: 1.0, h: 0.76, fontFace: TYPOGRAPHY.display, fontSize: 32, bold: true, color, valign: "mid" });
    addText(slide, glosa, { x: M + 1.2, y: y + 0.1, w: wc - 1.36, h: 0.76, fontSize: 11.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.05 });
  });

  const xd = M + wc + 0.4;
  const wd = CW - wc - 0.4;
  addKicker(slide, xd, 1.9, "Las cuatro cosas que esta sesión y la de la mañana encontraron ejecutando", VERDE, wd);
  const coincidencias = [
    ["La doble reserva", "Bloque 1", "La infirió del código."],
    ["La suplantación", "Bloque 2", "Sin autenticación: se reserva con cualquier RUT."],
    ["El contraste de «Tomado»", "Bloque 3", "Lo estimó en 2,6 a 1; medido, fue 2,55."],
    ["El [object Object]", "La mañana", "Lo dedujo de cómo FastAPI forma los errores, sin verlo en pantalla."],
  ];
  const wk = (wd - 0.2) / 2;
  coincidencias.forEach(([titulo, donde, glosa], index) => {
    const x = xd + (index % 2) * (wk + 0.2);
    const y = 2.22 + Math.floor(index / 2) * 1.06;
    rect(slide, x, y, wk, 0.94, C.white);
    rect(slide, x, y, 0.06, 0.94, VERDE);
    addText(slide, titulo, { x: x + 0.22, y: y + 0.08, w: wk - 1.4, h: 0.28, fontSize: 11.8, bold: true, color: C.ink });
    addText(slide, donde, { x: x + wk - 1.2, y: y + 0.1, w: 1.04, h: 0.24, fontSize: 9.4, bold: true, color: VERDE, align: "right" });
    addText(slide, glosa, { x: x + 0.22, y: y + 0.42, w: wk - 0.4, h: 0.48, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.04 });
  });
  rect(slide, xd, 4.46, wd, 0.64, NAVY_CHIP);
  addText(slide, "Y trajo hallazgos que nadie había hecho. Es una buena auditoría, y hay que decirlo con la misma claridad que sus errores.", {
    x: xd + 0.24,
    y: 4.5,
    w: wd - 0.4,
    h: 0.56,
    fontSize: 11,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });

  addTakeaway(slide, "Aun así, una auditoría es una lista de hipótesis.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 51 · Afirmacion por afirmacion

function slideAuditVerdicts() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · verificar", "Diez afirmaciones, diez verificaciones", "", false);

  const veredictos = {
    confirmado: ["Confirmado", VERDE],
    nuevo: ["Confirmado, nuevo", AZUL],
    refutado: ["Refutado", ROJO],
    noReproducido: ["No reproducido", ORO],
  };
  const filas = [
    ["Carrera entre consultar e insertar: doble reserva", "Veinte reservas simultáneas, bloque 1", "confirmado"],
    ["Sin autenticación: se reserva con cualquier RUT", "Prueba de suplantación, bloque 2", "confirmado"],
    ["Contraste de la ficha «Tomado»", "axe-core, bloque 3: 2,55 a 1", "confirmado"],
    ["Errores 422 como [object Object]", "Prueba de la mañana", "confirmado"],
    ["El RUT no se normaliza: se salta el límite de 3", "Cuatro reservas con el mismo RUT escrito distinto", "nuevo"],
    ["El botón queda deshabilitado ante una falla de red", "Prueba con la red cortada", "nuevo"],
    ["El diseño no se adapta a 320 píxeles", "Prueba con una ventana de 320 píxeles", "nuevo"],
    ["El borde de los campos tiene contraste 1,4 a 1", "Fórmula de las WCAG: 1,42 a 1", "nuevo"],
    ["httpx2 es un error de tipeo o un paquete malicioso", "Consulta a PyPI y a las dependencias de Starlette", "refutado"],
    ["Escrituras simultáneas producen errores 500", "Todas las tandas de carga y estrés del bloque 1", "noReproducido"],
  ];
  const x1 = M;
  const w1 = 5.3;
  const x2 = x1 + w1 + 0.1;
  const w2 = 4.3;
  const x3 = x2 + w2 + 0.1;
  const w3 = M + CW - x3;
  addText(slide, "HALLAZGO DEL AGENTE", { x: x1, y: 1.84, w: w1, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "CÓMO SE VERIFICÓ", { x: x2, y: 1.84, w: w2, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "VEREDICTO", { x: x3, y: 1.84, w: w3, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  filas.forEach(([hallazgo, como, clave], index) => {
    const y = 2.12 + index * 0.4;
    const [rotulo, color] = veredictos[clave];
    rect(slide, x1, y, CW, 0.35, index % 2 === 0 ? C.white : C.warm);
    addText(slide, hallazgo, { x: x1 + 0.14, y: y + 0.05, w: w1 - 0.2, h: 0.25, fontSize: 10.2, color: C.ink, valign: "mid" });
    addText(slide, como, { x: x2, y: y + 0.05, w: w2, h: 0.25, fontSize: 9.6, color: C.slate, valign: "mid" });
    rect(slide, x3, y + 0.04, w3 - 0.06, 0.27, color);
    addText(slide, rotulo, { x: x3 + 0.08, y: y + 0.05, w: w3 - 0.2, h: 0.25, fontSize: 9.6, bold: true, color: C.white, valign: "mid" });
  });

  addTakeaway(slide, "Ocho confirmadas, cuatro de ellas nuevas. Una refutada, una no reproducida.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 52 · Los confirmados nuevos

function slideNewConfirmed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · confirmados, nuevos", "Confirmados, y nadie los había buscado", "", false, {
    titleFontSize: 28,
  });

  const w = (CW - 0.4) / 3;
  const x1 = M;
  const x2 = M + w + 0.2;
  const x3 = M + 2 * (w + 0.2);
  const alto = 3.9;

  // RUT
  rect(slide, x1, 1.9, w, alto, C.white);
  rect(slide, x1, 1.9, w, 0.06, AZUL);
  addKicker(slide, x1 + 0.22, 2.08, "El RUT se compara como texto", AZUL, w - 0.4);
  addText(slide, "El mismo RUT escrito de cuatro formas. El sistema no lo normaliza —no lo lleva a una sola forma antes de comparar— y acepta las cuatro, sobre un límite de tres:", { x: x1 + 0.22, y: 2.36, w: w - 0.44, h: 0.72, fontSize: 9.6, color: C.ink, lineSpacingMultiple: 1.04 });
  ["11.111.111-1", "11111111-1", "11111111-1·", "11.111.111-1·"].forEach((rut, index) => {
    const y = 3.14 + index * 0.46;
    rect(slide, x1 + 0.22, y, w - 0.44, 0.38, C.editorBg);
    addText(slide, rut, { x: x1 + 0.36, y: y + 0.06, w: 2.2, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, color: C.white, valign: "mid" });
    addText(slide, "201", { x: x1 + w - 1.0, y: y + 0.06, w: 0.64, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, bold: true, color: index === 3 ? C.red : C.success, align: "right", valign: "mid" });
  });
  addText(slide, "· marca un espacio al final. La cuarta debió rechazarse.", { x: x1 + 0.22, y: 5.02, w: w - 0.44, h: 0.44, fontSize: 9.4, italic: true, color: C.slate, lineSpacingMultiple: 1.04 });

  // 320 px
  rect(slide, x2, 1.9, w, alto, C.white);
  rect(slide, x2, 1.9, w, 0.06, ROJO);
  addKicker(slide, x2 + 0.22, 2.08, "No se adapta a 320 píxeles", ROJO, w - 0.4);
  addText(slide, "Con una ventana de 320 píxeles, la página midió:", { x: x2 + 0.22, y: 2.38, w: w - 0.44, h: 0.44, fontSize: 10.4, color: C.ink, lineSpacingMultiple: 1.04 });
  const escala = (w - 0.44) / 514;
  rect(slide, x2 + 0.22, 3.0, 514 * escala, 0.5, C.warm, ROJO);
  rect(slide, x2 + 0.22, 3.0, 320 * escala, 0.5, AZUL);
  addText(slide, "320 visibles", { x: x2 + 0.3, y: 3.08, w: 320 * escala - 0.1, h: 0.34, fontSize: 10, bold: true, color: C.white, valign: "mid" });
  addText(slide, "514", { x: x2 + 0.22 + 320 * escala, y: 3.08, w: 194 * escala - 0.08, h: 0.34, fontSize: 12, bold: true, color: ROJO, align: "right", valign: "mid" });
  addText(slide, "Para ver el formulario completo hay que desplazarse hacia los lados.", { x: x2 + 0.22, y: 3.66, w: w - 0.44, h: 0.5, fontSize: 10.4, color: C.ink, lineSpacingMultiple: 1.04 });
  addText(slide, "WCAG 2.2 · 1.4.10 Reflow · AA: sin desplazamiento en dos direcciones a un ancho de 320 píxeles.", { x: x2 + 0.22, y: 4.3, w: w - 0.44, h: 0.66, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.04 });

  // Borde
  rect(slide, x3, 1.9, w, alto, C.white);
  rect(slide, x3, 1.9, w, 0.06, ORO);
  addKicker(slide, x3 + 0.22, 2.08, "Bordes que casi no se ven", ORO, w - 0.4);
  addText(slide, "Gris #d4d9df sobre blanco:", { x: x3 + 0.22, y: 2.38, w: w - 0.44, h: 0.3, fontSize: 10.4, color: C.ink });
  addText(slide, "1,42 a 1", { x: x3 + 0.22, y: 2.78, w: w - 0.44, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 24, bold: true, color: ROJO });
  addText(slide, "El criterio 1.4.11 pide 3 a 1 para lo que identifica a un componente de la interfaz.", { x: x3 + 0.22, y: 3.4, w: w - 0.44, h: 0.66, fontSize: 10.4, color: C.ink, lineSpacingMultiple: 1.04 });
  addText(slide, "axe-core no lo detectó: no revisa el contraste de los bordes. Otro ejemplo de lo que la herramienta no ve.", { x: x3 + 0.22, y: 4.3, w: w - 0.44, h: 0.8, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.04 });

  addTakeaway(slide, "Un agente que lee todo el código encuentra lo que nadie buscó.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 53 · Refutado y no reproducido

function slideRefutedNotReproduced() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · los que no se sostienen", "Una sospecha razonable no es un hallazgo", "", false, {
    titleFontSize: 28,
  });

  const w = (CW - 0.4) / 2;
  const casos = [
    [
      M,
      "Refutado",
      ROJO,
      "«httpx2: probable error o typosquatting»",
      "Typosquatting: publicar un paquete malicioso con un nombre parecido al de uno legítimo. El conocido se llama httpx, y el agente declaró que no lo verificó en PyPI, el repositorio público de paquetes de Python.",
      ["httpx2 lo publica Tom Christie, el autor de httpx.", "Su código está en el repositorio de la organización Pydantic.", "Starlette, que FastAPI usa por debajo, lo declara entre sus dependencias."],
      "Una afirmación sobre una dependencia se resuelve mirando la fuente, no el nombre.",
    ],
    [
      M + w + 0.4,
      "No reproducido",
      ORO,
      "«Las escrituras simultáneas producen errores 500»",
      "Lo dedujo porque la conexión «no configura timeout», es decir, un plazo de espera.",
      ["En ninguna de las diez tandas del bloque 1, con hasta 2.000 usuarios, hubo un error 500.", "Las fallas con 2.000 fueron conexiones cortadas.", "La premisa era inexacta: la conexión espera 5 segundos por omisión."],
      "La deducción era plausible, y la ejecución no la confirmó.",
    ],
  ];
  casos.forEach(([x, veredicto, color, afirmacion, contexto, pruebas, cierre]) => {
    rect(slide, x, 1.9, w, 4.06, C.white);
    rect(slide, x, 1.9, w, 0.06, color);
    rect(slide, x + 0.24, 2.1, 1.9, 0.32, color);
    addText(slide, veredicto.toUpperCase(), { x: x + 0.24, y: 2.12, w: 1.9, h: 0.28, fontSize: 9.6, bold: true, color: C.white, align: "center", valign: "mid", charSpacing: 1 });
    addText(slide, afirmacion, { x: x + 0.24, y: 2.56, w: w - 0.48, h: 0.34, fontSize: 12.4, bold: true, italic: true, color: C.ink });
    addText(slide, contexto, { x: x + 0.24, y: 2.94, w: w - 0.48, h: 0.66, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.05 });
    pruebas.forEach((texto, index) => {
      const y = 3.7 + index * 0.44;
      rect(slide, x + 0.24, y + 0.12, 0.14, 0.14, color);
      addText(slide, texto, { x: x + 0.5, y, w: w - 0.74, h: 0.4, fontSize: 10.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
    });
    rect(slide, x + 0.24, 5.12, w - 0.48, 0.66, C.warm);
    addText(slide, cierre, { x: x + 0.38, y: 5.16, w: w - 0.76, h: 0.58, fontSize: 10.8, bold: true, color: C.ink, valign: "mid", lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "Si se hubieran aceptado sin ejecutar, el informe tendría un paquete malicioso que no lo es y un error que no ocurre.", {
    fontSize: 12.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 54 · Depende del requisito

function slideDependsOnRequirement() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · lo que ninguna ejecución resuelve", "Reales, y dependen del requisito", "", false, {
    titleFontSize: 28,
  });

  const w = (CW - 0.4) / 3;
  const casos = [
    ["No guarda la fecha de las reservas", "Solo admite ocho reservas en toda su vida.", "¿Cuántos días se reservan?"],
    ["El comprobante devuelve el RUT y el correo completos", "El comprobante es el texto de confirmación que la API devuelve al aceptar una reserva.", "¿Qué datos necesita ver la persona?"],
    ["Límite de 10 reservas por minuto por dirección", "Una propuesta del agente contra el abuso.", "¿Cuántos intentos por minuto son un uso normal?"],
  ];
  casos.forEach(([titulo, glosa, pregunta], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 1.9, w, 2.7, C.white);
    rect(slide, x, 1.9, w, 0.06, AZUL);
    addText(slide, titulo, { x: x + 0.24, y: 2.08, w: w - 0.48, h: 0.64, fontSize: 13, bold: true, color: C.ink, lineSpacingMultiple: 1.04 });
    addText(slide, glosa, { x: x + 0.24, y: 2.78, w: w - 0.48, h: 0.8, fontSize: 10.2, color: C.slate, lineSpacingMultiple: 1.05 });
    rect(slide, x + 0.24, 3.7, w - 0.48, 0.72, NAVY_CHIP);
    addText(slide, pregunta, { x: x + 0.36, y: 3.74, w: w - 0.72, h: 0.64, fontSize: 11.2, bold: true, color: C.white, valign: "mid", lineSpacingMultiple: 1.04 });
  });

  rect(slide, M, 4.84, CW, 1.08, C.warm);
  rect(slide, M, 4.84, 0.06, 1.08, ROJO);
  addKicker(slide, M + 0.3, 4.98, "Ley 21.719 · principio de proporcionalidad", ROJO, 8);
  addText(slide, "Pide tratar solo los datos necesarios para el fin. Si la persona no necesita ver su RUT y su correo completos en el comprobante, devolverlos no es proporcional; pero eso lo decide quien sabe para qué sirve el comprobante.", {
    x: M + 0.3,
    y: 5.26,
    w: CW - 0.6,
    h: 0.62,
    fontSize: 10.8,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });

  addTakeaway(slide, "Si no puedes decidir el umbral sin preguntarle a nadie, el hallazgo es real pero su umbral no es tuyo.", {
    fontSize: 12.6,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 55 · La correccion que dejo un defecto

function slideRegressionStory() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la corrección que dejó un defecto", "El doble clic, resuelto; la red, no", "", false, {
    titleFontSize: 28,
  });

  const pasos = [
    ["Esta mañana", "La corrección del doble clic deshabilita el botón al enviar el formulario.", AZUL],
    ["Al terminar", "El manejador —la función que se ejecuta al enviar— vuelve a habilitar el botón en su última línea.", VERDE],
    ["Si la red falla", "fetch, la función que envía la solicitud, lanza un error, y el manejador se interrumpe antes de su última línea.", ROJO],
    ["Resultado", "El botón queda deshabilitado para siempre: no se puede reintentar sin recargar la página.", ROJO],
  ];
  const w = (CW - 0.3 * 3) / 4;
  pasos.forEach(([titulo, glosa, color], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 1.94, w, 1.9, index === 3 ? C.warm : C.white);
    rect(slide, x, 1.94, w, 0.06, color);
    circulo(slide, x + 0.36, 2.34, 0.38, color, String(index + 1), C.white, 12);
    addText(slide, titulo, { x: x + 0.64, y: 2.18, w: w - 0.8, h: 0.34, fontSize: 12.2, bold: true, color: C.ink, valign: "mid" });
    addText(slide, glosa, { x: x + 0.22, y: 2.66, w: w - 0.44, h: 1.1, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.08 });
    if (index < 3) arrow(slide, x + w + 0.04, 2.9, 0.22, C.slate);
  });

  rect(slide, M, 4.1, CW, 0.9, C.white);
  rect(slide, M, 4.1, 0.06, 0.9, ORO);
  addText(slide, "El sistema original no tenía este defecto, porque tampoco deshabilitaba el botón. Las pruebas del doble clic no lo vieron porque ninguna corta la red.", {
    x: M + 0.3,
    y: 4.16,
    w: CW - 0.6,
    h: 0.78,
    fontSize: 12,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });

  rect(slide, M, 5.18, CW, 0.78, NAVY_CHIP);
  addText(slide, "Regresión: un defecto que una corrección introduce en algo que antes funcionaba.", {
    x: M + 0.3,
    y: 5.24,
    w: CW - 0.6,
    h: 0.66,
    fontSize: 13,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  addTakeaway(slide, "La corrección arregló el doble clic y abrió un camino nuevo que nadie probó.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 56 · La prueba de la red cortada

function slideNetworkTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el hallazgo, en prueba", "Magnitud, método y umbral", "", false);

  const filas = [
    ["Magnitud", "El estado del botón «Reservar» después de una solicitud fallida"],
    ["Método", "Cortar la red de la página con Playwright antes de enviar, y leer el estado del botón"],
    ["Umbral", "El botón vuelve a estar habilitado"],
  ];
  filas.forEach(([pieza, valor], index) => {
    const y = 1.86 + index * 0.46;
    rect(slide, M, y, 1.7, 0.4, index === 2 ? ROJO : NAVY_CHIP);
    addText(slide, pieza.toUpperCase(), { x: M + 0.16, y: y + 0.08, w: 1.5, h: 0.24, fontSize: 9.8, bold: true, color: C.white, charSpacing: 1 });
    rect(slide, M + 1.74, y, CW - 1.74, 0.4, index === 2 ? C.warm : C.white);
    addText(slide, valor, { x: M + 1.92, y: y + 0.06, w: CW - 2.1, h: 0.28, fontSize: 11.4, bold: index === 2, color: C.ink, valign: "mid" });
  });

  const wl = 8.2;
  codigo(slide, {
    x: M,
    y: 3.34,
    w: wl,
    lang: "typescript",
    fontSize: 8.4,
    title: "pruebas/verificacion.spec.ts",
    marcas: [
      { linea: 4, color: C.gold, numero: 1 },
      { linea: 12, color: VERDE, numero: 2 },
    ],
    code: [
      'test("si la red falla, el botón vuelve a quedar disponible", async ({ page }) => {',
      '  await page.goto("/");',
      '  await expect(page.getByRole("listitem")).toHaveCount(8);',
      '  await page.route("**/reservas", (ruta) => ruta.abort());',
      "",
      '  await page.getByLabel("Nombre").fill("Ana Rivas");',
      '  await page.getByLabel("RUT").fill("11.111.111-1");',
      '  await page.getByLabel("Correo electrónico").fill("ana.rivas@ejemplo.cl");',
      '  await page.getByLabel("Bloque", { exact: true }).selectOption("4");',
      '  await page.getByLabel("Personas").fill("12");',
      '  await page.getByRole("button", { name: "Reservar" }).click();',
      '  await expect(page.getByRole("button", { name: "Reservar" })).toBeEnabled();',
      "});",
    ].join("\n"),
  });

  const xd = M + wl + 0.24;
  const wd = CW - wl - 0.24;
  rect(slide, xd, 3.34, wd, 1.3, C.white);
  rect(slide, xd, 3.34, 0.06, 1.3, ORO);
  circulo(slide, xd + 0.34, 3.62, 0.28, C.gold, 1, C.navy, 9.4);
  addText(slide, "page.route", { x: xd + 0.6, y: 3.48, w: wd - 0.76, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 10.4, bold: true, color: C.ink });
  addText(slide, "Intercepta toda solicitud a /reservas y la corta, como si la red se hubiera caído.", { x: xd + 0.24, y: 3.86, w: wd - 0.4, h: 0.74, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.04 });
  terminal(slide, {
    x: xd,
    y: 4.82,
    w: wd,
    title: "Contra la interfaz de la mañana",
    fontSize: 9,
    lines: [
      { t: "Error: expect(locator).toBeEnabled() failed", k: "err" },
      { t: "Expected: enabled", k: "muted" },
      { t: "Received: disabled", k: "err" },
    ],
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 57 · La correccion con finally

function slideFinallyFix() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la corrección", "Rehabilitar el botón pase lo que pase", "", false, {
    titleFontSize: 28,
  });

  const wl = 7.6;
  codigo(slide, {
    x: M,
    y: 1.7,
    w: wl,
    lang: "javascript",
    fontSize: 7.4,
    title: "interfaz/app.js",
    marcas: [
      { linea: 8, color: C.gold, numero: 1 },
      { linea: 25, color: ROJO, numero: 2 },
      { linea: 28, color: VERDE, numero: 3 },
    ],
    code: [
      'formulario.addEventListener("submit", async (evento) => {',
      "  evento.preventDefault();",
      '  const boton = formulario.querySelector("button");',
      "  if (boton.disabled) return;",
      "  boton.disabled = true;",
      "  const datos = Object.fromEntries(new FormData(formulario));",
      "",
      "  try {",
      '    const respuesta = await fetch("/reservas", {',
      '      method: "POST",',
      '      headers: { "Content-Type": "application/json" },',
      "      body: JSON.stringify(datos),",
      "    });",
      "    const cuerpo = await respuesta.json();",
      "",
      "    if (respuesta.ok) {",
      '      mensaje.className = "mensaje exito";',
      "      mensaje.textContent = `Reserva confirmada. ${cuerpo.comprobante}`;",
      "      formulario.reset();",
      "      cargarBloques();",
      "    } else {",
      '      mensaje.className = "mensaje error";',
      "      mensaje.textContent = cuerpo.detail;",
      "    }",
      "  } catch {",
      '    mensaje.className = "mensaje error";',
      '    mensaje.textContent = "No se pudo conectar con el sistema. Intenta de nuevo.";',
      "  } finally {",
      "    boton.disabled = false;",
      "  }",
      "});",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const piezas = [
    [1, C.gold, "try", "Agrupa lo que puede fallar."],
    [2, ROJO, "catch", "Se ejecuta si algo dentro de try lanza un error, como el fetch sin red. Le dice a la persona qué ocurrió."],
    [3, VERDE, "finally", "Se ejecuta siempre, haya fallado o no. Ahí tiene que estar la línea que rehabilita el botón."],
  ];
  piezas.forEach(([numero, color, palabra, glosa], index) => {
    const y = 1.84 + index * 1.2;
    rect(slide, xd, y, wd, 1.08, C.white);
    rect(slide, xd, y, 0.06, 1.08, color === C.gold ? ORO : color);
    circulo(slide, xd + 0.34, y + 0.28, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, palabra, { x: xd + 0.6, y: y + 0.12, w: wd - 0.76, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.24, y: y + 0.46, w: wd - 0.4, h: 0.58, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.04 });
  });
  terminal(slide, {
    x: xd,
    y: 5.52,
    w: wd,
    title: "La nueva y las dos del doble clic, en tres navegadores",
    fontSize: 10,
    lines: [{ t: "  9 passed (25.7s)", k: "ok" }],
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 58 · Los umbrales del agente

function slideAgentThresholds() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · los umbrales", "El agente propone; el umbral se decide", "", false, {
    titleFontSize: 28,
  });

  addText(slide, "Cada hallazgo de la auditoría traía un umbral, y el agente los declaró como «valores de referencia propuestos». Esa es exactamente su condición:", {
    x: M,
    y: 1.86,
    w: CW,
    h: 0.56,
    fontSize: 12.2,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  const umbrales = [
    ["p95 de 200 ms", "para las solicitudes a la API"],
    ["10 reservas por minuto", "por dirección"],
    ["90 % de las ramas", "caminos de cada if recorridos por pruebas"],
  ];
  const w = (CW - 0.4) / 3;
  umbrales.forEach(([valor, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.6, w, 1.14, C.white, C.border);
    addText(slide, "PROPUESTO", { x: x + 0.24, y: 2.72, w: w - 0.4, h: 0.22, fontSize: 9, bold: true, color: ORO, charSpacing: 1.2 });
    addText(slide, valor, { x: x + 0.24, y: 2.96, w: w - 0.4, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.24, y: 3.38, w: w - 0.4, h: 0.28, fontSize: 10.2, color: C.slate });
  });

  addKicker(slide, M, 4.0, "Razonables y bien formulados. Ninguno salió de un requisito: el agente no sabe…", C.slate, 11);
  const noSabe = [
    "cuántas personas usan el laboratorio",
    "cuánto está dispuesta a esperar una de ellas",
    "cuánto intento de reserva es normal en una semana de evaluaciones",
  ];
  noSabe.forEach((texto, index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 4.32, w, 0.7, C.warm);
    addText(slide, texto, { x: x + 0.2, y: 4.36, w: w - 0.4, h: 0.62, fontSize: 11, color: C.ink, valign: "mid", lineSpacingMultiple: 1.04 });
  });

  const wm = (CW - 0.2) / 2;
  rect(slide, M, 5.2, wm, 0.76, VERDE);
  addText(slide, "El agente puede proponer la magnitud y el método, y los propone bien.", { x: M + 0.24, y: 5.24, w: wm - 0.44, h: 0.68, fontSize: 11.4, bold: true, color: C.white, valign: "mid", lineSpacingMultiple: 1.04 });
  rect(slide, M + wm + 0.2, 5.2, wm, 0.76, NAVY_CHIP);
  addText(slide, "El umbral es una decisión sobre lo que el sistema le debe a quien lo usa.", { x: M + wm + 0.44, y: 5.24, w: wm - 0.44, h: 0.68, fontSize: 11.4, bold: true, color: C.white, valign: "mid", lineSpacingMultiple: 1.04 });

  addTakeaway(slide, "El umbral lo toma quien conoce el requisito.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 59 y 60 · Preguntas y respuestas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar", [
    [
      "El agente encontró leyendo lo mismo que la sesión encontró ejecutando, y más. ¿Para qué ejecutar entonces?",
      "Mira qué pasó con httpx2 y con los errores 500. ¿Qué habría quedado en el informe si se hubieran aceptado todas sin ejecutarlas?",
    ],
    [
      "La corrección del doble clic pasó todas sus pruebas y dejó un defecto nuevo. ¿Fue una mala corrección?",
      "Separa lo que la corrección arregló de lo que ninguna prueba recorría. ¿Qué prueba habría hecho falta esa misma mañana?",
    ],
    [
      "El agente propuso un límite de diez reservas por minuto por dirección. ¿Se puede escribir ya la prueba de ese requisito?",
      "La prueba se puede escribir. ¿El número diez es un requisito o una propuesta, y quién tendría que confirmarlo?",
    ],
  ]);
}

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "Para separar hipótesis de hechos",
      "Sin ejecutar, el informe diría que httpx2 es malicioso y que la base da errores 500.",
      "Leer produce hipótesis; ejecutar decide cuáles se sostienen.",
      "Copiar la auditoría al informe tal como llegó.",
    ],
    [
      "No: arregló lo que prometía",
      "Faltaba una prueba que cortara la red, y por eso nadie vio el camino nuevo.",
      "Después de cada cambio se ejecuta todo, no solo la prueba que lo motivó.",
      "Probar solo lo que la corrección quería arreglar.",
    ],
    [
      "La prueba sí; el número todavía no",
      "Diez es una propuesta razonable, no un requisito.",
      "El umbral lo confirma quien conoce el uso normal del sistema.",
      "Convertir una propuesta en requisito por escribirla en una prueba.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 61 · Lo que cada prueba puede afirmar

function slideWhatEachCanClaim() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "Lo que cada prueba no funcional puede afirmar", "", false, {
    titleFontSize: 27,
  });

  const wl = 2.7;
  const wc = (CW - wl - 0.28) / 2;
  const xA = M + wl + 0.14;
  const xB = xA + wc + 0.14;
  addKicker(slide, xA, 1.88, "Qué puede afirmar", VERDE, wc);
  addKicker(slide, xB, 1.88, "Qué no puede afirmar", ROJO, wc);
  const filas = [
    [ROJO, "Carga", "Que responde dentro del umbral con la cantidad de personas prevista, en esas condiciones.", "Que lo que respondió sea correcto."],
    [ROJO, "Estrés", "Dónde deja de cumplir y cómo falla, en esa máquina.", "El límite en otra máquina."],
    [ORO, "Seguridad escrita", "Que un ataque concreto no prospera, o que sí.", "Que no existan otros ataques."],
    [ORO, "bandit y pip-audit", "Qué patrones inseguros y qué vulnerabilidades conocidas hay hoy.", "Si un hallazgo es explotable, ni qué se publicará mañana."],
    [AZUL, "axe-core", "Qué reglas automáticas no se cumplen en el estado revisado.", "Si los textos significan algo, ni lo que no revisa."],
    [AZUL, "Portabilidad", "Que la suite da lo mismo en cada entorno probado.", "Nada sobre los entornos no probados."],
  ];
  filas.forEach(([color, prueba, puede, noPuede], index) => {
    const y = 2.18 + index * 0.64;
    rect(slide, M, y, wl, 0.56, color);
    addText(slide, prueba, { x: M + 0.18, y: y + 0.06, w: wl - 0.3, h: 0.44, fontSize: 12, bold: true, color: C.white, valign: "mid" });
    rect(slide, xA, y, wc, 0.56, C.white);
    addText(slide, puede, { x: xA + 0.18, y: y + 0.04, w: wc - 0.34, h: 0.48, fontSize: 10.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.04 });
    rect(slide, xB, y, wc, 0.56, C.white);
    addText(slide, noPuede, { x: xB + 0.18, y: y + 0.04, w: wc - 0.34, h: 0.48, fontSize: 10.2, color: C.slate, valign: "mid", lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "La columna derecha no son defectos: es lo que una persona tiene que completar.", {
    fontSize: 12.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 62 · La afirmacion que se puede sostener

function slideDefensibleClaim() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "Lo que hoy se puede sostener", "", false);

  const afirmaciones = [
    "Con cien personas a la vez responde dentro del umbral fijado antes de medir, y se sabe dónde deja de hacerlo en esta máquina.",
    "Dos reservas simultáneas del mismo bloque ya no se aceptan las dos: una prueba falló diez de diez antes de la corrección.",
    "Se sabe qué ataque prospera hoy, y hay una prueba que lo muestra.",
    "La interfaz cumple las reglas automáticas en el estado que se ve a media mañana, se usa solo con teclado, y funciona igual en tres navegadores y dos versiones de Python.",
  ];
  const wl = 7.4;
  afirmaciones.forEach((texto, index) => {
    const y = 1.9 + index * 1.0;
    rect(slide, M, y, wl, 0.9, C.white);
    rect(slide, M, y, 0.06, 0.9, VERDE);
    addText(slide, String(index + 1), { x: M + 0.22, y: y + 0.14, w: 0.4, h: 0.6, fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color: VERDE, valign: "mid" });
    addText(slide, texto, { x: M + 0.74, y: y + 0.06, w: wl - 0.96, h: 0.78, fontSize: 11.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.08 });
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  rect(slide, xd, 1.9, wd, 3.9, NAVY_CHIP);
  addKicker(slide, xd + 0.3, 2.08, "Lo que sigue sin poder afirmarse", C.gold, wd - 0.6);
  addText(slide, "Cuál de todo esto había que atender primero.", {
    x: xd + 0.3,
    y: 2.38,
    w: wd - 0.6,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 17,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.06,
  });
  addText(slide, "EN ROJO", { x: xd + 0.3, y: 3.3, w: wd - 0.6, h: 0.22, fontSize: 9, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "La suplantación, el [object Object] y la pantalla angosta.", { x: xd + 0.3, y: 3.54, w: wd - 0.6, h: 0.5, fontSize: 11.2, color: C.sand, lineSpacingMultiple: 1.06 });
  addText(slide, "ESPERANDO UN REQUISITO", { x: xd + 0.3, y: 4.16, w: wd - 0.6, h: 0.22, fontSize: 9, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "La fecha de las reservas, el comprobante con datos completos y el límite de intentos.", { x: xd + 0.3, y: 4.4, w: wd - 0.6, h: 0.7, fontSize: 11.2, color: C.sand, lineSpacingMultiple: 1.06 });
  addText(slide, "Nadie ha decidido en qué orden.", { x: xd + 0.3, y: 5.18, w: wd - 0.6, h: 0.4, fontSize: 12, bold: true, color: C.white });

  addTakeaway(slide, "A lo que la mañana dejó defendible sobre la persona, hoy se agrega cómo se comporta el sistema.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 63 · Puente a la proxima sesion

function slideTomorrow() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mañana · 08:30 · Clase 14", "Cuánto de todo esto vale la pena probar", "", false, {
    titleFontSize: 28,
  });

  addText(slide, "La próxima sesión se ocupa del plan de pruebas: el documento donde se declara qué se prueba, qué queda fuera y con qué criterio se reparte el esfuerzo.", {
    x: M,
    y: 1.9,
    w: CW,
    h: 0.56,
    fontSize: 12.6,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  const pendientes = [
    ["La suplantación", ROJO],
    ["La condición de carrera, ya corregida", VERDE],
    ["El RUT sin normalizar", ROJO],
    ["El botón bloqueado, ya corregido", VERDE],
    ["La pantalla angosta", ROJO],
    ["Los 28 hallazgos del agente", ORO],
  ];
  const w = (CW - 0.4) / 3;
  pendientes.forEach(([texto, color], index) => {
    const x = M + (index % 3) * (w + 0.2);
    const y = 2.66 + Math.floor(index / 3) * 0.72;
    rect(slide, x, y, w, 0.6, C.white);
    rect(slide, x, y, 0.06, 0.6, color);
    addText(slide, texto, { x: x + 0.24, y: y + 0.08, w: w - 0.4, h: 0.44, fontSize: 12, bold: true, color: C.ink, valign: "mid" });
  });

  rect(slide, M, 4.28, CW, 1.64, NAVY_CHIP);
  addKicker(slide, M + 0.34, 4.46, "Llega con esta pregunta", C.gold, 6);
  addText(slide, "Si no hay tiempo para probarlo todo, ¿con qué criterio se decide cuál probar primero?", {
    x: M + 0.34,
    y: 4.78,
    w: CW - 0.68,
    h: 1.0,
    fontSize: 16,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.16,
  });

  addTakeaway(slide, "Hoy se probó cómo se comporta el sistema. Mañana, qué vale la pena probar primero.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 64 · Mensaje final

function slideFinalMessage() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 0.9, "Mensaje final", C.gold, 5);

  const verdes = [
    "La prueba de carga no tuvo fallas mientras dos personas quedaban con el mismo bloque.",
    "La revisión de accesibilidad pasó con la página vacía.",
    "pip-audit no encontró nada que alguien conozca hoy.",
    "La corrección del doble clic pasó sus pruebas y dejó un botón bloqueado para siempre.",
  ];
  const w = (CW - 0.14 * 3) / 4;
  verdes.forEach((texto, index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 1.3, w, 0.96, NAVY_CHIP);
    rect(slide, x, 1.3, w, 0.05, C.success);
    addText(slide, texto, { x: x + 0.18, y: 1.4, w: w - 0.32, h: 0.8, fontSize: 10.4, color: C.sand, lineSpacingMultiple: 1.08 });
  });
  addText(slide, "Todo lo que esta sesión encontró estaba detrás de un resultado en verde.", {
    x: M,
    y: 2.44,
    w: CW,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: C.gold,
  });

  rule(slide, M, 3.1, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Un sistema no es rápido, seguro ni accesible: lo es con cierta carga, frente a cierto ataque, en cierto estado de la pantalla, para cierta persona. Probar cómo se comporta exige decir primero cuánto es suficiente, y después desconfiar de todo verde que no se sabe qué midió.",
    { x: M, y: 3.3, w: CW, h: 1.8, fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: C.white, lineSpacingMultiple: 1.18 }
  );
  addText(
    slide,
    "Un agente lee el código más rápido que cualquiera y propone umbrales razonables. Decidir cuáles son los del sistema sigue siendo trabajo de quien firma.",
    { x: M, y: 5.3, w: CW, h: 0.8, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.18 }
  );
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Orden del deck.

slideCover();
slideVocabulary();
slideOpening();
slideFunctionalVsNot();
slideNineCharacteristics();
slideMap();

slideBlockOneDivider();
slideThresholdFirst();
slidePercentile();
slideLocustfile();
slideLoadResults();
slideStress();
slideWhatLoadMissed();
slideRaceCondition();
slideConcurrencyTest();
slideTheFix();
slideRepeatMeasure();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideSecuritySources();
slideSecurityLaw();
slideWhoActs();
slideInjectionTest();
slideImpersonationTest();
slideSecurityResults();
slideNotOneLine();
slideBandit();
slideBanditVerdict();
slideFragileDesign();
slidePipAudit();
slideGreenToday();
slideLawDuties();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideAccessibilityWho();
slideContrastCriterion();
slideAxeTest();
slideAxeTwoStates();
slideContrastFix();
slideWhatAxeMisses();
slideKeyboardTest();
slideThreeBrowsers();
slideTwoPythons();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideAuditRequest();
slideAuditResult();
slideAuditVerdicts();
slideNewConfirmed();
slideRefutedNotReproduced();
slideDependsOnRequirement();
slideRegressionStory();
slideNetworkTest();
slideFinallyFix();
slideAgentThresholds();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideWhatEachCanClaim();
slideDefensibleClaim();
slideTomorrow();
slideFinalMessage();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
