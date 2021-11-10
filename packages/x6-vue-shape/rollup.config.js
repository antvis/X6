import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
import autoExternal from 'rollup-plugin-auto-external'

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'X6VueShape',
      format: 'umd',
      file: 'dist/x6-vue-shape.js',
      sourcemap: true,
      globals: {
        vue: 'Vue',
        'vue-demi': 'vueDemi',
        'react-dom': 'ReactDom',
        '@antv/x6': 'X6',
      },
    },
  ],
  plugins: [
    typescript({ declaration: false }),
    resolve(),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
    filesize(),
    autoExternal(),
  ],
}
