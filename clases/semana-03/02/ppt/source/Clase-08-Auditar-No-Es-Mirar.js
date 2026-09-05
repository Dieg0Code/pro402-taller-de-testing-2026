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
  subject: "PRO402 · Clase 08",
  title: "Auditar no es mirar",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(
  __dirname,
  "..",
  "Clase-08-Auditar-No-Es-Mirar.pptx"
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
//   navy  = la norma y el procedimiento
//   gold  = la auditoria, la conformidad, el registro
//   red   = los hallazgos y el caso de fracaso
//   verde = lo que pasa
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

function addCircleLabel(slide, x, y, size, fill, label, opts = {}) {
  slide.addShape(SH.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: { color: fill, pt: 0 },
  });
  addText(slide, String(label), {
    x,
    y,
    w: size,
    h: size,
    fontSize: opts.fontSize || 11,
    bold: true,
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
    w: opts.titleW || 10.3,
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
    color: C.slate,
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

// Divisor de bloque. El numeral manda, y la pregunta abre.
function slideDivisor(numero, titulo, pregunta) {
  const { slide } = createSlide("dark");

  addText(slide, String(numero), {
    x: M,
    y: 1.9,
    w: 2.3,
    h: 2.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 150,
    bold: true,
    color: NAVY_RULE,
    align: "left",
  });

  addKicker(slide, M + 2.5, 2.0, `Bloque ${numero}`, C.gold, 3);

  addText(slide, titulo, {
    x: M + 2.5,
    y: 2.32,
    w: 9.2,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.06,
  });

  rect(slide, M + 2.5, 3.78, 2.0, 0.07, C.red);

  addText(slide, pregunta, {
    x: M + 2.5,
    y: 4.08,
    w: 9.0,
    h: 1.0,
    fontSize: 19,
    color: C.softBlue,
    lineSpacingMultiple: 1.2,
  });

  validateSlide(slide, pptx);
}

// Preguntas guía: tres, cada una con su pista.
function slidePreguntas(bloque, titulo, preguntas) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${bloque} · cierre`, titulo, "", false, {
    titleW: 10.3,
  });

  const COLORES = [ROJO, AZUL, ORO];
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
function slidePortada() {
  const { slide } = createSlide("dark");

  addText(slide, "PRO402 · CLASE 08 · UNIDAD 01", {
    x: M,
    y: 1.44,
    w: 8.4,
    h: 0.26,
    fontSize: 11.6,
    bold: true,
    color: C.gold,
    charSpacing: 2.1,
  });

  addText(slide, "Auditar no es mirar", {
    x: M,
    y: 1.92,
    w: 11.4,
    h: 1.2,
    fontFace: TYPOGRAPHY.display,
    fontSize: 62,
    bold: true,
    color: C.white,
  });

  rect(slide, M, 3.3, 2.6, 0.09, C.red);

  addText(
    slide,
    "Alcance, orden y el registro que hace verificable un hallazgo",
    {
      x: M,
      y: 3.62,
      w: 10.2,
      h: 0.46,
      fontSize: 20,
      color: C.softBlue,
    }
  );

  addText(slide, "Taller integrador · cierre de la Unidad 01", {
    x: M,
    y: 4.16,
    w: 10.2,
    h: 0.3,
    fontSize: 14,
    italic: true,
    color: C.gold,
  });

  rule(slide, M, 5.06, CW, NAVY_RULE, 1);

  const meta = [
    ["FECHA", "Martes 8 de septiembre de 2026"],
    ["HORARIO", "08:30 – 10:50 · 140 minutos"],
    ["DOCENTE", "Diego Obando"],
  ];
  meta.forEach(([label, value], i) => {
    const x = M + i * 3.9;
    addText(slide, label, {
      x,
      y: 5.28,
      w: 3.4,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: C.terminalMuted,
      charSpacing: 1.5,
    });
    addText(slide, value, {
      x,
      y: 5.54,
      w: 3.6,
      h: 0.34,
      fontSize: 14.5,
      bold: true,
      color: C.white,
    });
    if (i < 2) vrule(slide, x + 3.62, 5.24, 0.66, NAVY_RULE, 1);
  });

  addText(
    slide,
    "Marco de referencia:  IEEE 1028-2008  ·  ISO/IEC/IEEE 29119-2 y 29119-3:2021",
    {
      x: M,
      y: 6.34,
      w: 11.4,
      h: 0.26,
      fontSize: 12,
      color: C.gold,
    }
  );

  validateSlide(slide, pptx);
}

// ======================================= 02 DE DÓNDE VENIMOS
// Tres barreras construidas, y tres preguntas que ninguna responde.
function slideTresBarreras() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "El módulo ya construyó tres formas de encontrar un problema",
    "Las tres funcionan. El problema es otro.",
    false,
    { titleW: 10.3 }
  );

  const barreras = [
    [
      AZUL,
      "Las herramientas",
      "El tipado compara contra los tipos declarados; el linter, contra un catálogo de patrones.",
      "Baratas, objetivas, no se cansan",
    ],
    [
      ORO,
      "La lectura",
      "Alguien compara lo que el código hace con lo que un documento dice que debe hacer.",
      "Ve lo que una herramienta no formula",
    ],
    [
      ROJO,
      "El criterio con umbral",
      "Una característica de calidad convertida en una frase con magnitud, método y umbral.",
      "Ya se puede escribir como prueba",
    ],
  ];
  barreras.forEach(([color, titulo, texto, remate], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 2.5, 3.72, 1.94, C.white);
    rect(slide, x, 2.5, 3.72, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 2.72,
      w: 3.2,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.26,
      y: 3.12,
      w: 3.2,
      h: 0.72,
      fontSize: 11.8,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, x + 0.26, 3.94, 3.2, 0.34, C.warm);
    addText(slide, remate, {
      x: x + 0.38,
      y: 3.99,
      w: 2.98,
      h: 0.26,
      fontSize: 10.4,
      bold: true,
      color,
    });
  });

  addText(slide, "Están sueltas. Nada responde estas tres preguntas:", {
    x: M,
    y: 4.66,
    w: CW,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: C.ink,
  });

  const huecos = ["¿En qué orden se aplican?", "¿Hasta dónde hay que llegar?", "¿Qué queda escrito?"];
  huecos.forEach((texto, i) => {
    const x = M + i * 4.02;
    rect(slide, x, 5.02, 3.72, 0.62, C.softNeutral);
    frame(slide, x, 5.02, 3.72, 0.62, C.border, 1);
    addText(slide, texto, {
      x: x + 0.2,
      y: 5.18,
      w: 3.32,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.slate,
      align: "center",
    });
  });

  addTakeaway(
    slide,
    "Sin esas tres respuestas, dos personas revisando el mismo código entregan resultados que no se pueden comparar.",
    { y: 5.88, h: 0.6, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================================================ 03 MAPA
function slideMapa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Mapa de la sesión",
    "Cuatro bloques, cuatro preguntas",
    "El taller trabaja sobre un proyecto entregado, ya ejecutado. Nadie queda detenido por el estado de su propio repositorio.",
    false,
    { titleW: 10.3 }
  );

  const bloques = [
    [AZUL, "1", "Qué es una auditoría", "08:40 · 25 min", "¿Qué la separa de una revisión, y qué le exige eso a su producto?"],
    [ROJO, "2", "El mito de los muchos ojos", "09:05 · 30 min", "Si bastara con que muchos miren, ¿qué pasó cuando mirar dejó de costar?"],
    [ORO, "3", "El procedimiento", "09:45 · 30 min", "¿En qué orden se aplican las barreras, y cuándo se para?"],
    [VERDE, "4", "El registro", "10:15 · 25 min", "¿Qué tiene que quedar escrito para que otro pueda verificarlo?"],
  ];

  const bw = 2.76;
  bloques.forEach(([color, num, titulo, horario, pregunta], i) => {
    const x = M + i * (bw + 0.28);
    rect(slide, x, 2.66, bw, 2.94, C.white);
    rect(slide, x, 2.66, bw, 0.08, color);
    addCircleLabel(slide, x + 0.24, 2.9, 0.44, color, num, { fontSize: 15 });
    addText(slide, titulo, {
      x: x + 0.24,
      y: 3.48,
      w: bw - 0.48,
      h: 0.56,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.06,
    });
    addText(slide, horario, {
      x: x + 0.24,
      y: 4.1,
      w: bw - 0.48,
      h: 0.22,
      fontSize: 10.4,
      bold: true,
      color: C.slate,
      charSpacing: 0.8,
    });
    rule(slide, x + 0.24, 4.4, bw - 0.48, C.border, 0.7);
    addText(slide, pregunta, {
      x: x + 0.24,
      y: 4.54,
      w: bw - 0.48,
      h: 0.94,
      fontSize: 11.6,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
  });

  addText(slide, "Pausa 09:35 – 09:45", {
    x: M,
    y: 5.72,
    w: 4,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
  });

  addTakeaway(
    slide,
    "Sales con una auditoría hecha, sus hallazgos registrados y el informe que otro puede leer sin ti.",
    { y: 6.14, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

// ================================================== 04 DIVISOR BLOQUE 1
function slideDivisorB1() {
  slideDivisor(
    1,
    "Qué es una auditoría,\ny qué no",
    "Todo el mundo dice que audita su código. ¿Qué tendría que ser cierto para que esa palabra esté bien usada?"
  );
}

// ============================== 05 LA DEFINICIÓN
function slideDefinicion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la norma",
    "La palabra tiene una definición, y es exigente",
    "IEEE 1028-2008 es la norma internacional de revisiones y auditorías de software. Define cinco tipos de revisión; la auditoría es uno de ellos.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  rect(slide, M, 2.66, CW, 1.5, C.navy);
  addText(slide, "AUDITORÍA, SEGÚN LA NORMA", {
    x: M + 0.4,
    y: 2.86,
    w: 5,
    h: 0.2,
    fontSize: 9.2,
    bold: true,
    color: C.gold,
    charSpacing: 1.4,
  });
  addText(
    slide,
    "Un examen independiente de un producto o de un proceso de software, realizado por un tercero, para evaluar el cumplimiento respecto de especificaciones, estándares, acuerdos contractuales u otros criterios.",
    {
      x: M + 0.4,
      y: 3.16,
      w: CW - 0.8,
      h: 0.86,
      fontSize: 16,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  addFuente(
    slide,
    M,
    4.3,
    "IEEE Std 1028-2008 · traducción del original en inglés.",
    { w: 6 }
  );

  addText(
    slide,
    "Esa frase corta contiene tres exigencias. Ninguna es decorativa, y las tres cambian lo que hay que hacer:",
    {
      x: M,
      y: 4.74,
      w: CW,
      h: 0.28,
      fontSize: 14,
      color: C.ink,
    }
  );

  const palabras = ["independiente", "tercero", "cumplimiento"];
  palabras.forEach((palabra, i) => {
    const x = M + i * 4.02;
    rect(slide, x, 5.14, 3.72, 0.66, C.warm);
    rect(slide, x, 5.14, 0.06, 0.66, [AZUL, ORO, ROJO][i]);
    addText(slide, palabra, {
      x: x + 0.24,
      y: 5.29,
      w: 3.3,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: [AZUL, ORO, ROJO][i],
      align: "center",
    });
  });

  addTakeaway(
    slide,
    "Si falta cualquiera de las tres, lo que se está haciendo tiene otro nombre. Puede ser útil igual, pero no es una auditoría.",
    { y: 6.06, h: 0.6, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 06 LAS TRES EXIGENCIAS
function slideTresExigencias() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · qué exige cada palabra",
    "Independiente · tercero · cumplimiento",
    "",
    false,
    { titleW: 10.3 }
  );

  const exigencias = [
    [
      AZUL,
      "1",
      "El auditor es independiente",
      "No es quien escribió el código, ni quien lo va a mantener, ni quien responde por el plazo de entrega.",
      "En los otros cuatro tipos de revisión la independencia es buena práctica. Aquí es parte de la definición.",
    ],
    [
      ORO,
      "2",
      "El criterio viene de afuera",
      "No se evalúa contra el buen gusto de quien audita, sino contra algo que ya estaba escrito antes de empezar.",
      "Una especificación, un estándar, un contrato, una ley. Ese documento es la referencia de toda la auditoría.",
    ],
    [
      ROJO,
      "3",
      "El producto es un veredicto",
      "No termina con recomendaciones. Termina diciendo si cumple o no cumple, con la evidencia que lo sostiene.",
      "Una revisión puede terminar sin hallazgos y haber servido. Una auditoría tiene que terminar con un juicio.",
    ],
  ];

  exigencias.forEach(([color, num, titulo, texto, remate], i) => {
    const y = 2.34 + i * 1.34;
    rect(slide, M, y, CW, 1.22, C.white);
    rect(slide, M, y, 0.07, 1.22, color);
    addCircleLabel(slide, M + 0.3, y + 0.18, 0.4, color, num, { fontSize: 13.5 });
    addText(slide, titulo, {
      x: M + 0.88,
      y: y + 0.16,
      w: 4.4,
      h: 0.3,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: M + 0.88,
      y: y + 0.54,
      w: 4.5,
      h: 0.62,
      fontSize: 11.8,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    vrule(slide, 6.5, y + 0.16, 0.9, C.border, 1);
    addText(slide, remate, {
      x: 6.86,
      y: y + 0.28,
      w: 5.5,
      h: 0.74,
      fontSize: 12.6,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.16,
    });
  });

  addTakeaway(
    slide,
    "La independencia es la única de las tres que no se puede fabricar con esfuerzo: o el auditor es otro, o no lo es.",
    { y: 6.46, h: 0.5, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

// ============================== 07 REVISIÓN vs AUDITORÍA
function slideRevisionVsAuditoria() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la distinción",
    "Buscan cosas distintas, y por eso terminan distinto",
    "",
    false,
    { titleW: 10.3 }
  );

  const columnas = [
    [
      AZUL,
      "REVISIÓN",
      "Mejorar el producto",
      [
        ["Quién", "cualquiera con competencia técnica"],
        ["Contra qué", "el criterio de quien revisa"],
        ["Termina con", "recomendaciones"],
        ["Sin hallazgos", "puede haber sido útil igual"],
      ],
    ],
    [
      ORO,
      "AUDITORÍA",
      "Establecer si cumple una referencia declarada",
      [
        ["Quién", "un tercero independiente"],
        ["Contra qué", "un documento escrito antes"],
        ["Termina con", "un veredicto y su evidencia"],
        ["Sin hallazgos", "igual tiene que dar veredicto"],
      ],
    ],
  ];

  columnas.forEach(([color, etiqueta, proposito, filas], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.34, 5.76, 3.5, C.white);
    rect(slide, x, 2.34, 5.76, 0.08, color);
    addKicker(slide, x + 0.34, 2.56, etiqueta, color, 3);
    addText(slide, proposito, {
      x: x + 0.34,
      y: 2.84,
      w: 5.08,
      h: 0.56,
      fontSize: 17,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.06,
    });
    rule(slide, x + 0.34, 3.5, 5.08, C.border, 0.8);
    filas.forEach(([campo, valor], j) => {
      const y = 3.62 + j * 0.54;
      addText(slide, campo, {
        x: x + 0.34,
        y,
        w: 1.5,
        h: 0.24,
        fontSize: 10.6,
        bold: true,
        color: C.slate,
        charSpacing: 0.6,
      });
      addText(slide, valor, {
        x: x + 1.9,
        y: y - 0.02,
        w: 3.5,
        h: 0.42,
        fontSize: 12.4,
        color: C.ink,
        lineSpacingMultiple: 1.1,
      });
    });
  });

  addTakeaway(
    slide,
    "Por eso una auditoría necesita alcance: sin saber hasta dónde llegó, su veredicto no significa nada.",
    { y: 6.1, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 08 EL CASO: EL MONTAJE
function slideCasoMontaje() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el caso",
    "Qué pasa cuando el auditor trabaja para el auditado",
    "La independencia suena a formalismo administrativo hasta que se mira qué ocurre cuando falta.",
    false,
    { titleW: 10.3 }
  );

  const pasos = [
    [
      "La regla",
      "Certificar un avión de línea en Estados Unidos es responsabilidad de la Administración Federal de Aviación.",
    ],
    [
      "La excepción",
      "Como la FAA no da abasto, delega parte de esa certificación en el propio fabricante. El programa se llama ODA.",
    ],
    [
      "La consecuencia",
      "Empleados de la empresa quedan autorizados para certificar en representación del regulador.",
    ],
  ];
  pasos.forEach(([titulo, texto], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 2.62, 3.72, 1.5, i === 2 ? C.paleRed : C.white);
    rect(slide, x, 2.62, 3.72, 0.06, i === 2 ? ROJO : AZUL);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 2.82,
      w: 3.2,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: i === 2 ? ROJO : AZUL,
    });
    addText(slide, texto, {
      x: x + 0.24,
      y: 3.18,
      w: 3.24,
      h: 0.86,
      fontSize: 11.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    if (i < 2) arrow(slide, x + 3.76, 3.32, 0.2, C.slate, 1.4);
  });

  rect(slide, M, 4.32, CW, 1.24, C.navy);
  addKicker(slide, M + 0.36, 4.5, "Lo que ocurrió", C.gold, 4);
  addText(
    slide,
    "El 737 MAX se certificó bajo ese esquema. Incluía un sistema de software, MCAS, que empuja automáticamente\nla nariz del avión hacia abajo bajo ciertas condiciones. Dos aviones con ese sistema se estrellaron: Lion Air 610\nen octubre de 2018 y Ethiopian Airlines 302 en marzo de 2019. Murieron 346 personas.",
    {
      x: M + 0.36,
      y: 4.78,
      w: CW - 0.72,
      h: 0.66,
      fontSize: 13,
      color: C.white,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "El Congreso de Estados Unidos investigó durante dieciocho meses. Su informe no habla de incompetencia.",
    { y: 5.74, h: 0.56, fill: ROJO, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ============================== 09 EL CASO: LAS CONCLUSIONES
function slideCasoConclusiones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el caso",
    "Dos de los cinco temas del informe son sobre independencia",
    "Comité de Transporte e Infraestructura de la Cámara de Representantes, 16 de septiembre de 2020. 238 páginas.",
    false,
    { titleW: 10.3 }
  );

  const temas = [
    ["Presiones de producción", false],
    ["Supuestos de diseño y desempeño erróneos", false],
    ["Cultura de ocultamiento", false],
    ["Representación en conflicto de interés", true],
    ["La influencia de Boeing sobre la supervisión de la FAA", true],
  ];
  addKicker(slide, M, 2.6, "Los cinco temas centrales del informe", C.slate, 5);
  temas.forEach(([texto, marcado], i) => {
    const y = 2.9 + i * 0.44;
    rect(slide, M, y, 5.5, 0.38, marcado ? C.paleRed : C.white);
    rect(slide, M, y, 0.05, 0.38, marcado ? ROJO : C.border);
    addText(slide, texto, {
      x: M + 0.24,
      y: y + 0.06,
      w: 5.1,
      h: 0.26,
      fontSize: 12.2,
      bold: marcado,
      color: marcado ? ROJO : C.ink,
    });
  });

  addCita(
    slide,
    6.54,
    2.86,
    6.07,
    1.24,
    "La actual estructura de supervisión de la FAA respecto de Boeing genera conflictos de interés inherentes que han puesto en riesgo la seguridad del público que vuela.",
    { accent: ROJO, fontSize: 12.6, fill: C.paleRed }
  );

  addCita(
    slide,
    6.54,
    4.24,
    6.07,
    1.0,
    "Empleados de Boeing autorizados para trabajar en representación de la FAA no alertaron a la FAA sobre posibles problemas de seguridad o de certificación.",
    { accent: AZUL, fontSize: 12 }
  );

  addFuente(
    slide,
    M,
    5.4,
    "Final Committee Report on the Boeing 737 MAX, 16 de septiembre de 2020 · traducción del original en inglés.",
    { w: 9.5, color: ROJO }
  );

  rect(slide, M, 5.74, CW, 0.5, C.softNeutral);
  addText(
    slide,
    "No dice que los ingenieros fueran incompetentes ni deshonestos. Dice algo estructural.",
    {
      x: M + 0.34,
      y: 5.84,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 13.2,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Cuando quien evalúa depende de quien es evaluado, el resultado de la evaluación deja de ser información.",
    { y: 6.38, h: 0.54, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ============================== 10 QUÉ LE EXIGE ESTO AL PRODUCTO
function slideProductoOponible() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la consecuencia",
    "El informe tiene que sostenerse sin quien lo escribió",
    "Si una auditoría existe para que otro se apoye en su resultado, alguien que nunca estuvo tiene que poder repetir cada comprobación y llegar a lo mismo.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  addKicker(slide, M, 2.72, "Lo que no sirve en un informe", ROJO, 5);
  const inutiles = [
    ["«El código está desordenado»", "No dice contra qué se comparó ni cómo verificarlo"],
    ["«Encontré varios problemas de seguridad»", "Sin la entrada concreta, nadie puede reproducirlos"],
    ["«Revisé el módulo de pagos»", "No declara hasta dónde llegó, así que no se sabe qué quedó fuera"],
  ];
  inutiles.forEach(([frase, porque], i) => {
    const y = 3.02 + i * 0.78;
    rect(slide, M, y, 6.1, 0.66, C.paleRed);
    addText(slide, frase, {
      x: M + 0.24,
      y: y + 0.08,
      w: 5.6,
      h: 0.26,
      fontSize: 12.8,
      bold: true,
      italic: true,
      color: ROJO,
    });
    addText(slide, porque, {
      x: M + 0.24,
      y: y + 0.36,
      w: 5.6,
      h: 0.24,
      fontSize: 10.8,
      color: C.slate,
    });
  });

  addKicker(slide, 7.32, 2.72, "Lo que sí exige", VERDE, 5);
  const exigencias = [
    ["Alcance declarado", "para que se sepa qué quedó fuera"],
    ["Criterio citado", "para que el veredicto sea contrastable"],
    ["Hallazgos reproducibles", "para que otro llegue al mismo resultado"],
  ];
  exigencias.forEach(([titulo, para], i) => {
    const y = 3.02 + i * 0.78;
    rect(slide, 7.32, y, 5.29, 0.66, C.white);
    rect(slide, 7.32, y, 0.05, 0.66, VERDE);
    addCircleLabel(slide, 7.5, y + 0.16, 0.34, VERDE, String(i + 1), {
      fontSize: 11,
    });
    addText(slide, titulo, {
      x: 7.96,
      y: y + 0.08,
      w: 4.4,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    addText(slide, para, {
      x: 7.96,
      y: y + 0.36,
      w: 4.4,
      h: 0.24,
      fontSize: 10.8,
      color: C.slate,
    });
  });

  rect(slide, M, 5.44, CW, 0.66, C.warm);
  rect(slide, M, 5.44, 0.07, 0.66, ORO);
  addText(
    slide,
    "Auditar tu propio código no te da la independencia. Las otras dos sí están a tu alcance, y la tercera se aproxima entregándole el código y el criterio a un lector que no participó en escribirlo.",
    {
      x: M + 0.36,
      y: 5.56,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Un informe que no declara su alcance es peor que uno incompleto: hace creer que se revisó todo.",
    { y: 6.28, h: 0.56, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ================================ 11 PREGUNTAS GUÍA DEL BLOQUE 1
function slidePreguntasB1() {
  slidePreguntas(1, "Preguntas para llevarse del Bloque 1", [
    [
      "La norma exige un auditor independiente y un criterio escrito antes de empezar. Si auditas tu propio código contra un requisito que también escribiste tú, ¿qué queda en pie de la definición?",
      "Cuenta cuántas de las tres exigencias puedes cumplir y cuál no.",
    ],
    [
      "Una revisión puede terminar sin hallazgos y haber sido útil. Una auditoría no puede terminar sin veredicto. ¿Qué hay que hacer, entonces, cuando no se encuentra nada?",
      "Piensa qué necesita saber quien recibe el informe para creerle a un «todo en orden».",
    ],
    [
      "El informe del 737 MAX no acusa a los ingenieros de incompetencia, sino a la estructura de supervisión. ¿Qué tendría que cambiar en esa estructura para que la certificación volviera a ser información confiable?",
      "Vuelve a la primera de las tres exigencias y pregúntate quién pagaba a quién.",
    ],
  ]);
}

// ================================================== 12 DIVISOR BLOQUE 2
function slideDivisorB2() {
  slideDivisor(
    2,
    "El mito de\nlos muchos ojos",
    "Si bastara con que mire suficiente gente, ¿qué pasó cuando mirar dejó de costar tiempo y dinero?"
  );
}

// ============================== 13 LA AFIRMACIÓN ORIGINAL
// Dos formulaciones del mismo punto. La forma muestra cuál sobrevivió.
function slideLaAfirmacion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la creencia",
    "Existe una respuesta muy conocida a todo esto",
    "Y dice que no hace falta tanto procedimiento: basta con que mire suficiente gente. Tiene autor y tiene fecha.",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.6, CW, 1.24, C.navy);
  addKicker(slide, M + 0.36, 2.78, "Como la escribió su autor", C.gold, 4.6);
  addText(
    slide,
    "Dada una base suficientemente grande de gente que prueba versiones preliminares y que además desarrolla, casi todo problema será caracterizado rápido y la corrección le resultará obvia a alguien.",
    {
      x: M + 0.36,
      y: 3.06,
      w: CW - 0.72,
      h: 0.66,
      fontSize: 15,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(slide, "…o, menos formalmente:", {
    x: M,
    y: 3.98,
    w: 4,
    h: 0.26,
    fontSize: 12.8,
    italic: true,
    color: C.slate,
  });

  rect(slide, M, 4.3, 8.1, 0.86, C.warm);
  rect(slide, M, 4.3, 0.07, 0.86, ORO);
  addText(slide, "«Con suficientes ojos, todos los errores son superficiales.»", {
    x: M + 0.36,
    y: 4.5,
    w: 7.5,
    h: 0.46,
    fontFace: TYPOGRAPHY.display,
    fontSize: 21,
    bold: true,
    color: C.ink,
  });

  rect(slide, 9.06, 4.3, 3.55, 0.86, C.paleRed);
  addText(slide, "Esta es la que\nsobrevivió", {
    x: 9.32,
    y: 4.46,
    w: 3.1,
    h: 0.56,
    fontSize: 13.4,
    bold: true,
    color: ROJO,
    valign: "mid",
    lineSpacingMultiple: 1.12,
  });

  addFuente(
    slide,
    M,
    5.3,
    "Eric S. Raymond, «The Cathedral and the Bazaar», 1999 · traducción del original en inglés.",
    { w: 8 }
  );

  rect(slide, M, 5.64, CW, 0.5, C.softNeutral);
  addText(
    slide,
    "Y es creíble: un defecto es difícil para quien no reconoce el patrón, y trivial para quien ya lo vio antes.",
    {
      x: M + 0.34,
      y: 5.74,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 13,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "El autor la bautizó «Ley de Linus», en honor a Linus Torvalds. Conviene ver qué opinó Torvalds.",
    { y: 6.28, h: 0.54, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ============================== 14 LA CORRECCIÓN DE TORVALDS
function slideCorreccionTorvalds() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · lo que casi nadie cita",
    "Dos líneas más abajo, en el mismo texto",
    "El autor transcribe la objeción que le hizo la persona a quien dedicó la ley.",
    false,
    { titleW: 10.3 }
  );

  addCita(
    slide,
    M,
    2.6,
    CW,
    1.18,
    "Mi formulación original era que todo problema «será transparente para alguien». Linus objetó que la persona que entiende y corrige el problema no es necesariamente, ni habitualmente, la que primero lo caracteriza.",
    { accent: AZUL, fontSize: 13.6, fill: C.white }
  );

  rect(slide, M, 3.94, CW, 1.32, C.navy);
  addKicker(slide, M + 0.36, 4.12, "Y entonces cita a Torvalds, textual", C.gold, 5);
  addText(
    slide,
    "«Alguien encuentra el problema, y otro lo entiende.",
    {
      x: M + 0.36,
      y: 4.4,
      w: CW - 0.72,
      h: 0.3,
      fontSize: 15,
      italic: true,
      color: C.softBlue,
    }
  );
  addText(
    slide,
    "Y voy a dejar constancia de que encontrarlo es el desafío mayor.»",
    {
      x: M + 0.36,
      y: 4.72,
      w: CW - 0.72,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
    }
  );

  addFuente(
    slide,
    M,
    5.4,
    "Eric S. Raymond, «The Cathedral and the Bazaar», 1999 · traducción del original en inglés.",
    { w: 8 }
  );

  rect(slide, M, 5.74, CW, 0.5, C.paleRed);
  addText(
    slide,
    "En la página donde nace la ley de los muchos ojos, su autor deja escrito que el cuello de botella está en la detección.",
    {
      x: M + 0.34,
      y: 5.84,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 13,
      bold: true,
      color: ROJO,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Igual que con la curva de costo del defecto: la fuente trae el matiz, y el eslogan lo descarta.",
    { y: 6.38, h: 0.54, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ============================== 15 LA SUSTITUCIÓN
// Una palabra cambiada. La forma es el reemplazo mismo.
function slideLaSustitucion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la palabra cambiada",
    "El eslogan no dice lo mismo que la ley",
    "Hay una segunda precisión, y está en la propia redacción formal.",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.66, 5.4, 1.7, C.white);
  rect(slide, M, 2.66, 5.4, 0.07, AZUL);
  addKicker(slide, M + 0.3, 2.88, "Lo que su autor escribió", AZUL, 4.4);
  addText(slide, "base de beta-testers\ny co-desarrolladores", {
    x: M + 0.3,
    y: 3.18,
    w: 4.8,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.08,
  });
  addText(slide, "gente que ejecuta el software y además puede modificarlo", {
    x: M + 0.3,
    y: 3.94,
    w: 4.8,
    h: 0.3,
    fontSize: 11.4,
    color: C.slate,
  });

  addText(slide, "→", {
    x: 6.28,
    y: 3.28,
    w: 0.6,
    h: 0.4,
    fontSize: 26,
    bold: true,
    color: C.slate,
    align: "center",
  });

  rect(slide, 7.02, 2.66, 5.59, 1.7, C.paleRed);
  rect(slide, 7.02, 2.66, 5.59, 0.07, ROJO);
  addKicker(slide, 7.32, 2.88, "Lo que el eslogan dice", ROJO, 4.4);
  addText(slide, "ojos", {
    x: 7.32,
    y: 3.18,
    w: 4.9,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: ROJO,
  });
  addText(slide, "cualquiera que mire, sin ninguna otra condición", {
    x: 7.32,
    y: 3.94,
    w: 4.9,
    h: 0.3,
    fontSize: 11.4,
    color: C.slate,
  });

  rect(slide, M, 4.62, CW, 0.72, C.navy);
  addText(
    slide,
    "Un ojo no revisa: mira. Y mirar no era lo que la ley pedía.",
    {
      x: M + 0.34,
      y: 4.74,
      w: CW - 0.68,
      h: 0.48,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addText(
    slide,
    "Esa sustitución es la que vuelve falsa la versión popular. La formulación original nunca dijo que bastara con mirar: pedía gente capaz de caracterizar el problema y de corregirlo.",
    {
      x: M,
      y: 5.54,
      w: CW,
      h: 0.5,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Y eso permite leer con precisión el caso que siempre se usa para dar la ley por refutada.",
    { y: 6.28, h: 0.54, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ============================== 16 HEARTBLEED, CON PRECISIÓN
function slideHeartbleed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el caso",
    "El caso no refuta la ley: la confirma por ausencia",
    "OpenSSL sostenía buena parte del tráfico cifrado de internet, y mantuvo un defecto grave durante años.",
    false,
    { titleW: 10.3 }
  );

  const cifras = [
    [AZUL, "Millones", "de sistemas dependían de esa biblioteca"],
    [ROJO, "Muy pocas", "personas leían y modificaban su código"],
  ];
  cifras.forEach(([color, cifra, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.62, 5.76, 1.16, i === 1 ? C.paleRed : C.white);
    rect(slide, x, 2.62, 5.76, 0.07, color);
    addText(slide, cifra, {
      x: x + 0.34,
      y: 2.82,
      w: 5.08,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 3.32,
      w: 5.08,
      h: 0.3,
      fontSize: 13,
      color: C.ink,
    });
  });

  rect(slide, M, 4.02, CW, 0.62, C.softNeutral);
  addText(
    slide,
    "Depender de un software no es mirarlo. Millones de usuarios no son millones de revisores.",
    {
      x: M + 0.34,
      y: 4.14,
      w: CW - 0.68,
      h: 0.38,
      fontSize: 15,
      bold: true,
      color: C.ink,
      align: "center",
    }
  );

  addText(
    slide,
    "Con la redacción original a la vista, el caso se lee distinto: OpenSSL nunca tuvo una base grande de co-desarrolladores, así que la condición de la ley nunca se cumplió. Lo que el caso refuta es el eslogan.",
    {
      x: M,
      y: 4.84,
      w: CW,
      h: 0.5,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addCita(
    slide,
    M,
    5.46,
    CW,
    0.66,
    "La mayoría de la gente simplemente no sabe qué buscar.",
    { accent: ORO, fontSize: 14 }
  );
  addFuente(
    slide,
    M,
    6.22,
    "Michael Howard y David LeBlanc, «Writing Secure Code», 2003 · once años antes de este caso · traducción del original en inglés.",
    { w: 10.5 }
  );

  addTakeaway(
    slide,
    "Sin lista de comprobación y sin una referencia contra la cual comparar, mirar no produce hallazgos.",
    { y: 6.52, h: 0.44, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

// ============================== 17 LOS OJOS SE VOLVIERON INFINITOS
function slideOjosInfinitos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el experimento",
    "Durante veinticinco años esto fue una discusión teórica",
    "No había manera de conseguir muchos ojos competentes y baratos. Eso cambió.",
    false,
    { titleW: 10.3 }
  );

  const estados = [
    [
      AZUL,
      "ANTES",
      "Revisar código ajeno costaba tiempo de alguien con criterio, y ese tiempo era escaso y caro.",
      "El límite era real",
    ],
    [
      ROJO,
      "AHORA",
      "Cualquiera puede apuntar un agente a un repositorio ajeno y producir un informe de seguridad con apariencia profesional en minutos, sin haber leído el código.",
      "El límite desapareció",
    ],
  ];
  estados.forEach(([color, etiqueta, texto, remate], i) => {
    const y = 2.6 + i * 1.36;
    rect(slide, M, y, CW, 1.24, i === 1 ? C.paleRed : C.white);
    rect(slide, M, y, 0.07, 1.24, color);
    addText(slide, etiqueta, {
      x: M + 0.34,
      y: y + 0.2,
      w: 1.5,
      h: 0.26,
      fontSize: 11.5,
      bold: true,
      color,
      charSpacing: 1.4,
    });
    addText(slide, texto, {
      x: M + 2.0,
      y: y + 0.18,
      w: 5.86,
      h: 0.9,
      fontSize: 13.2,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
    vrule(slide, 8.7, y + 0.2, 0.84, C.border, 1);
    addText(slide, remate, {
      x: 9.02,
      y: y + 0.44,
      w: 3.4,
      h: 0.34,
      fontSize: 14,
      bold: true,
      color,
    });
  });

  rect(slide, M, 5.42, CW, 0.78, C.navy);
  addText(
    slide,
    "Si la versión popular de la ley fuera cierta, esto tendría que haber sido\nla edad de oro de la seguridad del software libre.",
    {
      x: M + 0.34,
      y: 5.54,
      w: CW - 0.68,
      h: 0.56,
      fontSize: 15,
      color: C.white,
      align: "center",
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Ocurrió lo contrario, y está documentado con números por quien lo sufrió.",
    { y: 6.34, h: 0.54, fill: ROJO, fontSize: 14.5 }
  );

  validateSlide(slide, pptx);
}

// ============================== 18 CURL: LOS NÚMEROS
function slideCurl() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · los datos",
    "curl cerró su programa de recompensas por vulnerabilidades",
    "curl es una de las piezas de software más desplegadas del mundo: está en autos, televisores, teléfonos y servidores. Durante años pagó a quien reportara un problema de seguridad real.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  const numeros = [
    [AZUL, "87", "vulnerabilidades confirmadas en toda la vida del programa"],
    [AZUL, "+100.000", "dólares pagados en recompensas"],
    [VERDE, "+15 %", "de los reportes eran vulnerabilidad real, históricamente"],
    [ROJO, "−5 %", "de los reportes eran vulnerabilidad real, desde 2025"],
  ];
  const nw = 2.94;
  numeros.forEach(([color, cifra, texto], i) => {
    const x = M + i * (nw + 0.12);
    rect(slide, x, 2.66, nw, 1.34, i === 3 ? C.paleRed : C.white);
    rect(slide, x, 2.66, nw, 0.07, color);
    addText(slide, cifra, {
      x: x + 0.2,
      y: 2.84,
      w: nw - 0.4,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.2,
      y: 3.44,
      w: nw - 0.4,
      h: 0.5,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  addCita(
    slide,
    M,
    4.16,
    CW,
    0.78,
    "…la embrutecedora basura generada por IA, personas trabajando peor que nunca, y la aparente voluntad de buscar agujeros en lugar de ayudar.",
    { accent: ROJO, fontSize: 13.6, fill: C.paleRed }
  );
  addFuente(
    slide,
    M,
    5.04,
    "Daniel Stenberg, creador y mantenedor de curl, 26 de enero de 2026 · traducción del original en inglés. El programa terminó el 31 de enero de 2026.",
    { w: 11 }
  );

  rect(slide, M, 5.4, CW, 0.62, C.softNeutral);
  addText(
    slide,
    "Nombra tres factores, y solo uno es la IA. La herramienta amplificó un problema de incentivos que ya existía.",
    {
      x: M + 0.34,
      y: 5.52,
      w: CW - 0.68,
      h: 0.38,
      fontSize: 13,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Cuando los ojos se volvieron infinitos no hubo más seguridad: hubo tanto ruido que hubo que cerrar el canal para recibir hallazgos.",
    { y: 6.16, h: 0.6, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 19 QUÉ QUEDA EN PIE
function slideQuedaEnPie() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la conclusión",
    "Los ojos no eran lo escaso",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.24, CW, 0.9, C.navy);
  addText(
    slide,
    "Lo escaso lo dijo Torvalds en 1999, en la misma página donde nació la ley: caracterizar el problema.",
    {
      x: M + 0.34,
      y: 2.38,
      w: CW - 0.68,
      h: 0.62,
      fontSize: 17,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addText(
    slide,
    "Un hallazgo vale cuando alguien puede decir con qué entrada ocurre, contra qué debía compararse y cómo se reproduce. Eso no escala con la cantidad de lectores.",
    {
      x: M,
      y: 3.32,
      w: CW,
      h: 0.5,
      fontSize: 14,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 3.98, CW, 0.86, C.warm);
  rect(slide, M, 3.98, 0.07, 0.86, ORO);
  addText(
    slide,
    "El valor de una auditoría no está en cuántos hallazgos declara,\nsino en cuántos de ellos otro puede confirmar sin ayuda del que los encontró.",
    {
      x: M + 0.36,
      y: 4.1,
      w: CW - 0.72,
      h: 0.62,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      align: "center",
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, M, 5.06, CW, 1.0, C.paleRed);
  rect(slide, M, 5.06, 0.07, 1.0, ROJO);
  addKicker(slide, M + 0.36, 5.22, "Y por eso la escala empeora las cosas", ROJO, 5);
  addText(
    slide,
    "Diez mil sospechas bien redactadas no son mejores que ninguna. Son peores, porque consumen\nel tiempo del único recurso verdaderamente escaso: alguien competente decidiendo.",
    {
      x: M + 0.36,
      y: 5.5,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "El resto de la clase es el procedimiento que hace verificable un hallazgo, y el registro que lo deja escrito.",
    { y: 6.24, h: 0.56, fontSize: 13.8 }
  );

  validateSlide(slide, pptx);
}

// ================================ 20 PREGUNTAS GUÍA DEL BLOQUE 2
function slidePreguntasB2() {
  slidePreguntas(2, "Preguntas para llevarse del Bloque 2", [
    [
      "El autor escribió «base de beta-testers y co-desarrolladores» y el eslogan lo convirtió en «ojos». ¿Qué se pierde en esa sustitución, y por qué eso vuelve falsa la versión popular sin que la original lo sea?",
      "Pregúntate qué puede hacer un co-desarrollador que un espectador no.",
    ],
    [
      "Torvalds dejó dicho que encontrar el problema es el desafío mayor. Si eso es cierto, ¿qué tendría que aportar un agente para ayudar de verdad en una auditoría?",
      "Más texto que parezca un hallazgo no es aportar. Mira qué campos le faltan a ese texto.",
    ],
    [
      "curl no cerró su programa por recibir pocos reportes, sino demasiados sin valor. ¿Qué le habría permitido separar los útiles de los inútiles sin leerlos todos?",
      "Piensa en un requisito de entrada, no en un lector más rápido.",
    ],
  ]);
}

// ================================================== 21 DIVISOR BLOQUE 3
function slideDivisorB3() {
  slideDivisor(
    3,
    "El procedimiento,\nejecutado",
    "Las barreras ya las conoces. ¿En qué orden se aplican, por qué en ese, y en qué momento se para?"
  );
}

// ============================== 22 EL ORDEN, Y POR QUÉ
function slideElOrden() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el criterio",
    "El orden no es arbitrario: lo deciden dos cosas",
    "Y las dos apuntan en la misma dirección.",
    false,
    { titleW: 10.3 }
  );

  const criterios = [
    [
      AZUL,
      "Costo creciente",
      "Ejecutar una herramienta cuesta segundos de máquina.",
      "Leer el código contra el requisito cuesta atención humana.",
      "Decidir si un umbral corresponde cuesta una conversación con quien manda.",
    ],
    [
      ORO,
      "Objetividad decreciente",
      "Una herramienta no discute consigo misma: dos ejecuciones dan lo mismo.",
      "Una lectura depende de en qué se fijó quien leyó.",
      "Un juicio de criterio depende de quién lo emite y con qué autoridad.",
    ],
  ];
  criterios.forEach(([color, titulo, l1, l2, l3], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.5, 5.76, 2.2, C.white);
    rect(slide, x, 2.5, 5.76, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.34,
      y: 2.72,
      w: 5.08,
      h: 0.34,
      fontSize: 17,
      bold: true,
      color: C.ink,
    });
    [l1, l2, l3].forEach((linea, j) => {
      const y = 3.2 + j * 0.44;
      addText(slide, "→", {
        x: x + 0.34,
        y,
        w: 0.3,
        h: 0.26,
        fontSize: 11.5,
        color,
      });
      addText(slide, linea, {
        x: x + 0.7,
        y,
        w: 4.72,
        h: 0.4,
        fontSize: 11.6,
        color: C.slate,
        lineSpacingMultiple: 1.12,
      });
    });
  });

  rect(slide, M, 4.9, CW, 0.86, C.navy);
  addText(
    slide,
    "Lo barato y objetivo primero. Y cada paso reduce lo que el siguiente tiene que mirar.",
    {
      x: M + 0.34,
      y: 5.04,
      w: CW - 0.68,
      h: 0.58,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addText(
    slide,
    "No tiene sentido gastar atención humana en algo que una herramienta detecta sola.",
    {
      x: M,
      y: 5.94,
      w: CW,
      h: 0.28,
      fontSize: 13.4,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "De ahí salen cinco pasos, y el primero no mira código.",
    { y: 6.32, h: 0.54, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ============================== 23 LOS CINCO PASOS
function slideCincoPasos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el mapa del procedimiento",
    "Cinco pasos, y cada uno ve lo que el anterior no podía",
    "",
    false,
    { titleW: 10.3 }
  );

  const COLS = [
    ["PASO", M, 2.5],
    ["CONTRA QUÉ COMPARA", 3.84, 3.2],
    ["QUÉ ENCUENTRA QUE EL ANTERIOR NO PODÍA", 7.2, 5.41],
  ];
  COLS.forEach(([etiqueta, x, w], i) => {
    addText(slide, etiqueta, {
      x,
      y: 2.34,
      w,
      h: 0.22,
      fontSize: 9.3,
      bold: true,
      color: i === 2 ? ORO : C.slate,
      charSpacing: 1.2,
    });
  });
  rule(slide, M, 2.62, CW, C.navy, 1.2);

  const pasos = [
    [ROJO, "0", "Alcance", "—", "Fija el límite. Sin esto no hay criterio de término"],
    [AZUL, "1", "Barreras automáticas", "Los tipos y un catálogo de patrones", "Lo mecánico, sin juicio y sin cansancio"],
    [AZUL, "2", "El requisito escrito", "El documento del proyecto", "Lo que ninguna herramienta puede formular"],
    [ORO, "3", "Una referencia externa", "Un modelo de calidad, una norma, una ley", "Lo que el requisito mismo olvidó decir"],
    [VERDE, "4", "La ejecución", "El comportamiento real, con una prueba", "Separa el defecto de la sospecha y del hueco"],
  ];
  const RH = 0.66;
  pasos.forEach(([color, num, nombre, contra, encuentra], i) => {
    const y = 2.74 + i * RH;
    if (i % 2 === 0) rect(slide, M, y, CW, RH - 0.06, C.white);
    rect(slide, M, y, 0.05, RH - 0.06, color);
    addCircleLabel(slide, M + 0.18, y + 0.12, 0.36, color, num, { fontSize: 12 });
    addText(slide, nombre, {
      x: M + 0.62,
      y: y + 0.16,
      w: 2.5,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: C.ink,
    });
    addText(slide, contra, {
      x: 3.84,
      y: y + 0.1,
      w: 3.2,
      h: 0.42,
      fontSize: 11.4,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    addText(slide, encuentra, {
      x: 7.2,
      y: y + 0.1,
      w: 5.41,
      h: 0.42,
      fontSize: 11.4,
      bold: true,
      color: color === VERDE ? VERDE : C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(
    slide,
    "Esta tabla es el procedimiento completo. El resto del bloque la ejecuta paso por paso sobre un proyecto real.",
    { y: 6.24, h: 0.56, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 24 PASO 0: EL ALCANCE
function slidePasoCero() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 0",
    "Declarar el alcance antes de abrir nada",
    "Una auditoría sin alcance declarado no puede terminar bien, porque no puede terminar: siempre queda algo por mirar.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.66,
    w: 7.1,
    h: 1.9,
    title: "Las cuatro líneas que se escriben antes de empezar",
    code: [
      "Que se audita:   el modulo src/reservas.py",
      "Contra que:      REQUISITOS.md, ISO/IEC 25010 y la Ley 21.719",
      "Que queda fuera: la interfaz, la persistencia y el rendimiento",
      "Cuando termina:  cuando los cuatro pasos se aplicaron sobre ese modulo",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.4,
  });

  rect(slide, 8.02, 2.66, 4.59, 1.9, C.paleRed);
  rect(slide, 8.02, 2.66, 0.07, 1.9, ROJO);
  addKicker(slide, 8.36, 2.86, "La línea que importa", ROJO, 4);
  addText(slide, "Qué queda fuera", {
    x: 8.36,
    y: 3.14,
    w: 4,
    h: 0.34,
    fontSize: 18,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Un informe que no declara qué quedó fuera es peor que uno incompleto: hace creer que se revisó todo.",
    {
      x: 8.36,
      y: 3.58,
      w: 4,
      h: 0.8,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addText(slide, "Y ese alcance es el que decide cuándo terminaste:", {
    x: M,
    y: 4.76,
    w: CW,
    h: 0.28,
    fontSize: 13.6,
    bold: true,
    color: C.ink,
  });

  const criterios = [
    [VERDE, "Sí termina", "cuando los pasos declarados se aplicaron sobre el alcance declarado"],
    [ROJO, "No termina", "cuando aparece algo grave, cuando se acaba la hora, ni cuando ya parece suficiente"],
  ];
  criterios.forEach(([color, etiqueta, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 5.12, 5.76, 0.86, i === 0 ? C.white : C.paleRed);
    rect(slide, x, 5.12, 0.06, 0.86, color);
    addText(slide, etiqueta, {
      x: x + 0.3,
      y: 5.26,
      w: 1.8,
      h: 0.26,
      fontSize: 12.4,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 5.54,
      w: 5.16,
      h: 0.36,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "Recién ahora se abre el código.",
    { y: 6.28, h: 0.54, fontSize: 15 }
  );

  validateSlide(slide, pptx);
}

// ============================== 25 EL PROYECTO DE HOY
function slideElProyecto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el material",
    "El proyecto que se audita hoy",
    "Un sistema de reserva de laboratorio. Su requisito completo son cuatro reglas, y caben en una lámina.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.66,
    w: 7.4,
    h: 2.58,
    title: "REQUISITOS.md · el documento completo del proyecto",
    code: [
      "- La jornada se divide en bloques numerados del 1 al 8.",
      "- Un estudiante puede tener como maximo 3 reservas",
      "  activas por semana.",
      "- No se puede reservar un bloque que ya esta tomado.",
      "- Una reserva se puede cancelar hasta 2 horas antes",
      "  del inicio del bloque.",
      "",
      "El sistema entrega un comprobante de reserva que",
      "identifica al estudiante.",
    ].join("\n"),
    lang: "markdown",
    fontSize: 10.2,
  });

  addKicker(slide, 8.32, 2.66, "Lo que hay que tener a mano", C.slate, 4.4);
  const notas = [
    [AZUL, "Cuatro reglas", "con números concretos: 1 a 8, máximo 3, 2 horas"],
    [ORO, "Una frase suelta", "sobre el comprobante, sin decir qué datos lleva"],
    [ROJO, "Un límite ambiguo", "«hasta 2 horas antes» no dice si incluye ese instante"],
  ];
  notas.forEach(([color, titulo, texto], i) => {
    const y = 2.98 + i * 0.72;
    rect(slide, 8.32, y, 4.29, 0.62, C.white);
    rect(slide, 8.32, y, 0.05, 0.62, color);
    addText(slide, titulo, {
      x: 8.56,
      y: y + 0.08,
      w: 3.9,
      h: 0.24,
      fontSize: 12.4,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: 8.56,
      y: y + 0.34,
      w: 3.9,
      h: 0.24,
      fontSize: 10.6,
      color: C.slate,
    });
  });

  addTakeaway(
    slide,
    "Guarda las cuatro reglas: los pasos 2, 3 y 4 se juegan contra ellas.",
    { y: 5.42, h: 0.54, fontSize: 14 }
  );

  addText(
    slide,
    "El proyecto se entrega ya ejecutado, con sus salidas registradas. Nadie queda detenido por el estado de su propio repositorio.",
    {
      x: M,
      y: 6.1,
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

// ============================== 26 PASO 1: LAS SALIDAS
function slidePasoUno() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 1",
    "Las barreras automáticas: tres comandos",
    "Primero lo que no requiere criterio. Es lo más barato y lo más objetivo que hay.",
    false,
    { titleW: 10.3 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 4.0,
    h: 2.16,
    title: "ruff · el linter",
    fontSize: 9.6,
    lines: [
      { prompt: ">", text: "uv run ruff check ." },
      { text: "import json", kind: "muted" },
      { text: "       ^^^^", kind: "muted" },
      { text: "Remove unused import" },
      { text: "Found 1 error." },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 4.86,
    y: 2.6,
    w: 4.0,
    h: 2.16,
    title: "pyrefly · el tipado",
    fontSize: 9.6,
    lines: [
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "Returned type `None` is not", kind: "muted" },
      { text: "assignable to declared return", kind: "muted" },
      { text: "type `bool`  [bad-return]" },
      { text: "INFO 1 error" },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 8.72,
    y: 2.6,
    w: 3.89,
    h: 2.16,
    title: "pytest · las pruebas",
    fontSize: 9.6,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "...." },
      { text: "" },
      { text: "4 passed in 0.03s" },
    ],
  });

  rect(slide, M, 4.94, CW, 0.8, C.white);
  rect(slide, M, 4.94, 0.07, 0.8, AZUL);
  addKicker(slide, M + 0.36, 5.08, "Dos hallazgos, y fíjate en su naturaleza", AZUL, 5.4);
  addText(
    slide,
    "Un import que sobra y un tipo de retorno que no calza. Válidos y baratos. Ninguno tiene que ver con si el sistema hace lo que el laboratorio necesita.",
    {
      x: M + 0.36,
      y: 5.34,
      w: CW - 0.72,
      h: 0.32,
      fontSize: 12.6,
      color: C.ink,
    }
  );

  addTakeaway(
    slide,
    "Pero el resultado que importa de esta lámina es el tercero: la suite está en verde.",
    { y: 5.9, h: 0.54, fill: VERDE, fontSize: 14 }
  );

  addText(
    slide,
    "Ejecuciones registradas para esta clase sobre Python 3.12.12.",
    {
      x: M,
      y: 6.58,
      w: CW,
      h: 0.24,
      fontSize: 9.6,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}

// ============================== 27 LA TRAMPA DEL VERDE
function slideTrampaDelVerde() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el resultado que engaña",
    "Cuatro pruebas, ninguna falla, y dos defectos adentro",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.3, CW, 1.06, C.successSoft);
  rect(slide, M, 2.3, 0.07, 1.06, VERDE);
  addText(slide, "4 passed in 0.03s", {
    x: M + 0.4,
    y: 2.46,
    w: 5,
    h: 0.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 30,
    bold: true,
    color: VERDE,
  });
  addText(slide, "Escritas por alguien que conocía bien el código.", {
    x: 6.2,
    y: 2.62,
    w: 6.2,
    h: 0.34,
    fontSize: 14,
    color: C.ink,
  });

  addText(
    slide,
    "Los pasos siguientes van a encontrar dos defectos reales en ese mismo módulo. ¿Por qué estas cuatro pruebas no los ven?",
    {
      x: M,
      y: 3.54,
      w: CW,
      h: 0.5,
      fontSize: 14.5,
      bold: true,
      color: C.ink,
    }
  );

  const explicacion = [
    [
      AZUL,
      "Contra qué comparan estas pruebas",
      "Contra lo que su autor entendió que el código debía hacer.",
    ],
    [
      ROJO,
      "Contra qué NO comparan",
      "Contra el documento de requisitos, que ninguna de ellas leyó.",
    ],
  ];
  explicacion.forEach(([color, titulo, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 4.14, 5.76, 1.06, i === 1 ? C.paleRed : C.white);
    rect(slide, x, 4.14, 5.76, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.34,
      y: 4.34,
      w: 5.08,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 4.66,
      w: 5.08,
      h: 0.44,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.36, CW, 0.82, C.navy);
  addText(
    slide,
    "Una suite en verde no dice que el sistema esté bien.\nDice que el código coincide con lo que quien la escribió creía que había que hacer.",
    {
      x: M + 0.34,
      y: 5.48,
      w: CW - 0.68,
      h: 0.6,
      fontSize: 14.6,
      color: C.white,
      align: "center",
      lineSpacingMultiple: 1.2,
    }
  );

  addTakeaway(
    slide,
    "Por eso el paso 1 no puede ser el último. Hay que ir a buscar el documento.",
    { y: 6.32, h: 0.5, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 28 PASO 2: CONTRA EL REQUISITO
function slidePasoDos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 2",
    "El código contra el requisito escrito",
    "La primera regla dice: «la jornada se divide en bloques numerados del 1 al 8».",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 6.1,
    h: 1.94,
    title: "src/reservas.py · lo que dice el código",
    code: [
      "BLOQUE_MIN = 1",
      "BLOQUE_MAX = 8",
      "",
      "def bloque_valido(bloque: int) -> bool:",
      "    return BLOQUE_MIN <= bloque < BLOQUE_MAX",
    ].join("\n"),
    lang: "python",
    fontSize: 10.4,
  });

  addTerminalPanel(slide, SH, {
    x: 6.94,
    y: 2.6,
    w: 5.67,
    h: 1.94,
    title: "ejecutado sobre los valores del borde",
    fontSize: 10,
    lines: [
      { text: "bloque 1:  puede_reservar = True" },
      { text: "bloque 7:  puede_reservar = True" },
      { text: "bloque 8:  puede_reservar = False" },
      { text: "bloque 9:  puede_reservar = False" },
    ],
  });

  rect(slide, M, 4.7, CW, 0.78, C.paleRed);
  rect(slide, M, 4.7, 0.07, 0.78, ROJO);
  addText(slide, "El bloque 8 no se puede reservar.", {
    x: M + 0.36,
    y: 4.84,
    w: 5.6,
    h: 0.34,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "El requisito lo incluye y el código lo excluye: usa «menor que» donde correspondía «menor o igual».\nUn octavo de la jornada del laboratorio quedó inutilizable.",
    {
      x: 6.6,
      y: 4.82,
      w: 5.86,
      h: 0.56,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, M, 5.58, CW, 0.74, C.white);
  rect(slide, M, 5.58, 0.07, 0.74, AZUL);
  addText(
    slide,
    "Ninguna herramienta podía encontrar esto: esa comparación es código perfectamente correcto.\nLo es. Solo compara contra el número equivocado, y el número correcto está en un archivo que no leen.",
    {
      x: M + 0.36,
      y: 5.7,
      w: CW - 0.72,
      h: 0.52,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Primer hallazgo que importa, y apareció leyendo un archivo de texto.",
    { y: 6.44, h: 0.5, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 29 PASO 3: CUMPLE EL REQUISITO
function slidePasoTresCumple() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 3",
    "Ahora algo distinto: el requisito contra el mundo",
    "El paso anterior comparó el código contra el requisito. Este compara el requisito contra algo que el proyecto no escribió.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  addCita(
    slide,
    M,
    2.72,
    CW,
    0.62,
    "El sistema entrega un comprobante de reserva que identifica al estudiante.",
    { accent: AZUL, fontSize: 14.5, fill: C.white }
  );
  addText(slide, "Eso es todo lo que el requisito dice sobre el comprobante.", {
    x: M,
    y: 3.44,
    w: CW,
    h: 0.26,
    fontSize: 12.4,
    italic: true,
    color: C.slate,
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 3.8,
    w: 6.5,
    h: 1.34,
    title: "src/reservas.py · lo que el código hace",
    code: [
      "def comprobante(nombre, rut, correo, bloque):",
      '    return f"{nombre} | {rut} | {correo} | bloque {bloque}"',
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  addTerminalPanel(slide, SH, {
    x: 7.32,
    y: 3.8,
    w: 5.29,
    h: 1.34,
    title: "lo que devuelve",
    fontSize: 9.4,
    lines: [
      { text: "Ana Perez | 12.345.678-9 |" },
      { text: "ana.perez@correo.cl | bloque 3" },
    ],
  });

  rect(slide, M, 5.3, CW, 0.86, C.successSoft);
  rect(slide, M, 5.3, 0.07, 0.86, VERDE);
  addText(slide, "Contra el requisito, esto CUMPLE.", {
    x: M + 0.36,
    y: 5.44,
    w: 5,
    h: 0.32,
    fontSize: 17,
    bold: true,
    color: VERDE,
  });
  addText(
    slide,
    "Identifica al estudiante, sin ninguna duda.\nPor eso el paso 2 no lo habría marcado nunca.",
    {
      x: 6.2,
      y: 5.42,
      w: 6.2,
      h: 0.56,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Y aun así es un hallazgo. Falta traer la referencia que el proyecto no tiene.",
    { y: 6.3, h: 0.54, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ============================== 30 PASO 3: Y AUN ASÍ ES HALLAZGO
function slidePasoTresHallazgo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 3",
    "La referencia externa trae palabras que el requisito no tiene",
    "",
    false,
    { titleW: 10.3 }
  );

  const referencias = [
    [
      ORO,
      "ISO/IEC 25010",
      "El modelo de calidad de producto",
      "Trae la subcaracterística confidencialidad, que el requisito del proyecto no menciona en ninguna parte.",
    ],
    [
      ROJO,
      "Ley 21.719",
      "Protección de datos personales",
      "Exige que los datos tratados se limiten a los necesarios para la finalidad declarada.",
    ],
  ];
  referencias.forEach(([color, titulo, sub, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.4, 5.76, 1.42, C.white);
    rect(slide, x, 2.4, 5.76, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.34,
      y: 2.6,
      w: 5.08,
      h: 0.32,
      fontSize: 17,
      bold: true,
      color,
    });
    addText(slide, sub, {
      x: x + 0.34,
      y: 2.94,
      w: 5.08,
      h: 0.24,
      fontSize: 11,
      italic: true,
      color: C.slate,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 3.24,
      w: 5.08,
      h: 0.48,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  addText(slide, "Aplicadas al comprobante, en dos pasos:", {
    x: M,
    y: 3.98,
    w: CW,
    h: 0.28,
    fontSize: 13.6,
    bold: true,
    color: C.ink,
  });

  const razonamiento = [
    ["1", "¿Cuál es la finalidad?", "Identificar al estudiante en un comprobante de reserva."],
    ["2", "¿Qué datos necesita?", "El nombre alcanza. El RUT y el correo no, y los dos son datos personales."],
  ];
  razonamiento.forEach(([num, pregunta, respuesta], i) => {
    const y = 4.34 + i * 0.72;
    rect(slide, M, y, CW, 0.62, i === 1 ? C.paleRed : C.white);
    addCircleLabel(slide, M + 0.2, y + 0.13, 0.36, i === 1 ? ROJO : AZUL, num, {
      fontSize: 12,
    });
    addText(slide, pregunta, {
      x: M + 0.68,
      y: y + 0.18,
      w: 3.0,
      h: 0.28,
      fontSize: 12.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, respuesta, {
      x: 4.6,
      y: y + 0.19,
      w: 7.8,
      h: 0.28,
      fontSize: 12.6,
      color: C.ink,
    });
  });

  addTakeaway(
    slide,
    "El requisito puede estar cumplido y estar incompleto. Esa clase de hueco solo aparece trayendo una referencia de afuera.",
    { y: 5.92, h: 0.6, fill: ORO, fontSize: 13.8 }
  );

  addText(
    slide,
    "Por eso el paso 3 existe como paso separado, y no como un rato más mirando el código.",
    {
      x: M,
      y: 6.66,
      w: CW,
      h: 0.26,
      fontSize: 12,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}

// ============================== 31 PASO 4: LA PRUEBA ANTES DE CORREGIR
function slidePasoCuatro() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 4",
    "Los hallazgos todavía son afirmaciones",
    "Se convierten en hechos escribiendo la prueba antes de tocar el código.",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 7.4,
    h: 2.06,
    title: "tests/test_hallazgos.py · escritas durante la auditoría",
    code: [
      "def test_h1_el_bloque_8_se_puede_reservar():",
      "    assert puede_reservar(0, 8, tomado=False) is True",
      "",
      "def test_h2_el_comprobante_no_expone_el_rut():",
      '    salida = comprobante("Ana Perez", "12.345.678-9",',
      '                         "ana.perez@correo.cl", 3)',
      "    assert RUT.search(salida) is None",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addTerminalPanel(slide, SH, {
    x: 8.24,
    y: 2.6,
    w: 4.37,
    h: 2.06,
    title: "el resultado",
    fontSize: 9.4,
    lines: [
      { text: "FAILED  test_h1_el_bloque_8", kind: "muted" },
      { text: "FAILED  test_h2_el_comprobante", kind: "muted" },
      { text: "" },
      { text: "2 failed in 0.11s" },
    ],
  });

  rect(slide, M, 4.82, CW, 0.78, C.paleRed);
  rect(slide, M, 4.82, 0.07, 0.78, ROJO);
  addText(slide, "Dos rojos.", {
    x: M + 0.36,
    y: 4.96,
    w: 2.2,
    h: 0.34,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Los dos hallazgos son defectos, no opiniones, y ahora existe la evidencia que lo demuestra.\nCualquiera puede ejecutar esas dos pruebas y obtener lo mismo, sin haber estado hoy aquí.",
    {
      x: 3.2,
      y: 4.92,
      w: 9.2,
      h: 0.6,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Escribir la prueba antes de corregir es lo que separa un defecto de una sospecha.",
    { y: 5.78, h: 0.56, fontSize: 14 }
  );

  addText(
    slide,
    "Ejecuciones registradas para esta clase sobre Python 3.12.12.",
    {
      x: M,
      y: 6.5,
      w: CW,
      h: 0.24,
      fontSize: 9.6,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}

// ============================== 32 EL TERCERO, QUE NO LLEGA A DEFECTO
function slideElHueco() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · paso 4",
    "Y aparece un tercero, que no llega a ser defecto",
    "La cuarta regla dice: «una reserva se puede cancelar hasta 2 horas antes del inicio».",
    false,
    { titleW: 10.3 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.62,
    w: 6.5,
    h: 1.66,
    title: "ejecutado sobre los tres casos",
    fontSize: 10,
    lines: [
      { text: "tres horas antes         True" },
      { text: "exactamente dos horas    False" },
      { text: "una hora antes           False" },
    ],
  });

  rect(slide, 7.32, 2.62, 5.29, 1.66, C.warm);
  rect(slide, 7.32, 2.62, 0.07, 1.66, ORO);
  addText(slide, "¿Es un defecto?", {
    x: 7.66,
    y: 2.82,
    w: 4.6,
    h: 0.34,
    fontSize: 18,
    bold: true,
    color: ORO,
  });
  addText(
    slide,
    "Depende de si «hasta 2 horas antes» incluye el instante exacto de las dos horas.\n\nY el requisito no lo dice.",
    {
      x: 7.66,
      y: 3.24,
      w: 4.6,
      h: 0.9,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, M, 4.5, CW, 0.86, C.navy);
  addText(
    slide,
    "No se puede escribir la prueba, porque no se sabe qué debería dar.",
    {
      x: M + 0.34,
      y: 4.62,
      w: CW - 0.68,
      h: 0.62,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  const clases = [
    [ROJO, "Defecto", "la prueba se escribe y falla"],
    [AZUL, "Preferencia", "la prueba se escribe y pasa"],
    [ORO, "Hueco de especificación", "la prueba no se puede escribir todavía"],
  ];
  clases.forEach(([color, titulo, texto], i) => {
    const x = M + i * 4.02;
    const ultimo = i === 2;
    rect(slide, x, 5.5, 3.72, 0.72, ultimo ? C.warm : C.white);
    rect(slide, x, 5.5, 3.72, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 5.64,
      w: 3.3,
      h: 0.26,
      fontSize: 13.4,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.24,
      y: 5.92,
      w: 3.3,
      h: 0.24,
      fontSize: 11.2,
      color: C.slate,
    });
  });

  addTakeaway(
    slide,
    "No falta código: falta que alguien decida. Y eso se registra como tal, no se disimula.",
    { y: 6.4, h: 0.5, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ============================== 33 SÍNTESIS: CUATRO CLASES DE HALLAZGO
function slideSintesisPasos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · síntesis",
    "Cuatro pasos, cuatro clases de hallazgo",
    "Y cada uno encontró algo que el anterior no estaba en condiciones de encontrar.",
    false,
    { titleW: 10.3 }
  );

  const COLS = [
    ["PASO", M, 3.2],
    ["QUÉ ENCONTRÓ", 4.1, 5.0],
    ["CLASE", 9.3, 3.31],
  ];
  COLS.forEach(([etiqueta, x, w]) => {
    addText(slide, etiqueta, {
      x,
      y: 2.5,
      w,
      h: 0.22,
      fontSize: 9.3,
      bold: true,
      color: C.slate,
      charSpacing: 1.2,
    });
  });
  rule(slide, M, 2.78, CW, C.navy, 1.2);

  const filas = [
    [AZUL, "1 · Barreras automáticas", "Import sin usar · retorno None declarado bool", "Mecánico"],
    [ROJO, "2 · Contra el requisito", "El bloque 8 no se puede reservar", "Defecto"],
    [ORO, "3 · Contra referencia externa", "El comprobante expone RUT y correo", "Defecto y hueco del requisito"],
    [VERDE, "4 · Ejecución", "«Hasta 2 horas antes» no está decidido", "Hueco de especificación"],
  ];
  filas.forEach(([color, paso, encontro, clase], i) => {
    const y = 2.9 + i * 0.72;
    if (i % 2 === 0) rect(slide, M, y, CW, 0.64, C.white);
    rect(slide, M, y, 0.05, 0.64, color);
    addText(slide, paso, {
      x: M + 0.22,
      y: y + 0.2,
      w: 3.0,
      h: 0.28,
      fontSize: 12,
      bold: true,
      color: C.ink,
    });
    addText(slide, encontro, {
      x: 4.1,
      y: y + 0.14,
      w: 5.0,
      h: 0.44,
      fontSize: 11.8,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    rect(slide, 9.3, y + 0.16, 3.31, 0.36, color);
    addText(slide, clase, {
      x: 9.3,
      y: y + 0.2,
      w: 3.31,
      h: 0.28,
      fontSize: 11.4,
      bold: true,
      color: C.white,
      align: "center",
    });
  });

  rect(slide, M, 5.86, CW, 0.5, C.softNeutral);
  addText(
    slide,
    "Si se hubiera hecho solo el paso 1, la auditoría habría concluido que el módulo está bien.",
    {
      x: M + 0.34,
      y: 5.96,
      w: CW - 0.68,
      h: 0.32,
      fontSize: 13,
      color: C.ink,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "El orden importa, pero saltarse un paso importa más.",
    { y: 6.46, h: 0.48, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ============================== 34 CUÁNDO TERMINA
function slideCuandoTermina() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el criterio de término",
    "Una auditoría termina cuando cubrió lo que declaró cubrir",
    "No cuando aparece algo grave, no cuando se acaba la hora, y no cuando el auditor siente que ya encontró bastante.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  rect(slide, M, 2.78, CW, 1.0, C.navy);
  addText(
    slide,
    "Eso tiene una consecuencia que incomoda, y que hay que sostener igual:",
    {
      x: M + 0.36,
      y: 2.94,
      w: CW - 0.72,
      h: 0.26,
      fontSize: 13,
      color: C.softBlue,
    }
  );
  addText(
    slide,
    "una auditoría puede terminar sin hallazgos y estar bien hecha.",
    {
      x: M + 0.36,
      y: 3.24,
      w: CW - 0.72,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.white,
    }
  );

  const casos = [
    [
      VERDE,
      "Sirve",
      "Auditoría sin hallazgos, con alcance declarado",
      "Quien la recibe sabe qué se miró y qué no. Puede decidir con eso.",
    ],
    [
      ROJO,
      "No sirve",
      "Auditoría con veinte hallazgos y sin alcance declarado",
      "Nadie puede saber qué quedó sin revisar, que es justo lo que un tercero necesita saber.",
    ],
  ];
  casos.forEach(([color, etiqueta, titulo, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 4.0, 5.76, 1.66, i === 1 ? C.paleRed : C.white);
    rect(slide, x, 4.0, 5.76, 0.07, color);
    addText(slide, etiqueta, {
      x: x + 0.34,
      y: 4.2,
      w: 2,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color,
      charSpacing: 0.8,
    });
    addText(slide, titulo, {
      x: x + 0.34,
      y: 4.52,
      w: 5.08,
      h: 0.5,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 5.06,
      w: 5.08,
      h: 0.5,
      fontSize: 12.2,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
  });

  addTakeaway(
    slide,
    "Por eso el informe del bloque siguiente tiene una sección obligatoria para lo que quedó fuera.",
    { y: 5.86, h: 0.56, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ================================ 35 PREGUNTAS GUÍA DEL BLOQUE 3
function slidePreguntasB3() {
  slidePreguntas(3, "Preguntas para llevarse del Bloque 3", [
    [
      "La suite quedó en verde en el paso 1, y los pasos siguientes encontraron dos defectos. ¿Qué estaban comparando esas cuatro pruebas, y por qué eso las dejaba ciegas a estos dos casos?",
      "Vuelve a la tabla de los cinco pasos y mira la columna «contra qué compara».",
    ],
    [
      "El comprobante cumple el requisito del proyecto y aun así se marcó como hallazgo. ¿Qué autoriza a un auditor a levantar algo que el documento no incumple?",
      "Mira de dónde salió la palabra «confidencialidad»: no estaba en el proyecto.",
    ],
    [
      "Una auditoría puede terminar sin ningún hallazgo y estar bien hecha. ¿Qué tiene que traer ese informe para que alguien pueda creerle, en lugar de suponer que el auditor no miró bien?",
      "Es la línea del paso 0 que dijimos que era la que importaba.",
    ],
  ]);
}

// ================================================== 36 DIVISOR BLOQUE 4
function slideDivisorB4() {
  slideDivisor(
    4,
    "El registro,\nque es el producto",
    "La auditoría ya está hecha. ¿Qué tiene que quedar escrito para que otro pueda verificarla sin ti?"
  );
}

// ============================== 37 LOS CAMPOS QUE PIDE LA NORMA
function slideCamposNorma() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la ficha",
    "Un hallazgo tiene forma, y la norma la define",
    "ISO/IEC/IEEE 29119-3 la llama «reporte de incidente». Y aclara que el nombre da lo mismo: reporte de anomalía, de error, de defecto, de problema. Es la misma ficha.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  const campos = [
    ["Identificador único", "Referirse al hallazgo sin describirlo de nuevo", false],
    ["Información temporal", "Saber sobre qué versión ocurrió", false],
    ["Autor", "Saber a quién preguntarle", false],
    ["Contexto", "Reproducirlo: la entrada concreta y el entorno", true],
    ["Descripción", "Qué se observó y qué se esperaba", true],
    ["Severidad estimada", "Cuánto daño haría", false],
    ["Prioridad estimada", "Con qué urgencia atenderlo", false],
    ["Riesgo", "Qué pasa si no se corrige", false],
    ["Estado", "En qué quedó", false],
  ];
  const filas = 5;
  campos.forEach(([campo, para, clave], i) => {
    const col = i < filas ? 0 : 1;
    const fila = i < filas ? i : i - filas;
    const x = M + col * 6.16;
    const y = 2.72 + fila * 0.56;
    rect(slide, x, y, 5.76, 0.48, clave ? C.warm : C.white);
    rect(slide, x, y, 0.05, 0.48, clave ? ORO : C.border);
    addText(slide, campo, {
      x: x + 0.22,
      y: y + 0.06,
      w: 2.3,
      h: 0.24,
      fontSize: 12.2,
      bold: true,
      color: clave ? ORO : C.ink,
    });
    addText(slide, para, {
      x: x + 0.22,
      y: y + 0.27,
      w: 5.3,
      h: 0.2,
      fontSize: 10.4,
      color: C.slate,
    });
  });

  addFuente(
    slide,
    M,
    5.6,
    "ISO/IEC/IEEE 29119-3:2021, cláusula 8.11 · traducción del original en inglés.",
    { w: 8 }
  );

  addTakeaway(
    slide,
    "Los dos en dorado son los que separan un hallazgo de una sospecha.",
    { y: 5.94, h: 0.56, fill: ORO, fontSize: 14.5 }
  );

  addText(
    slide,
    "La norma define «incidente» de forma amplia: un evento o situación anómala o inesperada. No dice «defecto». Qué era se decide después.",
    {
      x: M,
      y: 6.66,
      w: CW,
      h: 0.26,
      fontSize: 12,
      italic: true,
      color: C.slate,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}

// ============================== 38 LOS DOS QUE IMPORTAN
function slideDosCampos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · los campos decisivos",
    "Sin estos dos, el reporte es de los que ahogaron a curl",
    "",
    false,
    { titleW: 10.3 }
  );

  const decisivos = [
    [
      ORO,
      "Contexto",
      "La entrada concreta y el entorno.",
      "Sin esto nadie puede reproducirlo, y un hallazgo que no se reproduce no se puede confirmar ni descartar.",
    ],
    [
      ORO,
      "Descripción",
      "Qué se observó y qué se esperaba.",
      "Las dos cosas. Con solo lo observado no se puede decidir si está mal; con solo lo esperado, no hay evidencia.",
    ],
  ];
  decisivos.forEach(([color, titulo, sub, texto], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 2.36, 5.76, 1.62, C.warm);
    rect(slide, x, 2.36, 5.76, 0.07, color);
    addText(slide, titulo, {
      x: x + 0.34,
      y: 2.58,
      w: 5.08,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
    });
    addText(slide, sub, {
      x: x + 0.34,
      y: 3.0,
      w: 5.08,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.34,
      y: 3.32,
      w: 5.08,
      h: 0.56,
      fontSize: 11.8,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
  });

  addText(
    slide,
    "Y hay un detalle en la redacción de la norma que vale la pena mirar. Dos campos no se llaman como uno esperaría:",
    {
      x: M,
      y: 4.18,
      w: CW,
      h: 0.28,
      fontSize: 13.6,
      color: C.ink,
    }
  );

  const nombres = [
    ["Lo que uno diría", "«Severidad» · «Prioridad»", C.slate, C.white],
    ["Lo que la norma dice", "«Estimación de severidad DE QUIEN REPORTA»", AZUL, C.softBlue],
  ];
  nombres.forEach(([etiqueta, texto, color, fondo], i) => {
    const x = M + i * 6.16;
    rect(slide, x, 4.56, 5.76, 0.86, fondo);
    rect(slide, x, 4.56, 0.06, 0.86, color);
    addText(slide, etiqueta.toUpperCase(), {
      x: x + 0.3,
      y: 4.7,
      w: 5.1,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 1.2,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 4.94,
      w: 5.1,
      h: 0.4,
      fontSize: 13.4,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 5.6, CW, 0.76, C.navy);
  addText(
    slide,
    "La norma no le pide al auditor que dictamine la gravedad. Le pide que declare la suya,\ndejando constancia de que es una estimación y de quién la hizo.",
    {
      x: M + 0.34,
      y: 5.72,
      w: CW - 0.68,
      h: 0.56,
      fontSize: 13.6,
      color: C.white,
      align: "center",
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Es la misma disciplina de todo el módulo: separar lo que se observó de lo que se opina sobre lo observado.",
    { y: 6.48, h: 0.46, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

// ============================== 39 LA FICHA ESCRITA
function slideFichaEscrita() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la ficha, escrita",
    "Así queda el primer hallazgo de la auditoría de hoy",
    "",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.3,
    w: 7.1,
    h: 3.5,
    title: "H-01 · el bloque 8 no se puede reservar",
    code: [
      "Contexto    puede_reservar(reservas=0, bloque=8, tomado=False)",
      "            Python 3.12.12, sin dependencias externas",
      "Observado   Devuelve False. El bloque 8 no se puede reservar.",
      "Esperado    True. REQUISITOS.md: la jornada se divide en",
      "            bloques numerados del 1 al 8.",
      "Referencia  REQUISITOS.md, primera regla",
      "Evidencia   test_h1_el_bloque_8_se_puede_reservar",
      "            2 failed in 0.11s",
      "Severidad   Alta segun el autor: inutiliza un octavo de la jornada",
      "Riesgo      El laboratorio pierde un bloque diario",
      "Clase       Defecto",
      "Estado      Abierto",
    ].join("\n"),
    lang: "bash",
    fontSize: 9.6,
  });

  addKicker(slide, 8.02, 2.3, "Qué cambia en los otros dos", C.slate, 4.4);

  const variantes = [
    [
      ORO,
      "H-02 · el comprobante",
      "Referencia",
      "ISO/IEC 25010, confidencialidad.\nLey 21.719, proporcionalidad.",
      "El requisito del proyecto no lo prohibía. La referencia viene de afuera.",
    ],
    [
      ROJO,
      "H-03 · las dos horas",
      "Estado",
      "Requiere decisión: definir si «hasta» incluye el instante exacto.",
      "No tiene evidencia de prueba porque no puede tenerla, y eso se declara.",
    ],
  ];
  variantes.forEach(([color, titulo, campo, valor, nota], i) => {
    const y = 2.62 + i * 1.66;
    rect(slide, 8.02, y, 4.59, 1.5, C.white);
    rect(slide, 8.02, y, 0.06, 1.5, color);
    addText(slide, titulo, {
      x: 8.32,
      y: y + 0.12,
      w: 4.1,
      h: 0.26,
      fontSize: 12.8,
      bold: true,
      color,
    });
    addText(slide, campo, {
      x: 8.32,
      y: y + 0.42,
      w: 1.3,
      h: 0.22,
      fontSize: 10,
      bold: true,
      color: C.slate,
      charSpacing: 0.6,
    });
    addText(slide, valor, {
      x: 8.32,
      y: y + 0.64,
      w: 4.1,
      h: 0.46,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, nota, {
      x: 8.32,
      y: y + 1.12,
      w: 4.1,
      h: 0.32,
      fontSize: 10,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(
    slide,
    "El campo «Referencia» es lo que distingue esta ficha de un «esto es inseguro»: dice contra qué documento se comparó, y por eso otro puede discrepar con argumentos.",
    { y: 5.96, h: 0.66, fill: ORO, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ============================== 40 EL INFORME Y SUS DOS SECCIONES
function slideInformeSecciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el informe",
    "La ficha registra un hallazgo. El informe registra la auditoría",
    "Es lo que un tercero lee primero. La norma le define diez secciones, y de esas hay dos que un informe complaciente siempre omite.",
    false,
    { titleW: 10.3, subtitleH: 0.5 }
  );

  const secciones = [
    ["Alcance", false],
    ["Resumen de lo realizado", false],
    ["Desviaciones respecto de lo planificado", true],
    ["Evaluación de término", false],
    ["Hallazgos", false],
    ["Riesgos residuales", true],
    ["Lecciones aprendidas", false],
  ];
  secciones.forEach(([texto, marcada], i) => {
    const y = 2.76 + i * 0.46;
    rect(slide, M, y, 6.1, 0.4, marcada ? C.paleRed : C.white);
    rect(slide, M, y, 0.05, 0.4, marcada ? ROJO : C.border);
    addText(slide, texto, {
      x: M + 0.24,
      y: y + 0.07,
      w: 5.6,
      h: 0.26,
      fontSize: 12.4,
      bold: marcada,
      color: marcada ? ROJO : C.ink,
    });
  });

  const incomodas = [
    [
      "Desviaciones",
      "Qué se dijo que se iba a hacer y no se hizo.",
    ],
    [
      "Riesgos residuales",
      "Qué queda expuesto después de esta auditoría, incluido todo lo que se declaró fuera del alcance.",
    ],
  ];
  addKicker(slide, 7.32, 2.76, "Las dos que nunca traen buenas noticias", ROJO, 5);
  incomodas.forEach(([titulo, texto], i) => {
    const y = 3.1 + i * 1.1;
    rect(slide, 7.32, y, 5.29, 0.96, C.paleRed);
    rect(slide, 7.32, y, 0.06, 0.96, ROJO);
    addText(slide, titulo, {
      x: 7.62,
      y: y + 0.12,
      w: 4.8,
      h: 0.28,
      fontSize: 14.5,
      bold: true,
      color: ROJO,
    });
    addText(slide, texto, {
      x: 7.62,
      y: y + 0.44,
      w: 4.8,
      h: 0.44,
      fontSize: 11.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  rect(slide, 7.32, 5.4, 5.29, 0.56, C.navy);
  addText(
    slide,
    "Ninguna de las dos puede faltar.",
    {
      x: 7.62,
      y: 5.52,
      w: 4.8,
      h: 0.34,
      fontSize: 14.5,
      bold: true,
      color: C.white,
      align: "center",
    }
  );

  addTakeaway(
    slide,
    "Un informe que solo dice lo que se hizo bien no sirve para tomar ninguna decisión.",
    { y: 6.2, h: 0.56, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ============================== 41 EL INFORME COMPLETO
function slideInformeCompleto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el producto terminado",
    "El informe de la auditoría de hoy, completo",
    "",
    false,
    { titleW: 10.3 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.24,
    w: 7.5,
    h: 3.9,
    title: "informe-auditoria.md",
    code: [
      "## Alcance",
      "src/reservas.py contra REQUISITOS.md, ISO/IEC 25010 y la",
      "Ley 21.719. Fuera: interfaz, persistencia y rendimiento.",
      "",
      "## Desviaciones respecto de lo planificado",
      "Ninguna. Los cuatro pasos se aplicaron sobre el alcance.",
      "",
      "## Hallazgos",
      "- H-01 Defecto. El bloque 8 no se puede reservar. Abierto.",
      "- H-02 Defecto contra referencia externa. Abierto.",
      "- H-03 Hueco de especificacion. Requiere decision.",
      "- Dos hallazgos mecanicos de herramienta.",
      "",
      "## Riesgos residuales",
      "- Lo que quedo fuera del alcance no fue mirado.",
      "- Las pruebas preexistentes (4 passed) comparan el codigo",
      "  contra lo que entendio su autor. Su color verde no es",
      "  evidencia de conformidad.",
    ].join("\n"),
    lang: "markdown",
    fontSize: 9.4,
  });

  rect(slide, 8.42, 2.24, 4.19, 1.8, C.paleRed);
  rect(slide, 8.42, 2.24, 0.06, 1.8, ROJO);
  addKicker(slide, 8.72, 2.44, "La frase que cierra el arco", ROJO, 3.6);
  addText(
    slide,
    "«Su color verde no es evidencia de conformidad.»",
    {
      x: 8.72,
      y: 2.72,
      w: 3.7,
      h: 0.66,
      fontSize: 14.5,
      bold: true,
      italic: true,
      color: ROJO,
      lineSpacingMultiple: 1.14,
    }
  );
  addText(
    slide,
    "Está en el informe, por escrito, para quien lo lea el año que viene.",
    {
      x: 8.72,
      y: 3.46,
      w: 3.7,
      h: 0.44,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  rect(slide, 8.42, 4.2, 4.19, 1.94, C.white);
  rect(slide, 8.42, 4.2, 0.06, 1.94, VERDE);
  addKicker(slide, 8.72, 4.4, "Lo que este documento permite", VERDE, 3.6);
  const permite = [
    "Repetir cada comprobación",
    "Llegar al mismo resultado",
    "Saber qué NO se miró",
    "Discutirlo con argumentos",
  ];
  permite.forEach((texto, i) => {
    const y = 4.7 + i * 0.36;
    addText(slide, "✓", {
      x: 8.72,
      y,
      w: 0.3,
      h: 0.26,
      fontSize: 12,
      bold: true,
      color: VERDE,
    });
    addText(slide, texto, {
      x: 9.06,
      y,
      w: 3.4,
      h: 0.26,
      fontSize: 12,
      color: C.ink,
    });
  });

  addTakeaway(
    slide,
    "Alguien que no estuvo puede tomar este documento y llegar a lo mismo. Eso distingue una auditoría de una opinión con plantilla.",
    { y: 6.3, h: 0.56, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ================================ 42 PREGUNTAS GUÍA DEL BLOQUE 4
function slidePreguntasB4() {
  slidePreguntas(4, "Preguntas para llevarse del Bloque 4", [
    [
      "La norma llama al campo «estimación de severidad de quien reporta», y no simplemente «severidad». ¿Qué cambia esa palabra, y qué problema evita en un informe que va a leer un tercero?",
      "Piensa qué pasa si el que recibe el informe no está de acuerdo con la gravedad.",
    ],
    [
      "La ficha del comprobante cita como referencia un modelo de calidad y una ley, no el requisito del proyecto. ¿Por qué esa cita es justamente lo que la hace discutible, y por qué eso es una virtud?",
      "Compárala con «encontré varios problemas de seguridad»: ¿cuál de las dos se puede refutar?",
    ],
    [
      "Un informe sin sección de riesgos residuales parece mejor que uno que la tiene. ¿Qué pierde exactamente quien lo recibe?",
      "La respuesta está en la línea del alcance que dijimos que era la que importaba.",
    ],
  ]);
}

// ============================== 43 CIERRE: LO QUE PUEDE AFIRMARSE
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
    h: 1.5,
    title: "lo que se podía afirmar al terminar la sesión anterior",
    fontSize: 10,
    lines: [
      { text: "El requisito fue comparado contra un" },
      { text: "modelo de calidad y contra la ley, y lo" },
      { text: "que faltaba esta escrito y tiene prueba." },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.74,
    y: 2.2,
    w: 5.87,
    h: 1.5,
    title: "lo que puede afirmarse ahora",
    fontSize: 10,
    lines: [
      { text: "La comparacion se hizo con un" },
      { text: "procedimiento declarado, y su resultado" },
      { text: "puede repetirlo alguien que no estuvo." },
    ],
  });

  rect(slide, M, 3.86, CW, 0.74, C.paleRed);
  rect(slide, M, 3.86, 0.07, 0.74, ROJO);
  addKicker(slide, M + 0.34, 4.0, "Y lo que sigue sin poder afirmarse", ROJO, 5);
  addText(slide, "El sistema no tiene más defectos.", {
    x: M + 0.34,
    y: 4.24,
    w: CW - 0.7,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: ROJO,
  });

  addText(
    slide,
    "Y esta vez la razón no es un vacío que se pueda llenar trayendo otra referencia. Es estructural: una auditoría cubre el alcance que declaró cubrir. Todo lo demás quedó sin mirar por decisión explícita, y por eso está escrito en los riesgos residuales.",
    {
      x: M,
      y: 4.8,
      w: CW,
      h: 0.5,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 5.44, CW, 0.72, C.navy);
  addText(
    slide,
    "Un informe honesto no elimina la incertidumbre. La delimita.",
    {
      x: M + 0.34,
      y: 5.56,
      w: CW - 0.68,
      h: 0.48,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "Queda además una pregunta que hoy se resolvió por intuición.",
    { y: 6.3, h: 0.54, fill: ORO, fontSize: 14.5 }
  );

  validateSlide(slide, pptx);
}

// ============================== 44 CIERRE FINAL
function slideCierreFinal() {
  const { slide } = createSlide("dark");

  addText(slide, "CIERRE DE LA SESIÓN", {
    x: M,
    y: 1.24,
    w: 5,
    h: 0.24,
    fontSize: 10.6,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(
    slide,
    "El proyecto de hoy tenía la suite en verde. Cuatro pruebas, ninguna falla, todas escritas por alguien que conocía bien el código.",
    {
      x: M,
      y: 1.62,
      w: 7.3,
      h: 0.86,
      fontSize: 16.5,
      color: C.white,
      lineSpacingMultiple: 1.22,
    }
  );

  rect(slide, M, 2.64, 2.2, 0.08, C.red);

  addText(
    slide,
    "Y tenía un defecto que dejaba un octavo de la jornada del laboratorio inutilizable, y un comprobante que repartía el RUT y el correo de cada estudiante que reservaba.",
    {
      x: M,
      y: 2.94,
      w: 7.3,
      h: 0.9,
      fontSize: 15,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(
    slide,
    "Ninguna de esas cuatro pruebas iba a encontrarlos nunca, porque comparaban el código contra lo que su autor había entendido.",
    {
      x: M,
      y: 3.98,
      w: 7.3,
      h: 0.7,
      fontSize: 15,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(
    slide,
    "Lo que los encontró no fue mirar con más atención, ni pedirle a más gente que mirara.",
    {
      x: M,
      y: 4.84,
      w: 7.3,
      h: 0.6,
      fontSize: 16,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  rect(slide, M, 5.58, 7.3, 0.84, ORO);
  addText(
    slide,
    "Fue aplicar cuatro pasos en un orden declarado, contra referencias que el proyecto no había escrito, y dejar constancia de hasta dónde se llegó.",
    {
      x: M + 0.3,
      y: 5.68,
      w: 6.8,
      h: 0.64,
      fontSize: 13,
      bold: true,
      color: C.white,
      valign: "mid",
      lineSpacingMultiple: 1.14,
    }
  );

  vrule(slide, 8.5, 1.32, 4.9, NAVY_RULE, 1);

  addKicker(slide, 8.9, 1.32, "Ticket de salida", C.gold, 3.6);
  addText(slide, "Una línea para cada una, antes de salir.", {
    x: 8.9,
    y: 1.6,
    w: 3.7,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.softBlue,
  });

  const ticket = [
    "¿Qué declaraste fuera del alcance de tu auditoría, y dónde quedó eso escrito?",
    "¿Cuál de tus hallazgos podría verificar alguien que no estuvo hoy, usando solo tu ficha?",
    "¿Qué encontró tu paso 3 que tu propio requisito no prohibía?",
  ];
  ticket.forEach((texto, i) => {
    const y = 2.06 + i * 1.16;
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
      fontSize: 11.2,
      color: C.white,
      lineSpacingMultiple: 1.14,
    });
  });

  addText(
    slide,
    "Próxima sesión: en el paso 2 se probaron los bloques 1, 7, 8 y 9. ¿Por qué esos? Porque pareció sensato mirar los bordes. Esa corazonada tiene nombre, método y norma.",
    {
      x: 8.9,
      y: 5.58,
      w: 3.71,
      h: 0.84,
      fontSize: 10.4,
      italic: true,
      color: C.gold,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

// ==================================================================== BUILD
slidePortada();
slideTresBarreras();
slideMapa();
slideDivisorB1();
slideDefinicion();
slideTresExigencias();
slideRevisionVsAuditoria();
slideCasoMontaje();
slideCasoConclusiones();
slideProductoOponible();
slidePreguntasB1();
slideDivisorB2();
slideLaAfirmacion();
slideCorreccionTorvalds();
slideLaSustitucion();
slideHeartbleed();
slideOjosInfinitos();
slideCurl();
slideQuedaEnPie();
slidePreguntasB2();
slideDivisorB3();
slideElOrden();
slideCincoPasos();
slidePasoCero();
slideElProyecto();
slidePasoUno();
slideTrampaDelVerde();
slidePasoDos();
slidePasoTresCumple();
slidePasoTresHallazgo();
slidePasoCuatro();
slideElHueco();
slideSintesisPasos();
slideCuandoTermina();
slidePreguntasB3();
slideDivisorB4();
slideCamposNorma();
slideDosCampos();
slideFichaEscrita();
slideInformeSecciones();
slideInformeCompleto();
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
