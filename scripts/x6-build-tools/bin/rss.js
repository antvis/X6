#!/usr/bin/env node

import os from 'os'
import fse from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import colors from 'colors/safe.js'
import spawn from 'cross-spawn'
import { closest } from 'fastest-levenshtein'
import { findMonorepoRootSync } from 'find-monorepo-root/sync'

let script
const event = process.env.npm_lifecycle_event
if (event != null) {
  const { dir } = findMonorepoRootSync(process.cwd())
  const { rss } = fse.readJSONSync(path.join(dir, 'package.json'))
  script = rss[event]
}

if (script) {
  const tmpdir = os.tmpdir()
  const dir = path.join(tmpdir, 'rss')
  if (!fse.existsSync(dir)) {
    fse.mkdirSync(dir)
  }
  const hash = crypto.randomBytes(16).toString('hex')
  const name = event.toLowerCase().replace(/[^0-9a-z]/g, '-')
  const isWin32 = process.platform === 'win32'
  const ext = isWin32 ? '.cmd' : ''
  const file = path.join(dir, `${name}-${hash}`, ext)
  const define = isWin32 ? '@ECHO OFF' : '#!/usr/bin/env sh'
  const args = process.argv.slice(2)
  const main = args.length ? `${script} ${args.join(' ')}` : script

  fse.writeFileSync(file, `${define}\n\n${main}`)
  fse.chmodSync(file, 0o777)

  const eventColor = closest(event, [
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'red',
  ])
  const eventTitle = colors[eventColor](`[${event}]`)
  console.log(`> ${eventTitle} ${main}`)
  const child = spawn(file, { stdio: 'inherit' })

  child.on('exit', () => {
    fse.rmSync(file)
  })
} else {
  console.error(`unknown script: [${event}]`)
}
