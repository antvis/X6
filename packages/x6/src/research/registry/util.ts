function getHMRStatus() {
  const mod = module as any
  if (mod != null && mod.hot != null && mod.hot.status != null) {
    return mod.hot.status()
  }
  return 'unkonwn'
}

function isApplyingHMR() {
  return getHMRStatus() === 'apply'
}

export function getEntity<T>(
  registry: { [name: string]: T },
  name: string,
): T | null {
  const ret = registry[name]
  return typeof ret === 'function' ? ret : null
}

export function registerEntity<T>(
  registry: { [name: string]: T },
  name: string,
  entity: T,
  force: boolean,
  onError: () => void,
) {
  if (registry[name] && !force && !isApplyingHMR()) {
    onError()
  }
  registry[name] = entity
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

function extend(cls: any, parent: any) {
  extendStatics(cls, parent)
  function tmp() {
    this.constructor = cls
  }
  cls.prototype =
    parent === null
      ? Object.create(parent)
      : ((tmp.prototype = parent.prototype), new (tmp as any)())
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
  const fn = cacheClass(base)
  // tslint:disable-next-line
  const cls = new Function(
    `return function ${className}() { return ${fn}.apply(this, arguments) }`,
  )()
  extend(cls, base)
  return cls as T
}
