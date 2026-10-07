import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.js", "src/service-worker.js"],
  bundle: true,
  format: "esm",
  external: ["idb-keyval", "@js-temporal/polyfill", "lit"],
  outdir: "dist/",
});
