import { describe, expect, it } from "vitest";
import { addFormMock } from "../../src/components";
import { RecordingSlide } from "../../src/adapters/recording-slide";
import { TOKENS } from "../../src/theme";

const SH = {
  roundRect: "roundRect",
  ellipse: "ellipse",
} as const;

describe("addFormMock", () => {
  it("centra el CTA dentro de la maqueta", () => {
    const slide = new RecordingSlide();

    addFormMock(slide, SH, {
      x: 1,
      y: 1,
      w: 3.8,
      h: 2.8,
      title: "Acceso",
      buttonLabel: "Ingresar",
      fields: [{ label: "Correo" }, { label: "Contraseña" }],
    });

    const buttonShape = slide.shapes.find(
      (shape) =>
        shape.shapeType === SH.roundRect &&
        (shape.options.fill as { color?: string } | undefined)?.color === TOKENS.red &&
        shape.options.h === 0.42
    );

    expect(buttonShape).toBeDefined();
    expect(Number(buttonShape?.options.x)).toBeCloseTo(2.22, 5);
  });
});
