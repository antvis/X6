import { describe, expect, it, vi } from 'vitest'
import {
  pin,
  pinAbsolute,
  pinEdgeTerminal,
  pinNodeTerminal,
  pinRelative,
  toPercentage,
} from '../../../src/registry/connection-strategy/pin'

describe('connection-strategy/pin', () => {
  const createMockEdgeView = (hasConnection = true, isEdgeElement = true) => ({
    getConnection: vi.fn().mockReturnValue(
      hasConnection
        ? {
            closestPointLength: vi.fn().mockReturnValue(50),
            length: vi.fn().mockReturnValue(100),
          }
        : null,
    ),
    isEdgeElement: vi.fn().mockReturnValue(isEdgeElement),
  })

  const createMockNodeView = () => ({
    cell: {
      getAngle: vi.fn().mockReturnValue(0),
      getBBox: vi.fn().mockReturnValue({
        getCenter: vi.fn().mockReturnValue({ x: 50, y: 50 }),
      }),
    },
    getUnrotatedBBoxOfElement: vi.fn().mockReturnValue({
      x: 10,
      y: 10,
      width: 100,
      height: 50,
    }),
    isEdgeElement: vi.fn().mockReturnValue(false),
  })

  describe('toPercentage', () => {
    it('should return "0%" when max is 0', () => {
      expect(toPercentage(10, 0)).toBe('0%')
    })

    it('should calculate percentage correctly', () => {
      expect(toPercentage(25, 100)).toBe('25%')
      expect(toPercentage(50, 200)).toBe('25%')
      expect(toPercentage(33, 100)).toBe('33%')
    })

    it('should round percentage values', () => {
      expect(toPercentage(33.7, 100)).toBe('34%')
      expect(toPercentage(33.2, 100)).toBe('33%')
    })
  })

  describe('pin', () => {
    it('should return strategy function for relative positioning', () => {
      const strategy = pin(true)
      expect(typeof strategy).toBe('function')

      const view = createMockEdgeView(false, true)
      const magnet = document.createElement('div')
      const coords = { x: 30, y: 25 }

      const result = strategy({}, view, magnet, coords)

      expect(result.anchor).toBeUndefined()
    })

    it('should return strategy function for absolute positioning', () => {
      const strategy = pin(false)
      expect(typeof strategy).toBe('function')

      const view = createMockNodeView()
      const magnet = document.createElement('svg')
      const coords = { x: 30, y: 25 }

      const result = strategy({}, view, magnet, coords)

      expect(result.anchor).toEqual({
        name: 'topLeft',
        args: {
          dx: 20,
          dy: 15,
          rotate: true,
        },
      })
    })
  })

  describe('pinNodeTerminal', () => {
    it('should set anchor with absolute positioning', () => {
      const data = {}
      const view = createMockNodeView()
      const magnet = document.createElement('svg')
      const coords = { x: 30, y: 25 }

      // @ts-expect-error
      const result = pinNodeTerminal(false, data, view, magnet, coords)

      expect(result.anchor).toEqual({
        name: 'topLeft',
        args: {
          dx: 20,
          dy: 15,
          rotate: true,
        },
      })
    })

    it('should set anchor with relative positioning', () => {
      const view = createMockNodeView()
      const magnet = document.createElement('svg')
      const coords = { x: 30, y: 25 }

      // @ts-expect-error
      const result = pinNodeTerminal(true, {}, view, magnet, coords)

      expect(result.anchor).toEqual({
        name: 'topLeft',
        args: {
          dx: '20%',
          dy: '30%',
          rotate: true,
        },
      })
    })

    it('should handle rotation correctly', () => {
      const view = createMockNodeView()
      view.cell.getAngle.mockReturnValue(90)
      const magnet = document.createElement('svg')
      const coords = { x: 30, y: 25 }

      // @ts-expect-error
      pinNodeTerminal(false, {}, view, magnet, coords)

      expect(view.cell.getAngle).toHaveBeenCalled()
      expect(view.cell.getBBox().getCenter).toHaveBeenCalled()
    })
  })

  describe('pinEdgeTerminal', () => {
    it('should return end unchanged when no connection', () => {
      const end = { test: 'data' }
      const view = createMockEdgeView(false)
      const magnet = document.createElement('div')
      const coords = { x: 10, y: 20 }

      // @ts-expect-error
      const result = pinEdgeTerminal(false, end, view, magnet, coords)

      expect(result).toBe(end)
      expect(result.anchor).toBeUndefined()
    })

    it('should set length anchor for absolute positioning', () => {
      const end = {}
      const view = createMockEdgeView()
      const magnet = document.createElement('div')
      const coords = { x: 10, y: 20 }

      // @ts-expect-error
      const result = pinEdgeTerminal(false, end, view, magnet, coords)

      expect(result.anchor).toEqual({
        name: 'length',
        args: {
          length: 50,
        },
      })
    })

    it('should set ratio anchor for relative positioning', () => {
      const end = {}
      const view = createMockEdgeView()
      const magnet = document.createElement('div')
      const coords = { x: 10, y: 20 }

      // @ts-expect-error
      const result = pinEdgeTerminal(true, end, view, magnet, coords)

      expect(result.anchor).toEqual({
        name: 'ratio',
        args: {
          ratio: 0.5,
        },
      })
    })
  })

  describe('exported constants', () => {
    it('should export pinRelative as pin(true)', () => {
      expect(typeof pinRelative).toBe('function')
    })

    it('should export pinAbsolute as pin(false)', () => {
      expect(typeof pinAbsolute).toBe('function')
    })
  })
})
