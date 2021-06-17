import { dirname } from 'path'
import { Signale } from 'signale'
import { WritableStreamBuffer } from 'stream-buffers'
import SemanticRelease from 'semantic-release'
import semanticGetConfig from 'semantic-release/lib/get-config'
import cloneDeep from 'lodash.clonedeep'
import { Util } from './util'
import { check } from './blork'
import { Logger } from './logger'
import { Manifest } from './manifest'
import { RescopedStream } from './stream'
import { Synchronizer } from './synchronizer'
import { Context, Options, Package } from './types'
import { Plugin } from './plugin'
import { Config } from './config'

export namespace Release {
  export async function start(
    paths: string[],
    inputOptions: SemanticRelease.Options = {},
    {
      cwd = process.cwd(),
      env = process.env as { [name: string]: string },
      stdout = process.stdout,
      stderr = process.stderr,
    } = {},
    flags: Options = {},
  ) {
    check(paths, 'paths: string[]')
    check(cwd, 'cwd: directory')
    check(env, 'env: objectlike')
    check(stdout, 'stdout: stream')
    check(stderr, 'stderr: stream')

    cwd = Util.fixPath(cwd) // eslint-disable-line

    const logger = Logger.get({ stdout, stderr })

    logger.complete(`Loading ${paths.length} packages...`)

    const globalOptions = Config.defaults
    const options = { ...globalOptions, ...inputOptions }
    const context: Context = { options, cwd, env, stdout, stderr }

    // Load packages
    const packages = await Promise.all(
      paths.map((path) => loadPackage(path, context)),
    )

    packages.forEach((p) => logger.success(`Package loaded ${p.name}`))
    logger.complete(`Queued ${packages.length} packages! Starting release...`)

    // Shared signal bus.
    const synchronizer = Synchronizer.create(packages)
    const createPlugin = Plugin.get(packages, context, synchronizer, flags)
    await Promise.all(
      packages.map(async (pkg) => releasePackage(pkg, createPlugin, context)),
    )

    const released = packages.filter((pkg) => pkg.result)
    logger.complete(
      `Released ${released.length} of ${packages.length} packages, semantically!`,
    )

    return packages
  }

  async function loadPackage(
    path: string,
    { options: globalOptions, env, cwd, stdout, stderr }: Context,
  ): Promise<Package> {
    path = Util.fixPath(path, cwd) // eslint-disable-line
    const dir = dirname(path)
    const manifest = Manifest.get(path)
    const name = manifest.name
    const deps = Object.keys({
      ...manifest.dependencies,
      ...manifest.devDependencies,
      ...manifest.peerDependencies,
      ...manifest.optionalDependencies,
    })

    const pkgOptions = await Config.get(dir)
    const finalOptions = { ...globalOptions, ...pkgOptions }
    const logger = { error() {}, log() {} }

    const options1 = cloneDeep(finalOptions)
    const options2 = cloneDeep(finalOptions)
    const githubPlugin = '@semantic-release/github'

    if (options1.plugins) {
      options1.plugins = options1.plugins.map((plugin) => {
        if (Array.isArray(plugin)) {
          const pluginName = plugin[0]
          const pluginOptions = plugin[1]
          if (pluginName === githubPlugin) {
            return [pluginName, { ...pluginOptions, successComment: false }]
          }
        }

        if (plugin === githubPlugin) {
          return [plugin, { successComment: false }]
        }

        return plugin
      })
    }

    if (options2.plugins) {
      options2.plugins = options2.plugins.map((plugin) => {
        if (Array.isArray(plugin)) {
          const pluginName = plugin[0]
          const pluginOptions = plugin[1]
          if (pluginName === githubPlugin) {
            return [pluginName, { ...pluginOptions, addReleases: false }]
          }
        }

        if (plugin === githubPlugin) {
          return [plugin, { addReleases: false }]
        }

        return plugin
      })
    }

    const context = { env, stdout, stderr, logger: logger as any, cwd: dir }

    // Use semantic-release's internal config with the final options (now we
    // have the right `options.plugins` setting) to get the plugins object and
    // the options including defaults.
    // We need this so we can call e.g. plugins.analyzeCommit() to be able to
    // affect the input and output of the whole set of plugins.
    const config1 = await getConfig(context, options1)
    const config2 = await getConfig(context, options2)

    return {
      dir,
      path,
      name,
      deps,
      logger,
      manifest,
      private: manifest.private === true,
      options: config1.options,
      plugins1: config1.plugins,
      plugins2: config2.plugins,
      localDeps: [],
    }
  }

  async function getConfig(
    {
      cwd,
      env,
      stdout,
      stderr,
      logger,
    }: {
      cwd: string
      env: NodeJS.ProcessEnv
      stdout: NodeJS.WriteStream
      stderr: NodeJS.WriteStream
      logger: Signale
    },
    options: SemanticRelease.Options,
  ) {
    try {
      // Blackhole logger (so we don't clutter output with "loaded plugin" messages).
      const blackhole = new Signale({
        stream: new WritableStreamBuffer() as any as NodeJS.WriteStream,
      })

      // Return semantic-release's getConfig script.
      return await semanticGetConfig(
        { cwd, env, stdout, stderr, logger: blackhole },
        options,
      )
    } catch (error) {
      logger.error(`Error in semantic-release getConfig(): %0`, error)
      throw error
    }
  }

  async function releasePackage(
    pkg: Package,
    createPlugin: (pkg: Package) => { [key: string]: any },
    context: Context,
  ) {
    const { options: pkgOptions, name, dir } = pkg
    const { env, stdout, stderr } = context
    const inlinePlugin = createPlugin(pkg)
    const options = { ...pkgOptions, ...inlinePlugin }

    // Add the package name into tagFormat.
    // eslint-disable-next-line no-template-curly-in-string
    if (options.tagFormat == null || options.tagFormat === 'v${version}') {
      options.tagFormat = `${name}@\${version}`
    }

    // eslint-disable-next-line no-underscore-dangle
    options._pkgOptions = pkgOptions

    pkg.result = await SemanticRelease(options, {
      env,
      cwd: dir,
      stdout: RescopedStream.get(stdout, name),
      stderr: RescopedStream.get(stderr, name),
    })
  }
}
