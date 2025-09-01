import { Dom } from '../../common'
import { Config } from '../../config'
import type { MarkupSelectors } from '../markup'
import type { View } from '.'

/**
 *  全局缓存 view，也不知道是用来干啥！
 */
const VIEWS: { [cid: string]: View } = {}

export function getView(cid: string) {
  return VIEWS[cid] || null
}

export function registerView(cid: string, view: View) {
  VIEWS[cid] = view
}

export function unregisterView(cid: string) {
  delete VIEWS[cid]
}

export function createViewElement(tagName?: string, isSvgElement?: boolean) {
  return isSvgElement
    ? Dom.createSvgElement(tagName || 'g')
    : (Dom.createElementNS(tagName || 'div') as HTMLElement)
}

export function viewFind(
  selector: string | null | undefined,
  rootElem: Element,
  selectors: MarkupSelectors,
): { isCSSSelector?: boolean; elems: Element[] } {
  if (!selector || selector === '.') {
    return { elems: [rootElem] }
  }

  if (selectors) {
    const nodes = selectors[selector]
    if (nodes) {
      return { elems: Array.isArray(nodes) ? nodes : [nodes] }
    }
  }

  if (Config.useCSSSelector) {
    const validSelector = selector.includes('>')
      ? `:scope ${selector}`
      : selector
    return {
      isCSSSelector: true,
      // $(rootElem).find(selector).toArray() as Element[]
      elems: Array.prototype.slice.call(
        rootElem.querySelectorAll(validSelector),
      ),
    }
  }

  return { elems: [] }
}

export function normalizeEvent<T extends Dom.EventObject>(evt: T) {
  let normalizedEvent = evt
  const originalEvent = evt.originalEvent as TouchEvent
  const touchEvt: any = originalEvent?.changedTouches?.[0]

  if (touchEvt) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in evt) {
      if (touchEvt[key] === undefined) {
        touchEvt[key] = (evt as any)[key]
      }
    }
    normalizedEvent = touchEvt
  }

  return normalizedEvent
}
