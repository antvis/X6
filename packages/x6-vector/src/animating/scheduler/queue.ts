export class Queue<T> {
  protected firstItem: Queue.Item<T> | null
  protected lastItem: Queue.Item<T> | null

  constructor() {
    this.firstItem = null
    this.lastItem = null
  }

  first() {
    return this.firstItem ? this.firstItem.value : null
  }

  last() {
    return this.lastItem ? this.lastItem.value : null
  }

  shift() {
    const remove = this.firstItem
    if (!remove) {
      return null
    }

    this.firstItem = remove.next
    if (this.firstItem) {
      this.firstItem.prev = null
    }
    this.lastItem = this.firstItem ? this.lastItem : null
    return remove.value
  }

  push(value: T | Queue.Item<T>) {
    const o = value as any
    const item: Queue.Item<T> =
      typeof o === 'object' &&
      typeof o.value !== 'undefined' &&
      typeof o.prev !== 'undefined' &&
      typeof o.next !== 'undefined'
        ? o
        : { value: o, next: null, prev: null }

    if (this.lastItem) {
      item.prev = this.lastItem
      this.lastItem.next = item
      this.lastItem = item
    } else {
      this.lastItem = item
      this.firstItem = item
    }

    return item
  }

  remove(item: Queue.Item<T>) {
    if (item.prev) {
      item.prev.next = item.next
    }

    if (item.next) {
      item.next.prev = item.prev
    }

    if (item === this.lastItem) {
      this.lastItem = item.prev
    }

    if (item === this.firstItem) {
      this.firstItem = item.next
    }

    item.prev = null
    item.next = null
  }
}

export namespace Queue {
  export interface Item<T> {
    value: T
    prev: Item<T> | null
    next: Item<T> | null
  }

  export function isItem<T>(o: any): o is Item<T> {
    return (
      typeof o === 'object' &&
      typeof o.value !== 'undefined' &&
      typeof o.prev !== 'undefined' &&
      typeof o.next !== 'undefined'
    )
  }
}
