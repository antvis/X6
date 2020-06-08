import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
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
  plugins: [
    typescript({ declaration: false }),
    resolve(),
    commonjs(),
    terser(),
    filesize(),
  ],
}
