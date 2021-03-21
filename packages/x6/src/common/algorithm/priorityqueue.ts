/**
 * An implementation of the Priority Queue abstract data type.
 *
 * @see: http://en.wikipedia.org/wiki/Priority_queue
 *
 * It is like a normal stack or queue, but where each item has assigned a
 * priority (a number). Items with higher priority are served before items
 * with lower priority. This implementation uses binary heap as an internal
 * representation of the queue. The time complexity of all the methods is as
 * follows:
 *
 * - create: `O(n)`
 * - insert: `O(log n)`
 * - remove: `O(log n)`
 * - peek: `O(1)`
 * - isEmpty: `O(1)`
 * - peekPriority: `O(1)`
 */
export class PriorityQueue<T> {
  protected readonly comparator: PriorityQueue.Comparator
  protected index: { [key: string]: number }
  protected data: PriorityQueue.Data<T>

  constructor(options: PriorityQueue.Options<T> = {}) {
    this.comparator = options.comparator || PriorityQueue.defaultComparator
    this.index = {}
    this.data = options.data || []
    this.heapify()
  }

  /**
   * Returns `true` if the priority queue is empty, `false` otherwise.
   */
  isEmpty() {
    return this.data.length === 0
  }

  /**
   * Inserts a value with priority to the queue. Optionally pass a unique
   * id of this item. Passing unique IDs for each item you insert allows
   * you to use the `updatePriority()` operation.
   * @param priority
   * @param value
   * @param id
   */
  insert(priority: number, value: T, id?: string) {
    const item: PriorityQueue.DataItem<T> = { priority, value }
    const index = this.data.length - 1
    if (id) {
      item.id = id
      this.index[id] = index
    }
    this.data.push(item)
    this.bubbleUp(index)
    return this
  }

  /**
   * Returns the value of an item with the highest priority.
   */
  peek() {
    return this.data[0] ? this.data[0].value : null
  }

  /**
   * Returns the highest priority in the queue.
   */
  peekPriority() {
    return this.data[0] ? this.data[0].priority : null
  }

  updatePriority(id: string, priority: number) {
    const index = this.index[id]
    if (typeof index === 'undefined') {
      throw new Error(`Node with id '${id}' was not found in the heap.`)
    }

    const data = this.data
    const oldPriority = data[index].priority
    const comp = this.comparator(priority, oldPriority)
    if (comp < 0) {
      data[index].priority = priority
      this.bubbleUp(index)
    } else if (comp > 0) {
      data[index].priority = priority
      this.bubbleDown(index)
    }
  }

  /**
   * Removes the item with the highest priority from the queue
   *
   * @returns The value of the removed item.
   */
  remove() {
    const data = this.data
    const peek = data[0]
    const last = data.pop()!
    delete this.index[data.length]

    if (data.length > 0) {
      data[0] = last
      if (last.id) {
        this.index[last.id] = 0
      }
      this.bubbleDown(0)
    }

    return peek ? peek.value : null
  }

  protected heapify() {
    for (let i = 0; i < this.data.length; i += 1) {
      this.bubbleUp(i)
    }
  }

  protected bubbleUp(index: number) {
    const data = this.data
    let tmp
    let parent: number
    let current = index

    while (current > 0) {
      parent = (current - 1) >>> 1
      if (this.comparator(data[current].priority, data[parent].priority) < 0) {
        tmp = data[parent]
        data[parent] = data[current]
        let id = data[current].id
        if (id != null) {
          this.index[id] = parent
        }
        data[current] = tmp
        id = data[current].id
        if (id != null) {
          this.index[id] = current
        }
        current = parent
      } else {
        break
      }
    }
  }

  protected bubbleDown(index: number) {
    const data = this.data
    const last = data.length - 1
    let current = index

    // eslint-disable-next-line
    while (true) {
      const left = (current << 1) + 1
      const right = left + 1
      let minIndex = current

      if (
        left <= last &&
        this.comparator(data[left].priority, data[minIndex].priority) < 0
      ) {
        minIndex = left
      }
      if (
        right <= last &&
        this.comparator(data[right].priority, data[minIndex].priority) < 0
      ) {
        minIndex = right
      }

      if (minIndex !== current) {
        const tmp = data[minIndex]
        data[minIndex] = data[current]
        let id = data[current].id
        if (id != null) {
          this.index[id] = minIndex
        }
        data[current] = tmp
        id = data[current].id
        if (id != null) {
          this.index[id] = current
        }
        current = minIndex
      } else {
        break
      }
    }
  }
}

export namespace PriorityQueue {
  export interface Options<T> {
    comparator?: Comparator
    data?: Data<T>
  }

  export type Data<T> = DataItem<T>[]

  export interface DataItem<T> {
    priority: number
    value: T
    id?: string
  }

  export type Comparator = (a: number, b: number) => number
}
export namespace PriorityQueue {
  export const defaultComparator: Comparator = (a, b) => a - b
}
