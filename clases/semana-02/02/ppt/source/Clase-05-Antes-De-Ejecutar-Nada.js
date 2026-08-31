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
  subject: "PRO402 · Clase 05",
  title: "Antes de ejecutar nada: pruebas estáticas y evidencia de proyecto",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const outputPptx = path.resolve(__dirname, "..", "Clase-05-Antes-De-Ejecutar-Nada.pptx");

const ASSETS = {
  aiep: path.resolve(__dirname, "assets/logo-aiep.svg"),
  aiepDark: path.resolve(__dirname, "assets/logo-aiep-dark.png"),
};

const CYAN = "1F8A9B";
const CYAN_ON_NAVY = "63C6D8";
const CYAN_ON_PAPER = "0E6E7A";

const ACCENT_ON_PAPER = {
  [C.success]: "2E7D4F",
  [C.gold]: "8A6A12",
  [C.red]: "B3181E",
  [CYAN]: CYAN_ON_PAPER,
};

function onPaper(accent) {
  return ACCENT_ON_PAPER[accent] || accent;
}

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

function addCircleLabel(slide, x, y, size, fill, label, opts = {}) {
  slide.addShape(SH.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: { color: opts.outline || fill, pt: opts.outline && opts.outline !== fill ? 1 : 0 },
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

const HEADER_TITLE_Y = 0.82;
const HEADER_TITLE_H = 1.06;
const HEADER_SUBTITLE_Y = 1.94;

function addHeader(slide, label, title, subtitle = "", dark = false, opts = {}) {
  const longTitle = title.length > 54;
  addText(slide, label.toUpperCase(), {
    x: M,
    y: 0.44,
    w: 6.4,
    h: 0.22,
    fontSize: 10.3,
    bold: true,
    color: dark ? C.gold : C.red,
    charSpacing: 1.7,
  });
  addText(slide, title, {
    x: M,
    y: HEADER_TITLE_Y,
    w: opts.titleW || 9.7,
    h: HEADER_TITLE_H,
    fontFace: TYPOGRAPHY.display,
    fontSize: opts.titleFontSize || (longTitle ? 28 : 30),
    bold: true,
    color: dark ? C.white : C.ink,
  });
  if (subtitle) {
    addText(slide, subtitle, {
      x: M,
      y: opts.subtitleY || HEADER_SUBTITLE_Y,
      w: opts.subtitleW || 10.3,
      h: opts.subtitleH || 0.44,
      fontSize: opts.subtitleFontSize || 14.5,
      color: dark ? C.softBlue : C.slate,
    });
  }
}

// ---------------------------------------------------------------- 01 PORTADA
function slidePortada() {
  const { slide } = createSlide("dark");

  addText(slide, "PRO402 · CLASE 05 · UNIDAD 01", {
    x: M,
    y: 1.42,
    w: 8.4,
    h: 0.26,
    fontSize: 11.6,
    bold: true,
    color: C.gold,
    charSpacing: 2.1,
  });

  addText(slide, "Antes de ejecutar nada", {
    x: M,
    y: 1.86,
    w: 10.6,
    h: 1.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 52,
    bold: true,
    color: C.white,
  });

  rect(slide, M, 3.14, 2.6, 0.09, C.red);

  addText(
    slide,
    "Qué cambian las pruebas en un proyecto real, y por qué las primeras no ejecutan el código",
    {
      x: M,
      y: 3.44,
      w: 9.5,
      h: 0.8,
      fontSize: 20,
      color: C.softBlue,
      lineSpacingMultiple: 1.24,
    }
  );

  const meta = [
    ["FECHA", "Lunes 31 de agosto de 2026"],
    ["HORARIO", "08:30 – 10:50 · 140 minutos"],
    ["DOCENTE", "Diego Obando"],
  ];
  meta.forEach(([label, value], i) => {
    const x = M + i * 3.85;
    rect(slide, x, 4.66, 0.34, 0.05, [C.red, CYAN_ON_NAVY, C.gold][i]);
    addText(slide, label, {
      x,
      y: 4.86,
      w: 3.4,
      h: 0.22,
      fontSize: 9.6,
      bold: true,
      color: C.terminalMuted,
      charSpacing: 1.5,
    });
    addText(slide, value, {
      x,
      y: 5.16,
      w: 3.5,
      h: 0.34,
      fontSize: 14.5,
      bold: true,
      color: C.white,
    });
  });

  addText(slide, "Marco de referencia · ISO/IEC/IEEE 29119-1:2022 · pruebas estáticas y dinámicas", {
    x: M,
    y: 6.24,
    w: 10.6,
    h: 0.3,
    fontSize: 12.6,
    color: C.terminalMuted,
  });

  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 02 PUNTO DE PARTIDA
function slidePuntoDePartida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "La clase anterior cerró con algo sin responder",
    "",
    false,
    { titleW: 9.9 }
  );

  addText(slide, "TRES IDEAS QUE YA TENEMOS", {
    x: M,
    y: 2.12,
    w: 4.2,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.slate,
    charSpacing: 1.4,
  });

  const previos = [
    [C.navy, "Verificación", "se responde contra la especificación"],
    [CYAN, "Validación", "se responde contra la necesidad real"],
    [C.red, "Suite en verde", "todas las pruebas automatizadas pasan"],
  ];
  previos.forEach(([accent, titulo, glosa], i) => {
    const y = 2.58 + i * 1.16;
    rect(slide, M, y + 0.04, 0.055, 0.72, onPaper(accent));
    addText(slide, titulo, {
      x: M + 0.28,
      y,
      w: 4.1,
      h: 0.32,
      fontSize: 17,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.28,
      y: y + 0.36,
      w: 4.1,
      h: 0.46,
      fontSize: 13,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    if (i < previos.length - 1) rule(slide, M, y + 0.96, 4.36, C.border, 0.75);
  });

  vrule(slide, 5.68, 2.1, 4.14, C.border, 1);

  addText(slide, "LA PREGUNTA NUEVA", {
    x: 6.16,
    y: 2.12,
    w: 6.2,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.4,
  });

  rect(slide, 6.16, 2.6, 6.45, 2.92, C.warm);
  rect(slide, 6.16, 2.6, 0.08, 2.92, onPaper(C.red));

  addText(
    slide,
    "Si todas las pruebas pasan, pero podrían comprobar una regla equivocada, ¿qué cambia realmente al tenerlas?",
    {
      x: 6.56,
      y: 2.92,
      w: 5.76,
      h: 2.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(
    slide,
    "La respuesta no saldrá de una opinión: observaremos un proyecto real antes y después de fortalecer sus pruebas.",
    {
      x: 6.16,
      y: 5.72,
      w: 6.3,
      h: 0.66,
      fontSize: 14,
      color: C.slate,
      lineSpacingMultiple: 1.18,
    }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------------- 03 MAPA SESIÓN
function slideMapa() {
  const { slide } = createSlide("light");
  addHeader(slide, "Mapa de la sesión", "De la evidencia del proyecto a la auditoría del agente", "", false);

  const bloques = [
    [C.navy, "08:40", "Bloque 1", "Dos estados del mismo proyecto", "Cuatro señales visibles para comparar el antes y el después"],
    [CYAN, "09:05", "Bloque 2", "La primera prueba no ejecuta el programa", "Tipado: contratos sobre qué datos acepta y devuelve el código"],
    [C.gold, "09:45", "Bloque 3", "La segunda barrera, y el techo de las dos", "Linter: reglas que examinan el código sin ponerlo en marcha"],
    [C.red, "10:15", "Bloque 4", "El agente lo arregló… ¿o lo hizo desaparecer?", "Auditar una corrección de IA con evidencia, no con apariencia"],
  ];

  bloques.forEach(([accent, hora, etiqueta, titulo, glosa], i) => {
    const y = 2.26 + i * 1.09;
    addText(slide, hora, {
      x: M,
      y: y + 0.06,
      w: 0.98,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: onPaper(accent),
    });
    rect(slide, M + 1.14, y + 0.02, 0.055, 0.72, onPaper(accent));
    addText(slide, etiqueta.toUpperCase(), {
      x: M + 1.42,
      y,
      w: 1.7,
      h: 0.24,
      fontSize: 9.6,
      bold: true,
      color: C.slate,
      charSpacing: 1.2,
    });
    addText(slide, titulo, {
      x: M + 1.42,
      y: y + 0.26,
      w: 5.5,
      h: 0.34,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: 8.16,
      y: y + 0.08,
      w: 4.45,
      h: 0.62,
      fontSize: 12.8,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    if (i < bloques.length - 1) rule(slide, M, y + 0.9, 11.89, C.border, 0.75);
  });

  rule(slide, M, 6.6, 11.89, C.navy, 1.6);
  addText(slide, "08:30 encuadre  ·  09:35 pausa técnica  ·  10:40 cierre y ticket de salida", {
    x: M,
    y: 6.72,
    w: 10.2,
    h: 0.28,
    fontSize: 12.4,
    color: C.slate,
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------------- 04 APERTURA BLOQUE 1
function slideAperturaB1() {
  const { slide } = createSlide("dark");

  addText(slide, "01", {
    x: M,
    y: 1.9,
    w: 2.8,
    h: 1.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 112,
    bold: true,
    color: "1D3A57",
  });

  addText(slide, "BLOQUE 1 · 25 MINUTOS", {
    x: M + 3.02,
    y: 2.06,
    w: 6.4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(slide, "Dos estados del mismo proyecto", {
    x: M + 3.02,
    y: 2.48,
    w: 9.2,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.94, 2.2, 0.07, C.red);

  addText(
    slide,
    "Observar el antes y el después de un proyecto que fortaleció sus pruebas, sin confundir una coincidencia temporal con una causa demostrada.",
    {
      x: M + 3.02,
      y: 4.26,
      w: 8.5,
      h: 1.3,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.26,
    }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------- 05 LOS INDICADORES
function slideIndicadores() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.1 · El instrumento",
    "Cuatro indicadores en vez de una opinión",
    "Cada indicador responde una pregunta concreta y deja una huella que otra persona puede revisar.",
    false
  );

  const filas = [
    [C.navy, "Proporción de prueba", "¿Cuánto código comprueba el producto por cada línea que se entrega?", "Archivos de producto y de pruebas"],
    [CYAN, "Historial de defectos", "¿Cuántos errores se reportaron y cómo terminó cada reporte?", "Tablero donde se abren y cierran errores"],
    [C.gold, "Vida de un defecto", "¿Cuánto pasó desde que el error entró hasta que fue detectado?", "Commits —cambios registrados— y fechas"],
    [C.red, "Costo de un cambio", "¿Qué controles debe superar una modificación antes de publicarse?", "Proceso de revisión y publicación"],
  ];

  filas.forEach(([accent, titulo, glosa, donde], i) => {
    const y = 2.62 + i * 0.94;
    addCircleLabel(slide, M, y + 0.06, 0.44, onPaper(accent), String(i + 1).padStart(2, "0"), {
      fontSize: 12,
    });
    rect(slide, M + 0.66, y + 0.02, 0.05, 0.62, onPaper(accent));
    addText(slide, titulo, {
      x: M + 0.92,
      y,
      w: 3.5,
      h: 0.32,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.92,
      y: y + 0.34,
      w: 5.4,
      h: 0.32,
      fontSize: 13,
      color: C.slate,
    });
    addText(slide, "SE MIRA EN", {
      x: 9.0,
      y: y + 0.02,
      w: 3.6,
      h: 0.22,
      fontSize: 9,
      bold: true,
      color: C.guide,
      charSpacing: 1.2,
    });
    addText(slide, donde, {
      x: 9.0,
      y: y + 0.28,
      w: 3.6,
      h: 0.32,
      fontSize: 13.6,
      bold: true,
      color: onPaper(accent),
    });
    if (i < filas.length - 1) rule(slide, M, y + 0.78, 11.89, C.border, 0.75);
  });

  rect(slide, M, 6.26, 11.89, 0.62, C.navy);
  addText(
    slide,
    "No prueban que el software «sea bueno»: muestran qué afirmaciones puede respaldar con evidencia.",
    {
      x: M + 0.34,
      y: 6.26,
      w: 11.2,
      h: 0.62,
      fontSize: 16,
      bold: true,
      color: C.white,
      valign: "mid",
    }
  );

  validateSlide(slide, pptx);
}

// -------------------------------------------- 06 UN PROYECTO CONTRA SÍ MISMO
function slideContraSiMismo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · El diseño de la comparación",
    "Comparar un proyecto consigo mismo reduce diferencias",
    "SQLite antes y después de reforzar sus pruebas es una comparación más justa, pero el tiempo también cambia otras cosas.",
    false
  );

  const colW = 5.62;
  const xL = M;
  const xR = M + colW + 0.66;

  addText(slide, "DOS PROYECTOS DISTINTOS", {
    x: xL,
    y: 2.62,
    w: colW,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.4,
  });
  rect(slide, xL, 2.94, colW, 2.48, "F3EAE1");
  const variablesDistintas = ["Producto y dominio", "Equipo", "Tamaño y complejidad", "Antigüedad", "Sistema de pruebas"];
  variablesDistintas.forEach((v, i) => {
    const y = 3.16 + i * 0.46;
    addCircleLabel(slide, xL + 0.3, y + 0.02, 0.26, onPaper(C.red), "≠", {
      fontSize: 11,
    });
    addText(slide, v, {
      x: xL + 0.72,
      y,
      w: 3.0,
      h: 0.3,
      fontSize: 14.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, "cambia", {
      x: xL + 3.8,
      y,
      w: 1.5,
      h: 0.3,
      fontSize: 12.4,
      color: onPaper(C.red),
      align: "right",
    });
  });
  addText(slide, "Muchas diferencias compiten para explicar el resultado.", {
    x: xL,
    y: 5.58,
    w: colW,
    h: 0.42,
    fontSize: 13.4,
    bold: true,
    color: onPaper(C.red),
    lineSpacingMultiple: 1.16,
  });

  addText(slide, "EL MISMO PROYECTO, ANTES Y DESPUÉS", {
    x: xR,
    y: 2.62,
    w: colW,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: CYAN_ON_PAPER,
    charSpacing: 1.4,
  });
  rect(slide, xR, 2.94, colW, 2.48, "E8F1F2");
  const variablesMismoProyecto = [
    ["Producto y propósito", "se reconocen", "=", C.guide],
    ["Sistema de pruebas", "cambia y queda documentado", "≠", CYAN_ON_PAPER],
    ["Código y equipo", "también evolucionan", "≈", onPaper(C.gold)],
    ["Madurez y experiencia", "también crecen", "≈", onPaper(C.gold)],
  ];
  variablesMismoProyecto.forEach(([nombre, estado, simbolo, color], i) => {
    const y = 3.18 + i * 0.56;
    addCircleLabel(
      slide,
      xR + 0.3,
      y + 0.02,
      0.26,
      color,
      simbolo,
      { fontSize: 11 }
    );
    addText(slide, nombre, {
      x: xR + 0.72,
      y,
      w: 2.4,
      h: 0.3,
      fontSize: 13.8,
      bold: simbolo === "≠",
      color: C.ink,
    });
    addText(slide, estado, {
      x: xR + 3.16,
      y,
      w: 2.14,
      h: 0.3,
      fontSize: 11.5,
      bold: simbolo === "≠",
      color,
      align: "right",
    });
  });
  addText(slide, "La comparación reduce diferencias, pero no las elimina.", {
    x: xR,
    y: 5.58,
    w: colW,
    h: 0.42,
    fontSize: 13.4,
    bold: true,
    color: CYAN_ON_PAPER,
    lineSpacingMultiple: 1.16,
  });

  rect(slide, M, 6.12, 11.89, 0.78, C.navy);
  addText(slide, "EXPERIMENTO CONTROLADO", {
    x: M + 0.3,
    y: 6.24,
    w: 2.55,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.25,
  });
  addText(slide, "solo cambia el factor estudiado; aquí no ocurre eso. El caso permite observar una relación, no probar una causa.", {
    x: M + 3.08,
    y: 6.2,
    w: 8.42,
    h: 0.48,
    fontSize: 13.2,
    bold: true,
    color: C.white,
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------------------ 07 LÍNEA DE TIEMPO
function slideLineaDeTiempo() {
  const { slide } = createSlide("dark");
  addHeader(
    slide,
    "1.2 · El caso",
    "SQLite llevó sus pruebas hasta una exigencia aeronáutica",
    "SQLite es una base de datos incrustada dentro de aplicaciones y dispositivos; no funciona como un servidor aparte.",
    true,
    { titleW: 10.2, titleFontSize: 28, subtitleW: 10.8, subtitleH: 0.28, subtitleFontSize: 13.3 }
  );

  const yLinea = 3.08;
  rule(slide, M + 0.2, yLinea, 11.0, "2C4E70", 1.6);

  const hitos = [
    ["2008-09-25", "Nace TH3, su tercer sistema propio de pruebas", C.gold],
    ["2009-07-25", "TH3 alcanza 100% de cobertura MC/DC", CYAN_ON_NAVY],
    ["2009-08-10", "Desde la versión 3.6.17, cada entrega pasa ese estándar", C.red],
  ];
  hitos.forEach(([fecha, texto, color], i) => {
    const x = M + 0.2 + i * 4.25;
    slide.addShape(SH.ellipse, {
      x: x - 0.13,
      y: yLinea - 0.13,
      w: 0.26,
      h: 0.26,
      fill: { color },
      line: { color, pt: 0 },
    });
    addText(slide, fecha, {
      x: x - 0.1,
      y: yLinea - 0.86,
      w: 3.55,
      h: 0.32,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 16,
      bold: true,
      color,
    });
    addText(slide, texto, {
      x: x - 0.1,
      y: yLinea + 0.32,
      w: 3.62,
      h: 0.6,
      fontSize: 12.8,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M + 0.6, yLinea - 0.05, 4.4, 0.1, "1D3A57");
  addText(slide, "10 MESES DE TRABAJO", {
    x: M + 0.6,
    y: yLinea - 0.44,
    w: 4.4,
    h: 0.26,
    fontSize: 10,
    bold: true,
    color: C.terminalMuted,
    charSpacing: 1.5,
    align: "center",
  });

  addText(slide, "TH3", {
    x: M,
    y: 4.14,
    w: 0.72,
    h: 0.28,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 14,
    bold: true,
    color: C.gold,
  });
  addText(slide, "es el banco de pruebas creado por SQLite para comprobar combinaciones y decisiones internas del motor.", {
    x: M + 0.82,
    y: 4.12,
    w: 10.36,
    h: 0.34,
    fontSize: 13.3,
    color: C.softBlue,
  });

  rule(slide, M, 4.72, 11.89, "2C4E70", 1);

  addText(slide, "MC/DC SUBE LA EXIGENCIA PASO A PASO", {
    x: M,
    y: 4.94,
    w: 4.0,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.gold,
    charSpacing: 1.5,
  });

  const escalera = [
    ["1 · Líneas", "Cada línea se ejecutó al menos una vez", "2C4E70"],
    ["2 · Ramas", "Cada decisión recorrió su salida verdadera y falsa", "3E6B8F"],
    ["3 · Condiciones", "Cada condición cambió por sí sola el resultado de la decisión", CYAN_ON_NAVY],
  ];
  escalera.forEach(([titulo, glosa, color], i) => {
    const x = M + i * 3.98;
    rect(slide, x, 5.34, 3.66, 0.06, color);
    addText(slide, titulo, {
      x,
      y: 5.5,
      w: 3.66,
      h: 0.3,
      fontSize: 14.4,
      bold: true,
      color: i === 2 ? C.white : C.softBlue,
    });
    addText(slide, glosa, {
      x,
      y: 5.84,
      w: 3.66,
      h: 0.56,
      fontSize: 11.8,
      color: C.terminalMuted,
      lineSpacingMultiple: 1.14,
    });
  });

  addText(
    slide,
    "MC/DC = Modified Condition/Decision Coverage. La norma aeronáutica DO-178B lo usa para software crítico de vuelo.",
    {
      x: M,
      y: 6.56,
      w: 11.2,
      h: 0.32,
      fontSize: 13.4,
      italic: true,
      color: C.terminalMuted,
    }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------------------------------- 08 LA PROPORCIÓN
function slideProporcion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · Los indicadores aplicados",
    "590× describe esfuerzo de prueba, no calidad",
    "KSLOC significa miles de líneas de código fuente: la K equivale a mil. Datos de SQLite 3.42.0 (2023).",
    false
  );

  addText(slide, "CÓDIGO DEL PRODUCTO", {
    x: M,
    y: 2.6,
    w: 4.4,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.slate,
    charSpacing: 1.3,
  });
  rect(slide, M, 2.9, 0.42, 0.34, C.navy);
  addText(slide, "155,8 KSLOC  ≈  155.800 líneas", {
    x: M + 0.62,
    y: 2.9,
    w: 4.8,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: C.navy,
    valign: "mid",
  });

  addText(slide, "CÓDIGO Y SCRIPTS QUE COMPRUEBAN EL PRODUCTO", {
    x: M,
    y: 3.62,
    w: 6.4,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.3,
  });
  rect(slide, M, 3.92, W - M, 0.34, onPaper(C.red));
  addText(slide, "92.053,1 KSLOC  ≈  92 millones de líneas", {
    x: M + 0.22,
    y: 3.92,
    w: 5.7,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: C.white,
    valign: "mid",
  });
  addText(slide, "la proporción real continúa fuera del lienzo  →", {
    x: 7.1,
    y: 3.92,
    w: 5.5,
    h: 0.34,
    fontSize: 12.6,
    italic: true,
    color: "F6D3D4",
    align: "right",
    valign: "mid",
  });

  addText(slide, "590×", {
    x: M,
    y: 4.44,
    w: 2.3,
    h: 0.86,
    fontFace: TYPOGRAPHY.display,
    fontSize: 54,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "92.053,1 ÷ 155,8  ≈  590\nmás prueba que producto", {
    x: M + 2.5,
    y: 4.52,
    w: 5.0,
    h: 0.78,
    fontSize: 15.6,
    bold: true,
    color: C.ink,
    valign: "mid",
    lineSpacingMultiple: 1.08,
  });

  rect(slide, 8.5, 4.42, 4.11, 0.9, C.warm);
  addText(
    slide,
    "SQLite se distribuye dentro de muchísimos dispositivos. Corregir cada copia después de publicarla es difícil; por eso invierte tanto antes.",
    {
      x: 8.72,
      y: 4.5,
      w: 3.7,
      h: 0.74,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  rule(slide, M, 5.62, 11.89, C.border, 0.9);

  const otros = [
    [CYAN, "Lo que sí muestra", "el sistema de comprobación es mucho mayor que el producto"],
    [C.red, "Lo que no demuestra", "que SQLite no tenga defectos o que 590× sea una receta universal"],
    [C.navy, "La idea transferible", "más riesgo exige más evidencia antes de publicar un cambio"],
  ];
  otros.forEach(([accent, titulo, glosa], i) => {
    const x = M + i * 3.98;
    rect(slide, x, 5.86, 0.05, 0.72, onPaper(accent));
    addText(slide, titulo, {
      x: x + 0.24,
      y: 5.84,
      w: 3.5,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 6.14,
      w: 3.5,
      h: 0.5,
      fontSize: 12,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------------------------- 09 LA CITA
function slideCita() {
  const { slide } = createSlide("dark");

  addText(slide, "EL RESULTADO QUE DECLARA EL RESPONSABLE DEL PROYECTO", {
    x: M,
    y: 1.26,
    w: 7.4,
    h: 0.26,
    fontSize: 10.4,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });

  rect(slide, M, 1.82, 0.09, 3.42, C.red);

  addText(
    slide,
    "«Eso tomó un año de semanas de 60 horas. Fue trabajo duro, durísimo. Metía jornadas de 12 horas todos los días.",
    {
      x: M + 0.46,
      y: 1.82,
      w: 11.0,
      h: 1.06,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      color: C.softBlue,
      lineSpacingMultiple: 1.22,
    }
  );

  addText(
    slide,
    "Una vez que llegamos a ese punto, dejamos de recibir reportes de error desde Android.»",
    {
      x: M + 0.46,
      y: 3.04,
      w: 11.0,
      h: 1.3,
      fontFace: TYPOGRAPHY.display,
      fontSize: 31,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.18,
    }
  );

  addText(slide, "D. RICHARD HIPP · CREADOR Y MANTENEDOR DE SQLITE", {
    x: M + 0.46,
    y: 4.5,
    w: 7.0,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.6,
  });

  rule(slide, M, 5.16, 11.89, "2C4E70", 1);

  addText(
    slide,
    "Mantenedor = responsable técnico de sostener y publicar el proyecto.",
    {
      x: M,
      y: 5.42,
      w: 11.2,
      h: 0.32,
      fontSize: 15,
      bold: true,
      color: C.gold,
    }
  );
  addText(
    slide,
    "El hecho citado no es «SQLite quedó sin defectos». Es más preciso: dejaron de llegar reportes desde Android. Puede haber defectos que nadie encuentre, nadie reporte o que ocurran fuera de Android.",
    {
      x: M,
      y: 5.8,
      w: 11.2,
      h: 0.86,
      fontSize: 15,
      color: C.softBlue,
      lineSpacingMultiple: 1.22,
    }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------- 10 EVIDENCIA VS ATRIBUCIÓN
function slideEvidenciaAtribucion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · El examen de la evidencia",
    "Que ocurra después no significa que el hecho anterior lo causó",
    "Correlación temporal: dos hechos aparecen en secuencia. Causalidad: uno produce el otro.",
    false
  );

  const xL = M;
  const xR = 7.38;

  addText(slide, "LO QUE OBSERVAMOS", {
    x: xL,
    y: 2.56,
    w: 4.9,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: CYAN_ON_PAPER,
    charSpacing: 1.35,
  });
  rect(slide, xL, 2.92, 5.76, 1.5, "E8F1F2");
  addText(slide, "TH3 alcanza\n100% MC/DC", {
    x: xL + 0.28,
    y: 3.16,
    w: 1.76,
    h: 0.78,
    fontSize: 16.2,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "mid",
  });
  addText(slide, "DESPUÉS", {
    x: xL + 2.13,
    y: 3.3,
    w: 1.18,
    h: 0.22,
    fontSize: 9,
    bold: true,
    color: C.slate,
    charSpacing: 1.05,
    align: "center",
  });
  slide.addShape(SH.chevron, {
    x: xL + 2.34,
    y: 3.58,
    w: 0.78,
    h: 0.34,
    fill: { color: CYAN_ON_PAPER },
    line: { color: CYAN_ON_PAPER, pt: 0 },
  });
  addText(slide, "Dejan de llegar\nreportes desde Android", {
    x: xL + 3.42,
    y: 3.14,
    w: 2.06,
    h: 0.82,
    fontSize: 15,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
  });

  addText(slide, "≠", {
    x: 6.48,
    y: 3.18,
    w: 0.6,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 42,
    bold: true,
    color: onPaper(C.red),
    align: "center",
    valign: "mid",
  });

  addText(slide, "LO QUE FALTARÍA PARA PROBAR LA CAUSA", {
    x: xR,
    y: 2.56,
    w: 5.23,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  const faltantes = [
    "Un SQLite paralelo que no adopte TH3.",
    "Mantener iguales código, equipo y madurez.",
    "Una medición independiente del testimonio de Hipp.",
  ];
  faltantes.forEach((texto, i) => {
    const y = 2.98 + i * 0.48;
    addCircleLabel(slide, xR, y, 0.3, onPaper(C.red), String(i + 1), { fontSize: 10 });
    addText(slide, texto, {
      x: xR + 0.46,
      y: y - 0.01,
      w: 4.72,
      h: 0.34,
      fontSize: 12.8,
      color: C.ink,
      valign: "mid",
    });
  });

  addText(slide, "La secuencia está documentada; el vínculo causal no quedó aislado.", {
    x: M,
    y: 4.64,
    w: 11.89,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: C.navy,
    align: "center",
  });

  rect(slide, M, 5.14, 11.89, 1.82, C.navy);
  addText(slide, "LA MISMA EVIDENCIA, DOS REDACCIONES", {
    x: M + 0.34,
    y: 5.3,
    w: 6.0,
    h: 0.24,
    fontSize: 9.8,
    bold: true,
    color: C.terminalMuted,
    charSpacing: 1.4,
  });

  rect(slide, M + 0.34, 5.86, 0.05, 0.4, C.success);
  addText(
    slide,
    "Alcanzar MC/DC coincidió con la desaparición de los reportes desde producción, según su mantenedor.",
    {
      x: M + 0.6,
      y: 5.72,
      w: 11.0,
      h: 0.44,
      fontSize: 13.2,
      bold: true,
      color: C.white,
    }
  );

  rect(slide, M + 0.34, 6.34, 0.05, 0.4, C.red);
  addText(slide, "Las pruebas eliminan los errores.", {
    x: M + 0.6,
    y: 6.32,
    w: 4.5,
    h: 0.46,
    fontSize: 14.4,
    bold: true,
    color: "F6A9AB",
  });
  addText(slide, "más cómoda de repetir · no la sostiene ningún dato", {
    x: 6.4,
    y: 6.34,
    w: 5.1,
    h: 0.42,
    fontSize: 12.4,
    italic: true,
    color: C.terminalMuted,
    align: "right",
  });

  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 11 PREGUNTAS BLOQUE 1
function slidePreguntasB1() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre del Bloque 1",
    "Tres preguntas antes de seguir",
    "",
    false
  );

  const preguntas = [
    [
      C.navy,
      "¿Por qué 590 veces más código de prueba que de producto no es una meta razonable para cualquier proyecto?",
      "Piensa en qué cambia según dónde y cómo se despliegue el software.",
    ],
    [
      CYAN,
      "Si nadie reporta defectos, ¿significa que no los hay?",
      "El indicador mide reportes, no defectos. Considera qué otras causas producen silencio.",
    ],
    [
      C.red,
      "¿Qué información faltaría para afirmar que TH3 causó la disminución de reportes?",
      "Piensa en una comparación donde el sistema de pruebas sea lo único que cambie.",
    ],
  ];

  preguntas.forEach(([accent, pregunta, pista], i) => {
    const y = 2.36 + i * 1.52;
    addCircleLabel(slide, M, y + 0.08, 0.5, onPaper(accent), String(i + 1), {
      fontSize: 15,
    });
    addText(slide, pregunta, {
      x: M + 0.78,
      y,
      w: 11.1,
      h: 0.72,
      fontSize: 18.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, M + 0.78, y + 0.8, 0.72, 0.28, onPaper(accent));
    addText(slide, "PISTA", {
      x: M + 0.78,
      y: y + 0.8,
      w: 0.72,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, pista, {
      x: M + 1.66,
      y: y + 0.8,
      w: 10.2,
      h: 0.3,
      fontSize: 13.2,
      color: C.slate,
      valign: "mid",
    });
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, 11.89, C.border, 0.75);
  });

  rule(slide, M, 6.96, 11.89, C.navy, 1.6);

  validateSlide(slide, pptx);
}

// ------------------------------------------------------- 12 APERTURA BLOQUE 2
function slideAperturaB2() {
  const { slide } = createSlide("dark");

  addText(slide, "02", {
    x: M,
    y: 1.9,
    w: 2.8,
    h: 1.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 112,
    bold: true,
    color: "1D3A57",
  });

  addText(slide, "BLOQUE 2 · 30 MINUTOS", {
    x: M + 3.02,
    y: 2.06,
    w: 6.4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 2,
  });

  addText(slide, "La primera prueba no ejecuta el programa", {
    x: M + 3.02,
    y: 2.48,
    w: 9.2,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.94, 2.2, 0.07, CYAN_ON_NAVY);

  addText(
    slide,
    "Una prueba estática lee el código sin ponerlo en marcha. Puede detectar contradicciones entre lo que declaramos y la forma en que usamos los datos.",
    {
      x: M + 3.02,
      y: 4.26,
      w: 8.55,
      h: 1.24,
      fontSize: 18,
      color: C.softBlue,
      lineSpacingMultiple: 1.24,
    }
  );

  addText(slide, "Contrato = qué recibe una función y qué promete devolver. La herramienta no lo adivina: alguien debe declararlo.", {
    x: M + 3.02,
    y: 5.72,
    w: 8.55,
    h: 0.62,
    fontSize: 15,
    bold: true,
    color: C.gold,
    lineSpacingMultiple: 1.12,
  });

  validateSlide(slide, pptx);
}

// -------------------------------------------------- 13 ESTÁTICA Y DINÁMICA
function slideEstaticasDinamicas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.1 · Dos familias de prueba",
    "La diferencia es de dónde sale la evidencia",
    "La norma separa las pruebas por una pregunta concreta: ¿el programa se ejecuta durante la comprobación?",
    false
  );

  const lanes = [
    {
      x: M,
      w: 5.66,
      accent: CYAN_ON_PAPER,
      fill: "E8F1F2",
      label: "PRUEBA ESTÁTICA",
      answer: "NO EJECUTA",
      source: "Lee código, estructura y declaraciones.",
      tool: "pyrefly · verificador de tipos: contrasta declaraciones con usos\nruff · linter: busca patrones y reglas en el código",
      question: "¿El código es consistente con lo que declara?",
    },
    {
      x: 6.98,
      w: 5.63,
      accent: onPaper(C.red),
      fill: "F3EAE1",
      label: "PRUEBA DINÁMICA",
      answer: "SÍ EJECUTA",
      source: "Observa el comportamiento mientras corre.",
      tool: "pytest · ejecutor de pruebas: entrega entradas y compara resultados",
      question: "¿Qué ocurrió cuando el programa se ejecutó?",
    },
  ];

  lanes.forEach((lane) => {
    rect(slide, lane.x, 2.54, lane.w, 3.62, lane.fill);
    rect(slide, lane.x, 2.54, lane.w, 0.1, lane.accent);
    addText(slide, lane.label, {
      x: lane.x + 0.34,
      y: 2.82,
      w: 3.2,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color: lane.accent,
      charSpacing: 1.5,
    });
    addText(slide, lane.answer, {
      x: lane.x + 3.45,
      y: 2.76,
      w: 1.82,
      h: 0.32,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 14,
      bold: true,
      color: lane.accent,
      align: "right",
    });
    addText(slide, "FUENTE DE EVIDENCIA", {
      x: lane.x + 0.34,
      y: 3.34,
      w: 2.6,
      h: 0.2,
      fontSize: 9,
      bold: true,
      color: C.guide,
      charSpacing: 1.15,
    });
    addText(slide, lane.source, {
      x: lane.x + 0.34,
      y: 3.62,
      w: lane.w - 0.68,
      h: 0.46,
      fontSize: 15.2,
      bold: true,
      color: C.ink,
    });
    rule(slide, lane.x + 0.34, 4.22, lane.w - 0.68, C.border, 0.8);
    addText(slide, lane.tool, {
      x: lane.x + 0.34,
      y: 4.44,
      w: lane.w - 0.68,
      h: 0.72,
      fontSize: 13,
      color: C.slate,
      lineSpacingMultiple: 1.18,
    });
    addText(slide, lane.question, {
      x: lane.x + 0.34,
      y: 5.48,
      w: lane.w - 0.68,
      h: 0.4,
      fontSize: 14.3,
      bold: true,
      color: lane.accent,
      align: "center",
    });
  });

  addText(slide, "No son dos nombres para lo mismo: cada familia puede detectar problemas que la otra no observa.", {
    x: M,
    y: 6.48,
    w: 11.89,
    h: 0.36,
    fontSize: 15,
    bold: true,
    color: C.navy,
    align: "center",
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------- 14 CASO ZULIP
function slideZulip() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.1 · Por qué sumar otra barrera",
    "Un proyecto con muchas pruebas todavía encontró más",
    "Zulip es una aplicación web de código abierto; su backend —la lógica que corre en el servidor— está escrito en Python.",
    false
  );

  const stages = [
    [C.navy, "ANTES", "Cobertura de pruebas\n«inusualmente alta»"],
    [CYAN, "CAMBIO", "100% del backend\nanotado con tipos"],
    [C.red, "RESULTADO", "Decenas de defectos\nlatentes señalados"],
  ];
  stages.forEach(([accent, label, textValue], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 2.72, 3.58, 1.58, i === 1 ? "E8F1F2" : C.white, C.border, 0.06);
    rect(slide, x, 2.72, 0.08, 1.58, onPaper(accent));
    addText(slide, label, {
      x: x + 0.34,
      y: 2.98,
      w: 2.9,
      h: 0.22,
      fontSize: 9.5,
      bold: true,
      color: onPaper(accent),
      charSpacing: 1.3,
    });
    addText(slide, textValue, {
      x: x + 0.34,
      y: 3.3,
      w: 2.9,
      h: 0.68,
      fontSize: 17.2,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    if (i < stages.length - 1) {
      slide.addShape(SH.chevron, {
        x: x + 3.66,
        y: 3.28,
        w: 0.34,
        h: 0.44,
        fill: { color: C.guide },
        line: { color: C.guide, pt: 0 },
      });
    }
  });

  addText(slide, "≈ 50.000", {
    x: M,
    y: 4.76,
    w: 3.0,
    h: 0.58,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: CYAN_ON_PAPER,
  });
  addText(slide, "líneas de Python en el backend recibieron contratos de tipos.", {
    x: M + 3.08,
    y: 4.84,
    w: 4.48,
    h: 0.48,
    fontSize: 17,
    bold: true,
    color: C.ink,
  });

  rect(slide, 8.42, 4.56, 4.19, 1.1, C.warm);
  addText(slide, "DEFECTO LATENTE", {
    x: 8.72,
    y: 4.76,
    w: 3.54,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.25,
  });
  addText(slide, "Ya existe en el código, pero todavía no se manifestó ni fue reportado.", {
    x: 8.72,
    y: 5.06,
    w: 3.5,
    h: 0.46,
    fontSize: 13.2,
    color: C.ink,
  });

  rect(slide, M, 5.96, 11.89, 0.88, C.navy);
  addText(slide, "La lectura correcta no es «las pruebas fallaron». Es: el tipado y la ejecución observan clases distintas de problema.", {
    x: M + 0.34,
    y: 6.08,
    w: 11.2,
    h: 0.54,
    fontSize: 14.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 15 SILENCIO SIN CONTRATO
function slideSilencioSinContrato() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.2 · El verificador se queda callado",
    "Sin tipos declarados hay poco que comparar",
    "El código puede fallar y, aun así, el verificador puede informar cero errores.",
    false
  );

  const code = [
    "def nota_de(alumno, registro):",
    "    notas = registro.get(alumno)",
    "    return nota_final(notas)",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 6.12,
    h: 2.18,
    title: "notas.py · función sin anotaciones",
    code,
    lang: "python",
    fontSize: 15,
  });

  addTerminalPanel(slide, SH, {
    x: 7.18,
    y: 2.52,
    w: 5.43,
    h: 2.18,
    title: "PowerShell · configuración y revisión",
    fontSize: 10.6,
    lines: [
      { prompt: ">", text: "uv run pyrefly init" },
      { text: "crea [tool.pyrefly] en pyproject.toml", kind: "muted" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "INFO 0 errors" },
    ],
  });

  const chain = [
    ["alumno", "tipo no declarado"],
    ["registro", "tipo no declarado"],
    ["notas", "resultado sin contrato"],
  ];
  chain.forEach(([name, desc], i) => {
    const x = M + i * 3.12;
    rect(slide, x, 5.04, 2.78, 0.76, "E8F1F2");
    addText(slide, name, {
      x: x + 0.2,
      y: 5.16,
      w: 0.94,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13.5,
      bold: true,
      color: CYAN_ON_PAPER,
    });
    addText(slide, desc, {
      x: x + 1.12,
      y: 5.13,
      w: 1.44,
      h: 0.38,
      fontSize: 11.2,
      color: C.slate,
      align: "right",
    });
  });
  addText(slide, "→", {
    x: 10.12,
    y: 5.08,
    w: 0.48,
    h: 0.38,
    fontSize: 22,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });
  addText(slide, "0 errores", {
    x: 10.68,
    y: 5.06,
    w: 1.92,
    h: 0.34,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: onPaper(C.red),
    align: "right",
  });

  rect(slide, M, 6.12, 11.89, 0.72, C.navy);
  addText(slide, "«0 errores» significa «no encontré contradicciones con lo declarado». Aquí casi nada fue declarado.", {
    x: M + 0.34,
    y: 6.22,
    w: 11.2,
    h: 0.46,
    fontSize: 14.6,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------- 16 ANOTAR HACE VISIBLE
function slideAnotarRevela() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · Anotar no corrige: revela",
    "La lógica queda igual; aparece un contrato",
    "Un contrato de tipos declara qué recibe una función y qué promete devolver.",
    false
  );

  const code = [
    "def nota_de(",
    "    alumno: str,",
    "    registro: dict[str, list[float]],",
    ") -> float:",
    "    notas = registro.get(alumno)",
    "    return nota_final(notas)",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.14,
    h: 2.76,
    title: "notas.py · misma lógica, tipos declarados",
    code,
    lang: "python",
    fontSize: 12.2,
  });

  addTerminalPanel(slide, SH, {
    x: 7.18,
    y: 2.5,
    w: 5.43,
    h: 2.76,
    title: "pyrefly · diagnóstico real",
    fontSize: 9.7,
    lines: [
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "ERROR list[float] | None no puede" },
      { text: "entregarse donde se exige list[float]" },
      { text: "14 | return nota_final(notas)" },
      { text: "El tipo declarado no permite None.", kind: "muted" },
      { text: "INFO 1 error" },
    ],
  });

  const defs = [
    [C.navy, "alumno: str", "el nombre debe ser texto"],
    [CYAN, "dict[str, list[float]]", "cada nombre apunta a una lista de notas"],
    [C.red, "-> float", "la función promete devolver una nota decimal"],
  ];
  defs.forEach(([accent, label, desc], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 5.54, 0.06, 0.7, onPaper(accent));
    addText(slide, label, {
      x: x + 0.24,
      y: 5.52,
      w: 3.45,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: onPaper(accent),
    });
    addText(slide, desc, {
      x: x + 0.24,
      y: 5.84,
      w: 3.45,
      h: 0.42,
      fontSize: 12,
      color: C.slate,
    });
  });

  addText(slide, "Solo cambió la declaración. El defecto ya estaba en la función anterior.", {
    x: M,
    y: 6.52,
    w: 11.89,
    h: 0.3,
    fontSize: 14.5,
    bold: true,
    color: C.navy,
    align: "center",
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 17 TRADUCIR Y DECIDIR
function slideTraducirDiagnostico() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · Interpretar el diagnóstico",
    "El verificador encontró una decisión que nadie tomó",
    "None significa ausencia de valor: aparece cuando el nombre buscado no existe en el registro.",
    false
  );

  const routes = [
    {
      y: 2.56,
      accent: C.success,
      name: 'registro.get("Ana")',
      result: "list[float]",
      final: "nota_final(lista)",
      outcome: "funciona",
    },
    {
      y: 3.5,
      accent: C.red,
      name: 'registro.get("X")',
      result: "None",
      final: "nota_final(None)",
      outcome: "falla",
    },
  ];
  routes.forEach((route) => {
    const color = onPaper(route.accent);
    rect(slide, M, route.y, 11.89, 0.72, route.accent === C.success ? "E9F2EC" : "F3EAE1");
    addText(slide, route.name, {
      x: M + 0.28,
      y: route.y + 0.18,
      w: 2.3,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, "→", { x: 3.42, y: route.y + 0.14, w: 0.42, h: 0.32, fontSize: 20, bold: true, color });
    addText(slide, route.result, {
      x: 3.9,
      y: route.y + 0.18,
      w: 1.74,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color,
    });
    addText(slide, "→", { x: 5.78, y: route.y + 0.14, w: 0.42, h: 0.32, fontSize: 20, bold: true, color });
    addText(slide, route.final, {
      x: 6.28,
      y: route.y + 0.18,
      w: 2.42,
      h: 0.28,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    addText(slide, route.outcome.toUpperCase(), {
      x: 10.26,
      y: route.y + 0.17,
      w: 2.02,
      h: 0.28,
      fontSize: 12,
      bold: true,
      color,
      align: "right",
      charSpacing: 1.15,
    });
  });

  addText(slide, "¿QUÉ DEBE HACER EL PRODUCTO SI EL ALUMNO NO EXISTE?", {
    x: M,
    y: 4.56,
    w: 7.0,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.3,
  });
  const decisions = [
    [C.red, "Error explícito", "Detenerse y explicar qué alumno no existe."],
    [C.gold, "Nota cero", "Interpretar la ausencia como una calificación válida."],
    [CYAN, "Valor ausente", "Devolver None y obligar a quien llama a decidir."],
  ];
  decisions.forEach(([accent, label, desc], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 4.98, 3.58, 1.18, C.white, C.border, 0.05);
    rect(slide, x, 4.98, 0.08, 1.18, onPaper(accent));
    addText(slide, label, {
      x: x + 0.3,
      y: 5.16,
      w: 2.96,
      h: 0.28,
      fontSize: 14.5,
      bold: true,
      color: onPaper(accent),
    });
    addText(slide, desc, {
      x: x + 0.3,
      y: 5.5,
      w: 2.96,
      h: 0.48,
      fontSize: 11.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  rect(slide, M, 6.4, 11.89, 0.48, C.navy);
  addText(slide, "Las tres opciones pueden escribirse; ninguna herramienta puede autorizar cuál corresponde al producto.", {
    x: M + 0.28,
    y: 6.44,
    w: 11.32,
    h: 0.34,
    fontSize: 13.5,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });

  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 18 PREGUNTAS BLOQUE 2
function slidePreguntasB2() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre del Bloque 2", "Tres preguntas antes de seguir", "", false);

  const preguntas = [
    [
      CYAN,
      "Si anotar los tipos no cambia la lógica, ¿por qué aparecen errores que antes no aparecían?",
      "Antes no había contrato contra el cual comparar; después sí.",
    ],
    [
      C.gold,
      "¿Por qué un error de tipos puede revelar una decisión de producto pendiente?",
      "Busca qué debe ocurrir en el caso que el tipo dejó al descubierto.",
    ],
    [
      C.red,
      "¿Qué significa exactamente que una herramienta estática no reporte nada?",
      "Distingue «no hay problemas» de «no puedo afirmar nada con lo declarado».",
    ],
  ];

  preguntas.forEach(([accent, pregunta, pista], i) => {
    const y = 2.36 + i * 1.52;
    addCircleLabel(slide, M, y + 0.08, 0.5, onPaper(accent), String(i + 1), { fontSize: 15 });
    addText(slide, pregunta, {
      x: M + 0.78,
      y,
      w: 11.1,
      h: 0.72,
      fontSize: 18.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, M + 0.78, y + 0.8, 0.72, 0.28, onPaper(accent));
    addText(slide, "PISTA", {
      x: M + 0.78,
      y: y + 0.8,
      w: 0.72,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, pista, {
      x: M + 1.66,
      y: y + 0.8,
      w: 10.2,
      h: 0.3,
      fontSize: 13.2,
      color: C.slate,
      valign: "mid",
    });
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, 11.89, C.border, 0.75);
  });

  rule(slide, M, 6.96, 11.89, CYAN_ON_PAPER, 1.6);
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 19 APERTURA BLOQUE 3
function slideAperturaB3() {
  const { slide } = createSlide("dark");

  addText(slide, "BLOQUE", {
    x: M,
    y: 1.34,
    w: 1.45,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: C.gold,
    charSpacing: 2.2,
  });
  addText(slide, "03", {
    x: M,
    y: 1.68,
    w: 2.25,
    h: 1.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 64,
    bold: true,
    color: C.white,
  });
  vrule(slide, 3.0, 1.38, 4.8, C.red, 4);
  addText(slide, "La segunda barrera,\ny el techo de las dos", {
    x: 3.42,
    y: 1.38,
    w: 8.15,
    h: 1.52,
    fontFace: TYPOGRAPHY.display,
    fontSize: 37,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  addText(slide, "Ruff detecta patrones riesgosos; Pyrefly comprueba contratos. Ninguno conoce por sí solo el resultado que el producto necesita.", {
    x: 3.44,
    y: 3.22,
    w: 8.55,
    h: 0.82,
    fontSize: 18,
    color: C.softBlue,
    lineSpacingMultiple: 1.2,
  });

  const recorrido = [
    ["01", "Hacer visible", "El dato que zip() descarta"],
    ["02", "Configurar", "La regla B905 en Ruff"],
    ["03", "Encontrar el techo", "Un resultado incorrecto"],
  ];
  recorrido.forEach(([n, title, desc], i) => {
    const x = M + i * 4.02;
    rect(slide, x, 4.72, 3.62, 1.18, i === 1 ? "19384A" : "163247", "496175", 0.06);
    addCircleLabel(slide, x + 0.24, 4.98, 0.5, [C.red, CYAN_ON_NAVY, C.gold][i], n, {
      fontSize: 10.5,
      color: i === 1 ? C.navy : C.white,
    });
    addText(slide, title, {
      x: x + 0.92,
      y: 4.88,
      w: 2.36,
      h: 0.28,
      fontSize: 15.5,
      bold: true,
      color: C.white,
    });
    addText(slide, desc, {
      x: x + 0.92,
      y: 5.24,
      w: 2.36,
      h: 0.42,
      fontSize: 11.8,
      color: C.softBlue,
    });
  });

  addText(slide, "30 MINUTOS · DEMOSTRACIÓN Y ANÁLISIS INDIVIDUAL", {
    x: M,
    y: 6.48,
    w: 7.2,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.3,
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 20 ZIP SILENCIOSO
function slideZipSilencioso() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · El defecto que parece un resultado",
    "zip() se detiene sin avisar",
    "zip() empareja posiciones y termina cuando se acaba la secuencia más corta.",
    false
  );

  const code = [
    "def promedio_ponderado(",
    "    notas: list[float],",
    "    pesos: list[float],",
    ") -> float:",
    "    total = sum(n * p for n, p in zip(notas, pesos))",
    "    return float(Decimal(str(total / sum(pesos))).quantize(",
    "        Decimal(\"0.1\"), rounding=ROUND_HALF_UP",
    "    ))",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 6.35,
    h: 3.28,
    title: "notas.py · función completa",
    code,
    lang: "python",
    fontSize: 10.5,
  });

  addText(slide, "DATOS DE ENTRADA", {
    x: 7.42,
    y: 2.5,
    w: 2.0,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: C.red,
    charSpacing: 1.25,
  });
  const pairs = [
    ["6.0", "×", "0.5", "= 3.0", C.success],
    ["5.0", "×", "0.5", "= 2.5", C.success],
    ["4.0", "×", "—", "IGNORADA", C.red],
  ];
  pairs.forEach(([nota, op, peso, result, accent], i) => {
    const y = 2.9 + i * 0.72;
    rect(slide, 7.42, y, 1.05, 0.48, "E8F1F2");
    addText(slide, nota, { x: 7.42, y: y + 0.08, w: 1.05, h: 0.25, fontFace: TYPOGRAPHY.mono, fontSize: 14, bold: true, color: C.ink, align: "center" });
    addText(slide, op, { x: 8.58, y: y + 0.08, w: 0.32, h: 0.25, fontSize: 14, bold: true, color: C.slate, align: "center" });
    rect(slide, 9.02, y, 1.05, 0.48, peso === "—" ? "F3EAE1" : "E8F1F2");
    addText(slide, peso, { x: 9.02, y: y + 0.08, w: 1.05, h: 0.25, fontFace: TYPOGRAPHY.mono, fontSize: 14, bold: true, color: C.ink, align: "center" });
    addText(slide, result, { x: 10.28, y: y + 0.08, w: 2.02, h: 0.25, fontSize: 12.5, bold: true, color: onPaper(accent), align: "right" });
  });

  rect(slide, 7.42, 5.18, 5.18, 0.72, C.navy);
  addText(slide, "Resultado: 5.5", {
    x: 7.72,
    y: 5.32,
    w: 2.2,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 17,
    bold: true,
    color: C.white,
  });
  addText(slide, "plausible, pero incorrecto", {
    x: 9.84,
    y: 5.34,
    w: 2.46,
    h: 0.25,
    fontSize: 11.8,
    color: C.softBlue,
    align: "right",
  });

  const states = [
    ["pyrefly", "0 errores"],
    ["Ruff por defecto", "sin alertas"],
  ];
  states.forEach(([name, state], i) => {
    const x = M + i * 3.18;
    rect(slide, x, 6.12, 2.9, 0.58, "E9F2EC");
    addText(slide, name, { x: x + 0.2, y: 6.26, w: 1.48, h: 0.24, fontSize: 11.5, bold: true, color: C.ink });
    addText(slide, state, { x: x + 1.64, y: 6.26, w: 1.06, h: 0.24, fontSize: 11.5, bold: true, color: onPaper(C.success), align: "right" });
  });
  addText(slide, "Verde no significa correcto: el 4.0 desapareció del cálculo.", {
    x: 7.42,
    y: 6.18,
    w: 5.18,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: onPaper(C.red),
    align: "right",
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 21 ACTIVAR B905
function slideActivarB905() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · La configuración también decide",
    "Ruff ve lo que le pedimos que vea",
    "B905 pertenece a la familia B de flake8-bugbear, que no está activa por defecto.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 4.1,
    h: 1.5,
    title: "pyproject.toml",
    code: '[tool.ruff.lint]\nextend-select = ["B"]',
    lang: "toml",
    fontSize: 15,
  });
  addText(slide, "extend-select", {
    x: M,
    y: 4.22,
    w: 1.72,
    h: 0.25,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 13,
    bold: true,
    color: CYAN_ON_PAPER,
  });
  addText(slide, "agrega una familia de reglas a las que Ruff ya tenía activas; no reemplaza la selección anterior.", {
    x: M,
    y: 4.56,
    w: 4.1,
    h: 0.78,
    fontSize: 13.2,
    color: C.slate,
    lineSpacingMultiple: 1.18,
  });

  addTerminalPanel(slide, SH, {
    x: 5.18,
    y: 2.52,
    w: 7.43,
    h: 2.82,
    title: "PowerShell · Ruff después de activar B",
    fontSize: 11.2,
    lines: [
      { prompt: ">", text: "uv run ruff check" },
      { text: "B905 `zip()` without an explicit `strict=` parameter" },
      { text: "  --> notas.py:18:35" },
      { text: "help: Add explicit value for parameter `strict=`" },
      { text: "Found 1 error." },
    ],
  });

  const beforeAfter = [
    ["ANTES", "B desactivada", "All checks passed!", C.success],
    ["DESPUÉS", "B activada", "B905 encontrado", C.red],
  ];
  beforeAfter.forEach(([label, config, result, accent], i) => {
    const x = M + i * 6.04;
    rect(slide, x, 5.78, 5.64, 0.88, i === 0 ? "E9F2EC" : "F3EAE1");
    addText(slide, label, { x: x + 0.24, y: 5.96, w: 0.9, h: 0.22, fontSize: 10, bold: true, color: onPaper(accent), charSpacing: 1.1 });
    addText(slide, config, { x: x + 1.24, y: 5.9, w: 1.72, h: 0.28, fontSize: 13, bold: true, color: C.ink });
    addText(slide, result, { x: x + 3.14, y: 5.9, w: 2.18, h: 0.28, fontFace: TYPOGRAPHY.mono, fontSize: 11.5, bold: true, color: onPaper(accent), align: "right" });
  });

  addText(slide, "La cobertura del linter depende de una decisión registrada en la configuración.", {
    x: M,
    y: 6.78,
    w: 11.89,
    h: 0.26,
    fontSize: 14,
    bold: true,
    color: C.navy,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 22 STRICT TRUE
function slideStrictTrue() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · De invisible a ruidoso",
    "strict=True impide perder datos en silencio",
    "La corrección no inventa pesos: obliga a resolver la inconsistencia antes de calcular.",
    false
  );

  addCodePanel(slide, SH, {
    x: M,
    y: 2.5,
    w: 11.89,
    h: 1.26,
    title: "Cambio mínimo en la comprensión",
    code: "total = sum(n * p for n, p in zip(notas, pesos, strict=True))",
    lang: "python",
    fontSize: 17,
  });

  const paths = [
    {
      x: M,
      accent: C.success,
      label: "MISMA LONGITUD",
      input: "3 notas + 3 pesos",
      action: "zip() forma 3 pares",
      outcome: "continúa el cálculo",
    },
    {
      x: 6.76,
      accent: C.red,
      label: "LONGITUD DISTINTA",
      input: "3 notas + 2 pesos",
      action: "zip() detecta el desfase",
      outcome: "lanza ValueError",
    },
  ];
  paths.forEach((p) => {
    const color = onPaper(p.accent);
    rect(slide, p.x, 4.12, 5.85, 1.78, p.accent === C.success ? "E9F2EC" : "F3EAE1", C.border, 0.05);
    addText(slide, p.label, { x: p.x + 0.28, y: 4.32, w: 2.62, h: 0.22, fontSize: 10, bold: true, color, charSpacing: 1.2 });
    addText(slide, p.input, { x: p.x + 0.28, y: 4.72, w: 1.72, h: 0.3, fontFace: TYPOGRAPHY.mono, fontSize: 13, bold: true, color: C.ink });
    addText(slide, "→", { x: p.x + 2.08, y: 4.68, w: 0.36, h: 0.3, fontSize: 19, bold: true, color });
    addText(slide, p.action, { x: p.x + 2.52, y: 4.7, w: 2.94, h: 0.34, fontSize: 12.7, bold: true, color: C.ink });
    rule(slide, p.x + 0.28, 5.2, 5.3, C.border, 1);
    addText(slide, p.outcome, { x: p.x + 0.28, y: 5.4, w: 5.3, h: 0.28, fontSize: 15, bold: true, color, align: "center" });
  });

  rect(slide, M, 6.24, 11.89, 0.56, C.navy);
  addText(slide, "Ruff lo advierte leyendo el código; strict=True hace que Python lo detenga cuando se ejecuta.", {
    x: M + 0.3,
    y: 6.36,
    w: 11.3,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 23 ESTILO O DEFECTO
function slideEstiloODefecto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.2 · No todas las reglas pesan igual",
    "Estilo y defecto exigen decisiones distintas",
    "Un linter puede uniformar la escritura y también advertir patrones que cambian el comportamiento.",
    false
  );

  const columns = [
    {
      x: M,
      accent: CYAN,
      title: "REGLA DE ESTILO",
      example: "E501 · línea demasiado larga",
      effect: "El código queda menos legible o menos uniforme.",
      silence: "Silenciarla es una convención de equipo: se explica el criterio.",
    },
    {
      x: 6.76,
      accent: C.red,
      title: "REGLA DE DEFECTO",
      example: "B905 · zip() sin strict=",
      effect: "El programa puede producir un resultado imprevisto.",
      silence: "Silenciarla acepta un riesgo conocido: exige un argumento escrito.",
    },
  ];
  columns.forEach((col) => {
    const color = onPaper(col.accent);
    rect(slide, col.x, 2.62, 5.85, 3.3, C.white, C.border, 0.05);
    rect(slide, col.x, 2.62, 5.85, 0.12, color);
    addText(slide, col.title, { x: col.x + 0.3, y: 2.94, w: 3.2, h: 0.22, fontSize: 10.5, bold: true, color, charSpacing: 1.35 });
    addText(slide, col.example, { x: col.x + 0.3, y: 3.38, w: 5.22, h: 0.36, fontFace: TYPOGRAPHY.mono, fontSize: 14.5, bold: true, color: C.ink });
    addText(slide, "Si se incumple", { x: col.x + 0.3, y: 4.0, w: 1.5, h: 0.24, fontSize: 11, bold: true, color: C.slate });
    addText(slide, col.effect, { x: col.x + 1.78, y: 3.98, w: 3.74, h: 0.54, fontSize: 13, color: C.ink });
    rule(slide, col.x + 0.3, 4.72, 5.22, C.border, 1);
    addText(slide, "Si se silencia", { x: col.x + 0.3, y: 4.98, w: 1.5, h: 0.24, fontSize: 11, bold: true, color: C.slate });
    addText(slide, col.silence, { x: col.x + 1.78, y: 4.94, w: 3.74, h: 0.62, fontSize: 13, bold: true, color });
  });

  rect(slide, M, 6.24, 11.89, 0.58, C.navy);
  addText(slide, "Configurar hasta que el mensaje desaparezca no es una decisión técnica.", {
    x: M + 0.28,
    y: 6.36,
    w: 11.32,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 24 DOS BARRERAS
function slideDosBarreras() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.3 · Complementarias, no intercambiables",
    "Las dos barreras no se solapan",
    "Pyrefly compara contratos de tipos; Ruff reconoce patrones riesgosos y reglas de calidad.",
    false
  );

  const x0 = M;
  const cols = [6.55, 2.2, 2.2];
  const heads = ["Defecto", "Pyrefly", "Ruff"];
  let x = x0;
  heads.forEach((head, i) => {
    rect(slide, x, 2.58, cols[i], 0.56, i === 0 ? C.navy : i === 1 ? CYAN_ON_PAPER : onPaper(C.red));
    addText(slide, head, { x: x + 0.18, y: 2.7, w: cols[i] - 0.36, h: 0.25, fontSize: 12, bold: true, color: C.white, align: i === 0 ? "left" : "center" });
    x += cols[i];
  });
  const rows = [
    ["zip() descarta elementos · B905", "NO", "SÍ, con B"],
    ["None donde se espera list[float]", "SÍ", "NO"],
    ["Declara float y devuelve str", "SÍ", "NO"],
    ["Variable asignada y no usada · F841", "NO", "SÍ"],
    ["Fecha sin zona horaria · DTZ005", "NO", "SÍ"],
  ];
  rows.forEach((row, r) => {
    const y = 3.14 + r * 0.62;
    const fill = r % 2 === 0 ? C.white : "EDF1F3";
    rect(slide, x0, y, cols[0], 0.62, fill, C.border);
    rect(slide, x0 + cols[0], y, cols[1], 0.62, fill, C.border);
    rect(slide, x0 + cols[0] + cols[1], y, cols[2], 0.62, fill, C.border);
    addText(slide, row[0], { x: x0 + 0.2, y: y + 0.16, w: cols[0] - 0.4, h: 0.28, fontSize: 12.5, color: C.ink });
    addText(slide, row[1], { x: x0 + cols[0], y: y + 0.15, w: cols[1], h: 0.28, fontSize: 12.5, bold: true, color: row[1] === "NO" ? C.slate : CYAN_ON_PAPER, align: "center" });
    addText(slide, row[2], { x: x0 + cols[0] + cols[1], y: y + 0.15, w: cols[2], h: 0.28, fontSize: 12.5, bold: true, color: row[2] === "NO" ? C.slate : onPaper(C.red), align: "center" });
  });

  rect(slide, M, 6.46, 11.89, 0.42, C.navy);
  addText(slide, "En verde juntas: el código respetó los contratos declarados y las reglas activas. Nada más.", {
    x: M + 0.22,
    y: 6.52,
    w: 11.45,
    h: 0.28,
    fontSize: 13.5,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 25 TECHO DE LAS DOS
function slideTechoEstatico() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.4 · Experimento final",
    "Dos verdes y un resultado incorrecto",
    "Restauramos a propósito un redondeo que incumple la regla del producto: 3,95 debe informarse como 4,0.",
    false,
    { subtitleFontSize: 13.5 }
  );

  const code = [
    "def nota_final(notas: list[float]) -> float:",
    "    promedio = sum(notas) / len(notas)",
    "    return round(promedio, 1)",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 5.38,
    h: 1.72,
    title: "notas.py · versión ingenua",
    code,
    lang: "python",
    fontSize: 13.3,
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.5,
    w: 5.38,
    h: 1.88,
    title: "pytest · ejecución real",
    fontSize: 9.7,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "assert nota_final([3.8, 4.1, 3.95]) == 4.0" },
      { text: "E assert 3.9 == 4.0" },
      { text: "1 failed, 1 passed in 0.09s" },
    ],
  });

  const results = [
    {
      y: 2.54,
      accent: C.success,
      tool: "PYREFLY",
      status: "VERDE · 0 errores",
      reason: "Los tipos coinciden: entra list[float] y sale float.",
    },
    {
      y: 3.78,
      accent: C.success,
      tool: "RUFF",
      status: "VERDE · sin alertas",
      reason: "La forma del código respeta las reglas activas.",
    },
    {
      y: 5.02,
      accent: C.red,
      tool: "PYTEST",
      status: "ROJO · falla la prueba",
      reason: "Al ejecutar aparece 3,9; el producto exige 4,0.",
    },
  ];
  results.forEach((r) => {
    const color = onPaper(r.accent);
    rect(slide, 6.42, r.y, 6.18, 1.02, r.accent === C.success ? "E9F2EC" : "F3EAE1", C.border, 0.04);
    addText(slide, r.tool, { x: 6.7, y: r.y + 0.18, w: 1.1, h: 0.22, fontSize: 10, bold: true, color, charSpacing: 1.1 });
    addText(slide, r.status, { x: 7.94, y: r.y + 0.14, w: 4.32, h: 0.28, fontSize: 14, bold: true, color, align: "right" });
    addText(slide, r.reason, { x: 6.7, y: r.y + 0.52, w: 5.56, h: 0.3, fontSize: 12.3, color: C.ink });
  });

  rect(slide, 6.42, 6.28, 6.18, 0.56, C.navy);
  addText(slide, "La regla 3,95 → 4,0 vive en el acuerdo del producto, no en los tipos ni en el estilo.", {
    x: 6.68,
    y: 6.38,
    w: 5.66,
    h: 0.32,
    fontSize: 12.7,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 26 PREGUNTAS BLOQUE 3
function slidePreguntasB3() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre del Bloque 3", "Tres preguntas antes de seguir", "", false);

  const preguntas = [
    [
      CYAN,
      "¿Por qué desactivar una regla de defecto exige un argumento escrito?",
      "Compara qué riesgo se acepta cuando ese diagnóstico deja de aparecer.",
    ],
    [
      C.gold,
      "Si Pyrefly y Ruff están en verde, ¿qué puedes afirmar sobre el proyecto?",
      "Enuncia una afirmación acotada: contratos declarados y reglas activas.",
    ],
    [
      C.red,
      "¿Por qué el defecto de redondeo no se detecta leyendo el código?",
      "Pregunta dónde está escrita la regla que exige informar 3,95 como 4,0.",
    ],
  ];

  preguntas.forEach(([accent, pregunta, pista], i) => {
    const y = 2.36 + i * 1.52;
    addCircleLabel(slide, M, y + 0.08, 0.5, onPaper(accent), String(i + 1), { fontSize: 15 });
    addText(slide, pregunta, {
      x: M + 0.78,
      y,
      w: 11.1,
      h: 0.72,
      fontSize: 18.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, M + 0.78, y + 0.8, 0.72, 0.28, onPaper(accent));
    addText(slide, "PISTA", {
      x: M + 0.78,
      y: y + 0.8,
      w: 0.72,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, pista, {
      x: M + 1.66,
      y: y + 0.8,
      w: 10.2,
      h: 0.3,
      fontSize: 13.2,
      color: C.slate,
      valign: "mid",
    });
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, 11.89, C.border, 0.75);
  });

  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 27 APERTURA BLOQUE 4
function slideAperturaB4() {
  const { slide } = createSlide("dark");

  addText(slide, "BLOQUE", {
    x: M,
    y: 1.3,
    w: 1.45,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: C.gold,
    charSpacing: 2.2,
  });
  addText(slide, "04", {
    x: M,
    y: 1.64,
    w: 2.25,
    h: 1.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 64,
    bold: true,
    color: C.white,
  });
  vrule(slide, 3.0, 1.34, 4.92, C.red, 4);
  addText(slide, "El agente lo arregló…\n¿o lo hizo desaparecer?", {
    x: 3.42,
    y: 1.34,
    w: 8.5,
    h: 1.66,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.02,
  });
  addText(slide, "Una corrección se audita con el caso que dejó de fallar, no con el silencio de la herramienta.", {
    x: 3.44,
    y: 3.26,
    w: 8.36,
    h: 0.64,
    fontSize: 18,
    color: C.softBlue,
    lineSpacingMultiple: 1.18,
  });

  rect(slide, M, 4.62, 4.62, 1.28, "163247", "496175", 0.06);
  addText(slide, "EL AGENTE PROPONE", {
    x: M + 0.3,
    y: 4.88,
    w: 3.9,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 1.5,
  });
  addText(slide, "una forma de dejar el análisis en verde", {
    x: M + 0.3,
    y: 5.26,
    w: 3.9,
    h: 0.32,
    fontSize: 14.5,
    color: C.white,
  });
  addText(slide, "→", {
    x: 5.56,
    y: 4.94,
    w: 0.72,
    h: 0.48,
    fontSize: 28,
    bold: true,
    color: C.red,
    align: "center",
  });
  rect(slide, 6.54, 4.62, 6.07, 1.28, "19384A", "496175", 0.06);
  addText(slide, "TÚ AUDITAS", {
    x: 6.86,
    y: 4.88,
    w: 2.4,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.5,
  });
  addText(slide, "qué comportamiento cambió y qué prueba lo demuestra", {
    x: 6.86,
    y: 5.26,
    w: 5.28,
    h: 0.32,
    fontSize: 14.5,
    color: C.white,
  });

  addText(slide, "25 MINUTOS · DEMOSTRACIÓN Y AUDITORÍA CON EVIDENCIA", {
    x: M,
    y: 6.48,
    w: 7.2,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.25,
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 28 ENCARGO NEUTRO
function slideEncargoNeutro() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.1 · El encargo",
    "La instrucción ya viene incompleta",
    "El diagnóstico técnico es claro; la decisión de producto todavía no existe.",
    false
  );

  const code = [
    "def nota_de(",
    "    alumno: str,",
    "    registro: dict[str, list[float]],",
    ") -> float:",
    "    notas = registro.get(alumno)",
    "    return nota_final(notas)",
  ].join("\n");
  addCodePanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 5.24,
    h: 2.82,
    title: "notas.py · diagnóstico abierto",
    code,
    lang: "python",
    fontSize: 11.5,
  });

  rect(slide, 6.26, 2.52, 6.35, 0.92, C.white, C.border, 0.05);
  rect(slide, 6.26, 2.52, 0.09, 0.92, C.red);
  addText(slide, "«Este código produce el siguiente error de tipos. Corrígelo.»", {
    x: 6.62,
    y: 2.76,
    w: 5.62,
    h: 0.36,
    fontSize: 16,
    bold: true,
    color: C.ink,
  });

  addTerminalPanel(slide, SH, {
    x: 6.26,
    y: 3.72,
    w: 6.35,
    h: 1.62,
    title: "Pyrefly · la salida rápida",
    fontSize: 9.5,
    lines: [
      { text: "Found 1 errors. We can add suppression comments" },
      { text: "to silence them for you." },
      { text: "Would you like to suppress them? (y/N):" },
    ],
  });

  addText(slide, "LO QUE EL ENCARGO NO DICE", {
    x: M,
    y: 5.72,
    w: 3.0,
    h: 0.22,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.35,
  });
  rect(slide, M, 6.06, 11.89, 0.68, C.paleRed);
  addText(slide, "¿Qué debe ocurrir cuando el alumno no existe?", {
    x: M + 0.3,
    y: 6.2,
    w: 5.0,
    h: 0.3,
    fontSize: 17,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "Sin esa respuesta, el agente solo puede elegir por nosotros.", {
    x: 6.24,
    y: 6.22,
    w: 6.05,
    h: 0.28,
    fontSize: 13.5,
    color: C.ink,
    align: "right",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 29 TRES DESENLACES
function slideTresDesenlaces() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.2 · Tres desenlaces posibles",
    "El mensaje desaparece en los tres",
    "Para Pyrefly son equivalentes; para el producto, no.",
    false
  );

  rect(slide, 4.62, 2.54, 4.1, 0.7, C.navy);
  addText(slide, "DIAGNÓSTICO", {
    x: 4.62,
    y: 2.74,
    w: 4.1,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.white,
    align: "center",
    charSpacing: 1.4,
  });

  const outcomes = [
    {
      x: M,
      accent: C.slate,
      letter: "A",
      title: "Silenciar",
      desc: "La advertencia se tapa; el caso sigue fallando.",
      verdict: "DEFECTO INTACTO",
    },
    {
      x: 4.77,
      accent: C.red,
      letter: "B",
      title: "Complacer",
      desc: "La lógica cambia para satisfacer el tipo.",
      verdict: "PUEDE EMPEORAR",
    },
    {
      x: 8.82,
      accent: C.success,
      letter: "C",
      title: "Decidir",
      desc: "El caso ausente recibe un comportamiento explícito.",
      verdict: "PROBLEMA RESUELTO",
    },
  ];
  outcomes.forEach((o) => {
    const color = onPaper(o.accent);
    slide.addShape(SH.line, {
      x: o.x + 1.79,
      y: 3.24,
      w: 0,
      h: 0.58,
      line: { color: C.guide, pt: 1.5, endArrowType: "triangle" },
    });
    rect(slide, o.x, 3.82, 3.58, 2.18, C.white, C.border, 0.05);
    addCircleLabel(slide, o.x + 0.28, 4.08, 0.58, color, o.letter, { fontSize: 17 });
    addText(slide, o.title, {
      x: o.x + 1.02,
      y: 4.06,
      w: 2.2,
      h: 0.32,
      fontSize: 18,
      bold: true,
      color,
    });
    addText(slide, o.desc, {
      x: o.x + 0.3,
      y: 4.66,
      w: 2.98,
      h: 0.58,
      fontSize: 13.3,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rule(slide, o.x + 0.3, 5.38, 2.98, C.border, 1);
    addText(slide, o.verdict, {
      x: o.x + 0.3,
      y: 5.58,
      w: 2.98,
      h: 0.24,
      fontSize: 10.5,
      bold: true,
      color,
      align: "center",
      charSpacing: 1.05,
    });
  });

  rect(slide, M, 6.34, 11.89, 0.52, C.navy);
  addText(slide, "La diferencia no está en el color del análisis: está en el comportamiento que quedó después.", {
    x: M + 0.26,
    y: 6.44,
    w: 11.37,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 30 A Y B NO RESUELVEN
function slideSilenciarOEmpeorar() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.2 · Dos falsos verdes",
    "A tapa el aviso; B mueve el fallo",
    "Ambas versiones dejan Pyrefly conforme sin decidir qué debe pasar con un alumno inexistente.",
    false,
    { subtitleFontSize: 13.5 }
  );

  const codeA = [
    "def nota_de(",
    "    alumno: str,",
    "    registro: dict[str, list[float]],",
    ") -> float:",
    "    notas = registro.get(alumno)",
    "    return nota_final(notas)  # type: ignore[arg-type]",
  ].join("\n");
  const codeB = [
    "def nota_de(",
    "    alumno: str,",
    "    registro: dict[str, list[float]],",
    ") -> float:",
    "    notas = registro.get(alumno, [])",
    "    return nota_final(notas)",
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: 5.76,
    h: 2.82,
    title: "A · Silenciar el diagnóstico",
    code: codeA,
    lang: "python",
    fontSize: 9.7,
  });
  addCodePanel(slide, SH, {
    x: 6.84,
    y: 2.54,
    w: 5.77,
    h: 2.82,
    title: "B · Complacer al verificador",
    code: codeB,
    lang: "python",
    fontSize: 10,
  });

  rect(slide, M, 5.7, 5.76, 0.96, C.mist, C.border, 0.04);
  addText(slide, "alumno ausente → None → falla en nota_final", {
    x: M + 0.24,
    y: 5.9,
    w: 5.28,
    h: 0.26,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 11.5,
    bold: true,
    color: C.slate,
    align: "center",
  });
  addText(slide, "El mensaje se fue; nada fue corregido.", {
    x: M + 0.24,
    y: 6.28,
    w: 5.28,
    h: 0.24,
    fontSize: 12.5,
    bold: true,
    color: C.slate,
    align: "center",
  });

  rect(slide, 6.84, 5.7, 5.77, 0.96, C.paleRed, C.border, 0.04);
  addText(slide, "alumno ausente → [] → división por cero", {
    x: 7.08,
    y: 5.9,
    w: 5.29,
    h: 0.26,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 11.5,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });
  addText(slide, "Es peor: falla más lejos y con menos contexto.", {
    x: 7.08,
    y: 6.28,
    w: 5.29,
    h: 0.24,
    fontSize: 12.5,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 31 DECIDIR Y PROBAR
function slideDecidirYProbar() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · La corrección auditable",
    "La decisión se escribe; la prueba la comprueba",
    "Elegimos un error explícito para el alumno ausente y verificamos ese comportamiento al ejecutar.",
    false,
    { subtitleFontSize: 13.5 }
  );

  const implementation = [
    "def nota_de(",
    "    alumno: str,",
    "    registro: dict[str, list[float]],",
    ") -> float:",
    "    notas = registro.get(alumno)",
    "    if notas is None:",
    "        raise KeyError(f\"No hay notas registradas para {alumno}\")",
    "    return nota_final(notas)",
  ].join("\n");
  const testCode = [
    "def test_alumno_inexistente() -> None:",
    "    registro = {\"Ana\": [6.0]}",
    "    with pytest.raises(KeyError, match=\"Luis\"):",
    "        nota_de(\"Luis\", registro)",
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.52,
    w: 6.04,
    h: 3.3,
    title: "C · Decisión explícita en notas.py",
    code: implementation,
    lang: "python",
    fontSize: 9.6,
  });
  addCodePanel(slide, SH, {
    x: 7.04,
    y: 2.52,
    w: 5.57,
    h: 2.18,
    title: "test_notas.py · expectativa ejecutable",
    code: testCode,
    lang: "python",
    fontSize: 9.7,
  });
  addTerminalPanel(slide, SH, {
    x: 7.04,
    y: 4.94,
    w: 5.57,
    h: 0.88,
    title: "pytest · evidencia verde",
    fontSize: 9.7,
    lines: [
      { prompt: ">", text: "uv run pytest -q   →   3 passed in 0.08s" },
    ],
  });

  rect(slide, M, 6.12, 11.89, 0.68, C.navy);
  addText(slide, "REGLA DE AUDITORÍA", {
    x: M + 0.26,
    y: 6.34,
    w: 1.72,
    h: 0.22,
    fontSize: 9.8,
    bold: true,
    color: C.gold,
    charSpacing: 1.2,
  });
  addText(slide, "Muestra qué caso concreto dejó de fallar. Si solo desapareció el mensaje, el defecto está tapado.", {
    x: M + 2.08,
    y: 6.28,
    w: 9.48,
    h: 0.34,
    fontSize: 13.4,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 32 PREGUNTAS BLOQUE 4
function slidePreguntasB4() {
  const { slide } = createSlide("light");
  addHeader(slide, "Cierre del Bloque 4", "Tres preguntas antes de cerrar", "", false);

  const preguntas = [
    [
      CYAN,
      "¿Por qué usar registro.get(alumno, []) puede dejar el sistema peor?",
      "Compara dónde falla cada versión y cuánta información entrega.",
    ],
    [
      C.gold,
      "¿Qué parte del problema no podía decidir el agente?",
      "Identifica quién es la fuente de verdad del comportamiento esperado.",
    ],
    [
      C.red,
      "¿Por qué la expectativa debe fijarse antes de ver la corrección?",
      "Una solución razonable puede cambiar el criterio con el que luego la juzgas.",
    ],
  ];

  preguntas.forEach(([accent, pregunta, pista], i) => {
    const y = 2.36 + i * 1.52;
    addCircleLabel(slide, M, y + 0.08, 0.5, onPaper(accent), String(i + 1), { fontSize: 15 });
    addText(slide, pregunta, {
      x: M + 0.78,
      y,
      w: 11.1,
      h: 0.72,
      fontSize: 18.5,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rect(slide, M + 0.78, y + 0.8, 0.72, 0.28, onPaper(accent));
    addText(slide, "PISTA", {
      x: M + 0.78,
      y: y + 0.8,
      w: 0.72,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
      valign: "mid",
      charSpacing: 0.8,
    });
    addText(slide, pista, {
      x: M + 1.66,
      y: y + 0.8,
      w: 10.2,
      h: 0.3,
      fontSize: 13.2,
      color: C.slate,
      valign: "mid",
    });
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, 11.89, C.border, 0.75);
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 33 EVIDENCIA DE SALIDA
function slideEvidenciaSalida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre de la clase · Recorrido",
    "Lo que hoy quedó registrado",
    "La clase avanzó desde evidencia de proyecto hasta evidencia sobre una corrección propuesta por un agente.",
    false,
    { subtitleFontSize: 13.3 }
  );

  const route = [
    ["1", "Proyecto", "indicadores"],
    ["2", "Pyrefly", "contratos"],
    ["3", "Ruff", "patrones"],
    ["4", "Agente", "auditoría"],
  ];
  route.forEach(([n, title, desc], i) => {
    const x = M + i * 3.02;
    if (i < route.length - 1) {
      slide.addShape(SH.line, {
        x: x + 2.36,
        y: 3.16,
        w: 0.54,
        h: 0,
        line: { color: C.guide, pt: 1.4, endArrowType: "triangle" },
      });
    }
    addCircleLabel(slide, x, 2.86, 0.6, [CYAN_ON_PAPER, C.navy, onPaper(C.red), onPaper(C.gold)][i], n, { fontSize: 16 });
    addText(slide, title, { x: x + 0.78, y: 2.82, w: 1.58, h: 0.3, fontSize: 15, bold: true, color: C.ink });
    addText(slide, desc, { x: x + 0.78, y: 3.18, w: 1.58, h: 0.25, fontSize: 11.8, color: C.slate });
  });

  rule(slide, M, 3.74, 11.89, C.border, 1.2);
  addText(slide, "EVIDENCIA MÍNIMA DE SALIDA", {
    x: M,
    y: 4.08,
    w: 3.2,
    h: 0.22,
    fontSize: 10.2,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.35,
  });
  const evidence = [
    "Cuatro indicadores aplicados al repositorio",
    "Una función anotada y sus diagnósticos clasificados",
    "Pyrefly y Ruff configurados con decisiones justificadas",
    "Tres herramientas frente al defecto de redondeo",
    "Una corrección de agente auditada con una prueba",
  ];
  evidence.forEach((item, i) => {
    const col = i < 3 ? 0 : 1;
    const row = col === 0 ? i : i - 3;
    const x = col === 0 ? M : 7.0;
    const y = 4.58 + row * 0.66;
    addCircleLabel(slide, x, y, 0.32, col === 0 ? CYAN_ON_PAPER : onPaper(C.success), "✓", { fontSize: 11 });
    addText(slide, item, {
      x: x + 0.48,
      y: y + 0.02,
      w: col === 0 ? 5.58 : 5.1,
      h: 0.32,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 34 AFIRMACIÓN ACOTADA
function slideAfirmacionAcotada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre de la clase · Alcance",
    "Dos frases parecidas; solo una está demostrada",
    "Las herramientas estáticas entregan evidencia real, pero acotada.",
    false
  );

  addText(slide, "SÍ PODEMOS AFIRMAR", {
    x: M,
    y: 2.54,
    w: 3.5,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: onPaper(C.success),
    charSpacing: 1.4,
  });
  rect(slide, M, 2.94, 11.89, 1.2, C.successSoft, C.border, 0.05);
  addText(slide, "El código es consistente con los contratos que declaramos,\ny no contiene los patrones de defecto que decidimos vigilar.", {
    x: M + 0.46,
    y: 3.18,
    w: 10.97,
    h: 0.7,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.ink,
    align: "center",
    lineSpacingMultiple: 1.1,
  });

  addText(slide, "NO PODEMOS AFIRMAR TODAVÍA", {
    x: M,
    y: 4.6,
    w: 4.2,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.4,
  });
  rect(slide, M, 5.0, 11.89, 0.94, C.paleRed, C.border, 0.05);
  addText(slide, "El código hace lo que el producto necesita.", {
    x: M + 0.46,
    y: 5.24,
    w: 10.97,
    h: 0.42,
    fontFace: TYPOGRAPHY.display,
    fontSize: 24,
    bold: true,
    color: onPaper(C.red),
    align: "center",
  });

  addText(slide, "La distancia entre ambas frases es la Unidad 2 completa.", {
    x: M,
    y: 6.34,
    w: 11.89,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.navy,
    align: "center",
  });
  validateSlide(slide, pptx);
}

// ---------------------------------------------------- 35 CIERRE FINAL
function slideCierreFinal() {
  const { slide } = createSlide("dark");

  addText(slide, "CIERRE DE LA CLASE", {
    x: M,
    y: 0.62,
    w: 4.0,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.8,
  });
  addText(slide, "Antes de salir", {
    x: M,
    y: 1.0,
    w: 5.4,
    h: 0.72,
    fontFace: TYPOGRAPHY.display,
    fontSize: 34,
    bold: true,
    color: C.white,
  });

  const tickets = [
    "¿Qué diagnóstico apareció solo después de anotar y qué caso haría fallar?",
    "¿Qué regla habilitaste en el linter y por qué esa?",
    "¿Qué dijeron Pyrefly y Ruff sobre el defecto de redondeo?",
  ];
  tickets.forEach((q, i) => {
    const y = 2.0 + i * 1.06;
    addCircleLabel(slide, M, y, 0.48, [CYAN_ON_NAVY, C.gold, C.red][i], String(i + 1), {
      fontSize: 14,
      color: i === 1 ? C.navy : C.white,
    });
    addText(slide, q, {
      x: M + 0.72,
      y: y - 0.02,
      w: 5.16,
      h: 0.58,
      fontSize: 15,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.12,
    });
  });

  vrule(slide, 6.68, 1.1, 4.72, C.red, 3);
  addText(slide, "PRÓXIMA CLASE", {
    x: 7.12,
    y: 1.08,
    w: 3.0,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.5,
  });
  addText(slide, "Cuando la revisión\ntambién es una prueba", {
    x: 7.12,
    y: 1.52,
    w: 5.05,
    h: 1.02,
    fontFace: TYPOGRAPHY.display,
    fontSize: 27,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.04,
  });
  addText(slide, "Un agente escribe, otro audita y tú arbitras entre ambos con criterios verificables.", {
    x: 7.12,
    y: 2.9,
    w: 4.98,
    h: 0.72,
    fontSize: 16,
    color: C.softBlue,
    lineSpacingMultiple: 1.2,
  });
  rect(slide, 7.12, 4.0, 5.04, 1.34, "19384A", "496175", 0.05);
  addText(slide, "La pregunta que sigue", {
    x: 7.42,
    y: 4.24,
    w: 2.6,
    h: 0.24,
    fontSize: 10.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.15,
  });
  addText(slide, "¿Dos modelos revisándose producen una revisión real o dos opiniones seguras?", {
    x: 7.42,
    y: 4.62,
    w: 4.46,
    h: 0.48,
    fontSize: 14.5,
    bold: true,
    color: C.white,
  });

  rule(slide, M, 5.82, 11.89, C.gold, 1.4);
  addText(slide, "Si solo puedes mostrar que el mensaje desapareció, no está corregido: está tapado.", {
    x: M + 0.4,
    y: 6.08,
    w: 11.09,
    h: 0.48,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: C.white,
    align: "center",
  });
  validateSlide(slide, pptx);
}

slidePortada();
slidePuntoDePartida();
slideMapa();
slideAperturaB1();
slideIndicadores();
slideContraSiMismo();
slideLineaDeTiempo();
slideProporcion();
slideCita();
slideEvidenciaAtribucion();
slidePreguntasB1();
slideAperturaB2();
slideEstaticasDinamicas();
slideZulip();
slideSilencioSinContrato();
slideAnotarRevela();
slideTraducirDiagnostico();
slidePreguntasB2();
slideAperturaB3();
slideZipSilencioso();
slideActivarB905();
slideStrictTrue();
slideEstiloODefecto();
slideDosBarreras();
slideTechoEstatico();
slidePreguntasB3();
slideAperturaB4();
slideEncargoNeutro();
slideTresDesenlaces();
slideSilenciarOEmpeorar();
slideDecidirYProbar();
slidePreguntasB4();
slideEvidenciaSalida();
slideAfirmacionAcotada();
slideCierreFinal();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`Deck generado: ${outputPptx} (${pptx._slides.length} slides)`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
