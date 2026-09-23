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
  subject: "PRO402 · Clase 11",
  title: "Primero el rojo",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-11-Primero-El-Rojo.pptx");

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
      x: M + 2.28,
      y: y + 0.87,
      w: 4.2,
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

function slideCover() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.48, "PRO402 · Clase 11 · Unidad 2", C.gold, 6);
  addText(slide, "Primero el rojo", {
    x: M,
    y: 1.9,
    w: 10.8,
    h: 1.08,
    fontFace: TYPOGRAPHY.display,
    fontSize: 54,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.2, 4.2, C.red, 3);
  addText(slide, "Desarrollo guiado por pruebas, verde mínimo y refactor", {
    x: M,
    y: 3.48,
    w: 10.8,
    h: 0.48,
    fontSize: 20,
    color: C.softBlue,
  });
  addText(
    slide,
    "TDD no es otro nombre para «hacer pruebas». Es un orden de trabajo: escribir una prueba que expresa el resultado esperado, verla fallar por la razón prevista y recién entonces cambiar el código del sistema.",
    {
      x: M,
      y: 4.18,
      w: 10.0,
      h: 0.84,
      fontSize: 14.6,
      color: C.sand,
      lineSpacingMultiple: 1.2,
    }
  );
  rule(slide, M, 5.48, CW, NAVY_RULE, 1);
  addText(slide, "Martes 22 de septiembre de 2026 · 08:30 – 10:50", {
    x: M,
    y: 5.68,
    w: 6.4,
    h: 0.3,
    fontSize: 13,
    color: C.sand,
  });
  addText(slide, "Diego Obando · AIEP Osorno", {
    x: 7.2,
    y: 5.68,
    w: 5.4,
    h: 0.3,
    fontSize: 13,
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
    "Dos pruebas terminan en verde. ¿Entregan la misma evidencia?",
    "En ambos casos, verde significa que la prueba terminó sin fallar. La diferencia está en lo que se observó antes.",
    false,
    { titleFontSize: 28, subtitleW: 11.4 }
  );

  const columns = [
    {
      x: M,
      title: "Código primero",
      accent: AZUL,
      steps: ["Se implementa la regla", "Se escribe la prueba", "La prueba nace verde"],
      claim: "Sabemos que acepta esta implementación.",
    },
    {
      x: 6.96,
      title: "Prueba primero",
      accent: ROJO,
      steps: ["Se escribe la prueba", "Se observa el rojo", "El código la vuelve verde"],
      claim: "Sabemos que reaccionó sin el comportamiento.",
    },
  ];

  columns.forEach((column) => {
    rect(slide, column.x, 2.64, 5.66, 2.02, C.white);
    rect(slide, column.x, 2.64, 5.66, 0.07, column.accent);
    addKicker(slide, column.x + 0.28, 2.9, column.title, column.accent, 4.7);
    column.steps.forEach((step, index) => {
      const y = 3.32 + index * 0.48;
      addText(slide, String(index + 1), {
        x: column.x + 0.3,
        y,
        w: 0.34,
        h: 0.28,
        fontSize: 12,
        bold: true,
        color: column.accent,
        align: "center",
      });
      addText(slide, step, {
        x: column.x + 0.78,
        y,
        w: 4.45,
        h: 0.28,
        fontSize: 13,
        color: C.ink,
      });
    });
    rule(slide, column.x + 0.28, 4.68, 5.1, C.border, 0.8);
    addText(slide, column.claim, {
      x: column.x + 0.28,
      y: 4.82,
      w: 5.1,
      h: 0.34,
      fontSize: 12.2,
      bold: true,
      color: column.accent,
      align: "center",
    });
  });

  addTakeaway(
    slide,
    "La salida final puede ser idéntica. La historia que permite defender cada proceso no lo es.",
    { y: 5.54, h: 0.62 }
  );
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 03 · Continuidad

function slideContinuity() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "El hilo",
    "Tres clases, tres preguntas distintas",
    "Las técnicas anteriores siguen vigentes. Hoy cambia la pregunta: no buscamos más casos ni una métrica nueva; cambiamos el orden en que nace cada incremento.",
    false,
    { subtitleW: 11.5, subtitleH: 0.64 }
  );

  const items = [
    ["09", "Elegir casos", "¿Qué ejemplos representan bien el requisito?", "Particiones, límites y tablas de decisión", AZUL],
    ["10", "Medir sensibilidad", "¿Qué ejecuta el conjunto de pruebas (suite) y qué cambios detecta?", "Cobertura, comprobaciones y alteraciones controladas", ORO],
    ["11", "Cambiar el orden", "¿La prueba falló antes de implementar el comportamiento?", "Rojo → verde → refactor", ROJO],
  ];

  items.forEach(([number, title, question, detail, color], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 2.7, 3.72, 2.72, index === 2 ? C.navy : C.white);
    rect(slide, x, 2.7, 3.72, 0.07, color);
    addText(slide, number, {
      x: x + 0.28,
      y: 2.98,
      w: 0.74,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 34,
      bold: true,
      color,
    });
    addText(slide, title, {
      x: x + 1.1,
      y: 3.02,
      w: 2.3,
      h: 0.34,
      fontSize: 14.2,
      bold: true,
      color: index === 2 ? C.white : C.ink,
    });
    rule(slide, x + 0.28, 3.7, 3.16, index === 2 ? NAVY_RULE : C.border, 0.8);
    addText(slide, question, {
      x: x + 0.28,
      y: 3.9,
      w: 3.14,
      h: 0.72,
      fontSize: 13.2,
      bold: true,
      color: index === 2 ? C.softBlue : C.ink,
      lineSpacingMultiple: 1.16,
    });
    addText(slide, detail, {
      x: x + 0.28,
      y: 4.78,
      w: 3.14,
      h: 0.42,
      fontSize: 11.2,
      color: index === 2 ? C.sand : C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(slide, "TDD complementa el diseño y la evaluación de pruebas; no reemplaza ninguno de los dos.", {
    y: 5.78,
    h: 0.58,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 04 · Objetivo y vocabulario

function slidePurpose() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "La meta",
    "Qué podrás afirmar al terminar la sesión",
    "La afirmación importante no será «usé pytest» ni «mis pruebas pasan», sino una afirmación respaldada por una secuencia observable.",
    false,
    { subtitleW: 11.2, subtitleH: 0.56 }
  );

  addText(
    slide,
    "«Escribí una expectativa para una conducta que faltaba, vi que fallaba por la causa prevista, agregué solo lo necesario para hacerla pasar y mejoré la estructura con una suite que seguía verde.»",
    {
      x: M,
      y: 2.52,
      w: CW,
      h: 0.88,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.navy,
      align: "center",
      valign: "mid",
      lineSpacingMultiple: 1.14,
    }
  );
  rule(slide, 2.66, 3.56, 8.0, C.red, 2.2);

  addDefinition(slide, M, 3.88, 2.78, 1.34, "Prueba", "Caso automatizado que ejecuta una expectativa sobre un resultado observable.", AZUL);
  addDefinition(slide, 3.78, 3.88, 2.78, 1.34, "Suite", "Conjunto de pruebas automatizadas que se ejecutan como una unidad.", ORO);
  addDefinition(slide, 6.84, 3.88, 2.78, 1.34, "Comportamiento", "Resultado que alguien puede observar desde fuera de la implementación.", VERDE);
  addDefinition(slide, 9.9, 3.88, 2.71, 1.34, "Evidencia", "Salida o registro que permite sostener una afirmación concreta.", ROJO);

  addTakeaway(slide, "Una prueba no es una demostración absoluta de corrección: aporta evidencia sobre el caso que ejecutó.", {
    y: 5.7,
    h: 0.62,
  });
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
    "Cada bloque completa una parte del método y conserva la evidencia que permite pasar al siguiente.",
    true,
    { subtitleW: 11.2 }
  );

  const blocks = [
    ["1", "08:40", "El rojo que hay que ver", "Distinguir un error que impide ejecutar de una falla de comportamiento"],
    ["2", "09:10", "Verde mínimo y refactor", "Hacer pasar el ejemplo actual; mejorar estructura solo con la suite verde"],
    ["3", "09:45", "Tres vueltas y diseño emergente", "Agregar ejemplos pequeños y leer la cobertura como consecuencia"],
    ["4", "10:15", "Transferencia y auditoría", "Repetir el ciclo en Vitest y evaluar una entrega nacida en verde"],
  ];

  blocks.forEach(([number, time, title, detail], index) => {
    const y = 2.52 + index * 0.78;
    rect(slide, M, y, CW, 0.66, index % 2 === 0 ? NAVY_CHIP : C.navy);
    rect(slide, M, y, 0.06, 0.66, index === 0 ? C.red : C.gold);
    addText(slide, number, {
      x: M + 0.28,
      y: y + 0.1,
      w: 0.42,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: index === 0 ? C.red : C.gold,
      align: "center",
      valign: "mid",
    });
    addText(slide, time, {
      x: M + 0.9,
      y: y + 0.2,
      w: 0.8,
      h: 0.24,
      fontSize: 11.4,
      bold: true,
      color: C.sand,
    });
    addText(slide, title, {
      x: M + 1.88,
      y: y + 0.08,
      w: 3.5,
      h: 0.28,
      fontSize: 13.4,
      bold: true,
      color: C.white,
    });
    addText(slide, detail, {
      x: M + 5.52,
      y: y + 0.11,
      w: 6.0,
      h: 0.4,
      fontSize: 11.2,
      color: C.softBlue,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
  });

  rect(slide, M, 5.82, CW, 0.58, NAVY_CHIP);
  addText(slide, "Pausa: 09:35 – 09:45 · Cierre: 10:40 – 10:50", {
    x: M + 0.28,
    y: 5.96,
    w: CW - 0.56,
    h: 0.28,
    fontSize: 12.4,
    bold: true,
    color: C.gold,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 06 · Divisor de bloque

function slideBlockOneDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.58, "Bloque 1 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "El rojo que hay que ver", {
    x: M,
    y: 2.08,
    w: 10.7,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.18, 3.6, C.red, 2.6);
  addText(
    slide,
    "No toda salida roja prueba lo mismo. Primero haremos ejecutable la prueba; después exigiremos que la comprobación automática —la línea assert— compare el valor observado con el esperado.",
    {
      x: M,
      y: 3.48,
      w: 10.4,
      h: 0.84,
      fontSize: 17,
      italic: true,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  const chips = [
    ["1", "Definir TDD", "Un orden de operaciones"],
    ["2", "Leer el primer rojo", "La prueba todavía no se ejecuta"],
    ["3", "Obtener el rojo útil", "La línea assert observa y distingue"],
  ];
  chips.forEach(([number, title, detail], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 5.12, 3.72, 0.92, NAVY_CHIP);
    addText(slide, number, {
      x: x + 0.2,
      y: 5.31,
      w: 0.42,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: index === 2 ? C.red : C.gold,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: x + 0.76,
      y: 5.23,
      w: 2.7,
      h: 0.26,
      fontSize: 12.2,
      bold: true,
      color: C.white,
    });
    addText(slide, detail, {
      x: x + 0.76,
      y: 5.52,
      w: 2.7,
      h: 0.26,
      fontSize: 10.5,
      color: C.sand,
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 07 · TDD es un orden

function slideTddIsOrder() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · definición",
    "TDD no significa solamente «tener pruebas»",
    "TDD es desarrollo guiado por pruebas: la prueba del siguiente comportamiento se escribe antes que el código que lo implementa.",
    false,
    { subtitleW: 11.3, subtitleH: 0.56 }
  );

  const flows = [
    {
      y: 2.62,
      label: "Pruebas después",
      nodes: ["CÓDIGO", "PRUEBA", "VERDE"],
      colors: [AZUL, ORO, VERDE],
      claim: "La prueba acepta la implementación existente.",
    },
    {
      y: 4.22,
      label: "TDD",
      nodes: ["PRUEBA", "ROJO", "CÓDIGO", "VERDE"],
      colors: [ORO, ROJO, AZUL, VERDE],
      claim: "La prueba rechazó el sistema sin la conducta y luego aceptó el cambio.",
    },
  ];

  flows.forEach((flow, flowIndex) => {
    addKicker(slide, M, flow.y + 0.12, flow.label, flowIndex === 1 ? ROJO : AZUL, 2.1);
    const startX = M + 2.2;
    const nodeW = flowIndex === 1 ? 1.66 : 2.08;
    const gap = 0.42;
    flow.nodes.forEach((node, index) => {
      const x = startX + index * (nodeW + gap);
      rect(slide, x, flow.y, nodeW, 0.62, flow.colors[index]);
      addText(slide, node, {
        x,
        y: flow.y + 0.12,
        w: nodeW,
        h: 0.36,
        fontSize: 12.2,
        bold: true,
        color: C.white,
        align: "center",
        valign: "mid",
        charSpacing: 0.8,
      });
      if (index < flow.nodes.length - 1) {
        arrow(slide, x + nodeW + 0.08, flow.y + 0.31, gap - 0.14, C.slate, 1.3);
      }
    });
    addText(slide, flow.claim, {
      x: startX,
      y: flow.y + 0.78,
      w: flowIndex === 1 ? 7.9 : 7.04,
      h: 0.3,
      fontSize: 11.6,
      bold: flowIndex === 1,
      color: flowIndex === 1 ? ROJO : C.slate,
      align: "center",
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(
    slide,
    "La garantía es pequeña y precisa: la prueba reaccionó ante la ausencia o la respuesta incorrecta que motivó el cambio.",
    { y: 5.62, h: 0.62, fontSize: 13.4 }
  );
  addFuente(slide, 6.45, "Kent Beck · Test-Driven Development: By Example · regla inicial de TDD", { w: 8.6 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 08 · El ciclo

function slideCycle() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · el ciclo",
    "Cada color autoriza una acción distinta",
    "El ciclo es breve y se repite. Saltar de color cambia el método, aunque al final todas las pruebas estén verdes.",
    false,
    { subtitleW: 11.3 }
  );

  const steps = [
    ["1", "ROJO", "Escribir una prueba para una conducta que falta. Ejecutarla y entender por qué falla.", ROJO],
    ["2", "VERDE", "Escribir la menor cantidad de código de producción que hace pasar esa prueba.", VERDE],
    ["3", "REFACTOR", "Mejorar nombres, estructura o duplicación sin cambiar la conducta observable.", AZUL],
  ];
  steps.forEach(([number, title, body, color], index) => {
    const x = M + index * 4.12;
    addStep(slide, x, 2.68, 3.72, number, title, body, color, { h: 1.72 });
    if (index < 2) arrow(slide, x + 3.8, 3.54, 0.26, ORO, 2);
  });

  rect(slide, M, 4.78, CW, 0.96, C.softNeutral);
  addText(slide, "En rojo", {
    x: M + 0.3,
    y: 5.0,
    w: 1.0,
    h: 0.3,
    fontSize: 12.4,
    bold: true,
    color: ROJO,
  });
  addText(slide, "entender la falla; todavía no diseñar la solución completa", {
    x: M + 1.4,
    y: 5.0,
    w: 4.12,
    h: 0.32,
    fontSize: 11.8,
    color: C.ink,
  });
  addText(slide, "En verde", {
    x: M + 6.1,
    y: 5.0,
    w: 1.0,
    h: 0.3,
    fontSize: 12.4,
    bold: true,
    color: VERDE,
  });
  addText(slide, "no agregar otra conducta: iniciar otra vuelta con otra prueba", {
    x: M + 7.24,
    y: 5.0,
    w: 4.29,
    h: 0.32,
    fontSize: 11.8,
    color: C.ink,
  });

  addTakeaway(slide, "Refactorizar solo es seguro cuando la suite está verde y ya mostró que puede reaccionar.", {
    y: 6.02,
    h: 0.58,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 09 · La regla pequeña

function slideRule() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la primera vuelta",
    "Una regla pequeña, un ejemplo observable",
    "El proyecto de reserva incorpora una conducta que todavía no existe. No se diseña toda la política de capacidad: se elige el ejemplo que inicia la vuelta.",
    false,
    { subtitleW: 11.4, subtitleH: 0.62 }
  );

  rect(slide, M, 2.6, 7.3, 2.18, C.navy);
  addKicker(slide, M + 0.32, 2.88, "Requisito", C.gold, 2.2);
  addText(slide, "Una reserva debe rechazarse cuando la cantidad de personas supera la capacidad de la sala.", {
    x: M + 0.32,
    y: 3.28,
    w: 6.66,
    h: 0.9,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.12,
  });

  rect(slide, 8.34, 2.6, 4.27, 2.18, C.white);
  addKicker(slide, 8.66, 2.88, "Primer ejemplo", ROJO, 2.4);
  addText(slide, "31", {
    x: 8.66,
    y: 3.24,
    w: 0.8,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: ROJO,
  });
  addText(slide, "personas", {
    x: 9.48,
    y: 3.5,
    w: 0.86,
    h: 0.28,
    fontSize: 12,
    color: C.slate,
  });
  addText(slide, ">", {
    x: 10.44,
    y: 3.32,
    w: 0.36,
    h: 0.46,
    fontSize: 28,
    bold: true,
    color: ORO,
    align: "center",
  });
  addText(slide, "30", {
    x: 10.94,
    y: 3.24,
    w: 0.8,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: AZUL,
  });
  addText(slide, "cupos", {
    x: 11.76,
    y: 3.5,
    w: 0.52,
    h: 0.28,
    fontSize: 12,
    color: C.slate,
  });
  rule(slide, 8.66, 4.08, 3.62, C.border, 0.8);
  addText(slide, "resultado esperado: False", {
    x: 8.66,
    y: 4.24,
    w: 3.62,
    h: 0.32,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    bold: true,
    color: ROJO,
    align: "center",
  });

  addDefinition(slide, M, 5.18, 3.74, 0.94, "Observable", "Alguien puede ver el resultado sin conocer la implementación.", VERDE);
  addDefinition(slide, 4.84, 5.18, 3.74, 0.94, "Pequeño", "Exige una sola respuesta concreta; no toda la política futura.", ORO);
  addDefinition(slide, 8.96, 5.18, 3.65, 0.94, "Pendiente", "El sistema todavía no produce esa respuesta.", ROJO);

  addTakeaway(slide, "La prueba que sigue convertirá este ejemplo en una interfaz ejecutable.", {
    y: 6.32,
    h: 0.48,
    fontSize: 13,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 10 · La prueba fija la interfaz

function slideTestFirst() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · la prueba primero",
    "La prueba decide cómo se usará la función",
    "Todavía no existe capacidad.py. Aun así, la prueba ya fija el nombre de la operación, sus entradas y el resultado que debe poder observarse.",
    false,
    { subtitleW: 11.3, subtitleH: 0.58 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 7.5,
    h: 2.52,
    title: "tests/test_capacidad.py",
    code: [
      "from capacidad import cabe_en_sala",
      "",
      "",
      "def test_rechaza_reserva_que_supera_el_cupo():",
      "    assert cabe_en_sala(personas=31, capacidad=30) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 10.6,
  });

  const decisions = [
    ["Nombre", "cabe_en_sala", "La operación se expresa como una pregunta que devuelve sí o no.", AZUL],
    ["Entradas", "personas · capacidad", "Los argumentos nombrados explican qué representa cada número.", ORO],
    ["Salida", "bool: False", "Un booleano admite dos valores: True o False. Aquí, False expresa el rechazo.", ROJO],
  ];
  decisions.forEach(([label, value, detail, color], index) => {
    const y = 2.58 + index * 0.88;
    rect(slide, 8.46, y, 4.15, 0.76, C.white);
    rect(slide, 8.46, y, 0.06, 0.76, color);
    addText(slide, label.toUpperCase(), {
      x: 8.72,
      y: y + 0.1,
      w: 0.92,
      h: 0.18,
      fontSize: 8.4,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, value, {
      x: 9.68,
      y: y + 0.08,
      w: 2.6,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, detail, {
      x: 8.72,
      y: y + 0.36,
      w: 3.6,
      h: 0.3,
      fontSize: 10.5,
      color: C.slate,
      lineSpacingMultiple: 1.08,
    });
  });

  addTakeaway(slide, "La implementación aún no existe, pero su interfaz pública —nombre, entradas y salida observable— ya tiene una primera forma.", {
    y: 5.48,
    h: 0.58,
  });
  addFuente(slide, 6.3, "pytest · Anatomy of a test · una aserción compara el resultado observado con la expectativa", {
    w: 10.8,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 11 · Rojo por ausencia

function slideRedByAbsence() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · primera ejecución",
    "Primer rojo: pytest no pudo ejecutar la prueba",
    "La prueba se lanza desde la raíz del proyecto. Como capacidad.py no existe, pytest se detiene antes de entrar al cuerpo de la función de prueba.",
    false,
    { titleFontSize: 28, titleH: 1.02, subtitleY: 1.92, subtitleW: 11.4, subtitleH: 0.56 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 7.52,
    h: 2.42,
    title: "Primera ejecución",
    fontSize: 10.2,
    lines: [
      { prompt: ">", text: "uv run --with pytest python -m pytest -q" },
      { text: "ERROR collecting tests/test_capacidad.py", kind: "error" },
      { text: "E   ModuleNotFoundError: No module named 'capacidad'", kind: "error" },
      { text: "Interrupted: 1 error during collection", kind: "muted" },
    ],
  });

  addDefinition(slide, 8.5, 2.58, 4.11, 1.16, "Recolección", "Fase en que pytest descubre e importa los archivos de prueba antes de ejecutar sus funciones.", AZUL);
  addDefinition(slide, 8.5, 3.92, 4.11, 1.08, "Qué demuestra", "Falta el archivo o módulo que se intenta importar. No demuestra que el assert distinga True de False.", ROJO);

  rect(slide, M, 5.34, CW, 0.74, C.paleRed);
  addText(slide, "La línea assert no llegó a ejecutarse", {
    x: M + 0.32,
    y: 5.5,
    w: 3.4,
    h: 0.3,
    fontSize: 13.2,
    bold: true,
    color: ROJO,
  });
  addText(slide, "El color es rojo, pero la causa está en una precondición para arrancar: el archivo importado no existe.", {
    x: M + 3.92,
    y: 5.5,
    w: 7.55,
    h: 0.3,
    fontSize: 12.2,
    color: C.ink,
  });
  addFuente(slide, 6.38, "pytest · import mechanisms and sys.path/PYTHONPATH · importación durante la recolección", {
    w: 10.5,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 12 · Hacer ejecutable sin resolver

function slideMakeExecutable() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · quitar el obstáculo",
    "Hacer ejecutable la prueba no es implementar la regla",
    "Se crea solo la firma exigida por la prueba. La respuesta True es deliberadamente insuficiente: acepta todas las reservas y debe fallar para 31 personas en una sala de 30.",
    false,
    { subtitleW: 11.35, subtitleH: 0.64 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.64,
    w: 6.92,
    h: 1.66,
    title: "capacidad.py · implementación provisional completa",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return True",
    ].join("\n"),
    lang: "python",
    fontSize: 11.2,
  });

  addDefinition(slide, 8.0, 2.64, 4.61, 1.66, "Firma", "Nombre de la función, nombres y tipos de sus parámetros y tipo de retorno. Permite importarla y llamarla; todavía no resuelve la regla.", AZUL);

  const comparisons = [
    ["Sí cambia", "Existe capacidad.py y puede importarse cabe_en_sala().", VERDE],
    ["No cambia", "La función sigue aceptando el caso que debería rechazar.", ROJO],
    ["Propósito", "Permitir que pytest alcance y ejecute la aserción.", ORO],
  ];
  comparisons.forEach(([label, body, color], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 4.7, 3.72, 0.92, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, x, 4.7, 0.06, 0.92, color);
    addText(slide, label.toUpperCase(), {
      x: x + 0.24,
      y: 4.84,
      w: 1.1,
      h: 0.18,
      fontSize: 8.6,
      bold: true,
      color,
      charSpacing: 0.9,
    });
    addText(slide, body, {
      x: x + 0.24,
      y: 5.08,
      w: 3.2,
      h: 0.38,
      fontSize: 11.1,
      color: C.ink,
      lineSpacingMultiple: 1.1,
    });
  });

  addTakeaway(slide, "Corregir el import solo permite observar el comportamiento; todavía no autoriza la solución definitiva.", {
    y: 5.98,
    h: 0.58,
    fontSize: 13.2,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 13 · Rojo por comportamiento

function slideRedByBehavior() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · segunda ejecución",
    "Ahora sí: la aserción observó y comparó",
    "El archivo existe, la función se importa y la prueba se ejecuta. El fallo ya no habla de infraestructura: muestra una diferencia entre el valor obtenido y el esperado.",
    false,
    { subtitleW: 11.3, subtitleH: 0.62 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 7.62,
    h: 2.72,
    title: "Segunda ejecución · salida relevante",
    fontSize: 9.7,
    lines: [
      { prompt: ">", text: "uv run --with pytest python -m pytest -q" },
      { text: "F                                                    [100%]", kind: "error" },
      { text: ">   assert cabe_en_sala(personas=31, capacidad=30) is False", kind: "error" },
      { text: "E   assert True is False", kind: "error" },
      { text: "FAILED tests/test_capacidad.py::test_rechaza_reserva_que_supera_el_cupo", kind: "error" },
      { text: "1 failed", kind: "muted" },
    ],
  });

  const readings = [
    ["F", "La prueba fue recogida y ejecutada.", AZUL],
    ["True", "Valor observado: la función aceptó la reserva.", ROJO],
    ["False", "Valor esperado: el requisito exige rechazarla.", VERDE],
  ];
  readings.forEach(([token, meaning, color], index) => {
    const y = 2.58 + index * 0.9;
    rect(slide, 8.62, y, 3.99, 0.76, C.white);
    rect(slide, 8.62, y, 0.06, 0.76, color);
    addText(slide, token, {
      x: 8.9,
      y: y + 0.14,
      w: 0.72,
      h: 0.38,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, meaning, {
      x: 9.82,
      y: y + 0.12,
      w: 2.5,
      h: 0.46,
      fontSize: 11,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });

  addTakeaway(slide, "Rojo por comportamiento: la prueba ejecutó su assert y distinguió la respuesta actual de la requerida.", {
    y: 5.66,
    h: 0.6,
    fontSize: 13.2,
  });
  addFuente(slide, 6.47, "pytest · How to write and report assertions in tests · valores observados y esperados", {
    w: 10.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 14 · Criterio de aceptación

function slideAcceptRed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 1 · criterio de salida",
    "No basta con recordar que la terminal estuvo roja",
    "Antes de avanzar al verde, hay que explicar qué falló y demostrar que la prueba llegó al comportamiento que declara observar.",
    false,
    { subtitleW: 11.3 }
  );

  const rows = [
    ["1", "La prueba se ejecutó", "pytest muestra FAILED y el nombre completo de la prueba.", AZUL],
    ["2", "La causa era la prevista", "El mensaje compara el valor observado con el esperado.", ROJO],
    ["3", "El caso se entiende", "El nombre de la prueba y sus datos se relacionan con el requisito.", VERDE],
  ];
  rows.forEach(([number, title, evidence, color], index) => {
    const y = 2.54 + index * 0.84;
    rect(slide, M, y, 7.52, 0.72, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.72, color);
    addText(slide, number, {
      x: M + 0.24,
      y: y + 0.12,
      w: 0.42,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: M + 0.88,
      y: y + 0.1,
      w: 2.3,
      h: 0.24,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, evidence, {
      x: M + 3.2,
      y: y + 0.11,
      w: 3.95,
      h: 0.42,
      fontSize: 11.2,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });

  rect(slide, 8.58, 2.54, 4.03, 1.18, C.paleRed);
  addKicker(slide, 8.86, 2.72, "Rojo por ausencia", ROJO, 2.6);
  addText(slide, "Algo impide ejecutar la prueba: import, símbolo, dependencia, sintaxis o configuración.", {
    x: 8.86,
    y: 3.02,
    w: 3.47,
    h: 0.52,
    fontSize: 11.2,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  rect(slide, 8.58, 3.94, 4.03, 1.18, C.softBlue);
  addKicker(slide, 8.86, 4.12, "Rojo por comportamiento", AZUL, 3.2);
  addText(slide, "La prueba se ejecuta y la aserción rechaza el resultado actual.", {
    x: 8.86,
    y: 4.42,
    w: 3.47,
    h: 0.48,
    fontSize: 11.2,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  addTakeaway(
    slide,
    "SyntaxError, ModuleNotFoundError o un nombre mal escrito se corrigen hasta alcanzar un rojo que hable del comportamiento.",
    { y: 5.56, h: 0.62, fontSize: 13.1 }
  );
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 15–16 · Preguntas y respuestas del bloque 1

function slideBlockOneQuestions() {
  slideQuestions(1, "Tres preguntas antes de escribir el verde", [
    [
      "¿Por qué ModuleNotFoundError no demuestra que el assert sea sensible al comportamiento?",
      "Ubica en qué fase se interrumpió pytest y si el cuerpo de la prueba alcanzó a correr.",
    ],
    [
      "¿Qué tendría de sospechoso que la primera ejecución de una prueba nueva apareciera verde?",
      "El comportamiento puede existir ya, o la prueba podría no estar observando lo que declara.",
    ],
    [
      "¿Qué parte de la interfaz de cabe_en_sala decidió la prueba antes que la implementación?",
      "Revisa el nombre, los parámetros nombrados y el tipo de resultado exigido por el assert.",
    ],
  ]);
}

function slideBlockOneAnswers() {
  slideAnswers(1, "Lo que tenía que aparecer", [
    [
      "El assert no se ejecutó",
      "pytest se detuvo durante la recolección al no poder importar capacidad; el cuerpo de la prueba nunca corrió.",
      "Ese rojo solo prueba que falta infraestructura necesaria.",
      "«Todo rojo demuestra que la prueba funciona.»",
    ],
    [
      "Un verde inicial admite dos explicaciones",
      "La conducta ya existía o la prueba no la observa. Hay que distinguirlas antes de continuar.",
      "Sin un rojo esperado no consta que la prueba detecte la ausencia que motivó el cambio.",
      "«Si pasó a la primera, la prueba está bien.»",
    ],
    [
      "Nombre, entradas y tipo de salida",
      "La prueba fijó cabe_en_sala, los parámetros personas y capacidad, y un resultado booleano que debe ser False.",
      "La prueba escrita primero también participa en el diseño de la interfaz pública.",
      "«La interfaz la decide solo la implementación.»",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 17 · Divisor de bloque 2

function slideBlockTwoDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.58, "Bloque 2 de 4 · 25 minutos", C.gold, 5);
  addText(slide, "Verde mínimo y refactor", {
    x: M,
    y: 2.08,
    w: 11.0,
    h: 0.92,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.18, 3.6, C.red, 2.6);
  addText(
    slide,
    "El rojo ya tiene una causa conocida. Ahora cambiaremos solo lo necesario para hacerlo pasar y separaremos ese cambio de cualquier mejora estructural posterior.",
    {
      x: M,
      y: 3.48,
      w: 10.5,
      h: 0.84,
      fontSize: 17,
      italic: true,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  const steps = [
    ["1", "Llegar a verde", "Satisfacer el ejemplo actual"],
    ["2", "Clasificar el cambio", "Comportamiento nuevo o estructura"],
    ["3", "Refactorizar con respaldo", "Conservar respuestas observables"],
  ];
  steps.forEach(([number, title, detail], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 5.12, 3.72, 0.92, NAVY_CHIP);
    addText(slide, number, {
      x: x + 0.2,
      y: 5.31,
      w: 0.42,
      h: 0.38,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: index === 0 ? C.success : C.gold,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: x + 0.76,
      y: 5.23,
      w: 2.7,
      h: 0.26,
      fontSize: 12.2,
      bold: true,
      color: C.white,
    });
    addText(slide, detail, {
      x: x + 0.76,
      y: 5.52,
      w: 2.7,
      h: 0.26,
      fontSize: 10.5,
      color: C.sand,
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 18 · Cambio mínimo

function slideMinimumGreen() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · paso verde",
    "El cambio mínimo satisface la evidencia disponible",
    "La prueba actual exige una sola respuesta: 31 personas no caben en una sala con capacidad 30. El paso verde todavía no generaliza la regla.",
    false,
    { subtitleW: 11.4, subtitleH: 0.58 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 5.22,
    h: 1.62,
    title: "Antes · rojo por comportamiento",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return True",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });
  arrow(slide, 6.1, 3.4, 0.98, ORO, 2.2);
  addText(slide, "un token", {
    x: 6.06,
    y: 3.0,
    w: 1.08,
    h: 0.24,
    fontSize: 9.4,
    bold: true,
    color: ORO,
    align: "center",
  });
  addCodePanel(slide, SH, {
    x: 7.28,
    y: 2.6,
    w: 5.33,
    h: 1.62,
    title: "Después · primer verde",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return False",
    ].join("\n"),
    lang: "python",
    fontSize: 10.2,
  });

  rect(slide, M, 4.62, CW, 1.12, C.white);
  rect(slide, M, 4.62, 0.07, 1.12, VERDE);
  addText(slide, "VERDE MÍNIMO", {
    x: M + 0.34,
    y: 4.84,
    w: 2.05,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: VERDE,
    charSpacing: 1.1,
  });
  addText(
    slide,
    "El menor cambio que satisface la prueba actual sin romper las anteriores. No significa código descuidado ni una solución lista para producción.",
    {
      x: M + 2.45,
      y: 4.77,
      w: CW - 2.82,
      h: 0.48,
      fontSize: 13.3,
      bold: true,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.13,
    }
  );
  addText(
    slide,
    "La constante False es provisional y explícita. El siguiente ejemplo mostrará qué comportamiento todavía falta.",
    {
      x: M + 2.45,
      y: 5.34,
      w: CW - 2.82,
      h: 0.26,
      fontSize: 11.2,
      italic: true,
      color: C.slate,
    }
  );

  addTakeaway(slide, "Código de producción significa código del sistema. Agregarle casos que ninguna prueba pidió devuelve el proceso al código primero.", {
    y: 6.02,
    h: 0.58,
    fontSize: 12.8,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 19 · Lectura del verde

function slideReadGreen() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · ejecución",
    "El verde también se lee, no solo se celebra",
    "La salida confirma que la prueba fue recogida, ejecutada y aprobada. El tiempo puede variar entre equipos; los indicadores relevantes no cambian.",
    false,
    { subtitleW: 11.3, subtitleH: 0.58 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 7.5,
    h: 2.54,
    title: "Ejecución después de return False",
    fontSize: 10.2,
    lines: [
      { prompt: ">", text: "uv run --with pytest python -m pytest -q" },
      { text: ".                                                    [100%]", kind: "success" },
      { text: "1 passed in 0.02s", kind: "success" },
      { prompt: ">", text: "echo $LASTEXITCODE" },
      { text: "0", kind: "success" },
    ],
  });

  const signals = [
    [".", "Una prueba aprobada", "El punto representa una prueba que terminó sin fallar.", VERDE],
    ["1 passed", "Conteo de la suite", "pytest recogió una prueba y la única prueba pasó.", AZUL],
    ["0", "Código de salida", "El proceso comunica éxito a la terminal y a otras herramientas.", ORO],
  ];
  signals.forEach(([token, title, body, color], index) => {
    const y = 2.58 + index * 0.86;
    rect(slide, 8.48, y, 4.13, 0.74, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, 8.48, y, 0.06, 0.74, color);
    addText(slide, token, {
      x: 8.76,
      y: y + 0.14,
      w: 0.9,
      h: 0.38,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: 9.82,
      y: y + 0.1,
      w: 2.5,
      h: 0.22,
      fontSize: 11.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, body, {
      x: 9.82,
      y: y + 0.36,
      w: 2.52,
      h: 0.26,
      fontSize: 9.9,
      color: C.slate,
      lineSpacingMultiple: 1.06,
    });
  });

  addTakeaway(slide, "El verde actual importa porque antes se observó la misma prueba fallando con assert True is False.", {
    y: 5.54,
    h: 0.6,
    fontSize: 13.2,
  });
  addFuente(slide, 6.36, "pytest · Managing pytest's output y Exit codes · punto, conteo aprobado y código 0", {
    w: 10.8,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 20 · Estrategias para llegar a verde

function slideGreenStrategies() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · estrategias",
    "Tres formas de administrar el riesgo del paso verde",
    "No son niveles de calidad. Cada estrategia decide cuánto comportamiento incorporar en la vuelta actual y cuánta evidencia pedir antes de generalizar.",
    false,
    { subtitleW: 11.4, subtitleH: 0.6 }
  );

  const strategies = [
    {
      number: "1",
      title: "Fake It · usar una constante",
      code: "return False",
      body: "Satisface el ejemplo actual sin inventar una regla general. Es la estrategia usada en esta vuelta.",
      when: "Útil cuando todavía hay varias generalizaciones posibles.",
      color: ROJO,
    },
    {
      number: "2",
      title: "Implementación obvia",
      code: "return personas <= capacidad",
      body: "Escribe directamente una solución simple que se comprende con seguridad.",
      when: "Útil cuando la regla es inequívoca y el salto es pequeño.",
      color: AZUL,
    },
    {
      number: "3",
      title: "Triangulación",
      code: "otro ejemplo fuerza la regla",
      body: "Agrega un caso que hace fallar la constante y obliga a distinguir dos respuestas.",
      when: "Útil cuando un solo dato no justifica la generalización.",
      color: VERDE,
    },
  ];

  strategies.forEach((strategy, index) => {
    const y = 2.58 + index * 1.08;
    addText(slide, strategy.number, {
      x: M,
      y: y + 0.12,
      w: 0.54,
      h: 0.56,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color: strategy.color,
      align: "center",
      valign: "mid",
    });
    rect(slide, M + 0.78, y, 3.18, 0.88, strategy.color);
    addText(slide, strategy.title, {
      x: M + 1.04,
      y: y + 0.14,
      w: 2.66,
      h: 0.25,
      fontSize: 12.4,
      bold: true,
      color: C.white,
    });
    addText(slide, strategy.code, {
      x: M + 1.04,
      y: y + 0.47,
      w: 2.66,
      h: 0.22,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 9.8,
      color: C.white,
    });
    addText(slide, strategy.body, {
      x: M + 4.28,
      y: y + 0.08,
      w: 4.1,
      h: 0.64,
      fontSize: 11.4,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    addText(slide, strategy.when, {
      x: M + 8.62,
      y: y + 0.08,
      w: 3.18,
      h: 0.64,
      fontSize: 10.8,
      italic: true,
      color: C.slate,
      valign: "mid",
      lineSpacingMultiple: 1.1,
    });
    if (index < strategies.length - 1) {
      rule(slide, M + 0.78, y + 0.98, CW - 0.78, C.border, 0.7);
    }
  });

  addTakeaway(slide, "En esta clase, el segundo ejemplo hará visible la limitación de return False antes de generalizar.", {
    y: 5.92,
    h: 0.58,
    fontSize: 13.2,
  });
  addFuente(slide, 6.65, "Kent Beck · Test-Driven Development: By Example y Equality for All", {
    w: 9.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 21 · Implementación y refactor

function slideRefactorDefinition() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · distinción",
    "Refactor significa conservar el comportamiento observable",
    "Un refactor cambia la estructura interna para facilitar la comprensión o la modificación. Si alguna entrada obtiene una respuesta distinta, el cambio pertenece a otra categoría.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.62 }
  );

  rect(slide, M, 2.62, CW, 0.76, C.navy);
  addText(slide, "Criterio decisivo", {
    x: M + 0.32,
    y: 2.83,
    w: 2.0,
    h: 0.28,
    fontSize: 12.2,
    bold: true,
    color: C.gold,
  });
  addText(slide, "¿Las mismas entradas conservan las mismas respuestas antes y después?", {
    x: M + 2.32,
    y: 2.78,
    w: 8.95,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: C.white,
    align: "center",
  });

  const changes = [
    ["return True  →  return False", "IMPLEMENTACIÓN", "Cambia la respuesta del caso 31/30 para hacer pasar la prueba.", ROJO],
    ["return False  →  personas <= capacidad", "NUEVO COMPORTAMIENTO", "También cambia las respuestas de 30/30 y 1/30, todavía sin pruebas.", ORO],
    ["assert ... is False  →  assert ... is True", "ESPECIFICACIÓN ALTERADA", "Hace verde la suite cambiando lo esperado, no cumpliéndolo.", ROJO],
    ["Renombrar una variable sin cambiar su valor", "REFACTOR", "Mejora la lectura y conserva todas las respuestas observables.", VERDE],
  ];
  changes.forEach(([change, classification, reason, color], index) => {
    const y = 3.66 + index * 0.56;
    rect(slide, M, y, CW, 0.48, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.48, color);
    addText(slide, change, {
      x: M + 0.24,
      y: y + 0.08,
      w: 4.14,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.1,
      bold: true,
      color: C.ink,
    });
    addText(slide, classification, {
      x: M + 4.56,
      y: y + 0.09,
      w: 2.28,
      h: 0.24,
      fontSize: 9.2,
      bold: true,
      color,
      charSpacing: 0.7,
    });
    addText(slide, reason, {
      x: M + 6.96,
      y: y + 0.08,
      w: 4.58,
      h: 0.28,
      fontSize: 10.4,
      color: C.slate,
    });
  });

  addTakeaway(slide, "La intención no basta: la clasificación depende de lo que el sistema responde después del cambio.", {
    y: 6.12,
    h: 0.56,
    fontSize: 13.1,
  });
  addFuente(slide, 6.83, "Martin Fowler · Definition of Refactoring y Refactoring Boundary", {
    w: 9.0,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 22 · Refactor de la prueba

function slideTestRefactor() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · ejemplo de refactor",
    "La prueba cambia de forma y conserva la misma observación",
    "La versión extensa separa preparación, acción y aserción. Solo conviene conservarla si esos nombres aclaran la intención; más líneas no significan automáticamente mejor código.",
    false,
    { titleFontSize: 28, subtitleW: 11.45, subtitleH: 0.64 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.64,
    w: 5.05,
    h: 3.14,
    title: "Antes · versión breve",
    code: [
      "from capacidad import cabe_en_sala",
      "",
      "",
      "def test_rechaza_reserva_que_supera_el_cupo():",
      "    assert cabe_en_sala(",
      "        personas=31, capacidad=30",
      "    ) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 8.8,
  });

  arrow(slide, 5.96, 4.04, 0.62, ORO, 2.1);
  addText(slide, "misma respuesta", {
    x: 5.78,
    y: 3.58,
    w: 0.98,
    h: 0.34,
    fontSize: 9.1,
    bold: true,
    color: ORO,
    align: "center",
  });

  addCodePanel(slide, SH, {
    x: 6.78,
    y: 2.64,
    w: 5.83,
    h: 3.14,
    title: "Después · preparación, acción y aserción",
    code: [
      "from capacidad import cabe_en_sala",
      "",
      "",
      "def test_rechaza_reserva_que_supera_el_cupo():",
      "    personas_solicitadas = 31",
      "    capacidad_sala = 30",
      "",
      "    resultado = cabe_en_sala(",
      "        personas=personas_solicitadas,",
      "        capacidad=capacidad_sala,",
      "    )",
      "",
      "    assert resultado is False",
    ].join("\n"),
    lang: "python",
    fontSize: 7.7,
  });

  const invariants = [
    ["Entradas", "31 personas · capacidad 30", AZUL],
    ["Resultado esperado", "False", ROJO],
    ["Salida de pytest", "1 passed", VERDE],
  ];
  invariants.forEach(([label, value, color], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 5.96, 3.72, 0.64, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, x, 5.96, 0.05, 0.64, color);
    addText(slide, label.toUpperCase(), {
      x: x + 0.22,
      y: 6.08,
      w: 1.58,
      h: 0.18,
      fontSize: 8.3,
      bold: true,
      color,
      charSpacing: 0.8,
    });
    addText(slide, value, {
      x: x + 1.78,
      y: 6.05,
      w: 1.66,
      h: 0.26,
      fontFace: index === 1 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
      fontSize: 10.8,
      bold: true,
      color: C.ink,
      align: "right",
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 23 · Puerta del refactor

function slideRefactorGate() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 2 · puerta de seguridad",
    "Cinco condiciones antes de tocar la estructura",
    "La suite verde sirve como red de seguridad cuando existe evidencia previa de que puede reaccionar y cuando las respuestas que debe conservar están claras.",
    false,
    { subtitleW: 11.35, subtitleH: 0.6 }
  );

  const conditions = [
    ["1", "Verde", "Las pruebas relevantes pasan antes del cambio estructural.", VERDE],
    ["2", "Sensibilidad conocida", "La prueba relacionada ya fue observada en rojo por la causa prevista.", ROJO],
    ["3", "Respuestas fijadas", "Se pueden nombrar las respuestas que deben permanecer iguales.", AZUL],
    ["4", "Paso pequeño", "Se realiza una transformación estructural por vez.", ORO],
    ["5", "Verificación inmediata", "La suite se ejecuta después de cada transformación.", VERDE],
  ];
  conditions.forEach(([number, title, body, color], index) => {
    const y = 2.56 + index * 0.61;
    rect(slide, M, y, 7.55, 0.51, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.51, color);
    addText(slide, number, {
      x: M + 0.22,
      y: y + 0.08,
      w: 0.34,
      h: 0.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 18,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: M + 0.76,
      y: y + 0.08,
      w: 2.08,
      h: 0.24,
      fontSize: 11.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, body, {
      x: M + 2.98,
      y: y + 0.08,
      w: 4.18,
      h: 0.28,
      fontSize: 10.3,
      color: C.slate,
    });
  });

  rect(slide, 8.62, 2.56, 3.99, 1.4, C.navy);
  addKicker(slide, 8.92, 2.78, "Puede terminar sin cambios", C.gold, 3.36);
  addText(slide, "Una función de una línea sin duplicación puede no necesitar refactor todavía. La fase ofrece una oportunidad; no exige crear una estructura más general.", {
    x: 8.92,
    y: 3.08,
    w: 3.38,
    h: 0.58,
    fontSize: 10.9,
    color: C.white,
    lineSpacingMultiple: 1.1,
  });

  rect(slide, 8.62, 4.08, 3.99, 1.53, C.white);
  addKicker(slide, 8.92, 4.3, "Si el cambio lo propone un agente", ROJO, 3.4);
  addText(slide, "La validación humana revisa tres hechos. El diff, o comparación de líneas modificadas, no agrega comportamiento. La prueba que mostró rojo sigue presente y pytest terminó con código 0, es decir, sin error.", {
    x: 8.92,
    y: 4.62,
    w: 3.38,
    h: 0.66,
    fontSize: 10.6,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });

  addTakeaway(slide, "Rojo conocido  →  diff mínimo  →  verde  →  refactor opcional  →  verde", {
    y: 5.96,
    h: 0.58,
    fontSize: 13.4,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 24–25 · Preguntas y respuestas del bloque 2

function slideBlockTwoQuestions() {
  slideQuestions(2, "Tres preguntas antes de la segunda vuelta", [
    [
      "¿Por qué return False es aceptable en esta vuelta aunque todavía no sea la solución final?",
      "Separa lo que exige el único ejemplo actual de lo que se supone informalmente sobre el problema real.",
    ],
    [
      "¿Por qué cambiar a return personas <= capacidad todavía no cuenta como refactor?",
      "Prueba mentalmente entradas distintas de 31/30 y observa si alguna respuesta cambia.",
    ],
    [
      "¿Qué evidencia convierte el verde actual en una red más confiable que una prueba nacida en verde?",
      "Recupera la salida assert True is False observada antes del cambio de producción.",
    ],
  ]);
}

function slideBlockTwoAnswers() {
  slideAnswers(2, "Lo que tenía que aparecer", [
    [
      "Satisface exactamente la prueba actual",
      "El único ejemplo exige rechazar 31/30. La constante False cumple ese caso sin adelantar respuestas que ninguna prueba solicitó.",
      "El paso mínimo limita el comportamiento nuevo a la evidencia disponible.",
      "«El verde mínimo es código malo o incompleto por accidente.»",
    ],
    [
      "Cambia respuestas observables",
      "La comparación también acepta 30/30 y 1/30. Es comportamiento nuevo, aunque para el dominio parezca obvio.",
      "Un refactor conserva resultados; esta expresión generaliza la regla.",
      "«Si el código queda más correcto, entonces fue refactor.»",
    ],
    [
      "La misma prueba ya reaccionó en rojo",
      "Antes de return False, pytest ejecutó el assert y mostró True is False. El verde apareció después del cambio de producción.",
      "Existe una relación observada entre el cambio y el resultado de la prueba.",
      "«Una prueba verde siempre es una red suficiente.»",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 26 · Divisor de bloque 3

function slideBlockThreeDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.58, "Bloque 3 de 4 · 30 minutos", C.gold, 5);
  addText(slide, "Tres vueltas, una regla que emerge", {
    x: M,
    y: 2.02,
    w: 11.0,
    h: 1.1,
    fontFace: TYPOGRAPHY.display,
    fontSize: 41,
    bold: true,
    color: C.white,
  });
  rule(slide, M, 3.3, 3.6, C.red, 2.6);
  addText(
    slide,
    "Cada ejemplo contradice una versión todavía demasiado simple. La implementación crece solo lo necesario para explicar la evidencia acumulada.",
    {
      x: M,
      y: 3.58,
      w: 10.4,
      h: 0.72,
      fontSize: 17,
      italic: true,
      color: C.softBlue,
      lineSpacingMultiple: 1.18,
    }
  );

  const turns = [
    ["1", "31 / 30", "rechazar el sobrecupo", C.red],
    ["2", "30 / 30", "aceptar el límite exacto", C.gold],
    ["3", "0 / 30", "exigir al menos una persona", C.success],
  ];
  turns.forEach(([number, example, decision, color], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 5.08, 3.72, 0.96, NAVY_CHIP);
    addText(slide, number, {
      x: x + 0.18,
      y: 5.28,
      w: 0.44,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 23,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, example, {
      x: x + 0.78,
      y: 5.18,
      w: 1.2,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: C.white,
    });
    addText(slide, decision, {
      x: x + 0.78,
      y: 5.5,
      w: 2.66,
      h: 0.28,
      fontSize: 10.6,
      color: C.sand,
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 27 · Triangulación y panorama de vueltas

function slideTriangulationMap() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · método",
    "Triangulación: otro ejemplo obliga a abandonar la constante",
    "Un segundo ejemplo varía un dato significativo. Si la misma respuesta constante ya no puede satisfacer ambos casos, el código debe generalizarse lo suficiente para explicarlos.",
    false,
    { titleFontSize: 28, subtitleW: 11.45, subtitleH: 0.62 }
  );

  rect(slide, M, 2.56, CW, 0.72, C.navy);
  addText(slide, "FRONTERA", {
    x: M + 0.3,
    y: 2.78,
    w: 1.15,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  addText(slide, "Valor donde la respuesta esperada cambia. En esta regla, 30/30 pertenece al lado aceptado y 31/30 al rechazado.", {
    x: M + 1.52,
    y: 2.72,
    w: 10.0,
    h: 0.34,
    fontSize: 13,
    color: C.white,
    align: "center",
  });

  const rows = [
    ["1", "31 / 30", "False", "True is False", "return False", "El sobrecupo se rechaza", ROJO],
    ["2", "30 / 30", "True", "False is True", "personas <= capacidad", "La igualdad se acepta", ORO],
    ["3", "0 / 30", "False", "True is False", "1 <= personas <= capacidad", "Se exige al menos una persona", VERDE],
  ];
  const headers = ["VUELTA", "EJEMPLO", "ESPERADO", "ROJO OBSERVADO", "VERDE MÍNIMO", "DECISIÓN"];
  const xs = [M, M + 0.92, M + 2.22, M + 3.55, M + 5.72, M + 8.35];
  const ws = [0.78, 1.18, 1.2, 2.02, 2.47, 3.54];
  headers.forEach((header, index) => {
    addText(slide, header, {
      x: xs[index],
      y: 3.62,
      w: ws[index],
      h: 0.2,
      fontSize: 8.3,
      bold: true,
      color: C.slate,
      charSpacing: 0.8,
      align: index === 0 ? "center" : "left",
    });
  });
  rows.forEach(([turn, example, expected, red, green, decision, color], index) => {
    const y = 3.94 + index * 0.7;
    rect(slide, M, y, CW, 0.6, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.06, 0.6, color);
    [turn, example, expected, red, green, decision].forEach((value, col) => {
      addText(slide, value, {
        x: xs[col] + (col === 0 ? 0.12 : 0.08),
        y: y + 0.13,
        w: ws[col] - 0.16,
        h: 0.3,
        fontFace: col >= 1 && col <= 4 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
        fontSize: col === 4 ? 9.2 : 10.2,
        bold: col === 0 || col === 2,
        color: col === 0 ? color : C.ink,
        align: col === 0 ? "center" : "left",
        valign: "mid",
      });
    });
  });

  addTakeaway(slide, "Los ejemplos no confirman una fórmula elegida de antemano. Cada rojo obliga a revisar la versión actual.", {
    y: 6.28,
    h: 0.54,
    fontSize: 13.1,
  });
  addFuente(slide, 6.85, "Kent Beck · Equality for All · triangulación mediante ejemplos que exigen respuestas distintas", {
    w: 10.8,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 28 · Vuelta 2

function slideTurnTwo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · vuelta 2",
    "El límite exacto vuelve roja la constante False",
    "Treinta personas ocupan exactamente treinta cupos. Este caso debe aceptarse y contradice la respuesta constante de la primera vuelta.",
    false,
    { subtitleW: 11.4, subtitleH: 0.56 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 5.8,
    h: 1.62,
    title: "Nueva prueba · escrita antes del cambio",
    code: [
      "def test_acepta_reserva_que_ocupa_el_cupo_exacto():",
      "    assert cabe_en_sala(personas=30, capacidad=30) is True",
    ].join("\n"),
    lang: "python",
    fontSize: 9.6,
  });
  addTerminalPanel(slide, SH, {
    x: 6.78,
    y: 2.54,
    w: 5.83,
    h: 1.62,
    title: "Rojo esperado con return False",
    fontSize: 9.3,
    lines: [
      { text: ".F                                             [100%]", kind: "error" },
      { text: "E   assert False is True", kind: "error" },
      { text: "1 failed, 1 passed", kind: "muted" },
    ],
  });

  rect(slide, M, 4.48, 3.2, 1.16, C.softNeutral);
  addKicker(slide, M + 0.28, 4.68, "La constante ya no alcanza", ROJO, 2.6);
  addText(slide, "La primera prueba sigue verde. La nueva localiza lo que falta: aceptar la igualdad.", {
    x: M + 0.28,
    y: 5.0,
    w: 2.66,
    h: 0.42,
    fontSize: 11,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });

  addCodePanel(slide, SH, {
    x: 4.18,
    y: 4.48,
    w: 4.82,
    h: 1.16,
    title: "Generalización autorizada por dos ejemplos",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return personas <= capacidad",
    ].join("\n"),
    lang: "python",
    fontSize: 9.3,
  });
  addTerminalPanel(slide, SH, {
    x: 9.28,
    y: 4.48,
    w: 3.33,
    h: 1.16,
    title: "Nuevo verde",
    fontSize: 9.5,
    lines: [
      { text: "..                [100%]", kind: "success" },
      { text: "2 passed", kind: "success" },
    ],
  });

  addTakeaway(slide, "El operador <= expresa una decisión concreta: la igualdad pertenece al lado aceptado de la frontera.", {
    y: 5.98,
    h: 0.58,
    fontSize: 13.2,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 29 · Vuelta 3

function slideTurnThree() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · vuelta 3",
    "Cero personas revela una generalización incompleta",
    "La comparación personas <= capacidad también acepta cero. La tercera prueba introduce el mínimo válido de la regla de negocio: una reserva requiere al menos una persona.",
    false,
    { subtitleW: 11.4, subtitleH: 0.6 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 5.74,
    h: 1.52,
    title: "Nueva prueba",
    code: [
      "def test_rechaza_reserva_sin_personas():",
      "    assert cabe_en_sala(personas=0, capacidad=30) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 9.7,
  });
  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.28,
    w: 5.74,
    h: 1.38,
    title: "Rojo que expone el defecto",
    fontSize: 9.2,
    lines: [
      { text: "..F                                            [100%]", kind: "error" },
      { text: "E   assert True is False", kind: "error" },
      { text: "1 failed, 2 passed", kind: "muted" },
    ],
  });

  rect(slide, 6.78, 2.56, 5.83, 0.76, C.softNeutral);
  addText(slide, "Regla anterior", {
    x: 7.06,
    y: 2.76,
    w: 1.46,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.slate,
  });
  addText(slide, "personas <= capacidad", {
    x: 8.54,
    y: 2.72,
    w: 3.72,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 12,
    bold: true,
    color: ROJO,
    align: "center",
  });

  // Frontera numérica: 0 queda fuera; 1 y 30 dentro; 31 fuera.
  rule(slide, 7.16, 3.92, 4.92, C.slate, 1.4);
  const points = [
    [7.16, "0", false, ROJO],
    [8.34, "1", true, VERDE],
    [10.82, "30", true, VERDE],
    [12.08, "31", false, ROJO],
  ];
  points.forEach(([x, label, accepted, color]) => {
    slide.addShape(SH.ellipse, {
      x: x - 0.1,
      y: 3.82,
      w: 0.2,
      h: 0.2,
      fill: { color },
      line: { color, pt: 0 },
    });
    addText(slide, label, {
      x: x - 0.24,
      y: 4.1,
      w: 0.48,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.5,
      bold: true,
      color,
      align: "center",
    });
    addText(slide, accepted ? "aceptado" : "rechazado", {
      x: x - 0.46,
      y: 4.38,
      w: 0.92,
      h: 0.2,
      fontSize: 8.2,
      color,
      align: "center",
    });
  });

  addCodePanel(slide, SH, {
    x: 6.78,
    y: 4.86,
    w: 5.83,
    h: 1.16,
    title: "Cambio mínimo · dos límites explícitos",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return 1 <= personas <= capacidad",
    ].join("\n"),
    lang: "python",
    fontSize: 9.4,
  });

  addTakeaway(slide, "La tercera vuelta termina con 3 passed: las tres decisiones quedan separadas y localizables.", {
    y: 6.3,
    h: 0.5,
    fontSize: 13,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 30 · Código final y diseño emergente

function slideEmergentDesign() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · resultado acumulado",
    "El código final conserva la historia de tres decisiones",
    "Diseño emergente significa que la forma del código se decidió cuando los ejemplos volvieron necesarias nuevas respuestas. No significa diseño automático ni improvisación.",
    false,
    { titleFontSize: 28, subtitleW: 11.35, subtitleH: 0.62 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.18,
    h: 3.34,
    title: "tests/test_capacidad.py · tres decisiones localizables",
    code: [
      "from capacidad import cabe_en_sala",
      "",
      "",
      "def test_rechaza_reserva_que_supera_el_cupo():",
      "    assert cabe_en_sala(personas=31, capacidad=30) is False",
      "",
      "",
      "def test_acepta_reserva_que_ocupa_el_cupo_exacto():",
      "    assert cabe_en_sala(personas=30, capacidad=30) is True",
      "",
      "",
      "def test_rechaza_reserva_sin_personas():",
      "    assert cabe_en_sala(personas=0, capacidad=30) is False",
    ].join("\n"),
    lang: "python",
    fontSize: 7.9,
  });

  addCodePanel(slide, SH, {
    x: 8.18,
    y: 2.56,
    w: 4.43,
    h: 1.32,
    title: "capacidad.py · implementación completa",
    code: [
      "def cabe_en_sala(personas: int, capacidad: int) -> bool:",
      "    return 1 <= personas <= capacidad",
    ].join("\n"),
    lang: "python",
    fontSize: 8.6,
  });

  const decisions = [
    ["Interfaz", "cabe_en_sala(personas, capacidad) → bool", AZUL],
    ["Frontera superior", "30 se acepta; 31 se rechaza", ORO],
    ["Frontera inferior", "0 se rechaza; el mínimo válido es 1", VERDE],
  ];
  decisions.forEach(([label, textValue, color], index) => {
    const y = 4.08 + index * 0.58;
    rect(slide, 8.18, y, 4.43, 0.5, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, 8.18, y, 0.05, 0.5, color);
    addText(slide, label.toUpperCase(), {
      x: 8.42,
      y: y + 0.08,
      w: 1.38,
      h: 0.18,
      fontSize: 8.2,
      bold: true,
      color,
      charSpacing: 0.7,
    });
    addText(slide, textValue, {
      x: 9.82,
      y: y + 0.08,
      w: 2.5,
      h: 0.28,
      fontSize: 9.8,
      color: C.ink,
      valign: "mid",
    });
  });

  rect(slide, M, 6.16, CW, 0.62, C.navy);
  addText(slide, "Agente", {
    x: M + 0.3,
    y: 6.34,
    w: 0.9,
    h: 0.24,
    fontSize: 10.6,
    bold: true,
    color: C.gold,
  });
  addText(slide, "edita, ejecuta y reporta", {
    x: M + 1.24,
    y: 6.34,
    w: 2.32,
    h: 0.24,
    fontSize: 11.2,
    color: C.white,
  });
  addText(slide, "Persona", {
    x: M + 4.04,
    y: 6.34,
    w: 1.0,
    h: 0.24,
    fontSize: 10.6,
    bold: true,
    color: C.gold,
  });
  addText(slide, "elige el siguiente comportamiento y juzga si la evidencia realmente lo demuestra", {
    x: M + 5.1,
    y: 6.29,
    w: 6.36,
    h: 0.34,
    fontSize: 11,
    color: C.white,
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 31 · Cobertura y sensibilidad

function slideCoverageSensitivity() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 3 · evidencia posterior",
    "Cobertura y sensibilidad responden preguntas distintas",
    "La cobertura se mide después de completar las vueltas. Registra qué código se ejecutó. Las alteraciones controladas muestran qué decisiones equivocadas hacen fallar la suite.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.62 }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.15,
    h: 2.3,
    title: "Cobertura después de las tres vueltas",
    fontSize: 8.7,
    lines: [
      { prompt: ">", text: "uv run --with pytest --with pytest-cov python -m pytest --cov=capacidad --cov-report=term-missing -q" },
      { text: "...                                                  [100%]", kind: "success" },
      { text: "Name           Stmts   Miss  Cover", kind: "muted" },
      { text: "capacidad.py       2      0   100%", kind: "success" },
      { text: "TOTAL              2      0   100%", kind: "success" },
      { text: "3 passed", kind: "success" },
    ],
  });

  addDefinition(slide, 8.14, 2.56, 4.47, 1.02, "Cobertura", "Proporción del código que se ejecutó mientras corrieron las pruebas. No evalúa por sí sola si los resultados son correctos.", ORO);
  addDefinition(slide, 8.14, 3.78, 4.47, 1.08, "Alteración controlada", "Cambio temporal y deliberado del código para comprobar qué prueba reacciona. Después se restaura la implementación correcta.", ROJO);

  const mutations = [
    ["1 <= personas < capacidad", "Falla el caso 30/30", "False is True", ORO],
    ["0 <= personas <= capacidad", "Falla el caso 0/30", "True is False", ROJO],
  ];
  mutations.forEach(([change, test, result, color], index) => {
    const y = 5.18 + index * 0.55;
    rect(slide, M, y, CW, 0.46, index % 2 === 0 ? C.white : C.softNeutral);
    rect(slide, M, y, 0.05, 0.46, color);
    addText(slide, change, {
      x: M + 0.24,
      y: y + 0.09,
      w: 3.2,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.1,
      bold: true,
      color: C.ink,
    });
    addText(slide, test, {
      x: M + 3.58,
      y: y + 0.09,
      w: 4.1,
      h: 0.24,
      fontSize: 10.6,
      color: C.slate,
    });
    addText(slide, result, {
      x: M + 8.02,
      y: y + 0.08,
      w: 3.48,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.4,
      bold: true,
      color,
      align: "right",
    });
  });

  addTakeaway(slide, "La cobertura indica dónde se ejecutó. Los rojos indican qué decisiones puede vigilar la suite.", {
    y: 6.36,
    h: 0.48,
    fontSize: 13,
  });
  addFuente(slide, 6.87, "Coverage.py · documentación oficial y How coverage.py works", {
    w: 9.2,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 32–33 · Preguntas y respuestas del bloque 3

function slideBlockThreeQuestions() {
  slideQuestions(3, "Tres preguntas antes de cambiar de lenguaje", [
    [
      "¿Por qué 30/30 aporta más información que repetir otro sobrecupo como 40/30?",
      "Identifica cuál de los dos ejemplos obliga a abandonar la constante return False.",
    ],
    [
      "¿Qué defecto conserva personas <= capacidad aunque las dos primeras pruebas pasen?",
      "Prueba mentalmente el valor inmediatamente anterior al mínimo válido.",
    ],
    [
      "¿Por qué 100 % de cobertura no vuelve innecesaria una alteración controlada?",
      "Cobertura registra ejecución; la alteración pregunta si una decisión equivocada sería detectada.",
    ],
  ]);
}

function slideBlockThreeAnswers() {
  slideAnswers(3, "Lo que tenía que aparecer", [
    [
      "30/30 exige una respuesta distinta",
      "return False también rechaza 40/30, así que ese caso no cambia el código. En cambio, 30/30 debe ser True y rompe la constante.",
      "Un ejemplo informa más cuando contradice la implementación actual.",
      "«Más datos siempre significan más información.»",
    ],
    [
      "Acepta cero personas",
      "La comparación considera válido cualquier número menor o igual que la capacidad. Sin un límite inferior, 0/30 produce True.",
      "La tercera prueba agrega una decisión de la regla de negocio que la fórmula anterior no expresaba.",
      "«Si cubre el máximo, la regla ya está completa.»",
    ],
    [
      "Ejecución y sensibilidad no son equivalentes",
      "El 100 % confirma que se ejecutaron las dos sentencias. La alteración comprueba si una decisión incorrecta provoca un rojo.",
      "Una suite puede recorrer una línea sin vigilar todas las decisiones que contiene.",
      "«100 % de cobertura demuestra corrección.»",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 34 · Separador del bloque 4

function slideBlockFourDivider() {
  const { slide } = createSlide("dark");
  addKicker(slide, M, 1.54, "Bloque 4 de 4 · 25 minutos", C.gold, 5.2);
  addText(slide, "El método cambia de idioma, no de disciplina", {
    x: M,
    y: 1.98,
    w: 11.2,
    h: 1.14,
    fontFace: TYPOGRAPHY.display,
    fontSize: 39,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  rule(slide, M, 3.32, 3.62, C.red, 2.6);
  addText(slide, "Vitest permite repetir rojo–verde–refactor en TypeScript. Después aparece una pregunta distinta: ¿qué demuestra una entrega si prueba y código llegaron juntos y ya estaban verdes?", {
    x: M,
    y: 3.58,
    w: 10.8,
    h: 0.76,
    fontSize: 16.5,
    italic: true,
    color: C.softBlue,
    lineSpacingMultiple: 1.16,
  });

  const ideas = [
    ["1", "Transferir", "Reconocer el mismo ciclo detrás de otra sintaxis.", C.red],
    ["2", "Ejecutar", "Leer un rojo y producir el verde mínimo con Vitest.", C.gold],
    ["3", "Auditar", "Separar sensibilidad actual de historia del proceso.", C.success],
  ];
  ideas.forEach(([number, title, body, color], index) => {
    const x = M + index * 4.12;
    rect(slide, x, 5.0, 3.72, 1.12, NAVY_CHIP);
    addText(slide, number, {
      x: x + 0.18,
      y: 5.29,
      w: 0.44,
      h: 0.42,
      fontFace: TYPOGRAPHY.display,
      fontSize: 23,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: x + 0.78,
      y: 5.17,
      w: 2.62,
      h: 0.24,
      fontSize: 12,
      bold: true,
      color: C.white,
    });
    addText(slide, body, {
      x: x + 0.78,
      y: 5.48,
      w: 2.68,
      h: 0.42,
      fontSize: 9.7,
      color: C.sand,
      lineSpacingMultiple: 1.1,
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 35 · Equivalencias entre pytest y Vitest

function slideToolEquivalence() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · transferencia",
    "Runner distinto; preguntas del ciclo intactas",
    "Un ejecutor de pruebas —también llamado runner— descubre casos, los ejecuta y reporta resultados. pytest y Vitest cambian la sintaxis y el comando, pero no el orden de razonamiento.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.62 }
  );

  const columns = [M, M + 3.0, M + 6.14];
  const widths = [2.72, 2.86, 5.75];
  ["PYTEST · PYTHON", "VITEST · TYPESCRIPT", "FUNCIÓN EN EL PROCESO"].forEach((header, index) => {
    rect(slide, columns[index], 2.5, widths[index], 0.46, index === 2 ? C.navy : NAVY_RULE);
    addText(slide, header, {
      x: columns[index] + 0.16,
      y: 2.63,
      w: widths[index] - 0.32,
      h: 0.18,
      fontSize: 8.7,
      bold: true,
      color: C.white,
      charSpacing: 0.7,
      align: index === 2 ? "left" : "center",
    });
  });
  const rows = [
    ["test_*", "it(...) o test(...)", "Declara un caso ejecutable y le asigna un nombre."],
    ["test_*.py", "*.test.ts o *.spec.ts", "Permite que el runner descubra el archivo de pruebas."],
    ["assert ... is True", "expect(...).toBe(true)", "Compara el valor observado con el valor esperado."],
    ["python -m pytest -q", "npm test", "Ejecuta la suite preparada y termina con un resultado."],
  ];
  rows.forEach((row, rowIndex) => {
    const y = 3.02 + rowIndex * 0.68;
    rect(slide, M, y, CW, 0.58, rowIndex % 2 === 0 ? C.white : C.softNeutral);
    row.forEach((value, colIndex) => {
      addText(slide, value, {
        x: columns[colIndex] + 0.16,
        y: y + 0.12,
        w: widths[colIndex] - 0.32,
        h: 0.3,
        fontFace: colIndex < 2 ? TYPOGRAPHY.mono : TYPOGRAPHY.body,
        fontSize: colIndex < 2 ? 9.7 : 10.6,
        bold: colIndex === 1,
        color: colIndex === 1 ? AZUL : C.ink,
        valign: "mid",
      });
    });
  });

  rect(slide, M, 5.92, 0.06, 0.82, ROJO);
  rule(slide, M, 5.92, CW, C.border, 0.8);
  rule(slide, M, 6.74, CW, C.border, 0.8);
  addText(slide, "NO CONFUNDIR", {
    x: M + 0.28,
    y: 6.16,
    w: 1.28,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color: ROJO,
    charSpacing: 1.0,
  });
  addText(slide, "Vitest transforma TypeScript para ejecutar las pruebas, pero eso no equivale al tipado estático: comprobar sin ejecutar que los tipos declarados sean coherentes. Son controles diferentes.", {
    x: M + 1.7,
    y: 6.08,
    w: 10.7,
    h: 0.46,
    fontSize: 10.7,
    color: C.ink,
    lineSpacingMultiple: 1.1,
  });
  addFuente(slide, 6.85, "Vitest · Getting Started, Writing Tests, Test API y Expect API", { w: 9.5 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 36 · Una vuelta rojo-verde-refactor en Vitest

function slideVitestCycle() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · una vuelta en Vitest",
    "El límite exacto produce el mismo aprendizaje en TypeScript",
    "La implementación inicial devuelve false. Primero se expresa que 30 personas sí caben en una sala de capacidad 30; después se observa el rojo y se cambia lo mínimo.",
    false,
    { titleFontSize: 27, subtitleW: 11.4, subtitleH: 0.64 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 5.95,
    h: 2.05,
    title: "1 · capacidad.test.ts · expectativa primero",
    code: [
      "import { describe, expect, it } from 'vitest'",
      "import { cabeEnSala } from './capacidad'",
      "",
      "describe('cabeEnSala', () => {",
      "  it('acepta una reserva que ocupa el cupo exacto', () => {",
      "    expect(cabeEnSala(30, 30)).toBe(true)",
      "  })",
      "})",
    ].join("\n"),
    lang: "typescript",
    fontSize: 7.8,
  });
  addTerminalPanel(slide, SH, {
    x: 6.94,
    y: 2.56,
    w: 5.67,
    h: 2.05,
    title: "2 · rojo leído · la causa coincide",
    fontSize: 8.5,
    lines: [
      { prompt: ">", text: "npm test -- --reporter=verbose" },
      { text: "× acepta una reserva que ocupa el cupo exacto", kind: "error" },
      { text: "  expected false to be true", kind: "error" },
      { text: "Test Files  1 failed (1)", kind: "muted" },
      { text: "Tests       1 failed (1)", kind: "muted" },
    ],
  });

  addCodePanel(slide, SH, {
    x: M,
    y: 4.86,
    w: 6.4,
    h: 1.16,
    title: "3 · capacidad.ts · cambio mínimo",
    code: [
      "export function cabeEnSala(personas: number, capacidad: number): boolean {",
      "  return personas <= capacidad",
      "}",
    ].join("\n"),
    lang: "typescript",
    fontSize: 8.4,
  });
  addTerminalPanel(slide, SH, {
    x: 7.38,
    y: 4.86,
    w: 5.23,
    h: 1.16,
    title: "4 · verde comprobado",
    fontSize: 9.2,
    lines: [
      { text: "✓ acepta una reserva que ocupa el cupo exacto", kind: "success" },
      { text: "1 passed", kind: "success" },
    ],
  });

  addTakeaway(slide, "Refactor: no hay una mejora estructural necesaria en esta función de una línea. Inspeccionar y no cambiar también completa la fase.", {
    y: 6.28,
    h: 0.52,
    fontSize: 12.5,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 37 · El verde conjunto no prueba el orden histórico

function slideGreenDeliveryAudit() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · entrega agéntica",
    "Prueba y código en verde muestran compatibilidad, no historia",
    "Una entrega agéntica es un cambio producido total o parcialmente por un agente de software. Si los archivos llegan juntos, el estado final no revela por sí solo qué existió primero.",
    false,
    { titleFontSize: 27, subtitleW: 11.45, subtitleH: 0.66 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.58,
    w: 6.16,
    h: 1.58,
    title: "Implementación recibida",
    code: [
      "export function cabeEnSala(personas: number, capacidad: number): boolean {",
      "  return 1 <= personas && personas <= capacidad",
      "}",
    ].join("\n"),
    lang: "typescript",
    fontSize: 8.1,
  });
  addTerminalPanel(slide, SH, {
    x: 7.16,
    y: 2.58,
    w: 5.45,
    h: 1.58,
    title: "Suite recibida",
    fontSize: 9.4,
    lines: [
      { text: "Test Files  1 passed (1)", kind: "success" },
      { text: "Tests       3 passed (3)", kind: "success" },
    ],
  });

  const claims = [
    ["SÍ demuestra", "El código actual satisface las expectativas que la suite ejecutó.", VERDE],
    ["NO demuestra", "Que las pruebas puedan rechazar cada defecto relevante.", ROJO],
    ["NO demuestra", "Que la prueba existiera y fallara antes de implementar.", ROJO],
    ["NO demuestra", "Que las expectativas representen correctamente el requisito.", ROJO],
  ];
  claims.forEach(([label, body, color], index) => {
    const x = index % 2 === 0 ? M : 6.82;
    const y = 4.48 + Math.floor(index / 2) * 0.76;
    rect(slide, x, y, 5.79, 0.64, index === 0 ? C.successSoft : C.warm);
    rect(slide, x, y, 0.06, 0.64, color);
    addText(slide, label.toUpperCase(), {
      x: x + 0.26,
      y: y + 0.12,
      w: 1.34,
      h: 0.18,
      fontSize: 8.3,
      bold: true,
      color,
      charSpacing: 0.8,
    });
    addText(slide, body, {
      x: x + 1.64,
      y: y + 0.1,
      w: 3.88,
      h: 0.38,
      fontSize: 10.5,
      color: C.ink,
      valign: "mid",
      lineSpacingMultiple: 1.08,
    });
  });
  addTakeaway(slide, "Estado actual: qué coincide ahora. Historia del proceso: en qué orden se produjo y qué evidencia se observó en cada paso.", {
    y: 6.2,
    h: 0.56,
    fontSize: 12.8,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 38 · Alteración dirigida de una entrega recibida

function slideDirectedMutation() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · auditoría",
    "Una alteración dirigida reconstruye sensibilidad actual",
    "Alterar significa introducir temporalmente una decisión defectuosa sin tocar las pruebas. El objetivo es comprobar qué expectativas pueden detectar ese defecto concreto.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.62 }
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 5.62,
    h: 1.32,
    title: "Cambio temporal · deliberadamente incorrecto",
    code: [
      "export function cabeEnSala(personas: number, capacidad: number): boolean {",
      "  return true",
      "}",
    ].join("\n"),
    lang: "typescript",
    fontSize: 8.2,
  });
  addTerminalPanel(slide, SH, {
    x: 6.62,
    y: 2.54,
    w: 5.99,
    h: 2.24,
    title: "La suite reacciona de forma localizada",
    fontSize: 8.4,
    lines: [
      { text: "× rechaza una reserva que supera el cupo", kind: "error" },
      { text: "  expected true to be false", kind: "error" },
      { text: "✓ acepta una reserva que ocupa el cupo exacto", kind: "success" },
      { text: "× rechaza una reserva sin personas", kind: "error" },
      { text: "  expected true to be false", kind: "error" },
      { text: "2 failed | 1 passed", kind: "muted" },
    ],
  });

  const steps = [
    ["1", "Línea base", "Ejecutar sin modificar: 3 passed.", AZUL],
    ["2", "Alterar", "Cambiar solo producción: return true.", ROJO],
    ["3", "Exigir rojo", "Identificar qué decisión vigila cada fallo.", ORO],
    ["4", "Restaurar", "Eliminar el cambio y recuperar 3 passed.", VERDE],
  ];
  steps.forEach(([number, title, body, color], index) => {
    addStep(slide, M + index * 3.06, 5.1, 2.78, number, title, body, color, { h: 0.94 });
  });
  addTakeaway(slide, "La prueba 30/30 queda verde porque return true todavía satisface ese caso. Una alteración solo debe afectar las expectativas que contradice.", {
    y: 6.26,
    h: 0.54,
    fontSize: 12.5,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 39 · Evidencia recuperable y evidencia histórica

function slideRecoverableEvidence() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · alcance de la auditoría",
    "La auditoría recupera sensibilidad; no reescribe el pasado",
    "Conviene separar lo que puede medirse ahora de lo que depende de registros creados durante el trabajo.",
    false,
    { titleFontSize: 28, subtitleW: 11.2, subtitleH: 0.46 }
  );

  const xCols = [M, M + 6.12, M + 8.46];
  const wCols = [5.84, 2.1, 4.15];
  ["EVIDENCIA", "¿DESPUÉS?", "ALCANCE PRECISO"].forEach((header, index) => {
    rect(slide, xCols[index], 2.36, wCols[index], 0.46, C.navy);
    addText(slide, header, {
      x: xCols[index] + 0.16,
      y: 2.49,
      w: wCols[index] - 0.32,
      h: 0.18,
      fontSize: 8.6,
      bold: true,
      color: C.white,
      charSpacing: 0.75,
      align: index === 1 ? "center" : "left",
    });
  });
  const rows = [
    ["La suite recibida está verde", "Sí", "Código y pruebas actuales coinciden", VERDE],
    ["Las pruebas reaccionan a alteraciones elegidas", "Sí", "Sensibilidad frente a esos defectos", VERDE],
    ["El requisito elegido es correcto", "No automática", "Exige criterio de producto o del área del problema", ORO],
    ["La prueba existió antes que el código", "No sin registro", "Es historia del proceso", ROJO],
    ["La prueba influyó en el diseño", "No después", "Debe observarse o registrarse la secuencia", ROJO],
    ["La suite detectará cualquier defecto futuro", "No", "Ninguna suite finita ofrece esa garantía", ROJO],
  ];
  rows.forEach(([evidence, later, scope, color], index) => {
    const y = 2.88 + index * 0.57;
    rect(slide, M, y, 0.05, 0.49, color);
    rule(slide, M, y + 0.49, CW, C.border, 0.55);
    [evidence, later, scope].forEach((value, colIndex) => {
      addText(slide, value, {
        x: xCols[colIndex] + 0.18,
        y: y + 0.1,
        w: wCols[colIndex] - 0.36,
        h: 0.27,
        fontSize: colIndex === 1 ? 9.4 : 10.1,
        bold: colIndex === 1,
        color: colIndex === 1 ? color : C.ink,
        align: colIndex === 1 ? "center" : "left",
        valign: "mid",
      });
    });
  });
  addTakeaway(slide, "Para preservar el orden: commits separados, salidas de ejecución o un agente obligado a detenerse y reportar después del rojo.", {
    y: 6.42,
    h: 0.44,
    fontSize: 12.5,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 40 · TDD con agentes y responsabilidad humana

function slideAgentsAndJudgment() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Bloque 4 · criterio",
    "Un agente acelera el ciclo; no decide qué evidencia basta",
    "La ingeniería agéntica combina intención explícita, tareas pequeñas, fuentes de verdad accesibles y validaciones ejecutables. La velocidad no convierte una expectativa en requisito correcto.",
    false,
    { titleFontSize: 28, subtitleW: 11.4, subtitleH: 0.64 }
  );

  const stages = [
    ["Persona", "Define el comportamiento esperado y sus límites.", ROJO],
    ["Agente", "Escribe, ejecuta, informa y conserva artefactos.", AZUL],
    ["Repositorio", "Registra código, pruebas, comandos e historial.", ORO],
    ["Persona", "Juzga si el rojo, el verde y el alcance son suficientes.", VERDE],
  ];
  stages.forEach(([owner, body, color], index) => {
    const x = M + index * 3.06;
    rect(slide, x, 2.68, 2.76, 1.5, C.white);
    rect(slide, x, 2.68, 2.76, 0.07, color);
    addText(slide, owner.toUpperCase(), {
      x: x + 0.24,
      y: 2.94,
      w: 2.28,
      h: 0.2,
      fontSize: 9.4,
      bold: true,
      color,
      charSpacing: 1.0,
      align: "center",
    });
    addText(slide, body, {
      x: x + 0.24,
      y: 3.31,
      w: 2.28,
      h: 0.58,
      fontSize: 10.6,
      color: C.ink,
      align: "center",
      valign: "mid",
      lineSpacingMultiple: 1.12,
    });
    if (index < stages.length - 1) arrow(slide, x + 2.78, 3.42, 0.24, C.slate, 1.4);
  });

  rect(slide, M, 4.56, CW, 1.18, C.softNeutral);
  addKicker(slide, M + 0.3, 4.78, "TDD es una práctica contextual, no una etiqueta obligatoria", AZUL, 5.8);
  addText(slide, "También son legítimas las pruebas escritas después, las pruebas exploratorias, las pruebas de integración y las pruebas de extremo a extremo (E2E). Lo importante es nombrar con precisión qué evidencia produjo cada proceso.", {
    x: M + 0.3,
    y: 5.1,
    w: 11.52,
    h: 0.42,
    fontSize: 11.3,
    color: C.ink,
    lineSpacingMultiple: 1.12,
  });
  addTakeaway(slide, "Delegar la ejecución no delega la responsabilidad sobre el requisito ni sobre la interpretación de los resultados.", {
    y: 6.04,
    h: 0.56,
    fontSize: 12.8,
  });
  addFuente(slide, 6.85, "OpenAI · Harness engineering (2026); Fowler · Is TDD Dead?; Hansson · TDD is dead. Long live testing.", { w: 10.7 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 41–42 · Preguntas y respuestas del bloque 4

function slideBlockFourQuestions() {
  slideQuestions(4, "Tres preguntas antes de cerrar la clase", [
    [
      "¿Qué cambió al pasar de pytest a Vitest y qué parte del método permaneció intacta?",
      "Separa sintaxis, archivos y comandos del orden rojo–verde–refactor.",
    ],
    [
      "¿Por qué tres pruebas verdes generadas junto al código no demuestran que hubo TDD?",
      "Distingue el estado actual de los archivos del orden histórico en que se produjeron.",
    ],
    [
      "¿Por qué 30/30 continúa verde cuando la implementación temporal es return true?",
      "Pregunta si esa alteración contradice específicamente la expectativa del caso 30/30.",
    ],
  ]);
}

function slideBlockFourAnswers() {
  slideAnswers(4, "Lo que tenía que aparecer", [
    [
      "Cambió la herramienta; no el orden",
      "Cambian la sintaxis, el descubrimiento y el comando. Se conserva expresar una expectativa, observar el rojo, cambiar lo mínimo, comprobar verde y revisar estructura.",
      "El ciclo es transferible entre lenguajes y runners.",
      "«Vitest aplica un TDD diferente.»",
    ],
    [
      "El verde no contiene la historia",
      "El resultado prueba compatibilidad actual entre código y pruebas. Sin commits, salidas u otro registro, no revela cuál existió primero ni si se observó un rojo.",
      "TDD describe un proceso verificable, no solo un estado final.",
      "«Si hay tests, entonces hubo TDD.»",
    ],
    [
      "La alteración no contradice ese caso",
      "30/30 espera true y return true todavía lo entrega. Fallan los casos que esperaban false: sobrecupo y cero personas.",
      "Una prueba sensible no tiene que fallar ante defectos ajenos a su decisión.",
      "«Toda alteración debe hacer fallar toda la suite.»",
    ],
  ]);
}

// ---------------------------------------------------------------------------
// 43 · Cierre: matriz de afirmaciones válidas

function slideEvidenceClaims() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · síntesis verificable",
    "Cada evidencia autoriza una afirmación y limita otras",
    "Una conclusión técnica es precisa cuando no promete más de lo que el proceso observó.",
    false,
    { titleFontSize: 28, subtitleW: 11.2, subtitleH: 0.4 }
  );

  const xCols = [M, M + 4.1, M + 8.37];
  const wCols = [3.84, 4.01, 4.24];
  ["EVIDENCIA OBSERVADA", "SÍ PERMITE AFIRMAR", "TODAVÍA NO PERMITE AFIRMAR"].forEach((header, index) => {
    rect(slide, xCols[index], 2.32, wCols[index], 0.52, index === 2 ? ROJO : C.navy);
    addText(slide, header, {
      x: xCols[index] + 0.14,
      y: 2.47,
      w: wCols[index] - 0.28,
      h: 0.19,
      fontSize: 8.4,
      bold: true,
      color: C.white,
      charSpacing: 0.65,
      align: "center",
    });
  });
  const rows = [
    ["Rojo por la razón esperada", "Detecta el estado sin el comportamiento", "Que cubre todos los defectos"],
    ["Cambio mínimo → verde", "El ejemplo actual quedó satisfecho", "Que el producto completo es correcto"],
    ["Verde durante el refactor", "Los casos cubiertos no cambiaron", "Que toda conducta externa es idéntica"],
    ["100 % de cobertura", "Se ejecutaron las sentencias medidas", "Que todas las decisiones fueron probadas"],
    ["Alteración dirigida → rojo", "Hay sensibilidad a ese defecto", "Que la prueba fue escrita primero"],
    ["Historial conserva rojo antes", "Existe evidencia del orden registrado", "Que la expectativa sea el requisito correcto"],
  ];
  rows.forEach((row, rowIndex) => {
    const y = 2.92 + rowIndex * 0.57;
    rule(slide, M, y + 0.49, CW, C.border, 0.55);
    row.forEach((value, colIndex) => {
      addText(slide, value, {
        x: xCols[colIndex] + 0.16,
        y: y + 0.08,
        w: wCols[colIndex] - 0.32,
        h: 0.31,
        fontSize: 9.6,
        bold: colIndex === 0,
        color: colIndex === 2 ? ROJO : C.ink,
        align: "left",
        valign: "mid",
        lineSpacingMultiple: 1.06,
      });
    });
  });
  addTakeaway(slide, "La frase «todo funciona» excede la evidencia. Una conclusión válida nombra el caso, la salida observada y el límite que permanece abierto.", {
    y: 6.42,
    h: 0.44,
    fontSize: 12.1,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 44 · Cierre: cadena completa y responsabilidades

function slideCompleteChain() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "Cierre · mapa de la clase",
    "La cadena comienza y termina con criterio humano",
    "Las herramientas ejecutan y registran. La persona decide qué comportamiento importa y si la evidencia alcanza.",
    true,
    { titleFontSize: 29, subtitleW: 11.3, subtitleH: 0.52 }
  );

  const stages = [
    ["1", "Criterio humano", "Define la decisión de la regla de negocio", C.red],
    ["2", "Ejemplo ejecutable", "Convierte la decisión en una expectativa", C.gold],
    ["3", "Rojo esperado", "Demuestra que falta ese comportamiento", C.red],
    ["4", "Verde mínimo", "Satisface el ejemplo sin anticiparse", C.success],
    ["5", "Refactor", "Mejora estructura con la suite verde", C.gold],
    ["6", "Siguiente ejemplo", "Busca la próxima decisión no expresada", C.softBlue],
  ];
  stages.forEach(([number, title, body, color], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = M + col * 4.12;
    const y = 2.58 + row * 1.52;
    rect(slide, x, y, 3.72, 1.14, NAVY_CHIP);
    addText(slide, number, {
      x: x + 0.2,
      y: y + 0.29,
      w: 0.48,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 23,
      bold: true,
      color,
      align: "center",
      valign: "mid",
    });
    addText(slide, title, {
      x: x + 0.84,
      y: y + 0.2,
      w: 2.56,
      h: 0.25,
      fontSize: 11.8,
      bold: true,
      color: C.white,
    });
    addText(slide, body, {
      x: x + 0.84,
      y: y + 0.53,
      w: 2.54,
      h: 0.36,
      fontSize: 9.7,
      color: C.sand,
      lineSpacingMultiple: 1.08,
    });
    if (col < 2) arrow(slide, x + 3.74, y + 0.57, 0.28, C.softBlue, 1.4);
  });

  rect(slide, M, 5.86, CW, 0.72, NAVY_RULE);
  addText(slide, "AGENTE", {
    x: M + 0.3,
    y: 6.1,
    w: 0.84,
    h: 0.2,
    fontSize: 9.2,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  addText(slide, "puede editar, ejecutar y reportar", {
    x: M + 1.2,
    y: 6.07,
    w: 3.28,
    h: 0.24,
    fontSize: 11,
    color: C.white,
  });
  addText(slide, "PERSONA", {
    x: M + 5.06,
    y: 6.1,
    w: 0.98,
    h: 0.2,
    fontSize: 9.2,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  addText(slide, "selecciona el comportamiento y juzga el alcance de la evidencia", {
    x: M + 6.14,
    y: 6.03,
    w: 5.44,
    h: 0.32,
    fontSize: 10.8,
    color: C.white,
    valign: "mid",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// 45 · Puente a la próxima clase

function slideNextClassBridge() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre · próxima frontera",
    "Una pieza aislada puede estar verde y fallar al conectarse",
    "Las pruebas de esta clase ejecutaron funciones sin HTTP, base de datos ni estado compartido. Eso entrega retroalimentación rápida, pero no verifica la colaboración entre componentes.",
    false,
    { titleFontSize: 28, subtitleW: 11.45, subtitleH: 0.64 }
  );

  addDefinition(slide, M, 2.62, 3.72, 1.34, "Prueba unitaria", "Comprueba una unidad pequeña de comportamiento de forma rápida y con pocas dependencias reales.", AZUL);
  addDefinition(slide, M + 4.12, 2.62, 3.72, 1.34, "Prueba de integración", "Comprueba que dos o más componentes reales colaboren correctamente a través de sus interfaces.", ORO);
  addDefinition(slide, M + 8.24, 2.62, 3.65, 1.34, "Doble de prueba", "Reemplazo controlado de una dependencia. Ayuda a aislar, pero puede ocultar la colaboración real que interesa.", ROJO);

  rect(slide, M, 4.34, CW, 1.26, C.navy);
  addKicker(slide, M + 0.36, 4.58, "Pregunta de la siguiente clase", C.gold, 4.2);
  addText(slide, "La pieza funciona sola. ¿Qué evidencia demuestra que funciona cuando se conecta con las demás?", {
    x: M + 0.36,
    y: 4.95,
    w: 11.5,
    h: 0.38,
    fontFace: TYPOGRAPHY.display,
    fontSize: 17.2,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  addTakeaway(slide, "Idea final: una buena prueba no elimina la incertidumbre; convierte una parte concreta de ella en evidencia observable.", {
    y: 6.04,
    h: 0.62,
    fontSize: 14.1,
  });
  addFuente(slide, 6.85, "Próxima clase: integración con FastAPI, fixtures, datos y límites de los dobles de prueba", { w: 10.8 });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------------------------------
// Construcción. Los bloques siguientes se agregan en este mismo orden hasta
// cerrar la clase en un máximo de 45 láminas.

slideCover();
slideOpeningQuestion();
slideContinuity();
slidePurpose();
slideMap();

slideBlockOneDivider();
slideTddIsOrder();
slideCycle();
slideRule();
slideTestFirst();
slideRedByAbsence();
slideMakeExecutable();
slideRedByBehavior();
slideAcceptRed();
slideBlockOneQuestions();
slideBlockOneAnswers();

slideBlockTwoDivider();
slideMinimumGreen();
slideReadGreen();
slideGreenStrategies();
slideRefactorDefinition();
slideTestRefactor();
slideRefactorGate();
slideBlockTwoQuestions();
slideBlockTwoAnswers();

slideBlockThreeDivider();
slideTriangulationMap();
slideTurnTwo();
slideTurnThree();
slideEmergentDesign();
slideCoverageSensitivity();
slideBlockThreeQuestions();
slideBlockThreeAnswers();

slideBlockFourDivider();
slideToolEquivalence();
slideVitestCycle();
slideGreenDeliveryAudit();
slideDirectedMutation();
slideRecoverableEvidence();
slideAgentsAndJudgment();
slideBlockFourQuestions();
slideBlockFourAnswers();

slideEvidenceClaims();
slideCompleteChain();
slideNextClassBridge();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`OK ${pptx._slides.length} láminas -> ${outputPptx}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
