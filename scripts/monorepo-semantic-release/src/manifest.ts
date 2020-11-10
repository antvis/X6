import { existsSync, lstatSync, readFileSync } from 'fs'

export namespace Manifest {
  /**
   * Read the content of target package.json if exists.
   */
  function read(path: string) {
    if (!existsSync(path)) {
      throw new ReferenceError(`package.json file not found: "${path}"`)
    }

    let stat
    try {
      stat = lstatSync(path)
    } catch (_) {
      throw new ReferenceError(`package.json cannot be read: "${path}"`)
    }

    if (!stat.isFile()) {
      throw new ReferenceError(`package.json is not a file: "${path}"`)
    }

    try {
      return readFileSync(path, 'utf8')
    } catch (_) {
      throw new ReferenceError(`package.json cannot be read: "${path}"`)
    }
  }

  /**
   * Get the parsed contents of a package.json manifest file.
   */
  export function get(path: string) {
    const contents = read(path)
    let manifest: { [key: string]: any }
    try {
      manifest = JSON.parse(contents)
    } catch (_) {
      throw new SyntaxError(`package.json could not be parsed: "${path}"`)
    }

    if (typeof manifest !== 'object') {
      throw new SyntaxError(`package.json was not an object: "${path}"`)
    }

    if (typeof manifest.name !== 'string' || !manifest.name.length) {
      throw new SyntaxError(`Package name must be non-empty string: "${path}"`)
    }

    const checkDeps = (scope: string) => {
      if (
        manifest.hasOwnProperty(scope) &&
        typeof manifest[scope] !== 'object'
      ) {
        throw new SyntaxError(`Package ${scope} must be object: "${path}"`)
      }
    }

    checkDeps('dependencies')
    checkDeps('devDependencies')
    checkDeps('peerDependencies')
    checkDeps('optionalDependencies')

    // NOTE non-enumerable prop is skipped by JSON.stringify
    Object.defineProperty(manifest, '__contents__', {
      enumerable: false,
      value: contents,
    })

    return manifest
  }
}
