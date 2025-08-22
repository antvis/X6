import nodePolyfills from 'rollup-plugin-polyfill-node';
import visualizer from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';

const isBundleVis = !!process.env.BUNDLE_VIS;

const Bundles = [
  // [input, output, name]
  ['src/index.ts', 'dist/x6.min.js', 'X6'],
];

export default [
  // Bundle for G2 umd entries.
  ...Bundles.map(([input, file, name], idx) => ({
    input,
    treeshake: {
      preset: 'smallest',
    },
    output: [
      {
        file,
        name,
        format: 'umd',
        sourcemap: false,
        plugins: [isBundleVis && idx === Bundles.length - 1 && visualizer()],
      },
    ],
    plugins: [
      nodePolyfills(),
      resolve(),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      optimizeLodashImports(),
      json(),
      terser(),
    ],
    context: 'window', // Disable 'THIS_IS_UNDEFINED' warnings
  })),
];
