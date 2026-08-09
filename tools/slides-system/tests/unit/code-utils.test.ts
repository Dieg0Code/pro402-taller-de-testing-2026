import { describe, expect, it } from "vitest";
import { makeCodeRuns, makeCodeSvgData } from "../../src/utils";

describe("makeCodeRuns", () => {
  it("genera varios colores al resaltar HTML", () => {
    const runs = makeCodeRuns(
      '<label for="correo">Correo</label>\n<input id="correo" name="correo" type="email" />',
      "html",
      11
    );

    const colors = new Set(
      runs
        .filter((run) => run.text.trim().length > 0)
        .map((run) => String(run.options?.color ?? ""))
    );

    expect(colors.size).toBeGreaterThan(2);
  });

  it("usa breakLine en vez de runs con salto literal", () => {
    const runs = makeCodeRuns("const ok = true;\nconsole.log(ok);", "js", 11);

    expect(runs.some((run) => String(run.text).includes("\n"))).toBe(false);
    expect(runs.some((run) => run.options?.breakLine === true)).toBe(true);
  });

  it("agrupa cada linea del SVG en un text con tspan para no aplastar signos ni espacios", () => {
    const data = makeCodeSvgData('const estado = "JS activo";\nconsole.log(estado);', "js", {
      width: 4.8,
      height: 1.8,
      fontSize: 10,
    });

    const svg = Buffer.from(String(data).replace(/^image\/svg\+xml;base64,/, ""), "base64").toString("utf8");

    expect(svg.includes("<tspan")).toBe(true);
    expect(svg.includes(">const</tspan>")).toBe(true);
    expect(svg.includes("> estado </tspan>")).toBe(true);
    expect(svg.includes(">.</tspan>")).toBe(true);
    expect(svg.includes(">;</tspan>")).toBe(true);
    expect(svg.includes('dominant-baseline="hanging"')).toBe(false);
  });
});
