export function isAsyncLike<T>(obj: any): obj is Promise<T> {
  return typeof obj === 'object' && obj.then && typeof obj.then === 'function'
}

export function isAsync<T>(obj: any): obj is Promise<T> {
  return obj != null && (obj instanceof Promise || isAsyncLike(obj))
}

export type AsyncBoolean = boolean | Promise<boolean>

export function toAsyncBoolean(...inputs: (any | any[])[]): AsyncBoolean {
  const results: any[] = []

  inputs.forEach((arg) => {
    if (Array.isArray(arg)) {
      results.push(...arg)
    } else {
      results.push(arg)
    }
  })

  const hasAsync = results.some((res) => isAsync(res))
  if (hasAsync) {
    const deferres = results.map((res) =>
      isAsync(res) ? res : Promise.resolve(res !== false),
    )

    return Promise.all(deferres).then((arr) =>
      arr.reduce<boolean>((memo, item) => item !== false && memo, true),
    )
  }

  return results.every((res) => res !== false)
}

export function toDeferredBoolean(...inputs: (any | any[])[]) {
  const ret = toAsyncBoolean(inputs)
  return typeof ret === 'boolean' ? Promise.resolve(ret) : ret
}
