import debug from 'debug'
import semrelPkg from 'semantic-release/package.json'
import { Logger } from './logger'
import { Options } from './types'
import { Release } from './release'
import { Workspace } from './workspace'

export function release(options: Options = {}) {
  if (options.debug) {
    debug.enable('msr:*')
  }

  const cwd = process.cwd()
  const stdout = process.stdout
  const stderr = process.stderr
  const logger = Logger.get({ stdout, stderr })

  try {
    logger.log(`semantic-release version: ${semrelPkg.version}`)
    logger.log(`options: ${JSON.stringify(options, null, 2)}`)

    const paths = Workspace.get(cwd)
    logger.log('packages: ', paths)

    Release.start(paths, {}, { cwd }, options).then(
      () => {
        process.exit(0)
      },
      (error) => {
        logger.error(error)
        process.exit(1)
      },
    )
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}
