import { Disposable } from './disposable'

export class Dictionary<T extends Record<string, any>, V> extends Disposable {
  private map: WeakMap<T, V>
  private arr: T[]

  constructor() {
    super()
    this.clear()
  }

  clear() {
    this.map = new WeakMap<T, V>()
    this.arr = []
  }

  has(key: T) {
    return this.map.has(key)
  }

  get(key: T) {
    return this.map.get(key)
  }

  set(key: T, value: V) {
    this.map.set(key, value)
    this.arr.push(key)
  }

  delete(key: T) {
    const index = this.arr.indexOf(key)
    if (index >= 0) {
      this.arr.splice(index, 1)
    }
    const ret = this.map.get(key)
    this.map.delete(key)
    return ret
  }

  each(iterator: (value: V, key: T) => void) {
    this.arr.forEach((key) => {
      const value = this.map.get(key)!
      iterator(value, key)
    })
  }

  @Disposable.dispose()
  dispose() {
    this.clear()
  }
}
