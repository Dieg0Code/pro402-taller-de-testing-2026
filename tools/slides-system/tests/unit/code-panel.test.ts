import { describe, expect, it } from "vitest";
import { addCodeAnnotation, addCodePanel } from "../../src/components";
import { boxesIntersect, getEntryBounds, RecordingSlide } from "../../src/adapters/recording-slide";
import { TOKENS } from "../../src/theme";

const SH = {
  rect: "rect",
  roundRect: "roundRect",
} as const;

describe("addCodeAnnotation", () => {
  it("renderiza el snippet coloreado como un SVG seguro para PowerPoint", () => {
    const slide = new RecordingSlide();

    addCodePanel(slide, SH, {
      x: 1,
      y: 1,
      w: 4.8,
      h: 2.6,
      lang: "js",
      code: 'const button = document.querySelector("#ok");',
      title: "Snippet",
    });

    const codeImage = slide.images.find((entry) =>
      String(entry.options.data ?? "").startsWith("image/svg+xml;base64,")
    );

    expect(codeImage).toBeTruthy();
  });

  it("agrega margen superior interno al SVG para que la primera linea no roce el header", () => {
    const slide = new RecordingSlide();

    addCodePanel(slide, SH, {
      x: 1,
      y: 1,
      w: 4.8,
      h: 1.5,
      lang: "js",
      code: 'const estado = "ok";\nconsole.log(estado);',
      title: "Snippet",
      fontSize: 10.2,
    });

    const codeImage = slide.images.find((entry) =>
      String(entry.options.data ?? "").startsWith("image/svg+xml;base64,")
    );

    expect(codeImage).toBeTruthy();

    const encoded = String(codeImage?.options.data ?? "").replace(/^image\/svg\+xml;base64,/, "");
    const svg = Buffer.from(encoded, "base64").toString("utf8");
    const yMatches = [...svg.matchAll(/<text[^>]* y="(\d+)"/g)].map((match) => Number(match[1]));
    const minY = Math.min(...yMatches);

    expect(minY).toBeGreaterThanOrEqual(10);
  });

  it("mantiene los conectores fuera del interior del snippet", () => {
    const slide = new RecordingSlide();

    addCodeAnnotation(slide, SH, {
      codeX: 1,
      codeY: 1,
      codeW: 4.2,
      codeH: 2.8,
      totalLines: 10,
      lineNumber: 3,
      column: 1,
      length: 6,
      side: "right",
      connectorColor: TOKENS.guide,
      target: {
        x: 5.8,
        y: 1.9,
        w: 1.4,
        h: 0.7,
        side: "left",
      },
    });

    const connectorSegments = slide.shapes.filter(
      (shape) =>
        shape.shapeType === SH.rect &&
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.guide
    );

    const codeInterior = {
      x: 1.18,
      y: 1.62,
      w: 3.72,
      h: 1.98,
    };

    for (const segment of connectorSegments) {
      expect(boxesIntersect(getEntryBounds(segment), codeInterior)).toBe(false);
    }
  });

  it("usa un resaltado suave detras del token anotado", () => {
    const slide = new RecordingSlide();

    addCodeAnnotation(slide, SH, {
      codeX: 1,
      codeY: 1,
      codeW: 4.2,
      codeH: 2.8,
      totalLines: 10,
      lineNumber: 4,
      column: 6,
      length: 12,
      color: TOKENS.red,
      target: {
        x: 5.8,
        y: 1.9,
        w: 1.4,
        h: 0.7,
        side: "left",
      },
    });

    const highlightShapes = slide.shapes.filter(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.paleRed &&
        typeof shape.options.w === "number" &&
        shape.options.w >= 0.3
    );

    expect(highlightShapes.length).toBeGreaterThanOrEqual(1);
  });

  it("puede renderizar badges numerados para unir snippet y explicacion", () => {
    const slide = new RecordingSlide();

    addCodeAnnotation(slide, SH, {
      codeX: 1,
      codeY: 1,
      codeW: 4.2,
      codeH: 2.8,
      totalLines: 10,
      lineNumber: 4,
      column: 6,
      length: 12,
      color: TOKENS.red,
      badgeText: "2",
      showHighlight: false,
      sourceBadgeStyle: "circle",
      targetBadgeStyle: "circle",
      showTargetBadgeLabel: true,
      target: {
        x: 5.8,
        y: 1.9,
        w: 1.4,
        h: 0.7,
        side: "left",
      },
    });

    const badgeTexts = slide.texts.filter((entry) => entry.text === "2");

    expect(badgeTexts.length).toBeGreaterThanOrEqual(2);
  });

  it("usa puertos laterales sin duplicar etiquetas en el modo minimalista", () => {
    const slide = new RecordingSlide();

    addCodeAnnotation(slide, SH, {
      codeX: 1,
      codeY: 1,
      codeW: 4.2,
      codeH: 2.8,
      totalLines: 10,
      lineNumber: 4,
      column: 6,
      length: 12,
      color: TOKENS.red,
      badgeText: "2",
      target: {
        x: 5.8,
        y: 1.9,
        w: 1.4,
        h: 0.7,
        side: "left",
      },
    });

    const badgeTexts = slide.texts.filter((entry) => entry.text === "2");
    const portShapes = slide.shapes.filter(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.red &&
        typeof shape.options.w === "number" &&
        shape.options.w <= 0.1
    );

    expect(badgeTexts.length).toBe(0);
    expect(portShapes.length).toBeGreaterThanOrEqual(1);
  });
});
