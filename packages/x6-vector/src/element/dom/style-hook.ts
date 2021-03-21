export interface Hook {
  get<TElement extends Element>(
    elem: TElement,
    computed?: boolean,
    extra?: boolean | string,
  ): string | number
  set<TElement extends Element>(
    elem: TElement,
    value: string | number,
    extra?: boolean | string,
  ): string | undefined
}

export namespace Hook {
  const hooks: Record<string, Hook> = {}

  export function get(name: string) {
    return hooks[name]
  }

  export function add(name: string, hook: Hook) {
    hooks[name] = hook
  }
}
