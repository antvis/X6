/**
 * Return url without hash.
 */
export function getBaseUrl(url: string = window.location.href) {
  const href = url
  const idx = href.lastIndexOf('#')
  if (idx > 0) {
    return href.substring(0, idx)
  }
  return href
}

export function isRelativeUrl(url: string = window.location.href) {
  return (
    url.substring(0, 2) !== '//' &&
    url.substring(0, 7) !== 'http://' &&
    url.substring(0, 8) !== 'https://' &&
    url.substring(0, 10) !== 'data:image' &&
    url.substring(0, 7) !== 'file://'
  )
}

export function replaceTrailingNewlines(str: string, pattern: string) {
  let postfix = ''
  let left = str

  while (left.length > 0 && left.charAt(left.length - 1) === '\n') {
    left = left.substring(0, left.length - 1)
    postfix += pattern
  }

  return left + postfix
}
