#!/usr/bin/env node

import _ from 'lodash'
import fs from 'fs'
import os from 'os'
import path from 'path'
import colors from 'colors/safe.js'
import spawn from 'cross-spawn'
import { closest } from 'fastest-levenshtein'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const scripts = require('../lib/scripts.json')

const isWin32 = process.platform === 'win32'
const event = process.env.npm_lifecycle_event
const script = scripts[event]

if (script) {
  const tmpdir = os.tmpdir()
  const dir = path.join(tmpdir, 'scripty')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  const name = event.toLowerCase().replace(/[^0-9a-z]/g, '-')
  const ext = isWin32 ? '.cmd' : ''
  const file = path.join(dir, name, ext)
  const define = isWin32 ? '@ECHO OFF' : '#!/usr/bin/env sh'
  const args = process.argv.slice(2)
  const main = args.length ? `${script} ${args.join(' ')}` : script

  fs.writeFileSync(file, `${define}\n\n${main}`)
  fs.chmodSync(file, 0o777)

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
  spawn(file, { stdio: 'inherit' })
} else {
  console.error(`unknown script: [${event}]`)
}
