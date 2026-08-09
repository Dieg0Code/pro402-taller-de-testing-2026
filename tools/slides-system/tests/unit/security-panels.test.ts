import { describe, expect, it } from "vitest";
import { addAuthFlow, addChecklistGrid, addExposureCompare } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";
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

describe("security panels", () => {
  it("addExposureCompare resuelve comparación local vs publicado", () => {
    const slide = new RecordingSlide();

    addExposureCompare(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.8,
      h: 3.6,
      bridgeLabel: "Al publicar",
      left: {
        fill: TOKENS.navy,
        accent: TOKENS.gold,
        label: "En local",
        title: "Control acotado",
        body: "La app depende del equipo y de un uso mas predecible.",
      },
      right: {
        fill: TOKENS.softBlue,
        accent: TOKENS.red,
        label: "Publicado",
        title: "Exposición real",
        body: "Aparecen tráfico externo, bots, configuraciones y errores visibles.",
      },
      footer: "Cambiar de contexto cambia también el riesgo.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("En local"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Publicado"))).toBe(true);
    expect(slide.shapes.some((entry) => entry.shapeType === SH.chevron)).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addChecklistGrid organiza una revisión compacta sin geometría negativa", () => {
    const slide = new RecordingSlide();

    addChecklistGrid(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.4,
      h: 3.8,
      columns: 3,
      entries: [
        { badge: "Revisar", title: "Datos", body: "Qué tipo de información procesa." },
        { badge: "Acceso", title: "Permisos", body: "Quien puede entrar y a que." },
        { badge: "Secretos", title: "Credenciales", body: "No dejarlas visibles." },
        { badge: "Rutas", title: "Superficie", body: "No dejar pruebas expuestas." },
        { badge: "Entrega", title: "Archivos", body: "Ver que se publico de verdad." },
        { badge: "Habito", title: "Revision final", body: "Comprobar antes de compartir." },
      ],
      footer: "Pensar estas preguntas mejora el criterio antes de publicar.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Revision final"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addAuthFlow muestra la secuencia credencial autenticación autorización", () => {
    const slide = new RecordingSlide();

    addAuthFlow(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.2,
      h: 3.7,
      steps: [
        { step: "1", title: "Credencial", body: "Dato usado para presentarse.", accent: TOKENS.gold },
        { step: "2", title: "Autenticación", body: "Proceso que comprueba identidad.", accent: TOKENS.titleFill },
        {
          step: "3",
          title: "Autorización",
          body: "Decide que puede hacer esa persona.",
          accent: TOKENS.red,
          fill: TOKENS.navy,
        },
      ],
      example: "Ingresar una clave es credencial; verificarla es autenticación; dejar entrar al panel es autorización.",
      footer: "Separar estas etapas mejora como leemos un sistema.",
    });

    const badges = slide.shapes.filter(
      (entry) =>
        entry.shapeType === SH.roundRect &&
        (entry.options.fill as { color?: string } | undefined)?.color != null &&
        Number(entry.options.w) === 0.28
    );

    expect(slide.texts.some((entry) => String(entry.text).includes("Autorización"))).toBe(true);
    expect(slide.shapes.filter((entry) => entry.shapeType === SH.chevron).length).toBeGreaterThanOrEqual(2);
    badges.forEach((badge) => {
      expect(Number(badge.options.y)).toBeGreaterThanOrEqual(1.6);
    });
    expectGeometryIsValid(slide);
  });
});
