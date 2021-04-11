import { Store } from './store'
import type { EventObject } from './object'

export namespace Util {
  export const returnTrue = () => true
  export const returnFalse = () => false
  export function stopPropagationCallback(e: Event) {
    e.stopPropagation()
  }

  export function addEventListener<TElement extends Element>(
    elem: TElement,
    type: string,
    handler: EventListener,
  ) {
    if (elem.addEventListener != null) {
      elem.addEventListener(type, handler as any)
    }
  }

  export function removeEventListener<TElement extends Element>(
    elem: TElement,
    type: string,
    handler: EventListener,
  ) {
    if (elem.removeEventListener != null) {
      elem.removeEventListener(type, handler as any)
    }
  }
}

export namespace Util {
  const rnothtmlwhite = /[^\x20\t\r\n\f]+/g
  const rtypenamespace = /^([^.]*)(?:\.(.+)|)/
  const rcheckableInput = /^(?:checkbox|radio)$/i
  const whitespace = '[\\x20\\t\\r\\n\\f]'
  const rneedsContext = new RegExp(
    `^${whitespace}*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(${whitespace}*((?:-\\d)?\\d*)${whitespace}*\\)|)(?=[^-]|$)`,
    'i',
  )

  export function splitType(types: string) {
    return (types || '').match(rnothtmlwhite) || ['']
  }

  export function normalizeType(type: string) {
    const parts = rtypenamespace.exec(type) || []
    return {
      originType: parts[1],
      namespaces: parts[2] ? parts[2].split('.').sort() : [],
    }
  }

  export function isCheckableInput(elem: Store.EventTarget) {
    const node = elem as HTMLInputElement
    return (
      node.click != null &&
      node.nodeName.toLowerCase() === 'input' &&
      rcheckableInput.test(node.type)
    )
  }

  export function isValidTarget(target: Element | Record<string, any>) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return target.nodeType === 1 || target.nodeType === 9 || !+target.nodeType
  }

  export function isValidSelector(elem: Store.EventTarget, selector?: string) {
    if (selector) {
      const doce = document.documentElement
      const matches = doce.matches || (doce as any).msMatchesSelector
      return matches.call(elem, selector) as boolean
    }
    return true
  }

  export function needsContext(selector?: string) {
    return selector != null && rneedsContext.test(selector)
  }
}

export namespace Util {
  type Handler = (...args: any[]) => void

  let seed = 0
  const cache: WeakMap<Handler, number> = new WeakMap()

  export function ensureHandlerId(handler: Handler) {
    if (!cache.has(handler)) {
      cache.set(handler, seed)
      seed += 1
    }

    return cache.get(handler)!
  }

  export function getHandlerId(handler: Handler) {
    return cache.get(handler)
  }

  export function removeHandlerId(handler: Handler) {
    return cache.delete(handler)
  }

  export function setHandlerId(handler: Handler, id: number) {
    return cache.set(handler, id)
  }
}

export namespace Util {
  export function getHandlerQueue(elem: Store.EventTarget, event: EventObject) {
    const queue = []
    const store = Store.get(elem)
    const bag = store && store.events && store.events[event.type]
    const handlers = (bag && bag.handlers) || []
    const delegateCount = bag ? bag.delegateCount : 0

    if (
      delegateCount > 0 &&
      // Support: Firefox <=42 - 66+
      // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
      // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
      // Support: IE 11+
      // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
      !(
        event.type === 'click' &&
        typeof event.button === 'number' &&
        event.button >= 1
      )
    ) {
      for (
        let curr = event.target as Node;
        curr !== elem;
        curr = curr.parentNode || (elem as Node)
      ) {
        // Don't check non-elements
        // Don't process clicks on disabled elements
        if (
          curr.nodeType === 1 &&
          !(event.type === 'click' && (curr as any).disabled === true)
        ) {
          const matchedHandlers: Store.HandlerObject[] = []
          const matchedSelectors: { [selector: string]: boolean } = {}

          for (let i = 0; i < delegateCount; i += 1) {
            const handleObj = handlers[i]
            const selector = handleObj.selector!

            if (selector != null && matchedSelectors[selector] == null) {
              const node = elem as Element
              const nodes: Element[] = []

              node.querySelectorAll(selector).forEach((child) => {
                nodes.push(child)
              })

              matchedSelectors[selector] = nodes.includes(curr as Element)
            }

            if (matchedSelectors[selector]) {
              matchedHandlers.push(handleObj)
            }
          }

          if (matchedHandlers.length) {
            queue.push({ elem: curr, handlers: matchedHandlers })
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if (delegateCount < handlers.length) {
      queue.push({ elem, handlers: handlers.slice(delegateCount) })
    }

    return queue
  }
}
