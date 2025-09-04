import { describe, expect, it } from 'vitest'
import { PriorityQueue } from '../../../src/common/algorithm/priorityqueue'

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should create empty queue with default comparator', () => {
      const queue = new PriorityQueue()
      expect(queue.isEmpty()).toBe(true)
      expect(queue.peek()).toBe(null)
      expect(queue.peekPriority()).toBe(null)
    })

    it('should create queue with custom comparator', () => {
      const comparator = (a: number, b: number) => b - a // max heap
      const queue = new PriorityQueue({ comparator })
      queue.insert(1, 'low')
      queue.insert(3, 'high')
      expect(queue.peek()).toBe('high')
    })

    it('should create queue with initial data', () => {
      const data = [
        { priority: 2, value: 'medium' },
        { priority: 1, value: 'low' },
        { priority: 3, value: 'high' },
      ]
      const queue = new PriorityQueue({ data })
      expect(queue.peek()).toBe('low')
    })

    it('should create queue with initial data and ids', () => {
      const data = [
        { priority: 2, value: 'medium', id: 'med' },
        { priority: 1, value: 'low', id: 'low' },
        { priority: 3, value: 'high', id: 'high' },
      ]
      const queue = new PriorityQueue({ data })
      expect(queue.peek()).toBe('low')
      queue.updatePriority('low', 5)
      expect(queue.peek()).toBe('medium')
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      const queue = new PriorityQueue()
      expect(queue.isEmpty()).toBe(true)
    })

    it('should return false for non-empty queue', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'test')
      expect(queue.isEmpty()).toBe(false)
    })
  })

  describe('insert', () => {
    it('should insert item without id', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'test')
      expect(queue.peek()).toBe('test')
      expect(queue.peekPriority()).toBe(1)
    })

    it('should insert item with id', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'test', 'id1')
      expect(queue.peek()).toBe('test')
    })

    it('should maintain heap property after multiple inserts', () => {
      const queue = new PriorityQueue()
      queue.insert(3, 'high')
      queue.insert(1, 'low')
      queue.insert(2, 'medium')
      expect(queue.peek()).toBe('low')
    })

    it('should return this for chaining', () => {
      const queue = new PriorityQueue()
      const result = queue.insert(1, 'test')
      expect(result).toBe(queue)
    })
  })

  describe('peek', () => {
    it('should return null for empty queue', () => {
      const queue = new PriorityQueue()
      expect(queue.peek()).toBe(null)
    })

    it('should return highest priority value', () => {
      const queue = new PriorityQueue()
      queue.insert(2, 'medium')
      queue.insert(1, 'high')
      queue.insert(3, 'low')
      expect(queue.peek()).toBe('high')
    })
  })

  describe('peekPriority', () => {
    it('should return null for empty queue', () => {
      const queue = new PriorityQueue()
      expect(queue.peekPriority()).toBe(null)
    })

    it('should return highest priority', () => {
      const queue = new PriorityQueue()
      queue.insert(2, 'medium')
      queue.insert(1, 'high')
      queue.insert(3, 'low')
      expect(queue.peekPriority()).toBe(1)
    })
  })

  describe('remove', () => {
    it('should return null for empty queue', () => {
      const queue = new PriorityQueue()
      expect(queue.remove()).toBe(null)
    })

    it('should remove and return highest priority item', () => {
      const queue = new PriorityQueue()
      queue.insert(2, 'medium')
      queue.insert(1, 'high')
      queue.insert(3, 'low')

      expect(queue.remove()).toBe('high')
      expect(queue.peek()).toBe('medium')
    })

    it('should handle single item removal', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'only')
      expect(queue.remove()).toBe('only')
      expect(queue.isEmpty()).toBe(true)
    })

    it('should remove item with id and update index', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'high', 'id1')
      queue.insert(2, 'low', 'id2')

      expect(queue.remove()).toBe('high')
      expect(() => queue.updatePriority('id1', 5)).toThrow()
    })

    it('should maintain heap property after removal', () => {
      const queue = new PriorityQueue()
      const values = [5, 3, 8, 1, 9, 2, 7]
      values.forEach((val, idx) => queue.insert(val, `item${idx}`))

      const removed = []
      while (!queue.isEmpty()) {
        // @ts-expect-error
        removed.push(queue.peekPriority())
        queue.remove()
      }

      // Should be in ascending order
      for (let i = 1; i < removed.length; i++) {
        expect(removed[i]).toBeGreaterThanOrEqual(removed[i - 1])
      }
    })
  })

  describe('updatePriority', () => {
    it('should throw error for non-existent id', () => {
      const queue = new PriorityQueue()
      expect(() => queue.updatePriority('nonexistent', 1)).toThrow(
        "Node with id 'nonexistent' was not found in the heap.",
      )
    })

    it('should update priority to lower value (bubble up)', () => {
      const queue = new PriorityQueue()
      queue.insert(3, 'low', 'id1')
      queue.insert(2, 'medium', 'id2')
      queue.insert(1, 'high', 'id3')

      queue.updatePriority('id1', 0)
      expect(queue.peek()).toBe('low')
    })

    it('should update priority to higher value (bubble down)', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'high', 'id1')
      queue.insert(2, 'medium', 'id2')
      queue.insert(3, 'low', 'id3')

      queue.updatePriority('id1', 5)
      expect(queue.peek()).toBe('medium')
    })

    it('should not change position when priority is same', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'test', 'id1')
      queue.insert(2, 'other', 'id2')

      queue.updatePriority('id1', 1)
      expect(queue.peek()).toBe('test')
    })
  })

  describe('bubbleUp', () => {
    it('should handle bubbling up to root', () => {
      const queue = new PriorityQueue()
      queue.insert(3, 'item3')
      queue.insert(2, 'item2')
      queue.insert(1, 'item1') // This should bubble to root
      expect(queue.peek()).toBe('item1')
    })

    it('should maintain index when bubbling up items with ids', () => {
      const queue = new PriorityQueue()
      queue.insert(5, 'item5', 'id5')
      queue.insert(3, 'item3', 'id3')
      queue.insert(4, 'item4', 'id4')
      queue.insert(1, 'item1', 'id1') // Should bubble up

      expect(queue.peek()).toBe('item1')
      queue.updatePriority('id1', 10) // Should work if index is correct
      expect(queue.peek()).toBe('item3')
    })
  })

  describe('bubbleDown', () => {
    it('should handle bubbling down with left child only', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'root', 'root')
      queue.insert(2, 'left', 'left')

      queue.updatePriority('root', 5)
      expect(queue.peek()).toBe('left')
    })

    it('should handle bubbling down with both children', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'root', 'root')
      queue.insert(3, 'left', 'left')
      queue.insert(2, 'right', 'right')

      queue.updatePriority('root', 5)
      expect(queue.peek()).toBe('right')
    })

    it('should maintain index when bubbling down items with ids', () => {
      const queue = new PriorityQueue()
      queue.insert(1, 'root', 'root')
      queue.insert(2, 'left', 'left')
      queue.insert(3, 'right', 'right')
      queue.insert(4, 'item4', 'id4')

      queue.updatePriority('root', 10)
      expect(queue.peek()).toBe('left')

      // Test that all ids are still accessible
      queue.updatePriority('right', 1)
      expect(queue.peek()).toBe('right')
    })
  })

  describe('complex scenarios', () => {
    it('should handle mixed operations correctly', () => {
      const queue = new PriorityQueue()

      // Insert multiple items
      queue.insert(5, 'item5', 'id5')
      queue.insert(1, 'item1', 'id1')
      queue.insert(3, 'item3', 'id3')
      queue.insert(7, 'item7', 'id7')
      queue.insert(2, 'item2', 'id2')

      expect(queue.peek()).toBe('item1')

      // Update priorities
      queue.updatePriority('id5', 0)
      expect(queue.peek()).toBe('item5')

      // Remove items
      expect(queue.remove()).toBe('item5')
      expect(queue.peek()).toBe('item1')

      // Update again
      queue.updatePriority('id1', 10)
      expect(queue.peek()).toBe('item2')
    })

    it('should handle items without ids mixed with items with ids', () => {
      const queue = new PriorityQueue()

      queue.insert(3, 'no-id-1')
      queue.insert(1, 'with-id', 'id1')
      queue.insert(2, 'no-id-2')

      expect(queue.peek()).toBe('with-id')
      queue.remove()
      expect(queue.peek()).toBe('no-id-2')
    })
  })
})
