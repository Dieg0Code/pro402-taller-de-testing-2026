import { describe, expect, it } from "vitest";
// cspell:ignore Asignacion informacion logico senal jerarquia utiles comun repeticion tecnico acompana metricas senales descripcion guias introduccion semantica basica interaccion movil metodo mutacion hipotesis progresion rigido palantir estrategica analisis deteccion
import {
  addAccessibilityChecklistPanel,
  addAuditEvidenceBoard,
  addAuditScorePanel,
  addBreakpointDecisionPanel,
  addBoxModelDiagram,
  addCascadeInspector,
  addComponentConsistencyPanel,
  addComponentVariantBoard,
  addCssRuleStack,
  addDataTypesBoard,
  addEntityRelationshipBlueprint,
  addFlexGridLayout,
  addFrameworkDecisionMatrix,
  addLighthouseAuditCard,
  addNormalizationStepper,
  addNetworkLoadBoard,
  addControlFlowPanel,
  addDebugEvidenceBoard,
  addDomMutationFlow,
  addEvaluationRubricPanel,
  addEventReactionPanel,
  addProjectWorkflowPanel,
  addPromptQualityCompare,
  addSpreadsheetProblemPanel,
  addIssuePriorityMatrix,
  addQualityDimensionsPanel,
  addSeoSnippetPreview,
  addScoreBoostsAndPenalties,
  addSqlBridgePanel,
  addPerformanceMetricsBoard,
  addResponsiveReflowPanel,
  addResponsiveViewportCompare,
  addSpecificityScale,
  addStaticVsInteractiveCompare,
  addTokenBoard,
  addDecisionPipelinePanel,
  addIntelTimelinePanel,
  addPowerNetworkMap,
} from "../../src/components";
import { getEntryBounds, RecordingSlide } from "../../src/adapters/recording-slide";
import { TOKENS } from "../../src/theme";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
  ellipse: "ellipse",
  chevron: "chevron",
} as const;

function expectGeometryIsValid(slide: RecordingSlide) {
  const entries = [...slide.shapes, ...slide.texts, ...slide.images];
  const offenders = entries.filter((entry) => {
    const rawX = typeof entry.options.x === "number" ? entry.options.x : undefined;
    const rawY = typeof entry.options.y === "number" ? entry.options.y : undefined;
    const rawW = typeof entry.options.w === "number" ? entry.options.w : undefined;
    const rawH = typeof entry.options.h === "number" ? entry.options.h : undefined;
    return (
      (rawX != null && !Number.isFinite(rawX)) ||
      (rawY != null && !Number.isFinite(rawY)) ||
      (rawW != null && (!Number.isFinite(rawW) || rawW < 0)) ||
      (rawH != null && (!Number.isFinite(rawH) || rawH < 0))
    );
  });

  expect(offenders).toHaveLength(0);
}

describe("frontend panels", () => {
  it("addResponsiveViewportCompare dibuja ambos viewports", () => {
    const slide = new RecordingSlide();

    addResponsiveViewportCompare(slide, SH, {
      x: 0.8,
      y: 1.2,
      w: 7.8,
      h: 3.6,
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("390 px"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Desktop"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addResponsiveReflowPanel muestra tres estados de una misma interfaz", () => {
    const slide = new RecordingSlide();

    addResponsiveReflowPanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 4.1,
      footer: "La interfaz cambia de orden, no de identidad.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Desktop"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Tablet"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Movil"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addResponsiveReflowPanel mantiene los chevrons dentro del pasillo entre etapas", () => {
    const slide = new RecordingSlide();
    const x = 0.92;
    const y = 2.32;
    const w = 7.48;
    const h = 4.18;
    const gap = 0.18;
    const cardW = (w - 0.44 - gap * 2) / 3;
    const chevrons = slide.shapes.filter((shape) => shape.shapeType === SH.chevron);

    addResponsiveReflowPanel(slide, SH, {
      x,
      y,
      w,
      h,
      footer: "El espacio deja de ser accidente y se vuelve contexto visual.",
    });

    const renderedChevrons = slide.shapes.filter((shape) => shape.shapeType === SH.chevron);
    expect(renderedChevrons).toHaveLength(2);

    renderedChevrons.forEach((chevron, index) => {
      const cardX = x + 0.22 + index * (cardW + gap);
      const laneStart = cardX + cardW;
      const laneEnd = laneStart + gap;
      const chevronStart = Number(chevron.options.x);
      const chevronEnd = chevronStart + Number(chevron.options.w);

      expect(chevronStart).toBeGreaterThanOrEqual(laneStart);
      expect(chevronEnd).toBeLessThanOrEqual(laneEnd);
    });

    expect(chevrons).toHaveLength(0);
    expectGeometryIsValid(slide);
  });

  it("addBreakpointDecisionPanel conecta ancho, senal y decision sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addBreakpointDecisionPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.2,
      h: 3.9,
      stages: [
        { label: "Amplio", sizeLabel: "1280 px", note: "todo sigue legible", accent: TOKENS.navy, fill: TOKENS.softBlue },
        {
          label: "Tension",
          sizeLabel: "820 px",
          note: "la lectura empieza a comprimirse",
          accent: TOKENS.gold,
          fill: TOKENS.warm,
          active: true,
        },
        { label: "Quiebre", sizeLabel: "640 px", note: "el layout pide cambio", accent: TOKENS.red, fill: TOKENS.paleRed },
      ],
      signalTitle: "Senal visible",
      signalBody: "El CTA pierde foco y la segunda columna ya no ayuda.",
      decisionTitle: "Respuesta util",
      decisionBody: "Apilar y redistribuir para recuperar jerarquia.",
      footer: "Los breakpoints utiles nacen del contenido y su lectura.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Tension"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Quiebre real"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Respuesta util"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addComponentVariantBoard muestra variantes de una misma familia visual", () => {
    const slide = new RecordingSlide();

    addComponentVariantBoard(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.8,
      variants: [
        { label: "Base", role: "default", description: "fija el patron comun", accent: TOKENS.navy, fill: TOKENS.softBlue },
        { label: "Destacada", role: "feature", description: "sube jerarquia sin romper la familia", accent: TOKENS.red, fill: TOKENS.paleRed },
        { label: "Compacta", role: "compact", description: "reduce aire con criterio", accent: TOKENS.gold, fill: TOKENS.warm, preview: "stack" },
        { label: "Accion", role: "action", description: "prioriza una respuesta visible", accent: TOKENS.navy, fill: TOKENS.white, preview: "button" },
      ],
      footer: "Las variantes cambian por intencion, no por accidente visual.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Destacada"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Accion"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addComponentVariantBoard deja un corredor visible entre la barra lateral y el preview", () => {
    const slide = new RecordingSlide();

    addComponentVariantBoard(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.8,
    });

    const accentBars = slide.shapes
      .filter(
        (shape) =>
          shape.shapeType === SH.rect &&
          Number(shape.options.w) === 0.08 &&
          typeof shape.options.x === "number" &&
          typeof shape.options.y === "number"
      )
      .sort((a, b) => Number(a.options.y) - Number(b.options.y) || Number(a.options.x) - Number(b.options.x));

    const previewSurfaces = slide.shapes
      .filter(
        (shape) =>
          shape.shapeType === SH.roundRect &&
          (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.paper &&
          (shape.options.line as { color?: string } | undefined)?.color === TOKENS.border
      )
      .sort((a, b) => Number(a.options.y) - Number(b.options.y) || Number(a.options.x) - Number(b.options.x));

    expect(accentBars.length).toBeGreaterThanOrEqual(4);
    expect(previewSurfaces.length).toBeGreaterThanOrEqual(4);

    accentBars.slice(0, 4).forEach((bar, index) => {
      const barBounds = getEntryBounds(bar);
      const previewBounds = getEntryBounds(previewSurfaces[index]);
      expect(previewBounds.x - (barBounds.x + barBounds.w)).toBeGreaterThanOrEqual(0.1);
    });
  });

  it("addComponentConsistencyPanel compara repeticion manual contra patron compartido", () => {
    const slide = new RecordingSlide();

    addComponentConsistencyPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.4,
      h: 3.7,
      leftTitle: "Repeticion manual",
      rightTitle: "Patron compartido",
      footer: "La consistencia nace cuando las piezas comparten decisiones visibles.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Repeticion manual"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Patron compartido"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addQualityDimensionsPanel muestra las capas de calidad web", () => {
    const slide = new RecordingSlide();

    addQualityDimensionsPanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.8,
      centerLabel: "Calidad web",
      dimensions: [
        { title: "SEO tecnico", body: "La pagina se deja entender.", accent: TOKENS.red, fill: TOKENS.paleRed },
        { title: "Rendimiento", body: "La carga acompana la lectura.", accent: TOKENS.gold, fill: TOKENS.warm },
        { title: "Accesibilidad", body: "La interfaz se usa con mas claridad.", accent: TOKENS.navy, fill: TOKENS.softBlue },
        { title: "Auditoria", body: "Las herramientas vuelven visible el problema.", accent: TOKENS.navy, fill: TOKENS.mist },
      ],
      footer: "La calidad aparece cuando documento, carga, uso y auditoria se leen juntos.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Calidad web"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("SEO tecnico"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Rendimiento"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addAuditEvidenceBoard ordena evidencias e incorpora lectura tecnica", () => {
    const slide = new RecordingSlide();

    addAuditEvidenceBoard(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.9,
      items: [
        { title: "Documento", body: "Titulo, headings y estructura.", accent: TOKENS.red, fill: TOKENS.paleRed },
        { title: "Recursos", body: "Peso y orden de carga.", accent: TOKENS.gold, fill: TOKENS.warm },
        { title: "Metricas", body: "LCP, CLS e INP.", accent: TOKENS.navy, fill: TOKENS.softBlue },
        { title: "Alertas", body: "La auditoria no decide sola.", accent: TOKENS.navy, fill: TOKENS.mist },
      ],
      insightTitle: "Lectura tecnica",
      insightBody: "Las herramientas ayudan a leer senales, pero el contexto sigue importando.",
      footer: "La evidencia sirve cuando se interpreta antes de actuar.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Documento"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Metricas"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Lectura tecnica"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addSeoSnippetPreview muestra titulo, URL y descripcion sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addSeoSnippetPreview(slide, SH, {
      x: 1,
      y: 1,
      w: 3.8,
      h: 1.7,
      title: "Guia inicial de accesibilidad web | Taller PRO301",
      url: "https://pro301.cl/guias/accesibilidad-inicial",
      breadcrumb: "pro301.cl > Guias > Accesibilidad",
      description:
        "Introduccion a estructura semantica, contraste, formularios y revision basica de accesibilidad.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Guia inicial de accesibilidad web"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("https://pro301.cl/guias/accesibilidad-inicial"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addPerformanceMetricsBoard muestra LCP, CLS e INP sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addPerformanceMetricsBoard(slide, SH, {
      x: 0.9,
      y: 1,
      w: 6.8,
      h: 2.9,
      metrics: [
        { label: "LCP", value: "2.2 s", note: "contenido principal visible", accent: TOKENS.gold, fill: TOKENS.warm },
        { label: "CLS", value: "0.03", note: "sin saltos molestos", accent: TOKENS.navy, fill: TOKENS.softBlue },
        { label: "INP", value: "160 ms", note: "interaccion razonable", accent: TOKENS.red, fill: TOKENS.paleRed },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("LCP"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("CLS"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("INP"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addNetworkLoadBoard muestra recursos, peso y tiempo sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addNetworkLoadBoard(slide, SH, {
      x: 1,
      y: 1,
      w: 7.6,
      h: 3.1,
      resources: [
        { label: "hero.webp", kind: "img", sizeLabel: "480 KB", durationLabel: "620 ms", weight: 0.9, accent: TOKENS.red, fill: TOKENS.paleRed },
        { label: "app.css", kind: "css", sizeLabel: "96 KB", durationLabel: "180 ms", weight: 0.45, accent: TOKENS.navy, fill: TOKENS.softBlue },
        { label: "analytics.js", kind: "3rd", sizeLabel: "52 KB", durationLabel: "240 ms", weight: 0.34, accent: TOKENS.gold, fill: TOKENS.warm },
      ],
      summaryTitle: "Que conviene mirar",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("hero.webp"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Que conviene mirar"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addAuditScorePanel muestra scorecards de auditoria sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addAuditScorePanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 7.8,
      h: 3.1,
      items: [
        { label: "SEO", score: 94, note: "estructura clara" },
        { label: "Rendimiento", score: 72, note: "hay costo en la primera vista" },
        { label: "Accesibilidad", score: 89, note: "la base esta bien encaminada" },
        { label: "Buenas practicas", score: 86, note: "sirve para una lectura inicial" },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Rendimiento"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Accesibilidad"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addAccessibilityChecklistPanel ordena criterios base de accesibilidad", () => {
    const slide = new RecordingSlide();

    addAccessibilityChecklistPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 7.6,
      h: 3.2,
      items: [
        { label: "Contraste", note: "sostiene la lectura", status: "critical" },
        { label: "Labels", note: "los controles necesitan contexto", status: "warn" },
        { label: "Texto alternativo", note: "las fotos relevantes deben explicarse", status: "warn" },
        { label: "Foco visible", note: "el teclado necesita un recorrido claro", status: "ok" },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Contraste"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Foco visible"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addIssuePriorityMatrix distribuye hallazgos dentro de una matriz legible", () => {
    const slide = new RecordingSlide();
    const x = 0.9;
    const y = 1;
    const w = 7.8;
    const h = 3.6;

    addIssuePriorityMatrix(slide, SH, {
      x,
      y,
      w,
      h,
      items: [
        { label: "Contraste pobre", impact: "high", urgency: "high", accent: TOKENS.red, fill: TOKENS.paleRed },
        { label: "Links ambiguos", impact: "high", urgency: "low", accent: TOKENS.gold, fill: TOKENS.warm },
        { label: "Alt ausente", impact: "low", urgency: "high", accent: TOKENS.navy, fill: TOKENS.softBlue },
        { label: "Orden visual irregular", impact: "low", urgency: "low", accent: TOKENS.navy, fill: TOKENS.white },
      ],
    });

    const chipBounds = slide.shapes
      .filter(
        (shape) =>
          shape.shapeType === SH.roundRect &&
          typeof shape.options.x === "number" &&
          typeof shape.options.y === "number" &&
          typeof shape.options.w === "number" &&
          typeof shape.options.h === "number" &&
          Number(shape.options.x) >= x + 0.54 &&
          Number(shape.options.y) >= y + 0.9 &&
          Number(shape.options.w) < w / 2
      )
      .map((shape) => getEntryBounds(shape));

    expect(slide.texts.some((entry) => String(entry.text).includes("Urgencia"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Impacto"))).toBe(true);
    expect(chipBounds.length).toBeGreaterThanOrEqual(4);
    chipBounds.forEach((bounds) => {
      expect(bounds.x + bounds.w).toBeLessThanOrEqual(x + w - 0.2);
      expect(bounds.y + bounds.h).toBeLessThanOrEqual(y + h - 0.2);
    });
    expectGeometryIsValid(slide);
  });

  it("addEvaluationRubricPanel muestra criterios, pesos y barras sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addEvaluationRubricPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 7.8,
      h: 4.5,
      rows: [
        { label: "HTML y semantica", weight: 20, note: "estructura base" },
        { label: "Responsive", weight: 20, note: "movil bien resuelto" },
        { label: "Entrega", weight: 5, note: "orden y metodo" },
      ],
      totalLabel: "100 pts",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("HTML y semantica"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("100 pts"))).toBe(true);
    expect(
      slide.shapes.filter(
        (shape) =>
          shape.shapeType === SH.roundRect &&
          typeof shape.options.h === "number" &&
          Number(shape.options.h) === 0.06
      ).length
    ).toBeGreaterThanOrEqual(3);
    expectGeometryIsValid(slide);
  });

  it("addScoreBoostsAndPenalties separa bien lo que suma y lo que baja puntos", () => {
    const slide = new RecordingSlide();

    addScoreBoostsAndPenalties(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.4,
      h: 3.8,
      boosts: [{ title: "Entrega en GitHub", body: "mejor forma de presentar el trabajo" }],
      penalties: [{ title: "Texto meta visible", body: "rompe profesionalismo de inmediato" }],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Suma puntos"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Baja puntos"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Entrega en GitHub"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Texto meta visible"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addProjectWorkflowPanel dibuja el flujo de trabajo con chevrons contenidos", () => {
    const slide = new RecordingSlide();
    const x = 0.9;
    const y = 1;
    const w = 8.6;
    const h = 2.4;
    const stageCount = 7;
    const gap = 0.1;
    const cardW = (w - 0.32 - gap * (stageCount - 1)) / stageCount;

    addProjectWorkflowPanel(slide, SH, {
      x,
      y,
      w,
      h,
    });

    const chevrons = slide.shapes.filter((shape) => shape.shapeType === SH.chevron);
    expect(chevrons).toHaveLength(stageCount - 1);
    chevrons.forEach((chevron, index) => {
      const laneStart = x + 0.16 + (index + 1) * cardW + index * gap;
      const laneEnd = laneStart + gap;
      const chevronX = Number(chevron.options.x);
      const chevronW = Number(chevron.options.w);
      expect(chevronX + 0.001).toBeGreaterThanOrEqual(laneStart);
      expect(chevronX + chevronW).toBeLessThanOrEqual(laneEnd + 0.001);
    });
    expect(slide.texts.some((entry) => String(entry.text).includes("Brief"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addPromptQualityCompare contrasta prompts y mantiene paneles legibles", () => {
    const slide = new RecordingSlide();

    addPromptQualityCompare(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.8,
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Prompt flojo"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("contexto, criterio y restricciones"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("sin contexto ni criterio"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addSpreadsheetProblemPanel muestra redundancia dentro de una pseudo planilla", () => {
    const slide = new RecordingSlide();

    addSpreadsheetProblemPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.8,
      h: 3.8,
      footer: "La redundancia empieza a doler antes de que el archivo se vea grande.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Cliente"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Redundancia visible"))).toBe(true);
    expect(slide.images.length).toBeGreaterThanOrEqual(1);
    expectGeometryIsValid(slide);
  });

  it("addEntityRelationshipBlueprint conecta entidades y relaciones base", () => {
    const slide = new RecordingSlide();

    addEntityRelationshipBlueprint(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.8,
      h: 4,
      footer: "Cada tabla representa un tipo de hecho y se conecta por llaves.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Cliente"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Obra"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Profesional"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Asignacion"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addNormalizationStepper hace visible el recorrido de 1NF a 3NF", () => {
    const slide = new RecordingSlide();

    addNormalizationStepper(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.8,
      h: 3.9,
      footer: "Normalizar separa hechos para que la informacion deje de contradecirse.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("1NF"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("2NF"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("3NF"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addSqlBridgePanel conecta el modelo con SQL visible", () => {
    const slide = new RecordingSlide();

    addSqlBridgePanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.6,
      footer: "SQL implementa lo que antes ya estaba claro en el modelo.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Modelo logico"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("CREATE TABLE"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("SELECT * FROM obra;"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addStaticVsInteractiveCompare contrasta interfaz fija contra interfaz que responde", () => {
    const slide = new RecordingSlide();

    addStaticVsInteractiveCompare(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.7,
      footer: "JavaScript aparece cuando la interfaz necesita reaccionar.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Solo HTML + CSS"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Con JavaScript"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("click -> mensaje en consola"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDataTypesBoard muestra cards de tipos y variables", () => {
    const slide = new RecordingSlide();

    addDataTypesBoard(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.4,
      footer: "Los datos permiten guardar, comparar y transformar valores.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("string"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("number"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("boolean"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("variable"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDataTypesBoard pasa a grilla cuando el panel es estrecho", () => {
    const slide = new RecordingSlide();

    addDataTypesBoard(slide, SH, {
      x: 0.9,
      y: 1,
      w: 5.1,
      h: 3.8,
      footer: "Sin datos claros no hay decisiones claras.",
    });

    const labelYs = slide.texts
      .filter((entry) => ["string", "number", "boolean", "variable"].includes(String(entry.text)))
      .map((entry) => Number((entry.options.y ?? 0).toFixed(2)));

    expect(new Set(labelYs).size).toBeGreaterThan(1);
    expectGeometryIsValid(slide);
  });

  it("addControlFlowPanel conecta entrada, decision y salidas", () => {
    const slide = new RecordingSlide();

    addControlFlowPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.4,
      h: 3.5,
      conditionLabel: "edad >= 18",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Entrada"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("edad >= 18"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Salidas posibles"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Acceso permitido"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addControlFlowPanel compacta bien cuando el panel es bajo", () => {
    const slide = new RecordingSlide();

    addControlFlowPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 5.1,
      h: 2,
      outputTitle: "Salidas",
      trueTitle: "Si",
      trueBody: "Permite",
      falseTitle: "No",
      falseBody: "Niega",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Salidas"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Permite"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Niega"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addEventReactionPanel ordena evento y respuesta sin romper geometria", () => {
    const slide = new RecordingSlide();

    addEventReactionPanel(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.7,
      footer: "La interactividad se valida en la UI y en consola.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Usuario"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Evento"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Handler"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Respuesta"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDomMutationFlow conecta selector, mutacion y resultado visible", () => {
    const slide = new RecordingSlide();

    addDomMutationFlow(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.6,
      h: 3.3,
      footer: "Cambiar la interfaz exige ubicar bien el nodo y validar el efecto.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Selector"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("nodo.textContent"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Resultado"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("document.querySelector"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDomMutationFlow cambia a layout apilado cuando el panel es estrecho", () => {
    const slide = new RecordingSlide();

    addDomMutationFlow(slide, SH, {
      x: 1,
      y: 1,
      w: 4.3,
      h: 3.7,
      footer: "Cuando falta ancho, el flujo debe seguir legible.",
    });

    const accentBars = slide.shapes
      .filter(
        (shape) =>
          shape.shapeType === SH.rect &&
          Number(shape.options.w) === 0.08 &&
          typeof shape.options.x === "number" &&
          typeof shape.options.y === "number"
      )
      .sort((a, b) => Number(a.options.y) - Number(b.options.y) || Number(a.options.x) - Number(b.options.x));

    expect(accentBars.length).toBeGreaterThanOrEqual(3);
    expect(Number(accentBars[2].options.y)).toBeGreaterThan(Number(accentBars[0].options.y) + 0.6);
    expect(slide.texts.some((entry) => String(entry.text).includes("Resultado"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDebugEvidenceBoard organiza evidencias de Elements, Console y Network", () => {
    const slide = new RecordingSlide();

    addDebugEvidenceBoard(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.8,
      h: 3.5,
      footer: "La evidencia manda antes que cualquier hipotesis.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Elements"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Console"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Network"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("evidencia"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addCssRuleStack resalta una regla activa", () => {
    const slide = new RecordingSlide();

    addCssRuleStack(slide, SH, {
      x: 1,
      y: 1,
      w: 5.4,
      h: 3,
      rules: [
        { selector: ".card", declaration: "color: red;", specificity: "0,1,0" },
        { selector: "#hero .card", declaration: "color: navy;", specificity: "1,1,0", active: true },
      ],
    });

    const activeRows = slide.shapes.filter(
      (shape) =>
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.paleRed &&
        shape.options.h === 0.42
    );

    expect(activeRows.length).toBeGreaterThanOrEqual(1);
    expectGeometryIsValid(slide);
  });

  it("addCascadeInspector muestra el valor resuelto y la regla activa", () => {
    const slide = new RecordingSlide();

    addCascadeInspector(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.4,
      h: 3.6,
      resolvedValue: "#d62027",
      rules: [
        { selector: "p", declaration: "color: slate;", specificity: "0,0,1" },
        {
          selector: ".destacado",
          declaration: "color: red;",
          specificity: "0,1,0",
          reason: "gana por peso",
          active: true,
        },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("#d62027"))).toBe(true);

    const activeRows = slide.shapes.filter(
      (shape) =>
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.paleRed &&
        typeof shape.options.h === "number" &&
        shape.options.h >= 0.52
    );

    expect(activeRows.length).toBeGreaterThanOrEqual(1);
    expectGeometryIsValid(slide);
  });

  it("addCascadeInspector afloja paneles laterales y filas en formato compacto", () => {
    const slide = new RecordingSlide();

    addCascadeInspector(slide, SH, {
      x: 0.8,
      y: 1,
      w: 6,
      h: 3.86,
      rules: [
        { selector: "p", declaration: "color: slate;", specificity: "0,0,1" },
        {
          selector: ".destacado",
          declaration: "color: red;",
          specificity: "0,1,0",
          reason: "gana por clase",
          active: true,
        },
      ],
    });

    const roomyRows = slide.shapes.filter(
      (shape) =>
        typeof shape.options.h === "number" &&
        shape.options.h >= 0.75 &&
        typeof shape.options.x === "number" &&
        shape.options.x >= 2.3 &&
        shape.options.x <= 4.4
    );
    const compactElementPanel = slide.shapes.find(
      (shape) =>
        typeof shape.options.x === "number" &&
        typeof shape.options.y === "number" &&
        typeof shape.options.w === "number" &&
        shape.options.x >= 0.95 &&
        shape.options.x <= 1.1 &&
        shape.options.y >= 1.85 &&
        shape.options.y <= 2.05 &&
        shape.options.w < 1.5
    );

    expect(roomyRows.length).toBeGreaterThanOrEqual(2);
    expect(compactElementPanel).toBeTruthy();
    expectGeometryIsValid(slide);
  });

  it("addCascadeInspector mantiene los chevrons dentro de los pasillos entre paneles", () => {
    const slide = new RecordingSlide();
    const x = 0.8;
    const y = 1;
    const w = 6;
    const h = 3.86;

    addCascadeInspector(slide, SH, {
      x,
      y,
      w,
      h,
      rules: [
        { selector: "p", declaration: "color: slate;", specificity: "0,0,1" },
        {
          selector: ".destacado",
          declaration: "color: red;",
          specificity: "0,1,0",
          reason: "gana por clase",
          active: true,
        },
      ],
    });

    const compactInspector = true;
    const elementW = Math.max(1.24, Math.min(1.72, w * (compactInspector ? 0.2 : 0.22)));
    const resultW = Math.max(1.3, Math.min(1.58, w * (compactInspector ? 0.22 : 0.24)));
    const inspectorGap = 0.24;
    const stackX = x + 0.2 + elementW + inspectorGap;
    const stackW = w - elementW - resultW - inspectorGap * 2 - 0.4;
    const resultX = x + w - resultW - 0.2;
    const chevrons = slide.shapes
      .filter((shape) => shape.shapeType === SH.chevron)
      .sort((a, b) => Number(a.options.x) - Number(b.options.x));

    expect(chevrons).toHaveLength(2);
    expect(Number(chevrons[0].options.x)).toBeGreaterThanOrEqual(x + 0.2 + elementW);
    expect(Number(chevrons[0].options.x) + Number(chevrons[0].options.w)).toBeLessThanOrEqual(stackX);
    expect(Number(chevrons[1].options.x)).toBeGreaterThanOrEqual(stackX + stackW);
    expect(Number(chevrons[1].options.x) + Number(chevrons[1].options.w)).toBeLessThanOrEqual(resultX);
    expectGeometryIsValid(slide);
  });

  it("addSpecificityScale representa una progresion de peso", () => {
    const slide = new RecordingSlide();

    addSpecificityScale(slide, SH, {
      x: 0.8,
      y: 1.1,
      w: 7.4,
      h: 3,
      entries: [
        { label: "Etiqueta", value: "0,0,1", weightLabel: "bajo" },
        { label: "Clase", value: "0,1,0", weightLabel: "medio", active: true },
        { label: "ID", value: "1,0,0", weightLabel: "alto" },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Etiqueta"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("1,0,0"))).toBe(true);
    expect(
      slide.shapes.some(
        (shape) => (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.paleRed
      )
    ).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addSpecificityScale no genera geometria negativa en modo compacto", () => {
    const slide = new RecordingSlide();

    addSpecificityScale(slide, SH, {
      x: 2.16,
      y: 5.26,
      w: 8.96,
      h: 1.14,
      entries: [
        { label: "Color", value: "misma paleta", weightLabel: "senal estable", scale: 0.44 },
        { label: "Espacio", value: "mismo ritmo", weightLabel: "bloques respirables", scale: 0.62 },
        { label: "Layout", value: "reglas claras", weightLabel: "mas control", scale: 0.86, active: true },
      ],
    });

    expectGeometryIsValid(slide);
  });

  it("addTokenBoard agrupa tokens y muestra swatches cuando corresponde", () => {
    const slide = new RecordingSlide();

    addTokenBoard(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.4,
      groups: [
        {
          title: "Color",
          items: [
            { label: "--color-primario", value: "#D62027", swatch: TOKENS.red },
            { label: "--text-main", value: "#102A43", swatch: TOKENS.navy },
          ],
        },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("--color-primario"))).toBe(true);
    expect(
      slide.shapes.some(
        (shape) => (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.red
      )
    ).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addTokenBoard reserva aire para el footer cuando existe", () => {
    const slide = new RecordingSlide();

    addTokenBoard(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.8,
      footer: "Resumen del tablero",
      groups: [
        {
          title: "Color",
          items: [
            { label: "--color-primario", value: "#D62027", swatch: TOKENS.red },
            { label: "--text-main", value: "#102A43", swatch: TOKENS.navy },
            { label: "--surface-card", value: "#FFFFFF", swatch: TOKENS.white },
          ],
        },
        {
          title: "Espacio",
          items: [
            { label: "--space-sm", value: "8px" },
            { label: "--space-md", value: "16px" },
            { label: "--space-lg", value: "24px" },
          ],
        },
      ],
    });

    const footerText = slide.texts.find((entry) => String(entry.text).includes("Resumen del tablero"));
    const tallGroups = slide.shapes.filter(
      (shape) =>
        typeof shape.options.x === "number" &&
        typeof shape.options.y === "number" &&
        typeof shape.options.w === "number" &&
        typeof shape.options.h === "number" &&
        shape.options.y >= 1.7 &&
        shape.options.h > 2
    );
    const maxGroupBottom = Math.max(
      ...tallGroups.map((shape) => Number(shape.options.y) + Number(shape.options.h))
    );

    expect(footerText).toBeTruthy();
    expect(Number(footerText?.options.y)).toBeGreaterThan(maxGroupBottom);
    expectGeometryIsValid(slide);
  });

  it("addFrameworkDecisionMatrix contrasta ayuda, riesgo y decision del equipo", () => {
    const slide = new RecordingSlide();

    addFrameworkDecisionMatrix(slide, SH, {
      x: 0.8,
      y: 1.1,
      w: 8.9,
      h: 3.7,
      footer: "Acelerar no sirve si el sistema queda rigido.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Si acelera"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Puede volver fija la interfaz"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Decide el equipo"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Layout"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addBoxModelDiagram incluye las cuatro capas", () => {
    const slide = new RecordingSlide();

    addBoxModelDiagram(slide, SH, {
      x: 0.8,
      y: 1,
      w: 4.8,
      h: 3.2,
    });

    expect(slide.texts.filter((entry) => String(entry.text).includes("margin")).length).toBe(1);
    expect(slide.texts.filter((entry) => String(entry.text).includes("content")).length).toBe(1);
    expectGeometryIsValid(slide);
  });

  it("addLighthouseAuditCard dibuja cuatro metricas", () => {
    const slide = new RecordingSlide();

    addLighthouseAuditCard(slide, SH, {
      x: 0.8,
      y: 1.1,
      w: 7.4,
      h: 3,
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Performance"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("SEO"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addLighthouseAuditCard mantiene las tarjetas dentro de alturas compactas", () => {
    const slide = new RecordingSlide();
    const x = 1;
    const y = 1.2;
    const w = 5.02;
    const h = 2.34;

    addLighthouseAuditCard(slide, SH, {
      x,
      y,
      w,
      h,
      summary: "sirve para detectar focos iniciales sin decidir solo.",
    });

    const scoreCards = slide.shapes.filter(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        typeof shape.options.x === "number" &&
        typeof shape.options.y === "number" &&
        typeof shape.options.w === "number" &&
        typeof shape.options.h === "number" &&
        Number(shape.options.x) >= x &&
        Number(shape.options.x) <= x + w &&
        Number(shape.options.y) >= y + 0.7 &&
        Number(shape.options.y) <= y + h
    );

    expect(scoreCards.length).toBeGreaterThanOrEqual(4);
    scoreCards.slice(0, 4).forEach((shape) => {
      const bounds = getEntryBounds(shape);
      expect(bounds.y + bounds.h).toBeLessThanOrEqual(y + h - 0.16);
    });
    expectGeometryIsValid(slide);
  });
  it("addFlexGridLayout mantiene los items flex dentro del contenedor en formato compacto", () => {
    const slide = new RecordingSlide();
    const x = 5.02;
    const y = 3.78;
    const w = 3.06;
    const h = 1.18;

    addFlexGridLayout(slide, SH, {
      x,
      y,
      w,
      h,
      mode: "flex",
      itemCount: 4,
      title: "Flexbox",
    });

    const containerX = x + 0.22;
    const containerY = y + 0.68;
    const containerW = w - 0.44;
    const containerH = h - 0.96;
    const items = slide.shapes.filter(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        typeof shape.options.x === "number" &&
        typeof shape.options.y === "number" &&
        typeof shape.options.w === "number" &&
        typeof shape.options.h === "number" &&
        Number(shape.options.x) >= containerX &&
        Number(shape.options.y) >= containerY &&
        Number(shape.options.w) < containerW &&
        Number(shape.options.h) < containerH
    );

    expect(items.length).toBeGreaterThanOrEqual(4);
    items.forEach((item) => {
      const itemX = Number(item.options.x);
      const itemY = Number(item.options.y);
      const itemW = Number(item.options.w);
      const itemH = Number(item.options.h);

      expect(itemX).toBeGreaterThanOrEqual(containerX);
      expect(itemY).toBeGreaterThanOrEqual(containerY);
      expect(itemX + itemW).toBeLessThanOrEqual(containerX + containerW + 0.001);
      expect(itemY + itemH).toBeLessThanOrEqual(containerY + containerH + 0.001);
    });
    expectGeometryIsValid(slide);
  });
});
describe("palantir foundation panels", () => {
  it("addIntelTimelinePanel muestra hitos recientes con fechas visibles", () => {
    const slide = new RecordingSlide();

    addIntelTimelinePanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.6,
      h: 3.2,
      footer: "Los contratos muestran que Palantir ya opera como infraestructura estrategica.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("ABR 2025"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("NATO adquiere Maven"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDecisionPipelinePanel conecta etapas de Maven sin geometria invalida", () => {
    const slide = new RecordingSlide();

    addDecisionPipelinePanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.4,
      h: 3,
      footer: "La IA acelera el analisis, pero no elimina la decision humana.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Deteccion"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Decision"))).toBe(true);
    expect(slide.shapes.filter((shape) => shape.shapeType === SH.chevron).length).toBeGreaterThanOrEqual(5);
    expectGeometryIsValid(slide);
  });

  it("addPowerNetworkMap dibuja a Palantir como nodo central con actores conectados", () => {
    const slide = new RecordingSlide();

    addPowerNetworkMap(slide, SH, {
      x: 0.9,
      y: 1,
      w: 8.8,
      h: 4.2,
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Palantir"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("DoD"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("NATO"))).toBe(true);
    expectGeometryIsValid(slide);
  });
});

