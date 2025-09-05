import { describe, expect, it, vi } from 'vitest'
import {
  defaults,
  type ManhattanRouterOptions,
  resolve,
  resolveOptions,
} from '../../../../src/registry/router/manhattan/options'
import { orth } from '../../../../src/registry/router/orth'

describe('Manhattan Router Options', () => {
  describe('resolve function', () => {
    it('should return the value directly if it is not a function', () => {
      const options = {} as ManhattanRouterOptions
      const result = resolve('test', options)
      expect(result).toBe('test')
    })

    it('should call the function and return its result if input is a function', () => {
      const options = {
        step: 10,
      } as ManhattanRouterOptions
      const testFn = function (this: ManhattanRouterOptions) {
        return this.step * 2
      }
      const result = resolve(testFn, options)
      expect(result).toBe(20)
    })

    it('should bind the correct this context to the function', () => {
      const options = {
        step: 5,
        testValue: 'hello',
      } as any
      const testFn = function (this: ManhattanRouterOptions) {
        return (this as any).testValue + ' world'
      }
      const result = resolve(testFn, options)
      expect(result).toBe('hello world')
    })
  })

  describe('resolveOptions function', () => {
    it('should resolve all callable options to their values', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        step: 15,
        cost: function () {
          return this.step * 2
        },
      }

      const resolved = resolveOptions(options)

      expect(resolved.step).toBe(15)
      expect(resolved.cost).toBe(30) // 15 * 2
    })

    it('should handle direction angles calculation correctly', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        step: 10,
      }

      const resolved = resolveOptions(options)

      // 检查方向的角度计算
      expect(resolved.directions).toHaveLength(4)
      expect(resolved.directions[0].angle).toBe(0) // 向右
      expect(resolved.directions[1].angle).toBe(180) // 向左
      expect(resolved.directions[2].angle).toBe(270) // 向下
      expect(resolved.directions[3].angle).toBe(90) // 向上
    })

    it('should handle padding conversion to paddingBox correctly', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        padding: {
          top: 5,
          right: 10,
          bottom: 15,
          left: 20,
        },
      }

      const resolved = resolveOptions(options)

      expect(resolved.paddingBox).toEqual({
        x: -20,
        y: -5,
        width: 30, // 20 + 10
        height: 20, // 5 + 15
      })
    })

    it('should preserve special router functions without resolving them', () => {
      const customFallback = vi.fn()
      const customDragging = vi.fn()

      const options: ManhattanRouterOptions = {
        ...defaults,
        fallbackRouter: customFallback as any,
        draggingRouter: customDragging as any,
      }

      const resolved = resolveOptions(options)

      expect(resolved.fallbackRouter).toBe(customFallback)
      expect(resolved.draggingRouter).toBe(customDragging)
    })

    it('should use default paddingBox when no padding is provided', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        step: 20,
      }

      const resolved = resolveOptions(options)

      expect(resolved.paddingBox).toEqual({
        x: -20,
        y: -20,
        width: 40,
        height: 40,
      })
    })
  })

  describe('defaults object', () => {
    it('should have correct default values', () => {
      expect(defaults.step).toBe(10)
      expect(defaults.maxLoopCount).toBe(2000)
      expect(defaults.precision).toBe(1)
      expect(defaults.maxDirectionChange).toBe(90)
      expect(defaults.perpendicular).toBe(true)
      expect(defaults.excludeTerminals).toEqual([])
      expect(defaults.excludeNodes).toEqual([])
      expect(defaults.excludeShapes).toEqual([])
      expect(defaults.startDirections).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ])
      expect(defaults.endDirections).toEqual(['top', 'right', 'bottom', 'left'])
      expect(defaults.fallbackRouter).toBe(orth)
      expect(defaults.draggingRouter).toBe(null)
      expect(defaults.snapToGrid).toBe(true)
    })

    it('should have correct directionMap', () => {
      expect(defaults.directionMap).toEqual({
        top: { x: 0, y: -1 },
        right: { x: 1, y: 0 },
        bottom: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
      })
    })

    it('should have callable functions that return correct values', () => {
      const testOptions = {
        step: 10,
      } as ManhattanRouterOptions

      // 测试 cost 函数
      const cost = resolve(defaults.cost, testOptions)
      expect(cost).toBe(10)

      // 测试 directions 函数
      const directions = resolve(defaults.directions, testOptions)
      expect(directions).toHaveLength(4)
      expect(directions).toEqual([
        { cost: undefined, offsetX: 10, offsetY: 0 },
        { cost: undefined, offsetX: -10, offsetY: 0 },
        { cost: undefined, offsetX: 0, offsetY: 10 },
        { cost: undefined, offsetX: 0, offsetY: -10 },
      ])

      // 测试 penalties 函数
      const penalties = resolve(defaults.penalties, testOptions)
      expect(penalties).toEqual({
        0: 0,
        45: 5,
        90: 5,
      })

      // 测试 paddingBox 函数
      const paddingBox = resolve(defaults.paddingBox, testOptions)
      expect(paddingBox).toEqual({
        x: -10,
        y: -10,
        width: 20,
        height: 20,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty options object', () => {
      const options = {} as ManhattanRouterOptions
      const resolved = resolveOptions({ ...defaults, ...options })

      // 应该使用默认值
      expect(resolved.step).toBe(10)
      expect(resolved.maxLoopCount).toBe(2000)
    })

    it('should handle zero step value', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        step: 0,
      }

      const resolved = resolveOptions(options)
      expect(resolved.step).toBe(0)
      expect(resolved.cost).toBe(0)
    })

    it('should handle negative step value', () => {
      const options: ManhattanRouterOptions = {
        ...defaults,
        step: -5,
      }

      const resolved = resolveOptions(options)
      expect(resolved.step).toBe(-5)
      expect(resolved.cost).toBe(-5)
    })
  })
})
