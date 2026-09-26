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
  subject: "PRO402 · Clase 13",
  title: "La persona no lee el contrato",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-13-La-Persona-No-Lee-El-Contrato.pptx");

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

const ASSETS13 = {
  inicio: path.resolve(__dirname, "assets/interfaz-inicio.png"),
  object: path.resolve(__dirname, "assets/interfaz-object.png"),
  dobleClic: path.resolve(__dirname, "assets/interfaz-doble-clic.png"),
};
const ASPECTO = { inicio: 2360 / 1400, object: 908 / 956, dobleClic: 2360 / 1400 };

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
  ["Abrir", "Por donde lo usa una persona"],
  ["Esperar", "Una condición, no un tiempo"],
  ["Explorar", "Lo que nadie pensó en escribir"],
  ["Precisar", "Hasta que una prueba lo diga"],
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
  addKicker(slide, M, 1.42, "PRO402 · Clase 13 · Unidad 2", C.gold, 6);
  addText(slide, "La persona no lee el contrato", {
    x: M,
    y: 1.84,
    w: 11.2,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 50,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.12, 4.2, C.red, 3);
  addText(slide, "Pruebas de extremo a extremo, la espera que vuelve inestable una prueba y el agente que entra por primera vez", {
    x: M,
    y: 3.4,
    w: 11.2,
    h: 0.46,
    fontSize: 18,
    color: C.softBlue,
  });
  addText(
    slide,
    "La API puede cumplir su contrato al pie de la letra y la persona igual quedarse sin saber qué hacer. Ese defecto no vive en ninguna pieza: vive en lo que la pantalla muestra.",
    { x: M, y: 4.1, w: 10.2, h: 0.86, fontSize: 14.4, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  rule(slide, M, 5.46, CW, NAVY_RULE, 1);
  addText(slide, "Lunes 28 de septiembre de 2026 · 08:30 – 10:50 · Laboratorio PC", {
    x: M,
    y: 5.66,
    w: 7.4,
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
// 02 · Pregunta de entrada

function slideOpening() {
  const { slide } = createSlide("light");
  addHeader(slide, "Para abrir", "Veinte pruebas en verde. ¿Alguien abrió el sistema?", "", false, {
    titleFontSize: 25,
  });

  const hTerm = terminal(slide, {
    x: M,
    y: 2.3,
    w: 5.3,
    fontSize: 12.4,
    title: "La suite de pytest",
    lines: [
      { t: "uv run pytest -q", k: "cmd" },
      { t: "....................  [100%]", k: "muted" },
      { t: "20 passed in 0.71s", k: "ok" },
    ],
  });

  addText(slide, "uv run pytest ejecuta la suite; cada punto es una prueba que pasó.", {
    x: M,
    y: 2.4 + hTerm,
    w: 5.3,
    h: 0.26,
    fontSize: 10.4,
    italic: true,
    color: C.slate,
  });
  addText(slide, "Las veinte envían solicitudes desde un programa.", {
    x: M,
    y: 2.84 + hTerm,
    w: 5.3,
    h: 0.66,
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Ninguna abre la página.", {
    x: M,
    y: 3.6 + hTerm,
    w: 5.3,
    h: 0.36,
    fontSize: 15,
    bold: true,
    color: C.red,
  });

  navegador(slide, { x: 6.31, y: 2.0, w: 6.3, imagen: ASSETS13.inicio, aspecto: ASPECTO.inicio });

  addTakeaway(slide, "Desde hoy el sistema tiene algo que una persona puede abrir. Nadie lo ha probado.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · Dos lectores del mismo rechazo

function slideTwoReaders() {
  const { slide } = createSlide("light");
  addHeader(slide, "El testigo distinto", "El programa lee el contrato. La persona, la pantalla.", "", false, {
    titleFontSize: 26,
  });

  const w = (CW - 0.3) / 2;

  addKicker(slide, M, 1.96, "Lo que recibe un programa", AZUL, w);
  codigo(slide, {
    x: M,
    y: 2.26,
    w,
    lang: "json",
    fontSize: 11,
    title: "Respuesta 409 · formato JSON: pares de nombre y valor",
    code: '{\n  "detail": "La reserva no esta permitida"\n}',
  });
  addText(slide, "Lee el código de estado —el número con que la API dice qué pasó; 409 es un rechazo— y el campo detail. El contrato le dice qué significa cada uno.", {
    x: M,
    y: 3.72,
    w,
    h: 0.5,
    fontSize: 11.6,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  const xd = M + w + 0.3;
  addKicker(slide, xd, 1.96, "Lo que ve una persona", ROJO, w);
  rect(slide, xd, 2.26, w, 1.3, C.white, C.border);
  slide.addShape(SH.roundRect, {
    x: xd + 0.3,
    y: 2.46,
    w: w - 0.6,
    h: 0.42,
    rectRadius: 0.06,
    fill: { color: C.navy },
    line: { color: C.navy },
  });
  addText(slide, "Reservar", {
    x: xd + 0.36,
    y: 2.5,
    w: w - 0.72,
    h: 0.34,
    fontSize: 13,
    color: C.white,
    align: "center",
    valign: "mid",
  });
  addText(slide, "La reserva no esta permitida", {
    x: xd + 0.3,
    y: 3.02,
    w: w - 0.6,
    h: 0.34,
    fontSize: 14,
    color: ROJO,
  });
  addText(slide, "Lee una frase. No sabe si el bloque estaba tomado, si eran muchas personas, ni qué hacer ahora.", {
    x: xd,
    y: 3.72,
    w,
    h: 0.5,
    fontSize: 11.6,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M, 4.62, CW, 1.2, NAVY_CHIP);
  addKicker(slide, M + 0.34, 4.76, "Prueba de extremo a extremo", C.gold, 6);
  addText(
    slide,
    "Recorre el sistema por donde lo usa una persona —abre la página, escribe, aprieta, lee— y afirma algo sobre lo que esa persona encontró. No sustituye ninguna pieza. Lo que la distingue no es cuánto código toca, sino quién está mirando.",
    { x: M + 0.34, y: 5.02, w: CW - 0.68, h: 0.72, fontSize: 13, color: C.white, lineSpacingMultiple: 1.12 }
  );

  addTakeaway(slide, "Este nivel no agrega precisión: agrega un testigo distinto.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Mapa de la sesion como linea de tiempo

function slideMap() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la sesión", "140 minutos, de 08:30 a 10:50", "", false);

  const tramos = [
    ["Encuadre", 10, C.slate, ""],
    ["Abrir", 30, C.red, "La interfaz y el defecto que el contrato no puede tener"],
    ["Esperar", 25, ORO, "La primera prueba que falla sin que nadie toque nada"],
    ["Pausa", 10, C.border, ""],
    ["Explorar", 30, AZUL, "Lo que ninguna prueba escrita pensó en mirar"],
    ["Precisar", 25, VERDE, "De un hallazgo a una prueba que puede fallar"],
    ["Cierre", 10, C.slate, ""],
  ];
  const total = 140;
  const escala = CW / total;
  let x = M;
  let minuto = 0;
  tramos.forEach(([nombre, minutos, color, glosa]) => {
    const w = minutos * escala;
    const bloque = glosa !== "";
    rect(slide, x, 2.3, w - 0.04, bloque ? 0.62 : 0.34, color);
    if (bloque) {
      addText(slide, nombre.toUpperCase(), {
        x: x + 0.14,
        y: 2.42,
        w: w - 0.3,
        h: 0.24,
        fontSize: 12,
        bold: true,
        color: C.white,
        charSpacing: 0.9,
      });
      addText(slide, `${minutos} min`, {
        x: x + 0.14,
        y: 2.66,
        w: w - 0.3,
        h: 0.2,
        fontSize: 9.4,
        color: C.white,
      });
      rule(slide, x + 0.14, 3.1, w - 0.32, color, 1.6);
      addText(slide, glosa, {
        x: x + 0.14,
        y: 3.2,
        w: w - 0.3,
        h: 0.78,
        fontSize: 11,
        color: C.ink,
        lineSpacingMultiple: 1.12,
      });
    } else {
      addText(slide, `${nombre} · ${minutos}`, {
        x,
        y: 2.72,
        w: Math.max(w, 0.9),
        h: 0.2,
        fontSize: 8.4,
        color: C.slate,
      });
    }
    const hora = new Date(Date.UTC(2026, 0, 1, 8, 30 + minuto));
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
  addText(slide, "10:50", {
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
  addKicker(slide, M + 0.32, 4.48, "Sobre qué se trabaja", ROJO, 6);
  addText(
    slide,
    "El mismo proyecto de reserva de laboratorio, que hoy recibe algo que una persona puede abrir en un navegador: una interfaz web con el formulario y el estado de los bloques. Se entrega ya escrita. Sus pruebas se escriben en TypeScript —JavaScript con tipos declarados— y viven en una suite aparte: la de pytest no cambia.",
    { x: M + 0.32, y: 4.76, w: CW - 0.64, h: 0.96, fontSize: 12.6, color: C.ink, lineSpacingMultiple: 1.16 }
  );

  addTakeaway(slide, "Se abre, se espera, se explora y se precisa lo encontrado.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · Vocabulario de la sesion

function slideVocabulary() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida", "Cuatro palabras para toda la sesión", "", false, {
    titleFontSize: 30,
  });

  const terminos = [
    ["API", "La puerta por la que otros programas usan el sistema.", "La página la llama para reservar y para saber qué bloques están tomados.", AZUL],
    ["Contrato", "El acuerdo sobre la forma de lo que entra y lo que sale.", "Un rechazo se responde con el código 409 y un campo detail que dice qué pasó.", ORO],
    ["Suite", "Las pruebas que se ejecutan juntas con un solo comando.", "Hoy hay dos: la de pytest y la de la interfaz.", VERDE],
    ["Ejecutor", "El programa que encuentra las pruebas, las corre y resume el resultado.", "pytest para Python; Playwright, que maneja un navegador real, para la interfaz.", ROJO],
  ];
  const w = (CW - 0.2) / 2;
  terminos.forEach(([termino, def, ejemplo, color], index) => {
    const x = M + (index % 2) * (w + 0.2);
    const y = 2.02 + Math.floor(index / 2) * 1.98;
    rect(slide, x, y, w, 1.84, C.white);
    rect(slide, x, y, 0.07, 1.84, color);
    addText(slide, termino, {
      x: x + 0.32,
      y: y + 0.18,
      w: w - 0.6,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
    });
    addText(slide, def, {
      x: x + 0.32,
      y: y + 0.64,
      w: w - 0.6,
      h: 0.56,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, ejemplo, {
      x: x + 0.32,
      y: y + 1.3,
      w: w - 0.6,
      h: 0.42,
      fontSize: 11,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Un programa lee el contrato. Hoy se prueba lo que queda después de él.", { y: 6.1 });
  validateSlide(slide, pptx);
}
// ---------------------------------------------------------------------------
// 06 · Divisor del bloque 1

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "El defecto que el contrato no puede tener", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "La interfaz se lee, se prueba por primera vez con un navegador, y aparece una clase de defecto que ningún nivel anterior podía ver: la API cumple, las pruebas pasan, y la persona igual no sabe qué hacer.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 1, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · La interfaz, entregada ya escrita

function slideTheInterface() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la pieza nueva", "La interfaz, entregada ya escrita", "", false);

  navegador(slide, { x: M, y: 1.96, w: 6.3, imagen: ASSETS13.inicio, aspecto: ASPECTO.inicio });

  const archivos = [
    ["index.html", "La estructura", "El formulario, las etiquetas de cada campo y la zona donde aparecen los mensajes."],
    ["estilos.css", "El aspecto", "Colores, tarjetas y la grilla de bloques. No cambia lo que la página hace."],
    ["app.js", "El comportamiento", "Envía la reserva a la API, espera la respuesta y la muestra. Aquí vive el defecto."],
  ];
  archivos.forEach(([archivo, rol, glosa], index) => {
    const y = 1.96 + index * 1.14;
    const clave = index === 2;
    rect(slide, 7.42, y, 5.19, 1.02, clave ? C.warm : C.white);
    rect(slide, 7.42, y, 0.06, 1.02, clave ? ROJO : AZUL);
    addText(slide, archivo, {
      x: 7.66,
      y: y + 0.12,
      w: 2.0,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12,
      bold: true,
      color: clave ? ROJO : AZUL,
    });
    addText(slide, rol.toUpperCase(), {
      x: 10.4,
      y: y + 0.15,
      w: 2.0,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.slate,
      charSpacing: 0.8,
      align: "right",
    });
    addText(slide, glosa, {
      x: 7.66,
      y: y + 0.44,
      w: 4.8,
      h: 0.5,
      fontSize: 10.4,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  addText(slide, "Se lee, porque la sesión es sobre probarla y no sobre construirla.", {
    x: 7.42,
    y: 5.46,
    w: 5.19,
    h: 0.5,
    fontSize: 11,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Es la primera vez que el proyecto tiene algo que una persona puede abrir.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · Lo que hace la pagina al apretar Reservar

function slideAppJs() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · app.js", "Lo que hace la página al apretar «Reservar»", "", false, {
    titleFontSize: 27,
  });

  codigo(slide, {
    x: M,
    y: 1.9,
    w: 7.4,
    lang: "javascript",
    fontSize: 9.4,
    title: "app.js · lo que corre al enviar el formulario (preventDefault evita que la página se recargue)",
    marcas: [
      { linea: 3, color: C.gold, numero: 1 },
      { linea: 5, color: C.gold, numero: 2 },
      { linea: 12, color: VERDE, numero: 3 },
      { linea: 19, color: ROJO, numero: 4 },
    ],
    code: [
      'formulario.addEventListener("submit", async (evento) => {',
      "  evento.preventDefault();",
      "  const datos = Object.fromEntries(new FormData(formulario));",
      "",
      '  const respuesta = await fetch("/reservas", {',
      '    method: "POST",',
      '    headers: { "Content-Type": "application/json" },',
      "    body: JSON.stringify(datos),",
      "  });",
      "  const cuerpo = await respuesta.json();",
      "",
      "  if (respuesta.ok) {",
      '    mensaje.className = "mensaje exito";',
      "    mensaje.textContent = `Reserva confirmada. ${cuerpo.comprobante}`;",
      "    formulario.reset();",
      "    cargarBloques();",
      "  } else {",
      '    mensaje.className = "mensaje error";',
      "    mensaje.textContent = cuerpo.detail;",
      "  }",
      "});",
    ].join("\n"),
  });

  const notas = [
    [1, C.gold, "Reúne lo que la persona escribió", "Cada campo queda como texto, también los números: la cantidad de personas viaja como «12»."],
    [2, C.gold, "Envía y espera", "fetch manda los datos a la API, convertidos a texto JSON. await detiene esta función hasta que llega la respuesta, sin congelar la página."],
    [3, VERDE, "Éxito o rechazo", "respuesta.ok es verdadero si el código de estado indica éxito."],
    [4, ROJO, "Muestra lo que llegó, tal cual", "Pone en pantalla el campo detail de la respuesta. Funciona cuando detail es un texto."],
  ];
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const y = 1.9 + index * 1.16;
    rect(slide, 8.4, y, 4.21, 1.04, numero === 4 ? C.warm : C.white);
    circulo(slide, 8.72, y + 0.3, 0.3, color, numero, color === C.gold ? C.navy : C.white, 9.6);
    addText(slide, titulo, {
      x: 9.02,
      y: y + 0.17,
      w: 3.45,
      h: 0.26,
      fontSize: 12,
      bold: true,
      color: numero === 4 ? ROJO : C.ink,
    });
    addText(slide, glosa, {
      x: 9.02,
      y: y + 0.46,
      w: 3.45,
      h: 0.52,
      fontSize: 9.8,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · Anatomia de una prueba de extremo a extremo

function slideTestAnatomy() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · Playwright", "Una prueba tiene tres clases de piezas", "", false);

  codigo(slide, {
    x: M,
    y: 1.9,
    w: 7.4,
    lang: "typescript",
    fontSize: 10,
    title: "La primera prueba: el camino feliz, donde todo sale bien",
    marcas: [{ linea: 11, color: VERDE }],
    code: [
      'import { expect, test } from "@playwright/test";',
      "",
      'test("una reserva completa se confirma en pantalla", async ({ page }) => {',
      '  await page.goto("/");',
      "",
      '  await page.getByLabel("Nombre").fill("Ana Rivas");',
      '  await page.getByLabel("Bloque").selectOption("4");',
      '  await page.getByLabel("Personas").fill("12");',
      '  await page.getByRole("button", { name: "Reservar" }).click();',
      "",
      '  await expect(page.getByRole("status")).toContainText("Reserva confirmada");',
      "});",
    ].join("\n"),
  });

  const piezas = [
    ["Localizador", 'getByLabel("Nombre") · getByRole("button")', "Encuentra un elemento por su etiqueta, o por su rol: lo que es.", AZUL],
    ["Acción", 'fill · selectOption · click', "Escribir, elegir una opción, apretar: como una persona.", ORO],
    ["Aserción", 'toContainText("Reserva confirmada")', "Lo que afirma sobre lo que quedó en pantalla.", VERDE],
  ];
  piezas.forEach(([nombre, ejemplo, glosa, color], index) => {
    const y = 1.9 + index * 0.94;
    rect(slide, 8.36, y, 4.25, 0.84, C.white);
    rect(slide, 8.36, y, 0.06, 0.84, color);
    addText(slide, nombre.toUpperCase(), {
      x: 8.6,
      y: y + 0.1,
      w: 1.7,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, ejemplo, {
      x: 8.6,
      y: y + 0.32,
      w: 3.86,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.2,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: 8.6,
      y: y + 0.56,
      w: 3.86,
      h: 0.22,
      fontSize: 9.8,
      color: C.slate,
    });
  });

  rect(slide, 8.36, 4.8, 4.25, 1.2, NAVY_CHIP);
  addText(slide, "Se busca lo que la persona percibe", {
    x: 8.6,
    y: 4.92,
    w: 3.86,
    h: 0.26,
    fontSize: 12,
    bold: true,
    color: C.gold,
  });
  addText(
    slide,
    "Un botón que dice «Reservar», un campo con la etiqueta «Nombre». No «el tercer input del formulario», que cambia cada vez que alguien rediseña la página.",
    { x: 8.6, y: 5.2, w: 3.86, h: 0.74, fontSize: 9.8, color: C.white, lineSpacingMultiple: 1.12 }
  );

  addFuente(slide, 5.84, "page es la pestaña del navegador que Playwright le entrega limpia a cada prueba. El navegador corre sin ventana.", { w: 7.4 });

  addTakeaway(slide, "Si una prueba no encuentra el botón «Reservar», una persona tampoco.", { y: 6.18 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · El primer error: modo estricto

function slideStrictMode() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el primer error", "El primer error de la sesión no fue del sistema", "", false, {
    titleFontSize: 27,
  });

  const hT = terminal(slide, {
    x: M,
    y: 1.94,
    w: CW,
    title: "npx playwright test",
    fontSize: 10,
    lines: [
      { t: "Error: locator.selectOption: strict mode violation:", k: "err" },
      { t: "  getByLabel('Bloque') resolved to 2 elements:", k: "plain" },
      { t: '    1) <select id="bloque" name="bloque">…</select>', k: "muted" },
      { t: '    2) <ul id="bloques" aria-label="Estado de los bloques">…</ul>', k: "muted" },
    ],
  });

  const y = 2.1 + hT;
  addText(slide, "«Bloque» aparece en dos lugares", {
    x: M,
    y,
    w: 6,
    h: 0.28,
    fontSize: 13,
    bold: true,
    color: C.ink,
  });
  const candidatos = [
    ["La etiqueta del selector", "Bloque"],
    ["El nombre de la lista", "Estado de los bloques"],
  ];
  candidatos.forEach(([rotulo, texto], index) => {
    const x = M + index * 3.05;
    rect(slide, x, y + 0.4, 2.9, 0.92, C.white, C.border);
    addText(slide, rotulo.toUpperCase(), {
      x: x + 0.2,
      y: y + 0.52,
      w: 2.5,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.slate,
      charSpacing: 0.8,
    });
    addText(slide, texto, {
      x: x + 0.2,
      y: y + 0.78,
      w: 2.5,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
  });
  addText(slide, "getByLabel compara por fragmento y sin distinguir mayúsculas: hay dos candidatos. En modo estricto (strict mode), si un localizador encuentra más de un elemento, la acción falla.", {
    x: M,
    y: y + 1.44,
    w: 5.95,
    h: 0.5,
    fontSize: 11,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  addKicker(slide, 7.2, y, "La corrección que la herramienta sugiere", VERDE, 5.4);
  codigo(slide, {
    x: 7.2,
    y: y + 0.4,
    w: 5.41,
    lang: "typescript",
    fontSize: 10,
    code: 'page.getByLabel("Bloque", { exact: true })',
  });
  addText(slide, "exact: true exige que la etiqueta coincida completa.", {
    x: 7.2,
    y: y + 1.12,
    w: 5.41,
    h: 0.3,
    fontSize: 11,
    color: C.slate,
  });
  addText(slide, "En la salida, «…» es Playwright abreviando el contenido de cada elemento: la lista de opciones del selector y las fichas de la lista.", {
    x: 7.2,
    y: y + 1.5,
    w: 5.41,
    h: 0.5,
    fontSize: 10,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Ante dos candidatos no elige: falla. Una prueba que eligiera al azar pasaría hoy y fallaría mañana.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · El defecto en pantalla

function slideTheDefect() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el hallazgo", "Falta un dato, y la pantalla dice [object Object]", "", false, {
    titleFontSize: 26,
  });

  const wImg = 3.9;
  const hImg = wImg / ASPECTO.object;
  rect(slide, M, 1.9, wImg, hImg, C.white, C.border);
  slide.addImage({ path: ASSETS13.object, x: M + 0.02, y: 1.92, w: wImg - 0.04, h: hImg - 0.04 });
  circulo(slide, M + wImg - 0.34, 1.9 + hImg * 0.925, 0.34, ROJO, "!", C.white, 12);

  const x = M + wImg + 0.4;
  const w = CW - wImg - 0.4;
  addKicker(slide, x, 1.9, "Lo que la persona hizo", AZUL, w);
  addText(slide, "Llenó todo menos la cantidad de personas y apretó «Reservar». Necesitaba que la pantalla le dijera qué falta.", {
    x,
    y: 2.18,
    w,
    h: 0.56,
    fontSize: 12.4,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  const hT = terminal(slide, {
    x,
    y: 2.9,
    w,
    title: "La prueba que lo pide",
    fontSize: 10.2,
    lines: [
      { t: 'expect(getByRole("status")).toContainText("Personas")', k: "plain" },
      { t: 'Expected substring: "Personas"', k: "muted" },
      { t: 'Received string:    "[object Object]"', k: "err" },
      { t: "1 failed, 1 passed (8.9s)", k: "err" },
    ],
  });

  rect(slide, x, 3.08 + hT, w, 0.92, C.warm);
  rect(slide, x, 3.08 + hT, 0.06, 0.92, ROJO);
  addText(slide, "Qué es [object Object]", {
    x: x + 0.28,
    y: 3.18 + hT,
    w: w - 0.5,
    h: 0.26,
    fontSize: 12,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Lo que escribe JavaScript cuando convierte un objeto en texto sin que le digan cómo: la etiqueta genérica, no el contenido.", {
    x: x + 0.28,
    y: 3.46 + hT,
    w: w - 0.5,
    h: 0.5,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Donde la persona necesitaba leer qué corregir, la pantalla escribe una etiqueta genérica.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · Lo que respondio la API frente a lo que vio la persona

function slideApiDidItsJob() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · la lección", "La información llegó a la página. La página la tiró.", "", false, {
    titleFontSize: 26,
  });

  addKicker(slide, M, 1.88, "Lo que respondió la API · código 422: datos con forma inválida", AZUL, 7.6);
  const json = codigo(slide, {
    x: M,
    y: 2.14,
    w: 7.7,
    lang: "json",
    fontSize: 10.4,
    marcas: [{ linea: 4, color: VERDE, numero: 1 }],
    code: [
      "{",
      '  "detail": [{',
      '    "type": "int_parsing",',
      '    "loc": ["body", "personas"],',
      '    "msg": "Input should be a valid integer, unable to parse string as an integer",',
      '    "input": ""',
      "  }]",
      "}",
    ].join("\n"),
  });

  const xd = 8.66;
  const wd = CW - (xd - M);
  rect(slide, xd, 2.14, wd, json.h, C.white);
  rect(slide, xd, 2.14, 0.06, json.h, VERDE);
  circulo(slide, xd + 0.36, 2.44, 0.3, VERDE, 1, C.white, 9.6);
  addText(slide, "Hasta nombra el campo", {
    x: xd + 0.62,
    y: 2.31,
    w: wd - 0.8,
    h: 0.26,
    fontSize: 12.4,
    bold: true,
    color: VERDE,
  });
  addText(slide, "loc dice dónde está el problema: el campo personas del cuerpo de la solicitud. msg lo explica en inglés: debería ser un número entero. La API cumplió su contrato.", {
    x: xd + 0.24,
    y: 2.7,
    w: wd - 0.44,
    h: 1.2,
    fontSize: 12.4,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });

  const yB = 2.14 + json.h + 0.26;
  addKicker(slide, M, yB, "La línea de app.js que la recibe", ROJO, 7.6);
  const linea = codigo(slide, {
    x: M,
    y: yB + 0.28,
    w: 4.3,
    lang: "javascript",
    fontSize: 10.4,
    code: "mensaje.textContent = cuerpo.detail;",
  });
  arrow(slide, M + 4.42, yB + 0.28 + linea.h / 2, 0.5, ROJO, 2.2);
  rect(slide, M + 5.04, yB + 0.28, 2.66, linea.h, C.white, C.border);
  addText(slide, "[object Object]", {
    x: M + 5.14,
    y: yB + 0.32,
    w: 2.46,
    h: linea.h - 0.08,
    fontSize: 15,
    color: ROJO,
    valign: "mid",
  });
  terminal(slide, {
    x: xd,
    y: yB + 0.04,
    w: wd,
    title: "La suite de pytest",
    fontSize: 10,
    lines: [{ t: "20 passed in 0.71s", k: "ok" }],
  });

  addText(slide, "detail es una lista de objetos. Puesta en el párrafo, se convierte en texto sin que nadie diga cómo.", {
    x: M,
    y: yB + 0.4 + linea.h,
    w: 7.7,
    h: 0.5,
    fontSize: 11.6,
    color: C.slate,
  });

  addTakeaway(slide, "El defecto no está en ninguna pieza: está entre lo que la API responde y lo que la persona ve.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · Ningun nivel anterior ejecutaba app.js

function slideLevels() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · por qué nadie lo vio", "Ningún nivel anterior ejecutaba app.js", "", false);

  const columnas = ["La página · app.js", "La API", "Las reglas de reserva", "La base de datos"];
  const filas = [
    ["Unitaria", ["—", "—", "real", "—"]],
    ["Integración", ["cliente de pruebas", "real", "real", "real"]],
    ["Extremo a extremo", ["real", "real", "real", "real"]],
  ];
  const xRot = M;
  const wRot = 2.5;
  const wCol = (CW - wRot) / 4;
  columnas.forEach((col, c) => {
    const x = xRot + wRot + c * wCol;
    if (c === 0) rect(slide, x, 1.96, wCol - 0.08, 3.1, C.warm);
    addText(slide, col.toUpperCase(), {
      x: x + 0.12,
      y: 2.06,
      w: wCol - 0.3,
      h: 0.3,
      fontSize: 9.2,
      bold: true,
      color: c === 0 ? ROJO : C.slate,
      charSpacing: 0.7,
    });
  });
  filas.forEach(([nivel, celdas], r) => {
    const y = 2.52 + r * 0.82;
    addText(slide, nivel, {
      x: xRot,
      y: y + 0.08,
      w: wRot - 0.2,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    addText(slide, ["una función sola", "piezas juntas, sin la página", "por la pantalla, como una persona"][r], {
      x: xRot,
      y: y + 0.4,
      w: wRot - 0.2,
      h: 0.22,
      fontSize: 9.4,
      color: C.slate,
    });
    celdas.forEach((valor, c) => {
      const x = xRot + wRot + c * wCol + 0.08;
      const w = wCol - 0.24;
      if (valor === "—") {
        rect(slide, x, y + 0.1, w, 0.46, C.paper, C.border);
        addText(slide, "no participa", {
          x: x + 0.1,
          y: y + 0.14,
          w: w - 0.2,
          h: 0.38,
          fontSize: 9.6,
          color: C.slate,
          align: "center",
          valign: "mid",
        });
      } else if (valor === "real") {
        rect(slide, x, y + 0.1, w, 0.46, VERDE);
        addText(slide, "se ejecuta", {
          x: x + 0.1,
          y: y + 0.14,
          w: w - 0.2,
          h: 0.38,
          fontSize: 10,
          bold: true,
          color: C.white,
          align: "center",
          valign: "mid",
        });
      } else {
        rect(slide, x, y + 0.1, w, 0.46, ORO);
        addText(slide, "la sustituye el cliente", {
          x: x + 0.1,
          y: y + 0.14,
          w: w - 0.2,
          h: 0.38,
          fontSize: 9.6,
          bold: true,
          color: C.white,
          align: "center",
          valign: "mid",
        });
      }
    });
  });

  rect(slide, M, 5.2, CW, 0.8, C.softNeutral);
  addText(slide, "En la integración, un cliente de pruebas —un programa que envía solicitudes a la API como lo haría la página— ocupa el lugar de app.js. Una prueba unitaria sobre app.js podría encontrarlo, pero solo si quien la escribe ya sabe que un error de validación trae una lista.", {
    x: M + 0.28,
    y: 5.28,
    w: CW - 0.56,
    h: 0.64,
    fontSize: 11.2,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "El cliente de pruebas de la integración ocupa exactamente el lugar de la página.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · El agente: aserciones negativas frente a una positiva

function slideAgentAssertions() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el agente", "Excluir una falla no es exigir una conducta", "", false);

  addText(slide, "Podía leer los archivos, no cambiarlos, y encontró el defecto leyendo app.js. Sus aserciones, donde mensaje es el localizador del párrafo de avisos:", {
    x: M,
    y: 1.86,
    w: CW,
    h: 0.3,
    fontSize: 12,
    color: C.slate,
  });

  const w = (CW - 0.3) / 2;
  addKicker(slide, M, 2.3, "Las del agente · negativas o de forma", ROJO, w);
  codigo(slide, {
    x: M,
    y: 2.58,
    w,
    lang: "typescript",
    fontSize: 9.6,
    code: [
      "await expect(mensaje).toHaveClass(/error/);",
      "await expect(mensaje).not.toBeEmpty();",
      'await expect(mensaje).not.toContainText("Reserva confirmada");',
      'await expect(mensaje).not.toContainText("[object Object]");',
    ].join("\n"),
  });

  const xd = M + w + 0.3;
  addKicker(slide, xd, 2.3, "La de la clase · positiva", VERDE, w);
  codigo(slide, {
    x: xd,
    y: 2.58,
    w,
    lang: "typescript",
    fontSize: 9.6,
    code: 'await expect(mensaje).toContainText("Personas");',
  });
  addText(slide, "Exige lo que la persona necesita: que la pantalla nombre el campo.", {
    x: xd,
    y: 3.3,
    w,
    h: 0.3,
    fontSize: 11,
    color: C.slate,
  });
  addText(slide, "not invierte la aserción. /error/ busca la palabra «error» en la clase de estilo del mensaje.", {
    x: M,
    y: 3.72,
    w,
    h: 0.3,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  addKicker(slide, M, 4.14, "Se aplica la corrección más habitual: mostrar el primer mensaje de la lista", C.ink, 9);
  terminal(slide, {
    x: M,
    y: 4.42,
    w: CW,
    title: "npx playwright test",
    fontSize: 10,
    lines: [
      { t: "ok 1 › no se confirma la reserva si el campo Personas queda vacio   (la del agente)", k: "ok" },
      { t: "x  3 › si falta un dato, la pantalla dice cuál corregir           (la positiva)", k: "err" },
      { t: 'Received string: "Input should be a valid integer, unable to parse string as an integer"', k: "muted" },
    ],
  });
  addText(slide, "La pantalla ahora muestra el texto técnico de la API, en inglés («debería ser un número entero») y sin nombrar el campo. La prueba del agente no lo nota.", {
    x: M,
    y: 5.8,
    w: CW,
    h: 0.3,
    fontSize: 10.2,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Una aserción negativa excluye una falla ya vista. Una positiva exige lo que la persona necesita.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 15 · Preguntas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de esperar", [
    [
      "La API respondió 422 con el campo exacto en loc, y la pantalla mostró [object Object]. Un compañero dice que el defecto es de la API. ¿Tiene razón?",
      "Revisa qué promete el contrato para un error de validación. Después busca qué pieza tenía la información y no la usó.",
    ],
    [
      "Las veinte pruebas de pytest pasaron todo el tiempo, incluidas las de integración. ¿Por qué ninguna podía detectar el [object Object]?",
      "Mira qué pieza ocupa el cliente de pruebas en la tabla de niveles. ¿Se ejecuta alguna vez app.js en esas pruebas?",
    ],
    [
      "La prueba del agente siguió pasando con una corrección que deja a la persona igual de perdida. ¿Qué tendría que haber sabido para escribir la positiva?",
      "El agente leyó todos los archivos. ¿En alguno dice qué mensaje necesita ver una persona cuando falta un dato?",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 16 · Respuestas del bloque 1

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "No tiene razón",
      "La API cumplió su contrato: un 422 con la lista de errores y el campo exacto.",
      "La información estaba en la página y la línea que la recibe la convirtió en texto genérico.",
      "Culpar a la pieza que respondió bien en vez de a la que mostró mal.",
    ],
    [
      "Porque ninguna ejecuta la página",
      "El cliente de pruebas ocupa el lugar de la página, así que app.js nunca corre ahí.",
      "Cada nivel solo ve lo que ejecuta de verdad; lo que sustituye queda fuera de su alcance.",
      "Pensar que una suite en verde cubre también lo que ninguna de sus pruebas ejecuta.",
    ],
    [
      "Lo que la persona necesita leer",
      "Qué debe decir la pantalla cuando falta un dato. Eso no está escrito en ningún archivo.",
      "El agente prueba contra el código que lee; la conducta esperada tiene que venir del requisito.",
      "Dar por buena una prueba porque excluye el error que ya se vio.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 17 · Divisor del bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "No se espera un tiempo, se espera una condición", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Hasta ahora, cuando una prueba miraba un valor, el valor ya existía. En una pantalla deja de ser cierto, y aparece la primera prueba del módulo que pasa y falla sobre el mismo código sin que nadie lo toque.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 2, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 · En una pantalla, el valor todavia no llega

function slideAsync() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · asíncrono", "En una pantalla, el valor todavía no llega", "", false);

  addKicker(slide, M, 1.92, "Hasta ahora · una función o el cliente de pruebas", C.slate, 8);
  const cadena = ["Acción", "Resultado completo", "La prueba mira"];
  const wA = 2.1;
  cadena.forEach((texto, index) => {
    const x = M + index * (wA + 0.5);
    const ultimo = index === cadena.length - 1;
    rect(slide, x, 2.22, wA, 0.52, ultimo ? VERDE : C.white, ultimo ? VERDE : C.border);
    addText(slide, texto, {
      x: x + 0.1,
      y: 2.26,
      w: wA - 0.2,
      h: 0.44,
      fontSize: 11.8,
      bold: true,
      color: ultimo ? C.white : C.ink,
      align: "center",
      valign: "mid",
    });
    if (!ultimo) arrow(slide, x + wA + 0.08, 2.48, 0.34, C.slate, 1.6);
  });
  addText(slide, "Entre la acción y la comprobación no pasaba nada que la prueba no controlara.", {
    x: M + 3 * wA + 2 * 0.5 + 0.3,
    y: 2.22,
    w: CW - (3 * wA + 2 * 0.5 + 0.3),
    h: 0.52,
    fontSize: 11.6,
    italic: true,
    color: C.slate,
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });

  addKicker(slide, M, 3.06, "En la página · al apretar «Reservar»", ROJO, 8);
  const pasos = [
    ["Envía la reserva a la API", false],
    ["Espera la respuesta", true],
    ["Muestra la confirmación", false],
    ["Pide el estado de los bloques", false],
    ["Espera esa respuesta", true],
    ["Redibuja la lista", false],
  ];
  const gap = 0.12;
  const w = (CW - gap * 5) / 6;
  pasos.forEach(([texto, espera], index) => {
    const x = M + index * (w + gap);
    const color = espera ? ORO : index === 5 ? VERDE : AZUL;
    rect(slide, x, 3.36, w, 1.0, espera ? C.warm : C.white);
    rect(slide, x, 3.36, w, 0.06, color);
    addText(slide, String(index + 1), {
      x: x + 0.16,
      y: 3.52,
      w: 0.4,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.16,
      y: 3.78,
      w: w - 0.3,
      h: 0.5,
      fontSize: 11,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.05,
    });
  });
  const xr = M + w + gap / 2;
  slide.addShape(SH.line, {
    x: xr,
    y: 3.32,
    w: 0,
    h: 1.28,
    line: { color: C.red, pt: 2.2, dashType: "dash" },
  });
  addText(slide, "Si la prueba mira aquí, justo después del clic, la lista todavía es la de antes.", {
    x: xr + 0.14,
    y: 4.44,
    w: 9.4,
    h: 0.26,
    fontSize: 11.8,
    bold: true,
    color: ROJO,
  });

  rect(slide, M, 4.92, CW, 1.06, NAVY_CHIP);
  addKicker(slide, M + 0.34, 5.04, "Asíncrona", C.gold, 4);
  addText(
    slide,
    "La página no se queda detenida esperando: sigue funcionando, y cada parte ocurre cuando llega lo que necesita. Para la persona es invisible, porque todo pasa en décimas de segundo. Para una prueba es decisivo.",
    { x: M + 0.34, y: 5.3, w: CW - 0.68, h: 0.62, fontSize: 12.2, color: C.white, lineSpacingMultiple: 1.12 }
  );

  addTakeaway(slide, "La prueba ya no controla cuándo existe lo que quiere comprobar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · La prueba que espera 400 milisegundos

function slideFixedWait() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · espera fija", "La forma intuitiva: esperar un rato antes de mirar", "", false, {
    titleFontSize: 26,
  });

  const panel = codigo(slide, {
    x: M,
    y: 1.9,
    w: CW,
    lang: "typescript",
    fontSize: 11.5,
    title: "Reserva el bloque 4 y comprueba que la lista lo muestre tomado",
    marcas: [
      { linea: 2, color: C.gold, numero: 1 },
      { linea: 4, color: ROJO, numero: 2 },
      { linea: 5, color: ROJO, numero: 3 },
      { linea: 6, color: C.gold, numero: 4 },
    ],
    code: [
      'test("tras reservar, el bloque 4 aparece tomado · espera fija", async ({ page }) => {',
      "  await reservarBloque4(page);",
      "",
      "  await page.waitForTimeout(400);",
      '  const ficha = await page.getByRole("listitem").filter({ hasText: "Bloque 4" }).textContent();',
      '  expect(ficha).toContain("Tomado");',
      "});",
    ].join("\n"),
  });

  const notas = [
    [1, C.gold, "Una función auxiliar", "reservarBloque4 abre la página, llena el formulario con el bloque 4 y aprieta «Reservar». Se escribe una vez."],
    [2, ROJO, "Detiene 400 ms", "waitForTimeout(400) espera ese tiempo, pase lo que pase en la página."],
    [3, ROJO, "Lee una sola vez", "filter elige, entre los elementos de lista, el que dice «Bloque 4». textContent lee su texto en ese instante."],
    [4, C.gold, "Compara lo ya leído", "toContain compara ese texto guardado. No vuelve a mirar la página."],
  ];
  const y = 1.9 + panel.h + 0.18;
  const h = 6.0 - y;
  const gap = 0.14;
  const w = (CW - gap * 3) / 4;
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const x = M + index * (w + gap);
    const clave = color === ROJO;
    rect(slide, x, y, w, h, clave ? C.warm : C.white);
    rect(slide, x, y, w, 0.06, color === C.gold ? ORO : color);
    circulo(slide, x + 0.34, y + 0.36, 0.3, color, numero, color === C.gold ? C.navy : C.white, 9.6);
    addText(slide, titulo, {
      x: x + 0.62,
      y: y + 0.24,
      w: w - 0.8,
      h: 0.26,
      fontSize: 12,
      bold: true,
      color: clave ? ROJO : C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.2,
      y: y + 0.64,
      w: w - 0.4,
      h: h - 0.74,
      fontSize: 10.4,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "La prueba apuesta a que en 400 ms la lista ya se redibujó.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 · Dos condiciones antes de ejecutarla

function slideTestConditions() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el entorno", "Antes de ejecutarla, dos condiciones", "", false);

  const w = (CW - 0.4) / 2;
  const columnas = [
    {
      x: M,
      color: AZUL,
      kicker: "Un mundo limpio antes de cada prueba",
      lang: "typescript",
      code: ["test.beforeEach(async ({ request }) => {", '  await request.post("/_prueba/reiniciar");', "});"].join("\n"),
      glosas: [
        ["test.beforeEach", "ejecuta la función antes de cada prueba del archivo."],
        ["request", "un cliente que habla con la API directamente, sin navegador."],
        ["/_prueba/reiniciar", "vacía la base de datos. Solo existe en el servidor que arranca para las pruebas."],
      ],
      cierre: "La aplicación corre en otro proceso: la prueba no puede tocar su base directamente.",
    },
    {
      x: M + w + 0.4,
      color: ROJO,
      kicker: "Una red que no es instantánea",
      lang: "python",
      code: [
        '@app.middleware("http")',
        "async def latencia_variable(request: Request, llamar_siguiente):",
        "    if LATENCIA_MAXIMA:",
        "        await asyncio.sleep(random.uniform(0, LATENCIA_MAXIMA))",
        "    return await llamar_siguiente(request)",
      ].join("\n"),
      glosas: [
        ["middleware", "una pieza que corre alrededor de cada solicitud; llamar_siguiente la deja pasar."],
        ["LATENCIA_MAXIMA", "la demora máxima configurada: aquí, 0,4 segundos."],
        ["asyncio.sleep(random.uniform(0, LATENCIA_MAXIMA))", "espera un tiempo al azar entre cero y ese máximo."],
      ],
      cierre: "Es una simulación declarada: la demora no es un defecto, es la variación normal de una red.",
    },
  ];

  columnas.forEach((col) => {
    addKicker(slide, col.x, 1.92, col.kicker, col.color, w);
    const panel = codigo(slide, { x: col.x, y: 2.2, w, lang: col.lang, fontSize: 9.6, code: col.code });
    let y = 2.2 + panel.h + 0.2;
    col.glosas.forEach(([termino, glosa]) => {
      addText(slide, termino, {
        x: col.x,
        y,
        w,
        h: 0.22,
        fontFace: TYPOGRAPHY.mono,
        fontSize: 10.2,
        bold: true,
        color: col.color,
      });
      addText(slide, glosa, {
        x: col.x,
        y: y + 0.24,
        w,
        h: 0.24,
        fontSize: 10.8,
        color: C.ink,
      });
      y += 0.58;
    });
    rect(slide, col.x, 5.34, 0.05, 0.56, col.color);
    addText(slide, col.cierre, {
      x: col.x + 0.18,
      y: 5.34,
      w: w - 0.2,
      h: 0.56,
      fontSize: 10.8,
      italic: true,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Sin base limpia ni red realista, el resultado de la prueba no significaría nada.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · El mismo codigo, tres resultados distintos

function slideRepeatEach() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · diez veces", "El mismo código, tres resultados distintos", "", false);

  addText(slide, "--repeat-each=10", {
    x: M,
    y: 1.9,
    w: 2.0,
    h: 0.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 12.4,
    bold: true,
    color: AZUL,
  });
  addText(slide, "ejecuta la misma prueba diez veces seguidas. Nada cambia entre una tanda y otra.", {
    x: M + 2.02,
    y: 1.92,
    w: 9.5,
    h: 0.28,
    fontSize: 12.2,
    color: C.slate,
  });

  const tandas = [
    ["Con demora", "1.ª tanda", 4, "4 failed · 6 passed (31.4s)", 2.46],
    ["", "2.ª tanda", 3, "3 failed · 7 passed (30.7s)", 3.08],
    ["", "3.ª tanda", 5, "5 failed · 5 passed (28.5s)", 3.7],
    ["Sin demora", "como en la máquina de quien la escribe", 0, "10 passed (21.6s)", 4.62],
  ];
  const x0 = M + 2.7;
  const cw = 0.6;
  const cg = 0.06;
  rect(slide, M, 4.46, CW, 0.78, C.warm);
  tandas.forEach(([grupo, tanda, fallas, salida, y]) => {
    if (grupo) {
      addText(slide, grupo, {
        x: M + 0.14,
        y: y + 0.02,
        w: 2.4,
        h: 0.24,
        fontSize: 12.4,
        bold: true,
        color: C.ink,
      });
    }
    addText(slide, tanda, {
      x: M + 0.14,
      y: grupo ? y + 0.26 : y + 0.1,
      w: 2.46,
      h: grupo === "Sin demora" ? 0.34 : 0.22,
      fontSize: 9.8,
      color: C.slate,
      lineSpacingMultiple: 1.0,
    });
    for (let i = 0; i < 10; i += 1) {
      rect(slide, x0 + i * (cw + cg), y, cw, 0.46, i < fallas ? ROJO : VERDE);
    }
    addText(slide, salida, {
      x: x0 + 10 * (cw + cg) + 0.14,
      y: y + 0.08,
      w: 2.44,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      bold: true,
      color: fallas ? ROJO : VERDE,
      valign: "mid",
    });
  });

  addText(slide, "Cada celda es una ejecución, agrupadas por resultado y no por orden. La demora simulada llega hasta 400 ms por respuesta.", {
    x: M,
    y: 5.44,
    w: CW,
    h: 0.26,
    fontSize: 10.4,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "En la máquina de quien la escribió, la prueba con espera fija parece perfecta.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · La prueba miro antes de tiempo

function slideFlaky() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la falla", "La reserva se hizo. La lista todavía no.", "", false);

  addKicker(slide, M, 1.92, "Cuando falla, dice esto", ROJO, 6);
  terminal(slide, {
    x: M,
    y: 2.2,
    w: 6.3,
    title: "npx playwright test",
    fontSize: 11,
    lines: [
      { t: "Error: expect(received).toContain(expected)", k: "err" },
      { t: "", k: "plain" },
      { t: 'Expected substring: "Tomado"', k: "muted" },
      { t: 'Received string:    "Bloque 4Libre"', k: "err" },
    ],
  });

  const xd = M + 6.7;
  const wd = CW - 6.7;
  addKicker(slide, xd, 1.92, "La ficha, en ese instante", AZUL, wd);
  rect(slide, xd, 2.24, 3.2, 0.56, VERDE);
  addText(slide, "Bloque 4", { x: xd + 0.2, y: 2.3, w: 1.6, h: 0.44, fontSize: 13, color: C.white, valign: "mid" });
  addText(slide, "Libre", { x: xd + 1.9, y: 2.3, w: 1.1, h: 0.44, fontSize: 13, bold: true, color: C.white, align: "right", valign: "mid" });
  addText(slide, "Sus dos partes, leídas juntas, dan «Bloque 4Libre». La reserva sí se hizo; la lista todavía no se había redibujado.", {
    x: xd,
    y: 2.98,
    w: wd,
    h: 0.8,
    fontSize: 11.8,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });

  rect(slide, M, 4.06, CW, 1.2, NAVY_CHIP);
  addText(slide, "PRUEBA INESTABLE", {
    x: M + 0.34,
    y: 4.2,
    w: 2.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.3,
  });
  addText(slide, "flaky test", {
    x: M + 2.66,
    y: 4.2,
    w: 2.0,
    h: 0.22,
    fontSize: 10.4,
    italic: true,
    color: C.softBlue,
  });
  addText(
    slide,
    "Una prueba que da resultados distintos sobre el mismo código, sin que nada cambie. Es la primera del módulo, y aparece justo al llegar al navegador.",
    { x: M + 0.34, y: 4.5, w: CW - 0.68, h: 0.66, fontSize: 13, color: C.white, lineSpacingMultiple: 1.14 }
  );

  addText(slide, "Casi nunca se detecta al escribirla: se detecta después, cuando ya se confió en ella.", {
    x: M,
    y: 5.46,
    w: CW,
    h: 0.3,
    fontSize: 12.4,
    bold: true,
    color: ROJO,
  });

  addTakeaway(slide, "No falló por un defecto del sistema: la prueba miró antes de tiempo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · Esperar lo que se quiere comprobar

function slideWaitCondition() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la corrección", "Esperar lo que se quiere comprobar", "", false);

  const antes = codigo(slide, {
    x: M,
    y: 1.9,
    w: CW,
    lang: "typescript",
    fontSize: 11,
    title: "Antes · espera 400 ms y lee el texto una vez",
    marcas: [
      { linea: 1, color: ROJO },
      { linea: 2, color: ROJO },
    ],
    code: [
      "await page.waitForTimeout(400);",
      'const ficha = await page.getByRole("listitem").filter({ hasText: "Bloque 4" }).textContent();',
      'expect(ficha).toContain("Tomado");',
    ].join("\n"),
  });
  const yD = 1.9 + antes.h + 0.14;
  const despues = codigo(slide, {
    x: M,
    y: yD,
    w: CW,
    lang: "typescript",
    fontSize: 11,
    title: "Después · espera una condición",
    marcas: [
      { linea: 1, color: VERDE },
      { linea: 2, color: VERDE },
    ],
    code: ['const ficha = page.getByRole("listitem").filter({ hasText: "Bloque 4" });', 'await expect(ficha).toContainText("Tomado");'].join(
      "\n"
    ),
  });

  const y = yD + despues.h + 0.2;
  const h = 6.0 - y;
  const wn = 4.1;
  [
    [AZUL, "ficha es el localizador", "Ya no es un texto leído: es la forma de encontrar el elemento, cada vez que se lo pida."],
    [VERDE, "La aserción reintenta", "Vuelve a buscar y a comparar hasta que se cumple, o hasta que pasan 5 segundos."],
  ].forEach(([color, titulo, glosa], index) => {
    const x = M + index * (wn + 0.16);
    rect(slide, x, y, wn, h, C.white);
    rect(slide, x, y, 0.06, h, color);
    addText(slide, titulo, { x: x + 0.24, y: y + 0.12, w: wn - 0.4, h: 0.26, fontSize: 12, bold: true, color });
    addText(slide, glosa, {
      x: x + 0.24,
      y: y + 0.42,
      w: wn - 0.4,
      h: h - 0.5,
      fontSize: 10.6,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });
  const xt = M + 2 * (wn + 0.16);
  terminal(slide, {
    x: xt,
    y,
    w: CW - (xt - M),
    title: "Misma demora, diez veces",
    fontSize: 12,
    lines: [{ t: "10 passed (32.5s)", k: "ok" }],
  });

  addTakeaway(slide, "La corrección no es esperar más: es esperar lo que se quiere comprobar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24 · Subir la espera no la arregla

function slideLongerWait() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la tentación", "Esperar más tampoco la arregla", "", false, {
    titleFontSize: 30,
  });

  const escala = 1.03;
  const zonas = [
    { x0: M + 2.9, llegada: 0.01, titulo: "Respuesta en 10 ms", color: AZUL },
    { x0: M + 7.4, llegada: 3, titulo: "Respuesta en 3 s", color: ROJO },
  ];
  zonas.forEach((zona) => {
    addKicker(slide, zona.x0, 1.92, zona.titulo, zona.color, 3.6);
    [0, 1, 2, 3].forEach((t) => {
      addText(slide, `${t} s`, {
        x: zona.x0 + t * escala - 0.02,
        y: 2.24,
        w: 0.4,
        h: 0.18,
        fontFace: TYPOGRAPHY.mono,
        fontSize: 8.4,
        color: C.slate,
      });
    });
    rule(slide, zona.x0, 2.48, 3.6, C.border, 1);
  });

  const estrategias = [
    ["Espera fija de 400 ms", "mira a los 0,4 s, llegue o no la respuesta", [[0.4, true, "pasa · 0,4 s"], [0.4, false, "falla: miró antes"]]],
    ["Espera fija de 2 s", "mira a los 2 s, siempre", [[2, true, "pasa · tarda 2 s"], [2, false, "falla"]]],
    ["Espera una condición", "termina en cuanto se cumple; plazo de 5 s", [[0.01, true, "pasa · en cuanto llega"], [3, true, "pasa · 3 s"]]],
  ];
  estrategias.forEach(([nombre, glosa, resultados], fila) => {
    const y = 2.72 + fila * 0.92;
    const clave = fila === 2;
    if (clave) rect(slide, M, y - 0.1, CW, 0.82, C.warm);
    addText(slide, nombre, { x: M + 0.12, y, w: 2.7, h: 0.26, fontSize: 12.4, bold: true, color: clave ? VERDE : C.ink });
    addText(slide, glosa, {
      x: M + 0.12,
      y: y + 0.28,
      w: 2.7,
      h: 0.36,
      fontSize: 9.6,
      color: C.slate,
      lineSpacingMultiple: 1.0,
    });
    resultados.forEach(([espera, pasa, etiqueta], z) => {
      const zona = zonas[z];
      const largo = Math.max(espera * escala, 0.06);
      const color = pasa ? VERDE : ROJO;
      rect(slide, zona.x0, y + 0.08, largo, 0.34, color);
      addText(slide, etiqueta, {
        x: zona.x0 + largo + 0.1,
        y: y + 0.1,
        w: z === 1 && espera >= 3 ? 1.3 : 1.9,
        h: 0.3,
        fontSize: 10.4,
        bold: true,
        color,
        valign: "mid",
      });
      slide.addShape(SH.line, {
        x: zona.x0 + zona.llegada * escala,
        y: y - 0.02,
        w: 0,
        h: 0.54,
        line: { color: ORO, pt: 2.2 },
      });
    });
  });

  const yl = 5.56;
  slide.addShape(SH.line, { x: M, y: yl, w: 0, h: 0.24, line: { color: ORO, pt: 2.2 } });
  addText(slide, "llega la respuesta", { x: M + 0.12, y: yl + 0.02, w: 1.6, h: 0.2, fontSize: 9.6, color: C.slate });
  addText(slide, "Largo de la barra: cuánto espera la prueba antes de dar su veredicto.", {
    x: M + 1.9,
    y: yl + 0.02,
    w: 6,
    h: 0.2,
    fontSize: 9.6,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Una espera fija apuesta sobre la velocidad de una máquina ajena. Una condición no apuesta.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 25 · La herramienta ya espera sola

function slideAutoWait() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Playwright", "La herramienta ya espera sola", "", false);

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.3,
    "Nunca esperes un tiempo fijo en una prueba real. Las pruebas que esperan tiempo son inestables por naturaleza. Usa las acciones de los localizadores y las aserciones sobre la página, que esperan solas.",
    "Documentación de Playwright, page.waitForTimeout · traducción del original en inglés",
    ROJO
  );

  const w = (CW - 0.3) / 2;
  const y = 3.42;
  const h = 2.56;

  rect(slide, M, y, w, h, C.white);
  rect(slide, M, y, w, 0.06, AZUL);
  addKicker(slide, M + 0.26, y + 0.22, "Ya lo hacía en el bloque 1", AZUL, w - 0.5);
  addText(slide, "14×", {
    x: M + 0.26,
    y: y + 0.62,
    w: 1.7,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 48,
    bold: true,
    color: AZUL,
  });
  addText(slide, "en 5 segundos", { x: M + 0.3, y: y + 1.54, w: 1.8, h: 0.26, fontSize: 11, bold: true, color: C.slate });
  addText(
    slide,
    "Cuando falló la prueba del mensaje, la aserción volvió a buscar el elemento y a comparar su texto catorce veces antes de rendirse. Eso es lo que corrige la inestabilidad.",
    { x: M + 2.2, y: y + 0.62, w: w - 2.46, h: 1.7, fontSize: 11.6, color: C.ink, lineSpacingMultiple: 1.14 }
  );

  const xd = M + w + 0.3;
  rect(slide, xd, y, w, h, C.white);
  rect(slide, xd, y, w, 0.06, VERDE);
  addKicker(slide, xd + 0.26, y + 0.22, "Las acciones también esperan", VERDE, w - 0.5);
  addText(slide, "Antes de apretar, click espera a que el botón:", {
    x: xd + 0.26,
    y: y + 0.6,
    w: w - 0.5,
    h: 0.3,
    fontSize: 12,
    color: C.ink,
  });
  const chips = ["exista", "esté visible", "se pueda apretar"];
  const wc = (w - 0.52 - 0.24) / 3;
  chips.forEach((chip, index) => {
    const x = xd + 0.26 + index * (wc + 0.12);
    rect(slide, x, y + 1.08, wc, 0.62, C.softNeutral);
    rect(slide, x, y + 1.08, wc, 0.05, VERDE);
    addText(slide, chip, {
      x: x + 0.08,
      y: y + 1.16,
      w: wc - 0.16,
      h: 0.48,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      align: "center",
      valign: "mid",
    });
  });
  addText(slide, "Sin que la prueba tenga que pedirlo.", {
    x: xd + 0.26,
    y: y + 1.92,
    w: w - 0.5,
    h: 0.28,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Acciones y aserciones sobre localizadores esperan solas. La espera fija es la que sobra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 26 · Por que la inestabilidad nace aqui

function slideFlakyEvidence() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la evidencia", "La causa más documentada es esta", "", false);

  const wl = 6.3;
  addKicker(slide, M, 1.92, "201 correcciones · 51 proyectos de código abierto · 161 clasificadas", C.slate, wl);
  const causas = [
    ["Espera asíncrona", "La prueba hace una llamada asíncrona y no espera bien su resultado.", 74, 45, ROJO],
    ["Concurrencia", "Partes del programa que corren al mismo tiempo (hilos) interactúan mal.", 32, 20, C.slate],
    ["Dependencia del orden", "El resultado depende de qué pruebas corrieron antes.", 19, 12, C.slate],
  ];
  const maxBarra = 3.9;
  causas.forEach(([nombre, glosa, casos, pct, color], index) => {
    const y = 2.28 + index * 0.98;
    addText(slide, nombre, { x: M, y, w: 3.0, h: 0.26, fontSize: 12.4, bold: true, color: index === 0 ? ROJO : C.ink });
    addText(slide, glosa, { x: M, y: y + 0.27, w: wl, h: 0.22, fontSize: 9.8, color: C.slate });
    const largo = (pct / 45) * maxBarra;
    rect(slide, M, y + 0.56, largo, 0.3, color);
    addText(slide, `${casos} de 161 · ${pct} %`, {
      x: M + largo + 0.14,
      y: y + 0.56,
      w: 2.2,
      h: 0.3,
      fontSize: 11.4,
      bold: true,
      color: index === 0 ? ROJO : C.ink,
      valign: "mid",
    });
  });
  addText(slide, "Si una prueba falla cuatro de cada diez veces sin motivo, el día que falle por un defecto real nadie le va a creer: deja de informar.", {
    x: M,
    y: 5.3,
    w: wl,
    h: 0.62,
    fontSize: 11,
    italic: true,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  const xd = M + wl + 0.5;
  const wd = CW - wl - 0.5;
  addKicker(slide, xd, 1.92, "Tres hallazgos del mismo estudio", AZUL, wd);
  const hallazgos = [
    ["78 %", "de las pruebas inestables ya lo son la primera vez que se escriben.", "F.2", ROJO],
    ["34 %", "de las de espera asíncrona usan una demora fija para imponer un orden.", "F.4", ORO],
    ["54 %", "de las de espera asíncrona se corrigen esperando una condición.", "F.8", VERDE],
  ];
  hallazgos.forEach(([cifra, texto, codigoH, color], index) => {
    const y = 2.28 + index * 0.98;
    rect(slide, xd, y, wd, 0.86, C.white);
    rect(slide, xd, y, 0.06, 0.86, color);
    addText(slide, cifra, {
      x: xd + 0.22,
      y: y + 0.1,
      w: 1.4,
      h: 0.66,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color,
      valign: "mid",
    });
    addText(slide, texto, {
      x: xd + 1.66,
      y: y + 0.12,
      w: wd - 2.3,
      h: 0.62,
      fontSize: 11,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    addText(slide, codigoH, {
      x: xd + wd - 0.56,
      y: y + 0.12,
      w: 0.44,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.slate,
      align: "right",
    });
  });
  addText(slide, "Luo, Hariri, Eloussi y Marinov · An Empirical Analysis of Flaky Tests · FSE 2014 · hallazgos traducidos del original en inglés", {
    x: xd,
    y: 5.3,
    w: wd,
    h: 0.44,
    fontSize: 8.8,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Nacen inestables, y casi la mitad por esperar mal. La costumbre se forma en la primera línea.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · Lo que hace un agente con esto

function slideAgentFlaky() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el agente", "La corrigió dos veces. No la ejecutó ninguna.", "", false);

  addText(slide, "Un agente con acceso solo de lectura recibió dos pedidos distintos.", {
    x: M,
    y: 1.9,
    w: CW,
    h: 0.28,
    fontSize: 12.4,
    color: C.slate,
  });

  const w = (CW - 0.3) / 2;
  const y = 2.3;
  const h = 2.62;
  const pedidos = [
    [
      AZUL,
      "Pedido 1 · el archivo y el mensaje de error",
      [
        [true, "Cambió la espera fija por una aserción sobre el localizador."],
        [true, "Lo explicó bien: «leía el texto una sola vez; ahora vuelve a revisar hasta que aparece o se acaba el tiempo»."],
        [false, "Dejó el nombre «espera fija» en una prueba que ya no espera un tiempo fijo. Un nombre que miente también es un defecto."],
      ],
    ],
    [
      ORO,
      "Pedido 2 · «la suite a veces falla y a veces pasa»",
      [
        [true, "Encontró la espera fija sin que nadie se la señalara."],
        [true, "Corrigió el nombre y agregó una comprobación de que el reinicio de la base funcionara."],
        [true, "Recomendó mantener la demora simulada: «sirve justamente para detectar esperas fijas como esta»."],
      ],
    ],
  ];
  pedidos.forEach(([color, titulo, items], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, w, 0.06, color);
    addText(slide, titulo, { x: x + 0.24, y: y + 0.18, w: w - 0.48, h: 0.26, fontSize: 11.8, bold: true, color: C.ink });
    items.forEach(([bien, texto], i) => {
      const yi = y + 0.54 + i * 0.54;
      rect(slide, x + 0.26, yi + 0.07, 0.1, 0.1, bien ? VERDE : ORO);
      addText(slide, texto, {
        x: x + 0.46,
        y: yi,
        w: w - 0.7,
        h: 0.48,
        fontSize: 10.2,
        color: C.ink,
        lineSpacingMultiple: 1.06,
      });
    });
    rect(slide, x + 0.24, y + h - 0.46, 2.3, 0.32, C.paleRed);
    addText(slide, "«no lo he ejecutado»", {
      x: x + 0.3,
      y: y + h - 0.44,
      w: 2.18,
      h: 0.28,
      fontSize: 11,
      bold: true,
      italic: true,
      color: ROJO,
      valign: "mid",
    });
  });

  const yb = y + h + 0.16;
  const hT = terminal(slide, {
    x: M,
    y: yb,
    w: 4.4,
    title: "La corrección, diez veces con la demora",
    fontSize: 12,
    lines: [{ t: "10 passed (32.3s)", k: "ok" }],
  });
  addText(
    slide,
    "Una prueba inestable no se da por corregida porque pase una vez: la original también pasaba entre cinco y siete de cada diez. Se da por corregida cuando pasa muchas veces en las condiciones donde fallaba.",
    { x: M + 4.7, y: yb, w: CW - 4.7, h: hT, fontSize: 11.6, color: C.ink, valign: "mid", lineSpacingMultiple: 1.12 }
  );

  addTakeaway(slide, "Una afirmación sobre una prueba no se cree: se comprueba ejecutando.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · Preguntas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de explorar", [
    [
      "La prueba con espera fija pasa diez de diez en tu máquina. Un compañero concluye que está bien escrita y que el problema es el servidor que ejecuta las pruebas en cada cambio (integración continua), que es lento. ¿Tiene razón?",
      "Mira qué le pasó a la misma prueba cuando las respuestas tardaron distinto. ¿Quién garantiza que la red siempre será tan rápida?",
    ],
    [
      "Otro compañero sube la espera de 400 a 2.000 milisegundos y la prueba pasa diez de diez con la demora activa. ¿La arregló?",
      "Calcula cuánto tarda cada ejecución aunque la respuesta llegue en diez milisegundos. ¿Y si una respuesta tarda tres segundos?",
    ],
    [
      "El agente corrigió la prueba y declaró que no la había ejecutado. ¿Cuántas ejecuciones en verde necesitas para creerle, y en qué condiciones?",
      "La original pasaba entre cinco y siete de cada diez con demora, y diez de diez sin ella. ¿Qué habría demostrado una sola ejecución en verde?",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 29 · Respuestas del bloque 2

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "No tiene razón",
      "La prueba mira a los 400 ms llegue o no la respuesta. El servidor lento no crea el defecto: lo revela.",
      "Diez de diez en una máquina rápida no dice nada sobre una red que tarda distinto.",
      "Culpar al entorno que muestra el defecto en vez de a la prueba que lo tiene.",
    ],
    [
      "No la arregló",
      "Ahora cada ejecución tarda 2 s siempre, y una respuesta de 3 s la vuelve a hacer fallar.",
      "Esperar más solo cambia la apuesta; sigue apostando sobre una máquina ajena.",
      "Medir la corrección por cuántas veces pasa en la máquina propia.",
    ],
    [
      "Muchas, y con la demora activa",
      "Diez de diez con la demora, justo donde la original fallaba entre tres y cinco.",
      "Una sola ejecución en verde no distingue la prueba corregida de la original.",
      "Creer una corrección porque pasó una vez o porque la explicación suena bien.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 30 · Divisor del bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Probar lo que nadie pensó en escribir", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Una prueba escrita de antemano solo comprueba lo que a alguien se le ocurrió. La exploración busca lo demás, con método, y pone a prueba a un agente que entra por primera vez.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 3, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · Lo que nadie imagino queda afuera

function slideOutsideTheList() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el límite", "Lo que nadie imaginó queda afuera", "", false, {
    titleFontSize: 30,
  });

  rect(slide, M, 1.92, CW, 4.06, C.white, C.border);
  addKicker(slide, M + 0.3, 2.1, "Lo que una persona hace con la interfaz", ROJO, 8);

  const xi = M + 0.3;
  const wi = 5.0;
  rect(slide, xi, 2.5, wi, 3.2, C.softNeutral);
  rect(slide, xi, 2.5, 0.06, 3.2, AZUL);
  addKicker(slide, xi + 0.28, 2.68, "Lo que las pruebas escritas comprueban", AZUL, wi - 0.4);
  ["El bloque 0", "El campo vacío", "La reserva repetida"].forEach((caso, index) => {
    const y = 3.04 + index * 0.56;
    rect(slide, xi + 0.28, y, wi - 0.56, 0.44, C.white);
    addText(slide, caso, { x: xi + 0.46, y: y + 0.06, w: wi - 0.9, h: 0.32, fontSize: 12.4, bold: true, color: C.ink, valign: "mid" });
  });
  addText(slide, "Alguien pensó el caso, escribió qué debía ocurrir y después lo comprobó.", {
    x: xi + 0.28,
    y: 4.8,
    w: wi - 0.5,
    h: 0.7,
    fontSize: 10.8,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  const conductas = [
    "Se equivoca de campo",
    "Aprieta el botón dos veces",
    "Deja algo a medias",
    "Vuelve a intentar con el mensaje anterior en pantalla",
  ];
  const x0 = xi + wi + 0.4;
  const wc = (M + CW - 0.3 - x0 - 0.2) / 2;
  conductas.forEach((texto, index) => {
    const x = x0 + (index % 2) * (wc + 0.2);
    const y = 2.6 + Math.floor(index / 2) * 1.08;
    rect(slide, x, y, wc, 0.9, C.warm);
    rect(slide, x, y, 0.06, 0.9, ROJO);
    addText(slide, texto, {
      x: x + 0.24,
      y: y + 0.1,
      w: wc - 0.4,
      h: 0.7,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });
  addText(slide, "Ninguna está en la lista: quien escribe las pruebas no suele hacer estas cosas.", {
    x: x0,
    y: 4.9,
    w: M + CW - 0.3 - x0,
    h: 0.6,
    fontSize: 11.4,
    italic: true,
    color: ROJO,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Una prueba escrita de antemano solo comprueba lo que a alguien se le ocurrió comprobar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32 · Disenar, ejecutar y evaluar a la vez

function slideExploratoryDefinition() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la definición", "Diseñar, ejecutar y evaluar a la vez", "", false);

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.08,
    "En la prueba exploratoria, las pruebas se diseñan, ejecutan y evalúan simultáneamente, mientras quien prueba aprende sobre el objeto de prueba.",
    "ISTQB Certified Tester Foundation Level v4.0.1, sección 4.4.2 · traducción del original en inglés",
    AZUL
  );

  addText(slide, "Objeto de prueba: lo que se está probando; aquí, el sistema de reservas.", {
    x: M,
    y: 3.02,
    w: CW,
    h: 0.22,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  const x0 = M + 2.7;
  const wb = 2.3;
  const gap = 0.5;
  const verbos = ["Diseñar", "Ejecutar", "Evaluar"];

  addText(slide, "Una prueba escrita", { x: M, y: 3.34, w: 2.5, h: 0.5, fontSize: 13, bold: true, color: C.ink, valign: "mid" });
  verbos.forEach((verbo, index) => {
    const x = x0 + index * (wb + gap);
    rect(slide, x, 3.3, wb, 0.56, C.white, C.border);
    addText(slide, verbo, { x: x + 0.1, y: 3.34, w: wb - 0.2, h: 0.48, fontSize: 13, bold: true, color: C.ink, align: "center", valign: "mid" });
    if (index < 2) arrow(slide, x + wb + 0.08, 3.58, 0.34, C.slate, 1.6);
  });
  addText(slide, "Primero se escribe la lista de casos, después se ejecuta, después se mira el resultado.", {
    x: x0,
    y: 3.96,
    w: 3 * wb + 2 * gap,
    h: 0.26,
    fontSize: 10.8,
    italic: true,
    color: C.slate,
  });

  addText(slide, "Exploratoria", { x: M, y: 4.62, w: 2.5, h: 0.5, fontSize: 13, bold: true, color: VERDE, valign: "mid" });
  rect(slide, x0 - 0.16, 4.44, 3 * wb + 2 * gap + 0.32, 0.86, NAVY_CHIP);
  verbos.forEach((verbo, index) => {
    const x = x0 + index * (wb + gap);
    rect(slide, x, 4.6, wb, 0.54, C.navy);
    addText(slide, verbo, { x: x + 0.1, y: 4.63, w: wb - 0.2, h: 0.48, fontSize: 13, bold: true, color: C.white, align: "center", valign: "mid" });
    if (index < 2) {
      addText(slide, "+", { x: x + wb + 0.1, y: 4.63, w: 0.3, h: 0.48, fontSize: 18, bold: true, color: C.gold, align: "center", valign: "mid" });
    }
  });
  addText(slide, "No hay lista escrita antes: cada prueba sale de lo que la anterior mostró.", {
    x: x0,
    y: 5.42,
    w: 3 * wb + 2 * gap,
    h: 0.26,
    fontSize: 10.8,
    italic: true,
    color: VERDE,
  });

  addTakeaway(slide, "La palabra que la distingue es «simultáneamente». Y no significa probar al azar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 33 · La prueba por sesiones

function slideSessionBased() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · prueba por sesiones", "La sesión le da estructura a la exploración", "", false, {
    titleFontSize: 28,
  });

  const piezas = [
    ["Antes", "Carta de sesión", "test charter", "Una o dos líneas: qué se explora y para qué. Dirige la sesión sin convertirla en un guion.", AZUL],
    ["Durante", "Tiempo acotado", "time box", "Un límite fijado de antemano. Evita que la exploración se extienda sin fin y permite comparar sesiones.", ORO],
    ["Durante", "Registro de sesión", "session sheet", "Lo que se probó, lo que apareció en pantalla y lo que se encontró. Vuelve auditable la exploración.", ROJO],
    ["Después", "Reunión posterior", "debriefing", "La conversación con quien tiene interés en el resultado, donde se decide qué hallazgo es un defecto.", VERDE],
  ];
  const gap = 0.16;
  const w = (CW - gap * 3) / 4;
  piezas.forEach(([fase, nombre, ingles, glosa, color], index) => {
    const x = M + index * (w + gap);
    addText(slide, fase.toUpperCase(), { x, y: 1.96, w, h: 0.22, fontSize: 9.4, bold: true, color: C.slate, charSpacing: 1.2 });
    rule(slide, x, 2.26, w - 0.1, color, 2);
    rect(slide, x, 2.42, w, 3.0, index === 2 ? C.warm : C.white);
    addText(slide, String(index + 1), {
      x: x + 0.24,
      y: 2.56,
      w: 0.6,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color,
    });
    addText(slide, nombre, { x: x + 0.24, y: 3.12, w: w - 0.44, h: 0.3, fontSize: 14, bold: true, color: C.ink });
    addText(slide, ingles, { x: x + 0.24, y: 3.44, w: w - 0.44, h: 0.24, fontSize: 10.4, italic: true, color: C.slate });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 3.82,
      w: w - 0.44,
      h: 1.5,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  addFuente(
    slide,
    5.62,
    "ISTQB CTFL v4.0.1, 4.4.2. Según el sitio de James Bach, el método lo desarrollaron él y su hermano Jonathan en Hewlett-Packard.",
    { w: CW - 0.2 }
  );

  addTakeaway(slide, "El registro es lo que vuelve auditable una exploración.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 34 · Tecnica para ISTQB, practica para ISO

function slideTechniqueOrPractice() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · dos fuentes", "ISTQB dice técnica. ISO dice práctica.", "", false, {
    titleFontSize: 30,
  });

  const wl = 5.9;
  rect(slide, M, 1.92, wl, 0.96, C.white);
  rect(slide, M, 1.92, 0.06, 0.96, AZUL);
  addKicker(slide, M + 0.26, 2.06, "ISTQB · programa CTFL, sección 4.4", AZUL, wl - 0.5);
  addText(slide, "La ubica entre las técnicas de prueba basadas en la experiencia.", {
    x: M + 0.26,
    y: 2.34,
    w: wl - 0.5,
    h: 0.44,
    fontSize: 12,
    color: C.ink,
  });

  addQuote(
    slide,
    M,
    3.02,
    wl,
    1.68,
    "Las prácticas de prueba basadas en la experiencia, como la prueba exploratoria, no se definen en este documento, porque este documento solo describe técnicas para diseñar casos de prueba.",
    "ISO/IEC/IEEE 29119-4:2021, introducción · traducción del original en inglés",
    ROJO
  );
  addText(
    slide,
    "Su única técnica basada en la experiencia, en la cláusula 5.4, es la adivinación de errores: anticipar por experiencia dónde suelen equivocarse los programas.",
    { x: M, y: 4.84, w: wl, h: 0.62, fontSize: 10.6, color: C.slate, lineSpacingMultiple: 1.12 }
  );

  const xd = M + wl + 0.36;
  const wd = CW - wl - 0.36;
  rect(slide, xd, 1.92, wd, 3.9, C.warm, ORO);
  addKicker(slide, xd + 0.28, 2.08, "Práctica · organiza el trabajo", ORO, wd - 0.5);
  addText(slide, "La sesión exploratoria", {
    x: xd + 0.28,
    y: 2.36,
    w: wd - 0.5,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 17,
    bold: true,
    color: C.ink,
  });
  [
    ["Técnica · valores límite", "Probar justo en el borde de lo permitido: 30 y 31 personas."],
    ["Técnica · partición de equivalencia", "Probar un caso de un grupo que debería rechazarse: un RUT sin formato."],
  ].forEach(([rotulo, uso], index) => {
    const y = 2.92 + index * 0.94;
    rect(slide, xd + 0.28, y, wd - 0.56, 0.8, C.white);
    rect(slide, xd + 0.28, y, 0.06, 0.8, AZUL);
    addKicker(slide, xd + 0.5, y + 0.12, rotulo, AZUL, wd - 0.9);
    addText(slide, uso, { x: xd + 0.5, y: y + 0.38, w: wd - 0.9, h: 0.36, fontSize: 10.8, color: C.ink });
  });
  addText(slide, "Una técnica produce casos con un procedimiento. La práctica decide, sobre la marcha, cuándo aplicar cuál.", {
    x: xd + 0.28,
    y: 4.9,
    w: wd - 0.56,
    h: 0.78,
    fontSize: 11.4,
    italic: true,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Las dos coinciden en lo que importa: se diseña, se ejecuta y se evalúa a la vez, y se registra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 35 · La sesion con carta y su registro

function slideCharterSession() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la sesión", "Una carta, veinte minutos, seis pruebas", "", false);

  rect(slide, M, 1.9, CW, 0.96, NAVY_CHIP);
  addKicker(slide, M + 0.3, 2.02, "Carta · 20 minutos", C.gold, 4);
  addText(
    slide,
    "Explorar la reserva de un bloque con datos incompletos, inválidos o repetidos, para encontrar situaciones en que una persona no logre reservar o no entienda qué pasó.",
    { x: M + 0.3, y: 2.28, w: CW - 0.6, h: 0.52, fontSize: 12.2, color: C.white, lineSpacingMultiple: 1.1 }
  );

  const filas = [
    ["Todo completo menos el nombre", "Reserva confirmada.  | 11.111.111-1 | ana.rivas@ejemplo.cl | bloque 4"],
    ["Reservar un bloque ya tomado", "La reserva no esta permitida"],
    ["0 personas", "No se envía. Globo del navegador: Value must be greater than or equal to 1."],
    ["31 personas", "No se envía. Globo del navegador: Value must be less than or equal to 30."],
    ["Doble clic rápido en «Reservar»", "Ficha del bloque: Tomado · Mensaje final: La reserva no esta permitida"],
    ["RUT escrito como «hola»", "Reserva confirmada. Ana Rivas | hola | ana.rivas@ejemplo.cl | bloque 4"],
  ];
  const y0 = 3.02;
  const wN = 0.5;
  const wP = 3.3;
  addText(slide, "#", { x: M + 0.14, y: y0, w: 0.3, h: 0.22, fontSize: 9, bold: true, color: C.slate });
  addText(slide, "QUÉ SE PROBÓ", { x: M + wN, y: y0, w: wP, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "QUÉ APARECIÓ EN PANTALLA, LITERAL", {
    x: M + wN + wP,
    y: y0,
    w: 5,
    h: 0.22,
    fontSize: 9,
    bold: true,
    color: C.slate,
    charSpacing: 1,
  });
  filas.forEach(([probo, pantalla], index) => {
    const y = y0 + 0.3 + index * 0.43;
    const clave = index === 4;
    rect(slide, M, y, CW, 0.38, clave ? C.warm : C.white);
    if (clave) rect(slide, M, y, 0.06, 0.38, ROJO);
    addText(slide, String(index + 1), {
      x: M + 0.14,
      y: y + 0.04,
      w: 0.3,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: clave ? ROJO : C.slate,
      valign: "mid",
    });
    addText(slide, probo, { x: M + wN, y: y + 0.04, w: wP - 0.1, h: 0.3, fontSize: 11, bold: clave, color: C.ink, valign: "mid" });
    addText(slide, pantalla, {
      x: M + wN + wP,
      y: y + 0.04,
      w: CW - wN - wP - 0.14,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.6,
      color: clave ? ROJO : C.ink,
      valign: "mid",
    });
  });

  addTakeaway(slide, "La prueba 5 es el hallazgo de la sesión, y nadie la habría escrito como caso de antemano.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 36 · El doble clic

function slideDoubleClick() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el hallazgo", "La persona reservó, y la pantalla le dice que no", "", false, {
    titleFontSize: 28,
  });

  const wImg = 6.3;
  const hNav = navegador(slide, { x: M, y: 1.92, w: wImg, imagen: ASSETS13.dobleClic, aspecto: ASPECTO.dobleClic });
  const imgX = M + 0.02;
  const imgY = 1.92 + 0.34;
  const imgW = wImg - 0.04;
  const imgH = hNav - 0.36;
  circulo(slide, imgX + imgW * 0.9, imgY + imgH * 0.428, 0.32, VERDE, 1, C.white, 10);
  circulo(slide, imgX + imgW * 0.37, imgY + imgH * 0.845, 0.32, ROJO, 2, C.white, 10);

  const xd = M + wImg + 0.36;
  const wd = CW - wImg - 0.36;
  addKicker(slide, xd, 1.92, "Dos clics, dos solicitudes", AZUL, wd);
  [
    [1, VERDE, "La primera reserva el bloque", "La ficha queda «Tomado»: la reserva existe."],
    [2, ROJO, "La segunda choca con esa misma reserva", "Su rechazo llega al último, y es lo que la página muestra."],
  ].forEach(([numero, color, titulo, glosa], index) => {
    const y = 2.24 + index * 1.02;
    rect(slide, xd, y, wd, 0.9, numero === 2 ? C.warm : C.white);
    circulo(slide, xd + 0.32, y + 0.3, 0.32, color, numero, C.white, 10);
    addText(slide, titulo, { x: xd + 0.62, y: y + 0.14, w: wd - 0.8, h: 0.3, fontSize: 12.2, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.62, y: y + 0.46, w: wd - 0.8, h: 0.36, fontSize: 10.6, color: C.slate });
  });

  rect(slide, xd, 4.36, wd, 1.2, NAVY_CHIP);
  addText(slide, "10 / 10", {
    x: xd + 0.26,
    y: 4.5,
    w: 2.0,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.gold,
    valign: "mid",
  });
  addText(slide, "Repetido diez veces, el mensaje final fue el rechazo las diez.", {
    x: xd + 2.3,
    y: 4.5,
    w: wd - 2.5,
    h: 0.9,
    fontSize: 12,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "El defecto más grave de la sesión no estaba en ninguna lista de casos.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 37 · Dos observaciones que dependen de quien mira

function slideWhoIsLooking() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la sesión", "Dos cosas que dependen de quién mira", "", false, {
    titleFontSize: 30,
  });

  const w = (CW - 0.3) / 2;
  const y = 1.92;
  const h = 4.06;

  // Validacion nativa
  rect(slide, M, y, w, h, C.white);
  rect(slide, M, y, w, 0.06, AZUL);
  addKicker(slide, M + 0.26, y + 0.22, "Pruebas 3 y 4 · la validación nativa", AZUL, w - 0.5);
  addText(slide, "Personas", { x: M + 0.3, y: y + 0.6, w: 2, h: 0.22, fontSize: 10.4, color: C.slate });
  rect(slide, M + 0.3, y + 0.86, 2.3, 0.44, C.white, C.border);
  addText(slide, "31", { x: M + 0.44, y: y + 0.9, w: 1, h: 0.36, fontSize: 13, color: C.ink, valign: "mid" });
  rect(slide, M + 0.3, y + 1.4, w - 0.6, 0.46, C.softNeutral, C.border);
  addText(slide, "Value must be less than or equal to 30.", {
    x: M + 0.44,
    y: y + 1.44,
    w: w - 0.9,
    h: 0.38,
    fontSize: 11.4,
    color: C.ink,
    valign: "mid",
  });
  addText(
    slide,
    "El formulario nunca llega a la API: el navegador revisa el mínimo y el máximo que el campo declara (atributos min y max) antes de enviar, y muestra un globo sobre él.",
    { x: M + 0.3, y: y + 2.06, w: w - 0.6, h: 0.8, fontSize: 11.2, color: C.ink, lineSpacingMultiple: 1.12 }
  );
  addText(
    slide,
    "Sale en inglés porque el navegador de las pruebas está configurado en inglés. En uno configurado en español, saldría en español.",
    { x: M + 0.3, y: y + 2.92, w: w - 0.6, h: 0.9, fontSize: 11.2, italic: true, color: C.slate, lineSpacingMultiple: 1.12 }
  );

  // Datos personales en la confirmacion
  const xd = M + w + 0.3;
  rect(slide, xd, y, w, h, C.white);
  rect(slide, xd, y, w, 0.06, ROJO);
  addKicker(slide, xd + 0.26, y + 0.22, "Prueba 1 · la confirmación", ROJO, w - 0.5);
  rect(slide, xd + 0.3, y + 0.62, w - 0.6, 1.24, C.softNeutral);
  addText(slide, "Reserva confirmada.", { x: xd + 0.46, y: y + 0.72, w: w - 0.9, h: 0.26, fontSize: 11.4, color: VERDE });
  const datos = [
    ["RUT", "11.111.111-1"],
    ["Correo", "ana.rivas@ejemplo.cl"],
  ];
  datos.forEach(([rotulo, valor], index) => {
    const yy = y + 1.04 + index * 0.38;
    addText(slide, rotulo, { x: xd + 0.46, y: yy, w: 0.9, h: 0.3, fontSize: 10, bold: true, color: ROJO, valign: "mid" });
    rect(slide, xd + 1.4, yy, 2.9, 0.3, C.paleRed);
    addText(slide, valor, {
      x: xd + 1.5,
      y: yy + 0.02,
      w: 2.7,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      color: C.ink,
      valign: "mid",
    });
  });
  addText(slide, "La confirmación muestra el RUT y el correo completos en pantalla, a la vista de quien esté mirando.", {
    x: xd + 0.3,
    y: y + 2.06,
    w: w - 0.6,
    h: 0.8,
    fontSize: 11.2,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });
  addText(slide, "No es de usabilidad. Si es aceptable, lo decide la finalidad escrita en el requisito, no la sesión.", {
    x: xd + 0.3,
    y: y + 2.92,
    w: w - 0.6,
    h: 0.9,
    fontSize: 11.2,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "El registro guarda lo que apareció. Decidir si es un defecto necesita algo más.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 38 · Un agente que entra por primera vez

function slideAgentExplorer() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el agente", "Un agente que entra por primera vez", "", false);

  const panel = codigo(slide, {
    x: M,
    y: 1.9,
    w: CW,
    lang: "bash",
    fontSize: 10,
    marcas: [
      { linea: 1, color: ROJO, numero: 1 },
      { linea: 6, color: C.gold, numero: 2 },
      { linea: 10, color: VERDE, numero: 3 },
    ],
    code: [
      'claude -p "Eres una persona que usa este sistema por primera vez. No tienes acceso al codigo,',
      "solo a un navegador. Abre http://127.0.0.1:8000.",
      "",
      "Carta de la sesion: explorar la reserva de un bloque del laboratorio, con el objetivo de",
      "encontrar situaciones en que una persona no logre reservar, o no entienda que paso. Tienes un",
      "maximo de 30 acciones en el navegador.",
      "",
      "Al terminar entrega un registro de la sesion: que probaste, que observaste literalmente en",
      "pantalla, y para cada hallazgo di si lo consideras un defecto o una duda que alguien con el",
      'requisito deberia resolver." --mcp-config mcp.json --allowed-tools "mcp__navegador__*"',
    ].join("\n"),
  });

  const notas = [
    [1, ROJO, "Sin acceso al código", "En los bloques anteriores el agente leía el código. Aquí ve el sistema como alguien que llega sin saber nada."],
    [2, C.gold, "Carta y presupuesto", "La misma forma de sesión. El tiempo acotado de una persona se traduce en treinta acciones."],
    [3, VERDE, "Solo el navegador", "claude -p le entrega el pedido al agente. Las dos opciones del final conectan la herramienta del navegador, descrita en mcp.json, y le permiten usar solo esa."],
  ];
  const y = 1.9 + panel.h + 0.16;
  const h = 6.0 - y;
  const gap = 0.16;
  const w = (CW - gap * 2) / 3;
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const x = M + index * (w + gap);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, w, 0.06, color === C.gold ? ORO : color);
    circulo(slide, x + 0.34, y + 0.34, 0.3, color, numero, color === C.gold ? C.navy : C.white, 9.6);
    addText(slide, titulo, { x: x + 0.62, y: y + 0.2, w: w - 0.8, h: 0.28, fontSize: 12.2, bold: true, color: C.ink });
    addText(slide, glosa, {
      x: x + 0.22,
      y: y + 0.6,
      w: w - 0.44,
      h: h - 0.68,
      fontSize: 10.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "Usó 29 de las 30 acciones, y declaró que cuatro se le fueron en errores propios.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 39 · Sus nueve hallazgos

function slideAgentFindings() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · su registro", "Nueve hallazgos, cada uno clasificado por él", "", false);

  const clases = {
    Defecto: ROJO,
    "Defecto menor": ROJO,
    Duda: ORO,
    "Duda que roza el defecto": ORO,
    "Observación técnica": C.slate,
  };
  const hallazgos = [
    ["Con el formulario vacío sale [object Object].", "Defecto"],
    ["«La reserva no esta permitida» no dice por qué, y es el mismo texto con el bloque tomado y con 50 personas.", "Defecto"],
    ["El límite de personas no aparece en ninguna parte.", "Duda"],
    ["La lista de bloques deja elegir bloques ya tomados.", "Duda que roza el defecto"],
    ["Acepta cualquier dígito verificador del RUT, y el RUT de ejemplo 12.345.678-9 lo tiene mal: el correcto es 5.", "Duda"],
    ["La confirmación no muestra la cantidad de personas.", "Duda"],
    ["Los bloques no muestran horario ni fecha.", "Duda"],
    ["El mensaje no cambia entre dos intentos seguidos.", "Defecto menor"],
    ["La consola del navegador, su registro interno de errores, marcó tres.", "Observación técnica"],
  ];
  const nuevos = [3, 4, 6];
  const wChip = 2.5;
  hallazgos.forEach(([texto, clase], index) => {
    const y = 1.88 + index * 0.42;
    const nuevo = nuevos.includes(index);
    rect(slide, M, y, CW, 0.37, C.white);
    if (nuevo) rect(slide, M, y, 0.07, 0.37, VERDE);
    addText(slide, String(index + 1), {
      x: M + 0.16,
      y: y + 0.035,
      w: 0.3,
      h: 0.3,
      fontSize: 11.4,
      bold: true,
      color: nuevo ? VERDE : C.slate,
      valign: "mid",
    });
    addText(slide, texto, {
      x: M + 0.56,
      y: y + 0.035,
      w: CW - wChip - 0.8,
      h: 0.3,
      fontSize: 10.8,
      color: C.ink,
      valign: "mid",
    });
    const color = clases[clase];
    rect(slide, M + CW - wChip - 0.1, y + 0.055, wChip, 0.26, color);
    addText(slide, clase, {
      x: M + CW - wChip - 0.04,
      y: y + 0.065,
      w: wChip - 0.12,
      h: 0.24,
      fontSize: 9.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
  });

  addText(slide, "En verde, los que la sesión con carta no había visto. El agente calculó el dígito verificador, y tiene razón.", {
    x: M,
    y: 5.72,
    w: CW,
    h: 0.26,
    fontSize: 10.6,
    italic: true,
    color: VERDE,
  });

  addTakeaway(slide, "En amplitud y velocidad, el recorrido es bueno.", { y: 6.2, h: 0.52 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · Reproducir el hallazgo 2

function slideReproduce() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · reproducir", "Un hallazgo es una hipótesis: se reproduce", "", false);

  addText(
    slide,
    "El hallazgo 2 llamaba la atención: en la sesión con carta, con 31 personas, el formulario ni siquiera se había enviado. Se repitió su secuencia exacta —primero un bloque tomado, después el bloque 2 con 50 personas— observando además la red.",
    { x: M, y: 1.9, w: CW, h: 0.6, fontSize: 12, color: C.slate, lineSpacingMultiple: 1.12 }
  );

  terminal(slide, {
    x: M,
    y: 2.64,
    w: CW,
    title: "Reproducción del hallazgo 2",
    fontSize: 11,
    lines: [
      { t: "[mensaje en pantalla] La reserva no esta permitida", k: "plain" },
      { t: "[solicitudes enviadas por el segundo intento] 0", k: "err" },
      { t: "[validación nativa del campo] Value must be less than or equal to 30.", k: "muted" },
      { t: '[la API, si recibiera 50 personas] 409 {"detail":"La sala no tiene ese cupo"}', k: "muted" },
    ],
  });

  const tarjetas = [
    [VERDE, "Mitad cierta", "El rechazo por bloque tomado no dice por qué."],
    [ROJO, "Mitad falsa", "El segundo intento no envió nada. El mensaje era el del intento anterior, que seguía en pantalla."],
    [ORO, "La causa era el 8", "Cuando el navegador bloquea el envío, la página no borra el mensaje anterior. Vio el síntoma y no lo conectó."],
  ];
  const y = 4.3;
  const h = 1.68;
  const gap = 0.16;
  const w = (CW - gap * 2) / 3;
  tarjetas.forEach(([color, titulo, glosa], index) => {
    const x = M + index * (w + gap);
    rect(slide, x, y, w, h, index === 1 ? C.warm : C.white);
    rect(slide, x, y, w, 0.06, color);
    addText(slide, titulo, { x: x + 0.24, y: y + 0.2, w: w - 0.48, h: 0.28, fontSize: 13, bold: true, color });
    addText(slide, glosa, {
      x: x + 0.24,
      y: y + 0.56,
      w: w - 0.48,
      h: h - 0.64,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "Lo afirmó con la misma seguridad que el resto. El globo que detuvo el envío no está en su registro.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · Los veredictos

function slideVerdicts() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · veredictos", "Reproducidos, los nueve quedan así", "", false);

  const grupos = [
    [
      "Confirmado",
      VERDE,
      [
        [1, "El [object Object] del bloque 1."],
        [4, "La lista ofrece bloques que la grilla muestra tomados."],
        [8, "Y es la causa del error del 2."],
      ],
    ],
    [
      "Exige el requisito",
      ORO,
      [
        [3, "Si el límite debe mostrarse lo decide quien define el producto."],
        [5, "Validar el dígito es una regla que el requisito debe declarar."],
        [6, "Qué muestra una confirmación lo decide el requisito."],
        [7, "Y apunta a algo más serio: la tabla de reservas no guarda fecha."],
      ],
    ],
    ["Mitad y mitad", ROJO, [[2, "El mensaje no dice por qué; pero con 50 personas no hubo solicitud."]]],
    ["No es defecto", C.slate, [[9, "El navegador registra las respuestas 409 y 422 como errores de carga."]]],
  ];
  const gap = 0.16;
  const w = (CW - gap * 3) / 4;
  const y = 1.92;
  const h = 4.04;
  grupos.forEach(([nombre, color, items], index) => {
    const x = M + index * (w + gap);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, w, 0.5, color);
    addText(slide, nombre.toUpperCase(), {
      x: x + 0.2,
      y: y + 0.1,
      w: w - 0.9,
      h: 0.3,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      charSpacing: 0.9,
      valign: "mid",
    });
    addText(slide, String(items.length), {
      x: x + w - 0.64,
      y: y + 0.06,
      w: 0.46,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: C.white,
      align: "right",
      valign: "mid",
    });
    items.forEach(([numero, texto], i) => {
      const yi = y + 0.7 + i * 0.82;
      circulo(slide, x + 0.36, yi + 0.18, 0.34, color, numero, C.white, 10.4);
      addText(slide, texto, {
        x: x + 0.66,
        y: yi,
        w: w - 0.84,
        h: 0.72,
        fontSize: 10.4,
        color: C.ink,
        lineSpacingMultiple: 1.08,
      });
    });
  });

  addTakeaway(slide, "Cuatro de los nueve no se pueden resolver mirando la pantalla: exigen conocer el requisito.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 42 · Testigo, no juez

function slideWitnessNotJudge() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la lectura", "Testigo, no juez", "", false);

  const w = (CW - 0.3) / 2;
  const cruces = [
    [
      AZUL,
      "Solo la sesión con carta",
      ["El doble clic, el defecto más grave de los dos registros. El agente no lo intentó.", "El RUT y el correo completos. El agente los copió en su tabla sin señalarlos."],
    ],
    [ORO, "Solo el agente", ["La lista que ofrece bloques tomados.", "El dígito verificador del RUT de ejemplo.", "Los bloques sin horario ni fecha."]],
  ];
  cruces.forEach(([color, titulo, items], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 1.9, w, 1.66, C.white);
    rect(slide, x, 1.9, 0.06, 1.66, color);
    addKicker(slide, x + 0.26, 2.02, titulo, color, w - 0.5);
    items.forEach((texto, i) => {
      const yi = 2.34 + i * (items.length === 2 ? 0.56 : 0.38);
      rect(slide, x + 0.28, yi + 0.08, 0.09, 0.09, color);
      addText(slide, texto, {
        x: x + 0.46,
        y: yi,
        w: w - 0.7,
        h: items.length === 2 ? 0.5 : 0.3,
        fontSize: 10.8,
        color: C.ink,
        lineSpacingMultiple: 1.06,
      });
    });
  });

  rect(slide, M, 3.72, CW, 1.02, NAVY_CHIP);
  addText(
    slide,
    "Un hallazgo de exploración es una hipótesis. Se vuelve un defecto cuando se reproduce, y se vuelve un requisito cuando alguien con autoridad sobre el producto decide que el sistema debería comportarse de otra forma.",
    { x: M + 0.34, y: 3.82, w: CW - 0.68, h: 0.82, fontSize: 13, bold: true, color: C.white, valign: "mid", lineSpacingMultiple: 1.14 }
  );

  const roles = [
    [VERDE, "Testigo", "Rápido y amplio: recorre en minutos lo que a una persona le toma una sesión, y ve lo que quien conoce el sistema ya dejó de ver."],
    [ROJO, "No es juez", "Afirma con la misma seguridad lo que observó y lo que dedujo. Separar una cosa de otra sigue siendo de quien conoce el requisito."],
  ];
  roles.forEach(([color, titulo, glosa], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 4.9, w, 1.1, C.white);
    rect(slide, x, 4.9, w, 0.06, color);
    addText(slide, titulo, { x: x + 0.24, y: 5.02, w: 2, h: 0.28, fontSize: 13, bold: true, color });
    addText(slide, glosa, { x: x + 0.24, y: 5.32, w: w - 0.48, h: 0.62, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "«El mensaje no dice por qué» es una observación. Para probarla, hay que decir qué sí debería decir.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 43 · Preguntas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes de precisar", [
    [
      "Para ISTQB la exploratoria es una técnica y para ISO una práctica. Si en la sesión se usaron valores límite al probar 30 y 31 personas, ¿qué clasificación describe mejor lo que pasó?",
      "Revisa qué produce una técnica y qué organiza una práctica. ¿Los valores límite los aportó la exploración o los usó?",
    ],
    [
      "El agente afirmó que el mismo mensaje sale con un bloque tomado y con demasiadas personas, y era falso. ¿Qué tendría que haber hecho, y por qué no basta con pedirle más cuidado?",
      "Mira cuántas solicitudes envió el segundo intento. ¿Qué necesitaba observar para saberlo, y alcanzaba con la pantalla?",
    ],
    [
      "El agente vio tres cosas que la sesión no vio, y la sesión encontró el defecto más grave. Con veinte minutos para explorar tu sistema, ¿cómo repartirías el trabajo entre tú y un agente?",
      "Compara qué aporta cada uno en amplitud, en profundidad y en capacidad de reproducir. ¿Quién decide al final qué es un defecto?",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 44 · Respuestas del bloque 3

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "La de ISO: una práctica",
      "La exploración organizó la sesión y usó adentro una técnica, los valores límite.",
      "Las técnicas producen casos; la exploración decide sobre la marcha cuándo aplicar cuál.",
      "Creer que explorar reemplaza a las técnicas, o que es probar al azar.",
    ],
    [
      "Observar la red",
      "Contar las solicitudes del segundo intento habría dado cero. Más cuidado no le da un dato que no ve.",
      "Lo que se ve en pantalla puede ser un resto del intento anterior.",
      "Tomar una afirmación segura como si fuera un hecho reproducido.",
    ],
    [
      "Amplitud al agente, juicio a ti",
      "El agente recorre rápido y amplio; tú intentas lo incómodo, reproduces y decides con el requisito.",
      "Ninguno de los dos registros, por sí solo, tenía todos los hallazgos.",
      "Delegar también la decisión de qué es un defecto.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 45 · Divisor del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 4 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "De un hallazgo a una prueba que puede fallar", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "El doble clic se convierte en un criterio con magnitud, método y umbral. Y no toda prueba bien redactada lo detecta: una de las dos pasa con el defecto presente.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 4, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 46 · Confunde no se puede cumplir ni incumplir

function slideConfunde() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la forma", "«Confunde» no se puede cumplir ni incumplir", "", false, {
    titleFontSize: 28,
  });

  const w = (CW - 0.3) / 2;
  rect(slide, M, 1.92, w, 1.56, C.warm);
  rect(slide, M, 1.92, 0.06, 1.56, ORO);
  addKicker(slide, M + 0.28, 2.06, "Una observación verdadera y reproducible", ORO, w - 0.5);
  addText(slide, "La persona hace doble clic, reserva, y la pantalla le dice que no pudo.", {
    x: M + 0.28,
    y: 2.36,
    w: w - 0.5,
    h: 0.56,
    fontSize: 13,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  addText(slide, "Todavía no dice qué debería pasar en su lugar.", {
    x: M + 0.28,
    y: 3.0,
    w: w - 0.5,
    h: 0.3,
    fontSize: 11,
    italic: true,
    color: C.slate,
  });

  const xd = M + w + 0.3;
  rect(slide, xd, 1.92, w, 1.56, C.white);
  rect(slide, xd, 1.92, 0.06, 1.56, ROJO);
  addKicker(slide, xd + 0.28, 2.06, "Una opinión", ROJO, w - 0.5);
  addText(slide, "«La interfaz confunde»", {
    x: xd + 0.28,
    y: 2.36,
    w: w - 0.5,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Nadie puede ejecutar algo que diga «confunde: sí» o «confunde: no».", {
    x: xd + 0.28,
    y: 3.0,
    w: w - 0.5,
    h: 0.3,
    fontSize: 11,
    italic: true,
    color: C.slate,
  });

  addKicker(slide, M, 3.72, "Las tres piezas de un criterio verificable", AZUL, 8);
  const piezas = [
    ["Magnitud observable", "Algo que se pueda contar, medir o detectar en el sistema.", AZUL],
    ["Método de medición", "Cómo se obtiene, de modo que dos personas obtengan lo mismo.", AZUL],
    ["Umbral", "El valor que separa lo aceptable de lo inaceptable.", AZUL],
  ];
  const wp = 2.62;
  const op = 0.36;
  const y = 4.04;
  const h = 1.9;
  piezas.forEach(([nombre, glosa, color], index) => {
    const x = M + index * (wp + op);
    rect(slide, x, y, wp, h, C.white);
    rect(slide, x, y, wp, 0.06, color);
    addText(slide, nombre, { x: x + 0.22, y: y + 0.22, w: wp - 0.4, h: 0.3, fontSize: 13, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.22, y: y + 0.62, w: wp - 0.4, h: 1.1, fontSize: 11, color: C.slate, lineSpacingMultiple: 1.12 });
    addText(slide, index < 2 ? "+" : "=", {
      x: x + wp,
      y: y + 0.6,
      w: op,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.slate,
      align: "center",
      valign: "mid",
    });
  });
  const xr = M + 3 * (wp + op);
  rect(slide, xr, y, CW - (xr - M), h, VERDE);
  addText(slide, "Criterio verificable", {
    x: xr + 0.22,
    y: y + 0.22,
    w: CW - (xr - M) - 0.4,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: C.white,
  });
  addText(slide, "Se puede cumplir o incumplir, y una prueba lo puede comprobar.", {
    x: xr + 0.22,
    y: y + 0.62,
    w: CW - (xr - M) - 0.4,
    h: 1.1,
    fontSize: 11,
    color: C.white,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Mientras una observación no tenga esa forma, es una opinión.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 47 · La capacidad de interaccion

function slideInteractionCapability() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la norma", "Qué característica de calidad está en juego", "", false, {
    titleFontSize: 28,
  });

  addQuote(
    slide,
    M,
    1.9,
    CW,
    1.2,
    "Capacidad de interacción: capacidad de un producto de ser usado por usuarios determinados para intercambiar información con el sistema mediante su interfaz y completar la tarea prevista.",
    "ISO/IEC 25010:2023, cláusula 3.4 · interaction capability · traducción del original en inglés",
    AZUL
  );

  const w = 4.7;
  const y = 3.42;
  const h = 2.5;
  const tarjetas = [
    [M, VERDE, "Capacidad de interacción", "Una propiedad del producto.", "Por eso se puede comprobar con pruebas, como las de hoy."],
    [M + CW - w, C.slate, "Usabilidad", "Si las personas logran sus objetivos con eficacia, eficiencia y satisfacción.", "Se mide con personas reales usando el sistema."],
  ];
  tarjetas.forEach(([x, color, nombre, que, como]) => {
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, w, 0.06, color);
    addText(slide, nombre, {
      x: x + 0.26,
      y: y + 0.24,
      w: w - 0.5,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color,
    });
    addText(slide, que, { x: x + 0.26, y: y + 0.76, w: w - 0.5, h: 0.7, fontSize: 12.4, color: C.ink, lineSpacingMultiple: 1.12 });
    addText(slide, como, { x: x + 0.26, y: y + 1.56, w: w - 0.5, h: 0.7, fontSize: 11.4, italic: true, color: C.slate, lineSpacingMultiple: 1.12 });
  });
  const xa = M + w + 0.2;
  const wa = CW - 2 * w - 0.4;
  arrow(slide, xa, y + h / 2, wa, C.ink, 2);
  addText(slide, "es requisito previo de", {
    x: xa,
    y: y + h / 2 - 0.5,
    w: wa,
    h: 0.3,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addText(slide, "nota de la cláusula 3.4", {
    x: xa,
    y: y + h / 2 + 0.16,
    w: wa,
    h: 0.24,
    fontSize: 9.6,
    italic: true,
    color: C.slate,
    align: "center",
  });

  addTakeaway(slide, "La usabilidad se mide con personas. La capacidad de interacción, con pruebas.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 48 · Las ocho subcaracteristicas

function slideSubcharacteristics() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la norma", "Una de las ocho corresponde al doble clic", "", false, {
    titleFontSize: 30,
  });

  const subs = [
    ["Reconocibilidad de adecuación", "Que la persona reconozca si el producto le sirve.", ""],
    ["Aprendibilidad", "Que aprenda a usarlo en un tiempo determinado.", ""],
    ["Operabilidad", "Que sea fácil de operar y controlar.", ""],
    ["Protección frente a errores del usuario", "Que prevenga los errores de operación.", ""],
    ["Compromiso del usuario", "Reemplaza a la antigua estética de la interfaz.", "Cambió en 2023"],
    ["Inclusividad", "Que puedan usarlo personas diversas.", "Sale de dividir la accesibilidad"],
    ["Asistencia al usuario", "Que la persona reciba ayuda.", "Sale de dividir la accesibilidad"],
    ["Autodescriptividad", "Que muestre por sí mismo lo que la persona necesita saber.", "Nueva en 2023"],
  ];
  const gap = 0.14;
  const w = (CW - gap * 3) / 4;
  const h = 1.3;
  subs.forEach(([nombre, glosa, marca], index) => {
    const x = M + (index % 4) * (w + gap);
    const y = 1.92 + Math.floor(index / 4) * (h + gap);
    const clave = index === 3;
    rect(slide, x, y, w, h, clave ? NAVY_CHIP : C.white);
    rect(slide, x, y, w, 0.06, clave ? C.red : C.border);
    addText(slide, String(index + 1), {
      x: x + 0.18,
      y: y + 0.14,
      w: 0.3,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: clave ? C.gold : C.slate,
    });
    addText(slide, nombre, {
      x: x + 0.46,
      y: y + 0.12,
      w: w - 0.6,
      h: 0.46,
      fontSize: 11.2,
      bold: true,
      color: clave ? C.white : C.ink,
      lineSpacingMultiple: 1.02,
    });
    addText(slide, glosa, {
      x: x + 0.18,
      y: y + 0.62,
      w: w - 0.32,
      h: 0.4,
      fontSize: 9.8,
      color: clave ? C.sand : C.slate,
      lineSpacingMultiple: 1.05,
    });
    if (marca) {
      addText(slide, marca.toUpperCase(), {
        x: x + 0.18,
        y: y + h - 0.24,
        w: w - 0.32,
        h: 0.16,
        fontSize: 7.4,
        bold: true,
        color: ORO,
        charSpacing: 0.6,
      });
    }
  });

  addQuote(
    slide,
    M,
    4.84,
    CW,
    1.04,
    "Protección frente a errores del usuario: capacidad de un producto de prevenir errores de operación.",
    "ISO/IEC 25010:2023, cláusula 3.4.4 · user error protection · traducción del original en inglés",
    ROJO
  );

  addTakeaway(slide, "Apretar dos veces es un error de operación, y el producto no lo previene: lo convierte en dos solicitudes.", {
    fontSize: 13,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 49 · Dos criterios para el mismo hallazgo

function slideTwoCriteria() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · dos criterios", "Del mismo hallazgo salen dos criterios distintos", "", false, {
    titleFontSize: 28,
  });

  const wl = 1.7;
  const gap = 0.16;
  const wc = (CW - wl - gap * 2) / 2;
  const xA = M + wl + gap;
  const xB = xA + wc + gap;
  rect(slide, xA, 1.92, wc, 0.46, AZUL);
  addText(slide, "Criterio A · el mecanismo", { x: xA + 0.2, y: 1.96, w: wc - 0.4, h: 0.38, fontSize: 12.6, bold: true, color: C.white, valign: "mid" });
  rect(slide, xB, 1.92, wc, 0.46, ORO);
  addText(slide, "Criterio B · lo que la persona ve", { x: xB + 0.2, y: 1.96, w: wc - 0.4, h: 0.38, fontSize: 12.6, bold: true, color: C.white, valign: "mid" });

  const filas = [
    ["Magnitud", "Cantidad de solicitudes de reserva que envía la página ante un doble clic.", "Coincidencia entre el mensaje final y el estado real del bloque."],
    ["Método", "Registrar las solicitudes que salen de la página mientras se hace el doble clic.", "Hacer el doble clic, esperar a que la ficha del bloque cambie y leer el mensaje."],
    ["Umbral", "Exactamente una.", "Si la ficha dice «Tomado», el mensaje dice «Reserva confirmada»."],
    ["Criterio", "Un doble clic en «Reservar» envía una sola solicitud de reserva.", "Tras un doble clic, el mensaje dice lo que realmente pasó."],
  ];
  filas.forEach(([pieza, a, b], index) => {
    const y = 2.48 + index * 0.88;
    const final = index === 3;
    addText(slide, pieza.toUpperCase(), {
      x: M,
      y: y + 0.08,
      w: wl,
      h: 0.6,
      fontSize: 10,
      bold: true,
      color: final ? VERDE : C.slate,
      charSpacing: 1,
      valign: "mid",
    });
    [
      [xA, a],
      [xB, b],
    ].forEach(([x, texto]) => {
      rect(slide, x, y, wc, 0.78, final ? C.warm : C.white);
      addText(slide, texto, {
        x: x + 0.2,
        y: y + 0.08,
        w: wc - 0.4,
        h: 0.62,
        fontSize: 11.6,
        bold: final,
        italic: final,
        color: C.ink,
        valign: "mid",
        lineSpacingMultiple: 1.1,
      });
    });
  });

  addTakeaway(slide, "A mide la causa. B mide la consecuencia que sufre la persona: a primera vista, el más fiel.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 50 · El criterio A escrito como prueba

function slideTestA() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la prueba A", "El criterio A, escrito como prueba", "", false);

  const panel = codigo(slide, {
    x: M,
    y: 1.9,
    w: CW,
    lang: "typescript",
    fontSize: 10,
    marcas: [
      { linea: 2, color: C.gold, numero: 1 },
      { linea: 4, color: C.gold, numero: 2 },
      { linea: 8, color: ROJO, numero: 3 },
      { linea: 11, color: VERDE, numero: 4 },
    ],
    code: [
      'test("un doble clic envía una sola solicitud de reserva", async ({ page }) => {',
      "  await llenarBloque4(page);",
      "  const solicitudes: string[] = [];",
      '  page.on("request", (r) => {',
      '    if (r.method() === "POST" && r.url().endsWith("/reservas")) solicitudes.push(r.url());',
      "  });",
      "",
      '  await page.getByRole("button", { name: "Reservar" }).dblclick();',
      '  await expect(page.getByRole("status")).not.toBeEmpty();',
      "",
      "  expect(solicitudes).toHaveLength(1);",
      "});",
    ].join("\n"),
  });

  const notas = [
    [1, C.gold, "llenarBloque4", "Llena el formulario completo con el bloque 4, sin enviarlo."],
    [2, C.gold, "Anotar lo que sale", "solicitudes es una lista de textos, vacía al inicio. page.on avisa cada solicitud r; las POST (envíos de datos) a /reservas se anotan."],
    [3, ROJO, "El doble clic", "dblclick aprieta dos veces. La línea siguiente espera a que aparezca algún mensaje."],
    [4, VERDE, "Exactamente una", "toHaveLength(1) afirma que la lista tiene un solo elemento."],
  ];
  const y = 1.9 + panel.h + 0.16;
  const h = 6.0 - y;
  const gap = 0.14;
  const w = (CW - gap * 3) / 4;
  notas.forEach(([numero, color, titulo, glosa], index) => {
    const x = M + index * (w + gap);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, w, 0.06, color === C.gold ? ORO : color);
    circulo(slide, x + 0.32, y + 0.32, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, titulo, { x: x + 0.56, y: y + 0.18, w: w - 0.7, h: 0.28, fontSize: 11.6, bold: true, color: C.ink });
    addText(slide, glosa, {
      x: x + 0.2,
      y: y + 0.54,
      w: w - 0.36,
      h: h - 0.6,
      fontSize: 9.6,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "La magnitud es una cantidad: se cuenta, no se interpreta.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 51 · El criterio B y el resultado de las dos

function slideTestBResult() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el resultado", "La A falla, como debía. La B pasa con el defecto.", "", false, {
    titleFontSize: 28,
  });

  const panel = codigo(slide, {
    x: M,
    y: 1.9,
    w: CW,
    lang: "typescript",
    fontSize: 10.4,
    title: "El criterio B, escrito como prueba",
    marcas: [
      { linea: 5, color: C.gold, numero: 1 },
      { linea: 7, color: VERDE, numero: 2 },
    ],
    code: [
      'test("tras un doble clic, el mensaje dice lo que realmente pasó", async ({ page }) => {',
      "  await llenarBloque4(page);",
      "",
      '  await page.getByRole("button", { name: "Reservar" }).dblclick();',
      '  await expect(page.getByRole("listitem").filter({ hasText: "Bloque 4" })).toContainText("Tomado");',
      "",
      '  await expect(page.getByRole("status")).toContainText("Reserva confirmada");',
      "});",
    ].join("\n"),
  });

  const y = 1.9 + panel.h + 0.18;
  const wt = 7.9;
  terminal(slide, {
    x: M,
    y,
    w: wt,
    title: "Contra la interfaz tal como está",
    fontSize: 9.8,
    lines: [
      { t: "x  1 un doble clic envía una sola solicitud de reserva", k: "err" },
      { t: "ok 2 tras un doble clic, el mensaje dice lo que realmente pasó", k: "ok" },
      { t: "Expected length: 1", k: "muted" },
      { t: "Received length: 2", k: "err" },
      { t: 'Received array:  ["http://127.0.0.1:8000/reservas", "http://127.0.0.1:8000/reservas"]', k: "plain" },
    ],
  });

  const xd = M + wt + 0.2;
  const wd = CW - wt - 0.2;
  [
    [1, C.gold, "Espera a que la ficha diga «Tomado»: la reserva ya existe."],
    [2, VERDE, "Afirma que el mensaje dice «Reserva confirmada»."],
  ].forEach(([numero, color, texto], index) => {
    const yy = y + index * 0.66;
    rect(slide, xd, yy, wd, 0.58, C.white);
    circulo(slide, xd + 0.3, yy + 0.29, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, texto, { x: xd + 0.56, y: yy + 0.06, w: wd - 0.66, h: 0.46, fontSize: 10.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.05 });
  });
  addText(slide, "Salieron dos solicitudes. Y la B, la que parecía más fiel al problema, está en verde.", {
    x: xd,
    y: y + 1.36,
    w: wd,
    h: 0.6,
    fontSize: 10.6,
    bold: true,
    color: ROJO,
    lineSpacingMultiple: 1.1,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 52 · Lo que vio la prueba B

function slideWhatBSaw() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · un instante", "La confirmación sí aparece, y dura un instante", "", false, {
    titleFontSize: 28,
  });

  addText(slide, "El párrafo de mensajes durante el doble clic, en tres ejecuciones, con el momento de cada cambio.", {
    x: M,
    y: 1.9,
    w: CW,
    h: 0.28,
    fontSize: 12,
    color: C.slate,
  });

  const x0 = M + 1.5;
  const ancho = CW - 1.5;
  const total = 700;
  const escala = ancho / total;
  [0, 100, 200, 300, 400, 500, 600].forEach((ms) => {
    addText(slide, `${ms} ms`, {
      x: x0 + ms * escala - 0.02,
      y: 2.34,
      w: 0.7,
      h: 0.18,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 8.4,
      color: C.slate,
    });
  });
  rule(slide, x0, 2.58, ancho, C.border, 1);

  const corridas = [
    [144, 277],
    [241, 421],
    [177, 483],
  ];
  corridas.forEach(([t1, t2], index) => {
    const y = 2.74 + index * 0.62;
    addText(slide, `Corrida ${index + 1}`, { x: M, y: y + 0.06, w: 1.4, h: 0.3, fontSize: 11.4, bold: true, color: C.ink, valign: "mid" });
    rect(slide, x0, y, t1 * escala, 0.42, C.softNeutral);
    rect(slide, x0 + t1 * escala, y, (t2 - t1) * escala, 0.42, VERDE);
    addText(slide, `${t2 - t1} ms`, {
      x: x0 + t1 * escala + 0.08,
      y: y + 0.06,
      w: (t2 - t1) * escala - 0.12,
      h: 0.3,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      valign: "mid",
    });
    rect(slide, x0 + t2 * escala, y, (total - t2) * escala, 0.42, ROJO);
    addText(slide, "La reserva no esta permitida", {
      x: x0 + t2 * escala + 0.1,
      y: y + 0.06,
      w: (total - t2) * escala - 0.16,
      h: 0.3,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      valign: "mid",
    });
  });

  const yl = 4.64;
  [
    [C.softNeutral, "Todavía no hay mensaje."],
    [VERDE, "Reserva confirmada: llegó la respuesta de la primera solicitud."],
    [ROJO, "Rechazo: llegó la de la segunda, lo reemplazó, y queda."],
  ].forEach(([color, texto], index) => {
    const x = M + [0, 2.7, 7.4][index];
    rect(slide, x, yl + 0.05, 0.24, 0.18, color, index === 0 ? C.border : color);
    addText(slide, texto, { x: x + 0.34, y: yl, w: [2.3, 4.6, 4.4][index], h: 0.28, fontSize: 10.4, color: C.ink });
  });

  rect(slide, M, 5.08, CW, 0.9, NAVY_CHIP);
  addText(
    slide,
    "La aserción de la prueba B reintenta, y encontró «Reserva confirmada» durante ese instante. En ese momento la condición era cierta, y la prueba se dio por satisfecha.",
    { x: M + 0.34, y: 5.14, w: CW - 0.68, h: 0.78, fontSize: 12.4, color: C.white, valign: "mid", lineSpacingMultiple: 1.12 }
  );

  addTakeaway(slide, "Una aserción que reintenta pregunta si algo llegó a ser cierto, no si terminó siendo cierto.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 53 · Por que se lleva a la suite el criterio A

function slideStableMeasure() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la decisión", "A la suite va el criterio A", "", false);

  const wl = 2.7;
  const wc = 2.3;
  const x1 = M + wl + 0.12;
  const x2 = x1 + wc + 0.12;
  addKicker(slide, x1, 1.96, "Con el defecto", ROJO, wc);
  addKicker(slide, x2, 1.96, "Ya corregido", VERDE, wc);
  const filas = [
    ["Prueba A", "cantidad de solicitudes", [false, true]],
    ["Prueba B", "mensaje final", [true, true]],
  ];
  filas.forEach(([nombre, glosa, resultados], index) => {
    const y = 2.32 + index * 1.2;
    addText(slide, nombre, { x: M, y: y + 0.14, w: wl, h: 0.3, fontSize: 13.4, bold: true, color: C.ink });
    addText(slide, glosa, { x: M, y: y + 0.46, w: wl, h: 0.26, fontSize: 10.6, color: C.slate });
    resultados.forEach((pasa, j) => {
      const x = j === 0 ? x1 : x2;
      rect(slide, x, y, wc, 1.0, pasa ? VERDE : ROJO);
      addText(slide, pasa ? "Pasa" : "Falla", {
        x: x + 0.1,
        y: y + 0.2,
        w: wc - 0.2,
        h: 0.6,
        fontFace: TYPOGRAPHY.display,
        fontSize: 20,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
      });
    });
  });
  addText(slide, "La B da el mismo resultado con el defecto y sin él: no distingue entre los dos, que es la definición de una prueba que no detecta nada.", {
    x: M,
    y: 4.82,
    w: wl + 2 * wc + 0.24,
    h: 0.8,
    fontSize: 11.6,
    bold: true,
    color: ROJO,
    lineSpacingMultiple: 1.12,
  });

  const xd = x2 + wc + 0.4;
  const wd = M + CW - xd;
  [
    [VERDE, "Una medición estable", "Una cantidad de solicitudes no cambia de valor según el instante en que se mira."],
    [ORO, "Una señal que no existe", "Para medir el mensaje final, la página tendría que avisar que terminó de responder. No lo hace, y la persona tampoco sabe cuándo terminó."],
  ].forEach(([color, titulo, glosa], index) => {
    const y = 1.96 + index * 1.86;
    rect(slide, xd, y, wd, 1.72, C.white);
    rect(slide, xd, y, 0.06, 1.72, color);
    addText(slide, titulo, { x: xd + 0.26, y: y + 0.16, w: wd - 0.44, h: 0.3, fontSize: 12.6, bold: true, color });
    addText(slide, glosa, { x: xd + 0.26, y: y + 0.52, w: wd - 0.44, h: 1.1, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.12 });
  });

  addTakeaway(slide, "No porque la causa importe más que la consecuencia, sino porque su medición es estable.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 54 · La correccion

function slideTheFix() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la corrección", "Deshabilitar el botón mientras responde", "", false);

  const wc = 7.1;
  codigo(slide, {
    x: M,
    y: 1.9,
    w: wc,
    lang: "javascript",
    fontSize: 9,
    title: "app.js · el manejador, corregido",
    marcas: [
      { linea: 3, color: VERDE, numero: 1 },
      { linea: 4, color: VERDE, numero: 2 },
      { linea: 5, color: VERDE, numero: 3 },
      { linea: 24, color: VERDE, numero: 4 },
    ],
    code: [
      'formulario.addEventListener("submit", async (evento) => {',
      "  evento.preventDefault();",
      '  const boton = formulario.querySelector("button");',
      "  if (boton.disabled) return;",
      "  boton.disabled = true;",
      "  const datos = Object.fromEntries(new FormData(formulario));",
      "",
      '  const respuesta = await fetch("/reservas", {',
      '    method: "POST",',
      '    headers: { "Content-Type": "application/json" },',
      "    body: JSON.stringify(datos),",
      "  });",
      "  const cuerpo = await respuesta.json();",
      "",
      "  if (respuesta.ok) {",
      '    mensaje.className = "mensaje exito";',
      "    mensaje.textContent = `Reserva confirmada. ${cuerpo.comprobante}`;",
      "    formulario.reset();",
      "    cargarBloques();",
      "  } else {",
      '    mensaje.className = "mensaje error";',
      "    mensaje.textContent = cuerpo.detail;",
      "  }",
      "  boton.disabled = false;",
      "});",
    ].join("\n"),
  });

  const xd = M + wc + 0.3;
  const wd = CW - wc - 0.3;
  const notas = [
    [1, "Busca el botón del formulario."],
    [2, "Si ya está deshabilitado, hay una solicitud en curso: no hace nada."],
    [3, "Si no, lo deshabilita antes de enviar."],
    [4, "Al terminar de mostrar la respuesta, lo vuelve a habilitar."],
  ];
  notas.forEach(([numero, texto], index) => {
    const y = 1.9 + index * 0.62;
    rect(slide, xd, y, wd, 0.54, C.white);
    circulo(slide, xd + 0.3, y + 0.27, 0.28, VERDE, numero, C.white, 9.4);
    addText(slide, texto, { x: xd + 0.56, y: y + 0.04, w: wd - 0.66, h: 0.46, fontSize: 10.6, color: C.ink, valign: "mid", lineSpacingMultiple: 1.05 });
  });
  addText(slide, "Un botón deshabilitado no responde al segundo clic, así que sale una sola solicitud.", {
    x: xd,
    y: 4.46,
    w: wd,
    h: 0.52,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  terminal(slide, {
    x: xd,
    y: 5.1,
    w: wd,
    title: "Doble clic, diez veces cada prueba",
    fontSize: 12,
    lines: [{ t: "20 passed (55.6s)", k: "ok" }],
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 55 · Un rojo que informa

function slideInformativeRed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la suite", "Así queda la suite al terminar la sesión", "", false);

  const wt = 7.2;
  terminal(slide, {
    x: M,
    y: 1.92,
    w: wt,
    title: "La suite de extremo a extremo",
    fontSize: 10.2,
    lines: [
      { t: "ok 1 un doble clic envía una sola solicitud de reserva", k: "ok" },
      { t: "ok 2 tras un doble clic, el mensaje dice lo que realmente pasó", k: "ok" },
      { t: "ok 3 tras reservar, el bloque 4 aparece tomado · espera una condición", k: "ok" },
      { t: "ok 4 una reserva completa se confirma en pantalla", k: "ok" },
      { t: "x  5 si falta un dato, la pantalla dice cuál corregir", k: "err" },
      { t: "", k: "plain" },
      { t: "1 failed", k: "err" },
      { t: "4 passed (17.0s)", k: "ok" },
    ],
  });
  terminal(slide, {
    x: M,
    y: 4.5,
    w: wt,
    title: "La suite de pytest, mientras tanto",
    fontSize: 11,
    lines: [{ t: "20 passed in 0.78s", k: "ok" }],
  });

  const xd = M + wt + 0.3;
  const wd = CW - wt - 0.3;
  addText(slide, "La que queda en rojo es la del [object Object]: nadie lo corrigió.", {
    x: xd,
    y: 1.92,
    w: wd,
    h: 0.6,
    fontSize: 12,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  [
    [VERDE, "Este rojo", "Aparece siempre, por la misma razón, y nombra un defecto conocido.", "Es evidencia"],
    [ROJO, "El de la espera fija", "Aparecía a veces, sin que nada cambiara, y no decía nada del sistema.", "Era ruido"],
  ].forEach(([color, titulo, glosa, veredicto], index) => {
    const y = 2.7 + index * 1.62;
    rect(slide, xd, y, wd, 1.48, C.white);
    rect(slide, xd, y, 0.06, 1.48, color);
    addText(slide, titulo, { x: xd + 0.26, y: y + 0.14, w: wd - 0.44, h: 0.28, fontSize: 12.4, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.26, y: y + 0.46, w: wd - 0.44, h: 0.6, fontSize: 10.8, color: C.slate, lineSpacingMultiple: 1.1 });
    addText(slide, veredicto, { x: xd + 0.26, y: y + 1.08, w: wd - 0.44, h: 0.28, fontSize: 12.4, bold: true, color });
  });

  addTakeaway(slide, "Un rojo que siempre aparece por la misma razón es evidencia. Uno que aparece a veces es ruido.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 56 · El umbral no se delega

function slideThresholdNotDelegated() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el agente", "El umbral no se delega", "", false);

  addKicker(slide, M, 1.92, "El agente del bloque 3 ya lo había reconocido", AZUL, 8);
  const dudas = ["El límite de personas", "El dígito verificador", "Qué muestra la confirmación", "El horario de los bloques"];
  const gap = 0.14;
  const w = (CW - gap * 3) / 4;
  dudas.forEach((duda, index) => {
    const x = M + index * (w + gap);
    rect(slide, x, 2.22, w, 0.56, C.softNeutral);
    rect(slide, x, 2.22, 0.06, 0.56, ORO);
    addText(slide, duda, { x: x + 0.2, y: 2.26, w: w - 0.3, h: 0.48, fontSize: 11.6, bold: true, color: C.ink, valign: "mid" });
  });
  addText(slide, "Las cuatro, en sus palabras: «una duda que alguien con el requisito debería resolver». Podía observar el sistema; no podía decidir qué debía hacer.", {
    x: M,
    y: 2.9,
    w: CW,
    h: 0.5,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  const piezas = [
    [VERDE, "Magnitud", "Un agente puede proponerla.", false],
    [VERDE, "Método", "Un agente puede proponerlo, y escribir la prueba con soltura.", false],
    [ROJO, "Umbral", "Una solicitud y no dos. Un mensaje que nombra el campo. Un límite que se muestra. Es una decisión sobre lo que el producto le debe a una persona, y no está en el código ni en la pantalla.", true],
  ];
  const y = 3.6;
  const h = 2.4;
  const wp = [3.1, 3.1, CW - 6.2 - 0.28];
  let x = M;
  piezas.forEach(([color, nombre, glosa, clave], index) => {
    rect(slide, x, y, wp[index], h, clave ? NAVY_CHIP : C.white);
    rect(slide, x, y, wp[index], 0.06, color);
    addText(slide, nombre, {
      x: x + 0.24,
      y: y + 0.22,
      w: wp[index] - 0.44,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color: clave ? C.white : C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: y + 0.72,
      w: wp[index] - 0.44,
      h: h - 0.84,
      fontSize: 13,
      color: clave ? C.sand : C.slate,
      lineSpacingMultiple: 1.14,
    });
    x += wp[index] + 0.14;
  });

  addTakeaway(slide, "Un agente escribe la prueba. Qué debe exigir esa prueba lo decide quien conoce el requisito.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 57 · Preguntas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar", [
    [
      "La prueba del criterio B pasó con el defecto presente y también pasa sin él. Un compañero dice que entonces está bien, porque nunca falla. ¿Qué le responderías?",
      "¿Qué información da una prueba que resulta igual con el defecto y sin él? Recuerda qué significa que una prueba detecte algo.",
    ],
    [
      "El criterio A mide la cantidad de solicitudes, algo que la persona nunca ve. ¿Cómo puede ser una prueba de capacidad de interacción si no mira la pantalla?",
      "Lee otra vez la definición de 3.4.4. ¿Se puede comprobar la prevención de un error por su causa, y qué ventaja tiene?",
    ],
    [
      "Al terminar, la suite de extremo a extremo tiene una prueba en rojo. ¿En qué se diferencia ese rojo del que producía la prueba con espera fija?",
      "Compara si cada uno aparece siempre o a veces, y si cada uno dice algo sobre el sistema o sobre la prueba.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 58 · Respuestas del bloque 4

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "Que no detecta nada",
      "Da el mismo resultado con el defecto y sin él: no distingue entre los dos.",
      "Una prueba vale por lo que puede contradecir, no por no fallar nunca.",
      "Leer un verde permanente como señal de calidad.",
    ],
    [
      "La comprueba por su causa",
      "Prevenir el error es una propiedad del producto: una sola solicitud ante un doble clic.",
      "Medir la causa da una medición estable, que no depende del instante.",
      "Creer que solo lo que se ve en pantalla cuenta como interacción.",
    ],
    [
      "Siempre, y por la misma razón",
      "El rojo final aparece siempre y nombra un defecto conocido; el de la espera fija aparecía a veces.",
      "Un rojo constante informa sobre el sistema; uno intermitente, sobre la prueba.",
      "Tratar todos los rojos como si significaran lo mismo.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 59 · Cierre: cuatro testigos

function slideFourWitnesses() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "Cuatro testigos, cuatro afirmaciones distintas", "", false, {
    titleFontSize: 28,
  });

  const wl = 2.9;
  const wc = (CW - wl - 0.28) / 2;
  const xA = M + wl + 0.14;
  const xB = xA + wc + 0.14;
  addKicker(slide, xA, 1.92, "Qué puede afirmar", VERDE, wc);
  addKicker(slide, xB, 1.92, "Qué no puede afirmar", ROJO, wc);
  const filas = [
    [AZUL, "Prueba unitaria", "Que una función decide bien con los datos que recibe.", "Que alguien la llame, ni que la llamen con los datos correctos."],
    [ORO, "Prueba de integración", "Que las piezas se entienden entre sí y el contrato se cumple.", "Qué ve una persona cuando el contrato se cumple."],
    [VERDE, "Prueba de extremo a extremo", "Que una persona puede completar la tarea por la pantalla.", "Lo que nadie pensó en escribir como caso."],
    [ROJO, "Exploración", "Lo que apareció cuando alguien se salió del camino previsto.", "Nada, hasta que se reproduce."],
  ];
  filas.forEach(([color, testigo, puede, noPuede], index) => {
    const y = 2.24 + index * 0.92;
    const ultima = index === 3;
    rect(slide, M, y, wl, 0.8, color);
    addText(slide, testigo, { x: M + 0.2, y: y + 0.08, w: wl - 0.3, h: 0.64, fontSize: 12.6, bold: true, color: C.white, valign: "mid" });
    rect(slide, xA, y, wc, 0.8, C.white);
    addText(slide, puede, { x: xA + 0.2, y: y + 0.08, w: wc - 0.4, h: 0.64, fontSize: 11.2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.08 });
    rect(slide, xB, y, wc, 0.8, ultima ? C.warm : C.white);
    addText(slide, noPuede, {
      x: xB + 0.2,
      y: y + 0.08,
      w: wc - 0.4,
      h: 0.64,
      fontSize: 11.2,
      bold: ultima,
      color: ultima ? ROJO : C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });

  addTakeaway(slide, "Una exploración produce hallazgos, no afirmaciones. Pasan a serlo cuando una prueba los reproduce.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 60 · La afirmacion que se puede sostener

function slideDefensibleClaim() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "Lo que hoy se puede sostener", "", false);

  const afirmaciones = [
    "Una persona puede completar la reserva por la pantalla, y hay una prueba con un navegador real que lo comprueba.",
    "Las pruebas esperan condiciones y no tiempos, y se comprobó ejecutándolas muchas veces con la red lenta.",
    "Se exploró con carta y registro, y cada hallazgo declarado como defecto se reprodujo.",
    "De lo encontrado, hay una prueba que hoy falla y dice exactamente qué falta corregir.",
  ];
  const wl = 7.4;
  afirmaciones.forEach((texto, index) => {
    const y = 1.92 + index * 0.98;
    rect(slide, M, y, wl, 0.86, C.white);
    rect(slide, M, y, 0.06, 0.86, VERDE);
    addText(slide, String(index + 1), {
      x: M + 0.22,
      y: y + 0.14,
      w: 0.4,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: VERDE,
      valign: "mid",
    });
    addText(slide, texto, { x: M + 0.74, y: y + 0.1, w: wl - 0.96, h: 0.66, fontSize: 11.8, color: C.ink, valign: "mid", lineSpacingMultiple: 1.1 });
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  rect(slide, xd, 1.92, wd, 3.8, NAVY_CHIP);
  addKicker(slide, xd + 0.3, 2.12, "Lo que sigue sin poder afirmarse", C.gold, wd - 0.6);
  addText(slide, "Cómo se comporta mientras lo hace.", {
    x: xd + 0.3,
    y: 2.46,
    w: wd - 0.6,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.08,
  });
  addText(slide, "Cada prueba de hoy comprueba qué hace el sistema. Ninguna dice cuánto aguanta con cien personas a la vez, a quién deja entrar, ni si lo puede usar alguien que no ve bien la pantalla.", {
    x: xd + 0.3,
    y: 3.52,
    w: wd - 0.6,
    h: 1.2,
    fontSize: 12,
    color: C.sand,
    lineSpacingMultiple: 1.14,
  });

  addTakeaway(slide, "A lo que se podía defender de cada función y cada colaboración, hoy se agrega una capa que habla de las personas.", {
    fontSize: 12.6,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 61 · Puente a la proxima sesion

function slideTomorrow() {
  const { slide } = createSlide("light");
  addHeader(slide, "Hoy · 11:00 · Clase 15 · Laboratorio de Redes", "Funciona, pero ¿cómo lo hace?", "", false);

  addText(
    slide,
    "Todas las pruebas del módulo hasta ahora son funcionales: comprueban qué hace el sistema. A las 11:00, las no funcionales: las que comprueban cómo lo hace.",
    { x: M, y: 1.9, w: CW, h: 0.56, fontSize: 12.6, color: C.slate, lineSpacingMultiple: 1.14 }
  );

  const preguntas = [
    ["¿Cuánto aguanta?", "Con muchas personas usándolo a la vez.", AZUL],
    ["¿A quién deja entrar?", "Y qué puede hacer alguien que no debería.", ROJO],
    ["¿Para quién sirve?", "Sin mouse, con poca visión, en otro navegador.", VERDE],
  ];
  const gap = 0.16;
  const w = (CW - gap * 2) / 3;
  preguntas.forEach(([titulo, glosa, color], index) => {
    const x = M + index * (w + gap);
    rect(slide, x, 2.66, w, 1.36, C.white);
    rect(slide, x, 2.66, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 2.86,
      w: w - 0.5,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color,
    });
    addText(slide, glosa, { x: x + 0.26, y: 3.36, w: w - 0.5, h: 0.5, fontSize: 11.6, color: C.slate, lineSpacingMultiple: 1.1 });
  });

  rect(slide, M, 4.28, CW, 1.64, NAVY_CHIP);
  addKicker(slide, M + 0.34, 4.46, "Llega con esta pregunta", C.gold, 6);
  addText(
    slide,
    "La prueba de hoy confirma que una persona puede completar la reserva. ¿Sigue siendo cierto si cien personas reservan al mismo tiempo?",
    { x: M + 0.34, y: 4.78, w: CW - 0.68, h: 1.0, fontSize: 15, bold: true, color: C.white, lineSpacingMultiple: 1.16 }
  );

  addTakeaway(slide, "Hoy se probó qué hace el sistema. A las 11:00, cómo lo hace.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 62 · Mensaje final

function slideFinalMessage() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 0.9, "Mensaje final", C.gold, 5);

  const instantes = [
    "La API respondió el campo exacto, y la pantalla mostró [object Object].",
    "La espera fija pasaba diez de diez en una máquina, y fallaba en otra.",
    "El agente afirmó con seguridad un comportamiento que el sistema no tiene.",
    "La prueba del mensaje pasó leyendo una confirmación que duró un instante.",
  ];
  const w = (CW - 0.14 * 3) / 4;
  instantes.forEach((texto, index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 1.3, w, 0.9, NAVY_CHIP);
    rect(slide, x, 1.3, w, 0.05, C.gold);
    addText(slide, texto, { x: x + 0.18, y: 1.4, w: w - 0.32, h: 0.74, fontSize: 10.6, color: C.sand, lineSpacingMultiple: 1.1 });
  });
  addText(slide, "En todos los casos, lo que se veía en un instante no era lo que ocurría.", {
    x: M,
    y: 2.4,
    w: CW,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: C.gold,
  });

  rule(slide, M, 3.18, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Una persona no lee el contrato de un sistema: lee lo que la pantalla le muestra, en el momento en que se lo muestra. Probar desde ese lugar exige esperar lo que todavía no llega, desconfiar de lo que se vio una sola vez, y convertir cada «confunde» en algo que una prueba pueda contradecir.",
    { x: M, y: 3.4, w: CW, h: 1.7, fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: C.white, lineSpacingMultiple: 1.18 }
  );
  addText(
    slide,
    "Un agente recorre la pantalla más rápido que cualquiera. Decidir qué le debe el sistema a quien la usa sigue siendo trabajo de quien firma.",
    { x: M, y: 5.3, w: CW, h: 0.8, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.18 }
  );
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Orden del deck.

slideCover();
slideVocabulary();
slideOpening();
slideTwoReaders();
slideMap();

slideBlockOneDivider();
slideTheInterface();
slideAppJs();
slideTestAnatomy();
slideStrictMode();
slideTheDefect();
slideApiDidItsJob();
slideLevels();
slideAgentAssertions();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideAsync();
slideFixedWait();
slideTestConditions();
slideRepeatEach();
slideFlaky();
slideWaitCondition();
slideLongerWait();
slideAutoWait();
slideFlakyEvidence();
slideAgentFlaky();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideOutsideTheList();
slideExploratoryDefinition();
slideSessionBased();
slideTechniqueOrPractice();
slideCharterSession();
slideDoubleClick();
slideWhoIsLooking();
slideAgentExplorer();
slideAgentFindings();
slideReproduce();
slideVerdicts();
slideWitnessNotJudge();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideConfunde();
slideInteractionCapability();
slideSubcharacteristics();
slideTwoCriteria();
slideTestA();
slideTestBResult();
slideWhatBSaw();
slideStableMeasure();
slideTheFix();
slideInformativeRed();
slideThresholdNotDelegated();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideFourWitnesses();
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
