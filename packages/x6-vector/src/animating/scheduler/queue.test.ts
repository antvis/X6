import { Queue } from './queue'

describe('Queue', () => {
  describe('first()', () => {
    it('should return null if no item in the queue', () => {
      const queue = new Queue()
      expect(queue.first()).toEqual(null)
    })

    it('should return the first value in the queue', () => {
      const queue = new Queue<number>()
      queue.push(1)
      expect(queue.first()).toBe(1)
      queue.push(2)
      expect(queue.first()).toBe(1)
    })
  })

  describe('last()', () => {
    it('should return null if no item in the queue', () => {
      const queue = new Queue()
      expect(queue.last()).toEqual(null)
    })

    it('should return the last value added', () => {
      const queue = new Queue()
      queue.push(1)
      expect(queue.last()).toBe(1)
      queue.push(2)
      expect(queue.last()).toBe(2)
    })
  })

  describe('push()', () => {
    it('should add an element to the end of the queue', () => {
      const queue = new Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      expect(queue.first()).toBe(1)
      expect(queue.last()).toBe(3)
    })

    it('should add an item to the end of the queue', () => {
      const queue = new Queue()
      queue.push(1)
      const item = queue.push(2)
      queue.push(3)
      queue.remove(item)
      queue.push(item)

      expect(queue.first()).toBe(1)
      expect(queue.last()).toBe(2)
    })
  })

  describe('remove()', () => {
    it('should remove the given item from the queue', () => {
      const queue = new Queue()
      queue.push(1)
      queue.push(2)
      const item = queue.push(3)

      queue.remove(item)

      expect(queue.last()).toBe(2)
      expect(queue.first()).toBe(1)
    })

    it('should remove the given item from the queue', () => {
      const queue = new Queue()
      const item = queue.push(1)
      queue.push(2)
      queue.push(3)

      queue.remove(item)

      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(2)
    })
  })

  describe('shift()', () => {
    it('should return nothing if queue is empty', () => {
      const queue = new Queue()
      const val = queue.shift()
      expect(val).toBeFalsy()
    })

    it('should return the first item of the queue and should remove it', () => {
      const queue = new Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      const val = queue.shift()

      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(2)

      expect(val).toBe(1)
    })
  })
})
