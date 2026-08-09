import { describe, expect, it } from "vitest";
import { addDomTreePanel } from "../../src/components";
import { getEntryBounds, isBoxWithin, RecordingSlide } from "../../src/adapters/recording-slide";

const SH = {
  roundRect: "roundRect",
  ellipse: "ellipse",
  line: "line",
} as const;

describe("addDomTreePanel", () => {
  it("mantiene el árbol dentro del panel", () => {
    const slide = new RecordingSlide();
    const panel = { x: 0.9, y: 1.4, w: 4.8, h: 3.4 };

    addDomTreePanel(slide, SH, {
      ...panel,
      title: "Árbol DOM",
      subtitle: "Lectura rápida",
      nodes: [
        { tag: "body", depth: 0, tone: "neutral" },
        { tag: "main", depth: 1, tone: "blue" },
        { tag: "section", depth: 2, tone: "neutral" },
        { tag: "form", depth: 3, tone: "red" },
        { tag: "input", depth: 4, tone: "blue", detail: 'type="email"' },
      ],
    });

    for (const entry of slide.getEntries()) {
      expect(isBoxWithin(getEntryBounds(entry), panel, 0.2)).toBe(true);
    }
  });
});
