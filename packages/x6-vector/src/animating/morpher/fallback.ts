import { Morphable } from './morphable'

export class MorphableFallback<T = any> implements Morphable<T[], T> {
  value: T

  constructor(input: any) {
    this.value = Array.isArray(input) ? input[0] : input
  }

  fromArray(arr: T[]) {
    this.value = arr[0]
    return this
  }

  toArray(): T[] {
    return [this.value]
  }

  toValue(): T {
    return this.value
  }
}
