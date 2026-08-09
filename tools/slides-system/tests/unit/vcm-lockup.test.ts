import { describe, expect, it } from "vitest";
import { vcmLockup } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";

const SLIDE_W = 13.333;

describe("vcmLockup", () => {
  it("usa el sello navy (dark) sobre fondo claro por defecto", () => {
    const slide = new RecordingSlide();
    vcmLockup(slide);
    expect(slide.images).toHaveLength(1);
    expect(String(slide.images[0].options.path)).toContain("lockup-vinculacion-dark.png");
  });

  it("usa el sello blanco sobre fondo oscuro (onDark)", () => {
    const slide = new RecordingSlide();
    vcmLockup(slide, { onDark: true });
    expect(slide.images).toHaveLength(1);
    expect(String(slide.images[0].options.path)).toContain("lockup-vinculacion-white.png");
  });

  it("coloca el sello en la esquina superior derecha, sin salirse de la slide", () => {
    const slide = new RecordingSlide();
    vcmLockup(slide);
    const o = slide.images[0].options;
    const x = Number(o.x);
    const y = Number(o.y);
    const w = Number(o.w);
    expect(x).toBeGreaterThan(SLIDE_W / 2);
    expect(y).toBeLessThan(1);
    expect(x + w).toBeLessThanOrEqual(SLIDE_W + 0.01);
  });

  it("respeta un override de posición", () => {
    const slide = new RecordingSlide();
    vcmLockup(slide, { pos: { x: 0.4, y: 0.4, w: 1, h: 1 } });
    const o = slide.images[0].options;
    expect(Number(o.x)).toBeGreaterThanOrEqual(0.4);
    expect(Number(o.x)).toBeLessThan(1.5);
  });
});
