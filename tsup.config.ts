import { defineConfig } from "tsup";

export default defineConfig({
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  clean: true,
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
});
