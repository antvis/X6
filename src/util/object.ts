import { split } from './string'
import { isObject, isWindow } from './lang'

export function hasOwn(obj: any, key: string) {
  return obj && Object.prototype.hasOwnProperty.call(obj, key)
}

export function forIn<T>(
  obj: T,
  iterator: (val: any, key: string, obj: T) => void,
  context?: any,
) {
  Object.keys(obj).forEach((key: string) => {
    iterator.call(context, (obj as any)[key], key, obj)
  })
}

export function isPlainObject(obj: any) {
  // Not plain objects:
  //  - Any object or value whose internal [[Class]] property is not "[object Object]"
  //  - DOM nodes
  //  - window
  if (!isObject(obj) || obj.nodeType || isWindow(obj)) {
    return false
  }

  if (obj.constructor && !hasOwn(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  // If the function hasn't returned already, we're confident that
  // |obj| is a plain object, created by {} or constructed with new Object
  return true
}

export function isEmptyObject(obj: any) {
  for (const key in obj) {
    return !key
  }

  return true
}

export function getByPath(
  obj: { [key: string]: any },
  path: string,
  delimiter: string | RegExp = '.',
) {
  let ret
  const paths = split(path, delimiter)
  if (paths.length) {
    ret = obj
    while (paths.length) {
      const key = paths.shift()
      if (Object(ret) === ret && key && key in ret) {
        ret = ret[key]
      } else {
        return undefined
      }
    }
  }

  return ret
}

export function getValue(obj: any, key: string, defaultValue?: any) {
  let value = (obj != null) ? obj[key] : null
  if (value == null) {
    value = defaultValue
  }
  return value
}

export function getNumber(obj: any, key: string, defaultValue: number) {
  let value = (obj != null) ? obj[key] : null
  if (value == null) {
    return defaultValue
  }

  value = +value
  if (isNaN(value) || !isFinite(value)) {
    return defaultValue
  }

  return value as number
}

export function extend(target: { [key: string]: any } = {}, ...sources: any[]) {
  sources.forEach((source) => {
    if (source) {
      for (const key in source) {
        target[key] = source[key]
      }
    }
  })
  return target
}

export function mergec(
  target: { [key: string]: any },
  source: { [key: string]: any },
  options: {
    ignoreNull?: boolean,
    ignoreUndefined?: boolean,
    decorator?: (
      source: { [key: string]: any },
      target: { [key: string]: any },
      key: string,
    ) => any,
  } = {},
) {
  for (const name in source) {
    const src = target[name]
    const copy = source[name]
    const copyIsArray = Array.isArray(copy)

    if (copyIsArray || isPlainObject(copy)) {
      let clone

      if (copyIsArray) {
        clone = src && Array.isArray(src) ? src : []
      } else {
        clone = src && isPlainObject(src) ? src : {}
      }

      target[name] = mergec(clone, copy, options)
    } else {
      if (
        copy != null ||
        (copy === null && options.ignoreNull !== true) ||
        (copy === undefined && options.ignoreUndefined !== true)
      ) {
        target[name] = options.decorator
          ? options.decorator(target, source, name)
          : copy
      }
    }
  }

  return target
}

export function merge(target: { [key: string]: any } = {}, ...sources: any[]) {
  sources.forEach((source) => {
    if (source) {
      mergec(target, source)
    }
  })

  return target
}

export function destroy(obj: any) {
  if (obj) {
    for (const prop in obj) {
      if (hasOwn(obj, prop)) {
        delete obj[prop]
      }
    }
    if (obj) {
      obj.prototype = obj.__proto__ = null
    }
    obj.destroyed = true
  }
}

export function clone<T>(
  obj: any,
  ignores?: string[],
  shallow: boolean = false,
) {
  if (obj != null && typeof (obj.constructor) === 'function') {
    const result = new obj.constructor() as { [key: string]: any }
    Object.keys(obj).forEach((key) => {
      if ((ignores == null || !ignores.includes(key))) {
        if (!shallow && typeof (obj[key]) === 'object') {
          result[key] = clone(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    })

    return result as T
  }

  return null
}

export function removeDuplicates<T extends Object>(arr: T[]) {
  const dict = new WeakSet<T>()
  const result: T[] = []

  arr.forEach((item) => {
    if (!dict.has(item)) {
      result.push(item)
      dict.add(item)
    }
  })

  return result
}

export function equalEntries(a: any, b: any) {
  if (
    (a == null && b != null) ||
    (a != null && b == null) ||
    (a != null && b != null && (a as any).length !== (b as any).length)
  ) {
    return false
  }

  let count = 0
  if (a != null && b != null) {
    for (const key in b) {
      if (key) { }
      count += 1
    }

    for (const key in a) {
      count -= 1

      const av = (a as any)[key]
      const bv = (b as any)[key]

      if ((!isNaN(av) || !isNaN(bv)) && av !== av) {
        return false
      }
    }
  }

  return count === 0
}
