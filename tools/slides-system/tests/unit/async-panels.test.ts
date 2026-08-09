import { describe, expect, it } from "vitest";
import { addEventLoopDiagram, addSyntaxCompare } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
  line: "line",
  chevron: "chevron",
  ellipse: "ellipse",
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

describe("async panels", () => {
  describe("addEventLoopDiagram", () => {
    it("renderiza las tres zonas con sus etiquetas", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
      });

      expect(slide.texts.some((e) => String(e.text).includes("Call Stack"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("Web APIs"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("Task Queue"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("Event Loop"))).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("muestra los frames del Call Stack pasados por opciones", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.5,
        y: 1,
        w: 9.2,
        h: 3.8,
        stackFrames: ["main()", "setTimeout()", "callback()"],
      });

      expect(slide.texts.some((e) => String(e.text).includes("callback()"))).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("muestra los items de Web APIs y Task Queue", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        apiItems: ["setTimeout 2s"],
        queueItems: ["cb1", "cb2"],
      });

      expect(slide.texts.some((e) => String(e.text).includes("setTimeout 2s"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("cb1"))).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("dibuja flechas de conexion entre zonas", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
      });

      expect(slide.shapes.some((s) => s.shapeType === SH.line)).toBe(true);
      expect(slide.shapes.some((s) => s.shapeType === SH.chevron)).toBe(true);
    });

    it("resalta la zona correcta cuando se pasa highlightPhase", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        highlightPhase: "queue",
      });

      // Al resaltar "queue", el header de esa zona usa el color rojo de acento
      const redHeader = slide.shapes.find(
        (s) =>
          s.shapeType === SH.roundRect &&
          (s.options.fill as { color?: string } | undefined)?.color === "D62027"
      );
      expect(redHeader).toBeTruthy();
      expectGeometryIsValid(slide);
    });

    it("muestra el caption cuando se proporciona", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.9,
        caption: "El event loop comprueba la cola cuando el stack esta vacio.",
      });

      expect(
        slide.texts.some((e) =>
          String(e.text).includes("event loop comprueba la cola")
        )
      ).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("funciona con valores por defecto sin opciones adicionales", () => {
      const slide = new RecordingSlide();

      addEventLoopDiagram(slide, SH, {
        x: 0,
        y: 0,
        w: 10,
        h: 4,
      });

      expect(slide.texts.some((e) => String(e.text).includes("(empty)"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("cola vacia"))).toBe(true);
      expectGeometryIsValid(slide);
    });
  });

  describe("addSyntaxCompare", () => {
    it("renderiza las etiquetas Antes y ES6+ por defecto", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        beforeCode: "var x = 1;",
        afterCode: "const x = 1;",
      });

      expect(slide.texts.some((e) => String(e.text).includes("Antes"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("ES6+"))).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("acepta etiquetas personalizadas para los paneles", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        beforeLabel: "ES5",
        afterLabel: "ES2022",
        beforeCode: "function f() {}",
        afterCode: "const f = () => {};",
      });

      expect(slide.texts.some((e) => String(e.text).includes("ES5"))).toBe(true);
      expect(slide.texts.some((e) => String(e.text).includes("ES2022"))).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("incluye un divisor vertical entre los dos paneles", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        beforeCode: "var n = 0;",
        afterCode: "let n = 0;",
      });

      // El divisor es un rect de ancho pequeño con color de borde
      const divider = slide.shapes.find(
        (s) =>
          s.shapeType === SH.rect &&
          Number(s.options.w) < 0.15 &&
          Number(s.options.h) > 1
      );
      expect(divider).toBeTruthy();
      expectGeometryIsValid(slide);
    });

    it("genera imagenes SVG para el codigo de cada panel", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        beforeCode: "var x = 1;",
        afterCode: "const x = 1;",
      });

      expect(slide.images.length).toBeGreaterThanOrEqual(2);
      expectGeometryIsValid(slide);
    });

    it("muestra el caption cuando se proporciona", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.9,
        beforeCode: "var x = 1;",
        afterCode: "const x = 1;",
        caption: "Prefiere const y let sobre var en codigo moderno.",
      });

      expect(
        slide.texts.some((e) =>
          String(e.text).includes("Prefiere const y let")
        )
      ).toBe(true);
      expectGeometryIsValid(slide);
    });

    it("los dos paneles de codigo tienen posicion x distinta", () => {
      const slide = new RecordingSlide();

      addSyntaxCompare(slide, SH, {
        x: 0.8,
        y: 1,
        w: 9,
        h: 3.6,
        beforeCode: "var a = 1;",
        afterCode: "const a = 1;",
      });

      const images = slide.images;
      expect(images.length).toBeGreaterThanOrEqual(2);
      const xValues = images.map((img) => Number(img.options.x));
      const uniqueX = new Set(xValues);
      expect(uniqueX.size).toBeGreaterThanOrEqual(2);
    });
  });
});
