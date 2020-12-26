import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'X6ReactComponents',
      format: 'umd',
      file: 'dist/x6-react-components.js',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
        antd: 'antd',
      },
    },
  ],
  external: ['antd', 'react', 'react-dom'],
  plugins: [
    typescript({ declaration: false }),
    resolve(),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    terser(),
    filesize(),
    // autoExternal(),
    postcss({
      minimize: true,
      sourceMap: false,
      extensions: ['.less', '.css'],
      use: [['less', { javascriptEnabled: true }]],
    }),
  ],
}
