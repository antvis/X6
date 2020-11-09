import * as fse from 'fs-extra'
import execa from 'execa'
import tempy from 'tempy'
import getDebugger from 'debug'
import detectIndent from 'detect-indent'
import detectNewline from 'detect-newline'
import SemanticRelease from 'semantic-release'
import { Commits } from './commits'
import { Manifest } from './manifest'
import { Synchronizer } from './synchronizer'
import { Package, Context, PluginOptions, Options } from './types'

const npmrc = tempy.file({ name: '.npmrc' })

export namespace Plugin {
  const debug = getDebugger('msr:inline-plugin')

  function updateManifestDeps(pkg: Package, path: string) {
    // Get and parse manifest file contents.
    const manifest = Manifest.get(path)
    const content = manifest.__contents__ as string
    const indent = detectIndent(content).indent
    const trailingWhitespace = detectNewline(content) || ''

    const updateDependency = (scope: string, name: string, version: string) => {
      if (manifest[scope] && manifest[scope][name]) {
        manifest[scope][name] = `^${version}`
      }
    }

    pkg.localDeps &&
      pkg.localDeps.forEach(p => {
        // Get version of dependency.
        const release = p.nextRelease || p.lastRelease
        // Cannot establish version.
        if (!release || !release.version) {
          throw Error(
            `Cannot release because dependency ${p.name} has not been released`,
          )
        }

        // Update version of dependency in manifest.
        updateDependency('dependencies', p.name, release.version)
        updateDependency('devDependencies', p.name, release.version)
        updateDependency('peerDependencies', p.name, release.version)
        updateDependency('optionalDependencies', p.name, release.version)
      })

    // Write package.json back out.
    fse.writeFileSync(
      path,
      JSON.stringify(manifest, null, indent) + trailingWhitespace,
    )
  }

  function hasChangedDeep(packages: Package[], ignore: Package[] = []) {
    return packages
      .filter(p => ignore.indexOf(p) === -1)
      .some(p => {
        // 1. Any local dep package itself has changed
        if (p.nextType) {
          return true
        }

        // 2. Any local dep package has local deps that have changed.
        if (hasChangedDeep(p.localDeps, [...ignore, ...packages])) {
          return true
        }

        // Nope.
        return false
      })
  }

  function getOrgName(name: string) {
    if (name[0] !== '@') {
      return null
    }
    const index = name.indexOf('/')
    return index > 1 ? name.substr(1, index - 1) : null
  }

  export function get(
    packages: Package[],
    multiContext: Context,
    synchronizer: ReturnType<typeof Synchronizer.create>,
    flags: Options,
  ) {
    const { cwd } = multiContext
    const { emit, todo, waitFor, waitForAll, getLucky } = synchronizer
    const releaseMap: { [key: string]: SemanticRelease.Release[] } = {}
    let successExeCount = 0

    return function create(pkg: Package) {
      const { deps, plugins, plugins2, dir, path, name } = pkg
      let scopedCommits: Commits.Commit[]

      const verifyConditions = async (
        pluginOptions: PluginOptions,
        context: SemanticRelease.Context,
      ) => {
        // Restore context for plugins that does not rely on parsed opts.
        Object.assign(context.options, (context.options as any)._pkgOptions)

        // And bind actual logger.
        Object.assign(pkg.logger, context.logger)

        pkg.ready = true
        emit(
          'readyForRelease',
          todo().find(p => !p.ready),
        )

        const res = await plugins.verifyConditions(context)
        debug('verified conditions: %s', pkg.name)
        return res
      }

      const analyzeCommits = async (
        pluginOptions: PluginOptions,
        context: SemanticRelease.Context,
      ) => {
        const firstParentBranch: string | undefined = flags.firstParent
          ? (context as any).branch.name
          : undefined

        // Filter commits by directory.
        scopedCommits = await Commits.filter(
          cwd,
          dir,
          context.lastRelease ? context.lastRelease.gitHead : undefined,
          firstParentBranch,
        )

        const ctx = context as any

        // Set context.commits so analyzeCommits does correct analysis.
        ctx.commits = scopedCommits

        // Set lastRelease for package from context.
        pkg.lastRelease = context.lastRelease

        // Make a list of local dependencies.
        pkg.localDeps = deps
          .map(d => packages.find(p => d === p.name))
          .filter(p => p != null) as Package[]

        // Set nextType for package from plugins.
        pkg.nextType = await plugins.analyzeCommits(context)

        // Wait until all todo packages have been analyzed.
        pkg.analyzed = true
        await waitForAll('analyzed')

        // Make sure type is "patch" if the package has any deps that have changed.
        if (pkg.nextType == null && hasChangedDeep(pkg.localDeps)) {
          pkg.nextType = 'patch'
        }

        debug(
          `"${pkg.name}" commits analyzed, and the release type is "${pkg.nextType}"`,
        )

        return pkg.nextType
      }

      const generateNotes = async (
        pluginOptions: PluginOptions,
        context: SemanticRelease.Context,
      ) => {
        // Set nextRelease for package.
        pkg.nextRelease = context.nextRelease

        // Wait until all packages are ready to generate notes.
        await waitForAll('nextRelease', p => p.nextType != null)

        // Wait until the current pkg is ready to generate notes
        getLucky('readyToGenerateNotes', pkg)
        await waitFor('readyToGenerateNotes', pkg)

        // Update pkg deps.
        updateManifestDeps(pkg, path)
        pkg.depsUpdated = true

        const notes: string[] = []

        // Set context.commits so analyzeCommits does correct analysis. We
        // need to redo this because context is a different instance each time.
        const ctx = context as any
        ctx.commits = scopedCommits

        // Get subnotes and add to list.
        // Inject pkg name into title if it matches e.g. `# 1.0.0` or `## [1.0.1]` (as generate-release-notes does).
        const subs = await plugins.generateNotes(context)
        // istanbul ignore else (unnecessary to test)
        if (subs) {
          notes.push(
            subs.replace(/^(#+) (\[?\d+\.\d+\.\d+\]?)/, `$1 ${name} $2`),
          )
        }

        // If it has upgrades add an upgrades section.
        const upgrades = pkg.localDeps!.filter(p => p.nextRelease != null)
        if (upgrades.length) {
          notes.push(`### Dependencies`)
          const bullets = upgrades.map(
            p => `* **${p.name}:** upgraded to ${p.nextRelease!.version}`,
          )
          notes.push(bullets.join('\n'))
        }

        debug('notes generated: %s', pkg.name)

        // Return the notes.
        return notes.join('\n\n')
      }

      const publishGPR = async (context: SemanticRelease.Context) => {
        const org = getOrgName(pkg.name)

        if (!pkg.private && org) {
          const token = context.env.GITHUB_TOKEN
          const registry = `https://npm.pkg.github.com/${org}`
          await fse.writeFile(
            npmrc,
            `//npm.pkg.github.com/:_authToken=${token}\nregistry=${registry}`,
          )

          const pub = execa(
            'npm',
            ['publish', pkg.dir, '--userconfig', npmrc, '--registry', registry],
            {
              cwd: pkg.dir,
              env: context.env,
            },
          ) as any

          const ctx = context as any
          pub.stdout.pipe(ctx.stdout, { end: false })
          pub.stderr.pipe(ctx.stderr, { end: false })
          return await pub
        }
      }

      const publish = async (
        pluginOptions: PluginOptions,
        context: SemanticRelease.Context,
      ) => {
        pkg.prepared = true
        emit(
          'readyToGenerateNotes',
          todo().find(p => p.nextType != null && !p.prepared),
        )

        await waitForAll('prepared', p => p.nextType != null)

        const ret = await plugins.publish(context)
        const releases: SemanticRelease.Release[] = Array.isArray(ret)
          ? ret
          : ret != null
          ? [ret]
          : []

        const gpr = await publishGPR(context)
        if (gpr && !gpr.failed) {
          const release = {
            ...context.nextRelease,
            name: 'GitHub package',
            url: `${context.options!.repositoryUrl}/packages/`,
            pluginName: 'monorepo-semantic-release',
          }
          releases.push(release as SemanticRelease.Release)
        }

        debug('published: %s', pkg.name)

        releaseMap[pkg.name] = releases
          .filter(r => r.name != null)
          .map(r => ({
            ...r,
            package: pkg.name,
            private: pkg.private,
          }))

        return releases[0]
      }

      const success = async (
        pluginOptions: PluginOptions,
        context: SemanticRelease.Context,
      ) => {
        pkg.published = true
        await waitForAll('published', p => p.nextType != null)

        const totalCount = todo().filter(p => p.nextType != null).length
        const ctx = context as any

        if (successExeCount < totalCount) {
          successExeCount += 1
        }

        let ret
        if (successExeCount === totalCount) {
          ctx.releases = Object.keys(releaseMap).reduce<
            SemanticRelease.Release[]
          >((memo, key) => {
            return [...memo, ...releaseMap[key]]
          }, [])
          ret = await plugins.success(ctx)
        } else {
          ctx.releases = releaseMap[pkg.name]
          ret = await plugins2.success(ctx)
        }

        console.log(pkg.name, successExeCount, ctx.releases)

        debug('succeed: %s', pkg.name)

        return ret
      }

      const plugin: { [key: string]: any } = {
        verifyConditions,
        analyzeCommits,
        generateNotes,
        publish,
        success,
      }

      Object.keys(plugin).forEach(type =>
        Reflect.defineProperty(plugin[type], 'pluginName', {
          value: 'monorepo-semantic-release',
          writable: false,
          enumerable: true,
        }),
      )

      debug('plugin created: %s', pkg.name)

      return plugin
    }
  }
}
