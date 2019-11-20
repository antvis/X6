/* tslint:disable:no-eval */

const evalKey = '__X6_EVAL_RESULT__'
export function exec<T>(exp: string): T | null {
  let result = null
  if (exp.indexOf('function') >= 0) {
    try {
      const tmp = (window as any)[evalKey]
      exec(`var ${evalKey}=${exp}`)
      result = (window as any)[evalKey]
      if (tmp != null) {
        (window as any)[evalKey] = tmp
      } else {
        delete (window as any)[evalKey]
      }
    } catch (e) { }
  } else {
    try {
      result = exec(exp)
    } catch (e) { }
  }

  return result
}
