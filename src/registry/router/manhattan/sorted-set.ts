const OPEN = 1
const CLOSE = 2

export class SortedSet {
  items: string[]
  hash: { [key: string]: number }
  values: { [key: string]: number }
  indexes: { [key: string]: number }

  constructor() {
    this.items = []
    this.hash = {}
    this.values = {}
    this.indexes = {}
  }

  private swap(i: number, j: number) {
    const a = this.items[i]
    const b = this.items[j]
    this.items[i] = b
    this.items[j] = a
    this.indexes[b] = i
    this.indexes[a] = j
  }

  private less(i: number, j: number) {
    const ai = this.items[i]
    const aj = this.items[j]
    return this.values[ai] < this.values[aj]
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parent = (index - 1) >> 1
      if (this.less(index, parent)) {
        this.swap(index, parent)
        index = parent
      } else {
        break
      }
    }
  }

  private bubbleDown(index: number) {
    const n = this.items.length
    while (true) {
      const left = (index << 1) + 1
      const right = left + 1
      let smallest = index

      if (left < n && this.less(left, smallest)) {
        smallest = left
      }
      if (right < n && this.less(right, smallest)) {
        smallest = right
      }
      if (smallest !== index) {
        this.swap(index, smallest)
        index = smallest
      } else {
        break
      }
    }
  }

  add(item: string, value: number) {
    const existed = this.hash[item] === OPEN
    this.values[item] = value
    if (existed) {
      const idx = this.indexes[item]
      if (idx != null) {
        this.bubbleUp(idx)
        this.bubbleDown(idx)
      }
    } else {
      this.hash[item] = OPEN
      this.items.push(item)
      const idx = this.items.length - 1
      this.indexes[item] = idx
      this.bubbleUp(idx)
    }
  }

  pop() {
    if (this.items.length === 0) return undefined
    const top = this.items[0]
    this.hash[top] = CLOSE
    const last = this.items.pop()
    delete this.indexes[top]
    if (this.items.length > 0 && last != null) {
      this.items[0] = last
      this.indexes[last] = 0
      this.bubbleDown(0)
    }
    return top
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
