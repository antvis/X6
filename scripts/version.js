#!/usr/bin/env node

const fs = require('fs')

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version

const code = `/* eslint-disable */

/**
 * Auto generated version file, do not modify it!
 */
const version = '${version}'
export { version }
`

const dir = 'src/global'
const hasDir = fs.existsSync(dir)
const name = 'version.ts'
const file = hasDir ? `${dir}/${name}` : `src/${name}`
const old = fs.readFileSync(file, { encoding: 'utf8' })
const format = (s) => s.replace(/[\n\s]/g, '')

if (format(code) !== format(old)) {
  fs.writeFile(file, code, (err) => {
    if (err) {
      throw new Error(`An error occurred while saving version file: ${err}`)
    }
    console.log(`Current Version ${version}, version file generated.`)
  })
} else {
  console.log(`Current Version ${version}, not updated.`)
}
