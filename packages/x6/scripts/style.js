#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const { exec } = require('child_process')

function compile(source, target) {
  exec(`./node_modules/.bin/lessc ${source} ${target}`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const cwd = process.cwd()
const es = path.join(cwd, 'es')
const lib = path.join(cwd, 'lib')
const src = path.join(cwd, 'src')
const dist = path.join(cwd, 'dist')

compile(path.join(src, 'index.less'), path.join(es, 'index.css'))
compile(path.join(src, 'index.less'), path.join(lib, 'index.css'))
compile(path.join(src, 'index.less'), path.join(dist, 'index.css'))

function toCSSPath(source) {
  const dir = path.dirname(source)
  const file = path.basename(source, '.less') + '.css'
  return path.join(dir, file)
}

// Copy less files
function readdir(dir) {
  const stat = fs.statSync(dir)
  if (stat) {
    if (stat.isDirectory()) {
      fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
          readdir(path.join(dir, file))
        })
      })
    } else {
      const ext = path.extname(dir)
      if (ext === '.less' || ext === '.css') {
        fse.copySync(dir, path.join(es, path.relative(src, dir)))
        fse.copySync(dir, path.join(lib, path.relative(src, dir)))
      }

      if (ext === '.less') {
        let source = path.join(es, path.relative(src, dir))
        let target = toCSSPath(source)
        compile(source, target)

        source = path.join(lib, path.relative(src, dir))
        target = toCSSPath(source)
        compile(source, target)
      }
    }
  }
}

// console.log('Copy style files to output directory\n')
readdir(src)
