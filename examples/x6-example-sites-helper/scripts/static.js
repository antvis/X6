#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const repo = fs.realpathSync(process.cwd())
const parts = repo.split('/')
const index = parts.indexOf('packages')
const dir = parts.slice(index + 1).join('/')
const root = parts.slice(0, index).join('/')
const staticDir = path.join(root, '../../packages/x6-sites/static/demos')
const sourceDir = path.join(repo, 'build')
const targetDir = path.join(staticDir, dir)

fse.emptyDirSync(targetDir)
fse.moveSync(sourceDir, targetDir, { overwrite: true })

const indexFile = path.join(targetDir, 'index.html')
const content = fs.readFileSync(indexFile, { encoding: 'utf8' })
const html = content.replace(/<title>(.*)<\/title>/, `<title>${dir}</title>`)
fs.writeFileSync(indexFile, html, { encoding: 'utf8' })

console.log(`Deploy to "x6-sites/static/demos/${dir}".\n`)
