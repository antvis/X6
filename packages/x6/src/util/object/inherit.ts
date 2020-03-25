/**
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export function applyMixins(derivedCtor: any, ...baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!,
      )
    })
  })
}

const extendStatics =
  Object.setPrototypeOf ||
  ({ __proto__: [] } instanceof Array &&
    function(d, b) {
      d.__proto__ = b
    }) ||
  function(d, b) {
    for (const p in b) {
      if (b.hasOwnProperty(p)) {
        d[p] = (b as any)[p]
      }
    }
  }

/**
 * @see https://github.com/microsoft/TypeScript/blob/5c85febb0ce9d6088cbe9b09cb42f73f9ee8ea05/src/compiler/transformers/es2015.ts#L4309
 */
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

let seed = 0
const classIdMap = new WeakMap<Function, string>()
function getClassId(c: Function) {
  let id = classIdMap.get(c)
  if (id == null) {
    id = `c${seed}`
    seed += 1
    classIdMap.set(c, id)
  }
  return id
}

function cacheClass(c: Function) {
  const win = window as any
  const key = '__x6_class__'
  let cache = win[key]
  if (cache == null) {
    cache = win[key] = {}
  }

  const id = getClassId(c)
  if (cache[id] == null) {
    cache[id] = c
  }

  return `window['${key}']['${id}']`
}

/**
 * Extends class with specified class name.
 */
export function createClass<T>(className: string, base: Function): T {
  const baseName = cacheClass(base)
  const isNativeClass = /^\s*class\s+/.test(`${base}`)

  // tslint:disable-next-line
  const cls = new Function(`
    return ${isNativeClass}
      ? class ${className} extends ${baseName} { }
      : function ${className}() { return ${baseName}.apply(this, arguments) }
  `)()

  if (!isNativeClass) {
    inherit(cls, base)
  }

  return cls as T
}
