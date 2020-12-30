import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
// import pkg from './package.json'
// const deps = Object.keys(pkg.dependencies);
const vue = require('rollup-plugin-vue')

export default [
  {
    input: 'src/index.ts',
    plugins: [
      terser(),
      nodeResolve(),
      vue({
        target: 'browser',
        css: false,
        exposeFilename: false,
      }),
      typescript({ abortOnError: false }),
    ],
    external(id) {
      return /^vue/.test(id)
      // || deps.some(k => new RegExp('^' + k).test(id))
    },
  },
]
