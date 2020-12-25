#!/usr/bin/env node

const path = require('path')
const fse = require('fs-extra')

const cwd = process.cwd()
const parts = cwd.split('/')
const index = parts.indexOf('packages')
if (index > 0) {
  // rename
  const name = parts.slice(index + 1).join('.')
  const pkgpath = path.join(cwd, 'package.json')
  const pkg = fse.readJsonSync(pkgpath)
  if (pkg) {
    pkg.name = `@antv/x6-sites-demos-${name}`
  }
  fse.writeJsonSync(pkgpath, pkg, { spaces: 2 })

  // add dependencies to root package.json
  const root = parts.slice(0, index).join('/')
  const wspath = path.join(root, 'package.json')
  const workspace = fse.readJsonSync(wspath)
  const dependencies = workspace.dependencies || {}
  let updated = false

  function updateWorkspace(deps) {
    if (deps != null) {
      Object.keys(deps).forEach((name) => {
        if (!dependencies[name]) {
          dependencies[name] = deps[name]
          updated = true
        }
      })
    }
  }

  updateWorkspace(pkg.dependencies)
  updateWorkspace(pkg.devDependencies)
  updateWorkspace(pkg.peerDependencies)
  updateWorkspace(pkg.optionalDependencies)

  if (updated) {
    workspace.dependencies = {}
    Object.keys(dependencies)
      .sort()
      .forEach((name) => (workspace.dependencies[name] = dependencies[name]))
    fse.writeJsonSync(wspath, workspace, { spaces: 2 })
  }
}
