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
