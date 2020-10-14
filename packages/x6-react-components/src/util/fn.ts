import { translate } from './dom/translate'

const functionReturnTrue = () => true
const functionReturnFalse = () => false

export function getJudgeFunction(fn: any) {
  if (typeof fn !== 'function') {
    return fn ? functionReturnTrue : functionReturnFalse
  }
  return fn
}

export function translatePosition(
  style: CSSStyleDeclaration,
  x: number,
  y: number,
  initialRender = false,
) {
  if (initialRender) {
    style.left = `${x}px`
    style.top = `${y}px`
  } else {
    translate(style, x, y)
  }
}

export function debounce(
  func: (...args: any[]) => any,
  wait: number,
  context: any,
  setTimeoutFunc = window.setTimeout,
  clearTimeoutFunc = window.clearTimeout,
) {
  let timeout: number

  const debouncer = (...args: any[]) => {
    debouncer.reset()

    const callback = () => {
      func.apply(context, args)
    }
    timeout = setTimeoutFunc(callback, wait)
  }

  debouncer.reset = () => {
    clearTimeoutFunc(timeout)
  }

  return debouncer
}
