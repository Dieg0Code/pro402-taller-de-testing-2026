import { describe, expect, it } from "vitest";
import { containsMojibake, findMojibakeMatches } from "../../src/utils";

describe("text quality", () => {
  it("detecta mojibake típico", () => {
    const brokenPresentation = String.fromCharCode(
      112, 114, 101, 115, 101, 110, 116, 97, 99, 105, 195, 179, 110
    );
    const brokenModule = String.fromCharCode(
      109, 195, 179, 100, 117, 108, 111, 32, 121, 32, 97, 99, 99, 105, 195, 179, 110
    );

    expect(containsMojibake(brokenPresentation)).toBe(true);
    expect(findMojibakeMatches(brokenModule)).toContain("\u00C3");
  });

  it("no marca español correcto", () => {
    expect(containsMojibake("presentación y acción")).toBe(false);
  });
});
