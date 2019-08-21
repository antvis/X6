
export const toString = (str: any) => `${str}`

export function ucFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

export function lcFirst(str: string) {
  return str.charAt(0).toLowerCase() + str.substring(1)
}

export function split(str: string, divider: string | RegExp = /\s+/) {
  return str.split(divider)
}

export function startWith(str: string, prefix: string) {
  return str.indexOf(prefix) === 0
}

export function endWith(str: string, suffix: string) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}

export function uuid(): string {
  // credit: http://stackoverflow.com/posts/2117523/revisions
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Return a simple hash code from a string.
 * See http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/.
 */
export function hashcode(str: string): number {
  let hash = 0
  const length = str.length

  if (length === 0) {
    return hash
  }

  for (let i = 0; i < length; i += 1) {
    const c = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash &= hash // Convert to 32bit integer
  }

  return hash
}

/**
 * Replace all spaces with the Unicode No-break space.
 * ref: http://www.fileformat.info/info/unicode/char/a0/index.htm
 *
 * IE would otherwise collapse all spaces into one. This is useful
 * e.g. in tests when you want to compare the actual DOM text content
 * without having to add the unicode character in the place of all spaces.
 */
export function sanitizeText(text: string) {
  return text.replace(/ /g, '\u00A0')
}
