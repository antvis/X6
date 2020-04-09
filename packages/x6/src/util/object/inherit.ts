const BLOBAL_KEY = '__X6_CLASS__'

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
const classIdMap: WeakMap<Function, string> = new WeakMap()
function getClassId(c: Function) {
  let id = classIdMap.get(c)
  if (id == null) {
    id = `c${seed}`
    seed += 1
    classIdMap.set(c, id)
  }
  return id
}

const win = window as any
win[BLOBAL_KEY] = {}
function cacheClass(c: Function) {
  let cache = win[BLOBAL_KEY]
  if (cache == null) {
    cache = win[BLOBAL_KEY] = {}
  }

  const id = getClassId(c)
  if (cache[id] == null) {
    cache[id] = c
  }

  return `window['${BLOBAL_KEY}']['${id}']`
}

// function isNativeClass(cls: Function) {
//   const classStr = `${cls}`
//   return (
//     /^\s*class\s+/.test(classStr) ||
//     classStr.indexOf(`window['${BLOBAL_KEY}']['`) > 0
//   )
// }

class A {}
const isNativeClass = /^\s*class\s+/.test(`${A}`)

/**
 * Extends class with specified class name.
 */
export function createClass<T>(className: string, base: Function): T {
  const baseName = cacheClass(base)
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
