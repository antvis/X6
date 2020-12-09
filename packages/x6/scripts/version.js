#!/usr/bin/env node

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
      throw new Error(
        `An error occurred while saving version file ${version}: ${err}`,
      )
    }
    console.log(`Current Version ${version}, version file generated.`)
  })
} else {
  console.log(`Current Version ${version}, not updated.`)
}
