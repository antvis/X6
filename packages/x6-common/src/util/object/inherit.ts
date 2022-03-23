const extendStatics =
  Object.setPrototypeOf ||
  ({ __proto__: [] } instanceof Array &&
    function (d, b) {
      d.__proto__ = b // eslint-disable-line no-proto
    }) ||
  function (d, b) {
    // eslint-disable-next-line no-restricted-syntax
    for (const p in b) {
      if (Object.prototype.hasOwnProperty.call(b, p)) {
        d[p] = (b as any)[p]
      }
    }
  }

/**
 * @see https://github.com/microsoft/TypeScript/blob/5c85febb0ce9d6088cbe9b09cb42f73f9ee8ea05/src/compiler/transformers/es2015.ts#L4309
 */
// eslint-disable-next-line
export function inherit(cls: Function, base: Function) {
  extendStatics(cls, base)
  function tmp() {
    this.constructor = cls
  }
  cls.prototype =
    base === null
      ? Object.create(base)
      : ((tmp.prototype = base.prototype), new (tmp as any)())
}

class A {}
const isNativeClass =
  /^\s*class\s+/.test(`${A}`) || /^\s*class\s*\{/.test(`${class {}}`)

/**
 * Extends class with specified class name.
 */
export function createClass<T extends new (...args: any[]) => any>(
  className: string,
  base: T,
): T {
  let cls
  if (isNativeClass) {
    cls = class extends base {}
  } else {
    cls = function () {
      return base.apply(this, arguments) // eslint-disable-line
    }
    inherit(cls, base)
  }

  Object.defineProperty(cls, 'name', { value: className })

  return cls as T
}
