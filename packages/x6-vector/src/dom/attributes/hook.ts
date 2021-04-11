import { Util as Style } from '../style/util'

export namespace Hook {
  export interface Definition {
    get?: <TElement extends Element>(node: TElement) => any
    set?: <TElement extends Element>(node: TElement, attributeValue: any) => any
  }

  const hooks: Record<string, Definition> = {}

  export function get(attributeName: string) {
    return hooks[attributeName]
  }

  export function register(attributeName: string, hook: Definition) {
    hooks[attributeName] = hook
  }

  register('style', {
    get(node) {
      return Style.style(node)
    },
  })
}
