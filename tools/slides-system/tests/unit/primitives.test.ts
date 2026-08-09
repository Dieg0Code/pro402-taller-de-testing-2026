import { describe, expect, it } from "vitest";
import { addMiniCard } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";

const SH = {
  roundRect: "roundRect",
  rect: "rect",
} as const;

describe("primitives", () => {
  it("addMiniCard no genera geometría negativa en cards bajas", () => {
    const slide = new RecordingSlide();

    addMiniCard(slide, SH, {
      x: 1,
      y: 1,
      w: 3.4,
      h: 0.48,
      title: "estructura",
      body: "qué deja entender el documento",
    });

    const offenders = [...slide.shapes, ...slide.texts].filter((entry) => {
      const rawW = typeof entry.options.w === "number" ? entry.options.w : undefined;
      const rawH = typeof entry.options.h === "number" ? entry.options.h : undefined;
      return (
        (rawW != null && (!Number.isFinite(rawW) || rawW < 0)) ||
        (rawH != null && (!Number.isFinite(rawH) || rawH < 0))
      );
    });

    expect(offenders).toHaveLength(0);
  });
});
