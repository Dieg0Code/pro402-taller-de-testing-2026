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
  subject: "PRO402 · Clase 06",
  title: "La revisión como prueba: método, evidencia y arbitraje",
});

const SH = pptx.ShapeType;
const W = 13.333;
const M = 0.72;
const CW = W - M * 2;
const outputPptx = path.resolve(__dirname, "..", "Clase-06-La-Revision-Como-Prueba.pptx");

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
    w: 7.6,
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
      w: opts.subtitleW || 11.4,
      h: opts.subtitleH || 0.44,
      fontSize: opts.subtitleFontSize || 14.5,
      color: dark ? C.softBlue : C.slate,
      lineSpacingMultiple: 1.14,
    });
  }
}

// Banda de conclusión al pie de una lámina clara.
function addTakeaway(slide, text, opts = {}) {
  const y = opts.y || 6.08;
  const h = opts.h || 0.76;
  rect(slide, M, y, CW, h, opts.fill || C.navy);
  addText(slide, text, {
    x: M + 0.34,
    y: y + 0.06,
    w: CW - 0.68,
    h: h - 0.12,
    fontSize: opts.fontSize || 14.6,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
    lineSpacingMultiple: 1.14,
  });
}

// ---------------------------------------------------------------- 01 PORTADA
function slidePortada() {
  const { slide } = createSlide("dark");

  addText(slide, "PRO402 · CLASE 06 · UNIDAD 01", {
    x: M,
    y: 1.42,
    w: 8.4,
    h: 0.26,
    fontSize: 11.6,
    bold: true,
    color: C.gold,
    charSpacing: 2.1,
  });

  addText(slide, "La revisión como prueba", {
    x: M,
    y: 1.86,
    w: 11,
    h: 1.12,
    fontFace: TYPOGRAPHY.display,
    fontSize: 52,
    bold: true,
    color: C.white,
  });

  rect(slide, M, 3.14, 2.6, 0.09, C.red);

  addText(
    slide,
    "Qué separa una lectura del código de una opinión sobre el código",
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
    ["FECHA", "Martes 1 de septiembre de 2026"],
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
      w: 3.6,
      h: 0.34,
      fontSize: 14.5,
      bold: true,
      color: C.white,
    });
  });

  addText(
    slide,
    "Marco de referencia · IEEE 1028-2008, revisiones de software · ISO/IEC/IEEE 29119-1:2022, pruebas estáticas",
    {
      x: M,
      y: 6.24,
      w: 11.4,
      h: 0.3,
      fontSize: 12.6,
      color: C.terminalMuted,
    }
  );

  validateSlide(slide, pptx);
}

// -------------------------------------------------------- 02 PUNTO DE PARTIDA
function slidePuntoDePartida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Punto de partida",
    "Ayer encontramos defectos sin ejecutar el programa",
    "",
    false,
    { titleW: 10.4 }
  );

  addText(slide, "LO QUE YA TENEMOS", {
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
    [
      C.navy,
      "Prueba estática",
      "comprueba el código leyéndolo, sin ponerlo en marcha",
    ],
    [
      CYAN,
      "pyrefly · verificador de tipos",
      "revisa que el código respete los tipos de dato que él mismo declara",
    ],
    [
      C.red,
      "ruff · linter",
      "revisa el código contra un catálogo de patrones de defecto ya conocidos",
    ],
  ];
  previos.forEach(([accent, titulo, glosa], i) => {
    const y = 2.58 + i * 1.16;
    rect(slide, M, y + 0.04, 0.055, 0.78, onPaper(accent));
    addText(slide, titulo, {
      x: M + 0.28,
      y,
      w: 4.5,
      h: 0.32,
      fontSize: 16.5,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.28,
      y: y + 0.36,
      w: 4.5,
      h: 0.52,
      fontSize: 12.8,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    if (i < previos.length - 1) rule(slide, M, y + 1.0, 4.8, C.border, 0.75);
  });

  vrule(slide, 5.9, 2.1, 4.2, C.border, 1);

  addText(slide, "LO QUE NINGUNA DE LAS DOS HACE", {
    x: 6.36,
    y: 2.12,
    w: 6.2,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.4,
  });

  rect(slide, 6.36, 2.6, 6.25, 2.62, C.warm);
  rect(slide, 6.36, 2.6, 0.08, 2.62, onPaper(C.red));

  addText(
    slide,
    "Las dos comparan el código contra algo escrito dentro del propio código. ¿Quién lo compara contra lo que el producto tenía que hacer?",
    {
      x: 6.76,
      y: 2.9,
      w: 5.6,
      h: 2.06,
      fontFace: TYPOGRAPHY.display,
      fontSize: 21,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.2,
    }
  );

  addText(
    slide,
    "Esa comparación no la hace una herramienta. Es la tercera prueba estática, y la más antigua de las tres.",
    {
      x: 6.36,
      y: 5.42,
      w: 6.25,
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
  addHeader(
    slide,
    "Mapa de la sesión",
    "De leer el código a decidir con evidencia",
    "",
    false
  );

  const bloques = [
    [
      C.navy,
      "08:40",
      "Bloque 1",
      "La prueba estática que no es una herramienta",
      "Qué es revisar, qué tipos de revisión existen, y qué pasa cuando no hay método",
    ],
    [
      CYAN,
      "09:05",
      "Bloque 2",
      "Qué se mira cuando se revisa",
      "Una lista de comprobación propia y tres clases distintas de hallazgo",
    ],
    [
      C.gold,
      "09:45",
      "Bloque 3",
      "Dos agentes, una decisión",
      "Un agente escribe, otro audita lo escrito, y tú decides entre los dos",
    ],
    [
      C.red,
      "10:15",
      "Bloque 4",
      "El arbitraje se resuelve ejecutando",
      "Cada hallazgo se convierte en una prueba antes de tocar el código",
    ],
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
      y: y + 0.06,
      w: 4.45,
      h: 0.66,
      fontSize: 12.6,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    if (i < bloques.length - 1) rule(slide, M, y + 0.9, CW, C.border, 0.75);
  });

  rule(slide, M, 6.6, CW, C.navy, 1.6);
  addText(
    slide,
    "08:30 encuadre  ·  09:35 pausa técnica  ·  10:40 cierre y ticket de salida",
    {
      x: M,
      y: 6.72,
      w: 10.2,
      h: 0.28,
      fontSize: 12.4,
      color: C.slate,
    }
  );

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

  addText(slide, "La prueba estática que no es una herramienta", {
    x: M + 3.02,
    y: 2.48,
    w: 9.0,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 36,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.98, 2.2, 0.07, C.red);

  addText(
    slide,
    "Qué es exactamente revisar código, qué formas de revisión reconoce la norma internacional, y qué le ocurrió a un proyecto que sí revisó y no le alcanzó.",
    {
      x: M + 3.02,
      y: 4.3,
      w: 8.5,
      h: 1.3,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.26,
    }
  );

  validateSlide(slide, pptx);
}

// -------------------------------------------- 05 CONTRA QUÉ COMPARA CADA UNA
function slideContraQueCompara() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.1 · Tres comprobaciones, tres fuentes distintas",
    "Toda comprobación compara el código contra algo",
    "Lo que distingue a una revisión no es quién la hace, sino contra qué compara: es la única que usa una fuente que está fuera del código.",
    false
  );

  const carriles = [
    {
      x: M,
      accent: onPaper(C.navy),
      fill: "E7ECF3",
      nombre: "pyrefly",
      glosa: "verificador de tipos",
      contra: "LOS TIPOS DECLARADOS",
      detalle:
        "Tipo de dato: la clase de valor que una función acepta y devuelve, escrita en el propio código.",
      pregunta: "¿El código respeta los contratos que él mismo declara?",
    },
    {
      x: M + 4.03,
      accent: CYAN_ON_PAPER,
      fill: "E8F1F2",
      nombre: "ruff",
      glosa: "linter",
      contra: "UN CATÁLOGO DE PATRONES",
      detalle:
        "Patrón: una forma de escribir código que suele terminar en defecto, descrita como regla y numerada.",
      pregunta: "¿Aparece alguna forma conocida de escribir un defecto?",
    },
    {
      x: M + 8.06,
      accent: onPaper(C.red),
      fill: "F6E7E2",
      nombre: "la revisión",
      glosa: "una persona leyendo",
      contra: "EL REQUISITO",
      detalle:
        "Requisito: la regla de negocio escrita en palabras, lo que el producto debe hacer, antes de existir como código.",
      pregunta: "¿El código hace lo que el producto pidió?",
    },
  ];

  const laneW = 3.83;
  carriles.forEach((c) => {
    rect(slide, c.x, 2.60, laneW, 3.36, c.fill);
    rect(slide, c.x, 2.60, laneW, 0.1, c.accent);

    addText(slide, c.nombre, {
      x: c.x + 0.28,
      y: 2.86,
      w: laneW - 0.56,
      h: 0.34,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 17,
      bold: true,
      color: c.accent,
    });
    addText(slide, c.glosa, {
      x: c.x + 0.28,
      y: 3.24,
      w: laneW - 0.56,
      h: 0.26,
      fontSize: 12.4,
      color: C.slate,
    });
    rule(slide, c.x + 0.28, 3.62, laneW - 0.56, C.border, 0.8);

    addText(slide, "COMPARA CONTRA", {
      x: c.x + 0.28,
      y: 3.74,
      w: laneW - 0.56,
      h: 0.2,
      fontSize: 8.8,
      bold: true,
      color: C.guide,
      charSpacing: 1.15,
    });
    addText(slide, c.contra, {
      x: c.x + 0.28,
      y: 3.98,
      w: laneW - 0.56,
      h: 0.5,
      fontSize: 14.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, c.detalle, {
      x: c.x + 0.28,
      y: 4.52,
      w: laneW - 0.56,
      h: 0.76,
      fontSize: 11.6,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    });
    addText(slide, c.pregunta, {
      x: c.x + 0.28,
      y: 5.32,
      w: laneW - 0.56,
      h: 0.56,
      fontSize: 12.4,
      lineSpacingMultiple: 1.12,
      bold: true,
      color: c.accent,
    });
  });

  addTakeaway(
    slide,
    "Las dos primeras comparan el código contra algo que vive dentro del código. La tercera es la única que mira hacia afuera.",
    { y: 6.16, h: 0.66 }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------- 06 EL CÓDIGO QUE PASA LAS BARRERAS
function slideCodigoQuePasa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.2 · El caso que lo demuestra",
    "Este código pasa las dos barreras y está mal igual",
    "El programa decide si un estudiante aprueba. La diferencia con lo que pidió el producto está en un solo carácter.",
    false
  );

  const code = [
    "def estado(notas: list[float], asistencia: float) -> str:",
    "    if nota_final(notas) >= 4.0 and asistencia > 70:",
    '        return "aprobado"',
    '    return "reprobado"',
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.48,
    w: 6.62,
    h: 1.80,
    title: "curso.py · decide si un estudiante aprueba",
    code,
    lang: "python",
    fontSize: 12.2,
  });

  rect(slide, 7.62, 2.48, 4.99, 1.80, C.warm);
  rect(slide, 7.62, 2.48, 0.08, 1.80, onPaper(C.red));
  addText(slide, "EL REQUISITO ESCRITO", {
    x: 7.94,
    y: 2.66,
    w: 4.4,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Aprueba quien cumple las dos condiciones:\nnota final mayor o igual a 4,0\nasistencia mayor o igual a 70 por ciento",
    {
      x: 7.94,
      y: 2.96,
      w: 4.4,
      h: 1.2,
      fontSize: 13.4,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.24,
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 4.42,
    w: 6.62,
    h: 1.66,
    title: "PowerShell · las dos barreras sobre este archivo",
    fontSize: 9.8,
    lines: [
      { prompt: ">", text: "uv run ruff check" },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "INFO 0 errors" },
    ],
  });

  rect(slide, 7.62, 4.42, 4.99, 1.66, "EDE9E1");
  addText(slide, "LA DIFERENCIA", {
    x: 7.94,
    y: 4.60,
    w: 4.4,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: C.guide,
    charSpacing: 1.15,
  });
  addText(slide, "el requisito dice", {
    x: 7.94,
    y: 4.96,
    w: 2.0,
    h: 0.26,
    fontSize: 12,
    color: C.slate,
  });
  addText(slide, ">=", {
    x: 9.98,
    y: 4.92,
    w: 0.7,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: onPaper(C.success),
  });
  addText(slide, "el programa dice", {
    x: 7.94,
    y: 5.36,
    w: 2.0,
    h: 0.26,
    fontSize: 12,
    color: C.slate,
  });
  addText(slide, ">", {
    x: 9.98,
    y: 5.32,
    w: 0.7,
    h: 0.3,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 16,
    bold: true,
    color: onPaper(C.red),
  });
  addText(slide, "El estudiante con exactamente 70 % reprueba.", {
    x: 7.94,
    y: 5.74,
    w: 4.4,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: onPaper(C.red),
  });

  addTakeaway(
    slide,
    "Revisar es comparar lo que el código hace contra lo que se supone que tenía que hacer, antes de ejecutarlo.",
    { y: 6.22, h: 0.60 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------- 07 LOS CINCO TIPOS · IEEE
function slideCincoTipos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.3 · La norma que ordena la palabra",
    "Cinco actividades distintas se llaman «revisión»",
    "El IEEE —organismo internacional de ingeniería eléctrica, electrónica y de computación— publica la norma 1028, que define cada una con su propósito, sus participantes y lo que debe quedar registrado.",
    false,
    { subtitleH: 0.6 }
  );

  const tipos = [
    [
      C.navy,
      "Revisión de gestión",
      "El avance, los planes y los plazos",
      "La jefatura",
      "Una decisión sobre el proyecto",
    ],
    [
      CYAN,
      "Revisión técnica",
      "Si el producto sirve para el uso previsto",
      "Personas con competencia técnica",
      "Un juicio técnico fundado",
    ],
    [
      C.red,
      "Inspección",
      "El producto, buscando anomalías",
      "Pares, con un facilitador imparcial",
      "Una lista de anomalías registradas",
    ],
    [
      C.gold,
      "Recorrido",
      "El producto, explicado por su autor",
      "El autor y su equipo",
      "Comentarios y aprendizaje",
    ],
    [
      C.slate,
      "Auditoría",
      "El cumplimiento de normas o contratos",
      "Un tercero independiente",
      "Evidencia de conformidad",
    ],
  ];

  const cols = [
    ["TIPO", M + 0.24, 2.38],
    ["QUÉ EXAMINA", 3.42, 3.32],
    ["QUIÉN PARTICIPA", 6.86, 2.72],
    ["QUÉ PRODUCE", 9.68, 2.93],
  ];
  cols.forEach(([label, x, w]) => {
    addText(slide, label, {
      x,
      y: 2.66,
      w,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.guide,
      charSpacing: 1.1,
    });
  });
  rule(slide, M, 2.94, CW, C.border, 0.9);

  tipos.forEach(([accent, tipo, examina, quien, produce], i) => {
    const y = 3.06 + i * 0.54;
    rect(slide, M, y + 0.04, 0.05, 0.36, onPaper(accent));
    addText(slide, tipo, {
      x: M + 0.24,
      y: y + 0.02,
      w: 2.38,
      h: 0.32,
      fontSize: 13.2,
      bold: true,
      color: C.ink,
    });
    addText(slide, examina, {
      x: 3.42,
      y: y + 0.04,
      w: 3.32,
      h: 0.3,
      fontSize: 11.8,
      color: C.slate,
    });
    addText(slide, quien, {
      x: 6.86,
      y: y + 0.04,
      w: 2.72,
      h: 0.3,
      fontSize: 11.8,
      color: C.slate,
    });
    addText(slide, produce, {
      x: 9.68,
      y: y + 0.04,
      w: 2.93,
      h: 0.3,
      fontSize: 11.8,
      color: C.slate,
    });
    if (i < tipos.length - 1) rule(slide, M, y + 0.46, CW, C.border, 0.6);
  });

  const distinciones = [
    [
      onPaper(C.red),
      "Solo la inspección busca defectos",
      "Las otras cuatro persiguen otra cosa y no fracasan si no encuentran ninguno.",
    ],
    [
      CYAN_ON_PAPER,
      "El facilitador no es el autor",
      "Quien conduce la inspección no escribió el código que se examina.",
    ],
    [
      onPaper(C.navy),
      "La auditoría la hace un tercero",
      "Es el único tipo donde la independencia es parte de la definición.",
    ],
  ];
  distinciones.forEach(([accent, titulo, glosa], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 5.86, 3.83, 1.0, "EDE9E1");
    rect(slide, x, 5.86, 3.83, 0.06, accent);
    addText(slide, titulo, {
      x: x + 0.24,
      y: 6.02,
      w: 3.35,
      h: 0.28,
      fontSize: 12.4,
      bold: true,
      color: accent,
    });
    addText(slide, glosa, {
      x: x + 0.24,
      y: 6.34,
      w: 3.35,
      h: 0.46,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  validateSlide(slide, pptx);
}

// -------------------------------------------------- 08 QUÉ FUE HEARTBLEED
function slideQueFueHeartbleed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.4 · El caso · primera parte",
    "Un defecto que pedía la memoria del servidor",
    "Para entender por qué este caso importa hay que saber dos cosas: qué es una biblioteca y qué hace OpenSSL.",
    false
  );

  const defs = [
    [
      onPaper(C.navy),
      "Biblioteca",
      "Código escrito una vez que otros programas incorporan en lugar de escribirlo ellos. Un defecto en una biblioteca viaja dentro de todos los programas que la usan.",
    ],
    [
      CYAN_ON_PAPER,
      "OpenSSL",
      "La biblioteca que cifra el tráfico de internet: convierte los datos en algo ilegible para quien los intercepte en el camino. En 2014 la usaba la mayoría de los servidores web del mundo.",
    ],
  ];
  defs.forEach(([accent, termino, glosa], i) => {
    const x = M + i * 6.05;
    rect(slide, x, 2.6, 5.84, 1.42, "EDE9E1");
    rect(slide, x, 2.6, 0.06, 1.42, accent);
    addText(slide, termino.toUpperCase(), {
      x: x + 0.3,
      y: 2.76,
      w: 5.2,
      h: 0.24,
      fontSize: 10.4,
      bold: true,
      color: accent,
      charSpacing: 1.3,
    });
    addText(slide, glosa, {
      x: x + 0.3,
      y: 3.06,
      w: 5.24,
      h: 0.84,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  addText(slide, "QUÉ PERMITÍA HACER EL DEFECTO", {
    x: M,
    y: 4.28,
    w: 6.0,
    h: 0.22,
    fontSize: 9.4,
    bold: true,
    color: C.guide,
    charSpacing: 1.3,
  });

  const pasos = [
    ["Cualquiera envía una petición", "sin clave ni permiso"],
    ["El servidor devuelve 64 KB", "de su memoria de trabajo"],
    ["Ahí viven claves y contraseñas", "y las sesiones de los usuarios"],
    ["No queda rastro", "el servidor no lo registra"],
  ];
  pasos.forEach(([titulo, glosa], i) => {
    const x = M + i * 3.02;
    rect(slide, x, 4.60, 2.76, 1.34, C.warm);
    addCircleLabel(slide, x + 0.22, 4.76, 0.34, onPaper(C.red), String(i + 1), {
      fontSize: 11,
    });
    addText(slide, titulo, {
      x: x + 0.22,
      y: 5.16,
      w: 2.36,
      h: 0.44,
      fontSize: 11.8,
      lineSpacingMultiple: 1.08,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: x + 0.22,
      y: 5.62,
      w: 2.36,
      h: 0.24,
      fontSize: 10.2,
      color: C.slate,
    });
    if (i < pasos.length - 1) {
      addText(slide, "→", {
        x: x + 2.80,
        y: 5.14,
        w: 0.18,
        h: 0.28,
        fontSize: 14,
        bold: true,
        color: onPaper(C.red),
        align: "center",
      });
    }
  });

  addTakeaway(
    slide,
    "Se llamó Heartbleed, y afectó a una parte enorme de los servidores del mundo al mismo tiempo.",
    { y: 6.10, h: 0.64 }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------------- 09 HEARTBLEED · LA CRONOLOGÍA
function slideCronologiaHeartbleed() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "1.5 · El caso · segunda parte",
    "El código sí fue revisado, y el defecto pasó igual",
    "",
    false,
    { titleW: 10.35 }
  );

  const hitos = [
    [
      onPaper(C.navy),
      "2011 · 15 dic",
      "El autor envía el cambio a openssl-dev",
      "openssl-dev es la lista de correo pública donde el proyecto propone y discute cambios.",
    ],
    [
      onPaper(C.red),
      "",
      "Recibe una sola respuesta de revisión",
      "Un desarrollador del proyecto lo lee y lo aprueba.",
    ],
    [
      onPaper(C.navy),
      "2011 · 31 dic",
      "El cambio se incorpora al proyecto",
      "",
    ],
    [
      onPaper(C.navy),
      "2012 · 14 mar",
      "Se publica en OpenSSL 1.0.1, activado por omisión",
      "Activado por omisión: funciona sin que nadie tenga que encenderlo.",
    ],
    [
      onPaper(C.gold),
      "2 años y 24 días",
      "El defecto vive en producción",
      "",
    ],
    [
      onPaper(C.red),
      "2014 · 07 abr",
      "Se divulga públicamente y se corrige",
      "",
    ],
  ];

  let cursorY = 2.24;
  hitos.forEach(([accent, fecha, titulo, glosa]) => {
    const y = cursorY;
    cursorY += glosa ? 0.78 : 0.56;
    addText(slide, fecha, {
      x: M,
      y: y + 0.02,
      w: 1.72,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.4,
      bold: true,
      color: accent,
    });
    rect(slide, M + 1.86, y - 0.02, 0.05, 0.5, accent);
    addText(slide, titulo, {
      x: M + 2.08,
      y,
      w: 5.3,
      h: 0.28,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    if (glosa) {
      addText(slide, glosa, {
        x: M + 2.08,
        y: y + 0.3,
        w: 5.3,
        h: 0.24,
        fontSize: 10.6,
        color: C.slate,
      });
    }
  });

  vrule(slide, 8.5, 2.2, 3.9, C.border, 1);

  rect(slide, 8.86, 2.3, 3.75, 2.62, C.warm);
  rect(slide, 8.86, 2.3, 3.75, 0.07, onPaper(C.red));
  addText(slide, "EL AUTOR DEL CAMBIO, DESPUÉS", {
    x: 9.14,
    y: 2.52,
    w: 3.2,
    h: 0.2,
    fontSize: 8.6,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.1,
  });
  addText(
    slide,
    "«Lamentablemente, ni siquiera el desarrollador de OpenSSL que hizo la revisión del código notó la comprobación que faltaba.»",
    {
      x: 9.14,
      y: 2.82,
      w: 3.2,
      h: 1.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 15,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.18,
    }
  );
  addText(slide, "Robin Seggelmann, 2014", {
    x: 9.14,
    y: 4.54,
    w: 3.2,
    h: 0.24,
    fontSize: 10.8,
    color: C.slate,
  });

  addText(
    slide,
    "El código era abierto: cualquiera podía leerlo, y durante dos años mucha gente lo leyó.",
    {
      x: 8.86,
      y: 5.16,
      w: 3.75,
      h: 0.64,
      fontSize: 12,
      color: C.slate,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Una revisión sin criterios declarados es indistinguible de no haber revisado, y la diferencia solo se nota cuando ya es tarde.",
    { y: 6.3, h: 0.62 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------ 10 PREGUNTAS BLOQUE 1
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
      "¿Contra qué compara una revisión, y por qué esa fuente no puede convertirse en una regla de herramienta?",
      "La fuente que usa no está escrita dentro del código.",
    ],
    [
      CYAN,
      "El código de Heartbleed lo revisó un desarrollador competente del proyecto. ¿Qué le faltó a esa revisión?",
      "Mira los cinco tipos: solo uno exige un facilitador imparcial y una lista registrada de anomalías.",
    ],
    [
      C.red,
      "Si una revisión no deja nada escrito, ¿en qué se distingue de no haberla hecho?",
      "Piensa en qué evidencia queda disponible dos años después.",
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
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, CW, C.border, 0.75);
  });

  rule(slide, M, 6.96, CW, C.navy, 1.6);

  validateSlide(slide, pptx);
}

// ------------------------------------------------------- 11 APERTURA BLOQUE 2
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
    color: C.gold,
    charSpacing: 2,
  });

  addText(slide, "Qué se mira cuando se revisa", {
    x: M + 3.02,
    y: 2.48,
    w: 9.0,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.94, 2.2, 0.07, C.red);

  addText(
    slide,
    "Una revisión sin preguntas fijadas de antemano encuentra lo que al revisor le llame la atención ese día. Vamos a fijarlas, y a separar tres clases de hallazgo que no se tratan igual.",
    {
      x: M + 3.02,
      y: 4.26,
      w: 8.5,
      h: 1.4,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.26,
    }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------- 12 LO QUE SE MIDE DE UN REVISOR
function slideLimitesDelRevisor() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.1 · Las condiciones de ejecución",
    "Si la revisión es una prueba, tiene límites medibles",
    "Dos organizaciones publicaron cifras sobre su propia práctica: cuánto código aguanta un revisor, y qué tamaño tiene un cambio real.",
    false
  );

  // --- Panel izquierdo: los límites operativos
  rect(slide, M, 2.56, 5.84, 3.2, "E7ECF3");
  rect(slide, M, 2.56, 5.84, 0.09, onPaper(C.navy));
  addText(slide, "CUÁNTO SE PUEDE REVISAR", {
    x: M + 0.3,
    y: 2.84,
    w: 5.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.navy),
    charSpacing: 1.3,
  });
  addText(
    slide,
    "SmartBear, a partir del trabajo con un equipo de Cisco Systems",
    {
      x: M + 0.3,
      y: 3.1,
      w: 5.24,
      h: 0.24,
      fontSize: 11.4,
      color: C.slate,
    }
  );

  const limites = [
    ["Código por revisión, de una vez", "200 a 400 líneas"],
    ["Tiempo por sesión, seguidos", "60 minutos"],
    ["Velocidad de lectura", "500 líneas/hora"],
  ];
  limites.forEach(([etiqueta, valor], i) => {
    const y = 3.46 + i * 0.52;
    addText(slide, etiqueta, {
      x: M + 0.3,
      y: y + 0.04,
      w: 3.0,
      h: 0.26,
      fontSize: 12,
      color: C.slate,
    });
    addText(slide, valor, {
      x: M + 3.36,
      y,
      w: 2.18,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 13.6,
      bold: true,
      color: onPaper(C.navy),
    });
    if (i < limites.length - 1) rule(slide, M + 0.3, y + 0.42, 5.24, C.border, 0.7);
  });

  addText(
    slide,
    "Por sobre 500 líneas por hora cae la densidad de defectos encontrados: cuántos defectos aparecen por cada mil líneas revisadas. Encuentra menos porque va rápido, no porque haya menos.",
    {
      x: M + 0.3,
      y: 5.06,
      w: 5.24,
      h: 0.64,
      fontSize: 10.6,
      italic: true,
      color: C.slate,
    }
  );

  // --- Panel derecho: el tamaño real de un cambio
  rect(slide, 6.77, 2.56, 5.84, 3.2, "E8F1F2");
  rect(slide, 6.77, 2.56, 5.84, 0.09, CYAN_ON_PAPER);
  addText(slide, "QUÉ TAN GRANDE ES UN CAMBIO REAL", {
    x: 7.07,
    y: 2.84,
    w: 5.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: CYAN_ON_PAPER,
    charSpacing: 1.3,
  });
  addText(
    slide,
    "Google, sobre su propio proceso: 9 millones de cambios y más de 25.000 autores y revisores, entre enero de 2014 y julio de 2016",
    {
      x: 7.07,
      y: 3.1,
      w: 5.24,
      h: 0.44,
      fontSize: 11.4,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    }
  );

  const cifras = [
    ["24", "líneas modificadas", "es la mediana de un cambio"],
    ["1", "revisor por cambio", "es la mediana del proceso"],
  ];
  cifras.forEach(([numero, etiqueta, glosa], i) => {
    const x = 7.07 + i * 2.66;
    addText(slide, numero, {
      x,
      y: 3.66,
      w: 2.4,
      h: 0.74,
      fontFace: TYPOGRAPHY.display,
      fontSize: 46,
      bold: true,
      color: CYAN_ON_PAPER,
    });
    addText(slide, etiqueta, {
      x,
      y: 4.46,
      w: 2.4,
      h: 0.26,
      fontSize: 12.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x,
      y: 4.74,
      w: 2.4,
      h: 0.4,
      fontSize: 10.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addText(
    slide,
    "Mediana: el valor del medio. La mitad de los cambios modifica menos de 24 líneas, y la otra mitad modifica más.",
    {
      x: 7.07,
      y: 5.26,
      w: 5.24,
      h: 0.36,
      fontSize: 10.4,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.1,
    }
  );

  addTakeaway(
    slide,
    "La revisión encuentra defectos cuando es pequeña, lenta y con criterios. Y aun así, la organización que más código revisa del mundo declara que encontrar defectos no es su foco principal: revisa para que el código siga siendo entendible por otra persona.",
    { y: 5.92, h: 0.86, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 13 EL FRAGMENTO A REVISAR
function slideFragmentoARevisar() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.2 · El material de trabajo",
    "Cuatro pruebas en verde, y cuatro problemas dentro",
    "Regla previa de la lista: ningún ítem puede ser algo que una herramienta ya responda sola. Esa atención de 60 minutos es el recurso más caro del proceso.",
    false
  );

  const code = [
    "UMBRAL_APROBACION = 4.0",
    "ASISTENCIA_MINIMA = 70",
    "def nota_final(notas: list[float]) -> float:",
    "    promedio = sum(notas) / len(notas)",
    "    return float(Decimal(str(promedio)).quantize(",
    '        Decimal("0.1"), rounding=ROUND_HALF_UP))',
    "def estado(notas: list[float], asistencia: float) -> str:",
    "    if nota_final(notas) >= UMBRAL_APROBACION and asistencia > ASISTENCIA_MINIMA:",
    '        return "aprobado"',
    '    return "reprobado"',
    "def resumen(alumno: str, rut: str, notas, asistencia) -> str:",
    '    return f"{alumno} ({rut}): {nota_final(notas)} - {estado(notas, asistencia)}"',
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 7.5,
    h: 3.32,
    title: "curso.py · cierre de asignatura de un curso",
    code,
    lang: "python",
    fontSize: 9.4,
  });

  addTerminalPanel(slide, SH, {
    x: 8.4,
    y: 2.6,
    w: 4.21,
    h: 3.32,
    title: "PowerShell · el estado del proyecto",
    fontSize: 9.6,
    lines: [
      { prompt: ">", text: "uv run pytest -q" },
      { text: "4 passed in 0.03s" },
      { prompt: ">", text: "uv run ruff check" },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run ruff check" },
      { text: "  --extend-select B", kind: "muted" },
      { text: "All checks passed!" },
      { prompt: ">", text: "uv run pyrefly check" },
      { text: "INFO 0 errors" },
    ],
  });

  addTakeaway(
    slide,
    "Las dos barreras de ayer están conformes, con la regla extra habilitada, y la suite completa pasa. Ninguna de esas cuatro respuestas menciona lo que está mal.",
    { y: 6.08, h: 0.7, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------------- 14 LAS CUATRO PREGUNTAS
function slideCuatroPreguntas() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.3 · La lista de comprobación",
    "Cuatro preguntas, cuatro hallazgos",
    "Cada pregunta viene de una fuente de defecto ya trabajada en el módulo, y ninguna se puede responder sin tener el requisito a la vista.",
    false
  );

  const filas = [
    [
      onPaper(C.navy),
      "El límite",
      "¿El código usa el mismo operador que el requisito?",
      "estado([5.0, 5.0], 70)  →  'reprobado'",
      "el requisito dice que aprueba",
    ],
    [
      CYAN_ON_PAPER,
      "El caso no nombrado",
      "¿Qué pasa con lo vacío, lo cero, lo negativo?",
      "nota_final([])  →  ZeroDivisionError",
      "un alumno sin notas cae el cierre completo",
    ],
    [
      onPaper(C.gold),
      "La regla de producto",
      "¿El redondeo, las unidades y el formato son los declarados?",
      "nota_final([1.0, 1.3, 6.6, 6.9])  →  4.0",
      "se ve correcto: lo trabajamos en la lámina siguiente",
    ],
    [
      onPaper(C.red),
      "El dato personal",
      "¿Qué sale de esta función y hacia dónde va?",
      "resumen(...)  →  'Ana (11.111.111-1): 5.5 - aprobado'",
      "el requisito nunca pidió el RUT",
    ],
  ];

  filas.forEach(([accent, titulo, pregunta, salida, nota], i) => {
    const y = 2.62 + i * 0.94;
    rect(slide, M, y, 0.05, 0.78, accent);
    addText(slide, titulo, {
      x: M + 0.24,
      y,
      w: 2.5,
      h: 0.3,
      fontSize: 13.2,
      bold: true,
      color: accent,
    });
    addText(slide, pregunta, {
      x: M + 0.24,
      y: y + 0.32,
      w: 2.9,
      h: 0.44,
      fontSize: 10.6,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    rect(slide, 3.94, y - 0.02, 8.67, 0.5, C.editorBg);
    addText(slide, salida, {
      x: 4.16,
      y: y + 0.08,
      w: 8.3,
      h: 0.3,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11.6,
      color: C.terminalOutput,
    });
    addText(slide, nota, {
      x: 3.94,
      y: y + 0.54,
      w: 8.67,
      h: 0.24,
      fontSize: 10.8,
      italic: true,
      color: accent,
    });
  });

  addText(
    slide,
    "Dato personal: cualquier información que identifique a una persona. El RUT lo hace, y junto a una calificación produce un dato más sensible que cualquiera de los dos por separado. La Ley 21.719 exige minimización: tratar solo lo necesario para la finalidad declarada.",
    {
      x: M,
      y: 6.42,
      w: CW,
      h: 0.44,
      fontSize: 11,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------ 15 DEFECTO, RIESGO Y ESTILO
function slideTresClases() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.4 · Cómo se clasifica un hallazgo",
    "Tres clases, separadas por una sola pregunta",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.2, CW, 0.66, C.warm);
  rect(slide, M, 2.2, 0.08, 0.66, onPaper(C.red));
  addText(slide, "¿Puedes escribir hoy una prueba que falle por este hallazgo?", {
    x: M + 0.3,
    y: 2.26,
    w: CW - 0.6,
    h: 0.54,
    fontFace: TYPOGRAPHY.display,
    fontSize: 22,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "mid",
  });

  const clases = [
    [
      onPaper(C.red),
      "F6E7E2",
      "DEFECTO",
      "Sí, y falla",
      "Existe una entrada donde el sistema hace algo distinto de lo que el requisito declara.",
      "Corregir el código.",
    ],
    [
      onPaper(C.gold),
      "F7EFDC",
      "RIESGO",
      "Todavía no",
      "El sistema hace algo indeseable, pero el requisito no dice qué debería hacer en ese caso.",
      "Completar el requisito, y recién después corregir.",
    ],
    [
      onPaper(C.navy),
      "E7ECF3",
      "ESTILO",
      "Sí, y pasa igual",
      "Ninguna entrada distingue el comportamiento actual del propuesto.",
      "Registrar como preferencia. No bloquea.",
    ],
  ];

  clases.forEach(([accent, fill, nombre, respuesta, definicion, accion], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 3.06, 3.83, 2.2, fill);
    rect(slide, x, 3.06, 3.83, 0.08, accent);
    addText(slide, nombre, {
      x: x + 0.26,
      y: 3.26,
      w: 1.68,
      h: 0.3,
      fontSize: 13.4,
      bold: true,
      color: accent,
      charSpacing: 1.1,
    });
    addText(slide, respuesta, {
      x: x + 2.0,
      y: 3.28,
      w: 1.6,
      h: 0.26,
      fontSize: 11.4,
      italic: true,
      color: C.slate,
      align: "right",
    });
    addText(slide, definicion, {
      x: x + 0.26,
      y: 3.66,
      w: 3.32,
      h: 0.86,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    });
    rule(slide, x + 0.26, 4.62, 3.32, C.border, 0.7);
    addText(slide, accion, {
      x: x + 0.26,
      y: 4.74,
      w: 3.32,
      h: 0.48,
      fontSize: 11.4,
      bold: true,
      color: accent,
      lineSpacingMultiple: 1.1,
    });
  });

  const clasificados = [
    [onPaper(C.red), "asistencia > 70", "DEFECTO"],
    [onPaper(C.gold), "lista de notas vacía", "RIESGO"],
    [onPaper(C.red), "el redondeo", "DEFECTO"],
    [onPaper(C.gold), "el RUT en resumen", "RIESGO"],
  ];
  clasificados.forEach(([accent, hallazgo, clase], i) => {
    const x = M + i * 3.02;
    rect(slide, x, 5.42, 2.86, 0.56, "EDE9E1");
    rect(slide, x, 5.42, 0.05, 0.56, accent);
    addText(slide, hallazgo, {
      x: x + 0.2,
      y: 5.50,
      w: 1.74,
      h: 0.4,
      fontSize: 10.8,
      color: C.ink,
      lineSpacingMultiple: 1.08,
    });
    addText(slide, clase, {
      x: x + 2.0,
      y: 5.58,
      w: 0.76,
      h: 0.24,
      fontSize: 9,
      bold: true,
      color: accent,
      align: "right",
      charSpacing: 0.6,
    });
  });

  addTakeaway(
    slide,
    "Los dos riesgos no son problemas del programador: son huecos de la especificación. Reportarlos como defectos abre una discusión que no tiene forma de cerrarse.",
    { y: 6.14, h: 0.66, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------- 16 EL CONTRAEJEMPLO QUE NO FALLÓ
function slideContraejemploQueNoFallo() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.5 · La regla de producto, en detalle",
    "El hallazgo era correcto, y su prueba no falló",
    "El requisito dice que 3,95 se informa 4,0. Alguien sospecha que el redondeo está roto, y trae una entrada para demostrarlo.",
    false
  );

  rect(slide, M, 2.62, 5.6, 1.14, C.warm);
  rect(slide, M, 2.62, 0.08, 1.14, onPaper(C.gold));
  addText(slide, "LA SOSPECHA", {
    x: M + 0.3,
    y: 2.76,
    w: 4.9,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "El promedio se calcula en punto flotante antes de entrar a Decimal. El redondeo se aplica sobre un número que ya se corrompió.",
    {
      x: M + 0.3,
      y: 3.0,
      w: 4.98,
      h: 0.66,
      fontSize: 12.2,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.16,
    }
  );

  rect(slide, 6.52, 2.62, 6.09, 1.14, "EDE9E1");
  addText(slide, "PUNTO FLOTANTE", {
    x: 6.82,
    y: 2.76,
    w: 5.4,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: C.guide,
    charSpacing: 1.15,
  });
  addText(
    slide,
    "La forma en que el computador guarda números con decimales: en binario y con espacio fijo. Muchos decimales no caben exactos, así que se guarda el más cercano.",
    {
      x: 6.82,
      y: 3.0,
      w: 5.5,
      h: 0.66,
      fontSize: 11.8,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 3.86,
    w: 6.9,
    h: 2.22,
    title: "La entrada propuesta: 1,0 · 1,3 · 6,6 · 6,9 · promedio exacto 3,95",
    fontSize: 9.6,
    lines: [
      { text: "Python 3.10.1", kind: "muted" },
      { prompt: ">>>", text: "sum([1.0, 1.3, 6.6, 6.9]) / 4" },
      { text: "3.9499999999999997     informa 3.9" },
      { text: "Python 3.12.12", kind: "muted" },
      { prompt: ">>>", text: "sum([1.0, 1.3, 6.6, 6.9]) / 4" },
      { text: "3.95                   informa 4.0" },
    ],
  });

  rect(slide, 7.8, 3.86, 4.81, 2.22, "E8F1F2");
  rect(slide, 7.8, 3.86, 4.81, 0.08, CYAN_ON_PAPER);
  addText(slide, "QUÉ CAMBIÓ ENTRE LAS DOS VERSIONES", {
    x: 8.1,
    y: 4.08,
    w: 4.2,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: CYAN_ON_PAPER,
    charSpacing: 1.1,
  });
  addText(
    slide,
    "Desde Python 3.12, sumar una lista de decimales usa suma compensada: va guardando el error que se pierde en cada paso y lo devuelve al total.",
    {
      x: 8.1,
      y: 4.34,
      w: 4.24,
      h: 0.94,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );
  rule(slide, 8.1, 5.42, 4.24, C.border, 0.7);
  addText(slide, "El proyecto declara Python 3.12.", {
    x: 8.1,
    y: 5.56,
    w: 4.24,
    h: 0.26,
    fontSize: 12.2,
    bold: true,
    color: CYAN_ON_PAPER,
  });

  addTakeaway(
    slide,
    "La entrada se probó en un intérprete que este proyecto no usa. Que la prueba pase no dice que el hallazgo sea falso: dice que esa evidencia no lo sostiene.",
    { y: 6.22, h: 0.6, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------ 17 EL CONTRAEJEMPLO QUE SÍ FALLA
function slideContraejemploQueSiFalla() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "2.6 · La evidencia que sí sostiene el hallazgo",
    "La suma compensada mejora el resultado, no lo vuelve exacto",
    "Hay que buscar una entrada que falle en el intérprete que el proyecto declara. Existen, y cambian el estado de aprobación, no solo la nota informada.",
    false
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.72,
    w: 7.1,
    h: 1.86,
    title: "Python 3.12.12 · el intérprete que el proyecto declara",
    fontSize: 10.2,
    lines: [
      { prompt: ">>>", text: "nota_final([1.3, 4.6])" },
      { text: "2.9        el promedio exacto es 2,95: debe informar 3,0" },
      { prompt: ">>>", text: "nota_final([1.1, 6.6])" },
      { text: "3.8        el promedio exacto es 3,85: debe informar 3,9" },
    ],
  });

  rect(slide, 8.06, 2.72, 4.55, 1.86, "F6E7E2");
  rect(slide, 8.06, 2.72, 4.55, 0.08, onPaper(C.red));
  addText(slide, "LA CONSECUENCIA", {
    x: 8.36,
    y: 2.94,
    w: 4.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Un estudiante con 1,3 y 4,6 tiene 2,95 de promedio y el sistema le informa 2,9. Es un defecto, y ahora sí se puede escribir la prueba que lo demuestra.",
    {
      x: 8.36,
      y: 3.2,
      w: 4.0,
      h: 1.2,
      fontSize: 12.4,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.18,
    }
  );

  const reglas = [
    [
      onPaper(C.navy),
      "01",
      "Un hallazgo sin entrada concreta no es un hallazgo, es una sospecha",
      "Puede ser una sospecha correcta, pero no se puede clasificar ni corregir hasta que alguien produzca la entrada.",
    ],
    [
      onPaper(C.red),
      "02",
      "Un contraejemplo solo vale en el entorno que el proyecto declara",
      "Reproducirlo en otra versión o en otra máquina no confirma ni descarta nada.",
    ],
  ];
  reglas.forEach(([accent, num, titulo, glosa], i) => {
    const x = M + i * 6.05;
    rect(slide, x, 4.78, 5.84, 1.26, "EDE9E1");
    rect(slide, x, 4.78, 5.84, 0.06, accent);
    addText(slide, num, {
      x: x + 0.28,
      y: 4.96,
      w: 0.6,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: accent,
    });
    addText(slide, titulo, {
      x: x + 0.96,
      y: 4.96,
      w: 4.66,
      h: 0.48,
      fontSize: 12.8,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, glosa, {
      x: x + 0.96,
      y: 5.48,
      w: 4.66,
      h: 0.44,
      fontSize: 10.8,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
  });

  addTakeaway(
    slide,
    "En el bloque siguiente veremos de dónde salió el primer contraejemplo, y por qué quien lo propuso estaba completamente seguro de tener razón.",
    { y: 6.22, h: 0.6, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------ 18 PREGUNTAS BLOQUE 2
function slidePreguntasB2() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre del Bloque 2",
    "Tres preguntas antes de seguir",
    "",
    false
  );

  const preguntas = [
    [
      C.navy,
      "Alguien propone agregar a la lista «verificar que no haya argumentos mutables por omisión». ¿Entra o no entra?",
      "Antes de decidirlo, ejecuta las herramientas sobre ese caso y mira si lo mencionan solas.",
    ],
    [
      CYAN,
      "Dos de los cuatro hallazgos son riesgos y no defectos. Si los reportaras como defectos, ¿qué discusión se abriría?",
      "Piensa contra qué documento compararían las dos partes para saber quién tiene razón.",
    ],
    [
      C.red,
      "El mismo contraejemplo falla en Python 3.10 y pasa en 3.12. Si tu proyecto no declarara su versión, ¿qué pasaría?",
      "Piensa en la persona que intenta confirmar tu hallazgo desde otra máquina.",
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
      fontSize: 18,
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
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, CW, C.border, 0.75);
  });

  rule(slide, M, 6.96, CW, C.navy, 1.6);

  validateSlide(slide, pptx);
}


// ------------------------------------------------------- 19 APERTURA BLOQUE 3
function slideAperturaB3() {
  const { slide } = createSlide("dark");

  addText(slide, "03", {
    x: M,
    y: 1.9,
    w: 2.8,
    h: 1.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 112,
    bold: true,
    color: "1D3A57",
  });

  addText(slide, "BLOQUE 3 · 30 MINUTOS", {
    x: M + 3.02,
    y: 2.06,
    w: 6.4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(slide, "Dos agentes, una decisión", {
    x: M + 3.02,
    y: 2.48,
    w: 9.0,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.94, 2.2, 0.07, C.red);

  addText(
    slide,
    "Un agente escribe el código, otro lo audita sin conocer el razonamiento del primero, y tú decides entre los dos. La pregunta es si eso produce una revisión real o dos textos que suenan igual de seguros.",
    {
      x: M + 3.02,
      y: 4.26,
      w: 8.5,
      h: 1.4,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.26,
    }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------- 20 EL MONTAJE
function slideMontaje() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.1 · Cómo se arma la revisión adversarial",
    "Tres papeles, y ninguno se puede saltar",
    "Agente: un programa que lee los archivos del proyecto, ejecuta comandos y responde. En este módulo son dos, Codex y Claude Code, y cualquiera de ellos puede ocupar los dos primeros papeles.",
    false,
    { subtitleH: 0.6 }
  );

  const papeles = [
    [
      onPaper(C.navy),
      "E7ECF3",
      "AUTOR",
      "un agente, o tú con ayuda de uno",
      "Recibe el requisito.",
      "Escribe el código.",
    ],
    [
      CYAN_ON_PAPER,
      "E8F1F2",
      "AUDITOR",
      "otro agente, o el mismo en una sesión nueva",
      "Recibe el código y el requisito. Nada más.",
      "Entrega una lista de hallazgos.",
    ],
    [
      onPaper(C.red),
      "F6E7E2",
      "ÁRBITRO",
      "tú, siempre",
      "Recibe los dos textos.",
      "Decide con evidencia, no con autoridad.",
    ],
  ];

  papeles.forEach(([accent, fill, nombre, quien, recibe, produce], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 2.7, 3.83, 1.96, fill);
    rect(slide, x, 2.7, 3.83, 0.08, accent);
    addText(slide, nombre, {
      x: x + 0.26,
      y: 2.9,
      w: 3.3,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: accent,
      charSpacing: 1.2,
    });
    addText(slide, quien, {
      x: x + 0.26,
      y: 3.22,
      w: 3.32,
      h: 0.44,
      fontSize: 11.4,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    rule(slide, x + 0.26, 3.74, 3.32, C.border, 0.7);
    addText(slide, recibe, {
      x: x + 0.26,
      y: 3.86,
      w: 3.32,
      h: 0.44,
      fontSize: 12.2,
      bold: true,
      color: C.ink,
      lineSpacingMultiple: 1.12,
    });
    addText(slide, produce, {
      x: x + 0.26,
      y: 4.3,
      w: 3.32,
      h: 0.28,
      fontSize: 11.6,
      color: accent,
    });
  });

  rect(slide, M, 4.9, CW, 1.06, C.warm);
  rect(slide, M, 4.9, 0.08, 1.06, onPaper(C.red));
  addText(slide, "LA REGLA QUE SOSTIENE EL MONTAJE", {
    x: M + 0.32,
    y: 5.04,
    w: 5.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "El auditor no recibe el razonamiento del autor. Si le explicas por qué escribiste el código así, deja de auditar el código y pasa a auditar tu explicación, que es mucho más fácil de aprobar. Por eso la sesión del auditor tiene que ser nueva: una sesión que ya vio cómo se escribió el código no puede evaluarlo sin ese antecedente.",
    {
      x: M + 0.32,
      y: 5.3,
      w: CW - 0.7,
      h: 0.58,
      fontSize: 12.6,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Es la misma imparcialidad que IEEE 1028 le exige a la inspección. Acá no se consigue con otra persona, sino con un contexto separado.",
    { y: 6.16, h: 0.6, fontSize: 13.4 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------ 21 LOS DOS COMANDOS
function slideLosComandos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.2 · Lo que se escribe en la terminal",
    "Dos herramientas, ninguna instalación adicional",
    "Cualquiera de las dos hace de auditor sobre tu propio proyecto. Lo que cambia el resultado no es cuál eliges, sino los tres detalles de abajo.",
    false
  );

  const code = [
    "# Auditoría del cambio sin commitear, contra el último estado guardado",
    "codex exec review --uncommitted",
    "",
    "# Auditoría dirigida, indicando el requisito contra el cual comparar",
    'claude -p "Audita src/curso.py contra REQUISITOS.md. Para cada hallazgo',
    'entrega: la linea, la entrada concreta que lo hace fallar, lo que hace',
    'y lo que deberia hacer." --allowed-tools "Read,Grep,Glob,Bash"',
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.54,
    w: CW,
    h: 2.46,
    title: "PowerShell · el auditor se invoca desde la carpeta del proyecto",
    code,
    lang: "bash",
    fontSize: 10.6,
  });

  const detalles = [
    [
      onPaper(C.navy),
      "El alcance lo define la orden",
      "«Sin commitear» es lo que todavía no quedó guardado en el historial. Si tu cambio son 800 líneas, revisa 800 de una vez.",
    ],
    [
      CYAN_ON_PAPER,
      "El requisito vive en el repo",
      "Comparan el código contra los documentos que encuentran. Si tu regla solo está en tu cabeza, devuelven estilo.",
    ],
    [
      onPaper(C.red),
      "La etiqueta no es garantía",
      "Una sesión declarada de solo lectura ejecutó la suite y dejó archivos escritos. La diferencia se ve en git status.",
    ],
  ];
  detalles.forEach(([accent, titulo, glosa], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 5.14, 3.83, 1.12, "EDE9E1");
    rect(slide, x, 5.14, 3.83, 0.06, accent);
    addCircleLabel(slide, x + 0.26, 5.28, 0.32, accent, String(i + 1), {
      fontSize: 10.5,
    });
    addText(slide, titulo, {
      x: x + 0.68,
      y: 5.3,
      w: 2.9,
      h: 0.28,
      fontSize: 12.2,
      bold: true,
      color: accent,
    });
    addText(slide, glosa, {
      x: x + 0.26,
      y: 5.66,
      w: 3.32,
      h: 0.52,
      fontSize: 10.4,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(
    slide,
    "El auditor solo puede comparar contra lo que encuentra escrito. Escribir el requisito es parte del montaje, no un trámite previo.",
    { y: 6.4, h: 0.48, fontSize: 12.6 }
  );

  validateSlide(slide, pptx);
}

// --------------------------------- 22 EL PROTOCOLO QUE PIDE CONFIRMACIÓN
function slideProtocoloConfirmacion() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.3 · Primer protocolo",
    "Lo que responde cuando le pides que confirme",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.10, CW, 0.82, C.warm);
  rect(slide, M, 2.10, 0.08, 0.82, onPaper(C.gold));
  addText(slide, "LO QUE SE LE PIDIÓ", {
    x: M + 0.32,
    y: 2.20,
    w: 4.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "«Un compañero revisó curso.py contra REQUISITOS.md y concluyó que el código cumple la regla de negocio. Necesito tu confirmación para cerrar la revisión.»",
    {
      x: M + 0.32,
      y: 2.46,
      w: CW - 0.7,
      h: 0.4,
      fontSize: 13.4,
      bold: true,
      color: C.navy,
    }
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 3.02,
    w: 7.3,
    h: 2.8,
    title: "Lo que respondió, literal",
    fontSize: 9.8,
    lines: [
      { text: "No confirmo. El requisito permite aprobar con asistencia" },
      { text: "igual o superior al 70 %, pero curso.py usa" },
      { text: "`asistencia > ASISTENCIA_MINIMA`." },
      { text: "Asi, alguien con nota final 4,0 o superior y asistencia" },
      { text: "exactamente 70 % queda incorrectamente reprobado." },
      { text: "" },
      { text: "El redondeo ROUND_HALF_UP si coincide con el requisito." },
    ],
  });

  rect(slide, 8.2, 3.02, 4.41, 2.8, "F6E7E2");
  rect(slide, 8.2, 3.02, 4.41, 0.08, onPaper(C.red));
  addText(slide, "ABSOLUCIÓN", {
    x: 8.5,
    y: 3.26,
    w: 3.8,
    h: 0.26,
    fontSize: 12.6,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.2,
  });
  addText(
    slide,
    "Declarar correcto algo sin mostrar la entrada que lo respalda.",
    {
      x: 8.5,
      y: 3.60,
      w: 3.84,
      h: 0.44,
      fontSize: 11.4,
      italic: true,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    }
  );
  rule(slide, 8.5, 4.16, 3.84, C.border, 0.7);
  addText(
    slide,
    "Encontró un defecto real, así que no fue complaciente. Pero la última frase declara correcto el defecto más caro del fragmento, el que cambia estados de aprobación. Y la emitió sin ejecutar nada.",
    {
      x: 8.5,
      y: 4.32,
      w: 3.84,
      h: 1.3,
      fontSize: 11.6,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Un hallazgo equivocado se discute. Una absolución sin evidencia se archiva, y nadie la vuelve a mirar.",
    { y: 6.0, h: 0.64, fontSize: 14.2 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------- 23 LA AUDITORÍA DEL CAMBIO
function slideAuditoriaDelCambio() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.4 · Segundo protocolo",
    "La auditoría del cambio encontró los dos defectos",
    "Misma versión del código, misma información disponible. Lo que cambió es que este protocolo abrió el intérprete a buscar la entrada que falla.",
    false
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.56,
    w: 7.5,
    h: 2.86,
    title: "codex exec review --uncommitted · salida literal",
    fontSize: 8.8,
    lines: [
      { text: "[P1] Use decimal arithmetic for the average — curso.py:10" },
      { text: "  the float calculation can move it below the rounding", kind: "muted" },
      { text: "  boundary: [1.3, 6.6] becomes 3.9499999999999997, so this", kind: "muted" },
      { text: "  returns 3.9 and estado(..., 90) incorrectly fails the student.", kind: "muted" },
      { text: "" },
      { text: "[P1] Use an inclusive attendance cutoff — curso.py:15" },
      { text: "  with a passing grade and exactly 70% attendance, this returns", kind: "muted" },
      { text: "  \"reprobado\"; REQUISITOS.md defines the minimum as >= 70%.", kind: "muted" },
    ],
  });

  rect(slide, 8.4, 2.56, 4.21, 2.86, "E7ECF3");
  rect(slide, 8.4, 2.56, 4.21, 0.08, onPaper(C.navy));
  addText(slide, "QUÉ DICEN LOS DOS HALLAZGOS", {
    x: 8.7,
    y: 2.78,
    w: 3.7,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.navy),
    charSpacing: 1.15,
  });

  const lectura = [
    [
      "curso.py:10",
      "El promedio en punto flotante baja por debajo del límite de redondeo. Con 1,3 y 6,6 informa 3,9 y reprueba a quien debía aprobar.",
    ],
    [
      "curso.py:15",
      "Con nota suficiente y asistencia exactamente 70, devuelve «reprobado», y el requisito define el mínimo como mayor o igual a 70.",
    ],
  ];
  lectura.forEach(([donde, texto], i) => {
    const y = 3.12 + i * 1.14;
    addText(slide, donde, {
      x: 8.7,
      y,
      w: 3.7,
      h: 0.24,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 11,
      bold: true,
      color: onPaper(C.navy),
    });
    addText(slide, texto, {
      x: 8.7,
      y: y + 0.28,
      w: 3.74,
      h: 0.68,
      fontSize: 11,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 5.56, CW, 0.62, "EDE9E1");
  rect(slide, M, 5.56, 0.06, 0.62, CYAN_ON_PAPER);
  addText(
    slide,
    "Ese [1.3, 6.6] es la entrada que efectivamente falla en Python 3.12, el intérprete que el proyecto declara. Para encontrarla abrió el intérprete y la buscó, en vez de opinar sobre el código.",
    {
      x: M + 0.3,
      y: 5.66,
      w: CW - 0.66,
      h: 0.44,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Dos defectos, cada uno con la entrada concreta que lo demuestra. Ninguna absolución.",
    { y: 6.32, h: 0.5, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ----------------------------------------- 24 LA AUDITORÍA DIRIGIDA
function slideAuditoriaDirigida() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.5 · Tercer protocolo",
    "La auditoría dirigida clasificó sola el tercer hallazgo",
    "Al pedirle la entrada concreta de cada hallazgo, encontró además el caso que el requisito no cubre, y llegó por su cuenta a la distinción del bloque anterior.",
    false
  );

  addTerminalPanel(slide, SH, {
    x: M,
    y: 2.6,
    w: 7.3,
    h: 2.4,
    title: "claude -p · tercer hallazgo, literal",
    fontSize: 9.2,
    lines: [
      { text: "3. Lista de notas vacia revienta sin control — curso.py:10" },
      { text: "   Entrada que falla: nota_final([]) o estado([], 90)", kind: "muted" },
      { text: "   Hace: lanza ZeroDivisionError (verificado).", kind: "muted" },
      { text: "   Deberia: indefinido, REQUISITOS.md no lo dice.", kind: "muted" },
      { text: "   Lo marco como vacio de especificacion, no como" },
      { text: "   contradiccion: no hay regla escrita que el codigo incumpla." },
    ],
  });

  rect(slide, 8.2, 2.6, 4.41, 2.4, "E8F1F2");
  rect(slide, 8.2, 2.6, 4.41, 0.08, CYAN_ON_PAPER);
  addText(slide, "Y CUANTIFICÓ EL DEFECTO DE REDONDEO", {
    x: 8.5,
    y: 2.8,
    w: 3.8,
    h: 0.2,
    fontSize: 8.6,
    bold: true,
    color: CYAN_ON_PAPER,
    charSpacing: 1.1,
  });
  const cifras = [
    ["204", "pares de notas se redondean hacia abajo"],
    ["12", "de ellos caen exactamente en 3,95"],
  ];
  cifras.forEach(([numero, glosa], i) => {
    const y = 3.12 + i * 0.82;
    addText(slide, numero, {
      x: 8.5,
      y,
      w: 1.1,
      h: 0.6,
      fontFace: TYPOGRAPHY.display,
      fontSize: 36,
      bold: true,
      color: CYAN_ON_PAPER,
    });
    addText(slide, glosa, {
      x: 9.66,
      y: y + 0.08,
      w: 2.7,
      h: 0.52,
      fontSize: 11.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });
  addText(slide, "Verificado con un barrido propio: las dos cifras son exactas.", {
    x: 8.5,
    y: 4.66,
    w: 3.84,
    h: 0.24,
    fontSize: 10.4,
    italic: true,
    color: C.slate,
  });

  rect(slide, M, 5.14, CW, 0.94, C.warm);
  rect(slide, M, 5.14, 0.08, 0.94, onPaper(C.gold));
  addText(slide, "LA OBSERVACIÓN MÁS FINA DEL INFORME", {
    x: M + 0.32,
    y: 5.26,
    w: 5.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "«nota_final([3.9, 4.0]) sí da 4.0, porque ahí el float cae por sobre el punto medio. El bug es intermitente según los sumandos.» Esa es exactamente la entrada que eligió la prueba de la clase pasada: la que no falla.",
    {
      x: M + 0.32,
      y: 5.52,
      w: CW - 0.7,
      h: 0.46,
      fontSize: 12.2,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Un auditor automático puede llegar solo a la distinción entre defecto y hueco de especificación, si le pides la entrada concreta de cada hallazgo.",
    { y: 6.24, h: 0.56, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------- 25 LOS TRES PROTOCOLOS COMPARADOS
function slideTresProtocolos() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "3.6 · El resultado del experimento",
    "Mismo código, misma información, tres resultados",
    "",
    false,
    { titleW: 10.3 }
  );

  const cols = [
    ["PIDE CONFIRMAR", 5.5, 2.3],
    ["AUDITA EL CAMBIO", 7.9, 2.3],
    ["AUDITORÍA DIRIGIDA", 10.3, 2.31],
  ];
  addText(slide, "PROBLEMA DEL FRAGMENTO", {
    x: M,
    y: 2.26,
    w: 3.4,
    h: 0.2,
    fontSize: 8.6,
    bold: true,
    color: C.guide,
    charSpacing: 1.1,
  });
  cols.forEach(([label, x, w]) => {
    addText(slide, label, {
      x,
      y: 2.26,
      w,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.guide,
      charSpacing: 1.1,
      align: "center",
    });
  });
  rule(slide, M, 2.54, CW, C.border, 0.9);

  const filas = [
    ["asistencia > 70", "DEFECTO", onPaper(C.red), ["si", "si", "si"]],
    ["El redondeo sobre punto flotante", "DEFECTO", onPaper(C.red), ["absuelto", "si", "si"]],
    ["Lista de notas vacía", "RIESGO", onPaper(C.gold), ["no", "no", "si"]],
    ["El RUT en resumen", "RIESGO", onPaper(C.gold), ["no", "no", "no"]],
  ];

  filas.forEach(([problema, clase, accent, marcas], i) => {
    const y = 2.66 + i * 0.52;
    rect(slide, M, y + 0.04, 0.05, 0.34, accent);
    addText(slide, problema, {
      x: M + 0.24,
      y: y + 0.04,
      w: 3.5,
      h: 0.3,
      fontSize: 12.4,
      bold: true,
      color: C.ink,
    });
    addText(slide, clase, {
      x: 4.5,
      y: y + 0.08,
      w: 0.9,
      h: 0.24,
      fontSize: 8.6,
      bold: true,
      color: accent,
      charSpacing: 0.6,
    });
    marcas.forEach((marca, j) => {
      const x = cols[j][1];
      const w = cols[j][2];
      const estilos = {
        si: [onPaper(C.success), "encontrado"],
        no: [C.guide, "no visto"],
        absuelto: [onPaper(C.red), "declarado correcto"],
      };
      const [color, texto] = estilos[marca];
      addText(slide, texto, {
        x,
        y: y + 0.08,
        w,
        h: 0.24,
        fontSize: 11.4,
        bold: marca !== "no",
        color,
        align: "center",
      });
    });
    if (i < filas.length - 1) rule(slide, M, y + 0.44, CW, C.border, 0.6);
  });

  rect(slide, M, 4.86, CW, 1.18, "F6E7E2");
  rect(slide, M, 4.86, 0.08, 1.18, onPaper(C.red));
  addText(slide, "EL PUNTO CIEGO COMPARTIDO", {
    x: M + 0.32,
    y: 5.0,
    w: 5.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Ninguno mencionó el RUT, y no fue un descuido. Un auditor automático compara el código contra los documentos del repositorio, y ese hallazgo no está en ninguno: para verlo hay que saber que un RUT identifica a una persona, que junto a una calificación produce un dato más sensible, y que existe una ley que exige tratar solo lo necesario.",
    {
      x: M + 0.32,
      y: 5.26,
      w: CW - 0.7,
      h: 0.7,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "Es muy bueno encontrando contradicciones entre el código y lo escrito. Es desigual encontrando huecos en lo escrito. Y no encuentra lo que exige conocer el producto, el usuario o la ley que lo regula.",
    { y: 6.18, h: 0.62, fontSize: 13 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------ 26 PREGUNTAS BLOQUE 3
function slidePreguntasB3() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre del Bloque 3",
    "Tres preguntas antes de seguir",
    "",
    false
  );

  const preguntas = [
    [
      C.navy,
      "El primer protocolo encontró un defecto real y además declaró correcto otro que no lo era. ¿Cuál de las dos cosas es más peligrosa?",
      "Piensa en cuál de las dos alguien va a volver a mirar alguna vez.",
    ],
    [
      CYAN,
      "Dos protocolos ejecutaron código para respaldar sus hallazgos y uno no ejecutó nada. Si tuvieras una sola regla para aceptar una auditoría sin leerla completa, ¿cuál sería?",
      "Mira qué tienen en común todos los hallazgos que resultaron ciertos.",
    ],
    [
      C.red,
      "Ninguno de los tres vio el hallazgo del RUT. ¿Qué tendría que existir en el repositorio para que la próxima auditoría sí lo encuentre?",
      "El auditor compara contra documentos, y escribir ese documento no es trabajo suyo.",
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
      fontSize: 17.4,
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
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, CW, C.border, 0.75);
  });

  rule(slide, M, 6.96, CW, C.navy, 1.6);

  validateSlide(slide, pptx);
}


// ------------------------------------------------------- 27 APERTURA BLOQUE 4
function slideAperturaB4() {
  const { slide } = createSlide("dark");

  addText(slide, "04", {
    x: M,
    y: 1.9,
    w: 2.8,
    h: 1.6,
    fontFace: TYPOGRAPHY.display,
    fontSize: 112,
    bold: true,
    color: "1D3A57",
  });

  addText(slide, "BLOQUE 4 · 25 MINUTOS", {
    x: M + 3.02,
    y: 2.06,
    w: 6.4,
    h: 0.26,
    fontSize: 11.4,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(slide, "El arbitraje se resuelve ejecutando", {
    x: M + 3.02,
    y: 2.48,
    w: 9.0,
    h: 1.3,
    fontFace: TYPOGRAPHY.display,
    fontSize: 38,
    bold: true,
    color: C.white,
  });

  rect(slide, M + 3.02, 3.94, 2.2, 0.07, C.red);

  addText(
    slide,
    "Tienes dos informes que no coinciden y una decisión que tomar. No se resuelve leyendo cuál argumenta mejor: se resuelve convirtiendo cada hallazgo en una prueba, escrita antes de tocar el código.",
    {
      x: M + 3.02,
      y: 4.26,
      w: 8.5,
      h: 1.4,
      fontSize: 17,
      color: C.softBlue,
      lineSpacingMultiple: 1.26,
    }
  );

  validateSlide(slide, pptx);
}

// --------------------------------------------- 28 ESPEJO CONTRA EXPECTATIVA
function slideEspejoOExpectativa() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.1 · El orden importa",
    "La misma prueba dice cosas distintas según cuándo se escribe",
    "El código de las dos puede ser idéntico. Lo que cambia es qué sabía quien la escribió en el momento de escribirla.",
    false
  );

  const casos = [
    {
      x: M,
      accent: onPaper(C.red),
      fill: "F6E7E2",
      cuando: "ESCRITA DESPUÉS DE CORREGIR",
      titulo: "Es un espejo",
      texto:
        "Se escribe mirando el código ya corregido, así que solo puede confirmar lo que acabas de hacer. Si la corrección estaba equivocada, la prueba también lo estará, y en verde.",
    },
    {
      x: 6.77,
      accent: onPaper(C.success),
      fill: "E9F6EE",
      cuando: "ESCRITA ANTES DE CORREGIR",
      titulo: "Es una expectativa",
      texto:
        "Dice qué esperas que el sistema haga, y el código todavía no tiene forma de complacerte. Si falla, el hallazgo era real; si pasa, esa evidencia no lo sostiene.",
    },
  ];

  casos.forEach((c) => {
    rect(slide, c.x, 2.66, 5.84, 2.4, c.fill);
    rect(slide, c.x, 2.66, 5.84, 0.09, c.accent);
    addText(slide, c.cuando, {
      x: c.x + 0.3,
      y: 2.9,
      w: 5.2,
      h: 0.22,
      fontSize: 9.4,
      bold: true,
      color: c.accent,
      charSpacing: 1.3,
    });
    addText(slide, c.titulo, {
      x: c.x + 0.3,
      y: 3.2,
      w: 5.24,
      h: 0.46,
      fontFace: TYPOGRAPHY.display,
      fontSize: 26,
      bold: true,
      color: C.ink,
    });
    rule(slide, c.x + 0.3, 3.8, 5.24, C.border, 0.8);
    addText(slide, c.texto, {
      x: c.x + 0.3,
      y: 3.96,
      w: 5.24,
      h: 0.94,
      fontSize: 12.6,
      color: C.ink,
      lineSpacingMultiple: 1.18,
    });
  });

  rect(slide, M, 5.24, CW, 0.86, C.warm);
  rect(slide, M, 5.24, 0.08, 0.86, onPaper(C.navy));
  addText(slide, "Y ADEMÁS RESUELVE EL PROBLEMA DE LA AUTORIDAD", {
    x: M + 0.32,
    y: 5.36,
    w: 6.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.navy),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Da lo mismo si el hallazgo lo levantó un agente, un compañero o tú. La prueba no sabe quién lo propuso, y no le impresiona el tono con que se dijo.",
    {
      x: M + 0.32,
      y: 5.62,
      w: CW - 0.7,
      h: 0.4,
      fontSize: 13.4,
      bold: true,
      color: C.navy,
    }
  );

  addTakeaway(
    slide,
    "Cada hallazgo se convierte en una prueba, y la prueba se escribe antes de tocar el código.",
    { y: 6.26, h: 0.54, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 29 LOS TRES DESENLACES
function slideTresDesenlaces() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.2 · Una corrida, dos desenlaces",
    "Tres pruebas escritas antes de tocar una sola línea",
    "",
    false,
    { titleW: 10.3 }
  );

  const code = [
    "def test_h1_asistencia_exactamente_en_el_limite():",
    '    assert estado([5.0, 5.0], 70) == "aprobado"',
    "",
    "def test_h2_promedio_395_se_informa_40():",
    "    assert nota_final([1.3, 6.6]) == 4.0",
    "",
    "def test_h2_con_el_contraejemplo_del_auditor():",
    "    assert nota_final([1.0, 1.3, 6.6, 6.9]) == 4.0",
  ].join("\n");

  addCodePanel(slide, SH, {
    x: M,
    y: 2.26,
    w: 7.1,
    h: 2.46,
    title: "test_hallazgos.py · una prueba por hallazgo",
    code,
    lang: "python",
    fontSize: 10,
  });

  addTerminalPanel(slide, SH, {
    x: 8.06,
    y: 2.26,
    w: 4.55,
    h: 2.46,
    title: "uv run pytest · sobre el código sin corregir",
    fontSize: 9,
    lines: [
      { text: "E  AssertionError:" },
      { text: "E    assert 'reprobado' == 'aprobado'", kind: "muted" },
      { text: "E  assert 3.9 == 4.0" },
      { text: "E   + where 3.9 = nota_final([1.3, 6.6])", kind: "muted" },
      { text: "" },
      { text: "2 failed, 1 passed in 0.10s" },
    ],
  });

  const desenlaces = [
    [
      onPaper(C.red),
      "F6E7E2",
      "A",
      "La prueba falla",
      "El hallazgo está confirmado: hay una entrada donde el sistema hace algo distinto de lo que el requisito declara. Es un defecto y se corrige.",
    ],
    [
      onPaper(C.gold),
      "F7EFDC",
      "B",
      "La prueba pasa",
      "Esa evidencia no sostiene el hallazgo, y eso no lo vuelve falso. Dos salidas: buscar otra entrada, o retirarlo dejando escrito qué se probó.",
    ],
    [
      onPaper(C.navy),
      "E7ECF3",
      "C",
      "No se puede escribir",
      "No falta trabajo de programación: falta una decisión de producto. El hallazgo es un riesgo y sigue otro camino.",
    ],
  ];

  desenlaces.forEach(([accent, fill, letra, titulo, texto], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 4.92, 3.83, 1.36, fill);
    rect(slide, x, 4.92, 3.83, 0.07, accent);
    addText(slide, letra, {
      x: x + 0.26,
      y: 5.08,
      w: 0.5,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 28,
      bold: true,
      color: accent,
    });
    addText(slide, titulo, {
      x: x + 0.82,
      y: 5.16,
      w: 2.76,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: accent,
    });
    addText(slide, texto, {
      x: x + 0.26,
      y: 5.58,
      w: 3.32,
      h: 0.62,
      fontSize: 10.6,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    });
  });

  addTakeaway(
    slide,
    "La tercera prueba es el contraejemplo que propuso un auditor. Pasa, y el hallazgo era correcto igual.",
    { y: 6.42, h: 0.46, fontSize: 13.2 }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------- 30 EL RIESGO QUE SE VUELVE DEFECTO
function slideRiesgoADefecto() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.3 · Qué hacer con un riesgo",
    "Un riesgo se vuelve defecto en tres pasos, y en ese orden",
    "El caso de la lista de notas vacía: el sistema hace algo indeseable, pero el requisito nunca dijo qué debía hacer.",
    false
  );

  const pasos = [
    [
      onPaper(C.navy),
      "01",
      "Se completa el requisito",
      "No lo decide el programador ni el agente, sino quien define el producto:",
      "«Un estudiante sin notas registradas no tiene nota final: el sistema debe rechazar el cálculo con un error explícito, no informar un valor.»",
    ],
    [
      CYAN_ON_PAPER,
      "02",
      "Ahora sí se puede escribir la prueba",
      "Porque ya existe algo contra qué comparar:",
      "with pytest.raises(ValueError):\n    nota_final([])",
    ],
    [
      onPaper(C.red),
      "03",
      "Se ejecuta antes de corregir",
      "Y falla, como corresponde:",
      "decimal.InvalidOperation\n1 failed in 0.11s",
    ],
  ];

  pasos.forEach(([accent, num, titulo, intro, cita], i) => {
    const x = M + i * 4.03;
    rect(slide, x, 2.6, 3.83, 2.2, "EDE9E1");
    rect(slide, x, 2.6, 3.83, 0.07, accent);
    addText(slide, num, {
      x: x + 0.26,
      y: 2.76,
      w: 0.6,
      h: 0.4,
      fontFace: TYPOGRAPHY.display,
      fontSize: 24,
      bold: true,
      color: accent,
    });
    addText(slide, titulo, {
      x: x + 0.9,
      y: 2.8,
      w: 2.7,
      h: 0.48,
      fontSize: 12.8,
      bold: true,
      color: accent,
      lineSpacingMultiple: 1.1,
    });
    addText(slide, intro, {
      x: x + 0.26,
      y: 3.36,
      w: 3.32,
      h: 0.44,
      fontSize: 11,
      color: C.slate,
      lineSpacingMultiple: 1.12,
    });
    rect(slide, x + 0.26, 3.86, 3.32, 0.82, i === 0 ? C.warm : C.editorBg);
    addText(slide, cita, {
      x: x + 0.42,
      y: 3.96,
      w: 3.0,
      h: 0.64,
      fontFace: i === 0 ? TYPOGRAPHY.body : TYPOGRAPHY.mono,
      fontSize: i === 0 ? 10.2 : 10.6,
      color: i === 0 ? C.navy : C.terminalOutput,
      lineSpacingMultiple: 1.14,
    });
  });

  rect(slide, M, 4.96, CW, 1.1, C.warm);
  rect(slide, M, 4.96, 0.08, 1.1, onPaper(C.gold));
  addText(slide, "EL DETALLE QUE JUSTIFICA TODO EL ORDEN", {
    x: M + 0.32,
    y: 5.1,
    w: 6.0,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.gold),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Cuando este problema apareció al revisar, el síntoma era ZeroDivisionError. Ahora es decimal.InvalidOperation, porque la corrección del hallazgo del redondeo cambió el síntoma de este otro. Una prueba escrita después se habría escrito contra el síntoma nuevo, y nadie habría notado que era el mismo problema de antes.",
    {
      x: M + 0.32,
      y: 5.36,
      w: CW - 0.7,
      h: 0.62,
      fontSize: 12.4,
      color: C.ink,
      lineSpacingMultiple: 1.14,
    }
  );

  addTakeaway(
    slide,
    "La prueba escrita antes apunta a la conducta esperada. La escrita después apunta al error que el código produce hoy.",
    { y: 6.22, h: 0.56, fontSize: 13.6 }
  );

  validateSlide(slide, pptx);
}

// ----------------------------------------------------- 31 EL REGISTRO FINAL
function slideRegistroFinal() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "4.4 · Cómo se cierra la revisión",
    "Cinco hallazgos, cinco desenlaces registrados",
    "",
    false,
    { titleW: 10.3 }
  );

  const cols = [
    ["HALLAZGO", M + 0.24, 4.0],
    ["CLASE", 5.1, 1.5],
    ["DESENLACE", 6.8, 2.6],
    ["ESTADO", 9.6, 3.01],
  ];
  cols.forEach(([label, x, w]) => {
    addText(slide, label, {
      x,
      y: 2.24,
      w,
      h: 0.2,
      fontSize: 8.6,
      bold: true,
      color: C.guide,
      charSpacing: 1.1,
    });
  });
  rule(slide, M, 2.52, CW, C.border, 0.9);

  const filas = [
    [onPaper(C.red), "asistencia > 70", "Defecto", "A · la prueba falló", "Corregido, con prueba"],
    [onPaper(C.red), "El redondeo sobre punto flotante", "Defecto", "A · falló con [1.3, 6.6]", "Corregido, con prueba"],
    [onPaper(C.gold), "El contraejemplo [1.0, 1.3, 6.6, 6.9]", "Evidencia", "B · la prueba pasó", "Descartado como evidencia"],
    [onPaper(C.navy), "Lista de notas vacía", "Riesgo → Defecto", "C, y después A", "Requisito completado y corregido"],
    [onPaper(C.red), "El RUT en resumen", "Riesgo", "C · no se puede escribir", "ABIERTO, espera decisión"],
  ];

  filas.forEach(([accent, hallazgo, clase, desenlace, estado], i) => {
    const y = 2.58 + i * 0.48;
    rect(slide, M, y + 0.02, 0.05, 0.34, accent);
    addText(slide, hallazgo, {
      x: M + 0.24,
      y: y + 0.02,
      w: 4.0,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: C.ink,
    });
    addText(slide, clase, {
      x: 5.1,
      y: y + 0.04,
      w: 1.5,
      h: 0.26,
      fontSize: 11,
      color: accent,
    });
    addText(slide, desenlace, {
      x: 6.8,
      y: y + 0.04,
      w: 2.6,
      h: 0.26,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 10.2,
      color: C.slate,
    });
    addText(slide, estado, {
      x: 9.6,
      y: y + 0.04,
      w: 3.01,
      h: 0.26,
      fontSize: 11,
      bold: i === 4,
      color: i === 4 ? onPaper(C.red) : C.slate,
    });
    if (i < filas.length - 1) rule(slide, M, y + 0.40, CW, C.border, 0.6);
  });

  addTerminalPanel(slide, SH, {
    x: M,
    y: 5.1,
    w: 5.84,
    h: 1.44,
    title: "El proyecto al cerrar el arbitraje",
    fontSize: 9.4,
    lines: [
      { text: "8 passed in 0.03s" },
      { text: "All checks passed!" },
      { text: "INFO 0 errors" },
    ],
  });

  rect(slide, 6.77, 5.1, 5.84, 1.44, "F6E7E2");
  rect(slide, 6.77, 5.1, 0.07, 1.44, onPaper(C.red));
  addText(
    slide,
    "Un hallazgo abierto y declarado como tal es un resultado legítimo. Lo que no es legítimo es cerrarlo inventando la expectativa que falta: eso reemplaza a quien define el producto por quien escribe el código.",
    {
      x: 7.1,
      y: 5.32,
      w: 5.34,
      h: 1.0,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addText(
    slide,
    "Ocho pruebas: las cuatro que ya existían y siguen pasando —eso es la comprobación de regresión— más las cuatro que salieron de esta revisión.",
    {
      x: M,
      y: 6.66,
      w: CW,
      h: 0.28,
      fontSize: 11.6,
      italic: true,
      color: C.slate,
    }
  );

  validateSlide(slide, pptx);
}

// ------------------------------------------------------ 32 PREGUNTAS BLOQUE 4
function slidePreguntasB4() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre del Bloque 4",
    "Tres preguntas antes de cerrar",
    "",
    false
  );

  const preguntas = [
    [
      C.navy,
      "Una prueba escrita después de la corrección y una escrita antes pueden tener exactamente el mismo código. ¿Qué es distinto entonces?",
      "La diferencia no está en el archivo, está en qué sabías cuando la escribiste.",
    ],
    [
      CYAN,
      "El desenlace B es el único donde no cambia nada en el código. ¿Por qué corresponde registrarlo igual?",
      "Piensa en quién va a levantar el mismo hallazgo dentro de tres semanas.",
    ],
    [
      C.red,
      "La corrección de un hallazgo cambió el síntoma de otro. ¿Qué te dice eso sobre corregir varios juntos antes de escribir sus pruebas?",
      "Piensa contra qué error quedaría escrita la segunda prueba.",
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
      fontSize: 17.4,
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
    if (i < preguntas.length - 1) rule(slide, M, y + 1.3, CW, C.border, 0.75);
  });

  rule(slide, M, 6.96, CW, C.navy, 1.6);

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 33 SÍNTESIS DE LA SESIÓN
function slideSintesisYTicket() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Cierre de la sesión",
    "Las cuatro reglas que deja la sesión",
    "",
    false,
    { titleW: 10.3 }
  );

  addText(slide, "LO QUE QUEDA ESTABLECIDO", {
    x: M,
    y: 2.2,
    w: 5.2,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.navy),
    charSpacing: 1.3,
  });

  const reglas = [
    [
      onPaper(C.navy),
      "Revisar es comparar contra el requisito",
      "Es la única prueba estática cuya fuente de información está fuera del código. Ninguna herramienta puede reemplazarla, porque ninguna tiene ese documento.",
    ],
    [
      CYAN_ON_PAPER,
      "Un hallazgo sin entrada concreta es una sospecha",
      "Y un contraejemplo solo vale en el entorno que el proyecto declara. Probado en otra versión, no confirma ni descarta nada.",
    ],
    [
      onPaper(C.gold),
      "Una sola pregunta separa las tres clases",
      "¿Puedes escribir hoy una prueba que falle por este hallazgo? Sí y falla es un defecto; sí y pasa es una preferencia; todavía no, es un hueco de la especificación.",
    ],
    [
      onPaper(C.red),
      "La prueba se escribe antes de la corrección",
      "Escrita después, se escribe mirando el código ya corregido, y solo confirma lo que acaba de hacerse.",
    ],
  ];
  reglas.forEach(([accent, titulo, glosa], i) => {
    const y = 2.56 + i * 1.06;
    addCircleLabel(slide, M, y + 0.06, 0.4, accent, String(i + 1), {
      fontSize: 12.5,
    });
    addText(slide, titulo, {
      x: M + 0.58,
      y,
      w: 5.7,
      h: 0.3,
      fontSize: 13.6,
      bold: true,
      color: C.ink,
    });
    addText(slide, glosa, {
      x: M + 0.58,
      y: y + 0.34,
      w: 5.7,
      h: 0.62,
      fontSize: 11,
      color: C.slate,
      lineSpacingMultiple: 1.14,
    });
    if (i < reglas.length - 1) rule(slide, M, y + 1.0, 6.28, C.border, 0.7);
  });

  vrule(slide, 7.36, 2.18, 4.6, C.border, 1);

  addText(slide, "TICKET DE SALIDA", {
    x: 7.8,
    y: 2.2,
    w: 4.8,
    h: 0.22,
    fontSize: 9.6,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.3,
  });
  addText(slide, "Una línea para cada una, antes de salir.", {
    x: 7.8,
    y: 2.48,
    w: 4.8,
    h: 0.24,
    fontSize: 11.4,
    italic: true,
    color: C.slate,
  });

  const ticket = [
    "¿Qué hallazgo de tu proyecto levantaste tú y ninguna auditoría automática mencionó?",
    "¿Qué desenlace obtuvo la prueba que escribiste antes de corregir, y qué hiciste con ese resultado?",
    "¿Cuál es el riesgo que dejaste abierto, y qué pregunta hay que responder para cerrarlo?",
  ];
  ticket.forEach((texto, i) => {
    const y = 2.96 + i * 1.24;
    rect(slide, 7.8, y, 4.81, 1.06, C.warm);
    addCircleLabel(slide, 8.06, y + 0.18, 0.36, onPaper(C.red), String(i + 1), {
      fontSize: 11.5,
    });
    addText(slide, texto, {
      x: 8.54,
      y: y + 0.16,
      w: 3.82,
      h: 0.76,
      fontSize: 12,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.16,
    });
  });

  validateSlide(slide, pptx);
}

// ------------------------------------------------ 34 LA AFIRMACIÓN ACOTADA
function slideAfirmacionAcotada() {
  const { slide } = createSlide("light");
  addHeader(
    slide,
    "Lo que podemos sostener",
    "Con la revisión hecha, la afirmación crece un poco",
    "",
    false,
    { titleW: 10.3 }
  );

  rect(slide, M, 2.2, CW, 1.16, "E9F6EE");
  rect(slide, M, 2.2, 0.08, 1.16, onPaper(C.success));
  addText(slide, "LO QUE YA PODEMOS AFIRMAR", {
    x: M + 0.34,
    y: 2.36,
    w: 5.4,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.success),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "El código fue comparado contra el requisito escrito,\ny las diferencias que aparecieron están corregidas o registradas.",
    {
      x: M + 0.34,
      y: 2.64,
      w: CW - 0.74,
      h: 0.62,
      fontFace: TYPOGRAPHY.mono,
      fontSize: 15,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.2,
    }
  );

  rect(slide, M, 3.56, CW, 1.0, "F6E7E2");
  rect(slide, M, 3.56, 0.08, 1.0, onPaper(C.red));
  addText(slide, "LO QUE TODAVÍA NO, AUNQUE SUENE PARECIDO", {
    x: M + 0.34,
    y: 3.72,
    w: 5.8,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(slide, "El código hace lo que el producto necesita.", {
    x: M + 0.34,
    y: 4.0,
    w: CW - 0.74,
    h: 0.38,
    fontFace: TYPOGRAPHY.mono,
    fontSize: 15,
    bold: true,
    color: C.navy,
  });

  addText(slide, "LA DISTANCIA ENTRE LAS DOS FRASES", {
    x: M,
    y: 4.86,
    w: 6.0,
    h: 0.22,
    fontSize: 9.4,
    bold: true,
    color: C.guide,
    charSpacing: 1.3,
  });
  addText(
    slide,
    "Hoy tiene un nombre concreto: es todo lo que el requisito no dice.",
    {
      x: M,
      y: 5.16,
      w: 6.2,
      h: 0.66,
      fontFace: TYPOGRAPHY.display,
      fontSize: 22,
      bold: true,
      color: C.navy,
      lineSpacingMultiple: 1.14,
    }
  );

  rect(slide, 7.36, 4.86, 5.25, 1.4, "EDE9E1");
  addText(slide, "Y EL RUT ES LA PRUEBA", {
    x: 7.66,
    y: 5.0,
    w: 4.6,
    h: 0.2,
    fontSize: 8.8,
    bold: true,
    color: onPaper(C.red),
    charSpacing: 1.15,
  });
  addText(
    slide,
    "Sobrevivió a tres auditorías con dos herramientas distintas. No porque fuera difícil de ver en el código —está en la línea más corta del archivo—, sino porque no había ningún documento contra el cual compararlo.",
    {
      x: 7.66,
      y: 5.26,
      w: 4.66,
      h: 0.88,
      fontSize: 11.6,
      color: C.ink,
      lineSpacingMultiple: 1.16,
    }
  );

  addTakeaway(
    slide,
    "Una revisión es tan buena como el documento que usa de referencia.",
    { y: 6.44, h: 0.46, fontSize: 14 }
  );

  validateSlide(slide, pptx);
}

// ---------------------------------------------------------- 35 CIERRE FINAL
function slideCierreFinal() {
  const { slide } = createSlide("dark");

  addText(slide, "CIERRE · CLASE 06", {
    x: M,
    y: 1.3,
    w: 6.4,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: C.gold,
    charSpacing: 2,
  });

  addText(
    slide,
    "El punto ciego no estaba en las herramientas",
    {
      x: M,
      y: 1.66,
      w: 6.4,
      h: 1.5,
      fontFace: TYPOGRAPHY.display,
      fontSize: 30,
      bold: true,
      color: C.white,
      lineSpacingMultiple: 1.06,
    }
  );

  rect(slide, M, 3.28, 2.2, 0.07, C.red);

  addText(
    slide,
    "Dos auditorías del mismo código, hechas por herramientas distintas, coincidieron en los defectos y fallaron en el mismo punto. Ninguna se equivocó por incompetencia: las dos compararon el código contra lo que estaba escrito, que es exactamente lo que se les pidió. El punto ciego estaba en el documento, y escribir ese documento nunca fue trabajo de ellas.",
    {
      x: M,
      y: 3.6,
      w: 6.3,
      h: 2.4,
      fontSize: 15,
      color: C.softBlue,
      lineSpacingMultiple: 1.24,
    }
  );

  rect(slide, 7.36, 1.66, 5.25, 2.5, "19384A", "496175", 0.05);
  addText(slide, "LA PRÓXIMA SESIÓN", {
    x: 7.7,
    y: 1.92,
    w: 4.4,
    h: 0.22,
    fontSize: 9.4,
    bold: true,
    color: C.gold,
    charSpacing: 1.3,
  });
  addText(slide, "Dónde se escribe lo que la revisión necesita", {
    x: 7.7,
    y: 2.22,
    w: 4.6,
    h: 0.76,
    fontFace: TYPOGRAPHY.display,
    fontSize: 20,
    bold: true,
    color: C.white,
    lineSpacingMultiple: 1.1,
  });
  addText(
    slide,
    "Cada tipo de prueba en la etapa del ciclo de vida que le corresponde, y qué documentación exigen ISO/IEC 25010 e ISO/IEC/IEEE 29119 en cada una.",
    {
      x: 7.7,
      y: 3.1,
      w: 4.6,
      h: 0.9,
      fontSize: 13,
      color: C.softBlue,
      lineSpacingMultiple: 1.2,
    }
  );

  rect(slide, 7.36, 4.36, 5.25, 1.5, "1D3A57");
  addText(slide, "Y LA RESPUESTA AL HALLAZGO ABIERTO", {
    x: 7.7,
    y: 4.58,
    w: 4.4,
    h: 0.22,
    fontSize: 9,
    bold: true,
    color: CYAN_ON_NAVY,
    charSpacing: 1.2,
  });
  addText(
    slide,
    "La privacidad por diseño significa que la pregunta sobre el RUT se responde cuando se define el producto, no tres semanas después revisando código.",
    {
      x: 7.7,
      y: 4.86,
      w: 4.6,
      h: 0.86,
      fontSize: 12.4,
      color: C.white,
      lineSpacingMultiple: 1.2,
    }
  );

  rule(slide, M, 6.24, CW, C.gold, 1.4);
  addText(
    slide,
    "Una revisión es tan buena como el documento que usa de referencia.",
    {
      x: M,
      y: 6.44,
      w: CW,
      h: 0.44,
      fontFace: TYPOGRAPHY.display,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
    }
  );

  validateSlide(slide, pptx);
}


slidePortada();
slidePuntoDePartida();
slideMapa();
slideAperturaB1();
slideContraQueCompara();
slideCodigoQuePasa();
slideCincoTipos();
slideQueFueHeartbleed();
slideCronologiaHeartbleed();
slidePreguntasB1();
slideAperturaB2();
slideLimitesDelRevisor();
slideFragmentoARevisar();
slideCuatroPreguntas();
slideTresClases();
slideContraejemploQueNoFallo();
slideContraejemploQueSiFalla();
slidePreguntasB2();
slideAperturaB3();
slideMontaje();
slideLosComandos();
slideProtocoloConfirmacion();
slideAuditoriaDelCambio();
slideAuditoriaDirigida();
slideTresProtocolos();
slidePreguntasB3();
slideAperturaB4();
slideEspejoOExpectativa();
slideTresDesenlaces();
slideRiesgoADefecto();
slideRegistroFinal();
slidePreguntasB4();
slideSintesisYTicket();
slideAfirmacionAcotada();
slideCierreFinal();

pptx
  .writeFile({ fileName: outputPptx })
  .then(() => console.log(`Deck generado: ${outputPptx} (${pptx._slides.length} slides)`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
