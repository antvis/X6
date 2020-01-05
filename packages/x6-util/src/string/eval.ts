export function exec<T>(exp: string): T | null {
  let result = null

  try {
    result = window.eval(exp)
  } catch (e) {}

  return result
}
