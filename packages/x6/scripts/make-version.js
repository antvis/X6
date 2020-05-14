#!/usr/bin/env node

'use strict'

const fs = require('fs')
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version

const code = `/* tslint:disable */

/**
* Auto generated version file, do not modify it!
*/
const version = '${version}'
export { version }
`

const file = 'src/global/version.ts'
const old = fs.readFileSync(file, { encoding: 'utf8' })
const format = (s) => s.replace(/[\n\s]/g, '')

if (format(code) !== format(old)) {
  fs.writeFile(file, code, (err) => {
    if (err) {
      throw new Error(`Could not save version file ${version}: ${err}`)
    }
    console.log(`Version file for version ${version} saved.`)
  })
} else {
  console.log('Version not updated, ignore.')
}
