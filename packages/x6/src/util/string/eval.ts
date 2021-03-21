export function exec<T>(exp: string): T | null {
  let result = null

  try {
    result = window.eval(exp) // eslint-disable-line
  } catch (e) {
    // pass
  }

  return result
}
