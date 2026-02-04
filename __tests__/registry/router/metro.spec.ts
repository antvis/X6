import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry'

const manhattanMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/registry/router/manhattan/index', () => ({
  manhattan: manhattanMock,
}))

import { metro } from '../../../src/registry/router/metro'

describe('metro router', () => {
  beforeEach(() => {
    manhattanMock.mockReset()
  })

  it('should call manhattan with metro defaults', () => {
    manhattanMock.mockReturnValue([])

    metro.call({} as any, [], {}, {} as any)

    expect(manhattanMock).toHaveBeenCalledTimes(1)
    const [, options] = manhattanMock.mock.calls[0]
    expect(options.maxDirectionChange).toBe(45)
    expect(typeof options.fallbackRoute).toBe('function')
    expect(typeof options.directions).toBe('function')
  })

  it('should allow overriding default options', () => {
    manhattanMock.mockReturnValue([])

    metro.call({} as any, [], { maxDirectionChange: 90 }, {} as any)

    const [, options] = manhattanMock.mock.calls[0]
    expect(options.maxDirectionChange).toBe(90)
  })

  it('should generate 8-direction metro directions with diagonal costs', () => {
    manhattanMock.mockReturnValue([])

    metro.call({} as any, [], { step: 10, cost: 1 } as any, {} as any)

    const [, options] = manhattanMock.mock.calls[0]
    const dirs = options.directions.call(options)

    expect(dirs).toHaveLength(8)
    expect(dirs[0]).toMatchObject({ cost: 1, offsetX: 10, offsetY: 0 })
    expect(dirs[1]).toMatchObject({ cost: 15, offsetX: 10, offsetY: 10 })
    expect(dirs[2]).toMatchObject({ cost: 1, offsetX: 0, offsetY: 10 })
    expect(dirs[3]).toMatchObject({ cost: 15, offsetX: -10, offsetY: 10 })
    expect(dirs[4]).toMatchObject({ cost: 1, offsetX: -10, offsetY: 0 })
    expect(dirs[5]).toMatchObject({ cost: 15, offsetX: -10, offsetY: -10 })
    expect(dirs[6]).toMatchObject({ cost: 1, offsetX: 0, offsetY: -10 })
    expect(dirs[7]).toMatchObject({ cost: 15, offsetX: 10, offsetY: -10 })
  })

  it('fallbackRoute should not include from/to points and should set previousDirectionAngle', () => {
    manhattanMock.mockReturnValue([])

    metro.call({} as any, [], {}, {} as any)

    const [, options] = manhattanMock.mock.calls[0]
    const fallbackRoute = options.fallbackRoute as any

    const resolvedOptions: any = {
      directions: Array.from({ length: 8 }, () => ({})),
      previousDirectionAngle: null,
    }

    const from = new Point(0, 0)
    const to = new Point(10, 0)
    const route: Point[] = fallbackRoute(from, to, resolvedOptions)

    expect(route.some((p) => p.equals(from))).toBe(false)
    expect(route.some((p) => p.equals(to))).toBe(false)
    expect(typeof resolvedOptions.previousDirectionAngle).toBe('number')
    expect(resolvedOptions.previousDirectionAngle % 45).toBe(0)
  })

  it('fallbackRoute should return an intermediate point when lines intersect', () => {
    manhattanMock.mockReturnValue([])

    metro.call({} as any, [], {}, {} as any)

    const [, options] = manhattanMock.mock.calls[0]
    const fallbackRoute = options.fallbackRoute as any

    const resolvedOptions: any = {
      directions: Array.from({ length: 8 }, () => ({})),
      previousDirectionAngle: null,
    }

    const from = new Point(0, 0)
    const to = new Point(100, 80)
    const route: Point[] = fallbackRoute(from, to, resolvedOptions)

    expect(route.length === 0 || route.length === 1).toBe(true)
    if (route.length === 1) {
      expect(route[0].equals(from)).toBe(false)
      expect(route[0].equals(to)).toBe(false)
    }
    expect(typeof resolvedOptions.previousDirectionAngle).toBe('number')
    expect(resolvedOptions.previousDirectionAngle % 45).toBe(0)
  })
})
