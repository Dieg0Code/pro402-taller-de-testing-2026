import { describe, expect, it } from "vitest";
// El runtime CommonJS que usan los deck sources reales: require(".../slides-system").
import runtime from "../../index.js";
import barrel from "../../components/index.js";

const components = (runtime as { components: Record<string, unknown> }).components;
const barrelComponents = barrel as unknown as Record<string, unknown>;

describe("runtime barrel (index.js)", () => {
  it("expone los componentes clave usados por los deck sources reales", () => {
    const expected = [
      "vcmLockup",
      "addHeader",
      "addCodePanel",
      "addEventLoopDiagram", // async-panels
      "addServerCycle", // backend-panels
    ];
    for (const name of expected) {
      expect(typeof components[name], name).toBe("function");
    }
  });

  it("no diverge de components/index.js (mismo set de componentes)", () => {
    const missing = Object.keys(barrelComponents).filter((k) => !(k in components));
    expect(missing).toEqual([]);
  });
});
