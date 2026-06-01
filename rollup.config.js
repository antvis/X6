import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import visualizer from "rollup-plugin-visualizer";

const isBundleVis = !!process.env.BUNDLE_VIS;

const Bundles = [
  // [input, output, name]
  ["src/index.ts", "dist/x6.min.js", "X6"],
];

export default [
  // Bundle for G2 umd entries.
  ...Bundles.map(([input, file, name], idx) => ({
    input,
    treeshake: {
      preset: "smallest",
    },
    output: [
      {
        file,
        name,
        format: "umd",
        sourcemap: false,
        plugins: [isBundleVis && idx === Bundles.length - 1 && visualizer()],
      },
    ],
    plugins: [
      resolve({
        extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["__tests__/**"],
        compilerOptions: {
          declaration: false,
          declarationMap: false,
          sourceMap: false,
        },
      }),
      commonjs(),
      json(),
      terser(),
    ],
    context: "window", // Disable 'THIS_IS_UNDEFINED' warnings
  })),
];
