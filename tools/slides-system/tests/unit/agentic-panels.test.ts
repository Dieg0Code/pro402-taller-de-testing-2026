import { describe, expect, it } from "vitest";
import {
  addAgenticFlow,
  addDelegationSplit,
  addSpecWorkflow,
} from "../../src/components";
import { getEntryBounds, RecordingSlide } from "../../src/adapters/recording-slide";
import { TOKENS } from "../../src/theme";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
  ellipse: "ellipse",
  chevron: "chevron",
  line: "line",
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

describe("agentic panels", () => {
  it("addAgenticFlow muestra una secuencia clara de trabajo supervisado", () => {
    const slide = new RecordingSlide();

    addAgenticFlow(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.4,
      h: 3.5,
      steps: [
        { step: "1", title: "Intencion", body: "Definir el objetivo real.", accent: TOKENS.red },
        { step: "2", title: "Contexto", body: "Dar restricciones y entorno.", accent: TOKENS.gold },
        { step: "3", title: "Agente", body: "Ejecuta una primera pasada.", accent: TOKENS.titleFill },
        { step: "4", title: "Validacion", body: "Leer evidencia y decidir.", accent: TOKENS.red },
      ],
      footer: "La velocidad sirve solo si el resultado se verifica.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Intencion"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Validacion"))).toBe(true);
    expect(slide.shapes.filter((entry) => entry.shapeType === SH.chevron).length).toBeGreaterThanOrEqual(3);
    expectGeometryIsValid(slide);
  });

  it("addSpecWorkflow organiza spec plan tasks implement en formato compacto", () => {
    const slide = new RecordingSlide();

    addSpecWorkflow(slide, SH, {
      x: 0.7,
      y: 1,
      w: 7.6,
      h: 4.1,
      compact: true,
      footer: "Cada fase reduce ambiguedad antes de integrar cambios.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Spec"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Implement"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Pregunta guia"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDelegationSplit separa apoyo del agente y validacion humana", () => {
    const slide = new RecordingSlide();

    addDelegationSplit(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.2,
      h: 3.6,
      left: {
        title: "Puede ayudar con",
        subtitle: "primeras versiones y exploracion",
        items: ["Proponer opciones", "Sugerir comandos", "Explicar una base inicial"],
        accent: TOKENS.titleFill,
        fill: TOKENS.softBlue,
      },
      right: {
        title: "No conviene delegar",
        subtitle: "lectura final del sistema",
        items: ["Validar en herramientas reales", "Decidir que integrar", "Detectar riesgos"],
        accent: TOKENS.red,
        fill: TOKENS.white,
      },
      bridgeLabel: "Criterio",
      bridgeBody: "Apoyo rapido, decision humana.",
      footer: "Trabajar con agentes no elimina la responsabilidad tecnica.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Puede ayudar con"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("No conviene delegar"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Criterio"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addDelegationSplit mantiene legible el puente central con textos largos", () => {
    const slide = new RecordingSlide();

    addDelegationSplit(slide, SH, {
      x: 0.8,
      y: 1,
      w: 10.84,
      h: 3.74,
      bridgeLabel: "Pantalla real",
      bridgeBody: "Flexbox y Grid se validan mirando comportamiento, no solo leyendo CSS.",
      left: {
        title: "Puede ayudar con",
        subtitle: "primera version del layout",
        items: ["Bosquejar una grilla", "Sugerir un reparto inicial"],
      },
      right: {
        title: "No conviene delegar",
        subtitle: "lectura espacial final",
        items: ["Comprobar ejes reales", "Validar responsive y legibilidad"],
      },
    });

    const labelEntry = slide.texts.find((entry) => String(entry.text).includes("Pantalla real"));
    const bodyEntry = slide.texts.find((entry) =>
      String(entry.text).includes("Flexbox y Grid se validan mirando comportamiento")
    );

    expect(labelEntry).toBeDefined();
    expect(bodyEntry).toBeDefined();
    expect(Number(labelEntry?.options.w)).toBeGreaterThanOrEqual(0.95);
    expect(Number(bodyEntry?.options.h)).toBeGreaterThanOrEqual(0.38);
    expect(labelEntry?.options.fit).toBe("shrink");
    expect(bodyEntry?.options.fit).toBe("shrink");
    expectGeometryIsValid(slide);
  });

  it("addDelegationSplit mantiene visibles cuatro items por columna cuando hay footer", () => {
    const slide = new RecordingSlide();

    addDelegationSplit(slide, SH, {
      x: 1,
      y: 2.3,
      w: 9.8,
      h: 3.6,
      left: {
        title: "Puede ayudar con",
        subtitle: "lectura inicial",
        items: ["Uno", "Dos", "Tres", "Cuatro"],
        accent: TOKENS.navy,
        fill: TOKENS.softBlue,
      },
      right: {
        title: "No conviene delegar",
        subtitle: "validacion final",
        items: ["A", "B", "C", "D"],
        accent: TOKENS.red,
        fill: TOKENS.white,
      },
      footer: "Entender -> medir -> apoyarse -> validar.",
    });

    const lastLeft = slide.texts.find((entry) => String(entry.text) === "Cuatro");
    const lastRight = slide.texts.find((entry) => String(entry.text) === "D");
    const footerText = slide.texts.find((entry) =>
      String(entry.text).includes("Entender -> medir -> apoyarse -> validar.")
    );

    expect(lastLeft).toBeDefined();
    expect(lastRight).toBeDefined();
    expect(footerText).toBeDefined();

    const lastLeftBounds = getEntryBounds(lastLeft!);
    const lastRightBounds = getEntryBounds(lastRight!);
    const footerBounds = getEntryBounds(footerText!);

    expect(lastLeftBounds.y + lastLeftBounds.h).toBeLessThan(footerBounds.y);
    expect(lastRightBounds.y + lastRightBounds.h).toBeLessThan(footerBounds.y);
    expectGeometryIsValid(slide);
  });
});
