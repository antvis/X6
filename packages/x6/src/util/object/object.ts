export {
  has,
  isEmpty,
  isObject,
  isPlainObject,
  isEqual,
  cloneDeep,
  merge,
  pick,
  defaults,
  defaultsDeep,
  forIn,
  extend,
} from 'lodash'

export * from './inherit'

import { has, isPlainObject } from 'lodash'

export function ensure<T>(value: T | null | undefined, defaultValue: T) {
  return value != null ? value : defaultValue!
}

export function getValue<T>(obj: any, key: string, defaultValue?: T): T | null {
  const value = obj != null ? obj[key] : null
  return defaultValue !== undefined ? ensure<T>(value, defaultValue) : value
}

export function getNumber(obj: any, key: string, defaultValue: number) {
  let value = obj != null ? obj[key] : null
  if (value == null) {
    return defaultValue
  }

  value = +value
  if (isNaN(value) || !isFinite(value)) {
    return defaultValue
  }

  return value as number
}

export function getBoolean(obj: any, key: string, defaultValue: boolean) {
  const value = obj != null ? obj[key] : null
  if (value == null) {
    return defaultValue
  }

  return !!value
}

export function getByPath(
  obj: any,
  path: string | string[],
  delimiter: string | RegExp = '/',
) {
  let ret
  const keys = Array.isArray(path) ? path : path.split(delimiter)
  if (keys.length) {
    ret = obj
    while (keys.length) {
      const key = keys.shift()
      if (Object(ret) === ret && key && key in ret) {
        ret = ret[key]
      } else {
        return undefined
      }
    }
  }

  return ret
}

export function setByPath(
  obj: any,
  path: string | string[],
  value: any,
  delimiter: string | RegExp = '/',
) {
  const keys = Array.isArray(path) ? path : path.split(delimiter)
  const lastKey = keys.pop()
  if (lastKey) {
    let diver = obj
    keys.forEach(key => {
      if (diver[key] == null) {
        diver[key] = {}
      }
      diver = diver[key]
    })
    diver[lastKey] = value
  }
  return obj
}

export function unsetByPath(
  obj: any,
  path: string | string[],
  delimiter: string | RegExp = '/',
) {
  const keys = Array.isArray(path) ? path.slice() : path.split(delimiter)
  const propertyToRemove = keys.pop()
  if (propertyToRemove) {
    if (keys.length > 0) {
      const parent = getByPath(obj, keys)
      if (parent) {
        delete parent[propertyToRemove]
      }
    } else {
      delete obj[propertyToRemove]
    }
  }

  return obj
}

export function flatten(
  obj: any,
  delim: string = '/',
  stop?: (val: any) => boolean,
) {
  const ret: { [key: string]: any } = {}

  Object.keys(obj).forEach(key => {
    const val = obj[key]
    let deep = typeof val === 'object' || Array.isArray(val)
    if (deep && stop && stop(val)) {
      deep = false
    }

    if (deep) {
      const flatObject = flatten(val, delim, stop)
      Object.keys(flatObject).forEach(flatKey => {
        ret[key + delim + flatKey] = flatObject[flatKey]
      })
    } else {
      ret[key] = val
    }
  })

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue
  }

  return ret
}

export function mergec(
  target: { [key: string]: any },
  source: { [key: string]: any },
  options: {
    ignoreNull?: boolean
    ignoreUndefined?: boolean
    decorator?: (
      source: { [key: string]: any },
      target: { [key: string]: any },
      key: string,
    ) => any
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

export function destroy(obj: any) {
  if (obj != null) {
    for (const prop in obj) {
      if (has(obj, prop)) {
        delete obj[prop]
      }
    }
    obj.prototype = obj.__proto__ = null
    obj.destroyed = true
  }
}

export function clone<T>(
  obj: any,
  ignores?: string[],
  shallow: boolean = false,
) {
  if (obj != null && typeof obj.constructor === 'function') {
    const result = new obj.constructor() as { [key: string]: any }
    Object.keys(obj).forEach(key => {
      if (ignores == null || !ignores.includes(key)) {
        if (!shallow && typeof obj[key] === 'object') {
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
