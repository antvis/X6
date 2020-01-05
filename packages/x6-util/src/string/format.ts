import { Lang } from '../lang'

export const isString = Lang.isString

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
