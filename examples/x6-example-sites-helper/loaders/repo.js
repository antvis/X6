const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

module.exports = () => {
  if (this.cacheable) {
    this.cacheable()
  }

  const repo = fs.realpathSync(process.cwd())
  const parts = repo.split('/')
  const index = parts.indexOf('x6')
  const dirname = parts.slice(index + 1).join('/')
  const host = `https://github.com/antvis/X6/tree/master/${dirname}`

  const pkg = fse.readJsonSync(path.join(repo, 'package.json'))

  const excluedDeps = ['codesandbox', '@antv/x6-example-sites-helper']
  const excludeDirs = ['node_modules']
  const excludeFiles = [
    '.env',
    'package.json',
    'yarn-error.log',
    'src/react-app-env.d.ts',
    'src/data.ts',
    'src/toolbar.css',
    'src/toolbar.tsx',
  ]

  const result = { files: {} }

  function updatePackageJson() {
    delete pkg.name
    delete pkg.version
    delete pkg.private

    excluedDeps.forEach((dep) => {
      delete pkg.dependencies[dep]
      delete pkg.devDependencies[dep]
    })

    pkg.scripts = {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
    }

    result.files['package.json'] = {
      isBinary: false,
      content: JSON.stringify(pkg),
    }
  }

  function getEntry() {
    return `import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`
  }

  function readFiles(dir, parent) {
    const files = fs.readdirSync(dir)
    if (files) {
      files.forEach((filename) => {
        const filepath = path.join(dir, filename)
        const child = path.join(parent || '', filename)

        const stats = fs.statSync(filepath)
        if (stats) {
          if (stats.isDirectory() && !excludeDirs.includes(child)) {
            readFiles(filepath, child)
          } else if (stats.isFile() && !excludeFiles.includes(child)) {
            const key = path.relative(repo, filepath)
            let content = fs.readFileSync(filepath, { encoding: 'utf8' })
            if (child === 'src/index.tsx') {
              content = getEntry()
            }

            result.files[key] = { content, isBinary: false }
          }
        }
      })
    }
  }

  // stackblitz
  // ----------

  function getStackblitzPrefillConfig() {
    const idx = parts.indexOf('packages')
    const title = parts.slice(idx + 1).join('/')
    const config = {
      title: title || '',
      description: '',
      template: 'create-react-app',
      dependencies: pkg.dependencies,
      files: {},
    }

    Object.keys(result.files).forEach((name) => {
      const item = result.files[name]
      config.files[name] = item.content
    })

    return config
  }

  // return
  // ------

  updatePackageJson()
  readFiles(repo)

  return `
    export const host = '${host}'

    export function getCodeSandboxParams () {
      return ${JSON.stringify(result)}
    }

    export function getStackblitzPrefillConfig () {
      return ${JSON.stringify(getStackblitzPrefillConfig())}
    }
  `
}
