#!/usr/bin/env node

// copy csstype

const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const src = path.join(cwd, '../../node_modules/csstype/index.d.ts')
const dist = path.join(cwd, 'src/types/csstype.ts')

const content = fs.readFileSync(src, { encoding: 'utf8' })
const prev = fs.readFileSync(dist, { encoding: 'utf8' })
const next = `/* tslint:disable */

/**
* Auto generated file by copying from node_modules, do not modify it!
* Fix karma error "Can't find csstype [undefined] (required by ..."
*/

${content}
`

if (prev !== next) {
  fs.writeFileSync(dist, next, { encoding: 'utf8' })
}
