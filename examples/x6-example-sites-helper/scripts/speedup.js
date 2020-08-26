#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const repo = fs.realpathSync(process.cwd())
const parts = repo.split('/')
const index = parts.indexOf('packages')
const root = index >= 0 ? parts.slice(0, index).join('/') : repo
const home = path.resolve(root, '../../')

const configDir = 'node_modules/react-scripts/config'
const configFile = path.join(home, configDir, 'webpack.config.js')
let content = fs.readFileSync(configFile, { encoding: 'utf8' })
if (content.indexOf('minimize: isEnvProduction') !== -1) {
  content = content
    .replace('minimize: isEnvProduction', 'minimize: false')
    .replace('new ManifestPlugin({', 'false && new ManifestPlugin({')
    .replace(
      'new WorkboxWebpackPlugin.GenerateSW({',
      'false && new WorkboxWebpackPlugin.GenerateSW({',
    )

  fs.writeFileSync(configFile, content, { encoding: 'utf8' })
}
