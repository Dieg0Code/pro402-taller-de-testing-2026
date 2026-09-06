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
  subject: "PRO402 · Clase 09",
  title: "Elegir los casos. Escribir la prueba.",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(
  __dirname,
  "..",
  "Clase-09-Elegir-Los-Casos.pptx"
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
//   navy  = la especificacion, el requisito, lo que se declara
//   gold  = la tecnica y la tabla que produce
//   red   = la clase que quedo sin representante, y el defecto que se cuela
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
// La firma visual de esta clase: la reducción.
// Todas las entradas -> clases -> representantes. Cada divisor marca en qué
// tramo de esa contracción trabaja el bloque que abre.
// ---------------------------------------------------------------------------

const ETAPAS = [
  "Todas las entradas",
  "Clases",
  "Límites",
  "Reglas combinadas",
];

function addTiraReduccion(slide, activa, opts = {}) {
  const y = opts.y || 5.62;
  const dark = opts.dark || false;
  const anchos = [4.6, 3.2, 2.2, 1.5];
  const gap = 0.28;
  let x = M;

  ETAPAS.forEach((etiqueta, i) => {
    const w = anchos[i];
    const viva = i === activa;
    const fondo = viva ? C.gold : dark ? NAVY_CHIP : C.softNeutral;
    const tinta = viva ? (dark ? C.navy : C.ink) : dark ? C.sand : C.slate;

    rect(slide, x, y, w, 0.46, fondo);
    addText(slide, etiqueta, {
      x: x + 0.18,
      y: y + 0.02,
      w: w - 0.36,
      h: 0.42,
      fontSize: viva ? 12 : 10.6,
      bold: viva,
      color: tinta,
      valign: "mid",
    });

    if (i < ETAPAS.length - 1) {
      arrow(slide, x + w + 0.04, y + 0.23, gap - 0.08, dark ? C.sand : C.slate, 1.1);
    }
    x += w + gap;
  });
}

// Divisor de bloque. La contracción manda, y la pregunta abre.
function slideDivisor(numero, titulo, pregunta, etapa) {
  const { slide } = createSlide("dark");

  addKicker(slide, M, 1.72, `Bloque ${numero} de 4`, C.gold, 3);

  addText(slide, titulo, {
    x: M,
    y: 2.1,
    w: 10.6,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 40,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.04,
  });

  rule(slide, M, 3.32, 3.4, C.gold, 2.4);

  addText(slide, pregunta, {
    x: M,
    y: 3.6,
    w: 10.2,
    h: 0.9,
    fontSize: 17,
    italic: true,
    color: C.softBlue,
    lineSpacingMultiple: 1.16,
  });

  addKicker(slide, M, 5.32, "Dónde estamos en la reducción", C.sand, 5);
  addTiraReduccion(slide, etapa, { y: 5.62, dark: true });

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

// Lámina de contraste: lo que tenía que aparecer en cada respuesta.
// Conserva el orden, la numeración y el color de la lámina de preguntas, para
// que cada fila se pueda comparar con la que se acaba de responder.
function slideRespuestas(bloque, titulo, respuestas) {
  const { slide } = createSlide("light");
  addHeader(slide, `Bloque ${bloque} · contraste`, titulo, "", false, {
    titleW: 10.3,
  });

  const COLORES = [ROJO, AZUL, ORO];
  const H = 1.5;

  respuestas.forEach(([etiqueta, respuesta, revela], i) => {
    const y = 2.0 + i * 1.62;
    const color = COLORES[i];

    rect(slide, M, y, CW, H, C.white);
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
    addText(slide, etiqueta.toUpperCase(), {
      x: M + 1.0,
      y: y + 0.14,
      w: CW - 1.36,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color,
      charSpacing: 1.2,
    });
    addText(slide, respuesta, {
      x: M + 1.0,
      y: y + 0.4,
      w: CW - 1.36,
      h: 0.52,
      fontSize: 14.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    rule(slide, M + 1.0, y + 1.0, CW - 1.36, C.border, 0.7);
    addText(slide, "LO QUE REVELA", {
      x: M + 1.0,
      y: y + 1.1,
      w: 1.8,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, revela, {
      x: M + 2.94,
      y: y + 1.08,
      w: CW - 4.08,
      h: 0.28,
      fontSize: 12,
      italic: true,
      color: C.ink,
    });
  });

  validateSlide(slide, pptx);
}

// ==================================================================== 01 PORTADA

function slidePortada() {
  const { slide } = createSlide("dark");

  addKicker(slide, M, 1.62, "Clase 09 · Unidad 02 · Miércoles 9 de septiembre", C.gold, 7.4);

  addText(slide, "Elegir los casos.", {
    x: M,
    y: 2.0,
    w: 9.6,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 54,
    bold: true,
    color: C.white,
  });
  addText(slide, "Escribir la prueba.", {
    x: M,
    y: 2.98,
    w: 9.6,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 54,
    bold: true,
    color: C.gold,
  });

  rule(slide, M, 4.16, 4.2, NAVY_RULE, 2.4);

  addText(
    slide,
    "Probar todo es imposible. Todo conjunto de pruebas es una muestra,\ny hay que poder decir qué representa y qué dejó fuera.",
    {
      x: M,
      y: 4.44,
      w: 9.8,
      h: 0.86,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  addKicker(slide, M, 5.62, "Lo que se recorre hoy", C.sand, 5);
  addTiraReduccion(slide, -1, { y: 5.92, dark: true });

  validateSlide(slide, pptx);
}

// ============================================== 02 LA PREGUNTA DE ENTRADA

function slidePreguntaDeEntrada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Para empezar",
    "Dos funciones. Una prueba. Una pregunta.",
    "No hay que resolverla todavía. Hay que comprobar si se puede responder sin ayuda de nadie.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 1.72,
    title: "El código que decide",
    code: [
      "def bloque_valido(bloque: int) -> bool:",
      "    return BLOQUE_MIN <= bloque < BLOQUE_MAX",
    ].join("\n"),
    lang: "python",
    fontSize: 11.4,
  });

  addCodePanel(slide, SH, {
    x: 6.98,
    y: 2.5,
    w: 5.63,
    h: 1.72,
    title: "La prueba que lo comprueba",
    code: [
      "def test_reserva_un_bloque_libre():",
      "    assert puede_reservar(0, 3, tomado=False) is True",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, M, 4.46, CW, 1.22, C.softBlue);
  rect(slide, M, 4.46, 0.07, 1.22, AZUL);
  addKicker(slide, M + 0.36, 4.66, "La pregunta", AZUL, 4);
  addText(
    slide,
    "¿Puedes explicar qué hace cada línea, y qué tendría que cambiar para que esa prueba falle?",
    {
      x: M + 0.36,
      y: 4.94,
      w: CW - 0.72,
      h: 0.6,
      fontSize: 20,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    }
  );

  addTakeaway(
    slide,
    "Si la respuesta no sale sola, no es un problema: las dos láminas siguientes la construyen entera.",
    { y: 5.94, h: 0.62 }
  );

  validateSlide(slide, pptx);
}

// ======================================= 03 EL PROYECTO SOBRE EL QUE SE TRABAJA

function slideElProyecto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Antes de responder",
    "De qué habla este código",
    "Un sistema de reserva del laboratorio. Estas cuatro reglas son todo lo que el proyecto tiene escrito.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 2.24,
    title: "REQUISITOS.md · el documento completo del proyecto",
    code: [
      "- La jornada se divide en bloques numerados del 1 al 8.",
      "- Un estudiante puede tener como maximo 3 reservas",
      "  activas por semana.",
      "- No se puede reservar un bloque que ya esta tomado.",
      "- Una reserva se puede cancelar hasta 2 horas antes",
      "  del inicio del bloque.",
    ].join("\n"),
    lang: "markdown",
    fontSize: 10.4,
  });

  addKicker(slide, 8.02, 2.5, "La jornada del laboratorio", C.ink, 4.6);
  for (let n = 1; n <= 8; n += 1) {
    const x = 8.02 + (n - 1) * 0.58;
    rect(slide, x, 2.82, 0.5, 0.5, C.softBlue);
    rect(slide, x, 2.82, 0.5, 0.05, AZUL);
    addText(slide, String(n), {
      x,
      y: 2.86,
      w: 0.5,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 17,
      bold: true,
      color: AZUL,
      align: "center",
      valign: "mid",
    });
  }
  addText(
    slide,
    "Un «bloque» es una franja horaria de la jornada. Reservar es pedir una de esas ocho franjas.",
    {
      x: 8.02,
      y: 3.48,
      w: 4.59,
      h: 0.5,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, 8.02, 4.06, 4.59, 0.68, C.warm);
  rect(slide, 8.02, 4.06, 0.06, 0.68, ORO);
  addText(slide, "Todo lo que se exija hoy tiene que salir de esas cuatro líneas.", {
    x: 8.34,
    y: 4.18,
    w: 4.1,
    h: 0.46,
    fontSize: 12.4,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });

  addTakeaway(
    slide,
    "Ese documento es la única referencia externa que existe. No hay otra fuente contra la cual comparar.",
    { y: 5.0, h: 0.6 }
  );

  addFuente(
    slide,
    M,
    5.84,
    "El proyecto se entrega ya ejecutado, con sus salidas registradas. Nadie queda detenido por el estado de su propio repositorio.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

// ========================================== 04 CÓMO SE LEE UNA LLAMADA

function slideComoSeLeeUnaLlamada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Antes de responder",
    "Qué significa cada valor de la llamada",
    "Un número suelto no dice nada. Los valores que se pasan son los argumentos; los nombres que los reciben en la firma son los parámetros.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.46,
    w: CW,
    h: 1.2,
    title: "La firma: la primera línea, que declara el nombre y qué recibe",
    code: [
      "def puede_reservar(reservas_de_la_semana: int, bloque: int, tomado: bool) -> bool:",
    ].join("\n"),
    lang: "python",
    fontSize: 11.6,
  });

  const partes = [
    [
      "0",
      "reservas_de_la_semana",
      "Cuántas reservas activas tiene ya esa persona esta semana. El requisito permite hasta 3.",
      AZUL,
      C.softBlue,
    ],
    [
      "3",
      "bloque",
      "Qué franja horaria está pidiendo. El requisito numera la jornada del 1 al 8.",
      ORO,
      C.warm,
    ],
    [
      "tomado=False",
      "tomado",
      "Si esa franja ya está ocupada por alguien. False significa que está libre.",
      VERDE,
      C.successSoft,
    ],
  ];

  partes.forEach(([valor, nombre, texto, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 3.92, 3.79, 1.66, fondo);
    rect(slide, x, 3.92, 3.79, 0.07, tinta);
    addText(slide, valor, {
      x: x + 0.3,
      y: 4.1,
      w: 3.2,
      h: 0.34,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 17,
      bold: true,
      color: tinta,
    });
    addText(slide, `ocupa el parámetro «${nombre}»`, {
      x: x + 0.3,
      y: 4.48,
      w: 3.2,
      h: 0.24,
      fontSize: 11,
      italic: true,
      color: C.slate,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 4.78,
      w: 3.2,
      h: 0.74,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  rect(slide, M, 5.78, CW, 0.86, C.navy);
  addText(
    slide,
    "«Una persona que hoy no tiene ninguna reserva pide el bloque 3, que está libre. ¿Se le permite?»",
    {
      x: M + 0.34,
      y: 5.84,
      w: CW - 0.68,
      h: 0.74,
      fontSize: 16,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

// ================================================ 05 LA CAPACIDAD QUE SE CONSERVA

function slideCapacidad() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Por qué importa",
    "Leer código no es lo mismo que saber escribirlo",
    "Un agente escribe la prueba en segundos. Lo que no delega nadie es decidir si esa prueba sirve.",
    false
  );

  const niveles = [
    [
      "Reconocer",
      "Ver una prueba y saber que es una prueba.",
      C.softNeutral,
      C.slate,
    ],
    [
      "Explicar",
      "Decir qué recibe, qué ejecuta, qué afirma y de dónde salió el resultado esperado.",
      C.softBlue,
      AZUL,
    ],
    [
      "Producir y corregir",
      "Escribirla desde cero, anticipar su resultado y arreglarla cuando el requisito cambia.",
      C.warm,
      ORO,
    ],
  ];

  niveles.forEach(([titulo, texto, fondo, tinta], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.58, 3.79, 1.86, fondo);
    rect(slide, x, 2.58, 3.79, 0.07, tinta);
    addText(slide, String(i + 1), {
      x: x + 0.3,
      y: 2.76,
      w: 0.6,
      h: 0.52,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color: tinta,
    });
    addText(slide, titulo, {
      x: x + 0.3,
      y: 3.32,
      w: 3.2,
      h: 0.3,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.68,
      w: 3.2,
      h: 0.66,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  arrow(slide, 4.42, 3.51, 0.24, C.slate, 1.6);
  arrow(slide, 8.49, 3.51, 0.24, C.slate, 1.6);

  rect(slide, M, 4.72, CW, 1.06, C.white);
  rect(slide, M, 4.72, 0.07, 1.06, ROJO);
  addKicker(slide, M + 0.36, 4.92, "El riesgo concreto", ROJO, 5);
  addText(
    slide,
    "Una suite generada puede terminar en verde y no comprobar nada de lo que el requisito exige.\nQuien solo reconoce código no tiene cómo notarlo; quien puede explicarlo, sí.",
    {
      x: M + 0.36,
      y: 5.18,
      w: CW - 0.72,
      h: 0.52,
      fontSize: 13.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "El objetivo de la sesión es llegar al nivel 3 en las tres técnicas que se enseñan.",
    { y: 6.04, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

// ============================================== 04 DE DÓNDE VIENE ESTA CLASE

function slideDeDondeViene() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El punto de partida",
    "Una corazonada que acertó",
    "En la auditoría del proyecto de reservas se probaron los bloques 1, 7, 8 y 9. Nadie supo decir por qué esos cuatro.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 5.5,
    h: 1.46,
    title: "Los valores que se probaron",
    code: ["bloques probados: 1, 7, 8, 9"].join("\n"),
    lang: "bash",
    fontSize: 12.4,
  });

  rect(slide, 6.42, 2.56, 6.19, 1.46, C.paleRed);
  rect(slide, 6.42, 2.56, 0.07, 1.46, ROJO);
  addKicker(slide, 6.76, 2.76, "La razón que se dio", ROJO, 4.6);
  addText(slide, "«Parecía sensato mirar los extremos del rango.»", {
    x: 6.76,
    y: 3.06,
    w: 5.5,
    h: 0.76,
    fontSize: 15,
    italic: true,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  addKicker(slide, M, 4.28, "Funcionó. Y aun así le faltan tres cosas", C.ink, 8);

  const faltas = [
    ["No se puede enseñar", "«Mira los extremos» no dice cuáles son los extremos de un correo, de una lista o de una fecha."],
    ["No se puede auditar", "Nadie puede comprobar que se aplicó completa, porque nunca se declaró hasta dónde llegaba."],
    ["No garantiza nada", "Acertó esta vez. Nada en el procedimiento explica por qué, ni permite esperar que se repita."],
  ];

  faltas.forEach(([titulo, texto], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 4.6, 3.79, 1.32, C.white);
    rect(slide, x, 4.6, 3.79, 0.06, ROJO);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.78,
      w: 3.24,
      h: 0.28,
      fontSize: 14,
      bold: true,
      color: ROJO,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 5.12,
      w: 3.24,
      h: 0.72,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(
    slide,
    "Una intuición que acierta sigue sin ser un método. Hoy esa corazonada recibe nombre, procedimiento y norma.",
    { y: 6.16, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

// ==================================================== 05 EL MAPA DE LA SESIÓN

function slideMapa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El recorrido",
    "Cuatro bloques, una sola idea aplicada sobre cuatro ejes",
    "Las tres técnicas no sirven para encontrar más casos. Sirven para justificar los que se dejan fuera.",
    false
  );

  const bloques = [
    ["1", "Por qué hay que elegir", "Cuántas entradas hay de verdad, y qué queda claro cuando se intenta recorrerlas todas.", AZUL, C.softBlue],
    ["2", "Partición de equivalencia", "Agrupar por el trato que se espera, y escribir esa tabla como prueba parametrizada.", ORO, C.warm],
    ["3", "Valores límite", "Los bordes de cada clase, y qué pasa cuando se los toma del código en vez del requisito.", ROJO, C.paleRed],
    ["4", "Tablas de decisión", "Reglas que se combinan, y cómo se lee lo que una prueba ajena realmente exige.", VERDE, C.successSoft],
  ];

  bloques.forEach(([num, titulo, texto, tinta, fondo], i) => {
    const y = 2.62 + i * 0.96;
    rect(slide, M, y, CW, 0.84, fondo);
    rect(slide, M, y, 0.06, 0.84, tinta);

    addText(slide, num, {
      x: M + 0.34,
      y: y + 0.16,
      w: 0.5,
      h: 0.52,
      fontFace: TYPOGRAPHY.display,
      fontSize: 27,
      bold: true,
      color: tinta,
    });
    addText(slide, titulo, {
      x: M + 1.02,
      y: y + 0.14,
      w: 3.5,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: M + 1.02,
      y: y + 0.46,
      w: 8.4,
      h: 0.28,
      fontSize: 12.4,
      color: C.ink,
    });
  });

  addFuente(
    slide,
    M,
    6.6,
    "Las tres técnicas están definidas en ISO/IEC/IEEE 29119-4:2021, cláusula 5.2, como técnicas basadas en especificación.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

// ============================================ 06 CÓMO SE LEE EL CÓDIGO AQUÍ

function slideComoSeLee() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Método de trabajo",
    "Cada vez que aparezca código: leer, predecir, comprobar",
    "La ejecución sirve para contrastar una predicción. No sirve para reemplazarla.",
    false
  );

  const pasos = [
    ["Leer", "Qué recibe la función, qué condiciones evalúa y qué devuelve.", AZUL, C.softBlue],
    ["Predecir", "Decir en voz alta el resultado antes de ejecutar. Escribirlo si hace falta.", ORO, C.warm],
    ["Comprobar", "Ejecutar y comparar con lo predicho. La sorpresa es el hallazgo.", VERDE, C.successSoft],
  ];

  pasos.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.62, 3.79, 1.6, fondo);
    rect(slide, x, 2.62, 3.79, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.84,
      w: 3.2,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.28,
      w: 3.2,
      h: 0.8,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    if (i < 2) arrow(slide, x + 3.85, 3.42, 0.16, C.slate, 1.6);
  });

  rect(slide, M, 4.52, CW, 1.2, C.white);
  rect(slide, M, 4.52, 0.07, 1.2, ROJO);
  addKicker(slide, M + 0.36, 4.72, "Por qué no basta con ejecutar", ROJO, 6);
  addText(
    slide,
    "Ejecutar sin haber predicho convierte cualquier salida en la respuesta correcta: se lee el resultado y se acepta.\nLa predicción es lo que permite que la ejecución pueda contradecir a alguien.",
    {
      x: M + 0.36,
      y: 4.98,
      w: CW - 0.72,
      h: 0.62,
      fontSize: 13.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "En este deck, el paso activo aparece marcado en la esquina de cada lámina de código.",
    { y: 5.98, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

// ============================== LA CUARTA PARTE DE TODA PRUEBA: EL ORÁCULO

function slideElOraculoDefinido() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el nombre de lo que faltaba",
    "La cuarta parte de toda prueba",
    "Tres partes son fáciles de montar. La cuarta es la que decide, y es la que da trabajo.",
    false
  );

  const partes = [
    ["La entrada", "bloque = 8", "Los valores con los que se ejecuta.", C.slate, C.white],
    ["El programa", "puede_reservar()", "El código que se está probando.", C.slate, C.white],
    ["La salida", "False", "Lo que el programa devolvió.", C.slate, C.white],
    [
      "Lo que decide si esa salida es correcta",
      "se esperaba True",
      "No sale del programa. Tiene que venir de otra parte.",
      ORO,
      C.warm,
    ],
  ];

  partes.forEach(([titulo, valor, texto, tinta, fondo], i) => {
    const w = 2.87;
    const x = M + i * (w + 0.14);
    const fuerte = i === 3;
    rect(slide, x, 2.5, w, 1.5, fondo);
    rect(slide, x, 2.5, w, fuerte ? 0.07 : 0.05, tinta);
    addText(slide, String(i + 1), {
      x: x + 0.24,
      y: 2.64,
      w: 0.4,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: tinta,
    });
    addText(slide, titulo, {
      x: x + 0.68,
      y: 2.66,
      w: w - 0.92,
      h: 0.44,
      fontSize: fuerte ? 12.4 : 13.4,
      bold: true,
      color: fuerte ? C.ink : C.ink,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, valor, {
      x: x + 0.24,
      y: 3.16,
      w: w - 0.48,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 13.5,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.24,
      y: 3.5,
      w: w - 0.48,
      h: 0.42,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    if (i < 3) arrow(slide, x + w + 0.01, 3.25, 0.12, C.slate, 1.3);
  });

  addKicker(slide, M, 4.16, "Esa cuarta parte tiene dos nombres, según quién la mire", C.ink, 8);

  const nombres = [
    [
      "Oráculo de prueba",
      "Como se le llama en la literatura de investigación. Conseguir uno confiable es «el problema del oráculo».",
      AZUL,
      C.softBlue,
    ],
    [
      "Base de prueba",
      "Como la nombra la norma: «información usada como base para diseñar e implementar los casos de prueba».",
      ORO,
      C.warm,
    ],
  ];

  nombres.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.03;
    rect(slide, x, 4.48, 5.86, 1.16, fondo);
    rect(slide, x, 4.48, 0.07, 1.16, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 4.64,
      w: 5.2,
      h: 0.3,
      fontSize: 15.5,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 4.98,
      w: 5.2,
      h: 0.56,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addFuente(
    slide,
    M + 6.03,
    5.72,
    "ISO/IEC/IEEE 29119-3:2021, cláusula 3.7 · traducción del original en inglés",
    { w: 5.6 }
  );

  addTakeaway(
    slide,
    "En el barrido recién hecho, el oráculo fue segun_el_requisito(). Sin él, las 64 salidas son 64 números sin veredicto.",
    { y: 6.14, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

// ================================================================= BLOQUE 1

function slideDivisorB1() {
  slideDivisor(
    1,
    "Por qué hay que elegir",
    "¿Cuántas entradas distintas acepta de verdad una función de cuatro líneas, y qué pasa si se intentan todas?",
    0
  );
}

function slideSuiteHeredada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el punto de partida",
    "Cuatro pruebas, todas en verde",
    "Una suite es el conjunto de pruebas de un proyecto. El de reservas llegó con esta, escrita por quien conocía el código.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 0);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.5,
    h: 2.78,
    title: "tests/test_reservas.py",
    code: [
      "def test_reserva_un_bloque_libre():",
      "    assert puede_reservar(0, 3, tomado=False) is True",
      "",
      "def test_no_reserva_un_bloque_tomado():",
      "    assert puede_reservar(0, 3, tomado=True) is False",
      "",
      "def test_respeta_el_maximo_semanal():",
      "    assert puede_reservar(3, 3, tomado=False) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  addTerminalPanel(slide, SH, {
    x: 8.42,
    y: 2.5,
    w: 4.19,
    h: 1.62,
    title: "La ejecución",
    fontSize: 10,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "....                    [100%]", kind: "muted" },
      { text: "4 passed in 0.04s", kind: "success" },
    ],
  });

  rect(slide, 8.42, 4.32, 4.19, 0.96, C.softBlue);
  rect(slide, 8.42, 4.32, 0.07, 0.96, AZUL);
  addText(
    slide,
    "Se lee: reservas que ya tiene, bloque que pide, si está tomado.\nNada aquí está escrito de mala fe: es una suite razonable, y pasa.",
    {
      x: 8.76,
      y: 4.44,
      w: 3.6,
      h: 0.72,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Esta suite convive con un defecto que deja un octavo de la jornada del laboratorio inutilizable.",
    { y: 5.66, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

function slideSiempreElTres() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el dato",
    "Las tres pruebas usan el mismo bloque",
    "El segundo argumento de las tres llamadas muestra lo que el verde no dejaba ver.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.9,
    h: 1.94,
    title: "puede_reservar(reservas, bloque, tomado) · el segundo argumento",
    code: [
      "puede_reservar(0, 3, tomado=False)",
      "puede_reservar(0, 3, tomado=True)",
      "puede_reservar(3, 3, tomado=False)",
    ].join("\n"),
    lang: "python",
    fontSize: 11.6,
  });

  addKicker(slide, 6.82, 2.5, "Los ocho bloques que declara el requisito", C.ink, 5.8);

  const bloques = [1, 2, 3, 4, 5, 6, 7, 8];
  bloques.forEach((n, i) => {
    const x = 6.82 + i * 0.73;
    const probado = n === 3;
    rect(slide, x, 2.84, 0.62, 0.62, probado ? C.successSoft : C.paleRed);
    rect(slide, x, 2.84, 0.62, 0.05, probado ? VERDE : ROJO);
    addText(slide, String(n), {
      x,
      y: 2.9,
      w: 0.62,
      h: 0.52,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: probado ? VERDE : ROJO,
      align: "center",
      valign: "mid",
    });
  });

  addText(slide, "Probado: 1 de 8.  Sin ejecutar nunca: 7 de 8.", {
    x: 6.82,
    y: 3.62,
    w: 5.8,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: ROJO,
  });

  addText(
    slide,
    "El defecto vive en el bloque 8, que es una de las siete casillas que ninguna prueba tocó.",
    {
      x: 6.82,
      y: 3.98,
      w: 5.8,
      h: 0.46,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, M, 4.72, CW, 1.06, C.white);
  rect(slide, M, 4.72, 0.07, 1.06, AZUL);
  addKicker(slide, M + 0.36, 4.92, "Lo que esto no significa", AZUL, 5);
  addText(
    slide,
    "No son tres pruebas idénticas: una comprueba un bloque ocupado y otra el máximo semanal.\nLo que falta es variedad en una dimensión concreta, y por eso hay que decir siempre qué parámetro se está clasificando.",
    {
      x: M + 0.36,
      y: 5.18,
      w: CW - 0.72,
      h: 0.54,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Cuatrocientas pruebas sobre ese mismo valor habrían sido igual de ciegas. La cantidad no es la medida.",
    { y: 6.04, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideLeerLaFuncion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · leer y predecir",
    "Antes de medir nada: ¿cuántas entradas acepta?",
    "Ya se sabe qué significa cada argumento. Falta cuántos valores distintos admite cada uno.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.6,
    h: 2.2,
    title: "src/reservas.py",
    code: [
      "def puede_reservar(reservas_de_la_semana: int,",
      "                   bloque: int, tomado: bool) -> bool:",
      "    if not bloque_valido(bloque):",
      "        return False",
      "    if tomado:",
      "        return False",
      "    return reservas_de_la_semana < MAX_POR_SEMANA",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  const preguntas = [
    ["reservas_de_la_semana: int", "El requisito habla de 0, 1, 2 o 3. La firma no dice eso.", AZUL],
    ["bloque: int", "No dice «del 1 al 8». Dice «cualquier entero».", ROJO],
    ["tomado: bool", "Dos valores. Este sí está acotado por su tipo.", VERDE],
  ];

  preguntas.forEach(([titulo, texto, tinta], i) => {
    const y = 2.5 + i * 0.76;
    rect(slide, 7.52, y, 5.09, 0.66, C.white);
    rect(slide, 7.52, y, 0.06, 0.66, tinta);
    addText(slide, titulo, {
      x: 7.82,
      y: y + 0.08,
      w: 4.6,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 12,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: 7.82,
      y: y + 0.34,
      w: 4.6,
      h: 0.26,
      fontSize: 11.6,
      color: C.ink,
    });
  });

  rect(slide, M, 4.96, CW, 0.86, C.softBlue);
  rect(slide, M, 4.96, 0.07, 0.86, AZUL);
  addText(
    slide,
    "Predicción antes de ejecutar: ¿el conjunto de entradas posibles es de decenas, de millones, o no tiene tope?",
    {
      x: M + 0.36,
      y: 5.1,
      w: CW - 0.72,
      h: 0.58,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "La anotación de tipo describe un contrato; no valida entradas durante la ejecución.",
    { y: 6.08, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideLaMedicion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · comprobar",
    "Tres dominios distintos, tres respuestas distintas",
    "El dominio de un parámetro es el conjunto de valores que puede recibir. Aquí hay tres candidatos, y no coinciden.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: CW,
    h: 2.16,
    title: "Medición ejecutada sobre la función real · Python 3.12.12",
    fontSize: 10.4,
    lines: [
      { prompt: ">", text: "uv run python medir_espacio.py" },
      { text: "costo medido de un caso: 435 nanosegundos" },
      { text: "solo lo que el requisito declara        64   27.8 microsegundos", kind: "success" },
      { text: "si los enteros fueran de 32 bits   3.7e19   508,743 anios" },
      { text: "los enteros de Python no tienen tope  infinito" },
    ],
  });

  const filas = [
    ["Lo que el requisito declara", "8 bloques × 4 cantidades × 2 estados = 64 combinaciones. Abarcable por completo.", VERDE, C.successSoft],
    ["Lo que la firma acepta, acotada", "Con enteros de 32 bits ya son más de medio millón de años.", ORO, C.warm],
    ["Lo que la firma acepta de verdad", "Los enteros de Python no tienen tope. No es un conjunto grande: es infinito.", ROJO, C.paleRed],
  ];

  filas.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 4.82, 3.79, 1.18, fondo);
    rect(slide, x, 4.82, 3.79, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.98,
      w: 3.24,
      h: 0.26,
      fontSize: 12.6,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 5.28,
      w: 3.24,
      h: 0.62,
      fontSize: 11.8,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addFuente(
    slide,
    M,
    6.16,
    "El número exacto depende de la máquina donde se mida; el orden de magnitud, no. En el mismo proyecto, comprobante() acepta un conjunto de 194 cifras.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideElOraculo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el experimento incómodo",
    "Si son solo 64, ¿por qué no probarlas todas?",
    "Conviene intentarlo antes de descartarlo. Hace falta escribir aparte qué debe salir.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 0);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 6.05,
    h: 1.72,
    title: "La regla, leída del requisito y escrita aparte",
    code: [
      "def segun_el_requisito(reservas, bloque, tomado):",
      "    return 1 <= bloque <= 8 and not tomado and reservas < 3",
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  addCodePanel(slide, SH, {
    x: 6.98,
    y: 2.54,
    w: 5.63,
    h: 1.72,
    title: "El barrido completo del dominio declarado",
    code: [
      "for r, b, t in product(range(4), range(1, 9), (False, True)):",
      "    if puede_reservar(r, b, t) != segun_el_requisito(r, b, t):",
      "        desacuerdos.append((r, b, t))",
    ].join("\n"),
    lang: "python",
    fontSize: 8.8,
  });

  rect(slide, M, 4.5, CW, 1.24, C.softBlue);
  rect(slide, M, 4.5, 0.07, 1.24, AZUL);
  addKicker(slide, M + 0.36, 4.7, "Lo que hace posible el barrido", AZUL, 6);
  addText(
    slide,
    "El barrido no compara la función consigo misma: la compara contra la regla escrita aparte, leída del documento.\nSin esa segunda expresión de la regla, las 64 salidas no significan nada. Eso ya tiene nombre: es la base de prueba.",
    {
      x: M + 0.36,
      y: 4.98,
      w: CW - 0.72,
      h: 0.64,
      fontSize: 13.2,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Generar las entradas es la parte fácil. El trabajo difícil siempre fue saber qué debía salir.",
    { y: 6.0, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideLasSesentaYCuatro() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · comprobar",
    "Funcionó: tres desacuerdos, sin ninguna intuición",
    "Veintiocho microsegundos encuentran lo que la suite en verde no encontró nunca.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 7.3,
    h: 2.72,
    title: "Barrido del dominio declarado",
    fontSize: 10,
    lines: [
      { prompt: ">", text: "uv run python barrido_declarado.py" },
      { text: "combinaciones recorridas: 64" },
      { text: "desacuerdos encontrados : 3", kind: "error" },
      { text: "" },
      { text: "reservas=0 bloque=8 tomado=False -> False, se esperaba True", kind: "error" },
      { text: "reservas=1 bloque=8 tomado=False -> False, se esperaba True", kind: "error" },
      { text: "reservas=2 bloque=8 tomado=False -> False, se esperaba True", kind: "error" },
    ],
  });

  rect(slide, 8.22, 2.52, 4.39, 1.28, C.paleRed);
  rect(slide, 8.22, 2.52, 0.07, 1.28, ROJO);
  addKicker(slide, 8.56, 2.72, "El mismo valor, tres veces", ROJO, 3.8);
  addText(slide, "bloque = 8", {
    x: 8.56,
    y: 3.0,
    w: 3.7,
    h: 0.4,
    fontFace: TYPOGRAPHY.display,
    fontSize: 26,
    bold: true,
    color: ROJO,
  });
  addText(slide, "El requisito lo incluye. El código lo excluye.", {
    x: 8.56,
    y: 3.44,
    w: 3.7,
    h: 0.26,
    fontSize: 11.6,
    color: C.ink,
  });

  rect(slide, 8.22, 3.94, 4.39, 1.3, C.successSoft);
  rect(slide, 8.22, 3.94, 0.07, 1.3, VERDE);
  addText(
    slide,
    "Ninguna corazonada intervino. Se recorrió el conjunto entero y se comparó cada salida contra la regla escrita.",
    {
      x: 8.56,
      y: 4.16,
      w: 3.7,
      h: 0.9,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Entonces, ¿por qué no es esta la respuesta del curso? Por dos razones, y las dos importan.",
    { y: 5.62, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

function slideDosRazones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el límite del barrido",
    "Por qué recorrerlo todo no generaliza",
    "El barrido exhaustivo no es inútil: sirve donde el dominio es pequeño, discreto y está declarado.",
    false
  );

  const razones = [
    [
      "Necesita un oráculo por cada caso",
      "Las 64 salidas solo significan algo porque existe la regla escrita aparte. Alguien tuvo que leer el requisito y traducirlo. Ese trabajo no lo ahorra ninguna máquina, y es el mismo que haría falta para 64 millones de casos.",
      ROJO,
      C.paleRed,
    ],
    [
      "No sobrevive a un parámetro más",
      "El dominio es abarcable porque los tres parámetros son acotados y discretos. Basta agregar la fecha o el nombre del estudiante para que las 64 combinaciones se conviertan en un número de 194 cifras.",
      ORO,
      C.warm,
    ],
  ];

  razones.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.14;
    rect(slide, x, 2.56, 5.86, 2.24, fondo);
    rect(slide, x, 2.56, 5.86, 0.07, tinta);
    addText(slide, String(i + 1), {
      x: x + 0.32,
      y: 2.76,
      w: 0.6,
      h: 0.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color: tinta,
    });
    addText(slide, titulo, {
      x: x + 0.32,
      y: 3.3,
      w: 5.2,
      h: 0.3,
      fontSize: 15.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 3.68,
      w: 5.2,
      h: 1.0,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 5.06, CW, 0.92, C.white);
  rect(slide, M, 5.06, 0.07, 0.92, AZUL);
  addText(
    slide,
    "Además, este proyecto tiene un segundo defecto que solo aparece con un bloque fuera de la jornada, es decir, fuera de las 64:\nese barrido tampoco lo habría encontrado.",
    {
      x: M + 0.36,
      y: 5.22,
      w: CW - 0.72,
      h: 0.6,
      fontSize: 13,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "En todos los demás casos hay que elegir. La pregunta pasa a ser con qué argumento.",
    { y: 6.2, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideDijkstraFrase() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la cita heredada",
    "La frase más citada de la historia del testing",
    "",
    false
  );

  addCita(
    slide,
    M,
    2.16,
    CW,
    0.94,
    "Program testing can be used to show the presence of bugs, but never to show their absence!",
    { accent: AZUL, fontSize: 16 }
  );

  addCita(
    slide,
    M,
    3.24,
    CW,
    0.94,
    "El testing de programas puede usarse para mostrar la presencia de errores, pero nunca para mostrar su ausencia.",
    { accent: C.slate, fill: C.softNeutral, fontSize: 16 }
  );

  addFuente(
    slide,
    M,
    4.36,
    "Edsger W. Dijkstra, «Notes on Structured Programming», 1970 · traducción del original en inglés",
    { w: 8 }
  );

  rect(slide, M, 4.82, CW, 1.14, C.paleRed);
  rect(slide, M, 4.82, 0.07, 1.14, ROJO);
  addKicker(slide, M + 0.36, 5.02, "Lo que el documento trae encima, y las citas borran", ROJO, 7);
  addText(slide, "Corollary of the first part of this section:", {
    x: M + 0.36,
    y: 5.3,
    w: CW - 0.72,
    h: 0.44,
    fontSize: 19,
    bold: true,
    italic: true,
    color: C.ink,
  });

  addTakeaway(
    slide,
    "Es un corolario. Un corolario se deduce de algo anterior: la pregunta es de qué.",
    { y: 6.18, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideDijkstraMultiplicador() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · de qué es corolario",
    "El mismo cálculo que se acaba de hacer, en 1970",
    "Dijkstra se pregunta cómo se comprueba que un circuito multiplicador de dos enteros de 27 bits es correcto.",
    false
  );

  addCita(
    slide,
    M,
    2.54,
    CW,
    1.5,
    "The naive answer to this is: «the number of different multiplications this multiplier is claimed to perform correctly is finite, viz. 2^54, so let us try them all.» But, reasonable as this answer may seem, it is not, for although a single multiplication took only some tens of microseconds, the total time needed would add up to more than 10 000 years!",
    { accent: AZUL, fontSize: 12.4, valign: "mid" }
  );

  addCita(
    slide,
    M,
    4.18,
    CW,
    1.5,
    "La respuesta ingenua es: «la cantidad de multiplicaciones distintas que este multiplicador dice ejecutar correctamente es finita, a saber 2^54, así que probémoslas todas». Pero, por razonable que parezca, no lo es, porque aunque una sola multiplicación tomaba apenas algunas decenas de microsegundos, el tiempo total necesario sumaría más de 10 000 años.",
    { accent: C.slate, fill: C.softNeutral, fontSize: 12.4, valign: "mid" }
  );

  addFuente(
    slide,
    M,
    5.86,
    "Edsger W. Dijkstra, «Notes on Structured Programming», sección «On the reliability of mechanisms» · traducción del original en inglés",
    { w: 11.6 }
  );

  addTakeaway(
    slide,
    "La frase célebre no es un veredicto sobre el testing: es la conclusión de una aritmética de tiempo.",
    { y: 6.28, h: 0.56 }
  );

  validateSlide(slide, pptx);
}

function slideAuditarElNumero() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · auditar la cifra",
    "El número de Dijkstra, comprobado",
    "Toda cifra heredada se verifica antes de repetirla, venga de quien venga.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 7.3,
    h: 2.44,
    title: "2^54 multiplicaciones, a distintas velocidades",
    fontSize: 10,
    lines: [
      { text: "2^54 = 18,014,398,509,481,984 multiplicaciones" },
      { text: "  a 10 microsegundos ->      5,712 anios", kind: "muted" },
      { text: "  a 20 microsegundos ->     11,425 anios", kind: "success" },
      { text: "  a 30 microsegundos ->     17,137 anios", kind: "success" },
      { text: "  a 50 microsegundos ->     28,562 anios", kind: "muted" },
    ],
  });

  rect(slide, 8.22, 2.52, 4.39, 1.16, C.successSoft);
  rect(slide, 8.22, 2.52, 0.07, 1.16, VERDE);
  addKicker(slide, 8.56, 2.72, "Veredicto", VERDE, 3.8);
  addText(slide, "La aritmética está bien hecha.", {
    x: 8.56,
    y: 3.0,
    w: 3.7,
    h: 0.5,
    fontSize: 14.5,
    bold: true,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });

  rect(slide, 8.22, 3.82, 4.39, 1.14, C.warm);
  rect(slide, 8.22, 3.82, 0.07, 1.14, ORO);
  addText(
    slide,
    "«Algunas decenas de microsegundos» sitúa el cálculo entre 11.000 y 17.000 años.",
    {
      x: 8.56,
      y: 4.0,
      w: 3.7,
      h: 0.82,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addTakeaway(
    slide,
    "Primera cifra heredada del módulo que sale intacta de una auditoría. Lo que no sobrevive es la lectura de la frase.",
    { y: 5.34, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

function slideMuestreoYClases() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · lo que sí dijo",
    "Dos oraciones después están las dos palabras de hoy",
    "",
    false
  );

  addCita(
    slide,
    M,
    2.14,
    CW,
    1.16,
    "As long as the multiplier is considered as a black box, the only thing we can do is «testing by sampling»... Whole classes of in some sense «critical» multiplications may remain untested.",
    { accent: AZUL, fontSize: 12.8 }
  );

  addCita(
    slide,
    M,
    3.42,
    CW,
    1.16,
    "Mientras el multiplicador se considere una caja negra, lo único que podemos hacer es «probar por muestreo»... Clases enteras de multiplicaciones en algún sentido «críticas» pueden quedar sin probar.",
    { accent: C.slate, fill: C.softNeutral, fontSize: 12.8 }
  );

  const palabras = [
    ["Probar por muestreo", "Toda suite es una muestra de un conjunto que no se puede recorrer.", AZUL, C.softBlue],
    ["Clases", "El peligro del muestreo es que queden grupos enteros sin ningún representante.", ORO, C.warm],
  ];

  palabras.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.14;
    rect(slide, x, 4.78, 5.86, 1.06, fondo);
    rect(slide, x, 4.78, 5.86, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 4.94,
      w: 5.2,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 5.28,
      w: 5.2,
      h: 0.46,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addFuente(
    slide,
    M,
    5.96,
    "Mismo párrafo del documento original · traducción del original en inglés",
    { w: 7 }
  );

  addTakeaway(
    slide,
    "Las técnicas de hoy son la respuesta a la segunda mitad de esa frase, no a la primera.",
    { y: 6.3, h: 0.54 }
  );

  validateSlide(slide, pptx);
}

function slideTensionAbierta() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Bloque 1 · una discusión que sigue abierta",
    "Dijkstra propone mirar hacia adentro",
    "",
    true
  );

  addCita(
    slide,
    M,
    2.2,
    CW,
    1.06,
    "Siendo imposible una demostración convincente de corrección mientras el mecanismo se considere una caja negra, nuestra única esperanza está en no considerarlo una caja negra.",
    { accent: C.gold, fill: NAVY_CHIP, color: C.white, fontSize: 14 }
  );

  addFuente(slide, M, 3.4, "Traducción del original en inglés", {
    w: 6,
    color: C.gold,
    textColor: C.sand,
  });

  const lados = [
    ["Lo que propone Dijkstra", "Tomar en cuenta la estructura del programa: mirar sus decisiones y sus ramas.", C.gold],
    ["Lo que hacen las tres técnicas de hoy", "Ninguna mira el código. Las tres se derivan de la especificación y de nada más.", C.softBlue],
  ];

  lados.forEach(([titulo, texto, tinta], i) => {
    const x = M + i * 6.14;
    rect(slide, x, 3.86, 5.86, 1.5, NAVY_CHIP);
    rect(slide, x, 3.86, 5.86, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 4.08,
      w: 5.2,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 4.44,
      w: 5.2,
      h: 0.72,
      fontSize: 13,
      color: C.white,
      lineSpacingMultiple: 1.18,
    });
  });

  addText(
    slide,
    "La industria no le hizo caso, o le hizo caso a medias. Las dos posturas se ponen sobre la mesa en la sesión siguiente,\ncuando aparezca lo que una prueba recorre dentro del programa.",
    {
      x: M,
      y: 5.6,
      w: CW,
      h: 0.66,
      fontSize: 14,
      color: C.softBlue,
      align: "center",
      lineSpacingMultiple: 1.18,
    }
  );

  validateSlide(slide, pptx);
}

function slideTodaSuiteEsMuestra() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el resultado",
    "Cambia la pregunta que se le hace a una suite",
    "«¿Cuántas pruebas tienes?» no tiene respuesta buena: cuatro pruebas en verde probaron un solo valor.",
    false
  );

  rect(slide, M, 2.54, CW, 0.78, C.navy);
  addText(
    slide,
    "Toda suite de pruebas es una muestra de un conjunto que no se puede recorrer.",
    {
      x: M + 0.34,
      y: 2.58,
      w: CW - 0.68,
      h: 0.7,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  const preguntas = [
    [
      "¿Qué representa esta muestra?",
      "Poder nombrar los grupos de entradas que la suite cubre, y señalar qué prueba representa a cada grupo.",
      AZUL,
      C.softBlue,
    ],
    [
      "¿Qué quedó fuera, y por qué?",
      "Poder nombrar los grupos que se decidió no cubrir, con el argumento de esa decisión escrito.",
      ORO,
      C.warm,
    ],
  ];

  preguntas.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.14;
    rect(slide, x, 3.6, 5.86, 1.36, fondo);
    rect(slide, x, 3.6, 5.86, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 3.82,
      w: 5.2,
      h: 0.32,
      fontSize: 16,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 4.22,
      w: 5.2,
      h: 0.66,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 5.22, CW, 1.04, C.white);
  rect(slide, M, 5.22, 0.07, 1.04, ROJO);
  addKicker(slide, M + 0.36, 5.4, "Una suite que no responde la segunda", ROJO, 6);
  addText(
    slide,
    "No está incompleta: está sin justificar. Es peor, porque cuando aparece un problema nadie sabe dónde no se miró.",
    {
      x: M + 0.36,
      y: 5.68,
      w: CW - 0.72,
      h: 0.44,
      fontSize: 13.4,
      color: C.ink,
    }
  );

  addFuente(
    slide,
    M,
    6.46,
    "ISO/IEC/IEEE 29119-4:2021, cláusula 3.49: un caso de prueba es un conjunto de precondiciones, entradas y resultados esperados.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideElAgente() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la era de los agentes",
    "Quinientas pruebas en veinte segundos",
    "Es un cambio real. Conviene decir con precisión qué cambia y qué no.",
    false
  );

  const columnas = [
    [
      "Lo que sí cambia",
      "El costo de la muestra",
      "Escribir muchos casos dejó de ser caro. Eso permite cubrir clases que antes se dejaban fuera por presupuesto y no por criterio. Es una mejora genuina.",
      VERDE,
      C.successSoft,
    ],
    [
      "Lo que no cambia",
      "La representatividad de la muestra",
      "Quinientos casos extraídos de la misma región del espacio de entradas siguen siendo una región. Cuatro pruebas y un valor pueden ser cuatrocientas pruebas y un valor.",
      ROJO,
      C.paleRed,
    ],
  ];

  columnas.forEach(([kicker, titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.14;
    rect(slide, x, 2.46, 5.86, 1.96, fondo);
    rect(slide, x, 2.46, 5.86, 0.07, tinta);
    addKicker(slide, x + 0.32, 2.64, kicker, tinta, 5);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 2.9,
      w: 5.2,
      h: 0.34,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 3.32,
      w: 5.2,
      h: 0.94,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 4.58, CW, 0.9, C.white);
  rect(slide, M, 4.58, 0.07, 0.9, AZUL);
  addText(
    slide,
    "Las magnitudes que un agente puede optimizar directo —cuántas pruebas, cuántas líneas ejercitadas— son justamente\nlas que no dicen nada sobre qué grupos de entradas quedaron sin ninguna prueba. Las dos suben sin cubrir un grupo nuevo.",
    {
      x: M + 0.36,
      y: 4.74,
      w: CW - 0.72,
      h: 0.62,
      fontSize: 13,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 5.62,
    w: CW,
    h: 1.32,
    title: "La regla operativa que sale de aquí",
    code: [
      "Antes de pedir pruebas, se decide y se escribe que grupos hay que cubrir.",
      "Despues se pide que los completen, y se revisa contra esa lista escrita.",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.2,
  });

  validateSlide(slide, pptx);
}

function slidePreguntasB1() {
  slidePreguntas(1, "Preguntas para llevarse del Bloque 1", [
    [
      "El barrido de las 64 combinaciones encontró el defecto sin ninguna técnica de diseño. ¿Qué impide usarlo siempre, y cuál de esos impedimentos seguiría existiendo aunque las máquinas fueran mil veces más rápidas?",
      "Una de las dos razones es de tamaño; la otra no depende de la velocidad de nada.",
    ],
    [
      "La suite del proyecto probó siempre el bloque 3 y terminó en verde. ¿Qué grupo de valores quedó sin ningún representante, y por qué el verde no lo delataba?",
      "Mira la casilla donde estaba el defecto y pregúntate qué prueba habría tenido que ejecutarla.",
    ],
    [
      "Un agente puede multiplicar por cien las pruebas de un proyecto en un minuto. ¿Qué habría que entregarle para que esas pruebas cubran grupos nuevos en vez de repetir el que ya estaba cubierto?",
      "La regla operativa de la lámina anterior dice qué va primero y qué va después.",
    ],
  ]);
}

function slideRespuestasB1() {
  slideRespuestas(1, "Lo que tenía que aparecer en tu respuesta", [
    [
      "Los dos impedimentos, y cuál no depende de la máquina",
      "El tamaño del dominio y la necesidad de un oráculo por caso. El segundo sobrevive a cualquier velocidad.",
      "Escribir qué debe salir cuesta lo mismo para 64 casos que para 64 millones.",
    ],
    [
      "El grupo de valores sin ninguna prueba, y por qué el verde callaba",
      "Los bordes de la jornada, el 1 y el 8: ninguna prueba los ejecutó. El verde solo informa de los valores que sí se ejecutaron.",
      "Una suite en verde no afirma nada sobre lo que no probó: su silencio no es una aprobación.",
    ],
    [
      "Lo que hay que entregarle antes de pedirle nada",
      "La lista de grupos ya escrita, con el resultado esperado de cada uno sacado del requisito y no del código.",
      "Un agente sin esa lista saca sus casos del código, y el código ya contiene el defecto.",
    ],
  ]);
}

// ================================================================= BLOQUE 2

function slideDivisorB2() {
  slideDivisor(
    2,
    "Partición de equivalencia",
    "¿Con qué argumento se agrupan valores distintos para probar solo uno de cada grupo?",
    1
  );
}

function slideQueEsUnaParticion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la idea, antes del nombre",
    "Partir las entradas en grupos, y probar uno de cada grupo",
    "Las entradas posibles no se pueden recorrer. Sí se pueden agrupar, si hay un argumento para agruparlas.",
    false
  );

  rect(slide, M, 2.46, CW, 0.5, C.navy);
  addText(
    slide,
    "Todas las entradas posibles del parámetro «bloque»: cualquier número entero",
    {
      x: M + 0.34,
      y: 2.5,
      w: CW - 0.68,
      h: 0.42,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addText(slide, "se parten en grupos", {
    x: M,
    y: 3.06,
    w: CW,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
    align: "center",
  });

  const grupos = [
    ["Números por debajo de la jornada", "-8, -1, 0 …", "-5", ROJO, C.paleRed],
    ["Números de la jornada", "1, 2, 3 … 8", "4", VERDE, C.successSoft],
    ["Números por encima de la jornada", "9, 10, 47 …", "12", ROJO, C.paleRed],
  ];

  grupos.forEach(([titulo, ejemplos, rep_, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 3.36, 3.79, 1.02, fondo);
    rect(slide, x, 3.36, 3.79, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 3.5,
      w: 3.3,
      h: 0.26,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, ejemplos, {
      x: x + 0.26,
      y: 3.8,
      w: 2.1,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 11.4,
      color: C.slate,
    });
    rect(slide, x + 2.6, 3.76, 0.95, 0.46, tinta);
    addText(slide, rep_, {
      x: x + 2.6,
      y: 3.78,
      w: 0.95,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, "se prueba este", {
      x: x + 2.6,
      y: 4.17,
      w: 0.95,
      h: 0.17,
      fontSize: 8,
      italic: true,
      color: C.slate,
      align: "center",
    });
  });

  addKicker(slide, M, 4.68, "Tres palabras que no significan lo mismo", C.ink, 7);

  const vocab = [
    ["La partición", "La división completa: los tres grupos juntos, sin que sobre ni falte ningún valor.", AZUL],
    ["Una clase", "Cada uno de esos grupos. La norma la llama «partición de equivalencia».", ORO],
    ["El representante", "El valor de la clase que efectivamente se ejecuta en la prueba.", VERDE],
  ];

  vocab.forEach(([titulo, texto, tinta], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 5.0, 3.79, 0.88, C.white);
    rect(slide, x, 5.0, 0.06, 0.88, tinta);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 5.12,
      w: 3.3,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.26,
      y: 5.4,
      w: 3.3,
      h: 0.42,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "La apuesta: si dos valores están en la misma clase, el programa debería tratarlos igual, así que basta probar uno.",
    { y: 6.08, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

function slideComoSeLeenLasCondiciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · antes de escribir la tabla",
    "Cómo se escribe «pertenece a este grupo»",
    "Cada clase se define con una condición. Cuatro símbolos alcanzan, y la diferencia entre dos de ellos importa.",
    false
  );

  const simbolos = [
    ["<", "menor que", "bloque < 1", "El 1 NO entra. Entran 0, -1, -2…", ROJO],
    ["<=", "menor o igual que", "bloque <= 8", "El 8 SÍ entra. Y también 7, 6, 5…", VERDE],
    [">", "mayor que", "bloque > 8", "El 8 NO entra. Entran 9, 10, 11…", ROJO],
    [">=", "mayor o igual que", "bloque >= 1", "El 1 SÍ entra. Y también 2, 3, 4…", VERDE],
  ];

  simbolos.forEach(([simbolo, nombre, ejemplo, lectura, tinta], i) => {
    const w = 2.87;
    const x = M + i * (w + 0.14);
    rect(slide, x, 2.5, w, 1.5, C.white);
    rect(slide, x, 2.5, w, 0.06, tinta);
    addText(slide, simbolo, {
      x: x + 0.22,
      y: 2.62,
      w: 0.8,
      h: 0.46,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 24,
      bold: true,
      color: tinta,
    });
    addText(slide, nombre, {
      x: x + 1.02,
      y: 2.72,
      w: w - 1.24,
      h: 0.32,
      fontSize: 12,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, ejemplo, {
      x: x + 0.22,
      y: 3.2,
      w: w - 0.44,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 12,
      color: C.ink,
    });
    addText(slide, lectura, {
      x: x + 0.22,
      y: 3.5,
      w: w - 0.44,
      h: 0.42,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 4.2, CW, 0.86, C.softBlue);
  rect(slide, M, 4.2, 0.07, 0.86, AZUL);
  addText(slide, "1 <= bloque <= 8", {
    x: M + 0.36,
    y: 4.34,
    w: 2.9,
    h: 0.4,
    fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
    fontSize: 19,
    bold: true,
    color: AZUL,
  });
  addText(
    slide,
    "se lee: «bloque vale al menos 1 y como mucho 8». Los dos extremos entran, y por eso esa condición\ndescribe exactamente la jornada que declara el requisito: los bloques del 1 al 8.",
    {
      x: M + 3.5,
      y: 4.32,
      w: CW - 3.86,
      h: 0.6,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 5.2,
    w: CW,
    h: 1.34,
    title: "Y por qué esto no es un detalle: el defecto del proyecto es exactamente ese cambio",
    code: [
      "el requisito dice:  1 <= bloque <= 8       ->  el bloque 8 se puede reservar",
      "el codigo escribio: 1 <= bloque <  8       ->  el bloque 8 queda afuera",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.2,
  });

  validateSlide(slide, pptx);
}

function slideDefinicionParticion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el nombre normativo",
    "Cómo llama la norma a estos grupos",
    "La técnica se llama partición de equivalencia. Cada grupo, en la norma, es una «partición de equivalencia».",
    false
  );

  addCita(
    slide,
    M,
    2.5,
    CW,
    0.86,
    "class of inputs or outputs that are expected to be treated similarly by the test item",
    { accent: AZUL, fontSize: 14.5 }
  );

  addCita(
    slide,
    M,
    3.48,
    CW,
    0.86,
    "Clase de entradas o salidas que se espera que el elemento de prueba trate de forma similar.",
    { accent: C.slate, fill: C.softNeutral, fontSize: 14.5 }
  );

  addFuente(
    slide,
    M,
    4.5,
    "ISO/IEC/IEEE 29119-4:2021, cláusula 3.28 · traducción del original en inglés",
    { w: 8 }
  );

  rect(slide, M, 4.9, CW, 1.28, C.warm);
  rect(slide, M, 4.9, 0.07, 1.28, ORO);
  addKicker(slide, M + 0.36, 5.06, "La palabra que decide toda la técnica", ORO, 6);
  addText(slide, "«se espera»", {
    x: M + 0.36,
    y: 5.3,
    w: 2.6,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 26,
    bold: true,
    color: ORO,
  });
  addText(
    slide,
    "Agrupar valores formula una hipótesis sobre el comportamiento debido. Ejecutar un representante\nbusca evidencia que la contradiga. La norma no promete que, si el representante pasa, pasen los demás.",
    {
      x: M + 3.2,
      y: 5.3,
      w: CW - 3.56,
      h: 0.7,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Una partición no es un hecho sobre el programa: es una afirmación refutable sobre lo que debería hacer.",
    { y: 6.34, h: 0.54, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideLasTresClases() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la partición escrita",
    "Los tres grupos, ahora con su condición exacta",
    "Se parte el parámetro «bloque» de bloque_valido(), la función que responde si un número pertenece a la jornada.",
    false
  );

  const COLS = [3.1, 2.7, 3.3, 2.79];
  const XS = [M];
  COLS.forEach((w, i) => XS.push(XS[i] + w));

  const CAB = [
    "Clase · el grupo",
    "Condición · quién entra",
    "Tratamiento esperado · qué debe devolver",
    "Representante",
  ];
  rect(slide, M, 2.5, CW, 0.42, C.navy);
  CAB.forEach((t, i) => {
    addText(slide, t.toUpperCase(), {
      x: XS[i] + 0.24,
      y: 2.52,
      w: COLS[i] - 0.3,
      h: 0.38,
      fontSize: 9.6,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 1.1,
    });
  });

  const FILAS = [
    ["Antes de la jornada", "bloque < 1", "False: no pertenece", "-5", ROJO, C.paleRed],
    ["Dentro de la jornada", "1 <= bloque <= 8", "True: pertenece", "4", VERDE, C.successSoft],
    ["Después de la jornada", "bloque > 8", "False: no pertenece", "12", ROJO, C.paleRed],
  ];

  FILAS.forEach(([clase, cond, trato, rep, tinta, fondo], i) => {
    const y = 2.98 + i * 0.72;
    rect(slide, M, y, CW, 0.64, fondo);
    rect(slide, M, y, 0.06, 0.64, tinta);
    addText(slide, clase, {
      x: XS[0] + 0.24,
      y: y + 0.02,
      w: COLS[0] - 0.3,
      h: 0.6,
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, cond, {
      x: XS[1] + 0.24,
      y: y + 0.02,
      w: COLS[1] - 0.3,
      h: 0.6,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 12,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, trato, {
      x: XS[2] + 0.24,
      y: y + 0.02,
      w: COLS[2] - 0.3,
      h: 0.6,
      fontSize: 12.6,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, rep, {
      x: XS[3] + 0.24,
      y: y + 0.02,
      w: COLS[3] - 0.3,
      h: 0.6,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 15,
      bold: true,
      color: tinta,
      valign: "mid",
    });
  });

  rect(slide, M, 5.22, CW, 0.98, C.white);
  rect(slide, M, 5.22, 0.07, 0.98, AZUL);
  addKicker(slide, M + 0.36, 5.4, "Por qué las dos clases inválidas no se juntan", AZUL, 6);
  addText(
    slide,
    "Esperan el mismo resultado, pero rechazar por debajo y rechazar por encima son restricciones distintas:\nuna puede estar bien implementada y la otra no.",
    {
      x: M + 0.36,
      y: 5.66,
      w: CW - 0.72,
      h: 0.48,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "«Válido o inválido» describe la entrada frente al requisito. «Pasa o falla» describe la comparación. Para -5, la prueba pasa si recibe False.",
    { y: 6.42, h: 0.54, fontSize: 12.8 }
  );

  validateSlide(slide, pptx);
}

function slideRevisarLaParticion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · cómo se revisa",
    "Una partición se comprueba sin ejecutar nada",
    "Dos propiedades bastan para detectar los dos errores que se cometen al particionar.",
    false
  );

  const props = [
    [
      "Sin huecos",
      "Todo valor del dominio pertenece a alguna clase.",
      "Con «bloque < 1» y «1 < bloque <= 8», el 1 no entra en ninguna: en la primera falta el igual, y en la segunda también.",
      ROJO,
      C.paleRed,
    ],
    [
      "Sin solapamientos",
      "Ningún valor pertenece a dos clases a la vez.",
      "Si un valor cae en dos clases con expectativas distintas, la partición se contradice a sí misma.",
      ORO,
      C.warm,
    ],
  ];

  props.forEach(([titulo, regla, riesgo, tinta, fondo], i) => {
    const x = M + i * 6.03;
    rect(slide, x, 2.54, 5.86, 1.92, fondo);
    rect(slide, x, 2.54, 5.86, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 2.74,
      w: 5.2,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: tinta,
    });
    addText(slide, regla, {
      x: x + 0.32,
      y: 3.16,
      w: 5.2,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, riesgo, {
      x: x + 0.32,
      y: 3.54,
      w: 5.2,
      h: 0.7,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 4.68,
    w: CW,
    h: 1.38,
    title: "El hueco, escrito: el 1 no cae en ninguna de las dos condiciones",
    code: [
      "bloque < 1          ->  -5, -1, 0        el 1 no entra aqui",
      "1 < bloque <= 8     ->  2, 3, ... 8      el 1 tampoco entra aqui",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.4,
  });

  addTakeaway(
    slide,
    "Dividir más fino es una decisión de diseño: no hay una única partición útil para toda pregunta sobre una función.",
    { y: 6.24, h: 0.56, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideQueRepresentaLaSuite() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el diagnóstico",
    "Ahora se puede decir qué representaba la suite",
    "Con la partición escrita, la pregunta del Bloque 1 tiene respuesta exacta.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.9,
    h: 1.9,
    title: "puede_reservar(reservas, bloque, tomado)",
    code: [
      "puede_reservar(0, 3, tomado=False)",
      "puede_reservar(0, 3, tomado=True)",
      "puede_reservar(3, 3, tomado=False)",
    ].join("\n"),
    lang: "python",
    fontSize: 11.6,
  });

  const clases = [
    ["Antes de la jornada", "0 representantes", ROJO, C.paleRed],
    ["Dentro de la jornada", "3 representantes, todos el mismo valor", VERDE, C.successSoft],
    ["Después de la jornada", "0 representantes", ROJO, C.paleRed],
  ];

  clases.forEach(([clase, cuenta, tinta, fondo], i) => {
    const y = 2.5 + i * 0.66;
    rect(slide, 6.82, y, 5.79, 0.58, fondo);
    rect(slide, 6.82, y, 0.06, 0.58, tinta);
    addText(slide, clase, {
      x: 7.12,
      y: y + 0.02,
      w: 2.7,
      h: 0.54,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, cuenta, {
      x: 9.9,
      y: y + 0.02,
      w: 2.5,
      h: 0.54,
      fontSize: 11.6,
      color: tinta,
      valign: "mid",
    });
  });

  rect(slide, M, 4.62, CW, 1.16, C.white);
  rect(slide, M, 4.62, 0.07, 1.16, AZUL);
  addKicker(slide, M + 0.36, 4.8, "Y lo que esto no significa", AZUL, 6);
  addText(
    slide,
    "No son tres pruebas idénticas: una comprueba un bloque ocupado y otra el máximo semanal.\nSon idénticas respecto del parámetro «bloque», y por eso hay que decir siempre qué se está clasificando.\nContar tres pruebas no permite inferir tres clases.",
    {
      x: M + 0.36,
      y: 5.04,
      w: CW - 0.72,
      h: 0.68,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "La suite cubría una clase de tres. Eso es un dato verificable, no una impresión.",
    { y: 6.0, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideUnaFilaEsUnaPrueba() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · de la tabla al código",
    "Una fila de la tabla se convierte en una prueba",
    "La fila central tiene una entrada, 4, y una expectativa, True. Solo esa, antes de convertir las tres.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 0);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.6,
    h: 2.56,
    title: "test_particiones.py",
    code: [
      "def test_un_bloque_de_la_jornada_es_valido() -> None:",
      "    bloque = 4",
      "    esperado = True",
      "",
      "    obtenido = bloque_valido(bloque)",
      "",
      "    assert obtenido is esperado",
    ].join("\n"),
    lang: "python",
    fontSize: 10,
  });

  const ops = [
    ["Preparar", "bloque = 4  ·  esperado = True", "Declara el caso. El esperado sale del requisito, no del código.", AZUL, C.softBlue],
    ["Ejecutar", "obtenido = bloque_valido(bloque)", "Consulta el comportamiento real del programa.", ORO, C.warm],
    ["Afirmar", "assert obtenido is esperado", "Exige que lo observado coincida con lo esperado.", VERDE, C.successSoft],
  ];

  ops.forEach(([titulo, codigo, texto, tinta, fondo], i) => {
    const y = 2.5 + i * 0.84;
    rect(slide, 7.52, y, 5.09, 0.76, fondo);
    rect(slide, 7.52, y, 0.06, 0.76, tinta);
    addText(slide, titulo, {
      x: 7.82,
      y: y + 0.06,
      w: 1.2,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: tinta,
    });
    addText(slide, codigo, {
      x: 9.1,
      y: y + 0.07,
      w: 3.4,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 9.4,
      color: C.ink,
    });
    addText(slide, texto, {
      x: 7.82,
      y: y + 0.38,
      w: 4.6,
      h: 0.32,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 5.24, CW, 0.94, C.white);
  rect(slide, M, 5.24, 0.07, 0.94, ROJO);
  addKicker(slide, M + 0.36, 5.42, "Por qué obtenido y esperado se escriben aparte", ROJO, 6);
  addText(
    slide,
    "Escribir «esperado = bloque_valido(bloque)» compararía la función consigo misma. El defecto quedaría copiado a\nlos dos lados y la prueba pasaría siempre. El esperado tiene que venir de otra parte: ese es el oráculo.",
    {
      x: M + 0.36,
      y: 5.66,
      w: CW - 0.72,
      h: 0.48,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addFuente(
    slide,
    M,
    6.38,
    "El módulo importa bloque_valido desde el proyecto. El nombre test_... permite que pytest descubra la función, y «-> None» expresa que la prueba no devuelve un resultado para que pytest lo califique.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideQueEsUnaAsercion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la aserción",
    "Qué es exactamente un assert",
    "Es la única línea de la prueba que puede hacerla fallar. Conviene saber qué hace, literalmente.",
    false
  );

  rect(slide, M, 2.5, CW, 0.8, C.navy);
  addText(
    slide,
    "Una aserción es una afirmación comprobable que se exige verdadera en ese punto de la ejecución.",
    {
      x: M + 0.34,
      y: 2.54,
      w: CW - 0.68,
      h: 0.72,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 3.5,
    w: 5.9,
    h: 1.64,
    title: "Lo que hace el assert de Python",
    code: [
      "assert <expresion>",
      "  verdadera -> la ejecucion continua",
      "  falsa     -> lanza el error AssertionError",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.6,
  });

  const noHace = [
    "No devuelve una nota ni un puntaje.",
    "No corrige la función que falló.",
    "No dice si el esperado era el correcto.",
  ];
  addKicker(slide, 6.82, 3.5, "Lo que un assert no hace", ROJO, 5.6);
  noHace.forEach((t, i) => {
    const y = 3.82 + i * 0.44;
    rect(slide, 6.82, y, 5.79, 0.38, C.paleRed);
    rect(slide, 6.82, y, 0.05, 0.38, ROJO);
    addText(slide, t, {
      x: 7.12,
      y: y + 0.02,
      w: 5.3,
      h: 0.34,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 5.36, CW, 0.92, C.warm);
  rect(slide, M, 5.36, 0.07, 0.92, ORO);
  addKicker(slide, M + 0.36, 5.52, "Qué agrega pytest", ORO, 5);
  addText(
    slide,
    "El lenguaje de la aserción sigue siendo Python. Pytest descubre y ejecuta las pruebas, registra los fallos y reescribe\nlas aserciones de los módulos que recoge para poder mostrar los valores intermedios al fallar: «assert False is True».",
    {
      x: M + 0.36,
      y: 5.76,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Quien decide si el esperado era correcto es quien escribió el caso. Eso no lo aporta ninguna herramienta.",
    { y: 6.44, h: 0.54, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideIsVsIgual() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · qué exige cada aserción",
    "Tres formas parecidas que exigen cosas distintas",
    "El contrato de bloque_valido() pide True o False. No cualquier valor que Python considere verdadero.",
    false
  );

  const filas = [
    [
      "assert obtenido",
      "Cualquier valor que Python considere verdadero",
      "También aceptaría 1 o una cadena no vacía. Y no sirve para las filas cuyo esperado es False.",
      ROJO,
      C.paleRed,
    ],
    [
      "assert obtenido == esperado",
      "Un valor igual al esperado",
      "Si el esperado es True, también aceptaría el entero 1. Es la comparación general de valores.",
      ORO,
      C.warm,
    ],
    [
      "assert obtenido is esperado",
      "Exactamente el mismo booleano declarado",
      "Apropiada para este contrato. «is» pregunta si son el mismo objeto; «==» pregunta si valen lo mismo.",
      VERDE,
      C.successSoft,
    ],
  ];

  filas.forEach(([codigo, acepta, riesgo, tinta, fondo], i) => {
    const y = 2.5 + i * 1.08;
    rect(slide, M, y, CW, 1.0, fondo);
    rect(slide, M, y, 0.06, 1.0, tinta);
    addText(slide, codigo, {
      x: M + 0.32,
      y: y + 0.14,
      w: 4.2,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 13.5,
      bold: true,
      color: tinta,
    });
    addText(slide, acepta, {
      x: M + 0.32,
      y: y + 0.52,
      w: 4.2,
      h: 0.36,
      fontSize: 11.8,
      italic: true,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    vrule(slide, M + 4.86, y + 0.16, 0.68, C.border, 1);
    addText(slide, riesgo, {
      x: M + 5.14,
      y: y + 0.24,
      w: CW - 5.5,
      h: 0.56,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 5.82,
    w: CW,
    h: 1.12,
    title: "La diferencia, en una línea",
    code: ["1 == True   ->  True          1 is True   ->  False"].join("\n"),
    lang: "bash",
    fontSize: 11.4,
  });

  validateSlide(slide, pptx);
}

function slideSinAssert() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el error que pasa desapercibido",
    "Una comparación no es una aserción",
    "Esta prueba termina en verde y no comprueba absolutamente nada.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.6,
    h: 1.64,
    title: "Falta una palabra, y no hay error en ninguna parte",
    code: [
      "def test_sin_comprobacion() -> None:",
      "    obtenido = bloque_valido(8)",
      "    obtenido is True",
    ].join("\n"),
    lang: "python",
    fontSize: 10.6,
  });

  rect(slide, 7.52, 2.5, 5.09, 1.64, C.paleRed);
  rect(slide, 7.52, 2.5, 0.07, 1.64, ROJO);
  addKicker(slide, 7.86, 2.7, "Qué ocurre en esa última línea", ROJO, 4.4);
  addText(
    slide,
    "Python calcula «False» y lo descarta. No interrumpe nada ni señala un error. La función termina\nnormalmente, así que pytest la marca como pasada.",
    {
      x: 7.86,
      y: 2.98,
      w: 4.5,
      h: 1.0,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  rect(slide, M, 4.36, CW, 0.72, C.navy);
  addText(
    slide,
    "Es una prueba que no puede fallar nunca. Agregarle «assert» delante convierte la discrepancia en un fallo visible.",
    {
      x: M + 0.34,
      y: 4.4,
      w: CW - 0.68,
      h: 0.64,
      fontSize: 15,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  rect(slide, M, 5.3, CW, 1.0, C.warm);
  rect(slide, M, 5.3, 0.07, 1.0, ORO);
  addKicker(slide, M + 0.36, 5.48, "Y una advertencia que vale fuera de las pruebas", ORO, 6.4);
  addText(
    slide,
    "«assert» es útil en pruebas, pero no debe ser la única validación de entradas de un sistema en producción:\nPython puede omitir todas sus aserciones al ejecutarse con la opción de optimización «-O».",
    {
      x: M + 0.36,
      y: 5.74,
      w: CW - 0.72,
      h: 0.48,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

function slidePorQueParametrizar() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la repetición que sobra",
    "Tres clases, la misma operación, distintos datos",
    "Antes de introducir nada nuevo conviene ver qué problema resuelve.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 2.94,
    title: "Lo que habría que escribir sin parametrizar",
    code: [
      "def test_antes_de_la_jornada() -> None:",
      "    assert bloque_valido(-5) is False",
      "",
      "",
      "def test_dentro_de_la_jornada() -> None:",
      "    assert bloque_valido(4) is True",
      "",
      "",
      "def test_despues_de_la_jornada() -> None:",
      "    assert bloque_valido(12) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  rect(slide, 6.98, 2.5, 5.63, 2.94, C.softBlue);
  rect(slide, 6.98, 2.5, 0.07, 2.94, AZUL);
  addKicker(slide, 7.32, 2.7, "Qué cambia y qué no", AZUL, 4.6);

  const obs = [
    ["Igual en las tres", "La llamada, la forma de comparar y la estructura entera."],
    ["Distinto en las tres", "Solo dos datos: el valor de entrada y el resultado esperado."],
    ["Lo que eso sugiere", "Una sola prueba que se ejecute una vez por fila de la tabla."],
  ];
  obs.forEach(([t, d], i) => {
    const y = 3.0 + i * 0.78;
    addText(slide, t, {
      x: 7.32,
      y,
      w: 5.0,
      h: 0.26,
      fontSize: 12.6,
      bold: true,
      color: AZUL,
    });
    addText(slide, d, {
      x: 7.32,
      y: y + 0.28,
      w: 5.0,
      h: 0.42,
      fontSize: 12,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.62, CW, 0.72, C.navy);
  addText(
    slide,
    "Parametrizar es ejecutar una misma prueba con conjuntos distintos de argumentos.",
    {
      x: M + 0.34,
      y: 5.66,
      w: CW - 0.68,
      h: 0.64,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "La tabla de la partición pasa a ser, literalmente, la lista de casos de la prueba.",
    { y: 6.52, h: 0.5, fontSize: 13.4, fill: ORO }
  );

  validateSlide(slide, pptx);
}

function slideParametrizePorPartes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · leer la sintaxis",
    "@pytest.mark.parametrize, pieza por pieza",
    "",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.06,
    w: 5.6,
    h: 3.42,
    title: "La tabla, escrita como código",
    code: [
      "@pytest.mark.parametrize(",
      '    ("bloque", "esperado"),',
      "    [",
      "        (-5, False),",
      "        (4, True),",
      "        (12, False),",
      "    ],",
      '    ids=["antes-jornada", "dentro-jornada", "despues-jornada"],',
      ")",
      "def test_validez_por_particion(bloque: int, esperado: bool) -> None:",
      "    obtenido = bloque_valido(bloque)",
      "    assert obtenido is esperado",
    ].join("\n"),
    lang: "python",
    fontSize: 8.2,
  });

  const piezas = [
    ["import pytest", "Hace disponible la herramienta que declara los casos. El assert no lo necesita."],
    ["@pytest.mark.parametrize", "Es un decorador: va sobre la definición y le asocia los casos a ejecutar."],
    ['("bloque", "esperado")', "Los nombres de los argumentos que recibirá la prueba. Son cadenas, no valores."],
    ["[(-5, False), (4, True), ...]", "La lista de casos. Cada tupla es una fila, en el orden de los nombres."],
    ['ids=[...]', "Una etiqueta legible por fila, en el mismo orden. Identifica el caso en la salida."],
    ["def test_...(bloque, esperado)", "Dónde recibe la prueba los dos valores. Los nombres deben coincidir."],
  ];

  piezas.forEach(([pieza, lectura], i) => {
    const y = 2.02 + i * 0.62;
    rect(slide, 6.6, y, 6.01, 0.54, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, 6.6, y, 0.05, 0.54, ORO);
    addText(slide, pieza, {
      x: 6.88,
      y: y + 0.03,
      w: 5.6,
      h: 0.2,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 9.6,
      bold: true,
      color: ORO,
    });
    addText(slide, lectura, {
      x: 6.88,
      y: y + 0.24,
      w: 5.6,
      h: 0.28,
      fontSize: 10.4,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 5.66, CW, 0.94, C.paleRed);
  rect(slide, M, 5.66, 0.07, 0.94, ROJO);
  addKicker(slide, M + 0.36, 5.84, "Lo que pytest no hace por nadie", ROJO, 6);
  addText(
    slide,
    "No inventa representantes, no calcula el resultado esperado y no genera todas las combinaciones de los valores\nlistados. Entrega los argumentos que se escribieron, en el orden en que se escribieron. Tres tuplas, tres casos.",
    {
      x: M + 0.36,
      y: 6.08,
      w: CW - 0.72,
      h: 0.48,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

function slideEjecutarYLeer() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · comprobar",
    "Ver qué casos se recogen y cómo se ejecutan",
    "Son opciones de lectura de la salida, no cambios en el criterio de aceptación.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 2.16,
    title: "Enumerar los casos sin ejecutarlos",
    fontSize: 9.6,
    lines: [
      { prompt: ">", text: "uv run pytest --collect-only -q" },
      { text: "collecting ... collected 3 items" },
      { text: "3 tests collected in 0.02s", kind: "success" },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.98,
    y: 2.5,
    w: 5.63,
    h: 2.16,
    title: "Ejecutarlos mostrando cada identificador",
    fontSize: 8.8,
    lines: [
      { prompt: ">", text: "uv run pytest -v --tb=short" },
      { text: "...[antes-jornada]     PASSED", kind: "success" },
      { text: "...[dentro-jornada]    PASSED", kind: "success" },
      { text: "...[despues-jornada]   PASSED", kind: "success" },
      { text: "3 passed in 0.02s", kind: "success" },
    ],
  });

  const flags = [
    ["--collect-only", "Enumera los casos sin ejecutar sus cuerpos."],
    ["-q", "Reduce la salida."],
    ["-v", "Muestra cada caso con su identificador."],
    ["--tb=short", "Abrevia la traza si ocurre un fallo."],
  ];
  flags.forEach(([flag, texto], i) => {
    const x = M + (i % 2) * 6.03;
    const y = 4.78 + Math.floor(i / 2) * 0.56;
    rect(slide, x, y, 5.86, 0.48, C.white);
    rect(slide, x, y, 0.05, 0.48, AZUL);
    addText(slide, flag, {
      x: x + 0.28,
      y: y + 0.02,
      w: 1.7,
      h: 0.44,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 11,
      bold: true,
      color: AZUL,
      valign: "mid",
    });
    addText(slide, texto, {
      x: x + 2.06,
      y: y + 0.02,
      w: 3.6,
      h: 0.44,
      fontSize: 11.4,
      color: C.ink,
      valign: "mid",
    });
  });

  addTakeaway(
    slide,
    "Las tres clases quedan representadas y hay una aserción por ejecución. El defecto del bloque 8 sigue ahí.",
    { y: 5.94, h: 0.58 }
  );

  addFuente(slide, M, 6.68, "Ejecutado con Python 3.12.12 y pytest 9.1.1.", { w: 6 });

  validateSlide(slide, pptx);
}

function slideOchoNoDetectado() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el límite de la técnica",
    "Se cambia un solo valor y la clase se rompe",
    "Solo la fila central: 4 pasa a ser 8. Ambos pertenecen a la misma clase según el requisito.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 4.4,
    h: 1.38,
    title: "El único cambio",
    code: ["(8, True),"].join("\n"),
    lang: "python",
    fontSize: 13,
  });

  addTerminalPanel(slide, SH, {
    x: 5.32,
    y: 2.5,
    w: 7.29,
    h: 2.16,
    title: "Y el diagnóstico completo",
    fontSize: 9.2,
    lines: [
      { text: "test_particiones.py:17: in test_validez_por_particion" },
      { text: "    assert obtenido is esperado" },
      { text: "E   assert False is True", kind: "error" },
      { text: "FAILED ...[dentro-jornada] - assert False is True", kind: "error" },
      { text: "1 failed, 2 passed in 0.09s", kind: "error" },
    ],
  });

  addKicker(slide, M, 4.9, "Cómo se lee esa salida, sin adivinar", C.ink, 7);

  const lectura = [
    ["test_particiones.py:17", "El módulo y la línea de la aserción."],
    ["[dentro-jornada]", "La fila. Aquí sus argumentos son 8 y True."],
    ["False is True", "Obtenido a la izquierda, esperado a la derecha, porque así se escribió."],
  ];
  lectura.forEach(([token, texto], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 5.22, 3.79, 0.86, C.softNeutral);
    rect(slide, x, 5.22, 3.79, 0.05, AZUL);
    addText(slide, token, {
      x: x + 0.28,
      y: 5.34,
      w: 3.3,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 10.6,
      bold: true,
      color: AZUL,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 5.6,
      w: 3.3,
      h: 0.42,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "El 8 sigue perteneciendo a la clase válida. Cambiar su esperado a False para recuperar el verde haría que el defecto definiera el requisito.",
    { y: 6.28, h: 0.6, fontSize: 13.2, fill: ROJO }
  );

  validateSlide(slide, pptx);
}

function slidePreguntasB2() {
  slidePreguntas(2, "Preguntas para llevarse del Bloque 2", [
    [
      "4 y 8 pertenecen a la misma clase según el requisito, pero la función devuelve valores distintos. ¿Qué hay que revisar: el requisito, la clasificación o la implementación?",
      "La jornada incluye los bloques del 1 al 8; observar un rechazo no modifica esa regla.",
    ],
    [
      "¿Qué diferencia hay entre escribir «obtenido is esperado» y «assert obtenido is esperado», y qué agrega pytest cuando la segunda falla?",
      "Separa tres cosas: calcular una expresión, exigir que sea verdadera y mostrar el diagnóstico.",
    ],
    [
      "Una parametrización tiene tres filas y otra treinta, todas dentro de las mismas tres clases. ¿Qué aumentó, y qué sigue sin demostrarse aunque las treinta pasen?",
      "Distingue cantidad de casos, clases representadas y miembros que nunca se ejecutaron.",
    ],
  ]);
}

function slideRespuestasB2() {
  slideRespuestas(2, "Lo que tenía que aparecer en tu respuesta", [
    [
      "Qué se revisa cuando la clase y el código no coinciden",
      "La implementación. La clase se derivó del requisito, y observar un rechazo no cambia lo que el requisito dice.",
      "Reclasificar el 8 como inválido haría que el defecto pasara a definir el requisito.",
    ],
    [
      "La palabra que separa una comparación de una prueba",
      "Sin «assert», Python calcula el resultado y lo descarta: la prueba termina normalmente y aparece en verde.",
      "Una prueba sin aserción no está incompleta: es una prueba que no puede fallar nunca.",
    ],
    [
      "Qué crece con treinta filas y qué no",
      "Aumenta la cantidad de casos ejecutados. Sigue sin demostrarse que los miembros no ejecutados se comporten igual.",
      "La suite heredada ya lo probaba con cuatro casos: treinta dentro de una clase tampoco habrían hallado el 8.",
    ],
  ]);
}

// ================================================================= BLOQUE 3

function slideDivisorB3() {
  slideDivisor(
    3,
    "Análisis de valores límite",
    "¿Dónde exactamente cambia el comportamiento esperado, y qué hace falta saber para escribir «justo antes» de ese punto?",
    2
  );
}

function slideQueEsUnValorLimite() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la idea, antes del nombre",
    "El punto donde una clase termina y empieza otra",
    "Las clases del bloque anterior son vecinas. Entre dos vecinas hay un punto exacto donde cambia lo esperado.",
    false
  );

  const segs = [
    ["Antes de la jornada", "… -1, 0", ROJO, C.paleRed],
    ["Dentro de la jornada", "1, 2 … 7, 8", VERDE, C.successSoft],
    ["Después de la jornada", "9, 10 …", ROJO, C.paleRed],
  ];
  segs.forEach(([titulo, valores, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.5, 3.79, 0.86, fondo);
    rect(slide, x, 2.5, 3.79, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 2.62,
      w: 3.3,
      h: 0.24,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, valores, {
      x: x + 0.26,
      y: 2.9,
      w: 3.3,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 13,
      color: tinta,
    });
  });

  [4.51, 8.58].forEach((x) => {
    vrule(slide, x, 3.42, 0.3, ORO, 2.4);
  });
  addText(slide, "aquí cambia lo esperado", {
    x: 3.2,
    y: 3.74,
    w: 2.6,
    h: 0.2,
    fontSize: 9.4,
    italic: true,
    color: ORO,
    align: "center",
  });
  addText(slide, "y aquí también", {
    x: 7.3,
    y: 3.74,
    w: 2.6,
    h: 0.2,
    fontSize: 9.4,
    italic: true,
    color: ORO,
    align: "center",
  });

  rect(slide, M, 4.1, CW, 0.78, C.navy);
  addText(
    slide,
    "Un valor límite es el último valor de una clase, o el primero de la clase de al lado.",
    {
      x: M + 0.34,
      y: 4.14,
      w: CW - 0.68,
      h: 0.7,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addCita(
    slide,
    M,
    5.04,
    CW,
    0.8,
    "Técnica de diseño de casos basada en especificación que ejercita los límites de las particiones de equivalencia.",
    { accent: ORO, fill: C.warm, fontSize: 13.4 }
  );
  addFuente(
    slide,
    M,
    5.98,
    "ISO/IEC/IEEE 29119-4:2021, cláusula 3.3 · traducción del original en inglés",
    { w: 8 }
  );

  addTakeaway(
    slide,
    "No es una técnica aparte: sin haber particionado antes, no hay límites que analizar.",
    { y: 6.36, h: 0.54, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideLasDosTransiciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el orden de trabajo",
    "Cuatro valores, y ninguno elegido por corazonada",
    "Tres clases producen dos transiciones, y cada transición aporta dos valores: el último de una y el primero de la otra.",
    false
  );

  const pasos = ["Declarar el dominio", "Particionar", "Identificar los límites", "Elegir los casos"];
  pasos.forEach((paso, i) => {
    const w = 2.87;
    const x = M + i * (w + 0.14);
    rect(slide, x, 2.5, w, 0.5, i === 3 ? C.gold : C.softNeutral);
    addText(slide, `${i + 1}. ${paso}`, {
      x: x + 0.18,
      y: 2.52,
      w: w - 0.36,
      h: 0.46,
      fontSize: 11.6,
      bold: true,
      color: i === 3 ? C.ink : C.slate,
      valign: "mid",
    });
  });

  const CAB = ["Transición", "Último de la izquierda", "Primero de la derecha", "Cambio esperado"];
  const COLS = [3.4, 2.8, 2.8, 2.89];
  const XS = [M];
  COLS.forEach((w, i) => XS.push(XS[i] + w));

  rect(slide, M, 3.24, CW, 0.4, C.navy);
  CAB.forEach((t, i) => {
    addText(slide, t.toUpperCase(), {
      x: XS[i] + 0.24,
      y: 3.26,
      w: COLS[i] - 0.3,
      h: 0.36,
      fontSize: 9.2,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 1,
    });
  });

  const FILAS = [
    ["Antes → dentro", "0", "1", "False → True"],
    ["Dentro → después", "8", "9", "True → False"],
  ];
  FILAS.forEach(([tr, izq, der, cambio], i) => {
    const y = 3.7 + i * 0.62;
    rect(slide, M, y, CW, 0.54, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.54, ORO);
    [tr, izq, der, cambio].forEach((t, j) => {
      addText(slide, t, {
        x: XS[j] + 0.24,
        y: y + 0.02,
        w: COLS[j] - 0.3,
        h: 0.5,
        fontFace: j === 0 ? TYPOGRAPHY.body : TYPOGRAPHY.mono || TYPOGRAPHY.body,
        fontSize: j === 0 ? 12.6 : 13,
        bold: j > 0 && j < 3,
        color: j > 0 && j < 3 ? ORO : C.ink,
        valign: "mid",
      });
    });
  });

  rect(slide, M, 5.06, CW, 0.92, C.warm);
  rect(slide, M, 5.06, 0.07, 0.92, ORO);
  addText(slide, "Los cuatro valores límite:  0, 1, 8, 9", {
    x: M + 0.36,
    y: 5.16,
    w: 5.0,
    h: 0.36,
    fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "El 0 y el 9 pertenecen a clases inválidas, y aun así son límites: son los bordes de esas clases.",
    {
      x: M + 0.36,
      y: 5.56,
      w: CW - 0.72,
      h: 0.3,
      fontSize: 12.4,
      color: C.ink,
    }
  );

  addTakeaway(
    slide,
    "«Probar cerca del máximo» no dice máximo de qué, si está incluido, ni con qué separación. Este procedimiento sí.",
    { y: 6.18, h: 0.58, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideDosVariantes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · cuántos vecinos se toman",
    "Dos variantes, y el criterio escrito",
    "Un vecino es el valor inmediatamente anterior o posterior dentro del dominio declarado. Aquí, enteros.",
    false
  );

  const variantes = [
    [
      "Dos valores",
      "Cada límite y su vecino inmediato en la clase de al lado.",
      "0, 1, 8, 9",
      "4 casos",
      AZUL,
      C.softBlue,
    ],
    [
      "Tres valores",
      "Cada límite y sus dos vecinos inmediatos, a ambos lados.",
      "-1, 0, 1, 2, 7, 8, 9, 10",
      "8 casos",
      ORO,
      C.warm,
    ],
  ];

  variantes.forEach(([titulo, regla, valores, cuenta, tinta, fondo], i) => {
    const x = M + i * 6.03;
    rect(slide, x, 2.5, 5.86, 1.86, fondo);
    rect(slide, x, 2.5, 5.86, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 2.7,
      w: 3.4,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: tinta,
    });
    addText(slide, cuenta, {
      x: x + 3.9,
      y: 2.76,
      w: 1.7,
      h: 0.28,
      fontSize: 12.4,
      bold: true,
      color: tinta,
      align: "right",
    });
    addText(slide, regla, {
      x: x + 0.32,
      y: 3.12,
      w: 5.2,
      h: 0.44,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    rect(slide, x + 0.32, 3.62, 5.2, 0.5, C.white);
    addText(slide, valores, {
      x: x + 0.5,
      y: 3.64,
      w: 4.9,
      h: 0.46,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 13,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
  });

  addFuente(
    slide,
    M,
    4.5,
    "La distinción entre las dos variantes y su nomenclatura vienen del syllabus ISTQB CTFL v4.0.1, sección 4.2.2; la definición breve de ISO no las separa.",
    { w: 11.6 }
  );

  rect(slide, M, 4.92, CW, 1.06, C.white);
  rect(slide, M, 4.92, 0.07, 1.06, ROJO);
  addKicker(slide, M + 0.36, 5.1, "Más casos no significa mejores pruebas", ROJO, 6);
  addText(
    slide,
    "La variante de tres valores agrega vecinos que se quedan dentro de su clase. Eso solo se justifica si se puede\nnombrar qué error adicional permite exponer. La lámina siguiente muestra uno concreto.",
    {
      x: M + 0.36,
      y: 5.36,
      w: CW - 0.72,
      h: 0.5,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "La variante se declara antes de escribir los casos, no se decide mirando cuáles pasaron.",
    { y: 6.2, h: 0.56, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

function slideCuandoLaAmpliacionPaga() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · comprobar",
    "Un defecto que los cuatro casos no ven",
    "Una implementación alternativa, escrita para esta demostración, que acepta solo los dos extremos.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 1.6,
    title: "La implementación defectuosa",
    code: [
      "def bloque_valido_solo_extremos(bloque: int) -> bool:",
      "    return bloque in (1, 8)",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, 6.98, 2.5, 5.63, 1.6, C.paleRed);
  rect(slide, 6.98, 2.5, 0.07, 1.6, ROJO);
  addKicker(slide, 7.32, 2.68, "Qué hace mal", ROJO, 4.4);
  addText(
    slide,
    "Acepta el primero y el último de la jornada, y rechaza todos los de en medio: el 2, el 3, el 4…",
    {
      x: 7.32,
      y: 2.96,
      w: 5.0,
      h: 0.98,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.3,
    w: CW,
    h: 1.64,
    title: "Cada conjunto de casos, comparado contra la regla del requisito",
    fontSize: 10.4,
    lines: [
      { text: "2 valores, desacuerdos: []", kind: "error" },
      { text: "3 valores, desacuerdos: [2, 7]", kind: "success" },
    ],
  });

  addTakeaway(
    slide,
    "Los cuatro casos coinciden con el requisito y no delatan nada. Los vecinos interiores 2 y 7 sí. Eso justifica la ampliación frente a ESTE error, y no frente a cualquiera.",
    { y: 6.1, h: 0.66, fontSize: 12.8 }
  );

  validateSlide(slide, pptx);
}

function slideDosSuitesUnMismoOcho() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · de dónde salen los límites",
    "Dos suites que ejecutan el mismo bloque 8",
    "Misma función, mismo número de casos, misma sintaxis. Cambia de dónde se sacaron los límites y el esperado.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 0);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 1.82,
    title: "Límites leídos del CÓDIGO · return BLOQUE_MIN <= bloque < BLOQUE_MAX",
    code: [
      "[(0, False), (1, True), (7, True), (8, False)]",
      "ids=[\"antes\", \"primero\", \"ultimo\", \"despues\"]",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  addCodePanel(slide, SH, {
    x: 6.98,
    y: 2.5,
    w: 5.63,
    h: 1.82,
    title: "Límites leídos del REQUISITO · bloques del 1 al 8",
    code: [
      "[(0, False), (1, True), (8, True), (9, False)]",
      "ids=[\"antes\", \"primero\", \"ultimo\", \"despues\"]",
    ].join("\n"),
    lang: "python",
    fontSize: 8.8,
  });

  rect(slide, M, 4.5, CW, 1.0, C.warm);
  rect(slide, M, 4.5, 0.07, 1.0, ORO);
  addKicker(slide, M + 0.36, 4.68, "Las dos ejecutan el 8. La diferencia no está en la entrada", ORO, 7);
  addText(
    slide,
    "La suite de la izquierda exige que el 8 devuelva False. La de la derecha exige que devuelva True.\nEligieron la misma entrada y decidieron distinto su resultado esperado.",
    {
      x: M + 0.36,
      y: 4.94,
      w: CW - 0.72,
      h: 0.5,
      fontSize: 12.8,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Elegir la entrada es la mitad del trabajo. La otra mitad es decidir qué debe salir, y eso no puede salir del código.",
    { y: 5.66, h: 0.6 }
  );

  validateSlide(slide, pptx);
}

function slideElResultadoDeLasDosSuites() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · comprobar",
    "Una pasa, la otra encuentra el defecto",
    "Ejecutadas por separado sobre la misma función, con Python 3.12.12 y pytest 9.1.1.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.5,
    h: 1.6,
    title: "test_desde_codigo.py",
    fontSize: 10,
    lines: [
      { prompt: ">", text: "uv run pytest test_desde_codigo.py -q" },
      { text: "4 passed in 0.03s", kind: "error" },
    ],
  });

  addTerminalPanel(slide, SH, {
    x: 6.42,
    y: 2.5,
    w: 6.19,
    h: 2.42,
    title: "test_desde_requisito.py",
    fontSize: 8.8,
    lines: [
      { prompt: ">", text: "uv run pytest test_desde_requisito.py -q" },
      { text: "test_desde_requisito.py:6: in test_limites_del_requisito" },
      { text: "    assert bloque_valido(bloque) is esperado" },
      { text: "E   assert False is True", kind: "success" },
      { text: "E    +  where False = bloque_valido(8)", kind: "success" },
      { text: "1 failed, 3 passed in 0.11s", kind: "success" },
    ],
  });

  rect(slide, M, 4.24, 5.5, 0.68, C.paleRed);
  rect(slide, M, 4.24, 0.06, 0.68, ROJO);
  addText(slide, "Verde con el defecto adentro.", {
    x: M + 0.28,
    y: 4.3,
    w: 5.0,
    h: 0.56,
    fontSize: 13,
    bold: true,
    color: ROJO,
    valign: "mid",
  });

  rect(slide, M, 5.06, CW, 1.3, C.white);
  rect(slide, M, 5.06, 0.07, 1.3, AZUL);
  addKicker(slide, M + 0.36, 5.28, "La conclusión precisa, sin exagerar", AZUL, 6);
  addText(
    slide,
    "Mirar el código no impide encontrar defectos: si se conservaran los valores de la izquierda pero se corrigiera el\nesperado del 8 desde el requisito, esa suite también fallaría. El problema es dejar que la implementación\ndetermine aquello contra lo cual se la juzga.",
    {
      x: M + 0.36,
      y: 5.5,
      w: CW - 0.72,
      h: 0.76,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

function slideBordesAuditados() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la afirmación heredada",
    "«La mayoría de los defectos está en los bordes»",
    "Se repite en todo el gremio. Conviene separar el mecanismo, que es real, de la estadística, que no está medida aquí.",
    false
  );

  const cols = [
    [
      "Lo que sí se puede sostener",
      "Los bordes son candidatos razonables porque un operador estricto, un extremo desplazado o una condición omitida cambian qué clase recibe un valor. El defecto del laboratorio es exactamente ese mecanismo.",
      VERDE,
      C.successSoft,
    ],
    [
      "Lo que exigiría otra evidencia",
      "Afirmar «la mayoría» pide una población de programas, una definición de defecto y una medición de su distribución. Nada de eso aparece en las demostraciones de una clase.",
      ROJO,
      C.paleRed,
    ],
  ];
  cols.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 6.03;
    rect(slide, x, 2.54, 5.86, 1.86, fondo);
    rect(slide, x, 2.54, 5.86, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.32,
      y: 2.74,
      w: 5.2,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.32,
      y: 3.12,
      w: 5.2,
      h: 1.1,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 4.56, CW, 1.24, C.softBlue);
  rect(slide, M, 4.56, 0.07, 1.24, AZUL);
  addKicker(slide, M + 0.36, 4.74, "Hay investigación empírica, y conviene conservar su alcance", AZUL, 8);
  addText(
    slide,
    "Roper, Wood y Miller (1997) compararon lectura de código, pruebas funcionales con partición y valores límite, y\npruebas estructurales: 47 estudiantes sobre programas pequeños en C. Eficacia individual ampliamente similar,\ndependiente del programa y sus defectos, y mayor al combinar técnicas.",
    {
      x: M + 0.36,
      y: 5.0,
      w: CW - 0.72,
      h: 0.72,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Ese estudio no aísla el efecto de los valores límite ni mide qué proporción de defectos vive en bordes. Se eligen los bordes por los errores que permiten exponer, no por una frecuencia.",
    { y: 6.02, h: 0.66, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

function slideJustoAntesNecesitaUnidad() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · cuando el parámetro no es un entero",
    "«Justo antes» necesita una unidad",
    "La regla de cancelación no compara bloques: compara dos instantes. Lo que se estudia es la anticipación.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.5,
    h: 1.6,
    title: "La anticipación, y el paso elegido",
    code: [
      "anticipacion = inicio_bloque - ahora",
      "paso = timedelta(microseconds=1)",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, 6.42, 2.5, 6.19, 1.6, C.warm);
  rect(slide, 6.42, 2.5, 0.07, 1.6, ORO);
  addText(
    slide,
    "El tipo timedelta representa una duración con resolución de un microsegundo. Ese es el «vecino» más cercano posible en este dominio, y hay que declararlo antes de escribir el caso.",
    {
      x: 6.78,
      y: 2.68,
      w: 5.5,
      h: 1.28,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.2,
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.28,
    w: CW,
    h: 1.9,
    title: "Un instante fijo, y solo la anticipación cambia",
    fontSize: 10.2,
    lines: [
      { text: "un microsegundo menos  1:59:59.999999  False", kind: "success" },
      { text: "exactamente dos horas  2:00:00         False", kind: "error" },
      { text: "un microsegundo mas    2:00:00.000001  True", kind: "success" },
    ],
  });

  addTakeaway(
    slide,
    "Es una observación, no una prueba: el requisito dice «hasta 2 horas antes» y nunca resolvió si las dos horas exactas entran. Ese False es lo que hace el código, no lo que se le exige.",
    { y: 6.32, h: 0.62, fontSize: 12.6, fill: ROJO }
  );

  validateSlide(slide, pptx);
}

function slideResolucionNoEsPrecision() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · dos decisiones distintas",
    "La resolución de un tipo no es la precisión del producto",
    "El microsegundo lo trae el tipo. Qué precisión admite el sistema es una decisión del requisito, y todavía no está tomada.",
    false
  );

  const tres = [
    [
      "El dominio",
      "¿Enteros, instantes, duraciones, decimales? Determina qué significa «el siguiente».",
      AZUL,
      C.softBlue,
    ],
    [
      "La unidad y el paso",
      "Un microsegundo, un minuto, un bloque. Sin unidad, «límite − 1» no está definido.",
      ORO,
      C.warm,
    ],
    [
      "La pertenencia del límite",
      "¿El valor exacto entra en una clase o en la otra? Eso lo decide el requisito, no el tipo.",
      ROJO,
      C.paleRed,
    ],
  ];
  tres.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.62, 3.79, 1.6, fondo);
    rect(slide, x, 2.62, 3.79, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.82,
      w: 3.24,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 3.2,
      w: 3.24,
      h: 0.86,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 4.42,
    w: CW,
    h: 1.38,
    title: "Por qué «límite − 1» por reflejo no sirve",
    code: [
      "limite - 1   ->  un bloque menos?  un segundo menos?  una hora menos?",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.6,
  });

  addTakeaway(
    slide,
    "Si el contrato de entrada admitiera solo minutos completos, el vecino pertinente sería un minuto antes, no un microsegundo. Entre dos números reales siempre hay otro: el paso hay que declararlo.",
    { y: 5.96, h: 0.66, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

function slidePorQueApprox() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · comprobar",
    "Cuando la igualdad exacta es la prueba equivocada",
    "Para un número de bloque la pertenencia es exacta. Para una duración calculada con decimales, no siempre.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.5,
    h: 1.6,
    title: "Dos duraciones en horas, sumadas",
    code: ["obtenido = sum([0.1, 0.2])", "esperado = 0.3"].join("\n"),
    lang: "python",
    fontSize: 11,
  });

  addTerminalPanel(slide, SH, {
    x: 6.42,
    y: 2.5,
    w: 6.19,
    h: 1.9,
    title: "Y lo que realmente ocurre",
    fontSize: 9.6,
    lines: [
      { text: "obtenido: 0.30000000000000004" },
      { text: "igualdad exacta: False", kind: "error" },
      { text: "error absoluto: 5.551115123125783e-17" },
    ],
  });

  rect(slide, M, 4.58, CW, 1.1, C.white);
  rect(slide, M, 4.58, 0.07, 1.1, AZUL);
  addKicker(slide, M + 0.36, 4.76, "Por qué pasa esto", AZUL, 5);
  addText(
    slide,
    "No toda cantidad decimal se representa exactamente en binario. El cálculo siguió el modelo esperado y aun así\nel resultado difiere en la diecisieteava cifra. La igualdad exacta rechaza un resultado que es correcto.",
    {
      x: M + 0.36,
      y: 5.02,
      w: CW - 0.72,
      h: 0.52,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "La respuesta no es aceptar «cualquier cosa parecida»: es declarar cuánta diferencia se admite, y por qué.",
    { y: 5.88, h: 0.58 }
  );

  validateSlide(slide, pptx);
}

function slideApproxPorPartes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · leer la sintaxis",
    "pytest.approx, pieza por pieza",
    "Para este ejemplo se declara el criterio antes de ejecutar: error absoluto máximo de 1e-12 horas, sin tolerancia relativa.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: CW,
    h: 1.6,
    title: "La comparación completa",
    code: [
      "assert obtenido == pytest.approx(esperado, rel=0, abs=1e-12)",
    ].join("\n"),
    lang: "python",
    fontSize: 12.4,
  });

  const piezas = [
    ["esperado", "El valor de referencia: 0.3 horas.", AZUL],
    ["pytest.approx(...)", "Construye una comparación con tolerancia. No redondea ni modifica el obtenido.", ORO],
    ["abs=1e-12", "Tolera hasta 0,000000000001 horas de diferencia. No es la función abs() de Python.", ORO],
    ["rel=0", "Desactiva el margen proporcional al esperado. Se escribe para hacer visible la elección.", ORO],
    ["==", "Compara contra ese criterio. Aquí «is» compararía identidad y sería incorrecto.", VERDE],
  ];
  piezas.forEach(([pieza, texto, tinta], i) => {
    const y = 4.26 + i * 0.5;
    rect(slide, M, y, CW, 0.44, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.44, tinta);
    addText(slide, pieza, {
      x: M + 0.28,
      y: y + 0.02,
      w: 2.5,
      h: 0.4,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 11,
      bold: true,
      color: tinta,
      valign: "mid",
    });
    addText(slide, texto, {
      x: M + 3.0,
      y: y + 0.02,
      w: CW - 3.36,
      h: 0.4,
      fontSize: 11.8,
      color: C.ink,
      valign: "mid",
    });
  });

  addFuente(
    slide,
    M,
    6.86,
    "La tolerancia absoluta tiene la unidad del resultado; la relativa es una fracción del esperado. Con ambas, pytest acepta si se cumple cualquiera.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideLaToleranciaEsCriterio() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el riesgo de la tolerancia",
    "Ampliar el margen también pone la prueba en verde",
    "Se comprueba la sensibilidad del criterio con un resultado deliberadamente incorrecto: 0.31 en vez de 0.3.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: CW,
    h: 1.64,
    title: "El mismo valor incorrecto, contra dos tolerancias",
    fontSize: 10.6,
    lines: [
      { text: "0.31 con tolerancia 1e-12: False", kind: "success" },
      { text: "0.31 con tolerancia 0.02:  True", kind: "error" },
    ],
  });

  rect(slide, M, 4.34, CW, 0.8, C.navy);
  addText(
    slide,
    "El verde no distingue si mejoró la implementación o si se debilitó la exigencia.",
    {
      x: M + 0.34,
      y: 4.38,
      w: CW - 0.68,
      h: 0.72,
      fontFace: TYPOGRAPHY.display,
      fontSize: 19,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  rect(slide, M, 5.3, CW, 1.16, C.warm);
  rect(slide, M, 5.3, 0.07, 1.16, ORO);
  addKicker(slide, M + 0.36, 5.48, "Tres cosas que se revisan antes de aceptar casos escritos por un agente", ORO, 8);
  addText(
    slide,
    "De dónde salió el límite, de dónde salió el esperado y de dónde salió la tolerancia. Ninguna se justifica porque\nla suite pase. Si propone subir «abs» o «rel», tiene que explicar qué error admite el modelo y mostrar un\nresultado incorrecto que la prueba siga rechazando.",
    {
      x: M + 0.36,
      y: 5.72,
      w: CW - 0.72,
      h: 0.66,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addFuente(
    slide,
    M,
    6.62,
    "approx no decide si las dos horas exactas permiten cancelar: eso es una regla de inclusión del umbral, no un error numérico.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slidePreguntasB3() {
  slidePreguntas(3, "Preguntas para llevarse del Bloque 3", [
    [
      "Las dos suites de límites ejecutan el bloque 8, pero solo una falla. ¿Qué demuestra eso sobre la diferencia entre elegir una entrada y decidir su resultado esperado?",
      "Compara la tupla del 8 en las dos listas; la discrepancia no está en la sintaxis.",
    ],
    [
      "¿Qué información hace falta para escribir «justo antes del límite» cuando el parámetro deja de ser un bloque entero y pasa a ser un instante o una duración?",
      "Identifica dominio, unidad, resolución y a qué clase pertenece el valor exacto.",
    ],
    [
      "¿Por qué es correcto tolerar una diferencia pequeña al sumar duraciones con decimales, pero incorrecto usar esa tolerancia para decidir si las dos horas exactas permiten cancelar?",
      "Un caso trata de error numérico; el otro, de una decisión del requisito.",
    ],
  ]);
}

function slideRespuestasB3() {
  slideRespuestas(3, "Lo que tenía que aparecer en tu respuesta", [
    [
      "Elegir la entrada y decidir el esperado son dos trabajos",
      "Las dos eligieron bien el 8. Una lo esperó False copiando el código, la otra True leyendo el requisito.",
      "Un caso de prueba puede tener la entrada perfecta y seguir siendo inútil si su esperado salió del programa.",
    ],
    [
      "Lo que hay que declarar antes de escribir «justo antes»",
      "El dominio, la unidad, la resolución del paso y a qué clase pertenece el valor exacto del límite.",
      "Sin unidad, «límite − 1» puede significar un bloque, un segundo o una hora: el caso no está definido.",
    ],
    [
      "Error numérico contra decisión de requisito",
      "La suma con decimales falla por cómo se representan en binario. Las dos horas exactas no son un error: son un vacío del requisito.",
      "Una tolerancia aplicada a un vacío del requisito lo tapa en vez de resolverlo, y deja la suite en verde.",
    ],
  ]);
}

// ================================================================= BLOQUE 4

function slideDivisorB4() {
  slideDivisor(
    4,
    "Tablas de decisión",
    "¿Qué debe ocurrir cuando varias condiciones se cumplen o fallan al mismo tiempo?",
    3
  );
}

function slideTresCondiciones() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la idea, antes del nombre",
    "Tres condiciones no son tres pruebas",
    "Un bloque puede pertenecer a la jornada y estar ocupado. La decisión depende de que las reglas se cumplan juntas.",
    false
  );

  const conds = [
    ["V", "bloque válido", "¿Pertenece a la jornada?", "El entero está entre 1 y 8, incluidos.", AZUL, C.softBlue],
    ["L", "bloque libre", "¿Está disponible?", "El argumento «tomado» es False. L es su negación.", ORO, C.warm],
    ["C", "cupo semanal", "¿Puede agregar una reserva?", "Tiene menos de tres reservas activas.", VERDE, C.successSoft],
  ];

  conds.forEach(([letra, nombre, pregunta, lectura, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.54, 3.79, 1.72, fondo);
    rect(slide, x, 2.54, 3.79, 0.07, tinta);
    rect(slide, x + 0.28, 2.72, 0.5, 0.5, tinta);
    addText(slide, letra, {
      x: x + 0.28,
      y: 2.74,
      w: 0.5,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, nombre, {
      x: x + 0.9,
      y: 2.8,
      w: 2.6,
      h: 0.28,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    addText(slide, pregunta, {
      x: x + 0.28,
      y: 3.34,
      w: 3.24,
      h: 0.26,
      fontSize: 12.4,
      italic: true,
      color: tinta,
    });
    addText(slide, lectura, {
      x: x + 0.28,
      y: 3.64,
      w: 3.24,
      h: 0.52,
      fontSize: 11.8,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 4.42, CW, 0.96, C.paleRed);
  rect(slide, M, 4.42, 0.07, 0.96, ROJO);
  addKicker(slide, M + 0.36, 4.6, "Cuidado con la segunda condición", ROJO, 6);
  addText(
    slide,
    "«L: bloque libre» NO es el argumento «tomado»: es su negación. Traducir la tabla a código exige conservar esa\ndiferencia, porque L verdadera significa tomado=False.",
    {
      x: M + 0.36,
      y: 4.86,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  rect(slide, M, 5.54, CW, 0.76, C.navy);
  addText(
    slide,
    "Tres condiciones que pueden ser verdaderas o falsas producen 2 × 2 × 2 = 8 combinaciones.",
    {
      x: M + 0.34,
      y: 5.58,
      w: CW - 0.68,
      h: 0.68,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  addTakeaway(
    slide,
    "Probar los bordes de cada parámetro por separado no dice qué pasa cuando las tres coinciden.",
    { y: 6.44, h: 0.52, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

function slideTablaCompleta() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la tabla completa",
    "Las ocho combinaciones, y qué se espera de cada una",
    "Cada columna es una regla: una combinación de condiciones y el resultado que debe producir. T es verdadero, F es falso.",
    false
  );

  const FILAS = [
    ["V: bloque válido", ["T", "T", "T", "T", "F", "F", "F", "F"]],
    ["L: bloque libre", ["T", "T", "F", "F", "T", "T", "F", "F"]],
    ["C: cupo semanal", ["T", "F", "T", "F", "T", "F", "T", "F"]],
  ];
  const RES = ["T", "F", "F", "F", "F", "F", "F", "F"];
  const X0 = M + 3.2;
  const CW_COL = (CW - 3.2) / 8;

  rect(slide, M, 2.6, CW, 0.44, C.navy);
  addText(slide, "CONDICIÓN / RESULTADO", {
    x: M + 0.24,
    y: 2.62,
    w: 2.9,
    h: 0.4,
    fontSize: 9.2,
    bold: true,
    color: C.white,
    valign: "mid",
    charSpacing: 1,
  });
  for (let i = 0; i < 8; i += 1) {
    addText(slide, `T${i + 1}`, {
      x: X0 + i * CW_COL,
      y: 2.62,
      w: CW_COL,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
  }

  FILAS.forEach(([nombre, valores], f) => {
    const y = 3.1 + f * 0.52;
    rect(slide, M, y, CW, 0.46, f % 2 === 0 ? C.white : C.softNeutral);
    addText(slide, nombre, {
      x: M + 0.24,
      y: y + 0.02,
      w: 2.9,
      h: 0.42,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    });
    valores.forEach((v, i) => {
      addText(slide, v, {
        x: X0 + i * CW_COL,
        y: y + 0.02,
        w: CW_COL,
        h: 0.42,
        fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
        fontSize: 13,
        bold: true,
        color: v === "T" ? VERDE : ROJO,
        align: "center",
        valign: "mid",
      });
    });
  });

  const yr = 3.1 + 3 * 0.52;
  rect(slide, M, yr, CW, 0.5, C.warm);
  rect(slide, M, yr, 0.06, 0.5, ORO);
  addText(slide, "Permitir reserva", {
    x: M + 0.24,
    y: yr + 0.02,
    w: 2.9,
    h: 0.46,
    fontSize: 12.6,
    bold: true,
    color: C.ink,
    valign: "mid",
  });
  RES.forEach((v, i) => {
    addText(slide, v, {
      x: X0 + i * CW_COL,
      y: yr + 0.02,
      w: CW_COL,
      h: 0.46,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 15,
      bold: true,
      color: v === "T" ? VERDE : ROJO,
      align: "center",
      valign: "mid",
    });
  });

  rect(slide, M, 5.36, CW, 0.94, C.white);
  rect(slide, M, 5.36, 0.07, 0.94, AZUL);
  addText(
    slide,
    "Solo T1 permite reservar: es la única columna donde las tres condiciones se cumplen.\nEsta tabla modela entradas de la función, no ocho situaciones físicas distintas del laboratorio.",
    {
      x: M + 0.36,
      y: 5.52,
      w: CW - 0.72,
      h: 0.62,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addFuente(
    slide,
    M,
    6.5,
    "ISO/IEC/IEEE 29119-4:2021 distingue la tabla, la regla y la técnica en sus cláusulas 3.22 a 3.24; el syllabus ISTQB CTFL desarrolla su construcción en la sección 4.2.3.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideTablaReducida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · reducir sin perder nada",
    "Cuatro reglas en vez de ocho columnas",
    "Si V es falsa, cambiar L o C no cambia el rechazo. Esas columnas se pueden agrupar.",
    false
  );

  const FILAS = [
    ["V: bloque válido", ["F", "T", "T", "T"]],
    ["L: bloque libre", ["—", "F", "T", "T"]],
    ["C: cupo semanal", ["—", "—", "F", "T"]],
  ];
  const RES = ["F", "F", "F", "T"];
  const REP = ["T5–T8", "T3–T4", "T2", "T1"];
  const CNT = ["4", "2", "1", "1"];
  const X0 = M + 3.2;
  const CW_COL = (CW - 3.2) / 4;

  rect(slide, M, 2.5, CW, 0.42, C.navy);
  addText(slide, "CONDICIÓN / RESULTADO", {
    x: M + 0.24,
    y: 2.52,
    w: 2.9,
    h: 0.38,
    fontSize: 9.2,
    bold: true,
    color: C.white,
    valign: "mid",
    charSpacing: 1,
  });
  ["R1", "R2", "R3", "R4"].forEach((r, i) => {
    addText(slide, r, {
      x: X0 + i * CW_COL,
      y: 2.52,
      w: CW_COL,
      h: 0.38,
      fontSize: 12,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
  });

  const pinta = (v) => (v === "T" ? VERDE : v === "F" ? ROJO : ORO);
  FILAS.forEach(([nombre, valores], f) => {
    const y = 2.98 + f * 0.5;
    rect(slide, M, y, CW, 0.44, f % 2 === 0 ? C.white : C.softNeutral);
    addText(slide, nombre, {
      x: M + 0.24,
      y: y + 0.02,
      w: 2.9,
      h: 0.4,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    });
    valores.forEach((v, i) => {
      addText(slide, v, {
        x: X0 + i * CW_COL,
        y: y + 0.02,
        w: CW_COL,
        h: 0.4,
        fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
        fontSize: 14,
        bold: true,
        color: pinta(v),
        align: "center",
        valign: "mid",
      });
    });
  });

  const yr = 2.98 + 3 * 0.5;
  rect(slide, M, yr, CW, 0.48, C.warm);
  rect(slide, M, yr, 0.06, 0.48, ORO);
  addText(slide, "Permitir reserva", {
    x: M + 0.24,
    y: yr + 0.02,
    w: 2.9,
    h: 0.44,
    fontSize: 12.6,
    bold: true,
    color: C.ink,
    valign: "mid",
  });
  RES.forEach((v, i) => {
    addText(slide, v, {
      x: X0 + i * CW_COL,
      y: yr + 0.02,
      w: CW_COL,
      h: 0.44,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 15,
      bold: true,
      color: pinta(v),
      align: "center",
      valign: "mid",
    });
  });

  addText(slide, "Columnas que representa", {
    x: M + 0.24,
    y: 5.02,
    w: 2.9,
    h: 0.24,
    fontSize: 10.4,
    italic: true,
    color: C.slate,
  });
  REP.forEach((r, i) => {
    addText(slide, `${r}  (${CNT[i]})`, {
      x: X0 + i * CW_COL,
      y: 5.02,
      w: CW_COL,
      h: 0.24,
      fontSize: 10.4,
      color: C.slate,
      align: "center",
    });
  });

  rect(slide, M, 5.42, CW, 0.92, C.paleRed);
  rect(slide, M, 5.42, 0.07, 0.92, ROJO);
  addKicker(slide, M + 0.36, 5.58, "Qué significa el guion, y qué no", ROJO, 6);
  addText(
    slide,
    "El «—» significa que ambos valores conducen al mismo resultado en esa regla. NO significa desconocido, ni sin\nespecificar, ni «no se probó». No sirve para esconder una decisión pendiente.",
    {
      x: M + 0.36,
      y: 5.82,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "No se eliminaron requisitos: se comprimió su representación.",
    { y: 6.5, h: 0.5, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

function slideReduccionComprobada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · comprobar",
    "La reducción se verifica expandiéndola otra vez",
    "Para cada una de las ocho combinaciones tiene que existir una regla reducida que produzca el mismo resultado.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: CW,
    h: 1.9,
    title: "Las ocho combinaciones, contrastadas contra la tabla reducida",
    fontSize: 10.4,
    lines: [
      { text: "combinaciones: 8" },
      { text: "combinaciones por regla: {'R1': 4, 'R2': 2, 'R3': 1, 'R4': 1}" },
      { text: "huecos: 0; solapamientos: 0; desacuerdos con la tabla completa: 0", kind: "success" },
    ],
  });

  const notas = [
    ["Sin huecos", "Cada combinación encuentra una regla.", VERDE, C.successSoft],
    ["Sin solapamientos", "Ninguna coincide con dos reglas a la vez.", VERDE, C.successSoft],
    ["Sin desacuerdos", "El resultado reducido coincide con el completo.", VERDE, C.successSoft],
  ];
  notas.forEach(([titulo, texto, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 4.58, 3.79, 0.82, fondo);
    rect(slide, x, 4.58, 3.79, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.7,
      w: 3.24,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 4.98,
      w: 3.24,
      h: 0.34,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 5.62, CW, 0.96, C.white);
  rect(slide, M, 5.62, 0.07, 0.96, AZUL);
  addText(
    slide,
    "Esto no demuestra que ejecutar un caso por columna compruebe todas sus combinaciones en la implementación.\nLa equivalencia entre tablas es una propiedad del modelo; la conformidad del programa exige evidencia aparte.",
    {
      x: M + 0.36,
      y: 5.8,
      w: CW - 0.72,
      h: 0.62,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  validateSlide(slide, pptx);
}

function slideDeColumnaAFila() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · de la tabla al código",
    "Cada regla necesita valores concretos para ejecutarse",
    "Una columna lógica no se puede ejecutar. Hay que elegir un representante para cada condición.",
    false
  );

  const CAB = ["Regla", "Reservas", "Bloque", "tomado", "Esperado", "Qué representa"];
  const COLS = [1.3, 1.5, 1.3, 1.4, 1.5, 4.89];
  const XS = [M];
  COLS.forEach((w, i) => XS.push(XS[i] + w));

  rect(slide, M, 2.5, CW, 0.4, C.navy);
  CAB.forEach((t, i) => {
    addText(slide, t.toUpperCase(), {
      x: XS[i] + 0.16,
      y: 2.52,
      w: COLS[i] - 0.2,
      h: 0.36,
      fontSize: 8.8,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 0.9,
    });
  });

  const FILAS = [
    ["R1", "1", "0", "False", "False", "Fuera de la jornada.", ROJO],
    ["R2", "1", "4", "True", "False", "Dentro, pero ocupado.", ROJO],
    ["R3", "3", "4", "False", "False", "Dentro y libre, sin cupo semanal.", ROJO],
    ["R4", "1", "4", "False", "True", "Las tres condiciones permiten reservar.", VERDE],
  ];
  FILAS.forEach((fila, i) => {
    const y = 2.96 + i * 0.5;
    const tinta = fila[6];
    rect(slide, M, y, CW, 0.44, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.44, tinta);
    fila.slice(0, 6).forEach((t, j) => {
      addText(slide, t, {
        x: XS[j] + 0.16,
        y: y + 0.02,
        w: COLS[j] - 0.2,
        h: 0.4,
        fontFace: j > 0 && j < 5 ? TYPOGRAPHY.mono || TYPOGRAPHY.body : TYPOGRAPHY.body,
        fontSize: j === 5 ? 11.4 : 11.6,
        bold: j === 0 || j === 4,
        color: j === 4 ? tinta : C.ink,
        valign: "mid",
      });
    });
  });

  rect(slide, M, 5.06, CW, 0.94, C.warm);
  rect(slide, M, 5.06, 0.07, 0.94, ORO);
  addKicker(slide, M + 0.36, 5.22, "En R1 la tabla decía «—» y aquí aparecen valores", ORO, 7);
  addText(
    slide,
    "La función necesita argumentos concretos para ejecutarse. Lo indiferente es su efecto esperado sobre la decisión,\nno la necesidad de proporcionar un valor.",
    {
      x: M + 0.36,
      y: 5.46,
      w: CW - 0.72,
      h: 0.46,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "La tabla de decisión se convierte en la lista de casos de una parametrización, ahora con cuatro nombres.",
    { y: 6.16, h: 0.56, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

function slideCuatroReglasYElOcho() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · comprobar",
    "Las cuatro reglas pasan, y aun así falta algo",
    "Se agrega un quinto caso: la misma regla R4, pero con un representante del límite.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 1.86,
    title: "El quinto caso",
    code: [
      "def test_regla_permitida_incluye_el_bloque_8() -> None:",
      "    assert puede_reservar(1, 8, tomado=False) is True",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addTerminalPanel(slide, SH, {
    x: 6.98,
    y: 2.5,
    w: 5.63,
    h: 1.86,
    title: "Las cinco pruebas juntas",
    fontSize: 8.6,
    lines: [
      { text: "E   assert False is True", kind: "error" },
      { text: "E    +  where False = puede_reservar(1, 8, ...)", kind: "error" },
      { text: "1 failed, 4 passed in 0.10s", kind: "error" },
    ],
  });

  rect(slide, M, 4.54, CW, 1.14, C.softBlue);
  rect(slide, M, 4.54, 0.07, 1.14, AZUL);
  addKicker(slide, M + 0.36, 4.72, "Las tres técnicas de hoy, trabajando juntas", AZUL, 7);
  addText(
    slide,
    "El quinto caso no descubre una quinta regla: comprueba R4 con un valor que la implementación trata mal.\nLa TABLA selecciona la combinación de condiciones, la PARTICIÓN identifica sus clases, y los LÍMITES\nayudan a elegir un representante sensible al defecto.",
    {
      x: M + 0.36,
      y: 4.96,
      w: CW - 0.72,
      h: 0.66,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "«Cuatro reglas representadas» no equivale a «todas las entradas verificadas». Quedan fuera otros valores dentro de las clases, tipos inesperados y efectos concurrentes.",
    { y: 5.86, h: 0.64, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

function slideCuandoSeEsperaUnError() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · otro contrato",
    "Cuando lo esperado es que la función lance un error",
    "Devolver un booleano y lanzar una excepción son contratos distintos. Hace falta una función con el segundo.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 0);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.05,
    h: 1.86,
    title: "Una función auxiliar, con contrato explícito",
    code: [
      "def exigir_bloque(bloque: int) -> int:",
      "    if not 1 <= bloque <= 8:",
      '        raise ValueError("bloque fuera de jornada")',
      "    return bloque",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  rect(slide, 6.98, 2.5, 5.63, 1.86, C.warm);
  rect(slide, 6.98, 2.5, 0.07, 1.86, ORO);
  addKicker(slide, 7.32, 2.68, "Qué hace raise", ORO, 4.4);
  addText(
    slide,
    "Interrumpe la ejecución normal y lanza la excepción. En ese recorrido nunca se alcanza el «return»: la función no devuelve nada.",
    {
      x: 7.32,
      y: 2.96,
      w: 5.0,
      h: 1.2,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.2,
    }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 4.54,
    w: CW,
    h: 1.86,
    title: "La prueba tiene que exigir ese desenlace, no un valor de retorno",
    code: [
      '@pytest.mark.parametrize("bloque", [0, 9], ids=["antes", "despues"])',
      "def test_rechaza_bloques_fuera_de_jornada(bloque: int) -> None:",
      '    with pytest.raises(ValueError, match="^bloque fuera de jornada$"):',
      "        exigir_bloque(bloque)",
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  addTakeaway(
    slide,
    "No corresponde envolver puede_reservar() en raises solo porque el caso use una entrada inválida: esa función devuelve False, no lanza nada.",
    { y: 6.5, h: 0.52, fontSize: 12.4, fill: ROJO }
  );

  validateSlide(slide, pptx);
}

function slideRaisesPorPartes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · leer la sintaxis",
    "pytest.raises, pieza por pieza",
    "Aunque no aparezca la palabra assert, sí hay una comprobación: el gestor exige la excepción.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 2);

  const piezas = [
    ["with", "Delimita un bloque cuya entrada y salida administra un gestor de contexto. Aquí ese gestor es pytest.raises.", AZUL],
    ["pytest.raises(ValueError, ...)", "Exige que el bloque lance ValueError o una subclase. Si no ocurre, la prueba falla.", ORO],
    ["la llamada indentada", "Es la operación vigilada. Tiene que ejecutarse dentro del with, y solo ella.", ORO],
    ['match="^bloque fuera de jornada$"', "Comprueba el mensaje con una expresión regular. El ^ y el $ delimitan el texto exacto.", ORO],
    ["salir del with", "Si ocurrió la excepción esperada y el mensaje coincide, la prueba continúa.", VERDE],
  ];
  piezas.forEach(([pieza, texto, tinta], i) => {
    const y = 2.5 + i * 0.56;
    rect(slide, M, y, CW, 0.5, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.5, tinta);
    addText(slide, pieza, {
      x: M + 0.28,
      y: y + 0.02,
      w: 3.5,
      h: 0.46,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 10.2,
      bold: true,
      color: tinta,
      valign: "mid",
    });
    addText(slide, texto, {
      x: M + 4.0,
      y: y + 0.02,
      w: CW - 4.36,
      h: 0.46,
      fontSize: 11.6,
      color: C.ink,
      valign: "mid",
    });
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.42,
    w: 5.5,
    h: 1.4,
    title: "Los dos casos, sobre la función correcta",
    fontSize: 9.8,
    lines: [{ text: "2 passed, 1 deselected in 0.02s", kind: "success" }],
  });

  addTerminalPanel(slide, SH, {
    x: 6.42,
    y: 5.42,
    w: 6.19,
    h: 1.4,
    title: "Y con el raise sustituido por return, en una copia",
    fontSize: 9.2,
    lines: [
      { text: "E   Failed: DID NOT RAISE ValueError", kind: "error" },
      { text: "2 failed, 1 deselected in 0.03s", kind: "error" },
    ],
  });

  validateSlide(slide, pptx);
}

function slideLaTrampaDelRaises() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la prueba que engaña",
    "Una prueba verde que captura su propio fracaso",
    "Este código parece comprobar el bloque 8. Su exigencia real es otra, y termina en verde sobre el defecto.",
    false,
    { subtitleW: 7.9 }
  );
  addPasosLectura(slide, 8.93, 2.06, 1);

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.6,
    h: 1.86,
    title: "Bien formateada, con un nombre convincente",
    code: [
      "def test_que_oculta_el_defecto() -> None:",
      "    with pytest.raises(Exception):",
      "        assert puede_reservar(1, 8, tomado=False) is True",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  addTerminalPanel(slide, SH, {
    x: 7.52,
    y: 2.5,
    w: 5.09,
    h: 1.4,
    title: "Sobre la implementación defectuosa",
    fontSize: 9.8,
    lines: [{ text: "1 passed, 2 deselected in 0.02s", kind: "error" }],
  });

  const pasos = [
    ["1. La función devuelve False", "El bloque 8 está rechazado por el defecto.", ROJO],
    ["2. El assert lanza AssertionError", "Porque False no es True.", ROJO],
    ["3. raises(Exception) lo acepta", "AssertionError es una subclase de Exception.", ROJO],
  ];
  pasos.forEach(([titulo, texto, tinta], i) => {
    const y = 4.5 + i * 0.6;
    rect(slide, M, y, CW, 0.54, C.paleRed);
    rect(slide, M, y, 0.05, 0.54, tinta);
    addText(slide, titulo, {
      x: M + 0.28,
      y: y + 0.02,
      w: 4.2,
      h: 0.5,
      fontSize: 12.4,
      bold: true,
      color: tinta,
      valign: "mid",
    });
    addText(slide, texto, {
      x: M + 4.7,
      y: y + 0.02,
      w: CW - 5.06,
      h: 0.5,
      fontSize: 12,
      color: C.ink,
      valign: "mid",
    });
  });

  addTakeaway(
    slide,
    "La prueba exigía que se produjera alguna excepción, incluida la de su propia aserción. La corrección es quitar el raises: el contrato de puede_reservar() no exige ninguna.",
    { y: 6.34, h: 0.6, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

function slideLeerUnaPruebaAjena() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el método de lectura",
    "Tres preguntas para leer cualquier prueba",
    "Sirven sin importar quién la escribió: una persona, un compañero o un agente.",
    false
  );

  const partes = [
    ["Preparar", "Arrange", "¿Qué datos y qué estado se fijaron?", "La fila entrega reservas, bloque, ocupación y esperado.", AZUL, C.softBlue],
    ["Ejecutar", "Act", "¿Qué operación del sistema se puso a prueba?", "La llamada a puede_reservar().", ORO, C.warm],
    ["Afirmar", "Assert", "¿Qué discrepancia haría fallar la prueba?", "Que el booleano obtenido no sea el esperado.", VERDE, C.successSoft],
  ];
  partes.forEach(([titulo, ingles, pregunta, ejemplo, tinta, fondo], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 2.54, 3.79, 2.1, fondo);
    rect(slide, x, 2.54, 3.79, 0.07, tinta);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.74,
      w: 1.95,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: tinta,
    });
    addText(slide, ingles, {
      x: x + 2.42,
      y: 2.82,
      w: 1.1,
      h: 0.26,
      fontSize: 11,
      italic: true,
      color: C.slate,
      align: "right",
    });
    addText(slide, pregunta, {
      x: x + 0.28,
      y: 3.2,
      w: 3.24,
      h: 0.56,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    addText(slide, ejemplo, {
      x: x + 0.28,
      y: 3.86,
      w: 3.24,
      h: 0.66,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
  });

  rect(slide, M, 4.86, CW, 1.0, C.white);
  rect(slide, M, 4.86, 0.07, 1.0, ROJO);
  addKicker(slide, M + 0.36, 5.04, "Son responsabilidades, no tres párrafos de código", ROJO, 7);
  addText(
    slide,
    "En la prueba con «raises», la expectativa se declara ANTES de ejecutar la operación vigilada, y aun así están las\ntres partes. Por eso una prueba se lee por lo que afirma, no contando cuántas veces aparece la palabra assert.",
    {
      x: M + 0.36,
      y: 5.28,
      w: CW - 0.72,
      h: 0.5,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "En sistemas que crean archivos, datos o conexiones puede haber además una fase de limpieza posterior.",
    { y: 6.04, h: 0.54, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

function slideVocabularioEntreEntornos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · leer fuera de Python",
    "La misma exigencia, con otras palabras",
    "El vocabulario cambia entre herramientas. La exigencia de un booleano verdadero se reconoce igual.",
    false
  );

  const CAB = ["Entorno", "Fragmento", "Cómo se lee"];
  const COLS = [3.0, 4.4, 4.49];
  const XS = [M];
  COLS.forEach((w, i) => XS.push(XS[i] + w));

  rect(slide, M, 2.5, CW, 0.4, C.navy);
  CAB.forEach((t, i) => {
    addText(slide, t.toUpperCase(), {
      x: XS[i] + 0.2,
      y: 2.52,
      w: COLS[i] - 0.26,
      h: 0.36,
      fontSize: 9.2,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 1,
    });
  });

  const FILAS = [
    ["Python / pytest", "assert obtenido is True", "Exige el booleano True."],
    ["TypeScript / Vitest", "expect(obtenido).toBe(true)", "«expect» recibe el obtenido; «toBe» aplica la comparación."],
    ["Java / AssertJ", "assertThat(obtenido).isTrue()", "«assertThat» inicia la afirmación; «isTrue» exige verdadero."],
    ["JavaScript / Chai", "obtenido.should.equal(true)", "Encadena la expectativa mediante «should»."],
  ];
  FILAS.forEach(([entorno, frag, lectura], i) => {
    const y = 2.96 + i * 0.52;
    rect(slide, M, y, CW, 0.46, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.46, i === 0 ? VERDE : AZUL);
    addText(slide, entorno, {
      x: XS[0] + 0.2,
      y: y + 0.02,
      w: COLS[0] - 0.26,
      h: 0.42,
      fontSize: 11.8,
      bold: true,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, frag, {
      x: XS[1] + 0.2,
      y: y + 0.02,
      w: COLS[1] - 0.26,
      h: 0.42,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 10.6,
      color: i === 0 ? VERDE : AZUL,
      valign: "mid",
    });
    addText(slide, lectura, {
      x: XS[2] + 0.2,
      y: y + 0.02,
      w: COLS[2] - 0.26,
      h: 0.42,
      fontSize: 11.4,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 5.1, CW, 0.84, C.paleRed);
  rect(slide, M, 5.1, 0.07, 0.84, ROJO);
  addText(
    slide,
    "«expect», «assertThat» y «should» no son palabras del lenguaje ni significan «ejecutar un test»: son entradas a APIs\nde aserciones. El método que sigue —el matcher— es el que determina qué comparación se hace.",
    {
      x: M + 0.36,
      y: 5.26,
      w: CW - 0.72,
      h: 0.54,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 6.02,
    w: 10.7,
    h: 0.96,
    title: "Con excepciones cambia además quién ejecuta la operación",
    code: [
      "expect(() => exigirBloque(9)).toThrow(Error);   // se entrega la funcion, sin llamarla",
    ].join("\n"),
    lang: "javascript",
    fontSize: 9.8,
  });

  validateSlide(slide, pptx);
}

function slidePreguntasB4() {
  slidePreguntas(4, "Preguntas para llevarse del Bloque 4", [
    [
      "La tabla reducida tiene cuatro reglas y la completa ocho columnas, y se comprobó que no hay huecos ni desacuerdos. ¿Qué queda demostrado sobre el modelo, y qué sigue sin demostrarse sobre el programa?",
      "Una cosa es que dos tablas describan lo mismo; otra es que el código haga lo que la tabla dice.",
    ],
    [
      "En la prueba que termina en verde ocultando el defecto, ¿quién lanza la excepción que «raises» captura: la función del sistema o la aserción?",
      "Sigue el recorrido: qué devuelve la función, qué hace el assert con ese valor, y de qué clase es ese error.",
    ],
    [
      "Un agente cambia el esperado de una fila de rechazo de False a True porque la prueba fallaba. ¿Qué referencia necesitaría para justificar ese cambio, y qué le faltaría si solo mostrara una ejecución en verde?",
      "El verde es una observación. Lo que decide un esperado está en otro documento.",
    ],
  ]);
}

function slideRespuestasB4() {
  slideRespuestas(4, "Lo que tenía que aparecer en tu respuesta", [
    [
      "Equivalencia del modelo contra conformidad del programa",
      "Queda demostrado que la tabla reducida representa las ocho combinaciones. No que ejecutar un caso por regla compruebe todas las entradas.",
      "Por eso el quinto caso, con el bloque 8 dentro de R4, encontró un defecto que las cuatro reglas no veían.",
    ],
    [
      "Quién lanza la excepción",
      "La aserción. La función devuelve False, el assert lanza AssertionError, y como es subclase de Exception, el raises lo acepta.",
      "La prueba exigía que ocurriera alguna excepción, incluida la de su propio fracaso: nunca pudo fallar.",
    ],
    [
      "Qué justifica cambiar un resultado esperado",
      "El requisito, o una decisión registrada de quien puede tomarla. Nunca la ejecución que falló.",
      "Un verde obtenido cambiando el esperado no prueba que el sistema mejore: prueba que se bajó la exigencia.",
    ],
  ]);
}

// ==================================================================== CIERRE

function slideCierreTecnicas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre",
    "Tres técnicas, tres preguntas que se complementan",
    "Las tres parten de una expectativa externa a la implementación. Ninguna mira el código.",
    false
  );

  const CAB = ["Técnica", "Pregunta que responde", "Lo que NO garantiza"];
  const COLS = [3.2, 4.6, 4.09];
  const XS = [M];
  COLS.forEach((w, i) => XS.push(XS[i] + w));

  rect(slide, M, 2.5, CW, 0.4, C.navy);
  CAB.forEach((t, i) => {
    addText(slide, t.toUpperCase(), {
      x: XS[i] + 0.2,
      y: 2.52,
      w: COLS[i] - 0.26,
      h: 0.36,
      fontSize: 9.2,
      bold: true,
      color: C.white,
      valign: "mid",
      charSpacing: 1,
    });
  });

  const FILAS = [
    ["Partición de equivalencia", "¿Qué valores se espera que reciban un trato similar?", "Que todos los miembros se comporten como su representante.", ORO],
    ["Valores límite", "¿Qué ocurre donde cambia la pertenencia a una clase?", "Que el interior no tenga defectos, ni que un umbral ambiguo se resuelva solo.", ROJO],
    ["Tabla de decisión", "¿Qué debe ocurrir cuando coinciden varias condiciones?", "Que un representante por regla compruebe todas sus entradas.", VERDE],
  ];
  FILAS.forEach(([tec, preg, no, tinta], i) => {
    const y = 2.96 + i * 0.72;
    rect(slide, M, y, CW, 0.66, i % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.66, tinta);
    addText(slide, tec, {
      x: XS[0] + 0.2,
      y: y + 0.02,
      w: COLS[0] - 0.26,
      h: 0.62,
      fontSize: 12.6,
      bold: true,
      color: tinta,
      valign: "mid",
    });
    addText(slide, preg, {
      x: XS[1] + 0.2,
      y: y + 0.02,
      w: COLS[1] - 0.26,
      h: 0.62,
      fontSize: 11.8,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, no, {
      x: XS[2] + 0.2,
      y: y + 0.02,
      w: COLS[2] - 0.26,
      h: 0.62,
      fontSize: 11.4,
      color: C.ink,
      valign: "mid",
    });
  });

  addKicker(slide, M, 5.26, "Y la sintaxis convierte esa decisión en evidencia ejecutable", C.ink, 8);

  const formas = [
    ["Exigir un booleano exacto", "assert obtenido is esperado"],
    ["Repetir la comprobación por filas", "@pytest.mark.parametrize(...)"],
    ["Admitir un error numérico justificado", "== pytest.approx(..., rel=0, abs=...)"],
    ["Exigir una excepción del sistema", "with pytest.raises(...)"],
  ];
  formas.forEach(([que, como], i) => {
    const x = M + (i % 2) * 6.03;
    const y = 5.58 + Math.floor(i / 2) * 0.52;
    rect(slide, x, y, 5.86, 0.44, C.warm);
    rect(slide, x, y, 0.05, 0.44, ORO);
    addText(slide, que, {
      x: x + 0.26,
      y: y + 0.02,
      w: 2.9,
      h: 0.4,
      fontSize: 10.8,
      color: C.ink,
      valign: "mid",
    });
    addText(slide, como, {
      x: x + 3.2,
      y: y + 0.02,
      w: 2.5,
      h: 0.4,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 9.4,
      bold: true,
      color: ORO,
      valign: "mid",
    });
  });

  addFuente(
    slide,
    M,
    6.7,
    "Ninguna de esas formas reemplaza la lectura del contrato: una aserción puede estar bien escrita y exigir lo equivocado.",
    { w: 11.6 }
  );

  validateSlide(slide, pptx);
}

function slideCierreAfirmacion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre",
    "Qué se puede afirmar al terminar, y qué no",
    "",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.14,
    w: CW,
    h: 1.42,
    title: "Lo que la sesión anterior permitió afirmar",
    code: [
      "La comparacion se hizo con un procedimiento declarado,",
      "y su resultado puede repetirlo alguien que no estuvo.",
    ].join("\n"),
    lang: "bash",
    fontSize: 11,
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 3.7,
    w: CW,
    h: 1.42,
    title: "Lo que agrega el diseño de casos",
    code: [
      "Los casos elegidos tienen un argumento: representan clases, limites y reglas.",
      "Cada expectativa tiene una referencia, y las omisiones estan declaradas.",
    ].join("\n"),
    lang: "bash",
    fontSize: 10.4,
  });

  rect(slide, M, 5.26, CW, 0.86, C.paleRed);
  rect(slide, M, 5.26, 0.07, 0.86, ROJO);
  addKicker(slide, M + 0.36, 5.42, "Lo que sigue sin poder afirmarse", ROJO, 6);
  addText(
    slide,
    "El sistema funciona para todas las entradas y no tiene más defectos.",
    {
      x: M + 0.36,
      y: 5.66,
      w: CW - 0.72,
      h: 0.36,
      fontSize: 15,
      bold: true,
      color: ROJO,
    }
  );

  addTakeaway(
    slide,
    "Quedó evidencia concreta de ese límite: representantes en verde que omiten el bloque 8, un esperado copiado del código, y una prueba que captura su propio fallo. Las dos horas exactas siguen sin decidirse.",
    { y: 6.26, h: 0.66, fontSize: 12.4 }
  );

  validateSlide(slide, pptx);
}

function slideCierreProxima() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Cierre",
    "Lo que se aprende mirando hacia adentro",
    "",
    true
  );

  addText(
    slide,
    "Las tres técnicas de hoy organizan lo que el sistema debe hacer. Ninguna mira el código.\nFalta relacionar esas pruebas con lo que realmente recorren dentro del programa.",
    {
      x: M,
      y: 2.12,
      w: CW,
      h: 0.8,
      fontSize: 16,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  const proximos = [
    ["Caja negra y caja blanca", "La tensión que dejó abierta Dijkstra, con las dos posiciones sobre la mesa.", C.gold],
    ["Cobertura", "Permite observar parte de ese recorrido. Habrá que preguntar qué se comprobó al recorrerlo.", C.softBlue],
    ["Dobles de prueba", "Sustitutos de dependencias que aíslan un comportamiento, y pueden dejar fuera justo la interacción que interesaba.", C.white],
  ];
  proximos.forEach(([titulo, texto, tinta], i) => {
    const x = M + i * 4.07;
    rect(slide, x, 3.14, 3.79, 1.5, NAVY_CHIP);
    rect(slide, x, 3.14, 3.79, 0.06, tinta);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 3.34,
      w: 3.24,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: tinta,
    });
    addText(slide, texto, {
      x: x + 0.28,
      y: 3.7,
      w: 3.24,
      h: 0.82,
      fontSize: 11.8,
      color: C.white,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 5.0, CW, 1.5, NAVY_CHIP);
  rect(slide, M, 5.0, 0.07, 1.5, C.gold);
  addText(
    slide,
    "«Elegir casos es decidir qué evidencia se va a buscar y qué quedará fuera. Escribir una prueba es volver esa\ndecisión comprobable. Un agente puede ayudar en ambas tareas; el criterio se conserva cuando se puede\nexplicar de dónde salió cada esperado, qué haría fallar la prueba y qué no se podrá concluir aunque\ntermine en verde.»",
    {
      x: M + 0.4,
      y: 5.18,
      w: CW - 0.8,
      h: 1.16,
      fontSize: 14,
      italic: true,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  validateSlide(slide, pptx);
}

// ==================================================================== ORDEN

slidePortada();
slidePreguntaDeEntrada();
slideElProyecto();
slideComoSeLeeUnaLlamada();
slideCapacidad();
slideDeDondeViene();
slideMapa();
slideComoSeLee();

slideDivisorB1();
slideSuiteHeredada();
slideSiempreElTres();
slideLeerLaFuncion();
slideLaMedicion();
slideElOraculo();
slideLasSesentaYCuatro();
slideElOraculoDefinido();
slideDosRazones();
slideDijkstraFrase();
slideDijkstraMultiplicador();
slideAuditarElNumero();
slideMuestreoYClases();
slideTensionAbierta();
slideTodaSuiteEsMuestra();
slideElAgente();
slidePreguntasB1();
slideRespuestasB1();

slideDivisorB2();
slideQueEsUnaParticion();
slideComoSeLeenLasCondiciones();
slideDefinicionParticion();
slideLasTresClases();
slideRevisarLaParticion();
slideQueRepresentaLaSuite();
slideUnaFilaEsUnaPrueba();
slideQueEsUnaAsercion();
slideIsVsIgual();
slideSinAssert();
slidePorQueParametrizar();
slideParametrizePorPartes();
slideEjecutarYLeer();
slideOchoNoDetectado();
slidePreguntasB2();
slideRespuestasB2();

slideDivisorB3();
slideQueEsUnValorLimite();
slideLasDosTransiciones();
slideDosVariantes();
slideCuandoLaAmpliacionPaga();
slideDosSuitesUnMismoOcho();
slideElResultadoDeLasDosSuites();
slideBordesAuditados();
slideJustoAntesNecesitaUnidad();
slideResolucionNoEsPrecision();
slidePorQueApprox();
slideApproxPorPartes();
slideLaToleranciaEsCriterio();
slidePreguntasB3();
slideRespuestasB3();

slideDivisorB4();
slideTresCondiciones();
slideTablaCompleta();
slideTablaReducida();
slideReduccionComprobada();
slideDeColumnaAFila();
slideCuatroReglasYElOcho();
slideCuandoSeEsperaUnError();
slideRaisesPorPartes();
slideLaTrampaDelRaises();
slideLeerUnaPruebaAjena();
slideVocabularioEntreEntornos();
slidePreguntasB4();
slideRespuestasB4();

slideCierreTecnicas();
slideCierreAfirmacion();
slideCierreProxima();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
