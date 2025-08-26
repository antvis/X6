import { Dom, FunctionExt } from '../../common'

/**
 * Format the event key.
 * @param key
 * @param formatFn
 * @returns
 */
export function formatKey(
  key: string,
  formatFn?: (...args: any[]) => any,
  args?: any,
) {
  const formated = key
    .toLocaleLowerCase()
    .replace(/\s/g, '')
    .replace('delete', 'del')
    .replace('cmd', 'command')
    .replace('arrowup', 'up')
    .replace('arrowright', 'right')
    .replace('arrowdown', 'down')
    .replace('arrowleft', 'left')

  if (formatFn) {
    return FunctionExt.call(formatFn, args, formated)
  }

  return formated
}

/**
 * Whether the event is an input event.
 * @param e
 * @returns
 */
export function isInputEvent(e: KeyboardEvent | Dom.MouseUpEvent) {
  const target = e.target as Element
  const tagName = target?.tagName?.toLowerCase()
  let isInput = ['input', 'textarea'].includes(tagName)
  if (Dom.attr(target, 'contenteditable') === 'true') {
    isInput = true
  }
  return isInput
}

/**
 * Whether the event is a graph event.
 * @param e
 * @param t
 * @param container
 * @returns
 */
export function isGraphEvent(e: KeyboardEvent, t: Element, container: Element) {
  const target = e.target as Element
  const currentTarget = e.currentTarget as Element
  if (target) {
    if (target === t || currentTarget === t || target === document.body) {
      return true
    }

    return Dom.contains(container, target)
  }

  return false
}
