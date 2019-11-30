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

fs.writeFile('src/version.ts', code, (err) => {
  if (err) {
    throw new Error(`Could not save version file ${version}: ${err}`)
  }
  console.log(`Version file for version ${version} saved.`)
})
