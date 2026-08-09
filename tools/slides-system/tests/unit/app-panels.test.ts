import { describe, expect, it } from "vitest";
import { addComponentTree, addJsonPanel, addRequestResponseFlow } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
  line: "line",
  chevron: "chevron",
} as const;

describe("app panels", () => {
  it("addJsonPanel renderiza código JSON tipado", () => {
    const slide = new RecordingSlide();

    addJsonPanel(slide, SH, {
      x: 1,
      y: 1,
      w: 4,
      h: 2.8,
      code: '{\n  "ok": true,\n  "items": 3\n}',
    });

    expect(slide.texts.some((entry) => String(entry.text).includes('"ok": true'))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("1\n2\n3"))).toBe(true);
  });

  it("addRequestResponseFlow deja visibles request y response", () => {
    const slide = new RecordingSlide();

    addRequestResponseFlow(slide, SH, {
      x: 0.8,
      y: 1.2,
      w: 7.4,
      h: 2.6,
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("GET /api/cursos"))).toBe(true);
    expect(slide.texts.some((entry) => String(entry.text).includes("200 OK"))).toBe(true);
  });

  it("addComponentTree dibuja nodos jerárquicos", () => {
    const slide = new RecordingSlide();

    addComponentTree(slide, SH, {
      x: 0.8,
      y: 1,
      w: 6,
      h: 3.2,
      nodes: [
        { label: "App", depth: 0 },
        { label: "Layout", depth: 1 },
        { label: "Sidebar", depth: 2 },
      ],
    });

    expect(slide.texts.some((entry) => String(entry.text).includes("Sidebar"))).toBe(true);
    expect(slide.shapes.some((shape) => shape.shapeType === SH.line)).toBe(true);
  });

  it("addComponentTree compacta los meta debajo del nodo cuando el panel es estrecho", () => {
    const slide = new RecordingSlide();

    addComponentTree(slide, SH, {
      x: 0.8,
      y: 1,
      w: 3.3,
      h: 2.8,
      nodes: [
        { label: "Tokens", depth: 0, meta: "base" },
        { label: "Button", depth: 1, meta: "acción" },
      ],
    });

    const buttonLabel = slide.texts.find((entry) => String(entry.text).includes("Button"));
    const buttonMeta = slide.texts.find((entry) => String(entry.text).includes("acción"));

    expect(buttonLabel).toBeTruthy();
    expect(buttonMeta).toBeTruthy();
    expect(Number(buttonMeta?.options.y)).toBeGreaterThan(Number(buttonLabel?.options.y));
    expect(Number(buttonMeta?.options.w)).toBeGreaterThan(1);
  });

  it("addComponentTree separa el meta del ancho real del nodo en panel ancho", () => {
    const slide = new RecordingSlide();

    addComponentTree(slide, SH, {
      x: 0.8,
      y: 1,
      w: 5.4,
      h: 4.2,
      nodes: [
        { label: "BRIEF-EJEMPLO.md", depth: 2, meta: "negocio, publico, mensaje" },
      ],
    });

    const nodeShape = slide.shapes.find(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        Number(shape.options?.x) > 2.5 &&
        Number(shape.options?.w) > 1.5 &&
        Number(shape.options?.w) < 1.7
    );
    const meta = slide.texts.find((entry) => String(entry.text).includes("negocio, publico, mensaje"));

    expect(nodeShape).toBeTruthy();
    expect(meta).toBeTruthy();
    expect(Number(meta?.options.x)).toBeGreaterThanOrEqual(Number(nodeShape?.options.x) + Number(nodeShape?.options.w) + 0.17);
    expect(Number(meta?.options.h)).toBeGreaterThanOrEqual(0.2);
  });
});
