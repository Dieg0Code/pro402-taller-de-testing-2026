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
  subject: "PRO402 · Clase 07",
  title: "Lo que no está escrito no se puede probar",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(
  __dirname,
  "..",
  "Clase-07-Lo-Que-No-Esta-Escrito.pptx"
);

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

// Acento propio de esta clase: verde documento, para todo lo que es "lo escrito".
const DOC = "2F6F5E";
// Tintes del navy, para filetes y fichas sobre fondo oscuro.
const NAVY_RULE = "2C4A66";
const NAVY_CHIP = "1D3A57";
// Verde claro para texto sobre la placa verde documento.
const DOC_LIGHT = "A9DCC9";
const DOC_ON_NAVY = "7FC9B4";
const DOC_ON_PAPER = "255A4C";

// Verde legible sobre papel: el success del tema aclara demasiado en texto.
const VERDE = "2E7D4F";

const ACCENT_ON_PAPER = {
  [C.success]: VERDE,
  [C.gold]: "8A6A12",
  [C.red]: "B3181E",
  [DOC]: DOC_ON_PAPER,
};

function onPaper(accent) {
  return ACCENT_ON_PAPER[accent] || accent;
}

// ============================================================ PRIMITIVOS
// Se conservan del sistema de diapositivas: identidad institucional.

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

// Flecha horizontal; dir -1 apunta hacia la izquierda.
function arrow(slide, x, y, w, color, dir = 1, pt = 1.4) {
  slide.addShape(SH.line, {
    x,
    y,
    w,
    h: 0,
    line: {
      color,
      pt,
      beginArrowType: dir < 0 ? "triangle" : "none",
      endArrowType: dir < 0 ? "none" : "triangle",
    },
  });
}

function addCircleLabel(slide, x, y, size, fill, label, opts = {}) {
  slide.addShape(SH.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: {
      color: opts.outline || fill,
      pt: opts.outline && opts.outline !== fill ? 1 : 0,
    },
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
    w: opts.titleW || 9.7,
    h: 1.06,
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

// ============================================ COMPONENTES PROPIOS DE ESTA CLASE

// Banda de conclusión al pie. Cada lámina declara para qué sirve.
function addTakeaway(slide, text, opts = {}) {
  const y = opts.y || 6.14;
  const h = opts.h || 0.72;
  rect(slide, M, y, CW, h, opts.fill || C.navy);
  addText(slide, text, {
    x: M + 0.34,
    y: y + 0.05,
    w: CW - 0.68,
    h: h - 0.1,
    fontSize: opts.fontSize || 14.4,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });
}

// Sello de procedencia. Toda cifra o cita lleva su fuente a la vista.
function addFuente(slide, x, y, texto, opts = {}) {
  const w = opts.w || 5.4;
  rect(slide, x, y, 0.05, 0.2, opts.color || onPaper(C.gold));
  addText(slide, texto, {
    x: x + 0.16,
    y: y - 0.01,
    w,
    h: opts.h || 0.22,
    fontSize: opts.fontSize || 9.2,
    italic: true,
    color: opts.textColor || C.slate,
  });
}

// Bloque de cita textual. El texto de una norma o un paper se ve distinto
// a la voz del deck.
function addCita(slide, x, y, w, h, texto, opts = {}) {
  const accent = opts.accent || onPaper(C.navy);
  rect(slide, x, y, w, h, opts.fill || C.warm);
  rect(slide, x, y, 0.07, h, accent);
  addText(slide, `“${texto}”`, {
    x: x + 0.34,
    y: y + 0.14,
    w: w - 0.62,
    h: h - 0.28,
    fontSize: opts.fontSize || 13.4,
    italic: true,
    color: opts.color || C.ink,
    valign: opts.valign || "mid",
    lineSpacingMultiple: 1.2,
  });
}

// Etiqueta de sección pequeña, en versalitas.
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

// Divisor de bloque: fondo oscuro, número grande, pregunta que abre el bloque.
function slideDivisor(numero, titulo, pregunta, entrega) {
  const { slide } = createSlide("dark");

  addText(slide, `BLOQUE ${numero}`, {
    x: M,
    y: 1.66,
    w: 4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: C.gold,
    charSpacing: 2.1,
  });

  addText(slide, titulo, {
    x: M,
    y: 2.0,
    w: 8.5,
    h: 1.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.06,
  });

  rect(slide, M, 4.02, 2.2, 0.08, C.red);

  addKicker(slide, M, 4.38, "La pregunta del bloque", DOC_ON_NAVY, 5);
  addText(slide, pregunta, {
    x: M,
    y: 4.68,
    w: 7.4,
    h: 0.98,
    fontSize: 19,
    color: C.white,
    lineSpacingMultiple: 1.18,
  });

  vrule(slide, 9.1, 1.72, 3.9, NAVY_RULE, 1);
  addKicker(slide, 9.5, 1.72, "Con qué sales", C.gold, 3.4);
  entrega.forEach((linea, i) => {
    const y = 2.1 + i * 0.78;
    addCircleLabel(slide, 9.5, y, 0.3, NAVY_CHIP, String(i + 1), {
      fontSize: 10.5,
      color: DOC_ON_NAVY,
    });
    addText(slide, linea, {
      x: 9.94,
      y: y - 0.02,
      w: 2.9,
      h: 0.66,
      fontSize: 12.2,
      color: C.softBlue,
      lineSpacingMultiple: 1.14,
    });
  });

  validateSlide(slide, pptx);
}

// Lámina de preguntas guía. Formato fijo: son el mismo objeto en cada bloque.
function slidePreguntas(bloque, titulo, preguntas) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${bloque} · cierre`, titulo, "", false, {
    titleW: 10.3,
  });

  const COLORES = [onPaper(C.red), DOC_ON_PAPER, onPaper(C.gold)];
  const H = 1.3;

  preguntas.forEach(([texto, pista], i) => {
    const y = 2.44 + i * 1.42;
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

// ==================================================================== 01 PORTADA
// La clase trata sobre documentos: la portada es la carátula de uno.
function slidePortada() {
  const { slide } = createSlide("dark");

  addText(slide, "PRO402 · CLASE 07 · UNIDAD 01", {
    x: M,
    y: 1.5,
    w: 8.4,
    h: 0.26,
    fontSize: 11.6,
    bold: true,
    color: C.gold,
    charSpacing: 2.1,
  });

  addText(slide, "Lo que no está escrito\nno se puede probar", {
    x: M,
    y: 1.94,
    w: 11.4,
    h: 1.96,
    fontFace: TYPOGRAPHY.display,
    fontSize: 50,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });

  rect(slide, M, 4.04, 2.6, 0.09, C.red);

  addText(
    slide,
    "El ciclo de vida, la base de prueba y la documentación que la sostiene",
    {
      x: M,
      y: 4.36,
      w: 10.2,
      h: 0.46,
      fontSize: 20,
      color: C.softBlue,
    }
  );

  rule(slide, M, 5.16, CW, NAVY_RULE, 1);

  const meta = [
    ["FECHA", "Lunes 7 de septiembre de 2026"],
    ["HORARIO", "08:30 – 10:50 · 140 minutos"],
    ["DOCENTE", "Diego Obando"],
  ];
  meta.forEach(([label, value], i) => {
    const x = M + i * 3.9;
    addText(slide, label, {
      x,
      y: 5.38,
      w: 3.4,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: C.terminalMuted,
      charSpacing: 1.5,
    });
    addText(slide, value, {
      x,
      y: 5.64,
      w: 3.6,
      h: 0.34,
      fontSize: 14.5,
      bold: true,
      color: C.white,
    });
    if (i < 2) vrule(slide, x + 3.62, 5.34, 0.66, NAVY_RULE, 1);
  });

  addText(
    slide,
    "Marco de referencia:  ISO/IEC/IEEE 29119-2 y 29119-3:2021  ·  ISO/IEC 25010:2023  ·  Ley 21.719",
    {
      x: M,
      y: 6.42,
      w: 11.4,
      h: 0.26,
      fontSize: 12,
      color: DOC_ON_NAVY,
    }
  );

  validateSlide(slide, pptx);
}

// ================================================= 02 DE DÓNDE VENIMOS
// Un recorrido: tres barreras que el hallazgo atravesó, y la pregunta que dejó.
function slideDeDondeVenimos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "El hallazgo que atravesó todas las barreras",
    "La sesión anterior terminó con un dato personal expuesto en la salida del sistema. Estaba en la línea más corta del archivo y nadie lo marcó.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.5,
    h: 1.16,
    title: "src/curso.py · la línea en cuestión",
    code: 'return f"{alumno} ({rut}): {nota_final(notas)} - {estado(...)}"',
    lang: "python",
    fontSize: 11.4,
  });

  addKicker(slide, 7.32, 2.5, "Por dónde pasó sin que nadie lo viera", C.slate, 5.4);
  const barreras = [
    ["Tipado", "pyrefly: el tipo str es correcto"],
    ["Linter", "ruff: ningún patrón coincide"],
    ["Revisión", "tres auditorías, dos herramientas"],
  ];
  barreras.forEach(([nombre, detalle], i) => {
    const y = 2.86 + i * 0.44;
    addText(slide, "✕", {
      x: 7.32,
      y,
      w: 0.3,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: onPaper(C.red),
    });
    addText(slide, nombre, {
      x: 7.68,
      y,
      w: 1.5,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    addText(slide, detalle, {
      x: 9.16,
      y: y + 0.02,
      w: 3.4,
      h: 0.3,
      fontSize: 11.8,
      color: C.slate,
    });
  });

  rect(slide, M, 4.18, CW, 1.72, C.warm);
  rect(slide, M, 4.18, 0.07, 1.72, onPaper(C.red));
  addKicker(slide, M + 0.36, 4.4, "La explicación, y la pregunta que abre", onPaper(C.red), 6);
  addText(
    slide,
    "Ninguna barrera falló por incompetencia. Las tres hicieron lo único que podían hacer:\ncomparar el código contra lo que estaba escrito. El problema es que sobre este dato\nno había nada escrito, en ningún documento del proyecto.",
    {
      x: M + 0.36,
      y: 4.72,
      w: 7.4,
      h: 1.0,
      fontSize: 13.6,
      color: C.ink,
      lineSpacingMultiple: 1.2,
    }
  );
  vrule(slide, 8.5, 4.42, 1.26, C.border, 1);
  addText(slide, "¿Dónde y cuándo\nse escribe\nese documento?", {
    x: 8.86,
    y: 4.5,
    w: 3.4,
    h: 1.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: onPaper(C.red),
    lineSpacingMultiple: 1.08,
  });

  addTakeaway(
    slide,
    "Esa es la pregunta de hoy, y la respuesta llega antes de que exista una sola línea de código.",
    { y: 6.14 }
  );

  validateSlide(slide, pptx);
}

// ============================================================ 03 MAPA
// El mapa es la cadena de la clase: cada bloque entrega el insumo del siguiente.
function slideMapa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Mapa de la sesión",
    "Cuatro pasos que terminan en un requisito escrito",
    "Cada bloque produce lo que el siguiente necesita. Al final de la sesión, el dato personal que quedó expuesto está corregido y protegido por una prueba.",
    false,
    { titleW: 10.3 }
  );

  const bloques = [
    [
      onPaper(C.navy),
      "1",
      "El ciclo de vida",
      "08:40 · 25 min",
      "Qué prueba admite cada etapa, y por qué un error en el requisito no lo detecta ninguna prueba posterior.",
    ],
    [
      DOC_ON_PAPER,
      "2",
      "La base de prueba",
      "09:05 · 30 min",
      "El nombre de lo que faltaba, los documentos que define la norma, y qué le pasa a una suite sin ellos.",
    ],
    [
      onPaper(C.gold),
      "3",
      "El umbral",
      "09:45 · 30 min",
      "De una característica de calidad a un criterio con magnitud, método y umbral que sí se puede probar.",
    ],
    [
      onPaper(C.red),
      "4",
      "La finalidad",
      "10:15 · 25 min",
      "Quién fijó ese umbral: la ley, y por qué exige decidirlo antes de que el sistema exista.",
    ],
  ];

  const bw = 2.76;
  bloques.forEach(([color, num, titulo, horario, texto], i) => {
    const x = M + i * (bw + 0.28);
    rect(slide, x, 2.5, bw, 3.02, C.white);
    rect(slide, x, 2.5, bw, 0.08, color);
    addCircleLabel(slide, x + 0.24, 2.74, 0.44, color, num, { fontSize: 15 });
    addText(slide, titulo, {
      x: x + 0.24,
      y: 3.32,
      w: bw - 0.48,
      h: 0.34,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, horario, {
      x: x + 0.24,
      y: 3.7,
      w: bw - 0.48,
      h: 0.22,
      fontSize: 10.4,
      bold: true,
      color: C.slate,
      charSpacing: 0.8,
    });
    rule(slide, x + 0.24, 4.0, bw - 0.48, C.border, 0.7);
    addText(slide, texto, {
      x: x + 0.24,
      y: 4.14,
      w: bw - 0.48,
      h: 1.24,
      fontSize: 11.6,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    if (i < 3) arrow(slide, x + bw + 0.03, 4.0, 0.22, C.slate, 1, 1.4);
  });

  addText(slide, "Pausa 09:35 – 09:45", {
    x: M,
    y: 5.66,
    w: 4,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
  });

  addTakeaway(
    slide,
    "Sales con un documento escrito en tu repositorio, y con la prueba que ese documento hizo posible.",
    { y: 6.14 }
  );

  validateSlide(slide, pptx);
}

// ================================================== 04 DIVISOR BLOQUE 1
function slideDivisorB1() {
  slideDivisor(
    1,
    "Cada etapa admite\nla prueba que su\nmaterial permite",
    "¿Por qué la revisión fue la única prueba posible sobre ese hallazgo, y por qué la razón que da el oficio para probar temprano no se sostiene?",
    [
      "El mapa de qué prueba admite cada etapa del ciclo de vida",
      "Un argumento propio para escribir el requisito temprano",
      "La discusión que la industria tiene abierta hoy",
    ]
  );
}

// ============================= 05 LA INTUICIÓN ANTES DE LA TABLA
function slideLoQueExiste() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la idea de partida",
    "No eliges la prueba: la elige lo que ya está construido",
    "Antes de ver el mapa completo, dos casos donde se ve a simple vista.",
    false,
    { titleW: 10.3 }
  );

  const casos = [
    [
      onPaper(C.navy),
      "No puedes ejecutar una prueba unitaria…",
      "…de una función que todavía no existe. No hay nada que llamar.",
      "Falta el código",
    ],
    [
      onPaper(C.red),
      "No puedes medir el tiempo de respuesta…",
      "…de un sistema que todavía no está desplegado. No hay a qué cronometrar.",
      "Falta el despliegue",
    ],
  ];
  casos.forEach(([color, titulo, texto, etiqueta], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.5, 5.76, 1.72, C.white);
    rect(slide, x, 2.5, 0.07, 1.72, color);
    addText(slide, titulo, {
      x: x + 0.36,
      y: 2.74,
      w: 5.1,
      h: 0.32,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.36,
      y: 3.14,
      w: 5.1,
      h: 0.56,
      fontSize: 13,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    addText(slide, etiqueta.toUpperCase(), {
      x: x + 0.36,
      y: 3.82,
      w: 5.1,
      h: 0.22,
      fontSize: 9.6,
      bold: true,
      color,
      charSpacing: 1.2,
    });
  });

  rect(slide, M, 4.52, CW, 1.26, C.warm);
  addText(
    slide,
    "Los dos casos son obvios. Lo que no es obvio es la generalización, y es la que organiza el resto del bloque:",
    {
      x: M + 0.4,
      y: 4.74,
      w: CW - 0.8,
      h: 0.28,
      fontSize: 13.2,
      color: C.slate,
    }
  );
  addText(
    slide,
    "en cada etapa del ciclo de vida existe un material distinto, y ese material decide qué prueba es posible.",
    {
      x: M + 0.4,
      y: 5.08,
      w: CW - 0.8,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(
    slide,
    "La disciplina de quien prueba no cambia esto. Lo que no está construido no se puede ejecutar.",
    { y: 6.14 }
  );

  validateSlide(slide, pptx);
}

// ================================================= 06 EL MAPA DE ETAPAS
// Seis etapas en secuencia, con la fila de referencias abajo: la forma
// muestra el argumento antes de que se enuncie.
function slideEtapas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el mapa",
    "Qué existe en cada etapa, y qué prueba se vuelve posible",
    "",
    false,
    { titleW: 10.3 }
  );

  const COLS = [
    ["ETAPA", M, 1.86],
    ["YA EXISTE", 2.72, 3.24],
    ["PRUEBA QUE ADMITE", 6.12, 3.1],
    ["CONTRA QUÉ COMPARA", 9.46, 3.15],
  ];

  COLS.forEach(([etiqueta, x, w], i) => {
    addText(slide, etiqueta, {
      x,
      y: 2.32,
      w,
      h: 0.22,
      fontSize: 9.3,
      bold: true,
      color: i === 3 ? DOC_ON_PAPER : C.slate,
      charSpacing: 1.2,
    });
  });
  rule(slide, M, 2.6, CW, C.navy, 1.2);

  const etapas = [
    ["Requisitos", "Una descripción de lo que el producto debe hacer", "Ninguna ejecutable. Solo leerla: ¿completa? ¿verificable?", "El dominio y el usuario"],
    ["Diseño", "Módulos, contratos e interfaces decididos", "Revisión del diseño", "El requisito escrito"],
    ["Código", "Funciones, tipos y firmas escritas", "Tipado, linter, revisión y prueba unitaria", "El requisito y el diseño"],
    ["Integración", "Componentes que se llaman entre sí", "Prueba de integración", "Los contratos de interfaz"],
    ["Sistema", "El producto completo y desplegado", "Prueba de sistema y extremo a extremo", "El requisito, completo"],
    ["Operación", "El producto en uso, con usuarios reales", "Validación, monitoreo e incidentes", "La necesidad real"],
  ];

  const RH = 0.52;
  etapas.forEach(([nombre, existe, prueba, contra], i) => {
    const y = 2.68 + i * RH;
    const primera = i === 0;

    if (primera) rect(slide, M, y, CW, RH - 0.04, C.paleRed);
    else if (i % 2 === 1) rect(slide, M, y, CW, RH - 0.04, C.white);

    rect(slide, M, y, 0.05, RH - 0.04, primera ? onPaper(C.red) : C.border);

    addText(slide, nombre, {
      x: M + 0.2,
      y: y + 0.13,
      w: 1.7,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color: primera ? onPaper(C.red) : C.ink,
    });
    addText(slide, existe, {
      x: 2.72,
      y: y + 0.09,
      w: 3.24,
      h: 0.38,
      fontSize: 10.6,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
    addText(slide, prueba, {
      x: 6.12,
      y: y + 0.09,
      w: 3.1,
      h: 0.38,
      fontSize: 10.6,
      bold: primera,
      color: primera ? onPaper(C.red) : C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
    addText(slide, contra, {
      x: 9.76,
      y: y + 0.09,
      w: 2.85,
      h: 0.38,
      fontSize: 10.6,
      bold: true,
      color: primera ? onPaper(C.red) : DOC_ON_PAPER,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });

    // La referencia de cada etapa apunta a la etapa anterior: flecha hacia arriba.
    if (i > 0) {
      slide.addShape(SH.line, {
        x: 9.5,
        y: y + 0.06,
        w: 0,
        h: 0.42,
        line: {
          color: DOC_ON_PAPER,
          pt: 1.1,
          beginArrowType: "triangle",
          endArrowType: "none",
        },
      });
    }
  });

  rule(slide, M, 5.82, CW, C.border, 0.9);
  addText(
    slide,
    "Las flechas de la última columna apuntan hacia arriba: la referencia de cada etapa es el producto de la etapa anterior.",
    {
      x: M,
      y: 5.92,
      w: CW,
      h: 0.26,
      fontSize: 12.2,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Requisitos es la única fila sin nada que ejecutar, y la única cuya referencia está fuera del proyecto.",
    { y: 6.28, h: 0.6, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ======================================== 07 LA CONSECUENCIA LÓGICA
function slideConsecuencia() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la consecuencia",
    "Por qué un error en el requisito es invisible",
    "Si cada etapa compara contra la anterior, la primera no tiene contra qué compararse. Y todo lo demás la usa de referencia.",
    false,
    { titleW: 10.3 }
  );

  // El requisito arriba, alimentando a las tres pruebas de abajo.
  rect(slide, 4.5, 2.56, 4.34, 0.66, onPaper(C.red));
  addText(slide, "EL REQUISITO", {
    x: 4.5,
    y: 2.62,
    w: 4.34,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 1.4,
  });
  addText(slide, "si aquí hay un error…", {
    x: 4.5,
    y: 2.88,
    w: 4.34,
    h: 0.28,
    fontSize: 13.4,
    italic: true,
    color: C.white,
    align: "center",
  });

  const pruebas = ["Prueba unitaria", "Prueba de integración", "Prueba de sistema"];
  pruebas.forEach((nombre, i) => {
    const x = M + i * 4.06;
    // Linea desde el requisito hasta el centro de cada tarjeta. El ancho de una
    // figura no puede ser negativo: hacia la izquierda se refleja con flipH.
    const origenX = 6.667;
    const destinoX = x + 1.89;
    slide.addShape(SH.line, {
      x: Math.min(origenX, destinoX),
      y: 3.22,
      w: Math.abs(destinoX - origenX),
      h: 0.52,
      flipH: destinoX < origenX,
      line: { color: C.slate, pt: 1, endArrowType: "triangle" },
    });
    rect(slide, x, 3.82, 3.78, 0.94, C.white);
    addText(slide, nombre, {
      x: x + 0.24,
      y: 3.98,
      w: 3.3,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, "compara el código contra él", {
      x: x + 0.24,
      y: 4.3,
      w: 3.3,
      h: 0.28,
      fontSize: 11.6,
      color: C.slate,
    });
    rect(slide, x, 4.76, 3.78, 0.4, C.successSoft);
    addText(slide, "→  verde", {
      x: x + 0.24,
      y: 4.83,
      w: 3.3,
      h: 0.26,
      fontSize: 12,
      bold: true,
      color: VERDE,
    });
  });

  rect(slide, M, 5.36, CW, 0.64, C.warm);
  addText(
    slide,
    "Las tres pasan. Ninguna puede detectar el error, porque las tres lo están usando como referencia.",
    {
      x: M + 0.34,
      y: 5.46,
      w: CW - 0.68,
      h: 0.44,
      fontSize: 14,
      bold: true,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Una prueba en verde no dice que el requisito sea correcto: dice que el código coincide con él.",
    { y: 6.14 }
  );

  validateSlide(slide, pptx);
}

// ================================== 08 LA CIFRA QUE TODOS REPITEN
function slideLaCifra() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la evidencia",
    "La razón que da el oficio para escribir el requisito temprano",
    "Existe una respuesta estándar a esta pregunta, y la vas a escuchar en tu primer trabajo. Conviene conocerla bien antes de usarla.",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.58, 7.34, 1.9, C.navy);
  addText(slide, "LO QUE SE CITA", {
    x: M + 0.4,
    y: 2.78,
    w: 4,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: C.gold,
    charSpacing: 1.4,
  });
  addText(
    slide,
    "«Encontrar y corregir un problema de software después de la entrega suele ser 100 veces más caro que encontrarlo y corregirlo durante la etapa de requisitos y diseño.»",
    {
      x: M + 0.4,
      y: 3.1,
      w: 6.54,
      h: 1.14,
      fontSize: 14.6,
      italic: true,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  rect(slide, 8.42, 2.58, 4.19, 1.9, C.warm);
  addText(slide, "DE DÓNDE SALE", {
    x: 8.78,
    y: 2.78,
    w: 3.6,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.4,
  });
  addText(slide, "Barry Boehm y\nVictor Basili", {
    x: 8.78,
    y: 3.08,
    w: 3.5,
    h: 0.56,
    fontSize: 15,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  addText(
    slide,
    "«Software Defect Reduction\nTop 10 List», punto 1.\nIEEE Computer, enero de 2001.",
    {
      x: 8.78,
      y: 3.72,
      w: 3.5,
      h: 0.62,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    }
  );

  addText(
    slide,
    "Es una fuente real, revisada por pares, escrita por dos de los investigadores más citados de la ingeniería de software. La cifra que se repite —cien veces más caro— sale efectivamente de ahí.",
    {
      x: M,
      y: 4.72,
      w: 11.6,
      h: 0.62,
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 5.48, CW, 0.5, C.softNeutral);
  addText(slide, "El problema no es la cita. Es dónde la corta todo el mundo.", {
    x: M + 0.34,
    y: 5.56,
    w: CW - 0.68,
    h: 0.34,
    fontSize: 14.6,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });

  addFuente(slide, M, 6.24, "Boehm y Basili, IEEE Computer, enero de 2001, pp. 135-137 · traducción del original en inglés.", {
    w: 7,
  });

  validateSlide(slide, pptx);
}

// ======================= 09 EL RESTO DEL MISMO PÁRRAFO
// Mismo objeto visual que la lámina anterior, continuado: la forma dice
// "esto sigue donde lo dejamos".
function slideElResto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la evidencia",
    "Lo que dice el mismo párrafo, dos líneas más abajo",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.2, CW, 0.52, C.navy);
  addText(
    slide,
    "«…suele ser 100 veces más caro que encontrarlo y corregirlo durante la etapa de requisitos y diseño.»",
    {
      x: M + 0.4,
      y: 2.28,
      w: CW - 0.8,
      h: 0.36,
      fontSize: 12.6,
      italic: true,
      color: C.terminalMuted,
    }
  );

  const revelaciones = [
    [
      onPaper(C.gold),
      "1",
      "Agregaron la palabra «often»",
      "Para esta lista actualizada agregamos la palabra «often» —a menudo— para reflejar aprendizajes adicionales sobre esta observación.",
      "Respecto de su propia lista de 1987. La cifra vino con una advertencia desde el principio.",
    ],
    [
      onPaper(C.red),
      "2",
      "Y dieron la otra cifra",
      "Un aprendizaje muestra que el factor de escalamiento de costo, para sistemas de software pequeños y no críticos, se acerca más a 5:1 que a 100:1.",
      "Cinco a uno para sistemas pequeños y no críticos: tu proyecto, y casi todo el software que se escribe.",
    ],
  ];
  revelaciones.forEach(([color, num, titulo, cita, glosa], i) => {
    const y = 2.94 + i * 1.5;
    rect(slide, M, y, CW, 1.32, C.white);
    rect(slide, M, y, 0.07, 1.32, color);
    addCircleLabel(slide, M + 0.3, y + 0.22, 0.38, color, num, { fontSize: 13 });
    addText(slide, titulo, {
      x: M + 0.84,
      y: y + 0.2,
      w: 4.2,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.84,
      y: y + 0.58,
      w: 4.16,
      h: 0.7,
      fontSize: 12,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    vrule(slide, 5.9, y + 0.2, 1.02, C.border, 1);
    addText(slide, `“${cita}”`, {
      x: 6.22,
      y: y + 0.24,
      w: 5.84,
      h: 0.96,
      fontSize: 12.8,
      italic: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.18,
    });
  });

  addFuente(
    slide,
    M,
    5.86,
    "Boehm y Basili, IEEE Computer, enero de 2001 · traducción del original en inglés.",
    { w: 7.4 }
  );

  addTakeaway(
    slide,
    "La cifra no es falsa. Está recortada: la fuente que se cita para el 100:1 dice, ahí mismo, que en tu caso es 5:1.",
    { y: 6.2, h: 0.66, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ===================== 10 LAS DOS EVIDENCIAS QUE FALTAN
function slideDosEvidencias() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la evidencia",
    "Dos cosas más que conviene saber de esa curva",
    "",
    false,
    { titleW: 10.3 }
  );

  // Izquierda: la fuente que no existe.
  rect(slide, M, 2.2, 5.76, 3.24, C.white);
  rect(slide, M, 2.2, 5.76, 0.07, onPaper(C.gold));
  addKicker(slide, M + 0.34, 2.44, "La versión peor", onPaper(C.gold), 4);
  addText(slide, "La tabla 1 : 10 : 100", {
    x: M + 0.34,
    y: 2.72,
    w: 5.1,
    h: 0.36,
    fontSize: 19,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "En presentaciones corporativas la razón suele atribuirse a un «IBM Systems Sciences Institute».",
    {
      x: M + 0.34,
      y: 3.18,
      w: 5.1,
      h: 0.5,
      fontSize: 12.6,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    }
  );
  rule(slide, M + 0.34, 3.8, 5.1, C.border, 0.7);
  addText(slide, "Cuando alguien siguió el rastro documental:", {
    x: M + 0.34,
    y: 3.94,
    w: 5.1,
    h: 0.26,
    fontSize: 12,
    bold: true,
    color: C.ink,
  });
  [
    "Ese instituto nunca publicó tal investigación.",
    "Era un programa interno de capacitación.",
    "El rastro muere en notas de curso de 1981.",
    "Los datos originales jamás aparecieron.",
  ].forEach((linea, i) => {
    const y = 4.26 + i * 0.28;
    addText(slide, "—", {
      x: M + 0.34,
      y,
      w: 0.24,
      h: 0.24,
      fontSize: 11.5,
      color: onPaper(C.gold),
    });
    addText(slide, linea, {
      x: M + 0.64,
      y,
      w: 4.8,
      h: 0.24,
      fontSize: 11.8,
      color: C.slate,
    });
  });

  // Derecha: el estudio empírico.
  rect(slide, 6.88, 2.2, 5.73, 3.24, C.white);
  rect(slide, 6.88, 2.2, 5.73, 0.07, DOC_ON_PAPER);
  addKicker(slide, 7.22, 2.44, "Lo que dicen los datos actuales", DOC_ON_PAPER, 4.6);
  addText(slide, "171 proyectos, 2006 – 2014", {
    x: 7.22,
    y: 2.72,
    w: 5.1,
    h: 0.36,
    fontSize: 19,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "Menzies, Nichols, Shull y Layman fueron a buscar el efecto en el estudio más grande publicado sobre el tema.",
    {
      x: 7.22,
      y: 3.18,
      w: 5.06,
      h: 0.5,
      fontSize: 12.6,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    }
  );
  addCita(
    slide,
    7.22,
    3.78,
    5.06,
    0.78,
    "No encontramos evidencia del efecto de postergación del problema.",
    { accent: DOC_ON_PAPER, fontSize: 13.4 }
  );
  rect(slide, 7.22, 4.64, 5.06, 0.74, C.softNeutral);
  addText(
    slide,
    "Declaran su propia limitación en la primera página: los 171 proyectos usan una metodología que dos de los autores promueven.",
    {
      x: 7.42,
      y: 4.72,
      w: 4.66,
      h: 0.6,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    }
  );

  addText(
    slide,
    "Un estudio que desmonta una creencia y publica al mismo tiempo el sesgo de su muestra está haciendo el trabajo bien.",
    {
      x: M,
      y: 5.5,
      w: CW,
      h: 0.3,
      fontSize: 12.6,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  addFuente(
    slide,
    M,
    5.86,
    "Menzies, Nichols, Shull y Layman, arXiv:1609.04886 (2016) · traducción del original en inglés.",
    { w: 7.6, color: DOC_ON_PAPER }
  );

  addTakeaway(
    slide,
    "Queda en pie el argumento lógico: un error en el requisito es invisible después. Ese no depende de ninguna cifra.",
    { y: 6.2, h: 0.66, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ================= 11 QUÉ CAMBIÓ CUANDO EL CÓDIGO SE ABARATÓ
function slideCodigoBarato() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · lo que cambió",
    "La curva suponía que reescribir código era lo caro",
    "Ese supuesto casi nunca se enuncia, y es el que se movió.",
    false,
    { titleW: 10.3 }
  );

  // Antes y ahora, uno sobre otro, para que se lea el giro.
  const filas = [
    [
      C.slate,
      "ANTES",
      "Un cambio de requisito obligaba a rehacer meses de trabajo humano. De ahí salía el costo.",
      "Corregir era lento y caro.",
    ],
    [
      onPaper(C.red),
      "AHORA",
      "Generar el código dejó de ser el cuello de botella. Rehacerlo entero suele ser más barato que discutir cómo parcharlo.",
      "Corregir es rápido y barato.",
    ],
  ];
  filas.forEach(([color, etiqueta, texto, remate], i) => {
    const y = 2.5 + i * 1.14;
    rect(slide, M, y, CW, 1.02, i === 0 ? C.softNeutral : C.white);
    rect(slide, M, y, 0.07, 1.02, color);
    addText(slide, etiqueta, {
      x: M + 0.34,
      y: y + 0.16,
      w: 1.4,
      h: 0.26,
      fontSize: 11,
      bold: true,
      color,
      charSpacing: 1.4,
    });
    addText(slide, texto, {
      x: M + 1.9,
      y: y + 0.14,
      w: 5.86,
      h: 0.74,
      fontSize: 13,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
    vrule(slide, 8.6, y + 0.16, 0.7, C.border, 1);
    addText(slide, remate, {
      x: 8.94,
      y: y + 0.3,
      w: 3.4,
      h: 0.42,
      fontSize: 13,
      bold: true,
      color,
    });
  });

  addCita(
    slide,
    M,
    4.86,
    6.4,
    0.72,
    "El código ahora es barato: podemos crearlo rápido y desecharlo igual de rápido.",
    { accent: onPaper(C.red), fontSize: 13 }
  );
  addFuente(slide, M, 5.68, "Colin Eberhardt, Scott Logic, noviembre de 2025 · traducción.", {
    w: 5.6,
  });

  rect(slide, 7.34, 4.86, 5.27, 1.04, C.navy);
  addText(
    slide,
    "Pero el requisito no se abarató.\nY un requisito equivocado ya no produce\ncódigo equivocado despacio: lo produce rápido.",
    {
      x: 7.66,
      y: 4.98,
      w: 4.7,
      h: 0.82,
      fontSize: 12.8,
      color: C.white,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Antes, un requisito equivocado costaba caro de corregir. Ahora se ejecuta más rápido.",
    { y: 6.14, fill: onPaper(C.red) }
  );

  validateSlide(slide, pptx);
}

// ========================= 12 LA DISCUSIÓN ABIERTA
function slideDiscusion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · lo que está en disputa",
    "La industria no tiene esto resuelto, y conviene saberlo",
    "Dos posiciones sobre qué hacer ahora que el código es barato. Las dos publicadas en 2025, con evidencia.",
    false,
    { titleW: 10.3 }
  );

  const lados = [
    [
      onPaper(C.navy),
      "POSICIÓN A",
      "La especificación es lo que produces",
      "Si el agente escribe el código a partir de lo que le dices, el artefacto real es la especificación. GitHub publicó un flujo de cuatro fases para formalizarlo.",
      "La IA vuelve ejecutables las especificaciones. Cuando tu especificación se convierte automáticamente en código que funciona, es ella la que determina qué se construye.",
      "GitHub Blog, septiembre de 2025 · traducción",
    ],
    [
      onPaper(C.red),
      "POSICIÓN B",
      "Eso reinventa la cascada",
      "Aplicó ese flujo a una funcionalidad real y midió: 2.577 líneas de markdown para 689 de código. 3,5 horas de revisión, contra 15 minutos de su método iterativo.",
      "El código es ley porque es lenguaje formal sobre el que se puede razonar. Se puede probar… Las especificaciones carecen de esa formalidad.",
      "Scott Logic, noviembre de 2025 · traducción",
    ],
  ];

  lados.forEach(([color, etiqueta, titulo, texto, cita, fuente], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.5, 5.76, 3.28, C.white);
    rect(slide, x, 2.5, 5.76, 0.07, color);
    addKicker(slide, x + 0.34, 2.72, etiqueta, color, 3);
    addText(slide, titulo, {
      x: x + 0.34,
      y: 2.98,
      w: 5.1,
      h: 0.34,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 3.42,
      w: 5.1,
      h: 0.86,
      fontSize: 12.4,
      color: C.slate,
      lineSpacingMultiple: 1.18,
    });
    addCita(slide, x + 0.34, 4.36, 5.08, 0.96, cita, {
      accent: color,
      fontSize: 11.8,
      fill: i === 0 ? C.softBlue : C.paleRed,
    });
    addFuente(slide, x + 0.34, 5.44, fuente, { w: 4.6, color });
  });

  addTakeaway(
    slide,
    "Ninguna de las dos discute que el artefacto caro dejó de ser el código. Y la objeción de B no dice que la especificación esté de más: dice que una especificación que no se puede probar no sirve.",
    { y: 6.02, h: 0.84, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ============================ 13 LA VERSIÓN MÍNIMA YA ADOPTADA
function slideAgentsMd() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · lo que ya se adoptó",
    "Mientras se discute, una convención se estandarizó",
    "Un archivo en la raíz del repositorio, descrito por su propia especificación como «un README para agentes».",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 6.2,
    h: 2.42,
    title: "AGENTS.md · qué va adentro, según la especificación",
    code: [
      "# Nombre del proyecto",
      "",
      "## Comandos de prueba",
      "uv run pytest        # la suite completa",
      "uv run ruff check .  # el linter",
      "",
      "## Reglas del producto",
      "- La nota final se redondea con ROUND_HALF_UP.",
    ].join("\n"),
    lang: "markdown",
    fontSize: 11,
  });

  addKicker(slide, 7.28, 2.6, "Qué tan adoptada está", C.slate, 5);
  const datos = [
    ["+60.000", "proyectos de código abierto la usan"],
    ["+20", "herramientas de agentes la soportan"],
    ["2025", "especificación abierta, hoy bajo la Agentic AI Foundation"],
  ];
  datos.forEach(([cifra, texto], i) => {
    const y = 2.92 + i * 0.72;
    addText(slide, cifra, {
      x: 7.28,
      y,
      w: 1.5,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: DOC_ON_PAPER,
    });
    addText(slide, texto, {
      x: 8.86,
      y: y + 0.04,
      w: 3.5,
      h: 0.56,
      fontSize: 11.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
    if (i < 2) rule(slide, 7.28, y + 0.58, 5.08, C.border, 0.7);
  });

  rect(slide, M, 5.18, CW, 0.76, C.warm);
  rect(slide, M, 5.18, 0.07, 0.76, DOC_ON_PAPER);
  addText(
    slide,
    "Fíjate en qué contiene según su propia especificación: los comandos de prueba. Es el lugar donde le escribes al agente contra qué debe comparar su trabajo.",
    {
      x: M + 0.36,
      y: 5.3,
      w: CW - 0.72,
      h: 0.54,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Es la primera fila del mapa de etapas, hecha archivo: el lugar donde el proyecto declara contra qué se lo debe comparar.",
    { y: 6.14 }
  );

  validateSlide(slide, pptx);
}

// ================================ 14 PREGUNTAS GUÍA DEL BLOQUE 1
function slidePreguntasB1() {
  slidePreguntas(1, "Preguntas para llevarse del Bloque 1", [
    [
      "Una prueba unitaria en verde compara el código contra el requisito. Si el requisito está equivocado, ¿de qué color queda la prueba, y qué puede garantizar entonces una suite completamente verde?",
      "Mira la última columna del mapa de etapas: contra qué compara cada prueba.",
    ],
    [
      "Los autores del «100 veces más caro» escribieron también «5:1» en el mismo párrafo, y la industria repite solo el primero. ¿Qué le exigirías a una cifra antes de usarla para justificar una decisión en tu trabajo?",
      "Pregúntate quién midió, cuándo, sobre qué tamaño de sistema, y si el dato original existe.",
    ],
    [
      "Si generar código se volvió rápido y barato, ¿qué parte del trabajo pasó a ser proporcionalmente la más cara? ¿Es una parte que puedas delegar en un agente?",
      "De las seis etapas del mapa, busca la única que no se acelera por escribir más rápido.",
    ],
  ]);
}

// ================================================== 15 DIVISOR BLOQUE 2
function slideDivisorB2() {
  slideDivisor(
    2,
    "El documento\nque faltaba\ntiene nombre",
    "¿Qué le pasa a una suite de pruebas cuando lo único contra qué comparar es el propio código que se está probando?",
    [
      "El nombre técnico de aquello contra lo que compara una prueba",
      "La medición de dos suites escritas para el mismo código",
      "El inventario de documentos que tu proyecto ya tiene",
    ]
  );
}

// ============================== 16 QUÉ ES LA BASE DE PRUEBA
// Primero el mecanismo —las cuatro partes de una prueba—, y recién despues
// el nombre. Nada se usa antes de definirse.
function slideBaseDePrueba() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el concepto",
    "Toda prueba tiene cuatro partes, y la cuarta es el problema",
    "",
    false,
    { titleW: 10.3 }
  );

  const partes = [
    [onPaper(C.navy), "1", "Una entrada", "los datos con los que se llama"],
    [onPaper(C.navy), "2", "El programa", "el código que se está probando"],
    [onPaper(C.navy), "3", "Una salida", "lo que el programa devolvió"],
    [onPaper(C.red), "4", "Un criterio", "lo que decide si esa salida es correcta"],
  ];
  const pw = 2.82;
  partes.forEach(([color, num, titulo, glosa], i) => {
    const x = M + i * (pw + 0.22);
    const ultima = i === 3;
    rect(slide, x, 2.26, pw, 1.16, ultima ? C.paleRed : C.white);
    rect(slide, x, 2.26, pw, 0.06, color);
    addCircleLabel(slide, x + 0.22, 2.46, 0.34, color, num, { fontSize: 11.5 });
    addText(slide, titulo, {
      x: x + 0.66,
      y: 2.48,
      w: pw - 0.86,
      h: 0.28,
      fontSize: 14,
      bold: true,
      color: ultima ? onPaper(C.red) : C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 2.9,
      w: pw - 0.44,
      h: 0.44,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    if (i < 3) arrow(slide, x + pw + 0.02, 2.84, 0.18, C.slate, 1, 1.2);
  });

  addText(
    slide,
    "Las tres primeras son fáciles de montar. La cuarta es la difícil, y tiene nombre técnico:",
    {
      x: M,
      y: 3.6,
      w: CW,
      h: 0.28,
      fontSize: 13.4,
      color: C.slate,
    }
  );

  rect(slide, M, 4.0, 3.5, 1.06, DOC_ON_PAPER);
  addText(slide, "BASE DE PRUEBA", {
    x: M + 0.28,
    y: 4.2,
    w: 3,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: DOC_LIGHT,
    charSpacing: 1.4,
  });
  addText(slide, "test basis", {
    x: M + 0.28,
    y: 4.5,
    w: 3,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: C.white,
  });

  addCita(
    slide,
    4.44,
    4.0,
    8.17,
    1.06,
    "La información que se usa como base para diseñar e implementar los casos de prueba.",
    { accent: DOC_ON_PAPER, fontSize: 14 }
  );

  rect(slide, M, 5.2, CW, 0.84, C.warm);
  rect(slide, M, 5.2, 0.07, 0.84, onPaper(C.red));
  addText(slide, "La norma agrega una advertencia en su propia definición:", {
    x: M + 0.34,
    y: 5.3,
    w: 7.6,
    h: 0.24,
    fontSize: 11.6,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "«…pero también puede ser un entendimiento no documentado del comportamiento requerido.»",
    {
      x: M + 0.34,
      y: 5.6,
      w: CW - 0.7,
      h: 0.32,
      fontSize: 13.6,
      italic: true,
      color: onPaper(C.red),
    }
  );

  addFuente(
    slide,
    M,
    6.16,
    "ISO/IEC/IEEE 29119-3:2021, cláusula 3.7 · traducción del original en inglés.",
    { w: 7, color: DOC_ON_PAPER }
  );

  addTakeaway(
    slide,
    "Muchas veces lo único contra qué comparar es lo que alguien tiene en la cabeza. La norma no lo prohíbe: lo nombra.",
    { y: 6.4, h: 0.56, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ============================== 17 EL MONTAJE DEL EXPERIMENTO
// Un experimento controlado se dibuja como tal: todo igual, una sola variable.
function slideMontaje() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el experimento",
    "Dos suites para el mismo código, con una sola diferencia",
    "A un agente se le pidió la suite de pruebas de un módulo que calcula el cierre de una asignatura. La instrucción fue idéntica en los dos montajes.",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.58, CW, 0.6, C.navy);
  addText(slide, "LA MISMA INSTRUCCIÓN EN LOS DOS CASOS", {
    x: M + 0.34,
    y: 2.68,
    w: 4.6,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: C.gold,
    charSpacing: 1.3,
  });
  addText(
    slide,
    "«Escribe pruebas unitarias con pytest para todas las funciones de src/curso.py.»",
    {
      x: M + 0.34,
      y: 2.9,
      w: CW - 0.7,
      h: 0.24,
      fontSize: 13,
      italic: true,
      color: C.white,
    }
  );

  const montajes = [
    [
      onPaper(C.navy),
      "PROTOCOLO A",
      ["src/curso.py", "pyproject.toml"],
      [],
      "La carpeta contiene solo el código.",
    ],
    [
      DOC_ON_PAPER,
      "PROTOCOLO B",
      ["src/curso.py", "pyproject.toml"],
      ["REQUISITOS.md"],
      "La misma carpeta, más el documento que declara la regla de negocio.",
    ],
  ];

  montajes.forEach(([color, etiqueta, comunes, extra, glosa], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 3.38, 5.76, 2.3, C.white);
    rect(slide, x, 3.38, 5.76, 0.07, color);
    addKicker(slide, x + 0.34, 3.58, etiqueta, color, 3);

    comunes.forEach((archivo, j) => {
      const y = 3.9 + j * 0.36;
      addText(slide, "📄", {
        x: x + 0.34,
        y,
        w: 0.26,
        h: 0.26,
        fontSize: 11,
        color: C.slate,
      });
      addText(slide, archivo, {
        x: x + 0.66,
        y,
        w: 4.4,
        h: 0.26,
        fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
        fontSize: 12.4,
        color: C.slate,
      });
    });

    if (extra.length) {
      rect(slide, x + 0.24, 4.6, 5.28, 0.42, C.successSoft);
      addText(slide, "📄", {
        x: x + 0.34,
        y: 4.68,
        w: 0.26,
        h: 0.26,
        fontSize: 11,
        color: DOC_ON_PAPER,
      });
      addText(slide, extra[0], {
        x: x + 0.66,
        y: 4.68,
        w: 2.4,
        h: 0.26,
        fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
        fontSize: 12.4,
        bold: true,
        color: DOC_ON_PAPER,
      });
      addText(slide, "← la única diferencia", {
        x: x + 3.3,
        y: 4.68,
        w: 2.1,
        h: 0.26,
        fontSize: 11,
        bold: true,
        color: DOC_ON_PAPER,
      });
    }

    addText(slide, glosa, {
      x: x + 0.34,
      y: 5.14,
      w: 5.08,
      h: 0.44,
      fontSize: 12.2,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(
    slide,
    "Un solo archivo de diferencia: cualquier cambio en el resultado se explica por ese archivo.",
    { y: 5.94, h: 0.62 }
  );

  validateSlide(slide, pptx);
}

// ================== 18 PROTOCOLO A: LA SUITE QUE NO PUEDE FALLAR
function slideProtocoloA() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · resultado A",
    "Sin el documento, el agente copió el código",
    "Y lo dijo. Esto lo escribió solo, arriba del archivo de pruebas, sin que nadie se lo pidiera.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.5,
    h: 1.3,
    title: "tests/test_curso.py · lo primero que escribió",
    code: [
      '"""REQUISITOS.md no esta en el repositorio, asi que estas pruebas',
      'fijan el comportamiento actual del codigo, no la regla declarada."""',
    ].join("\n"),
    lang: "python",
    fontSize: 10.6,
  });

  rect(slide, 7.32, 2.5, 5.29, 1.3, C.softBlue);
  rect(slide, 7.32, 2.5, 0.07, 1.3, onPaper(C.navy));
  addText(
    slide,
    "Es una declaración correcta: su base de prueba es el propio programa que está probando.",
    {
      x: 7.66,
      y: 2.68,
      w: 4.66,
      h: 0.94,
      fontSize: 12.6,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.16,
    }
  );

  addText(slide, "Y aun habiéndolo declarado, escribió esto:", {
    x: M,
    y: 3.94,
    w: 6.5,
    h: 0.26,
    fontSize: 13,
    bold: true,
    color: C.ink,
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 4.26,
    w: 6.5,
    h: 1.34,
    title: "el RUT completo pasa a ser comportamiento esperado",
    code: [
      'assert resumen("Ana Perez", "12.345.678-9", [4.0, 5.0], 90) == \\',
      '    "Ana Perez (12.345.678-9): 4.5 - aprobado"',
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  addTerminalPanel(slide, SH, {
    x: 7.32,
    y: 4.26,
    w: 5.29,
    h: 1.5,
    title: "PowerShell · resultado de la suite",
    fontSize: 10.6,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "........................................" },
      { text: "42 passed in 0.11s" },
    ],
  });

  rect(slide, M, 5.88, CW, 0.5, C.warm);
  addText(
    slide,
    "Cuarenta y dos pruebas, ninguna falla. Y hay una razón estructural para que sea así.",
    {
      x: M + 0.34,
      y: 5.98,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 13.2,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Si la base de prueba es el código, la suite no puede estar en desacuerdo con el código: está copiando sus respuestas.",
    { y: 6.46, h: 0.54, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ============ 19 PROTOCOLO B: LA ÚNICA QUE PUDO PONERSE EN ROJO
function slideProtocoloB() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · resultado B",
    "Con el documento apareció un rojo, y estaba equivocado",
    "",
    false,
    { titleW: 10.3 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.24,
    w: 6.5,
    h: 1.5,
    title: "PowerShell · resultado de la suite",
    fontSize: 10.4,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "FAILED test_curso.py::test_tabla_de_decision", kind: "muted" },
      { text: "1 failed, 42 passed in 0.19s" },
    ],
  });

  addCodePanel(slide, SH, {
    x: 7.32,
    y: 2.24,
    w: 5.29,
    h: 1.2,
    title: "el caso que dio rojo",
    code: '([4.0, 3.9], 70, "reprobado")',
    lang: "python",
    fontSize: 11.4,
  });

  addText(slide, "Pero el código tiene razón y la prueba está mal. Esta es la cuenta:", {
    x: M,
    y: 3.88,
    w: 11.6,
    h: 0.26,
    fontSize: 13.6,
    bold: true,
    color: C.ink,
  });

  const pasos = [
    ["Promedio de 4,0 y 3,9", "3,95", C.slate],
    ["El requisito dice que 3,95 se informa", "4,0", DOC_ON_PAPER],
    ["Entonces la nota final alcanza el umbral", "aprobado", VERDE],
  ];
  pasos.forEach(([texto, valor, color], i) => {
    const x = M + i * 4.06;
    rect(slide, x, 4.22, 3.78, 0.84, C.white);
    rect(slide, x, 4.22, 3.78, 0.05, color);
    addText(slide, texto, {
      x: x + 0.24,
      y: 4.34,
      w: 3.3,
      h: 0.3,
      fontSize: 11.4,
      color: C.slate,
    });
    addText(slide, valor, {
      x: x + 0.24,
      y: 4.64,
      w: 3.3,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color,
    });
    if (i < 2) arrow(slide, x + 3.8, 4.64, 0.22, C.slate, 1, 1.4);
  });

  rect(slide, M, 5.2, CW, 0.56, C.softNeutral);
  addText(
    slide,
    "El agente leyó las dos reglas —el umbral y el redondeo— y no las compuso: aplicó el umbral antes de redondear.",
    {
      x: M + 0.34,
      y: 5.3,
      w: CW - 0.68,
      h: 0.34,
      fontSize: 12.8,
      color: C.ink,
      align: "center",
    }
  );

  rect(slide, M, 5.86, CW, 0.5, C.warm);
  rect(slide, M, 5.86, 0.07, 0.5, onPaper(C.red));
  addText(
    slide,
    "Cuidado con la lectura fácil: esto no dice que B sea peor. B fue el único capaz de producir un rojo.",
    {
      x: M + 0.34,
      y: 5.95,
      w: CW - 0.7,
      h: 0.32,
      fontSize: 13.2,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(
    slide,
    "Poder equivocarse es el precio de poder tener razón. A no se equivocó nunca, y esa es su falla: no tenía cómo disentir.",
    { y: 6.42, h: 0.54, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ================= 20 LA PRUEBA DECISIVA
function slideDecisiva() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la prueba decisiva",
    "Qué le pasa a la suite verde cuando corriges el defecto",
    "Ninguno de los dos protocolos marcó el RUT: los dos lo afirmaron como salida correcta. Ahora se aplica la corrección que corresponde.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.66,
    w: 6.1,
    h: 1.2,
    title: "la corrección: informar solo el dígito verificador",
    code: 'return f"...-{rut.rsplit(\'-\', 1)[-1]}"',
    lang: "python",
    fontSize: 11.2,
  });

  addTerminalPanel(slide, SH, {
    x: 6.94,
    y: 2.66,
    w: 5.67,
    h: 1.5,
    title: "PowerShell · la suite del protocolo A, otra vez",
    fontSize: 10.6,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "FAILED  TestResumen  ·  y 9 mas", kind: "muted" },
      { text: "10 failed, 32 passed in 0.27s" },
    ],
  });

  const antes = ["42", "en verde", VERDE, C.successSoft];
  const despues = ["10", "en rojo", onPaper(C.red), C.paleRed];
  [antes, despues].forEach(([cifra, texto, color, fondo], i) => {
    const x = M + i * 3.18;
    rect(slide, x, 4.3, 2.7, 1.02, fondo);
    addText(slide, cifra, {
      x: x + 0.24,
      y: 4.38,
      w: 2.4,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 36,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.24,
      y: 4.96,
      w: 2.4,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color,
    });
  });
  addText(slide, "→", {
    x: 3.5,
    y: 4.66,
    w: 0.3,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: C.slate,
    align: "center",
  });

  rect(slide, 7.06, 4.3, 5.55, 1.02, C.navy);
  addText(slide, "PONTE EN EL LUGAR DE QUIEN LLEGA MAÑANA", {
    x: 7.4,
    y: 4.44,
    w: 4.9,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(
    slide,
    "Hace ese cambio, ve diez pruebas caerse y saca la conclusión razonable: que el cambio está mal. Y revierte.",
    {
      x: 7.4,
      y: 4.7,
      w: 4.88,
      h: 0.54,
      fontSize: 12.2,
      color: C.white,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Una suite cuya base de prueba es el código no protege al producto. Protege al defecto.",
    { y: 5.5, h: 0.64, fill: onPaper(C.red), fontSize: 15 }
  );

  addFuente(
    slide,
    M,
    6.32,
    "Ejecuciones registradas para esta clase sobre Python 3.12.12: las dos suites generadas y la suite A tras la corrección.",
    { w: 9.6 }
  );

  validateSlide(slide, pptx);
}

// ================= 21 LAS SIETE FUENTES DE AUTORIDAD
// Taxonomia: cada fuente con un veredicto de color. La forma es un juicio,
// no una tabla neutra.
function slideFuentesAutoridad() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la clasificación",
    "Siete lugares de donde puede salir un veredicto",
    "Dos archivos de pruebas pueden verse idénticos y descansar sobre suelo distinto. Una revisión de 2026 sobre oráculos escritos por modelos de lenguaje los ordena así.",
    false,
    { titleW: 10.3 }
  );

  const fuentes = [
    ["Derivada de la implementación", "el comportamiento actual del código", "Lo consagra", onPaper(C.red)],
    ["Derivada de la especificación", "una regla escrita", "Lo detecta", VERDE],
    ["Diferencial contra referencia", "una segunda implementación", "Depende", onPaper(C.gold)],
    ["Regresión desde la versión previa", "la salida de la versión anterior", "Lo consagra", onPaper(C.red)],
    ["Obtenida de una persona", "la respuesta que dio alguien", "Depende", onPaper(C.gold)],
    ["Paramétrica del modelo", "lo que el modelo aprendió entrenando", "Depende", onPaper(C.gold)],
    ["Intrínseca implícita", "que no lance excepción, que el tipo calce", "No lo ve", C.slate],
  ];

  addKicker(slide, M, 2.72, "Fuente de autoridad", C.slate, 3.4);
  addKicker(slide, 5.0, 2.72, "Contra qué compara", C.slate, 3.4);
  addKicker(slide, 9.6, 2.72, "Si el código tiene el defecto", C.slate, 3.2);

  fuentes.forEach(([nombre, compara, veredicto, color], i) => {
    const y = 3.0 + i * 0.42;
    if (i % 2 === 0) rect(slide, M, y, CW, 0.38, C.white);
    rect(slide, M, y, 0.05, 0.38, color);
    addText(slide, nombre, {
      x: M + 0.22,
      y: y + 0.08,
      w: 4.0,
      h: 0.24,
      fontSize: 11.6,
      bold: i < 2,
      color: C.ink,
    });
    addText(slide, compara, {
      x: 5.0,
      y: y + 0.08,
      w: 4.4,
      h: 0.24,
      fontSize: 11.2,
      color: C.slate,
    });
    rect(slide, 9.6, y + 0.05, 1.5, 0.28, color);
    addText(slide, veredicto, {
      x: 9.6,
      y: y + 0.07,
      w: 1.5,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      align: "center",
    });
    if (i === 0)
      addText(slide, "← protocolo A", {
        x: 11.22,
        y: y + 0.08,
        w: 1.3,
        h: 0.24,
        fontSize: 10.4,
        bold: true,
        color: onPaper(C.red),
      });
    if (i === 1)
      addText(slide, "← protocolo B", {
        x: 11.22,
        y: y + 0.08,
        w: 1.3,
        h: 0.24,
        fontSize: 10.4,
        bold: true,
        color: VERDE,
      });
  });

  addFuente(
    slide,
    M,
    6.06,
    "Mughal y Bilal, «LLM-Based Test Oracles: Source-of-Authority Taxonomy», IEEE Access (2026). Poco más de la mitad de los sistemas revisados emite su veredicto sin especificación alguna.",
    { w: 11.4 }
  );

  addTakeaway(
    slide,
    "La pregunta que hay que hacerle a cualquier prueba: si alguien discute su veredicto, ¿a qué apuntas para defenderlo?",
    { y: 6.36, h: 0.56, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ================= 22 LOS DOCUMENTOS QUE DEFINE LA NORMA
function slideDocumentos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el inventario",
    "Dónde se escribe todo esto: la norma ya tiene la lista",
    "ISO/IEC/IEEE 29119 es la norma internacional de pruebas de software. Su parte 3 define qué documentos produce un proceso de pruebas, en tres niveles.",
    false,
    { titleW: 10.3 }
  );

  const niveles = [
    [
      onPaper(C.navy),
      "NIVEL ORGANIZACIONAL",
      "Lo que vale para toda la organización",
      ["Política de pruebas", "Prácticas organizacionales"],
    ],
    [
      DOC_ON_PAPER,
      "NIVEL DE GESTIÓN",
      "Lo que vale para este proyecto",
      ["Plan de pruebas", "Reporte de estado", "Reporte de término"],
    ],
    [
      onPaper(C.gold),
      "NIVEL DINÁMICO",
      "Lo que vale para cada prueba concreta",
      [
        "Especificación de casos",
        "Especificación de procedimiento",
        "Requisitos de datos",
        "Requisitos de ambiente",
        "Registro de ejecución",
        "Reporte de incidentes",
      ],
    ],
  ];

  let y = 2.6;
  niveles.forEach(([color, etiqueta, glosa, docs]) => {
    const filas = Math.ceil(docs.length / 3);
    const h = 0.52 + filas * 0.4;
    rect(slide, M, y, CW, h, C.white);
    rect(slide, M, y, 0.07, h, color);
    addText(slide, etiqueta, {
      x: M + 0.3,
      y: y + 0.14,
      w: 3.4,
      h: 0.22,
      fontSize: 9.8,
      bold: true,
      color,
      charSpacing: 1.2,
    });
    addText(slide, glosa, {
      x: M + 3.9,
      y: y + 0.13,
      w: 5.2,
      h: 0.24,
      fontSize: 11.6,
      italic: true,
      color: C.slate,
    });
    docs.forEach((doc, j) => {
      const col = j % 3;
      const fila = Math.floor(j / 3);
      rect(slide, M + 0.3 + col * 3.86, y + 0.46 + fila * 0.4, 3.66, 0.32, C.softNeutral);
      addText(slide, doc, {
        x: M + 0.44 + col * 3.86,
        y: y + 0.51 + fila * 0.4,
        w: 3.4,
        h: 0.24,
        fontSize: 11.4,
        color: C.ink,
      });
    });
    y += h + 0.16;
  });

  addTakeaway(
    slide,
    "Son once documentos. Antes de que parezca una montaña de papeleo, mira lo que dice la propia norma.",
    { y: 6.24, h: 0.6, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============ 23 LO QUE YA TIENES, CON OTRO NOMBRE
function slideYaLoTienes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el giro",
    "Casi todos esos documentos ya existen en tu proyecto",
    "Con otro nombre y en otro formato. La norma no exige carátulas: exige que la información exista y se pueda encontrar.",
    false,
    { titleW: 10.3 }
  );

  const pares = [
    ["Especificación de casos", "cada función test_ de tu suite"],
    ["Especificación de procedimiento", "el comando pytest y tu pyproject.toml"],
    ["Requisitos de ambiente", "tus dependencias y la versión de Python"],
    ["Registro de ejecución", "la salida de pytest y el historial de tu CI"],
    ["Reporte de incidentes", "tus issues, o tu registro de hallazgos"],
  ];

  pares.forEach(([norma, tuyo], i) => {
    const y = 2.6 + i * 0.46;
    addText(slide, norma, {
      x: M,
      y: y + 0.04,
      w: 3.9,
      h: 0.26,
      fontSize: 12.2,
      color: C.slate,
    });
    addText(slide, "=", {
      x: 4.74,
      y: y + 0.02,
      w: 0.3,
      h: 0.26,
      fontSize: 14,
      bold: true,
      color: C.slate,
      align: "center",
    });
    addText(slide, tuyo, {
      x: 5.2,
      y: y + 0.04,
      w: 4.4,
      h: 0.26,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
    });
    rule(slide, M, y + 0.38, 8.6, C.border, 0.7);
  });

  rect(slide, M, 4.94, 8.6, 0.5, C.paleRed);
  rect(slide, M, 4.94, 0.06, 0.5, onPaper(C.red));
  addText(slide, "Base de prueba", {
    x: M + 0.24,
    y: 5.02,
    w: 3.7,
    h: 0.26,
    fontSize: 12.2,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "aquí es donde probablemente tengas el hueco", {
    x: 5.2,
    y: 5.02,
    w: 4.4,
    h: 0.26,
    fontSize: 12.2,
    bold: true,
    color: onPaper(C.red),
  });

  rect(slide, 9.92, 2.6, 2.69, 2.84, C.warm);
  addKicker(slide, 10.18, 2.8, "La norma permite", onPaper(C.gold), 2.3);
  const permisos = [
    "Vale una planilla, un mapa mental o la foto de una pizarra.",
    "Puedes omitir partes si declaras cuáles y por qué: la norma lo llama conformidad adaptada.",
  ];
  permisos.forEach((texto, i) => {
    addText(slide, texto, {
      x: 10.18,
      y: 3.1 + i * 0.78,
      w: 2.2,
      h: 0.74,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });
  addText(slide, "Omitir con criterio declarado es conformidad.\nOmitir en silencio, no.", {
    x: 10.18,
    y: 4.82,
    w: 2.2,
    h: 0.48,
    fontSize: 10.8,
    bold: true,
    italic: true,
    color: onPaper(C.gold),
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(
    slide,
    "La suite existe, el procedimiento existe, el registro existe. Lo que suele faltar es aquello contra lo cual todo eso compara.",
    { y: 5.66, h: 0.62, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ================================ 24 PREGUNTAS GUÍA DEL BLOQUE 2
function slidePreguntasB2() {
  slidePreguntas(2, "Preguntas para llevarse del Bloque 2", [
    [
      "El protocolo A no falló ninguna prueba y el B falló una. ¿Cuál de las dos suites preferirías tener en tu proyecto, y qué te dice tu respuesta sobre lo que significa una suite completamente verde?",
      "Piensa qué tendría que pasar para que la suite de A se pusiera en rojo alguna vez.",
    ],
    [
      "El agente del protocolo A avisó por escrito que sus pruebas fijaban el comportamiento del código y no la regla. Si igual escribió la aserción que consagra la fuga, ¿para qué sirve ese aviso?",
      "No preguntes qué evita el aviso, sino qué te permite hacer a ti que no podrías sin él.",
    ],
    [
      "Diez pruebas se pusieron en rojo al ocultar el RUT. Frente a una suite en rojo, ¿cómo distingues si lo que está mal es tu cambio o son las pruebas?",
      "La respuesta no está en el código ni en las pruebas. Está en un tercer lugar.",
    ],
  ]);
}

// ================================================== 25 DIVISOR BLOQUE 3
function slideDivisorB3() {
  slideDivisor(
    3,
    "Del nombre\nde la calidad\nal umbral",
    "Si una prueba necesita algo contra qué comparar, ¿cómo se escribe eso cuando lo que se quiere es que el producto «sea seguro»?",
    [
      "Las tres piezas que convierten una aspiración en un criterio",
      "Un criterio propio, escrito, y la prueba que hace posible",
      "Cómo distinguir un umbral decidido de uno inventado",
    ]
  );
}

// ================= 26 UNA CARACTERÍSTICA NO ES UN REQUISITO
// La forma muestra la ausencia: la frase arriba, y debajo las tres casillas
// que no se pueden llenar.
function slideNoEsRequisito() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el problema",
    "«El sistema debe ser seguro» no se puede probar",
    "ISO/IEC 25010 es el modelo internacional de calidad de producto: nombra nueve características —seguridad, fiabilidad, mantenibilidad, y seis más— que sirven para no olvidar dimensiones. Toma una y escribe la frase que se escribe siempre.",
    false,
    { titleW: 10.3, subtitleH: 0.62 }
  );

  rect(slide, M, 2.78, CW, 0.72, C.sand);
  addText(slide, "El sistema debe ser seguro.", {
    x: M,
    y: 2.9,
    w: CW,
    h: 0.48,
    fontFace: TYPOGRAPHY.display,
    fontSize: 26,
    bold: true,
    color: C.navy,
    align: "center",
  });

  addText(slide, "Ahora intenta probarla. Las tres primeras partes de una prueba quedan vacías:", {
    x: M,
    y: 3.68,
    w: CW,
    h: 0.28,
    fontSize: 13.4,
    color: C.slate,
    align: "center",
  });

  const vacios = [
    ["¿Cuál es la entrada?", "no hay"],
    ["¿Cuál es la salida esperada?", "no hay"],
    ["¿Qué la pondría en rojo?", "nada"],
  ];
  vacios.forEach(([pregunta, respuesta], i) => {
    const x = M + i * 4.06;
    rect(slide, x, 4.06, 3.78, 1.0, C.white);
    frame(slide, x, 4.06, 3.78, 1.0, C.border, 1);
    addText(slide, pregunta, {
      x: x + 0.24,
      y: 4.22,
      w: 3.3,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    addText(slide, respuesta, {
      x: x + 0.24,
      y: 4.58,
      w: 3.3,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: onPaper(C.red),
    });
  });

  addText(
    slide,
    "No es una crítica al modelo. La norma dice para qué sirve, y son justo las dos tareas de este bloque:",
    {
      x: M,
      y: 5.26,
      w: CW,
      h: 0.28,
      fontSize: 13,
      color: C.slate,
      align: "center",
    }
  );

  addCita(
    slide,
    M,
    5.6,
    CW,
    0.56,
    "…validar que la definición de requisitos esté completa; identificar criterios de aceptación para un producto…",
    { accent: DOC_ON_PAPER, fontSize: 13.2 }
  );
  addFuente(
    slide,
    M,
    6.24,
    "ISO/IEC 25010:2023, cláusula 1 · traducción del original en inglés.",
    { w: 7, color: DOC_ON_PAPER }
  );

  addTakeaway(
    slide,
    "Una característica de calidad es el nombre de una propiedad deseable. Ningún nombre se puede ejecutar.",
    { y: 6.48, h: 0.52, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ================= 27 LAS TRES PIEZAS DE UN CRITERIO
// Una cadena de montaje: la aspiracion entra por la izquierda y sale
// convertida en algo que puede fallar.
function slideTresPiezas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el método",
    "Tres piezas convierten una aspiración en un criterio",
    "Si falta una sola, la frase no se puede probar.",
    false,
    { titleW: 10.3 }
  );

  const piezas = [
    [
      onPaper(C.navy),
      "1",
      "Una magnitud observable",
      "Algo que se pueda contar o detectar en la salida.",
      "no «la seguridad», sino «cuántos RUT completos aparecen en el listado»",
    ],
    [
      DOC_ON_PAPER,
      "2",
      "Un método de medición",
      "Cómo se obtiene ese número, de modo que dos personas obtengan el mismo.",
      "no «revisar que no se filtre», sino «buscar el patrón de RUT en la cadena»",
    ],
    [
      onPaper(C.red),
      "3",
      "Un umbral",
      "El valor que separa aceptable de inaceptable, con su dirección.",
      "no «pocos», sino «cero»",
    ],
  ];

  piezas.forEach(([color, num, titulo, glosa, ejemplo], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 2.58, 3.72, 2.5, C.white);
    rect(slide, x, 2.58, 3.72, 0.07, color);
    addCircleLabel(slide, x + 0.26, 2.8, 0.42, color, num, { fontSize: 14 });
    addText(slide, titulo, {
      x: x + 0.26,
      y: 3.36,
      w: 3.2,
      h: 0.56,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.06,
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: 3.96,
      w: 3.2,
      h: 0.56,
      fontSize: 11.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
    rect(slide, x + 0.26, 4.58, 3.2, 0.4, C.warm);
    addText(slide, ejemplo, {
      x: x + 0.4,
      y: 4.62,
      w: 2.94,
      h: 0.32,
      fontSize: 9.8,
      italic: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.06,
    });
    if (i < 2) arrow(slide, x + 3.74, 3.8, 0.24, C.slate, 1, 1.4);
  });

  rect(slide, M, 5.26, CW, 0.72, C.navy);
  addText(slide, "CON LAS TRES, LA FRASE YA PUEDE FALLAR:", {
    x: M + 0.34,
    y: 5.36,
    w: 4.4,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(slide, "resumen() no informa el RUT completo en ninguna salida.", {
    x: M + 0.34,
    y: 5.58,
    w: CW - 0.7,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.white,
  });

  addTakeaway(
    slide,
    "Un criterio es una frase que se puede transcribir a una aserción sin tomar ninguna decisión más.",
    { y: 6.18, h: 0.58, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ================= 28 LA TRADUCCIÓN, EJECUTADA
function slideTraduccionEjecutada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la traducción",
    "De la característica a la prueba, en una tabla",
    "",
    false,
    { titleW: 10.3 }
  );

  const filas = [
    ["Característica", "Seguridad", C.slate],
    ["Subcaracterística", "Confidencialidad", C.slate],
    ["Magnitud", "cuántos RUT completos devuelve resumen()", C.ink],
    ["Método", "buscar el patrón de RUT en la cadena devuelta", C.ink],
    ["Umbral", "cero", onPaper(C.red)],
    ["Criterio", "resumen() no informa el RUT completo", onPaper(C.red)],
  ];
  filas.forEach(([campo, valor, color], i) => {
    const y = 2.26 + i * 0.38;
    const ultima = i === 5;
    if (ultima) rect(slide, M, y, 6.3, 0.34, C.paleRed);
    addText(slide, campo, {
      x: M + 0.14,
      y: y + 0.07,
      w: 1.9,
      h: 0.24,
      fontSize: 11,
      bold: ultima,
      color: ultima ? onPaper(C.red) : C.slate,
    });
    addText(slide, valor, {
      x: M + 2.06,
      y: y + 0.07,
      w: 4.3,
      h: 0.24,
      fontSize: 11.6,
      bold: i >= 4,
      color,
    });
    if (!ultima) rule(slide, M, y + 0.34, 6.3, C.border, 0.7);
  });

  addCodePanel(slide, SH, {
    x: 7.32,
    y: 2.26,
    w: 5.29,
    h: 2.28,
    title: "la prueba que ese criterio hace posible",
    code: [
      "RUT = re.compile(",
      '    r"\\d{1,2}\\.\\d{3}\\.\\d{3}-[\\dkK]")',
      "",
      "def test_no_informa_el_rut_completo():",
      '    s = resumen("Ana", "12.345.678-9",',
      "                [4.0, 5.0], 90)",
      "    assert RUT.search(s) is None",
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  addText(slide, "Ejecutada antes de tocar el código, y después de corregirlo:", {
    x: M,
    y: 4.68,
    w: 11.6,
    h: 0.26,
    fontSize: 13.4,
    bold: true,
    color: C.ink,
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.02,
    w: 5.86,
    h: 1.3,
    title: "sobre el código tal como estaba",
    fontSize: 10,
    lines: [
      { text: "AssertionError: RUT completo en la salida", kind: "muted" },
      { text: "1 failed in 0.11s" },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.74,
    y: 5.02,
    w: 5.87,
    h: 1.3,
    title: "con el enmascaramiento aplicado",
    fontSize: 10,
    lines: [
      { text: "" },
      { text: "1 passed in 0.02s" },
    ],
  });

  addTakeaway(
    slide,
    "Ese dato personal sobrevivió a tres auditorías y a dos suites completas. Lo cerró escribir el criterio, no una herramienta mejor.",
    { y: 6.42, h: 0.54, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ================= 29 EL EXPERIMENTO: CAMBIÓ LA PREGUNTA
function slideCambioLaPregunta() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el experimento",
    "Al agente se le pidió esta misma traducción",
    "Sobre la carpeta con el código y el documento de requisitos: convertir la característica Seguridad en criterios de aceptación con umbral y método.",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.66, CW, 0.86, C.paleRed);
  rect(slide, M, 2.66, 0.07, 0.86, onPaper(C.red));
  addKicker(slide, M + 0.34, 2.82, "Su primer criterio, arriba de la tabla", onPaper(C.red), 5);
  addText(
    slide,
    "S1 · Confidencialidad · resumen() no expone el RUT completo · Umbral: 0 RUT completos",
    {
      x: M + 0.34,
      y: 3.08,
      w: CW - 0.7,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    }
  );

  addText(
    slide,
    "El mismo dato que tres auditorías no vieron apareció de inmediato. No porque el agente fuera mejor:",
    {
      x: M,
      y: 3.68,
      w: 11.6,
      h: 0.28,
      fontSize: 13.2,
      color: C.slate,
    }
  );

  const contraste = [
    [
      C.slate,
      "LO QUE SE PREGUNTÓ ANTES",
      "«Compara este código contra lo que está escrito.»",
      "El RUT no estaba escrito en ninguna parte, así que la comparación no podía producirlo.",
    ],
    [
      DOC_ON_PAPER,
      "LO QUE SE PREGUNTÓ AHORA",
      "«Qué debería ser verdad de este producto en materia de seguridad.»",
      "Esta pregunta tiene una fuente de autoridad fuera del proyecto: el modelo de calidad.",
    ],
  ];
  contraste.forEach(([color, etiqueta, pregunta, glosa], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 4.06, 5.76, 1.5, i === 0 ? C.softNeutral : C.white);
    rect(slide, x, 4.06, 5.76, 0.06, color);
    addKicker(slide, x + 0.34, 4.24, etiqueta, color, 4.6);
    addText(slide, pregunta, {
      x: x + 0.34,
      y: 4.5,
      w: 5.08,
      h: 0.44,
      fontSize: 13,
      italic: true,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, glosa, {
      x: x + 0.34,
      y: 4.98,
      w: 5.08,
      h: 0.48,
      fontSize: 11.6,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  addText(
    slide,
    "El modelo trae la palabra «confidencialidad», que ningún documento del repositorio contenía.",
    {
      x: M,
      y: 5.7,
      w: CW,
      h: 0.28,
      fontSize: 13,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "El modelo de calidad funcionó como base de prueba: aportó el criterio que el proyecto no tenía escrito.",
    { y: 6.1, h: 0.6, fill: DOC_ON_PAPER, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ================= 30 Y TAMBIÉN INVENTÓ DOS
function slideInvento() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la otra mitad",
    "El mismo agente produjo dos criterios que nadie pidió",
    "Están bien formulados: tienen magnitud, método y umbral. Se ven idénticos al anterior.",
    false,
    { titleW: 10.3 }
  );

  const inventos = [
    [
      "S5 · Responsabilidad",
      "Cada cierre genera un registro con fecha, RUT enmascarado, nota, estado y usuario que lo ejecutó.",
      "Umbral: 100 % de las llamadas",
    ],
    [
      "S6 · No repudio",
      "El registro es de solo anexado y lleva un hash encadenado del registro anterior.",
      "Umbral: 0 registros modificables",
    ],
  ];
  inventos.forEach(([titulo, texto, umbral], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.66, 5.76, 1.66, C.white);
    rect(slide, x, 2.66, 5.76, 0.06, onPaper(C.gold));
    addText(slide, titulo, {
      x: x + 0.34,
      y: 2.86,
      w: 5.08,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 3.24,
      w: 5.08,
      h: 0.6,
      fontSize: 12.4,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, x + 0.34, 3.88, 5.08, 0.32, C.warm);
    addText(slide, umbral, {
      x: x + 0.48,
      y: 3.93,
      w: 4.8,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color: onPaper(C.gold),
    });
  });

  rect(slide, M, 4.5, CW, 1.1, C.navy);
  addText(slide, "UN REGISTRO CON HASH ENCADENADO ES UNA TÉCNICA REAL Y SERIA", {
    x: M + 0.34,
    y: 4.66,
    w: 6,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(
    slide,
    "Se usa donde alguien puede tener incentivo para alterar el historial. Para el cálculo de notas de una asignatura,\nes ingeniería que ninguna persona con autoridad sobre este producto decidió.",
    {
      x: M + 0.34,
      y: 4.92,
      w: CW - 0.7,
      h: 0.56,
      fontSize: 13.2,
      color: C.white,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, M, 5.74, CW, 0.5, C.softNeutral);
  addText(
    slide,
    "Es un oráculo paramétrico del modelo: su autoridad es lo que el modelo aprendió entrenando, no lo que alguien decidió aquí.",
    {
      x: M + 0.34,
      y: 5.84,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 12.8,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Un criterio bien redactado y un criterio que corresponde se ven exactamente igual. Hace falta una regla para separarlos.",
    { y: 6.36, h: 0.56, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ================= 31 LA REGLA DE ARBITRAJE
function slideQuienFijoElUmbral() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la regla",
    "Un criterio vale cuando puedes señalar quién fijó el umbral",
    "Y solo hay tres respuestas válidas.",
    false,
    { titleW: 10.3 }
  );

  const origenes = [
    [
      onPaper(C.red),
      "Una norma o una ley externa",
      "No es negociable ni es tuyo.",
      "cero RUT expuestos",
    ],
    [
      onPaper(C.navy),
      "Alguien con autoridad sobre el producto",
      "Lo decidió una persona, y quedó escrito.",
      "nota 4,0 · asistencia 70 %",
    ],
    [
      DOC_ON_PAPER,
      "La propia característica",
      "El umbral se sigue del significado.",
      "confidencialidad ⇒ no se expone",
    ],
  ];
  origenes.forEach(([color, titulo, glosa, ejemplo], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 2.66, 3.72, 1.42, C.white);
    rect(slide, x, 2.66, 3.72, 0.06, color);
    addCircleLabel(slide, x + 0.24, 2.84, 0.34, color, String(i + 1), {
      fontSize: 11.5,
    });
    addText(slide, titulo, {
      x: x + 0.68,
      y: 2.86,
      w: 2.8,
      h: 0.5,
      fontSize: 12.8,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.08,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 3.42,
      w: 3.2,
      h: 0.28,
      fontSize: 11.2,
      color: C.slate,
    });
    rect(slide, x + 0.24, 3.7, 3.2, 0.28, C.warm);
    addText(slide, ejemplo, {
      x: x + 0.36,
      y: 3.74,
      w: 2.96,
      h: 0.22,
      fontSize: 10.4,
      italic: true,
      color: color,
    });
  });

  addText(
    slide,
    "Si no cae en ninguna de las tres, no es un criterio: es una sugerencia bien redactada. Aplicada a la tabla del agente:",
    {
      x: M,
      y: 4.24,
      w: CW,
      h: 0.28,
      fontSize: 13,
      color: C.slate,
    }
  );

  const veredictos = [
    ["S1 · RUT no expuesto", "la ley de protección de datos", "Criterio", onPaper(C.red)],
    ["S2 · notas fuera de 1,0 a 7,0", "nadie todavía: el rango no está escrito", "Sugerencia", onPaper(C.gold)],
    ["S5 · registro de auditoría", "nadie", "Sugerencia", onPaper(C.gold)],
    ["S6 · cadena de hashes", "nadie", "Sugerencia", onPaper(C.gold)],
  ];
  addKicker(slide, M, 4.62, "Criterio", C.slate, 3);
  addKicker(slide, 4.6, 4.62, "¿Quién fijó el umbral?", C.slate, 3.6);
  addKicker(slide, 9.6, 4.62, "Veredicto", C.slate, 2);
  veredictos.forEach(([nombre, quien, veredicto, color], i) => {
    const y = 4.9 + i * 0.4;
    if (i % 2 === 0) rect(slide, M, y, CW, 0.36, C.white);
    addText(slide, nombre, {
      x: M + 0.16,
      y: y + 0.07,
      w: 3.6,
      h: 0.24,
      fontSize: 11.4,
      bold: i === 0,
      color: C.ink,
    });
    addText(slide, quien, {
      x: 4.6,
      y: y + 0.07,
      w: 4.8,
      h: 0.24,
      fontSize: 11.2,
      color: C.slate,
    });
    rect(slide, 9.6, y + 0.04, 1.6, 0.28, color);
    addText(slide, veredicto, {
      x: 9.6,
      y: y + 0.06,
      w: 1.6,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      align: "center",
    });
  });

  addTakeaway(
    slide,
    "El agente no decide umbrales, porque no son datos técnicos sino decisiones de producto. Sirve para producir la lista de decisiones pendientes.",
    { y: 6.5, h: 0.46, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

// ================================ 32 PREGUNTAS GUÍA DEL BLOQUE 3
function slidePreguntasB3() {
  slidePreguntas(3, "Preguntas para llevarse del Bloque 3", [
    [
      "El dato personal expuesto sobrevivió a tres auditorías y a dos suites completas, y cayó apenas se escribió el criterio. ¿Qué tenía el criterio que no tenían las auditorías?",
      "Compara la frase «el sistema debe ser seguro» con la frase del criterio, pieza por pieza.",
    ],
    [
      "El agente encontró la fuga cuando se le preguntó por la característica de calidad, y no cuando se le pidió revisar o probar el código. ¿Qué dice eso sobre la relación entre la pregunta que haces y lo que un auditor automático puede encontrar?",
      "Fíjate de dónde sacaba su información cada una de las dos preguntas.",
    ],
    [
      "Los criterios S5 y S6 están perfectamente formulados y aun así se descartaron. ¿Podrías haber notado la diferencia mirando solo la tabla?",
      "La diferencia no está en cómo están escritos, sino en algo que no aparece en la tabla.",
    ],
  ]);
}

// ============================================ ARTÍCULO DE LEY
// El texto legal se presenta como texto legal: numeral destacado, filete y
// cuerpo citado. No se parece a ninguna otra caja del deck.
function addArticulo(slide, x, y, w, h, numeral, titulo, texto, opts = {}) {
  const acento = opts.accent || onPaper(C.red);
  rect(slide, x, y, w, h, C.white);
  rect(slide, x, y, 0.07, h, acento);
  addText(slide, numeral, {
    x: x + 0.3,
    y: y + 0.14,
    w: opts.numeralW || 2.3,
    h: 0.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.numeralSize || 15,
    bold: true,
    color: acento,
  });
  addText(slide, titulo, {
    x: x + 0.3,
    y: y + 0.44,
    w: w - 0.6,
    h: 0.26,
    fontSize: 12.4,
    bold: true,
    color: C.ink,
  });
  rule(slide, x + 0.3, y + 0.76, w - 0.6, C.border, 0.7);
  addText(slide, `“${texto}”`, {
    x: x + 0.3,
    y: y + 0.86,
    w: w - 0.6,
    h: h - 1.0,
    fontSize: opts.fontSize || 12,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.16,
  });
}

// ================================================== 33 DIVISOR BLOQUE 4
function slideDivisorB4() {
  slideDivisor(
    4,
    "La finalidad\nse escribe antes\nque el código",
    "El umbral de «cero datos personales expuestos» no lo fijó nadie de este curso. ¿Quién lo fijó, y cuándo exige que se decida?",
    [
      "Los dos principios legales que resuelven el caso",
      "El requisito que faltaba, escrito en cuatro líneas",
      "La comprobación de que ese documento cambia el resultado",
    ]
  );
}

// ================= 34 LO QUE DICE LA LEY
function slideLoQueDiceLaLey() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la fuente",
    "Dos principios de la ley deciden el caso",
    "La Ley 21.719 regula el tratamiento de datos personales en Chile y entra en vigencia el 1 de diciembre de 2026. Su definición de dato personal nombra el número de cédula de identidad: el RUT queda dentro por texto expreso.",
    false,
    { titleW: 10.3, subtitleH: 0.7 }
  );

  addArticulo(
    slide,
    M,
    2.78,
    5.76,
    1.82,
    "Artículo 3º, letra b)",
    "Principio de finalidad",
    "Los datos personales deben ser recolectados con fines específicos, explícitos y lícitos. El tratamiento debe limitarse al cumplimiento de estos fines.",
    { accent: onPaper(C.navy) }
  );

  addArticulo(
    slide,
    6.88,
    2.78,
    5.73,
    1.82,
    "Artículo 3º, letra c)",
    "Principio de proporcionalidad",
    "Los datos personales que se traten deben limitarse estrictamente a aquéllos que resulten necesarios, adecuados y pertinentes en relación con los fines del tratamiento.",
    { accent: onPaper(C.red) }
  );

  addText(
    slide,
    "La proporcionalidad no se evalúa sola: se juzga «en relación con los fines». Primero hay que declararlos.",
    {
      x: M,
      y: 4.72,
      w: CW,
      h: 0.26,
      fontSize: 12.6,
      color: C.slate,
    }
  );

  const preguntas = [
    [
      onPaper(C.navy),
      "1",
      "¿Cuál es la finalidad?",
      "Informar quién aprueba y quién reprueba la asignatura. Específica, explícita y lícita.",
    ],
    [
      onPaper(C.red),
      "2",
      "¿El RUT completo es necesario para eso?",
      "No. El listado identifica al estudiante por su nombre; el RUT no aporta al propósito declarado.",
    ],
  ];
  preguntas.forEach(([color, num, pregunta, respuesta], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 5.06, 5.76, 1.0, C.white);
    rect(slide, x, 5.06, 0.06, 1.0, color);
    addCircleLabel(slide, x + 0.26, 5.22, 0.36, color, num, { fontSize: 12 });
    addText(slide, pregunta, {
      x: x + 0.74,
      y: 5.22,
      w: 4.8,
      h: 0.28,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, respuesta, {
      x: x + 0.26,
      y: 5.58,
      w: 5.24,
      h: 0.4,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  addFuente(
    slide,
    M,
    6.2,
    "Ley 21.719 · Diario Oficial de la República de Chile, núm. 44.023, 13 de diciembre de 2024.",
    { w: 9 }
  );

  addTakeaway(
    slide,
    "Con esas dos respuestas el caso queda resuelto por la ley, y no por una opinión sobre cuánto importa la privacidad.",
    { y: 6.46, h: 0.52, fontSize: 12.8 }
  );

  validateSlide(slide, pptx);
}

// ================= 36 EL DEBER LLEGA ANTES QUE EL CÓDIGO
function slideAntesDelCodigo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · cuándo",
    "La ley exige decidirlo antes de que el sistema trate el dato",
    "",
    false,
    { titleW: 10.3 }
  );

  addArticulo(
    slide,
    M,
    2.24,
    6.7,
    2.5,
    "Artículo 14 quáter",
    "Deber de protección desde el diseño y por defecto",
    "…el responsable debe aplicar medidas técnicas y organizativas adecuadas desde el diseño con anterioridad y durante el tratamiento de los datos personales. […] deberá aplicar medidas […] para garantizar que, por defecto, sólo sean objeto de tratamiento los datos personales específicos y estrictamente necesarios para dicha actividad.",
    { accent: onPaper(C.red), fontSize: 11.4, numeralW: 3 }
  );

  const notas = [
    [
      onPaper(C.red),
      "«Con anterioridad y durante»",
      "No es revisar la privacidad al final. Es aplicar las medidas antes de que el tratamiento empiece.",
    ],
    [
      DOC_ON_PAPER,
      "«Estrictamente necesarios»",
      "Ese inciso es un criterio de aceptación redactado por el legislador: tiene magnitud, dirección y umbral.",
    ],
  ];
  notas.forEach(([color, titulo, texto], i) => {
    const y = 2.24 + i * 1.3;
    rect(slide, 9.12, y, 3.49, 1.2, C.white);
    rect(slide, 9.12, y, 3.49, 0.06, color);
    addText(slide, titulo, {
      x: 9.38,
      y: y + 0.18,
      w: 3.05,
      h: 0.28,
      fontSize: 12.2,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: 9.38,
      y: y + 0.5,
      w: 3.05,
      h: 0.62,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 4.92, CW, 0.66, C.paleRed);
  rect(slide, M, 4.92, 0.07, 0.66, onPaper(C.red));
  addText(slide, "Requisitos", {
    x: M + 0.34,
    y: 5.06,
    w: 1.7,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: onPaper(C.red),
  });
  vrule(slide, 2.5, 5.04, 0.42, C.border, 1);
  addText(
    slide,
    "la única etapa sin nada que ejecutar, donde la única prueba posible es que alguien lea un documento. La ley ubica su exigencia exactamente ahí.",
    {
      x: 2.82,
      y: 5.08,
      w: 9.5,
      h: 0.3,
      fontSize: 12.6,
      color: C.ink,
    }
  );

  rect(slide, M, 5.72, CW, 0.72, C.navy);
  addText(slide, "Y QUEDA RESPONDIDA LA PREGUNTA QUE ABRIÓ EL BLOQUE ANTERIOR", {
    x: M + 0.34,
    y: 5.84,
    w: 6.4,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(
    slide,
    "El umbral de cero RUT expuestos no lo fijó nadie de este curso: se sigue de la ley aplicada a una finalidad que sí se decidió aquí.",
    {
      x: M + 0.34,
      y: 6.08,
      w: CW - 0.7,
      h: 0.26,
      fontSize: 13,
      color: C.white,
    }
  );

  addFuente(
    slide,
    M,
    6.56,
    "Ley 21.719 · Diario Oficial núm. 44.023, 13 de diciembre de 2024.",
    { w: 7 }
  );

  validateSlide(slide, pptx);
}

// ================= 37 EL REQUISITO ESCRITO Y LA CADENA
function slideRequisitoEscrito() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el entregable",
    "Cuatro líneas que llevaban dos sesiones sin existir",
    "Empieza por la finalidad, porque sin ella la regla no se puede justificar ni evaluar.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 7.1,
    h: 2.24,
    title: "REQUISITOS.md · la sección que faltaba",
    code: [
      "## Datos personales en el listado",
      "",
      "Finalidad del listado de cierre: informar quien",
      "aprueba y quien reprueba la asignatura.",
      "",
      "El RUT identifica al estudiante y no es necesario",
      "para esa finalidad. El listado identifica por nombre",
      "e informa del RUT solo el digito verificador.",
    ].join("\n"),
    lang: "markdown",
    fontSize: 10,
  });

  addKicker(slide, 7.96, 2.6, "Qué aporta cada línea", C.slate, 4.4);
  const aportes = [
    [onPaper(C.navy), "Declara la finalidad", "sin ella no se puede aplicar la proporcionalidad"],
    [onPaper(C.red), "Hace el juicio de necesidad", "explícito, no implícito"],
    [DOC_ON_PAPER, "Fija el comportamiento", "observable en la salida"],
    [onPaper(C.gold), "Extiende el alcance", "a los registros de ejecución"],
  ];
  aportes.forEach(([color, titulo, glosa], i) => {
    const y = 2.9 + i * 0.5;
    rect(slide, 7.96, y, 0.05, 0.4, color);
    addText(slide, titulo, {
      x: 8.16,
      y,
      w: 4.4,
      h: 0.22,
      fontSize: 12,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: 8.16,
      y: y + 0.2,
      w: 4.4,
      h: 0.2,
      fontSize: 10.6,
      color: C.slate,
    });
  });

  addKicker(slide, M, 5.04, "El recorrido completo, de la ley a la evidencia", C.slate, 6);
  const cadena = [
    [onPaper(C.navy), "Principio", "Proporcionalidad"],
    [onPaper(C.red), "Requisito", "solo el dígito verificador"],
    [DOC_ON_PAPER, "Comportamiento", "resumen() no lo devuelve"],
    [onPaper(C.gold), "Prueba", "test_no_informa_el_rut"],
    [VERDE, "Evidencia", "la salida de la suite, fechada"],
  ];
  const cw2 = 2.24;
  cadena.forEach(([color, paso, contenido], i) => {
    const x = M + i * (cw2 + 0.19);
    rect(slide, x, 5.34, cw2, 0.78, C.white);
    rect(slide, x, 5.34, cw2, 0.06, color);
    addText(slide, paso.toUpperCase(), {
      x: x + 0.16,
      y: 5.46,
      w: cw2 - 0.32,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color,
      charSpacing: 1,
    });
    addText(slide, contenido, {
      x: x + 0.16,
      y: 5.68,
      w: cw2 - 0.32,
      h: 0.38,
      fontSize: 10.6,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    if (i < 4) arrow(slide, x + cw2 + 0.02, 5.72, 0.15, C.slate, 1, 1.2);
  });

  addTakeaway(
    slide,
    "El primer paso es el que hace que el umbral no sea tuyo. El último es el que te permite demostrarlo.",
    { y: 6.28, h: 0.56, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ================= 38 LA COMPROBACIÓN
function slideComprobacion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la comprobación",
    "La misma auditoría, sobre el mismo código sin corregir",
    "Cambió una sola cosa: ahora el documento de requisitos contiene esas cuatro líneas.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 5.6,
    h: 1.2,
    title: "PowerShell · el mismo comando de siempre",
    code: 'claude -p "Revisa src/curso.py contra REQUISITOS.md"',
    lang: "bash",
    fontSize: 10,
  });

  addTerminalPanel(slide, SH, {
    x: 6.44,
    y: 2.6,
    w: 6.17,
    h: 1.98,
    title: "lo primero que reportó, literal",
    fontSize: 10,
    lines: [
      { text: "## Diferencia con el requisito" },
      { text: "" },
      { text: "**resumen() expone el RUT completo**" },
      { text: "(src/curso.py:24)" },
    ],
  });

  rect(slide, M, 3.96, 5.6, 0.62, C.paleRed);
  addText(
    slide,
    "Apareció de inmediato y en primer lugar.",
    {
      x: M + 0.26,
      y: 4.1,
      w: 5.1,
      h: 0.34,
      fontSize: 13.6,
      bold: true,
      color: onPaper(C.red),
    }
  );

  const iguales = [
    ["La herramienta", "la misma"],
    ["El código", "el mismo, sin corregir"],
    ["La pregunta", "la misma"],
    ["El documento", "ahora existe"],
  ];
  iguales.forEach(([campo, valor], i) => {
    const x = M + i * 3.02;
    const ultimo = i === 3;
    rect(slide, x, 4.76, 2.86, 0.66, ultimo ? C.navy : C.softNeutral);
    addText(slide, campo.toUpperCase(), {
      x: x + 0.2,
      y: 4.86,
      w: 2.5,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: ultimo ? C.gold : C.slate,
      charSpacing: 1,
    });
    addText(slide, valor, {
      x: x + 0.2,
      y: 5.08,
      w: 2.5,
      h: 0.26,
      fontSize: 12.4,
      bold: true,
      color: ultimo ? C.white : C.ink,
    });
  });

  rect(slide, M, 5.58, CW, 0.62, C.softNeutral);
  addText(
    slide,
    "Y abrió dos preguntas que antes no podía formular: en qué formato llega el RUT, y qué hace quien llame a la función.",
    {
      x: M + 0.34,
      y: 5.7,
      w: CW - 0.68,
      h: 0.38,
      fontSize: 12.8,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Un requisito escrito no elimina la incertidumbre: la convierte en preguntas que se pueden responder.",
    { y: 6.36, h: 0.56, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ================================ 39 PREGUNTAS GUÍA DEL BLOQUE 4
function slidePreguntasB4() {
  slidePreguntas(4, "Preguntas para llevarse del Bloque 4", [
    [
      "El principio de proporcionalidad dice «necesarios en relación con los fines». ¿Por qué es imposible aplicarlo en un proyecto que no ha declarado sus finalidades?",
      "Intenta juzgar si un dato sobra, sin saber para qué existe el producto.",
    ],
    [
      "La ley exige medidas «con anterioridad y durante» el tratamiento. Si tu proyecto ya está escrito y funcionando, ¿qué significa cumplir esa exigencia hoy?",
      "Nadie puede volver atrás en el tiempo. Pregúntate qué queda por hacer que sí sea posible.",
    ],
    [
      "La misma auditoría, sobre el mismo código, encontró el defecto solo cuando existía el documento. ¿Cuánto puedes confiar en un informe de auditoría que no declara contra qué comparó?",
      "Piensa qué te falta saber para poder repetir esa auditoría y obtener el mismo resultado.",
    ],
  ]);
}

// ================= 40 CIERRE: LO QUE PUEDE AFIRMARSE
function slideAfirmacion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre de la sesión",
    "Qué puede afirmarse hoy, y qué sigue sin poder afirmarse",
    "",
    false,
    { titleW: 10.3 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.2,
    w: 5.86,
    h: 1.42,
    title: "lo que se podía afirmar al terminar la sesión anterior",
    fontSize: 10.2,
    lines: [
      { text: "El codigo fue comparado contra el" },
      { text: "requisito escrito, y las diferencias" },
      { text: "estan corregidas o registradas." },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.74,
    y: 2.2,
    w: 5.87,
    h: 1.42,
    title: "lo que puede afirmarse ahora",
    fontSize: 10.2,
    lines: [
      { text: "El requisito fue comparado contra un" },
      { text: "modelo de calidad y contra la ley, y lo" },
      { text: "que faltaba esta escrito y tiene prueba." },
    ],
  });

  rect(slide, M, 3.82, CW, 0.74, C.paleRed);
  rect(slide, M, 3.82, 0.07, 0.74, onPaper(C.red));
  addKicker(slide, M + 0.34, 3.96, "Y lo que sigue sin poder afirmarse", onPaper(C.red), 5);
  addText(slide, "El requisito está completo.", {
    x: M + 0.34,
    y: 4.2,
    w: CW - 0.7,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: onPaper(C.red),
  });

  addText(
    slide,
    "Esa frase no tiene prueba posible, y ahora se sabe por qué: un vacío en el requisito es invisible para todo lo que viene después, porque todo lo que viene después lo usa como referencia.",
    {
      x: M,
      y: 4.76,
      w: CW,
      h: 0.48,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  const fuentes = [
    [DOC_ON_PAPER, "El modelo de calidad", "aportó la palabra «confidencialidad»,\nque el repositorio no tenía"],
    [onPaper(C.red), "La ley", "aportó el umbral,\nque no era nuestro"],
    [C.slate, "Lo que falte", "cada fuente externa achica el hueco.\nNinguna lo cierra"],
  ];
  fuentes.forEach(([color, titulo, texto], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 5.36, 3.72, 0.86, C.white);
    rect(slide, x, 5.36, 3.72, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 5.5,
      w: 3.24,
      h: 0.24,
      fontSize: 12.6,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.24,
      y: 5.76,
      w: 3.24,
      h: 0.4,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "Lo único que se puede hacer con la primera fila del ciclo de vida es traerle referencias de afuera.",
    { y: 6.38, h: 0.54, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ================= 41 CIERRE FINAL
function slideCierreFinal() {
  const { slide } = createSlide("dark");

  addText(slide, "CIERRE DE LA SESIÓN", {
    x: M,
    y: 1.32,
    w: 5,
    h: 0.24,
    fontSize: 10.6,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(
    slide,
    "Ese dato estaba a la vista, en la línea más corta del archivo. Sobrevivió a tres auditorías con dos herramientas distintas y a dos suites de pruebas completas escritas sobre él.",
    {
      x: M,
      y: 1.72,
      w: 7.4,
      h: 1.1,
      fontSize: 17,
      color: C.white,
      lineSpacingMultiple: 1.22,
    }
  );

  rect(slide, M, 2.98, 2.2, 0.08, C.red);

  addText(
    slide,
    "Ninguna de esas barreras falló por incompetencia: todas hicieron correctamente lo único que podían hacer, que era comparar el código contra lo que estaba escrito.",
    {
      x: M,
      y: 3.28,
      w: 7.4,
      h: 0.86,
      fontSize: 15,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(
    slide,
    "Lo que finalmente lo encontró no fue una herramienta mejor ni un modelo más nuevo. Fueron cuatro líneas de texto que alguien tuvo que sentarse a escribir, decidiendo para qué existe cada dato.",
    {
      x: M,
      y: 4.3,
      w: 7.4,
      h: 1.04,
      fontSize: 15.5,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  rect(slide, M, 5.68, 7.4, 0.58, DOC_ON_PAPER);
  addText(
    slide,
    "Ese trabajo no lo acelera ningún agente: no consiste en escribir más rápido, sino en saber qué se quiere.",
    {
      x: M + 0.3,
      y: 5.76,
      w: 6.9,
      h: 0.42,
      fontSize: 13.6,
      bold: true,
      color: C.white,
      valign: "mid",
    }
  );

  vrule(slide, 8.5, 1.4, 4.8, NAVY_RULE, 1);

  addKicker(slide, 8.9, 1.4, "Ticket de salida", C.gold, 3.6);
  addText(slide, "Una línea para cada una, antes de salir.", {
    x: 8.9,
    y: 1.68,
    w: 3.7,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.softBlue,
  });

  const ticket = [
    "¿Contra qué compara la prueba más importante de tu proyecto, y quién escribió eso?",
    "¿Qué criterio escribiste hoy, y quién fijó su umbral?",
    "¿Qué dato personal trata tu proyecto sin que exista una finalidad escrita que lo justifique?",
  ];
  ticket.forEach((texto, i) => {
    const y = 2.14 + i * 1.16;
    rect(slide, 8.9, y, 3.71, 1.0, NAVY_CHIP);
    addCircleLabel(slide, 9.14, y + 0.18, 0.34, C.gold, String(i + 1), {
      fontSize: 11,
      color: C.navy,
    });
    addText(slide, texto, {
      x: 9.58,
      y: y + 0.16,
      w: 2.86,
      h: 0.72,
      fontSize: 11.4,
      color: C.white,
      lineSpacingMultiple: 1.14,
    });
  });

  addText(
    slide,
    "Próxima sesión: cómo se conduce una auditoría de verificación y validación de principio a fin, qué se mira en cada paso y qué evidencia tiene que quedar registrada.",
    {
      x: 8.9,
      y: 5.66,
      w: 3.71,
      h: 0.72,
      fontSize: 10.6,
      italic: true,
      color: C.softBlue,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

// ==================================================================== BUILD
slidePortada();
slideDeDondeVenimos();
slideMapa();
slideDivisorB1();
slideLoQueExiste();
slideEtapas();
slideConsecuencia();
slideLaCifra();
slideElResto();
slideDosEvidencias();
slideCodigoBarato();
slideDiscusion();
slideAgentsMd();
slidePreguntasB1();
slideDivisorB2();
slideBaseDePrueba();
slideMontaje();
slideProtocoloA();
slideProtocoloB();
slideDecisiva();
slideFuentesAutoridad();
slideDocumentos();
slideYaLoTienes();
slidePreguntasB2();
slideDivisorB3();
slideNoEsRequisito();
slideTresPiezas();
slideTraduccionEjecutada();
slideCambioLaPregunta();
slideInvento();
slideQuienFijoElUmbral();
slidePreguntasB3();
slideDivisorB4();
slideLoQueDiceLaLey();
slideAntesDelCodigo();
slideRequisitoEscrito();
slideComprobacion();
slidePreguntasB4();
slideAfirmacion();
slideCierreFinal();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK  ${pptx._slides.length} laminas  ->  ${outputPptx}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
