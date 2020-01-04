#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')
const base64Img = require('base64-img')

const prefix = `/* tslint:disable */

/**
* Auto generated, do not modify it!
*/

import { Image } from '../struct'

`
const lines = []
const logs = []
const dir = path.join(process.cwd(), './src/assets/images')

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    const filename = path.basename(file, path.extname(file))
    const filepath = path.join(dir, file)
    const size = sizeOf(filepath)
    const base64 = base64Img.base64Sync(filepath)
    logs.push(file)
    const line = `export const ${filename} = new Image('${base64}', ${size.width}, ${size.height})`
    lines.push(line)
  })

  const code = prefix + lines.join('\n')
  const file = 'src/assets/images.ts'
  const old = fs.readFileSync(file, { encoding: 'utf8' })
  const format = s => s.replace(/[\n\s]/g, '')

  if (format(code) !== format(old)) {
    console.log(logs.join('\n'))
    fs.writeFile(file, code, error => {
      if (error) {
        throw new Error(`Generate image assets filed: ${error}`)
      }

      console.log(`\nGenerate image assets.`)
    })
  } else {
    console.log('\nImage assets not changed, ignore.')
  }
})
