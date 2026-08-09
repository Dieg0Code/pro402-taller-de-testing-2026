import { describe, expect, it } from "vitest";
import {
  addActorLane,
  addMythRealityGrid,
  addStageChain,
  addUrlBreakdown,
} from "../../src/components";
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

describe("foundation panels", () => {
  it("addUrlBreakdown muestra la URL y sus segmentos", () => {
    const slide = new RecordingSlide();

    addUrlBreakdown(slide, SH, {
      x: 0.8,
      y: 1.1,
      w: 8.8,
      h: 3,
      url: "https://campus.example.com/cursos?id=3",
      segments: [
        { label: "Protocolo", value: "https", note: "Define el acceso.", accent: TOKENS.red, mono: true },
        {
          label: "Dominio",
          value: "campus.example.com",
          note: "Nombra el sitio.",
          accent: TOKENS.titleFill,
          mono: true,
          ratio: 1.8,
        },
        { label: "Ruta", value: "/cursos", note: "Seccion pedida.", accent: TOKENS.gold, mono: true },
        { label: "Parametro", value: "?id=3", note: "Dato extra.", accent: TOKENS.red, mono: true },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("campus.example.com"))).toBe(true);
    expect(slide.shapes.some((entry) => entry.shapeType === SH.line)).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addMythRealityGrid organiza mitos como tiras compactas", () => {
    const slide = new RecordingSlide();

    addMythRealityGrid(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.6,
      h: 3.3,
      entries: [
        { myth: "Internet = Web", reality: "La Web es solo un servicio sobre Internet." },
        { myth: "Navegador = Internet", reality: "Es una herramienta cliente." },
        { myth: "Cargar = estar bien", reality: "Puede seguir mal publicado o mal resuelto." },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Internet = Web"))).toBe(true);
    expect(slide.shapes.some((entry) => (entry.options.fill as { color?: string } | undefined)?.color === TOKENS.paleRed)).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addActorLane dibuja un carril con nodos y tarjetas alternadas", () => {
    const slide = new RecordingSlide();

    addActorLane(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.8,
      h: 3.3,
      entries: [
        { label: "Usuario", body: "Inicia la accion.", accent: TOKENS.red },
        { label: "Navegador", body: "Interpreta recursos.", accent: TOKENS.titleFill },
        { label: "Cliente", body: "Emite la solicitud.", accent: TOKENS.gold },
        { label: "Servidor", body: "Procesa la respuesta.", accent: TOKENS.navy, fill: TOKENS.navy },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Servidor"))).toBe(true);
    expect(slide.shapes.filter((entry) => entry.shapeType === SH.line).length).toBeGreaterThanOrEqual(3);
    expectGeometryIsValid(slide);
  });

  it("addStageChain resuelve etapas y notas sin geometria negativa", () => {
    const slide = new RecordingSlide();

    addStageChain(slide, SH, {
      x: 0.8,
      y: 1,
      w: 10.2,
      h: 3.7,
      stages: [
        { step: "1", title: "Local", body: "Se desarrolla." },
        { step: "2", title: "Despliegue", body: "Se publica." },
        { step: "3", title: "Hosting", body: "Se aloja." },
        { step: "4", title: "Dominio", body: "Se encuentra." },
      ],
      notes: [
        { title: "Si una capa falla", body: "Puede romper el acceso.", accent: TOKENS.red },
        { title: "Caso simple", body: "Portafolio personal publicado.", accent: TOKENS.titleFill },
      ],
      footer: "La cadena completa explica por que publicar no es solo subir archivos.",
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Despliegue"))).toBe(true);
    expect(slide.shapes.some((entry) => entry.shapeType === SH.chevron)).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addStageChain ensancha el badge cuando el paso es una hora", () => {
    const slide = new RecordingSlide();

    addStageChain(slide, SH, {
      x: 0.8,
      y: 1,
      w: 8.4,
      h: 3.1,
      stages: [
        { step: "10:50", title: "Encuadre", body: "Se revisa la consigna." },
        { step: "11:05", title: "Demo", body: "Se muestra el flujo." },
      ],
    });

    const timeText = slide.texts.find((entry) => String(entry.text).includes("10:50"));
    const timeBadge = slide.shapes.find(
      (entry) =>
        entry.shapeType === SH.roundRect &&
        Number(entry.options?.x) >= 1 &&
        Number(entry.options?.x) <= 1.2 &&
        Number(entry.options?.w) >= 0.5
    );

    expect(timeText).toBeTruthy();
    expect(timeBadge).toBeTruthy();
    expect(Number(timeText?.options.w)).toBeGreaterThanOrEqual(0.5);
  });
});
