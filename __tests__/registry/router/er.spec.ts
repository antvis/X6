import { describe, expect, it } from 'vitest'
import { er } from '../../../src/registry/router/er'

describe('er router', () => {
  const createPoint = (x: number, y: number) => {
    return {
      x,
      y,
      clone: () => createPoint(x, y),
      toJSON: () => ({ x, y }),
    }
  }

  const createEdgeView = (sourceBBox: any, targetBBox: any) => {
    return {
      sourceBBox: {
        ...sourceBBox,
        getCenter: () =>
          createPoint(
            sourceBBox.x + sourceBBox.width / 2,
            sourceBBox.y + sourceBBox.height / 2,
          ),
      },
      targetBBox: {
        ...targetBBox,
        getCenter: () =>
          createPoint(
            targetBBox.x + targetBBox.width / 2,
            targetBBox.y + targetBBox.height / 2,
          ),
      },
    } as unknown
  }

  it('should return direct path when no offset needed (horizontal)', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 200, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], {}, edgeView)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ x: 50, y: 25 })
    expect(result[1]).toEqual({ x: 250, y: 25 })
  })

  it('should return direct path when no offset needed (vertical)', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 0, y: 100, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], {}, edgeView)
    expect(result).toHaveLength(0)
    expect(result[0]).toBeUndefined()
    expect(result[1]).toBeUndefined()
  })

  it('should apply offset when specified (horizontal)', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 200, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], { offset: 50 }, edgeView)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ x: 50, y: 25 })
    expect(result[1]).toEqual({ x: 250, y: 25 })
  })

  it('should apply center offset when specified', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 200, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], { offset: 'center' }, edgeView)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ x: 50, y: 25 })
    expect(result[1]).toEqual({ x: 250, y: 25 })
  })

  it('should respect direction override (T)', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 200, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], { direction: 'T' }, edgeView)
    expect(result).toHaveLength(2)
    // 验证垂直方向偏移
    expect(result[0].x).toBe(50)
    expect(result[1].x).toBe(250)
  })

  it('should handle min distance', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 120, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], { min: 30 }, edgeView)
    expect(result).toHaveLength(2)
    // 验证最小距离是否生效
    expect(result[0].x).toEqual(50)
    expect(result[1].x).toBeLessThan(120 + 100 - 30)
  })

  it('should handle existing vertices', () => {
    const sourceBBox = { x: 0, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 200, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)
    const vertices = [
      { x: 150, y: 50 },
      { x: 150, y: 100 },
    ]

    const result = er(vertices, {}, edgeView)
    expect(result).toHaveLength(4)
    expect(result[0]).toEqual({ x: 50, y: 25 })
    expect(result[1]).toEqual({ x: 150, y: 50 })
    expect(result[2]).toEqual({ x: 150, y: 100 })
    expect(result[3]).toEqual({ x: 250, y: 25 })
  })

  it('should handle reverse direction (R to L)', () => {
    const sourceBBox = { x: 200, y: 0, width: 100, height: 50 }
    const targetBBox = { x: 0, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], {}, edgeView)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ x: 250, y: 25 })
    expect(result[1]).toEqual({ x: 50, y: 25 })
  })

  it('should handle vertical reverse direction (B to T)', () => {
    const sourceBBox = { x: 0, y: 100, width: 100, height: 50 }
    const targetBBox = { x: 0, y: 0, width: 100, height: 50 }
    const edgeView = createEdgeView(sourceBBox, targetBBox)

    const result = er([], {}, edgeView)
    expect(result).toHaveLength(0)
    expect(result[0]).toBeUndefined()
    expect(result[1]).toBeUndefined()
  })
})
