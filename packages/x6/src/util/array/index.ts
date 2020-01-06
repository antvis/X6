import { Lang } from '../lang'

const proto = Array.prototype

export namespace ArrayExt {
  export const isArray = Lang.isArray
  export const isArrayLike = Lang.isArrayLike

  export function toArray(arr: any) {
    return isArrayLike(arr) ? proto.slice.call(arr) : [arr]
  }

  export function slice<T>(
    arr: undefined | null | T[],
    start?: number,
    end?: number,
  ) {
    return arr ? proto.slice.call(arr, start, end) : []
  }

  export function indexOf<T>(arr: undefined | null | T[], item: T): number {
    return arr ? proto.indexOf.call(arr, item) : -1
  }

  export function includes<T>(arr: undefined | null | T[], item: T): boolean {
    return arr ? indexOf(arr, item) >= 0 : false
  }

  export function lastIndexOf<T>(arr: undefined | null | T[], item: T): number {
    return arr ? proto.lastIndexOf.call(arr, item) : -1
  }

  export function map<T, U>(
    arr: undefined | null | T[],
    iterator: (value: T, index: number, array: T[]) => U,
    thisArg?: any,
  ): U[] {
    return arr ? proto.map.call(arr, iterator, thisArg) : []
  }

  export function some<T>(
    arr: undefined | null | T[],
    iterator: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): boolean {
    return arr ? proto.some.call(arr, iterator, thisArg) : false
  }

  export function every<T>(
    arr: undefined | null | T[],
    iterator: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): boolean {
    return arr ? proto.every.call(arr, iterator, thisArg) : false
  }

  export function filter<T>(
    arr: undefined | null | T[],
    iterator: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ) {
    return arr ? proto.filter.call(arr, iterator, thisArg) : []
  }

  export function forEach<T>(
    arr: undefined | null | T[],
    iterator: (value: T, index: number, array: T[]) => void,
    thisArg?: any,
  ): void {
    arr && proto.forEach.call(arr, iterator, thisArg)
  }

  export function reduce<T, U>(
    arr: undefined | null | T[],
    iterator: (memo: U, value: T, index: number, array: T[]) => U,
    initialValue: U,
  ): U {
    return arr ? proto.reduce.call(arr, iterator, initialValue) : initialValue
  }

  export function reduceRight<T, U>(
    arr: undefined | null | T[],
    iterator: (memo: U, value: T, index: number, array: T[]) => U,
    initialValue: U,
  ): U {
    return arr
      ? proto.reduceRight.call(arr, iterator, initialValue)
      : initialValue
  }

  /**
   * Creates a duplicate-free version of an array.
   */
  export function uniq<T extends Object>(arr: T[]) {
    const dict = new WeakSet<T>()
    const result: T[] = []

    arr.forEach(item => {
      if (!dict.has(item)) {
        result.push(item)
        dict.add(item)
      }
    })

    return result
  }
}
