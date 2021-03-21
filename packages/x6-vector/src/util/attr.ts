export namespace Attr {
  export type Hook<T> = (attrs: string, value: any, dom: T) => any

  const hooks: Hook<any>[] = []

  export function registerHook<T>(fn: Hook<T>) {
    hooks.push(fn)
  }

  export function applyHooks<T>(attrs: string, value: any, dom: T) {
    return hooks.reduce((val, hook) => hook(attrs, val, dom), value)
  }

  export function parseValue(value: string): string | number {
    const numReg = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i
    return numReg.test(value) ? Number.parseFloat(value) : value
  }
}

export namespace Attr {
  export const defaults = {
    'fill-opacity': 1,
    'stroke-opacity': 1,
    'stroke-width': 0,
    'stroke-linejoin': 'miter',
    'stroke-linecap': 'butt',
    fill: '#000000',
    stroke: '#000000',
    opacity: 1,

    // position
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,

    // size
    width: 0,
    height: 0,

    // radius
    r: 0,
    rx: 0,
    ry: 0,

    // gradient
    offset: 0,
    'stop-opacity': 1,
    'stop-color': '#000000',

    // text
    'text-anchor': 'start',
  }
}
