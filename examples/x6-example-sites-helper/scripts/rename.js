#!/usr/bin/env node

const path = require('path')
const fse = require('fs-extra')

const cwd = process.cwd()
const parts = cwd.split('/')
const index = parts.indexOf('packages')
if (index > 0) {
  const name = parts.slice(index + 1).join('.')
  const pkg = path.join(cwd, 'package.json')
  const content = fse.readJsonSync(pkg)
  if (content) {
    content.name = name
  }
  fse.writeJsonSync(pkg, content, { spaces: 2 })
}
