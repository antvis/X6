import { ArrayExt } from '../../../util'

const OPEN = 1
const CLOSE = 2

export class SortedSet {
  items: string[]
  hash: { [key: string]: number }
  values: { [key: string]: number }

  constructor() {
    this.items = []
    this.hash = {}
    this.values = {}
  }

  add(item: string, value: number) {
    if (this.hash[item]) {
      // item removal
      this.items.splice(this.items.indexOf(item), 1)
    } else {
      this.hash[item] = OPEN
    }

    this.values[item] = value

    const index = ArrayExt.sortedIndexBy(
      this.items,
      item,
      (key) => this.values[key],
    )

    this.items.splice(index, 0, item)
  }

  pop() {
    const item = this.items.shift()
    if (item) {
      this.hash[item] = CLOSE
    }
    return item
  }

  isOpen(item: string) {
    return this.hash[item] === OPEN
  }

  isClose(item: string) {
    return this.hash[item] === CLOSE
  }

  isEmpty() {
    return this.items.length === 0
  }
}
