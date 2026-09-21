const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { addCodePanel, addTerminalPanel } = components;
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "PRO402 · Clase 10",
  title: "Recorrer no es verificar.",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(
  __dirname,
  "..",
  "Clase-10-Recorrer-No-Es-Verificar.pptx"
);

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

// Tintes del navy, para filetes y fichas sobre fondo oscuro.
const NAVY_RULE = "2C4A66";
const NAVY_CHIP = "1D3A57";
// Verde legible sobre papel: el success del tema aclara demasiado en texto.
const VERDE = "2E7D4F";

// Roles de color de esta clase, todos de la paleta del tema:
//   navy  = el requisito y la dependencia real: aquello CONTRA lo que se contrasta
//   gold  = la medicion y su numero: la cobertura
//   red   = lo que queda sin verificar: el defecto vivo, el mutante que sobrevive
//   verde = lo que si detecta
const ACCENT_ON_PAPER = {
  [C.success]: VERDE,
  [C.gold]: "8A6A12",
  [C.red]: "B3181E",
};

function onPaper(accent) {
  return ACCENT_ON_PAPER[accent] || accent;
}

const ORO = onPaper(C.gold);
const ROJO = onPaper(C.red);
const AZUL = onPaper(C.navy);

// ============================================================ PRIMITIVOS

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

function frame(slide, x, y, w, h, outline, pt = 1) {
  slide.addShape(SH.rect, {
    x,
    y,
    w,
    h,
    fill: { type: "none" },
    line: { color: outline, pt },
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

function arrow(slide, x, y, w, color, pt = 1.4) {
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

function addHeader(slide, label, title, subtitle = "", dark = false, opts = {}) {
  const longTitle = title.length > 54;
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.44,
    w: 7.6,
    h: 0.22,
    fontSize: 10.3,
    bold: true,
    color: dark ? C.gold : C.red,
    charSpacing: 1.7,
  });
  addText(slide, title, {
    x: M,
    y: 0.82,
    w: opts.titleW || 10.3,
    // Las láminas muy cargadas usan un título de una sola línea y recuperan
    // el alto sobrante para el contenido.
    h: opts.titleH || 1.06,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || (longTitle ? 28 : 30),
    bold: true,
    color: dark ? C.white : C.ink,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: M,
      y: opts.subtitleY || 1.94,
      w: opts.subtitleW || 11.4,
      h: opts.subtitleH || 0.44,
      fontSize: opts.subtitleFontSize || 14.5,
      color: dark ? C.softBlue : C.slate,
      lineSpacingMultiple: 1.14,
    });
  }
}

// ======================================= COMPONENTES PROPIOS DE ESTA CLASE

// Banda de conclusión al pie. Cada lámina declara para qué sirve.
function addTakeaway(slide, text, opts = {}) {
  const y = opts.y || 6.2;
  const h = opts.h || 0.6;
  rect(slide, M, y, CW, h, opts.fill || C.navy);
  addText(slide, text, {
    x: M + 0.34,
    y: y + 0.04,
    w: CW - 0.68,
    h: h - 0.08,
    fontSize: opts.fontSize || 14,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.1,
  });
}

// Sello de procedencia. Toda cifra o cita lleva su fuente a la vista.
function addFuente(slide, x, y, texto, opts = {}) {
  rect(slide, x, y, 0.05, 0.2, opts.color || ORO);
  addText(slide, texto, {
    x: x + 0.16,
    y: y - 0.01,
    w: opts.w || 5.4,
    h: 0.22,
    fontSize: opts.fontSize || 9.2,
    italic: true,
    color: opts.textColor || C.slate,
  });
}

// Etiqueta pequeña en versalitas.
function addKicker(slide, x, y, texto, color, w = 5.2) {
  addText(slide, texto.toUpperCase(), {
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

// Cita textual de una norma, un informe o un autor.
function addCita(slide, x, y, w, h, texto, opts = {}) {
  const accent = opts.accent || AZUL;
  rect(slide, x, y, w, h, opts.fill || C.warm);
  rect(slide, x, y, 0.07, h, accent);
  addText(slide, `“${texto}”`, {
    x: x + 0.34,
    y: y + 0.12,
    w: w - 0.62,
    h: h - 0.24,
    fontSize: opts.fontSize || 13.2,
    italic: true,
    color: opts.color || C.ink,
    valign: opts.valign || "mid",
    lineSpacingMultiple: 1.18,
  });
}

// ---------------------------------------------------------------------------
// MEJORA 1 — Ficha de definición.
// El deck es la clase, así que cada término se define en pantalla y no solo en
// el README. Muestra la cosa, la nombra, y deja el contraejemplo al lado.
// ---------------------------------------------------------------------------
function addDefinicion(slide, x, y, w, termino, definicion, opts = {}) {
  const h = opts.h || 1.12;
  const accent = opts.accent || AZUL;
  rect(slide, x, y, w, h, opts.fill || C.white);
  rect(slide, x, y, 0.07, h, accent);
  addText(slide, termino.toUpperCase(), {
    x: x + 0.3,
    y: y + 0.12,
    w: w - 0.6,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: accent,
    charSpacing: 1.3,
  });
  addText(slide, definicion, {
    x: x + 0.3,
    y: y + 0.4,
    w: w - 0.6,
    h: h - 0.52,
    fontSize: opts.fontSize || 13,
    color: C.ink,
    lineSpacingMultiple: 1.16,
  });
}

// ---------------------------------------------------------------------------
// MEJORA 2 — El informe de cobertura como objeto de primera clase.
// Es el artefacto que esta clase enseña a leer, así que en vez de volcarlo como
// texto de terminal se dibuja como tabla monoespaciada y se le puede encender
// una columna para hablar de ella. Mantiene el aspecto del terminal real para
// que el estudiante lo reconozca cuando lo vea en su máquina.
// ---------------------------------------------------------------------------
function addInformeCobertura(slide, x, y, w, opts = {}) {
  const cols = opts.cols;
  const rows = opts.rows;
  const anchos = opts.anchos;
  const destacar = opts.destacar;
  const fs = opts.fontSize || 11.5;
  const rowH = opts.rowH || 0.3;
  const headH = 0.34;
  // Barra de título propia, igual que la de los paneles de código y terminal.
  const barH = opts.titulo ? 0.32 : 0;
  // padBottom permite igualar el alto del informe al de los paneles vecinos.
  const h = barH + headH + rows.length * rowH + (opts.padBottom ?? 0.24);

  rect(slide, x, y, w, h, C.terminalBg);

  if (opts.titulo) {
    rect(slide, x, y, w, barH, NAVY_CHIP);
    addText(slide, opts.titulo, {
      x: x + 0.22,
      y: y + 0.05,
      w: w - 0.44,
      h: 0.22,
      fontSize: 9.4,
      bold: true,
      color: C.sand,
      charSpacing: 0.6,
    });
  }

  y += barH;

  // Columna encendida: banda vertical detrás de encabezado y celdas.
  if (destacar !== undefined) {
    let cx = x + 0.22;
    for (let i = 0; i < destacar; i += 1) cx += anchos[i];
    rect(slide, cx - 0.02, y + 0.06, anchos[destacar], h - barH - 0.12, NAVY_CHIP);
  }

  const cellX = (i) => {
    let cx = x + 0.22;
    for (let k = 0; k < i; k += 1) cx += anchos[k];
    return cx;
  };

  // Una celda alineada a la derecha queda pegada a la columna siguiente, y si
  // esa columna va encendida el valor parece cortado. Se le deja aire.
  const padDerecha = (i) =>
    opts.align && opts.align[i] === "right" ? 0.22 : 0;

  cols.forEach((titulo, i) => {
    addText(slide, titulo, {
      x: cellX(i),
      y: y + 0.12,
      w: anchos[i] - 0.06 - padDerecha(i),
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: fs,
      bold: true,
      color: destacar === i ? C.gold : C.terminalMuted,
      align: opts.align && opts.align[i] ? opts.align[i] : "left",
    });
  });

  rule(slide, x + 0.22, y + headH + 0.06, w - 0.44, NAVY_RULE, 1);

  rows.forEach((fila, r) => {
    const ry = y + headH + 0.14 + r * rowH;
    fila.forEach((celda, i) => {
      addText(slide, celda, {
        x: cellX(i),
        y: ry,
        w: anchos[i] - 0.06 - padDerecha(i),
        h: rowH - 0.02,
        fontFace: TYPOGRAPHY.mono,
        fontSize: fs,
        bold: destacar === i,
        color:
          destacar === i
            ? C.gold
            : opts.rowColor && opts.rowColor[r]
              ? opts.rowColor[r]
              : C.terminalOutput,
        align: opts.align && opts.align[i] ? opts.align[i] : "left",
      });
    });
  });

  return h;
}

// ---------------------------------------------------------------------------
// MEJORA 3 — Contraste de una cifra antes y después de un cambio.
// La clase vive de comparar dos mediciones del mismo proyecto, así que el
// movimiento tiene su propio componente en vez de dos paneles sueltos.
// ---------------------------------------------------------------------------
function addContraste(slide, x, y, w, izq, der, opts = {}) {
  const h = opts.h || 1.5;
  const colW = (w - 0.9) / 2;

  const bloque = (bx, datos, color) => {
    rect(slide, bx, y, colW, h, C.white);
    rect(slide, bx, y, colW, 0.06, color);
    addText(slide, datos.rotulo.toUpperCase(), {
      x: bx + 0.22,
      y: y + 0.18,
      w: colW - 0.44,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 1.2,
    });
    addText(slide, datos.cifra, {
      x: bx + 0.22,
      y: y + 0.44,
      w: colW - 0.44,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: opts.cifraFontSize || 40,
      bold: true,
      color,
    });
    addText(slide, datos.glosa, {
      x: bx + 0.22,
      y: y + h - 0.44,
      w: colW - 0.44,
      h: 0.36,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  };

  bloque(x, izq, izq.color || C.slate);
  bloque(x + colW + 0.9, der, der.color || ROJO);

  arrow(slide, x + colW + 0.14, y + h / 2, 0.62, ORO, 2.2);
  if (opts.etiquetaFlecha) {
    addText(slide, opts.etiquetaFlecha, {
      x: x + colW + 0.02,
      y: y + h / 2 - 0.44,
      w: 0.86,
      h: 0.3,
      fontSize: 9,
      bold: true,
      color: ORO,
      align: "center",
      charSpacing: 0.6,
    });
  }
}

// ---------------------------------------------------------------------------
// LA FIRMA VISUAL DE ESTA CLASE: las tres preguntas que responde una prueba.
// Recorrer, comprobar y contrastar son tres cosas distintas, y el error que la
// sesión persigue es darlas por equivalentes. Cada divisor enciende la que su
// bloque interroga; el bloque 4 las enciende todas.
// ---------------------------------------------------------------------------

const TRIADA = [
  ["¿Qué recorrió?", "La cobertura lo mide"],
  ["¿Qué comprobó?", "Solo la aserción lo dice"],
  ["¿Contra qué?", "El requisito, o un supuesto"],
];

function addTriada(slide, activa, opts = {}) {
  const y = opts.y || 5.62;
  const dark = opts.dark || false;
  const w = 3.82;
  const gap = 0.36;
  let x = M;

  TRIADA.forEach(([pregunta, glosa], i) => {
    const viva = activa === "todas" || i === activa;
    const fondo = viva ? C.gold : dark ? NAVY_CHIP : C.softNeutral;
    const tinta = viva ? (dark ? C.navy : C.ink) : dark ? C.sand : C.slate;

    rect(slide, x, y, w, 0.62, fondo);
    addText(slide, pregunta, {
      x: x + 0.2,
      y: y + 0.07,
      w: w - 0.4,
      h: 0.26,
      fontSize: viva ? 13 : 11.6,
      bold: true,
      color: tinta,
    });
    addText(slide, glosa, {
      x: x + 0.2,
      y: y + 0.34,
      w: w - 0.4,
      h: 0.22,
      fontSize: 9.8,
      color: viva ? (dark ? NAVY_RULE : C.slate) : dark ? C.terminalMuted : C.slate,
    });

    if (i < TRIADA.length - 1) {
      arrow(slide, x + w + 0.06, y + 0.31, gap - 0.12, dark ? C.sand : C.slate, 1.1);
    }
    x += w + gap;
  });
}

// Divisor de bloque.
function slideDivisor(numero, titulo, pregunta, activa) {
  const { slide } = createSlide("dark");

  // El título puede venir en dos líneas: la regla y la pregunta bajan con él.
  const lineas = titulo.split("\n").length;
  const tituloH = lineas * 0.62;
  const yRegla = 2.1 + tituloH + 0.18;

  addKicker(slide, M, 1.72, `Bloque ${numero} de 4`, C.gold, 3);

  addText(slide, titulo, {
    x: M,
    y: 2.1,
    w: 10.6,
    h: tituloH,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.04,
  });

  rule(slide, M, yRegla, 3.4, C.gold, 2.4);

  addText(slide, pregunta, {
    x: M,
    y: yRegla + 0.28,
    w: 10.2,
    h: 0.9,
    fontSize: 17,
    italic: true,
    color: C.softBlue,
    lineSpacingMultiple: 1.16,
  });

  addKicker(slide, M, 5.3, "Qué pregunta interroga este bloque", C.sand, 6);
  addTriada(slide, activa, { y: 5.6, dark: true });

  validateSlide(slide, pptx);
}

// El dispositivo de lectura de código del deck: leer, predecir, comprobar.
function addPasosLectura(slide, x, y, activo, opts = {}) {
  const pasos = ["Leer", "Predecir", "Comprobar"];
  const w = opts.w || 1.16;
  const dark = opts.dark || false;

  pasos.forEach((paso, i) => {
    const px = x + i * (w + 0.1);
    const viva = i === activo;
    rect(slide, px, y, w, 0.3, viva ? AZUL : dark ? NAVY_CHIP : C.softNeutral);
    addText(slide, paso, {
      x: px,
      y: y + 0.01,
      w,
      h: 0.28,
      fontSize: 9.4,
      bold: true,
      color: viva ? C.white : dark ? C.sand : C.slate,
      align: "center",
      valign: "mid",
      charSpacing: 0.6,
    });
  });
}

// Lámina de cierre de bloque: exactamente tres preguntas, cada una con pista.
function slidePreguntas(bloque, titulo, preguntas) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${bloque} · cierre`, titulo, "", false, {
    titleW: 10.3,
  });

  const COLORES = [ROJO, AZUL, ORO];
  const H = 1.3;

  preguntas.forEach(([texto, pista], i) => {
    const y = 2.14 + i * 1.44;
    const color = COLORES[i];

    rect(slide, M, y, CW, H, i % 2 === 0 ? C.warm : C.softNeutral);
    rect(slide, M, y, 0.06, H, color);

    addText(slide, String(i + 1), {
      x: M + 0.3,
      y: y + 0.16,
      w: 0.52,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: M + 1.0,
      y: y + 0.15,
      w: CW - 1.36,
      h: 0.6,
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rule(slide, M + 1.0, y + 0.84, CW - 1.36, C.border, 0.7);
    addText(slide, "PISTA", {
      x: M + 1.0,
      y: y + 0.94,
      w: 0.7,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, pista, {
      x: M + 1.78,
      y: y + 0.92,
      w: CW - 2.14,
      h: 0.28,
      fontSize: 12,
      italic: true,
      color: C.slate,
    });
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// MEJORA 4 — Lámina de contraste, ahora con el error frecuente.
// Conserva orden, numeración y color de la lámina de preguntas. Agrega lo que
// la versión anterior no tenía: junto a la respuesta correcta, la respuesta
// equivocada que el curso da casi siempre. Sirve para nombrarla en voz alta
// antes de que alguien se quede con ella.
// ---------------------------------------------------------------------------
function slideRespuestas(bloque, titulo, respuestas) {
  const { slide } = createSlide("light");
  // Encabezado compacto: esta lámina lleva mucho texto y necesita el alto.
  addHeader(slide, `Bloque ${bloque} · contraste`, titulo, "", false, {
    titleW: 10.3,
    titleFontSize: 25,
    titleH: 0.62,
  });

  const COLORES = [ROJO, AZUL, ORO];
  const H = 1.68;
  const TX = M + 1.12; // donde empieza el texto, después del número
  const TW = CW - 1.48;
  const CANAL = 0.56; // separación entre las dos columnas de abajo
  const colW = (TW - CANAL) / 2;

  respuestas.forEach(([etiqueta, respuesta, revela, error], i) => {
    const y = 1.66 + i * 1.78;
    const color = COLORES[i];

    rect(slide, M, y, CW, H, C.white);
    rect(slide, M, y, 0.06, H, color);

    addText(slide, String(i + 1), {
      x: M + 0.32,
      y: y + 0.2,
      w: 0.58,
      h: 0.52,
      fontFace: TYPOGRAPHY.display,
      fontSize: 27,
      bold: true,
      color,
    });
    addText(slide, etiqueta.toUpperCase(), {
      x: TX,
      y: y + 0.14,
      w: TW,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color,
      charSpacing: 1.2,
    });
    addText(slide, respuesta, {
      x: TX,
      y: y + 0.4,
      w: TW,
      h: 0.52,
      fontSize: 13,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.2,
    });

    rule(slide, TX, y + 1.0, TW, C.border, 0.7);

    addText(slide, "LO QUE REVELA", {
      x: TX,
      y: y + 1.08,
      w: colW,
      h: 0.18,
      fontSize: 8.2,
      bold: true,
      color: VERDE,
      charSpacing: 1.1,
    });
    addText(slide, revela, {
      x: TX,
      y: y + 1.28,
      w: colW,
      h: 0.34,
      fontSize: 10.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });

    vrule(slide, TX + colW + CANAL / 2, y + 1.06, 0.5, C.border, 0.7);

    addText(slide, "ERROR FRECUENTE", {
      x: TX + colW + CANAL,
      y: y + 1.08,
      w: colW,
      h: 0.18,
      fontSize: 8.2,
      bold: true,
      color: ROJO,
      charSpacing: 1.1,
    });
    addText(slide, error, {
      x: TX + colW + CANAL,
      y: y + 1.28,
      w: colW,
      h: 0.34,
      fontSize: 10.6,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  validateSlide(slide, pptx);
}

// ==================================================================== 01 PORTADA

function slidePortada() {
  const { slide } = createSlide("dark");

  addKicker(slide, M, 1.5, "PRO402 · Clase 10 · Unidad 2", C.gold, 6);

  addText(slide, "Recorrer no es verificar", {
    x: M,
    y: 1.92,
    w: 11.2,
    h: 1.2,
    fontFace: TYPOGRAPHY.display,
    fontSize: 54,
    bold: true,
    color: C.white,
  });

  rule(slide, M, 3.28, 4.2, C.red, 3);

  addText(
    slide,
    "Cobertura, dobles de prueba y el verde que no significa nada",
    {
      x: M,
      y: 3.56,
      w: 10.6,
      h: 0.5,
      fontSize: 20,
      color: C.softBlue,
    }
  );

  addText(
    slide,
    "Una suite es el conjunto de pruebas. Puede ejecutar el 100 % del código y terminar en verde —todas pasan— sin haber comprobado nada.\nHoy se distingue cobertura —qué se ejecutó— de verificación —qué resultado se comprobó—.",
    {
      x: M,
      y: 4.28,
      w: 9.8,
      h: 0.8,
      fontSize: 14.5,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );

  rule(slide, M, 5.5, CW, NAVY_RULE, 1);

  addText(slide, "Lunes 21 de septiembre de 2026 · 08:30 – 10:50", {
    x: M,
    y: 5.7,
    w: 6.4,
    h: 0.3,
    fontSize: 13,
    color: C.sand,
  });
  addText(slide, "Diego Obando · AIEP Osorno", {
    x: 7.2,
    y: 5.7,
    w: 5.4,
    h: 0.3,
    fontSize: 13,
    color: C.sand,
    align: "right",
  });

  validateSlide(slide, pptx);
}

// ============================================== 02 LA PREGUNTA DE ENTRADA

function slidePreguntaDeEntrada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Para abrir",
    "Dos suites sobre el mismo proyecto",
    "Las dos terminan en verde: todas sus pruebas pasan. Una deja vivo un defecto que inutiliza un octavo de la jornada del laboratorio. Cobertura es la proporción del código que la suite ejecutó.",
    false,
    { subtitleW: 11.2 }
  );

  const cajas = [
    [
      "Suite A",
      "12 pruebas",
      "88 %",
      "Cada prueba compara un resultado contra lo que el requisito exige.",
      AZUL,
    ],
    [
      "Suite B",
      "1 prueba",
      "100 %",
      "Llama a todas las funciones del proyecto y no compara ningún resultado.",
      ROJO,
    ],
  ];

  cajas.forEach(([rotulo, pruebas, cobertura, glosa, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.6, 5.66, 2.36, C.white);
    rect(slide, x, 2.6, 5.66, 0.07, color);
    addKicker(slide, x + 0.28, 2.82, rotulo, color, 3);
    addText(slide, cobertura, {
      x: x + 0.28,
      y: 3.1,
      w: 2.2,
      h: 0.76,
      fontFace: TYPOGRAPHY.display,
      fontSize: 46,
      bold: true,
      color,
    });
    addText(slide, "de cobertura", {
      x: x + 2.56,
      y: 3.32,
      w: 2.6,
      h: 0.28,
      fontSize: 15,
      bold: true,
      color: C.slate,
    });
    addText(slide, pruebas, {
      x: x + 2.56,
      y: 3.62,
      w: 2.6,
      h: 0.26,
      fontSize: 13,
      color: C.slate,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 4.14,
      w: 5.1,
      h: 0.6,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addText(slide, "¿Cuál de las dos preferirías heredar, y con qué argumento?", {
    x: M,
    y: 5.26,
    w: CW,
    h: 0.4,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: C.ink,
    align: "center",
  });

  addTakeaway(
    slide,
    "Si el argumento es el porcentaje, hoy cambia. Las dos cifras son reales y están medidas sobre el mismo código.",
    { y: 5.86, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

// ======================================= 03 DE DÓNDE VIENE ESTA CLASE

function slideDeDondeViene() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El hilo",
    "Lo que quedó abierto la sesión pasada",
    "Tres técnicas produjeron una muestra defendible de casos. Quedó una pregunta sin responder.",
    false,
    { subtitleW: 11.2 }
  );

  const pasos = [
    ["Partición de equivalencia", "Agrupar entradas que esperamos que reciban el mismo trato", AZUL],
    ["Análisis de valores límite", "Mirar los bordes de cada partición, donde cambia la regla", AZUL],
    ["Tabla de decisión", "Combinar reglas que actúan juntas y reducir sin perder cobertura", AZUL],
  ];

  pasos.forEach(([titulo, glosa, color], i) => {
    const y = 2.56 + i * 0.78;
    rect(slide, M, y, 7.5, 0.66, i % 2 === 0 ? C.warm : C.softNeutral);
    rect(slide, M, y, 0.06, 0.66, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.08,
      w: 3.3,
      h: 0.26,
      fontSize: 13.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.3,
      y: y + 0.36,
      w: 6.9,
      h: 0.24,
      fontSize: 11.4,
      color: C.slate,
    });
  });

  rect(slide, 8.52, 2.56, 4.09, 2.22, C.navy);
  addKicker(slide, 8.8, 2.78, "Las tres miran el requisito", C.gold, 3.6);
  addText(
    slide,
    "Ninguna de las tres abre el programa. Todas derivan sus casos del documento y tratan el código como una caja cerrada.",
    {
      x: 8.8,
      y: 3.08,
      w: 3.55,
      h: 0.9,
      fontSize: 12.6,
      color: C.white,
      lineSpacingMultiple: 1.18,
    }
  );
  rule(slide, 8.8, 4.06, 3.55, NAVY_RULE, 1);
  addText(slide, "Funcionaron: encontraron el defecto del bloque 8.", {
    x: 8.8,
    y: 4.2,
    w: 3.55,
    h: 0.44,
    fontSize: 12,
    italic: true,
    color: C.sand,
    lineSpacingMultiple: 1.14,
  });

  addTakeaway(
    slide,
    "La pregunta que quedó en pie: ¿qué evidencia adicional aporta mirar hacia adentro del programa?",
    { y: 5.06, h: 0.58 }
  );

  addFuente(
    slide,
    M,
    5.84,
    "Clase 09 · ISO/IEC/IEEE 29119-4:2021, cláusula 5.2 · técnicas basadas en la especificación",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

// ============================================================ 04 EL PROYECTO

function slideElProyecto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El material de hoy",
    "El mismo proyecto, ahora con una dependencia externa",
    "El sistema de reserva del laboratorio ya no termina en sí mismo: al aceptar una reserva, manda el comprobante a un servicio ajeno.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.1,
    h: 2.18,
    title: "reservas.py · las cuatro funciones del proyecto",
    code: [
      "def bloque_valido(bloque): ...",
      "def puede_reservar(reservas, bloque, tomado): ...",
      "def puede_cancelar(inicio_bloque, ahora): ...",
      "def comprobante(nombre, rut, correo, bloque): ...",
    ].join("\n"),
    lang: "python",
    fontSize: 10.6,
  });

  rect(slide, 8.02, 2.56, 4.59, 2.18, C.navy);
  addKicker(slide, 8.3, 2.76, "Lo nuevo", C.gold, 3);
  addText(slide, "notificaciones.py", {
    x: 8.3,
    y: 3.04,
    w: 4.05,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: C.white,
  });
  addText(
    slide,
    "enviar_confirmacion(correo, cuerpo) habla por red con el servicio de correo institucional.\n\nNo es parte del proyecto: es una máquina ajena que puede estar caída, tardar, o mandar correos de verdad.",
    {
      x: 8.3,
      y: 3.42,
      w: 4.05,
      h: 1.16,
      fontSize: 11.8,
      color: C.softBlue,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Esa dependencia es la que va a obligar a sustituirla por un doble, y la que va a mostrar dónde el doble deja de ayudar.",
    { y: 4.96, h: 0.58 }
  );

  addFuente(
    slide,
    M,
    5.74,
    "Proyecto de reserva de laboratorio · clases 08, 09 y 10 · Python 3.12.12",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

// ============================================== 05 CÓMO SE LEE UNA LLAMADA

function slideComoSeLeeUnaLlamada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Antes de empezar",
    "Cómo se lee una llamada de este proyecto",
    "Los argumentos van en el orden de la firma. Un número suelto no dice nada hasta que se traduce a una frase.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 11.89,
    h: 1.3,
    title: "La firma",
    code: "puede_reservar(reservas_de_la_semana, bloque, tomado)",
    lang: "python",
    fontSize: 12.5,
  });

  const casos = [
    ["puede_reservar(0, 3, tomado=False)", "Alguien sin ninguna reserva esta semana pide el bloque 3, que está libre.", VERDE],
    ["puede_reservar(3, 3, tomado=False)", "Alguien que ya tiene 3 reservas —el máximo— pide el bloque 3 libre.", ROJO],
    ["puede_reservar(0, 3, tomado=True)", "Alguien sin reservas pide el bloque 3, pero ya lo tomó otra persona.", ROJO],
  ];

  casos.forEach(([llamada, frase, color], i) => {
    const y = 4.06 + i * 0.66;
    rect(slide, M, y, CW, 0.56, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.56, color);
    addText(slide, llamada, {
      x: M + 0.28,
      y: y + 0.14,
      w: 4.5,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, frase, {
      x: M + 5.0,
      y: y + 0.15,
      w: CW - 5.3,
      h: 0.28,
      fontSize: 12.4,
      color: C.slate,
    });
  });

  addTakeaway(
    slide,
    "Regla de la sesión: toda llamada que aparezca en pantalla se lee en voz alta como una frase antes de discutirla.",
    { y: 6.12, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

// ============================================================== 06 EL MAPA

function slideMapa() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "El recorrido",
    "Cuatro bloques, tres preguntas",
    "Cada bloque interroga una de las tres preguntas que se le pueden hacer a una prueba. El último las junta.",
    true,
    { subtitleW: 11.2 }
  );

  const bloques = [
    ["1", "08:40", "Dos preguntas sobre la misma prueba", "De qué modelo salió el caso, y qué recorrió la suite"],
    ["2", "09:10", "El 100 % que no verifica nada", "Sentencias y ramas, y la prueba que recorre sin afirmar"],
    ["3", "09:45", "El sustituto que ocupa el lugar", "Los cinco dobles, y dónde dejan de representar"],
    ["4", "10:15", "Auditar una suite que uno no escribió", "Tres criterios y cuatro decisiones"],
  ];

  bloques.forEach(([n, hora, titulo, glosa], i) => {
    const y = 2.48 + i * 0.78;
    rect(slide, M, y, CW, 0.66, i % 2 === 0 ? NAVY_CHIP : C.navy);
    rect(slide, M, y, 0.06, 0.66, C.gold);
    addText(slide, n, {
      x: M + 0.3,
      y: y + 0.12,
      w: 0.4,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: C.gold,
    });
    addText(slide, hora, {
      x: M + 0.86,
      y: y + 0.2,
      w: 0.8,
      h: 0.26,
      fontSize: 11.4,
      bold: true,
      color: C.sand,
    });
    addText(slide, titulo, {
      x: M + 1.84,
      y: y + 0.08,
      w: 5.0,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: C.white,
    });
    addText(slide, glosa, {
      x: M + 1.84,
      y: y + 0.36,
      w: 9.6,
      h: 0.24,
      fontSize: 11.2,
      color: C.softBlue,
    });
  });

  rect(slide, M, 5.66, CW, 0.62, NAVY_CHIP);
  addText(
    slide,
    "Hoy además cierra el plazo de envío de la Evaluación Parcial 1. Es fecha de entrega, no ocupa sesión.",
    {
      x: M + 0.3,
      y: 5.78,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 12.6,
      bold: true,
      color: C.gold,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

// ================================================ 07 CÓMO SE LEE EL CÓDIGO

function slideComoSeLee() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Antes de empezar",
    "Los tres paneles que van a aparecer",
    "Conviene reconocerlos de entrada, porque toda la sesión se apoya en leerlos.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 3.4,
    h: 1.3,
    title: "Panel de código",
    code: "def bloque_valido(b):\n    return 1 <= b <= 8",
    lang: "python",
    fontSize: 10,
  });

  addTerminalPanel(slide, SH, {
    x: 4.34,
    y: 2.6,
    w: 3.4,
    h: 1.3,
    title: "Panel de terminal",
    fontSize: 9.8,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "12 passed in 0.04s", kind: "success" },
    ],
  });

  addInformeCobertura(slide, 8.68, 2.6, 3.93, {
    titulo: "Informe de cobertura",
    cols: ["Name", "Stmts", "Miss", "Cover"],
    anchos: [1.44, 0.82, 0.72, 0.73],
    align: ["left", "right", "right", "right"],
    rows: [["reservas.py", "17", "2", "88%"]],
    fontSize: 9.8,
    rowH: 0.28,
    padBottom: 0.36,
  });

  // Cada ficha se alinea exactamente con el panel que describe.
  const glosas = [
    [M, 3.4, "Panel de código", "Lo que está escrito en el proyecto. Se lee antes de ejecutar nada.", AZUL],
    [4.34, 3.4, "Panel de terminal", "Lo que la máquina contestó. Siempre es salida literal, nunca inventada.", VERDE],
    [8.68, 3.93, "Informe de cobertura", "Lo que se ejecutó mientras las pruebas corrían. Es nuevo en esta sesión.", ORO],
  ];

  glosas.forEach(([x, w, titulo, glosa, color], i) => {
    rect(slide, x, 4.16, w, 0.9, C.white);
    rect(slide, x, 4.16, 0.06, 0.9, color);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 4.26,
      w: w - 0.44,
      h: 0.24,
      fontSize: 12,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 4.52,
      w: w - 0.44,
      h: 0.46,
      fontSize: 11,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addPasosLectura(slide, M, 5.3, 0, { w: 1.5 });
  addText(
    slide,
    "El orden de trabajo con cualquier panel de código: leerlo, anticipar qué va a pasar, y recién entonces ejecutar.",
    {
      x: M + 5.0,
      y: 5.3,
      w: CW - 5.0,
      h: 0.3,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "Ninguna cifra de este deck es de memoria: todas salieron de ejecutar el proyecto con Python 3.12.12 y pytest 9.1.1.",
    { y: 5.88, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

// ================================================================= BLOQUE 1

function slideDivisorB1() {
  slideDivisor(
    1,
    "Dos preguntas sobre\nla misma prueba",
    "Una prueba se puede mirar por lo que comprueba o por lo que recorre. No son la misma pregunta, y hasta hoy solo se trabajó la primera.",
    2
  );
}

function slideDijkstraAbierta() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 1 · el punto de partida",
    "La frase que quedó sin responder",
    "Dijkstra, después de calcular que probar un multiplicador de 27 bits por fuerza bruta tomaría diez mil años:",
    true,
    { subtitleW: 11.2 }
  );

  addCita(
    slide,
    M,
    2.62,
    CW,
    0.96,
    "A convincing demonstration of correctness being impossible as long as the mechanism is regarded as a black box, our only hope lies in not regarding the mechanism as a black box.",
    { fill: NAVY_CHIP, accent: C.gold, color: C.white, fontSize: 13.4 }
  );

  addCita(
    slide,
    M,
    3.74,
    CW,
    0.86,
    "Siendo imposible una demostración convincente de corrección mientras el mecanismo se considere una caja negra, nuestra única esperanza está en no considerarlo una caja negra.",
    { fill: C.navy, accent: C.sand, color: C.sand, fontSize: 12.8 }
  );

  rect(slide, M, 4.78, CW, 0.78, NAVY_CHIP);
  addText(
    slide,
    "Las tres técnicas de la sesión pasada hacen exactamente lo contrario de lo que Dijkstra recomienda: tratan el programa como una caja cerrada. Funcionaron. La frase, en cambio, sigue en pie.",
    {
      x: M + 0.3,
      y: 4.9,
      w: CW - 0.6,
      h: 0.56,
      fontSize: 13,
      color: C.white,
      valign: "mid",
      lineSpacingMultiple: 1.14,
    }
  );

  addFuente(
    slide,
    M,
    5.78,
    "Edsger W. Dijkstra · Notes on Structured Programming (EWD249), 1970",
    { color: C.gold, textColor: C.sand, w: 8.5 }
  );

  validateSlide(slide, pptx);
}

function slideSuiteCorregida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · dónde estamos",
    "El proyecto llega corregido y la suite, en verde",
    "El defecto del bloque 8 se arregló: bloque_valido() ahora compara con <= y la jornada del 1 al 8 quedó completa.",
    false,
    { subtitleW: 7.9, subtitleH: 0.5 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.5,
    h: 1.96,
    title: "reservas.py · la corrección",
    code: [
      "BLOQUE_MIN = 1",
      "BLOQUE_MAX = 8",
      "",
      "def bloque_valido(bloque: int) -> bool:",
      "    return BLOQUE_MIN <= bloque <= BLOQUE_MAX",
    ].join("\n"),
    lang: "python",
    fontSize: 10.6,
  });

  addTerminalPanel(slide, SH, {
    x: 8.42,
    y: 2.56,
    w: 4.19,
    h: 1.52,
    title: "La suite de la sesión pasada",
    fontSize: 10,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "............     [100%]", kind: "muted" },
      { text: "12 passed in 0.04s", kind: "success" },
    ],
  });

  rect(slide, 8.42, 4.22, 4.19, 0.3, C.softBlue);
  addText(slide, "3 particiones · 4 límites · 5 de tabla de decisión", {
    x: 8.6,
    y: 4.24,
    w: 3.9,
    h: 0.26,
    fontSize: 10.8,
    color: C.ink,
    valign: "mid",
  });

  addTakeaway(
    slide,
    "Doce casos y los doce pasan. Desde aquí, decir que la suite está «en verde» solo significa que ninguna prueba falló.",
    { y: 4.78, h: 0.56 }
  );

  addText(
    slide,
    "La pregunta que sigue no es cuántas pruebas hay ni si pasan, sino qué partes del programa se ejecutaron mientras pasaban. Eso no se puede responder leyendo la suite: hay que medirla.",
    {
      x: M,
      y: 5.52,
      w: CW,
      h: 0.6,
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  validateSlide(slide, pptx);
}

function slideDosPalabras() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · vocabulario",
    "Dos palabras que van a trabajar todo el día",
    "Se usan desde la primera clase, pero hoy hay que tenerlas exactas: la diferencia entre ambas es la tesis de la sesión.",
    false,
    { subtitleW: 11.2 }
  );

  addDefinicion(
    slide,
    M,
    2.6,
    5.9,
    "Suite",
    "El conjunto completo de pruebas que se ejecutan juntas. Los doce casos del proyecto son una suite.",
    { accent: AZUL, h: 1.14 }
  );

  addDefinicion(
    slide,
    6.78,
    2.6,
    5.83,
    "Aserción",
    "La línea que compara lo obtenido con lo esperado y decide si la prueba pasa o falla. En Python, la que empieza con assert.",
    { accent: ORO, h: 1.14 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 4.0,
    w: 11.89,
    h: 1.3,
    title: "Una prueba, y dentro de ella su aserción",
    code: "def test_un_bloque_de_la_jornada_es_valido():\n    assert bloque_valido(4) is True",
    lang: "python",
    fontSize: 11.5,
  });

  rect(slide, M, 5.46, CW, 0.66, C.paleRed);
  rect(slide, M, 5.46, 0.06, 0.66, ROJO);
  addText(
    slide,
    "De ahí se sigue algo que parece obvio y no lo es: una prueba SIN aserción se ejecuta igual que las demás, pero no tiene con qué fallar.",
    {
      x: M + 0.3,
      y: 5.56,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addTakeaway(
    slide,
    "Esa frase es el eje del Bloque 2. Por ahora basta con que quede escrita.",
    { y: 6.28, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

function slideLaDicotomia() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · lo que se suele enseñar",
    "La tabla de dos columnas",
    "Casi todo el material de testing enseña esta dicotomía, y con frecuencia le agrega dos afirmaciones más.",
    false,
    { subtitleW: 11.2 }
  );

  const cols = [
    ["Caja negra", "No se mira el código. Se prueban entradas y salidas contra lo que el sistema debe hacer.", AZUL],
    ["Caja blanca", "Se mira el código por dentro. Se prueban sus caminos, sus condiciones, sus ramas.", ORO],
  ];

  cols.forEach(([titulo, glosa, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.6, 5.66, 1.32, C.white);
    rect(slide, x, 2.6, 5.66, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.78,
      w: 5.1,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 3.2,
      w: 5.1,
      h: 0.56,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addKicker(slide, M, 4.14, "Las dos afirmaciones que suelen venir de regalo", ROJO, 7);

  const extras = [
    "«Las de caja negra las hace el área de pruebas; las de caja blanca, el programador.»",
    "«Son dos tipos de prueba distintos.»",
  ];

  extras.forEach((texto, i) => {
    const y = 4.44 + i * 0.6;
    rect(slide, M, y, CW, 0.5, C.paleRed);
    rect(slide, M, y, 0.06, 0.5, ROJO);
    addText(slide, texto, {
      x: M + 0.3,
      y: y + 0.04,
      w: CW - 0.6,
      h: 0.42,
      fontSize: 13,
      italic: true,
      color: C.ink,
      valign: "mid",
    });
  });

  addTakeaway(
    slide,
    "Antes de repetirlo: las dos afirmaciones no aparecen en ninguna de las dos fuentes que definen esto. Vamos a verlas.",
    { y: 5.76, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideHallazgoUno() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · hallazgo 1 de 3",
    "Los dos vocabularios nombran lo mismo",
    "ISTQB es el organismo internacional de certificación de testers: su glosario es el vocabulario de uso corriente en la industria.",
    false,
    { subtitleW: 11.2 }
  );

  addCita(
    slide,
    M,
    2.6,
    CW,
    0.86,
    "a procedure to derive and/or select test cases based on an analysis of the specification, either functional or non-functional, of a component or system without reference to its internal structure",
    { accent: AZUL, fontSize: 12.4 }
  );

  addCita(
    slide,
    M,
    3.58,
    CW,
    0.86,
    "un procedimiento para derivar y/o seleccionar casos de prueba a partir del análisis de la especificación, funcional o no funcional, de un componente o sistema, sin referencia a su estructura interna",
    { fill: C.softNeutral, accent: C.slate, fontSize: 12.4 }
  );

  rect(slide, M, 4.62, CW, 0.78, C.white);
  addText(slide, "black-box test technique", {
    x: M + 0.3,
    y: 4.76,
    w: 3.4,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    bold: true,
    color: AZUL,
  });
  addText(slide, "=", {
    x: M + 3.8,
    y: 4.72,
    w: 0.4,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: ORO,
    align: "center",
  });
  addText(slide, "specification-based test technique", {
    x: M + 4.3,
    y: 4.76,
    w: 4.2,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    bold: true,
    color: AZUL,
  });
  addText(slide, "registrados como sinónimos", {
    x: M + 8.7,
    y: 4.78,
    w: 3.0,
    h: 0.28,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
  });

  addTakeaway(
    slide,
    "No son dos clasificaciones distintas: «caja negra» y «basada en la especificación» son dos nombres del mismo grupo.",
    { y: 5.62, h: 0.58 }
  );

  addFuente(slide, M, 6.4, "Glosario de ISTQB · black-box test technique", { w: 7.5 });

  validateSlide(slide, pptx);
}

function slideHallazgoDos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · hallazgo 2 de 3",
    "La clasificación no tiene dos categorías: tiene tres",
    "La cláusula 5 de la norma que rige el diseño de casos de prueba se divide así.",
    false,
    { subtitleW: 11.2 }
  );

  const familias = [
    ["5.2", "Specification-based", "Basadas en la especificación", "Partición, valores límite, tabla de decisión, transición de estados y otras: doce técnicas", AZUL],
    ["5.3", "Structure-based", "Basadas en la estructura", "Pruebas de sentencias, ramas y decisiones, más otras cuatro: siete técnicas", ORO],
    ["5.4", "Experience-based", "Basadas en la experiencia", "Conjetura de errores: anticipar dónde es probable que haya un error", ROJO],
  ];

  familias.forEach(([clausula, ingles, espanol, contenido, color], i) => {
    const y = 2.56 + i * 1.04;
    rect(slide, M, y, CW, 0.92, i === 2 ? C.paleRed : C.white);
    rect(slide, M, y, 0.06, 0.92, color);
    addText(slide, clausula, {
      x: M + 0.3,
      y: y + 0.14,
      w: 0.7,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
    });
    addText(slide, ingles, {
      x: M + 1.2,
      y: y + 0.12,
      w: 3.5,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.6,
      italic: true,
      color: C.slate,
    });
    addText(slide, espanol, {
      x: M + 1.2,
      y: y + 0.42,
      w: 3.5,
      h: 0.3,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, contenido, {
      x: M + 5.0,
      y: y + 0.2,
      w: CW - 5.3,
      h: 0.54,
      fontSize: 12.2,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.74, CW, 0.56, C.navy);
  addText(
    slide,
    "La tercera familia NO TIENE COLOR. Y ahí vive buena parte del trabajo real de prueba.",
    {
      x: M + 0.3,
      y: 5.82,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: C.gold,
      valign: "mid",
    }
  );

  addFuente(
    slide,
    M,
    6.54,
    "ISO/IEC/IEEE 29119-4:2021, cláusula 5 · el programa Foundation de ISTQB clasifica igual",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideHallazgoTres() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 1 · hallazgo 3 de 3",
    "Y la propia norma agrega una caja más",
    "La misma ISO/IEC/IEEE 29119-4:2021 que clasifica las tres familias cierra con ocho anexos. El quinto se titula así:",
    true,
    { subtitleW: 11.2 }
  );

  rect(slide, M, 2.5, CW, 1.5, NAVY_CHIP);
  rect(slide, M, 2.5, 0.07, 1.5, C.gold);
  addText(slide, "Anexo E", {
    x: M + 0.34,
    y: 2.68,
    w: 2.3,
    h: 0.46,
    fontFace: TYPOGRAPHY.display,
    fontSize: 30,
    bold: true,
    color: C.gold,
  });
  addText(slide, "(informativo)", {
    x: M + 0.34,
    y: 3.16,
    w: 2.3,
    h: 0.26,
    fontSize: 11.4,
    italic: true,
    color: C.terminalMuted,
  });

  addText(
    slide,
    "Guidelines and examples for the application of grey-box test design techniques",
    {
      x: M + 3.0,
      y: 2.7,
      w: 8.5,
      h: 0.56,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );
  rule(slide, M + 3.0, 3.18, 8.5, NAVY_RULE, 1);
  addText(
    slide,
    "Directrices y ejemplos para aplicar técnicas de diseño de pruebas de CAJA GRIS.",
    {
      x: M + 3.0,
      y: 3.32,
      w: 8.5,
      h: 0.52,
      fontSize: 13.2,
      bold: true,
      color: C.gold,
      lineSpacingMultiple: 1.16,
    }
  );

  addText(
    slide,
    "«Informativo» quiere decir que el anexo orienta pero no obliga: lo exigible de la norma son las cláusulas 5 y 6.",
    {
      x: M,
      y: 4.12,
      w: 11.4,
      h: 0.28,
      fontSize: 12,
      italic: true,
      color: C.sand,
    }
  );

  addFuente(
    slide,
    M,
    4.5,
    "ISO/IEC/IEEE 29119-4:2021 · índice de anexos · Anexo E",
    { color: C.gold, textColor: C.sand, w: 7.5 }
  );

  addKicker(slide, M, 4.98, "El veredicto", C.gold, 3);
  addText(slide, "La dicotomía no es falsa. Es incompleta.", {
    x: M,
    y: 5.24,
    w: 11.2,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 28,
    bold: true,
    color: C.white,
  });
  addText(
    slide,
    "Hay una tercera familia sin color, y una cuarta caja que ni siquiera es blanca ni negra. Quien aprendió la tabla de dos columnas como la clasificación completa tiene un hueco justo donde viven las técnicas que dependen del criterio de quien prueba.",
    {
      x: M,
      y: 5.8,
      w: 11.4,
      h: 0.62,
      fontSize: 13.4,
      color: C.softBlue,
      lineSpacingMultiple: 1.16,
    }
  );

  rule(slide, M, 6.5, CW, NAVY_RULE, 1);
  addText(
    slide,
    "Ni la norma ni el glosario dicen quién ejecuta cada técnica, ni en qué etapa, ni las presentan como dos tipos de prueba.",
    {
      x: M,
      y: 6.62,
      w: 11.4,
      h: 0.28,
      fontSize: 12.4,
      italic: true,
      color: C.sand,
    }
  );

  validateSlide(slide, pptx);
}

function slideModeloDePrueba() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la distinción que sí sobrevive",
    "Un modelo de prueba es aquello que se mira para inventar los casos",
    "Si no es quién la escribe ni cuándo se ejecuta, ¿qué separa una familia de la otra? La norma lo responde con un término propio.",
    false,
    { subtitleW: 11.2, titleFontSize: 26 }
  );

  addCita(
    slide,
    M,
    2.6,
    CW,
    0.6,
    "representación del elemento sometido a prueba, que permite enfocar la prueba en características o cualidades particulares",
    { accent: AZUL, fontSize: 12.8 }
  );
  addFuente(slide, M, 3.28, "ISO/IEC/IEEE 29119-4:2021, cláusula 3.54 · test model", {
    w: 6.5,
  });

  addKicker(slide, M, 3.68, "Los ejemplos que da la propia norma", ORO, 6);

  const ejemplos = [
    ["Enunciados de requisitos", true],
    ["Particiones de equivalencia", true],
    ["Diagrama de transición de estados", true],
    ["Tabla de decisión", true],
    ["Código fuente", false],
    ["Grafo de flujo de control", false],
    ["Parámetros y valores", true],
    ["Árbol de clasificación", true],
  ];

  ejemplos.forEach(([texto, esEspec], i) => {
    const col = i % 4;
    const fila = Math.floor(i / 4);
    const x = M + col * 3.02;
    const y = 4.0 + fila * 0.56;
    const color = esEspec ? AZUL : ROJO;
    rect(slide, x, y, 2.86, 0.46, esEspec ? C.white : C.paleRed);
    rect(slide, x, y, 0.05, 0.46, color);
    addText(slide, texto, {
      x: x + 0.2,
      y: y + 0.03,
      w: 2.56,
      h: 0.4,
      fontSize: 11.2,
      bold: !esEspec,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 5.3, CW, 0.62, C.warm);
  rect(slide, M, 5.3, 0.06, 0.62, ORO);
  addText(
    slide,
    "En la misma lista conviven los enunciados de requisitos y el código fuente: los dos son modelos legítimos. Lo que cambia entre las familias es CUÁL DE LOS DOS se usó para derivar el caso.",
    {
      x: M + 0.3,
      y: 5.4,
      w: CW - 0.6,
      h: 0.44,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addTakeaway(
    slide,
    "Caja negra y caja blanca no describen dos calidades de prueba: describen de dónde salió el caso.",
    { y: 6.12, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideTresDefiniciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · las definiciones, una por una",
    "Cada técnica declara de qué modelo deriva",
    "Dos términos antes de leerlas: «test item» es el elemento sometido a prueba —aquí, una función—, y «exercising» es ejercitar, hacer pasar la ejecución por algo.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5 }
  );

  const defs = [
    [
      "3.29 · Partición de equivalencia",
      "specification-based test case design technique based on exercising equivalence partitions",
      "Técnica de diseño de casos basada en la ESPECIFICACIÓN, que ejercita particiones de equivalencia",
      AZUL,
    ],
    [
      "3.45 · Statement testing",
      "structure-based test case design technique based on exercising executable statements in the source code of the test item",
      "Técnica basada en la ESTRUCTURA, que ejercita las sentencias ejecutables DEL CÓDIGO FUENTE del elemento sometido a prueba",
      ORO,
    ],
    [
      "3.6 · Branch testing",
      "structure-based test case design technique based on exercising branches in the control flow of the test item",
      "Técnica basada en la ESTRUCTURA, que ejercita las RAMAS del flujo de control del elemento sometido a prueba",
      ORO,
    ],
  ];

  defs.forEach(([titulo, ingles, espanol, color], i) => {
    const y = 2.62 + i * 1.16;
    rect(slide, M, y, CW, 1.04, C.white);
    rect(slide, M, y, 0.06, 1.04, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.1,
      w: 3.6,
      h: 0.26,
      fontSize: 12.4,
      bold: true,
      color,
    });
    addText(slide, `“${ingles}”`, {
      x: M + 0.3,
      y: y + 0.4,
      w: 7.2,
      h: 0.54,
      fontSize: 10.8,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    vrule(slide, M + 7.72, y + 0.14, 0.76, C.border, 0.8);
    addText(slide, espanol, {
      x: M + 7.94,
      y: y + 0.24,
      w: CW - 8.24,
      h: 0.6,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(
    slide,
    "Una familia mira el documento. La otra mira el código. Esa es toda la diferencia.",
    { y: 6.16, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideElEsperado() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la trampa que deja abierta la norma",
    "De dónde puede salir un resultado esperado",
    "La cláusula 3.32 define el resultado esperado, y en el medio deja una puerta.",
    false,
    { subtitleW: 11.2 }
  );

  addCita(
    slide,
    M,
    2.48,
    CW,
    0.56,
    "observable predicted behaviour of the test item under specified conditions based on its specification or another source",
    { accent: AZUL, fontSize: 12.4 }
  );

  addCita(
    slide,
    M,
    3.1,
    CW,
    0.56,
    "comportamiento observable y predicho del elemento sometido a prueba, bajo condiciones especificadas, basado en su especificación O EN OTRA FUENTE",
    { fill: C.softNeutral, accent: C.slate, fontSize: 12.4 }
  );

  rect(slide, 7.4, 3.78, 5.21, 0.42, C.paleRed);
  addText(slide, "«or another source»  ·  u otra fuente", {
    x: 7.6,
    y: 3.8,
    w: 4.9,
    h: 0.38,
    fontSize: 12.4,
    bold: true,
    color: ROJO,
    valign: "mid",
  });

  const casos = [
    ["Si el esperado sale del REQUISITO", "La prueba puede refutar la implementación. Si el código está mal, la prueba falla.", VERDE],
    ["Si el esperado sale del CÓDIGO", "La prueba confirma la implementación. Si el código está mal, la prueba también.", ROJO],
  ];

  casos.forEach(([titulo, glosa, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 4.36, 5.66, 1.06, C.white);
    rect(slide, x, 4.36, 5.66, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.52,
      w: 5.1,
      h: 0.28,
      fontSize: 12.6,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 4.84,
      w: 5.1,
      h: 0.5,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.6, CW, 0.5, C.warm);
  rect(slide, M, 5.6, 0.06, 0.5, ORO);
  addText(
    slide,
    "Ya se vio en la sesión pasada: cuando los límites y sus esperados se copiaron del código, la prueba confirmó el defecto en lugar de encontrarlo.",
    {
      x: M + 0.3,
      y: 5.66,
      w: CW - 0.6,
      h: 0.38,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "Derivar el CASO del código es legítimo y tiene una familia entera dedicada. Derivar el ESPERADO del código es lo que anula la prueba.",
    { y: 6.24, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideElCriterioCompleto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el criterio, completo",
    "Qué puede afirmar cada familia, y qué no",
    "Esta tabla es la herramienta que se va a usar para auditar cualquier prueba del resto de la sesión.",
    false,
    { subtitleW: 11.2 }
  );

  const filas = [
    ["Modelo de prueba", "El requisito, la tabla de decisión, el diagrama de estados", "El código fuente, el grafo de flujo de control"],
    ["Qué puede afirmar", "Que el comportamiento exigido ocurre", "Que ese camino del programa se ejecutó"],
    ["Qué no detecta", "Código que el requisito no menciona y que nadie recorrió", "Un requisito que el código nunca implementó"],
    ["De dónde sale el esperado", "Del requisito", "Del requisito, también"],
  ];

  rect(slide, M + 3.3, 2.56, 4.5, 0.42, AZUL);
  addText(slide, "Derivada de la especificación", {
    x: M + 3.5,
    y: 2.6,
    w: 4.1,
    h: 0.34,
    fontSize: 12.4,
    bold: true,
    color: C.white,
    valign: "mid",
  });
  rect(slide, M + 7.9, 2.56, 4.0, 0.42, ORO);
  addText(slide, "Derivada de la estructura", {
    x: M + 8.1,
    y: 2.6,
    w: 3.6,
    h: 0.34,
    fontSize: 12.4,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  filas.forEach(([etiqueta, izq, der], i) => {
    const y = 3.06 + i * 0.74;
    const ultima = i === filas.length - 1;
    rect(slide, M, y, CW, 0.66, ultima ? C.warm : i % 2 === 0 ? C.white : C.softNeutral);
    addText(slide, etiqueta, {
      x: M + 0.24,
      y: y + 0.08,
      w: 3.0,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: C.slate,
      valign: "mid",
    });
    addText(slide, izq, {
      x: M + 3.5,
      y: y + 0.08,
      w: 4.2,
      h: 0.5,
      fontSize: 11.8,
      bold: ultima,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    addText(slide, der, {
      x: M + 8.1,
      y: y + 0.08,
      w: 3.7,
      h: 0.5,
      fontSize: 11.8,
      bold: ultima,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    vrule(slide, M + 3.3, y, 0.66, C.border, 0.8);
    vrule(slide, M + 7.9, y, 0.66, C.border, 0.8);
  });

  addTakeaway(
    slide,
    "La última fila es la que más cuesta: una prueba estructural sigue necesitando un esperado de origen externo. El código dice qué caminos existen, no cuál es el resultado correcto.",
    { y: 6.12, h: 0.6, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideElComando() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la primera medición",
    "Qué hace exactamente cada parte del comando",
    "pytest ejecuta las pruebas. Su extensión pytest-cov mide qué código recorrieron y aplica la medida de cobertura de sentencias descrita en la cláusula 6.3.1 de la norma.",
    false,
    { subtitleW: 11.2 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 11.89,
    h: 1.3,
    title: "Instalar y medir",
    fontSize: 11.5,
    lines: [
      { prompt: ">", text: "uv add --dev pytest pytest-cov" },
      { prompt: ">", text: "uv run pytest --cov=reservas --cov-report=term-missing -q" },
    ],
  });

  const partes = [
    ["uv add --dev", "Instala el paquete como dependencia DE DESARROLLO: hace falta para probar, no para que el proyecto funcione."],
    ["--cov=reservas", "Qué módulo medir. Sin esto mediría también las bibliotecas ajenas y el número no diría nada."],
    ["--cov-report=term-missing", "Qué informe imprimir: en el terminal, incluyendo LA LISTA DE LÍNEAS NO CUBIERTAS."],
    ["-q", "Modo silencioso: acorta la salida de pytest para que el informe se lea sin ruido."],
  ];

  partes.forEach(([flag, glosa], i) => {
    const y = 4.02 + i * 0.58;
    rect(slide, M, y, CW, 0.5, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.5, i === 2 ? ORO : AZUL);
    addText(slide, flag, {
      x: M + 0.24,
      y: y + 0.04,
      w: 3.1,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.4,
      bold: true,
      color: i === 2 ? ORO : AZUL,
      valign: "mid",
    });
    addText(slide, glosa, {
      x: M + 3.5,
      y: y + 0.04,
      w: CW - 3.8,
      h: 0.42,
      fontSize: 11.8,
      color: C.ink,
      valign: "mid",
    });
  });

  addTakeaway(
    slide,
    "term-missing no es un detalle de formato: es la diferencia entre ver un porcentaje y ver qué código quedó sin probar.",
    { y: 6.42, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

function slideElInforme() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · leer el informe",
    "Cinco columnas: cada una mide algo distinto",
    "Salida literal de la medición sobre el proyecto de reserva, con la suite de doce casos.",
    false,
    { subtitleW: 11.2 }
  );

  addInformeCobertura(slide, M, 2.5, 11.89, {
    cols: ["Name", "Stmts", "Miss", "Cover", "Missing"],
    // La última columna va encendida, así que la anterior necesita aire para
    // que su valor no quede pegado al borde de la banda.
    anchos: [3.3, 1.45, 1.45, 1.9, 3.0],
    align: ["left", "right", "right", "right", "left"],
    rows: [
      ["reservas.py", "17", "2", "88%", "22, 26"],
      ["TOTAL", "17", "2", "88%", ""],
    ],
    fontSize: 13,
    rowH: 0.34,
    destacar: 4,
  });

  const cols = [
    ["Stmts", "Sentencias ejecutables del archivo: 17. No son las 26 líneas del archivo.", C.slate],
    ["Miss", "Sentencias que NINGUNA de las 12 pruebas ejecutó: 2.", C.slate],
    ["Cover", "El cociente: 15 de 17, redondeado a 88 %.", C.slate],
    ["Missing", "Los números de línea de esas dos sentencias. La única columna con la que se puede hacer algo.", ORO],
  ];

  cols.forEach(([titulo, glosa, color], i) => {
    const x = M + i * 3.0;
    const destacada = i === 3;
    rect(slide, x, 4.28, 2.84, 1.14, destacada ? C.warm : C.white);
    rect(slide, x, 4.28, 0.05, 1.14, destacada ? ORO : C.border);
    addText(slide, titulo, {
      x: x + 0.22,
      y: 4.4,
      w: 2.5,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12.4,
      bold: true,
      color: destacada ? ORO : C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 4.7,
      w: 2.5,
      h: 0.62,
      fontSize: 11,
      color: destacada ? C.ink : color,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "El porcentaje es un subproducto. El hallazgo es la lista de líneas.",
    { y: 5.62, h: 0.54 }
  );

  addFuente(
    slide,
    M,
    6.3,
    "Ejecución propia · Python 3.12.12 · pytest 9.1.1 · pytest-cov 7.1.0 · coverage 7.16.1",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideLasDosLineas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · qué son 22 y 26",
    "Las dos líneas no ejecutadas tienen nombre",
    "La columna Missing decía «22, 26». Eso en el archivo es esto:",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.5,
    h: 1.96,
    title: "reservas.py · líneas 21 a 26",
    code: [
      "def puede_cancelar(inicio_bloque, ahora):",
      "    return inicio_bloque - ahora > ANTICIPACION   # 22",
      "",
      "def comprobante(nombre, rut, correo, bloque):",
      '    return f"{nombre} | {rut} | ..."              # 26',
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, 8.42, 2.5, 4.19, 1.96, C.paleRed);
  rect(slide, 8.42, 2.5, 0.07, 1.96, ROJO);
  addText(slide, "2 de 4", {
    x: 8.72,
    y: 2.66,
    w: 3.6,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Las dos sentencias no ejecutadas son los cuerpos completos de dos de las cuatro funciones del proyecto.\n\nLa suite que se defendió con tres técnicas nunca las llamó.",
    {
      x: 8.72,
      y: 3.2,
      w: 3.6,
      h: 1.1,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  rect(slide, M, 4.66, CW, 0.56, C.navy);
  addText(
    slide,
    "Y comprobante() no es una función cualquiera: es la que la auditoría marcó como hallazgo por exponer el identificador nacional chileno (RUT) completo.",
    {
      x: M + 0.3,
      y: 4.74,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
    }
  );

  addText(
    slide,
    "88 % suena bien. Dos de cuatro funciones sin una sola ejecución, no. Son la misma medición.",
    {
      x: M,
      y: 5.4,
      w: CW,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: C.ink,
      align: "center",
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "La cobertura sirve para encontrar lo que nadie probó. Para eso, y no para poner una nota.",
    { y: 5.94, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideFowler() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 1 · el uso correcto",
    "Para qué sirve la cobertura, y para qué no",
    "",
    true
  );

  addCita(
    slide,
    M,
    2.3,
    CW,
    0.78,
    "Test coverage is a useful tool for finding untested parts of a codebase.",
    { fill: NAVY_CHIP, accent: VERDE, color: C.white, fontSize: 15 }
  );
  addText(
    slide,
    "La cobertura de pruebas es una herramienta útil para encontrar las partes de un código que no están probadas.",
    { x: M + 0.34, y: 3.18, w: 11.2, h: 0.3, fontSize: 12.4, color: C.sand }
  );

  addCita(
    slide,
    M,
    3.66,
    CW,
    0.78,
    "Test coverage is of little use as a numeric statement of how good your tests are.",
    { fill: NAVY_CHIP, accent: C.red, color: C.white, fontSize: 15 }
  );
  addText(
    slide,
    "La cobertura de pruebas sirve de poco como afirmación numérica sobre qué tan buenas son tus pruebas.",
    { x: M + 0.34, y: 4.54, w: 11.2, h: 0.3, fontSize: 12.4, color: C.sand }
  );

  rect(slide, M, 5.06, CW, 0.62, C.gold);
  addText(
    slide,
    "La columna útil es Missing, no Cover.",
    {
      x: M + 0.3,
      y: 5.14,
      w: CW - 0.6,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "mid",
    }
  );

  addFuente(slide, M, 5.94, "Martin Fowler · Test Coverage · 17 de abril de 2012", {
    color: C.gold,
    textColor: C.sand,
    w: 8.5,
  });

  validateSlide(slide, pptx);
}

function slideCoberturaNoEsSoloLineas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · una precisión de vocabulario",
    "«Cobertura» no significa «porcentaje de líneas»",
    "El uso corriente recortó la palabra. La cláusula 6.2 de la norma define medidas de cobertura para las técnicas basadas en la ESPECIFICACIÓN.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5 }
  );

  const medidas = [
    ["6.2.1", "Equivalence partition coverage", "Cobertura de particiones de equivalencia", AZUL],
    ["6.2.3", "Boundary value analysis coverage", "Cobertura de valores límite", AZUL],
    ["6.2.6", "Decision table testing coverage", "Cobertura de tabla de decisión", AZUL],
    ["6.3.1", "Statement testing coverage", "Cobertura de sentencias  ← la que mide la herramienta", ORO],
  ];

  medidas.forEach(([clausula, ingles, espanol, color], i) => {
    const y = 2.74 + i * 0.66;
    const destacada = i === 3;
    rect(slide, M, y, CW, 0.56, destacada ? C.warm : C.white);
    rect(slide, M, y, 0.06, 0.56, color);
    addText(slide, clausula, {
      x: M + 0.3,
      y: y + 0.04,
      w: 0.8,
      h: 0.48,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 12,
      bold: true,
      color,
      valign: "mid",
    });
    addText(slide, ingles, {
      x: M + 1.3,
      y: y + 0.04,
      w: 4.4,
      h: 0.48,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.2,
      italic: true,
      color: C.slate,
      valign: "mid",
    });
    addText(slide, espanol, {
      x: M + 6.0,
      y: y + 0.04,
      w: CW - 6.3,
      h: 0.48,
      fontSize: 12,
      bold: destacada,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 5.5, CW, 0.62, C.softBlue);
  rect(slide, M, 5.5, 0.06, 0.62, AZUL);
  addText(
    slide,
    "Cuando la sesión pasada dijimos «la tabla tiene representación de las tres clases de bloque», estábamos informando cobertura de particiones sin usar la palabra.",
    {
      x: M + 0.3,
      y: 5.6,
      w: CW - 0.6,
      h: 0.44,
      fontSize: 12.8,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addTakeaway(
    slide,
    "La cifra que entrega la herramienta es UNA medida de cobertura entre muchas, y es la que menos sabe del requisito.",
    { y: 6.3, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

function slideElAgenteDeriva() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la era de los agentes",
    "Pedirle pruebas a un agente le entrega el código como modelo",
    "Si se le abre un archivo y se le dice «escribe las pruebas de esto», el modelo de prueba que recibe es el código fuente. Por la taxonomía de la norma, está derivando de forma estructural.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5, titleFontSize: 26 }
  );

  const items = [
    ["Lo que hace bien", "Enumerar caminos del código, alcanzar sentencias que nadie recorrió, proponer nombres y escribir la parametrización.", VERDE],
    ["Lo que no conviene delegar", "El resultado esperado, siempre que el único modelo que tuvo delante haya sido el código.", ORO],
    ["El error frecuente", "Una prueba que pasa el primer día y no puede fallar nunca, porque afirma lo que el código ya hace. Sube la cobertura y no agrega evidencia.", ROJO],
  ];

  items.forEach(([titulo, glosa, color], i) => {
    const y = 2.86 + i * 0.94;
    rect(slide, M, y, CW, 0.82, i === 2 ? C.paleRed : C.white);
    rect(slide, M, y, 0.06, 0.82, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.1,
      w: 3.4,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: M + 3.9,
      y: y + 0.12,
      w: CW - 4.2,
      h: 0.6,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.7, CW, 0.62, C.navy);
  addText(
    slide,
    "Y su resultado esperado sale de «otra fuente», en el sentido exacto de la cláusula 3.32: la implementación que tiene a la vista.",
    {
      x: M + 0.3,
      y: 5.78,
      w: CW - 0.6,
      h: 0.46,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

function slideTestGenLLM() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 1 · qué hace la industria con eso",
    "TestGen-LLM: generar es barato; filtrar es el trabajo",
    "Meta publicó en febrero de 2024 la descripción de una herramienta que usa modelos de lenguaje para mejorar pruebas unitarias ya escritas por personas.",
    true,
    { subtitleW: 11.4, subtitleH: 0.5, titleFontSize: 26 }
  );

  const cifras = [
    ["75 %", "de las pruebas generadas compiló", C.sand],
    ["57 %", "de las pruebas generadas pasó de forma fiable", C.sand],
    ["25 %", "de los casos aumentó la cobertura", C.gold],
    ["73 %", "de las recomendaciones fue aceptado para producción", C.sand],
  ];

  cifras.forEach(([cifra, glosa, color], i) => {
    const x = M + i * 3.02;
    const destacada = i === 2;
    rect(slide, x, 2.88, 2.86, 1.12, destacada ? C.gold : NAVY_CHIP);
    addText(slide, cifra, {
      x: x + 0.22,
      y: 2.98,
      w: 2.5,
      h: 0.54,
      fontFace: TYPOGRAPHY.display,
      fontSize: 32,
      bold: true,
      color: destacada ? C.navy : color,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 3.56,
      w: 2.5,
      h: 0.34,
      fontSize: 11.4,
      bold: destacada,
      color: destacada ? C.navy : C.softBlue,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 4.18, CW, 0.56, NAVY_CHIP);
  addText(
    slide,
    "Tres de cada cuatro pruebas generadas NO agregaron recorrido. En una empresa con esas capacidades y sobre sus propios productos.",
    {
      x: M + 0.3,
      y: 4.26,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 13,
      color: C.white,
      valign: "mid",
    }
  );

  addKicker(slide, M, 4.9, "Y lo decisivo no es la cifra, es el diseño", C.gold, 6);
  addCita(
    slide,
    M,
    5.2,
    CW,
    0.48,
    "verifies that its generated test classes successfully clear a set of filters that assure measurable improvement over the original test suite",
    { fill: C.navy, accent: C.gold, color: C.white, fontSize: 11.6, valign: "mid" }
  );
  addCita(
    slide,
    M,
    5.72,
    CW,
    0.48,
    "comprueba que las clases de prueba que genera superen un conjunto de filtros que aseguran una mejora medible sobre la suite original",
    { fill: NAVY_CHIP, accent: C.sand, color: C.sand, fontSize: 11.6, valign: "mid" }
  );
  addText(
    slide,
    "El criterio que decide qué pruebas sobreviven es externo al agente y está escrito por el equipo.",
    { x: M, y: 6.3, w: 11.4, h: 0.26, fontSize: 12.2, bold: true, color: C.gold }
  );

  addFuente(
    slide,
    M,
    6.64,
    "Alshahwan et al. (Meta) · arXiv:2402.09171 · 14 de febrero de 2024",
    { color: C.gold, textColor: C.sand, w: 10.5 }
  );

  validateSlide(slide, pptx);
}

function slideLimitesTestGen() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · qué se puede concluir y qué no",
    "Los límites de esa evidencia, dichos en voz alta",
    "Un resultado sólido sobre un caso concreto no es una ley general. Conviene separar las dos cosas.",
    false,
    { subtitleW: 11.2 }
  );

  const cols = [
    [
      "Lo que NO establece",
      [
        "Qué tan bien escribe pruebas un agente en general.",
        "Es una empresa, sobre sus propios sistemas, con sus propios filtros.",
        "El artículo relata un despliegue, no un experimento con grupo de comparación.",
      ],
      ROJO,
    ],
    [
      "Lo que SÍ es transferible",
      [
        "Un equipo que trabaja a esa escala decidió que el paso imprescindible no era generar.",
        "Era medir cada prueba generada contra la suite que ya existía.",
        "Es el mismo movimiento que hace --cov-report=term-missing sobre el proyecto.",
      ],
      VERDE,
    ],
  ];

  cols.forEach(([titulo, items, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.6, 5.66, 2.5, C.white);
    rect(slide, x, 2.6, 5.66, 0.06, color);
    addKicker(slide, x + 0.28, 2.82, titulo, color, 5);
    items.forEach((item, k) => {
      const y = 3.16 + k * 0.62;
      rect(slide, x + 0.28, y + 0.06, 0.05, 0.42, color);
      addText(slide, item, {
        x: x + 0.5,
        y,
        w: 4.9,
        h: 0.54,
        fontSize: 11.8,
        color: C.ink,
        lineSpacingMultiple: 1.14,
      });
    });
  });

  addTakeaway(
    slide,
    "Queda una pregunta que ese filtro contesta solo a medias: si una prueba entra por recorrer una línea nueva, ¿alcanza eso para afirmar que verifica algo?",
    { y: 5.34, h: 0.58 }
  );

  addText(slide, "Es el asunto del bloque que viene.", {
    x: M,
    y: 6.14,
    w: CW,
    h: 0.3,
    fontSize: 14,
    italic: true,
    color: C.slate,
    align: "center",
  });

  validateSlide(slide, pptx);
}

function slidePreguntasB1() {
  slidePreguntas(1, "Tres preguntas antes de seguir", [
    [
      "La suite informa 88 % y deja dos funciones completas sin ejecutar. Si mañana alguien agrega una tercera función sin pruebas, ¿el porcentaje sube, baja o se queda igual?",
      "Piensa por separado en qué le pasa al numerador y qué le pasa al denominador.",
    ],
    [
      "Si una misma prueba —mismas entradas, mismo assert— se pudo derivar del requisito o del código, ¿cómo se distingue después cuál fue, y por qué importa saberlo?",
      "El archivo de pruebas no guarda esa información. ¿Qué queda escrito del origen del esperado?",
    ],
    [
      "Meta usa el aumento de cobertura como filtro para aceptar una prueba generada. ¿Qué clase de prueba inútil pasa ese filtro sin problemas?",
      "Una prueba puede ejecutar una línea nueva sin comprobar nada sobre lo que esa línea produce.",
    ],
  ]);
}

function slideRespuestasB1() {
  slideRespuestas(1, "Lo que tenía que aparecer", [
    [
      "Baja, y por eso no sirve como indicador de avance",
      "El denominador crece y el numerador no. Agregar código sin pruebas hace bajar el porcentaje aunque nada se haya roto; y borrar código sin pruebas lo hace subir sin haber probado nada.",
      "Un número que se mueve por razones ajenas a la calidad de las pruebas.",
      "«Se queda igual, porque las pruebas son las mismas.»",
    ],
    [
      "No se distingue: hay que dejarlo escrito",
      "El archivo de pruebas conserva la entrada y el esperado, pero no de dónde salió el esperado. Si no se declara en el momento de escribirla, esa información se pierde para siempre.",
      "La procedencia se documenta al escribir la prueba; no se deduce después.",
      "«Se nota por el nombre de la prueba.»",
    ],
    [
      "Una prueba que recorre una línea nueva y no afirma nada sobre ella",
      "El filtro mide aumento de cobertura, y la cobertura mide ejecución. Una prueba sin aserción, o con una aserción trivial, aumenta la cobertura y pasa el filtro.",
      "Ningún filtro de cobertura detecta la ausencia de verificación.",
      "«Ninguna: si sube la cobertura, algo está probando.»",
    ],
  ]);
}

// ================================================================= BLOQUE 2

function slideDivisorB2() {
  slideDivisor(
    2,
    "El 100 % que\nno verifica nada",
    "La cobertura registra que la ejecución pasó por ahí. Que alguien haya comprobado el resultado es otra cosa, y no la mide ninguna herramienta.",
    1
  );
}

function slideDosMedidas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · dos unidades distintas",
    "Sentencias y ramas no cuentan lo mismo",
    "La norma define por separado las dos técnicas estructurales más usadas. La diferencia está en qué unidad cuenta cada una.",
    false,
    { subtitleW: 11.2 }
  );

  const defs = [
    [
      "3.45 · Statement testing",
      "Ejercita las sentencias ejecutables del código fuente",
      "Cuenta SENTENCIAS ejecutadas",
      AZUL,
    ],
    [
      "3.6 · Branch testing",
      "Ejercita las ramas del flujo de control",
      "Cuenta RAMAS recorridas",
      ORO,
    ],
  ];

  defs.forEach(([titulo, ingles, espanol, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.6, 5.66, 1.72, C.white);
    rect(slide, x, 2.6, 5.66, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.78,
      w: 5.1,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, `“${ingles}”`, {
      x: x + 0.28,
      y: 3.12,
      w: 5.1,
      h: 0.44,
      fontSize: 11,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    rule(slide, x + 0.28, 3.64, 5.1, C.border, 0.8);
    addText(slide, espanol, {
      x: x + 0.28,
      y: 3.78,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
  });

  rect(slide, M, 4.56, CW, 0.62, C.warm);
  rect(slide, M, 4.56, 0.06, 0.62, ORO);
  addText(
    slide,
    "Parece una distinción menor. No lo es: hay código donde la primera informa 100 % y la segunda no, y el hueco es justamente lo que nadie probó.",
    {
      x: M + 0.3,
      y: 4.66,
      w: CW - 0.6,
      h: 0.44,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "Vamos a medir las dos cosas sobre la misma función y ver la distancia entre los dos números.",
    { y: 5.44, h: 0.54 }
  );

  addFuente(
    slide,
    M,
    6.2,
    "ISO/IEC/IEEE 29119-4:2021 · cláusulas 3.45 y 3.6 · traducción propia del original",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideRegistrarReserva() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el caso de prueba",
    "Una función que registra el estado de una reserva",
    "Tres sentencias y una condición. La prueba que se le escribe es la evidente: una reserva válida queda confirmada.",
    false,
    { subtitleW: 7.9, subtitleH: 0.5 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.5,
    h: 1.96,
    title: "registro.py",
    code: [
      "def registrar_reserva(reservas, bloque, tomado):",
      '    estado = "rechazada"',
      "    if puede_reservar(reservas, bloque, tomado):",
      '        estado = "confirmada"',
      "    return estado",
    ].join("\n"),
    lang: "python",
    fontSize: 10.4,
  });

  addCodePanel(slide, SH, {
    x: 8.42,
    y: 2.56,
    w: 4.19,
    h: 1.52,
    title: "La única prueba",
    code: [
      "def test_una_reserva_valida():",
      "    assert registrar_reserva(",
      '        1, 4, tomado=False) == "confirmada"',
    ].join("\n"),
    lang: "python",
    fontSize: 8.8,
  });

  rect(slide, 8.42, 4.22, 4.19, 0.3, C.softBlue);
  addText(slide, "Alguien con 1 reserva pide el bloque 4 libre.", {
    x: 8.6,
    y: 4.24,
    w: 3.9,
    h: 0.26,
    fontSize: 10.6,
    color: C.ink,
    valign: "mid",
  });

  addKicker(slide, M, 4.78, "Antes de medir: anticipen", ROJO, 6);
  addText(
    slide,
    "Con esa prueba ejecutándose, ¿queda alguna línea sin ejecutar?",
    {
      x: M,
      y: 5.08,
      w: CW,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "La respuesta es no, y sin embargo hay algo del programa que esa prueba nunca recorrió.",
    { y: 5.68, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideLasDosMediciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la misma prueba, dos medidas",
    "Cien por ciento y ochenta y ocho por ciento",
    "La misma prueba, la misma función, el mismo momento. Lo único que cambia es qué se le pidió contar a la herramienta.",
    false,
    { subtitleW: 11.2 }
  );

  addKicker(slide, M, 2.5, "Contando sentencias", AZUL, 5);
  addInformeCobertura(slide, M, 2.76, 5.66, {
    titulo: "uv run pytest --cov=registro --cov-report=term-missing -q",
    cols: ["Name", "Stmts", "Miss", "Cover", "Missing"],
    anchos: [1.5, 0.96, 0.86, 0.96, 0.9],
    align: ["left", "right", "right", "right", "left"],
    rows: [["registro.py", "6", "0", "100%", ""]],
    fontSize: 10.2,
    rowH: 0.3,
  });
  addText(slide, "1 passed · ninguna línea sin ejecutar", {
    x: M,
    y: 4.1,
    w: 5.66,
    h: 0.26,
    fontSize: 11.4,
    italic: true,
    color: VERDE,
  });

  addKicker(slide, 6.96, 2.5, "Contando ramas: --cov-branch", ORO, 5);
  addInformeCobertura(slide, 6.96, 2.76, 5.66, {
    titulo: "…  --cov-branch  --cov-report=term-missing -q",
    cols: ["Name", "Stmts", "Miss", "Branch", "BrPart", "Cover", "Missing"],
    anchos: [1.24, 0.66, 0.6, 0.76, 0.74, 0.76, 0.68],
    align: ["left", "right", "right", "right", "right", "right", "left"],
    rows: [["registro.py", "6", "0", "2", "1", "88%", "6->8"]],
    fontSize: 9,
    rowH: 0.3,
    destacar: 6,
  });
  addText(slide, "1 passed · un camino sin recorrer", {
    x: 6.96,
    y: 4.1,
    w: 5.66,
    h: 0.26,
    fontSize: 11.4,
    italic: true,
    color: ROJO,
  });

  rect(slide, M, 4.52, CW, 0.66, C.paleRed);
  rect(slide, M, 4.52, 0.06, 0.66, ROJO);
  addText(
    slide,
    "Ninguna línea aparece como no cubierta y, aun así, hay un camino que nunca se recorrió. La reserva RECHAZADA —el estado que se queda en «rechazada»— no se probó nunca.",
    {
      x: M + 0.3,
      y: 4.62,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addTakeaway(
    slide,
    "La medida de sentencias no tenía manera de decirlo: la línea «estado = rechazada» se ejecuta siempre, sea la condición verdadera o falsa.",
    { y: 5.4, h: 0.58 }
  );

  addFuente(
    slide,
    M,
    6.22,
    "Ejecución propia · Python 3.12.12 · pytest 9.1.1 · pytest-cov 7.1.0 · coverage 7.16.1",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideLeerLaArista() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · notación nueva",
    "Qué dicen Branch, BrPart y «6->8»",
    "Tres piezas del informe que no aparecían cuando se medían solo sentencias.",
    false,
    { subtitleW: 11.2 }
  );

  const piezas = [
    ["Branch", "2", "Aristas de decisión del archivo. El if de la línea 6 puede seguir por dos caminos.", AZUL],
    ["BrPart", "1", "Decisiones recorridas POR UN SOLO LADO. El if se evaluó, pero solo con un resultado.", ROJO],
    ["6->8", "—", "La arista que no se tomó, escrita como origen y destino: de la línea 6 a la línea 8.", ORO],
  ];

  piezas.forEach(([nombre, valor, glosa, color], i) => {
    const y = 2.6 + i * 0.84;
    rect(slide, M, y, CW, 0.72, i === 2 ? C.warm : C.white);
    rect(slide, M, y, 0.06, 0.72, color);
    addText(slide, nombre, {
      x: M + 0.3,
      y: y + 0.2,
      w: 1.5,
      h: 0.32,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color,
    });
    addText(slide, valor, {
      x: M + 1.9,
      y: y + 0.16,
      w: 0.6,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.ink,
      align: "center",
    });
    addText(slide, glosa, {
      x: M + 2.8,
      y: y + 0.2,
      w: CW - 3.1,
      h: 0.34,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    });
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 5.22,
    w: 11.89,
    h: 1.3,
    title: "Las líneas 6 y 8 del archivo",
    code: [
      "    if puede_reservar(reservas, bloque, tomado):   # 6  -> si es FALSA, salta al 8",
      "    return estado                                  # 8  <- por ahí no pasó nadie",
    ].join("\n"),
    lang: "python",
    fontSize: 10,
  });

  validateSlide(slide, pptx);
}

function slideIfSinElse() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 2 · dónde se separan las dos medidas",
    "Una condición sin caso contrario divide las dos medidas",
    "El bloque se ejecuta cuando la condición es verdadera; el camino falso no tiene un bloque «else», pero sigue siendo una rama posible.",
    true
  );

  const cols = [
    ["Camino verdadero", "La prueba lo recorrió", "estado pasa a «confirmada»", VERDE],
    ["Camino falso", "Nadie lo recorrió", "estado se queda en «rechazada»", C.red],
  ];

  cols.forEach(([titulo, estado, glosa, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.5, 5.66, 1.5, NAVY_CHIP);
    rect(slide, x, 2.5, 5.66, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.7,
      w: 5.06,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.white,
    });
    addText(slide, estado, {
      x: x + 0.3,
      y: 3.06,
      w: 5.06,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.3,
      y: 3.5,
      w: 5.06,
      h: 0.3,
      fontSize: 12.4,
      color: C.softBlue,
    });
  });

  rect(slide, M, 4.28, CW, 0.62, C.gold);
  addText(
    slide,
    "Las tres sentencias se ejecutaron. Solo uno de los dos caminos se recorrió.",
    {
      x: M + 0.3,
      y: 4.36,
      w: CW - 0.6,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "mid",
    }
  );

  addText(
    slide,
    "De ahí la primera regla práctica de la sesión: medir ramas, no solo sentencias. Una condición sin bloque para el caso contrario sigue teniendo dos caminos posibles, y ahí las dos medidas se separan.",
    {
      x: M,
      y: 5.14,
      w: 11.4,
      h: 0.6,
      fontSize: 14,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 5.94, CW, 0.56, NAVY_CHIP);
  addText(
    slide,
    "Y ahora la reacción natural: si ramas es más estricto, bastaría con exigir 100 % de ramas. El resto del bloque es la razón por la que eso tampoco alcanza.",
    {
      x: M + 0.3,
      y: 6.02,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 12.6,
      italic: true,
      color: C.sand,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

function slideLaPruebaSinAsercion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el experimento",
    "Una prueba con seis llamadas y ningún «assert»",
    "Se agrega a la suite de doce casos del proyecto de reserva. No compara nada, no espera nada, y no puede fallar: termina, y pytest la cuenta como pasada.",
    false,
    { subtitleW: 11.2, subtitleH: 0.5 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.94,
    w: 7.5,
    h: 2.4,
    title: "test_sin_afirmacion.py",
    code: [
      "def test_recorre_sin_afirmar():",
      "    bloque_valido(4)",
      "    puede_reservar(1, 0, tomado=False)",
      "    puede_reservar(1, 4, tomado=True)",
      "    puede_reservar(1, 4, tomado=False)",
      "    puede_cancelar(inicio, ahora)",
      "    comprobante(nombre, rut, correo, 3)",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, 8.42, 2.94, 4.19, 2.4, C.paleRed);
  rect(slide, 8.42, 2.94, 0.07, 2.4, ROJO);
  addText(slide, "0", {
    x: 8.72,
    y: 3.1,
    w: 3.6,
    h: 0.62,
    fontFace: TYPOGRAPHY.display,
    fontSize: 46,
    bold: true,
    color: ROJO,
  });
  addText(slide, "aserciones", {
    x: 8.72,
    y: 3.74,
    w: 3.6,
    h: 0.26,
    fontSize: 13,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Llama a las cuatro funciones del proyecto y recorre los tres caminos de puede_reservar().\n\nNinguna línea compara un resultado con lo que el requisito exige.",
    {
      x: 8.72,
      y: 4.12,
      w: 3.6,
      h: 1.08,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Predicción antes de ejecutar: ¿cuánto sube la cobertura del proyecto al agregar esta prueba?",
    { y: 5.6, h: 0.56, fill: AZUL }
  );

  validateSlide(slide, pptx);
}

function slideDelOchentaOchoAlCien() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el resultado",
    "Del 88 % al 100 % sin comprobar nada",
    "Mismo código, misma suite, más una prueba que no afirma nada. Salida literal de las dos ejecuciones.",
    false,
    { subtitleW: 11.2 }
  );

  addContraste(
    slide,
    M,
    2.6,
    CW,
    {
      rotulo: "La suite de doce casos",
      cifra: "88 %",
      glosa: "Missing: 22, 26 · dos funciones sin ejecutar",
      color: AZUL,
    },
    {
      rotulo: "Con una prueba más, sin aserciones",
      cifra: "100 %",
      glosa: "Missing vacío · cobertura total",
      color: ROJO,
    },
    { h: 1.56, etiquetaFlecha: "+1 PRUEBA", cifraFontSize: 42 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.36,
    w: 5.66,
    h: 1.08,
    title: "Antes",
    fontSize: 10,
    lines: [
      { text: "reservas.py  17  2  88%  22, 26", kind: "muted" },
      { text: "12 passed in 0.09s", kind: "success" },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.96,
    y: 4.36,
    w: 5.66,
    h: 1.08,
    title: "Después",
    fontSize: 10,
    lines: [
      { text: "reservas.py  17  0  100%", kind: "muted" },
      { text: "13 passed in 0.10s", kind: "success" },
    ],
  });

  addTakeaway(
    slide,
    "La columna Missing quedó vacía y el proyecto ahora exhibe cobertura total. No se comprobó ni un resultado más que antes.",
    { y: 5.64, h: 0.58 }
  );

  addFuente(
    slide,
    M,
    6.36,
    "Ejecución propia sobre el proyecto de reserva · pytest 9.1.1 · pytest-cov 7.1.0",
    { w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideLaVersionIncomoda() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 2 · la versión incómoda",
    "Cobertura perfecta con el defecto vivo",
    "Se reintroduce en bloque_valido() el defecto que la sesión pasada encontró y corrigió: volver a comparar con «<» en vez de «<=». Y se ejecuta SOLO esa prueba sin aserciones.",
    true,
    { subtitleW: 11.4, subtitleH: 0.5 }
  );

  const medidas = [
    ["Sentencias", "100 %", "17 de 17 · Miss 0"],
    ["Ramas", "100 %", "4 de 4 · BrPart 0"],
    ["Resultado", "1 passed", "la suite está en verde"],
  ];

  medidas.forEach(([rotulo, cifra, glosa], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 2.94, 3.82, 1.24, NAVY_CHIP);
    rect(slide, x, 2.94, 3.82, 0.06, C.gold);
    addKicker(slide, x + 0.26, 3.12, rotulo, C.sand, 3.3);
    addText(slide, cifra, {
      x: x + 0.26,
      y: 3.36,
      w: 3.3,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color: C.gold,
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: 3.84,
      w: 3.3,
      h: 0.26,
      fontSize: 11.2,
      color: C.softBlue,
    });
  });

  rect(slide, M, 4.42, CW, 0.66, C.red);
  addText(
    slide,
    "Y un octavo de la jornada del laboratorio, inutilizable por un defecto que sigue ahí.",
    {
      x: M + 0.3,
      y: 4.5,
      w: CW - 0.6,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addText(
    slide,
    "Eso responde la objeción del apartado anterior: exigir cobertura de ramas es mejor que exigir cobertura de sentencias, y tampoco es suficiente. Ninguna de las dos medidas mira las aserciones, porque ninguna fue diseñada para eso. Miden ejecución.",
    {
      x: M,
      y: 5.26,
      w: 11.4,
      h: 0.66,
      fontSize: 13.6,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  addFuente(
    slide,
    M,
    6.16,
    "Ejecución propia con el defecto reintroducido · 1 passed · 100 % en ambas medidas",
    { color: C.gold, textColor: C.sand, w: 9.5 }
  );

  validateSlide(slide, pptx);
}

function slideLaFormulacionPrecisa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · cómo se dice con precisión",
    "«El 100 % no prueba nada» es demasiado fuerte",
    "El eslogan circula así, pero conviene decirlo exacto, porque el 100 % sí prueba un hecho, y es un hecho útil.",
    false,
    { subtitleW: 11.2 }
  );

  const filas = [
    ["Lo que SÍ prueba", "No quedó código que ninguna prueba alcance.", VERDE],
    ["Lo que NO prueba", "Que alguien haya comprobado el resultado de alcanzarlo.", ROJO],
  ];

  filas.forEach(([titulo, glosa, color], i) => {
    const y = 2.7 + i * 0.94;
    rect(slide, M, y, CW, 0.82, C.white);
    rect(slide, M, y, 0.06, 0.82, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.24,
      w: 3.2,
      h: 0.34,
      fontSize: 14,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: M + 3.7,
      y: y + 0.24,
      w: CW - 4.0,
      h: 0.34,
      fontSize: 14,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 4.62, CW, 0.96, C.navy);
  addText(slide, "La cobertura es NECESARIA y NO SUFICIENTE.", {
    x: M,
    y: 4.74,
    w: CW,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.gold,
    align: "center",
  });
  addText(
    slide,
    "Sirve para descartar el olvido. No para acreditar la verificación.",
    {
      x: M,
      y: 5.24,
      w: CW,
      h: 0.26,
      fontSize: 13,
      color: C.white,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Entonces, ¿qué pregunta hay que hacerle a una prueba en lugar de mirarle el porcentaje?",
    { y: 5.84, h: 0.56, fill: AZUL }
  );

  validateSlide(slide, pptx);
}

function slideElMutante() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el experimento que discrimina",
    "Modificar el programa a propósito y ver si la suite lo nota",
    "Con el mismo defecto reintroducido, se ejecuta ahora la suite de doce casos CON aserciones.",
    false,
    { subtitleW: 11.2, titleFontSize: 27 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.62,
    w: 11.89,
    h: 1.52,
    title: "uv run pytest -q",
    fontSize: 10.6,
    lines: [
      { text: "FAILED test_limites_del_requisito[ultimo] - assert False is True", kind: "error" },
      { text: "FAILED test_regla_permitida_incluye_el_bloque_8 - assert False is True", kind: "error" },
      { text: "2 failed, 10 passed in 0.19s", kind: "error" },
    ],
  });

  rect(slide, M, 4.3, CW, 0.56, C.softBlue);
  rect(slide, M, 4.3, 0.06, 0.56, AZUL);
  addText(
    slide,
    "Las dos suites recorren el mismo código. Una detecta el defecto y la otra no. Lo que las separa no es el porcentaje: es la aserción.",
    {
      x: M + 0.3,
      y: 4.38,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: "mid",
    }
  );

  addKicker(slide, M, 5.02, "El experimento tiene nombre propio", ORO, 6);

  const terminos = [
    ["Mutante", "Cada modificación deliberada del programa", AZUL],
    ["Matado", "El mutante hace fallar alguna prueba", VERDE],
    ["Sobrevive", "El mutante deja la suite en verde", ROJO],
  ];

  terminos.forEach(([nombre, glosa, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 5.3, 3.82, 0.8, C.white);
    rect(slide, x, 5.3, 0.06, 0.8, color);
    addText(slide, nombre, {
      x: x + 0.26,
      y: 5.4,
      w: 3.3,
      h: 0.26,
      fontSize: 13.4,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: 5.68,
      w: 3.3,
      h: 0.36,
      fontSize: 11.2,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "Cambiar «<=» por «<» es un mutante: la suite con aserciones lo mata, la suite sin aserciones lo deja sobrevivir con cobertura perfecta.",
    { y: 6.3, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

function slideLaPreguntaQueReemplaza() {
  const { slide } = createSlide("dark");
  addHeader(slide, "Bloque 2 · la herramienta de la sesión", "La pregunta que reemplaza al porcentaje", "", true);

  rect(slide, M, 2.5, CW, 1.1, C.gold);
  addText(slide, "¿Qué tendría que cambiar en el código para que esta prueba falle?", {
    x: M + 0.4,
    y: 2.68,
    w: CW - 0.8,
    h: 0.74,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "mid",
  });

  const respuestas = [
    ["Si la respuesta es «nada»", "La prueba no verifica: recorre.", C.red],
    ["Si es «cualquier cosa, falla ante cambios irrelevantes»", "Tampoco sirve: es demasiado frágil.", C.gold],
    ["Si se puede nombrar con precisión", "La prueba tiene un defecto asociado, y se sabe cuál.", C.success],
  ];

  respuestas.forEach(([caso, glosa, color], i) => {
    const y = 3.86 + i * 0.82;
    rect(slide, M, y, CW, 0.7, NAVY_CHIP);
    rect(slide, M, y, 0.06, 0.7, color);
    addText(slide, caso, {
      x: M + 0.3,
      y: y + 0.2,
      w: 4.6,
      h: 0.32,
      fontSize: 13.4,
      bold: true,
      color: C.white,
      valign: "mid",
    });
    addText(slide, glosa, {
      x: M + 5.2,
      y: y + 0.2,
      w: CW - 5.5,
      h: 0.32,
      fontSize: 13,
      color: color === C.gold ? C.gold : C.softBlue,
      valign: "mid",
    });
  });

  addText(
    slide,
    "Se le puede hacer a cualquier prueba en diez segundos, y la respuesta se verifica en el acto: se aplica el cambio y se corre la suite.",
    {
      x: M,
      y: 6.4,
      w: 11.4,
      h: 0.3,
      fontSize: 12.8,
      italic: true,
      color: C.sand,
    }
  );

  validateSlide(slide, pptx);
}

function slideEstudioWaterloo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · qué dice la investigación",
    "El estudio que midió esto en serio",
    "Laura Inozemtseva y Reid Holmes presentaron el estudio en ICSE 2014, una conferencia internacional de ingeniería de software. Midieron la eficacia con el cambio deliberado explicado en la lámina 40, pero automatizado.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5 }
  );

  const datos = [
    ["31 000", "suites de prueba generadas"],
    ["5", "sistemas Java reales"],
    ["724 000", "líneas de código, el mayor"],
    ["3", "tipos de cobertura medidos"],
  ];

  datos.forEach(([cifra, glosa], i) => {
    const x = M + i * 3.02;
    rect(slide, x, 2.88, 2.86, 1.0, C.white);
    rect(slide, x, 2.88, 0.05, 1.0, AZUL);
    addText(slide, cifra, {
      x: x + 0.22,
      y: 3.0,
      w: 2.5,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color: AZUL,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 3.48,
      w: 2.5,
      h: 0.32,
      fontSize: 11,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addCita(
    slide,
    M,
    4.06,
    CW,
    0.6,
    "Our results suggest that coverage, while useful for identifying under-tested parts of a program, should not be used as a quality target because it is not a good indicator of test suite effectiveness.",
    { accent: AZUL, fontSize: 11.6 }
  );
  addCita(
    slide,
    M,
    4.72,
    CW,
    0.66,
    "Nuestros resultados sugieren que la cobertura, si bien es útil para identificar las partes de un programa que están poco probadas, no debería usarse como meta de calidad, porque no es un buen indicador de la eficacia de una suite de pruebas.",
    { fill: C.softNeutral, accent: C.slate, fontSize: 11.6 }
  );

  addTakeaway(
    slide,
    "El tipo de cobertura casi no cambió la relación con la eficacia. En Apache POI: sentencias 0,75; decisiones 0,76; condición modificada 0,77.",
    { y: 5.52, h: 0.58, fontSize: 13.4 }
  );

  addFuente(
    slide,
    M,
    6.34,
    "Inozemtseva y Holmes · Coverage Is Not Strongly Correlated with Test Suite Effectiveness · ICSE 2014",
    { w: 10.5 }
  );

  validateSlide(slide, pptx);
}

function slideHSQLDB() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el caso que vale por sí solo",
    "Un sistema donde más cobertura significó menos defectos detectados",
    "En HSQLDB —uno de los cinco sistemas Java estudiados— ocurrió el caso extremo. Una CORRELACIÓN mide si dos cantidades suben y bajan juntas, en una escala de −1 a 1.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5, titleFontSize: 25 }
  );

  const escala = [
    ["Cerca de 1", "Cuando una sube, la otra sube", VERDE],
    ["Cerca de 0", "No tienen relación apreciable", C.slate],
    ["Negativa", "Cuando una sube, la otra BAJA", ROJO],
  ];

  escala.forEach(([rotulo, glosa, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 2.9, 3.82, 0.66, C.white);
    rect(slide, x, 2.9, 0.05, 0.66, color);
    addText(slide, rotulo, {
      x: x + 0.24,
      y: 2.98,
      w: 3.34,
      h: 0.24,
      fontSize: 12.4,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 3.22,
      w: 3.34,
      h: 0.26,
      fontSize: 11,
      color: C.slate,
    });
  });

  rect(slide, M, 3.78, 3.3, 1.0, C.paleRed);
  rect(slide, M, 3.78, 0.06, 1.0, ROJO);
  addText(slide, "−0,35", {
    x: M + 0.3,
    y: 3.86,
    w: 2.8,
    h: 0.52,
    fontFace: TYPOGRAPHY.display,
    fontSize: 33,
    bold: true,
    color: ROJO,
  });
  addText(slide, "HSQLDB", {
    x: M + 0.3,
    y: 4.46,
    w: 2.8,
    h: 0.24,
    fontSize: 12,
    bold: true,
    color: C.slate,
  });

  addCita(
    slide,
    4.26,
    3.78,
    8.35,
    0.46,
    "the suites with higher coverage contain test cases that run a lot of code but do not kill many mutants in that code",
    { accent: AZUL, fontSize: 11.2, valign: "mid" }
  );
  addCita(
    slide,
    4.26,
    4.32,
    8.35,
    0.46,
    "las suites con mayor cobertura contienen casos de prueba que ejecutan mucho código pero no matan muchos mutantes en ese código",
    { fill: C.softNeutral, accent: C.slate, fontSize: 11.2, valign: "mid" }
  );

  rect(slide, M, 4.96, CW, 0.62, C.navy);
  addText(
    slide,
    "Es exactamente la prueba sin aserciones de hace diez minutos, encontrada en un sistema real y en producción.",
    {
      x: M + 0.3,
      y: 5.04,
      w: CW - 0.6,
      h: 0.46,
      fontSize: 14,
      bold: true,
      color: C.gold,
      valign: "mid",
    }
  );

  addFuente(
    slide,
    M,
    5.78,
    "Inozemtseva y Holmes · ICSE 2014 · tabla 3 · τ de Kendall: coeficiente de correlación con eficacia normalizada",
    { w: 10.5 }
  );

  validateSlide(slide, pptx);
}

function slideLasAserciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · lo que sí indica eficacia",
    "El estudio anterior dice qué NO sirve; este dice qué sí",
    "Yucheng Zhang y Ali Mesbah presentaron el estudio en FSE 2015, una conferencia de ingeniería de software: 6 700 suites formadas con 24 000 aserciones de cinco proyectos Java reales.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5, titleFontSize: 26 }
  );

  addCita(
    slide,
    M,
    2.94,
    CW,
    0.72,
    "We find that the number of assertions in a test suite strongly correlates with its effectiveness… assertion coverage is strongly correlated with effectiveness",
    { accent: VERDE, fontSize: 11.8 }
  );
  addCita(
    slide,
    M,
    3.72,
    CW,
    0.72,
    "Encontramos que la cantidad de aserciones de una suite se correlaciona fuertemente con su eficacia… la cobertura de aserciones está fuertemente correlacionada con la eficacia.",
    { fill: C.softNeutral, accent: C.slate, fontSize: 11.8 }
  );

  rect(slide, M, 4.62, CW, 0.88, C.navy);
  addText(slide, "«coverage without checking for correctness is meaningless»", {
    x: M,
    y: 4.72,
    w: CW,
    h: 0.3,
    fontSize: 14,
    italic: true,
    color: C.sand,
    align: "center",
  });
  addText(
    slide,
    "La cobertura, sin comprobar que el resultado sea correcto, no significa nada.",
    {
      x: M,
      y: 5.06,
      w: CW,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.gold,
      align: "center",
    }
  );

  rect(slide, M, 5.66, CW, 0.56, C.warm);
  rect(slide, M, 5.66, 0.06, 0.56, ORO);
  addText(
    slide,
    "Los límites: los dos estudios usan proyectos Java de código abierto, suites compuestas artificialmente, y mutantes como aproximación a defectos reales.",
    {
      x: M + 0.3,
      y: 5.74,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    }
  );

  addFuente(
    slide,
    M,
    6.42,
    "Zhang y Mesbah · Assertions Are Strongly Correlated with Test Suite Effectiveness · FSE 2015",
    { w: 10.5 }
  );

  validateSlide(slide, pptx);
}

function slideAuditarUnaGenerada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la era de los agentes",
    "Contar aserciones, no porcentajes",
    "De los dos estudios sale un procedimiento concreto para revisar pruebas que uno no escribió, que es la situación habitual cuando las produce un agente.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5 }
  );

  const items = [
    ["Lo que hace bien", "Alcanzar código no recorrido. Es la tarea en la que la medición de cobertura le da retroalimentación directa, y es real: Missing baja.", VERDE],
    ["Lo que no conviene delegar", "La aserción. Es la parte que decide si el resultado es correcto y el indicador que el estudio relaciona con una mayor eficacia para detectar defectos.", ORO],
    ["El error frecuente, en dos formas", "La prueba que llama y no afirma. Y la que afirma una tautología: comparar contra otra llamada a la misma función, o contra el valor que el código produce.", ROJO],
  ];

  items.forEach(([titulo, glosa, color], i) => {
    const y = 2.94 + i * 0.94;
    rect(slide, M, y, CW, 0.82, i === 2 ? C.paleRed : C.white);
    rect(slide, M, y, 0.06, 0.82, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.1,
      w: 3.6,
      h: 0.6,
      fontSize: 13,
      bold: true,
      color,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, glosa, {
      x: M + 4.1,
      y: y + 0.12,
      w: CW - 4.4,
      h: 0.6,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.78, CW, 0.66, C.navy);
  addText(
    slide,
    "El puente práctico: pedirle el mutante junto con la prueba. «Para cada prueba que propongas, dime qué cambio en el código la haría fallar.»",
    {
      x: M + 0.3,
      y: 5.88,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13.4,
      bold: true,
      color: C.white,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  validateSlide(slide, pptx);
}

function slidePreguntasB2() {
  slidePreguntas(2, "Tres preguntas antes de la pausa", [
    [
      "Si la prueba sin aserciones se reemplazara por una con una aserción tautológica —comparar el resultado contra otra llamada a la misma función—, ¿qué cambia en el informe y qué en la detección?",
      "Piensa por separado en qué mide la herramienta y en qué tendría que pasar para que esa comparación diera falso.",
    ],
    [
      "En HSQLDB la correlación entre cobertura y eficacia fue negativa. ¿Qué tendría que estar ocurriendo en un proyecto para que subir la cobertura empeore de verdad su capacidad de detectar defectos?",
      "Una suite puede crecer en código recorrido más rápido de lo que crece en comprobaciones.",
    ],
    [
      "Si el recuento de aserciones se correlaciona con la eficacia mucho mejor que la cobertura, ¿por qué sería igual de mala idea fijar «cantidad de aserciones» como meta obligatoria del proyecto?",
      "Repasa por qué falla el porcentaje como meta y comprueba si el mismo razonamiento aplica a cualquier número que alguien pueda subir a voluntad.",
    ],
  ]);
}

function slideRespuestasB2() {
  slideRespuestas(2, "Lo que tenía que aparecer", [
    [
      "El informe no cambia nada; la detección, tampoco",
      "La cobertura sería idéntica: se recorren las mismas líneas. Y la aserción no puede fallar, porque compara el código consigo mismo: el defecto aparece en los dos lados.",
      "Que la herramienta no distingue una aserción real de una tautológica.",
      "«Al menos algo comprueba, porque tiene un assert.»",
    ],
    [
      "Que la suite crezca en recorrido más rápido que en comprobaciones",
      "Si las pruebas que se van agregando ejecutan mucho código y afirman poco, cada punto de cobertura nuevo trae menos capacidad de detección que el anterior.",
      "La cobertura puede subir mientras la calidad de la evidencia baja.",
      "«Es imposible: más pruebas siempre detectan más.»",
    ],
    [
      "Porque cualquier número fijado como meta se alcanza por el camino más barato",
      "Se pueden agregar aserciones triviales o repetidas igual que se pueden agregar líneas recorridas. El problema no era la cobertura: era convertir una medición en un objetivo.",
      "Ningún indicador sobrevive a ser usado como meta obligatoria.",
      "«Esa sí serviría, porque las aserciones sí comprueban.»",
    ],
  ]);
}

// ================================================================= BLOQUE 3

function slideDivisorB3() {
  slideDivisor(
    3,
    "El sustituto que ocupa\nel lugar de la dependencia",
    "Para probar lo que hace el sistema cuando el correo falla hay que poder hacerlo fallar. Y el correo institucional no falla a pedido.",
    2
  );
}

function slideLaInyeccion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el mecanismo",
    "La función a llamar entra por un parámetro",
    "Esa es la pieza que hace posible todo lo que sigue. Sin ella no habría por dónde meter un sustituto.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 1.96,
    title: "confirmacion.py",
    code: [
      "def confirmar_reserva(reservas, bloque, tomado, nombre,",
      "        rut, correo,",
      "        enviar: Callable[[str, str], bool] = enviar_confirmacion):",
      "    ...",
      "    if enviar(correo, cuerpo): return 'confirmada'",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  const piezas = [
    ["enviar", "Un parámetro más. Pero lo que recibe no es un dato: es UNA FUNCIÓN.", AZUL],
    ["Callable[[str, str], bool]", "«Algo que se puede llamar, recibe dos cadenas y devuelve un booleano».", AZUL],
    ["= enviar_confirmacion", "El valor por omisión: si nadie pasa nada, se usa el servicio real.", VERDE],
    ["enviar(correo, cuerpo)", "La llamada. La función no sabe cuál le tocó: la llama y mira qué devuelve.", ORO],
  ];

  piezas.forEach(([pieza, glosa, color], i) => {
    const y = 4.62 + i * 0.56;
    rect(slide, M, y, CW, 0.48, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.48, color);
    addText(slide, pieza, {
      x: M + 0.24,
      y: y + 0.03,
      w: 3.5,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.6,
      bold: true,
      color,
      valign: "mid",
    });
    addText(slide, glosa, {
      x: M + 3.9,
      y: y + 0.03,
      w: CW - 4.2,
      h: 0.42,
      fontSize: 11.8,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, 7.98, 2.5, 4.63, 1.96, C.navy);
  addKicker(slide, 8.26, 2.7, "El mecanismo, en una frase", C.gold, 4);
  addText(
    slide,
    "Como la función a llamar entra por un parámetro, una prueba puede pasarle OTRA en su lugar.",
    {
      x: 8.26,
      y: 3.0,
      w: 4.07,
      h: 0.7,
      fontSize: 13.4,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.16,
    }
  );
  rule(slide, 8.26, 3.78, 4.07, NAVY_RULE, 1);
  addText(slide, "Se llama INYECCIÓN DE DEPENDENCIA.", {
    x: 8.26,
    y: 3.92,
    w: 4.07,
    h: 0.4,
    fontSize: 12.4,
    color: C.gold,
    lineSpacingMultiple: 1.14,
  });

  validateSlide(slide, pptx);
}

function slideFallaPorLaRed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · por qué hay que sustituir",
    "La prueba evidente falla, y no por el código",
    "Se escribe lo obvio —una reserva válida queda confirmada— y se ejecuta sin tocar nada.",
    false,
    { subtitleW: 11.2 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 11.89,
    h: 1.74,
    title: "uv run pytest test_confirmacion_real.py -q",
    fontSize: 10.4,
    lines: [
      { text: "notificaciones.py:13: in enviar_confirmacion", kind: "muted" },
      { text: "    with urllib.request.urlopen(peticion, timeout=5) as respuesta:", kind: "muted" },
      { text: "E   urllib.error.URLError: <urlopen error [Errno 11001] getaddrinfo failed>", kind: "error" },
      { text: "1 failed in 0.68s", kind: "error" },
    ],
  });

  rect(slide, M, 4.46, CW, 0.66, C.paleRed);
  rect(slide, M, 4.46, 0.06, 0.66, ROJO);
  addText(
    slide,
    "Conviene leer con cuidado POR QUÉ falló. No porque confirmar_reserva() esté mal: porque no se pudo resolver el nombre del servidor. El rojo no habla del código que se quería probar.",
    {
      x: M + 0.3,
      y: 4.56,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addText(
    slide,
    "Y si el servicio existiera, sería peor: cada ejecución mandaría correos reales a direcciones reales, tardaría lo que tarde la red, y el resultado cambiaría según si el servicio está arriba.",
    {
      x: M,
      y: 5.34,
      w: CW,
      h: 0.6,
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Hay cuatro problemas distintos detrás de esto, y conviene no mezclarlos.",
    { y: 6.12, h: 0.54, fill: AZUL }
  );

  validateSlide(slide, pptx);
}

function slideCuatroProblemas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · las cuatro razones",
    "Qué le hace a una prueba cada problema",
    "Sustituir no se justifica «porque sí»: se justifica nombrando cuál de estos cuatro está en juego.",
    false,
    { subtitleW: 11.2 }
  );

  const problemas = [
    ["1", "La dependencia no está disponible", "La prueba falla por una causa ajena al código bajo prueba.", AZUL],
    ["2", "La dependencia es lenta", "La suite deja de poder ejecutarse a cada cambio.", AZUL],
    ["3", "La dependencia tiene efectos reales", "Probar manda correos, cobra dinero o escribe en producción.", ORO],
    ["4", "La dependencia no es controlable", "No se puede provocar a voluntad el caso de fallo que se quiere probar.", ROJO],
  ];

  problemas.forEach(([n, titulo, glosa, color], i) => {
    const y = 2.6 + i * 0.8;
    const ultimo = i === 3;
    rect(slide, M, y, CW, 0.68, ultimo ? C.paleRed : C.white);
    rect(slide, M, y, 0.06, 0.68, color);
    addText(slide, n, {
      x: M + 0.3,
      y: y + 0.14,
      w: 0.4,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
    });
    addText(slide, titulo, {
      x: M + 0.92,
      y: y + 0.18,
      w: 4.3,
      h: 0.32,
      fontSize: 13.2,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, glosa, {
      x: M + 5.5,
      y: y + 0.18,
      w: CW - 5.8,
      h: 0.32,
      fontSize: 12.2,
      color: C.slate,
      valign: "mid",
    });
  });

  rect(slide, M, 5.9, CW, 0.66, C.navy);
  addText(
    slide,
    "El cuarto es el menos obvio y el más importante hoy: aunque el servicio funcionara perfecto, seguiría siendo imposible probar qué hace el sistema cuando el envío falla.",
    {
      x: M + 0.3,
      y: 6.0,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13,
      bold: true,
      color: C.gold,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  validateSlide(slide, pptx);
}

function slideComoSeLeenEstasLlamadas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · antes de leer los cinco",
    "Dos cosas que se repiten en todas las pruebas",
    "Los datos del estudiante se declaran una vez arriba del archivo, y los tres números del principio siguen el orden de la firma.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 11.89,
    h: 1.08,
    title: "Arriba del archivo de pruebas",
    code: 'DATOS = ("Ana Perez", "12.345.678-9", "ana.perez@correo.cl")',
    lang: "python",
    fontSize: 11.5,
  });

  rect(slide, M, 3.8, CW, 0.58, C.warm);
  rect(slide, M, 3.8, 0.06, 0.58, ORO);
  addText(
    slide,
    "El asterisco de *DATOS significa: «desarma esta tupla y entrega sus tres elementos como tres argumentos separados». Ahorra la repetición; no cambia nada.",
    {
      x: M + 0.3,
      y: 3.88,
      w: CW - 0.6,
      h: 0.42,
      fontSize: 12.6,
      color: C.ink,
      valign: "mid",
    }
  );

  const casos = [
    ["confirmar_reserva(1, 4, False, *DATOS, …)", "Ana, con 1 reserva esta semana, pide el bloque 4, que no está tomado.", VERDE],
    ["confirmar_reserva(3, 4, False, *DATOS, …)", "Ana ya tiene 3 reservas —el máximo—. Debe rechazarse por cupo.", ROJO],
    ["confirmar_reserva(1, 4, True, *DATOS, …)", "El bloque 4 ya está tomado por otra persona. Debe rechazarse.", ROJO],
  ];

  casos.forEach(([llamada, frase, color], i) => {
    const y = 4.56 + i * 0.62;
    rect(slide, M, y, CW, 0.52, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.52, color);
    addText(slide, llamada, {
      x: M + 0.24,
      y: y + 0.05,
      w: 4.6,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, frase, {
      x: M + 5.1,
      y: y + 0.05,
      w: CW - 5.4,
      h: 0.42,
      fontSize: 12.2,
      color: C.slate,
      valign: "mid",
    });
  });

  addTakeaway(
    slide,
    "Los cinco dobles que vienen se escriben sobre esta misma llamada. Lo único que cambia es qué se pasa en «enviar».",
    { y: 6.5, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

function slideDummyYStub() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · dobles 1 y 2 de 5",
    "Dummy: ocupa el lugar. Stub: devuelve una respuesta fija",
    "El término general es DOBLE DE PRUEBA, y la taxonomía viene del libro xUnit Test Patterns de Gerard Meszaros (2007).",
    false,
    { subtitleW: 11.4, titleFontSize: 26 }
  );

  addKicker(slide, M, 2.5, "Dummy · se pasa para llenar el parámetro y nunca se usa", AZUL, 7);
  addCodePanel(slide, SH, {
    x: M,
    y: 2.72,
    w: 11.89,
    h: 1.52,
    title: "Si la reserva se rechaza por cupo, el envío nunca llega a ocurrir",
    code: [
      "def test_dummy_una_reserva_rechazada_no_notifica():",
      '    dummy = None',
      '    assert confirmar_reserva(3, 4, False, *DATOS, enviar=dummy) == "rechazada"',
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });
  addText(slide, "Que None no explote es la comprobación: prueba que por ese camino no se notifica.", {
    x: M,
    y: 4.32,
    w: CW,
    h: 0.26,
    fontSize: 11.8,
    italic: true,
    color: C.slate,
  });

  addKicker(slide, M, 4.7, "Stub · devuelve una respuesta fija, y hacen falta dos", ORO, 7);
  addCodePanel(slide, SH, {
    x: M,
    y: 4.94,
    w: 11.89,
    h: 1.74,
    title: "Uno para cada desenlace",
    code: [
      "def stub_envio_ok(correo, cuerpo):    return True    # -> 'confirmada'",
      "def stub_envio_falla(correo, cuerpo): return False   # -> 'pendiente'",
      "",
      "assert confirmar_reserva(1, 4, False, *DATOS, enviar=stub_envio_falla) == 'pendiente'",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  validateSlide(slide, pptx);
}

function slideSpyYMock() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · dobles 3 y 4 de 5",
    "Spy: además anota. Mock: además exige",
    "Los dos miran la llamada y no solo el resultado. La diferencia está en quién decide si la llamada estuvo bien.",
    false,
    { subtitleW: 11.2 }
  );

  addKicker(slide, M, 2.5, "Spy · un stub que registra cómo lo llamaron", AZUL, 7);
  addCodePanel(slide, SH, {
    x: M,
    y: 2.76,
    w: 11.89,
    h: 1.52,
    title: "Permite afirmar sobre lo que SALIÓ del sistema",
    code: [
      "llamadas = []",
      "def spy_envio(correo, cuerpo):",
      "    llamadas.append((correo, cuerpo)); return True",
      "assert llamadas[0][0] == 'ana.perez@correo.cl' and 'bloque 4' in llamadas[0][1]",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addKicker(slide, M, 4.42, "Mock · viene programado con la expectativa y falla solo", ORO, 7);
  addCodePanel(slide, SH, {
    x: M,
    y: 4.68,
    w: 7.5,
    h: 1.3,
    title: "unittest.mock, de la biblioteca estándar",
    code: [
      "mock_envio = Mock(return_value=True)",
      "mock_envio.assert_called_once_with(correo, cuerpo_exacto)",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  rect(slide, 8.42, 4.68, 4.19, 1.3, C.paleRed);
  rect(slide, 8.42, 4.68, 0.07, 1.3, ROJO);
  addText(
    slide,
    "Nótese dónde quedó la aserción: esta prueba NO MIRA lo que devolvió confirmar_reserva().\n\nComprueba que la notificación salió, una sola vez, con ese texto exacto.",
    {
      x: 8.72,
      y: 4.82,
      w: 3.6,
      h: 1.02,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Mock() acepta cualquier llamada y anota todas. return_value dice qué devolver. assert_called_once_with es la aserción.",
    { y: 6.14, h: 0.52, fontSize: 12.8 }
  );

  validateSlide(slide, pptx);
}

function slideFake() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · doble 5 de 5",
    "Fake: una implementación que de verdad funciona",
    "No serviría en el sistema real porque los correos no llegan a ninguna parte y se pierden apenas termina el programa.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.9,
    h: 2.4,
    title: "Una bandeja de salida guardada en memoria",
    code: [
      "class BandejaEnMemoria:",
      "    def __init__(self):",
      "        self.enviados = []",
      "    def enviar(self, correo, cuerpo):",
      '        if "@" not in correo:',
      "            return False",
      "        self.enviados.append((correo, cuerpo))",
    ].join("\n"),
    lang: "python",
    fontSize: 9.2,
  });

  const sintaxis = [
    ["class", "Un molde que junta datos y las funciones que operan sobre ellos."],
    ["__init__", "Lo que Python ejecuta AL FABRICAR el objeto. Los guiones bajos marcan un nombre especial."],
    ["self", "El objeto que se está usando. self.enviados es la lista DE ESTE objeto."],
    ['"@" not in correo', "Validación mínima de una dirección de correo."],
  ];

  sintaxis.forEach(([pieza, glosa], i) => {
    const y = 2.5 + i * 0.56;
    rect(slide, 7.82, y, 4.79, 0.48, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, 7.82, y, 0.05, 0.48, AZUL);
    addText(slide, pieza, {
      x: 8.04,
      y: y + 0.03,
      w: 1.5,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.4,
      bold: true,
      color: AZUL,
      valign: "mid",
    });
    addText(slide, glosa, {
      x: 9.62,
      y: y + 0.03,
      w: 2.84,
      h: 0.42,
      fontSize: 9.6,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });

  rect(slide, M, 5.04, CW, 0.6, C.warm);
  rect(slide, M, 5.04, 0.06, 0.6, ORO);
  addText(
    slide,
    "Es un fake y no un stub porque TIENE COMPORTAMIENTO PROPIO: acepta o rechaza según lo que recibe, y guarda lo aceptado.",
    {
      x: M + 0.3,
      y: 5.12,
      w: CW - 0.6,
      h: 0.44,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.76,
    w: 11.89,
    h: 0.86,
    title: "Los seis casos de los cinco tipos",
    fontSize: 10.4,
    lines: [{ text: "6 passed in 0.15s", kind: "success" }],
  });

  validateSlide(slide, pptx);
}

function slideEstadoVsComportamiento() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 3 · el criterio que ordena los cinco",
    "Verificar el estado o verificar la conversación",
    "",
    true
  );

  addCita(
    slide,
    M,
    2.32,
    CW,
    0.56,
    "With state verification we do this by asserts against the warehouse's state. Mocks use behavior verification, where we instead check to see if the order made the correct calls on the warehouse.",
    { fill: NAVY_CHIP, accent: C.gold, color: C.white, fontSize: 11.6, valign: "mid" }
  );
  addCita(
    slide,
    M,
    2.96,
    CW,
    0.56,
    "Con la verificación de estado hacemos esto mediante aserciones contra el estado del almacén. Los mocks usan verificación de comportamiento, donde comprobamos si el pedido hizo las llamadas correctas sobre el almacén.",
    { fill: C.navy, accent: C.sand, color: C.sand, fontSize: 11.6, valign: "mid" }
  );

  const tabla = [
    ["Dummy", "Nada; ocupa el lugar", "El parámetro es obligatorio y ese camino no lo usa"],
    ["Stub", "Una respuesta fija", "Se quiere provocar un desenlace y afirmar sobre el resultado"],
    ["Spy", "Respuesta fija más registro", "Además del resultado, interesa qué salió hacia la dependencia"],
    ["Mock", "Expectativa que se verifica sola", "Lo que se quiere probar ES la interacción, no el valor devuelto"],
    ["Fake", "Una implementación real y liviana", "Se necesita comportamiento, no una respuesta fija"],
  ];

  tabla.forEach(([tipo, aporta, cuando], i) => {
    const y = 3.78 + i * 0.5;
    rect(slide, M, y, CW, 0.42, i % 2 === 0 ? NAVY_CHIP : C.navy);
    addText(slide, tipo, {
      x: M + 0.26,
      y: y + 0.02,
      w: 1.2,
      h: 0.38,
      fontSize: 12.4,
      bold: true,
      color: C.gold,
      valign: "mid",
    });
    addText(slide, aporta, {
      x: M + 1.6,
      y: y + 0.02,
      w: 3.6,
      h: 0.38,
      fontSize: 11.4,
      color: C.white,
      valign: "mid",
    });
    addText(slide, cuando, {
      x: M + 5.4,
      y: y + 0.02,
      w: CW - 5.7,
      h: 0.38,
      fontSize: 11.4,
      color: C.softBlue,
      valign: "mid",
    });
  });

  addText(
    slide,
    "Por eso llamar «mock» a los cinco borra información: no se sabe si la prueba verifica el estado que produjo el sistema o la conversación que tuvo con su dependencia.",
    {
      x: M,
      y: 6.36,
      w: 11.4,
      h: 0.3,
      fontSize: 12.6,
      italic: true,
      color: C.sand,
    }
  );

  validateSlide(slide, pptx);
}

function slideSeisAlCien() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la suite completa",
    "Seis pruebas, con aserciones de verdad, al 100 %",
    "Aquí no hay truco de aserción ausente: los seis casos comparan resultados. Y la cobertura de la función que confirma queda así.",
    false,
    { subtitleW: 11.2 }
  );

  addInformeCobertura(slide, M, 2.66, 11.89, {
    titulo: "uv run pytest test_dobles.py --cov=confirmacion --cov-branch --cov-report=term-missing -q",
    cols: ["Name", "Stmts", "Miss", "Branch", "BrPart", "Cover", "Missing"],
    anchos: [3.0, 1.4, 1.3, 1.5, 1.5, 1.5, 1.2],
    align: ["left", "right", "right", "right", "right", "right", "left"],
    rows: [["confirmacion.py", "10", "0", "4", "0", "100%", ""]],
    fontSize: 12,
    rowH: 0.34,
  });
  addText(slide, "6 passed in 0.21s", {
    x: M + 0.22,
    y: 4.0,
    w: 4.0,
    h: 0.26,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 11.4,
    color: VERDE,
  });

  const cifras = [
    ["100 %", "de sentencias", VERDE],
    ["100 %", "de ramas · 4 de 4", VERDE],
    ["0", "BrPart · nada parcial", VERDE],
  ];

  cifras.forEach(([cifra, glosa, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 4.46, 3.82, 0.86, C.white);
    rect(slide, x, 4.46, 0.05, 0.86, color);
    addText(slide, cifra, {
      x: x + 0.24,
      y: 4.56,
      w: 3.34,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 4.98,
      w: 3.34,
      h: 0.26,
      fontSize: 11.6,
      color: C.slate,
    });
  });

  addTakeaway(
    slide,
    "Según todo lo que se midió en el bloque anterior, esta suite está completa.",
    { y: 5.54, h: 0.56 }
  );

  addText(slide, "Lo está. Y ahora pasa algo que pasa todo el tiempo en un proyecto real.", {
    x: M,
    y: 6.3,
    w: CW,
    h: 0.3,
    fontSize: 14,
    italic: true,
    color: C.slate,
    align: "center",
  });

  validateSlide(slide, pptx);
}

function slideElServicioCambia() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · lo que pasa en un proyecto real",
    "El equipo del servicio de correo publica una versión nueva",
    "Ya no recibe destinatario y cuerpo, sino destinatario, asunto y cuerpo. La función nueva opera correctamente, pero cambió la cantidad de argumentos que exige.",
    false,
    { subtitleW: 11.2, titleFontSize: 26 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.66,
    w: 11.89,
    h: 1.3,
    title: "notificaciones.py · la versión nueva",
    code: [
      "def enviar_confirmacion(destinatario: str, asunto: str, cuerpo: str) -> bool:",
      '    headers={"X-Destinatario": destinatario, "X-Asunto": asunto}  # ...',
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, M, 4.12, CW, 0.6, C.softBlue);
  rect(slide, M, 4.12, 0.06, 0.6, AZUL);
  addText(
    slide,
    "confirmar_reserva() sigue llamando con DOS argumentos, porque nadie lo actualizó. Nadie se dio cuenta.",
    {
      x: M + 0.3,
      y: 4.2,
      w: CW - 0.6,
      h: 0.44,
      fontSize: 13,
      color: C.ink,
      valign: "mid",
    }
  );

  addKicker(slide, M, 4.92, "Predicción antes de ejecutar", ROJO, 6);
  addText(
    slide,
    "¿Qué va a informar la suite de seis pruebas contra este estado del proyecto?",
    {
      x: M,
      y: 5.2,
      w: CW,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.ink,
      valign: "mid",
    }
  );

  addPasosLectura(slide, M, 5.78, 1, { w: 1.5 });

  addTakeaway(
    slide,
    "La lámina siguiente contrasta esta predicción con el resultado real.",
    { y: 6.34, h: 0.5, fontSize: 13, fill: AZUL }
  );

  validateSlide(slide, pptx);
}

function slideSeisEnVerdeYRoto() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 3 · el resultado",
    "Seis en verde, 100 %, y el sistema roto",
    "",
    true
  );

  addInformeCobertura(slide, M, 2.4, 7.3, {
    titulo: "La suite completa sobre ese estado",
    cols: ["Name", "Stmts", "Miss", "Branch", "BrPart", "Cover"],
    anchos: [2.3, 0.95, 0.9, 1.05, 1.05, 0.95],
    align: ["left", "right", "right", "right", "right", "right"],
    rows: [["confirmacion.py", "10", "0", "4", "0", "100%"]],
    fontSize: 10,
    rowH: 0.3,
  });
  addText(slide, "6 passed in 0.20s", {
    x: M + 0.22,
    y: 3.68,
    w: 3.0,
    h: 0.26,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 11,
    color: C.success,
  });

  rect(slide, 8.36, 2.4, 4.25, 1.4, C.red);
  addText(slide, "En producción", {
    x: 8.62,
    y: 2.56,
    w: 3.8,
    h: 0.24,
    fontSize: 10.4,
    bold: true,
    color: C.white,
    charSpacing: 1.2,
  });
  addText(slide, "TypeError", {
    x: 8.62,
    y: 2.84,
    w: 3.8,
    h: 0.38,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 18,
    bold: true,
    color: C.white,
  });
  addText(slide, "enviar_confirmacion() missing 1 required positional argument: 'cuerpo'", {
    x: 8.62,
    y: 3.26,
    w: 3.8,
    h: 0.44,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 8.6,
    color: C.white,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M, 4.02, CW, 0.9, C.gold);
  addText(
    slide,
    "Los dobles no están conectados a la dependencia que sustituyen.",
    {
      x: M,
      y: 4.12,
      w: CW,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "mid",
    }
  );
  addText(
    slide,
    "Cada uno de los cinco recibe dos argumentos porque su autor decidió que la dependencia recibía dos argumentos.",
    {
      x: M,
      y: 4.56,
      w: CW,
      h: 0.26,
      fontSize: 12.6,
      color: C.navy,
      align: "center",
    }
  );

  addText(
    slide,
    "Cuando eso deja de ser cierto, los dobles aceptan la firma antigua. Por eso la suite no ejecuta el servicio real ni detecta su cambio. El 100 % es real; lo que se cubrió por completo fue el supuesto del autor, no el sistema que llegará a producción.",
    {
      x: M,
      y: 5.14,
      w: 11.4,
      h: 0.8,
      fontSize: 13.6,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 6.06, CW, 0.56, NAVY_CHIP);
  addText(
    slide,
    "En el vocabulario del bloque anterior: el cambio de firma es un mutante, y esta suite lo deja SOBREVIVIR con cobertura total.",
    {
      x: M + 0.3,
      y: 6.14,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 12.8,
      bold: true,
      color: C.gold,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

function slideAutospec() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la defensa",
    "Un doble derivado de la dependencia, no escrito de memoria",
    "La biblioteca estándar ofrece ambas formas. create_autospec() copia la firma de la función real y rechaza llamadas incompatibles.",
    false,
    { subtitleW: 11.2, titleFontSize: 27 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.66,
    w: 11.89,
    h: 1.3,
    title: "Las dos formas de fabricar el doble",
    code: [
      "mock_envio = Mock(return_value=True)                              # suelto",
      "doble = create_autospec(enviar_confirmacion, return_value=True)   # derivado",
    ].join("\n"),
    lang: "python",
    fontSize: 10,
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.12,
    w: 11.89,
    h: 1.52,
    title: "Los dos contra el servicio de tres parámetros",
    fontSize: 10.2,
    lines: [
      { text: ".F                                                        [100%]", kind: "muted" },
      { text: "E   TypeError: missing a required argument: 'cuerpo'", kind: "error" },
      { text: "1 failed, 1 passed in 0.09s", kind: "error" },
    ],
  });

  rect(slide, M, 5.8, CW, 0.62, C.navy);
  addText(
    slide,
    "Mismo código, mismo cambio, mismo caso de prueba. El doble suelto pasa; el doble atado a la firma real falla y avisa antes de producción.",
    {
      x: M + 0.3,
      y: 5.88,
      w: CW - 0.6,
      h: 0.46,
      fontSize: 13,
      color: C.white,
      valign: "mid",
    }
  );

  addText(slide, "Un doble se DERIVA de la dependencia. No se escribe de memoria.", {
    x: M,
    y: 6.56,
    w: CW,
    h: 0.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: ORO,
    align: "center",
  });

  validateSlide(slide, pptx);
}

function slideLimiteDeAutospec() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · lo que esto NO resuelve",
    "Copiar la firma real en el doble no protege del cambio de conducta",
    "create_autospec() detecta argumentos incompatibles, pero no conoce todos los comportamientos del servicio real.",
    false,
    { subtitleW: 11.2, titleFontSize: 27 }
  );

  const casos = [
    ["Cambia la FIRMA", "El servicio pide un parámetro más", "create_autospec() lo detecta", VERDE],
    ["Cambia la CONDUCTA", "El servicio lanza una excepción en vez de devolver False", "create_autospec() no lo detecta", ROJO],
  ];

  casos.forEach(([titulo, ejemplo, veredicto, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 2.7, 5.66, 1.64, C.white);
    rect(slide, x, 2.7, 5.66, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.9,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    addText(slide, ejemplo, {
      x: x + 0.28,
      y: 3.26,
      w: 5.1,
      h: 0.5,
      fontSize: 12.4,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
    rule(slide, x + 0.28, 3.84, 5.1, C.border, 0.8);
    addText(slide, veredicto, {
      x: x + 0.28,
      y: 3.96,
      w: 5.1,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color,
    });
  });

  rect(slide, M, 4.62, CW, 0.78, C.paleRed);
  rect(slide, M, 4.62, 0.06, 0.78, ROJO);
  addText(
    slide,
    "Si el servicio real empezara a lanzar una excepción en lugar de devolver False, los dos stubs seguirían devolviendo booleanos, la rama «pendiente» seguiría cubierta, y el caso que de verdad ocurre en producción seguiría sin probarse.",
    {
      x: M + 0.3,
      y: 4.72,
      w: CW - 0.6,
      h: 0.6,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Por eso el doble nunca reemplaza a la prueba que habla con la dependencia de verdad: la reduce a unas pocas, no a cero.",
    { y: 5.62, h: 0.56 }
  );

  addFuente(
    slide,
    M,
    6.38,
    "Ejecución propia · el contraste entre Mock() y create_autospec() sobre el servicio de tres parámetros",
    { w: 10.5 }
  );

  validateSlide(slide, pptx);
}

function slideDiscusionAbierta() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 3 · una discusión que sigue abierta",
    "Cuánto sustituir no es un asunto resuelto",
    "Presentarlo como resuelto sería falso. Fowler describe dos posiciones con nombre propio.",
    true,
    { subtitleW: 11.2 }
  );

  addCita(
    slide,
    M,
    2.6,
    CW,
    0.54,
    "The classical TDD style is to use real objects if possible and a double if it's awkward to use the real thing. A mockist TDD practitioner, however, will always use a mock for any object with interesting behavior.",
    { fill: NAVY_CHIP, accent: C.gold, color: C.white, fontSize: 11.2, valign: "mid" }
  );
  addCita(
    slide,
    M,
    3.22,
    CW,
    0.54,
    "En desarrollo guiado por pruebas (TDD), el estilo clásico usa objetos reales cuando es posible y dobles cuando no. El estilo mockista sustituye sistemáticamente los colaboradores con comportamiento por mocks.",
    { fill: C.navy, accent: C.sand, color: C.sand, fontSize: 11.2, valign: "mid" }
  );

  const posturas = [
    ["Sustituir todo", "Pruebas rápidas, aisladas, que señalan con precisión la unidad que falló", "La suite queda acoplada a CÓMO está hecho el código y se rompe al refactorizar", C.gold],
    ["Sustituir lo mínimo", "Pruebas que verifican la integración de verdad", "Más lentas, fallan por causas ajenas y localizan peor el defecto", C.success],
  ];

  posturas.forEach(([titulo, aFavor, enContra, color], i) => {
    const x = M + i * 6.24;
    rect(slide, x, 4.0, 5.66, 1.44, NAVY_CHIP);
    rect(slide, x, 4.0, 5.66, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.18,
      w: 5.1,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: C.white,
    });
    addText(slide, `+  ${aFavor}`, {
      x: x + 0.28,
      y: 4.52,
      w: 5.1,
      h: 0.42,
      fontSize: 11.4,
      color: C.success,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, `−  ${enContra}`, {
      x: x + 0.28,
      y: 4.98,
      w: 5.1,
      h: 0.42,
      fontSize: 11.4,
      color: C.sand,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 5.64, CW, 0.62, C.gold);
  addText(
    slide,
    "Lo que NO está en discusión: sustituir cuando la dependencia impide provocar el caso que interesa, y no sustituir cuando lo que se quiere verificar es que dos piezas se entienden.",
    {
      x: M + 0.3,
      y: 5.72,
      w: CW - 0.6,
      h: 0.46,
      fontSize: 12.6,
      bold: true,
      color: C.navy,
      valign: "mid",
    }
  );

  addFuente(slide, M, 6.44, "Martin Fowler · Mocks Aren't Stubs · 2 de enero de 2007", {
    color: C.gold,
    textColor: C.sand,
    w: 8.5,
  });

  validateSlide(slide, pptx);
}

function slideElAgenteInventaElDoble() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la era de los agentes",
    "El agente construye el doble desde la línea que lo llama",
    "Si se le pidió una prueba para confirmar_reserva() y solo se le mostró ese archivo, va a inventar la forma de «enviar» a partir de cómo se la llama ahí.",
    false,
    { subtitleW: 11.4, subtitleH: 0.5, titleFontSize: 26 }
  );

  const items = [
    ["Lo que hace bien", "Producir los cinco tipos con la sintaxis correcta, y sobre todo cubrir la rama de fallo: la que más se olvida a mano, porque hay que inventarse cómo provocarla.", VERDE],
    ["Lo que no conviene delegar", "La forma y la conducta de la dependencia. Ese dato no está en el archivo que se prueba: está en la dependencia, y hay que dárselo.", ORO],
    ["El error frecuente", "Un Mock() suelto para todo, con return_value elegido por lo que hace falta para que la prueba pase. Es verde, es 100 %, y no está atado a nada.", ROJO],
  ];

  items.forEach(([titulo, glosa, color], i) => {
    const y = 2.94 + i * 0.94;
    rect(slide, M, y, CW, 0.82, i === 2 ? C.paleRed : C.white);
    rect(slide, M, y, 0.06, 0.82, color);
    addText(slide, titulo, {
      x: M + 0.3,
      y: y + 0.12,
      w: 3.6,
      h: 0.56,
      fontSize: 13,
      bold: true,
      color,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, glosa, {
      x: M + 4.1,
      y: y + 0.12,
      w: CW - 4.4,
      h: 0.6,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.78, CW, 0.66, C.navy);
  addText(
    slide,
    "La práctica que lo corrige es de una línea: pedir el doble DERIVADO de la dependencia, y revisar que el return_value corresponda a algo que la dependencia realmente devuelve.",
    {
      x: M + 0.3,
      y: 5.88,
      w: CW - 0.6,
      h: 0.48,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    }
  );

  addText(
    slide,
    "Si el agente no tuvo delante el código de la dependencia, su doble es una suposición con sintaxis correcta.",
    {
      x: M,
      y: 6.6,
      w: CW,
      h: 0.28,
      fontSize: 12.6,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}

function slidePreguntasB3() {
  slidePreguntas(3, "Tres preguntas antes de seguir", [
    [
      "El test del dummy pasa None como dependencia y queda en verde. Si alguien moviera la notificación antes de la comprobación del cupo, ¿qué pasaría con esa prueba?",
      "Piensa qué ocurre al intentar llamar a None, y quién se enteraría.",
    ],
    [
      "La suite con dobles llegó al 100 % de sentencias y de ramas y no detectó el cambio de firma. ¿Habría servido subir la exigencia de cobertura o agregar más pruebas con dobles?",
      "Las dos alternativas miden lo mismo dentro del mundo que la suite construyó.",
    ],
    [
      "Un mock verifica que el sistema llamó a su dependencia de una forma exacta. ¿Cuándo esa verificación es un estorbo que hay que borrar en cada refactorización?",
      "Compara una llamada que el requisito exige con una que es solo una decisión de implementación.",
    ],
  ]);
}

function slideRespuestasB3() {
  slideRespuestas(3, "Lo que tenía que aparecer", [
    [
      "Fallaría con un error de llamada a None, y eso la vuelve útil",
      "Pasar None no es un descuido: es una aserción implícita de que por ese camino la dependencia NO se usa. Si alguien la usa, la prueba se cae y avisa.",
      "Un dummy documenta un camino donde la dependencia no debe intervenir.",
      "«Da lo mismo: None no comprueba nada.»",
    ],
    [
      "No: las dos miden dentro del mundo que la suite inventó",
      "La dependencia real quedó fuera de ese mundo desde el momento en que se sustituyó. Ninguna medida de cobertura puede ver algo que la ejecución nunca tocó.",
      "La cobertura mide el código propio, no el contrato con lo ajeno.",
      "«Con cobertura de condición modificada se habría visto.»",
    ],
    [
      "Cuando la llamada es una decisión de implementación y no un requisito",
      "Que el comprobante se envíe lo exige el requisito: verificarlo está bien. En cuántos pasos se arma el cuerpo del mensaje no lo exige nadie: fijarlo en un mock congela el diseño.",
      "El mock legítimo verifica una obligación, no un detalle interno.",
      "«Siempre estorba: por eso mejor no usar mocks.»",
    ],
  ]);
}

// ================================================================= BLOQUE 4

function slideDivisorB4() {
  slideDivisor(
    4,
    "Auditar una suite\nque uno no escribió",
    "La suite llega en verde. La auditoría decide si verifica el requisito o si solo repite el código que encontró.",
    "todas"
  );
}

function slideSuiteRecibida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la suite que llega",
    "Cuatro pruebas legibles, cuatro aserciones reales",
    "No hay pruebas vacías ni nombres genéricos. Una revisión superficial encuentra una suite razonable.",
    false,
    { subtitleW: 11.3, titleFontSize: 27 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.62,
    w: 11.89,
    h: 3.44,
    title: "test_suite_recibida.py",
    code: [
      "def test_cancelar_con_exactamente_dos_horas_no_se_permite():",
      "    ahora = datetime(2026, 9, 21, 8, 0)",
      "    inicio = ahora + timedelta(hours=2)",
      "    assert puede_cancelar(inicio, ahora) is False",
      "",
      "def test_comprobante_identifica_al_estudiante():",
      "    assert \"Ana Perez\" in comprobante(*DATOS, 4)",
      "",
      "def test_confirmacion_exitosa():",
      "    envio = Mock(return_value=True)",
      "    assert confirmar_reserva(1, 4, False, *DATOS, enviar=envio) == \"confirmada\"",
      "",
      "def test_no_se_reserva_un_bloque_ocupado():",
      "    assert puede_reservar(1, 4, tomado=True) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 9.3,
  });

  addTakeaway(slide, "Todavía no sabemos de dónde salieron los esperados ni qué cambios detectan.", {
    y: 6.2,
    h: 0.54,
    fontSize: 13.6,
  });

  validateSlide(slide, pptx);
}

function slideLaSuiteSeDescribe() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · primera lectura",
    "Verde, 83 %, y tres formas de decir que no",
    "La columna Missing entrega la primera pista antes de aplicar los tres criterios de auditoría.",
    false,
    { subtitleW: 11.2 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 4.08,
    h: 1.3,
    title: "Resultado de la suite",
    fontSize: 10.4,
    lines: [
      { text: "....                         [100%]", kind: "muted" },
      { text: "4 passed in 0.09s", kind: "success" },
    ],
  });

  addInformeCobertura(slide, 5.06, 2.58, 7.55, {
    titulo: "Cobertura con ramas",
    cols: ["Name", "Stmts", "Miss", "Branch", "BrPart", "Cover", "Missing"],
    anchos: [1.75, 0.78, 0.72, 0.94, 0.9, 0.86, 1.12],
    align: ["left", "right", "right", "right", "right", "right", "left"],
    rows: [
      ["confirmacion.py", "10", "2", "4", "2", "71%", "17, 21"],
      ["reservas.py", "17", "1", "4", "1", "90%", "15"],
      ["TOTAL", "27", "3", "8", "3", "83%", ""],
    ],
    destacar: 6,
    fontSize: 8.4,
    rowH: 0.3,
    padBottom: 0.26,
  });

  const negaciones = [
    ["17", "return \"rechazada\"", "Cupo agotado"],
    ["21", "return \"pendiente\"", "Falló la notificación"],
    ["15", "return False", "Bloque fuera de jornada"],
  ];

  negaciones.forEach(([linea, codigo, glosa], i) => {
    const y = 4.4 + i * 0.5;
    addText(slide, linea, {
      x: M,
      y: y + 0.03,
      w: 0.54,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: ROJO,
      align: "center",
    });
    rect(slide, M + 0.72, y, 3.0, 0.38, C.paleRed);
    addText(slide, codigo, {
      x: M + 0.9,
      y: y + 0.06,
      w: 2.64,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.2,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 4.0,
      y: y + 0.05,
      w: 4.6,
      h: 0.26,
      fontSize: 11.5,
      color: C.slate,
    });
  });

  addTakeaway(slide, "La suite probó que el sistema acepta. Casi no probó que rechace.", {
    y: 6.16,
    h: 0.54,
  });

  validateSlide(slide, pptx);
}

function slideDarContexto() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 4 · antes de pedir pruebas",
    "El encargo incluye lo que el código no contiene",
    "Sin requisito, el esperado sale del código. Sin la dependencia, el doble se inventa.",
    true,
    { subtitleW: 11.1 }
  );

  const piezas = [
    ["1", "REQUISITO", "Ocho bloques, máximo tres reservas y cancelación hasta dos horas antes.", C.gold],
    ["2", "PROCEDENCIA", "Para cada esperado, indicar la cláusula o la fuente que lo decide.", C.success],
    ["3", "MUTANTE", "Nombrar el cambio concreto que cada prueba debería detectar.", C.red],
    ["4", "DEPENDENCIA", "Adjuntar la firma real y derivar de ella cualquier doble de prueba.", C.sand],
  ];

  piezas.forEach(([numero, titulo, glosa, color], i) => {
    const y = 2.52 + i * 0.76;
    rect(slide, M, y, CW, 0.64, NAVY_CHIP);
    rect(slide, M, y, 0.06, 0.64, color);
    addText(slide, numero, {
      x: M + 0.26,
      y: y + 0.1,
      w: 0.46,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color,
      align: "center",
    });
    addText(slide, titulo, {
      x: M + 0.96,
      y: y + 0.1,
      w: 2.0,
      h: 0.3,
      fontSize: 10.3,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, glosa, {
      x: M + 3.12,
      y: y + 0.1,
      w: CW - 3.46,
      h: 0.42,
      fontSize: 12.3,
      color: C.white,
      valign: "mid",
    });
  });

  rect(slide, M, 5.78, CW, 0.68, C.gold);
  addText(slide, "Si el requisito no decide un caso, la salida correcta es «requiere decisión». El agente no elige por el equipo.", {
    x: M + 0.34,
    y: 5.87,
    w: CW - 0.68,
    h: 0.48,
    fontSize: 13.4,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

function slideCriterioUno() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · criterio 1",
    "¿De dónde salió el resultado esperado?",
    "El límite de dos horas permite separar lo que dice el requisito de lo que decidió el operador del código.",
    false,
    { subtitleW: 11.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 5.2,
    h: 1.38,
    title: "La condición que decide el límite",
    code: "return inicio_bloque - ahora > ANTICIPACION_CANCELACION",
    lang: "python",
    fontSize: 10.2,
  });

  addCodePanel(slide, SH, {
    x: 6.18,
    y: 2.58,
    w: 6.43,
    h: 1.38,
    title: "La prueba recibida",
    code: [
      "inicio = ahora + timedelta(hours=2)",
      "assert puede_cancelar(inicio, ahora) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  const pasos = [
    ["El requisito", "dice «hasta dos horas antes»", "No decide la igualdad", ORO],
    ["El código", "usa el operador >", "Excluye las dos horas exactas", AZUL],
    ["La prueba", "afirma False", "Convierte el operador en regla", ROJO],
  ];

  pasos.forEach(([origen, hecho, consecuencia, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 4.26, 3.82, 1.12, C.white);
    rect(slide, x, 4.26, 3.82, 0.06, color);
    addText(slide, origen, {
      x: x + 0.24,
      y: 4.44,
      w: 3.34,
      h: 0.24,
      fontSize: 12.6,
      bold: true,
      color,
    });
    addText(slide, hecho, {
      x: x + 0.24,
      y: 4.74,
      w: 3.34,
      h: 0.26,
      fontSize: 11.6,
      color: C.ink,
    });
    addText(slide, consecuencia, {
      x: x + 0.24,
      y: 5.04,
      w: 3.34,
      h: 0.24,
      fontSize: 10.6,
      italic: true,
      color: C.slate,
    });
  });

  addTakeaway(slide, "Decisión: POSPONER. Una ambigüedad del requisito no se resuelve copiando el código.", {
    y: 5.68,
    h: 0.58,
    fill: ROJO,
  });

  validateSlide(slide, pptx);
}

function slideTresMutantes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · criterio 2",
    "Tres cambios concretos contra la suite recibida",
    "Cada cambio se aplica por separado; luego se ejecuta la suite y se restaura el proyecto antes del siguiente cambio.",
    false,
    { subtitleW: 11.1 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 11.89,
    h: 2.38,
    title: "Resultado de la auditoría por mutación",
    fontSize: 10.4,
    lines: [
      { text: "MATADO     M1  puede_cancelar: '>' cambia a '>='", kind: "success" },
      { text: "              1 failed, 3 passed in 0.09s", kind: "muted" },
      { text: "SOBREVIVE  M2  comprobante: deja de incluir el correo", kind: "error" },
      { text: "              4 passed in 0.08s", kind: "muted" },
      { text: "SOBREVIVE  M3  enviar_confirmacion: agrega un parámetro", kind: "error" },
      { text: "              4 passed in 0.08s", kind: "muted" },
    ],
  });

  const lecturas = [
    ["M1", "La prueba reacciona", "Falta saber si defiende la regla correcta", VERDE],
    ["M2", "La prueba no reacciona", "La aserción acepta demasiadas salidas", ROJO],
    ["M3", "La prueba no reacciona", "El doble no conoce la firma real", ROJO],
  ];

  lecturas.forEach(([id, resultado, lectura, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 5.18, 3.82, 0.96, C.white);
    addText(slide, id, {
      x: x + 0.22,
      y: 5.34,
      w: 0.64,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color,
    });
    addText(slide, resultado, {
      x: x + 0.94,
      y: 5.28,
      w: 2.58,
      h: 0.26,
      fontSize: 11.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, lectura, {
      x: x + 0.94,
      y: 5.58,
      w: 2.58,
      h: 0.42,
      fontSize: 10.4,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Matar un mutante demuestra poder de detección. Todavía no demuestra que el esperado sea correcto.", {
    y: 6.3,
    h: 0.5,
    fontSize: 13.2,
  });

  validateSlide(slide, pptx);
}

function slideMutanteMatadoProblema() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 4 · la lectura contraintuitiva",
    "La suite mató M1, pero defendió una regla no acordada",
    "«Matar» significa que la suite falló al cambiar > por >=. Eso demuestra sensibilidad, no que el resultado esperado sea correcto.",
    true,
    { subtitleW: 11.2 }
  );

  addText(slide, "MATADO", {
    x: M,
    y: 2.58,
    w: 3.5,
    h: 0.68,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.success,
  });
  addText(slide, "1 failed · 3 passed", {
    x: M,
    y: 3.3,
    w: 3.5,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    color: C.sand,
  });

  vrule(slide, 4.52, 2.56, 2.0, C.gold, 2.2);
  addText(slide, "Si mañana el equipo decide que dos horas exactas sí permiten cancelar, cambiar > por >= corrige el código.", {
    x: 4.88,
    y: 2.58,
    w: 7.3,
    h: 0.84,
    fontSize: 17,
    color: C.white,
    lineSpacingMultiple: 1.16,
  });
  addText(slide, "La prueba se pondrá en rojo y presentará la corrección como una regresión.", {
    x: 4.88,
    y: 3.56,
    w: 7.3,
    h: 0.52,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.gold,
  });

  rect(slide, M, 4.88, CW, 0.72, NAVY_CHIP);
  addText(slide, "Una prueba cuyo esperado salió del código puede ser muy sensible. Su sensibilidad congela el comportamiento actual, incluido el defecto.", {
    x: M + 0.34,
    y: 4.98,
    w: CW - 0.68,
    h: 0.5,
    fontSize: 13.2,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  addText(slide, "PODER DE DETECCIÓN", {
    x: M,
    y: 5.92,
    w: 3.9,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.success,
    charSpacing: 1.4,
  });
  addText(slide, "no sustituye", {
    x: 4.72,
    y: 5.88,
    w: 1.9,
    h: 0.34,
    fontSize: 14,
    italic: true,
    color: C.sand,
    align: "center",
  });
  addText(slide, "PROCEDENCIA DEL ESPERADO", {
    x: 6.9,
    y: 5.92,
    w: 5.72,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.gold,
    charSpacing: 1.4,
    align: "right",
  });

  validateSlide(slide, pptx);
}

function slideDosSobrevivientes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · los dos sobrevivientes",
    "La suite deja sobrevivir M2 y M3 por razones distintas",
    "Uno revela una aserción demasiado amplia. El otro revela un doble desconectado de la dependencia.",
    false,
    { subtitleW: 11.3 }
  );

  const casos = [
    {
      x: M,
      id: "M2",
      titulo: "Se elimina el correo del comprobante",
      prueba: 'assert "Ana Perez" in comprobante(...)',
      lectura: "El nombre sigue presente. La prueba pasa aunque falte el correo y aunque el RUT completo siga expuesto.",
      criterio: "La aserción no distingue una salida correcta de una defectuosa.",
    },
    {
      x: 6.68,
      id: "M3",
      titulo: "El servicio agrega un parámetro",
      prueba: "envio = Mock(return_value=True)",
      lectura: "El Mock acepta cualquier llamada. La prueba pasa aunque producción falle por la firma nueva.",
      criterio: "El doble no se derivó de la dependencia que sustituye.",
    },
  ];

  casos.forEach((caso) => {
    rect(slide, caso.x, 2.62, 5.93, 3.14, C.white);
    rect(slide, caso.x, 2.62, 5.93, 0.07, ROJO);
    addText(slide, caso.id, {
      x: caso.x + 0.28,
      y: 2.86,
      w: 0.8,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color: ROJO,
    });
    addText(slide, caso.titulo, {
      x: caso.x + 1.18,
      y: 2.88,
      w: 4.42,
      h: 0.44,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    rect(slide, caso.x + 0.28, 3.52, 5.36, 0.56, C.softBlue);
    addText(slide, caso.prueba, {
      x: caso.x + 0.48,
      y: 3.65,
      w: 4.96,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.5,
      color: C.ink,
    });
    addText(slide, caso.lectura, {
      x: caso.x + 0.28,
      y: 4.3,
      w: 5.36,
      h: 0.64,
      fontSize: 12,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
    rule(slide, caso.x + 0.28, 5.08, 5.36, C.border, 0.8);
    addText(slide, caso.criterio, {
      x: caso.x + 0.28,
      y: 5.22,
      w: 5.36,
      h: 0.4,
      fontSize: 11.5,
      bold: true,
      color: ROJO,
    });
  });

  addTakeaway(slide, "Dos pruebas en verde. Dos motivos diferentes para no incorporarlas tal como llegaron.", {
    y: 6.04,
    h: 0.56,
  });

  validateSlide(slide, pptx);
}

function slideCriterioTresAplicado() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · criterio 3",
    "El doble se deriva de la dependencia real",
    "La auditoría no descarta el caso de confirmación. Corrige la forma de construir su doble.",
    false,
    { subtitleW: 11.2 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.62,
    w: 11.89,
    h: 1.74,
    title: "La modificación necesaria",
    code: [
      "# antes: acepta cualquier firma",
      "envio = Mock(return_value=True)",
      "# despues: copia la firma de la dependencia real",
      "envio = create_autospec(enviar_confirmacion, return_value=True)",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.5,
    w: 7.42,
    h: 1.4,
    title: "Con el servicio que ahora exige tres parámetros",
    fontSize: 10.2,
    lines: [
      { text: "F.                                      [100%]", kind: "muted" },
      { text: "TypeError: missing a required argument: 'cuerpo'", kind: "error" },
      { text: "1 failed, 1 passed in 0.09s", kind: "error" },
    ],
  });

  rect(slide, 8.4, 4.5, 4.21, 1.4, C.softNeutral);
  addKicker(slide, 8.68, 4.7, "Decisión", AZUL, 2.2);
  addText(slide, "MODIFICAR", {
    x: 8.68,
    y: 5.02,
    w: 3.64,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: AZUL,
  });
  addText(slide, "El caso es válido. El doble no lo era.", {
    x: 8.68,
    y: 5.46,
    w: 3.64,
    h: 0.3,
    fontSize: 11.4,
    color: C.slate,
  });

  addTakeaway(slide, "La auditoría conserva la intención útil y elimina la suposición que la volvía engañosa.", {
    y: 6.1,
    h: 0.52,
  });

  validateSlide(slide, pptx);
}

function slideCuatroDecisiones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el resultado de la auditoría",
    "Cuatro pruebas, cuatro decisiones justificadas",
    "Auditar termina en una resolución registrada. «La dejo por si acaso» no es una quinta opción.",
    false,
    { subtitleW: 11.2 }
  );

  const filas = [
    ["ACEPTAR", "test_no_se_reserva_un_bloque_ocupado", "El esperado sale del requisito y la prueba mata el cambio correspondiente.", VERDE],
    ["MODIFICAR", "test_confirmacion_exitosa", "El caso es correcto. El Mock suelto se reemplaza por un doble derivado.", AZUL],
    ["POSPONER", "test_cancelar_con_exactamente_dos_horas_no_se_permite", "El requisito no decide la igualdad. Falta una decisión del equipo.", ORO],
    ["RECHAZAR", "test_comprobante_identifica_al_estudiante", "La aserción deja sobrevivir pérdidas de información y el defecto de confidencialidad.", ROJO],
  ];

  filas.forEach(([decision, prueba, fundamento, color], i) => {
    const y = 2.58 + i * 0.88;
    rect(slide, M, y, CW, 0.76, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.76, color);
    addText(slide, decision, {
      x: M + 0.3,
      y: y + 0.13,
      w: 1.72,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color,
      charSpacing: 1.0,
    });
    addText(slide, prueba, {
      x: M + 2.22,
      y: y + 0.12,
      w: 4.7,
      h: 0.46,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.2,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, fundamento, {
      x: M + 7.16,
      y: y + 0.1,
      w: CW - 7.48,
      h: 0.5,
      fontSize: 10.8,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 6.28, CW, 0.5, C.navy);
  addText(slide, "Rechazar la cuarta prueba reduce la cobertura. La decisión se defiende con el mutante que sobrevivió, no con una opinión.", {
    x: M + 0.3,
    y: 6.34,
    w: CW - 0.6,
    h: 0.36,
    fontSize: 12.2,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

function slideMetrDiseno() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · medir productividad",
    "Un ensayo aleatorizado sobre tareas reales",
    "METR, una organización de investigación, comparó tareas con y sin herramientas de IA mediante asignación al azar.",
    false,
    { subtitleW: 11.2 }
  );

  const cifras = [
    ["16", "desarrolladores experimentados", AZUL],
    ["246", "tareas reales en sus propios repositorios", ORO],
    ["22 000+", "estrellas de GitHub en promedio: señales públicas de interés", VERDE],
    ["1 millón+", "de líneas de código por repositorio", ROJO],
  ];

  cifras.forEach(([cifra, glosa, color], i) => {
    const x = M + (i % 2) * 6.16;
    const y = 2.6 + Math.floor(i / 2) * 1.46;
    rect(slide, x, y, 5.7, 1.2, C.white);
    rect(slide, x, y, 0.07, 1.2, color);
    addText(slide, cifra, {
      x: x + 0.3,
      y: y + 0.18,
      w: 1.9,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 2.48,
      y: y + 0.2,
      w: 2.88,
      h: 0.66,
      fontSize: 12,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "La asignación al azar separa el efecto de la herramienta de la decisión personal de usarla.", {
    y: 5.7,
    h: 0.56,
  });
  addFuente(slide, M, 6.48, "METR · Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity · 2025", {
    w: 10.8,
  });

  validateSlide(slide, pptx);
}

function slideMetrResultado() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 4 · resultado y límite",
    "Midieron más lento y sintieron más rápido",
    "El dato útil para esta clase es la distancia entre la ejecución observada y la percepción posterior.",
    true,
    { subtitleW: 11.2 }
  );

  const datos = [
    ["19 %", "más tiempo para terminar al usar IA", C.red],
    ["24 %", "más rápido: lo que esperaban antes", C.gold],
    ["20 %", "más rápido: lo que creían después", C.success],
  ];

  datos.forEach(([cifra, glosa, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 2.6, 3.82, 1.48, NAVY_CHIP);
    rect(slide, x, 2.6, 3.82, 0.07, color);
    addText(slide, cifra, {
      x: x + 0.26,
      y: 2.82,
      w: 3.3,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 36,
      bold: true,
      color,
      align: "center",
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: 3.5,
      w: 3.3,
      h: 0.38,
      fontSize: 11.4,
      color: C.white,
      align: "center",
    });
  });

  rect(slide, M, 4.38, CW, 0.76, C.gold);
  addText(slide, "Una suite verde con 83 % produce la misma sensación de avance. Los tres criterios muestran qué hay debajo.", {
    x: M + 0.34,
    y: 4.48,
    w: CW - 0.68,
    h: 0.54,
    fontSize: 13.4,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "mid",
  });

  addText(slide, "Lo que el estudio NO demuestra", {
    x: M,
    y: 5.48,
    w: 4.0,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.sand,
    charSpacing: 1.0,
  });
  addText(slide, "No representa a todos los desarrolladores, no descarta mejoras futuras y no mide cientos de horas de aprendizaje con la herramienta.", {
    x: M,
    y: 5.84,
    w: CW,
    h: 0.54,
    fontSize: 12.4,
    color: C.white,
    lineSpacingMultiple: 1.16,
  });

  addFuente(slide, M, 6.5, "METR · ensayo controlado aleatorizado · 16 participantes · 246 tareas", {
    color: C.gold,
    textColor: C.sand,
    w: 9.0,
  });

  validateSlide(slide, pptx);
}

function slidePreguntasB4() {
  slidePreguntas(4, "Tres preguntas para cerrar la auditoría", [
    [
      "Rechazar la prueba del comprobante reduce la cobertura. ¿Qué evidencia permite defender esa decisión sin depender de una opinión?",
      "Busca el cambio concreto que la prueba dejó sobrevivir.",
    ],
    [
      "La prueba de las dos horas exactas está bien escrita y mata su mutante. ¿Por qué corresponde posponerla en vez de aceptarla?",
      "Separa el poder de detección de la procedencia del esperado.",
    ],
    [
      "El estudio de METR encontró una brecha entre tiempo medido y velocidad percibida. ¿Qué parte de esta auditoría evita depender de esa sensación?",
      "Los tres criterios dejan una salida observable o una fuente declarada.",
    ],
  ]);
}

function slideRespuestasB4() {
  slideRespuestas(4, "Lo que tenía que aparecer", [
    [
      "El mutante sobreviviente",
      "Quitar el correo no hace fallar la prueba. Esa ejecución demuestra que la aserción acepta una salida defectuosa aunque el porcentaje baje al rechazarla.",
      "La decisión se defiende con comportamiento observado.",
      "«La prueba tiene un nombre claro, así que conviene conservarla.»",
    ],
    [
      "Porque el requisito no decide la igualdad",
      "La prueba detecta cambios, pero defiende la decisión del operador >. Incorporarla convertiría una ambigüedad pendiente en una regla falsa.",
      "Una prueba fuerte también puede proteger el comportamiento equivocado.",
      "«Si mata el mutante, entonces verifica el requisito.»",
    ],
    [
      "La evidencia ejecutable de los tres criterios",
      "La procedencia del esperado, el resultado del mutante y la relación del doble con su dependencia reemplazan la impresión por evidencia revisable.",
      "La auditoría mide lo que la sensación no puede medir.",
      "«Con experiencia basta para reconocer una buena suite.»",
    ],
  ]);
}

// ===================================================================== CIERRE

function slideCierreTresMedidas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · tres lecturas",
    "Tres medidas de una misma suite",
    "Ninguna reemplaza a las otras. La procedencia del esperado ordena la interpretación de las tres.",
    false,
    { subtitleW: 11.3 }
  );

  const filas = [
    ["COBERTURA", "Qué código se ejecutó y qué caminos se tomaron", "Si alguien comprobó el resultado", ORO],
    ["MUTANTE", "Si la suite reacciona a un cambio de comportamiento", "Si el comportamiento defendido es correcto", ROJO],
    ["PROCEDENCIA DEL ESPERADO", "Contra qué fuente se compara el resultado", "No reemplaza la ejecución ni el poder de detección", AZUL],
  ];

  addText(slide, "MEDIDA", {
    x: M + 0.24,
    y: 2.58,
    w: 2.1,
    h: 0.24,
    fontSize: 9.4,
    bold: true,
    color: C.slate,
    charSpacing: 1.2,
  });
  addText(slide, "QUÉ INFORMA", {
    x: M + 2.54,
    y: 2.58,
    w: 4.2,
    h: 0.24,
    fontSize: 9.4,
    bold: true,
    color: C.slate,
    charSpacing: 1.2,
  });
  addText(slide, "QUÉ NO PUEDE INFORMAR", {
    x: M + 7.16,
    y: 2.58,
    w: 4.5,
    h: 0.24,
    fontSize: 9.4,
    bold: true,
    color: C.slate,
    charSpacing: 1.2,
  });

  filas.forEach(([medida, informa, limite, color], i) => {
    const y = 2.96 + i * 0.98;
    rect(slide, M, y, CW, 0.84, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.07, 0.84, color);
    addText(slide, medida, {
      x: M + 0.28,
      y: y + 0.18,
      w: 2.02,
      h: 0.34,
      fontSize: 11.4,
      bold: true,
      color,
      charSpacing: 0.8,
    });
    addText(slide, informa, {
      x: M + 2.54,
      y: y + 0.14,
      w: 4.18,
      h: 0.5,
      fontSize: 11.6,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    addText(slide, limite, {
      x: M + 7.16,
      y: y + 0.14,
      w: 4.38,
      h: 0.5,
      fontSize: 11.6,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Un mutante matado con un esperado copiado del código confirma la implementación, no el requisito.", {
    y: 6.16,
    h: 0.56,
  });

  validateSlide(slide, pptx);
}

function slideAfirmacionDefendible() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Cierre · lo que sí se puede afirmar",
    "Una afirmación respaldada por evidencia",
    "El porcentaje deja de funcionar como veredicto y pasa a ocupar el lugar que le corresponde: una medida de recorrido.",
    true,
    { subtitleW: 11.2, titleFontSize: 29 }
  );

  addCita(
    slide,
    M,
    2.56,
    CW,
    1.54,
    "Esta suite ejecuta estas partes del sistema, comprueba estos comportamientos con esperados derivados del requisito y detecta estos cambios concretos, que puedo demostrar aplicándolos.",
    { fill: NAVY_CHIP, accent: C.gold, color: C.white, fontSize: 18, valign: "mid" }
  );

  const prohibidas = [
    ["«El porcentaje es alto»", "describe recorrido, no verificación"],
    ["«Toda la suite está verde»", "describe consistencia con sus propios esperados"],
    ["«El agente escribió las pruebas»", "describe autoría, no calidad"],
  ];

  prohibidas.forEach(([frase, correccion], i) => {
    const y = 4.46 + i * 0.64;
    addText(slide, frase, {
      x: M,
      y,
      w: 4.2,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: C.sand,
    });
    addText(slide, correccion, {
      x: 5.04,
      y,
      w: 7.1,
      h: 0.3,
      fontSize: 12.6,
      color: C.softBlue,
    });
  });

  validateSlide(slide, pptx);
}

function slidePuenteTdd() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · próxima sesión",
    "La prueba antes que el código",
    "Hoy se auditó una prueba que nació en verde. El desarrollo guiado por pruebas (TDD) invierte el orden y exige observar el fallo antes de implementar.",
    false,
    { subtitleW: 11.3 }
  );

  const etapas = [
    ["ROJO", "La prueba expresa el comportamiento esperado y falla porque todavía no existe.", ROJO],
    ["VERDE", "Se escribe el código mínimo que satisface ese comportamiento.", VERDE],
    ["REFACTORIZAR", "Se mejora el diseño sin perder la evidencia del rojo inicial.", AZUL],
  ];

  etapas.forEach(([nombre, glosa, color], i) => {
    const x = M + i * 4.04;
    rect(slide, x, 2.72, 3.82, 2.06, C.white);
    rect(slide, x, 2.72, 3.82, 0.08, color);
    addText(slide, String(i + 1), {
      x: x + 0.24,
      y: 3.0,
      w: 0.64,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color,
      align: "center",
    });
    addText(slide, nombre, {
      x: x + 1.04,
      y: 3.06,
      w: 2.48,
      h: 0.32,
      fontSize: 12.4,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    rule(slide, x + 0.24, 3.58, 3.34, C.border, 0.8);
    addText(slide, glosa, {
      x: x + 0.24,
      y: 3.78,
      w: 3.34,
      h: 0.72,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(slide, "Ver el rojo responde por construcción a una pregunta que hoy tuvimos que reconstruir: «¿esta prueba puede fallar?»", {
    y: 5.2,
    h: 0.64,
  });
  addText(slide, "El ciclo se aplicará en Python y después en Vitest. La disciplina no depende del lenguaje.", {
    x: M,
    y: 6.12,
    w: CW,
    h: 0.36,
    fontSize: 13,
    color: C.slate,
    align: "center",
  });

  validateSlide(slide, pptx);
}

function slideMensajeFinal() {
  const { slide } = createSlide("dark");
  addHeader(slide, "Cierre", "Recorrer no es verificar", "", true, {
    titleFontSize: 38,
  });

  addTriada(slide, "todas", { y: 2.46, dark: true });

  addText(slide, "Un número alto describe cuánto se recorrió.", {
    x: M,
    y: 3.54,
    w: CW,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.white,
    align: "center",
  });
  addText(slide, "Una aserción describe qué se comprobó.", {
    x: M,
    y: 4.18,
    w: CW,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.gold,
    align: "center",
  });
  addText(slide, "La procedencia del esperado describe contra qué.", {
    x: M,
    y: 4.82,
    w: CW,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 25,
    bold: true,
    color: C.success,
    align: "center",
  });

  rule(slide, 4.86, 5.58, 3.62, C.gold, 2.2);
  addText(slide, "El agente puede producir las tres cosas. El criterio para decidir si verifican el requisito sigue siendo humano.", {
    x: 2.02,
    y: 5.92,
    w: 9.3,
    h: 0.62,
    fontSize: 15.2,
    italic: true,
    color: C.softBlue,
    align: "center",
    lineSpacingMultiple: 1.15,
  });

  validateSlide(slide, pptx);
}

// ==================================================================== ORDEN

slidePortada();
slidePreguntaDeEntrada();
slideDeDondeViene();
slideElProyecto();
slideComoSeLeeUnaLlamada();
slideMapa();
slideComoSeLee();

slideDivisorB1();
slideDijkstraAbierta();
slideSuiteCorregida();
slideDosPalabras();
slideLaDicotomia();
slideHallazgoUno();
slideHallazgoDos();
slideHallazgoTres();
slideModeloDePrueba();
slideTresDefiniciones();
slideElEsperado();
slideElCriterioCompleto();
slideElComando();
slideElInforme();
slideLasDosLineas();
slideFowler();
slideCoberturaNoEsSoloLineas();
slideElAgenteDeriva();
slideTestGenLLM();
slideLimitesTestGen();
slidePreguntasB1();
slideRespuestasB1();

slideDivisorB2();
slideDosMedidas();
slideRegistrarReserva();
slideLasDosMediciones();
slideLeerLaArista();
slideIfSinElse();
slideLaPruebaSinAsercion();
slideDelOchentaOchoAlCien();
slideLaVersionIncomoda();
slideLaFormulacionPrecisa();
slideElMutante();
slideLaPreguntaQueReemplaza();
slideEstudioWaterloo();
slideHSQLDB();
slideLasAserciones();
slideAuditarUnaGenerada();
slidePreguntasB2();
slideRespuestasB2();

slideDivisorB3();
slideLaInyeccion();
slideFallaPorLaRed();
slideCuatroProblemas();
slideComoSeLeenEstasLlamadas();
slideDummyYStub();
slideSpyYMock();
slideFake();
slideEstadoVsComportamiento();
slideSeisAlCien();
slideElServicioCambia();
slideSeisEnVerdeYRoto();
slideAutospec();
slideLimiteDeAutospec();
slideDiscusionAbierta();
slideElAgenteInventaElDoble();
slidePreguntasB3();
slideRespuestasB3();

slideDivisorB4();
slideSuiteRecibida();
slideLaSuiteSeDescribe();
slideDarContexto();
slideCriterioUno();
slideTresMutantes();
slideMutanteMatadoProblema();
slideDosSobrevivientes();
slideCriterioTresAplicado();
slideCuatroDecisiones();
slideMetrDiseno();
slideMetrResultado();
slidePreguntasB4();
slideRespuestasB4();

slideCierreTresMedidas();
slideAfirmacionDefendible();
slidePuenteTdd();
slideMensajeFinal();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
