import { describe, expect, it } from 'vitest'
import { orth } from '../../../src/registry/node-anchor/orth'

const createMockBBox = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return {
    x,
    y,
    width,
    height,
    getCenter: () => ({ x: x + width / 2, y: y + height / 2 }),
    getTopLeft: () => ({ x, y }),
    getBottomRight: () => ({ x: x + width, y: y + height }),
  }
}

const createMockView = (
  angle: number = 0,
  bboxConfig: { x: number; y: number; width: number; height: number } = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
) => {
  const bbox = createMockBBox(
    bboxConfig.x,
    bboxConfig.y,
    bboxConfig.width,
    bboxConfig.height,
  )
  return {
    cell: {
      getAngle: () => angle,
      getBBox: () => bbox,
      visible: true,
    },
    getBBoxOfElement: () => bbox,
  }
}

const createMockMagnet = () => ({})

describe('orth anchor', () => {
  it('should return center point when refPoint is at center', () => {
    const view = createMockView()
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 50 }
    const options = { padding: 10 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(50)
  })

  it('should handle vertical movement when refPoint is within vertical range', () => {
    const view = createMockView(0)
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 30 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(30)
  })

  it('should handle horizontal movement when refPoint is within horizontal range', () => {
    const view = createMockView(0)
    const magnet = createMockMagnet()
    const refPoint = { x: 30, y: 50 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(50)
  })

  it('should handle 90 degree rotation correctly', () => {
    const view = createMockView(90)
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 30 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(30)
  })

  it('should handle 45 degree rotation correctly', () => {
    const view = createMockView(45)
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 30 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(30)
    expect(result.y).toBeCloseTo(30)
  })

  it('should use default padding when not provided', () => {
    const view = createMockView()
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 5 }
    const options = { padding: NaN } as any

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(5)
  })

  it('should handle refPoint outside both ranges by returning center', () => {
    const view = createMockView()
    const magnet = createMockMagnet()
    const refPoint = { x: 10, y: 10 }
    const options = { padding: 20 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(50)
  })

  it('should work with different bbox sizes', () => {
    const view = createMockView(0, { x: 10, y: 10, width: 200, height: 200 })
    const magnet = createMockMagnet()
    const refPoint = { x: 110, y: 60 }
    const options = { padding: 10 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(110)
    expect(result.y).toBeCloseTo(60)
  })
})

describe('orth anchor edge cases', () => {
  it('should handle 180 degree rotation', () => {
    const view = createMockView(180)
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 30 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)
    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(30)
  })

  it('should handle 270 degree rotation', () => {
    const view = createMockView(270)
    const magnet = createMockMagnet()
    const refPoint = { x: 50, y: 30 }
    const options = { padding: 5 }

    const result = orth(view as any, magnet as any, refPoint as any, options)

    expect(result.x).toBeCloseTo(50)
    expect(result.y).toBeCloseTo(30)
  })
})
