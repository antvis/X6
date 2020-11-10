import debug from 'debug'
import semrelPkg from 'semantic-release/package.json'
import { Options } from './types'
import { Release } from './release'
import { Workspace } from './workspace'

export function release(options: Options = {}) {
  if (options.debug) {
    debug.enable('msr:*')
  }

  const cwd = process.cwd()
  try {
    console.log(`semantic-release version: ${semrelPkg.version}`)
    console.log(`flags: ${JSON.stringify(options, null, 2)}`)

    const paths = Workspace.get(cwd)
    console.log('packages: ', paths)

    Release.start(paths, {}, { cwd }, options).then(
      () => {
        process.exit(0)
      },
      (error) => {
        console.error(`[monorepo-semantic-release]:`, error)
        process.exit(1)
      },
    )
  } catch (error) {
    console.error(`[monorepo-semantic-release]:`, error)
    process.exit(1)
  }
}
