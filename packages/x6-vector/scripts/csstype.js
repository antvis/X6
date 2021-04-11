#!/usr/bin/env node

// copy csstype

const fse = require('fs-extra')
const path = require('path')

const cwd = process.cwd()
const src = path.join(cwd, '../../node_modules/csstype/index.d.ts')
const dist = path.join(cwd, 'src/dom/style/csstype.ts')

const raw = fse.readFileSync(src, { encoding: 'utf8' })
const prev = fse.existsSync(dist)
  ? fse.readFileSync(dist, { encoding: 'utf8' })
  : null

const next = `/* eslint-disable */

/**
* Auto generated file by copying from node_modules, do not modify it!
*/

${raw}
`

if (prev !== next) {
  fse.outputFileSync(dist, next, { encoding: 'utf8' })
}
