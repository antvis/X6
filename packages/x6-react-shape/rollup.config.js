import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
import autoExternal from 'rollup-plugin-auto-external'

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'X6ReactShape',
      format: 'umd',
      file: 'dist/x6-react-shape.js',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
        '@antv/x6': 'X6',
      },
    },
  ],
  plugins: [
    typescript({ outDir: './dist' }),
    resolve(),
    commonjs(),
    terser(),
    filesize(),
    autoExternal(),
  ],
}
