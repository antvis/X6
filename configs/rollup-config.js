import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'

export default (config) => {
  const { plugins = [], ...others } = config
  return {
    input: './src/index.ts',
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
      ...plugins,
    ],
    ...others,
  }
}
