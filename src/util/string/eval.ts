
const evalKey = '__EvalFunctionResult__'
export function evalString(exp: string) {
  let result = null

  if (exp.indexOf('function') >= 0) {
    try {
      const tmp = (window as any)[evalKey]
      eval(`var ${evalKey}=${exp}`) // tslint:disable-line:no-eval
      result = (window as any)[evalKey]
      if (tmp != null) {
        (window as any)[evalKey] = tmp
      } else {
        delete (window as any)[evalKey]
      }
    } catch (e) { }
  } else {
    try {
      result = eval(exp) // tslint:disable-line:no-eval
    } catch (e) { }
  }

  return result
}
