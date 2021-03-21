/* eslint-disable no-bitwise */

/**
 * Return a simple hash code from a string.
 * Source from: https://github.com/sindresorhus/fnv1a/blob/master/index.js#L25
 */
export function hashcode(str: string): number {
  let hash = 2166136261
  let isUnicoded = false
  let string = str

  for (let i = 0, ii = string.length; i < ii; i += 1) {
    let characterCode = string.charCodeAt(i)

    // Non-ASCII characters trigger the Unicode escape logic
    if (characterCode > 0x7f && !isUnicoded) {
      string = unescape(encodeURIComponent(string))
      characterCode = string.charCodeAt(i)
      isUnicoded = true
    }

    hash ^= characterCode
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }

  return hash >>> 0
}
