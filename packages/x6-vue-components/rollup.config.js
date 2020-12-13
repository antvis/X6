import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'

const extensions = ['.js', '.jsx', '.ts', '.vue'];


export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    name: 'common',
    format: 'esm'
  },
  external: ['vue'],
  plugins: [
    resolve({
      extensions,
    }),
    commonjs(),
    vue({
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
    }),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ["last 2 versions"]
          }
        }],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-decorators', {
          'legacy': true
        }],
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-proposal-object-rest-spread', {
          useBuiltIns: true,
        }],
        ['@babel/plugin-transform-runtime', {
          corejs: 3,
          helpers: false,
          regenerator: true,
          useESModules: false,
        }],
      ],
    }),
    css({
      output: './dist/bundle.css'
    })
  ]
}
