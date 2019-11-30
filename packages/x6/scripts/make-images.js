#!/usr/bin/env node

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
const dir = path.join(process.cwd(), './src/assets/images')

fs.readdir(dir, (err, files) => {
  files.forEach((file) => {
    const filename = path.basename(file, path.extname(file))
    const filepath = path.join(dir, file)
    const size = sizeOf(filepath)
    const base64 = base64Img.base64Sync(filepath)
    console.log(file)
    lines.push(
      `export const ${filename} = new Image('${base64}', ${size.width}, ${size.height})`
    )
  })

  const code = prefix + lines.join('\n')

  fs.writeFile('src/assets/images.ts', code, (err) => {
    if (err) {
      throw new Error(`Generate image assets filed: ${err}`)
    }

    console.log(`\nGenerate image assets.`)
  })
})
