import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  target: "node18",
  treeshake: true,
});
