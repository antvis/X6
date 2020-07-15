#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const root = path.resolve(__dirname, '../packages')

// const repo = fs.realpathSync(process.cwd())
// const dir = path.relative(`${root}/packages/`, repo)
// const staticDir = path.join(root, '../../packages/x6-sites/static/demos')

// const sourceDir = path.join(repo, 'build')
// const targetDir = path.join(staticDir, dir)

function rename(pkg) {
  const full = path.relative(root, pkg)
  const name = full.split('/').slice(0, -1).join('.')
  const content = fse.readJsonSync(pkg)
  if (content) {
    content.name = name
  }
  fse.writeJsonSync(pkg, content, { spaces: 2 })
}

function read(dir) {
  const pkg = path.join(dir, 'package.json')
  if (fs.existsSync(pkg)) {
    rename(pkg)
  } else {
    fs.readdir(dir, (err, files) => {
      if (files) {
        files.forEach((filename) => {
          var sub = path.join(dir, filename)
          fs.stat(sub, (error, stats) => {
            if (stats && stats.isDirectory()) {
              read(sub)
            }
          })
        })
      }
    })
  }
}

read(root)
