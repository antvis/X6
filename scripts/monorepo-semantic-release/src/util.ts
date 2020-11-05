import { normalize, isAbsolute, join } from 'path'
import { check } from './blork'

export namespace Util {
  /**
   * Normalize and make a path absolute, optionally using a custom CWD.
   * Trims any trailing slashes from the path.
   */
  export function cleanPath(path: string, cwd = process.cwd()) {
    check(path, 'path: path')
    check(cwd, 'cwd: absolute')

    const abs = isAbsolute(path) ? path : join(cwd, path)
    return normalize(abs).replace(/[/\\]+$/, '')
  }
}
