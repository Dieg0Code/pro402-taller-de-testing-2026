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
  subject: "PRO402 · Clase 16",
  title: "Lo que nadie ejecuta no existe",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-16-Lo-Que-Nadie-Ejecuta-No-Existe.pptx");

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
  ["Ejecutar", "Que la suite corra sola"],
  ["Decidir", "Qué hacer con los rojos conocidos"],
  ["Estabilizar", "La prueba que pasa y falla"],
  ["Proteger", "Que un rojo no se integre"],
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
// Capturas reales del repositorio de GitHub, tomadas sin sesión iniciada.

const CAPTURAS = {
  ejecucion1: [path.resolve(__dirname, "assets/gh-ejecucion-1-version-inexistente.png"), 2740, 1380],
  ejecucion2: [path.resolve(__dirname, "assets/gh-ejecucion-2-tres-rojos.png"), 2740, 950],
  ejecucion3: [path.resolve(__dirname, "assets/gh-ejecucion-3-pasos-ruff.png"), 2740, 1260],
  ejecucion4: [path.resolve(__dirname, "assets/gh-ejecucion-4-estaticos-verdes.png"), 2740, 950],
  historialMain: [path.resolve(__dirname, "assets/gh-historial-main.png"), 2032, 1694],
  historialInestable: [path.resolve(__dirname, "assets/gh-historial-inestable.png"), 2032, 1382],
  historialAuditoria: [path.resolve(__dirname, "assets/gh-historial-auditoria.png"), 2032, 1226],
  pr3Defecto: [path.resolve(__dirname, "assets/gh-pr3-defecto-limite.png"), 2740, 950],
  pr4Verde: [path.resolve(__dirname, "assets/gh-pr4-verde-con-defecto.png"), 2740, 950],
  pr4Rojo: [path.resolve(__dirname, "assets/gh-pr4-reabierto-rojo.png"), 2740, 950],
  ejecucion2Recorte: [path.resolve(__dirname, "assets/gh-ejecucion-2-tres-rojos-recorte.png"), 1320, 800],
  ejecucion3Recorte: [path.resolve(__dirname, "assets/gh-ejecucion-3-pasos-ruff-recorte.png"), 1500, 1260],
  ejecucion4Recorte: [path.resolve(__dirname, "assets/gh-ejecucion-4-estaticos-verdes-recorte.png"), 1320, 800],
  pr3Recorte: [path.resolve(__dirname, "assets/gh-pr3-defecto-limite-recorte.png"), 1320, 800],
  pr4VerdeRecorte: [path.resolve(__dirname, "assets/gh-pr4-verde-con-defecto-recorte.png"), 1320, 800],
  pr4RojoRecorte: [path.resolve(__dirname, "assets/gh-pr4-reabierto-rojo-recorte.png"), 1320, 800],
};

// Una captura con borde fino y pie. Se dimensiona por el ancho o por el alto disponible.
function captura(slide, clave, opts) {
  const [ruta, ancho, alto] = CAPTURAS[clave];
  let w = opts.w;
  let h = (w * alto) / ancho;
  if (opts.hMax && h > opts.hMax) {
    h = opts.hMax;
    w = (h * ancho) / alto;
  }
  const x = opts.centrar ? opts.x + (opts.w - w) / 2 : opts.x;
  rect(slide, x - 0.02, opts.y - 0.02, w + 0.04, h + 0.04, C.border);
  slide.addImage({ path: ruta, x, y: opts.y, w, h });
  if (opts.pie) {
    addText(slide, opts.pie, { x, y: opts.y + h + 0.06, w: Math.max(w, 3), h: 0.22, fontSize: 9, italic: true, color: C.slate });
  }
  return { x, w, h };
}

// Firma visual de la clase: el estado del pipeline, trabajo por trabajo.
const ESTADO = {
  ok: [VERDE, "✓"],
  fail: [ROJO, "✗"],
  skip: [C.slate, "–"],
};

function tiraEstado(slide, opts) {
  const trabajos = opts.trabajos;
  const fila = opts.fila ?? 0.42;
  const cabecera = opts.titulo ? 0.4 : 0;
  const h = cabecera + trabajos.length * fila + 0.16;
  rect(slide, opts.x, opts.y, opts.w, h, opts.fondo ?? C.white, C.border);
  if (opts.titulo) {
    addText(slide, opts.titulo, { x: opts.x + 0.2, y: opts.y + 0.1, w: opts.w - 0.4, h: 0.24, fontSize: 9.6, bold: true, color: C.slate, charSpacing: 0.8 });
  }
  trabajos.forEach(([nombre, estado, detalle], index) => {
    const y = opts.y + cabecera + 0.08 + index * fila;
    const [color, signo] = ESTADO[estado];
    circulo(slide, opts.x + 0.34, y + fila / 2, 0.26, color, signo, C.white, 10);
    addText(slide, nombre, { x: opts.x + 0.6, y: y + 0.04, w: opts.w - 0.8, h: fila - 0.08, fontSize: opts.fontSize ?? 11.4, bold: true, color: opts.colorTexto ?? C.ink, valign: "mid" });
    if (detalle) {
      addText(slide, detalle, {
        x: opts.x + opts.w * 0.5,
        y: y + 0.04,
        w: opts.w * 0.5 - 0.2,
        h: fila - 0.08,
        fontFace: TYPOGRAPHY.mono,
        fontSize: opts.fontDetalle ?? 9.4,
        color: color === C.slate ? C.slate : color,
        align: "right",
        valign: "mid",
      });
    }
  });
  return h;
}

// ---------------------------------------------------------------------------
// 01 · Portada

function slideCover() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.42, "PRO402 · Clase 16 · Unidad 2", C.gold, 6);
  addText(slide, "Lo que nadie ejecuta no existe", {
    x: M,
    y: 1.84,
    w: 11.4,
    h: 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.12, 4.2, C.red, 3);
  addText(slide, "Pruebas de regresión, integración continua con GitHub Actions y la prueba inestable", {
    x: M,
    y: 3.4,
    w: 11.4,
    h: 0.46,
    fontSize: 18,
    color: C.softBlue,
  });
  tiraEstado(slide, {
    x: M,
    y: 4.1,
    w: 5.6,
    fondo: NAVY_CHIP,
    trabajos: [
      ["Controles estáticos", "ok"],
      ["Pruebas de Python", "ok"],
      ["Pruebas de extremo a extremo", "fail"],
    ],
    fila: 0.36,
    fontSize: 10.4,
    colorTexto: C.white,
  });
  addText(slide, "Toda la suite, ante cada cambio, sin que nadie se acuerde de ejecutarla.", {
    x: M + 5.9,
    y: 4.22,
    w: CW - 5.9,
    h: 0.9,
    fontSize: 14,
    color: C.sand,
    lineSpacingMultiple: 1.2,
  });
  rule(slide, M, 5.46, CW, NAVY_RULE, 1);
  addText(slide, "Martes 29 de septiembre de 2026 · 11:00 – 13:15 · Laboratorio de Redes", {
    x: M,
    y: 5.66,
    w: 7.2,
    h: 0.3,
    fontSize: 12.6,
    color: C.sand,
  });
  addText(slide, "Diego Obando · AIEP Osorno", { x: 8.2, y: 5.66, w: 4.4, h: 0.3, fontSize: 12.6, color: C.sand, align: "right" });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 02 · Vocabulario

function slideVocabulary() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida", "Las palabras de GitHub que usa la sesión", "", false, { titleFontSize: 28 });

  const terminos = [
    ["Repositorio", "La carpeta de un proyecto con todo su historial de cambios, guardada en GitHub.", AZUL],
    ["Commit y push", "Un commit es un cambio registrado en el historial; hacer push es subirlo a GitHub.", VERDE],
    ["Rama y main", "Una rama es una línea de trabajo paralela. La principal, main, es la versión que se considera buena.", ORO],
    ["Pull request", "La solicitud de integrar una rama a main. GitHub muestra lo que cambió y el resultado de las pruebas.", ROJO],
    ["Integración continua", "Ejecutar las pruebas automáticamente ante cada cambio, en un servidor.", AZUL],
    ["Pipeline", "La secuencia de pasos de esa ejecución: instalar, revisar, probar. GitHub Actions la ejecuta.", VERDE],
  ];
  const gap = 0.18;
  const w = (CW - gap * 2) / 3;
  const h = 1.72;
  terminos.forEach(([termino, def, color], index) => {
    const x = M + (index % 3) * (w + gap);
    const y = 1.86 + Math.floor(index / 3) * (h + 0.16);
    rect(slide, x, y, w, h, C.white);
    rect(slide, x, y, 0.07, h, color);
    addText(slide, termino, { x: x + 0.28, y: y + 0.14, w: w - 0.44, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 18, bold: true, color });
    addText(slide, def, { x: x + 0.28, y: y + 0.6, w: w - 0.44, h: 1.0, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "Hasta hoy, la suite corría cuando alguien se acordaba. Desde hoy, corre sola.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · Para abrir: la correccion que rompio otra cosa

function slideOpening() {
  const { slide } = createSlide("light");
  addHeader(slide, "Para abrir · lo que pasó el lunes", "Una corrección que rompió otra cosa", "", false);

  const pasos = [
    ["Lunes, 08:30", "El doble clic en «Reservar» enviaba dos reservas.", ROJO],
    ["La corrección", "Deshabilitar el botón al enviar y habilitarlo al final.", AZUL],
    ["Las pruebas del doble clic", "Pasan. El defecto está corregido.", VERDE],
    ["Lunes, 11:00", "Si la red falla, el código se corta antes de habilitar el botón: queda bloqueado para siempre.", ROJO],
  ];
  const w = (CW - 0.3 * 3) / 4;
  pasos.forEach(([cuando, que, color], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 1.96, w, 2.1, index === 3 ? C.warm : C.white);
    rect(slide, x, 1.96, w, 0.06, color);
    circulo(slide, x + 0.36, 2.38, 0.4, color, String(index + 1), C.white, 12);
    addText(slide, cuando, { x: x + 0.66, y: 2.2, w: w - 0.8, h: 0.36, fontSize: 12, bold: true, color: C.ink, valign: "mid" });
    addText(slide, que, { x: x + 0.22, y: 2.72, w: w - 0.44, h: 1.26, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.1 });
    if (index < 3) arrow(slide, x + w + 0.04, 3.0, 0.22, C.slate);
  });

  rect(slide, M, 4.32, CW, 1.56, NAVY_CHIP);
  addKicker(slide, M + 0.34, 4.5, "Por qué nadie lo vio", C.gold, 6);
  addText(slide, "Ninguna prueba cortaba la red. Las del doble clic comprobaron lo que la corrección quería arreglar, y nadie volvió a mirar el resto.", {
    x: M + 0.34,
    y: 4.8,
    w: CW - 0.68,
    h: 0.96,
    fontSize: 15,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.14,
  });

  addTakeaway(slide, "Corregir un defecto puede crear otro, lejos del lugar donde se corrigió.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Confirmacion y regresion

function slideConfirmationRegression() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida · la fuente", "Confirmar la corrección no basta", "", false);

  addQuote(
    slide,
    M,
    1.88,
    CW,
    1.5,
    "La prueba de confirmación confirma que un defecto original fue corregido con éxito. […] La prueba de regresión confirma que un cambio no causó consecuencias adversas, incluso una corrección que ya pasó su prueba de confirmación. Esas consecuencias pueden afectar al mismo componente, a otros componentes del mismo sistema o incluso a otros sistemas conectados.",
    "ISTQB CTFL v4.0.1, sección 2.2.3 · traducción del original en inglés",
    AZUL
  );

  const w = (CW - 0.4) / 2;
  const tarjetas = [
    [M, "Confirmación", "¿Se corrigió el defecto?", "Las pruebas del doble clic: sí, ya no envía dos reservas.", VERDE, C.white],
    [M + w + 0.4, "Regresión", "¿El cambio rompió algo más?", "Nadie lo preguntó: la red cortada dejaba el botón bloqueado.", ROJO, C.warm],
  ];
  tarjetas.forEach(([x, rotulo, pregunta, ejemplo, color, fondo]) => {
    rect(slide, x, 3.6, w, 2.3, fondo);
    rect(slide, x, 3.6, w, 0.06, color);
    addKicker(slide, x + 0.3, 3.8, rotulo, color, w - 0.6);
    addText(slide, pregunta, { x: x + 0.3, y: 4.1, w: w - 0.6, h: 0.6, fontFace: TYPOGRAPHY.display, fontSize: 21, bold: true, color: C.ink });
    addText(slide, ejemplo, { x: x + 0.3, y: 4.86, w: w - 0.6, h: 0.9, fontSize: 12.2, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "Una regresión puede aparecer en cualquier parte: se busca ejecutando todas las pruebas, siempre.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · Por que automatizar

function slideWhyAutomate() {
  const { slide } = createSlide("light");
  addHeader(slide, "Punto de partida · el problema práctico", "Nadie ejecuta todo, cada vez", "", false);

  const cifras = [
    ["25", "pruebas de Python"],
    ["27", "ejecuciones de extremo a extremo: 9 pruebas en 3 navegadores"],
    ["2 min", "lo que tarda todo junto en un servidor"],
  ];
  const w = (CW - 0.4) / 3;
  cifras.forEach(([numero, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 1.9, w, 1.5, C.white);
    rect(slide, x, 1.9, w, 0.06, AZUL);
    addText(slide, numero, { x: x + 0.28, y: 2.04, w: w - 0.5, h: 0.72, fontFace: TYPOGRAPHY.display, fontSize: 34, bold: true, color: AZUL });
    addText(slide, glosa, { x: x + 0.28, y: 2.8, w: w - 0.5, h: 0.52, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.05 });
  });

  addQuote(
    slide,
    M,
    3.66,
    CW,
    1.36,
    "Las suites de regresión se ejecutan muchas veces, y en general crecen con cada iteración, así que la prueba de regresión es una fuerte candidata a la automatización. […] Donde se usa integración continua, es una buena práctica incluir también pruebas de regresión automatizadas.",
    "ISTQB CTFL v4.0.1, sección 2.2.3 · traducción del original en inglés",
    AZUL
  );
  addText(slide, "Las cifras son las del proyecto de reserva de laboratorio al empezar la sesión.", {
    x: M,
    y: 5.16,
    w: CW,
    h: 0.24,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Lo que depende de que alguien se acuerde deja de ocurrir justo cuando más importa.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · Mapa

function slideMap() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la sesión", "135 minutos, de 11:00 a 13:15", "", false);

  const tramos = [
    ["Encuadre", 10, C.slate, ""],
    ["Ejecutar", 30, C.red, "El pipeline: un flujo de GitHub Actions y cómo se lee"],
    ["Decidir", 30, ORO, "El verde honesto: los rojos conocidos, a la vista"],
    ["Pausa", 10, C.border, ""],
    ["Estabilizar", 20, AZUL, "La prueba que pasa y falla"],
    ["Proteger", 20, VERDE, "Un defecto a propósito, y la rama protegida"],
    ["Cierre", 15, C.slate, ""],
  ];
  const escala = CW / 135;
  let x = M;
  let minuto = 0;
  tramos.forEach(([nombre, minutos, color, glosa]) => {
    const w = minutos * escala;
    const bloque = glosa !== "";
    rect(slide, x, 2.3, w - 0.04, bloque ? 0.62 : 0.34, color);
    if (bloque) {
      addText(slide, nombre.toUpperCase(), { x: x + 0.12, y: 2.42, w: w - 0.26, h: 0.24, fontSize: 11, bold: true, color: C.white, charSpacing: 0.8 });
      addText(slide, `${minutos} min`, { x: x + 0.12, y: 2.66, w: w - 0.26, h: 0.2, fontSize: 9.4, color: C.white });
      rule(slide, x + 0.12, 3.1, w - 0.28, color, 1.6);
      addText(slide, glosa, { x: x + 0.12, y: 3.2, w: w - 0.26, h: 0.8, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.1 });
    } else {
      addText(slide, `${nombre} · ${minutos}`, { x, y: 2.72, w: Math.max(w, 0.95), h: 0.2, fontSize: 8.4, color: C.slate });
    }
    const hora = 11 * 60 + minuto;
    addText(slide, `${Math.floor(hora / 60)}:${String(hora % 60).padStart(2, "0")}`, { x: x - 0.02, y: 2.02, w: 0.42, h: 0.2, fontFace: TYPOGRAPHY.mono, fontSize: 8.6, color: C.slate });
    x += w;
    minuto += minutos;
  });
  addText(slide, "13:15", { x: M + CW - 0.46, y: 2.02, w: 0.5, h: 0.2, fontFace: TYPOGRAPHY.mono, fontSize: 8.6, color: C.slate, align: "right" });

  rect(slide, M, 4.3, CW, 1.52, C.warm);
  rect(slide, M, 4.3, 0.06, 1.52, ROJO);
  addKicker(slide, M + 0.32, 4.48, "El proyecto de la clase es público; cada uno trabaja en el suyo", ROJO, 10);
  addText(
    slide,
    "Las ejecuciones que se muestran son reales y se pueden ver en github.com/Dieg0Code/reserva-laboratorio-pro402. En el bloque 4, un agente introduce un defecto a propósito: siempre en tu propio repositorio, en una rama propia y en un pull request que nadie integra.",
    { x: M + 0.32, y: 4.76, w: CW - 0.64, h: 0.98, fontSize: 12.2, color: C.ink, lineSpacingMultiple: 1.14 }
  );

  addTakeaway(slide, "Ejecutar, decidir, estabilizar y proteger.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · Divisor del bloque 1

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "El pipeline", { x: M, y: 1.98, w: 10.7, h: 1.5, fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color: C.white });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Un flujo de GitHub Actions escrito línea por línea, cuatro ejecuciones reales en rojo, y una pregunta para cada una: ¿quién falló, el sistema, el proyecto o el propio pipeline?",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 1, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · Que es GitHub Actions

function slideWhatIsActions() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · GitHub Actions", "Una máquina nueva, vacía, en cada ejecución", "", false, { titleFontSize: 28 });

  const pasos = [
    ["push", "Alguien sube un cambio", AZUL],
    ["máquina nueva", "GitHub crea una máquina virtual vacía para cada trabajo", ORO],
    ["instala", "Solo lo que el repositorio declara: Python, dependencias, navegadores", ORO],
    ["ejecuta", "Los mismos comandos que en la terminal", AZUL],
    ["✓ o ✗", "El resultado queda en el repositorio, junto al commit", VERDE],
  ];
  const w = (CW - 0.24 * 4) / 5;
  pasos.forEach(([titulo, glosa, color], index) => {
    const x = M + index * (w + 0.24);
    rect(slide, x, 1.94, w, 1.72, C.white);
    rect(slide, x, 1.94, w, 0.06, color);
    addText(slide, titulo, { x: x + 0.18, y: 2.1, w: w - 0.36, h: 0.4, fontFace: TYPOGRAPHY.mono, fontSize: 14, bold: true, color });
    addText(slide, glosa, { x: x + 0.18, y: 2.56, w: w - 0.36, h: 1.02, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.06 });
    if (index < 4) arrow(slide, x + w + 0.02, 2.8, 0.2, C.slate);
  });

  addQuote(
    slide,
    M,
    3.9,
    7.3,
    1.3,
    "Un flujo de trabajo es un proceso automatizado y configurable, compuesto por uno o más trabajos. Hay que crear un archivo YAML para definir su configuración.",
    "GitHub Docs, Workflow syntax · traducción del original en inglés",
    AZUL
  );
  const xd = M + 7.6;
  const wd = CW - 7.6;
  rect(slide, xd, 3.9, wd, 1.3, NAVY_CHIP);
  addText(slide, "YAML: texto de configuración donde la sangría —los espacios al inicio de cada línea— indica qué va dentro de qué. El archivo vive en .github/workflows/.", {
    x: xd + 0.24,
    y: 3.98,
    w: wd - 0.44,
    h: 1.14,
    fontSize: 10.8,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.08,
  });
  addText(slide, "Gratis en repositorios públicos; un repositorio privado gratuito incluye 2.000 minutos al mes.", {
    x: M,
    y: 5.34,
    w: CW,
    h: 0.24,
    fontSize: 10,
    italic: true,
    color: C.slate,
  });

  addTakeaway(slide, "Lo que funciona solo porque está instalado en tu máquina, ahí no funciona.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · El archivo, primera parte

function slideWorkflowPartOne() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el archivo", "Cuándo corre y qué hace el primer trabajo", "", false, { titleFontSize: 28 });

  const wl = 6.4;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "yaml",
    fontSize: 10,
    title: ".github/workflows/pruebas.yml · primera versión",
    marcas: [
      { linea: 3, color: C.gold, numero: 1 },
      { linea: 8, color: C.gold, numero: 2 },
      { linea: 10, color: C.gold, numero: 3 },
      { linea: 12, color: C.gold, numero: 4 },
      { linea: 14, color: VERDE, numero: 5 },
    ],
    code: [
      "name: Pruebas",
      "",
      "on:",
      "  push:",
      "  pull_request:",
      "",
      "jobs:",
      "  estaticos:",
      "    name: Controles estáticos",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v7",
      "      - uses: astral-sh/setup-uv@v10.2.0",
      "      - run: uv sync --locked",
      "      - run: uv run ruff check .",
      "      - run: uv run pyrefly check",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const notas = [
    [1, "on:", "Cuándo corre: ante cada push y cada pull request. Sin esto, nunca corre solo."],
    [2, "jobs:", "Los trabajos. estaticos es el nombre interno; name: el que se muestra."],
    [3, "runs-on:", "La máquina: la versión más reciente de Ubuntu, un Linux que ofrece GitHub."],
    [4, "uses:", "Usa una acción ya escrita. checkout descarga el repositorio; setup-uv instala uv, la herramienta que instala Python y las dependencias."],
    [5, "run:", "Un comando, igual que en la terminal. --locked instala las versiones exactas de uv.lock, el archivo que las fija."],
  ];
  notas.forEach(([numero, pieza, glosa], index) => {
    const y = 1.84 + index * 0.84;
    rect(slide, xd, y, wd, 0.76, C.white);
    circulo(slide, xd + 0.3, y + 0.38, 0.28, numero === 5 ? VERDE : C.gold, numero, numero === 5 ? C.white : C.navy, 9.4);
    addText(slide, pieza, { x: xd + 0.56, y: y + 0.08, w: 1.2, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.56, y: y + 0.34, w: wd - 0.7, h: 0.4, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.02 });
  });
  addText(slide, "Los controles estáticos revisan el código sin ejecutarlo: ruff busca errores comunes y de estilo; pyrefly comprueba los tipos de datos.", {
    x: xd,
    y: 6.08,
    w: wd,
    h: 0.5,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · El archivo, segunda parte

function slideWorkflowPartTwo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el archivo", "Los otros dos trabajos: las dos suites", "", false, { titleFontSize: 28 });

  const wl = 6.4;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "yaml",
    fontSize: 8.6,
    title: ".github/workflows/pruebas.yml · continuación",
    marcas: [
      { linea: 8, color: VERDE, numero: 1 },
      { linea: 16, color: C.gold, numero: 2 },
      { linea: 20, color: C.gold, numero: 3 },
      { linea: 22, color: C.gold, numero: 4 },
    ],
    code: [
      "  pytest:",
      "    name: Pruebas de Python",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v7",
      "      - uses: astral-sh/setup-uv@v10.2.0",
      "      - run: uv sync --locked",
      "      - run: uv run pytest -q",
      "",
      "  extremo-a-extremo:",
      "    name: Pruebas de extremo a extremo",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v7",
      "      - uses: astral-sh/setup-uv@v10.2.0",
      "      - uses: actions/setup-node@v7",
      "        with:",
      "          node-version: 22",
      "      - run: uv sync --locked",
      "      - run: npm ci",
      "        working-directory: e2e",
      "      - run: npx playwright install --with-deps",
      "        working-directory: e2e",
      "      - run: npx playwright test",
      "        working-directory: e2e",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const notas = [
    [1, VERDE, "uv run pytest -q", "Ejecuta las pruebas de Python; -q pide una salida resumida."],
    [2, C.gold, "setup-node y with:", "Instala Node.js 22, el entorno que ejecuta JavaScript y que Playwright necesita. with: le entrega parámetros a la acción."],
    [3, C.gold, "npm ci", "Instala las dependencias de e2e con las versiones exactas de package-lock.json, el equivalente de uv.lock en JavaScript."],
    [4, C.gold, "playwright install --with-deps", "Descarga los tres navegadores y lo que necesitan para funcionar en Linux."],
  ];
  notas.forEach(([numero, color, pieza, glosa], index) => {
    const y = 1.84 + index * 1.0;
    rect(slide, xd, y, wd, 0.9, C.white);
    circulo(slide, xd + 0.3, y + 0.3, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, pieza, { x: xd + 0.56, y: y + 0.1, w: wd - 0.7, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 10.4, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.56, y: y + 0.4, w: wd - 0.7, h: 0.46, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.02 });
  });
  addText(slide, "working-directory: e2e ejecuta el comando dentro de la carpeta de las pruebas de Playwright. Cada trabajo repite checkout e instalación porque corre en su propia máquina.", {
    x: xd,
    y: 5.94,
    w: wd,
    h: 0.66,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · Tres decisiones

function slideThreeDecisions() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · tres decisiones del archivo", "Por qué está escrito así", "", false);

  const w = (CW - 0.4) / 3;
  const x1 = M;
  const x2 = M + w + 0.2;
  const x3 = M + 2 * (w + 0.2);

  rect(slide, x1, 1.9, w, 3.96, C.white);
  rect(slide, x1, 1.9, w, 0.06, AZUL);
  addText(slide, "¿Por qué tres trabajos?", { x: x1 + 0.24, y: 2.06, w: w - 0.44, h: 0.36, fontSize: 14, bold: true, color: AZUL });
  ["Controles estáticos", "Pruebas de Python", "Extremo a extremo"].forEach((nombre, index) => {
    const y = 2.56 + index * 0.44;
    rect(slide, x1 + 0.24, y, w - 0.48, 0.36, C.softNeutral);
    addText(slide, nombre, { x: x1 + 0.36, y: y + 0.04, w: w - 0.7, h: 0.28, fontSize: 10.4, bold: true, color: C.ink, valign: "mid" });
  });
  addText(slide, "Corren en paralelo y fallan por separado: si ruff encuentra algo, las pruebas se ejecutan igual. En un solo trabajo, el primer paso que falla detiene todos los demás.", {
    x: x1 + 0.24,
    y: 3.96,
    w: w - 0.44,
    h: 1.8,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  rect(slide, x2, 1.9, w, 3.96, C.white);
  rect(slide, x2, 1.9, w, 0.06, VERDE);
  addText(slide, "¿Por qué --locked y npm ci?", { x: x2 + 0.24, y: 2.06, w: w - 0.44, h: 0.36, fontSize: 14, bold: true, color: VERDE });
  [
    ["En tu máquina", "uv sync · npm install", "actualizan si pueden"],
    ["En el pipeline", "uv sync --locked · npm ci", "versiones exactas"],
  ].forEach(([donde, comando, efecto], index) => {
    const y = 2.56 + index * 0.84;
    rect(slide, x2 + 0.24, y, w - 0.48, 0.74, index === 1 ? C.warm : C.softNeutral);
    addText(slide, donde, { x: x2 + 0.36, y: y + 0.06, w: w - 0.7, h: 0.22, fontSize: 9.6, bold: true, color: C.slate });
    addText(slide, comando, { x: x2 + 0.36, y: y + 0.28, w: w - 0.7, h: 0.22, fontFace: TYPOGRAPHY.mono, fontSize: 9.6, bold: true, color: C.ink });
    addText(slide, efecto, { x: x2 + 0.36, y: y + 0.5, w: w - 0.7, h: 0.2, fontSize: 9.4, italic: true, color: C.slate });
  });
  addText(slide, "Una prueba que pasa con una versión y falla con otra no informa nada del sistema: informa una diferencia de entornos.", {
    x: x2 + 0.24,
    y: 4.34,
    w: w - 0.44,
    h: 1.4,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  rect(slide, x3, 1.9, w, 3.96, C.warm);
  rect(slide, x3, 1.9, w, 0.06, ROJO);
  addText(slide, "¿Por qué v10.2.0 y no v10?", { x: x3 + 0.24, y: 2.06, w: w - 0.44, h: 0.36, fontSize: 14, bold: true, color: ROJO });
  rect(slide, x3 + 0.24, 2.56, w - 0.48, 0.8, C.editorBg);
  addText(slide, "actions/checkout@v7\nastral-sh/setup-uv@v10.2.0", {
    x: x3 + 0.36,
    y: 2.62,
    w: w - 0.72,
    h: 0.68,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10,
    color: C.gold,
    valign: "mid",
  });
  addText(slide, "Las otras dos acciones aceptan la versión corta. Esta no. La respuesta la dio la primera ejecución.", {
    x: x3 + 0.24,
    y: 3.54,
    w: w - 0.44,
    h: 1.4,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(slide, "La configuración del pipeline es código del proyecto: se versiona, se revisa y puede tener defectos.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · Quien fallo

function slideWhoFailed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · cómo se lee un rojo", "Antes de corregir: ¿quién falló?", "", false);

  const w = (CW - 0.4) / 3;
  const quienes = [
    ["El sistema", "La aplicación no hace lo que debe. Se corrige el código de la aplicación.", "Una prueba de la suite falla.", ROJO],
    ["El proyecto", "Falta algo que el proyecto debía declarar para que cualquiera pueda ejecutarlo.", "Una herramienta no está instalada; un archivo no está en el repositorio.", ORO],
    ["El pipeline", "El archivo de configuración tiene un error.", "Un trabajo falla antes de ejecutar un solo comando.", AZUL],
  ];
  quienes.forEach(([quien, que, senal, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 1.94, w, 3.7, C.white);
    rect(slide, x, 1.94, w, 0.08, color);
    addText(slide, quien, { x: x + 0.28, y: 2.16, w: w - 0.5, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 22, bold: true, color });
    addText(slide, que, { x: x + 0.28, y: 2.8, w: w - 0.5, h: 1.1, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.1 });
    addKicker(slide, x + 0.28, 4.08, "Cómo se reconoce", C.slate, w - 0.5);
    addText(slide, senal, { x: x + 0.28, y: 4.38, w: w - 0.5, h: 1.1, fontSize: 11, italic: true, color: C.slate, lineSpacingMultiple: 1.08 });
  });

  addTakeaway(slide, "Cada respuesta se corrige en un lugar distinto. Corregir sin clasificar es adivinar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · Primera ejecucion

function slideRunOne() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · ejecución 1", "8 segundos, y ningún comando ejecutado", "", false, { titleFontSize: 28 });

  const img = captura(slide, "ejecucion1", { x: M, y: 1.86, w: 7.4, pie: "Captura de la ejecución en GitHub. La anotación de abajo dice por qué falló." });

  const xd = M + 7.7;
  const wd = CW - 7.7;
  terminal(slide, {
    x: xd,
    y: 1.86,
    w: wd,
    title: "La anotación",
    fontSize: 8.8,
    lines: [
      { t: "Unable to resolve action", k: "err" },
      { t: "`astral-sh/setup-uv@v10`,", k: "err" },
      { t: "unable to find version `v10`", k: "err" },
    ],
  });
  addText(slide, "No se encontró la versión v10. checkout y setup-node publican una etiqueta corta, como v7, que apunta a la última de su serie; setup-uv solo publica versiones completas.", {
    x: xd,
    y: 3.14,
    w: wd,
    h: 1.2,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  rect(slide, xd, 4.46, wd, 1.0, AZUL);
  addText(slide, "QUIÉN FALLÓ", { x: xd + 0.24, y: 4.54, w: wd - 0.4, h: 0.22, fontSize: 9, bold: true, color: C.gold, charSpacing: 1 });
  addText(slide, "El pipeline. Corrección: astral-sh/setup-uv@v10.2.0.", { x: xd + 0.24, y: 4.78, w: wd - 0.4, h: 0.6, fontSize: 12, bold: true, color: C.white, lineSpacingMultiple: 1.04 });

  addTakeaway(slide, "Este rojo no dice nada del sistema de reservas.", { y: Math.max(6.2, 1.86 + img.h + 0.4) });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · Segunda ejecucion

function slideRunTwo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · ejecución 2", "Tres trabajos en rojo, tres motivos", "", false);

  captura(slide, "ejecucion2Recorte", { x: M, y: 1.84, w: 5.6, pie: "Los tres trabajos llegaron a ejecutar sus comandos." });

  const xd = M + 5.9;
  const wd = CW - 5.9;
  const rojos = [
    ["Controles estáticos", "error: Failed to spawn: `ruff`", "El proyecto", "Nunca declaró ruff ni pyrefly como dependencias.", ORO],
    ["Pruebas de Python", "1 failed, 24 passed", "El sistema", "La suplantación: otra persona gasta la cuota de Ana —tres reservas por semana— con el RUT de ella.", ROJO],
    ["Extremo a extremo", "6 failed, 21 passed", "El sistema", "Si falta un dato, la pantalla muestra [object Object] en vez de decir cuál; y la página no cabe en 320 píxeles. En los tres navegadores.", ROJO],
  ];
  rojos.forEach(([trabajo, salida, quien, glosa, color], index) => {
    const y = 1.84 + index * 1.4;
    rect(slide, xd, y, wd, 1.3, C.white);
    rect(slide, xd, y, 0.06, 1.3, color);
    addText(slide, trabajo, { x: xd + 0.22, y: y + 0.08, w: wd - 1.9, h: 0.26, fontSize: 11.4, bold: true, color: C.ink });
    rect(slide, xd + wd - 1.56, y + 0.1, 1.42, 0.26, color);
    addText(slide, quien.toUpperCase(), { x: xd + wd - 1.56, y: y + 0.11, w: 1.42, h: 0.24, fontSize: 8.6, bold: true, color: C.white, align: "center", valign: "mid", charSpacing: 0.6 });
    addText(slide, salida, { x: xd + 0.22, y: y + 0.4, w: wd - 0.4, h: 0.24, fontFace: TYPOGRAPHY.mono, fontSize: 9.6, color: ROJO });
    addText(slide, glosa, { x: xd + 0.22, y: y + 0.68, w: wd - 0.4, h: 0.56, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "Un pipeline en rojo no es un problema: son tres, cada uno con su dueño.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 15 · ruff no declarado

function slideRuffNotDeclared() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · un rojo del proyecto", "Funcionaba porque nadie lo había pedido", "", false, { titleFontSize: 28 });

  terminal(slide, {
    x: M,
    y: 1.88,
    w: CW,
    title: "Controles estáticos · paso uv run ruff check .",
    fontSize: 11,
    lines: [
      { t: "error: Failed to spawn: `ruff`", k: "err" },
      { t: "  cause: No such file or directory (os error 2)", k: "err" },
    ],
  });
  addText(slide, "En español: no se pudo lanzar ruff, porque no existe.", { x: M, y: 3.02, w: CW, h: 0.26, fontSize: 11, italic: true, color: C.slate });

  const w = (CW - 0.4) / 2;
  const lados = [
    [M, "Hasta ahora", "uv run --with ruff ruff check .", "--with lo instala solo para ese comando. Funcionaba, sin que el proyecto dijera que lo necesitaba.", C.white, ORO],
    [M + w + 0.4, "En el servidor", "uv run ruff check .", "Instala exactamente lo que el proyecto declara. ruff no estaba.", C.warm, ROJO],
  ];
  lados.forEach(([x, rotulo, comando, glosa, fondo, color]) => {
    rect(slide, x, 3.46, w, 1.62, fondo);
    rect(slide, x, 3.46, 0.06, 1.62, color);
    addKicker(slide, x + 0.28, 3.6, rotulo, color, w - 0.5);
    addText(slide, comando, { x: x + 0.28, y: 3.9, w: w - 0.5, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 11, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.28, y: 4.28, w: w - 0.5, h: 0.74, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.08 });
  });

  terminal(slide, {
    x: M,
    y: 5.24,
    w: 5.6,
    title: "La corrección: declararlas como dependencias de desarrollo",
    fontSize: 10.4,
    lines: [{ t: "uv add --dev ruff pyrefly", k: "cmd" }],
  });
  addText(slide, "Cualquiera que clonara el repositorio habría tenido el mismo error. Las de desarrollo se necesitan para trabajar en el proyecto, no para que funcione.", {
    x: M + 5.9,
    y: 5.24,
    w: CW - 5.9,
    h: 0.84,
    fontSize: 10.4,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 16 · 514 contra 560

function slideWidthByEnvironment() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · un detalle de la salida", "Otro número, el mismo veredicto", "", false);

  const x0 = M + 2.4;
  const ancho = CW - 2.9;
  const escala = ancho / 600;
  const medidas = [
    ["Windows · Chromium", 514, "las sesiones anteriores"],
    ["GitHub · Linux", 560, "los tres navegadores"],
  ];
  medidas.forEach(([donde, valor, glosa], index) => {
    const y = 2.2 + index * 1.0;
    addText(slide, donde, { x: M, y: y + 0.04, w: 2.3, h: 0.3, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: M, y: y + 0.36, w: 2.3, h: 0.24, fontSize: 9.6, italic: true, color: C.slate });
    rect(slide, x0, y + 0.08, valor * escala, 0.46, ROJO);
    addText(slide, `${valor} píxeles`, { x: x0 + valor * escala + 0.12, y: y + 0.1, w: 1.6, h: 0.42, fontSize: 14, bold: true, color: ROJO, valign: "mid" });
  });
  const xUmbral = x0 + 320 * escala;
  slide.addShape(SH.line, { x: xUmbral, y: 2.0, w: 0, h: 2.3, line: { color: VERDE, pt: 2.2, dashType: "dash" } });
  addText(slide, "umbral: no más de 320", { x: xUmbral - 2.1, y: 4.32, w: 2.06, h: 0.24, fontSize: 10, bold: true, color: VERDE, align: "right" });

  const w = (CW - 0.4) / 2;
  rect(slide, M, 4.8, w, 1.12, C.white);
  rect(slide, M, 4.8, 0.06, 1.12, AZUL);
  addText(slide, "La causa más probable son las fuentes tipográficas, distintas en Windows y en Linux: el mismo texto ocupa otro ancho. No se investigó más.", {
    x: M + 0.26,
    y: 4.86,
    w: w - 0.44,
    h: 1.0,
    fontSize: 10.8,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });
  rect(slide, M + w + 0.4, 4.8, w, 1.12, NAVY_CHIP);
  addText(slide, "La prueba afirma «no más de 320», no «exactamente 514». Por eso sigue siendo válida en otro entorno.", {
    x: M + w + 0.66,
    y: 4.86,
    w: w - 0.44,
    h: 1.0,
    fontSize: 11.4,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });

  addTakeaway(slide, "Cada número vale para el entorno donde se midió. El umbral hace que el veredicto no dependa de él.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 17 · Tercera ejecucion

function slideRunThree() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · ejecución 3", "Corregir un rojo revela el siguiente", "", false);

  const wl = 6.3;
  captura(slide, "ejecucion3Recorte", { x: M, y: 1.84, w: wl, hMax: 4.4, centrar: true, pie: "Los pasos del trabajo de controles estáticos, en GitHub." });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  terminal(slide, {
    x: xd,
    y: 1.84,
    w: wd,
    title: "uv run ruff check .",
    fontSize: 9.2,
    lines: [
      { t: "I001 [*] Import block is un-sorted", k: "err" },
      { t: "  --> test_concurrencia.py:1:1", k: "muted" },
      { t: "Found 1 error.", k: "err" },
      { t: "[*] 1 fixable with the `--fix` option.", k: "plain" },
    ],
  });
  addText(slide, "El bloque de importaciones está desordenado; ruff puede corregirlo solo con --fix. El problema existía antes: ruff ni siquiera llegaba a ejecutarse.", {
    x: xd,
    y: 3.34,
    w: wd,
    h: 0.9,
    fontSize: 10.4,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });
  rect(slide, xd, 4.34, wd, 1.1, C.warm);
  rect(slide, xd, 4.34, 0.06, 1.1, ROJO);
  addText(slide, "Mira el paso pyrefly en la captura: un círculo tachado. Cuando un paso falla, los siguientes del mismo trabajo se saltan. No se sabe si pyrefly pasa.", {
    x: xd + 0.24,
    y: 4.4,
    w: wd - 0.4,
    h: 0.98,
    fontSize: 10.4,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });
  terminal(slide, {
    x: xd,
    y: 5.58,
    w: wd,
    title: "La corrección",
    fontSize: 9.6,
    lines: [{ t: "uv run ruff check --fix .", k: "cmd" }],
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 · Cuarta ejecucion

function slideRunFour() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · ejecución 4", "El estado desde el que se decide", "", false);

  captura(slide, "ejecucion4Recorte", { x: M, y: 1.84, w: 5.9, pie: "Controles estáticos en verde; las dos suites, en rojo." });

  const xd = M + 6.2;
  const wd = CW - 6.2;
  tiraEstado(slide, {
    x: xd,
    y: 1.84,
    w: wd,
    titulo: "LO QUE QUEDA EN ROJO",
    trabajos: [
      ["Controles estáticos", "ok", "All checks passed! · 0 errors"],
      ["Pruebas de Python", "fail", "la suplantación"],
      ["Extremo a extremo", "fail", "[object Object] · 320 px"],
    ],
    fila: 0.5,
    fontSize: 11,
    fontDetalle: 8.8,
  });
  rect(slide, xd, 4.06, wd, 1.62, NAVY_CHIP);
  addText(slide, "Solo quedan rojos del sistema, y todos se conocían. Hay dos formas de llegar al verde: corregir los tres defectos, o dejar de preguntarlos.", {
    x: xd + 0.26,
    y: 4.14,
    w: wd - 0.44,
    h: 1.46,
    fontSize: 12.4,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "La segunda es la tentación de todo equipo con prisa, y es el tema del bloque 2.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · El historial y lo que cambia solo

function slideHistory() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 1 · el historial", "Cada ejecución queda registrada", "", false);

  const wl = 5.4;
  captura(slide, "historialMain", { x: M, y: 1.84, w: wl, hMax: 3.96, pie: "Las ejecuciones de main, de la más reciente a la primera." });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  rect(slide, xd, 1.84, wd, 1.3, C.white);
  rect(slide, xd, 1.84, 0.06, 1.3, VERDE);
  addText(slide, "El historial también es evidencia", { x: xd + 0.24, y: 1.94, w: wd - 0.4, h: 0.28, fontSize: 12, bold: true, color: VERDE });
  addText(slide, "Muestra qué se encontró, en qué orden y cómo se corrigió. Un pipeline en verde desde el primer día no puede mostrar eso.", {
    x: xd + 0.24,
    y: 2.26,
    w: wd - 0.44,
    h: 0.8,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });

  addKicker(slide, xd, 3.34, "Lo que cambia sin que nadie toque el repositorio", ROJO, wd);
  terminal(slide, {
    x: xd,
    y: 3.64,
    w: wd,
    title: "Una advertencia de la propia ejecución",
    fontSize: 8.6,
    lines: [
      { t: "The ubuntu-latest label will migrate", k: "muted" },
      { t: "to Ubuntu 26 beginning October 19, 2026.", k: "muted" },
    ],
  });
  addText(slide, "latest significa «la más reciente», y la más reciente cambia sola. Lo mismo con Python: .python-version, el archivo que fija la versión del proyecto, dice 3.13, y el servidor instaló la 3.13.15; las sesiones anteriores usaron la 3.13.11.", {
    x: xd,
    y: 4.74,
    w: wd,
    h: 1.0,
    fontSize: 10.4,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });

  addTakeaway(slide, "Fijar una versión exacta o dejarla abierta: las dos son legítimas si se sabe cuál se eligió.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 y 21 · Preguntas y respuestas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de decidir", [
    [
      "La primera ejecución falló en 8 segundos sin ejecutar ninguna prueba. ¿Dice algo sobre la calidad del sistema de reservas?",
      "Revisa en qué paso falló y qué decía el mensaje. ¿Qué archivo había que corregir, y es parte del sistema?",
    ],
    [
      "ruff funcionaba antes y en el servidor no se pudo ejecutar. Un compañero dice que el problema es del servidor. ¿Tiene razón?",
      "Compara el comando que se usaba antes con el del pipeline. ¿Qué habría pasado si otra persona hubiera clonado el repositorio?",
    ],
    [
      "En Windows la página medía 514 píxeles y en el servidor 560. ¿Cuál de los dos es el resultado correcto de la prueba?",
      "Mira qué afirma la prueba: un valor exacto o un límite. ¿Cambió el veredicto entre los dos entornos?",
    ],
  ]);
}

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "Nada: falló el pipeline",
      "El error estaba en el archivo de configuración, no en el código de la aplicación.",
      "Antes de corregir un rojo hay que saber quién falló.",
      "Leer todo rojo como un defecto del sistema.",
    ],
    [
      "No: el problema era del proyecto",
      "El proyecto nunca declaró ruff; cualquiera que lo clonara habría tenido el mismo error.",
      "El pipeline instala solo lo que el repositorio declara.",
      "Culpar al servidor de lo que el proyecto no dice.",
    ],
    [
      "Los dos: el veredicto es el mismo",
      "La prueba afirma «no más de 320», y ninguno de los dos cumple.",
      "Un umbral mantiene la prueba válida en otro entorno.",
      "Escribir la prueba contra el número exacto de una máquina.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 22 · Divisor del bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "El verde honesto", { x: M, y: 1.98, w: 10.7, h: 1.5, fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color: C.white });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Llevar el pipeline a verde sin esconder lo que se sabe: marcar los defectos conocidos, dejarlos por escrito, y programar lo que depende del tiempo y no de los cambios.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 2, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · La alarma que suena siempre

function slideAlwaysRed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el problema", "Un pipeline siempre en rojo ya no avisa", "", false, { titleFontSize: 28 });

  addText(slide, "Tres defectos conocidos, ninguno se corrige hoy: cada uno espera una decisión que no es técnica.", {
    x: M,
    y: 1.86,
    w: CW,
    h: 0.3,
    fontSize: 12.4,
    color: C.ink,
  });
  const defectos = [
    ["La suplantación", "Cómo se identifican las personas"],
    ["[object Object]", "Qué dice el mensaje de cada campo"],
    ["La pantalla de 320 píxeles", "Cómo se rediseña la grilla, la cuadrícula de los ocho bloques"],
  ];
  const w = (CW - 0.4) / 3;
  defectos.forEach(([defecto, decision], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.3, w, 1.12, C.white);
    rect(slide, x, 2.3, 0.06, 1.12, ROJO);
    addText(slide, defecto, { x: x + 0.24, y: 2.38, w: w - 0.4, h: 0.3, fontSize: 12.4, bold: true, color: C.ink });
    addText(slide, `Falta decidir: ${decision}.`, { x: x + 0.24, y: 2.72, w: w - 0.4, h: 0.64, fontSize: 10.2, color: C.slate, lineSpacingMultiple: 1.04 });
  });

  addKicker(slide, M, 3.7, "Cinco ejecuciones seguidas. ¿En cuál entró un defecto nuevo?", C.slate, 10);
  const wc = (CW - 0.16 * 4) / 5;
  for (let i = 0; i < 5; i += 1) {
    const x = M + i * (wc + 0.16);
    tiraEstado(slide, {
      x,
      y: 4.0,
      w: wc,
      trabajos: [
        ["Estáticos", "ok"],
        ["Python", "fail"],
        ["Navegador", "fail"],
      ],
      fila: 0.34,
      fontSize: 9.4,
    });
  }
  addText(slide, "Las cinco se ven iguales. Si una trae un defecto nuevo, el rojo nuevo se pierde entre los viejos.", {
    x: M,
    y: 5.36,
    w: CW,
    h: 0.5,
    fontSize: 11.4,
    italic: true,
    color: C.ink,
  });

  addTakeaway(slide, "Es una alarma que suena todo el día: nadie la mira.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24 · Cuatro formas de salir del rojo

function slideFourWays() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · las opciones", "Cuatro formas de salir del rojo", "", false);

  const opciones = [
    ["Corregir el defecto", "Verde", "Desaparece, porque dejó de ser cierto", VERDE, "La respuesta, cuando se puede"],
    ["Borrar la prueba", "Verde", "Se pierde: nadie sabrá que el defecto existe", ROJO, "Afirma algo falso"],
    ["Omitir la prueba", "Verde", "Se esconde: la prueba ni siquiera se ejecuta", ROJO, "Afirma algo falso"],
    ["Marcarla como falla esperada", "Verde", "Sigue visible, y la prueba se sigue ejecutando", AZUL, "Lo que enseña este bloque"],
  ];
  addText(slide, "EL PIPELINE", { x: M + 3.4, y: 1.86, w: 1.4, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  addText(slide, "LO QUE SE SABE DEL DEFECTO", { x: M + 5.0, y: 1.86, w: 4.2, h: 0.22, fontSize: 9, bold: true, color: C.slate, charSpacing: 1 });
  opciones.forEach(([opcion, pipeline, sabe, color, veredicto], index) => {
    const y = 2.16 + index * 0.9;
    rect(slide, M, y, CW, 0.8, index === 3 ? C.warm : C.white);
    rect(slide, M, y, 0.06, 0.8, color);
    addText(slide, opcion, { x: M + 0.24, y: y + 0.1, w: 3.1, h: 0.6, fontSize: 12.6, bold: true, color: C.ink, valign: "mid" });
    rect(slide, M + 3.4, y + 0.22, 1.2, 0.36, VERDE);
    addText(slide, pipeline.toUpperCase(), { x: M + 3.4, y: y + 0.24, w: 1.2, h: 0.32, fontSize: 9.4, bold: true, color: C.white, align: "center", valign: "mid" });
    addText(slide, sabe, { x: M + 5.0, y: y + 0.1, w: 4.4, h: 0.6, fontSize: 11.4, color: C.ink, valign: "mid" });
    addText(slide, veredicto, { x: M + 9.5, y: y + 0.1, w: CW - 9.7, h: 0.6, fontSize: 10.4, bold: true, color, valign: "mid", align: "right" });
  });

  addTakeaway(slide, "Las cuatro dejan el pipeline en verde. Solo dos dicen la verdad.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 25 · Omitir o falla esperada

function slideSkipVsXfail() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la fuente", "Omitir no es lo mismo que esperar la falla", "", false, { titleFontSize: 28 });

  addQuote(
    slide,
    M,
    1.88,
    CW,
    1.34,
    "Omitir (skip) significa que se espera que la prueba pase solo si se cumplen ciertas condiciones; si no, pytest no la ejecuta en absoluto. […] Una falla esperada (xfail) significa que se espera que la prueba falle por algún motivo, por ejemplo una funcionalidad todavía no implementada o un defecto todavía no corregido.",
    "pytest, How to use skip and xfail · traducción del original en inglés",
    AZUL
  );

  const w = (CW - 0.4) / 2;
  const casos = [
    [M, "Omitir · skip", "Para pruebas que no aplican", "Una prueba de Windows en un servidor Linux. No se ejecuta, y está bien: no hay nada que ver.", C.slate, C.white],
    [M + w + 0.4, "Falla esperada · xfail", "Para defectos conocidos", "La suplantación. Se ejecuta en cada corrida, y el informe dice que sigue fallando y por qué.", AZUL, C.warm],
  ];
  casos.forEach(([x, rotulo, para, ejemplo, color, fondo]) => {
    rect(slide, x, 3.42, w, 2.44, fondo);
    rect(slide, x, 3.42, w, 0.06, color);
    addKicker(slide, x + 0.3, 3.62, rotulo, color, w - 0.6);
    addText(slide, para, { x: x + 0.3, y: 3.92, w: w - 0.6, h: 0.5, fontFace: TYPOGRAPHY.display, fontSize: 20, bold: true, color: C.ink });
    addText(slide, ejemplo, { x: x + 0.3, y: 4.56, w: w - 0.6, h: 1.16, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.1 });
  });

  addTakeaway(slide, "Omitir un defecto conocido es esconderlo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 26 · La falla esperada en pytest

function slideXfailPytest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · pytest", "La marca va en la prueba, con su motivo", "", false, { titleFontSize: 28 });

  const wl = 7.2;
  const panel = codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "python",
    fontSize: 9,
    title: "test_seguridad.py",
    marcas: [
      { linea: 1, color: C.gold, numero: 3 },
      { linea: 2, color: ROJO, numero: 1 },
      { linea: 3, color: C.gold, numero: 2 },
    ],
    code: [
      "@pytest.mark.xfail(",
      "    strict=True,",
      "    reason=(",
      '        "Suplantación: la API acepta cualquier RUT sin comprobar quién lo escribe. "',
      '        "Pendiente: decidir cómo se identifican las personas."',
      "    ),",
      ")",
      "def test_otra_persona_no_puede_agotar_la_cuota_de_ana(",
      "    base_de_datos_de_prueba: Path,",
      ") -> None:",
      "    ...",
    ].join("\n"),
  });
  addText(slide, "El cuerpo de la prueba no cambia: sigue afirmando lo mismo. Los tres puntos indican que aquí se omite, para mostrar solo la marca.", {
    x: M,
    y: 1.84 + panel.h + 0.06,
    w: wl,
    h: 0.46,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const piezas = [
    [1, ROJO, "strict=True", "Si la prueba pasa, la suite se pone en rojo. La marca no puede sobrevivir a su motivo."],
    [2, C.gold, "reason=", "El motivo, escrito en la prueba. Aparece en el informe de cada ejecución."],
    [3, C.gold, "xfail", "pytest la ejecuta; si falla, la informa como xfailed, sin poner la suite en rojo."],
  ];
  piezas.forEach(([numero, color, pieza, glosa], index) => {
    const y = 1.84 + index * 0.9;
    rect(slide, xd, y, wd, 0.82, C.white);
    circulo(slide, xd + 0.3, y + 0.28, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, pieza, { x: xd + 0.56, y: y + 0.08, w: wd - 0.7, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10.6, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.56, y: y + 0.36, w: wd - 0.7, h: 0.44, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.02 });
  });

  terminal(slide, {
    x: M,
    y: 1.84 + panel.h + 0.56,
    w: CW,
    title: "uv run pytest -q -rxX · -r pide un resumen final; x y X, las fallas esperadas y las que pasaron inesperadamente",
    fontSize: 9,
    lines: [
      { t: "XFAIL test_seguridad.py::test_otra_persona_no_puede_agotar_la_cuota_de_ana - Suplantación: la API acepta cualquier RUT sin", k: "muted" },
      { t: "comprobar quién lo escribe. Pendiente: decidir cómo se identifican las personas.", k: "muted" },
      { t: "24 passed, 1 xfailed, 1 warning in 0.83s", k: "ok" },
    ],
  });
  addText(slide, "La salida de pytest es una sola línea; aquí se partió para que quepa. Ojo: -rxX tiene un defecto que aparece en el bloque 4.", {
    x: M,
    y: 1.84 + panel.h + 1.86,
    w: CW,
    h: 0.24,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · La falla esperada en Playwright

function slideTestFail() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · Playwright", "test.fail: estricta sin pedirlo", "", false);

  codigo(slide, {
    x: M,
    y: 1.84,
    w: CW,
    lang: "typescript",
    fontSize: 10,
    title: "e2e/pruebas/reserva.spec.ts",
    marcas: [
      { linea: 1, color: C.gold, numero: 1 },
      { linea: 3, color: C.gold, numero: 2 },
    ],
    code: [
      'test.fail("si falta un dato, la pantalla dice cuál corregir", {',
      "  annotation: {",
      '    type: "rojo conocido",',
      '    description: "La pantalla muestra [object Object]. Pendiente: decidir qué dice el mensaje de cada campo.",',
      "  },",
      "}, async ({ page }) => {",
      "  // el mismo cuerpo de siempre",
      "});",
    ].join("\n"),
  });

  const w = (CW - 0.3) / 2;
  rect(slide, M, 4.14, w, 1.0, C.white);
  circulo(slide, M + 0.32, 4.44, 0.28, C.gold, 1, C.navy, 9.4);
  addText(slide, "test.fail reemplaza a test, y recibe detalles entre el título y el cuerpo.", { x: M + 0.6, y: 4.2, w: w - 0.8, h: 0.88, fontSize: 10.8, color: C.ink, valign: "mid", lineSpacingMultiple: 1.06 });
  rect(slide, M + w + 0.3, 4.14, w, 1.0, C.white);
  circulo(slide, M + w + 0.62, 4.44, 0.28, C.gold, 2, C.navy, 9.4);
  addText(slide, "Una anotación: un tipo y una descripción que Playwright guarda junto a la prueba y muestra en sus informes.", {
    x: M + w + 0.9,
    y: 4.2,
    w: w - 0.8,
    h: 0.88,
    fontSize: 10.8,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });

  addQuote(
    slide,
    M,
    5.3,
    CW,
    0.86,
    "Marca una prueba como «debe fallar». Playwright la ejecuta y se asegura de que efectivamente falle.",
    "Playwright, test.fail · traducción del original en inglés",
    AZUL
  );

  addTakeaway(slide, "Si la prueba pasa, Playwright la cuenta como falla.", { y: 6.3, h: 0.44 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · La trampa del 27 passed

function slideTwentySevenPassed() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · cómo se lee", "27 passed, y seis fallaron", "", false);

  terminal(slide, {
    x: M,
    y: 1.84,
    w: CW,
    title: "Pruebas de extremo a extremo · con las dos marcas",
    fontSize: 9.2,
    lines: [
      { t: "  ✘   6 [chromium] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.0s)", k: "err" },
      { t: "  ✘   9 [chromium] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (938ms)", k: "err" },
      { t: "  ✘  15 [firefox] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.1s)", k: "err" },
      { t: "  ✘  18 [firefox] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.8s)", k: "err" },
      { t: "  ✘  24 [webkit] › pruebas/reserva.spec.ts:20:6 › si falta un dato, la pantalla dice cuál corregir (6.2s)", k: "err" },
      { t: "  ✘  27 [webkit] › pruebas/verificacion.spec.ts:22:6 › en una pantalla de 320 píxeles no hay desplazamiento horizontal (1.2s)", k: "err" },
      { t: "  27 passed (1.2m)", k: "ok" },
    ],
  });

  const w = (CW - 0.4) / 3;
  const lecturas = [
    ["Cada ✘", "Una prueba que falló, como se esperaba.", ROJO],
    ["27 passed", "Cuenta juntas las que pasaron y las que fallaron como se esperaba.", VERDE],
    ["Quien lee solo el total", "Cree que las 27 pasaron.", ORO],
  ];
  lecturas.forEach(([titulo, glosa, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 4.24, w, 1.3, C.white);
    rect(slide, x, 4.24, w, 0.06, color);
    addText(slide, titulo, { x: x + 0.24, y: 4.4, w: w - 0.44, h: 0.36, fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color });
    addText(slide, glosa, { x: x + 0.24, y: 4.82, w: w - 0.44, h: 0.66, fontSize: 11, color: C.ink, lineSpacingMultiple: 1.06 });
  });

  addTakeaway(slide, "La marca no basta: hace falta un registro escrito que cualquiera pueda leer.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 29 · Cuando alguien corrige el defecto

function slideStrictInAction() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · pull request 1", "El sistema mejoró, y el pipeline se puso en rojo", "", false, { titleFontSize: 27 });

  const w = (CW - 0.3 * 3) / 4;
  const pasos = [
    ["Se corrige", "En una rama, la interfaz pasa a decir «Revisa el campo Personas.» en lugar de [object Object].", [["main, antes", "ok"]], AZUL, ""],
    ["Pipeline en rojo", "La prueba marcada ya no falla:", [["Extremo a extremo", "fail"]], ROJO, "Expected to fail, but passed."],
    ["Se quita la marca", "Y la fila del registro de rojos conocidos.", [["Extremo a extremo", "ok"]], VERDE, ""],
    ["Queda abierto", "Integrarlo es aceptar ese texto como el mensaje oficial: una decisión de requisito.", [["Sin integrar", "skip"]], C.slate, ""],
  ];
  pasos.forEach(([titulo, glosa, trabajos, color, salida], index) => {
    const x = M + index * (w + 0.3);
    rect(slide, x, 1.94, w, 3.3, index === 1 ? C.warm : C.white);
    rect(slide, x, 1.94, w, 0.06, color);
    circulo(slide, x + 0.36, 2.34, 0.38, color, String(index + 1), C.white, 12);
    addText(slide, titulo, { x: x + 0.64, y: 2.16, w: w - 0.8, h: 0.36, fontSize: 12.4, bold: true, color: C.ink, valign: "mid" });
    addText(slide, glosa, { x: x + 0.22, y: 2.66, w: w - 0.44, h: 1.1, fontSize: 10.6, color: C.ink, lineSpacingMultiple: 1.06 });
    if (salida) {
      addText(slide, salida, { x: x + 0.22, y: 3.68, w: w - 0.44, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 9.6, bold: true, color: ROJO });
    }
    tiraEstado(slide, { x: x + 0.18, y: 4.14, w: w - 0.36, trabajos, fila: 0.4, fontSize: 9.6 });
    if (index < 3) arrow(slide, x + w + 0.04, 3.2, 0.22, C.slate);
  });

  rect(slide, M, 5.42, CW, 0.6, NAVY_CHIP);
  addText(slide, "La marca decía «esto está roto», y dejó de ser cierto. El pipeline no acepta que el repositorio siga afirmando algo falso.", {
    x: M + 0.3,
    y: 5.46,
    w: CW - 0.6,
    h: 0.52,
    fontSize: 11.8,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  addTakeaway(slide, "El pipeline dice que el cambio funciona; no dice que el texto sea el correcto.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · Por que corre dos veces

function slideRunsTwice() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · un detalle del historial", "Cada commit de la rama corrió dos veces", "", false, { titleFontSize: 28 });

  rect(slide, M, 2.4, 2.6, 1.0, NAVY_CHIP);
  addText(slide, "Un commit en una rama con pull request abierto", { x: M + 0.2, y: 2.46, w: 2.2, h: 0.88, fontSize: 11.4, bold: true, color: C.white, valign: "mid" });
  arrow(slide, M + 2.7, 2.6, 0.9, C.slate, 2);
  arrow(slide, M + 2.7, 3.2, 0.9, C.slate, 2);
  const eventos = [
    ["Por el evento push", "on: push:", 2.1],
    ["Por el evento pull_request", "on: pull_request:", 2.96],
  ];
  eventos.forEach(([titulo, codigoEvento, y]) => {
    rect(slide, M + 3.7, y, 4.0, 0.72, C.white);
    rect(slide, M + 3.7, y, 0.06, 0.72, AZUL);
    addText(slide, titulo, { x: M + 3.92, y: y + 0.06, w: 3.7, h: 0.3, fontSize: 12, bold: true, color: C.ink });
    addText(slide, codigoEvento, { x: M + 3.92, y: y + 0.38, w: 3.7, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10, color: C.slate });
  });

  const xd = M + 8.0;
  const wd = CW - 8.0;
  rect(slide, xd, 1.94, wd, 1.9, C.warm);
  rect(slide, xd, 1.94, 0.06, 1.9, ORO);
  addText(slide, "Es la consecuencia de pedir los dos eventos en la sección on. Parece un desperdicio, y en el bloque 3 va a mostrar algo que ninguna ejecución sola podía mostrar.", {
    x: xd + 0.24,
    y: 2.0,
    w: wd - 0.4,
    h: 1.78,
    fontSize: 11,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.08,
  });

  addKicker(slide, M, 4.14, "Si se quiere evitar", AZUL, 8);
  codigo(slide, {
    x: M,
    y: 4.44,
    w: 5.4,
    lang: "yaml",
    fontSize: 10,
    code: ["on:", "  push:", "    branches: [main]", "  pull_request:"].join("\n"),
  });
  addText(slide, "push queda limitado a la rama principal. El costo: un push a otra rama, sin pull request abierto, no ejecuta nada. En el proyecto se dejaron los dos eventos sin límite.", {
    x: M + 5.7,
    y: 4.44,
    w: CW - 5.7,
    h: 1.2,
    fontSize: 11,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(slide, "Dos ejecuciones del mismo commit deberían dar el mismo resultado. Si no lo dan, algo no es confiable.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · Dejarlo por escrito

function slideWrittenRecord() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el registro", "Lo que la marca no dice a quien no abre el código", "", false, { titleFontSize: 27 });

  addText(slide, "En el README del proyecto, bajo «Rojos conocidos»:", { x: M, y: 1.86, w: CW, h: 0.28, fontSize: 12, color: C.ink });
  const cols = [
    [M, 3.6, "PRUEBA"],
    [M + 3.7, 4.9, "QUÉ MUESTRA"],
    [M + 8.7, CW - 8.7, "QUÉ DECISIÓN FALTA"],
  ];
  cols.forEach(([x, w, titulo]) => {
    rect(slide, x, 2.24, w - 0.1, 0.36, NAVY_CHIP);
    addText(slide, titulo, { x: x + 0.14, y: 2.28, w: w - 0.3, h: 0.28, fontSize: 9.4, bold: true, color: titulo === "QUÉ DECISIÓN FALTA" ? C.gold : C.white, charSpacing: 1, valign: "mid" });
  });
  const filas = [
    ["Otra persona no puede agotar la cuota de Ana", "La API acepta cualquier RUT sin comprobar quién lo escribe", "Cómo se identifican las personas"],
    ["Si falta un dato, la pantalla dice cuál corregir", "Muestra [object Object] en lugar de decir qué campo falta", "Qué dice el mensaje de cada campo"],
    ["Pantalla de 320 píxeles", "La página es más ancha y obliga a desplazarse hacia los lados", "Cómo se rediseña la grilla"],
  ];
  filas.forEach((fila, index) => {
    const y = 2.66 + index * 0.66;
    fila.forEach((texto, c) => {
      const [x, w] = cols[c];
      rect(slide, x, y, w - 0.1, 0.6, c === 2 ? C.warm : C.white);
      addText(slide, texto, { x: x + 0.14, y: y + 0.04, w: w - 0.34, h: 0.52, fontSize: 10.2, bold: c === 2, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
    });
  });

  addQuote(
    slide,
    M,
    4.8,
    CW,
    1.0,
    "Una prueba desactivada tiene que estar justificada por escrito. Una prueba borrada sin explicación cuenta como un defecto sin cubrir.",
    "Instrucciones de la Evaluación Final, sección 3.B",
    ROJO
  );

  addTakeaway(slide, "Sin la decisión pendiente, es una prueba abandonada. Con ella, es una tarea que alguien puede tomar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32 · La auditoria programada

function slideScheduledAudit() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · lo que depende del tiempo", "Una vulnerabilidad nueva no espera un push", "", false, { titleFontSize: 27 });

  const wl = 7.0;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "yaml",
    fontSize: 8.4,
    title: ".github/workflows/auditoria.yml",
    marcas: [
      { linea: 7, color: ROJO, numero: 1 },
      { linea: 9, color: C.gold, numero: 2 },
      { linea: 19, color: C.gold, numero: 3 },
    ],
    code: [
      "name: Auditoría de dependencias",
      "",
      "on:",
      "  push:",
      "  pull_request:",
      "  schedule:",
      '    - cron: "0 8 * * *"',
      '      timezone: "America/Santiago"',
      "  workflow_dispatch:",
      "",
      "jobs:",
      "  pip-audit:",
      "    name: Vulnerabilidades conocidas",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v7",
      "      - uses: astral-sh/setup-uv@v10.2.0",
      "      - run: uv sync --locked",
      "      - run: uv export --no-dev --format requirements-txt --no-hashes -o req-prod.txt",
      "      - run: uv run pip-audit -r req-prod.txt",
    ].join("\n"),
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  addText(slide, "Una vulnerabilidad es una debilidad de seguridad ya descubierta y publicada. pip-audit compara las dependencias con una base pública de ellas. Una nueva se puede publicar sobre una versión ya instalada, sin que nadie toque el repositorio.", {
    x: xd,
    y: 1.84,
    w: wd,
    h: 0.9,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });
  circulo(slide, xd + 0.14, 3.02, 0.28, ROJO, 1, C.white, 9.4);
  addText(slide, "cron: cinco campos", { x: xd + 0.4, y: 2.88, w: wd - 0.4, h: 0.28, fontSize: 11.4, bold: true, color: C.ink });
  const campos = [
    ["0", "minuto"],
    ["8", "hora"],
    ["*", "día"],
    ["*", "mes"],
    ["*", "semana"],
  ];
  const wc = (wd - 0.08 * 4) / 5;
  campos.forEach(([valor, nombre], index) => {
    const x = xd + index * (wc + 0.08);
    rect(slide, x, 3.26, wc, 0.5, C.editorBg);
    addText(slide, valor, { x, y: 3.3, w: wc, h: 0.42, fontFace: TYPOGRAPHY.mono, fontSize: 18, bold: true, color: C.gold, align: "center", valign: "mid" });
    addText(slide, nombre, { x, y: 3.8, w: wc, h: 0.22, fontSize: 9.4, color: C.slate, align: "center" });
  });
  addText(slide, "Minuto 0, hora 8, cualquier día, mes y día de la semana: todos los días a las 8:00. timezone lo fija en hora de Chile; sin esa línea, cron usa la hora universal (UTC).", {
    x: xd,
    y: 4.1,
    w: wd,
    h: 0.8,
    fontSize: 10,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });
  circulo(slide, xd + 0.14, 5.12, 0.28, C.gold, 2, C.navy, 9.4);
  addText(slide, "workflow_dispatch: un botón en Actions para ejecutarlo a mano.", { x: xd + 0.4, y: 4.98, w: wd - 0.4, h: 0.3, fontSize: 10.4, color: C.ink });
  circulo(slide, xd + 0.14, 5.56, 0.28, C.gold, 3, C.navy, 9.4);
  addText(slide, "La lista exacta de dependencias de producción, sin las de desarrollo, auditada.", { x: xd + 0.4, y: 5.42, w: wd - 0.4, h: 0.46, fontSize: 10.4, color: C.ink, lineSpacingMultiple: 1.02 });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 33 · Las condiciones de schedule

function slideScheduleConditions() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · antes de confiar en schedule", "Tres condiciones del evento programado", "", false, { titleFontSize: 28 });

  const wl = 5.6;
  const condiciones = [
    ["Se ejecuta sobre main", "Sobre el último commit de la rama principal, no sobre las otras ramas."],
    ["Se puede retrasar", "En los períodos de alta carga de GitHub Actions, la hora no es exacta."],
    ["Se apaga solo", "En un repositorio público, sin actividad durante 60 días, se desactiva sin avisar."],
  ];
  condiciones.forEach(([titulo, glosa], index) => {
    const y = 1.9 + index * 1.14;
    rect(slide, M, y, wl, 1.02, index === 2 ? C.warm : C.white);
    rect(slide, M, y, 0.06, 1.02, index === 2 ? ROJO : AZUL);
    addText(slide, titulo, { x: M + 0.26, y: y + 0.1, w: wl - 0.4, h: 0.3, fontSize: 12.4, bold: true, color: C.ink });
    addText(slide, glosa, { x: M + 0.26, y: y + 0.44, w: wl - 0.44, h: 0.54, fontSize: 10.6, color: C.slate, lineSpacingMultiple: 1.04 });
  });
  addFuente(slide, 5.4, "GitHub Docs, Events that trigger workflows · resumen del original en inglés", { w: wl });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  captura(slide, "historialAuditoria", { x: xd, y: 1.9, w: wd, pie: "Ejecuciones de la auditoría: por push y a mano («Manually run»)." });

  addTakeaway(slide, "Un proyecto que se deja de tocar deja también de auditarse.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 34 · La matriz en cada ejecucion

function slideMatrixInSummary() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · la trazabilidad", "La matriz, regenerada en cada ejecución", "", false, { titleFontSize: 28 });

  const wl = 6.4;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "yaml",
    fontSize: 9.4,
    title: "Un paso más en el trabajo de pytest",
    marcas: [
      { linea: 2, color: ROJO, numero: 1 },
      { linea: 5, color: C.gold, numero: 2 },
    ],
    code: [
      "      - name: Matriz de trazabilidad",
      "        if: always()",
      "        run: |",
      "          echo '```text' >> \"$GITHUB_STEP_SUMMARY\"",
      "          uv run python trazabilidad.py >> \"$GITHUB_STEP_SUMMARY\"",
      "          echo '```' >> \"$GITHUB_STEP_SUMMARY\"",
    ].join("\n"),
  });
  const notas = [
    [1, ROJO, "if: always()", "Ejecuta el paso aunque pytest haya fallado: es justo cuando más interesa la matriz."],
    [2, C.gold, "$GITHUB_STEP_SUMMARY", "Un archivo especial: lo que se escribe en él aparece en la página de resumen de la ejecución."],
    [0, C.slate, "run: |, echo y >>", "La barra permite varios comandos; echo escribe un texto; >> lo agrega al final del archivo."],
  ];
  notas.forEach(([numero, color, pieza, glosa], index) => {
    const y = 3.66 + index * 0.84;
    rect(slide, M, y, wl, 0.76, C.white);
    if (numero) circulo(slide, M + 0.3, y + 0.38, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, pieza, { x: M + 0.56, y: y + 0.06, w: wl - 0.7, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10, bold: true, color: C.ink });
    addText(slide, glosa, { x: M + 0.56, y: y + 0.34, w: wl - 0.7, h: 0.4, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.02 });
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  terminal(slide, {
    x: xd,
    y: 1.84,
    w: wd,
    title: "Cada requisito y cuántas pruebas lo comprueban",
    fontSize: 8.6,
    lines: [
      { t: "requisito    pruebas   estado", k: "muted" },
      { t: "RF-01             10   cubierto" },
      { t: "RF-02              3   cubierto" },
      { t: "RF-03              2   cubierto" },
      { t: "RF-04              4   cubierto" },
      { t: "RF-05              0   SIN PRUEBA", k: "err" },
      { t: "RF-06              1   cubierto" },
      { t: "RF-07              2   cubierto" },
      { t: "RF-08              0   SIN PRUEBA", k: "err" },
      { t: "RF-09              0   SIN PRUEBA", k: "err" },
      { t: "RF-10              0   SIN PRUEBA", k: "err" },
      { t: "Pruebas sin requisito: 3", k: "muted" },
    ],
  });
  rect(slide, xd, 5.02, wd, 0.9, NAVY_CHIP);
  addText(slide, "Informa y no bloquea. Qué debe bloquear un cambio es un criterio de salida —la condición que el plan de pruebas declara para darla por terminada—, no una decisión del pipeline.", {
    x: xd + 0.24,
    y: 5.06,
    w: wd - 0.4,
    h: 0.82,
    fontSize: 10.8,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.06,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 35 · El estado al final del bloque

function slideBlockTwoState() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 2 · el estado", "Todo en verde, y nada escondido", "", false);

  tiraEstado(slide, {
    x: M,
    y: 1.94,
    w: CW,
    titulo: "LOS CUATRO TRABAJOS DE LOS DOS FLUJOS",
    trabajos: [
      ["Controles estáticos", "ok", "sin problemas"],
      ["Pruebas de Python", "ok", "24 passed, 1 xfailed · la suplantación, con su motivo"],
      ["Pruebas de extremo a extremo", "ok", "27 passed · 6 de ellas, fallas esperadas"],
      ["Vulnerabilidades conocidas", "ok", "No known vulnerabilities found"],
    ],
    fila: 0.56,
    fontSize: 12.4,
    fontDetalle: 10.4,
  });

  const w = (CW - 0.2) / 2;
  const futuros = [
    ["Si alguien corrige un defecto", "La marca estricta pone el pipeline en rojo hasta que se actualice el registro."],
    ["Si se publica una vulnerabilidad", "La auditoría programada la encuentra a la mañana siguiente, sin que nadie haga push."],
  ];
  futuros.forEach(([titulo, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 4.84, w, 1.04, C.white);
    rect(slide, x, 4.84, 0.06, 1.04, VERDE);
    addText(slide, titulo, { x: x + 0.26, y: 4.92, w: w - 0.4, h: 0.28, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.26, y: 5.24, w: w - 0.44, h: 0.58, fontSize: 10.6, color: C.slate, lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "Cada verde dice lo que mide. Falta una pregunta: ¿y si una prueba pasa y falla sin motivo?");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 36 y 37 · Preguntas y respuestas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de la pausa", [
    [
      "Un compañero consiguió el verde agregando @pytest.mark.skip a las dos pruebas que fallaban. Su pipeline está en verde, igual que el de la clase. ¿Qué diferencia hay?",
      "Revisa qué hace pytest con una prueba omitida y con una falla esperada. ¿Qué pasa el día que alguien corrija el defecto?",
    ],
    [
      "En el pull request número 1, el sistema mejoró y el pipeline se puso en rojo. ¿Tiene sentido que una mejora rompa el pipeline?",
      "Relee qué afirmaba la marca antes de la corrección. ¿Qué afirmaría el repositorio si la marca se quedara?",
    ],
    [
      "La salida de Playwright dice 27 passed. ¿Se puede escribir en un informe que las 27 pruebas de extremo a extremo pasan?",
      "Busca las líneas marcadas con ✘ en la misma salida. ¿Qué parte hay que leer para saber cuántas pasaron?",
    ],
  ]);
}

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "Omitir esconde el defecto",
      "La prueba omitida no se ejecuta; la falla esperada se ejecuta y muestra su motivo.",
      "Con strict, corregir el defecto obliga a quitar la marca.",
      "Llegar al verde apagando lo que falla.",
    ],
    [
      "Sí: la marca dejó de ser cierta",
      "La marca decía «esto está roto», y la prueba empezó a pasar.",
      "El pipeline no deja que el repositorio afirme algo falso.",
      "Quitar strict para que la mejora no moleste.",
    ],
    [
      "No: seis fallaron como se esperaba",
      "El total cuenta juntas las que pasaron y las fallas esperadas.",
      "Hay que leer las líneas, y tener un registro escrito.",
      "Informar el total sin mirar las ✘.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 38 · Divisor del bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 4 · 20 minutos", C.gold, 5);
  addText(slide, "La prueba que pasa y falla", { x: M, y: 1.98, w: 11.2, h: 1.5, fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color: C.white });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Una prueba inestable llega al pipeline: el mismo commit en rojo y en verde, reintentos que informan y reintentos que esconden, y la única forma de saber si una prueba es confiable.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 3, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 39 · Lo que cuesta, en Google

function slideFlakyCost() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el costo", "Lo que mide Google en su integración continua", "", false, { titleFontSize: 27 });

  addText(slide, "Prueba inestable: la que pasa y falla sin que el código cambie. En una suite que corre sola decenas de veces al día, deja de ser una molestia.", {
    x: M,
    y: 1.84,
    w: CW,
    h: 0.5,
    fontSize: 12,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  const cifras = [
    ["1,5 %", "de todas las ejecuciones de pruebas dan un resultado inestable", AZUL],
    ["16 %", "de las pruebas tienen algún grado de inestabilidad: más de 1 de cada 7", ORO],
    ["84 %", "de los cambios de verde a rojo involucran una prueba inestable", ROJO],
  ];
  const w = (CW - 0.4) / 3;
  cifras.forEach(([numero, glosa, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.48, w, 1.96, index === 2 ? C.warm : C.white);
    rect(slide, x, 2.48, w, 0.08, color);
    addText(slide, numero, { x: x + 0.28, y: 2.66, w: w - 0.5, h: 0.86, fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color });
    addText(slide, glosa, { x: x + 0.28, y: 3.56, w: w - 0.5, h: 0.8, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.06 });
  });
  addQuote(
    slide,
    M,
    4.62,
    CW,
    1.04,
    "Es bastante común ignorar fallas legítimas en pruebas inestables por la gran cantidad de falsos positivos.",
    "John Micco, Flaky Tests at Google and How We Mitigate Them, Google Testing Blog, 2016 · traducción del original en inglés",
    ROJO
  );
  addText(slide, "Falso positivo: un rojo que no indica ningún defecto.", { x: M, y: 5.74, w: CW, h: 0.24, fontSize: 9.8, italic: true, color: C.slate });

  addTakeaway(slide, "Una prueba inestable enseña a no creerle al rojo. Y el día que el rojo es real, nadie lo mira.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · La prueba nueva, con espera fija

function slideNewFlakyTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · pull request 2", "Una prueba útil, con el error de siempre", "", false, { titleFontSize: 28 });

  const wl = 7.2;
  const panel = codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "typescript",
    fontSize: 9.6,
    title: "e2e/pruebas/espera.spec.ts",
    marcas: [
      { linea: 4, color: ROJO, numero: 1 },
      { linea: 5, color: C.gold, numero: 2 },
    ],
    code: [
      'test("tras una reserva confirmada, el formulario queda vacío",',
      "  async ({ page }) => {",
      "  await reservarBloque4(page);",
      "  await page.waitForTimeout(300);",
      '  const nombre = await page.getByLabel("Nombre").inputValue();',
      '  expect(nombre).toBe("");',
      "});",
    ].join("\n"),
  });
  addText(slide, "reservarBloque4 llena el formulario y aprieta «Reservar». Después de una reserva confirmada, el formulario tiene que quedar vacío para la siguiente.", {
    x: M,
    y: 1.84 + panel.h + 0.1,
    w: wl,
    h: 0.6,
    fontSize: 10.4,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const notas = [
    [1, ROJO, "waitForTimeout(300)", "Espera 300 milisegundos, pase lo que pase."],
    [2, C.gold, "inputValue()", "Lee lo que tiene el campo en ese instante, una sola vez."],
  ];
  notas.forEach(([numero, color, pieza, glosa], index) => {
    const y = 1.84 + index * 0.96;
    rect(slide, xd, y, wd, 0.86, C.white);
    circulo(slide, xd + 0.3, y + 0.3, 0.28, color, numero, color === C.gold ? C.navy : C.white, 9.4);
    addText(slide, pieza, { x: xd + 0.56, y: y + 0.1, w: wd - 0.7, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10.4, bold: true, color: C.ink });
    addText(slide, glosa, { x: xd + 0.56, y: y + 0.4, w: wd - 0.7, h: 0.42, fontSize: 10, color: C.slate });
  });

  // Linea de tiempo: la espera fija contra la respuesta variable.
  const x0 = M;
  const ancho = CW;
  const escala = ancho / 500;
  const yT = 4.9;
  addKicker(slide, x0, yT - 0.34, "Una red simulada: cada respuesta tarda entre 0 y 400 milisegundos", AZUL, 10);
  rect(slide, x0, yT, 400 * escala, 0.4, C.softNeutral);
  addText(slide, "la respuesta llega en algún momento de esta franja, y recién ahí se vacía el formulario", { x: x0 + 0.14, y: yT + 0.04, w: 400 * escala - 0.3, h: 0.32, fontSize: 10, color: C.ink, valign: "mid" });
  const x300 = x0 + 300 * escala;
  slide.addShape(SH.line, { x: x300, y: yT - 0.14, w: 0, h: 0.8, line: { color: ROJO, pt: 2.4 } });
  addText(slide, "300 ms: la prueba lee", { x: x300 - 1.4, y: yT + 0.66, w: 2.8, h: 0.26, fontSize: 10.4, bold: true, color: ROJO, align: "center" });
  addText(slide, "0", { x: x0, y: yT + 0.44, w: 0.4, h: 0.2, fontFace: TYPOGRAPHY.mono, fontSize: 8.6, color: C.slate });
  addText(slide, "400 ms", { x: x0 + 400 * escala - 0.6, y: yT + 0.44, w: 0.6, h: 0.2, fontFace: TYPOGRAPHY.mono, fontSize: 8.6, color: C.slate, align: "right" });

  addTakeaway(slide, "Si la respuesta llega antes de 300 ms, pasa. Si llega después, falla. Nada del código cambió.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · Mismo commit, dos resultados

function slideSameCommitTwoResults() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la firma de la inestable", "El mismo commit, un rojo y un verde", "", false, { titleFontSize: 28 });

  const wl = 6.4;
  captura(slide, "historialInestable", { x: M, y: 1.84, w: wl, hMax: 3.96, pie: "Historial de la rama del pull request 2. Las dos filas de abajo son el mismo commit." });

  const xd = M + wl + 0.4;
  const wd = CW - wl - 0.4;
  const w2 = (wd - 0.2) / 2;
  [
    ["por push", "fail", "La prueba falló en Chromium", 0],
    ["por pull_request", "ok", "La prueba pasó", 1],
  ].forEach(([evento, estado, glosa, index]) => {
    const x = xd + index * (w2 + 0.2);
    rect(slide, x, 1.84, w2, 1.7, estado === "ok" ? C.white : C.warm);
    rect(slide, x, 1.84, w2, 0.08, estado === "ok" ? VERDE : ROJO);
    circulo(slide, x + w2 / 2, 2.42, 0.62, estado === "ok" ? VERDE : ROJO, estado === "ok" ? "✓" : "✗", C.white, 20);
    addText(slide, evento, { x: x + 0.1, y: 2.84, w: w2 - 0.2, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10.4, bold: true, color: C.ink, align: "center" });
    addText(slide, glosa, { x: x + 0.1, y: 3.12, w: w2 - 0.2, h: 0.36, fontSize: 9.8, color: C.slate, align: "center" });
  });
  rect(slide, xd, 3.74, wd, 1.9, NAVY_CHIP);
  addText(slide, "Mismo código, mismo servidor, mismos comandos. Quien viera solo el rojo creería que la prueba encontró un defecto; quien viera solo el verde creería que todo está bien.", {
    x: xd + 0.26,
    y: 3.82,
    w: wd - 0.44,
    h: 1.74,
    fontSize: 12,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "La ejecución doble del bloque anterior, que parecía un desperdicio, dejó a la vista la inestable.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 42 · Reintentar: las tres categorias

function slideRetries() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · reintentar", "Playwright distingue tres resultados", "", false, { titleFontSize: 28 });

  const w = (CW - 0.4) / 3;
  const categorias = [
    ["passed", "Pasó en el primer intento.", [["intento 1", "ok"]], VERDE],
    ["flaky", "Falló en el primer intento y pasó al reintentarla.", [["intento 1", "fail"], ["reintento 1", "ok"]], ORO],
    ["failed", "Falló en el primer intento y en todos los reintentos.", [["intento 1", "fail"], ["reintento 1", "fail"], ["reintento 2", "fail"]], ROJO],
  ];
  categorias.forEach(([nombre, glosa, intentos, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 1.86, w, 2.72, C.white);
    rect(slide, x, 1.86, w, 0.08, color);
    addText(slide, nombre, { x: x + 0.26, y: 2.02, w: w - 0.5, h: 0.5, fontFace: TYPOGRAPHY.mono, fontSize: 22, bold: true, color });
    addText(slide, glosa, { x: x + 0.26, y: 2.56, w: w - 0.5, h: 0.56, fontSize: 10.8, color: C.ink, lineSpacingMultiple: 1.04 });
    tiraEstado(slide, { x: x + 0.2, y: 3.18, w: w - 0.4, trabajos: intentos, fila: 0.36, fontSize: 9.6 });
  });
  addFuente(slide, 4.72, "Playwright, Retries · las tres categorías, traducidas del original en inglés", { w: 9 });

  const wl = 5.6;
  codigo(slide, {
    x: M,
    y: 5.04,
    w: wl,
    lang: "typescript",
    fontSize: 10.4,
    title: "e2e/playwright.config.ts",
    code: "  retries: process.env.CI ? 2 : 0,",
  });
  addText(slide, "Por omisión no reintenta nada. CI es una variable de entorno que GitHub Actions define en sus servidores: con ella, hasta dos reintentos; en tu máquina, ninguno. condición ? sí : no elige entre dos valores.", {
    x: M + wl + 0.3,
    y: 5.04,
    w: CW - wl - 0.3,
    h: 1.0,
    fontSize: 10.4,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 43 · 3 flaky, y en verde

function slideFlakyButGreen() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · lo que pasó con reintentos", "3 flaky, y el pipeline en verde", "", false);

  terminal(slide, {
    x: M,
    y: 1.84,
    w: CW,
    title: "Pruebas de extremo a extremo · ejecución por push, con retries: 2",
    fontSize: 9.6,
    lines: [
      { t: "  ✘   5 [chromium] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (888ms)", k: "err" },
      { t: "  ✓   6 [chromium] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (1.2s)", k: "ok" },
      { t: "  ✘  16 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (1.7s)", k: "err" },
      { t: "  ✓  17 [firefox] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (2.9s)", k: "ok" },
      { t: "  ✘  27 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (1.9s)", k: "err" },
      { t: "  ✓  28 [webkit] › pruebas/espera.spec.ts:26:5 › tras una reserva confirmada, el formulario queda vacío (retry #1) (1.6s)", k: "ok" },
      { t: "  3 flaky", k: "err" },
      { t: "  27 passed (1.3m)", k: "ok" },
    ],
  });

  const w = (CW - 0.2) / 2;
  rect(slide, M, 4.28, w, 1.6, C.white);
  rect(slide, M, 4.28, 0.06, 1.6, VERDE);
  addText(slide, "Lo bueno", { x: M + 0.26, y: 4.38, w: w - 0.4, h: 0.28, fontSize: 12, bold: true, color: VERDE });
  addText(slide, "La salida ya no confunde la inestable con un defecto ni con un verde limpio: la llama por su nombre, flaky.", {
    x: M + 0.26,
    y: 4.7,
    w: w - 0.44,
    h: 1.1,
    fontSize: 11,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  rect(slide, M + w + 0.2, 4.28, w, 1.6, C.warm);
  rect(slide, M + w + 0.2, 4.28, 0.06, 1.6, ROJO);
  addText(slide, "El problema", { x: M + w + 0.46, y: 4.38, w: w - 0.4, h: 0.28, fontSize: 12, bold: true, color: ROJO });
  addText(slide, "El pipeline terminó en verde. Los reintentos avisaron y dejaron pasar. Y la ejecución por pull request del mismo commit ni la mostró.", {
    x: M + w + 0.46,
    y: 4.7,
    w: w - 0.44,
    h: 1.1,
    fontSize: 11,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(slide, "Un equipo apurado no lee la línea 3 flaky: lee el verde.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 44 · Reintentos que esconden

function slideRetriesThatHide() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · la herramienta que esconde", "Reintentar para «eliminar» la falla", "", false, { titleFontSize: 28 });

  terminal(slide, {
    x: M,
    y: 1.86,
    w: CW,
    title: "pytest --help · con el complemento pytest-rerunfailures 16.7",
    fontSize: 10.6,
    lines: [
      { t: "re-run failing tests to eliminate flaky failures:", k: "plain" },
      { t: "  --reruns=RERUNS       number of times to re-run failed tests. defaults to 0.", k: "muted" },
    ],
  });
  addText(slide, "En español: volver a ejecutar las pruebas que fallan para eliminar las fallas inestables. pytest no reintenta por sí mismo; este complemento es el más usado.", {
    x: M,
    y: 3.06,
    w: CW,
    h: 0.5,
    fontSize: 11,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.06,
  });
  rect(slide, M, 3.7, CW, 0.66, NAVY_CHIP);
  addText(slide, "Eliminar la falla no elimina la inestabilidad: la esconde.", { x: M + 0.3, y: 3.74, w: CW - 0.6, h: 0.58, fontSize: 15, bold: true, color: C.white, valign: "mid" });

  addQuote(
    slide,
    M,
    4.54,
    CW,
    1.34,
    "Tenemos una forma de marcar una prueba como inestable, con la que solo informa una falla si falla tres veces seguidas. Eso reduce los falsos positivos, pero anima a ignorar la inestabilidad de las propias pruebas mientras no fallen tres veces seguidas, lo que dista de ser una solución perfecta.",
    "John Micco, Flaky Tests at Google, 2016 · traducción del original en inglés",
    ROJO
  );

  addTakeaway(slide, "Un reintento que no informa convierte la suite en un sorteo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 45 · Que la inestable bloquee

function slideFailOnFlaky() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · que bloquee", "Una prueba inestable no entra", "", false);

  const wl = 5.6;
  codigo(slide, {
    x: M,
    y: 1.84,
    w: wl,
    lang: "typescript",
    fontSize: 10.4,
    title: "e2e/playwright.config.ts",
    marcas: [{ linea: 2, color: VERDE, numero: 1 }],
    code: ["  retries: process.env.CI ? 2 : 0,", "  failOnFlakyTests: !!process.env.CI,"].join("\n"),
  });
  addText(slide, "failOnFlakyTests hace fallar la ejecución si alguna prueba resultó inestable. !! convierte la variable en verdadero si existe y en falso si no.", {
    x: M,
    y: 3.0,
    w: wl,
    h: 0.8,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.06,
  });
  rect(slide, M, 3.96, wl, 1.2, NAVY_CHIP);
  addText(slide, "Los reintentos siguen distinguiendo una inestable de una que falla siempre. El mensaje pasa a ser: «esta prueba no es confiable, y así no entra».", {
    x: M + 0.24,
    y: 4.02,
    w: wl - 0.44,
    h: 1.08,
    fontSize: 11.4,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.08,
  });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  terminal(slide, {
    x: xd,
    y: 1.84,
    w: wd,
    title: "Ejecución por pull_request, con failOnFlakyTests",
    fontSize: 8.8,
    lines: [
      { t: "✘ 15 [firefox] › … formulario queda vacío (1.9s)", k: "err" },
      { t: "✘ 16 [firefox] › … formulario queda vacío (retry #1)", k: "err" },
      { t: "✓ 17 [firefox] › … formulario queda vacío (retry #2)", k: "ok" },
      { t: "✘ 27 [webkit] › … formulario queda vacío (2.1s)", k: "err" },
      { t: "✘ 28 [webkit] › … formulario queda vacío (retry #1)", k: "err" },
      { t: "✓ 29 [webkit] › … formulario queda vacío (retry #2)", k: "ok" },
      { t: "2 flaky", k: "err" },
      { t: "28 passed (1.5m)", k: "ok" },
    ],
  });
  addText(slide, "Se abreviaron la ruta y el título de la prueba, marcados con …, para que quepan.", { x: xd, y: 4.28, w: wd, h: 0.24, fontSize: 9, italic: true, color: C.slate });
  tiraEstado(slide, {
    x: xd,
    y: 4.6,
    w: wd,
    trabajos: [["Pruebas de extremo a extremo", "fail", "2 flaky → rojo"]],
    fila: 0.46,
    fontSize: 10.6,
    fontDetalle: 9.4,
  });

  addTakeaway(slide, "Esta vez, rojo. En Firefox y WebKit falló dos veces y pasó recién al tercer intento.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 46 · No siempre se deja ver

function slideNotAlwaysVisible() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el límite de la configuración", "Cuando por azar pasa, entra igual", "", false, { titleFontSize: 28 });

  const w = (CW - 0.4) / 2;
  const ejecuciones = [
    [M, "Mismo commit · por pull_request", [["Extremo a extremo", "fail", "2 flaky"]], "Los reintentos la vieron fallar, y el bloqueo la detuvo.", C.warm],
    [M + w + 0.4, "Mismo commit · por push", [["Extremo a extremo", "ok", "30 passed"]], "Pasó al primer intento en los tres navegadores. Nada que ver, nada que bloquear.", C.white],
  ];
  ejecuciones.forEach(([x, titulo, trabajos, glosa, fondo]) => {
    rect(slide, x, 1.94, w, 2.4, fondo);
    addKicker(slide, x + 0.28, 2.1, titulo, C.slate, w - 0.5);
    tiraEstado(slide, { x: x + 0.28, y: 2.44, w: w - 0.56, trabajos, fila: 0.5, fontSize: 11.4, fontDetalle: 10 });
    addText(slide, glosa, { x: x + 0.28, y: 3.2, w: w - 0.56, h: 1.0, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.08 });
  });

  rect(slide, M, 4.56, CW, 1.32, NAVY_CHIP);
  addText(slide, "Los reintentos y el bloqueo atrapan una inestable cuando falla. Detectarla en el pipeline es una cuestión de probabilidad: la configuración no demuestra que una prueba sea confiable.", {
    x: M + 0.34,
    y: 4.64,
    w: CW - 0.68,
    h: 1.16,
    fontSize: 13,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Para saber si una prueba es inestable hay que medirla.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 47 · Medir

function slideMeasureFlaky() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · medir", "7 de 20: falla un 35 % de las veces", "", false, { titleFontSize: 28 });

  terminal(slide, {
    x: M,
    y: 1.84,
    w: CW,
    title: "La misma prueba, 20 veces seguidas, sin reintentos",
    fontSize: 10.2,
    lines: [{ t: 'npx playwright test pruebas/espera.spec.ts -g "formulario" --project chromium --repeat-each 20 --retries 0', k: "cmd" }],
  });
  addText(slide, "--repeat-each 20 la repite 20 veces · --retries 0 cuenta cada falla tal como ocurre · -g elige por título · --project, un navegador", {
    x: M,
    y: 2.76,
    w: CW,
    h: 0.24,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
  });

  const resultados = [...Array(13).fill(true), ...Array(7).fill(false)];
  addKicker(slide, M, 3.22, "Una tanda de 20, en una máquina local · las dos tandas dieron 7 fallas", AZUL, 10);
  const lado = (CW - 0.1 * 19) / 20;
  resultados.forEach((paso, index) => {
    const x = M + index * (lado + 0.1);
    slide.addText(paso ? "✓" : "✗", {
      shape: SH.rect,
      x,
      y: 3.54,
      w: lado,
      h: lado,
      fill: { color: paso ? VERDE : ROJO },
      line: { color: paso ? VERDE : ROJO },
      fontFace: TYPOGRAPHY.body,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      margin: 0,
    });
  });
  addText(slide, "13 pasaron y 7 fallaron, agrupados. La salida solo da el conteo, no el orden.", {
    x: M,
    y: 3.62 + lado,
    w: CW,
    h: 0.22,
    fontSize: 9,
    italic: true,
    color: C.slate,
  });

  const w = (CW - 0.3) / 2;
  terminal(slide, {
    x: M,
    y: 4.66,
    w,
    title: "El resumen",
    fontSize: 10.4,
    lines: [
      { t: "  7 failed", k: "err" },
      { t: "  13 passed (54.3s)", k: "ok" },
    ],
  });
  terminal(slide, {
    x: M + w + 0.3,
    y: 4.66,
    w,
    title: "Cada falla dice lo mismo",
    fontSize: 10.4,
    lines: [
      { t: '    Expected: ""', k: "muted" },
      { t: '    Received: "Ana Rivas"', k: "err" },
    ],
  });

  addTakeaway(slide, "La prueba leyó el campo antes de que llegara la respuesta del servidor.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 48 · Corregir

function slideFixFlaky() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · corregir", "Esperar la condición, no un tiempo", "", false);

  const w = (CW - 0.4) / 2;
  codigo(slide, {
    x: M,
    y: 1.84,
    w,
    lang: "typescript",
    fontSize: 9.6,
    title: "Antes: espera un tiempo y lee una vez",
    marcas: [{ linea: 1, color: ROJO, numero: 1 }],
    code: ["await page.waitForTimeout(300);", 'const nombre = await page.getByLabel("Nombre").inputValue();', 'expect(nombre).toBe("");'].join("\n"),
  });
  codigo(slide, {
    x: M + w + 0.4,
    y: 1.84,
    w,
    lang: "typescript",
    fontSize: 9.6,
    title: "Después: espera hasta que el campo esté vacío",
    marcas: [{ linea: 1, color: VERDE, numero: 2 }],
    code: 'await expect(page.getByLabel("Nombre")).toHaveValue("");',
  });
  arrow(slide, M + w + 0.06, 2.6, 0.3, C.slate, 2);
  addText(slide, "toHaveValue vuelve a mirar el campo hasta que esté vacío o hasta que se acabe el plazo de Playwright, cinco segundos por omisión. Solo falla en el segundo caso.", {
    x: M,
    y: 3.24,
    w: CW,
    h: 0.56,
    fontSize: 11.4,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });

  addKicker(slide, M, 3.96, "20 ejecuciones en cada navegador, sin reintentos", VERDE, 8);
  const navegadores = [
    ["Chromium", "20 passed (55.1s)"],
    ["Firefox", "20 passed (2.0m)"],
    ["WebKit", "20 passed (57.4s)"],
  ];
  const wn = (CW - 0.4) / 3;
  navegadores.forEach(([nombre, salida], index) => {
    const x = M + index * (wn + 0.2);
    rect(slide, x, 4.28, wn, 1.0, C.white);
    rect(slide, x, 4.28, 0.06, 1.0, VERDE);
    addText(slide, nombre, { x: x + 0.24, y: 4.36, w: wn - 0.4, h: 0.3, fontSize: 12.4, bold: true, color: C.ink });
    addText(slide, salida, { x: x + 0.24, y: 4.72, w: wn - 0.4, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 11.4, bold: true, color: VERDE });
  });
  tiraEstado(slide, {
    x: M,
    y: 5.44,
    w: CW,
    trabajos: [["Pull request 2, con la corrección: sus dos ejecuciones", "ok", "30 passed · ninguna inestable · integrado"]],
    fila: 0.42,
    fontSize: 11,
    fontDetalle: 10,
  });

  addTakeaway(slide, "El proyecto ganó una prueba de regresión y una regla: una prueba inestable no entra.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 49 · La que no se puede corregir hoy

function slideQuarantine() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 3 · el caso difícil", "La inestable que no se puede corregir hoy", "", false, { titleFontSize: 28 });

  addQuote(
    slide,
    M,
    1.84,
    CW,
    1.3,
    "La cuarentena saca la prueba del camino crítico y registra un error para que se reduzca su inestabilidad. Eso evita que se convierta en un problema para el equipo, pero podría esconder fácilmente una condición de carrera real u otro defecto del código que se prueba.",
    "John Micco, Flaky Tests at Google, 2016 · traducción del original en inglés",
    ORO
  );
  addText(slide, "Condición de carrera: el defecto de la doble reserva del lunes, donde el resultado depende de qué operación llega primero. Una prueba que pasa y falla puede estar señalando justo eso. El camino crítico son las revisiones que bloquean los cambios.", {
    x: M,
    y: 3.22,
    w: CW,
    h: 0.5,
    fontSize: 10.4,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  addKicker(slide, M, 3.9, "Si se deja pendiente, se registra · instrucciones de la Evaluación Final, sección 3.B", ROJO, 11);
  const cols = [
    ["Cuál es", "«tras una reserva confirmada, el formulario queda vacío»"],
    ["Con qué frecuencia falla", "7 de 20 en Chromium, dos tandas"],
    ["Qué se investigó", "Espera fija de 300 ms contra una respuesta de hasta 400 ms"],
    ["Qué se decidió", "Corregida con toHaveValue; 20 de 20 en los tres navegadores"],
  ];
  const w = (CW - 0.3) / 4;
  cols.forEach(([titulo, valor], index) => {
    const x = M + index * (w + 0.1);
    rect(slide, x, 4.2, w, 0.36, NAVY_CHIP);
    addText(slide, titulo.toUpperCase(), { x: x + 0.12, y: 4.24, w: w - 0.24, h: 0.28, fontSize: 8.6, bold: true, color: C.white, charSpacing: 0.6, valign: "mid" });
    rect(slide, x, 4.6, w, 1.1, index === 3 ? C.warm : C.white);
    addText(slide, valor, { x: x + 0.12, y: 4.66, w: w - 0.24, h: 0.98, fontSize: 10.4, color: C.ink, lineSpacingMultiple: 1.06 });
  });

  addTakeaway(slide, "Una inestable pendiente, igual que un rojo conocido, no se esconde: se registra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 50 y 51 · Preguntas y respuestas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes de proteger", [
    [
      "El pull request número 2 tuvo, sobre el mismo commit, un pipeline en rojo y uno en verde. ¿Cuál de los dos decía la verdad sobre la prueba?",
      "Piensa qué afirma cada ejecución por separado y qué afirman las dos juntas. ¿Qué concluiría alguien que vio solo una?",
    ],
    [
      "Con retries: 2, el pipeline quedó en verde y la salida decía 3 flaky. Un compañero propone dejarlo así, porque «igual pasa». ¿Qué le falta a esa decisión?",
      "Relee lo que cuenta Google sobre las pruebas que solo fallan tres veces seguidas. ¿Qué pasa el día que falle por un defecto real?",
    ],
    [
      "Con failOnFlakyTests, una ejecución bloqueó la prueba y otra, sobre el mismo commit, la dejó pasar. ¿Sirve de algo la opción, si no la atrapa siempre?",
      "Compara lo que hace la configuración con lo que hizo --repeat-each. ¿Cuál permite afirmar que una prueba no es inestable?",
    ],
  ]);
}

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "Las dos juntas",
      "Por separado, cada una decía algo falso: un defecto o un verde limpio.",
      "Dos resultados del mismo código son la firma de una inestable.",
      "Mirar una sola ejecución y sacar conclusiones.",
    ],
    [
      "Le falta corregirla",
      "Un verde con 3 flaky enseña a ignorar la inestabilidad.",
      "El día que falle por un defecto real, nadie le va a creer.",
      "Aceptar el reintento como solución.",
    ],
    [
      "Sirve, pero no demuestra",
      "Bloquea cuando la ve; cuando pasa por azar, entra igual.",
      "Solo medir repitiendo dice si una prueba es confiable.",
      "Creer que un pipeline en verde prueba que no hay inestables.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 52 · Divisor del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 4 de 4 · 20 minutos", C.gold, 5);
  addText(slide, "Qué protege el pipeline", { x: M, y: 1.98, w: 11.2, h: 1.5, fontFace: TYPOGRAPHY.display, fontSize: 44, bold: true, color: C.white });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Un agente introduce defectos a propósito, como describe la sección 6 de las instrucciones de la Evaluación Final. Uno lo atrapa la suite; el otro pasa en verde.",
    { x: M, y: 3.94, w: 10.2, h: 0.86, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.2 }
  );
  addRuta(slide, 4, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 53 · El ensayo

function slideRehearsal() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el ensayo", "Un defecto a propósito, por un pull request", "", false, { titleFontSize: 28 });

  addQuote(
    slide,
    M,
    1.84,
    CW,
    1.06,
    "Durante la defensa se abre un pull request con un defecto introducido en tu sistema. Se observa qué hace tu pipeline: si lo bloquea, en qué etapa, y si el resultado permite entender qué se rompió sin abrir el código.",
    "Instrucciones de la Evaluación Final, sección 6",
    ROJO
  );

  const w = (CW - 0.4) / 3;
  const preguntas = [
    ["¿Lo bloquea?", "¿El pipeline se pone en rojo?"],
    ["¿En qué etapa?", "¿Qué trabajo lo atrapa?"],
    ["¿Se entiende?", "¿La salida dice qué se rompió sin abrir el código?"],
  ];
  preguntas.forEach(([pregunta, glosa], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 3.06, w, 1.06, C.white);
    rect(slide, x, 3.06, w, 0.06, AZUL);
    addText(slide, pregunta, { x: x + 0.24, y: 3.2, w: w - 0.44, h: 0.4, fontFace: TYPOGRAPHY.display, fontSize: 17, bold: true, color: AZUL });
    addText(slide, glosa, { x: x + 0.24, y: 3.62, w: w - 0.44, h: 0.44, fontSize: 10.6, color: C.ink });
  });

  addKicker(slide, M, 4.34, "Las reglas del defecto, según las mismas instrucciones", C.slate, 8);
  const reglas = ["Lo genera un agente", "Sale de un catálogo fijo", "Es un solo cambio", "Toca algo que declaraste", "Altera algo observable"];
  const wr = (CW - 0.14 * 4) / 5;
  reglas.forEach((regla, index) => {
    const x = M + index * (wr + 0.14);
    rect(slide, x, 4.64, wr, 0.74, C.warm);
    addText(slide, regla, { x: x + 0.14, y: 4.68, w: wr - 0.28, h: 0.66, fontSize: 11, bold: true, color: C.ink, align: "center", valign: "mid", lineSpacingMultiple: 1.04 });
  });

  addTakeaway(slide, "Se ensaya aquí, en el proyecto de la clase. Y esta noche, en el tuyo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 54 · El pedido al agente

function slideDefectRequest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el pedido", "Un catálogo fijo y un solo cambio", "", false);

  const panel = codigo(slide, {
    x: M,
    y: 1.84,
    w: CW,
    lang: "bash",
    fontSize: 9,
    title: "Terminal · con permiso para leer y editar, sin permiso para ejecutar",
    marcas: [
      { linea: 5, color: C.gold, numero: 1 },
      { linea: 10, color: C.gold, numero: 2 },
      { linea: 16, color: VERDE, numero: 3 },
    ],
    code: [
      'claude -p "Vas a introducir un defecto en este proyecto para comprobar si su pipeline de',
      "integracion continua lo detecta.",
      "",
      "Reglas:",
      "1. Elige UN tipo de defecto de este catalogo fijo:",
      "   a) invertir o desplazar una comparacion (por ejemplo < por <=, o > por >=);",
      "   b) cambiar un numero limite de una regla;  c) quitar una validacion;",
      "   d) cambiar el valor que devuelve una funcion;  e) cambiar el codigo de respuesta de la API.",
      "2. El defecto debe tocar un comportamiento que declara REQUISITOS.md, y debe cambiar lo que el",
      "   sistema hace de forma observable.",
      "3. Haz exactamente un cambio, en el codigo de la aplicacion. No modifiques pruebas, configuracion",
      "   ni documentacion.",
      "4. Solo puedes leer y editar archivos; no puedes ejecutar nada.",
      "",
      "Al terminar, responde en una sola linea: el archivo que cambiaste y la letra del catalogo que",
      'usaste. No expliques que requisito rompiste." --allowed-tools "Read,Grep,Glob,Edit"',
    ].join("\n"),
  });
  addText(slide, "Los tipos b y c, y d y e, van de a dos por línea para que quepan; en el pedido original van uno por línea. claude -p le entrega el pedido al agente; --allowed-tools solo le permite leer, buscar y editar. El pedido va sin tildes porque se escribió así en la terminal.", {
    x: M,
    y: 1.84 + panel.h + 0.1,
    w: CW,
    h: 0.5,
    fontSize: 9.8,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 55 · Defecto 1

function slideDefectOne() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · defecto 1 · pull request 3", "Un carácter, y el bloque 8 desaparece", "", false, { titleFontSize: 27 });

  terminal(slide, {
    x: M,
    y: 1.84,
    w: 4.2,
    title: "La respuesta del agente",
    fontSize: 11,
    lines: [{ t: "reservas.py — a", k: "plain" }],
  });
  codigo(slide, {
    x: M + 4.4,
    y: 1.84,
    w: CW - 4.4,
    lang: "diff",
    fontSize: 10.6,
    title: "El cambio, en reservas.py",
    code: [
      " def bloque_valido(bloque: int) -> bool:",
      "-    return BLOQUE_MIN <= bloque <= BLOQUE_MAX",
      "+    return BLOQUE_MIN <= bloque < BLOQUE_MAX",
    ].join("\n"),
  });

  const escala = (CW - 1.4) / 8;
  const x0 = M + 0.7;
  addKicker(slide, M, 3.34, "Los ocho bloques que declara RF-01, con el cambio", AZUL, 8);
  for (let b = 1; b <= 8; b += 1) {
    const x = x0 + (b - 1) * escala;
    const valido = b < 8;
    slide.addText(`Bloque ${b}`, {
      shape: SH.rect,
      x: x + 0.05,
      y: 3.66,
      w: escala - 0.1,
      h: 0.7,
      fill: { color: valido ? VERDE : ROJO },
      line: { color: valido ? VERDE : ROJO },
      fontFace: TYPOGRAPHY.body,
      fontSize: 11,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      margin: 0,
    });
  }
  addText(slide, "bloque_valido(8) ahora devuelve False", { x: x0 + 7 * escala - 1.6, y: 4.44, w: escala + 1.6, h: 0.26, fontFace: TYPOGRAPHY.mono, fontSize: 10, bold: true, color: ROJO, align: "right" });

  rect(slide, M, 4.94, CW, 0.96, NAVY_CHIP);
  addText(slide, "Un defecto de valor límite: el sistema sigue funcionando para casi todo, y falla exactamente en el borde. La jornada pasa a tener siete bloques.", {
    x: M + 0.3,
    y: 5.0,
    w: CW - 0.6,
    h: 0.84,
    fontSize: 12.6,
    bold: true,
    color: C.white,
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Catálogo a: desplazar una comparación. Toca RF-01, que el proyecto declara.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 56 · Las tres preguntas, respondidas

function slideDefectOneAnswers() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · defecto 1 · cómo se lee", "Las tres preguntas, con lo que mostró el pipeline", "", false, { titleFontSize: 27 });

  const wl = 5.3;
  captura(slide, "pr3Recorte", { x: M, y: 1.84, w: wl, pie: "La ejecución del pull request 3, en GitHub." });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  const respuestas = [
    ["¿Lo bloquea?", "Lo detecta: un trabajo en rojo.", "Si además impide integrar, es otra cosa."],
    ["¿En qué etapa?", "Pruebas de Python.", "Los estáticos no podían verlo; ninguna de extremo a extremo reserva el bloque 8."],
  ];
  respuestas.forEach(([pregunta, respuesta, detalle], index) => {
    const y = 1.84 + index * 1.06;
    rect(slide, xd, y, wd, 0.96, C.white);
    rect(slide, xd, y, 0.06, 0.96, AZUL);
    addText(slide, pregunta, { x: xd + 0.24, y: y + 0.06, w: 1.9, h: 0.3, fontSize: 11.4, bold: true, color: AZUL });
    addText(slide, respuesta, { x: xd + 2.1, y: y + 0.06, w: wd - 2.3, h: 0.3, fontSize: 11.4, bold: true, color: C.ink });
    addText(slide, detalle, { x: xd + 0.24, y: y + 0.42, w: wd - 0.44, h: 0.5, fontSize: 9.8, color: C.slate, lineSpacingMultiple: 1.02 });
  });
  addText(slide, "¿Se entiende sin abrir el código?", { x: xd, y: 4.02, w: wd, h: 0.28, fontSize: 11.4, bold: true, color: AZUL });
  terminal(slide, {
    x: xd,
    y: 4.34,
    w: wd,
    title: "Pruebas de Python",
    fontSize: 8.8,
    lines: [
      { t: "___ test_limites_del_requisito[ultimo] ___", k: "muted" },
      { t: "E       assert False is True", k: "err" },
      { t: "E        +  where False = bloque_valido(8)", k: "err" },
      { t: "2 failed, 22 passed, 1 xfailed, 1 warning", k: "err" },
    ],
  });

  addTakeaway(slide, "Sí: lo dicen el nombre de la prueba de valores límite y el valor 8. El pipeline muestra lo que la suite sabe decir.", {
    fontSize: 12.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 57 · El defecto del propio pipeline

function slidePipelineOwnDefect() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · un rojo del pipeline", "La opción del bloque 2 escondía las fallas", "", false, { titleFontSize: 27 });

  const w = (CW - 0.4) / 2;
  terminal(slide, {
    x: M,
    y: 1.86,
    w,
    title: "Con -rxX · el resumen final",
    fontSize: 9.2,
    lines: [
      { t: "short test summary info", k: "muted" },
      { t: "XFAIL test_seguridad.py::test_otra_persona_...", k: "muted" },
      { t: "", k: "plain" },
      { t: "(las dos que fallaron no aparecen)", k: "err" },
    ],
  });
  terminal(slide, {
    x: M + w + 0.4,
    y: 1.86,
    w,
    title: "Con -rfExX · el resumen final",
    fontSize: 9.2,
    lines: [
      { t: "FAILED test_reservas.py::test_limites_del_requisito[ultimo]", k: "err" },
      { t: "FAILED test_reservas.py::test_regla_permitida_incluye_el_bloque_8", k: "err" },
      { t: "XFAIL test_seguridad.py::test_otra_persona_...", k: "muted" },
    ],
  });
  addText(slide, "La línea XFAIL se abrevió con … para que quepa. La línea entre paréntesis es una nota, no parte de la salida.", {
    x: M,
    y: 3.34,
    w: CW,
    h: 0.24,
    fontSize: 9.4,
    italic: true,
    color: C.slate,
  });

  const letras = [
    ["f", "fallas", "del resumen por omisión"],
    ["E", "errores", "del resumen por omisión"],
    ["x", "fallas esperadas", "lo que se quería agregar"],
    ["X", "pasaron inesperadamente", "lo que se quería agregar"],
  ];
  const wl = (CW - 0.36) / 4;
  letras.forEach(([letra, que, origen], index) => {
    const x = M + index * (wl + 0.12);
    rect(slide, x, 3.76, wl, 1.2, index < 2 ? C.warm : C.white);
    addText(slide, letra, { x: x + 0.2, y: 3.84, w: 0.6, h: 0.6, fontFace: TYPOGRAPHY.mono, fontSize: 28, bold: true, color: index < 2 ? ROJO : AZUL });
    addText(slide, que, { x: x + 0.86, y: 3.9, w: wl - 1.0, h: 0.5, fontSize: 11.4, bold: true, color: C.ink, lineSpacingMultiple: 1.02 });
    addText(slide, origen, { x: x + 0.86, y: 4.42, w: wl - 1.0, h: 0.46, fontSize: 9.6, italic: true, color: C.slate });
  });
  addText(slide, "-r no suma letras al resumen por omisión: lo reemplaza. -rxX había sacado f y E; -rfExX las devuelve.", {
    x: M,
    y: 5.12,
    w: CW,
    h: 0.5,
    fontSize: 11.4,
    color: C.ink,
  });

  addTakeaway(slide, "La configuración del pipeline es código, y sus defectos aparecen usándola.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 58 · Rojo que no impide

function slideRedDoesNotBlock() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la rama principal", "Un rojo avisa; no impide nada por sí solo", "", false, { titleFontSize: 27 });

  const estados = [
    ["UNSTABLE", "Sin proteger la rama", "Hay revisiones en rojo, y el botón para integrar sigue disponible. Quien tenga apuro, integra.", ORO],
    ["BLOCKED", "Con la rama protegida", "No se puede integrar mientras las revisiones obligatorias estén en rojo.", ROJO],
  ];
  const w = (CW - 1.0) / 2;
  estados.forEach(([estado, cuando, glosa, color], index) => {
    const x = M + index * (w + 1.0);
    rect(slide, x, 1.9, w, 2.1, index === 1 ? C.warm : C.white);
    rect(slide, x, 1.9, w, 0.08, color);
    addKicker(slide, x + 0.28, 2.08, `Pull request 3 · ${cuando}`, C.slate, w - 0.5);
    addText(slide, estado, { x: x + 0.28, y: 2.38, w: w - 0.5, h: 0.64, fontFace: TYPOGRAPHY.mono, fontSize: 28, bold: true, color });
    addText(slide, glosa, { x: x + 0.28, y: 3.1, w: w - 0.5, h: 0.84, fontSize: 11.4, color: C.ink, lineSpacingMultiple: 1.08 });
  });
  arrow(slide, M + w + 0.2, 2.95, 0.6, C.slate, 2.4);

  addKicker(slide, M, 4.22, "Settings → Branches · una regla de protección para main", AZUL, 9);
  const piezas = [
    ["Revisiones obligatorias", "Los cuatro trabajos: estáticos, Python, extremo a extremo y vulnerabilidades. Aparecen para elegir después de la primera ejecución."],
    ["También para quien administra", "Una regla que el dueño se puede saltar no protege del dueño apurado."],
  ];
  const wp = (CW - 0.2) / 2;
  piezas.forEach(([titulo, glosa], index) => {
    const x = M + index * (wp + 0.2);
    rect(slide, x, 4.52, wp, 1.36, C.white);
    rect(slide, x, 4.52, 0.06, 1.36, AZUL);
    addText(slide, titulo, { x: x + 0.26, y: 4.6, w: wp - 0.4, h: 0.3, fontSize: 12, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.26, y: 4.94, w: wp - 0.44, h: 0.88, fontSize: 10.6, color: C.slate, lineSpacingMultiple: 1.06 });
  });

  addTakeaway(slide, "Para que un rojo impida integrar, la rama principal se protege.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 59 · Push directo rechazado

function slideDirectPushRejected() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · la consecuencia", "Nadie sube cambios directamente a main", "", false, { titleFontSize: 28 });

  terminal(slide, {
    x: M,
    y: 1.9,
    w: CW,
    title: "git push, directo a main, desde la cuenta dueña del repositorio",
    fontSize: 11,
    lines: [
      { t: "remote: error: GH006: Protected branch update failed for refs/heads/main.", k: "err" },
      { t: "remote:", k: "muted" },
      { t: "remote: - 4 of 4 required status checks are expected.", k: "err" },
      { t: " ! [remote rejected] main -> main (protected branch hook declined)", k: "err" },
    ],
  });
  addText(slide, "En español: falló la actualización de la rama protegida; se esperan las cuatro revisiones obligatorias.", {
    x: M,
    y: 3.62,
    w: CW,
    h: 0.28,
    fontSize: 11,
    italic: true,
    color: C.slate,
  });

  const pasos = ["Rama propia", "Pull request", "Pipeline", "Integrar solo en verde"];
  const w = (CW - 0.3 * 3) / 4;
  pasos.forEach((paso, index) => {
    const x = M + index * (w + 0.3);
    slide.addText(paso, {
      shape: SH.rect,
      x,
      y: 4.2,
      w,
      h: 0.9,
      fill: { color: index === 3 ? VERDE : NAVY_CHIP },
      line: { color: index === 3 ? VERDE : NAVY_CHIP },
      fontFace: TYPOGRAPHY.body,
      fontSize: 13,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      margin: 0,
    });
    if (index < 3) arrow(slide, x + w + 0.04, 4.65, 0.22, C.slate, 2);
  });

  addTakeaway(slide, "Todo cambio entra por un pull request, y todo pull request pasa por el pipeline.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 60 · Defecto 2: todo verde

function slideDefectTwo() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · defecto 2 · pull request 4", "Un defecto real, y todo en verde", "", false, { titleFontSize: 28 });

  codigo(slide, {
    x: M,
    y: 1.84,
    w: CW,
    lang: "diff",
    fontSize: 10.6,
    title: "El pedido pedía tocar RF-06: el comprobante trae nombre, RUT, correo y bloque. El agente respondió «reservas.py — d»",
    code: [
      " def comprobante(nombre: str, rut: str, correo: str, bloque: int) -> str:",
      '-    return f"{nombre} | {rut} | {correo} | bloque {bloque}"',
      '+    return f"{nombre} | {rut} | bloque {bloque}"',
    ].join("\n"),
  });

  const wl = 5.4;
  captura(slide, "pr4VerdeRecorte", { x: M, y: 3.2, w: wl, hMax: 2.6, pie: "La ejecución del pull request 4, en GitHub." });
  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  tiraEstado(slide, {
    x: xd,
    y: 3.2,
    w: wd,
    titulo: "CON LA RAMA PROTEGIDA",
    trabajos: [
      ["Controles estáticos", "ok"],
      ["Pruebas de Python", "ok", "24 passed, 1 xfailed"],
      ["Extremo a extremo", "ok", "30 passed"],
      ["Vulnerabilidades", "ok"],
    ],
    fila: 0.4,
    fontSize: 10.6,
    fontDetalle: 9.4,
  });
  rect(slide, xd, 5.36, wd, 0.5, ROJO);
  addText(slide, "Estado: CLEAN · listo para integrarse, con el defecto adentro", { x: xd + 0.2, y: 5.4, w: wd - 0.4, h: 0.42, fontSize: 11, bold: true, color: C.white, valign: "mid" });

  addTakeaway(slide, "La protección de la rama no lo detiene: solo exige que las pruebas pasen, y pasan.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 61 · La prueba debil y la fuerte

function slideWeakAndStrongTest() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · dónde estaba el hueco", "Marcada RF-06, pero no mira el comprobante", "", false, { titleFontSize: 27 });

  const w = (CW - 0.4) / 2;
  addKicker(slide, M, 1.86, "La prueba que existía", ROJO, w);
  const debil = codigo(slide, {
    x: M,
    y: 2.16,
    w,
    lang: "python",
    fontSize: 8.4,
    marcas: [{ linea: 6, color: ROJO, numero: 1 }],
    code: [
      '@pytest.mark.requisito("RF-06")',
      "def test_reserva_aceptada_responde_201(",
      "    base_de_datos_de_prueba: Path,",
      ") -> None:",
      '    respuesta = cliente.post("/reservas", json=SOLICITUD)',
      "    assert respuesta.status_code == 201",
    ].join("\n"),
  });
  addText(slide, "Solo comprueba que la reserva se acepte. La matriz la cuenta como cobertura de RF-06.", {
    x: M,
    y: 2.16 + debil.h + 0.1,
    w,
    h: 0.5,
    fontSize: 10.4,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  addKicker(slide, M + w + 0.4, 1.86, "La prueba que faltaba · pull request 5", VERDE, w);
  codigo(slide, {
    x: M + w + 0.4,
    y: 2.16,
    w,
    lang: "python",
    fontSize: 7.4,
    marcas: [{ linea: 9, color: VERDE, numero: 2 }],
    code: [
      '@pytest.mark.requisito("RF-06")',
      "def test_el_comprobante_trae_nombre_rut_correo_y_bloque(",
      "    base_de_datos_de_prueba: Path,",
      ") -> None:",
      '    comprobante = cliente.post("/reservas", json=SOLICITUD).json()["comprobante"]',
      "",
      '    assert SOLICITUD["nombre"] in comprobante',
      '    assert SOLICITUD["rut"] in comprobante',
      '    assert SOLICITUD["correo_electronico"] in comprobante',
      "    assert f\"bloque {SOLICITUD['bloque']}\" in comprobante",
    ].join("\n"),
  });
  addText(slide, "cliente es el cliente de pruebas de la API; SOLICITUD, los datos de una reserva de ejemplo. .json()[\"comprobante\"] toma ese campo de la respuesta, y cada assert exige uno de los cuatro datos. En las dos pruebas, la firma se partió en líneas para que quepa.", {
    x: M + w + 0.4,
    y: 4.1,
    w,
    h: 0.84,
    fontSize: 8.8,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.04,
  });

  terminal(slide, {
    x: M,
    y: 4.98,
    w: CW,
    title: "La prueba nueva, contra el código del agente",
    fontSize: 9.4,
    lines: [{ t: "E       AssertionError: assert 'ana.rivas@ejemplo.cl' in 'Ana Rivas | 11.111.111-1 | bloque 4'", k: "err" }],
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 62 · El mismo defecto, bloqueado

function slideDefectTwoBlocked() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · el mismo defecto, otra suite", "Cambió lo que la suite mira", "", false);

  const w = (CW - 0.8) / 2;
  const antes = [
    [M, "Antes · pull request 4 contra main", "pr4VerdeRecorte", "ok", "24 passed, 1 xfailed", "CLEAN", C.white],
    [M + w + 0.8, "Después · el mismo pull request, reabierto contra main con la prueba nueva", "pr4RojoRecorte", "fail", "1 failed, 24 passed, 1 xfailed", "BLOCKED", C.warm],
  ];
  antes.forEach(([x, titulo, clave, estado, salida, merge, fondo]) => {
    rect(slide, x, 1.86, w, 4.02, fondo);
    addKicker(slide, x + 0.2, 1.98, titulo, C.slate, w - 0.4);
    captura(slide, clave, { x: x + 0.2, y: 2.46, w: w - 0.4, hMax: 1.9 });
    tiraEstado(slide, { x: x + 0.2, y: 4.52, w: w - 0.4, trabajos: [["Pruebas de Python", estado, salida]], fila: 0.44, fontSize: 10.6, fontDetalle: 9.6 });
    rect(slide, x + 0.2, 5.2, w - 0.4, 0.5, estado === "ok" ? ORO : ROJO);
    addText(slide, merge, { x: x + 0.2, y: 5.24, w: w - 0.4, h: 0.42, fontFace: TYPOGRAPHY.mono, fontSize: 15, bold: true, color: C.white, align: "center", valign: "mid" });
  });
  arrow(slide, M + w + 0.12, 3.8, 0.56, C.slate, 2.4);

  addTakeaway(slide, "El defecto no cambió. Se cerró y se reabrió para que se probara contra la main actual.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 63 · Lo que el ensayo ensena

function slideRehearsalLesson() {
  const { slide } = createSlide("light");
  addHeader(slide, "Bloque 4 · lo que enseña el ensayo", "Mismo tamaño, destinos opuestos", "", false, { titleFontSize: 27 });

  const w = (CW - 0.4) / 2;
  const defectos = [
    [M, "Defecto 1 · un carácter", "Cayó en un borde que la técnica de valores límite había mandado probar.", "Atrapado", VERDE],
    [M + w + 0.4, "Defecto 2 · un dato", "Cayó en un requisito que la matriz declaraba cubierto con una prueba que no miraba lo que el requisito dice.", "Pasó en verde", ROJO],
  ];
  defectos.forEach(([x, titulo, glosa, destino, color]) => {
    rect(slide, x, 1.9, w, 1.9, C.white);
    rect(slide, x, 1.9, w, 0.08, color);
    addText(slide, titulo, { x: x + 0.28, y: 2.08, w: w - 0.5, h: 0.32, fontSize: 13, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.28, y: 2.46, w: w - 0.5, h: 0.8, fontSize: 11.2, color: C.ink, lineSpacingMultiple: 1.08 });
    addText(slide, destino, { x: x + 0.28, y: 3.3, w: w - 0.5, h: 0.36, fontSize: 14, bold: true, color });
  });

  rect(slide, M, 4.06, CW, 1.8, NAVY_CHIP);
  addText(slide, "Un pipeline en verde afirma una sola cosa: que ninguna de las pruebas que existen falló.", {
    x: M + 0.34,
    y: 4.14,
    w: CW - 0.68,
    h: 0.8,
    fontFace: TYPOGRAPHY.display,
    fontSize: 17,
    bold: true,
    color: C.white,
  });
  addText(slide, "Lo que vale ese verde está antes del pipeline: qué pruebas se escribieron, con qué técnica se eligieron sus casos y qué afirma cada una. El pipeline solo asegura que todo eso se ejecute siempre y que nadie integre un rojo.", {
    x: M + 0.34,
    y: 5.0,
    w: CW - 0.68,
    h: 0.8,
    fontSize: 11.4,
    color: C.sand,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "El ensayo sirve más antes que durante: es mejor que el defecto que pasa lo descubras tú.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 64 y 65 · Preguntas y respuestas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar", [
    [
      "El defecto del bloque 8 lo atrapó pytest, y las pruebas de extremo a extremo quedaron en verde. ¿Faltaba una prueba de extremo a extremo que reservara el bloque 8?",
      "Piensa qué nivel es el más barato para probar el borde de una regla. ¿Qué agregaría el navegador a lo que ya dice test_limites_del_requisito[ultimo]?",
    ],
    [
      "El pull request número 4 estaba en verde y en estado CLEAN. ¿Falló la protección de la rama?",
      "Relee qué exige exactamente la regla de protección. ¿En qué parte del proyecto estaba el hueco?",
    ],
    [
      "La matriz de trazabilidad decía que RF-06 estaba cubierto. ¿Mentía?",
      "Revisa qué cuenta la matriz y qué afirma la prueba que cuenta. ¿Qué hay que leer, además de la matriz, para saber si un requisito está bien cubierto?",
    ],
  ]);
}

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "No: el borde ya estaba probado",
      "La prueba unitaria de valores límite lo atrapó, rápido y con un mensaje claro.",
      "Cada borde se prueba en el nivel más barato que lo alcanza.",
      "Repetir en el navegador lo que ya cubre una prueba unitaria.",
    ],
    [
      "No: hizo exactamente lo que dice",
      "Exige que las pruebas pasen. El hueco estaba en la suite.",
      "La protección vale lo que valen las pruebas que exige.",
      "Pedirle al pipeline lo que solo puede dar una buena prueba.",
    ],
    [
      "No mentía: contaba otra cosa",
      "Cuenta pruebas marcadas, no lo que cada una afirma.",
      "Hay que leer la prueba y compararla con el requisito.",
      "Leer «cubierto» como «bien probado».",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 66 · Cierre: lo que cada pieza puede afirmar

function slideWhatEachPieceClaims() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "Lo que cada pieza del pipeline puede afirmar", "", false, { titleFontSize: 27 });

  const wl = 2.9;
  const wc = (CW - wl - 0.28) / 2;
  const xA = M + wl + 0.14;
  const xB = xA + wc + 0.14;
  addKicker(slide, xA, 1.82, "Qué puede afirmar", VERDE, wc);
  addKicker(slide, xB, 1.82, "Qué no puede afirmar", ROJO, wc);
  const filas = [
    [AZUL, "Controles estáticos", "Que el código cumple las reglas de ruff y los tipos de pyrefly.", "Que haga lo correcto."],
    [AZUL, "Suites en el pipeline", "Que ninguna prueba existente falló sobre este cambio, en un entorno limpio.", "Que no haya defectos que ninguna prueba mira."],
    [ORO, "Falla esperada estricta", "Que un defecto conocido sigue ahí, con su motivo.", "Nada sobre los defectos que no se conocen."],
    [ORO, "Reintentos con bloqueo", "Que una prueba resultó inestable en esta ejecución.", "Que una prueba no es inestable: eso lo dice medirla."],
    [VERDE, "Auditoría programada", "Que hoy no hay vulnerabilidades conocidas.", "Qué se va a publicar mañana."],
    [VERDE, "Matriz en cada ejecución", "Qué requisitos tienen pruebas marcadas.", "Que esas pruebas afirmen lo que el requisito dice."],
    [ROJO, "Protección de la rama", "Que nada entra a main con una revisión en rojo.", "Que lo que entra en verde esté bien."],
  ];
  filas.forEach(([color, pieza, puede, noPuede], index) => {
    const y = 2.12 + index * 0.56;
    rect(slide, M, y, wl, 0.5, color);
    addText(slide, pieza, { x: M + 0.16, y: y + 0.04, w: wl - 0.26, h: 0.42, fontSize: 11, bold: true, color: C.white, valign: "mid" });
    rect(slide, xA, y, wc, 0.5, C.white);
    addText(slide, puede, { x: xA + 0.14, y: y + 0.03, w: wc - 0.26, h: 0.44, fontSize: 9.8, color: C.ink, valign: "mid", lineSpacingMultiple: 1.02 });
    rect(slide, xB, y, wc, 0.5, C.white);
    addText(slide, noPuede, { x: xB + 0.14, y: y + 0.03, w: wc - 0.26, h: 0.44, fontSize: 9.8, color: C.slate, valign: "mid", lineSpacingMultiple: 1.02 });
  });

  addTakeaway(slide, "La columna de la derecha es el trabajo que sigue siendo de una persona.", { y: 6.14, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 67 · El recorrido del modulo

function slideModuleJourney() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre", "El recorrido del módulo", "", false);

  const capas = [
    ["Un criterio", "ISO/IEC 25010 para decir qué es calidad"],
    ["Una línea base", "Entorno reproducible, controles estáticos"],
    ["Casos con método", "Particiones, valores límite, tablas de decisión"],
    ["Tres niveles", "Unitarias, integración, extremo a extremo"],
    ["Más que funcionar", "Rendimiento, seguridad, accesibilidad"],
    ["Un plan", "Riesgo y trazabilidad que se ejecuta"],
    ["Hoy", "Que todo corra solo, y un rojo no entre"],
  ];
  const n = capas.length;
  const w = (CW - 0.12 * (n - 1)) / n;
  capas.forEach(([titulo, glosa], index) => {
    const x = M + index * (w + 0.12);
    const h = 1.56 + index * 0.34;
    const y = 5.5 - h;
    const hoy = index === n - 1;
    rect(slide, x, y, w, h, hoy ? C.red : index % 2 === 0 ? NAVY_CHIP : AZUL);
    addText(slide, String(index + 1), { x: x + 0.14, y: y + 0.1, w: 0.4, h: 0.34, fontFace: TYPOGRAPHY.display, fontSize: 16, bold: true, color: hoy ? C.white : C.gold });
    addText(slide, titulo, { x: x + 0.14, y: y + 0.46, w: w - 0.26, h: 0.5, fontSize: 11.2, bold: true, color: C.white, lineSpacingMultiple: 1.02 });
    addText(slide, glosa, { x: x + 0.14, y: y + 0.96, w: w - 0.26, h: h - 1.04, fontSize: 9.2, color: C.sand, lineSpacingMultiple: 1.04 });
  });
  addText(slide, "En cada capa apareció un agente: propuso rápido y bien, y algunas de sus afirmaciones resultaron falsas hasta que alguien las ejecutó.", {
    x: M,
    y: 5.62,
    w: CW,
    h: 0.46,
    fontSize: 11.4,
    italic: true,
    color: C.ink,
  });

  addTakeaway(slide, "El criterio para decidir qué creer nunca fue del agente.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 68 · Manana: la lista para esta noche

function slideTonightChecklist() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mañana · el corte de la Evaluación Final", "Lo que se revisa esta noche", "", false, { titleFontSize: 28 });

  const items = [
    ["Pipeline", "Se dispara ante cada push y pull request, ejecuta estáticos y los tres niveles, y la última ejecución en main está en verde."],
    ["Historial", "Más de una ejecución que muestre el trabajo."],
    ["Rojos conocidos", "Marcados como falla esperada, con motivo y registro escrito. Nada borrado ni omitido."],
    ["Inestables", "Corregidas, o registradas: cuál, cuánto falla, qué se investigó, qué se decidió."],
    ["No funcionales", "Al menos tres categorías, con el umbral escrito antes de medir."],
    ["Plan y trazabilidad", "Cerrado, hasta el resultado en el pipeline."],
    ["Uso de agentes", "Qué delegaste, qué auditaste, qué propuso mal y qué decisiones son tuyas."],
    ["Datos y README", "Ningún dato personal real; un README con el que otra persona instala, ejecuta y prueba."],
  ];
  const w = (CW - 0.2) / 2;
  items.forEach(([titulo, glosa], index) => {
    const x = M + (index % 2) * (w + 0.2);
    const y = 1.84 + Math.floor(index / 2) * 1.04;
    rect(slide, x, y, w, 0.94, C.white);
    slide.addText("✓", {
      shape: SH.rect,
      x: x + 0.16,
      y: y + 0.24,
      w: 0.44,
      h: 0.44,
      fill: { color: VERDE },
      line: { color: VERDE },
      fontFace: TYPOGRAPHY.body,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      margin: 0,
    });
    addText(slide, titulo, { x: x + 0.76, y: y + 0.08, w: w - 0.9, h: 0.28, fontSize: 11.6, bold: true, color: C.ink });
    addText(slide, glosa, { x: x + 0.76, y: y + 0.38, w: w - 0.9, h: 0.52, fontSize: 9.6, color: C.slate, lineSpacingMultiple: 1.02 });
  });

  addFuente(slide, 6.1, "Tomado de los requisitos y de «Qué baja la evaluación» en las instrucciones de la Evaluación Final.", { w: 11 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 69 · Pesos y defensa

function slideWeightsAndDefense() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mañana · si no alcanzas a todo", "Ordena el trabajo por lo que pesa", "", false);

  const pesos = [
    ["Integración continua", 25, AZUL],
    ["No funcionales", 20, AZUL],
    ["Defensa", 20, ORO],
    ["Regresión e inestables", 15, AZUL],
    ["Plan y trazabilidad", 10, AZUL],
    ["Criterio frente al agente", 10, AZUL],
  ];
  const wl = 6.2;
  const x0 = M + 2.6;
  const escala = (wl - 2.6 - 0.7) / 25;
  pesos.forEach(([criterio, peso, color], index) => {
    const y = 1.9 + index * 0.6;
    addText(slide, criterio, { x: M, y: y + 0.06, w: 2.5, h: 0.36, fontSize: 11, bold: true, color: C.ink, valign: "mid" });
    rect(slide, x0, y + 0.08, peso * escala, 0.34, color);
    addText(slide, `${peso} %`, { x: x0 + peso * escala + 0.1, y: y + 0.06, w: 0.7, h: 0.36, fontSize: 11.4, bold: true, color, valign: "mid" });
  });
  addFuente(slide, 5.6, "Instrucciones de la Evaluación Final, sección 5", { w: wl });

  const xd = M + wl + 0.3;
  const wd = CW - wl - 0.3;
  rect(slide, xd, 1.86, wd, 4.1, NAVY_CHIP);
  addKicker(slide, xd + 0.28, 2.02, "La defensa se prepara entendiendo lo que ya está escrito", C.gold, wd - 0.5);
  const preguntas = [
    "¿Qué prueba te costó más escribir, y por qué?",
    "¿Qué parte sigue sin cubrir, y qué riesgo aceptaste?",
    "Este umbral de rendimiento, ¿de dónde salió?",
    "Si alguien cambia esta función, ¿qué se pone rojo?",
    "¿Qué te dijo un agente que resultó equivocado?",
  ];
  preguntas.forEach((pregunta, index) => {
    const y = 2.44 + index * 0.62;
    addText(slide, "·", { x: xd + 0.28, y, w: 0.2, h: 0.5, fontSize: 18, bold: true, color: C.gold });
    addText(slide, pregunta, { x: xd + 0.5, y, w: wd - 0.76, h: 0.54, fontSize: 11.2, color: C.white, lineSpacingMultiple: 1.04 });
  });
  addText(slide, "Ejemplos del tipo de pregunta, según la sección 6. Todas se responden mirando el propio proyecto.", {
    x: xd + 0.28,
    y: 5.52,
    w: wd - 0.5,
    h: 0.36,
    fontSize: 9.4,
    italic: true,
    color: C.softBlue,
  });

  addTakeaway(slide, "Un pipeline que se ejecuta y dice la verdad es lo primero.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 70 · Mensaje final

function slideFinalMessage() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 0.9, "Mensaje final", C.gold, 5);

  const hoy = [
    "La suite se ejecuta sola, ante cada cambio.",
    "Los defectos conocidos quedan a la vista, con su motivo.",
    "Una prueba inestable no entra.",
    "Un rojo no se puede integrar.",
  ];
  const w = (CW - 0.14 * 3) / 4;
  hoy.forEach((texto, index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 1.3, w, 0.9, NAVY_CHIP);
    rect(slide, x, 1.3, w, 0.05, C.success);
    addText(slide, texto, { x: x + 0.18, y: 1.4, w: w - 0.32, h: 0.74, fontSize: 11, color: C.sand, lineSpacingMultiple: 1.08 });
  });
  addText(slide, "Todo lo del módulo dependía de que alguien se acordara. Hoy dejó de depender.", {
    x: M,
    y: 2.4,
    w: CW,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: C.gold,
  });

  rule(slide, M, 3.1, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Un pipeline en verde no dice que el sistema funcione: dice que ninguna de las pruebas que existen falló. Lo que vale ese verde lo deciden las pruebas que se escribieron, los casos que se eligieron y lo que cada una afirma.",
    { x: M, y: 3.3, w: CW, h: 1.8, fontFace: TYPOGRAPHY.display, fontSize: 19, bold: true, color: C.white, lineSpacingMultiple: 1.18 }
  );
  addText(
    slide,
    "La infraestructura hace que todo eso se ejecute siempre. Decidir qué hay que ejecutar sigue siendo trabajo de quien firma.",
    { x: M, y: 5.3, w: CW, h: 0.8, fontSize: 15, color: C.sand, lineSpacingMultiple: 1.18 }
  );
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Orden del deck.

slideCover();
slideVocabulary();
slideOpening();
slideConfirmationRegression();
slideWhyAutomate();
slideMap();

slideBlockOneDivider();
slideWhatIsActions();
slideWorkflowPartOne();
slideWorkflowPartTwo();
slideThreeDecisions();
slideWhoFailed();
slideRunOne();
slideRunTwo();
slideRuffNotDeclared();
slideWidthByEnvironment();
slideRunThree();
slideRunFour();
slideHistory();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideAlwaysRed();
slideFourWays();
slideSkipVsXfail();
slideXfailPytest();
slideTestFail();
slideTwentySevenPassed();
slideStrictInAction();
slideRunsTwice();
slideWrittenRecord();
slideScheduledAudit();
slideScheduleConditions();
slideMatrixInSummary();
slideBlockTwoState();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideFlakyCost();
slideNewFlakyTest();
slideSameCommitTwoResults();
slideRetries();
slideFlakyButGreen();
slideRetriesThatHide();
slideFailOnFlaky();
slideNotAlwaysVisible();
slideMeasureFlaky();
slideFixFlaky();
slideQuarantine();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideRehearsal();
slideDefectRequest();
slideDefectOne();
slideDefectOneAnswers();
slidePipelineOwnDefect();
slideRedDoesNotBlock();
slideDirectPushRejected();
slideDefectTwo();
slideWeakAndStrongTest();
slideDefectTwoBlocked();
slideRehearsalLesson();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideWhatEachPieceClaims();
slideModuleJourney();
slideTonightChecklist();
slideWeightsAndDefense();
slideFinalMessage();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
