import { describe, expect, it } from "vitest";
// cspell:ignore supabase postgres sao peliculas pelicula funciones batman aiep relacion
import {
  addJoinSetDiagram,
  addSupabaseProjectSetupPanel,
  addSupabaseTableEditorPanel,
} from "../../src/components";
import { RecordingSlide, getEntryBounds, isBoxWithin } from "../../src/adapters/recording-slide";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
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

describe("backend panels", () => {
  it("addJoinSetDiagram mantiene todas sus piezas dentro del contenedor", () => {
    const types = ["inner", "left", "right", "full", "leftOnly", "rightOnly"] as const;

    types.forEach((type) => {
      const slide = new RecordingSlide();
      const bounds = { x: 0.8, y: 1.1, w: 5.4, h: 4.2 };

      addJoinSetDiagram(slide, SH, {
        ...bounds,
        type,
        title: "JOIN visual",
        leftLabel: "usuarios",
        rightLabel: "compras",
      });

      expect(slide.images).toHaveLength(1);
      expect(slide.texts.some((entry) => String(entry.text).includes("JOIN"))).toBe(true);
      expectGeometryIsValid(slide);

      const outside = slide
        .getEntries()
        .filter((entry) => !isBoxWithin(getEntryBounds(entry), bounds, 0.001));
      expect(outside).toHaveLength(0);
    });
  });

  it("addSupabaseProjectSetupPanel muestra el formulario y el dashboard inicial", () => {
    const slide = new RecordingSlide();

    addSupabaseProjectSetupPanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 9.8,
      h: 3.9,
      projectName: "aiep-cine-db",
      regionName: "South America (Sao Paulo)",
      statusItems: ["Project provisioned", "Database online", "API ready"],
      tabs: ["Table Editor", "SQL Editor", "API Docs"],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("aiep-cine-db"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("South America (Sao Paulo)"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Table Editor"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("API ready"))).toBe(true);
    expectGeometryIsValid(slide);
  });

  it("addSupabaseTableEditorPanel muestra columnas, relacion y fila de prueba", () => {
    const slide = new RecordingSlide();

    addSupabaseTableEditorPanel(slide, SH, {
      x: 0.8,
      y: 1,
      w: 10,
      h: 4,
      tableName: "funciones",
      columns: [
        { name: "id", type: "uuid", key: "PK" },
        { name: "pelicula_id", type: "uuid", key: "FK" },
        { name: "sala_id", type: "uuid", key: "FK" },
        { name: "horario", type: "timestamp" },
      ],
      relationshipTitle: "Foreign key",
      relationshipBody: "funciones.pelicula_id -> peliculas.id",
      sampleRowTitle: "Sample row",
      sampleValues: ['titulo: "Batman"', "horario: 2026-04-14 20:30"],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("funciones"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("pelicula_id"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("funciones.pelicula_id -> peliculas.id"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("Batman"))).toBe(true);
    expectGeometryIsValid(slide);
  });
});
