import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import PptxGenJS from "pptxgenjs";
import JSZip from "jszip";
import { vcmLockup } from "../../src/components";
import { applyAiepTheme } from "../../src/theme";
import type { PptxLike, SlideLike } from "../../src/types";

const MOJIBAKE_PATTERN = new RegExp(
  [
    "\\u00C3",
    "\\u00C2",
    "\\u00E2\\u20AC",
  ].join("|")
);

// Construye un deck minimo con la libreria (tema AIEP + sello VcM en fondo
// claro y oscuro) y lo escribe a disco. No depende de ningun curso: ejercita
// la libreria como tal, incluido el embebido real de las imagenes del sello.
async function buildLibraryDeck(outPath: string) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "AIEP_WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "AIEP_WIDE";
  applyAiepTheme(pptx as unknown as PptxLike, {
    author: "AIEP", company: "AIEP", subject: "Test", title: "Test VcM",
  });

  const light = pptx.addSlide();
  light.background = { color: "F8F3EC" };
  light.addText("Vinculación con el Medio", {
    x: 0.7, y: 0.6, w: 9, h: 0.6, fontSize: 24, color: "102A43", bold: true,
  });
  vcmLockup(light as unknown as SlideLike);

  const dark = pptx.addSlide();
  dark.background = { color: "0B1B30" };
  dark.addText("Cierre", {
    x: 0.7, y: 0.6, w: 9, h: 0.6, fontSize: 24, color: "FFFFFF", bold: true,
  });
  vcmLockup(dark as unknown as SlideLike, { onDark: true });

  await pptx.writeFile({ fileName: outPath });
}

describe("deck de libreria con sello VcM", () => {
  it(
    "embebe el sello y produce un OpenXML válido (sin mojibake ni geometría negativa)",
    async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vcm-deck-"));
      try {
        const outPptx = path.join(tempDir, "vcm-test.pptx");
        await buildLibraryDeck(outPptx);
        expect(fs.existsSync(outPptx)).toBe(true);
        expect(fs.statSync(outPptx).size).toBeGreaterThan(0);

        // Un .pptx es un ZIP: lo leemos en proceso con JSZip (cross-platform).
        const zip = await JSZip.loadAsync(fs.readFileSync(outPptx));
        const names = Object.keys(zip.files);

        // El sello se embebió como media (dark + white -> 2 imágenes).
        const media = names.filter((n) => /^ppt\/media\//.test(n));
        expect(media.length).toBeGreaterThanOrEqual(2);

        const slideNames = names.filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
        expect(slideNames.length).toBe(2);

        const slideXml = await Promise.all(
          slideNames.map((n) => zip.files[n].async("string"))
        );
        const joined = slideXml.join("\n");
        expect(joined).not.toMatch(MOJIBAKE_PATTERN);

        const negativeGeometry = joined.match(/<a:(?:off|ext)\b[^>]*\b(?:x|y|cx|cy)="-\d+"/g) ?? [];
        expect(negativeGeometry).toHaveLength(0);

        // Cada slide referencia una imagen (el sello).
        for (const xml of slideXml) {
          expect(xml).toMatch(/<a:blip\b/);
        }
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    },
    20000
  );
});
