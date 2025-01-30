#!/usr/bin/env node

import * as esbuild from "esbuild";
import * as sass from "sass";
import * as process from "process";

const currentDir = import.meta.dirname;
const entrypoint = "app.ts";
const outfile = "out/murex";

const scssPlugin = {
  name: "scss",
  setup(build) {
    build.onResolve({ filter: /.*\.scss$/ }, (args) => ({
      path: args.path,
      namespace: "scss",
    }));

    build.onLoad({ filter: /.*\.scss$/, namespace: "scss" }, ({ path }) => {
      const contents = sass.compile(path, { style: "compressed" });

      return {
        contents: contents.css,
        watchFiles: [path],
        loader: "text",
      };
    });
  },
};

await esbuild.build({
  entryPoints: [entrypoint],
  bundle: true,
  minify: true,
  outfile,
  format: "esm",
  external: ["gi://*", "system", "console"],
  platform: "neutral",
  tsconfig: "./tsconfig.json",
  loader: {
    ".js": "ts",
  },
  plugins: [scssPlugin],
  define: {
    SRC: `"${currentDir}/${entrypoint}"`,
  },
  alias: {
    astal: process.env.ASTAL_PATH,
  },
});
