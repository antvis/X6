import bashGlob from 'bash-glob'
import bashPath from 'bash-path'
import { checker } from './blork'
import { Manifest } from './manifest'

export namespace Workspace {
  function glob(patterns: string | string[], options?: bashGlob.Options) {
    if (!bashPath) {
      throw new TypeError('`bash` must be installed')
    }

    return bashGlob.sync(patterns, options)
  }

  export function get(cwd: string) {
    const manifest = Manifest.get(`${cwd}/package.json`)
    let packages = manifest.workspaces
    if (packages && packages.packages) {
      packages = packages.packages
    }

    // Only continue if manifest.workspaces or manifest.workspaces.packages is an array of strings.
    if (!checker('string[]+')(packages)) {
      throw new TypeError(
        'package.json: workspaces or workspaces.packages: Must be non-empty array of string',
      )
    }

    // Turn workspaces into list of package.json files.
    const workspaces = glob(
      packages.map((p: string) => p.replace(/\/?$/, '/package.json')),
      {
        cwd,
      },
    )

    // Must have at least one workspace.
    if (!workspaces.length) {
      throw new TypeError(
        'package.json: workspaces: Must contain one or more workspaces',
      )
    }

    return workspaces
  }
}
