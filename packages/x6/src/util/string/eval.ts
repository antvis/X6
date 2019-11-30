/* tslint:disable:no-eval */

export function exec<T>(exp: string): T | null {
  let result = null

  try {
    result = eval(exp)
  } catch (e) {}

  return result
}
