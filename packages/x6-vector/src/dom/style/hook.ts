export namespace Hook {
  export interface Definition {
    get?: <TElement extends Element>(
      elem: TElement,
      computed?: boolean,
    ) => string | number | undefined
    set?: <TElement extends Element>(
      elem: TElement,
      styleValue: string | number,
    ) => string | number | undefined
  }

  const hooks: Record<string, Definition> = {}

  export function get(styleName: string) {
    return hooks[styleName]
  }

  export function register(styleName: string, hook: Definition) {
    hooks[styleName] = hook
  }

  export function unregister(styleName: string) {
    delete hooks[styleName]
  }
}
