/* eslint-disable */

import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'X6',
      format: 'umd',
      file: 'dist/x6.js',
      sourcemap: true,
    },
  ],
  plugins: [typescript({ outDir: './dist' }), resolve(), commonjs(), terser()],
}
