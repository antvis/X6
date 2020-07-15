#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const root = path.resolve(__dirname, '../')
const repo = fs.realpathSync(process.cwd())
const dir = path.relative(`${root}/packages/`, repo)
const staticDir = path.join(root, '../../packages/x6-sites/static/demos')

const sourceDir = path.join(repo, 'build')
const targetDir = path.join(staticDir, dir)

fse.emptyDirSync(targetDir)
fse.moveSync(sourceDir, targetDir, { overwrite: true })

const indexFile = path.join(targetDir, 'index.html')
const content = fs.readFileSync(indexFile, { encoding: 'utf8' })
const html = content.replace(
  /<title>(.*)<\/title>/,
  `<title>${targetDir}</title>`,
)

fs.writeFileSync(indexFile, html, { encoding: 'utf8' })

console.log(`Deploy to "x6-sites/static/demos/${dir}".\n`)
