import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import colors from 'colors/safe.js'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'

function formatName(name) {
  const realName = name
    .replace(/^@/, '')
    .replace(/^antv\//, '')
    .replace(/\//, '-')

  // PascalCase
  return _.startCase(_.camelCase(realName)).replace(/ /g, '')
}

function makeOutput() {
  const cwd = process.cwd()
  const pkg = JSON.parse(
    fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'),
  )
  const peerDependencies = pkg.peerDependencies
  const output = { name: formatName(pkg.name) }
  if (peerDependencies) {
    const globals = {}
    Object.keys(peerDependencies).forEach((mod) => {
      globals[mod] = formatName(mod)
    })
    output.globals = globals
  }

  return output
}

export function config(config = {}) {
  let { plugins = [], output, external = [], ...others } = config
  if (output == null) {
    output = makeOutput()
  }

  const arr = Array.isArray(output) ? output : [output]
  const outputs = []
  arr.forEach((item) => {
    outputs.push({
      format: 'umd',
      file: 'dist/index.js',
      sourcemap: true,
      ...item,
    })

    // extra external modules
    if (item.globals) {
      Object.keys(item.globals).forEach((key) => {
        if (!external.includes(key)) {
          external.push(key)
        }
      })
    }
  })

  return {
    input: './src/index.ts',
    output: outputs,
    plugins: [
      typescript({ declaration: false }),
      resolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({ sourceMap: true }),
      filesize({
        reporter: [
          async (options, bundle, result) => {
            return import('boxen').then((mod) => {
              const boxen = mod.default
              const primaryColor = options.theme === 'dark' ? 'green' : 'black'
              const secondaryColor =
                options.theme === 'dark' ? 'yellow' : 'blue'

              const title = colors[primaryColor].bold
              const value = colors[secondaryColor]

              const lines = [
                `${title('Bundle Format:')} ${value(bundle.format)}`,
                `${title('Bundle Name:')} ${value(bundle.name)}`,
              ]
              const globals = bundle.globals
              const mods = Object.keys(globals)
              if (mods.length) {
                lines.push(title('External Globals:'))
                mods.forEach((mod) => {
                  lines.push(value(`  ${mod}: ${globals[mod]}`))
                })
                lines.push('')
              }

              lines.push(
                [
                  `${title('Destination:')} ${value(bundle.file)}`,
                  `${title('Bundle   Size:')} ${value(result.bundleSize)}`,
                  `${title('Minified Size:')} ${value(result.minSize)}`,
                  `${title('Gzipped  Size:')} ${value(result.gzipSize)}`,
                ].join('\n'),
              )

              return boxen(lines.join('\n'), {
                padding: 1,
                dimBorder: true,
                borderStyle: 'classic',
              })
            })
          },
        ],
      }),
      ...plugins,
    ],
    external,
    ...others,
  }
}

const defaultConfig = config()

export default defaultConfig
