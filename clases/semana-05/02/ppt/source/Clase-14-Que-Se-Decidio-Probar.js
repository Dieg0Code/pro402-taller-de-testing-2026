const path = require("path");
const PptxGenJS = require("../../../../../tools/slides-system/node_modules/pptxgenjs");
const slidesSystem = require("../../../../../tools/slides-system");
const {
  imageSizingContain,
} = require("../../../../../tools/slides-system/vendor/pptxgenjs_helpers/image");

const { theme, components, utils } = slidesSystem;
const { applyAiepTheme, TOKENS: C, TYPOGRAPHY } = theme;
const { addCodePanel: addCodePanelDelSistema, addTerminalPanel } = components;

// El panel del sistema deja el numero de linea pegado al codigo («1def»).
// Un espacio al comienzo de cada linea los separa sin tocar el sistema compartido.
function addCodePanel(slide, SH, opts) {
  const codigo = opts.code.split(String.fromCharCode(10)).map((linea) => " " + linea).join(String.fromCharCode(10));
  return addCodePanelDelSistema(slide, SH, { ...opts, code: codigo });
}
const { validateSlide } = utils;

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
applyAiepTheme(pptx, {
  author: "Diego Obando",
  company: "AIEP Osorno",
  subject: "PRO402 · Clase 14",
  title: "Que se decidio probar",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-14-Que-Se-Decidio-Probar.pptx");

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
// Firma visual de la clase: el recorrido de trabajo en cuatro pasos.

const RUTA = [
  ["Declarar", "Qué se prueba y qué queda fuera"],
  ["Priorizar", "Dónde duele más un fallo"],
  ["Trazar", "Qué prueba responde a qué requisito"],
  ["Comprobar", "Que la traza sea verdadera"],
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
// 01 · Portada

function slideCover() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.42, "PRO402 · Clase 14 · Unidad 2", C.gold, 6);
  addText(slide, "Qué se decidió probar", {
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
  addText(slide, "El plan de pruebas, el riesgo que reparte el esfuerzo y una trazabilidad que se ejecuta", {
    x: M,
    y: 3.4,
    w: 11.2,
    h: 0.46,
    fontSize: 18,
    color: C.softBlue,
  });
  addText(
    slide,
    "Una suite en verde informa sobre las pruebas que existen. Sobre las que no existen no dice nada, y no puede decirlo: ningún programa informa sobre algo que nadie escribió. Lo que falta se decide, se escribe y se comprueba en otra parte.",
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
  addText(slide, "Martes 29 de septiembre de 2026 · 08:30 – 10:50 · Laboratorio PC", {
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
    "Veintitrés pruebas. ¿Qué quedó sin probar?",
    "La única roja es la prueba de suplantación del lunes, que quedó así a propósito.",
    false,
    { subtitleH: 0.38 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.3,
    h: 1.76,
    title: "Suite de pytest del proyecto",
    fontSize: 10.4,
    lines: [
      { text: "> uv run pytest -q" },
      { text: "......................F         [100%]", kind: "muted" },
      { text: "1 failed, 22 passed, 1 warning in 1.94s" },
    ],
  });

  addDefinition(
    slide,
    M,
    4.36,
    6.3,
    1.18,
    "Suite",
    "Las pruebas automatizadas que se ejecutan juntas, con un solo comando. El proyecto tiene dos: la de pytest, con veintitrés, y la de la interfaz, que corre con otro ejecutor.",
    AZUL
  );

  addKicker(slide, 7.18, 2.44, "Dos suites distintas, la misma línea final", C.red, 5.44);

  addCard(
    slide,
    7.18,
    2.72,
    5.44,
    1.18,
    "Una suite completa",
    "Cubre todas las reglas del sistema y todos sus bordes. Termina con veintidós en verde y el rojo que ya se conoce.",
    VERDE
  );

  addCard(
    slide,
    7.18,
    4.02,
    5.44,
    1.18,
    "Una suite a la que le falta la mitad",
    "Si alguien borrara ocho de las veintidós que pasan, informaría catorce en verde y el mismo rojo.",
    ROJO
  );

  addText(
    slide,
    "El resultado no cambia cuando faltan pruebas. Solo cambia cuando las que hay fallan.",
    {
      x: 7.18,
      y: 5.34,
      w: 5.44,
      h: 0.6,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Informa sobre las pruebas que existen. Sobre las que no existen no puede decir nada.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · El mismo limite, un nivel mas arriba

function slideWhatGreenCovers() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El alcance de un verde",
    "El mismo límite, un escalón más arriba",
    "Subir de una prueba a una suite no cambia la naturaleza del límite. Solo lo vuelve más difícil de notar.",
    false,
    { subtitleH: 0.38 }
  );

  rect(slide, M, 3.06, 7.64, 0.5, C.softNeutral);
  rect(slide, M, 3.06, 0.06, 0.5, C.slate);
  addText(
    slide,
    "Cada escalón afirma sobre lo que existe, nunca sobre lo que falta.",
    {
      x: M + 0.26,
      y: 3.18,
      w: 7.1,
      h: 0.28,
      fontSize: 11.8,
      color: C.ink,
    }
  );

  const base = 5.9;
  const escalones = [
    [M, 3.74, 1.3, "Una prueba en verde", "Ese caso se comportó como se esperaba.", AZUL],
    [4.62, 3.74, 2.1, "Una suite en verde", "Los casos que existen se comportaron así.", ORO],
  ];

  escalones.forEach(([x, w, alto, titulo, glosa, color]) => {
    const y = base - alto;
    rect(slide, x, y, w, alto, C.white);
    rect(slide, x, y, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.26,
      y: y + 0.22,
      w: w - 0.52,
      h: 0.3,
      fontSize: 14.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: y + 0.56,
      w: w - 0.52,
      h: 0.44,
      fontSize: 11.2,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addKicker(slide, 8.52, 2.72, "El escalón que nadie subió", ROJO, 4.09);
  arrow(slide, 7.9, 3.32, 0.5, ROJO, 1.8);

  rect(slide, 8.52, 3.0, 4.093, 2.9, C.warm, ROJO);
  addText(slide, "El sistema probado", {
    x: 8.78,
    y: 3.2,
    w: 3.57,
    h: 0.3,
    fontSize: 14.6,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Nadie afirmó esto, y nada lo advierte.", {
    x: 8.78,
    y: 3.54,
    w: 3.57,
    h: 0.3,
    fontSize: 11.2,
    color: ROJO,
  });

  rule(slide, 8.78, 3.92, 3.57, ROJO, 0.8);
  addText(slide, "LO QUE FALTA PARA PODER AFIRMARLO", {
    x: 8.78,
    y: 4.02,
    w: 3.57,
    h: 0.2,
    fontSize: 8.6,
    bold: true,
    color: ROJO,
    charSpacing: 0.9,
  });

  const faltantes = [
    "Quién decidió qué se probaba",
    "Qué incluyó en esa decisión",
    "Qué descartó",
    "Con qué argumento",
  ];
  faltantes.forEach((texto, index) => {
    const y = 4.34 + index * 0.36;
    rect(slide, 8.78, y + 0.07, 0.14, 0.14, ROJO);
    addText(slide, texto, {
      x: 9.06,
      y,
      w: 3.29,
      h: 0.28,
      fontSize: 11.4,
      color: C.ink,
    });
  });

  addTakeaway(slide, "Ninguno de esos cuatro datos está en el repositorio.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Las tres preguntas de la sesion

function slidePurpose() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "De qué se trata la sesión",
    "Tres preguntas que el código no responde",
    "Cada una tiene su artefacto, y los tres se construyen hoy sobre el proyecto propio.",
    false,
    { subtitleH: 0.38 }
  );

  const filas = [
    ["1", "¿Qué se decidió probar, y qué quedó fuera?", "El plan de pruebas", "Norma 29119-3, cláusula 7.2", AZUL],
    ["2", "¿Por qué el esfuerzo está ahí y no en otra parte?", "El riesgo", "Probabilidad por impacto", ORO],
    ["3", "¿Coincide lo decidido con lo escrito?", "La matriz de trazabilidad", "Generada desde la suite", VERDE],
  ];

  filas.forEach(([numero, pregunta, artefacto, glosa, color], index) => {
    const y = 2.5 + index * 1.02;
    addText(slide, numero, {
      x: M,
      y: y + 0.14,
      w: 0.66,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 34,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, pregunta, {
      x: M + 0.8,
      y: y + 0.2,
      w: 4.3,
      h: 0.48,
      fontSize: 14.6,
      bold: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
    arrow(slide, 6.0, y + 0.44, 0.7, color, 1.6);
    rect(slide, 6.92, y, 5.69, 0.88, C.white);
    rect(slide, 6.92, y, 0.06, 0.88, color);
    addText(slide, artefacto, {
      x: 7.2,
      y: y + 0.14,
      w: 5.3,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: 7.2,
      y: y + 0.48,
      w: 5.3,
      h: 0.26,
      fontSize: 10.6,
      color: C.slate,
    });
  });

  rect(slide, M, 5.62, CW, 0.5, C.red);
  addText(
    slide,
    "Cuando los tres se contradicen, arbitra un cuarto: alterar el código y exigir el rojo.",
    {
      x: M + 0.3,
      y: 5.72,
      w: CW - 0.6,
      h: 0.3,
      fontSize: 12.6,
      bold: true,
      color: C.white,
    }
  );

  addTakeaway(slide, "Ninguna de las tres se responde leyendo el repositorio.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 05 · Mapa de la sesion

function slideMap() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Mapa de la sesión",
    "140 minutos, cuatro bloques y un recorrido",
    "El encuadre toma 10 minutos, hay una pausa de 10 a mitad de camino y el cierre toma los últimos 10.",
    false,
    { subtitleH: 0.38 }
  );

  const bloques = [
    ["Bloque 1 · 25 min", "El plan", "Qué contiene un plan de pruebas que no puede estar en el código.", AZUL],
    ["Bloque 2 · 25 min", "El riesgo", "Cómo se reparte el esfuerzo, y por qué hoy no está repartido así.", ORO],
    ["Bloque 3 · 30 min", "La matriz", "La trazabilidad generada desde la suite, y lo que no alcanza a ver.", VERDE],
    ["Bloque 4 · 30 min", "Los derechos", "La Ley 21.719 convertida en filas de esa misma matriz.", ROJO],
  ];

  const w = (CW - 0.36) / 4;
  bloques.forEach(([rotulo, titulo, glosa, color], index) => {
    const x = M + index * (w + 0.12);
    rect(slide, x, 2.46, w, 1.42, C.white);
    rect(slide, x, 2.46, w, 0.06, color);
    addText(slide, rotulo.toUpperCase(), {
      x: x + 0.2,
      y: 2.64,
      w: w - 0.4,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, titulo, {
      x: x + 0.2,
      y: 2.88,
      w: w - 0.4,
      h: 0.32,
      fontSize: 16,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.2,
      y: 3.26,
      w: w - 0.4,
      h: 0.54,
      fontSize: 10.2,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 4.04, CW, 0.5, C.softNeutral);
  addText(
    slide,
    "Se trabaja sobre el mismo proyecto de reserva de laboratorio, con dos piezas nuevas: un archivo de requisitos con identificadores estables, y un registro de eventos donde el sistema guarda lo que fue ocurriendo.",
    {
      x: M + 0.28,
      y: 4.14,
      w: CW - 0.56,
      h: 0.32,
      fontSize: 11.2,
      color: C.ink,
    }
  );

  addKicker(slide, M, 4.72, "El recorrido de trabajo de la sesión", C.red, 6);
  addRuta(slide, 0, { y: 4.98 });

  addTakeaway(slide, "Se declara, se prioriza, se traza y se comprueba que la traza sea verdadera.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · Divisor del bloque 1

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 1 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "El plan responde lo que la suite no puede", {
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
    "Qué información contiene un plan de pruebas que no puede deducirse de ningún archivo del repositorio, leída en la norma que la define. Y la comprobación de que un proyecto puede tener toda su suite en verde mientras arrastra un defecto que contradice su requisito.",
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
// 07 · Que es un plan de pruebas

function slideTestPlanDefinition() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la norma",
    "El documento donde viven las decisiones",
    "Cláusula 3.19, en traducción del original en inglés: descripción detallada de los objetivos de prueba, y de los medios y el calendario para alcanzarlos.",
    false,
    { subtitleH: 0.42 }
  );

  const w = (CW - 0.2) / 2;
  const territorios = [
    [
      M,
      "El repositorio registra",
      AZUL,
      C.white,
      ["Los casos de prueba", "El comando que los ejecuta", "Las dependencias y su versión", "La salida de cada ejecución", "El historial de cambios"],
    ],
    [
      M + w + 0.2,
      "Solo el plan registra",
      ROJO,
      C.warm,
      ["Qué quedó deliberadamente fuera", "Qué riesgo se acepta, y por qué", "Sobre qué supuestos se trabaja", "Cuándo probar es suficiente", "Quién responde por cada cosa"],
    ],
  ];

  territorios.forEach(([x, titulo, color, fondo, items]) => {
    rect(slide, x, 2.5, w, 2.86, fondo);
    rect(slide, x, 2.5, w, 0.06, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.28,
      y: 2.7,
      w: w - 0.56,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color,
      charSpacing: 1.1,
    });
    items.forEach((item, index) => {
      const y = 3.1 + index * 0.42;
      rect(slide, x + 0.28, y + 0.08, 0.14, 0.14, color);
      addText(slide, item, {
        x: x + 0.56,
        y,
        w: w - 0.84,
        h: 0.3,
        fontSize: 12.4,
        color: C.ink,
      });
    });
  });

  const terminos = [
    ["Elemento de prueba", "La cosa concreta que se prueba: una función, una ruta, un módulo.", AZUL],
    ["Objetivo de prueba", "Qué se quiere averiguar sobre ella. Nunca «que funcione».", ORO],
  ];
  terminos.forEach(([termino, glosa, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 5.5, w, 0.52, C.softNeutral);
    rect(slide, x, 5.5, 0.06, 0.52, color);
    addText(slide, termino.toUpperCase(), {
      x: x + 0.24,
      y: 5.6,
      w: 1.9,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, glosa, {
      x: x + 2.22,
      y: 5.59,
      w: w - 2.46,
      h: 0.32,
      fontSize: 10.4,
      color: C.ink,
    });
  });

  addTakeaway(slide, "Un repositorio dice qué se probó. No puede decir qué se decidió probar.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · Las diez partes de la clausula 7.2

function slideTenSubclauses() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la norma",
    "Las diez partes que la norma pide",
    "Cláusula 7.2, traducida. El número es el identificador: con él se encuentra cada parte en la norma.",
    false,
    { subtitleH: 0.38 }
  );

  const partes = [
    ["7.2.1", "Panorama general", "Identificación del documento, su alcance y a qué se aplica.", false],
    ["7.2.2", "Contexto de las pruebas", "Qué se va a probar, en qué proyecto se inserta y qué queda fuera.", false],
    ["7.2.3", "Supuestos y restricciones", "Lo que se da por cierto sin haberlo verificado, y lo que limita el trabajo.", false],
    ["7.2.4", "Partes interesadas", "Quién tiene interés en el resultado de estas pruebas.", false],
    ["7.2.5", "Comunicación de las pruebas", "Quién informa qué, a quién y cada cuánto.", false],
    ["7.2.6", "Registro de riesgos", "Los riesgos identificados, con su valoración y su tratamiento.", true],
    ["7.2.7", "Estrategia de pruebas", "El enfoque: qué niveles, qué técnicas, qué datos, qué ambiente y cuándo se para.", true],
    ["7.2.8", "Actividades y estimaciones", "Qué actividades hay que hacer y cuánto esfuerzo cuestan.", false],
    ["7.2.9", "Personal y roles", "Quién hace cada cosa y qué necesita saber para hacerla.", false],
    ["7.2.10", "Calendario", "Cuándo ocurre cada actividad.", false],
  ];

  const w = (CW - 0.18) / 2;
  partes.forEach(([clausula, nombre, glosa, destacada], index) => {
    const columna = index < 5 ? 0 : 1;
    const fila = index % 5;
    const x = M + columna * (w + 0.18);
    const y = 2.46 + fila * 0.68;
    const color = destacada ? ROJO : C.slate;
    rect(slide, x, y, w, 0.62, destacada ? C.warm : C.white);
    rect(slide, x, y, 0.06, 0.62, destacada ? ROJO : AZUL);
    addText(slide, `${clausula} · ${nombre}`, {
      x: x + 0.24,
      y: y + 0.1,
      w: w - 0.48,
      h: 0.2,
      fontSize: 10.6,
      bold: true,
      color: destacada ? ROJO : C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: y + 0.32,
      w: w - 0.48,
      h: 0.24,
      fontSize: 9.6,
      color: color,
      lineSpacingMultiple: 1.05,
    });
  });

  addFuente(slide, 5.96, "Las dos partes en rojo son las que esta sesión construye: el registro de riesgos en el bloque 2 y la estrategia en los bloques 2 y 3.", { w: 11.2, color: ROJO });

  addTakeaway(slide, "Ninguna de las diez se obtiene leyendo el repositorio.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · La estrategia y el criterio de salida

function slideStrategyAndExit() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · cómo se anidan",
    "No son tres documentos: es uno dentro de otro",
    "La estrategia es una parte del plan, y el criterio de salida vive dentro de la estrategia sin tener subcláusula propia.",
    false,
    { subtitleH: 0.38, titleFontSize: 26 }
  );

  rect(slide, M, 2.5, 6.1, 3.0, C.softNeutral);
  addText(slide, "PLAN DE PRUEBAS · cláusula 7.2", {
    x: M + 0.26,
    y: 2.66,
    w: 5.6,
    h: 0.24,
    fontSize: 10.2,
    bold: true,
    color: C.slate,
    charSpacing: 0.9,
  });

  rect(slide, M + 0.34, 3.08, 5.42, 2.24, C.white);
  addText(slide, "ESTRATEGIA · cláusula 3.25", {
    x: M + 0.6,
    y: 3.24,
    w: 5.0,
    h: 0.24,
    fontSize: 10.2,
    bold: true,
    color: AZUL,
    charSpacing: 0.9,
  });

  rect(slide, M + 0.68, 3.66, 4.74, 1.5, C.warm, ROJO);
  addText(slide, "CRITERIO DE SALIDA", {
    x: M + 0.96,
    y: 3.84,
    w: 4.2,
    h: 0.24,
    fontSize: 10.2,
    bold: true,
    color: ROJO,
    charSpacing: 0.9,
  });
  addText(slide, "¿Cuándo dejamos de probar?", {
    x: M + 0.96,
    y: 4.14,
    w: 4.2,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });
  addText(slide, "La norma lo llama test completion criteria.", {
    x: M + 0.96,
    y: 4.6,
    w: 4.2,
    h: 0.28,
    fontSize: 10.6,
    italic: true,
    color: C.slate,
  });

  addKicker(slide, 7.16, 2.5, "El mismo criterio, en dos versiones", C.red, 5.46);

  const versiones = [
    ["No sirve", "«Cuando esté bien probado»", "No se contesta con un número, así que nadie puede discrepar.", ROJO, C.warm],
    ["Sí sirve", "«Cuando todo riesgo de nivel 6 o más tenga un caso ejecutado»", "Tiene magnitud, método y umbral.", VERDE, C.white],
  ];
  versiones.forEach(([rotulo, texto, glosa, color, fondo], index) => {
    const y = 2.84 + index * 1.3;
    rect(slide, 7.16, y, 5.46, 1.24, fondo);
    rect(slide, 7.16, y, 0.06, 1.24, color);
    addText(slide, rotulo.toUpperCase(), {
      x: 7.44,
      y: y + 0.14,
      w: 2.0,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color,
      charSpacing: 1.0,
    });
    addText(slide, texto, {
      x: 7.44,
      y: y + 0.38,
      w: 4.9,
      h: 0.42,
      fontSize: 12.6,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.08,
    });
    addText(slide, glosa, {
      x: 7.44,
      y: y + 0.9,
      w: 4.9,
      h: 0.26,
      fontSize: 10.2,
      color: C.slate,
    });
  });

  addTakeaway(slide, "Sin criterio de salida, probar termina cuando se acaba el tiempo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · Conformidad adaptada

function slideTailoredConformance() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · cuánto hay que aplicar",
    "Recortar es legítimo. Recortar en silencio, no",
    "Diez subcláusulas para un proyecto de cinco archivos son desproporcionadas. La norma lo anticipa con dos caminos.",
    false,
    { subtitleH: 0.38 }
  );

  const verbos = [
    ["shall", "Exigencia", ROJO],
    ["should", "Recomendación", ORO],
    ["may", "Permiso", VERDE],
  ];
  const wv = (CW - 0.28) / 3;
  verbos.forEach(([verbo, tipo, color], index) => {
    const x = M + index * (wv + 0.14);
    rect(slide, x, 2.44, wv, 0.56, C.softNeutral);
    rect(slide, x, 2.44, 0.06, 0.56, color);
    addText(slide, verbo, {
      x: x + 0.26,
      y: 2.56,
      w: 1.5,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color,
    });
    addText(slide, tipo, {
      x: x + 1.86,
      y: 2.58,
      w: wv - 2.1,
      h: 0.26,
      fontSize: 11.8,
      color: C.ink,
    });
  });
  addFuente(slide, 3.1, "Los tres verbos con que la norma marca qué es obligatorio, qué se recomienda y qué se permite.", { w: 11.2 });

  const caminos = [
    [M, "Conformidad completa", "Se cumplen todos los requisitos de las cláusulas 5 a 8.", AZUL, C.white, []],
    [
      M + 6.04,
      "Conformidad adaptada",
      "Permitida. Y viene con dos exigencias, las dos escritas con shall.",
      ROJO,
      C.warm,
      ["1 · Registrar qué subconjunto sí se aplica", "2 · Justificar cada recorte"],
    ],
  ];
  caminos.forEach(([x, titulo, glosa, color, fondo, obligaciones]) => {
    rect(slide, x, 3.44, 5.85, 1.5, fondo);
    rect(slide, x, 3.44, 5.85, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 3.62,
      w: 5.3,
      h: 0.32,
      fontSize: 16.5,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 4.0,
      w: 5.3,
      h: 0.26,
      fontSize: 11.4,
      color: C.ink,
    });
    obligaciones.forEach((texto, index) => {
      const y = 4.34 + index * 0.3;
      addText(slide, texto, {
        x: x + 0.28,
        y,
        w: 5.3,
        h: 0.26,
        fontSize: 11,
        bold: true,
        color: C.ink,
      });
    });
  });

  addQuote(
    slide,
    M,
    5.04,
    CW,
    1.04,
    "Cuando este documento se use como base para una documentación de pruebas que no alcanza la conformidad completa, deberá registrarse el subconjunto para el que se declara conformidad adaptada. Donde haya recorte, deberá entregarse una justificación.",
    "ISO/IEC/IEEE 29119-3:2021, cláusula 4.1.3 · traducción del original en inglés",
    ROJO
  );

  addTakeaway(slide, "Omitir con criterio declarado es conformidad; omitir en silencio, no.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}
// ---------------------------------------------------------------------------
// 11 · El plan que devuelve un agente

function slideAgentPlan() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el experimento",
    "Un plan escrito por un agente en un minuto",
    "Mismo montaje que la Unidad 1: acceso solo de lectura. No puede escribir, ni ejecutar, ni correr la suite.",
    false,
    { subtitleH: 0.38 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.3,
    h: 1.8,
    title: "La instrucción, tal como se escribió",
    fontSize: 9.6,
    lines: [
      { text: '> claude -p "Escribe el plan de pruebas de este' },
      { text: '  proyecto segun ISO/IEC/IEEE 29119-3."' },
      { text: '  --allowed-tools "Read,Glob,Grep"' },
    ],
  });

  const cifras = [
    ["365", "líneas de documento", AZUL],
    ["10", "subcláusulas cubiertas", AZUL],
    ["6", "elementos de prueba", VERDE],
    ["16", "riesgos valorados", ROJO],
  ];
  cifras.forEach(([numero, glosa, color], index) => {
    const x = 7.18 + (index % 2) * 2.78;
    const y = 2.44 + Math.floor(index / 2) * 0.94;
    rect(slide, x, y, 2.66, 0.84, C.white);
    rect(slide, x, y, 2.66, 0.06, color);
    addText(slide, numero, {
      x: x + 0.2,
      y: y + 0.14,
      w: 2.26,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 27,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.2,
      y: y + 0.58,
      w: 2.26,
      h: 0.22,
      fontSize: 10,
      color: C.slate,
    });
  });

  addKicker(slide, M, 4.3, "Su registro de riesgos de producto · nivel = probabilidad × impacto, cada uno de 1 a 3", C.red, 11);

  const columnas = [1.02, 8.31, 0.62, 0.62, 1.32];
  const encabezados = ["ID", "Riesgo de producto identificado por el agente", "P", "I", "Nivel"];
  let x = M;
  encabezados.forEach((titulo, index) => {
    rect(slide, x, 4.56, columnas[index], 0.3, NAVY_CHIP);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.12,
      y: 4.62,
      w: columnas[index] - 0.24,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color: C.white,
      align: index >= 2 ? "center" : "left",
      charSpacing: 0.8,
    });
    x += columnas[index];
  });

  const riesgos = [
    ["RP1", "Suplantación: el RUT no se verifica, así que cualquiera puede agotar la cuota de otra persona.", "3", "3", "9"],
    ["RP2", "La cuota no es semanal: reservas_de cuenta todas las reservas históricas del RUT.", "3", "2", "6"],
    ["RP3", "Doble reserva o bloqueo bajo concurrencia: una espera larga podría producir un error 500.", "2", "3", "6"],
    ["RP4", "Mensaje ilegible: si falta un campo, la pantalla puede mostrar [object Object].", "3", "2", "6"],
    ["RP7", "Formatos no validados: el RUT, el correo y el nombre vacío se aceptan sin control.", "3", "2", "6"],
  ];
  riesgos.forEach((fila, indexFila) => {
    const y = 4.86 + indexFila * 0.3;
    let cx = M;
    fila.forEach((celda, index) => {
      rect(slide, cx, y, columnas[index], 0.3, indexFila % 2 === 0 ? C.white : C.softNeutral);
      const esNivel = index === 4;
      addText(slide, celda, {
        x: cx + 0.12,
        y: y + 0.04,
        w: columnas[index] - 0.24,
        h: 0.22,
        fontSize: index === 1 ? 9.4 : 10.2,
        bold: index === 0 || esNivel,
        color: esNivel ? ROJO : index === 0 ? AZUL : C.ink,
        align: index >= 2 ? "center" : "left",
      });
      cx += columnas[index];
    });
  });

  addTakeaway(slide, "Hay que decirlo de entrada: el plan es bueno.", { y: 6.5, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · El riesgo principal, comprobado

function slideRiskVerified() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · comprobar antes de creer",
    "Un riesgo del plan, convertido en prueba",
    "El requisito del proyecto dice «hasta 3 reservas por semana». Si eso es cierto, quien tuvo tres en semanas pasadas debe poder reservar hoy.",
    false,
    { subtitleH: 0.38 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.72,
    h: 2.84,
    title: "La prueba que convierte RP2 en una pregunta con respuesta",
    fontSize: 9.8,
    lang: "python",
    code: [
      "def test_tres_reservas_pasadas_no_bloquean(tmp_path):",
      '    almacen.RUTA_BASE = tmp_path / "prueba.db"',
      "    conexion = almacen.conectar()",
      "    for bloque in (1, 5, 6):",
      "        almacen.guardar(conexion, bloque=bloque, rut=RUT)",
      "    conexion.close()",
      "",
      '    respuesta = cliente.post("/reservas", json=SOLICITUD)',
      "",
      "    assert respuesta.status_code == 201",
    ].join("\n"),
  });

  addTerminalPanel(slide, SH, {
    x: 7.6,
    y: 2.44,
    w: 5.02,
    h: 1.48,
    title: "El resultado",
    fontSize: 10.2,
    lines: [
      { text: "assert 409 == 201", kind: "muted" },
      { text: "1 failed, 1 warning in 0.86s" },
    ],
  });

  addCard(
    slide,
    7.6,
    4.06,
    5.02,
    1.22,
    "Cómo se lee esa línea",
    "Obtenido a la izquierda, esperado a la derecha. El 201 significa «se creó algo nuevo» y es lo que el contrato manda devolver al aceptar. El 409 significa que la solicitud choca con el estado actual: el rechazo.",
    AZUL,
    { fontSize: 10.2 }
  );

  rect(slide, M, 5.3, CW, 0.78, C.warm);
  rect(slide, M, 5.3, 0.06, 0.78, ROJO);
  addKicker(slide, M + 0.3, 5.4, "Y las veintidós que pasaban siguen pasando", ROJO, 6);
  addText(
    slide,
    "La regla recibe el conteo ya hecho y decide bien. Contar mal ocurre antes, y eso nadie lo probó.",
    {
      x: M + 0.3,
      y: 5.64,
      w: CW - 0.6,
      h: 0.4,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    }
  );

  addTakeaway(slide, "No es un defecto que la suite no detectó. Es uno sobre el que nadie decidió.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · La linea que decide cuanto vale el documento

function slideTheC03Line() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el hallazgo",
    "De un nombre de variable a un requisito",
    "El plan encontró un defecto real. Y trae una fila que cambia cómo se lee todo lo demás.",
    false,
    { subtitleH: 0.38 }
  );

  addQuote(
    slide,
    M,
    2.44,
    CW,
    1.06,
    "RPy2 · Riesgo de proyecto: faltan requisitos formales. Las reglas se infieren del código y de los nombres de las pruebas.",
    "Escrito por el propio agente, en su registro de riesgos de proyecto",
    ROJO
  );

  rect(slide, M, 3.64, 3.5, 0.62, NAVY_CHIP);
  addText(slide, "MAX_POR_SEMANA", {
    x: M + 0.2,
    y: 3.76,
    w: 3.1,
    h: 0.36,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  arrow(slide, 4.36, 3.95, 1.0, ROJO, 2);
  addText(slide, "¿?", {
    x: 4.56,
    y: 3.54,
    w: 0.6,
    h: 0.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: ROJO,
    align: "center",
  });

  rect(slide, 5.5, 3.64, 3.5, 0.62, C.warm, ROJO);
  addText(slide, "«la regla es semanal»", {
    x: 5.7,
    y: 3.76,
    w: 3.1,
    h: 0.36,
    fontSize: 14,
    bold: true,
    color: ROJO,
    align: "center",
    valign: "mid",
  });

  addText(slide, "Leyó un nombre de variable\ny lo elevó a requisito.", {
    x: 9.2,
    y: 3.64,
    w: 3.41,
    h: 0.62,
    fontSize: 11.6,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  const ramas = [
    [M, "Si el nombre estaba bien elegido", "Acertó. Es lo que ocurrió aquí.", VERDE, C.white],
    [M + 6.04, "Si el nombre estaba mal elegido", "El mismo riesgo, el mismo nivel 6, la misma redacción segura. Y equivocado.", ROJO, C.warm],
  ];
  ramas.forEach(([x, titulo, glosa, color, fondo]) => {
    rect(slide, x, 4.36, 5.85, 0.92, fondo);
    rect(slide, x, 4.36, 0.06, 0.92, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 4.5,
      w: 5.3,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 4.82,
      w: 5.3,
      h: 0.34,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  addKicker(slide, M, 5.44, "Un plan mezcla dos clases de afirmación", C.red, 6);

  const clases = [
    [M, "Sobre el sistema", "Se comprueban ejecutando.", VERDE],
    [M + 6.04, "Sobre decisiones", "Se sostienen y se firman.", AZUL],
  ];
  clases.forEach(([x, rotulo, glosa, color]) => {
    rect(slide, x, 5.7, 5.85, 0.4, C.softNeutral);
    rect(slide, x, 5.7, 0.06, 0.4, color);
    addText(slide, rotulo.toUpperCase(), {
      x: x + 0.24,
      y: 5.79,
      w: 2.1,
      h: 0.2,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, glosa, {
      x: x + 2.5,
      y: 5.78,
      w: 3.2,
      h: 0.24,
      fontSize: 10.6,
      color: C.ink,
    });
  });

  addTakeaway(slide, "Las primeras se pueden ejecutar. Dejarlas en un documento es desperdiciarlas.", { y: 6.24, h: 0.48 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · Preguntas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de repartir el esfuerzo", [
    [
      "La suite informa veintidós pruebas en verde y el plan lista dieciséis riesgos. Un compañero concluye que las veintidós están mal escritas. ¿Tiene razón?",
      "Revisa qué recibe la función del cupo como argumento y quién calcula ese argumento.",
    ],
    [
      "El agente escribió que su base de prueba salió del código y de los nombres, y aun así acertó en la cuota semanal. Si el resultado fue correcto, ¿qué problema queda?",
      "Piensa qué documento habría salido si la constante estuviera mal nombrada. Compáralo con el que salió.",
    ],
    [
      "La norma permite omitir partes del plan si se registra el subconjunto y se justifica el recorte. ¿Qué es exactamente lo que entonces no te deja hacer?",
      "Compara dos planes sin calendario, uno que lo declara y otro que no. ¿Qué puede hacer con cada uno quien llegue en seis meses?",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 15 · Respuestas del bloque 1

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "No tiene razón",
      "Las veintidós están bien escritas. El defecto está antes de la función que prueban.",
      "La prueba recibe el conteo ya hecho; contar mal ocurre un nivel más arriba.",
      "Culpar a la suite de no encontrar algo que en su nivel no puede ocurrir.",
    ],
    [
      "Queda que fue una adivinanza",
      "Acertó por coincidencia entre lo que alguien quiso nombrar y lo que el requisito pedía.",
      "Falta el documento de requisitos: sin él, el acierto no se distingue del error.",
      "Tomar un plan bien redactado como prueba de que su contenido es correcto.",
    ],
    [
      "No te deja omitir en silencio",
      "Recortar está permitido; lo prohibido es que el recorte no se distinga de un olvido.",
      "La conformidad no está en cuánto cubres, sino en que se pueda leer qué decidiste.",
      "Creer que cumplir la norma es entregar las diez subcláusulas completas.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 16 · Divisor del bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 2 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "El esfuerzo se reparte por consecuencia", {
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
    "Dieciséis riesgos sobre la mesa y probarlos todos por igual no es una opción. Hace falta un criterio para repartir, y después medir si el esfuerzo que ya está invertido coincide con él.",
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
// 17 · Que es un riesgo, y donde vive

function slideRiskDefinition() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · definir antes de usar",
    "Un riesgo es un evento que todavía no ocurrió",
    "En el uso corriente «riesgo» significa «algo que me preocupa». Con esa definición no se puede ordenar nada.",
    false,
    { subtitleH: 0.38, titleFontSize: 27 }
  );

  addDefinition(
    slide,
    M,
    2.44,
    CW,
    0.8,
    "Riesgo · ISTQB 5.2.1 · traducción del inglés",
    "Un evento, peligro, amenaza o situación potencial cuya ocurrencia causa un efecto adverso.",
    AZUL
  );

  addKicker(slide, M, 3.36, "La probabilidad de un riesgo vive entre dos extremos, sin tocarlos", C.red, 8);

  const ejeY = 4.44;
  rect(slide, 2.94, ejeY - 0.16, 7.32, 0.32, C.warm);
  rule(slide, 2.0, ejeY, 8.7, C.slate, 1.4);

  const extremos = [
    [2.0, "0", "No puede ocurrir.", "Eso no es un riesgo."],
    [10.4, "1", "Ya ocurre siempre.", "Eso es un hecho."],
  ];
  extremos.forEach(([x, valor, linea1, linea2]) => {
    rect(slide, x - 0.02, ejeY - 0.24, 0.05, 0.48, ROJO);
    addText(slide, valor, {
      x: x - 0.45,
      y: ejeY - 0.74,
      w: 0.9,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: ROJO,
      align: "center",
    });
    addText(slide, `${linea1}\n${linea2}`, {
      x: x - 1.25,
      y: ejeY + 0.34,
      w: 2.5,
      h: 0.5,
      fontSize: 10.6,
      color: ROJO,
      align: "center",
      lineSpacingMultiple: 1.1,
    });
  });

  addText(slide, "Aquí vive un riesgo", {
    x: 4.4,
    y: ejeY - 0.54,
    w: 4.5,
    h: 0.3,
    fontSize: 13.4,
    bold: true,
    color: C.ink,
    align: "center",
  });

  const factores = [
    [M, "Probabilidad", "Qué tan posible es que ocurra.", AZUL],
    [4.7, "Impacto", "Qué tan grave sería si ocurre.", ORO],
    [8.68, "Nivel", "La combinación de los dos.", ROJO],
  ];
  factores.forEach(([x, titulo, glosa, color], index) => {
    const w = index === 2 ? 3.93 : 3.7;
    rect(slide, x, 5.38, w, 0.7, index === 2 ? C.warm : C.white);
    rect(slide, x, 5.38, 0.06, 0.7, color);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 5.48,
      w: w - 0.48,
      h: 0.26,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 5.76,
      w: w - 0.48,
      h: 0.24,
      fontSize: 10.2,
      color: C.slate,
    });
  });

  addTakeaway(slide, "Si su probabilidad llega a uno, dejó de ser un riesgo.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 · Riesgo de producto y riesgo de proyecto

function slideProductVsProject() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · dos familias",
    "Solo una de las dos se mitiga probando",
    "El registro del bloque anterior venía partido en dos tablas, y esa partición decide qué tabla se mira al repartir el esfuerzo.",
    false,
    { subtitleH: 0.38 }
  );

  const familias = [
    [
      M,
      6.9,
      "Riesgo de producto",
      "Las características de calidad de lo que se construye.",
      ["El cupo semanal no distingue semanas", "No se valida el formato del RUT", "Dos reservas simultáneas al mismo bloque"],
      "Se mitiga probando",
      ROJO,
      C.warm,
    ],
    [
      7.82,
      4.793,
      "Riesgo de proyecto",
      "La gestión y el control del trabajo.",
      ["El entorno no se reproduce limpio", "El calendario deja sin tiempo", "Falta gente o falta experiencia"],
      "Se resuelve gestionando",
      C.slate,
      C.white,
    ],
  ];

  familias.forEach(([x, w, titulo, glosa, ejemplos, veredicto, color, fondo]) => {
    rect(slide, x, 2.46, w, 3.0, fondo);
    rect(slide, x, 2.46, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.66,
      w: w - 0.56,
      h: 0.34,
      fontSize: 18,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 3.04,
      w: w - 0.56,
      h: 0.26,
      fontSize: 11.2,
      color: C.slate,
    });
    ejemplos.forEach((ejemplo, index) => {
      const y = 3.46 + index * 0.4;
      rect(slide, x + 0.28, y + 0.07, 0.12, 0.12, color);
      addText(slide, ejemplo, {
        x: x + 0.54,
        y,
        w: w - 0.82,
        h: 0.28,
        fontSize: 11.6,
        color: C.ink,
      });
    });
    rect(slide, x + 0.28, 4.78, w - 0.56, 0.44, color);
    addText(slide, veredicto.toUpperCase(), {
      x: x + 0.34,
      y: 4.82,
      w: w - 0.68,
      h: 0.36,
      fontSize: 11.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.9,
    });
  });

  addKicker(slide, M, 5.6, "Consecuencias que la fuente enumera para un riesgo de producto", C.red, 8);
  const consecuencias = ["Insatisfacción", "Pérdida de confianza", "Daño a terceros", "Sanciones", "Daño físico"];
  const wc = (CW - 0.4) / 5;
  consecuencias.forEach((texto, index) => {
    const x = M + index * (wc + 0.1);
    const grave = index >= 2;
    rect(slide, x, 5.86, wc, 0.32, grave ? C.warm : C.softNeutral);
    addText(slide, texto, {
      x: x + 0.06,
      y: 5.89,
      w: wc - 0.12,
      h: 0.26,
      fontSize: 10.6,
      bold: grave,
      color: grave ? ROJO : C.slate,
      align: "center",
      valign: "mid",
    });
  });

  addTakeaway(slide, "Las tres últimas son el terreno del bloque 4.", { y: 6.3, h: 0.44 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · El riesgo que dejo de serlo

function slideRiskBecameDefect() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · lo que cambia al ejecutar",
    "RP2 ya no es un riesgo",
    "Su probabilidad llegó a uno en el bloque anterior, cuando la prueba se ejecutó y falló.",
    false,
    { subtitleH: 0.38 }
  );

  rect(slide, M, 2.5, 3.9, 0.86, C.softNeutral);
  rect(slide, M, 2.5, 0.06, 0.86, C.slate);
  addText(slide, "RIESGO", {
    x: M + 0.28,
    y: 2.64,
    w: 3.3,
    h: 0.24,
    fontSize: 9.6,
    bold: true,
    color: C.slate,
    charSpacing: 1.1,
  });
  addText(slide, "Podría ocurrir", {
    x: M + 0.28,
    y: 2.9,
    w: 3.3,
    h: 0.32,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });

  arrow(slide, 4.82, 2.93, 1.5, ROJO, 2.2);
  addText(slide, "assert 409 == 201", {
    x: 4.74,
    y: 3.14,
    w: 1.66,
    h: 0.26,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10.6,
    bold: true,
    color: ROJO,
    align: "center",
  });

  rect(slide, 6.82, 2.5, 5.81, 0.86, C.warm, ROJO);
  addText(slide, "DEFECTO CONFIRMADO", {
    x: 7.1,
    y: 2.64,
    w: 5.2,
    h: 0.24,
    fontSize: 9.6,
    bold: true,
    color: ROJO,
    charSpacing: 1.1,
  });
  addText(slide, "Ocurre, cada vez, de forma reproducible", {
    x: 7.1,
    y: 2.9,
    w: 5.2,
    h: 0.32,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });

  const comparacion = [
    ["Dónde se registra", "En el registro de riesgos del plan (7.2.6)", "En un reporte de incidente (8.11)"],
    ["Qué se hace con él", "Se valora, se prioriza y se decide cómo tratarlo", "Se corrige, o se acepta con una decisión escrita"],
    ["Cómo se cierra", "Dejando de ser probable, o aceptándolo", "Con un cambio en el código y una prueba que lo fija"],
  ];
  comparacion.forEach(([pregunta, izquierda, derecha], index) => {
    const y = 3.66 + index * 0.66;
    addText(slide, pregunta, {
      x: M,
      y: y + 0.12,
      w: 2.4,
      h: 0.32,
      fontSize: 11,
      bold: true,
      color: C.slate,
    });
    rect(slide, 3.24, y, 4.4, 0.58, C.softNeutral);
    addText(slide, izquierda, {
      x: 3.48,
      y: y + 0.08,
      w: 3.96,
      h: 0.42,
      fontSize: 10.8,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.06,
    });
    rect(slide, 7.86, y, 4.75, 0.58, C.warm);
    addText(slide, derecha, {
      x: 8.1,
      y: y + 0.08,
      w: 4.3,
      h: 0.42,
      fontSize: 10.8,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.06,
    });
  });

  addText(
    slide,
    "Y el agente dejó en su registro dos defectos ya confirmados: RP1, la suplantación, y RP4, el [object Object], tienen una prueba en rojo desde el lunes.",
    {
      x: M,
      y: 5.68,
      w: CW,
      h: 0.44,
      fontSize: 11.4,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Quedan trece riesgos por tratar y tres defectos confirmados por corregir.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 · De un riesgo a un nivel de prueba

function slideLevelRule() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la regla",
    "El nivel lo decide dónde cabe el fallo",
    "La fuente dice que el análisis de riesgo determina los niveles de prueba, pero no cómo. La regla sale del criterio de la sesión de integración.",
    false,
    { subtitleH: 0.38 }
  );

  rect(slide, M, 2.44, CW, 0.62, NAVY_CHIP);
  addText(
    slide,
    "El arreglo más pequeño de piezas en el que el evento adverso puede ocurrir.",
    {
      x: M + 0.3,
      y: 2.5,
      w: CW - 0.6,
      h: 0.5,
      fontSize: 15.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    }
  );

  const casos = [
    ["RP6", "El comprobante muestra el RUT completo", "Dentro de una función que recibe los datos y arma el texto", "Unitaria", VERDE],
    ["RP2", "La cuota cuenta todas las reservas históricas", "Solo cuando la ruta consulta la base de datos", "Integración", AZUL],
    ["RP7", "No se valida el formato del RUT", "En el borde donde la solicitud se convierte en modelo", "Integración", AZUL],
    ["RP3", "Dos solicitudes toman el mismo bloque", "Solo si hay más de una solicitud a la vez", "Ninguno alcanza", ROJO],
  ];

  casos.forEach(([id, riesgo, donde, nivel, color], index) => {
    const y = 3.3 + index * 0.66;
    rect(slide, M, y, CW, 0.58, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.58, color);
    addText(slide, id, {
      x: M + 0.26,
      y: y + 0.17,
      w: 0.8,
      h: 0.24,
      fontSize: 10.6,
      bold: true,
      color,
    });
    addText(slide, riesgo, {
      x: M + 1.16,
      y: y + 0.17,
      w: 3.9,
      h: 0.24,
      fontSize: 11.2,
      color: C.ink,
    });
    arrow(slide, 5.2, y + 0.29, 0.44, C.border, 1.2);
    addText(slide, donde, {
      x: 5.78,
      y: y + 0.17,
      w: 4.5,
      h: 0.24,
      fontSize: 10.8,
      italic: true,
      color: C.slate,
    });
    rect(slide, 10.42, y + 0.1, 2.19, 0.38, color);
    addText(slide, nivel.toUpperCase(), {
      x: 10.48,
      y: y + 0.15,
      w: 2.07,
      h: 0.28,
      fontSize: 9.8,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
  });

  addFuente(slide, 5.92, "La prueba unitaria del cupo recibe el conteo ya hecho: en su nivel, contar mal no cabe.", { w: 11.2 });

  addTakeaway(slide, "Si el evento no cabe en ese nivel, ninguna prueba de ese nivel lo encuentra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · Donde estan las pruebas y donde esta el riesgo

function slideEffortCount() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · la medición",
    "Dónde están las pruebas y dónde está el riesgo",
    "La suite se puede contar sin ejecutarla: la herramienta recolecta las pruebas y las lista.",
    false,
    { subtitleH: 0.36, titleFontSize: 27 }
  );

  rect(slide, M, 2.34, CW, 0.36, C.editorBg || "13233A");
  addText(slide, "uv run pytest --collect-only -q | grep \"::\" | cut -d: -f1 | sort | uniq -c", {
    x: M + 0.24,
    y: 2.34,
    w: 7.86,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 10,
    color: C.white,
    valign: "mid",
  });
  addText(slide, "23 pruebas en 5 archivos", {
    x: 9.0,
    y: 2.37,
    w: 3.54,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 9.4,
    color: C.gold,
    align: "right",
    valign: "mid",
  });

  addKicker(slide, M, 2.86, "Pruebas por elemento", C.slate, 3.4);
  addKicker(slide, 10.3, 2.86, "Riesgo asociado", C.red, 2.4);

  const filas = [
    ["bloque_valido", 7, "", null],
    ["puede_reservar", 5, "", null],
    ["cabe_en_sala", 4, "", null],
    ["crear_reserva", 6, "nivel 9", ROJO],
    ["la fixture", 1, "", null],
    ["almacen · 4 funciones", 0, "nivel 6", ORO],
    ["el modelo de solicitud", 0, "nivel 6", ORO],
    ["comprobante", 0, "nivel 4", C.slate],
    ["puede_cancelar", 0, "nivel 2", C.slate],
  ];

  const escala = 3.9 / 7;
  filas.forEach(([etiqueta, cuenta, riesgo, colorRiesgo], index) => {
    const y = 3.18 + index * 0.33;
    const cero = cuenta === 0;
    addText(slide, etiqueta, {
      x: M,
      y: y + 0.02,
      w: 3.1,
      h: 0.24,
      fontSize: 10.8,
      bold: cero,
      color: cero ? ROJO : C.ink,
    });
    if (cero) {
      rect(slide, 3.94, y + 0.05, 0.16, 0.18, C.warm, ROJO);
    } else {
      rect(slide, 3.94, y + 0.05, cuenta * escala, 0.18, index < 3 ? AZUL : C.slate);
    }
    addText(slide, String(cuenta), {
      x: 8.1,
      y: y + 0.02,
      w: 0.5,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color: cero ? ROJO : C.ink,
      align: "center",
    });
    if (riesgo) {
      rect(slide, 10.3, y + 0.03, 1.5, 0.22, colorRiesgo);
      addText(slide, riesgo, {
        x: 10.36,
        y: y + 0.055,
        w: 1.38,
        h: 0.17,
        fontSize: 9,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
      });
    }
  });

  rect(slide, M, 6.2, CW, 0.5, C.warm);
  rect(slide, M, 6.2, 0.06, 0.5, ROJO);
  addText(
    slide,
    "Siete de veintitrés pruebas sobre una función de una línea. La cuota que no es semanal, en cero.",
    {
      x: M + 0.34,
      y: 6.26,
      w: CW - 0.68,
      h: 0.38,
      fontSize: 12.8,
      bold: true,
      color: C.ink,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · Las cuatro respuestas posibles

function slideFourResponses() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · qué hacer con cada riesgo",
    "Probar es una de cuatro respuestas, no la única",
    "Suponer que cada fila del registro exige una prueba es lo que convierte un registro en una lista de tareas imposible.",
    false,
    { subtitleH: 0.38, titleFontSize: 27 }
  );

  const respuestas = [
    ["Mitigar probando", "Escribir pruebas que reduzcan la probabilidad de que el fallo llegue al usuario.", ROJO, true],
    ["Aceptar", "Decidir, y dejar escrito, que se convive con el riesgo.", AZUL, false],
    ["Transferir", "Pasarlo a otro responsable, por ejemplo a una biblioteca mantenida por terceros.", AZUL, false],
    ["Plan de contingencia", "Preparar qué se hace si llega a ocurrir.", AZUL, false],
  ];
  const w = (CW - 0.42) / 4;
  respuestas.forEach(([titulo, glosa, color, destacada], index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 2.46, w, 1.52, destacada ? C.warm : C.white);
    rect(slide, x, 2.46, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.22,
      y: 2.68,
      w: w - 0.44,
      h: 0.5,
      fontSize: 13.4,
      bold: true,
      color,
      lineSpacingMultiple: 1.06,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 3.22,
      w: w - 0.44,
      h: 0.64,
      fontSize: 10.4,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addText(
    slide,
    "Aceptar no es ignorar. Aceptar es escribir «este riesgo se conoce, se valoró y se decide no tratarlo por esta razón». Ignorar es que no aparezca.",
    {
      x: M,
      y: 4.16,
      w: CW,
      h: 0.3,
      fontSize: 12.4,
      color: C.ink,
    }
  );

  addKicker(slide, M, 4.72, "Lo que hizo el agente con sus diez riesgos de producto", C.red, 8);

  rect(slide, M, 4.98, 2.6, 1.0, C.warm, ROJO);
  addText(slide, "9 de 10", {
    x: M,
    y: 5.08,
    w: 2.6,
    h: 0.46,
    fontFace: TYPOGRAPHY.display,
    fontSize: 28,
    bold: true,
    color: ROJO,
    align: "center",
  });
  addText(slide, "recibieron una prueba", {
    x: M,
    y: 5.56,
    w: 2.6,
    h: 0.24,
    fontSize: 10.2,
    color: ROJO,
    align: "center",
  });

  addText(
    slide,
    "El décimo, una revisión. Ninguno quedó aceptado, transferido ni con plan de contingencia. Se le pidió un plan de pruebas y respondió en ese idioma. Pero si nueve de diez exigen pruebas, el registro dejó de priorizar.",
    {
      x: 3.6,
      y: 5.04,
      w: 4.9,
      h: 0.9,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  rect(slide, 8.78, 4.98, 3.83, 1.0, NAVY_CHIP);
  addText(
    slide,
    "La decisión que no se delega no es cuáles riesgos existen. Es cuáles se aceptan.",
    {
      x: 9.02,
      y: 5.08,
      w: 3.35,
      h: 0.8,
      fontSize: 12,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Aceptar un riesgo es una decisión sobre cuánto daño se admite.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · Preguntas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de trazar", [
    [
      "RP2 se ejecutó y falló, así que su probabilidad es uno. Un compañero propone subirlo a nivel máximo en el registro y seguir. ¿Qué se pierde al dejarlo ahí?",
      "Un riesgo se prioriza; un defecto confirmado se corrige o se acepta. Son decisiones distintas.",
    ],
    [
      "Siete de veintitrés pruebas están sobre una función de una línea. ¿Hay que borrar pruebas de esa función, y qué distingue una suite desbalanceada de una con pruebas de más?",
      "Pregúntate si al borrar tres de esas siete se pierde alguna partición o algún límite.",
    ],
    [
      "El agente asignó una prueba a nueve de sus diez riesgos de producto. Si tuvieras que quedarte con cuatro, ¿qué información necesitas para elegir, y está en el código?",
      "No depende de qué tan probable es cada fallo, que ya está estimado. Depende de cuánto daño admites.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 24 · Respuestas del bloque 2

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "Se pierde la acción que corresponde",
      "Un defecto confirmado no se prioriza: se corrige, o se acepta con una decisión escrita.",
      "El registro de riesgos se acorta cada vez que algo se ejecuta y se confirma.",
      "Dejar en el registro filas que ya son hechos, y creer que el registro sigue vigente.",
    ],
    [
      "No hay que borrar nada",
      "Esas siete cubren particiones y límites bien elegidos. El problema es lo que falta, no lo que sobra.",
      "El reparto del esfuerzo nunca fue una decisión: siguió al costo de probar.",
      "Leer la tabla como una invitación a recortar en vez de a agregar donde hay ceros.",
    ],
    [
      "Necesitas cuánto daño admites",
      "La probabilidad y el impacto ya están estimados; lo que falta es el umbral de lo tolerable.",
      "Ese umbral no es un dato técnico y no está en ninguna parte del repositorio.",
      "Esperar que el agente decida qué riesgos se aceptan, que es justo lo que no puede decidir.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 25 · Divisor del bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 3 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "La trazabilidad se genera, no se escribe", {
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
    "Si el identificador del requisito vive dentro de la prueba, la relación entre ambos deja de ser una afirmación de un documento y pasa a ser un dato que se extrae de la suite, hoy y mañana.",
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
// 26 · Documento que envejece frente a artefacto que se regenera

function slideMatrixDefinition() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el artefacto",
    "Una matriz escrita a mano miente sin avisar",
    "La norma admite «documento, planilla u otra herramienta», y permite distinta información, formato y nivel de detalle.",
    false,
    { subtitleH: 0.38 }
  );

  addDefinition(
    slide,
    M,
    2.44,
    CW,
    0.78,
    "Matriz de trazabilidad · cláusula 3.26 · traducción del inglés",
    "Herramienta usada para identificar elementos relacionados entre la documentación y el software, como requisitos con sus pruebas asociadas.",
    AZUL
  );

  addKicker(slide, M, 3.36, "La misma matriz, treinta días después", C.red, 6);

  const dias = ["día 1", "día 10", "día 20", "día 30"];
  const pistas = [
    ["Escrita a mano", [["cierta", VERDE], ["dudosa", ORO], ["falsa", ROJO], ["falsa", ROJO]]],
    ["Generada desde la suite", [["cierta", VERDE], ["cierta", VERDE], ["cierta", VERDE], ["cierta", VERDE]]],
  ];

  pistas.forEach(([etiqueta, segmentos], fila) => {
    const y = 3.66 + fila * 0.82;
    addText(slide, etiqueta, {
      x: M,
      y: y + 0.12,
      w: 3.4,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: fila === 0 ? ROJO : VERDE,
    });
    segmentos.forEach(([texto, color], index) => {
      const x = 4.3 + index * 2.08;
      rect(slide, x, y, 2.0, 0.54, color);
      addText(slide, texto.toUpperCase(), {
        x: x + 0.08,
        y: y + 0.06,
        w: 1.84,
        h: 0.42,
        fontSize: 10.4,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
        charSpacing: 0.9,
      });
    });
  });

  dias.forEach((dia, index) => {
    addText(slide, dia, {
      x: 4.3 + index * 2.08,
      y: 5.34,
      w: 2.0,
      h: 0.24,
      fontSize: 10,
      color: C.slate,
      align: "center",
    });
  });

  addText(
    slide,
    "La escrita a mano no avisa cuando deja de ser cierta. La generada no necesita avisar: se vuelve a producir.",
    {
      x: M,
      y: 5.74,
      w: CW,
      h: 0.3,
      fontSize: 12.8,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(slide, "El documento envejece en silencio; el artefacto se vuelve a producir.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · Donde vive la relacion entre requisito y prueba

function slideRequirementIds() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · dónde guardar la relación",
    "El identificador tiene que viajar con la prueba",
    "El proyecto necesita primero lo que no tenía: requisitos con identificadores estables. Era el riesgo de proyecto RPy2 del bloque 1.",
    false,
    { subtitleH: 0.38 }
  );

  rect(slide, M, 2.46, 7.1, 3.1, C.white);
  rect(slide, M, 2.46, 7.1, 0.06, AZUL);
  addText(slide, "REQUISITOS DEL PROYECTO", {
    x: M + 0.28,
    y: 2.66,
    w: 5.0,
    h: 0.22,
    fontSize: 9.4,
    bold: true,
    color: AZUL,
    charSpacing: 1.0,
  });

  const requisitos = [
    ["RF-01", "La jornada tiene ocho bloques, del 1 al 8."],
    ["RF-02", "Un bloque ya reservado no se vuelve a reservar."],
    ["RF-03", "Máximo 3 reservas activas por semana."],
    ["RF-04", "La sala admite entre 1 y 30 personas."],
    ["RF-05", "Se cancela hasta 2 horas antes del bloque."],
    ["RF-06", "Una reserva aceptada devuelve un comprobante."],
  ];
  requisitos.forEach(([id, texto], index) => {
    const y = 3.0 + index * 0.4;
    addText(slide, id, {
      x: M + 0.28,
      y,
      w: 0.9,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11,
      bold: true,
      color: ROJO,
    });
    addText(slide, texto, {
      x: M + 1.3,
      y,
      w: 5.4,
      h: 0.26,
      fontSize: 11.4,
      color: C.ink,
    });
  });

  addFuente(slide, 5.68, "El identificador no significa nada por sí mismo. Lo único que importa es que no cambie.", { w: 6.6 });

  addKicker(slide, 8.1, 2.46, "Dos lugares posibles", C.red, 4.5);

  const opciones = [
    ["Un archivo aparte con los pares", "Nada obliga a actualizarlo cuando alguien renombra una prueba. Es la planilla que se desactualiza.", ROJO, C.warm, "No"],
    ["Dentro de la prueba misma", "Renombrarla, moverla o borrarla se lleva la relación consigo. No hay nada que sincronizar.", VERDE, C.white, "Sí"],
  ];
  opciones.forEach(([titulo, glosa, color, fondo, veredicto], index) => {
    const y = 2.8 + index * 1.42;
    rect(slide, 8.1, y, 4.51, 1.28, fondo);
    rect(slide, 8.1, y, 0.06, 1.28, color);
    rect(slide, 11.75, y + 0.16, 0.7, 0.32, color);
    addText(slide, veredicto, {
      x: 11.81,
      y: y + 0.21,
      w: 0.58,
      h: 0.22,
      fontSize: 10.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
    });
    addText(slide, titulo, {
      x: 8.38,
      y: y + 0.18,
      w: 3.2,
      h: 0.28,
      fontSize: 12.6,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: 8.38,
      y: y + 0.54,
      w: 4.0,
      h: 0.62,
      fontSize: 10.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "Lo que se guarda aparte hay que mantenerlo; lo que va dentro, no.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · El marcador, y el caso que obliga a afinar

function slideMarker() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la sintaxis",
    "Un marcador es una etiqueta en la prueba",
    "La herramienta la conserva y deja consultarla después. Se escribe como decorador: una línea con arroba, encima de la función, que le agrega algo sin tocar su cuerpo.",
    false,
    { subtitleH: 0.38, titleFontSize: 27 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.0,
    h: 1.74,
    title: "Una marca para toda la función",
    fontSize: 9.8,
    lang: "python",
    code: [
      '@pytest.mark.requisito("RF-01")',
      "@pytest.mark.parametrize(...)",
      "def test_limites_del_requisito(bloque, esperado):",
      "    assert bloque_valido(bloque) is esperado",
    ].join("\n"),
  });

  addText(slide, "parametrize corre la misma prueba una vez por cada fila de valores. Sus cuatro casos comprueban el mismo requisito, así que una marca arriba alcanza.", {
    x: M,
    y: 4.28,
    w: 6.0,
    h: 0.44,
    fontSize: 10.8,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  addCodePanel(slide, SH, {
    x: 6.96,
    y: 2.44,
    w: 5.66,
    h: 1.74,
    title: "Una marca por caso",
    fontSize: 9.4,
    lang: "python",
    code: [
      "pytest.param(1, 0, False, False,",
      '    marks=pytest.mark.requisito("RF-01")),',
      "pytest.param(1, 4, True, False,",
      '    marks=pytest.mark.requisito("RF-02")),',
    ].join("\n"),
  });

  addText(slide, "Aquí cada caso comprueba una regla distinta. pytest.param reemplaza la tupla y le agrega marcas a ese caso.", {
    x: 6.96,
    y: 4.28,
    w: 5.66,
    h: 0.44,
    fontSize: 10.8,
    color: C.slate,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M, 4.88, 6.0, 0.72, C.softNeutral);
  rect(slide, M, 4.88, 0.06, 0.72, ORO);
  addText(slide, "Hay que declararlo en la configuración", {
    x: M + 0.26,
    y: 4.98,
    w: 5.5,
    h: 0.24,
    fontSize: 11.4,
    bold: true,
    color: C.ink,
  });
  addText(slide, 'markers = ["requisito(id): el requisito que comprueba"]', {
    x: M + 0.26,
    y: 5.24,
    w: 5.5,
    h: 0.24,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 9.4,
    color: C.slate,
  });

  rect(slide, 6.96, 4.88, 5.66, 0.72, C.warm);
  rect(slide, 6.96, 4.88, 0.06, 0.72, ROJO);
  addText(slide, "Por qué la declaración importa", {
    x: 7.22,
    y: 4.98,
    w: 5.16,
    h: 0.24,
    fontSize: 11.4,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Sin ella, escribir «requsito» con un error de tipeo crea un marcador nuevo y silencioso.", {
    x: 7.22,
    y: 5.24,
    w: 5.16,
    h: 0.26,
    fontSize: 10.4,
    color: C.ink,
  });

  addText(slide, "Marcar las pruebas no cambia lo que hacen: la suite sigue en 22 passed y 1 failed.", {
    x: M,
    y: 5.78,
    w: CW,
    h: 0.28,
    fontSize: 12.4,
    bold: true,
    color: C.ink,
  });

  addTakeaway(slide, "La trazabilidad no altera la suite. Solo agrega información legible por un programa.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 29 · Como se extrae sin ejecutar

function slideGenerator() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el generador",
    "Recolectar la suite sin ejecutarla",
    "La herramienta se puede invocar desde un programa, y avisarle a un objeto propio cuando termina de recolectar.",
    false,
    { subtitleH: 0.38 }
  );

  const pasos = [
    ["1", "Recolectar", "La opción --collect-only arma la lista de pruebas y se detiene antes de correrlas."],
    ["2", "Escuchar", "Un objeto propio recibe esa lista y se queda con las marcas de cada prueba."],
    ["3", "Cruzar", "Se compara con los identificadores del archivo de requisitos."],
  ];
  const w = (CW - 0.28) / 3;
  pasos.forEach(([numero, titulo, glosa], index) => {
    const x = M + index * (w + 0.14);
    rect(slide, x, 2.44, w, 1.06, C.white);
    rect(slide, x, 2.44, w, 0.06, AZUL);
    addText(slide, numero, {
      x: x + 0.24,
      y: 2.6,
      w: 0.4,
      h: 0.34,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: AZUL,
    });
    addText(slide, titulo, {
      x: x + 0.72,
      y: 2.64,
      w: w - 0.96,
      h: 0.28,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 2.98,
      w: w - 0.48,
      h: 0.44,
      fontSize: 10.2,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 3.68,
    w: 7.0,
    h: 2.06,
    title: "El objeto que escucha la recolección",
    fontSize: 9.6,
    lang: "python",
    code: [
      "class Recolector:",
      "    def pytest_collection_modifyitems(self, items):",
      "        for item in items:",
      "            marcas = [m.args[0] for m",
      '                      in item.iter_markers(name="requisito")]',
      "            self.pruebas[item.nodeid] = marcas",
    ].join("\n"),
  });

  const piezas = [
    ["pytest_collection_modifyitems", "El punto del proceso donde la herramienta entrega la lista completa."],
    ["item.nodeid", "El identificador de una prueba: archivo, nombre y caso."],
    ["iter_markers(name=...)", "Recorre las marcas de ese nombre, vengan de la función o del caso."],
    ["m.args[0]", "El primer argumento de la marca. Aquí, el texto RF-01."],
  ];
  piezas.forEach(([nombre, glosa], index) => {
    const y = 3.68 + index * 0.52;
    rect(slide, 8.14, y, 4.47, 0.46, index % 2 === 0 ? C.softNeutral : C.white);
    addText(slide, nombre, {
      x: 8.34,
      y: y + 0.04,
      w: 4.1,
      h: 0.2,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.2,
      bold: true,
      color: AZUL,
    });
    addText(slide, glosa, {
      x: 8.34,
      y: y + 0.24,
      w: 4.1,
      h: 0.2,
      fontSize: 9.2,
      color: C.slate,
    });
  });

  addTakeaway(slide, "La lista de pruebas se puede leer sin que ninguna prueba corra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · La matriz, ejecutada

function slideMatrixOutput() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · la evidencia",
    "La matriz del proyecto, generada",
    "Esta salida no se escribió: se produjo. Y se vuelve a producir cuando se quiera.",
    false,
    { subtitleH: 0.38 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.5,
    h: 3.02,
    title: "uv run python trazabilidad.py",
    fontSize: 10.4,
    lines: [
      { text: "requisito    pruebas   estado" },
      { text: "RF-01             10   cubierto" },
      { text: "RF-02              3   cubierto" },
      { text: "RF-03              2   cubierto" },
      { text: "RF-04              4   cubierto" },
      { text: "RF-05              0   SIN PRUEBA" },
      { text: "RF-06              1   cubierto" },
      { text: "Pruebas sin requisito: 3" },
    ],
  });

  rect(slide, M + 0.08, 4.44, 0.06, 0.22, ROJO);

  const lecturas = [
    ["El reparto", "Diez de las veinte pruebas marcadas están sobre RF-01, el requisito más simple del sistema.", ORO],
    ["El requisito sin prueba", "RF-05 tiene cero. La función de cancelación existe hace siete sesiones y nadie la probó.", ROJO],
    ["Las pruebas sin requisito", "La de la fixture, que no prueba el sistema, y las dos de seguridad: no hay requisito de seguridad escrito.", AZUL],
  ];
  lecturas.forEach(([titulo, glosa, color], index) => {
    const y = 2.44 + index * 1.0;
    rect(slide, 7.46, y, 5.16, 0.88, C.white);
    rect(slide, 7.46, y, 0.06, 0.88, color);
    addText(slide, titulo.toUpperCase(), {
      x: 7.72,
      y: y + 0.12,
      w: 4.6,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color,
      charSpacing: 1.0,
    });
    addText(slide, glosa, {
      x: 7.72,
      y: y + 0.36,
      w: 4.66,
      h: 0.44,
      fontSize: 10.6,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  addText(
    slide,
    "Y hay pruebas que no aparecen: las nueve de extremo a extremo corren con otro ejecutor, y este generador solo lee pytest.",
    {
      x: M,
      y: 5.64,
      w: CW,
      h: 0.3,
      fontSize: 12.4,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Un hueco solo se puede ver contra algo. Hasta hoy no había contra qué.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · Los dos huecos, leidos

function slideTwoGaps() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · leer los huecos",
    "Siete sesiones con un requisito sin probar",
    "El primer hueco es una falta. El segundo no es un veredicto: es una obligación de decidir.",
    false,
    { subtitleH: 0.38 }
  );

  rect(slide, M, 2.46, 6.5, 2.36, C.warm);
  rect(slide, M, 2.46, 0.06, 2.36, ROJO);
  addText(slide, "RF-05 · SIN PRUEBA", {
    x: M + 0.28,
    y: 2.64,
    w: 5.0,
    h: 0.24,
    fontSize: 9.6,
    bold: true,
    color: ROJO,
    charSpacing: 1.0,
  });
  addCodePanel(slide, SH, {
    x: M + 0.28,
    y: 2.96,
    w: 5.94,
    h: 1.3,
    fontSize: 9.4,
    lang: "python",
    code: [
      "def puede_cancelar(inicio_bloque, ahora):",
      "    return inicio_bloque - ahora > ANTICIPACION",
    ].join("\n"),
  });
  addText(slide, "Está escrita, tiene su constante, y nunca nadie la probó. Una prueba que no existe no falla.", {
    x: M + 0.28,
    y: 4.34,
    w: 5.94,
    h: 0.4,
    fontSize: 11,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  addKicker(slide, 7.46, 2.46, "Una prueba sin requisito admite tres lecturas", C.red, 5.16);
  const lecturas = [
    ["Falta un requisito", "Comprueba algo que el sistema promete y nadie escribió. Se escribe y se marca.", AZUL],
    ["No es sobre el sistema", "Comprueba el andamiaje de la suite. Se deja, sabiendo que no cubre nada.", VERDE],
    ["Fija el código, no la regla", "Se escribió mirando la implementación. El día que la regla cambie, defenderá la versión vieja.", ROJO],
  ];
  lecturas.forEach(([titulo, glosa, color], index) => {
    const y = 2.76 + index * 0.66;
    rect(slide, 7.46, y, 5.16, 0.58, index === 1 ? C.softNeutral : C.white);
    rect(slide, 7.46, y, 0.06, 0.58, color);
    addText(slide, titulo, {
      x: 7.72,
      y: y + 0.06,
      w: 4.7,
      h: 0.22,
      fontSize: 11.4,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: 7.72,
      y: y + 0.29,
      w: 4.7,
      h: 0.24,
      fontSize: 9.6,
      color: C.slate,
    });
  });

  rect(slide, 7.46, 4.8, 5.16, 0.72, NAVY_CHIP);
  addText(slide, "Cuál de las tres es, lo decide una persona. La matriz solo garantiza que aparezca en la lista.", {
    x: 7.72,
    y: 4.9,
    w: 4.64,
    h: 0.54,
    fontSize: 11.2,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.12,
  });

  addText(slide, "La de la fixture es la segunda. Las dos de seguridad, la primera: falta el requisito.", {
    x: M,
    y: 4.96,
    w: 6.5,
    h: 0.44,
    fontSize: 11,
    italic: true,
    color: C.slate,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(slide, "Nadie sabía que no lo sabía, y nada tenía cómo avisarlo.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32 · El hueco que la matriz no ve

function slideMutantVsMatrix() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el límite",
    "RF-06 figura como cubierto y no está verificado",
    "Su única prueba comprueba el código de estado. No mira el comprobante, que es lo que el requisito promete.",
    false,
    { subtitleH: 0.38, titleFontSize: 27 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 6.2,
    h: 1.3,
    title: "Antes · lo que el requisito pide",
    fontSize: 9.6,
    lang: "python",
    code: [
      "def comprobante(nombre, rut, correo, bloque):",
      '    return f"{nombre} | {rut} | {correo} | bloque {bloque}"',
    ].join("\n"),
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 3.88,
    w: 6.2,
    h: 1.3,
    title: "Después · el mutante, destruido a propósito",
    fontSize: 9.6,
    lang: "python",
    code: [
      "def comprobante(nombre, rut, correo, bloque):",
      '    return "comprobante"',
    ].join("\n"),
  });

  addDefinition(
    slide,
    M,
    5.24,
    6.2,
    0.86,
    "Mutante",
    "Una alteración deliberada del código, hecha para ver si la suite reacciona. Aquí el comprobante perdió el nombre, el RUT, el correo y el bloque.",
    ROJO
  );

  addKicker(slide, 7.16, 2.44, "Qué dijo cada artefacto", C.red, 5.46);

  const veredictos = [
    ["La suite", "22 passed · 1 failed", "La única roja es la de siempre.", ROJO],
    ["La matriz", "RF-06 · cubierto", "Sigue informando lo mismo.", ROJO],
    ["El requisito", "destruido", "No se cumple en absoluto.", C.slate],
  ];
  veredictos.forEach(([quien, dice, glosa, color], index) => {
    const y = 2.74 + index * 0.78;
    rect(slide, 7.16, y, 5.46, 0.66, index === 2 ? C.softNeutral : C.warm);
    rect(slide, 7.16, y, 0.06, 0.66, color);
    addText(slide, quien, {
      x: 7.42,
      y: y + 0.2,
      w: 1.46,
      h: 0.26,
      fontSize: 11.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, dice, {
      x: 9.0,
      y: y + 0.2,
      w: 1.9,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: 10.98,
      y: y + 0.21,
      w: 1.5,
      h: 0.24,
      fontSize: 8.8,
      color: C.slate,
      lineSpacingMultiple: 1.05,
    });
  });

  rect(slide, 7.16, 5.14, 5.46, 0.86, NAVY_CHIP);
  addText(
    slide,
    "Una matriz demuestra que la relación existe. No que la prueba compruebe el requisito. Detecta ausencias, no insuficiencias.",
    {
      x: 7.42,
      y: 5.24,
      w: 4.94,
      h: 0.68,
      fontSize: 11.4,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(slide, "Que la suite reaccione ante un mutante se llama sensibilidad, y es lo que aquí falta.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 33 · La misma pregunta, hecha a un agente

function slideAgentMatrix() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · el experimento",
    "El agente acertó donde el programa falló",
    "Se le dieron los requisitos y las pruebas sin marcar, con acceso solo de lectura, y se le pidió la misma matriz.",
    false,
    { subtitleH: 0.38 }
  );

  addQuote(
    slide,
    M,
    2.44,
    CW,
    0.72,
    "RF-06 · sin cubrir: la prueba de la API solo revisa el 201, y las de extremo a extremo solo revisan «Reserva confirmada».",
    "Lo que devolvió el agente sobre la fila que el programa daba por buena",
    VERDE
  );

  addKicker(slide, M, 3.36, "Los dos fallan, y fallan en direcciones opuestas", C.red, 7);

  const columnas = [
    ["El programa", AZUL, [
      ["De dónde saca su respuesta", "De las marcas que alguien puso."],
      ["En qué se equivoca", "Confunde marcado con comprobado."],
      ["Cuándo vuelve a responder", "Cada vez que se lo ejecuta."],
      ["Qué produce", "Un hecho mecánico y reproducible."],
    ]],
    ["El agente", ORO, [
      ["De dónde saca su respuesta", "De leer el requisito y la aserción."],
      ["En qué se equivoca", "Puede dar por cubierto lo que no lo está."],
      ["Cuándo vuelve a responder", "Cuando alguien se acuerda de preguntarle."],
      ["Qué produce", "Un juicio, emitido una sola vez."],
    ]],
  ];

  const w = (CW - 0.2) / 2;
  columnas.forEach(([titulo, color, filas], indice) => {
    const x = M + indice * (w + 0.2);
    rect(slide, x, 3.64, w, 0.4, color);
    addText(slide, titulo.toUpperCase(), {
      x: x + 0.06,
      y: 3.68,
      w: w - 0.12,
      h: 0.32,
      fontSize: 10.6,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 1.0,
    });
    filas.forEach(([pregunta, respuesta], index) => {
      const y = 4.12 + index * 0.48;
      rect(slide, x, y, w, 0.42, index % 2 === 0 ? C.white : C.softNeutral);
      addText(slide, pregunta, {
        x: x + 0.22,
        y: y + 0.03,
        w: w - 0.44,
        h: 0.18,
        fontSize: 8.6,
        bold: true,
        color: C.slate,
        charSpacing: 0.5,
      });
      addText(slide, respuesta, {
        x: x + 0.22,
        y: y + 0.21,
        w: w - 0.44,
        h: 0.2,
        fontSize: 10.4,
        color: C.ink,
      });
    });
  });

  addTakeaway(slide, "El programa sostiene el esqueleto, el agente audita, y el mutante arbitra.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 34 · Preguntas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes de los derechos", [
    [
      "La matriz informa RF-06 como cubierto y el mutante demostró que no lo está. Un compañero propone arreglar el programa para que detecte esos casos. ¿Qué tendría que poder hacer?",
      "Tendría que decidir si una aserción comprueba lo que un requisito en español promete.",
    ],
    [
      "La función de cancelación estuvo siete sesiones sin una sola prueba y la suite informó sus resultados todos los días. ¿Qué otro artefacto podría haberlo detectado antes?",
      "Repasa lo que mide la cobertura y lo que mide el recuento del bloque anterior. ¿Cuál mostraba un cero?",
    ],
    [
      "El agente acertó donde el programa falló y además detectó dos coberturas parciales. Si es mejor en todo lo comparado, ¿por qué no se reemplaza el programa por el agente?",
      "Mira las dos últimas filas de la comparación. ¿Qué pasa con cada uno el día que nadie se acuerda?",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 35 · Respuestas del bloque 3

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "Tendría que tener criterio",
      "Decidir si una aserción cumple un requisito redactado en español es un juicio, no un cruce de listas.",
      "Ese es justamente el problema que resuelve un agente, y el que un programa no resuelve.",
      "Pedirle a un artefacto mecánico una respuesta que exige interpretar el lenguaje.",
    ],
    [
      "El recuento por elemento",
      "Un cero en esa función lo habría mostrado. La cobertura no, porque esa función nunca se ejecuta.",
      "Un cero es más elocuente que un porcentaje: no admite lectura optimista.",
      "Confiar en el porcentaje de cobertura para detectar lo que ni siquiera se recorre.",
    ],
    [
      "Porque no vuelve solo",
      "El programa responde igual todos los días sin que nadie lo pida; el juicio del agente hay que volver a pedirlo.",
      "Un juicio que no se reemite envejece igual que la planilla, y encima parece fresco.",
      "Elegir entre los dos, en vez de usarlos en el orden que aprovecha a cada uno.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 36 · Divisor del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.5, "Bloque 4 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Un derecho es una fila de la matriz", {
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
    "Los derechos que la Ley 21.719 le reconoce al titular de los datos no necesitan un artefacto aparte. Entran en la misma matriz, con el mismo tratamiento, y al entrar hacen aparecer huecos que el proyecto tenía desde siempre.",
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
// 37 · Los seis derechos del articulo 4

function slideSixRights() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la ley",
    "Son seis derechos, no cinco",
    "El artículo 4º los enumera en una sola frase. La referencia rápida más difundida muestra cinco y deja fuera el último.",
    false,
    { subtitleH: 0.38 }
  );

  const derechos = [
    ["A", "Acceso", "Saber si sus datos se tratan, y obtenerlos.", false],
    ["R", "Rectificación", "Corregir lo inexacto o desactualizado.", false],
    ["S", "Supresión", "Que sus datos se eliminen.", false],
    ["O", "Oposición", "Objetar un tratamiento determinado.", false],
    ["P", "Portabilidad", "Recibir una copia y llevarla a otro responsable.", false],
    ["B", "Bloqueo", "Suspender el tratamiento mientras se resuelve una solicitud.", true],
  ];

  const w = (CW - 0.5) / 6;
  derechos.forEach(([letra, nombre, glosa, destacado], index) => {
    const x = M + index * (w + 0.1);
    rect(slide, x, 2.46, w, 2.0, destacado ? C.warm : C.white);
    rect(slide, x, 2.46, w, 0.06, destacado ? ROJO : AZUL);
    addText(slide, letra, {
      x,
      y: 2.62,
      w,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 38,
      bold: true,
      color: destacado ? ROJO : AZUL,
      align: "center",
    });
    addText(slide, nombre, {
      x: x + 0.12,
      y: 3.26,
      w: w - 0.24,
      h: 0.28,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
      align: "center",
    });
    addText(slide, glosa, {
      x: x + 0.14,
      y: 3.6,
      w: w - 0.28,
      h: 0.74,
      fontSize: 9.4,
      color: C.slate,
      align: "center",
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 4.62, 6.5, 0.74, C.softNeutral);
  rect(slide, M, 4.62, 0.06, 0.74, ROJO);
  addText(slide, "El sexto es el más parecido a un requisito de software", {
    x: M + 0.26,
    y: 4.72,
    w: 6.0,
    h: 0.24,
    fontSize: 11.6,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Bloqueo es un estado del sistema: mientras hay una solicitud pendiente, los datos de esa persona no se tratan.", {
    x: M + 0.26,
    y: 4.98,
    w: 6.0,
    h: 0.3,
    fontSize: 10.6,
    color: C.ink,
  });

  rect(slide, 7.46, 4.62, 5.16, 0.74, C.warm);
  rect(slide, 7.46, 4.62, 0.06, 0.74, ROJO);
  addText(slide, "Artículo 34 ter · infracciones graves", {
    x: 7.72,
    y: 4.72,
    w: 4.7,
    h: 0.24,
    fontSize: 11.6,
    bold: true,
    color: ROJO,
  });
  addText(slide, "Impedir el ejercicio de un derecho, y responder tarde una solicitud de bloqueo.", {
    x: 7.72,
    y: 4.98,
    w: 4.7,
    h: 0.3,
    fontSize: 10.6,
    color: C.ink,
  });

  addText(
    slide,
    "Las dos están en la misma lista. Un derecho que el sistema no puede satisfacer no es un detalle de cortesía.",
    {
      x: M,
      y: 5.6,
      w: CW,
      h: 0.3,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Un derecho es una facultad que una persona ejerce y el sistema tiene que poder satisfacer.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 38 · De un derecho a un requisito verificable

function slideRightToRequirement() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la traducción",
    "Un derecho todavía no se puede probar",
    "«Tiene derecho a obtener la eliminación de sus datos» es una facultad jurídica, no una afirmación sobre un programa.",
    false,
    { subtitleH: 0.38 }
  );

  addKicker(slide, M, 2.44, "El derecho de supresión, traducido paso a paso", C.red, 7);

  const cadena = [
    ["El derecho", "«La eliminación de los datos personales que le conciernen»", C.slate],
    ["La magnitud", "Filas del sistema que contienen datos del titular", AZUL],
    ["El método", "Buscar el identificador en todas las tablas", AZUL],
    ["El umbral", "Cero", ROJO],
  ];
  const wc = (CW - 1.44) / 4;
  cadena.forEach(([rotulo, texto, color], index) => {
    const x = M + index * (wc + 0.48);
    rect(slide, x, 2.74, wc, 1.0, index === 3 ? C.warm : C.white);
    rect(slide, x, 2.74, wc, 0.06, color);
    addText(slide, rotulo.toUpperCase(), {
      x: x + 0.18,
      y: 2.9,
      w: wc - 0.36,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, texto, {
      x: x + 0.18,
      y: 3.14,
      w: wc - 0.36,
      h: 0.5,
      fontSize: index === 3 ? 17 : 10.8,
      bold: index === 3,
      color: index === 3 ? ROJO : C.ink,
      lineSpacingMultiple: 1.1,
    });
    if (index < 3) arrow(slide, x + wc + 0.08, 3.24, 0.32, C.border, 1.4);
  });

  rect(slide, M, 3.92, CW, 0.52, NAVY_CHIP);
  addText(
    slide,
    "RF-07 · Ejecutada una solicitud de supresión, ninguna tabla del sistema conserva datos que identifiquen al titular.",
    {
      x: M + 0.3,
      y: 4.0,
      w: CW - 0.6,
      h: 0.36,
      fontSize: 13,
      bold: true,
      color: C.white,
    }
  );

  addKicker(slide, M, 4.66, "Y en varios artículos el umbral ya viene escrito", C.red, 7);

  const plazos = [
    ["30", "días corridos", "Para pronunciarse sobre una solicitud. Prorrogable una sola vez.", AZUL],
    ["2", "días hábiles", "Para responder una solicitud de bloqueo temporal.", ROJO],
  ];
  plazos.forEach(([numero, unidad, glosa, color], index) => {
    const x = M + index * 3.3;
    rect(slide, x, 4.94, 3.1, 1.02, C.white);
    rect(slide, x, 4.94, 0.06, 1.02, color);
    addText(slide, numero, {
      x: x + 0.24,
      y: 5.04,
      w: 0.9,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color,
    });
    addText(slide, unidad, {
      x: x + 1.2,
      y: 5.16,
      w: 1.8,
      h: 0.26,
      fontSize: 12,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 5.58,
      w: 2.7,
      h: 0.34,
      fontSize: 9.4,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, 7.34, 4.94, 5.28, 1.02, C.softNeutral);
  addText(slide, "Artículo 9º · portabilidad", {
    x: 7.6,
    y: 5.06,
    w: 4.8,
    h: 0.24,
    fontSize: 10.4,
    bold: true,
    color: AZUL,
  });
  addText(
    slide,
    "«Formato electrónico estructurado, genérico y de uso común» suena a redacción vaga, y es una condición ejecutable: se le pasa la respuesta a un analizador estándar y se ve si la interpreta.",
    {
      x: 7.6,
      y: 5.32,
      w: 4.8,
      h: 0.56,
      fontSize: 9.8,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    }
  );

  addTakeaway(slide, "La ley no dijo qué formato. Dijo una propiedad del formato, y eso se comprueba.", { y: 6.14, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 39 · Las dos pruebas del mismo requisito

function slideTwoVerdicts() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la demostración",
    "El mismo requisito, dos veredictos opuestos",
    "Las dos pruebas comprueban RF-07 sobre el mismo sistema. La única diferencia es cuántos lugares miran.",
    false,
    { subtitleH: 0.38 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.44,
    w: 5.86,
    h: 1.96,
    title: "Mira una tabla",
    fontSize: 9.4,
    lang: "python",
    code: [
      "cliente.post(\"/reservas\", json=SOLICITUD)",
      "cliente.delete(f\"/titulares/{RUT}\")",
      "",
      "assert almacen.reservas_de(conexion, RUT) == 0",
    ].join("\n"),
  });

  addCodePanel(slide, SH, {
    x: 6.76,
    y: 2.44,
    w: 5.86,
    h: 1.96,
    title: "Mira el sistema completo",
    fontSize: 9.4,
    lang: "python",
    code: [
      "cliente.post(\"/reservas\", json=SOLICITUD)",
      "cliente.delete(f\"/titulares/{RUT}\")",
      "",
      "rastro = almacen.rastro_de(conexion, RUT)",
      "assert rastro == {\"reservas\": 0, \"eventos\": 0}",
    ].join("\n"),
  });

  rect(slide, M, 4.52, 5.86, 0.56, VERDE);
  addText(slide, "PASA", {
    x: M + 0.2,
    y: 4.6,
    w: 5.46,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    charSpacing: 1.4,
  });

  rect(slide, 6.76, 4.52, 5.86, 0.56, ROJO);
  addText(slide, "FALLA", {
    x: 6.96,
    y: 4.6,
    w: 5.46,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    charSpacing: 1.4,
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.22,
    w: CW,
    h: 0.94,
    title: "La salida de las dos, juntas",
    fontSize: 10.2,
    lines: [
      { text: "AssertionError: assert {'reservas': 0, 'eventos': 1} == {'reservas': 0, 'eventos': 0}     ·     1 failed, 1 passed, 1 warning in 0.71s" },
    ],
  });

  addTakeaway(slide, "El sistema respondió que los datos fueron suprimidos, y el RUT sigue ahí.", { y: 6.3, h: 0.44 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · Suprimir o anonimizar

function slideSuppressOrAnonymize() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la decisión que no se delega",
    "Borrar no siempre es la respuesta",
    "El artículo 7º dice que la supresión no procede cuando el tratamiento es necesario para cumplir una obligación legal.",
    false,
    { subtitleH: 0.38 }
  );

  const operaciones = [
    ["Suprimir", "La fila desaparece, y el dato con ella.", "Cuando el registro ya no tiene finalidad.", "La reserva", ROJO],
    ["Anonimizar", "La fila se conserva, sin la persona.", "Cuando la finalidad sobrevive al dato personal.", "El evento", VERDE],
  ];
  const w = (CW - 0.2) / 2;
  operaciones.forEach(([titulo, quePasa, cuando, aplicaA, color], index) => {
    const x = M + index * (w + 0.2);
    rect(slide, x, 2.46, w, 1.5, index === 0 ? C.warm : C.white);
    rect(slide, x, 2.46, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.64,
      w: 3.0,
      h: 0.34,
      fontSize: 18,
      bold: true,
      color,
    });
    rect(slide, x + w - 1.9, 2.66, 1.62, 0.32, color);
    addText(slide, aplicaA.toUpperCase(), {
      x: x + w - 1.84,
      y: 2.71,
      w: 1.5,
      h: 0.22,
      fontSize: 9.2,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, quePasa, {
      x: x + 0.28,
      y: 3.06,
      w: w - 0.56,
      h: 0.28,
      fontSize: 12,
      color: C.ink,
    });
    addText(slide, cuando, {
      x: x + 0.28,
      y: 3.42,
      w: w - 0.56,
      h: 0.32,
      fontSize: 10.6,
      italic: true,
      color: C.slate,
    });
  });

  addKicker(slide, M, 4.14, "La tabla de eventos, antes y después de la supresión corregida", C.red, 8);

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.42,
    w: 7.3,
    h: 1.2,
    fontSize: 10.2,
    title: "SELECT accion, rut FROM eventos",
    lines: [
      { text: "antes  : [('reserva creada', '11.111.111-1')]" },
      { text: "despues: [('reserva creada', None)]" },
    ],
  });

  rect(slide, 8.26, 4.42, 4.36, 1.2, NAVY_CHIP);
  addText(slide, "El trabajo humano", {
    x: 8.52,
    y: 4.54,
    w: 3.84,
    h: 0.24,
    fontSize: 10.4,
    bold: true,
    color: C.gold,
    charSpacing: 0.9,
  });
  addText(
    slide,
    "No fue escribir la instrucción. Fue decidir que la fila del evento debía sobrevivir sin su RUT, pesando dos obligaciones que apuntan en direcciones contrarias.",
    {
      x: 8.52,
      y: 4.82,
      w: 3.84,
      h: 0.7,
      fontSize: 10.2,
      color: C.white,
      lineSpacingMultiple: 1.14,
    }
  );

  addText(
    slide,
    "None es como Python ve el vacío que la base guarda como NULL. Borrar la fila entera también deja el rastro en cero, y destruye la evidencia de que se cumplió.",
    {
      x: M,
      y: 5.74,
      w: CW,
      h: 0.3,
      fontSize: 11.6,
      color: C.ink,
    }
  );

  addTakeaway(slide, "La prueba comprueba que el rastro quedó en cero. No cuál de los dos caminos correspondía.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41 · Los derechos, dentro de la matriz

function slideRightsInMatrix() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · la matriz completa",
    "Escribir los derechos hizo aparecer tres huecos",
    "El sistema no cambió ni una línea. Lo que cambió es que ahora hay contra qué comparar.",
    false,
    { subtitleH: 0.38, titleFontSize: 27 }
  );

  const filas = [
    ["RF-01", "Bloques del 1 al 8", 10],
    ["RF-02", "Bloque ya reservado", 3],
    ["RF-03", "Tres reservas por semana", 2],
    ["RF-04", "Entre 1 y 30 personas", 4],
    ["RF-05", "Cancelar 2 horas antes", 0],
    ["RF-06", "Comprobante de la reserva", 1],
    ["RF-07", "Derecho de supresión", 2],
    ["RF-08", "Derecho de acceso", 0],
    ["RF-09", "Derecho de portabilidad", 0],
    ["RF-10", "Bloqueo mientras se resuelve", 0],
  ];

  const w = (CW - 0.36) / 5;
  filas.forEach(([id, nombre, cuenta], index) => {
    const columna = index % 5;
    const fila = Math.floor(index / 5);
    const x = M + columna * (w + 0.09);
    const y = 2.5 + fila * 1.5;
    const vacio = cuenta === 0;
    const derecho = index >= 6;
    rect(slide, x, y, w, 1.34, vacio ? C.warm : C.white);
    rect(slide, x, y, w, 0.06, vacio ? ROJO : derecho ? VERDE : AZUL);
    addText(slide, id, {
      x: x + 0.18,
      y: y + 0.18,
      w: w - 0.36,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      bold: true,
      color: vacio ? ROJO : derecho ? VERDE : AZUL,
    });
    addText(slide, nombre, {
      x: x + 0.18,
      y: y + 0.44,
      w: w - 0.36,
      h: 0.42,
      fontSize: 10.4,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, vacio ? "0" : String(cuenta), {
      x: x + 0.18,
      y: y + 0.88,
      w: 0.6,
      h: 0.36,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: vacio ? ROJO : C.ink,
    });
    addText(slide, vacio ? "sin prueba" : "pruebas", {
      x: x + 0.82,
      y: y + 1.0,
      w: w - 1.0,
      h: 0.22,
      fontSize: 9,
      bold: vacio,
      color: vacio ? ROJO : C.slate,
    });
  });

  addText(
    slide,
    "Los derechos no necesitaron un artefacto aparte: son filas de la misma matriz. Y el sistema no tiene por dónde ejercer el acceso, la portabilidad ni el bloqueo.",
    {
      x: M,
      y: 5.58,
      w: CW,
      h: 0.3,
      fontSize: 12.2,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Los huecos ya estaban. Lo que los volvió visibles fue escribir el requisito.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 42 · El agente, con y sin requisito escrito

function slideAgentClosesLoop() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · el arco de la sesión",
    "El mismo modelo, dos resultados distintos",
    "El experimento del bloque 1 y el de ahora son el mismo, con una sola variable cambiada.",
    false,
    { subtitleH: 0.38 }
  );

  const escenarios = [
    [
      M,
      "Bloque 1 · sin requisitos escritos",
      "Tuvo que inferir la regla del nombre de una constante. Acertó, y el documento no deja ver que adivinó.",
      "Suerte",
      ROJO,
      C.warm,
    ],
    [
      6.76,
      "Bloque 4 · con el requisito escrito",
      "Recibió una magnitud, un método y un umbral. Devolvió una prueba que recorre todas las tablas sin suponer sus nombres.",
      "Rigor",
      VERDE,
      C.white,
    ],
  ];
  escenarios.forEach(([x, titulo, glosa, veredicto, color, fondo]) => {
    rect(slide, x, 2.46, 5.86, 1.42, fondo);
    rect(slide, x, 2.46, 5.86, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.28,
      y: 2.64,
      w: 4.0,
      h: 0.28,
      fontSize: 12.4,
      bold: true,
      color,
    });
    rect(slide, x + 4.36, 2.64, 1.22, 0.32, color);
    addText(slide, veredicto.toUpperCase(), {
      x: x + 4.42,
      y: 2.69,
      w: 1.1,
      h: 0.22,
      fontSize: 9.4,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, glosa, {
      x: x + 0.28,
      y: 3.04,
      w: 5.3,
      h: 0.7,
      fontSize: 10.8,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addKicker(slide, M, 4.04, "Lo que agregó por su cuenta, y la versión de la clase no tenía", C.red, 8);

  addCodePanel(slide, SH, {
    x: M,
    y: 4.32,
    w: 7.3,
    h: 1.42,
    fontSize: 9.2,
    lang: "python",
    code: [
      "assert filas_que_identifican(conexion, TITULAR) == []",
      "assert filas_que_identifican(conexion, OTRO_TITULAR) != []",
    ].join("\n"),
  });

  rect(slide, 8.26, 4.32, 4.36, 1.3, C.softNeutral);
  rect(slide, 8.26, 4.32, 0.06, 1.3, AZUL);
  addText(slide, "Exige que los datos de otra persona sigan ahí", {
    x: 8.52,
    y: 4.46,
    w: 3.9,
    h: 0.44,
    fontSize: 11.2,
    bold: true,
    color: AZUL,
    lineSpacingMultiple: 1.1,
  });
  addText(slide, "Protege contra una supresión que borre de más, y contra una prueba que pasa por vacío: si nada se guardó, la segunda línea lo delata.", {
    x: 8.52,
    y: 4.94,
    w: 3.9,
    h: 0.6,
    fontSize: 9.6,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, M, 5.76, CW, 0.32, NAVY_CHIP);
  addText(slide, "El modelo es el mismo en los dos casos. Lo que cambió fue que alguien hizo el trabajo de esta sesión.", {
    x: M + 0.3,
    y: 5.8,
    w: CW - 0.6,
    h: 0.24,
    fontSize: 12,
    bold: true,
    color: C.white,
  });

  addTakeaway(slide, "Escribir el requisito exige decidir qué le debe el sistema a una persona.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 43 · Preguntas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar", [
    [
      "Las dos pruebas comprueban el mismo requisito sobre el mismo sistema y dan resultados opuestos. ¿Cuál de las dos estaba mal escrita?",
      "Ninguna tiene un error de programación. Compara lo que dice el requisito con lo que mira cada una.",
    ],
    [
      "Otra persona resuelve el mismo problema borrando la fila del evento completa, y las dos pruebas pasan igual. ¿Por qué solo una de las dos soluciones es correcta?",
      "Lee el inciso final del artículo 7º. ¿Qué pierde el responsable cuando borra el registro?",
    ],
    [
      "Escribir cuatro derechos hizo aparecer tres huecos en un sistema que no cambió ni una línea. Si los huecos ya estaban, ¿qué cambió exactamente?",
      "Pregúntate qué habría informado la suite el día anterior, y qué habría informado la matriz.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 44 · Respuestas del bloque 4

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "La primera, y no por un error",
      "El requisito dice «ninguna tabla del sistema». La primera mira una sola y da por cumplido el resto.",
      "Antes de escribir una prueba de supresión hay que enumerar dónde vive el dato.",
      "Escribir la prueba mirando el código que borra, en vez del requisito que promete.",
    ],
    [
      "Porque la ley pide conservar esa evidencia",
      "El registro acredita que el responsable cumplió, incluida esta misma supresión.",
      "Dos implementaciones pasan la prueba; solo una respeta las dos obligaciones a la vez.",
      "Creer que una prueba en verde confirma que la solución elegida era la correcta.",
    ],
    [
      "Cambió que ahora hay contra qué",
      "Un hueco no existe como hueco hasta que alguien escribe la promesa que nadie está comprobando.",
      "La suite y la matriz decían la verdad sobre lo que existía. Faltaba el requisito.",
      "Esperar que una herramienta descubra la ausencia de algo que nadie declaró.",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 45 · Cierre · lo que afirma cada artefacto

function slideThreeArtifacts() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre",
    "Tres artefactos, tres afirmaciones distintas",
    "No se reemplazan entre sí. Confundir lo que afirma cada uno lleva a creer que un sistema está probado cuando lo único que está es en verde.",
    false,
    { subtitleH: 0.4 }
  );

  const artefactos = [
    [
      "La suite",
      "Que los casos que existen se comportaron como alguien esperaba.",
      "Qué quedó sin probar.",
      AZUL,
    ],
    [
      "El plan de pruebas",
      "Qué se decidió probar, qué queda fuera y cuándo es suficiente.",
      "Que lo decidido se haya hecho.",
      ORO,
    ],
    [
      "La matriz",
      "Si lo decidido y lo escrito coinciden, y qué no responde a nada.",
      "Si la prueba comprueba el requisito.",
      VERDE,
    ],
  ];

  const w = (CW - 0.32) / 3;
  artefactos.forEach(([titulo, afirma, noAfirma, color], index) => {
    const x = M + index * (w + 0.16);
    rect(slide, x, 2.56, w, 2.5, C.white);
    rect(slide, x, 2.56, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.26,
      y: 2.76,
      w: w - 0.52,
      h: 0.34,
      fontSize: 17,
      bold: true,
      color,
    });
    addKicker(slide, x + 0.26, 3.22, "Sí afirma", VERDE, 1.6);
    addText(slide, afirma, {
      x: x + 0.26,
      y: 3.46,
      w: w - 0.52,
      h: 0.64,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    rule(slide, x + 0.26, 4.2, w - 0.52, C.border, 0.8);
    addKicker(slide, x + 0.26, 4.3, "No puede afirmar", ROJO, 1.9);
    addText(slide, noAfirma, {
      x: x + 0.26,
      y: 4.54,
      w: w - 0.52,
      h: 0.42,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 5.24, CW, 0.76, C.warm);
  rect(slide, M, 5.24, 0.06, 0.76, ROJO);
  addText(slide, "Lo que tapa el hueco común de los tres", {
    x: M + 0.3,
    y: 5.34,
    w: 4.4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Alterar el código a propósito y exigir el rojo: el único que produce evidencia en vez de una afirmación.",
    {
      x: M + 0.3,
      y: 5.6,
      w: CW - 0.6,
      h: 0.3,
      fontSize: 11.6,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Cuando la matriz y el agente se contradijeron, lo resolvió un mutante.", { y: 6.2, h: 0.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 46 · Cierre · la afirmacion sostenible

function slideFinalClaim() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.3, "Lo que se puede sostener al salir", C.gold, 6);

  const piezas = [
    ["Estas pruebas comprueban estos requisitos", "y puedo mostrar la matriz que los cruza"],
    ["Estos otros no tienen ninguna", "y está escrito por qué, y con qué prioridad"],
    ["El esfuerzo está repartido por riesgo", "y no por lo que era cómodo de probar"],
    ["Esta fila cubierta la verifiqué", "alterando el código y exigiendo el rojo"],
  ];
  const w = (CW - 0.48) / 4;
  piezas.forEach(([afirmacion, prueba], index) => {
    const x = M + index * (w + 0.16);
    rect(slide, x, 1.7, w, 1.56, NAVY_CHIP);
    rect(slide, x, 1.7, w, 0.06, C.red);
    addText(slide, String(index + 1), {
      x: x + 0.22,
      y: 1.84,
      w: 0.5,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color: C.gold,
    });
    addText(slide, afirmacion, {
      x: x + 0.22,
      y: 2.18,
      w: w - 0.44,
      h: 0.66,
      fontSize: 11.6,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, prueba, {
      x: x + 0.22,
      y: 2.9,
      w: w - 0.44,
      h: 0.3,
      fontSize: 9.8,
      color: C.softBlue,
      lineSpacingMultiple: 1.1,
    });
  });

  rule(slide, M, 3.42, 4.2, C.red, 2.4);
  addKicker(slide, M, 3.66, "Los tres hallazgos tienen la misma forma", C.gold, 6);

  const hallazgos = [
    ["RF-05", "Siete sesiones sin una sola prueba, y la suite informando todos los días."],
    ["RF-06", "Una marca que decía cubierto y una aserción que no comprobaba nada."],
    ["Los derechos", "No tenían huecos hasta que alguien escribió la promesa."],
  ];
  const wh = (CW - 0.32) / 3;
  hallazgos.forEach(([titulo, glosa], index) => {
    const x = M + index * (wh + 0.16);
    rect(slide, x, 3.94, wh, 0.94, NAVY_CHIP);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 4.08,
      w: wh - 0.48,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color: C.gold,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 4.4,
      w: wh - 0.48,
      h: 0.4,
      fontSize: 10.2,
      color: C.sand,
      lineSpacingMultiple: 1.12,
    });
  });

  addText(
    slide,
    "Ninguna herramienta informa lo que falta, porque lo que falta no se ejecuta.",
    {
      x: M,
      y: 5.12,
      w: 11.4,
      h: 0.34,
      fontSize: 15.4,
      color: C.sand,
    }
  );

  rect(slide, M, 5.6, CW, 0.62, C.red);
  addText(slide, "Escribir el requisito es lo que queda del oficio.", {
    x: M + 0.3,
    y: 5.66,
    w: CW - 0.6,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 47 · Cierre · puente a la sesion siguiente

function slideNextClassBridge() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.42, "Hoy · 11:00 · Clase 16 · Laboratorio de Redes", C.gold, 6);
  addText(slide, "Lo que nadie ejecuta no existe", {
    x: M,
    y: 1.88,
    w: 11.2,
    h: 1.0,
    fontFace: TYPOGRAPHY.display,
    fontSize: 44,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.08, 4.2, C.red, 3);

  addText(
    slide,
    "Todo lo que se construyó hoy comparte una condición que nadie cuestionó: alguien tiene que acordarse. La matriz se genera si alguien la ejecuta, la suite corre si alguien la corre, el plan se cumple si alguien lo lee.",
    {
      x: M,
      y: 3.36,
      w: 10.6,
      h: 0.8,
      fontSize: 15,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );

  const siguiente = [
    ["Regresión", "Volver a ejecutar lo que ya funcionaba, para comprobar que sigue funcionando."],
    ["Integración continua", "Que se dispare sola ante cada cambio, sin pedir permiso."],
    ["Pruebas inestables", "Qué hacer con la que ya está en una suite que se ejecuta sola."],
  ];
  const w = (CW - 0.32) / 3;
  siguiente.forEach(([titulo, glosa], index) => {
    const x = M + index * (w + 0.16);
    rect(slide, x, 4.4, w, 1.06, NAVY_CHIP);
    rect(slide, x, 4.4, w, 0.06, C.gold);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 4.6,
      w: w - 0.48,
      h: 0.3,
      fontSize: 15,
      bold: true,
      color: C.white,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 4.96,
      w: w - 0.48,
      h: 0.42,
      fontSize: 10.4,
      color: C.softBlue,
      lineSpacingMultiple: 1.12,
    });
  });

  addText(
    slide,
    "Y vuelve la prueba inestable del lunes: la que pasa y falla sin que el sistema haya cambiado.",
    {
      x: M,
      y: 5.76,
      w: 11.2,
      h: 0.34,
      fontSize: 13.4,
      color: C.sand,
    }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · El sistema sobre el que se trabaja

function slideTheProject() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "El sistema sobre el que se trabaja",
    "Es el mismo proyecto de reserva de laboratorio de las cinco sesiones anteriores. Sus piezas van a aparecer toda la sesión, así que conviene tenerlas a la vista.",
    false,
    { subtitleH: 0.4 }
  );

  const piezas = [
    ["La interfaz", "La página que usa la persona: el formulario y el estado de los bloques. Envía la solicitud.", C.slate],
    ["La ruta de la API", "crear_reserva la recibe, consulta, decide y arma la respuesta.", AZUL],
    ["Las reglas", "puede_reservar y cabe_en_sala deciden si la reserva se acepta.", ORO],
    ["El almacén", "almacen guarda las reservas y los eventos en un archivo de base de datos.", VERDE],
  ];
  const w = 2.66;
  piezas.forEach(([titulo, glosa, color], index) => {
    const x = M + index * 3.08;
    rect(slide, x, 2.56, w, 1.44, C.white);
    rect(slide, x, 2.56, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.22,
      y: 2.76,
      w: w - 0.44,
      h: 0.3,
      fontSize: 13.6,
      bold: true,
      color,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 3.12,
      w: w - 0.44,
      h: 0.76,
      fontSize: 10.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    if (index < 3) arrow(slide, x + w + 0.08, 3.28, 0.32, C.border, 1.6);
  });

  const terminos = [
    ["API", "La puerta por la que otros programas usan el sistema. Cada dirección por la que recibe solicitudes es una ruta.", AZUL],
    ["La respuesta", "Un código de estado que dice qué ocurrió, y un cuerpo con el resultado. El comprobante viaja en ese cuerpo.", VERDE],
  ];
  const wt = (CW - 0.2) / 2;
  terminos.forEach(([termino, glosa, color], index) => {
    addDefinition(slide, M + index * (wt + 0.2), 4.2, wt, 1.0, termino, glosa, color);
  });

  rect(slide, M, 5.38, CW, 0.62, C.softNeutral);
  rect(slide, M, 5.38, 0.06, 0.62, ROJO);
  addText(slide, "Lo nuevo de hoy", {
    x: M + 0.28,
    y: 5.48,
    w: 1.8,
    h: 0.24,
    fontSize: 10.4,
    bold: true,
    color: ROJO,
  });
  addText(
    slide,
    "Un archivo de requisitos con identificadores estables, y un registro de eventos donde el sistema anota lo que va ocurriendo.",
    {
      x: M + 2.2,
      y: 5.48,
      w: 9.3,
      h: 0.28,
      fontSize: 11.6,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Cuatro piezas, y el dato personal vive en más de una de ellas.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · Como se lee una prueba

function slideHowToReadATest() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "Cómo se lee una prueba",
    "Todas las pruebas de la sesión tienen esta forma. Vale la pena nombrar cada pieza una vez.",
    false,
    { subtitleH: 0.38 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.44,
    w: CW,
    h: 1.5,
    title: "Una prueba completa, de principio a fin",
    fontSize: 10.4,
    lang: "python",
    code: [
      "def test_reserva_aceptada_responde_201(base_de_datos_de_prueba):",
      '    respuesta = cliente.post("/reservas", json=SOLICITUD)',
      "    assert respuesta.status_code == 201",
    ].join("\n"),
  });

  const piezas = [
    ["def test_...", "Una prueba es una función cuyo nombre empieza con test. La herramienta las encuentra por ese nombre.", AZUL],
    ["base_de_datos_de_prueba", "Una fixture: prepara lo que la prueba necesita antes de que corra, y lo deshace al terminar.", ORO],
    ["cliente", "El cliente de pruebas. Envía solicitudes a la aplicación dentro del mismo proceso, sin levantar un servidor.", AZUL],
    ["SOLICITUD", "El diccionario con los cinco campos de una reserva válida, escrito una sola vez arriba del archivo.", C.slate],
    ["assert", "La aserción. Si lo que sigue no es cierto, la prueba falla. Es lo único que convierte una ejecución en una comprobación.", ROJO],
  ];
  const w = (CW - 0.48) / 5;
  piezas.forEach(([nombre, glosa, color], index) => {
    const x = M + index * (w + 0.12);
    rect(slide, x, 3.96, w, 1.6, index === 4 ? C.warm : C.white);
    rect(slide, x, 3.96, w, 0.06, color);
    addText(slide, nombre, {
      x: x + 0.16,
      y: 4.12,
      w: w - 0.32,
      h: 0.38,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.6,
      bold: true,
      color,
      lineSpacingMultiple: 1.08,
    });
    addText(slide, glosa, {
      x: x + 0.16,
      y: 4.54,
      w: w - 0.32,
      h: 0.92,
      fontSize: 9.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  const herramientas = [
    ["pytest", "La herramienta que ejecuta las pruebas y resume el resultado."],
    ["uv run", "Ejecuta un comando dentro del entorno del proyecto."],
  ];
  const wh = (CW - 0.2) / 2;
  herramientas.forEach(([nombre, glosa], index) => {
    const x = M + index * (wh + 0.2);
    rect(slide, x, 5.7, wh, 0.42, C.softNeutral);
    addText(slide, nombre, {
      x: x + 0.22,
      y: 5.79,
      w: 1.3,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      bold: true,
      color: AZUL,
    });
    addText(slide, glosa, {
      x: x + 1.64,
      y: 5.79,
      w: wh - 1.86,
      h: 0.24,
      fontSize: 10.2,
      color: C.ink,
    });
  });

  addTakeaway(slide, "Sin aserción no hay comprobación: el código se ejecuta y nadie compara nada.", { y: 6.24, h: 0.48 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · Los tres niveles de prueba

function slideThreeLevels() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · vocabulario que vuelve",
    "Los tres niveles, en una línea cada uno",
    "La regla que sigue los usa como respuesta, así que conviene dejarlos fijos. Lo que los distingue no es el tamaño: es qué deja de sustituir cada uno.",
    false,
    { subtitleH: 0.4 }
  );

  const niveles = [
    [
      "Prueba unitaria",
      "Una función sola",
      "Todo lo demás: la red, la base de datos, cualquier otra pieza.",
      "Que esa función decide bien con los datos que recibe.",
      AZUL,
    ],
    [
      "Prueba de integración",
      "Dos o más piezas juntas",
      "Nada de lo que quiere observar. Por eso la base de datos es real.",
      "Que esas piezas se entienden entre sí.",
      ORO,
    ],
    [
      "Prueba de extremo a extremo",
      "El sistema completo",
      "Nada. Se recorre por donde lo usa una persona, con navegador incluido.",
      "Que el sistema sirve para lo que fue construido.",
      VERDE,
    ],
  ];

  const w = (CW - 0.32) / 3;
  niveles.forEach(([titulo, ejecuta, sustituye, afirma, color], index) => {
    const x = M + index * (w + 0.16);
    rect(slide, x, 2.6, w, 2.84, C.white);
    rect(slide, x, 2.6, w, 0.06, color);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 2.8,
      w: w - 0.48,
      h: 0.6,
      fontSize: 16,
      bold: true,
      color,
      lineSpacingMultiple: 1.06,
    });
    const campos = [
      ["Ejecuta de verdad", ejecuta, C.ink],
      ["Sustituye", sustituye, C.slate],
      ["Y por eso afirma", afirma, C.ink],
    ];
    campos.forEach(([rotulo, texto, colorTexto], fila) => {
      const y = 3.48 + fila * 0.66;
      addText(slide, rotulo.toUpperCase(), {
        x: x + 0.24,
        y,
        w: w - 0.48,
        h: 0.18,
        fontSize: 8.2,
        bold: true,
        color: fila === 1 ? ROJO : VERDE,
        charSpacing: 0.8,
      });
      addText(slide, texto, {
        x: x + 0.24,
        y: y + 0.2,
        w: w - 0.48,
        h: 0.42,
        fontSize: 10.2,
        color: colorTexto,
        lineSpacingMultiple: 1.12,
      });
    });
  });

  rect(slide, M, 5.6, CW, 0.44, NAVY_CHIP);
  addText(
    slide,
    "Una prueba que sustituye justamente la colaboración que dice verificar es una prueba unitaria con otro nombre.",
    {
      x: M + 0.3,
      y: 5.66,
      w: CW - 0.6,
      h: 0.32,
      fontSize: 12.4,
      bold: true,
      color: C.white,
      align: "center",
    }
  );

  addTakeaway(slide, "El nivel no lo decide cuántas líneas tiene la prueba.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 37 · Quien es quien en la ley

function slideLegalRoles() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · vocabulario de la ley",
    "Cuatro palabras que la ley usa con precisión",
    "Las tres primeras vienen definidas en el artículo 2º. Se usan durante todo el bloque, así que conviene no confundirlas.",
    false,
    { subtitleH: 0.4 }
  );

  const terminos = [
    [
      "Dato personal",
      "Cualquier información vinculada o referida a una persona natural identificada o identificable.",
      "En este proyecto: el nombre, el RUT y el correo.",
      AZUL,
    ],
    [
      "Titular",
      "La persona natural a la que se refieren los datos. Es quien ejerce los derechos.",
      "En este proyecto: quien reserva la sala.",
      ROJO,
    ],
    [
      "Responsable",
      "Quien decide acerca de los fines y medios del tratamiento de datos personales.",
      "En este proyecto: la institución que opera el sistema.",
      ORO,
    ],
    [
      "Tratamiento",
      "Cualquier operación que permita recolectar, procesar, almacenar, comunicar, transmitir o utilizar datos personales.",
      "Guardar una reserva es tratamiento. Consultarla también.",
      VERDE,
    ],
  ];

  const w = (CW - 0.36) / 4;
  terminos.forEach(([termino, definicion, ejemplo, color], index) => {
    const x = M + index * (w + 0.12);
    rect(slide, x, 2.6, w, 2.7, C.white);
    rect(slide, x, 2.6, w, 0.06, color);
    addText(slide, termino, {
      x: x + 0.22,
      y: 2.8,
      w: w - 0.44,
      h: 0.32,
      fontSize: 16,
      bold: true,
      color,
    });
    addText(slide, definicion, {
      x: x + 0.22,
      y: 3.2,
      w: w - 0.44,
      h: 1.16,
      fontSize: 10.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
    rule(slide, x + 0.22, 4.44, w - 0.44, C.border, 0.8);
    addText(slide, ejemplo, {
      x: x + 0.22,
      y: 4.56,
      w: w - 0.44,
      h: 0.6,
      fontSize: 9.6,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 5.48, CW, 0.56, C.warm);
  rect(slide, M, 5.48, 0.06, 0.56, ROJO);
  addText(
    slide,
    "Los derechos son del titular y las obligaciones son del responsable. Quien escribe el código trabaja para el segundo, sobre datos del primero.",
    {
      x: M + 0.3,
      y: 5.6,
      w: CW - 0.6,
      h: 0.32,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
    }
  );

  addTakeaway(slide, "Guardar, consultar y borrar son todas operaciones de tratamiento.");
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Orden del deck.

slideCover();
slideOpeningQuestion();
slideWhatGreenCovers();
slidePurpose();
slideMap();
slideTheProject();
slideHowToReadATest();

slideBlockOneDivider();
slideTestPlanDefinition();
slideTenSubclauses();
slideStrategyAndExit();
slideTailoredConformance();
slideAgentPlan();
slideRiskVerified();
slideTheC03Line();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideRiskDefinition();
slideProductVsProject();
slideRiskBecameDefect();
slideThreeLevels();
slideLevelRule();
slideEffortCount();
slideFourResponses();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideMatrixDefinition();
slideRequirementIds();
slideMarker();
slideGenerator();
slideMatrixOutput();
slideTwoGaps();
slideMutantVsMatrix();
slideAgentMatrix();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideLegalRoles();
slideSixRights();
slideRightToRequirement();
slideTwoVerdicts();
slideSuppressOrAnonymize();
slideRightsInMatrix();
slideAgentClosesLoop();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideThreeArtifacts();
slideFinalClaim();
slideNextClassBridge();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} laminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
