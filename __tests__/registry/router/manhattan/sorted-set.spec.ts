import { beforeEach, describe, expect, it } from 'vitest'
import { SortedSet } from '../../../../src/registry/router/manhattan/sorted-set'

describe('SortedSet', () => {
  let sortedSet: SortedSet

  beforeEach(() => {
    sortedSet = new SortedSet()
  })

  describe('构造函数', () => {
    it('应该初始化空集合', () => {
      expect(sortedSet.items).toEqual([])
      expect(sortedSet.hash).toEqual({})
      expect(sortedSet.values).toEqual({})
      expect(sortedSet.isEmpty()).toBe(true)
    })
  })

  describe('add() 方法', () => {
    it('应该添加新项目到有序集合中', () => {
      sortedSet.add('item1', 5)

      expect(sortedSet.items).toEqual(['item1'])
      expect(sortedSet.values['item1']).toBe(5)
      expect(sortedSet.hash['item1']).toBe(1) // OPEN
      expect(sortedSet.isOpen('item1')).toBe(true)
    })

    it('应该按值的大小顺序弹出项目（堆不要求内部数组有序）', () => {
      sortedSet.add('item3', 3)
      sortedSet.add('item1', 1)
      sortedSet.add('item2', 2)

      expect(sortedSet.pop()).toBe('item1')
      expect(sortedSet.pop()).toBe('item2')
      expect(sortedSet.pop()).toBe('item3')
      expect(sortedSet.isEmpty()).toBe(true)
    })

    it('应该更新已存在项目的值和位置', () => {
      sortedSet.add('item1', 5)
      sortedSet.add('item1', 2) // 更新值

      expect(sortedSet.values['item1']).toBe(2)
      expect(sortedSet.items).toEqual(['item1'])
    })

    it('应该正确处理相同值的项目', () => {
      sortedSet.add('item1', 5)
      sortedSet.add('item2', 5)

      expect(sortedSet.items).toHaveLength(2)
      expect(sortedSet.values['item1']).toBe(5)
      expect(sortedSet.values['item2']).toBe(5)
    })
  })

  describe('pop() 方法', () => {
    it('应该弹出最小值对应的项目', () => {
      sortedSet.add('item3', 3)
      sortedSet.add('item1', 1)
      sortedSet.add('item2', 2)

      const first = sortedSet.pop()
      expect(first).toBe('item1')
      expect(sortedSet.items).toEqual(['item2', 'item3'])
      expect(sortedSet.isClose('item1')).toBe(true)
    })

    it('空集合弹出应该返回 undefined', () => {
      const result = sortedSet.pop()
      expect(result).toBeUndefined()
    })
  })

  describe('isOpen() 方法', () => {
    it('应该正确识别开放状态的项目', () => {
      sortedSet.add('item1', 1)
      expect(sortedSet.isOpen('item1')).toBe(true)
    })

    it('未添加的项目应该返回 false', () => {
      expect(sortedSet.isOpen('nonexistent')).toBe(false)
    })
  })

  describe('isClose() 方法', () => {
    it('应该正确识别关闭状态的项目', () => {
      sortedSet.add('item1', 1)
      sortedSet.pop()
      expect(sortedSet.isClose('item1')).toBe(true)
    })

    it('未弹出的项目应该返回 false', () => {
      sortedSet.add('item1', 1)
      expect(sortedSet.isClose('item1')).toBe(false)
    })
  })

  describe('isEmpty() 方法', () => {
    it('空集合应该返回 true', () => {
      expect(sortedSet.isEmpty()).toBe(true)
    })

    it('非空集合应该返回 false', () => {
      sortedSet.add('item1', 1)
      expect(sortedSet.isEmpty()).toBe(false)
    })

    it('弹出所有项目后应该返回 true', () => {
      sortedSet.add('item1', 1)
      sortedSet.pop()
      expect(sortedSet.isEmpty()).toBe(true)
    })
  })

  describe('综合测试', () => {
    it('应该正确处理完整的添加-弹出流程', () => {
      sortedSet.add('C', 3)
      sortedSet.add('A', 1)
      sortedSet.add('B', 2)

      // 弹出最小值
      expect(sortedSet.pop()).toBe('A')
      expect(sortedSet.isClose('A')).toBe(true)

      // 弹出下一个
      expect(sortedSet.pop()).toBe('B')

      // 弹出最后一个
      expect(sortedSet.pop()).toBe('C')
      expect(sortedSet.isEmpty()).toBe(true)
    })

    it('应该正确处理重复添加和更新', () => {
      sortedSet.add('item', 10)
      sortedSet.add('item', 5) // 更新值

      expect(sortedSet.values['item']).toBe(5)
      expect(sortedSet.items).toEqual(['item'])

      sortedSet.add('item2', 3)
      expect(sortedSet.items).toEqual(['item2', 'item']) // item2 应该在 item 前面
    })
  })
})
