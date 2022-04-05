export {
  has,
  pick,
  forIn,
  merge,
  extend,
  isEqual,
  isEmpty,
  isObject,
  isPlainObject,
  clone,
  cloneDeep,
  defaults,
  defaultsDeep,
} from 'lodash-es'

export * from './mixins'
export * from './inherit'

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
  if (Number.isNaN(value) || !Number.isFinite(value)) {
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

export function isMaliciousProp(prop: string): boolean {
  return prop === '__proto__'
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
  if (lastKey && !isMaliciousProp(lastKey)) {
    let diver = obj
    keys.forEach((key) => {
      if (!isMaliciousProp(key)) {
        if (diver[key] == null) {
          diver[key] = {}
        }
        diver = diver[key]
      }
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

export function flatten(obj: any, delim = '/', stop?: (val: any) => boolean) {
  const ret: { [key: string]: any } = {}

  Object.keys(obj).forEach((key) => {
    const val = obj[key]
    let deep = typeof val === 'object' || Array.isArray(val)
    if (deep && stop && stop(val)) {
      deep = false
    }

    if (deep) {
      const flatObject = flatten(val, delim, stop)
      Object.keys(flatObject).forEach((flatKey) => {
        ret[key + delim + flatKey] = flatObject[flatKey]
      })
    } else {
      ret[key] = val
    }
  })

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue
    }
  }

  return ret
}
