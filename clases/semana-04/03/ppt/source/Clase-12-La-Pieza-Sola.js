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
  subject: "PRO402 · Clase 12",
  title: "La pieza sola no es el sistema",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-12-La-Pieza-Sola.pptx");

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

// ---------------------------------------------------------------------------
// 01 · Portada

// ---------------------------------------------------------------------------
// Firma visual de la clase: el recorrido de trabajo en cuatro pasos.

const RUTA = [
  ["Conectar", "Dejar de sustituir lo que se quiere observar"],
  ["Aislar", "Que el resultado no dependa del orden"],
  ["Borrar", "Y comprobar que se borró"],
  ["Decidir", "Qué se sustituye y qué no"],
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
  addKicker(slide, M, 1.42, "PRO402 · Clase 12 · Unidad 2", C.gold, 6);
  addText(slide, "La pieza sola no es el sistema", {
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
  addText(slide, "Integración, la fixture que decide qué datos existen y el doble que deja de ser legítimo", {
    x: M,
    y: 3.4,
    w: 11.2,
    h: 0.46,
    fontSize: 18,
    color: C.softBlue,
  });
  addText(
    slide,
    "Una prueba de integración no es una prueba más grande. Es una prueba que deja de sustituir aquello que quiere observar. Y en el momento en que deja de sustituirlo, aparecen datos que existen de verdad y que alguien tiene que borrar.",
    {
      x: M,
      y: 4.1,
      w: 10.2,
      h: 0.86,
      fontSize: 14.4,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  rule(slide, M, 5.46, CW, NAVY_RULE, 1);
  addText(slide, "Miércoles 23 de septiembre de 2026 · 08:30 – 10:50 · Laboratorio PC", {
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

function slideOpeningQuestion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Para abrir",
    "Dieciséis pruebas en verde. ¿Está probado el sistema?",
    "Las funciones del proyecto están verificadas una por una. La pregunta es qué queda fuera de esas dieciséis pruebas.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const columnas = [
    {
      x: M,
      titulo: "Lo que sí quedó comprobado",
      color: VERDE,
      fondo: C.softNeutral,
      puntos: [
        "puede_reservar decide bien: los casos salieron de partición de equivalencia y valores límite.",
        "cabe_en_sala decide bien: se vio en rojo antes de que existiera el código que la apaga.",
        "Las dos son funciones verificadas en el sentido más estricto del módulo.",
      ],
    },
    {
      x: M + 6.05,
      titulo: "Lo que nadie comprobó todavía",
      color: ROJO,
      fondo: C.warm,
      puntos: [
        "Que alguien llegue a llamarlas: un usuario no llama a puede_reservar.",
        "Que lo que llega por la red tenga la forma que la función espera.",
        "Que la respuesta vuelva con el significado correcto para quien la recibe.",
      ],
    },
  ];

  columnas.forEach(({ x, titulo, color, fondo, puntos }) => {
    rect(slide, x, 2.46, 5.84, 3.44, fondo);
    rect(slide, x, 2.46, 5.84, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.3,
      y: 2.68,
      w: 5.24,
      h: 0.22,
      fontSize: 9.6,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    puntos.forEach((punto, index) => {
      const y = 3.06 + index * 0.92;
      rect(slide, x + 0.3, y + 0.08, 0.05, 0.62, color);
      addText(slide, punto, {
        x: x + 0.52,
        y,
        w: 5.02,
        h: 0.78,
        fontSize: 12.2,
        color: C.ink,
        lineSpacingMultiple: 1.16,
      });
    });
  });

  addTakeaway(slide, "Verde unitario dice que cada pieza decide bien. No dice nada de lo que pasa entre ellas.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · La tesis: dónde vive el defecto

function slideWhereDefectsLive() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "La tesis de la sesión",
    "Entre dos piezas correctas hay un tercer lugar donde fallar",
    "El acuerdo sobre la forma del dato que viaja no está escrito dentro de ninguna de las dos piezas.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const cajaY = 2.62;
  const cajaH = 1.58;

  rect(slide, M, cajaY, 3.62, cajaH, C.white);
  rect(slide, M, cajaY, 3.62, 0.06, VERDE);
  addKicker(slide, M + 0.28, cajaY + 0.26, "Pieza verificada", VERDE, 3.1);
  addText(slide, "La ruta HTTP", {
    x: M + 0.28,
    y: cajaY + 0.54,
    w: 3.06,
    h: 0.32,
    fontSize: 15.6,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Recibe la solicitud, la valida y responde.", {
    x: M + 0.28,
    y: cajaY + 0.92,
    w: 3.06,
    h: 0.5,
    fontSize: 11.4,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M + 8.27, cajaY, 3.62, cajaH, C.white);
  rect(slide, M + 8.27, cajaY, 3.62, 0.06, VERDE);
  addKicker(slide, M + 8.55, cajaY + 0.26, "Pieza verificada", VERDE, 3.1);
  addText(slide, "puede_reservar", {
    x: M + 8.55,
    y: cajaY + 0.54,
    w: 3.06,
    h: 0.32,
    fontSize: 15.6,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Decide si la reserva se permite o se rechaza.", {
    x: M + 8.55,
    y: cajaY + 0.92,
    w: 3.06,
    h: 0.5,
    fontSize: 11.4,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M + 3.92, cajaY, 4.05, cajaH, C.paleRed);
  rect(slide, M + 3.92, cajaY, 4.05, 0.06, ROJO);
  addKicker(slide, M + 4.2, cajaY + 0.26, "Aquí vive el defecto", ROJO, 3.5);
  addText(slide, "El acuerdo entre ellas", {
    x: M + 4.2,
    y: cajaY + 0.54,
    w: 3.49,
    h: 0.32,
    fontSize: 15.6,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Nombre del campo, tipo del valor, código de estado.", {
    x: M + 4.2,
    y: cajaY + 0.92,
    w: 3.49,
    h: 0.5,
    fontSize: 11.4,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  arrow(slide, M + 3.68, cajaY + 0.82, 0.2, ROJO, 1.6);
  slide.addShape(SH.line, {
    x: M + 8.02,
    y: cajaY + 0.82,
    w: 0.2,
    h: 0,
    line: { color: ROJO, pt: 1.6, beginArrowType: "triangle", endArrowType: "none" },
  });

  rect(slide, M, 4.44, CW, 1.28, C.softNeutral);
  addText(slide, "Por qué ninguna prueba unitaria puede encontrarlo", {
    x: M + 0.32,
    y: 4.62,
    w: 5.3,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "Una prueba unitaria mira una pieza. Puede ser exhaustiva, estar perfectamente escrita y agotar todos los casos: el defecto no está dentro de lo que mira. No es un problema de rigor, es un problema de objeto.",
    {
      x: M + 0.32,
      y: 4.96,
      w: CW - 0.64,
      h: 0.64,
      fontSize: 12.4,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(slide, "Un sistema es sus piezas más los acuerdos entre ellas. Los acuerdos no viven dentro de ningún archivo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Qué deja de sustituir cada nivel

function slidePurpose() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "La distinción que ordena la clase",
    "No es el tamaño: es qué deja de sustituir",
    "La diferencia entre los dos niveles no está en cuántas piezas se tocan, sino en qué se reemplaza y qué no.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const filas = [
    ["Prueba unitaria", "Una pieza", "Todo lo demás: o no hay dependencias, o se reemplazan por un sustituto", AZUL],
    ["Prueba de integración", "La colaboración entre dos piezas", "Nada de lo que quiere observar: la dependencia se ejecuta de verdad", ROJO],
  ];

  rect(slide, M, 2.5, CW, 0.38, NAVY_CHIP);
  ["Nivel", "Qué mira", "Qué sustituye"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + [0, 3.1, 6.5][index],
      y: 2.58,
      w: 3.0,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  filas.forEach(([nivel, mira, sustituye, color], index) => {
    const y = 2.94 + index * 1.02;
    rect(slide, M, y, CW, 0.94, index === 0 ? C.softNeutral : C.warm);
    rect(slide, M, y, 0.06, 0.94, color);
    addText(slide, nivel, {
      x: M + 0.26,
      y: y + 0.16,
      w: 2.8,
      h: 0.6,
      fontSize: 13.6,
      bold: true,
      color,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, mira, {
      x: M + 3.36,
      y: y + 0.16,
      w: 3.1,
      h: 0.6,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, sustituye, {
      x: M + 6.76,
      y: y + 0.16,
      w: 4.9,
      h: 0.6,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  addDefinition(
    slide,
    M,
    5.14,
    CW,
    0.92,
    "Prueba de integración · definición que se usará toda la sesión",
    "Ejecuta la colaboración real entre dos o más piezas —sin reemplazar por un sustituto aquello que quiere observar— y afirma algo sobre su resultado.",
    ROJO
  );

  addFuente(slide, 6.24, "ISTQB · Certified Tester Foundation Level Syllabus v4.0.1 (15/09/2024) · sección 2.2.1 Test Levels", { w: 10.6 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · Mapa

function slideMap() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "El recorrido",
    "Cuatro bloques, cuatro decisiones",
    "Cada bloque resuelve un problema que el anterior deja abierto al dejar de sustituir una pieza más.",
    true,
    { subtitleW: 11.2, subtitleH: 0.4 }
  );

  const bloques = [
    ["1", "08:40", "Lo que se rompe al juntar", "Una función verificada falla igual cuando la alcanza una solicitud HTTP"],
    ["2", "09:10", "Quién prepara el mundo", "Tres pruebas, tres órdenes de ejecución, tres resultados distintos"],
    ["3", "09:45", "Qué datos pueden existir", "Proporcionalidad aplicada a la fixture y borrado que se comprueba"],
    ["4", "10:15", "Dónde el doble deja de valer", "El mismo defecto: rojo con la base real, verde con la base sustituida"],
  ];

  bloques.forEach(([numero, hora, titulo, detalle], index) => {
    const y = 2.48 + index * 0.74;
    rect(slide, M, y, CW, 0.64, index % 2 === 0 ? NAVY_CHIP : C.navy);
    rect(slide, M, y, 0.06, 0.64, index === 0 ? C.red : C.gold);
    addText(slide, numero, {
      x: M + 0.28,
      y: y + 0.1,
      w: 0.42,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 23,
      bold: true,
      color: index === 0 ? C.red : C.gold,
      align: "center",
      valign: "mid",
    });
    addText(slide, hora, {
      x: M + 0.9,
      y: y + 0.19,
      w: 0.8,
      h: 0.24,
      fontSize: 11.2,
      bold: true,
      color: C.sand,
    });
    addText(slide, titulo, {
      x: M + 1.88,
      y: y + 0.18,
      w: 3.5,
      h: 0.28,
      fontSize: 13.2,
      bold: true,
      color: C.white,
    });
    addText(slide, detalle, {
      x: M + 5.52,
      y: y + 0.1,
      w: 6.0,
      h: 0.42,
      fontSize: 11,
      color: C.softBlue,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 5.5, CW, 0.5, NAVY_CHIP);
  addText(slide, "Pausa: 09:35 – 09:45 · Cierre: 10:40 – 10:50 · Corte de la Evaluación Parcial 2: viernes 25 de septiembre", {
    x: M + 0.28,
    y: 5.61,
    w: CW - 0.56,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: C.gold,
    align: "center",
  });

  addRuta(slide, 0, { y: 6.04, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · Divisor del bloque 1

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Dos piezas correctas y un sistema que falla", {
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
    "La suite unitaria está completa y en verde. Se conecta la primera pieza con su entorno real y aparece una clase de defecto que, por construcción, ninguna prueba unitaria podía encontrar.",
    {
      x: M,
      y: 3.94,
      w: 10.2,
      h: 0.86,
      fontSize: 15,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  addRuta(slide, 1, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · La suite unitaria en verde

function slideUnitSuiteGreen() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · punto de partida",
    "La suite está en verde y el sistema no está probado",
    "Dieciséis casos que comprueban las dos funciones del proyecto. Ninguno de ellos ejecuta una sola línea de lo que hay entre el usuario y esas funciones.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 6.6,
    h: 1.74,
    title: "Suite unitaria del proyecto",
    fontSize: 10.4,
    lines: [
      { prompt: ">", text: "uv run pytest test_reservas.py test_sala.py -q" },
      { text: "................                       [100%]", kind: "muted" },
      { text: "16 passed in 0.04s", kind: "ok" },
    ],
  });

  addText(slide, "Lo que hay entre el usuario y esas funciones", {
    x: M + 7.0,
    y: 2.56,
    w: 4.9,
    h: 0.3,
    fontSize: 13.2,
    bold: true,
    color: C.ink,
  });

  const tramos = [
    "Una ruta que recibe la solicitud",
    "Una validación que revisa su forma",
    "Una conversión de los datos que llegan",
    "Una respuesta que vuelve con un significado",
  ];
  tramos.forEach((tramo, index) => {
    const y = 2.98 + index * 0.44;
    rect(slide, M + 7.0, y, 0.05, 0.3, ROJO);
    addText(slide, tramo, {
      x: M + 7.22,
      y: y + 0.01,
      w: 4.66,
      h: 0.3,
      fontSize: 11.8,
      color: C.slate,
    });
  });

  rect(slide, M, 4.68, CW, 1.2, C.warm);
  rect(slide, M, 4.68, 0.06, 1.2, ROJO);
  addText(slide, "Un usuario no llama a puede_reservar", {
    x: M + 0.32,
    y: 4.86,
    w: 5.0,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Envía una solicitud por la red. Todo ese camino está fuera de las dieciséis pruebas, y no por descuido: está fuera de lo que una prueba unitaria puede mirar.",
    {
      x: M + 0.32,
      y: 5.2,
      w: CW - 0.64,
      h: 0.56,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(slide, "Nadie comprobó que el sistema funcione, porque nadie comprobó que esas funciones se alcancen.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · Los niveles, contrastados con la fuente

function slideTestLevels() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · auditar la frase heredada",
    "«Una prueba de integración es una prueba más grande»",
    "Lleva a creer que basta con llamar a tres funciones en una misma prueba para haber integrado algo.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addDefinition(
    slide,
    M,
    2.5,
    5.84,
    1.34,
    "Component testing (prueba unitaria)",
    "«Se centra en probar componentes de manera aislada.» El aislamiento no es un adorno: es lo que la caracteriza.",
    AZUL
  );
  addDefinition(
    slide,
    M + 6.05,
    2.5,
    5.84,
    1.34,
    "Component integration testing",
    "«Se centra en probar las interfaces y las interacciones entre componentes.» El objeto es la interacción.",
    ROJO
  );

  rect(slide, M, 4.08, CW, 1.74, C.softNeutral);
  addText(slide, "Cómo separa los niveles la propia norma de enseñanza", {
    x: M + 0.32,
    y: 4.26,
    w: 6.0,
    h: 0.28,
    fontSize: 13.2,
    bold: true,
    color: C.ink,
  });

  const atributos = ["Objeto de prueba", "Objetivos", "Base de prueba", "Defectos y fallos", "Enfoque y responsabilidades"];
  atributos.forEach((atributo, index) => {
    const w = 2.17;
    const x = M + 0.32 + index * (w + 0.1);
    const destacado = index === 3;
    rect(slide, x, 4.64, w, 0.46, destacado ? ROJO : C.white);
    addText(slide, atributo, {
      x: x + 0.12,
      y: 4.72,
      w: w - 0.24,
      h: 0.32,
      fontSize: 10.2,
      bold: destacado,
      color: destacado ? C.white : C.slate,
      align: "center",
      valign: "mid",
      lineSpacingMultiple: 1.04,
    });
  });

  addText(
    slide,
    "En esa lista de cinco atributos no aparece el tamaño. Sí aparece «defectos y fallos»: cada nivel existe porque encuentra una clase de defecto que los otros no encuentran.",
    {
      x: M + 0.32,
      y: 5.22,
      w: CW - 0.64,
      h: 0.48,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addFuente(slide, 5.94, "ISTQB · CTFL Syllabus v4.0.1, sección 2.2.1 · las citas se traducen; el texto original es el que vale", { w: 10.8 });
  addTakeaway(slide, "Esa afirmación no se acepta por autoridad: el resto del bloque la comprueba ejecutando.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · HTTP y los cuatro códigos

function slideHttpAndCodes() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · vocabulario",
    "Cómo se lee una solicitud HTTP",
    "Una API es la puerta por la que otros programas usan el sistema. La del proyecto habla HTTP: el protocolo con el que un cliente envía una solicitud a un servidor y recibe una respuesta.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const piezas = [
    ["Método", "El verbo de la operación", "POST · crear algo nuevo"],
    ["Ruta", "La dirección dentro del servicio", "/reservas"],
    ["Cuerpo", "Los datos que viajan, en JSON", '{"bloque": 4, …}'],
    ["Estado", "Un número que resume qué pasó", "200 · 201 · 409 · 422"],
  ];
  piezas.forEach(([nombre, que, ejemplo], index) => {
    const w = 2.87;
    const x = M + index * (w + 0.135);
    rect(slide, x, 2.5, w, 1.32, C.white);
    rect(slide, x, 2.5, w, 0.06, AZUL);
    addText(slide, nombre.toUpperCase(), {
      x: x + 0.22,
      y: 2.66,
      w: w - 0.44,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color: AZUL,
      charSpacing: 1.1,
    });
    addText(slide, que, {
      x: x + 0.22,
      y: 2.92,
      w: w - 0.44,
      h: 0.5,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, ejemplo, {
      x: x + 0.22,
      y: 3.46,
      w: w - 0.44,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono || TYPOGRAPHY.body,
      fontSize: 10.6,
      bold: true,
      color: C.slate,
    });
  });

  const codigos = [
    ["200", "OK", "La solicitud se procesó correctamente", C.slate],
    ["201", "Created", "Se procesó y creó un recurso nuevo", VERDE],
    ["409", "Conflict", "Era válida, pero choca con el estado actual", ORO],
    ["422", "Unprocessable Content", "El cuerpo llegó sin la forma esperada; no se intentó procesarlo", ROJO],
  ];
  codigos.forEach(([codigo, nombre, glosa, color], index) => {
    const y = 4.04 + index * 0.52;
    rect(slide, M, y, CW, 0.46, index % 2 === 0 ? C.softNeutral : C.paper);
    rect(slide, M, y, 0.06, 0.46, color);
    addText(slide, codigo, {
      x: M + 0.26,
      y: y + 0.06,
      w: 0.8,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color,
      valign: "mid",
    });
    addText(slide, nombre, {
      x: M + 1.22,
      y: y + 0.11,
      w: 2.6,
      h: 0.26,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 4.0,
      y: y + 0.11,
      w: 7.6,
      h: 0.26,
      fontSize: 12,
      color: C.slate,
    });
  });

  addTakeaway(slide, "El código de estado es parte del acuerdo: dice qué significa la respuesta, no solo que hubo una.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · La API entregada

function slideTheApi() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · leer antes de probar",
    "La API del proyecto se entrega escrita",
    "La sesión es sobre probar la integración, no sobre construir la API. Pero lo que no se entiende no se puede auditar, así que se lee entera.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.5,
    h: 3.28,
    title: "api.py",
    code: [
      "app = FastAPI()",
      "",
      "class SolicitudReserva(BaseModel):",
      "    nombre: str",
      "    rut: str",
      "    correo: str",
      "    bloque: int",
      "    personas: int",
      "",
      '@app.post("/reservas")',
      "def crear_reserva(solicitud: SolicitudReserva):",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  const notas = [
    ["BaseModel", "Declara qué forma debe tener el cuerpo. Viene de Pydantic, la librería que FastAPI usa para validar.", AZUL],
    ["Las anotaciones de tipo", "No son documentación: son la regla que se aplica. Si el cuerpo no la cumple, se responde 422.", ROJO],
    ["@app.post", "Un decorador: registra la función que sigue como responsable de las solicitudes POST a esa ruta.", AZUL],
  ];
  notas.forEach(([termino, texto, color], index) => {
    addDefinition(slide, M + 6.9, 2.5 + index * 1.1, 5.0, 1.0, termino, texto, color);
  });

  addTakeaway(slide, "Nada de esto tiene un error de lógica: la función decide bien y la ruta reporta lo que la función decidió.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · El contrato

function slideContract() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la base de prueba",
    "El contrato: lo que el sistema promete responder",
    "Escrito antes que el código. Es la fuente de la que salen los resultados esperados, como en toda la Unidad 2.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.52, CW, 0.38, NAVY_CHIP);
  ["Caso", "Respuesta comprometida"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + index * 5.4,
      y: 2.6,
      w: 5.0,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const casos = [
    ["La reserva se acepta", "201, y el cuerpo incluye el comprobante", VERDE],
    ["La reserva se rechaza por una regla del negocio", "409, y el cuerpo incluye el motivo", ORO],
    ["El cuerpo de la solicitud está mal formado", "422", ROJO],
  ];
  casos.forEach(([caso, respuesta, color], index) => {
    const y = 2.96 + index * 0.62;
    rect(slide, M, y, CW, 0.54, index % 2 === 0 ? C.softNeutral : C.paper);
    rect(slide, M, y, 0.06, 0.54, color);
    addText(slide, caso, {
      x: M + 0.26,
      y: y + 0.14,
      w: 5.1,
      h: 0.28,
      fontSize: 12.6,
      color: C.ink,
    });
    addText(slide, respuesta, {
      x: M + 5.66,
      y: y + 0.14,
      w: 6.0,
      h: 0.28,
      fontSize: 12.6,
      bold: true,
      color,
    });
  });

  rect(slide, M, 4.94, CW, 1.06, C.warm);
  rect(slide, M, 4.94, 0.06, 1.06, ROJO);
  addText(slide, "Y fija el nombre de cada campo del cuerpo", {
    x: M + 0.32,
    y: 5.12,
    w: 5.2,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: ROJO,
  });
  addText(slide, "El campo del correo se llama correo_electronico. Guardar ese dato en un solo lugar es lo que permite que la prueba y el código puedan estar en desacuerdo.", {
    x: M + 0.32,
    y: 5.44,
    w: CW - 0.64,
    h: 0.46,
    fontSize: 12.4,
    color: C.ink,
    lineSpacingMultiple: 1.14,
  });

  addDefinition(slide, M, 6.06, CW, 0.76, "Contrato", "El acuerdo sobre la forma de lo que entra y lo que sale entre dos piezas que se comunican. No vive dentro de ninguna de ellas.", ROJO);
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · La primera prueba de integración

function slideFirstTest() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la prueba",
    "Se escribe contra el contrato, no contra el código",
    "El cliente de pruebas de FastAPI envía la solicitud sin levantar un servidor ni abrir un puerto: recorre el mismo camino, dentro del mismo proceso.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.0,
    h: 2.62,
    title: "test_api.py",
    code: [
      "cliente = TestClient(app)",
      "",
      "",
      "def test_reserva_aceptada_responde_201():",
      "    respuesta = cliente.post(\"/reservas\", json=SOLICITUD)",
      "    assert respuesta.status_code == 201",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  const piezas = [
    ["TestClient(app)", "Envuelve la aplicación. La solicitud recorre validación, ruta, función y respuesta.", AZUL],
    ["cliente.post(ruta, json=…)", "Envía la solicitud. json= convierte el diccionario de Python en el cuerpo JSON.", AZUL],
    ["respuesta.status_code", "El código con el que respondió el servidor. respuesta.json() devuelve el cuerpo.", AZUL],
  ];
  piezas.forEach(([termino, texto, color], index) => {
    addDefinition(slide, M + 7.4, 2.5 + index * 0.94, 4.5, 0.88, termino, texto, color);
  });

  rect(slide, M, 5.36, CW, 0.38, C.softNeutral);
  addText(slide, "SOLICITUD", {
    x: M + 0.3,
    y: 5.44,
    w: 1.5,
    h: 0.24,
    fontSize: 11.4,
    bold: true,
    color: AZUL,
  });
  addText(slide, "es el diccionario con los cinco campos del cuerpo, escrito una sola vez arriba del archivo para no repetirlo en cada prueba.", {
    x: M + 1.9,
    y: 5.44,
    w: 9.7,
    h: 0.24,
    fontSize: 11.2,
    color: C.ink,
  });
  addFuente(slide, 5.88, "FastAPI · documentación oficial de pruebas: «Crea un TestClient pasándole tu aplicación FastAPI»", { w: 10.8 });
  addTakeaway(slide, "El valor esperado sale del contrato. Si saliera del código, la prueba no podría estar en desacuerdo con él.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · Primer rojo: 422

function slideRed422() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · primera ejecución",
    "Primer rojo: la función verificada nunca se ejecutó",
    "Los dos casos responden 422. Ese código significa que el cuerpo no tenía la forma esperada, así que la solicitud se rechazó antes de llegar a la función.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.9,
    h: 2.18,
    title: "Primera ejecución",
    fontSize: 9.8,
    lines: [
      { prompt: ">", text: "uv run pytest test_api.py -q" },
      { text: "E   assert 422 == 201", kind: "error" },
      { text: "E   assert 422 == 409", kind: "error" },
      { text: "2 failed", kind: "error" },
    ],
  });

  addCodePanel(slide, SH, {
    x: M + 7.3,
    y: 2.5,
    w: 4.6,
    h: 2.18,
    title: "respuesta.json()",
    code: [
      '"type": "missing",',
      '"loc": ["body", "correo"],',
      '"msg": "Field required"',
    ].join("\n"),
    lang: "json",
    fontSize: 9.8,
  });

  rect(slide, M, 4.76, CW, 0.66, C.softNeutral);
  addText(slide, "assert 422 == 201", {
    x: M + 0.3,
    y: 4.84,
    w: 2.2,
    h: 0.24,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
  });
  addText(slide, "se lee de izquierda a derecha: primero lo que devolvió el sistema, después lo que pedía el contrato.", {
    x: M + 2.56,
    y: 4.84,
    w: 9.05,
    h: 0.24,
    fontSize: 11,
    color: C.slate,
  });
  addText(slide, "type · loc · msg", {
    x: M + 0.3,
    y: 5.12,
    w: 2.2,
    h: 0.24,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
  });
  addText(slide, "qué clase de problema hubo, dónde está y en qué consiste. Los pone FastAPI, no el proyecto.", {
    x: M + 2.56,
    y: 5.12,
    w: 9.05,
    h: 0.24,
    fontSize: 11,
    color: C.slate,
  });

  rect(slide, M, 5.52, CW, 0.5, C.warm);
  rect(slide, M, 5.52, 0.06, 0.5, ROJO);
  addText(slide, "El defecto es un nombre de campo", {
    x: M + 0.32,
    y: 5.62,
    w: 4.16,
    h: 0.28,
    fontSize: 13.6,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "la especificación dice correo_electronico y la API declara correo.",
    {
      x: M + 4.76,
      y: 5.62,
      w: 6.85,
      h: 0.3,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "El 422 dice dónde está el problema: loc señala el cuerpo y el campo exacto.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · Segundo rojo: 200 y el comprobante

function slideRed200() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · segunda ejecución",
    "Se corrige el nombre y el rojo cambia de naturaleza",
    "Ahora la solicitud sí entró y la función sí decidió bien. Lo que no ocurrió es que su decisión viajara como corresponde.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.9,
    h: 1.96,
    title: "Segunda ejecución",
    fontSize: 9.8,
    lines: [
      { text: "E   assert 200 == 201", kind: "error" },
      { text: "E   assert 200 == 409", kind: "error" },
      { text: "2 failed", kind: "error" },
    ],
  });

  addCodePanel(slide, SH, {
    x: M + 7.3,
    y: 2.5,
    w: 4.6,
    h: 1.96,
    title: "cuerpo del rechazo",
    code: [
      '"permitida": false,',
      '"comprobante": "Ana Rivas',
      '  | 11.111.111-1 | bloque 12"',
    ].join("\n"),
    lang: "json",
    fontSize: 9.6,
  });

  rect(slide, M, 4.68, CW, 1.34, C.paleRed);
  rect(slide, M, 4.68, 0.06, 1.34, ROJO);
  addText(slide, "Tercer hallazgo: un comprobante de una reserva que no existe", {
    x: M + 0.32,
    y: 4.86,
    w: 7.0,
    h: 0.28,
    fontSize: 13.6,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "El sistema rechazó la reserva —permitida: false es correcto— y le entregó al usuario su comprobante. puede_reservar devolvió False, que es lo correcto; comprobante armó bien la cadena que se le pidió, que también es lo correcto. El defecto está en que alguien las compuso sin decidir qué pasa cuando la primera dice que no.",
    {
      x: M + 0.32,
      y: 5.18,
      w: CW - 0.64,
      h: 0.7,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Dos funciones correctas, compuestas mal. Ninguna prueba que mire una sola de las dos puede detectarlo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 15 · Tres defectos, una misma clase

function slideThreeDefects() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · síntesis",
    "Tres defectos distintos, una misma clase",
    "Ninguno es un error de lógica dentro de una función. Por eso ninguno podía aparecer en el nivel unitario.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.52, CW, 0.38, NAVY_CHIP);
  ["Hallazgo", "Qué falló", "Dónde vive el defecto"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + [0, 4.1, 7.5][index],
      y: 2.6,
      w: 3.4,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const hallazgos = [
    ["422 por nombre de campo", "La colaboración no llegó a ocurrir", "Entre el contrato y el modelo de datos", ROJO],
    ["200 en lugar de 201 y 409", "Ocurrió, y se informó mal", "Entre la decisión y su representación HTTP", ORO],
    ["Comprobante de un rechazo", "Ocurrió, y se compuso mal", "Entre dos funciones correctas", AZUL],
  ];
  hallazgos.forEach(([hallazgo, fallo, donde, color], index) => {
    const y = 2.96 + index * 0.78;
    rect(slide, M, y, CW, 0.7, index % 2 === 0 ? C.softNeutral : C.paper);
    rect(slide, M, y, 0.06, 0.7, color);
    addText(slide, hallazgo, {
      x: M + 0.26,
      y: y + 0.2,
      w: 3.8,
      h: 0.32,
      fontSize: 12.4,
      bold: true,
      color,
    });
    addText(slide, fallo, {
      x: M + 4.36,
      y: y + 0.2,
      w: 3.2,
      h: 0.32,
      fontSize: 12.2,
      color: C.ink,
    });
    addText(slide, donde, {
      x: M + 7.76,
      y: y + 0.2,
      w: 3.9,
      h: 0.32,
      fontSize: 12.2,
      color: C.slate,
    });
  });

  rect(slide, M, 5.36, CW, 0.66, C.warm);
  addText(
    slide,
    "Es la afirmación de ISTQB —los niveles se distinguen, entre otras cosas, por los defectos que encuentran— comprobada sobre el proyecto propio y no aceptada por autoridad.",
    {
      x: M + 0.32,
      y: 5.5,
      w: CW - 0.64,
      h: 0.4,
      fontSize: 12.6,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(slide, "No es falta de rigor de las pruebas unitarias: es que el objeto que miran es otro.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 16-17 · Preguntas y respuestas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de seguir", [
    [
      "La suite unitaria informa 16 passed y las dos pruebas de integración fallan. Un compañero concluye que las pruebas unitarias estaban mal escritas. ¿Tiene razón?",
      "Revisa el objeto de prueba de cada nivel: ¿el nombre de un campo HTTP está dentro de lo que puede_reservar puede ver?",
    ],
    [
      "El sistema devolvió permitida: false junto con un comprobante. Las dos funciones que produjeron esa respuesta están verificadas. ¿De quién es el defecto?",
      "El defecto aparece al componer. Piensa qué documento decide qué se devuelve cuando la primera función dice que no.",
    ],
    [
      "Un agente entrega una prueba de integración que pasa a la primera sobre esta misma API. ¿Qué afirma exactamente, y por qué que pase no es buena noticia?",
      "Compara de dónde salió el 200 que esa prueba afirma con de dónde salió el 201 que afirma la prueba escrita contra el contrato.",
    ],
  ]);
}

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "No tiene razón",
      "Están bien escritas: el nombre del campo del cuerpo es invisible para puede_reservar.",
      "Cada nivel tiene su propio objeto de prueba",
      "Culpar al nivel que no falló",
    ],
    [
      "De quien las compuso",
      "El defecto no está en ninguna función: está en que nadie decidió qué se devuelve cuando la regla dice que no.",
      "El contrato es el documento que faltaba",
      "Buscar el error dentro de una de las dos",
    ],
    [
      "Afirma lo que el código ya hacía",
      "El agente lee la API y escribe la prueba contra lo que encuentra. Si responde 200, la prueba afirma 200.",
      "El esperado salió de la implementación",
      "Aceptar la prueba porque pasa",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 18 · Divisor del bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "La preparación que decide si una prueba significa algo", {
    x: M,
    y: 1.98,
    w: 10.7,
    h: 1.5,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.66, 4.2, C.gold, 2.4);
  addText(
    slide,
    "Dejar de sustituir la dependencia tiene un precio: lo que una prueba crea sigue existiendo cuando termina. El resultado de una prueba empieza a depender de qué otras se ejecutaron antes.",
    {
      x: M,
      y: 3.94,
      w: 10.2,
      h: 0.86,
      fontSize: 15,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  addRuta(slide, 2, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · La corrección del contrato

function slideContractFixed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la base en verde",
    "Corregir el contrato antes de seguir",
    "No es el asunto de la sesión, pero se lee: aparecen dos piezas de sintaxis que se usan después.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 2.62,
    title: "api.py · corregido",
    code: [
      '@app.post("/reservas", status_code=201)',
      "def crear_reserva(solicitud: SolicitudReserva):",
      "    tomado = any(r[\"bloque\"] == solicitud.bloque for r in reservas_registradas)",
      "    if not puede_reservar(de_la_semana, solicitud.bloque, tomado):",
      "        raise HTTPException(",
      "            status_code=409,",
      '            detail="La reserva no esta permitida")',
      '    return {"comprobante": comprobante(...)}',
    ].join("\n"),
    lang: "python",
    fontSize: 9.8,
  });

  addDefinition(
    slide,
    M + 7.5,
    2.5,
    4.4,
    1.22,
    "status_code=201",
    "Cambia el código con el que se responde cuando todo sale bien. Es el código por defecto de esa ruta, no de la aplicación entera.",
    VERDE
  );
  addDefinition(
    slide,
    M + 7.5,
    3.86,
    4.4,
    1.26,
    "raise HTTPException(...)",
    "Interrumpe la función y responde con ese código y ese motivo. Al interrumpir, el return del final no se ejecuta.",
    ORO
  );

  rect(slide, M, 5.34, CW, 0.72, C.softNeutral);
  addText(
    slide,
    "Y con eso desaparece también el tercer defecto del bloque anterior: ya no hay forma de devolver un comprobante junto a un rechazo, porque el rechazo sale antes de llegar a armarlo.",
    {
      x: M + 0.32,
      y: 5.48,
      w: CW - 0.64,
      h: 0.44,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(slide, "Con el contrato cumplido, la suite queda en verde. Ahí empieza el problema de este bloque.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 · Tres en verde, y la tercera falla sola

function slideThreeGreen() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el verde sospechoso",
    "Pasa acompañada y falla sola",
    "Se agrega la tercera prueba, la del bloque que ya está reservado. El archivo completo queda en verde.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.4,
    h: 1.74,
    title: "la tercera prueba",
    code: [
      "def test_bloque_ya_tomado_responde_409():",
      '    respuesta = cliente.post("/reservas", json=SOLICITUD)',
      "    assert respuesta.status_code == 409",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addTerminalPanel(slide, SH, {
    x: M + 6.8,
    y: 2.5,
    w: 5.1,
    h: 1.3,
    title: "el archivo completo",
    fontSize: 9.8,
    lines: [{ text: "3 passed in 0.52s", kind: "ok" }],
  });

  addTerminalPanel(slide, SH, {
    x: M + 6.8,
    y: 3.94,
    w: 5.1,
    h: 1.74,
    title: "solo la tercera",
    fontSize: 9.8,
    lines: [
      { text: "E   assert 201 == 409", kind: "error" },
      { text: "E    where 201 = <Response [201 Created]>", kind: "error" },
      { text: "1 failed in 0.66s", kind: "error" },
    ],
  });

  rect(slide, M, 4.42, 6.4, 1.26, C.warm);
  rect(slide, M, 4.42, 0.06, 1.26, ROJO);
  addText(slide, "Sintaxis: archivo::nombre", {
    x: M + 0.3,
    y: 4.6,
    w: 5.8,
    h: 0.26,
    fontSize: 12.6,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    'uv run pytest "test_api.py::test_bloque_ya_tomado_responde_409" -q le indica a pytest que ejecute exactamente esa prueba y ninguna otra.',
    {
      x: M + 0.3,
      y: 4.9,
      w: 5.8,
      h: 0.66,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "La misma prueba, el mismo código, sin cambiar una línea. Y dos resultados distintos.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · Tres órdenes, tres resultados

function slideOrderDecides() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la causa",
    "El verde describía el orden, no el sistema",
    "reservas_registradas vive en el módulo, no dentro de la función: existe desde que el módulo se importa hasta que el proceso termina.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.5, CW, 0.38, NAVY_CHIP);
  ["Qué se ejecutó", "Resultado"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + index * 6.4,
      y: 2.58,
      w: 5.0,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const corridas = [
    ["Las tres pruebas, en el orden del archivo", "3 passed", VERDE],
    ["Solo la tercera", "1 failed · assert 201 == 409", ROJO],
    ["La tercera y la primera, en ese orden", "2 failed · assert 201 == 409 y assert 409 == 201", ROJO],
  ];
  corridas.forEach(([que, resultado, color], index) => {
    const y = 2.94 + index * 0.62;
    rect(slide, M, y, CW, 0.54, index === 0 ? C.softNeutral : C.warm);
    rect(slide, M, y, 0.06, 0.54, color);
    addText(slide, que, {
      x: M + 0.26,
      y: y + 0.14,
      w: 6.1,
      h: 0.28,
      fontSize: 12.4,
      color: C.ink,
    });
    addText(slide, resultado, {
      x: M + 6.66,
      y: y + 0.14,
      w: 5.0,
      h: 0.28,
      fontSize: 12.2,
      bold: true,
      color,
    });
  });

  rect(slide, M, 4.92, CW, 1.1, C.paleRed);
  rect(slide, M, 4.92, 0.06, 1.1, ROJO);
  addText(slide, "Qué comprobó realmente la tercera prueba", {
    x: M + 0.32,
    y: 5.1,
    w: 5.6,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Dice que un bloque ya tomado se rechaza. Lo que comprobó es que un bloque tomado por la primera prueba se rechaza. Si alguien borra, renombra o reordena esa primera prueba, la tercera se cae sin que nadie haya tocado el sistema.",
    {
      x: M + 0.32,
      y: 5.42,
      w: CW - 0.64,
      h: 0.5,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "El 3 passed no era un resultado sobre el sistema: era un resultado sobre el orden.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · El diagnóstico ya tiene nombre

function slideMeszarosDiagnosis() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el diagnóstico clásico",
    "Esto no es un descubrimiento de esta clase",
    "Gerard Meszaros —el mismo autor de la taxonomía de dobles de prueba— lo catalogó con nombre propio.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const tarjetas = [
    [
      "Interacting Tests · la causa general",
      "«Las pruebas dependen unas de otras de alguna manera.» Cualquier cosa que sobreviva a la duración de la prueba puede provocar interacciones.",
      ROJO,
    ],
    [
      "Lonely Test · el caso exacto de hoy",
      "«Una prueba que puede ejecutarse como parte de una suite pero no puede ejecutarse por sí sola, porque depende de algo que creó otra prueba.»",
      ORO,
    ],
    [
      "Fresh Fixture · el remedio",
      "«Construimos el fixture como parte de la prueba y lo desmontamos cuando termina. Empezamos y terminamos cada prueba con la pizarra limpia.»",
      VERDE,
    ],
  ];
  tarjetas.forEach(([termino, texto, color], index) => {
    addDefinition(slide, M, 2.5 + index * 1.12, CW, 1.04, termino, texto, color);
  });

  const vocabulario = [
    ["Fixture", "Todo lo que debe estar puesto para que la prueba pueda ejecutarse"],
    ["Fresco", "Se construye para esa prueba y se desmonta al terminar"],
    ["Compartido", "Sobrevive entre pruebas; es más rápido y produce lo anterior"],
    ["@pytest.fixture", "La herramienta con la que se escribe uno"],
  ];
  vocabulario.forEach(([palabra, glosa], index) => {
    const w = 2.87;
    const x = M + index * (w + 0.135);
    rect(slide, x, 5.9, w, 0.66, C.softNeutral);
    addText(slide, palabra, {
      x: x + 0.18,
      y: 5.98,
      w: w - 0.36,
      h: 0.22,
      fontSize: 11,
      bold: true,
      color: AZUL,
    });
    addText(slide, glosa, {
      x: x + 0.18,
      y: 6.2,
      w: w - 0.36,
      h: 0.3,
      fontSize: 9.2,
      color: C.slate,
      lineSpacingMultiple: 1.06,
    });
  });

  addFuente(slide, 6.72, "Gerard Meszaros · xUnit Test Patterns: Erratic Test, Lonely Test y Fresh Fixture · citas traducidas", { w: 10.8 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · La fixture y sus cuatro decisiones

function slideFixtureAnatomy() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · escribir la fixture",
    "Cuatro decisiones, una por línea",
    "Deja la agenda vacía antes de cada prueba y la vuelve a vaciar al terminar. Ninguna línea es decorativa.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.0,
    h: 1.96,
    title: "conftest.py",
    code: [
      "@pytest.fixture",
      "def agenda_vacia() -> list[dict]:",
      "    reservas_registradas.clear()",
      "    yield reservas_registradas",
      "    reservas_registradas.clear()",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  addDefinition(
    slide,
    M + 6.4,
    2.5,
    5.5,
    1.96,
    "Lo que dice la documentación",
    "«Las fixtures definen los pasos y los datos que constituyen la fase de preparación de una prueba»: un contexto definido, fiable y consistente.",
    AZUL
  );

  const decisiones = [
    ["1", "@pytest.fixture", "Marca la función como fixture: pytest la ejecuta cuando alguien la pide, no por ser prueba.", AZUL],
    ["2", "Antes del yield", "La preparación. Se ejecuta antes de la prueba. Aquí, vaciar la lista.", VERDE],
    ["3", "yield", "Entrega el objeto y deja la fixture en pausa. Donde una función haría return.", ORO],
    ["4", "Después del yield", "El desmontaje. pytest lo ejecuta al terminar, haya pasado o haya fallado.", ROJO],
  ];
  decisiones.forEach(([numero, titulo, cuerpo, color], index) => {
    const w = 2.87;
    const x = M + index * (w + 0.135);
    const y = 4.58;
    rect(slide, x, y, w, 1.54, C.white);
    rect(slide, x, y, w, 0.06, color);
    addText(slide, numero, {
      x: x + 0.22,
      y: y + 0.16,
      w: 0.4,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color,
    });
    addText(slide, titulo, {
      x: x + 0.66,
      y: y + 0.2,
      w: w - 0.88,
      h: 0.26,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, cuerpo, {
      x: x + 0.22,
      y: y + 0.56,
      w: w - 0.44,
      h: 0.88,
      fontSize: 10.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "Una prueba pide la fixture escribiendo su nombre como parámetro: no se importa y no se llama.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24 · Cómo se pide y qué cambió

function slideFixtureRestored() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el aislamiento recuperado",
    "El mismo número, y ya no significa lo mismo",
    "Cada prueba pide la fixture por su nombre, y la tercera crea su propia condición previa en lugar de heredarla.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.3,
    h: 1.96,
    title: "test_api.py",
    code: [
      "def test_bloque_ya_tomado_responde_409(agenda_vacia):",
      '    cliente.post("/reservas", json=SOLICITUD)',
      '    respuesta = cliente.post("/reservas", json=SOLICITUD)',
      "    assert respuesta.status_code == 409",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  addDefinition(
    slide,
    M + 6.7,
    2.5,
    5.2,
    1.96,
    "conftest.py",
    "Nombre reservado de pytest: las fixtures definidas ahí quedan disponibles para todas las pruebas de esa carpeta sin importarlas.",
    AZUL
  );

  rect(slide, M, 4.52, CW, 0.38, NAVY_CHIP);
  ["Qué se ejecutó", "Antes", "Ahora"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + [0, 6.6, 8.9][index],
      y: 4.60,
      w: 2.0,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const filas = [
    ["Las tres, en el orden del archivo", "3 passed", "3 passed"],
    ["Solo la tercera", "1 failed", "1 passed"],
    ["La tercera y la primera", "2 failed", "2 passed"],
  ];
  filas.forEach(([que, antes, ahora], index) => {
    const y = 4.94 + index * 0.41;
    rect(slide, M, y, CW, 0.38, index % 2 === 0 ? C.softNeutral : C.paper);
    addText(slide, que, {
      x: M + 0.26,
      y: y + 0.08,
      w: 6.2,
      h: 0.26,
      fontSize: 11.8,
      color: C.ink,
    });
    addText(slide, antes, {
      x: M + 6.86,
      y: y + 0.08,
      w: 2.1,
      h: 0.26,
      fontSize: 11.8,
      bold: true,
      color: index === 0 ? VERDE : ROJO,
    });
    addText(slide, ahora, {
      x: M + 9.16,
      y: y + 0.08,
      w: 2.1,
      h: 0.26,
      fontSize: 11.8,
      bold: true,
      color: VERDE,
    });
  });

  addTakeaway(slide, "Antes el 3 passed describía un orden. Ahora describe el sistema.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 25 · El alcance es una decisión

function slideScopeDecision() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · el alcance",
    "Una palabra, y la fixture deja de aislar",
    "El alcance decide cada cuánto se construye y se desmonta. No es un detalle de configuración.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const alcances = [
    ["function", "Al final de cada prueba — es el valor por defecto", VERDE],
    ["class", "Al terminar la última prueba de la clase", C.slate],
    ["module", "Al terminar la última prueba del archivo", ORO],
    ["package", "Al terminar la última prueba del paquete", C.slate],
    ["session", "Al terminar toda la ejecución", ROJO],
  ];
  alcances.forEach(([nombre, cuando, color], index) => {
    const y = 2.5 + index * 0.44;
    rect(slide, M, y, 5.9, 0.38, index % 2 === 0 ? C.softNeutral : C.paper);
    rect(slide, M, y, 0.05, 0.38, color);
    addText(slide, nombre, {
      x: M + 0.24,
      y: y + 0.07,
      w: 1.5,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color,
    });
    addText(slide, cuando, {
      x: M + 1.84,
      y: y + 0.07,
      w: 3.9,
      h: 0.24,
      fontSize: 10.6,
      color: C.slate,
    });
  });

  addTerminalPanel(slide, SH, {
    x: M + 6.3,
    y: 2.5,
    w: 5.6,
    h: 2.18,
    title: 'con scope="module"',
    fontSize: 9.6,
    lines: [
      { text: "# la suite completa", kind: "muted" },
      { text: "3 passed in 0.08s", kind: "ok" },
      { text: "# la tercera y la primera", kind: "muted" },
      { text: "1 failed, 1 passed in 0.38s", kind: "error" },
    ],
  });

  rect(slide, M, 4.84, CW, 1.18, C.paleRed);
  rect(slide, M, 4.84, 0.06, 1.18, ROJO);
  addText(slide, "La fixture existe, está bien escrita y no aísla nada", {
    x: M + 0.32,
    y: 5.02,
    w: 6.2,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Con alcance module la agenda se vacía una sola vez para todo el archivo. Y obsérvese lo peligroso: la suite completa sigue informando 3 passed. Un alcance mal elegido no se manifiesta como error, sino como un verde que volvió a depender del orden.",
    {
      x: M + 0.32,
      y: 5.34,
      w: CW - 0.64,
      h: 0.56,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Ampliar el alcance es una optimización que se paga en riesgo. Se amplía solo para lo que es caro.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 26 · El agente y el aislamiento

function slideAgentAndIsolation() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la era de los agentes",
    "«Arregla las pruebas que fallan»",
    "Esa instrucción, sobre el estado anterior a la fixture, produce con frecuencia una de estas dos respuestas. Las dos dejan el problema intacto.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const respuestas = [
    [
      "Adaptar la aserción al resultado observado",
      "Cambiar el 409 esperado por 201 en la prueba que falla sola. La suite vuelve al verde y la prueba dejó de comprobar el requisito.",
    ],
    [
      "Marcar el orden como requisito",
      "Ordenar o encadenar las pruebas para que el verde vuelva. Eso conserva la dependencia y además la oficializa.",
    ],
  ];
  respuestas.forEach(([titulo, texto], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 2.5, 5.84, 1.32, C.warm);
    rect(slide, x, 2.5, 5.84, 0.06, ROJO);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.7,
      w: 5.24,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: ROJO,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.04,
      w: 5.24,
      h: 0.66,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 3.98, CW, 0.64, C.softNeutral);
  addText(
    slide,
    "El motivo es estructural: el agente optimiza contra la señal que recibe, y la señal es «la suite en verde». El aislamiento no se ve en esa señal.",
    {
      x: M + 0.32,
      y: 4.12,
      w: CW - 0.64,
      h: 0.38,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    }
  );

  const criterio = [
    ["Qué hace bien", "Escribir la fixture una vez que se le dice cuál es el estado compartido.", VERDE],
    ["Qué no delegar", "El diagnóstico y el alcance: exigen saber qué comprobaba la prueba.", ROJO],
    ["Error frecuente", "Pedir «que pasen las pruebas» en vez de «que cada prueba pase sola».", ORO],
  ];
  criterio.forEach(([titulo, texto, color], index) => {
    const w = 3.85;
    const x = M + index * (w + 0.12);
    rect(slide, x, 4.76, w, 1.24, C.white);
    rect(slide, x, 4.76, w, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.22,
      y: 4.94,
      w: w - 0.44,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, texto, {
      x: x + 0.22,
      y: 5.2,
      w: w - 0.44,
      h: 0.7,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(slide, "La segunda formulación es verificable; la primera no distingue entre arreglar y disimular.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27-28 · Preguntas y respuestas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de la pausa", [
    [
      "La suite informa 3 passed y una de esas tres pruebas falla al ejecutarse sola. ¿Cuál de los dos resultados describe el estado del sistema?",
      "Pregúntate qué condición tuvo que cumplirse para que la prueba pasara, y si está escrita dentro de la prueba o le llegó de afuera.",
    ],
    [
      "Un compañero cambia el alcance de function a session porque la suite tardaba, ejecuta todo y obtiene el mismo verde. ¿Qué evidencia falta?",
      "Acabas de ver un caso donde la suite completa pasa y el aislamiento no existe. ¿Qué ejecución distinta lo detectaría?",
    ],
    [
      "Una prueba crea un registro y lo deja puesto. Nadie la ejecuta sola, la suite lleva seis meses en verde. ¿Qué dos cosas están en riesgo?",
      "Una es técnica y aparece cuando alguien agregue una prueba nueva. La otra tiene que ver con qué datos quedaron guardados.",
    ],
  ]);
}

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "El que falla",
      "La prueba solitaria no comprobaba lo que decía: su condición previa la puso otra prueba.",
      "Ejecutar cada prueba sola es parte de la rutina",
      "Confiar en el resultado más cómodo",
    ],
    [
      "Falta ejecutarlas por separado",
      "El verde de la suite completa es compatible con cero aislamiento: no es evidencia de que el cambio fue inocuo.",
      "Una señal verde puede no medir nada",
      "Aceptar una optimización sin medirla",
    ],
    [
      "El orden y los datos",
      "Se romperá cuando alguien agregue una prueba. Y hay registros acumulándose que nadie decidió conservar.",
      "El segundo riesgo no se arregla con más pruebas",
      "Ver solo el problema técnico",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 29 · Divisor del bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Qué datos pueden existir dentro de una prueba", {
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
    "La lista en memoria escondía la mitad del problema: al apagar pytest no quedaba nada. Un sistema real guarda, y lo que una prueba guarda es un dato que alguien decidió crear.",
    {
      x: M,
      y: 3.94,
      w: 10.2,
      h: 0.86,
      fontSize: 15,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  addRuta(slide, 3, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · De la memoria al disco

function slideMemoryToDisk() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el proyecto guarda",
    "De una lista en memoria a un archivo en disco",
    "SQL es el lenguaje con el que se le pide y se le escribe a una base de datos. SQLite es una base de datos completa contenida en un solo archivo: se puede abrir y mirar qué quedó escrito.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.8,
    h: 2.4,
    title: "almacen.py",
    code: [
      "def conectar() -> sqlite3.Connection:",
      "    conexion = sqlite3.connect(RUTA_BASE)",
      "    conexion.execute(ESQUEMA)",
      "    return conexion",
      "",
      "fila = conexion.execute(",
      '    "SELECT COUNT(*) FROM reservas WHERE bloque = ?", (bloque,)',
      ").fetchone()",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  const notas = [
    ["El signo ? es un marcador de posición", "Los valores nunca se pegan en el texto SQL: se pasan aparte. Pegarlos deja que un dato escrito por el usuario se ejecute como instrucción: la inyección SQL.", ROJO],
    [".fetchone() y .commit()", "Devuelve la primera fila como tupla. Y .commit() confirma la escritura: sin él, lo insertado se pierde.", AZUL],
  ];
  notas.forEach(([termino, texto, color], index) => {
    addDefinition(slide, M + 7.2, 2.5 + index * 1.28, 4.7, 1.2, termino, texto, color);
  });

  rect(slide, M, 5.06, CW, 0.96, C.softNeutral);
  addText(slide, "Dos expresiones parecidas que nombran cosas distintas", {
    x: M + 0.32,
    y: 5.2,
    w: 6.0,
    h: 0.26,
    fontSize: 12.6,
    bold: true,
    color: C.ink,
  });
  addText(slide, "Base de prueba", {
    x: M + 0.32,
    y: 5.54,
    w: 2.4,
    h: 0.24,
    fontSize: 11.6,
    bold: true,
    color: AZUL,
  });
  addText(slide, "El documento del que salen los resultados esperados", {
    x: M + 2.78,
    y: 5.54,
    w: 3.5,
    h: 0.24,
    fontSize: 10.8,
    color: C.slate,
  });
  addText(slide, "Base de datos de prueba", {
    x: M + 6.5,
    y: 5.54,
    w: 2.6,
    h: 0.24,
    fontSize: 11.6,
    bold: true,
    color: ORO,
  });
  addText(slide, "El archivo donde el sistema guarda al ejecutarse", {
    x: M + 9.2,
    y: 5.54,
    w: 2.5,
    h: 0.24,
    fontSize: 10.8,
    color: C.slate,
  });

  addTakeaway(slide, "Cada prueba que acepte una reserva escribe una fila en un archivo. Alguien responde por ella.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · Es solo el ambiente de pruebas

function slideTestEnvIsProcessing() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la frase que hay que desmontar",
    "«Es solo el ambiente de pruebas»",
    "Es la frase que autoriza todos los atajos que vienen después. La guía de protección de datos del módulo la contesta directo.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.46, CW, 0.74, NAVY_CHIP);
  addText(
    slide,
    "«Un ambiente no productivo sigue siendo tratamiento de datos. La etiqueta test no reduce el daño posible ni reemplaza los controles.»",
    {
      x: M + 0.32,
      y: 2.6,
      w: CW - 0.64,
      h: 0.46,
      fontSize: 13.4,
      bold: true,
      color: C.gold,
      align: "center",
      valign: "mid",
    }
  );

  const columnas = [
    {
      x: M,
      titulo: "Sí · diseñar para reducir riesgo",
      color: VERDE,
      fondo: C.softNeutral,
      puntos: [
        "Datos sintéticos por defecto",
        "Subconjuntos mínimos y aislados",
        "Accesos temporales y auditables",
        "Borrado verificable al terminar",
        "Casos de prueba para derechos y fallas",
      ],
    },
    {
      x: M + 6.05,
      titulo: "No · normalizar atajos peligrosos",
      color: ROJO,
      fondo: C.warm,
      puntos: [
        "Copiar producción completa",
        "Compartir dumps por canales informales",
        "Dejar credenciales o enlaces permanentes",
        "Confundir seudonimizar con anonimizar",
        "Conservar datos sin dueño ni plazo",
      ],
    },
  ];
  columnas.forEach(({ x, titulo, color, fondo, puntos }) => {
    rect(slide, x, 3.30, 5.84, 2.14, fondo);
    rect(slide, x, 3.30, 5.84, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.3,
      y: 3.46,
      w: 5.24,
      h: 0.22,
      fontSize: 9.4,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    puntos.forEach((punto, index) => {
      const y = 3.76 + index * 0.33;
      rect(slide, x + 0.3, y + 0.05, 0.05, 0.24, color);
      addText(slide, punto, {
        x: x + 0.5,
        y,
        w: 5.04,
        h: 0.3,
        fontSize: 11.6,
        color: C.ink,
      });
    });
  });

  const vocabulario = [
    ["Sintético", "Inventado para la prueba; no corresponde a ninguna persona"],
    ["Seudonimizar", "Cambiar el identificador por un código: siguen siendo datos personales"],
    ["Anonimizar", "Quitar toda posibilidad de reidentificar; no es lo mismo que renombrar"],
    ["Dump", "Una copia completa de una base de datos, en un archivo"],
  ];
  vocabulario.forEach(([palabra, glosa], index) => {
    const w = 2.87;
    const x = M + index * (w + 0.135);
    rect(slide, x, 5.50, w, 0.62, C.white);
    addText(slide, palabra, {
      x: x + 0.18,
      y: 5.56,
      w: w - 0.36,
      h: 0.18,
      fontSize: 10.6,
      bold: true,
      color: AZUL,
    });
    addText(slide, glosa, {
      x: x + 0.18,
      y: 5.76,
      w: w - 0.36,
      h: 0.32,
      fontSize: 8.8,
      color: C.slate,
      lineSpacingMultiple: 1.04,
    });
  });

  addTakeaway(slide, "Los cinco puntos de la izquierda son, literalmente, el diseño de una fixture.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32 · La proporcionalidad y sus dos obligaciones

function slideProportionality() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el criterio externo",
    "La ley no dice «minimización»: dice proporcionalidad",
    "Artículo 3º letra c) de la Ley 21.719. Son dos obligaciones en un mismo párrafo, y caen sobre las dos mitades de una fixture.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.5, CW, 1.12, C.softNeutral);
  rect(slide, M, 2.5, 0.06, 1.12, ROJO);
  addText(
    slide,
    "«Los datos personales que se traten deben limitarse estrictamente a aquéllos que resulten necesarios, adecuados y pertinentes en relación con los fines del tratamiento. Los datos personales pueden ser conservados sólo por el período de tiempo que sea necesario para cumplir con los fines del tratamiento, luego de lo cual deben ser suprimidos o anonimizados.»",
    {
      x: M + 0.32,
      y: 2.66,
      w: CW - 0.64,
      h: 0.84,
      fontSize: 12,
      italic: true,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  const mitades = [
    ["Qué datos se cargan", "«limitarse estrictamente a aquéllos que resulten necesarios… en relación con los fines»", "La preparación · antes del yield", VERDE],
    ["Hasta cuándo se conservan", "«sólo por el período de tiempo que sea necesario… luego de lo cual deben ser suprimidos»", "El desmontaje · después del yield", ORO],
  ];
  mitades.forEach(([titulo, cita, donde, color], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 3.78, 5.84, 1.6, C.white);
    rect(slide, x, 3.78, 5.84, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 3.96,
      w: 5.24,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color,
    });
    addText(slide, cita, {
      x: x + 0.3,
      y: 4.3,
      w: 5.24,
      h: 0.6,
      fontSize: 11.2,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    rect(slide, x + 0.3, 4.96, 5.24, 0.3, index === 0 ? C.softNeutral : C.warm);
    addText(slide, donde, {
      x: x + 0.44,
      y: 5.0,
      w: 4.96,
      h: 0.24,
      fontSize: 11,
      bold: true,
      color: C.ink,
    });
  });

  addFuente(slide, 5.56, "Ley 21.719 · Diario Oficial núm. 44.023, 13 de diciembre de 2024 · entra en vigencia el 1 de diciembre de 2026", { w: 10.8 });
  addTakeaway(slide, "Primero la finalidad, después el juicio. Sin fin declarado no se puede decir si un dato sobra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 33 · Dos fixtures, mismo verde, distinto archivo

function slideTwoFixtures() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la proporcionalidad ejecutada",
    "Mismo resultado, distinto contenido en el disco",
    "La finalidad de esta fixture es que exista una reserva en el bloque 2. Nada más. Y eso se puede comprobar ejecutando.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 5.8,
    h: 1.96,
    title: "la versión cómoda",
    code: [
      "almacen.guardar(",
      "    conexion, bloque=2,",
      '    rut="11.111.111-1",',
      '    nombre="Ana Rivas",',
      '    correo_electronico="ana@ejemplo.cl")',
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addCodePanel(slide, SH, {
    x: M + 6.1,
    y: 2.5,
    w: 5.8,
    h: 1.96,
    title: "la versión proporcionada",
    code: ["almacen.guardar(conexion, bloque=2)"].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  rect(slide, M, 4.66, CW, 0.42, NAVY_CHIP);
  addText(slide, "Las dos producen exactamente el mismo resultado de ejecución:  4 passed in 0.65s", {
    x: M + 0.32,
    y: 4.74,
    w: CW - 0.64,
    h: 0.26,
    fontSize: 12.4,
    bold: true,
    color: C.gold,
    align: "center",
  });

  const escrito = [
    ["Lo que escribe la cómoda", "(2, '11.111.111-1', 'Ana Rivas', 'ana.rivas@ejemplo.cl')", ROJO],
    ["Lo que escribe la proporcionada", "(2, None, None, None)", VERDE],
  ];
  escrito.forEach(([titulo, fila, color], index) => {
    const y = 5.2 + index * 0.44;
    rect(slide, M, y, CW, 0.38, index === 0 ? C.warm : C.softNeutral);
    rect(slide, M, y, 0.06, 0.38, color);
    addText(slide, titulo, {
      x: M + 0.26,
      y: y + 0.07,
      w: 3.4,
      h: 0.24,
      fontSize: 11.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, fila, {
      x: M + 3.9,
      y: y + 0.07,
      w: 7.7,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color,
    });
  });

  addTakeaway(slide, "Los tres campos personales no eran necesarios: la prueba pasa igual sin ellos.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 34 · El desmontaje como eliminación verificable

function slideVerifiableDeletion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el desmontaje",
    "No se confía en que el borrado haya funcionado: se comprueba",
    "RUTA_BASE es la variable donde el proyecto guarda dónde está su base de datos. La fixture la apunta a tmp_path, el directorio temporal único que pytest entrega a cada prueba.",
    false,
    { titleFontSize: 26, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.8,
    h: 2.62,
    title: "conftest.py",
    code: [
      "@pytest.fixture",
      "def base_de_datos_de_prueba(tmp_path: Path) -> Path:",
      '    almacen.RUTA_BASE = tmp_path / "reservas-de-prueba.db"',
      "    almacen.guardar(almacen.conectar(), bloque=2)",
      "",
      "    yield almacen.RUTA_BASE",
      "",
      "    almacen.RUTA_BASE.unlink(missing_ok=True)",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  addDefinition(
    slide,
    M + 7.2,
    2.5,
    4.7,
    1.24,
    "Dos detalles del desmontaje",
    "missing_ok=True evita que el borrado falle si el archivo ya no está. Y falta una línea en el panel: assert not RUTA_BASE.exists(), «no se eliminó».",
    ROJO
  );
  addDefinition(
    slide,
    M + 7.2,
    3.88,
    4.7,
    1.24,
    "Por qué no es redundante",
    "pytest conserva el directorio temporal de las últimas 3 ejecuciones, a propósito, para poder depurar.",
    ORO
  );

  rect(slide, M, 5.3, CW, 0.74, C.paleRed);
  rect(slide, M, 5.3, 0.06, 0.74, ROJO);
  addText(
    slide,
    "tmp_path resuelve que dos pruebas no se pisen. No resuelve cuánto tiempo sobrevive lo que se escribió, y eso es justo lo que exige el artículo 3º letra c).",
    {
      x: M + 0.32,
      y: 5.44,
      w: CW - 0.64,
      h: 0.46,
      fontSize: 12.4,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(slide, "Aislamiento y eliminación son dos cosas distintas. La herramienta solo da la primera.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 35 · Cuatro pasan y la ejecución falla

function slideFourPassedFourErrors() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la evidencia",
    "Cuatro pruebas pasaron y la ejecución falló igual",
    "Alguien comenta la línea del borrado —por depurar, y se le olvida descomentarla. El código de las pruebas no cambia. El resultado sí.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.9,
    h: 2.18,
    title: "con el borrado inutilizado",
    fontSize: 9.6,
    lines: [
      { text: "E   AssertionError: la base de datos", kind: "error" },
      { text: "    de prueba no se eliminó", kind: "error" },
      { text: "ERROR test_api.py::test_reserva_aceptada", kind: "error" },
      { text: "4 passed, 4 errors in 0.75s", kind: "error" },
    ],
  });

  const distincion = [
    ["FAILED", "Una prueba que se ejecutó y su aserción no se cumplió", ROJO],
    ["ERROR", "Un fallo en la preparación o el desmontaje, fuera de la prueba", ORO],
  ];
  distincion.forEach(([etiqueta, texto, color], index) => {
    const y = 2.5 + index * 1.14;
    rect(slide, M + 7.3, y, 4.6, 1.02, C.white);
    rect(slide, M + 7.3, y, 0.06, 1.02, color);
    addText(slide, etiqueta, {
      x: M + 7.56,
      y: y + 0.16,
      w: 2.0,
      h: 0.26,
      fontSize: 12.6,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: M + 7.56,
      y: y + 0.46,
      w: 4.1,
      h: 0.44,
      fontSize: 11,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 4.86, CW, 1.16, C.warm);
  rect(slide, M, 4.86, 0.06, 1.16, ROJO);
  addText(slide, "Y la evidencia sigue en el disco", {
    x: M + 0.32,
    y: 5.02,
    w: 4.0,
    h: 0.26,
    fontSize: 13.2,
    bold: true,
    color: ROJO,
  });
  addText(slide, "pytest-14: 4 archivos .db   ·   pytest-15: 0   ·   pytest-16: 0", {
    x: M + 4.5,
    y: 5.02,
    w: 7.1,
    h: 0.26,
    fontSize: 12,
    bold: true,
    color: C.ink,
  });
  addText(
    slide,
    "pytest numera correlativamente las carpetas que crea y conserva las tres últimas. Los cuatro archivos que sobrevivieron se abren y se leen: [(2, None, None, None)] — el borrado falló de verdad, y lo que quedó guardado fue eso en lugar del nombre, el RUT y el correo de una persona.",
    {
      x: M + 0.32,
      y: 5.36,
      w: CW - 0.64,
      h: 0.5,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "La proporcionalidad no impide el incidente: decide su tamaño cuando el incidente ocurre.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 36 · El agente y los datos de prueba

function slideAgentAndTestData() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la era de los agentes",
    "«Datos de prueba realistas»",
    "Es una de las instrucciones más peligrosas que se le pueden dar, y el motivo no es que el agente se equivoque: es que hace bien lo que se le pidió.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const problemas = [
    [
      "Un RUT con dígito verificador válido puede ser el de alguien",
      "No hay intención de por medio y da lo mismo: el dato queda en la base de datos de prueba y es indistinguible de uno verdadero.",
    ],
    [
      "Si los datos se ven reales, nadie los trata como sintéticos",
      "Se copian a otro ambiente, se pegan en un ticket, se comparten en un mensaje.",
    ],
  ];
  problemas.forEach(([titulo, texto], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 2.5, 5.84, 1.32, C.warm);
    rect(slide, x, 2.5, 5.84, 0.06, ROJO);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.68,
      w: 5.24,
      h: 0.5,
      fontSize: 12.6,
      bold: true,
      color: ROJO,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.2,
      w: 5.24,
      h: 0.52,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  const criterio = [
    ["Qué hace bien", "Generar volumen sintético con formato correcto cuando se le fija el criterio.", VERDE],
    ["Qué no delegar", "Decidir qué campos entran: eso exige nombrar la finalidad, que está en el requisito.", ROJO],
    ["Error frecuente", "Pedir «realistas» en vez de «sintéticos y reconociblemente falsos».", ORO],
  ];
  criterio.forEach(([titulo, texto, color], index) => {
    const w = 3.85;
    const x = M + index * (w + 0.12);
    rect(slide, x, 3.98, w, 1.24, C.white);
    rect(slide, x, 3.98, w, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.22,
      y: 4.16,
      w: w - 0.44,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, texto, {
      x: x + 0.22,
      y: 4.42,
      w: w - 0.44,
      h: 0.7,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.38, CW, 0.64, C.paleRed);
  addText(
    slide,
    "Y una advertencia que va más allá de la fixture: pegar una fila de producción en el chat de un agente para que «entienda el formato» es comunicar datos personales a un tercero.",
    {
      x: M + 0.32,
      y: 5.52,
      w: CW - 0.64,
      h: 0.38,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(slide, "Es la versión moderna de compartir un dump por un canal informal.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 37-38 · Preguntas y respuestas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes del último bloque", [
    [
      "El artículo 3º c) exige limitar los datos a los necesarios «en relación con los fines». ¿Por qué ese criterio no se puede aplicar mirando solo la fixture?",
      "Revisa qué pasa si intentas juzgar si el RUT sobra sin haber dicho antes qué comprueba la prueba.",
    ],
    [
      "Una suite informa 4 passed, 4 errors. Un compañero dice que se puede subir igual, porque los errores son «de la fixture, no del código». ¿Qué le falta considerar?",
      "Piensa qué afirma cada una de las dos cifras por separado, y cuál de las dos habla de datos que quedaron en un disco.",
    ],
    [
      "pytest conserva a propósito los directorios de las últimas tres ejecuciones para depurar. ¿En qué se convierte esa comodidad si la fixture carga datos reales?",
      "Separa dos cosas: que dos pruebas no se pisen, y cuánto tiempo sobrevive lo que se escribió.",
    ],
  ]);
}

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "Falta la finalidad",
      "La frase dice «en relación con los fines»: sin un fin declarado no hay forma de decidir si un campo sobra.",
      "El requisito manda sobre la fixture",
      "Juzgar los datos por intuición",
    ],
    [
      "Los errores hablan de datos",
      "Las cuatro pruebas dicen que el sistema se comporta bien. Los cuatro errores dicen que los datos siguen ahí.",
      "Una ejecución afirma dos cosas distintas",
      "Leer solo la cifra cómoda",
    ],
    [
      "En una retención no decidida",
      "tmp_path da aislamiento, no eliminación: por eso el unlink explícito y su comprobación no son redundantes.",
      "La herramienta resuelve una sola de las dos",
      "Confiar el borrado a la herramienta",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 39 · Divisor del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 4 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "Dónde un doble deja de ser legítimo", {
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
    "Sustituir una dependencia por un doble de prueba es legítimo y a veces necesario. Lo que falta es el límite, y el límite lo da el nivel en el que se está probando.",
    {
      x: M,
      y: 3.94,
      w: 10.2,
      h: 0.86,
      fontSize: 15,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  addRuta(slide, 4, { y: 5.36, dark: true });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · Vocabulario del doble de prueba

function slideDoubleVocabulary() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · vocabulario que vuelve",
    "El doble de prueba, y las piezas que se usan hoy",
    "Nada de esto se da por sabido: se vuelve a dejar escrito antes de usarlo.",
    false,
    { titleFontSize: 29, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addDefinition(
    slide,
    M,
    2.46,
    CW,
    0.78,
    "Doble de prueba",
    "Un objeto que ocupa el lugar de una dependencia real mientras la prueba se ejecuta. La dependencia no corre; corre el sustituto.",
    AZUL
  );

  const tipos = [
    ["Dummy", "Se pasa para llenar un parámetro y nunca se usa"],
    ["Stub", "Devuelve una respuesta preparada de antemano"],
    ["Spy", "Un stub que además registra cómo fue llamado"],
    ["Mock", "Viene programado con las llamadas que espera recibir"],
    ["Fake", "Funciona de verdad, con un atajo que no sirve en producción"],
  ];
  tipos.forEach(([nombre, glosa], index) => {
    const w = 2.28;
    const x = M + index * (w + 0.125);
    rect(slide, x, 3.36, w, 1.12, C.softNeutral);
    rect(slide, x, 3.36, w, 0.06, index === 1 || index === 2 ? ROJO : C.slate);
    addText(slide, nombre.toUpperCase(), {
      x: x + 0.18,
      y: 3.54,
      w: w - 0.36,
      h: 0.2,
      fontSize: 10.4,
      bold: true,
      color: index === 1 || index === 2 ? ROJO : C.ink,
      charSpacing: 1.0,
    });
    addText(slide, glosa, {
      x: x + 0.18,
      y: 3.8,
      w: w - 0.36,
      h: 0.56,
      fontSize: 9.8,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addKicker(slide, M, 4.56, "Las cuatro piezas de unittest.mock que aparecen en este bloque", C.red, 7.5);

  const piezas = [
    ["create_autospec(modulo)", "Construye un doble que respeta la firma del original —sus funciones y sus parámetros—, pero no su comportamiento.", ROJO],
    [".return_value = X", "Fija la respuesta prefabricada. Eso convierte al doble en un stub.", ORO],
    [".assert_called_once_with(...)", "Comprueba que se lo llamó una vez y con esos argumentos. Eso lo usa como spy.", VERDE],
    ["MagicMock", "El objeto genérico que construye la librería. Es lo que se ve al imprimir un doble.", AZUL],
  ];
  piezas.forEach(([nombre, glosa, color], index) => {
    const w = 2.88;
    const x = M + index * (w + 0.123);
    rect(slide, x, 4.86, w, 1.16, C.white);
    rect(slide, x, 4.86, 0.06, 1.16, color);
    addText(slide, nombre, {
      x: x + 0.22,
      y: 5.0,
      w: w - 0.44,
      h: 0.24,
      fontSize: 10.6,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 5.26,
      w: w - 0.44,
      h: 0.68,
      fontSize: 9.6,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Hoy se usan los dos del medio: el stub que responde y el spy que registra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · El criterio

function slideSubstitutionCriterion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el criterio",
    "Se sustituye al otro lado del límite, no en el límite",
    "Los dobles no son ilegítimos en este nivel. Lo que decide es dónde se los pone.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addDefinition(
    slide,
    M,
    2.46,
    CW,
    0.86,
    "ISTQB · el objeto del nivel de integración",
    "«Se centra en probar las interfaces y las interacciones entre componentes.» Si el objeto es la interacción, sustituirla deja a la prueba sin objeto.",
    AZUL
  );

  const fowler = [
    [
      "Pruebas de integración estrechas",
      "«Ejercitan solo la porción de código de mi servicio que habla con un servicio separado… usan dobles de prueba de esos servicios.»",
      VERDE,
    ],
    [
      "Pruebas de integración amplias",
      "«Requieren versiones vivas de todos los servicios… ejercitan caminos de código a través de todos los servicios.»",
      ORO,
    ],
  ];
  fowler.forEach(([titulo, cita, color], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 3.46, 5.84, 1.34, C.white);
    rect(slide, x, 3.46, 5.84, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 3.64,
      w: 5.24,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, cita, {
      x: x + 0.3,
      y: 3.96,
      w: 5.24,
      h: 0.7,
      fontSize: 11.4,
      italic: true,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 4.94, CW, 1.08, NAVY_CHIP);
  addText(
    slide,
    "Se sustituye lo que está al otro lado del límite que se está probando. No se sustituye el código propio que está en ese límite, porque entonces ese código no se ejecuta y el límite no se prueba.",
    {
      x: M + 0.32,
      y: 5.12,
      w: CW - 0.64,
      h: 0.7,
      fontSize: 13,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(slide, "Pregunta práctica: ¿qué defecto seguiría ahí si esta prueba pasara?", { fill: C.red });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · El defecto que solo la base real encuentra

function slideRealBaseCatches() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el defecto",
    "Un argumento equivocado, y el sistema permite reservar dos veces",
    "Es un descuido de copiar y pegar. La línea sigue siendo correcta, los dos valores son enteros y ningún analizador estático la marca.",
    false,
    { titleFontSize: 26, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 1.52,
    title: "api.py · donde debía ir solicitud.bloque",
    code: ["tomado = almacen.bloque_tomado(conexion, solicitud.personas)"].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  addTerminalPanel(slide, SH, {
    x: M + 7.5,
    y: 2.5,
    w: 4.4,
    h: 1.52,
    title: "con la base real",
    fontSize: 9.6,
    lines: [
      { text: "E   assert 201 == 409", kind: "error" },
      { text: "1 failed, 3 passed", kind: "error" },
    ],
  });

  rect(slide, M, 4.18, CW, 1.36, C.softNeutral);
  rect(slide, M, 4.18, 0.06, 1.36, VERDE);
  addText(slide, "Por qué la encuentra", {
    x: M + 0.32,
    y: 4.36,
    w: 4.0,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: VERDE,
  });
  addText(
    slide,
    "La prueba pidió el bloque 2, que la fixture había dejado reservado, y el sistema respondió 201: lo aceptó. Funcionó porque la consulta salió de verdad hacia el archivo, buscó reservas en el bloque 12 —el número de personas— y no encontró ninguna.",
    {
      x: M + 0.32,
      y: 4.68,
      w: CW - 0.64,
      h: 0.68,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(slide, "La suite del bloque anterior lo encuentra sin que haya que hacer nada nuevo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 42 · La misma comprobación con la base sustituida

function slideDoubledBasePasses() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la misma comprobación",
    "Verde, más rápido, y comprobando exactamente nada",
    "Ahora escrita como se escribe cuando se quiere que la prueba no dependa de ningún archivo. El defecto sigue en la API, sin tocar.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 2.18,
    title: "test_api_con_doble.py",
    code: [
      "api.almacen = create_autospec(almacen)",
      "",
      "def test_bloque_ya_tomado_responde_409(almacen_doble):",
      "    almacen_doble.bloque_tomado.return_value = True",
      "    respuesta = cliente.post(...)",
      "    assert respuesta.status_code == 409",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });

  addTerminalPanel(slide, SH, {
    x: M + 7.5,
    y: 2.5,
    w: 4.4,
    h: 1.3,
    title: "con la base sustituida",
    fontSize: 9.8,
    lines: [{ text: "1 passed in 0.47s", kind: "ok" }],
  });

  addDefinition(
    slide,
    M + 7.5,
    3.94,
    4.4,
    0.74,
    "return_value",
    "Fija la respuesta prefabricada del stub.",
    AZUL
  );

  rect(slide, M, 4.72, CW, 0.38, NAVY_CHIP);
  ["", "Base real", "Base sustituida"].forEach((titulo, index) => {
    if (!titulo) return;
    addText(slide, titulo.toUpperCase(), {
      x: M + 4.5 + (index - 1) * 3.6,
      y: 4.80,
      w: 3.2,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const comparacion = [
    ["Resultado", "1 failed, 3 passed", "1 passed"],
    ["El defecto", "queda expuesto", "sigue ahí, invisible"],
    ["Qué se ejecutó", "la consulta, el archivo, la comparación", "la aserción, y nada más"],
  ];
  comparacion.forEach(([que, real, doble], index) => {
    const y = 5.14 + index * 0.34;
    rect(slide, M, y, CW, 0.32, index % 2 === 0 ? C.softNeutral : C.paper);
    addText(slide, que, {
      x: M + 0.26,
      y: y + 0.06,
      w: 3.9,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, real, {
      x: M + 4.5,
      y: y + 0.06,
      w: 3.4,
      h: 0.24,
      fontSize: 11.2,
      color: VERDE,
    });
    addText(slide, doble, {
      x: M + 8.1,
      y: y + 0.06,
      w: 3.5,
      h: 0.24,
      fontSize: 11.2,
      color: ROJO,
    });
  });

  addTakeaway(slide, "Reconocer un bloque tomado es consultar la base. Al sustituirla, eso no ocurre.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 43 · Lo que el doble sí registró

function slideSpyRecorded() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el detalle que indica el remedio",
    "El doble no ignoró el defecto: lo anotó",
    "Preguntándole con qué se lo llamó aparece la evidencia que estaba dentro de la prueba y que la prueba no miró.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 7.1,
    h: 1.52,
    title: "almacen_doble.bloque_tomado.call_args",
    fontSize: 9.6,
    lines: [{ text: "call(<MagicMock name='mock.conectar()'>, 12)", kind: "muted" }],
  });

  addDefinition(
    slide,
    M + 7.5,
    2.5,
    4.4,
    1.52,
    "Ese 12 es el número de personas",
    "El doble registró que la API preguntó por el bloque 12 cuando la solicitud era del bloque 2.",
    ROJO
  );

  rect(slide, M, 4.18, CW, 0.56, C.softNeutral);
  addText(slide, "almacen_doble.bloque_tomado.assert_called_once_with(cualquier_conexion, 2)", {
    x: M + 0.32,
    y: 4.3,
    w: CW - 0.64,
    h: 0.32,
    fontSize: 12.6,
    bold: true,
    color: C.ink,
    align: "center",
  });

  rect(slide, M, 4.9, CW, 1.12, C.warm);
  rect(slide, M, 4.9, 0.06, 1.12, ORO);
  addText(slide, "Lo que esa aserción comprueba y lo que no", {
    x: M + 0.32,
    y: 5.08,
    w: 5.2,
    h: 0.28,
    fontSize: 13.4,
    bold: true,
    color: ORO,
  });
  addText(
    slide,
    "Comprueba que la API pide lo correcto, no que la base responda correctamente a lo que se le pide. Sustituir obliga a duplicar en la prueba lo que se sabe de la dependencia, y esa copia puede quedar desactualizada respecto de la real.",
    {
      x: M + 0.32,
      y: 5.4,
      w: CW - 0.64,
      h: 0.5,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Sustituir una dependencia obliga a comprobar también qué se le pidió.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 44 · El agente y la prueba de integración

function slideAgentIntegrationTest() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la era de los agentes",
    "«Una prueba de integración para este endpoint»",
    "«Endpoint» es como se llama habitualmente a una ruta de la API. Esa instrucción produce, con mucha frecuencia, exactamente el archivo con dobles que se acaba de ver.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const causas = [
    ["Es lo que abunda en su material", "Las pruebas con dependencias sustituidas son más numerosas, más cortas y más fáciles de mostrar en un ejemplo."],
    ["Es lo que optimiza la señal pedida", "Una prueba con dobles es rápida, no necesita ambiente y pasa a la primera. Si el criterio es «corre y pasa», sustituir siempre gana."],
  ];
  causas.forEach(([titulo, texto], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 2.5, 5.84, 1.24, C.warm);
    rect(slide, x, 2.5, 5.84, 0.06, ROJO);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.68,
      w: 5.24,
      h: 0.28,
      fontSize: 12.8,
      bold: true,
      color: ROJO,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.0,
      w: 5.24,
      h: 0.62,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  const criterio = [
    ["Qué hace bien", "El andamiaje del doble: create_autospec, la fixture que reemplaza y restaura, las aserciones sobre llamadas.", VERDE],
    ["Qué no delegar", "Decidir qué se sustituye: exige saber cuál es el objeto de la prueba, y eso está en el requisito.", ROJO],
    ["Error frecuente", "Aceptar la prueba porque es rápida y pasa. Las dos propiedades son consecuencia de lo que la vacía.", ORO],
  ];
  criterio.forEach(([titulo, texto, color], index) => {
    const w = 3.85;
    const x = M + index * (w + 0.12);
    rect(slide, x, 3.9, w, 1.36, C.white);
    rect(slide, x, 3.9, w, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.22,
      y: 4.08,
      w: w - 0.44,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    addText(slide, texto, {
      x: x + 0.22,
      y: 4.34,
      w: w - 0.44,
      h: 0.82,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.42, CW, 0.6, NAVY_CHIP);
  addText(
    slide,
    "La instrucción que rinde nombra el límite: «prueba de integración que use la base de datos real sobre un archivo temporal, sin sustituir el módulo de almacenamiento».",
    {
      x: M + 0.32,
      y: 5.54,
      w: CW - 0.64,
      h: 0.36,
      fontSize: 12.2,
      bold: true,
      color: C.gold,
      align: "center",
      valign: "mid",
    }
  );

  addTakeaway(slide, "Es verificable —se puede leer la prueba y comprobarlo— y no admite la salida cómoda.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 45-46 · Preguntas y respuestas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar", [
    [
      "La misma comprobación dio 1 failed con la base real y 1 passed con la base sustituida, sobre el mismo código defectuoso. ¿Cuál de las dos pruebas está mal escrita?",
      "Pregúntate qué afirma cada una. Una habla del sistema; la otra, de lo que el autor le dijo al doble que respondiera.",
    ],
    [
      "create_autospec se presentó como la forma segura de construir un doble porque respeta la firma. Aquí no detectó nada. ¿Qué clase de defecto sí detecta y cuál no?",
      "Compara qué cambia cuando alguien renombra un parámetro de la dependencia con qué cambia cuando le pasa el valor equivocado.",
    ],
    [
      "Un compañero defiende sus pruebas con dobles: la suite corre en 0,3 segundos y con base de datos tardaría diez veces más. ¿Qué le concedes y qué no?",
      "Los dos niveles existen y los dos son necesarios. La pregunta no es cuál elegir, sino qué queda sin comprobar si solo hay uno.",
    ],
  ]);
}

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "La que pasa",
      "La que falla describe el sistema. La que pasa solo confirma lo que el autor de la prueba le dijo al doble.",
      "Fallar no es estar mal escrita",
      "Creer que verde es mejor que rojo",
    ],
    [
      "Detecta la firma, no el valor",
      "Avisa si cambia el nombre o el número de parámetros. No tiene nada que decir sobre cuál valor se pasa.",
      "La llamada respetaba la firma perfectamente",
      "Confiar en autospec como garantía",
    ],
    [
      "El tiempo, no la conclusión",
      "Es cierto que son más rápidas. No es cierto que reemplacen: nada de lo sustituido queda comprobado.",
      "Los dos niveles son necesarios",
      "Elegir uno y declarar probado el sistema",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 47 · Cierre · lo que puede afirmar cada nivel

function slideLevelsClaims() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · la síntesis",
    "Tres niveles, tres afirmaciones distintas",
    "No se reemplazan entre sí, y confundirlos es lo que lleva a creer que un sistema está probado cuando no lo está.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  rect(slide, M, 2.5, CW, 0.38, NAVY_CHIP);
  ["Nivel", "Qué afirma", "Qué no puede afirmar"].forEach((titulo, index) => {
    addText(slide, titulo.toUpperCase(), {
      x: M + 0.26 + [0, 3.3, 7.6][index],
      y: 2.58,
      w: 3.0,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.gold,
      charSpacing: 1.1,
    });
  });

  const niveles = [
    ["Unitario", "Que una función decide lo correcto, aislada del resto", "Que alguien la llame, ni que la llamen bien", AZUL],
    ["Integración con la dependencia real", "Que dos piezas se entienden: el dato, el contrato, la consulta que sale de verdad", "Que el sistema sirva para lo que fue construido", VERDE],
    ["Integración con la dependencia sustituida", "Que la pieza propia hace las llamadas que se espera que haga", "Nada sobre la dependencia sustituida ni sobre el acuerdo con ella", ORO],
  ];
  niveles.forEach(([nivel, afirma, no, color], index) => {
    const y = 2.94 + index * 0.88;
    rect(slide, M, y, CW, 0.8, index % 2 === 0 ? C.softNeutral : C.paper);
    rect(slide, M, y, 0.06, 0.8, color);
    addText(slide, nivel, {
      x: M + 0.26,
      y: y + 0.14,
      w: 2.9,
      h: 0.56,
      fontSize: 12.2,
      bold: true,
      color,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, afirma, {
      x: M + 3.56,
      y: y + 0.14,
      w: 4.1,
      h: 0.56,
      fontSize: 11.4,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, no, {
      x: M + 7.86,
      y: y + 0.14,
      w: 3.8,
      h: 0.56,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 5.58, CW, 0.44, C.warm);
  addText(
    slide,
    "La tercera fila es la que más se malinterpreta: es un nivel legítimo, siempre que quien lo escribe sepa que comprueba sus propias llamadas y no la colaboración.",
    {
      x: M + 0.32,
      y: 5.66,
      w: CW - 0.64,
      h: 0.3,
      fontSize: 12,
      color: C.ink,
      valign: "mid",
    }
  );

  addTakeaway(slide, "Cada nivel existe porque encuentra una clase de defecto que los otros no encuentran.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 48 · Cierre · la afirmación que se puede sostener

function slideFinalClaim() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Cierre · la evidencia acumulada",
    "Lo que hoy se puede afirmar y mostrar",
    "Tres afirmaciones, y cada una con la ejecución que la respalda.",
    true,
    { titleFontSize: 30, subtitleW: 11.2, subtitleH: 0.4 }
  );

  const afirmaciones = [
    ["Estas piezas se entienden entre sí", "y puedo mostrar el contrato contra el que lo comprobé"],
    ["Cada prueba prepara el estado que necesita", "y puedo mostrarlo ejecutándolas por separado"],
    ["Los datos que usé ya no existen", "y puedo mostrar la ejecución que lo verifica"],
  ];
  afirmaciones.forEach(([afirmacion, prueba], index) => {
    const y = 2.5 + index * 0.84;
    rect(slide, M, y, CW, 0.72, index % 2 === 0 ? NAVY_CHIP : C.navy);
    rect(slide, M, y, 0.06, 0.72, C.gold);
    addText(slide, afirmacion, {
      x: M + 0.32,
      y: y + 0.11,
      w: 5.6,
      h: 0.5,
      fontSize: 13.6,
      bold: true,
      color: C.white,
      valign: "mid",
    });
    addText(slide, prueba, {
      x: M + 6.1,
      y: y + 0.11,
      w: 5.5,
      h: 0.5,
      fontSize: 12,
      italic: true,
      color: C.softBlue,
      valign: "mid",
    });
  });

  rect(slide, M, 5.12, CW, 0.94, C.red);
  addText(slide, "Lo que sigue sin poder afirmarse", {
    x: M + 0.32,
    y: 5.28,
    w: 4.4,
    h: 0.26,
    fontSize: 12.4,
    bold: true,
    color: C.white,
  });
  addText(
    slide,
    "Que el sistema sirva para lo que fue construido. Todo lo de hoy se comprobó enviando solicitudes desde un programa. Nadie abrió el sistema y lo usó.",
    {
      x: M + 0.32,
      y: 5.58,
      w: CW - 0.64,
      h: 0.3,
      fontSize: 12.2,
      color: C.white,
    }
  );

  addTakeaway(slide, "Ticket de salida: un defecto de contrato, una prueba ejecutada sola, un campo sin finalidad.", { fill: NAVY_CHIP, color: C.gold });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 49 · Cierre · puente y mensaje final

function slideNextClassBridge() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · lo que viene",
    "El sistema visto por quien lo usa",
    "Todo lo de hoy pasó por debajo de la interfaz, y fue deliberado: permitió aislar el contrato y los datos sin que se mezclara nada más.",
    false,
    { titleFontSize: 30, subtitleW: 11.4, subtitleH: 0.4 }
  );

  const siguiente = [
    ["Un navegador de verdad", "El objeto de prueba pasa a ser el sistema completo, tal como lo encuentra una persona.", AZUL],
    ["Las esperas de una pantalla", "Aparece, por primera vez en el módulo, una prueba que falla sin que nadie haya tocado el sistema.", ORO],
  ];
  siguiente.forEach(([titulo, texto, color], index) => {
    const x = M + index * 6.05;
    rect(slide, x, 2.5, 5.84, 1.2, C.softNeutral);
    rect(slide, x, 2.5, 5.84, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.3,
      y: 2.7,
      w: 5.24,
      h: 0.28,
      fontSize: 13.2,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x + 0.3,
      y: 3.02,
      w: 5.24,
      h: 0.56,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 3.9, CW, 0.74, C.warm);
  addText(
    slide,
    "Los tres hallazgos de hoy tienen la misma forma: el defecto de contrato estaba entre dos funciones correctas, la prueba solitaria pasaba por algo que hizo otra prueba, y el doble ocultaba el defecto ocupando el lugar donde había que mirar.",
    {
      x: M + 0.32,
      y: 4.04,
      w: CW - 0.64,
      h: 0.46,
      fontSize: 12.2,
      color: C.ink,
      valign: "mid",
    }
  );

  rect(slide, M, 4.78, CW, 1.54, C.navy);
  rect(slide, M, 4.78, 0.08, 1.54, C.gold);
  addText(
    slide,
    "Un sistema no es la suma de sus piezas, sino de sus piezas y de los acuerdos entre ellas. Los acuerdos no viven dentro de ningún archivo, y por eso ninguna prueba que mire un archivo solo puede comprobarlos.",
    {
      x: M + 0.42,
      y: 4.96,
      w: CW - 0.84,
      h: 0.76,
      fontSize: 14.2,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.16,
    }
  );
  addText(
    slide,
    "Un agente escribe las piezas cada vez mejor; decidir qué acuerdo tenían que cumplir, y negarse a sustituir justo aquello que hay que observar, sigue siendo trabajo de quien firma.",
    {
      x: M + 0.42,
      y: 5.86,
      w: CW - 0.84,
      h: 0.42,
      fontSize: 12.4,
      color: C.sand,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Orden del deck.

slideCover();
slideOpeningQuestion();
slideWhereDefectsLive();
slidePurpose();
slideMap();

slideBlockOneDivider();
slideUnitSuiteGreen();
slideTestLevels();
slideHttpAndCodes();
slideTheApi();
slideContract();
slideFirstTest();
slideRed422();
slideRed200();
slideThreeDefects();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideContractFixed();
slideThreeGreen();
slideOrderDecides();
slideMeszarosDiagnosis();
slideFixtureAnatomy();
slideFixtureRestored();
slideScopeDecision();
slideAgentAndIsolation();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideMemoryToDisk();
slideTestEnvIsProcessing();
slideProportionality();
slideTwoFixtures();
slideVerifiableDeletion();
slideFourPassedFourErrors();
slideAgentAndTestData();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideDoubleVocabulary();
slideSubstitutionCriterion();
slideRealBaseCatches();
slideDoubledBasePasses();
slideSpyRecorded();
slideAgentIntegrationTest();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideLevelsClaims();
slideFinalClaim();
slideNextClassBridge();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
