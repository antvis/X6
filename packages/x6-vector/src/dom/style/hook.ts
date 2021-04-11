export namespace Hook {
  export interface Definition {
    get?: <TElement extends Element>(
      elem: TElement,
      computed?: boolean,
    ) => string | number | undefined
    set?: <TElement extends Element>(
      elem: TElement,
      styleValue: string | number,
    ) => string | undefined
  }

  const hooks: Record<string, Definition> = {}

  export function get(styleName: string) {
    return hooks[styleName]
  }

  export function register(styleName: string, hook: Definition) {
    hooks[styleName] = hook
  }
}
